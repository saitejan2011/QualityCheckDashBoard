
import AppResult from '../AppResult';

const appResultObj = new AppResult({});

export var gridOptions: any = {
    api: {},
    columnApi: {},
    defaultColDef: {
        flex: 1,
        minWidth: 180,
        resizable: true,
        sortable: true,
        filter: true,
        editable: true,
        floatingFilter: false,
    },
    columnDefs: [{ headerName: 'make', field: 'make' }, { headerName: 'model', field: 'model' }, { headerName: 'price', field: 'price' }],
    rowData: [{ make: "Toyota", model: "Celica", price: 35000 },
    { make: "Ford", model: "Mondeo", price: 32000 },
    { make: "Porsche", model: "Boxter", price: 72000 }],
    enableSorting: true,
    pagination: true,
    paginationPageSize: 30,
    animateRows: true,
    onGridReady: appResultObj.onGridReady.bind(this),
    rowSelection: "multiple",
    overlayLoadingTemplate:
        '<span class="ag-overlay-loading-center">Please wait while your data is loading</span>',
    overlayNoRowsTemplate:
        '<span style="padding: 10px;background: rgb(251 206 7 / 0.6);font-weight: bold;">No data to display</span>'
};


