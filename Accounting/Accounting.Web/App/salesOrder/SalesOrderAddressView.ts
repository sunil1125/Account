/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region Refrences
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />

//#endregion

//#region Import

import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refCommonUtils = require('CommonUtils');
import refMapLocation = require('services/models/common/MapLocation');
import refSearchLocationControl = require('templates/searchLocationControl');
import refVendorBillAddress = require('services/models/vendorBill/VendorBillAddress');
import refEnums = require('services/models/common/Enums');
import refCommon = require('services/client/CommonClient');
import refAddressBookControl = require('templates/searchAddressBookAutoComplete');
import refAddressBookSearch = require('services/models/common/searchAddressBook');
import refSearchCompanyControl = require('templates/searchCompanyAutoComplete');
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
export class SalesOrderAddressViewModel {
    //#region Members

    // For Validation purpose

    errorShipperDetail: KnockoutValidationGroup;
    errorConsigneeDetail: KnockoutValidationGroup;
    errorBillToDetail: KnockoutValidationGroup;
    isValidationShown: boolean = false;

    // list of addresses
    shipmentAddress: KnockoutObservableArray<any>;

    // Flag to identify shipper or consignee or billTo
    addressType: KnockoutObservable<number>;

    //For Change Country Label with zip code
    public countryLabelShipper: KnockoutObservable<string> = ko.observable('USA');
    public countryLabelConsignee: KnockoutObservable<string> = ko.observable('USA');

    // START: DE23346
    //For Change Country Code with zip code
    public countryCodeShipper: KnockoutObservable<number> = ko.observable(0);
    public countryCodeConsignee: KnockoutObservable<number> = ko.observable(0);
    // END: DE23346
	// ###START: US26388
	public countryCodeBillTo: KnockoutObservable<number> = ko.observable(0);

	// ###END: US26388
    // call while changes occurs
    public onChangesMade: (dirty: boolean) => any;

    //## To trigger when when 'TAB' press from process details.
    isTabPress: (that, event) => void;

    //## To trigger when when 'TAB' press from reference number.
    keyListenerCallback: () => any;

    // Shipper Address
    shipperAddressId: KnockoutObservable<number> = ko.observable(0);
    shipperCompanyName: KnockoutComputed<string>;//.extend({ required: { message: "A valid Shipper Company Name is required." } });
    shipperContactPerson: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Shipper Contact Person is required." } });
    shipperPhone: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Phone Number", params: 13 } });
    shipperFax: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Fax Number", params: 13 } });
    shipperAddress1: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Address should be minimum 5 characters", params: 5 } });
    shipperAddress2: KnockoutObservable<string> = ko.observable('');
    shipperCountry: KnockoutObservable<number> = ko.observable();
    shipperCountryName: KnockoutObservable<string> = ko.observable();
    isSaveEnable: KnockoutObservable<boolean> = ko.observable(true);

    // Consignee Address
    consigneeAddressId: KnockoutObservable<number> = ko.observable(0);
    consigneeCompanyName: KnockoutComputed<string>;//.extend({ required: { message: "A valid Consignee Company Name is required." } });
    consigneeContactPerson: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Consignee Contact Person is required." } });
    consigneePhone: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Phone Number", params: 13 } });
    consigneeFax: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Fax Number", params: 13 } });
    consigneeAddress1: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Address should be minimum 5 characters", params: 5 } });
    consigneeAddress2: KnockoutObservable<string> = ko.observable('');
    consigneeCountry: KnockoutObservable<number> = ko.observable();
    consigneeCountryName: KnockoutObservable<string> = ko.observable();

    // BillTo Address
    billToAddressId: KnockoutObservable<number> = ko.observable(0);
    billToCompanyName: KnockoutComputed<string>;
    //billToCompanyName: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Bill To Company Name is required." } });
    billToPhone: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Phone Number", params: 13 } });
    billToFax: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Please Enter 10 digit Fax Number", params: 13 } });
    billToAddress1: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Address should be minimum 5 characters", params: 5 } });
    billToAddress2: KnockoutObservable<string> = ko.observable('');
    billToCountry: KnockoutObservable<number> = ko.observable();
    // Notes field for bill to address
    processDetails: KnockoutObservable<string> = ko.observable('');

    //#region For autocomplete view for searching shipper, consignee and bill to zip's

    shipperLocation: refSearchLocationControl.SearchLocationControl;
    consigneeLocation: refSearchLocationControl.SearchLocationControl;
    billToLocation: refSearchLocationControl.SearchLocationControl;
    //location: refSearchLocationControl.SearchLocationControl
    commonMsgUtils: refCommonUtils.commonUtils;
    //#endregion

    //#region For InternationlShipment Check box
    selected: KnockoutObservable<boolean> = ko.observable(false);
    isInternationalShipmentSelected: KnockoutObservable<boolean> = ko.observable(false);
    html: KnockoutObservable<string> = ko.observable('');
    name: KnockoutObservable<string> = ko.observable('International Shipment');
    //#endregion

    countryList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
    selectedShipperCountryCode: KnockoutObservable<number> = ko.observable();
    selectedConsigneeCountryCode: KnockoutObservable<number> = ko.observable();
    selectedBillToCountryCode: KnockoutObservable<number> = ko.observable(1);

    originAndDestinationZipChanged: (originZip: string, destiantionZip: string, originZipCode?: string, destinationZipCode?: string) => any;

    // get the common client object
    commonClient: refCommon.Common = new refCommon.Common();
    // Utility class object
    CommonUtils: CommonStatic = new Utils.Common();

    //** Property to specify whether address fields are read only or not.? */
    shouldBeReadOnly: KnockoutObservable<boolean> = ko.observable(false);

    //** isCalForEdit: boolean to check whether this call is happening for entry form or edit form. */
	isCallForEdit: KnockoutObservable<boolean> = ko.observable(false);

	// ###START: US22798 
	isBillToReadOnly: KnockoutObservable<boolean> = ko.observable(false);
	// ###END: US22798 

    //## flag to disable international shipment  checkbox if bill status is cleared.
    isBillStatusCleared: KnockoutObservable<boolean> = ko.observable(false);

    //## flag to check whether the bill is suborder bill or main bill.
    isSubOrderBill: KnockoutObservable<boolean> = ko.observable(false);

    //for tracking change
    getBITrackChange: () => string[];
    isBIDirty: KnockoutComputed<boolean>;
    isNotAtLoadingTime: boolean = false;
    returnValue: boolean = false;
    public ischange: KnockoutObservable<boolean> = ko.observable(false);
    customerId: KnockoutObservable<number> = ko.observable();
    //only for Billto
    isBillToLocationDisable: KnockoutComputed<boolean>;

    // Keep the origin and destination format with country
    originFormat: string;
    destinationFormat: string;
    originZipCode: string;
    destinationZipCode: string;

    populateAddressByUser: boolean = false;

    addressBookSerachViewModel: refAddressBookControl.SearchAddressBookControl;

    billToAddressCallback: (billToAddress: IVendorBillAddress) => any;

    public callChangeInternationalShipYesShipperCountryCode: () => any;
    public callChangeInternationalShipNoShipperCountryCode: () => any;
    public callChangeInternationalShipYesConsigneeCountryCode: () => any;
    public callChangeInternationalShipNoConsigneeCountryCode: () => any;
    // For shipper and consignee auto complete
    shipperCompanySearchList: refSearchCompanyControl.SearchCompanyControl;
    consigneeCompanySearchList: refSearchCompanyControl.SearchCompanyControl;

	// ###START: US23314
	isIntraCanadaBookingAllowed: boolean = false;

	// ###END: US23314

	// ###START: US26388
	public countryLabelBillTo: KnockoutObservable<string> = ko.observable('USA');

	// ###END: US26388
    //#endregion

    disposables: Array<any> = [];

    //#region Constructor
    constructor(originAndDestiantionZipChangedCallback: (orignZip: string, destinationZip: string, orignZipCode?: string, destinationZipCode?: string) => any, keyListenerCallback: () => any) {
        var self = this;
        self.originAndDestinationZipChanged = originAndDestiantionZipChangedCallback;
        self.shipmentAddress = ko.observableArray();
        //## when user pressed 'TAB' from reference number then BOL exist then expand items else expand address view.
        self.keyListenerCallback = keyListenerCallback;
        self.shipperLocation = new refSearchLocationControl.SearchLocationControl("A valid Shipper City, State or ZIP is required", "shipperLocationControl");
		self.consigneeLocation = new refSearchLocationControl.SearchLocationControl("A valid Consignee City, State or ZIP is required", "consigneeLocationControl");

		// ###START: US23314
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
                        return !(self.consigneeLocation.cityStateZip().length <= 1 || self.consigneeLocation.cityStateZip() === '')
                    },
					message: 'A valid Consignee City, State or ZIP is required.'
                },

                // ###START: DE23346
                {
					validator: function () {
						// ###START: US23314
						if (self.isIntraCanadaBookingAllowed)
							return true;

						// ###END: US23314
                        return !(self.countryCodeShipper() === 2 && self.countryCodeConsignee() === 2)
                    },
					message: 'Intra-Canada shipments are not allowed.'
                },
                // ###END: DE23346
                {
					validator: function () {   
						// ###START: US23314
						if (self.isIntraCanadaBookingAllowed)
							return true;          
						
						// ###END: US23314           
                        return !(self.countryLabelConsignee() == "CAN" && self.countryLabelShipper() == "CAN" && self.shipperLocation.cityStateZip().length > 0 && self.consigneeLocation.cityStateZip().length > 0)
                    },
					message: 'Intra-Canada shipments are not allowed.'
                },

            ]
        });
        // ###START: US22725

        self.billToLocation = new refSearchLocationControl.SearchLocationControl("A valid Bill To City, State or ZIP is required", "billToLocationControl", () => {
            if (!self.isInternationalShipmentSelected()) {
                self.keyListenerCallback();
            }
        });

        self.commonMsgUtils = new refCommonUtils.commonUtils();
        self.addressBookSerachViewModel = new refAddressBookControl.SearchAddressBookControl("A valid Bill To Company Name is required.", (billToAddress: IVendorBillAddress) => {
            self.populateBillToAddress(billToAddress);
        }, "txtBillToCompany");

        // for shipper
        self.shipperCompanySearchList = new refSearchCompanyControl.SearchCompanyControl('A valid Shipper Company Name is required', "txtShipperCompany");
        self.consigneeCompanySearchList = new refSearchCompanyControl.SearchCompanyControl('A valid Consignee Company Name is required', "txtConsigneeCompany");

        //on shipper company select
        self.shipperCompanySearchList.onSelectCompanyName = (data, event) => {
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
			// ###START: US26388
			if (event.obj.Country === 4) {
				self.countryLabelShipper("Mexico");
			} else if (event.obj.Country === 1) {
				self.countryLabelShipper("USA");
			}

			// ###END: US26388
        };

        //on consignee company select
        self.consigneeCompanySearchList.onSelectCompanyName = (data, event) => {
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
			// ###START: US26388
			if (event.obj.Country === 4) {
				self.countryLabelConsignee("Mexico");
			} else if (event.obj.Country === 1) {
				self.countryLabelConsignee("USA");
			}

			// ###END: US26388
        };

        //#region Error Details Object
        self.callChangeInternationalShipYesConsigneeCountryCode = () => {
            $("#consigneePhone").focus();
            self.consigneePhone('');
            self.consigneeFax('');
            self.consigneeAddress1('');
            self.consigneeAddress2('');
            self.consigneeLocation.cityStateZip('');
        }

		self.callChangeInternationalShipNoConsigneeCountryCode = () => {
            var selectedCountry;
            var countryValue = '';
            selectedCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedConsigneeCountryCode(); });
            if (selectedCountry && selectedCountry.length > 0) {
                countryValue = selectedCountry[0].Value;
            }

            self.destinationFormat = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() + " " + countryValue : '';
            self.destinationZipCode = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() : '';
            self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);
        }

		self.callChangeInternationalShipYesShipperCountryCode = () => {
            $("#shipperPhoneNo").focus();
            self.shipperPhone('');
            self.shipperFax('');
            self.shipperAddress1('');
            self.shipperAddress2('');
            self.shipperLocation.cityStateZip('');
        }

		self.callChangeInternationalShipNoShipperCountryCode = () => {
            var selectedCountry;
            var countryValue = '';

            selectedCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedShipperCountryCode(); });

            if (selectedCountry && selectedCountry.length > 0) {
                countryValue = selectedCountry[0].Value;
            }

            self.originFormat = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() + " " + countryValue : '';
            self.originZipCode = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() : '';
            self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);
        }

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

        self.isBIDirty = ko.computed(() => {
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

            // If this from loading data side the return as false
            if (self.isNotAtLoadingTime)
                return false;

            var returnValue = self.getBITrackChange().length > 0 ? true : false;
            self.returnValue = returnValue;
            if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
                self.onChangesMade(returnValue);

            return returnValue;
        });

        self.disposables.push(self.isBIDirty);

        self.disposables.push(self.shipperLocation.location.subscribe((newvalue) => {
            if (self.isInternationalShipmentSelected()) {
                var selectedCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedShipperCountryCode(); });
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

            // ###START: DE23346
            if (newvalue !== null) {
                self.countryCodeShipper(newvalue.CountryCode);
            }
            // ###END: DE23346

            self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);
            if (newvalue !== null && self.CommonUtils.isNullOrEmptyOrWhiteSpaces(newvalue.Country)) {

                // ###START: DE23346
                if (newvalue.CountryCode === 2) {
                    self.countryLabelShipper("CAN");
                }
                else {
                    self.countryLabelShipper(newvalue.Country);
                }
                // ###END: DE23346
            }
            else {
                self.countryLabelShipper('USA');
            }
        }));

        self.disposables.push(self.consigneeLocation.location.subscribe((newvalue) => {
            if (self.isInternationalShipmentSelected()) {
                var selectedCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedConsigneeCountryCode(); });
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

            // ###START: DE23346
            if (newvalue !== null) {
                self.countryCodeConsignee(newvalue.CountryCode);
            }
            // ###START: DE23346

            self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);
            if (newvalue !== null && self.CommonUtils.isNullOrEmptyOrWhiteSpaces(newvalue.Country)) {

                // ###START: DE23346
                if (newvalue.CountryCode === 2) {
                    self.countryLabelConsignee("CAN");
                }
                else {
                    self.countryLabelConsignee(newvalue.Country);
                }
                // ###END: DE23346               
            }
            else {
                self.countryLabelConsignee('USA');
            }
		}));

		// ###START: US26388
		self.disposables.push(self.billToLocation.location.subscribe((newvalue) => {
			// ###START: DE23346
			if (newvalue !== null) {
				self.countryCodeBillTo(newvalue.CountryCode);
			}
			// ###START: DE23346

			self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);
			if (newvalue !== null && self.CommonUtils.isNullOrEmptyOrWhiteSpaces(newvalue.Country)) {

				// ###START: DE23346
				if (newvalue.CountryCode === 2) {
					self.countryLabelBillTo("CAN");
				}
				else {
					self.countryLabelBillTo(newvalue.Country);
				}
				// ###END: DE23346               
			}
			else {
				self.countryLabelBillTo('USA');
			}
		}));

		// ###END: US26388
        self.disposables.push(self.selectedShipperCountryCode.subscribe((newvalue) => {
            var selectedCountry;
            if (self.isCallForEdit() && self.populateAddressByUser) {
                if (newvalue !== null && newvalue !== undefined) {
                    var actionButtons: Array<IToastrActionButtonOptions> = [];
                    actionButtons.push({
                        actionButtonName: "Yes",
                        actionClick: self.callChangeInternationalShipYesShipperCountryCode
                    });

                    actionButtons.push({
                        actionButtonName: "No",
                        actionClick: self.callChangeInternationalShipNoShipperCountryCode
                    });

                    var toastrOptions: IToastrOptions = {
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
                selectedCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedShipperCountryCode(); });

                var countryValue = ''
				if (selectedCountry && selectedCountry.length > 0) {
                    countryValue = selectedCountry[0].Value;
                }

                self.originFormat = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() + " " + countryValue : '';
                self.originZipCode = self.shipperLocation.cityStateZip() ? self.shipperLocation.cityStateZip() : '';
                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);
            }
        }));

        self.disposables.push(self.selectedConsigneeCountryCode.subscribe((newvalue) => {
            var selectedCountry;
            var countryValue = '';
            if (self.isCallForEdit() && self.populateAddressByUser) {
                if (newvalue !== null && newvalue !== undefined) {
                    var actionButtons: Array<IToastrActionButtonOptions> = [];
                    actionButtons.push({
                        actionButtonName: "Yes",
                        actionClick: self.callChangeInternationalShipYesConsigneeCountryCode
                    });

                    actionButtons.push({
                        actionButtonName: "No",
                        actionClick: self.callChangeInternationalShipNoConsigneeCountryCode
                    });

                    var toastrOptions: IToastrOptions = {
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
                selectedCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedConsigneeCountryCode(); });
                if (selectedCountry && selectedCountry.length > 0) {
                    countryValue = selectedCountry[0].Value;
                }

                self.destinationFormat = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() + " " + countryValue : '';
                self.destinationZipCode = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() : '';
                self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);
            }
        }));

        var countryListLength: number = self.countryList().length;
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

            if ((charCode === 9)) { //if 'TAB' press.
                self.keyListenerCallback();
            }
            return true;
        }

		 self.isBillToLocationDisable = ko.computed(function () {
            if (self.isCallForEdit()) {
                return false;
            }
            else {
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
            }
            else
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
            }
            else
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

    selectOption() {
        var self = this;
        if (!self.selected()) {
            self.selected(true);
            self.isInternationalShipmentSelected(true);
            self.html('<i class="icon-ok icon-white active"></i>' + self.name());

            // for show by default country USA after selecting international shipment
            self.selectedBillToCountryCode(1);

            var selectedOCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedShipperCountryCode(); }),
                selectedDCountry = $.grep(self.countryList(), (e) => { return e.ID === self.selectedConsigneeCountryCode(); });

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
            self.destinationZipCode = self.consigneeLocation.cityStateZip() ? self.consigneeLocation.cityStateZip() : ''
			self.originAndDestinationZipChanged(self.originFormat, self.destinationFormat, self.originZipCode, self.destinationZipCode);
        }
    }

    // this function is used to convert formatted phone number.
    private formatPhoneNumber(field) {
        var phone = field();
        if (phone && phone.length >= 1) {
            phone = phone.replace(/[^0-9]/g, '');
            if (phone.length > 10) {
                phone = phone.substring(0, 10);
            }
            phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
            field(phone);
        }
    }

    // For Validate Addresses
    public validateAddresses() {
        var self = this;

        if (self.isSubOrderBill() && self.shouldBeReadOnly()) {
            return false;
        }
        else {
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
    }

    // To  populate Shipper Address
    public populateShipperAddress(shipperAddress: ISalesOrderAddress, enabled: boolean) {
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
			// ###START: US26388
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
    }

    // To  populate Consignee Address
    public populateConsigneeAddress(consigneeAddress: ISalesOrderAddress, enabled: boolean) {
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
			// ###START: US26388
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
    }

    // To  populate bill to Address
    public populateBillToAddress(billToAddress: ISalesOrderAddress) {
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
			// ###START: US26388
			if (billToAddress.Country !== 1 && billToAddress.Country !== 4 && billToAddress.Country !== undefined) {
                self.selected(false);
                self.selectOption();
                self.selectedBillToCountryCode(billToAddress.Country);
			}

			// ###END: US26388
            self.billToAddressId(billToAddress.Id);

            self.addressBookSerachViewModel.companyName(billToAddress.CompanyName);
			self.addressBookSerachViewModel.shouldBeReadOnly(!self.isCallForEdit());

			//##START: US22798
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

			//##START: US22798
			if (self.isBillToReadOnly) {
				self.billToLocation.shouldBeReadOnly(true);
			}
			//##END: US22798

            self.SetBITrackChange(self);
        }
        // This will stop detecting the changes
        self.isNotAtLoadingTime = false;
        self.billToLocation.isNotAtLoadingTime = false;
    }

    // To open the history details poop up
    public showAddressBookPopup() {
        var self = this;

        var optionControlArgs = (selectedData: IVendorBillAddress) => {
            self.populateBillToAddress(selectedData);
        };

        //Call the dialog Box functionality to open a Popup
        _app.showDialog('salesOrder/addressBookDetailsView', optionControlArgs);
    }

    //sets the tracking extension for BI required fields
    SetBITrackChange(self) {
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
    }
    //#endregion

    //#region Life Cycle Event
    public activate() {
        return true;
    }

    public cleanUp() {
        var self = this;

        delete self.isCallForEdit;
        delete self.isInternationalShipmentSelected;

        self.disposables.forEach(disposable => {
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
    }

    //#endregion
}