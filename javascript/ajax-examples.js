//jquery libraries needed

//------------------------------------- EXAMPLE 1 -------------------------------------//
var dataTable = $('#tablaNotificaciones');

function xhrGetNotificationsByClientId(clientId){
    $.ajax({
        url: "/xhr/getNotifications/" + clientId,
        type: 'GET',
        dataType: 'json',
        success: function (data){
            dataTable.DataTable().clear();

            if ($.isEmptyObject(data)){
                console.log ('No Notifications found on db for client with id: ' + clientId);
            }else{
                data.forEach(function(object){
                    dataTable.DataTable().row.add([object.id, formatDate(object.createDate), formatDate(object.endDate), object.title, object.description, object.file, object.filters, object.status, object.totalUsers]);
                });
            }
            dataTable.DataTable().draw();
        },
        error: function (xhr) {
            console.log ("ERROR");
            console.log (xhr.responseText);
        }
    });
}
//-------------------------------------------------------------------------------------//