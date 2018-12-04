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
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
/// <reference path="../services/models/TypeDefs/SalesOrderSearchModel.d.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refEnums = require('services/models/common/Enums');
import _refSalesOrderQuickSearch = require('salesOrder/SalesOrderQuickSearchView');
import _refSalesOrderExtendedSearch = require('salesOrder/SalesOrderExtendedSearchView');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refSalesOrderSearchResultModel = require('services/models/salesOrder/SalesOrderSearchResult');
import refSalesOrderExtendedSearchModel = require('services/models/salesOrder/SalesOrderExtendedSearchParam');
import refSalesOrderQuickSearchModel = require('services/models/salesOrder/SalesOrderQuickSearchParam');
import _reportViewer = require('../templates/reportViewerControlV2');
import refVendorNameSearch = require('services/models/common/searchVendorName');
import refCommonClient = require('services/client/CommonClient');
import refSearchModel = require('services/models/transactionSearch/TransactionSearchRequest');
import _refPurchaseOrderSearchFilterModel = require('services/models/purchaseOrder/PurchaseOrderSearchFilter');
//#endregion

/*
** <summary>
** Sales Order Main Edit View Model.
** </summary>
** <createDetails>
** <id>US12178</id> <by>BHANU PRATAP</by> <date>08-26-2014</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by> <date></date>
** </changeHistory>
*/

class SalesOrderMainEditViewModel {
	//#region Properties

	//** hold quick search view model data. */
	public salesOrderQuickSearchViewModel: _refSalesOrderQuickSearch.SalesOrderQuickSearchViewModel = new _refSalesOrderQuickSearch.SalesOrderQuickSearchViewModel();
	//** hold extended search view model data. */
	public salesOrderExtendedSearchViewModel: _refSalesOrderExtendedSearch.SalesOrderExtendedSearchViewModel = new _refSalesOrderExtendedSearch.SalesOrderExtendedSearchViewModel();
	salesOrderClient: refSalesOrderClient.SalesOrderClient = new refSalesOrderClient.SalesOrderClient();
	salesOrderSearchResult: refSalesOrderSearchResultModel.Models.SalesOrderSearchResult = new refSalesOrderSearchResultModel.Models.SalesOrderSearchResult();
	salesOrderExtendedSearchParam: refSalesOrderExtendedSearchModel.Models.SalesOrderExtendedSearch = new refSalesOrderExtendedSearchModel.Models.SalesOrderExtendedSearch();
	salesOrderQuickSearchParam: refSearchModel.Model.TransactionSearchRequest = new refSearchModel.Model.TransactionSearchRequest();
	//#endregion

	//#region public report viewer members
	public reportContainer: _reportViewer.ReportViewerControlV2 = null;
	public header: _reportViewer.ReportHeaderOption = null;
	public grid: _reportViewer.ReportGridOption = null;
	public reportAction: _reportViewer.ReportAction = null;
	public reportData: KnockoutObservableArray<ISalesOrderSearchResult> = null;

	public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	public getReportData: (reportAction: _reportViewer.ReportAction) => any;
	private calculateImagePosition: (statusId, index) => void;
	public gridOptions: any;
	public reportType: number;
	app = _app;
	public modeType = ko.observable();
	public imagePathForModalPopup: KnockoutObservable<string>;
	public isQuickSearch: boolean = true;
	reportClick: KnockoutObservable<boolean> = ko.observable(false);
	sortCol: KnockoutObservable<string> = ko.observable('BOLNumber');
	sorttype: KnockoutObservable<string> = ko.observable('asc');

	// flag to stop the server call
	isLoadingData: KnockoutObservable<boolean> = ko.observable(false);
	soSearchFilterItems: Array<IPurchaseOrderSearchFilter> = new Array<_refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter>();
	// client commond
	commonClient: refCommonClient.Common = new refCommonClient.Common();
	//#endregion

	//#region Constructor
	constructor() {
		var self = this;
		self.header = new _reportViewer.ReportHeaderOption();
		self.header.reportHeader = "";
		self.header.reportName = "Sales Order Search Result";
		self.header.gridTitleHeader = "";
		self.imagePathForModalPopup = ko.observable('');
		var CommonUtils = new Utils.Common();

		//initialize date filters
		self.reportAction = new _reportViewer.ReportAction();

		self.grid = self.setGridOptions(self);

		self.setReportCriteria = (soReportActionObj: _reportViewer.ReportAction) => {
			if ((soReportActionObj != undefined || soReportActionObj != null) && (soReportActionObj.gridOptions != undefined || soReportActionObj.gridOptions != null) && (refSystem.isObject(soReportActionObj.gridOptions.sortInfo())) && (soReportActionObj.gridOptions.sortInfo().column != undefined || soReportActionObj.gridOptions.sortInfo().column != null) && (soReportActionObj.gridOptions.sortInfo().column.field != undefined || soReportActionObj.gridOptions.sortInfo().column.field != null)) {
				self.sortCol(soReportActionObj.gridOptions.sortInfo().column.field);
				if (self.sortCol() == 'BillDateDisplay') {
					self.sortCol('BillDate')
				}
				else if (self.sortCol() == 'PickupDateDisplay') {
					self.sortCol('PickupDate');
				}
				else if (self.sortCol() == 'ProcessStatusDisplay') {
					self.sortCol('ProcessStatus');
				}
				else if (self.sortCol() == 'InvoiceStatusDisplay') {
					self.sortCol('InvoiceStatus');
				}
				else if (self.sortCol() == 'CompanyNameDisplay') {
					self.sortCol('AccountName');
				}

				self.sorttype(soReportActionObj.gridOptions.sortInfo().direction);
			}
			else {
				self.sortCol("BOLNumber");
				self.sorttype("desc");
			}
			if (!self.isLoadingData()) {
				self.gridOptions = soReportActionObj.gridOptions;
				self.reportAction = soReportActionObj;
				if(self.reportClick())
					self.getReportData(soReportActionObj);
			}
		};

		self.getReportData = function (reportActionObj: _reportViewer.ReportAction) {
			var deferred = $.Deferred();
			var promise = deferred.promise();
			var pageno = 0;
			// List View
			pageno = Number(self.gridOptions.pagingOptions.currentPage());
			if (pageno > 0) {
				self.reportContainer.listProgress(true);

				self.fillsearchdetail();
				var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.soSearchFilterItems }
				var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.TransactionSearchSalesOrder, IsFilterApplied: self.reportContainer.reportColumnFilter.isFilterApply, GridSearchText: null, PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype() };
				var searchParam = { SearchModel: self.salesOrderQuickSearchParam, SearchFilterModel: filterDataToSave }
				self.commonClient.getTransactionSearchResponse(searchParam,
					function (data) {
						self.setPagingData(data.SalesOrderResponse, data.NumberOfRows, self.gridOptions.pagingOptions.pageSize());
						self.reportContainer.listProgress(false);

						deferred.resolve(data, reportActionObj.view);
					},
					function () {
						self.reportContainer.listProgress(false);
					////	var toastrOptions = {
					////		toastrPositionClass: "toast-top-middle",
					////		delayInseconds: 10,
					////		fadeOut: 10,
					////		typeOfAlert: "",
					////		title: ""
					////	}

					////Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ErrorOccurredWhileFetchingSalesOrderList, "error", null, toastrOptions);
					});
			}
			return promise;
		};

		self.reportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);

		self.reportContainer.onFilterChange = self.setReportCriteria;
		self.reportContainer.ForceChange();

		//Displays Date without Time Part
		self.reportContainer.getDateFormat = function (shipmentobj) {
			var self = this;
			return CommonUtils.formatDate(new Date(shipmentobj.PickupDate), 'mm/dd/yyyy');
		}

        // redirects to sales order details page
        self.reportContainer.onBolNumberClick = function (shipmentObj) {
			var salesOrderId = shipmentObj.ShipmentId;
			if (salesOrderId > 0) {
				_app.trigger("openSalesOrder", salesOrderId, shipmentObj.BOLNumber, (callback) => {
					if (!callback) {
						return;
					}
				});
			}
		}
	}
	//#endregion

	//#region Internal Methods
	private setPagingData(data, page, pageSize) {
		var self = this;
		self.gridOptions.data(data);
		self.gridOptions.data.valueHasMutated()
		self.gridOptions.pagingOptions.totalServerItems(page);
	}

	public getSearchData() {
		var self = this;
		if (!self.salesOrderQuickSearchViewModel.validateQuickSearch()) {
			self.reportClick(true);
			self.gridOptions.pagingOptions.currentPage(1);
			self.getReportData(self.reportAction);
			self.clickOnSearchResult();
			self.expandView('collapseSearchResults');
		}
		else {
			self.clickOnQuickSearch();
			self.expandView('collapseSoQuickSearch');
			return false;
		}
	}

	public clickOnQuickSearch() {
		var self = this;
		// To check other accordion are not open if yes then close.
		self.collapseView('collapseSearchResults');
		self.collapseView('collapseExtendedSearch');
		$("#txtVendorName").focus();
		self.isQuickSearch = true;
	}

	public clickOnExtendSearch() {
		var self = this;
		// To check other accordion are not open if yes then close.
		self.collapseView('collapseSearchResults');
		self.collapseView('collapseSoQuickSearch');
		self.isQuickSearch = false;
	}

	public clickOnSearchResult() {
		var self = this;
		//To change style of arrow after collapse
		self.collapseView('collapseExtendedSearch');
		self.collapseView('collapseSoQuickSearch');
	}

	//To open accordion on click of Search
	public openaccordion() {
		//To change style of arrow after collapse
		if ($('#collapseSoQuickSearch').hasClass('in')) {
			$('#collapseSoQuickSearch').collapse('toggle');
			$('#AchorcollapseSoQuickSearch').addClass('collapsed');
		}
		if ($('#collapseExtendedSearch').hasClass('in')) {
			$('#collapseExtendedSearch').collapse('toggle');
			$('#AchorcollapseExtendedSearch').addClass('collapsed');
		}
		// To check other accordion are not open
		$('#accordion2').on('show.bs.collapse', function () {
			$('#accordion2 .in').collapse('hide');
		});
		//To Open Search Result Accordion
		if (!$('#collapseSearchResults').hasClass('in')) {
			$('#collapseSearchResults').collapse('toggle');
			$('#AchorcollapseSearchResults').removeClass('collapsed');
		}
	}

	//## function to expand the vendor bill view if any Dispute Amount, Date & Notes will be null
	public expandSearchResult() {
		if (!$('#collapseSearchResults').hasClass('in')) {
			$('#collapseSearchResults').addClass('in');
			$("#collapseSearchResults").css("height", 'auto');
			$('#AchorcollapseSearchResults').removeClass('collapsed');
		}
	}

	public fillsearchdetail() {
		var self = this;
		self.salesOrderQuickSearchParam.BolNumber = self.salesOrderQuickSearchViewModel.bolNumber() ? self.salesOrderQuickSearchViewModel.bolNumber().trim() : "";
		self.salesOrderQuickSearchParam.PoNumber =  self.salesOrderQuickSearchViewModel.poNumber() ? self.salesOrderQuickSearchViewModel.poNumber().trim() : "";
		self.salesOrderQuickSearchParam.ProNumber = self.salesOrderQuickSearchViewModel.proNumber() ? self.salesOrderQuickSearchViewModel.proNumber().trim() : "";
		self.salesOrderQuickSearchParam.ShipperZipCode = self.salesOrderQuickSearchViewModel.shipperZip() ? self.salesOrderQuickSearchViewModel.shipperZip().trim() : "";
		self.salesOrderQuickSearchParam.ConsigneeZipCode = self.salesOrderQuickSearchViewModel.consigneeZip() ? self.salesOrderQuickSearchViewModel.consigneeZip().trim() : "";
		self.salesOrderQuickSearchParam.PageNumber = self.gridOptions.pagingOptions.currentPage();
		self.salesOrderQuickSearchParam.PageSize = self.gridOptions.pagingOptions.pageSize();
		self.salesOrderQuickSearchParam.SortCol = self.sortCol();
		self.salesOrderQuickSearchParam.SortOrder = self.sorttype();
		self.salesOrderQuickSearchParam.TransactionSearchType = refEnums.Enums.TransactionSearchType.SalesOrder.ID;
		self.salesOrderQuickSearchParam.FromDate = new Date('1/1/1790 12:00:00 AM');
		self.salesOrderQuickSearchParam.ToDate = new Date('12/31/9995 11:59:59 PM');
	}
	private setGridOptions(self: SalesOrderMainEditViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("SalesOrderGrid");
		grOption.data = <any> self.reportData;
		grOption.columnDefinition = self.setGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "BOLNumber",
			order: "desc"
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
		grOption.enableSaveGridSettings = false;
		grOption.useClientSideFilterAndSort = false;
		grOption.showColumnMenu = true;
		return grOption;
	}

	private setGridColumnDefinitions() {
		var colDefinition: Array = [];
		var self = this;
		// For BOLnumber
		var bolCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'BOLNumber\'], click: function() { $userViewModel.onBolNumberClick($parent.entity) }" />';

		colDefinition = [
			{ field: 'BOLNumber', displayName: 'BOL#', cellTemplate: bolCellTemplate, isRemovable: false, width: 110 },
			{ field: 'PRONumber', displayName: 'PRO#', width: 110 },
			{ field: 'PickupDateDisplay', displayName: 'Pickup Date', width: 100 },
			{ field: 'CustomerBolNumber', displayName: 'Customer BOL', isRemovable: true, width: 100 },
			{ field: 'CompanyNameDisplay', displayName: 'Customer', isRemovable: true, width: 120 },
			{ field: 'CarrierName', displayName: 'Vendor', isRemovable: false, width: 120 },
			{ field: 'ShipperName', displayName: 'Shipper', width: 130 },
			{ field: 'ConsigneeName', displayName: 'Consignee', width: 130 },
			{ field: 'ShipperZipCode', displayName: 'Origin', width: 80 },
			{ field: 'ConsigneeZipCode', displayName: 'Destination ', width: 90 },
			{ field: 'ShipmentMode', displayName: 'Service Type', width: 110 },
			{ field: 'TotalWeight', displayName: 'Total Weight', width: 80 },
			{ field: 'TotalPieces', displayName: 'Total Pieces', width: 80 },
			{ field: 'Revenue', displayName: 'Revenue', width: 80, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
			{ field: 'ProcessStatusDisplay', displayName: 'Process Status', width: 120, isRemovable: false },
			{ field: 'InvoiceStatusDisplay', displayName: 'Invoice Status', width: 130, isRemovable: false },
			{ field: 'CustomerType', displayName: 'Customer Type', width: 100, display: false }
		];
		return colDefinition;
	}

	private load(dataToBind) {
		if (!dataToBind)
			return;

		var self = this;

		self.isLoadingData(true);
		if (dataToBind.isQuickSearch) {
			self.salesOrderQuickSearchViewModel.bolNumber(dataToBind.quickSearch.BolNumber);
			self.salesOrderQuickSearchViewModel.poNumber(dataToBind.quickSearch.PoNumber);
			self.salesOrderQuickSearchViewModel.proNumber(dataToBind.quickSearch.ProNumber);
			self.salesOrderQuickSearchViewModel.consigneeZip(dataToBind.quickSearch.ConsigneeZipCode);
			self.salesOrderQuickSearchViewModel.shipperZip(dataToBind.quickSearch.ShipperZipCode);
		}
		else {
		}

		self.reportClick(dataToBind.reportClick);
		if (refSystem.isObject(self.gridOptions)) {
			self.gridOptions.pagingOptions.pageSize(dataToBind.pageSize);
			self.gridOptions.pagingOptions.currentPage(dataToBind.currentPage);
			//self.getReportData(self.reportAction);
			self.setPagingData(dataToBind.reportAction.gridOptions.data(), dataToBind.reportAction.gridOptions.pagingOptions.totalServerItems(), dataToBind.reportAction.gridOptions.pagingOptions.pageSize());
		}

		self.isLoadingData(false);
		window.kg.toggleSelection(false);
	}

	//## function to expand the view by ID, if any case we required
	private expandView(viewId: string) {
		if (!$('#' + viewId).hasClass('in')) {
			$('#' + viewId).addClass('in');
			$('#' + viewId).css("height", 'auto');
			$('#Achor' + viewId).removeClass('collapsed');
		}
	}

	//## function to collapse the items view by ID, if any case we required
	private collapseView(viewId: string) {
		$('#' + viewId).removeClass('in');
		$('#' + viewId).css("height", '0');
		$('#Achor' + viewId).addClass('collapsed');
		$('#collapseAddress').css("overflow", "hidden");
	}

	//#endregion

	//#region Life Cycle Event
	// Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
	public attached() {
		_app.trigger('viewAttached');
		var self = this;
		//Using Document Key press for search result on enter key press
		document.onkeypress = (event: KeyboardEvent) => {
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if (keycode === 13) {
				$('#btnSearch').focus();
				self.getSearchData();
				return false;
			}
		}
	}

	public activate() {
		return true;
	}

	public deactivate() {
		var self = this;
		self.fillsearchdetail();
		var data = {
			isQuickSearch: self.isQuickSearch,
			quickSearch: self.salesOrderQuickSearchParam,
			extendedSearch: self.salesOrderExtendedSearchParam,
			reportAction: self.reportAction,
			pageSize: self.gridOptions.pagingOptions.pageSize(),
			currentPage: self.gridOptions.pagingOptions.currentPage(),
			reportClick: self.reportClick()
		}
	  _app.trigger("registerMyData", data);

		// Remove the event registration from Document
		document.onkeypress = undefined;
	}

	public beforeBind() {
		var self = this;
		_app.trigger("loadMyData", function (data) {
			if (data) {
				self.load(data);
			} else {
				//_app.trigger("closeActiveTab");
				//_app.trigger("NavigateTo", 'Home');
			}
		});
	}
	public compositionComplete(view, parent) {
		$("#txtBolNumber").focus();
	}

	//#endregion
}

return SalesOrderMainEditViewModel;