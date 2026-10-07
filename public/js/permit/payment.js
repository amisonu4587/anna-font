var subTotal = 0;
var totalAmount = 0;
var dayFeeAmount = 0;
// var dayFeeAmount = 0;
var planReviewAmount = 0;
var checkCount = 0;
var addOrDisOrClrBtn = '';
var latefee = 0;
var disOrAddAmount = 0;
var feeid = [];

let calArr = [];

function payModal(e) {
    $('#totalamt').val(parseFloat(totalAmount) + parseFloat(latefee) + parseFloat(dayFeeAmount) + parseFloat(planReviewAmount));
    $('#paymentUploadModal').modal('show');
}






function SelectedFees(isChecked, feeScheduleId, feeType, amount) {

    console.log(addOrDisOrClrBtn, disOrAddAmount);

    if (isChecked) {

        subTotal += amount;
        totalAmount = totalAmount + amount;
        console.log(isChecked, feeScheduleId, feeType, amount);
        checkCount += 1;
        feeid.push(feeScheduleId);

    } else {

        subTotal -= amount;
        totalAmount -= amount;
        checkCount -= 1;
        let index = feeid.indexOf(feeScheduleId);
        if (index !== -1) {
            feeid.splice(index, 1);
        }
    }

    if (checkCount > 0) {
        $('#discnt').prop('disabled', false);
        $('#addtn').prop('disabled', false);
        $('#clr').prop('disabled', false);

    } else {
        $('#discnt').prop('disabled', true);
        $('#addtn').prop('disabled', true);
        $('#clr').prop('disabled', true);
        $('#clr').prop('checked', false);
        $('#addtn').prop('checked', false);
        $('#discnt').prop('checked', false);
    }
    $('#subTotal').val(subTotal);

    if (addOrDisOrClrBtn == 'Discount') {
        $('#totalamt').val((parseFloat(totalAmount) + parseFloat(latefee) + parseFloat(dayFeeAmount) + parseFloat(planReviewAmount)) - parseFloat(disOrAddAmount));
    } else if (addOrDisOrClrBtn == 'Additional') {
        $('#totalamt').val((parseFloat(totalAmount) + parseFloat(latefee) + parseFloat(dayFeeAmount) + parseFloat(planReviewAmount)) + parseFloat(disOrAddAmount));
    } else {
        $('#totalamt').val(parseFloat(totalAmount) + parseFloat(latefee) + parseFloat(dayFeeAmount) + parseFloat(planReviewAmount));
    }
}




$('input[name="discOrAdd"]').change(function () {
    addOrDisOrClrBtn = $(this).val();
    var disOrAdd = parseFloat($('#discOrAddAmount').val());
    if ($(this).val() == "Additional") {
        $('input#discOrAddAmount').prop('readonly', false);
        $('#discOrAddNote').prop('readonly', false);

        $('#totalamt').val(subTotal + latefee + disOrAdd + dayFeeAmount + planReviewAmount);
    } else if ($(this).val() == "Discount") {
        $('input#discOrAddAmount').prop('readonly', false);
        $('#discOrAddNote').prop('readonly', false);
        $('#totalamt').val((dayFeeAmount + subTotal + latefee + planReviewAmount) - disOrAdd);
    } else {
        $('input#discOrAddAmount').prop('readonly', true).val(0);
        $('#discOrAddNote').prop('readonly', true).val('');
        $('#totalamt').val(subTotal + latefee + dayFeeAmount + planReviewAmount);
    }
});

function Misc(event) {
    disOrAddAmount = parseFloat(event.target.value);
    if (addOrDisOrClrBtn == 'Additional') {
        $('#totalamt').val(totalAmount + latefee + dayFeeAmount + disOrAddAmount + planReviewAmount);

    }
    if (addOrDisOrClrBtn == 'Discount') {

        if (disOrAddAmount > totalAmount + latefee) {
            Swal.fire({
                icon: 'error',
                title: 'Discount / Addition Amount should not be greater than Amount Paid',
            });
            $('input[type="number"]#discOrAddAmount').addClass('border-danger');
            $('#totalamt').val(totalAmount + latefee + dayFeeAmount + planReviewAmount);
            return false;


        } else {
            $('#totalamt').val((totalAmount + latefee + dayFeeAmount + planReviewAmount) - disOrAddAmount);

        }
    }
}



function dayCalculation(event) {

    dayFee = parseFloat(event.target.value);
    dayFeeAmount = dayFee * 15;

    if (dayFee) {

        if (addOrDisOrClrBtn == 'Discount') {
            $('#totalamt').val((totalAmount + latefee + dayFeeAmount + planReviewAmount) - disOrAddAmount);
        } else if (addOrDisOrClrBtn == 'Additional') {
            $('#totalamt').val((totalAmount + latefee + dayFeeAmount + planReviewAmount) + disOrAddAmount);
        } else {
            $('#totalamt').val((totalAmount + latefee + dayFeeAmount + planReviewAmount));
        }


        // $('#totalamt').val(totalAmount + latefee + dayFeeAmount + planReviewAmount);
    }

}



function lateFee(event) {
    console.log(totalAmount);
    latefee = parseFloat(event.target.value);
    if (latefee) {

        if (addOrDisOrClrBtn == 'Discount') {
            $('#totalamt').val((totalAmount + latefee + dayFeeAmount + planReviewAmount) - disOrAddAmount);
        } else if (addOrDisOrClrBtn == 'Additional') {
            $('#totalamt').val((totalAmount + latefee + dayFeeAmount + planReviewAmount) + disOrAddAmount);
        } else {
            $('#totalamt').val((totalAmount + latefee + dayFeeAmount + planReviewAmount));
        }


        // $('#totalamt').val(totalAmount + latefee + dayFeeAmount + planReviewAmount)
    }

}

function planReviewFeeCal(event) {
    console.log(totalAmount);
    planReviewAmount = parseFloat(event.target.value);
    if (planReviewAmount) {

        if (addOrDisOrClrBtn == 'Discount') {
            $('#totalamt').val((totalAmount + latefee + dayFeeAmount + planReviewAmount) - disOrAddAmount);
        } else if (addOrDisOrClrBtn == 'Additional') {
            $('#totalamt').val((totalAmount + latefee + dayFeeAmount + planReviewAmount) + disOrAddAmount);
        } else {
            $('#totalamt').val((totalAmount + latefee + dayFeeAmount + planReviewAmount));
        }
        // $('#totalamt').val(totalAmount + latefee + dayFeeAmount + planReviewAmount)
    }

}

$('#PaysaveBtn').click(function () {
    // var submitPayment = "{{ route('payment') }}";
    var myForm = document.getElementById("PaymentForm");
    var formData = new FormData(myForm);


    var loadingWrapper = document.getElementById('loading-wrapper');
    loadingWrapper.style.display = 'block';
    var xhr = new XMLHttpRequest();
    xhr.open("POST", submitPaymentDetails, false);
    xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);
    xhr.getResponseHeader("Content-type", "application/json");
    xhr.onload = function () {
        let response = JSON.parse(xhr.responseText);
        if (this.status == 200) {
            toastr.success("Payment saved successfully! Please refresh the page to see the changes.");
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }



        if (this.status == 500) {
            toastr.error(response.message);
            console.log(response.message);
        }
    }
    xhr.send(formData);
    e.target.disabled = false;
    $('#paymentUploadModal').modal('hide');
    e.target.closest('form').reset();



});

function PayOfflineModalClose() {
    console.log('PayOfflineModal');
    $('#offlinePayModal').trigger('reset')
    $('#tblCustomers > tbody').empty();
    $('#offlineitemCount').val(0);
    $('#totalamt').val(0);
    $('#subTotal').val(0);

    subTotal = 0;
    totalAmount = 0;
    dayFeeAmount = 0;

    planReviewAmount = 0;

    $('#payMethodId').empty();
    $('#payMethodId').append('<option disabled selected>--Select--</option>');
    $('#payMethodId').append('<option value="Cash">Cash</option>');
    $('#payMethodId').append('<option value="Check">Check</option>');
    $('#payMethodId').append('<option value="Card">Card</option>');
    $('#payMethodId').append('<option value="Money Order">Money Order</option>');
    $("#itemReferenceNumber").prop('disabled', false)
    $('#offlinePayModal').modal('hide');
}

function offlinePayModal(e) {
    var paymentId = e.attr('data-id');
    var invoiceNo = e.attr('data-invoice');
    var totalAmount = e.attr('data-total-amount');
    var SelectedPermitFeeAmount = e.attr('data-sub-total-amount-amount');
    var totalLateFeeAmount = e.attr('data-late-fee-amount');
    var totalPlanReviewFeeAmount = e.attr('data-plan-review-fee-amount');
    var totaldayWiseAmountFeeAmount = e.attr('data-day-wise-amount');
    var permitId = e.attr('data-permit-id');
    var paymentDetails = e.attr('data-payment-details');
    console.log(totalPlanReviewFeeAmount);
    $('#invoiceOfflineNo').val(invoiceNo);
    $('#amountDue').val(totalAmount);
    $('#lateFee').val(totalLateFeeAmount);
    $('#plan_review_fee').val(totalPlanReviewFeeAmount);

    $('#itemAmt').val(totalAmount);


    if (totaldayWiseAmountFeeAmount == '') {
        $('#dayCountFee').val(0);
    } else {
        $('#dayCountFee').val(totaldayWiseAmountFeeAmount);
    }

    $('#selectedPermitFee').val(SelectedPermitFeeAmount);
    $('#paymentId').val(paymentId);
    $('#permit_id').val(permitId);
    $('#payment_details').val(paymentDetails);
    $('#offlinePayModal').modal('show');

}





function PaymentOfflineSubmit(e) {
    var itemId = $('#offlineitemCount').val();
    // var i = 1;
    var permit_id = $('#permit_id').val();
    var paymentId = $('#paymentId').val();
    var invoiceNo = $('#invoiceOfflineNo').val();
    var collectionDate = $('#collectionDt').val();
    var paymentMethod = $('#payMethodId').val();
    var paymentReferenceNumber = $('#itemReferenceNumber').val();
    var paymentAmount = $('#itemAmt').val();




    // console.log(amount);
    var formData = new FormData();
    formData.append('permit_id', permit_id);
    formData.append('paymentId', paymentId);
    formData.append('invoiceNo', invoiceNo);
    formData.append('collectionDate', collectionDate);
    formData.append('paymentMethod', paymentMethod);
    formData.append('paymentReferenceNumber', paymentReferenceNumber);
    formData.append('paymentAmount', paymentAmount);
    formData.append('permitTypeId', $('#permit_type_id').val());

    var loadingWrapper = document.getElementById('loading-wrapper');
    loadingWrapper.style.display = 'block';

    var xhr = new XMLHttpRequest();
    xhr.open("POST", submitPayment, false);
    xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);
    xhr.getResponseHeader("Content-type", "application/json");
    xhr.onload = function () {
        let response = JSON.parse(xhr.responseText);

        if (this.status == 200) {
            toastr.success("Payment saved successfully! Please refresh the page to see the changes.");
        }
        setTimeout(() => {
            window.location.reload();
        }, 1500);
        if (this.status == 500) {
            toastr.error(response.message);
        }
    }
    xhr.send(formData);
    $('#offlinePayModal').modal('hide');
    $('#offlinePayModal form')[0].reset();
}



// $("body").on("click", "#btnAdd", function () {
//     var referneceNumber = $("#itemReferenceNumber");
//     var Amount = $("#itemAmt");
//     var dueStateFee = $("#dueStateFee");

//     var stateFee = $("#firmIdFee");

//     var PaymentMode = $("#payMethodId");

//     var ds= $("#dueStateFee").val();
//     //console.log(PaymentMode.val())
//     var validationFlg = 1;





//     if(stateFee.val() == ''){
//         // alert('blank data');
//         validationFlg = 1;
//     }else{
//         if(dueStateFee.val() != 0){
//             if(Amount.val() == stateFee.val()){
//                 validationFlg = 1;
//                 $("#dueStateFee").val(0);
//             }else{

//                 Amount.css('border-color', 'red');
//                 setTimeout(() => {
//                     Amount.css('border-color', '');
//                 }, 4000)
//                 validationFlg = 0

//             }
//         }

//     }

//     if (PaymentMode.val() == null) {
//         PaymentMode.css('border-color', 'red');
//         setTimeout(() => {
//             PaymentMode.css('border-color', '');
//         }, 4000)
//         //$('audio#errorsound')[0].play();
//         //setTimeout(() => {
//         //    toastr.error("Please Fill Up Location Field");
//         //}, 775)
//         validationFlg = 0;
//     }

//     if (Amount.val() == '') {
//         Amount.css('border-color', 'red');
//         setTimeout(() => {
//             Amount.css('border-color', '');
//         }, 4000)
//         validationFlg = 0
//         //return false;
//     }
//     if (PaymentMode.val() != null && PaymentMode.val() != 'Cash') {
//         if (referneceNumber.val() == '') {
//             referneceNumber.css('border-color', 'red');
//             setTimeout(() => {
//                 referneceNumber.css('border-color', '');
//             }, 4000)
//             validationFlg = 0
//         }
//     }

//     if (parseFloat(Amount.val())>parseFloat($('#amount').val())) {
//           Amount.css('border-color', 'red');
//           setTimeout(() => {
//                 Amount.css('border-color', '');
//           }, 4000)
//           validationFlg = 0
//     }

//     if ((parseFloat(Amount.val())+parseFloat($('#totalAmt').val()))>parseFloat($('#amount').val())) {
//           Amount.css('border-color', 'red');
//           setTimeout(() => {
//                 Amount.css('border-color', '');
//           }, 4000)
//           validationFlg = 0
//     }

//     if (parseFloat($('#totalAmt').val())>parseFloat($('#amount').val())) {
//           Amount.css('border-color', 'red');
//           setTimeout(() => {
//                 Amount.css('border-color', '');
//           }, 4000)
//           validationFlg = 0
//     }


//     if (validationFlg == 0) {
//         // $('audio#errorsound')[0].play();
//         if (parseFloat(Amount.val()) > parseFloat($('#amount').val())) {
//             setTimeout(() => {
//                     toastr.error("Amount you are trying to insert is greater than the total amount");
//             }, 775)
//         }
//         else if (parseFloat($('#totalAmt').val()) == parseFloat($('#amount').val())) {
//             setTimeout(() => {
//                     toastr.error("Sum of all amounts entered is already equal to the total amount.. Cannot add more");
//             }, 775)
//         }
//         else if ((parseFloat(Amount.val()) + parseFloat($('#totalAmt').val())) > parseFloat($('#amount').val())) {
//               setTimeout(() => {
//                     toastr.error("Cannot add amount larger than the required amount");
//               }, 775)
//         }

//         else if (Amount.val() != stateFee.val()) {
//             setTimeout(() => {
//                   toastr.error("State Fee And Amount Not Match !!!");
//             }, 775)
//       }


//         else {
//               setTimeout(() => {
//                     toastr.error("Please Fill Up Required Fields");
//               }, 775)
//         }
//         return false;
//     }



//     //var txtCountry = $("#txtCountry");
//     var txtCount = $("#offlineitemCount");
//     txtCount.val(parseInt(txtCount.val()) + 1);

//     //Get the reference of the Table's TBODY element.
//     var tBody = $("#tblCustomers > TBODY")[0];

//     //Add Row.
//     var row = tBody.insertRow(-1);

//     //Add Name cell.

//     var cell = $(row.insertCell(-1));
//     cell.html(PaymentMode.val());

//     var method = "<input type=\"hidden\" id=\"paymentMethod\"  name=\"paymentMethod_"+txtCount.val()+"\" value=\"" + PaymentMode.val() + "\">";

//     if (stateFee.val() != 0) {
//     // Apply only to the first occurrence
//             $('tr:first').find('td:first').append('<span style="color:red;"> (State Fee) </span>');
//         }

//     if(ds != 0 ){
//         method += '<span style="color:red; "> (State Fee) </span>';
//     }


//     cell.append(method);

//     var cell = $(row.insertCell(-1));
//     cell.html(referneceNumber.val());

//     var refernece = "<input type=\"hidden\" id=\"paymentReferenceNumber\" name=\"paymentReferenceNumber_" + txtCount.val() + "\" value=\"" + referneceNumber.val() + "\">";
//     cell.append(refernece);

//     var cell = $(row.insertCell(-1));
//     cell.html(Amount.val());
//     var amou = "<input type=\"hidden\" id=\"paymentSplitAmount\" name=\"paymentSplitAmount_" + txtCount.val() + "\" value=\"" + Amount.val() + "\">"
//     cell.append(amou);
//     // txtCount.val(parseInt(txtCount.val()) + 1);

//    $('#totalAmt').val(parseFloat($('#totalAmt').val()) + parseFloat(Amount.val()))
//    $('#amountDue').val((parseFloat($('#amount').val())-parseFloat($('#totalAmt').val())).toFixed(2))


//     //Add Button cell.
//     cell = $(row.insertCell(-1));
//     var btnRemove = $("<input />");
//     btnRemove.attr("type", "button");
//     btnRemove.attr("onclick", "Remove(this);");
//     btnRemove.addClass('btn btn-sm btn-danger remove valid');

//     btnRemove.val("Remove");
//     cell.append(btnRemove);

//     //Clear the TextBoxes.
//     referneceNumber.val("");
//     referneceNumber.prop('disabled', false)
//     Amount.val("");
//     PaymentMode.val('--Select--');

//    validateAmount()

// });
$(document).on('click', '.pay-online-btn', function (e) {
    // e.preventDefault(); // Uncomment this if button is inside a form
    let button = $(this); // Store reference to the clicked button

    Swal.fire({
        title: 'Are you sure?',
        text: "You want to send the payment link...",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(function (result) {
        if (result.isConfirmed) {
            let url = button.data('url');
            button.prop('disabled', true);

            $.ajax({
                url: url,
                method: 'GET',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') // Or use inline token if needed
                },
                success: function (response) {
                    toastr.success('A payment link has been sent to the owner\'s email. Please check to complete payment.');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                },
                error: function (xhr) {
                    toastr.error('Payment failed. Please try again.');
                    button.prop('disabled', false);
                }
            });
        }
    });
});

function cancelPayment(paymentId)
{
    console.log(paymentId);
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(function(result) {
        if (result.value) {
            loadingWrapper.style.display = 'block';
            let permit_type_id = 1;

            let url = paymentCancelUrl.replace(':payment_id', paymentId);
            let xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.onload = function(e) {
                let response = JSON.parse(this.responseText);
                if (this.status == 200) {
                    setTimeout(() => {
                        toastr.success(response.message);
                        window.location.reload();

                    }, 2000);

                } else {
                    toastr.error(response.message);
                }
                loadingWrapper.style.display = 'none';
            }
            xhr.send(``);
        }
    });
}
