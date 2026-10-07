$('.zip').inputmask('99999');
$('.phone').inputmask('(999) 999-9999');


$(document).ready(function () {


    $('.vendor-check').on('change', function () {

        $('.vendor-check').not(this).prop('checked', false);

        // Show sub options only for Cottage Vendor
        if ($('#cottage_vendor').is(':checked')) {
            $('#cottage_sub_options').removeClass('d-none');
        } else {
            $('#cottage_sub_options').addClass('d-none');

            // uncheck sub options when hidden
            $('.cottage-check').prop('checked', false);
        }
    });

    // Only one sub option checked at a time
    $('.cottage-check').on('change', function () {
        $('.cottage-check').not(this).prop('checked', false);
    });





    const businessTypeSelect = $('#business_type_id');
    const nonProfit = $('#non_profit');

    const licensePlateDiv = $('#license_plate_number').closest('.form-group');
    const otherBusinessTypeDiv = $('#other_business_type').closest('.form-group');

    const taxIdNumber = $('#tax_id_number').closest('.form-group');


    taxIdNumber.hide();
    // licensePlateDiv.hide();
    otherBusinessTypeDiv.hide();

    businessTypeSelect.on('change', function () {
        const selectedValues = businessTypeSelect.val() || [];

        // if (selectedValues.includes('6') || selectedValues.includes('17')) {
        //     licensePlateDiv.show();
        // } else {
        //     licensePlateDiv.hide();
        // }

        if (selectedValues.includes('11') || selectedValues.includes('22')) {
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



    $('#savePermitApplicationBtn').on('click', function (e) {
        if (typeof permitTypeId !== 'undefined' && permitTypeId == 1) {
            saveFoodPermitApplication();
        }
    });

    $('#savePermitApplicationBtn').on('click', function (e) {
        if (typeof permitTypeId !== 'undefined' && permitTypeId == 2) {
            saveMobileFoodPermitApplication();
        }
    });
    $('#savePermitApplicationBtn').on('click', function (e) {
        if (typeof permitTypeId !== 'undefined' && permitTypeId == 3) {
            saveTempFoodPermitApplication();
        }
    });
    $('#savePermitApplicationBtn').on('click', function (e) {
        if (typeof permitTypeId !== 'undefined' && permitTypeId == 4) {
            saveCosmetologyPermitApplication();
        }
    });

    $('#savePermitApplicationBtn').on('click', function (e) {
        if (typeof permitTypeId !== 'undefined' && permitTypeId == 6) {
            savePoolApplication();
        }
    });
    $('#savePermitApplicationBtn').on('click', function (e) {
        if (typeof permitTypeId !== 'undefined' && permitTypeId == 7) {
            saveDayCareApplication();
        }
    });
    $('#savePermitApplicationBtn').on('click', function (e) {
        if (typeof permitTypeId !== 'undefined' && permitTypeId == 8) {
            saveFarmerMarketApplication();
        }
    });

    $('#savePermitApplicationBtn').on('click', function (e) {
        if (typeof permitTypeId !== 'undefined' && permitTypeId == 9) {
            saveHotelPermitApplication();
        }
    });


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

if (document.getElementById("applicantSignature") != null) {
    var applicant = document.getElementById("applicantSignature");
    var applicantclearButton = applicant.querySelector("[data-action=clear]");
    var applicantCanvas = applicant.querySelector("canvas");
    var signaturePadApplicant;
    signaturePadApplicant = new SignaturePad(applicantCanvas);
    applicantclearButton.addEventListener("click", function (event) {
        signaturePadApplicant.clear();
        document.getElementById("applicantSignatureBase64").value = "";
    });

    applicantCanvas.addEventListener("mouseout", function (event) {
        //alert("Please enter");
        document.getElementById("applicantSignatureBase64").value = signaturePadApplicant.toDataURL().split(',')[1]
    });
}
function saveFoodPermitApplication() {
    if (!validateFoodPermitApplication()) {
        return false;
    }

    var submitPermitApplicationUrl = document.getElementById('permitApplicationForm').getAttribute("action");
    var formData = new FormData();
    //formData.append('floor_plan_upload',$('#floor_plan_upload')[0].files[0]);
    //console.log(document.querySelectorAll('input'));
    document.querySelectorAll('input').forEach(element => {
        //console.log(element.getAttribute("type"));
        if (element.getAttribute("type") == "text"
            || element.getAttribute("type") == "hidden"
            || element.getAttribute("type") == "number") {
            formData.append(element.getAttribute("name"), element.value);
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
    let mailing_address = document.querySelector('input[name="owner_mailing_address"]:checked');
    if (mailing_address) {
        formData.append('owner_mailing_address', mailing_address ? mailing_address.value : '');
    } else {
        formData.append('owner_mailing_address', '');

    }
    let citizen_and_qualified_alien = document.querySelector('input[name="citizen_and_qualified_alien"]:checked');
    if (citizen_and_qualified_alien) {
        formData.append('citizen_and_qualified_alien', citizen_and_qualified_alien ? citizen_and_qualified_alien.value : '');
    } else {
        formData.append('citizen_and_qualified_alien', '');

    }
    $.ajax({
        type: "POST",
        url: submitPermitApplicationUrl,
        // data: $('#permitApplicationForm').serialize(),
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function () {
            $('div#loading-wrapper').show();
        },
        success: function (data) {
            console.log(data);
            //document.getElementById('success_sound').play();
            //toastr.success(successmsg);
            toastr.success(data.message);

            /* var firmIdSection = document.getElementById('firmIdSection');
            setInterval(function () {
                var opacity = firmIdSection.style.opacity;
                if(opacity > 0){
                    firmIdSection.style.opacity = opacity - 0.1;
                }
            },500); */

            var successMsg = "";
            successMsg = "Food Permit Application Submitted Successfully! Please check your email for further instructions";
            setTimeout(() => {
                // document.querySelector('section.content').innerHTML = `<div class="alert alert-success">${successMsg}</div>`;
                // document.getElementById('savePermitApplicationBtn').style.display = 'none';

                window.location.href = successPageUrl;


            }, 2000);
        },
        error: function (error) {
            //document.getElementById('errorsound').play();
            // console.log(error);
            setTimeout(() => {
                //toastr.error(errormsg);
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

function saveMobileFoodPermitApplication() {
    if (!validateMobileFoodPermitApplication()) {
        return false;
    }

    var submitPermitApplicationUrl = document.getElementById('permitApplicationForm').getAttribute("action");
    var formData = new FormData();
    //formData.append('floor_plan_upload',$('#floor_plan_upload')[0].files[0]);
    //console.log(document.querySelectorAll('input'));
    document.querySelectorAll('input').forEach(element => {
        //console.log(element.getAttribute("type"));
        if (element.getAttribute("type") == "text"
            || element.getAttribute("type") == "hidden"
            || element.getAttribute("type") == "number") {
            formData.append(element.getAttribute("name"), element.value);
        }
        if (element.getAttribute("type") == "checkbox") {
            formData.append(element.getAttribute("name"), element.checked ? 1 : 0);
        }
        if (element.getAttribute("type") === "radio" && element.checked) {
            formData.append(element.getAttribute("name"), element.value);
        }
        if (element.getAttribute("type") == "file") {
            formData.append(element.getAttribute("name"), element.files[0]);
        }

    });

    document.querySelectorAll('select').forEach(element => {
        formData.append(element.getAttribute("name"), $('select#' + element.getAttribute("id")).val());
    });
    let mailing_address = document.querySelector('input[name="owner_mailing_address"]:checked');
    if (mailing_address) {
        formData.append('owner_mailing_address', mailing_address ? mailing_address.value : '');
    } else {
        formData.append('owner_mailing_address', '');

    }
    let citizen_and_qualified_alien = document.querySelector('input[name="citizen_and_qualified_alien"]:checked');
    if (citizen_and_qualified_alien) {
        formData.append('citizen_and_qualified_alien', citizen_and_qualified_alien ? citizen_and_qualified_alien.value : '');
    } else {
        formData.append('citizen_and_qualified_alien', '');

    }
    $.ajax({
        type: "POST",
        url: submitPermitApplicationUrl,
        // data: $('#permitApplicationForm').serialize(),
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function () {
            $('div#loading-wrapper').show();
        },
        success: function (data) {
            console.log(data);
            //document.getElementById('success_sound').play();
            //toastr.success(successmsg);
            toastr.success(data.message);

            /* var firmIdSection = document.getElementById('firmIdSection');
            setInterval(function () {
                var opacity = firmIdSection.style.opacity;
                if(opacity > 0){
                    firmIdSection.style.opacity = opacity - 0.1;
                }
            },500); */

            var successMsg = "";
            successMsg = "Mobile Food Permit Application Submitted Successfully! Please check your email for further instructions";
            setTimeout(() => {
                // document.querySelector('section.content').innerHTML = `<div class="alert alert-success">${successMsg}</div>`;
                // document.getElementById('savePermitApplicationBtn').style.display = 'none';

                window.location.href = successPageUrl;


            }, 2000);
        },
        error: function (error) {
            //document.getElementById('errorsound').play();
            // console.log(error);
            setTimeout(() => {
                //toastr.error(errormsg);
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
function saveTempFoodPermitApplication() {

    if (!validateTempFoodPermitApplication()) {
        return false;
    }
    var submitPermitApplicationUrl = document.getElementById('permitApplicationForm').getAttribute("action");
    var formData = new FormData();
    permitApplicationForm.querySelectorAll('input').forEach(element => {
        //console.log(element.getAttribute("type"));
        if (element.getAttribute("type") == "text"
            || element.getAttribute("type") == "email"
            || element.getAttribute("type") == "hidden"
            || element.getAttribute("type") == "number"
            || element.getAttribute("type") == "time") {
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
    document.querySelectorAll('textarea').forEach(element => {
        let name = element.getAttribute("name");
        if (!name) return;
        formData.append(name, $('#' + element.getAttribute("id")).val());
    });
    document.querySelectorAll('select').forEach(element => {
        formData.append(element.getAttribute("name"), $('select#' + element.getAttribute("id")).val());
    });

    var loadingWrapper = document.getElementById('loading-wrapper');
    loadingWrapper.style.display = 'block';
    $.ajax({
        type: "POST",
        url: submitPermitApplicationUrl,
        // data: $('#permitApplicationForm').serialize(),
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function () {
            $('div#loading-wrapper').show();
        },
        success: function (data) {
            console.log(data);
            toastr.success(data.message);
            var successMsg = "";
            successMsg = "Temp Food Permit Application Submitted Successfully! Please check your email for further instructions";
            setTimeout(() => {
                window.location.href = successPageUrl;
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
function saveCosmetologyPermitApplication() {
    if (!validateCosmetologyPermitApplication()) {
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
            // } else if (type === "checkbox") {
            //     formData.append(name, element.checked ? 1 : 0);
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
            console.log(data);
            toastr.success(data.message);


            var successMsg = "";
            successMsg = "Mobile Food Permit Application Submitted Successfully! Please check your email for further instructions";
            setTimeout(() => {
                window.location.href = successPageUrl;


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

function savePoolApplication() {

    // console.log('asd');

    // document.getElementById('savePermitApplicationBtn')?.addEventListener('click', function (e) {
    if (!validatePoolPermitApplication()) {
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
        formData.append(element.getAttribute("name"), element.value || '');
    });
    var loadingWrapper = document.getElementById('loading-wrapper');
    loadingWrapper.style.display = 'block';
    var xhr = new XMLHttpRequest();
    xhr.open("POST", submitPermitApplicationUrl, false);
    // xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);
    xhr.getResponseHeader("Content-type", "application/json");
    xhr.onload = function (e) {
        const response = JSON.parse(this.responseText);

        // console.log(e.pid);
        if (this.status == 200) {
            console.log(response.pid); // Now pid exists if server returns it
            if (response.pid) {
                certifiedPoolsOperators(response.pid); // ✅ now called correctly
            } else {
                console.warn('PID not found in response!');
            }
            setTimeout(function () {
                loadingWrapper.style.display = 'none';
                toastr.success("Upload Successfully!");
                location.href = successPageUrl;
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
    // });
}
function saveDayCareApplication() {
    if (!validateDayCarePermitApplication()) {
        return false;
    }
    var permitApplicationForm = document.getElementById('permitApplicationForm');
    var submitPermitApplicationUrl = permitApplicationForm.getAttribute("action");
    var formData = new FormData();
    formData.append(
        '_token',
        document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    );
    permitApplicationForm.querySelectorAll('input').forEach(element => {
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

            if (element.checked) {
                formData.append(
                    element.getAttribute("name"),
                    element.value
                );
            }

        }
        if (element.getAttribute("type") == "file") {
            formData.append(element.getAttribute("name"), element.files[0]);
        }
    });
    document.querySelectorAll('select').forEach(element => {
        formData.append(element.getAttribute("name"), element.value || '');
    });
    var loadingWrapper = document.getElementById('loading-wrapper');
    loadingWrapper.style.display = 'block';
    var xhr = new XMLHttpRequest();
    xhr.open("POST", submitPermitApplicationUrl, false);
    // xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);
    xhr.getResponseHeader("Content-type", "application/json");
    xhr.onload = function (e) {
        const response = JSON.parse(this.responseText);

        // console.log(e.pid);
        if (this.status == 200) {
            successMsg = "Permit Application Submitted Successfully! Please check your email for further instructions";
            toastr.success(successMsg);
            setTimeout(() => {
                window.location.href = successPageUrl;
            }, 2000);
        }
        else {
            const response = JSON.parse(this.responseText);
            console.log(response);
            loadingWrapper.style.display = 'none';
            toastr.error(response.message);
        }
    }
    xhr.send(formData);

}
function saveFarmerMarketApplication() {

    // console.log('asd');

    // document.getElementById('savePermitApplicationBtn')?.addEventListener('click', function (e) {
    if (!validateFarmersMarketPermitApplication()) {
        return false;
    }
    var permitApplicationForm = document.getElementById('permitApplicationForm');
    var submitPermitApplicationUrl = permitApplicationForm.getAttribute("action");
    var formData = new FormData();
    formData.append(
        '_token',
        document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    );
    permitApplicationForm.querySelectorAll('input').forEach(element => {
        //console.log(element.getAttribute("type"));
        if (element.getAttribute("type") == "text"
            || element.getAttribute("type") == "email"
            || element.getAttribute("type") == "hidden"
            || element.getAttribute("type") == "number"
            || element.getAttribute("type") == "time") {
            formData.append(element.getAttribute("name"), element.value);
        }
        if (element.getAttribute("type") === "radio") {
            const name = element.getAttribute("name");
            const checkedValue = document.querySelector(`input[name="${name}"]:checked`)?.value || '';
            formData.append(name, checkedValue);
        }
        // if (element.getAttribute("type") == "checkbox") {
        //     formData.append(element.getAttribute("name"), element.checked ? 1 : 0);
        // }
        if (element.getAttribute("type") == "checkbox") {

            if (element.checked) {
                formData.append(
                    element.getAttribute("name"),
                    element.value
                );
            }

        }
        if (element.getAttribute("type") == "file") {
            formData.append(element.getAttribute("name"), element.files[0]);
        }
    });
    document.querySelectorAll('textarea').forEach(element => {
        let name = element.getAttribute("name");
        if (!name) return;
        formData.append(name, $('#' + element.getAttribute("id")).val());
    });

    document.querySelectorAll('select').forEach(element => {
        formData.append(element.getAttribute("name"), element.value || '');
    });
    var loadingWrapper = document.getElementById('loading-wrapper');
    loadingWrapper.style.display = 'block';
    var xhr = new XMLHttpRequest();
    xhr.open("POST", submitPermitApplicationUrl, false);
    // xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);
    xhr.getResponseHeader("Content-type", "application/json");
    xhr.onload = function (e) {
        const response = JSON.parse(this.responseText);

        // console.log(e.pid);
        if (this.status == 200) {
            successMsg = "Permit Application Submitted Successfully! Please check your email for further instructions";
            toastr.success(successMsg);
            setTimeout(() => {
                window.location.href = successPageUrl;
            }, 2000);
        }
        else {
            const response = JSON.parse(this.responseText);
            console.log(response);
            loadingWrapper.style.display = 'none';
            toastr.error(response.message);
        }
    }
    xhr.send(formData);
    // });

}
function saveHotelPermitApplication() {
     if (!validateHotelPermitApplication()) {
        return false;
    }

    var permitApplicationForm = document.getElementById('permitApplicationForm');
    var submitPermitApplicationUrl = permitApplicationForm.getAttribute("action");
    var formData = new FormData();
    formData.append(
        '_token',
        document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    );


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
        // if (element.getAttribute("type") == "checkbox") {
        //     formData.append(element.getAttribute("name"), element.checked ? 1 : 0);
        // }
        if (element.getAttribute("type") == "checkbox") {

            if (element.checked) {
                formData.append(
                    element.getAttribute("name"),
                    element.value
                );
            }

        }
        if (element.getAttribute("type") == "file") {
            formData.append(element.getAttribute("name"), element.files[0]);
        }
    });
    document.querySelectorAll('select').forEach(element => {
        formData.append(element.getAttribute("name"), element.value || '');
    });


    var loadingWrapper = document.getElementById('loading-wrapper');
    loadingWrapper.style.display = 'block';
    var xhr = new XMLHttpRequest();
    xhr.open("POST", submitPermitApplicationUrl, false);
    // xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);
    xhr.getResponseHeader("Content-type", "application/json");
    xhr.onload = function (e) {
        const response = JSON.parse(this.responseText);

        // console.log(e.pid);
        if (this.status == 200) {
            successMsg = "Permit Application Submitted Successfully! Please check your email for further instructions";
            toastr.success(successMsg);
            setTimeout(() => {
                window.location.href = successPageUrl;
            }, 2000);
        }
        else {
            const response = JSON.parse(this.responseText);
            console.log(response);
            loadingWrapper.style.display = 'none';
            toastr.error(response.message);
        }
    }
    xhr.send(formData);
}

function validateHotelPermitApplication() {
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




$(document).on('change', '.pool-select', function () {

    let row = $(this).closest('.pool-row');
    let val = $(this).val();

    if (val === 'Other') {
        row.find('.other-box').removeClass('d-none');
    } else {
        row.find('.other-box').addClass('d-none');
        row.find('.other-box input').val('');
    }
});






function validateFarmersMarketPermitApplication() {

    let flg = 0;
    var vendor_type = $('input[name="vendor_type"]:checked').length ? 1 : 0;
    if (vendor_type == 0) {
        // toastr.error("Please Check Vendor Type");
        $('#vendor_type_error').text("ⓘ Required Field");
        flg = 1;

    }
    const requiredFields = [
        'booth_name',
        'market_name',
        'application_date',
        'market_time',
        'market_master',
        'market_email',
        'market_location',
        'contact_person',

        'mailing_address',
        'booth_email',
        'city',
        'state',
        'zip',
        'booth_phone',
        'farmers_provide_copy_of_draw_layout',
        'food_beverage',
        'how_food_prepared',
        'how_cold_food',
        'sampling',
        'water_source',
        'how_utensils',
        'how_handwashing',
        'toilet_facility',

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
function validatePoolPermitApplication() {
    var flg = 0;

    var pool_name = $('#pool_name').val();
    if (pool_name == "") {
        $('#pool_name_error').text("ⓘ Required Field");
        flg = 1;
    }
    var pool_address = $('#pool_address').val();
    if (pool_address == "") {
        $('#pool_address_error').text("ⓘ Required Field");
        flg = 1;
    }
    var owner_name = $('#owner_name').val();
    if (owner_name == "") {
        $('#owner_name_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#event_sponsor_error').html("");
        // }, 5000)
        flg = 1;
    }

    var number_of_pools = $('#number_of_pools').val();
    if (number_of_pools == "") {
        $('#number_of_pools_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#location_of_event_error').html("");
        // }, 5000)
        flg = 1;
    }

    var applicant_signature_date = $('#applicant_signature_date').val();
    if (applicant_signature_date == "") {
        $('#applicant_signature_date_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#applicant_signature_date_error').html("");
        }, 5000)
        flg = 1;
    }



    if (flg == 1) { return false; }
    else { return true; }
}



function validateFoodPermitApplication() {
    var flg = 0;
    // console.log('dd');

    var fee_id = $('#fee_id').val();
    if (fee_id == "") {
        $('#fee_id_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#fee_id_error').html("");
        }, 5000)
        flg = 1;
    }


    var non_profit = $('#non_profit').val();
    if (non_profit == "") {
        $('#non_profit_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#non_profit_error').html("");
        }, 5000)
        flg = 1;
    }


    var application_type_id = $('#application_type_id').val();
    if (application_type_id == "") {
        $('#application_type_id_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#application_type_id_error').html("");
        }, 5000)
        flg = 1;
    }

    var business_type_id = $('#business_type_id').val();
    if(business_type_id == ""){
        $('#business_type_id_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#business_type_id_error').html("");
        }, 5000)
        flg = 1;
    }

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

    var est_mailing_city = $('#est_mailing_city').val();
    if (est_mailing_city == "") {
        $('#est_mailing_city_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_mailing_city_error').html("");
        }, 5000)
        flg = 1;
    }

    var est_mailing_state = $('#est_mailing_state').val();
    if (est_mailing_state == "") {
        $('#est_mailing_state_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_mailing_state_error').html("");
        }, 5000)
        flg = 1;
    }

    var est_mailing_zip = $('#est_mailing_zip').val();
    if (est_mailing_zip == "") {
        $('#est_mailing_zip_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_mailing_zip_error').html("");
        }, 5000)
        flg = 1;
    }

    var est_phone = $('#est_phone').val();
    if (est_phone == "") {
        $('#est_phone_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_phone_error').html("");
        }, 5000)
        flg = 1;
    }


    var est_email = $('#est_email').val();
    if (est_email == "") {
        $('#est_email_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_email_error').html("");
        }, 5000)
        flg = 1;
    }



    var est_billing_address = $('#est_billing_address').val();
    if (est_billing_address == "") {
        $('#est_billing_address_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_billing_address_error').html("");
        }, 5000)
        flg = 1;
    }
    var est_billing_city = $('#est_billing_city').val();
    if (est_billing_city == "") {
        $('#est_billing_city_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_billing_city_error').html("");
        }, 5000)
        flg = 1;
    }
    var est_billing_state = $('#est_billing_state').val();
    if (est_billing_state == "") {
        $('#est_billing_state_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_billing_state_error').html("");
        }, 5000)
        flg = 1;
    }
    var est_billing_state = $('#est_billing_state').val();
    if (est_billing_state == "") {
        $('#est_billing_state_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_billing_state_error').html("");
        }, 5000)
        flg = 1;
    }
    var est_billing_zip = $('#est_billing_zip').val();
    if (est_billing_zip == "") {
        $('#est_billing_zip_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_billing_zip_error').html("");
        }, 5000)
        flg = 1;
    }
    var seating_capacity = $('#seating_capacity').val();
    if (seating_capacity == "") {
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
    if (owner_name == "") {
        $('#owner_name_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_name_error').html("");
        }, 5000)
        flg = 1;
    }

    var owner_address = $('#owner_address').val();
    if (owner_address == "") {
        $('#owner_address_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_address_error').html("");
        }, 5000)
        flg = 1;
    }

    var owner_phone = $('#owner_phone').val();
    if (owner_phone == "") {
        $('#owner_phone_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_phone_error').html("");
        }, 5000)
        flg = 1;
    }



    var owner_city = $('#owner_city').val();
    if (owner_city == "") {
        $('#owner_city_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_city_error').html("");
        }, 5000)
        flg = 1;
    }

    var owner_state = $('#owner_state').val();
    if (owner_state == "") {
        $('#owner_state_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_state_error').html("");
        }, 5000)
        flg = 1;
    }
    var owner_zip = $('#owner_zip').val();
    if (owner_zip == "") {
        $('#owner_zip_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_zip_error').html("");
        }, 5000)
        flg = 1;
    }
    var owner_email = $('#owner_email').val();
    if (owner_email == "") {
        $('#owner_email_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_email_error').html("");
        }, 5000)
        flg = 1;
    } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        var email = emailRegex.test(owner_email);
        console.log(email);
        if (!email) {
            $('#owner_email_error').text("ⓘ Invalid email");
            setTimeout(() => {
                $('#owner_email_error').html("");
            }, 5000)
            flg = 1;
        }

    }


    var onsite_manager = $('#onsite_manager').val();
    if (onsite_manager == "") {
        $('#onsite_manager_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#onsite_manager_error').html("");
        }, 5000)
        flg = 1;
    }


    var applicant_signature_date = $('#applicant_signature_date').val();
    if (applicant_signature_date == "") {
        $('#applicant_signature_date_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#applicant_signature_date_error').html("");
        }, 5000)
        flg = 1;
    }

    // if(document.querySelector('input[name="_method"]').value == 'POST'){
    //     if(isCanvasBlank(applicantCanvas)){
    //         toastr.error("Please fill the signatures before submitting");
    //         flg = 1;
    //     }

    // }
    if (flg == 1) { return false; }
    else if (isCanvasBlank(applicantCanvas)) {
        toastr.error("Please fill the signatures before submitting");
        return false;
    }
    else { return true; }
}


function validateMobileFoodPermitApplication() {
    var flg = 0;


    var fee_id = $('#fee_id').val();
    if (fee_id == "") {
        $('#fee_id_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#fee_id_error').html("");
        }, 5000)
        flg = 1;
    }


    var non_profit = $('#non_profit').val();
    if (non_profit == "") {
        $('#non_profit_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#non_profit_error').html("");
        }, 5000)
        flg = 1;
    }


    var application_type_id = $('#application_type_id').val();
    if (application_type_id == "") {
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

    var est_mailing_city = $('#est_mailing_city').val();
    if (est_mailing_city == "") {
        $('#est_mailing_city_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_mailing_city_error').html("");
        }, 5000)
        flg = 1;
    }

    var est_mailing_state = $('#est_mailing_state').val();
    if (est_mailing_state == "") {
        $('#est_mailing_state_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_mailing_state_error').html("");
        }, 5000)
        flg = 1;
    }

    var est_mailing_zip = $('#est_mailing_zip').val();
    if (est_mailing_zip == "") {
        $('#est_mailing_zip_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_mailing_zip_error').html("");
        }, 5000)
        flg = 1;
    }

    var est_phone = $('#est_phone').val();
    if (est_phone == "") {
        $('#est_phone_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_phone_error').html("");
        }, 5000)
        flg = 1;
    }


    var est_email = $('#est_email').val();
    if (est_email == "") {
        $('#est_email_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_email_error').html("");
        }, 5000)
        flg = 1;
    }



    var est_billing_address = $('#est_billing_address').val();
    if (est_billing_address == "") {
        $('#est_billing_address_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_billing_address_error').html("");
        }, 5000)
        flg = 1;
    }

    // var est_mailing_address_2 = $('#est_mailing_address_2').val();
    // if (est_mailing_address_2 == "") {
    //     $('#est_mailing_address_2_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#est_mailing_address_2_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }



    var est_billing_city = $('#est_billing_city').val();
    if (est_billing_city == "") {
        $('#est_billing_city_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_billing_city_error').html("");
        }, 5000)
        flg = 1;
    }
    var est_billing_state = $('#est_billing_state').val();
    if (est_billing_state == "") {
        $('#est_billing_state_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_billing_state_error').html("");
        }, 5000)
        flg = 1;
    }
    var est_billing_state = $('#est_billing_state').val();
    if (est_billing_state == "") {
        $('#est_billing_state_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_billing_state_error').html("");
        }, 5000)
        flg = 1;
    }
    var est_billing_zip = $('#est_billing_zip').val();
    if (est_billing_zip == "") {
        $('#est_billing_zip_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#est_billing_zip_error').html("");
        }, 5000)
        flg = 1;
    }
    // var seating_capacity = $('#seating_capacity').val();
    // if (seating_capacity == "") {
    //     $('#seating_capacity_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#seating_capacity_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var days_of_operation = $('#days_of_operation').val();
    // if(days_of_operation == ""){
    //     $('#days_of_operation_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#days_of_operation_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }



    // Areas of Operation
    if (!$("input[name='branford']:checked").length) {
        $("#branford_error").text("ⓘ Required Field");
        flg = 1;
    }

    if (!$("input[name='north_branford']:checked").length) {
        $("#north_branford_error").text("ⓘ Required Field");
        flg = 1;
    }

    if (!$("input[name='east_haven']:checked").length) {
        $("#east_haven_error").text("ⓘ Required Field");
        flg = 1;
    }

    $("input[name='branford']").change(function () {
        $("#branford_error").text("");
    });

    $("input[name='north_branford']").change(function () {
        $("#north_branford_error").text("");
    });

    $("input[name='east_haven']").change(function () {
        $("#east_haven_error").text("");
    });






    var owner_name = $('#owner_name').val();
    if (owner_name == "") {
        $('#owner_name_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_name_error').html("");
        }, 5000)
        flg = 1;
    }

    var owner_address = $('#owner_address').val();
    if (owner_address == "") {
        $('#owner_address_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_address_error').html("");
        }, 5000)
        flg = 1;
    }

    var owner_phone = $('#owner_phone').val();
    if (owner_phone == "") {
        $('#owner_phone_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_phone_error').html("");
        }, 5000)
        flg = 1;
    }



    var owner_city = $('#owner_city').val();
    if (owner_city == "") {
        $('#owner_city_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_city_error').html("");
        }, 5000)
        flg = 1;
    }

    var owner_state = $('#owner_state').val();
    if (owner_state == "") {
        $('#owner_state_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_state_error').html("");
        }, 5000)
        flg = 1;
    }
    var owner_zip = $('#owner_zip').val();
    if (owner_zip == "") {
        $('#owner_zip_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_zip_error').html("");
        }, 5000)
        flg = 1;
    }
    var owner_email = $('#owner_email').val();
    if (owner_email == "") {
        $('#owner_email_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#owner_email_error').html("");
        }, 5000)
        flg = 1;
    } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        var email = emailRegex.test(owner_email);
        console.log(email);
        if (!email) {
            $('#owner_email_error').text("ⓘ Invalid email");
            setTimeout(() => {
                $('#owner_email_error').html("");
            }, 5000)
            flg = 1;
        }

    }


    var onsite_manager = $('#onsite_manager').val();
    if (onsite_manager == "") {
        $('#onsite_manager_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#onsite_manager_error').html("");
        }, 5000)
        flg = 1;
    }

    var manager_phone = $('#manager_phone').val();
    if (manager_phone == "") {
        $('#manager_phone_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#manager_phone_error').html("");
        }, 5000)
        flg = 1;
    }
    var manager_email = $('#manager_email').val();
    if (manager_email == "") {
        $('#manager_email_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#manager_email_error').html("");
        }, 5000)
        flg = 1;
    }
    var food_protection_manager = $('#food_protection_manager').val();
    if (food_protection_manager == "") {
        $('#food_protection_manager_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#food_protection_manager_error').html("");
        }, 5000)
        flg = 1;
    }








    var applicant_signature_date = $('#applicant_signature_date').val();
    if (applicant_signature_date == "") {
        $('#applicant_signature_date_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#applicant_signature_date_error').html("");
        }, 5000)
        flg = 1;
    }


    if (flg == 1) { return false; }
    else if (isCanvasBlank(applicantCanvas)) {
        toastr.error("Please fill the signatures before submitting");
        return false;
    }
    else { return true; }
}

function validateCosmetologyPermitApplication() {
    let flg = 0;

    const requiredFields = [
        'est_name',
        'est_phone',
        'est_address',
        'est_town',
        'est_state',
        'est_zip',
        'est_mailing_address',
        'est_mailing_town',
        'est_mailing_state',
        'est_mailing_zip',
        'est_mailing_email',
        'owner_name',
        'owner_phone',
        'owner_email',
        'owner_address',
        'owner_town',
        'owner_state',
        'owner_zip',
        'operator_name',
        'operator_phone',
        'operator_email',
        'operator_address',
        'operator_town',
        'operator_state',
        'operator_zip',
        'workstation',
        'work_space',
        'station_rented',
        'days_of_operation',
        'list_all_employees',
        'water_supply',
        'sewage_disposal',


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

    if ($('input[name="type_of_service[]"]:checked').length === 0) {
        $('#type_of_service_error').text('ⓘ Please select at least one service');
        flg = 1;
    } else {
        $('#type_of_service_error').text('');
    }

    if ($('input[name="type_of_ownership[]"]:checked').length === 0) {
        $('#type_of_ownership_error').text('ⓘ Please select at least one ownership');
        flg = 1;
    } else {
        $('#type_of_ownership_error').text('');
    }
    return flg === 0;
}

// function validateTempFoodPermitApplication() {
//     var flg = 0;

//     var event = $('#event').val();
//     if (event == "") {
//         $('#event_error').text("ⓘ Required Field");
//         flg = 1;
//     }
//     // var date_of_event = $('#date_of_event').val();
//     // if (date_of_event == "") {
//     //     $('#date_of_event_error').text("ⓘ Required Field");
//     //     flg = 1;
//     // }
//     var location_of_event = $('#location_of_event').val();
//     if (location_of_event == "") {
//         $('#location_of_event_error').text("ⓘ Required Field");

//         flg = 1;
//     }


//     var date_of_event = $('#date_of_event').val();
//     if (date_of_event == "") {
//         $('#date_of_event_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var end_date = $('#end_date').val();
//     if (end_date == "") {
//         $('#end_date_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var time = $('#time').val();
//     if (time == "") {
//         $('#time_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var event_organizer = $('#event_organizer').val();
//     if (event_organizer == "") {
//         $('#event_organizer_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var cell_phone = $('#cell_phone').val();
//     if (cell_phone == "") {
//         $('#cell_phone_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var event_organizer_email = $('#event_organizer_email').val();
//     if (event_organizer_email == "") {
//         $('#event_organizer_email_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var name_of_food_booth = $('#name_of_food_booth').val();
//     if (name_of_food_booth == "") {
//         $('#name_of_food_booth_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var vendor_contact = $('#vendor_contact').val();
//     if (vendor_contact == "") {
//         $('#vendor_contact_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var vendor_cell_phone = $('#vendor_cell_phone').val();
//     if (vendor_cell_phone == "") {
//         $('#vendor_cell_phone_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var vendor_email = $('#vendor_email').val();
//     if (vendor_email == "") {
//         $('#vendor_email_error').text("ⓘ Required Field");

//         flg = 1;
//     }






//     var list_all_foods_beverages = $('#list_all_foods_beverages').val();
//     if (list_all_foods_beverages == "") {
//         $('#list_all_foods_beverages_error').text("ⓘ Required Field");

//         flg = 1;
//     }

//     var When_food_purchased = $('#When_food_purchased').val();
//     if (When_food_purchased == "") {
//         $('#When_food_purchased_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var what_time_food_delivered = $('#what_time_food_delivered').val();
//     if (what_time_food_delivered == "") {
//         $('#what_time_food_delivered_error').text("ⓘ Required Field");

//         flg = 1;
//     }


//     // Clear previous errors
//     $("#below_41F_error").text("");
//     $("#during_transportation_cold_details_error").text("");
//     $("#at_the_event_site_cold_details_error").text("");

//     let transportChecked = $("#during_transportation_cold").is(":checked");
//     let eventChecked = $("#at_the_event_site_cold").is(":checked");

//     // At least one checkbox should be selected
//     if (!transportChecked && !eventChecked) {
//         $("#below_41F_error").text("Please select at least one option.");
//          flg = 1;
//     }

//     // During transportation details required
//     if (transportChecked) {
//         let details = $("#during_transportation_cold_details").val().trim();
//         if (details === "") {
//             $("#during_transportation_cold_details_error").text("Please enter details.");
//              flg = 1;
//         }
//     }

//     // At the event site details required
//     if (eventChecked) {
//         let details = $("#at_the_event_site_cold_details").val().trim();
//         if (details === "") {
//             $("#at_the_event_site_cold_details_error").text("Please enter details.");
//              flg = 1;
//         }
//     }



//     $("#above_135F_error").text("");
//     $("#during_transportation_hot_details_error").text("");
//     $("#at_the_event_site_hot_details_error").text("");

//     let transportCheckedHot = $("#during_transportation_hot").is(":checked");
//     let eventCheckedHot = $("#at_the_event_site_hot").is(":checked");

//     // At least one checkbox should be selected
//     if (!transportCheckedHot && !eventCheckedHot) {
//         $("#above_135F_error").text("Please select at least one option.");
//          flg = 1;
//     }

//     // During transportation details required
//     if (transportCheckedHot) {
//         let details = $("#during_transportation_hot_details").val().trim();
//         if (details === "") {
//             $("#during_transportation_hot_details_error").text("Please enter details.");
//              flg = 1;
//         }
//     }

//     // At the event site details required
//     if (eventCheckedHot) {
//         let details = $("#at_the_event_site_hot_details").val().trim();
//         if (details === "") {
//             $("#at_the_event_site_hot_details_error").text("Please enter details.");
//              flg = 1;
//         }
//     }



//     // Clear previous errors
//     $("#indicate_how_foods_will_be_prepared_error").text("");
//     $("#prepared_at_licensed_facility_note_error").text("");
//     $("#prepared_at_the_event_note_error").text("");

//     let licensedChecked = $("#prepared_at_licensed_facility").is(":checked");
//     let eventCheckedPrepared = $("#prepared_at_the_event").is(":checked");

//     // At least one option must be selected
//     if (!licensedChecked && !eventCheckedPrepared) {
//         $("#indicate_how_foods_will_be_prepared_error").text("Please select at least one option.");
//          flg = 1;
//     }

//     // Prepared at licensed facility
//     if (licensedChecked) {
//         let note = $("#prepared_at_licensed_facility_note").val().trim();

//         if (note === "") {
//             $("#prepared_at_licensed_facility_note_error").text("Please enter facility name.");
//              flg = 1;
//         }
//     }

//     // Prepared at the event
//     if (eventCheckedPrepared) {
//         let note = $("#prepared_at_the_event_note").val().trim();

//         if (note === "") {
//             $("#prepared_at_the_event_note_error").text("Please enter details.");
//              flg = 1;
//         }
//     }
















//     var list_where_food_will_be_stored = $('#list_where_food_will_be_stored').val();
//     if (list_where_food_will_be_stored == "") {
//         $('#list_where_food_will_be_stored_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var handwashing_stations = $('#handwashing_stations').val();
//     if (handwashing_stations == "") {
//         $('#handwashing_stations_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var location_of_worker_toilet = $('#location_of_worker_toilet').val();
//     if (location_of_worker_toilet == "") {
//         $('#location_of_worker_toilet_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var describe_sanitized = $('#describe_sanitized').val();
//     if (describe_sanitized == "") {
//         $('#describe_sanitized_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var type_of_sanitizer = $('#type_of_sanitizer').val();
//     if (type_of_sanitizer == "") {
//         $('#type_of_sanitizer_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var test_strips = $('#test_strips').val();
//     if (test_strips == "") {
//         $('#test_strips_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var leftovers = $('#leftovers').val();
//     if (leftovers == "") {
//         $('#leftovers_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var internal_temperatures = $('#internal_temperatures').val();
//     if (internal_temperatures == "") {
//         $('#internal_temperatures_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var water_supply = $('#water_supply').val();
//     if (water_supply == "") {
//         $('#water_supply_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var outdoor_elements = $('#outdoor_elements').val();
//     if (outdoor_elements == "") {
//         $('#outdoor_elements_error').text("ⓘ Required Field");

//         flg = 1;
//     }
//     var wastewater_be_disposed = $('#wastewater_be_disposed').val();
//     if (wastewater_be_disposed == "") {
//         $('#wastewater_be_disposed_error').text("ⓘ Required Field");

//         flg = 1;
//     }





















//     var applicant_signature_date = $('#applicant_signature_date').val();
//     if (applicant_signature_date == "") {
//         $('#applicant_signature_date_error').text("ⓘ Required Field");
//         setTimeout(() => {
//             $('#applicant_signature_date_error').html("");
//         }, 5000)
//         flg = 1;
//     }

//     if (flg == 1) { return false; }
//     else { return true; }
// }


function validateTempFoodPermitApplication() {

    let flg = 0;

    $(".error").text("");

    //==========================
    // Required Fields
    //==========================

    const requiredFields = [
        "event",
        "location_of_event",
        "date_of_event",
        "end_date",
        "time",
        "event_organizer",
        "cell_phone",
        "event_organizer_email",
        "name_of_food_booth",
        "vendor_contact",
        "vendor_cell_phone",
        "vendor_email",
        "list_all_foods_beverages",
        "When_food_purchased",
        "what_time_food_delivered",
        "list_where_food_will_be_stored",
        "handwashing_stations",
        "location_of_worker_toilet",
        "describe_sanitized",
        "type_of_sanitizer",
        "test_strips",
        "leftovers",
        "internal_temperatures",
        "water_supply",
        "outdoor_elements",
        "wastewater_be_disposed",
        "applicant_signature_date"
    ];

    requiredFields.forEach(function (id) {
        if (!checkRequired(id)) {
            flg = 1;
        }
    });

    //==========================
    // Cold Food (Below 41°F)
    //==========================

    if (!validateCheckboxGroup({
        firstCheckbox: "#during_transportation_cold",
        secondCheckbox: "#at_the_event_site_cold",

        firstDetail: "#during_transportation_cold_details",
        secondDetail: "#at_the_event_site_cold_details",

        firstDetailError: "#during_transportation_cold_details_error",
        secondDetailError: "#at_the_event_site_cold_details_error",

        groupError: "#below_41F_error"
    })) {
        flg = 1;
    }

    //==========================
    // Hot Food (Above 135°F)
    //==========================

    if (!validateCheckboxGroup({
        firstCheckbox: "#during_transportation_hot",
        secondCheckbox: "#at_the_event_site_hot",

        firstDetail: "#during_transportation_hot_details",
        secondDetail: "#at_the_event_site_hot_details",

        firstDetailError: "#during_transportation_hot_details_error",
        secondDetailError: "#at_the_event_site_hot_details_error",

        groupError: "#above_135F_error"
    })) {
        flg = 1;
    }

    //==========================
    // Food Preparation
    //==========================

    $("#prepared_at_licensed_facility_note_error").text("");
    $("#prepared_at_the_event_note_error").text("");

    let licensed = $("#prepared_at_licensed_facility").is(":checked");
    let prepared = $("#prepared_at_the_event").is(":checked");

    if (!licensed && !prepared) {
        $("#indicate_how_foods_will_be_prepared_error")
            .text("Please select at least one option.");
        flg = 1;
    }

    if (licensed &&
        $("#prepared_at_licensed_facility_note").val().trim() === "") {

        $("#prepared_at_licensed_facility_note_error")
            .text("Please enter details.");

        flg = 1;
    }

    if (prepared &&
        $("#prepared_at_the_event_note").val().trim() === "") {

        $("#prepared_at_the_event_note_error")
            .text("Please enter details.");

        flg = 1;
    }

    //==========================
    // Signature Date
    //==========================

    if ($("#applicant_signature_date").val().trim() === "") {

        $("#applicant_signature_date_error")
            .text("ⓘ Required Field");

        setTimeout(function () {
            $("#applicant_signature_date_error").text("");
        }, 5000);

        flg = 1;
    }

    return flg === 0;
}
function validateDayCarePermitApplication() {
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
$(document).on('input change', 'input, textarea, select', function () {
    $('#' + this.id + '_error').text('');
});

function isCanvasBlank(canvas) {
    return !canvas.getContext('2d')
        .getImageData(0, 0, canvas.width, canvas.height).data
        .some(channel => channel !== 0);
}


$('#sameAddresscheck').change(function () {
    let ischecked = $(this).is(':checked');
    let est_mailing_address = $('#est_mailing_address').val();
    // let est_mailing_city = $('#est_mailing_city').val();
    let est_mailing_state = $('#est_mailing_state').val();
    let est_mailing_zip = $('#est_mailing_zip').val();

    if (!ischecked) {
        $('#est_billing_address').val('');
        // $('#est_billing_city').val('');
        $('#est_billing_state').val('');
        $('#est_billing_zip').val('');
    } else {
        $('#est_billing_address').val(est_mailing_address);
        // $('#est_billing_city').val(est_mailing_city);
        $('#est_billing_state').val(est_mailing_state);
        $('#est_billing_zip').val(est_mailing_zip);
    }

});


$('#sameOwnercheck').change(function () {
    let ischecked = $(this).is(':checked');
    let owner_name = $('#owner_name').val();
    let owner_phone = $('#owner_phone').val();
    let owner_email = $('#owner_email').val();

    if (!ischecked) {
        $('#onsite_manager').val('');
        $('#manager_phone').val('');
        $('#manager_email').val('');
    } else {
        $('#onsite_manager').val(owner_name);
        $('#manager_phone').val(owner_phone);
        $('#manager_email').val(owner_email);
    }

});

function workSpace(e) {
    console.log(e.value);
    var value = e.value;
    if (value == 'Yes') {
        $('.stationRented').removeClass('hideOnLoad');
    } else {
        $('.stationRented').addClass('hideOnLoad');
        $('#station_rented').val('');

    }
}
$('input[name="type_of_service[]"]').on('change', function () {
    if ($(this).val() == 12 && $(this).is(':checked')) {
        $('.other_service').removeClass('hideOnLoad');
    }

    if ($(this).val() == 12 && !$(this).is(':checked')) {
        $('.other_service').addClass('hideOnLoad');
        $('#other_service').val('');
    }
});
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
        beforeSend: function () {
            $('#overlay').show();
        },
        success: function (response) {
            $('#overlay').hide();

            console.log(response.areas);
            if (response.areas == '') {
                $('#area').val('');
                $('select#area').html('<option value="">SELECT AREA</option>');
            } else {
                var options = `<option value="">Select Area</option>`;
                response.areas.forEach(function (item, index) {
                    options +=
                        `<option value="${item.area_id}" >${item.area.area_number}</option>`;
                });
                $('select#area').html(options);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
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


function coldDuring(e) {
    if (e.checked) {
        $('.during_transportation').removeClass('hideOnLoad');
    } else {
        $('.during_transportation').addClass('hideOnLoad');
    }
    // console.log(e.value);
    // var value = e.value;
    // if (value == 'during_transportation') {
    //     $('.during_transportation').removeClass('hideOnLoad');
    //     $('.at_the_event_site').addClass('hideOnLoad');
    // } else if (value == 'at_the_event_site') {
    //     $('.at_the_event_site').removeClass('hideOnLoad');
    //     $('.during_transportation').addClass('hideOnLoad');
    // } else {
    //     $('.during_transportation').addClass('hideOnLoad');
    //     $('.at_the_event_site').addClass('hideOnLoad');
    // }
}

function coldEventSite(e) {
    if (e.checked) {
        $('.at_the_event_site').removeClass('hideOnLoad');
    } else {
        $('.at_the_event_site').addClass('hideOnLoad');
    }

}

function hotDuring(e) {
    if (e.checked) {
        $('.during_transportation_hot_details').removeClass('hideOnLoad');
    } else {
        $('.during_transportation_hot_details').addClass('hideOnLoad');
    }
}

function hotEventSite(e) {
    if (e.checked) {
        $('.at_the_event_site_hot_details').removeClass('hideOnLoad');
    } else {
        $('.at_the_event_site_hot_details').addClass('hideOnLoad');
    }

}

function hot(e) {
    // console.log(e.value);
    var value = e.value;
    if (value == 'during_transportation') {
        $('.during_transportation_hot').removeClass('hideOnLoad');
        $('.at_the_event_site_hot').addClass('hideOnLoad');
    } else if (value == 'at_the_event_site') {
        $('.at_the_event_site_hot').removeClass('hideOnLoad');
        $('.during_transportation_hot').addClass('hideOnLoad');
    } else {
        $('.during_transportation_hot').addClass('hideOnLoad');
        $('.at_the_event_site_hot').addClass('hideOnLoad');
    }
}

function licensedFacility(e) {
    if (e.checked) {
        // console.log('checked');
        $('.prepared_at_licensed_facility').removeClass('hideOnLoad');
    } else {
        // console.log('unchecked');
        $('.prepared_at_licensed_facility').addClass('hideOnLoad');
    }
}

function preparedAtEvent(e) {
    if (e.checked) {
        $('.prepared_at_the_event').removeClass('hideOnLoad');
    } else {
        $('.prepared_at_the_event').addClass('hideOnLoad');
    }
}
$(document).ready(function () {
    let lastChecked = null;

    $('input[name="licensed_fee"]').on('click', function () {

        if (lastChecked === this) {
            // uncheck if clicked again
            this.checked = false;
            lastChecked = null;
        } else {
            lastChecked = this;
        }

    });
});


$(document).on('click', '#btnFacilityType1AddMore', function () {
    const logRows = $('.facilityTypeRow'); // all rows
    const logCount = logRows.length;
    const newLogNumber = logCount + 1;

    const originalRow = logRows.first();
    const newRow = originalRow.clone();

    // Update row attributes
    newRow.attr('data-item-id', newLogNumber);

    // Update name input
    newRow.find('input[id^="operator_"]').each(function () {
        $(this).attr('id', `operator_${newLogNumber}`)
            .attr('name', `operator_${newLogNumber}`)
            .val('');
    });

    // Update phone input
    newRow.find('input[id^="operators_phone_"]').each(function () {
        $(this).attr('id', `operators_phone_${newLogNumber}`)
            .attr('name', `operators_phone_${newLogNumber}`)
            .val('')
            .inputmask('(999) 999-9999');
    });

    // Show remove button
    if (newLogNumber > 1) {
        newRow.find('.removeBtn').removeClass('d-none');
    }

    // Insert new row after last row
    logRows.last().after(newRow);
});

// Remove row
function removeRow(el) {
    const row = $(el).closest('.facilityTypeRow');
    row.remove();
}

function removeRow(element) {
    element.closest('div.facilityTypeRow')?.remove();
}

// document.getElementById("number_of_pools").addEventListener("input", function () {

//     let count = parseInt(this.value);
//     let container = document.getElementById("poolTypeContainer");
//     container.innerHTML = "";

//     if (count > 0) {

//         for (let i = 1; i <= count; i++) {

//             let html = `
//                 <div class="row align-items-end mb-3 pool-row">

//                     <div class="col-sm-6 form-group">
//                         <label class="col-form-label text-sm text-secondary">
//                             Type of Pool ${i}
//                         </label>

//                         <select name="pools[${i}][type]"
//                                 class="form-control form-control-sm shadow pool-select">
//                             <option value="">---Select---</option>
//                             <option value="Swimming">Swimming</option>
//                             <option value="Wading">Wading</option>
//                             <option value="Whirlpool/Spa">Whirlpool/Spa</option>
//                             <option value="Splash Pad">Splash Pad</option>
//                             <option value="Other">Other</option>
//                         </select>
//                     </div>

//                     <div class="col-sm-6 form-group other-box d-none">
//                         <label class="col-form-label text-sm text-secondary">
//                             Other Type of Pool
//                         </label>

//                         <input type="text"
//                                name="pools[${i}][other]"
//                                class="form-control form-control-sm shadow"
//                                placeholder="Other Type of Pool">
//                     </div>

//                 </div>
//             `;

//             container.insertAdjacentHTML("beforeend", html);
//         }
//     }
// });

function certifiedPoolsOperators(pid) {


    let submitCertifiedPoolOp = xxx; // ✅ make sure this has URL

    let formData = new FormData();
    $('div.demo').each(function (index) {
        let logs = [];
        $(this).find('.facilityTypeRow').each(function () {
            const looping_id = $(this).data('item-id');
            // var i_id = $(this).attr('data-item-id');
            console.log(pid)
            // console.log(i_id,looping_id);

            const operator = $(`#operator_${looping_id}`).val();
            // const description = $(`#description_${looping_id}`).val();
            const operators_phone = $(`#operators_phone_${looping_id}`).val();



            if (operator || operators_phone) {
                //  console.log('code: '+code,'des: '+description,"con: "+condition);
                logs.push({
                    pid: pid,

                    looping_id: looping_id,
                    operator: operator,
                    operators_phone: operators_phone,
                });

            }


        });


        // ✅ CSRF
        formData.append('logs', JSON.stringify(logs));

        formData.append('pid', pid);

        formData.append('_token', $('input[name="_token"]').val());
        // formData.append('_method', $('input[name="_method"]').val());

        $.ajax({
            type: "POST",
            url: submitCertifiedPoolOp,
            data: formData,
            processData: false,
            contentType: false,
            beforeSend: function () {
                $('div#loading-wrapper').show();
            },
            success: function (data) {
                // toastr.success(data.message);
                // setTimeout(() => {
                //     window.location.reload();
                // }, 2000);
            },
            error: function (jqXHR) {
                $('#overlay').hide();
                let error = jqXHR.responseJSON?.message || 'Error';
                // console.log(error);
                toastr.error(error);
            },
            complete: function () {
                $('div#loading-wrapper').hide();
                $('#spin').hide();
                $('#saveicon').show();
            }
        });
    });
}

function buildingOther(e) {
    var value = e.value;
    // console.log(value);
    if (value == 'Pre-1978') {
        $('.pre_1978').removeClass('hideOnLoad');
        $('.lead_management').addClass('hideOnLoad');
    } else {
        $('.lead_management').removeClass('hideOnLoad');
        $('.pre_1978').addClass('hideOnLoad');
    }
}

$('#sameOwnercheckDayCare').change(function () {
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
$('#sameOwnercheckCos').change(function () {
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
function sewageDisposal(e) {
    console.log(e.value);
    var value = e.value;
    if (value == 'Septic System') {

        // $('.septic_system').removeClass('hideOnLoad');

        $('.date_septic_tank_last_pumped').removeClass('hideOnLoad');
        $('.septic_tank_size').removeClass('hideOnLoad');
        $('.type_size_of_leach_fields').removeClass('hideOnLoad');

    } else {
        // $('.septic_system').addClass('hideOnLoad').val('');
        $('.date_septic_tank_last_pumped').addClass('hideOnLoad');
        $('.septic_tank_size').addClass('hideOnLoad');
        $('.type_size_of_leach_fields').addClass('hideOnLoad');

    }
}

function septicSystem(e) {
    console.log(e.value);
    var value = e.value;
    if (value == 'septic_tank_size') {
        $('.septic_tank_size').removeClass('hideOnLoad');
        $('.type_size_of_leach_fields').addClass('hideOnLoad');
        $('.date_septic_tank_last_pumped').addClass('hideOnLoad');

    } else if (value == 'type_size_of_leach_fields') {
        $('.type_size_of_leach_fields').removeClass('hideOnLoad');
        $('.septic_tank_size').addClass('hideOnLoad');
        $('.date_septic_tank_last_pumped').addClass('hideOnLoad');
    } else if (value == 'date_septic_tank_last_pumped') {
        $('.date_septic_tank_last_pumped').removeClass('hideOnLoad');
        $('.septic_tank_size').addClass('hideOnLoad');
        $('.type_size_of_leach_fields').addClass('hideOnLoad');

    } else {
        $('.date_septic_tank_last_pumped').addClass('hideOnLoad');
        $('.septic_tank_size').addClass('hideOnLoad');
        $('.type_size_of_leach_fields').addClass('hideOnLoad');
    }
}

function licensedFacility(e) {
    if (e.checked) {
        // console.log('checked');
        $('.prepared_at_licensed_facility').removeClass('hideOnLoad');
    } else {
        // console.log('unchecked');
        $('.prepared_at_licensed_facility').addClass('hideOnLoad');
    }
}

function preparedAtEvent(e) {
    if (e.checked) {
        $('.prepared_at_the_event').removeClass('hideOnLoad');
    } else {
        $('.prepared_at_the_event').addClass('hideOnLoad');
    }
}

document.getElementById('eventOnly').addEventListener('change', function () {
    const eventFields = document.getElementById('eventFields');
    const nonEventFields = document.querySelectorAll('.nonEventFields');

    if (this.checked) {
        // console.log('Checkbox is checked');
        eventFields.style.display = 'block'; // Show
        nonEventFields.forEach(el => el.classList.add('d-none'));
        // Your logic when checked
    } else {
        eventFields.style.display = 'none'; // Hide
        nonEventFields.forEach(el => el.classList.remove('d-none'));

        // document.getElementById('event_name').value = '';
    }
});



function checkRequired(id) {
    $("#" + id + "_error").text("");

    if ($("#" + id).val().trim() === "") {
        $("#" + id + "_error").text("ⓘ Required Field");
        return false;
    }
    return true;
}

function validateCheckboxGroup(config) {

    $(config.groupError).text("");
    $(config.firstDetailError).text("");
    $(config.secondDetailError).text("");

    let firstChecked = $(config.firstCheckbox).is(":checked");
    let secondChecked = $(config.secondCheckbox).is(":checked");

    if (!firstChecked && !secondChecked) {
        $(config.groupError).text("Please select at least one option.");
        return false;
    }

    let valid = true;

    if (firstChecked && $(config.firstDetail).val().trim() === "") {
        $(config.firstDetailError).text("Please enter details.");
        valid = false;
    }

    if (secondChecked && $(config.secondDetail).val().trim() === "") {
        $(config.secondDetailError).text("Please enter details.");
        valid = false;
    }

    return valid;
}
