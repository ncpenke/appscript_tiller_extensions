import { StrToStr } from './utils';
import { CachedSheet } from './cached_sheet';

export function init() {
  SpreadsheetApp.getUi().createMenu('Tiller Extensions')
    .addItem('Delete Matching Transactions', 'deleteMatchingTransactions')
    .addToUi();
}

export function deleteMatchingTransactions(transactionPatterns: StrToStr[]) {
  let sheet = new CachedSheet(SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transactions"), transactionPatterns);
  let allValues = [...sheet.cachedValues]; // create a copy of the cached values since we'll be modifying them
  allValues = allValues.filter(e => !sheet.rowMatchesPattern(e));
  sheet.replaceValues(allValues);
}
