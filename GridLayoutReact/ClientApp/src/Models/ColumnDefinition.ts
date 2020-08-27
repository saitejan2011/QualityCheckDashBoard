import { Utilities } from './../Utility/Util';


const util = new Utilities();


export class ColumnDefinition {
    headerName: string;
    field: string;
    constructor(key: string) {
        this.headerName = key ? util.capitalizeFLetter(key.trim()) : "";
        this.field = key;
    }
}   