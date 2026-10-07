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



$(document).ready(function () {


    $('#basicDetailsPermitForm').on('click', function (e) {
        // alert('fg');
        saveEstDetailsApplication();
    });

     $('#managementCompanyForm').on('click', function (e) {
        // alert('fg');
        saveManagementCompanyForm();
    });
    $('#poolInformation').on('click', function (e) {
        // alert('fg');
        savePoolInformation();
    });



    $('#certifiedPoolsOperators').on('click', function (e) {
        // alert('fg');
        var pid = $(this).attr('data-permit-id');
// $(this).attr('data-item-id');
        console.log(pid);

        certifiedPoolsOperators(pid);
    });


    $('#savePermitApplicationBtn').on('click', function (e) {
        // alert('fg');
        saveFoodPermitApplication();

    });


});



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


    let logs = [];

    $('.facilityTypeRow').each(function () {

        var i_id = $(this).attr('data-item-id');

        const operator = $(`#operator_${i_id}`).val();
        const operators_phone = $(`#operators_phone_${i_id}`).val();

        if (operator || operators_phone) {

            logs.push({
                operator: operator,
                operators_phone: operators_phone,
            });
        }
    });





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

    // $('.pool-row').each(function (i) {

    //     let row = $(this);

    //     let id = row.find('input[type="hidden"]').val();
    //     let type = row.find('.pool-select').val();
    //     let other = row.find('.other-box input').val();

    //     formData.append(`pools[${i}][id]`, id ? id : '');
    //     formData.append(`pools[${i}][type]`, type);
    //     formData.append(`pools[${i}][other]`, other);
    // });




    formData.append('logs', JSON.stringify(logs));


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
                window.location.href = indexUrl;
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




// document.addEventListener('DOMContentLoaded', function (e) {
//     document.getElementById('savePermitApplicationBtn')?.addEventListener('click', function (e) {


//         var permitApplicationForm = document.getElementById('permitApplicationForm');
//         var ser = permitApplicationForm.getAttribute("action");
//         var formData = new FormData();

//         permitApplicationForm.querySelectorAll('input').forEach(element => {
//             console.log(element.getAttribute("type"));
//             if (element.getAttribute("type") == "text"
//                 || element.getAttribute("type") == "email"
//                 || element.getAttribute("type") == "hidden"
//                 || element.getAttribute("type") == "number") {
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
//             formData.append(element.getAttribute("name"), element.value || '');
//         });
//         var loadingWrapper = document.getElementById('loading-wrapper');
//         loadingWrapper.style.display = 'block';
//         var xhr = new XMLHttpRequest();
//         xhr.open("POST", ser, false);
//         xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);
//         xhr.getResponseHeader("Content-type", "application/json");
//         xhr.onload = function (e) {
//                 const response = JSON.parse(this.responseText);

//             if (this.status == 200) {
//                 console.log(response.pid); // Now pid exists if server returns it
//                 if (response.pid) {
//                     certifiedPoolsOperators(response.pid); // ✅ now called correctly
//                 } else {
//                     console.warn('PID not found in response!');
//                 }
//                 setTimeout(function () {
//                     console.log(response)
//                     loadingWrapper.style.display = 'none';
//                     toastr.success(response.message);
//                     location.href = indexUrl;
//                 }, 100000);
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
function validatePermitApplication() {
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

    // var number_of_pools = $('#number_of_pools').val();
    // if (number_of_pools == "") {
    //     $('#number_of_pools_error').text("ⓘ Required Field");
    //     // setTimeout(() => {
    //     //     $('#location_of_event_error').html("");
    //     // }, 5000)
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



    if (flg == 1) { return false; }
    else { return true; }
}


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


//                     <input type="hidden" name="pools[${i}][id]" value="">
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


// document.addEventListener("change", function (e) {

//     if (e.target.classList.contains("pool-select")) {

//         let row = e.target.closest(".pool-row");

//         if (!row) return; // ✅ safety

//         let otherBox = row.querySelector(".other-box");

//         if (e.target.value === "Other") {
//             otherBox.classList.remove("d-none");
//         } else {
//             otherBox.classList.add("d-none");

//             let input = otherBox.querySelector("input");
//             if (input) input.value = "";
//         }
//     }

// });


function saveEstDetailsApplication() {
      if(!saveEstDetailsApplicationValidation()){
        return false;
    }

    var submitPermitApplicationUrl = basicDetails;
    var formData = new FormData();

    formData.append('permit_number', $('#permit_number').val());
    formData.append('application_date', $('#application_date').val());
    formData.append('exp_date', $('#exp_date').val());
    formData.append('pool_name', $('#pool_name').val());
    formData.append('pool_address', $('#pool_address').val());
    formData.append('pool_town', $('#pool_town').val());
    formData.append('pool_state', $('#pool_state').val());
    formData.append('pool_zip', $('#pool_zip').val());
    formData.append('business_phone', $('#business_phone').val());

    formData.append('owner_name', $('#owner_name').val());
    formData.append('owner_email', $('#owner_email').val());
    formData.append('owner_phone', $('#owner_phone').val());

    formData.append('owner_mailing_address', $('#owner_mailing_address').val());
    formData.append('owner_town', $('#owner_town').val());
    formData.append('owner_state', $('#owner_state').val());
    formData.append('owner_zip', $('#owner_zip').val());

    // formData.append('phone', $('#phone').val());
    formData.append('emergency_contact_name', $('#emergency_contact_name').val());
    formData.append('emergency_contact', $('#emergency_contact').val());
    // formData.append('hoursOfOperation',$('#hoursOfOperation').is(':checked') ? 1 : 0);
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
        error: function(jqXHR, textStatus, errorThrown) {
            $('#overlay').hide();
            var error = jqXHR.responseJSON.message;
            console.log(error);
            toastr.error(error);

        },
        complete: function () {
            $('div#loading-wrapper').hide();
            $('#spin').hide();
            $('#saveicon').show();
        }
    });
}

function saveManagementCompanyForm() {

     if(!saveManagementCompanyFormValidation()){
        return false;
    }

    var submitManagementCompanyUrl = submitManagementCompany;
    var formData = new FormData();

    formData.append('management_company', $('#management_company').val());
    formData.append('manager_email', $('#manager_email').val());
    formData.append('manager_phone', $('#manager_phone').val());


    formData.append('_token', $('input[name="_token"]').val());
    formData.append('_method', $('input[name="_method"]').val());
    $.ajax({
        type: "POST",
        url: submitManagementCompanyUrl,
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
        error: function(jqXHR, textStatus, errorThrown) {
            $('#overlay').hide();
            var error = jqXHR.responseJSON.message;
            console.log(error);
            toastr.error(error);

        },
        complete: function () {
            $('div#loading-wrapper').hide();
            $('#spin').hide();
            $('#saveicon').show();
        }
    });

}

$(document).on('change', '#pool_type', function () {
    console.log('sfd');

    if ($(this).val() == 'Other') {

        $('.other-box').removeClass('d-none');

    } else {

        $('.other-box').addClass('d-none');

        $('#pool_type_other').val('');
    }
});

function savePoolInformation() {

     if(!savePoolInformationValidation()){
        return false;
    }

    var submitPoolInfo = submitPoolInformation;
    console.log(submitPoolInformation);
    var formData = new FormData();



    formData.append('pool_location', $('#pool_location').val());
    // formData.append('number_of_pools', $('#number_of_pools').val());
    formData.append('pool_type', $('#pool_type').val());
    formData.append('pool_type_other', $('#pool_type_other').val());
    formData.append('year_installed', $('#year_installed').val());
    formData.append('last_year_changes', $('#last_year_changes').val());
    formData.append('pool_size', $('#pool_size').val());
    formData.append('total_gallons', $('#total_gallons').val());
    formData.append('pool_drain_cover', $('#vgba_complaint').val());
    formData.append('drain_cover', $('#drain_cover').val());
    formData.append('water_supply', $('#water_supply').val());
    formData.append('sewage_disposal', $('#sewage_disposal').val());
    formData.append('opening_date', $('#opening_date').val());
    formData.append('month_of_operation', $('#month_of_operation').val());
    formData.append('days_hour', $('#days_hour').val());

//    $('.pool-row').each(function (i) {

//         let row = $(this);

//         let id = row.find('input[type="hidden"]').val();
//         let type = row.find('.pool-select').val();
//         let other = row.find('.other-box input').val();

//         formData.append(`pools[${i}][id]`, id ? id : '');
//         formData.append(`pools[${i}][type]`, type);
//         formData.append(`pools[${i}][other]`, other);
//     });


    formData.append('_token', $('input[name="_token"]').val());
    formData.append('_method', $('input[name="_method"]').val());
    $.ajax({
        type: "POST",
        url: submitPoolInfo,
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
        error: function(jqXHR, textStatus, errorThrown) {
            $('#overlay').hide();
            var error = jqXHR.responseJSON.message;
            console.log(error);
            toastr.error(error);

        },
        complete: function () {
            $('div#loading-wrapper').hide();
            $('#spin').hide();
            $('#saveicon').show();
        }
    });

}


function certifiedPoolsOperators(pid) {

     if(!certifiedPoolsOperatorsValidation()){
        return false;
    }

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
            toastr.success(data.message);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
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



function saveEstDetailsApplicationValidation() {
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



    //  var applicant_signature_date = $('#applicant_signature_date').val();
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
function saveManagementCompanyFormValidation() {
    var flg = 0;


    if (flg == 1) { return false; }
    else { return true; }
}

function savePoolInformationValidation() {
    var flg = 0;


    // var number_of_pools = $('#number_of_pools').val();
    // if (number_of_pools == "") {
    //     $('#number_of_pools_error').text("ⓘ Required Field");
    //     // setTimeout(() => {
    //     //     $('#location_of_event_error').html("");
    //     // }, 5000)
    //     flg = 1;
    // }

    if (flg == 1) { return false; }
    else { return true; }
}

function certifiedPoolsOperatorsValidation() {
    var flg = 0;


    if (flg == 1) { return false; }
    else { return true; }
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

