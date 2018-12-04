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
import refOceanCarrierNameSearch = require('services/models/salesOrder/SearchOceanCarrierDetail');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refCommonClient = require('services/client/CommonClient');
import refMapLocation = require('services/models/common/MapLocation');
import refSearchTerminalCompanyModel = require('services/models/salesOrder/SearchTerminalCompany');
//#endregion

/** <summary>
* * ViewModel Class for search Ocean Carrier
* * < / summary >
* * <createDetails>
* * <id>US10941 < /id> <by>Bhanu pratap</by > <date> 10 - 16 - 2014 </date >
* * < / createDetails >
* * <changeHistory>
* * < / changeHistory >
*/

export class SearchOceanCarrierDetailControl {
	//#region Members

	public oceanCarrierName: KnockoutObservable<string> = null;
	public ID: KnockoutObservable<number> = ko.observable(0);
	public customerId: KnockoutObservable<number> = ko.observable(0);
	public selectedShipVia: KnockoutObservable<number> = ko.observable(0);

	name: KnockoutObservable<ISearchOceanCarrier> = ko.observable();
	searchOceanCarrierName: (query: string, process: Function) => any;
	onSelectOceanCarrierName: (that: SearchOceanCarrierDetailControl, event) => void;
	//for tracking change
	getBITrackChange: () => string[];
	isBIDirty: KnockoutComputed<boolean>;
	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	isNotAtLoadingTime: boolean = false;
	returnValue: boolean = false;
	isCustomCss: KnockoutObservable<boolean> = ko.observable(true);
	isCustomCssSO: KnockoutObservable<boolean> = ko.observable(false);
	oceanCarrierClass: KnockoutComputed<string>;
	errorWidth: KnockoutObservable<string> = ko.observable('86%');
	normalWidth: KnockoutObservable<string> = ko.observable('91%');

	//To set Validation is required or not
	isValidationRequired: KnockoutObservable<boolean> = ko.observable(true);
	public isEnable: KnockoutObservable<boolean> = ko.observable(true);

	// client commond
	commonClient: refCommonClient.Common = new refCommonClient.Common();
	salesOrderClient: refSalesOrderClient.SalesOrderClient = new refSalesOrderClient.SalesOrderClient();

	// To fill terminal address
	companyName: KnockoutObservable<string> = ko.observable('');
	contactName: KnockoutObservable<string> = ko.observable('');
	phone: KnockoutObservable<string> = ko.observable('');
	fax: KnockoutObservable<string> = ko.observable('');
	address1: KnockoutObservable<string> = ko.observable('');
	address2: KnockoutObservable<string> = ko.observable('');
	city: KnockoutObservable<string> = ko.observable('');
	stateCode: KnockoutObservable<string> = ko.observable('');
	zip: KnockoutObservable<string> = ko.observable('');

	// For Toastr
	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	private checkMsgDisplay: boolean = true;
	// TO fetch Terminal hub address
	carrierId: KnockoutObservable<number> = ko.observable(0);
	shipperLocation: refMapLocation.Models.MapLocation = new refMapLocation.Models.MapLocation();
	consigneeLocation: refMapLocation.Models.MapLocation = new refMapLocation.Models.MapLocation();

	searchTerminalCompanyModel: refSearchTerminalCompanyModel.Models.SearchTerminalCompany = new refSearchTerminalCompanyModel.Models.SearchTerminalCompany();
	//#endregion

	//#region Constructor
	constructor(message: string) {
		var self = this;

		if (message == null || message.trim() == '') {
			self.oceanCarrierName = ko.observable('');
		}
		else {
			self.oceanCarrierName = ko.observable('').extend({
				required: {
					message: message,
					onlyIf: () => {
						return (self.isValidationRequired());
					}
				}
			});
		}

		//For searching Agent Name
		self.searchOceanCarrierName = function (query, process) {
			self.name(null);
			return self.salesOrderClient.searchOceanCarrierDetails(query, process);

			return null;
		}

		//To check if Msg is clicked
		self.checkMsgClick = () => {
			self.checkMsgDisplay = true;
		}

	// to Check if Msg is hidden or closed
		self.checkMsgHide = () => {
			self.checkMsgDisplay = true;
		}

		self.SetBITrackChange(self);

		self.getBITrackChange = function () {
			return Utils.getDirtyItems(self);
		};

		self.isBIDirty = ko.computed(() => {
			var result = self.oceanCarrierName();
			// If this from loading data side the return as false
			if (self.isNotAtLoadingTime)
				return false;

			var returnValue = self.getBITrackChange().length > 0 ? true : false;
			self.returnValue = returnValue;
			if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
				self.onChangesMade(returnValue);

			return returnValue;
		});

		//For Select Ocean Carrier name for the dropdown
		self.onSelectOceanCarrierName = function (that: SearchOceanCarrierDetailControl, event) {
			that.ID(event.obj.CarrierId);
			that.oceanCarrierName(event.obj.CarrierName);
			that.name(event.obj);

			//To fetch terminal hub address
			self.searchTerminalCompanyModel.ShipperCountryCode = self.shipperLocation.CountryCode;
			self.searchTerminalCompanyModel.ShipperStateCode = self.shipperLocation.StateCode;
			self.searchTerminalCompanyModel.ShipperCity = self.shipperLocation.City;
			self.searchTerminalCompanyModel.ShipperZip = self.shipperLocation.Zip;
			self.searchTerminalCompanyModel.ConsigneeCountryCode = self.consigneeLocation.CountryCode;
			self.searchTerminalCompanyModel.ConsigneeStateCode = self.consigneeLocation.StateCode;
			self.searchTerminalCompanyModel.ConsigneeCity = self.consigneeLocation.City;
			self.searchTerminalCompanyModel.ConsigneeZip = self.consigneeLocation.Zip;
			self.searchTerminalCompanyModel.CarrierId = event.obj.CarrierId;

			if (self.shipperLocation.Zip.length > 0 && self.consigneeLocation.Zip.length > 0) {
				var successCallBack = function (data) {
					if (data !== undefined && data !== null && data.length > 0) {
						that.companyName(data[0].CompanyName);
						that.contactName(data[0].ContactName);
						that.phone(data[0].PhoneNo);
						that.fax(data[0].Fax);
						that.address1(data[0].Street);
						that.address2('');
						that.city(data[0].City);
						that.stateCode(data[0].StateCode);
						that.zip(data[0].ZipCode);
					}
					else {
						that.companyName('');
						that.contactName('');
						that.phone('');
						that.fax('');
						that.address1('');
						that.address2('');
						that.city('');
						that.stateCode('');
						that.zip('');
					}
				},
					faliureCallBack = function () {
					};
				return self.salesOrderClient.searchCompanyName(self.searchTerminalCompanyModel, successCallBack);
			}
		}
	}
	//#endregion

	//#region Internal Methods

	//To validate the Ocean Carrier Name
	public vaildateSearchOceanNameControl() {
		var self = this;
		if (!refSystem.isObject(self.name())) {
			self.oceanCarrierName('');
			self.ID(0);
		}
	}

	SetBITrackChange(self) {
		//** To detect changes for Agent Name
		self.oceanCarrierName.extend({ trackChange: true });
	}

	public cleanup() {
		var self = this;
        $('#txtOceanCarrierName').typeahead('dispose');
		for (var property in self) {
			if (property != "cleanup")
				delete self[property];
		}
	}
	//#endregion
}