/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References

/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../TypeDefs/VendorBillModels.d.ts" />

//#endregion References

/**#Created:
        <By> Satish</By><On>May 29, 2014</On> <Desc>To hold Vendorbill exception data</Desc>
**#Modified:
       <By> Satish</By><On>Jun 23, 2014</On> <Desc>Changed the model according to server side model.</Desc>
*/

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
//#endregion Import

export module Models{
	export class VendorBillExceptions{
		RowNumber: number;
		VendorBillId: number;
		BOLNumber: string;
		PRONumber: string;
		CarrierName: string;
		CustomerName: string;
		SalesAgent: string;
		DeliveryDate: Date;
		PickupDate: Date;
		ShipmentTypeId: number;
		VendorBillAmount: number;
		Cost: number;
		Revenue: number;
		ProcessStatusId: number;
		InvoiceStatusId: number;
		IsPurchaseOrder: boolean;
		CarrierCode: string;
		CustomerTypeId: number;
		MasTransferDate: Date;
		BillStatus: number;
		VBException: string;
		InvoiceException: string;
		ScheduledAge: number;
		CreatedDate: Date;
		BillDate: Date;
		MasClearanceStatusId: number;
		InvoiceDate: Date;
		ProcessFlowFlag: number;
		OrderFlowFlag: number;
		MasClearanceStatusDate: Date;
		DisputedAmount: number;
		MasException: string;
		MasStatus: number;
		IsProcessed: boolean;
		IDBFlag: boolean;
		BillCreatedDateDisplay: string;
		MasClearanceStatus: string;
		CarrierType: string;
		BillStatusDisplay: string;
		constructor(args?: IVendorBillExceptions) {
			this.RowNumber = refSystem.isObject(args) ? args.RowNumber : 0;
			this.VendorBillId = refSystem.isObject(args) ? (args.VendorBillId) : 0;
			this.BOLNumber = refSystem.isObject(args) ? args.BOLNumber : '';
			this.PRONumber = refSystem.isObject(args) ? args.PRONumber : '';
			this.CarrierName = refSystem.isObject(args) ? args.CarrierName : '';
			this.CustomerName = refSystem.isObject(args) ? args.CustomerName : '';
			this.SalesAgent = refSystem.isObject(args) ? args.SalesAgent : '';
			this.DeliveryDate = refSystem.isObject(args) ? args.DeliveryDate : new Date();
			this.PickupDate = refSystem.isObject(args) ? args.PickupDate : new Date();
			this.ShipmentTypeId = refSystem.isObject(args) ? args.ShipmentTypeId : 0;
			this.VendorBillAmount = refSystem.isObject(args) ? args.VendorBillAmount : 0;
			this.Cost = refSystem.isObject(args) ? args.Cost : 0;
			this.Revenue = refSystem.isObject(args) ? args.Revenue : 0;
			this.ProcessStatusId = refSystem.isObject(args) ? args.ProcessStatusId : 0;
			this.InvoiceStatusId = refSystem.isObject(args) ? args.InvoiceStatusId : 0;
			this.IsPurchaseOrder = refSystem.isObject(args) ? args.IsPurchaseOrder : false;
			this.CarrierCode = refSystem.isObject(args) ? args.CarrierCode : '';
			this.CustomerTypeId = refSystem.isObject(args) ? args.CustomerTypeId : 0;
			this.MasTransferDate = refSystem.isObject(args) ? args.MasTransferDate : new Date();
			this.BillStatus = refSystem.isObject(args) ? args.BillStatus : 0;
			this.VBException = refSystem.isObject(args) ? args.VBException : '';
			this.InvoiceException = refSystem.isObject(args) ? args.InvoiceException : '';
			this.ScheduledAge = refSystem.isObject(args) ? args.ScheduledAge : 0;
			this.CreatedDate = refSystem.isObject(args) ? args.CreatedDate : new Date();
			this.BillDate = refSystem.isObject(args) ? args.BillDate : new Date();
			this.MasClearanceStatusId = refSystem.isObject(args) ? args.MasClearanceStatusId : 0;
			this.InvoiceDate = refSystem.isObject(args) ? args.InvoiceDate : new Date();
			this.ProcessFlowFlag = refSystem.isObject(args) ? args.ProcessFlowFlag : 0;
			this.OrderFlowFlag = refSystem.isObject(args) ? args.OrderFlowFlag : 0;
			this.MasClearanceStatusDate = refSystem.isObject(args) ? args.MasClearanceStatusDate : new Date();
			this.DisputedAmount = refSystem.isObject(args) ? args.DisputedAmount : 0;
			this.MasException = refSystem.isObject(args) ? (args.MasException) : '';
			this.MasStatus = refSystem.isObject(args) ? (args.MasStatus) : 0;
			this.IsProcessed = refSystem.isObject(args) ? args.IsProcessed : false;
			this.IDBFlag = refSystem.isObject(args) ? (args.IDBFlag) : false;
			this.BillCreatedDateDisplay = refSystem.isObject(args) ? args.BillCreatedDateDisplay : '';
			this.MasClearanceStatus = refSystem.isObject(args) ? args.MasClearanceStatus : '';
			this.CarrierType = refSystem.isObject(args) ? args.CarrierType : '';
			this.BillStatusDisplay = refSystem.isObject(args) ? args.BillStatusDisplay : '';
        }
    }
 }