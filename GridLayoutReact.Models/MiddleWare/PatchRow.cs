using GridLayoutReact.Models.DB;
using System;
using System.Collections.Generic;
using System.Text;

namespace GridLayoutReact.Models.MiddleWare
{
    public class PatchRow:DBRow
    {

        public dynamic dynamicListItems { get; set; }

        public string IdentityColumnName { get; set; }

        public List<TableSchema> TableSchemaList { get; set; }

    }
}
