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
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refEnums = require('services/models/common/Enums');
import refDocumentModel = require('services/models/common/DocumentRequestModel');
//#endregion

/***********************************************
  Sales Order PRINT BOL ViewModel
************************************************
** <summary>
** Sales Order PRINT BOL ViewModel
** </summary>
** <createDetails>
** <id>US22997</id> <by>Janakiram</by> <date>07-07-2016</date> <description>Invoice View Pdf od Download</description>
** </createDetails>
** <changeHistory>
** <id>DE24384</id> <by>Janakiram</by> <date>07-07-2016</date> <description>Removed query string value customerBolNumber from url</description>
** </changeHistory>
***********************************************/

class PrintInvoiceViewModel {
	//#region Members
	salesOrderClient: refSalesOrderClient.SalesOrderClient = null;
	listProgress: KnockoutObservable<boolean> = ko.observable(false);
	printBolHtml: KnockoutObservable<string> = ko.observable('');
	bolNumber: KnockoutObservable<string> = ko.observable('');
	public pdfHeight: number = refEnums.Enums.PDFViewerDimensions.ViewBOLPDFHeight;
	public pdfWidth: number = refEnums.Enums.PDFViewerDimensions.ViewBOLPDFWidth;
	bolViewUrl: string = 'documentViewer/GetInvoiceDocumentAsPDF?componentURL=';
	bolDownloadUrl: string = 'documentViewer/DownloadInvoiceDocumentAsPDF?componentURL=';
	public serviceUrl: string = 'Accounting/GetInvoiceAsHtmlBody/';

	//#endregion
	//#region Constructors
	constructor() {
		var self = this;
		self.salesOrderClient = new refSalesOrderClient.SalesOrderClient();

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
		var bolNumber = bindedData.bolNumber;
		self.bolNumber(bolNumber);
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

		if (self.bolNumber()) {

			// ###START: DE24384
			lURL = self.bolViewUrl + self.serviceUrl + '/' + self.pdfHeight + '/' + self.pdfWidth + '/' + self.bolNumber();
			alternativeURL = self.bolDownloadUrl + self.serviceUrl + '/' + self.pdfHeight + '/' + self.pdfWidth + '/' + self.bolNumber();
			// ###END: DE24384

			Utils.addObjectTagToControl('divInvoiceContainer', (lURL), 'application/pdf', alternativeURL);

			var checkFileDownloadComplete = function () {
				// has the cookie been written due to a file download occuring?
				if (document.cookie.indexOf("fileDownload=true") != -1) {
					document.cookie = "fileDownload=; expires=" + new Date(1000).toUTCString() + "; path=/";	//remove the cookie named fileDownload

					self.listProgress(false);

					return;
				}

				if (timeoutcount < 25) {
					setTimeout(checkFileDownloadComplete, 500);
				}
				else {
					document.cookie = "fileDownload=; expires=" + new Date(1000).toUTCString() + "; path=/";	//remove the cookie named fileDownload
					self.listProgress(false);
				}
				timeoutcount += 1;
			}
			setTimeout(checkFileDownloadComplete, 500);
		}
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

return PrintInvoiceViewModel;