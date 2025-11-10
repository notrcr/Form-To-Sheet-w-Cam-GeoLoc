//  BACKUP DATA SET (code.gs)
 
 function backupDataDaily() {
  // Get the active spreadsheet
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const formSheet = ss.getSheetByName("DataLokasi"); 
  
  // Create backup sheet name with date
  const date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd");
  const backupName = "DataLokasi_" + date;

  // Check if backup already exists
  if (ss.getSheetByName(backupName)) {
    Logger.log("Backup already exists for today.");
    return;
  }
  
  const backupSheet = ss.insertSheet(backupName);
 
  formSheet.getDataRange().copyTo(backupSheet.getRange(1, 1));
  for (let i = 1; i <= formSheet.getLastColumn(); i++) {
  backupSheet.setColumnWidth(i, formSheet.getColumnWidth(i));
}

for (let i = 1; i <= formSheet.getLastRow(); i++) {
  backupSheet.setRowHeight(i, formSheet.getRowHeight(i));
}
   
  Logger.log("Backup created and form reset successfully.");
}

// BACKUP DATABASE HASIL FORM + RESET FORM TIAP HARI (+ Trigger)
function resetFormResponsesDaily() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const formSheet = ss.getSheetByName("Web_Form_Lokasi"); 
   
  const date = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyyMMdd");
  const backupName = "Hasil Form Lokasi_" + date;

  // Check Backup
  if (ss.getSheetByName(backupName)) {
    Logger.log("Backup already exists for today.");
    return;
  }
 
  const backupSheet = ss.insertSheet(backupName);

  // Copy all data (values + format(still bad))
  formSheet.getDataRange().copyTo(backupSheet.getRange(1, 1));

  const lastRow = formSheet.getLastRow();
  if (lastRow > 1) {
    const numRows = lastRow - 1;
    formSheet.deleteRows(2, numRows);
  }

  Logger.log("Backup created and form reset successfully.");
}

// BUAT GANTI TANGGAL SHEET
    function updateDateInCell() {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DataLokasi");   
      var cell = sheet.getRange("C1");  
      cell.setValue(new Date());
    }
  
