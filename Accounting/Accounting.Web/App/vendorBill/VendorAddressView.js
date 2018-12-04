/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app', 'CommonUtils', 'services/models/common/MapLocation', 'templates/searchLocationControl', 'services/models/common/Enums', 'services/client/CommonClient'], function(require, exports, ___router__, ___app__, __refCommonUtils__, __refMapLocation__, __refSearchLocationControl__, __refEnums__, __refCommon__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refCommonUtils = __refCommonUtils__;
    var refMapLocation = __refMapLocation__;
    var refSearchLocationControl = __refSearchLocationControl__;
    
    var refEnums = __refEnums__;
    var refCommon = __refCommon__;

    //#endregion
    ko.validation.configure({
        decorateElement: true,
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        messageTemplate: null
    });

    /*
    ** <summary>
    ** Vendor Address View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US8214</id> <by>ACHAL RASTOGI</by> <date>04-09-2014</date>
    ** </createDetails>}
    ** <changeHistory>
    ** <id>DE20724</id> <by>Vasanthakumar</by> <date>24-11-2015</date><description>For Vendor bill to toastr showing success instead of warning</description>
    ** <id>DE21616</id> <by>Shreesha Adiga</by> <date>09-02-2016</date><description>Make bill to address editable always</description>
    ** <id>US21625</id> <by>Baldev Singh Thakur</by> <date>18-04-2016</date><description>Update the default Bill to address to new postal address of GTZ.</description>
    ** <id>DE24352</id> <by>Baldev Singh Thakur</by> <date>13-09-2016</date><description>Modified the code to enable the InternationalShipment Button in VB entry.</description>
    ** <id>US24631</id> <by>Baldev Singh Thakur</by> <date>15-09-2016</date><description>Modified the code to validate the Shipper/Consignee address1 if the bill has not moved to MAS.</description>
    ** <id>US26388</id> <by>Baldev Singh Thakur</by> <date>17-01-2017</date> <description>Added logic for not to check International Shipment if Mexico zip is selected.</description>
    ** </changeHistory>
    */
    var VendorAddressViewModel = (function () {
        // ###END: DE20533
        //#endregion
        //#region Constructor
        function VendorAddressViewModel(originAndDestiantionZipChangedCallback, keyListenerCallback) {
            this.isValidationShown = false;
            this.countryLabelShipper = ko.observable('USA');
            this.countryLabelConsignee = ko.observable('USA');
            this.countryLabelBillto = ko.observable('USA');
            // Shipper Address
            this.shipperAddressId = ko.observable(0);
            this.shipperCompanyName = ko.observable('').extend({ required: { message: "A valid Shipper Company Name is required." } });
            this.shipperContactPerson = ko.observable('');
            this.shipperPhone = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Phone Number", params: 13 } });
            this.shipperFax = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Fax Number", params: 13 } });
            // ###START: US24631
            this.shipperAddress1 = ko.observable('');
            // ###END: US24631
            this.shipperAddress2 = ko.observable('');
            this.shipperCountry = ko.observable();
            //shipperAddress2: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "Address1 is required." } });
            // Consignee Address
            this.consigneeAddressId = ko.observable(0);
            this.consigneeCompanyName = ko.observable('').extend({ required: { message: "A valid Consignee Company Name is required." } });
            this.consigneeContactPerson = ko.observable('');
            this.consigneePhone = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Phone Number", params: 13 } });
            this.consigneeFax = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Fax Number", params: 13 } });
            // ###START: US24631
            this.consigneeAddress1 = ko.observable('');
            // ###END: US24631
            this.consigneeAddress2 = ko.observable('');
            this.consigneeCountry = ko.observable();
            // BillTo Address
            this.billToAddressId = ko.observable(0);
            this.billToCompanyName = ko.observable('');
            this.billToPhone = ko.observable('');
            this.billToFax = ko.observable('');
            this.billToAddress1 = ko.observable('');
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
            this.selectedBillToCountryCode = ko.observable();
            // get the common client object
            this.commonClient = new refCommon.Common();
            // Utility class object
            this.CommonUtils = new Utils.Common();
            //** Property to specify whether address fields are read only or not.? */
            this.shouldBeReadOnly = ko.observable(false);
            //** isCalForEdit: Boolean to check whether this call is happening for entry form or edit form. */
            this.isCallForEdit = ko.observable(false);
            //## flag to disable international shipment  checkbox if bill status is cleared.
            this.isBillStatusCleared = ko.observable(false);
            //## flag to check whether the bill is suborder bill or main bill.
            this.isSubOrderBill = ko.observable(false);
            //** Property to check the bill is being opened in edit mode
            this.canEdit = ko.observable(false);
            this.isNotAtLoadingTime = false;
            this.returnValue = false;
            this.ischange = ko.observable(false);
            this.populateAddressByUser = false;
            this.disposables = [];
            var self = this;
            self.originAndDestinationZipChanged = originAndDestiantionZipChangedCallback;
            self.shipmentAddress = ko.observableArray();

            //## when user pressed 'TAB' from reference number then BOL exist then expand items else expand address view.
            self.keyListenerCallback = keyListenerCallback;
            self.shipperLocation = new refSearchLocationControl.SearchLocationControl("A valid Shipper City, State or ZIP is required", "shipperLocationCntrol");
            self.consigneeLocation = new refSearchLocationControl.SearchLocationControl("A valid Consignee City, State or ZIP is required", "consigneeLocationControl");
            self.billToLocation = new refSearchLocationControl.SearchLocationControl("A valid Bill To City, State or ZIP is required", "billTOLocationControl");
            self.commonMsgUtils = new refCommonUtils.commonUtils();
            self.populateDefaultBillToAddress();

            //#region Error Details Object
            self.errorShipperDetail = ko.validatedObservable({
                shipperCompanyName: this.shipperCompanyName,
                shipperAddress1: this.shipperAddress1,
                shipperLocation: this.shipperLocation,
                shipperCountry: this.shipperCountry,
                shipperContactPerson: this.shipperContactPerson,
                shipperPhone: this.shipperPhone,
                shipperFax: this.shipperFax
            });

            self.errorConsigneeDetail = ko.validatedObservable({
                consigneeCompanyName: this.consigneeCompanyName,
                consigneeAddress1: this.consigneeAddress1,
                consigneeLocation: this.consigneeLocation,
                consigneeCountry: this.consigneeCountry,
                consigneeContactName: this.consigneeContactPerson,
                consigneePhone: this.consigneePhone,
                consigneeFax: this.consigneeFax
            });
            self.errorBillToDetail = ko.validatedObservable({
                billToCompanyName: this.billToCompanyName,
                billToAddress1: this.billToAddress1,
                billToLocation: this.billToLocation,
                billToCountry: this.billToCountry,
                billToPhone: this.billToPhone,
                billToFax: this.billToFax
            });

            //#endregion
            //#region Validation only in  BillTo (Entry)
            self.billToCompanyName.extend({
                required: {
                    message: 'A valid Bill To Company Name is required.',
                    onlyIf: function () {
                        return (self.isCallForEdit() === false);
                    }
                }
            });
            self.billToPhone.extend({
                minLength: {
                    message: 'Please Enter 10 digit Phone Number',
                    params: 13,
                    onlyIf: function () {
                        return (self.isCallForEdit() === false);
                    }
                }
            });
            self.billToFax.extend({
                minLength: {
                    message: 'Please Enter 10 digit Fax Number',
                    params: 13,
                    onlyIf: function () {
                        return (self.isCallForEdit() === false);
                    }
                }
            });
            self.billToAddress1.extend({
                minLength: {
                    message: 'Address should be minimum 5 characters',
                    params: 5,
                    onlyIf: function () {
                        return (self.isCallForEdit() === false);
                    }
                }
            });

            //#endregion
            self.SetBITrackChange(self);

            self.getBITrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            self.isBIDirty = ko.computed(function () {
                var result = self.shipperAddress2();
                result = self.shipperAddress1();
                result = self.shipperCompanyName();
                result = self.shipperContactPerson();
                result = self.shipperFax();
                result = self.shipperPhone();
                result = self.shipperLocation.cityStateZip();

                result = self.consigneeCompanyName();
                result = self.consigneeContactPerson();
                result = self.consigneePhone();
                result = self.consigneeFax();
                result = self.consigneeAddress1();
                result = self.consigneeAddress2();
                result = self.consigneeLocation.cityStateZip();

                result = self.billToCompanyName();
                result = self.billToAddress1();
                result = self.billToAddress2();
                result = self.billToLocation.cityStateZip();
                result = self.billToPhone();
                result = self.billToFax();

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

                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat);
                if (newvalue !== null && newvalue !== undefined && self.CommonUtils.isNullOrEmptyOrWhiteSpaces(newvalue.Country)) {
                    self.countryLabelShipper(newvalue.Country);
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

                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat);
                if (newvalue !== null && newvalue !== undefined && self.CommonUtils.isNullOrEmptyOrWhiteSpaces(newvalue.Country)) {
                    self.countryLabelConsignee(newvalue.Country);
                } else {
                    self.countryLabelConsignee('USA');
                }
            }));

            self.disposables.push(self.billToLocation.location.subscribe(function (newvalue) {
                if (self.isInternationalShipmentSelected()) {
                    var selectedBillToCountry = $.grep(self.countryList(), function (e) {
                        return e.ID === self.selectedBillToCountryCode();
                    });

                    if (selectedBillToCountry && selectedBillToCountry.length > 0) {
                        self.countryLabelBillto(selectedBillToCountry[0].Value);
                    }
                }
                if (newvalue !== null && newvalue !== undefined && self.CommonUtils.isNullOrEmptyOrWhiteSpaces(newvalue.Country)) {
                    self.countryLabelBillto(newvalue.Country);
                } else {
                    self.countryLabelBillto('USA');
                }
            }));

            self.disposables.push(self.selectedShipperCountryCode.subscribe(function (newvalue) {
                var selectedCountry;
                var countryValue = '';
                if (self.canEdit() && self.populateAddressByUser) {
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
                    if (selectedCountry && selectedCountry.length > 0) {
                        countryValue = selectedCountry[0].Value;
                    }
                    self.originFormat = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() + " " + countryValue : '';
                    self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat);
                }
            }));

            self.disposables.push(self.selectedConsigneeCountryCode.subscribe(function (newvalue) {
                var selectedCountry;
                var countryValue = '';
                if (self.canEdit() && self.populateAddressByUser) {
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
                    self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat);
                }
            }));

            // ###START: DE20533
            self.disposables.push(self.selectedBillToCountryCode.subscribe(function (newvalue) {
                var selectedCountry;
                var countryValue = '';
                if (self.canEdit() && self.populateAddressByUser) {
                    if (newvalue !== null && newvalue !== undefined) {
                        var actionButtons = [];
                        actionButtons.push({
                            actionButtonName: "Yes",
                            actionClick: self.callChangeInternationalShipYesBillToCountryCode
                        });

                        actionButtons.push({
                            actionButtonName: "No",
                            actionClick: self.callChangeInternationalShipNoBillToCountryCode
                        });

                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 0,
                            fadeOut: 0,
                            typeOfAlert: "",
                            title: "",
                            actionButtons: actionButtons
                        };

                        // ###START: DE20724
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.ChangingBillToInternationalShipment, "warning", null, toastrOptions);
                        // ###END: DE20724
                    }
                } else {
                    selectedCountry = $.grep(self.countryList(), function (e) {
                        return e.ID === self.selectedBillToCountryCode();
                    });
                    if (selectedCountry && selectedCountry.length > 0) {
                        countryValue = selectedCountry[0].Value;
                    }
                }
            }));

            // ###END: DE20533
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
                    if (self.isInternationalShipmentSelected()) {
                        var selectedBillToCountry = $.grep(self.countryList(), function (e) {
                            return e.ID === self.selectedBillToCountryCode();
                        });

                        if (selectedBillToCountry && selectedBillToCountry.length > 0) {
                            self.countryLabelBillto(selectedBillToCountry[0].Value);
                        }
                        return true;
                    } else
                        return false;
                }
            });

            self.disposables.push(self.isBillToLocationDisable);

            self.callChangeInternationalShipYesConsigneeCountryCode = function () {
                $(".consigneePhoneNoFocus").focus();
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
                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat);
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
                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat);
            };

            self.callChangeInternationalShipYesShipperCountryCode = function () {
                $(".shipperPhoneNoFocus").focus();
                self.shipperPhone('');
                self.shipperFax('');
                self.shipperAddress1('');
                self.shipperAddress2('');
                self.shipperLocation.cityStateZip('');
            };

            self.callChangeInternationalShipYesBillToCountryCode = function () {
                $(".billToPhoneNoFocus").focus();
                self.billToPhone('');
                self.billToFax('');
                self.billToAddress1('');
                self.billToAddress2('');
                self.billToLocation.cityStateZip('');
            };

            self.callChangeInternationalShipNoBillToCountryCode = function () {
                var selectedCountry;
                var countryValue = '';
                selectedCountry = $.grep(self.countryList(), function (e) {
                    return e.ID === self.selectedShipperCountryCode();
                });

                if (selectedCountry && selectedCountry.length > 0) {
                    countryValue = selectedCountry[0].Value;
                }
            };

            // ###START: US24631
            self.shipperAddress1.extend({
                minLength: {
                    message: 'Address should be minimum 5 characters',
                    params: 5,
                    onlyIf: function () {
                        return !self.shouldBeReadOnly();
                    }
                }
            });

            self.consigneeAddress1.extend({
                minLength: {
                    message: 'Address should be minimum 5 characters',
                    params: 5,
                    onlyIf: function () {
                        return !self.shouldBeReadOnly();
                    }
                }
            });
            // ###END: US24631
        }
        //#endregion
        //#region Internal Methods
        VendorAddressViewModel.prototype.selectOption = function () {
            var self = this;
            if (!self.selected()) {
                self.selected(true);
                self.isInternationalShipmentSelected(true);
                self.html('<i class="icon-ok icon-white active"></i>' + self.name());

                // for show by default country USA after selecting international shipment
                //self.selectedBillToCountryCode(1);
                var selectedOCountry = $.grep(self.countryList(), function (e) {
                    return e.ID === self.selectedShipperCountryCode();
                }), selectedDCountry = $.grep(self.countryList(), function (e) {
                    return e.ID === self.selectedConsigneeCountryCode();
                });

                if (selectedOCountry && selectedOCountry.length > 0)
                    self.originFormat = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() + " " + selectedOCountry[0].Value : '';

                if (selectedDCountry && selectedDCountry.length > 0)
                    self.destinationFormat = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() + " " + selectedDCountry[0].Value : '';

                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat);
            } else {
                self.selected(false);
                self.isInternationalShipmentSelected(false);
                self.html('');
                self.originFormat = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() + " " + self.shipperLocation.country() : '';
                self.destinationFormat = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() + " " + self.consigneeLocation.country() : '';
                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat);
            }
        };

        // this function is used to convert formatted phone number.
        VendorAddressViewModel.prototype.formatPhoneNumber = function (field) {
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
        VendorAddressViewModel.prototype.validateAddresses = function () {
            var self = this;
            if (self.isSubOrderBill() && self.shouldBeReadOnly()) {
                return false;
            } else {
                self.shipperLocation.validateAndDisplay();
                self.consigneeLocation.validateAndDisplay();
                self.billToLocation.validateAndDisplay();
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
        VendorAddressViewModel.prototype.populateShipperAddress = function (shipperAddress) {
            var self = this;
            var city = "", address = "", state = "", zip = "";

            // This will prevent to detect the changes at first time
            self.isNotAtLoadingTime = true;
            self.shipperLocation.isNotAtLoadingTime = true;
            if (shipperAddress != null) {
                var location = new refMapLocation.Models.MapLocation();
                location.City = shipperAddress.City;
                location.Zip = shipperAddress.ZipCode;
                location.State = shipperAddress.State;
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
                self.shipperCompanyName(shipperAddress.CompanyName);
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
                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat);
                self.SetBITrackChange(self);
            }

            // This will stop detecting the changes
            self.isNotAtLoadingTime = false;
            self.shipperLocation.isNotAtLoadingTime = false;
        };

        // To  populate Consignee Address
        VendorAddressViewModel.prototype.populateConsigneeAddress = function (consigneeAddress) {
            var self = this;
            var city = "", address = "", state = "", zip = "";

            // This will prevent to detect the changes at first time
            self.isNotAtLoadingTime = true;
            self.consigneeLocation.isNotAtLoadingTime = true;
            if (consigneeAddress != null) {
                var location = new refMapLocation.Models.MapLocation();
                location.City = consigneeAddress.City;
                location.Zip = consigneeAddress.ZipCode;
                location.State = consigneeAddress.State;
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
                self.consigneeCompanyName(consigneeAddress.CompanyName);
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
                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat);
                self.SetBITrackChange(self);
            }

            // This will stop detecting the changes
            self.isNotAtLoadingTime = false;
            self.consigneeLocation.isNotAtLoadingTime = false;
        };

        // To  populate bill to Address
        VendorAddressViewModel.prototype.populateBillToAddress = function (billToAddress) {
            var self = this;
            var city = "", address = "", state = "", zip = "";
            if (billToAddress != null) {
                var location = new refMapLocation.Models.MapLocation();
                location.City = billToAddress.City;
                location.Zip = billToAddress.ZipCode;
                location.State = billToAddress.State;
                location.StateCode = billToAddress.State;
                location.Country = billToAddress.CountryName;
                location.CountryCode = billToAddress.Country;

                if (billToAddress.Country !== 1 && billToAddress.Country !== 4 && billToAddress.Country !== 2) {
                    self.selected(false);
                    self.selectOption();
                }

                // ###END: US26388
                self.selectedBillToCountryCode(billToAddress.Country);
                self.billToAddressId(billToAddress.Id);
                self.billToCompanyName(billToAddress.CompanyName);
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

                //##START: DE21616
                self.billToLocation.shouldBeReadOnly(false);

                //##END: DE21616
                self.SetBITrackChange(self);
            }
        };

        // ### START: US21625
        VendorAddressViewModel.prototype.populateDefaultBillToAddress = function () {
            var self = this;

            // ###START: DE24352
            self.isBillStatusCleared(true);

            // ###END: DE24352
            var location = new refMapLocation.Models.MapLocation();
            location.City = "Scottsdale";
            location.Zip = "85261";
            location.State = "AZ";
            location.StateCode = "AZ";
            self.billToCompanyName('GlobalTranz');
            self.billToAddress1('P.O. Box 6348');
            self.billToAddress2('');
            self.billToLocation.location(location);
            self.billToLocation.cityStateZip('Scottsdale, AZ 85261');
            self.billToCountry(refEnums.Enums.CountryCode.USA.ID);
            self.billToPhone('(866)275-1407)');
            self.billToFax('(602)443-5819)');
        };

        // ### END: US21625
        //sets the tracking extension for BI required fields
        VendorAddressViewModel.prototype.SetBITrackChange = function (self) {
            //** To detect changes for International shipment button
            self.isInternationalShipmentSelected.extend({ trackChange: true });

            //** To detect changes for shipper address
            self.shipperCompanyName.extend({ trackChange: true });
            self.shipperContactPerson.extend({ trackChange: true });
            self.shipperPhone.extend({ trackChange: true });
            self.shipperFax.extend({ trackChange: true });
            self.shipperAddress1.extend({ trackChange: true });
            self.shipperAddress2.extend({ trackChange: true });
            self.shipperCountry.extend({ trackChange: true });
            self.selectedShipperCountryCode.extend({ trackChange: true });
            self.shipperLocation.cityStateZip.extend({ trackChange: true });

            //** To detect changes for consignee address
            self.consigneeContactPerson.extend({ trackChange: true });
            self.consigneePhone.extend({ trackChange: true });
            self.consigneeCompanyName.extend({ trackChange: true });
            self.consigneeFax.extend({ trackChange: true });
            self.consigneeAddress1.extend({ trackChange: true });
            self.consigneeAddress2.extend({ trackChange: true });
            self.consigneeCountry.extend({ trackChange: true });
            self.selectedConsigneeCountryCode.extend({ trackChange: true });
            self.consigneeLocation.cityStateZip.extend({ trackChange: true });

            //** To detect changes for BillTo address
            self.billToCompanyName.extend({ trackChange: true });
            self.billToAddress1.extend({ trackChange: true });
            self.billToAddress2.extend({ trackChange: true });
            self.billToLocation.cityStateZip.extend({ trackChange: true });
            self.billToCountry.extend({ trackChange: true });
            self.selectedBillToCountryCode.extend({ trackChange: true });
            self.billToPhone.extend({ trackChange: true });
            self.billToFax.extend({ trackChange: true });
        };

        //#endregion
        //#endregion
        //#region Life Cycle Event
        VendorAddressViewModel.prototype.activate = function () {
            return true;
        };

        VendorAddressViewModel.prototype.cleanUp = function () {
            var self = this;
            try  {
                self.disposables.forEach(function (disposable) {
                    if (disposable && typeof disposable.dispose === "function") {
                        disposable.dispose();
                    } else {
                        delete disposable;
                    }
                });

                self.shipperLocation.cleanup("#shipperLocationCntrol");
                self.consigneeLocation.cleanup("#consigneeLocationControl");
                self.billToLocation.cleanup("#billTOLocationControl");

                self.shipperCompanyName.extend({ validatable: false });
                self.shipperPhone.extend({ validatable: false });
                self.shipperFax.extend({ validatable: false });
                self.shipperAddress1.extend({ validatable: false });

                self.consigneeCompanyName.extend({ validatable: false });
                self.consigneePhone.extend({ validatable: false });
                self.consigneeFax.extend({ validatable: false });
                self.consigneeAddress1.extend({ validatable: false });

                self.billToCompanyName.extend({ validatable: false });
                self.billToPhone.extend({ validatable: false });
                self.billToFax.extend({ validatable: false });
                self.billToAddress1.extend({ validatable: false });

                for (var prop in self) {
                    if (typeof self[prop].dispose === "function") {
                        self[prop].dispose();
                    }

                    delete self[prop];
                }

                delete self;
            } catch (e) {
            }
        };
        return VendorAddressViewModel;
    })();
    exports.VendorAddressViewModel = VendorAddressViewModel;
});
