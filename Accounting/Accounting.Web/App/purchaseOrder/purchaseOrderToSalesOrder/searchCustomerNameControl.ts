/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/bootstrap.datepicker.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../services/models/TypeDefs/CommonModels.d.ts" />
//#endregion

//#region Import
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refCustomerNameSearch = require('services/models/common/searchCustomerName');
import refPurchaseOrderClient = require('services/client/PurchaseOrderClient');
import refCommonClient = require('services/client/CommonClient');
//#endregion

/** <summary>
* * ViewModel Class for search Customer Name
* * < / summary >
* * <createDetails>
* * <id>US10941 < /id> <by>Bhanu pratap</by > <date> 09 - 29 - 2014 </date >
* * < / createDetails >
* * <changeHistory>
* * < / changeHistory >
*/

export class SearchCustomerNameControl {
	//#region Members

	public customerName: KnockoutObservable<string> = null;
	public ID: KnockoutObservable<number> = ko.observable(0);
	public UserId: KnockoutObservable<number> = ko.observable(0);

	name: KnockoutObservable<refCustomerNameSearch.ICustomerNameSearch> = ko.observable();
	searchCustomerName: (query: string, process: Function) => any;
	onSelectCustomerName: (that: SearchCustomerNameControl, event) => void;
	//for tracking change
	getBITrackChange: () => string[];
	isBIDirty: KnockoutComputed<boolean>;
	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	isNotAtLoadingTime: boolean = false;
	returnValue: boolean = false;
	isCustomCss: KnockoutObservable<boolean> = ko.observable(true);
	isCustomCssSO: KnockoutObservable<boolean> = ko.observable(false);
	customerClass: KnockoutComputed<string>;
	errorWidth: KnockoutObservable<string> = ko.observable('150px');
	normalWidth: KnockoutObservable<string> = ko.observable('170px');

	//To set Validation is required or not
	isValidationRequired: KnockoutObservable<boolean> = ko.observable(true);
	public isEnable: KnockoutObservable<boolean> = ko.observable(true);

	// client command
	commonClient: refCommonClient.Common = new refCommonClient.Common();
	purchaseOrderClient: refPurchaseOrderClient.PurchaseOrderClient = new refPurchaseOrderClient.PurchaseOrderClient();
	//#endregion

	//#region Constructor
	constructor(message: string) {
		var self = this;

		if (message == null || message.trim() == '') {
			self.customerName = ko.observable('');
		}
		else {
			self.customerName = ko.observable('').extend({
				required: {
					message: message,
					onlyIf: () => {
						return (self.isValidationRequired());
					}
				}
			});
		}

		//For searching Customer Name
		self.searchCustomerName = function (query, process) {
			self.name(null);
			if (self.UserId() !== undefined && self.UserId() && self.UserId())
				return self.purchaseOrderClient.searchCustomerDetailsByUserId(query, self.UserId(), process);

			return null;
		}

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

		//For Select Customer name for the dropdown
		self.onSelectCustomerName = function (that: SearchCustomerNameControl, event) {
			that.ID(event.obj.ID);
			that.customerName(event.obj.CompanyName);
			that.name(event.obj);
		}
	}
	//#endregion

	//#region Internal Methods

	//To validate the Customer Name
	public vaildateSearchCustomerNameControl() {
		var self = this;
		if (!refSystem.isObject(self.name())) {
			self.customerName('');
			self.ID(0);
		}
	}

	SetBITrackChange(self) {
		//** To detect changes for Customer Name
		self.customerName.extend({ trackChange: true });
	}
	//#endregion

    public cleanup() {
        var self = this;
        $('#txtCustomerName').typeahead('dispose');
        for (var property in self) {
            if (property != "cleanup")
                delete self[property];
        }

        delete self;
    }
}