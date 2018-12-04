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
/// <reference path="../services/models/TypeDefs/VendorBillSearchModel.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
/// <reference path="../localStorage/LocalStorage.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refEnums = require('services/models/common/Enums');
import _refTransactionSearchCriteria = require('transactionSearch/TransactionSearchCriteria');
import _reportViewer = require('../templates/reportViewerControlV3');
import refCommonClient = require('services/client/CommonClient');
import refSearchModel = require('services/models/transactionSearch/TransactionSearchRequest');
import refVendorNameSearch = require('services/models/common/searchVendorName');
import refUserNameSearch = require('services/models/common/searchUserName');
import refCustomerNameSearch = require('services/models/common/searchCustomerName');
import _refPurchaseOrderSearchFilterModel = require('services/models/purchaseOrder/PurchaseOrderSearchFilter');
import refVendorBillClient = require('services/client/VendorBillClient');
//#endregion

/***********************************************
  TRANSACTION SEARCH VIEW VIEW MODEL
************************************************
** <createDetails>
** <id>US12574</id><by>Satish</by> <date>11th Sep, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id>US21085</id> <by>Janakiram</by> <date>31-03-2016</date> <description>Added csv, Excel Download for sales order, Invoices, Bills, Truck Load Quote</description>
** <id>US22616</id> <by>Dhaval Tamhane</by> <date>03-06-2016</date> <description>Removed Invoice related code for Transaction Search</description>
** <id>US25313</id> <by>Dhaval Tamhane</by> <date>25-10-2016</date> <description>Changes to export functionality of transaction grid</description>
** <id>DE25057   </id> <by>Janakiram</by> <date>31-11-2016</date> <description>Added required filed for truck load quote</description>
** <id>DE25370 </id> <by>Janakiram</by> <date>20-12-2016</date> <description>File Names Chaned While Downloading</description>
** </changeHistory>

***********************************************/

class TransactionSearchViewModel {
	//#region members
	// hold transaction search view model data.
	public transactionSearchcriteriaViewModel: _refTransactionSearchCriteria.TransactionSearchCriteriaViewModel;
	searchType: KnockoutObservable<number> = ko.observable(0);
	vbreportClick: KnockoutObservable<boolean> = ko.observable(false);
	soreportClick: KnockoutObservable<boolean> = ko.observable(false);
	tqreportClick: KnockoutObservable<boolean> = ko.observable(false);
	inreportClick: KnockoutObservable<boolean> = ko.observable(false);

	// ###START: US25313
	public SalesOrderContainer: _reportViewer.ReportViewerControlV3 = null;
	public VendorBillOrPurchaseOrderContainer: _reportViewer.ReportViewerControlV3 = null;
	public TruckloadContainer: _reportViewer.ReportViewerControlV3 = null;
	// ###END: US25313

	public soHeader: _reportViewer.ReportHeaderOption = null;
	public vbHeader: _reportViewer.ReportHeaderOption = null;
	public tqHeader: _reportViewer.ReportHeaderOption = null;

	public soGrid: _reportViewer.ReportGridOption = null;
	public vbGrid: _reportViewer.ReportGridOption = null;
	public tqGrid: _reportViewer.ReportGridOption = null;

	public soReportAction: _reportViewer.ReportAction = null;
	public vbReportAction: _reportViewer.ReportAction = null;
	public tqReportAction: _reportViewer.ReportAction = null;

	public soData: KnockoutObservableArray<ITransactionSearchResponse> = null;
	public vbData: KnockoutObservableArray<ITransactionSearchResponse> = null;
	public tqData: KnockoutObservableArray<ITransactionSearchResponse> = null;

	public setSoReportCriteria: (soReportAction: _reportViewer.ReportAction) => any;
	public setVbReportCriteria: (vbReportAction: _reportViewer.ReportAction) => any;
	public setTqReportCriteria: (tqReportAction: _reportViewer.ReportAction) => any;

	public soGridOptions: any;
	public vbGridOptions: any;
	public tqGridOptions: any;
	public gridOptions: any;

	public getSoReportData: (soReportAction: _reportViewer.ReportAction) => any;
	public getVbReportData: (vbReportAction: _reportViewer.ReportAction) => any;
	public getTqReportData: (tqReportAction: _reportViewer.ReportAction) => any;

	sortCol: KnockoutObservable<string> = ko.observable('ProNumber');
	sorttype: KnockoutObservable<string> = ko.observable('asc');

	//Search Filter
	soSearchFilterItems: Array<IPurchaseOrderSearchFilter> = new Array<_refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter>();
	soSearchFilterItem: IPurchaseOrderSearchFilter = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
	vbSearchFilterItems: Array<IPurchaseOrderSearchFilter> = new Array<_refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter>();
	vbSearchFilterItem: IPurchaseOrderSearchFilter = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
	localStorageKey: KnockoutObservable<string> = ko.observable('');
	isSearchFilterItemsData: KnockoutObservable<boolean> = ko.observable(false);
	isSearchFilterItemsDataForVB: KnockoutObservable<boolean> = ko.observable(false);
	public modeType = ko.observable();

	// Utility class object
	commonUtils: CommonStatic = new Utils.Common();

	// client commond
	commonClient: refCommonClient.Common = new refCommonClient.Common();

	searchRequestParam: refSearchModel.Model.TransactionSearchRequest = new refSearchModel.Model.TransactionSearchRequest();

	pageRecord: KnockoutObservableArray<any> = ko.observableArray([]);
	//#endregion

	//#region Constructor
	constructor() {
		var self = this;
		self.transactionSearchcriteriaViewModel = new _refTransactionSearchCriteria.TransactionSearchCriteriaViewModel((searchType: number) => { self.searchType(searchType); });

		self.soHeader = new _reportViewer.ReportHeaderOption();
		self.soHeader.reportHeader = "";
		self.soHeader.reportName = "Transaction Search Result";
		self.soHeader.gridTitleHeader = " ";

		self.vbHeader = new _reportViewer.ReportHeaderOption();
		self.vbHeader.reportHeader = "";
		self.vbHeader.reportName = "Transaction Search Result";
		self.vbHeader.gridTitleHeader = " ";

		self.tqHeader = new _reportViewer.ReportHeaderOption();
		self.tqHeader.reportHeader = "";
		self.tqHeader.reportName = "Transaction Search Result";
		self.tqHeader.gridTitleHeader = " ";

		//set local storage key by url
		var url = $(location).attr('href');
		var urlArray = url.split('/');
		var localStorageId = urlArray.pop().toString().replace(/#/g, "");
		self.localStorageKey(localStorageId.toString().replace(/#/g, ""));
		if (localStorageId === "TransactionSearch") {
			self.localStorageKey(localStorageId + "26");
		} else {
			self.localStorageKey(localStorageId);
		}

		//initialize date filters
		self.soReportAction = new _reportViewer.ReportAction();
		self.vbReportAction = new _reportViewer.ReportAction();
		self.tqReportAction = new _reportViewer.ReportAction();

		self.soGrid = self.setSoGridOptions(self);
		self.vbGrid = self.setVbGridOptions(self);
		self.tqGrid = self.setTqGridOptions(self);

		// ###START: US21085

		//## Region Export Options.

		// For vendorBill
		var vbExportOpt = ko.observableArray([
			{ exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
			{ exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) },
			{ exportType: _reportViewer.ExportOptions.FILTER, name: ko.observable(""), enabled: ko.observable(true) }]);

		self.vbHeader.reportExportOptions = new _reportViewer.ReportExportControl(vbExportOpt);

		// ###START: US25313
		self.vbHeader.reportExportOptions.getUrl = function (exp: _reportViewer.IExportOptions, event?: Event): JQueryPromise<any> {
			var deferred = $.Deferred(),
				promise = deferred.promise();

			if (self.vbGridOptions.pagingOptions.totalServerItems() == 0) {
				deferred.resolve("No Data");
				return promise;
			}

			var today = new Date();
			var currentTimestamp = moment(today).format("MM-DD-YYYY, HH:mm").toString();

			var visibleColumnList = self.VendorBillOrPurchaseOrderContainer.getVisibleColumns('TransactionSearchGridVb', event.currentTarget);
			var saveData = { PageSize: self.vbGridOptions.pagingOptions.pageSize(), Filters: self.vbSearchFilterItems };
			var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.TransactionSearchBill, IsFilterApplied: self.VendorBillOrPurchaseOrderContainer.reportColumnFilter.isFilterApply, GridSearchText: null, PageNo: self.vbGridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype() };
			var urlString = "Accounting/ExportTransactionSearchForVendorBill"
			var params = self.searchRequestParam;

			var deferredData: IExportJQueryPromise = {
				searchModel: JSON.stringify({
					PageSize: exp.exportType === 1 ? 2000 : self.vbGridOptions.pagingOptions.totalServerItems(),
					PageNumber: 1,
					ExportTypeParam: _reportViewer.ExportOptions[exp.exportType],
					TransactionSearchRequest: params,
					SearchFilterItems: self.vbSearchFilterItems,
					SearchFilterModel: filterDataToSave,
					CurrentTimestamp: currentTimestamp,
					VisibleColList: visibleColumnList
				}),
				componentUrl: urlString,
				fileName: 'Transaction Search Vendor Bill'
			};

			deferred.resolve(deferredData);
			return promise;
		}
		// ###END: US25313

		// For Sales Order
        var soExportOpt = ko.observableArray([
			{ exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
			{ exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) },
			{ exportType: _reportViewer.ExportOptions.FILTER, name: ko.observable(""), enabled: ko.observable(true) }]);

		self.soHeader.reportExportOptions = new _reportViewer.ReportExportControl(soExportOpt);

		// ###START: US25313
		self.soHeader.reportExportOptions.getUrl = function (exp: _reportViewer.IExportOptions, event?: Event): any {
			var deferred = $.Deferred(),
				promise = deferred.promise();

			if (self.soGridOptions.pagingOptions.totalServerItems() == 0) {
				deferred.resolve("No Data");
				return promise;
			}

			var today = new Date();
			var currentTimestamp = moment(today).format("MM-DD-YYYY, HH:mm").toString();

			var visibleColumnList = self.SalesOrderContainer.getVisibleColumns('TransactionSearchGridSO', event.currentTarget);
			var saveData = { PageSize: self.soGridOptions.pagingOptions.pageSize(), Filters: self.soSearchFilterItems };
			var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.TransactionSearchSalesOrder, IsFilterApplied: self.SalesOrderContainer.reportColumnFilter.isFilterApply, GridSearchText: null, PageNo: self.soGridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype() };
			var urlString = "Accounting/ExportTransactionSearchForSalesOrder"

			var deferredData: IExportJQueryPromise = {
				searchModel: JSON.stringify({
					PageSize: exp.exportType === 1 ? 2000 : self.soGridOptions.pagingOptions.totalServerItems(),
					PageNumber: 1,
					ExportTypeParam: _reportViewer.ExportOptions[exp.exportType],
					TransactionSearchRequest: self.searchRequestParam,
					SearchFilterItems: self.soSearchFilterItems,
					SearchFilterModel: filterDataToSave,
					CurrentTimestamp: currentTimestamp,
					VisibleColList: visibleColumnList
				}),
				componentUrl: urlString,
				fileName: 'Transaction Search Sales Order'
			};

			deferred.resolve(deferredData);
			return promise;
		}
		// ###END: US25313

        // For Truck Quote Load    
        var tqExportOpt = ko.observableArray([
			{ exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
			{ exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) }]);

		self.tqHeader.reportExportOptions = new _reportViewer.ReportExportControl(tqExportOpt);

		// ###START: US25313
		self.tqHeader.reportExportOptions.getUrl = function (exp: _reportViewer.IExportOptions, event?: Event): any {
			var deferred = $.Deferred(),
				promise = deferred.promise();

			if (self.tqGridOptions.pagingOptions.totalServerItems() == 0) {
				deferred.resolve("No Data");
				return promise;
			}

			var today = new Date();
			var currentTimestamp = moment(today).format("MM-DD-YYYY, HH:mm").toString();

			var visibleColumnList = self.TruckloadContainer.getVisibleColumns('TransactionSearchGridTruckload', event.currentTarget);
			var urlString = "Accounting/ExportTransactionSearchForTruckload"

			var deferredData: IExportJQueryPromise = {
				searchModel: JSON.stringify({
					PageSize: exp.exportType === 1 ? 2000 : self.tqGridOptions.pagingOptions.totalServerItems(),
					PageNumber: 1,
					ExportTypeParam: _reportViewer.ExportOptions[exp.exportType],
					TransactionSearchRequest: self.searchRequestParam,
					CurrentTimestamp: currentTimestamp,
					VisibleColList: visibleColumnList
				}),
				componentUrl: urlString,
				fileName: 'Transaction Search Truck Load'
			};

			deferred.resolve(deferredData);
			return promise;
		}
		// ###END: US25313

		//## Region Export Options End.

        // ###END: US21085


		self.setVbReportCriteria = (vbReportActionObj: _reportViewer.ReportAction) => {
			if ((vbReportActionObj != undefined || vbReportActionObj != null) && (vbReportActionObj.gridOptions != undefined || vbReportActionObj.gridOptions != null) && (refSystem.isObject(vbReportActionObj.gridOptions.sortInfo())) && (vbReportActionObj.gridOptions.sortInfo().column != undefined || vbReportActionObj.gridOptions.sortInfo().column != null) && (vbReportActionObj.gridOptions.sortInfo().column.field != undefined || vbReportActionObj.gridOptions.sortInfo().column.field != null)) {
				self.sortCol(vbReportActionObj.gridOptions.sortInfo().column.field);
				if (self.sortCol() == 'BillDateDisplay') {
					self.sortCol('BillDate');
				}
				else if (self.sortCol() == 'BillStatusDisplay') {
					self.sortCol('BillStatus');
				}

				self.sorttype(vbReportActionObj.gridOptions.sortInfo().direction);
			}
			else {
				self.sortCol("PRONo");
				self.sorttype("desc");
			}
			if (vbReportActionObj.filter1selectedItemId == undefined || vbReportActionObj.filter1selectedItemId == 0) {
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 15,
					fadeOut: 15,
					typeOfAlert: "",
					title: ""
				}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectModeFromTheList, "info", null, toastrOptions);
				self.VendorBillOrPurchaseOrderContainer.listProgress(false);
				self.VendorBillOrPurchaseOrderContainer.selectedFilter1Item(self.modeType());
			}
			else {
				self.vbGridOptions = vbReportActionObj.gridOptions;
				if (self.modeType() != vbReportActionObj.filter1selectedItemId) {
					self.modeType(vbReportActionObj.filter1selectedItemId);
					self.VendorBillOrPurchaseOrderContainer.columnDefinition(self.setVbGridColumnDefinitions());
				}
				self.vbReportAction = vbReportActionObj;

				if (self.vbreportClick())
					self.getVbReportData(vbReportActionObj);
			}
		};

		self.setSoReportCriteria = (soReportActionObj: _reportViewer.ReportAction) => {
			if ((soReportActionObj != undefined || soReportActionObj != null) && (soReportActionObj.gridOptions != undefined || soReportActionObj.gridOptions != null) && (refSystem.isObject(soReportActionObj.gridOptions.sortInfo())) && (soReportActionObj.gridOptions.sortInfo().column != undefined || soReportActionObj.gridOptions.sortInfo().column != null) && (soReportActionObj.gridOptions.sortInfo().column.field != undefined || soReportActionObj.gridOptions.sortInfo().column.field != null)) {
				self.sortCol(soReportActionObj.gridOptions.sortInfo().column.field);
				if (self.sortCol() == 'BillDateDisplay') {
					self.sortCol('BillDate')
				}
				else if (self.sortCol() == 'PickupDateDisplay') {
					self.sortCol('PickupDate');
				}
				else if (self.sortCol() == 'ProcessStatusDisplay') {
					self.sortCol('ProcessStatusDescription');
				}
				else if (self.sortCol() == 'InvoiceStatusDisplay') {
					self.sortCol('InvoiceStatusDescription');
				}
				else if (self.sortCol() == 'CustomerType') {
					self.sortCol('ProcessFlow');
				} else if (self.sortCol() == 'CompanyNameDisplay') {
					self.sortCol('AccountName');
				}
				self.sorttype(soReportActionObj.gridOptions.sortInfo().direction);
			}
			else {
				self.sortCol("BOLNumber");
				self.sorttype("desc");
			}
			if (soReportActionObj.filter1selectedItemId == undefined || soReportActionObj.filter1selectedItemId == 0) {
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 15,
					fadeOut: 15,
					typeOfAlert: "",
					title: ""
				}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectModeFromTheList, "info", null, toastrOptions);
				self.SalesOrderContainer.listProgress(false);
				self.SalesOrderContainer.selectedFilter1Item(self.modeType());
			}
			else {
				self.soGridOptions = soReportActionObj.gridOptions;
				if (self.modeType() != soReportActionObj.filter1selectedItemId) {
					self.SalesOrderContainer.columnDefinition(self.setSoGridColumnDefinitions());
				}
				self.soReportAction = soReportActionObj;

				if (self.soreportClick())
					self.getSoReportData(soReportActionObj);
			}
		};

		self.setTqReportCriteria = (tqReportActionObj: _reportViewer.ReportAction) => {
			if (tqReportActionObj.filter1selectedItemId == undefined || tqReportActionObj.filter1selectedItemId == 0) {
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 15,
					fadeOut: 15,
					typeOfAlert: "",
					title: ""
				}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectModeFromTheList, "info", null, toastrOptions);
				self.TruckloadContainer.listProgress(false);
				self.TruckloadContainer.selectedFilter1Item(self.modeType());
			}
			else {
				self.tqGridOptions = tqReportActionObj.gridOptions;
				if (self.modeType() != tqReportActionObj.filter1selectedItemId) {
					self.TruckloadContainer.columnDefinition(self.setTqGridColumnDefinitions());
				}
				self.tqReportAction = tqReportActionObj;

				if (self.tqreportClick())
					self.getTqReportData(tqReportActionObj);
			}
		};

		self.getSoReportData = function (soReportActionObj: _reportViewer.ReportAction) {
			var deferred = $.Deferred();
			var promise = deferred.promise();
			var pageno = 0;
			// List View

			pageno = Number(self.soGridOptions.pagingOptions.currentPage());
			if (pageno > 0) {
				self.SalesOrderContainer.listProgress(true);
				if (self.SalesOrderContainer.reportColumnFilter.isFilterApply) {
					var list = self.SalesOrderContainer.reportColumnFilter.reportColumnFilters();
					self.soSearchFilterItems.removeAll();
					if (list.length > 0) {
						list.forEach((items) => {
							self.soSearchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						if (items.selectedserviceType() != undefined && items.selectedOperatorType() != undefined) {
								if (items.selectedserviceType().field === 'BillDateDisplay') {
									self.soSearchFilterItem.FieldName = "BillDate";
								}
								else if (items.selectedserviceType().field === 'PickupDateDisplay') {
									self.soSearchFilterItem.FieldName = "PickupDate";
								}
								else if (items.selectedserviceType().field === 'ProcessStatusDisplay') {
									self.soSearchFilterItem.FieldName = "ProcessStatusDescription";
								}
								else if (items.selectedserviceType().field === 'InvoiceStatusDisplay') {
									self.soSearchFilterItem.FieldName = "InvoiceStatusDescription";
								}
								else if (items.selectedserviceType().field === 'CompanyNameDisplay') {
									self.soSearchFilterItem.FieldName = "AccountName";
								}

								else {
									self.soSearchFilterItem.FieldName = items.selectedserviceType().field;
								}

								self.soSearchFilterItem.Operand = +items.selectedOperatorType().opratorId;
								self.soSearchFilterItem.SearchText = items.searchText();
								self.soSearchFilterItems.push(self.soSearchFilterItem);
							}
							if (self.soSearchFilterItems.length > 0 || items.selectedserviceType() != undefined) {
								self.isSearchFilterItemsData(true);
							} else {
								self.isSearchFilterItemsData(false);
							}
						});
					}
				}
				if (self.sortCol() == 'PRONo') {
					self.sortCol('PRONumber');
				}
				else if (self.sortCol() == 'CustomerType') {
					self.sortCol('ProcessFlow');
				}
				self.assignCriteriaValues();
				var successCallBack = responce => {
					var pageRecord = "";

					self.setPagingData(responce.SalesOrderResponse, responce.NumberOfRows, self.soGridOptions.pagingOptions.pageSize(), self.searchType());
					self.SalesOrderContainer.listProgress(false);

					deferred.resolve(responce, soReportActionObj.view);
				}
					var faliureCallBack = message => {
					self.SalesOrderContainer.listProgress(false);
				};

				//Checking if we have data in local storage then we will not call server call
				var saveData = { PageSize: self.soGridOptions.pagingOptions.pageSize(), Filters: self.soSearchFilterItems }
				var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.TransactionSearchSalesOrder, IsFilterApplied: self.SalesOrderContainer.reportColumnFilter.isFilterApply, GridSearchText: null, PageNo: self.soGridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype() };
				var searchParam = { SearchModel: self.searchRequestParam, SearchFilterModel: filterDataToSave }
				self.commonClient.getTransactionSearchResponse(searchParam, successCallBack, faliureCallBack);
			}

			return promise;
		};

		self.getVbReportData = function (vbReportActionObj: _reportViewer.ReportAction) {
			var deferred = $.Deferred();
			var promise = deferred.promise();
			var pageno = 0;
			// List View
			pageno = Number(self.vbGridOptions.pagingOptions.currentPage());
			if (pageno > 0) {
				self.VendorBillOrPurchaseOrderContainer.listProgress(true);
				if (self.VendorBillOrPurchaseOrderContainer.reportColumnFilter.isFilterApply) {
					var list = self.VendorBillOrPurchaseOrderContainer.reportColumnFilter.reportColumnFilters();
					self.vbSearchFilterItems.removeAll();
					if (list.length > 0) {
						list.forEach((items) => {
							self.vbSearchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						if (items.selectedserviceType() != undefined && items.selectedOperatorType() != undefined) {
								if (items.selectedserviceType().field === 'BillDateDisplay') {
									self.vbSearchFilterItem.FieldName = "BillDate";
								}
								else if (items.selectedserviceType().field === 'PickupDateDisplay') {
									self.vbSearchFilterItem.FieldName = "PickupDate";
								}
								else if (items.selectedserviceType().field === 'ProcessStatusDisplay') {
									self.vbSearchFilterItem.FieldName = "ProcessStatusDescription";
								}
								else if (items.selectedserviceType().field === 'InvoiceStatusDisplay') {
									self.vbSearchFilterItem.FieldName = "InvoiceStatusDescription";
								}

								else if (items.selectedserviceType().field === 'BillStatusDisplay') {
									self.vbSearchFilterItem.FieldName = "BillStatusDescription";
								}
								else {
									self.vbSearchFilterItem.FieldName = items.selectedserviceType().field;
								}

								self.vbSearchFilterItem.Operand = +items.selectedOperatorType().opratorId;
								self.vbSearchFilterItem.SearchText = items.searchText();
								self.vbSearchFilterItems.push(self.vbSearchFilterItem);
							}
							if (self.vbSearchFilterItems.length > 0 || items.selectedserviceType() != undefined) {
								self.isSearchFilterItemsDataForVB(true);
							} else {
								self.isSearchFilterItemsDataForVB(false);
							}
						});
					}
				}

				if (self.sortCol() == 'PRONumber') {
					self.sortCol('PRONo');
				}
				self.assignCriteriaValues();

				var successCallBack = responce => {
					var pageRecord = "";

					self.setPagingData(responce.VendorBillOrPurchaseOrderResponse, responce.NumberOfRows, self.vbGridOptions.pagingOptions.pageSize(), self.searchType());
					self.VendorBillOrPurchaseOrderContainer.listProgress(false);

					deferred.resolve(responce, vbReportActionObj.view);
				};

				var faliureCallBack = message => {
					self.VendorBillOrPurchaseOrderContainer.listProgress(false);
				};

				//Checking if we have data in local storage then we will not call server call
				var saveData = { PageSize: self.vbGridOptions.pagingOptions.pageSize(), Filters: self.vbSearchFilterItems };
				var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.TransactionSearchBill, IsFilterApplied: self.VendorBillOrPurchaseOrderContainer.reportColumnFilter.isFilterApply, GridSearchText: null, PageNo: self.vbGridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype() };

				var searchParam = { SearchModel: self.searchRequestParam, SearchFilterModel: filterDataToSave };
				self.commonClient.getTransactionSearchResponse(searchParam, successCallBack, faliureCallBack);
			}

			return promise;
		};

		self.getTqReportData = function (tqReportActionObj: _reportViewer.ReportAction) {
			var deferred = $.Deferred();
			var promise = deferred.promise();
			var pageno = 0;
			// List View
			pageno = Number(self.tqGridOptions.pagingOptions.currentPage());
			if (pageno > 0) {
				self.TruckloadContainer.listProgress(true);
				self.assignCriteriaValues();
				var searchRequestParameter = self.searchRequestParam,
					successCallBack = responce => {
						var pageRecord = "";

						self.setPagingData(responce.TruckloadQuoteResponse, responce.NumberOfRows, self.tqGridOptions.pagingOptions.pageSize(), self.searchType());
						self.TruckloadContainer.listProgress(false);

						deferred.resolve(responce, tqReportActionObj.view);
					},
					faliureCallBack = message => {
						self.TruckloadContainer.listProgress(false);
					};

				var searchParam = { SearchModel: self.searchRequestParam, SearchFilterModel: null };
				self.commonClient.getTransactionSearchResponse(searchParam, successCallBack, faliureCallBack);
			}

			return promise;
		};

		// Assign the Sales Order grid settings
		// ###START: US25313
		self.SalesOrderContainer = new _reportViewer.ReportViewerControlV3(self.soHeader, self.soGrid);
		// ###END: US25313
		self.SalesOrderContainer.onFilterChange = self.setSoReportCriteria;
		self.SalesOrderContainer.ForceChange();

		// Assign the Vendor Bill Grid settings
		// ###START: US25313
		self.VendorBillOrPurchaseOrderContainer = new _reportViewer.ReportViewerControlV3(self.vbHeader, self.vbGrid);
		// ###END: US25313
		self.VendorBillOrPurchaseOrderContainer.onFilterChange = self.setVbReportCriteria;
		self.VendorBillOrPurchaseOrderContainer.ForceChange();

		// Assign Truck Load Grid Settings
		// ###START: US25313
		self.TruckloadContainer = new _reportViewer.ReportViewerControlV3(self.tqHeader, self.tqGrid);
		// ###END: US25313
		self.TruckloadContainer.onFilterChange = self.setTqReportCriteria;
		self.TruckloadContainer.ForceChange();

		// redirects to sales order details page
		self.SalesOrderContainer.onBolNumberClick = function (shipmentObj) {
			var salesOrderId = shipmentObj.ShipmentId;
			_app.trigger("openSalesOrder", salesOrderId, shipmentObj.BOLNumber, (callback) => {
				if (!callback) {
					return;
				}
			});
		}

		// redirects to sales order details page
		self.VendorBillOrPurchaseOrderContainer.onBolNumberClick = function (shipmentObj) {
			var salesOrderId = shipmentObj.SalesOrderId;
			if (salesOrderId > 0) {
				_app.trigger("openSalesOrder", salesOrderId, shipmentObj.BOLNumber, (callback) => {
					if (!callback) {
						return;
					}
				});
			}
		}

		// redirects to sales order details page
		self.VendorBillOrPurchaseOrderContainer.onProNumberClick = function (shipmentObj) {
			var vendorBillId = shipmentObj.VendorBillId;
			var checkPo = shipmentObj.IsPurchaseOrder;
			if (checkPo) {
				_app.trigger("openPurchaseOrder", vendorBillId, shipmentObj.PRONo, (callback) => {
					if (!callback) {
						return;
					}
				});
			}
			else {
				_app.trigger("openVendorBill", vendorBillId, shipmentObj.PRONo, (callback) => {
					if (!callback) {
						return;
					}
				});
			}
		}

		// redirects to sales order details page
		self.TruckloadContainer.onBolNumberClick = function (shipmentObj) {
			var salesOrderId = shipmentObj.SalesOrderId;
			_app.trigger("openSalesOrder", salesOrderId, shipmentObj.BolNumber, (callback) => {
				if (!callback) {
					return;
				}
			});
		}

		self.searchType.subscribe((newValue) => {
			self.setFilter(newValue);

			if (newValue === refEnums.Enums.TransactionSearchType.SalesOrder.ID) {
				self.sortCol('BOLNumber');
				self.sorttype('desc');
			}
			else if (newValue === refEnums.Enums.TransactionSearchType.Bills.ID) {
				self.sortCol('PRONo');
				self.sorttype('desc');
			}
		});
	}
	//#endregion

	//#region Internal Methods

	//clearing all filter data
	public onClickClearAllSOFilter() {
		var self = this;
		self.SalesOrderContainer.reportColumnFilter.clearAll();
		self.SalesOrderContainer.reportColumnFilter.applyFilter();
		self.isSearchFilterItemsData(false);
		//$('#SOGrid').removeClass('margin-top--29');
	}

	//clearing all filter data
	public onClickClearAllVBFilter() {
		var self = this;
		self.VendorBillOrPurchaseOrderContainer.reportColumnFilter.clearAll();
		self.VendorBillOrPurchaseOrderContainer.reportColumnFilter.applyFilter();
		self.isSearchFilterItemsDataForVB(false);
	}

	private setPagingData(data, page, pageSize, type) {
		var self = this;
		if (type === refEnums.Enums.TransactionSearchType.SalesOrder.ID) {
			self.soGridOptions.data(data);
			self.soGridOptions.data.valueHasMutated()
		    self.soGridOptions.pagingOptions.totalServerItems(page);
		}
		else if (type === refEnums.Enums.TransactionSearchType.Bills.ID) {
			self.vbGridOptions.data(data);
			self.vbGridOptions.data.valueHasMutated()
		    self.vbGridOptions.pagingOptions.totalServerItems(page);
		}
		else {
			self.tqGridOptions.data(data);
			self.tqGridOptions.data.valueHasMutated()
		    self.tqGridOptions.pagingOptions.totalServerItems(page);
		}
	}

	private setSoGridOptions(self: TransactionSearchViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("TransactionSearchGridSO");
		grOption.columnDefinition = self.setSoGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "BOLNumber",
			order: "desc"
		};
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

	private setVbGridOptions(self: TransactionSearchViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("TransactionSearchGridVb");
		grOption.columnDefinition = self.setVbGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "PRONo",
			order: "desc"
		};
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

	private setTqGridOptions(self: TransactionSearchViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("TransactionSearchGridTruckload");
		grOption.columnDefinition = self.setTqGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "BolNumber",
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

	private setSoGridColumnDefinitions() {
		var colDefinition: Array = [];
		var self = this;
		// For BOLnumber
		var bolCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'BOLNumber\'], click: function() { $userViewModel.onBolNumberClick($parent.entity) }" />';

		colDefinition = [
			{ field: 'BOLNumber', displayName: 'BOL#', cellTemplate: bolCellTemplate, isRemovable: false, width: 110, type: _reportViewer.DataTypes.String },
			{ field: 'PRONumber', displayName: 'PRO#', width: 110, type: _reportViewer.DataTypes.String },
			{ field: 'PickupDateDisplay', displayName: 'Pickup Date', width: 100, type: _reportViewer.DataTypes.DateTime },
			{ field: 'CustomerBolNumber', displayName: 'Customer BOL', isRemovable: true, width: 100, type: _reportViewer.DataTypes.String },
			{ field: 'CompanyNameDisplay', displayName: 'Customer', isRemovable: true, width: 120, type: _reportViewer.DataTypes.String },
			{ field: 'CarrierName', displayName: 'Vendor', isRemovable: false, width: 120, type: _reportViewer.DataTypes.String },
			{ field: 'ShipperName', displayName: 'Shipper', width: 130, type: _reportViewer.DataTypes.String },
			{ field: 'ConsigneeName', displayName: 'Consignee', width: 130, type: _reportViewer.DataTypes.String },
			{ field: 'ShipperZipCode', displayName: 'Origin', width: 80, type: _reportViewer.DataTypes.String },
			{ field: 'ConsigneeZipCode', displayName: 'Destination ', width: 90, type: _reportViewer.DataTypes.String },
			{ field: 'ShipmentMode', displayName: 'Service Type', width: 110, type: _reportViewer.DataTypes.String },
			{ field: 'TotalWeight', displayName: 'Total Weight', width: 80, type: _reportViewer.DataTypes.Numeric },
			{ field: 'TotalPieces', displayName: 'Total Pieces', width: 80, type: _reportViewer.DataTypes.Numeric },
			{ field: 'Revenue', displayName: 'Revenue', width: 80, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric },
			{ field: 'ProcessStatusDisplay', displayName: 'Process Status', width: 120, isRemovable: false, type: _reportViewer.DataTypes.String },
			{ field: 'InvoiceStatusDisplay', displayName: 'Invoice Status', width: 130, isRemovable: false, type: _reportViewer.DataTypes.String },
			{ field: 'CustomerType', displayName: 'Customer Type', width: 100, display: false, dntApplyFilter: true, type: _reportViewer.DataTypes.String }
		];
		return colDefinition;
	}

	private setVbGridColumnDefinitions() {
		var colDefinition: Array = [];
		var self = this;

		// For ProNumber
		var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'PRONo\'], click: function() { $userViewModel.onProNumberClick($parent.entity) }" />';
		//For BOL Number
		var bolCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'BOLNumber\'], click: function() { $userViewModel.onBolNumberClick($parent.entity) }" />';

		colDefinition = [
			{ field: 'PRONo', displayName: 'PRO#', cellTemplate: proCellTemplate, width: 100, type: _reportViewer.DataTypes.String },
			{ field: 'BillDateDisplay', displayName: 'Date', width: 100, isRemovable: false, type: _reportViewer.DataTypes.DateTime },
			{ field: 'BOLNumber', displayName: 'BOL#', isRemovable: false, width: 95, cellTemplate: bolCellTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'VendorBillId', displayName: 'Id', isRemovable: false, visible: false, type: _reportViewer.DataTypes.Numeric, dntApplyFilter: true },
			{ field: 'IsPurchaseOrder', displayName: 'IsPurchaseOrder', isRemovable: false, visible: false, type: _reportViewer.DataTypes.String, dntApplyFilter: true },
			{ field: 'CustomerBOLNumber', displayName: 'Customer BOL', width: 100, isRemovable: true, type: _reportViewer.DataTypes.String },
			{ field: 'CarrierName', displayName: 'Carrier', isRemovable: false, width: 200, type: _reportViewer.DataTypes.String },
			{ field: 'ShipperName', displayName: 'Shipper', width: 200, type: _reportViewer.DataTypes.String },
			{ field: 'ConsigneeName', displayName: 'Consignee', width: 200, type: _reportViewer.DataTypes.String },
			{ field: 'Origin', displayName: 'Origin', width: 80, type: _reportViewer.DataTypes.String },
			{ field: 'Destination', displayName: 'Destination', width: 90, type: _reportViewer.DataTypes.String },
			{ field: 'Amount', displayName: 'Amount', width: 80, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric },
			{ field: 'BillStatusDisplay', displayName: 'Bill Status', width: 150, isRemovable: false, type: _reportViewer.DataTypes.String }
		];
		return colDefinition;
	}

	private setTqGridColumnDefinitions() {
		var colDefinition: Array = [];
		var self = this;

		//For BOL Number
		var bolCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'BolNumber\'], click: function() { $userViewModel.onBolNumberClick($parent.entity) }" />';

		colDefinition = [
			{ field: 'BolNumber', displayName: 'BOL#', isRemovable: false, width: 95, cellTemplate: bolCellTemplate },
			{ field: 'QuoteNumber', displayName: 'Quote#', width: 95, isRemovable: false },
			{ field: 'StatusDisplay', displayName: 'Status', width: 150, isRemovable: true },
			{ field: 'Customer', displayName: 'Customer', isRemovable: false, width: 200 },
			{ field: 'Agent', displayName: 'Agent', isRemovable: false, width: 200 },
			{ field: 'Carrier', displayName: 'Carrier', width: 200 },
			{ field: 'TruckTypeDisplay', displayName: 'Truck Type', width: 150 },
			{ field: 'TruckLengthDisplay', displayName: 'Truck Length', width: 150 },
			{ field: 'ServiceTypeDisplay', displayName: 'Service Type', width: 150 },
			{ field: 'Tarps', displayName: 'Tarps', width: 80 },
			{ field: 'OriginZipCode', displayName: 'OZip', width: 100 },
			{ field: 'OriginCity', displayName: 'OCity', width: 100 },
			{ field: 'OriginState', displayName: 'OState', width: 100 },
			{ field: 'DestinationZipCode', displayName: 'DZip', width: 100 },
			{ field: 'DestinationState', displayName: 'DState', width: 100 },
			{ field: 'DestinationCity', displayName: 'DCity', width: 100 }
		];
		return colDefinition;
	}

	private getSearchData() {
		var self = this;

		// ###START: DE25057   
		if (self.transactionSearchcriteriaViewModel.validationGroupTransaction.errors().length != 0) {
			self.transactionSearchcriteriaViewModel.validationGroupTransaction.errors.showAllMessages();
			return;
		}
		// ###END: DE25057   

		//removing local storage data on search click
		LocalStorageController.Set(self.localStorageKey(), undefined);
		$('#collapseTransactionSearch').css("overflow", "hidden");
		self.collapseView('collapseTransactionSearch');
		self.expandView('collapseSearchResults');
		self.isSearchFilterItemsData(false);
		self.isSearchFilterItemsDataForVB(false);
		self.transactionSearchcriteriaViewModel.selectedItemNumberList = self.getCommaSeperatedItemNumbers(); //assigning the values to the model to save

		if (self.searchType() === refEnums.Enums.TransactionSearchType.SalesOrder.ID) {
			self.soreportClick(true);
			self.soGridOptions.pagingOptions.currentPage(1);
			self.SalesOrderContainer.reportColumnFilter.isFilterApply = false;
			self.SalesOrderContainer.reportColumnFilter.clearAll();
			self.getSoReportData(self.soReportAction);
		}
		else if (self.searchType() === refEnums.Enums.TransactionSearchType.Bills.ID) {
			self.vbreportClick(true);
			self.vbGridOptions.pagingOptions.currentPage(1);
			self.VendorBillOrPurchaseOrderContainer.reportColumnFilter.isFilterApply = false;
			self.VendorBillOrPurchaseOrderContainer.reportColumnFilter.clearAll();
			self.getVbReportData(self.vbReportAction);
		}
		else {
			self.tqreportClick(true);
			self.tqGridOptions.pagingOptions.currentPage(1);
			self.getTqReportData(self.tqReportAction);
		}
		self.fillLocalStorage();
	}

	//function to set the overflow property to the Accordion
	private onCriteriaClick() {
		var self = this;
		self.collapseView('collapseSearchResults');
		$('#collapseTransactionSearch').css("overflow", "hidden");
	}

	private onSearchResultClick() {
		var self = this;
		$('#collapseTransactionSearch').css("overflow", "hidden");
		self.collapseView('collapseTransactionSearch');
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
	}

	private load() {
		var self = this;
		var pageRecord = LocalStorageController.Get(self.localStorageKey());
		if (pageRecord != null && typeof (pageRecord.SearchData.transactionSearch) !== 'undefined') {
			self.transactionSearchcriteriaViewModel.selectedtypeList(pageRecord.SearchData.transactionSearch.selectedtypeList());

			//** holds the vendor name. */
			self.transactionSearchcriteriaViewModel.vendorNameSearchList.name(new refVendorNameSearch.Models.VendorNameSearch());
			self.transactionSearchcriteriaViewModel.userSearchList.name(new refUserNameSearch.Models.UserNameSearch());
			self.transactionSearchcriteriaViewModel.customerNameSearchList.name(new refCustomerNameSearch.Models.CustomerNameSearch());
			self.transactionSearchcriteriaViewModel.amount($.number((pageRecord.SearchData.transactionSearch.amount()), 2));
			self.transactionSearchcriteriaViewModel.bolNumber(pageRecord.SearchData.transactionSearch.bolNumber());
			self.transactionSearchcriteriaViewModel.shipperCompanyName(pageRecord.SearchData.transactionSearch.shipperCompanyName());
			self.transactionSearchcriteriaViewModel.consigneeCompanyName(pageRecord.SearchData.transactionSearch.consigneeCompanyName());
			self.transactionSearchcriteriaViewModel.vendorNameSearchList.vendorName(self.commonUtils.isNullOrEmptyOrWhiteSpaces(pageRecord.SearchData.transactionSearch.vendorName()) ? pageRecord.SearchData.transactionSearch.vendorName() : '');
			self.transactionSearchcriteriaViewModel.poNumber(pageRecord.SearchData.transactionSearch.poNumber());
			self.transactionSearchcriteriaViewModel.shipperCity(pageRecord.SearchData.transactionSearch.shipperCity());
			self.transactionSearchcriteriaViewModel.consigneeCity(pageRecord.SearchData.transactionSearch.consigneeCity());
			self.transactionSearchcriteriaViewModel.userSearchList.userName(self.commonUtils.isNullOrEmptyOrWhiteSpaces(pageRecord.SearchData.transactionSearch.userName()) ? pageRecord.SearchData.transactionSearch.userName() : '');
			self.transactionSearchcriteriaViewModel.shipperZip(pageRecord.SearchData.transactionSearch.shipperZip());
			self.transactionSearchcriteriaViewModel.consigneeZip(pageRecord.SearchData.transactionSearch.consigneeZip());
			self.transactionSearchcriteriaViewModel.customerBOLNumber(pageRecord.SearchData.transactionSearch.customerBOLNumber());
			self.transactionSearchcriteriaViewModel.proNumber(pageRecord.SearchData.transactionSearch.proNumber());
			self.transactionSearchcriteriaViewModel.customerNameSearchList.customerName(self.commonUtils.isNullOrEmptyOrWhiteSpaces(pageRecord.SearchData.transactionSearch.customerName()) ? pageRecord.SearchData.transactionSearch.customerName() : '');
			self.transactionSearchcriteriaViewModel.truckLoadQuoteNumber(pageRecord.SearchData.transactionSearch.truckLoadQuoteNumber());
			self.transactionSearchcriteriaViewModel.refNumber(pageRecord.SearchData.transactionSearch.refNumber());
			self.transactionSearchcriteriaViewModel.totalWeight(pageRecord.SearchData.transactionSearch.totalWeight());
			self.transactionSearchcriteriaViewModel.totalPieces(pageRecord.SearchData.transactionSearch.totalPieces());
			self.transactionSearchcriteriaViewModel.fromDate(pageRecord.SearchData.transactionSearch.fromDate());
			self.transactionSearchcriteriaViewModel.toDate(pageRecord.SearchData.transactionSearch.toDate());
			self.transactionSearchcriteriaViewModel.searchType(pageRecord.SearchData.transactionSearch.searchType());

			// TODO: we have to change the logic to fill the dropdown selected values.
			self.transactionSearchcriteriaViewModel.dateRangeSelectedOption(pageRecord.SearchData.transactionSearch.dateRangeSelectedOption());
			self.transactionSearchcriteriaViewModel.selectedorderStatusList(pageRecord.SearchData.transactionSearch.selectedorderStatusList());
			self.transactionSearchcriteriaViewModel.selectedInvoiceStatusList(pageRecord.SearchData.transactionSearch.selectedInvoiceStatusList());
			self.transactionSearchcriteriaViewModel.selectedModeList(pageRecord.SearchData.transactionSearch.selectedModeList());
			self.transactionSearchcriteriaViewModel.selectedItemNumberList = pageRecord.SearchData.transactionSearch.selectedItemNumberList;

			self.soreportClick(pageRecord.SearchData.soreportClick);
			self.vbreportClick(pageRecord.SearchData.vbreportClick);
			self.inreportClick(pageRecord.SearchData.inreportClick);
			self.tqreportClick(pageRecord.SearchData.tqreportClick);
			if (pageRecord.SearchData.transactionSearch.searchType() === refEnums.Enums.TransactionSearchType.SalesOrder.ID) {
				if (refSystem.isObject(self.soGridOptions)) {
					self.soGridOptions.pagingOptions.pageSize(pageRecord.SearchData.soPageSize);
					self.soGridOptions.pagingOptions.currentPage(pageRecord.SearchData.soCurrentPage);
					self.sortCol(pageRecord.soData.SortCol);
					self.sorttype(pageRecord.soData.SortOrder);

					var list = pageRecord.soData.UserGridSetting.Filters;
					self.soSearchFilterItems.removeAll();
					if (list.length > 0 && list[0].FieldName) {
						list.forEach((items) => {
							self.soSearchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
								if (items.FieldNamed === 'BillDateDisplay') {
								self.soSearchFilterItem.FieldName = "BillDate";
							}
							else if (items.FieldName === 'PickupDateDisplay') {
								self.soSearchFilterItem.FieldName = "PickupDate";
							}
							else if (items.FieldName === 'ProcessStatusDisplay') {
								self.soSearchFilterItem.FieldName = "ProcessStatusDescription";
							}
							else if (items.FieldName === 'InvoiceStatusDisplay') {
								self.soSearchFilterItem.FieldName = "InvoiceStatusDescription";
							}
							self.soSearchFilterItem.FieldName = items.FieldName;
							self.soSearchFilterItem.Operand = items.Operand;
							self.soSearchFilterItem.SearchText = items.SearchText;
							self.soSearchFilterItems.push(self.soSearchFilterItem);
						});
						self.SalesOrderContainer.reportColumnFilter.addFilter(self.soSearchFilterItems);
						self.SalesOrderContainer.reportColumnFilter.isFilterApply = true;
						if (self.soSearchFilterItems.length > 0) {
							self.isSearchFilterItemsData(true);
						} else {
							self.isSearchFilterItemsData(false);
						}
					}
				}
				if (self.soreportClick()) {
					self.getSoReportData(self.soReportAction);
				}
			}
			else if (pageRecord.SearchData.transactionSearch.searchType() === refEnums.Enums.TransactionSearchType.Bills.ID) {
				if (refSystem.isObject(self.vbGridOptions)) {
					self.vbGridOptions.pagingOptions.pageSize(pageRecord.SearchData.vbPageSize);
					self.vbGridOptions.pagingOptions.currentPage(pageRecord.SearchData.vbCurrentPage);
					self.sortCol(pageRecord.vbData.SortCol);
					self.sorttype(pageRecord.vbData.SortOrder);
					var list = pageRecord.vbData.UserGridSetting.Filters;
					self.vbSearchFilterItems.removeAll();
					if (list.length > 0 && list[0].FieldName) {
						list.forEach((items) => {
							self.vbSearchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
					            if (items.FieldNamed === 'BillDateDisplay') {
								self.vbSearchFilterItem.FieldName = "BillDate";
							}
							else if (items.FieldName === 'PickupDateDisplay') {
								self.vbSearchFilterItem.FieldName = "PickupDate";
							}
							else if (items.FieldName === 'ProcessStatusDisplay') {
								self.vbSearchFilterItem.FieldName = "ProcessStatusDescription";
							}
							else if (items.FieldName === 'InvoiceStatusDisplay') {
								self.vbSearchFilterItem.FieldName = "InvoiceStatusDescription";
							}
							else if (items.FieldName === 'BillStatusDisplay') {
								self.vbSearchFilterItem.FieldName = "BillStatusDescription";
							}

							self.vbSearchFilterItem.FieldName = items.FieldName;
							self.vbSearchFilterItem.Operand = items.Operand;
							self.vbSearchFilterItem.SearchText = items.SearchText;
							self.vbSearchFilterItems.push(self.vbSearchFilterItem);
						});
						self.VendorBillOrPurchaseOrderContainer.reportColumnFilter.addFilter(self.vbSearchFilterItems);
						self.VendorBillOrPurchaseOrderContainer.reportColumnFilter.isFilterApply = true;
						if (self.vbSearchFilterItems.length > 0) {
							self.isSearchFilterItemsDataForVB(true);
						} else {
							self.isSearchFilterItemsDataForVB(false);
						}
					}
				}
				if (self.vbreportClick()) {
					self.getVbReportData(self.vbReportAction);
				}
			}
			else {
				if (refSystem.isObject(self.tqGridOptions)) {
					self.tqGridOptions.pagingOptions.pageSize(pageRecord.SearchData.tqPageSize);
					self.tqGridOptions.pagingOptions.currentPage(pageRecord.SearchData.tqCurrentPage);
					if (self.tqreportClick()) {
						self.getTqReportData(self.tqReportAction);
					}
				}
			}
		}
		window.kg.toggleSelection(false);
	}

	// assign the criteria values for search result
	private assignCriteriaValues() {
		var self = this;
		self.searchRequestParam.CustomerName = self.transactionSearchcriteriaViewModel.customerName();

		self.searchRequestParam.DateType = self.transactionSearchcriteriaViewModel.dateRangeSelectedOption();
		self.searchRequestParam.FromDate = self.transactionSearchcriteriaViewModel.fromDate();
		self.searchRequestParam.ToDate = self.transactionSearchcriteriaViewModel.toDate();
		if (self.searchType() === refEnums.Enums.TransactionSearchType.SalesOrder.ID) {
			self.searchRequestParam.PageSize = self.soGridOptions.pagingOptions.pageSize();
			self.searchRequestParam.PageNumber = self.soGridOptions.pagingOptions.currentPage();
		}
		else if (self.searchType() === refEnums.Enums.TransactionSearchType.Bills.ID) {
			self.searchRequestParam.PageSize = self.vbGridOptions.pagingOptions.pageSize();
			self.searchRequestParam.PageNumber = self.vbGridOptions.pagingOptions.currentPage();
		}
		else {
			self.searchRequestParam.PageSize = self.tqGridOptions.pagingOptions.pageSize();
			self.searchRequestParam.PageNumber = self.tqGridOptions.pagingOptions.currentPage();
		}

		self.searchRequestParam.TransactionSearchType = self.transactionSearchcriteriaViewModel.selectedtypeList() > 0 ? self.transactionSearchcriteriaViewModel.selectedtypeList() : 0;
		self.searchRequestParam.VendorName = self.transactionSearchcriteriaViewModel.vendorName() ? self.transactionSearchcriteriaViewModel.vendorName() : "";
		self.searchRequestParam.Amount = self.transactionSearchcriteriaViewModel.amount() > 0 ? $.number(self.transactionSearchcriteriaViewModel.amount(), 2) : -1;
		self.searchRequestParam.OrderStatus = self.transactionSearchcriteriaViewModel.selectedorderStatusList() > -1 ? self.transactionSearchcriteriaViewModel.selectedorderStatusList() : -1;
		self.searchRequestParam.BolNumber = self.transactionSearchcriteriaViewModel.bolNumber() ? self.transactionSearchcriteriaViewModel.bolNumber().trim() : "";
		self.searchRequestParam.ProNumber = self.transactionSearchcriteriaViewModel.proNumber() ? self.transactionSearchcriteriaViewModel.proNumber().trim() : "";
		self.searchRequestParam.ShipperCompanyName = self.transactionSearchcriteriaViewModel.shipperCompanyName() ? self.transactionSearchcriteriaViewModel.shipperCompanyName().trim() : "";
		self.searchRequestParam.ConsigneeCompanyName = self.transactionSearchcriteriaViewModel.consigneeCompanyName() ? self.transactionSearchcriteriaViewModel.consigneeCompanyName().trim() : "";
		self.searchRequestParam.ShipperZipCode = self.transactionSearchcriteriaViewModel.shipperZip() ? self.transactionSearchcriteriaViewModel.shipperZip().trim() : "";
		self.searchRequestParam.ConsigneeZipCode = self.transactionSearchcriteriaViewModel.consigneeZip() ? self.transactionSearchcriteriaViewModel.consigneeZip().trim() : "";
		self.searchRequestParam.PoNumber = self.transactionSearchcriteriaViewModel.poNumber() ? self.transactionSearchcriteriaViewModel.poNumber().trim() : "";
		self.searchRequestParam.ShipperCity = self.transactionSearchcriteriaViewModel.shipperCity() ? self.transactionSearchcriteriaViewModel.shipperCity().trim() : "";
		self.searchRequestParam.ConsigneeCity = self.transactionSearchcriteriaViewModel.consigneeCity() ? self.transactionSearchcriteriaViewModel.consigneeCity().trim() : "";
		self.searchRequestParam.SalesRepName = self.transactionSearchcriteriaViewModel.userName() ? self.transactionSearchcriteriaViewModel.userName().trim() : "";
		self.searchRequestParam.SalesRepId = self.transactionSearchcriteriaViewModel.userId() > 0 ? self.transactionSearchcriteriaViewModel.userId() : -1;
		self.searchRequestParam.CompanyName = self.searchRequestParam.TransactionSearchType === 0 && self.transactionSearchcriteriaViewModel.customerName() ? self.transactionSearchcriteriaViewModel.customerName() : "";
		self.searchRequestParam.CustomerBolNumber = self.transactionSearchcriteriaViewModel.customerBOLNumber() ? self.transactionSearchcriteriaViewModel.customerBOLNumber().trim() : "";
		self.searchRequestParam.SortCol = self.sortCol();
		self.searchRequestParam.SortOrder = self.sorttype();
		self.searchRequestParam.IsPurchaseOrder = refEnums.Enums.SearchTransactionType.Both;
		var items = $('#multiSelect').val(),
			selectedItems = '';

		selectedItems = self.transactionSearchcriteriaViewModel.selectedItemNumberList;
		self.searchRequestParam.ItemNumbers = selectedItems;
		self.searchRequestParam.TruckloadQuoteNumber = self.transactionSearchcriteriaViewModel.truckLoadQuoteNumber() ? self.transactionSearchcriteriaViewModel.truckLoadQuoteNumber() : '';
		self.searchRequestParam.InvoiceStatus = self.transactionSearchcriteriaViewModel.selectedInvoiceStatusList() > -1 ? self.transactionSearchcriteriaViewModel.selectedInvoiceStatusList() : -1;
		self.searchRequestParam.ReferenceNumber = self.transactionSearchcriteriaViewModel.refNumber() ? self.transactionSearchcriteriaViewModel.refNumber().trim() : "";
		self.searchRequestParam.TotalWeight = self.transactionSearchcriteriaViewModel.totalWeight() > 0 ? self.transactionSearchcriteriaViewModel.totalWeight() : -1;
		self.searchRequestParam.TotalPiece = self.transactionSearchcriteriaViewModel.totalPieces() > 0 ? self.transactionSearchcriteriaViewModel.totalPieces() : -1;
		if ((self.transactionSearchcriteriaViewModel.selectedModeList() && self.transactionSearchcriteriaViewModel.selectedModeList() !== -1 && self.transactionSearchcriteriaViewModel.selectedModeList() !== 12) || self.transactionSearchcriteriaViewModel.selectedModeList() === 0) { // -1 -> All, 12 -> SCM
			self.searchRequestParam.CarrierServiceMode = self.transactionSearchcriteriaViewModel.selectedModeList();
			self.searchRequestParam.NewShipmentType = -1;
		}
		else if (self.transactionSearchcriteriaViewModel.selectedModeList() && self.transactionSearchcriteriaViewModel.selectedModeList() === 12) {
			self.searchRequestParam.CarrierServiceMode = -1;
			self.searchRequestParam.NewShipmentType = 2;
		}
		else {
			self.searchRequestParam.CarrierServiceMode = -1;
			self.searchRequestParam.NewShipmentType = -1;
		}
	}

	public getCommaSeperatedItemNumbers() {
		var items = $('#multiSelect').val(),
			selectedItems = '';

		if (items) {
			for (var i = 0; i < items.length; i++) {
				selectedItems = selectedItems + items[i] + ",";
			}
		}
		return selectedItems;
	}

	private setFilter(newvalue: number) {
		var self = this;

		var pageRecord = LocalStorageController.Get(self.localStorageKey());
		if (pageRecord != null) {
			if (newvalue === refEnums.Enums.TransactionSearchType.Bills.ID) {
				self.vbGridOptions.pagingOptions.currentPage(pageRecord.SearchData.vbCurrentPage);
				self.vbGridOptions.pagingOptions.pageSize(pageRecord.vbData.UserGridSetting.PageSize);

				var list = pageRecord.vbData.UserGridSetting.Filters;
				self.vbSearchFilterItems.removeAll();
				if (list.length > 0 && list[0].FieldName) {
					list.forEach((items) => {
						self.vbSearchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						self.vbSearchFilterItem.FieldName = items.FieldName;
						self.vbSearchFilterItem.Operand = items.Operand;
						self.vbSearchFilterItem.SearchText = items.SearchText;
						self.vbSearchFilterItems.push(self.vbSearchFilterItem);
					});
					self.VendorBillOrPurchaseOrderContainer.reportColumnFilter.addFilter(self.vbSearchFilterItems);
					self.VendorBillOrPurchaseOrderContainer.reportColumnFilter.isFilterApply = true;
				}
				if (self.vbreportClick()) {
					self.getVbReportData(self.vbReportAction);
				}
			}
			else if (newvalue === refEnums.Enums.TransactionSearchType.SalesOrder.ID) {
				self.soGridOptions.pagingOptions.currentPage(pageRecord.SearchData.soCurrentPage);
				self.soGridOptions.pagingOptions.pageSize(pageRecord.soData.UserGridSetting.PageSize);

				var list = pageRecord.soData.UserGridSetting.Filters;
				self.soSearchFilterItems.removeAll();
				if (list.length > 0 && list[0].FieldName) {
					list.forEach((items) => {
						self.soSearchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						self.soSearchFilterItem.FieldName = items.FieldName;
						self.soSearchFilterItem.Operand = items.Operand;
						self.soSearchFilterItem.SearchText = items.SearchText;
						self.soSearchFilterItems.push(self.soSearchFilterItem);
					});
					self.SalesOrderContainer.reportColumnFilter.addFilter(self.soSearchFilterItems);
					self.SalesOrderContainer.reportColumnFilter.isFilterApply = true;
				}
				if (self.soreportClick()) {
					self.getSoReportData(self.soReportAction);
				}
			}
		}
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
		self.cleanup();
		document.onkeypress = undefined;
	}

	public cleanup() {
		var self = this;

		self.transactionSearchcriteriaViewModel.cleanup();
	}

	public fillLocalStorage() {
		var self = this;
		var vbCurrentPage = 1;
		var soCurrentPage = 1;
		if (self.vbGridOptions.pagingOptions.currentPage() !== undefined) {
			vbCurrentPage = self.vbGridOptions.pagingOptions.currentPage()
		}
		if (self.soGridOptions.pagingOptions.currentPage() !== undefined) {
			soCurrentPage = self.soGridOptions.pagingOptions.currentPage()
		}
		var data = {
			isSalesOrder: self.searchType(),
			transactionSearch: self.transactionSearchcriteriaViewModel,
			soPageSize: self.soGridOptions.pagingOptions.pageSize(),
			soCurrentPage: soCurrentPage,
			vbPageSize: self.vbGridOptions.pagingOptions.pageSize(),
			vbCurrentPage: vbCurrentPage,
			tqPageSize: self.tqGridOptions.pagingOptions.pageSize(),
			tqCurrentPage: self.tqGridOptions.pagingOptions.currentPage(),
			soreportClick: self.soreportClick(),
			vbreportClick: self.vbreportClick(),
			inreportClick: self.inreportClick(),
			tqreportClick: self.tqreportClick()
		}

		var sosaveData = { PageSize: self.soGridOptions.pagingOptions.pageSize(), Filters: self.soSearchFilterItems }

		var sofilterDataToSave = { UserGridSetting: sosaveData, GridViewId: refEnums.Enums.FilterViewName.TransactionSearchSalesOrder, IsFilterApplied: self.SalesOrderContainer.reportColumnFilter.isFilterApply, GridSearchText: null, PageNo: self.soGridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), View: "SO" };
		var vbsaveData = { PageSize: self.vbGridOptions.pagingOptions.pageSize(), Filters: self.vbSearchFilterItems }
		    var vbfilterDataToSave = { UserGridSetting: vbsaveData, GridViewId: refEnums.Enums.FilterViewName.TransactionSearchBill, IsFilterApplied: self.VendorBillOrPurchaseOrderContainer.reportColumnFilter.isFilterApply, GridSearchText: null, PageNo: self.vbGridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), View: "Bills" };

		var filterDataToSave = { soData: sofilterDataToSave, vbData: vbfilterDataToSave, SearchData: data }

		LocalStorageController.Set(self.localStorageKey(), filterDataToSave);
	}

	public beforeBind() {
		var self = this;
		self.load();
	}

	public compositionComplete() {
		var self = this;
		//Check if data is in local storage then open serach result
		if (LocalStorageController.Get(self.localStorageKey())) {
			self.collapseView('collapseTransactionSearch');
			self.expandView('collapseSearchResults');
		}
		else {
			$('#collapseSearchResults').css("overflow", "hidden");
			self.collapseView('collapseSearchResults');
			self.expandView('collapseTransactionSearch');
		}
	}
	//#endregion
}

return TransactionSearchViewModel;