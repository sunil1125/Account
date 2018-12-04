/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region Refrences
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
import refCommonUtils = require('CommonUtils');
import refMapLocation = require('services/models/common/MapLocation');
import refSearchLocationControl = require('templates/searchLocationControl');
import refVendorBillAddress = require('services/models/vendorBill/VendorBillAddress');
import refEnums = require('services/models/common/Enums');
import refCommon = require('services/client/CommonClient');
import refpurchaseOrderClient = require('services/client/PurchaseOrderClient');
import refForeignBolAddresses = require('services/models/purchaseOrder/ForeignBolAddress');
//#endregion

ko.validation.configure({
	decorateElement: true,
	registerExtenders: true,
	messagesOnModified: true,
	insertMessages: true,
	messageTemplate: null
});

/*
** <summary>
** Purchase Order Address View Model.
** </summary>
** <createDetails>
** <id>US8214</id> <by>ACHAL RASTOGI</by> <date>04-09-2014</date>
** </createDetails>}
** <changeHistory>
** <id>DE20533</id> <by>Baldev Singh Thakur</by> <date>12-11-2015</date>
** <id>DE20724</id> <by>Vasanthakumar</by> <date>24-11-2015</date><description>Changing Country is not getting saved in UVB in Bill To section</description>
** <id>US24616</id> <by>Janakiram</by> <date>10-09-2016</date><description> Shipper Company Name and the Consignee Company Name on the main screen for all UVB's.</description>
** <id>US26388</id> <by>Baldev Singh Thakur</by> <date>17-01-2017</date> <description>Added logic for not to check International Shipment if Mexico zip is selected.</description>
** </changeHistory>
*/
export class PurchaseOrderAddressViewModel {
	//#region Members

	// For Validation purpose
	errorShipperDetail: KnockoutValidationGroup;
	errorConsigneeDetail: KnockoutValidationGroup;
	errorBillToDetail: KnockoutValidationGroup;
	isValidationShown: boolean = false;

	// list of addresses
	shipmentAddress: KnockoutObservableArray<any>;

	// Flag to identify shipper or consignee or billTo
	addressType: KnockoutObservable<number>;

	//For Change Country Label with zip code
	public countryLabelShipper: KnockoutObservable<string> = ko.observable('USA');
	public countryLabelConsignee: KnockoutObservable<string> = ko.observable('USA');
	public countryLabelBillto: KnockoutObservable<string> = ko.observable('USA');

	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;

	//## To trigger when when 'TAB' press from process details.
	isTabPress: (that, event) => void;

	//## To trigger when when 'TAB' press from reference number.
	keyListenerCallback: () => any;

	public callToChangeInternationalShipYesShipperCountryCode: () => any;
	public callToChangeInternationalShipNoShipperCountryCode: () => any;
	public callToChangeInternationalShipYesConsigneeCountryCode: () => any;
	public callToChangeInternationalShipNoConsigneeCountryCode: () => any;
	public callToChangeInternationalShipYesBillToCountryCode: () => any;
	// ###START: DE20724
	public callToChangeInternationalShipNoBillToCountryCode: () => any;
	// ###END: DE20724

	//For Country
	//public countryLabel: KnockoutObservable<string> = ko.observable('USA');
	//public countryLabelConsignee: KnockoutObservable<string> = ko.observable('USA');
	// Shipper Address
	shipperAddressId: KnockoutObservable<number> = ko.observable(0);
	shipperCompanyName: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Shipper Company Name is required." } });
	shipperContactPerson: KnockoutObservable<string> = ko.observable('');
	shipperPhone: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Phone Number", params: 13 } });
	shipperFax: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Fax Number", params: 13 } });
	shipperAddress1: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Address should be minimum 5 characters", params: 5 } });
	shipperAddress2: KnockoutObservable<string> = ko.observable('');
	shipperCountry: KnockoutObservable<number> = ko.observable();
	//shipperAddress2: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "Address1 is required." } });

	// Consignee Address
	consigneeAddressId: KnockoutObservable<number> = ko.observable(0);
	consigneeCompanyName: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Consignee Company Name is required." } });
	consigneeContactPerson: KnockoutObservable<string> = ko.observable('');
	consigneePhone: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Phone Number", params: 13 } });
	consigneeFax: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Fax Number", params: 13 } });
	consigneeAddress1: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Address should be minimum 5 characters", params: 5 } });
	consigneeAddress2: KnockoutObservable<string> = ko.observable('');
	consigneeCountry: KnockoutObservable<number> = ko.observable();

	// BillTo Address
	billToAddressId: KnockoutObservable<number> = ko.observable(0);
	billToCompanyName: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Bill To Company Name is required." } });
	billToPhone: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Phone Number", params: 13 } });
	billToFax: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Fax Number", params: 13 } });
	billToAddress1: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Address should be minimum 5 characters", params: 5 } });
	billToAddress2: KnockoutObservable<string> = ko.observable('');
	billToCountry: KnockoutObservable<number> = ko.observable();
	// Notes field for bill to address
	processDetails: KnockoutObservable<string> = ko.observable('');

	//#region For autocomplete view for searching shipper, consignee and bill to zip's

	shipperLocation: refSearchLocationControl.SearchLocationControl;
	consigneeLocation: refSearchLocationControl.SearchLocationControl;
	billToLocation: refSearchLocationControl.SearchLocationControl;
	//location: refSearchLocationControl.SearchLocationControl
	commonMsgUtils: refCommonUtils.commonUtils;
	purchaseOrderClient: refpurchaseOrderClient.PurchaseOrderClient = new refpurchaseOrderClient.PurchaseOrderClient();
	//#endregion

	//#region For InternationlShipment Check box
	selected: KnockoutObservable<boolean> = ko.observable(false);
	isInternationalShipmentSelected: KnockoutObservable<boolean> = ko.observable(false);
	html: KnockoutObservable<string> = ko.observable('');
	name: KnockoutObservable<string> = ko.observable('International Shipment');
	//#endregion

	//#region For Shipper Address Check box
	shipperSelected: KnockoutObservable<boolean> = ko.observable(false);
	htmlShipper: KnockoutObservable<string> = ko.observable('');
	shipperName: KnockoutObservable<string> = ko.observable('Add to Mapping');
	//#endregion

	//#region For Consignee Address Check box
	consigneeSelected: KnockoutObservable<boolean> = ko.observable(false);
	htmlConsignee: KnockoutObservable<string> = ko.observable('');
	consigneeName: KnockoutObservable<string> = ko.observable('Add to Mapping');
	//#endregion

	//#region For Bill to Address Check box
	billtoSelected: KnockoutObservable<boolean> = ko.observable(false);
	htmlBillTo: KnockoutObservable<string> = ko.observable('');
	billToName: KnockoutObservable<string> = ko.observable('Add to Mapping');
	//#endregion

	countryList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	selectedShipperCountryCode: KnockoutObservable<number> = ko.observable();
	selectedConsigneeCountryCode: KnockoutObservable<number> = ko.observable();
	selectedBillToCountryCode: KnockoutObservable<number> = ko.observable();

	// ###START: US24616
	originAndDestinationZipChanged: (originZip: string, destiantionZip: string, shipper: string, consignee: string) => any;
	// ###END: US24616

	// get the common client object
	commonClient: refCommon.Common = new refCommon.Common();
	// Utility class object
	CommonUtils: CommonStatic = new Utils.Common();

	//** Property to specify whether address fields are read only or not.? */
	shouldBeReadOnly: KnockoutObservable<boolean> = ko.observable(false);

	//** isCalForEdit: boolean to check whether this call is happening for entry form or edit form. */
	isCallForEdit: KnockoutObservable<boolean> = ko.observable(false);
	// ###START: DE20724
	canEdit: KnockoutObservable<boolean> = ko.observable(false);
	// ###END: DE20724

	//## flag to disable international shipment  checkbox if bill status is cleared.
	isBillStatusCleared: KnockoutObservable<boolean> = ko.observable(false);

	//for tracking change
	getBITrackChange: () => string[];
	isBIDirty: KnockoutComputed<boolean>;
	isNotAtLoadingTime: boolean = false;
	returnValue: boolean = false;

	// Keep the origin and destination format with country
	originFormat: string;
	destinationFormat: string;

	populateAddressByUser: boolean = false;

	isForeignVisible: KnockoutObservable<boolean> = ko.observable(false);

	public deleteMappedShipperAddress: (msg) => any;
	public deleteMappedConsigneeAddress: (msg) => any;
	public deleteMappedBillToAddress: (msg) => any;
	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	private checkMsgDisplay: boolean = true;

	shipperId: KnockoutObservable<number> = ko.observable();
	consigneeId: KnockoutObservable<number> = ko.observable();
	billToId: KnockoutObservable<number> = ko.observable();

	shipperCity: KnockoutObservable<string> = ko.observable('');
	shipperState: KnockoutObservable<string> = ko.observable('');
	shipperZip: KnockoutObservable<string> = ko.observable('');

	consigneeCity: KnockoutObservable<string> = ko.observable('');
	consigneeState: KnockoutObservable<string> = ko.observable('');
	consigneeZip: KnockoutObservable<string> = ko.observable('');

	billToCity: KnockoutObservable<string> = ko.observable('');
	billToState: KnockoutObservable<string> = ko.observable('');
	billToZip: KnockoutObservable<string> = ko.observable('');

	customerId: KnockoutObservable<number> = ko.observable();
	customerIdOncall: any;
	vendorBillId: KnockoutObservable<number> = ko.observable();
	changesMade: number = 0;
	//#endregion

	//#region Constructor
	// ###START: US24616
	constructor(originAndDestiantionZipChangedCallback: (orignZip: string, destinationZip: string, shipper: string, consignee: string) => any, keyListenerCallback: () => any) {
		// ###END: US24616
		var self = this;
		self.originAndDestinationZipChanged = originAndDestiantionZipChangedCallback;
		self.shipmentAddress = ko.observableArray();
		//## when user pressed 'TAB' from reference number then BOL exist then expand items else expand address view.
		self.keyListenerCallback = keyListenerCallback;
		self.shipperLocation = new refSearchLocationControl.SearchLocationControl("A valid Shipper City, State or ZIP is required", "shipperLocationControl");
		self.consigneeLocation = new refSearchLocationControl.SearchLocationControl("A valid Consignee City, State or ZIP is required", "consigneeLocationControl");
		self.billToLocation = new refSearchLocationControl.SearchLocationControl("A valid Bill To City, State or ZIP is required", "billtoLocationControl");
		self.commonMsgUtils = new refCommonUtils.commonUtils();
		//self.populateDefaultBillToAddress();

		//#region Error Details Object

		self.errorShipperDetail = ko.validatedObservable({
			shipperCompanyName: this.shipperCompanyName,
			shipperAddress1: this.shipperAddress1,
			shipperLocation: this.shipperLocation,
			shipperCountry: this.shipperCountry,
			shipperContactPerson: this.shipperContactPerson,
			shipperPhone: this.shipperPhone,
			shipperFax: this.shipperFax
		});

		self.errorConsigneeDetail = ko.validatedObservable({
			consigneeCompanyName: this.consigneeCompanyName,
			consigneeAddress1: this.consigneeAddress1,
			consigneeLocation: this.consigneeLocation,
			consigneeCountry: this.consigneeCountry,
			consigneeContactName: this.consigneeContactPerson,
			consigneePhone: this.consigneePhone,
			consigneeFax: this.consigneeFax
		});

		self.errorBillToDetail = ko.validatedObservable({
			billToCompanyName: this.billToCompanyName,
			billToAddress1: this.billToAddress1,
			billToLocation: this.billToLocation,
			billToCountry: this.billToCountry,
			billToPhone: this.billToPhone,
			billToFax: this.billToFax
		});

		//#endregion

		self.SetBITrackChange(self);

		self.getBITrackChange = function () {
			return Utils.getDirtyItems(self);
		};

		self.isBIDirty = ko.computed(() => {
			var result = self.shipperAddress2();
			result = self.shipperAddress1();
			result = self.shipperCompanyName();
			result = self.shipperContactPerson();
			result = self.shipperFax();
			result = self.shipperPhone();
			result = self.shipperLocation.cityStateZip();

			result = self.consigneeCompanyName();
			result = self.consigneeContactPerson();
			result = self.consigneePhone();
			result = self.consigneeFax();
			result = self.consigneeAddress1();
			result = self.consigneeAddress2();
			result = self.consigneeLocation.cityStateZip();

			// ###START: DE20533
			result = self.billToCompanyName();
			result = self.billToPhone();
			result = self.billToFax();
			result = self.billToAddress1();
			result = self.billToAddress2();
			result = self.billToLocation.cityStateZip();
			// ###END: DE20533

			var result1 = self.isInternationalShipmentSelected();

			// If this from loading data side the return as false
			if (self.isNotAtLoadingTime)
				return false;
			var count = self.getBITrackChange().length;
			var returnValue = count > 0 ? true : false;
			self.returnValue = returnValue;
			if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
				self.onChangesMade(returnValue);
			if (returnValue) {
				if (count > 0 && (self.changesMade !== count)) {
					self.changesMade = count;
					self.UnmapShipperAddressOnChangeDetect();
					self.UnmapConsigneeAddressOnChangeDetect();
				}
			}
			return returnValue;
		});

		// ###START: US24616
		self.shipperCompanyName.subscribe((newvalue) => {
			self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, newvalue, self.consigneeCompanyName());
		});

		self.consigneeCompanyName.subscribe((newvalue) => {
			self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.shipperCompanyName(), newvalue);
		});
		// ###END: US24616

		self.shipperLocation.location.subscribe((newvalue) => {
			if (self.isInternationalShipmentSelected()) {
				var selectedCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedShipperCountryCode(); });
				if (selectedCountry && selectedCountry.length > 0) {
					self.originFormat = newvalue ? newvalue.Display + " " + selectedCountry[0].Value : '';
				} else {
					if (newvalue !== null && newvalue !== undefined) {
						self.originFormat = newvalue ? newvalue.Display + " " + newvalue.Country : '';
					}
				}
			} else {
				if (newvalue !== null && newvalue !== undefined) {
					self.originFormat = newvalue ? newvalue.Display + " " + newvalue.Country : '';
				}
			}

			// ###START: US24616
			self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.shipperCompanyName(), self.consigneeCompanyName());
			// ###END: US24616

			if (newvalue !== null && newvalue !== undefined && self.CommonUtils.isNullOrEmptyOrWhiteSpaces(newvalue.Country)) {
				self.countryLabelShipper(newvalue.Country);
			}
			else {
				self.countryLabelShipper('USA');
			}
		});

		self.consigneeLocation.location.subscribe((newvalue) => {
			if (self.isInternationalShipmentSelected()) {
				var selectedCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedConsigneeCountryCode(); });
				if (selectedCountry && selectedCountry.length > 0) {
					self.destinationFormat = newvalue ? newvalue.Display + " " + selectedCountry[0].Value : '';
				} else {
					if (newvalue !== null && newvalue !== undefined) {
						self.destinationFormat = newvalue ? newvalue.Display + " " + newvalue.Country : '';
					}
				}
			} else {
				if (newvalue !== null && newvalue !== undefined) {
					self.destinationFormat = newvalue ? newvalue.Display + " " + newvalue.Country : '';
				}
			}

			// ###START: US24616
			self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.shipperCompanyName(), self.consigneeCompanyName());
			// ###END: US24616

			if (newvalue !== null && newvalue !== undefined && self.CommonUtils.isNullOrEmptyOrWhiteSpaces(newvalue.Country)) {
				self.countryLabelConsignee(newvalue.Country);
			}
			else {
				self.countryLabelConsignee('USA');
			}
		});

		// ###START: DE20533
		self.billToLocation.location.subscribe((newvalue) => {
			if (self.isInternationalShipmentSelected()) {
				var selectedCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedBillToCountryCode(); });
				if (selectedCountry && selectedCountry.length > 0) {
					self.countryLabelBillto(selectedCountry[0].Value);
				}
			}

			// else {
			//	if (newvalue !== null && newvalue !== undefined) {
			//		self.destinationFormat = newvalue ? newvalue.Display + " " + newvalue.Country : '';
			//	}
			//}

			//self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat);
			//if (newvalue !== null && newvalue !== undefined && self.CommonUtils.isNullOrEmptyOrWhiteSpaces(newvalue.Country)) {
			//	self.countryLabelConsignee(newvalue.Country);
			//}
			//else {
			//	self.countryLabelConsignee('USA');
			//}
		});
		// ###END: DE20533

		// ###START: DE20724
		self.selectedShipperCountryCode.subscribe((newvalue) => {
			var selectedCountry;
			var countryValue = '';
			if (!self.isNotAtLoadingTime && self.canEdit() && self.populateAddressByUser) {
				if (newvalue !== null && newvalue !== undefined) {
					var actionButtons: Array<IToastrActionButtonOptions> = [];
					actionButtons.push({
						actionButtonName: "Yes",
						actionClick: self.callToChangeInternationalShipYesShipperCountryCode
					});

					actionButtons.push({
						actionButtonName: "No",
						actionClick: self.callToChangeInternationalShipNoShipperCountryCode
					});
					self.onChangesMade(true);
					var toastrOptions: IToastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 0,
						fadeOut: 0,
						typeOfAlert: "",
						title: "",
						actionButtons: actionButtons
					};

					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.ChaningInternationalShipment, "warning", null, toastrOptions);
				}
			}
			else {
				selectedCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedShipperCountryCode(); });
				if (selectedCountry && selectedCountry.length > 0) {
					countryValue = selectedCountry[0].Value;
				}
				self.originFormat = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() + " " + countryValue : '';

				// ###START: US24616
				self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.shipperCompanyName(), self.consigneeCompanyName());
				// ###END: US24616

			}
		});

		self.selectedConsigneeCountryCode.subscribe((newvalue) => {
			var selectedCountry;
			var countryValue = '';
			if (!self.isNotAtLoadingTime && self.canEdit() && self.populateAddressByUser) {
				if (newvalue !== null && newvalue !== undefined) {
					var actionButtons: Array<IToastrActionButtonOptions> = [];
					actionButtons.push({
						actionButtonName: "Yes",
						actionClick: self.callToChangeInternationalShipYesConsigneeCountryCode
					});

					actionButtons.push({
						actionButtonName: "No",
						actionClick: self.callToChangeInternationalShipNoConsigneeCountryCode
					});
					self.onChangesMade(true);
					var toastrOptions: IToastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 0,
						fadeOut: 0,
						typeOfAlert: "",
						title: "",
						actionButtons: actionButtons
					};

					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.ChaningInternationalShipment, "warning", null, toastrOptions);
				}
				else {
					selectedCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedConsigneeCountryCode(); });
					if (selectedCountry && selectedCountry.length > 0) {
						countryValue = selectedCountry[0].Value;
					}

					self.destinationFormat = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() + " " + countryValue : '';

					// ###START: US24616
					self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.shipperCompanyName(), self.consigneeCompanyName());
					// ###END: US24616

				}
			}
		});

		self.selectedBillToCountryCode.subscribe(function (newvalue) {
			var selectedCountry;
			var countryValue = '';
			if (!self.isNotAtLoadingTime && self.canEdit()) {
				if (newvalue !== null && newvalue !== undefined) {
					var actionButtons: Array<IToastrActionButtonOptions> = [];
					actionButtons.push({
						actionButtonName: "Yes",
						actionClick: self.callToChangeInternationalShipYesBillToCountryCode
					});

					actionButtons.push({
						actionButtonName: "No",
						actionClick: self.callToChangeInternationalShipNoBillToCountryCode
					});
					self.onChangesMade(true);
					var toastrOptions: IToastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 0,
						fadeOut: 0,
						typeOfAlert: "",
						title: "",
						actionButtons: actionButtons
					};

					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.ChangingBillToInternationalShipment, "warning", null, toastrOptions);
				}
			}
			else {
				selectedCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedBillToCountryCode(); });
				if (selectedCountry && selectedCountry.length > 0) {
					countryValue = selectedCountry[0].Value;
				}
			}
		});
		// ###END: DE20724

		var countryListLength: number = self.countryList().length;
		if (!countryListLength) {
			_app.trigger("GetClassTypesAndPackageTypes", function (data) {
				if (data) {
					self.countryList.removeAll();
					self.countryList.push.apply(self.countryList, data['CountryNames']);
				}
			});
		}

		//## when user pressed 'TAB' from reference number then BOL exist then expand items else expand address view.
		self.isTabPress = function (data, event) {
			var charCode = (event.which) ? event.which : event.keyCode;

			if ((charCode === 9)) { //if 'TAB' press.
				self.keyListenerCallback();
			}
			return true;
		}

		self.callToChangeInternationalShipYesConsigneeCountryCode = () => {
			$(".consigneePhoneNoFocus").focus();
			self.consigneePhone('');
			self.consigneeFax('');
			self.consigneeAddress1('');
			self.consigneeAddress2('');
			self.consigneeLocation.cityStateZip('');
		}

		self.callToChangeInternationalShipNoConsigneeCountryCode = () => {
			var selectedCountry;
			var countryValue = '';
			selectedCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedConsigneeCountryCode(); });
			if (selectedCountry && selectedCountry.length > 0) {
				countryValue = selectedCountry[0].Value;
			}
			self.destinationFormat = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() + " " + countryValue : '';

			// ###START: US24616
			self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.shipperCompanyName(), self.consigneeCompanyName());
			// ###END: US24616

		}

		self.callToChangeInternationalShipYesBillToCountryCode = () => {
			$(".billToPhoneNoFocus").focus();
			self.billToPhone('');
			self.billToFax('');
			self.billToAddress1('');
			self.billToAddress2('');
			self.billToLocation.cityStateZip('');
		}

		self.callToChangeInternationalShipYesShipperCountryCode = () => {
			$(".shipperPhoneNoFocus").focus();
			self.shipperPhone('');
			self.shipperFax('');
			self.shipperAddress1('');
			self.shipperAddress2('');
			self.shipperLocation.cityStateZip('');
		}

		self.callToChangeInternationalShipNoShipperCountryCode = () => {
			var selectedCountry;
			var countryValue = '';
			selectedCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedShipperCountryCode(); });
			if (selectedCountry && selectedCountry.length > 0) {
				countryValue = selectedCountry[0].Value;
			}
			self.originFormat = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() + " " + countryValue : '';

			// ###START: US24616
			self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.shipperCompanyName(), self.consigneeCompanyName());
			// ###END: US24616
		}

        // ###START: DE20724
        self.callToChangeInternationalShipNoBillToCountryCode = () => {
			var selectedCountry;
			var countryValue = '';
			selectedCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedBillToCountryCode(); });

			if (selectedCountry && selectedCountry.length > 0) {
				countryValue = selectedCountry[0].Value;
			}
		}
        // ###END: DE20724

		self.deleteMappedShipperAddress = () => {
			self.htmlShipper(self.shipperName());
			self.shipperSelected(false);
			self.purchaseOrderClient.unmapShipperAddress(self.shipperId(), (result) => {
			}, () => { });
		}

		self.deleteMappedConsigneeAddress = () => {
			self.htmlShipper(self.consigneeName());
			self.consigneeSelected(false);
			self.purchaseOrderClient.unmapConsigneeAddress(self.consigneeId(), (result) => {
			}, () => { });
		}

		self.deleteMappedBillToAddress = () => {
			self.htmlShipper(self.billToName());
			self.billtoSelected(false);
			self.purchaseOrderClient.unmapBillToAddress(self.billToId(), (result) => {
			}, () => { });
		}
	}
	//#endregion

	//#region Internal Methods

	selectOption() {
		var self = this;
		if (!self.selected()) {
			self.selected(true);
			self.isInternationalShipmentSelected(true);
			self.html('<i class="icon-ok icon-white active"></i>' + self.name());
			var selectedOCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedShipperCountryCode(); }),
				selectedDCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedConsigneeCountryCode(); });

			if (selectedOCountry && selectedOCountry.length > 0)
				self.originFormat = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() + " " + selectedOCountry[0].Value : '';

			if (selectedDCountry && selectedDCountry.length > 0)
				self.destinationFormat = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() + " " + selectedDCountry[0].Value : '';

			// ###START: US24616
			self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.shipperCompanyName(), self.consigneeCompanyName());
			// ###END: US24616

		} else {
			self.selected(false);
			self.isInternationalShipmentSelected(false);
			self.html('');
			self.originFormat = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() + " " + self.shipperLocation.country() : '';
			self.destinationFormat = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() + " " + self.consigneeLocation.country() : '';

			// ###START: US24616
			self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.shipperCompanyName(), self.consigneeCompanyName());
			// ###END: US24616
		}
	}

	selectShipperOption() {
		var self = this;

		if (self.shipperSelected()) {
			var actionButtons: Array<IToastrActionButtonOptions> = [];
			actionButtons.push({
				actionButtonName: "Yes",
				actionClick: self.deleteMappedShipperAddress
			});
			actionButtons.push({
				actionButtonName: "No",
				actionClick: self.checkMsgClick
			});
			var toastrOptions: IToastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 0,
				fadeOut: 0,
				typeOfAlert: "",
				title: "",
				actionButtons: actionButtons
			};

			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, "Do you want to dissociate shipper address?", "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
		} else {
			var addressToSave = new refForeignBolAddresses.Models.ForeignBolAddress();

			addressToSave.CompanyName = self.shipperCompanyName();
			addressToSave.Address1 = self.shipperAddress1();
			addressToSave.Address2 = self.shipperAddress2();
			addressToSave.City = self.shipperCity();
			addressToSave.State = self.shipperState();
			addressToSave.ZipCode = self.shipperZip();
			addressToSave.AddressType = 1;
			addressToSave.CustomerId = self.customerId();
			addressToSave.VendorBillId = self.vendorBillId();

			if ((self.customerId() !== undefined)) {
				self.purchaseOrderClient.SaveForeignBolCustomerAddressFromPurchaseOrder(addressToSave, (result) => {
					//self.ForeignBolCustomerSettingsContainer.listProgress(false);
					if (result > 0 || result === 0) {
						self.checkMsgDisplay = false;
						var toastrOptions1 = {
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 10,
							fadeOut: 10,
							typeOfAlert: "",
							title: ""
						}
					//var customer = self.customerName() + ' - ID ' + self.customerId();
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, "Shipper Address Mapped Successfully", "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
						self.getBITrackChange.length = 0;//() => [];
						self.shipperId(result);
						self.shipperSelected(true);
						self.htmlShipper('<i class="icon-ok icon-white active"></i>' + 'Address Mapped');
					}
					if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
						self.onChangesMade(false);
				},
					(errorMessage) => {
						if (self.checkMsgDisplay) {
							self.checkMsgDisplay = false;
							var toastrOptions1 = {
								toastrPositionClass: "toast-top-middle",
								delayInseconds: 10,
								fadeOut: 10,
								typeOfAlert: "",
								title: ""
							}
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, errorMessage, "error", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
							//self.ForeignBolCustomerSettingsContainer.listProgress(false);
						}
					}

					);
			}
			else {
				var toastrOptions1 = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}
					//var customer = self.customerName() + ' - ID ' + self.customerId();
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, "Please select a customer, in order to map address", "info", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
			}
		}
	}

	selectConsigneeOption() {
		var self = this;

		if (self.consigneeSelected()) {
			var actionButtons: Array<IToastrActionButtonOptions> = [];
			actionButtons.push({
				actionButtonName: "Yes",
				actionClick: self.deleteMappedConsigneeAddress
			});
			actionButtons.push({
				actionButtonName: "No",
				actionClick: self.checkMsgClick
			});
			var toastrOptions: IToastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 0,
				fadeOut: 0,
				typeOfAlert: "",
				title: "",
				actionButtons: actionButtons
			};

			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, "Do you want to dissociate consignee address?", "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
		} else {
			var addressToSave = new refForeignBolAddresses.Models.ForeignBolAddress();

			addressToSave.CompanyName = self.consigneeCompanyName();
			addressToSave.Address1 = self.consigneeAddress1();
			addressToSave.Address2 = self.consigneeAddress2();
			addressToSave.City = self.consigneeCity();
			addressToSave.State = self.consigneeState();
			addressToSave.ZipCode = self.consigneeZip();
			addressToSave.AddressType = 2;
			addressToSave.CustomerId = self.customerId();
			addressToSave.VendorBillId = self.vendorBillId();

			if ((self.customerId() !== undefined)) {
				self.purchaseOrderClient.SaveForeignBolCustomerAddressFromPurchaseOrder(addressToSave, (result) => {
					//self.ForeignBolCustomerSettingsContainer.listProgress(false);
					if (result > 0 || result === 0) {
						self.checkMsgDisplay = false;
						var toastrOptions1 = {
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 10,
							fadeOut: 10,
							typeOfAlert: "",
							title: ""
						}
					//var customer = self.customerName() + ' - ID ' + self.customerId();
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, "Consignee Address Mapped Successfully.", "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
						self.getBITrackChange = () => [];
						self.consigneeId(result);
						self.consigneeSelected(true);
						self.htmlConsignee('<i class="icon-ok icon-white active"></i>' + 'Address Mapped');
					}
					if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
						self.onChangesMade(false);
				},
					(errorMessage) => {
						if (self.checkMsgDisplay) {
							self.checkMsgDisplay = false;
							var toastrOptions1 = {
								toastrPositionClass: "toast-top-middle",
								delayInseconds: 10,
								fadeOut: 10,
								typeOfAlert: "",
								title: ""
							}
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, errorMessage, "error", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
							//self.ForeignBolCustomerSettingsContainer.listProgress(false);
						}
					}
					);
			}
			else {
				var toastrOptions1 = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}
					//var customer = self.customerName() + ' - ID ' + self.customerId();
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, "Please select a customer, in order to map address", "info", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
			}
		}
	}

	selectBillToOption() {
		var self = this;

		if (self.billtoSelected()) {
			var actionButtons: Array<IToastrActionButtonOptions> = [];
			actionButtons.push({
				actionButtonName: "Yes",
				actionClick: self.deleteMappedBillToAddress
			});
			actionButtons.push({
				actionButtonName: "No",
				actionClick: self.checkMsgClick
			});
			var toastrOptions: IToastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 0,
				fadeOut: 0,
				typeOfAlert: "",
				title: "",
				actionButtons: actionButtons
			};

			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, "Do you want to dissociate bill to address?", "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
		} else {
			var addressToSave = new refForeignBolAddresses.Models.ForeignBolAddress();

			addressToSave.CompanyName = self.billToCompanyName();
			addressToSave.Address1 = self.billToAddress1();
			addressToSave.Address2 = self.billToAddress2();
			addressToSave.City = self.billToCity();
			addressToSave.State = self.billToState();
			addressToSave.ZipCode = self.billToZip();
			addressToSave.AddressType = 3;
			addressToSave.CustomerId = self.customerId();
			addressToSave.VendorBillId = self.vendorBillId();

			if ((self.customerId() !== undefined)) {
				self.purchaseOrderClient.SaveForeignBolCustomerAddressFromPurchaseOrder(addressToSave, (result) => {
					//self.ForeignBolCustomerSettingsContainer.listProgress(false);
					if (result > 0 || result === 0) {
						self.checkMsgDisplay = false;
						var toastrOptions1 = {
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 10,
							fadeOut: 10,
							typeOfAlert: "",
							title: ""
						}
					//var customer = self.customerName() + ' - ID ' + self.customerId();
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, "Bill TO Address Mapped Successfully.", "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
						self.getBITrackChange = () => [];
						self.billToId(result);
						self.billtoSelected(true);
						self.htmlBillTo('<i class="icon-ok icon-white active"></i>' + 'Address Mapped');
					}
					if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
						self.onChangesMade(false);
				},
					(errorMessage) => {
						if (self.checkMsgDisplay) {
							self.checkMsgDisplay = false;
							var toastrOptions1 = {
								toastrPositionClass: "toast-top-middle",
								delayInseconds: 10,
								fadeOut: 10,
								typeOfAlert: "",
								title: ""
							}
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, errorMessage, "error", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
							//self.ForeignBolCustomerSettingsContainer.listProgress(false);
						}
					}
					);
			}
			else {
				var toastrOptions1 = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}
					//var customer = self.customerName() + ' - ID ' + self.customerId();
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, "Please select a customer, in order to map address", "info", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
			}
		}
	}

	// this function is used to convert formatted phone number.
	private formatPhoneNumber(field) {
		var phone = field();
		if (phone && phone.length >= 1) {
			phone = phone.replace(/[^0-9]/g, '');
			if (phone.length > 10) {
				phone = phone.substring(0, 10);
			}
			phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
			field(phone);
		}
	}

	// For Validate Addresses
	public validateAddresses() {
		var self = this;
		self.shipperLocation.validateAndDisplay();
		self.consigneeLocation.validateAndDisplay();
		self.billToLocation.validateAndDisplay();
		if (self.errorShipperDetail.errors().length != 0 || self.errorConsigneeDetail.errors().length != 0 || self.errorBillToDetail.errors().length != 0) {
			self.errorShipperDetail.errors.showAllMessages();
			self.errorConsigneeDetail.errors.showAllMessages();
			self.errorBillToDetail.errors.showAllMessages();
			return true;
		} else {
			return false;
		}
	}

	// To  populate Shipper Address
	public populateShipperAddress(shipperAddress: IVendorBillAddress, isShipperMapped?: boolean, shipperId?: number, isForeignBol?: boolean, customerId?: number, vendorBillId?: number) {
		var self = this;
		var city = "", address = "", state = "", zip = "";
		// This will prevent to detect the changes at first time
		self.isNotAtLoadingTime = true;
		self.shipperLocation.isNotAtLoadingTime = true;
		if (shipperAddress != null) {
			var location = new refMapLocation.Models.MapLocation();
			location.City = shipperAddress.City;
			location.Zip = shipperAddress.ZipCode;
			location.State = shipperAddress.State;
			location.StateCode = shipperAddress.State;// Assigning it to client as this variable value is sent for updating the state code
			location.Country = shipperAddress.CountryName;
			location.CountryCode = shipperAddress.Country;
			// ###START: US26388
			if (shipperAddress.Country !== 1 && shipperAddress.Country !== 4 && shipperAddress.Country !== 2) {
				self.selected(false);
				self.selectOption();
			}

			// ###END: US26388
			self.selectedShipperCountryCode(shipperAddress.Country);
			self.shipperAddressId(shipperAddress.Id);
			self.shipperCompanyName(shipperAddress.CompanyName);
			self.shipperAddress1(shipperAddress.Street);
			self.shipperAddress2(shipperAddress.Street2);
			self.shipperLocation.location(location);
			city = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(shipperAddress.City) ? shipperAddress.City + ", " : "";
			state = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(shipperAddress.State) ? shipperAddress.State + " " : "";
			zip = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(shipperAddress.ZipCode) ? shipperAddress.ZipCode + " " : "";
			address = city + state + zip;
			self.shipperLocation.cityStateZip(address !== null && address !== undefined ? address.trim() : '');
			self.shipperCity(shipperAddress.City);
			self.shipperState(shipperAddress.State);
			self.shipperZip(shipperAddress.ZipCode);
			self.shipperCountry(shipperAddress.Country);
			self.shipperPhone(self.CommonUtils.USAPhoneFormat(shipperAddress.Phone));
			self.shipperFax(self.CommonUtils.USAPhoneFormat(shipperAddress.Fax));
			self.shipperContactPerson(shipperAddress.ContactPerson);
			self.shipperLocation.shouldBeReadOnly(self.shouldBeReadOnly());
			self.shipperSelected(isShipperMapped);
			if (self.shipperSelected()) {
				self.htmlShipper('<i class="icon-ok icon-white active"></i>' + 'Address Mapped');
			}
			self.vendorBillId(vendorBillId);
			self.isForeignVisible(isForeignBol);
			self.customerId(customerId);
			self.shipperId(shipperId);
			self.originFormat = self.shipperLocation.cityStateZip() + " " + shipperAddress.CountryName;

			// ###START: US24616
			self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.shipperCompanyName(), self.consigneeCompanyName());
			// ###END: US24616

			self.SetBITrackChange(self);
		}
		// This will stop detecting the changes
		self.isNotAtLoadingTime = false;
		self.shipperLocation.isNotAtLoadingTime = false;
	}

	// To  populate Consignee Address
	public populateConsigneeAddress(consigneeAddress: IVendorBillAddress, isConsigneeMapped?: boolean, consigneeId?: number, isForeignBol?: boolean, customerId?: number, vendorBillId?: number) {
		var self = this;
		var city = "", address = "", state = "", zip = "";
		// This will prevent to detect the changes at first time
		self.isNotAtLoadingTime = true;
		self.consigneeLocation.isNotAtLoadingTime = true;
		if (consigneeAddress != null) {
			var location = new refMapLocation.Models.MapLocation();
			location.City = consigneeAddress.City;
			location.Zip = consigneeAddress.ZipCode;
			location.State = consigneeAddress.State;
			location.StateCode = consigneeAddress.State;// Assigning it to client as this variable value is sent for updating the state code
			location.Country = consigneeAddress.CountryName;
			location.CountryCode = consigneeAddress.Country;
			// ###START: US26388
			if (consigneeAddress.Country !== 1 && consigneeAddress.Country !== 4 && consigneeAddress.Country !== 2) {
				self.selected(false);
				self.selectOption();
			}

			// ###END: US26388
			self.selectedConsigneeCountryCode(consigneeAddress.Country);
			self.consigneeAddressId(consigneeAddress.Id);
			self.consigneeCompanyName(consigneeAddress.CompanyName);
			self.consigneeAddress1(consigneeAddress.Street);
			self.consigneeAddress2(consigneeAddress.Street2);
			self.consigneeLocation.location(location);
			city = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(consigneeAddress.City) ? consigneeAddress.City + ", " : "";
			state = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(consigneeAddress.State) ? consigneeAddress.State + " " : "";
			zip = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(consigneeAddress.ZipCode) ? consigneeAddress.ZipCode + " " : "";
			address = city + state + zip;
			self.consigneeCity(consigneeAddress.City);
			self.consigneeState(consigneeAddress.State);
			self.consigneeZip(consigneeAddress.ZipCode);
			self.consigneeLocation.cityStateZip(address !== null && address !== undefined ? address.trim() : '');
			self.consigneeCountry(consigneeAddress.Country);
			self.consigneePhone(self.CommonUtils.USAPhoneFormat(consigneeAddress.Phone));
			self.consigneeFax(self.CommonUtils.USAPhoneFormat(consigneeAddress.Fax));
			self.consigneeContactPerson(consigneeAddress.ContactPerson);
			self.consigneeLocation.shouldBeReadOnly(self.shouldBeReadOnly());
			self.consigneeSelected(isConsigneeMapped);
			if (self.consigneeSelected()) {
				self.htmlConsignee('<i class="icon-ok icon-white active"></i>' + 'Address Mapped');
			}
			self.isForeignVisible(isForeignBol);
			self.customerId(customerId);
			self.consigneeId(consigneeId);
			self.vendorBillId(vendorBillId);
			self.destinationFormat = self.consigneeLocation.cityStateZip() + " " + consigneeAddress.CountryName;

			// ###START: US24616
			self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.shipperCompanyName(), self.consigneeCompanyName());
			// ###END: US24616

			self.SetBITrackChange(self);
		}
		// This will stop detecting the changes
		self.isNotAtLoadingTime = false;
		self.consigneeLocation.isNotAtLoadingTime = false;
	}

	//To populate BillTo Address
	public populateDefaultBillToAddress(billToAddress: IVendorBillAddress, isBillToMapped?: boolean, billToId?: number, isForeignBol?: boolean, customerId?: number, vendorBillId?: number) {
		var self = this;
		var city = "", address = "", state = "", zip = "";
		//This will prevent to detect the changes at first time
		self.isNotAtLoadingTime = true;
		self.billToLocation.isNotAtLoadingTime = true;
		if (billToAddress != null) {
			var location = new refMapLocation.Models.MapLocation();
			location.City = billToAddress.City;
			location.Zip = billToAddress.ZipCode;
			location.State = billToAddress.State;
			location.StateCode = billToAddress.State;// Assigning it to client as this variable value is sent for updating the state code
			location.Country = billToAddress.CountryName;
			location.CountryCode = billToAddress.Country;
			// ###START: US26388
			if (billToAddress.Country !== 1 && billToAddress.Country !== 4 && billToAddress.Country !== 2) {
				self.selected(false);
				self.selectOption();
			}

			// ###END: US26388
			self.selectedBillToCountryCode(billToAddress.Country);
			self.billToAddressId(billToAddress.Id);
			self.billToCompanyName(billToAddress.CompanyName);
			self.billToAddress1(billToAddress.Street);
			self.billToAddress2(billToAddress.Street2);
			self.billToLocation.location(location);
			city = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(billToAddress.City) ? billToAddress.City + ", " : "";
			state = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(billToAddress.State) ? billToAddress.State + " " : "";
			zip = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(billToAddress.ZipCode) ? billToAddress.ZipCode + " " : "";
			address = city + state + zip;
			self.billToCity(billToAddress.City);
			self.billToState(billToAddress.State);
			self.billToZip(billToAddress.ZipCode);
			self.billToLocation.cityStateZip(address !== null && address !== undefined ? address.trim() : '');
			self.billToCountry(billToAddress.Country);
			self.billToPhone(self.CommonUtils.USAPhoneFormat(billToAddress.Phone));
			self.billToFax(self.CommonUtils.USAPhoneFormat(billToAddress.Fax));
			//self.billToLocation.shouldBeReadOnly(self.shouldBeReadOnly());
			self.billToLocation.shouldBeReadOnly(self.isCallForEdit());
			self.billtoSelected(isBillToMapped);
			if (self.billtoSelected()) {
				self.htmlBillTo('<i class="icon-ok icon-white active"></i>' + 'Address Mapped');
			}
			self.billToId(billToId);
			self.isForeignVisible(isForeignBol);
			self.vendorBillId(vendorBillId);
			self.customerId(customerId);
			// ###START: US26388
			if (billToAddress.Country === 4) {
				self.countryLabelBillto("Mexico");
			} else if (billToAddress.Country === 1) {
				self.countryLabelBillto("USA");
			}

			// ###END: US26388
			// ###START: US24616
			self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.shipperCompanyName(), self.consigneeCompanyName());
			// ###END: US24616

			self.SetBITrackChange(self);
		}
		else {
			var location = new refMapLocation.Models.MapLocation();
			location.City = "Phoenix";
			location.Zip = "85050";
			location.State = "AZ";
			location.StateCode = "AZ";// Assigning it to client as this variable value is sent for updating the state code
			self.billToCompanyName('GlobalTranz');
			self.billToAddress1('PO BOX 71730');
			self.billToAddress2('High Street');
			self.billToLocation.location(location);
			self.billToLocation.shouldBeReadOnly(true);
			self.billToLocation.cityStateZip('Phoenix, AZ 85050');
			self.billToCountry(refEnums.Enums.CountryCode.USA.ID);
			self.billToPhone('(866)275-1407)');
			self.billToFax('(623)209-0093');
			// ###START: DE20724
			self.SetBITrackChange(self);
			// ###END: DE20724
		}
		// This will stop detecting the changes
		self.isNotAtLoadingTime = false;
		// ###START: DE20533
		self.billToLocation.isNotAtLoadingTime = false;
		// ###END: DE20533
	}

	public UnmapShipperAddressOnChangeDetect(dirtyZip?: boolean) {
		var self = this;

		//for (var index = 0; index < self.getBITrackChange().length; index++) {
		//    if (self.getBITrackChange()[index].indexOf("shipper") < 0) {
		//    }
		//    else {
		//        if (self.shipperSelected()) {
		//            self.htmlShipper(self.shipperName());
		//            self.shipperSelected(false);
		//            self.purchaseOrderClient.unmapShipperAddress(self.shipperId(), (result) => {
		//            }, () => { });
		//        }
		//    }
		//}
		var count = self.getBITrackChange().length;
		if (count > 0 && self.getBITrackChange()[count - 1].indexOf('shipper') >= 0) {
			if (self.shipperSelected()) {
				self.htmlShipper(self.shipperName());
				self.shipperSelected(false);
				self.purchaseOrderClient.unmapShipperAddress(self.shipperId(), (result) => {
				}, () => { });
			}
		}

		if (dirtyZip && self.shipperSelected()) {
			self.htmlShipper(self.shipperName());
			self.shipperSelected(false);
			self.purchaseOrderClient.unmapShipperAddress(self.shipperId(), (result) => {
			}, () => { });
		}
	}

	public UnmapConsigneeAddressOnChangeDetect(dirtyZip?: boolean) {
		var self = this;

		//for (var index = 0; index < self.getBITrackChange().length; index++) {
		//    if (self.getBITrackChange()[index].indexOf("consignee") < 0) {
		//    }
		//    else {
		//        if (self.consigneeSelected()) {
		//            self.htmlConsignee(self.consigneeName());
		//            self.consigneeSelected(false);
		//            self.purchaseOrderClient.unmapConsigneeAddress(self.consigneeId(), (result) => {
		//            }, () => { });
		//        }
		//    }
		//}

		var count = self.getBITrackChange().length;
		if (count > 0 && self.getBITrackChange()[count - 1].indexOf('consignee') >= 0) {
			if (self.consigneeSelected()) {
				self.htmlConsignee(self.consigneeName());
				self.consigneeSelected(false);
				self.purchaseOrderClient.unmapConsigneeAddress(self.consigneeId(), (result) => {
				}, () => { });
			}
		}

		if (dirtyZip && self.consigneeSelected()) {
			self.htmlConsignee(self.consigneeName());
			self.consigneeSelected(false);
			self.purchaseOrderClient.unmapConsigneeAddress(self.consigneeId(), (result) => {
			}, () => { });
		}
	}

	//sets the tracking extension for BI required fields
	SetBITrackChange(self) {
		//** To detect changes for International shipment button
		self.isInternationalShipmentSelected.extend({ trackChange: true });

		//** To detect changes for shipper address
		self.shipperCompanyName.extend({ trackChange: true });
		self.shipperContactPerson.extend({ trackChange: true });
		self.shipperPhone.extend({ trackChange: true });
		self.shipperFax.extend({ trackChange: true });
		self.shipperAddress1.extend({ trackChange: true });
		self.shipperAddress2.extend({ trackChange: true });
		// ###START: DE20724
		self.shipperCountry.extend({ trackChange: true });
		// ###END: DE20724
		self.selectedShipperCountryCode.extend({ trackChange: true });
		self.shipperLocation.cityStateZip.extend({ trackChange: true });

		//** To detect changes for consignee address
		self.consigneeContactPerson.extend({ trackChange: true });
		self.consigneePhone.extend({ trackChange: true });
		self.consigneeCompanyName.extend({ trackChange: true });
		self.consigneeFax.extend({ trackChange: true });
		self.consigneeAddress1.extend({ trackChange: true });
		self.consigneeAddress2.extend({ trackChange: true });
		// ###START: DE20724
		self.consigneeCountry.extend({ trackChange: true });
		// ###END: DE20724
		self.selectedConsigneeCountryCode.extend({ trackChange: true });
		self.consigneeLocation.cityStateZip.extend({ trackChange: true });

		// ###START: DE20533
		//** To detect changes for Bill To Address
		self.billToCompanyName.extend({ trackChange: true });
		self.billToPhone.extend({ trackChange: true });
		self.billToFax.extend({ trackChange: true });
		self.billToAddress1.extend({ trackChange: true });
		self.billToAddress2.extend({ trackChange: true });
		self.billToLocation.cityStateZip.extend({ trackChange: true });
		// ###START: DE20724
		self.billToCountry.extend({ trackChange: true });
		self.selectedBillToCountryCode.extend({ trackChange: true });
		// ###END: DE20724     
		// ###END: DE20533

	}
	//#endregion

	//#region Life Cycle Event
	public activate() {
		return true;
	}

	public cleanup() {
		var self = this;

		self.billToAddress1.extend({ validatable: false });
		self.billToFax.extend({ validatable: false });
		self.billToPhone.extend({ validatable: false });
		self.billToCompanyName.extend({ validatable: false });
		self.consigneeAddress1.extend({ validatable: false });
		self.consigneeFax.extend({ validatable: false });
		self.consigneePhone.extend({ validatable: false });
		self.consigneeCompanyName.extend({ validatable: false });
		self.shipperAddress1.extend({ validatable: false });
		self.shipperFax.extend({ validatable: false });
		self.shipperPhone.extend({ validatable: false });
		self.shipperCompanyName.extend({ validatable: false });

		self.shipperLocation.cleanup("#shipperLocationControl");
		self.consigneeLocation.cleanup("#consigneeLocationControl");
		self.billToLocation.cleanup("#billtoLocationControl");

		for (var property in self) {
			if (property !== "cleanup")
				delete self[property];
		}
		delete self;
	}
	//#endregion
}