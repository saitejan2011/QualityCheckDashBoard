using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using GridLayoutReact.IServices;
using GridLayoutReact.Models.DB;
using GridLayoutReact.Models.MiddleWare;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace GridLayoutReact.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DynamicDataController : ControllerBase
    {


        private IDynamicData _dynamicData;

        public DynamicDataController(IDynamicData dynamicData)
        {
            _dynamicData = dynamicData;
        }

        [HttpGet]
        public List<Models.DB.Table> GetTables()
        {
            return _dynamicData.GetAllDBTables();
        }

        [HttpGet]
        public ServerResponse GetTableData(string tableName,string schemaType)
        {
            return _dynamicData.GetTableData(tableName, schemaType);
        }

        [HttpGet]
        public List<TableSchema> GetTableSchema(string tableName, string schemaType)
        {
            return _dynamicData.GetTableSchema(tableName, schemaType);
        }

    
        [HttpPut]
        public ActionResult<Response> PatchItems(TransceivalExchange clientPatchRequestObj)
        {
                Response response = _dynamicData.PatchItems(clientPatchRequestObj);
            if(response.IsResponseSuccess)
            return Ok(new { Result = "Saved", Response= response });
            else
                return Ok(new { Result = response.Message, Response = response });
        }

        [HttpPut]
        public Response DeleteItemFromDB(DeleteRow delRowObj)
        {
            return _dynamicData.DeleteItemFromDB(delRowObj);
        }




    }
}
