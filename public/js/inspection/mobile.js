if ($('table.dataTable').length) {
    $('table.dataTable').DataTable({
        /* responsive: true,
        columnDefs: [
            { orderable: false, targets: 6 },
        ] */
    });
}

var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');
$.ajaxSetup({
    headers: { 'X-CSRF-TOKEN': CSRF_TOKEN }
});

var permit_id = $('input[type="hidden"]#id').val();
var permit_type_id = $('input#permit_type_id').val();
var permit_type = $('input[type="hidden"]#permit_type').val();
var permit_number = $('input#permit_number').val();
var permit_fee = $('input[type="hidden"]#permit_fee_amount_db').val();

$(document).ready(function () {

    $('button#btnTempAddMore').on({
        "mouseover": function () {
            $(this).addClass(' bg-info');
        },
        "mouseout": function () {
            $(this).removeClass(' bg-info');
        },
        "click": function () {
            var maxInspectionId = 0;
            $('div.tempRow').each(function () {
                var inspectionId = parseInt($(this).attr('data-item-id'));
                if (maxInspectionId < inspectionId) {
                    maxInspectionId = inspectionId;
                }
            });
            maxInspectionId++;
            var inspection = $('div[data-item-id = "1"].tempRow').clone();
            var newInspection = inspection.clone();
            newInspection.find('div.removeTemp').removeClass(' d-none');
            newInspection.find('input[name*=item_id]').val(maxInspectionId);
            newInspection.find('h6.temperature').text('Temperature_' + maxInspectionId);
            newInspection.find('input.location').attr("value", "");
            newInspection.find('input.temp').attr("value", "");
            newInspection.find('input.item').attr("value", "");


            var htmlToInsert = `<div class="row tempRow" data-item-id = "${maxInspectionId}">`;
            htmlToInsert += newInspection.html() + `</div>`;
            htmlToInsert = htmlToInsert.replace(/_1/g, "_" + maxInspectionId);
            $(htmlToInsert).insertBefore($(this));
        }
    });

    $('#finalSubmitBtn').click(function () {
        // if(!validateBasic()){
        //     return  false;
        // }inspectionForm
        // var myForm  = document.getElementById("inspectionForm");
        let errorFlag = 0;
        let errorMessage = "";
        var purposeId = $('#purpose_id').val();
        if (purposeId != 10 ||purposeId != 8) {
            document.querySelectorAll('.panel').forEach(function (panel, panelIndex) {
                let sectionId = panel.dataset.sectionid;

                let itemId = panel.getAttribute("data-itemId");
                let outBtnVal = panel.querySelector('button[id^="Outbtn"]')?.value;
                let cosBtnVal = panel.querySelector('button[id^="Cosbtn"]')?.value;
                let rBtnVal = panel.querySelector('button[id^="Rbtn"]')?.value;
                let inBtnVal = panel.querySelector('button[id^="Inbtn"]')?.value;
                let noBtnVal = panel.querySelector('button[id^="Nobtn"]')?.value;
                let naBtnVal = panel.querySelector('button[id^="Nabtn"]')?.value;

                if (sectionId == 1 && !(outBtnVal || inBtnVal || noBtnVal || naBtnVal || cosBtnVal || rBtnVal)
                    && errorFlag == 0) {
                    errorFlag = 1;
                    errorMessage = `Item 1 to 29 compulsory.`;
                    // toastr.error(errorMessage);
                    // return false;
                }
            });
            if (errorFlag == 1) {
                loadingWrapper.style.display = 'none';
                if (errorMessage) {
                    toastr.error(errorMessage);
                }
                return false;
            }
        }

        var formData = new FormData();
        formData.append('inspectionId', inspectionId);
        formData.append('reinspection', $('#reinspectionYes').is(':checked') ? 1 : 0);

        formData.append('followUp', $('#followUp').val());
        formData.append('createFrom', $('#create_from').val());

        formData.append('priority_item_due_date', $('#priority_item_due_date').val());
        formData.append('priority_foundation_due_date', $('#priority_foundation_due_date').val());
        formData.append('core_item_due_date', $('#core_item_due_date').val());


        formData.append('generalComment', $('#generalComment').val());
        formData.append('receivedSignatureDate', $('#receivedSignatureDate').val());
        formData.append('inspectedSignatureDate', $('#inspectedSignatureDate').val());
        formData.append('receivedBy', $('#receivedBy').val());
        formData.append('inspectedBy', $('#inspectedBy').val());
        formData.append('time_out', $('#time_out').val());



        if ($('input[name="_method"]').val() == 'POST' || $('input[name="_method"]').val() == 'PUT') {
            formData.append('receivedSignature', signaturePadReceived.toDataURL().split(',')[1]);
            formData.append('inspectedSignature', signaturePadInspected.toDataURL().split(',')[1]);
        }

        // formData.append('_token',$('input[name="_token"]').val());
        // formData.append('_method',$('input[name="_method"]').val());

        $.ajax({
            url: final_submit_url,
            type: 'POST',
            dataType: 'json',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            beforeSend: function () {
                $('#overlay').show();
            },
            success: function (response) {

                Swal.fire({
                    icon: 'success',
                    title: 'Inspection Upload Success'
                });
                window.location.href = inspection_url;

            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#overlay').hide();
                var error = jqXHR.responseJSON;
                var error_title = "";
                if (typeof error.message !== 'undefined') {
                    console.log(error.message);
                    error_title = 'Inspection save error:-' + errorThrown;
                }
                else {
                    error_title = 'Have some problem while saving permit, Please try again later';
                }

                Swal.fire({
                    icon: 'error',
                    title: error_title
                });

            }
        });

    });

    $('#inspectionDate').focusout(function () {
        var date = $(this).val();
        date = moment(date, 'MM/DD/YYYY').format('YYYY-MM-DD');
        var newDate = new Date(date);
        newDate.setDate(newDate.getDate() + 11);
        newDate = moment(newDate, 'YYYY-MM-DD').format('MM/DD/YYYY');
        $('#releaseDate').val(newDate);
    });

});
function removeTemperature(element) {
    element.closest('div.tempRow').remove();
}
var totalUploadedImg = 0;

$('input[type="file"].upload').each(function () {
    var image_name = $(this).closest('div.form-group').find('img').attr('src').split("/").pop();
    if (image_name.trim() != 'preview.png') {
        totalUploadedImg++;
    }
});

function setPreview(element) {
    if (element.files && element.files[0]) {
        var image_name = $(element).closest('div.form-group').find('img').attr('src').split("/").pop();
        var reader = new FileReader();

        reader.onload = function (e) {
            $(element).closest('div.form-group').find('img')
                .attr('src', e.target.result)
                .width(48)
                .height(48);
            $(element).closest('div.form-group').find('input[type="hidden"]').val("1");
        };
        reader.readAsDataURL(element.files[0]);


        if (image_name.trim() == 'preview.png' && totalUploadedImg < totalSupportedImages) {
            totalUploadedImg++;
        }

    }
}

function checkTotalImages(el) {
    var image_name = $(el).closest('div.form-group').find('img').attr('src').split("/").pop();
    if (image_name.trim() != 'preview.png' || totalUploadedImg < totalSupportedImages) {
        return true;
    }
    else {
        alert('maximum ' + totalSupportedImages + ' item images can be uploaded');
        return false;
    }


}
function removeImage(element) {
    element.parents('div.fileUploadContainer').find('img').attr('src', '../../../dist/img/preview.png');
    element.parents('div.fileUploadContainer').find('input[type="file"]').val("");
    element.parents('div.fileUploadContainer').find('input[type="hidden"]').val("0");

}
$('.img-wrap .close').on('click', function () {
    var id = $(this).closest('.img-wrap').find('img').data('id');
    alert('remove picture: ' + id);
});

function toggle(element, point) {
    var Oldclass = element.className.split(" ")[7];
    var name = element.name.split('_')[0];
    var clicked = false;
    const val = (Oldclass == 'btn-default') ? name.split('btn')[0].toUpperCase() : "";

    switch (name) {
        case 'Outbtn':
            //$(element).removeClass(Oldclass);
            if (Oldclass != 'btn-danger') {
                $(element).removeClass('btn-default');
                $(element).addClass('btn-danger');
                $(element).val(val);
            }
            else {
                $(element).removeClass('btn-danger');
                $(element).addClass('btn-default');
                $(element).val("");
            }
            $(element).siblings('button').removeClass('btn-success btn-secondary btn-primary btn-warning btn-info').addClass('btn-default');
            $(element).siblings('button').val("");

            break;
        case 'Inbtn':
            $(element).removeClass(Oldclass);
            if (Oldclass != 'btn-success') {
                $(element).removeClass('btn-default');
                $(element).addClass('btn-success');
                $(element).val(val);
            }
            else {
                $(element).removeClass('btn-success');
                $(element).addClass('btn-default');
                $(element).val("");
            }
            var out_btn_val = $(element).siblings('button[name*=Outbtn]')[0].value;
            $(element).siblings('button').removeClass('btn-danger btn-secondary btn-primary btn-warning btn-info').addClass('btn-default');
            $(element).siblings('button').val("");

            break;
        case 'Nobtn':
            $(element).removeClass(Oldclass);

            if (Oldclass != 'btn-primary') {
                $(element).removeClass('btn-default');
                $(element).addClass('btn-primary');
                $(element).val(val);
            }
            else {
                $(element).removeClass('btn-primary');
                $(element).addClass('btn-default');
                $(element).val("");
            }
            var out_btn_val = $(element).siblings('button[name*=Outbtn]')[0].value;
            $(element).siblings('button').removeClass('btn-danger btn-secondary btn-success btn-warning btn-info').addClass('btn-default');
            $(element).siblings('button').val("");

            break;
        case 'Nabtn':
            $(element).removeClass(Oldclass);
            if (Oldclass != 'btn-warning') {
                $(element).removeClass('btn-default');
                $(element).addClass('btn-warning');
                $(element).val(val);
            }
            else {
                $(element).removeClass('btn-warning');
                $(element).addClass('btn-default');
                $(element).val("");
            }
            var out_btn_val = $(element).siblings('button[name*=Outbtn]')[0].value;
            $(element).siblings('button').removeClass('btn-danger btn-secondary btn-success btn-primary btn-info').addClass('btn-default');
            $(element).siblings('button').val("");

            break;
        case 'Cosbtn':
            var out_btn_val = $(element).siblings('button[name*=Outbtn]')[0].value;
            if (out_btn_val != "") {
                $(element).removeClass(Oldclass);
                if (Oldclass != 'btn-secondary') {
                    $(element).removeClass('btn-default');
                    $(element).addClass('btn-secondary');
                    $(element).val(val);
                }
                else {
                    $(element).removeClass('btn-secondary');
                    $(element).addClass('btn-default');
                    $(element).val("");
                }
                // $(element).siblings('button[name*=Rbtn]').removeClass('btn-info').addClass('btn-default');
                // $(element).siblings('button[name*=Rbtn]').val("");
            }

            break;
        case 'Rbtn':
            var out_btn_val = $(element).siblings('button[name*=Outbtn]')[0].value;
            if (out_btn_val != "") {
                $(element).removeClass(Oldclass);
                if (Oldclass != 'btn-info') {
                    $(element).removeClass('btn-default');
                    $(element).addClass('btn-info');
                    $(element).val(val);
                }
                else {
                    $(element).removeClass('btn-info');
                    $(element).addClass('btn-default');
                    $(element).val("");
                }
                // $(element).siblings('button[name*=Cosbtn]').removeClass('btn-secondary').addClass('btn-default');
                // $(element).siblings('button[name*=Cosbtn]').val("");
            }

            break;
    }
}

function submitSectionWiseInspectionDetails() {
    // console.log(inspectionId);
    saveInspectionDetails(inspectionId);
}


function saveInspectionDetails(inspectionId) {
    // let logs = [];
    $('div.panel').each(function (index) {
        let logs = [];
        $(this).find('.violation_row').each(function () {
            const looping_id = $(this).data('violation-id');
            var i_id = $(this).attr('data-item-id');
            // console.log()
            // console.log(i_id,looping_id);

            const code = $(`#code_${i_id}_${looping_id}`).val();
            const comment = $(`#comment_${i_id}_${looping_id}`).val();
            const condition = $(`#condition_${i_id}_${looping_id}`).val();



            if (code || condition || comment) {
                //  console.log('code: '+code,'des: '+description,"con: "+condition);
                logs.push({
                    inspectionId: inspectionId,
                    i_id: i_id,
                    looping_id: looping_id,
                    code_id: code,
                    comment: comment,
                    condition: condition
                });

                // console.log(logs);
            }


        });

        var sectionId = $(this).attr('data-section-id');
        var item_id = $(this).attr('data-item-id');
        var point = $('#point_' + item_id)?.val();
        var out = $('#Outbtn_' + item_id)?.val();
        var inbtn = $('#Inbtn_' + item_id)?.val();
        var no = $('#Nobtn_' + item_id)?.val();
        var na = $('#Nabtn_' + item_id)?.val();
        var cos = $('#Cosbtn_' + item_id)?.val();
        var r = $('#Rbtn_' + item_id)?.val();

        // var comment = $('#comment_'+item_id).val();
        var index = index;
        // var codeId = $('#code_'+item_id).val();
        // var description = $('#description_'+item_id).val();
        // var condition = $('#condition_'+item_id).val();

        var image = $('#image_' + item_id)[0].files[0];

        console.log(sectionId);

        // if(sectionId == 1 && !(out || inbtn || no || na || cos || r )
        //     && errorFlag == 0){
        //     errorFlag = 1;
        //     errorMessage = `Item ${itemId} is compulsory.`;
        //     // toastr.error(errorMessage);
        // }

        var formData = new FormData();
        formData.append('inspectionId', inspectionId);
        formData.append('itemId', item_id);
        formData.append('point', point);

        formData.append('out', out);
        formData.append('in', inbtn);
        formData.append('no', no);
        formData.append('na', na);
        formData.append('cos', cos);
        formData.append('r', r);
        // formData.append('comment',comment);
        formData.append('index', index);

        // formData.append('code_id',codeId);
        // formData.append('description',description);
        formData.append('logs', JSON.stringify(logs));
        // if($('#image_'+item_id)[0].files.length > 0){
        formData.append('image', image);
        formData.append("hasFile", $("#hasFile_" + item_id).val());
        // }
        if ((image != '' && typeof image != 'undefined') || out != "" || (inbtn != "" && typeof inbtn != 'undefined') || (no != "" && typeof no != 'undefined')
            || (na != "" && typeof na != 'undefined') || (cos != "" && typeof cos != 'undefined') || (r != "" && typeof r != 'undefined') || (logs && Array.isArray(logs) && logs.length > 0)) {
            $.ajax({
                url: save_inspection_details,
                type: "POST",
                data: formData,
                dataType: "json",
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    loadingWrapper.style.display = 'block';
                },
                success: function (response) {
                    loadingWrapper.style.display = 'none';
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    var error = jqXHR.responseJSON;
                    var error_title = "";
                    if (typeof error.message !== 'undefined') {
                        console.log(error.message);
                        error_title = 'Inspection Details save error: ' + errorThrown;
                    }
                    else {
                        error_title = 'Have some problem while saving Abstruct and Surveys, Please try again later';
                    }

                    Swal.fire({
                        icon: 'error',
                        title: error_title
                    });
                }
            });
        }
    });
}



function showCodeDescription(e) {

    // var baseDesc = $(e.target).find('option:selected').data('data-base-description');
    // var itemId = $(e.target).find('option:selected').data('data-item-id');
    var itemId = e.target.options[e.target.selectedIndex].getAttribute("data-item-id");
    var baseDesc = e.target.options[e.target.selectedIndex].getAttribute("data-base-description");


    $("#description_" + itemId).val(baseDesc);
    // console.log("#description_" + itemId);
}

$("#est_name").autocomplete({
    source: function (request, response) {
        $('#id').val('');
        $.ajax({
            url: permit_search,
            type: 'POST',
            dataType: "JSON",
            data: {
                query: request.term,
                permit_type:2
            },
            success: function (data) {

                // console.log(data)
                if (data.length > 0) {
                    response($.map(data, function (item) {
                        return {
                            label: item.label + ' - ' + item.est_address,
                            value: item.label,
                            permitId: item.id,
                            permit_number: item.permit_number,
                            est_address: item.est_address,
                            est_city: item.est_city,
                            est_state: item.est_state,
                            est_zip: item.est_zip,
                            est_phone: item.est_phone,
                            contact: item.contact,
                            ownerName: item.ownerName,
                            ownerAddress: item.ownerAddress,
                            ownerCity: item.ownerCity,
                            ownerState: item.ownerState,
                            ownerZip: item.ownerZip,
                            ownerPhone: item.ownerPhone,
                        };
                    }));
                }
                else {
                    $('#permitId').val('');
                    $('#permit_number').val('');
                    $('#est_name').val('');
                    $('#est_address').val('');
                    $('#est_city').val('');
                    $('#est_state').val('');
                    $('#est_zip').val('');
                    $('#est_phone').val('');

                    $('#contact').val('');
                    $('#owner_name').val('');
                    $('#ownerAddress').val('');
                    $('#ownerCity').val('');
                    $('#ownerState').val('');
                    $('#ownerZip').val('');
                    $('#ownerPhone').val('');

                }
            }
        });
    },
    minLength: 2,
    select: function (event, ui) {
        if (ui.item.id == '') {
            $('#permitId').val('');
            $('#permit_number').val('');
            $('#est_name').val('');
            $('#est_address').val('');
            $('#est_city').val('');
            $('#est_state').val('');
            $('#est_zip').val('');
            $('#est_phone').val('');
            $('#contact').val('');
            $('#owner_name').val('');
            $('#ownerAddress').val('');
            $('#ownerCity').val('');
            $('#ownerState').val('');
            $('#ownerZip').val('');
            $('#ownerPhone').val('');


        } else {
            $('#permitId').val(ui.item.permitId);
            $('#permit_number').val(ui.item.permit_number);
            $('#est_name').val(ui.item.value);
            $('#est_address').val(ui.item.est_address);
            $('#est_city').val(ui.item.est_city);
            $('#est_state').val(ui.item.est_state);
            $('#est_zip').val(ui.item.est_zip);
            $('#est_phone').val(ui.item.est_phone);

            $('#contact').val(ui.item.contact);
            $('#owner_name').val(ui.item.ownerName);
            $('#ownerAddress').val(ui.item.ownerAddress);
            $('#ownerCity').val(ui.item.ownerCity);
            $('#ownerState').val(ui.item.ownerState);
            $('#ownerZip').val(ui.item.ownerZip);
            $('#ownerPhone').val(ui.item.ownerPhone);

        }
        return false;
    }
});





function validateBasic() {
    var permit_fee_id = $('#permit_fee_id').val();
    $('#permit_fee_id').removeClass('border-danger');
    if (permit_fee_id == '') {
        Swal.fire({
            icon: 'info',
            title: 'Please select Establishment Type'
        });
        $('#permit_fee_id').addClass(' border-danger');
        return false;
    }

    var fileDate = $('#permit_file_date').val();
    $('#permit_file_date').removeClass('border-danger');
    if (fileDate != '') {
        //alert(fileDate);
        if (!validateDateMDY(fileDate)) {
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
    if (expirationDate != '') {
        if (!validateDateMDY(expirationDate)) {
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
    if (owner_name == '') {
        Swal.fire({
            icon: 'info',
            title: 'Please fill Owner Name'
        });
        $('#owner_name').addClass(' border-danger');
        return false;
    }

    var owner_email = $('input#owner_email').val();
    $('input#owner_email').removeClass('border-danger');
    if (owner_email !== '' && !isEmail(owner_email)) {
        Swal.fire({
            icon: 'error',
            title: 'Email Format is not Correct'
        });
        $('input#owner_email').addClass(' border-danger');
        return false;
    }

    var territory_id = $('#territory_id').val();
    $('#territory_id').removeClass('border-danger');
    if (territory_id == '') {
        Swal.fire({
            icon: 'info',
            title: 'Please select Territory'
        });
        $('#territory_id').addClass(' border-danger');
        return false;
    }

    var est_name = $('#est_name').val();
    $('#est_name').removeClass('border-danger');
    if (est_name == '') {
        Swal.fire({
            icon: 'info',
            title: 'Please fill the Establishment Name'
        });
        $('#est_name').addClass(' border-danger');
        return false;
    }



    var mailing_address = $('#mailing_address').val();
    $('#mailing_address').removeClass('border-danger');
    if (mailing_address == '') {
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
var inspectionId = $('#inspectionId').val() || '';

function makeTabActiveById(id, currentPage) {
    // let errorFlag = 0;
    // let errorMessage = "";
    if (id == 2) {
        var est_name = $('#est_name').val();
        $('#est_name').removeClass('border-danger');
        if (est_name == '') {
            Swal.fire({
                icon: 'info',
                title: 'Please fill the Establishment Name'
            });
            $('#est_name').addClass(' border-danger');
            return false;
        }

        var inspection_date = $('#inspection_date').val();
        $('#inspection_date').removeClass('border-danger');
        if (inspection_date == '') {
            Swal.fire({
                icon: 'info',
                title: 'Please enter Inspection date.'
            });
            $('#inspection_date').addClass(' border-danger');
            return false;
        }





        var inspector_id = $('#inspector_id').val();
        $('#inspector_id').removeClass('border-danger');
        if (inspector_id == '') {
            Swal.fire({
                icon: 'info',
                title: 'Please select Inspector'
            });
            $('#inspector_id').addClass(' border-danger');
            return false;
        }



        var permitId = $('#permitId').val();
        $('#est_name').removeClass('border-danger');
        if (permitId == '') {
            Swal.fire({
                icon: 'info',
                title: 'Please Select Establishment Name'
            });
            $('#permitId').addClass(' border-danger');
            return false;
        }


        var purpose_id = $('#purpose_id').val();
        $('#purpose_id').removeClass('border-danger');
        if (purpose_id == '') {
            Swal.fire({
                icon: 'info',
                title: 'Please Select Inspection Purpose'
            });
            $('#purpose_id').addClass(' border-danger');
            return false;
        }









        if (id > currentPage) {

            var inspDateStr = $('#inspection_date').val();
            var inspDate = moment(inspDateStr, 'MM/DD/YYYY');

            if (inspDate.isValid()) {
                var priority_item_due_date = inspDate.clone().add(3, 'days').format('MM/DD/YYYY');
                var priority_foundation_due_date = inspDate.clone().add(10, 'days').format('MM/DD/YYYY');
                var core_item_due_date = inspDate.clone().add(90, 'days').format('MM/DD/YYYY');

                $('#priority_item_due_date').val(priority_item_due_date);
                $('#priority_foundation_due_date').val(priority_foundation_due_date);
                $('#core_item_due_date').val(core_item_due_date);
            } else {
                console.warn("Invalid inspection date");
                $('#priority_item_due_date, #priority_foundation_due_date, #core_item_due_date').val('');
            }

            // alert(inspDate);

            var formData = new FormData();
            formData.append('inspectionId', inspectionId);
            formData.append('permitId', $('#permitId').val());
            formData.append('permit_number', $('#permit_number').val());

            formData.append('est_name', $('#est_name').val());
            formData.append('owner_name', $('#owner_name').val());
            formData.append('est_address', $('#est_address').val());
            formData.append('est_phone', $('#est_phone').val());
            formData.append('time_in', $('#time_in').val());
            formData.append('person_in_charge', $('#person_in_charge').val());
            formData.append('inspection_date', $('#inspection_date').val());
            formData.append('inspector_id', $('#inspector_id').val());
            // formData.append('purpose_id', $('#purpose_id').val());
            formData.append('scheduleId', $('#scheduleId').val());
            formData.append('purpose_id', $('#purpose_id').val());
            formData.append('other_type', $('#other_type').val());

            formData.append('_token', $('input[name="_token"]').val());
            formData.append('_method', $('input[name="_method"]').val());

            $.ajax({
                url: inspection_save_url,
                type: 'POST',
                dataType: 'json',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                beforeSend: function () {
                    loadingWrapper.style.display = 'block';
                },
                success: function (response) {
                    // console.log(response.inspectionId);
                    inspectionId = response.inspectionId;
                    $('#inspectionId').val(inspectionId);
                    loadingWrapper.style.display = 'none';

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    $('#overlay').hide();
                    var error = jqXHR.responseJSON;
                    var error_title = "";
                    if (typeof error.message !== 'undefined') {
                        console.log(error.message);
                        error_title = 'Inspection save error:-' + errorThrown;
                    }
                    else {
                        error_title = 'Have some problem while saving Inspection, Please try again later';
                    }

                    Swal.fire({
                        icon: 'error',
                        title: error_title
                    });

                }
            });
        }
    } else if (id == 3) {
        if (id > currentPage) {
            saveInspectionDetails(inspectionId);
            // document.querySelectorAll('.panel').forEach(function(panel,panelIndex){
            //     let sectionId = panel.dataset.sectionid;
            //     let submitDetailsUrl = panel.closest('form').getAttribute("action");

            //     let itemId = panel.getAttribute("data-itemId");
            //     let outBtnVal = panel.querySelector('button[id^="Outbtn"]')?.value;
            //     let cosBtnVal = panel.querySelector('button[id^="Cosbtn"]')?.value;
            //     let rBtnVal = panel.querySelector('button[id^="Rbtn"]')?.value;
            //     let inBtnVal = panel.querySelector('button[id^="Inbtn"]')?.value;
            //     let noBtnVal = panel.querySelector('button[id^="Nobtn"]')?.value;
            //     let naBtnVal = panel.querySelector('button[id^="Nabtn"]')?.value;
            //     var point = $('#point_' + itemId).val();
            //     if(sectionId == 1 && !(outBtnVal || inBtnVal || noBtnVal || naBtnVal || cosBtnVal || rBtnVal )
            //         && errorFlag == 0){
            //         errorFlag = 1;
            //         errorMessage = `Item ${itemId} is compulsory.`;
            //         // toastr.error(errorMessage);
            //     }
            //     console.log(sectionId);

            //     let logs = [];
            //      document.querySelectorAll('.violation_row').forEach(function (e) {
            //         const looping_id = $(e).data('violation-id');
            //         var i_id = $(this).attr('data-item-id');
            //         // console.log()
            //         console.log(itemId,looping_id);
            //         const code = $(`#code_${itemId}_${looping_id}`).val();
            //         const condition = $(`#condition_${itemId}_${looping_id}`).val();
            //         const comment = $(`#comment_${itemId}_${looping_id}`).val();
            //         if (code || condition) {
            //             logs.push({
            //                 inspectionId: inspectionId,
            //                 i_id: itemId,
            //                 looping_id: looping_id,
            //                 code_id: code,
            //                 comment: comment,
            //                 condition: condition
            //             });
            //         }
            //     });

            //     if((outBtnVal || inBtnVal || noBtnVal || naBtnVal || rBtnVal || cosBtnVal ) && errorFlag == 0){
            //         let data = new FormData();
            //         data.append('inspectionId', inspectionId);
            //         data.append('itemId',itemId);
            //         data.append('point', point);
            //         data.append('out', outBtnVal);
            //         data.append('cos', cosBtnVal);
            //         data.append('r', rBtnVal);
            //         data.append('in', inBtnVal);
            //         data.append('no', noBtnVal);
            //         data.append('na', naBtnVal);
            //         data.append('index',panelIndex);
            //         let image = panel.querySelector('input[type="file"][id^="image_"]').files[0];
            //         data.append('image', image);
            //         // data.append('has_image', has_image);
            //         data.append('logs', JSON.stringify(logs));

            //         // console.log(submitDetailsUrl);
            //         let xhr = new XMLHttpRequest();
            //         xhr.open('POST',save_inspection_details,false);
            //         xhr.onload = function(){
            //             console.log(this.status);
            //             if (this.status == 200) {
            //                 let response = JSON.parse(this.responseText);  // Parse JSON response
            //                 // console.log(response.inspectionDetails);
            //                 // document.getElementById('insDetails').value = response.inspectionDetails;
            //             }else{
            //                 console.log(this.responseText);
            //                 toastr.error(this.responseText);
            //                 console.log(response.message);
            //             }
            //         };
            //         xhr.setRequestHeader("X-CSRF-TOKEN",csrfToken);
            //         xhr.send(data);
            //         panelIndex++;

            //     }
            // });
            setTimeout(function () {
                $('#overlay').hide();
            }, 5000);
        }
    } else if (id == 4) {
        if (id > currentPage) {
             $('#inspId').val(inspectionId);
            saveNewFoodTemp(inspectionId);
            setTimeout(function () {
                $('#overlay').hide();
            }, 5000);
        }
    }else if (id == 5) {
        if (id > currentPage) {
            $('#inspId').val(inspectionId);

            saveGenComment(inspectionId);


            setTimeout(function () {
                $('#overlay').hide();
            }, 5000);
        }
    }else {

    }
    $('#navTabLi' + id + '>a').removeClass('disabled');
    var nextTab;
    $('.nav-link').map(function (element) {
        if ($(this).hasClass("active")) {
            nextTab = $('#navTabLi' + id)
        }
    });
    nextTab.find('a').trigger('click');
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

if ($('input[name="_method"]').val() == 'POST' || $('input[name="_method"]').val() == 'PUT') {
    var received = document.getElementById("receivedSignature");
    var receivedclearButton = received.querySelector("[data-action=clear]");
    var receivedCanvas = received.querySelector("canvas");
    var signaturePadReceived;
    signaturePadReceived = new SignaturePad(receivedCanvas);
    receivedclearButton.addEventListener("click", function (event) {
        signaturePadReceived.clear();
    });

    var inspected = document.getElementById("inspectedSignature");
    var inspectedclearButton = inspected.querySelector("[data-action=clear]");
    var inspectedCanvas = inspected.querySelector("canvas");
    var signaturePadInspected;
    signaturePadInspected = new SignaturePad(inspectedCanvas);
    inspectedclearButton.addEventListener("click", function (event) {
        signaturePadInspected.clear();
    });
}

function saveNewFoodTemp(inspection_id) {
    // console.log(inspection_id);
    var itemArray = $('input[name="item[]"]').map(function () {
        return this.value;
    }).get();


    var locationArray = $('input[name="location[]"]').map(function () {
        return this.value;
    }).get();

    var tempArray = $('input[name="temp[]"]').map(function () {
        return this.value;
    }).get();


    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url: food_temperature_submit_route,
        type: "POST",
        data: {
            inspection_id: inspection_id,
            locations: locationArray,
            temps: tempArray,
            item: itemArray,
        },
        success: function (data) {

            $('#priority_item_due_date').val(data.inspectionPDate);
            $('#priority_foundation_due_date').val(data.inspectionPFDate);
            $('#core_item_due_date').val(data.inspectionCDate);
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error);
        }
    }).done(function () {

    });

}

// $('#other_type_div').hide();
$('#purpose_id').on('change', function () {
    if ($('#purpose_id').val() == '4') {
        $('#other_type_div').show();
    } else {
        $('#other_type_div').hide();
    }
});



$(document).on('click', '.btnAddviolation', function () {
    const itemId = $(this).data('item-id');

    // Get all logs for this item
    const logRows = $(`.violation_row[data-item-id="${itemId}"]`);
    const logCount = logRows.length;

    // Enforce max 10 logs per item
    if (logCount >= 10) {
        Swal.fire({
            icon: 'warning',
            title: 'Limit Reached',
            text: 'You can add a maximum of 10 logs for this item.'
        });
        return;
    }

    const newLogNumber = logCount + 1;
    const originalRow = logRows.first();
    const newRow = originalRow.clone();

    // Update attributes
    newRow.attr('data-violation-id', newLogNumber);

    newRow.find('select[id^="code_"]').each(function () {
        $(this).attr('id', `code_${itemId}_${newLogNumber}`)
            .attr('name', `code_${itemId}_${newLogNumber}`)
            .val('');
    });

    // newRow.find('input[id^="description_"]').each(function () {
    //     $(this).attr('id', `description_${itemId}_${newLogNumber}`)
    //            .attr('name', `description_${itemId}_${newLogNumber}`)
    //            .val('');
    // });

    newRow.find('select[id^="condition_"]').each(function () {
        $(this).attr('id', `condition_${itemId}_${newLogNumber}`)
            .attr('name', `condition_${itemId}_${newLogNumber}`)
            .val('');
    });

    newRow.find('textarea[id^="comment_"]').each(function () {
        $(this).attr('id', `comment_${itemId}_${newLogNumber}`)
            .attr('name', `comment_${itemId}_${newLogNumber}`)
            .val('');
    });

    // Enable delete button
    // newRow.find('.delete_log').addClass('d-none');


    if (newLogNumber > 1) {
        console.log(newLogNumber);
        newRow.find('.delete_log').removeClass('d-none'); // or ensure it's visible
        newRow.find('.remove_log').attr('data-violation-id', newLogNumber);
    } else {
        newRow.find('.delete_log').addClass('d-none'); // hide it if <=1
    }



    // Insert after last log row for this item
    logRows.last().after(newRow);



});


// $(document).on('click', '.remove_log', function () {
//     $(this).closest('.violation_row').remove();
// });


let removeActiveLog = (element) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            var data_vio_id = element.attr("data-violation-id");
            $('div[data-violation-id="' + data_vio_id + '"].row').remove();
        }

    });

}


function saveGenComment(inspection_id){

    console.log(editor.getData());
    var formData = new FormData();
    formData.append('insp_id', inspection_id);
    formData.append('comment', editor.getData());


    formData.append('_token', $('input[name="_token"]').val());
    formData.append('_method', 'POST');

    $.ajax({
        url: save_comment,
        type: 'POST',
        dataType: 'json',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function () {
            $('#overlay').show();
        },
        success: function (response) {
            // console.log(response.inspectionId);
            inspectionId = response.inspectionId;
            $('#overlay').hide();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('#overlay').hide();
            var error = jqXHR.responseJSON;
            var error_title = "";
            if (typeof error.message !== 'undefined') {
                console.log(error.message);
                error_title = 'Inspection save error:-' + errorThrown;
            }
            else {
                error_title = 'Have some problem while saving Inspection, Please try again later';
            }

            Swal.fire({
                icon: 'error',
                title: error_title
            });

        }
    });

}

