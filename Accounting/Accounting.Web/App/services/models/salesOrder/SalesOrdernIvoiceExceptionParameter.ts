/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />

import refSystem = require('durandal/system');

/* File Created: Nov 10, 2014
** Created By: Satish
*/
export module Model {
	export class SalesOrderInvoiceExceptionParameter {
		BatchId: number;
		ShipmentId: number;
		BolNumber: string;
		UpdateDateTime: number;
		UserId: number;
		UserName: string;
		InvoicedReason: string;
		constructor(args?: ISalesOrderInvoiceExceptionParameter) {
			this.BatchId = refSystem.isObject(args) ? args.BatchId : 0;
			this.ShipmentId = refSystem.isObject(args) ? args.ShipmentId : 0;
			this.BolNumber = refSystem.isObject(args) ? args.BolNumber : '';
			this.UpdateDateTime = refSystem.isObject(args) ? args.UpdateDateTime : 0;
			this.InvoicedReason = refSystem.isObject(args) ? args.InvoicedReason : '';
			this.UserId = refSystem.isObject(args) ? args.UserId : 0;
			this.UserName = refSystem.isObject(args) ? args.UserName : '';
		}
	}
}