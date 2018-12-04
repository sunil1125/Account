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

/* File Created: Aug 9, 2014
** Created By: Bhanu
*/
/*
** <changeHistory>
** <id>US25349</id> <by>Vasanthakumar</by> <date>27-10-2016</date> <description>Acct: Edit TL Sub-SO Functionality</description>
** </changeHistory>
*/
export module Model {
	export class SalesOrderContainer {
		SalesOrderDetail: ISalesOrderDetail;
		SalesOrderAddressDetails: Array<ISalesOrderAddress>;
		SalesOrderItemDetails: Array<ISalesOrderItem>;
		SalesOrderNoteDetails: Array<ISalesOrderNotes>;
		SalesOrderFinancialDetailsBySalesOrderId: ISalesOrderFinancialDetails;
		SalesOrderShipmentProfitSummarys: ISalesOrderShipmentProfitSummary;
		SalesOrderOriginalSODetails: ISalesOrderOriginalSODetails;
		CustomersBSPlcInfo: ICustomersBSPlcInfo;
		MultilegCarrierHubAddress: ISalesOrderTerminalAddress;
		MultilegCarrierDetails: ISalesOrderMultilegCarrierDetail;
		SalesOrderReQuoteReviewDetails: ISalesOrderRequoteReviewDetail;
		SalesOrderReQuoteReasons: Array<ISalesOrderShipmentRequoteReason>;
		SalesOrderNegativeMargins: ISalesOrderNegativeMargin;
		SuborderCount: number;
		MakeSubOrder: boolean;
		IsCanceledOrder: boolean;
		IsAOrder: boolean;
		IsSuborder: boolean;
		CanEnterZeroRevenue: boolean;
		PreviousValues: any;
		FinalProfitForScheduleInvoice: number;
		GrossProfitForScheduleInvoice: number;
		AllowNeagtiveMargin: boolean;
		CostDifferenceForScheduleInvoice: number;
		EstimatedRevenue: number;
		//// ###START: US25349
		IsTruckLoadSuborder: boolean;
		//// ###END: US25349
		constructor(args?: ISalesOrderContainer) {
			if (args) {
				this.SalesOrderDetail = args.SalesOrderDetail;
				this.SalesOrderAddressDetails = args.SalesOrderAddressDetails;
				this.SalesOrderItemDetails = args.SalesOrderItemDetails;
				this.SalesOrderNoteDetails = args.SalesOrderNoteDetails;
				this.SalesOrderFinancialDetailsBySalesOrderId = args.SalesOrderFinancialDetailsBySalesOrderId;
				this.SalesOrderShipmentProfitSummarys = args.SalesOrderShipmentProfitSummarys;
				this.SalesOrderOriginalSODetails = args.SalesOrderOriginalSODetails;
				this.CustomersBSPlcInfo = args.CustomersBSPlcInfo;
				this.SalesOrderReQuoteReviewDetails = args.SalesOrderReQuoteReviewDetails;
				this.SalesOrderNegativeMargins = args.SalesOrderNegativeMargins;
				this.SalesOrderReQuoteReasons = args.SalesOrderReQuoteReasons
				this.MultilegCarrierHubAddress = args.MultilegCarrierHubAddress;
				this.MultilegCarrierDetails = args.MultilegCarrierDetails;
				this.SuborderCount = args.SuborderCount;
				this.MakeSubOrder = args.MakeSubOrder;
				this.IsCanceledOrder = args.IsCanceledOrder;
				this.IsAOrder = args.IsAOrder;
				this.IsSuborder = args.IsSuborder;
				this.CanEnterZeroRevenue = args.CanEnterZeroRevenue;
				this.GrossProfitForScheduleInvoice = args.GrossProfitForScheduleInvoice;
				this.FinalProfitForScheduleInvoice = args.FinalProfitForScheduleInvoice;
				this.AllowNeagtiveMargin = args.AllowNeagtiveMargin;
				this.CostDifferenceForScheduleInvoice = args.CostDifferenceForScheduleInvoice;
				this.EstimatedRevenue = args.EstimatedRevenue;
				//// ###START: US25349
				this.IsTruckLoadSuborder = args.IsTruckLoadSuborder;
				//// ###END: US25349
			}
		}
	}
}