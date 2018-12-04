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
import _refVendorBillItemModel = require('services/models/vendorBill/VendorBillItemDetails');
import _refVendorBillContainerModel = require('services/models/vendorBill/VendorBillContainer');
import refVendorBillClient = require('services/client/VendorBillClient');
import refEnums = require('services/models/common/Enums');
//#endregion

/*
** <summary>
** Vendor Bill Dispute Losts View Model.
** </summary>
** <createDetails>
** <id></id> <by>Satish</by> <date>27th May, 2014</date>
** </createDetails>
** <changeHistory>
** <id>US9669</id> <by>Achal Rastogi</by> <date>6-3-2014</date>
** <id>US21132</id> <by>Shreesha Adiga</by> <date>26-04-2016</date><description>Changes related to showing the dispute lost popup from sales order; Showing "Create Lost Bill" toastr after save</description>
** <id>US21132</id> <by>Shreesha Adiga</by> <date>12-05-2016</date><description>Changed the message shown on toastr</description>
** <id>DE22980</id> <by>Janakiram</by> <date>24-06-2016</date><description>Validating Dispute lost amount if entered other than nuumerics</description>
** </changeHistory>
*/
class VendorBillDisputeLost {
	vendorBillClient: refVendorBillClient.VendorBillClient = new refVendorBillClient.VendorBillClient();
	vendorBillItemsList: KnockoutObservableArray<VendorBillItemsModel> = ko.observableArray([]);
	proNumber: KnockoutObservable<string> = ko.observable('');
	totalCost: KnockoutComputed<string>;
	totalDispute: KnockoutComputed<string>;
	totalDisputeLost: KnockoutComputed<string>;
	isValidateAllDisputZero: KnockoutComputed<boolean>;
	totalDisputeLostShouldNotBeZero: KnockoutObservable<string> = ko.observable('');
	vendorBillId: number;
	isSaveEnable: KnockoutObservable<boolean> = ko.observable(true);
	listProgress: KnockoutObservable<boolean> = ko.observable(false);

	// Accepts only numeric with decimal input
	NumericInputWithDecimalPoint: INumericInput;

	saveCallback: (refreshThePage = false) => any;
	cancelCallback: () => any;

	// ##START: US21132
	proNumberOfMainBill: string;
	subBillCount: number;
	hasLostBill: boolean;
	isYesClickedOnToastr: boolean = false;

	public onClickToastr: () => any;
	public onClickYesToastr: () => any;
	public onClickNoToastr: () => any;

	// #END: US21132

	//#region Constructor
	constructor() {
		var self = this;

		// ##START: US21132
		// this will be called when the user clicks ON the toastr. (Including the action buttons)
		self.onClickToastr = () => {
			var self = this;

			// if yes is clicked then only clear the local storage and don't call before bind.
			self.saveCallback(!self.isYesClickedOnToastr);
			self.closePopup(self);
		}

		// (US21132) On click of yes on the toastr
		self.onClickYesToastr = () => {
			var self = this;

			self.isYesClickedOnToastr = true;

			var vendorBillId = self.vendorBillId;
			var proNumber = self.getTheNexProNumberForLostBill();

			_app.trigger("openVendorBill", vendorBillId, proNumber, (callback) => {
				if (!callback) {
					return;
				}
			}, false, false, true);

			self.saveCallback();
		}

		// (US21132) on click of no on toastr
		self.onClickNoToastr = () => {
			var self = this;

			self.isYesClickedOnToastr = false;
			self.saveCallback();
			self.showSavedSuccesfullyToastr();
		}

		// ##END: US21132

		//set the flag allow decimal: true to accepts decimals
		self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(true) };


		self.totalCost = ko.computed(() => {
			var totalCost: number = 0;

			if (self.vendorBillItemsList()) {
				self.vendorBillItemsList().forEach((item) => {
					totalCost += parseFloat(item.cost());
				});
			}

			return totalCost.toFixed(2);
		});

		self.totalDispute = ko.computed(() => {
			var totalCost: number = 0;

			if (self.vendorBillItemsList()) {
				self.vendorBillItemsList().forEach((item) => {
					totalCost += parseFloat(item.disputeAmount());
				});
			}

			return totalCost.toFixed(2);
		});

		self.totalDisputeLost = ko.computed(() => {
			var totalCost: number = 0;

			if (self.vendorBillItemsList()) {
				self.vendorBillItemsList().forEach((item) => {
					// ##START: US21132
					totalCost += item.disputeLostAmount().toString() == "" ? 0 : parseFloat(item.disputeLostAmount().toString());
					// ##END: US21132
				});
			}

			return totalCost.toFixed(2);
		});

		self.isValidateAllDisputZero = ko.computed(() => {
			if (self.totalDisputeLost() === '0.00') {
				self.totalDisputeLostShouldNotBeZero('Total Dispute Lost Amount should be greater then Zero.');
				return true;
			} else {
				return false;
			}
		});
	}
	//#endregion

	//#region Public Methods

	// ##START: US21132
	// on click of the save on the popup
	public onSave() {
		var self = this;

		if (!self.validateItems()) {
			self.listProgress(true);
			var vendorBillData = new _refVendorBillContainerModel.Models.VendorBillContainer();

			vendorBillData.VendorBillItemsDetail = self.getVendorBillItemsDetails();

			var successCallBack = () => {
				self.isSaveEnable(true);

				if (!self.hasLostBill) {
					self.showLostBillCreationToastr();
				} else {

					if (self.saveCallback && typeof self.saveCallback === "function") {
						self.saveCallback();
					}

					self.closePopup(self);
					self.showSavedSuccesfullyToastr();
				}

			},
				faliureCallBack = (message) => {
					self.isSaveEnable(false);
					self.listProgress(false);
					var toastrOptions =
						{
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 10,
							fadeOut: 10,
							typeOfAlert: "",
							title: ""
						}

					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
				};

			self.isSaveEnable(false);

			//successCallBack(); //REMOVE THIS AFTERWARDS
			self.vendorBillClient.saveVendorBillDisputeLostItems(vendorBillData, successCallBack, faliureCallBack);
			//self.listProgress(false);
		}
	}

	// on click of close on the popup
	public onClose(dialogResult) {
		var self = this;

		self.closePopup(dialogResult);
		self.cancelCallback();
	}

	// ##END: US21132

	// Checks validation in all the items
	public validateItems() {
		var self = this;
		var isInvalid = false;
		self.vendorBillItemsList().forEach((item) => {
			if (self.isValidateAllDisputZero()) {
				isInvalid = true;
			} else {
				if (item.checkValidation()) {
					isInvalid = true;
				}
			}
		});

		return isInvalid;
	}

	public initializeItemsDetails(data: Array<IVendorBillItem>) {
		var self = this;

		//var self = this;
		if (data) {
			data.forEach((item) => {
				self.vendorBillItemsList.push(new VendorBillItemsModel(item.ItemName, item.Cost, item.UserDescription, item.DisputeAmount, item.DisputeLostAmount, item.Id));
			});
		}
	}

	public load() {
		var self = this;

		// ##START: US21132
		self.listProgress(true);

		var successCallBack = data => {
			// To load items in UI Details
			this.initializeItemsDetails(data);
			self.listProgress(false);
		},
			faliureCallBack = () => {
				self.listProgress(false);
			};

		// ##END: US21132

		self.vendorBillClient.getvendorBillItems(self.vendorBillId, successCallBack, faliureCallBack);
	}

	// ##START: US21132
	// (US21132) method to show the toastr whether lost bill should be created
	public showLostBillCreationToastr() {
		var self = this;

		var disputeLostAmount = self.getTotalDisputeLostAmount()

		if (typeof disputeLostAmount !== "undefined" && !isNaN(disputeLostAmount) && disputeLostAmount !== 0) {
			var actionButtons: Array<IToastrActionButtonOptions> = [];
			actionButtons.push({
				actionButtonName: "Yes",
				actionClick: self.onClickYesToastr
			});

			actionButtons.push({
				actionButtonName: "No",
				actionClick: self.onClickNoToastr
			});

			var toastrOptions: IToastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 0,
				fadeOut: 0,
				typeOfAlert: "",
				title: "",
				actionButtons: actionButtons
			};

			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.DoYouWantToCreateLostBill, "warning", self.onClickToastr, toastrOptions);
		}
	}

	// (US21132) method to show the vendor bill saved successfully toastr
	public showSavedSuccesfullyToastr() {
		var toastrOptions = {
			toastrPositionClass: "toast-top-middle",
			delayInseconds: 10,
			fadeOut: 10,
			typeOfAlert: "",
			title: ""
		}

		Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SavedSuccessfullyMessage, "success", null, toastrOptions);
	}

	// ##END: US21132

	//#endregion

	//#region Private Methods
	// Gets the vendor bill Item details
	private getVendorBillItemsDetails(): Array<IVendorBillItem> {
		var self = this;

		var vendorBillItems: Array<_refVendorBillItemModel.Models.VendorBillItemDetails>;
		vendorBillItems = ko.observableArray([])();

		self.vendorBillItemsList().forEach((item) => {
			var vendorBillItem = new _refVendorBillItemModel.Models.VendorBillItemDetails();
			vendorBillItem.Id = item.id();
			vendorBillItem.VendorBillId = self.vendorBillId;
			vendorBillItem.DisputeLostAmount = item.disputeLostAmount();

			vendorBillItems.push(vendorBillItem);
		});

		return vendorBillItems;
	}

	// get the total lost amount to show on the toastr
	private getTotalDisputeLostAmount() {
		var self = this;
		var vbTotalDisputeLostAmount = 0;
		self.vendorBillItemsList().forEach((item) => {
			vbTotalDisputeLostAmount += parseFloat(item.disputeLostAmount().toString());
		});

		return vbTotalDisputeLostAmount;
	}

	// to get the next pro number for lost bill
	public getTheNexProNumberForLostBill() {
		var self = this,
			proNumber = self.proNumberOfMainBill,
			count = self.subBillCount + 65;

		proNumber += " " + String.fromCharCode(count);

		return proNumber;
	}

	//#endregion

	//#region Life Cycle Events
	//close popup
	public closePopup(dialogResult) {
		dialogResult.__dialog__.close(this, dialogResult);
		return true;
	}

	public compositionComplete(view, parent) {
		var self = this;

	}

	// first method which will be called when popup is initialized
	public activate(optionControl: IMessageBoxOption) {
		var self = this;

		// ##START: US21132
		self.isYesClickedOnToastr = false;

		if (typeof optionControl !== "undefined" && typeof optionControl.bindingObject !== "undefined") {
			self.vendorBillId = optionControl.bindingObject.vendorBillId;
			self.proNumber(optionControl.bindingObject.proNumber);
			self.hasLostBill = optionControl.bindingObject.hasLostBill;
			self.subBillCount = optionControl.bindingObject.subBillCount;
			self.proNumberOfMainBill = optionControl.bindingObject.proNumberOfMainBill;
			self.saveCallback = optionControl.bindingObject.saveCallback;
			self.cancelCallback = optionControl.bindingObject.cancelCallback;
		}

		self.load();
		
		// ##END: US21132

		return true;
	}
	//#endregion
}

// Item which will show in the grid
class VendorBillItemsModel {
	id: KnockoutObservable<number> = ko.observable();
	selectedItemTypes: KnockoutObservable<string> = ko.observable();
	cost: KnockoutObservable<string> = ko.observable();
	userDescription: KnockoutObservable<string> = ko.observable();
	disputeAmount: KnockoutObservable<string> = ko.observable();
	disputeLostAmount: KnockoutObservable<number> = ko.observable();
	errorVendorItemDetail: KnockoutValidationGroup;
	requiredColor: KnockoutComputed<string>;
	enableDisputeLostAmount: KnockoutComputed<boolean>;
	//
	constructor(selectedItemType: string, cost: number, userDescription: string, disputeAmount: number, disputeLostAmount: number, id: number) {
		var self = this;

		self.requiredColor = ko.computed((): string => {
			if (self.disputeAmount() || self.disputeAmount() === "0.0") {
				return '';
			}

			return "requiredFieldBgColor";
		});

		self.id(id);
		self.selectedItemTypes(selectedItemType);
		self.cost(cost.toFixed(2));
		self.userDescription(userDescription);
		self.disputeAmount(disputeAmount.toFixed(2));
		self.disputeLostAmount($.number(disputeLostAmount, 2));

		self.enableDisputeLostAmount = ko.computed((): boolean => {
			if (parseFloat(self.disputeAmount()) === 0) {
				return true;
			}
		});

		self.disputeLostAmount.extend({
			required: {
				message: 'Dispute lost amount is required.',
				onlyIf: () => {
					return ((parseFloat(self.disputeAmount()) !== parseFloat("0.00")));
				}
			},
			//number: true, //Comented this because of it was throwing erroe if we put number with dot like "12."
			//min: {
			//	params: 1,
			//	message: 'Amount should be greater than zero.',
			//	onlyIf: () => {
			//		return ((parseFloat(self.disputeAmount()) !== parseFloat("0.00")));
			//	}
			//},
			max: {
				params: 1,
				message: 'Amount should not be greater than dispute amount.',
				onlyIf: () => {
					return ((parseFloat(self.disputeAmount()) < parseFloat(self.disputeLostAmount().toString())) && parseFloat(self.disputeAmount()) !== 0);
				}
               },

              // ###START: DE22980
              number: true
              // ###END: DE22980
		});

		// The vendors item bill object
		self.errorVendorItemDetail = ko.validatedObservable({
			disputeLostAmount: self.disputeLostAmount
		});
	}

	// Check validation for each line item}
	public checkValidation() {
		var self = this;
		if (self.errorVendorItemDetail.errors().length != 0) {
			self.errorVendorItemDetail.errors.showAllMessages();
			return true;
		} else {
			return false;
		}
	}
}

return VendorBillDisputeLost;