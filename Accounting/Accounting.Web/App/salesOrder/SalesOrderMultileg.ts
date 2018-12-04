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
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import _refAppShell = require('shell');
import refSearchLocationControl = require('templates/searchLocationControl');
import refOceanCarrierSearchControl = require('salesOrder/searchOceanCarrierDetailControl');
import refCompanySearchControl = require('salesOrder/searchCompanyNameControl');
import refMapLocation = require('services/models/common/MapLocation');
//#endregion

/*
** <summary>
** Sales Order Multi Leg View Model.
** </summary>
** <createDetails>
** <id>US12486</id> <by>Sankesh Poojari</by> <date>12-09-2014</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by> <date></date>
** </changeHistory>
*/
export class SalesOrderMultiLegViewModel {
	//#region Members

	// Terminal Hub Address
	terminalHubAddressId: KnockoutObservable<number> = ko.observable(0);
	//terminalHubCompanyName: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Terminal Hub Company Name is required." } });
	terminalHubContactPerson: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Terminal Hub Contact Person is required." } });
	terminalHubPhone: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Phone Number", params: 13 } });
	terminalHubFax: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Fax Number", params: 13 } });
	terminalHubAddress1: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Address should be minimum 5 characters", params: 5 } });
	terminalHubAddress2: KnockoutObservable<string> = ko.observable('');
	terminalHubCountry: KnockoutObservable<number> = ko.observable();
	groundCarriername: KnockoutObservable<string> = ko.observable('');
	groundProNumber: KnockoutObservable<string> = ko.observable('');
	groundTransitDays: KnockoutObservable<string> = ko.observable('');
	oceanCarriername: KnockoutComputed<string>;
	oceanCarrierId: KnockoutComputed<number>;
	oceanProNumber: KnockoutObservable<string> = ko.observable('');
	oceanTransitDays: KnockoutObservable<string> = ko.observable('');
	terminalHubCompanyName: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Terminal Hub Company Name is required." } });
	terminalHubCompanyId: KnockoutComputed<number>;
	terminalHubCityStateZip: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Terminal Hub City State Zip is required." } });

	//#region For Same As Ground Check box
	selected: KnockoutObservable<boolean> = ko.observable(false);
	html: KnockoutObservable<string> = ko.observable('');
	name: KnockoutObservable<string> = ko.observable('Same As Ground');
	//#endregion

	// validation Function for checking number and alphanumeric
	isNumber: (that, event) => void;
	isAlphaNumericSpace: (that, event) => void;

	terminalHubLocation: refSearchLocationControl.SearchLocationControl;
	//Initializations
	oceanCarrierSearchList: refOceanCarrierSearchControl.SearchOceanCarrierDetailControl;
	companyNameSearchList: refCompanySearchControl.SearchCompanyNameControl;

	//identify call from Edit
	isCallFromEdit: KnockoutObservable<boolean> = ko.observable(true);
	disableCheckButton: KnockoutObservable<boolean> = ko.observable(true);
	//for Validation
	errorMultilegDetail: KnockoutValidationGroup;
	// test box width with error and without error
	errorWidth: KnockoutObservable<string> = ko.observable('89%');
	normalWidth: KnockoutObservable<string> = ko.observable('93%');

	//for tracking change
	getBITrackChange: () => string[];
	isBIDirty: KnockoutComputed<boolean>;
	isNotAtLoadingTime: boolean = false;
	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	returnValue1: boolean = false;
	//#endregion

	//#region Constructor
	constructor(isCallFromEdit: boolean) {
		var self = this;
		self.isCallFromEdit(isCallFromEdit);
		self.disableCheckButton(!isCallFromEdit);
		self.terminalHubLocation = new refSearchLocationControl.SearchLocationControl("A valid Terminal Hub City, State or ZIP is required", "txtmultilegLocationControl");
		self.oceanCarrierSearchList = new refOceanCarrierSearchControl.SearchOceanCarrierDetailControl("A valid Ocean Carrier is required.");
		self.companyNameSearchList = new refCompanySearchControl.SearchCompanyNameControl('A Valid Company Name is required');

		self.companyNameSearchList.isEnable(!isCallFromEdit);
		self.oceanCarrierSearchList.isEnable(!isCallFromEdit);

		//track changes
		self.SetBITrackChange(self);

		self.getBITrackChange = function () {
			return Utils.getDirtyItems(self);
		};

		self.isBIDirty = ko.computed(() => {
			var result = self.oceanCarrierSearchList.oceanCarrierName();
			result = self.oceanTransitDays();
			result = self.oceanProNumber();

			// If this from loading data side the return as false
			//if (self.isNotAtLoadingTime)
			//	return false;

			var returnValue = self.getBITrackChange().length > 0 ? true : false;
			//self.returnValue1 = returnValue;
			if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
				self.onChangesMade(returnValue);

			return returnValue;
		});

		//To check if enter value is digit and decimal
		self.isNumber = function (data, event) {
			var charCode = (event.which) ? event.which : event.keyCode;

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

		// To get carrier id after carrier name
		self.oceanCarrierId = ko.computed(function () {
			if (self.oceanCarrierSearchList.name() != null)
				self.terminalHubCompanyName(self.oceanCarrierSearchList.companyName());
			self.terminalHubContactPerson(self.oceanCarrierSearchList.contactName());
			self.terminalHubPhone(self.oceanCarrierSearchList.phone());
			self.terminalHubFax(self.oceanCarrierSearchList.fax());
			self.terminalHubAddress1(self.oceanCarrierSearchList.address1());
			self.terminalHubAddress2(self.oceanCarrierSearchList.address2());
			self.terminalHubCityStateZip(self.oceanCarrierSearchList.city() + "" + self.oceanCarrierSearchList.stateCode() + "" + self.oceanCarrierSearchList.zip());
			return self.oceanCarrierSearchList.ID();

			return 0;
		});

		// to get the carrier Name after carrier
		self.oceanCarriername = ko.computed(() => {
			if (self.oceanCarrierSearchList.name() != null)
				return self.oceanCarrierSearchList.oceanCarrierName();

			return null;
		});

		//#region Subscribe functions

		// To check value is not greater than 31
		self.oceanTransitDays.subscribe((newValue) => {
			if (+newValue > 31)
				self.oceanTransitDays('');
		});
		//#endregion

		//Validation
		self.errorMultilegDetail = ko.validatedObservable({
			oceanCarrierSearchList: self.oceanCarrierSearchList,
			terminalHubCompanyName: self.terminalHubCompanyName,
			terminalHubContactPerson: self.terminalHubContactPerson,
			terminalHubCityStateZip: self.terminalHubCityStateZip
		});

		return self;
	}
	//#endregion

	//#region Internal Methods
	// To assign customer id and shipvia from sales order details
	public initializeMultilegDetails(customerId: number, carrierId: number, carrierName: string, selectedShipVia: KnockoutObservable<number>, shipperLocation: IMapLocation, consigneeLocation: IMapLocation, transitDays: string, pro: string) {
		var self = this;

		self.oceanCarrierSearchList.customerId(customerId);
		self.oceanCarrierSearchList.selectedShipVia(selectedShipVia());
		self.groundTransitDays(transitDays);
		self.groundProNumber(pro);
		self.groundCarriername(carrierName);
		//if (carrierId !== undefined && carrierId) {
		//	self.companyNameSearchList.carrierId(carrierId);
		//}
		if (shipperLocation !== undefined) {
			self.oceanCarrierSearchList.shipperLocation = shipperLocation;
		}
		if (consigneeLocation !== undefined) {
			self.oceanCarrierSearchList.consigneeLocation = consigneeLocation;
		}
	}

	selectOption() {
		var self = this;
		if (self.groundProNumber() && self.groundProNumber() !== null && self.groundProNumber() !== "") {
			if (!self.selected()) {
				self.selected(true);
				self.html('<i class="icon-ok icon-white active"></i>' + self.name());
				self.oceanProNumber(self.groundProNumber());
			} else {
				self.selected(false);
				self.oceanProNumber('');
				self.html('');
			}
		}
	}

	// For Validate Addresses
	public validateMultilegdetails(isMultileg?: boolean) {
		var self = this;

		if (!isMultileg) {
			self.oceanCarrierSearchList.vaildateSearchOceanNameControl();
			if (self.errorMultilegDetail.errors().length != 0) {
				self.errorMultilegDetail.errors.showAllMessages();
				return true;
			} else {
				return false;
			}
		}
		else {
			return false;
		}
	}

	//Fill Multileg Details from EDit Details
	public fillMultilegDetails(item: ISalesOrderMultilegDetails, transitDays: string, groundCarrierName: string) {
		var self = this;
		self.groundCarriername(groundCarrierName);
		self.groundTransitDays(transitDays);
		//if (item !== null && item[0].TerminalAddress.length > 0 && item[0].OceanCarrierDetails.length > 0) {
		if (item !== null && item[0].TerminalAddress.length > 0) {
			self.terminalHubCompanyName(item[0].TerminalAddress[0].CompanyName);
			self.terminalHubContactPerson(item[0].TerminalAddress[0].ContactPerson);
			self.terminalHubPhone(item[0].TerminalAddress[0].Phone);
			self.terminalHubFax(item[0].TerminalAddress[0].Fax);
			self.terminalHubAddress1(item[0].TerminalAddress[0].Street);
			self.terminalHubAddress2(item[0].TerminalAddress[0].Street2);
			self.terminalHubCityStateZip(item[0].TerminalAddress[0].City + " " + item[0].TerminalAddress[0].State + " " + item[0].TerminalAddress[0].ZipCode);
		}
		if (item != null && item[0].OceanCarrierDetails.length > 0) {
			self.oceanCarrierSearchList.ID(item[0].OceanCarrierDetails[0].CarrierId);
			self.oceanCarrierSearchList.oceanCarrierName(item[0].OceanCarrierDetails[0].CarrierName);
			//self.oceanTransitDays(item[0].OceanCarrierDetails[0].TransitDays);
			self.oceanTransitDays(item[0].OceanCarrierDetails[0].CalendarDays != '' ? item[0].OceanCarrierDetails[0].CalendarDays : item[0].OceanCarrierDetails[0].TransitDays);
			self.oceanProNumber(item[0].OceanCarrierDetails[0].PRONumber);
		}
	}

	//sets the tracking extension for VB required fields
	SetBITrackChange(self) {
		//** To detect changes for Vendor Bill
		self.oceanCarrierSearchList.oceanCarrierName.extend({ trackChange: true });
		self.oceanTransitDays.extend({ trackChange: true });
		self.oceanProNumber.extend({ trackChange: true });
	}

	public cleanup() {
		var self = this;

		self.terminalHubContactPerson.extend({ validatable: false });
		self.terminalHubPhone.extend({ validatable: false });
		self.terminalHubFax.extend({ validatable: false });
		self.terminalHubAddress1.extend({ validatable: false });
		self.terminalHubCompanyName.extend({ validatable: false });
		self.terminalHubCityStateZip.extend({ validatable: false });

        self.terminalHubLocation.cleanup("#txtmultilegLocationControl");
		self.oceanCarrierSearchList.cleanup();
		self.companyNameSearchList.cleanup();

		//self.oceanCarriername.dispose();
		//self.oceanCarrierId.dispose();

		for (var property in self) {
			if (property != "cleanup")
				delete self[property];
		}

		delete self;
	}

	//#endregion
}