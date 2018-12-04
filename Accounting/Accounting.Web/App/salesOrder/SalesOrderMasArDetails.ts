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
export class SalesOrderMasArDetailsViewModel {
	//#region Members

	salesOrderMasARList: KnockoutObservableArray<SalesOrderMasARModel> = ko.observableArray([]);

	totalInvoiceAmount: KnockoutObservable<string> = ko.observable();
	totalPaymentAmount: KnockoutObservable<string> = ko.observable();
	gridHeader: KnockoutObservable<string> = ko.observable('');
	totalRow: KnockoutObservable<string> = ko.observable('');

	// Initialization of the grid.
	public initializeMasDetails(data: any, salesOrderId: number) {
		var self = this;
		var totalInvoiceAmount: number = 0.0,
			totalAppliedAmount: number = 0.0;
		if (self.salesOrderMasARList != null)
			self.salesOrderMasARList.removeAll();

		if (data) {

			for (var i = 0; i < data.SalesOrderMasDetailsForAR.length; i++) {
				var salesOrderMasAP = new SalesOrderMasARModel(function () { self.updateTotalCostAndWeight(); });
				var invAmountWithoutComma = data.SalesOrderMasDetailsForAR[i].InvoicedAmount.toString();
				var check = invAmountWithoutComma.indexOf(",");
				if (check === -1) {
					totalInvoiceAmount += parseFloat(data.SalesOrderMasDetailsForAR[i].InvoicedAmount.toString());
				} else {
					//For removing comma before addition because parseFloat is not taking digit after comma at adding time
					totalInvoiceAmount += parseFloat(invAmountWithoutComma.replace(/,/g, ""));
				}

				var payAmountWithoutComma = data.SalesOrderMasDetailsForAR[i].AppliedAmount.toString();
				var check = payAmountWithoutComma.indexOf(",");
				if (check === -1) {
					totalAppliedAmount += parseFloat(data.SalesOrderMasDetailsForAR[i].AppliedAmount.toString());
				} else {
					//For removing comma before addition because parseFloat is not taking digit after comma at adding time
					totalAppliedAmount += parseFloat(payAmountWithoutComma.replace(/,/g, ""));
				}

				salesOrderMasAP.initializeSalesOrderMasARModel(data.SalesOrderMasDetailsForAR[i])

				self.salesOrderMasARList.push(salesOrderMasAP);
			}

			var salesOrderMasApTotal = new SalesOrderMasARModel(function () { self.updateTotalCostAndWeight(); });

			salesOrderMasApTotal.initializeSalesOrderMasARTotal(totalInvoiceAmount, totalAppliedAmount);
			self.salesOrderMasARList.push(salesOrderMasApTotal);

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

		self.salesOrderMasARList().forEach(function (item) {
			if (item.InvoicedAmount()) {
				var costWithoutComma = item.InvoicedAmount().toString();
				var check = costWithoutComma.indexOf(",");
				if (check === -1) {
					totalInvoiceAmount += parseFloat(item.InvoicedAmount().toString());
				} else {
					//For removing comma before addition because parseFloat is not taking digit after comma at adding time
					totalInvoiceAmount += parseFloat(costWithoutComma.replace(/,/g, ""));
				}
			}

			if (item.AppliedAmount()) {
				var costWithoutComma = item.AppliedAmount().toString();
				var check = costWithoutComma.indexOf(",");
				if (check === -1) {
					totalPaymentAmount += parseFloat(item.AppliedAmount().toString());
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

export class SalesOrderMasARModel {
	BOLNumber: KnockoutObservable<string> = ko.observable();
	SalesOrderNumber: KnockoutObservable<string> = ko.observable();
	ApplyFrom: KnockoutObservable<string> = ko.observable();
	InvoicedDateDisplay: KnockoutObservable<string> = ko.observable();
	InvoicedAmount: KnockoutObservable<any> = ko.observable();
	PaymentMemoDateDisplay: KnockoutObservable<string> = ko.observable();
	AppliedToInvoice: KnockoutObservable<string> = ko.observable();
	AppliedAmount: KnockoutObservable<any> = ko.observable();
	PostedDisplay: KnockoutObservable<string> = ko.observable();
	totalRow: KnockoutObservable<string> = ko.observable('');

	constructor(costOrWeightChanged: () => any) {
		var self = this;
		return self;
	}

	// get the item view model
	public initializeSalesOrderMasARModel(item: ISalesOrderMasDetails) {
		var self = this;
		if (item != null) {
			self.BOLNumber(item.BOLNumber);
			self.SalesOrderNumber(item.SalesOrderNumber);
			self.ApplyFrom(item.ApplyFrom);
			self.InvoicedDateDisplay(item.InvoicedDateDisplay);
			self.AppliedToInvoice(item.AppliedToInvoice);
			self.PostedDisplay(item.PostedDisplay);
			self.InvoicedAmount($.number((item.InvoicedAmount), 2));
			self.PaymentMemoDateDisplay(item.PaymentMemoDateDisplay);
			self.AppliedAmount($.number((item.AppliedAmount), 2));
			self.totalRow('');
		}
	}

	public initializeSalesOrderMasARTotal(totalInvoiceAmount: number, totalPaymentAmount: number) {
		var self = this;

		self.SalesOrderNumber('');
		self.ApplyFrom('');
		self.InvoicedDateDisplay('');
		self.AppliedToInvoice('');
		self.PostedDisplay('');
		self.InvoicedAmount($.number((totalInvoiceAmount), 2));
		self.PaymentMemoDateDisplay('');
		self.AppliedAmount($.number((totalPaymentAmount), 2));
		self.BOLNumber('Total');
		self.totalRow('rebillTotal');
	}
}