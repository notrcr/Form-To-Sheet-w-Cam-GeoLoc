//  FORM TO SHEET 

var sheetName = 'Web_Form_Lokasi';  
//  ID Sheet Unik To Integrate 
var scriptProp = PropertiesService.getScriptProperties();
 
// Take The Key Sheet Aktif?
function setup() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', doc.getId());
  Logger.log('Setup complete. Stored spreadsheet ID: ' + doc.getId());
}
 
function doGet() {
  return ContentService.createTextOutput('✅ Web App is running.');
}
//  DO THE POST TO SHEET
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var docId = scriptProp.getProperty('key');
    if (!docId) throw new Error('Spreadsheet ID not found. Run setup() first.');

    var doc = SpreadsheetApp.openById(docId);
    var sheet = doc.getSheetByName(sheetName);
    if (!sheet) throw new Error('Sheet "' + sheetName + '" not found.');

    var data = e.parameter;
    Logger.log('Incoming data: ' + JSON.stringify(data));

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1;

    // === BUILD NEW ROW BASED ON HEADERS ===
    var newRow = headers.map(function(header) {
      var h = header.trim().toLowerCase();

      if (h === 'timestamp') return new Date();
      if (h === 'foto') return data.Foto || ''; // store raw Base64 string
      return data[header] || data[h] || '';
    });

    // write to sheet
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
    Logger.log('Data written to row ' + nextRow);
 
    return ContentService
      .createTextOutput(JSON.stringify({
        result: 'success',
        row: nextRow
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('Error: ' + err.stack);
    return ContentService
      .createTextOutput(JSON.stringify({
        result: 'error',
        error: err.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
