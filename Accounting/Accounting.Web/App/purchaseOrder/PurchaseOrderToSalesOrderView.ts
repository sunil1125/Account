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
/// <reference path="../../Scripts/Constants/ApplicationConstants.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refEnums = require('services/models/common/Enums');
import refAgentNameSearch = require('services/models/purchaseOrder/SearchAgentName');
import refAgencyNameSearch = require('services/models/purchaseOrder/SearchAgencyName');
import refCustomerNameSearch = require('services/models/purchaseOrder/SearchCustomerName');
import refAgentNameSearchControl = require('purchaseOrder/purchaseOrderToSalesOrder/searchAgentNameControl');
import refAgencyNameSearchControl = require('purchaseOrder/purchaseOrderToSalesOrder/searchAgencyNameControl');
import refCustomerNameSearchControl = require('purchaseOrder/purchaseOrderToSalesOrder/searchCustomerNameControl');
import refValidations = require('services/validations/Validations');
import refVendorBillClient = require('services/client/VendorBillClient');
import refPurchaseOrderClient = require('services/client/PurchaseOrderClient');
import refPurchaseOrderToSalesOrderModel = require('services/models/purchaseOrder/POToSOParameters');
import refCustomerSearchControl = require('templates/searchCustomerAutoComplete');
import refCustomerSearchModel = require('services/models/common/searchCustomerName');
import _refForeignBolEmailEmailModel = require('services/models/purchaseOrder/ForeignBolEmail');
import refPodDocModel = require('services/models/purchaseOrder/PurchaseOrderUploadFileModel');
import refCommonClient = require('services/client/CommonClient');
import _refForeignBolEmailDataModel = require('services/models/purchaseOrder/ForeignBolEmailData');
//#endregion

/***********************************************
   PURCHASE ORDER TO SALES ORDER  VIEW MODEL
************************************************
** <summary>
** Purchase Order To Sales Order View Model.
** </summary>
** <createDetails>
** <id>US10941</id><by>Bhanu pratap</by> <date>29th Sep, 2014</date>
** </createDetails>
** <changeHistory>
** <id>US19707</id> <by>SHREESHA ADIGA</by><date>24-11-2015</date><description>Validation for Pickup date < Deliverydate</description>
** <id>DE21776</id> <by>Vasanthakumar</by><date>12-02-2016</date><description>Do not allow user to enter system date in UVB to SO Process</description>
** <id>US22471</id> <by>Vasanthakumar</by> <date>03-06-2016</date> <description>Add Success Toastr message for Emails triggered by users</description>
** <id>US22796</id> <by>Baldev Singh Thakur</by> <date>16-06-2016</date> <description>Added logic to check if TruckLoad is checked.</description>
** <id>DE23560</id> <by>Shreesha Adiga</by> <date>01-08-2016</date> <description>Get email by userid instead of name</description>
** </changeHistory>
***********************************************/
export class PurchaseOrderToSalesOrderViewModel {
	//#region Observables Declaration Region
	uploadFileDetails: ISalesOrderUploadFileModel = new refPodDocModel.Models.PurchaseOrderUploadFileModel();
	//## Holds Pickup Date
	pickupDate: KnockoutObservable<any> = ko.observable('');
	// Holds agent id
	agentId: KnockoutObservable<number> = ko.observable(0);
	agentName: KnockoutObservable<string> = ko.observable('');
	// Holds agency id
	agencyId: KnockoutObservable<number> = ko.observable(0);
	agencyName: KnockoutObservable<string> = ko.observable('');
	emailAddress: KnockoutObservable<string> = ko.observable('');
	//Holds customer Id
	customerId: KnockoutComputed<number>;
	customerName: KnockoutComputed<string>;
	customerSearchList: refCustomerSearchControl.SearchCustomerAutoComplete;
	timeRemaining: KnockoutObservable<any> = ko.observable();
	vendorBillId: KnockoutObservable<number> = ko.observable(0);
	carrierId: KnockoutObservable<number> = ko.observable(0);
	proNumber: KnockoutObservable<string> = ko.observable('');
	isTodayHoliday: KnockoutObservable<boolean> = ko.observable(false);
	// To get the logged in user
	currentUser: KnockoutObservable<IUser> = ko.observable();
	//Holds Customer Financial Details
	// hold term
	term: KnockoutObservable<string> = ko.observable('');
	// Hold AvailableCredit
	availableCredit: KnockoutObservable<string> = ko.observable('0.00');
	//carrier
	carrierName: KnockoutObservable<string> = ko.observable('');

	errorWidth: KnockoutObservable<string> = ko.observable('97%');
	normalWidth: KnockoutObservable<string> = ko.observable('99%');
	//##END Observables Declaration Region

	datepickerOptions: DatepickerOptions;
	error: KnockoutValidationErrors;
	isValidationShown: boolean = false;
	// to throw validation on button click
	errorPOToSODetail: KnockoutValidationGroup;

	//## Function Declaration Region
	isNumber: (that, event) => void;
	isAlphaNumericSpace: (that, event) => void;

	//#region Members
	//for tracking change
	getTrackChange: () => string[];
	isDirty: KnockoutComputed<boolean>;
	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	returnValueFlag: boolean = false;
	//## To trigger when when 'TAB' press from last field.
	keyListenerCallback: () => any;

	onRateItCustomerCallBack: () => any;
	onRateItManuallyClick: () => any;
	onCustomerChangeCallBack: (flag: boolean, customerId: number, agentAgencyDetails: any) => any;
	//## To trigger when when 'TAB' press from last field.
	isTabPress: (that, event) => void;

	//to enable Rate it On customer button
	enableRateIt: KnockoutObservable<boolean> = ko.observable(false);
	isAgentNotificationClicked: KnockoutObservable<boolean> = ko.observable(false);
	isForeignBolChecked: KnockoutObservable<boolean> = ko.observable(false);

	showTimer: KnockoutObservable<boolean> = ko.observable(false);
	isForeignBolSelectedForView: KnockoutObservable<boolean> = ko.observable(false);
	isStopTimerClicked: KnockoutObservable<boolean> = ko.observable(false);
	StopTimer: KnockoutObservable<boolean> = ko.observable(false);
	timerStoppedTimeRemaining: string;
	myTimer: any;
	//#endregion

	//# Initializations
	agentNameSearchList: refAgentNameSearchControl.SearchAgentNameControl;
	agencyNameSearchList: refAgencyNameSearchControl.SearchAgencyNameControl;
	customerNameSearchList: refCustomerNameSearchControl.SearchCustomerNameControl;
	purchaseOrderClient: refPurchaseOrderClient.PurchaseOrderClient = new refPurchaseOrderClient.PurchaseOrderClient();
	purchaseOrderToSalesOrderModel: refPurchaseOrderToSalesOrderModel.Models.POToSOParameter = new refPurchaseOrderToSalesOrderModel.Models.POToSOParameter();
	commonUtils: CommonStatic = new Utils.Common();
	// client command
	commonClient: refCommonClient.Common = new refCommonClient.Common();
	purchaseOrderData: _refForeignBolEmailDataModel.Models.ForeignBolEmailData;
	hasCustomerAssociation: (isUVBAssociatedToCustomer: boolean) => any;
	// to disable isForeignBOL after sending mail
	disableIsForeignBOL: (isMailSend: boolean) => any;
	timerTitle: KnockoutObservable<string> = ko.observable('Stop Timer');

	//#endregion

	//##START: US19707
	deliveryDate: KnockoutObservable<any> = ko.observable('');
	//##END: US19707

	// ###START: US22796
	isPoToSo: KnockoutObservable<boolean> = ko.observable(false);
	isTruckLoadChecked: KnockoutObservable<boolean> = ko.observable(false);
	customerNameForTlSo: string;
	// ###END: US22796
	//#region

	constructor(onRateItCustomerCallBack: () => any, onRateItManuallyClick: () => any, onCustomerChangeCallBack?: (flag: boolean, customerId: number, agentAgencyname: any) => any, hasCustomerAssociation?: (isUVBAssociatedToCustomer: boolean) => any, disableIsForeignBOL?: (isMailSend: boolean) => any) {
		var self = this;
		self.onRateItCustomerCallBack = onRateItCustomerCallBack;
		self.onRateItManuallyClick = onRateItManuallyClick;
		_app.trigger("IsTodayHoliday", (data) => {
			self.isTodayHoliday(data);
		});

		if (typeof (onCustomerChangeCallBack) !== 'undefined') {
			self.onCustomerChangeCallBack = onCustomerChangeCallBack;
		}

		if (typeof (hasCustomerAssociation) !== 'undefined') {
			self.hasCustomerAssociation = hasCustomerAssociation;
		}

		if (typeof (disableIsForeignBOL) !== 'undefined') {
			self.disableIsForeignBOL = disableIsForeignBOL;
		}

		self.agentNameSearchList = new refAgentNameSearchControl.SearchAgentNameControl("A valid Agent Name is required.", () => {
			self.agentSelection();
		});
		self.agencyNameSearchList = new refAgencyNameSearchControl.SearchAgencyNameControl("A valid Agency Name is required.", () => {
			self.agencySelection();
		});
		//self.customerNameSearchList = new refCustomerNameSearchControl.SearchCustomerNameControl("A valid Customer Name is required

		self.customerSearchList = new refCustomerSearchControl.SearchCustomerAutoComplete("A valid Customer Name is required.", (salesRep: string, agencyName: string, agencyID?: number, agentID?: number) => {
			//self.agentName(salesRep);
			//self.agentId(agentID);
			//self.agencyName(agencyName);
			//self.agencyId(agencyID);
			var agentAgencyDetails = { agentName: salesRep, agentId: agentID, agencyName: agencyName, agencyId: agencyID };
			if (salesRep === '' || salesRep === undefined || salesRep === null) {
				self.onCustomerChangeCallBack(false, self.customerSearchList.id(), agentAgencyDetails);
			} else {
				self.onCustomerChangeCallBack(true, self.customerSearchList.id(), agentAgencyDetails);
			}
			self.isAgentNotificationClicked(true);
		}, '95%', '90.2%', true, (isCustomerBlank) => {
				self.isAgentNotificationClicked(isCustomerBlank);
			});
		self.customerSearchList.isCustomCssSO(true);

		// To validate Pickup Date
		self.pickupDate = ko.observable().extend({
			required: {
				message: 'Pickup date is required.'
			},

			validation: [
				{
					validator: () => refValidations.Validations.isValidDate(self.pickupDate(), self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "PickupDate"),
					message: 'Not a valid date'
				},
				//##START: US19707
				{
					validator: () => refValidations.Validations.isValidDate(self.pickupDate(), self.commonUtils.formatDate(new Date(self.deliveryDate()), 'mm/dd/yyyy'), "BillDate"),
					message: 'Pickup date should be less than or equal to delivery date'
				},
				//##END: US19707
				// ###START: DE21776
				{
					validator: () => refValidations.Validations.isValidDate(self.pickupDate(), self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "CurrentDate"),
					message: 'Pickup Date cannot be today\'s Date'
				},
				// ###END: DE21776
			]
		});

		//To check if enter value is digit and decimal
		self.isNumber = (data, event) => {
			var charCode = (event.which) ? event.which : event.keyCode;

			//to allow copy(ctrl + c) in firefox
			if (event.ctrlKey && (charCode == 99 || charCode == 67)) {
				return true;
			}
			if ((charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57))) {
				return false;
			}
			return true;
		}

		//To check if enter value is Alpha Numeric and Space
		self.isAlphaNumericSpace = (data, event) => {
			var charCode = (event.which) ? event.which : event.keyCode;

			if ((charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122))) {
				return false;
			}
			return true;
		}

		// to get the customer Id after selecting Customer
		self.customerId = ko.computed(() => {
			if (self.customerSearchList.name() != null) {
				var successCallBack = function (data) {
					if (data != null) {
						self.term(data.Terms);
						var availBleCredit = ((data.CreditLimit ? data.CreditLimit : 0) - ((data.Balance ? data.Balance : 0) + (data.UnbilledAmount ? data.UnbilledAmount : 0)));
						self.availableCredit($.number(availBleCredit, 2));
					}
				},
					failureCallBack = function () {
					}

				self.purchaseOrderClient.getCustomerFinancialDetailsByCustomerId(self.customerSearchList.id(), successCallBack, failureCallBack);
				return self.customerSearchList.id();
			}

			return 0;
		});

		// to get the customer Name after selecting Customer
		self.customerName = ko.computed(() => {
			if (self.customerSearchList.name() != null)
				return self.customerSearchList.customerName();

			return null;
		});

		//##START: DE23560
		// get the email with the agent's id instead of name
		self.agentId.subscribe(() => {
			self.commonClient.getUserDetailsByUserId(self.agentId(), (userData) => {
				if (typeof userData != "undefined" && userData != null && typeof userData.Email != "undefined") {
					self.emailAddress(userData.Email);
				}
			});
		});
		//##END: DE23560

		// ###START: DE21776
		//To set The date picker options
		self.datepickerOptions = {
			todayBtn: false,
			blockWeekend: true,
			blockPreviousDays: false,
			blockHolidaysDays: true,
			autoClose: true,
			placeBelowButton: false,
			endDate: new Date()
		};
		// ###END: DE21776

		//#region Error Details Object
		self.errorPOToSODetail = ko.validatedObservable({
			vendorNameSearchList: self.customerSearchList,
			pickupDate: self.pickupDate
		});
		return self;
	}
	//#endregion

	//#region Internal Methods
	// When user select any other agency then it clears existing dependent filled fields.
	public agencySelection() {
		var self = this;
		self.agentNameSearchList.agentName('');
		self.agentNameSearchList.ID(0);
		self.customerNameSearchList.customerName('');
		self.customerNameSearchList.ID(0);
		self.term('');
		self.availableCredit('');
	}

	// When user select keep address/delete address all the fields should be empty
	public clearAllSelection() {
		var self = this;
		self.agentNameSearchList.agentName('');
		self.agentNameSearchList.ID(0);
		self.customerSearchList.customerName('');
		self.customerSearchList.id(0);
		self.agencyNameSearchList.agencyName('');
		self.agencyNameSearchList.ID(0);
		self.agentName('');
		self.agencyName('');
		self.term('');
		self.availableCredit('');
	}

	// When user select any other agent then it clears existing dependent filled fields.
	public agentSelection() {
		var self = this;
		self.customerNameSearchList.customerName('');
		self.customerNameSearchList.ID(0);
		self.term('');
		self.availableCredit('');
	}

	public onRateItOnCustomer() {
		var self = this;
		// Get the logged in user for name for new note}
		_app.trigger("GetCurrentUserDetails", function (currentUser: IUser) {
			self.purchaseOrderToSalesOrderModel.CurrentUser = currentUser.FullName;
		});

		if (self.validatePOToSODetails()) {
			return false;
		}
		else {
			self.onRateItCustomerCallBack();
		}
	}

	//Click on Rate it manually
	public onRateItOnCustomerManuallyClick() {
		var self = this;
		// ###START: US22796
		self.customerNameForTlSo = self.customerName();
		self.purchaseOrderToSalesOrderModel.CustomerName = self.customerNameForTlSo

		// ###END: US22796
		// Get the logged in user for name for new note}
		_app.trigger("GetCurrentUserDetails", function (currentUser: IUser) {
			self.purchaseOrderToSalesOrderModel.CurrentUser = currentUser.FullName;
		});

		if (self.validatePOToSODetails()) {
			return false;
		}
		else {
			self.onRateItManuallyClick();
		}
	}

	//Validating PO To SO property}
	public validatePOToSODetails() {
		var self = this;

		self.customerSearchList.vaildateSearchCustomerNameControl();
		if (self.errorPOToSODetail.errors().length != 0) {
			self.errorPOToSODetail.errors.showAllMessages();
			return true;
		}
		else {
			return false;
		}
	}

	// Open Send Agent Mail Notification
	public onSendAgentMailNotification() {
		var self = this;
		self.isAgentNotificationClicked(false);
		//var foreignBolEmail = {Data:null};
		var foreignBolEmail = new _refForeignBolEmailEmailModel.Models.ForeignBolEmail();
		foreignBolEmail.CustomerName = self.customerName();
		foreignBolEmail.AgentName = self.agentName();
		foreignBolEmail.EmailAddress = self.emailAddress();
		foreignBolEmail.IsForeignBol = self.isForeignBolChecked();
		foreignBolEmail.VendorBillId = self.vendorBillId();
		foreignBolEmail.CustomerId = self.customerId();
		foreignBolEmail.SalesRepId = self.agentId();
		var obj = { foreignBolEmail: foreignBolEmail, uploadData: self.uploadFileDetails };

		var refresh = () => {
			self.compositionComplete();
		};
		var optionControlArgs: IMessageBoxOption = {
			options: undefined,
			message: '',
			title: 'Agent Notification',
			bindingObject: obj
		}
		//Call the dialog Box functionality to open a Popup
		_app.showDialog('purchaseOrder/ForeignBolAgentEmail', optionControlArgs, 'slideDown').then((object) => {
			self.isAgentNotificationClicked(true);
			if (object.foreignBolEmailExpiry() !== '' && object.foreignBolEmailExpiry() != 'ServerError') {
				self.customerSearchList.isEnable(false);
				//self.mailSentSuccessCallBack(object.foreignBolEmailExpiry());
				if (object.foreignBolEmailExpiry() !== '' && object.foreignBolEmailExpiry() !== '0') {
					self.isStopTimerClicked(true);
					self.startAndStopTimer(object.foreignBolEmailExpiry());
					if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
						self.onChangesMade(false);
					self.disableIsForeignBOL(true);
				}
				else {
					if (typeof (self.timeRemaining()) != 'undefined') {
						self.showTimer(true);
						self.hasCustomerAssociation(true);
					}
					else {
						self.showTimer(false);
					}
				}
			}
			else {
				//self.mailSentSuccessCallBack('ShowTimer');
			}
		});
	}

	//
	public initializePurchaseOrderTOSO(timeRemaining: any, isStopTimer: boolean) {
		var self = this;
		if (isStopTimer) {
			self.startAndStopTimer(timeRemaining);
			self.isAgentNotificationClicked(true);
		}
		else {
			self.timeRemaining(timeRemaining);
			self.showTimer(true);
			self.isAgentNotificationClicked(false);
			self.customerSearchList.isEnable(true);
		}
	}

	//
	public startAndStopTimer(expiryTime?: string) {
		var self = this;
		self.showTimer(true);
		if (!self.isTodayHoliday()) {
			if (!self.StopTimer()) {
				clearInterval(self.myTimer);
				if (expiryTime != '00:00:00') {
					self.isStopTimerClicked(true);
					var splitTime = expiryTime.split(':');

					var second = ((+splitTime[0] * 60 * 60) + (+splitTime[1] * 60) + (+splitTime[2])) * 1000;
					self.myTimer = setInterval(function () {
						var expiryDateTime = new Date();
						var currentDateTime = new Date();

						var miliSeconds = second - 1000;
						var seconds = (Math.floor(miliSeconds / 1000));
						var minutes = (Math.floor(miliSeconds / 1000 / 60));
						var hours = Math.floor(minutes / 60);
						minutes = minutes % 60;
						seconds = seconds % 60;
						var hoursToDisplay = hours < 10 ? "0" + hours.toString() : hours.toString();
						var minutesToDisplay = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
						var secondsToDisplay = seconds < 10 ? "0" + seconds.toString() : seconds.toString();
						self.timeRemaining(hoursToDisplay + ":" + minutesToDisplay + ":" + secondsToDisplay); //+ ":" + secondsToDisplay
						self.timerStoppedTimeRemaining = hoursToDisplay + ":" + minutesToDisplay + ":" + secondsToDisplay; // + ":" + secondsToDisplay
						second = miliSeconds;
					}, 1000);
				}
				else {
					self.timeRemaining(expiryTime);
					self.isStopTimerClicked(false);
				}
			}
			else {
				self.timeRemaining(expiryTime);
				self.StopTimer(false);
			}
		}
		else {
			self.timeRemaining(expiryTime);
			self.timerStoppedTimeRemaining = expiryTime;
		}
	}

	//Stop Timer Functionality
	public onStopTimer() {
		var self = this;
		if (self.timerTitle() == Constants.UIConstants.ResumeTimer) {
			self.timerTitle(Constants.UIConstants.PauseTimer);
			self.purchaseOrderClient.ResumeForeignBolTimer(self.vendorBillId(), self.customerSearchList.id(), (data) => {
				self.startAndStopTimer(data);
				self.customerSearchList.isEnable(false);
				self.disableIsForeignBOL(true);
				// ###START: US22471
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SendSuccessfullyMail, "success", null, toastrOptions);
			}, (message) => {
					// Saving failed call back message					
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
				}, (message) => {
					// Saving failed call back info message				
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, message, "info", null, toastrOptions, null);
				});
			// ###END: US22471
			self.isAgentNotificationClicked(true);
		}
		else {
			clearInterval(self.myTimer);
			var time = self.timerStoppedTimeRemaining;
			self.isStopTimerClicked(false);
			self.StopTimer(true);
			self.startAndStopTimer(time);

			self.purchaseOrderClient.DeactivateAgentNotificationForVendorBill(self.vendorBillId(), self.timerStoppedTimeRemaining, () => {
				self.customerSearchList.isEnable(true);

				self.hasCustomerAssociation(true);
				self.sendNotificationOnStopTimer(self.customerSearchList.id());
				self.timerTitle(Constants.UIConstants.ResumeTimer);
			}, () => { });
			self.isAgentNotificationClicked(false);
		}
	}

	private sendNotificationOnStopTimer(customerId) {
		var self = this;
		self.purchaseOrderClient.SendAgentNotificationOnStopTimer(customerId, self.vendorBillId(), () => {
			// ###START: US22471
			var toastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 10,
				fadeOut: 10,
				typeOfAlert: "",
				title: ""
			}
			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SendSuccessfullyMail, "success", null, toastrOptions);
		}, (message) => {
				// Saving failed call back message					
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
			}, (message) => {
				// Saving failed call back info message				
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, message, "info", null, toastrOptions, null);
			});
		// ###END: US22471
	}
	//#region if user any numeric  date  without any format

	private convertToPickupDate() {
		var self = this;
		if (!self.pickupDate().match('/') && self.pickupDate().length > 0) {
			self.pickupDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.pickupDate()));
		}
	}

	//#endregion
	//#endregion

	//#region Life Cycle Event
	public activate() {
		return true;
	}

	//** Using for focus cursor on last cycle for focusing in vendor name
	public compositionComplete() {
		var self = this;
		//self.startAndStopTimer(self.timeRemaining());
	}

	public cleanup() {
		var self = this;
		self.agencyNameSearchList.cleanup();
		self.agentNameSearchList.cleanup();
		//self.customerNameSearchList.cleanup();
		self.customerSearchList.cleanup();
		for (var property in self) {
			if (property != "cleanup")
				delete self[property];
		}

		delete self;
	}
	//#endregion
}