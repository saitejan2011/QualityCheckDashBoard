export interface IRowData {
    Id: number;
    ColumnName?: string;
    MaxLength?: number;
    DataType?: string;
    IsIdentity?: boolean;
    IsNullable?: boolean;
    Value: any;
}   