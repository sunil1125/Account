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
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refVendorBillClient = require('services/client/VendorBillClient');
import refMapLocation = require('services/models/common/MapLocation');
import refOptionButtonControl = require('templates/optionButtonControl');
import refVendorBillAddress = require('services/models/vendorBill/VendorBillAddress');
import refCommon = require('services/client/CommonClient');
//#endregion

/*
** <summary>
** Scripts of Sales order rebill item view
** </summary>
** <createDetails>
** </createDetails>
** <changeHistory>
** <id>DE20981</id> <by>Vasanthakumar</by> <date>15-Dec-2015</date> <description>Handle Vendor bill duplicate line items if PRONo is same for two VBs</description>
** <id>DE21390</id> <by>Vasanthakumar</by> <date>22-01-2016</date> <description>System shows Change Detection message when user navigate to ReBill tab & try to navigate to other page</description>
** <id>US21290</id> <by>Shreesha Adiga</by> <date>21-03-2016</date><description>Show item description based on accessorial id also</description>
** <id>DE22259</id> <by>Shreesha Adiga</by> <date>23-03-2016</date><description>Check if shipmentItemTypes is null, if yes popluate it; Display long description of item</description>
** <id>US21290</id> <by>Shreesha Adiga</by> <date>23-03-2016</date><description>If item selected based on itemid and accessorialId is undefined, then select based only on itemId</description>
** <id>US22366</id> <by>Baldev Singh Thakur</by> <date>24-05-2016</date> <description>on Copy Cost Revenue Package Type and Pieces wasn't being copied.</description>
** <id>US25153</id> <by>Shreesha Adiga</by> <date>20-10-2016</date><description>Changes realted to Credit Adjustment (Items Not Integrated With Mas)</description>
** <id>DE25602</id> <by>Vasanthakumar</by> <date>18-01-2017</date><description>If item id and accessorial id is zero then Credit adjustment line item is inserted in the order</description>
** </changeHistory>
*/

export class SalesOrderRebillVendorBillItemViewModel {
	//#region Members

	vendorBillItemsList: KnockoutObservableArray<VendorBillItemsModel> = ko.observableArray([]);
	// keep the value for show/hide dispute amount section
	isDisputeAmountVisible: KnockoutObservable<boolean> = ko.observable(false);
	//For Grid
	isDefaultResult: KnockoutObservable<boolean> = ko.observable(true);
	// keep the value for enable and disable dispute amount and  dispute lost amount
	isDisputeAmountEditable: KnockoutObservable<boolean> = ko.observable(false);
	isDisputeLostAmountEditable: KnockoutObservable<boolean> = ko.observable(false);
	costOrWeightChanged: (totalCost: number, totalWeight: number, totalPices: number, totalRevenue: number) => any;
	totalCost: KnockoutObservable<number> = ko.observable(0);
	//## To trigger when when 'TAB' press from reference number.
	keyListenerCallback: () => any;
	//dynamic css classes
	descColCssClass: KnockoutComputed<string>;
	descTextValidCssClass: KnockoutComputed<string>;
	descTextNotValidCssClass: KnockoutComputed<string>;
	//## To trigger when when 'TAB' press from reference number.
	isTabPress: (that, event) => void;
	// Accepts only numeric with decimal input
	NumericInputWithDecimalPoint: INumericInput;
	isNotAtLoadingTime: boolean = false;
	shipmentItemTypes: KnockoutObservableArray<IShipmentItemType> = ko.observableArray([]);
	public onChangesMadeInItem: (dirty: boolean) => any;
	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	returnValue: KnockoutObservable<boolean> = ko.observable(false);
	gridHeader: KnockoutObservable<string> = ko.observable('');
	isSelect: KnockoutObservable<boolean> = ko.observable(false);
	vendorBillItemAmount: KnockoutObservable<string> = ko.observable();
	vendorBillDisputeAmount: KnockoutObservable<string> = ko.observable();
	vendorBillWeight: KnockoutObservable<number> = ko.observable();
	vendorBillItemPieces: KnockoutObservable<number> = ko.observable();

	// ##START: US25153
	itemsNotIntegratedWithMas: IShipmentItemType[] = [];
	// ##END: US25153
	//#endregion

	constructor() {//costOrWeightChangedCallBack: (totalCost: number, totalWeight: number, totalPices: number, totalRevenue: number) => any
		var self = this;
		//self.costOrWeightChanged = costOrWeightChangedCallBack;
		// Getting called by each and every item in the list
		self.onChangesMadeInItem = function (dirty: boolean) {
			//var isAnyDirty = $.grep(self.vendorBillItemsList(), function (e) { return e.isBIDirty === true });
			//var itemDirty = isAnyDirty.length > 0;
			if (self.isNotAtLoadingTime)
				return false;

			if (self.onChangesMade && typeof (self.onChangesMade) === 'function') {
				self.onChangesMade(dirty);
				self.returnValue(dirty);
			}
		};
	}

	//#region Public Methods

	// to load the vendor bill item details
	public InitializeVendorBillItems(items: Array<IVendorBillItemForInvoiceResolution>) {
		var self = this;
		self.isNotAtLoadingTime = true;
		self.isDisputeAmountVisible(true);
		self.isDisputeAmountEditable(false);
		self.isDisputeLostAmountEditable(false);
		var proNo = '';
		var vbId: number = 0;
		var totalCost: number = 0.0,
			totalWeight: number = 0.0,
			totalPieces: number = 0.0,
			totalDisputeCost: number = 0.0;

		if (self.vendorBillItemsList != null)
			self.vendorBillItemsList.removeAll();

		//##START: DE22259
		//populate shipmentItemTypes if they are empty
		if (typeof self.shipmentItemTypes() === "undefined" || self.shipmentItemTypes() == null || self.shipmentItemTypes().length == 0) {
			_app.trigger("GetItemsTypes", function (items: IShipmentItemType) {
				self.shipmentItemTypes.removeAll();
				self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
			});
		}

		// ##START: US25153
		if (typeof self.itemsNotIntegratedWithMas !== "undefined" && self.itemsNotIntegratedWithMas.length === 0) {
			_app.trigger("GetItemsNotIntegratedWithMas", function (items: Array<IShipmentItemType>) {
				if (items) {
					self.itemsNotIntegratedWithMas = self.itemsNotIntegratedWithMas.concat(items); // 'removeAll' and 'push' will remove the items from shell too, hence concat is used
				}
			});
		}
		// ##END: US25153

		//##END: DE22259

		if (items != null) {
			for (var i = 0; i < items.length; i++) {
				if (proNo != items[i].PRONo || vbId != items[i].VendorBillId) {
					proNo = items[i].PRONo;
					vbId = items[i].VendorBillId;
					if (i != 0) {
						var vendorItemTotal = new VendorBillItemsModel(item, function () { }, function () { }, false, false);
						vendorItemTotal.initializeTotal(totalCost, totalPieces, totalWeight, totalDisputeCost);
						self.vendorBillItemsList.push(vendorItemTotal);
						totalCost = 0.0;
						totalPieces = 0.0;
						totalWeight = 0.0;
						totalDisputeCost = 0.0;
					}
				}
				else {
					items[i].PRONo = '';
				}

				//##START: US21290
				var item = $.grep(self.shipmentItemTypes(), function (e) {
					return e.ItemId === items[i].ItemId.toString() && (e.AccessorialId == null || items[i].AccessorialId == 0 || e.AccessorialId == items[i].AccessorialId);
				})[0];

				if (typeof item === "undefined" || item == null) {
					item = $.grep(self.shipmentItemTypes(), function (e) {
						return e.ItemId === items[i].ItemId.toString();
					})[0];
				}
				//##END: US21290

				// ##START: US25153
				if (items[i].ItemId === 0
					&& items[i].AccessorialId === 0
					&& self.itemsNotIntegratedWithMas) {
					item = $.grep(self.itemsNotIntegratedWithMas, function (e) {
						return e.ShortDescription === items[i].UserDescription;
					})[0];

					if (typeof item !== "undefined")
						self.shipmentItemTypes.push.apply(self.shipmentItemTypes, self.itemsNotIntegratedWithMas);
				}
				// ##END: US25153

				var vendorItem = new VendorBillItemsModel(item, function () { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem, false, false);
				var costWithoutComma = items[i].Cost.toString();
				var check = costWithoutComma.indexOf(",");
				if (check === -1) {
					totalCost += parseFloat(items[i].Cost.toString());
				} else {
					//For removing comma before addition because parseFloat is not taking digit after comma at adding time
					totalCost += parseFloat(costWithoutComma.replace(/,/g, ""));
				}
				if (items[i].Weight != null) {
					totalWeight += parseInt(items[i].Weight.toString());
				}
				if (items[i].PieceCount != null) {
					totalPieces += parseInt(items[i].PieceCount.toString());
				}
				if (items[i].DisputeAmount != null) {
					var disputeWithoutComma = items[i].DisputeAmount.toString();
					var check = disputeWithoutComma.indexOf(",");
					if (check === -1) {
						totalDisputeCost += parseFloat(items[i].DisputeAmount.toString());
					}
					else {
						totalDisputeCost += parseFloat(disputeWithoutComma.replace(/,/g, ""));
					}
				}
				vendorItem.initializeVendorBillItem(items[i]);

				//##START: DE22259
				if (typeof item !== "undefined" && item !== null && item.LongDescription != null && item.LongDescription != "") {
					vendorItem.itemName(item.LongDescription);
				}

				//##END: DE22259

				self.vendorBillItemsList.push(vendorItem);
				if (i == items.length - 1) {
					var vendorItemTotal = new VendorBillItemsModel(item, function () { }, function () { }, false, false);
					vendorItemTotal.initializeTotal(totalCost, totalPieces, totalWeight, totalDisputeCost);
					self.vendorBillItemsList.push(vendorItemTotal);
					totalCost = 0.0;
					totalPieces = 0.0;
					totalWeight = 0.0;
					totalDisputeCost = 0.0;
				}
			}
		}
		//self.updateTotalCostAndWeight();
		//// ###START: DE21390
		// ###START: US22366
		if (typeof self.onChangesMade !== "undefined") {
			self.onChangesMade(false);
		}
		// ###END: US22366
		self.returnValue(false);
		//// ###END: DE21390
		self.isNotAtLoadingTime = false;
	}

	public beforeBind() {
		var self = this;

		////var shipmentItemTypesLength: number = self.shipmentItemTypes().length;
		////if (!(shipmentItemTypesLength)) {
		////	_app.trigger("GetItemsTypes", function (items: IShipmentItemType) {
		////		self.shipmentItemTypes.removeAll();
		////		self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
		////	});
		////}
	}

	public compositionComplete() {
		var self = this;
	}

	public cleanup() {
		var self = this;
		self.vendorBillItemsList.removeAll();
		self.vendorBillItemsList().forEach(item => {
			item.cleanup();
			delete item;
		});

		for (var property in self) {
			delete self[property];
		}
	}
	//#endregion

	//#region Private methods

	// Updates the main view as per the change in the items
	private updateTotalCostAndWeight() {
		var self = this;

		var totalCost: number = 0.0,
			totalweight: number = 0.0,
			totalPices: number = 0.0,
			totalDisputeCost: number = 0.0;

		self.vendorBillItemsList().forEach(function (item) {
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

			if (item.disputeAmount()) {
				totalDisputeCost += parseFloat(item.disputeAmount().toString());
			}
		});

		self.vendorBillDisputeAmount($.number(totalDisputeCost.toString(), 2));
		self.vendorBillItemAmount($.number(totalCost.toString(), 2));
		self.vendorBillItemPieces(totalPices);
		self.vendorBillWeight(totalweight);
		self.totalCost(totalCost);
		//self.costOrWeightChanged(totalCost, totalweight, totalPices, totalDisputeCost);
	}

	//#endregion
}

export class VendorBillItemsModel {
	id: KnockoutObservable<number> = ko.observable();
	selectedItemTypes: KnockoutObservable<IShipmentItemType> = ko.observable();
	cost: KnockoutObservable<any> = ko.observable();
	pieceCount: KnockoutObservable<number> = ko.observable();
	selectedClassType: KnockoutObservable<number> = ko.observable();
	weight: KnockoutObservable<number> = ko.observable();
	dimensionLength: KnockoutObservable<number> = ko.observable();
	dimensionWidth: KnockoutObservable<number> = ko.observable();
	dimensionHeight: KnockoutObservable<number> = ko.observable();
	userDescription: KnockoutObservable<string> = ko.observable();
	packageTypes: KnockoutObservableArray<IEnumValue>;
	classTypes: KnockoutObservableArray<IEnumValue>;
	allowvalidation: KnockoutObservable<boolean> = ko.observable(true);
	isMarkForDeletion: KnockoutObservable<boolean> = ko.observable(false);
	isShippingItem: KnockoutComputed<boolean>;
	isShippingItemMiscellaneous: KnockoutComputed<boolean>;
	errorVendorItemDetail: KnockoutValidationGroup;
	selectedPackageType: KnockoutObservable<number> = ko.observable();
	disputeAmount: KnockoutObservable<any> = ko.observable();
	disputeLostAmount: KnockoutObservable<any> = ko.observable();
	proNo: KnockoutObservable<any> = ko.observable();
	itemName: KnockoutObservable<string> = ko.observable();
	packageName: KnockoutObservable<string> = ko.observable();
	totalRow: KnockoutObservable<string> = ko.observable('');

	// for tracking changes
	getBITrackChange: () => string[];
	isBIDirty: KnockoutComputed<boolean>;
	onChangesMade: (dirty: boolean) => any;
	isNotAtLoadingTime: boolean = false;

	// for dispute amount validation
	isDisputeAmountEditable: boolean = false;
	isDisputeLostAmountEditable: boolean = false;

	//#region Constructor
	constructor(selectedType: IShipmentItemType, costOrWeightChanged: () => any, changesMade: (dirty: boolean) => any, isDisputeAmountEditable?: boolean, isDisputeLostAmountEditable?: boolean) {
		var self = this;
		self.isDisputeAmountEditable = isDisputeAmountEditable;
		self.isDisputeLostAmountEditable = isDisputeLostAmountEditable;

		// Notifies to parent view model about the changes
		self.onChangesMade = (dirty: boolean) => {
			changesMade(dirty);
		};

		self.id = ko.observable(0);

		// Set the description for all the other items rather than shipping
		if (refSystem.isObject(selectedType)) {
			if (selectedType.ItemId !== "10") {
				self.userDescription(selectedType.AccessorialDescription);
			}
		}

		// Handles the visibility of some of the fields like class, weight
		self.isShippingItem = ko.computed(() => {
			return (self.selectedItemTypes() !== undefined
				&& self.selectedItemTypes().ItemId === "10");
		});

		// Handles the visibility of some of the fields like class, weight
		self.isShippingItemMiscellaneous = ko.computed(() => {
			return ((self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemId)
				|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemIdMiscellaneousFee)
				|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reclass)
				|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reclassfee)
				|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reweigh)
				|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ReweighANDReclass)
				|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reweighfee)
				);
		});

		//#region Validation Rules

		self.cost.extend({
			required: {
				message: 'Cost is required.',
				onlyIf: () => {
					return ((self.ValidateVendorBillItem() || (self.id() === 1 && self.allowvalidation())));
				}
			},
			number: true
		});

		self.selectedItemTypes.extend({
			required: {
				message: 'Please Choose Item Type.',
				onlyIf: () => {
					return (self.ValidateVendorBillItem() || (self.id() === 1 && self.allowvalidation()));
				}
			}
		});

		self.userDescription.extend({
			required: {
				message: 'Description is required.',
				onlyIf: () => {
					return (self.isShippingItemMiscellaneous());
				}
			}
		});

		self.disputeAmount.extend({
			max: {
				params: 1,
				message: 'Amount should not be greater than cost.',
				onlyIf: () => {
					return (self.cost() != null && self.disputeAmount() != null && (parseFloat(self.cost().toString().replace(",", "")) < parseFloat(self.disputeAmount().toString())));
				}
			},
			number: true
		});

		self.disputeLostAmount.extend({
			max: {
				params: 1,
				message: 'Amount should not be greater than dispute amount.',
				onlyIf: () => {
					return (self.disputeLostAmount() != null && self.disputeAmount() != null && (parseFloat(self.disputeAmount().toString().replace(",", "")) < parseFloat(self.disputeLostAmount().toString())));
				}
			},
			number: true
		});

		//#endregion Validation Rules

		// The vendors item bill object
		self.errorVendorItemDetail = ko.validatedObservable({
			selectedItemTypes: self.selectedItemTypes,
			cost: self.cost,
			userDescription: self.userDescription,
			selectedItemTypes: self.selectedItemTypes,
			disputeAmount: self.disputeAmount,
			disputeLostAmount: self.disputeLostAmount
		});

		self.SetBITrackChange(self);

		self.getBITrackChange = () => {
			return Utils.getDirtyItems(self);
		};

		self.isBIDirty = ko.computed(() => {
			var result = self.selectedItemTypes();
			var result1 = self.userDescription();
			var result2 = self.dimensionLength();
			result2 = self.dimensionWidth();
			result2 = self.dimensionHeight();
			result2 = self.pieceCount();
			result2 = self.selectedPackageType();
			result2 = self.cost();
			result2 = self.selectedClassType();
			result2 = self.weight();
			result2 = self.disputeAmount();
			result2 = self.disputeLostAmount();

			// If this from loading data side the return as false
			if (self.isNotAtLoadingTime)
				return false;

			var returnValue = self.getBITrackChange().length > 0 ? true : false;
			if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
				self.onChangesMade(returnValue);

			return returnValue;
		});

		// Subscribe to update the UI
		self.cost.subscribe(() => {
			// If the selected item is a discount then show the negative cost
			if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70" && parseFloat(self.cost().toString()) > 0) {
				self.cost(Number(parseFloat(self.cost().toString()) * -1).toFixed(2));
			}

			costOrWeightChanged();
		});

		// Subscribe to update the UI
		self.disputeAmount.subscribe(() => {
			// If the selected item is a discount then show the negative disputeAmount
			if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70" && parseFloat(self.disputeAmount().toString()) > 0) {
				self.disputeAmount(Number(parseFloat(self.disputeAmount().toString()) * -1).toFixed(2));
			}

			costOrWeightChanged();
		});

		self.disputeLostAmount.subscribe(() => {
			// If the selected item is a discount then show the negative disputeLostAmount
			if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70" && parseFloat(self.disputeLostAmount().toString()) > 0) {
				self.disputeLostAmount(Number(self.disputeLostAmount().toString() * -1).toFixed(2));
			}

			costOrWeightChanged();
		});

		// Subscribe to update the UI
		self.weight.subscribe(() => {
			costOrWeightChanged();
		});

		// Subscribe to update the UI
		self.pieceCount.subscribe(() => {
			costOrWeightChanged();
		});

		// Subscribe to change the cost as negative if that is discount
		self.selectedItemTypes.subscribe(() => {
			if (self.cost() && self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70" && parseFloat(self.cost().toString()) > 0) {
				self.cost(Number(parseFloat(self.cost().toString()) * -1).toFixed(2));
			}
			else if (self.cost() && parseFloat(self.cost().toString()) < 0) {
				self.cost(Number(parseFloat(self.cost().toString()) * -1).toFixed(2));
			}

			if (self.disputeAmount() && self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70" && parseFloat(self.disputeAmount().toString()) > 0) {
				self.disputeAmount(Number(parseFloat(self.disputeAmount().toString()) * -1).toFixed(2));
			}
			else if (self.disputeAmount() && parseFloat(self.disputeAmount().toString()) < 0) {
				self.disputeAmount(Number(parseFloat(self.disputeAmount().toString()) * -1).toFixed(2));
			}

			if (self.disputeLostAmount() && self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70" && parseFloat(self.disputeLostAmount().toString()) > 0) {
				self.disputeLostAmount(Number(parseFloat(self.disputeLostAmount().toString()) * -1).toFixed(2));
			}
			else if (self.disputeLostAmount() && parseFloat(self.disputeLostAmount().toString()) < 0) {
				self.disputeLostAmount(Number(parseFloat(self.disputeLostAmount().toString()) * -1).toFixed(2));
			}

			// If not a shipping item then do not allow user to enter the description
			if ((self.selectedItemTypes() && self.selectedItemTypes().ItemId !== "10") && (self.selectedItemTypes() && !self.isShippingItemMiscellaneous())) {
				self.userDescription(self.selectedItemTypes().ShortDescription);
			} else {
				//if(self.userDescription()!=="")
				//	self.userDescription(self.userDescription());
				//else
				self.userDescription("");
			}

			costOrWeightChanged();
		});

		// Subscribe to update the UI
		self.disputeAmount.subscribe(() => {
			costOrWeightChanged();
		});

		return self;
	}
	//#endregion Constructor

	//#region Private Methods

	// Validates all the properties for an item
	ValidateVendorBillItem() {
		if (!this.allowvalidation()) {
			return false;
		}

		if (refSystem.isObject(this.selectedItemTypes())
			|| (this.cost.length > 0)
			|| (this.pieceCount.length > 0)
			|| (this.selectedClassType.length > 0)
			|| (this.weight.length > 0)
			|| (refSystem.isString(this.dimensionLength()) && this.dimensionLength())
			|| (refSystem.isString(this.dimensionWidth()) && this.dimensionWidth())
			|| (refSystem.isString(this.dimensionHeight()) && this.dimensionHeight())
			|| (refSystem.isString(this.userDescription()) && this.userDescription())
			) {
			return true;
		}

		return false;
	}

	//#endregion Private Methods

	//#region Public Methods

	// Check validation for each line item
	public checkValidation() {
		var self = this;
		if (self.errorVendorItemDetail.errors().length != 0) {
			self.errorVendorItemDetail.errors.showAllMessages();
			return true;
		} else {
			return false;
		}
	}

	// get the item view model
	public initializeVendorBillItem(item: IVendorBillItemForInvoiceResolution) {
		var self = this;
		if (item != null) {
			self.packageName(item.PackageTypeName);
			self.id(item.Id);
			self.cost($.number((item.Cost), 2));
			self.pieceCount(item.ItemId === 10 ? item.PieceCount : null);
			self.selectedClassType(item.SelectedClassType);
			self.weight(item.ItemId === 10 ? item.Weight : null);
			self.dimensionLength(item.ItemId === 10 ? item.DimensionLength : null);
			self.dimensionWidth(item.ItemId === 10 ? item.DimensionWidth : null);
			self.dimensionHeight(item.ItemId === 10 ? item.DimensionHeight : null);
			self.userDescription(item.UserDescription);
			self.selectedPackageType(item.PackageTypeId);
			self.disputeAmount($.number((item.DisputeAmount), 2));
			self.disputeLostAmount($.number((item.DisputeLostAmount), 2));
			self.proNo(item.PRONo);
			self.itemName(item.ItemName);
			//self.SetBITrackChange(self);
		}
	}

	public initializeTotal(totalCost: number, totalPieces: number, totalWeight: number, totalDisputeCost: number) {
		var self = this;

		self.packageName('');
		self.id(0);
		self.cost($.number((totalCost), 2));
		self.pieceCount(totalPieces);
		self.selectedClassType(null);
		self.weight(totalWeight);
		self.dimensionLength(null);
		self.dimensionWidth(null);
		self.dimensionHeight(null);
		self.userDescription('');
		self.selectedPackageType(0);
		self.disputeAmount($.number((totalDisputeCost), 2));
		self.disputeLostAmount(0);
		self.proNo('Total');
		self.itemName('');
		self.totalRow('rebillTotal');
	}
	//To populate the Vendor Bill Items.
	public populateVendorBillItem(item: VendorBillItemsModel) {
		var self = this;
		// This will prevent to detect the changes at first time
		self.isNotAtLoadingTime = true;
		if (item != null) {
			self.id(item.id());
			self.cost(item.cost());
			self.pieceCount(item.pieceCount());
			self.selectedClassType(item.selectedClassType());
			self.weight(item.weight());
			self.dimensionLength(item.dimensionLength());
			self.dimensionWidth(item.dimensionWidth());
			self.dimensionHeight(item.dimensionHeight());
			self.userDescription(item.userDescription());
			self.selectedPackageType(item.selectedPackageType());
			self.disputeAmount(item.disputeAmount());
			self.disputeLostAmount(item.disputeLostAmount());
			self.SetBITrackChange(self);
			self.proNo(item.proNo());
			self.itemName(item.itemName());
			self.packageName(item.packageName());
		}
		// This will stop detecting the changes
		self.isNotAtLoadingTime = false;
	}

	// this function is used to convert formatted cost with decimal(Two Place).
	public formatDecimalNumber(field) {
		var self = this;
		var costValue = field();
		if (costValue) {
			var stringParts = costValue + '';

			var isNegative = stringParts.indexOf("-") !== -1;

			var parts = stringParts.split('.');

			// take only two decimal point
			if (parts && parts.length > 2) {
				costValue = parts[0] + '.' + parts[1];
			}

			///parts.length is length after split the cost value
			///costValue length total length of textbox value
			///with in this if condition we will check is it without decimal or not
			if (parts.length === 1 && costValue && costValue.length > 8) {
				costValue = costValue.replace(/[^0-9]/g, '');
				costValue = costValue.replace(/(\d{8})(\d{2})/, "$1.$2");
				field(costValue);
			}
			if (parts.length === 1 || (parts && (parts.length === 0 || parts[1] || parts[1] === ''))) {
				if (costValue && costValue.length >= 1 && costValue.length <= 8) {
					if (/\.\d$/.test(costValue)) {
						costValue += "0";
					}
					else if (/\.$/.test(costValue)) {
						costValue += "00";
					}
					else if (!/\.\d{2}$/.test(costValue)) {
						costValue += ".00";
					}
				}
			}

			if (isNegative === true) {
				costValue = '-' + (costValue + '').split("-")[1];
			}

			field(costValue);
		}
	}

	//sets the tracking extension for BI required fields
	SetBITrackChange(self) {
		self.selectedItemTypes.extend({ trackChange: true });
		self.userDescription.extend({ trackChange: true });
		self.cost.extend({ trackChange: true });
		self.selectedClassType.extend({ trackChange: true });
		self.weight.extend({ trackChange: true });
		self.dimensionLength.extend({ trackChange: true });
		self.dimensionWidth.extend({ trackChange: true });
		self.dimensionHeight.extend({ trackChange: true });
		self.pieceCount.extend({ trackChange: true });
		self.selectedPackageType.extend({ trackChange: true });
		self.disputeAmount.extend({ trackChange: true });
		self.disputeLostAmount.extend({ trackChange: true });
	}

	public cleanup() {
		for (var property in self) {
			delete self[property];
		}
	}

	//#endregion Public Methods
}

//return SalesOrderRebillVendorBillItemViewModel;