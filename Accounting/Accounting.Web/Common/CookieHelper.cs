/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

using System.Net;
using System.Web;
using AmadeusConsulting.Simplex.Rest.Security;
using System.Configuration;

namespace Accounting.Web.Common
{
	/// <summary>
	/// Cookie Helper class
	/// </summary>
	/// <changeHistory>
	/// <id>US19934</id> <by>Chandan Singh</by> <date>1-1-2015</date> <description>Acct: Perform Code Refactoring for Internal and External Component (Added CookiesContainer for Internal)</description>
	/// <id>US26457</id> <by>Baldev Singh Thakur</by> <date>20-01-2017</date> <description>Fetching the cookie Container values.</description>
	/// </changeHistory>
	public static class CookieHelper
	{
		/// <summary>
		/// Cookie container containing SimplexAuth cookie - to be passed in server to server calls
		/// </summary>
		/// <returns>cookie container</returns>
		public static CookieContainer CookiesContainer
		{
			get
			{
				HttpRequest request = HttpContext.Current.Request;
				HttpCookie authCookie = request.Cookies[SimplexRestAuthenticationModule.CookieName];

				if (authCookie != null)
				{
					Cookie oC = new System.Net.Cookie();

					// Convert between the System.Net.Cookie to a System.Web.HttpCookie...
					oC.Domain = request.Url.Host;
					oC.Expires = authCookie.Expires;
					oC.Name = authCookie.Name;
					oC.Path = authCookie.Path;
					oC.Secure = authCookie.Secure;
					oC.Value = authCookie.Value;

					CookieContainer cookieCollection = new CookieContainer();
					cookieCollection.Add(oC);
					return cookieCollection;
				}

				return null;
			}
		}

		/// <summary>
		/// Cookie container containing SimplexAuth cookie - to be passed in server to server calls
		/// Which are not accessible directly from client 
		/// </summary>
		/// <returns>Cookie container with the same/different domain</returns>
		public static CookieContainer CookiesContainerInternal
		{
			//// ###START: US19934
			get
			{
				HttpRequest request = HttpContext.Current.Request;
				HttpCookie authCookie = request.Cookies[SimplexRestAuthenticationModule.CookieName];

				if (authCookie != null)
				{
					System.Net.Cookie oC = new System.Net.Cookie();

					oC.Domain = string.IsNullOrEmpty(ConfigurationManager.AppSettings["AppHostedDomainNameInternal"]) ? request.Url.Host : ConfigurationManager.AppSettings["AppHostedDomainNameInternal"];
					oC.Expires = authCookie.Expires;
					oC.Name = authCookie.Name;
					oC.Path = authCookie.Path;
					oC.Secure = authCookie.Secure;
					oC.Value = authCookie.Value;

					CookieContainer cookieCollection = new System.Net.CookieContainer();
					cookieCollection.Add(oC);
					return cookieCollection;
				}

				return null;
			}
			//// ###END: US19934
		}

		/// <summary>
		/// Fetch CookieContainer value
		/// </summary>
		public static CookieContainer AtlasCookieContainer
		{
			get { return Atlas.Core.Component.ComponentPaths.GetCookieContainerByKey("AtlasBaseUrl", AmadeusConsulting.Simplex.Rest.Security.SimplexRestAuthenticationModule.CookieName); }
		}

		/// <summary>
		/// Fetch CookieContainer value
		/// </summary>
		public static CookieContainer DocumentManagementCookieContainer
		{
			get { return Atlas.Core.Component.ComponentPaths.GetCookieContainerByKey("DocumentManagement", AmadeusConsulting.Simplex.Rest.Security.SimplexRestAuthenticationModule.CookieName); }
		}
	}
}