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
/// <reference path="../services/models/TypeDefs/VendorBillModels.d.ts" />
//#endregion

import _app = require('durandal/app');
import refEnums = require('services/models/common/Enums');
import refVendorBillClient = require('services/client/VendorBillClient');
import refVendorBillReassignmentDetailsModel = require('services/models/vendorBill/VendorBillReassignmentDetails');

/*
** <summary>
** Popup to do Process Credit
** </summary>
** <createDetails>
** <id>US25683</id> <by>Janakiram</by> <date>16-11-2016</date>
** </createDetails>
** <changeHistory>
** <id>US25684</id> <by>Shreesha Adiga</by> <date>23-11-2016</date>
	<description>Implement all the funcitionalities of the popup: Added properties, subsbriptions, validations and methods</description>
** <id>US25684</id> <by>Shreesha Adiga</by> <date>23-11-2016</date><description>Some changes to validations after changes to the US</description>
** <id>US26955</id> <by>Baldev Singh Thakur</by> <date>15-02-2016</date><description>Added a new switch case for cancelled orders.</description>
** <id>US26955</id> <by>Vasanthakumar</by> <date>17-02-2016</date><description>Added concurrent error message.</description>
** <id>US27614</id> <by>Baldev Singh Thakur</by> <date>21-03-2017</date> <description>Added a check if the entered BOL is Suborder</description>
** <id>US27353</id> <by>Vasanthakumar</by> <date>23-03-2017</date> <description>Acct: Navigate the user to SO screen if Reassign so not invoiced or scheduled</description>
** <id>DE26318</id> <by>Baldev Singh Thakur</by> <date>30-03-2017</date> <description>Added a check if the sales order cost is greater than or equal to zero proceed with normal flow.</description>
** <id>US28121</id> <by>Baldev Singh Thakur</by> <date>13-04-2017</date> <description>Assigning only the current bill cost rather than the cost of bill and sub-bill if any.</description>
** <id>DE26484</id> <by>Baldev Singh Thakur</by> <date>17-04-2017</date> <description>Converting the string valued amount to number format.</description>
** <changeHistory>
*/

class ProcessCredittoMasPopupViewModel {

	//##START: US25684
	//#region Properties
	vendorBillReassignmentReasons: KnockoutObservableArray<IVendorBillReassignmentReason> = ko.observableArray([]);
	selectedReason: KnockoutObservable<IVendorBillReassignmentReason> = ko.observable();

	currentBOLNumber: KnockoutObservable<string> = ko.observable();
	reassignToBOLNumber: KnockoutObservable<string> = ko.observable();
	proNumber: KnockoutObservable<string> = ko.observable();
	vendorBillId: number;
	shipmentId: number;

	doesCustomerNeedToBeCredited: KnockoutObservable<string> = ko.observable();

	suborderOptions: KnockoutObservableArray<IOrderRevenuePair> = ko.observableArray([]);
	selectedOrder: KnockoutObservable<IOrderRevenuePair> = ko.observable();

	amountToBeCreditedToCustomer: KnockoutObservable<number> = ko.observable($.number(0, 2));
	vendorBillCost: KnockoutObservable<number> = ko.observable($.number(0, 2));

	notes: KnockoutObservable<string> = ko.observable();

	enableAmountToCredit: KnockoutComputed<boolean>;
	enableSuborderDropdown: KnockoutComputed<boolean>;

	isAlphaNumericSpace: (that, event) => void;
	NumericInputWithDecimalPoint: INumericInput;
	validationGroupPopup: KnockoutValidationGroup;
	vendorBillClient: refVendorBillClient.VendorBillClient = new refVendorBillClient.VendorBillClient();

	onClickToastr: () => any;
	onClickYesToastr: () => any;
	onClickNoToastr: () => any;

	saveCallback: () => any;
	isNewBOLInvoicedOrScheduled: boolean = false;
	listProgress: KnockoutObservable<boolean> = ko.observable(false);
	//#endregion
	//##END: US25684
	// ###START: US26955
	public viewDetail: (msg) => any;
	private savedSalesOrderId: number;
	actualCost: number;

	// ###END: US26955
	constructor() {
		var self = this;

		//##START: US25684
		self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(true) };

		//To check if enter value is Alpha Numeric and Space
		self.isAlphaNumericSpace = function (data, event) {
			var charCode = (event.which) ? event.which : event.keyCode;

			if ((charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122))) {
				return false;
			}

			return true;
		}

		//#region Subscribe and Computed functions
		// on click of radio
		self.doesCustomerNeedToBeCredited.subscribe((newValue) => {
			if (newValue === 'No') {
				self.selectedOrder(undefined);
			}
			else if (newValue === 'Yes' && typeof self.suborderOptions() !== 'undefined' && self.suborderOptions().length === 1) {
				self.selectedOrder(self.suborderOptions()[0]);
			}
		});

		// on selecting an order in dropdown
		self.selectedOrder.subscribe((newValue) => {
			self.amountToBeCreditedToCustomer(typeof self.selectedOrder() !== 'undefined' && self.doesCustomerNeedToBeCredited() === 'Yes'
				? $.number(self.selectedOrder().Revenue, 2)
				: $.number(0, 2));
		});

		// enable amount only if yes is checked
		self.enableAmountToCredit = ko.computed(() => {
			return self.doesCustomerNeedToBeCredited() === 'Yes';
		});

		// enable order dropdown only if yes is checked
		self.enableSuborderDropdown = ko.computed(() => {
			return self.doesCustomerNeedToBeCredited() === 'Yes';
		});

		//#endregion

		//#region validations
		self.selectedReason.extend({
			required: {
				message: ApplicationMessages.Messages.ReassignmentReasonRequired
			}
		});

		self.reassignToBOLNumber.extend({
			required: {
				message: ApplicationMessages.Messages.ReassignSOIsRequired
			},
			validation: {
				validator: () => {
					return !(typeof self.reassignToBOLNumber() !== 'undefined'
						&& self.reassignToBOLNumber() !== null
						&& self.reassignToBOLNumber().trim() === self.currentBOLNumber())
				},
				message: ApplicationMessages.Messages.ReassignSOCantBeSameAsCurrentSO
			}
		});

		self.doesCustomerNeedToBeCredited.extend({
			required: {
				message: ApplicationMessages.Messages.PleaseSelectRadioCustomerCredit
			}
		});

		self.selectedOrder.extend({
			required: {
				message: ApplicationMessages.Messages.PleaseSelectOrderToCredit,
				onlyIf: () => {
					return self.doesCustomerNeedToBeCredited() === 'Yes'
				}
			}
		});

		self.amountToBeCreditedToCustomer.extend({
			required: {
				message: ApplicationMessages.Messages.AmountToCreditIsRequired,
				onlyIf: () => {
					return self.doesCustomerNeedToBeCredited() === 'Yes'
				}
			},
			validation: [
				{
					validator: () => {
						return !(self.doesCustomerNeedToBeCredited() === 'Yes' && parseFloat(self.amountToBeCreditedToCustomer().toString().replace(/,/g, "")) <= 0)
					},
					message: ApplicationMessages.Messages.AmountToCreditIsRequired
				},
				{
					validator: () => {
						return !(self.doesCustomerNeedToBeCredited() === 'Yes'
							&& typeof self.selectedOrder() !== 'undefined'
							&& parseFloat(self.amountToBeCreditedToCustomer().toString().replace(/,/g, "")) > self.selectedOrder().Revenue)
					},
					message: ApplicationMessages.Messages.EnterdCreditAmountCantBeMoreThanRevenue
				}
			],

			number: true
		});

		// validation group
		self.validationGroupPopup = ko.validatedObservable({
			selectedReason: self.selectedReason,
			reassignToBOLNumber: self.reassignToBOLNumber,
			doesCustomerNeedToBeCredited: self.doesCustomerNeedToBeCredited,
			selectedOrder: self.selectedOrder,
			amountToBeCreditedToCustomer: self.amountToBeCreditedToCustomer
		});

		//#endregion

		//#region toastr click functions
		// this will be called when click even occurrs on the toastr, inclding the yes-no links
		self.onClickToastr = () => {
			self.listProgress(false);
		}

		//on click of yes on the toastr
		self.onClickYesToastr = () => {
			// delay is added because onClickToastr gets called after this function and it removes the progress bar while saving
			setTimeout(function () {
				self.saveVBReassignment();
			}, 200);
		};

		// on click of no on toastr
		self.onClickNoToastr = () => {

		};

		//#endregion
		//##END: US25684

		// ###START: US26955
		// To open Sales Order details
		self.viewDetail = () => {
			self.closePopup(self);
			// opens the details tab or the current created bill
			_app.trigger("openSalesOrder", self.savedSalesOrderId, self.reassignToBOLNumber(), (callback) => { });
			return true;
		}

		// ###END: US26955
	}

	//#region private Event

	//##START: US25684
	//on click of save on the popup
	private onSave(dialogResult) {
		var self = this;

		// check for validation errors
		if (self.validationGroupPopup.errors().length > 0) {
			self.validationGroupPopup.errors.showAllMessages();
			return;
		}

		self.listProgress(true);

		self.saveVBReassignment();
	}

	//on click of close on the popup
	private onClose(dialogResult) {
		var self = this;
		self.closePopup(dialogResult);
	}

	//close popup
	private closePopup(dialogResult) {
		var self = this;
		dialogResult.__dialog__.close(this, dialogResult);
		return true;
	}

	// method to save the reassignment data on the popup
	// <changeHistory>
	// <id>US27614</id> <by>Baldev Singh Thakur</by> <date>21-03-2017</date> <description>Added a check if the entered BOL is Suborder</description>
	// <id>DE26318</id> <by>Baldev Singh Thakur</by> <date>30-03-2017</date> <description>Added a check if the sales order cost is greater than or equal to zero proceed with normal flow.</description>
	// </changeHistory>
	private saveVBReassignment() {
		var self = this;

		self.listProgress(true);

		// ###START: US26955
		self.vendorBillClient.validateReassignedOrder(self.reassignToBOLNumber(), (result: any) => {
			var toastrTypeEnum, toastrTypeString: string, toastrMessage: string;

			var toastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 5,
				fadeOut: 5,
				typeOfAlert: "",
				title: ""
			};

			self.isNewBOLInvoicedOrScheduled = result.IsInvoicedOrScheduled;
			if (!result.IsBolExists) {
				toastrTypeEnum = refEnums.Enums.ToastrMessageType.info.ID,
				toastrTypeString = 'info',
				toastrMessage = ApplicationMessages.Messages.ReassignBOLDoesntExist;

				Utility.ShowToastr(toastrTypeEnum, toastrMessage, toastrTypeString, null, toastrOptions);
				self.listProgress(false);
			}
			else if (result.IsBolCancelled) {
				toastrTypeEnum = refEnums.Enums.ToastrMessageType.info.ID,
				toastrTypeString = 'info',
				toastrMessage = ApplicationMessages.Messages.ReassignCanceledOrderToastrMessage;

				Utility.ShowToastr(toastrTypeEnum, toastrMessage, toastrTypeString, null, toastrOptions);
				self.listProgress(false);
			}
			else if (result.IsSuborder) {
				$("#reassignToBOLNumber").focus();
				toastrTypeEnum = refEnums.Enums.ToastrMessageType.info.ID,
				toastrTypeString = 'info',
				toastrMessage = ApplicationMessages.Messages.CannotReassignVendorBillToSubSo;

				Utility.ShowToastr(toastrTypeEnum, toastrMessage, toastrTypeString, null, toastrOptions);
				self.listProgress(false);
			}
			else if (result.SOCost >= 0) {
				self.savedSalesOrderId = result.SalesOrderId;

				var actionButtons: Array<IToastrActionButtonOptions> = [];
				actionButtons.push({
					actionButtonName: self.reassignToBOLNumber(),
					actionClick: self.viewDetail
				});
				var viewOrdertoastrOptions: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: "",
					actionButtons: actionButtons
				};
				if (result.VBCost === 0) {
					if (self.actualCost > result.SOCost) {
						toastrTypeEnum = refEnums.Enums.ToastrMessageType.info.ID,
						toastrTypeString = 'info',
						toastrMessage = ApplicationMessages.Messages.ReassignedOrderInsufficientCostMessage;

						Utility.ShowToastr(toastrTypeEnum, toastrMessage, toastrTypeString, null, viewOrdertoastrOptions);
						self.listProgress(false);
					} else {
						self.saveVendorBillReassignment();
					}
				} else {
					if (result.SOCost < (self.actualCost + result.VBCost)) {
						toastrTypeEnum = refEnums.Enums.ToastrMessageType.info.ID,
						toastrTypeString = 'info',
						toastrMessage = ApplicationMessages.Messages.ReassignedOrderInsufficientCostMessage;

						Utility.ShowToastr(toastrTypeEnum, toastrMessage, toastrTypeString, null, viewOrdertoastrOptions);
						self.listProgress(false);
					}
					else {
						self.saveVendorBillReassignment();
					}
				}
			}
		},

			(error) => {
				self.listProgress(false);

				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 5,
					fadeOut: 5,
					typeOfAlert: "",
					title: ""
				};

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ErroWhileSavingReassignment, "error", null, toastrOptions, null);
			});
		// ###END: US26955
	}

	// ###START: US26955
	private saveVendorBillReassignment() {
		var self = this;

		var reassignmentDetails = new refVendorBillReassignmentDetailsModel.Model.VendorBillReassignmentDetails();

		reassignmentDetails.VendorBillId = self.vendorBillId;
		reassignmentDetails.CurrentShipmentId = self.shipmentId;
		reassignmentDetails.ReassignSO = self.reassignToBOLNumber();
		reassignmentDetails.Notes = self.notes();
		reassignmentDetails.ShipmentToCredit = typeof self.selectedOrder() !== 'undefined' ? self.selectedOrder().ShipmentId : null;
		reassignmentDetails.AmountToCredit = self.amountToBeCreditedToCustomer();
		reassignmentDetails.ReassignmentReasonId = self.selectedReason().Id;
		reassignmentDetails.IsCreditToCurrentSO = self.doesCustomerNeedToBeCredited() === 'Yes';


		self.vendorBillClient.SaveVendorBillReassignment(reassignmentDetails,
			(result: number) => {

				var toastrTypeEnum, toastrTypeString: string, toastrMessage: string;

				// bsed on the returned value, show the toastr value
				switch (result) {
					case -1: toastrTypeEnum = refEnums.Enums.ToastrMessageType.error.ID,
						toastrTypeString = 'error',
						toastrMessage = ApplicationMessages.Messages.ErroWhileSavingReassignment;
						break;

					case 1: toastrTypeEnum = refEnums.Enums.ToastrMessageType.info.ID,
						toastrTypeString = 'info',
						toastrMessage = ApplicationMessages.Messages.PendingReassignmentRequestExistsForVB;
						break;

					case 2: toastrTypeEnum = refEnums.Enums.ToastrMessageType.success.ID,
						toastrTypeString = 'success',
						toastrMessage = ApplicationMessages.Messages.ReassignmentDetailsSavedSuccessfully;
						break;

					default: toastrTypeEnum = refEnums.Enums.ToastrMessageType.success.ID,
						toastrTypeString = 'success',
						toastrMessage = ApplicationMessages.Messages.ReassignmentDetailsSavedSuccessfully;
						break;
				}

				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 5,
					fadeOut: 5,
					typeOfAlert: "",
					title: ""
				};

				Utility.ShowToastr(toastrTypeEnum, toastrMessage, toastrTypeString, null, toastrOptions);

				if (self.isNewBOLInvoicedOrScheduled === false && toastrTypeEnum == refEnums.Enums.ToastrMessageType.success.ID) {
					var toastrOptions1 = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					};
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.SONotScheduledForQuickerProcessScheduleTheOrder, 'info', null, toastrOptions1);
				}
				self.listProgress(false);

				if (result >= 1) {
					if (result === 1) {
						self.listProgress(true);
						setTimeout(() => { self.saveCallback() }, 5000);
						self.listProgress(false);
					}
					else {
						self.saveCallback();

						if (self.isNewBOLInvoicedOrScheduled === false) {
							_app.trigger("openSalesOrder", reassignmentDetails.ReassignSO, reassignmentDetails.ReassignSO, (callback) => {
								if (!callback) {
									return;
								}
							});
						}
					}
					self.closePopup(self);
				}
			},
			(error) => {
				self.listProgress(false);

				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 5,
					fadeOut: 5,
					typeOfAlert: "",
					title: ""
				};

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ErroWhileSavingReassignment, "error", null, toastrOptions, null);
			});
	}

	// method to show the toastr with action buttons
	private showRevenueValidationToastr(costDifference) {
		var self = this;

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

		Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.ConfirmationMessageToastrReassignment.replace('{cost_difference}', costDifference), "warning", self.onClickToastr, toastrOptions);
	}

	// #endregion private Event

	//#region Life Cycle Event

	// this method gets called first. optioncontrol is used to pass data to popup from where it's called
	public activate(optionControl: IMessageBoxOption) {
		var self = this;

		if (typeof optionControl !== "undefined"
			&& typeof optionControl.bindingObject !== "undefined"
			&& typeof optionControl.bindingObject.vbReassignmentPopupData != "undefined") {

			var popupData = optionControl.bindingObject.vbReassignmentPopupData;
			// ###START: US26955
			// ###START: US28121
			// ###START: DE26484
			self.actualCost = parseFloat(popupData.vendorBillCost.toString().replace(/,/g, ""));
			// ###END: DE26484

			// ###END: US28121
			// ###END: US26955

			self.vendorBillReassignmentReasons(typeof popupData.reassignmentReasons !== 'undefined' ? popupData.reassignmentReasons : []);
			self.suborderOptions(typeof popupData.orderRevenuePairList !== 'undefined' ? popupData.orderRevenuePairList : []);

			self.vendorBillId = popupData.vendorBillId;
			self.shipmentId = popupData.shipmentId;

			self.currentBOLNumber(popupData.bolNumber);
			self.proNumber(popupData.proNumber);
			self.vendorBillCost(popupData.vendorBillCost ? parseFloat(popupData.vendorBillCost.toString().replace(/,/g, "")) : 0);


			if (optionControl.bindingObject.saveCallback) {
				self.saveCallback = optionControl.bindingObject.saveCallback;
			}
		}
	}
	//##END: US25684

	//composition complete
	public compositionComplete() {
		var self = this;

	}

	//#endregion
}

return ProcessCredittoMasPopupViewModel;