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
import refAgencyNameSearch = require('services/models/purchaseOrder/SearchAgencyName');
import refPurchaseOrderClient = require('services/client/PurchaseOrderClient');
import refCommonClient = require('services/client/CommonClient');
//#endregion

/** <summary>
* * ViewModel Class for search Agency Name
* * < / summary >
* * <createDetails>
* * <id>US10941 < /id> <by>Bhanu pratap</by > <date> 09 - 29 - 2014 </date >
* * < / createDetails >
* * <changeHistory>
* * < / changeHistory >
*/

export class SearchAgencyNameControl {
	//#region Members

	public agencyName: KnockoutObservable<string> = null;
	public ID: KnockoutObservable<number> = ko.observable(0);

	name: KnockoutObservable<refAgencyNameSearch.IAgencyNameSearch> = ko.observable();
	searchAgencyName: (query: string, process: Function) => any;
	onSelectAgencyName: (that: SearchAgencyNameControl, event) => void;
	//for tracking change
	getBITrackChange: () => string[];
	isBIDirty: KnockoutComputed<boolean>;
	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	isNotAtLoadingTime: boolean = false;
	returnValue: boolean = false;
	isCustomCss: KnockoutObservable<boolean> = ko.observable(true);
	isCustomCssSO: KnockoutObservable<boolean> = ko.observable(false);
	agencyClass: KnockoutComputed<string>;
	errorWidth: KnockoutObservable<string> = ko.observable('175px');
	normalWidth: KnockoutObservable<string> = ko.observable('170px');

	//To set Validation is required or not
	isValidationRequired: KnockoutObservable<boolean> = ko.observable(true);
	public isEnable: KnockoutObservable<boolean> = ko.observable(true);

	// client commond
	commonClient: refCommonClient.Common = new refCommonClient.Common();

	//AgencySearchCallBack
	AgencySearchCallBack: (agencyId: number) => any;

	purchaseOrderClient: refPurchaseOrderClient.PurchaseOrderClient = new refPurchaseOrderClient.PurchaseOrderClient();
	//#endregion

	//#region Constructor
	constructor(message: string, agencySearchCallBack: (agencyId: number) => any) {
		var self = this;
		self.AgencySearchCallBack = agencySearchCallBack;

		if (message == null || message.trim() == '') {
			self.agencyName = ko.observable('');
		}
		else {
			self.agencyName = ko.observable('').extend({
				required: {
					message: message,
					onlyIf: () => {
						return (self.isValidationRequired());
					}
				}
			});
		}

		//For searching Agency Name
		self.searchAgencyName = function (query, process) {
			self.name(null);
			return self.purchaseOrderClient.searchAgencyDetails(query, process);
		}

		self.SetBITrackChange(self);

		self.getBITrackChange = function () {
			return Utils.getDirtyItems(self);
		};

		self.isBIDirty = ko.computed(() => {
			var result = self.agencyName();
			// If this from loading data side the return as false
			if (self.isNotAtLoadingTime)
				return false;

			var returnValue = self.getBITrackChange().length > 0 ? true : false;
			self.returnValue = returnValue;
			if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
				self.onChangesMade(returnValue);

			return returnValue;
		});

		//For Select agency name for the dropdown
		self.onSelectAgencyName = function (that: SearchAgencyNameControl, event) {
			that.ID(event.obj.Id);
			that.agencyName(event.obj.Name);
			that.name(event.obj);
			self.AgencySearchCallBack(that.ID());
		}
	}

	//#endregion

	//#region Internal Methods

	//To validate the agency Name
	public vaildateSearchAgencyNameControl() {
		var self = this;
		if (!refSystem.isObject(self.name())) {
			self.agencyName('');
			self.ID(0);
		}
	}

	SetBITrackChange(self) {
		//** To detect changes for Agency Name
		self.agencyName.extend({ trackChange: true });
	}
	//#endregion

    public cleanup() {
        var self = this;
        $('#txtAgencyName').typeahead('dispose');
        for (var property in self) {
            if (property != "cleanup")
                delete self[property];
        }

        delete self;
    }
}