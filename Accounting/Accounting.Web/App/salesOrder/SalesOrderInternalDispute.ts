/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
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
import refEnums = require('services/models/common/Enums');
import refValidations = require('services/validations/Validations');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refSalesOrderDispute = require('salesOrder/SalesOrderDisputeView');
import refsalesOrderDisputeDetails = require('services/models/salesOrder/VendorBillDisputeContainer');
import refsalesOrderDisputeVendorBillDetails = require('services/models/salesOrder/DisputeVendorBill');
import refsalesOrderDisputeAgentDispute = require('services/models/salesOrder/AgentDispute');
//#endregion
/*
** <summary>
** Purchase Order Agent Email View Model.
** </summary>
** <createDetails>
** <id>US10948</id> <by>Chandan</by> <date>29th july, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by> <date></date>
** </changeHistory>
*/

class SalesOrderInternalDisputeViewModel {
	//#region Members
	// sales order client class reference
	salesOrderClient: refSalesOrderClient.SalesOrderClient = null;
	//Logged in User Details For Disputed By
	currentUser: KnockoutObservable<IUser> = ko.observable();
	//Disputed By (Current User)
	disputedBy: KnockoutObservable<string> = ko.observable('');
	//Disputed Amount of Selected VB
	disputeAmount: KnockoutObservable<number> = ko.observable();
	//disputeAmount: number;
	//Selected Requote reason code
	selectedDisputeReason: KnockoutObservable<IRequoteReasonCodes> = ko.observable().extend({ required: { message: "A valid Dispute Reason is required." } });
	//For get selected dispute reason Id
	selectedDisputeReasonId: KnockoutObservable<number> = ko.observable();
	//Internal Dispute Notes
	internalDisputeNotes: KnockoutObservable<string> = ko.observable();
	//Internal Dispute Notes
	internalDisputeId: KnockoutObservable<number> = ko.observable();
	vendorBillId: number;
	salesOrderId: number;
	//For Validation purpose
	errorSalesOrderDetail: KnockoutValidationGroup;
	//Requote Reason code reference  IRequoteReasonCodes
	requoteReasonCode: KnockoutObservableArray<IRequoteReasonCodes> = ko.observableArray([]);
	//Internal Dispute date which binding through salesOrder selected dispute
	internalDisputeDatePopup: KnockoutObservable<any> = ko.observable('').extend({ required: { message: " A valid Dispute Date is required" } });
	//creating object for date picker options
    datepickerOptions: DatepickerOptions;
    // Accepts only numeric with decimal input
    NumericInputWithDecimalPoint: INumericInput;
	public checkMsgHide: () => any;
	public checkMsgClick: () => any;
	private checkMsgDisplay: boolean = true;
	commonUtils: CommonStatic = new Utils.Common();
	onSaveClick: KnockoutObservable<boolean> = ko.observable(false);
	//#endregion

	//#region Constructor
	constructor() {
		var self = this;

		//To get current user Details
		if (!self.currentUser() && (self.disputedBy() === "" || self.disputedBy() === undefined || self.disputedBy() === null)) {
			self.getLoggedInUserDetails();
			self.disputedBy(self.currentUser().FullName);
		}

        //set the flag allow decimal: true to accepts decimals
        self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(true) };

		//To set The date picker options
		self.datepickerOptions = {
			blockWeekend: true,
			blockPreviousDays: false,
			blockHolidaysDays: true,
			autoClose: true,
			placeBelowButton: false,
		};

		self.disputeAmount.extend({
			required: {
				message: ApplicationMessages.Messages.ValidDisputeAmountRequired,
				onlyIf: () => {
					return (self.onSaveClick());
				}
			},
			number: true,
			min: {
				params: 1,
				message: ApplicationMessages.Messages.ValidDisputeAmountRequired,
				onlyIf: () => {
					return (self.onSaveClick());
				}
			}
		});

		self.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
		// Load all Requote Reason Code via if not loaded already
		var requoteReasonCodeLength: number = self.requoteReasonCode().length;
			self.salesOrderClient.GetRequoteReasonCodes((data) => {
				if (data) {
					self.requoteReasonCode.removeAll();
					self.requoteReasonCode.push.apply(self.requoteReasonCode, data);

					self.bindSelectedDisputeReason();
				}
			}, ()=> {
			});

		//#region Error Details Object
		self.errorSalesOrderDetail = ko.validatedObservable({
			internalDisputeDatePopup: self.internalDisputeDatePopup,
			disputeAmount: self.disputeAmount,
			selectedDisputeReason: self.selectedDisputeReason
		});

		//To check if Msg is clicked
		self.checkMsgClick = () => {
			self.checkMsgDisplay = true;
		}

		// to Check if Msg is hidden or closed
		self.checkMsgHide = () => {
			self.checkMsgDisplay = true;
		}

		return self;
		//#region Error Details Object
	}

	//#endregion

	// Gets the logged in user details from shell.js
	getLoggedInUserDetails() { // Get the logged in user for name for new note}
		var self = this;
		_app.trigger("GetCurrentUserDetails", (currentUser: IUser) => {
			self.currentUser(currentUser);
		});
	}

	//#region Public Methods
	public bindSelectedDisputeReason() {
		var self = this;
		var selectedItem = $.grep(self.requoteReasonCode(), function (e) { return e.ReQuoteReasonID === self.selectedDisputeReasonId(); })[0];
		self.selectedDisputeReason(selectedItem);
	}

	// Check validation for each line item
	public checkValidation() {
		var self = this;
		if (self.errorSalesOrderDetail.errors().length != 0) {
			self.errorSalesOrderDetail.errors.showAllMessages();
			return true;
		} else {
			return false;
		}
	}

	public onSaveAgentDispute(dialogResult) {
		var self = this;
		self.onSaveClick(true);
		if (!self.checkValidation()) {
			self.onSaveClick(false);
			var salesOrderAgentDispute = new refsalesOrderDisputeAgentDispute.Models.AgentDispute();
			salesOrderAgentDispute.DisputedRepName = self.disputedBy();
			salesOrderAgentDispute.DisputeDate = self.internalDisputeDatePopup();
			salesOrderAgentDispute.DisputeReason = self.selectedDisputeReason().ReQuoteReasonID;
			salesOrderAgentDispute.DisputeNotes = self.internalDisputeNotes();
			salesOrderAgentDispute.ShipmentId = self.salesOrderId;
			salesOrderAgentDispute.VendorBillId = self.vendorBillId;
			salesOrderAgentDispute.DisputeAmount = self.disputeAmount();
			salesOrderAgentDispute.Id = self.internalDisputeId();
			refSalesOrderClient.SalesOrderClient.prototype.SaveAgentDispute(salesOrderAgentDispute, (message) => {
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 15,
					fadeOut: 15,
					typeOfAlert: "",
					title: ""
				}
          Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.AgentDisputeSavedSuccessfully, "success", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				dialogResult.__dialog__.close(this, dialogResult);
				return true;
			}, () => {
				})
		}
	}
	//close popup
	public closePopup(dialogResult) {
		dialogResult.__dialog__.close(this, dialogResult);
		return true;
	}

	//#endregion

	//#region Private Methods
	private convertToBookedDate() {
		var self = this;
		if (!self.internalDisputeDatePopup().match('/') && self.internalDisputeDatePopup().length > 0) {
			self.internalDisputeDatePopup(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.internalDisputeDatePopup()));
		}
	}
	//#endregion

	//#region Life Cycle Event
	public load() {
	}
	public compositionComplete(view, parent) {
		//$('#txtuserName').focus();
	}

	// Activate the view and bind the selected data from the main view
	public activate(refresh: IMessageBoxOption) {
		var self = this;

		if (refresh.bindingObject) {
			if (refresh.bindingObject.internalDiputeDate()) {
				self.internalDisputeDatePopup(self.commonUtils.formatDate(refresh.bindingObject.internalDiputeDate().toString(), 'mm/dd/yyyy'));
			} else {
				self.internalDisputeDatePopup(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
			}
			if (refresh.bindingObject.internalDisputedAmount())
			{
				self.disputeAmount($.number(refresh.bindingObject.internalDisputedAmount(),2));
			} else {
				self.disputeAmount($.number(0,2));
			}
			self.vendorBillId = refresh.bindingObject.vendorBillId();
			self.salesOrderId = refresh.bindingObject.salesOrderId();
			self.internalDisputeNotes(refresh.bindingObject.internalDisputeNotes());
			self.internalDisputeId(refresh.bindingObject.internalDisputeId());
			self.selectedDisputeReasonId(refresh.bindingObject.disputedReason());
			if (refresh.bindingObject.internalDisputedBy()) {
				self.disputedBy(refresh.bindingObject.internalDisputedBy());
			}
		}
	}
	//#endregion Life Cycle Event
}

return SalesOrderInternalDisputeViewModel;