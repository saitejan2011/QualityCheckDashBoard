
export interface IState {
    gridOptions: gridOptions;
}

export interface gridOptions {
    api: any;
    columnApi: any;
    columnDefs: IColumnDefs[];
    rowData: any[];
    enableSorting: boolean;
    // onGridReady: () => void;
}

export interface IColumnDefs {
    headerName: string;
    field: string;
    sortable: boolean;
    filter: boolean;
    checkboxSelection: boolean;
    editable: boolean;
    headerClass: string;
    width: number
}
