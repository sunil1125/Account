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

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refReportClient = require('services/client/ReportClient');
import _reportViewer = require('../templates/reportViewerControlV2');
import refBoardReportRequestModel = require('services/models/report/BoardReportRequest');
import refEnums = require('services/models/common/Enums');
import refVendorBillClient = require('services/client/VendorBillClient');
//#endregion

/*
** <summary>
** Report Vendor Bill Exception report View Model.
** </summary>
** <createDetails>
** <id>US8214</id> <by>Baldev Singh Thakur</by> <date>12-11-2014</date>}
** </createDetails>}
** <changeHistory>}
** <id>DE20737</id> <by>Vasanthakumar</by> <date>26-11-2015</date><description>Enabled the grid setting saving option</description>
** <id>US20647</id> <by>Chandan Singh Bajetha</by> <date>17-02-2016</date><description>Acct: Implement Search on all Reports</description>
** <id>US23369</id> <by>Baldev Singh Thakur</by> <date>22-07-2016</date><description>Passing the Search text to Server model.</description>
** </changeHistory>
*/
class RebillSummaryReportViewModel {
    //#region Members
    reportClient: refReportClient.ReportClient = null;
    listProgress: KnockoutObservable<boolean> = ko.observable(false);
    private boardReportRequest: refBoardReportRequestModel.Models.BoardReportRequest = null;
    // search text through grid filter
    searchText: KnockoutObservable<string>;
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

    //#region Constructor
    constructor() {
        var self = this;
        self.headerOptions = new _reportViewer.ReportHeaderOption();
        self.headerOptions.gridTitleHeader = " ";
        self.headerOptions.reportHeader = "Rebill Summary Report";
        self.headerOptions.reportName = "Rebill Summary Report";
        self.reportAction = new _reportViewer.ReportAction();
        self.grid = self.setGridOptions(self);

        self.reportClient = new refReportClient.ReportClient();

        self.searchText = ko.observable("");

        //#region Export Options
        var exportOptions = ko.observableArray([
            { exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
            { exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) }]);

        self.headerOptions.reportExportOptions = new _reportViewer.ReportExportControl(exportOptions);

        self.headerOptions.reportExportOptions.getUrl = function (exp: _reportViewer.IExportOptions): any {
			var searchClient = new refVendorBillClient.SearchModel();
			// ###START: US23369
			searchClient.SearchValue = self.searchText().trim();

			// ###END: US23369
			//searchClient.SortOrder = self.sorttype();
			//searchClient.SortCol = self.sortCol();
            searchClient.PageSize = exp.exportType === 1 ? 2000 : self.gridOptions.pagingOptions.totalServerItems();
            searchClient.PageNumber = 1;
            searchClient.ExportType = exp.exportType;

            var filterModel = { ExportURL: "Accounting/ExportRebillSummaryReportInExcel", FilterModel: searchClient };
            return filterModel;
        }
        //#endregion

        self.setReportCriteria = (reportActionObject: _reportViewer.ReportAction) => {
            self.gridOptions = reportActionObject.gridOptions;
            if (self.reportAction != null) {
                if ((self.modeType() != reportActionObject.filter1selectedItemId) || (self.reportAction.view != reportActionObject.view)) {
                }
            }

            self.reportAction = reportActionObject;
            self.getReportData(reportActionObject);
        };

        self.getReportData = function (reportActionObj: _reportViewer.ReportAction) {
            var deferred = $.Deferred();
            var promise = deferred.promise();
            var pageNo = 0;
            pageNo = Number(self.gridOptions.pagingOptions.currentPage());
            if (pageNo > 0) {
                self.reportContainer.listProgress(true);
                self.boardReportRequest = new refBoardReportRequestModel.Models.BoardReportRequest();
                self.boardReportRequest.PageNumber = self.gridOptions.pagingOptions.currentPage();
				self.boardReportRequest.PageSize = self.gridOptions.pagingOptions.pageSize();
				// ###START: US20647
				self.boardReportRequest.GridSearchText = self.searchText().trim();
				// ###END: US20647
                self.reportClient.getRebillSummaryReport(self.boardReportRequest, function (data) {
                    self.setPagingData(data.range, data.TotalCount, self.gridOptions.pagingOptions.pageSize());
                    self.reportContainer.listProgress(false);
                    deferred.resolve(data, reportActionObj.view);
                    self.reportContainer.invokeHighlight(self.searchText());
                }, function () {
                        self.reportContainer.listProgress(false);
                        ////var toasterOptions = {
                        ////    toastrPositionClass: "toast-top-middle",
                        ////    delayInSeconds: 10,
                        ////    fadeOut: 10,
                        ////    typeOfAlert: "",
                        ////    title: ""
                        ////}
                        ////Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ErrorOccurredWhileFetchingRebillSummaryReport, "error", null, toasterOptions);
                    });
            }
            return promise;
        };

        self.reportContainer = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
        self.reportContainer.onFilterChange = self.setReportCriteria;
        self.reportContainer.ForceChange();

        //#region Redirects to Vendor Bill Order Page
        self.reportContainer.onProNumberClick = function (obj) {
            var vendorBillId = obj.VendorBillId;
            _app.trigger("openVendorBill", vendorBillId, obj.VendorBillProNo, (callback) => {
                if (!callback) {
                    return;
                }
            });
        }
        //#endregion

        //#region Redirect to Sales Order Edit page
        self.reportContainer.onSalesOrderClick = function (obj) {
            var salesOrderId = obj.SalesOrder;
            _app.trigger("openSalesOrder", salesOrderId, obj.SalesOrder, (callback) => {
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
				//to blank grid data
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

    //#region Private Function

    private setPagingData(data, page, pageSize) {
        var self = this;
        self.gridOptions.data(data);
        self.gridOptions.data.valueHasMutated();
        self.gridOptions.pagingOptions.totalServerItems(page);
    }

    private setGridOptions(self: RebillSummaryReportViewModel): _reportViewer.ReportGridOption {
        var gridOption = new _reportViewer.ReportGridOption();
        gridOption.enableSelectiveDisplay = true;
        gridOption.showGridSearchFilter = true;
        gridOption.showPageSize = true;
        gridOption.UIGridID = ko.observable("RebillSummaryReportGrid");
        gridOption.data = <any> self.reportData;
        gridOption.columnDefinition = self.setGridColumnDefinitions();
        gridOption.useExternalSorting = false;
        gridOption.sortedColumn = <_reportViewer.SortOrder> { columnName: "ProNumber", order: "DESC" };
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
        var soCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'SalesOrder\'], click: function() { $userViewModel.onSalesOrderClick($parent.entity)}" />';
        var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'VendorBillProNo\'], click: function() { $userViewModel.onProNumberClick($parent.entity) }" />';

        columnDefintion = [
            { field: 'VendorBillProNo', displayName: 'PRO #', width: 120, cellTemplate: proCellTemplate },
            { field: 'SalesOrder', displayName: 'BOL #', width: 120, cellTemplate: soCellTemplate },
            { field: 'VendorBillId', displayName: 'Vendor Bill #', width: 120 },
            { field: 'VBCarrier', displayName: 'VB Carrier', width: 120 },
            { field: 'BillStatus', displayName: 'Bill Status', width: 120 },
            { field: 'PickupDate', displayName: 'Pick Up Date', width: 120 },
            { field: 'CompanyName', displayName: 'Company Name', width: 120 },
            { field: 'OldWeight', displayName: 'Old Weight', width: 120 },
            { field: 'NewWeight', displayName: 'New Weight', width: 120 },
            { field: 'OldCost', displayName: 'Old Cost', width: 120, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
            { field: 'NewCost', displayName: 'New Cost', width: 120, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
            { field: 'SalesRep', displayName: 'Sales Rep', width: 120 },
            { field: 'Name', displayName: 'Agent #', width: 120 },
            { field: 'RequoteDateDisplay', displayName: 'Requote Date', width: 120 },
            { field: 'ShipmentNotes', displayName: 'Shipment Note', width: 120 },
            { field: 'DisputeNotes', displayName: 'Dispute Note', width: 120 },
            { field: 'RequoteNotes', displayName: 'Requote Note', width: 120 }
        ];
        return columnDefintion;
    }

    private load(bindedData) {
        if (!bindedData)
            return;

        var self = this;
        if (refSystem.isObject(self.gridOptions)) {
            self.gridOptions.pagingOptions.pageSize(bindedData.pageSize);
            self.gridOptions.pagingOptions.currentPage(bindedData.currentPage);
            self.getReportData(self.reportAction);
        }
    }

    //#endregion

    //#region Life Cycle Events

    // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
    public attached() {
        _app.trigger('viewAttached');
    }

    //The composition engine will execute it prior to calling the binder.
    public activate() {
        return true;
    }

    public deactivate() {
        var self = this;
        var data = {
            //carrierName
            pageSize: self.gridOptions.pagingOptions.pageSize(),
            currentPage: self.gridOptions.pagingOptions.currentPage()
        }
	  _app.trigger("registerMyData", data);

		self.cleanup();
    }

    //To load the registered data if any existed.
    public beforeBind() {
        var self = this

		_app.trigger("loadMyData", function (data) {
            if (data) {
                self.load(data);
            } else {
            }
        });
    }

	public cleanup() {
		var self = this;

		self.reportContainer.cleanup("RebillSummaryReportGrid");

		for (var prop in self) {
			if (prop !== "cleanup")
				delete self[prop];
		}
		delete self;
	}
    //#endregion
}

return RebillSummaryReportViewModel;