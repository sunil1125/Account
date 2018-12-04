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
    /** <summary>
    * *		Search Customer AutoComplete
    * * < / summary >
    * * <createDetails>
    * *		<by>Avinash Dubey</by >
    * *		<date>04 - 21 - 2014 </date >
    * * < / createDetails >
    */
    var SearchCustomerAutoComplete = (function () {
        //#region Constructor
        function SearchCustomerAutoComplete(message, customerSelectionCallback, normalWidth, errorWidth, isRequiredField, isCustomernameBlankCallBack) {
            //#region Members
            this.customerName = null;
            this.id = ko.observable(0);
            this.customerId = ko.observable(0);
            this.isEnable = ko.observable(true);
            this.contactName = null;
            this.name = ko.observable();
            this.isNotAtLoadingTime = false;
            this.returnValue = false;
            this.isCustomCss = ko.observable(true);
            this.isCustomCssSO = ko.observable(false);
            this.errorWidth = ko.observable('89.5%');
            this.normalWidth = ko.observable('93%');
            //#endregion
            // client command
            this.commonClient = new refCommonClient.Common();
            var self = this;
            self.customerSelectionChange = customerSelectionCallback;
            if (typeof (isCustomernameBlankCallBack) !== 'undefined')
                self.isCustomernameBlankCallBack = isCustomernameBlankCallBack;

            if (typeof normalWidth !== 'undefined')
                self.normalWidth(normalWidth);

            if (typeof errorWidth !== 'undefined')
                self.errorWidth(errorWidth);

            if (typeof isRequiredField !== 'undefined')
                self.isCustomCss(isRequiredField);

            if (message == null || message.trim() == '') {
                self.customerName = ko.observable('');
            } else {
                self.customerName = ko.observable('').extend({ required: { message: message } });
            }

            //For searching Customer Name
            self.searchCustomerName = function (query, process) {
                if (!$('#txtCustomerName').is('[readonly]')) {
                    self.name(null);
                    return self.commonClient.searchCustomers(query, process);
                }
            };

            /// To detect changes
            self.SetBITrackChange(self);

            self.getBITrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            self.isBIDirty = ko.computed(function () {
                var result = self.customerName();

                if (self.isNotAtLoadingTime)
                    return false;

                var returnValue = self.getBITrackChange().length > 0 ? true : false;
                self.returnValue = returnValue;
                if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
                    self.onChangesMade(returnValue);

                return returnValue;
            });

            //For Select customer name for the drop down
            self.onSelectCustomerName = function (that, event) {
                that.id(event.obj.ID);
                that.customerName(event.obj.CompanyName);
                that.customerId(event.obj.ID);
                that.contactName = event.obj.ContactName;

                that.name(event.obj);

                if (self.customerSelectionChange && typeof (self.customerSelectionChange) === 'function')
                    self.customerSelectionChange(event.obj.UserName, event.obj.AgencyName, event.obj.CompanyId, event.obj.UserID);
            };

            self.customClass = ko.computed(function () {
                return self.isCustomCss() === true ? "vendorbilltextbox requiredFieldBgColor" : "";
            });

            self.customerName.subscribe(function () {
                if (self.customerName() === '' || self.customerName() === undefined || self.customerName() === null) {
                    if (typeof (isCustomernameBlankCallBack) !== 'undefined')
                        self.isCustomernameBlankCallBack(false);
                }
            });
        }
        //#endregion
        //#region Internal Methods
        //To validate the customer Name
        SearchCustomerAutoComplete.prototype.vaildateSearchCustomerNameControl = function () {
            var self = this;
            if (!refSystem.isObject(self.name())) {
                self.customerName('');
                self.id(0);
            }
        };

        SearchCustomerAutoComplete.prototype.SetBITrackChange = function (self) {
            //** To detect changes for shipper address
            self.customerName.extend({ trackChange: true });
        };

        //#endregion
        SearchCustomerAutoComplete.prototype.cleanup = function () {
            var self = this;
            $('#txtCustomerName').typeahead('dispose');
        };
        return SearchCustomerAutoComplete;
    })();
    exports.SearchCustomerAutoComplete = SearchCustomerAutoComplete;
});
