/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/

//#region References
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../../Scripts/Utility.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion

import _app = require('durandal/app');
import refValidations = require('services/validations/Validations');
import refEnums = require('services/models/common/Enums');
import refSystem = require('durandal/system');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refCreditMemoContainerModel = require('services/models/salesOrder/CreditMemoContainer');
import refCreditMemoDetailsModel = require('services/models/salesOrder/CreditMemoDetail');
/*
** <summary>
** Popup to send the Dispute email using the selected template
** </summary>
** <createDetails>
** <id>US25171</id> <by>Janakiram</by> <date>04-10-2016</date>
** </createDetails>
** <changeHistory>
** <id>US24865</id> <by>Shreesha Adiga</by> <date>18-10-2016</date>	<description>Add properties, validations, methods</description>
** <id>US25277</id> <by>Baldev Singh Thakur</by> <date>19-10-2016</date><description>Add enum assiging to the Credit Revenue dropdown</description>
** <id>US25310</id> <by>Shreesha Adiga</by> <date>24-10-2016</date> <description>Changes realted to Dispute Won scenario; Code refactoring</description>
** <id>US25307</id> <by>Janakiram</by> <date>24-10-2016</date> <description>Added Notes for SO while saving</description>
** <id>US25679</id> <by>Baldev Singh Thakur</by> <date>11-11-2016</date><description>Added totalPendingVendorAmount</description>
** <id>DE25083</id> <by>Shreesha Adiga</by> <date>21-11-2016</date><description>Populate final cost and revenue on initializing of popup</description>
** <id>DE25210</id> <by>Shreesha Adiga</by> <date>30-11-2016</date><description>If Dispute won, don't subtract the vendor amount from Final cost as it is already subtracted</description>
** <id>US25941</id> <by>Janakiram</by> <date>13-12-2016</date><description>Acct: Validate Vendor Credit Amount Field.</description>
** <id>US26001</id> <by>Vasanthakumar</by> <date>15-12-2016</date> <description>Added validation for customer and vendor credit amount</description>
** <id>DE25338</id> <by>Janakiram</by> <date>20-12-2016</date> <description>Handling when Customer credit amount/Vendor credit amount empty , Final revenue /Final cost value is showing as Zero</description>
** <id>DE25495</id> <by>Baldev Singh Thakur</by> <date>03-01-2017</date> <description>Added logic for validating Vendor Credit Amount</description>
** <id>DE25574</id> <by>Baldev Singh Thakur</by> <date>23-01-2017</date> <description>Added logic saving the Customer Credit Amount and Vendor Credit Amount upto 2 decimal points.</description>
** <id>US26559</id> <by>Vasanthakumar</by> <date>02-02-2017</date> <description>Get the SO invoiced list and bind to dropdown if credit reason is Dispute won.</description>
** <id>US26574</id> <by>Vasanthakumar</by> <date>03-02-2017</date> <description>If BSCustomer, show BS Cost instead of Final Revenue.</description>
** <id>US26377</id> <by>Vasanthakumar</by> <date>03-03-2017</date> <description>Added CancelSO credit request reason logic.</description>
** </changeHistory>
*/
class SalesOrderRequestCreditPopupViewModel {

	listProgress: KnockoutObservable<boolean> = ko.observable(false);

	//##START: US24865
	finalRevenueCurrent: KnockoutObservable<number> = ko.observable($.number(0, 2));
	finalCostCurrent: KnockoutObservable<number> = ko.observable($.number(0, 2));

	finalRevenuePostCredit: KnockoutObservable<number> = ko.observable($.number(0, 2));
	finalCostPostCredit: KnockoutObservable<number> = ko.observable($.number(0, 2));

	customerCreditAmount: KnockoutObservable<number> = ko.observable();
	vendorCreditAmount: KnockoutObservable<number> = ko.observable($.number(0, 2));

	notes: KnockoutObservable<string> = ko.observable();

	NumericInputWithDecimalPoint: INumericInput;
	validationGroupPopup: KnockoutValidationGroup;

	saveCallback: any;

	// ###START: US25277
	creditReasonOptions: KnockoutObservableArray<ICreditReason> = ko.observableArray([]);
	selectedCreditReason: KnockoutObservable<ICreditReason> = ko.observable();

	isVendorCredit: KnockoutObservable<boolean> = ko.observable(false);
	//store sales order id to fetch financial details
	shipmentId: number;

	totalPendingCreditAmount: KnockoutObservable<number> = ko.observable($.number(0, 2));

	// ###START: US25679
	totalPendingVendorAmount: KnockoutObservable<number> = ko.observable($.number(0, 2));

	// ###END: US25679
	creditMemoSaveData: refCreditMemoContainerModel.Model.CreditMemoContainer;

	// ###START: DE25338
	//## Function Declaration Region
	isNumber: (that, event) => void;

	// Utility class object
	CommonUtils: CommonStatic = new Utils.Common();

	// ###END: DE25338

	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	private checkMsgDisplay: boolean = true;
	public isViewMessage: boolean = true;

	isCreditMemoExceeds: KnockoutObservable<boolean> = ko.observable(false);
	// ###END: US25277
	//##END: US24865

	// ##START: US25310
	enableCreditReason: KnockoutComputed<boolean>;
	// ##END: US25310
	enableCustomerCreditAmount: KnockoutComputed<boolean>;

	selectSOVisible: KnockoutComputed<boolean>;
	availableSO: KnockoutObservableArray<IOrderRevenuePair> = ko.observableArray([]);
	selectedSO: KnockoutObservable<IOrderRevenuePair> = ko.observable();
	isBSCustomer: KnockoutObservable<boolean> = ko.observable(false);
	finalRevenueText: KnockoutObservable<string> = ko.observable("Final Revenue $:");
	isCreditMemoExceedsWarningMessage: KnockoutObservable<string> = ko.observable("Warning: Total Credit Memo Amount exceeds Total Revenue for the shipment.");

	//##START: US24865
	constructor() {
		var self = this;

		// ###START: DE25338
		//To check if enter value is digit and decimal
		self.isNumber = (data, event) => {
			var charCode = (event.which) ? event.which : event.keyCode;

			//to allow copy in firefox
			if (event.ctrlKey && (charCode == 99 || charCode == 67)) {
				return true;
			}
			if ((charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57))) {
				return false;
			}
			return true;
		}
		// ###END: DE25338

		// set the flag allow decimal: true to accepts decimals
		self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(true) };

		self.customerCreditAmount.extend({	
			// ###START: DE25338		
			validation: {
				validator: () => {
					return typeof self.customerCreditAmount() !== 'undefined' && parseFloat(self.customerCreditAmount().toString().replace(/,/g, "")) >= 0;
				},
				message: "Credit Amount is required"
			},
			// ###END: DE25338
			number: true
		});

		// ###START: US25277
		self.selectedCreditReason.extend({
			required: {
				message: ApplicationMessages.Messages.CreditReasonRequired,
			}
		});

		self.selectedSO.extend({
			required: {
				message: ApplicationMessages.Messages.CreditMemoDisputeWonSelectSO,
				onlyIf: function () {
					return (typeof self.selectedCreditReason() !== "undefined" && self.selectedCreditReason().Id === refEnums.Enums.CreditReason.DisputeWon.ID);
				}
			}
		});

		self.vendorCreditAmount.extend({
			required: {
				message: ApplicationMessages.Messages.VendorCreditAmountRequired,
				onlyIf: function () {
					return (typeof self.selectedCreditReason() !== "undefined" && (self.selectedCreditReason().Id === refEnums.Enums.CreditReason.VendorCredit.ID || self.selectedCreditReason().Id === refEnums.Enums.CreditReason.OvcClaim.ID));
				}
			},
			validation: {
				validator: () => {
					return parseFloat(self.finalCostPostCredit().toString().replace(/,/g, "")) >= 0;
				},
				message: "Vendor Credit cannot be greater than Final Cost"
			},
			// ###END: US25277

			// ###START: US25941

			// ###START: DE25495
			validation: [{
				validator: () => {
					if (typeof self.selectedCreditReason() !== "undefined" && (self.selectedCreditReason().Id === refEnums.Enums.CreditReason.VendorCredit.ID || self.selectedCreditReason().Id === refEnums.Enums.CreditReason.OvcClaim.ID)) {
						return parseFloat(self.finalCostPostCredit().toString().replace(/,/g, "")) >= 0;
					}
					else {
						return true;
					}
				},
				message: ApplicationMessages.Messages.ValidateVendorCreditAmount
			},
				{
					validator: () => {
						if (typeof self.selectedCreditReason() !== "undefined" && (self.selectedCreditReason().Id === refEnums.Enums.CreditReason.VendorCredit.ID || self.selectedCreditReason().Id === refEnums.Enums.CreditReason.OvcClaim.ID)) {
							return parseFloat(self.vendorCreditAmount().toString().replace(/,/g, "")) > 0;
						}
						else {
							return true;
						}
					},
					message: ApplicationMessages.Messages.VendorCreditAmountZeroRequired
				}
			],

			// ###END: DE25495

			// ###END: US25941
			number: true
		});
		// ###END: US25277
		// validation group
		self.validationGroupPopup = ko.validatedObservable({
			customerCreditAmount: self.customerCreditAmount,
			vendorCreditAmount: self.vendorCreditAmount,
			selectedCreditReason: self.selectedCreditReason,
			selectedSO: self.selectedSO
		});

		// ###START: US25277
		self.selectedCreditReason.subscribe((newValue) => {
			// ##START: US25310
			self.isVendorCredit(typeof newValue !== "undefined"
				&& (newValue.Id === refEnums.Enums.CreditReason.VendorCredit.ID || newValue.Id === refEnums.Enums.CreditReason.OvcClaim.ID));

			if (typeof newValue === "undefined" ||
				(typeof newValue !== "undefined" && newValue.Id !== refEnums.Enums.CreditReason.DisputeWon.ID)) {
				self.vendorCreditAmount($.number(0, 2));
			}
			// ##END: US25310

			if (typeof newValue !== "undefined" && newValue.Id === refEnums.Enums.CreditReason.CancelSO.ID) {
				self.customerCreditAmount($.number(self.finalRevenueCurrent(), 2));
			}
		});

		self.customerCreditAmount.subscribe((creditAmount) => {
			var postCreditRevenue = 0.0, customerCreditAmount = 0.0, currentFinalRevenue = 0.0, totalPendingCredit = 0.0;

			// ###START: DE25338
			var customerCreditAmountWithoutComma = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.customerCreditAmount().toString()) ? self.customerCreditAmount().toString() : '0.0';
			// ###END: DE25338

			var currentFinalRevenueWithoutComma = self.finalRevenueCurrent().toString();
			var totalPendingCreditAmountWithoutComma = self.totalPendingCreditAmount().toString();

			var customerCreditCheck = customerCreditAmountWithoutComma.indexOf(",");
			if (customerCreditCheck === -1) {

				// ###START: DE25338
				customerCreditAmount = parseFloat(self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.customerCreditAmount().toString()) ? self.customerCreditAmount().toString() : '0.0');
				// ###END: DE25338

			} else {
				//For removing comma before addition because parseFloat is not taking digit after comma at adding time
				customerCreditAmount = parseFloat(customerCreditAmountWithoutComma.replace(/,/g, ""));
			}

			var currentFinalRevenueCheck = currentFinalRevenueWithoutComma.indexOf(",");
			if (currentFinalRevenueCheck === -1) {
				currentFinalRevenue = parseFloat(self.finalRevenueCurrent().toString());
			} else {
				//For removing comma before addition because parseFloat is not taking digit after comma at adding time
				currentFinalRevenue = parseFloat(currentFinalRevenueWithoutComma.replace(/,/g, ""));
			}

			var totalPendingCreditCheck = totalPendingCreditAmountWithoutComma.lastIndexOf(",");
			if (totalPendingCreditCheck === -1) {
				totalPendingCredit = parseFloat(self.totalPendingCreditAmount().toString());
			} else {
				totalPendingCredit = parseFloat(totalPendingCreditAmountWithoutComma.replace(/,/g, ""));
			}

			postCreditRevenue = currentFinalRevenue - totalPendingCredit - customerCreditAmount;

			if (postCreditRevenue < 0) {
				self.isCreditMemoExceeds(true);
			}
			else {
				self.isCreditMemoExceeds(false);
			}

			self.finalRevenuePostCredit($.number(postCreditRevenue, 2));
		});

		self.vendorCreditAmount.subscribe((creditAmount) => {
			var postFinalCost = 0.0, vendorCreditAmount = 0.0, currentFinalCost = 0.0, totalPendingVendor = 0.0;

			// ###START: DE25338
			var vendorCreditAmountWithoutComma = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.vendorCreditAmount().toString()) ? self.vendorCreditAmount().toString() : '0.0';
			// ###END: DE25338

			var currentFinalCostWithoutComma = self.finalCostCurrent().toString();
			// ###START: US25679
			var totalPendingVendorAmountWithoutComma = self.totalPendingVendorAmount().toString();

			// ###END: US25679
			var vendorCreditCheck = vendorCreditAmountWithoutComma.indexOf(",");
			if (vendorCreditCheck === -1) {
				
				// ###START: DE25338
				vendorCreditAmount = parseFloat(self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.vendorCreditAmount().toString()) ? self.vendorCreditAmount().toString() : '0.0');
				// ###END: DE25338
			} else {
				//For removing comma before addition because parseFloat is not taking digit after comma at adding time
				vendorCreditAmount = parseFloat(vendorCreditAmountWithoutComma.replace(/,/g, ""));
			}

			var currentFinalCostCheck = currentFinalCostWithoutComma.indexOf(",");
			if (currentFinalCostCheck === -1) {
				currentFinalCost = parseFloat(self.finalCostCurrent().toString());
			} else {
				//For removing comma before addition because parseFloat is not taking digit after comma at adding time
				currentFinalCost = parseFloat(currentFinalCostWithoutComma.replace(/,/g, ""));
			}

			// ###START: US25679
			var totalPendingVendorCheck = totalPendingVendorAmountWithoutComma.lastIndexOf(",");
			if (totalPendingVendorCheck === -1) {
				totalPendingVendor = parseFloat(self.totalPendingVendorAmount().toString());
			} else {
				totalPendingVendor = parseFloat(totalPendingVendorAmountWithoutComma.replace(/,/g, ""));
			}

			// ###END: US25679
			// ##START: US25310
			postFinalCost = currentFinalCost - totalPendingVendor - (typeof self.selectedCreditReason() !== "undefined" && self.selectedCreditReason().Id !== refEnums.Enums.CreditReason.DisputeWon.ID
			? vendorCreditAmount
			: 0);
			// ##END: US25310

			self.finalCostPostCredit($.number(postFinalCost, 2));
		});

		//To check if Msg is clicked
		self.checkMsgClick = () => {
			self.checkMsgDisplay = true;
			self.isViewMessage = true;
		}

		// to Check if Msg is hidden or closed
		self.checkMsgHide = () => {
			self.checkMsgDisplay = true;
			self.isViewMessage = true;
		};

		// ##START: US25310
		self.enableCreditReason = ko.computed(() => {
			return typeof self.selectedCreditReason() === "undefined"
				? true
				: self.selectedCreditReason().Id === refEnums.Enums.CreditReason.DisputeWon.ID || self.selectedCreditReason().Id === refEnums.Enums.CreditReason.CancelSO.ID ? false : true;
		});
		// ##END: US25310

		self.enableCustomerCreditAmount = ko.computed(() => {
			return typeof self.selectedCreditReason() === "undefined" ? true : self.selectedCreditReason().Id === refEnums.Enums.CreditReason.CancelSO.ID ? false : true;
		});

		self.selectSOVisible = ko.computed(() => {
			return typeof self.selectedCreditReason() === "undefined"
				? false
				: self.selectedCreditReason().Id === refEnums.Enums.CreditReason.DisputeWon.ID ? true : false;
		});

		// ###END: US25277
		return self;
	}

	//on click of save on the popup
	private onSave(dialogResult) {
		var self = this;

		// ###START: US25277
		if (self.validationGroupPopup.errors().length != 0) {
			self.validationGroupPopup.errors.showAllMessages();
			return;
		}

		// ###START: US26001
		if (self.customerCreditAmount() == 0 && self.vendorCreditAmount() == 0) {
			var toastrOptions: IToastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 10,
				fadeOut: 10,
				typeOfAlert: "",
				title: ""
			};

			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.CreditMemoRequestCanNotBeRaisedMessage, "warning", null, toastrOptions);
			return;
		}
		// ###END: US26001

		self.listProgress(true);

		self.creditMemoSaveData = new refCreditMemoContainerModel.Model.CreditMemoContainer();
		var creditMemoDetail = new refCreditMemoDetailsModel.Model.CreditMemoDetail();
		
		self.creditMemoSaveData.CreditMemoDetail = creditMemoDetail;

		self.creditMemoSaveData.CreditMemoDetail.CreditReasonId = self.selectedCreditReason().Id;

		if (self.selectedCreditReason().Id === refEnums.Enums.CreditReason.DisputeWon.ID) {
			self.creditMemoSaveData.CreditMemoDetail.ShipmentId = self.selectedSO().ShipmentId;
		}
		else {
			self.creditMemoSaveData.CreditMemoDetail.ShipmentId = self.shipmentId;
		}

		// ###START: DE25574
		self.creditMemoSaveData.CreditMemoDetail.CustomerCreditAmount = Number(parseFloat(self.customerCreditAmount().toString().replace(/,/g, "")).toFixed(2));
		self.creditMemoSaveData.CreditMemoDetail.VendorCreditAmount = Number(parseFloat(self.vendorCreditAmount().toString().replace(/,/g, "")).toFixed(2));

		// ###END: DE25574
		// ###START: US25307
		self.creditMemoSaveData.CreditMemoDetail.NotesDescription = $.trim(self.notes()).length > 0 ? $.trim(self.notes()) : null;
		// ###END: US25307
		refSalesOrderClient.SalesOrderClient.prototype.RequestCreditMemo(self.creditMemoSaveData, function (message) {
			// Saving successful callback
			self.listProgress(false);

			var toastrOptions: IToastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 10,
				fadeOut: 10,
				typeOfAlert: "",
				title: ""
			};

			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.CreditMemoRequestSuccessMessage, "success", null, toastrOptions);

			self.saveCallback(message.Response, self.selectedCreditReason().Id);
			self.closePopup(dialogResult);

		}, (message) => {

				// Saving failed call back
				self.listProgress(false);
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 5,
					fadeOut: 5,

					typeOfAlert: "",
					title: ""
				}

				if (message.StatusModel.StatusCode == -1) {
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message.StatusModel.Description, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				}
				else {
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.CreditMemoRequestFailureMessage, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				}
			});
		// ###END: US25277
	}

	//##END: US24865

	//on click of close on the popup
	private onCancel(dialogResult) {
		var self = this;
		self.closePopup(dialogResult);
	}

	//close popup
	public closePopup(dialogResult) {
		var self = this;
		dialogResult.__dialog__.close(this, dialogResult);
		return true;
	}

	// ###START: US25277
	// Method to load the values on the popup
	private initializeCreditMemoPopupDetails(creditmemoPopupData) {
		var self = this;

		self.isBSCustomer(creditmemoPopupData.isBSCustomer);
		if (self.isBSCustomer() === true) {
			self.finalRevenueText("BS Cost $:");
			self.isCreditMemoExceedsWarningMessage("Warning: Total Credit Memo Amount exceeds BS Cost for the shipment.");
		}
		
		// ##START: US25310
		self.finalRevenueCurrent($.number(creditmemoPopupData.currentFinalRevenue, 2));
		self.finalCostCurrent($.number(creditmemoPopupData.currentFinalCost, 2));
		self.shipmentId = creditmemoPopupData.shipmentId;
		self.totalPendingCreditAmount($.number(creditmemoPopupData.totalPendingCreditAmount, 2));
		self.vendorCreditAmount($.number(creditmemoPopupData.vendorCreditAmount, 2));
		// ##END: US25310

		// ###START: US25679
		self.totalPendingVendorAmount($.number(creditmemoPopupData.totalPendingVendorAmount, 2));

		// ##START: DE25083
		self.finalRevenuePostCredit($.number(creditmemoPopupData.currentFinalRevenue - creditmemoPopupData.totalPendingCreditAmount, 2))

		var vendorCreditAmount = $.number(0, 2);

		if (typeof creditmemoPopupData.vendorCreditAmount !== 'undefined' && creditmemoPopupData.vendorCreditAmount !== null) {
			vendorCreditAmount = creditmemoPopupData.vendorCreditAmount.indexOf(",") !== -1
			? parseFloat(creditmemoPopupData.vendorCreditAmount.replace(/,/g, ""))
			: parseFloat(creditmemoPopupData.vendorCreditAmount.toString());
		}

		// ##START: DE25210
		var finalCostPostCredit = creditmemoPopupData.currentFinalCost
			- $.number(creditmemoPopupData.totalPendingVendorAmount, 2)
			- (creditmemoPopupData.selectedCreditReason === refEnums.Enums.CreditReason.DisputeWon.ID ? 0 : vendorCreditAmount);

		// ##END: DE25210

		self.finalCostPostCredit($.number(finalCostPostCredit, 2));

		// ##END: DE25083

		// ###END: US25679
		if (typeof creditmemoPopupData.creditReasons !== "undefined") {
			self.creditReasonOptions.removeAll();
			self.creditReasonOptions.push.apply(self.creditReasonOptions, creditmemoPopupData.creditReasons);
		}

		// ##START: US25310
		var selectedCreditReason = $.grep(self.creditReasonOptions(), function (value, i) {
			return value.Id == creditmemoPopupData.selectedCreditReason;
		})[0];

		if (typeof selectedCreditReason !== "undefined") {
			self.selectedCreditReason(selectedCreditReason);
		}
		// ##END: US25310

		if (creditmemoPopupData.selectedCreditReason === refEnums.Enums.CreditReason.DisputeWon.ID) {
			if (typeof creditmemoPopupData.salesOrderList !== "undefined") {
				self.availableSO.removeAll();
				self.availableSO.push.apply(self.availableSO, creditmemoPopupData.salesOrderList);
			}
		}
	}

	// ###END: US25277

	// ##START: US24865
	// #region Life Cycle Event
	// this method gets called first. optioncontrol is used to pass data to popup from where it's called
	public activate(optionControl: IMessageBoxOption) {
		var self = this;

		// ###START: US25277
		if (typeof optionControl !== "undefined" && typeof optionControl.bindingObject !== "undefined" && typeof optionControl.bindingObject.creditmemoPopupData != "undefined") {
			self.initializeCreditMemoPopupDetails(optionControl.bindingObject.creditmemoPopupData);
			self.saveCallback = optionControl.bindingObject.saveCallback;
		}

		// ###END: US25277
	}

	//composition complete
	public compositionComplete() {
		var self = this;

	}

	//##END: US24865

	//#endregion
}

return SalesOrderRequestCreditPopupViewModel;