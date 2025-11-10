//  GEOLOC CONVERT NEED GOOGLE API (code.gs)
 
 function convertGeoToLocation() {
  const sheetName = 'Web_Form_Lokasi';
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const lastRow = sheet.getLastRow();

  for (let row = 2; row <= lastRow; row++) {
    const addressCell = sheet.getRange(row, 9); // Column I = 9
    const address = addressCell.getValue();
    
    // Check Address Ada atau Ga
    if (address && address !== '') {
      continue;
    }
    
    const coord = sheet.getRange(row, 7).getValue(); // Column G = 7
    if (coord && typeof coord === 'string' && coord.includes(',')) {
      try {
        const [lat, lng] = coord.split(',').map(Number);
        const response = Maps.newGeocoder().reverseGeocode(lat, lng);
        const results = response.results;
        const addressResult = results && results.length > 0 ? results[0].formatted_address : 'Not found';
        addressCell.setValue(addressResult);
      } catch (e) {
        addressCell.setValue('Error');
      }
    }
  }
}