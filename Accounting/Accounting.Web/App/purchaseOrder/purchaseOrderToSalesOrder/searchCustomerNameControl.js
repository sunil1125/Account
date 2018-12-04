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
define(["require", "exports", 'durandal/app', 'durandal/system', 'services/client/PurchaseOrderClient', 'services/client/CommonClient'], function(require, exports, ___app__, __refSystem__, __refPurchaseOrderClient__, __refCommonClient__) {
    //#region Import
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    var refPurchaseOrderClient = __refPurchaseOrderClient__;
    var refCommonClient = __refCommonClient__;

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
    var SearchCustomerNameControl = (function () {
        //#endregion
        //#region Constructor
        function SearchCustomerNameControl(message) {
            //#region Members
            this.customerName = null;
            this.ID = ko.observable(0);
            this.UserId = ko.observable(0);
            this.name = ko.observable();
            this.isNotAtLoadingTime = false;
            this.returnValue = false;
            this.isCustomCss = ko.observable(true);
            this.isCustomCssSO = ko.observable(false);
            this.errorWidth = ko.observable('150px');
            this.normalWidth = ko.observable('170px');
            //To set Validation is required or not
            this.isValidationRequired = ko.observable(true);
            this.isEnable = ko.observable(true);
            // client command
            this.commonClient = new refCommonClient.Common();
            this.purchaseOrderClient = new refPurchaseOrderClient.PurchaseOrderClient();
            var self = this;

            if (message == null || message.trim() == '') {
                self.customerName = ko.observable('');
            } else {
                self.customerName = ko.observable('').extend({
                    required: {
                        message: message,
                        onlyIf: function () {
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
            };

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

            //For Select Customer name for the dropdown
            self.onSelectCustomerName = function (that, event) {
                that.ID(event.obj.ID);
                that.customerName(event.obj.CompanyName);
                that.name(event.obj);
            };
        }
        //#endregion
        //#region Internal Methods
        //To validate the Customer Name
        SearchCustomerNameControl.prototype.vaildateSearchCustomerNameControl = function () {
            var self = this;
            if (!refSystem.isObject(self.name())) {
                self.customerName('');
                self.ID(0);
            }
        };

        SearchCustomerNameControl.prototype.SetBITrackChange = function (self) {
            //** To detect changes for Customer Name
            self.customerName.extend({ trackChange: true });
        };

        //#endregion
        SearchCustomerNameControl.prototype.cleanup = function () {
            var self = this;
            $('#txtCustomerName').typeahead('dispose');
            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }

            delete self;
        };
        return SearchCustomerNameControl;
    })();
    exports.SearchCustomerNameControl = SearchCustomerNameControl;
});
