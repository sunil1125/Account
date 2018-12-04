/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

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
import refEdi210SubBillItemModel = require('board/Edi210SubBillItemModel');
import refBoardsClient = require('services/client/BoardsClient');

/*
** <summary>
** Holds the model for Edi210 corrected and duplicate.
** </summary>
** <createDetails>
** <id></id> <by></by> <date></date>
** </createDetails>
** <changeHistory>
** <id>US26886</id> <by>Vasanthakumar</by> <date>14-02-2017</date> <description>Acct: SS Item Selection form Corrected & Duplicate Exception Board</description>
** </changeHistory>
*/
export class Edi210CarrierExceptionSubBillItemView {
	//#region Members
	boardClient: refBoardsClient.BoardsClientCommands = new refBoardsClient.BoardsClientCommands();
	vendorBillItemsList: KnockoutObservableArray<refEdi210SubBillItemModel.Models.Edi210SubBillItemModel> = ko.observableArray([]);
	onAdd: () => void;
	classTypes: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	packageTypes: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	shipmentItemTypes: KnockoutObservableArray<IShipmentItemType> = ko.observableArray([]);
	itemCodeANSICodeList: KnockoutObservableArray<IItemCodeDescriptionStandardMappings> = ko.observableArray([]);
	itemCodeCarrierCodeList: KnockoutObservableArray<IItemCodeDescriptionStandardMappings> = ko.observableArray([]);
	markAllForDelete: () => boolean;
	canDelete: KnockoutComputed<boolean>;
	isAllCheckedForDelete: KnockoutObservable<boolean> = ko.observable(false);
	IsNumber: (that, event) => void;
	IsValidationShown: boolean = false;
	error: KnockoutValidationErrors;
	isCurrency: (that, event) => void;
	itemCliked: () => boolean;
	costOrWeightChanged: (totalCost: number, totalWeight: number, totalPices: number, totalDisputeAmount: number) => any;
	//For removing item
	removeLineItem: (lineItem: refEdi210SubBillItemModel.Models.Edi210SubBillItemModel) => void;
	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	public onChangesMadeInItem: (dirty: boolean) => any;
	public deleteVendorBillItemsList: () => any;
	private selectLineItem: refEdi210SubBillItemModel.Models.Edi210SubBillItemModel;
	private checkMsgDisplay: boolean = true;
	public checkMsgClick: () => any;
	public checkMsgHide: () => any;

	public isEnable: KnockoutObservable<boolean> = ko.observable(true);

	returnValue: KnockoutObservable<boolean> = ko.observable(false);
	isNotAtLoadingTime: boolean = false;
	// keep the value for enable and disable dispute amount and  dispute lost amount
	isDisputeAmountEditable: KnockoutObservable<boolean> = ko.observable(false);
	isDisputeLostAmountEditable: KnockoutObservable<boolean> = ko.observable(false);
	// keep the value for show/hide dispute amount section
	isDisputeAmountVisible: KnockoutObservable<boolean> = ko.observable(false);
	//dynamic css classes
	descColCssClass: KnockoutComputed<string>;
	descTextValidCssClass: KnockoutComputed<string>;
	descTextNotValidCssClass: KnockoutComputed<string>;
	//## To trigger when when 'TAB' press from reference number.
	keyListenerCallback: () => any;

	//## To trigger when when 'TAB' press from reference number.
	isTabPress: (that, event) => void;

	// Utility class object
	CommonUtils: CommonStatic = new Utils.Common();

	// Accepts only numeric with decimal input
	NumericInputWithDecimalPoint: INumericInput;

	//
	vbTotalCost: KnockoutObservable<number> = ko.observable(0);
	vbTotalDisputeAmount: KnockoutObservable<number> = ko.observable(0);
	vbTotalDisputeLostAmount: KnockoutObservable<number> = ko.observable(0);
	vbTotalWeight: KnockoutObservable<number> = ko.observable(0);
	shipperAndDiscountCost: KnockoutObservable<number> = ko.observable(0);

	//#endregion

	//#region Constructor
	// Initialize the VendorBillItemViewModel
	constructor() {
		var self = this;

		//self.costOrWeightChanged = costOrWeightChangedCallBack;
		//self.keyListenerCallback = keyListenerCallback;
		//set the flag allowdecimal: true to accepts decimals
		self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(true) };

		self.GetANSICodeORCarrierCode();

		// initialize the Add command
		self.onAdd = function () {
			var shipmentItemTypesLength: number = self.shipmentItemTypes().length;
			if ((shipmentItemTypesLength)) {
				var result = $.grep(self.shipmentItemTypes(), function (e) { return e.ItemId === "10"; })[0];
				self.vendorBillItemsList.push(new refEdi210SubBillItemModel.Models.Edi210SubBillItemModel(result, function () { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem, self.isEnable()));
			}

			self.onChangesMadeInItem(true);
			// Uncheck the top check box for delete as we are adding a new item which is not selected
			if (self.isAllCheckedForDelete())
				self.isAllCheckedForDelete(false);
		}; // Making sure that user can delete any item or not, enable only if an item is sleeted
		self.canDelete = ko.computed(function () {
			var isAnySelected = false;

			// Check if any one item is selected for deletion
			self.vendorBillItemsList().forEach(function (item) {
				if (item.isMarkForDeletion()) {
					isAnySelected = true;
				}
			});
			return isAnySelected;
		}); // Making sure that input is number only
		self.IsNumber = function (data, event) {
			var charCode = (event.which) ? event.which : event.keyCode;

			//to allow copy in firefox
			if (event.ctrlKey && (charCode == 99 || charCode == 67)) {
				return true;
			}
			if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
				return false;
			}
			return true;
		}; // Check uncheck all the items as per the user selection}
		self.markAllForDelete = function () {
			var isAllChecked = self.isAllCheckedForDelete();

			self.vendorBillItemsList().forEach(function (item) {
				item.isMarkForDeletion(isAllChecked);
			});
			return true;
		}; // Handles the checkbox click event for each item
		self.itemCliked = function () {
			// Check if there is no item in the list make it false
			if (self.vendorBillItemsList().length === 0) {
				self.isAllCheckedForDelete(false);
				return true;
			}

			// Get an item which is not selected for deletion
			var isAnyitemNotMarkedForDeletion = $.grep(self.vendorBillItemsList(), function (e) { return e.isMarkForDeletion() == false; });

			if (isAnyitemNotMarkedForDeletion != undefined && isAnyitemNotMarkedForDeletion.length > 0) {
				self.isAllCheckedForDelete(false);
			}
			else {
				self.isAllCheckedForDelete(true);
			}

			return true;
		};

		//Removing line when click on delete image
		self.removeLineItem = function (lineItem: refEdi210SubBillItemModel.Models.Edi210SubBillItemModel) {
			// Delete from the collection
			self.selectLineItem = lineItem;
			self.deleteVendorBillItemsList()
                self.onChangesMadeInItem(true);
		};
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
		}; // Get all the details which is needed for this view
		//self.beforeBind();

		//#region Computed css classes based on Dispute Amount
		self.descColCssClass = ko.computed(function () {
			if (self.isDisputeAmountVisible()) {
				return 'width - percent - 16';
			}
			else {
				return 'width - percent - 35';
			}
		})

		self.descTextValidCssClass = ko.computed(function () {
			if (self.isDisputeAmountVisible()) {
				return '91%';
			}
			else {
				return '96%';
			}
		});

		self.descTextNotValidCssClass = ko.computed(function () {
			if (self.isDisputeAmountVisible()) {
				return '89.6%';//78
			}
			else {
				return '85.5%';//82
			}
		});

		self.isTabPress = (data, event) => {
			var charCode = (event.which) ? event.which : event.keyCode;
			if ((charCode === 9)) { //if 'TAB' press.
				var rowCount = $('#tblVendorBillItems').find("tbody tr").length;
				var index = event.target.id;
				if (rowCount === +index) {
					//self.keyListenerCallback();
				}
			}
			return true;
		}

		// for calling vendor Bill Items List
		self.deleteVendorBillItemsList = () => {
			self.checkMsgDisplay = true;
			self.vendorBillItemsList.remove(self.selectLineItem);
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
		//#endregion

		return self;
	}

	//#endregion Constructor

	//#region Public Methods

	// Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
	public attached() {
		_app.trigger('viewAttached');
	}

	//The composition engine will execute it prior to calling the binder.
	public activate() {
		return true;
	}

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
		//self.addDefaultItems();
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
		// Delete from the collection
		if (self.vendorBillItemsList().length > 0) {
			self.vendorBillItemsList().forEach(function (item) {
				if (!item.selecteditemCodeANSICode() && !item.selecteditemCodesCarrierID()) {
					item.mappedCode("");
				}

				if (item.checkValidation()) {
					isInvalid = true;
				}
			});

			if (self.vbTotalCost() <= 0) {
				isInvalid = true;

				var toastrOptions: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 5,
					fadeOut: 5,
					typeOfAlert: "",
					title: ""
				}
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, "Total cost should be greater than 0", "info", null, toastrOptions);
			}
		}

		return isInvalid;
	}

	// to load the vendor bill item details
	public initializeVendorBillItemDetails(items: Array<IVendorBillItem>, isDisputeAmountEditable?: boolean, isDisputeLostAmountEditable?: boolean, enable?: boolean) {
		var self = this;
		self.isNotAtLoadingTime = true;
		//self.isDisputeAmountVisible(true);
		//self.isDisputeAmountEditable(isDisputeAmountEditable);
		//self.isDisputeLostAmountEditable(isDisputeLostAmountEditable);
		self.isEnable(!enable);
		if (self.vendorBillItemsList != null)
			self.vendorBillItemsList.removeAll();

		var totalShippingAndDiscountCost = 0.0;

		if (items != null) {
			for (var i = 0; i < items.length; i++) {
				if (items[i].ItemId === 10 || items[i].ItemId === 70) {
					var costWithoutComma = items[i].Cost.toString();
					var check = costWithoutComma.indexOf(",");
					if (check === -1) {
						totalShippingAndDiscountCost += parseFloat(items[i].Cost.toString());
					} else {
						//For removing comma before addition because parseFloat is not taking digit after comma at adding time
						totalShippingAndDiscountCost += parseFloat(costWithoutComma.replace(/,/g, ""));
					}
				}
			}
		}

		if (items != null && items.length != 0) {
			for (var i = 0; i < items.length; i++) {
				var item = $.grep(self.shipmentItemTypes(), function (e) { return e.ItemId === items[i].ItemId.toString(); })[0];
				var vendorItem = new refEdi210SubBillItemModel.Models.Edi210SubBillItemModel(item, function () { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem, isDisputeAmountEditable, isDisputeLostAmountEditable, self.isEnable());

				if (items[i].ItemId === 10 && typeof Utils.Constants.ShipingServiceANSICode !== "undefined") {
					items[i].SpecialChargeOrAllowanceCode = Utils.Constants.ShipingServiceANSICode;
				}

				if (items[i].SpecialChargeOrAllowanceCode != "" && items[i].SpecialChargeOrAllowanceCode != null) {
					var code = $.grep(self.itemCodeANSICodeList(), function (e) { return e.Code === items[i].SpecialChargeOrAllowanceCode; })[0];

					if (code === undefined || code === null) {
						code = $.grep(self.itemCodeCarrierCodeList(), function (e) { return e.Code === items[i].SpecialChargeOrAllowanceCode; })[0];
					}

					if (typeof(code) !== "undefined" && code !== null)
						vendorItem.selecteditemCodeANSICode(code);
				}
				vendorItem.initializeVendorBillItem(items[i], self.isEnable(), totalShippingAndDiscountCost);
				self.vendorBillItemsList.push(vendorItem);
			}
		}
		else {
			self.addDefaultItems();
		}

		self.updateTotalCostAndWeight();
		self.isNotAtLoadingTime = false;
	}

	public GetANSICodeORCarrierCode() {
		var self = this;
		self.boardClient.GetAllCodeDescriptionStandardMappings((dataCode) => {
			if (dataCode) {
				var self = this;
				self.itemCodeANSICodeList.removeAll();
				self.itemCodeANSICodeList.push.apply(self.itemCodeANSICodeList, dataCode);
			}
		}, () => { });
	}

	//
	public GetCarrierCode(carrierId: number) {
		var self = this;
		self.boardClient.GetCarrierItemCodeMappingBasedonCarrierID(carrierId, (dataCode) => {
			if (dataCode) {
				var self = this;
				self.itemCodeCarrierCodeList.removeAll();
				self.itemCodeCarrierCodeList.push.apply(self.itemCodeCarrierCodeList, dataCode);
			}
		}, () => { });
	}

	////To Populate the vendor bill items.  items: VendorBillItemViewModel
	//public populateItemsDetails(items: VendorBillItemViewModel) {
	//    var self = this;
	//    self.addExistingItem(items.vendorBillItemsList);
	//}

	//#endregion Public Methods

	//#region Private methods

	public addExistingItem(items: KnockoutObservableArray<refEdi210SubBillItemModel.Models.Edi210SubBillItemModel>) {
		var self = this;

		self.vendorBillItemsList.removeAll();
		if (items && typeof items === 'function') {
			items().forEach(function (item) {
				var result = item.selectedItemTypes();
				var itemToAdd = new refEdi210SubBillItemModel.Models.Edi210SubBillItemModel(result, function () { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem);
				itemToAdd.cost(item.cost());
				itemToAdd.weight(item.weight());
				itemToAdd.pieceCount(item.pieceCount());
				itemToAdd.selectedClassType(item.selectedClassType());
				itemToAdd.dimensionHeight(item.dimensionHeight());
				itemToAdd.dimensionLength(item.dimensionLength());
				itemToAdd.dimensionWidth(item.dimensionWidth());
				itemToAdd.selectedPackageType(item.selectedPackageType());
				itemToAdd.selectedItemTypes(item.selectedItemTypes());
				itemToAdd.userDescription(item.userDescription());
				self.vendorBillItemsList.push(itemToAdd);
			});
		}
		self.updateTotalCostAndWeight();
	}

	// Updates the main view as per the change in the items
	public updateTotalCostAndWeight() {
		var self = this;

		var totalCost: number = 0.0,
			totalweight: number = 0.0,
			totalPices: number = 0.0,
			totalDisputeLostCost: number = 0.0,
			totalDisputeCost: number = 0.0,
			totalShippingAndDiscountCost: number = 0.0;

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

			if (item.selectedItemTypes().ItemId === "10" || item.selectedItemTypes().ItemId === "70") {
				if (item.cost()) {
					var costWithoutComma = item.cost().toString();
					var check = costWithoutComma.indexOf(",");
					if (check === -1) {
						totalShippingAndDiscountCost += parseFloat(item.cost().toString());
					} else {
						//For removing comma before addition because parseFloat is not taking digit after comma at adding time
						totalShippingAndDiscountCost += parseFloat(costWithoutComma.replace(/,/g, ""));
					}
				}
			}

			if (item.weight()) {
				totalweight += parseInt(item.weight().toString());
			}

			if (item.pieceCount()) {
				totalPices += parseInt(item.pieceCount().toString());
			}
		});

		//self.costOrWeightChanged(totalCost, totalweight, totalPices, totalDisputeCost);
		self.vbTotalCost($.number(totalCost, 2));
		self.vbTotalWeight(totalweight);
		self.shipperAndDiscountCost($.number(totalShippingAndDiscountCost, 2));
	}

	// Adds default line items first time
	public addDefaultItems(carrierType?: number) {
		var self = this;
		var itemToDelete = $.grep(self.vendorBillItemsList(), (item) => {
			return item.cost() === "0.00" || item.cost() === "" || item.cost() === undefined;
		});

		var itemToCheckCost = $.grep(self.vendorBillItemsList(), (item) => {
			return item.cost() !== "0.00" || item.cost() !== "" || item.cost() !== undefined;
		});

		if (typeof (carrierType) !== 'undefined' && carrierType === 3) {
			if (itemToDelete && itemToDelete.length > 0) {
				itemToDelete.forEach(function (item) {
					if ((item && item.selectedItemTypes().ItemId == '30') || (item && item.selectedItemTypes().ItemId == '70')) {
						self.vendorBillItemsList.remove(item);
					}
				});
			}
		} else {
			if (itemToDelete && itemToDelete.length === 0 && itemToCheckCost && itemToCheckCost.length > 0) {
			} else {
				if (self.vendorBillItemsList !== null) {
					self.vendorBillItemsList.removeAll();
				}

				var shipingItem = $.grep(self.shipmentItemTypes(), function (e) { return e.ItemId === "10"; })[0];
				//var discountItem = $.grep(self.shipmentItemTypes(), function (e) { return e.ItemId === "70"; })[0];
				//var fuelItem = $.grep(self.shipmentItemTypes(), function (e) { return e.ItemId === "30"; })[0];

				self.vendorBillItemsList.push(new refEdi210SubBillItemModel.Models.Edi210SubBillItemModel(shipingItem, function () { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem)); // Shipping Service
				//self.vendorBillItemsList.push(new refEdi210SubBillItemModel.Models.Edi210SubBillItemModel(discountItem, function () { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem)); // Discount
				//self.vendorBillItemsList.push(new refEdi210SubBillItemModel.Models.Edi210SubBillItemModel(fuelItem, function () { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem)); // Fuel charge
			}
		}
	}

	//#endregion
}