using System;
using System.Collections.Generic;
using System.Text;

namespace GridLayoutReact.Models.MiddleWare
{
    public class Validation
    {
        public string ColumnName { get; set; }
        public string TableName { get; set; }
        public bool IsValid { get; set; }
        public string ErrorMessage { get; set; }
    }
}
