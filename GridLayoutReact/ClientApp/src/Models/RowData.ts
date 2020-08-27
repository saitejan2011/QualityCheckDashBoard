export interface IRowData {
    Id: number;
    ColumnName?: string;
    MaxLength?: number;
    DataType?: string;
    IsIdentity?: boolean;
    IsNullable?: boolean;
    Value: any;

    // constructor(obj: any) {
    //     this.Id = obj.ID;
    //     this.ColumnName = obj.columnName;
    //     this.MaxLength = obj.maximumLength;
    //     this.DataType = obj.dataType;
    //     this.IsIdentity = obj.isIdentity;
    //     this.IsNullable = obj.isNull;
    // }
}   