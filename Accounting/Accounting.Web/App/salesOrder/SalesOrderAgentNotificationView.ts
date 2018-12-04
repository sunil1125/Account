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

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import _refAppShell = require('shell');
import refEnums = require('services/models/common/Enums');
import refSendAgentNotificationMailDetail = require('services/models/salesOrder/SendAgentNotificationMailDetail');
import refSalesOrderClient = require('services/client/SalesOrderClient');

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
export class SalesOrderAgentNotificationViewModel {
    //#region Members

    // AgentNotificationTypes
    agentNotificationTypes: KnockoutObservableArray<IAgentNotifictionType> = ko.observableArray([]);

    alertMessage: KnockoutObservableArray<IAgentNotifictionAlertMessageType> = ko.observableArray([]);

    // selectedNotificationType
    selectedNotificationType: KnockoutObservable<string> = ko.observable();
    emailContent: string = "";
    emailBody: string = "";
    //Mail Preview
    mailPreview: KnockoutObservable<string> = ko.observable('');
    //Enable/disbale Mail Preview
    isMailPreview: KnockoutObservable<boolean> = ko.observable(false);
    isalertRep: KnockoutObservable<boolean> = ko.observable(false);
    // Utility class object
    CommonUtils: CommonStatic = new Utils.Common();

    salesRepName: KnockoutObservable<string> = ko.observable("");
    salesorderid: KnockoutObservable<number> = ko.observable(0);
    customer: KnockoutObservable<string> = ko.observable("");
    revenue: KnockoutObservable<string> = ko.observable("0");
    cost: KnockoutObservable<string> = ko.observable("0");
    currentUser: KnockoutObservable<string> = ko.observable("");
    salesRepId: KnockoutObservable<number> = ko.observable(0);
    customerBolNumber: KnockoutObservable<string> = ko.observable("");
    salesOrderNumber: KnockoutObservable<string> = ko.observable("");
    listProgressAccordian: KnockoutObservable<boolean> = ko.observable(false);
    listProgressTabbed: KnockoutObservable<boolean> = ko.observable(false);
    listProgress: KnockoutObservable<boolean> = ko.observable(false);
    customerId: KnockoutObservable<number> = ko.observable(0);
    commonUtils = new Utils.Common()
	salesOrderClient: refSalesOrderClient.SalesOrderClient = new refSalesOrderClient.SalesOrderClient();
    //#endregion

    //#region Constructor
    constructor() {
        var self = this;
        // Create the Agent Notification type
        //self.agentNotificationTypes.push("Select Agent Notification");
        //self.agentNotificationTypes.push("Reweigh");
        //self.agentNotificationTypes.push("Reclass");
        //self.agentNotificationTypes.push("Reconsigned");
        //self.agentNotificationTypes.push("Limited Access");
        //self.agentNotificationTypes.push("Other");

        self.beforeBind();
        self.selectedNotificationType.subscribe((newValue) => {
            var message = $.grep(self.alertMessage(), function (e) {
				return e.ID === self.selectedNotificationType()
			})[0];

            if (newValue !== undefined) {
                if (newValue == "0") {
                    self.isMailPreview(false);
                    self.isalertRep(false);
                    self.mailPreview('');
                }
                else {
                    self.isMailPreview(true);
                    self.isalertRep(true)
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
        })
	}
    //#endregion

    //#region Internal Methods
    //#region Internal public Methods
    public initializeAgentNotificationsDetails(salesRepName: string, salesorderid: number, customer: string, revenue: string, cost: string, currentUser: string) {
        var self = this;
        self.salesRepName(salesRepName);
        self.salesorderid(salesorderid);
        self.customer(customer);
        self.revenue(revenue);
        self.cost(cost);
        self.currentUser(currentUser);
        //self.beforeBind();
    }

    //To send Mail to Agents
    public sendMail() {
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
        }
        else {
            mailDetail.Subject = '[' + self.salesOrderNumber() + '] - ' + self.commonUtils.getEnumValueById(refEnums.Enums.AgentNotifictionType, self.selectedNotificationType());
        }

		self.salesOrderClient.SendAgentNotificationMail(mailDetail, message => {
			// Saving successful callback
			self.listProgress(false);
			var toastrOptions1 = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 10,
				fadeOut: 10,
				typeOfAlert: "",
				title: ""
			}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.MailSentSuccessfullyMessage, "success", null, toastrOptions1, null);
		}, message => {
				// Saving failed call back
				self.listProgress(false);
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}

			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions, null);
			// ###START: US22471
		}, message => {
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
			// ###END: US22471
			});
    }

    //## to enable Alret rep button if email body is entered/copy pasted in text area
    public onKeyUp() {
        var self = this;

        if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.mailPreview().trim())) {
            self.isalertRep(true);
        }
        else {
            self.isalertRep(false);
        }
    }

    //to show the progress bar
    private ShowProgressBar(progress: boolean) {
        var self = this;
        self.listProgressAccordian(progress);
        self.listProgressTabbed(progress);
    }
    //#endregion

    //#region Life Cycle
    // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
    public attached() {
        _app.trigger('viewAttached');
    }

    //The composition engine will execute it prior to calling the binder.
    public activate() {
        return true;
    }

    public beforeBind() {
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
    }

    public cleanup() {
        var self = this;

        for (var property in self) {
            delete self[property];
        }
        delete self;
    }

    //#endregion
}