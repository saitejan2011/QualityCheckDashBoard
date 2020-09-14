using GridLayoutReact.IServices;
using GridLayoutReact.Models.DB;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using GridLayoutReact.Models.MiddleWare;

namespace GridLayoutReact.Services
{
    public class DynamicData : IDynamicData
    {
        private readonly AppSettings _appSettings;
        private readonly string _connectionString;

        public DynamicData(AppSettings appSettings)
        {
            this._appSettings = appSettings;
            this._connectionString = appSettings.ConnectionString;
        }

        public List<Models.DB.Table> GetAllDBTables()
        {
            try
            {
                using (SqlConnection con = new SqlConnection(this._connectionString))
                {
                    SqlCommand cmd = new SqlCommand("SELECT TABLE_SCHEMA, TABLE_NAME FROM INFORMATION_SCHEMA.TABLES ", con);
                    con.Open();
                    SqlDataReader dataReader = cmd.ExecuteReader();
                    List<Models.DB.Table> tableList = new List<Models.DB.Table>();
                    while (dataReader.Read())
                    {
                        tableList.Add(new Models.DB.Table()
                        {
                            Name = dataReader["TABLE_NAME"] != null ? dataReader["TABLE_NAME"].ToString() : "",
                            Type = dataReader["TABLE_SCHEMA"] != null ? dataReader["TABLE_SCHEMA"].ToString() : ""
                        });
                    }
                    return tableList;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public List<TableSchema> GetTableSchema(string tableName, string schemaType)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(this._connectionString))
                {
                    SqlCommand cmd = new SqlCommand();
                    cmd.Connection = con;
                    cmd.CommandText = @"SELECT 
        S.name as SchemaName,
        T.Name AS TableName,
        C.Name AS ColumnName,
        Ty.Name AS ColumnDataType,
        C.is_nullable AS IsNullAble,
        C.is_identity AS IsIdentity ,
        case when Ty.Name = 'nvarchar'
        then C.max_length / 2
        else
        C.max_length end AS MaximumLength
    FROM sys.tables T
    INNER JOIN sys.columns C
    ON T.OBJECT_ID = C.OBJECT_ID
    INNER JOIN sys.types Ty
    ON C.system_type_id = Ty.system_type_id
    INNER JOIN sys.schemas S on 
    S.schema_id = T.schema_id
    WHERE T.is_ms_shipped = 0 AND T.Name = '" + tableName + "' AND S.name = '" + schemaType + "' and Ty.Name != 'sysname' ORDER BY T.name";
                    con.Open();
                    SqlDataReader dataReader = cmd.ExecuteReader();
                    List<TableSchema> tableSchemaList = new List<TableSchema>();
                    while (dataReader.Read())
                    {
                        tableSchemaList.Add(new TableSchema
                        {
                            IsNull = dataReader["IsNullAble"] != DBNull.Value && dataReader["IsNullAble"].ToString().ToLower() == "true" ? true : false,
                            IsIdentity = dataReader["IsIdentity"] != DBNull.Value && dataReader["IsIdentity"].ToString().ToLower() == "true" ? true : false,
                            DataType = dataReader["ColumnDataType"] != DBNull.Value ? dataReader["ColumnDataType"].ToString() : string.Empty,
                            Type = dataReader["SchemaName"] != DBNull.Value ? dataReader["SchemaName"].ToString() : string.Empty,
                            MaximumLength = dataReader["MaximumLength"] != DBNull.Value ? Convert.ToInt32(dataReader["MaximumLength"]) : -1,
                            ColumnName = dataReader["ColumnName"] != DBNull.Value ? dataReader["ColumnName"].ToString() : string.Empty,
                            TableName = dataReader["TableName"] != DBNull.Value ? dataReader["TableName"].ToString() : string.Empty
                        }
                        );
                    };
                    return tableSchemaList;
                }

            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public ServerResponse GetRowsById(PatchRow patchItem)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(this._connectionString))
                {

                    SqlCommand cmd = new SqlCommand();
                    con.Open();
                    cmd.Connection = con;
                    string identityColumnName = patchItem.IdentityColumnName;
                    List<dynamic> identityKeyValues = new List<dynamic>();
                    foreach (var item in patchItem.dynamicListItems)
                    {
                        Dictionary<string, string> result = JsonConvert.DeserializeObject<Dictionary<string, string>>(item.ToString());
                        identityKeyValues.Add(result.Where(res => res.Key == patchItem.IdentityColumnName).Select(i => i.Key + " = " + i.Value).ToList().FirstOrDefault());
                    }
                    List<TableSchema> tblSchemaList = GetTableSchema(patchItem.TableName, patchItem.SchemaType);
                    var tblKeys = tblSchemaList.Select(schma => schma.ColumnName).ToList();
                    cmd.CommandText = string.Format("SELECT * FROM {0}.{1} WHERE {2}", patchItem.SchemaType, patchItem.TableName, string.Join(" OR ", identityKeyValues));
                    List<Models.MiddleWare.Table> dataTable = new List<Models.MiddleWare.Table>();

                    using (SqlDataReader rdr = cmd.ExecuteReader())
                    {
                        ServerResponse serverResponseObj = new ServerResponse();
                        List<Dictionary<string, string>> dataList = new List<Dictionary<string, string>>();

                        List<TableSchema> schemaList = new List<TableSchema>();
                        while (rdr.Read())
                        {
                            Dictionary<string, string> propsDict = new Dictionary<string, string>();
                            foreach (var item in tblKeys)
                            {
                                propsDict.Add(item.ToString(), rdr[item].ToString());
                            }
                            dataList.Add(propsDict);
                        }
                        serverResponseObj.Data = dataList;
                        serverResponseObj.Schemas = tblSchemaList;
                        return serverResponseObj;
                    }
                }
            }
            catch (Exception ex)
            {
                return new ServerResponse();

            }
        }

        public ServerResponse GetTableData(string tableName, string schemaType)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(this._connectionString))
                {

                    SqlCommand cmd = new SqlCommand();
                    con.Open();
                    cmd.Connection = con;
                    cmd.CommandText = string.Format("SELECT * FROM {0}.{1}", schemaType, tableName);
                    List<TableSchema> tblSchemaList = GetTableSchema(tableName, schemaType);
                    var tblKeys = tblSchemaList.Select(schma => schma.ColumnName).ToList();

                    List<Models.MiddleWare.Table> dataTable = new List<Models.MiddleWare.Table>();


                    using (SqlDataReader rdr = cmd.ExecuteReader())
                    {
                        ServerResponse serverResponseObj = new ServerResponse();
                        List<Dictionary<string, string>> dataList = new List<Dictionary<string, string>>();
                        List<TableSchema> schemaList = new List<TableSchema>();
                        while (rdr.Read())
                        {

                            Dictionary<string, string> propsDict = new Dictionary<string, string>();
                            foreach (var item in tblKeys)
                            {
                                propsDict.Add(item.ToString(), rdr[item].ToString());
                            }
                            dataList.Add(propsDict);
                        }
                        serverResponseObj.Data = dataList;
                        serverResponseObj.Schemas = tblSchemaList;

                        return serverResponseObj;
                    }

                }
            }
            catch (Exception ex)
            {
                return new ServerResponse();

            }
        }

        public Response InsertItemInDB(NewRow rowObj)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(this._connectionString))
                {
                    SqlCommand cmd = new SqlCommand();
                    con.Open();
                    cmd.Connection = con;
                    List<List> listObj = new List<List>();
                    foreach (var item in rowObj.dynamicListItems)
                    {
                        Dictionary<string, string> result = JsonConvert.DeserializeObject<Dictionary<string, string>>(item.ToString());
                        string dict_keys = string.Join(", ", result.Where(res => res.Key != rowObj.IdentityColumnName).Select(p => p.Key));
                        var dict_vals = string.Format("'{0}'", string.Join("','", result.Where(res => res.Key != rowObj.IdentityColumnName).Select(i => i.Value.Replace("'", "''"))));
                        cmd.CommandText = string.Format("INSERT INTO {0}.{1} ({2}) OUTPUT INSERTED.* VALUES ({3})", rowObj.SchemaType, rowObj.TableName, dict_keys, dict_vals);



                        if (rowObj.TableSchemaList == null && rowObj.TableSchemaList.Count <= 0)
                        {
                            rowObj.TableSchemaList = GetTableSchema(rowObj.TableName, rowObj.SchemaType);
                        }

                        var tblKeys = rowObj.TableSchemaList.Select(schma => schma.ColumnName).ToList();

                        listObj.AddRange(GetOutputExecutionResult(cmd, tblKeys, result, "NEW"));
                    }
                    if (listObj.Where(s => s.IsResponseSuccessfull == false).ToList().Count > 0)
                        return new Response() { IsResponseSuccess = false, Message = listObj.Where(s => s.IsResponseSuccessfull == false).FirstOrDefault().Message, Result = listObj };
                    else
                        return new Response() { IsResponseSuccess = true, Message = "SUCCESS", Result = listObj };
                }
            }
            catch (Exception ex)
            {
                return new Response() { IsResponseSuccess = false, Message = ex.Message };

            }
        }
        public List<List> GetOutputExecutionResult(SqlCommand cmd, dynamic tblKeys, Dictionary<string, string> result, string formType)
        {
            List<List> listObj = new List<List>();
            try
            {
                using (SqlDataReader rdr = cmd.ExecuteReader())
                {
                    List<Dictionary<string, string>> dataList = new List<Dictionary<string, string>>();

                    List<TableSchema> schemaList = new List<TableSchema>();
                    while (rdr.Read())
                    {
                        Dictionary<string, string> propsDict = new Dictionary<string, string>();
                        foreach (var row in tblKeys)
                        {
                            propsDict.Add(row.ToString(), rdr[row].ToString());
                        }

                        listObj.Add(new List() { Data = propsDict, FormType = formType, IsResponseSuccessfull = true });
                    }
                }
            }
            catch (Exception ex)
            {


                listObj.Add(new List() { Data = result, FormType = formType, IsResponseSuccessfull = false, Message = ex.Message.ToString() });
            }

            return listObj;
        }

        public Response UpdateItemInDB(EditRow editRowObj)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(this._connectionString))
                {
                    SqlCommand cmd = new SqlCommand();
                    con.Open();
                    cmd.Connection = con;
                    List<List> listObj = new List<List>();
                    foreach (var rowObj in editRowObj.dynamicListItems)
                    {
                        var result = JsonConvert.DeserializeObject<Dictionary<string, string>>(rowObj.ToString());
                        string keyValuesQueryTxt = string.Empty;
                        int index = 0;
                        string identityColumnValue = string.Empty;

                        foreach (var item in result)
                        {
                            if (item.Key == editRowObj.IdentityColumnName)
                            {
                                identityColumnValue = item.Value;
                            }
                            else
                            {
                                keyValuesQueryTxt += string.Concat(item.Key, " = '", item.Value, "'", (index == result.Count - 1) ? "" : ",");
                            }
                            index++;
                        }

                        cmd.CommandText = string.Format("UPDATE {0}.{1} SET {2} OUTPUT INSERTED.* WHERE {3}={4}", editRowObj.SchemaType, editRowObj.TableName, keyValuesQueryTxt, editRowObj.IdentityColumnName, identityColumnValue);

                        if (editRowObj.TableSchemaList == null && editRowObj.TableSchemaList.Count <= 0)
                        {
                            editRowObj.TableSchemaList = GetTableSchema(editRowObj.TableName, editRowObj.SchemaType);
                        }

                        var tblKeys = editRowObj.TableSchemaList.Select(schma => schma.ColumnName).ToList();

                        listObj.AddRange(GetOutputExecutionResult(cmd, tblKeys, result, "EDIT"));

                    }
                    if (listObj.Where(s => s.IsResponseSuccessfull == false).ToList().Count > 0)
                        return new Response() { IsResponseSuccess = false, Message = listObj.Where(s => s.IsResponseSuccessfull == false).FirstOrDefault().Message, Result = listObj };
                    else
                        return new Response() { IsResponseSuccess = true, Message = "SUCCESS", Result = listObj };
                }
            }
            catch (Exception ex)
            {
                return new Response() { IsResponseSuccess = false, Message = ex.Message };

            }

        }

     

        public Response DeleteItemFromDB(DeleteRow delRowObj)
        {
            try
            {
                string tableName = delRowObj.TableName.ToString();
                string schemaType = delRowObj.Type != null ? delRowObj.Type.ToString() : string.Empty;
                var schema = GetTableSchema(tableName, schemaType);
                var delItemList = delRowObj.Data;//.Where(obj => obj.FormType == "DELETE").Select(s => s.Data).ToList();
                var identityColumn = schema.Where(s => s.IsIdentity == true).FirstOrDefault();
                Dictionary<string, string> result;
                if (identityColumn != null && delItemList.Count > 0)
                {

                    using (SqlConnection con = new SqlConnection(this._connectionString))
                    {
                        SqlCommand cmd = new SqlCommand();
                        con.Open();
                        cmd.Connection = con;

                        List<string> testt = new List<string>();
                        foreach (var item in delItemList)
                        {
                            result = JsonConvert.DeserializeObject<Dictionary<string, string>>(item.ToString());
                            testt.Add(result.Where(s => s.Key == identityColumn.ColumnName).Select(d => d.Value).FirstOrDefault());
                        }
                        string ids = string.Join(", ", testt.Select(id => id));
                        cmd.CommandText = string.Format("DELETE FROM {0} WHERE {1} IN ({2})", delRowObj.TableName, identityColumn.ColumnName, ids);
                        cmd.ExecuteNonQuery();
                    }

                }
                else
                {
                    return new Response() { IsResponseSuccess = true, Message = "FAILED" };
                }
                return new Response() { IsResponseSuccess = true, Message = "SUCCESS" };
            }
            catch (Exception ex)
            {
                return new Response() { IsResponseSuccess = false, Message = ex.Message.ToString() };

            }
        }

        public Response PatchItems(TransceivalExchange clientPatchRequestObj)
        {
            Response responseObj = new Response();
            try
            {


                string tableName = clientPatchRequestObj.TableName.ToString();
                string schemaType = clientPatchRequestObj.Type != null ? clientPatchRequestObj.Type.ToString() : string.Empty;
                var schema = GetTableSchema(tableName, schemaType);

                var newItemList = clientPatchRequestObj.List.Where(obj => obj.FormType == "NEW").Select(s => s.Data).ToList();
                var editItemList = clientPatchRequestObj.List.Where(obj => obj.FormType == "EDIT").Select(s => s.Data).ToList();
                var identityColumn = schema.Where(s => s.IsIdentity == true).FirstOrDefault();
                bool isResponseValid = true;
                string inValidResponseTxt = string.Empty;

                TransceivalExchange transExchnageObj = new TransceivalExchange() { TableName = tableName, IdentityColumnName = identityColumn.ColumnName, Type = schemaType, List = new List<List>(), };


                if (identityColumn != null)
                {
                    if (newItemList.Count > 0)
                    {
                        responseObj = InsertItemInDB(new NewRow() { TableName = tableName, SchemaType = schemaType, IdentityColumnName = identityColumn.ColumnName, dynamicListItems = newItemList, TableSchemaList = schema });
                        if (responseObj.IsResponseSuccess)
                        {
                            transExchnageObj.List.AddRange(responseObj.Result);
                        }
                        else
                        {
                            transExchnageObj.List.AddRange(responseObj.Result);
                            isResponseValid = false;
                            inValidResponseTxt = responseObj.Message.ToString();
                        }
                    }

                    if (editItemList.Count > 0)
                    {
                        responseObj = UpdateItemInDB(new EditRow() { TableName = tableName, SchemaType = schemaType, IdentityColumnName = identityColumn.ColumnName, dynamicListItems = editItemList, TableSchemaList = schema });
                        if (responseObj.IsResponseSuccess)
                        {
                            transExchnageObj.List.AddRange(responseObj.Result);
                        }
                        else
                        {
                            transExchnageObj.List.AddRange(responseObj.Result);
                            inValidResponseTxt = responseObj.Message.ToString();
                            isResponseValid = false;
                        }
                    }
                }
                else
                {
                    return new Response() { IsResponseSuccess = false, Message = "There is no Identity column. Cannot proccess the action" };
                }
                return new Response() { IsResponseSuccess = isResponseValid, Message = inValidResponseTxt, TransExchange = transExchnageObj };
            }
            catch (Exception ex)
            {
                return new Response() { IsResponseSuccess = false, Message = ex.Message };
            }



        }






    }
}
