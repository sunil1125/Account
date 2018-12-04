/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../TypeDefs/PurchaseOrderModel.d.ts" />

//#endregion References
//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
//#endregion Import

export module Models {
	export class ForeignBolAddressesContainer {
		ForeignBolAddressesList: Array<IForeignBolAddress>;
		constructor(args?: IForeignBolAddressesContainer) {
			if (args) {
				this.ForeignBolAddressesList = args.ForeignBolAddressesList;
			}
		}
	}
}