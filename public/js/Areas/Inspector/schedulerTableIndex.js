var dataTable;

function loadDataTable(apiUrl, code, Tok, Role) {
    dataTable = $('#schedulerTableIdx').DataTable({
        "responsive": true,
        "lengthChange": false,
        "autoWidth": false,
        //"searching": false,
        //"dom": "lrtp",
        //layout: {
        //    topEnd: {
        //        search: {
        //            css: 'display:none'
        //        }
        //    },
        //},
        //"dom": "lrtip",
        //"dom": '<"bottom"i>rt<"bottom"rp><"clear">',
        "ajax": {
            "url": apiUrl + "/GetAllScheduledInspections?code=" + code,
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
            { "data": "permit", "width": "15%", className: "text-left" },
            { "data": "name", "width": "20%" },
            { "data": "purpose", "width": "20%" },
            { "data": "scheduledDate", "width": "20%" },

            {
                "data": "encryptedId", "render": function (data, type, row, meta) {
                    var Insurl = ""; 
                    if (row.purpose == "Opening Inspection") {
                        Insurl = "/OpeningInspection"
                    }
                    else {
                        Insurl = "/NewInspection"
                    }
                    return `<div class="m-75 btn-group"  role="group">      
                                          
                                          <a class="btn btn-sm btn-custom"  href="${Insurl}?id=${data}"><i class="fa-solid fa-circle-play" aria-hidden="true" style="cursor:pointer" title="Proceed To Inspection"></i></a>
                                    </div>`
                }, "width": "20%"

            }

        ],
        columnDefs: [
            {
                targets: [4],
                render: function (data, type, row) {
                    var schDate = data.split("T");
                    schDate = moment(schDate[0], "YYYY-MM-DD").format("MM/DD/YYYY");
                    return schDate;
                }
            },
        ],
        "language": {
            "emptyTable": "No Records found"
        },
        "width": "100%",
    });

    //alert(1);
    //setTimeout(function () {

    //}, 100);

    $('#schedulerTableIdx thead tr:eq(0) th').each(function (i) {
        $('input', this).on('keyup change clear', function () {
            //console.log(this.value);
            //console.log(i);
            if (dataTable.column(i).search() !== this.value) {
                dataTable
                    .column(i)
                    .search(this.value)
                    .draw();
            }
        });
    });
}


function nullify() {
      if ($('#estName').val() == "") {
            $('#permitNo').val("");
            $('#hdnestablishment').val("");
            //alert($('#flwUpchk').val());
      }
      else {
            //$('#txtEstablishment').removeClass(' border-danger');
            $('#estError').text("");
      }
}

function clrall(role) {
    if (role == "Admin Inspector" || role == "SuperAdmin") {
        $('#AssignUserSection').show();
    }
    $('#newScheduleForm').trigger('reset')
}

function SchModalert() {

      $('#scheduleModal').modal('hide');
}







