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
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import _refAppShell = require('shell');
import refValidations = require('services/validations/Validations');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refEnums = require('services/models/common/Enums');
//#endregion

/*
** <summary>
** Sales Order Shipping View Model.
** </summary>
** <createDetails>
** <id>US8214</id> <by>Bhanu pratap</by> <date>Sep-01-2014</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by>bhanu</by> <date>Sep-10-2014</date>
** <id>US19648</id> <by>Baldev Singh Thakur</by> <date>17-11-2015</date> <description>Acct: Display Transit Days value in Accounting Center</description>
** <id>DE21322</id> <by>Vasanthakumar</by> <date>03-02-2016</date> <description>AM/PM value coming in pickup ready/close time after reload SO again</description>
** <id>DE21792</id> <by>Vasanthakumar</by> <date>17-02-2016</date> <description>Disable the service type for SO Entry. Loading based on carrier</description>
** <id>US22417</id> <by>Janakiram</by> <date>19-05-2016</date> <description>Acct: Main SO Screen UI Field changes added like Customer BOL#, Total Pieces, Total Weight </description>
** <id>DE23046</id> <by>Janakiram</by> <date>02-06-2016</date> <description>Removed Total Pieces, Total Weight </description>
** <id>DE23850</id> <by>Shreesha Adiga</by> <date>15-09-2016</date> <description>Changes to calculating estimated due date using transit days</description>
** </changeHistory>
*/
export class salesOrderShippingViewModel {
	//#region Members
	requestedPickupDate: KnockoutObservable<any> = ko.observable('').extend({ required: { message: ApplicationMessages.Messages.ValidDateRequired } });
	pickupDate: KnockoutObservable<any> = ko.observable('');
	invoiceDate: KnockoutObservable<any> = ko.observable('');
	ltlCalendarDays: KnockoutObservable<any> = ko.observable('');
	oceanCalendarDays: KnockoutObservable<any> = ko.observable('');
	isCalendarDaysNull: KnockoutObservable<boolean> = ko.observable(false);
	transitDays: KnockoutObservable<string> = ko.observable('');
	oldCalendarDays: KnockoutObservable<any> = ko.observable('');
	oldTransitDays: KnockoutObservable<string> = ko.observable('');
	pickupReadyTime: KnockoutObservable<string> = ko.observable('');
	pickupReadyTimeOptions: jQTimepickerOptions = { minTime: '06:00', maxTime: '21:30', forceRoundTime: true, scrollDefaultNow: true, timeFormat: "H:i" };
	pickupCloseTime: KnockoutObservable<string> = ko.observable('');
	pickupCloseTimeOptions: jQTimepickerOptions = { minTime: '06:00', maxTime: '23:30', forceRoundTime: true, scrollDefaultNow: true, timeFormat: "H:i" };
	estimatedDueDate: KnockoutObservable<any> = ko.observable('');
	shipBy: KnockoutObservable<string> = ko.observable('');
	// To get the logged in user
	_currentUser: KnockoutObservable<IUser> = ko.observable();
	originTerminalPhone: KnockoutObservable<string> = ko.observable('');
	destinationTerminalPhone: KnockoutObservable<string> = ko.observable('');
	serviceTypeList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	selectedServiceType: KnockoutObservable<number> = ko.observable();
	insuredAmount: KnockoutObservable<number> = ko.observable();
	deliveryDate: KnockoutObservable<any> = ko.observable('');
	carrierPickupNumber: KnockoutObservable<string> = ko.observable('');
	pickupRemarks: KnockoutObservable<string> = ko.observable('');
	deliverRemarks: KnockoutObservable<string> = ko.observable('');
	processFlow: KnockoutObservable<boolean> = ko.observable();
	newShipmentType: KnockoutObservable<string> = ko.observable('');
	masterCustomerId: KnockoutObservable<number> = ko.observable(0);
	termsType: KnockoutObservable<string> = ko.observable('');
	// validation Function for checking number and alphanumeric
	isNumber: (that, event) => void;
	isAlphaNumericSpace: (that, event) => void;
	isSaveEnable: KnockoutObservable<boolean> = ko.observable(true);
	datepickerOptions: DatepickerOptions;
	datepickerOptionsDelivery: DatepickerOptions;
	commonUtils: CommonStatic = new Utils.Common();
	callForEntry: KnockoutObservable<boolean> = ko.observable(false);
	isWeekend: KnockoutObservable<boolean> = ko.observable(false);
	isWeekendMessage: KnockoutObservable<string> = ko.observable('');
	// sales order client instance
	salesOrderClient: refSalesOrderClient.SalesOrderClient;
	requireClosetimeChange: boolean = true;
	EnableServiceType: KnockoutObservable<boolean> = ko.observable(false);
	CanSeeCustomerTermType: KnockoutObservable<boolean> = ko.observable(false);
	isServiceTypeEnable: KnockoutObservable<boolean> = ko.observable(true);

	// ###START: US22417
	totalPieces: KnockoutObservable<number> = ko.observable();
	totalWeigth: KnockoutObservable<number> = ko.observable();
	customerBolNumber: KnockoutObservable<string> = ko.observable('');
	// ###END: US22417

	/**
	* On hover of pickup and Close Time it, this function creates a popover to show breakup
	*/
	showReadyTimeMessage: (event: MouseEvent) => void;

	//To trigger when when 'TAB' press from last field.
	isTabPress: (that, event) => void;

	//To trigger when when 'TAB' press from last field.
	keyListenerCallback: () => any;

	// For Validation purpose

	errorShippingDetail: KnockoutValidationGroup;
	isValidationShown: boolean = false;

	//for tracking change
	getBITrackChange: () => string[];
	isBIDirty: KnockoutComputed<boolean>;
	isNotAtLoadingTime: boolean = false;
	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	//Call back for carrier type to remove validation on truckload
	carrierTypeSelection: (carrierType: number) => any;
	returnValue: boolean = false;
	serviceType: number;
	//#endregion

	//#region Constructor
	constructor(callForEntry: boolean, currentUser: IUser, keyListenerCallback: () => any, carrierTypeSelectionCallback?: (carrierType: number) => any) {
		var self = this;
		////##START: DE21792	
		self.isServiceTypeEnable(false);
		////##END: DE21792
		self.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
		self.callForEntry(callForEntry);
		self.keyListenerCallback = keyListenerCallback;
		self.carrierTypeSelection = carrierTypeSelectionCallback;

		// get the logged in user details object
		if (currentUser) {
			self._currentUser(currentUser);
		}
		// initialize the ship By name as logged in user name
		if (self._currentUser()) {
			self.shipBy(self._currentUser().FullName);
		}

		// Load invoice status if not loaded already
		var serviceTypeLength: number = self.serviceTypeList().length;
		if (!(serviceTypeLength)) {
			_app.trigger("GetSalesOrderServiceTypeList", function (data) {
				if (data) {
					self.serviceTypeList.removeAll();
					self.serviceTypeList.push.apply(self.serviceTypeList, data);
				}
			});
		}

		//To check if enter value is digit and decimal
		self.isNumber = function (data, event) {
			var charCode = (event.which) ? event.which : event.keyCode;

			if (event.ctrlKey && (charCode == 99 || charCode == 67)) {
				return true;
			}

			if ((charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57))) {
				return false;
			}
			return true;
		}

		//To check if enter value is Alpha Numeric and Space
		self.isAlphaNumericSpace = function (data, event) {
			var charCode = (event.which) ? event.which : event.keyCode;

			if ((charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122))) {
				return false;
			}
			return true;
		}

		//#region Date Validation
		self.requestedPickupDate = ko.observable().extend({
			required: {
				message: ApplicationMessages.Messages.RequestedPickupDateIsRequired
			},

			validation: {
				validator: function () { return refValidations.Validations.isValidDate(self.requestedPickupDate(), self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "Requested Pickup Date"); },
				message: ApplicationMessages.Messages.NotAValidDate
			}
		});

		self.pickupReadyTime = ko.observable().extend({
			required: {
				message: ApplicationMessages.Messages.ValidPickupReadyTimeRequired,
				onlyIf: () => {
					return (self.selectedServiceType() !== 3);
				}
			}
		});

		self.pickupCloseTime = ko.observable().extend({
			required: {
				message: ApplicationMessages.Messages.ValidPickupCloseTimeRequired,
				onlyIf: () => {
					return (self.selectedServiceType() !== 3);
				}
			}
		});

		//#endregion

		//#region Subscribe functions

		// To check value is not greater than 31
		self.transitDays.subscribe((newValue) => {
			if (+newValue > 31)
				self.transitDays('');

			// ###START: US19648
			//To calculate estimated due date based on requested pickup date
			var transitDays = self.transitDays();
			var requestedPickDate = new Date(Date.parse(self.requestedPickupDate()));

			// ##START: DE23850
			// if the transit days field is empty, consider it as 0
			transitDays = transitDays !== "" ? transitDays : "0";

			// if the transit days has a range eg. 1-6 days, then take '6' for calulating the estimated due date and not '1'
			transitDays = transitDays.indexOf('-') === -1 ? transitDays : transitDays.split('-').pop();
			// ##END: DE23850

			var estimatedDueDate: Date;
			if (parseInt(transitDays) > 0) {
				for (var day = 1; day <= parseInt(transitDays); day++) {
					//// Adding transit Days
					requestedPickDate.setDate(requestedPickDate.getDate() + 1);

					estimatedDueDate = new Date(requestedPickDate.toString()); //To check Weekends or Holidays
					if (estimatedDueDate.toLocaleDateString() !== "" && estimatedDueDate.toLocaleDateString() !== "Invalid Date") {

						while (!Utils.Common.prototype.isHoliday(estimatedDueDate) || !Utils.Common.prototype.isWeekend(estimatedDueDate)) {
							requestedPickDate.setDate(requestedPickDate.getDate() + 1);
							estimatedDueDate = new Date(requestedPickDate.toString());
						}

						self.estimatedDueDate(self.commonUtils.formatDate(estimatedDueDate.toString(), 'mm/dd/yyyy'));
					}
				}
			}
			else {

				estimatedDueDate = new Date(requestedPickDate.toString()); //To check Weekends or Holidays
				if (estimatedDueDate.toLocaleDateString() !== "" && estimatedDueDate.toLocaleDateString() !== "Invalid Date") {

					while (!Utils.Common.prototype.isHoliday(estimatedDueDate) || !Utils.Common.prototype.isWeekend(estimatedDueDate)) {
						requestedPickDate.setDate(requestedPickDate.getDate() + 1);
						estimatedDueDate = new Date(requestedPickDate.toString());
					}

					self.estimatedDueDate(self.commonUtils.formatDate(estimatedDueDate.toString(), 'mm/dd/yyyy'));

					// ###END: US19648
				}
			}
		});

		// ###START: US19648
		// To calculate estimated due date based on pickup date
		self.requestedPickupDate.subscribe(() => {


			var transitDays = self.transitDays();
			var requestedPickDate = new Date(Date.parse(self.requestedPickupDate()));

			// ##START: DE23850
			// if the transit days field is empty, consider it as 0
			transitDays = transitDays !== "" ? transitDays : "0";

			// if the transit days has a range eg. 1-6 days, then take '6' for calulating the estimated due date and not '1'
			transitDays = transitDays.indexOf('-') === -1 ? transitDays : transitDays.split('-').pop();
			// ##END: DE23850

			// To check if TransitDays not null
			var estimatedDueDate: Date;
			if (parseInt(transitDays) > 0) {
				for (var day = 1; day <= parseInt(transitDays); day++) {
					//// Adding transit Days
					requestedPickDate.setDate(requestedPickDate.getDate() + 1);

					estimatedDueDate = new Date(requestedPickDate.toString()); //To check Weekends or Holidays
					if (estimatedDueDate.toLocaleDateString() !== "" && estimatedDueDate.toLocaleDateString() !== "Invalid Date") {
						while (!Utils.Common.prototype.isHoliday(estimatedDueDate) || !Utils.Common.prototype.isWeekend(estimatedDueDate)) {
							requestedPickDate.setDate(requestedPickDate.getDate() + 1);
							estimatedDueDate = new Date(requestedPickDate.toString());
						}

						self.estimatedDueDate(self.commonUtils.formatDate(estimatedDueDate.toString(), 'mm/dd/yyyy'));
					}

					delete estimatedDueDate;
				}
			}
			else {

				estimatedDueDate = new Date(requestedPickDate.toString()); //To check Weekends or Holidays
				if (estimatedDueDate.toLocaleDateString() !== "" && estimatedDueDate.toLocaleDateString() !== "Invalid Date") {
					while (!Utils.Common.prototype.isHoliday(estimatedDueDate) || !Utils.Common.prototype.isWeekend(estimatedDueDate)) {
						requestedPickDate.setDate(requestedPickDate.getDate() + 1);
						estimatedDueDate = new Date(requestedPickDate.toString());
					}

					self.estimatedDueDate(self.commonUtils.formatDate(estimatedDueDate.toString(), 'mm/dd/yyyy'));
				}

				delete estimatedDueDate;
			}

			delete transitDays;
			delete requestedPickDate;

		});
		// ###END: US19648
		//#endregion

		//To initialize the dates
		self.requestedPickupDate(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
		//self.pickupDate(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'));

		//To set The date picker options
		self.datepickerOptions = {
			blockWeekend: true,
			blockPreviousDays: false,
			blockHolidaysDays: true,
			autoClose: true,
			placeBelowButton: false,
		};

		self.pickupReadyTime.extend({
			required: {
				message: "Please select ready time.", params: true,
				onlyIf: () => {
					return (self.selectedServiceType() !== 3);
				}
			}
		});

		self.originTerminalPhone.extend({
			minLength: {
				message: "Please Enter 10 digit Phone Number",
				params: 13,
			}
		});
		self.destinationTerminalPhone.extend({
			minLength: {
				message: "Please Enter 10 digit Phone Number",
				params: 13,
			}
		});

		self.pickupCloseTime.extend({
			required: {
				message: "Please select pickup close time.", params: true,
				onlyIf: function () { return (self.pickupReadyTime() != '' && self.selectedServiceType() !== 3); }
			}
		});

		self.pickupCloseTime.extend({
			validation: {
				validator: () => {
					if (self.pickupCloseTime() != "" && self.pickupReadyTime() != "" && self.selectedServiceType() !== 3)
						return moment(self.pickupReadyTime(), "hh:mm A").format("HH:mm") <= moment(self.pickupCloseTime(), "hh:mm A").subtract("hour", 2).format("HH:mm")
					else
						return true;
				},
				message: "Not a valid time for the selected shipment ready time.",
				params: true
			}
		});

		self.pickupReadyTime.subscribe((newvalue: string) => {
			if (self.requireClosetimeChange && self.requireClosetimeChange === true) {
				if (newvalue) {
					// this is to avoid the late call of subscription with previous value
					if (self.pickupReadyTime() === newvalue) {
						self.pickupCloseTimeOptions.minTime = moment(newvalue, 'H:mm').add('h', 2).format('H:mm');
						self.pickupCloseTime(self.pickupCloseTimeOptions.minTime);
					}
				} else {
					self.pickupCloseTime('');
				}
			}
		});

		self.selectedServiceType.subscribe(() => {
			var self = this;
			//3 is Truckload Id
			self.carrierTypeSelection(self.selectedServiceType());
		});

		//To show popup near pickup ready and close time
		self.showReadyTimeMessage = (event: MouseEvent) => {
			var content = $('#pickupTimePopup').html();
			$('.timeZone').popover('destroy');
			$('.timeZone').popover({
				title: 'Attention',
				content: content,
				html: true,
				trigger: 'hover'
			});

			delete content;
		}

		//## when user pressed 'TAB' from shipping view then BOL exist then expand shipment notes.
		self.isTabPress = function (data, event) {
			var charCode = (event.which) ? event.which : event.keyCode;

			if ((charCode === 9)) { //if 'TAB' press.
				self.keyListenerCallback();
			}
			return true;
		}

		//Validation
		self.errorShippingDetail = ko.validatedObservable({
			pickupReadyTime: self.pickupReadyTime,
			pickupCloseTime: self.pickupCloseTime,
			requestedPickupDate: self.requestedPickupDate
		});

		//track changes
		self.SetBITrackChange(self);

		self.getBITrackChange = function () {
			return Utils.getDirtyItems(self);
		};

		self.isBIDirty = ko.computed(() => {
			var result = self.requestedPickupDate();
			result = self.pickupDate();
			result = self.transitDays();
			//	result = self.pickupReadyTime();
			//	result = self.pickupCloseTime();
			//	result = self.originTerminalPhone();
			//	result = self.destinationTerminalPhone();
			result = self.deliveryDate();
			result = self.pickupRemarks();
			result = self.deliverRemarks();

			// ###START: US22417
			result = self.customerBolNumber();
			// ###END: US22417

			var result1 = self.selectedServiceType();

			// If this from loading data side the return as false
			if (self.isNotAtLoadingTime)
				return false;

			var returnValue = self.getBITrackChange().length > 0;
			self.returnValue = returnValue;
			if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
				self.onChangesMade(returnValue);

			return returnValue;
		});
	}

	//#endregion

	//#region Internal public Methods

	// To Populate Shipping Details
	public populateShippingDetails(shippingdetails: ISalesOrderDetail, CanCreateSubOrder, CanSeeCustomerTermType, enable: boolean) {
		var self = this;
		self.EnableServiceType(CanCreateSubOrder);
		self.CanSeeCustomerTermType(CanSeeCustomerTermType);
		self.isSaveEnable(enable);
		if (self.isSaveEnable() && self.isServiceTypeEnable()) {
			self.isServiceTypeEnable(true);
		} else {
			self.isServiceTypeEnable(false);
		}
		if (shippingdetails != null) {
			var requestedPickupDate;
			if (shippingdetails.RequestedPickupDate !== null && shippingdetails.RequestedPickupDate.toString() !== "") {
				requestedPickupDate = self.commonUtils.formatDate(shippingdetails.RequestedPickupDate.toString(), 'mm/dd/yyyy');
			}
			else {
				requestedPickupDate = self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy');
			}
			self.requestedPickupDate(requestedPickupDate);

			var pickupDate;
			if (shippingdetails.PickupDate !== null && shippingdetails.PickupDate.toString() !== "") {
				pickupDate = self.commonUtils.formatDate(shippingdetails.PickupDate.toString(), 'mm/dd/yyyy');
			}
			else {
				pickupDate = '';//self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy');
			}
			self.pickupDate(pickupDate);

			var invoiceDate;
			if (shippingdetails.InvoiceDate !== null && shippingdetails.InvoiceDate !== undefined && shippingdetails.InvoiceDate.toString() !== "") {
				invoiceDate = self.commonUtils.formatDate(shippingdetails.InvoiceDate.toString(), 'mm/dd/yyyy');
			}
			else {
				invoiceDate = '';
			}
			self.invoiceDate(invoiceDate);
			// ###START: US19648
			self.transitDays(shippingdetails.TransitDays);
			//self.oldTransitDays(shippingdetails.TransitDays);
			//self.oldCalendarDays(shippingdetails.LTLCalendarDays);
			//self.ltlCalendarDays((shippingdetails.LTLCalendarDays !== '' || shippingdetails.LTLCalendarDays !== undefined) ? shippingdetails.LTLCalendarDays : '0');
			//self.oceanCalendarDays((shippingdetails.OceanCalendarDays !== '' || shippingdetails.OceanCalendarDays !== undefined) ? shippingdetails.OceanCalendarDays : '0');
			//self.isCalendarDaysNull(shippingdetails.IsCalendarDaysNull);
			//// self.transitDays(shippingdetails.LTLCalendarDays);
			//if (self.isCalendarDaysNull()) {
			//	self.transitDays(shippingdetails.LTLCalendarDays);
			//}
			//else {
			//	self.transitDays(shippingdetails.TransitDays);
			//}
			// ###END: US19648
			self.requireClosetimeChange = false;

			// ###START: DE21322
			self.pickupReadyTime((shippingdetails.ReadyTime !== '00:00:00' && shippingdetails.ReadyTime !== null) ? moment(shippingdetails.ReadyTime, 'HH:mm').format('HH:mm') : self.pickupReadyTime());
			self.pickupCloseTime((shippingdetails.CloseTime !== '00:00:00' && shippingdetails.CloseTime !== null) ? moment(shippingdetails.CloseTime, 'HH:mm').format('HH:mm') : self.pickupCloseTime());
			// ###END: DE21322

			self.requireClosetimeChange = true;

			var estimatedDueDate;
			if (shippingdetails.EstimatedDueDate !== null && shippingdetails.EstimatedDueDate.toString() !== "") {
				estimatedDueDate = self.commonUtils.formatDate(shippingdetails.EstimatedDueDate.toString(), 'mm/dd/yyyy');
			}
			else {
				estimatedDueDate = '';
			}

			//self.estimatedDueDate(estimatedDueDate);
			self.shipBy(shippingdetails.ShipmentBy);
			self.originTerminalPhone(shippingdetails.OriginTerminalPhone);
			self.destinationTerminalPhone(shippingdetails.DestinationTerminalPhone);
			self.insuredAmount($.number((shippingdetails.InsuredAmount), 2));

			var deliveryDate;
			if (shippingdetails.DeliveryDate !== null && shippingdetails.DeliveryDate.toString() !== "") {
				deliveryDate = self.commonUtils.formatDate(shippingdetails.DeliveryDate.toString(), 'mm/dd/yyyy');
			}
			else {
				deliveryDate = '';
			}
			self.deliveryDate(deliveryDate);
			self.carrierPickupNumber(shippingdetails.CarrierPickupNumber);
			self.pickupRemarks(shippingdetails.PickupRemarks);

			// ###START: US22417
			self.customerBolNumber(shippingdetails.CustomerBolNo);
			// ###END: US22417

			self.deliverRemarks(shippingdetails.DeliveryRemarks);
			self.processFlow(shippingdetails.ProcessFlow === 1 ? true : false);
			if (shippingdetails.NewShipmentType === refEnums.Enums.ShipmentType.General.ID) {
				self.newShipmentType(refEnums.Enums.ShipmentType.General.Value);
			}
			if (shippingdetails.NewShipmentType === refEnums.Enums.ShipmentType.SCM.ID) {
				self.newShipmentType(refEnums.Enums.ShipmentType.SCM.Value);
			}

			// Load invoice status if not loaded already
			var serviceTypeLength: number = self.serviceTypeList().length;
			if (!(serviceTypeLength)) {
				_app.trigger("GetSalesOrderServiceTypeList", function (data) {
					if (data) {
						self.serviceTypeList.removeAll();
						self.serviceTypeList.push.apply(self.serviceTypeList, data);
						self.selectedServiceType(shippingdetails.ServiceType);
					}
				});
			} else {
				self.selectedServiceType(shippingdetails.ServiceType);
			}

			self.serviceType = shippingdetails.ServiceType;

			self.carrierTypeSelection(self.selectedServiceType());
			//if (self.selectedServiceType() === 3 || self.selectedServiceType() === 7) {
			//	self.carrierTypeSelection(self.selectedServiceType());
			//}

			self.SetBITrackChange(self);
		}
	}

	public initializeShippingViewModel(data: ICustomerTypeAndMasterCustomerId) {
		var self = this;
		if (data) {
			self.masterCustomerId(data.MasterCustomerId);
			self.termsType(data.TermDescription);
		}
	}

	// For Validate Addresses
	public validateShipping() {
		var self = this;
		if (self.errorShippingDetail.errors().length != 0) {
			self.errorShippingDetail.errors.showAllMessages();
			return true;
		} else {
			return false;
		}
	}

	//sets the tracking extension for VB required fields
	SetBITrackChange(self) {
		//** To detect changes for Vendor Bill
		self.requestedPickupDate.extend({ trackChange: true });
		self.pickupDate.extend({ trackChange: true });
		self.transitDays.extend({ trackChange: true });

		// ###START: US22417
		self.customerBolNumber.extend({ trackChange: true });
		// ###END: US22417

		self.deliveryDate.extend({ trackChange: true });
		self.pickupRemarks.extend({ trackChange: true });
		self.deliverRemarks.extend({ trackChange: true });
		self.selectedServiceType.extend({ trackChange: true });
	}

	public cleanUp() {
		var self = this;

		self.pickupDate.extend({ validatable: false });
		self.transitDays.extend({ validatable: false });
		self.deliveryDate.extend({ validatable: false });
		self.pickupRemarks.extend({ validatable: false });
		self.deliverRemarks.extend({ validatable: false });
		self.selectedServiceType.extend({ validatable: false });
		self.pickupCloseTime.extend({ validatable: false });
		self.pickupReadyTime.extend({ validatable: false });
		self.requestedPickupDate.extend({ validatable: false });

		// ###START: US22417
		self.customerBolNumber.extend({ trackChange: false });
		// ###END: US22417

		if (typeof self.selectedServiceType.dispose === "function") self.selectedServiceType.dispose();
		if (typeof self.pickupReadyTime.dispose === "function") self.pickupReadyTime.dispose();
		if (typeof self.pickupDate.dispose === "function") self.pickupDate.dispose();
		if (typeof self.transitDays.dispose === "function") self.transitDays.dispose();

		delete self.onChangesMade;
		delete self.errorShippingDetail;
		delete self.getBITrackChange;
		delete self.carrierTypeSelection;
		delete self.SetBITrackChange;
		delete self.keyListenerCallback;
		delete self.isBIDirty;
		delete self.isTabPress;
		delete self.showReadyTimeMessage;
		delete self.isNumber;
		delete self.salesOrderClient;
		delete self.isAlphaNumericSpace;
		delete self.transitDays;
		delete self.pickupDate;
		delete self.destinationTerminalPhone;
		delete self.originTerminalPhone;
		delete self.estimatedDueDate;
		delete self.invoiceDate;
		delete self.deliveryDate;
		delete self.pickupReadyTime;
		delete self.selectedServiceType;
		delete self.pickupRemarks;
		delete self.deliverRemarks;
		delete self.pickupCloseTime;
		delete self.serviceTypeList;
		delete self.insuredAmount;
		delete self.isSaveEnable;
		delete self.CanSeeCustomerTermType;
		delete self.EnableServiceType;
		delete self.carrierPickupNumber;
		delete self.isServiceTypeEnable;
		delete self.masterCustomerId;
		delete self.requestedPickupDate;
		delete self.newShipmentType;
		delete self.processFlow;
		delete self.shipBy;
		delete self.termsType;
		delete self.callForEntry;
		delete self.datepickerOptions;
		delete self.pickupReadyTimeOptions;
		delete self.pickupCloseTimeOptions;
		delete self._currentUser;
		delete self.commonUtils;

		// ###START: US22417
		delete self.customerBolNumber;
		delete self.totalPieces;
		delete self.totalWeigth;
		// ###END: US22417

		delete self;
	}

	//#endregion

	//#region Private Methods
	// this function is used to convert formatted phone number with extension.
	public formatPhoneNumber(field) {
		var phone = field();
		var self = this;
		if (phone && phone.length > 10 && phone.length <= 15) {
			phone = phone.replace(/[^0-9]/g, '');
			phone = phone.replace(/(\d{3})(\d{3})(\d{4})(\d{1})/, "($1)$2-$3x$4");
			field(phone);
		}
		if (phone && phone.length >= 1 && phone.length <= 10) {
			phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
			field(phone);
		}
	}

	//#region if user any numeric  date  without any format
	private convertToRequestedPickupDate() {
		var self = this;
		if (!self.requestedPickupDate().match('/')) {
			self.requestedPickupDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.requestedPickupDate()));
		}
	}

	private convertToDeliveryDate() {
		var self = this;
		if (!self.deliveryDate().match('/') && self.deliveryDate().length > 0) {
			self.deliveryDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.deliveryDate()));
		}
	}

	private convertToPickupDate() {
		var self = this;
		//if (self.pickupDate() !== undefined) {
		if (!self.pickupDate().match('/') && self.pickupDate().length > 0) {
			self.pickupDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.pickupDate()));
		}
		//}
	}
	//#endregion
	//#endregion

	//#region Life Cycle Events
	activate() {
		return true;
	}

	//#endregion
}