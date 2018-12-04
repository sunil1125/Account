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
		By: Bhanu
		On: Aug 20, 2014
	  Desc: To hold Carrier Mapping details data

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
	export class CarrierMappingDetails {
		CarrierId: number;
		CarrierName: string;
		CarrierCode: string;
		MinimumWeight: number;
		IsVPTLCarrier: boolean;
		CarrierType: string;
		CarrierTypeId: number;
		MASCarrier: string;
		MASCode: string;
		Mapped: string;
		LegalName: string;
		Contacts: string;
		IsBlockedFromSystem: boolean;
		MassId: string;
		constructor(args?: ICarrierDetails) {
			this.CarrierId = refSystem.isObject(args) ? args.CarrierId : 0;
			this.CarrierName = refSystem.isObject(args) ? args.CarrierName : '';
			this.CarrierCode = refSystem.isObject(args) ? args.CarrierCode : '';
			this.MinimumWeight = refSystem.isObject(args) ? args.MinimumWeight : 0;
			this.IsVPTLCarrier = refSystem.isObject(args) ? args.IsVPTLCarrier : false;
			this.CarrierType = refSystem.isObject(args) ? args.CarrierType : '';
			this.CarrierTypeId = refSystem.isObject(args) ? args.CarrierTypeId : 0;
			this.MASCarrier = refSystem.isObject(args) ? args.MASCarrier : '';
			this.MASCode = refSystem.isObject(args) ? args.MASCode : '';
			this.Mapped = refSystem.isObject(args) ? args.Mapped : '';
			this.LegalName = refSystem.isObject(args) ? args.LegalName : '';
			this.Contacts = refSystem.isObject(args) ? args.Contacts : '';
			this.IsBlockedFromSystem = refSystem.isObject(args) ? args.IsBlockedFromSystem : false;
			this.MassId = refSystem.isObject(args) ? args.MassId : '';
		}
	}
}