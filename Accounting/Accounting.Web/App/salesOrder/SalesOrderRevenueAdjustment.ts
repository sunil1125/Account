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

import refSalesOrderItemModel = require('services/models/salesOrder/SalesOrderItemDetail');
import refSalesOrderItemsModel = require('salesOrder/SalesOrderItemsModel');
//#endregion
/*
** <summary>
** Sales Order History Details .
** </summary>
** <createDetails>
** <id>US8214</id> <by>Satish</by> <date>27th May, 2014</date>
** </createDetails>
** <changeHistory>
** <id>US24389</id> <by>Shreesha Adiga</by> <date>31-08-2016</date> <description>Changes related to fetching the truckload accessroials if the order is TL</description>
** </changeHistory>
*/
class SalesOrderRevenueAdjustmentModel {
	revenueAdjusted: KnockoutObservableArray<ISalesOrderItem> = ko.observableArray([]);
	shipmentItemTypes: KnockoutObservableArray<IShipmentItemType> = ko.observableArray([]);
	updateditemList: KnockoutObservableArray<ISalesOrderItem> = ko.observableArray([]);
	selectedClassType: KnockoutObservable<number> = ko.observable();
	itemName: KnockoutObservable<number> = ko.observable();
	cost: KnockoutObservable<number> = ko.observable();
	totalRev: KnockoutObservable<number> = ko.observable(0);
	totalOrgRev: KnockoutObservable<number> = ko.observable(0);
	total: number = 0;
	totalCost: KnockoutObservable<number> = ko.observable(0);
	headerMessage: KnockoutObservable<string> = ko.observable('There is a change in the cost.Please edit changed revenue column to insert new revenue');
	footermessage: KnockoutObservable<string> = ko.observable('');
	revenue: KnockoutObservable<number> = ko.observable();
	originalRevenue: KnockoutObservable<number> = ko.observable();
	isSave: KnockoutObservable<boolean> = ko.observable(false);
	title: KnockoutObservable<string> = ko.observable('');
	originalRevenueModelList: KnockoutObservableArray<refSalesOrderItemsModel.Models.SalesOrderItemsModel> = ko.observableArray([]);
	// Accepts only numeric with decimal input
	NumericInputWithDecimalPoint: INumericInput;

	//## To trigger when when 'TAB' press from reference number.
	isTabPress: (that, event) => void;

	// ##START: US24389
	isTruckloadOrder: boolean = false;
	// ##END: US24389
	//#endregion

	//#region Constructor
	constructor() {
		var self = this;

		//set the flag allowdecimal: true to accepts decimals
		self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(false) };

		////## redirects to Vendor bill order page
		self.isTabPress = (data, event) => {
			var charCode = (event.which) ? event.which : event.keyCode;

			if ((charCode === 9)) { 
				//if 'TAB' press.
			}

			return true;
		}
	}

	//#endregion

	//close popup
	public closePopup(dialogResult) {
		var self = this;
		self.isSave(false);
		dialogResult.__dialog__.close(this, dialogResult);
		return true;
	}

	//Continue  popup button
	public continuePopup(dialogResult) {
		var self = this;
		self.isSave(true);
		dialogResult.__dialog__.close(this, dialogResult);

		return true;
	}

	//#endregion

	//#region Private Methods

	//#region Load Data
	public load(bindedData: Array<ISalesOrderItem>) {

	}

	public compositionComplete(view, parent) {

	}

	public activate(refresh: IMessageBoxOption) {
		var self = this;

		// ##START: US24389
		self.isTruckloadOrder = typeof refresh.bindingObject.IsTruckloadOrder !== 'undefined' && refresh.bindingObject.IsTruckloadOrder;

		// Load all shipment types if not loaded already
		if (typeof self.shipmentItemTypes !== 'undefined') {
			_app.trigger(self.isTruckloadOrder ? "GetTruckloadAccessorials" : "GetItemsTypes",
				function (items: IShipmentItemType) {
					self.shipmentItemTypes.removeAll();
					self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
				});
		}

		var salesOrderItems = refresh.bindingObject.SalesOrderItems;
		// ##END: US24389
		var totalRev: number = 0;
		var totalOrgRevenue: number = 0;
		var totalCost: number = 0;

		if (typeof salesOrderItems !== 'undefined' && salesOrderItems != null) {
			salesOrderItems.forEach(function (item) {
				var shipmentitem = $.grep(self.shipmentItemTypes(), function (e) { return +e.ItemId === +item.ItemId; })[0];
				var revenchangedItem = new refSalesOrderItemsModel.Models.SalesOrderItemsModel(shipmentitem, () => { self.updateTotalCostAndWeight(); }, () => { }, () => { });

				totalRev += parseFloat(item.Revenue.toString().replace(/,/g, ""));
				totalCost += parseFloat(item.Cost.toString().replace(/,/g, ""))
				totalOrgRevenue += parseFloat(item.Revenue.toString().replace(/,/g, ""));
				revenchangedItem.initializeVendorBillItem(item);
				self.originalRevenueModelList.push(revenchangedItem);
			});
		}

		self.totalRev($.number(totalRev, 2));
		self.totalOrgRev($.number(totalOrgRevenue, 2));
		self.totalCost($.number(totalCost, 2));
		self.footermessage(refresh.marginPrecentageMessage);

		if (refresh.headerMessage !== '' || refresh.headerMessage !== undefined || refresh.headerMessage !== null) {
			self.headerMessage(refresh.headerMessage);
		}

		if (refresh.title !== '' || refresh.title !== undefined || refresh.title !== null) {
			self.title(refresh.title);
		}

		return true;
	}

	public updateTotalCostAndWeight() {
		var self = this;
		self.total = 0;
		var totalCost = 0;
		self.originalRevenueModelList().forEach(function (item) {
			self.total = self.total + parseFloat(item.rev().toString().replace(/,/g, ""));
		});
		self.totalOrgRev($.number(self.total, 2));
	}
	//** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
	public attached() {
		_app.trigger('viewAttached');
	}
}
 return SalesOrderRevenueAdjustmentModel