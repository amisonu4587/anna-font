var dataTable;

function loadDataTable(apiUrl, code, Tok, Role) {
    dataTable = $('#inspectionTableIdx').DataTable({
        "responsive": true,
        "lengthChange": false,
        "autoWidth": false,
        "ajax": {
            "url": apiUrl + "/GetAllInspections?code=" + code,
            headers: {
                'Authorization': `Bearer ${Tok}`,
                'Role': Role,
                'Content-Type': 'application/json'
            },
            "dataSrc": function (data) {
                //console.log(data);
                if (data.success) {
                    return data.response.result;
                } else {
                    return [];
                }
            }
        },
        "columns": [
            {
                data: 'id',
                render: function (data, type, row, meta) {
                    //console.log(row);
                    return meta.row + /*meta.settings._iDisplayStart +*/ 1;
                }, "width": "5%", className: "text-center"
            },
            { "data": "permit", "width": "10%", className: "text-left" },
            { "data": "name", "width": "30%" },
            { "data": "purpose", "width": "15%" },
            { "data": "inspectionDate", "width": "10%" },
            { "data": "followUp", "width": "10%" },
            { "data": "followUpDate", "width": "10%" },

            {
                  "data": "encryptedId", "render": function (data, type, row, meta) {
                        var Pdfurl = "";
                        if (row.purpose == "Opening Inspection") {
                              Pdfurl = "/OpeningInspectionPdf"
                        }
                        else {
                              Pdfurl = "/InspectionPdf"
                        }
                        return `<div class="m-75 btn-group"  role="group">      
                                          <a class="btn btn-sm btn-custom"  href="${Pdfurl}?id=${data}" target="blank"><i class="fas fa-file-pdf" aria-hidden="true" style="cursor:pointer" title="View Report"></i></a>
                                          <a class="btn btn-sm btn-custom"  data-bs-toggle="modal" data-bs-target="#mailSend" onclick="$('#SendMail').trigger('reset');$('#IID').val('${data}');$('#purpose').val('${row.purpose}')"><i class="fa-solid fa-envelope" aria-hidden="true" style="cursor:pointer" title="Send Mail"></i></a>
                                    </div>`
                  }, "width": "5%"

            }

        ],
        columnDefs: [
            {
                targets: [4],
                render: function (data, type, row) {
                    var insDate = data.split("T");
                    insDate = moment(insDate[0], "YYYY-MM-DD").format("MM/DD/YYYY");
                    return insDate;
                }
            },
            {
                targets: [5],
                render: function (data, type, row) {
                    //var insDate = data.split("T");
                    //insDate = moment(insDate[0], "YYYY-MM-DD").format("MM/DD/YYYY");
                    if (data == true) {
                        return `<p class="badge bg-danger">YES</p>`
                    }
                    return `<p class="badge bg-success">No</p>`
                }
            },
            {
                targets: [6],
                render: function (data, type, row) {
                    if (data != null) {
                        var insDate = data.split("T");
                        insDate = moment(insDate[0], "YYYY-MM-DD").format("MM/DD/YYYY");
                        return insDate;
                    }
                    return "---"
                }
            },
            

        ],

        "language": {
            "emptyTable": "No Records found"
        },
        "width": "100%",
    });
}


function MailModal(InspectionId) {
    $('#SendMail').trigger("reset");
    $('#IID').val(InspectionId);
}

function Modalert() {
    var flg = 0;
    //console.log($('#purpose').val());
    if ($('#ToMail').val() != "" || $('#CCmail').val() != "" || $('#sub').val() != "" || $('#bdy').val() != "") {
        flg = 1;
    }
    if (flg == 1) {
        if (confirm("You have some unsaved Changes. On closing, your progress will be lost")) {
            $('#mailSend').modal('hide');
        }
    }
    else {
        $('#mailSend').modal('hide');
    }
}


function SendMail() {
    let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
    var flg = 0;
    if ($('#ToMail').val() == null || $('#ToMail').val() == "") {
        $('#toEmailError').text("\u24d8 This Field is Required");
        setTimeout(() => {
            $('#toEmailError').html("");
        }, 5000)
        flg = 1;
    }
    else {
        var str = $('#ToMail').val();
        var mailids = str.split(',');
        for (let i = 0; i < mailids.length; i++) {
            if (regex.test(mailids[i]) == false) {
                $('#toEmailError').text("\u24d8 One or more Email Id is invalid");
                setTimeout(() => {
                    $('#toEmailError').html("");
                }, 5000)
                flg = 1;
            }
        }
    }
    if ($('#sub').val() == null || $('#sub').val() == "") {
        $('#subError').text("\u24d8 This Field is Required");
        setTimeout(() => {
            $('#subError').html("");
        }, 5000)
        flg = 1;
    }
    if (flg == 1) {
        return false;
    }

    var purpose = $('#purpose').val();
    var url = "";
    if (purpose == "Opening Inspection") {
          url = "/SendOpeningInspectionMailPdf";
    }
    else {
          url = "/SendInspectionMailPdf";
    }
    var data = $('#SendMail').serialize();
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        beforeSend: function () {
            $('div#loading-wrapper').hide();
            $('#spin').show();
            $('#saveicon').hide();
            $('#sendBtn').prop('disabled', true)
        },
        success: function (data) {
            //console.log(data);
            if (data.success) {
                
                $('audio#success_sound')[0].play();
                setTimeout(() => {
                    toastr.info(data.msg);
                }, 500)
            }
            else {
                $('#mailSend').modal('hide');
                $('audio#errorsound')[0].play();
                setTimeout(() => {
                    toastr.error(data.msg);
                }, 775)
            }
            $('div#overlay').hide();
        },
        complete: function () {
            $('div#loading-wrapper').hide();
            $('#spin').hide();
            $('#saveicon').show();
            $('#sendBtn').prop('disabled', false)
            $('#mailSend').modal('hide');
        }
    });
}
