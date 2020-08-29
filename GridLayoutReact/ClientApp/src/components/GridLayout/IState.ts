import { ITable } from "../../Models/ITable";
import { gridOptions } from "../FormModal/IProps";

export interface IState {
    gridOptions:any;
    data: any;
    qualityCheckList: ITable[];
    qualityCheckList_PatchItems: ITable[];
    identity: any;

}

