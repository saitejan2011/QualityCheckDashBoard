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
import { Column, ColDef, _, IsColumnFunc, GridOptionsWrapper, GridOptions } from 'ag-grid-community';
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
import { QualityCheckFormType } from '../../Models/QualityCheckFormType';
import { IColumnSchema } from '../../Models/IColumnSchema';
import { ServerResponse } from 'http';
import { IServerResponse } from '../../Models/IServerResponse';
import { IDelete } from '../../Models/IDelete';
import { setTimeout } from 'timers';
import { List } from 'lodash';





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
                    onCellDOMUpdate: this.onCellDOMUpdate.bind(this),
                    floatingFilter: false,
                    filterParams: {
                        comparator: function (filterLocalDateAtMidnight:any, cellValue:any) {
                            var dateAsString = cellValue;
                            var dateParts = dateAsString.split('/');
                            var cellDate = new Date(
                                Number(dateParts[2]),
                                Number(dateParts[1]) - 1,
                                Number(dateParts[0])
                            );
                            if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                                return 0;
                            }
                            if (cellDate < filterLocalDateAtMidnight) {
                                return -1;
                            }
                            if (cellDate > filterLocalDateAtMidnight) {
                                return 1;
                            }
                        },
                    },
                },
                columnDefs: [],
                rowData: null,
                editType: 'fullRow',
                enableSorting: true,
                pagination: true,
                paginationPageSize: 30,
                animateRows: true,
                rowSelection: "multiple",
                onGridReady: this.onGridReady.bind(this),
                onCellValueChanged: this.onCellValueChanged.bind(this),
                overlayLoadingTemplate:
                    '<span class="ag-overlay-loading-center">Please wait while your data is loading</span>',
                overlayNoRowsTemplate:
                    '<span style="padding: 10px;background: rgb(251 206 7 / 0.6);font-weight: bold;">No Data to display</span>',
                rowClassRules: {
                    'row-even': function (params: any) {
                        return params.node.rowIndex % 2 == 0;
                    },
                    'row-odd': function (params: any) {
                        return params.node.rowIndex % 2 != 0;
                    },
                },
                getRowStyle: function (params: any) {
                    if (params.node.rowIndex % 2 === 0) {
                        return { background: 'red' };
                    }
                }
            },
            data: {
                dbList: [],
                qualityCheckList: []
            },
            qualityCheckList: [],
            qualityCheckList_MasterCpy: [],
            qualityCheckList_PatchTable: {} as IPatchTable,
            identity: {
                Name: null
            },
            isComponentLoaded: false,
        }
    }
    scrambleAndRefreshAll = () => {
        let params = {
            force: true
        };
    this.state.gridOptions.api.refreshCells(params);
    
    }

    async componentDidMount() {
        this.state.gridOptions.api.showLoadingOverlay();
        let tables = await this.getTables();
        await this.setTables(tables).then((tableProp: any) => {
            this.onGridUpdate(tableProp.name, tableProp.type);
        }, () => {
                
        });
    }

    onLoadingEnable = () => {
        if (Math.floor(Math.random() * (3 - 1) + 1) == 1) {
            this.state.gridOptions.api.showLoadingOverlay();
        } else {
            this.state.gridOptions.api.hideOverlay();
        }
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
                            <select className=" form-control col-md-6" placeholder="Select Table" onChange={this.onTableChange} id="tablesDrpDown">
                                {
                                    this.state && this.state.qualityCheckList && this.state.qualityCheckList.length > 0 && this.state.qualityCheckList.map((tableItem: ITable, index: number) => {
                                        return (<option value={tableItem.name} data-type={tableItem.type} data-id={index + 1}> {tableItem.name}</option>);
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
                        {/*<div className="d-inline-block col-md-2">

                            <button className="btn btn-primary btn-action col" data-toggle="modal" data-target="#fullHeightModalRight"><FontAwesomeIcon icon={faPlus} /> New</button>
                        </div>*/}
                        <div className="d-inline-block col-md-2 btn-container">
                            <button className="btn shell-btn btn-action col" onClick={this.onNewItem} >
                                <FontAwesomeIcon icon={faPlus} /> New Item</button>
                        </div>
                        <div className="d-inline-block col-md-2 btn-container">
                            <button className="btn shell-btn btn-action col" onClick={this.onDelete}><FontAwesomeIcon icon={faArchive} /> Delete</button>
                        </div>
                    </div>
                    <div className="col-md-6 px-0 ext-right btn-container">
                        {Object.keys(this.state.qualityCheckList_PatchTable).length === 0 || this.state.qualityCheckList_PatchTable.List.length <= 0 ? ""
                            : <div className="d-inline-block col-md-2">
                                <button className="btn shell-btn btn-action col" onClick={this.onSubmit}>({this.state.qualityCheckList_PatchTable.List.length}) <FontAwesomeIcon icon={faSave} /> Save </button>
                            </div>
                        }
                    </div>
                </div>

                <div className="ag-theme-alpine gridLayoutInnerContainer">
                    <AgGridReact
                        columnDefs={this.state.gridOptions.columnDefs}
                        rowData={this.state.gridOptions.rowData}
                        gridOptions={this.state.gridOptions}
                        stopEditingWhenGridLosesFocus={true}
                    >
                    </AgGridReact>
                </div>
                <FormModal  ></FormModal>
            </div>
        );
    }

    onCellHigh = (params: any) => {

        return (params.value === 'something' ? 'my-class-3' : 'my-class-3');
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

            if (tables && tables.length <= 0) {
                reject("Set Table Error");
            }
            tables.forEach((item: any, index: number) => {

                tableArr.push({
                    name: this.util.capitalizeFLetter(item.name),
                    type: item.type,
                    isLoaded: false,
                    isActive: index == 0,
                    serverResponse: {} as IServerResponse
                });
            });
            await this.setState({ qualityCheckList: tableArr }, () => {
                this.setState({ qualityCheckList_MasterCpy: tableArr }, () => {
                    resolve(tableArr[0]);

                });
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



    inActiveQualityCheckList = (varQualityCheckList: ITable[]): ITable[] => {
        varQualityCheckList.map((qc_Item: ITable) => {
            qc_Item.isActive = false;
            return qc_Item;
        });
        return varQualityCheckList;
    }

    getQualityCheckListTable = (tblName: string, varQualityCheckList: ITable[]): ITable => {
        return varQualityCheckList.filter((s: any) => s.name == tblName).find(x => x !== undefined) || {} as ITable;
    }

    setQualityCheckListData = (varQualityCheckItem: ITable, varQualityCheckList: ITable[]) => {

        this.setState({
            gridOptions: {
                ...this.state.gridOptions,
                rowData: varQualityCheckItem.serverResponse.data,
                columnDefs: this.getAgGridColData(varQualityCheckItem.serverResponse.schemas)
            },
            qualityCheckList: varQualityCheckList
        }, () => {
                this.state.gridOptions.api.hideOverlay();
                this.scrambleAndRefreshAll();
                if (varQualityCheckItem.serverResponse.data.length <= 0) {
                    this.state.gridOptions.api.showNoRowsOverlay();
                }
        });
    }

    setQualityCheckListMasterData = (varQualityCheckItem: ITable, varQualityCheckList: ITable[]) => {
        this.setState({
            gridOptions: {
                ...this.state.gridOptions,
                rowData: varQualityCheckItem.serverResponse.data,
                columnDefs: this.getAgGridColData(varQualityCheckItem.serverResponse.schemas)
            },
            qualityCheckList_MasterCpy: varQualityCheckList
        });
    }

    setMasterQualityCheckList = (tblName: string, tblData: IServerResponse) => {
        //let clnQCList_MasterCpy: ITable[] = this.state.qualityCheckList_MasterCpy;
        //clnQCList_MasterCpy = this.inActiveQualityCheckList(clnQCList_MasterCpy);
        //let clnQCItem_MasterCpy: ITable = this.getQualityCheckListTable(tblName, clnQCList_MasterCpy);
        //clnQCItem_MasterCpy.isActive = true;
        //clnQCItem_MasterCpy.isLoaded = true;
        //clnQCItem_MasterCpy.serverResponse = { data: tblData.data, schemas: tblData.schemas };
        //   this.setQualityCheckListMasterData(clnQCItem_MasterCpy, clnQCList_MasterCpy);
    }



    onGridUpdate = (tblName: string, tblType: string) => {
        //let clnQCObj: IState =  this.state;
        this.state.gridOptions.api.showLoadingOverlay();
        let varQualityCheckList: ITable[] = JSON.parse(JSON.stringify(this.state.qualityCheckList));

        let varQualityCheckMasterList: ITable[] = JSON.parse(JSON.stringify(this.state.qualityCheckList_MasterCpy));

        varQualityCheckList = this.inActiveQualityCheckList(varQualityCheckList);
        varQualityCheckMasterList = this.inActiveQualityCheckList(varQualityCheckMasterList);

        let varQualityCheckItem: ITable = this.getQualityCheckListTable(tblName, varQualityCheckList);
        let varQualityCheckMasterItem: ITable = this.getQualityCheckListTable(tblName, varQualityCheckMasterList);

        varQualityCheckItem.isActive = true;
        
        varQualityCheckMasterItem.isActive = true;




        if (varQualityCheckItem && !(varQualityCheckItem.isLoaded)) {
            
            varQualityCheckItem.isLoaded = true;
            varQualityCheckMasterItem.isLoaded = true;

            this.getTableData(tblName, tblType).then((tblData: any) => {

                varQualityCheckItem.serverResponse = { data: JSON.parse(JSON.stringify(tblData.data)), schemas: JSON.parse(JSON.stringify(tblData.schemas)) };
                varQualityCheckMasterItem.serverResponse = { data: JSON.parse(JSON.stringify(tblData.data)), schemas: JSON.parse(JSON.stringify(tblData.schemas)) };

                //this.setMasterQualityCheckList(tblName, Object.assign({}, tblData));
                this.setState({ qualityCheckList_MasterCpy: varQualityCheckMasterList })

                this.setQualityCheckListData(varQualityCheckItem, varQualityCheckList);

            }).catch((error: any) => {
                console.log(error);
                this.state.gridOptions.api.hideOverlay();
            });
        }
        else {

            this.setQualityCheckListData(varQualityCheckItem, varQualityCheckList);
            this.setState({ qualityCheckList_MasterCpy: varQualityCheckMasterList });
        }
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
        debugger
        schemas.forEach((key: IColumnSchema) => {
            colArr.push({
                headerName: util.capitalizeFLetter(key.columnName.trim()),
                field: key.columnName,
                hide: key.isIdentity == true
                //filter: key.dataType.toLowerCase().indexOf("date") >= 0 ? 'agDateColumnFilter' : true

            });
        });
        return colArr;
    }

    isColumnModified = (value: any, focusedColSchema: IColumnSchema, identityColumn: IColumnSchema, activeQCTable: ITable): boolean => {

        let currentCol = activeQCTable.serverResponse.data.filter(s => (s[identityColumn.columnName] == value[identityColumn.columnName]))[0];
        if (currentCol) {
            if (currentCol[focusedColSchema.columnName] == value[focusedColSchema.columnName])
                return false;
            else
                return true
        }
        return false;
    }

    onCellStyleUpdate = (params: any) => {
        
        let focusedCell = this.state.gridOptions.api.getFocusedCell();
        let activeQCMasterTable: ITable = this.getActiveTable(this.state.qualityCheckList_MasterCpy);
        debugger
        let identityColumn: IColumnSchema = this.getIdentityColumn(activeQCMasterTable.serverResponse.schemas);
        let focusedColumn: IColumnSchema = activeQCMasterTable.serverResponse.schemas.filter(s => s.columnName == params.column.colId)[0];
        if (focusedColumn && identityColumn && params.value != undefined) {
            let isValid: boolean = this.validateColumn(params.value, focusedColumn);
            let isColumnModified: boolean = this.isColumnModified(params.data, focusedColumn, identityColumn, activeQCMasterTable);
            let bgColor: string;
            if (!isValid) {
                //bgColor = '#f5c6cb';
                bgColor = '';
            }
            else if (params && params.column && (params.data[identityColumn.columnName].toString().toLowerCase().indexOf("tempid") >= 0)) {
                bgColor = '#cce5ff';
            }
            else if (isColumnModified) {
                bgColor = 'rgba(23,162,184,0.2)';
            }
            else {
                bgColor = '';
            }
            return { backgroundColor: bgColor, border: '.0625rem solid #e8e8e8', borderTop: 'none' };
        }
        else {
            return { border: '.0625rem solid #e8e8e8', borderTop: 'none' };
        }
    }
    //validateDataTypeColumn
    //validateDataTypeColumn = (value: string, focusedColumnSchema: IColumnSchema): boolean => {
    //    if (focusedColumnSchema) {
    //        if (focusedColumnSchema.dataType.toString().indexOf("char") >= 0) {
    //            return value.length < focusedColumnSchema.maximumLength;
    //        }
    //        else
    //            return true;
    //    }
    //    else {
    //        return false;
    //    }
    //}

    validateColumn = (value: string, focusedColSchema: IColumnSchema): boolean => {
        if (focusedColSchema.isIdentity)
            return true;
        else if (focusedColSchema.dataType && focusedColSchema.dataType.length <= 0)
            return false;
        else if (focusedColSchema.isNullAble && value.toString().trim().length <= 0)
            return false
        else if (focusedColSchema.dataType.toString().toLocaleLowerCase().indexOf("char")) {
            return this.validateDataType("char", value, focusedColSchema);
        }

        if (focusedColSchema.dataType.toString().toLocaleLowerCase().indexOf("date")) {
            return this.validateDataType("date", value, focusedColSchema);
        }

        if (focusedColSchema.dataType.toString().toLocaleLowerCase().indexOf("time")) {
            return this.validateDataType("time", value, focusedColSchema);
        }
        else {
            return this.validateDataType("number", value, focusedColSchema);
        }



    }

    getDateRegEx() {
        //return new RegExp("(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})");
    }

    validateDataType = (dataType: string, value: string, focusedColSchema: IColumnSchema): boolean => {


        let isValid = true;

        switch (dataType) {
            case "char":
                return value.length <= focusedColSchema.maximumLength || focusedColSchema.maximumLength == 0;
            case "date":
                return true;
            case "time":
                return true;
            case "number":
            case "int":
            case "smallint":
            case "bigint":
            case "float":
            case "decimal":
                if (parseInt(value) > -(2147483648) && parseInt(value) < (2147483648)) {
                    return true;
                } else {
                    return false;
                }
            default:
                return false;
        }

    }







    onCellDOMUpdate = (params: any) => {

        return params.value;
    }

    onTableChange = (eve: any) => {

        let tblName: string = eve.target.value;
        let tblType: string = eve.target.options[eve.target.options.selectedIndex].getAttribute('data-type');
        let test: any = document.getElementById("tablesDrpDown");
        let tt = this.getActiveTable(this.state.qualityCheckList);
        if (this.state.qualityCheckList_PatchTable && this.state.qualityCheckList_PatchTable.List && this.state.qualityCheckList_PatchTable.List.length > 0) {
            if (window.confirm("Do you want to discard the changes ?")) {
                this.setState({ qualityCheckList_PatchTable: {} as IPatchTable, qualityCheckList: JSON.parse(JSON.stringify(this.state.qualityCheckList_MasterCpy)) }, () => {
                    this.onGridUpdate(tblName, tblType);
                });
            }
            else {
                test.value = tt.name;
            }
        }
        else {
            this.onGridUpdate(tblName, tblType);
        }



    }

    getActiveTable = (qualityCheckList: ITable[]): ITable => {
        return qualityCheckList.filter((qc_Item: any) => qc_Item.isActive == true).find(x => x !== undefined) || {} as ITable;
    }

    getIdentityColumn = (tblSchemaArr: IColumnSchema[]): IColumnSchema => {
        return tblSchemaArr.filter(s => s.isIdentity == true)[0];
    }

    getDataModel = (tblSchemaArr: IColumnSchema[]): any => {
        let dataObj = {};
        tblSchemaArr.forEach((schemaItem: IColumnSchema) => {
            Object.defineProperty(dataObj, schemaItem.columnName, {
                value: schemaItem.isIdentity ? "TempId" + Math.floor(Math.random() * (9999 - 1) + 1) : "",
                writable: true,
                enumerable: true,
                configurable: true
            });
        });
        return dataObj;
    }

    getTableSchemaModel = () => {

        ;

        //return dataArr;
    }

    onNewItem = () => {
        let clObj: IState = Object.assign({}, this.state);
        let varQualityCheckList: ITable[] = clObj.qualityCheckList;
        let activeQualityCheckTable: ITable = this.getActiveTable(varQualityCheckList);
        activeQualityCheckTable.isActive = true;
        let identityColumn = this.getIdentityColumn(activeQualityCheckTable.serverResponse.schemas);

        if (identityColumn) {
            let dataObj: any = this.getDataModel(activeQualityCheckTable.serverResponse.schemas);
            activeQualityCheckTable.serverResponse.data.unshift(dataObj);
            this.setState(prevState => ({
                ...prevState,
                gridOptions: {
                    ...prevState.gridOptions,
                    rowData: [],
                    columnDefs: []
                },
                qualityCheckList: clObj.qualityCheckList
            }), () => {
                this.onGridUpdate(activeQualityCheckTable.name, activeQualityCheckTable.type);
            });
        }
        else {
            alert("As There is not identity column present you cannot create an item");
        }
    }
    onDelete = () => {

        let qc_selectedRows = this.state.gridOptions.api.getSelectedRows();
        if (qc_selectedRows && qc_selectedRows.length > 0 && window.confirm("Are you sure to delete " + qc_selectedRows.length + " items")) {
            let QCTableList: ITable[] = JSON.parse(JSON.stringify(this.state.qualityCheckList));
            let QCTableMasterList: ITable[] = JSON.parse(JSON.stringify(this.state.qualityCheckList_MasterCpy));
            let QCTablePatchItem: IPatchTable = JSON.parse(JSON.stringify(this.state.qualityCheckList_PatchTable));
            let activeQCTable: ITable = this.getActiveTable(QCTableList);
            let activeQCMasterTable: ITable = this.getActiveTable(QCTableMasterList);
            let identityColumn: IColumnSchema = this.getIdentityColumn(activeQCTable.serverResponse.schemas);

            if (identityColumn && Object.keys(identityColumn).length > 0) {
                let identityColumnName: string = identityColumn.columnName;
                let clnStateObj: IState = this.state;

                let clnQualityCheckList: ITable[] = clnStateObj.qualityCheckList;

                let clnActiveQCTable: ITable = this.getActiveTable(clnQualityCheckList);

                let columnSchema: IColumnSchema = this.getIdentityColumn(clnActiveQCTable.serverResponse.schemas);

                if (columnSchema) {
                    let delObj: IDelete = {
                        TableName: clnActiveQCTable.name,
                        Type: clnActiveQCTable.type,
                        Data: qc_selectedRows.filter((s: any) => s[columnSchema.columnName].toString().toLowerCase().indexOf("tempid") < 0)
                    }
                    debugger

                    let tablesURL = Constants.hostURL + "/" + Constants.controller.dynamicData + "/" + Constants.actions.deleteItemFromDB;
                    if (delObj.Data && delObj.Data.length > 0) {
                        this.util.deleteDataFromDB(tablesURL, delObj).then(res => {
                            debugger
                            activeQCTable = this.onQualityCheckItemDelete(qc_selectedRows, activeQCTable, identityColumnName);
                            activeQCMasterTable = this.onQualityCheckItemDelete(qc_selectedRows, activeQCMasterTable, identityColumnName);
                        }).catch(error => {
                            debugger
                            alert("error in deleting");

                        }).finally(() => {
                            debugger
                            this.onDeleteListUpdate(activeQCTable, activeQCMasterTable, QCTablePatchItem, columnSchema, qc_selectedRows, identityColumnName);
                            this.setDeleteOpsState(QCTableList, QCTableMasterList, QCTablePatchItem, activeQCTable).then(res => {
                                this.onGridUpdate(activeQCTable.name, activeQCTable.type);
                                alert("Successfully deleted");
                            });
                        })
                    }
                    else {
                        this.onDeleteListUpdate(activeQCTable, activeQCMasterTable, QCTablePatchItem, columnSchema, qc_selectedRows, identityColumnName);
                        this.setDeleteOpsState(QCTableList, QCTableMasterList, QCTablePatchItem, activeQCTable).then(res => {
                            debugger
                            this.onGridUpdate(activeQCTable.name, activeQCTable.type);
                            alert("Successfully deleted");
                        });
                    }
                }
            }
            else {
                alert("There is no identity column. Cannot process the delete operation for this table");
            }
        }
    }

    onFilterLocalItems = (qc_selectedRows: any[], columnSchema: IColumnSchema, activeQCTable: ITable, identityColumnName: string) => {
        debugger
        let tempSelectedIdList = qc_selectedRows.filter((s: any) => s[columnSchema.columnName].toString().toLowerCase().indexOf("tempid") >= 0);
        tempSelectedIdList.forEach((qc_row: any) => {
            activeQCTable.serverResponse.data = activeQCTable.serverResponse.data.filter((qc_selectedRow: any) => { return qc_selectedRow[identityColumnName] != qc_row[identityColumnName]; });
        });
    }

    setDeleteOpsState = (QCTableList: ITable[], QCTableMasterList: ITable[], QCTablePatchItem: IPatchTable, activeQCTable: ITable) => {
        debugger
        return new Promise<any>((resolve: (items: any) => void, reject: (error: any) => void): void => {
            this.setState({ qualityCheckList: QCTableList, qualityCheckList_MasterCpy: QCTableMasterList, qualityCheckList_PatchTable: QCTablePatchItem }, () => {
                resolve(this.state);
            });
        });
    }

    onQualityCheckItemDelete = (qc_selectedRows: any[], activeQCTable: ITable, identityColumnName: string) => {
        qc_selectedRows.forEach((qc_row: any) => {
            activeQCTable.serverResponse.data = activeQCTable.serverResponse.data.filter((qc_selectedRow: any) => { return qc_selectedRow[identityColumnName] != qc_row[identityColumnName]; });
        });
        return activeQCTable;
    }

    onDeleteListUpdate = (activeQCTable: ITable, activeQCMasterTable: ITable, QCTablePatchItem: IPatchTable, columnSchema: IColumnSchema, qc_selectedRows: any[], identityColumnName: string) => {

        if (QCTablePatchItem && Object.keys(QCTablePatchItem).length > 0) {
            QCTablePatchItem = this.onQualityCheckPatchItemDelete(qc_selectedRows, QCTablePatchItem, identityColumnName);
            debugger
            if (QCTablePatchItem.List && QCTablePatchItem.List.length <= 0) {
                QCTablePatchItem = {} as IPatchTable;
            }
        }
        this.onFilterLocalItems(qc_selectedRows, columnSchema, activeQCTable, identityColumnName);
    }

    onQualityCheckPatchItemDelete = (qc_selectedRows: any[], QCTablePatchItem: IPatchTable, identityColumnName: string) => {

        let arr: number[] = [];
        QCTablePatchItem.List.forEach((qcp_row: any, index: number, object: any) => {
            let qpc_rowCount: any[] = qc_selectedRows.filter((row: any) => qcp_row.Data[identityColumnName] == row[identityColumnName]);
            if (qpc_rowCount.length > 0) {
                arr.push(index);
            }
        });
        let i = arr && arr.length;
        while (i--) {
            QCTablePatchItem.List.splice(arr[i - 1], 1);
        }
        debugger
        return QCTablePatchItem;
    }

    onSubmit = () => {


        this.state.gridOptions.api.stopEditing();
        let ss = this.state.gridOptions.api.getSelectedRows();
        //if (ss.length > 0)
        //    this.onUpdatePatchItem({ data: ss[0] });

        debugger
        let tablesURL = Constants.hostURL + "/" + Constants.controller.dynamicData + "/" + Constants.actions.patchItems;
        this.util.patchDataToDB(tablesURL, this.state.qualityCheckList_PatchTable).then(res => {
            
            let identityColumnName: string = res.response.transExchange.identityColumnName;
            let isResponseSuccessfull: boolean = res.response.transExchange.list.length > 0;
            res.response.transExchange.list.forEach((s: any) => {
                if (!s.isResponseSuccessfull) {
                    isResponseSuccessfull = false;
                }
            });

            let varMaster: ITable[] = JSON.parse(JSON.stringify(this.state.qualityCheckList_MasterCpy));
            if (isResponseSuccessfull) {
                varMaster.filter(qc_item => qc_item.name == res.response.transExchange.tableName).forEach((d: any, index: number) => {
                    res.response.transExchange.list.forEach((item: any) => {
                        if (d.serverResponse.data.filter((s: any) => s[identityColumnName] == item.data[identityColumnName]).length > 0) {
                            for (let i = 0; i < d.serverResponse.data.length; i++) {
                                if (d.serverResponse.data[i][identityColumnName] == item.data[identityColumnName]) {
                                    let newData;
                                    newData = Object.assign({}, item.data);
                                    d.serverResponse.data[i] = newData;
                                }
                            }
                            debugger
                        }
                        else {
                            d.serverResponse.data.unshift(item.data);
                        }
                    })
                    return d;
                });
                debugger
                let activeTable = this.getActiveTable(this.state.qualityCheckList_MasterCpy);
                this.setState({ qualityCheckList_PatchTable: {} as IPatchTable, qualityCheckList_MasterCpy: JSON.parse(JSON.stringify(varMaster)) }, () => {
                    this.setState({ qualityCheckList: JSON.parse(JSON.stringify(this.state.qualityCheckList_MasterCpy)) }, () => {
                        debugger
                        this.onGridUpdate(activeTable.name, activeTable.type);
                    });
                });
                alert("Successfully updated");
            } else {
                alert(res.response.message);
                console.log(res.response.message);
            }



        }).catch(error => {
            debugger
            alert(error);
        });

    }


    getRowStyle(params: any) {
        if (params.node.rowIndex % 2 === 0) {
            return 'my-shaded-effect';
        }
    }




    onUpdatePatchItem = (eve: any) => {


        let clnStateObj: IState = { ...this.state };

        let clnQualityCheckList: ITable[] = clnStateObj.qualityCheckList;

        let clnActiveQCTable: ITable = this.getActiveTable(clnQualityCheckList);

        let clnQC_PatchTable: IPatchTable = clnStateObj.qualityCheckList_PatchTable;

        let columnSchema: IColumnSchema = this.getIdentityColumn(clnActiveQCTable.serverResponse.schemas);

        if (columnSchema) {
            //clnActiveQCTable = clnActiveQCTable.serverResponse.data.filter(s => s[columnSchema.columnName] == eve.data[columnSchema.columnName]).map(d => { d = eve.data; return d; })[0]
            clnQC_PatchTable.TableName = clnActiveQCTable.name;
            clnQC_PatchTable.IdentityColumnName = columnSchema.columnName;
            clnQC_PatchTable.Type = clnActiveQCTable.type;
            clnQC_PatchTable.List = clnQC_PatchTable.List || [];

            let clnQC_PatchTable_ListItem = clnQC_PatchTable.List.filter(item => {
                return item.Data[columnSchema.columnName] == eve.data[columnSchema.columnName]
            })[0];

            let varFormType: QualityCheckFormType = eve.data[columnSchema.columnName].toString().toLowerCase().indexOf("tempid") >= 0 ? QualityCheckFormType.New : QualityCheckFormType.Edit;

            if (clnQC_PatchTable_ListItem) {

                clnQC_PatchTable_ListItem.Data = eve.data;

                clnQC_PatchTable_ListItem.FormType = varFormType;
            }
            else {
                clnQC_PatchTable.List.push({
                    Data: eve.data,
                    FormType: varFormType,
                    IsValid: false
                });
            }


            this.setState(prevState => ({
                ...prevState,
                qualityCheckList_PatchTable: { ...clnQC_PatchTable }
                //qualityCheckList: clnQualityCheckList
            }), () => {

            });

        }
        else {
            alert("Identity Column Missing, Cannot Process further");
        }
    }

    onCellValueChanged = (eve: any) => {

        this.onUpdatePatchItem(eve);
    }



    onGridReady(eve: any) {
        console.log('Sai Teja' + eve);
        this.state.gridOptions.api = eve.api;
        this.state.gridOptions.columnApi = eve.columnApi;
        eve.api.sizeColumnsToFit();
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


