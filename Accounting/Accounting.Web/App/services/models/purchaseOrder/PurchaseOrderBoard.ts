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
		By: Bhanu
		On: July 30, 2014
	  Desc: To hold Vendorbill payment details data

**#Modified:
		By:
		On:
	  Desc:
*/

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
//#endregion Import

export module Models {
	export class PurchaseOrderBoard {
		Id: number;
		VendorName: string;
		CarrierId: number;
		BillDate: Date;
		DueDate: Date;
		PRONumber: string;
		PONumber: string;
		ReferenceNumber: string;
		Amount: number;
		TotalEstimateCost: number;
		TotalRevenue: number;
		DisputedAmount: number;
		OriginZip: string;
		DestinationZip: string;
		ActualCost: number;
		ActualProfit: number;
		IsPurchaseOrder: number;
		CreatedDate: Date;
		UpdatedBy: number;
		UpdatedDate: Date;
		IsActive: boolean;
		IsReviewed: boolean;
		TotalWeight: number;
		TotalPieces: number;
		DeliveryDate: Date;
		DisputedDate: Date;
		ProcessDetails: string;
		ReferenceNo: string;
		Shipper: string;
		Consignee: string;
		EmailedDate: Date;
		BillDateDisplay: string;
		CreatedDateDisplay: string;
		EmailedDateDisplay: string;
		constructor(args?: IPurchaseOrderBoard) {
			this.Id = refSystem.isObject(args) ? args.Id : 0;
			this.VendorName = refSystem.isObject(args) ? args.VendorName : '';
			this.CarrierId = refSystem.isObject(args) ? args.CarrierId : 0;
			this.BillDate = refSystem.isObject(args) ? args.BillDate : new Date();
			this.DueDate = refSystem.isObject(args) ? args.DueDate : new Date();
			this.PRONumber = refSystem.isObject(args) ? args.PRONumber : '';
			this.PONumber = refSystem.isObject(args) ? args.PONumber : '';
			this.ReferenceNumber = refSystem.isObject(args) ? args.ReferenceNumber : '';
			this.Amount = refSystem.isObject(args) ? args.Amount : 0;
			this.TotalEstimateCost = refSystem.isObject(args) ? args.TotalEstimateCost : 0;
			this.TotalRevenue = refSystem.isObject(args) ? args.TotalRevenue : 0;;
			this.DisputedAmount = refSystem.isObject(args) ? args.DisputedAmount : 0;
			this.OriginZip = refSystem.isObject(args) ? args.OriginZip : '';
			this.DestinationZip = refSystem.isObject(args) ? args.DestinationZip : '';
			this.ActualCost = refSystem.isObject(args) ? args.ActualCost : 0;
			this.ActualProfit = refSystem.isObject(args) ? args.ActualProfit : 0;
			this.IsPurchaseOrder = refSystem.isObject(args) ? args.IsPurchaseOrder : 0;
			this.CreatedDate = refSystem.isObject(args) ? args.CreatedDate : new Date();
			this.UpdatedBy = refSystem.isObject(args) ? args.UpdatedBy : 0;
			this.UpdatedDate = refSystem.isObject(args) ? args.UpdatedDate : new Date();
			this.IsActive = refSystem.isObject(args) ? args.IsActive : false;
			this.IsReviewed = refSystem.isObject(args) ? args.IsReviewed : false;
			this.TotalWeight = refSystem.isObject(args) ? args.TotalWeight : 0;
			this.TotalPieces = refSystem.isObject(args) ? args.TotalPieces : 0;
			this.DeliveryDate = refSystem.isObject(args) ? args.DeliveryDate : new Date();
			this.DisputedDate = refSystem.isObject(args) ? args.DisputedDate : new Date();
			this.ProcessDetails = refSystem.isObject(args) ? args.ProcessDetails : '';
			this.ReferenceNo = refSystem.isObject(args) ? args.ReferenceNo : '';
			this.Shipper = refSystem.isObject(args) ? args.Shipper : '';
			this.Consignee = refSystem.isObject(args) ? args.Consignee : '';
			this.EmailedDate = refSystem.isObject(args) ? args.EmailedDate : new Date();
			this.BillDateDisplay = refSystem.isObject(args) ? args.BillDateDisplay : '';
			this.CreatedDateDisplay = refSystem.isObject(args) ? args.CreatedDateDisplay : '';
			this.EmailedDateDisplay = refSystem.isObject(args) ? args.EmailedDateDisplay : '';
		}
	}
}