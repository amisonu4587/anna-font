$(document).ready(function () {

    // alert('fg');

    $('#saveFarmersMarketInfo').on('click', function (e) {
        // alert('fg');
        saveFarmersMarketInfo();
    });
    $('#saveGeneralInfo').on('click', function (e) {
        // alert('fg');
        saveGeneralInfo();
    });
});

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






document.addEventListener('DOMContentLoaded', function (e) {
    document.getElementById('savePermitApplicationBtn')?.addEventListener('click', function (e) {
        if (!validatePermitApplication()) {
            return false;
        }
        var permitApplicationForm = document.getElementById('permitApplicationForm');
        var submitPermitApplicationUrl = permitApplicationForm.getAttribute("action");
        var formData = new FormData();
        permitApplicationForm.querySelectorAll('input, textarea').forEach(element => {
            //console.log(element.getAttribute("type"));
            if (element.getAttribute("type") == "text"
                || element.getAttribute("type") == "email"
                || element.getAttribute("type") == "time"
                || element.getAttribute("type") == "time"
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
            if (element.tagName.toLowerCase() == "textarea") {

                formData.append(element.getAttribute("name"), element.value);

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

function validatePermitApplication() {
    var flg = 0;

    var vendor_type = $('input[name="vendor_type"]:checked').length ? 1 : 0;
    if (vendor_type == 0) {
        // toastr.error("Please Check Vendor Type");
        $('#vendor_type_error').text("ⓘ Required Field");
        flg = 1;

    }





    var booth_name = $('#booth_name').val();
    if (booth_name == "") {
        $('#booth_name_error').text("ⓘ Required Field");
        flg = 1;
    }
    var market_name = $('#market_name').val();
    if (market_name == "") {
        $('#market_name_error').text("ⓘ Required Field");
        flg = 1;
    }
    var application_date = $('#application_date').val();
    if (application_date == "") {
        $('#application_date_error').text("ⓘ Required Field");
        flg = 1;
    }
    // var exp_date = $('#exp_date').val();
    // if (exp_date == "") {
    //     $('#exp_date_error').text("ⓘ Required Field");
    //     flg = 1;
    // }
    var market_time = $('#market_time').val();
    if (market_time == "") {
        $('#market_time_error').text("ⓘ Required Field");
        flg = 1;
    }
    var market_master = $('#market_master').val();
    if (market_master == "") {
        $('#market_master_error').text("ⓘ Required Field");
        flg = 1;
    }
    var market_email = $('#market_email').val();
    if (market_email == "") {
        $('#market_email_error').text("ⓘ Required Field");
        flg = 1;
    }
    var market_location = $('#market_location').val();
    if (market_location == "") {
        $('#market_location_error').text("ⓘ Required Field");
        flg = 1;
    }
    var contact_person = $('#contact_person').val();
    if (contact_person == "") {
        $('#contact_person_error').text("ⓘ Required Field");
        flg = 1;
    }
    var mailing_address = $('#mailing_address').val();
    if (mailing_address == "") {
        $('#mailing_address_error').text("ⓘ Required Field");
        flg = 1;
    }
    var booth_email = $('#booth_email').val();
    if (booth_email == "") {
        $('#booth_email_error').text("ⓘ Required Field");
        flg = 1;
    }
    var city = $('#city').val();
    if (city == "") {
        $('#city_error').text("ⓘ Required Field");
        flg = 1;
    }
    var state = $('#state').val();
    if (state == "") {
        $('#state_error').text("ⓘ Required Field");
        flg = 1;
    }
    var zip = $('#zip').val();
    if (zip == "") {
        $('#zip_error').text("ⓘ Required Field");
        flg = 1;
    }
    var booth_phone = $('#booth_phone').val();
    if (booth_phone == "") {
        $('#booth_phone_error').text("ⓘ Required Field");
        flg = 1;
    }





    var farmers_provide_copy_of_draw_layout = $('#farmers_provide_copy_of_draw_layout').val();
    if (farmers_provide_copy_of_draw_layout == "") {
        $('#farmers_provide_copy_of_draw_layout_error').text("ⓘ Required Field");
        flg = 1;
    }
    var food_beverage = $('#food_beverage').val();
    if (food_beverage == "") {
        $('#food_beverage_error').text("ⓘ Required Field");
        flg = 1;
    }
    var how_food_prepared = $('#how_food_prepared').val();
    if (how_food_prepared == "") {
        $('#how_food_prepared_error').text("ⓘ Required Field");
        flg = 1;
    }
    var how_cold_food = $('#how_cold_food').val();
    if (how_cold_food == "") {
        $('#how_cold_food_error').text("ⓘ Required Field");
        flg = 1;
    }
    var sampling = $('#sampling').val();
    if (sampling == "") {
        $('#sampling_error').text("ⓘ Required Field");
        flg = 1;
    }
    var water_source = $('#water_source').val();
    if (water_source == "") {
        $('#water_source_error').text("ⓘ Required Field");
        flg = 1;
    }
    var how_utensils = $('#how_utensils').val();
    if (how_utensils == "") {
        $('#how_utensils_error').text("ⓘ Required Field");
        flg = 1;
    }
    var how_handwashing = $('#how_handwashing').val();
    if (how_handwashing == "") {
        $('#how_handwashing_error').text("ⓘ Required Field");
        flg = 1;
    }
    var toilet_facility = $('#toilet_facility').val();
    if (toilet_facility == "") {
        $('#toilet_facility_error').text("ⓘ Required Field");
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
function isCanvasBlank(canvas) {
    return !canvas.getContext('2d')
    .getImageData(0, 0, canvas.width, canvas.height).data
    .some(channel => channel !== 0);
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






function saveFarmersMarketInfo() {
    // alert('basic');
    if (!validatesaveFarmersMarketInfo()) {
        return false;
    }

    var submitPermitApplicationUrl = FarmersMarketDetails;
    var formData = new FormData();

    formData.append('application_date', $('#application_date').val());
    formData.append('exp_date', $('#exp_date').val());

    formData.append('market_name', $('#market_name').val());
    formData.append('market_time', $('#market_time').val());
    formData.append('market_master', $('#market_master').val());
    formData.append('market_email', $('#market_email').val());
    formData.append('market_location', $('#market_location').val());

    formData.append('booth_name', $('#booth_name').val());
    formData.append('contact_person', $('#contact_person').val());
    formData.append('mailing_address', $('#mailing_address').val());
    formData.append('booth_email', $('#booth_email').val());
    formData.append('booth_phone', $('#booth_phone').val());
    formData.append('city', $('#city').val());
    formData.append('state', $('#state').val());
    formData.append('zip', $('#zip').val());

    formData.append('assigned_to', $("#assigned_to").val() ?? '');


    // Main Vendor Type
    formData.append(
        'vendor_type',
        $('input[name="vendor_type"]:checked').val()
    );


    // Cottage Sub Type
    formData.append(
        'cottage_type',
        $('input[name="cottage_type"]:checked').val()
    );
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


function validatesaveFarmersMarketInfo() {
    var flg = 0;

    var market_name = $('#market_name').val();
    if (market_name == "") {
        $('#market_name_error').text("ⓘ Required Field");
        flg = 1;
    }
    var application_date = $('#application_date').val();
    if (application_date == "") {
        $('#application_date_error').text("ⓘ Required Field");
        flg = 1;
    }
    var exp_date = $('#exp_date').val();
    if (exp_date == "") {
        $('#exp_date_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#event_sponsor_error').html("");
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

function saveGeneralInfo() {

    if (!validateSaveGeneralInfo()) {
        return false;
    }

    var submitPermitApplicationUrl = Generalinfo;
    var formData = new FormData();
    formData.append('farmers_provide_copy_of_draw_layout', $('#farmers_provide_copy_of_draw_layout').val());

    formData.append('food_beverage', $('#food_beverage').val());

    formData.append('how_food_prepared', $('#how_food_prepared').val());

    formData.append('how_cold_food', $('#how_cold_food').val());

    formData.append('how_hot_food', $('#how_hot_food').val());

    formData.append('sampling', $('#sampling').val());

    formData.append('water_source', $('#water_source').val());

    formData.append('how_utensils', $('#how_utensils').val());

    formData.append('how_handwashing', $('#how_handwashing').val());

    formData.append('toilet_facility', $('#toilet_facility').val());

    formData.append('drawn_layout', $('#drawn_layout').val());




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


function validateSaveGeneralInfo() {
    var flg = 0;

    var farmers_provide_copy_of_draw_layout = $('#farmers_provide_copy_of_draw_layout').val();
    if (farmers_provide_copy_of_draw_layout == "") {
        $('#farmers_provide_copy_of_draw_layout_error').text("ⓘ Required Field");
        flg = 1;
    }
    var food_beverage = $('#food_beverage').val();
    if (food_beverage == "") {
        $('#food_beverage_error').text("ⓘ Required Field");
        flg = 1;
    }
    var how_food_prepared = $('#how_food_prepared').val();
    if (how_food_prepared == "") {
        $('#how_food_prepared_error').text("ⓘ Required Field");
        flg = 1;
    }
    var how_cold_food = $('#how_cold_food').val();
    if (how_cold_food == "") {
        $('#how_cold_food_error').text("ⓘ Required Field");
        flg = 1;
    }
    var sampling = $('#sampling').val();
    if (sampling == "") {
        $('#sampling_error').text("ⓘ Required Field");
        flg = 1;
    }
    var water_source = $('#water_source').val();
    if (water_source == "") {
        $('#water_source_error').text("ⓘ Required Field");
        flg = 1;
    }
    var how_utensils = $('#how_utensils').val();
    if (how_utensils == "") {
        $('#how_utensils_error').text("ⓘ Required Field");
        flg = 1;
    }
    var how_handwashing = $('#how_handwashing').val();
    if (how_handwashing == "") {
        $('#how_handwashing_error').text("ⓘ Required Field");
        flg = 1;
    }
    var toilet_facility = $('#toilet_facility').val();
    if (toilet_facility == "") {
        $('#toilet_facility_error').text("ⓘ Required Field");
        flg = 1;
    }

    if (flg == 1) { return false; }
    else { return true; }
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
});



$(document).on('input change', 'input, textarea, select', function () {
    $('#' + this.id + '_error').text('');
});
