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

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refEnums = require('services/models/common/Enums');
import _refForeignBolEmailModel = require('services/models/purchaseOrder/ForeignBolEmail');
import refpurchaseOrderClient = require('services/client/PurchaseOrderClient');
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

class ForeignBolAgentEmail {
    //#region Members
    //For removing Attached Item
    removeAttachedItem: (lineItem: ForeignBolAgentEmail) => void;
    uploadFileContent: string;
    UploadedFileName: KnockoutObservable<string> = ko.observable();
    commonUtils = new Utils.Common();
    onSendMail: Function;
    purchaseOrderClient: refpurchaseOrderClient.PurchaseOrderClient = new refpurchaseOrderClient.PurchaseOrderClient();
    uploadedItems: KnockoutObservableArray<any> = ko.observableArray();

    // ###START: US23323
    emailValidation: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "Please Enter Email." }, multiemail: true });
    // ###END: US23323

    //For Validation purpose
    errorPurchaseOrderDetail: KnockoutValidationGroup;
    ForeignBolEmail: IForeignBolEmail = new _refForeignBolEmailModel.Models.ForeignBolEmail();
    agentEmailId: KnockoutObservable<string> = ko.observable('');
    // To disable send Mail Button
    isMailNotSend: KnockoutObservable<boolean> = ko.observable(true);
    //errorEmailAddresses: KnockoutValidationGroup;
    //to hold comments in mail body
    Comments: KnockoutObservable<string> = ko.observable('');
    refresh: Function;
    private selectLineItem: ForeignBolAgentEmail;
    listProgress: KnockoutObservable<boolean> = ko.observable(false);
    agentName: KnockoutObservable<string> = ko.observable('');
    agentId: KnockoutObservable<number> = ko.observable(0);
    customerName: KnockoutObservable<string> = ko.observable('');
    foreignBolEmailExpiry: KnockoutObservable<string> = ko.observable('');
    isForeignBolChecked: KnockoutObservable<boolean> = ko.observable(false);
    vendorBillId: KnockoutObservable<number> = ko.observable(0);
    customerId: KnockoutObservable<number> = ko.observable(0);
    emailData: any;
    //#endregion

    //#region Constructor
    constructor() {
        var self = this;
        var commonUtils = new Utils.Common();

        self.onSendMail = (target) => {
            var self = this;
            // ###START: US23323
            if (!self.validateAgentEmail()) {
                // ###END: US23323

                self.ForeignBolEmail.CustomerName = self.customerName();
                self.ForeignBolEmail.AgentName = self.agentName();

                if (self.emailValidation() == "" || self.emailValidation() === null || self.emailValidation() === 'undefined') {
                    self.ForeignBolEmail.EmailAddress = self.agentEmailId();
                }
                else {
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
                var successCallBack = (data) => {
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
                    }
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SendSuccessfullyMail, "success", null, toastrOptions);

                    //target.__dialog__.close();
                    self.listProgress(false);
                },
                    faliureCallBack = (message) => {
                        self.listProgress(false);
                        self.isMailNotSend(true);
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        }
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
                    };
                // ###START: US22471
                var failCallBackInfo = (message) => {
                    // Saving failed call back info message
                    self.listProgress(false);
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    }

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, message, "info", null, toastrOptions, null);
                };
                self.isMailNotSend(false);
                //self.purchaseOrderEmail.VendorBillDocuments = self.uploadedItems();
                self.purchaseOrderClient.sendForeignBolAgentMail(self.ForeignBolEmail, successCallBack, faliureCallBack, failCallBackInfo);
                // ###END: US22471
                
                // ###START: US23323
            }
            // ###START: US23323
        }

		////This is triggered when the user is uploading a document.
		//#region Error Details Object
		self.errorPurchaseOrderDetail = ko.validatedObservable({
            emailValidation: self.emailValidation
        });

        //## to Removing the attached fille.
        self.removeAttachedItem = function (lineItem: ForeignBolAgentEmail) {
            self.selectLineItem = lineItem;
            self.uploadedItems.remove(self.selectLineItem);
            self.UploadedFileName('');
        };
    }

    //#endregion

    //#region Public Methods
    public load() {
    }
    //Validating Vendor Bill property
    public validateAgentEmail() {
        var self = this;
        if (self.errorPurchaseOrderDetail.errors().length != 0) {
            self.errorPurchaseOrderDetail.errors.showAllMessages();
            return true;
        } else {
            return false;
        }
    }

    // Shows the message box as pr the given title and message
    public showConfirmationMessage(message: string, title: string, fisrtButtoName: string, secondButtonName: string, yesCallBack: () => boolean, noCallBack: () => boolean) {
        var self = this;

        var varMsgBox: Array<IMessageBoxButtonOption> = [
            {
                id: 0, name: fisrtButtoName, callback: (): boolean => {
                    return yesCallBack();
                },
            },
            {
                id: 1, name: secondButtonName, callback: (): boolean => {
                    return noCallBack();
                }
            }
        ];

        ////initialize message box control arguments
        var optionControlArgs: IMessageBoxOption = {
            options: varMsgBox,
            message: message,
            title: title
        }; //Call the dialog Box functionality to open a Popup
        _app.showDialog('templates/messageBox', optionControlArgs, 'slideDown');
    }
    //close popup
    public closePopup(dialogResult) {
        dialogResult.__dialog__.close(this, dialogResult);
        return true;
    }

    //#endregion

    //#region Private Methods

    //#endregion

    //#region Life Cycle Event
    //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
    public beforeBind() {
        var self = this;
        self.load();
    }

    public compositionComplete(view, parent) {
        $('#txtuserName').focus();
    }

    // Activate the view and bind the selected data from the main view
    public activate(data: any) {
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
            var successCallBack = data=> {
                self.uploadedItems.removeAll();
                self.uploadedItems(data);
                //data.foreach(() => {
                //});
                //self.purchaseOrderPODDocViewModel.purchaseOrderPodDocDetail.removeAll();
                //self.purchaseOrderPODDocViewModel.reportContainer.listProgress(true);
                //self.purchaseOrderPODDocViewModel.initializeSalesOrderPodDocDetails(data, self.purchaseOrderDetailsViewModel.proNumber(), self.purchaseOrderDetailsViewModel.vendorNameSearchList.ID(), self.purchaseOrderDetailsViewModel.bolNumber(), self.purchaseOrderDetailsViewModel.vendorBillId(), !self.IsReadOnly, self.purchaseOrderDetailsViewModel.vendorName(), self.OriginZip());
                //self.purchaseOrderPODDocViewModel.reportContainer.listProgress(false);
            },

                faliureCallBack = message => {
                    console.log(message);
                    //self.purchaseOrderPODDocViewModel.reportContainer.listProgress(false);
                };
            self.purchaseOrderClient.getPurchaseOrderPodDocDetails(data.bindingObject.uploadData, successCallBack, faliureCallBack);
        }
        else {
            refSystem.log('error in the calling method of agent mail');
        }
    }
    //#endregion
}

return ForeignBolAgentEmail;