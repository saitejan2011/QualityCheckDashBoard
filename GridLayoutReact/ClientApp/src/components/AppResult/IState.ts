import { IAppResult } from "../../Models/IAppResult";

export interface IState {
    appList: IAppResult[];
    isLoaderEnable: boolean;
}

