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
    ** <id>US13829</id><by>Satish</by><date>15th Dec, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id><by></by><date></date>
    ** </changeHistory>
    
    ***********************************************/
    var PrintBolViewModel = (function () {
        //#endregion
        //#region Constructors
        function PrintBolViewModel() {
            //#region Members
            this.salesOrderClient = null;
            this.listProgress = ko.observable(false);
            this.printBolHtml = ko.observable('');
            this.bolNumber = ko.observable('');
            this.customerBolNumber = ko.observable('');
            this.pdfHeight = refEnums.Enums.PDFViewerDimensions.ViewBOLPDFHeight;
            this.pdfWidth = refEnums.Enums.PDFViewerDimensions.ViewBOLPDFWidth;
            this.bolViewUrl = 'documentViewer/GetBOLDocumentAsPDF?componentURL=';
            this.bolDownloadUrl = 'documentViewer/DownloadBOLDocumentAsPDF?componentURL=';
            this.serviceUrl = 'Accounting/GetPrintBOLBody/';
            var self = this;
            self.salesOrderClient = new refSalesOrderClient.SalesOrderClient();

            return self;
        }
        //#endregion
        //#region Internal Methods
        PrintBolViewModel.prototype.load = function (bindedData) {
            if (!bindedData)
                return;

            var self = this;

            //** if there is no data is registered then make a server call. */
            self.listProgress(true);
            var bolNumber = bindedData.bolNumber, customerBolNumber = bindedData.customerBolNumber;
            self.bolNumber(bolNumber);
            self.customerBolNumber(customerBolNumber);
        };

        //#endregion
        //#region Life Cycle Event
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        PrintBolViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //The composition engine will execute it prior to calling the binder.
        PrintBolViewModel.prototype.activate = function () {
            return true;
        };

        PrintBolViewModel.prototype.compositionComplete = function () {
            var self = this, timeoutcount = 0;
            var lURL = '', alternativeURL = '';

            if (self.bolNumber()) {
                lURL = self.bolViewUrl + self.serviceUrl + self.customerBolNumber() + '/' + self.pdfHeight + '/' + self.pdfWidth + '/' + self.bolNumber();
                alternativeURL = self.bolDownloadUrl + self.serviceUrl + self.customerBolNumber() + '/' + self.pdfHeight + '/' + self.pdfWidth + '/' + self.bolNumber();

                Utils.addObjectTagToControl('divBOLContainer', (lURL), 'application/pdf', alternativeURL);

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
        PrintBolViewModel.prototype.beforeBind = function () {
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
        return PrintBolViewModel;
    })();

    return PrintBolViewModel;
});
