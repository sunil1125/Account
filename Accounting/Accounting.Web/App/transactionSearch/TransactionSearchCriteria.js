/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'services/models/common/Enums', 'services/client/CommonClient', 'services/validations/Validations', 'templates/searchUserAutoComplete', 'templates/searchVendorNameControl', 'templates/searchCustomerAutoComplete'], function(require, exports, ___router__, ___app__, __refSystem__, __refEnums__, __refCommon__, __refValidations__, __refUserSearchControl__, __refVendorNameSearchControl__, __refCustomerSearchControl__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    var refEnums = __refEnums__;
    var refCommon = __refCommon__;
    var refValidations = __refValidations__;
    var refUserSearchControl = __refUserSearchControl__;
    var refVendorNameSearchControl = __refVendorNameSearchControl__;
    
    var refCustomerSearchControl = __refCustomerSearchControl__;

    //#endregion
    /***********************************************
    TRANSACTION SEARCH CRITERIA VIEW MODEL
    ************************************************
    ** <createDetails>
    ** <id>US12574</id><by>Satish</by> <date>11th Sep, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id><by></by> <date></date>
    ** <id>US22616</id> <by>Dhaval Tamhane</by> <date>03-06-2016</date> <description>Removed Invoice related code for Transaction Search</description>
    ** <id>DE25057   </id> <by>Janakiram</by> <date>31-11-2016</date> <description>Added required filed for truck load quote</description>
    ** </changeHistory>
    
    ***********************************************/
    var TransactionSearchCriteriaViewModel = (function () {
        // ###END:DE25057
        //#endregion
        //#region Constructor
        function TransactionSearchCriteriaViewModel(typeChaneCallBack) {
            //#region Members
            // holds the type.
            this.typeList = ko.observableArray([]);
            // holds the selected value of type.
            this.selectedtypeList = ko.observable();
            // holds the shipperCompanyName
            this.shipperCompanyName = ko.observable('');
            // holds the consigneeCompanyName
            this.consigneeCompanyName = ko.observable('');
            // holds the pro number.
            this.proNumber = ko.observable('');
            // holds the bol Number.
            this.bolNumber = ko.observable('');
            // hold the customer bol number.
            this.customerBOLNumber = ko.observable('');
            // holds the po number.
            this.poNumber = ko.observable('');
            // holds the reference number.
            this.refNumber = ko.observable('');
            // holds the shipper zip.
            this.shipperZip = ko.observable('');
            // holds the consignee zip.
            this.consigneeZip = ko.observable('');
            // holds the total pieces.
            this.totalPieces = ko.observable();
            // holds total weight.
            this.totalWeight = ko.observable();
            // holds vendor amount.
            this.amount = ko.observable();
            // holds Invoice status list.
            this.invoiceStatusList = ko.observableArray([]);
            // holds the selected value of Invoice status.
            this.selectedInvoiceStatusList = ko.observable();
            // holds shipper city.
            this.shipperCity = ko.observable('');
            // holds consignee city.
            this.consigneeCity = ko.observable('');
            // holds item numbers.
            this.itemNumberList = ko.observableArray([]);
            // holds the date range options.
            this.dateRangeOptionsList = ko.observableArray([]);
            // holds the selected date range option.
            this.dateRangeSelectedOption = ko.observable();
            // holds the order.
            this.orderStatusList = ko.observableArray([]);
            // holds the selected value of mode.
            this.selectedorderStatusList = ko.observable();
            // holds the order.
            this.modeList = ko.observableArray([]);
            // holds the selected value of mode.
            this.selectedModeList = ko.observable();
            // holds the sales rep.
            this.salesRepList = ko.observableArray([]);
            // holds the selected value of sales rep.
            this.selectedSalesRepList = ko.observable();
            // holds the truckload #.
            this.truckLoadQuoteNumber = ko.observable('');
            // isDate section disable or enable?
            this.isDateSectionVisible = ko.observable(false);
            this.fromDate = ko.observable('');
            this.toDate = ko.observable('');
            this.CommonUtils = new Utils.Common();
            this.searchType = ko.observable(0);
            this.statusHeader = ko.observable('Order Status:');
            this.isModeEnable = ko.observable(false);
            this.isInvoiceStatusEnable = ko.observable(false);
            this.isNotTruckLoadQuoteNumber = ko.observable(false);
            this.isTruckLoadQuoteNumber = ko.observable(false);
            this.commonUtils = new Utils.Common();
            var self = this;
            self.commonClient = new refCommon.Common();
            self.typeChaneCallBack = typeChaneCallBack;
            self.userSearchList = new refUserSearchControl.SearchUserAutoComplete(" ", '206px', '171px', false);
            self.vendorNameSearchList = new refVendorNameSearchControl.SearchVendorNameControl('', '206px', '171px', false);
            self.customerNameSearchList = new refCustomerSearchControl.SearchCustomerAutoComplete('', null, '206px', '171px', false);
            self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true) };

            // to get the vendorId after selecting vendor
            self.vendorId = ko.computed(function () {
                if (self.vendorNameSearchList.name() != null)
                    return self.vendorNameSearchList.ID();

                return 0;
            });

            // to get the vendor Name after selecting vendor
            self.vendorName = ko.computed(function () {
                return self.vendorNameSearchList.vendorName();
            });

            // to get the vendorId after selecting vendor
            self.customerId = ko.computed(function () {
                if (self.customerNameSearchList.name() != null)
                    return self.customerNameSearchList.id();

                return 0;
            });

            // to get the vendor Name after selecting vendor
            self.customerName = ko.computed(function () {
                return self.customerNameSearchList.customerName();
            });

            self.selectedtypeList.subscribe(function (newValue) {
                $('#multiSelect').multipleSelect("enable");
                self.searchType(newValue);
                self.typeChaneCallBack(newValue);
                self.bindStatusDropDown();

                if (newValue === refEnums.Enums.TransactionSearchType.SalesOrder.ID) {
                    self.statusHeader('Order Status:');
                    self.customerNameSearchList.isEnable(true);
                    self.userSearchList.isEnable(true);
                    self.isModeEnable(true);
                    self.isInvoiceStatusEnable(true);
                    self.isNotTruckLoadQuoteNumber(true);
                    self.isTruckLoadQuoteNumber(false);
                    self.truckLoadQuoteNumber(null);
                    self.vendorNameSearchList.isSubBillOrder(true);

                    // To show item numbers drop down text
                    $(".ms-parent").find("span").css('display', 'block');
                } else if (newValue === refEnums.Enums.TransactionSearchType.Bills.ID) {
                    self.statusHeader('Bill Status:');
                    self.resetTransactionSearchFields();
                    self.customerNameSearchList.isEnable(false);
                    self.userSearchList.isEnable(false);
                    self.isModeEnable(false);
                    self.isInvoiceStatusEnable(false);
                    self.isNotTruckLoadQuoteNumber(true);
                    self.isTruckLoadQuoteNumber(false);
                    self.vendorNameSearchList.isSubBillOrder(true);
                    $(".ms-parent").find("span").css('display', 'block');
                } else {
                    self.resetTransactionSearchFieldsForTruckLoad();
                    self.statusHeader('Bill Status:');
                    self.isModeEnable(false);
                    self.isInvoiceStatusEnable(false);
                    self.isNotTruckLoadQuoteNumber(false);
                    self.customerNameSearchList.isEnable(false);
                    self.userSearchList.isEnable(false);
                    self.isTruckLoadQuoteNumber(true);
                    self.vendorNameSearchList.isSubBillOrder(false);
                    $('#multiSelect').multipleSelect("disable");

                    // To hide item numbers drop down text
                    $(".ms-parent").find("span").css('display', 'none');
                }
            });

            // to get the userId after selecting user
            self.userId = ko.computed(function () {
                if (self.userSearchList.name() != null)
                    return self.userSearchList.id();

                return 0;
            });

            // to get the user Name after selecting user
            self.userName = ko.computed(function () {
                if (self.userSearchList.name() != null) {
                    return self.userSearchList.userName();
                }
                return null;
            });

            //#region Date Validation
            //From PickUp Date should not be grater then Today Date and required
            self.fromDate = ko.observable().extend({
                required: {
                    message: ApplicationMessages.Messages.ValidFromDateRequired
                },
                validation: {
                    validator: function () {
                        if (self.fromDate() !== "" || self.fromDate() !== undefined) {
                            var fromDate = refValidations.Validations.isValidDate(self.fromDate(), self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "FromDate");
                            if (fromDate > new Date(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy')))
                                return false;
else
                                return true;
                        } else {
                            return true;
                        }
                    },
                    message: ApplicationMessages.Messages.NotAValidDate
                }
            });

            //To Date Should not be grater then today date and not be less then from date and required
            self.toDate = ko.observable().extend({
                required: {
                    message: ApplicationMessages.Messages.ValidToDateRequired
                },
                validation: {
                    validator: function () {
                        //To Pickup date should not be grater then today date
                        var fromDate = refValidations.Validations.isValidDate(self.fromDate(), self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "FromDate");
                        var toDate = refValidations.Validations.isValidDate(self.toDate(), self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "ToDate");
                        if (toDate > (new Date(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy')))) {
                            return false;
                        } else if (toDate !== undefined && fromDate !== "") {
                            if (fromDate > toDate)
                                return false;
else
                                return true;
                            //To Pickup date should not be grater then today date
                        } else if (toDate > (new Date(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy')))) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    message: ApplicationMessages.Messages.ToValidPickUpDateNotLessThenFromDate
                }
            });

            //### START: DE25057
            self.truckLoadQuoteNumber = ko.observable().extend({
                required: {
                    onlyIf: function () {
                        return (self.selectedtypeList() === refEnums.Enums.TransactionSearchType.TruckloadQuote.ID);
                    },
                    message: ApplicationMessages.Messages.ValidTruckLoadQuoteRequired
                }
            });

            //### END: DE25057
            // validation group
            self.validationGroupTransaction = ko.validatedObservable({
                truckLoadQuoteNumber: self.truckLoadQuoteNumber
            });

            if (refSystem.isObject(refEnums.Enums.DateRange)) {
                self.dateRangeOptionsList.removeAll();
                for (var item in refEnums.Enums.DateRange) {
                    self.dateRangeOptionsList.push(refEnums.Enums.DateRange[item]);
                }
            }

            // Load all shipment types if not loaded already
            var itemNumberList = self.itemNumberList().length;
            if (!(itemNumberList)) {
                _app.trigger("GetItemsTypes", function (items) {
                    self.itemNumberList.removeAll();
                    self.itemNumberList.push.apply(self.itemNumberList, items);
                });
            }

            self.bindStatusDropDown();

            //#end region
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

            //** To initialize the dates. */
            self.fromDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
            self.toDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));

            //** To set The date picker options. */
            self.datepickerOptions = {
                blockWeekend: true,
                blockPreviousDays: false,
                blockHolidaysDays: true,
                autoClose: true,
                placeBelowButton: false,
                endDate: new Date()
            };
            self.datepickerOptionsDelivery = {
                blockWeekend: true,
                blockPreviousDays: false,
                blockHolidaysDays: true,
                autoClose: true,
                placeBelowButton: false
            };

            //** Set the visibility of date section according to the current date range selection. */
            self.dateRangeSelectedOption.subscribe(function () {
                if (self.dateRangeSelectedOption() !== refEnums.Enums.DateRange.Custom.ID)
                    self.isDateSectionVisible(false);
else
                    self.isDateSectionVisible(true);
            });

            return self;
        }
        //#endregion
        //#region Internal Methods
        //reset all the fields of Transaction Search
        TransactionSearchCriteriaViewModel.prototype.resetTransactionSearchFields = function () {
            var self = this;
            self.selectedModeList(-1);
            self.userSearchList.userName('');
            self.customerNameSearchList.customerName('');
            self.selectedInvoiceStatusList(-1);
            self.truckLoadQuoteNumber(null);
        };

        //reset all the fields of Transaction Search
        TransactionSearchCriteriaViewModel.prototype.resetTransactionSearchFieldsForTruckLoad = function () {
            var self = this;
            self.selectedModeList(-1);
            self.userSearchList.userName('');
            self.customerNameSearchList.customerName('');
            self.selectedInvoiceStatusList(-1);
            self.amount(null);
            self.selectedorderStatusList(-1);
            self.bolNumber('');
            self.shipperCompanyName('');
            self.consigneeCompanyName('');
            self.vendorNameSearchList.vendorName('');
            self.poNumber('');
            self.shipperCity('');
            self.consigneeCity('');
            self.dateRangeSelectedOption(0);
            self.shipperZip('');
            self.consigneeZip('');
            self.customerBOLNumber('');
            self.proNumber('');
            self.refNumber('');
            self.totalWeight(null);
            self.totalPieces(null);
        };

        TransactionSearchCriteriaViewModel.prototype.bindStatusDropDown = function () {
            var self = this;

            // Load all shipment types if not loaded already
            var typesLength = self.typeList().length;
            _app.trigger("GetStatusListForTransactionSearch", function (items) {
                self.typeList.removeAll();
                self.typeList.push.apply(self.typeList, items.TransactionSearchType);

                // bind order status list
                self.selectedorderStatusList(-1);
                self.orderStatusList.removeAll();
                if (self.searchType() === refEnums.Enums.TransactionSearchType.SalesOrder.ID) {
                    self.orderStatusList.push.apply(self.orderStatusList, items.OrderStatus);
                } else {
                    self.orderStatusList.push.apply(self.orderStatusList, items.VendorBillStatus);
                }

                // bind carrier service type list
                self.modeList.removeAll();
                self.modeList.push.apply(self.modeList, items.CarrierServiceType);

                // bind invoice status list
                self.invoiceStatusList.removeAll();
                self.invoiceStatusList.push.apply(self.invoiceStatusList, items.InvoiceStatus);
            });
        };

        //#region if user any numeric  date  without any format
        TransactionSearchCriteriaViewModel.prototype.convertToDate = function () {
            var self = this;
            if (!self.toDate().match('/') && self.toDate().length > 0) {
                self.toDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.toDate()));
            }
        };

        TransactionSearchCriteriaViewModel.prototype.convertFromDate = function () {
            var self = this;
            if (!self.fromDate().match('/') && self.fromDate().length > 0) {
                self.fromDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.fromDate()));
            }
        };

        //#endregion
        //#endregion
        //#region Life Cycle Event
        TransactionSearchCriteriaViewModel.prototype.activate = function () {
            return true;
        };

        // Gets the all needed values like ENUMs
        TransactionSearchCriteriaViewModel.prototype.beforeBind = function () {
            var self = this;
        };

        TransactionSearchCriteriaViewModel.prototype.compositionComplete = function () {
            var self = this;
            $('#multiSelect').multipleSelect();

            if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.selectedItemNumberList) && self.selectedItemNumberList != "" && typeof (self.selectedItemNumberList) != "undefined") {
                var split = [];
                split = self.selectedItemNumberList.split(",");
                split.pop();
                var numberArray = [];
                $.each(split, function (key, value) {
                    numberArray.push(parseInt(value));
                });
                $("#multiSelect").multipleSelect("setSelects", numberArray);
            }

            $('#drpTypeList').focus();
        };

        //#endregion
        TransactionSearchCriteriaViewModel.prototype.cleanup = function () {
            var self = this;

            self.userSearchList.cleanup();
            self.vendorNameSearchList.cleanUp();
            self.customerNameSearchList.cleanup();
        };
        return TransactionSearchCriteriaViewModel;
    })();
    exports.TransactionSearchCriteriaViewModel = TransactionSearchCriteriaViewModel;
});
