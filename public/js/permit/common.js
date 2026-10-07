/////Document Upload/////////////////
document.getElementById('uploadDoc')?.addEventListener('click', function (e) {

    var reqTxt = "Required Field"
    var fileTxt = "No File Chosen To Upload"
    var errorFlag = 0;

    var permit_type_id = document.getElementById('permit_type_id').value;
    var permit_id = document.getElementById('id').value;
    var doc_id = document.getElementById('doc_id').value;
    var documentName = document.getElementById('docName').value;
    var file = document.getElementById('file').files[0];
    var description = document.getElementById('description').value;
    e.target.disabled = true;
    if (documentName == "") {
        document.getElementById('docNameError').innerText = "\u24d8 " + reqTxt;
        errorFlag = 1
    }

    if (!file && !doc_id) {
        document.getElementById('fileError').innerText = "\u24d8 " + fileTxt;
        errorFlag = 1;
        e.target.disabled = false;
        return false;
    }

    //////////////
    if(file){
        var requiredfileExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
        var fileExtension = file.type.split('/').pop().toLowerCase();
        //debugger;
        if (!requiredfileExtensions.includes(fileExtension)) {
            // $('#fileError').html("");
            document.getElementById('fileError').innerText = "\u24d8 " + " Invalid File Format";
            errorFlag = 1;

        }
    }

    //////////////

    if (errorFlag == 1) {
        setTimeout(function () {
            e.target.closest("div.modal-content").querySelectorAll(".error").forEach(function (item, index) {
                item.innerText = "";
            });
        }, 3000);
        e.target.disabled = false;
        return false;
    }

    var uploadPermitDocumentUrl = e.target.closest("form").getAttribute("action");

    var formData = new FormData();
    formData.append("permit_type_id", permit_type_id);
    formData.append("permit_id", permit_id);
    formData.append("doc_id", doc_id);
    formData.append('document_name', documentName);
    if (file) {
        formData.append("document", file);
    }
    formData.append('description', description);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", uploadPermitDocumentUrl, false);
    // xhr.setRequestHeader("Content-Type","application/json");
    xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);
    xhr.onload = function () {
        //console.log(this);
        if (this.status == 200) {
            toastr.success("Document saved successfully! Please refresh the page to see the changes.");
            window.location.reload();
        }

        if (this.status == 500) {
            toastr.error("Problem while uploading document!");
        }
    }
    xhr.send(formData);
    e.target.disabled = false;
    $('#documentUploadModal').modal('hide');
    e.target.closest('form').reset();
    e.target.closest('form').querySelector(".custom-file-label").innerHTML = "Select the file";
});

/////Note Upload/////////////////
document.getElementById('uploadNote')?.addEventListener('click', function (e) {

    var permit_type_id = document.getElementById('permit_type_id').value;
    var permit_id = document.getElementById('id').value;
    var note_id = document.getElementById('note_id').value;
    var content = document.getElementById('content').value;
    var permit_status = document.getElementById('permit_status').value;
    var paymentId = document.getElementById('payment_id').value;

    e.target.disabled = true;
    if (content == "") {
        document.getElementById('noteError').innerText = "\u24d8 " + "Required Field";
        setTimeout(function () {
            e.target.closest("div.modal-content").querySelectorAll(".error").forEach(function (item, index) {
                item.innerText = "";
            });
        }, 3000);
        e.target.disabled = false;
        return false;
    }

    var formData = new FormData();
    formData.append("permit_type_id", permit_type_id);
    formData.append("permit_id", permit_id);
    formData.append("note_id", note_id);
    formData.append('content', content);
    formData.append('permit_status', permit_status);
    formData.append("payment_id", paymentId);


    var xhr = new XMLHttpRequest();
    var uploadPermitNoteUrl = e.target.closest("form").getAttribute("action");
    console.log(uploadPermitNoteUrl);
    xhr.open("POST", uploadPermitNoteUrl, false);
    // xhr.setRequestHeader("Content-Type","application/json");
    xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);
    xhr.onload = function () {
        //console.log(this);
        if (this.status == 200) {
            toastr.success("Note saved successfully! Please refresh the page to see the changes.");
            window.location.reload();
        }

        if (this.status == 500) {
            toastr.error("Problem while uploading note!");
        }
    }
    xhr.send(formData);
    e.target.disabled = false;
    $('#noteUploadModal').modal('hide');
    e.target.closest('form').reset();
});

/////Schedule Upload/////////////////
document.getElementById('uploadSchedule')?.addEventListener('click', function (e) {

    var permit_type_id = document.getElementById('permit_type_id').value;
    var permit_id = document.getElementById('id').value;
    var schedule_type = document.getElementById('id').value;

    var schedule_id = document.getElementById('schedule_id').value;
    var purpose_id = document.getElementById('purpose_id').value;

    var permit_number = document.getElementById('permit_number').value;
    var inspection_date = document.getElementById('inspection_date').value;
    var inspector_id = document.getElementById('inspector_id').value;
    e.target.disabled = true;

    var errorFlag = 0;

    if (inspection_date == "") {
        document.getElementById('inspection_dateError').innerText = "\u24d8 " + "Required Field";
        errorFlag = 1
    }

    if (inspector_id == "") {
        document.getElementById('inspector_idError').innerText = "\u24d8 " + "Required Field";
        errorFlag = 1
    }
    if (purpose_id == "") {
        document.getElementById('purpose_idError').innerText = "\u24d8 " + "Required Field";
        errorFlag = 1
    }

    if (errorFlag == 1) {
        setTimeout(function () {
            e.target.closest("div.modal-content").querySelectorAll(".error").forEach(function (item, index) {
                item.innerText = "";
            });
        }, 3000);
        e.target.disabled = false;
        return false;
    }


    var formData = new FormData();
    formData.append("permit_type_id", permit_type_id);
    formData.append("permit_id", permit_id);
    formData.append("schedule_id", schedule_id);
    formData.append("purpose_id", purpose_id);

    formData.append('permit_number', permit_number);
    formData.append('inspection_date', inspection_date);
    formData.append('inspector_id', inspector_id);
    formData.append('_method', "POST");
    formData.append('_token', csrfToken);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", createScheduleUrl, false);
    // xhr.setRequestHeader("Content-Type","application/json");
    xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);
    xhr.onload = function () {
        //console.log(this);
        if (this.status == 200) {
            toastr.success("Schedule saved successfully! Please refresh the page to see th changes.");
            window.location.reload();
        }

        if (this.status == 500) {
            toastr.error("Problem while uploading schedule!");
        }
    }
    xhr.send(formData);
    e.target.disabled = false;
    $('#scheduleUploadModal').modal('hide');
    e.target.closest('form').reset();
});


/////Payment Upload/////////////////
document.getElementById('paid_for')?.addEventListener('change', function (e) {
    if (e.target.value == "permit_fee") {
        document.getElementById('amount_paid').value = totalPermitFees;
    } else {
        document.getElementById('amount_paid').value = 0;
    }
});

document.getElementById('uploadPayment')?.addEventListener('click', function (e) {

    let permit_type_id = document.getElementById('permit_type_id').value;
    let permit_id = document.getElementById('id').value;
    let permit_number = document.getElementById('permit_number').value;
    let paid_for = document.getElementById('paid_for').value;

    let amount_paid = document.getElementById('amount_paid').value;
    let payment_mode = document.getElementById('payment_mode').value;
    let debit_credit_cheque_number = document.getElementById('debit_credit_cheque_number').value;
    let receipt_number = document.getElementById('receipt_number').value;

    e.target.disabled = true;

    let errorFlag = 0;

    if (paid_for == "") {
        document.getElementById('paid_forError').innerText = "\u24d8 " + "Required Field";
        errorFlag = 1
    }

    if (payment_mode == "") {
        document.getElementById('payment_modeError').innerText = "\u24d8 " + "Required Field";
        errorFlag = 1
    }

    if (payment_mode == "Check" || payment_mode == "Debit Card" || payment_mode == "Credit Card" || payment_mode == "Travelers Check") {
        if (debit_credit_cheque_number == "") {
            document.getElementById('debit_credit_cheque_numberError').innerText = "\u24d8 " + "Required Field";
            errorFlag = 1
        }
    }

    if (receipt_number == "") {
        document.getElementById('receipt_numberError').innerText = "\u24d8 " + "Required Field";
        errorFlag = 1
    }

    if (errorFlag == 1) {
        setTimeout(function () {
            e.target.closest("div.modal-content").querySelectorAll(".error").forEach(function (item, index) {
                item.innerText = "";
            });
        }, 3000);
        e.target.disabled = false;
        return false;
    }

    let formData = new FormData();
    formData.append("permit_type_id", permit_type_id);
    formData.append("permit_id", permit_id);
    formData.append("permit_number", permit_number);
    formData.append('paid_for', paid_for);
    formData.append("amount_paid", amount_paid);
    formData.append('payment_mode', payment_mode);
    formData.append('debit_credit_cheque_number', debit_credit_cheque_number);
    formData.append('receipt_number', receipt_number);
    let submitPaymentUrl = e.target.closest("form").getAttribute("action");
    let xhr = new XMLHttpRequest();
    xhr.open("POST", submitPaymentUrl, false);
    xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);
    xhr.onload = function () {
        // console.log(this);
        let response = JSON.parse(xhr.responseText);
        if (this.status == 200) {
            toastr.success("Payment saved successfully! Please refresh the page to see the changes.");
        }

        setTimeout(() => {
            window.location.reload();
        }, 1500);

        if (this.status == 500) {
            toastr.error(response.message);
            console.log(response.message);
        }
    }
    xhr.send(formData);
    e.target.disabled = false;
    /* let modal = new bootstrap.Modal(e.target.closest('div.modal'));
    modal.hide(); */
    $('#paymentUploadModal').modal('hide');
    e.target.closest('form').reset();
});


document.getElementById('payment_mode')?.addEventListener('change', function (e) {
    e.target.classList.remove('border-danger');
    let modal = e.target.closest('div.modal');
    if (e.target.value == 'Check' || e.target.value == 'Travelers Check' || e.target.value == 'Debit Card'
        || e.target.value == 'Credit Card') {
        modal.querySelector('.debitCreditCheckNumber').classList.remove('hideOnLoad');

    }
    else {
        modal.querySelector('.debitCreditCheckNumber').classList.add('hideOnLoad');
        modal.querySelector('.debitCreditCheckNumber').querySelector('input[type="text"]').value = '';
    }
    // modal.querySelector('.onSelectPaymentModeDebit').querySelector('input[type="text"]').setAttribute('readonly',false);
    // modal.querySelector('.onSelectPaymentModeCredit').querySelector('input[type="text"]').setAttribute('readonly',false);
    // modal.querySelector('.onSelectPaymentModeCheck').querySelector('input[type="text"]').setAttribute('readonly',false);

});

function deleteDoc(element) {
    // alert('test');
    Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete this record?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(function (result) {
        if (result.value) {
            document.getElementById('loading-wrapper').style.display = 'block';
            var doc_id = element.closest('tr').getAttribute('data-id');
            const xhttp = new XMLHttpRequest();
            deleteDocUrl = deleteDocUrl.replace(":doc_id", doc_id);
            xhttp.open("GET", deleteDocUrl, true);
            // xhttp.setRequestHeader("X-CSRF-TOKEN",csrfToken);
            // xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhttp.onload = function () {
                if (this.status == 200) {
                    setTimeout(() => {
                        document.getElementById('loading-wrapper').style.display = 'none';
                        element.closest("tr").remove();
                        var message = JSON.parse(this.responseText).message;
                        toastr.success(message);

                    }, 3000);
                }
            }
            //element.parentElement.innerHTML = '<button class="btn btn-xs btn-success" >Approved</button>';
            xhttp.send();
        }
    });
}

function deleteNote(element) {
    Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete this record?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then(function (result) {
        if (result.value) {
            document.getElementById('loading-wrapper').style.display = 'block';
            var note_id = element.closest('tr').getAttribute('data-id');
            const xhttp = new XMLHttpRequest();
            deleteNoteUrl = deleteNoteUrl.replace(":note_id", note_id);
            xhttp.open("GET", deleteNoteUrl, true);
            // xhttp.setRequestHeader("X-CSRF-TOKEN",csrfToken);
            // xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhttp.onload = function () {
                if (this.status == 200) {
                    setTimeout(() => {
                        document.getElementById('loading-wrapper').style.display = 'none';
                        element.closest("tr").remove();
                        var message = JSON.parse(this.responseText).message;
                        toastr.success(message);

                    }, 3000);
                }
            }
            //element.parentElement.innerHTML = '<button class="btn btn-xs btn-success" >Approved</button>';
            xhttp.send();
        }
    });
}

function editNote(data) {
    // console.log(data);
    let noteUploadModal = document.getElementById('noteUploadModal');
    document.getElementById('uploadNoteModalBtn').click();
    noteUploadModal.querySelector('#note_id').value = data.id;
    noteUploadModal.querySelector('#content').value = data.content;
}

function paymentNote(data) {
    // console.log(data);
    let noteUploadModal = document.getElementById('noteUploadModal');
    document.getElementById('uploadNoteModalBtn').click();
    noteUploadModal.querySelector('#payment_id').value = data;
    // noteUploadModal.querySelector('#content').value = data.content;
}

function editDoc(data) {
    console.log(data);
    let documentUploadModal = document.getElementById('documentUploadModal');
    document.getElementById('uploadDocModalBtn').click();
    documentUploadModal.querySelector('#doc_id').value = data.id;
    documentUploadModal.querySelector('#docName').value = data.doc_name;
    documentUploadModal.querySelector('#description').value = data.description;


    if (data.file_path) {
        let fileName = data.file_path.split(/[\\/]/).pop();

        let fileLabel = documentUploadModal.querySelector('.custom-file-label');

        if (fileLabel) {
            fileLabel.classList.add('selected');
            fileLabel.textContent = fileName;
        }
    }
//    documentUploadModal.querySelector('input#file').prop('disabled',true);


    // documentUploadModal.querySelector('#docName').readOnly = true;
    // documentUploadModal.querySelector('#description').readOnly = true;
    documentUploadModal.querySelector('#file').disabled = true;
}
