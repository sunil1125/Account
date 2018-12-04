/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../TypeDefs/PurchaseOrderModel.d.ts" />
/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../TypeDefs/PurchaseOrderSearchModel.d.ts" />

import refSystem = require('durandal/system');

// <changeHistory>
// <id>US22796</id> <by>Baldev Singh Thakur</by> <date>16-06-2016</date> <description>Added a new bool Property IsTruckLoadChecked</description>
// </changeHistory>
export module Models {
	export class POToSOParameter {
		VendorBillId: number;
		CurrentUser: string;
		CarrierId: number;
		ProNumber: string;
		AgencyId: number;
		AgentId: number;
		CustomerId: number;
		Term: string;
		AvailableCredit: string;
		PickupDate: Date;
		// ###START: US22796
		IsTruckLoadChecked: boolean;
		CustomerName: string;
		// ###END: US22796

		constructor(args?:IPOToSOParameter) {
			this.VendorBillId = refSystem.isObject(args) ? (args.VendorBillId) : 0;
			this.CurrentUser = refSystem.isObject(args) ? (args.CurrentUser) : '';
			this.CarrierId = refSystem.isObject(args) ? (args.CarrierId) : 0;
			this.ProNumber = refSystem.isObject(args) ? (args.ProNumber) : '';
			this.AgencyId = refSystem.isObject(args) ? args.AgencyId : 0;
			this.AgentId = refSystem.isObject(args) ? args.AgentId : 0;
			this.CustomerId = refSystem.isObject(args) ? args.CustomerId : 0;
			this.Term = refSystem.isObject(args) ? args.Term : "";
			this.AvailableCredit = refSystem.isObject(args) ? args.AvailableCredit : "";
			this.PickupDate = refSystem.isObject(args) ? args.PickupDate : new Date();
			// ###START: US22796
			this.IsTruckLoadChecked = refSystem.isObject(args) ? args.IsTruckLoadChecked : false;
			this.CustomerName = refSystem.isObject(args) ? args.CustomerName : '';
			// ###END: US22796
		}
	}
}