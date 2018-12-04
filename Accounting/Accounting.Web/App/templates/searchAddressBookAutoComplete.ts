/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.datepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
/// <reference path="../../Scripts/Utility.ts" />
//#endregion

//#region Import
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refAddressBookSearch = require('services/models/common/searchAddressBook');
import refVendorBillClient = require('services/client/VendorBillClient');
import refCommonClient = require('services/client/CommonClient');
import refAddress = require('services/models/salesOrder/SalesOrderAddress');
import refEnums = require('services/models/common/Enums');
//#endregion

/***********************************************
  Search Address BOOK AUTOCOMPLETE VIEW MODEL
************************************************
** <summary>
** Search Address Book autocomplete view model.
** </summary>
** <createDetails>
** <id></id><by>Satish</by> <date>3rd Sep, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by><date></date>
** </changeHistory>

***********************************************/

export class SearchAddressBookControl {
	//#region Members

	public companyName: KnockoutObservable<string> = null;
	public ID: KnockoutObservable<number> = ko.observable(0);

	name: KnockoutObservable<refAddressBookSearch.IShipmentAddressBook> = ko.observable();
	searchCompanyName: (query: string, process: Function) => any;
	onSelectCompanyName: (that: SearchAddressBookControl, event) => void;
	//for tracking change
	getBITrackChange: () => string[];
	isBIDirty: KnockoutComputed<boolean>;
	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	isNotAtLoadingTime: boolean = false;
	returnValue: boolean = false;
	isCustomCss: KnockoutObservable<boolean> = ko.observable(false);
	vendorClass: KnockoutComputed<string>;
	errorWidth: KnockoutObservable<string> = ko.observable('89%');
	normalWidth: KnockoutObservable<string> = ko.observable('93%');
	customerId: KnockoutObservable<number> = ko.observable(0);
	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	private checkMsgDisplay: boolean = true;
	public shouldBeReadOnly: KnockoutObservable<boolean> = ko.observable(false);
	id: KnockoutObservable<string> = ko.observable('');
	//#endregion

	// client commond
	commonClient: refCommonClient.Common = new refCommonClient.Common();
	billToAddressCallback: (billToAddress: IVendorBillAddress) => any;
	//#region Constructor
	constructor(message: string, billToAddressCallback: (billToAddress: IVendorBillAddress) => any, id: string) {
		var self = this;
		self.billToAddressCallback = billToAddressCallback;
		if (message == null || message.trim() == '') {
			self.companyName = ko.observable('');
		}
		else {
			self.companyName = ko.observable('').extend({ required: { message: message } });
		}

		self.id(id);

		//For searching Vendor Name
		self.searchCompanyName = function (query, process) {
			if (self.checkMsgDisplay) {
				self.checkMsgDisplay = false;
				if (self.customerId() === undefined || self.customerId() === 0) {
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 15,
						fadeOut: 15,
						typeOfAlert: "",
						title: ""
					}

					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelecttheCustomerToGetBillTo, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				}
				return;
			}
			else {
				self.name(null);
				return self.commonClient.searchCustomerAddressBook(query, self.customerId(), process);
			}
		}

		self.SetBITrackChange(self);

		self.getBITrackChange = function () {
			return Utils.getDirtyItems(self);
		};

		self.isBIDirty = ko.computed(() => {
			var result = self.companyName();
			// If this from loading data side the return as false
			if (self.isNotAtLoadingTime)
				return false;

			var returnValue = self.getBITrackChange().length > 0 ? true : false;
			self.returnValue = returnValue;
			if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
				self.onChangesMade(returnValue);

			return returnValue;
		});

		//For Select vendor name for the dropdown
		self.onSelectCompanyName = function (that: SearchAddressBookControl, event) {
			var BillToaddress = new refAddress.Models.SalesOrderAddress();
			that.ID(event.obj.ID);
			that.companyName(event.obj.CompanyName);
			that.name(event.obj);
			BillToaddress.CompanyName = event.obj.CompanyName;
			BillToaddress.Phone = event.obj.Phone;
			BillToaddress.Fax = event.obj.Fax;
			BillToaddress.Street = event.obj.Street;
			BillToaddress.Street2 = event.obj.Street2;
			BillToaddress.City = event.obj.City;
			BillToaddress.State = event.obj.State;
			BillToaddress.ZipCode = event.obj.ZipCode;
			BillToaddress.Country = event.obj.CountryCode;
			self.billToAddressCallback(BillToaddress);
		}

		//To check if Msg is clicked
		self.checkMsgClick = () => {
			self.checkMsgDisplay = true;
		}

	// to Check if Msg is hidden or closed
		self.checkMsgHide = () => {
			self.checkMsgDisplay = true;
		}
	}
	//#endregion

	//#region Internal Methods

	//To validate the Vendor Name
	public vaildateSearchVendorNameControl() {
		var self = this;
		if (!refSystem.isObject(self.name())) {
			self.companyName('');
			self.ID(0);
		}
	}

	SetBITrackChange(self) {
		//** To detect changes for shipper address
		self.companyName.extend({ trackChange: true });
	}

	public cleanup(selector) {
		var self = this;
        $(selector).typeahead('dispose');
		for (var property in self) {
			if (property != "cleanup")
				delete self[property];
		}
	}

	//#endregion
}