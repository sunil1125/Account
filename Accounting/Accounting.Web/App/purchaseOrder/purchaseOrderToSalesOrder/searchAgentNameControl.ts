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
import refAgentNameSearch = require('services/models/common/searchUserName');
import refPurchaseOrderClient = require('services/client/PurchaseOrderClient');
import refCommonClient = require('services/client/CommonClient');
//#endregion

/** <summary>
* * ViewModel Class for search Agent Name
* * < / summary >
* * <createDetails>
* * <id>US10941 < /id> <by>Bhanu pratap</by > <date> 09 - 29 - 2014 </date >
* * < / createDetails >
* * <changeHistory>
* * < / changeHistory >
*/

export class SearchAgentNameControl {
	//#region Members

	public agentName: KnockoutObservable<string> = null;
	public ID: KnockoutObservable<number> = ko.observable(0);
	public AgencyId: KnockoutObservable<number> = ko.observable(0);

	name: KnockoutObservable<refAgentNameSearch.IUserNameSearch> = ko.observable();
	searchAgentName: (query: string, process: Function) => any;
	onSelectAgentName: (that: SearchAgentNameControl, event) => void;
	//for tracking change
	getBITrackChange: () => string[];
	isBIDirty: KnockoutComputed<boolean>;
	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	isNotAtLoadingTime: boolean = false;
	returnValue: boolean = false;
	isCustomCss: KnockoutObservable<boolean> = ko.observable(true);
	isCustomCssSO: KnockoutObservable<boolean> = ko.observable(false);
	agentClass: KnockoutComputed<string>;
	errorWidth: KnockoutObservable<string> = ko.observable('175px');
	normalWidth: KnockoutObservable<string> = ko.observable('170px');

	//To set Validation is required or not
	isValidationRequired: KnockoutObservable<boolean> = ko.observable(true);
	public isEnable: KnockoutObservable<boolean> = ko.observable(true);

	// client commond
	commonClient: refCommonClient.Common = new refCommonClient.Common();

	//callback for agent selection
	agentSearchCallBack: () => any;

	purchaseOrderClient: refPurchaseOrderClient.PurchaseOrderClient = new refPurchaseOrderClient.PurchaseOrderClient();
	//#endregion

	//#region Constructor
	constructor(message: string, agentSearchCallBack:()=>any) {
		var self = this;

		//callback for agent selection
		self.agentSearchCallBack = agentSearchCallBack;

		if (message == null || message.trim() == '') {
			self.agentName = ko.observable('');
		}
		else {
			self.agentName = ko.observable('').extend({
				required: {
					message: message,
					onlyIf: () => {
						return (self.isValidationRequired());
					}
				}
			});
		}

		//For searching Agent Name
		self.searchAgentName = function (query, process) {
			self.name(null);
			if (self.AgencyId() !== undefined && self.AgencyId() && self.AgencyId() > 0)
				return self.purchaseOrderClient.searchAgentDetailsByAgencyId(query, self.AgencyId(), process);

			return null;
		}

		self.SetBITrackChange(self);

		self.getBITrackChange = function () {
			return Utils.getDirtyItems(self);
		};

		self.isBIDirty = ko.computed(() => {
			var result = self.agentName();
			// If this from loading data side the return as false
			if (self.isNotAtLoadingTime)
				return false;

			var returnValue = self.getBITrackChange().length > 0 ? true : false;
			self.returnValue = returnValue;
			if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
				self.onChangesMade(returnValue);

			return returnValue;
		});

		//For Select Agent name for the dropdown
		self.onSelectAgentName = function (that: SearchAgentNameControl, event) {
			that.ID(event.obj.GlobalNetUserId);
			that.agentName(event.obj.FullName);
			that.name(event.obj);
			self.agentSearchCallBack();
		}
	}
	//#endregion

	//#region Internal Methods

	//To validate the Agent Name
	public vaildateSearchAgentNameControl() {
		var self = this;
		if (!refSystem.isObject(self.name())) {
			self.agentName('');
			self.ID(0);
		}
	}

	SetBITrackChange(self) {
		//** To detect changes for Agent Name
		self.agentName.extend({ trackChange: true });
	}
	//#endregion

    public cleanup() {
        var self = this;
        $('#txtAgentName').typeahead('dispose');
        for (var property in self) {
            if (property != "cleanup")
                delete self[property];
        }

        delete self;
    }
}