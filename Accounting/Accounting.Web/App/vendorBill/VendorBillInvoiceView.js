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
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/client/VendorBillClient', 'services/models/common/Enums', 'services/models/common/DocumentRequestModel'], function(require, exports, ___router__, ___app__, __refVendorBillClient__, __refEnums__, __refDocumentModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refVendorBillClient = __refVendorBillClient__;
    var refEnums = __refEnums__;
    var refDocumentModel = __refDocumentModel__;

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
    var VendorBillInvoiceViewModel = (function () {
        //#endregion
        //#region Constructors
        function VendorBillInvoiceViewModel() {
            //#region Members
            this.vendorBillClient = null;
            this.listProgress = ko.observable(false);
            this.invoiceHtml = ko.observable('');
            this.bolNumber = ko.observable('');
            this.invoiceNumber = ko.observable('');
            this.pdfHeight = refEnums.Enums.PDFViewerDimensions.ViewINVPDFHeight;
            this.pdfWidth = refEnums.Enums.PDFViewerDimensions.ViewINVPDFWidth;
            this.invViewUrl = 'documentViewer/GetInvoiceStatementDocumentAsPDF?componentURL=';
            this.serviceUrl = 'Accounting/GetInvoiceHtmlBody/';
            this.documentRequest = null;
            var self = this;
            self.vendorBillClient = new refVendorBillClient.VendorBillClient();

            return self;
        }
        //#endregion
        //#region Internal Methods
        VendorBillInvoiceViewModel.prototype.load = function (bindedData) {
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
            var successCallBack = function (data) {
                self.invoiceHtml(data);
                self.listProgress(false);
            }, faliureCallBack = function (message) {
                self.listProgress(false);
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };

                Utility.ShowToastr(false, message, "error", null, toastrOptions);
            };

            self.vendorBillClient.getInvoiceHtmlBody(self.documentRequest, successCallBack, faliureCallBack);
        };

        //#endregion
        //#region Life Cycle Event
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        VendorBillInvoiceViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //The composition engine will execute it prior to calling the binder.
        VendorBillInvoiceViewModel.prototype.activate = function () {
            return true;
        };

        VendorBillInvoiceViewModel.prototype.compositionComplete = function () {
            var self = this, timeoutcount = 0;
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
        };

        //To load the registered data if any existed.
        VendorBillInvoiceViewModel.prototype.beforeBind = function () {
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
        return VendorBillInvoiceViewModel;
    })();

    return VendorBillInvoiceViewModel;
});
