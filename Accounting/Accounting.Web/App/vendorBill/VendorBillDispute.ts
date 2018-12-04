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
import refValidations = require('services/validations/Validations');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refSalesOrderDisputeVendorBill = require('services/models/salesOrder/DisputeVendorBill');
import refSalesOrderVendorBillDisputeContainer = require('services/models/salesOrder/VendorBillDisputeContainer');
import refSalesOrderItemModel = require('services/models/vendorBill/VendorBillItemDetails');
import refSalesOrderShipmentRequoteReasonModel = require('services/models/salesOrder/SalesOrderShipmentRequoteReason');
import refCommon = require('services/client/CommonClient');
//#endregion

/***********************************************
  Vendor Bill Dispute ViewModel
************************************************
** <summary>
** Vendor Bill Dispute ViewModel
** </summary>
** <createDetails>
** <id></id><by>Satish</by><date>21st Jan, 2015</date>
** </createDetails>
** <changeHistory>
** <id>US20352</id> <by>Chandan Singh Bajetha</by> <date>14-01-2016</date> <description>Acct: Adjust UI for Dispute Notes Tab in Vendor Bill</description>
** <id>DE22259</id> <by>Shreesha Adiga</by> <date>22-03-2016</date><description>Select item based on itemid and accessorial id</description>
** <id>DE22259</id> <by>Shreesha Adiga</by> <date>22-03-2016</date><description>Updated accessorialId to VB item before saving dispute</description>
** <id>US22053</id> <by>Shreesha Adiga</by> <date>10-05-2016</date><description>To track whether dispute was saved from VB dispute tab</description>
** <id>US25153</id> <by>Shreesha Adiga</by> <date>20-10-2016</date><description>Changes realted to Credit Adjustment (Items Not Integrated With Mas)</description>
** <id>DE25602</id> <by>Vasanthakumar</by> <date>18-01-2017</date><description>If item id and accessorial id is zero then Credit adjustment line item is inserted in the order</description>
** </changeHistory>

***********************************************/

export class VendorBillisputeViewModel {
	//#region MEMBERS

	//For Bill Status list
	billStatusList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);

	//Bill status id for bind selected bill
	billstatuId: KnockoutObservable<number> = ko.observable();

	//Total Dispute amount
	totalDisputeAmount: KnockoutObservable<string> = ko.observable('0.00');

	//For Vendor BIll Dispute Date
	VBDisputeDate: KnockoutObservable<any> = ko.observable('');

	//Dispute Notes for Vendor BIll
	disputeNotes: KnockoutObservable<string> = ko.observable('');

	//For Header PRO Number
	proNumberHeader: KnockoutObservable<string> = ko.observable('');

	//Flag for Check is bill Status Is dispute or not
	isBillStatusDispute: KnockoutObservable<boolean> = ko.observable(false);

	//Sales Order Total Cost of item for bind in right side Vendor BIll
	salesOrderTotalCost: KnockoutObservable<string> = ko.observable('0.00');

	//Sales Order Total Pay of item for bind in right side Vendor BIll
	salesOrderTotalPayAmount: KnockoutObservable<string> = ko.observable('0.00');

	//for enable or disable save button
	isSelected: KnockoutObservable<boolean> = ko.observable(false);

	//For Validation purpose
	errorVendorBillDispute: KnockoutValidationGroup;
	NumericInputWithDecimalPoint: INumericInput;

	//Creating Reference of Dispute Vendor bill details Item model
	DisputeVendorBillItemsModel: KnockoutObservableArray<DisputeVendorBillItemsModel> = ko.observableArray([]);

	// shipment item types
	shipmentItemTypes: KnockoutObservableArray<IShipmentItemType> = ko.observableArray([]);

	vendorBillId: KnockoutObservable<number> = ko.observable(0);

	updatedDate: KnockoutObservable<any> = ko.observable('');
	// ###START: US20352
	salesOrderStatusTypes: KnockoutObservableArray<IDisputeStatus> = ko.observableArray([]);
	selectedStatusType: KnockoutObservable<number> = ko.observable();
	//selectedStatusType: KnockoutObservable<IDisputeStatus> = ko.observable();
	disputeStatusID: KnockoutObservable<number> = ko.observable(0);
	// ###END: US20352
	//Date Picker
	datepickerOptions: DatepickerOptions;
	commonUtils = new Utils.Common();
	//For sales Order client for call save and get data
	salesOrderClient: refSalesOrderClient.SalesOrderClient = new refSalesOrderClient.SalesOrderClient();
	listProgress: KnockoutObservable<boolean> = ko.observable(false);

	public callReloadVendorBill: () => any;

	disposables: Array<any> = [];

	// ##START: US25153
	itemsNotIntegratedWithMas: IShipmentItemType[] = [];
	// ##END: US25153
	//#endregion

	//#regionCONSTRUCTOR
	constructor() {
		var self = this;

		//set the flag allow decimal: true to accepts decimals
		self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(false) };

		//To set The date picker options
		self.datepickerOptions = {
			blockWeekend: true,
			blockPreviousDays: false,
			blockHolidaysDays: true,
			autoClose: true,
			placeBelowButton: false,
		};

		// ###START: US20352
		// Load all ship via if not loaded already
		var salesOrderStatusTypes: number = self.salesOrderStatusTypes().length;
		if (!(salesOrderStatusTypes)) {
			_app.trigger("GetDisputeStatusList", function (data) {
				if (data) {
					self.salesOrderStatusTypes.removeAll();
					self.salesOrderStatusTypes.push.apply(self.salesOrderStatusTypes, data);

					//if (data.DisputeStatusId.ID) {
					//	self.selectedStatusType(data.DisputeStatusId.ID);
					//}
				}
			});
		}
		// ###END: US20352

		// ##START: US25153

		if (typeof self.itemsNotIntegratedWithMas !== "undefined" && self.itemsNotIntegratedWithMas.length === 0) {
			_app.trigger("GetItemsNotIntegratedWithMas", function (items: Array<IShipmentItemType>) {
				if (items) {
					self.itemsNotIntegratedWithMas = self.itemsNotIntegratedWithMas.concat(items); // 'removeAll' and 'push' will remove the items from shell too, hence concat is used
				}
			});
		}
		// ##END: US25153

		//Validate total Dispute Amount
		self.totalDisputeAmount.extend({
			max: {
				params: 1,
				message: ApplicationMessages.Messages.InvalidTotalCost,
				onlyIf: () => {
					return (parseFloat(self.salesOrderTotalCost().toString().replace(",", "")) < parseFloat(self.totalDisputeAmount().toString()));
				}
			},
			number: true
		});

		////Validate Dispute Date
		self.VBDisputeDate.extend({
			required: {
				message: 'A valid Dispute Date is required.',
				onlyIf: () => {
					return (self.isBillStatusDispute());
				}
			}
		});

		//Validating Dispute notes
		self.disputeNotes.extend({
			required: {
				message: 'A valid Dispute Notes is required',
				onlyIf: () => {
					return (self.isBillStatusDispute());
				}
			}
		});

		//#region Error Details Object
		self.errorVendorBillDispute = ko.validatedObservable({
			VBDisputeDate: self.VBDisputeDate,
			disputeNotes: self.disputeNotes
		});
		//#endregion

		//// Subscribe to change the cost as negative if that is discount
		//self.billstatuId.subscribe(() => {
		//	if (self.billstatuId() === 3) {
		//		self.isBillStatusDispute(true);
		//	} else {
		//		self.isBillStatusDispute(false);
		//	}
		//});

		// ###START: US230352
		// selected Dispute Status
		self.selectedStatusType.subscribe((selectedStatus) => {
			self.disputeStatusID(selectedStatus);
		});
		// ###END: US20352

		return self;
	}
	//#endregion

	//#region METHODS
	//Click On Save For vendor Bill Dispute
	public onSave() {
		var self = this;
		if (self.errorVendorBillDispute.errors().length === 0) {
			self.isSelected(false);
			self.listProgress(true);

			var salesOrderDisputeVendorBillContainer = new refSalesOrderVendorBillDisputeContainer.Models.VendorBillDisputeContainer();

			// ###START: US20352
			var disputeStatus: IEnumValue = {
				ID: self.disputeStatusID(),
				Value: 'test'
			}
			salesOrderDisputeVendorBillContainer.DisputeStatusId = disputeStatus;
			// ###END: US20352

			salesOrderDisputeVendorBillContainer.DisputeVendorBill = self.getSalesOrderDisputeVendorBillDetails();
			salesOrderDisputeVendorBillContainer.VendorBillItemsDetail = self.getDisputeSalesOrderItemDetails();
			salesOrderDisputeVendorBillContainer.CanSaveReasonCodes = self.isBillStatusDispute();

			//##START: US22053
			salesOrderDisputeVendorBillContainer.IsSavedFromVB = true;
			//##END: US22053

			self.salesOrderClient.SaveSalesOrderDisputeVBDetails(salesOrderDisputeVendorBillContainer, () => {
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}
				self.listProgress(false);
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SavedSuccessfullyMessage, "success", null, toastrOptions);
				self.callReloadVendorBill();
			}, (message) => {
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
				self.listProgress(false);
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
				});
		} else {
			self.errorVendorBillDispute.errors.showAllMessages();
			self.listProgress(false);
		}

		return false;
	}

	//initialize Vendor Bill Item after select click
	public initializeDisputeItem(data: any, vendorBillId: number, isEnable?: boolean, enable?: boolean) {
		var self = this;
		// ###START: US20352
		if (data.DisputeStatusId) {
			self.selectedStatusType(data.DisputeStatusId.ID);
		}
		// ###END: US20352
		self.vendorBillId(vendorBillId);
		if (data != null) {
			self.billStatusList(data.DisputeVendorBill[0].ListOfBillStatuses);
			self.billstatuId(data.DisputeVendorBill[0].BillStatus);
			self.disputeNotes(data.DisputeVendorBill[0].DisputeNotes);
			self.totalDisputeAmount(data.DisputeVendorBill[0].DisputedAmount);
			self.VBDisputeDate(data.DisputeVendorBill[0].DisputedDate ? self.commonUtils.formatDate(data.DisputeVendorBill[0].DisputedDate.toString(), 'mm/dd/yyyy') : '');
			self.proNumberHeader(data.DisputeVendorBill[0].ProNumber);
			self.updatedDate(data.DisputeVendorBill[0].UpdatedDate);
			if (data.DisputeVendorBill[0].MasTransferDate !== null) {
				self.isSelected(false);
			}

			var shipmentItemTypesLength: number = self.shipmentItemTypes().length;
			if (!(shipmentItemTypesLength)) {
				_app.trigger("GetItemsTypes", function (items: IShipmentItemType) {
					self.shipmentItemTypes.removeAll();
					self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
				});
			}
			self.DisputeVendorBillItemsModel.removeAll();
			data.VendorBillItemsDetail.forEach(function (item) {
				if (item.VendorBillId === self.vendorBillId()) {

					// ##START: US25153
					var selectedItem;

					if (item.ItemId === 0
						&& item.AccessorialId === 0
						&& self.itemsNotIntegratedWithMas) {
						selectedItem = $.grep(self.itemsNotIntegratedWithMas, function (e) {
							return e.ShortDescription === item.UserDescription;
						})[0];

						if (typeof selectedItem !== "undefined")
							self.shipmentItemTypes.push.apply(self.shipmentItemTypes, self.itemsNotIntegratedWithMas);
					}

					//##START: DE22259
					if (typeof selectedItem === "undefined") {
						selectedItem = $.grep(self.shipmentItemTypes(), function (e) {
							return e.ItemId === item.ItemId.toString() && (e.AccessorialId == null || item.AccessorialId == 0 || e.AccessorialId == item.AccessorialId);
						})[0];
					}
					// ##END: US25153

					if (typeof selectedItem === "undefined" || selectedItem == null) {
						selectedItem = $.grep(self.shipmentItemTypes(), function (e) {
							return e.ItemId === item.ItemId.toString();
						})[0];
					}
					//##END: DE22259

					self.DisputeVendorBillItemsModel.push(new DisputeVendorBillItemsModel(selectedItem, item, () => {
						self.updateTotalCostPayDisputeAmount();
					}, data.ReasonCodes));

					// ##START: US25153
					selectedItem = undefined; // otherwise in next iteration in loop, 'item' will still have the previous value
					// ##END: US25153
				}
			});

			if (enable) {
				self.isBillStatusDispute(!enable);
			} else {
				self.isBillStatusDispute(!isEnable);
			}
			// Update the totals in the totals section
			self.updateTotalCostPayDisputeAmount();
		}
	}

	//Get Vendor bill details For
	private getSalesOrderDisputeVendorBillDetails(): Array<IDisputeVendorBill> {
		var self = this;
		var salesOrderDisputeDetails: Array<refSalesOrderDisputeVendorBill.Models.DisputeVendorBill>;
		salesOrderDisputeDetails = ko.observableArray([])();
		var vendorBillDisputeData = new refSalesOrderDisputeVendorBill.Models.DisputeVendorBill();
		vendorBillDisputeData.DisputedDate = self.VBDisputeDate();
		vendorBillDisputeData.DisputedAmount = parseFloat(self.totalDisputeAmount());
		vendorBillDisputeData.DisputeNotes = self.disputeNotes();
		vendorBillDisputeData.BillStatus = self.billstatuId();
		vendorBillDisputeData.VendorBillId = self.vendorBillId();
		vendorBillDisputeData.UpdatedDate = self.updatedDate();
		salesOrderDisputeDetails.push(vendorBillDisputeData);
		return salesOrderDisputeDetails;
	}

	// Gets the vendor bill Item details for save
	private getDisputeSalesOrderItemDetails(): Array<IVendorBillItem> {
		var self = this;
		var salesOrderDisputeItems: Array<refSalesOrderItemModel.Models.VendorBillItemDetails>;
		salesOrderDisputeItems = ko.observableArray([])();

		self.DisputeVendorBillItemsModel().forEach((item) => {
			var salesOrderDisputreVBItem = new refSalesOrderItemModel.Models.VendorBillItemDetails();
			salesOrderDisputreVBItem.Id = item.id();
			salesOrderDisputreVBItem.Cost = item.cost();
			salesOrderDisputreVBItem.ItemId = item.selectedItemTypeId();
			salesOrderDisputreVBItem.UserDescription = item.description();
			salesOrderDisputreVBItem.DisputeAmount = item.disputeAmount();
			salesOrderDisputreVBItem.VendorBillId = self.vendorBillId();
			salesOrderDisputreVBItem.ReasonNote = item.reasonNotes();
			salesOrderDisputreVBItem.SelectedReasonCodes = item.selectedReasonCode();
			//##START: DE22259
			salesOrderDisputreVBItem.AccessorialId = item.accessorialId() == null ? 0 : item.accessorialId();
			//##END: DE22259
			salesOrderDisputeItems.push(salesOrderDisputreVBItem);
		});
		return salesOrderDisputeItems;
	}

	//For add total cost , dispute and pay
	private updateTotalCostPayDisputeAmount() {
		var self = this;

		var totalCost: number = 0.0,
			totalDisputeCost: number = 0.0,
			totalPay: number = 0.0;

		self.DisputeVendorBillItemsModel().forEach(function (item) {
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
			if (item.pay()) {
				if (item.selectedItemTypeId() === 70) {
					var costWithoutComma = item.pay().toString();
					var check = costWithoutComma.indexOf(",");
					if (check === -1) {
						totalPay += parseFloat(item.pay().toString()) * (-1);
					} else {
						//For removing comma before addition because parseFloat is not taking digit after comma at adding time
						totalPay += parseFloat(costWithoutComma.replace(/,/g, "")) * (-1);
					}
				} else {
					var costWithoutComma = item.pay().toString();
					var check = costWithoutComma.indexOf(",");
					if (check === -1) {
						totalPay += parseFloat(item.pay().toString());
					} else {
						//For removing comma before addition because parseFloat is not taking digit after comma at adding time
						totalPay += parseFloat(costWithoutComma.replace(/,/g, ""));
					}
				}
			}
			if (item.disputeAmount()) {
				var costWithoutComma = item.disputeAmount().toString();
				var check = costWithoutComma.indexOf(",");
				if (check === -1) {
					totalDisputeCost += parseFloat(item.disputeAmount().toString());
				} else {
					//For removing comma before addition because parseFloat is not taking digit after comma at adding time
					totalDisputeCost += parseFloat(costWithoutComma.replace(/,/g, ""));
				}
			}
		});
		//bind all total Cost, pay and dispute
		self.salesOrderTotalCost(totalCost.toFixed(2));
		self.salesOrderTotalPayAmount(totalPay.toFixed(2));
		self.totalDisputeAmount(totalDisputeCost.toFixed(2));
	}

	// Converting if date is not valid
	private convertToVBDisputeDate() {
		var self = this;
		if (!self.VBDisputeDate().match('/') && self.VBDisputeDate().length > 0) {
			self.VBDisputeDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.VBDisputeDate()));
		}
	}

	public cleanup() {
		var self = this;
		try {
			self.disposables.forEach(disposable => {
				if (disposable && typeof disposable.dispose === "function") {
					disposable.dispose();
				} else {
					delete disposable;
				}
			});

			self.DisputeVendorBillItemsModel().forEach((items) => {
				items.cleanup();
				delete items;
			});

			for (var prop in self) {
				delete self[prop];
			}

			//delete self;
		}
		catch (e) {
		}
	}
	//#endregion

	//#region Life Cycle Events
	//#endregion
}

export class DisputeVendorBillItemsModel {
	id: KnockoutObservable<number> = ko.observable();
	item: KnockoutObservable<string> = ko.observable('');
	selectedItemTypeId: KnockoutObservable<number> = ko.observable();
	//##START: DE22259
	accessorialId: KnockoutObservable<number> = ko.observable();
	//##END: DE22259
	description: KnockoutObservable<string> = ko.observable('');
	disputedDate: KnockoutObservable<any> = ko.observable('');
	cost: KnockoutObservable<number> = ko.observable(0);
	pay: KnockoutObservable<number> = ko.observable(0);
	disputeAmount: KnockoutObservable<number> = ko.observable(0);
	reasonNotes: KnockoutObservable<any> = ko.observable('');
	reasonCodesListFoBinding: KnockoutObservableArray<refSalesOrderShipmentRequoteReasonModel.Model.SalesOrderShipmentRequoteReason> = ko.observableArray([]);
	selectedReasonCode: KnockoutObservable<ISalesOrderShipmentRequoteReason> = ko.observable();
	commonUtils = new Utils.Common()
	disposables: Array<any> = [];
	constructor(selectedItem: IShipmentItemType, item: IVendorBillItem, payvalueChanged: () => any, reasonCodes: any) {
		var self = this;
		self.id(item.Id);
		self.item(selectedItem ? selectedItem.LongDescription : '');
		self.selectedItemTypeId(item.ItemId);
		self.description(item.UserDescription);
		//##START: DE22259
		self.accessorialId(selectedItem ? selectedItem.AccessorialId : 0);
		//##END: DE22259
		self.cost($.number(item.Cost, 2));
		self.pay($.number((item.Cost - item.DisputeAmount), 2));
		self.reasonNotes(item.ReasonNote);

		self.reasonCodesListFoBinding.removeAll();

		reasonCodes.forEach(function (reasonCodeItem) {
			self.reasonCodesListFoBinding.push(new refSalesOrderShipmentRequoteReasonModel.Model.SalesOrderShipmentRequoteReason(reasonCodeItem));
		});

		if (item.SelectedReasonCodes !== null && item.SelectedReasonCodes !== undefined) {
			var selectedReasonCodeItem = $.grep(self.reasonCodesListFoBinding(), function (e) { return e.Remarks === item.SelectedReasonCodes.Remarks; })[0];
			self.selectedReasonCode(selectedReasonCodeItem);
		}

		self.reasonNotes(item.ReasonNote);
		self.disposables.push(self.pay.subscribe(() => {
			if (typeof (payvalueChanged) === 'function') {
				if (self.selectedItemTypeId() === 70) {
					self.disputeAmount($.number(((+item.Cost) + (+self.pay())), 2));
				} else {
					self.disputeAmount($.number((item.Cost - self.pay()), 2));
				}
				payvalueChanged();
			}
		}));
		self.disputeAmount($.number(item.DisputeAmount, 2));
		return self;
	}

	public cleanup() {
		var self = this;
		try {
			self.disposables.forEach(disposable => {
				if (disposable && typeof disposable.dispose === "function") {
					disposable.dispose();
				} else {
					delete disposable;
				}
			});

			for (var prop in self) {
				if (typeof self[prop].dispose === "function") {
					self[prop].dispose();
				}

				delete self[prop];
			}

			//delete self;
		}
		catch (e) {
		}
	}
}