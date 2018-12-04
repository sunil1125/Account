/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../TypeDefs/TransactionSearchModel.d.ts" />

import refSystem = require('durandal/system');

/* File Created: Sep 12, 2014
** Created By: Satish
*/

export module Model {
	export class TransactionSearchResponse {
		SalesOrderResponse: Array<ITransactionSearchSalesOrderResponse>;
		VendorBillOrPurchaseOrderResponse: Array<ITransactionSearchVendorBillOrPurchaseOrderResponse>;
		InvoiceResponse: Array<ITransactionSearchInvoicesResponse>;
		TruckloadQuoteResponse: Array<ITransactionSearchTruckloadQuoteResponse>;
		constructor(args?: ITransactionSearchResponse) {
			this.SalesOrderResponse = refSystem.isObject(args) ? args.SalesOrderResponse : null;
			this.VendorBillOrPurchaseOrderResponse = refSystem.isObject(args) ? args.VendorBillOrPurchaseOrderResponse : null;
			this.InvoiceResponse = refSystem.isObject(args) ? args.InvoicesResponse : null;
			this.TruckloadQuoteResponse = refSystem.isObject(args) ? args.TruckloadQuoteResponse : null;
		}
	}
}