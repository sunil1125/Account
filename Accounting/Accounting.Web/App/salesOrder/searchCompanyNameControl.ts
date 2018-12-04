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
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
//#endregion

//#region Import
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refCompanyNameSearch = require('services/models/salesOrder/SearchCompanyName');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refCommonClient = require('services/client/CommonClient');
import refMapLocation = require('services/models/common/MapLocation');
import refSearchTerminalCompanyModel = require('services/models/salesOrder/SearchTerminalCompany');

//#endregion

/** <summary>
* * ViewModel Class for search Company Name
* * < / summary >
* * <createDetails>
* * <id>US10941 < /id> <by>Bhanu pratap</by > <date> 10 - 16 - 2014 </date >
* * < / createDetails >
* * <changeHistory>
* * < / changeHistory >
*/

export class SearchCompanyNameControl {
	//#region Members

	public companyName: KnockoutObservable<string> = null;
	public ID: KnockoutObservable<number> = ko.observable(0);
	public companyId: KnockoutObservable<number> = ko.observable(0);

	name: KnockoutObservable<ISearchCompanyName> = ko.observable();
	searchCompanyName: (query: string, process: Function) => any;
	onSelectCompanyName: (that: SearchCompanyNameControl, event) => void;
	//for tracking change
	getBITrackChange: () => string[];
	isBIDirty: KnockoutComputed<boolean>;
	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	isNotAtLoadingTime: boolean = false;
	returnValue: boolean = false;
	isCustomCss: KnockoutObservable<boolean> = ko.observable(true);
	isCustomCssSO: KnockoutObservable<boolean> = ko.observable(false);
	companyClass: KnockoutComputed<string>;
	errorWidth: KnockoutObservable<string> = ko.observable('225px');
	normalWidth: KnockoutObservable<string> = ko.observable('93%');
	// To fill Other Terminal address fields
	contactName: KnockoutObservable<string> = ko.observable('');
	phone: KnockoutObservable<string> = ko.observable('');
	fax: KnockoutObservable<string> = ko.observable('');
	address1: KnockoutObservable<string> = ko.observable('');
	address2: KnockoutObservable<string> = ko.observable('');
	city: KnockoutObservable<string> = ko.observable('');
	stateCode: KnockoutObservable<string> = ko.observable('');
	zip: KnockoutObservable<string> = ko.observable('');

	//To set Validation is required or not
	isValidationRequired: KnockoutObservable<boolean> = ko.observable(true);
	public isEnable: KnockoutObservable<boolean> = ko.observable(true);

	shipperZip: KnockoutObservable<string> = ko.observable('');
	consigneeZip: KnockoutObservable<string> = ko.observable('');

	carrierId: KnockoutObservable<number> = ko.observable(0);
	shipperLocation: refMapLocation.Models.MapLocation = new refMapLocation.Models.MapLocation();
	consigneeLocation: refMapLocation.Models.MapLocation = new refMapLocation.Models.MapLocation();

	searchTerminalCompanyModel: refSearchTerminalCompanyModel.Models.SearchTerminalCompany = new refSearchTerminalCompanyModel.Models.SearchTerminalCompany();
	// client command
	commonClient: refCommonClient.Common = new refCommonClient.Common();
	salesOrderClient: refSalesOrderClient.SalesOrderClient = new refSalesOrderClient.SalesOrderClient();
	//#endregion

	//#region Constructor
	constructor(message: string) {
		var self = this;

		if (message == null || message.trim() == '') {
			self.companyName = ko.observable('');
		}
		else {
			self.companyName = ko.observable('').extend({
				required: {
					message: message,
					onlyIf: () => {
						return (self.isValidationRequired());
					}
				}
			});
		}

		//For searching Customer Name
		self.searchCompanyName = function (query, process) {
			self.name(null);

			self.searchTerminalCompanyModel.ShipperCountryCode = self.shipperLocation.CountryCode;
			self.searchTerminalCompanyModel.ShipperStateCode = self.shipperLocation.StateCode;
			self.searchTerminalCompanyModel.ShipperCity = self.shipperLocation.City;
			self.searchTerminalCompanyModel.ShipperZip = self.shipperLocation.Zip;
			self.searchTerminalCompanyModel.ConsigneeCountryCode = self.consigneeLocation.CountryCode;
			self.searchTerminalCompanyModel.ConsigneeStateCode = self.consigneeLocation.StateCode;
			self.searchTerminalCompanyModel.ConsigneeCity = self.consigneeLocation.City;
			self.searchTerminalCompanyModel.ConsigneeZip = self.consigneeLocation.Zip;
			self.searchTerminalCompanyModel.CarrierId = self.carrierId();
			self.searchTerminalCompanyModel.SearchValue = query;
			if (self.shipperLocation.Zip.length > 0 && self.consigneeLocation.Zip.length > 0) {
				return self.salesOrderClient.searchCompanyName(self.searchTerminalCompanyModel, process);
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

		//For Select Company name for the dropdown
		self.onSelectCompanyName = function (that: SearchCompanyNameControl, event) {
			that.ID(event.obj.ID);
			that.companyName(event.obj.CompanyName);
			that.name(event.obj);
			that.contactName(event.obj.ContactName);
			that.phone(event.obj.PhoneNo);
			that.fax(event.obj.Fax);
			that.address1(event.obj.Street);
			that.address2('');
			that.city(event.obj.City);
			that.stateCode(event.obj.StateCode);
			that.zip(event.obj.ZipCode);
		}
	}
	//#endregion

	//#region Internal Methods

	//To validate the Company Name
	public vaildateSearchCompanyNameControl() {
		var self = this;
		if (!refSystem.isObject(self.name())) {
			self.companyName('');
			self.ID(0);
		}
	}

	SetBITrackChange(self) {
		//** To detect changes for Customer Name
		self.companyName.extend({ trackChange: true });
	}

	public cleanup() {
		var self = this;
        $('#txtCompanyName').typeahead('dispose');
		for (var property in self) {
			delete self[property];
		}
	}
	//#endregion
}