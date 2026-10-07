if($('table.dataTable').length){
    $('table.dataTable').DataTable({
        /* responsive: true,
        columnDefs: [
            { orderable: false, targets: 6 },
        ] */
    });
}

var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
$.ajaxSetup({
    headers: {'X-CSRF-TOKEN': CSRF_TOKEN}
});

document.getElementById('uploadSchedule')?.addEventListener('click',function(e) {

    var permit_id = document.getElementById('permit_id').value;

    var schedule_id = document.getElementById('schedule_id').value;
    // var type = document.getElementById('type').value;
    var purpose_id = document.getElementById('purpose_id').value;

    var permit_number = document.getElementById('permit_number').value;
    var inspection_date = document.getElementById('inspection_date').value;
    var inspector_id = document.getElementById('inspector_id').value;
    e.target.disabled = true;

    var errorFlag = 0;

    if(permit_id == ""){
        document.getElementById('est_nameError').innerText = "\u24d8 " + "Required Field";
        errorFlag = 1
    }

    if(inspection_date == ""){
        document.getElementById('inspection_dateError').innerText = "\u24d8 " + "Required Field";
        errorFlag = 1
    }

    if(inspector_id == ""){
        document.getElementById('inspector_idError').innerText = "\u24d8 " + "Required Field";
        errorFlag = 1
    }
    if(purpose_id == ""){
        document.getElementById('purpose_idError').innerText = "\u24d8 " + "Required Field";
        errorFlag = 1
    }

    if(errorFlag == 1){

        e.target.disabled = false;
        return false;
    }


    var formData = new FormData();
    formData.append("permit_id",permit_id);
    formData.append("schedule_id",schedule_id);
    // formData.append("type",type);
    formData.append("purpose_id",purpose_id);

    formData.append('permit_number',permit_number);
    formData.append('inspection_date',inspection_date);
    formData.append('inspector_id',inspector_id);
    formData.append('_method',"POST");
    formData.append('_token',csrfToken);

    var xhr = new XMLHttpRequest();
    xhr.open("POST",createScheduleUrl,false);
    // xhr.setRequestHeader("Content-Type","application/json");
    xhr.setRequestHeader('X-CSRF-TOKEN',csrfToken);
    xhr.onload = function (){
        //console.log(this);
        if(this.status == 200){
            toastr.success("Schedule saved successfully!");
            window.location.href = schedule_url;
        }

        if(this.status == 500){
            toastr.error("Problem while uploading schedule!");
        }
    }
    xhr.send(formData);
    e.target.disabled = false;
    e.target.closest('form').reset();
});


$("#event" ).autocomplete({
    source: function( request, response ) {
        $('#id').val('');
        $.ajax({
            url: permit_search,
            type: 'POST',
            dataType: "JSON",
            data: {
                query: request.term,
                permit_type:3
            },
            success: function( data ) {
                // console.log(data)
                if(data.length>0)
                {
                    response($.map(data, function (item) {
                         return {
                            value: item.label,
                            permitId: item.id,
                            permit_number : item.permit_number,
                            location_of_event : item.location_of_event,
                            event_organizer : item.event_organizer,
                            cell_phone : item.cell_phone,
                            event_organizer_email : item.event_organizer_email,
                            name_of_food_booth : item.name_of_food_booth,
                            vendor_contact: item.vendor_contact,
                            vendor_cell_phone : item.vendor_cell_phone,
                            vendor_email: item.vendor_email,
                          
                        };
                    }));
                }
                else
                {
                    $('#permit_id').val('');
                    $('#permit_number').val('');
                    $('#event').val('');
                    $('#location_of_event').val('');
                    $('#event_organizer').val('');
                    $('#cell_phone').val('');
                    $('#event_organizer_email').val('');
                    $('#name_of_food_booth').val('');

                    $('#vendor_contact').val('');
                    $('#vendor_cell_phone').val('');
                    $('#vendor_email').val('');

                }
            }
        });
    },
    minLength: 2,
    select: function (event, ui) {
        if(ui.item.id == ''){
            $('#permit_id').val('');
            $('#permit_number').val('');
            $('#event').val('');
            $('#location_of_event').val('');
            $('#event_organizer').val('');
            $('#cell_phone').val('');
            $('#event_organizer_email').val('');
            $('#name_of_food_booth').val('');
            $('#vendor_contact').val('');
            $('#vendor_cell_phone').val('');
            $('#vendor_email').val('');



        }else{
            $('#permit_id').val(ui.item.permitId);
            $('#permit_number').val(ui.item.permit_number);
            $('#event').val(ui.item.label);
            $('#location_of_event').val(ui.item.location_of_event);
            $('#event_organizer').val(ui.item.event_organizer);
            $('#cell_phone').val(ui.item.cell_phone);
            $('#event_organizer_email').val(ui.item.event_organizer_email);
            $('#name_of_food_booth').val(ui.item.name_of_food_booth);

            $('#vendor_contact').val(ui.item.vendor_contact);
            $('#vendor_cell_phone').val(ui.item.vendor_cell_phone);
            $('#vendor_email').val(ui.item.vendor_email);

        }
        return false;
    }
});





function validateBasic(){
    var permit_fee_id = $('#permit_fee_id').val();
    $('#permit_fee_id').removeClass('border-danger');
    if(permit_fee_id == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please select Establishment Type'
        });
        $('#permit_fee_id').addClass(' border-danger');
        return false;
    }

    var fileDate = $('#permit_file_date').val();
    $('#permit_file_date').removeClass('border-danger');
    if(fileDate!=''){
        //alert(fileDate);
        if(!validateDateMDY(fileDate)){
            Swal.fire({
                icon: 'warning',
                title: 'Date Format is not valid'
            });
            $('#permit_file_date').addClass(' border-danger');
            return false;
        }
    }
    else {
        Swal.fire({
            icon: 'info',
            title: 'Please enter file date.'
        });
        $('#permit_file_date').addClass(' border-danger');
        return false;
    }

    var expirationDate = $('#permit_expiration_date').val();
    $('#permit_expiration_date').removeClass('border-danger');
    if(expirationDate!=''){
        if(!validateDateMDY(expirationDate)){
            Swal.fire({
                icon: 'warning',
                title: 'Date Format is not valid'
            });
            $('#permit_expiration_date').addClass(' border-danger');
            return false;
        }
    } else {
        /* Swal.fire({
            icon: 'info',
            title: 'Please enter expiration date.'
        });
        $('#permit_expiration_date').addClass(' border-danger');
        return false; */
    }

    var owner_name = $('#owner_name').val();
    $('#owner_name').removeClass('border-danger');
    if(owner_name == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please fill Owner Name'
        });
        $('#owner_name').addClass(' border-danger');
        return false;
    }

    var owner_email = $('input#owner_email').val();
    $('input#owner_email').removeClass('border-danger');
    if(owner_email !== '' && !isEmail(owner_email)){
        Swal.fire({
            icon: 'error',
            title: 'Email Format is not Correct'
        });
        $('input#owner_email').addClass(' border-danger');
        return false;
    }

    var territory_id = $('#territory_id').val();
    $('#territory_id').removeClass('border-danger');
    if(territory_id == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please select Territory'
        });
        $('#territory_id').addClass(' border-danger');
        return false;
    }

    var est_name = $('#est_name').val();
    $('#est_name').removeClass('border-danger');
    if(est_name == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please fill the Establishment Name'
        });
        $('#est_name').addClass(' border-danger');
        return false;
    }



    var mailing_address = $('#mailing_address').val();
    $('#mailing_address').removeClass('border-danger');
    if(mailing_address == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please fill The Mailing Address'
        });
        $('#mailing_address').addClass(' border-danger');
        return false;
    }

   /* var fmc_user_id = $('#fmc_user_id').val();
    $('#manager_name').removeClass('border-danger');
    if(fmc_user_id == ''){
        Swal.fire({
            icon: 'info',
            title: 'Please select Manager'
        });
        $('#manager_name').addClass(' border-danger');
        return false;
    }*/

    return true;
}



