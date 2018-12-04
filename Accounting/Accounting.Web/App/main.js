/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

requirejs.config({
	paths: {
		'text': '../Scripts/Vendor/text',
		'durandal': '../Scripts/Vendor/durandal',
		'plugins': '../Scripts/Vendor/durandal/plugins',
		'transitions': '../Scripts/Vendor/durandal/transitions'
	}
	,urlArgs: "v=" + Utils.Constants.JSVersion
});

define('jquery', [], function () { return jQuery; });
define('knockout', [], function () { return ko; });

define(['durandal/system', 'durandal/app', 'durandal/viewLocator'], function (system, app, viewLocator) {
	//>>excludeStart("build", true);
	system.debug(true);
	//>>excludeEnd("build");

	app.title = 'Accounting';

	//specify which plugins to install and their configuration
	app.configurePlugins({
		router: true,
		dialog: true,
		widget: {
			kinds: ['expander']
		}
	});

	app.start().then(function () {
		//Replace 'viewmodels' in the moduleId with 'views' to locate the view.
		//Look for partial views in a 'views' folder in the root.
		viewLocator.useConvention();

		//Show the app by setting the root view model for our application.
		app.setRoot('shell');
	});
});