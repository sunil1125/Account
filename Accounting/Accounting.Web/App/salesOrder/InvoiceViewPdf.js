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
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/client/SalesOrderClient', 'services/models/common/Enums'], function(require, exports, ___router__, ___app__, __refSalesOrderClient__, __refEnums__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refSalesOrderClient = __refSalesOrderClient__;
    var refEnums = __refEnums__;
    

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
    ** <id>DE24384</id> <by>Janakiram</by> <date>07-07-2016</date> <description>Removed query string value customerBolNumber from url and removed customerBolNumber properties</description>
    ** </changeHistory>
    ***********************************************/
    var PrintInvoiceViewModel = (function () {
        //#endregion
        //#region Constructors
        function PrintInvoiceViewModel() {
            //#region Members
            this.salesOrderClient = null;
            this.listProgress = ko.observable(false);
            this.printBolHtml = ko.observable('');
            this.bolNumber = ko.observable('');
            this.pdfHeight = refEnums.Enums.PDFViewerDimensions.ViewBOLPDFHeight;
            this.pdfWidth = refEnums.Enums.PDFViewerDimensions.ViewBOLPDFWidth;
            this.bolViewUrl = 'documentViewer/GetInvoiceDocumentAsPDF?componentURL=';
            this.bolDownloadUrl = 'documentViewer/DownloadInvoiceDocumentAsPDF?componentURL=';
            this.serviceUrl = 'Accounting/GetInvoiceAsHtmlBody/';
            var self = this;
            self.salesOrderClient = new refSalesOrderClient.SalesOrderClient();

            return self;
        }
        //#endregion
        //#region Internal Methods
        PrintInvoiceViewModel.prototype.load = function (bindedData) {
            if (!bindedData)
                return;

            var self = this;

            //** if there is no data is registered then make a server call. */
            self.listProgress(true);
            var bolNumber = bindedData.bolNumber;
            self.bolNumber(bolNumber);
        };

        //#endregion
        //#region Life Cycle Event
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        PrintInvoiceViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //The composition engine will execute it prior to calling the binder.
        PrintInvoiceViewModel.prototype.activate = function () {
            return true;
        };

        PrintInvoiceViewModel.prototype.compositionComplete = function () {
            var self = this, timeoutcount = 0;
            var lURL = '', alternativeURL = '';

            if (self.bolNumber()) {
                // ###START: DE24384
                lURL = self.bolViewUrl + self.serviceUrl + '/' + self.pdfHeight + '/' + self.pdfWidth + '/' + self.bolNumber();
                alternativeURL = self.bolDownloadUrl + self.serviceUrl + '/' + self.pdfHeight + '/' + self.pdfWidth + '/' + self.bolNumber();

                // ###END: DE24384
                Utils.addObjectTagToControl('divInvoiceContainer', (lURL), 'application/pdf', alternativeURL);

                var checkFileDownloadComplete = function () {
                    if (document.cookie.indexOf("fileDownload=true") != -1) {
                        document.cookie = "fileDownload=; expires=" + new Date(1000).toUTCString() + "; path=/";

                        self.listProgress(false);

                        return;
                    }

                    if (timeoutcount < 25) {
                        setTimeout(checkFileDownloadComplete, 500);
                    } else {
                        document.cookie = "fileDownload=; expires=" + new Date(1000).toUTCString() + "; path=/";
                        self.listProgress(false);
                    }
                    timeoutcount += 1;
                };
                setTimeout(checkFileDownloadComplete, 500);
            }
        };

        //To load the registered data if any existed.
        PrintInvoiceViewModel.prototype.beforeBind = function () {
            var self = this;
            _app.trigger("loadMyData", function (data) {
                if (data) {
                    self.load(data);
                } else {
                    _app.trigger("closeActiveTab");
                    _app.trigger("NavigateTo", 'Home');
                }
            });
        };
        return PrintInvoiceViewModel;
    })();

    return PrintInvoiceViewModel;
});
