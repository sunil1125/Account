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
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
/// <reference path="../../Scripts/Utility.ts" />
//#endregion
define(["require", "exports", 'durandal/app', 'durandal/system', 'services/client/SalesOrderClient', 'services/client/CommonClient', 'services/models/common/MapLocation', 'services/models/salesOrder/SearchTerminalCompany', 'services/models/common/Enums'], function(require, exports, ___app__, __refSystem__, __refSalesOrderClient__, __refCommonClient__, __refMapLocation__, __refSearchTerminalCompanyModel__, __refEnums__) {
    //#region Import
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    var refSalesOrderClient = __refSalesOrderClient__;
    var refCommonClient = __refCommonClient__;
    var refMapLocation = __refMapLocation__;
    var refSearchTerminalCompanyModel = __refSearchTerminalCompanyModel__;
    var refEnums = __refEnums__;

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
    var SearchCompanyControl = (function () {
        //#endregion
        //#region Constructor
        function SearchCompanyControl(message, id) {
            //#region Members
            this.companyName = null;
            this.ID = ko.observable(0);
            this.customerId = ko.observable(0);
            this.name = ko.observable();
            this.isNotAtLoadingTime = false;
            this.returnValue = false;
            this.isCustomCss = ko.observable(true);
            this.isCustomCssSO = ko.observable(false);
            this.errorWidth = ko.observable('88.5%');
            this.normalWidth = ko.observable('93%');
            //To set Validation is required or not
            this.isValidationRequired = ko.observable(true);
            this.isEnable = ko.observable(true);
            // client commond
            this.commonClient = new refCommonClient.Common();
            this.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
            // To fill terminal address
            //companyName: KnockoutObservable<string> = ko.observable('');
            this.contactName = ko.observable('');
            this.phone = ko.observable('');
            this.fax = ko.observable('');
            this.address1 = ko.observable('');
            this.address2 = ko.observable('');
            this.city = ko.observable('');
            this.stateCode = ko.observable('');
            this.zip = ko.observable('');
            this.country = ko.observable('');
            this.checkMsgDisplay = true;
            // TO  address
            this.shipperLocation = new refMapLocation.Models.MapLocation();
            this.consigneeLocation = new refMapLocation.Models.MapLocation();
            this.id = ko.observable('');
            this.searchTerminalCompanyModel = new refSearchTerminalCompanyModel.Models.SearchTerminalCompany();
            var self = this;
            self.id(id);
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

            //For searching Company Name
            self.searchCompanyName = function (query, process) {
                self.name(null);
                if (self.customerId() !== undefined && self.customerId() && self.customerId() > 0) {
                    return self.salesOrderClient.searchAutoCompleteCompanyDetails(query, self.customerId(), process);
                } else {
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 15,
                            fadeOut: 15,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.SelectCustomer, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                    }
                    return null;
                }
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
                that.ID(event.obj.Id);
                that.companyName(event.obj.CompanyName);
                that.name(event.obj);
                that.contactName(event.obj.ContactPerson);
                that.address1(event.obj.Street);
                that.address2(event.obj.Street2);
                that.phone(event.obj.Phone);
                that.fax(event.obj.Fax);
                that.city(event.obj.City);
                that.stateCode(event.obj.State);
                that.zip(event.obj.ZipCode);
                that.country(event.obj.CountryName);
            };
        }
        //#endregion
        //#region Internal Methods
        //To validate the Ocean Carrier Name
        SearchCompanyControl.prototype.validateSearchCompanyNameControl = function () {
            var self = this;
            if (!refSystem.isObject(self.name())) {
                self.companyName('');
                self.ID(0);
            }
        };

        SearchCompanyControl.prototype.SetBITrackChange = function (self) {
            //** To detect changes for Agent Name
            self.companyName.extend({ trackChange: true });
        };

        SearchCompanyControl.prototype.cleanup = function (selector) {
            var self = this;
            $(selector).typeahead('dispose');

            for (var property in self) {
                delete self[property];
            }
        };
        return SearchCompanyControl;
    })();
    exports.SearchCompanyControl = SearchCompanyControl;
});
