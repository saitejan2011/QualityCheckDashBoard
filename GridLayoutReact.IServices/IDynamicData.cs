using GridLayoutReact.Models.DB;
using GridLayoutReact.Models.MiddleWare;
using System;
using System.Collections.Generic;
using System.Text;

namespace GridLayoutReact.IServices
{
    public interface IDynamicData
    {

        List<Models.DB.Table> GetAllDBTables();

        List<TableSchema> GetTableSchema(string tableName);
        Response InsertItemInDB(NewRow newRowObj);

        Response DeleteItemFromDB(DeleteRow delRowObj);

        Response UpdateItemInDB(EditRow editRowObj);

        dynamic GetTableData(string tableName);
    }
}
