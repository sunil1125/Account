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
import refMasCarrierSearch = require('services/models/common/searchMasCarrier');
import refVendorBillClient = require('services/client/VendorBillClient');
import refCommonClient = require('services/client/CommonClient');
//#endregion

/***********************************************
   SEARCH MAS CARRIER AUTOCOMPLETE VIEW MODEL
************************************************
** <summary>
** Search mas Carrier autocomplete view model.
** </summary>
** <createDetails>
** <id></id><by>Satish</by> <date>20th Aug, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by><date></date>
** </changeHistory>

***********************************************/

export class SearchMasCarrierAutoComplete {
	//#region Members

	public masCarrierName: KnockoutObservable<string> = null;
	public id: KnockoutObservable<string> = ko.observable();

	name: KnockoutObservable<refMasCarrierSearch.IMasCarrierSearch> = ko.observable();
	searchMasCarrier: (query: string, process: Function) => any;
	onSelectMasCarrier: (that: SearchMasCarrierAutoComplete, event) => void;

	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	isNotAtLoadingTime: boolean = false;
	returnValue: boolean = false;
	isCustomCss: KnockoutObservable<boolean> = ko.observable(false);
	errorWidth: KnockoutObservable<string> = ko.observable('92%');
	normalWidth: KnockoutObservable<string> = ko.observable('95%');
	isValidationRequired: KnockoutObservable<boolean> = ko.observable(true);
	//#endregion

	// client command
	commonClient: refCommonClient.Common = new refCommonClient.Common();

	//#region Constructor
	constructor(message: string) {
		var self = this;
		if (message == null || message.trim() == '') {
			self.masCarrierName = ko.observable('');
		}
		else {
			self.masCarrierName = ko.observable('').extend(
				{
					required:
					{
						message: message,
						onlyIf: () =>
						{
							return (self.isValidationRequired());
						}
					}
				});
		}

		//For searching Vendor Name
		self.searchMasCarrier = (query, process) => {
			self.name(null);
			return self.commonClient.searchMasCarriers(query, process);
		}

		//For Select vendor name for the dropdown
		self.onSelectMasCarrier = (that: SearchMasCarrierAutoComplete, event) => {
			that.id(event.obj.MassId);
			that.masCarrierName(event.obj.MassCarrierName);
			that.name(event.obj);
		}
	}
	//#endregion

	//#region Internal Methods

	//To validate the Mas Carrier
	public vaildateSearchMasCarrierControl() {
		var self = this;
		if (!refSystem.isObject(self.name())) {
			self.masCarrierName('');
			self.id('');
		}
	}

	//#endregion

    public cleanup() {
        var self = this;
        $('#txtmasCarrierName').typeahead('dispose');
        for (var property in self) {
            if (property != "cleanup")
                delete self[property];
        }
    }
}