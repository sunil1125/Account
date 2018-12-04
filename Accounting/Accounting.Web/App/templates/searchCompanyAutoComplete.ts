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
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
/// <reference path="../../Scripts/Utility.ts" />
//#endregion

//#region Import
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refOceanCarrierNameSearch = require('services/models/salesOrder/SearchOceanCarrierDetail');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refCommonClient = require('services/client/CommonClient');
import refMapLocation = require('services/models/common/MapLocation');
import refSearchTerminalCompanyModel = require('services/models/salesOrder/SearchTerminalCompany');
import refEnums = require('services/models/common/Enums');
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

export class SearchCompanyControl {
	//#region Members

	public companyName: KnockoutObservable<string> = null;
	public ID: KnockoutObservable<number> = ko.observable(0);
	public customerId: KnockoutObservable<number> = ko.observable(0);

	name: KnockoutObservable<ISalesOrderAddress> = ko.observable();
	searchCompanyName: (query: string, process: Function) => any;
	onSelectCompanyName: (that: SearchCompanyControl, event) => void;
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
	errorWidth: KnockoutObservable<string> = ko.observable('88.5%');
	normalWidth: KnockoutObservable<string> = ko.observable('93%');

	//To set Validation is required or not
	isValidationRequired: KnockoutObservable<boolean> = ko.observable(true);
	public isEnable: KnockoutObservable<boolean> = ko.observable(true);

	// client commond
	commonClient: refCommonClient.Common = new refCommonClient.Common();
	salesOrderClient: refSalesOrderClient.SalesOrderClient = new refSalesOrderClient.SalesOrderClient();

	// To fill terminal address
	//companyName: KnockoutObservable<string> = ko.observable('');
	contactName: KnockoutObservable<string> = ko.observable('');
	phone: KnockoutObservable<string> = ko.observable('');
	fax: KnockoutObservable<string> = ko.observable('');
	address1: KnockoutObservable<string> = ko.observable('');
	address2: KnockoutObservable<string> = ko.observable('');
	city: KnockoutObservable<string> = ko.observable('');
	stateCode: KnockoutObservable<string> = ko.observable('');
	zip: KnockoutObservable<string> = ko.observable('');
	country: KnockoutObservable<string> = ko.observable('');
	// For Toastr
	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	private checkMsgDisplay: boolean = true;
	// TO  address
	shipperLocation: refMapLocation.Models.MapLocation = new refMapLocation.Models.MapLocation();
	consigneeLocation: refMapLocation.Models.MapLocation = new refMapLocation.Models.MapLocation();
	id: KnockoutObservable<string> = ko.observable('');
	searchTerminalCompanyModel: refSearchTerminalCompanyModel.Models.SearchTerminalCompany = new refSearchTerminalCompanyModel.Models.SearchTerminalCompany();
	//#endregion

	//#region Constructor
	constructor(message: string, id: string) {
		var self = this;
		self.id(id);
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

		//For searching Company Name
		self.searchCompanyName = function (query, process) {
			self.name(null);
			if (self.customerId() !== undefined && self.customerId() && self.customerId() > 0) {
				return self.salesOrderClient.searchAutoCompleteCompanyDetails(query, self.customerId(), process);
			}
			else {
				if (self.checkMsgDisplay) {
					self.checkMsgDisplay = false;
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 15,
						fadeOut: 15,
						typeOfAlert: "",
						title: ""
					}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.SelectCustomer, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				}
				return null;
			}
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
		self.onSelectCompanyName = function (that: SearchCompanyControl, event) {
			that.ID(event.obj.Id);
			that.companyName(event.obj.CompanyName);
			that.name(event.obj);
			that.contactName(event.obj.ContactPerson);
			that.address1(event.obj.Street);
			that.address2(event.obj.Street2);
			that.phone(event.obj.Phone);
			that.fax(event.obj.Fax);
			that.city(event.obj.City);
			that.stateCode(event.obj.State);
			that.zip(event.obj.ZipCode);
			that.country(event.obj.CountryName);
		}
		}
	//#endregion

	//#region Internal Methods

	//To validate the Ocean Carrier Name
	public validateSearchCompanyNameControl() {
		var self = this;
		if (!refSystem.isObject(self.name())) {
			self.companyName('');
			self.ID(0);
		}
	}

	SetBITrackChange(self) {
		//** To detect changes for Agent Name
		self.companyName.extend({ trackChange: true });
	}

    public cleanup(selector) {
		var self = this;
        $(selector).typeahead('dispose');

        for (var property in self) {
            delete self[property];
        }
	}
	//#endregion
}