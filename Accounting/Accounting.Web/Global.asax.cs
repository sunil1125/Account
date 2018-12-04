/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

using System;
using System.IO;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using System.Web.Security;
using AmadeusConsulting.Simplex.Constants;
using AmadeusConsulting.Simplex.Rest.Security;
using AmadeusConsulting.Simplex.Security;

namespace Accounting.Web
{
	// Note: For instructions on enabling IIS6 or IIS7 classic mode,
	// visit http://go.microsoft.com/?LinkId=9394801
	/// <summary>
	/// MvcApplication Startup class
	/// </summary>
	/// <changeHistory>
	/// <id>US24396</id> <by>Vasanthakumar</by> <date>24-08-2016</date> <description>Acct: Global Exception handling in mvc applications</description>
	/// <id>US24397</id> <by>Vasanthakumar</by> <date>24-08-2016</date> <description>Acct: Custom request headers in MVC applications</description>
	/// <id>US27900</id> <by>Shreesh Adiga</by> <date>03-05-2016</date> <description>Authentication for Sales Order details and EDI details</description>
	/// </changeHistory>
	public class MvcApplication : System.Web.HttpApplication
	{
		public static AmadeusConsulting.Simplex.Logging.Logger Logger { get; private set; }

		/// <summary>
		/// Handles the application start event
		/// </summary>
		/// <changeHistory>
		/// <id>US24396</id> <by>Vasanthakumar</by> <date>24-08-2016</date>
		/// </changeHistory> 
		protected void Application_Start()
		{
			MvcHandler.DisableMvcResponseHeader = true;

			//// ###START: US24396
			var fileInfo = new FileInfo((typeof(MvcApplication).Assembly.Location));
			string assemblyName = fileInfo.Name.Substring(0, fileInfo.Name.Length - fileInfo.Extension.Length);
			Logger = new AmadeusConsulting.Simplex.Logging.Logger(assemblyName, false);
			//// ###END: US24396

			AreaRegistration.RegisterAllAreas();

			FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
			RouteConfig.RegisterRoutes(RouteTable.Routes);
			BundleConfig.RegisterBundles(BundleTable.Bundles);
		}

		/// <summary>
		/// Handles the OnAuthenticate event of the FormsAuthentication control.
		/// </summary>
		/// <param name="sender">The source of the event.</param>
		/// <param name="args">The <see cref="FormsAuthenticationEventArgs"/> instance containing the event data.</param>
		/// <changeHistory>
		/// <id>US27900</id> <by>Shreesh Adiga</by> <date>03-05-2016</date> <description>Set auth cookie for Sales Order details and EDI details</description>
		/// </changeHistory>
		public void FormsAuthentication_OnAuthenticate(object sender, FormsAuthenticationEventArgs args)
		{
			if (args == null) return;
			try
			{
				if (Request.Cookies[SimplexRestAuthenticationModule.CookieName] != null)
				{
					args.User = AuthenticationCommands.AuthenticateTicket(Request.Cookies[SimplexRestAuthenticationModule.CookieName].Value);

					// Add the details in the cookis which is uesed to navigate to the details page in case of opening from other application (CC)
					if (Request.QueryString["ReturnUrl"] != null &&
						(Request.QueryString["ReturnUrl"].Contains("VendorBillDetails") || Request.QueryString["ReturnUrl"].Contains("SalesOrderDetails") || Request.QueryString["ReturnUrl"].Contains("Edi210CarrierException")))
					{
						var authCookie = new HttpCookie("ReturnUrl", Request.QueryString["ReturnUrl"].ToString());

						// Removed Remember Me support due to ticket expiration conflict
						HttpContext.Current.Response.Cookies.Add(authCookie);
					}
				}
				else if (Request.QueryString[SimplexRestAuthenticationModule.CookieName] != null && !string.IsNullOrEmpty(Request.QueryString[SimplexRestAuthenticationModule.CookieName]))
				{
					// Authenticate the external tickets
					args.User = AuthenticationCommands.AuthenticateTicket(Request.QueryString[SimplexRestAuthenticationModule.CookieName].ToString());
					if (args.User.Identity.IsAuthenticated)
					{
						if (Request.Cookies[SimplexRestAuthenticationModule.CookieName] == null)
						{
							var authCookie = new HttpCookie(SimplexRestAuthenticationModule.CookieName, Request.QueryString[SimplexRestAuthenticationModule.CookieName].ToString());

							// Removed Remember Me support due to ticket expiration conflict
							HttpContext.Current.Response.Cookies.Add(authCookie);
						}

						if (Request.QueryString["ReturnUrl"] != null)
						{
							var authCookie = new HttpCookie("ReturnUrl", Request.QueryString["ReturnUrl"].ToString());

							// Removed Remember Me support due to ticket expiration conflict
							HttpContext.Current.Response.Cookies.Add(authCookie);
						}
					}
				}
			}
			catch (ExpiredTicketException)
			{
				FormsAuthentication.SignOut();
				FormsAuthentication.RedirectToLoginPage();
			}
			catch (AuthenticationException)
			{
				FormsAuthentication.SignOut();
				FormsAuthentication.RedirectToLoginPage();
			}
		}

		/// <summary>
		/// Handles the Application begin request
		/// </summary>
		/// <param name="sender">The source of the event.</param>
		/// <param name="e">instance containing the event data.</param>
		/// <createDetails>
		/// <id>US24397</id> <by>Vasanthakumar</by> <date>24-08-2016</date>
		/// </createDetails> 
		protected void Application_BeginRequest(object sender, EventArgs e)
		{
			try
			{
				Request.Headers.Add(CustomHeaders.CorrelationId, Guid.NewGuid().ToString());
				Request.Headers.Add(CustomHeaders.RouteChain, Request.Url.ToString());
			}
			catch { }
		}

		/// <summary>
		/// Handles the Apllication unhandled exception
		/// </summary>
		/// <param name="sender">The source of the event.</param>
		/// <param name="args">instance containing the event data.</param>
		/// <createDetails>
		/// <id>US24396</id> <by>Vasanthakumar</by> <date>24-08-2016</date>
		/// </createDetails> 
		protected void Application_Error(object sender, EventArgs args)
		{
			try
			{
				Exception exception = Server.GetLastError();
				Logger.Error("Error Occurred in " + Request.Url.ToString(), exception);
			}
			catch
			{
				// Our most reliable exception handler is failed :(
			}
		}

		/// <summary>
		/// Handles the PreSendRequestHeaders event of the Application control.
		/// </summary>
		/// <param name="sender">The source of the event.</param>
		/// <param name="e">The <see cref="EventArgs"/> instance containing the event data.</param>
		[System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Design", "CA1031:DoNotCatchGeneralExceptionTypes")]
		protected void Application_PreSendRequestHeaders(object sender, EventArgs e)
		{
			try
			{
				Response.Headers.Remove("Server");
			}
			catch { }
		}
	}
}