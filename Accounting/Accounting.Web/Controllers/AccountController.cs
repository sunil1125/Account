/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

using System.Web.Mvc;
using Accounting.Web.Models;

namespace Accounting.Web.Controllers
{
	[Authorize]
	public class AccountController : Controller
	{
		/// <summary>
		/// Login Action method.
		/// </summary>
		/// <param name="user">User name</param>
		/// <param name="password">Password field</param>
		/// <returns>Returns View for the Login Action method</returns>
		[AllowAnonymous]
		public ActionResult Login(string user, string password)
		{
			if (User.Identity.IsAuthenticated)
			{
				return RedirectToAction("Index", "Home");
			}
			else
			{
				return View();
			}
		}

		/// <summary>
		/// Login Action method.
		/// </summary>
		/// <param name="user">User name</param>
		/// <param name="password">Password field</param>
		/// <returns>Returns View for the Login Action method</returns>
		[AllowAnonymous]
		public ActionResult ResetPassword(string user, string password)
		{
			if (User.Identity.IsAuthenticated)
			{
				return RedirectToAction("Index", "Home");
			}
			else
			{
				return View(new ResetPassword { IsTokenValid = true });
			}
		}
	}
}