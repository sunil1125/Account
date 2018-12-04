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
/// <reference path="../services/models/TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
/// <reference path="../../Scripts/Constants/ApplicationConstants.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/models/common/Enums', 'purchaseOrder/purchaseOrderToSalesOrder/searchAgentNameControl', 'purchaseOrder/purchaseOrderToSalesOrder/searchAgencyNameControl', 'services/validations/Validations', 'services/client/PurchaseOrderClient', 'services/models/purchaseOrder/POToSOParameters', 'templates/searchCustomerAutoComplete', 'services/models/purchaseOrder/ForeignBolEmail', 'services/models/purchaseOrder/PurchaseOrderUploadFileModel', 'services/client/CommonClient'], function(require, exports, ___router__, ___app__, __refEnums__, __refAgentNameSearchControl__, __refAgencyNameSearchControl__, __refValidations__, __refPurchaseOrderClient__, __refPurchaseOrderToSalesOrderModel__, __refCustomerSearchControl__, ___refForeignBolEmailEmailModel__, __refPodDocModel__, __refCommonClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refEnums = __refEnums__;
    
    
    
    var refAgentNameSearchControl = __refAgentNameSearchControl__;
    var refAgencyNameSearchControl = __refAgencyNameSearchControl__;
    
    var refValidations = __refValidations__;
    
    var refPurchaseOrderClient = __refPurchaseOrderClient__;
    var refPurchaseOrderToSalesOrderModel = __refPurchaseOrderToSalesOrderModel__;
    var refCustomerSearchControl = __refCustomerSearchControl__;
    
    var _refForeignBolEmailEmailModel = ___refForeignBolEmailEmailModel__;
    var refPodDocModel = __refPodDocModel__;
    var refCommonClient = __refCommonClient__;
    

    //#endregion
    /***********************************************
    PURCHASE ORDER TO SALES ORDER  VIEW MODEL
    ************************************************
    ** <summary>
    ** Purchase Order To Sales Order View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US10941</id><by>Bhanu pratap</by> <date>29th Sep, 2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US19707</id> <by>SHREESHA ADIGA</by><date>24-11-2015</date><description>Validation for Pickup date < Deliverydate</description>
    ** <id>DE21776</id> <by>Vasanthakumar</by><date>12-02-2016</date><description>Do not allow user to enter system date in UVB to SO Process</description>
    ** <id>US22471</id> <by>Vasanthakumar</by> <date>03-06-2016</date> <description>Add Success Toastr message for Emails triggered by users</description>
    ** <id>US22796</id> <by>Baldev Singh Thakur</by> <date>16-06-2016</date> <description>Added logic to check if TruckLoad is checked.</description>
    ** <id>DE23560</id> <by>Shreesha Adiga</by> <date>01-08-2016</date> <description>Get email by userid instead of name</description>
    ** </changeHistory>
    ***********************************************/
    var PurchaseOrderToSalesOrderViewModel = (function () {
        // ###END: US22796
        //#region
        function PurchaseOrderToSalesOrderViewModel(onRateItCustomerCallBack, onRateItManuallyClick, onCustomerChangeCallBack, hasCustomerAssociation, disableIsForeignBOL) {
            //#region Observables Declaration Region
            this.uploadFileDetails = new refPodDocModel.Models.PurchaseOrderUploadFileModel();
            //## Holds Pickup Date
            this.pickupDate = ko.observable('');
            // Holds agent id
            this.agentId = ko.observable(0);
            this.agentName = ko.observable('');
            // Holds agency id
            this.agencyId = ko.observable(0);
            this.agencyName = ko.observable('');
            this.emailAddress = ko.observable('');
            this.timeRemaining = ko.observable();
            this.vendorBillId = ko.observable(0);
            this.carrierId = ko.observable(0);
            this.proNumber = ko.observable('');
            this.isTodayHoliday = ko.observable(false);
            // To get the logged in user
            this.currentUser = ko.observable();
            //Holds Customer Financial Details
            // hold term
            this.term = ko.observable('');
            // Hold AvailableCredit
            this.availableCredit = ko.observable('0.00');
            //carrier
            this.carrierName = ko.observable('');
            this.errorWidth = ko.observable('97%');
            this.normalWidth = ko.observable('99%');
            this.isValidationShown = false;
            this.returnValueFlag = false;
            //to enable Rate it On customer button
            this.enableRateIt = ko.observable(false);
            this.isAgentNotificationClicked = ko.observable(false);
            this.isForeignBolChecked = ko.observable(false);
            this.showTimer = ko.observable(false);
            this.isForeignBolSelectedForView = ko.observable(false);
            this.isStopTimerClicked = ko.observable(false);
            this.StopTimer = ko.observable(false);
            this.purchaseOrderClient = new refPurchaseOrderClient.PurchaseOrderClient();
            this.purchaseOrderToSalesOrderModel = new refPurchaseOrderToSalesOrderModel.Models.POToSOParameter();
            this.commonUtils = new Utils.Common();
            // client command
            this.commonClient = new refCommonClient.Common();
            this.timerTitle = ko.observable('Stop Timer');
            //#endregion
            //##START: US19707
            this.deliveryDate = ko.observable('');
            //##END: US19707
            // ###START: US22796
            this.isPoToSo = ko.observable(false);
            this.isTruckLoadChecked = ko.observable(false);
            var self = this;
            self.onRateItCustomerCallBack = onRateItCustomerCallBack;
            self.onRateItManuallyClick = onRateItManuallyClick;
            _app.trigger("IsTodayHoliday", function (data) {
                self.isTodayHoliday(data);
            });

            if (typeof (onCustomerChangeCallBack) !== 'undefined') {
                self.onCustomerChangeCallBack = onCustomerChangeCallBack;
            }

            if (typeof (hasCustomerAssociation) !== 'undefined') {
                self.hasCustomerAssociation = hasCustomerAssociation;
            }

            if (typeof (disableIsForeignBOL) !== 'undefined') {
                self.disableIsForeignBOL = disableIsForeignBOL;
            }

            self.agentNameSearchList = new refAgentNameSearchControl.SearchAgentNameControl("A valid Agent Name is required.", function () {
                self.agentSelection();
            });
            self.agencyNameSearchList = new refAgencyNameSearchControl.SearchAgencyNameControl("A valid Agency Name is required.", function () {
                self.agencySelection();
            });

            //self.customerNameSearchList = new refCustomerNameSearchControl.SearchCustomerNameControl("A valid Customer Name is required
            self.customerSearchList = new refCustomerSearchControl.SearchCustomerAutoComplete("A valid Customer Name is required.", function (salesRep, agencyName, agencyID, agentID) {
                //self.agentName(salesRep);
                //self.agentId(agentID);
                //self.agencyName(agencyName);
                //self.agencyId(agencyID);
                var agentAgencyDetails = { agentName: salesRep, agentId: agentID, agencyName: agencyName, agencyId: agencyID };
                if (salesRep === '' || salesRep === undefined || salesRep === null) {
                    self.onCustomerChangeCallBack(false, self.customerSearchList.id(), agentAgencyDetails);
                } else {
                    self.onCustomerChangeCallBack(true, self.customerSearchList.id(), agentAgencyDetails);
                }
                self.isAgentNotificationClicked(true);
            }, '95%', '90.2%', true, function (isCustomerBlank) {
                self.isAgentNotificationClicked(isCustomerBlank);
            });
            self.customerSearchList.isCustomCssSO(true);

            // To validate Pickup Date
            self.pickupDate = ko.observable().extend({
                required: {
                    message: 'Pickup date is required.'
                },
                validation: [
                    {
                        validator: function () {
                            return refValidations.Validations.isValidDate(self.pickupDate(), self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "PickupDate");
                        },
                        message: 'Not a valid date'
                    },
                    //##START: US19707
                    {
                        validator: function () {
                            return refValidations.Validations.isValidDate(self.pickupDate(), self.commonUtils.formatDate(new Date(self.deliveryDate()), 'mm/dd/yyyy'), "BillDate");
                        },
                        message: 'Pickup date should be less than or equal to delivery date'
                    },
                    //##END: US19707
                    // ###START: DE21776
                    {
                        validator: function () {
                            return refValidations.Validations.isValidDate(self.pickupDate(), self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "CurrentDate");
                        },
                        message: 'Pickup Date cannot be today\'s Date'
                    }
                ]
            });

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

            // to get the customer Id after selecting Customer
            self.customerId = ko.computed(function () {
                if (self.customerSearchList.name() != null) {
                    var successCallBack = function (data) {
                        if (data != null) {
                            self.term(data.Terms);
                            var availBleCredit = ((data.CreditLimit ? data.CreditLimit : 0) - ((data.Balance ? data.Balance : 0) + (data.UnbilledAmount ? data.UnbilledAmount : 0)));
                            self.availableCredit($.number(availBleCredit, 2));
                        }
                    }, failureCallBack = function () {
                    };

                    self.purchaseOrderClient.getCustomerFinancialDetailsByCustomerId(self.customerSearchList.id(), successCallBack, failureCallBack);
                    return self.customerSearchList.id();
                }

                return 0;
            });

            // to get the customer Name after selecting Customer
            self.customerName = ko.computed(function () {
                if (self.customerSearchList.name() != null)
                    return self.customerSearchList.customerName();

                return null;
            });

            //##START: DE23560
            // get the email with the agent's id instead of name
            self.agentId.subscribe(function () {
                self.commonClient.getUserDetailsByUserId(self.agentId(), function (userData) {
                    if (typeof userData != "undefined" && userData != null && typeof userData.Email != "undefined") {
                        self.emailAddress(userData.Email);
                    }
                });
            });

            //##END: DE23560
            // ###START: DE21776
            //To set The date picker options
            self.datepickerOptions = {
                todayBtn: false,
                blockWeekend: true,
                blockPreviousDays: false,
                blockHolidaysDays: true,
                autoClose: true,
                placeBelowButton: false,
                endDate: new Date()
            };

            // ###END: DE21776
            //#region Error Details Object
            self.errorPOToSODetail = ko.validatedObservable({
                vendorNameSearchList: self.customerSearchList,
                pickupDate: self.pickupDate
            });
            return self;
        }
        //#endregion
        //#region Internal Methods
        // When user select any other agency then it clears existing dependent filled fields.
        PurchaseOrderToSalesOrderViewModel.prototype.agencySelection = function () {
            var self = this;
            self.agentNameSearchList.agentName('');
            self.agentNameSearchList.ID(0);
            self.customerNameSearchList.customerName('');
            self.customerNameSearchList.ID(0);
            self.term('');
            self.availableCredit('');
        };

        // When user select keep address/delete address all the fields should be empty
        PurchaseOrderToSalesOrderViewModel.prototype.clearAllSelection = function () {
            var self = this;
            self.agentNameSearchList.agentName('');
            self.agentNameSearchList.ID(0);
            self.customerSearchList.customerName('');
            self.customerSearchList.id(0);
            self.agencyNameSearchList.agencyName('');
            self.agencyNameSearchList.ID(0);
            self.agentName('');
            self.agencyName('');
            self.term('');
            self.availableCredit('');
        };

        // When user select any other agent then it clears existing dependent filled fields.
        PurchaseOrderToSalesOrderViewModel.prototype.agentSelection = function () {
            var self = this;
            self.customerNameSearchList.customerName('');
            self.customerNameSearchList.ID(0);
            self.term('');
            self.availableCredit('');
        };

        PurchaseOrderToSalesOrderViewModel.prototype.onRateItOnCustomer = function () {
            var self = this;

            // Get the logged in user for name for new note}
            _app.trigger("GetCurrentUserDetails", function (currentUser) {
                self.purchaseOrderToSalesOrderModel.CurrentUser = currentUser.FullName;
            });

            if (self.validatePOToSODetails()) {
                return false;
            } else {
                self.onRateItCustomerCallBack();
            }
        };

        //Click on Rate it manually
        PurchaseOrderToSalesOrderViewModel.prototype.onRateItOnCustomerManuallyClick = function () {
            var self = this;

            // ###START: US22796
            self.customerNameForTlSo = self.customerName();
            self.purchaseOrderToSalesOrderModel.CustomerName = self.customerNameForTlSo;

            // ###END: US22796
            // Get the logged in user for name for new note}
            _app.trigger("GetCurrentUserDetails", function (currentUser) {
                self.purchaseOrderToSalesOrderModel.CurrentUser = currentUser.FullName;
            });

            if (self.validatePOToSODetails()) {
                return false;
            } else {
                self.onRateItManuallyClick();
            }
        };

        //Validating PO To SO property}
        PurchaseOrderToSalesOrderViewModel.prototype.validatePOToSODetails = function () {
            var self = this;

            self.customerSearchList.vaildateSearchCustomerNameControl();
            if (self.errorPOToSODetail.errors().length != 0) {
                self.errorPOToSODetail.errors.showAllMessages();
                return true;
            } else {
                return false;
            }
        };

        // Open Send Agent Mail Notification
        PurchaseOrderToSalesOrderViewModel.prototype.onSendAgentMailNotification = function () {
            var self = this;
            self.isAgentNotificationClicked(false);

            //var foreignBolEmail = {Data:null};
            var foreignBolEmail = new _refForeignBolEmailEmailModel.Models.ForeignBolEmail();
            foreignBolEmail.CustomerName = self.customerName();
            foreignBolEmail.AgentName = self.agentName();
            foreignBolEmail.EmailAddress = self.emailAddress();
            foreignBolEmail.IsForeignBol = self.isForeignBolChecked();
            foreignBolEmail.VendorBillId = self.vendorBillId();
            foreignBolEmail.CustomerId = self.customerId();
            foreignBolEmail.SalesRepId = self.agentId();
            var obj = { foreignBolEmail: foreignBolEmail, uploadData: self.uploadFileDetails };

            var refresh = function () {
                self.compositionComplete();
            };
            var optionControlArgs = {
                options: undefined,
                message: '',
                title: 'Agent Notification',
                bindingObject: obj
            };

            //Call the dialog Box functionality to open a Popup
            _app.showDialog('purchaseOrder/ForeignBolAgentEmail', optionControlArgs, 'slideDown').then(function (object) {
                self.isAgentNotificationClicked(true);
                if (object.foreignBolEmailExpiry() !== '' && object.foreignBolEmailExpiry() != 'ServerError') {
                    self.customerSearchList.isEnable(false);

                    if (object.foreignBolEmailExpiry() !== '' && object.foreignBolEmailExpiry() !== '0') {
                        self.isStopTimerClicked(true);
                        self.startAndStopTimer(object.foreignBolEmailExpiry());
                        if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
                            self.onChangesMade(false);
                        self.disableIsForeignBOL(true);
                    } else {
                        if (typeof (self.timeRemaining()) != 'undefined') {
                            self.showTimer(true);
                            self.hasCustomerAssociation(true);
                        } else {
                            self.showTimer(false);
                        }
                    }
                } else {
                    //self.mailSentSuccessCallBack('ShowTimer');
                }
            });
        };

        //
        PurchaseOrderToSalesOrderViewModel.prototype.initializePurchaseOrderTOSO = function (timeRemaining, isStopTimer) {
            var self = this;
            if (isStopTimer) {
                self.startAndStopTimer(timeRemaining);
                self.isAgentNotificationClicked(true);
            } else {
                self.timeRemaining(timeRemaining);
                self.showTimer(true);
                self.isAgentNotificationClicked(false);
                self.customerSearchList.isEnable(true);
            }
        };

        //
        PurchaseOrderToSalesOrderViewModel.prototype.startAndStopTimer = function (expiryTime) {
            var self = this;
            self.showTimer(true);
            if (!self.isTodayHoliday()) {
                if (!self.StopTimer()) {
                    clearInterval(self.myTimer);
                    if (expiryTime != '00:00:00') {
                        self.isStopTimerClicked(true);
                        var splitTime = expiryTime.split(':');

                        var second = ((+splitTime[0] * 60 * 60) + (+splitTime[1] * 60) + (+splitTime[2])) * 1000;
                        self.myTimer = setInterval(function () {
                            var expiryDateTime = new Date();
                            var currentDateTime = new Date();

                            var miliSeconds = second - 1000;
                            var seconds = (Math.floor(miliSeconds / 1000));
                            var minutes = (Math.floor(miliSeconds / 1000 / 60));
                            var hours = Math.floor(minutes / 60);
                            minutes = minutes % 60;
                            seconds = seconds % 60;
                            var hoursToDisplay = hours < 10 ? "0" + hours.toString() : hours.toString();
                            var minutesToDisplay = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
                            var secondsToDisplay = seconds < 10 ? "0" + seconds.toString() : seconds.toString();
                            self.timeRemaining(hoursToDisplay + ":" + minutesToDisplay + ":" + secondsToDisplay);
                            self.timerStoppedTimeRemaining = hoursToDisplay + ":" + minutesToDisplay + ":" + secondsToDisplay;
                            second = miliSeconds;
                        }, 1000);
                    } else {
                        self.timeRemaining(expiryTime);
                        self.isStopTimerClicked(false);
                    }
                } else {
                    self.timeRemaining(expiryTime);
                    self.StopTimer(false);
                }
            } else {
                self.timeRemaining(expiryTime);
                self.timerStoppedTimeRemaining = expiryTime;
            }
        };

        //Stop Timer Functionality
        PurchaseOrderToSalesOrderViewModel.prototype.onStopTimer = function () {
            var self = this;
            if (self.timerTitle() == Constants.UIConstants.ResumeTimer) {
                self.timerTitle(Constants.UIConstants.PauseTimer);
                self.purchaseOrderClient.ResumeForeignBolTimer(self.vendorBillId(), self.customerSearchList.id(), function (data) {
                    self.startAndStopTimer(data);
                    self.customerSearchList.isEnable(false);
                    self.disableIsForeignBOL(true);

                    // ###START: US22471
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SendSuccessfullyMail, "success", null, toastrOptions);
                }, function (message) {
                    // Saving failed call back message
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
                }, function (message) {
                    // Saving failed call back info message
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, message, "info", null, toastrOptions, null);
                });

                // ###END: US22471
                self.isAgentNotificationClicked(true);
            } else {
                clearInterval(self.myTimer);
                var time = self.timerStoppedTimeRemaining;
                self.isStopTimerClicked(false);
                self.StopTimer(true);
                self.startAndStopTimer(time);

                self.purchaseOrderClient.DeactivateAgentNotificationForVendorBill(self.vendorBillId(), self.timerStoppedTimeRemaining, function () {
                    self.customerSearchList.isEnable(true);

                    self.hasCustomerAssociation(true);
                    self.sendNotificationOnStopTimer(self.customerSearchList.id());
                    self.timerTitle(Constants.UIConstants.ResumeTimer);
                }, function () {
                });
                self.isAgentNotificationClicked(false);
            }
        };

        PurchaseOrderToSalesOrderViewModel.prototype.sendNotificationOnStopTimer = function (customerId) {
            var self = this;
            self.purchaseOrderClient.SendAgentNotificationOnStopTimer(customerId, self.vendorBillId(), function () {
                // ###START: US22471
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SendSuccessfullyMail, "success", null, toastrOptions);
            }, function (message) {
                // Saving failed call back message
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
            }, function (message) {
                // Saving failed call back info message
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, message, "info", null, toastrOptions, null);
            });
            // ###END: US22471
        };

        //#region if user any numeric  date  without any format
        PurchaseOrderToSalesOrderViewModel.prototype.convertToPickupDate = function () {
            var self = this;
            if (!self.pickupDate().match('/') && self.pickupDate().length > 0) {
                self.pickupDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.pickupDate()));
            }
        };

        //#endregion
        //#endregion
        //#region Life Cycle Event
        PurchaseOrderToSalesOrderViewModel.prototype.activate = function () {
            return true;
        };

        //** Using for focus cursor on last cycle for focusing in vendor name
        PurchaseOrderToSalesOrderViewModel.prototype.compositionComplete = function () {
            var self = this;
            //self.startAndStopTimer(self.timeRemaining());
        };

        PurchaseOrderToSalesOrderViewModel.prototype.cleanup = function () {
            var self = this;
            self.agencyNameSearchList.cleanup();
            self.agentNameSearchList.cleanup();

            //self.customerNameSearchList.cleanup();
            self.customerSearchList.cleanup();
            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }

            delete self;
        };
        return PurchaseOrderToSalesOrderViewModel;
    })();
    exports.PurchaseOrderToSalesOrderViewModel = PurchaseOrderToSalesOrderViewModel;
});
