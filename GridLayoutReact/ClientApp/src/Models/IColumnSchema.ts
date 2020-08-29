

export interface IColumnSchema {
    columnName: string;
    dataType?: string;
    isIdentity: boolean;
    isNullAble: boolean;
    maximumLength: number;
    tableName?: string;
}   