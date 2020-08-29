using System;
using System.Collections.Generic;
using System.Text;

namespace GridLayoutReact.Models.DB
{
    public class TableSchema
    {
        public bool IsNull { get; set; }
        public bool IsIdentity { get; set; }
        public string Type { get; set; }
        public string DataType { get; set; }
        public int MaximumLength { get; set; }
        public string ColumnName { get; set; }
        public string TableName { get; set; }
    }
}
