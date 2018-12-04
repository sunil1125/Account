/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../services/models/TypeDefs/VendorBillModels.d.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import _reportViewer = require('../templates/reportViewerControlV2');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refEnums = require('services/models/common/Enums');
//#endregion
/*
** <summary>
**Sales Order MAS ViewModel.
** </summary>
** <createDetails>
** <id>US21133</id> <by>Baldev Singh Thakur</by> <date>18-04-2016</date>
** </createDetails>}
** <changeHistory>
** </changeHistory>
*/
export class SalesOrderMasDetailsViewModel{
	//#region Members

	salesOrderMasAPList: KnockoutObservableArray<SalesOrderMasAPModel> = ko.observableArray([]);

	totalInvoiceAmount: KnockoutObservable<string> = ko.observable();
	totalPaymentAmount: KnockoutObservable<string> = ko.observable();
	gridHeader: KnockoutObservable<string> = ko.observable('');
	totalRow: KnockoutObservable<string> = ko.observable('');

	// Initialization of the grid.
	public initializeMasDetails(data: any, salesOrderId: number) 
	{
		var self = this;
		var totalInvoiceAmount: number = 0.0,
			totalPaymentAmount: number = 0.0;
		if (self.salesOrderMasAPList != null)
			self.salesOrderMasAPList.removeAll();

		if (data) {
			
			for (var i = 0; i < data.SalesOrderMasDetailsForAP.length; i++) {
				var salesOrderMasAP = new SalesOrderMasAPModel(function () { self.updateTotalCostAndWeight(); });
				var invAmountWithoutComma = data.SalesOrderMasDetailsForAP[i].InvoiceAmount.toString();
				var check = invAmountWithoutComma.indexOf(",");
				if (check === -1) {
					totalInvoiceAmount += parseFloat(data.SalesOrderMasDetailsForAP[i].InvoiceAmount.toString());
				} else {
					//For removing comma before addition because parseFloat is not taking digit after comma at adding time
					totalInvoiceAmount += parseFloat(invAmountWithoutComma.replace(/,/g, ""));
				}

				var payAmountWithoutComma = data.SalesOrderMasDetailsForAP[i].PaymentAmount.toString();
				var check = payAmountWithoutComma.indexOf(",");
				if (check === -1) {
					totalPaymentAmount += parseFloat(data.SalesOrderMasDetailsForAP[i].PaymentAmount.toString());
				} else {
					//For removing comma before addition because parseFloat is not taking digit after comma at adding time
					totalPaymentAmount += parseFloat(payAmountWithoutComma.replace(/,/g, ""));
				}

				salesOrderMasAP.initializeSalesOrderMasAPModel(data.SalesOrderMasDetailsForAP[i])

				self.salesOrderMasAPList.push(salesOrderMasAP);
			}

			var salesOrderMasApTotal = new SalesOrderMasAPModel(function () { self.updateTotalCostAndWeight(); });

			salesOrderMasApTotal.initializeSalesOrderMasAPTotal(totalInvoiceAmount, totalPaymentAmount);
			self.salesOrderMasAPList.push(salesOrderMasApTotal);
			
		}
	}

	public beforeBind() {
		var self = this;

	}

	public compositionComplete() {
		var self = this;
	}

	private updateTotalCostAndWeight() {
		var self = this;

		var totalInvoiceAmount: number = 0.0,
			totalPaymentAmount: number = 0.0;

		self.salesOrderMasAPList().forEach(function (item) {
			if (item.InvoiceAmount()) {
				var costWithoutComma = item.InvoiceAmount().toString();
				var check = costWithoutComma.indexOf(",");
				if (check === -1) {
					totalInvoiceAmount += parseFloat(item.InvoiceAmount().toString());
				} else {
					//For removing comma before addition because parseFloat is not taking digit after comma at adding time
					totalInvoiceAmount += parseFloat(costWithoutComma.replace(/,/g, ""));
				}
			}

			if (item.PaymentAmount()) {
				var costWithoutComma = item.PaymentAmount().toString();
				var check = costWithoutComma.indexOf(",");
				if (check === -1) {
					totalPaymentAmount += parseFloat(item.PaymentAmount().toString());
				} else {
					//For removing comma before addition because parseFloat is not taking digit after comma at adding time
					totalPaymentAmount += parseFloat(costWithoutComma.replace(/,/g, ""));
				}
			}
		});

		self.totalPaymentAmount($.number(totalPaymentAmount.toString(), 2));
		self.totalInvoiceAmount($.number(totalInvoiceAmount.toString(), 2));
	}
}

export class SalesOrderMasAPModel{
	BOLNumber: KnockoutObservable<string> = ko.observable();
	VendorInvoiceNumber: KnockoutObservable<string> = ko.observable();
	Vendor: KnockoutObservable<string> = ko.observable();
	FactorVendor: KnockoutObservable<string> = ko.observable();
	InvoiceDateDisplay: KnockoutObservable<string> = ko.observable();
	Status: KnockoutObservable<string> = ko.observable();
	InvoiceAmount: KnockoutObservable<any> = ko.observable();
	PaymentNumber: KnockoutObservable<string> = ko.observable();
	PaymentDateDisplay: KnockoutObservable<string> = ko.observable();
	PaymentAmount: KnockoutObservable<any> = ko.observable();
	totalRow: KnockoutObservable<string> = ko.observable('');

	constructor(costOrWeightChanged: () => any) {
		var self = this;
		return self;
	}

	// get the item view model
	public initializeSalesOrderMasAPModel(item: ISalesOrderMasDetails) {
		var self = this;
		if (item != null) {
			self.BOLNumber(item.BOLNumber);
			self.VendorInvoiceNumber(item.VendorInvoiceNumber);
			self.Vendor(item.Vendor);
			self.FactorVendor(item.FactorVendor);
			self.InvoiceDateDisplay(item.InvoiceDateDisplay);
			self.Status(item.Status);
			self.InvoiceAmount($.number((item.InvoiceAmount), 2));
			self.PaymentNumber(item.PaymentNumber);
			self.PaymentDateDisplay(item.PaymentDateDisplay);
			self.PaymentAmount($.number((item.PaymentAmount), 2));
			self.totalRow('');
		}
	}

	public initializeSalesOrderMasAPTotal(totalInvoiceAmount: number, totalPaymentAmount: number) {
		var self = this;

		self.VendorInvoiceNumber('');
		self.Vendor('');
		self.FactorVendor('');
		self.InvoiceDateDisplay('');
		self.Status('');
		self.InvoiceAmount($.number((totalInvoiceAmount), 2));
		self.PaymentNumber('');
		self.PaymentDateDisplay('');
		self.PaymentAmount($.number((totalPaymentAmount), 2));
		self.BOLNumber('Total');
		self.totalRow('rebillTotal');
	}
}