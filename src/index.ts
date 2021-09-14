import { StrToStr } from './utils';
import { CachedSheet } from './cached_sheet';

declare var global: typeof globalThis;

export function init() {
  SpreadsheetApp.getUi().createMenu('Tiller Utilities')
    .addItem('Next Missing Category', 'nextMissingCategory')
    .addItem('Delete Matching Transactions', 'deleteMatchingTransactions')
    .addToUi();
}

export function transactionsSheet()
{
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transactions");
}


function getMissingTransactionPatterns(): StrToStr[]
{
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Delete Transactions Patterns");
  return (new CachedSheet(sheet, [])).toJsonObject();
}

export function deleteMatchingTransactions() {
  let transactionPatterns: StrToStr[] = getMissingTransactionPatterns();
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
  let descIndex = sheet.columnIndex("Description");
  for (let i = 0; i < allValues.length; ++i) {
    let v = allValues[i];
    if (v[catIndex].length == 0 && v[descIndex].length > 0) {
      return i;
    }
  }
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
    let range = sheet.original.getRange(rowIdx + 2, catIndex + 1, 1, 1);
    range.activate();
    range.getCell(1, 1).activate();
  }
}

(global as any).deleteMatchingTransactions = deleteMatchingTransactions;
(global as any).nextMissingCategory = nextMissingCategory;
