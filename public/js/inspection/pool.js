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
        console.log(inspectionId);
        // if(!validateBasic()){
        //     return  false;
        // }inspectionForm
        // var myForm  = document.getElementById("inspectionForm");
        let errorFlag = 0;
        let errorMessage = "";

        var formData = new FormData();
        formData.append('inspectionId', inspectionId);
        formData.append('receivedSignatureDate', $('#receivedSignatureDate').val());
        formData.append('inspectedSignatureDate', $('#inspectedSignatureDate').val());
        formData.append('receivedBy', $('#receivedBy').val());
        formData.append('inspectedBy', $('#inspectedBy').val());
        formData.append('time_out', $('#time_out').val());
        formData.append('followUp', $('#followUp').val());
        formData.append('reinspection', $('#reinspectionYes').is(':checked') ? 1 : 0);



        if ($('input[name="_method"]').val() == 'POST' || $('input[name="_method"]').val() == 'PUT') {
            formData.append('receivedSignature', signaturePadReceived.toDataURL().split(',')[1]);
            formData.append('inspectedSignature', signaturePadInspected.toDataURL().split(',')[1]);
        }

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

    var $btn = $(element);
    var name = element.name.split('_')[0];

    // Determine active class based on button type
    var activeClass = '';

    switch (name) {
        case 'Sbtn':
            activeClass = 'btn-success';
            break;

        case 'Ubtn':
            activeClass = 'btn-danger';
            break;

        case 'Nabtn':
            activeClass = 'btn-warning';
            break;

        default:
            return;
    }

    var isActive = $btn.hasClass(activeClass);

    // 🔥 Reset all sibling buttons first
    $btn.siblings('button')
        .removeClass('btn-success btn-danger btn-warning btn-primary btn-info btn-secondary')
        .addClass('btn-default')
        .val("");

    if (isActive) {
        // If clicked again → deactivate
        $btn.removeClass(activeClass)
            .addClass('btn-default')
            .val("");
    } else {
        // Activate this button
        $btn.removeClass('btn-default')
            .addClass(activeClass)
            .val(name.replace('btn', '').toUpperCase());
    }
}

function submitSectionWiseInspectionDetails() {
    saveInspectionDetails(inspectionId);
}

function saveInspectionDetails(inspectionId) {
    $('div.insPanel').each(function (index) {
        var item_id = $(this).attr('data-item-id');
        var point = $('#point_' + item_id).val();
        var s = $('#Sbtn_' + item_id).val();
        var u = $('#Ubtn_' + item_id).val();
        var na = $('#Nabtn_' + item_id).val();
        var comment = $('#comment_' + item_id).val();


        var index = index;

        var image = $('#image_' + item_id)[0].files[0];

        var formData = new FormData();
        formData.append('inspectionId', inspectionId);
        formData.append('itemId', item_id);
        formData.append('point', point);

        formData.append('s', s);
        formData.append('u', u);
        formData.append('na', na);
        formData.append('index', index);
        formData.append('comment', comment);
        formData.append('image', image);
        formData.append("hasFile", $("#hasFile_" + item_id).val());

        if ((image != '' && typeof image != 'undefined') || (s != "" && typeof s != 'undefined') || (u != "" && typeof u != 'undefined')
            || (na != "" && typeof na != 'undefined') || (comment != "" && typeof comment != 'undefined')) {
            console.log(index);
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

                    let title = 'Error';
                    let message = 'Something went wrong. Please try again later.';

                    // Laravel JSON error response
                    if (jqXHR.responseJSON) {

                        if (jqXHR.responseJSON.message) {
                            message = jqXHR.responseJSON.message;
                        }

                        // Laravel validation errors
                        if (jqXHR.responseJSON.errors) {
                            message = Object.values(jqXHR.responseJSON.errors)
                                .flat()
                                .join('<br>');
                        }
                    }
                    // Non-JSON error (HTML / server error)
                    else if (jqXHR.responseText) {
                        message = jqXHR.responseText;
                    }

                    Swal.fire({
                        icon: 'error',
                        title: 'Inspection Details Save Error',
                        html: message
                    });
                }

            });
        }
    });
}

function showCodeDescription(e) {

    var itemId = e.target.options[e.target.selectedIndex].getAttribute("data-item-id");
    var baseDesc = e.target.options[e.target.selectedIndex].getAttribute("data-base-description");
    $("#description_" + itemId).val(baseDesc);
}

$("#pool_name").autocomplete({
    source: function (request, response) {
        $('#id').val('');
        $.ajax({
            url: permit_search,
            type: 'POST',
            dataType: "JSON",
            data: {
                query: request.term,
                permit_type: 6
            },
            success: function (data) {

                console.log(data)
                if (data.length > 0) {
                    response($.map(data, function (item) {
                        return {
                            label: item.pool_name,
                            value: item.label,
                            permitId: item.id,
                            permit_number: item.permit_number,
                            pool_address: item.pool_address,
                            est_city: item.est_city,
                            est_state: item.est_state,
                            est_zip: item.est_zip,
                            business_phone: item.business_phone,
                            contact: item.contact,
                            owner_name: item.owner_name,
                            ownerAddress: item.ownerAddress,
                            ownerCity: item.ownerCity,
                            ownerState: item.ownerState,
                            ownerZip: item.ownerZip,
                            ownerPhone: item.ownerPhone,
                            other_services: item.other_services,
                            services: item.services
                        };
                    }));
                }
                else {
                    $('#permitId').val('');
                    $('#permit_number').val('');
                    $('#pool_name').val('');
                    $('#pool_address').val('');
                    $('#est_city').val('');
                    $('#est_state').val('');
                    $('#est_zip').val('');
                    $('#business_phone').val('');

                    $('#contact').val('');
                    $('#owner_name').val('');
                    $('#ownerAddress').val('');
                    $('#ownerCity').val('');
                    $('#ownerState').val('');
                    $('#ownerZip').val('');
                    $('#ownerPhone').val('');
                    $('#other_service').val('');
                }
            }
        });
    },
    minLength: 2,
    select: function (event, ui) {
        if (ui.item.id == '') {
            $('#permitId').val('');
            $('#permit_number').val('');
            $('#pool_name').val('');
            $('#pool_address').val('');
            $('#est_city').val('');
            $('#est_state').val('');
            $('#est_zip').val('');
            $('#business_phone').val('');
            $('#contact').val('');
            $('#owner_name').val('');
            $('#ownerAddress').val('');
            $('#ownerCity').val('');
            $('#ownerState').val('');
            $('#ownerZip').val('');
            $('#ownerPhone').val('');
            $('#other_service').val('');

        } else {
            $('#permitId').val(ui.item.permitId);
            $('#permit_number').val(ui.item.permit_number);
            $('#pool_name').val(ui.item.value);
            $('#pool_address').val(ui.item.pool_address);
            $('#est_city').val(ui.item.est_city);
            $('#est_state').val(ui.item.est_state);
            $('#est_zip').val(ui.item.est_zip);
            $('#business_phone').val(ui.item.business_phone);

            $('#contact').val(ui.item.contact);
            $('#owner_name').val(ui.item.owner_name);
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

    if (id == 2) {
        var pool_name = $('#pool_name').val();
        $('#pool_name').removeClass('border-danger');
        if (pool_name == '') {
            Swal.fire({
                icon: 'info',
                title: 'Please fill the Pool Name'
            });
            $('#pool_name').addClass(' border-danger');
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

        // var permitId = $('#permitId').val();
        // $('#est_name').removeClass('border-danger');
        // if (permitId == '') {
        //     Swal.fire({
        //         icon: 'info',
        //         title: 'Please Select Establishment Name'
        //     });
        //     $('#permitId').addClass(' border-danger');
        //     return false;
        // }

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

            // alert(inspDate);

            var formData = new FormData();
            formData.append('inspectionId', inspectionId);
            formData.append('permitId', $('#permitId').val());
            formData.append('permit_number', $('#permit_number').val());

            formData.append('pool_name', $('#pool_name').val());
            formData.append('owner_name', $('#owner_name').val());
            formData.append('pool_address', $('#pool_address').val());
            formData.append('business_phone', $('#business_phone').val());
            formData.append('time_in', $('#time_in').val());
            formData.append('person_in_charge', $('#person_in_charge').val());
            formData.append('inspection_date', $('#inspection_date').val());
            formData.append('inspector_id', $('#inspector_id').val());
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
                    $('#overlay').show();
                },
                success: function (response) {
                    // console.log(response.inspectionId);
                    inspectionId = response.inspectionId;
                    $('#inspectionId').val(inspectionId);
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
    } else if (id == 3) {
        if (id > currentPage) {
            // console.log(inspectionId)
            saveInspectionDetails(inspectionId);

            setTimeout(function () {
                loadingWrapper.style.display = 'none';

            }, 2000);
        }
    } else if (id == 4) {
        if (id > currentPage) {

            savePoolOtherInformation(inspectionId);


            setTimeout(function () {
                $('#overlay').hide();
            }, 5000);
        }
    } else if (id == 5) {
        if (id > currentPage) {
            $('#inspId').val(inspectionId);

            saveGenComment(inspectionId);


            setTimeout(function () {
                $('#overlay').hide();
            }, 5000);
        }
    } else {

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

function saveGenComment(inspection_id) {

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
        url: pool_temperature_submit_route,
        type: "POST",
        data: {
            inspection_id: inspection_id,
            locations: locationArray,
            temps: tempArray,
            item: itemArray,
        },
        success: function (data) {
            // $('#priority_item_due_date').val(data.inspectionPDate);
            // $('#priority_foundation_due_date').val(data.inspectionPFDate);
            // $('#core_item_due_date').val(data.inspectionCDate);
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error);
        }
    }).done(function () {

    });

}

$('#purpose_id').on('change', function () {
    if ($('#purpose_id').val() == '14') {
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



    logRows.last().after(newRow);



});

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


function savePoolOtherInformation(inspection_id) {
    console.log(inspection_id);
    var formData = new FormData();

    formData.append('inspectionId', inspectionId);
    formData.append('pool_volume', $('#pool_volume').val());
    formData.append('disinfectant_used', $('#disinfectant_used').val());
    formData.append('free_1', $('#free_1').val());
    formData.append('total_1', $('#total_1').val());
    formData.append('ph_1', $('#ph_1').val());
    formData.append('free_2', $('#free_2').val());

    formData.append('total_2', $('#total_2').val());
    formData.append('ph_2', $('#ph_2').val());
    formData.append('alkalinity', $('#alkalinity').val());
    formData.append('cyanuric_acid', $('#cyanuric_acid').val());
    formData.append('other', $('#other').val());


    formData.append('_token', $('meta[name="csrf-token"]').attr('content') );

    $.ajax({
        url: pool_other_information_url,
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function () {
            $('#overlay').show();
        },
        success: function (response) {
            $('#overlay').hide();
            setTimeout(() => {
                toastr.success('Other Information Upload Successfully..');
            }, 500)

        },

        error: function (jqXHR) {
            $('#overlay').hide();
            console.log(jqXHR.responseText);
            let error_title = 'Something went wrong';
            if (jqXHR.responseJSON?.message) {
                error_title = jqXHR.responseJSON.message;
            }
            Swal.fire({
                icon: 'error',
                title: error_title
            });
        }
    });
}
