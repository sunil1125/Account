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
	export class SalesOrderFinalizedNotInvoicedReport {
		Id: number;
		BOLNumber: string;
		ProNumber: string;
		FinalizedDate: Date;
		Revenue: number;
		Customer: string;
		RepName: string;
		CustomerID: number;
		SOCreatedDate: Date;
		PickupDate: Date;
        ProcessFlow: number;
        CustomerTermType: string;
		CarrierName: string;
		ProcessStatusDisplay: string;
		BillStatusDisplay: string;
		InvoiceStatusDisplay: string;
		FinalizedDateDisplay: string;
		PickupDateDisplay: string;
		SOCreatedDateDisplay: string;
		Mode: string;
		constructor(args?: ISalesOrderFinalizedNotInvoiced) {
			this.Id = refSystem.isObject(args) ? (args.Id) : 0;
			this.BOLNumber = refSystem.isObject(args) ? (args.BOLNumber) : '';
			this.ProNumber = refSystem.isObject(args) ? (args.ProNumber) : '';
			this.FinalizedDate = refSystem.isObject(args) ? (args.FinalizedDate) : new Date();
			this.PickupDate = refSystem.isObject(args) ? (args.PickupDate) : new Date();
			this.SOCreatedDate = refSystem.isObject(args) ? (args.SOCreatedDate) : new Date();
			this.Revenue = refSystem.isObject(args) ? (args.Revenue) : 0;
			this.Customer = refSystem.isObject(args) ? (args.Customer) : '';
			this.RepName = refSystem.isObject(args) ? (args.RepName) : '';
            this.ProcessFlow = refSystem.isObject(args) ? (args.ProcessFlow) : 0;
            this.CustomerTermType = refSystem.isObject(args) ? (args.CustomerTermType) : '';
            this.CarrierName = refSystem.isObject(args) ? (args.CarrierName) : '';
			this.ProcessStatusDisplay = refSystem.isObject(args) ? (args.ProcessStatusDisplay) : '';
			this.BillStatusDisplay = refSystem.isObject(args) ? (args.BillStatusDisplay) : '';
			this.InvoiceStatusDisplay = refSystem.isObject(args) ? (args.InvoiceStatusDisplay) : '';
			this.FinalizedDateDisplay = refSystem.isObject(args) ? (args.FinalizedDateDisplay) : '';
			this.PickupDateDisplay = refSystem.isObject(args) ? (args.PickupDateDisplay) : '';
			this.SOCreatedDateDisplay = refSystem.isObject(args) ? (args.SOCreatedDateDisplay) : '';
			this.Mode = refSystem.isObject(args) ? (args.Mode) : '';
			this.CustomerID = refSystem.isObject(args) ? (args.CustomerID) : 0;
		}
	}
}