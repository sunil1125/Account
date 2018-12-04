/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

using System;
using System.Configuration;
using System.Web;
using System.Web.Mvc;
using Accounting.Models;
using Accounting.Web.Common;
using AmadeusConsulting.Simplex.Base.Net;
using AmadeusConsulting.Simplex.Security;

namespace Accounting.Web.Controllers
{
	[Authorize]
	public class HomeController : Controller
	{
		public ActionResult Index()
		{
			//set Theme cookie for logged in user.
			SetThemeCookie();
			//Retrive User Theme
			UserUISettingsModel uisettings = GetUserTheme();
			return View(uisettings);
		}

		/// <summary>
		/// Set Cookie for user
		/// </summary>
		private void SetThemeCookie()
		{
			Response.Cookies["UserInfo"].Value = ((SimplexPrincipal)HttpContext.User).Identity.Name;
			Response.Cookies["UserInfo"].Expires = DateTime.MaxValue;
		}

		/// <summary>
		/// Get User Theme
		/// </summary>
		/// <returns>UserUISettingsModel</returns>
		/// <changeHistory>
		/// <id>US26457</id> <by>Baldev Singh Thakur</by> <date>20-01-2017</date> <description>Fetching the external call details throgh ComponentPaths</description>
		/// </changeHistory>
		private UserUISettingsModel GetUserTheme()
		{
			// ###START: US26457
			string baseurl = Atlas.Core.Component.ComponentPaths.GetComponentPathByKey("AtlasBaseUrl");

			// ###END: US26457
			return Http.Get<UserUISettingsModel>(string.Format("{0}/Accounting/GetThemeName", baseurl), CookieHelper.AtlasCookieContainer);
		}
	}
}