/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../services/models/TypeDefs/VendorBillSearchModel.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refEnums = require('services/models/common/Enums');
import _refUserClient = require('services/client/UserClient');

//#endregion

/***********************************************
  MY SETTING VIEW VIEW MODEL
************************************************
** <createDetails>
** <id>US12574</id><by>Chandan</by> <date>3rd oct, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id></id><by></by> <date></date>
** </changeHistory>

***********************************************/

class MySettingViewModel {
	//#region members
	Theme: KnockoutObservable<string> = ko.observable('');
	selectedTheme: KnockoutObservable<string> = ko.observable('');
	enbaleThemeSaveButton: KnockoutObservable<boolean> = ko.observable(false);
	userClient: _refUserClient.UserClient = new _refUserClient.UserClient();
	//#endregion

	//#region Constructor
	constructor() {
		var self = this;

		self.selectedTheme.subscribe((themeName) => {
			var regex = /theme/;
			var themeFromLink = $("body> link").attr("href");
			var selectedThemeName = themeFromLink.substring(themeFromLink.lastIndexOf('/') + 1);
			if (themeName + '.css' !== selectedThemeName) {
				self.enbaleThemeSaveButton(true);
			}
			else {
				self.enbaleThemeSaveButton(false);
			}
		});

		return self;
	}
	//#endregion

	//#region Internal Methods

	public saveTheme() {
		var self = this;

		var regex = /theme/;
		var themeFromLink = $("body> link").attr("href");
		var themePath = themeFromLink.substring(0, themeFromLink.lastIndexOf('/') + 1);
		var newTheme = themePath + self.selectedTheme() + '.css';
		if (regex.test($("body> link").attr("href"))) {
			$("body> link").attr("href", newTheme);
		}
		$('#themeColorContainer').find('div').removeClass('selectedTheme');
		$('#div' + self.selectedTheme()).addClass('selectedTheme');

		self.userClient.SaveThemeName(self.selectedTheme(), function (data: string) {
			self.enbaleThemeSaveButton(false);

			//self.customerSettings().UserSettings.TemplateName = self.selectedTheme();
			var toastrOptions1 = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 10,
				fadeOut: 10,
				typeOfAlert: "",
				title: ""
			}

			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SavingUserThemeSuccessfully, "success", null, toastrOptions1, null);
		},
			function () {
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ErrorWhileSavingUserTheme, "error", null, toastrOptions, null);
			});
	}

	private setSelectedTheme() {
		var self = this;
		var regex = /theme/;
		var themeFromLink = $("body> link").attr("href");
		var themeName = themeFromLink.substring(themeFromLink.lastIndexOf('/') + 1);
		if (themeName != null || themeName !== undefined) {
			themeName = themeName.replace('.css', '');
			var themeSplit = themeName.split('?');
			themeName = themeSplit[0];
		} else {
			themeName = 'theme1';
		}
		self.selectedTheme(themeName);
	}
	//#endregion

	//#region Life Cycle Event
	public beforeBind() {
		var self = this;
		self.setSelectedTheme();
	}

	public attached() {
		_app.trigger('viewAttached');
	}

	public activate() {
		return true;
	}

	public compositionComplete() {
	}
	//#endregion
}

return MySettingViewModel;