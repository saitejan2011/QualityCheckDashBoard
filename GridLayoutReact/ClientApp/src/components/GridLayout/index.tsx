import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
// import 'ag-grid-community/dist/styles/ag-theme-fresh.css';
import './styles.scss';
import { Constants } from '../../Utility/Constants'
import { IState } from './IState';
import axios from 'axios';
import { parse } from 'path';
import { ColumnAnimationService } from 'ag-grid-community/dist/lib/rendering/columnAnimationService';
import { Column, ColDef, _, IsColumnFunc } from 'ag-grid-community';

import '../../Utility/gbStyles.scss';
import 'lodash';
import FormModal from '../FormModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faPlus, faArchive, faSave } from '@fortawesome/free-solid-svg-icons'
import { Utilities } from './../../Utility/Util';
import { debug } from 'console';
import { ITable } from '../../Models/ITable';
import { IRowData } from '../../Models/RowData';
import { isNullOrUndefined } from 'util';
import { IPatchTable } from '../../Models/IPatchTable';
import { QualityCheckFormType } from '../../Models/Enums';
import { IColumnSchema } from '../../Models/IColumnSchema';
import { ServerResponse } from 'http';
import { IServerResponse } from '../../Models/IServerResponse';





const util = new Utilities();




export default class GridLayout extends React.PureComponent<any, IState> {
    public util = new Utilities();
    constructor(props: any) {
        super(props);
        this.state = {
            gridOptions: {
                api: {},
                columnApi: {},
                defaultColDef: {
                    flex: 1,
                    minWidth: 180,
                    resizable: true,
                    headerCheckboxSelection: this.isFirstColumn,
                    checkboxSelection: this.isFirstColumn,
                    sortable: true,
                    filter: true,
                    editable: true,
                    headerClass: "class-make",
                    //  newValueHandler: this.compareValues.bind(this),
                    cellClass: this.onCellHigh.bind(this),
                    cellStyle: this.onCellStyleUpdate.bind(this),
                    //cellRenderer: this.onCellDOMUpdate.bind(this),
                },
                columnDefs: [],
                rowData: null,
                enableSorting: true,
                pagination: true,
                paginationPageSize: 30,
                animateRows: true,
                rowSelection: "multiple",
                onGridReady: this.onGridReady.bind(this),
                onCellValueChanged: this.onCellValueChanged.bind(this),

                rowClassRules: {
                    'row-even': function (params: any) {
                        return params.node.rowIndex % 2 == 0;
                    },
                    'row-odd': function (params: any) {
                        return params.node.rowIndex % 2 != 0;
                    },
                },
            },
            data: {
                dbList: [],
                qualityCheckList: []
            },
            qualityCheckList: [],
            qualityCheckList_PatchItems: [],
            identity: {
                Name: null
            }
        }
    }

    onCellHigh = (params: any) => {

        return (params.value === 'something' ? 'my-class-3' : 'my-class-3');
    }

    prepareCollDefs() {
        let varColDef: ColDef = {
            headerName: "test"
        };
        var objects = [{ 'a': 1 }, { 'b': 2 }];

        var deep = _.cloneObject(this.state);
        //console.log(deep[0] === objects[0]);
    }

    getTables = async () => {
        let tablesURL = Constants.hostURL + "/" + Constants.controller.dynamicData + "/" + Constants.actions.getTables;
        return new Promise<any>((resolve: (items: any) => void, reject: (error: any) => void): void => {
            this.util.getDataFromDB(tablesURL).then(async (tables: any) => {
                if (tables && tables.length > 0)
                    resolve(tables);
                else
                    reject("Get Tables Error");
            });
        });
    }

    setTables = async (tables: any[]) => {
        let tableArr: ITable[] = [];
        return new Promise<any>(async (resolve: (items: any) => void, reject: (error: any) => void): Promise<void> => {
            debugger
            if (tables && tables.length <= 0) {
                reject("Set Table Error");
            }
            tables.forEach((item: any, index: number) => {

                tableArr.push({
                    name: item.name,
                    type: item.type,
                    isLoaded: false,
                    isActive: index == 0,
                    serverResponse: {} as IServerResponse
                });
            });
            await this.setState({ qualityCheckList: tableArr }, () => {
                resolve(tableArr[0]);
                debugger
            });
        });

    }



    getTableSchema = async (tblName: string, tableType: string) => {
        let tableSchemaURL = Constants.hostURL + "/" + Constants.controller.dynamicData + "/GetTableSchema?tableName=" + tblName + "&schemaType=" + tableType;
        return new Promise<any>((resolve: (items: any) => void, reject: (error: any) => void): void => {
            this.util.getDataFromDB(tableSchemaURL).then((tblSchemaList: any) => {
                if (tblSchemaList && tblSchemaList.length > 0)
                    resolve(tblSchemaList);
                else
                    reject("Get Table Schema Error");
            });
        });
    }

    getTableData = async (tblName: string, tableType: string) => {
        let tblDataUrl = "https://localhost:44372/api/DynamicData/GetTableData?tableName=" + tblName + "&schemaType=" + tableType;
        return new Promise<any>((resolve: (items: any) => void, reject: (error: any) => void): void => {
            this.util.getDataFromDB(tblDataUrl).then((tblData: any) => {
                if (tblData)
                    resolve(tblData);
                else
                    reject("Get Table Data Error");
            });
        });
    }

    updateGridData = async (qc_data_res: IServerResponse) => {
        //let varResDataArr: any[] = [];
        //return new Promise<any>((resolve: (items: any) => void, reject: (error: any) => void): void => {

        //if (data && data[0] && data[0].data.length <= 0) {
        //    clnObj.gridOptions.rowData = [];
        //    clnObj.gridOptions.columnDefs = [];
        //    reject("Update Grid Data Error");
        //}
        //let identity = data[0].data.filter((item: any) => { return item.isIdentity == true })[0];
        //debugger
        //if (!identity) {
        //    alert("There is no Identity Column");
        //}
        //qc_data_res.schemas.forEach((rowItem: any) => {
        //    varResDataArr.push({
        //        Identity: (idenityObj && idenityObj.value) ? idenityObj.value : null,
        //        data: rowItem.data
        //    });
        //});
        //clnObj.data.qualityCheckList = varResDataArr;
        //clnObj.data.dbList = data;
        //clnObj.identity.Name = (identity && identity.columnName);

        //let resCol = varResDataArr && varResDataArr[0].data.length > 0 && varResDataArr[0].data.map((colItem: any) => colItem.columnName);



        ////Ag-Grid Data Config -- Start
        //clnObj.gridOptions.rowData = this.setAgGridRowData(varResDataArr);
        ////Ag-Grid Row Data Config -- End

        ////Ag-Grid Col Data Config -- Start
        //clnObj.gridOptions.columnDefs = this.setAgGridColData(resCol, varResDataArr);
        ////Ag-Grid Col Data Config -- End



        //    qc_data_res.gridOptions.rowData = data.tblData;
        //    qc_data_res.gridOptions.columnDefs = colArr;
        //    resolve(clnObj);
        //});


    }

    setAgGridData = () => {



        //this.setState({
        //    general_DataCard: { ...this.state.general_DataCard, FSA: { ...this.state.general_DataCard.FSA, value: event.text, key: event.key } }
        //})
    }

    setData = (tblName: string, tblData: any) => {

        debugger

    }

    onGridUpdate = (tblName: string, tblType: string) => {

        let clnQCObj: IState = _.cloneObject(this.state);
        let varQualityCheckList: ITable[] = clnQCObj.qualityCheckList;
        varQualityCheckList.map(qc_Item => {
            qc_Item.isActive = false;
            return qc_Item;
        });
        let varQualityCheckItem: ITable = varQualityCheckList.filter((s: any) => s.name == tblName)[0];
        //let clnQCGridOptionsObj: IState = _.cloneObject(this.state);
        

        
        varQualityCheckItem.isActive = true;
        debugger
        if (varQualityCheckItem && !(varQualityCheckItem.isLoaded)) {
            varQualityCheckItem.isLoaded = true;
            this.getTableData(tblName, tblType).then((tblData: any) => {
                varQualityCheckItem.serverResponse = { data: tblData.data, schemas: tblData.schemas };
                clnQCObj.gridOptions.rowData = this.getAgGridColData(varQualityCheckItem.serverResponse.schemas);
                clnQCObj.gridOptions.columnDefs = varQualityCheckItem.serverResponse.data;

                this.setState(clnQCObj, () => {
                    console.log("Success");
                });
            }).catch((error: any) => {
                console.log(error);
            });
        }
        else {
            clnQCObj.gridOptions.rowData = this.getAgGridColData(varQualityCheckItem.serverResponse.schemas);
            clnQCObj.gridOptions.columnDefs = varQualityCheckItem.serverResponse.data;
            this.setState( clnQCObj , () => {
                console.log("Success");
            });
        }
    }


    async componentDidMount() {
        let tables = await this.getTables();
        debugger;
        await this.setTables(tables).then((tableProp: any) => {
            debugger;
            this.onGridUpdate(tableProp.name, tableProp.type);
        });
    }





    setTableSchema = (tblName: string, tblSchemaList: any[], clnQualityCheckObj: any) => {
        //let tblSchemaArr: ITableSchema[] = [];
        //return new Promise<any>((resolve: (items: any) => void, reject: (error: any) => void): void => {
        //    tblSchemaList.forEach((schemaItem: any) => {
        //        tblSchemaArr.push({
        //            columnName: schemaItem.columnName,
        //            dataType: schemaItem.dataType,
        //            isIdentity: schemaItem.isIdentity,
        //            isNullAble: schemaItem.isNull,
        //            maximumLength: schemaItem.maximumLength,
        //            tableName: schemaItem.tableName
        //        });
        //    });
        //    debugger;
        //    clnQualityCheckObj.qualityCheckList.filter((s: any) => s.Name == tblName).map((ff: any) => {
        //        ff.Schema = tblSchemaArr;
        //        ff.IsLoaded = true;
        //        return ff;
        //    });
        //    resolve(clnQualityCheckObj);
        //});

    }


    setAgGridRowData = (varResDataArr: any[]) => {
        let varRowDataArr: any[] = [];
        varResDataArr.forEach((cr_row: any) => {
            let obj = {};
            cr_row.data.forEach((cr_item: any) => {


                Object.defineProperty(obj, cr_item.columnName, {
                    value: cr_item.value,
                    writable: true,
                    enumerable: true,
                    configurable: true
                });
            });
            varRowDataArr.push(obj);
        });
        return varRowDataArr;
    }

    getAgGridColData = (schemas: IColumnSchema[]): any[] => {
        let colArr: ColDef[] = [];
        schemas.forEach((key: IColumnSchema) => {
            colArr.push({
                headerName: util.capitalizeFLetter(key.columnName.trim()),
                field: key.columnName,
                hide: key.isIdentity == true
            });
        });
        return colArr;
    }

    onCellStyleUpdate = (params: any) => {
        let ss = this.state.gridOptions.api.getFocusedCell();
        return params.data[this.state.identity.Name] == 2 && params.column.colId == "CountryName" ? { backgroundColor: 'rgb(115,194,251,0.2)' } : "";

    }

    onCellDOMUpdate = (params: any) => {
        debugger;
        return params.value;
    }

    onTableChange = (eve: any) => {
        let tblName: string = eve.target.value;
        let tblType: string = eve.target.options[eve.target.options.selectedIndex].getAttribute('data-type');
        this.onGridUpdate(tblName, tblType);

    }

    getActiveTable = (qualityCheckList: ITable[]): ITable => {
        return qualityCheckList.filter((qc_Item: any) => qc_Item.isActive == true).find(x => x !== undefined) || {} as ITable;
    }

    getIdentityColumn = (tblSchemaArr: IColumnSchema[]): IColumnSchema => {
        return tblSchemaArr.filter(s => s.isIdentity == true).find(x => x !== undefined) || {} as IColumnSchema;
    }

    getDataModel = (tblSchemaArr: IColumnSchema[]): any => {
        let dataObj = {};
        tblSchemaArr.forEach((schemaItem: IColumnSchema) => {
            Object.defineProperty(dataObj, schemaItem.columnName, {
                value: schemaItem.isIdentity ? "TempId" + Math.floor(Math.random() * (9999 - 1) + 1) : null
            });
        });
        return dataObj;
    }

    getTableSchemaModel = () => {
        
        debugger;

        //return dataArr;
    }

    onNewItem = () => {
        let varQualityCheckList: ITable[] = this.state.qualityCheckList
        let activeQualityCheckTable: ITable = this.getActiveTable(varQualityCheckList);
        let dataObj: any = this.getDataModel(activeQualityCheckTable.serverResponse.schemas);
        activeQualityCheckTable.serverResponse.data.unshift(dataObj);
        this.setState({ qualityCheckList: varQualityCheckList }, () => {
            this.onGridUpdate(activeQualityCheckTable.name, activeQualityCheckTable.type);
        })
    }

    onSubmit = () => {

    }


    public render() {
        return (
            <div className="gridLayoutContainer">
                <div className="row mb-1">
                    <div className="col-md-6 form-group">
                        <div className="input-group">
                            <div className="input-group-prepend">
                                <span className="input-group-text" >Tables</span>
                            </div>
                            <select className=" form-control col-md-6" placeholder="Select Table" onChange={this.onTableChange}>
                                {
                                    this.state.qualityCheckList.map((tableItem: ITable) => {
                                        return (<option value={tableItem.name} data-type={tableItem.type}> {tableItem.name}</option>);
                                    })}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6 form-group search-txtbox-container ext-right">
                        <div className="input-group col-md-6 px-0">
                            <input type="text" onInput={this.onQuickFilterChanged} className="form-control" placeholder="Search..." aria-label="Recipient's username" aria-describedby="basic-addon2" />
                            <div className="input-group-append d-block">
                                <span className="input-group-text" >Search</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mb-2">
                    <div className="col-md-6 px-0">
                        <div className="d-inline-block col-md-2">

                            <button className="btn btn-primary btn-action col" data-toggle="modal" data-target="#fullHeightModalRight"><FontAwesomeIcon icon={faPlus} /> New</button>
                        </div>
                        <div className="d-inline-block col-md-2">
                            <button className="btn btn-primary btn-action col" onClick={this.onNewItem} >
                                <FontAwesomeIcon icon={faPlus} /> New Item</button>
                        </div>
                        <div className="d-inline-block col-md-2">
                            <button className="btn btn-primary btn-action col"><FontAwesomeIcon icon={faArchive} /> Delete</button>
                        </div>
                    </div>
                    <div className="col-md-6 px-0 ext-right">
                        <div className="d-inline-block col-md-2">
                            <button className="btn btn-primary btn-action col"><FontAwesomeIcon icon={faSave} onClick={this.onSubmit} /> Save</button>
                        </div>
                    </div>
                </div>

                <div className="ag-theme-alpine gridLayoutInnerContainer">
                    <AgGridReact
                        columnDefs={this.state.gridOptions.columnDefs}
                        rowData={this.state.gridOptions.rowData}
                        gridOptions={this.state.gridOptions}
                    >
                    </AgGridReact>
                </div>
                <FormModal  ></FormModal>
            </div>
        );
    }

    getRowStyle(params: any) {
        if (params.node.rowIndex % 2 === 0) {
            return 'my-shaded-effect';
        }
    }




    onUpdateSaveItem = (eve: any) => {
        //let varQualityCheckTables = this.state.qualityCheckList;
        //let varIdenityName = this.state.identity.Name;
        //let saveItemObj: IPatchTable = {};
        //let varQualityCheckTable = varQualityCheckTables.filter((s: any) => s.IsActive == true)[0];
        //varQualityCheckTable && varQualityCheckTable.Data.forEach((item: any) => {
        //    let identityItem = item.data.filter((row: any) => row.isIdentity == true)[0];
        //    if (identityItem && (identityItem.value == eve.data[varIdenityName])) {
        //        item.data.filter((row: any) => row.columnName == eve.column.colId).map((rowItem: any) => { rowItem.value = eve.value; return rowItem; });
        //        saveItemObj = {
        //            TableName: varQualityCheckTable.Name,
        //            IdentityColumnName: varIdenityName,
        //            IdentityColumnValue: identityItem.value,
        //            Data: item.data,
        //            FormType: eve.data.Id.toString().toLowerCase().indexOf("tempid") >= 0 ? QualityCheckFormType.New : QualityCheckFormType.Edit
        //        };
        //    }
        //});
        //let varQualityCheckTables_PatchItems: any[] = this.state.qualityCheckList_PatchItems;
        //let currentQualityCheckTable = varQualityCheckTables_PatchItems.filter(row => (row.TableName == varQualityCheckTable.Name) && (row.TableName == saveItemObj.IdentityColumnValue));
        //if (currentQualityCheckTable && currentQualityCheckTable.length > 0) {
        //    currentQualityCheckTable.map((tblItem: any) => {
        //        tblItem = saveItemObj;
        //        return tblItem;
        //    });
        //}
        //else {
        //    varQualityCheckTables_PatchItems.push(saveItemObj);
        //}
        //this.setState({ qualityCheckList: varQualityCheckTables, qualityCheckList_PatchItems: varQualityCheckTables_PatchItems }, () => {
        //    debugger;
        //});
    }

    onCellValueChanged = (eve: any) => {
        this.onUpdateSaveItem(eve);
    }



    onGridReady(eve: any) {
        console.log('Sai Teja' + eve);
        this.state.gridOptions.api = eve.api;
        this.state.gridOptions.columnApi = eve.columnApi;
        //  this.state.gridOptions.api.selectAll();
        this.setState({ gridOptions: this.state.gridOptions });
    }


    onQuickFilterChanged = (eve: any) => {
        const { value } = eve.target;
        this.state.gridOptions.api.setQuickFilter(value);
    };

    isFirstColumn(params: any) {
        var displayedColumns = params.columnApi.getAllDisplayedColumns();
        var thisIsFirstColumn = displayedColumns[0] === params.column;
        return thisIsFirstColumn;
    }

    compareValues(params: any) {

        if (params.oldValue.toString() > params.newValue.toString()) {
            return { headerClass: "class-make" }
        }
        if (params.oldValue.toString() < params.newValue.toString()) {
            return { color: 'red', backgroundColor: 'black' };
        }
    }
};


