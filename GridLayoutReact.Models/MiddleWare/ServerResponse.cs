using GridLayoutReact.Models.DB;
using System.Collections.Generic;

namespace GridLayoutReact.Models.MiddleWare
{
    public class ServerResponse
    {
        public List<Dictionary<string, string>> Data { get; set; }
        public List<TableSchema> Schemas { get; set; }

    }
}
