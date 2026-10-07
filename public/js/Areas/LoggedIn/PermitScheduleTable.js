var scDtable;
function loadSchedulerTable() {
    //alert($('#eid').val());
    var encryptedid = $('#encryptedEstId').val();
    var url = window.location.href;
    //alert(id);
      scDtable = $('#SchedulerTable').DataTable({
        "responsive": true,
        "lengthChange": false,
        "autoWidth": false,
        "ajax": {
            "url": "/GetAllSchedule?id=" + encryptedid

        },
        "columns": [
            {
                data: 'encryptedId',
                render: function (data, type, row, meta) {
                    return meta.row + /*meta.settings._iDisplayStart +*/ 1;
                }
                , "width": "5%"
            },
            { "data": "purpose", "width": "25%" },
            { "data": "scheduledDate", "width": "25%" },
            { "data": "assignedTo", "width": "15%" },
            { "data": "createdBy", "width": "15%" },
            {
                "data": "isInspected", "render": function (data, type, row, meta) {
                    if (data == "Yes") {
                        return ` <div class="m-75 btn-group"  role="group">
                                        <i class="fas fa-check-circle  ml-4" style="color:#8B9BB2"></i>
                                    </div>`
                    }
                    else {
                        return ` <div class="m-75 btn-group"  role="group">
                                        <i class="fa-solid fa-circle-xmark ml-4" style="color:#8B9BB2"></i>
                                    </div>`
                    }
                },
            },
            {
                "data": "encryptedId", "render": function (data, type, row, meta) {
                    if (!url.includes('View')) {
                        if (row.isInspected == "No" && row.statusId != 3) {
                            //if (row.assignedTo == "NA") {
                            //    return ` <div class="m-75 btn-group"  role="group">
                            //            <a data-bs-toggle="modal" data-bs-target="#scheduler" onclick="SchedulerModal(${data})" ><i class="fas fa-edit" style="color:#8B9BB2; cursor:pointer" title="Edit"></i></a>
                            //             <a href="/LoggedIn/RFInspection/Create?id=${data}"><i class="fa-sharp fa-solid fa-magnifying-glass-plus ml-4" style="color:#8B9BB2; cursor:pointer" title="Proceed To Inspection"></i></a>
                            //        </div>`
                            //}
                            //else
                            //{
                            //    return ` <div class="m-75 btn-group"  role="group">
                            //            <a data-bs-toggle="modal" data-bs-target="#scheduler" onclick="SchedulerModal(${data})" ><i class="fas fa-edit" style="color:#8B9BB2; cursor:pointer" title="Edit"></i></a>

                            //        </div>`
                            //}
                            if ($('#rl').val() == "Staff") {
                                return ` <div class="m-75 btn-group"  role="group">
                                        <a class="btn btn-sm btn-custom" onclick="SchedulerModal('/GetPermitSchedule?id=' + '${data}')" ><i class="fas fa-edit" style=" cursor:pointer" title="Edit"></i></a>
                                    </div>`
                            }
                            else {
                                return ` <div class="m-75 btn-group"  role="group">
                                        <a class="btn btn-sm btn-custom" onclick="SchedulerModal('/GetPermitSchedule?id=' + '${data}')" ><i class="fas fa-edit" style=" cursor:pointer" title="Edit"></i></a>
                                        
                                    </div>`
                            }
                        }
                        return null
                    }
                    else {
                        return null;
                    }

                },
                "width": "10%"
            }
        ],
        columnDefs: [
            {
                targets: [2],
                render: function (data, type, row) {
                    var insDate = data.split("T");
                    insDate = moment(insDate[0], "YYYY-MM-DD").format("MM/DD/YYYY");
                    return insDate;
                }
            }
        ],
        "language": {
            "emptyTable": "No Records found"
        },
        "width": "100%",
        "createdRow": function (row, data, dataIndex) {
            if ($(data)[0].isInspected == "Yes") {
                $(row).css('color', 'red');
            }
            if ($(data)[0].statusId == 3) {
                $(row).css('color', 'red');
            }
        }
    });
}


function SchedulerModal(url) {
    $.ajax({
        type: "GET",
        url: url,
        success: function (data) {
            console.log(data);
              $('#SchId').val(data.schedule.id);
              $('#SchEstId').val(data.schedule.establishmentId);
              var dateStr = data.schedule.scheduledDate.split('T')[0];
              $('#schDate').val(dateStr);
              $('#purpose').val(data.schedule.purposeId);
              $('#assignTo').val(data.schedule.assignedTo);
              $('#scheduleUploadModal').modal('show');
        }
    });
}

function NewSchedulebtn() {
    $('#Schedulerform').trigger('reset');
    $('#SchCalendericon').show();
    $('#Schspin').hide();
    $('#ScheduleSubmitBtn').prop('disabled', false);
    var EstId = $('#eid').val();
    //alert(EstId);
    $('#customScheduleEstId').val(EstId);
    $('#customScheduleId').val(0);
    $('#insPurpose').prop('disabled', false);
    //$('#insPurpose option[value="1"]').remove();
    $('#insPurpose').show();
    $('#purposeTxt').hide();

}

function SchModalCloseAlert() {
      var flg = 0;
      console.log($('#schDate').val());
      console.log($('#purpose').val());
      console.log($('#assignTo').val());

      if ($('#schDate').val() != "" || $('#purpose').val() != "--Select--" || $('#assignTo').val() != "--Select--") {
        flg = 1;
    }

    if (flg == 1) {
        if (confirm("You have some unsaved Changes. On closing, your progress will be lost")) {
              $('#scheduleUploadModal').modal('hide');
        }
    }
    else {
          $('#scheduleUploadModal').modal('hide');
    }
}

function Scheduleclrall() {
      $('#Schedulerform').trigger('reset');
}


function Schedule()
{
      var reqTxt = " Required Field ";
      var flg = 0;
      if ($('#schDate').val() == "") {
            $('#schDateError').text("\u24d8" + reqTxt);
            setTimeout(() => {
                  $('#schDateError').html("");
            }, 5000)
            flg = 1;
      }
      if ($('#purpose').val() == null) {
            $('#purposeError').text("\u24d8" + reqTxt);
            setTimeout(() => {
                  $('#purposeError').html("");
            }, 5000)
            flg = 1;
      }
      if ($('#assignTo').val() == null) {
            $('#assignToError').text("\u24d8" + reqTxt);
            setTimeout(() => {
                  $('#assignToError').html("");
            }, 5000)
            flg = 1;
      }
      if (flg == 1) {
            return false;
      }
      else {
            $.ajax({
                  type: "POST",
                  url: "/ScheduleInspection",
                  data: $('#Schedulerform').serialize(),
                  beforeSend: function () {
                        $('div#loading-wrapper').show();
                        $('#spin').show();
                        $('#saveicon').hide();
                  },
                  success: function (data) {
                        if (data.success) {
                              $('audio#success_sound')[0].play();
                              setTimeout(() => {
                                    toastr.success(data.msg);
                              }, 500)
                              console.log("Yes");
                              scDtable.ajax.reload();
                        }
                        else {
                              $('audio#errorsound')[0].play();
                              setTimeout(() => {
                                    toastr.error(data.msg);
                              }, 775)
                        }
                  },
                  error: function (data) {
                        console.log(data);
                  },
                  complete: function () {
                        $('div#loading-wrapper').hide();
                        $('#spin').hide();
                        $('#saveicon').show();
                        $('#scheduleUploadModal').modal('hide');
                        //$('#userUpsert').modal('hide');
                        
                  }
            })
      }
}