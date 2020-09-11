using GridLayoutReact.Models.DB;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace GridLayoutReact.IServices
{
    public interface IAppData
    {
        DataSet GetAppTablesDataSet(string appName);
        List<App> GetAppNames();
    }
}
