var dataTable;
var dataTableRetail;
var dataTableMobile;
var dataTableTemp;

$(function () {
    loadDataTable();
    loadRetailDataTable();
    loadMobileDataTable();
    loadTempDataTable();
});

function loadDataTable() {

    dataTable = $('#permitIdx').DataTable({
        "responsive": true,
        "lengthChange": false,
        "autoWidth": false,
        "ajax": {
            "url": "/GetAllPermits"
        },
        "columns": [
            {
                data: 'id',
                render: function (data, type, row, meta) {
                    //console.log(row);
                    return meta.row + meta.settings._iDisplayStart + 1;
                }
            },
            { "data": "permitNumber" },
            { "data": "name" },
            { "data": "territory" },
            { "data": "riskCategory" },
            { "data": "permitStatus" },
            { "data": "applicationFor" },
            { "data": "activationDate" },
            { "data": "expiryDate" },
            /*{ "data": "certifiedPoolOperator" },*/

            {
                "data": "encryptedId", "render": function (data, type, row, meta) {
                    //console.log(row);
                    console.log(row.isActive);
                    if (row.isActive == true) {
                        if (row.code == "RF")
                        {
                            return `<div class="m-75 btn-group"  role="group">      
                                          <a class="btn btn-sm btn-custom"  href="/RFEdit?id=${data}"><i class="fa fa-edit" aria-hidden="true" style="cursor:pointer" title="Edit"></i></a>
                                    </div>`
                        }
                        if (row.code == "MF") {
                            return `<div class="m-75 btn-group"  role="group">      
                                          <a class="btn btn-sm btn-custom"  href="/MFEdit?id=${data}"><i class="fa fa-edit" aria-hidden="true" style="cursor:pointer" title="Edit"></i></a>
                                    </div>`
                        }
                    }
                    else {
                        return `<div class="m-75 btn-group"  role="group">      
                                          <a class="btn btn-sm btn-custom"  onclick=ActiveInactive('/ChangeUserState?id=${data}')><i class="fa-solid fa-check" id="icon"  style="cursor:pointer" title="Active"></i> </a>
                                    </div>`
                    }
                }

            }

        ],
        columnDefs: [
            {
                targets: [3],
                render: function (data, type, row) {
                    if (data == null) {
                        return "NA"
                    }
                    return data;
                }
            },
            {
                targets: [4],
                render: function (data, type, row) {
                    if (data == null) {
                        return "NA"
                    }
                    return data;
                }
            },
            {
                targets: [5],
                      render: function (data, type, row) {
                            if (data == "Incomplete" || data == "Pending Admin Review" || data == "Admin Review" || data == "Pending Plan Review" || data == "Plan Review" || data == "Pending Build-Out" || data == "Pending Payment" || data == "Opening Inspection") {
                                  return `<p class="badge bg-light">${data}</p>`
                            }
                            else if (data == "Active") {
                                  return `<p class="badge bg-success">${data}</p>`
                            }
                            else if (data == "Renewal") {
                                  return `<p class="badge bg-warning">${data}</p>`
                            }
                            else if (data == "Expired") {
                                  return `<p class="badge bg-danger">${data}</p>`
                            }
                            else if (data == "Expired") {
                                  return `<p class="badge bg-danger">${data}</p>`
                            }
                            else {
                                  return `<p class="badge bg-secondary">${data}</p>`
                            }
                    //else if (data == "Complaint") {
                    //    return `<p class="badge bg-danger">Complaint</p>`
                    //}
                }
            },
            {
                targets: [6],
                render: function (data, type, row) {
                    if (data == "NewPermit") {
                        return `<p class="badge bg-success">New Permit</p>`
                    }
                    else if (data == "OwnerChange") {
                        return `<p class="badge bg-warning">Owner Change</p>`
                    }
                    else if (data == "Complaint") {
                        return `<p class="badge bg-danger">Complaint</p>`
                    }
                }
            },
            {
                targets: [7],
                render: function (data, type, row) {
                    if (data == null) {
                        return "--"
                    }
                    else {
                        var actDate = data.split("T");
                        actDate = moment(insDate[0], "YYYY-MM-DD").format("MM/DD/YYYY");
                        return actDate;
                    }
                    
                }
            },
            {
                targets: [8],
                render: function (data, type, row) {
                    if (data == null) {
                        return "--"
                    }
                    else {
                        var expDate = data.split("T");
                        expDate = moment(expDate[0], "YYYY-MM-DD").format("MM/DD/YYYY");
                        return expDate;
                    }
                }
            },
        ],
        "language": {
            "emptyTable": "No Records found"
        },
        "width": "100%",
        "createdRow": function (row, data, dataIndex) {
            if ($(data)[0].isActive == false) {
                $(row).css('color', 'red');
            }
        }
    });
}

function loadRetailDataTable() {
    //var formData = new FormData();
    //formData.append('Name', $('#estName').val());
    //formData.append('Permit', $('#permitNo').val());
    //formData.append('ApplicationNo', $('#applicationNo').val());
    //formData.append('Area', $('#areaNo').val());
    //formData.append('Risk', $('#riskidx').val());
    //formData.append('PermitStatus', $('#pStat').val());
    //formData.append('Purpose', $('#purposeidx').val());
    //formData.append('EstablishmentId', $('#areaNo').val());

    dataTableRetail = $('#retailPermitIdx').DataTable({
        
        "responsive": true,
        "lengthChange": false,
        "autoWidth": false,
        "searching" : false,
        "deferRender": true,
        "ajax": {
            "url": "/GetAllRetailPermits",
            //"data": formData
            "type": "POST", 
            "data": function (d) {
                var formData = new FormData();
                formData.append('Name', $('#estName').val());
                formData.append('Permit', $('#permitNo').val());
                formData.append('ApplicationNo', $('#applicationNo').val());
                formData.append('Area', $('#areaNo').val());
                formData.append('Risk', $('#riskidx').val());
                formData.append('PermitStatus', $('#pStat').val());
                formData.append('Purpose', $('#purposeidx').val());
                formData.append('FromDate', $('#lowerdaternge').val());
                formData.append('ToDate', $('#upperdaternge').val());

                var plainObject = {};
                formData.forEach(function (value, key) {
                    plainObject[key] = value;
                });
                return plainObject;
            }
        },
        "columns": [
            {
                data: 'id',
                render: function (data, type, row, meta) {
                    //console.log(meta.row);
                    //console.log(meta.settings._iDisplayStart);
                    return meta.row + /*meta.settings._iDisplayStart +*/ 1;
                }, "width": "2%"
            },
            { "data": "applicationNumber", "width": "10%" },
            { "data": "applicationDate", "width": "8%" },
            { "data": "permitNumber", "width": "10%" },
            { "data": "name", "width": "20%" },
            { "data": "area", "width": "8%" },
            { "data": "riskCategory", "width": "8%" },
            { "data": "permitStatus", "width": "8%" },
            { "data": "applicationFor", "width": "8%" },
            { "data": "activationDate", "width": "8%" },
            { "data": "expiryDate", "width": "8%" },
            /*{ "data": "certifiedPoolOperator" },*/
            {
                "data": "encryptedId", "render": function (data, type, row, meta) {
                    //console.log(row);
                    //console.log(row.isActive);
                    if (row.isActive == true) {
                        if (row.code == "RF") {
                            return `<div class="m-75 btn-group"  role="group">      
                                          <a class="btn btn-sm btn-custom"  href="/RFEdit?id=${data}"><i class="fa fa-edit" aria-hidden="true" style="cursor:pointer" title="Edit"></i></a>
                                    </div>`
                        }
                        if (row.code == "MF") {
                            return `<div class="m-75 btn-group"  role="group">      
                                          <a class="btn btn-sm btn-custom"  href="/MFEdit?id=${data}"><i class="fa fa-edit" aria-hidden="true" style="cursor:pointer" title="Edit"></i></a>
                                    </div>`
                        }
                    }
                    else {
                        return `<div class="m-75 btn-group"  role="group">      
                                          <a class="btn btn-sm btn-custom"  onclick=ActiveInactive('/ChangeUserState?id=${data}')><i class="fa-solid fa-check" id="icon"  style="cursor:pointer" title="Active"></i> </a>
                                    </div>`
                    }
                }
            }
        ],
        columnDefs: [
            {
                targets: [2],
                render: function (data, type, row) {
                    if (data == null) {
                        return "--"
                    }
                    else {
                        var appDate = data.split("T");
                        appDate = moment(appDate[0], "YYYY-MM-DD").format("MM/DD/YYYY");
                        return appDate;
                    }
                }
            },
            {
                targets: [3],
                render: function (data, type, row) {
                    if (data == null) {
                        return "--"
                    }
                    return data;
                }
            },
            {
                targets: [5],
                render: function (data, type, row) {
                    if (data == 0) {
                        return "Unassigned"
                    }
                    return data;
                }
            },
            {
                targets: [6],
                render: function (data, type, row) {
                    if (data == null) {
                        return "NA"
                    }
                    return data;
                }
            },
            {
                targets: [7],
                render: function (data, type, row) {
                    if (data == "Incomplete" || data == "Pending Admin Review" || data == "Admin Review" || data == "Pending Plan Review" || data == "Plan Review" || data == "Pending Build-Out" || data == "Pending Payment" || data == "Opening Inspection") {
                        return `<p class="badge bg-light">${data}</p>`
                    }
                    else if (data == "Active") {
                        return `<p class="badge bg-success">${data}</p>`
                    }
                    else if (data == "Renewal") {
                        return `<p class="badge bg-warning">${data}</p>`
                    }
                    else if (data == "Expired") {
                        return `<p class="badge bg-danger">${data}</p>`
                    }
                    else if (data == "Expired") {
                        return `<p class="badge bg-danger">${data}</p>`
                    }
                    else {
                        return `<p class="badge bg-secondary">${data}</p>`
                    }
                    //else if (data == "Complaint") {
                    //    return `<p class="badge bg-danger">Complaint</p>`
                    //}
                }
            },
            {
                targets: [8],
                render: function (data, type, row) {
                    if (data == "NewPermit") {
                        return `<p class="badge bg-success">New Permit</p>`
                    }
                    else if (data == "OwnerChange") {
                        return `<p class="badge bg-warning">Owner Change</p>`
                    }
                    else if (data == "Complaint") {
                        return `<p class="badge bg-danger">Complaint</p>`
                    }
                }
            },
            {
                targets: [9],
                render: function (data, type, row) {
                    if (data == null) {
                        return "--"
                    }
                    else {
                        var actDate = data.split("T");
                        actDate = moment(actDate[0], "YYYY-MM-DD").format("MM/DD/YYYY");
                        return actDate;
                    }
                }
            },
            {
                targets: [10],
                render: function (data, type, row) {
                    if (data == null) {
                        return "--"
                    }
                    else {
                        var expDate = data.split("T");
                        expDate = moment(expDate[0], "YYYY-MM-DD").format("MM/DD/YYYY");
                        return expDate;
                    }
                }
            },
        ],
        "language": {
            "emptyTable": "No records found"
        },
        "width": "100%",
        "createdRow": function (row, data, dataIndex) {
            if ($(data)[0].isActive == false) {
                $(row).css('color', 'red');
            }
        }
    });

    //$('#txtFromDate, #txtToDate').on('change', function () {
    //    $('#tblFoodInspectionList').DataTable().draw();
    //});

      //$('#retailPermitIdx thead tr:eq(0) th').each(function (i) {
      //      $('input', this).on('keyup change clear', function () {
      //            //console.log(this.value);
      //            //console.log(i);
      //            if (dataTableRetail.column(i).search() !== this.value) {
      //                  dataTableRetail
      //                        .column(i)
      //                        .search(this.value)
      //                        .draw();
      //            }
      //      });
      //});

      //$('#retailPermitIdx thead tr:eq(0) th').each(function (i) {
      //      const input = $('input', this);
      //      if (input.attr('type') === 'date') {
      //            input.on('change', function () {
      //                  const searchVal = this.value;
      //                  const formattedVal = searchVal ? moment(searchVal, "YYYY-MM-DD").format("MM/DD/YYYY") : '';
      //                  dataTableRetail
      //                        .column(i)
      //                        .search(formattedVal)
      //                        .draw();
      //            });
      //      } else {
      //            input.on('keyup change clear', function () {
      //                  if (dataTableRetail.column(i).search() !== this.value) {
      //                        dataTableRetail
      //                              .column(i)
      //                              .search(this.value)
      //                              .draw();
      //                  }
      //            });
      //      }
      //});

}

function loadMobileDataTable() {

    dataTableMobile = $('#mobilePermitIdx').DataTable({
        "responsive": true,
        "lengthChange": false,
        "autoWidth": false,
        "searching" : false,
        "deferRender": true,
        "ajax": {
            "url": "/GetAllMobilePermits",
            "type": "POST",
            "data": function (d) {
                var formData = new FormData();
                formData.append('Name', $('#estName').val());
                formData.append('Permit', $('#permitNo').val());
                formData.append('ApplicationNo', $('#applicationNo').val());
                formData.append('Area', $('#areaNo').val());
                formData.append('Risk', $('#riskidx').val());
                formData.append('PermitStatus', $('#pStat').val());
                formData.append('Purpose', $('#purposeidx').val());
                formData.append('FromDate', $('#lowerdaternge').val());
                formData.append('ToDate', $('#upperdaternge').val());

                var plainObject = {};
                formData.forEach(function (value, key) {
                    plainObject[key] = value;
                });
                return plainObject;
            }
        },
        "columns": [
            {
                data: 'id',
                render: function (data, type, row, meta) {
                    //console.log(row);
                    return meta.row + /*meta.settings._iDisplayStart +*/ 1;
                }, "width": "2%"
            },
            { "data": "applicationNumber", "width": "10%" },
            { "data": "applicationDate", "width": "8%" },
            { "data": "permitNumber", "width": "10%" },
            { "data": "name", "width": "20%" },
            { "data": "area", "width": "8%" },
            { "data": "riskCategory", "width": "8%" },
            { "data": "permitStatus", "width": "8%" },
            { "data": "applicationFor", "width": "8%" },
            { "data": "activationDate", "width": "8%" },
            { "data": "expiryDate", "width": "8%" },
            /*{ "data": "certifiedPoolOperator" },*/
            {
                "data": "encryptedId", "render": function (data, type, row, meta) {
                    //console.log(row);
                    //console.log(row.isActive);
                    if (row.isActive == true) {
                        if (row.code == "RF") {
                            return `<div class="m-75 btn-group"  role="group">      
                                          <a class="btn btn-sm btn-custom"  href="/RFEdit?id=${data}"><i class="fa fa-edit" aria-hidden="true" style="cursor:pointer" title="Edit"></i></a>
                                    </div>`
                        }
                        if (row.code == "MF") {
                            return `<div class="m-75 btn-group"  role="group">      
                                          <a class="btn btn-sm btn-custom"  href="/MFEdit?id=${data}"><i class="fa fa-edit" aria-hidden="true" style="cursor:pointer" title="Edit"></i></a>
                                    </div>`
                        }
                    }
                    else {
                        return `<div class="m-75 btn-group"  role="group">      
                                          <a class="btn btn-sm btn-custom"  onclick=ActiveInactive('/ChangeUserState?id=${data}')><i class="fa-solid fa-check" id="icon"  style="cursor:pointer" title="Active"></i> </a>
                                    </div>`
                    }
                }
            }
        ],
        columnDefs: [
            {
                targets: [2],
                render: function (data, type, row) {
                    if (data == null) {
                        return "--"
                    }
                    else {
                        var appDate = data.split("T");
                        appDate = moment(appDate[0], "YYYY-MM-DD").format("MM/DD/YYYY");
                        return appDate;
                    }
                }
            },
            {
                targets: [3],
                render: function (data, type, row) {
                    if (data == null) {
                        return "--"
                    }
                    return data;
                }
            },
            {
                targets: [5],
                render: function (data, type, row) {
                    if (data == null) {
                        return "NA"
                    }
                    return data;
                }
            },
            {
                targets: [6],
                render: function (data, type, row) {
                    if (data == null) {
                        return "NA"
                    }
                    return data;
                }
            },
            {
                targets: [7],
                render: function (data, type, row) {
                    if (data == "Incomplete" || data == "Pending Admin Review" || data == "Admin Review" || data == "Pending Plan Review" || data == "Plan Review" || data == "Pending Build-Out" || data == "Pending Payment" || data == "Opening Inspection") {
                        return `<p class="badge bg-light">${data}</p>`
                    }
                    else if (data == "Active") {
                        return `<p class="badge bg-success">${data}</p>`
                    }
                    else if (data == "Renewal") {
                        return `<p class="badge bg-warning">${data}</p>`
                    }
                    else if (data == "Expired") {
                        return `<p class="badge bg-danger">${data}</p>`
                    }
                    else if (data == "Expired") {
                        return `<p class="badge bg-danger">${data}</p>`
                    }
                    else {
                        return `<p class="badge bg-secondary">${data}</p>`
                    }
                    //else if (data == "Complaint") {
                    //    return `<p class="badge bg-danger">Complaint</p>`
                    //}
                }
            },
            {
                targets: [8],
                render: function (data, type, row) {
                    if (data == "NewPermit") {
                        return `<p class="badge bg-success">New Permit</p>`
                    }
                    else if (data == "OwnerChange") {
                        return `<p class="badge bg-warning">Owner Change</p>`
                    }
                    else if (data == "Complaint") {
                        return `<p class="badge bg-danger">Complaint</p>`
                    }
                }
            },
            {
                targets: [9],
                render: function (data, type, row) {
                    if (data == null) {
                        return "--"
                    }
                    else {
                        var actDate = data.split("T");
                        actDate = moment(actDate[0], "YYYY-MM-DD").format("MM/DD/YYYY");
                        return actDate;
                    }
                }
            },
            {
                targets: [10],
                render: function (data, type, row) {
                    if (data == null) {
                        return "--"
                    }
                    else {
                        var expDate = data.split("T");
                        expDate = moment(expDate[0], "YYYY-MM-DD").format("MM/DD/YYYY");
                        return expDate;
                    }
                }
            },
        ],
        "language": {
            "emptyTable": "No records found"
        },
        "width": "100%",
        "createdRow": function (row, data, dataIndex) {
            if ($(data)[0].isActive == false) {
                $(row).css('color', 'red');
            }
        }
    });

      $('#mobilePermitIdx thead tr:eq(0) th').each(function (i) {
            $('input', this).on('keyup change clear', function () {
                  if (dataTableMobile.column(i).search() !== this.value) {
                        dataTableMobile
                              .column(i)
                              .search(this.value)
                              .draw();
                  }
            });
      });
}

function loadTempDataTable() {

    dataTableTemp = $('#tempPermitIdx').DataTable({
        "responsive": true,
        "lengthChange": false,
        "autoWidth": false,
        "deferRender": true,
        "ajax": {
              "url": "/GetAllTempPermits"
        },
        "columns": [
              {
                    data: 'id',
                    render: function (data, type, row, meta) {
                          //console.log(row);
                          return meta.row + /*meta.settings._iDisplayStart +*/ 1;
                    }
              },
              { "data": "applicationNumber" },
              { "data": "applicationDate" },
              { "data": "permitNumber" },
              { "data": "events" },
              { "data": "location" },
              { "data": "name" },
              { "data": "permitStatus" },
              { "data": "applicationFor" },
              { "data": "activationDate" },
              { "data": "expiryDate" },
              /*{ "data": "certifiedPoolOperator" },*/
              {
                    "data": "encryptedId", "render": function (data, type, row, meta) {
                          //console.log(row);
                          //console.log(row.isActive);
                          if (row.isActive == true) {
                                if (row.code == "RF") {
                                      return `<div class="m-75 btn-group"  role="group">      
                                          <a class="btn btn-sm btn-custom"  href="/RFEdit?id=${data}"><i class="fa fa-edit" aria-hidden="true" style="cursor:pointer" title="Edit"></i></a>
                                    </div>`
                                }
                                if (row.code == "MF") {
                                      return `<div class="m-75 btn-group"  role="group">      
                                          <a class="btn btn-sm btn-custom"  href="/MFEdit?id=${data}"><i class="fa fa-edit" aria-hidden="true" style="cursor:pointer" title="Edit"></i></a>
                                    </div>`
                                }
                                if (row.code == "TF") {
                                      return `<div class="m-75 btn-group"  role="group">      
                                          <a class="btn btn-sm btn-custom"  href="/TFEdit?id=${data}"><i class="fa fa-edit" aria-hidden="true" style="cursor:pointer" title="Edit"></i></a>
                                    </div>`
                                }
                          }
                          else {
                                return `<div class="m-75 btn-group"  role="group">      
                                          <a class="btn btn-sm btn-custom"  onclick=ActiveInactive('/ChangeUserState?id=${data}')><i class="fa-solid fa-check" id="icon"  style="cursor:pointer" title="Active"></i> </a>
                                    </div>`
                          }
                    }
              }
        ],
        columnDefs: [
              {
                    targets: [3],
                    render: function (data, type, row) {
                          if (data == null) {
                                return "--"
                          }
                          return data;
                    }
              },
            //{
            //    targets: [3],
            //    render: function (data, type, row) {
            //        if (data == null) {
            //            return "NA"
            //        }
            //        return data;
            //    }
            //},
            //{
            //    targets: [4],
            //    render: function (data, type, row) {
            //        if (data == null) {
            //            return "NA"
            //        }
            //        return data;
            //    }
            //},
            {
                targets: [7],
                render: function (data, type, row) {
                    if (data == "Incomplete" || data == "Pending Admin Review" || data == "Admin Review" || data == "Pending Plan Review" || data == "Plan Review" || data == "Pending Build-Out" || data == "Pending Payment" || data == "Opening Inspection") {
                        return `<p class="badge bg-light">${data}</p>`
                    }
                    else if (data == "Active") {
                        return `<p class="badge bg-success">${data}</p>`
                    }
                    else if (data == "Renewal") {
                        return `<p class="badge bg-warning">${data}</p>`
                    }
                    else if (data == "Expired") {
                        return `<p class="badge bg-danger">${data}</p>`
                    }
                    else if (data == "Expired") {
                        return `<p class="badge bg-danger">${data}</p>`
                    }
                    else {
                        return `<p class="badge bg-secondary">${data}</p>`
                    }
                    //else if (data == "Complaint") {
                    //    return `<p class="badge bg-danger">Complaint</p>`
                    //}
                }
            },
            {
                targets: [8],
                render: function (data, type, row) {
                    if (data == "NewPermit") {
                        return `<p class="badge bg-success">New Permit</p>`
                    }
                    else if (data == "OwnerChange") {
                        return `<p class="badge bg-warning">Owner Change</p>`
                    }
                    else if (data == "Complaint") {
                        return `<p class="badge bg-danger">Complaint</p>`
                    }
                }
            },
            {
                targets: [9],
                render: function (data, type, row) {
                    if (data == null) {
                        return "--"
                    }
                    else {
                        var actDate = data.split("T");
                        actDate = moment(actDate[0], "YYYY-MM-DD").format("MM/DD/YYYY");
                        return actDate;
                    }
                }
            },
            {
                targets: [10],
                render: function (data, type, row) {
                    if (data == null) {
                        return "--"
                    }
                    else {
                        var expDate = data.split("T");
                        expDate = moment(expDate[0], "YYYY-MM-DD").format("MM/DD/YYYY");
                        return expDate;
                    }
                }
            },
        ],
        "language": {
            "emptyTable": "No records found"
        },
        "width": "100%",
        "createdRow": function (row, data, dataIndex) {
            if ($(data)[0].isActive == false) {
                $(row).css('color', 'red');
            }
        }
    });
}

//function ActiveInactive(url) {
//    $('audio#warning')[0].play();
//    setTimeout(() => {
//        Swal.fire({
//            title: 'Are you sure?',
//            icon: 'warning',
//            showCancelButton: true,
//            confirmButtonColor: '#8B9BB2',
//            cancelButtonColor: '#d33',
//            confirmButtonText: 'Yes, Proceed!'
//        }).then((result) => {
//            if (result.isConfirmed) {
//                $.ajax({
//                    type: "POST",
//                    url: url,
//                    success: function (data) {
//                        if (data.success) {
//                            $('audio#success_sound')[0].play();
//                            setTimeout(() => {
//                                toastr.success(data.msg);
//                            }, 500)

//                            //toastr.success(data.message);
//                            dataTable.ajax.reload();
//                        }
//                    }
//                });

//            }
//        })
//    }, 100)

//}



//function UpsertModal(url) {
//    $('#userUpsertForm').trigger('reset');
//    $.ajax({
//        type: "GET",
//        url: url,
//        beforeSend: function () {
//            $('div#loading-wrapper').show();
//        },
//        success: function (data) {
//            if (data.success) {
//                $('#userId').val(data.user.id);
//                $('#firstName').val(data.user.firstName);
//                $('#lastName').val(data.user.lastName);
//                $('#bhcd').val(data.user.bhcd);
//                $('#emailId').val(data.user.emailId);
//                $('#rSanitarian').val(data.user.registeredSanitarian);
//                $('#sanitarianTrain').val(data.user.sanitarianInTrain);
//                $('#designRepresentative').val(data.user.designatedRepresentative);
//                $('#poolOperator').val(data.user.certifiedPoolOperator);
//                $('#roleId').val(data.user.roleId);
//            }
//        },
//        error: function (data) {
//            console.log(data);
//        },
//        complete: function () {
//            $('div#loading-wrapper').hide();
//            $('#userUpsert').modal('show');
//        }
//    });
//}

