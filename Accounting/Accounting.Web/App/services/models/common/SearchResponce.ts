/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />

import refSystem = require('durandal/system');

export module Models {
	export class VendorBillSearchResult {
		VendorBillId: number;
		PRONumber: string;
		BOLNumber: string;
		BillDateDisplay: string;

		constructor(args?: IVendorBillSearchResult) {
			this.VendorBillId = refSystem.isObject(args) ? (args.VendorBillId) : 0;
			this.PRONumber = refSystem.isObject(args) ? (args.PRONumber) : '';
			this.BOLNumber = refSystem.isObject(args) ? (args.BOLNumber) : '';
			this.BillDateDisplay = refSystem.isObject(args) ? (args.BillDateDisplay) : '';
		}
	}

	export class SalesOrderSearchResult {
		ShipmentId: number;
		BOLNumber: string;
		PRONumber: string;
		ShipmentType: string;

		constructor(args?: ISalesOrderSearchResult) {
			this.ShipmentId = refSystem.isObject(args) ? (args.ShipmentId) : 0;
			this.BOLNumber = refSystem.isObject(args) ? (args.BOLNumber) : '';
			this.PRONumber = refSystem.isObject(args) ? (args.PRONumber) : '';
			this.ShipmentType = refSystem.isObject(args) ? (args.ShipmentType) : '';
		}
	}
}