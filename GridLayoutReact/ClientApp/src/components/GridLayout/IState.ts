import { ITable } from "../../Models/ITable";
import { gridOptions } from "../FormModal/IProps";
import { IPatchTable } from "../../Models/IPatchTable";

export interface IState {
    gridOptions:any;
    data: any;
    qualityCheckList: ITable[];
    qualityCheckList_PatchTable: IPatchTable;
    qualityCheckList_MasterCpy: ITable[];
    
}

