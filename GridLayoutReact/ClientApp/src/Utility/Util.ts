import axios from "axios";

export  class Utilities {


    public capitalizeFLetter(inputValue: string): string {
        return inputValue && inputValue[0].toUpperCase() + inputValue.slice(1);
    }


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

}