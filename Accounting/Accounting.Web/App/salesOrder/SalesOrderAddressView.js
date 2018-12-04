/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'CommonUtils', 'services/models/common/MapLocation', 'templates/searchLocationControl', 'services/models/vendorBill/VendorBillAddress', 'services/models/common/Enums', 'services/client/CommonClient', 'templates/searchAddressBookAutoComplete', 'templates/searchCompanyAutoComplete'], function(require, exports, ___router__, ___app__, __refSystem__, __refCommonUtils__, __refMapLocation__, __refSearchLocationControl__, __refVendorBillAddress__, __refEnums__, __refCommon__, __refAddressBookControl__, __refSearchCompanyControl__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    var refCommonUtils = __refCommonUtils__;
    var refMapLocation = __refMapLocation__;
    var refSearchLocationControl = __refSearchLocationControl__;
    var refVendorBillAddress = __refVendorBillAddress__;
    var refEnums = __refEnums__;
    var refCommon = __refCommon__;
    var refAddressBookControl = __refAddressBookControl__;
    
    var refSearchCompanyControl = __refSearchCompanyControl__;

    //#endregion
    ko.validation.configure({
        decorateElement: true,
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        messageTemplate: null
    });

    /***********************************************
    SALES ORDER ADDRESS VIEW MODEL
    ************************************************
    ** <summary>
    ** Sales Order Address View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US12210</id><by>Satish</by><date>28th Aug, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id>US22725</id><by>Janakiram</by><date>16-06-2016</date><description>Validating sales order that is intra Canada or edit a rated/manual sales order into an intra Canada shipment. </description>
    ** <id>DE23346</id><by>Janakiram</by><date>23-06-2016</date><description>Displaying CAN if country contains Canada and comapring Canada using CountryCode. </description>
    ** <id>US23314</id><by>Baldev Singh Thakur</by><date>05-07-2016</date><description>[Accounting] Control the intra Canada shipments booking/editing abilities through a switch.</description>
    ** <id>US26388</id> <by>Baldev Singh Thakur</by> <date>17-01-2017</date> <description>Added logic for not to check International Shipment if Mexico zip is selected.</description>
    ** </changeHistory>
    ***********************************************/
    var SalesOrderAddressViewModel = (function () {
        //#region Constructor
        function SalesOrderAddressViewModel(originAndDestiantionZipChangedCallback, keyListenerCallback) {
            this.isValidationShown = false;
            //For Change Country Label with zip code
            this.countryLabelShipper = ko.observable('USA');
            this.countryLabelConsignee = ko.observable('USA');
            // START: DE23346
            //For Change Country Code with zip code
            this.countryCodeShipper = ko.observable(0);
            this.countryCodeConsignee = ko.observable(0);
            // END: DE23346
            // ###START: US26388
            this.countryCodeBillTo = ko.observable(0);
            // Shipper Address
            this.shipperAddressId = ko.observable(0);
            this.shipperContactPerson = ko.observable('').extend({ required: { message: "A valid Shipper Contact Person is required." } });
            this.shipperPhone = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Phone Number", params: 13 } });
            this.shipperFax = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Fax Number", params: 13 } });
            this.shipperAddress1 = ko.observable('').extend({ minLength: { message: "Address should be minimum 5 characters", params: 5 } });
            this.shipperAddress2 = ko.observable('');
            this.shipperCountry = ko.observable();
            this.shipperCountryName = ko.observable();
            this.isSaveEnable = ko.observable(true);
            // Consignee Address
            this.consigneeAddressId = ko.observable(0);
            this.consigneeContactPerson = ko.observable('').extend({ required: { message: "A valid Consignee Contact Person is required." } });
            this.consigneePhone = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Phone Number", params: 13 } });
            this.consigneeFax = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Fax Number", params: 13 } });
            this.consigneeAddress1 = ko.observable('').extend({ minLength: { message: "Address should be minimum 5 characters", params: 5 } });
            this.consigneeAddress2 = ko.observable('');
            this.consigneeCountry = ko.observable();
            this.consigneeCountryName = ko.observable();
            // BillTo Address
            this.billToAddressId = ko.observable(0);
            //billToCompanyName: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Bill To Company Name is required." } });
            this.billToPhone = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Phone Number", params: 13 } });
            this.billToFax = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Fax Number", params: 13 } });
            this.billToAddress1 = ko.observable('').extend({ minLength: { message: "Address should be minimum 5 characters", params: 5 } });
            this.billToAddress2 = ko.observable('');
            this.billToCountry = ko.observable();
            // Notes field for bill to address
            this.processDetails = ko.observable('');
            //#endregion
            //#region For InternationlShipment Check box
            this.selected = ko.observable(false);
            this.isInternationalShipmentSelected = ko.observable(false);
            this.html = ko.observable('');
            this.name = ko.observable('International Shipment');
            //#endregion
            this.countryList = ko.observableArray([]);
            this.selectedShipperCountryCode = ko.observable();
            this.selectedConsigneeCountryCode = ko.observable();
            this.selectedBillToCountryCode = ko.observable(1);
            // get the common client object
            this.commonClient = new refCommon.Common();
            // Utility class object
            this.CommonUtils = new Utils.Common();
            //** Property to specify whether address fields are read only or not.? */
            this.shouldBeReadOnly = ko.observable(false);
            //** isCalForEdit: boolean to check whether this call is happening for entry form or edit form. */
            this.isCallForEdit = ko.observable(false);
            // ###START: US22798
            this.isBillToReadOnly = ko.observable(false);
            // ###END: US22798
            //## flag to disable international shipment  checkbox if bill status is cleared.
            this.isBillStatusCleared = ko.observable(false);
            //## flag to check whether the bill is suborder bill or main bill.
            this.isSubOrderBill = ko.observable(false);
            this.isNotAtLoadingTime = false;
            this.returnValue = false;
            this.ischange = ko.observable(false);
            this.customerId = ko.observable();
            this.populateAddressByUser = false;
            // ###START: US23314
            this.isIntraCanadaBookingAllowed = false;
            // ###END: US23314
            // ###START: US26388
            this.countryLabelBillTo = ko.observable('USA');
            // ###END: US26388
            //#endregion
            this.disposables = [];
            var self = this;
            self.originAndDestinationZipChanged = originAndDestiantionZipChangedCallback;
            self.shipmentAddress = ko.observableArray();

            //## when user pressed 'TAB' from reference number then BOL exist then expand items else expand address view.
            self.keyListenerCallback = keyListenerCallback;
            self.shipperLocation = new refSearchLocationControl.SearchLocationControl("A valid Shipper City, State or ZIP is required", "shipperLocationControl");
            self.consigneeLocation = new refSearchLocationControl.SearchLocationControl("A valid Consignee City, State or ZIP is required", "consigneeLocationControl");

            if (typeof Utils.Constants.IsCanadaToCanadaShipEnabled !== "undefined")
                self.isIntraCanadaBookingAllowed = (Utils.Constants.IsCanadaToCanadaShipEnabled.toLowerCase() === "true");

            // ###END: US23314
            // ###START: US22725
            self.consigneeLocation.cityStateZip = ko.observable().extend({
                required: {
                    message: 'A valid Consignee City, State or ZIP is required.'
                },
                validation: [
                    {
                        validator: function () {
                            return !(self.consigneeLocation.cityStateZip().length <= 1 || self.consigneeLocation.cityStateZip() === '');
                        },
                        message: 'A valid Consignee City, State or ZIP is required.'
                    },
                    // ###START: DE23346
                    {
                        validator: function () {
                            if (self.isIntraCanadaBookingAllowed)
                                return true;

                            // ###END: US23314
                            return !(self.countryCodeShipper() === 2 && self.countryCodeConsignee() === 2);
                        },
                        message: 'Intra-Canada shipments are not allowed.'
                    },
                    // ###END: DE23346
                    {
                        validator: function () {
                            if (self.isIntraCanadaBookingAllowed)
                                return true;

                            // ###END: US23314
                            return !(self.countryLabelConsignee() == "CAN" && self.countryLabelShipper() == "CAN" && self.shipperLocation.cityStateZip().length > 0 && self.consigneeLocation.cityStateZip().length > 0);
                        },
                        message: 'Intra-Canada shipments are not allowed.'
                    }
                ]
            });

            // ###START: US22725
            self.billToLocation = new refSearchLocationControl.SearchLocationControl("A valid Bill To City, State or ZIP is required", "billToLocationControl", function () {
                if (!self.isInternationalShipmentSelected()) {
                    self.keyListenerCallback();
                }
            });

            self.commonMsgUtils = new refCommonUtils.commonUtils();
            self.addressBookSerachViewModel = new refAddressBookControl.SearchAddressBookControl("A valid Bill To Company Name is required.", function (billToAddress) {
                self.populateBillToAddress(billToAddress);
            }, "txtBillToCompany");

            // for shipper
            self.shipperCompanySearchList = new refSearchCompanyControl.SearchCompanyControl('A valid Shipper Company Name is required', "txtShipperCompany");
            self.consigneeCompanySearchList = new refSearchCompanyControl.SearchCompanyControl('A valid Consignee Company Name is required', "txtConsigneeCompany");

            //on shipper company select
            self.shipperCompanySearchList.onSelectCompanyName = function (data, event) {
                self.shipperCompanySearchList.name(event.obj);
                self.shipperContactPerson(event.obj.ContactPerson);
                self.shipperAddress1(event.obj.Street);
                self.shipperAddress2(event.obj.Street2);
                self.shipperCountryName(event.obj.CountryName);
                self.shipperFax(event.obj.Fax);
                self.shipperPhone(event.obj.Phone);
                var cityStateZip = event.obj.City + " " + event.obj.State + " " + event.obj.ZipCode;
                self.shipperLocation.cityStateZip(cityStateZip);

                // For city state zip
                var shipperLocations = new refMapLocation.Models.MapLocation();
                shipperLocations.City = event.obj.City;
                shipperLocations.StateCode = event.obj.State;
                shipperLocations.Zip = event.obj.ZipCode;
                shipperLocations.CountryCode = event.obj.Country;
                self.shipperLocation.location(shipperLocations);

                self.originFormat = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() + " " + self.shipperCountryName() : '';
                self.originZipCode = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() : '';
                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);

                if (event.obj.Country === 4) {
                    self.countryLabelShipper("Mexico");
                } else if (event.obj.Country === 1) {
                    self.countryLabelShipper("USA");
                }
                // ###END: US26388
            };

            //on consignee company select
            self.consigneeCompanySearchList.onSelectCompanyName = function (data, event) {
                self.consigneeCompanySearchList.name(event.obj);
                self.consigneeAddress1(event.obj.Street);
                self.consigneeAddress2(event.obj.Street2);
                self.consigneeContactPerson(event.obj.ContactPerson);
                self.consigneeCountryName(event.obj.CountryName);
                self.consigneeFax(event.obj.Fax);
                self.consigneePhone(event.obj.Phone);
                var cityStateZip = event.obj.City + " " + event.obj.State + " " + event.obj.ZipCode;
                self.consigneeLocation.cityStateZip(cityStateZip);

                // For city state zip
                var ConsigneeLocations = new refMapLocation.Models.MapLocation();
                ConsigneeLocations.City = event.obj.City;
                ConsigneeLocations.StateCode = event.obj.State;
                ConsigneeLocations.Zip = event.obj.ZipCode;
                ConsigneeLocations.CountryCode = event.obj.Country;
                self.consigneeLocation.location(ConsigneeLocations);

                self.destinationFormat = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() + " " + self.consigneeCountryName() : '';
                self.destinationZipCode = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() : '';
                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);

                if (event.obj.Country === 4) {
                    self.countryLabelConsignee("Mexico");
                } else if (event.obj.Country === 1) {
                    self.countryLabelConsignee("USA");
                }
                // ###END: US26388
            };

            //#region Error Details Object
            self.callChangeInternationalShipYesConsigneeCountryCode = function () {
                $("#consigneePhone").focus();
                self.consigneePhone('');
                self.consigneeFax('');
                self.consigneeAddress1('');
                self.consigneeAddress2('');
                self.consigneeLocation.cityStateZip('');
            };

            self.callChangeInternationalShipNoConsigneeCountryCode = function () {
                var selectedCountry;
                var countryValue = '';
                selectedCountry = $.grep(self.countryList(), function (e) {
                    return e.ID === self.selectedConsigneeCountryCode();
                });
                if (selectedCountry && selectedCountry.length > 0) {
                    countryValue = selectedCountry[0].Value;
                }

                self.destinationFormat = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() + " " + countryValue : '';
                self.destinationZipCode = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() : '';
                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);
            };

            self.callChangeInternationalShipYesShipperCountryCode = function () {
                $("#shipperPhoneNo").focus();
                self.shipperPhone('');
                self.shipperFax('');
                self.shipperAddress1('');
                self.shipperAddress2('');
                self.shipperLocation.cityStateZip('');
            };

            self.callChangeInternationalShipNoShipperCountryCode = function () {
                var selectedCountry;
                var countryValue = '';

                selectedCountry = $.grep(self.countryList(), function (e) {
                    return e.ID === self.selectedShipperCountryCode();
                });

                if (selectedCountry && selectedCountry.length > 0) {
                    countryValue = selectedCountry[0].Value;
                }

                self.originFormat = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() + " " + countryValue : '';
                self.originZipCode = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() : '';
                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);
            };

            self.errorShipperDetail = ko.validatedObservable({
                shipperCompanySearchList: self.shipperCompanySearchList,
                shipperContactPerson: self.shipperContactPerson,
                shipperAddress1: self.shipperAddress1,
                shipperLocation: self.shipperLocation,
                shipperCountry: self.shipperCountry,
                shipperContactPerson: self.shipperContactPerson,
                shipperPhone: self.shipperPhone,
                shipperFax: self.shipperFax
            });

            self.errorConsigneeDetail = ko.validatedObservable({
                consigneeCompanySearchList: self.consigneeCompanySearchList,
                consigneeContactPerson: self.consigneeContactPerson,
                consigneeAddress1: self.consigneeAddress1,
                consigneeLocation: self.consigneeLocation,
                consigneeCountry: self.consigneeCountry,
                consigneeContactName: self.consigneeContactPerson,
                consigneePhone: self.consigneePhone,
                consigneeFax: self.consigneeFax
            });
            self.errorBillToDetail = ko.validatedObservable({
                addressBookSerachViewModel: self.addressBookSerachViewModel,
                billToAddress1: self.billToAddress1,
                billToLocation: self.billToLocation,
                billToCountry: self.billToCountry,
                billToPhone: self.billToPhone,
                billToFax: self.billToFax
            });

            //#endregion
            //#endregion
            self.SetBITrackChange(self);

            self.getBITrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            self.isBIDirty = ko.computed(function () {
                var result = self.shipperAddress2();
                result = self.shipperAddress1();
                result = self.shipperCompanySearchList.companyName();
                result = self.shipperContactPerson();
                result = self.shipperFax();
                result = self.shipperPhone();
                result = self.shipperLocation.cityStateZip();

                result = self.consigneeCompanySearchList.companyName();
                result = self.consigneeContactPerson();
                result = self.consigneePhone();
                result = self.consigneeFax();
                result = self.consigneeAddress1();
                result = self.consigneeAddress2();
                result = self.consigneeLocation.cityStateZip();

                //result = self.billToCompanyName();
                result = self.billToPhone();
                result = self.billToFax();
                result = self.billToAddress1();
                result = self.billToAddress2();
                result = self.billToLocation.cityStateZip();

                var result1 = self.isInternationalShipmentSelected();

                if (self.isNotAtLoadingTime)
                    return false;

                var returnValue = self.getBITrackChange().length > 0 ? true : false;
                self.returnValue = returnValue;
                if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
                    self.onChangesMade(returnValue);

                return returnValue;
            });

            self.disposables.push(self.isBIDirty);

            self.disposables.push(self.shipperLocation.location.subscribe(function (newvalue) {
                if (self.isInternationalShipmentSelected()) {
                    var selectedCountry = $.grep(self.countryList(), function (e) {
                        return e.ID === self.selectedShipperCountryCode();
                    });
                    if (selectedCountry && selectedCountry.length > 0) {
                        self.originFormat = newvalue ? newvalue.Display + " " + selectedCountry[0].Value : '';
                    } else {
                        if (newvalue !== null && newvalue !== undefined) {
                            self.originFormat = newvalue ? newvalue.Display + " " + newvalue.Country : '';
                        }
                    }
                } else {
                    if (newvalue !== null && newvalue !== undefined) {
                        self.originFormat = newvalue ? newvalue.Display + " " + newvalue.Country : '';
                    }
                }
                if (newvalue !== null && newvalue !== undefined) {
                    self.originZipCode = newvalue.Zip;
                }

                if (newvalue !== null) {
                    self.countryCodeShipper(newvalue.CountryCode);
                }

                // ###END: DE23346
                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);
                if (newvalue !== null && self.CommonUtils.isNullOrEmptyOrWhiteSpaces(newvalue.Country)) {
                    if (newvalue.CountryCode === 2) {
                        self.countryLabelShipper("CAN");
                    } else {
                        self.countryLabelShipper(newvalue.Country);
                    }
                    // ###END: DE23346
                } else {
                    self.countryLabelShipper('USA');
                }
            }));

            self.disposables.push(self.consigneeLocation.location.subscribe(function (newvalue) {
                if (self.isInternationalShipmentSelected()) {
                    var selectedCountry = $.grep(self.countryList(), function (e) {
                        return e.ID === self.selectedConsigneeCountryCode();
                    });
                    if (selectedCountry && selectedCountry.length > 0) {
                        self.destinationFormat = newvalue ? newvalue.Display + " " + selectedCountry[0].Value : '';
                    } else {
                        if (newvalue !== null && newvalue !== undefined) {
                            self.destinationFormat = newvalue ? newvalue.Display + " " + newvalue.Country : '';
                        }
                    }
                } else {
                    if (newvalue !== null && newvalue !== undefined) {
                        self.destinationFormat = newvalue ? newvalue.Display + " " + newvalue.Country : '';
                    }
                }
                if (newvalue !== null && newvalue !== undefined) {
                    self.destinationZipCode = newvalue.Zip;
                }

                if (newvalue !== null) {
                    self.countryCodeConsignee(newvalue.CountryCode);
                }

                // ###START: DE23346
                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);
                if (newvalue !== null && self.CommonUtils.isNullOrEmptyOrWhiteSpaces(newvalue.Country)) {
                    if (newvalue.CountryCode === 2) {
                        self.countryLabelConsignee("CAN");
                    } else {
                        self.countryLabelConsignee(newvalue.Country);
                    }
                    // ###END: DE23346
                } else {
                    self.countryLabelConsignee('USA');
                }
            }));

            // ###START: US26388
            self.disposables.push(self.billToLocation.location.subscribe(function (newvalue) {
                if (newvalue !== null) {
                    self.countryCodeBillTo(newvalue.CountryCode);
                }

                // ###START: DE23346
                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);
                if (newvalue !== null && self.CommonUtils.isNullOrEmptyOrWhiteSpaces(newvalue.Country)) {
                    if (newvalue.CountryCode === 2) {
                        self.countryLabelBillTo("CAN");
                    } else {
                        self.countryLabelBillTo(newvalue.Country);
                    }
                    // ###END: DE23346
                } else {
                    self.countryLabelBillTo('USA');
                }
            }));

            // ###END: US26388
            self.disposables.push(self.selectedShipperCountryCode.subscribe(function (newvalue) {
                var selectedCountry;
                if (self.isCallForEdit() && self.populateAddressByUser) {
                    if (newvalue !== null && newvalue !== undefined) {
                        var actionButtons = [];
                        actionButtons.push({
                            actionButtonName: "Yes",
                            actionClick: self.callChangeInternationalShipYesShipperCountryCode
                        });

                        actionButtons.push({
                            actionButtonName: "No",
                            actionClick: self.callChangeInternationalShipNoShipperCountryCode
                        });

                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 0,
                            fadeOut: 0,
                            typeOfAlert: "",
                            title: "",
                            actionButtons: actionButtons
                        };

                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.ChaningInternationalShipment, "warning", null, toastrOptions);
                    }
                } else {
                    selectedCountry = $.grep(self.countryList(), function (e) {
                        return e.ID === self.selectedShipperCountryCode();
                    });

                    var countryValue = '';
                    if (selectedCountry && selectedCountry.length > 0) {
                        countryValue = selectedCountry[0].Value;
                    }

                    self.originFormat = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() + " " + countryValue : '';
                    self.originZipCode = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() : '';
                    self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);
                }
            }));

            self.disposables.push(self.selectedConsigneeCountryCode.subscribe(function (newvalue) {
                var selectedCountry;
                var countryValue = '';
                if (self.isCallForEdit() && self.populateAddressByUser) {
                    if (newvalue !== null && newvalue !== undefined) {
                        var actionButtons = [];
                        actionButtons.push({
                            actionButtonName: "Yes",
                            actionClick: self.callChangeInternationalShipYesConsigneeCountryCode
                        });

                        actionButtons.push({
                            actionButtonName: "No",
                            actionClick: self.callChangeInternationalShipNoConsigneeCountryCode
                        });

                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 0,
                            fadeOut: 0,
                            typeOfAlert: "",
                            title: "",
                            actionButtons: actionButtons
                        };

                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.ChaningInternationalShipment, "warning", null, toastrOptions);
                    }
                } else {
                    selectedCountry = $.grep(self.countryList(), function (e) {
                        return e.ID === self.selectedConsigneeCountryCode();
                    });
                    if (selectedCountry && selectedCountry.length > 0) {
                        countryValue = selectedCountry[0].Value;
                    }

                    self.destinationFormat = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() + " " + countryValue : '';
                    self.destinationZipCode = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() : '';
                    self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);
                }
            }));

            var countryListLength = self.countryList().length;
            if (!countryListLength) {
                _app.trigger("GetClassTypesAndPackageTypes", function (data) {
                    if (data) {
                        self.countryList.removeAll();
                        self.countryList.push.apply(self.countryList, data['CountryNames']);
                    }
                });
            }

            //## when user pressed 'TAB' from reference number then BOL exist then expand items else expand address view.
            self.isTabPress = function (data, event) {
                var charCode = (event.which) ? event.which : event.keyCode;

                if ((charCode === 9)) {
                    self.keyListenerCallback();
                }
                return true;
            };

            self.isBillToLocationDisable = ko.computed(function () {
                if (self.isCallForEdit()) {
                    return false;
                } else {
                    if (self.isInternationalShipmentSelected())
                        return true;
else
                        return false;
                }
            });

            self.disposables.push(self.isBillToLocationDisable);

            // to get the vendor Name after selecting vendor
            self.billToCompanyName = ko.computed(function () {
                if (self.addressBookSerachViewModel.name() != null)
                    return self.addressBookSerachViewModel.companyName();

                return null;
            });

            self.disposables.push(self.billToCompanyName);

            // to get the Shipper company name after selecting company
            self.shipperCompanyName = ko.computed(function () {
                if (self.shipperCompanySearchList.name() !== null && self.shipperCompanySearchList.name() !== undefined) {
                    return self.shipperCompanySearchList.companyName();
                } else
                    var companyDetails = new refVendorBillAddress.Models.VendorBillAddress();
                if (refSystem.isObject(self.shipperCompanyName) && self.shipperCompanyName() !== undefined) {
                    companyDetails.CompanyName = self.shipperCompanyName();
                }
                self.shipperCompanySearchList.name(companyDetails);
                return self.shipperCompanySearchList.companyName();

                return null;
            });

            self.disposables.push(self.shipperCompanyName);

            // to get the Consignee company name after selecting company
            self.consigneeCompanyName = ko.computed(function () {
                if (self.consigneeCompanySearchList.name() !== null) {
                    return self.consigneeCompanySearchList.companyName();
                } else
                    var companyDetails = new refVendorBillAddress.Models.VendorBillAddress();
                if (refSystem.isObject(self.consigneeCompanyName) && self.consigneeCompanyName() !== undefined) {
                    companyDetails.CompanyName = self.consigneeCompanyName();
                }

                self.consigneeCompanySearchList.name(companyDetails);
                return self.consigneeCompanySearchList.companyName();

                return null;
            });

            self.disposables.push(self.consigneeCompanyName);
        }
        //#endregion
        //#region Internal Methods
        SalesOrderAddressViewModel.prototype.selectOption = function () {
            var self = this;
            if (!self.selected()) {
                self.selected(true);
                self.isInternationalShipmentSelected(true);
                self.html('<i class="icon-ok icon-white active"></i>' + self.name());

                // for show by default country USA after selecting international shipment
                self.selectedBillToCountryCode(1);

                var selectedOCountry = $.grep(self.countryList(), function (e) {
                    return e.ID === self.selectedShipperCountryCode();
                }), selectedDCountry = $.grep(self.countryList(), function (e) {
                    return e.ID === self.selectedConsigneeCountryCode();
                });

                if (selectedOCountry && selectedOCountry.length > 0)
                    self.originFormat = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() + " " + selectedOCountry[0].Value : '';
                self.originZipCode = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() : '';
                if (selectedDCountry && selectedDCountry.length > 0)
                    self.destinationFormat = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() + " " + selectedDCountry[0].Value : '';
                self.destinationZipCode = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() : '';

                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);
            } else {
                self.selected(false);
                self.isInternationalShipmentSelected(false);
                self.html('');
                self.originFormat = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() + " " + self.shipperLocation.country() : '';
                self.originZipCode = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() : '';
                self.destinationFormat = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() + " " + self.consigneeLocation.country() : '';
                self.destinationZipCode = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() : '';
                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);
            }
        };

        // this function is used to convert formatted phone number.
        SalesOrderAddressViewModel.prototype.formatPhoneNumber = function (field) {
            var phone = field();
            if (phone && phone.length >= 1) {
                phone = phone.replace(/[^0-9]/g, '');
                if (phone.length > 10) {
                    phone = phone.substring(0, 10);
                }
                phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
                field(phone);
            }
        };

        // For Validate Addresses
        SalesOrderAddressViewModel.prototype.validateAddresses = function () {
            var self = this;

            if (self.isSubOrderBill() && self.shouldBeReadOnly()) {
                return false;
            } else {
                self.shipperLocation.validateAndDisplay();
                self.consigneeLocation.validateAndDisplay();
                self.billToLocation.validateAndDisplay();
                self.shipperCompanySearchList.validateSearchCompanyNameControl();
                self.shipperCompanySearchList.validateSearchCompanyNameControl();
                self.addressBookSerachViewModel.vaildateSearchVendorNameControl();
                if (self.errorShipperDetail.errors().length != 0 || self.errorConsigneeDetail.errors().length != 0 || self.errorBillToDetail.errors().length != 0) {
                    self.errorShipperDetail.errors.showAllMessages();
                    self.errorConsigneeDetail.errors.showAllMessages();
                    self.errorBillToDetail.errors.showAllMessages();
                    return true;
                } else {
                    return false;
                }
            }
        };

        // To  populate Shipper Address
        SalesOrderAddressViewModel.prototype.populateShipperAddress = function (shipperAddress, enabled) {
            var self = this;
            var city = "", address = "", state = "", zip = "";

            // This will prevent to detect the changes at first time
            self.isNotAtLoadingTime = true;
            self.shipperLocation.isNotAtLoadingTime = true;
            if (shipperAddress != null) {
                var location = new refMapLocation.Models.MapLocation();
                location.City = shipperAddress.City;
                location.Zip = shipperAddress.ZipCode;
                location.StateCode = shipperAddress.State;
                location.Country = shipperAddress.CountryName;
                location.CountryCode = shipperAddress.Country;

                if (shipperAddress.Country !== 1 && shipperAddress.Country !== 4 && shipperAddress.Country !== 2) {
                    self.selected(false);
                    self.selectOption();
                }

                // ###END: US26388
                self.selectedShipperCountryCode(shipperAddress.Country);
                self.shipperAddressId(shipperAddress.Id);
                self.shipperCompanySearchList.companyName(shipperAddress.CompanyName);
                self.shipperAddress1(shipperAddress.Street);
                self.shipperAddress2(shipperAddress.Street2);
                self.shipperLocation.location(location);
                city = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(shipperAddress.City) ? shipperAddress.City + ", " : "";
                state = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(shipperAddress.State) ? shipperAddress.State + " " : "";
                zip = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(shipperAddress.ZipCode) ? shipperAddress.ZipCode + " " : "";
                address = city + state + zip;
                self.shipperLocation.cityStateZip(address !== null && address !== undefined ? address.trim() : '');
                self.shipperCountry(shipperAddress.Country);
                self.shipperPhone(self.CommonUtils.USAPhoneFormat(shipperAddress.Phone));
                self.shipperFax(self.CommonUtils.USAPhoneFormat(shipperAddress.Fax));
                self.shipperContactPerson(shipperAddress.ContactPerson);
                self.shipperLocation.shouldBeReadOnly(self.shouldBeReadOnly());
                self.originFormat = self.shipperLocation.cityStateZip() + " " + shipperAddress.CountryName;
                self.originZipCode = zip;
                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);

                self.isSaveEnable(enabled);
                self.shipperCompanySearchList.isEnable(enabled);
                self.shipperLocation.shouldBeReadOnly(!enabled);
                self.SetBITrackChange(self);
            }

            // This will stop detecting the changes
            self.isNotAtLoadingTime = false;
            self.shipperLocation.isNotAtLoadingTime = false;
        };

        // To  populate Consignee Address
        SalesOrderAddressViewModel.prototype.populateConsigneeAddress = function (consigneeAddress, enabled) {
            var self = this;
            var city = "", address = "", state = "", zip = "";

            // This will prevent to detect the changes at first time
            self.isNotAtLoadingTime = true;
            self.consigneeLocation.isNotAtLoadingTime = true;
            if (consigneeAddress != null) {
                var location = new refMapLocation.Models.MapLocation();
                location.City = consigneeAddress.City;
                location.Zip = consigneeAddress.ZipCode;
                location.StateCode = consigneeAddress.State;
                location.Country = consigneeAddress.CountryName;
                location.CountryCode = consigneeAddress.Country;

                if (consigneeAddress.Country !== 1 && consigneeAddress.Country !== 4 && consigneeAddress.Country !== 2) {
                    self.selected(false);
                    self.selectOption();
                }

                // ###END: US26388
                self.selectedConsigneeCountryCode(consigneeAddress.Country);
                self.consigneeAddressId(consigneeAddress.Id);
                self.consigneeCompanySearchList.companyName(consigneeAddress.CompanyName);
                self.consigneeAddress1(consigneeAddress.Street);
                self.consigneeAddress2(consigneeAddress.Street2);
                self.consigneeLocation.location(location);
                city = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(consigneeAddress.City) ? consigneeAddress.City + ", " : "";
                state = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(consigneeAddress.State) ? consigneeAddress.State + " " : "";
                zip = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(consigneeAddress.ZipCode) ? consigneeAddress.ZipCode + " " : "";
                address = city + state + zip;
                self.consigneeLocation.cityStateZip(address !== null && address !== undefined ? address.trim() : '');
                self.consigneeCountry(consigneeAddress.Country);
                self.consigneePhone(self.CommonUtils.USAPhoneFormat(consigneeAddress.Phone));
                self.consigneeFax(self.CommonUtils.USAPhoneFormat(consigneeAddress.Fax));
                self.consigneeContactPerson(consigneeAddress.ContactPerson);
                self.consigneeLocation.shouldBeReadOnly(self.shouldBeReadOnly());
                self.destinationFormat = self.consigneeLocation.cityStateZip() + " " + consigneeAddress.CountryName;
                self.destinationZipCode = zip;
                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);

                //self.consigneeLocation.isSaveEnable(enabled);
                self.addressBookSerachViewModel.shouldBeReadOnly(!enabled);
                self.shouldBeReadOnly(!enabled);
                self.consigneeCompanySearchList.isEnable(enabled);
                self.billToLocation.shouldBeReadOnly(!enabled);
                self.consigneeLocation.shouldBeReadOnly(!enabled);
                self.SetBITrackChange(self);
            }

            // This will stop detecting the changes
            self.isNotAtLoadingTime = false;
            self.consigneeLocation.isNotAtLoadingTime = false;
        };

        // To  populate bill to Address
        SalesOrderAddressViewModel.prototype.populateBillToAddress = function (billToAddress) {
            var self = this;
            var city = "", address = "", state = "", zip = "";

            // This will prevent to detect the changes at first time
            self.isNotAtLoadingTime = true;
            self.billToLocation.isNotAtLoadingTime = true;
            if (billToAddress != null) {
                var location = new refMapLocation.Models.MapLocation();
                location.City = billToAddress.City;
                location.Zip = billToAddress.ZipCode;
                location.State = billToAddress.State;
                location.CountryCode = billToAddress.Country;

                if (billToAddress.Country !== 1 && billToAddress.Country !== 4 && billToAddress.Country !== undefined) {
                    self.selected(false);
                    self.selectOption();
                    self.selectedBillToCountryCode(billToAddress.Country);
                }

                // ###END: US26388
                self.billToAddressId(billToAddress.Id);

                self.addressBookSerachViewModel.companyName(billToAddress.CompanyName);
                self.addressBookSerachViewModel.shouldBeReadOnly(!self.isCallForEdit());

                if (self.isBillToReadOnly) {
                    self.addressBookSerachViewModel.shouldBeReadOnly(true);
                }

                //##END: US22798
                self.billToAddress1(billToAddress.Street);
                self.billToAddress2(billToAddress.Street2);
                self.billToLocation.location(location);
                city = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(billToAddress.City) ? billToAddress.City + ", " : "";
                state = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(billToAddress.State) ? billToAddress.State + " " : "";
                zip = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(billToAddress.ZipCode) ? billToAddress.ZipCode + " " : "";
                address = city + state + zip;
                self.billToLocation.cityStateZip(address !== null && address !== undefined ? address.trim() : '');
                self.billToCountry(billToAddress.Country);
                self.billToPhone(self.CommonUtils.USAPhoneFormat(billToAddress.Phone));
                self.billToFax(self.CommonUtils.USAPhoneFormat(billToAddress.Fax));
                self.billToLocation.shouldBeReadOnly(!self.isCallForEdit());

                if (billToAddress.Country === 4) {
                    self.countryLabelBillTo("Mexico");
                } else if (billToAddress.Country === 1) {
                    self.countryLabelBillTo("USA");
                }

                if (self.isBillToReadOnly) {
                    self.billToLocation.shouldBeReadOnly(true);
                }

                //##END: US22798
                self.SetBITrackChange(self);
            }

            // This will stop detecting the changes
            self.isNotAtLoadingTime = false;
            self.billToLocation.isNotAtLoadingTime = false;
        };

        // To open the history details poop up
        SalesOrderAddressViewModel.prototype.showAddressBookPopup = function () {
            var self = this;

            var optionControlArgs = function (selectedData) {
                self.populateBillToAddress(selectedData);
            };

            //Call the dialog Box functionality to open a Popup
            _app.showDialog('salesOrder/addressBookDetailsView', optionControlArgs);
        };

        //sets the tracking extension for BI required fields
        SalesOrderAddressViewModel.prototype.SetBITrackChange = function (self) {
            //** To detect changes for International shipment button
            self.isInternationalShipmentSelected.extend({ trackChange: true });

            //** To detect changes for shipper address
            self.shipperCompanySearchList.companyName.extend({ trackChange: true });
            self.shipperContactPerson.extend({ trackChange: true });
            self.shipperAddress1.extend({ trackChange: true });
            self.shipperAddress2.extend({ trackChange: true });
            self.shipperCountry.extend({ trackChange: true });
            self.selectedShipperCountryCode.extend({ trackChange: true });
            self.shipperLocation.cityStateZip.extend({ trackChange: true });

            //** To detect changes for consignee address
            self.consigneeContactPerson.extend({ trackChange: true });
            self.consigneeCompanySearchList.companyName.extend({ trackChange: true });
            self.consigneeAddress1.extend({ trackChange: true });
            self.consigneeAddress2.extend({ trackChange: true });
            self.consigneeCountry.extend({ trackChange: true });
            self.selectedConsigneeCountryCode.extend({ trackChange: true });
            self.consigneeLocation.cityStateZip.extend({ trackChange: true });

            self.billToAddress1.extend({ trackChange: true });
            self.billToAddress2.extend({ trackChange: true });
            self.billToLocation.cityStateZip.extend({ trackChange: true });
        };

        //#endregion
        //#region Life Cycle Event
        SalesOrderAddressViewModel.prototype.activate = function () {
            return true;
        };

        SalesOrderAddressViewModel.prototype.cleanUp = function () {
            var self = this;

            delete self.isCallForEdit;
            delete self.isInternationalShipmentSelected;

            self.disposables.forEach(function (disposable) {
                if (disposable && typeof disposable.dispose === "function") {
                    disposable.dispose();
                } else {
                    delete disposable;
                }
            });

            //delete self.isBillToLocationDisable;
            self.shipperLocation.cleanup("#shipperLocationControl");
            self.consigneeLocation.cleanup("#consigneeLocationControl");
            self.billToLocation.cleanup("#billToLocationControl");
            self.addressBookSerachViewModel.cleanup("#txtBillToCompany");
            self.shipperCompanySearchList.cleanup("#txtShipperCompany");
            self.consigneeCompanySearchList.cleanup("#txtConsigneeCompany");

            delete self.shipperCompanySearchList.onSelectCompanyName;
            delete self.consigneeCompanySearchList.onSelectCompanyName;

            for (var property in self) {
                delete self[property];
            }
        };
        return SalesOrderAddressViewModel;
    })();
    exports.SalesOrderAddressViewModel = SalesOrderAddressViewModel;
});
