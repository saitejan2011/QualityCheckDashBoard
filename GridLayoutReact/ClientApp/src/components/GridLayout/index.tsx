import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './styles.scss';
import { Constants } from '../../Utility/Constants'
import { IState } from './IState';
import { Column, ColDef, _, IsColumnFunc, GridOptionsWrapper, GridOptions } from 'ag-grid-community';
import '../../Utility/gbStyles.scss';
import 'lodash';
import FormModal from '../FormModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee, faPlus, faArchive, faSave } from '@fortawesome/free-solid-svg-icons'
import { Utilities } from './../../Utility/Util';
import { ITable } from '../../Models/ITable';
import { IPatchTable } from '../../Models/IPatchTable';
import { QualityCheckFormType } from '../../Models/QualityCheckFormType';
import { IColumnSchema } from '../../Models/IColumnSchema';
import { IServerResponse } from '../../Models/IServerResponse';
import { IDelete } from '../../Models/IDelete';

const util = new Utilities();

export default class GridLayout extends React.PureComponent<any, IState> {
    public util = new Utilities();
     
    /// <constructor> Initializing State And Props
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
                    cellClass: this.onCellClassUpdate.bind(this),
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
                    '<span style="padding: 10px;background: rgb(251 206 7 / 0.6);font-weight: bold;">No data to display</span>',
                rowClassRules: {
                    'row-even': function (params: any) {
                        return params.node.rowIndex % 2 == 0;
                    },
                    'row-odd': function (params: any) {
                        return params.node.rowIndex % 2 != 0;
                    },
                }
            },
            qualityCheckList: [],
            qualityCheckList_MasterCpy: [],
            qualityCheckList_PatchTable: {} as IPatchTable
           
        }
    }

    /// <componentDidMount> Initial API calls when component is loaded (GetTables).
    async componentDidMount() {
        this.state.gridOptions.api.showLoadingOverlay();
        let tables = await this.getTables();
        await this.setTables(tables).then((tableProp: any) => {
            this.onGridUpdate(tableProp.name, tableProp.type);
        }, () => {
                
        });
    }

    /// <render> rendering DOM.
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
                    <div className="col-md-6 form-group search-txtbox-container ex-right">
                        <div className="input-group col-md-6 px-0">
                            <input type="text" onInput={this.onQuickFilterChanged} className="form-control" placeholder="Search..." aria-label="Recipient's username" aria-describedby="basic-addon2" />
                            <div className="input-group-append d-block">
                                <span className="input-group-text" >Search</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mb-2">
                    <div className="col-md-12 col-sm-12  col-xs-12  d-flex">
                        {/*<div className="d-inline-block col-md-2">
                            <button className="btn btn-primary btn-action col" data-toggle="modal" data-target="#fullHeightModalRight"><FontAwesomeIcon icon={faPlus} /> New</button>
                        </div>*/}
                        <div className="btn-container">
                            <button className="btn shell-btn btn-action col" onClick={this.onNewItem} >
                                <FontAwesomeIcon icon={faPlus} /> New </button>
                        </div>
                        <div className="ext-right ext-right-container">
                        {Object.keys(this.state.qualityCheckList_PatchTable).length === 0 || this.state.qualityCheckList_PatchTable.List.length <= 0 ? ""
                            : <div className="btn-container ">
                                <button className="btn shell-btn btn-action col" onClick={this.onSubmit}>({this.state.qualityCheckList_PatchTable.List.length}) <FontAwesomeIcon icon={faSave} /> Save </button>
                            </div>
                        }
                        <div className=" btn-container ">
                            <button className="btn shell-btn btn-action col" onClick={this.onDelete}><FontAwesomeIcon icon={faArchive} /> Delete</button>
                            </div>
                        </div>
                        
                    </div>
                    <div className="col-md-6 px-0 ext-right btn-container">
                       
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

    /// <scrambleAndRefreshAll> make active and udpate the grid values in case grid is not functioning properly.
    private scrambleAndRefreshAll = () => {
        let params = {
            force: true
        };
        this.state.gridOptions.api.refreshCells(params);
    }

    /// <onCellHigh>  triggers when cell is updates, here we can add style classes dynamically.
    private onCellClassUpdate = (params: any) => {
        return (params.value === 'something' ? 'my-class-3' : 'my-class-3');
    }

    /// <getTables>  API call gets all tables from DB.
    private getTables = async () => {
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

    /// <setTables>  on Tables receive updates tables to the state.
    private setTables = async (tables: any[]) => {
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

    ///<getTableData> get Table Data along with its schema.
    private getTableData = async (tblName: string, tableType: string) => {
        
        let tblDataUrl = Constants.hostURL + "/" + Constants.controller.dynamicData + "/" + Constants.actions.getTableData+"?tableName=" + tblName + "&schemaType=" + tableType;
        return new Promise<any>((resolve: (items: any) => void, reject: (error: any) => void): void => {
            this.util.getDataFromDB(tblDataUrl).then((tblData: any) => {
                if (tblData)
                    resolve(tblData);
                else
                    reject("Get Table Data Error");
            });
        });
    }

    ///<inActiveQualityCheckList> Make all tables status to in active.
    private inActiveQualityCheckList = (varQualityCheckList: ITable[]): ITable[] => {
        varQualityCheckList.map((qc_Item: ITable) => {
            qc_Item.isActive = false;
            return qc_Item;
        });
        return varQualityCheckList;
    }

    ///<getQualityCheckListTable> returns active table from qualityCheckList.
    private getQualityCheckListTable = (tblName: string, varQualityCheckList: ITable[]): ITable => {
        return varQualityCheckList.filter((s: any) => s.name == tblName).find(x => x !== undefined) || {} as ITable;
    }

    ///<setQualityCheckListData> updates qualityCheckList data to the state.
    private setQualityCheckListData = (varQualityCheckItem: ITable, varQualityCheckList: ITable[]) => {
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

    ///<onGridUpdate> Updating grid data for both ag-grid & defines quality check list.
    private onGridUpdate = (tblName: string, tblType: string) => {
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
                this.state.gridOptions.api.hideOverlay();
            });
        }
        else {
            this.setQualityCheckListData(varQualityCheckItem, varQualityCheckList);
            this.setState({ qualityCheckList_MasterCpy: varQualityCheckMasterList });
        }
    }

    ///<getAgGridColData> Returns column dynamic column definition array.
    private getAgGridColData = (schemas: IColumnSchema[]): ColDef[] => {
        let colArr: ColDef[] = [];
        
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

    ///<isColumnModified> Validates whether cell is modified or not.
    private isColumnModified = (value: any, focusedColSchema: IColumnSchema, identityColumn: IColumnSchema, activeQCTable: ITable): boolean => {

        let currentCol = activeQCTable.serverResponse.data.filter(s => (s[identityColumn.columnName] == value[identityColumn.columnName]))[0];
        if (currentCol) {
            if (currentCol[focusedColSchema.columnName] == value[focusedColSchema.columnName])
                return false;
            else
                return true
        }
        return false;
    }

    ///<onCellStyleUpdate> Triggers when cell value is changed. We can update cell style dyamically.
    private onCellStyleUpdate = (params: any) => {
        
        let focusedCell = this.state.gridOptions.api.getFocusedCell();
        let activeQCMasterTable: ITable = this.getActiveTable(this.state.qualityCheckList_MasterCpy);
        
        let identityColumn: IColumnSchema = this.getIdentityColumn(activeQCMasterTable.serverResponse.schemas);
        let focusedColumn: IColumnSchema = activeQCMasterTable.serverResponse.schemas.filter(s => s.columnName == params.column.colId)[0];
        if (focusedColumn && identityColumn && params.value != undefined) {
            let isValid: boolean = this.validateColumn(params.value, focusedColumn);
            let isColumnModified: boolean = this.isColumnModified(params.data, focusedColumn, identityColumn, activeQCMasterTable);
            let bgColor: string;
            if (!isValid) {
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

    ///<validateColumn> Validates column based on data type and returns its valid status.
    private validateColumn = (value: string, focusedColSchema: IColumnSchema): boolean => {
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

    ///<validateDataType> Validates data type and returns its valid status.
    private validateDataType = (dataType: string, value: string, focusedColSchema: IColumnSchema): boolean => {


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

    ///<onCellDOMUpdate> Triggers when cell value is changed. Here we can update DOM of the cell value.
    private onCellDOMUpdate = (params: any) => {

        return params.value;
    }

    ///<onTableChange> Triggers when table value changes and calls the active tables to render.
    private onTableChange = (eve: any) => {

        let tblName: string = eve.target.value;
        let tblType: string = eve.target.options[eve.target.options.selectedIndex].getAttribute('data-type');
        let tblDrpDown: any = document.getElementById("tablesDrpDown");
        let activeTbl = this.getActiveTable(this.state.qualityCheckList);
        if (this.state.qualityCheckList_PatchTable && this.state.qualityCheckList_PatchTable.List && this.state.qualityCheckList_PatchTable.List.length > 0) {
            if (window.confirm("Do you want to discard the changes ?")) {
                this.setState({ qualityCheckList_PatchTable: {} as IPatchTable, qualityCheckList: JSON.parse(JSON.stringify(this.state.qualityCheckList_MasterCpy)) }, () => {
                    this.onGridUpdate(tblName, tblType);
                });
            }
            else {
                tblDrpDown.value = activeTbl.name;
            }
        }
        else {
            this.onGridUpdate(tblName, tblType);
        }



    }

    ///<getActiveTable> Returns the active table in the qualityCheckList state.
    private getActiveTable = (qualityCheckList: ITable[]): ITable => {
        return qualityCheckList.filter((qc_Item: any) => qc_Item.isActive == true).find(x => x !== undefined) || {} as ITable;
    }

    ///<getIdentityColumn> Returns schema of identity column from the table.
    private getIdentityColumn = (tblSchemaArr: IColumnSchema[]): IColumnSchema => {
        return tblSchemaArr.filter(s => s.isIdentity == true)[0];
    }

    ///<getRowDataModel>  Here the function returns ag-grid data model based.
    private getRowDataModel = (tblSchemaArr: IColumnSchema[]): any => {
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

    ///<onNewItem> Triggers when onNewItem Btn clicked and appends new item row to the table.
    private onNewItem = () => {
        let clObj: IState = Object.assign({}, this.state);
        let varQualityCheckList: ITable[] = clObj.qualityCheckList;
        let activeQualityCheckTable: ITable = this.getActiveTable(varQualityCheckList);
        activeQualityCheckTable.isActive = true;
        let identityColumn = this.getIdentityColumn(activeQualityCheckTable.serverResponse.schemas);

        if (identityColumn) {
            let dataObj: any = this.getRowDataModel(activeQualityCheckTable.serverResponse.schemas);
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

    ///<onDelete> Triggers when delete btn clicked and deletes selected rows from the table.
    private onDelete = () => {

        let qc_selectedRows = this.state.gridOptions.api.getSelectedRows();
        if (qc_selectedRows && qc_selectedRows.length > 0 && window.confirm("Are you sure want to delete selected item(s)")) {
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
                    

                    let tablesURL = Constants.hostURL + "/" + Constants.controller.dynamicData + "/" + Constants.actions.deleteItemFromDB;
                    if (delObj.Data && delObj.Data.length > 0) {
                        this.util.deleteDataFromDB(tablesURL, delObj).then(res => {
                            
                            activeQCTable = this.onQualityCheckItemDelete(qc_selectedRows, activeQCTable, identityColumnName);
                            activeQCMasterTable = this.onQualityCheckItemDelete(qc_selectedRows, activeQCMasterTable, identityColumnName);
                        }).catch(error => {
                            
                            alert("error in deleting");

                        }).finally(() => {
                            
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

    ///<onFilterLocalItems> delete unsaved new items from the grid.
    private onFilterLocalItems = (qc_selectedRows: any[], columnSchema: IColumnSchema, activeQCTable: ITable, identityColumnName: string) => {
        
        let tempSelectedIdList = qc_selectedRows.filter((s: any) => s[columnSchema.columnName].toString().toLowerCase().indexOf("tempid") >= 0);
        tempSelectedIdList.forEach((qc_row: any) => {
            activeQCTable.serverResponse.data = activeQCTable.serverResponse.data.filter((qc_selectedRow: any) => { return qc_selectedRow[identityColumnName] != qc_row[identityColumnName]; });
        });
    }

    ///<setDeleteOpsState> updates state of deleted items from all qualityCheck related list .
    private setDeleteOpsState = (QCTableList: ITable[], QCTableMasterList: ITable[], QCTablePatchItem: IPatchTable, activeQCTable: ITable) => {
        
        return new Promise<any>((resolve: (items: any) => void, reject: (error: any) => void): void => {
            this.setState({ qualityCheckList: QCTableList, qualityCheckList_MasterCpy: QCTableMasterList, qualityCheckList_PatchTable: QCTablePatchItem }, () => {
                resolve(this.state);
            });
        });
    }

    ///<onQualityCheckItemDelete> delete quality check list row.
    private onQualityCheckItemDelete = (qc_selectedRows: any[], activeQCTable: ITable, identityColumnName: string) => {
        qc_selectedRows.forEach((qc_row: any) => {
            activeQCTable.serverResponse.data = activeQCTable.serverResponse.data.filter((qc_selectedRow: any) => { return qc_selectedRow[identityColumnName] != qc_row[identityColumnName]; });
        });
        return activeQCTable;
    }

    ///<onDeleteListUpdate> updates deleted items of quality check list.
    private onDeleteListUpdate = (activeQCTable: ITable, activeQCMasterTable: ITable, QCTablePatchItem: IPatchTable, columnSchema: IColumnSchema, qc_selectedRows: any[], identityColumnName: string) => {

        if (QCTablePatchItem && Object.keys(QCTablePatchItem).length > 0) {
            QCTablePatchItem = this.onQualityCheckPatchItemDelete(qc_selectedRows, QCTablePatchItem, identityColumnName);
            
            if (QCTablePatchItem.List && QCTablePatchItem.List.length <= 0) {
                QCTablePatchItem = {} as IPatchTable;
            }
        }
        this.onFilterLocalItems(qc_selectedRows, columnSchema, activeQCTable, identityColumnName);
    }

    ///<onQualityCheckPatchItemDelete> delete items from unsaved items.
    private onQualityCheckPatchItemDelete = (qc_selectedRows: any[], QCTablePatchItem: IPatchTable, identityColumnName: string) => {

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
        
        return QCTablePatchItem;
    }

    ///<onSubmit> Triggers when save btn clicked, submit the data to the DB.
    private onSubmit = () => {


        this.state.gridOptions.api.stopEditing();
        let ss = this.state.gridOptions.api.getSelectedRows();
        //if (ss.length > 0)
        //    this.onUpdatePatchItem({ data: ss[0] });
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
                            
                        }
                        else {
                            d.serverResponse.data.unshift(item.data);
                        }
                    })
                    return d;
                });
                
                let activeTable = this.getActiveTable(this.state.qualityCheckList_MasterCpy);
                this.setState({ qualityCheckList_PatchTable: {} as IPatchTable, qualityCheckList_MasterCpy: JSON.parse(JSON.stringify(varMaster)) }, () => {
                    this.setState({ qualityCheckList: JSON.parse(JSON.stringify(this.state.qualityCheckList_MasterCpy)) }, () => {

                        this.onGridUpdate(activeTable.name, activeTable.type);
                    });
                });
                        alert("Successfully updated");
            } else {
                alert(res.response.message);
                console.log(res.response.message);
            }
        }).catch(error => {
            
            alert(error);
        });

    }

    ///<onUpdatePatchItem> Triggers when cell is modified & update the data to qualityCheckItem_PatchItems
    private onUpdatePatchItem = (eve: any) => {


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

    ///<onCellValueChanged> Triggers when cell is modified & calls onUpdatePatchItem method
    private onCellValueChanged = (eve: any) => {

        this.onUpdatePatchItem(eve);
    }

    ///<onGridReady> Ag-grid Initializing API components
    private onGridReady(eve: any) {
        this.state.gridOptions.api = eve.api;
        this.state.gridOptions.columnApi = eve.columnApi;
        eve.api.sizeColumnsToFit();
        //  this.state.gridOptions.api.selectAll();
        this.setState({ gridOptions: this.state.gridOptions });
    }

    ///<onQuickFilterChanged> Triggers when value in changes in txt box and filter data in grid based on provided input txt.
    private onQuickFilterChanged = (eve: any) => {
        const { value } = eve.target;
        this.state.gridOptions.api.setQuickFilter(value);
    };

    ///<isFirstColumn> <Archive AG-Grid Functions>
    private isFirstColumn(params: any) {
        var displayedColumns = params.columnApi.getAllDisplayedColumns();
        var thisIsFirstColumn = displayedColumns[0] === params.column;
        return thisIsFirstColumn;
    }

    ///<compareValues> <Archive AG-Grid Functions>
    private compareValues(params: any) {

        if (params.oldValue.toString() > params.newValue.toString()) {
            return { headerClass: "class-make" }
        }
        if (params.oldValue.toString() < params.newValue.toString()) {
            return { color: 'red', backgroundColor: 'black' };
        }
    }
};


