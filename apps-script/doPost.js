function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);

  if (sheet.getLastRow() === 0) {
    var header = ['Nombre', 'Fecha', 'Progreso'];
    data.actividades.forEach(function(act) {
      header.push(act.actividad);
    });
    sheet.appendRow(header);
  }

  var row = [data.nombre, data.fecha, data.progreso];
  data.actividades.forEach(function(act) {
    row.push(act.completada);
  });

  sheet.appendRow(row);

  return ContentService
    .createTextOutput(JSON.stringify({ status: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
