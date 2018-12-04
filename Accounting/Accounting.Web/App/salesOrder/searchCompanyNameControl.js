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
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
//#endregion
define(["require", "exports", 'durandal/app', 'durandal/system', 'services/client/SalesOrderClient', 'services/client/CommonClient', 'services/models/common/MapLocation', 'services/models/salesOrder/SearchTerminalCompany'], function(require, exports, ___app__, __refSystem__, __refSalesOrderClient__, __refCommonClient__, __refMapLocation__, __refSearchTerminalCompanyModel__) {
    //#region Import
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    var refSalesOrderClient = __refSalesOrderClient__;
    var refCommonClient = __refCommonClient__;
    var refMapLocation = __refMapLocation__;
    var refSearchTerminalCompanyModel = __refSearchTerminalCompanyModel__;

    //#endregion
    /** <summary>
    * * ViewModel Class for search Company Name
    * * < / summary >
    * * <createDetails>
    * * <id>US10941 < /id> <by>Bhanu pratap</by > <date> 10 - 16 - 2014 </date >
    * * < / createDetails >
    * * <changeHistory>
    * * < / changeHistory >
    */
    var SearchCompanyNameControl = (function () {
        //#endregion
        //#region Constructor
        function SearchCompanyNameControl(message) {
            //#region Members
            this.companyName = null;
            this.ID = ko.observable(0);
            this.companyId = ko.observable(0);
            this.name = ko.observable();
            this.isNotAtLoadingTime = false;
            this.returnValue = false;
            this.isCustomCss = ko.observable(true);
            this.isCustomCssSO = ko.observable(false);
            this.errorWidth = ko.observable('225px');
            this.normalWidth = ko.observable('93%');
            // To fill Other Terminal address fields
            this.contactName = ko.observable('');
            this.phone = ko.observable('');
            this.fax = ko.observable('');
            this.address1 = ko.observable('');
            this.address2 = ko.observable('');
            this.city = ko.observable('');
            this.stateCode = ko.observable('');
            this.zip = ko.observable('');
            //To set Validation is required or not
            this.isValidationRequired = ko.observable(true);
            this.isEnable = ko.observable(true);
            this.shipperZip = ko.observable('');
            this.consigneeZip = ko.observable('');
            this.carrierId = ko.observable(0);
            this.shipperLocation = new refMapLocation.Models.MapLocation();
            this.consigneeLocation = new refMapLocation.Models.MapLocation();
            this.searchTerminalCompanyModel = new refSearchTerminalCompanyModel.Models.SearchTerminalCompany();
            // client command
            this.commonClient = new refCommonClient.Common();
            this.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
            var self = this;

            if (message == null || message.trim() == '') {
                self.companyName = ko.observable('');
            } else {
                self.companyName = ko.observable('').extend({
                    required: {
                        message: message,
                        onlyIf: function () {
                            return (self.isValidationRequired());
                        }
                    }
                });
            }

            //For searching Customer Name
            self.searchCompanyName = function (query, process) {
                self.name(null);

                self.searchTerminalCompanyModel.ShipperCountryCode = self.shipperLocation.CountryCode;
                self.searchTerminalCompanyModel.ShipperStateCode = self.shipperLocation.StateCode;
                self.searchTerminalCompanyModel.ShipperCity = self.shipperLocation.City;
                self.searchTerminalCompanyModel.ShipperZip = self.shipperLocation.Zip;
                self.searchTerminalCompanyModel.ConsigneeCountryCode = self.consigneeLocation.CountryCode;
                self.searchTerminalCompanyModel.ConsigneeStateCode = self.consigneeLocation.StateCode;
                self.searchTerminalCompanyModel.ConsigneeCity = self.consigneeLocation.City;
                self.searchTerminalCompanyModel.ConsigneeZip = self.consigneeLocation.Zip;
                self.searchTerminalCompanyModel.CarrierId = self.carrierId();
                self.searchTerminalCompanyModel.SearchValue = query;
                if (self.shipperLocation.Zip.length > 0 && self.consigneeLocation.Zip.length > 0) {
                    return self.salesOrderClient.searchCompanyName(self.searchTerminalCompanyModel, process);
                }
            };

            self.SetBITrackChange(self);

            self.getBITrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            self.isBIDirty = ko.computed(function () {
                var result = self.companyName();

                if (self.isNotAtLoadingTime)
                    return false;

                var returnValue = self.getBITrackChange().length > 0 ? true : false;
                self.returnValue = returnValue;
                if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
                    self.onChangesMade(returnValue);

                return returnValue;
            });

            //For Select Company name for the dropdown
            self.onSelectCompanyName = function (that, event) {
                that.ID(event.obj.ID);
                that.companyName(event.obj.CompanyName);
                that.name(event.obj);
                that.contactName(event.obj.ContactName);
                that.phone(event.obj.PhoneNo);
                that.fax(event.obj.Fax);
                that.address1(event.obj.Street);
                that.address2('');
                that.city(event.obj.City);
                that.stateCode(event.obj.StateCode);
                that.zip(event.obj.ZipCode);
            };
        }
        //#endregion
        //#region Internal Methods
        //To validate the Company Name
        SearchCompanyNameControl.prototype.vaildateSearchCompanyNameControl = function () {
            var self = this;
            if (!refSystem.isObject(self.name())) {
                self.companyName('');
                self.ID(0);
            }
        };

        SearchCompanyNameControl.prototype.SetBITrackChange = function (self) {
            //** To detect changes for Customer Name
            self.companyName.extend({ trackChange: true });
        };

        SearchCompanyNameControl.prototype.cleanup = function () {
            var self = this;
            $('#txtCompanyName').typeahead('dispose');
            for (var property in self) {
                delete self[property];
            }
        };
        return SearchCompanyNameControl;
    })();
    exports.SearchCompanyNameControl = SearchCompanyNameControl;
});
