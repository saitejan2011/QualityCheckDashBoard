import { IServerResponse } from "./IServerResponse";



export interface IAppResult {
    name: string;
    isActive?: boolean;
    isLoaded?: boolean;
    gridOptions: any[];
}   