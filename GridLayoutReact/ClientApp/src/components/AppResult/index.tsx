import * as React from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './styles.scss';
import { Constants } from '../../Utility/Constants'
import { Column, ColDef, _, IsColumnFunc, GridOptionsWrapper, GridOptions } from 'ag-grid-community';
import '../../Utility/gbStyles.scss';
import 'lodash';
import { Utilities } from '../../Utility/Util';
import { ITable } from '../../Models/ITable';
import { IServerResponse } from '../../Models/IServerResponse';
import { IState } from './IState';
import { IColumnSchema } from '../../Models/IColumnSchema';
import { IAppResult } from '../../Models/IAppResult';
import Loader from '../Loader';

const util = new Utilities();

export default class AppResult extends React.PureComponent<any, IState> {
    public util = new Utilities();

    //<constructor> Initializing State And Props
    constructor(props: any) {
        super(props);
        this.state = {
            appList: [],
            isLoaderEnable: true
        }
    }

    /// <componentDidMount> Initial API calls when component is loaded (GetTables).
    async componentDidMount() {
        //  this.state.gridOptions.api.showLoadingOverlay();

        let appNames: any[] = await this.getAppNames();
        await this.setAppNames(appNames).then((app: any) => {
            this.onGridUpdate(app.name);
        }, () => {

        });
        debugger;

    }

    ///<onGridUpdate> Updating grid data for both ag-grid
    private onGridUpdate = (appName: string) => {
        this.setState({ isLoaderEnable: true });
        let varAppList: IAppResult[] = Object.assign([], this.state.appList);
        varAppList = this.inActiveQualityCheckList(varAppList);

        let varAppItem: IAppResult = this.getAppTable(appName, varAppList);
        varAppItem.isActive = true;
        if (varAppItem && !(varAppItem.isLoaded)) {
            this.getTableData(varAppItem.name).then((appData: any) => {
                let varAppData: any[] = [];
                if (appData && Object.values(appData).length > 0) {
                    Object.values(appData).forEach((appDataItem: any, index: number) => {
                        varAppData.push(this.getGridOptions(appDataItem));
                    });
                }
                varAppItem.gridOptions = varAppData;
                this.setState({ appList: varAppList, isLoaderEnable: false });
            });

        }
        else {
            this.setState({ appList: varAppList, isLoaderEnable: false });
        }


    }

    private inActiveQualityCheckList = (varAppList: IAppResult[]): IAppResult[] => {
        varAppList.map((app_Item: IAppResult) => {
            app_Item.isActive = false;
            return app_Item;
        });
        return varAppList;
    }


    ///<getQualityCheckListTable> returns active table from qualityCheckList.
    private getAppTable = (name: string, varAppList: IAppResult[]): IAppResult => {
        return varAppList.filter((s: any) => s.name == name).find(x => x !== undefined) || {} as IAppResult;
    }

    ///<getTableData> get Table Data along with its schema.
    private getTableData = async (appName: string) => {
        let tblDataUrl = Constants.hostURL + "/" + Constants.controller.appData + "/" + Constants.actions.getAppTablesDataSet + "?appName=" + appName;
        return new Promise<any>((resolve: (items: any) => void, reject: (error: any) => void): void => {
            this.util.getDataFromDB(tblDataUrl).then((tblData: any) => {
                if (tblData)
                    resolve(tblData);
                else
                    reject("Get Table Data Error");
            });
        });
    }




    /// <render> rendering DOM.
    public render() {
        const activeApp: any = this.state && this.state.appList && this.state.appList.length > 0 && this.state.appList.filter((appItem: IAppResult) => {
            return appItem.isActive == true;
        })[0];
        let appTables = [];
        if (activeApp) {
            appTables = activeApp.gridOptions.map((item: any, index: number) => {
                return (
                    <div className="ag-theme-alpine gridLayoutInnerContainer">
                        <div className="row mb-1">
                            <div className="col-md-6 form-group tableHeaderContainer">
                                <h2 className="tableHeader">Table : {index + 1}</h2>
                            </div>
                            <div className="col-md-6 form-group search-txtbox-container ex-right">
                                <div className="input-group col-md-6 px-0">
                                    <input type="text" onInput={(eve) => this.onQuickFilterChanged(eve,index)} className="form-control" placeholder="Search..." aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                    <div className="input-group-append d-block">
                                        <span className="input-group-text" >Search</span>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <AgGridReact
                            columnDefs={item.gridOptions.columnDefs}
                            rowData={item.gridOptions.rowData}
                            gridOptions={item.gridOptions}
                        >
                        </AgGridReact>
                    </div>)
            });
        }
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
                                    this.state && this.state.appList && this.state.appList.length > 0 && this.state.appList.map((appItem: IAppResult, index: number) => {
                                        return (<option value={appItem.name} data-id={index + 1}> {appItem.name}</option>);
                                    })}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6 form-group search-txtbox-container ex-right">
                        <div className="input-group col-md-6 px-0">
                            {activeApp.gridOptions ? <h3>No Of Tables {activeApp.gridOptions.length}</h3> : ""}
                        </div>
                    </div>
                </div>
                {appTables}
                <Loader isActive={this.state.isLoaderEnable}></Loader>
            </div>
        );
    }

    private getAppNames = async () => {
        let tblDataUrl = Constants.hostURL + "/" + Constants.controller.appData + "/" + Constants.actions.getAppNames;
        return new Promise<any>((resolve: (items: any) => void, reject: (error: any) => void): void => {
            this.util.getDataFromDB(tblDataUrl).then((tblData: any) => {
                if (tblData)
                    resolve(tblData);
                else
                    reject("Get Table Data Error");
            });
        });
    }


    private setAppNames = async (appNames: any[]) => {
        let appArr: IAppResult[] = [];
        return new Promise<any>(async (resolve: (items: any) => void, reject: (error: any) => void): Promise<void> => {

            if (appNames && appNames.length <= 0) {
                reject("Set Table Error");
            }
            appNames.forEach((item: any, index: number) => {
                appArr.push({
                    name: this.util.capitalizeFLetter(item.name),
                    isLoaded: false,
                    isActive: index == 0,
                    gridOptions: []
                });
            });
            await this.setState({ appList: appArr }, () => {
                resolve(appArr[0]);
            });
        });
    }



    /// <scrambleAndRefreshAll> make active and udpate the grid values in case grid is not functioning properly.
    private scrambleAndRefreshAll = () => {
        let params = {
            force: true
        };
        //this.state.gridOptions.api.refreshCells(params);
    }

    ///<onQuickFilterChanged> Triggers when value in changes in txt box and filter data in grid based on provided input txt.
    private onQuickFilterChanged = (eve: any,index:number) => {
        const { value } = eve.target;
        let app = this.state.appList.filter(s => s.isActive == true)[0];
        app.gridOptions[index].gridOptions.api.setQuickFilter(value);
    };

    ///<onTableChange> Triggers when table value changes and calls the active tables to render.
    private onTableChange = (eve: any) => {
        let tblName: string = eve.target.value;
        this.onGridUpdate(tblName);
    }

    ///<onGridReady> Ag-grid Initializing API components
    public onGridReady(eve: any) {
        //this.state.gridOptions.api = eve.api;
        //this.state.gridOptions.columnApi = eve.columnApi;
        //eve.api.sizeColumnsToFit();
        ////  this.state.gridOptions.api.selectAll();
        //this.setState({ gridOptions: this.state.gridOptions });
    }
    ///<getAgGridColData> Returns column dynamic column definition array.
    private getAgGridColData = (appRowData: any): ColDef[] => {
        let colArr: ColDef[] = [];
        if (appRowData) {
            Object.keys(appRowData).forEach((key: any) => {
                colArr.push({
                    headerName: util.capitalizeFLetter(key.trim()),
                    field: key
                });
            });
        }
        return colArr;
    }

    private getGridOptions(appRowData: any) {
        const gridOptions: any = {
            gridOptions: {
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
                columnDefs: this.getAgGridColData(appRowData[0]),
                rowData: appRowData,
                enableSorting: true,
                pagination: true,
                paginationPageSize: 30,
                animateRows: true,
                onGridReady: this.onGridReady.bind(this),
                rowSelection: "multiple",
                overlayLoadingTemplate:
                    '<span class="ag-overlay-loading-center">Please wait while your data is loading</span>',
                overlayNoRowsTemplate:
                    '<span style="padding: 10px;background: rgb(251 206 7 / 0.6);font-weight: bold;">No data to display</span>'
            }
        };
        return gridOptions;
    }
};




