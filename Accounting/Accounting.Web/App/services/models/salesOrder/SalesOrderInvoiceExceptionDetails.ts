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
	export class InvoiceExceptionDetails {
		BatchId: number;
		ExceptionMessage: string;
		InvoicedReason: string;
		ScheduledAge: number;
		UpdatedBy: string;
		ShipmentId: number;
		constructor(args?: ISalesOrderInvoiceExceptionDetails) {
			this.BatchId = refSystem.isObject(args) ? args.BatchId : 0;
			this.ExceptionMessage = refSystem.isObject(args) ? args.ExceptionMessage : '';
			this.InvoicedReason = refSystem.isObject(args) ? args.InvoicedReason : '';
			this.ScheduledAge = refSystem.isObject(args) ? args.ScheduledAge : 0;
			this.UpdatedBy = refSystem.isObject(args) ? args.UpdatedBy : '';
			this.ShipmentId = refSystem.isObject(args) ? args.ShipmentId : 0;
		}
	}
}