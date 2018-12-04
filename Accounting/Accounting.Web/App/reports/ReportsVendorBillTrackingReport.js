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
/// <reference path="../services/models/TypeDefs/Report.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'services/client/ReportClient', '../templates/reportViewerControlV2', 'services/models/report/BoardReportRequest', 'services/models/common/Enums', 'services/client/VendorBillClient'], function(require, exports, ___router__, ___app__, __refSystem__, __refReportClient__, ___reportViewer__, __refBoardReportRequestModel__, __refEnums__, __refVendorBillClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    var refReportClient = __refReportClient__;
    var _reportViewer = ___reportViewer__;
    var refBoardReportRequestModel = __refBoardReportRequestModel__;
    var refEnums = __refEnums__;
    var refVendorBillClient = __refVendorBillClient__;
    

    //#endregion
    /*
    ** <summary>
    ** Report Vendor Bill tracking report View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US8214</id> <by>ACHAL RASTOGI</by> <date>08-21-2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>DE20986</id> <by>Shreesha Adiga</by> <date>14-12-2015</date><description>Added validation to pronumber field</description>
    ** <id>US19722</id> <by>Shreesha Adiga</by> <date>29-12-2015</date> <description>If EDI Data redirect to EDI details page </description>
    ** <id>DE21709</id> <by>Shreesha Adiga</by> <date>11-02-2016</date> <description>Removed the 7999 character limit of input </description>
    ** <id>US20913</id> <by>Baldev Singh Thakur</by> <date>25-02-2016</date> <description>Reading data for VB tracking report from .csv</description>
    ** <id>US20913</id> <by>Shreesha Adiga</by> <date>03-03-2016</date> <description>Changes to upload functionality; Persistecy during tab switch</description>
    ** </changeHistory>
    */
    var ReportsVendorBillTrackingReportViewModel = (function () {
        // ###END: US20913
        //#region Constructor
        function ReportsVendorBillTrackingReportViewModel() {
            var _this = this;
            //#region Members
            this.reportClient = null;
            this.listProgress = ko.observable(false);
            this.vendorName = ko.observable('');
            this.proNumber = ko.observable('');
            this.reportClick = ko.observable(false);
            // Utility class object
            this.CommonUtils = new Utils.Common();
            //#region public report viewer members
            this.reportContainer = null;
            this.headerOptions = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            this.boardReportRequest = null;
            this.searchFilterItems = new Array();
            this.uploadedFileName = ko.observable();
            //To disable Upload Button after click once on Upload
            this.notDisableUploadButton = ko.observable(false);
            this.disableValidation = ko.observable(false);
            var self = this;
            self.headerOptions = new _reportViewer.ReportHeaderOption();
            self.headerOptions.reportHeader = " ";
            self.headerOptions.reportName = "Vendor Bill Tracking Report";
            self.headerOptions.gridTitleHeader = " ";
            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);
            self.reportClient = new refReportClient.ReportClient();

            //## Region Export Options.
            var exportOpt = ko.observableArray([
                { exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
                { exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) }
            ]);

            self.headerOptions.reportExportOptions = new _reportViewer.ReportExportControl(exportOpt);

            // To assign PRO number and vendor Name
            self.proNumber(self.proNumber() !== "" ? self.proNumber() : '');
            self.vendorName(self.vendorName() !== "" ? self.vendorName() : '');
            if (self.proNumber().toString().length > 0) {
                self.boardReportRequest.ProNumber = self.proNumber();
            }
            if (self.vendorName().toString().length > 0) {
                self.boardReportRequest.VendorName = self.vendorName();
            }

            self.headerOptions.reportExportOptions.getUrl = function (exp) {
                var searchModel = new refVendorBillClient.SearchModel();

                if (self.uploadedItem != null && self.proNumber() != "") {
                    //self.uploadedItem = null;
                    self.uploadedFileName("");
                    self.uploadFileContent = null;
                    self.notDisableUploadButton(false);
                }

                searchModel.SearchValue = '';
                searchModel.SortOrder = '';
                searchModel.SortCol = '';
                searchModel.PageNumber = 1;
                searchModel.PageSize = exp.exportType === 1 ? 2000 : self.gridOptions.pagingOptions.totalServerItems();
                searchModel.SearchFilterItems = self.searchFilterItems;
                searchModel.GridViewId = 0;
                searchModel.VendorName = self.vendorName();
                searchModel.ProNumber = self.proNumber();
                searchModel.ExportType = exp.exportType;
                searchModel.UploadedItem = self.uploadedItem;

                var model = { ExportURL: "Accounting/ExportVendorBillTrackingReportInExcel", FilterModel: searchModel };
                return model;
            };

            //## Region Export Options End.
            //##START: DE20986
            self.proNumber.extend({
                required: {
                    message: "Pro Number is required",
                    onlyIf: function () {
                        return (!self.disableValidation());
                    }
                }
            });

            self.errorGroup = ko.validatedObservable({
                proNumber: self.proNumber
            });

            //##END: DE20986
            // ###START:US20913
            self.uploadData = function (reportActionObj) {
                var deferred = $.Deferred();
                var promise = deferred.promise();
                self.reportContainer.listProgress(true);
                self.notDisableUploadButton(false);
                self.disableValidation(true);

                if (self.proNumber() != "") {
                    self.proNumber("");
                }

                self.reportClick(true);
                var successCallBack = function (data) {
                    if (typeof data.ErrorMessages !== "undefined" && data.ErrorMessages != null && data.ErrorMessages.length > 0) {
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };

                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, data.ErrorMessages[0], "error", null, toastrOptions);
                        self.reportContainer.listProgress(false);
                        return;
                    }

                    self.setPagingData(data.VendorBillTrackingReports, data.TotalRowCount, self.gridOptions.pagingOptions.pageSize());
                    self.reportContainer.listProgress(false);
                    self.notDisableUploadButton(true);
                    deferred.resolve(data, reportActionObj.view);
                }, faliureCallBack = function (message) {
                    self.reportContainer.listProgress(false);

                    return true;
                };

                self.reportClient.getVendorBillTrackingReportFromCSV(self.uploadedItem, successCallBack, faliureCallBack);
            };

            // ###END:US20913
            self.setReportCriteria = function (reportActionObj) {
                if (reportActionObj.filter1selectedItemId == undefined || reportActionObj.filter1selectedItemId == 0) {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.PleaseSelectModeFromTheList, "Success", null, toastrOptions);

                    self.reportContainer.listProgress(false);
                    self.reportContainer.selectedFilter1Item(self.modeType());
                } else {
                    self.gridOptions = reportActionObj.gridOptions;

                    if (self.modeType() != reportActionObj.filter1selectedItemId) {
                        self.modeType(reportActionObj.filter1selectedItemId);
                        self.reportContainer.columnDefinition(self.setGridColumnDefinitions());
                    }
                    self.reportAction = reportActionObj;

                    if (self.reportClick()) {
                        if (self.proNumber() != "") {
                            self.getReportData(reportActionObj);
                        } else {
                            self.uploadedItem.PageNumber = Number(self.gridOptions.pagingOptions.currentPage());
                            self.uploadedItem.PageSize = self.gridOptions.pagingOptions.pageSize();
                            self.uploadData(reportActionObj);
                        }
                    }
                }
            };

            self.getReportData = function (reportActionObj) {
                if (self.checkValidation())
                    return false;

                //##END: DE20986
                var deferred = $.Deferred();
                var promise = deferred.promise();
                var pageno = 0;
                pageno = Number(self.gridOptions.pagingOptions.currentPage());
                if (pageno > 0) {
                    // List View
                    self.reportContainer.listProgress(true);
                    self.boardReportRequest = new refBoardReportRequestModel.Models.BoardReportRequest();
                    self.boardReportRequest.VendorName = self.vendorName();
                    self.boardReportRequest.ProNumber = self.proNumber();
                    self.boardReportRequest.PageNumber = self.gridOptions.pagingOptions.currentPage();
                    self.boardReportRequest.PageSize = self.gridOptions.pagingOptions.pageSize();
                    self.reportClient.getVendorBillTrackingReport(self.boardReportRequest, function (data) {
                        self.setPagingData(data.range, data.TotalCount, self.gridOptions.pagingOptions.pageSize());
                        self.reportContainer.listProgress(false);

                        deferred.resolve(data, reportActionObj.view);
                    }, function () {
                        self.reportContainer.listProgress(false);
                    });
                }
                return promise;
            };

            self.reportContainer = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
            self.reportContainer.onFilterChange = self.setReportCriteria;

            //self.reportContainer.showOptionalHeaderRow(false);
            //self.reportContainer.OptionalHeaderRowLocation('TOP');
            self.reportContainer.ForceChange();

            //## redirects to Vendor bill order page
            self.reportContainer.onGridColumnClick = function (obj) {
                var vendorBillId = obj.VendorBillId;

                if (obj.Edi210DetailId != 0 && obj.ExceptionRuleId != 0 && obj.BatchId != 0) {
                    _app.trigger("openEdi210Board", obj.ExceptionRuleId, obj.Edi210DetailId, obj.BatchId, obj.ProNumber);
                    ////##END: US19722
                } else {
                    _app.trigger("openVendorBill", vendorBillId, obj.ProNumber, function (callback) {
                        if (!callback) {
                            return;
                        }
                    });
                }
            };

            // ###START:US20913
            /*	This is triggered when the user is uploading a document.
            It saves the document object to be saved in system */
            self.uploadDocument = function (obj, event) {
                var self = _this;
                var reader = new FileReader(), fileUploadObj = (event.target).files[0];

                if (!self.notDisableUploadButton()) {
                    self.notDisableUploadButton(true);
                }

                reader.readAsDataURL(fileUploadObj);
                reader.onload = function (imgsrc) {
                    self.uploadFileContent = imgsrc.target.result;
                    self.uploadedFileName(fileUploadObj.name);
                    var item = {
                        FileContent: self.uploadFileContent,
                        FileExtension: self.uploadedFileName().split(".")[self.uploadedFileName().split(".").length - 1],
                        FileName: self.uploadedFileName(),
                        PageNumber: Number(self.gridOptions.pagingOptions.currentPage()),
                        PageSize: Number(self.gridOptions.pagingOptions.pageSize())
                    };

                    self.uploadedItem = item;
                };
            };

            //Enables Upload Button once all the mandatory fields are filled up.self.uploadedFileName.length > -1 &&
            self.enableUploadButton = ko.computed(function () {
                if (self.uploadedFileName() != undefined) {
                    self.notDisableUploadButton(true);
                    return true;
                }
                self.notDisableUploadButton(false);
                return false;
            });

            // ###END: US20913
            return self;
        }
        //#endregion
        //#region Internal Methods
        //##START: DE20986
        // Check validation
        ReportsVendorBillTrackingReportViewModel.prototype.checkValidation = function () {
            var self = this;

            if (self.errorGroup.errors().length != 0) {
                self.errorGroup.errors.showAllMessages();
                return true;
            } else {
                return false;
            }
        };

        //##END: DE20986
        ReportsVendorBillTrackingReportViewModel.prototype.generateReport = function () {
            var self = this;

            if (self.disableValidation()) {
                self.disableValidation(false);
            }

            if (self.checkValidation())
                return false;

            //##END: DE20986
            self.reportClick(true);

            if (self.uploadedItem != null) {
                self.uploadedFileName("");
                self.uploadFileContent = null;
                self.notDisableUploadButton(false);
                self.uploadedItem = null;
            }

            // ###END:US20913
            self.gridOptions.pagingOptions.currentPage(1);
            self.getReportData(self.reportAction);
        };

        ReportsVendorBillTrackingReportViewModel.prototype.setPagingData = function (data, page, pageSize) {
            var self = this;
            self.gridOptions.data(data);
            self.gridOptions.data.valueHasMutated();
            self.gridOptions.pagingOptions.totalServerItems(page);
        };

        ReportsVendorBillTrackingReportViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("VendorBillTrackingReportGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
                columnName: "ProNumber",
                order: "DESC"
            };

            //grOption.enableSaveGridSettings = true;
            grOption.pageSizes = [10, 25, 50, 100];
            grOption.pageSize = 10;
            grOption.totalServerItems = 0;
            grOption.currentPage = 1;
            grOption.jqueryUIDraggable = true;
            grOption.canSelectRows = true;
            grOption.selectWithCheckboxOnly = false;
            grOption.displaySelectionCheckbox = false;
            grOption.multiSelect = false;
            grOption.enablePaging = false;
            grOption.viewPortOptions = false;
            grOption.enableSaveGridSettings = true;
            grOption.useClientSideFilterAndSort = true;
            grOption.showColumnMenu = true;
            return grOption;
        };

        ReportsVendorBillTrackingReportViewModel.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;

            //## PRO Cell Template.
            var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'ProNumber\'], click: function() { $userViewModel.onGridColumnClick($parent.entity) }" />';

            colDefinition = [
                { field: 'ProNumber', displayName: 'PRO #', width: 150, cellTemplate: proCellTemplate },
                { field: 'ProcessingDateDisplay', displayName: 'Processing Date', width: 200 },
                { field: 'EdiStatus', displayName: 'EDI Status', isRemovable: false, width: 200 },
                { field: 'GlobalNetStatus', displayName: 'GlobalNet Status', width: 150 },
                { field: 'VBStatus', displayName: 'Vendor Bill Location', width: 150 },
                { field: 'VBAmount', displayName: 'Vendor Bill Amount', width: 100, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
                { field: 'VBBillStatus', displayName: 'Vendor Bill Status', width: 250 },
                { field: 'ProcessWorkflow', displayName: 'Process WorkFlow', width: 150 }
            ];
            return colDefinition;
        };

        ReportsVendorBillTrackingReportViewModel.prototype.load = function (bindedData) {
            if (!bindedData)
                return;

            var self = this;
            self.proNumber(bindedData.proNumber);
            self.vendorName(bindedData.vendorName);
            self.reportClick(bindedData.reportClick);

            //##START: US20913
            self.uploadedItem = bindedData.uploadedItem;

            if (refSystem.isObject(self.gridOptions)) {
                self.gridOptions.pagingOptions.pageSize(bindedData.pageSize);
                self.gridOptions.pagingOptions.currentPage(bindedData.currentPage);

                if (typeof self.uploadedItem !== "undefined" && self.uploadedItem !== null) {
                    self.uploadFileContent = self.uploadedItem.FileContent;
                    self.uploadedFileName(self.uploadedItem.FileName);
                    self.uploadData(self.reportAction);
                } else
                    self.getReportData(self.reportAction);
                //##END: US20913
            }
        };

        //#endregion
        //#region Life Cycle event
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        ReportsVendorBillTrackingReportViewModel.prototype.attached = function () {
            var self = this;
            _app.trigger('viewAttached');

            //Using Document Key press for search result on enter key press
            document.onkeypress = function (event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode === 13) {
                    $('#btngenerateReport').focus();
                    self.generateReport();
                    $('.requiredFieldBgColor').focus();
                    return false;
                }
            };
        };

        //The composition engine will execute it prior to calling the binder.
        ReportsVendorBillTrackingReportViewModel.prototype.activate = function () {
            return true;
        };

        ReportsVendorBillTrackingReportViewModel.prototype.deactivate = function () {
            var self = this;

            var data = {
                //vendorName
                vendorName: self.vendorName(),
                //proNumber.
                proNumber: self.proNumber(),
                pageSize: self.gridOptions.pagingOptions.pageSize(),
                currentPage: self.gridOptions.pagingOptions.currentPage(),
                reportClick: self.reportClick(),
                //##START: US20913
                uploadedItem: self.uploadedItem
            };
            _app.trigger("registerMyData", data);

            // Remove the event registration from Document
            document.onkeypress = undefined;
        };

        //** Using for focus cursor on last cycle for focusing in pro name
        ReportsVendorBillTrackingReportViewModel.prototype.compositionComplete = function (view, parent) {
            $("input:text:visible:first").focus();
        };

        //To load the registered data if any existed.
        ReportsVendorBillTrackingReportViewModel.prototype.beforeBind = function () {
            var self = this;

            _app.trigger("loadMyData", function (data) {
                if (data) {
                    self.load(data);
                } else {
                }
            });
        };

        ReportsVendorBillTrackingReportViewModel.prototype.cleanup = function () {
            var self = this;

            self.reportContainer.cleanup("VendorBillTrackingReportGrid");

            for (var prop in self) {
                if (prop !== "cleanup")
                    delete self[prop];
            }
            delete self;
        };
        return ReportsVendorBillTrackingReportViewModel;
    })();

    return ReportsVendorBillTrackingReportViewModel;
});
