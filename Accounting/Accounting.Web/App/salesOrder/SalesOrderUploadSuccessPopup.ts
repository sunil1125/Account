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
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
//#endregion

/*
** <summary>
** Sales Order Upload success popup model
** </summary>
** <createDetails>
** <id>US19882</id> <by>Shreesha Adiga</by> <date>11-01-2016</date>
** </createDetails>
*/
class SalesOrderUploadSuccessPopupViewModel {
	//#region Member
	successMessage: KnockoutObservable<string> = ko.observable("");
	isClosed: KnockoutObservable<boolean> = ko.observable(false);
	//#endregion Member

	//close
	public closePopup(dialogResult) {
		var self = this;
		self.isClosed(true);
		dialogResult.__dialog__.close(this, dialogResult);
		return true;
	}

	//#region Life Cycle Event
	public load() {
	}

	public compositionComplete(view, parent) {
	}

	// Activate the view and bind the selected data from the main view
	public activate(data: IMessageBoxOption) {
		var self = this;

		self.successMessage(data.bindingObject);
	}
	//#endregion Life Cycle Event
}

return SalesOrderUploadSuccessPopupViewModel;


