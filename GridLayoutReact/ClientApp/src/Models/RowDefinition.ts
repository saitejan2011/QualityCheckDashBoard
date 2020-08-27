import { Utilities } from '../Utility/Util';


const util = new Utilities();


export class RowDefinition {

    headerName: string;
    field: string;
    
    constructor(key: string) {
        this.headerName =key;
        this.field = key ;
        // this.headerName = key ? util.capitalizeFLetter(key.trim()) : "Default_" + Math.floor(Math.random() * (100 - 1) + 1);
        // this.field = key ? key.trim().split(" ").join("").toLocaleLowerCase() : "";
    }
}