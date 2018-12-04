/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="Utilities.ts" />
/// <reference path="TypeDefs/utils.d.ts" />

/**
* View model for the application nav bar
*/
class ApplicationNavBarViewModel {
	constructor() {
	}

	/*
	* Logs the user out of the application
	*/
	logoffCommand() {
		var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

		ajax.get("Logoff")
			.done(() => window.location.href = "/portal/login")
			.fail(() => window.location.href = "/portal/login");
	}
}

$().ready(() => {
	// initalize the application view model
	var applicationNavBarViewModel = new ApplicationNavBarViewModel();
	ko.applyBindings(applicationNavBarViewModel, document.getElementById('mainSiteNavbar'));
});