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
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'services/models/common/Enums', 'services/models/purchaseOrder/PurchaseOrderEmail', 'services/client/PurchaseOrderClient', 'templates/searchUserAutoComplete'], function(require, exports, ___router__, ___app__, __refSystem__, __refEnums__, ___refPurchaseOrderEmailModel__, __refpurchaseOrderClient__, __refUserSearchControl__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    var refEnums = __refEnums__;
    var _refPurchaseOrderEmailModel = ___refPurchaseOrderEmailModel__;
    var refpurchaseOrderClient = __refpurchaseOrderClient__;
    var refUserSearchControl = __refUserSearchControl__;

    //#endregion
    /*
    ** <summary>
    ** Purchase Order Agent Email View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US10948</id> <by>Chandan</by> <date>29th july, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var PurchaseOrderAgentEmail = (function () {
        //#endregion
        //#region Constructor
        function PurchaseOrderAgentEmail() {
            var _this = this;
            this.UploadedFileName = ko.observable();
            this.commonUtils = new Utils.Common();
            this.purchaseOrderClient = new refpurchaseOrderClient.PurchaseOrderClient();
            this.uploadedItems = ko.observableArray();
            this.emailValidation = ko.observable('').extend({ multiemail: true });
            this.purchaseOrderEmail = new _refPurchaseOrderEmailModel.Models.PurchaseOrderEmail();
            // To disable send Mail Button
            this.isMailNotSend = ko.observable(true);
            //errorEmailAddresses: KnockoutValidationGroup;
            //to hold comments in mail body
            this.Comments = ko.observable('');
            this.listProgress = ko.observable(false);
            var self = this;
            var commonUtils = new Utils.Common();
            self.userSerachViewMdoel = new refUserSearchControl.SearchUserAutoComplete("Agent name is required.");

            // to get the vendorId after selecting vendor
            self.userId = ko.computed(function () {
                if (self.userSerachViewMdoel.name() != null)
                    return self.userSerachViewMdoel.id();

                return 0;
            });

            // to get the vendor Name after selecting vendor
            self.userName = ko.computed(function () {
                if (self.userSerachViewMdoel.name() != null) {
                    self.emailValidation(self.userSerachViewMdoel.emailId);
                    return self.userSerachViewMdoel.userName();
                }
                return null;
            });

            self.onSave = function (target) {
                var self = _this;
                if (!self.validateAgentEmail()) {
                    self.purchaseOrderEmail.AgentName = self.userSerachViewMdoel.userName();
                    if (self.emailValidation() == "" || self.emailValidation() === null || self.emailValidation() === 'undefined') {
                        self.purchaseOrderEmail.EmailAddress = self.userSerachViewMdoel.emailId;
                    } else {
                        self.purchaseOrderEmail.EmailAddress = self.emailValidation();
                    }
                    self.purchaseOrderEmail.Comments = self.Comments();
                    self.purchaseOrderEmail.VendorBillDocuments = self.uploadedItems();

                    // to show progress Bar
                    self.listProgress(true);
                    var successCallBack = function () {
                        self.isMailNotSend(true);
                        if (self.refresh && typeof self.refresh === "function") {
                            self.refresh();
                        }
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
                    self.isMailNotSend(false);

                    //self.purchaseOrderEmail.VendorBillDocuments = self.uploadedItems();
                    self.purchaseOrderClient.sendAgentEmail(self.purchaseOrderEmail, successCallBack, faliureCallBack);
                }
            };

            ////This is triggered when the user is uploading a document.
            //////It saves the document object to be saved in system
            self.uploadAgentMailDocument = function (obj, event) {
                if (self.uploadedItems().length < 10) {
                    var reader = new FileReader();
                    var FileUploadObj = (event.target).files[0];
                    var ext = FileUploadObj.name.split(".")[FileUploadObj.name.split(".").length - 1];
                    if (FileUploadObj.type.search("image") == -1 && FileUploadObj.type.search("pdf") == -1 && ext.search("doc") == -1) {
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.OnlyFilesWithTypeImagePdfAndWordDocumentAreAllowedToBeUploaded, "info", null, toastrOptions);

                        return;
                    }

                    reader.readAsDataURL(FileUploadObj);
                    reader.onload = function (imgsrc) {
                        self.uploadFileContent = imgsrc.target.result;
                        self.UploadedFileName(FileUploadObj.name);
                        var VendorBillDocument = {
                            FileContent: self.uploadFileContent,
                            FileExtension: self.UploadedFileName().split(".")[self.UploadedFileName().split(".").length - 1],
                            AgentName: self.userSerachViewMdoel.userName(),
                            VendorBillId: 0,
                            Description: self.UploadedFileName(),
                            FileName: self.UploadedFileName(),
                            EmailId: self.emailValidation()
                        };

                        self.uploadedItems.push(VendorBillDocument);
                    };
                } else {
                    var toastrOptions1 = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.MaximumLimit10UploadsReached, "warning", null, toastrOptions1);
                }
            };

            //#region Error Details Object
            self.errorPurchaseOrderDetail = ko.validatedObservable({
                emailValidation: self.emailValidation,
                userSerachViewMdoel: self.userSerachViewMdoel
            });

            //## to Removing the attached fille.
            self.removeAttachedItem = function (lineItem) {
                // Delete from the collection
                self.selectLineItem = lineItem;
                var actionButtons = [];
                actionButtons.push({
                    actionButtonName: "Yes",
                    actionClick: self.deleteAttachFile
                });
                actionButtons.push({
                    actionButtonName: "No",
                    actionClick: null
                });

                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 0,
                    fadeOut: 0,
                    typeOfAlert: "",
                    title: "",
                    actionButtons: actionButtons
                };

                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.DoYouReallyWantToDeleteThisAttachedFile, "warning", null, toastrOptions);
            };

            // for calling ValidateVendorNotes
            self.deleteAttachFile = function () {
                self.uploadedItems.remove(self.selectLineItem);
                self.UploadedFileName('');
            };
        }
        //#endregion
        //#region Public Methods
        //Validating Vendor Bill property
        PurchaseOrderAgentEmail.prototype.validateAgentEmail = function () {
            var self = this;

            self.userSerachViewMdoel.vaildateSearchVendorNameControl();
            if (self.errorPurchaseOrderDetail.errors().length != 0) {
                self.errorPurchaseOrderDetail.errors.showAllMessages();
                return true;
            } else {
                return false;
            }
        };

        // Shows the message box as pr the given title and message
        PurchaseOrderAgentEmail.prototype.showConfirmationMessage = function (message, title, fisrtButtoName, secondButtonName, yesCallBack, noCallBack) {
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
        PurchaseOrderAgentEmail.prototype.closePopup = function (dialogResult) {
            dialogResult.__dialog__.close(this, dialogResult);
            return true;
        };

        //#endregion
        //#region Private Methods
        //#endregion
        //#region Life Cycle Event
        PurchaseOrderAgentEmail.prototype.compositionComplete = function (view, parent) {
            $('#txtuserName').focus();
        };

        // Activate the view and bind the selected data from the main view
        PurchaseOrderAgentEmail.prototype.activate = function (data) {
            var self = this;
            if (data != null) {
                self.purchaseOrderEmail = data;
            } else {
                refSystem.log('error in the calling method of agent mail');
            }
        };
        return PurchaseOrderAgentEmail;
    })();

    return PurchaseOrderAgentEmail;
});
