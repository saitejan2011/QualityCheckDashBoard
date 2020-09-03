import { QualityCheckFormType } from "./QualityCheckFormType";
import { IList } from "./IList";



export interface IPatchTable {
    TableName: string;
    List: IList[];
    Type: string;
    IdentityColumnName: string;
}   