var paymentDataTable;

function loadPaymentTable() {
    //alert($('#eid').val());
    var encryptedid = $('#encryptedEstId').val();
    var url = window.location.href;
    //alert(id);
    paymentDataTable = $('#PaymentTable').DataTable({
        "responsive": true,
        "lengthChange": false,
        "autoWidth": false,
        "searching": false,
        //"paging": false,
        "ajax": {
            "url": "/GetAllPayment?id=" + encryptedid
        },
        "columns": [
            {
                data: 'encryptedId',
                render: function (data, type, row, meta) {
                    return meta.row + /*meta.settings._iDisplayStart +*/ 1;
                }
                , "width": "5%", className: "text-left"
            },
            { "data": "invoiceNo", "width": "15%" },
            {
                "data": "amount", width: "10%", 'render': function (amount) {
                    return '$' + amount.toFixed(2);
                }, className: "text-left"
            },
            { "data": "modeofPay", "width": "15%" },
            { "data": "method", "width": "15%" },
            { "data": "status", "width": "10%" },
            {
                  "data": "encryptedId", "render": function (data, type, row, meta) 
                  {
                        if (!url.includes('View')) {
                              if (row.status != "Cancelled") {
                                    return `<a id="lnk_${meta.row}" role="button" href="/GetInvoicePdf?id=${data}" target="blank">
                                                <i class="fas fa-file-pdf ml-4" style="color:#022E5F; cursor:pointer" title="View Doc"></i>
                                          </a>`;
                              }
                              else {
                                    return null
                              }
                        }
                        //if (row.status == "Cancelled") {
                        //      return `<a id="lnk_${meta.row}" role="button" href="/GetInvoicePdf?id=${data}" target="blank">
                        //                        <i class="fas fa-file-pdf ml-4" style="color:#022E5F; cursor:pointer" title="View Doc"></i>
                        //                  </a>`;
                        //}
                        //else {
                        //      return null
                        //}
                        
                        
                  }, "width": "5%"  
            },
            {
                  "data": "encryptedId", "render": function (data, type, row, meta) {
                    if (!url.includes('View')) {
                        if (row.status == "Paid") {
                            return `<a id="lnk_${meta.row}" role="button" href="/GetReceiptPdf?id=${data}" target="blank">
                                          <i class="fas fa-file-pdf ml-4" style="color:#022E5F; cursor:pointer" title="View Doc"></i>
                                    </a>`;
                        }
                        else {
                            return null;
                        }
                    }
                        
                  }, "width": "5%"
            },
            {
                "data": "encryptedId", "render": function (data, type, row, meta) {
                    if (!url.includes('View')) {
                          if (row.status == "Pending") {
                                if (row.amount <= 0) {
                                      return ` <div class="m-75 btn-group" id="docIcons${meta.row}"  role="group">
                                                
                                                <a class="btn btn-sm btn-custom" onclick = OfflinePayment('/GetFeesDetails?id=${data}')>Pay Offline</a>
                                                <a class="btn btn-sm btn-outline-danger" onclick = Cancel('/CancelPayment?id=${data}')>Cancel </a>
                                          </div>`
                                }
                                else {
                                      return ` <div class="m-75 btn-group" id="docIcons${meta.row}"  role="group">
                                                <a class="btn btn-sm btn-custom" onclick = JetPayProcess('/PaymentProcess?id=${data}')>JetPay</a>
                                                <a class="btn btn-sm btn-custom" onclick = OfflinePayment('/GetFeesDetails?id=${data}')>Pay Offline</a>
                                                <a class="btn btn-sm btn-outline-danger" onclick = Cancel('/CancelPayment?id=${data}')>Cancel </a>
                                          </div>`
                                }
                                
                          }
                          else {
                                return null;
                          }
                    }
                    else {
                        return null;
                    }

                },
                "width": "10%"
            }
            /*{ "data": "message", "width": "20%" },*/
        ],
        "language": {
            "emptyTable": "No records found"
        },
          "width": "100%",
          "createdRow": function (row, data, dataIndex) {
                if ($(data)[0].status == "Cancelled") {
                      $(row).css('color', 'red');
                }
                if ($(data)[0].status == "Paid") {
                      $(row).css('color', 'green');
                }
          }
    });
}

function Cancel(url) {    
    
    var title = "";
    var text = "";
    var confirmButtonText = "";
    var cancelButtonText = "";
    var successmsg = "";
    var errormsg = "";

    title = "Are you sure?";
    text = "You won't be able to revert this!";
    confirmButtonText = "Yes Proceed!";
    cancelButtonText = "Cancel";
    successmsg = "Cancelled Successfully";
    errormsg = "Unexpected Error Occurred";

    $('audio#warning')[0].play();
    setTimeout(() => {
        Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7aa1db',
            cancelButtonColor: '#d33',
            cancelButtonText: cancelButtonText,
            confirmButtonText: confirmButtonText
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: url,
                    beforeSend: function () {
                        $('div#loading-wrapper').show();
                    },
                    success: function (data) {
                        if (data.success) {
                            //paymentDataTable.ajax.reload();

                            //if ($('#permitStatusId').val() == 7) {
                            //    StatusChange();
                            //}

                            $('audio#success_sound')[0].play();
                            setTimeout(() => {
                                toastr.success(successmsg);
                            }, 500)
                            $('#paymentAddBtn').prop('disabled', false);
                            paymentDataTable.ajax.reload();

                        }
                        else {
                            $('audio#errorsound')[0].play();
                            setTimeout(() => {
                                toastr.error(errormsg);
                            }, 775)
                        }
                    },
                    error: function (data) {
                        console.log(data);
                    },
                    complete: function () {
                        $('div#loading-wrapper').hide();
                    }
                });
            }
        })
    }, 100)
}

function JetPayProcess(url) {

    var title = "";
    var text = "";
    var confirmButtonText = "";
    var cancelButtonText = "";
    var successmsg = "";
    var errormsg = "";

    title = "Are you sure you want to pay online?";
    text = "You will be paying through JetPay";
    confirmButtonText = "Yes Proceed!";
    cancelButtonText = "Cancel";
    successmsg = "Payment Link is sent to your registered EmailId. Please check your email to proceed with payment";
    errormsg = "Payment Link already Sent to your Email..Cannot Resend Link";

    $('audio#warning')[0].play();
    setTimeout(() => {
        Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#7aa1db',
            cancelButtonColor: '#d33',
            cancelButtonText: cancelButtonText,
            confirmButtonText: confirmButtonText
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: url,
                    beforeSend: function () {
                        $('div#loading-wrapper').show();
                    },
                    success: function (data) {
                        if (data.success) {
                            //paymentDataTable.ajax.reload();

                            //if ($('#permitStatusId').val() == 7) {
                            //    StatusChange();
                            //}

                            $('audio#success_sound')[0].play();
                            setTimeout(() => {
                                toastr.info(successmsg);
                            }, 500)
                            //$('#Cnt').val(parseInt($('#Cnt').val()) - 1);
                        }
                        else {
                            $('audio#errorsound')[0].play();
                            setTimeout(() => {
                                toastr.error(errormsg);
                            }, 775)
                        }
                    },
                    error: function (data) {
                        console.log(data);
                    },
                    complete: function () {
                        $('div#loading-wrapper').hide();
                    }
                });
            }
        })
    }, 100)
}

//function funPayment(url) {

//    var title = "";
//    var text = "";
//    var confirmButtonText = "";
//    var cancelButtonText = "";
//    var successmsg = "";
//    var errormsg = "";

//    title = "Are you sure?";
//    text = "You won't be able to revert this!";
//    confirmButtonText = "Yes Proceed!";
//    cancelButtonText = "Cancel";
//    successmsg = "Payment Successfully";
//    errormsg = "Unexpected Error Occurred";

//    $('audio#warning')[0].play();
//    setTimeout(() => {
//        Swal.fire({
//            title: title,
//            text: text,
//            icon: 'warning',
//            showCancelButton: true,
//            confirmButtonColor: '#7aa1db',
//            cancelButtonColor: '#d33',
//            cancelButtonText: cancelButtonText,
//            confirmButtonText: confirmButtonText
//        }).then((result) => {
//            if (result.isConfirmed) {
//                $.ajax({
//                    type: "POST",
//                    url: url,
//                    beforeSend: function () {
//                        $('div#loading-wrapper').show();
//                    },
//                    success: function (data) {
//                        if (data.success) {
//                            //paymentDataTable.ajax.reload();

//                            //if ($('#permitStatusId').val() == 7) {
//                            //    StatusChange();
//                            //}

//                            $('audio#success_sound')[0].play();
//                            setTimeout(() => {
//                                toastr.success(successmsg);
//                            }, 500)
//                            $('#Cnt').val(parseInt($('#Cnt').val()) - 1);
//                        }
//                        else {
//                            $('audio#errorsound')[0].play();
//                            setTimeout(() => {
//                                toastr.error(errormsg);
//                            }, 775)
//                        }
//                    },
//                    error: function (data) {
//                        console.log(data);
//                    },
//                    complete: function () {
//                        $('div#loading-wrapper').hide();
//                    }
//                });
//            }
//        })
//    }, 100)
//}


function OfflinePayment(url)
{
    $('#OfflinePaymentForm').trigger('reset');
    $('#ChequeDetailsSection').hide();
    $('#offlinePayModal').modal('show');
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            //console.log(data)
            $('#invoiceOffLineNo').val(data.fees.invoiceNo);
            $('#amount').val(data.fees.amount);
            $('#payfeesID').val(data.fees.id);
            $('#payEstID').val(data.fees.establishmentId);
        }
    })
}

function SelectedFunc(element, count, code)
{
    var latefine = 0;
    if (code == "TF") {
        var totalcnt = $('#totalcnt').val();
        //var totalcnt = $('#subTotal').val();
        for (var i = 0; i < totalcnt; i++)
        {
            $('input[type="hidden"][name="FeesList[' + i + '].IsSelected"]').prop("checked", false);
            $('input[type="hidden"][name="FeesList[' + i + '].IsSelected"]').prop("value", "false");
            /*$('#chk[1]').prop('checked', false);*/
            //$('#tstchk').prop("checked", false);
            //$('#chk[' + i + ']').prop("checked", false);
        }

        //$('input:checkbox[name=chkTempPrice]').attr('checked', false);
        //$('input:checkbox[name=chkTempPrice]').removeAttr('checked');  
        $('input:checkbox[name=chkTempPrice]').prop("checked", false);
        //$('#totalamt').val(0)
        $('#subTotal').val(0)
        //if ($('#latefine').val() != '')
        //{
        //    latefine = parseFloat($('#latefine').val());
        //    //$('#totalamt').val(latefine);
        //    $('#subTotal').val(latefine);
        //}
        
    }

    
    //var totalamt = parseFloat($('#totalamt').val());
    var totalamt = parseFloat($('#subTotal').val());
    var amt = parseFloat($('input[type="hidden"][name="FeesList[' + count + '].Amount"]').val());
    if (element == true) {
        $('input:checkbox[id=chk_' + count + ']').prop('checked', true);
        $('input[type="hidden"][name="FeesList[' + count + '].IsSelected"]').prop("checked", true);
        $('input[type="hidden"][name="FeesList[' + count + '].IsSelected"]').prop("value", "true");

        
        totalamt += amt;
        //$('#totalamt').val(totalamt)
        $('#subTotal').val(totalamt)
        //console.log($('input[type="hidden"][name="FeesList[' + count + '].EstablishmentTypeId"]').val());
    }
    else {
        $('input:checkbox[id=chk_' + count + ']').prop('checked', false);
        $('input[type="hidden"][name="FeesList[' + count + '].IsSelected"]').prop("checked", false);
        $('input[type="hidden"][name="FeesList[' + count + '].IsSelected"]').prop("value", "false");
        totalamt -= amt;
        if (code == 'TF') {
              //$('#totalamt').val(0)
              $('#subTotal').val(0)
              //if ($('#latefine').val() != '') {
              //   var latefine = parseFloat($('#latefine').val());
              //   //$('#totalamt').val(latefine);
              //    $('#subTotal').val(latefine);
              //}
            //var latefine = parseInt($('#latefine').val());
            //$('#totalamt').val(latefine);
        }
        else {
              //$('#totalamt').val(totalamt)
            $('#subTotal').val(totalamt)
        }
    }
    $('#totalamt').val(parseFloat($('#subTotal').val()) + parseFloat($('#hdnMiscelliniusFees').val()) + parseFloat($('#hdnlatefine').val()))
    if ($('#subTotal').val() == 0) {
        $(".show-radio").prop("disabled", true);
        $('#miscelliniusfees').prop('readonly', true)
        $('#miscelliniusfeesTitle').prop('readonly', true)
        $('#miscelliniusfees').val(0)
        $('#hdnMiscelliniusFees').val(0)
        $('#miscelliniusfeesTitle').val('')
        //$('.show-radio').prop('disabled', true)
    }
    else {
        $(".show-radio").prop("disabled", false);
        //$('#miscelliniusfees').prop('readonly', false)
        //$('#miscelliniusfeesTitle').prop('readonly', false)
    }
}

function Misc(val) {
    
    if (val == '') {
        alert(1);
        $('#miscelliniusfees').val(0);
        $('#hdnMiscelliniusFees').val(0);
    }
    $('#totalamt').val(parseFloat($('#subTotal').val()) + parseFloat($('#hdnlatefine').val()))
    var type = $('#adjFeesType').val();
    if (type == "Discount") {
        //console.log(type);
        $('#hdnMiscelliniusFees').val(-val);
        $('#miscelliniusfees').val(-val);
    }
    else if (type == "Additional") {
        $('#hdnMiscelliniusFees').val(val);
        $('#miscelliniusfees').val(val);
        //$('#totalamt').val(parseFloat($('#totalamt').val()) + val)
    }
    //$('#totalamt').val(parseFloat($('#totalamt').val()) + parseFloat($('#hdnMiscelliniusFees').val()))
    if ($('#miscelliniusfees').val() != '' || $('#miscelliniusfees').val() != 0) {
        $('#totalamt').val(parseFloat($('#subTotal').val()) + parseFloat($('#hdnMiscelliniusFees').val()) + parseFloat($('#hdnlatefine').val()))
    }
    
}

function radiodis() {
    if ($('#miscelliniusfees').val() != 0) {
        $('#miscelliniusfees').val(-Math.abs($('#miscelliniusfees').val()))
        $('#hdnMiscelliniusFees').val(-Math.abs($('#hdnMiscelliniusFees').val()))
    }
    else {
        $('#miscelliniusfees').val(0)
        $('#hdnMiscelliniusFees').val(0)
    }
    $('#totalamt').val(parseFloat($('#subTotal').val()) + parseFloat($('#hdnMiscelliniusFees').val()) + parseFloat($('#hdnlatefine').val()))
    //$('#miscelliniusfeesTitle').val('')
    $('#addtn').prop('checked', false);
    $('#miscelliniusfees').prop('readonly', false)
    $('#miscelliniusfeesTitle').prop('readonly', false)
    $('#adjFeesType').val("Discount");
}
function radioadd() {
    if ($('#miscelliniusfees').val() != 0) {
        $('#miscelliniusfees').val(Math.abs($('#miscelliniusfees').val()))
        $('#hdnMiscelliniusFees').val(Math.abs($('#hdnMiscelliniusFees').val()))
    }
    else {
        $('#miscelliniusfees').val(0)
        $('#hdnMiscelliniusFees').val(0)
    }
    $('#totalamt').val(parseFloat($('#subTotal').val()) + parseFloat($('#hdnMiscelliniusFees').val()) + parseFloat($('#hdnlatefine').val()))
    //$('#miscelliniusfeesTitle').val('')
    $('#discnt').prop('checked', false);
    $('#miscelliniusfees').prop('readonly', false)
    $('#miscelliniusfeesTitle').prop('readonly', false)
    $('#adjFeesType').val("Additional");
}
function radioclr() {
    $('#clr').prop('checked', false);
    $('#discnt').prop('checked', false);
    $('#addtn').prop('checked', false);
    $('#miscelliniusfees').prop('readonly', true)
    $('#miscelliniusfees').val(0)
    $('#hdnMiscelliniusFees').val(0)
    $('#miscelliniusfeesTitle').prop('readonly', true)
    $('#miscelliniusfeesTitle').val('')
    $('#adjFeesType').val("");
    $('#totalamt').val(parseFloat($('#subTotal').val()) + parseFloat($('#hdnlatefine').val()))
}

function PaymentSubmit()
{
    var flg = 0;
    var totalcnt = $('#totalcnt').val();
    for (let i = 0; i < totalcnt; i++) {
            
        if ($('input:checkbox[id=chk_'+ i +']').is(":checked")) {
                flg = 1;
                break;
        }
    }
    if (flg == 0) {
        
        $('audio#errorsound')[0].play();
        setTimeout(() => {
            toastr.error("Please Select a Fee To Proceed");
        }, 775)
        return false;
    }
    else {
          flg = 0
          if ($('#adjFeesType').val() != "") {
                if ($('#miscelliniusfeesTitle').val() == "") {

                }
                if ($('#miscelliniusfeesTitle').val() == "") {
                      $('#miscelliniusfeesTitle').css('border-color', 'red')
                      //$('#miscelliniusfeesTitleErr').text("\u24d8 Required");
                      setTimeout(() => {
                            $('#miscelliniusfeesTitle').css('border-color', '');
                      }, 4000)
                      flg = 1;
                }
                if ($('#miscelliniusfees').val() == 0) {
                      $('#miscelliniusfees').css('border-color', 'red')
                      //$('#miscelliniusfeesErr').text("\u24d8 Required");
                      setTimeout(() => {
                            //$('#miscelliniusfeesErr').html("");
                            $('#miscelliniusfees').css('border-color', '')
                      }, 4000)
                      flg = 1;
                }
          }

          if (flg == 1) {
                $('audio#errorsound')[0].play();
                setTimeout(() => {
                      toastr.error("Please Fill out required Fields");
                }, 775)
                return false;
          }
          else {
                $.ajax({
                      type: "POST",
                      url: '/SaveFees',
                      data: $('#PaymentForm').serialize(),
                      beforeSend: function () {
                            $('div#loading-wrapper').show();
                      },
                      success: function (data) {
                            if (data.success) {
                                  $('audio#success_sound')[0].play();
                                  setTimeout(() => {
                                        toastr.success("Successfully Saved");
                                  }, 500)
                                  $('#paymentAddBtn').prop('disabled', true);
                            }
                            else {
                                  $('audio#errorsound')[0].play();
                                  setTimeout(() => {
                                        toastr.error("Unexpected Error Occurred");
                                  }, 775)
                            }
                      },
                      error: function (data) {
                            console.log(data);
                      },
                      complete: function () {
                            $('div#loading-wrapper').hide();
                            $('#paymentAddModal').modal('hide');
                            paymentDataTable.ajax.reload();
                      }
                })
          }



    }

    
}

function PaySelectModalClose()
{
    $('#paymentAddModal').modal('hide');
}

function PayOfflineModalClose(url) {
    $('#offlinePayModal').modal('hide');
}

function PaymentOfflineSubmit()
{
    var flg = 0;
    console.log($('#payMethodId').val());
    if ($('#collectionDt').val() == "")
    {
        $('#collectionDtErr').text("\u24d8 Required Field")
        flg = 1;
    }
    if ($('#payMethodId').val() == null) {
        $('#payMethodIdErr').text("\u24d8 Required Field")
        flg = 1;
    }
    if ($('#payMethodId').val() == 3) {
        //if ($('#bankName').val() == "") {
        //    $('#bankNameErr').text("\u24d8 Required Field")
        //    flg = 1;
        //}
        if ($('#chequeNumber').val() == "") {
            $('#chequeNumberErr').text("\u24d8 Required Field")
            flg = 1;
        }
    }
    if (flg == 1) {
        return false;
    }
    else {
        $.ajax({
            type: "POST",
            url: "/OfflinePayment",
            data: $('#OfflinePaymentForm').serialize(),
            beforeSend: function () {
                $('div#loading-wrapper').show();
            },
            success: function (data) {
                if (data.success) {
                    $('audio#success_sound')[0].play();
                    setTimeout(() => {
                        toastr.success("Record Successfully Saved");
                    }, 500)
                    $('#paymentAddBtn').prop('disabled', false);
                    setTimeout(function () {
                        location.reload();
                    }, 1000)
                }
                else {
                      $('audio#errorsound')[0].play();
                      if (data.errormsg != null) {
                            setTimeout(() => {
                                  toastr.error(data.errormsg);
                            }, 775)
                      }
                      else {
                            setTimeout(() => {
                                  toastr.error("Unexpected Error Occurred");
                            }, 775)
                      }
                    
                    
                }
            },
            error: function (data) {
                console.log(data);
            },
            complete: function () {
                $('div#loading-wrapper').hide();
                $('#offlinePayModal').modal('hide');
                paymentDataTable.ajax.reload();
                
            }

        })
    }
}

function CheckPendingPayment()
{
      var encryptedid = $('#encryptedEstId').val();
      $.ajax({
            type: "GET",
            url: '/CheckPendingPayment?id=' + encryptedid,
            success: function (data) {
                  if (data.success)
                  {
                        $('#paymentAddBtn').prop('disabled', true);
                  }
                  
            }
      })
}