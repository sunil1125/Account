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
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refEnums = require('services/models/common/Enums');
import refVendorBillClient = require('services/client/VendorBillClient');
import refMapLocation = require('services/models/common/MapLocation');
import refCommon = require('services/client/CommonClient');
//#endregion

//#region KO Validation
ko.validation.configure({
	decorateElement: true,
	registerExtenders: true,
	messagesOnModified: true,
	insertMessages: true,
	messageTemplate: null
});
//#endregion KO Validation

/**
** <summary>
** Purchase Order Item View Model.
** </summary>
** <createDetails>
** <by>Achal Rastogi</by > <date>17th July, 2014 </date>
** </createDetails>
** <changeHistory>
** <id>US21290</id> <by>Shreesha Adiga</by> <date>17-03-2016</date><description>Select item based on itemid and accessorial id</description>
** <id>US21290</id> <by>Shreesha Adiga</by> <date>23-03-2016</date><description>If item selected based on itemid and accessorialId is undefined, then select based only on itemId</description>
** <id>US24389</id> <by>Shreesha Adiga</by> <date>31-08-2016</date><description>Populate TL accessorials if Truckload Bill checkbox is checked; Made the updateTotalCostAndWeight public</description>
** <id>US24671</id> <by>Shreesha Adiga</by> <date>12-09-2016</date><description>Validate multiple Base Rate items for Truckload PO to SO</description>
** </changeHistory>
**/
export class PurchaseOrderItemViewModel {
	//#region Members
	purchaseOrderItemsList: KnockoutObservableArray<PurchaseOrderItemsModel> = ko.observableArray([]);
	onAdd: () => void;
	classTypes: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	packageTypes: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	shipmentItemTypes: KnockoutObservableArray<IShipmentItemType> = ko.observableArray([]);
	markAllForDelete: () => boolean;
	canDelete: KnockoutComputed<boolean>;
	isAllCheckedForDelete: KnockoutObservable<boolean> = ko.observable(false);
	IsNumber: (that, event) => void;
	IsValidationShown: boolean = false;
	error: KnockoutValidationErrors;
	isCurrency: (that, event) => void;
	itemCliked: () => boolean;
	costOrWeightChanged: (totalCost: number, totalWeight: number, totalPices: number) => any;
	//For removing item
	removeLineItem: (lineItem: PurchaseOrderItemsModel) => void;
	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	public onChangesMadeInItem: (dirty: boolean) => any;
	public deletePurchaseOrderItemsList: () => any;
	private selectedLineItem: PurchaseOrderItemsModel;
	private checkMsgDisplay: boolean = true;
	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	returnValue: KnockoutObservable<boolean> = ko.observable(false);
	isNotAtLoadingTime: boolean = false;
	//## To trigger when when 'TAB' press from reference number.
	keyListenerCallback: () => any;

	//## To trigger when when 'TAB' press from reference number.
	isTabPress: (that, event) => void;

	// Accepts only numeric with decimal input
	NumericInputWithDecimalPoint: INumericInput;
	// ##START: US24671
	serviceType: string;
	// ##END: US24671
	//#endregion

	//#region Constructors
	constructor(costOrWeightChangedCallBack: (totalCost: number, totalWeight: number, totalPices: number) => any, keyListenerCallback: () => any) {
		var self = this;

		self.costOrWeightChanged = costOrWeightChangedCallBack;
		self.keyListenerCallback = keyListenerCallback;

		//set the flag allowdecimal: true to accepts decimals
		self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(true) };

		// initialize the Add command
		self.onAdd = function () {
			var shipmentItemTypesLength: number = self.shipmentItemTypes().length;
			if ((shipmentItemTypesLength)) {
				// ##START: US24671
				var result: IShipmentItemType;
				// ##END: US24671
				self.purchaseOrderItemsList.push(new PurchaseOrderItemsModel(result, () => { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem));
			}

			self.onChangesMadeInItem(true);
			// Uncheck the top check box for delete as we are adding a new item which is not selected
			if (self.isAllCheckedForDelete())
				self.isAllCheckedForDelete(false);
		};

		// Making sure that user can delete any item or not, enable only if an item is sleeted
		self.canDelete = ko.computed(() => {
			var isAnySelected = false;

			// Check if any one item is selected for deletion
			self.purchaseOrderItemsList().forEach(function (item) {
				if (item.isMarkForDeletion()) {
					isAnySelected = true;
				}
			});
			return isAnySelected;
		});

		// Making sure that input is number only
		self.IsNumber = (data, event) => {
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

			self.purchaseOrderItemsList().forEach(function (item) {
				item.isMarkForDeletion(isAllChecked);
			});
			return true;
		};

		// Handles the checkbox click event for each item
		self.itemCliked = function () {
			// Check if there is no item in the list make it false
			if (self.purchaseOrderItemsList().length === 0) {
				self.isAllCheckedForDelete(false);
				return true;
			}

			// Get an item which is not selected for deletion
			var isAnyitemNotMarkedForDeletion = $.grep(self.purchaseOrderItemsList(), function (e) { return e.isMarkForDeletion() == false; });

			if (isAnyitemNotMarkedForDeletion != undefined && isAnyitemNotMarkedForDeletion.length > 0) {
				self.isAllCheckedForDelete(false);
			}
			else {
				self.isAllCheckedForDelete(true);
			}

			return true;
		};

		//Removing line when click on delete image
		self.removeLineItem = function (lineItem: PurchaseOrderItemsModel) {
			// Delete from the collection
			self.selectedLineItem = lineItem;
			self.deletePurchaseOrderItemsList();
			self.onChangesMadeInItem(true);

		};

		// Getting called by each and every item in the list
		self.onChangesMadeInItem = function (dirty: boolean) {

			if (self.isNotAtLoadingTime)
				return false;

			if (self.onChangesMade && typeof (self.onChangesMade) === 'function') {
				self.onChangesMade(dirty);
				self.returnValue(dirty);
			}
		};

		// Get all the details which is needed for this view
		self.beforeBind();

		self.isTabPress = (data, event) => {
			var charCode = (event.which) ? event.which : event.keyCode;
			if ((charCode === 9)) { //if 'TAB' press.
				var rowCount = $('#tblPurchaseOrderItems').find("tbody tr").length;
				var index = event.target.id;
				if (rowCount === +index) {
					self.keyListenerCallback();
				}
			}
			return true;
		}

		// for calling purchase Order Items List remove
		self.deletePurchaseOrderItemsList = () => {
			self.checkMsgDisplay = true;
			self.purchaseOrderItemsList.remove(self.selectedLineItem);
			self.updateTotalCostAndWeight();
		}

		//To check if Msg is clicked
		self.checkMsgClick = () => {
			self.checkMsgDisplay = true;
		}

		// to Check if Msg is hidden or closed
		self.checkMsgHide = () => {
			self.checkMsgDisplay = true;
		}

		return self;
	}
	//#endregion

	//#region Internal Methods
	//#region Public Methods
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
			// ##START: US24389
			self.populateShipmentItemsDropdown('LTL');
			// ##END: US24389
		}
		self.addDefaultItems();
	}

	/*
	** <createDetails>
	** <id>US24389</id> <by>Shreesha Adiga</by> <date>31-08-2016</date> <description>Populate Items dropdown based on the service type</description>
	** </createDetails>
	*/
	public populateShipmentItemsDropdown(type: string) {
		var self = this;

		_app.trigger(
			typeof type !== 'undefined' && type === 'Truckload'
			? "GetTruckloadAccessorials"
			: "GetItemsTypes",
			function (items: IShipmentItemType) {
				// ##START: US24671
				self.serviceType = type;
				// ##END: US24671
				self.shipmentItemTypes.removeAll();
				self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
			});
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

		if (self.purchaseOrderItemsList().length > 0) {
			self.purchaseOrderItemsList().forEach(function (item) {
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

	// to load the vendor bill item details
	public initializePurchaseOrderItemDetails(items: Array<IVendorBillItem>) {
		var self = this;
		self.isNotAtLoadingTime = true;

		if (self.purchaseOrderItemsList != null)
			self.purchaseOrderItemsList.removeAll();

		if (items != null) {
			for (var i = 0; i < items.length; i++) {

				//##START: US21290
				var item = $.grep(self.shipmentItemTypes(), function (e) {
					return e.ItemId === items[i].ItemId.toString()
						&& (e.AccessorialId == null || items[i].AccessorialId == 0 || e.AccessorialId == items[i].AccessorialId);
				})[0];

				if (typeof item === "undefined" || item == null) {
					item = $.grep(self.shipmentItemTypes(), function (e) {
						return e.ItemId === items[i].ItemId.toString();
					})[0];
				}

				//##END: US21290

				var vendorItem = new PurchaseOrderItemsModel(item, function () { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem);
				vendorItem.initializePurchaseOrderItem(items[i]);
				// ##START: US24671
				vendorItem.serviceType = self.serviceType;
				// ##END: US24671
				self.purchaseOrderItemsList.push(vendorItem);
			}
		}

		self.isNotAtLoadingTime = false;
	}

	//To Populate the vendor bill items.  items: VendorBillItemViewModel
	public populateItemsDetails(items: PurchaseOrderItemsModel) {
		var self = this;

		//self.addExistingItem(items.vendorBillItemsList);
	}

	//#endregion Public Methods

	//#region Private methods

	public addExistingItem(items: KnockoutObservableArray<PurchaseOrderItemsModel>) {
		var self = this;

		self.purchaseOrderItemsList.removeAll();
		if (items && typeof items === 'function') {
			items().forEach(function (item) {
				self.purchaseOrderItemsList.push(item);
			});
		}
	}

	// Updates the main view as per the change in the items
	// ##START: US24389
	public updateTotalCostAndWeight() {
		// ##END: US24389
		var self = this;

		var totalCost: number = 0.0;
		var totalweight: number = 0.0;
		var totalPices: number = 0.0;

		// ##START: US24671
		var shippingServiceCount = 0;
		// ##END: US24671

		self.purchaseOrderItemsList().forEach(function (item) {
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

			// ##START: US24671
			// validate multiple Base Rate items for Truckload PO to SO
			if (self.serviceType === 'Truckload' && typeof item.selectedItemTypes() !== 'undefined' && item.selectedItemTypes().ItemId === '10') {
				shippingServiceCount++;
				item.isShippingServiceCountGreaterThanOne(shippingServiceCount > 1);
			}
			else {
				item.isShippingServiceCountGreaterThanOne(false);
			}
			// ##END: US24671
		});

		self.costOrWeightChanged(totalCost, totalweight, totalPices);
	}

	// Adds default line items first time
	public addDefaultItems() {
		var self = this;

		if (self.purchaseOrderItemsList !== null) {
			self.purchaseOrderItemsList.removeAll();
		}

		var shipingItem = $.grep(self.shipmentItemTypes(), function (e) { return e.ItemId === "10"; })[0];
		var discountItem = $.grep(self.shipmentItemTypes(), function (e) { return e.ItemId === "70"; })[0];
		var fuelItem = $.grep(self.shipmentItemTypes(), function (e) { return e.ItemId === "30"; })[0];

		self.purchaseOrderItemsList.push(new PurchaseOrderItemsModel(shipingItem, function () { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem)); // Shipping Service
		self.purchaseOrderItemsList.push(new PurchaseOrderItemsModel(discountItem, function () { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem)); // Discount
		self.purchaseOrderItemsList.push(new PurchaseOrderItemsModel(fuelItem, function () { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem)); // Fuel charge
	}

	//#endregion
	//#endregion

	//#region Life Cycle Event
	public activate() {
		return true;
	}
	//#endregion

	public cleanup() {
		var self = this;

		self.purchaseOrderItemsList().forEach(item => {
			item.cleanup();
			delete item;
		});

		self.purchaseOrderItemsList.removeAll();

		for (var property in self) {
			delete self[property];
		}
	}
}

/*
** <summary>
** Each line item view model
** </summary>
** <createDetails>
** <id>US8221</id> <by>Avinash Dubey</by> <date>04-21-2014</date>
** </createDetails>
** <changeHistory>
** <id>US21290</id> <by>Shreesha Adiga</by> <date>17-03-2016</date><description>Show longdescription instead of short description in item dropdown and description input</description>
** <id>US21290</id> <by>Shreesha Adiga</by> <date>22-03-2016</date><description>Show AccessorialDescription instead of longdescription in description input</description>
** <id>US24671</id> <by>Shreesha Adiga</by> <date>12-09-2016</date><description>Validate multiple Base Rate items for Truckload PO to SO</description>
** </changeHistory>
*/
export class PurchaseOrderItemsModel {
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
	errorPurchaseOrderItemDetail: KnockoutValidationGroup;
	selectedPackageType: KnockoutObservable<number> = ko.observable();
	disputeAmount: KnockoutObservable<number> = ko.observable();
	disputeLostAmount: KnockoutObservable<number> = ko.observable();
	accessorialId: KnockoutObservable<number> = ko.observable();
	accessorialCode: KnockoutObservable<string> = ko.observable();
	// for tracking changes
	getBITrackChange: () => string[];
	isBIDirty: KnockoutComputed<boolean>;
	onChangesMade: (dirty: boolean) => any;
	isNotAtLoadingTime: boolean = false;

	// ##START: US24671
	isShippingServiceCountGreaterThanOne: KnockoutObservable<boolean> = ko.observable(false);
	serviceType: string;
	// ##END: US24671

	//#region Constructor
	constructor(selectedType: IShipmentItemType, costOrWeightChanged: () => any, changesMade: (dirty: boolean) => any) {
		var self = this;

		// Notifies to parent view model about the changes
		self.onChangesMade = function (dirty: boolean) {
			changesMade(dirty);
		};
		self.selectedItemTypes(selectedType);

		self.id = ko.observable(0);

		// Set the description for all the other items rather than shipping
		if (refSystem.isObject(selectedType)) {
			if (selectedType.ItemId !== "10") {
				self.userDescription(selectedType.ShortDescription);
			}
		}

		// Handles the visibility of some of the fields like class, weight
		self.isShippingItem = ko.computed(function () {
			return (self.selectedItemTypes() !== undefined
				&& self.selectedItemTypes().ItemId === "10");
		});

		// Handles the visibility of some of the fields like class, weight
		self.isShippingItemMiscellaneous = ko.computed(() => {
			return ((self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemId)
				|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemIdMiscellaneousFee)
				|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemIdCorrectedInvocingFee)
				|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reclass)
				|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reclassfee)
				|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reweigh)
				|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ReweighANDReclass)
				|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reweighfee))
		});

		//#region Validation Rules

		self.cost.extend({
			required: {
				message: 'Cost is required.',
				onlyIf: function () {
					return (self.validatePurchaseOrderItem() || (self.id() === 1 && self.allowvalidation()) || self.selectedItemTypes() === undefined);
				}
			},
			number: true
		});

		self.selectedItemTypes.extend({
			required: {
				message: 'Please Choose Item Type.',
				onlyIf: function () {
					return (self.validatePurchaseOrderItem() || (self.id() === 1 && self.allowvalidation()) || self.selectedItemTypes() === undefined);
				}
			},
			// ##START: US24671
			validation: {
				validator: function () {
					return !(self.isShippingServiceCountGreaterThanOne());
				},
				message: ApplicationMessages.Messages.BaseRateCantBeAddedMultipleTimes,
			}
			// ##END: US24671
		});

		self.userDescription.extend({
			required: {
				message: 'Description is required.',
				onlyIf: function () {
					return (self.validatePurchaseOrderItem() || (self.id() === 1 && self.allowvalidation()));
				}
			}
		});

		//#endregion Validation Rules

		// The vendors item bill object
		self.errorPurchaseOrderItemDetail = ko.validatedObservable({
			selectedItemTypes: self.selectedItemTypes,
			cost: self.cost,
			pieceCount: self.pieceCount,
			selectedClassType: self.selectedClassType,
			weight: self.weight,
			userDescription: self.userDescription,
			selectedItemTypes: self.selectedItemTypes
		});

		self.SetBITrackChange(self);

		self.getBITrackChange = function () {
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
		self.cost.subscribe(function () {
			// If the selected item is a discount then show the negative cost
			if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70" && parseFloat(self.cost().toString()) > 0) {
				self.cost(Number(parseFloat(self.cost().toString()) * -1).toFixed(2));
			}

			costOrWeightChanged();
		});

		// Subscribe to update the UI
		self.weight.subscribe(function () {
			costOrWeightChanged();
		}); // Subscribe to update the UI
		self.pieceCount.subscribe(function () {
			costOrWeightChanged();
		});

		// Subscribe to change the cost as negative if that is discount
		self.selectedItemTypes.subscribe(function () {
			if (self.cost() && self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70" && parseFloat(self.cost().toString()) > 0) {
				self.cost(Number(parseFloat(self.cost().toString()) * -1).toFixed(2));
			}
			else if (self.cost() && parseFloat(self.cost().toString()) < 0) {
				self.cost(Number(parseFloat(self.cost().toString()) * -1).toFixed(2));
			}

			// If not a shipping item then do not allow user to enter the description
			if (self.selectedItemTypes() && self.selectedItemTypes().ItemId !== "10") {
				// ##START: US21290
				self.userDescription(self.selectedItemTypes().AccessorialDescription);
				// ##END: US21290
			} else {
				self.userDescription("");
			}

			costOrWeightChanged();
		});

		return self;
	}
	//#endregion Constructor

	//#region Private Methods

	// Validates all the properties for an item
	validatePurchaseOrderItem() {
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
		if (self.errorPurchaseOrderItemDetail.errors().length != 0) {
			self.errorPurchaseOrderItemDetail.errors.showAllMessages();
			return true;
		} else {
			return false;
		}
	}

	// get the item view model
	public initializePurchaseOrderItem(item: IVendorBillItem) {
		var self = this;
		if (item != null) {
			self.id(item.Id);
			self.cost(($.number((item.Cost), 2)).replace(/,/g, ""));
			self.pieceCount(item.ItemId === 10 ? item.PieceCount : 0);
			self.selectedClassType(item.SelectedClassType);
			self.weight(item.Weight);
			self.dimensionLength(item.DimensionLength);
			self.dimensionWidth(item.DimensionWidth);
			self.dimensionHeight(item.DimensionHeight);
			self.userDescription(item.UserDescription);
			self.selectedPackageType(item.PackageTypeId);
			self.disputeAmount(parseFloat(item.DisputeAmount.toString().replace(/,/g, "")));
			self.disputeLostAmount(parseFloat(item.DisputeLostAmount.toString().replace(/,/g, "")));
			if (item.AccessorialId) {
				self.accessorialId(item.AccessorialId);
			}
			if (item.AccessorialCode) {
				self.accessorialCode(item.AccessorialCode);
			}
			//self.SetBITrackChange(self);
		}
	}

	//To populate the Vendor Bill Items.
	public populateVendorBillItem(self, item: PurchaseOrderItemsModel) {
		var self = this;
		// This will prevent to detect the changes at first time
		self.isNotAtLoadingTime = true;
		if (item != null) {
			self.id(item.id());
			//var costWithoutComma = item.cost().toString();
			//self.cost(+costWithoutComma.replace(/,/g, ""));
			self.cost(item.cost().replace(/,/g, ""));
			self.pieceCount(item.pieceCount());
			self.selectedClassType(item.selectedClassType());
			self.weight(item.weight());
			self.dimensionLength(item.dimensionLength());
			self.dimensionWidth(item.dimensionWidth());
			self.dimensionHeight(item.dimensionHeight());
			self.userDescription(item.userDescription());
			self.selectedPackageType(item.selectedPackageType());
			self.disputeAmount(parseFloat(item.disputeAmount().toString().replace(/,/g, "")));
			self.disputeLostAmount(parseFloat(item.disputeLostAmount().toString().replace(/,/g, "")));
			if (item.accessorialId()) {
				self.accessorialId(item.accessorialId());
			}
			if (item.accessorialCode() !== undefined) {
				self.accessorialCode(item.accessorialCode());
			}
			self.SetBITrackChange(self);
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
		var self = this;

		self.cost.extend({ validatable: false });
		self.selectedItemTypes.extend({ validatable: false });
		self.userDescription.extend({ validatable: false });
		self.selectedClassType.extend({ validatable: false });
		self.selectedPackageType.extend({ validatable: false });
		self.weight.extend({ validatable: false });
		self.pieceCount.extend({ validatable: false });

		for (var property in self) {
			delete self[property];
		}
	}

	//#endregion Public Methods
}