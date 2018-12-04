/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../services/models/TypeDefs/VendorBillModels.d.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'services/models/common/Enums', 'services/models/purchaseOrder/ForeignBolEmail', 'services/client/PurchaseOrderClient'], function(require, exports, ___router__, ___app__, __refSystem__, __refEnums__, ___refForeignBolEmailModel__, __refpurchaseOrderClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    var refEnums = __refEnums__;
    var _refForeignBolEmailModel = ___refForeignBolEmailModel__;
    var refpurchaseOrderClient = __refpurchaseOrderClient__;

    //#endregion
    /***********************************************
    ForeignBolAgentEmail
    ************************************************
    ** <summary>
    ** ForeignBolAgentEmail Model
    ** </summary>
    ** <changeHistory>
    ** <id>US22471</id> <by>Vasanthakumar</by> <date>03-06-2016</date> <description>Add Success Toastr message for Emails triggered by users</description>
    ** <id>US23323</id> <by>Janakiram</by> <date>14-07-2016</date> <description> Email field should allow multiple Emails and validation</description>
    ** </changeHistory>
    ***********************************************/
    var ForeignBolAgentEmail = (function () {
        //#endregion
        //#region Constructor
        function ForeignBolAgentEmail() {
            var _this = this;
            this.UploadedFileName = ko.observable();
            this.commonUtils = new Utils.Common();
            this.purchaseOrderClient = new refpurchaseOrderClient.PurchaseOrderClient();
            this.uploadedItems = ko.observableArray();
            // ###START: US23323
            this.emailValidation = ko.observable('').extend({ required: { message: "Please Enter Email." }, multiemail: true });
            this.ForeignBolEmail = new _refForeignBolEmailModel.Models.ForeignBolEmail();
            this.agentEmailId = ko.observable('');
            // To disable send Mail Button
            this.isMailNotSend = ko.observable(true);
            //errorEmailAddresses: KnockoutValidationGroup;
            //to hold comments in mail body
            this.Comments = ko.observable('');
            this.listProgress = ko.observable(false);
            this.agentName = ko.observable('');
            this.agentId = ko.observable(0);
            this.customerName = ko.observable('');
            this.foreignBolEmailExpiry = ko.observable('');
            this.isForeignBolChecked = ko.observable(false);
            this.vendorBillId = ko.observable(0);
            this.customerId = ko.observable(0);
            var self = this;
            var commonUtils = new Utils.Common();

            self.onSendMail = function (target) {
                var self = _this;

                if (!self.validateAgentEmail()) {
                    // ###END: US23323
                    self.ForeignBolEmail.CustomerName = self.customerName();
                    self.ForeignBolEmail.AgentName = self.agentName();

                    if (self.emailValidation() == "" || self.emailValidation() === null || self.emailValidation() === 'undefined') {
                        self.ForeignBolEmail.EmailAddress = self.agentEmailId();
                    } else {
                        self.ForeignBolEmail.EmailAddress = self.emailValidation();
                    }

                    self.ForeignBolEmail.Comments = self.Comments();
                    self.ForeignBolEmail.Attachments = self.uploadedItems();
                    self.ForeignBolEmail.ForeignBolEmailData = self.emailData;
                    self.ForeignBolEmail.IsForeignBol = self.isForeignBolChecked();
                    self.ForeignBolEmail.VendorBillId = self.vendorBillId();
                    self.ForeignBolEmail.CustomerId = self.customerId();
                    self.ForeignBolEmail.SalesRepId = self.agentId();

                    // to show progress Bar
                    self.listProgress(true);
                    var successCallBack = function (data) {
                        self.isMailNotSend(true);
                        if (self.refresh && typeof self.refresh === "function") {
                            self.refresh();
                        }
                        self.foreignBolEmailExpiry(data);
                        self.closePopup(self);
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SendSuccessfullyMail, "success", null, toastrOptions);

                        //target.__dialog__.close();
                        self.listProgress(false);
                    }, faliureCallBack = function (message) {
                        self.listProgress(false);
                        self.isMailNotSend(true);
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
                    };

                    // ###START: US22471
                    var failCallBackInfo = function (message) {
                        // Saving failed call back info message
                        self.listProgress(false);
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };

                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, message, "info", null, toastrOptions, null);
                    };
                    self.isMailNotSend(false);

                    //self.purchaseOrderEmail.VendorBillDocuments = self.uploadedItems();
                    self.purchaseOrderClient.sendForeignBolAgentMail(self.ForeignBolEmail, successCallBack, faliureCallBack, failCallBackInfo);
                    // ###END: US22471
                    // ###START: US23323
                }
                // ###START: US23323
            };

            ////This is triggered when the user is uploading a document.
            //#region Error Details Object
            self.errorPurchaseOrderDetail = ko.validatedObservable({
                emailValidation: self.emailValidation
            });

            //## to Removing the attached fille.
            self.removeAttachedItem = function (lineItem) {
                self.selectLineItem = lineItem;
                self.uploadedItems.remove(self.selectLineItem);
                self.UploadedFileName('');
            };
        }
        //#endregion
        //#region Public Methods
        ForeignBolAgentEmail.prototype.load = function () {
        };

        //Validating Vendor Bill property
        ForeignBolAgentEmail.prototype.validateAgentEmail = function () {
            var self = this;
            if (self.errorPurchaseOrderDetail.errors().length != 0) {
                self.errorPurchaseOrderDetail.errors.showAllMessages();
                return true;
            } else {
                return false;
            }
        };

        // Shows the message box as pr the given title and message
        ForeignBolAgentEmail.prototype.showConfirmationMessage = function (message, title, fisrtButtoName, secondButtonName, yesCallBack, noCallBack) {
            var self = this;

            var varMsgBox = [
                {
                    id: 0,
                    name: fisrtButtoName,
                    callback: function () {
                        return yesCallBack();
                    }
                },
                {
                    id: 1,
                    name: secondButtonName,
                    callback: function () {
                        return noCallBack();
                    }
                }
            ];

            ////initialize message box control arguments
            var optionControlArgs = {
                options: varMsgBox,
                message: message,
                title: title
            };
            _app.showDialog('templates/messageBox', optionControlArgs, 'slideDown');
        };

        //close popup
        ForeignBolAgentEmail.prototype.closePopup = function (dialogResult) {
            dialogResult.__dialog__.close(this, dialogResult);
            return true;
        };

        //#endregion
        //#region Private Methods
        //#endregion
        //#region Life Cycle Event
        //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
        ForeignBolAgentEmail.prototype.beforeBind = function () {
            var self = this;
            self.load();
        };

        ForeignBolAgentEmail.prototype.compositionComplete = function (view, parent) {
            $('#txtuserName').focus();
        };

        // Activate the view and bind the selected data from the main view
        ForeignBolAgentEmail.prototype.activate = function (data) {
            var self = this;
            if (data != null) {
                //self.emailData = data.bindingObject.EmailData;
                self.agentName(data.bindingObject.foreignBolEmail.AgentName);
                self.customerName(data.bindingObject.foreignBolEmail.CustomerName);
                self.emailValidation(data.bindingObject.foreignBolEmail.EmailAddress);
                self.agentEmailId(data.bindingObject.foreignBolEmail.EmailAddress);
                self.isForeignBolChecked(data.bindingObject.foreignBolEmail.IsForeignBol);
                self.vendorBillId(data.bindingObject.foreignBolEmail.VendorBillId);
                self.customerId(data.bindingObject.foreignBolEmail.CustomerId);
                self.agentId(data.bindingObject.foreignBolEmail.SalesRepId);

                //** if there is no data is registered then make a server call. */
                var successCallBack = function (data) {
                    self.uploadedItems.removeAll();
                    self.uploadedItems(data);
                    //data.foreach(() => {
                    //});
                    //self.purchaseOrderPODDocViewModel.purchaseOrderPodDocDetail.removeAll();
                    //self.purchaseOrderPODDocViewModel.reportContainer.listProgress(true);
                    //self.purchaseOrderPODDocViewModel.initializeSalesOrderPodDocDetails(data, self.purchaseOrderDetailsViewModel.proNumber(), self.purchaseOrderDetailsViewModel.vendorNameSearchList.ID(), self.purchaseOrderDetailsViewModel.bolNumber(), self.purchaseOrderDetailsViewModel.vendorBillId(), !self.IsReadOnly, self.purchaseOrderDetailsViewModel.vendorName(), self.OriginZip());
                    //self.purchaseOrderPODDocViewModel.reportContainer.listProgress(false);
                }, faliureCallBack = function (message) {
                    console.log(message);
                    //self.purchaseOrderPODDocViewModel.reportContainer.listProgress(false);
                };
                self.purchaseOrderClient.getPurchaseOrderPodDocDetails(data.bindingObject.uploadData, successCallBack, faliureCallBack);
            } else {
                refSystem.log('error in the calling method of agent mail');
            }
        };
        return ForeignBolAgentEmail;
    })();

    return ForeignBolAgentEmail;
});
