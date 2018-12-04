/******************************************************************************

* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.

******************************************************************************/
define(["require", "exports", 'durandal/app', 'services/client/SalesOrderClient', 'services/models/salesOrder/SalesOrderProcessCreditDetails', 'services/models/common/Enums'], function(require, exports, ___app__, __refSalesOrderClient__, __refSalesOrderProcessCreditDetails__, __refEnums__) {
    //#region References
    /// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
    /// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
    /// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
    /// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
    /// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
    /// <reference path="../../Scripts/Utility.ts" />
    /// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
    //#endregion
    var _app = ___app__;
    var refSalesOrderClient = __refSalesOrderClient__;
    var refSalesOrderProcessCreditDetails = __refSalesOrderProcessCreditDetails__;
    var refEnums = __refEnums__;

    /*
    ** <summary>
    ** Popup to do Process Credit
    ** </summary>
    ** <createDetails>
    ** <id>US25237</id> <by>Janakiram</by> <date>12-10-2016</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US25154</id> <by>Janakiram</by> <date>13-10-2016</date><description>Sales Order Credit Notification via Email</description>
    ** <id>US25315</id> <by>Janakiram</by><date>26-10-2016</date><description>Displaying data on MAS Credit pop-up and Process credit amount</description>
    ** <id>US25369</id> <by>Janakiram</by><date>26-10-2016</date><description>Added Notes on Processing Credit</description>
    ** <id>DE24930</id> <by>Janakiram</by> <date>27-10-2016</date><description>Added Validation for Customer Credit Memo</description>
    ** <id>US25154</id> <by>Janakiram</by> <date>11-11-2016</date><description>Dispalaying Dyanamic Error message</description>
    ** <id>US26027</id> <by>Janakiram</by> <date>14-12-2016</date><description>Added Rejected Credit Memo Process</description>
    ** <id>US25942</id> <by>Baldev Singh Thakur</by> <date>20-12-2016</date><description>Acct: Validate Customer Credit Amount Field</description>
    ** <id>US25942</id> <by>Janakiram</by> <date>21-12-2016</date><description>Fetching Sales order revenue to compare Credit amount</description>
    ** <id>US26189</id> <by>Vasanthakumar</by> <date>03-01-2017</date><description>Acct: Add a new field in Process Credit Pop-up</description>
    ** <id>DE25559</id> <by>Vasanthakumar</by> <date>10-01-2017</date><description>Showing two warning messages in the Process credit to MAS popup when amount entered is > Original Final revenue</description>
    ** <id>DE25560</id> <by>Vasanthakumar</by> <date>10-01-2017</date><description>Total Pending credit memo field value is not rounded off to two digits after decimal point</description>
    ** <id>US26695</id> <by>Vasanthakumar</by> <date>25-01-2017</date><description>Acct: Handle concurrent processing of Credit Memo</description>
    ** <id>US27139</id> <by>Vasanthakumar</by> <date>03-03-2017</date><description>Disable the customer credit amount if credit reason is Cancel SO</description>
    ** <id>US27139</id> <by>Baldev Singh Thakur</by> <date>03-03-2017</date><description>Acct: Passing Shipment Id and Credit Reason ID</description>
    ** <id>DE25976</id> <by>Baldev Singh Thakur</by> <date>23-02-2017</date><description>Assigning Requested By user id.</description>
    ** <id>US31415</id> <by>Vasanthakumar</by> <date>21-09-2017</date> <description>Accounting: AR dash board - Credit Memo Requests Rejection Note</description>
    ** </changeHistory>
    */
    var ProcessCredittoMasPopupViewModel = (function () {
        function ProcessCredittoMasPopupViewModel() {
            this.bOLNumber = ko.observable('');
            this.customerCreditAmount = ko.observable(0);
            this.vendorCreditAmount = ko.observable('');
            this.notesDescription = ko.observable('');
            this.creditRequestId = ko.observable(0);
            // ###START: US26027
            this.customerCreditAmountOnLOad = ko.observable(0);
            // ###END: US26027
            // ###START: US25369
            this.creditReasonId = ko.observable(0);
            // ###END: US25369
            // ###START: US25369
            this.shipmentId = ko.observable(0);
            this.listProgress = ko.observable(false);
            // ###START: US25154
            this.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
            // ###START: US25942
            this.finalRevenue = ko.observable(0);
            this.isCreditMemoExceeds = ko.observable(false);
            // ###START: US26189
            this.totalPendingCreditAmount = ko.observable(0);
            this.isNegativeRevenueCreditMemo = ko.observable(false);
            // Utility class object
            this.CommonUtils = new Utils.Common();
            // ###END: US25942
            // ###START: DE25976
            this.creditRequestedBy = ko.observable(0);
            var self = this;

            // set the flag allow decimal: true to accepts decimals
            self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(true) };

            // Customer Credit Validation
            self.customerCreditAmount.extend({
                required: {
                    message: "Credit Amount is required"
                },
                number: true
            });

            // validation group
            self.validationGroupPopup = ko.validatedObservable({
                customerCreditAmount: self.customerCreditAmount
            });

            // ###START: US25942
            self.customerCreditAmount.subscribe(function (creditAmount) {
                var finalRevenue = 0.0, customerCreditAmount = 0.0;

                var customerCreditAmountWithoutComma = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.customerCreditAmount().toString()) ? self.customerCreditAmount().toString() : '0.0';

                var customerCreditCheck = customerCreditAmountWithoutComma.indexOf(",");
                if (customerCreditCheck === -1) {
                    customerCreditAmount = parseFloat(self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.customerCreditAmount().toString()) ? self.customerCreditAmount().toString() : '0.0');
                } else {
                    //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                    customerCreditAmount = parseFloat(customerCreditAmountWithoutComma.replace(/,/g, ""));
                }

                finalRevenue = self.finalRevenue();

                if (parseFloat(customerCreditAmount.toString().replace(/,/g, "")) > parseFloat(finalRevenue.toString().replace(/,/g, ""))) {
                    self.isCreditMemoExceeds(true);
                    self.isNegativeRevenueCreditMemo(false);
                } else {
                    self.isCreditMemoExceeds(false);
                }

                if (!self.isCreditMemoExceeds()) {
                    if (parseFloat(self.customerCreditAmount().toString().replace(/,/g, "")) > (parseFloat(self.finalRevenue().toString().replace(/,/g, "")) - parseFloat(self.totalPendingCreditAmount().toString().replace(/,/g, "")))) {
                        self.isNegativeRevenueCreditMemo(true);
                        self.isCreditMemoExceeds(false);
                    } else {
                        self.isNegativeRevenueCreditMemo(false);
                    }
                }
                // ###END: US26189
            });

            self.enableCustomerCreditAmount = ko.computed(function () {
                return typeof self.creditReasonId() === "undefined" ? true : self.creditReasonId() === refEnums.Enums.CreditReason.CancelSO.ID ? false : true;
            });
            // ###END: US25942
        }
        // ###END: DE24930
        //#region private Event
        //on click of close on the popup
        ProcessCredittoMasPopupViewModel.prototype.onCancel = function (dialogResult) {
            var self = this;
            self.closePopup(dialogResult);
        };

        // ###START: US25154
        ProcessCredittoMasPopupViewModel.prototype.onProcess = function (dialogResult) {
            var self = this;

            if (self.validationGroupPopup.errors().length != 0) {
                self.validationGroupPopup.errors.showAllMessages();
                return;
            }

            // ###END: DE24930
            var ProcessCreditDetails = new refSalesOrderProcessCreditDetails.Model.SalesOrderCreditNotificationMail();

            // ###START: US25315
            ProcessCreditDetails.CreditRequestId = self.creditRequestId();
            ProcessCreditDetails.BOLNumber = self.bOLNumber();
            ProcessCreditDetails.CreditAmount = self.customerCreditAmount();

            // ###END: US25315
            // ###START:US25369
            ProcessCreditDetails.ShipmentId = self.shipmentId();

            // ###END:US25369
            // ###START:US25369
            ProcessCreditDetails.CreditReasonId = self.creditReasonId();

            // ###END:US25369
            // ###START:DE25976
            ProcessCreditDetails.CreditRequestedBy = self.creditRequestedBy();

            // ###END:DE25976
            self.listProgress(true);

            self.salesOrderClient.ProcessCreditMemo(ProcessCreditDetails, function (message) {
                // Saving successful callback
                self.listProgress(false);
                var toastrOptions1 = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };

                self.closePopup(dialogResult);
                self.saveCallback();
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.MailSentSuccessfullyDispute, "success", null, toastrOptions1, null);
            }, function (message) {
                // Saving failed call back
                self.listProgress(false);
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };

                // ###START: US25154
                self.closePopup(dialogResult);
                self.saveCallback();
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions, null);
                // ###END: US25154
            }, function (message) {
                // Saving failed call back info message
                self.listProgress(false);
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };

                // ###START: US25154
                self.closePopup(dialogResult);
                setTimeout(function () {
                    self.saveCallback();
                }, 10000);

                // ###END: US25154
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, message, "info", null, toastrOptions, null);
            });
        };

        // ###END: US25154
        // ###START: US26027
        ProcessCredittoMasPopupViewModel.prototype.onReject = function (dialogResult) {
            var self = this;

            if (self.validationGroupPopup.errors().length != 0) {
                self.validationGroupPopup.errors.showAllMessages();
                return;
            }

            var ProcessCreditDetails = new refSalesOrderProcessCreditDetails.Model.SalesOrderCreditNotificationMail();
            ProcessCreditDetails.CreditRequestId = self.creditRequestId();
            ProcessCreditDetails.CreditAmount = self.customerCreditAmountOnLOad();
            ProcessCreditDetails.BOLNumber = self.bOLNumber();

            // ###START: US27139
            ProcessCreditDetails.ShipmentId = self.shipmentId();
            ProcessCreditDetails.CreditReasonId = self.creditReasonId();

            // ###END: US27139
            // ###START: DE25976
            ProcessCreditDetails.CreditRequestedBy = self.creditRequestedBy();

            // ###END: DE25976
            self.listProgress(true);

            // on click of save in popup
            var saveClickOnPopupCallback = function (rejectionNote) {
                self.rejectionNote = rejectionNote;

                if (typeof self.rejectionNote !== "undefined" && self.rejectionNote !== null) {
                    ProcessCreditDetails.RejectionNote = self.rejectionNote;
                    self.salesOrderClient.RejectCreditMemo(ProcessCreditDetails, function (message) {
                        // Saving successful callback
                        self.listProgress(false);
                        var toastrOptions1 = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };

                        self.closePopup(dialogResult);
                        self.saveCallback();
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.MailSentSuccessfullyDispute, "success", null, toastrOptions1, null);
                    }, function (message) {
                        // Saving failed call back
                        self.listProgress(false);
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };
                        self.closePopup(dialogResult);
                        self.saveCallback();
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions, null);
                    }, function (message) {
                        // Saving failed call back info message
                        self.listProgress(false);
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };
                        self.closePopup(dialogResult);

                        self.saveCallback();
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, message, "info", null, toastrOptions, null);
                    });
                } else {
                    self.closePopup(dialogResult);
                    self.saveCallback();
                }
            };

            // on click of cancel in popup
            var cancelClickOnPopupCallback = function () {
                self.closePopup(dialogResult);
                self.saveCallback();
            };

            // object to be passed to the popup
            var optionControlArgs = {
                options: undefined,
                message: '',
                title: 'Reason for Rejection',
                bindingObject: {
                    saveCallback: saveClickOnPopupCallback,
                    cancelCallback: cancelClickOnPopupCallback
                }
            };

            _app.showDialog('dashboard/RejectCreditMemoPopup', optionControlArgs);
        };

        // ###END: US26027
        //close popup
        ProcessCredittoMasPopupViewModel.prototype.closePopup = function (dialogResult) {
            var self = this;
            dialogResult.__dialog__.close(this, dialogResult);
            return true;
        };

        //#endregion private Event
        //#region Life Cycle Event
        //this method gets called first. optioncontrol is used to pass data to popup from where it's called
        ProcessCredittoMasPopupViewModel.prototype.activate = function (optionControl) {
            var self = this;

            if (typeof optionControl != null && typeof optionControl.bindingObject !== 'undefined' && typeof optionControl.bindingObject.emailPopupData !== 'undefined') {
                self.initializeDisputeEmailPopupDetails(optionControl.bindingObject.emailPopupData);

                if (typeof (optionControl.bindingObject.saveCallback) !== 'undefined') {
                    self.saveCallback = optionControl.bindingObject.saveCallback;
                }
                // ###END: US25315
            }
        };

        // ###START: US25315
        // method to initialize the inputs on the popup
        ProcessCredittoMasPopupViewModel.prototype.initializeDisputeEmailPopupDetails = function (emailPopupData) {
            var self = this;
            self.listProgress(true);
            self.creditRequestId(emailPopupData.CreditRequestId);
            self.bOLNumber(emailPopupData.BOLNumber);

            // ###START: US26027
            self.customerCreditAmountOnLOad(emailPopupData.CreditAmount);

            // ###END: US26027
            self.customerCreditAmount($.number(emailPopupData.CreditAmount, 2));
            var soFinalRevenue = 0;

            // ###START: US25942
            self.salesOrderClient.getTotalSORevenueCreditMemo(emailPopupData.ShipmentId, function (data) {
                if (data) {
                    self.finalRevenue($.number(data.TotalSORevenueAmount, 2));
                    self.totalPendingCreditAmount($.number($.number(data.TotalPendingCreditAmount, 2) - self.customerCreditAmountOnLOad(), 2));
                    if (parseFloat(self.customerCreditAmount().toString().replace(/,/g, "")) > parseFloat(self.finalRevenue().toString().replace(/,/g, ""))) {
                        self.isCreditMemoExceeds(true);
                        self.isNegativeRevenueCreditMemo(false);
                    } else {
                        self.isCreditMemoExceeds(false);
                    }

                    if (!self.isCreditMemoExceeds()) {
                        if (parseFloat(self.customerCreditAmount().toString().replace(/,/g, "")) > (parseFloat(self.finalRevenue().toString().replace(/,/g, "")) - parseFloat(self.totalPendingCreditAmount().toString().replace(/,/g, "")))) {
                            self.isNegativeRevenueCreditMemo(true);
                            self.isCreditMemoExceeds(false);
                        } else {
                            self.isNegativeRevenueCreditMemo(false);
                        }
                    }

                    // ###END: US26189
                    self.listProgress(false);
                }
            }, function (message) {
                // Saving failed call back info message
                self.listProgress(false);
            });

            if (self.customerCreditAmount() > self.finalRevenue()) {
                self.isCreditMemoExceeds(true);
                self.isNegativeRevenueCreditMemo(false);
            } else {
                self.isCreditMemoExceeds(false);
            }

            if (!self.isCreditMemoExceeds()) {
                if (self.customerCreditAmount() > (self.finalRevenue() - self.totalPendingCreditAmount())) {
                    self.isNegativeRevenueCreditMemo(true);
                    self.isCreditMemoExceeds(false);
                } else {
                    self.isNegativeRevenueCreditMemo(false);
                }
            }

            // ###END: US26189
            // ###END: US25942
            self.vendorCreditAmount(emailPopupData.VendorCreditAmount);
            if (typeof (emailPopupData.NotesDescription) !== 'undefined') {
                self.notesDescription(emailPopupData.NotesDescription);
            } else {
                self.notesDescription('');
            }

            self.shipmentId(emailPopupData.ShipmentId);

            // ###START: US25369
            self.creditReasonId(emailPopupData.CreditReasonId);

            // ###END: US25369
            // ###START: DE25976
            self.creditRequestedBy(emailPopupData.CreditRequestedBy);
            // ###END: DE25976
        };
        return ProcessCredittoMasPopupViewModel;
    })();

    return ProcessCredittoMasPopupViewModel;
});
