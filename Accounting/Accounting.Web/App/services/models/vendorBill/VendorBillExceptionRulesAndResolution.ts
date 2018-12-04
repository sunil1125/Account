/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References

/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../TypeDefs/VendorBillModels.d.ts" />

//#endregion References

/**#Created:
		By: Chadnan
		On: Dec 04, 2014
	  Desc: To hold VendorBillExceptionRulesAndResolution  data

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
	export class VendorBillExceptionRulesAndResolution {
		VendorBillId: number;
		VendorBillExceptionRuleDescription: string;
		ExceptionResolution: string;
		constructor(args?: IVendorBillExceptionRulesAndResolution) {
			this.VendorBillId = refSystem.isObject(args) ? args.VendorBillId : 0;
			this.VendorBillExceptionRuleDescription = refSystem.isObject(args) ? (args.VendorBillExceptionRuleDescription) : '';
			this.ExceptionResolution = refSystem.isObject(args) ? (args.ExceptionResolution) : '';
		}
	}
}