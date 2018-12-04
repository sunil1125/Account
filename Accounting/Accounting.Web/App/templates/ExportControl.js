/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created: October 22, 2013 */
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.datepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
/// <reference path="../../Scripts/Utility.ts" />
define(["require", "exports", 'durandal/app', 'durandal/system', 'services/models/common/Enums'], function(require, exports, ___app__, __refSystem__, __refEnums__) {
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    var refEnums = __refEnums__;

    //import ReportDownload = require('services/ReportDownloader');
    (function (ReportExportType) {
        ReportExportType[ReportExportType["CSV"] = 0] = "CSV";
        ReportExportType[ReportExportType["Excel"] = 1] = "Excel";
        ReportExportType[ReportExportType["Pdf"] = 2] = "Pdf";
    })(exports.ReportExportType || (exports.ReportExportType = {}));
    var ReportExportType = exports.ReportExportType;

    /** <summary>
    * * Export Control View Model
    * * < / summary >
    * * <createDetails>proNumber
    * * <id> < /id> <by>Achal</by > <date>October 22, 2013</date >
    * * < / createDetails >
    * * <changeHistory>
    * * < / changeHistory >
    */
    var ExportControl = (function () {
        function ExportControl(Export) {
            this.exportOptionList = ko.observableArray([]);
            this.fromDate = ko.observable();
            this.toDate = ko.observable();
            this.reportName = ko.observable();
            var self = this;
            self.exportOptionList(ko.unwrap(Export));

            self.onButtonClick = function (exportOpt) {
                if (refSystem.isFunction(self.getReportGenerateData)) {
                    var data = ko.unwrap(self.getReportGenerateData.apply(null, [self]));
                    if (data.length > 0) {
                        switch (exportOpt.exportType) {
                            case ReportExportType.CSV:
                                self.GenerateCsvReport(exportOpt);
                                break;
                            case ReportExportType.Excel:
                                self.GenerateExcelReport(exportOpt);
                                break;
                            case ReportExportType.Pdf:
                                self.GeneratePdfReport(exportOpt);
                                break;
                        }
                    } else
                        //alert("No Records to download.");
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 15,
                            fadeOut: 15,
                            typeOfAlert: "",
                            title: ""
                        };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.NoRecordsToDownload, "success", null, toastrOptions);
                } else
                    //alert("Report generate data has not been set.");
                    var toastrOptions1 = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 15,
                        fadeOut: 15,
                        typeOfAlert: "",
                        title: ""
                    };

                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.ReportGenerateDataHasNotBeenSet, "info", null, toastrOptions1);
            };

            self.setReportGenerateCriteria = function (fromDate, toDate, reportName) {
                var CommonUtils = new Utils.Common();
                var rptFromDate = CommonUtils.convertToDateString(ko.unwrap(fromDate), 'yyyy-mm-dd');
                var rpttoDate = CommonUtils.convertToDateString(ko.unwrap(toDate), 'yyyy-mm-dd');

                if (!(self.fromDate() == rptFromDate && self.toDate() == rpttoDate && self.reportName() == ko.unwrap(reportName)))
                    self.PdfReportLink = "";

                self.fromDate(rptFromDate);
                self.toDate(rpttoDate);
                self.reportName(ko.unwrap(reportName));
            };

            self.GenerateCsvReport = function (exportOpt) {
                exportOpt.enabled(false);
                //ReportDownload.ReportDownloader.prototype.exportReportToCsvExcel("Csv", self.reportName(), self.fromDate(), self.toDate(),
                //    function (data) {
                //        window.location.href = 'documentViewer/DownloadReport?FileLocationURL=' + data;
                //        exportOpt.enabled(true);
                //    },
                //    function () {
                //        //alert("Please try again later");
                //        _app.showDialog('templates/messageBox', { title: "Alert", message: "Please try again later" }, 'slideDown');
                //        exportOpt.enabled(true);
                //    });
            };

            self.GenerateExcelReport = function (exportOpt) {
                exportOpt.enabled(false);
                //ReportDownload.ReportDownloader.prototype.exportReportToCsvExcel("Excel", self.reportName(), self.fromDate(), self.toDate(),
                //    function (data) {
                //        window.location.href = 'documentViewer/DownloadReport?FileLocationURL=' + data;
                //        exportOpt.enabled(true);
                //    },
                //    function () {
                //        //alert("Please try again later");
                //        _app.showDialog('templates/messageBox', { title: "Alert", message: "Please try again later" }, 'slideDown');
                //        exportOpt.enabled(true);
                //    });
            };

            self.GeneratePdfReport = function (exportOpt) {
                if (self.PdfReportLink != "") {
                    var downloadLink = document.createElement("a");
                    downloadLink.href = self.PdfReportLink;
                    $(downloadLink).attr("download", "data:application/pdf:" + self.PdfReportLink);
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                    return;
                } else {
                    exportOpt.enabled(false);
                    //ReportDownload.ReportDownloader.prototype.exportReportToPdf(self.reportName(), self.fromDate(), self.toDate(),
                    //    function (data) {
                    //        self.PdfReportLink = data;
                    //        window.location.href = 'documentViewer/DownloadReport?FileLocationURL=' + data;
                    //        exportOpt.enabled(true);
                    //    },
                    //    function () {
                    //        //alert("Please try again later");
                    //        _app.showDialog('templates/messageBox', { title: "Alert", message: "Please try again later" }, 'slideDown');
                    //        exportOpt.enabled(true);
                    //    });
                }
            };
        }
        return ExportControl;
    })();
    exports.ExportControl = ExportControl;
});
