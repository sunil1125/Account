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
/// <reference path="../services/models/TypeDefs/VendorBillModels.d.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import _reportViewer = require('../templates/reportViewerControlV2');
import refCommonClient = require('services/client/CommonClient');

//#endregion
/*
** <summary>
** Transaction Search Result View Model
** </summary>
** <createDetails>
** <id>US8214</id> <by>Avinash Dubey</by> <date>09th July, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by> <date></date>
** </changeHistory>
*/
class TransactionSearchResult {
	//#region Members
	public searchProValueContainer: _reportViewer.ReportViewerControlV2 = null;
	public searchBolValueContainer: _reportViewer.ReportViewerControlV2 = null;

	public proHeader: _reportViewer.ReportHeaderOption = null;
	public bolHeader: _reportViewer.ReportHeaderOption = null;
	public proGrid: _reportViewer.ReportGridOption = null;
	public bolGrid: _reportViewer.ReportGridOption = null;
	public proReportAction: _reportViewer.ReportAction = null;
	public bolReportAction: _reportViewer.ReportAction = null;
	public proData: KnockoutObservableArray<IVendorBillHistoryItems> = null;
	public bolData: KnockoutObservableArray<IVendorBillHistoryItems> = null;


	public setProReportCriteria: (newReportAction: _reportViewer.ReportAction) => any;
	public setBolReportCriteria: (oldReportAction: _reportViewer.ReportAction) => any;
	public getReportData: () => void;
	public proGridOptions: any;
	public bolGridOptions: any;
	public reportType: number;
	public modeType = ko.observable();
	commonUtils = new Utils.Common();
	public vendorBillId: KnockoutObservable<number> = ko.observable();
	public salesorderid: KnockoutObservable<string> = ko.observable('');
	changeRecord: (data) => any;

	commonClient: refCommonClient.Common = new refCommonClient.Common();
	proValues: Array<IVendorBillTransactionSearchResult>;
	bolValues: Array<ISalesOrderTransactionSearchResult>;

	originalData: ITransactionSearchResponse;
	//#endregion

	//#region Constructor
	constructor() {
		var self = this;
		self.proHeader = new _reportViewer.ReportHeaderOption();
		self.proHeader.reportHeader = "";
		self.proHeader.reportName = "Vendor Bill Payment Details";
		self.proHeader.gridTitleHeader = "Vendor Bills";

		self.bolHeader = new _reportViewer.ReportHeaderOption();
		self.bolHeader.reportHeader = "";
		self.bolHeader.reportName = "Sales Bill Payment Details";
		self.bolHeader.gridTitleHeader = "Sales Orders";

		//initialize date filters
		self.proReportAction = new _reportViewer.ReportAction();
		self.bolReportAction = new _reportViewer.ReportAction();
		self.proGrid = self.setProGridOptions(self);
		self.bolGrid = self.setBolGridOptions(self);

		self.setProReportCriteria = (reportActionObj: _reportViewer.ReportAction) => {
			this.proGridOptions = reportActionObj.gridOptions;
			if (this.proReportAction != null) {
				if ((this.modeType() != reportActionObj.filter1selectedItemId) || (this.proReportAction.view != reportActionObj.view) ||
					(reportActionObj.dateFrom != this.proReportAction.dateFrom) || (reportActionObj.dateTo != this.proReportAction.dateTo)) {
					this.proGridOptions.pagingOptions.currentPage(1);
				}
			}
			// Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
			// we don't want any data on page load so we commented getReportdata  function.
			// self.getReportData();
			self.proReportAction = reportActionObj;

		};


		self.setBolReportCriteria = (reportActionObj: _reportViewer.ReportAction) => {
			this.bolGridOptions = reportActionObj.gridOptions;
			if (this.bolReportAction != null) {
				if ((this.modeType() != reportActionObj.filter1selectedItemId) || (this.bolReportAction.view != reportActionObj.view) ||
					(reportActionObj.dateFrom != this.bolReportAction.dateFrom) || (reportActionObj.dateTo != this.bolReportAction.dateTo)) {
					this.bolGridOptions.pagingOptions.currentPage(1);
				}
			}
			// Re-set the oldGrid Columns since the prev. selection of serviceType is diff. to the Current selection
			// we don't want any data on page load so we commented getReportdata  function.
			//self.getReportData();
			this.bolReportAction = reportActionObj;

		};

		// Assign the Old value oldGrid settings
		self.searchBolValueContainer = new _reportViewer.ReportViewerControlV2(self.bolHeader, self.bolGrid);
		self.searchBolValueContainer.onFilterChange = self.setBolReportCriteria;
		self.searchBolValueContainer.ForceChange();

		// Assign the New value newGrid settings
		self.searchProValueContainer = new _reportViewer.ReportViewerControlV2(self.proHeader, self.proGrid);
		self.searchProValueContainer.onFilterChange = self.setProReportCriteria;
		self.searchProValueContainer.ForceChange();
		// redirects to Vendor bill order page
		self.searchProValueContainer.onGridColumnClick = function (shipmentObj) {
			var vendorBillId = shipmentObj.VendorBillId;
			_app.trigger("openVendorBill", vendorBillId, shipmentObj.PRONumber, (callback) => {
				if (!callback) {
					return;
				}
			});
		}

		// redirects to Vendor bill order page
		self.searchBolValueContainer.onGridColumnClick = function (shipmentObj) {
			var shipmentId = shipmentObj.ShipmentId;
			_app.trigger("openSalesOrder", shipmentId, shipmentObj.BOLNumber, (callback) => {
				if (!callback) {
					return;
				}
			});
		}

		return self;
	}

	//#endregion

	//#region Public Methods

	public initializeHistoryDetails(data: ITransactionSearchResponse) {
		var self = this;
		if (data) {
			self.originalData = data;

			self.setPagingData(ko.observableArray(data.VendorBillSearchResults), self.proGridOptions, self.proReportAction);
			self.setPagingData(ko.observableArray(data.SalesOrderSearchResults), self.bolGridOptions, self.bolReportAction);
			self.searchBolValueContainer.listProgress(false);
			self.searchProValueContainer.listProgress(false);

			$('.noLeftBorder').parent().css('border-left', '0');
			$('.noRightBorder').parent().css('border-right', '0');
		}
		else {
			self.searchBolValueContainer.listProgress(false);
			self.searchProValueContainer.listProgress(false);
		}
	}
	//#endregion

	//#region Private Methods
	private setPagingData(data, grid, gridOption) {
		Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
	}

	private setProGridOptions(self: TransactionSearchResult): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = false;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("TransactionSearchGridBol");
		grOption.columnDefinition = self.setProGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "VendorBillId",
			order: "DESC"
		};
		//grOption.enableSaveGridSettings = true;
		grOption.pageSizes = [10, 25, 50, 100];
		grOption.pageSize = 10;
		grOption.totalServerItems = 0;
		grOption.currentPage = 1;
		grOption.jqueryUIDraggable = true;
		grOption.canSelectRows = false;
		grOption.selectWithCheckboxOnly = false;
		grOption.displaySelectionCheckbox = false;
		grOption.multiSelect = false;
		grOption.enablePaging = false;
		grOption.viewPortOptions = false;
		grOption.enableSaveGridSettings = false;
		grOption.useClientSideFilterAndSort = true;
		grOption.showColumnMenu = true;
		return grOption;
	}

	private setBolGridOptions(self: TransactionSearchResult): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = false;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("TransactionSearchGridPro");
		grOption.columnDefinition = self.setBolGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "ShipmentId",
			order: "DESC"
		};
		//grOption.enableSaveGridSettings = true;
		grOption.pageSizes = [10, 25, 50, 100];
		grOption.pageSize = 10;
		grOption.totalServerItems = 0;
		grOption.currentPage = 1;
		grOption.jqueryUIDraggable = true;
		grOption.canSelectRows = false;
		grOption.selectWithCheckboxOnly = false;
		grOption.displaySelectionCheckbox = false;
		grOption.multiSelect = false;
		grOption.enablePaging = false;
		grOption.viewPortOptions = false;
		grOption.enableSaveGridSettings = false;
		grOption.useClientSideFilterAndSort = true;
		grOption.showColumnMenu = true;
		return grOption;
	}
	private setProGridColumnDefinitions() {
		var colDefinition: Array = [];
		var self = this;

		//## PRO Cell Template.
	var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'PRONumber\'], click: function() { $userViewModel.onGridColumnClick($parent.entity) }" />';

		colDefinition = [
		{ field: 'PRONumber', displayName: 'PRONumber', cellTemplate: proCellTemplate },
			{ field: 'BOLNumber', displayName: 'BOL Number' },
			{ field: 'BillDateDisplay', displayName: 'BillDate' },


		];
		return colDefinition;
	}

	private setBolGridColumnDefinitions() {
		var colDefinition: Array = [];
		var self = this;
		//## PRO Cell Template.
		var bolCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'BOLNumber\'], click: function() { $userViewModel.onGridColumnClick($parent.entity) }" />';

		colDefinition = [
		{ field: 'BOLNumber', displayName: 'BOL Number', cellTemplate: bolCellTemplate },
			{ field: 'PRONumber', displayName: 'PRO Number' },
			{ field: 'ShipmentType', displayName: 'Shipment Type' },


		];
		return colDefinition;
	}



	//#region Load Data
	public load(searchData: string) {
		var self = this;

		var successCallBack = data => {
			// To load payment Details
			this.initializeHistoryDetails(data);
		},
			faliureCallBack = () => {
			};

		self.searchBolValueContainer.listProgress(true);
		self.searchProValueContainer.listProgress(true);
		self.commonClient.searchTransaction(searchData, successCallBack, faliureCallBack);
	}


	//#endregion

	//#endregion

	//#region Life Cycle Event
	//## Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
	public attached() {
		_app.trigger('viewAttached');
	}

	//## The composition engine will execute it prior to calling the binder.
	public activate() {
		return true;
	}

	 //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
	public beforeBind() {
		var self = this
_app.trigger("loadMyData", data => {
			if (data) {
				self.load(data);
			} else {
				_app.trigger("closeActiveTab");
				_app.trigger("NavigateTo", 'Home');
			}
		});
	}
	//#endregion
}

return TransactionSearchResult;