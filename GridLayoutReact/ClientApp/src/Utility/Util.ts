import { IPatchTable } from './../Models/IPatchTable';
import axios from "axios";
import { IDelete } from '../Models/IDelete';

export  class Utilities {

    ///<capitalizeFLetter> Capitalize first letter in string
    public capitalizeFLetter(inputValue: string): string {
        return inputValue && inputValue[0].toUpperCase() + inputValue.slice(1);
    }

    ///<getDataFromDB> API- Get Data from DB
    public  getDataFromDB(url: string) {
        return new Promise<any>((resolve: (items: any) => void, reject: (error: any) => void): void => {
            let data;
             axios.get(url)
                .then(response => {
                    if (response && response.data && response.data.length === 0) {
                        resolve([]);
                    }
                    else {
                        resolve(response.data);
                    }
                    console.log(response);
                })
                 .catch(error => {
                     reject(error);
                    console.log(error);
                });
            return data;
        });
    }

    ///<patchDataToDB> API- Insert/Update data to DB
    public patchDataToDB(url: string,patchTable:IPatchTable) {
        return new Promise<any>((resolve: (items: any) => void, reject: (error: any) => void): void => {
            let data;
            axios.put(url,patchTable)
                .then(response => {
                    
                    if (response && response.data && Object.keys(response.data).length <= 0) {
                        resolve([]);
                    }
                    else {
                        resolve(response.data);
                    }
                    console.log(response);
                })
                .catch(error => {
                    reject(error);
                    console.log(error);
                });
            return data;
        });
    }

    ///<deleteDataFromDB> API- Delete data from DB
    public deleteDataFromDB(url: string, delObj: IDelete) {
        return new Promise<any>((resolve: (items: any) => void, reject: (error: any) => void): void => {
            let data;
            axios.put(url, delObj)
                .then(response => {
                    
                    if (response && response.data && Object.keys(response.data).length <= 0) {
                        resolve([]);
                    }
                    else {
                        resolve(response.data);
                    }
                    console.log(response);
                })
                .catch(error => {
                    reject(error);
                    console.log(error);
                });
            return data;
        });
    }

}