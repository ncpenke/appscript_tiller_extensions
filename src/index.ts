import { StrToStr } from './utils';
import { CachedSheet } from './cached_sheet';

declare var global: typeof globalThis;

export function init(missingTransactionPatterns: StrToStr[]) {
  (global as any).missingTransactionPatterns = missingTransactionPatterns;
  SpreadsheetApp.getUi().createMenu('Tiller Extensions')
    .addItem('Next Missing Category', 'nextMissingCategory')
    .addItem('Delete Matching Transactions', 'deleteMatchingTransactions')
    .addToUi();
}

export function transactionsSheet()
{
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transactions");
}

export function deleteMatchingTransactions() {
  let transactionPatterns: StrToStr[] = (global as any).missingTransactionPatterns;
  let sheet = new CachedSheet(transactionsSheet(), transactionPatterns);
  let allValues = [...sheet.cachedValues]; // create a copy of the cached values since we'll be modifying them
  allValues = allValues.filter(e => !sheet.rowMatchesPattern(e));
  if (allValues.length != sheet.cachedValues.length) {
    sheet.replaceValues(allValues);
    SpreadsheetApp.getUi().alert(`Deleted ${sheet.cachedValues.length - allValues.length} transactions`);
  }
}

function findNextMissingCategory(sheet: CachedSheet)
{
  let allValues = [...sheet.cachedValues]; // create a copy of the cached values since we'll be modifying them
  let catIndex = sheet.columnIndex("Category");
  let idx = 0;
  allValues.forEach(v => {
    if (allValues[catIndex].length == 0)
      return idx;
    idx++;
  })
  return -1;
}

export function nextMissingCategory() {
  let sheet = new CachedSheet(transactionsSheet(), []);
  let rowIdx = findNextMissingCategory(sheet);
  if (rowIdx < 0) {
    SpreadsheetApp.getUi().alert("No rows are missing categories");
  }
  else {
    let catIndex = sheet.columnIndex("Category");
    let range = sheet.original.getRange(rowIdx, catIndex, 1, 1);
    transactionsSheet().setActiveRange(range);
  }
}

(global as any).deleteMatchingTransactions = deleteMatchingTransactions;
(global as any).nextMissingCategory = nextMissingCategory;
(global as any).missingTransactionPatterns = [];
