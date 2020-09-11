using GridLayoutReact.IServices;
using GridLayoutReact.Models.DB;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace GridLayoutReact.Services
{
    public class AppData : IAppData
    {
        private readonly AppSettings _appSettings;
        private readonly string _connectionString;

        public AppData(AppSettings appSettings)
        {
            this._appSettings = appSettings;
            this._connectionString = appSettings.ConnectionString;
        }

        public DataSet GetAppTablesDataSet(string appName)
        {
            try
            {
                using (SqlConnection con = new SqlConnection(this._connectionString))
                {
                    DataTable dataTable = new DataTable();
                    con.Open();
                    SqlCommand cmd = new SqlCommand("GET_APP", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@APP", appName));
                    SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                    DataSet dataSet = new DataSet();
                    adapter.Fill(dataSet);
                    return dataSet;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public List<App> GetAppNames()
        {
            try
            {
                using (SqlConnection con = new SqlConnection(this._connectionString))
                {

                    SqlCommand cmd = new SqlCommand();
                    con.Open();
                    cmd.Connection = con;
                    cmd.CommandText = string.Format("Select  DISTINCT APPNAME  from APP"); ;
                    List<App> appList = new List<App>();
                    using (SqlDataReader rdr = cmd.ExecuteReader())
                    {
                        while (rdr.Read())
                        {
                            appList.Add(new App() { Name = rdr["APPNAME"].ToString() });
                        }
                    }
                    return appList;
                }
            }
            catch (Exception ex)
            {
                return null;

            }


        }
    }
}
