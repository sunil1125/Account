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
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refMapLocation = require('services/models/common/MapLocation');
import refEnums = require('services/models/common/Enums');
import refValidations = require('services/validations/Validations');
//#endregion

/*
** <summary>
** Sales Order details View Model.
** </summary>
** <createDetails>
** <id>US12101</id> <by>Chandan</by> <date>27th Aug, 2014</date>
** </createDetails>}
** <changeHistory>}

** </changeHistory>
*/

class SalesOrderViewModel {

	//#region Constructor
	constructor() {
	}

	//#endregion

	//#region Internal Methods

	//#endregion

	//#region Life Cycle Event
	public compositionComplete(view, parent) {
	}

	public activate() {
		return true;
	}

	//** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
	public attached() {
		_app.trigger('viewAttached');
	}
	//#endregion
}
return SalesOrderViewModel;