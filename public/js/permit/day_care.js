var applicant = document.getElementById("applicantSignature");
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
    //     document.getElementById("applicantSignatureBase64").value = signaturePadApplicant.toDataURL("image/jpeg", 0.8).split(',')[1]
    // });
    function updateApplicantSignature() {

        document.getElementById("applicantSignatureBase64").value = signaturePadApplicant.toDataURL().split(',')[1]
    }
    applicantCanvas.addEventListener("mouseout", updateApplicantSignature);
    applicantCanvas.addEventListener("touchend", updateApplicantSignature);

}

$('#sameOwnercheck').change(function () {
    let ischecked = $(this).is(':checked');
    let owner_name = $('#owner_name').val();
    let owner_address = $('#owner_address').val();
    let owner_town = $('#owner_town').val();
    let owner_state = $('#owner_state').val();
    let owner_zip = $('#owner_zip').val();
    let owner_phone = $('#owner_phone').val();
    let owner_fax = $('#owner_fax').val();
    let owner_email = $('#owner_email').val();

    if (!ischecked) {
        $('#operator_name').val('');
        $('#operator_address').val('');
        $('#operator_town').val('');
        $('#operator_state').val('');
        $('#operator_zip').val('');
        $('#operator_fax').val('');

        $('#operator_phone').val('');
        $('#operator_email').val('');
    } else {
        $('#operator_name').val(owner_name);
        $('#operator_address').val(owner_address);
        $('#operator_town').val(owner_town);
        $('#operator_state').val(owner_state);
        $('#operator_zip').val(owner_zip);
        $('#operator_phone').val(owner_phone);
        $('#operator_fax').val(owner_fax);
        $('#operator_email').val(owner_email);
    }

});
function isCanvasBlank(canvas) {
    return !canvas.getContext('2d')
        .getImageData(0, 0, canvas.width, canvas.height).data
        .some(channel => channel !== 0);
}
$(document).ready(function () {

    $('#basicDetailsPermitForm').on('click', function (e) {
        saveBasicDetailsApplication();
    });

    $('#ownerDetailsPermitForm').on('click', function (e) {
        saveOwnerDetailsApplication();
    });
    $('#operatorDetailsPermitForm').on('click', function (e) {
        saveOperatorDetailsApplication();
    });
    $('#managementDetailsPermitForm').on('click', function (e) {
        saveManagementDetailsApplication();
    });
    $('#otherDetailsPermitForm').on('click', function (e) {

        saveOtherDetailsApplication();
    });
    $('#savePermitApplicationBtn').on('click', function (e) {
        savePermitApplication();
    });
});

function saveBasicDetailsApplication() {
    if (!validateBasicDetailsApplication()) {
        return false;
    }

    var submitPermitApplicationUrl = basicDetails;
    var formData = new FormData();
    formData.append('application_date', $('#application_date').val());
    formData.append('exp_date', $('#exp_date').val());
    formData.append('name_of_child_care', $('#name_of_child_care').val());
    formData.append('address', $('#address').val());
    formData.append('town', $('#town').val());
    formData.append('state', $('#state').val());
    formData.append('zip', $('#zip').val());
    formData.append('phone', $('#phone').val());
    formData.append('fax', $('#fax').val());
    formData.append('email', $('#email').val());
    formData.append('mailing_address', $('#mailing_address').val());
    formData.append('mailing_town', $('#mailing_town').val());
    formData.append('mailing_state', $('#mailing_state').val());
    formData.append('mailing_zip', $('#mailing_zip').val());
    formData.append('assigned_to', $("#assigned_to").val() ?? '');

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

function saveOwnerDetailsApplication() {
    if (!validateOwnerDetailsApplication()) {
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
    formData.append('owner_fax', $('#owner_fax').val());
    formData.append('owner_email', $('#owner_email').val());
    formData.append('emergency_phone', $('#emergency_phone').val());



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
    if (!validateOperatorDetailsApplication()) {
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
    formData.append('operator_fax', $('#operator_fax').val());
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

function saveManagementDetailsApplication() {
    if (!validateManagementDetailsApplication()) {
        return false;
    }

    var submitPermitApplicationUrl = managementDetails;
    var formData = new FormData();
    formData.append('management_company', $('#management_company').val());
    formData.append('management_address', $('#management_address').val());
    formData.append('management_town', $('#management_town').val());
    formData.append('management_state', $('#management_state').val());
    formData.append('management_zip', $('#management_zip').val());
    formData.append('management_phone', $('#management_phone').val());
    formData.append('management_fax', $('#management_fax').val());
    formData.append('management_email', $('#management_email').val());

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

function saveOtherDetailsApplication() {
    // console.log('f');
    // if (!validateOtherDetailsApplication()) {
    //     return false;
    // }

    var submitPermitApplicationUrl = otherDetails;
    var formData = new FormData();
    formData.append('day_and_hours', $('#day_and_hours').val());
    formData.append('license_number', $('#license_number').val());
    formData.append('state_exp_date', $('#state_exp_date').val());

    formData.append('license_capacity', $('#license_capacity').val());
    formData.append('under_three_endorsement', $('#under_three_endorsement').val());
    formData.append('pre_1978', $('#pre_1978').val());
    formData.append('lead_management', $('#lead_management').val());
    formData.append('daycare_licensed', $('#daycare_licensed').val());
    formData.append('building', $('#building').val());
    formData.append('childcare_staff', $('#childcare_staff').val());
    formData.append('water_supply', $('#water_supply').val());
    formData.append('sewage_disposal', $('#sewage_disposal').val());
    formData.append('description', $('#description').val());

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



function savePermitApplication() {

    if ($('input[name="_method"]').val() == 'POST') {
        if (!validatePermitApplication()) {
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
function validatePermitApplication() {
    let flg = 0;

    const requiredFields = [
        'application_date',
        'name_of_child_care',
        'address',
        'town',
        'state',
        'zip',
        'phone',
        'email',

        'owner_name',
        'owner_address',
        'owner_town',
        'owner_state',
        'owner_zip',
        'owner_phone',
        'owner_email',

        'operator_name',
        'operator_address',
        'operator_town',
        'operator_state',
        'operator_zip',
        'operator_phone',
        'operator_email',

        // 'management_address',
        // 'management_town',
        // 'management_state',
        // 'management_zip',
        // 'management_phone',
        // 'management_email',

        'applicant_signature_date'
    ];

    requiredFields.forEach(field => {
        const value = $('#' + field).val();

        if (!value || value.trim() === '') {
            $('#' + field + '_error').text('ⓘ Required Field');
            flg = 1;
        } else {
            $('#' + field + '_error').text('');
        }
    });

    return flg === 0;
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

function validateBasicDetailsApplication(){
    let flg = 0;

    const requiredFields = [
        'application_date',
        'name_of_child_care',
        'address',
        'town',
        'state',
        'zip',
        'phone',
        'email',

        // 'owner_name',
        // 'owner_address',
        // 'owner_town',
        // 'owner_state',
        // 'owner_zip',
        // 'owner_phone',
        // 'owner_email',

        // 'operator_name',
        // 'operator_address',
        // 'operator_town',
        // 'operator_state',
        // 'operator_zip',
        // 'operator_phone',
        // 'operator_email',

        // 'management_address',
        // 'management_town',
        // 'management_state',
        // 'management_zip',
        // 'management_phone',
        // 'management_email',

        // 'applicant_signature_date'
    ];

    requiredFields.forEach(field => {
        const value = $('#' + field).val();

        if (!value || value.trim() === '') {
            $('#' + field + '_error').text('ⓘ Required Field');
            flg = 1;
        } else {
            $('#' + field + '_error').text('');
        }
    });

    return flg === 0;
}

function validateOwnerDetailsApplication(){
    let flg = 0;
    const requiredFields = [
        'application_date',
        'name_of_child_care',
        'address',
        'town',
        'state',
        'zip',
        'phone',
        'email',

    ];

    requiredFields.forEach(field => {
        const value = $('#' + field).val();

        if (!value || value.trim() === '') {
            $('#' + field + '_error').text('ⓘ Required Field');
            flg = 1;
        } else {
            $('#' + field + '_error').text('');
        }
    });

    return flg === 0;
}
function validateOperatorDetailsApplication(){
    let flg = 0;
    const requiredFields = [
        'operator_name',
        'operator_address',
        'operator_town',
        'operator_state',
        'operator_zip',
        'operator_phone',
        'operator_email',
    ];
    requiredFields.forEach(field => {
        const value = $('#' + field).val();
        if (!value || value.trim() === '') {
            $('#' + field + '_error').text('ⓘ Required Field');
            flg = 1;
        } else {
            $('#' + field + '_error').text('');
        }
    });
    return flg === 0;
}
function validateManagementDetailsApplication(){
    let flg = 0;
    const requiredFields = [
        'management_address',
        'management_town',
        'management_state',
        'management_zip',
        'management_phone',
        'management_email',
    ];
    requiredFields.forEach(field => {
        const value = $('#' + field).val();
        if (!value || value.trim() === '') {
            $('#' + field + '_error').text('ⓘ Required Field');
            flg = 1;
        } else {
            $('#' + field + '_error').text('');
        }
    });
    return flg === 0;
}
$(document).on('input change', 'input, textarea, select', function () {
    $('#' + this.id + '_error').text('');
});
