/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../TypeDefs/PurchaseOrderModel.d.ts" />
//#endregion References

import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');

export module Models {
	export class ForeignBolAddress {
		ID: number;
		CustomerId: number;
		CompanyName: string;
		Address1: string;
		Address2: string;
		City: string;
		State: string;
		ZipCode: string;
		AddressType: number;
		CountryCode: number;
		CanEdit: boolean;
		IsEditVisible: boolean;
		AddressTypeDisplay: string;
        UpdatedDate: number;
        VendorBillId: number;
		constructor(args?: IForeignBolAddress) {
			this.ID = refSystem.isObject(args) ? args.ID : 0;
			this.CustomerId = refSystem.isObject(args) ? args.CustomerId : 0;
			this.CompanyName = refSystem.isObject(args) ? args.CompanyName : '';
			this.Address1 = refSystem.isObject(args) ? args.Address1 : '';
			this.Address2 = refSystem.isObject(args) ? args.Address2 : '';
			this.City = refSystem.isObject(args) ? args.City : '';
			this.State = refSystem.isObject(args) ? args.State : '';
			this.ZipCode = refSystem.isObject(args) ? args.ZipCode : '';
			this.AddressType = refSystem.isObject(args) ? args.AddressType : 0;
			this.CountryCode = refSystem.isObject(args) ? args.CountryCode : 0;
			this.CanEdit = refSystem.isObject(args) ? args.CanEdit : false;
			this.IsEditVisible = refSystem.isObject(args) ? args.IsEditVisible : false;
			this.AddressTypeDisplay = refSystem.isObject(args) ? args.AddressTypeDisplay : '';
            this.UpdatedDate = refSystem.isObject(args) ? args.UpdatedDate : 0;
            this.VendorBillId = refSystem.isObject(args) ? args.VendorBillId : 0;
		}
	}
}