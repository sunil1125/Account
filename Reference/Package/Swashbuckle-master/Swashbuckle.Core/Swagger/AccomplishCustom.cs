using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;

namespace Swashbuckle.Swagger
{
    /// <summary>
    /// This class contains all the methods which overrides / customize the orignal swagger behaviour
    /// </summary>
    public class AccomplishCustom
    {
        /// <summary>
        /// It overrides the host in Request URl which comes up on the click of "Try it out"
        /// Issue : it helps the swagger to be configurable to try the api's on differnt server hosts
        /// To change the host , refer <appSettings>  <add key="ServerHost" value="localhost/ShipperCenterService" /> </appSettings> in
        /// web.config --> "ShipperCenter.Component.Documentation" project --> "ShipperCenter.Service" solution.
        /// </summary>
        /// <returns></returns>
        public string HostUrl()
        {
            string url = string.Empty;
            try
            {
                if (!string.IsNullOrEmpty(ConfigurationManager.AppSettings["ServerHost"]))
                {
                    url = ConfigurationManager.AppSettings["ServerHost"].ToString();
                }
            }
            catch (Exception ex)
            {
                //TODO :
            }
            return url;
        }
    }
}
