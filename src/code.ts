function init() {
  SpreadsheetApp.getUi().createMenu('Tiller Extensions')
    .addItem('Delete Matching Transactions', 'deleteMatchingTransactions')
    .addToUi();
}

function deleteMatchingTransactions(transactionPatterns: {string: string}[]) {
  let sheet = new CachedSheet(SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transactions"), transactionPatterns);
  let allValues = [...sheet.cachedValues]; // create a copy of the cached values since we'll be modifying them
  allValues = allValues.filter(e => !sheet.rowMatchesPattern(e));
  sheet.replaceValues(allValues);
}
