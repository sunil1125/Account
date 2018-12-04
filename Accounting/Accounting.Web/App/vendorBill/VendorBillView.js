/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app', 'vendorBill/VendorBillOptionButtonControl', 'templates/searchVendorNameControl', 'services/client/VendorBillClient', 'services/models/common/Enums', 'services/models/common/searchVendorName', 'services/validations/Validations'], function(require, exports, ___router__, ___app__, __refVendorBillOptionButtonControl__, __refVendorNameSearchControl__, __refVendorBillClient__, __refEnums__, __refVendorNameSearch__, __refValidations__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refVendorBillOptionButtonControl = __refVendorBillOptionButtonControl__;
    var refVendorNameSearchControl = __refVendorNameSearchControl__;
    
    var refVendorBillClient = __refVendorBillClient__;
    
    var refEnums = __refEnums__;
    var refVendorNameSearch = __refVendorNameSearch__;
    var refValidations = __refValidations__;

    //#endregion
    /** <summary>
    ** Vendor Bill ViewModel
    ** </summary >
    ** <createDetails>proNumber
    ** <id>US8212 </id> <by>Sankesh Poojari</by> <date>04 - 03 - 2014 </date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US37137</id> <by>Shreesha Adiga</by> <date>13-06-2018</date><description>Add validation to BOLNumber: Allow only main BOLNumber</description>
    ** </changeHistory>
    */
    var VendorBillViewModel = (function () {
        //#endregion
        //#region Constructor
        function VendorBillViewModel(shipperAddressCallback, consigneeAddressCallback, keyListenerCallback, carrierSelectionCallback) {
            //#region Members
            // client command
            this.vendorBillClient = new refVendorBillClient.VendorBillClient();
            this.proNumber = ko.observable('').extend({ required: { message: ApplicationMessages.Messages.ValidPRORequired } });
            this.billDate = ko.observable('').extend({ required: { message: ApplicationMessages.Messages.ValidDateRequired } });
            this.originZip = ko.observable('').extend({ required: { message: ApplicationMessages.Messages.ValidOriginZIPRequired } });
            this.destinationZip = ko.observable('').extend({ required: { message: ApplicationMessages.Messages.ValidDestinationZIPRequired } });
            this.bolNumber = ko.observable('');
            this.poNumber = ko.observable('');
            this.mainBolNumber = ko.observable('');
            this.refNumber = ko.observable('');
            this.totalPieces = ko.observable();
            this.totalWeigth = ko.observable();
            this.vendorAmount = ko.observable();
            this.deliveryDate = ko.observable('');
            this.memo = ko.observable('');
            this.billStatusList = ko.observableArray([]);
            this.CommonUtils = new Utils.Common();
            this.isValidationShown = false;
            this.isBolNo = false;
            this.isProNo = false;
            this.isVendor = false;
            this.isFroceAttachChecked = false;
            this.isNotAtLoadingTime = false;
            this.returnValue1 = false;
            this.errorWidth = ko.observable('230px');
            this.normalWidth = ko.observable('250px');
            var self = this;
            var msg = null;
            self.shipperAddressCallback = shipperAddressCallback;
            self.consigneeAddressCallback = consigneeAddressCallback;
            self.carrierSelectionCallback = carrierSelectionCallback;

            //## when user pressed 'TAB' from reference number then BOL exist then expand items else expand address view.
            self.keyListenerCallback = keyListenerCallback;

            //230 to 233
            self.vendorNameSearchList = new refVendorNameSearchControl.SearchVendorNameControl("A valid Vendor Name is required.", '95%', '', true, null, function (carrierType) {
                self.carrierSelectionCallback(carrierType);
            });
            self.error = ko.validation.group(self, { deep: true });

            //#region Date Validation
            self.billDate = ko.observable().extend({
                required: {
                    message: ApplicationMessages.Messages.BillDateIsRequired
                },
                validation: {
                    validator: function () {
                        return refValidations.Validations.isValidDate(self.billDate(), self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "BillDate");
                    },
                    message: ApplicationMessages.Messages.NotAValidDate
                }
            });

            self.deliveryDate = ko.observable().extend({
                required: {
                    message: ApplicationMessages.Messages.DeliveryDateRequired
                },
                validation: {
                    validator: function () {
                        return refValidations.Validations.isValidDate(self.deliveryDate(), self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "DeliveryDate");
                    },
                    message: ApplicationMessages.Messages.NotAValidDate
                }
            });

            self.bolNumber.extend({
                number: {
                    params: true,
                    message: ApplicationMessages.Messages.SubOrderCantBeAttachedBill
                }
            });

            //#endregion
            //track changes
            self.SetBITrackChange(self);

            self.getBITrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            self.isBIDirty = ko.computed(function () {
                var result = self.proNumber();
                result = self.bolNumber();
                result = self.billDate();
                result = self.poNumber();
                result = self.refNumber();
                result = self.deliveryDate();
                result = self.vendorNameSearchList.vendorName();
                result = self.memo();

                // If this from loading data side the return as false
                //if (self.isNotAtLoadingTime)
                //	return false;
                var returnValue = self.getBITrackChange().length > 0 ? true : false;

                if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
                    self.onChangesMade(returnValue);

                return returnValue;
            });

            //to check if for the changed Vendor Pro exists
            self.vendorNameSearchList.vendorName.subscribe(function (newValue) {
                var bolNo = self.bolNumber();
                var proNo = self.proNumber();
                if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.proNumber())) {
                    if (self.vendorNameSearchList.ID() !== 0) {
                        self.vendorBillClient.searchSalesOrderByBOL(proNo, self.vendorNameSearchList.ID(), bolNo, 0, function (data) {
                            // Update the UI as for address
                            self.UpdateData(data, "VendorName");
                        });
                    }
                }
            });

            //to check if BOL exists if yes then fetch the detail
            self.bolNumber.subscribe(function (newValue) {
                if (!self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.bolNumber()) || !self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.proNumber())) {
                    self.obcvendorBillOptionList.isForceAttachChecked = false;
                    self.obcvendorBillOptionList.getOptionsById(2).selected(false);
                } else {
                    self.obcvendorBillOptionList.isForceAttachChecked = true;
                }

                if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.bolNumber())) {
                    self.bolNumber(self.bolNumber().trim());

                    if (self.bolNumber().trim() !== self.originalBolNumber) {
                        self.vendorBillClient.searchSalesOrderByBOL(self.proNumber(), self.vendorId(), newValue, 0, function (data) {
                            // Update the UI as for address
                            self.UpdateData(data, "BolNumber");
                        });
                    }
                }
            });

            //to check if BOL exists if yes then fetch the detail
            self.proNumber.subscribe(function (newValue) {
                if (!self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.bolNumber()) || !self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.proNumber())) {
                    self.obcvendorBillOptionList.isForceAttachChecked = false;
                    self.obcvendorBillOptionList.getOptionsById(2).selected(false);
                } else {
                    self.obcvendorBillOptionList.isForceAttachChecked = true;
                }

                var bolNo = self.bolNumber();
                if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.proNumber())) {
                    if (self.proNumber().trim() !== "") {
                        if (self.proNumber().trim() !== self.originalProNumber) {
                            if (self.bolNumber().trim() === self.originalBolNumber) {
                                //checking only the PRO exists so we will not be passing the BOL#
                                bolNo = "";
                            }
                            self.vendorBillClient.searchSalesOrderByBOL(newValue, self.vendorId(), bolNo, 0, function (data) {
                                // Update the UI as for address
                                self.UpdateData(data, "ProNumber");
                            });
                        }
                    }
                }
            });

            //To initialize the dates
            self.billDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
            self.deliveryDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));

            //To set The date picker options
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

            //#region Error Details Object
            self.errorVendorDetail = ko.validatedObservable({
                vendorNameSearchList: self.vendorNameSearchList,
                proNumber: self.proNumber,
                bolNumber: self.bolNumber,
                billDate: self.billDate,
                originZip: self.originZip,
                destinationZip: self.destinationZip
            });

            //#endregion
            //To set the checkbox bill option values
            var vendorBillOptionListOptions = [{ id: refEnums.Enums.vendorBillOptionConstant.MakeInactive, name: 'Make Inactive', selected: false }, { id: refEnums.Enums.vendorBillOptionConstant.FroceAttach, name: 'Force Attach', selected: false }, { id: refEnums.Enums.vendorBillOptionConstant.Quickpay, name: 'Quick Pay', selected: false }, { id: refEnums.Enums.vendorBillOptionConstant.HoldVendorBill, name: 'Hold Vendor Bill', selected: false }];

            //set checkbox property
            var argsvendorBillOptionList = {
                options: vendorBillOptionListOptions,
                useHtmlBinding: true,
                isMultiCheck: true,
                isVerticalView: false
            };

            self.obcvendorBillOptionList = new refVendorBillOptionButtonControl.VendorBillOptionButtonControl(argsvendorBillOptionList, refEnums.Enums.OptionButtonsView.Vertical);

            //To check if enter value is digit and decimal
            self.isNumber = function (data, event) {
                var charCode = (event.which) ? event.which : event.keyCode;

                if (event.ctrlKey && (charCode == 99 || charCode == 67)) {
                    return true;
                }

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

            // to get the vendorId after selecting vendor
            self.vendorId = ko.computed(function () {
                if (self.vendorNameSearchList.name() != null)
                    return self.vendorNameSearchList.ID();

                return 0;
            });

            // to get the vendor Name after selecting vendor
            self.vendorName = ko.computed(function () {
                if (self.vendorNameSearchList.name() != null)
                    return self.vendorNameSearchList.vendorName();

                return null;
            });

            //## when user pressed 'TAB' from reference number then BOL exist then expand items else expand address view.
            self.isTabPress = function (data, event) {
                var charCode = (event.which) ? event.which : event.keyCode;

                if ((charCode === 9)) {
                    self.keyListenerCallback();
                }
                return true;
            };

            self.memo.subscribe(function (newValue) {
                if (self.memo().length >= 100) {
                    var memo = self.memo().substr(0, 98);
                    self.memo(memo);
                }
            });
        }
        // Updates the UI and status
        VendorBillViewModel.prototype.UpdateData = function (data, status) {
            var self = this;

            if (data.CheckList.length > 0) {
                self.isProNo = data.CheckList[0];
                self.isBolNo = data.CheckList[1];
                self.isVendor = data.CheckList[2];
            }

            self.listCheck = ko.observableArray();
            self.listCheck.push(self.isProNo);
            self.listCheck.push(self.isBolNo);
            self.listCheck.push(self.isVendor);

            if (status == "BolNumber") {
                if (data != null && data.Addresses.length > 0) {
                    ko.utils.arrayForEach(data.Addresses, function (address) {
                        self.salesOrderId = address.SalesOrderId;
                        if (address.AddressType === refEnums.Enums.AddressType.Origin.ID) {
                            self.shipperAddressCallback(address);
                        } else if (address.AddressType === refEnums.Enums.AddressType.Destination.ID) {
                            self.consigneeAddressCallback(address);
                        } else {
                        }
                    });
                }
            }
        };

        //#endregion
        //#region Internal Methods
        // Initialize VendoeBill Details
        VendorBillViewModel.prototype.InitializeVendorBillFields = function (vendorBill) {
            var self = this;
            self.vendorNameSearchList.name(new refVendorNameSearch.Models.VendorNameSearch());
            self.vendorNameSearchList.ID(vendorBill.CarrierId);
            self.vendorNameSearchList.vendorName(vendorBill.VendorName);
            self.proNumber(vendorBill.ProNumber != 'null' ? vendorBill.ProNumber : '');
            self.bolNumber(vendorBill.BolNumber != 'null' ? vendorBill.BolNumber : '');
            self.poNumber(vendorBill.PoNumber != 'null' ? vendorBill.PoNumber : '');
            self.refNumber(vendorBill.ReferenceNumber != 'null' ? vendorBill.ReferenceNumber : '');
            self.totalPieces(vendorBill.TotalPieces);
            self.totalWeigth(vendorBill.TotalWeight);
            self.deliveryDate(vendorBill.DeliveryDate ? self.CommonUtils.formatDate(vendorBill.DeliveryDate.toString(), 'mm/dd/yyyy') : '');
            self.vendorAmount($.number((vendorBill.Amount), 2));
            self.billDate(vendorBill.BillDate ? self.CommonUtils.formatDate(vendorBill.BillDate.toString(), 'mm/dd/yyyy') : '');
            self.originZip(vendorBill.OriginZip);
            self.destinationZip(vendorBill.DestinationZip);
            self.salesOrderId = vendorBill.SalesOrderId;
            self.mainBolNumber(vendorBill.SalesOrderId.toString());
        };

        //Validating Vendor Bill property
        VendorBillViewModel.prototype.validateBill = function () {
            var self = this;

            self.vendorNameSearchList.vaildateSearchVendorNameControl();
            if (self.errorVendorDetail.errors().length != 0) {
                self.errorVendorDetail.errors.showAllMessages();
                return true;
            } else {
                return false;
            }
        };

        VendorBillViewModel.prototype.activate = function () {
            return true;
        };

        //** Using for focus cursor on last cycle for focusing in vendor name
        VendorBillViewModel.prototype.compositionComplete = function (view, parent) {
            setTimeout(function () {
                $("input:text:visible:first").focus();
            }, 500);
        };

        //sets the tracking extension for VB required fields
        VendorBillViewModel.prototype.SetBITrackChange = function (self) {
            //** To detect changes for Vendor Bill
            self.proNumber.extend({ trackChange: true });
            self.bolNumber.extend({ trackChange: true });
            self.billDate.extend({ trackChange: true });
            self.poNumber.extend({ trackChange: true });
            self.refNumber.extend({ trackChange: true });
            self.deliveryDate.extend({ trackChange: true });
            self.memo.extend({ trackChange: true });
            self.vendorNameSearchList.vendorName.extend({ trackChange: true });
        };

        //#region if user any numeric  date  without any format
        VendorBillViewModel.prototype.convertToBillDate = function () {
            var self = this;
            if (!self.billDate().match('/')) {
                self.billDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.billDate()));
            }
        };

        VendorBillViewModel.prototype.convertToDeliveryDate = function () {
            var self = this;
            if (!self.deliveryDate().match('/') && self.deliveryDate().length > 0) {
                self.deliveryDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.deliveryDate()));
            }
        };

        //#endregion
        //#endregion
        VendorBillViewModel.prototype.cleanup = function () {
            var self = this;
            self.vendorNameSearchList.cleanUp();
            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }
            delete self;
        };
        return VendorBillViewModel;
    })();
    exports.VendorBillViewModel = VendorBillViewModel;
});
