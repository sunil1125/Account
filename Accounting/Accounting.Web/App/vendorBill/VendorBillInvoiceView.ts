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
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refVendorBillClient = require('services/client/VendorBillClient');
import refEnums = require('services/models/common/Enums');
import refDocumentModel = require('services/models/common/DocumentRequestModel');

//#endregion

/*
** <summary>
** Vendor Bill Invoice  View Model.
** </summary>
** <createDetails>
** <id>US8214</id> <by>ACHAL RASTOGI</by> <date>04-09-2014</date>}
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by> <date></date>
** </changeHistory>
*/
class VendorBillInvoiceViewModel {
	//#region Members
	vendorBillClient: refVendorBillClient.VendorBillClient = null;
	listProgress: KnockoutObservable<boolean> = ko.observable(false);
    invoiceHtml: KnockoutObservable<string> = ko.observable('');
    bolNumber: KnockoutObservable<string> = ko.observable('');
    invoiceNumber: KnockoutObservable<string> = ko.observable('');
    public pdfHeight: number = refEnums.Enums.PDFViewerDimensions.ViewINVPDFHeight;
    public pdfWidth: number = refEnums.Enums.PDFViewerDimensions.ViewINVPDFWidth;
    invViewUrl: string = 'documentViewer/GetInvoiceStatementDocumentAsPDF?componentURL=';
	public serviceUrl: string = 'Accounting/GetInvoiceHtmlBody/';
	private documentRequest: refDocumentModel.Models.DocumentRequestModel = null;
	//#endregion

	//#region Constructors
	constructor() {
		var self = this;
		self.vendorBillClient = new refVendorBillClient.VendorBillClient();

		return self;
	}
	//#endregion

	//#region Internal Methods
	public load(bindedData) {
		//** if bindedData is null then return false. */
		if (!bindedData)
			return;

		var self = this;

		//** if there is no data is registered then make a server call. */
		self.listProgress(true);
        self.bolNumber(bindedData.bolNumber);
        self.invoiceNumber(bindedData.invoiceNumber);
		self.documentRequest = new refDocumentModel.Models.DocumentRequestModel();
		self.documentRequest.BolNumber = self.bolNumber();
		self.documentRequest.InvoiceNumber = self.invoiceNumber();
			var successCallBack = data => {
				self.invoiceHtml(data);
				self.listProgress(false);
			},
			faliureCallBack = message => {
				self.listProgress(false);
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
			};

		self.vendorBillClient.getInvoiceHtmlBody(self.documentRequest, successCallBack, faliureCallBack);
	}
	//#endregion

	//#region Life Cycle Event
	// Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
	public attached() {
		_app.trigger('viewAttached');
	}

	//The composition engine will execute it prior to calling the binder.
	public activate() {
		return true;
    }

    public compositionComplete() {
        var self = this,
            timeoutcount: number = 0;
        var lURL = '', alternativeURL = '';

        //if (self.invoiceNumber()) {
        //    lURL = self.invViewUrl + self.serviceUrl + self.invoiceNumber() + '/' + self.pdfHeight + '/' + self.pdfWidth + '/' + self.bolNumber();

        //    Utils.addObjectTagToControl('divInvContainer', (lURL), 'application/pdf', alternativeURL);

        //    var checkFileDownloadComplete = function () {
        //        // has the cookie been written due to a file download occuring?
        //        if (document.cookie.indexOf("fileDownload=true") != -1) {
        //            document.cookie = "fileDownload=; expires=" + new Date(1000).toUTCString() + "; path=/";	//remove the cookie named fileDownload

        //            self.listProgress(false);

        //            return;
        //        }

        //        if (timeoutcount < 25) {
        //            setTimeout(checkFileDownloadComplete, 500);
        //        }
        //        else {
        //            document.cookie = "fileDownload=; expires=" + new Date(1000).toUTCString() + "; path=/";	//remove the cookie named fileDownload
        //            self.listProgress(false);
        //        }
        //        timeoutcount += 1;
        //    }
		//	setTimeout(checkFileDownloadComplete, 500);
        //}
    }

	//To load the registered data if any existed.
	public beforeBind() {
		var self = this;
		_app.trigger("loadMyData", function (data) {
			if (data) {
				self.load(data);
			} else {
				_app.trigger("closeActiveTab");
				_app.trigger("NavigateTo", 'Home');
			}
		});
	}
	//#endregion
}

return VendorBillInvoiceViewModel;