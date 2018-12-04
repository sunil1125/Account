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
//#endregion

//#region Import
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refCustomerSearch = require('services/models/common/searchCustomerName');
import refVendorBillClient = require('services/client/VendorBillClient');
import refCommonClient = require('services/client/CommonClient');
//#endregion

/** <summary>
* *		Search Customer AutoComplete
* * < / summary >
* * <createDetails>
* *		<by>Avinash Dubey</by >
* *		<date>04 - 21 - 2014 </date >
* * < / createDetails >
*/

export class SearchCustomerAutoComplete {
	//#region Members

	public customerName: KnockoutObservable<string> = null;
	public id: KnockoutObservable<number> = ko.observable(0);
	public customerId: KnockoutObservable<number> = ko.observable(0);
	public emailId: string;
	public isEnable: KnockoutObservable<boolean> = ko.observable(true);
	public contactName: string = null;
	name: KnockoutObservable<refCustomerSearch.ICustomerNameSearch> = ko.observable();
	searchCustomerName: (query: string, process: Function) => any;
	onSelectCustomerName: (that: SearchCustomerAutoComplete, event) => void;

	//for tracking change
	getBITrackChange: () => string[];
	isBIDirty: KnockoutComputed<boolean>;
	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	isNotAtLoadingTime: boolean = false;
	returnValue: boolean = false;

	isCustomCss: KnockoutObservable<boolean> = ko.observable(true);
	isCustomCssSO: KnockoutObservable<boolean> = ko.observable(false);
	customClass: KnockoutComputed<string>;
	errorWidth: KnockoutObservable<string> = ko.observable('89.5%');
	normalWidth: KnockoutObservable<string> = ko.observable('93%');
	customerSelectionChange: (salesRep: string, AgencyName: string, agencyID?: number, agentID?: number) => any;
	isCustomernameBlankCallBack: (isCustomer: boolean) => any;
	//#endregion

	// client command
	commonClient: refCommonClient.Common = new refCommonClient.Common();

	//#region Constructor
	constructor(message: string, customerSelectionCallback?: (salesRep: string, AgencyName: string, agencyID?: Number, agentID?: number) => any, normalWidth?: string, errorWidth?: string, isRequiredField?: boolean, isCustomernameBlankCallBack?: (isCustomer: boolean) => any) {
		var self = this;
		self.customerSelectionChange = customerSelectionCallback;
		if (typeof (isCustomernameBlankCallBack) !== 'undefined')
			self.isCustomernameBlankCallBack = isCustomernameBlankCallBack;
		// if normal width is set from requested view Model
		if (typeof normalWidth !== 'undefined')
			self.normalWidth(normalWidth);

		// if error width is set from requested view Model
		if (typeof errorWidth !== 'undefined')
			self.errorWidth(errorWidth);

		// if isRequiredField is not null
		if (typeof isRequiredField !== 'undefined')
			self.isCustomCss(isRequiredField);

		if (message == null || message.trim() == '') {
			self.customerName = ko.observable('');
		}
		else {
			self.customerName = ko.observable('').extend({ required: { message: message }});
		}

		//For searching Customer Name
		self.searchCustomerName = (query, process) => {
			if (!$('#txtCustomerName').is('[readonly]')) {
				self.name(null);
				return self.commonClient.searchCustomers(query, process);
			}
		}

		/// To detect changes
		self.SetBITrackChange(self);

		self.getBITrackChange = function () {
			return Utils.getDirtyItems(self);
		};

		self.isBIDirty = ko.computed(() => {
			var result = self.customerName();
			// If this from loading data side the return as false
			if (self.isNotAtLoadingTime)
				return false;

			var returnValue = self.getBITrackChange().length > 0 ? true : false;
			self.returnValue = returnValue;
			if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
				self.onChangesMade(returnValue);

			return returnValue;
		});

		//For Select customer name for the drop down
		self.onSelectCustomerName = (that: SearchCustomerAutoComplete, event) => {
            that.id(event.obj.ID);
			that.customerName(event.obj.CompanyName);
			that.customerId(event.obj.ID);
			that.contactName = event.obj.ContactName;

			that.name(event.obj);

			if (self.customerSelectionChange && typeof (self.customerSelectionChange) === 'function')
				self.customerSelectionChange(event.obj.UserName, event.obj.AgencyName, event.obj.CompanyId, event.obj.UserID);
		}

		self.customClass = ko.computed(() => {
			return self.isCustomCss() === true ? "vendorbilltextbox requiredFieldBgColor" : "";
		});

		self.customerName.subscribe(() => {
			if (self.customerName() === '' || self.customerName() === undefined || self.customerName() === null) {
				if (typeof (isCustomernameBlankCallBack) !== 'undefined')
				self.isCustomernameBlankCallBack(false);
			}
		});
	}
	//#endregion

	//#region Internal Methods

	//To validate the customer Name
	public vaildateSearchCustomerNameControl() {
		var self = this;
		if (!refSystem.isObject(self.name())) {
			self.customerName('');
			self.id(0);
		}
	}

	SetBITrackChange(self) {
		//** To detect changes for shipper address
		self.customerName.extend({ trackChange: true });
	}
	//#endregion

    public cleanup() {
        var self = this;
        $('#txtCustomerName').typeahead('dispose');
    }
}