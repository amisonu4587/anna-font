$(document).ready(function () {

    // alert('fg');

    $('#saveHotelMotelInfo').on('click', function (e) {
        console.log('fg');
        saveHotelMotelInfo();
    });
    $('#saveOwnerInfo').on('click', function (e) {
        // alert('fg');
        saveOwnerInfo();
    });
    $('#saveManagerInfo').on('click', function (e) {
        // alert('fg');
        saveManagerInfo();
    });
     $('#saveOtherInfo').on('click', function (e) {
        // alert('fg');
        saveOtherInfo();
    });
});


document.addEventListener('DOMContentLoaded', function (e) {
    document.getElementById('savePermitApplicationBtn')?.addEventListener('click', function (e) {
        if (!validatePermitApplication()) {
            return false;
        }
        var permitApplicationForm = document.getElementById('permitApplicationForm');
        var submitPermitApplicationUrl = permitApplicationForm.getAttribute("action");
        var formData = new FormData();
        permitApplicationForm.querySelectorAll('input').forEach(element => {
            //console.log(element.getAttribute("type"));
            if (element.getAttribute("type") == "text"
                || element.getAttribute("type") == "email"
                || element.getAttribute("type") == "hidden"
                || element.getAttribute("type") == "number") {
                formData.append(element.getAttribute("name"), element.value);
            }
            if (element.getAttribute("type") === "radio") {
                const name = element.getAttribute("name");
                const checkedValue = document.querySelector(`input[name="${name}"]:checked`)?.value || '';
                formData.append(name, checkedValue);
            }
            if (element.getAttribute("type") == "checkbox") {
                formData.append(element.getAttribute("name"), element.checked ? 1 : 0);
            }
            if (element.getAttribute("type") == "file") {
                formData.append(element.getAttribute("name"), element.files[0]);
            }
        });
        document.querySelectorAll('select').forEach(element => {
            formData.append(element.getAttribute("name"), $('select#' + element.getAttribute("id")).val());
        });
        var loadingWrapper = document.getElementById('loading-wrapper');
        loadingWrapper.style.display = 'block';
        var xhr = new XMLHttpRequest();
        xhr.open("POST", submitPermitApplicationUrl, false);
        xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);
        xhr.getResponseHeader("Content-type", "application/json");
        xhr.onload = function (e) {
            console.log(this);
            if (this.status == 200) {
                setTimeout(function () {
                    loadingWrapper.style.display = 'none';
                    toastr.success("Event Upload Successfully!");
                    location.href = indexUrl;
                }, 5000);
            }
            else {
                const response = JSON.parse(this.responseText);
                console.log(response);
                loadingWrapper.style.display = 'none';
                toastr.error(response.message);
            }
        }
        xhr.send(formData);
    });
});



var applicant = document.getElementById("applicantSignature");
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
    //     document.getElementById("applicantSignatureBase64").value = signaturePadApplicant.toDataURL("image/jpeg", 0.8).split(',')[1]
    // });
    function updateApplicantSignature() {

        document.getElementById("applicantSignatureBase64").value = signaturePadApplicant.toDataURL().split(',')[1]
    }
    applicantCanvas.addEventListener("mouseout", updateApplicantSignature);
    applicantCanvas.addEventListener("touchend", updateApplicantSignature);

}


function validatePermitApplication() {
    let flg = 0;

    const requiredFields = [
        'date',
        'est_name',
        'est_address',
        'est_city',
        'est_state',
        'est_zip',
        'est_phone',
        'est_email',
        'owner_name',
        'owner_address',
        'owner_city',
        'owner_state',
        'owner_zip',
        'owner_phone',
        'owner_email',
        'emergency_phone',
        'manager_name',
        'manager_email',
        'manager_phone',

        'applicant_signature_date'
    ];

    requiredFields.forEach(function(field) {
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




function saveHotelMotelInfo() {
    // alert($('input[name="_method"]').val());
    if (!validatesHotelMotelInfo()) {
        return false;
    }

    var saveHotelMotelInfoUrl = saveHotelMotelInfoUr;
    // alert(saveHotelMotelInfoUrl);

    var formData = new FormData();

    formData.append('date', $('#date').val());
    formData.append('exp_date', $('#exp_date').val());

    formData.append('est_name', $('#est_name').val());
    formData.append('est_address', $('#est_address').val());
    formData.append('est_city', $('#est_city').val());
    formData.append('est_state', $('#est_state').val());
    formData.append('est_zip', $('#est_zip').val());
    formData.append('est_phone', $('#est_phone').val());
    formData.append('est_email', $('#est_email').val());
    formData.append('assigned_to', $("#assigned_to").val() ?? '');

    formData.append('_token', $('input[name="_token"]').val());
    formData.append('_method', $('input[name="_method"]').val());


    $.ajax({
        type: "POST",
        url: saveHotelMotelInfoUrl,
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


function validatesHotelMotelInfo() {
    let flg = 0;

    const requiredFields = [
        'date',
        'est_name',
        'est_address',
        'est_city',
        'est_state',
        'est_zip',
        'est_phone',
        'est_email',

    ];

    requiredFields.forEach(function(field) {
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


function saveOwnerInfo() {
    // alert('basic');
    if (!validatesOwnerInfo()) {
        return false;
    }

    var saveOwnerInfoUrl = saveOwnerInfoUr;
    var formData = new FormData();

    formData.append('owner_name', $('#owner_name').val());
    formData.append('owner_address', $('#owner_address').val());
    formData.append('owner_city', $('#owner_city').val());
    formData.append('owner_state', $('#owner_state').val());
    formData.append('owner_zip', $('#owner_zip').val());
    formData.append('owner_email', $('#owner_email').val());
    formData.append('owner_phone', $('#owner_phone').val());
    formData.append('emergency_phone', $('#emergency_phone').val());


    formData.append('_token', $('input[name="_token"]').val());
    formData.append('_method', $('input[name="_method"]').val());
    $.ajax({
        type: "POST",
        url: saveOwnerInfoUrl,
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


function validatesOwnerInfo() {
   let flg = 0;

    const requiredFields = [

        'owner_name',
        'owner_address',
        'owner_city',
        'owner_state',
        'owner_zip',
        'owner_phone',
        'owner_email',
        'emergency_phone',

    ];

    requiredFields.forEach(function(field) {
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


function saveManagerInfo() {
    // alert('basic');
    if (!validatesManagerInfo()) {
        return false;
    }

    var saveManagerInfoUrl = saveManagerInfoUr;
    var formData = new FormData();

   formData.append('manager_name', $('#manager_name').val());
    formData.append('manager_phone', $('#manager_phone').val());
    formData.append('manager_email', $('#manager_email').val());

    formData.append('_token', $('input[name="_token"]').val());
    formData.append('_method', $('input[name="_method"]').val());
    $.ajax({
        type: "POST",
        url: saveManagerInfoUrl,
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


function validatesManagerInfo() {
    let flg = 0;
    const requiredFields = [
        'manager_name',
        'manager_email',
        'manager_phone',
    ];
    requiredFields.forEach(function(field) {
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

function saveOtherInfo() {
    // alert('basic');
    if (!validatesOtherInfo()) {
        return false;
    }

    var saveOtherInfoUrl = saveOtherInfoUr;
    var formData = new FormData();

    formData.append('number_of_unit', $('#number_of_unit').val());
    formData.append('water_supply', $('#water_supply').val());
    formData.append('sewage_disposal', $('#sewage_disposal').val());

    formData.append('septic_tank_size', $('#septic_tank_size').val());
    formData.append('type_size_of_leach_fields', $('#type_size_of_leach_fields').val());
    formData.append('date_septic_tank_last_pumped', $('#date_septic_tank_last_pumped').val());
    formData.append('swimming_pool_on_property', $('#swimming_pool_on_property').val());
    formData.append('pest_control_in_pplace', $('#pest_control_in_pplace').val());
    formData.append('food_and_beverages_prepared_on_premises', $('#food_and_beverages_prepared_on_premises').val());
    formData.append('_token', $('input[name="_token"]').val());
    formData.append('_method', $('input[name="_method"]').val());
    $.ajax({
        type: "POST",
        url: saveOtherInfoUrl,
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


function validatesOtherInfo() {
    var flg = 0;

    // var market_name = $('#market_name').val();
    // if (market_name == "") {
    //     $('#market_name_error').text("ⓘ Required Field");
    //     flg = 1;
    // }
    // var date = $('#date').val();
    // if (date == "") {
    //     $('#date_error').text("ⓘ Required Field");
    //     flg = 1;
    // }
    // var exp_date = $('#exp_date').val();
    // if (exp_date == "") {
    //     $('#exp_date_error').text("ⓘ Required Field");
    //     flg = 1;
    // }

    // var applicant_signature_date = $('#applicant_signature_date').val();
    // if (applicant_signature_date == "") {
    //     $('#applicant_signature_date_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#applicant_signature_date_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }

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
    console.log(schedule);

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
