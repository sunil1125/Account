/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region REFERENCES
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../services/models/TypeDefs/Report.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
/// <reference path="../services/models/TypeDefs/VendorBillModels.d.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/client/ReportClient', 'templates/searchVendorNameControl', 'services/models/common/Enums', 'services/validations/Validations', 'services/models/report/UploadReportsFileDetails'], function(require, exports, ___router__, ___app__, __refReportClient__, __refVendorNameSearchControl__, __refEnums__, __refValidations__, __refUploadMatchingReportData__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refReportClient = __refReportClient__;
    
    var refVendorNameSearchControl = __refVendorNameSearchControl__;
    var refEnums = __refEnums__;
    var refValidations = __refValidations__;
    var refUploadMatchingReportData = __refUploadMatchingReportData__;

    //#endregion
    /*
    ** <summary>
    ** APMatchingReportViewModel
    ** </summary>
    ** <createDetails>
    ** <id>US14072</id> <by>Chandan</by> <date>12-10-2014</date>}
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var APMatchingReportViewModel = (function () {
        //#endregion
        //#region CONSTRUCTOR
        function APMatchingReportViewModel() {
            //#region MEMBERS
            this.scheduleDate = ko.observable('');
            //
            this.reportClient = null;
            this.CommonUtils = new Utils.Common();
            //All File details like content, File Name, and All Uploaded item()
            this.uploadedItems = ko.observableArray();
            this.uploadedStatementFileName = ko.observable();
            this.uploadedMASReportFileName = ko.observable();
            this.uploadedDisputeReportFileName = ko.observable();
            this.uploadedReConsolidatedFileName = ko.observable();
            var self = this;

            self.vendorNameSearchList = new refVendorNameSearchControl.SearchVendorNameControl("", '275px', '245px', false);
            var uploadMatchingReportData = new refUploadMatchingReportData.Models.UploadReportsFileDetails();
            self.reportClient = new refReportClient.ReportClient();

            // to get the vendorId after selecting vendor
            self.vendorId = ko.computed(function () {
                if (self.vendorNameSearchList.name() != null)
                    return self.vendorNameSearchList.ID();

                return 0;
            });

            // to get the vendor Name after selecting vendor
            self.vendorName = ko.computed(function () {
                if (self.vendorNameSearchList.name() != null)
                    return self.vendorNameSearchList.vendorName();

                return null;
            });

            self.onSchedultIt = function () {
                var successCallBack = function (data) {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 3,
                        fadeOut: 3,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.UplodedSuccessFully, "sucess", null, toastrOptions);
                }, faliureCallBack = function () {
                    //self.vendorBillUploadCSVGrid.listProgress(false);
                    return true;
                };

                uploadMatchingReportData.CarrierId = self.vendorId();
                uploadMatchingReportData.CarrierName = self.vendorName();
                uploadMatchingReportData.ScheduleDate = self.scheduleDate();
                self.reportClient.UploadMatchingReportDetails(uploadMatchingReportData, successCallBack, faliureCallBack);
            };

            self.onRunDown = function () {
                self.onSchedultIt();
            };

            //To set The date picker options
            self.datepickerOptions = {
                blockWeekend: true,
                blockPreviousDays: false,
                blockHolidaysDays: true,
                autoClose: true,
                placeBelowButton: false,
                endDate: new Date()
            };

            //To initialize the dates
            self.scheduleDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));

            /*	This is triggered when the user is uploading a document.
            It saves the document object to be saved in system */
            self.uploadStatementDocument = function (obj, event) {
                var reader = new FileReader(), StatementfileUploadObj = (event.target).files[0];
                reader.readAsDataURL(StatementfileUploadObj);
                self.uploadedStatementFileName(StatementfileUploadObj.name);
                var ext = self.uploadedStatementFileName().split(".")[self.uploadedStatementFileName().split(".").length - 1];
                switch (ext) {
                    case 'csv':
                    case 'xls':
                    case 'xlsx':
                    case 'CSV':
                    case 'XLS':
                    case 'XLSX':
                        break;
                    default:
                        var toastrOptionss = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 5,
                            fadeOut: 5,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.MessageForOnlyCSVAndXLSFile, "info", null, toastrOptionss);
                        self.uploadedStatementFileName('');
                        return;
                }
                reader.onload = function (imgsrc) {
                    //self.uploadFileContent = imgsrc.target.result;
                    var StatementFileDetails = {
                        FileContent: imgsrc.target.result,
                        FileExtension: self.uploadedStatementFileName().split(".")[self.uploadedStatementFileName().split(".").length - 1],
                        FileName: StatementfileUploadObj.name
                    };

                    //self.uploadedItems.push(StatementFileDetails);
                    uploadMatchingReportData.StatementFileDetails = StatementFileDetails;
                };
            };

            /*	This is triggered when the user is uploading a document.
            It saves the document object to be saved in system */
            self.uploadMASReportDocument = function (obj, event) {
                var reader = new FileReader(), MASReportfileUploadObj = (event.target).files[0];

                reader.readAsDataURL(MASReportfileUploadObj);
                self.uploadedMASReportFileName(MASReportfileUploadObj.name);
                var ext = self.uploadedMASReportFileName().split(".")[self.uploadedMASReportFileName().split(".").length - 1];
                switch (ext) {
                    case 'csv':
                    case 'xls':
                    case 'xlsx':
                    case 'CSV':
                    case 'XLS':
                    case 'XLSX':
                        break;
                    default:
                        var toastrOptionss = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 5,
                            fadeOut: 5,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.MessageForOnlyCSVAndXLSFile, "info", null, toastrOptionss);
                        self.uploadedMASReportFileName('');
                        return;
                }
                reader.onload = function (imgsrc) {
                    //self.uploadFileContent = imgsrc.target.result;
                    var MASReportFileDetails = {
                        FileContent: imgsrc.target.result,
                        FileExtension: self.uploadedMASReportFileName().split(".")[self.uploadedMASReportFileName().split(".").length - 1],
                        FileName: MASReportfileUploadObj.name
                    };

                    //self.uploadedItems.push(MASReportFileDetails);
                    uploadMatchingReportData.MASReportFileDetails = MASReportFileDetails;
                };
            };

            /*	This is triggered when the user is uploading a document.
            It saves the document object to be saved in system */
            self.uploadDisputeReportDocument = function (obj, event) {
                var reader = new FileReader(), DisputeReportfileUploadObj = (event.target).files[0];

                reader.readAsDataURL(DisputeReportfileUploadObj);
                self.uploadedDisputeReportFileName(DisputeReportfileUploadObj.name);
                var ext = self.uploadedDisputeReportFileName().split(".")[self.uploadedDisputeReportFileName().split(".").length - 1];
                switch (ext) {
                    case 'csv':
                    case 'xls':
                    case 'xlsx':
                    case 'CSV':
                    case 'XLS':
                    case 'XLSX':
                        break;
                    default:
                        var toastrOptionss = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 5,
                            fadeOut: 5,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.MessageForOnlyCSVAndXLSFile, "info", null, toastrOptionss);
                        self.uploadedDisputeReportFileName('');
                        return;
                }
                reader.onload = function (imgsrc) {
                    //self.uploadFileContent = imgsrc.target.result;
                    var DisputeReportFileDetails = {
                        FileContent: imgsrc.target.result,
                        FileExtension: self.uploadedDisputeReportFileName().split(".")[self.uploadedDisputeReportFileName().split(".").length - 1],
                        FileName: DisputeReportfileUploadObj.name
                    };

                    //self.uploadedItems.push(DisputeReportFileDetails);
                    uploadMatchingReportData.DisputeReportFileDetails = DisputeReportFileDetails;
                };
            };

            /*	This is triggered when the user is uploading a document.
            It saves the document object to be saved in system */
            self.uploadReConsolidatedDocument = function (obj, event) {
                var reader = new FileReader(), ReConsolidatedfileUploadObj = (event.target).files[0];

                reader.readAsDataURL(ReConsolidatedfileUploadObj);
                self.uploadedReConsolidatedFileName(ReConsolidatedfileUploadObj.name);
                var ext = self.uploadedReConsolidatedFileName().split(".")[self.uploadedReConsolidatedFileName().split(".").length - 1];
                switch (ext) {
                    case 'csv':
                    case 'xls':
                    case 'xlsx':
                    case 'CSV':
                    case 'XLS':
                    case 'XLSX':
                        break;
                    default:
                        var toastrOptionss = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 5,
                            fadeOut: 5,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.MessageForOnlyCSVAndXLSFile, "info", null, toastrOptionss);
                        self.uploadedReConsolidatedFileName('');
                        return;
                }
                reader.onload = function (imgsrc) {
                    //self.uploadFileContent = imgsrc.target.result;
                    var ReConsolidatedFileDetails = {
                        FileContent: imgsrc.target.result,
                        FileExtension: self.uploadedReConsolidatedFileName().split(".")[self.uploadedReConsolidatedFileName().split(".").length - 1],
                        FileName: ReConsolidatedfileUploadObj.name
                    };

                    //self.uploadedItems.push(ReConsolidatedFileDetails);
                    uploadMatchingReportData.ReConsolidatedFileDetails = ReConsolidatedFileDetails;
                };
            };

            return self;
            //#endregion
        }
        //#endregion
        //#region Public Methods
        //#endregion public Methods
        //#region INTERNAL METHODS
        //#region if user any numeric  date  without any format
        APMatchingReportViewModel.prototype.convertToscheduleDate = function () {
            var self = this;
            if (!self.scheduleDate().match('/')) {
                self.scheduleDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.scheduleDate()));
            }
        };

        //#endregion
        //#region LIFE CYCLE EVENT
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        APMatchingReportViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };
        return APMatchingReportViewModel;
    })();
    return APMatchingReportViewModel;
});
