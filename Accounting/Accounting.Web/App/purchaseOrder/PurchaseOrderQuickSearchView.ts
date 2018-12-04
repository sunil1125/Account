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
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />

//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refVendorNameSearchControl = require('templates/searchVendorNameControl');
import refVendorNameSearch = require('services/models/common/searchVendorName');
import refCommon = require('services/client/CommonClient');
//#endregion

/*
** <summary>
** Purchase Order Quick search View Model.
** </summary>
** <createDetails>
** <by>Achal Rastogi</by> <date>07-11-2014</date>
** </createDetails>}
*/
export class PurchaseOrderQuickSearchViewModel {
	//#region Members

	// client command
	commonClient: refCommon.Common = new refCommon.Common();

	vendorNameSearchList: refVendorNameSearchControl.SearchVendorNameControl;
	vendorId: KnockoutComputed<number>;
	vendorName: KnockoutComputed<string>;
	proNumber: KnockoutObservable<string> = ko.observable('');
	bolNumber: KnockoutObservable<string> = ko.observable('');
	poNumber: KnockoutObservable<string> = ko.observable('');
	// list of all bill status
	billStatusList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	// selected bill status
	selectedbillStatus: KnockoutObservable<number> = ko.observable();

	// width to apply when there is no validation.
	normalWidth: KnockoutObservable<string> = ko.observable('36.5%');

	// width to apply when there is validation.
	errorWidth: KnockoutObservable<string> = ko.observable('233px');

	// error list for vendor bill quick search
	errorPurchaseOrderQuickSearch: KnockoutValidationGroup;

	//#endregion

	//#region Constructor
	constructor() {
		var self = this;
		self.vendorNameSearchList = new refVendorNameSearchControl.SearchVendorNameControl('','36.5%','',false);
		// to get the vendorId after selecting vendor
		self.vendorId = ko.computed(function () {
			if (self.vendorNameSearchList.name() != null)
				return self.vendorNameSearchList.ID();

			return 0;
		});

		// to get the vendor Name after selecting vendor
		self.vendorName = ko.computed(function () {
			if (self.vendorNameSearchList.name() != null)
				return self.vendorNameSearchList.vendorName();

			return null;
		});

		// pro validation for minimum three characters
		self.proNumber.extend({
			minLength:
			{
				message: ApplicationMessages.Messages.MinimumCharactersRequired, params: 3
			}
		});

		// pro validation for minimum three characters
		self.bolNumber.extend({
			minLength:
			{
				message: ApplicationMessages.Messages.MinimumCharactersRequired, params: 3
			}
		});

		// po validation for minimum three characters
		self.poNumber.extend({
			minLength:
			{
				message: ApplicationMessages.Messages.MinimumCharactersRequired, params: 3
			}
		});

		self.errorPurchaseOrderQuickSearch = ko.validatedObservable({
			proNumber: self.proNumber,
			bolNumber: self.bolNumber,
			poNumber: self.poNumber
		});
	}
	//#endregion

	//#region Internal Methods
	public validateQuickSearch() {
		var self = this;
		var isInvalid = false;
		if (self.errorPurchaseOrderQuickSearch.errors().length != 0) {
			self.errorPurchaseOrderQuickSearch.errors.showAllMessages();
			return true;
		} else {
			return false;
		}
	}

	//#endregion

	//#region Life Cycle Event
	public activate() {
		return true;
    }

    public cleanup() {
        var self = this;
        self.vendorNameSearchList.cleanUp();
    }
	//#endregion
}