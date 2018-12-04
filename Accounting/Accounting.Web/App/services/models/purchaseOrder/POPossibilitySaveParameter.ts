/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../TypeDefs/PurchaseOrderModel.d.ts" />

import refSystem = require('durandal/system');

export module Models {
	export class POPossibilitySaveParameter {
		VendorBillId: number;
		SalesOrderId: Array<any>;
		constructor(args?: IPOPossibilitySaveParameter) {
			if (args) {
				this.VendorBillId = args.VendorBillId;
				this.SalesOrderId.push(args.SalesOrderId);
			}
		}
	}
}