import { QualityCheckFormType } from "./Enums";



export interface IPatchTable {
    TableName?: string;
    IdentityColumnName?: string;
    IdentityColumnValue?: number;
    FormType?: QualityCheckFormType;
    Data?: any[]
    
}   