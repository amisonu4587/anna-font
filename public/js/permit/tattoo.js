

if(document.getElementById('inspection_date') != null){
    $('#inspection_date').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minDate: new Date(),
        maxYear: parseInt(moment().format('YYYY')) + 4,
        autoUpdateInput: false,
        applyButtonClasses: 'btn-info rounded-0',
    });
    $('#inspection_date').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('L'));
    });
    $('#inspection_date').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    });
}




var applicant = document.getElementById("applicantSignature");

console.log(applicant);
if(applicant!=null) {
    var applicantclearButton = applicant.querySelector("[data-action=clear]");
    var applicantCanvas = applicant.querySelector("canvas");
    var signaturePadApplicant;
    signaturePadApplicant = new SignaturePad(applicantCanvas);
    applicantclearButton.addEventListener("click", function (event) {
        signaturePadApplicant.clear();
        document.getElementById("applicantSignatureBase64").value = "";
    });

    // applicantCanvas.addEventListener("mouseout", function (event) {
    //     //alert("Please enter");
    //     document.getElementById("applicantSignatureBase64").value = signaturePadApplicant.toDataURL().split(',')[1]
    // });
    function updateApplicantSignature() {

        document.getElementById("applicantSignatureBase64").value = signaturePadApplicant.toDataURL().split(',')[1]
    }
    applicantCanvas.addEventListener("mouseout", updateApplicantSignature);
    applicantCanvas.addEventListener("touchend", updateApplicantSignature);

}



$('#sameAddresscheck').change(function (){
    let ischecked = $(this).is(':checked');
    let est_mailing_address = $('#est_mailing_address').val();
    let est_mailing_city = $('#est_mailing_city').val();
    let est_mailing_state = $('#est_mailing_state').val();
    let est_mailing_zip = $('#est_mailing_zip').val();

    if(!ischecked){
        $('#est_billing_address').val('');
        $('#est_billing_city').val('');
        $('#est_billing_state').val('');
        $('#est_billing_zip').val('');
    }else{
        $('#est_billing_address').val(est_mailing_address);
        $('#est_billing_city').val(est_mailing_city);
        $('#est_billing_state').val(est_mailing_state);
        $('#est_billing_zip').val(est_mailing_zip);
    }

});


$('#sameOwnercheck').change(function (){
    let ischecked = $(this).is(':checked');
    let owner_name = $('#owner_name').val();
    let owner_phone = $('#owner_phone').val();
    let owner_email = $('#owner_email').val();

    if(!ischecked){
        $('#onsite_manager').val('');
        $('#manager_phone').val('');
        $('#manager_email').val('');
    }else{
        $('#onsite_manager').val(owner_name);
        $('#manager_phone').val(owner_phone);
        $('#manager_email').val(owner_email);
    }

});




$('#hoursOfOperation').change(function (){
    let ischecked = $(this).is(':checked');
    let dayTime = $('#dayTime_0').val();

    // console.log(dayTime);

    if(!ischecked){

        $('#dayTime_1').val('');
        $('#dayTime_2').val('');
        $('#dayTime_3').val('');
        $('#dayTime_4').val('');
        $('#dayTime_5').val('');
        $('#dayTime_6').val('');

    }else{
        $('#dayTime_1').val(dayTime);
        $('#dayTime_2').val(dayTime);
        $('#dayTime_3').val(dayTime);
        $('#dayTime_4').val(dayTime);
        $('#dayTime_5').val(dayTime);
        $('#dayTime_6').val(dayTime);
    }

});







$(document).ready(function () {
   
    $('#savePermitApplicationBtn').on('click', function (e) {
        // alert('fg');
            saveTattooPermitApplication();

    });
});

function isCanvasBlank(canvas) {
    return !canvas.getContext('2d')
    .getImageData(0, 0, canvas.width, canvas.height).data
    .some(channel => channel !== 0);
}


function saveTattooPermitApplication(){
    if (!validateTattooPermitApplication()) {
        return false;
    }

    var submitPermitApplicationUrl = document.getElementById('permitApplicationForm').getAttribute("action");
    var formData = new FormData();

    // Handle input fields
    document.querySelectorAll('input').forEach(element => {
        let type = element.getAttribute("type");
        let name = element.getAttribute("name");
        if (!name) return; // skip inputs with no name

        if (type === "text" || type === "hidden" || type === "number") {
            formData.append(name, element.value);
        } else if (type === "checkbox") {
            formData.append(name, element.checked ? 1 : 0);
        } else if (type === "file") {
            formData.append(name, element.files[0]);
        }
    });

    // Handle select fields (outside the input loop)
    document.querySelectorAll('select').forEach(element => {
        let name = element.getAttribute("name");
        if (!name) return;
        formData.append(name, $('#' + element.getAttribute("id")).val());
    });
    document.querySelectorAll('textarea').forEach(element => {
        let name = element.getAttribute("name");
        if (!name) return;
        formData.append(name, $('#' + element.getAttribute("id")).val());
    });
    formData.append('_token', $('input[name="_token"]').val());
    formData.append('_method', $('input[name="_method"]').val());

    $.ajax({
        type: "POST",
        url: submitPermitApplicationUrl,
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function () {
            $('div#loading-wrapper').show();
        },
        success: function (data) {
            toastr.success(data.message);
            setTimeout(() => {
                window.location.href = redirectUrl;
            }, 2000);
        },
        error: function (error) {
            setTimeout(() => {
                toastr.error(error.responseJSON?.message || "Something went wrong.");
            }, 775);
        },
        complete: function () {
            $('div#loading-wrapper').hide();
            $('#spin').hide();
            $('#saveicon').show();
        }
    });
}



function validateTattooPermitApplication(){
    var flg = 0;


    var fee_id = $('#fee_id').val();
    if(fee_id == ""){
        $('#fee_id_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#fee_id_error').html("");
        }, 5000)
        flg = 1;
    }


    var non_profit = $('#non_profit').val();
    if(non_profit == ""){
        $('#non_profit_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#non_profit_error').html("");
        }, 5000)
        flg = 1;
    }


    var application_type_id = $('#application_type_id').val();
    if(application_type_id == ""){
        $('#application_type_id_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#application_type_id_error').html("");
        }, 5000)
        flg = 1;
    }

    // var non_profit = $('#non_profit').val();
    // if(non_profit == ""){
    //     $('#non_profit_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#non_profit_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }

    var est_name = $('#est_name').val();
    if(est_name == ""){
        $('#est_name_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_name_error').html("");
        }, 5000)
        flg = 1;
    }

    var est_mailing_address = $('#est_mailing_address').val();
    if(est_mailing_address == ""){
        $('#est_mailing_address_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_mailing_address_error').html("");
        }, 5000)
        flg = 1;
    }

    var est_mailing_city = $('#est_mailing_city').val();
    if(est_mailing_city == ""){
        $('#est_mailing_city_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_mailing_city_error').html("");
        }, 5000)
        flg = 1;
    }

    var est_mailing_state = $('#est_mailing_state').val();
    if(est_mailing_state == ""){
        $('#est_mailing_state_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_mailing_state_error').html("");
        }, 5000)
        flg = 1;
    }

    var est_mailing_zip = $('#est_mailing_zip').val();
    if(est_mailing_zip == ""){
        $('#est_mailing_zip_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_mailing_zip_error').html("");
        }, 5000)
        flg = 1;
    }

    var est_phone = $('#est_phone').val();
    if(est_phone == ""){
        $('#est_phone_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_phone_error').html("");
        }, 5000)
        flg = 1;
    }


    var est_email = $('#est_email').val();
    if(est_email == ""){
        $('#est_email_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_email_error').html("");
        }, 5000)
        flg = 1;
    }



    var est_billing_address = $('#est_billing_address').val();
    if(est_billing_address == ""){
        $('#est_billing_address_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_billing_address_error').html("");
        }, 5000)
        flg = 1;
    }
    var est_billing_city = $('#est_billing_city').val();
    if(est_billing_city == ""){
        $('#est_billing_city_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_billing_city_error').html("");
        }, 5000)
        flg = 1;
    }
    var est_billing_state = $('#est_billing_state').val();
    if(est_billing_state == ""){
        $('#est_billing_state_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_billing_state_error').html("");
        }, 5000)
        flg = 1;
    }
    var est_billing_state = $('#est_billing_state').val();
    if(est_billing_state == ""){
        $('#est_billing_state_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_billing_state_error').html("");
        }, 5000)
        flg = 1;
    }
    var est_billing_zip = $('#est_billing_zip').val();
    if(est_billing_zip == ""){
        $('#est_billing_zip_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_billing_zip_error').html("");
        }, 5000)
        flg = 1;
    }
    var seating_capacity = $('#seating_capacity').val();
    if(seating_capacity == ""){
        $('#seating_capacity_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#seating_capacity_error').html("");
        }, 5000)
        flg = 1;
    }
    // var days_of_operation = $('#days_of_operation').val();
    // if(days_of_operation == ""){
    //     $('#days_of_operation_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#days_of_operation_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }





    var owner_name = $('#owner_name').val();
    if(owner_name == ""){
        $('#owner_name_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_name_error').html("");
        }, 5000)
        flg = 1;
    }

    var owner_address = $('#owner_address').val();
    if(owner_address == ""){
        $('#owner_address_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_address_error').html("");
        }, 5000)
        flg = 1;
    }

    var owner_phone = $('#owner_phone').val();
    if(owner_phone == ""){
        $('#owner_phone_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_phone_error').html("");
        }, 5000)
        flg = 1;
    }



    var owner_city = $('#owner_city').val();
    if(owner_city == ""){
        $('#owner_city_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_city_error').html("");
        }, 5000)
        flg = 1;
    }

    var owner_state = $('#owner_state').val();
    if(owner_state == ""){
        $('#owner_state_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_state_error').html("");
        }, 5000)
        flg = 1;
    }
    var owner_zip = $('#owner_zip').val();
    if(owner_zip == ""){
        $('#owner_zip_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_zip_error').html("");
        }, 5000)
        flg = 1;
    }
    var owner_email = $('#owner_email').val();
    if(owner_email == ""){
        $('#owner_email_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_email_error').html("");
        }, 5000)
        flg = 1;
    }else{
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        var email = emailRegex.test(owner_email);
        console.log(email);
        if(!email){
            $('#owner_email_error').text("ⓘ Invalid email");
            setTimeout(() => {
                $('#owner_email_error').html("");
            }, 5000)
            flg = 1;
        }

    }


    var onsite_manager = $('#onsite_manager').val();
    if(onsite_manager == ""){
        $('#onsite_manager_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#onsite_manager_error').html("");
        }, 5000)
        flg = 1;
    }


    var applicant_signature_date = $('#applicant_signature_date').val();
    if(applicant_signature_date == ""){
        $('#applicant_signature_date_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#applicant_signature_date_error').html("");
        }, 5000)
        flg = 1;
    }

    if(document.querySelector('input[name="_method"]').value == 'POST'){
        var applicationInPersonCheck = $('#applicationInPersonCheck').is(':checked') ? 1 : 0;
        // console.log(applicationInPersonCheck);
        if(applicationInPersonCheck == 0)
        {
            if(isCanvasBlank(applicantCanvas)){
                toastr.error("Please fill the signatures before submitting");
                flg = 1;
            }
        }

    }
    if (flg == 1) { return false; }
    else { return true; }
}


function changRetailFoodStatus(status,element){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(function(result){
        if(result.value)
        {


            loadingWrapper.style.display = 'block';
            let permit_id = document.getElementById("id").value;
            let permit_type_id = document.getElementById("permit_type_id").value;

            let url = updatePermitApplicationStatusUrl.replace(':permit_id',permit_id).replace(':permit_type_id',permit_type_id);
            let xhr = new XMLHttpRequest();
            xhr.open("POST",url);
            xhr.setRequestHeader("X-CSRF-TOKEN",csrfToken);
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xhr.onload = function(e){
                let response = JSON.parse(this.responseText);
                if(this.status == 200)
                {
                    toastr.success(response.message);
                    let nextFieldSet = element.closest('fieldset').nextElementSibling;
                    nextFieldSet?.classList.remove('hideOnLoad');
                    element.closest('fieldset').classList.add('hideOnLoad');
                    let progressBar = document.getElementById('progressbar');
                    progressBar.querySelector("li#"+status).classList.add("active", "text-success");
                    window.location.reload();
                }
                else{
                    toastr.error(response.message);
                }

                loadingWrapper.style.display = 'none';
            }
            xhr.send(`permit_status=${status}`);


        }

    });
}

function editSchedule(schedule){
    let scheduleModal = document.getElementById('scheduleUploadModal');
    let inspectionDate = schedule.inspection_date;
    let inspectionDateObj = new Date(inspectionDate);
    let dt = inspectionDateObj.getDate();
    let month = inspectionDateObj.getMonth() + 1;
    let year = inspectionDateObj.getFullYear();
    if(dt < 10){
        dt = '0' + dt;
    }

    if(month < 10 ){
        month = '0' + month;
    }

    let dateString = month + '/' + dt + '/' + year;
    scheduleModal.querySelector('#inspection_date').value = dateString;
    scheduleModal.querySelector('#schedule_id').value = schedule.id;
    scheduleModal.querySelector('#purpose_id').value = schedule.purpose_id;

    scheduleModal.querySelector('#inspector_id').value = schedule.inspector_id;
    $('#scheduleUploadModal').modal('show');

}

$('.modal').on('hidden.bs.modal', function (e) {
    this.querySelector('form').reset();
    this.querySelector('input[type="hidden"]').value = '';
    this.querySelectorAll('button.panelButton').forEach((item,index)=>{
        item.classList.remove('btn-warning','btn-info','btn-success','btn-danger','btn-primary');
        item.classList.add('btn-default');
    });
  })


   $('button#btnFacilityType1AddMore').on('click', function () {
    var maxId = 0;
    $('.facilityTypeRow').each(function () {
        var currentId = parseInt($(this).attr('data-item-id'));
        if (maxId < currentId) maxId = currentId;
    });
    maxId++;

    // Clone the base row
    var newRow = $('div[data-item-id="1"].facilityTypeRow').clone(false, false);
    newRow.attr('data-item-id', maxId);

    // Reset inputs
    newRow.find('input, select').each(function () {
        let oldId = $(this).attr('id');
        if (oldId) $(this).attr('id', oldId.replace(/\d+$/, maxId));
        $(this).val('');
    });

    // Remove old daterangepicker data (important)
    newRow.find('.dateField')
        .removeClass('hasDatepicker')
        .removeAttr('data-original-title')
        .off() // remove events
        .removeData();

    // Show remove button
    newRow.find('.removeBtn').removeClass('d-none');

    // Insert before button
    newRow.insertBefore($('#btnFacilityType1AddMore'));

    // ✅ Reinitialize daterangepicker for this new field
    newRow.find('.dateField').attr("readonly", true).daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minYear: 2016,
        maxYear: parseInt(moment().format('YYYY')) + 4,
        autoUpdateInput: false,
        applyButtonClasses: 'btn-info rounded-0',
    }).on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('L'));
    }).on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
    });
});
function removeRow(element) {
    element.closest('div.facilityTypeRow')?.remove();
    facilityTypePrimary(element);
}



