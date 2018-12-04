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
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'templates/searchLocationControl', 'salesOrder/searchOceanCarrierDetailControl', 'salesOrder/searchCompanyNameControl'], function(require, exports, ___router__, ___app__, __refSearchLocationControl__, __refOceanCarrierSearchControl__, __refCompanySearchControl__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    var refSearchLocationControl = __refSearchLocationControl__;
    var refOceanCarrierSearchControl = __refOceanCarrierSearchControl__;
    var refCompanySearchControl = __refCompanySearchControl__;
    

    //#endregion
    /*
    ** <summary>
    ** Sales Order Multi Leg View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US12486</id> <by>Sankesh Poojari</by> <date>12-09-2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var SalesOrderMultiLegViewModel = (function () {
        //#endregion
        //#region Constructor
        function SalesOrderMultiLegViewModel(isCallFromEdit) {
            //#region Members
            // Terminal Hub Address
            this.terminalHubAddressId = ko.observable(0);
            //terminalHubCompanyName: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Terminal Hub Company Name is required." } });
            this.terminalHubContactPerson = ko.observable('').extend({ required: { message: "A valid Terminal Hub Contact Person is required." } });
            this.terminalHubPhone = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Phone Number", params: 13 } });
            this.terminalHubFax = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Fax Number", params: 13 } });
            this.terminalHubAddress1 = ko.observable('').extend({ minLength: { message: "Address should be minimum 5 characters", params: 5 } });
            this.terminalHubAddress2 = ko.observable('');
            this.terminalHubCountry = ko.observable();
            this.groundCarriername = ko.observable('');
            this.groundProNumber = ko.observable('');
            this.groundTransitDays = ko.observable('');
            this.oceanProNumber = ko.observable('');
            this.oceanTransitDays = ko.observable('');
            this.terminalHubCompanyName = ko.observable('').extend({ required: { message: "A valid Terminal Hub Company Name is required." } });
            this.terminalHubCityStateZip = ko.observable('').extend({ required: { message: "A valid Terminal Hub City State Zip is required." } });
            //#region For Same As Ground Check box
            this.selected = ko.observable(false);
            this.html = ko.observable('');
            this.name = ko.observable('Same As Ground');
            //identify call from Edit
            this.isCallFromEdit = ko.observable(true);
            this.disableCheckButton = ko.observable(true);
            // test box width with error and without error
            this.errorWidth = ko.observable('89%');
            this.normalWidth = ko.observable('93%');
            this.isNotAtLoadingTime = false;
            this.returnValue1 = false;
            var self = this;
            self.isCallFromEdit(isCallFromEdit);
            self.disableCheckButton(!isCallFromEdit);
            self.terminalHubLocation = new refSearchLocationControl.SearchLocationControl("A valid Terminal Hub City, State or ZIP is required", "txtmultilegLocationControl");
            self.oceanCarrierSearchList = new refOceanCarrierSearchControl.SearchOceanCarrierDetailControl("A valid Ocean Carrier is required.");
            self.companyNameSearchList = new refCompanySearchControl.SearchCompanyNameControl('A Valid Company Name is required');

            self.companyNameSearchList.isEnable(!isCallFromEdit);
            self.oceanCarrierSearchList.isEnable(!isCallFromEdit);

            //track changes
            self.SetBITrackChange(self);

            self.getBITrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            self.isBIDirty = ko.computed(function () {
                var result = self.oceanCarrierSearchList.oceanCarrierName();
                result = self.oceanTransitDays();
                result = self.oceanProNumber();

                // If this from loading data side the return as false
                //if (self.isNotAtLoadingTime)
                //	return false;
                var returnValue = self.getBITrackChange().length > 0 ? true : false;

                if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
                    self.onChangesMade(returnValue);

                return returnValue;
            });

            //To check if enter value is digit and decimal
            self.isNumber = function (data, event) {
                var charCode = (event.which) ? event.which : event.keyCode;

                if ((charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57))) {
                    return false;
                }
                return true;
            };

            //To check if enter value is Alpha Numeric and Space
            self.isAlphaNumericSpace = function (data, event) {
                var charCode = (event.which) ? event.which : event.keyCode;

                if ((charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122))) {
                    return false;
                }
                return true;
            };

            // To get carrier id after carrier name
            self.oceanCarrierId = ko.computed(function () {
                if (self.oceanCarrierSearchList.name() != null)
                    self.terminalHubCompanyName(self.oceanCarrierSearchList.companyName());
                self.terminalHubContactPerson(self.oceanCarrierSearchList.contactName());
                self.terminalHubPhone(self.oceanCarrierSearchList.phone());
                self.terminalHubFax(self.oceanCarrierSearchList.fax());
                self.terminalHubAddress1(self.oceanCarrierSearchList.address1());
                self.terminalHubAddress2(self.oceanCarrierSearchList.address2());
                self.terminalHubCityStateZip(self.oceanCarrierSearchList.city() + "" + self.oceanCarrierSearchList.stateCode() + "" + self.oceanCarrierSearchList.zip());
                return self.oceanCarrierSearchList.ID();

                return 0;
            });

            // to get the carrier Name after carrier
            self.oceanCarriername = ko.computed(function () {
                if (self.oceanCarrierSearchList.name() != null)
                    return self.oceanCarrierSearchList.oceanCarrierName();

                return null;
            });

            //#region Subscribe functions
            // To check value is not greater than 31
            self.oceanTransitDays.subscribe(function (newValue) {
                if (+newValue > 31)
                    self.oceanTransitDays('');
            });

            //#endregion
            //Validation
            self.errorMultilegDetail = ko.validatedObservable({
                oceanCarrierSearchList: self.oceanCarrierSearchList,
                terminalHubCompanyName: self.terminalHubCompanyName,
                terminalHubContactPerson: self.terminalHubContactPerson,
                terminalHubCityStateZip: self.terminalHubCityStateZip
            });

            return self;
        }
        //#endregion
        //#region Internal Methods
        // To assign customer id and shipvia from sales order details
        SalesOrderMultiLegViewModel.prototype.initializeMultilegDetails = function (customerId, carrierId, carrierName, selectedShipVia, shipperLocation, consigneeLocation, transitDays, pro) {
            var self = this;

            self.oceanCarrierSearchList.customerId(customerId);
            self.oceanCarrierSearchList.selectedShipVia(selectedShipVia());
            self.groundTransitDays(transitDays);
            self.groundProNumber(pro);
            self.groundCarriername(carrierName);

            if (shipperLocation !== undefined) {
                self.oceanCarrierSearchList.shipperLocation = shipperLocation;
            }
            if (consigneeLocation !== undefined) {
                self.oceanCarrierSearchList.consigneeLocation = consigneeLocation;
            }
        };

        SalesOrderMultiLegViewModel.prototype.selectOption = function () {
            var self = this;
            if (self.groundProNumber() && self.groundProNumber() !== null && self.groundProNumber() !== "") {
                if (!self.selected()) {
                    self.selected(true);
                    self.html('<i class="icon-ok icon-white active"></i>' + self.name());
                    self.oceanProNumber(self.groundProNumber());
                } else {
                    self.selected(false);
                    self.oceanProNumber('');
                    self.html('');
                }
            }
        };

        // For Validate Addresses
        SalesOrderMultiLegViewModel.prototype.validateMultilegdetails = function (isMultileg) {
            var self = this;

            if (!isMultileg) {
                self.oceanCarrierSearchList.vaildateSearchOceanNameControl();
                if (self.errorMultilegDetail.errors().length != 0) {
                    self.errorMultilegDetail.errors.showAllMessages();
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        };

        //Fill Multileg Details from EDit Details
        SalesOrderMultiLegViewModel.prototype.fillMultilegDetails = function (item, transitDays, groundCarrierName) {
            var self = this;
            self.groundCarriername(groundCarrierName);
            self.groundTransitDays(transitDays);

            if (item !== null && item[0].TerminalAddress.length > 0) {
                self.terminalHubCompanyName(item[0].TerminalAddress[0].CompanyName);
                self.terminalHubContactPerson(item[0].TerminalAddress[0].ContactPerson);
                self.terminalHubPhone(item[0].TerminalAddress[0].Phone);
                self.terminalHubFax(item[0].TerminalAddress[0].Fax);
                self.terminalHubAddress1(item[0].TerminalAddress[0].Street);
                self.terminalHubAddress2(item[0].TerminalAddress[0].Street2);
                self.terminalHubCityStateZip(item[0].TerminalAddress[0].City + " " + item[0].TerminalAddress[0].State + " " + item[0].TerminalAddress[0].ZipCode);
            }
            if (item != null && item[0].OceanCarrierDetails.length > 0) {
                self.oceanCarrierSearchList.ID(item[0].OceanCarrierDetails[0].CarrierId);
                self.oceanCarrierSearchList.oceanCarrierName(item[0].OceanCarrierDetails[0].CarrierName);

                //self.oceanTransitDays(item[0].OceanCarrierDetails[0].TransitDays);
                self.oceanTransitDays(item[0].OceanCarrierDetails[0].CalendarDays != '' ? item[0].OceanCarrierDetails[0].CalendarDays : item[0].OceanCarrierDetails[0].TransitDays);
                self.oceanProNumber(item[0].OceanCarrierDetails[0].PRONumber);
            }
        };

        //sets the tracking extension for VB required fields
        SalesOrderMultiLegViewModel.prototype.SetBITrackChange = function (self) {
            //** To detect changes for Vendor Bill
            self.oceanCarrierSearchList.oceanCarrierName.extend({ trackChange: true });
            self.oceanTransitDays.extend({ trackChange: true });
            self.oceanProNumber.extend({ trackChange: true });
        };

        SalesOrderMultiLegViewModel.prototype.cleanup = function () {
            var self = this;

            self.terminalHubContactPerson.extend({ validatable: false });
            self.terminalHubPhone.extend({ validatable: false });
            self.terminalHubFax.extend({ validatable: false });
            self.terminalHubAddress1.extend({ validatable: false });
            self.terminalHubCompanyName.extend({ validatable: false });
            self.terminalHubCityStateZip.extend({ validatable: false });

            self.terminalHubLocation.cleanup("#txtmultilegLocationControl");
            self.oceanCarrierSearchList.cleanup();
            self.companyNameSearchList.cleanup();

            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }

            delete self;
        };
        return SalesOrderMultiLegViewModel;
    })();
    exports.SalesOrderMultiLegViewModel = SalesOrderMultiLegViewModel;
});
