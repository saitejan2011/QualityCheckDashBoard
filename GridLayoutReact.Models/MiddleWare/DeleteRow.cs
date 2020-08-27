using System;
using System.Collections.Generic;
using System.Text;

namespace GridLayoutReact.Models.MiddleWare
{
    public class DeleteRow:DBRow
    {
        public int[] Id { get; set; }
        public string IdentityColumnName  { get; set; }

    }
}
