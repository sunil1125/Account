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
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'services/models/common/Enums', 'services/models/salesOrder/SendAgentNotificationMailDetail', 'services/client/SalesOrderClient'], function(require, exports, ___router__, ___app__, __refSystem__, __refEnums__, __refSendAgentNotificationMailDetail__, __refSalesOrderClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    var refEnums = __refEnums__;
    var refSendAgentNotificationMailDetail = __refSendAgentNotificationMailDetail__;
    var refSalesOrderClient = __refSalesOrderClient__;

    //#endregion
    /*
    ** <summary>
    ** Sales Order Agent Notification View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US12723</id> <by>Bhanu pratap</by> <date>09-23-2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id>DE22965</id> <by>Janakiram</by> <date>25-05-2016</date> <description>Showing '&nbsp' in the Agent notification mail format. so, "Replaced" &nbsp to "&#160;"  to it & added meta tag.</description>
    ** <id>US22471</id> <by>Vasanthakumar</by> <date>03-06-2016</date> <description>Add Success Toastr message for Emails triggered by users</description>
    ** </changeHistory>
    */
    var SalesOrderAgentNotificationViewModel = (function () {
        //#endregion
        //#region Constructor
        function SalesOrderAgentNotificationViewModel() {
            //#region Members
            // AgentNotificationTypes
            this.agentNotificationTypes = ko.observableArray([]);
            this.alertMessage = ko.observableArray([]);
            // selectedNotificationType
            this.selectedNotificationType = ko.observable();
            this.emailContent = "";
            this.emailBody = "";
            //Mail Preview
            this.mailPreview = ko.observable('');
            //Enable/disbale Mail Preview
            this.isMailPreview = ko.observable(false);
            this.isalertRep = ko.observable(false);
            // Utility class object
            this.CommonUtils = new Utils.Common();
            this.salesRepName = ko.observable("");
            this.salesorderid = ko.observable(0);
            this.customer = ko.observable("");
            this.revenue = ko.observable("0");
            this.cost = ko.observable("0");
            this.currentUser = ko.observable("");
            this.salesRepId = ko.observable(0);
            this.customerBolNumber = ko.observable("");
            this.salesOrderNumber = ko.observable("");
            this.listProgressAccordian = ko.observable(false);
            this.listProgressTabbed = ko.observable(false);
            this.listProgress = ko.observable(false);
            this.customerId = ko.observable(0);
            this.commonUtils = new Utils.Common();
            this.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
            var self = this;

            // Create the Agent Notification type
            //self.agentNotificationTypes.push("Select Agent Notification");
            //self.agentNotificationTypes.push("Reweigh");
            //self.agentNotificationTypes.push("Reclass");
            //self.agentNotificationTypes.push("Reconsigned");
            //self.agentNotificationTypes.push("Limited Access");
            //self.agentNotificationTypes.push("Other");
            self.beforeBind();
            self.selectedNotificationType.subscribe(function (newValue) {
                var message = $.grep(self.alertMessage(), function (e) {
                    return e.ID === self.selectedNotificationType();
                })[0];

                if (newValue !== undefined) {
                    if (newValue == "0") {
                        self.isMailPreview(false);
                        self.isalertRep(false);
                        self.mailPreview('');
                    } else {
                        self.isMailPreview(true);
                        self.isalertRep(true);
                        self.emailContent = "";
                        self.emailContent = self.emailContent.concat(self.salesRepName().toString() + ",");
                        self.emailContent = self.emailContent.concat("\n\n");
                        self.emailContent = self.emailContent.concat("This email has been sent to alert you that Sales Order# ");
                        self.emailContent = self.emailContent.concat(self.salesorderid().toString());
                        self.emailContent = self.emailContent.concat(" for ");
                        self.emailContent = self.emailContent.concat(self.customer().toString());
                        self.emailContent = self.emailContent.concat(" has been ");
                        self.emailContent = self.emailContent.concat(message.Value.toString());
                        self.emailContent = self.emailContent.concat(" by the carrier. ");
                        self.emailContent = self.emailContent.concat("The additional cost is $" + self.cost());
                        self.emailContent = self.emailContent.concat(" and we will be billing your customer an additional $" + self.revenue() + ".\n\n");
                        self.emailContent = self.emailContent.concat("Please contact us with any questions.\n\n");
                        self.emailContent = self.emailContent.concat("Regards,\n" + self.currentUser());

                        self.mailPreview(self.emailContent.toString());
                    }
                }
            });
        }
        //#endregion
        //#region Internal Methods
        //#region Internal public Methods
        SalesOrderAgentNotificationViewModel.prototype.initializeAgentNotificationsDetails = function (salesRepName, salesorderid, customer, revenue, cost, currentUser) {
            var self = this;
            self.salesRepName(salesRepName);
            self.salesorderid(salesorderid);
            self.customer(customer);
            self.revenue(revenue);
            self.cost(cost);
            self.currentUser(currentUser);
            //self.beforeBind();
        };

        //To send Mail to Agents
        SalesOrderAgentNotificationViewModel.prototype.sendMail = function () {
            var self = this;
            var partnerCompanyId = 0;
            var isMailSent = false;
            self.listProgress(true);
            self.emailBody = "";
            self.emailBody = self.emailBody.concat("<html>");

            // ###START: DE22965
            self.emailBody = self.emailBody.concat("<meta http - equiv = 'Content-Type' content ='text/html;charset=utf-8' / >");

            // ###END: DE22965
            self.emailBody = self.emailBody.concat("<body>");
            self.emailBody = self.emailBody.concat("<table border = '0' cellpadding = '0' cellspacing = '0'>");
            var item = self.mailPreview().split("\n");
            for (var i = 0; i < item.length; ++i) {
                self.emailBody = self.emailBody.concat("<tr>");
                self.emailBody = self.emailBody.concat("<td>");

                // ###START: DE22965
                self.emailBody = self.emailBody.concat(self.CommonUtils.isNullOrEmptyOrWhiteSpaces(item[i]) ? item[i] : "&#160;");

                // ###END: DE22965
                self.emailBody = self.emailBody.concat("</td>");
                self.emailBody = self.emailBody.concat("</tr>");
            }

            self.emailBody = self.emailBody.concat("</table>");
            self.emailBody = self.emailBody.concat("</body>");
            self.emailBody = self.emailBody.concat("</html>");
            var isWhiteLabelPartnerCompany = false;

            var mailDetail = new refSendAgentNotificationMailDetail.Model.SendAgentNotificationMailDetail();
            mailDetail.DetailsToBeMailed = self.emailBody;
            mailDetail.SalesRepId = self.salesRepId();
            mailDetail.CustomerId = self.customerId();
            if (self.commonUtils.isNullOrEmptyOrWhiteSpaces(self.customerBolNumber())) {
                mailDetail.Subject = '[' + self.customerBolNumber() + '] - ' + self.commonUtils.getEnumValueById(refEnums.Enums.AgentNotifictionType, self.selectedNotificationType());
            } else {
                mailDetail.Subject = '[' + self.salesOrderNumber() + '] - ' + self.commonUtils.getEnumValueById(refEnums.Enums.AgentNotifictionType, self.selectedNotificationType());
            }

            self.salesOrderClient.SendAgentNotificationMail(mailDetail, function (message) {
                // Saving successful callback
                self.listProgress(false);
                var toastrOptions1 = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.MailSentSuccessfullyMessage, "success", null, toastrOptions1, null);
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

                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions, null);
                // ###START: US22471
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

                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, message, "info", null, toastrOptions, null);
                // ###END: US22471
            });
        };

        //## to enable Alret rep button if email body is entered/copy pasted in text area
        SalesOrderAgentNotificationViewModel.prototype.onKeyUp = function () {
            var self = this;

            if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.mailPreview().trim())) {
                self.isalertRep(true);
            } else {
                self.isalertRep(false);
            }
        };

        //to show the progress bar
        SalesOrderAgentNotificationViewModel.prototype.ShowProgressBar = function (progress) {
            var self = this;
            self.listProgressAccordian(progress);
            self.listProgressTabbed(progress);
        };

        //#endregion
        //#region Life Cycle
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        SalesOrderAgentNotificationViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //The composition engine will execute it prior to calling the binder.
        SalesOrderAgentNotificationViewModel.prototype.activate = function () {
            return true;
        };

        SalesOrderAgentNotificationViewModel.prototype.beforeBind = function () {
            var self = this;

            if (refSystem.isObject(refEnums.Enums.AgentNotifictionAlertMessageType)) {
                self.agentNotificationTypes.removeAll();
                for (var item in refEnums.Enums.AgentNotifictionAlertMessageType) {
                    self.alertMessage.push(refEnums.Enums.AgentNotifictionAlertMessageType[item]);
                }
            }

            if (refSystem.isObject(refEnums.Enums.AgentNotifictionType)) {
                self.agentNotificationTypes.removeAll();
                for (var item in refEnums.Enums.AgentNotifictionType) {
                    self.agentNotificationTypes.push(refEnums.Enums.AgentNotifictionType[item]);
                }
            }
        };

        SalesOrderAgentNotificationViewModel.prototype.cleanup = function () {
            var self = this;

            for (var property in self) {
                delete self[property];
            }
            delete self;
        };
        return SalesOrderAgentNotificationViewModel;
    })();
    exports.SalesOrderAgentNotificationViewModel = SalesOrderAgentNotificationViewModel;
});
