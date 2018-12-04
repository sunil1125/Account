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
define(["require", "exports", 'durandal/app', 'durandal/system', 'services/client/CommonClient'], function(require, exports, ___app__, __refSystem__, __refCommonClient__) {
    //#region Import
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    
    var refCommonClient = __refCommonClient__;

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
    var SearchVendorNameControl = (function () {
        //#region Constructor
        function SearchVendorNameControl(message, normalWidth, errorWidth, isRequiredField, carrierSelectionCallback, carrierTypeSelectionCallback) {
            //#region Members
            this.vendorName = null;
            this.ID = ko.observable(0);
            this.carrierCode = ko.observable('');
            this.carrierType = ko.observable(0);
            this.name = ko.observable();
            this.isNotAtLoadingTime = false;
            this.returnValue = false;
            this.isCustomCss = ko.observable(true);
            this.isCustomCssSO = ko.observable(false);
            this.errorWidth = ko.observable('232px');
            this.normalWidth = ko.observable('250px');
            this.isSubBillOrder = ko.observable(true);
            //To set Validation is required or not
            this.isValidationRequired = ko.observable(true);
            this.isEnable = ko.observable(true);
            //#endregion
            // ###START: US22795
            this.isExceptTLVendorSearch = ko.observable(false);
            // ###END: US22795
            // client commond
            this.commonClient = new refCommonClient.Common();
            var self = this;

            self.carrierSelectionChange = carrierSelectionCallback;
            self.carrierTypeSelection = carrierTypeSelectionCallback;

            if (typeof normalWidth !== 'undefined')
                self.normalWidth(normalWidth);

            if (typeof errorWidth !== 'undefined')
                self.errorWidth(errorWidth);

            if (typeof isRequiredField !== 'undefined')
                self.isCustomCss(isRequiredField);

            if (message == null || message.trim() == '') {
                self.vendorName = ko.observable('');
            } else {
                self.vendorName = ko.observable('').extend({
                    required: {
                        message: message,
                        onlyIf: function () {
                            return (self.isValidationRequired());
                        }
                    }
                });
            }

            //For searching Vendor Name
            self.searchvendorName = function (query, process) {
                self.name(null);

                if (self.isExceptTLVendorSearch() === true) {
                    return self.commonClient.searchExceptTLVendorName(query, process);
                } else {
                    return self.commonClient.searchVendorName(query, process);
                }
                // ###END: US22795
            };

            self.SetBITrackChange(self);

            self.getBITrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            self.isBIDirty = ko.computed(function () {
                var result = self.vendorName();

                if (self.isNotAtLoadingTime)
                    return false;

                var returnValue = self.getBITrackChange().length > 0 ? true : false;
                self.returnValue = returnValue;
                if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
                    self.onChangesMade(returnValue);

                return returnValue;
            });

            //For Select vendor name for the dropdown
            self.onSelectvendorName = function (that, event) {
                that.ID(event.obj.ID);
                that.vendorName(event.obj.CarrierName);
                that.name(event.obj);
                that.carrierType(event.obj.CarrierType);
                that.carrierCode(event.obj.CarrierCode);

                if (self.carrierSelectionChange && typeof (self.carrierSelectionChange) === 'function')
                    self.carrierSelectionChange(event.obj.ID);

                if (self.carrierTypeSelection && typeof (self.carrierTypeSelection) === 'function')
                    self.carrierTypeSelection(event.obj.CarrierType);
            };
            self.vendorClass = ko.computed(function () {
                return self.isCustomCss() === true ? "vendorbilltextbox requiredFieldBgColor" : "";
            });
        }
        //#endregion
        //#region Internal Methods
        //To validate the Vendor Name
        SearchVendorNameControl.prototype.vaildateSearchVendorNameControl = function () {
            var self = this;
            if (!refSystem.isObject(self.name())) {
                self.vendorName('');
                self.ID(0);
            }
        };

        SearchVendorNameControl.prototype.SetBITrackChange = function (self) {
            //** To detect changes for shipper address
            self.vendorName.extend({ trackChange: true });
        };

        //#endregion
        //#region Cleanup
        SearchVendorNameControl.prototype.cleanUp = function () {
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
        };
        return SearchVendorNameControl;
    })();
    exports.SearchVendorNameControl = SearchVendorNameControl;
});
