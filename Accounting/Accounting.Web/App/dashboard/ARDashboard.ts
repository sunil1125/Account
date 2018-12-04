/******************************************************************************

* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 

******************************************************************************/

//#region References
/// <reference path="../services/models/TypeDefs/Boards.d.ts" />
/// <reference path="../services/models/TypeDefs/Dashboard.d.ts" />
/// <reference path="../localStorage/LocalStorage.ts" />
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
//#endregion

import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refCommonClient = require('services/client/CommonClient');
import _reportViewer = require('../templates/reportViewerControlV2');
import refEnums = require('services/models/common/Enums');
import refVendorBillClient = require('services/client/VendorBillClient');

/*
** <summary>
** View Model for AR Dashboard tab on the Welcome page
** </summary>
** <createDetails>
** <id>US25143</id> <by>Shreesha Adiga</by><date>05-10-2016</date>
** </createDetails>
** <changeHistory>
** <id>US25144</id> <by>Dhaval Tamhane</by><date>06-10-2016</date>
** <id>US25144</id> <by>Shreesha Adiga</by><date>07-10-2016</date><description>UI improvements</description>
** <id>US25237</id> <by>Janakiram</by><date>12-10-2016</date><description>Action for 'Process Credit' Button cliks opening pop-up </description>
** <id>US25144</id> <by>Shreesha Adiga</by><date>14-10-2016</date><description>Changes to columns</description>
** <id>US25164</id> <by>Vasanthakumar</by><date>21-10-2016</date><description>Populate AR Dashboard grid</description>
** <id>DE24887</id> <by>Vasanthakumar</by><date>25-10-2016</date><description>Sorting on action button and bol click not opening so</description>
** <id>US25315</id> <by>Janakiram</by><date>26-10-2016</date><description>Passing data to Populate data on MAS Credit pop-up</description>
** <id>US25369</id> <by>Janakiram</by><date>26-10-2016</date><description>Added Notes on Processing Credit</description>
** <id>US25685</id> <by>Shreesha Adiga</by><date>18-11-2016</date><description>Add a new grid for Vendor Bill Reassignment</description>
** <id>US25686</id> <by>Vasanthakumar</by> <date>25-11-2016</date> <description>Acct: Populate Data on AR Dashboard for vendor bill reassignment.</description>
** <id>DE25209</id> <by>Vasanthakumar</by> <date>30-11-2016</date> <description>Credit and vendor calls are called when clicked on Dashboard</description>
** <id>US25843</id> <by>Vasanthakumar</by> <date>08-12-2016</date> <description>Acct: Raise a CM Request from VB Reassignment Dashboard</description>
** <id>US25940</id> <by>Baldev Singh Thakur</by> <date>13-12-2016</date> <description>Acct: Add a new column Customer Type in Credit Request Grid</description>
** <id>US25942</id> <by>Baldev Singh Thakur</by> <date>20-12-2016</date><description>Acct: Validate Customer Credit Amount Field</description>
** <id>US25942</id> <by>Janakiram</by> <date>21-12-2016</date><description>Code Clean up for final Revenue</description>
** <id>US26434</id> <by>Vasanthakumar</by> <date>17-01-2017</date> <description>Acct: Show New and Old SO on CM Dashboard, If request raised from VB Reassignment.</description>
** <id>US27148</id> <by>Vasanthakumar</by> <date>23-02-2017</date> <description>Acct: Handle concurrent Processing on VB Reassignment Dashboard</description>
** <id>DE26017</id> <by>Vasanthakumar</by> <date>01-03-2017</date> <description>Improper UI on AR_dashboard in IE11</description>
** <id>DE25976</id> <by>Baldev Singh Thakur</by> <date>23-02-2017</date><description>Passing Requested By user id to process pop up.</description>
** <id>US27352</id> <by>Baldev Singh Thakur</by> <date>07-03-2017</date> <description>Added validation to check if re-assigned vendor bill can be processed.</description>
** <id>US27216</id> <by>Baldev Singh Thakur</by> <date>09-03-2017</date> <description>Added requested date display column for Credit memo request and changed the position of requested date in vendor bill reassignment.</description>
** </changeHistory>
*/
export class ARDashboardViewModel {

	//#region Properties
	// ###START: US25164
	commonClient: refCommonClient.Common = new refCommonClient.Common();
	// ###END: US25164
	//#region Credit Request Grid Properties
	public arDashboardReportContainer: _reportViewer.ReportViewerControlV2 = null;
	public headerOptions: _reportViewer.ReportHeaderOption = null;
	public grid: _reportViewer.ReportGridOption = null;
	public reportAction: _reportViewer.ReportAction = null;
	public reportData: KnockoutObservableArray<IARDashboardDetails> = null;
	public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	public getReportData: (reportAction: _reportViewer.ReportAction) => any;
	public gridOptions: any;
	// ###START: US25164
	private searchText: KnockoutObservable<string>;
	sortCol: KnockoutObservable<string> = ko.observable('');
	sorttype: KnockoutObservable<string> = ko.observable('');
	// ###END: US25164
	showCreditMemoRequestGrid: KnockoutComputed<boolean>;
	//#endregion

	currentDateTime: KnockoutObservable<string> = ko.observable('');
	isActiveTab: KnockoutObservable<boolean> = ko.observable(false);

	// ##START: US25685
	boardTypeDropdownOptions: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	selectedGridType: KnockoutObservable<IEnumValue> = ko.observable();
	reloadGridClass: KnockoutComputed<string>;

	//#region VB Reassign Grid Properties
	public vbReassignGridContainer: _reportViewer.ReportViewerControlV2 = null;
	//public headerOptionsVBR: _reportViewer.ReportHeaderOption = null;
	public gridVBR: _reportViewer.ReportGridOption = null;
	public reportActionVBR: _reportViewer.ReportAction = null;
	public reportDataVBR: KnockoutObservableArray<IARDashboardDetails> = null;
	public setReportCriteriaVBR: (reportAction: _reportViewer.ReportAction) => any;
	public getReportDataVBR: (reportAction: _reportViewer.ReportAction) => any;
	public gridOptionsVBR: any;
	// ###START: US25164
	//private searchTextVB: KnockoutObservable<string>;
	sortColVBR: KnockoutObservable<string> = ko.observable('');
	sorttypeVBR: KnockoutObservable<string> = ko.observable('');

	showVBReassignmentGrid: KnockoutComputed<boolean>;

	//#endregion
	//#endregion
	// ##END: US25685

	//#region Constructor
	constructor() {
		var self = this;

		// ##START: US25685
		if (refSystem.isObject(refEnums.Enums.ARDashboardGridTypes)) {
			self.boardTypeDropdownOptions.removeAll();
			for (var item in refEnums.Enums.ARDashboardGridTypes) {
				self.boardTypeDropdownOptions.push(refEnums.Enums.ARDashboardGridTypes[item]);
			}
		}

		self.selectedGridType.subscribe((newValue) => {
			var self = this;
			// ##START: US25843
			if (self.searchText().length > 0) {
				self.searchText('');
				self.gridOptionsVBR.filterOptions.filterText('');
				self.gridOptions.filterOptions.filterText('');
			}
			// ##END: US25843

			self.loadARDashboard();
		});

		self.reloadGridClass = ko.computed(() => {
			return typeof self.selectedGridType() !== 'undefined' && self.selectedGridType().ID === refEnums.Enums.ARDashboardGridTypes.CreditMemoRequest.ID
				? 'credit-request-grid-reload margin-left-reloadarboard-creditrequest-firefox margin-left-reloadarboard-creditrequest-ie'
				: 'vendorbill-reassignment-grid-reload margin-left-reloadarboard-vbreassign-firefox margin-left-reloadarboard-vbreassign-ie';
		});

		self.showCreditMemoRequestGrid = ko.computed(() => {
			return typeof self.selectedGridType() !== 'undefined' && self.selectedGridType().ID === refEnums.Enums.ARDashboardGridTypes.CreditMemoRequest.ID;
		});

		self.showVBReassignmentGrid = ko.computed(() => {
			return typeof self.selectedGridType() !== 'undefined' && self.selectedGridType().ID === refEnums.Enums.ARDashboardGridTypes.VendorBillReassignment.ID;
		});
		// ##END: US25685

		//#region Credit Request Grid
		// ###START: US25164
		self.headerOptions = new _reportViewer.ReportHeaderOption();
		self.headerOptions.reportHeader = " ";
		self.headerOptions.reportName = "AR Dashboard";
		self.headerOptions.gridTitleHeader = " ";
		self.searchText = ko.observable("");
		self.reportAction = new _reportViewer.ReportAction();
		self.grid = self.setGridOptions(self);
		// ###END: US25164

		self.setReportCriteria = (reportActionObj: _reportViewer.ReportAction) => {
			self.gridOptions = reportActionObj.gridOptions;
			self.reportAction = reportActionObj;

			// ###START: US25164
			if ((reportActionObj != undefined || reportActionObj != null) && (reportActionObj.gridOptions != undefined || reportActionObj.gridOptions != null) && (refSystem.isObject(reportActionObj.gridOptions.sortInfo())) && (reportActionObj.gridOptions.sortInfo().column != undefined || reportActionObj.gridOptions.sortInfo().column != null) && (reportActionObj.gridOptions.sortInfo().column.field != undefined || reportActionObj.gridOptions.sortInfo().column.field != null)) {
				self.sortCol(reportActionObj.gridOptions.sortInfo().column.field);
				self.sorttype(reportActionObj.gridOptions.sortInfo().direction);
				// ###START: US27216
				if (self.sortCol() == 'Action') {
					self.sortCol('RequestedDate');
				}
				if (self.sortCol() === 'RequestedDateDisplay') {
					self.sortCol('RequestedDate');
				}
			}
			else {
				self.sortCol("RequestedDate");
				self.sorttype("asc");
			}
			// ###END: US27216

			// Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
			// we don't want any data on page load so we commented getReportdata  function.
			// self.getReportData();
			self.reportAction = reportActionObj;

			// Flag is added to restrict multiple service calls.
			if (self.arDashboardReportContainer.reportColumnFilter.isFilterApply || self.arDashboardReportContainer.isPaginationChanged || self.arDashboardReportContainer.isSortingChanged) {
				if (true) {
					self.getReportData(reportActionObj);
					self.arDashboardReportContainer.isPaginationChanged = false;
					self.arDashboardReportContainer.isSortingChanged = false;
				}
			}
			// ###END: US25164
		};

		self.getReportData = (reportActionObj: _reportViewer.ReportAction) => {
			// ###START: US25164
			// ###START: DE25209
			if (!self.isActiveTab() || (typeof self.selectedGridType() !== 'undefined' && self.selectedGridType().ID !== refEnums.Enums.ARDashboardGridTypes.CreditMemoRequest.ID)) {
				return;
			}
			// ###END: DE25209
			var deferred = $.Deferred();
			var promise = deferred.promise();
			var pageno = 0;
			pageno = Number(self.gridOptions.pagingOptions.currentPage());

			if (pageno > 0) {
				self.arDashboardReportContainer.listProgress(true);

				var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: undefined }
		       var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.CreditMemoRequest, IsFilterApplied: self.arDashboardReportContainer.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype() };
				self.commonClient.GetCreditMemoRequestDetails(filterDataToSave,
					(data) => {
						self.arDashboardReportContainer.listProgress(false);
						self.setPagingData(data.CreditMemoRequestBoard, data.TotalRows, self.gridOptions.pagingOptions.pageSize());
						deferred.resolve(data, reportActionObj.view);
					},
					() => {
						self.setPagingData([], 0, self.gridOptions.pagingOptions.pageSize());
						deferred.resolve({}, reportActionObj.view);
						self.arDashboardReportContainer.listProgress(false);
					});

				//to block unwanted server calls
				self.arDashboardReportContainer.isPaginationChanged = false;
				self.arDashboardReportContainer.isSortingChanged = false;
			}
			// ###END: US25164
		};

		var exportOpt = ko.observableArray([
			{ exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
			{ exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) },
		]);

		self.headerOptions.reportExportOptions = new _reportViewer.ReportExportControl(exportOpt);

		// ###START: US25164
		self.headerOptions.reportExportOptions.getUrl = function (exp: _reportViewer.IExportOptions): any {
			var searchClient = new refVendorBillClient.SearchModel();
			searchClient.SearchValue = self.searchText().trim();
			
			searchClient.PageNumber = 1;
			searchClient.ExportType = exp.exportType;

			var filterModel = null;

			if (typeof self.selectedGridType() !== 'undefined' && self.selectedGridType().ID === refEnums.Enums.ARDashboardGridTypes.VendorBillReassignment.ID) {
				searchClient.SortOrder = self.sorttypeVBR();
				searchClient.SortCol = self.sortColVBR();
				searchClient.PageSize = exp.exportType === 1 ? 2000 : self.gridOptionsVBR.pagingOptions.totalServerItems();
				filterModel = { ExportURL: "Accounting/ExportVendorBillReassignmentBoardDetailsInExcel", FilterModel: searchClient }
			}
			else {
				searchClient.SortOrder = self.sorttype();
				searchClient.SortCol = self.sortCol();
				searchClient.PageSize = exp.exportType === 1 ? 2000 : self.gridOptions.pagingOptions.totalServerItems();
				filterModel = { ExportURL: "Accounting/ExportCreditMemoRequestBoardDetailsInExcel", FilterModel: searchClient }
			}
			return filterModel;
		}
		// ###END: US25164

		self.arDashboardReportContainer = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);

		self.arDashboardReportContainer.showOptionalHeaderRow(false);
		self.arDashboardReportContainer.OptionalHeaderRowLocation('TOP');

		self.arDashboardReportContainer.onFilterChange = self.setReportCriteria;
		//self.arDashboardReportContainer.ForceChange();

		// ###START: US25164
		//for search filter
		self.arDashboardReportContainer.onSearchTextChange = function (reportViewer, newSearchValue) {
			var searchString = newSearchValue;
			self.searchText(searchString.trim());
			if (!self.arDashboardReportContainer.reportColumnFilter.isFilterApply) {
				self.arDashboardReportContainer.reportColumnFilter.clearAll();
			}
			self.arDashboardReportContainer.reportColumnFilter.isFilterApply = false;

			self.getReportData(self.reportAction);
			self.gridOptions.pagingOptions.currentPage(1);
		};

		// TO open sales Order
		self.arDashboardReportContainer.onBolNumberClick = function (arObj) {
			// ###START: DE24887
			var salesOrderId = arObj.ShipmentId;
			// ###END: DE24887
			_app.trigger("openSalesOrder", salesOrderId, arObj.BOLNumber, (callback) => {
				if (!callback) {
					return;
				}
			});
		};
		// ###END: US25164

		self.arDashboardReportContainer.onSalesOrderClick = function (arObj) {
			var salesOrderId = arObj.NewShipmentId;
			_app.trigger("openSalesOrder", salesOrderId, arObj.NewBOLNumber, (callback) => {
				if (!callback) {
					return;
				}
			});
		};

		// ###START: US25237
		self.arDashboardReportContainer.onGridColumnClick = function (shipmentObj) {
			// ###START: US25315
			var onSaveClickCallback = function () {
				self.reloadPage();
			};

			var emailPopupData = {
				CreditRequestId: shipmentObj.CreditRequestId,
				BOLNumber: shipmentObj.BOLNumber,
				CreditAmount: shipmentObj.CustomerCreditAmount,
				VendorCreditAmount: shipmentObj.VendorCreditAmount,
				NotesDescription: shipmentObj.NotesDescription,
				// ###START: US25369
				ShipmentId: shipmentObj.ShipmentId,
				// ###END: US25369

				// ###START: US25369
				CreditReasonId: shipmentObj.CreditReasonId,
				// ###END: US25369
				// ###START: DE25976
				CreditRequestedBy: shipmentObj.RequestedUserId
				// ###END: DE25976
			};
			// ###END: US25315
			// object to be passed to the popup
			var optionControlArgs: IMessageBoxOption = {
				message: '',
				title: 'Confirmation',
				bindingObject: {
					emailPopupData: emailPopupData,
					// ###START: US25315
					saveCallback: onSaveClickCallback
					// ###END: US25315
				}
			};

			_app.showDialog('dashboard/ProcessCredittoMasPopup', optionControlArgs); //show popup 
		}
		// ###END: US25237

		//#endregion

		// ##START: US25685
		// initialize vb reassignment grid
		self.initializeVBReassignmentGrid();
		// ##END: US25685

		self.arDashboardReportContainer.ForceChange();
		return self;
	}
	//#endregion Constructor

	//#region Private methods

	//#region Credit Request Grid Methods
	private setGridOptions(self: ARDashboardViewModel): _reportViewer.ReportGridOption {
		var gridOption = new _reportViewer.ReportGridOption();
		gridOption.enableSelectiveDisplay = true;
		gridOption.showGridSearchFilter = true;
		gridOption.showPageSize = true;
		gridOption.UIGridID = ko.observable("ARDashboard");
		gridOption.data = <any> self.reportData;
		gridOption.columnDefinition = self.setGridColumnDefinitions();
		gridOption.useExternalSorting = false;
		// ###START: US27216
		gridOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "RequestedDate",
			order: "asc"
		};
		// ###END: US27216
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
		gridOption.enableSaveGridSettings = true;
		// ###START: US25164
		gridOption.useClientSideFilterAndSort = false;
		// ###END: US25164
		gridOption.showColumnMenu = false;
		gridOption.enableColumnResize = false;
		return gridOption;
	}

	private setGridColumnDefinitions() {
		var colDefinition: Array = [];

		// ###START: US25164
		//## BOLNumber & Action Button Cell Templates.
		var bolCellTemplate = '<div style="display: inline-table"><a style="cursor: pointer;display: inline-table" data-bind="text: $parent.entity[\'BOLNumber\'], style: { color: $parent.entity[\'IsRequestFromVBReassignment\'] ? \'red\' : \'\' }, click: function() { $userViewModel.onBolNumberClick($parent.entity) }, attr:{ title: $data.getProperty($parent)}" /><span style="display: inline-table" data-bind="visible: $parent.entity[\'IsRequestFromVBReassignment\']">,</span><a style="cursor: pointer;display: inline-table;padding-left: 3px;" data-bind="text: $parent.entity[\'NewBOLNumber\'], click: function() { $userViewModel.onSalesOrderClick($parent.entity) }, attr:{ title: $data.getProperty($parent)}" /></div>';
		// ###END: US25164
		// ###START: US25237
		var actionCellTemplate = '<button  class="moreInfoBtn"  data-bind="click: function() { $userViewModel.onGridColumnClick($parent.entity) }">Process Credit</button>';
		// ###END: US25237

		// ###START: US25164
		colDefinition = [
			{ field: 'BOLNumber', displayName: 'BOL#', width: 180, cellTemplate: bolCellTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'FinalVBCost', displayName: 'Final VB Cost', width: 150, cellTemplate: refEnums.Enums.GridCellFormatTemplates.CenterAlignCurrencyTemplate, cellClass: 'priceTxtColor', type: _reportViewer.DataTypes.Numeric },
			{ field: 'FinalRevenue', displayName: 'Final Revenue', width: 150, cellTemplate: refEnums.Enums.GridCellFormatTemplates.CenterAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric },
			{ field: 'CustomerCreditAmount', displayName: 'Credit Amount', width: 150, cellTemplate: refEnums.Enums.GridCellFormatTemplates.CenterAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric },
			{ field: 'FinalMargin', displayName: 'Final Margin', width: 150, cellTemplate: refEnums.Enums.GridCellFormatTemplates.CenterAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric },
			{ field: 'RequestedBy', displayName: 'Requested By', width: 200, type: _reportViewer.DataTypes.String },
			{ field: 'CreditReason', displayName: 'Credit Reason', width: 200, type: _reportViewer.DataTypes.String },
			// ###START: US25940
			{ field: 'CustomerType', displayName: 'Customer Payment Terms', width: 225, type: _reportViewer.DataTypes.String },
			// ###END: US25940
			// ###START: US27216
			{ field: 'RequestedDateDisplay', displayName: 'Date', width: 175, cellTemplate: refEnums.Enums.GridCellFormatTemplates.CenterAlignTemplate, type: _reportViewer.DataTypes.DateTime },
			// ###END: US27216
			// ###START: US25237
			{ field: 'Action', displayName: 'Action', width: 200, cellTemplate: actionCellTemplate, sortable: false }
			// ###END: US25237
		];
		// ###END: US25164

		return colDefinition;
	}

	private setPagingData(data, page, pageSize) {
		var self = this;
		self.gridOptions.data(data);
		self.gridOptions.data.valueHasMutated();
		self.gridOptions.pagingOptions.totalServerItems(page);
		self.arDashboardReportContainer.listProgress(false);
	}
	//#endregion

	// ##START: US25685
	// ##START: US25686
	//#region VB Reassignment Grid Methods
	// called from the constructor: prepare vb reassignment grid columns and default methods
	private initializeVBReassignmentGrid() {
		var self = this;

		//self.headerOptionsVBR = new _reportViewer.ReportHeaderOption();
		//self.headerOptionsVBR.reportHeader = " ";
		//self.headerOptions.reportName = "AR Dashboard VendorBill Reassignment";
		self.headerOptions.gridTitleHeader = " ";
		self.searchText = ko.observable("");
		self.reportAction = new _reportViewer.ReportAction();
		self.gridVBR = self.setGridOptionsVBR(self);

		self.setReportCriteriaVBR = (reportActionObj: _reportViewer.ReportAction) => {
			self.gridOptionsVBR = reportActionObj.gridOptions;
			self.reportActionVBR = reportActionObj;

			if ((reportActionObj != undefined || reportActionObj != null) && (reportActionObj.gridOptions != undefined || reportActionObj.gridOptions != null) && (refSystem.isObject(reportActionObj.gridOptions.sortInfo())) && (reportActionObj.gridOptions.sortInfo().column != undefined || reportActionObj.gridOptions.sortInfo().column != null) && (reportActionObj.gridOptions.sortInfo().column.field != undefined || reportActionObj.gridOptions.sortInfo().column.field != null)) {
				self.sortColVBR(reportActionObj.gridOptions.sortInfo().column.field);
				self.sorttypeVBR(reportActionObj.gridOptions.sortInfo().direction);
				if (self.sortColVBR() == 'Action') {
					self.sortColVBR('VBReassignDate');
				}
				if (self.sortColVBR() == 'VBReassignDateDisplay') {
					self.sortColVBR('VBReassignDate');
				}
			}
			else {
				self.sortColVBR("VBReassignDate");
				self.sorttypeVBR("asc");
			}

			// Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
			// we don't want any data on page load so we commented getReportdata  function.
			// self.getReportData();
			self.reportActionVBR = reportActionObj;

			// Flag is added to restrict multiple service calls.
			if (self.vbReassignGridContainer.reportColumnFilter.isFilterApply || self.vbReassignGridContainer.isPaginationChanged || self.vbReassignGridContainer.isSortingChanged) {
				if (true) {
					self.getReportDataVBR(reportActionObj);
					self.vbReassignGridContainer.isPaginationChanged = false;
					self.vbReassignGridContainer.isSortingChanged = false;
				}
			}
		};

		self.getReportDataVBR = (reportActionObj: _reportViewer.ReportAction) => {
			// ###START: DE25209
			if (!self.isActiveTab() || (typeof self.selectedGridType() !== 'undefined' && self.selectedGridType().ID !== refEnums.Enums.ARDashboardGridTypes.VendorBillReassignment.ID)) {
				return;
			}
			// ###END: DE25209
			var deferred = $.Deferred();
			var promise = deferred.promise();
			var pageno = 0;
			pageno = Number(self.gridOptionsVBR.pagingOptions.currentPage());

			if (pageno > 0) {
				self.vbReassignGridContainer.listProgress(true);

				var saveData = { PageSize: self.gridOptionsVBR.pagingOptions.pageSize(), Filters: undefined }
		       var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.VendorBillReassignment, IsFilterApplied: self.vbReassignGridContainer.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.gridOptionsVBR.pagingOptions.currentPage(), SortCol: self.sortColVBR(), SortOrder: self.sorttypeVBR() };

				self.commonClient.GetVendorBillReassignmentDetails(filterDataToSave,
					(data) => {
						self.vbReassignGridContainer.listProgress(false);
						self.setPagingDataVBR(data.VendorBillReassignmentBoard, data.TotalRows, self.gridOptionsVBR.pagingOptions.pageSize());
						deferred.resolve(data, reportActionObj.view);
					},
					() => {
						self.vbReassignGridContainer.listProgress(false);
					});

				//to block unwanted server calls
				self.vbReassignGridContainer.isPaginationChanged = false;
				self.vbReassignGridContainer.isSortingChanged = false;
			}
		};

		self.vbReassignGridContainer = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.gridVBR);

		self.vbReassignGridContainer.showOptionalHeaderRow(false);
		self.vbReassignGridContainer.OptionalHeaderRowLocation('TOP');

		self.vbReassignGridContainer.onFilterChange = self.setReportCriteriaVBR;
		//self.arDashboardReportContainer.ForceChange();

		//for search filter
		self.vbReassignGridContainer.onSearchTextChange = function (reportViewer, newSearchValue) {
			var searchString = newSearchValue;
			self.searchText(searchString.trim());
			if (!self.vbReassignGridContainer.reportColumnFilter.isFilterApply) {
				self.vbReassignGridContainer.reportColumnFilter.clearAll();
			}
			self.vbReassignGridContainer.reportColumnFilter.isFilterApply = false;

			self.getReportDataVBR(self.reportActionVBR);
			self.gridOptionsVBR.pagingOptions.currentPage(1);
		};

		// TO open current sales Order
		self.vbReassignGridContainer.onBolNumberClick = function (arObj) {
			var salesOrderId = arObj.CurrentSOId;
			_app.trigger("openSalesOrder", salesOrderId, arObj.CurrentSO, (callback) => {
				if (!callback) {
					return;
				}
			});
		};

		// TO open vendor bill
		self.vbReassignGridContainer.onProNumberClick = function (arObj) {
			var vendorBillId = arObj.VendorBillId;
			_app.trigger("openVendorBill", vendorBillId, arObj.PRONo, (callback) => {
				if (!callback) {
					return;
				}
			});
		};

		// TO open new sales Order
		self.vbReassignGridContainer.onSalesOrderClick = function (arObj) {
			var salesOrderId = arObj.NewSOId;
			_app.trigger("openSalesOrder", salesOrderId, arObj.NewSO, (callback) => {
				if (!callback) {
					return;
				}
			});
		};

		/// <summary>
		/// Process reassigned Vendor bill
		/// </summary>
		/// <createDetail>
		/// <id>US25686</id> <by>Vasanthakumar</by> <date>25-11-2016</date>
		/// </createDetail>
		/// <changeHistory>
		/// <id>US27352</id> <by>Baldev Singh Thakur</by> <date>07-03-2017</date> <description>Added validation to check if re-assigned vendor bill can be processed.</description>
		/// </changeHistory>
		self.vbReassignGridContainer.onGridColumnClick = function (shipmentObj) {

			self.vbReassignGridContainer.listProgress(true);

			var vendorBillReassignment = {
				VendorBillReassignmentId: shipmentObj.VendorBillReassignmentId,
				VendorBillId: shipmentObj.VendorBillId,
				PRONo: shipmentObj.PRONo,
				CurrentSOId: shipmentObj.CurrentSOId,
				CurrentSO: shipmentObj.CurrentSO,
				NewSOId: shipmentObj.NewSOId,
				NewSO: shipmentObj.NewSO,
				ReassignmentReason: shipmentObj.ReassignmentReason,
				AmountToCredit: shipmentObj.AmountToCredit,
				NotesDescription: shipmentObj.NotesDescription,
				// ###START: US25843
				IsCreditToCurrentSO: shipmentObj.IsCreditToCurrentSO,
				RequestedBy: shipmentObj.RequestedBy
				// ###END: US25843
			};

			self.commonClient.VendorBillReassignmentProcess(vendorBillReassignment,
				(data) => {
					self.vbReassignGridContainer.listProgress(false);
					var toastrOptions1 = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
					// ###START: US25843
					if (shipmentObj.IsCreditToCurrentSO === true) {
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.CreditMemoRequestSuccessFromVBReassignment, "success", null, toastrOptions1, null);
					}
					// ###END: US25843
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.MailSentSuccessfullyDispute, "success", null, toastrOptions1, null);
					self.reloadPage();
				},
				(message) => {
					self.vbReassignGridContainer.listProgress(false);
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
					// ###START: US27352
					if (typeof (message) === 'object') {
						if (message.StatusModel.StatusCode == Constants.ApplicationConstants.ErrorStatusInfoCode) {
							Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, message.StatusModel.Description, "error", null, toastrOptions, null);
						}
					} // ###END: US27352
					else {
						self.reloadPage();
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.MailFailureMessageDispute, "error", null, toastrOptions, null);
					}
				}, message => {
					// Saving failed call back info message
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}

					setTimeout(() => { self.reloadPage() }, 10000);
					
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, message, "info", null, toastrOptions, null);
				});
		}
	}

	private setGridOptionsVBR(self: ARDashboardViewModel): _reportViewer.ReportGridOption {
		var gridOption = new _reportViewer.ReportGridOption();
		gridOption.enableSelectiveDisplay = true;
		gridOption.showGridSearchFilter = true;
		gridOption.showPageSize = true;
		gridOption.UIGridID = ko.observable("ARDashboardVBReassign");
		gridOption.data = <any> self.reportData;
		gridOption.columnDefinition = self.setGridColumnDefinitionsVBR();
		gridOption.useExternalSorting = false;
		gridOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "VBReassignDate",
			order: "asc"
		};
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
		gridOption.enableSaveGridSettings = true;
		gridOption.useClientSideFilterAndSort = false;
		gridOption.showColumnMenu = false;
		gridOption.enableColumnResize = false;
		return gridOption;
	}

	private setGridColumnDefinitionsVBR() {
		var colDefinition: Array = [];

		//## BOLNumber & Action Button Cell Templates.
		var bolCellTemplatePro = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'PRONo\'], click: function() { $userViewModel.onProNumberClick($parent.entity) }, attr:{ title: $data.getProperty($parent)}" />';
		var bolCellTemplateCurrentSo = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'CurrentSO\'], click: function() { $userViewModel.onBolNumberClick($parent.entity) }, attr:{ title: $data.getProperty($parent)}" />';
		var bolCellTemplateNewSo = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'NewSO\'], click: function() { $userViewModel.onSalesOrderClick($parent.entity) }, attr:{ title: $data.getProperty($parent)}" />';
		var actionCellTemplate = '<button class="moreInfoBtn"  data-bind="click: function() { $userViewModel.onGridColumnClick($parent.entity) }">Process</button>';

		colDefinition = [
			{ field: 'PRONo', displayName: 'VB PRO #', width: 150, cellTemplate: bolCellTemplatePro, type: _reportViewer.DataTypes.String },
			{ field: 'CurrentSO', displayName: 'Current SO#', width: 130, cellTemplate: bolCellTemplateCurrentSo, type: _reportViewer.DataTypes.String },
			{ field: 'NewSO', displayName: 'New SO#', width: 130, cellTemplate: bolCellTemplateNewSo, type: _reportViewer.DataTypes.String },
			{ field: 'ReassignmentReason', displayName: 'Reassignment Reason', width: 200, type: _reportViewer.DataTypes.String },
			{ field: 'CurrentSOCustomerName', displayName: 'Current SO Customer Name', width: 200, type: _reportViewer.DataTypes.String },
			{ field: 'NewSOCustomerName', displayName: 'New SO Customer Name', width: 200, cellTemplate: refEnums.Enums.GridCellFormatTemplates.CenterAlignTemplate, cellClass: 'priceTxtColor', type: _reportViewer.DataTypes.String },
			{ field: 'CreditToCurrentSO', displayName: 'Does the Customer Need to be Credited', width: 150, cellTemplate: refEnums.Enums.GridCellFormatTemplates.CenterAlignTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'AmountToCredit', displayName: 'Amount to Credit', width: 120, cellTemplate: refEnums.Enums.GridCellFormatTemplates.CenterAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric },
			{ field: 'NotesDescription', displayName: 'Notes', width: 150, cellTemplate: refEnums.Enums.GridCellFormatTemplates.CenterAlignTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'VBReassignDateDisplay', displayName: 'Date', width: 175, cellTemplate: refEnums.Enums.GridCellFormatTemplates.CenterAlignTemplate, type: _reportViewer.DataTypes.DateTime },
			{ field: 'Action', displayName: 'Action', width: 150, cellTemplate: actionCellTemplate, sortable: false }
		];

		return colDefinition;
	}

	private setPagingDataVBR(data, page, pageSize) {
		var self = this;
		self.gridOptionsVBR.data(data);
		self.gridOptionsVBR.data.valueHasMutated();
		self.gridOptionsVBR.pagingOptions.totalServerItems(page);
		self.vbReassignGridContainer.listProgress(false);
	}

	//#endregion
	// ##END: US25685

	private load() {
		var self = this;

		self.loadARDashboard();
	}

	private loadARDashboard() {
		var self = this;
		if (typeof self.selectedGridType() !== 'undefined' && self.selectedGridType().ID === refEnums.Enums.ARDashboardGridTypes.VendorBillReassignment.ID) {
			self.vbReassignGridContainer.listProgress(true);
			self.getReportDataVBR(self.reportActionVBR);

			//to block unwanted server calls
			self.vbReassignGridContainer.isPaginationChanged = false;
			self.vbReassignGridContainer.isSortingChanged = false;
			self.vbReassignGridContainer.listProgress(false);
		}
		else {
			self.arDashboardReportContainer.listProgress(true);
			self.getReportData(self.reportAction);

			//to block unwanted server calls
			self.arDashboardReportContainer.isPaginationChanged = false;
			self.arDashboardReportContainer.isSortingChanged = false;
			self.arDashboardReportContainer.listProgress(false);
		}
	}

	public reloadPage() {
		var self = this;

		// ##START: US25685
		self.loadARDashboard();
		// ##END: US25685
	}
	//#endregion

	//#region Life Cycle Event
	public deactivate() {
		var self = this;

	}

	//**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
	public beforeBind() {
		var self = this;

		////self.load();
	}
	// ##END: US25686

	//** Using for focus cursor on last cycle for focusing in vendor name
	public compositionComplete() {
		var self = this;
	}
	//#endregion
}