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
//#endregion

//#region IMPORT
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refReportClient = require('services/client/ReportClient');
import _reportViewer = require('../templates/reportViewerControlV2');
import refBoardReportRequestModel = require('services/models/report/BoardReportRequest');
import refEnums = require('services/models/common/Enums');
import refValidations = require('services/validations/Validations');
import refVendorBillClient = require('services/client/VendorBillClient');
//#endregion

/*
** <summary>
** Report Order Rebill report View Model.
** </summary>
** <createDetails>
** <id>US8214</id> <by>Baldev Singh Thakur</by> <date>12-12-2014</date>}
** </createDetails>}
** <changeHistory>}
** <id>DE20289</id> <by>Shreesha Adiga</by> <date>09-10-2015</date><description>Added validations to Date fields</description>
** <id>DE20737</id> <by>Vasanthakumar</by> <date>26-11-2015</date><description>Enabled the grid setting saving option</description>
** <id>US20647</id> <by>Chandan Singh Bajetha</by> <date>17-02-2016</date><description>Acct: Implement Search on all Reports</description> 
** <id>DE22109</id> <by>Janakiram</by> <date>06-15-2016</date> <description>Added date range for Order Re-Bill Report</description>
** </changeHistory>
*/

class OrderRebillReportViewModel {
    //#region Members
    reportClient: refReportClient.ReportClient = null;

    listProgress: KnockoutObservable<boolean> = ko.observable(false);

    private boardReportRequest: refBoardReportRequestModel.Models.BoardReportRequest = null;

    // search text through grid filter
    searchText: KnockoutObservable<string>;

    datepickerOptions: DatepickerOptions;

    // From date filter
    fromDate: KnockoutObservable<any> = ko.observable('');

    // To Date Filter
    toDate: KnockoutObservable<any> = ko.observable('');

    // Common Utilities
    CommonUtils: CommonStatic = new Utils.Common();

    // Flag to check whether user clicked on button or not??
    isLoaded: KnockoutObservable<boolean> = ko.observable(false);

    //For Validation purpose
    errorReport: KnockoutValidationGroup;
    //#endregion

    //#region public report viewer members
    public reportContainer: _reportViewer.ReportViewerControlV2 = null;
    public headerOptions: _reportViewer.ReportHeaderOption = null;
    public grid: _reportViewer.ReportGridOption = null;
    public reportAction: _reportViewer.ReportAction = null;
    public reportData: KnockoutObservableArray<IRebillSummaryReport> = null;
    public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
    public getReportData: (reportAction: _reportViewer.ReportAction) => any;
    public gridOptions: any;
    public reportType: number;
    public modeType = ko.observable();
    //#endregion

    //#region constructor
    constructor() {
        var self = this;

        self.searchText = ko.observable("");

        //Set Datepicker Options
        self.datepickerOptions = {
            blockWeekend: true,
            blockHolidaysDays: true,
            blockPreviousDays: false,
            autoClose: true,
            placeBelowButton: false,
            endDate: new Date()
        };

        //#region Date validation

        //From PickUp Date should not be grater then Today Date and required
        self.fromDate = ko.observable().extend({
            required: {
                message: ApplicationMessages.Messages.ValidFromDateRequired
            },
            validation: {
                validator: function () {
                    // ###START: DE20289
                    if (!refValidations.Validations.isValidDate(self.fromDate(), self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "BillDate"))
                        return false;
                    // ###END: DE20289
                    if (self.fromDate() !== "" || self.fromDate() !== undefined) {
                        if ((new Date(self.fromDate())) > new Date(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy')))
                            return false;
                        else
                            return true;
                    } else {
                        return true;
                    }
                },
                message: ApplicationMessages.Messages.NotAValidDate
            }
        });

        //To Date Should not be grater then today date and not be less then from date and required
        self.toDate = ko.observable().extend({
            required: {
                message: ApplicationMessages.Messages.ValidToDateRequired
            },
            validation: {
                validator: function () {
                    // ###START: DE20289
                    if (!refValidations.Validations.isValidDate(self.toDate(), self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "BillDate"))
                        return false;
                    // ###END: DE20289
                    //To date shouldn't be greater than today date
                    if (new Date(self.toDate()) > (new Date(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy')))) {
                        return false;
                    } else if (self.toDate() !== undefined && self.fromDate() !== "") {
                        //To pickUp Date should be greater than from pick up date
                        if (new Date(self.fromDate()) > new Date(self.toDate()))
                            return false;
                        else
                            return true;
                    } else {
                        return true;
                    }
                },
                message: ApplicationMessages.Messages.NotAValidDate
            }
        });

        //To set the from date by default to previous 3 months from current date
        var fromdate = new Date();
        var x = 90;
        var newFromDate = fromdate.setDate(fromdate.getDate() - x);
        self.fromDate(self.CommonUtils.formatDate(newFromDate, 'mm/dd/yyyy'));
        self.toDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));

        //#region Error Details Object
        self.errorReport = ko.validatedObservable({
            fromDate: self.fromDate,
            toDate: self.toDate
        });

        //#endregion

        //#region Report Container

        self.headerOptions = new _reportViewer.ReportHeaderOption();
        self.headerOptions.gridTitleHeader = " ";
        // ###START: DE20737
        self.headerOptions.reportHeader = " ";
        // ###END: DE20737
        self.headerOptions.reportName = "Order Rebill Report";
        self.reportAction = new _reportViewer.ReportAction();
        self.grid = self.setGridOptions(self);
        self.reportClient = new refReportClient.ReportClient();

        //#endregion

        //#region Export functionality

        var exportOptions = ko.observableArray([
            { exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
            { exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) }
        ]);

        self.headerOptions.reportExportOptions = new _reportViewer.ReportExportControl(exportOptions);
        self.headerOptions.reportExportOptions.getUrl = function (exp: _reportViewer.IExportOptions): any {
            var searchClient = new refVendorBillClient.SearchModel();

            searchClient.PageSize = exp.exportType === 1 ? 2000 : self.gridOptions.pagingOptions.totalServerItems();
            searchClient.PageNumber = 1;
            searchClient.ExportType = exp.exportType;
            searchClient.FromDate = self.fromDate();
            searchClient.ToDate = self.toDate();

            var filterModel = { ExportURL: "Accounting/ExportOrderRebillReportInExcel", FilterModel: searchClient };
            return filterModel;
        }

        //#endregion

        self.setReportCriteria = (reportActionObject: _reportViewer.ReportAction) => {
            self.gridOptions = reportActionObject.gridOptions;
            self.reportAction = reportActionObject;
            if (self.reportAction != null) {
                if (self.isLoaded()) {
                    self.getReportData(reportActionObject);
                }
            }
        };

        self.getReportData = function (reportActionObj: _reportViewer.ReportAction) {
            var deferred = $.Deferred();
            var promise = deferred.promise();

            // ###START: DE22109
            var startDate = moment(self.fromDate(), 'M/D/YYYY');
            var endDate = moment(self.toDate(), 'M/D/YYYY');

            var daysCount = endDate.diff(startDate, 'days');

            // Checking for 3 years
            if (daysCount <= 1095) {

                // ###END: DE22109
                var pageNo = 0;
                pageNo = Number(self.gridOptions.pagingOptions.currentPage());
                if (pageNo > 0) {
                    self.reportContainer.listProgress(true);
                    self.boardReportRequest = new refBoardReportRequestModel.Models.BoardReportRequest();
                    self.boardReportRequest.PageNumber = self.gridOptions.pagingOptions.currentPage();
                    self.boardReportRequest.PageSize = self.gridOptions.pagingOptions.pageSize();
                    self.boardReportRequest.FromDate = self.fromDate();
                    self.boardReportRequest.ToDate = self.toDate();
                    // ###START: US20647
                    self.boardReportRequest.GridSearchText = self.searchText().trim();
                    // ###END: US20647
                    self.reportClient.getOrderRebillReport(self.boardReportRequest, function (data) {
                        self.setPagingData(data.range, data.TotalCount, self.gridOptions.pagingOptions.pageSize());
                        self.reportContainer.listProgress(false);
                        deferred.resolve(data, reportActionObj.view);
                        self.reportContainer.invokeHighlight(self.searchText());
                    }, function () {
                            self.reportContainer.listProgress(false);
                        });
                }
                // ###START: DE22109
            }
            else {
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                }

                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.FinalizedOrdersReportDateValidation, "error", null, toastrOptions);
            }
            // ###END: DE22109

            return promise;
        };

        //#region Assign grid settings

        self.reportContainer = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
        self.reportContainer.onFilterChange = self.setReportCriteria;
        self.reportContainer.ForceChange();

        //#endregion

        //#region Redirects to Vendor Bill Order Page
        self.reportContainer.onProNumberClick = function (obj) {
            var vendorBillId = obj.VendorBillId;
            _app.trigger("openVendorBill", vendorBillId, obj.PRONo, (callback) => {
                if (!callback) {
                    return;
                }
            });
        }
        //#endregion

        //#region Redirect to Sales Order Edit page
        self.reportContainer.onSalesOrderClick = function (obj) {
            var salesOrderId = obj.BOLNo;
            _app.trigger("openSalesOrder", salesOrderId, obj.BOLNo, (callback) => {
                if (!callback) {
                    return;
                }
            });
        }
        //#endregion

        //#region Search Fillter

        self.reportContainer.onSearchTextChange = function (reportViewer, newSearchValue) {
            if (newSearchValue.length >= 3 || newSearchValue.length == 0) {
                // ###START: US20647
                var data: Array<IBoardReportRequest> = new Array<refBoardReportRequestModel.Models.BoardReportRequest>();
                var searchString = newSearchValue;
                //to blank the grid data
                self.setPagingData(data, 0, self.gridOptions.pagingOptions.pageSize());
                self.searchText(searchString.trim());

                self.getReportData(self.reportAction);
                self.gridOptions.pagingOptions.currentPage(1);
                // ###END: US20647
            }
        };

        //#endregion
        return self;
    }

    //#endregion

    //#region Generate button event

    public generateReport() {
        var self = this;
        if (self.validateReport()) {
            self.isLoaded(true);
            self.gridOptions.pagingOptions.currentPage(1);
            self.getReportData(self.reportAction);
        }
        else {
            return false;
        }
    }

    //#endregion

    //#region Private methods

    //#region if user enters numeric  date  without any format

    private convertToFromDate() {
        var self = this;
        if (!self.fromDate().match('/')) {
            self.fromDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.fromDate()));
        }
    }

    private convertToDate() {
        var self = this;
        if (!self.toDate().match('/') && self.toDate().length > 0) {
            self.toDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.toDate()));
        }
    }

    //#endregion

    private validateReport() {
        var self = this;
        if (self.errorReport.errors().length != 0) {
            self.errorReport.errors.showAllMessages();
            return false;
        } else {
            return true;
        }
    }

    private setPagingData(data, page, pageSize) {
        var self = this;
        self.gridOptions.data(data);
        self.gridOptions.data.valueHasMutated();
        self.gridOptions.pagingOptions.totalServerItems(page);
    }

    private setGridOptions(self: OrderRebillReportViewModel): _reportViewer.ReportGridOption {
        var gridOption = new _reportViewer.ReportGridOption();
        gridOption.enableSelectiveDisplay = true;
        gridOption.showGridSearchFilter = true;
        gridOption.showPageSize = true;
        gridOption.UIGridID = ko.observable("OrderRebillSummaryReportGrid");
        gridOption.data = <any> self.reportData;
        gridOption.columnDefinition = self.setGridColumnDefinitions();
        gridOption.useExternalSorting = false;
        gridOption.sortedColumn = <_reportViewer.SortOrder> { columnName: "ReviewDateDisplay", order: "DESC" };
        gridOption.pageSizes = [10, 25, 50, 100];
        gridOption.pageSize = 10;
        gridOption.totalServerItems = 0;
        gridOption.currentPage = 1;
        gridOption.jqueryUIDraggable = true;
        gridOption.canSelectRows = true;
        gridOption.selectWithCheckboxOnly = false;
        gridOption.displaySelectionCheckbox = false;
        gridOption.multiSelect = false;
        gridOption.enablePaging = false;
        gridOption.viewPortOptions = false;
        // ###START: DE20737
        gridOption.enableSaveGridSettings = true;
        // ###END: DE20737
        gridOption.useClientSideFilterAndSort = true;
        gridOption.showColumnMenu = true;
        return gridOption;
    }

    private setGridColumnDefinitions() {
        var columnDefintion: Array = [];
        var self = this;
        //var vbcellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[VendorBillId], click: function() { $userViewModel.onGridColumnClick($parent.entity)}" />';
        var soCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'BOLNo\'], click: function() { $userViewModel.onSalesOrderClick($parent.entity)}" />';
        var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'PRONo\'], click: function() { $userViewModel.onProNumberClick($parent.entity) }" />';

        columnDefintion = [
            { field: 'PRONo', displayName: 'PRO #', width: 100, cellTemplate: proCellTemplate },
            { field: 'BOLNo', displayName: 'BOL #', width: 100, cellTemplate: soCellTemplate },
            { field: 'ReviewedBy', displayName: 'Rebill Rep', width: 160 },
            { field: 'FullName', displayName: 'Group of Sales Rep', width: 180 },
            { field: 'Name', displayName: 'Sales Rep Number', width: 200 },
            { field: 'CompanyName', displayName: 'Customer', width: 120 },
            { field: 'ReviewDateDisplay', displayName: 'Bill To Rep Date', width: 120 },
            { field: 'TotalCostAdjustment', displayName: 'Cost To Rep', width: 120, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
            { field: 'TotalRevenueAdjustment', displayName: 'Cost Difference', width: 140, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
        ];
        return columnDefintion;
    }

    private load(bindedData) {
        if (!bindedData)
            return;
        var self = this;
        self.fromDate(bindedData.fromDate);
        self.toDate(bindedData.toDate);
        self.isLoaded(bindedData.isLoaded);

        if (refSystem.isObject(self.gridOptions)) {
            self.gridOptions.pagingOptions.pageSize(bindedData.pageSize);
            self.gridOptions.pagingOptions.currentPage(bindedData.currentPage);
            self.getReportData(self.reportAction);
        }
    }

    private getOrderRebill() {
        var self = this;
    }

    //#endregion

    //#region LIFE CYCLE EVENT
    // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
    public attached() {
        var self = this;
        _app.trigger('viewAttached');
        document.onkeypress = (event: KeyboardEvent) => {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode === 13) {
                $('#btngenerateReport').focus();
                self.generateReport();
                return false;
            }
        }
	}

    //The composition engine will execute it prior to calling the binder.
    public activate() {
        return true;
    }

    public deactivate() {
        var self = this;
        var data = {
            fromDate: self.fromDate(),
            toDate: self.toDate(),
            isLoaded: self.isLoaded(),
            pageSize: self.gridOptions.pagingOptions.pageSize(),
            currentPage: self.gridOptions.pagingOptions.currentPage()
        }
	  _app.trigger("registerMyData", data);
    }

    //Composition Complete Event
    public compositionComplete() {
        var self = this;
        self.isLoaded(true);
        self.getReportData(self.reportAction);
    }

    //To load the registered data if any existed.
    public beforeBind() {
        var self = this

		_app.trigger("loadMyData", function (data) {
            if (data) {
                self.load(data);
            } else {
                self.getOrderRebill();
            }
        });
    }

    public cleanup() {
        var self = this;

        self.reportContainer.cleanup("OrderRebillSummaryReportGrid");

        for (var prop in self) {
            if (prop !== "cleanup")
                delete self[prop];
        }
        delete self;
    }
    //#endregion
}

return OrderRebillReportViewModel;