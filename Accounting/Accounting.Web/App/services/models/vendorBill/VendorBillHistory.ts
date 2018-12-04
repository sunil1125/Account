/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />

/* File Created: July 11, 2014
** Created By: Bhanu pratap
*/

export module Models {
	export class VendorBillHistory {
		vendorBillId: number;
		HistoryDates:Array<string>;
		OldItems:Array<IVendorBillHistoryItems>;
		NewItems:Array<IVendorBillHistoryItems>;

		constructor(args?: IVendorBillHistory) {
			if (args) {
				this.vendorBillId = args.VendorBillId;
				this.HistoryDates = args.HeaderHistoryDates;
				this.OldItems = args.OldNewHistoryItems;
				this.NewItems = args.NewHistoryItems;
			}
		}
	}
}