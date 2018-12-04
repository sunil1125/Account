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
import refUserNameSearch = require('services/models/common/searchUserName');
import refVendorBillClient = require('services/client/VendorBillClient');
import refCommonClient = require('services/client/CommonClient');
//#endregion

/** <summary>
* *		Search User Auto Complete View Model
* * < / summary >
* * <createDetails>proNumber
* *		<by>Avinash Dubey</by >
* *		<date>04 - 21 - 2014 </date >
* * < / createDetails >
*/

export class SearchUserAutoComplete {
	//#region Members

	public userName: KnockoutObservable<string> = null;
	public id: KnockoutObservable<number> = ko.observable(0);
	public emailId: string;
	public isEnable: KnockoutObservable<boolean> = ko.observable(true);
	name: KnockoutObservable<refUserNameSearch.IUserNameSearch> = ko.observable();
	searchUserName: (query: string, process: Function) => any;
	onSelectUserName: (that: SearchUserAutoComplete, event) => void;

	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	isNotAtLoadingTime: boolean = false;
	returnValue: boolean = false;
	isCustomCss: KnockoutObservable<boolean> = ko.observable(true);
	customClass: KnockoutComputed<string>;
	errorWidth: KnockoutObservable<string> = ko.observable('188px');
	normalWidth: KnockoutObservable<string> = ko.observable('212px');
	//#endregion

	// client command
	commonClient: refCommonClient.Common = new refCommonClient.Common();

	//#region Constructor
	constructor(message: string, normalWidth?: string, errorWidth?: string, isRequiredField?: boolean) {
		var self = this;

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
			self.userName = ko.observable('');
		}
		else {
			self.userName = ko.observable('').extend({ required: { message: message } });
		}

		//For searching Vendor Name
		self.searchUserName = (query, process) => {
			self.name(null);
			return self.commonClient.searchUsers(query, process);
		}

		//For Select vendor name for the dropdown
		self.onSelectUserName = (that: SearchUserAutoComplete, event) => {
			that.id(event.obj.Id);
			that.userName(event.obj.FirstName);
			that.emailId = event.obj.Email;
			that.name(event.obj);
		}

		self.customClass = ko.computed(() => {
			return self.isCustomCss() === true ? "vendorbilltextbox requiredFieldBgColor" : "";
		});
	}
	//#endregion

	//#region Internal Methods

	//To validate the Vendor Name
	public vaildateSearchVendorNameControl() {
		var self = this;
		if (!refSystem.isObject(self.name())) {
			self.userName('');
			self.id(0);
		}
	}

	//#endregion

    public cleanup() {
        var self = this;
        $('#txtuserName').typeahead('dispose');
    }
}