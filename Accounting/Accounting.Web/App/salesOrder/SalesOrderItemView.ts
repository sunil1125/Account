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
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refMapLocation = require('services/models/common/MapLocation');
import refEnums = require('services/models/common/Enums');
import refValidations = require('services/validations/Validations');
import refCommon = require('services/client/CommonClient');
import refSalesOrderItemModel = require('salesOrder/SalesOrderItemsModel');
import refSalesOrderItemDetailModel = require('services/models/salesOrder/SalesOrderItemDetail');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refSalesOrderReBillItemsModel = require('salesOrder/SalesOrderRebillItemsModel');
import refSalesOrderItemDetail = require('services/models/salesOrder/SalesOrderItemDetail');
//#endregion

/*
** <summary>
** Sales Order Item View Model.
** </summary>
** <createDetails>
** <id>US12101</id> <by>Chandan</by> <date>27th Aug, 2014</date>
** </createDetails>
** <changeHistory>
** <id>US21290</id> <by>Shreesha Adiga</by> <date>17-03-2016</date><description>Select item based on itemid and accessorial id</description>
** <id>US21290</id> <by>Shreesha Adiga</by> <date>23-03-2016</date><description>If item selected based on itemid and accessorialId is undefined, then select based only on itemId</description>
** <id>US22366</id> <by>Baldev Singh Thakur</by> <date>24-05-2016</date> <description>on Copy Cost Revenue Package Type and Pieces wasn't being copied.</description>
** <id>US22365</id> <by>Baldev Singh Thakur</by> <date>25-05-2016</date> <description>Acct: Update Copy Cost Revenue Button Functionality.</description>
** <id>DE23373</id> <by>Baldev Singh Thakur</by> <date>25-06-2016</date> <description>Fix Select All Issue for Copy Items.</description>
** <id>DE23042</id> <by>Baldev Singh Thakur</by> <date>27-06-2016</date> <description>Save button gets enabled after navigating back from other tab.</description>
** <id>DE23386</id> <by>Baldev Singh Thakur</by> <date>28-06-2016</date> <description>Commented the line which was adding an extra line item and moved the counter initiaization out of the loop.</description>
** <id>US24389</id> <by>Shreesha Adiga</by> <date>31-08-2016</date> <description>Changes related to populating TL accessorials for TL orders</description>
** <id>US24671</id> <by>Shreesha Adiga</by> <date>12-09-2016</date> <description>Validate multiple Base Rate items for TL orders; Skip the validation for Invoiced orders</description>
** <id>US24473</id> <by>Shreesha Adiga</by> <date>16-09-2016</date> <description>Populate carrier type in items</description>
** <id>US24975</id> <by>Shreesha Adiga</by> <date>28-09-2016</date> <description>Handling multiple Base Rate items for TL orders; Removed the old code for this scenario</description>
** <id>DE24404</id> <by>Shreesha Adiga</by> <date>06-10-2016</date> <description>For TL orders with ItemIds 44 and 16, get the SelectedItem using description too</description>
** <id>US25153</id> <by>Shreesha Adiga</by> <date>20-10-2016</date><description>Changes realted to Credit Adjustment (Items Not Integrated With Mas)</description>
** <id>DE25602</id> <by>Vasanthakumar</by> <date>18-01-2017</date><description>If item id and accessorial id is zero then Credit adjustment line item is inserted in the order</description>
** </changeHistory>
*/

export class SalesOrderItemViewModel {
	//#region Members
	salesOrderItemsList: KnockoutObservableArray<refSalesOrderItemModel.Models.SalesOrderItemsModel> = ko.observableArray([]);
	classTypes: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	packageTypes: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	shipmentItemTypes: KnockoutObservableArray<IShipmentItemType> = ko.observableArray([]);
	isAllCheckedForDelete: KnockoutObservable<boolean> = ko.observable(false);
	salesOrderItemAmount: KnockoutObservable<string> = ko.observable();
	salesOrderRevenue: KnockoutObservable<string> = ko.observable();
	salesOrderItemWeight: KnockoutObservable<number> = ko.observable();
	salesOrderItemPieces: KnockoutObservable<number> = ko.observable();
	salesOrderBsCost: KnockoutObservable<number> = ko.observable();
	isBSCost: KnockoutObservable<boolean> = ko.observable(false);
	isBSCostEditable: KnockoutObservable<boolean> = ko.observable(false);
	costHeader: KnockoutObservable<string> = ko.observable("Cost");
	salesOrderId: KnockoutObservable<string> = ko.observable('');
	estimatedProfitPerc: KnockoutObservable<number> = ko.observable($.number(0, 2));
	finalProfitPerc: KnockoutObservable<number> = ko.observable($.number(0, 2));
	plcorBSCost: KnockoutObservable<number> = ko.observable(0);
	plcorBSRevenue: KnockoutObservable<number> = ko.observable(0);
	customerTypeOf: KnockoutObservable<number> = ko.observable(0);
	isBillingStation: KnockoutObservable<boolean> = ko.observable(false);
	gtzMargin: KnockoutObservable<number> = ko.observable($.number(0, 2));
	feeStructure: KnockoutObservable<number> = ko.observable(0);
	plcMargin: KnockoutObservable<number> = ko.observable(0);
	gtMinMargin: KnockoutObservable<number> = ko.observable(0);
	isCallForEdit: KnockoutObservable<boolean> = ko.observable(false);
	CanEditItemsDescription: KnockoutObservable<boolean> = ko.observable(false);
	isSubOrder: KnockoutObservable<boolean> = ko.observable(false);
	originalTotalRevenue: KnockoutObservable<number> = ko.observable(0);
	originalTotalBSCost: KnockoutObservable<number> = ko.observable(0);
	originalTotalCost: KnockoutObservable<number> = ko.observable(0);
	copySalesOrderItemsList: KnockoutObservableArray<ISalesOrderItem> = ko.observableArray([]);
	adjustedOrderItemList: KnockoutObservableArray<ISalesOrderItem> = ko.observableArray([]);
	copyAdjustedOrderItemList: KnockoutObservableArray<ISalesOrderItem> = ko.observableArray([]);
	matchrowArray: KnockoutObservableArray<ISalesOrderItem> = ko.observableArray([]);
	calculateRevenue: KnockoutObservable<boolean> = ko.observable(false);
	isVbVisible: KnockoutObservable<boolean> = ko.observable(false);
	shipmentId: KnockoutObservable<number> = ko.observable(0);
	listProgress: KnockoutObservable<boolean> = ko.observable(false);
	returnValue: KnockoutObservable<boolean> = ko.observable(false);
	isSaveEnable: KnockoutObservable<boolean> = ko.observable(true);

	canDelete: KnockoutComputed<boolean>;
	descColCssClass: KnockoutComputed<string>;
	descTextValidCssClass: KnockoutComputed<string>;
	descTextNotValidCssClass: KnockoutComputed<string>;

	adjustedOrderItem: refSalesOrderItemDetail.Models.SalesOrderItemDetail;
	IsValidationShown: boolean = false;
	isNotAtLoadingTime: boolean = false;
	isNotAtLoadingTimeForCopyCostRevenue: boolean = false;

	error: KnockoutValidationErrors;
	NumericInputWithDecimalPoint: INumericInput;

	selectedlineitem: refSalesOrderItemModel.Models.SalesOrderItemsModel;
	salesOrderClient: refSalesOrderClient.SalesOrderClient = new refSalesOrderClient.SalesOrderClient();
	commonUtils: CommonStatic = new Utils.Common();

	onAdd: () => void;
	markAllForDelete: () => boolean;
	IsNumber: (that, event) => void;
	isCurrency: (that, event) => void;
	itemCliked: () => boolean;
	costOrWeightChanged: (totalCost: number, totalWeight: number, totalPices: number, totalRevenue: number, totalBSCost?: number) => any;
	removeLineItem: (lineItem: refSalesOrderItemModel.Models.SalesOrderItemsModel) => void;
	onChangesMade: (dirty: boolean) => any;
	onChangesMadeInItem: (dirty: boolean) => any;
	deleteSalesOrderItemsList: () => any;
	checkMsgDisplay: boolean = true;
	checkMsgClick: () => any;
	checkMsgHide: () => any;
	keyListenerCallback: () => any;
	isTabPress: (that, event) => void;
	hazardousChanged: (salesOrderItem: Array<any>) => any;
	updateHazardousValue: () => any;
	updateAuditedBill: (items: Array<ISalesOrderItem>, salesOrderId: number, estimatedProfitPer: number, finalProfitPer: number, customerTypeOf: number, feeStructure: number, gtMinMargin: number, isBillingStation: boolean, gtzMargin: number, plcMargin: number) => any;

	// ##START: US24389
	carrierType: KnockoutObservable<number> = ko.observable(0);
	// ##END: US24389

	// ###START: DE20342
	isLoaded: boolean = false;
	// ###END: DE20342

	// ##START: US24671
	invoiceStatus: number = 0;
	// ##END: US24671

	// ##START: US25153
	itemsNotIntegratedWithMas: IShipmentItemType[] = [];
	// ##END: US25153
	//#endregion

	//#region Constructor
	constructor(costOrWeightChangedCallBack: (totalCost: number, totalWeight: number, totalPices: number, totalRevenue: number, totalBSCost?: number) => any, keyListenerCallback: () => any, hazmatCallBack: (salesOrderItems: Array<refSalesOrderItemModel.Models.SalesOrderItemsModel>) => any) {
		var self = this;

		self.costOrWeightChanged = costOrWeightChangedCallBack;
		self.keyListenerCallback = keyListenerCallback;
		self.hazardousChanged = hazmatCallBack;

		//set the flag allow decimal: true to accepts decimals
		self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(true) };

		self.updateHazardousValue = () => {
			var hazardousItems: Array<any>;

			hazardousItems = $.grep(self.salesOrderItemsList(), (item: refSalesOrderItemModel.Models.SalesOrderItemsModel) => {
				return item.isHazardous() === true;
			});
			self.hazardousChanged(hazardousItems);
		}

		self.updateAuditedBill = (auditedItem: Array<ISalesOrderItem>, salesOrderId: number, estimatedProfitPer: number, finalProfitPer: number, customerTypeOf: number, feeStructure: number, gtMinMargin: number, isBillingStation: boolean, gtzMargin: number, plcMargin: number) => {
			self.salesOrderId(salesOrderId.toString());
			self.estimatedProfitPerc(estimatedProfitPer);
			self.finalProfitPerc(finalProfitPer);
			self.customerTypeOf(customerTypeOf);
			self.feeStructure(feeStructure);
			self.gtMinMargin(gtMinMargin);
			self.gtzMargin(gtzMargin);
			self.isBillingStation(isBillingStation);
			self.plcMargin(plcMargin);
			self.copyCostOnlyFromAuditBill(auditedItem);
		};

		// initialize the Add command
		self.onAdd = function () {
			var shipmentItemTypesLength: number = self.shipmentItemTypes().length;
			if ((shipmentItemTypesLength)) {

				// ##START: US24975
				var result = $.grep(self.shipmentItemTypes(), function (e) { return e.ItemId === "10"; })[0];

				var salesOrderItem = new refSalesOrderItemModel.Models.SalesOrderItemsModel(result, function () { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem, self.updateHazardousValue, self.estimatedProfitPerc(), self.gtMinMargin(), self.feeStructure(), self.gtzMargin(), self.isBillingStation(), self.isCallForEdit(), self.isSubOrder(), self.isSaveEnable(), self.CanEditItemsDescription(), true, self.carrierType());

				// for TL orders Base Rate items will have cost disabled if added more than once; Hence 0.00 is set by default
				if (self.carrierType() === 3) {
					salesOrderItem.cost($.number(0, 2));
				}

				self.salesOrderItemsList.push(salesOrderItem);
				// ##END: US24975
			}

			// ###START: DE23042
			self.isNotAtLoadingTime = false;

			// ###END: DE23042
			self.onChangesMadeInItem(true);

			// ##START: US24975
			self.updateTotalCostAndWeight();
			// ##END: US24975

			// Uncheck the top check box for delete as we are adding a new item which is not selected
			// Making sure that user can delete any item or not, enable only if an item is sleeted
			if (self.isAllCheckedForDelete())
				self.isAllCheckedForDelete(false);
		};

		self.canDelete = ko.computed(function () {
			var isAnySelected = false;

			// Check if any one item is selected for deletion
			self.salesOrderItemsList().forEach(function (item) {
				if (item.isMarkForDeletion()) {
					isAnySelected = true;
				}
			});
			return isAnySelected;
		});

		// Making sure that input is number only
		self.IsNumber = function (data, event) {
			var charCode = (event.which) ? event.which : event.keyCode;

			//to allow copy(ctrl + c) in firefox
			if (event.ctrlKey && (charCode == 99 || charCode == 67)) {
				return true;
			}
			if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
				return false;
			}
			return true;
		};

		// Check uncheck all the items as per the user selection}
		self.markAllForDelete = function () {
			var isAllChecked = self.isAllCheckedForDelete();

			self.salesOrderItemsList().forEach(function (item) {
				item.isMarkForDeletion(isAllChecked);
			});
			return true;
		};

		// Handles the checkbox click event for each item
		self.itemCliked = function () {
			// Check if there is no item in the list make it false
			if (self.salesOrderItemsList().length === 0) {
				self.isAllCheckedForDelete(false);
				return true;
			}

			// Get an item which is not selected for deletion
			var isAnyitemNotMarkedForDeletion = $.grep(self.salesOrderItemsList(), function (e) { return e.isMarkForDeletion() == false; });

			if (isAnyitemNotMarkedForDeletion != undefined && isAnyitemNotMarkedForDeletion.length > 0) {
				self.isAllCheckedForDelete(false);
			}
			else {
				self.isAllCheckedForDelete(true);
			}

			return true;
		};

		//Removing line when click on delete image
		self.removeLineItem = function (lineItem: refSalesOrderItemModel.Models.SalesOrderItemsModel) {
			// Delete from the collection
			var totalPlcCost = 0.00;

			self.selectedlineitem = lineItem;
			for (var i = 0; i < self.salesOrderItemsList().length; i++) {
				totalPlcCost += self.salesOrderItemsList()[i].bSCost();
			}
			totalPlcCost = totalPlcCost - self.selectedlineitem.bSCost();
			self.salesOrderBsCost(totalPlcCost.toFixedDecimal(2));
			self.deleteSalesOrderItemsList();

			// ###START: DE23042
			self.isNotAtLoadingTime = false;

			// ###END: DE23042
			self.onChangesMadeInItem(true);
		};

		// Getting called by each and every item in the list
		self.onChangesMadeInItem = function (dirty: boolean) {
			// ###START: DE20342
			if (self.isLoaded)
				self.isNotAtLoadingTime = false;

			// ###END: DE20342
			if (self.isNotAtLoadingTime)
				return false;

			self.returnValue(dirty);
			if (self.onChangesMade && typeof (self.onChangesMade) === 'function') {
				self.onChangesMade(dirty);
			}
		};

		// Get all the details which is needed for this view
		self.beforeBind();

		self.isTabPress = (data, event) => {
			var charCode = (event.which) ? event.which : event.keyCode;
			if ((charCode === 9)) { //if 'TAB' press.
				var rowCount = $('#tblSalesOrderItems').find("tbody tr").length - 1;
				var index = event.target.id;
				if (rowCount === +index) {
					self.keyListenerCallback();
				}
			}
			return true;
		}

		//calling sales Order Items List remove
		self.deleteSalesOrderItemsList = () => {
			self.checkMsgDisplay = true;
			self.salesOrderItemsList.remove(self.selectedlineitem);
			//self.salesOrderItemsList.remove(self.selectedlineitem);
			self.updateTotalCostAndWeight();
		}

		return self;
	}

	//#endregion

	//#region Internal Methods

	//#endregion

	//#region private Method
	// Updates the main view as per the change in the items
	private updateTotalCostAndWeight() {
		var self = this;

		var totalCost: number = 0.0,
			totalweight: number = 0.0,
			totalPices: number = 0.0,
			totalDisputeCost: number = 0.0,
			totalRevenue: number = 0.0,
			totalBSCost: number = 0.0;
		// ##START: US24671 
		var shippingServiceCount = 0;
		// ##END: US24671 

		self.salesOrderItemsList().forEach(function (item) {
			if (item.cost()) {
				var costWithoutComma = item.cost().toString();
				var check = costWithoutComma.indexOf(",");
				if (check === -1) {
					totalCost += parseFloat(item.cost().toString());
				} else {
					//For removing comma before addition because parseFloat is not taking digit after comma at adding time
					totalCost += parseFloat(costWithoutComma.replace(/,/g, ""));
				}
			}

			if (item.weight()) {
				totalweight += parseInt(item.weight().toString());
			}

			if (item.pieceCount()) {
				totalPices += parseInt(item.pieceCount().toString());
			}

			if (item.rev()) {
				var revenueWithoutComma = item.rev().toString();
				var checkRev = revenueWithoutComma.indexOf(",");
				if (checkRev === -1) {
					totalRevenue += parseFloat(item.rev().toString());
				} else {
					totalRevenue += parseFloat(revenueWithoutComma.replace(/,/g, ""));
				}
			}

			if (item.bSCost()) {
				var bsCostWithoutComma = item.bSCost().toString();
				var check;
				check = bsCostWithoutComma.indexOf(",");
				if (check === -1) {
					totalBSCost += parseFloat(item.bSCost().toString());
				} else {
					//For removing comma before addition because parseFloat is not taking digit after comma at adding time
					totalBSCost += parseFloat(bsCostWithoutComma.replace(/,/g, ""));
				}
			}

			// ##START: US24975
			if (self.carrierType() === refEnums.Enums.CarrierType.Truckload.ID) {
				item.disableCostRevenue(false);
			}
		});

		//#region Multiple Base Rate Logic for TL orders
		if (self.carrierType() === refEnums.Enums.CarrierType.Truckload.ID) {

			// get SS (Shipping Service) items with non-zero cost or revenue
			var shippingServiceItemsWithCost = $.grep(self.salesOrderItemsList(), function (item) {
				return item.itemId() === 10 && ((typeof item.cost() !== "undefined" && parseFloat(item.cost()) !== 0)
					|| (typeof item.rev() !== "undefined" && parseFloat(item.rev()) !== 0))
			});

			// get all the SS items
			var shippingServiceItems = $.grep(self.salesOrderItemsList(), function (item) {
				return item.itemId() === 10
			});

			// If there is a SS item with Cost, then disable cost for all SS items with 0 cost
			if (typeof shippingServiceItemsWithCost !== "undefined" && shippingServiceItemsWithCost.length > 0) {
				shippingServiceItems.forEach(function (item, index) {
					item.disableCostRevenue(true);
				});

				shippingServiceItemsWithCost.forEach(function (item) {
					item.disableCostRevenue(false); // don't disable cost and revenu for non-zero SS items
				});
			}
			else if (typeof shippingServiceItems !== "undefined" && shippingServiceItems.length > 0) {
				// if all SS items have zero cost, then enable the cost and revenue only for the first SS item.
				shippingServiceItems.forEach(function (item, index) {
					item.disableCostRevenue(index !== 0);
				});
			}
		}

		//#endregion
		// ##END: US24975

		//To check if Msg is clicked
		self.checkMsgClick = () => {
			self.checkMsgDisplay = true;
		}

	// to Check if Msg is hidden or closed
		self.checkMsgHide = () => {
			self.checkMsgDisplay = true;
		}

		self.salesOrderItemAmount(totalCost.toFixed(2));
		self.salesOrderRevenue(totalRevenue.toFixed(2));
		self.salesOrderItemWeight(totalweight);
		self.salesOrderItemPieces(totalPices);
		self.salesOrderBsCost($.number(totalBSCost, 2));

		if (self.isNotAtLoadingTime === true && self.isNotAtLoadingTimeForCopyCostRevenue === true) {
			self.originalTotalBSCost(totalBSCost);
			self.originalTotalRevenue(totalRevenue);
			self.originalTotalCost(totalCost);
		}

		self.costOrWeightChanged(totalCost, totalweight, totalPices, totalRevenue, totalBSCost);
	}

	//#endregion

	//#region public method
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

		// calling only in entry page
		if (!self.isCallForEdit()) {
			// ##START: US24389
			self.populateItemDropdown();
			// ##END: US24389
			self.addDefaultItems();
		}
	}

	/*
	** <createDetails>
	** <id>US24389</id> <by>Shreesha Adiga</by> <date>31-08-2016</date> <description>Method to populate dropdown based on Service Type</description>
	** </createDetails>
	** <changeHistory>
	** <id>US25153</id> <by>Shreesha Adiga</by> <date>20-10-2016</date><description>Get</description>
	** </changeHistory>
	*/
	public populateItemDropdown() {
		var self = this;

		if (typeof self.shipmentItemTypes() !== "undefined") {
			if (self.carrierType() !== 3) {
				_app.trigger("GetItemsTypes", function (items: IShipmentItemType) {
					self.shipmentItemTypes.removeAll();
					self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
				});
			}
			else {
				_app.trigger("GetTruckloadAccessorials", function (items: IShipmentItemType) {
					self.shipmentItemTypes.removeAll();
					self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
				});
			}
		}

		// ##START: US25153
		_app.trigger("GetItemsNotIntegratedWithMas", function (items: Array<IShipmentItemType>) {
			if (items && typeof self.itemsNotIntegratedWithMas !== "undefined" && self.itemsNotIntegratedWithMas.length === 0) {
				self.itemsNotIntegratedWithMas = self.itemsNotIntegratedWithMas.concat(items); // 'removeAll' and 'push' will remove the items from shell too, hence concat is used
			}
		});
		// ##END: US25153
	}

	// Adds default line items first time
	public addDefaultItems() {
		var self = this;

		if (self.salesOrderItemsList !== null) {
			self.salesOrderItemsList.removeAll();
		}

		var shipingItem = $.grep(self.shipmentItemTypes(), function (e) { return e.ItemId === "10"; })[0];
		var discountItem = $.grep(self.shipmentItemTypes(), function (e) { return e.ItemId === "70"; })[0];
		var fuelItem = $.grep(self.shipmentItemTypes(), function (e) { return e.ItemId === "30"; })[0];

		self.salesOrderItemsList.push(new refSalesOrderItemModel.Models.SalesOrderItemsModel(shipingItem, function () { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem, self.updateHazardousValue, self.estimatedProfitPerc(), self.gtMinMargin(), self.feeStructure(), self.gtzMargin(), self.isBillingStation(), self.isCallForEdit(), self.isSubOrder(), self.CanEditItemsDescription())); // Shipping Service
		self.salesOrderItemsList.push(new refSalesOrderItemModel.Models.SalesOrderItemsModel(discountItem, function () { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem, self.updateHazardousValue, self.estimatedProfitPerc(), self.gtMinMargin(), self.feeStructure(), self.gtzMargin(), self.isBillingStation(), self.isCallForEdit(), self.isSubOrder(), self.CanEditItemsDescription())); // Discount
		self.salesOrderItemsList.push(new refSalesOrderItemModel.Models.SalesOrderItemsModel(fuelItem, function () { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem, self.updateHazardousValue, self.estimatedProfitPerc(), self.gtMinMargin(), self.feeStructure(), self.gtzMargin(), self.isBillingStation(), self.isCallForEdit(), self.isSubOrder(), self.CanEditItemsDescription())); // Fuel charge
	}
	// to load the sales order item details

	public initializeSalesOrderItemDetails(CanEditItemsDescription, soitems: Array<ISalesOrderItem>, estimatedProfitPer, gtMinMargin, feeStructure, gtzMargin, isBillingStation, visible: boolean, shipmentId: number, isCallForEdit: boolean, iscopyRevenu?: boolean, isCopyCostOnly?: boolean) {
		var self = this;

		self.isNotAtLoadingTime = true;

		if (isCopyCostOnly || iscopyRevenu) {
			self.isNotAtLoadingTimeForCopyCostRevenue = false;
			self.isNotAtLoadingTime = false;
		} else {
			self.isNotAtLoadingTimeForCopyCostRevenue = true;
		}

		var totalPlcCost = 0.00;

		if (!self.isSubOrder()) {
			self.estimatedProfitPerc(estimatedProfitPer);
		}

		self.gtMinMargin(gtMinMargin);
		self.feeStructure(feeStructure);
		self.gtzMargin(gtzMargin);
		self.isBillingStation(isBillingStation);
		self.isCallForEdit(isCallForEdit);
		self.CanEditItemsDescription(CanEditItemsDescription);
		//self.isSubOrder(isSuborder);
		if (self.salesOrderItemsList() != null) {
			//self.salesOrderItemsList().forEach(item => {
			//	item.cleanUp();
			//	delete item;
			//});

			self.salesOrderItemsList().removeAll();
		}

		self.isVbVisible(!visible);
		self.isSaveEnable(visible);
		self.shipmentId(shipmentId);

		if (soitems != null) {
			for (var i = 0; i < soitems.length; i++) {

				// ##START: DE24404
				var item;

				// ##START: US25153
				if (self.invoiceStatus === refEnums.Enums.InvoiceStatus.Invoiced.ID
					&& (soitems[i].ItemId === 0 || soitems[i].ItemId == null)
					&& (soitems[i].AccessorialId === 0 || soitems[i].AccessorialId == null)) {
					if (self.itemsNotIntegratedWithMas) {

						item = $.grep(self.itemsNotIntegratedWithMas, function (e) {
							return e.ShortDescription === soitems[i].UserDescription;
						})[0];

						if (item) {
							self.shipmentItemTypes.push.apply(self.shipmentItemTypes, self.itemsNotIntegratedWithMas);
						}
					}
				}
				// ##END: US25153

				if (typeof item === "undefined" && self.carrierType() === 3 && (soitems[i].ItemId == 44 || soitems[i].ItemId == 16)) {
					item = $.grep(self.shipmentItemTypes(), function (e) {
						return e.ItemId === soitems[i].ItemId.toString() && e.ShortDescription === soitems[i].UserDescription;
					})[0];
				}

				// ##START: US21290
				if (typeof item === "undefined") {
					item = $.grep(self.shipmentItemTypes(), function (e) {
						return e.ItemId === soitems[i].ItemId.toString() && (e.AccessorialId == null || soitems[i].AccessorialId == 0 || e.AccessorialId == soitems[i].AccessorialId);
					})[0];
				}
				// ##END: DE24404

				if (typeof item === "undefined" || item == null) {
					item = $.grep(self.shipmentItemTypes(), function (e) {
						return e.ItemId === soitems[i].ItemId.toString();
					})[0];
				}

				// ##END: US21290

				var salesOrderItem = new refSalesOrderItemModel.Models.SalesOrderItemsModel(item, function () { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem, self.updateHazardousValue, self.estimatedProfitPerc(), self.gtMinMargin(), self.feeStructure(), self.gtzMargin(), self.isBillingStation(), self.isCallForEdit(), self.isSubOrder(), self.isSaveEnable());
				salesOrderItem.initializeVendorBillItem(soitems[i], self.isSaveEnable(), iscopyRevenu, CanEditItemsDescription, isCopyCostOnly);
				// ##START: US24473
				salesOrderItem.carrierType(self.carrierType());
				// ##END: US24473
				totalPlcCost += soitems[i].PLCCost;
				self.salesOrderItemsList.push(salesOrderItem);
				// ##START: DE24404
				item = undefined; // in next iteration in loop, 'item' will still have the previous value
				// ##END: DE24404
			}

			self.salesOrderBsCost(totalPlcCost);
			self.updateHazardousValue();
			self.updateTotalCostAndWeight();
		}
		// ###START: DE23042
		self.isNotAtLoadingTime = true;

		// ###END: DE23042
		self.isNotAtLoadingTimeForCopyCostRevenue = false;
	}
	// Shows the message box as pr the given title and message
	public showConfirmationMessage(message: string, title: string, fisrtButtoName: string, secondButtonName: string, yesCallBack: () => boolean, noCallBack: () => boolean) {
		var self = this;

		var varMsgBox: Array<IMessageBoxButtonOption> = [
			{
				id: 0, name: fisrtButtoName, callback: (): boolean => {
					return yesCallBack();
				},
			},
			{
				id: 1, name: secondButtonName, callback: (): boolean => {
					return noCallBack();
				}
			}
		];

		////initialize message box control arguments
		var optionControlArgs: IMessageBoxOption = {
			options: varMsgBox,
			message: message,
			title: title
		}; //Call the dialog Box functionality to open a Popup
		_app.showDialog('templates/messageBox', optionControlArgs, 'slideDown');
	}

	// Checks validation in all the items
	public validateItems() {
		var self = this;
		var isInvalid = false;
		if (self.salesOrderItemsList().length > 0) {
			self.salesOrderItemsList().forEach(function (item) {
				if (item.checkValidation()) {
					isInvalid = true;
				}
			});
		}
		else {
			isInvalid = true;
			if (self.checkMsgDisplay) {
				self.checkMsgDisplay = false;
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.ThereShouldBeAtLeastOneLineItem, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
			}
		}

		return isInvalid;
	}

	//For Copying Cost and Revenue
	public copyCostRevenue(OrgItem: any, selectedAllItems: boolean) {
		var self = this;

		var items = $.grep(OrgItem, function (e) { return e.isCheck(); });

		self.copyAdjustedOrderItemList(self.adjustedOrderItemList());
		if (items.length > 0) {
			// ###START: US22365
			//When we are copying the cost and revenue then no need to calculate the Revenue again
			self.copyCostAndRevenueFromTab(items, true, selectedAllItems);

			// ###END: US22365
			self.calculateRevenue(true);
			//Calculate BS,PLC Cost and Revenue
			//self.calculateRevenueForChanges();
			//After updating populate the items
			self.initializeSalesOrderItemDetails(self.CanEditItemsDescription(), self.adjustedOrderItemList(), self.estimatedProfitPerc(), self.gtMinMargin(), self.feeStructure(), self.gtzMargin(), self.isBillingStation(), self.isSaveEnable(), self.shipmentId(), self.isCallForEdit(), true, false);

			self.calculateRevenue(false);
		}
		else {
			if (self.checkMsgDisplay) {
				self.checkMsgDisplay = false;
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 3,
					fadeOut: 3,
					typeOfAlert: "",
					title: ""
				}
	      Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectanItem, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
			}
		}
	}

	//For Copying Cost
	public copyCostOnly(orgItem: any) {
		var self = this;
		var items = $.grep(orgItem, function (e) { return e.isCheck(); });

		if (items.length > 0) {
			//When we are copying the cost and revenue then no need to calculate the Revenue again
			self.copyCostAndRevenueFromTab(items, false);

			//Calculate BS,PLC Cost and Revenue
			//self.calculateRevenueForChanges();
			//After updating populate the items
			self.initializeSalesOrderItemDetails(self.CanEditItemsDescription(), self.adjustedOrderItemList(), self.estimatedProfitPerc(), self.gtMinMargin(), self.feeStructure(), self.gtzMargin(), self.isBillingStation(), self.isSaveEnable(), self.shipmentId(), self.isCallForEdit(), false, true);

			//Make revert back calculateRevenue to false for further calculation
		}
		else {
			if (self.checkMsgDisplay) {
				self.checkMsgDisplay = false;
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 3,
					fadeOut: 3,
					typeOfAlert: "",
					title: ""
				}
          Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectanItem, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
			}
		}
	}

	public copyCostOnlyFromAuditBill(orgItem: any) {
		var self = this;
		var items = $.grep(orgItem, function (e) { return e.isCheck(); });

		if (items.length > 0) {
			self.copyRowtoother(self.salesOrderItemsList());
			//When we are copying the cost and revenue then no need to calculate the Revenue again
			self.copyCostFromAuditBill(items);
			self.initializeSalesOrderItemDetails(self.CanEditItemsDescription(), self.adjustedOrderItemList(), self.estimatedProfitPerc(), self.gtMinMargin(), self.feeStructure(), self.gtzMargin(), self.isBillingStation(), self.isSaveEnable(), self.shipmentId(), self.isCallForEdit(), false, true);
		}
		else {
			if (self.checkMsgDisplay) {
				self.checkMsgDisplay = false;
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 3,
					fadeOut: 3,
					typeOfAlert: "",
					title: ""
				}
          Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectanItem, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
			}
		}
	}

	//Copy the Cost and revenue to the item tab
	public copyCostAndRevenueFromTab(adjustedOrderCopy: Array<refSalesOrderReBillItemsModel.Models.SalesOrderReBillItemsModel>, isCopyCostRevenue: boolean, selectedAllItems?: boolean) {
		var self = this;
		self.matchrowArray().removeAll();
		var count = adjustedOrderCopy.length;

		// ###START: US22365
		if (selectedAllItems) {
			self.salesOrderItemsList().removeAll();
			self.adjustedOrderItemList().removeAll();
		}

		// ###END: US22365

		// ###START: DE23386
		var counter = 0;

		// ###END: DE23386
		adjustedOrderCopy.forEach(function (row) {
			var itemId = row.itemId();
			var itemArr = $.grep(self.adjustedOrderItemList(), function (e) { return e.ItemId === itemId; });
			// ###START: DE23373
			if (selectedAllItems) {
				self.addnewRow(row);
			}
			// ###END: DE23373
			else if (itemArr != null && itemArr.length > 0) {
				//Filter out the matched row
				self.fetchTheMatchedRow(row);
				//If we are getting one matched row then copy the cost and revenue(If CopyCost button is clicked)
				//Make the IsUpdated Column true
				if (self.matchrowArray().length == 1) {
					self.matchrowArray()[0].IsCalculateRevenue = true;
					if (!self.matchrowArray()[0].isUpdated) {
						self.matchrowArray()[0].Cost = row.cost();
						if (isCopyCostRevenue) {
							self.matchrowArray()[0].PLCCost = row.bSCost();
							self.matchrowArray()[0].Revenue = row.rev();
							// ###START: US22366
							self.matchrowArray()[0].PackageTypeId = row.PackageTypeId();
							self.matchrowArray()[0].PieceCount = row.pieceCount();

							// ###END: US22366
							// ###START: DE23386
							self.matchrowArray()[0].Weight = row.weight();

							// ###END: DE23386
						}
						self.matchrowArray()[0].isUpdated = true;
						self.copyRow(row, self.matchrowArray()[0], isCopyCostRevenue);
					}
					else {
						self.addnewRow(row);
					}
				}

				//If we are getting more than one matched row then copy the cost and revenue(If CopyCost button is clicked)
				// to the row contains isUpdated column false
				//Then Make the IsUpdated Column true
				else if (self.matchrowArray().length > 1) {

					self.matchrowArray()[counter].IsCalculateRevenue = true;
					if (!self.matchrowArray()[counter].isUpdated) {
						self.matchrowArray()[counter].Cost = row.cost();
						if (isCopyCostRevenue) {
							self.matchrowArray()[counter].PLCCost = row.bSCost();
							self.matchrowArray()[counter].Revenue = row.rev();
							// ###START: US22366
							self.matchrowArray()[counter].PackageTypeId = row.PackageTypeId();
							self.matchrowArray()[counter].PieceCount = row.pieceCount();

							// ###END: US22366
							// ###START: DE23386
							self.matchrowArray()[counter].Weight = row.weight();

							// ###END: DE23386
						}
						self.matchrowArray()[counter].isUpdated = true;

						// ###START: DE23386
						//self.addnewRow(row);

						// ###END: DE23386
					}
					else {
						counter = counter + 1;
						self.matchrowArray()[counter].Cost = row.cost();
						if (isCopyCostRevenue) {
							self.matchrowArray()[counter].PLCCost = row.bSCost();
							self.matchrowArray()[counter].Revenue = row.rev();
							// ###START: US22366
							self.matchrowArray()[counter].PackageTypeId = row.PackageTypeId();
							self.matchrowArray()[counter].PieceCount = row.pieceCount();

							// ###END: US22366
							// ###START: DE23386
							self.matchrowArray()[counter].Weight = row.weight();

							// ###END: DE23386
						}
						self.matchrowArray()[counter].isUpdated = true;
					}
				}
				//If not matched then add that row as a new row
				else {
					self.addnewRow(row);
				}
			}
			//If there no matched item in items tab then add that row as a new row
			else {
				self.addnewRow(row);
			}
		});
	}

	//Copy the Cost and revenue to the item tab
	public copyCostFromAuditBill(adjustedOrderCopy: any) {
		var self = this;
		self.matchrowArray().removeAll();
		var count = adjustedOrderCopy.length;
		adjustedOrderCopy.forEach(function (row) {
			var itemId = row.itemId();
			var itemArr = $.grep(self.adjustedOrderItemList(), function (e) { return e.ItemId === itemId; });

			if (itemArr != null && itemArr.length > 0) {
				//Filter out the matched row
				self.fetchTheMatchedRowFromAuditBill(row);
				//If we are getting one matched row then copy the cost and revenue(If CopyCost button is clicked)
				//Make the IsUpdated Column true
				if (self.matchrowArray().length == 1) {
					self.matchrowArray()[0].IsCalculateRevenue = true;
					if (!self.matchrowArray()[0].isUpdated) {
						self.matchrowArray()[0].Cost = row.cost();
						self.matchrowArray()[0].isUpdated = true;
						self.copyRowFromAuditBill(row, self.matchrowArray()[0]);
					}
					else {
						self.addnewRowFromAuditBill(row);
					}
				}

				//If we are getting more than one matched row then copy the cost and revenue(If CopyCost button is clicked)
				// to the row contains isUpdated column false
				//Then Make the IsUpdated Column true
				else if (self.matchrowArray().length > 1) {
					var counter = 0;
					self.matchrowArray()[counter].IsCalculateRevenue = true;
					if (!self.matchrowArray()[counter].isUpdated) {
						self.matchrowArray()[counter].Cost = row.cost();
						self.matchrowArray()[counter].isUpdated = true;
						self.addnewRowFromAuditBill(row);
					}
					else {
						counter = counter + 1;
						self.matchrowArray()[counter].Cost = row.cost();
						self.matchrowArray()[counter].isUpdated = true;
					}
				}
				//If not matched then add that row as a new row
				else {
					self.addnewRowFromAuditBill(row);
				}
			}
			//If there no matched item in items tab then add that row as a new row
			else {
				self.addnewRowFromAuditBill(row);
			}
		});
	}

	//Fetch Only Matched Row For SalesOrder-- According to the ItemId,Class,Description
	public fetchTheMatchedRow(row: refSalesOrderReBillItemsModel.Models.SalesOrderReBillItemsModel) {
		var self = this;
		self.matchrowArray().removeAll();
		if (row.itemId() == parseInt(Constants.ApplicationConstants.ShippingItemId)) {
			self.adjustedOrderItemList().forEach(function (item) {
				self.matchrowArray($.grep(self.adjustedOrderItemList(), function (e) { return e.ItemId === row.itemId() && e.UserDescription === row.userDescription() && e.Class === row.selectedClassType(); }));
			});
		}
		else {
			self.adjustedOrderItemList().forEach(function (item) {
				self.matchrowArray($.grep(self.adjustedOrderItemList(), function (e) { return e.ItemId === row.itemId() && e.UserDescription === row.userDescription(); }));
			});
		}
	}

	//Fetch Only Matched Row For SalesOrder-- According to the ItemId,Class,Description From Audit Bill
	public fetchTheMatchedRowFromAuditBill(row: any) {
		var self = this;
		self.matchrowArray().removeAll();
		if (row.itemId() == parseInt(Constants.ApplicationConstants.ShippingItemId)) {
			self.adjustedOrderItemList().forEach(function (item) {
				self.matchrowArray($.grep(self.adjustedOrderItemList(), function (e) { return e.ItemId === row.itemId() && e.UserDescription === row.userDescription() && e.Class === row.selectedClassType(); }));
			});
		}
		else {
			self.adjustedOrderItemList().forEach(function (item) {
				self.matchrowArray($.grep(self.adjustedOrderItemList(), function (e) { return e.ItemId === row.itemId() && e.UserDescription === row.userDescription(); }));
			});
		}
	}

	/// Calculate Revenue for the cost which is copied
	/// Also calculate the BS or PLC cost according to the CustomerType
	public calculateRevenueForChanges() {
		var self = this;
		var isAorder = false;

		// find out the current order is A order or main order
		var check = self.salesOrderId().search(' ');
		if (check != -1) {
			isAorder = true;
		}

		var profitPercentage = 0;
		if (!isAorder) {
			profitPercentage = self.estimatedProfitPerc();
		}
		else {
			profitPercentage = self.finalProfitPerc();
		}

		//Calculate the revenue and BS or Plc cost
		self.adjustedOrderItemList().forEach(function (row) {
			if (row.isUpdated) {
				self.plcorBSCost(0);
				self.plcorBSRevenue(0);
				self.calculatePLCorBSCostAndRevenue(row.Cost, self.customerTypeOf(), profitPercentage);
				if (!self.calculateRevenue()) {
					row.Revenue = $.number(self.plcorBSRevenue(), 2);
					row.PLCCost = $.number(self.plcorBSCost(), 2);
				}
			}
		});
	}

	//Calculate BS or PLC Cost and corresponding revenue
	public calculatePLCorBSCostAndRevenue(cost: number, customerType: number, profitPercentage: number) {
		var self = this;
		var gtMarginPercentage = self.commonUtils.isNullOrEmptyOrWhiteSpaces(self.gtzMargin()) ? self.gtzMargin() : 0;
		var plcMarginPercentage = self.commonUtils.isNullOrEmptyOrWhiteSpaces(self.plcMargin()) ? self.plcMargin() : 0;
		var plcCostOriginal = 0.0;
		var plcCostFlat = 0.0;
		var gtMinMarginFlat = self.gtMinMargin();

		switch (self.feeStructure()) {
			case refEnums.Enums.FeeStructure.OverCost.ID:
				if (self.isBillingStation()) {
					plcCostOriginal = $.number(parseFloat(cost.toString().replace(/,/g, "")) / (1 - (parseFloat(gtMarginPercentage.toString().replace(/,/g, "")) / 100)), 2);
					if (cost != 0) {
						plcCostFlat = $.number(parseFloat(cost.toString().replace(/,/g, "")) + parseFloat(gtMinMarginFlat.toString().replace(/,/g, "")), 2);
					}
					self.plcorBSCost(plcCostOriginal > plcCostFlat ? plcCostOriginal : plcCostFlat);
				}
				else {
					self.plcorBSCost($.number(parseFloat(cost.toString().replace(/,/g, "")) + (parseFloat(cost.toString().replace(/,/g, "")) * parseFloat(cost.toString().replace(/,/g, ""))) / 100, 2));
				}

				if (self.isBillingStation()) {
					self.plcorBSRevenue($.number((parseFloat(cost.toString().replace(/,/g, "")) * 100) / (100 - parseFloat(plcMarginPercentage.toString().replace(/,/g, ""))), 2));
				}

				break;
			case refEnums.Enums.FeeStructure.OverRevenue.ID:
				// if revenue has passed then calculate BS/PLC cost based on passed value.
				if (self.plcorBSRevenue() == 0) {
					// Billing station revenue needs to calculate based on gt cost.
					if (self.isBillingStation()) {
						self.plcorBSRevenue($.number((parseFloat(cost.toString().replace(/,/g, "")) * 100) / (100 - parseFloat(plcMarginPercentage.toString().replace(/,/g, ""))), 2));
					}
				}
				plcCostOriginal = $.number(parseFloat(cost.toString().replace(/,/g, "")) + ((parseFloat(self.plcorBSRevenue().toString().replace(/,/g, "")) - parseFloat(cost.toString().replace(/,/g, ""))) + (parseFloat(gtMarginPercentage.toString().replace(/,/g, "")) / 100)), 2);
				if (cost != 0) {
					plcCostFlat = $.number(parseFloat(cost.toString().replace(/,/g, "")) + parseFloat(gtMinMarginFlat.toString().replace(/,/g, "")), 2);
				}
				self.plcorBSCost(plcCostOriginal > plcCostFlat ? plcCostOriginal : plcCostFlat);
				break;
			default:
				if (customerType != refEnums.Enums.CustomerType.PLC_Customer.ID && customerType != refEnums.Enums.CustomerType.BillingStation_Customer.ID) {
					self.plcorBSCost(0);
					if (self.plcorBSRevenue() == 0) {
						self.plcorBSRevenue($.number(parseFloat(cost.toString().replace(/,/g, "")) / (1 - (parseFloat(profitPercentage.toString().replace(/,/g, "")) / 100)), 2));
					}
				}

				break;
		}
	}

	public addnewRow(row: refSalesOrderReBillItemsModel.Models.SalesOrderReBillItemsModel, onlyCopyCost?: boolean) {
		var self = this;
		var newitem = new refSalesOrderItemDetail.Models.SalesOrderItemDetail;
		newitem.Id = 0;
		newitem.isUpdated = false;
		newitem.Items = row.items();
		newitem.UserDescription = row.userDescription();
		newitem.Cost = row.cost();
		newitem.Revenue = row.rev();
		newitem.IsCalculateRevenue = true;
		if (!onlyCopyCost) {
			newitem.Revenue = row.rev();
			newitem.PLCCost = row.bSCost();
		}
		newitem.SalesOrderId = row.salesOrderId();
		newitem.ItemId = row.itemId();
		newitem.AccessorialId = row.accessorialId();

		newitem.ProductCode = row.productCode();

		if (row.itemId() == 10) {
			newitem.NMFC = row.nmfc();
			newitem.Class = row.selectedClassType();
			newitem.Length = row.dimensionLength();
			newitem.Weight = row.weight();
			newitem.Width = row.dimensionWidth();
			newitem.Height = row.dimensionHeight();
			newitem.Hazardous = row.isHazardous();
			//newitem.PackageTypeId = row.packageTypes()[0].ID;
			//newitem.PackageTypeName = row.packageTypes()[0].Value;
			//newitem.PackageTypes.ID = row.packageTypes()[0].ID;
			//newitem.PackageTypes.Value = row.packageTypes()[0].Value;
			newitem.HazardousUNNo = row.hazmatUnNumber();
			newitem.PalletCount = row.palletCount();
			newitem.PackingGroupNo = row.packingGroup();
			// ###START: US22366
			newitem.PackageTypeId = row.PackageTypeId();
			newitem.PieceCount = row.pieceCount();

			// ###END: US22366
		}
		else {
			newitem.Class = null;
			newitem.HazardousUNNo = null;
			newitem.Height = null;
			newitem.Length = null;
			newitem.Weight = null;
			newitem.Width = null;
			newitem.NMFC = null;
			newitem.PackageTypes = null;
			newitem.PackingGroupNo = null;
			newitem.PalletCount = null;
		}

		self.adjustedOrderItemList().push(newitem);
	}

	// Adds New Row For Audited Bill
	public addnewRowFromAuditBill(row: any) {
		var self = this;
		var newitem = new refSalesOrderItemDetail.Models.SalesOrderItemDetail;
		newitem.Id = 0;
		newitem.isUpdated = false;
		newitem.Items = row.items();
		newitem.UserDescription = row.userDescription();
		newitem.Cost = row.cost();
		newitem.ItemId = row.itemId();
		newitem.IsCalculateRevenue = true;
		if (row.itemId() == 10) {
			newitem.Class = row.selectedClassType() ? row.selectedClassType() : null;
			newitem.Weight = row.weight() ? row.weight() : null;
			newitem.PieceCount = row.pieceCount() ? row.pieceCount() : null;
		}
		else {
			newitem.Class = null;
			newitem.HazardousUNNo = null;
			newitem.Height = null;
			newitem.Length = null;
			newitem.Weight = null;
			newitem.Width = null;
			newitem.NMFC = null;
			newitem.PackageTypes = null;
			newitem.PackingGroupNo = null;
			newitem.PalletCount = null;
		}

		self.adjustedOrderItemList().push(newitem);
	}

	public copyRowtoother(items: Array<refSalesOrderItemModel.Models.SalesOrderItemsModel>) {
		var self = this;
		self.adjustedOrderItemList().removeAll();
		items.forEach(function (item) {
			self.adjustedOrderItem = new refSalesOrderItemDetail.Models.SalesOrderItemDetail;
			self.adjustedOrderItem.BsCost = item.bSCost();
			//self.adjustedOrderItem.Class = parseInt(item.classTypes()[0].Value);
			//self.adjustedOrderItem.ClassTypes[0]. = item.classTypes()[0]
			self.adjustedOrderItem.Cost = item.cost();

			//self.adjustedOrderItem.Items = item.items();
			self.adjustedOrderItem.UserDescription = item.userDescription();
			self.adjustedOrderItem.Cost = item.cost();

			self.adjustedOrderItem.Revenue = item.rev();
			self.adjustedOrderItem.PLCCost = item.bSCost();

			//self.adjustedOrderItem.SalesOrderId = item.salesOrderId();
			self.adjustedOrderItem.ItemId = item.itemId();
			//self.adjustedOrderItem.AccessorialId = item.accessorialId();

			//self.adjustedOrderItem.ProductCode = item.productCode();
			if (item.itemId() == 10) {
				self.adjustedOrderItem.NMFC = item.nmfc();
				self.adjustedOrderItem.Class = typeof (item.selectedClassType()) != 'undefined' ? item.selectedClassType() : null;
				self.adjustedOrderItem.Length = item.dimensionLength();
				self.adjustedOrderItem.Weight = item.weight();
				self.adjustedOrderItem.Width = item.dimensionWidth();
				self.adjustedOrderItem.Height = item.dimensionHeight();
				self.adjustedOrderItem.Hazardous = item.isHazardous();
				self.adjustedOrderItem.HazardousUNNo = item.hazmatUnNumber();
				self.adjustedOrderItem.PalletCount = item.palletCount();
				self.adjustedOrderItem.PackingGroupNo = item.packingGroup();
				self.adjustedOrderItem.PackageTypeId = item.selectedPackageType();
				self.adjustedOrderItem.PieceCount = item.pieceCount();
			}
			else {
				self.adjustedOrderItem.Class = null;
				self.adjustedOrderItem.HazardousUNNo = null;
				self.adjustedOrderItem.Height = null;
				self.adjustedOrderItem.Length = null;
				self.adjustedOrderItem.Weight = null;
				self.adjustedOrderItem.Width = null;
				self.adjustedOrderItem.NMFC = null;
				self.adjustedOrderItem.PackageTypes = null;
				self.adjustedOrderItem.PackingGroupNo = null;
				self.adjustedOrderItem.PalletCount = null;
			}
			self.adjustedOrderItemList().push(self.adjustedOrderItem);
		});
	}

	public copyRow(row: refSalesOrderReBillItemsModel.Models.SalesOrderReBillItemsModel, items: any, onlyCopyCost: boolean) {
		var self = this;
		self.adjustedOrderItemList().forEach(function (item) {
			if (item.ItemId == parseInt(Constants.ApplicationConstants.ShippingItemId)) {
				if (item.ItemId == items.ItemId && item.Class == items.Class && item.UserDescription == items.UserDescription) {
					item.isUpdated = false;
					item.Items = row.items();
					item.UserDescription = row.userDescription();
					item.Cost = row.cost();
					if (onlyCopyCost) {
						item.Revenue = row.rev();
						item.PLCCost = row.bSCost();
					}

					item.SalesOrderId = row.salesOrderId();
					item.ItemId = row.itemId();
					item.AccessorialId = row.accessorialId();

					item.ProductCode = row.productCode();
					if (row.itemId() == 10) {
						item.NMFC = row.nmfc();
						item.Class = row.selectedClassType();
						item.Length = row.dimensionLength();
						item.Weight = row.weight();
						item.Width - row.dimensionWidth();
						item.Height = row.dimensionHeight();
						item.Hazardous = row.isHazardous();
						item.HazardousUNNo = row.hazmatUnNumber();
						item.PalletCount = row.palletCount();
						item.PackingGroupNo = row.packingGroup();
						// ###START: US22366
						item.PackageTypeId = row.PackageTypeId();
						item.PieceCount = row.pieceCount();

						// ###END: US22366
					}
					else {
						item.Class = null;
						item.HazardousUNNo = null;
						item.Height = null;
						item.Length = null;
						item.Weight = null;
						item.Width = null;
						item.NMFC = null;
						item.PackageTypes = null;
						item.PackingGroupNo = null;
						item.PalletCount = null;
					}
				}
			}
			else {
				if (item.ItemId == items.ItemId && item.UserDescription == items.UserDescription) {
					item.isUpdated = false;
					item.Items = row.items();
					item.UserDescription = row.userDescription();
					item.Cost = row.cost();
					if (onlyCopyCost) {
						item.Revenue = row.rev();
						item.PLCCost = row.bSCost();
					}

					item.SalesOrderId = row.salesOrderId();
					item.ItemId = row.itemId();
					item.AccessorialId = row.accessorialId();

					item.ProductCode = row.productCode();
					if (row.itemId() == 10) {
						item.NMFC = row.nmfc();
						item.Class = row.selectedClassType();
						item.Length = row.dimensionLength();
						item.Weight = row.weight();
						item.Width - row.dimensionWidth();
						item.Height = row.dimensionHeight();
						item.Hazardous = row.isHazardous();
						item.HazardousUNNo = row.hazmatUnNumber();
						item.PalletCount = row.palletCount();
						item.PackingGroupNo = row.packingGroup();
						// ###START: US22366
						item.PackageTypeId = row.PackageTypeId();
						item.PieceCount = row.pieceCount();

						// ###END: US22366
					}
					else {
						item.Class = null;
						item.HazardousUNNo = null;
						item.Height = null;
						item.Length = null;
						item.Weight = null;
						item.Width = null;
						item.NMFC = null;
						item.PackageTypes = null;
						item.PackingGroupNo = null;
						item.PalletCount = null;
					}
				}
			}
		});
	}

	// Copy Row Of Audit Bill
	public copyRowFromAuditBill(row: any, items: any) {
		var self = this;
		self.adjustedOrderItemList().forEach(function (item) {
			if (item.ItemId == parseInt(Constants.ApplicationConstants.ShippingItemId)) {
				if (item.ItemId == items.ItemId && item.Class == items.Class && item.UserDescription == items.UserDescription) {
					item.isUpdated = false;
					item.Items = row.items();
					item.UserDescription = row.userDescription();
					item.Cost = row.cost();
					item.ItemId = row.itemId();
					if (row.itemId() == 10) {
						item.Class = row.selectedClassType() ? row.selectedClassType() : null;
						item.Weight = row.weight() ? row.weight() : null;
						item.PieceCount = row.pieceCount() ? row.pieceCount() : null;
					}
					else {
						item.Class = null;
						item.HazardousUNNo = null;
						item.Height = null;
						item.Length = null;
						item.Weight = null;
						item.Width = null;
						item.NMFC = null;
						item.PackageTypes = null;
						item.PackingGroupNo = null;
						item.PalletCount = null;
					}
				}
			}
			else {
				if (item.ItemId == items.ItemId && item.UserDescription == items.UserDescription) {
					item.isUpdated = false;
					item.Items = row.items();
					item.UserDescription = row.userDescription();
					item.Cost = row.cost();
					item.ItemId = row.itemId();
					if (row.itemId() == 10) {
						item.Class = row.selectedClassType() ? row.selectedClassType() : null;
						item.Weight = row.weight() ? row.weight() : null;
						item.PieceCount = row.pieceCount() ? row.pieceCount() : null;
					}
					else {
						item.Class = null;
						item.HazardousUNNo = null;
						item.Height = null;
						item.Length = null;
						item.Weight = null;
						item.Width = null;
						item.NMFC = null;
						item.PackageTypes = null;
						item.PackingGroupNo = null;
						item.PalletCount = null;
					}
				}
			}
		});
	}

	public copyRevenueAndCost(item: any, type: number, selectedAllItems: boolean) {
		var self = this;

		// ###START: US22365
		if (selectedAllItems) {
			self.salesOrderItemsList().removeAll();
		} else {
			self.copyRowtoother(self.salesOrderItemsList());
		}

		// ###END: US22365
		if (type == 1) {
			self.copyCostOnly(item);
		}
		else {
			self.copyCostRevenue(item, selectedAllItems); // ###START: US22365
		}
	}

	public cleanUp() {
		var self = this;

		self.salesOrderItemsList().forEach(item => {
			item.cleanUp();
			delete item;
		});

		self.salesOrderItemsList.removeAll();

		for (var property in self) {
			delete self[property];
		}
		//delete self.salesOrderItemsList;

		//delete self.salesOrderItemsList;
		//delete self.onAdd;
		//delete self.markAllForDelete;
		//delete self.IsNumber;
		//delete self.isCurrency;
		//delete self.itemCliked;
		//delete self.costOrWeightChanged;
		//delete self.removeLineItem;
		//delete self.onChangesMade;
		//delete self.onChangesMadeInItem;
		//delete self.deleteSalesOrderItemsList;
		//delete self.checkMsgDisplay;
		//delete self.checkMsgClick;
		//delete self.checkMsgHide;
		//delete self.keyListenerCallback;
		//delete self.isTabPress;
		//delete self.hazardousChanged;
		//delete self.updateHazardousValue;
		//delete self.updateAuditedBill;

		delete self;
	}

	//#endregion

	//#region Life Cycle Event
	public compositionComplete(view, parent) {
		// ###START: DE23042
		var self = this;
		self.isNotAtLoadingTime = false;

		// ###END: DE23042
	}

	public activate() {
		return true;
	}

	//** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
	public attached() {
		_app.trigger('viewAttached');
	}
	//#endregion
}