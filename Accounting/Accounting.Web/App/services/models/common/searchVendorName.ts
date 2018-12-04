/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />

import refSystem = require('durandal/system');

export interface IVendorNameSearch {
	ID: number;
	CarrierName: string;
	CarrierType: number;
	CarrierTypeName: string;
	CarrierCode: string;
	MCNumber: string;
	ContactName: string;
	City: string;
	State: string;
	display: string;
	isEmpty?: () => boolean;
}

export module Models {
	export class VendorNameSearch {
		ID: number;
		CarrierName: string;
		CarrierType: number;
		CarrierTypeName: string;
		CarrierCode: string;
		MCNumber: string;
		ContactName: string;
		City: string;
		State: string;
		count: number = 0;
		display: string;

		constructor(args?: IVendorNameSearch) {
			this.ID = refSystem.isObject(args) ? (args.ID) : 0;
			this.CarrierName = refSystem.isObject(args) ? (args.CarrierName) : '';
			this.CarrierCode = refSystem.isObject(args) && args.CarrierCode ? (args.CarrierCode) : '';
			this.CarrierTypeName = refSystem.isObject(args) ? (args.CarrierTypeName) : '';
			this.CarrierType = refSystem.isObject(args) ? (args.CarrierType) : 0;
			this.MCNumber = refSystem.isObject(args) && args.MCNumber != null ? (args.MCNumber) : '';
			this.ContactName = refSystem.isObject(args) && args.ContactName!=null ? (args.ContactName) : '';
			this.City = refSystem.isObject(args) && args.City != null ? (args.City) : '';
			this.State = refSystem.isObject(args) && args.State != null ? (args.State) : '';
			this.display = this.isEmpty() ? '' : this.CarrierName + '  ' + this.CarrierTypeName + '  ' + this.MCNumber + '  ' + this.ContactName + '  ' + this.City + '  ' + this.State;
			this.count = 2;
		}

		isEmpty() {
			var commonUtils = new Utils.Common();
			return this.ID === 0 && commonUtils.isNullOrEmptyOrWhiteSpaces(this.CarrierName) && this.CarrierType === 0 && commonUtils.isNullOrEmptyOrWhiteSpaces(this.MCNumber) && commonUtils.isNullOrEmptyOrWhiteSpaces(this.ContactName) && commonUtils.isNullOrEmptyOrWhiteSpaces(this.City) && commonUtils.isNullOrEmptyOrWhiteSpaces(this.State);
		}
	}
}