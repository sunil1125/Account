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
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import _reportViewer = require('../templates/reportViewerControlV2');
import refSalesOrderAuditedBillItemsModel = require('salesOrder/SalesOrderAuditedBillItemsModel');
//#endregion
/*
** <summary>
** Sales Order Audited Bill Items View Model.
** </summary>
** <createDetails>
** <id>US13235</id> <by>Sankesh</by> <date>27th Nov, 2014</date>
** </createDetails>
** <changeHistory>
** <id>DE22259</id> <by>Shreesha Adiga</by> <date>22-03-2016</date><description>Select item based on itemid and accessorial id</description>
** <id>US21290</id> <by>Shreesha Adiga</by> <date>23-03-2016</date><description>If item selected based on itemid and accessorialId is undefined, then select based only on itemId</description>
** </changeHistory>
*/
export class SalesOrderAuditedBillItemViewModel {
	//#region Members
	salesOrderOriginalItemsList: KnockoutObservableArray<refSalesOrderAuditedBillItemsModel.Models.SalesOrderAuditedBillItemsModel> = ko.observableArray([]);
	salesOrderAdjustedItemsList: KnockoutObservableArray<refSalesOrderAuditedBillItemsModel.Models.SalesOrderAuditedBillItemsModel> = ko.observableArray([]);
	classTypes: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	packageTypes: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	shipmentItemTypes: KnockoutObservableArray<IShipmentItemType> = ko.observableArray([]);
	orginalItemList: KnockoutObservableArray<IVendorBillItem> = ko.observableArray([]);
	itemCliked: () => boolean;
	isSelect: KnockoutObservable<boolean> = ko.observable(false);

	selectedorginalItemList: KnockoutObservableArray<ISalesOrderItem> = ko.observableArray([]);

	gridHeader: KnockoutObservable<string> = ko.observable('');
	name: KnockoutObservable<string> = ko.observable('Select All');
	selected: KnockoutObservable<boolean> = ko.observable(false);
	html: KnockoutObservable<string> = ko.observable('');
	salesOrderItemAmount: KnockoutObservable<string> = ko.observable();
	salesOrderRevenue: KnockoutObservable<string> = ko.observable();
	salesOrderItemWeight: KnockoutObservable<number> = ko.observable();
	salesOrderItemPieces: KnockoutObservable<number> = ko.observable();
	salesOrderBsCost: KnockoutObservable<number> = ko.observable();
    isBSCost: KnockoutObservable<boolean> = ko.observable(false);
    isSaveEnable: KnockoutObservable<boolean> = ko.observable(true);
	//#endregion

	//#region Constructor
	constructor() {
		var self = this;

		self.beforeBind();
	}

	//#endregion}

	//#region Internal public Methods
	// Gets the all needed values like ENUMs
	public beforeBind() {
		var self = this;

		// Load all classes if not loaded already
		var classTypesLength: number = self.classTypes().length;
		if (!(classTypesLength)) {
			_app.trigger("GetClassTypesAndPackageTypes", function (data) {
				if (data) {
					self.classTypes.removeAll();
					self.classTypes.push.apply(self.classTypes, data['FakTypeEnums']);

					self.packageTypes.removeAll();
					self.packageTypes.push.apply(self.packageTypes, data['PackageTypeEnums']);
				}
			});
		}

		// Load all shipment types if not loaded already
		var shipmentItemTypesLength: number = self.shipmentItemTypes().length;
		if (!(shipmentItemTypesLength)) {
			_app.trigger("GetItemsTypes", function (items: IShipmentItemType) {
				self.shipmentItemTypes.removeAll();
				self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
			});
		}
	}

	// to load the sales order item details
	public initializeSalesOrderAuditedBillItemDetails(items: Array<IVendorBillItem>, enable: boolean) {
		var self = this;
		var totalCost: number = 0.0,
			totalweight: number = 0.0,
			totalPices: number = 0.0,
			totalRevenue: number = 0.0,
			totalPlcCost = 0.00;

		self.orginalItemList(items);
		if (self.salesOrderOriginalItemsList != null)
			self.salesOrderOriginalItemsList.removeAll();
        self.isSaveEnable(enable);
		if (items != null) {
			for (var i = 0; i < items.length; i++) {
				//##START: DE22259
				var item = $.grep(self.shipmentItemTypes(), function (e) {
					return e.ItemId === items[i].ItemId.toString() && (e.AccessorialId == null || items[i].AccessorialId == 0 || e.AccessorialId == items[i].AccessorialId);
				})[0];

				//##END: DE22259

				// ##START: US21290
				if (typeof item === "undefined" || item == null) {
					item = $.grep(self.shipmentItemTypes(), function (e) {
						return e.ItemId === items[i].ItemId.toString();
					})[0];
				}

				// ##END: US21290

				var salesOrderItem = new refSalesOrderAuditedBillItemsModel.Models.SalesOrderAuditedBillItemsModel(item, function () { self.updateCheck(); });
				if (self.selected()) {
					items[i].isChecked = true;
				}
				else {
					items[i].isChecked = false;
				}
				salesOrderItem.initializeSalesOrderAuditedBillItem(items[i], items.length);
				totalCost += items[i].Cost;
				totalweight += items[i].Weight;
				totalPices += items[i].PieceCount;
				self.salesOrderOriginalItemsList.push(salesOrderItem);
			}
		}

		self.salesOrderRevenue($.number(totalRevenue.toString(), 2));
		self.salesOrderItemAmount($.number(totalCost.toString(), 2));
		self.salesOrderItemPieces(totalPices);
		self.salesOrderItemWeight(totalweight);
		self.salesOrderBsCost(totalPlcCost);
	}

	//#endregion

	//#region Internal private methods
	selectOption() {
		var self = this;
		if (!self.selected()) {
			self.selected(true);
			self.html('<i class="icon-ok icon-white active"></i>' + self.name());
			self.salesOrderOriginalItemsList().forEach(function (item) {
				item.isCheck(true);
			});
		} else {
			self.selected(false);
			self.salesOrderOriginalItemsList().forEach(function (item) {
				item.isCheck(false);
			});
		}
	}

	private updateCheck() {
		var self = this;
		var count = $.grep(self.salesOrderOriginalItemsList(), function (e) { return e.isCheck(); });
		if (count.length == self.salesOrderOriginalItemsList().length) {
			self.selected(true);
			self.html('<i class="icon-ok icon-white active"></i>' + self.name());
		}
		else {
			self.selected(false);
		}
	}

	public cleanup() {
		var self = this;

		self.salesOrderOriginalItemsList().forEach((item) => {
			item.cleanUp();
		});

		self.salesOrderAdjustedItemsList().forEach((item) => {
			item.cleanUp();
		});

		self.salesOrderOriginalItemsList.removeAll();
		self.salesOrderAdjustedItemsList.removeAll();
		self.classTypes.removeAll();
		self.packageTypes.removeAll();
		self.shipmentItemTypes.removeAll();
		self.orginalItemList.removeAll();
		self.selectedorginalItemList.removeAll();

		for (var property in self) {
			delete self[property];
		}

		delete self;
		//self.isSelect.dispose();
		//self.gridHeader.dispose();
		//self.name.dispose();
		//self.selected.dispose();
		//self.html.dispose();
		//self.salesOrderItemAmount.dispose();
		//self.salesOrderRevenue.dispose();
		//self.salesOrderItemWeight.dispose();
		//self.salesOrderItemPieces.dispose();
		//self.salesOrderBsCost.dispose();
		//self.isBSCost.dispose();
		//self.isSaveEnable.dispose();

		//self.isSelect = null;
		//self.gridHeader = null;
		//self.name = null;
		//self.selected = null;
		//self.html = null;
		//self.salesOrderItemAmount = null;
		//self.salesOrderRevenue = null;
		//self.salesOrderItemWeight = null;
		//self.salesOrderItemPieces = null;
		//self.salesOrderBsCost = null;
		//self.isBSCost = null;
		//self.isSaveEnable = null;
		//self.itemCliked = null;

		//self = null;
	}

	//#endregion
}