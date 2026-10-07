function payModal(e) {
    // $('#totalamt').val(parseFloat(totalAmount) + parseFloat(latefee) + parseFloat(dayFeeAmount) + parseFloat(planReviewAmount));
    $('#paymentUploadModal').modal('show');
}

/*************************************************
 * STATE
 *************************************************/
const state = {
    subTotal: 0,
    violationFee: 0,
    otherFee: 0,
    lateFee: 0,
    dayFee: 0,
    adjustmentType: null,
    adjustmentAmount: 0,
    selectedFees: []
};

const num = v => parseFloat(v) || 0;

/*************************************************
 * TOTALS
 *************************************************/
function baseTotal() {
    return state.subTotal + state.violationFee +
           state.otherFee + state.lateFee + state.dayFee;
}

function calculateTotal() {
    let total = baseTotal();
    if (state.adjustmentType === 'Discount') total -= state.adjustmentAmount;
    if (state.adjustmentType === 'Additional') total += state.adjustmentAmount;
    return Math.max(total, 0);
}

function updateUI() {
    document.getElementById('subTotal').value = state.subTotal.toFixed(2);
    document.getElementById('totalamt').value = calculateTotal().toFixed(2);

    const hasFees = state.selectedFees.length > 0;
    const total = calculateTotal();
    ['discnt','addtn','clr'].forEach(id =>
        document.getElementById(id).disabled = !total
    );

    if (!total) {

        document.querySelectorAll('[name="discOrAdd"]').forEach(r => r.checked = false);
        state.adjustmentType = null;
        state.adjustmentAmount = 0;
        document.getElementById('discOrAddAmount').value = 0;
        document.getElementById('discOrAddAmount').readOnly = true;
        document.getElementById('discOrAddNote').value = '';
        document.getElementById('discOrAddNote').readOnly = true;
    }
}

/*************************************************
 * FEES
 *************************************************/
function SelectedFees(checked, id, type, amount) {
    amount = num(amount);
    if (checked) {
        state.subTotal += amount;
        state.selectedFees.push(id);
    } else {
        state.subTotal -= amount;
        state.selectedFees = state.selectedFees.filter(f => f !== id);
    }
    updateUI();
}

function violationFeeCal(e) {
    state.violationFee = num(e.target.value);
    updateUI();
}

function otherFeeCal(e) {
    state.otherFee = num(e.target.value);
    updateUI();
}

function lateFee(e) {
    state.lateFee = num(e.target.value);
    updateUI();
}

function dayCalculation(e) {
    state.dayFee = num(e.target.value) * 15;
    updateUI();
}

/*************************************************
 * DISCOUNT / ADDITIONAL
 *************************************************/
document.querySelectorAll('[name="discOrAdd"]').forEach(radio => {
    radio.addEventListener('change', () => {
        state.adjustmentType = radio.value === 'Clear' ? null : radio.value;
        state.adjustmentAmount = 0;

        document.getElementById('discOrAddAmount').value = 0;
        document.getElementById('discOrAddAmount').readOnly = !state.adjustmentType;
        document.getElementById('discOrAddNote').readOnly = !state.adjustmentType;
        updateUI();
    });
});

function Misc(e) {
    const val = num(e.target.value);
    if (state.adjustmentType === 'Discount' && val > baseTotal()) {
        alert('Discount cannot exceed total amount');
        e.target.value = 0;
        state.adjustmentAmount = 0;
        updateUI();
        return;
    }
    state.adjustmentAmount = val;
    updateUI();
}

function PayOfflineModalClose() {
    // console.log('PayOfflineModalClose');

    const $modal = $('#offlinePayModal');

    // Reset form
    const form = $modal.find('form')[0];
    if (form) form.reset();

    // Clear tables
    $('#tblCustomers tbody').empty();

    // Reset amounts
    $('#offlineitemCount, #totalamt, #subTotal').val(0);

    subTotal = 0;
    totalAmount = 0;
    dayFeeAmount = 0;
    planReviewAmount = 0;

    // Reset discount
    state.adjustmentType = null;
    state.adjustmentAmount = 0;

    $('[name="discOrAdd"]').prop({
        checked: false,
        disabled: true
    });

    $('#discOrAddAmount').val(0).prop('readonly', true);
    $('#discOrAddNote').val('').prop('readonly', true);

    // Reset payment method
    $('#payMethodId').html(`
        <option disabled selected>--Select--</option>
        <option value="Cash">Cash</option>
        <option value="Check">Check</option>
        <option value="Card">Card</option>
        <option value="Money Order">Money Order</option>
    `);

    $('#itemReferenceNumber').prop('disabled', false).val('');
    $('.text-danger').text('');

    // Hide modal LAST
    $modal.modal('hide');
}
function offlinePayModal(e) {
    const el = $(e);

    $('#invoiceOfflineNo').val(el.data('invoice'));
    $('#amountDue').val(el.data('total-amount'));
    $('#lateFee').val(el.data('late-fee-amount'));
    $('#plan_review_fee').val(el.data('plan-review-fee-amount'));
    $('#itemAmt').val(el.data('total-amount'));

    $('#dayCountFee').val(el.data('day-wise-amount') || 0);

    $('#selectedPermitFee').val(el.data('sub-total-amount-amount'));
    $('#paymentId').val(el.data('id'));
    $('#permit_id').val(el.data('permit-id'));
    $('#payment_details').val(el.data('payment-details'));

    $('#offlinePayModal').modal('show');
}
function PaymentOfflineSubmit() {

    const permit_id = $('#permit_id').val();
    const paymentId = $('#paymentId').val();
    const invoiceNo = $('#invoiceOfflineNo').val();
    const collectionDate = $('#collectionDt').val();
    const paymentMethod = $('#payMethodId').val();
    const paymentReferenceNumber = $('#itemReferenceNumber').val();
    const paymentAmount = parseFloat($('#itemAmt').val() || 0);

    /* ---------- Validation ---------- */
    if (!collectionDate) {
        toastr.error('Collection date is required');
        return;
    }

    if (!paymentMethod) {
        toastr.error('Please select payment method');
        return;
    }

    if (paymentAmount <= 0) {
        toastr.error('Invalid payment amount');
        return;
    }

    /* ---------- Build FormData ---------- */
    const formData = new FormData();
    formData.append('permit_id', permit_id);
    formData.append('paymentId', paymentId);
    formData.append('invoiceNo', invoiceNo);
    formData.append('collectionDate', collectionDate);
    formData.append('paymentMethod', paymentMethod);
    formData.append('paymentReferenceNumber', paymentReferenceNumber);
    formData.append('paymentAmount', paymentAmount);
    formData.append('permitTypeId', $('#permit_type_id').val());

    /* ---------- UI lock ---------- */
    $('#PaysaveBtn').prop('disabled', true);
    $('#Payspin').show();
    $('#Paysaveicon').hide();
    $('#loading-wrapper').show();

    /* ---------- Async AJAX ---------- */
    const xhr = new XMLHttpRequest();
    xhr.open("POST", submitPayment, true);
    xhr.setRequestHeader("X-CSRF-TOKEN", csrfToken);

    xhr.onload = function () {
        $('#loading-wrapper').hide();
        $('#Payspin').hide();
        $('#Paysaveicon').show();
        $('#PaysaveBtn').prop('disabled', false);

        if (xhr.status === 200) {
            toastr.success('Payment saved successfully!');
            $('#offlinePayModal').modal('hide');

            setTimeout(() => window.location.reload(), 1200);
        } else {
            let res = {};
            try { res = JSON.parse(xhr.responseText); } catch {}
            toastr.error(res.message || 'Payment failed');
        }
    };

    xhr.onerror = function () {
        $('#loading-wrapper').hide();
        toastr.error('Network error. Please try again.');
    };

    xhr.send(formData);
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
