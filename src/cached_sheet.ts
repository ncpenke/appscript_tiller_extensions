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
            let matched = true;
            let has_at_least_one_column = false;
            for(let n in p) {
                let patternVal = p[n];
                let rowVal = row[this.columnIndex(n)];
                matched = matched && patternVal.length > 0 && rowVal.length > 0 && (patternVal == rowVal);
                has_at_least_one_column = true;
                if (!matched) {
                    break;
                }
            }
            if (matched && has_at_least_one_column) {
                return true;
            }
        }
        return false;
    }

    /**
     * @returns The sheet as a JSON object.
     */
    public toJsonObject()
    {
        let ret = [];
        for (const [key, value] of Object.entries(this.columnMap)) {
            this.cachedValues.forEach(row => {
                let obj = {};
                obj[key] = row[value];
                ret.push(obj);
            })
        }
        return ret;
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
