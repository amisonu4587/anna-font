if (document.getElementById('inspection_date') != null) {
    $('#inspection_date').prop('readonly', true);
    $('#inspection_date').daterangepicker({
        singleDatePicker: true,
        showDropdowns: true,
        // minDate: new Date(),
        maxYear: parseInt(moment().format('YYYY')) + 8,
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
$(document).ready(function () {
    $('#basicDetailsPermitForm').on('click', function (e) {
        saveBasicDetailsApplication();
    });
    $('#estDetailsPermitForm').on('click', function (e) {
        saveEstDetailsApplication();
    });
    $('#savePermitApplicationBtn').on('click', function (e) {
        saveFoodPermitApplication();
    });
});
var licensed_fee = 0;
function updateFee() {
    licensed_fee = $('input[name="licensed_fee"]:checked').val() || 0;
}
function isCanvasBlank(canvas) {
    return !canvas.getContext('2d')
        .getImageData(0, 0, canvas.width, canvas.height).data
        .some(channel => channel !== 0);
}
$(document).ready(function () {
    updateFee();
});
$('input[name="licensed_fee"]').change(function () {
    updateFee();
});
// document.addEventListener('DOMContentLoaded', function (e) {
//     document.getElementById('savePermitApplicationBtn')?.addEventListener('click', function (e) {
//         // if (!validatePermitApplication()) {
//         //     return false;
//         // }
//         var permitApplicationForm = document.getElementById('permitApplicationForm');
//         var submitPermitApplicationUrl = permitApplicationForm.getAttribute("action");
//         var formData = new FormData();
//         permitApplicationForm.querySelectorAll('input').forEach(element => {
//             //console.log(element.getAttribute("type"));
//             if (element.getAttribute("type") == "text"
//                 || element.getAttribute("type") == "email"
//                 || element.getAttribute("type") == "hidden"
//                 || element.getAttribute("type") == "number"
//                 || element.getAttribute("type") == "time") {
//                 formData.append(element.getAttribute("name"), element.value);
//             }
//             if (element.getAttribute("type") === "radio") {
//                 const name = element.getAttribute("name");
//                 const checkedValue = document.querySelector(`input[name="${name}"]:checked`)?.value || '';
//                 formData.append(name, checkedValue);
//             }
//             if (element.getAttribute("type") == "checkbox") {
//                 formData.append(element.getAttribute("name"), element.checked ? 1 : 0);
//             }

//             if (element.getAttribute("type") == "file") {
//                 formData.append(element.getAttribute("name"), element.files[0]);
//             }
//         });
//         document.querySelectorAll('textarea').forEach(element => {
//             let name = element.getAttribute("name");
//             if (!name) return;
//             formData.append(name, $('#' + element.getAttribute("id")).val());
//         });
//         document.querySelectorAll('select').forEach(element => {
//             formData.append(element.getAttribute("name"), $('select#' + element.getAttribute("id")).val());
//         });

//         console.log(csrfToken);
//         var loadingWrapper = document.getElementById('loading-wrapper');
//         loadingWrapper.style.display = 'block';
//         var xhr = new XMLHttpRequest();
//         xhr.open("POST", submitPermitApplicationUrl, false);
//         xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);
//         xhr.getResponseHeader("Content-type", "application/json");
//         xhr.onload = function (e) {
//             console.log(this);
//             if (this.status == 200) {
//                 setTimeout(function () {
//                     loadingWrapper.style.display = 'none';
//                     toastr.success("Temp Food Upload Successfully!");
//                     location.href = indexUrl;
//                 }, 5000);
//             }
//             else {
//                 const response = JSON.parse(this.responseText);
//                 console.log(response);
//                 loadingWrapper.style.display = 'none';
//                 toastr.error(response.message);
//             }
//         }
//         xhr.send(formData);
//     });
// });


function saveFoodPermitApplication() {
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
    var xhr = new XMLHttpRequest();
    xhr.open("POST", submitPermitApplicationUrl, false);
    xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);
    xhr.getResponseHeader("Content-type", "application/json");
    xhr.onload = function (e) {
        console.log(this);
        if (this.status == 200) {
            setTimeout(function () {
                loadingWrapper.style.display = 'none';
                toastr.success("Temp Food Upload Successfully!");
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
}




function saveBasicDetailsApplication() {
    if (!validateBasicDetailsApplication()) {
        return false;
    }


    var submitPermitApplicationUrl = basicDetails;

    var formData = new FormData();
    formData.append('licensed_fee', licensed_fee);

    formData.append('event', $('#event').val());
    formData.append('location_of_event', $('#location_of_event').val());
    formData.append('date_of_event', $('#date_of_event').val());
    formData.append('end_date', $('#end_date').val());
    formData.append('time', $('#time').val());
    formData.append('event_organizer', $('#event_organizer').val());
    formData.append('cell_phone', $('#cell_phone').val());
    formData.append('event_organizer_email', $('#event_organizer_email').val());
    formData.append('name_of_food_booth', $('#name_of_food_booth').val());
    formData.append('vendor_contact', $('#vendor_contact').val());
    formData.append('vendor_cell_phone', $('#vendor_cell_phone').val());
    formData.append('vendor_email', $('#vendor_email').val());
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
function saveEstDetailsApplication() {
    // if (!validateEstDetailsApplication()) {
    //     return false;
    // }

    var submitPermitApplicationUrl = estcDetails;
    var formData = new FormData();
    formData.append('list_all_foods_beverages', $('#list_all_foods_beverages').val());
    formData.append('When_food_purchased', $('#When_food_purchased').val());
    formData.append('what_time_food_delivered', $('#what_time_food_delivered').val());
    formData.append('during_transportation_cold', $('#during_transportation_cold').is(':checked') ? 1 : 0);

    formData.append('during_transportation_cold_details', $('#during_transportation_cold_details').val());
    formData.append('at_the_event_site_cold', $('#at_the_event_site_cold').is(':checked') ? 1 : 0);
    formData.append('at_the_event_site_cold_details', $('#at_the_event_site_cold_details').val());
    formData.append('during_transportation_hot', $('#during_transportation_hot').is(':checked') ? 1 : 0);
    formData.append('during_transportation_hot_details', $('#during_transportation_hot_details').val());
    formData.append('at_the_event_site_hot', $('#at_the_event_site_hot').is(':checked') ? 1 : 0);
    formData.append('at_the_event_site_hot_details', $('#at_the_event_site_hot_details').val());
    formData.append('prepared_at_licensed_facility', $('#prepared_at_licensed_facility').is(':checked') ? 1 : 0);
    formData.append('prepared_at_licensed_facility_note', $('#prepared_at_licensed_facility_note').val());
    formData.append('prepared_at_the_event', $('#prepared_at_the_event').is(':checked') ? 1 : 0);
    formData.append('prepared_at_the_event_note', $('#prepared_at_the_event_note').val());
    formData.append('list_where_food_will_be_stored', $('#list_where_food_will_be_stored').val());
    formData.append('handwashing_stations', $('#handwashing_stations').val());
    formData.append('location_of_worker_toilet', $('#location_of_worker_toilet').val());
    formData.append('describe_sanitized', $('#describe_sanitized').val());

    formData.append('type_of_sanitizer', $('#type_of_sanitizer').val());
    formData.append('test_strips', $('#test_strips').val());
    formData.append('leftovers', $('#leftovers').val());
    formData.append('internal_temperatures', $('#internal_temperatures').val());
    formData.append('water_supply', $('#water_supply').val());
    formData.append('outdoor_elements', $('#outdoor_elements').val());
    formData.append('wastewater_be_disposed', $('#wastewater_be_disposed').val());
    formData.append('drawn_layout_food_booth', $('#drawn_layout_food_booth').val());



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

function validatePermitApplication() {
    var flg = 0;
    var event = $('#event').val();
    if (event == "") {
        $('#event_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#event_error').html("");
        }, 5000)
        flg = 1;
    }
    var location_of_event = $('#location_of_event').val();
    if (location_of_event == "") {
        $('#location_of_event_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#location_of_event_error').html("");
        }, 5000)
        flg = 1;
    }
    var date_of_event = $('#date_of_event').val();
    if (date_of_event == "") {
        $('#date_of_event_error').text("ⓘ Required Field");
        flg = 1;
    }
    var end_date = $('#end_date').val();
    if (end_date == "") {
        $('#end_date_error').text("ⓘ Required Field");
        flg = 1;
    }
    if (date_of_event !== "" && end_date !== "") {
        var start = new Date(date_of_event);
        var end = new Date(end_date);

        if (end < start) {
            $('#end_date_error').text("ⓘ End date must be greater than start date");
            flg = 1;
        } else {
            $('#end_date_error').text("");
        }
    }


    var time = $('#time').val();
    if (time == "") {
        $('#time_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#time_error').html("");
        }, 5000)
        flg = 1;
    }
    var event_organizer = $('#event_organizer').val();
    if (event_organizer == "") {
        $('#event_organizer_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#event_organizer_error').html("");
        }, 5000)
        flg = 1;
    }
    // var cell_phone = $('#cell_phone').val();
    // if (cell_phone == "") {
    //     $('#cell_phone_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#cell_phone_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    var event_organizer_email = $('#event_organizer_email').val();
    if (event_organizer_email == "") {
        $('#event_organizer_email_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#event_organizer_email_error').html("");
        }, 5000)
        flg = 1;
    }
    var name_of_food_booth = $('#name_of_food_booth').val();
    if (name_of_food_booth == "") {
        $('#name_of_food_booth_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#name_of_food_booth_error').html("");
        }, 5000)
        flg = 1;
    }
    var vendor_contact = $('#vendor_contact').val();
    if (vendor_contact == "") {
        $('#vendor_contact_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#vendor_contact_error').html("");
        }, 5000)
        flg = 1;
    }
    var vendor_cell_phone = $('#vendor_cell_phone').val();
    if (vendor_cell_phone == "") {
        $('#vendor_cell_phone_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#vendor_cell_phone_error').html("");
        }, 5000)
        flg = 1;
    }
    var vendor_email = $('#vendor_email').val();
    if (vendor_email == "") {
        $('#vendor_email_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#vendor_email_error').html("");
        }, 5000)
        flg = 1;
    }
    // var list_all_foods_beverages = $('#list_all_foods_beverages').val();
    // if (list_all_foods_beverages == "") {
    //     $('#list_all_foods_beverages_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#list_all_foods_beverages_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }

    // var When_food_purchased = $('#When_food_purchased').val();
    // if (When_food_purchased == "") {
    //     $('#When_food_purchased_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#When_food_purchased_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var what_time_food_delivered = $('#what_time_food_delivered').val();
    // if (what_time_food_delivered == "") {
    //     $('#what_time_food_delivered_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#what_time_food_delivered_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var during_transportation_cold = $('#during_transportation_cold').is(':checked');
    // if (during_transportation_cold == "") {
    //     $('#during_transportation_cold_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#during_transportation_cold_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var at_the_event_site_cold = $('#at_the_event_site_cold').is(':checked');;
    // if (at_the_event_site_cold == "") {
    //     $('#at_the_event_site_cold_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#at_the_event_site_cold_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var during_transportation_hot = $('#during_transportation_hot').is(':checked');;
    // if (during_transportation_hot == "") {
    //     $('#during_transportation_hot_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#during_transportation_hot_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var at_the_event_site_hot = $('#at_the_event_site_hot').is(':checked');;
    // if (at_the_event_site_hot == "") {
    //     $('#at_the_event_site_hot_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#at_the_event_site_hot_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var prepared_at_licensed_facility = $('#prepared_at_licensed_facility').is(':checked');;
    // if (prepared_at_licensed_facility == "") {
    //     $('#prepared_at_licensed_facility_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#prepared_at_licensed_facility_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var prepared_at_the_event = $('#prepared_at_the_event').is(':checked');;
    // if (prepared_at_the_event == "") {
    //     $('#prepared_at_the_event_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#prepared_at_the_event_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var list_where_food_will_be_stored = $('#list_where_food_will_be_stored').val();
    // if (list_where_food_will_be_stored == "") {
    //     $('#list_where_food_will_be_stored_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#list_where_food_will_be_stored_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var handwashing_stations = $('#handwashing_stations').val();
    // if (handwashing_stations == "") {
    //     $('#handwashing_stations_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#handwashing_stations_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var location_of_worker_toilet = $('#location_of_worker_toilet').val();
    // if (location_of_worker_toilet == "") {
    //     $('#location_of_worker_toilet_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#location_of_worker_toilet_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var describe_sanitized = $('#describe_sanitized').val();
    // if (describe_sanitized == "") {
    //     $('#describe_sanitized_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#describe_sanitized_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var type_of_sanitizer = $('#type_of_sanitizer').val();
    // if (type_of_sanitizer == "") {
    //     $('#type_of_sanitizer_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#type_of_sanitizer_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var test_strips = $('#test_strips').val();
    // if (test_strips == "") {
    //     $('#test_strips_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#test_strips_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var leftovers = $('#leftovers').val();
    // if (leftovers == "") {
    //     $('#leftovers_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#leftovers_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var internal_temperatures = $('#internal_temperatures').val();
    // if (internal_temperatures == "") {
    //     $('#internal_temperatures_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#internal_temperatures_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var water_supply = $('#water_supply').val();
    // if (water_supply == "") {
    //     $('#water_supply_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#water_supply_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var outdoor_elements = $('#outdoor_elements').val();
    // if (outdoor_elements == "") {
    //     $('#outdoor_elements_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#outdoor_elements_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var wastewater_be_disposed = $('#wastewater_be_disposed').val();
    // if (wastewater_be_disposed == "") {
    //     $('#wastewater_be_disposed_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#wastewater_be_disposed_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    // var drawn_layout_food_booth = $('#drawn_layout_food_booth').val();
    // if (drawn_layout_food_booth == "") {
    //     $('#drawn_layout_food_booth_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#drawn_layout_food_booth_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }


    var document_upload_2 = $('#document_upload_2').val();
    if (document_upload_2 == "") {
        $('#document_upload_2_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#document_upload_2_error').html("");
        }, 5000)
        flg = 1;
    }

    var document_name_2 = $('#document_name_2').val();
    if (document_name_2 == "") {
        $('#document_name_2_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#document_name_2_error').html("");
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

function validateBasicDetailsApplication() {
    var flg = 0;
    var event = $('#event').val();
    if (event == "") {
        $('#event_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#event_error').html("");
        }, 5000)
        flg = 1;
    }
    var location_of_event = $('#location_of_event').val();
    if (location_of_event == "") {
        $('#location_of_event_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#location_of_event_error').html("");
        }, 5000)
        flg = 1;
    }
    var date_of_event = $('#date_of_event').val();
    if (date_of_event == "") {
        $('#date_of_event_error').text("ⓘ Required Field");
        flg = 1;
    }
    var end_date = $('#end_date').val();
    if (end_date == "") {
        $('#end_date_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#end_date_error').html("");
        }, 5000)
        flg = 1;
    }
    if (date_of_event !== "" && end_date !== "") {
        var start = new Date(date_of_event);
        var end = new Date(end_date);

        if (end < start) {
            $('#end_date_error').text("ⓘ End date must be greater than start date");
            setTimeout(() => {
                $('#end_date_error').html("");
            }, 5000)
            flg = 1;
        } else {
            $('#end_date_error').text("");
        }
    }
    var time = $('#time').val();
    if (time == "") {
        $('#time_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#time_error').html("");
        }, 5000)
        flg = 1;
    }
    var event_organizer = $('#event_organizer').val();
    if (event_organizer == "") {
        $('#event_organizer_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#event_organizer_error').html("");
        }, 5000)
        flg = 1;
    }
    // var cell_phone = $('#cell_phone').val();
    // if (cell_phone == "") {
    //     $('#cell_phone_error').text("ⓘ Required Field");
    //     setTimeout(() => {
    //         $('#cell_phone_error').html("");
    //     }, 5000)
    //     flg = 1;
    // }
    var event_organizer_email = $('#event_organizer_email').val();
    if (event_organizer_email == "") {
        $('#event_organizer_email_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#event_organizer_email_error').html("");
        }, 5000)
        flg = 1;
    }
    var name_of_food_booth = $('#name_of_food_booth').val();
    if (name_of_food_booth == "") {
        $('#name_of_food_booth_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#name_of_food_booth_error').html("");
        }, 5000)
        flg = 1;
    }
    var vendor_contact = $('#vendor_contact').val();
    if (vendor_contact == "") {
        $('#vendor_contact_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#vendor_contact_error').html("");
        }, 5000)
        flg = 1;
    }
    var vendor_cell_phone = $('#vendor_cell_phone').val();
    if (vendor_cell_phone == "") {
        $('#vendor_cell_phone_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#vendor_cell_phone_error').html("");
        }, 5000)
        flg = 1;
    }
    var vendor_email = $('#vendor_email').val();
    if (vendor_email == "") {
        $('#vendor_email_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#vendor_email_error').html("");
        }, 5000)
        flg = 1;
    }

    if (flg == 1) { return false; }
    else { return true; }
}
function validateEstDetailsApplication() {
    var flg = 0;
    var list_all_foods_beverages = $('#list_all_foods_beverages').val();
    if (list_all_foods_beverages == "") {
        $('#list_all_foods_beverages_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#list_all_foods_beverages_error').html("");
        }, 5000)
        flg = 1;
    }

    var When_food_purchased = $('#When_food_purchased').val();
    if (When_food_purchased == "") {
        $('#When_food_purchased_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#When_food_purchased_error').html("");
        }, 5000)
        flg = 1;
    }
    var what_time_food_delivered = $('#what_time_food_delivered').val();
    if (what_time_food_delivered == "") {
        $('#what_time_food_delivered_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#what_time_food_delivered_error').html("");
        }, 5000)
        flg = 1;
    }
    var during_transportation_cold = $('#during_transportation_cold').is(':checked');
    if (during_transportation_cold == "") {
        $('#during_transportation_cold_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#during_transportation_cold_error').html("");
        }, 5000)
        flg = 1;
    }
    var at_the_event_site_cold = $('#at_the_event_site_cold').is(':checked');;
    if (at_the_event_site_cold == "") {
        $('#at_the_event_site_cold_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#at_the_event_site_cold_error').html("");
        }, 5000)
        flg = 1;
    }
    var during_transportation_hot = $('#during_transportation_hot').is(':checked');;
    if (during_transportation_hot == "") {
        $('#during_transportation_hot_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#during_transportation_hot_error').html("");
        }, 5000)
        flg = 1;
    }
    var at_the_event_site_hot = $('#at_the_event_site_hot').is(':checked');;
    if (at_the_event_site_hot == "") {
        $('#at_the_event_site_hot_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#at_the_event_site_hot_error').html("");
        }, 5000)
        flg = 1;
    }
    var prepared_at_licensed_facility = $('#prepared_at_licensed_facility').is(':checked');;
    if (prepared_at_licensed_facility == "") {
        $('#prepared_at_licensed_facility_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#prepared_at_licensed_facility_error').html("");
        }, 5000)
        flg = 1;
    }
    var prepared_at_the_event = $('#prepared_at_the_event').is(':checked');;
    if (prepared_at_the_event == "") {
        $('#prepared_at_the_event_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#prepared_at_the_event_error').html("");
        }, 5000)
        flg = 1;
    }
    var list_where_food_will_be_stored = $('#list_where_food_will_be_stored').val();
    if (list_where_food_will_be_stored == "") {
        $('#list_where_food_will_be_stored_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#list_where_food_will_be_stored_error').html("");
        }, 5000)
        flg = 1;
    }
    var handwashing_stations = $('#handwashing_stations').val();
    if (handwashing_stations == "") {
        $('#handwashing_stations_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#handwashing_stations_error').html("");
        }, 5000)
        flg = 1;
    }
    var location_of_worker_toilet = $('#location_of_worker_toilet').val();
    if (location_of_worker_toilet == "") {
        $('#location_of_worker_toilet_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#location_of_worker_toilet_error').html("");
        }, 5000)
        flg = 1;
    }
    var describe_sanitized = $('#describe_sanitized').val();
    if (describe_sanitized == "") {
        $('#describe_sanitized_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#describe_sanitized_error').html("");
        }, 5000)
        flg = 1;
    }
    var type_of_sanitizer = $('#type_of_sanitizer').val();
    if (type_of_sanitizer == "") {
        $('#type_of_sanitizer_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#type_of_sanitizer_error').html("");
        }, 5000)
        flg = 1;
    }
    var test_strips = $('#test_strips').val();
    if (test_strips == "") {
        $('#test_strips_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#test_strips_error').html("");
        }, 5000)
        flg = 1;
    }
    var leftovers = $('#leftovers').val();
    if (leftovers == "") {
        $('#leftovers_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#leftovers_error').html("");
        }, 5000)
        flg = 1;
    }
    var internal_temperatures = $('#internal_temperatures').val();
    if (internal_temperatures == "") {
        $('#internal_temperatures_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#internal_temperatures_error').html("");
        }, 5000)
        flg = 1;
    }
    var water_supply = $('#water_supply').val();
    if (water_supply == "") {
        $('#water_supply_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#water_supply_error').html("");
        }, 5000)
        flg = 1;
    }
    var outdoor_elements = $('#outdoor_elements').val();
    if (outdoor_elements == "") {
        $('#outdoor_elements_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#outdoor_elements_error').html("");
        }, 5000)
        flg = 1;
    }
    var wastewater_be_disposed = $('#wastewater_be_disposed').val();
    if (wastewater_be_disposed == "") {
        $('#wastewater_be_disposed_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#wastewater_be_disposed_error').html("");
        }, 5000)
        flg = 1;
    }
    var drawn_layout_food_booth = $('#drawn_layout_food_booth').val();
    if (drawn_layout_food_booth == "") {
        $('#drawn_layout_food_booth_error').text("ⓘ Required Field");
        setTimeout(() => {
            $('#drawn_layout_food_booth_error').html("");
        }, 5000)
        flg = 1;
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



