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
	export class CarrierContactDetail {
		Id: number;
		MassCarrierID: number;
		ContactType: number;
		CarrierName: string;
		ContactName: string;
		ContactEmail: string;
		ContactPhone: string;
		ContactFax: string;
		FirstMailPeriod: number;
		SecondMailPeriod: number;
		UpdatedBy: number;
		CarrierId: number;
		DisplayName: string;
		CarrierTypes: ICarrierContactType;

		constructor(args?: ICarrierContactDetails) {
			this.Id = refSystem.isObject(args) ? args.CarrierId : 0;
			this.MassCarrierID = refSystem.isObject(args) ? args.MassCarrierID : 0;
			this.ContactType = refSystem.isObject(args) ? args.ContactType : 0;
			this.CarrierName = refSystem.isObject(args) ? args.CarrierName : '';
			this.ContactName = refSystem.isObject(args) ? args.ContactName : '';
			this.ContactEmail = refSystem.isObject(args) ? args.ContactEmail : '';
			this.ContactPhone = refSystem.isObject(args) ? args.ContactPhone : '';
			this.ContactFax = refSystem.isObject(args) ? args.ContactFax : '';
			this.FirstMailPeriod = refSystem.isObject(args) ? args.FirstMailPeriod : 0;
			this.SecondMailPeriod = refSystem.isObject(args) ? args.SecondMailPeriod : 0;
			this.UpdatedBy = refSystem.isObject(args) ? args.UpdatedBy : 0;
			this.CarrierId = refSystem.isObject(args) ? args.CarrierId : 0;
			this.DisplayName = refSystem.isObject(args) ? args.DisplayName : '';
			this.CarrierTypes = refSystem.isObject(args) ? args.CarrierTypes: null;
		}
	}
}