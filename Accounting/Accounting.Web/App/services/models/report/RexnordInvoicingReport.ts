/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/Report.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
import refSystem = require('durandal/system');

export module Models {
	export class RexnordInvoicingReport {
		Id: number;
		BOLNumber: string;
		InvoiceDate: Date;
		BranchId: number;
		ShipmentType: number;
		Cost: number;
		Revenue: number;
		InvoiceDateDisplay: string;
		BranchName: string;
		ShipmentTypeDisplay: string;
		constructor(args?: IRexnordInvoicingReport) {
			this.Id = refSystem.isObject(args) ? (args.Id) : 0;
			this.BOLNumber = refSystem.isObject(args) ? (args.BOLNumber) : '';
			this.InvoiceDate = refSystem.isObject(args) ? (args.InvoiceDate) : new Date();
			this.BranchId = refSystem.isObject(args) ? (args.BranchId) : 0;
			this.ShipmentType = refSystem.isObject(args) ? (args.Revenue) : 0;
			this.Cost = refSystem.isObject(args) ? (args.Cost) : 0;
			this.Revenue = refSystem.isObject(args) ? (args.Revenue) : 0;
			this.InvoiceDateDisplay = refSystem.isObject(args) ? (args.InvoiceDateDisplay) : '';
			this.BranchName = refSystem.isObject(args) ? (args.BranchName) : '';
			this.ShipmentTypeDisplay = refSystem.isObject(args) ? (args.ShipmentTypeDisplay) : '';
		}
	}
}