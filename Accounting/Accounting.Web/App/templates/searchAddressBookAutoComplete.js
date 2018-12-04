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
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
/// <reference path="../../Scripts/Utility.ts" />
//#endregion
define(["require", "exports", 'durandal/app', 'durandal/system', 'services/client/CommonClient', 'services/models/salesOrder/SalesOrderAddress', 'services/models/common/Enums'], function(require, exports, ___app__, __refSystem__, __refCommonClient__, __refAddress__, __refEnums__) {
    //#region Import
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    
    var refCommonClient = __refCommonClient__;
    var refAddress = __refAddress__;
    var refEnums = __refEnums__;

    //#endregion
    /***********************************************
    Search Address BOOK AUTOCOMPLETE VIEW MODEL
    ************************************************
    ** <summary>
    ** Search Address Book autocomplete view model.
    ** </summary>
    ** <createDetails>
    ** <id></id><by>Satish</by> <date>3rd Sep, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by><date></date>
    ** </changeHistory>
    
    ***********************************************/
    var SearchAddressBookControl = (function () {
        //#region Constructor
        function SearchAddressBookControl(message, billToAddressCallback, id) {
            //#region Members
            this.companyName = null;
            this.ID = ko.observable(0);
            this.name = ko.observable();
            this.isNotAtLoadingTime = false;
            this.returnValue = false;
            this.isCustomCss = ko.observable(false);
            this.errorWidth = ko.observable('89%');
            this.normalWidth = ko.observable('93%');
            this.customerId = ko.observable(0);
            this.checkMsgDisplay = true;
            this.shouldBeReadOnly = ko.observable(false);
            this.id = ko.observable('');
            //#endregion
            // client commond
            this.commonClient = new refCommonClient.Common();
            var self = this;
            self.billToAddressCallback = billToAddressCallback;
            if (message == null || message.trim() == '') {
                self.companyName = ko.observable('');
            } else {
                self.companyName = ko.observable('').extend({ required: { message: message } });
            }

            self.id(id);

            //For searching Vendor Name
            self.searchCompanyName = function (query, process) {
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    if (self.customerId() === undefined || self.customerId() === 0) {
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 15,
                            fadeOut: 15,
                            typeOfAlert: "",
                            title: ""
                        };

                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelecttheCustomerToGetBillTo, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                    }
                    return;
                } else {
                    self.name(null);
                    return self.commonClient.searchCustomerAddressBook(query, self.customerId(), process);
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

            //For Select vendor name for the dropdown
            self.onSelectCompanyName = function (that, event) {
                var BillToaddress = new refAddress.Models.SalesOrderAddress();
                that.ID(event.obj.ID);
                that.companyName(event.obj.CompanyName);
                that.name(event.obj);
                BillToaddress.CompanyName = event.obj.CompanyName;
                BillToaddress.Phone = event.obj.Phone;
                BillToaddress.Fax = event.obj.Fax;
                BillToaddress.Street = event.obj.Street;
                BillToaddress.Street2 = event.obj.Street2;
                BillToaddress.City = event.obj.City;
                BillToaddress.State = event.obj.State;
                BillToaddress.ZipCode = event.obj.ZipCode;
                BillToaddress.Country = event.obj.CountryCode;
                self.billToAddressCallback(BillToaddress);
            };

            //To check if Msg is clicked
            self.checkMsgClick = function () {
                self.checkMsgDisplay = true;
            };

            // to Check if Msg is hidden or closed
            self.checkMsgHide = function () {
                self.checkMsgDisplay = true;
            };
        }
        //#endregion
        //#region Internal Methods
        //To validate the Vendor Name
        SearchAddressBookControl.prototype.vaildateSearchVendorNameControl = function () {
            var self = this;
            if (!refSystem.isObject(self.name())) {
                self.companyName('');
                self.ID(0);
            }
        };

        SearchAddressBookControl.prototype.SetBITrackChange = function (self) {
            //** To detect changes for shipper address
            self.companyName.extend({ trackChange: true });
        };

        SearchAddressBookControl.prototype.cleanup = function (selector) {
            var self = this;
            $(selector).typeahead('dispose');
            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }
        };
        return SearchAddressBookControl;
    })();
    exports.SearchAddressBookControl = SearchAddressBookControl;
});
