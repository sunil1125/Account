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
import refEnums = require('services/models/common/Enums');
import refBoardReportRequestModel = require('services/models/report/BoardReportRequest');
import refVendorBillClient = require('services/client/VendorBillClient');
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

class ReportsDisputeBoardDetailsViewModel {
	//#region Members
	reportClient: refReportClient.ReportClient = null;
	listProgress: KnockoutObservable<boolean> = ko.observable(false);
	carrierName: KnockoutObservable<string> = ko.observable('');
	reportClick: KnockoutObservable<boolean> = ko.observable(false);

	//#region public report viewer members
	public DisputeBoardReportContainer: _reportViewer.ReportViewerControlV2 = null;
	public headerOptions: _reportViewer.ReportHeaderOption = null;
	public grid: _reportViewer.ReportGridOption = null;
	public reportAction: _reportViewer.ReportAction = null;
	public reportData: KnockoutObservableArray<IDisputeBoardDetailsReport> = null;
	public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	public getReportData: (reportAction: _reportViewer.ReportAction) => any;
	public gridOptions: any;
	public reportType: number;
	public modeType = ko.observable();
	private searchText: KnockoutObservable<string>;
    private boardReportRequest: refBoardReportRequestModel.Models.BoardReportRequest = null;

    vendorBillClient: refVendorBillClient.VendorBillClient = new refVendorBillClient.VendorBillClient();
	//#endregion
	//#endregion

	//#region Constructor
	constructor() {
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
        self.headerOptions.reportExportOptions.getUrl = function (exp: _reportViewer.IExportOptions): any {
            var searchClient = new refVendorBillClient.SearchModel();
			searchClient.PageSize = exp.exportType === 1 ? 2000 : self.gridOptions.pagingOptions.totalServerItems();
            searchClient.PageNumber = 1;
            searchClient.VendorName = self.carrierName();
            searchClient.ExportType = exp.exportType;
            var filterModel = { ExportURL: "Accounting/ExportDisputBoardDataInExcel", FilterModel: searchClient };
            return filterModel;
		}
		//## Region Export Options End.

		self.setReportCriteria = (reportActionObj: _reportViewer.ReportAction) => {
			if (reportActionObj.filter1selectedItemId == undefined || reportActionObj.filter1selectedItemId == 0) {
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectModeFromTheList, "info", null, toastrOptions);

				self.DisputeBoardReportContainer.listProgress(false);
				self.DisputeBoardReportContainer.selectedFilter1Item(self.modeType());
			}
			else {
				self.gridOptions = reportActionObj.gridOptions;
				//if (self.reportAction != null) {
				//	if ((self.modeType() != reportActionObj.filter1selectedItemId) || (self.reportAction.view != reportActionObj.view) ||
				//		(reportActionObj.dateFrom != self.reportAction.dateFrom) || (reportActionObj.dateTo != self.reportAction.dateTo)) {
				//		self.gridOptions.pagingOptions.currentPage(1);
				//	}
				//}

				// Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
				// we don't want any data on page load so we commented getReportdata  function.
				// Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
				if (self.modeType() != reportActionObj.filter1selectedItemId) {
					self.modeType(reportActionObj.filter1selectedItemId);
					self.DisputeBoardReportContainer.columnDefinition(self.setGridColumnDefinitions());
				}

				self.reportAction = reportActionObj;

				if (self.reportClick())
					self.getReportData(reportActionObj);
			}
		};

		self.getReportData = function (reportActionObj: _reportViewer.ReportAction) {
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
				self.reportClient.getDisputeBoardDetaisReport(self.boardReportRequest,
					function (data) {
						self.setPagingData(data.range, data.TotalCount, self.gridOptions.pagingOptions.pageSize());
						self.DisputeBoardReportContainer.listProgress(false);

						deferred.resolve(data, reportActionObj.view);
					},
					function () {
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
			_app.trigger("openVendorBill", vendorBillId, obj.PRONumber, (callback) => {
				if (!callback) {
					return;
				}
			});
		}

		return self;
	}
	//#endregion

	//#region Public Methods
	public viewDisputeBoardReport() {
		var self = this;
		self.reportClick(true);
		self.gridOptions.pagingOptions.currentPage(1);
		self.getReportData(self.reportAction);
	}
	//#endregion

	//#region Private Methods
	private setGridOptions(self: ReportsDisputeBoardDetailsViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("ReportDisputeBoardDetailsGrid");
		grOption.data = <any> self.reportData;
		grOption.columnDefinition = self.setGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
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
	}

	private setGridColumnDefinitions() {
		var colDefinition: Array = [];
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
	}

	private setPagingData(data, page, pageSize) {
		var self = this;
		self.gridOptions.data(data);
		self.gridOptions.data.valueHasMutated();
		self.gridOptions.pagingOptions.totalServerItems(page);
	}

	private load(bindedData) {
		//** if bindedData is null then return false. */
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
	}

	//#endregion

	//#region Life Cycle event
	// Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
	public attached() {
		var self = this;
		_app.trigger('viewAttached');

		//Using Document Key press for search result on enter key press
		document.onkeypress = (event: KeyboardEvent) => {
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if (keycode === 13) {
				$('#btngenerateReport').focus();
				self.viewDisputeBoardReport();
				$('.requiredFieldBgColor').focus();
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
			//carrierName
			carrierName: self.carrierName(),
			pageSize: self.gridOptions.pagingOptions.pageSize(),
			currentPage: self.gridOptions.pagingOptions.currentPage(),
			reportClick: self.reportClick()
		}
	  _app.trigger("registerMyData", data);
		// Remove the event registration from Document
		document.onkeypress = undefined;

		self.cleanup();
	}

	//** Using for focus cursor on last cycle for focusing in vendor name
	public compositionComplete(view, parent) {
		$("input:text:visible:first").focus();
	}

	//To load the registered data if any existed.
	public beforeBind() {
		var self = this

		_app.trigger("loadMyData", function (data) {
			if (data) {
				self.load(data);
			} else {
				//_app.trigger("closeActiveTab");
				//_app.trigger("NavigateTo", 'Home');
			}
		});
	}

	public cleanup() {
		var self = this;

		self.DisputeBoardReportContainer.cleanup("ReportDisputeBoardDetailsGrid");

		for (var prop in self) {
			if (prop !== "cleanup")
				delete self[prop];
		}
		delete self;
	}
	//#endregion
}

return ReportsDisputeBoardDetailsViewModel;