document.addEventListener('DOMContentLoaded', function (e) {
    document.getElementById('savePermitApplicationBtn')?.addEventListener('click', function (e) {
        // if (!validatePermitApplication()) {
        //     return false;
        // }
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
function validatePermitApplication() {
    var flg = 0;

    var name_of_event = $('#name_of_event').val();
    if (name_of_event == "") {
        $('#name_of_event_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#name_of_event_error').html("");
        // }, 5000)
        flg = 1;
    }
    var date_of_event = $('#date_of_event').val();
    if (date_of_event == "") {
        $('#date_of_event_error').text("ⓘ Required Field");
        flg = 1;
    }


    var location = $('#location').val();
    if (location == "") {
        $('#location_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#location_error').html("");
        // }, 5000)
        flg = 1;
    }

    var event_sponsor = $('#event_sponsor').val();
    if (event_sponsor == "") {
        $('#event_sponsor_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#event_sponsor_error').html("");
        // }, 5000)
        flg = 1;
    }

    var phone = $('#phone').val();
    if (phone == "") {
        $('#phone_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#phone_error').html("");
        // }, 5000)
        flg = 1;
    }

    var cell = $('#cell').val();
    if (cell == "") {
        $('#cell_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#cell_error').html("");
        // }, 5000)
        flg = 1;
    }
    var fax = $('#fax').val();
    if (fax == "") {
        $('#fax_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#fax_error').html("");
        // }, 5000)
        flg = 1;
    }
    var email = $('#email').val();
    if (email == "") {
        $('#email_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#email_error').html("");
        // }, 5000)
        flg = 1;
    }

    var food_coordinator = $('#food_coordinator').val();
    if (food_coordinator == "") {
        $('#food_coordinator_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#food_coordinator_error').html("");
        // }, 5000)
        flg = 1;
    }

    var food_coordinator_address = $('#food_coordinator_address').val();
    if (food_coordinator_address == "") {
        $('#food_coordinator_address_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#food_coordinator_address_error').html("");
        // }, 5000)
        flg = 1;
    }

    var food_coordinator_phone = $('#food_coordinator_phone').val();
    if (food_coordinator_phone == "") {
        $('#food_coordinator_phone_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#food_coordinator_phone_error').html("");
        // }, 5000)
        flg = 1;
    }

    var food_coordinator_cell = $('#food_coordinator_cell').val();
    if (food_coordinator_cell == "") {
        $('#food_coordinator_cell_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#food_coordinator_cell_error').html("");
        // }, 5000)
        flg = 1;
    }
    var food_coordinator_fax = $('#food_coordinator_fax').val();
    if (food_coordinator_fax == "") {
        $('#food_coordinator_fax_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#food_coordinator_fax_error').html("");
        // }, 5000)
        flg = 1;
    }
    var food_coordinator_email = $('#food_coordinator_email').val();
    if (food_coordinator_email == "") {
        $('#food_coordinator_email_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#food_coordinator_email_error').html("");
        // }, 5000)
        flg = 1;
    } else {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        var email = emailRegex.test(food_coordinator_email);
        if (!email) {
            $('#food_coordinator_email_error').text("ⓘ Invalid email");
            setTimeout(() => {
                $('#food_coordinator_email_error').html("");
            }, 5000)
            flg = 1;
        }

    }

    var expected_attendance = $('#expected_attendance').val();
    if (expected_attendance == "") {
        $('#expected_attendance_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#expected_attendance_error').html("");
        // }, 5000)
        flg = 1;
    }
    var number_of_food_booths = $('#number_of_food_booths').val();
    if (number_of_food_booths == "") {
        $('#number_of_food_booths_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#number_of_food_booths_error').html("");
        // }, 5000)
        flg = 1;
    }
    var handwashing_facilities = $('#handwashing_facilities').val();
    if (handwashing_facilities == "") {
        $('#handwashing_facilities_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#handwashing_facilities_error').html("");
        // }, 5000)
        flg = 1;
    }
    var public_toilets = $('#public_toilets').val();
    if (public_toilets == "") {
        $('#public_toilets_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#public_toilets_error').html("");
        // }, 5000)
        flg = 1;
    }
    var employee_toilets = $('#employee_toilets').val();
    if (employee_toilets == "") {
        $('#employee_toilets_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#employee_toilets_error').html("");
        // }, 5000)
        flg = 1;
    }
    var solid_waste_disposal = $('#solid_waste_disposal').val();
    if (solid_waste_disposal == "") {
        $('#solid_waste_disposal_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#solid_waste_disposal_error').html("");
        // }, 5000)
        flg = 1;
    }
    var liquid_waste_disposal = $('#liquid_waste_disposal').val();
    if (liquid_waste_disposal == "") {
        $('#liquid_waste_disposal_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#liquid_waste_disposal_error').html("");
        // }, 5000)
        flg = 1;
    }
    var oil_disposal = $('#oil_disposal').val();
    if (oil_disposal == "") {
        $('#oil_disposal_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#oil_disposal_error').html("");
        // }, 5000)
        flg = 1;
    }
    var electricity = $('#electricity').val();
    if (electricity == "") {
        $('#electricity_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#electricity_error').html("");
        // }, 5000)
        flg = 1;
    }
    var public_water = $('#public_water').val();
    if (public_water == "") {
        $('#public_water_error').text("ⓘ Required Field");
        // setTimeout(() => {
        //     $('#public_water_error').html("");
        // }, 5000)
        flg = 1;
    }














    if (flg == 1) { return false; }
    else { return true; }
}
