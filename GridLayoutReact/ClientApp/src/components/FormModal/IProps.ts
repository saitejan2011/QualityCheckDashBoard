export interface IProps {
    id: string;
    gridOptions: number;
    amount: number;
    paymentMessage: string;
}

export interface gridOptions {
    api: any;
    columnApi: any;
    columnDefs: any[];
    rowData: any[];
    enableSorting: boolean;
    onGridReady: () => void;
}