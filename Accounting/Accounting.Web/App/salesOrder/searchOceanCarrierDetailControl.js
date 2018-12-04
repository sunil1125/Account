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
    * * ViewModel Class for search Ocean Carrier
    * * < / summary >
    * * <createDetails>
    * * <id>US10941 < /id> <by>Bhanu pratap</by > <date> 10 - 16 - 2014 </date >
    * * < / createDetails >
    * * <changeHistory>
    * * < / changeHistory >
    */
    var SearchOceanCarrierDetailControl = (function () {
        //#endregion
        //#region Constructor
        function SearchOceanCarrierDetailControl(message) {
            //#region Members
            this.oceanCarrierName = null;
            this.ID = ko.observable(0);
            this.customerId = ko.observable(0);
            this.selectedShipVia = ko.observable(0);
            this.name = ko.observable();
            this.isNotAtLoadingTime = false;
            this.returnValue = false;
            this.isCustomCss = ko.observable(true);
            this.isCustomCssSO = ko.observable(false);
            this.errorWidth = ko.observable('86%');
            this.normalWidth = ko.observable('91%');
            //To set Validation is required or not
            this.isValidationRequired = ko.observable(true);
            this.isEnable = ko.observable(true);
            // client commond
            this.commonClient = new refCommonClient.Common();
            this.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
            // To fill terminal address
            this.companyName = ko.observable('');
            this.contactName = ko.observable('');
            this.phone = ko.observable('');
            this.fax = ko.observable('');
            this.address1 = ko.observable('');
            this.address2 = ko.observable('');
            this.city = ko.observable('');
            this.stateCode = ko.observable('');
            this.zip = ko.observable('');
            this.checkMsgDisplay = true;
            // TO fetch Terminal hub address
            this.carrierId = ko.observable(0);
            this.shipperLocation = new refMapLocation.Models.MapLocation();
            this.consigneeLocation = new refMapLocation.Models.MapLocation();
            this.searchTerminalCompanyModel = new refSearchTerminalCompanyModel.Models.SearchTerminalCompany();
            var self = this;

            if (message == null || message.trim() == '') {
                self.oceanCarrierName = ko.observable('');
            } else {
                self.oceanCarrierName = ko.observable('').extend({
                    required: {
                        message: message,
                        onlyIf: function () {
                            return (self.isValidationRequired());
                        }
                    }
                });
            }

            //For searching Agent Name
            self.searchOceanCarrierName = function (query, process) {
                self.name(null);
                return self.salesOrderClient.searchOceanCarrierDetails(query, process);

                return null;
            };

            //To check if Msg is clicked
            self.checkMsgClick = function () {
                self.checkMsgDisplay = true;
            };

            // to Check if Msg is hidden or closed
            self.checkMsgHide = function () {
                self.checkMsgDisplay = true;
            };

            self.SetBITrackChange(self);

            self.getBITrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            self.isBIDirty = ko.computed(function () {
                var result = self.oceanCarrierName();

                if (self.isNotAtLoadingTime)
                    return false;

                var returnValue = self.getBITrackChange().length > 0 ? true : false;
                self.returnValue = returnValue;
                if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
                    self.onChangesMade(returnValue);

                return returnValue;
            });

            //For Select Ocean Carrier name for the dropdown
            self.onSelectOceanCarrierName = function (that, event) {
                that.ID(event.obj.CarrierId);
                that.oceanCarrierName(event.obj.CarrierName);
                that.name(event.obj);

                //To fetch terminal hub address
                self.searchTerminalCompanyModel.ShipperCountryCode = self.shipperLocation.CountryCode;
                self.searchTerminalCompanyModel.ShipperStateCode = self.shipperLocation.StateCode;
                self.searchTerminalCompanyModel.ShipperCity = self.shipperLocation.City;
                self.searchTerminalCompanyModel.ShipperZip = self.shipperLocation.Zip;
                self.searchTerminalCompanyModel.ConsigneeCountryCode = self.consigneeLocation.CountryCode;
                self.searchTerminalCompanyModel.ConsigneeStateCode = self.consigneeLocation.StateCode;
                self.searchTerminalCompanyModel.ConsigneeCity = self.consigneeLocation.City;
                self.searchTerminalCompanyModel.ConsigneeZip = self.consigneeLocation.Zip;
                self.searchTerminalCompanyModel.CarrierId = event.obj.CarrierId;

                if (self.shipperLocation.Zip.length > 0 && self.consigneeLocation.Zip.length > 0) {
                    var successCallBack = function (data) {
                        if (data !== undefined && data !== null && data.length > 0) {
                            that.companyName(data[0].CompanyName);
                            that.contactName(data[0].ContactName);
                            that.phone(data[0].PhoneNo);
                            that.fax(data[0].Fax);
                            that.address1(data[0].Street);
                            that.address2('');
                            that.city(data[0].City);
                            that.stateCode(data[0].StateCode);
                            that.zip(data[0].ZipCode);
                        } else {
                            that.companyName('');
                            that.contactName('');
                            that.phone('');
                            that.fax('');
                            that.address1('');
                            that.address2('');
                            that.city('');
                            that.stateCode('');
                            that.zip('');
                        }
                    }, faliureCallBack = function () {
                    };
                    return self.salesOrderClient.searchCompanyName(self.searchTerminalCompanyModel, successCallBack);
                }
            };
        }
        //#endregion
        //#region Internal Methods
        //To validate the Ocean Carrier Name
        SearchOceanCarrierDetailControl.prototype.vaildateSearchOceanNameControl = function () {
            var self = this;
            if (!refSystem.isObject(self.name())) {
                self.oceanCarrierName('');
                self.ID(0);
            }
        };

        SearchOceanCarrierDetailControl.prototype.SetBITrackChange = function (self) {
            //** To detect changes for Agent Name
            self.oceanCarrierName.extend({ trackChange: true });
        };

        SearchOceanCarrierDetailControl.prototype.cleanup = function () {
            var self = this;
            $('#txtOceanCarrierName').typeahead('dispose');
            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }
        };
        return SearchOceanCarrierDetailControl;
    })();
    exports.SearchOceanCarrierDetailControl = SearchOceanCarrierDetailControl;
});
