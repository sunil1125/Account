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

import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refOptionButton = require('services/models/common/OptionButton');
import refEnums = require('services/models/common/Enums');
//import ReportDownload = require('services/ReportDownloader');

export enum ReportExportType {
    CSV,
    Excel,
    Pdf
}

export interface IExportOptions {
    exportType: ReportExportType;
    name: KnockoutObservable<string>;
    enabled: KnockoutObservable<boolean>;
}
/** <summary>
* * Export Control View Model
* * < / summary >
* * <createDetails>proNumber
* * <id> < /id> <by>Achal</by > <date>October 22, 2013</date >
* * < / createDetails >
* * <changeHistory>
* * < / changeHistory >
*/
export class ExportControl {
    private exportOptionList: KnockoutObservableArray<IExportOptions> = ko.observableArray([]);
    private onButtonClick: (exportOpt: IExportOptions) => void;
    private GenerateCsvReport: (reportData) => void;
    private GenerateExcelReport: (reportData) => void;
    private GeneratePdfReport: (exportOpt) => void;
    private fromDate: KnockoutObservable<string> = ko.observable();
    private toDate: KnockoutObservable<string> = ko.observable();
    private reportName: KnockoutObservable<string> = ko.observable();
    private PdfReportLink: string;
    public getReportGenerateData: (value: ExportControl) => Array<any>;  //for client side report generate
    public setReportGenerateCriteria: (fromDate: string, toDate: string, reportName: string) => void; //for server side report generate
    constructor(Export: KnockoutObservableArray<IExportOptions>) {
        var self = this;
        self.exportOptionList(ko.unwrap(Export));

        self.onButtonClick = function (exportOpt: IExportOptions) {
            if (refSystem.isFunction(self.getReportGenerateData)) {
                var data: Array = ko.unwrap(self.getReportGenerateData.apply(null, [self]));
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
                }
                else
                    //alert("No Records to download.");
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 15,
						fadeOut: 15,
						typeOfAlert: "",
						title: ""
					}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.NoRecordsToDownload, "success", null, toastrOptions);
            }
            else
                //alert("Report generate data has not been set.");
				var toastrOptions1 = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 15,
					fadeOut: 15,
					typeOfAlert: "",
					title: ""
				}

			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.ReportGenerateDataHasNotBeenSet, "info", null, toastrOptions1);
        }

		self.setReportGenerateCriteria = function (fromDate: string, toDate: string, reportName: string) {
            var CommonUtils: CommonStatic = new Utils.Common();
            var rptFromDate = CommonUtils.convertToDateString(ko.unwrap(fromDate), 'yyyy-mm-dd');
            var rpttoDate = CommonUtils.convertToDateString(ko.unwrap(toDate), 'yyyy-mm-dd');
            //verifying wether the report is already generated for given criteria
            if (!(self.fromDate() == rptFromDate && self.toDate() == rpttoDate && self.reportName() == ko.unwrap(reportName)))
                self.PdfReportLink = "";

            self.fromDate(rptFromDate);
            self.toDate(rpttoDate);
            self.reportName(ko.unwrap(reportName));
        }

		self.GenerateCsvReport = function (exportOpt: IExportOptions) {
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
        }

		self.GenerateExcelReport = function (exportOpt: IExportOptions) {
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
        }

		self.GeneratePdfReport = function (exportOpt: IExportOptions) {
            if (self.PdfReportLink != "") {
                var downloadLink = <HTMLAnchorElement>document.createElement("a");
                downloadLink.href = self.PdfReportLink;
                $(downloadLink).attr("download", "data:application/pdf:" + self.PdfReportLink);
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                return;
            }
            else {
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
        }
	}
}