import { IServerResponse } from "./IServerResponse";



export interface ITable {
    name: string;
    type: string;
    serverResponse: IServerResponse;    
    isActive?: boolean;
    isLoaded?: boolean;
}   