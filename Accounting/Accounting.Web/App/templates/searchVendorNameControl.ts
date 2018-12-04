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
import refVendorNameSearch = require('services/models/common/searchVendorName');
import refVendorBillClient = require('services/client/VendorBillClient');
import refCommonClient = require('services/client/CommonClient');
//#endregion

/*
** <summary>
** ViewModel Class for search Vendor Name
** </summary>
** <createDetails>
** <id>US8213</id> <by>Sankesh Poojari</by> <date>04-21-2014</date>
** </createDetails>
** <changeHistory>
** <id>US22795</id> <by>Vasanthakumar</by> <date>22-06-2016</date> <description>Acct: Block Trucload Vendors for SO Entry Screen</description>
** </changeHistory>
*/

export class SearchVendorNameControl {
    //#region Members

    public vendorName: KnockoutObservable<string> = null;
    public ID: KnockoutObservable<number> = ko.observable(0);
    public carrierCode: KnockoutObservable<string> = ko.observable('');
    public carrierType: KnockoutObservable<number> = ko.observable(0);
    name: KnockoutObservable<refVendorNameSearch.IVendorNameSearch> = ko.observable();
    searchvendorName: (query: string, process: Function) => any;
    onSelectvendorName: (that: SearchVendorNameControl, event) => void;
    //for tracking change
    getBITrackChange: () => string[];
    isBIDirty: KnockoutComputed<boolean>;
    // call while changes occurs
    public onChangesMade: (dirty: boolean) => any;
    isNotAtLoadingTime: boolean = false;
    returnValue: boolean = false;
    isCustomCss: KnockoutObservable<boolean> = ko.observable(true);
    isCustomCssSO: KnockoutObservable<boolean> = ko.observable(false);
    vendorClass: KnockoutComputed<string>;
    errorWidth: KnockoutObservable<string> = ko.observable('232px');
    normalWidth: KnockoutObservable<string> = ko.observable('250px');
    isSubBillOrder: KnockoutObservable<boolean> = ko.observable(true);
    //To set Validation is required or not
    isValidationRequired: KnockoutObservable<boolean> = ko.observable(true);
    public isEnable: KnockoutObservable<boolean> = ko.observable(true);
    //#endregion

	// ###START: US22795
	isExceptTLVendorSearch: KnockoutObservable<boolean> = ko.observable(false);
	// ###END: US22795

    // client commond
    commonClient: refCommonClient.Common = new refCommonClient.Common();

    // When user selects Carrier/Vendor then it will callback to
    // I - Term Audit Settings view to get the status and item list of that carrier.
    carrierSelectionChange: (carrierId: number) => any;
    carrierTypeSelection: (carrierType: number) => any;

    //#region Constructor
    constructor(message: string, normalWidth?: string, errorWidth?: string, isRequiredField?: boolean, carrierSelectionCallback?: (carrierId: number) => any, carrierTypeSelectionCallback?: (carrierType: number) => any) {
        var self = this;

        self.carrierSelectionChange = carrierSelectionCallback;
        self.carrierTypeSelection = carrierTypeSelectionCallback;
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
            self.vendorName = ko.observable('');
        }
        else {
            self.vendorName = ko.observable('').extend({
                required: {
                    message: message,
                    onlyIf: () => {
                        return (self.isValidationRequired());
                    }
                }
            });
        }

        //For searching Vendor Name
        self.searchvendorName = function (query, process) {
            self.name(null);
			// ###START: US22795
			if (self.isExceptTLVendorSearch() === true) {
				return self.commonClient.searchExceptTLVendorName(query, process);
			}
			else {
				return self.commonClient.searchVendorName(query, process);
			}
			// ###END: US22795
        }

		self.SetBITrackChange(self);

        self.getBITrackChange = function () {
            return Utils.getDirtyItems(self);
        };

        self.isBIDirty = ko.computed(() => {
            var result = self.vendorName();
            // If this from loading data side the return as false
            if (self.isNotAtLoadingTime)
                return false;

            var returnValue = self.getBITrackChange().length > 0 ? true : false;
            self.returnValue = returnValue;
            if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
                self.onChangesMade(returnValue);

            return returnValue;
        });

        //For Select vendor name for the dropdown
        self.onSelectvendorName = function (that: SearchVendorNameControl, event) {
            that.ID(event.obj.ID);
            that.vendorName(event.obj.CarrierName);
            that.name(event.obj);
            that.carrierType(event.obj.CarrierType);
            that.carrierCode(event.obj.CarrierCode);

            if (self.carrierSelectionChange && typeof (self.carrierSelectionChange) === 'function')
                self.carrierSelectionChange(event.obj.ID);

            if (self.carrierTypeSelection && typeof (self.carrierTypeSelection) === 'function')
                self.carrierTypeSelection(event.obj.CarrierType);
        }
		 self.vendorClass = ko.computed(function () {
            return self.isCustomCss() === true ? "vendorbilltextbox requiredFieldBgColor" : "";
        });
    }
    //#endregion

    //#region Internal Methods

    //To validate the Vendor Name
    public vaildateSearchVendorNameControl() {
        var self = this;
        if (!refSystem.isObject(self.name())) {
            self.vendorName('');
            self.ID(0);
        }
    }

    SetBITrackChange(self) {
        //** To detect changes for shipper address
        self.vendorName.extend({ trackChange: true });
    }
    //#endregion

    //#region Cleanup
    public cleanUp() {
        var self = this;

        self.vendorName.extend({ validatable: false });
        $('#txtvendorName').typeahead('dispose');
        delete self.carrierSelectionChange;
        delete self.onChangesMade;
        delete self.carrierTypeSelection;
        delete self.getBITrackChange;
        delete self.isBIDirty;
        delete self.commonClient;
        delete self.searchvendorName;
        delete self.onSelectvendorName;
        delete self.SetBITrackChange;
    }

    //#endregion
}