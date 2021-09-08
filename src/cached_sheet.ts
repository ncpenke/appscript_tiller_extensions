import { StrToStr, StrToNumber } from './utils';

/**
 * Wrapper around a google spreadsheet for caching values and other functionality
 * such as facilitating access by column name
 */
export class CachedSheet
{
    columnMap: StrToNumber;
    original: GoogleAppsScript.Spreadsheet.Sheet;
    patterns: StrToStr[];
    cachedValues: any[];
 
    constructor(sheet: GoogleAppsScript.Spreadsheet.Sheet, patterns:StrToStr[])
    {
        this.original = sheet;
        this.initColumnMap();
        this.initPatterns(patterns);
        this.cachedValues = this.getValueRange().getValues();
    }
 
    public columnIndex(name: string) {
        return this.columnMap[name];
    }
 
    public getValueRange(): GoogleAppsScript.Spreadsheet.Range {
        return this.original.getRange(2, 1, this.original.getLastRow(), this.original.getLastColumn());
    }

    public replaceValues(values: any[]) {
        let replaceRange = this.original.getRange(2, 1, values.length, this.original.getLastColumn());
        replaceRange.setValues(values);
        let deleteStart = values.length + 2;
        this.original.deleteRows(deleteStart, this.original.getLastRow() - deleteStart + 1)
    }

    /**
     * Return true if the row matches one of the patterns
     */
    public rowMatchesPattern(row: any[]): boolean {
        for (let i = 0; i < this.patterns.length; i++) {
            let p = this.patterns[i];
            let first = true;
            let matched = true;
            for(let n in p) {
                matched = (first || matched) && (p[n] == row[this.columnIndex(n)]);
                first = false;
                if (!matched) {
                    break;
                }
            }
            if (matched && !first) {
                return true;
            }
        }
        return false;
    }
    
    private initPatterns(patterns: StrToStr[])
    {
        this.patterns = []
        patterns.forEach(original => {
        // omit empty patterns
        if (Object.keys(original).length > 0) {
            this.patterns.push(original);
        }
        });
    }
    
    private initColumnMap()
    {
        this.columnMap = {};
        let lastCol = this.original.getLastColumn();
        let headerRow = this.original.getRange(1, 1, 1, lastCol).getValues()[0];
        for (let i = 0; i < lastCol; i++) {
            this.columnMap[headerRow[i]] = i;
        }
    }
}
