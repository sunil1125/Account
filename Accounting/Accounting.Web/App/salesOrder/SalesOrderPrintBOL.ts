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
//#endregion

/***********************************************
  Sales Order PRINT BOL ViewModel
************************************************
** <summary>
** Sales Order PRINT BOL ViewModel
** </summary>
** <createDetails>
** <id>US13829</id><by>Satish</by><date>15th Dec, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id></id><by></by><date></date>
** </changeHistory>

***********************************************/

class PrintBolViewModel {
    //#region Members
    salesOrderClient: refSalesOrderClient.SalesOrderClient = null;
    listProgress: KnockoutObservable<boolean> = ko.observable(false);
    printBolHtml: KnockoutObservable<string> = ko.observable('');
    bolNumber: KnockoutObservable<string> = ko.observable('');
    customerBolNumber: KnockoutObservable<string> = ko.observable('');
    public pdfHeight: number = refEnums.Enums.PDFViewerDimensions.ViewBOLPDFHeight;
    public pdfWidth: number = refEnums.Enums.PDFViewerDimensions.ViewBOLPDFWidth;
    bolViewUrl: string = 'documentViewer/GetBOLDocumentAsPDF?componentURL=';
    bolDownloadUrl: string = 'documentViewer/DownloadBOLDocumentAsPDF?componentURL=';
    public serviceUrl: string = 'Accounting/GetPrintBOLBody/';

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
        var bolNumber = bindedData.bolNumber,
        customerBolNumber = bindedData.customerBolNumber;
        self.bolNumber(bolNumber);
        self.customerBolNumber(customerBolNumber);
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
            lURL = self.bolViewUrl + self.serviceUrl + self.customerBolNumber() + '/' + self.pdfHeight + '/' + self.pdfWidth + '/' + self.bolNumber();
            alternativeURL = self.bolDownloadUrl + self.serviceUrl + self.customerBolNumber() + '/' + self.pdfHeight + '/' + self.pdfWidth + '/' + self.bolNumber();

            Utils.addObjectTagToControl('divBOLContainer', (lURL), 'application/pdf', alternativeURL);

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

return PrintBolViewModel;