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
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />}
/// <reference path="../services/models/TypeDefs/PurchaseOrderSearchModel.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refEnums = require('services/models/common/Enums');
import refPurchaseOrderSearchResult = require('services/models/purchaseOrder/PurchaseOrderSearchResult');
import _refPurchaseOrderQuickSearch = require('purchaseOrder/PurchaseOrderQuickSearchView');
import refPurchaseOrderQuickSearchParam = require('services/models/purchaseOrder/PurchaseOrderQuickSearch');
import _reportViewer = require('../templates/reportViewerControlV2');
import refVendorNameSearch = require('services/models/common/searchVendorName');
import refPurchaseOrderClient = require('services/client/PurchaseOrderClient');
import refSearchModel = require('services/models/transactionSearch/TransactionSearchRequest');
//#endregion

/*
** <summary>
** Purchase Order Edit View Model.
** </summary>
** <createDetails>
** <by>ACHAL RASTOGI</by> <date>07-11-2014</date>
** </createDetails>}
*/
class PurchaseOrderEditViewModel {
	//#region Members
	//** hold quick search view model data. */
	purchaseOrderQuickSearchViewModel: _refPurchaseOrderQuickSearch.PurchaseOrderQuickSearchViewModel = new _refPurchaseOrderQuickSearch.PurchaseOrderQuickSearchViewModel();
	// purchase order client
	purchaseOrderClient: refPurchaseOrderClient.PurchaseOrderClient = new refPurchaseOrderClient.PurchaseOrderClient();
	// purchase order search result model
	purchaseOrderSearchResult: refPurchaseOrderSearchResult.Models.PurchaseOrderSearchResult = new refPurchaseOrderSearchResult.Models.PurchaseOrderSearchResult();
	// purchase order quick search param model
	purchaseOrderQuickSearchParam: refPurchaseOrderQuickSearchParam.Models.PurchaseOrderQuickSearch = new refPurchaseOrderQuickSearchParam.Models.PurchaseOrderQuickSearch();

	//#region public report viewer members
	public reportContainer: _reportViewer.ReportViewerControlV2 = null;
	public header: _reportViewer.ReportHeaderOption = null;
	public grid: _reportViewer.ReportGridOption = null;
	public reportAction: _reportViewer.ReportAction = null;
	public reportData: KnockoutObservableArray<IVendorBillSearchResult> = null;

	public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	public getReportData: () => void;
	private calculateImagePosition: (statusId, index) => void;
	public gridOptions: any;
	public reportType: number;
	app = _app;
	public modeType = ko.observable();
	public imagePathForModalPopup: KnockoutObservable<string>;
	public isQuickSearch: boolean = true;
	searchRequestParam: refSearchModel.Model.TransactionSearchRequest = new refSearchModel.Model.TransactionSearchRequest();
	sortCol: KnockoutObservable<string> = ko.observable('');
	sorttype: KnockoutObservable<string> = ko.observable('');
	isLoaded: boolean = false;
	//#endregion
	//#endregion

	//#region Constructor
	constructor() {
		var self = this;
		self.header = new _reportViewer.ReportHeaderOption();
		self.header.reportHeader = " ";
		self.header.reportName = "Purchase Order Search Result";
		self.header.gridTitleHeader = "";
		self.imagePathForModalPopup = ko.observable('');
		var commonUtils = new Utils.Common();

		//initialize date filters
		self.reportAction = new _reportViewer.ReportAction();
		self.grid = self.setGridOptions(self);

		//Adding the export functionality
		var exportOpt = ko.observableArray([
			{ exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
			{ exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) },
			{ exportType: _reportViewer.ExportOptions.PDF, name: ko.observable("Pdf "), enabled: ko.observable(true) }]);

		self.header.reportExportOptions = new _reportViewer.ReportExportControl(exportOpt);
		self.header.reportExportOptions.getUrl = (exp: _reportViewer.IExportOptions): string => {
			//if (self.gridOptions.pagingOptions.totalServerItems() == 0)
			//	return "No Data";
			var today = new Date();
			var currentTimestamp = moment(today).format("MM-DD-YYYY, HH:mm").toString();
			currentTimestamp = currentTimestamp.replace(':', '!');
			return "CarrierRate/reports/ExportDashboardShipmentSummary/" + _reportViewer.ExportOptions[exp.exportType] + "/" + self.gridOptions.sortInfo().column.field + '/' + self.gridOptions.sortInfo().direction + "/" + "?currentTimestamp=" + currentTimestamp;
		}

		self.setReportCriteria = (reportActionObj: _reportViewer.ReportAction) => {
			self.gridOptions = reportActionObj.gridOptions;
			if ((reportActionObj != undefined || reportActionObj != null) && (reportActionObj.gridOptions != undefined || reportActionObj.gridOptions != null) && (refSystem.isObject(reportActionObj.gridOptions.sortInfo())) && (reportActionObj.gridOptions.sortInfo().column != undefined || reportActionObj.gridOptions.sortInfo().column != null) && (reportActionObj.gridOptions.sortInfo().column.field != undefined || reportActionObj.gridOptions.sortInfo().column.field != null)) {
				self.sortCol(reportActionObj.gridOptions.sortInfo().column.field);

				if (self.sortCol() == 'BillDateDisplay') {
					self.sortCol('BillDate')
				}
			self.sorttype(reportActionObj.gridOptions.sortInfo().direction);
			}
			else {
				self.sortCol("PRONo");
				self.sorttype("asc");
			}
			if (self.reportAction != null) {
				if ((self.modeType() != reportActionObj.filter1selectedItemId) || (self.reportAction.view != reportActionObj.view) ||
					(reportActionObj.dateFrom != self.reportAction.dateFrom) || (reportActionObj.dateTo != self.reportAction.dateTo)) {
					//self.gridOptions.pagingOptions.currentPage(1);
				}
			}
			// Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
			// we don't want any data on page load so we commented getReportdata  function.
			//self.getReportData();
			self.reportAction = reportActionObj;
			if (self.isLoaded) {
				self.getSearchData();
			}
			if (reportActionObj.dateFrom !== null && reportActionObj.dateTo !== null) {
				//self.getReportData();
			}
			else {
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.DateTimeValidation, "info", null, toastrOptions);
			}
		};

		// self.getReportData = self.getSearchData;

		self.reportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);

		self.reportContainer.onFilterChange = self.setReportCriteria;
		self.reportContainer.ForceChange();

		// redirects to purchase order edit details page
		self.reportContainer.onProNumberClick = shipmentObj => {
			var vendorBillId = shipmentObj.VendorBillId;
			if (vendorBillId > 0) {
				_app.trigger("openPurchaseOrder", vendorBillId, shipmentObj.PRONo, (callback) => {
					if (!callback) {
						return;
					}
				});
			}
		}

        // redirects to sales order details page
        self.reportContainer.onBolNumberClick = function (shipmentObj) {
			var salesOrderId = shipmentObj.SalesOrderId;
			if (salesOrderId > 0) {
				_app.trigger("openSalesOrder", salesOrderId, shipmentObj.BOLNumber, (callback) => {
					if (!callback) {
						return;
					}
				});
			}
		}

		//Display text based on status in status column.
		self.reportContainer.getTextfromId = shipmentobj => {
			var status = commonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, shipmentobj.BillStatus.toString());
			return status;
		}
		//Displays image based on the status in the status column
		self.reportContainer.getImagefromId = shipmentobj => {
			var imgPath;
			var status = commonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, shipmentobj.BillStatus.toString());
			if (status === null || status === '') {
				imgPath = 'Content/images/pendingA.png';
			}
			else {
				imgPath = 'Content/images/' + status + 'A.png';
			}
			return imgPath;
		}

		//Displays image based on tracking status
		self.reportContainer.IsTracking = shipmentobj => {
			var status = shipmentobj.Tracking;
			var imgPath = (status) ? 'Content/images/map-marker.png' : 'Content/images/map-marker-blur.png';
			//var imgPath = (status) ? 'fa fa-map-marker fa-1.8x changeColorTrack' : 'fa fa-map-marker fa-1.8x changeColorTrackInActive';
			return imgPath;
		}

	//Shows second image when user hovers in the images of status column.
		self.reportContainer.getImageOnMouseHover = (shipmentObj, index) => {
			var imgPath;

			var statusId = shipmentObj.BillStatus;

			var status = commonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, statusId.toString()).trim();

			if (status === null || status === '') {
				imgPath = 'Content/images/pendingB.png';
			}
			else {
				imgPath = 'Content/images/' + status + 'B.png';
			}

			var _index = '#img' + index;
			$(_index).attr("src", imgPath);
		}

	//Show first image when user hovers out from the images of status column
		self.reportContainer.getImageOnMouseOut = (shipmentObj, index) => {
			var imgPath;

			var statusId = shipmentObj.BillStatus;
			var status = commonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, statusId.toString()).trim();

			if (status === null || status === '') {
				imgPath = 'Content/images/pendingA.png';
			}
			else {
				imgPath = 'Content/images/' + status + 'A.png';
			}

			var _index = '#img' + index;
			$(_index).attr("src", imgPath);
		}

		//Change image path for the bigger image based on status
		self.reportContainer.getLargeImage = (shipmentObj, index) => {
			var statusId = shipmentObj.BillStatus;
			self.calculateImagePosition(statusId, index);
			jQuery(window).on('resize', function () {
				if (statusId != undefined && statusId != null && statusId >= 0)
					self.calculateImagePosition(statusId, index);
			});
			jQuery(window).scroll(function () {
				if (statusId != undefined && statusId != null && statusId >= 0)
					self.calculateImagePosition(statusId, index);
			});
			jQuery('.modal-backdrop').on('click', () => {
				statusId = undefined;
				jQuery(window).off('resize', function () {
					if (statusId != undefined && statusId != null && statusId >= 0)
						self.calculateImagePosition(statusId, index);
				});
			});
		}

		self.calculateImagePosition = (statusId, index) => {
			var imgPath;
			var status = commonUtils.getEnumValueById(refEnums.Enums.OrderStatus, statusId.toString()).trim();

			if (status === null || status === '') {
				self.imagePathForModalPopup('Content/images/pending.png');
			}
			else {
				self.imagePathForModalPopup('Content/images/' + status + '.png');
			}

			//Calculation of top and left for the popup image
			var _index = '#img' + index;
			var imagePosition = $(_index).offset();

			var left = imagePosition.left - $("#divdialog-modal").width() - $(document).scrollLeft();
			var top = imagePosition.top - $("#divdialog-modal").height() - $(document).scrollTop() + 46;

			$("#divdialog-modal").css({ "top": top, "left": left });
			$('#divdialog-modal').modal({ modal: true, keyboard: true, overlayClose: false, backdrop: true });
			///jQuery('#divdialog-modal').css('position', 'absolute');
		}

		//Displays Date without Time Part
		self.reportContainer.getDateFormat = shipmentobj => commonUtils.formatDate(new Date(shipmentobj.BillDate), 'mm/dd/yyyy')
	}
	//#endregion

	//#region Internal Methods
	private setPagingData(data, page, pageSize) {
		//Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
		var self = this;
		self.gridOptions.data(data);
		self.gridOptions.data.valueHasMutated()
		self.gridOptions.pagingOptions.totalServerItems(page);
	}

	public getSearchData() {
		var self = this;
		if (!self.purchaseOrderQuickSearchViewModel.validateQuickSearch()) {
			self.clickOnSearchResult();
			self.expandView('collapseSearchResults');
			self.reportContainer.listProgress(true);
			var successCallBack = data => {
			//	self.setPagingData(ko.observableArray(data), self.gridOptions, self.reportAction);
				self.setPagingData(data.VendorBillList, data.TotalCountVendorBill, self.gridOptions.pagingOptions.pageSize());
				self.reportContainer.listProgress(false);
				self.isLoaded = true;
				$('.noLeftBorder').parent().css('border-left', '0');
				$('.noRightBorder').parent().css('border-right', '0');
			},
				faliureCallBack = () => {
					self.reportContainer.listProgress(false);
				};

			if (self.isQuickSearch) {
				self.purchaseOrderQuickSearchParam.BolNumber = self.purchaseOrderQuickSearchViewModel.bolNumber();
				self.purchaseOrderQuickSearchParam.PoNumber = self.purchaseOrderQuickSearchViewModel.poNumber();
				self.purchaseOrderQuickSearchParam.ProNumber = self.purchaseOrderQuickSearchViewModel.proNumber();
				self.purchaseOrderQuickSearchParam.VendorName = self.purchaseOrderQuickSearchViewModel.vendorName();
				self.purchaseOrderQuickSearchParam.FromDate = new Date('1/1/1790 12:00:00 AM');
				self.purchaseOrderQuickSearchParam.ToDate = new Date('12/31/9995 11:59:59 PM');
				self.purchaseOrderQuickSearchParam.PageNumber = self.gridOptions.pagingOptions.currentPage();
				self.purchaseOrderQuickSearchParam.PageSize = self.gridOptions.pagingOptions.pageSize();
				self.purchaseOrderQuickSearchParam.PagesFound = 0;
				self.purchaseOrderQuickSearchParam.SortField = self.sortCol();
				self.purchaseOrderQuickSearchParam.SortOrder = self.sorttype();
				self.purchaseOrderQuickSearchParam.IsPurchaseOrder = refEnums.Enums.SearchTransactionType.PurchaseOrders;
				self.purchaseOrderClient.quickSearchPurchaseOrder(self.purchaseOrderQuickSearchParam, successCallBack, faliureCallBack);
			}
		}
		else {
			self.collapseView('collapseSearchResults');
			self.expandView('collapseQuickSearch');
			setTimeout(function () {
				$('#collapseQuickSearch').css("overflow", "visible");
			}, 500);
			return false;
		}
	}

	public clickOnQuickSearch() {
		var self = this;

		//to set individual div overflow: hidden and vice versa  to overflow: visible.
		if ($("#collapseQuickSearch").css("overflow") === "hidden") {
			setTimeout(function () {
				$('#collapseQuickSearch').css("overflow", "visible");
			}, 500);
		}
		else {
			$('#collapseQuickSearch').css("overflow", "hidden");
		}

		// To check other accordion are not open if yes then close.
		self.collapseView('collapseSearchResults');
		$("#txtVendorName").focus();
		self.isQuickSearch = true;
	}

	public clickOnSearchResult() {
		var self = this;
		//To change style of arrow after collapse
		self.collapseView('collapseQuickSearch');
		$('#collapseQuickSearch').css("overflow", "hidden");
	}

	//To open accordion on click of Search
	public openaccordion() {
		//To change style of arrow after collapse
		if ($('#collapseQuickSearch').hasClass('in')) {
			$('#collapseQuickSearch').collapse('toggle');
			$('#AchorcollapseQuickSearch').addClass('collapsed');
		}

		// To check other accordion are not open
		$('#accordion2').on('show.bs.collapse', () => {
			$('#accordion2 .in').collapse('hide');
		});
		//To Open Search Result Accordion
		if (!$('#collapseSearchResults').hasClass('in')) {
			$('#collapseSearchResults').collapse('toggle');
			$('#AchorcollapseSearchResults').removeClass('collapsed');
		}

		$('#collapseQuickSearch').css("overflow", "hidden");
	}

	private setGridOptions(self: PurchaseOrderEditViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("PurchaseOrderGrid");
		grOption.data = <any> self.reportData;
		grOption.columnDefinition = self.setGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "PRONo",
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
		grOption.enableSaveGridSettings = true;
		grOption.useClientSideFilterAndSort = false;
		grOption.showColumnMenu = true;
		return grOption;
	}

	private setGridColumnDefinitions() {
		var colDefinition: Array = [];

		// For ProNumber
		var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'PRONo\'], click: function() { $userViewModel.onProNumberClick($parent.entity) }" />';

		//For BOL Number
		var bolCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'BOLNumber\'], click: function() { $userViewModel.onBolNumberClick($parent.entity) }" />';

		//colDefinition = [
		//	{ field: 'ProNumber', displayName: 'PRO#', cellTemplate: proCellTemplate, width: 100 },
		//	{ field: 'BillDate', displayName: 'Date', cellTemplate: refEnums.Enums.GridCellFormatTemplates.DateFormatTemplate, width: 100, isRemovable: false },
		//	{ field: 'BolNumber', displayName: 'BOL#', isRemovable: false, width: 95, cellTemplate: bolCellTemplate },
		//	{ field: 'Id', displayName: 'Id', isRemovable: false, visible: false },
		//	{ field: 'ShipmentId', displayName: 'Shipment Id', isRemovable: false, visible: false },
		//	{ field: 'Vendor', displayName: 'Carrier', isRemovable: false },
		//	{ field: 'ShipCompanyName', displayName: 'Shipper' },
		//	{ field: 'ConsigneeCompName', displayName: 'Consignee' },
		//	{ field: 'ShipperZipCode', displayName: 'Origin', width: 110 },
		//	{ field: 'ConsigneeZipCode', displayName: 'Destination', width: 116 },
		//	{ field: 'Revenue', displayName: 'Amount', cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate, width: 110 }
		//];
		//return colDefinition;

		colDefinition = [
			{ field: 'PRONo', displayName: 'PRO#', cellTemplate: proCellTemplate, width: 100 },
			{ field: 'BillDateDisplay', displayName: 'Date', cellTemplate: refEnums.Enums.GridCellFormatTemplates.DateFormatTemplate, width: 100, isRemovable: false },
			{ field: 'BOLNumber', displayName: 'BOL#', isRemovable: false, width: 95, cellTemplate: bolCellTemplate },
			{ field: 'VendorBillId', displayName: 'Id', isRemovable: false, visible: false, width: 100 },
			{ field: 'SalesOrderId', displayName: 'Shipment Id', isRemovable: false, visible: false, width: 100 },
			{ field: 'CarrierName', displayName: 'Carrier', isRemovable: false, width: 200 },
			{ field: 'ShipperName', displayName: 'Shipper', width: 150 },
			{ field: 'ConsigneeName', displayName: 'Consignee', width: 150 },
			{ field: 'Origin', displayName: 'Origin', width: 110 },
			{ field: 'Destination', displayName: 'Destination', width: 116 },
			{ field: 'Amount', displayName: 'Amount', cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate, width: 110 }
		];
		return colDefinition;
	}

	private load(dataToBind) {
		if (!dataToBind)
			return;

		var self = this;
		if (dataToBind.isQuickSearch) {
			self.purchaseOrderQuickSearchViewModel.bolNumber(dataToBind.quickSearch.BolNumber);
			self.purchaseOrderQuickSearchViewModel.poNumber(dataToBind.quickSearch.PoNumber);
			self.purchaseOrderQuickSearchViewModel.proNumber(dataToBind.quickSearch.ProNumber);
			self.purchaseOrderQuickSearchViewModel.vendorNameSearchList.name(new refVendorNameSearch.Models.VendorNameSearch());
			self.purchaseOrderQuickSearchViewModel.vendorNameSearchList.vendorName(dataToBind.quickSearch.VendorName);
		}
		else {
		}
		self.getSearchData();
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
		var data = {
			isQuickSearch: self.isQuickSearch,
			quickSearch: self.purchaseOrderQuickSearchParam,
		}
	  _app.trigger("registerMyData", data);

		// Remove the event registration from Document
		document.onkeypress = undefined;

		self.cleanup();
	}

	public beforeBind() {
		var self = this;
		_app.trigger("loadMyData", data => {
			if (data) {
				self.load(data);
			} else {
				//_app.trigger("closeActiveTab");
				//_app.trigger("NavigateTo", 'Home');
			}
		});
	}

	public compositionComplete(view, parent) {
		$("#txtVendorName").focus();
	}

	public cleanup() {
		var self = this;

		self.reportContainer.cleanup("PurchaseOrderGrid");
        self.purchaseOrderQuickSearchViewModel.cleanup();
		for (var prop in self) {
			if (prop !== "cleanup")
				delete self[prop];
		}
		delete self;
	}

	//#endregion
}

return PurchaseOrderEditViewModel;