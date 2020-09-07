using System;
using System.Collections.Generic;
using System.Text;
using GridLayoutReact.IServices;

namespace GridLayoutReact.Services
{
    public class AppSettings : IAppSettings
    {
        public string ConnectionString { get; set; }
    }
}
