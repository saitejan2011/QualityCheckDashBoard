using System;
using System.Collections.Generic;
using System.Text;

namespace GridLayoutReact.Models.MiddleWare
{
    public class Response
    {
        public string Message { get; set; }
        public bool IsResponseSuccess { get; set; }

        
        public List<List> Result { get; set; }

        public TransceivalExchange TransExchange { get; set; }

    }
 
}
