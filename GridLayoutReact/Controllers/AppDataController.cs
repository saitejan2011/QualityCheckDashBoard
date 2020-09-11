using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using GridLayoutReact.IServices;
using GridLayoutReact.Models.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GridLayoutReact.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AppDataController : ControllerBase
    {

        private IAppData _appData;
        public AppDataController(IAppData appData)
        {
            _appData = appData;
        }

        [HttpGet]
        public DataSet GetAppTablesDataSet(string appName)
        {
            return _appData.GetAppTablesDataSet(appName);
        }

        [HttpGet]
        public List<App> GetAppNames()
        {
            return _appData.GetAppNames();
        }
    }
}
