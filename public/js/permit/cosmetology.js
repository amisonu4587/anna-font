if (document.getElementById('inspection_date') != null) {
    $('#inspection_date').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        minDate: new Date(),
        maxYear: parseInt(moment().format('YYYY')) + 4,
        autoUpdateInput: false,
        applyButtonClasses: 'btn-info rounded-0',
    });
    $('#inspection_date').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('L'));
    });
    $('#inspection_date').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
}
var applicant = document.getElementById("applicantSignature");
// console.log(applicant);
if (applicant != null) {
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
$('#sameAddresscheck').change(function () {
    let ischecked = $(this).is(':checked');
    let est_name = $('#est_name').val();

    let est_mailing_address = $('#est_mailing_address').val();
    let est_mailing_city = $('#est_mailing_city').val();
    let est_mailing_state = $('#est_mailing_state').val();
    let est_mailing_zip = $('#est_mailing_zip').val();

    if (!ischecked) {
        $('#mailing_addressee').val('');
        $('#est_billing_address').val('');
        $('#est_billing_city').val('');
        $('#est_billing_state').val('');
        $('#est_billing_zip').val('');
    } else {
        $('#mailing_addressee').val(est_name);
        $('#est_billing_address').val(est_mailing_address);
        $('#est_billing_city').val(est_mailing_city);
        $('#est_billing_state').val(est_mailing_state);
        $('#est_billing_zip').val(est_mailing_zip);
    }

});

$('#sameOwnercheck').change(function () {
    let ischecked = $(this).is(':checked');
    let owner_name = $('#owner_name').val();
    let owner_phone = $('#owner_phone').val();
    let owner_email = $('#owner_email').val();
    let owner_address = $('#owner_address').val();
    let owner_town = $('#owner_town').val();
    let owner_state = $('#owner_state').val();
    let owner_zip = $('#owner_zip').val();


    if (!ischecked) {
        $('#operator_name').val('');
        $('#operator_phone').val('');
        $('#operator_email').val('');
        $('#operator_address').val('');
         $('#operator_town').val('');
        $('#operator_state').val('');
        $('#operator_zip').val('');
    } else {
        $('#operator_name').val(owner_name);
        $('#operator_phone').val(owner_phone);
        $('#operator_email').val(owner_email);
        $('#operator_address').val(owner_address);
        $('#operator_town').val(owner_town);
        $('#operator_state').val(owner_state);
        $('#operator_zip').val(owner_zip);
    }

});

$('#hoursOfOperation').change(function () {
    let ischecked = $(this).is(':checked');
    let dayTime = $('#dayTime_0').val();

    // console.log(dayTime);

    if (!ischecked) {

        $('#dayTime_1').val('');
        $('#dayTime_2').val('');
        $('#dayTime_3').val('');
        $('#dayTime_4').val('');
        $('#dayTime_5').val('');
        $('#dayTime_6').val('');

    } else {
        $('#dayTime_1').val(dayTime);
        $('#dayTime_2').val(dayTime);
        $('#dayTime_3').val(dayTime);
        $('#dayTime_4').val(dayTime);
        $('#dayTime_5').val(dayTime);
        $('#dayTime_6').val(dayTime);
    }

});

$(document).ready(function () {
    const businessTypeSelect = $('#business_type_id');
    const nonProfit = $('#non_profit');

    const licensePlateDiv = $('#license_plate_number').closest('.form-group');
    var otherBusinessTypeDiv = $('#other_business_type').closest('.form-group');

    var taxIdNumber = $('#tax_id_number').closest('.form-group');
    var selectedValues = businessTypeSelect.val() || [];
    // console.log(selectedValues);
    if (selectedValues.includes('6')) {
        licensePlateDiv.show();
    } else {
        licensePlateDiv.hide();
    }
    if (selectedValues.includes('11')) {
        otherBusinessTypeDiv.show();
    } else {
        otherBusinessTypeDiv.hide();
    }
    if (nonProfit.val() == '1') {
        taxIdNumber.show();
    } else {
        taxIdNumber.hide();
    }
    // taxIdNumber.hide();
    // licensePlateDiv.hide();
    // otherBusinessTypeDiv.hide();

    businessTypeSelect.on('change', function () {
        selectedValues = businessTypeSelect.val() || [];

        if (selectedValues.includes('6')) {
            licensePlateDiv.show();
        } else {
            licensePlateDiv.hide();
        }

        if (selectedValues.includes('11')) {
            otherBusinessTypeDiv.show();
        } else {
            otherBusinessTypeDiv.hide();
        }
    });



    nonProfit.on('change', function () {


        if (nonProfit.val() == '1') {
            taxIdNumber.show();
        } else {
            taxIdNumber.hide();
        }

    });


    $('#estDetailsPermitForm').on('click', function (e) {
        // alert('fg');
        saveEstDetailsApplication();
    });
    $('#ownerDetailsPermitForm').on('click', function (e) {
        // alert('fg');
        saveOwnerDetailsApplication();
    });
    $('#operatorDetailsPermitForm').on('click', function (e) {
        // alert('fg');
        saveOperatorDetailsApplication();
    });
    $('#basicDetailsPermitForm').on('click', function (e) {
        // alert('fg');
        saveBasicDetailsApplication();
    });
    $('#savePermitApplicationBtn').on('click', function (e) {
        // alert('fg');
        saveFoodPermitApplication();
    });


    $("#assigned_to" ).autocomplete({
        source: function( request, response ) {
            // console.log(request.term);
            $.ajax({
                 url: userSearchUrl,
                type: 'POST',
                dataType: "JSON",
                data: {
                    search: request.term
                },
                success: function (data) {
                    if(data.length>0)
                    {
                        response($.map(data, function (item) {
                            return {
                                label: item.label,
                                id: item.id,
                            };
                        }));
                    }
                    else
                    {
                        $('#assigned_to').val('');
                    }
                },
                error: function (error) {
                    setTimeout(() => {
                        toastr.error(error.responseJSON?.message || "Something went wrong.");
                    }, 775);
                },
            });
        },
        minLength: 1,
        select: function (event, ui) {
        if (ui.item.id == '') {
            $('#assigned_to').val('');
        } else {
            $('#assigned_to').val(ui.item.label);
        }
        return false;
    }
    });
});

function isCanvasBlank(canvas) {
    return !canvas.getContext('2d')
        .getImageData(0, 0, canvas.width, canvas.height).data
        .some(channel => channel !== 0);
}

function saveEstDetailsApplication() {
    // alert('est');
    if(!validateEstDetailsApplication()){
        return false;
    }

    var submitPermitApplicationUrl = estcDetails;
    var formData = new FormData();
    formData.append('application_date', $('#application_date').val());
    formData.append('exp_date', $('#exp_date').val());
    formData.append('est_name', $('#est_name').val());
    formData.append('est_phone', $('#est_phone').val());
    formData.append('est_address', $('#est_address').val());
    formData.append('est_town', $('#est_town').val());
    formData.append('est_state', $('#est_state').val());

    formData.append('est_zip', $('#est_zip').val());

    formData.append('est_mailing_address', $('#est_mailing_address').val());
    formData.append('est_mailing_town', $('#est_mailing_town').val());
    formData.append('est_mailing_state', $('#est_mailing_state').val());

    formData.append('est_mailing_phone', $('#est_mailing_phone').val());
    formData.append('est_mailing_zip', $('#est_mailing_zip').val());
    formData.append('est_mailing_email', $('#est_mailing_email').val());
    formData.append('other_service', $('#other_service').val());
    formData.append('unit_number', $('#unit_number').val());

    formData.append('fee_id',$('#fee_id').val());
    formData.append('fee_id_2',$('#fee_id_2').val());
    formData.append('assigned_inspector', $('#assigned_inspector').val());
    // formData.append('assigned_to', $('#assigned_to').val());
    formData.append('area', $('#area').val());

    // $('input[name^="dayTime"]').each(function () {
    //     formData.append($(this).attr('name'), $(this).val());
    // });
    // formData.append('hoursOfOperation',$('#hoursOfOperation').is(':checked') ? 1 : 0);
    // document.querySelectorAll('input').forEach(element => {
    //     let type = element.getAttribute("type");
    //     let name = element.getAttribute("name");
    //     if (!name) return; // skip inputs with no name

    //     if (type === "checkbox") {
    //         formData.append(name, element.checked ? 1 : 0);
    //     }
    // });
    $('.serviceOfferedRow')
    .find('input[name="type_of_service[]"]:checked')
    .each(function () {
        formData.append('type_of_service[]', $(this).val());
    });

    $('.ownershipRow')
    .find('input[name="type_of_ownership[]"]:checked')
    .each(function () {
        formData.append('type_of_ownership[]', $(this).val());
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
                window.location.reload();
            }, 2000);
        },
        error: function (error) {
            setTimeout(() => {
                toastr.error(error.message);
            }, 775)
        },
        complete: function () {
            $('div#loading-wrapper').hide();
            $('#spin').hide();
            $('#saveicon').show();
        }
    });
}

function saveOwnerDetailsApplication() {
    // alert('est');
    if(!validateOwnerDetailsApplication()){
        return false;
    }

    var submitPermitApplicationUrl = ownerDetails;
    var formData = new FormData();
    formData.append('owner_name', $('#owner_name').val());
    formData.append('owner_address', $('#owner_address').val());
    formData.append('owner_town', $('#owner_town').val());
    formData.append('owner_state', $('#owner_state').val());
    formData.append('owner_zip', $('#owner_zip').val());
    formData.append('owner_phone', $('#owner_phone').val());
    formData.append('owner_email', $('#owner_email').val());

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
                window.location.reload();
            }, 2000);
        },
        error: function (error) {
            setTimeout(() => {
                toastr.error(data.message);
            }, 775)
        },
        complete: function () {
            $('div#loading-wrapper').hide();
            $('#spin').hide();
            $('#saveicon').show();
        }
    });
}
function saveOperatorDetailsApplication() {
    // alert('est');
    if(!validateOperatorDetailsApplication()){
        return false;
    }

    var submitPermitApplicationUrl = operatorDetails;
    var formData = new FormData();
    formData.append('operator_name', $('#operator_name').val());
    formData.append('operator_address', $('#operator_address').val());
    formData.append('operator_town', $('#operator_town').val());
    formData.append('operator_state', $('#operator_state').val());
    formData.append('operator_zip', $('#operator_zip').val());
    formData.append('operator_phone', $('#operator_phone').val());
    formData.append('operator_email', $('#operator_email').val());

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
                window.location.reload();
            }, 2000);
        },
        error: function (error) {
            setTimeout(() => {
                toastr.error(data.message);
            }, 775)
        },
        complete: function () {
            $('div#loading-wrapper').hide();
            $('#spin').hide();
            $('#saveicon').show();
        }
    });
}
function saveBasicDetailsApplication() {
    // alert('basic');
    // if(!validateBasicDetailsApplication()){
    //     return false;
    // }

    var submitPermitApplicationUrl = basicDetails;
    var formData = new FormData();

    formData.append('workstation', $('#workstation').val());
    // formData.append('cosmeticians_employed', $('#cosmeticians_employed').val());
    formData.append('work_space', $('#work_space').val());
    formData.append('station_rented', $('#station_rented').val());
    // formData.append('workstation_renting', $('#workstation_renting').val());
    formData.append('days_of_operation', $('#days_of_operation').val());
    formData.append('list_all_employees', $('#list_all_employees').val());
    formData.append('water_supply', $('#water_supply').val());
    formData.append('sewage_disposal', $('#sewage_disposal').val());

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
                window.location.reload();
            }, 2000);
        },
        error: function (error) {
            setTimeout(() => {
                toastr.error(data.message);
            }, 775)
        },
        complete: function () {
            $('div#loading-wrapper').hide();
            $('#spin').hide();
            $('#saveicon').show();
        }
    });
}

function saveFoodPermitApplication() {
    if ($('input[name="_method"]').val() == 'POST') {
        if (!validateFoodPermitApplication()) {
            return false;
        }
    } else {
        var applicant_signature_date = $('#applicant_signature_date').val();
        if (applicant_signature_date == "") {
            $('#applicant_signature_date_error').text("ⓘ Required Field");
            setTimeout(() => {
                $('#applicant_signature_date_error').html("");
            }, 5000)
            return false;
        }
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
        // } else if (type === "checkbox") {
        //     formData.append(name, element.checked ? 1 : 0);
        } else if (type === "file") {
            formData.append(name, element.files[0]);
        }
    });

    formData.append('applicationInPersonCheck', document.getElementById('applicationInPersonCheck').checked ? 1 : 0);
    if ($('input[name="_method"]').val() != 'POST') {
        formData.append('signOffsCheck', document.getElementById('signOffsCheck').checked ? 1 : 0);
    }
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


    $('.serviceOfferedRow')
    .find('input[name="type_of_service[]"]:checked')
    .each(function () {
        formData.append('type_of_service[]', $(this).val());
    });

    $('.ownershipRow')
    .find('input[name="type_of_ownership[]"]:checked')
    .each(function () {
        formData.append('type_of_ownership[]', $(this).val());
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



function validateFoodPermitApplication() {
    var flg = 0;


    var est_name = $('#est_name').val();
    if (est_name == "") {
        $('#est_name_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_name_error').html("");
        }, 5000)
        flg = 1;
    }

    var est_mailing_address = $('#est_mailing_address').val();
    if (est_mailing_address == "") {
        $('#est_mailing_address_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_mailing_address_error').html("");
        }, 5000)
        flg = 1;
    }
    var owner_name = $('#owner_name').val();
    if (owner_name == "") {
        $('#owner_name_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_name_error').html("");
        }, 5000)
        flg = 1;
    }
    // var est_mailing_city = $('#est_mailing_city').val();
    // if (est_mailing_city == "") {
    //     $('#est_mailing_city_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#est_mailing_city_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }

    // var est_mailing_state = $('#est_mailing_state').val();
    // if (est_mailing_state == "") {
    //     $('#est_mailing_state_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#est_mailing_state_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }

    // var est_mailing_zip = $('#est_mailing_zip').val();
    // if (est_mailing_zip == "") {
    //     $('#est_mailing_zip_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#est_mailing_zip_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }

    // var est_phone = $('#est_phone').val();
    // if (est_phone == "") {
    //     $('#est_phone_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#est_phone_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }


    // var est_email = $('#est_email').val();
    // if (est_email == "") {
    //     $('#est_email_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#est_email_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }



    // var est_billing_address = $('#est_billing_address').val();
    // if (est_billing_address == "") {
    //     $('#est_billing_address_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#est_billing_address_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var est_billing_city = $('#est_billing_city').val();
    // if (est_billing_city == "") {
    //     $('#est_billing_city_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#est_billing_city_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var est_billing_state = $('#est_billing_state').val();
    // if (est_billing_state == "") {
    //     $('#est_billing_state_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#est_billing_state_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var est_billing_state = $('#est_billing_state').val();
    // if (est_billing_state == "") {
    //     $('#est_billing_state_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#est_billing_state_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var est_billing_zip = $('#est_billing_zip').val();
    // if (est_billing_zip == "") {
    //     $('#est_billing_zip_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#est_billing_zip_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }

    // var onsite_manager = $('#onsite_manager').val();
    // if (onsite_manager == "") {
    //     $('#onsite_manager_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#onsite_manager_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }


    var applicant_signature_date = $('#applicant_signature_date').val();
    if (applicant_signature_date == "") {
        $('#applicant_signature_date_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#applicant_signature_date_error').html("");
        }, 5000)
        flg = 1;
    }

    if (document.querySelector('input[name="_method"]').value == 'POST') {
        var applicationInPersonCheck = $('#applicationInPersonCheck').is(':checked') ? 1 : 0;
        // console.log(applicationInPersonCheck);
        if (applicationInPersonCheck == 0) {
            if (isCanvasBlank(applicantCanvas)) {
                toastr.error("Please fill the signatures before submitting");
                flg = 1;
            }
        }

    }
    if (flg == 1) { return false; }
    else { return true; }
}


function changRetailFoodStatus(status, element) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(function (result) {
        if (result.value) {


            loadingWrapper.style.display = 'block';
            let permit_id = document.getElementById("id").value;
            let permit_type_id = document.getElementById("permit_type_id").value;

            let url = updatePermitApplicationStatusUrl.replace(':permit_id', permit_id).replace(':permit_type_id', permit_type_id);
            let xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.onload = function (e) {
                let response = JSON.parse(this.responseText);
                if (this.status == 200) {
                    toastr.success(response.message);
                    let nextFieldSet = element.closest('fieldset').nextElementSibling;
                    nextFieldSet?.classList.remove('hideOnLoad');
                    element.closest('fieldset').classList.add('hideOnLoad');
                    let progressBar = document.getElementById('progressbar');
                    progressBar.querySelector("li#" + status).classList.add("active", "text-success");
                    window.location.reload();
                }
                else {
                    toastr.error(response.message);
                }

                loadingWrapper.style.display = 'none';
            }
            xhr.send(`permit_status=${status}`);


        }

    });
}

function editSchedule(schedule) {
    let scheduleModal = document.getElementById('scheduleUploadModal');
    let inspectionDate = schedule.inspection_date;
    let inspectionDateObj = new Date(inspectionDate);
    let dt = inspectionDateObj.getDate();
    let month = inspectionDateObj.getMonth() + 1;
    let year = inspectionDateObj.getFullYear();
    if (dt < 10) {
        dt = '0' + dt;
    }

    if (month < 10) {
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
    this.querySelectorAll('button.panelButton').forEach((item, index) => {
        item.classList.remove('btn-warning', 'btn-info', 'btn-success', 'btn-danger', 'btn-primary');
        item.classList.add('btn-default');
    });
})


function validateOwnerDetailsApplication() {
    var flg = 0;
    var owner_name = $('#owner_name').val();
    if (owner_name == "") {
        $('#owner_name_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_name_error').html("");
        }, 5000)
        flg = 1;
    }
    // var owner_address = $('#owner_address').val();
    // if (owner_address == "") {
    //     $('#owner_address_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#owner_address_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var owner_phone = $('#owner_phone').val();
    // if (owner_phone == "") {
    //     $('#owner_phone_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#owner_phone_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var owner_city = $('#owner_city').val();
    // if (owner_city == "") {
    //     $('#owner_city_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#owner_city_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var owner_state = $('#owner_state').val();
    // if (owner_state == "") {
    //     $('#owner_state_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#owner_state_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var owner_zip = $('#owner_zip').val();
    // if (owner_zip == "") {
    //     $('#owner_zip_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#owner_zip_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var owner_email = $('#owner_email').val();
    // if (owner_email == "") {
    //     $('#owner_email_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#owner_email_error').html("");
    //     }, 5000)
    //     flg = 1;
    // } else {
    //     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //     var email = emailRegex.test(owner_email);
    //     console.log(email);
    //     if (!email) {
    //         $('#owner_email_error').text("ⓘ Invalid email");
    //         setTimeout(() => {
    //             $('#owner_email_error').html("");
    //         }, 5000)
    //         flg = 1;
    //     }
    // }

    if (flg == 1) { return false; }
    else { return true; }
}
function validateOperatorDetailsApplication() {
    var flg = 0;
    var operator_name = $('#operator_name').val();
    if (operator_name == "") {
        $('#operator_name_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#operator_name_error').html("");
        }, 5000)
        flg = 1;
    }

    if (flg == 1) { return false; }
    else { return true; }
}

function validateEstDetailsApplication() {
    var flg = 0;
    var est_name = $('#est_name').val();
    if (est_name == "") {
        $('#est_name_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_name_error').html("");
        }, 5000)
        flg = 1;
    }
    var est_mailing_address = $('#est_mailing_address').val();
    if (est_mailing_address == "") {
        $('#est_mailing_address_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_mailing_address_error').html("");
        }, 5000)
        flg = 1;
    }
    // var est_mailing_city = $('#est_mailing_city').val();
    // if (est_mailing_city == "") {
    //     $('#est_mailing_city_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#est_mailing_city_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var est_mailing_state = $('#est_mailing_state').val();
    // if (est_mailing_state == "") {
    //     $('#est_mailing_state_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#est_mailing_state_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var est_mailing_zip = $('#est_mailing_zip').val();
    // if (est_mailing_zip == "") {
    //     $('#est_mailing_zip_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#est_mailing_zip_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var est_phone = $('#est_phone').val();
    // if (est_phone == "") {
    //     $('#est_phone_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#est_phone_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var est_email = $('#est_email').val();
    // if (est_email == "") {
    //     $('#est_email_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#est_email_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }

    if (flg == 1) { return false; }
    else { return true; }
}
function validateBasicDetailsApplication() {
    var flg = 0;



    if (flg == 1) { return false; }
    else { return true; }
}
function getAreaByUser(element) {
    console.log(element.val());
    var user_id = element.val();
    console.log(user_id);

    var fd = new FormData();
    fd.append('user_id', user_id);
    fd.append('_token', $('input[name="_token"]').val());
    $.ajax({
        url: areaSearchByUserId,
        type: "POST",
        data: fd,
        dataType: "JSON",
        contentType: false,
        processData: false,
        beforeSend: function() {
            $('#overlay').show();
        },
        success: function(response) {
            $('#overlay').hide();

            console.log(response.areas);
            if (response.areas == '') {
                $('#area').val('');
                $('select#area').html('<option value="">SELECT AREA</option>');
            } else {
                var options = `<option value="">Select Area</option>`;
                response.areas.forEach(function(item, index) {
                    options +=
                        `<option value="${item.area_id}" >${item.area.area_number}</option>`;
                });
                $('select#area').html(options);
            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
            $('#overlay').hide();
            Swal.fire({
                icon: 'error',
                title: ' Error: ' + errorThrown,
            });
            var error = jqXHR.responseJSON.message;
            console.log(error);
        }
    });

}



// document.addEventListener('DOMContentLoaded', function () {
//     document.getElementById('savePermitApplicationBtn')?.addEventListener('click', function (e) {
//         e.preventDefault();
//         let allServices = [];

//         $('.serviceOfferedRow').each(function () {
//             let row = $(this);
//             let selectedOffers = [];

//             // Collect checked services
//             row.find('input[name="serviceOffers[]"]:checked').each(function () {
//                 selectedOffers.push($(this).val());
//             });

//             var service_name = row.find('input[name="service_name"]').val();
//             var ct_license = row.find('input[name="ct_license"]').val();
//             var expiration_date = row.find('input[name="expiration_date"]').val();

//             if (
//                 selectedOffers.length > 0 ||
//                 service_name.trim() !== '' ||
//                 ct_license.trim() !== '' ||
//                 expiration_date.trim() !== ''
//             ) {
//                 allServices.push({
//                     service_type: selectedOffers,
//                     service_name: service_name,
//                     ct_license: ct_license,
//                     expiration_date: expiration_date
//                 });
//             }

//         });

//         let permitApplicationForm = document.getElementById('permitApplicationForm');
//         let submitPermitApplicationUrl = permitApplicationForm.getAttribute("action");
//         let formData = new FormData(permitApplicationForm);

//         // Append JSON-encoded services
//         formData.append('services', JSON.stringify(allServices));

//         let loadingWrapper = document.getElementById('loading-wrapper');
//         loadingWrapper.style.display = 'block';

//         let xhr = new XMLHttpRequest();
//         xhr.open("POST", submitPermitApplicationUrl, true); // async = true
//         xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);

//         xhr.onload = function () {
//             loadingWrapper.style.display = 'none';

//             if (xhr.status === 200) {
//                 toastr.success("Permit Application Saved Successfully!");
//                 setTimeout(() => location.href = indexUrl, 2000);
//             } else {
//                 try {
//                     let response = JSON.parse(xhr.responseText);
//                     toastr.error(response.message || "Something went wrong!");
//                 } catch (err) {
//                     toastr.error("Unexpected error occurred!");
//                 }
//             }
//         };

//         xhr.onerror = function () {
//             loadingWrapper.style.display = 'none';
//             toastr.error("Network error. Please try again.");
//         };

//         xhr.send(formData);
//     });
// });
