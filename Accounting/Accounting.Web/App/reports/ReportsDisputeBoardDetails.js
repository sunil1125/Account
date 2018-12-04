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
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'services/client/ReportClient', '../templates/reportViewerControlV2', 'services/models/common/Enums', 'services/models/report/BoardReportRequest', 'services/client/VendorBillClient'], function(require, exports, ___router__, ___app__, __refSystem__, __refReportClient__, ___reportViewer__, __refEnums__, __refBoardReportRequestModel__, __refVendorBillClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    var refReportClient = __refReportClient__;
    var _reportViewer = ___reportViewer__;
    var refEnums = __refEnums__;
    var refBoardReportRequestModel = __refBoardReportRequestModel__;
    var refVendorBillClient = __refVendorBillClient__;

    //#endregion
    /***********************************************
    REPORT  DISPUTE BOARD DETAILS VIEW MODEL
    ************************************************
    ** <summary>
    ** Report Dispute Boards Details View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US11180</id><by>Satish</by><date>25th Aug, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id>DE20737</id> <by>Vasanthakumar</by> <date>26-11-2015</date><description>Enabled the grid setting saving option</description>
    ** </changeHistory>
    
    ***********************************************/
    var ReportsDisputeBoardDetailsViewModel = (function () {
        //#endregion
        //#endregion
        //#region Constructor
        function ReportsDisputeBoardDetailsViewModel() {
            //#region Members
            this.reportClient = null;
            this.listProgress = ko.observable(false);
            this.carrierName = ko.observable('');
            this.reportClick = ko.observable(false);
            //#region public report viewer members
            this.DisputeBoardReportContainer = null;
            this.headerOptions = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            this.boardReportRequest = null;
            this.vendorBillClient = new refVendorBillClient.VendorBillClient();
            var self = this;
            self.headerOptions = new _reportViewer.ReportHeaderOption();

            // ###START: DE20737
            self.headerOptions.reportHeader = " ";

            // ###END: DE20737
            self.headerOptions.reportName = "Dispute Board Details Report";
            self.headerOptions.gridTitleHeader = " ";
            self.searchText = ko.observable("");
            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);
            self.reportClient = new refReportClient.ReportClient();

            //## Region Export Options.
            var exportOpt = ko.observableArray([
                { exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
                { exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) }
            ]);

            self.headerOptions.reportExportOptions = new _reportViewer.ReportExportControl(exportOpt);
            self.headerOptions.reportExportOptions.getUrl = function (exp) {
                var searchClient = new refVendorBillClient.SearchModel();
                searchClient.PageSize = exp.exportType === 1 ? 2000 : self.gridOptions.pagingOptions.totalServerItems();
                searchClient.PageNumber = 1;
                searchClient.VendorName = self.carrierName();
                searchClient.ExportType = exp.exportType;
                var filterModel = { ExportURL: "Accounting/ExportDisputBoardDataInExcel", FilterModel: searchClient };
                return filterModel;
            };

            //## Region Export Options End.
            self.setReportCriteria = function (reportActionObj) {
                if (reportActionObj.filter1selectedItemId == undefined || reportActionObj.filter1selectedItemId == 0) {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectModeFromTheList, "info", null, toastrOptions);

                    self.DisputeBoardReportContainer.listProgress(false);
                    self.DisputeBoardReportContainer.selectedFilter1Item(self.modeType());
                } else {
                    self.gridOptions = reportActionObj.gridOptions;

                    if (self.modeType() != reportActionObj.filter1selectedItemId) {
                        self.modeType(reportActionObj.filter1selectedItemId);
                        self.DisputeBoardReportContainer.columnDefinition(self.setGridColumnDefinitions());
                    }

                    self.reportAction = reportActionObj;

                    if (self.reportClick())
                        self.getReportData(reportActionObj);
                }
            };

            self.getReportData = function (reportActionObj) {
                var deferred = $.Deferred();
                var promise = deferred.promise();
                var pageno = 0;
                pageno = Number(self.gridOptions.pagingOptions.currentPage());
                if (pageno > 0) {
                    // List View
                    self.DisputeBoardReportContainer.listProgress(true);
                    self.boardReportRequest = new refBoardReportRequestModel.Models.BoardReportRequest();
                    self.boardReportRequest.VendorName = self.carrierName();
                    self.boardReportRequest.PageNumber = self.gridOptions.pagingOptions.currentPage();
                    self.boardReportRequest.PageSize = self.gridOptions.pagingOptions.pageSize();
                    self.reportClient.getDisputeBoardDetaisReport(self.boardReportRequest, function (data) {
                        self.setPagingData(data.range, data.TotalCount, self.gridOptions.pagingOptions.pageSize());
                        self.DisputeBoardReportContainer.listProgress(false);

                        deferred.resolve(data, reportActionObj.view);
                    }, function () {
                        self.DisputeBoardReportContainer.listProgress(false);
                        ////		var toastrOptions = {
                        ////			toastrPositionClass: "toast-top-middle",
                        ////			delayInseconds: 10,
                        ////			fadeOut: 10,
                        ////			typeOfAlert: "",
                        ////			title: ""
                        ////		}
                        ////Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ErrorOccurredWhileFetchingDisputeBoardDetails, "error", null, toastrOptions);
                    });
                }
                return promise;
            };

            self.DisputeBoardReportContainer = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
            self.DisputeBoardReportContainer.onFilterChange = self.setReportCriteria;

            //self.DisputeBoardReportContainer.showOptionalHeaderRow(false);
            //self.DisputeBoardReportContainer.OptionalHeaderRowLocation('TOP');
            self.DisputeBoardReportContainer.ForceChange();

            ////## redirects to Vendor bill order page
            self.DisputeBoardReportContainer.onGridColumnClick = function (obj) {
                var vendorBillId = obj.VendorBillId;
                _app.trigger("openVendorBill", vendorBillId, obj.PRONumber, function (callback) {
                    if (!callback) {
                        return;
                    }
                });
            };

            return self;
        }
        //#endregion
        //#region Public Methods
        ReportsDisputeBoardDetailsViewModel.prototype.viewDisputeBoardReport = function () {
            var self = this;
            self.reportClick(true);
            self.gridOptions.pagingOptions.currentPage(1);
            self.getReportData(self.reportAction);
        };

        //#endregion
        //#region Private Methods
        ReportsDisputeBoardDetailsViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("ReportDisputeBoardDetailsGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
                columnName: "PRONumber",
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

            // ###START: DE20737
            grOption.enableSaveGridSettings = true;

            // ###END: DE20737
            grOption.useClientSideFilterAndSort = true;
            grOption.showColumnMenu = true;
            return grOption;
        };

        ReportsDisputeBoardDetailsViewModel.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;

            //## PRO Cell Template.
            var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'PRONumber\'], click: function() { $userViewModel.onGridColumnClick($parent.entity) }" />';

            colDefinition = [
                { field: 'PRONumber', displayName: 'PRO #', width: 100, cellTemplate: proCellTemplate },
                { field: 'BOLNumber', displayName: 'BOL', width: 80 },
                { field: 'BillDateDisplay', displayName: 'Bill Date', width: 100 },
                { field: 'ReferenceNo', displayName: 'Reference', width: 120 },
                { field: 'VendorName', displayName: 'Carrier', width: 120 },
                { field: 'TotalEstimateCost', displayName: 'Estimated Cost', width: 130, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
                { field: 'Amount', displayName: 'Actual Amount', width: 130, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
                { field: 'DisputedAmount', displayName: 'Disputed Amount', width: 150, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
                { field: 'DisputedDateDisplay', displayName: 'Dispute Date', width: 120 },
                { field: 'VendorBillStatus', displayName: 'Bill Status', width: 100 },
                { field: 'DisputeNote', displayName: 'Dispute Notes', width: 200 }
            ];
            return colDefinition;
        };

        ReportsDisputeBoardDetailsViewModel.prototype.setPagingData = function (data, page, pageSize) {
            var self = this;
            self.gridOptions.data(data);
            self.gridOptions.data.valueHasMutated();
            self.gridOptions.pagingOptions.totalServerItems(page);
        };

        ReportsDisputeBoardDetailsViewModel.prototype.load = function (bindedData) {
            if (!bindedData)
                return;

            var self = this;
            self.carrierName(bindedData.carrierName);
            self.reportClick(bindedData.reportClick);
            if (refSystem.isObject(self.gridOptions)) {
                self.gridOptions.pagingOptions.pageSize(bindedData.pageSize);
                self.gridOptions.pagingOptions.currentPage(bindedData.currentPage);
                if (self.reportClick())
                    self.getReportData(self.reportAction);
            }
        };

        //#endregion
        //#region Life Cycle event
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        ReportsDisputeBoardDetailsViewModel.prototype.attached = function () {
            var self = this;
            _app.trigger('viewAttached');

            //Using Document Key press for search result on enter key press
            document.onkeypress = function (event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode === 13) {
                    $('#btngenerateReport').focus();
                    self.viewDisputeBoardReport();
                    $('.requiredFieldBgColor').focus();
                    return false;
                }
            };
        };

        //The composition engine will execute it prior to calling the binder.
        ReportsDisputeBoardDetailsViewModel.prototype.activate = function () {
            return true;
        };

        ReportsDisputeBoardDetailsViewModel.prototype.deactivate = function () {
            var self = this;

            var data = {
                //carrierName
                carrierName: self.carrierName(),
                pageSize: self.gridOptions.pagingOptions.pageSize(),
                currentPage: self.gridOptions.pagingOptions.currentPage(),
                reportClick: self.reportClick()
            };
            _app.trigger("registerMyData", data);

            // Remove the event registration from Document
            document.onkeypress = undefined;

            self.cleanup();
        };

        //** Using for focus cursor on last cycle for focusing in vendor name
        ReportsDisputeBoardDetailsViewModel.prototype.compositionComplete = function (view, parent) {
            $("input:text:visible:first").focus();
        };

        //To load the registered data if any existed.
        ReportsDisputeBoardDetailsViewModel.prototype.beforeBind = function () {
            var self = this;

            _app.trigger("loadMyData", function (data) {
                if (data) {
                    self.load(data);
                } else {
                    //_app.trigger("closeActiveTab");
                    //_app.trigger("NavigateTo", 'Home');
                }
            });
        };

        ReportsDisputeBoardDetailsViewModel.prototype.cleanup = function () {
            var self = this;

            self.DisputeBoardReportContainer.cleanup("ReportDisputeBoardDetailsGrid");

            for (var prop in self) {
                if (prop !== "cleanup")
                    delete self[prop];
            }
            delete self;
        };
        return ReportsDisputeBoardDetailsViewModel;
    })();

    return ReportsDisputeBoardDetailsViewModel;
});
