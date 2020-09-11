using GridLayoutReact.Models.DB;
using GridLayoutReact.Models.MiddleWare;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace GridLayoutReact.IServices
{
    public interface IDynamicData
    {
        List<Models.DB.Table> GetAllDBTables();
        List<TableSchema> GetTableSchema(string tableName, string schemaType);
        Response InsertItemInDB(NewRow rowObj);

        Response DeleteItemFromDB(DeleteRow delRowObj);

        Response UpdateItemInDB(EditRow editRowObj);

        ServerResponse GetTableData(string tableName, string schemaType);

        Response PatchItems(TransceivalExchange clientPatchRequest);

        ServerResponse GetRowsById(PatchRow patchItem);

    }
}
