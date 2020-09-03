using System;
using System.Collections.Generic;
using System.Text;

namespace GridLayoutReact.Models.MiddleWare
{
    public class List
    {
        public dynamic Data { get; set; }
        public string FormType { get; set; }

        public bool IsResponseSuccessfull { get; set; }

        public string Message { get; set; }

    }
    public enum QualityCheckFormType
    {
        New,
        Edit,
        Delete

    }
}
