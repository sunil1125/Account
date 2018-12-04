/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

using System;
using System.Web.Optimization;

namespace Accounting.Web
{
	public class BundleConfig
	{
		/// <summary>
		/// Registers the bundles.
		/// </summary>
		/// <param name="bundles">The bundles.</param>
		/// <changeHistory>
		/// <id>US19763</id> <by>SHREESHA ADIGA</by> <date>01-12-2015</date> <description>Added a Fusionchart theme js file</description>
		/// <id>US19763</id> <by>Dhaval Tamhane</by> <date>21-09-2016</date> <description>Added files related to TinyMCE rich text editor</description>
		/// </changeHistory>
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.IgnoreList.Clear();
			AddDefaultIgnorePatterns(bundles.IgnoreList);

			bundles.Add(
				new ScriptBundle("~/Scripts/vendor.js")
					.Include("~/Scripts/Vendor/jquery-{version}.js")
					.Include("~/Scripts/Vendor/jquery.cookie.js")
					.Include("~/Scripts/Vendor/bootstrap.js")
					.Include("~/Scripts/Vendor/bootstrap-tabs.js")
					.Include("~/Scripts/Vendor/bootstrap-timepicker.js")
					.Include("~/Scripts/Vendor/bootstrap-datepicker.js")
					.Include("~/Scripts/Vendor/bootstrap-daterangepicker.min.js")
					.Include("~/Scripts/Vendor/knockout-{version}.js")
					.Include("~/Scripts/Vendor/knockout.validation.js")
					.Include("~/Scripts/Vendor/knockout-validation.js")
					.Include("~/Scripts/Vendor/koGrid-2.1.1.debug.js")
					.Include("~/Scripts/Vendor/modernizr-{version}.js")
					.Include("~/Scripts/Vendor/json2.min.js")
					.Include("~/Scripts/jqueryui/jquery.color-{version}.min.js")
					.Include("~/Scripts/jqueryui/jquery.showLoading.js")
					.Include("~/Scripts/jqueryui/jquery-ui.js")
					.Include("~/Scripts/Vendor/jquery.highlight-4.js")
					.Include("~/Scripts/Vendor/jquery.gridster.with-extras.js")
					.Include("~/Scripts/Vendor/moment-langs.js")
					.Include("~/Scripts/Vendor/toastr.js")
					.Include("~/Scripts/Vendor/jquery.cropzoom.js")
					.Include("~/Scripts/Vendor/jQueryRotate.js")
					.Include("~/Scripts/Vendor/spin.min.js")
					.Include("~/Scripts/Vendor/jquery.fileDownload.min.js")
					.Include("~/Scripts/Vendor/jquery.maskedinput.js")
					.Include("~/Scripts/Vendor/jquery.timepicker.js")
					.Include("~/Scripts/Vendor/date.format.js")
					.Include("~/Scripts/utils.js")
					.Include("~/Scripts/Utility.js")
					.Include("~/Scripts/Utilities.js")
					.Include("~/Scripts/Constants/ApplicationConstants.js")
					.Include("~/Scripts/Constants/ApplicationMessages.js")
					.Include("~/Scripts/Vendor/knockout.persist.js")
					.Include("~/Scripts/Vendor/knockout-bootstrap.min.js")
					.Include("~/Scripts/Vendor/knockout-bootstrap.js")
					.Include("~/Scripts/Vendor/jquery.multiple.select.js")
					.Include("~/Scripts/Vendor/jquery.number.js")
					.Include("~/Scripts/Vendor/fusioncharts/FusionCharts.js")	// to render charts with the help of this library.
					.Include("~/Scripts/Vendor/fusioncharts/themes/fusioncharts.theme.fint.js")
					.Include("~/Scripts/Vendor/jquery.number.min.js")
					.Include("~/Scripts/Vendor/Accounting.MainMenu.js")
					.Include("~/Scripts/Vendor/TinyMCE.js")
					.Include("~/Scripts/Vendor/plugins/table/plugin.js")
					.Include("~/Scripts/Vendor/plugins/link/plugin.js")
					.Include("~/Scripts/Vendor/plugins/paste/plugin.js")
					.Include("~/Scripts/Vendor/plugins/lists/plugin.js")
					.Include("~/Scripts/Vendor/themes/modern/theme.js")
				);

			bundles.Add(
				new ScriptBundle("~/Scripts/loginvendor.js")
					.Include("~/Scripts/Vendor/jquery-{version}.js")
					.Include("~/Scripts/Vendor/jquery.cookie.js")
					.Include("~/Scripts/Vendor/bootstrap.js")
					.Include("~/Scripts/Vendor/bootstrap-tabs.js")
					.Include("~/Scripts/Vendor/bootstrap-datepicker.js")
					.Include("~/Scripts/Vendor/knockout-{version}.js")
					.Include("~/Scripts/Vendor/knockout.validation.js")
					.Include("~/Scripts/Vendor/knockout-validation.js")
					.Include("~/Scripts/Vendor/knockout-bootstrap.min.js")
					.Include("~/Scripts/Vendor/json2.min.js")
					.Include("~/Scripts/utils.js")
					.Include("~/Scripts/Utility.js")
					.Include("~/Scripts/Utilities.js")
					.Include("~/Scripts/Vendor/jquery.signalR-{version}.js")
					.Include("~/Scripts/Constants/ApplicationConstants.js")
					.Include("~/signalr/hubs")
				);

			bundles.Add(
				new ScriptBundle("~/Scripts/applicationJs.js")
					.Include("~/Scripts/Simplex.js")
					.Include("~/Scripts/Site.js")
					.Include("~/Scripts/Utilities.js")
					.Include("~/Scripts/Application.js")
					);

			bundles.Add(
				new StyleBundle("~/Content/css")
					.Include("~/Content/ie10mobile.css")
					.Include("~/Content/bootstrap.css")
					.Include("~/Content/bootstrap-responsive.min.css")
					.Include("~/Content/bootstrap-timepicker.css")
					.Include("~/Content/bootstrap-daterangepicker-theme1.min.css")
					.Include("~/Content/font-awesome.min.css")
					.Include("~/Content/New-font-awesome.css")
					.Include("~/Content/durandal.css")
					.Include("~/Content/datepicker.css")
					.Include("~/Content/mystyle.css")
					.Include("~/Content/navigation.css")
					.Include("~/Content/main-styleSheet.css")
					.Include("~/Content/toastr.css")
					.Include("~/Content/KoGrid.css")
					.Include("~/Content/messageBox.css")
					.Include("~/Content/jquery.gridster.css")
					.Include("~/Content/jquery.cropzoom.css")
					.Include("~/Content/report-dashboard.css")
					.Include("~/Content/reportViewerControlV2.css")
					.Include("~/Content/accounting-style-sheet.css")
					.Include("~/Content/jquery.timepicker.css")
					.Include("~/Content/multiple-select.css")
					.Include("~/Content/TiinyEdtor.css")
					.Include("~/Scripts/Vendor/skins/lightgray/skin.min.css")
					.Include("~/Scripts/Vendor/skins/lightgray/content.min.css")
					.Include("~/Scripts/Vendor/skins/lightgray/content.inline.min.css")
				);

			bundles.Add(
				new StyleBundle("~/loginContent/css")
					.Include("~/Content/durandal.css")
					.Include("~/Content/mystyle.css")
					.Include("~/Content/main-styleSheet.css")
				);
		}

		/// <summary>
		/// Adds the default ignore patterns.
		/// </summary>
		/// <param name="ignoreList">The ignore list.</param>
		/// <exception cref="System.ArgumentNullException">ignoreList</exception>
		public static void AddDefaultIgnorePatterns(IgnoreList ignoreList)
		{
			if (ignoreList == null)
			{
				throw new ArgumentNullException("ignoreList");
			}

			ignoreList.Ignore("*.intellisense.js");
			ignoreList.Ignore("*-vsdoc.js");
			ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
		}
	}
}