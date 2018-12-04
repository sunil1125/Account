/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References

/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../TypeDefs/CarrierModel.d.ts" />

//#endregion References

/**#Created:
		By: Chandan
		On: Aug 21, 2014
	  Desc: To hold Carrier Contact details data

**#Modified:
		By:
		On:
	  Desc:
*/

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
//#endregion Import
export module Models {
	export class CarrierContactDetails {
		Id: number;
		DisplayName: string;
		IsNotificationApplicable: number;

		constructor(args?: ICarrierContactType) {
			this.Id = refSystem.isObject(args) ? args.Id : 0;
			this.DisplayName = refSystem.isObject(args) ? args.DisplayName : '';
			this.IsNotificationApplicable = refSystem.isObject(args) ? args.IsNotificationApplicable : 0;
		}
	}
}