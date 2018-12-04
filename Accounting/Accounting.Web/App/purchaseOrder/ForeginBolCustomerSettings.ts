/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import _reportViewer = require('../templates/reportViewerControlV2');
import refpurchaseOrderClient = require('services/client/PurchaseOrderClient');
import refCustomerSearchControl = require('templates/searchCustomerAutoComplete');
import refCustomerSearchModel = require('services/models/common/searchCustomerName');
import refForeignBolSettings = require('services/models/purchaseOrder/ForeignBolSettings');
import refForeignBolAddresses = require('services/models/purchaseOrder/ForeignBolAddress');
import refForeignBolAddressesContainer = require('services/models/purchaseOrder/ForeignBolAddressesContainer');
import refForeignBolOptionButtonControl = require('templates/ForeignBolOptionButtons');
import refEnums = require('services/models/common/Enums');
import refVendorBillClient = require('services/client/VendorBillClient');
import _refPurchaseOrderSearchFilterModel = require('services/models/purchaseOrder/PurchaseOrderSearchFilter');
import refValidations = require('services/validations/Validations');
import refCommonClient = require('services/client/CommonClient');
//#endregion

/*
** <summary>
**Company Settings ViewModel.
** </summary>
** <createDetails>
** <id>US16253</id><by>Satish</by> <date>21st April, 2015</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by> <date></date>
** </changeHistory>
*/

export class ForeignBolCustomerSettingsViewModel {
	//#region Members

	//#region General Members
	customerName: KnockoutComputed<string>;
	customerId: KnockoutComputed<number>;
	selectedCustomerName: KnockoutObservable<string> = ko.observable('');
	selectedCustomerId: KnockoutObservable<number> = ko.observable(0);
	customerDisplay: KnockoutObservable<string> = ko.observable('');
	customerSearchList: refCustomerSearchControl.SearchCustomerAutoComplete;
	purchaseOrderClient: refpurchaseOrderClient.PurchaseOrderClient = new refpurchaseOrderClient.PurchaseOrderClient();
	foreignBolCustomerAddresses: KnockoutObservableArray<ForeignBolCustomerAddress> = ko.observableArray([]);
	obcOptionButtonsList: refForeignBolOptionButtonControl.ForeignBolOptionalButtonsViewModel;
	bolCharacters: KnockoutObservable<number> = ko.observable(0);
	isEdiBolLengthMapped: KnockoutObservable<boolean> = ko.observable(false);
	updatedDate: KnockoutObservable<number> = ko.observable(0);
	listProgressSettings: KnockoutObservable<boolean> = ko.observable(false);
	listProgress: KnockoutObservable<boolean> = ko.observable(false);
	errorDetail: KnockoutValidationGroup;
	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	private checkMsgDisplay: boolean = true;
	isProceedToLoadScreen1: KnockoutObservable<boolean> = ko.observable(true);
	// to enable or disable change detection
	isChange = true;
	isCheckBoxChange = false;
	//#endregion

	//#region Screen 1 Report Viewer Members
	public ForeignBolCustomersContainer: _reportViewer.ReportViewerControlV2 = null;

	public foreignBolHeader: _reportViewer.ReportHeaderOption = null;

	public foreignBolGrid: _reportViewer.ReportGridOption = null;

	public foreignBolReportAction: _reportViewer.ReportAction = null;

	public foreignBolData: KnockoutObservableArray<any> = null;

	public setForeignBolReportCriteria: (soReportAction: _reportViewer.ReportAction) => any;

	public foreignBolGridOptions: any;

	public getForeignBolReportData: (soReportAction: _reportViewer.ReportAction) => any;

	searchText: KnockoutObservable<string> = ko.observable("");
	//#endregion

	//#region Screen 2 Report Viewer Members
	public ForeignBolCustomerSettingsContainer: _reportViewer.ReportViewerControlV2 = null;

	public foreignBolCustomerSettingsHeader: _reportViewer.ReportHeaderOption = null;

	public foreignBolCustomerSettingsGrid: _reportViewer.ReportGridOption = null;

	public foreignBolCustomerSettingsReportAction: _reportViewer.ReportAction = null;

	public foreignBolCustomerSettingsData: KnockoutObservableArray<any> = null;

	public setForeignBolCustomerSettingsReportCriteria: (soReportAction: _reportViewer.ReportAction) => any;

	public foreignBolCustomerSettingsGridOptions: any;

	public getForeignBolCustomerSettingsReportData: (soReportAction: _reportViewer.ReportAction) => any;

	// refresh page
	currentDateTime: KnockoutObservable<string> = ko.observable('');
	localStorageKey: KnockoutObservable<string> = ko.observable('');
	commonUtils: CommonStatic = new Utils.Common();

	sortCol: KnockoutObservable<string> = ko.observable('');
	sorttype: KnockoutObservable<string> = ko.observable('');
	private foreignBolCustomerSettingsSearchText: KnockoutObservable<string> = ko.observable("");
	searchFilterItems: Array<IPurchaseOrderSearchFilter> = new Array<_refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter>();
	searchAddressFilterItems: Array<IPurchaseOrderSearchFilter> = new Array<_refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter>();
	searchFilterItem: IPurchaseOrderSearchFilter = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
	isSearchFilterItemsData: KnockoutObservable<boolean> = ko.observable(false);
	isSearchFilterItemsDataAddressGrid: KnockoutObservable<boolean> = ko.observable(false);
	fromLocalStorage: KnockoutObservable<boolean> = ko.observable(false);
	isLoaded: KnockoutObservable<boolean> = ko.observable(false);
	//for tracking change
	getTrackChange: () => string[];
	isDirty: KnockoutComputed<boolean>;
	isNotAtLoadingTime: boolean = false;
	commonClientCommand: refCommonClient.Common = new refCommonClient.Common();
	//#endregion

	//#endregion

	//#region Constructor
	constructor() {
		var self = this;

		//#region Google Msg Handling
		//To check if Msg is clicked
		self.checkMsgClick = () => {
			self.checkMsgDisplay = true;
		}

	   // to Check if Msg is hidden or closed
		self.checkMsgHide = () => {
			self.checkMsgDisplay = true;
		}

		//set local storage key by url
		var url = $(location).attr('href');
		var urlArray = url.split('/');
		var localStorageId = urlArray.pop().toString().replace(/#/g, "");
		self.localStorageKey(localStorageId);
		if (localStorageId === "CompanyMappingSettings") {
			self.localStorageKey(localStorageId + "25");
		} else {
			self.localStorageKey(localStorageId);
		}

		//#endregion

		//#region Customer Selection
		// Customer Search List Initialization
		self.customerSearchList = new refCustomerSearchControl.SearchCustomerAutoComplete("", null, '220px', '', true);

		// get selected customer Name and customer id
		self.customerId = ko.computed(() => {
			if (self.customerSearchList.name() != null) {
				return self.customerSearchList.id();
			}

			return 0;
		});

		self.customerName = ko.computed(() => {
			if (self.customerSearchList.name() != null)
				return self.customerSearchList.customerName();

			return null;
		});

		//#region Error Details Object
		self.errorDetail = ko.validatedObservable({
			customerSearchList: self.customerSearchList,
			bolCharacters: self.bolCharacters
		});

		//#region Change Detection
		//track changes
		self.setTrackChange(self);

		self.getTrackChange = () => Utils.getDirtyItems(this);
		self.isDirty = ko.computed(() => {
			var result = self.bolCharacters();
			// If this from loading data side the return as false
			if (self.isNotAtLoadingTime)
				return false;
			var returnValue = self.getTrackChange().length > 0 ? true : false;
			//self.isCheckBoxChange = returnValue;
			//_app.trigger("IsBIDirtyChange", returnValue);
			return returnValue;
		});
		//#endregion
		//#endregion

		//#region Screen 1 Report Viewer
		self.foreignBolHeader = new _reportViewer.ReportHeaderOption();
		self.foreignBolHeader.reportHeader = " ";
		self.foreignBolHeader.reportName = "Foreign Bol Customers";
		self.foreignBolHeader.gridTitleHeader = " ";

		//## Region Export Options.
		var exportOpt = ko.observableArray([
			{ exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
			{ exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) },
			{ exportType: _reportViewer.ExportOptions.FILTER, name: ko.observable(""), enabled: ko.observable(true), index: 0 }
		]);
		self.foreignBolHeader.reportExportOptions = new _reportViewer.ReportExportControl(exportOpt);
		self.foreignBolHeader.reportExportOptions.getUrl = function (exp: _reportViewer.IExportOptions): any {
			var searchClientData = new refVendorBillClient.SearchModel();
			searchClientData.SearchValue = self.searchText().trim();
			searchClientData.SortOrder = self.sorttype();
			searchClientData.SortCol = self.sortCol();
			searchClientData.PageNumber = 1;
			searchClientData.PageSize = exp.exportType === 1 ? 2000 : self.foreignBolGridOptions.pagingOptions.totalServerItems();

			var list = self.ForeignBolCustomersContainer.reportColumnFilter.reportColumnFilters();

			self.searchFilterItems.removeAll();

			if (list.length > 0) {
				list.forEach((items) => {
					self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						if (items.selectedserviceType() != undefined && items.selectedOperatorType() != undefined) {
						self.searchFilterItem.SearchText = items.searchText();

						if (items.selectedserviceType().field === 'Criteria') {
							self.searchFilterItem.SearchText = "True";
							if (items.searchText() === "Edi Bol Mapped") {
								self.searchFilterItem.FieldName = "IsEdiBolMapped";
							}
							else if (items.searchText() === "Bill To Address Mapped") {
								self.searchFilterItem.FieldName = "IsBillToAddressMapped";
							}
							else if (items.searchText() === "Shipper Consignee Address Mapped") {
								self.searchFilterItem.FieldName = "IsShipperConsigneeAddressMapped";
							}
						}
						else {
							self.searchFilterItem.FieldName = items.selectedserviceType().field;
						}

						self.searchFilterItem.Operand = +items.selectedOperatorType().opratorId;

						self.searchFilterItems.push(self.searchFilterItem);
					}
				});
			}

			searchClientData.SearchFilterItems = self.searchFilterItems;
			searchClientData.GridViewId = 14;
			searchClientData.VendorName = '';
			searchClientData.ProNumber = '';
			searchClientData.ExportType = exp.exportType;
			//searchClientData.CustomerId = self.selectedCustomerId();
			var filterModel = { ExportURL: "Accounting/ExportForeignBolCustomerInExcelWithFilter", FilterModel: searchClientData };
			return filterModel;
		}
			//## Region Export Options End.

			//initialize date filters
			self.foreignBolReportAction = new _reportViewer.ReportAction();

		self.foreignBolGrid = self.setForeignBolGridOptions(self);

		self.setForeignBolReportCriteria = function (reportActionObj: _reportViewer.ReportAction) {
			if (self.foreignBolReportAction != null) {
			}
			//self.foreignBolCustomerSettingsReportAction = reportActionObj;
			//self.getForeignBolCustomerSettingsReportData(self.foreignBolCustomerSettingsReportAction);

			if ((reportActionObj != undefined || reportActionObj != null) && (reportActionObj.gridOptions != undefined || reportActionObj.gridOptions != null) && (refSystem.isObject(reportActionObj.gridOptions.sortInfo())) && (reportActionObj.gridOptions.sortInfo().column != undefined || reportActionObj.gridOptions.sortInfo().column != null) && (reportActionObj.gridOptions.sortInfo().column.field != undefined || reportActionObj.gridOptions.sortInfo().column.field != null)) {
				if (reportActionObj.gridOptions.sortInfo().column.field === 'Criteria') {
					self.sortCol("CustomerId");
				}
				else if (reportActionObj.gridOptions.sortInfo().column.field === 'delete') {
					self.sortCol("CustomerId");
				}
				else {
					self.sortCol(reportActionObj.gridOptions.sortInfo().column.field);
				}
				self.sorttype(reportActionObj.gridOptions.sortInfo().direction);
			}
			else {
				self.sortCol("CustomerId");
				self.sorttype("desc");
			}
			self.foreignBolGridOptions = reportActionObj.gridOptions;
			self.getForeignBolReportData(reportActionObj);
		};

		self.getForeignBolReportData = function (reportActionObj: _reportViewer.ReportAction) {
			var deferred = $.Deferred();
			var promise = deferred.promise();
			var pageno = 0;
			// List View
			if (self.sortCol() === "Street" || self.sortCol() === "Street2" || self.sortCol() === "StateCode" || self.sortCol() === "AddressType" || self.sortCol() === "companyName" || self.sortCol() === "city" || self.sortCol() === "zipCode") {
				self.sortCol("CustomerId");
				self.sorttype("desc");
			}

			pageno = Number(self.foreignBolGridOptions.pagingOptions.currentPage());
			if (pageno > 0) {
				self.ForeignBolCustomersContainer.listProgress(true);

				if (self.ForeignBolCustomersContainer.reportColumnFilter.isFilterApply) {
					self.searchText('');
					self.foreignBolGridOptions.filterOptions.filterText('');
				}

				var list = self.ForeignBolCustomersContainer.reportColumnFilter.reportColumnFilters();
				self.searchFilterItems.removeAll();

				if (list.length > 0) {
					list.forEach((items) => {
						self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						if (items.selectedserviceType() != undefined && items.selectedOperatorType() != undefined) {
							self.searchFilterItem.SearchText = items.searchText();

							if (items.selectedserviceType().field === 'Criteria') {
								self.searchFilterItem.SearchText = "True";
								if (items.searchText() === "Edi Bol Mapped") {
									self.searchFilterItem.FieldName = "IsEdiBolMapped";
								}
								else if (items.searchText() === "Bill To Address Mapped") {
									self.searchFilterItem.FieldName = "IsBillToAddressMapped";
								}
								else if (items.searchText() === "Shipper Consignee Address Mapped") {
									self.searchFilterItem.FieldName = "IsShipperConsigneeAddressMapped";
								}
							}
							else {
								self.searchFilterItem.FieldName = items.selectedserviceType().field;
							}

							self.searchFilterItem.Operand = +items.selectedOperatorType().opratorId;

							self.searchFilterItems.push(self.searchFilterItem);
						}
						if (self.searchFilterItems.length > 0 || items.selectedserviceType() != undefined) {
							self.isSearchFilterItemsData(true);
							//self.isSearchFilterItemsDataAddressGrid(true);
							//$('#gridPORexnordBoard').addClass('margin-top--36');
						} else {
							self.isSearchFilterItemsData(false);
							//self.isSearchFilterItemsDataAddressGrid(false);
							//$('#gridPORexnordBoard').removeClass('margin-top--36');
						}
					});
				}

				var saveData = { PageSize: self.foreignBolGridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems };

				var filterData = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.ForeignBolCustomer, IsFilterApplied: self.ForeignBolCustomersContainer.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.foreignBolGridOptions.pagingOptions.currentPage(), PageSize: self.foreignBolGridOptions.pagingOptions.pageSize(), SortCol: self.sortCol(), SortOrder: self.sorttype(), FromLocalStorage: self.fromLocalStorage() };

				self.purchaseOrderClient.getForeignBolCustomers(filterData,
					function (data) {
						self.setCustomersPagingData(data.CustomerList, data.TotalRowCount, self.foreignBolGridOptions.pagingOptions.pageSize());
						self.ForeignBolCustomersContainer.listProgress(false);
						//	self.ForeignBolCustomerSettingsContainer.invokeHighlight(self.searchText());
						deferred.resolve(data, reportActionObj.view);
					},
					function () {
						self.ForeignBolCustomersContainer.listProgress(false);
					});
			}

			//self.ForeignBolCustomerSettingsContainer.onSearchTextChange = function (reportViewer, newSearchValue) {
			//	if (newSearchValue.length >= 3 || newSearchValue.length == 0) {
			//		self.foreignBolCustomerSettingsSearchText(newSearchValue);
			//		self.foreignBolCustomerSettingsGridOptions.pagingOptions.currentPage(1);
			//	}
			//};

			return promise;
		};

		self.ForeignBolCustomersContainer = new _reportViewer.ReportViewerControlV2(self.foreignBolHeader, self.foreignBolGrid);

		self.ForeignBolCustomersContainer.onFilterChange = self.setForeignBolReportCriteria;
		self.ForeignBolCustomersContainer.ForceChange();

		self.ForeignBolCustomersContainer.onSearchTextChange = (reportViewer, newSearchValue) => {
			if (newSearchValue.length >= 3 || newSearchValue.length == 0) {
				//var data: Array<IPurchaseOrderBoard> = new Array<_refPurchaseOrderBoardDataModel.Models.PurchaseOrderBoard>();
				var searchString = newSearchValue;
				//to blank the grid data
				//self.setCustomersPagingData(data, 0, self.foreignBolGridOptions.pagingOptions.pageSize());

				self.searchText(searchString.trim());
				if (!self.ForeignBolCustomersContainer.reportColumnFilter.isFilterApply) {
					self.ForeignBolCustomersContainer.reportColumnFilter.clearAll();
				}
				self.ForeignBolCustomersContainer.reportColumnFilter.isFilterApply = false;

				self.getForeignBolReportData(self.foreignBolReportAction);
				self.foreignBolGridOptions.pagingOptions.currentPage(1);
			}
		};
		//#endregion

		//#region Screen 2 Report Viewer
		self.foreignBolCustomerSettingsHeader = new _reportViewer.ReportHeaderOption();
		self.foreignBolCustomerSettingsHeader.reportHeader = " ";
		self.foreignBolCustomerSettingsHeader.reportName = "Foreign Bol Customer Settings";
		self.foreignBolCustomerSettingsHeader.gridTitleHeader = " ";

		//## Region Export Options.
		var exportOpt = ko.observableArray([
			{ exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
			{ exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) },
			{ exportType: _reportViewer.ExportOptions.FILTER, name: ko.observable(""), enabled: ko.observable(true), index: 1 }
		]);

		self.foreignBolCustomerSettingsHeader.reportExportOptions = new _reportViewer.ReportExportControl(exportOpt);

		self.foreignBolCustomerSettingsHeader.reportExportOptions.getUrl = function (exp: _reportViewer.IExportOptions): any {
			var searchClient = new refVendorBillClient.SearchModel();
			searchClient.SearchValue = self.foreignBolCustomerSettingsSearchText().trim();
			searchClient.SortOrder = self.sorttype();
			searchClient.SortCol = self.sortCol();
			searchClient.PageNumber = 1;
			searchClient.PageSize = exp.exportType === 1 ? 2000 : self.foreignBolCustomerSettingsGridOptions.pagingOptions.totalServerItems();

			searchClient.SearchFilterItems = self.searchAddressFilterItems;
			searchClient.GridViewId = 13;
			searchClient.VendorName = '';
			searchClient.ProNumber = '';
			searchClient.ExportType = exp.exportType;
			searchClient.CustomerId = self.selectedCustomerId();
			var filterModel = { ExportURL: "Accounting/ExportForeignBolCustomerSettingsInExcelWithFilter", FilterModel: searchClient };
			return filterModel;
		}
		//## Region Export Options End.

		self.foreignBolCustomerSettingsReportAction = new _reportViewer.ReportAction();

		self.foreignBolCustomerSettingsGrid = self.setForeignBolCustomerSettingsGridOptions(self);

		self.setForeignBolCustomerSettingsReportCriteria = function (reportActionObj: _reportViewer.ReportAction) {
			if (self.foreignBolCustomerSettingsReportAction != null) {
			}
			//self.foreignBolCustomerSettingsReportAction = reportActionObj;
			//self.getForeignBolCustomerSettingsReportData(self.foreignBolCustomerSettingsReportAction);

			if ((reportActionObj != undefined || reportActionObj != null) && (reportActionObj.gridOptions != undefined || reportActionObj.gridOptions != null) && (refSystem.isObject(reportActionObj.gridOptions.sortInfo())) && (reportActionObj.gridOptions.sortInfo().column != undefined || reportActionObj.gridOptions.sortInfo().column != null) && (reportActionObj.gridOptions.sortInfo().column.field != undefined || reportActionObj.gridOptions.sortInfo().column.field != null)) {
				if (reportActionObj.gridOptions.sortInfo().column.field === 'address') {
					self.sortCol("Street");
				}
				else if (reportActionObj.gridOptions.sortInfo().column.field === 'address_2') {
					self.sortCol("Street2");
				}
				else if (reportActionObj.gridOptions.sortInfo().column.field === 'state') {
					self.sortCol("StateCode");
				}
				else if (reportActionObj.gridOptions.sortInfo().column.field === 'typeLabel') {
					self.sortCol("AddressType");
				}
				else if (reportActionObj.gridOptions.sortInfo().column.field === 'edit') {
					self.sortCol("CustomerId");
				}
				else {
					self.sortCol(reportActionObj.gridOptions.sortInfo().column.field);
				}
				self.sorttype(reportActionObj.gridOptions.sortInfo().direction);
			}
			else {
				self.sortCol("CreatedDate");
				self.sorttype("asc");
			}
			self.foreignBolCustomerSettingsGridOptions = reportActionObj.gridOptions;
			//self.getReportData(reportActionObj);
			// Flag is added to restrict multiple service calls.
			if (self.isLoaded()) {
				self.getForeignBolCustomerSettingsReportData(reportActionObj);
			}
		};

		self.getForeignBolCustomerSettingsReportData = function (reportActionObj: _reportViewer.ReportAction) {
			var deferred = $.Deferred();
			var promise = deferred.promise();
			var pageno = 0;
			// List View
			pageno = Number(self.foreignBolCustomerSettingsGridOptions.pagingOptions.currentPage());
			if (pageno > 0) {
				self.ForeignBolCustomerSettingsContainer.listProgress(true);

				if (self.ForeignBolCustomerSettingsContainer.reportColumnFilter.isFilterApply) {
					self.foreignBolCustomerSettingsSearchText('');
					self.foreignBolCustomerSettingsGridOptions.filterOptions.filterText('');
				}

				var list = self.ForeignBolCustomerSettingsContainer.reportColumnFilter.reportColumnFilters();
				self.searchAddressFilterItems.removeAll();

				if (list.length > 0) {
					list.forEach((items) => {
						self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						if (items.selectedserviceType() != undefined && items.selectedOperatorType() != undefined) {
							self.searchFilterItem.SearchText = items.searchText();

							if (items.selectedserviceType().field === 'typeLabel') {
								self.searchFilterItem.FieldName = "AddressType";
								if (items.searchText() === "Shipper/Consignee") {
									self.searchFilterItem.SearchText = "1";
								}
								else if (items.searchText() === "Bill To") {
									self.searchFilterItem.SearchText = "2";
								}
							}
							else if (items.selectedserviceType().field === 'address') {
								self.searchFilterItem.FieldName = "Street";
							}
							else if (items.selectedserviceType().field === 'address_2') {
								self.searchFilterItem.FieldName = "Street2";
							}
							else if (items.selectedserviceType().field === 'state') {
								self.searchFilterItem.FieldName = "StateCode";
							}
							else {
								self.searchFilterItem.FieldName = items.selectedserviceType().field;
							}

							self.searchFilterItem.Operand = +items.selectedOperatorType().opratorId;

							self.searchAddressFilterItems.push(self.searchFilterItem);
						}
						if (self.searchAddressFilterItems.length > 0 || items.selectedserviceType() != undefined) {
							self.isSearchFilterItemsData(true);
							self.isSearchFilterItemsDataAddressGrid(true);
							//$('#gridPORexnordBoard').addClass('margin-top--36');
						} else {
							self.isSearchFilterItemsData(false);
							self.isSearchFilterItemsDataAddressGrid(false);
							//$('#gridPORexnordBoard').removeClass('margin-top--36');
						}
					});
				}

				//if (!LocalStorageController.Get(self.localStorageKey() + "_foreignBol")) {
				var saveData = { PageSize: self.foreignBolCustomerSettingsGridOptions.pagingOptions.pageSize(), Filters: self.searchAddressFilterItems };
				var userSpecificParams = { CustomerId: self.selectedCustomerId() };
				var filterData = { CustomerId: self.selectedCustomerId(), UserSpecificParams: userSpecificParams, UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.ForeignBolAddress, IsFilterApplied: self.ForeignBolCustomerSettingsContainer.reportColumnFilter.isFilterApply, GridSearchText: self.foreignBolCustomerSettingsSearchText(), PageNo: self.foreignBolCustomerSettingsGridOptions.pagingOptions.currentPage(), PageSize: self.foreignBolCustomerSettingsGridOptions.pagingOptions.pageSize(), SortCol: self.sortCol(), SortOrder: self.sorttype(), FromLocalStorage: self.fromLocalStorage() };

				self.purchaseOrderClient.getForeignBolCustomerSettings(filterData,
					function (data) {
						self.initializeForeignBolAddress(data.ForeignBolAddressList, data.TotalRowCount, self.foreignBolCustomerSettingsGridOptions.pagingOptions.pageSize());
						self.ForeignBolCustomerSettingsContainer.listProgress(false);
						self.isLoaded(true);
						//	self.ForeignBolCustomerSettingsContainer.invokeHighlight(self.searchText());
						deferred.resolve(data, reportActionObj.view);
					},
					function () {
						self.ForeignBolCustomerSettingsContainer.listProgress(false);
					});
				//} else {
				//	self.ForeignBolCustomerSettingsContainer.listProgress(false);
				//}
			}

			//self.ForeignBolCustomerSettingsContainer.onSearchTextChange = function (reportViewer, newSearchValue) {
			//	if (newSearchValue.length >= 3 || newSearchValue.length == 0) {
			//		self.foreignBolCustomerSettingsSearchText(newSearchValue);
			//		self.foreignBolCustomerSettingsGridOptions.pagingOptions.currentPage(1);
			//	}
			//};

			return promise;
		};

		self.ForeignBolCustomerSettingsContainer = new _reportViewer.ReportViewerControlV2(self.foreignBolCustomerSettingsHeader, self.foreignBolCustomerSettingsGrid);

		self.ForeignBolCustomerSettingsContainer.onFilterChange = self.setForeignBolCustomerSettingsReportCriteria;
		self.ForeignBolCustomerSettingsContainer.ForceChange();

		self.ForeignBolCustomerSettingsContainer.onSearchTextChange = (reportViewer, newSearchValue) => {
			if (newSearchValue.length >= 3 || newSearchValue.length == 0) {
				//var data: Array<IPurchaseOrderBoard> = new Array<_refPurchaseOrderBoardDataModel.Models.PurchaseOrderBoard>();
				var searchString = newSearchValue;
				//to blank the grid data
				//self.setCustomersPagingData(data, 0, self.foreignBolGridOptions.pagingOptions.pageSize());

				self.foreignBolCustomerSettingsSearchText(searchString.trim());
				if (!self.ForeignBolCustomerSettingsContainer.reportColumnFilter.isFilterApply) {
					self.ForeignBolCustomerSettingsContainer.reportColumnFilter.clearAll();
				}
				self.ForeignBolCustomerSettingsContainer.reportColumnFilter.isFilterApply = false;

				self.getForeignBolCustomerSettingsReportData(self.foreignBolReportAction);
				self.foreignBolCustomerSettingsGridOptions.pagingOptions.currentPage(1);
			}
		};
		//#endregion

		//#region Option Buttons region
		//To set the checkbox bill option values
		var foreignBolOptionListOptions: Array<IButtonControlOption> = [{ id: refEnums.Enums.ForeignBolOptionConstant.ShipperConsigneeAddress, name: 'Shipper/Consignee Address', selected: false }, { id: refEnums.Enums.ForeignBolOptionConstant.BillToAddress, name: 'Bill to Address', selected: false }, { id: refEnums.Enums.ForeignBolOptionConstant.BOLStartsWithCharacter, name: 'BOL Starts with Character', selected: false }, { id: refEnums.Enums.ForeignBolOptionConstant.EDIBOLLength, name: 'EDI BOL# Length', selected: false }];

		//set checkbox property
		var argsForeignBolOptionList: IOptionButtonControlArgs = {
			options: foreignBolOptionListOptions,
			useHtmlBinding: true,
			isMultiCheck: true,
			isVerticalView: false
		}

		self.obcOptionButtonsList = new refForeignBolOptionButtonControl.ForeignBolOptionalButtonsViewModel(argsForeignBolOptionList, refEnums.Enums.OptionButtonsView.Horizontal, (flag) => {
			self.isEdiBolLengthMapped(flag);
			if (!flag) {
				self.bolCharacters(null);
			}
			else {
				//self.isCheckBoxChange = true;
				//_app.trigger("IsBIDirtyChange", self.isCheckBoxChange);
			}
		});
		//#endregion

		//#region Grid Click Events
		// redirects to purchase order edit details page
		self.ForeignBolCustomersContainer.onGridColumnClick = obj => {
			var customerId = obj.CustomerId;
			self.sortCol('CustomerId');
			self.sorttype('desc');

			var list = self.ForeignBolCustomerSettingsContainer.reportColumnFilter.reportColumnFilters();
			self.searchAddressFilterItems.removeAll();

			if (list.length > 0) {
				list.forEach((items) => {
					self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						if (items.selectedserviceType() != undefined && items.selectedOperatorType() != undefined) {
						self.searchFilterItem.SearchText = items.searchText();

						if (items.selectedserviceType().field === 'typeLabel') {
							self.searchFilterItem.FieldName = "AddressType";
							if (items.searchText() === "Shipper/Consignee") {
								self.searchFilterItem.SearchText = "1";
							}
							else if (items.searchText() === "Bill To") {
								self.searchFilterItem.SearchText = "2";
							}
						}
						else if (items.selectedserviceType().field === 'address') {
							self.searchFilterItem.FieldName = "Street";
						}
						else if (items.selectedserviceType().field === 'address_2') {
							self.searchFilterItem.FieldName = "Street2";
						}
						else if (items.selectedserviceType().field === 'state') {
							self.searchFilterItem.FieldName = "StateCode";
						}
						else {
							self.searchFilterItem.FieldName = items.selectedserviceType().field;
						}

						self.searchFilterItem.Operand = +items.selectedOperatorType().opratorId;

						self.searchAddressFilterItems.push(self.searchFilterItem);
					}
					if (self.searchFilterItems.length > 0 || items.selectedserviceType() != undefined) {
						self.isSearchFilterItemsData(true);
						self.isSearchFilterItemsDataAddressGrid(true);
					} else {
						self.isSearchFilterItemsData(false);
						self.isSearchFilterItemsDataAddressGrid(false);
					}
				});
			}

			var saveData = { PageSize: self.foreignBolCustomerSettingsGridOptions.pagingOptions.pageSize(), Filters: self.searchAddressFilterItems }
			var userSpecificParams = { CustomerId: customerId };
			var filterData = { CustomerId: customerId, UserGridSetting: saveData, UserSpecificParams: userSpecificParams, GridViewId: refEnums.Enums.FilterViewName.ForeignBolAddress, IsFilterApplied: self.ForeignBolCustomerSettingsContainer.reportColumnFilter.isFilterApply, GridSearchText: self.foreignBolCustomerSettingsSearchText(), PageNo: self.foreignBolCustomerSettingsGridOptions.pagingOptions.currentPage(), PageSize: self.foreignBolCustomerSettingsGridOptions.pagingOptions.pageSize(), SortCol: self.sortCol(), SortOrder: self.sorttype(), FromLocalStorage: true };

			//var parameters = { PageSize: self.foreignBolCustomerSettingsGridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems };
			//var userSpecificParams = { CustomerId: customerId };
			//var filterData = { UserGridSetting: parameters, PageNo: 1, PageSize: 10, UserSpecificParams: userSpecificParams };

			self.getBolCustomerSettings(filterData);
		}

		self.ForeignBolCustomersContainer.onDeleteClick = obj => {
			self.ForeignBolCustomersContainer.listProgress(true);
			if (obj.CustomerId > 0) {
				if (self.checkMsgDisplay) {
					self.checkMsgDisplay = false;
					var actionButtons: Array<IToastrActionButtonOptions> = [];
					actionButtons.push({
						actionButtonName: "Yes",
						actionClick: () => {
							self.purchaseOrderClient.deleteForeignBolCustomer(obj.CustomerId, (result) => {
								self.ForeignBolCustomerSettingsContainer.listProgress(false);
								if (result) {
									self.getForeignBolReportData(self.foreignBolReportAction);
								}
							},
								() => { self.ForeignBolCustomersContainer.listProgress(false); });
						}
					});

					actionButtons.push({
						actionButtonName: "No",
						actionClick: () => {
							self.ForeignBolCustomersContainer.listProgress(false);
						}
					});
					var toastrOptions1: IToastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 0,
						fadeOut: 0,
						typeOfAlert: "",
						title: "",
						actionButtons: actionButtons
					};

					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.AreYouSureWantToDisassociateForeignBolCustomer, "warning", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
				}
			}
			else {
				self.ForeignBolCustomersContainer.listProgress(false);
			}
		}

		// Enable Edits
		self.ForeignBolCustomerSettingsContainer.onGridColumnClick = obj => {
			obj.canEdit(false);
			obj.isEditVisible(true);
		}

		// Enable Edits
		self.ForeignBolCustomerSettingsContainer.onDeleteClick = obj => {
			self.ForeignBolCustomerSettingsContainer.listProgress(true);
			if (obj.id() > 0) {
				//if (self.checkMsgDisplay) {
				self.checkMsgDisplay = false;
				var actionButtons: Array<IToastrActionButtonOptions> = [];
				actionButtons.push({
					actionButtonName: "Yes",
					actionClick: () => {
						self.purchaseOrderClient.deleteforeignBolAddress(obj.id(), (result) => {
							self.ForeignBolCustomerSettingsContainer.listProgress(false);
							if (result) {
								self.deleteAddressFromList(obj);
							}
						},
							() => { self.ForeignBolCustomerSettingsContainer.listProgress(false); });
						self.isChange = true;
					}
				});

				actionButtons.push({
					actionButtonName: "No",
					actionClick: () => {
						self.ForeignBolCustomerSettingsContainer.listProgress(false);
					}
				});
				var toastrOptions1: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 0,
					fadeOut: 0,
					typeOfAlert: "",
					title: "",
					actionButtons: actionButtons
				};

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.AreYouSureWantToRemoveThis, "warning", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
				//}
			}
			else {
				self.deleteAddressFromList(obj);
				self.ForeignBolCustomerSettingsContainer.listProgress(false);
			}
		}

        self.bolCharacters.extend({
			required: {
				message: "Please enter a number greater than 0",
				onlyIf: () => {
					return (self.isEdiBolLengthMapped());
				}
			},
			number: true,
			// To show validation for min value
			min: {
				params: 1,
				message: "Please enter a number greater than 0",
				onlyIf: () => {
					return (self.isEdiBolLengthMapped());
				}
			}
		});

		//self.bolCharacters.subscribe((newValue) => {
		//	self.isChange = true;
		//});

		self.ForeignBolCustomerSettingsContainer.onSaveClick = obj => {
			if (obj.errorForeignBolAddress.errors().length <= 0) {
				self.ForeignBolCustomerSettingsContainer.listProgress(true);

				var addressesToSave: Array<refForeignBolAddresses.Models.ForeignBolAddress>;
				addressesToSave = ko.observableArray([])();

				var addressToSave = new refForeignBolAddresses.Models.ForeignBolAddress();
				addressToSave.ID = obj.id();
				addressToSave.CompanyName = obj.companyName();
				addressToSave.Address1 = obj.address();
				addressToSave.Address2 = obj.address_2();
				addressToSave.City = obj.city();
				addressToSave.State = obj.state();
				addressToSave.ZipCode = obj.zipCode();
				addressToSave.AddressType = obj.selectedAddressType();
				addressToSave.CustomerId = self.selectedCustomerId();
				addressToSave.UpdatedDate = obj.updatedDate();
				addressesToSave.push(addressToSave);
				//Converting to container b/c of we are changed in container in the requirement of global save
				var addressToSaveContainer = new refForeignBolAddressesContainer.Models.ForeignBolAddressesContainer();
				addressToSaveContainer.ForeignBolAddressesList = addressesToSave;

				self.purchaseOrderClient.saveForeignBolCustomerAddress(addressToSaveContainer, (result) => {
					self.ForeignBolCustomerSettingsContainer.listProgress(false);
					if (result > 0) {
						if (self.checkMsgDisplay) {
							self.checkMsgDisplay = false;
							var toastrOptions1 = {
								toastrPositionClass: "toast-top-middle",
								delayInseconds: 10,
								fadeOut: 10,
								typeOfAlert: "",
								title: ""
							}
					var customer = self.customerName() + ' - ID ' + self.customerId();
							Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.ForeignBolAddressSuccess, "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
						}
						obj.typeLabel(self.configAddressLabel(obj.selectedAddressType()));
						obj.canEdit(true);
						obj.isEditVisible(false);
						obj.id(result);
					}
					self.isChange = false;
					_app.trigger("IsBIDirtyChange", false);
					//self.obcOptionButtonsList.changedButtonList().removeAll();
				},
					(errorMessage) => {
						if (self.checkMsgDisplay) {
							self.checkMsgDisplay = false;
							var toastrOptions1 = {
								toastrPositionClass: "toast-top-middle",
								delayInseconds: 10,
								fadeOut: 10,
								typeOfAlert: "",
								title: ""
							}
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, errorMessage, "error", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
						}
						obj.canEdit(false);
						obj.isEditVisible(true);
						self.ForeignBolCustomerSettingsContainer.listProgress(false);
					}
					);
			}
			else {
				obj.errorForeignBolAddress.errors.showAllMessages();
			}
		}
		//#endregion

		return self;
	}
	//#endregion

	//#region Methods
	public onGlobalSaveClick() {
		var self = this;
		var ForeignBolAddressesDataToSave = new refForeignBolAddressesContainer.Models.ForeignBolAddressesContainer();
		ForeignBolAddressesDataToSave.ForeignBolAddressesList = self.getAddresses();
		//var allAddressesToSave: Array<refForeignBolAddresses.Models.ForeignBolAddress>;
		//allAddressesToSave = self.getAddresses();
		if (ForeignBolAddressesDataToSave.ForeignBolAddressesList.length > 0) {
			self.ForeignBolCustomerSettingsContainer.listProgress(true);
			self.purchaseOrderClient.saveForeignBolCustomerAddress(ForeignBolAddressesDataToSave, (result) => {
				if (result > 0) {
					//Not setting grid list progress flase b/c it will false in reload function which we are calling after this
					if (self.checkMsgDisplay) {
						self.checkMsgDisplay = false;
						var toastrOptions1 = {
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 10,
							fadeOut: 10,
							typeOfAlert: "",
							title: ""
						}
					var customer = self.customerName() + ' - ID ' + self.customerId();
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.ForeignBolAddressSuccess, "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
					}
					//obj.typeLabel(self.configAddressLabel(obj.selectedAddressType()));
					//obj.canEdit(true);
					//obj.isEditVisible(false);
					//obj.id(result);
				}
				self.isChange = false;
				_app.trigger("IsBIDirtyChange", false);
			},
				(errorMessage) => {
					//Not setting grid list progress flase b/c it will false in reload function which we are calling after this
					if (self.checkMsgDisplay) {
						self.checkMsgDisplay = false;
						var toastrOptions1 = {
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 10,
							fadeOut: 10,
							typeOfAlert: "",
							title: ""
						}
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, errorMessage, "error", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
					}
					//obj.canEdit(false);
					//obj.isEditVisible(true);
					//self.ForeignBolCustomerSettingsContainer.listProgress(false);
				}
				);
			//self.getForeignBolReportData(self.foreignBolReportAction);

			//using b/c of grid data not updating fast its taking some time
			setTimeout(function ()
			{ self.reloadPage(); },
				1000);
		}
	}

	//Get all editable address
	public getAddresses(): Array<IForeignBolAddress> {
		var self = this;
		//var purchaseOrderItems: Array<_refpurchaseOrderItemModel.Models.VendorBillItemDetails>;
		var addressesToSave: Array<refForeignBolAddresses.Models.ForeignBolAddress>;
		addressesToSave = ko.observableArray([])();
		self.foreignBolCustomerAddresses().forEach(function (item) {
			var addressToSave = new refForeignBolAddresses.Models.ForeignBolAddress();
			if (item.isEditVisible()) {
				addressToSave.ID = item.id();
				addressToSave.CompanyName = item.companyName();
				addressToSave.Address1 = item.address();
				addressToSave.Address2 = item.address_2();
				addressToSave.City = item.city();
				addressToSave.State = item.state();
				addressToSave.ZipCode = item.zipCode();
				addressToSave.AddressType = item.selectedAddressType();
				addressToSave.CustomerId = self.selectedCustomerId();
				addressToSave.UpdatedDate = item.updatedDate();

				addressesToSave.push(addressToSave);
			}
		});

		return addressesToSave;
	}

	//Using to show column width default width
	public refreshAddressGrid() {
		var self = this;
		//on click we are calling this flag to show grid column resizebal as per browser window
		self.ForeignBolCustomerSettingsContainer.isAttachedToView(false);
		self.ForeignBolCustomerSettingsContainer.isAttachedToView(true);
	}

	public refreshCustomerGrid() {
		var self = this;
		//on click we are calling this flag to show grid column resizebal as per browser window
		self.ForeignBolCustomersContainer.isAttachedToView(false);
		self.ForeignBolCustomersContainer.isAttachedToView(true);
	}

	//clearing all filter data
	public onClickClearAll() {
		var self = this;
		self.ForeignBolCustomersContainer.reportColumnFilter.clearAll();
		self.ForeignBolCustomersContainer.reportColumnFilter.applyFilter();
		self.isSearchFilterItemsData(false);
		self.isSearchFilterItemsDataAddressGrid(false);
		//$('.gridPOBord').removeClass('margin-top--26');
	}

	//clearing all filter data
	public onClickClearAllAddressGrid() {
		var self = this;
		self.ForeignBolCustomerSettingsContainer.reportColumnFilter.clearAll();
		self.ForeignBolCustomerSettingsContainer.reportColumnFilter.applyFilter();
		self.isSearchFilterItemsData(false);
		self.isSearchFilterItemsDataAddressGrid(false);
		//$('.gridPOBord').removeClass('margin-top--26');
	}

	//#region General Methods
	private configAddressLabel(type) {
		if (type == 1) {
			return "Shipper/Consignee";
		}
		else if (type == 2) {
			return "Bill To";
		}
		else {
			return "";
		}
	}

	private getBolCustomerSettings(data: any) {
		var self = this;
		self.purchaseOrderClient.getForeignBolCustomerSettings(data,
			function (data) {
				self.initializeCustomerSettings(data.CustomerSettings);
				self.initializeForeignBolAddress(data.ForeignBolAddressList, data.TotalRowCount, self.foreignBolCustomerSettingsGridOptions.pagingOptions.pageSize());
				self.selectedCustomerId(data.CustomerSettings.CustomerId);
				self.selectedCustomerName(data.CustomerSettings.CustomerName);
				self.customerDisplay(self.selectedCustomerName() + ' - ID ' + self.selectedCustomerId());
				$('.grid-foreignbol-customers').hide();
				$('.grid-foreignbol-customersettings-pop').show('slide', { direction: 'right' }, 200);
				self.ForeignBolCustomerSettingsContainer.listProgress(false);
				self.isLoaded(true);
				LocalStorageController.Set(self.localStorageKey() + "CompanyMapping", undefined);
				//Calling to reset grid as same as default column
				self.refreshAddressGrid();
			},
			function () {
				self.ForeignBolCustomerSettingsContainer.listProgress(false);
				//Calling to reset grid as same as default column
				self.refreshAddressGrid();
			});
		//Calling to reset grid as same as default column
		self.refreshAddressGrid();
	}

	private onBackClick() {
		var self = this;
		var isDirty = false;
		self.sortCol('CustomerId');
		self.sorttype('desc');
		self.foreignBolCustomerAddresses().forEach(function (item) {
			if ((item.isDirty() && self.isChange)) {
				isDirty = true;
			}
		});
		//|| self.isCheckBoxChange
		if (isDirty || self.obcOptionButtonsList.changedButtonList().length > 0) {
			var actionButtons: Array<IToastrActionButtonOptions> = [];
			actionButtons.push({
				actionButtonName: "Yes",
				actionClick: () => {
					self.onClickClearAllAddressGrid();
					self.refreshCustomerGrid();
					_app.trigger("IsBIDirtyChange", false);
					self.obcOptionButtonsList.changedButtonList().removeAll();
					self.clearCustomer();
					self.getForeignBolReportData(self.foreignBolReportAction);
					$('.grid-foreignbol-customers').show('slide', { direction: 'left' }, 200);
					$('.grid-foreignbol-customersettings-pop').hide();
					//LocalStorageController.Set(self.localStorageKey() + "CompanyMappingAddresses", undefined);
					LocalStorageController.Set(self.localStorageKey() + "_foreignBol", undefined);
				}
			});

			actionButtons.push({
				actionButtonName: "No",
				actionClick: () => {
				}
			});
			var toastrOptions1: IToastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 0,
				fadeOut: 0,
				typeOfAlert: "",
				title: "",
				actionButtons: actionButtons
			};

			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.ChangesMadeMessage, "warning", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
		}
		else {
			//self.onClickClearAllAddressGrid();
			self.clearCustomer();
			self.getForeignBolReportData(self.foreignBolReportAction);
			$('.grid-foreignbol-customers').show('slide', { direction: 'left' }, 200);
			$('.grid-foreignbol-customersettings-pop').hide();
			//LocalStorageController.Set(self.localStorageKey() + "CompanyMappingAddresses", undefined);
			LocalStorageController.Set(self.localStorageKey() + "_foreignBol", undefined);
		}
	}

	private onAddClick() {
		var self = this;
		if (self.customerId() > 0) {
			self.listProgress(true);
			var successCallBack = function (data) {
				if (data) {
					if (self.checkMsgDisplay) {
						self.checkMsgDisplay = false;
						var toastrOptions1 = {
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 10,
							fadeOut: 10,
							typeOfAlert: "",
							title: ""
						}
					    var customer = self.customerName() + ' - ID ' + self.customerId();
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, customer + " is already mapped as Foreign BOL customer", "info", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
					}
				}

				//var parameters = { PageSize: 10, };
				//var userSpecificParams = { CustomerId: self.customerId() };
				//var filterData = { UserGridSetting: parameters, PageNo: 1, PageSize: 10, UserSpecificParams: userSpecificParams };

				var saveData = { PageSize: self.foreignBolCustomerSettingsGridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems }
				var userSpecificParams = { CustomerId: self.customerId() };
				var filterData = { CustomerId: self.customerId(), UserGridSetting: saveData, UserSpecificParams: userSpecificParams, GridViewId: refEnums.Enums.FilterViewName.ForeignBolAddress, IsFilterApplied: self.ForeignBolCustomerSettingsContainer.reportColumnFilter.isFilterApply, GridSearchText: self.foreignBolCustomerSettingsSearchText(), PageNo: self.foreignBolCustomerSettingsGridOptions.pagingOptions.currentPage(), PageSize: self.foreignBolCustomerSettingsGridOptions.pagingOptions.pageSize(), SortCol: self.sortCol(), SortOrder: self.sorttype(), FromLocalStorage: self.fromLocalStorage() };

				self.getBolCustomerSettings(filterData);
				self.listProgress(false);
				$('.grid-foreignbol-customers').hide();
				$('.grid-foreignbol-customersettings-pop').show('slide', { direction: 'right' }, 200);
			},
				failureCallBack = function (errorMsg) {
					if (self.checkMsgDisplay) {
						self.checkMsgDisplay = false;
						var toastrOptions1 = {
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 10,
							fadeOut: 10,
							typeOfAlert: "",
							title: ""
						}
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, errorMsg, "error", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
					}
					self.listProgress(false);
				}

		   self.purchaseOrderClient.addForeignBolCustomer(self.customerId(), successCallBack, failureCallBack);
		}
		else {
			if (self.checkMsgDisplay) {
				self.checkMsgDisplay = false;

				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					ddelayInseconds: 15,
					fadeOut: 15,
					typeOfAlert: "",
					title: ""
				}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, 'A valid Customer name is required', "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
			}
		}
	}

	private deleteAddressFromList(lineItem) {
		var self = this;
		self.foreignBolCustomerAddresses.remove(lineItem);
		self.setCustomerSettingsPagingData(self.foreignBolCustomerAddresses(), self.foreignBolCustomerAddresses().length, self.foreignBolCustomerSettingsGridOptions.pagingOptions.pageSize());
		//self.setPagingDataClientSide(ko.observableArray(self.foreignBolCustomerAddresses()), self.foreignBolCustomerSettingsGridOptions, self.foreignBolCustomerSettingsReportAction);
	}

	private clearCustomer() {
		var self = this;

		self.customerSearchList.name(new refCustomerSearchModel.Models.CustomerNameSearch());
		self.customerSearchList.customerName('');
		self.customerSearchList.id(0);
	}

	private saveCustomerSettings() {
		var self = this;

		if (self.errorDetail.errors().length != 0) {
			self.errorDetail.errors.showAllMessages();
			return;
		}

		var validateAllAddress = true;
		self.foreignBolCustomerAddresses().forEach(function (item) {
			if ((item.isEditVisible() && item.errorForeignBolAddress.errors().length > 0) || (self.bolCharacters() < 1 && self.isEdiBolLengthMapped())) {
				validateAllAddress = false;
				item.errorForeignBolAddress.errors.showAllMessages();
			}
		});

		if (!validateAllAddress) {
			return;
		}

		self.listProgressSettings(true);
		var foreignBolSettings = new refForeignBolSettings.Models.ForeignBolSettings();
		foreignBolSettings.CustomerId = self.selectedCustomerId();
		var selecetedList = self.obcOptionButtonsList.getSelectedOptions(true);

		selecetedList.forEach((item) => {
			if (item.id === refEnums.Enums.ForeignBolOptionConstant.ShipperConsigneeAddress) {
				foreignBolSettings.IsShipperConsigneeAddressMapped = true;
			} else if (item.id === refEnums.Enums.ForeignBolOptionConstant.BillToAddress) {
				foreignBolSettings.IsBillToAddressMapped = true;
			} else if (item.id === refEnums.Enums.ForeignBolOptionConstant.EDIBOLLength) {
				foreignBolSettings.IsEdiBolMapped = true;
			}
			else if (item.id === refEnums.Enums.ForeignBolOptionConstant.BOLStartsWithCharacter) {
				foreignBolSettings.IsBOLStartWithCharacter = true;
			}
		});

		if (self.bolCharacters() === null) {
			foreignBolSettings.EdiBolLength = 0;
		}
		else {
			foreignBolSettings.EdiBolLength = self.bolCharacters();
		}

		self.purchaseOrderClient.saveForeignBolCustomerSettings(foreignBolSettings, (result) => {
			//self.listProgressSettings(false);
			if (result) {
				if (self.checkMsgDisplay) {
					self.checkMsgDisplay = false;
					var toastrOptions1 = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 4,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.ForeignBolCustomerSettingsSuccess, "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
				}
				;
				self.isChange = false;
				self.isCheckBoxChange = false;
				_app.trigger("IsBIDirtyChange", false);
				self.obcOptionButtonsList.changedButtonList().removeAll();
			}
		},
			(errorMessage) => {
				if (self.checkMsgDisplay) {
					self.checkMsgDisplay = false;
					var toastrOptions1 = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 4,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, errorMessage, "error", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
					//self.listProgressSettings(false);
				}
			});

		//Calling to save complete address
		self.onGlobalSaveClick();
		self.listProgressSettings(false);
	}

	private initializeForeignBolAddress(addresses: Array<IForeignBolAddress>, rowCount: number, pageSize: number) {
		var self = this;

		if (self.foreignBolCustomerAddresses != null) {
			self.foreignBolCustomerAddresses.removeAll();
		}

		if (addresses != null) {
			for (var i = 0; i < addresses.length; i++) {
				//addresses[i].CanEdit = true;
				//addresses[i].IsEditVisible = false;
				self.foreignBolCustomerAddresses.push(new ForeignBolCustomerAddress(addresses[i]));
			}

			//self.setPagingDataClientSide(ko.observableArray(self.foreignBolCustomerAddresses()), self.foreignBolCustomerSettingsGridOptions, self.foreignBolCustomerSettingsReportAction);

			self.setCustomerSettingsPagingData(self.foreignBolCustomerAddresses(), rowCount, pageSize);
		}
	}

	// TO initialize the customer settings
	private initializeCustomerSettings(customerSettings) {
		var self = this;
		self.isNotAtLoadingTime = true;
		if (customerSettings.EdiBolLength === 0) {
			self.bolCharacters(null);
		}
		else {
			self.bolCharacters(customerSettings.EdiBolLength);
		}

		self.isEdiBolLengthMapped(customerSettings.IsEdiBolMapped);
		self.updatedDate(customerSettings.updatedDate);

		if (customerSettings.IsShipperConsigneeAddressMapped) {
			self.obcOptionButtonsList.setSelectById(1);
		}
		else {
			self.obcOptionButtonsList.getOptionsById(1).selected(false);
		}

		if (customerSettings.IsBillToAddressMapped) {
			self.obcOptionButtonsList.setSelectById(2);
		}
		else {
			self.obcOptionButtonsList.getOptionsById(2).selected(false);
		}

		if (customerSettings.IsEdiBolMapped) {
			self.obcOptionButtonsList.setSelectById(3);
		}
		else {
			self.obcOptionButtonsList.getOptionsById(3).selected(false);
		}

		if (customerSettings.IsBOLStartWithCharacter) {
			self.obcOptionButtonsList.setSelectById(4);
		}
		else {
			self.obcOptionButtonsList.getOptionsById(4).selected(false);
		}
		self.isNotAtLoadingTime = false;
		self.setTrackChange(self);
	}

	private addEmptyRow() {
		var self = this;
		var address = new refForeignBolAddresses.Models.ForeignBolAddress();
		address.CompanyName = '';
		address.Address1 = '';
		address.Address2 = '';
		address.City = '';
		address.State = '';
		address.ZipCode = '';
		address.AddressType = 0;
		address.ID = 0;
		address.CanEdit = false;
		address.IsEditVisible = true;
		address.AddressTypeDisplay = '';
		self.foreignBolCustomerAddresses.push(new ForeignBolCustomerAddress(address));
		//self.setPagingDataClientSide(ko.observableArray(self.foreignBolCustomerAddresses()), self.foreignBolCustomerSettingsGridOptions, self.foreignBolCustomerSettingsReportAction);
		//self.setPagingData(ko.observableArray(data), self.gridOptions, self.reportAction);
		self.setCustomerSettingsPagingData(self.foreignBolCustomerAddresses(), self.foreignBolCustomerAddresses().length, self.foreignBolCustomerSettingsGridOptions.pagingOptions.pageSize());
		self.isChange = true;
	}

	private setCustomersPagingData(data, page, pageSize) {
		var self = this;
		self.foreignBolGridOptions.data(data);
		self.foreignBolGridOptions.data.valueHasMutated()
		self.foreignBolGridOptions.pagingOptions.totalServerItems(page);
	}

	private setCustomerSettingsPagingData(data, page, pageSize) {
		var self = this;
		self.foreignBolCustomerSettingsGridOptions.data(data);
		self.foreignBolCustomerSettingsGridOptions.data.valueHasMutated()
		self.foreignBolCustomerSettingsGridOptions.pagingOptions.totalServerItems(page);
	}

	private setPagingDataClientSide(data, grid, gridOption) {
		Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
	}

	public getBolCustomerSettingsFromLocalStorage() {
		var self = this;
		var data = LocalStorageController.Get("foreignBol");
		$('.grid-foreignbol-customers').hide();
		$('.grid-foreignbol-customersettings-pop').show();
		self.setPagingDataClientSide(ko.observableArray(data.screenData), self.foreignBolCustomerSettingsGridOptions, self.foreignBolCustomerSettingsReportAction);
	}
	//#endregion

	//#region Screen 1 Reprot Viewer Settings
	private setForeignBolGridOptions(self: ForeignBolCustomerSettingsViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = true;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("ForeignBolCustomers");
		grOption.columnDefinition = self.setForeignBolCustomersGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "CustomerId",
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
		grOption.enableSaveGridSettings = true;
		grOption.useClientSideFilterAndSort = false;
		grOption.showColumnMenu = true;
		grOption.useExternalFilter = true;
		return grOption;
	}

	private setForeignBolCustomersGridColumnDefinitions() {
		var colDefinition: Array = [];
		var self = this;

		// For BOLnumber cellTemplate: customerIdCellTemplate,
		var customerIdCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'CustomerId\'], click: function() { $userViewModel.onGridColumnClick($parent.entity) }" />';
		var RemoveCellTemplate = '<div style="text-align:center; margin-top:7px;"><input type="image" title="Delete" data-bind="click: function() { $userViewModel.onDeleteClick($parent.entity) }" src="Content/images/Icon_Trash.png"; /></div>';

		colDefinition = [
			{ field: 'CustomerId', displayName: 'Customer Id', cellTemplate: customerIdCellTemplate, isRemovable: false, width: 120, type: _reportViewer.DataTypes.String },
			{ field: 'CustomerName', displayName: 'Customer Name', type: _reportViewer.DataTypes.String },
			{ field: 'AgencyName', displayName: 'Sales Rep', type: _reportViewer.DataTypes.String },
			{ field: 'Agency', displayName: 'Agency', type: _reportViewer.DataTypes.String },
			{ field: 'Criteria', displayName: 'Criteria', isRemovable: true, width: 300, type: _reportViewer.DataTypes.String, dntApplyFilter: true },
			{ field: 'AddressCount', displayName: 'Location Count', width: 120, type: _reportViewer.DataTypes.String },
			{ field: 'delete', displayName: 'Delete', sortable: false, isRemovable: false, width: 80, cellTemplate: RemoveCellTemplate, dntApplyFilter: true }
		];

		return colDefinition;
	}
	//#endregion

	//#region Screen 2 Reprot Viewer Settings
	private setForeignBolCustomerSettingsGridOptions(self: ForeignBolCustomerSettingsViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = true;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("ForeignBolCustomersSetting");
		grOption.columnDefinition = self.setForeignBolCustomerSettingGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "CustomerId",
			order: "desc"
		};
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
		grOption.enableSaveGridSettings = true;
		grOption.useClientSideFilterAndSort = false;
		grOption.showColumnMenu = true;
		grOption.useExternalFilter = true;
		return grOption;
	}

	private setForeignBolCustomerSettingGridColumnDefinitions() {
		var colDefinition: Array = [];
		var self = this;

		var CompanyNameCelTemplate = '<div id="foreignBolCompany"><div class="kgCellText" data-bind = "visible: !($parent.entity[\'isEditVisible\']()), text: $parent.entity[\'companyName\']"></div><label class="validation-label2" data-bind=" validationElement: $parent.entity[\'companyName\']"><i class="fa fa-question-circle valdation_icon_grid kogrid_tooltip" data-bind="visible: ($parent.entity[\'companyName\'].isModified() && !$parent.entity[\'companyName\'].isValid()), tooltip: { title: $parent.entity[\'companyName\'].isModified() ? $parent.entity[\'companyName\'].error : \'\', placement: \'right\', trigger: \'hover\' }"></i ><input id="foreignBolCompanyTextBox" type ="text" maxlength="100"  class="requiredFieldBgColor foreign-bol-companyname validation2"  data-bind ="value: $parent.entity[\'companyName\'],visible: $parent.entity[\'isEditVisible\'](), css: { borderRedOnValidation: ($parent.entity[\'companyName\'].isModified() && !$parent.entity[\'companyName\'].isValid()) }, style: { \'padding-left\': ($parent.entity[\'companyName\'].isModified() && !$parent.entity[\'companyName\'].isValid()) ? \'17px\' : \'\' } ,valueUpdate: \'afterkeydown\'"/></label></div>';
		var Address_1CelTemplate = '<div><div class="kgCellText" data-bind = "visible: !($parent.entity[\'isEditVisible\']()), text: $parent.entity[\'address\']"></div><label class="validation-label2" data-bind="validationElement: $parent.entity[\'address\']"><i class="fa fa-question-circle valdation_icon_grid kogrid_tooltip" data-bind="visible: ($parent.entity[\'address\'].isModified() && !$parent.entity[\'address\'].isValid()), tooltip: { title: $parent.entity[\'address\'].isModified() ? $parent.entity[\'address\'].error : \'\', placement: \'right\', trigger: \'hover\' }"></i ><input id="foreignBolAddress1TextBox" type ="text" maxlength="100"  class="requiredFieldBgColor foreign-bol-address1 validation2"  data-bind ="value: $parent.entity[\'address\'],visible: $parent.entity[\'isEditVisible\'](), css: { borderRedOnValidation: ($parent.entity[\'address\'].isModified() && !$parent.entity[\'address\'].isValid()) }, style: { \'padding-left\': ($parent.entity[\'address\'].isModified() && !$parent.entity[\'address\'].isValid()) ? \'17px\' : \'\' } ,valueUpdate: \'afterkeydown\'"/></label></div>';
		var Address_2CelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'address_2\'], visible: !($parent.entity[\'isEditVisible\']())"></div><input type="text" maxlength="100" class="foreign-bol-address2" data-bind="value: $parent.entity[\'address_2\'], visible: $parent.entity[\'isEditVisible\']()" /></div>';
		var CityCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'city\'], visible: !($parent.entity[\'isEditVisible\']())"></div><label class="validation-label2" data-bind=" validationElement: $parent.entity[\'city\']"><i class="fa fa-question-circle valdation_icon_grid kogrid_tooltip" data-bind="visible: ($parent.entity[\'city\'].isModified() && !$parent.entity[\'city\'].isValid()), tooltip: { title: $parent.entity[\'city\'].isModified() ? $parent.entity[\'city\'].error : \'\', placement: \'right\', trigger: \'hover\' }"></i ><input id="foreignBolCityTextBox" type="text" maxlength="50" class="requiredFieldBgColor foreign-bol-city validation2" data-bind="value: $parent.entity[\'city\'], visible: $parent.entity[\'isEditVisible\'](), css: { borderRedOnValidation: ($parent.entity[\'city\'].isModified() && !$parent.entity[\'city\'].isValid()) }, style: { \'padding-left\': ($parent.entity[\'city\'].isModified() && !$parent.entity[\'city\'].isValid()) ? \'17px\' : \'\'} ,valueUpdate: \'afterkeydown\'"/></label></div>';
		var StateCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'state\'], visible: !($parent.entity[\'isEditVisible\']())"></div><input type="text" maxlength="2" class="foreign-bol-state" data-bind="value: $parent.entity[\'state\'], visible: $parent.entity[\'isEditVisible\']()" /></div>';
		var ZipCodeCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'zipCode\'], visible: !($parent.entity[\'isEditVisible\']()) "></div><label class="validation-label2" data-bind=" validationElement: $parent.entity[\'zipCode\']"><i class="fa fa-question-circle valdation_icon_grid kogrid_tooltip" data-bind="visible: ($parent.entity[\'zipCode\'].isModified() && !$parent.entity[\'zipCode\'].isValid()), tooltip: { title: $parent.entity[\'zipCode\'].isModified() ? $parent.entity[\'zipCode\'].error : \'\', placement: \'right\', trigger: \'hover\' }"></i ><input id="foreignBolZipCodeTextBox" type="text" maxlength="10" class="requiredFieldBgColor foreign-bol-zip validation2" data-bind="numeric: $parent.entity[\'zipCode\'], value: $parent.entity[\'zipCode\'], visible: $parent.entity[\'isEditVisible\'](),css: { borderRedOnValidation: ($parent.entity[\'zipCode\'].isModified() && !$parent.entity[\'zipCode\'].isValid()) }, style: { \'padding-left\': ($parent.entity[\'zipCode\'].isModified() && !$parent.entity[\'zipCode\'].isValid()) ? \'17px\' : \'\' } ,valueUpdate: \'afterkeydown\'"/></label></div>';
		var AddressTypeCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'typeLabel\'], visible: !($parent.entity[\'isEditVisible\']()) "></div><select class="margin-bottom-0 foreign-bol-type" data-bind=" visible: $parent.entity[\'isEditVisible\'](), value: $parent.entity[\'selectedAddressType\']"><option value="1">Shipper/Consignee</option><option value="2">Bill To</option></select></div>';
		var EditCellTemplate = '<div style="text-align:center; margin-top:10px;"><i class="fa fa-pencil-square-o fa-lg cursor-pointer" title="Edit" data-bind = "click: function() { $userViewModel.onGridColumnClick($parent.entity) }, visible: ($parent.entity[\'canEdit\']())"></i><i class="fa fa-floppy-o fa-lg cursor-pointer" title="Save" data-bind = "click: function() { $userViewModel.onSaveClick($parent.entity) }, visible: !($parent.entity[\'canEdit\']())" ></i><input type="image" style="margin-top:-7px; margin-left:15px;" data-bind="click: function() { $userViewModel.onDeleteClick($parent.entity) }" src="Content/images/Icon_Trash.png"; /></div>';
		//var RemoveCellTemplate = '<div style="text-align:center; margin-top:7px;"></div>';

		colDefinition = [
			{ field: 'companyName', displayName: 'Company Name', isRemovable: false, cellTemplate: CompanyNameCelTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'address', displayName: 'Address 1', cellTemplate: Address_1CelTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'address_2', displayName: 'Address 2', width: 200, cellTemplate: Address_2CelTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'city', displayName: 'City', cellTemplate: CityCelTemplate, width: 110, type: _reportViewer.DataTypes.String },
			{ field: 'state', displayName: 'State', cellTemplate: StateCelTemplate, width: 90, type: _reportViewer.DataTypes.String },
			{ field: 'zipCode', displayName: 'Zip', cellTemplate: ZipCodeCelTemplate, width: 80, type: _reportViewer.DataTypes.String },
			{ field: 'typeLabel', displayName: 'Type', cellTemplate: AddressTypeCelTemplate, width: 160, type: _reportViewer.DataTypes.String, dntApplyFilter: true },
			{ field: 'edit', displayName: ' ', cellTemplate: EditCellTemplate, sortable: false, isRemovable: false, width: 90, dntApplyFilter: true },
			//{ field: 'delete', displayName: 'Delete', sortable: false, isRemovable: false, cellTemplate: RemoveCellTemplate, width: 80, dntApplyFilter: true }
		];
		return colDefinition;
	}
	//#endregion

	//#region Private Methods
	private reloadPage() {
		var self = this;
		_app.trigger("IsBIDirtyChange", false);
		self.isChange = false;
		self.isCheckBoxChange = false;
		self.obcOptionButtonsList.changedButtonList().removeAll();
		LocalStorageController.Set(self.localStorageKey(), undefined);
		LocalStorageController.Set(self.localStorageKey() + 'lastReloadDateTime', undefined);
		//self.beforeBind();

		var saveData = { PageSize: self.foreignBolCustomerSettingsGridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems }
		var userSpecificParams = { CustomerId: self.selectedCustomerId() };
		var filterData = { CustomerId: self.selectedCustomerId(), UserGridSetting: saveData, UserSpecificParams: userSpecificParams, GridViewId: refEnums.Enums.FilterViewName.ForeignBolAddress, IsFilterApplied: self.ForeignBolCustomerSettingsContainer.reportColumnFilter.isFilterApply, GridSearchText: self.foreignBolCustomerSettingsSearchText(), PageNo: self.foreignBolCustomerSettingsGridOptions.pagingOptions.currentPage(), PageSize: self.foreignBolCustomerSettingsGridOptions.pagingOptions.pageSize(), SortCol: self.sortCol(), SortOrder: self.sorttype(), FromLocalStorage: self.fromLocalStorage() };

		self.ForeignBolCustomerSettingsContainer.listProgress(true);
		self.getBolCustomerSettings(filterData);
	}

	//set Date Time for record of last refreshed
	private setDateTimeOfReload() {
		var self = this;
		if (LocalStorageController.Get(self.localStorageKey() + 'lastReloadDateTime')) {
			var localDateTimeOfReload = LocalStorageController.Get(self.localStorageKey() + 'lastReloadDateTime');
			self.currentDateTime(localDateTimeOfReload);
		} else {
			var onlyDate = self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy');
			var date = new Date();
			var str = 'Last Refreshed: ' + onlyDate + ' ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
			LocalStorageController.Set(self.localStorageKey() + 'lastReloadDateTime', str);
			//var reloadDate = LocalStorageController.Get(self.vendorBillDetailsViewModel.proNumber() + 'lastReloadDateTime');
			self.currentDateTime(str);
		}
	}
	private initializeForeignBolAddressPersistantData(data) {
		var self = this;
		var addresses: Array<refForeignBolAddresses.Models.ForeignBolAddress> = ko.observableArray([])();

		for (var i = 0; i < data.length; i++) {
			var address = new refForeignBolAddresses.Models.ForeignBolAddress();
			address.ID = data[i].id();
			address.CompanyName = data[i].companyName();
			address.Address1 = data[i].address();
			address.Address2 = data[i].address_2();
			address.City = data[i].city();
			address.State = data[i].state();
			address.ZipCode = data[i].zipCode();
			address.AddressType = data[i].selectedAddressType();
			address.UpdatedDate = data[i].updatedDate();
			address.CanEdit = data[i].canEdit();
			address.IsEditVisible = data[i].isEditVisible();
			address.AddressTypeDisplay = data[i].typeLabel();
			addresses.push(address);
		}
		self.initializeForeignBolAddress(addresses, addresses.length, 10);
	}
	//#endregion

	//#region Life Cycle Events
	public beforeBind() {
		var self = this;
		//if (LocalStorageController.Get("foreignBol")) {
		//	var data = LocalStorageController.Get("foreignBol");
		//	if (data.isForeignBol) {
		//		self.isProceedToLoadScreen1(data.isScreen1);
		//	}
		//}
	}

	public compositionComplete() {
		var self = this;
		if (LocalStorageController.Get(self.localStorageKey() + "_foreignBol")) {
			var data = LocalStorageController.Get(self.localStorageKey() + "_foreignBol");
			if (data.isForeignBol && !data.isScreen1) {
				self.initializeForeignBolAddressPersistantData(data.customerAddressData);
				self.initializeCustomerSettings(data.customerSettings);
				self.selectedCustomerId(data.customerId);
				self.customerDisplay(data.customer);
				$('.grid-foreignbol-customers').hide();
				$('.grid-foreignbol-customersettings-pop').show();
				self.isLoaded(true);
				self.refreshAddressGrid();

				//
				var pageRecord = data.filterDataToSave;
				if (pageRecord != null) {
					self.foreignBolCustomerSettingsGridOptions.pagingOptions.currentPage(pageRecord.PageNo);
					self.foreignBolCustomerSettingsGridOptions.pagingOptions.pageSize(pageRecord.UserGridSetting.PageSize);
					self.sortCol(pageRecord.SortCol);
					self.sorttype(pageRecord.SortOrder);

					var list = pageRecord.UserGridSetting.Filters;

					self.searchFilterItems.removeAll();
					if (list.length > 0 && list[0].FieldName) {
						list.forEach((items) => {
							self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						self.searchFilterItem.FieldName = items.FieldName;
							self.searchFilterItem.Operand = items.Operand;
							self.searchFilterItem.SearchText = items.SearchText;
							self.searchFilterItems.push(self.searchFilterItem);
						});
						self.ForeignBolCustomerSettingsContainer.reportColumnFilter.addFilter(self.searchFilterItems);
					}

					self.SetCustomerFilter(pageRecord.UserGridSetting1);

					if (typeof pageRecord.isLoaded !== "undefined") {
						self.isLoaded(pageRecord.isLoaded);
					}
					self.foreignBolGridOptions.filterOptions.filterText(pageRecord.GridSearchText);
					self.searchText(pageRecord.GridSearchText);
					self.fromLocalStorage(true);
				}
				self.getForeignBolCustomerSettingsReportData(self.foreignBolCustomerSettingsReportAction);
			}
			else {
				$('.grid-foreignbol-customers').show();
				$('.grid-foreignbol-customersettings-pop').hide();
				LocalStorageController.Set(self.localStorageKey() + "_foreignBol", undefined);

				var pageRecord = LocalStorageController.Get(self.localStorageKey() + "CompanyMapping");
				if (pageRecord != null) {
					self.foreignBolGridOptions.pagingOptions.currentPage(pageRecord.PageNo);
					self.foreignBolGridOptions.pagingOptions.pageSize(pageRecord.UserGridSetting.PageSize);
					self.sortCol(pageRecord.SortCol);
					self.sorttype(pageRecord.SortOrder);
					var list = pageRecord.UserGridSetting1.Filters;
					self.searchFilterItems.removeAll();
					if (list.length > 0 && list[0].FieldName) {
						list.forEach((items) => {
							self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
							self.searchFilterItem.FieldName = items.FieldName;
							self.searchFilterItem.Operand = items.Operand;
							self.searchFilterItem.SearchText = items.SearchText;
							self.searchFilterItems.push(self.searchFilterItem);
						});
						self.ForeignBolCustomersContainer.reportColumnFilter.addFilter(self.searchFilterItems);
					}

					self.SetCustomerAddressFilter(pageRecord.UserGridSetting);

					if (typeof pageRecord.isLoaded !== "undefined") {
						self.isLoaded(pageRecord.isLoaded);
					}
					self.foreignBolGridOptions.filterOptions.filterText(pageRecord.GridSearchText);
					self.searchText(pageRecord.GridSearchText);
					self.fromLocalStorage(true);
				}

				self.getForeignBolReportData(self.foreignBolReportAction);
				//self.refreshAddressGrid();
			}
		}
		else {
			self.GetAndSetCustomersListFilter();
			self.GetAndSetCustomerAddressFilter();
		}
	}

	public GetAndSetCustomersListFilter() {
		var self = this;
		var successCallBack = data => {
			self.searchText('');
			var filterlist = data.Filters;
			self.foreignBolGridOptions.pagingOptions.pageSize(data.PageSize);
			self.foreignBolGridOptions.pagingOptions.currentPage(1);

			self.searchFilterItems.removeAll();
			if (filterlist.length > 0 && filterlist[0].FieldName != null) {
				filterlist.forEach((items) => {
					self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						self.searchFilterItem.FieldName = items.FieldName;
					self.searchFilterItem.Operand = items.Operand;
					self.searchFilterItem.SearchText = items.SearchText;
					self.searchFilterItems.push(self.searchFilterItem);
				});
				self.ForeignBolCustomersContainer.reportColumnFilter.addFilter(self.searchFilterItems);
				if (self.searchFilterItems.length > 0) {
					self.isSearchFilterItemsData(true);
				} else {
					self.isSearchFilterItemsData(false);
				}
			}
			self.ForeignBolCustomersContainer.filterOptions.filterText('');
			self.searchText('');
			self.getForeignBolReportData(self.foreignBolReportAction);
		};

		self.commonClientCommand.GetUserGridSettings(refEnums.Enums.FilterViewName.ForeignBolCustomer, successCallBack);
	}

	public GetAndSetCustomerAddressFilter() {
		var self = this;
		var successCallBack = data => {
			self.searchText('');
			var filterlist = data.Filters;
			self.foreignBolCustomerSettingsGridOptions.pagingOptions.pageSize(data.PageSize);
			self.foreignBolCustomerSettingsGridOptions.pagingOptions.currentPage(1);

			self.searchFilterItems.removeAll();
			if (filterlist.length > 0 && filterlist[0].FieldName != null) {
				filterlist.forEach((items) => {
					self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						self.searchFilterItem.FieldName = items.FieldName;
					self.searchFilterItem.Operand = items.Operand;
					self.searchFilterItem.SearchText = items.SearchText;
					self.searchFilterItems.push(self.searchFilterItem);
				});
				self.ForeignBolCustomerSettingsContainer.reportColumnFilter.addFilter(self.searchFilterItems);
				if (self.searchFilterItems.length > 0) {
					self.isSearchFilterItemsData(true);
				} else {
					self.isSearchFilterItemsData(false);
				}
			}
			self.ForeignBolCustomerSettingsContainer.filterOptions.filterText('');
		};

		self.commonClientCommand.GetUserGridSettings(refEnums.Enums.FilterViewName.ForeignBolAddress, successCallBack);
	}

	public SetCustomerAddressFilter(data) {
		var self = this;

		self.searchText('');
		var filterlist = data.Filters;
		self.foreignBolCustomerSettingsGridOptions.pagingOptions.pageSize(data.PageSize);
		self.foreignBolCustomerSettingsGridOptions.pagingOptions.currentPage(1);

		self.searchFilterItems.removeAll();
		if (filterlist.length > 0 && filterlist[0].FieldName != null) {
			filterlist.forEach((items) => {
				self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						self.searchFilterItem.FieldName = items.FieldName;
				self.searchFilterItem.Operand = items.Operand;
				self.searchFilterItem.SearchText = items.SearchText;
				self.searchFilterItems.push(self.searchFilterItem);
			});
			self.ForeignBolCustomerSettingsContainer.reportColumnFilter.addFilter(self.searchFilterItems);
			if (self.searchFilterItems.length > 0) {
				self.isSearchFilterItemsData(true);
			} else {
				self.isSearchFilterItemsData(false);
			}
		}
		self.ForeignBolCustomerSettingsContainer.filterOptions.filterText('');
	}

	public SetCustomerFilter(data) {
		var self = this;

		self.searchText('');
		var filterlist = data.Filters;
		self.ForeignBolCustomersContainer.pagingOptions.pageSize(data.PageSize);
		self.ForeignBolCustomersContainer.pagingOptions.currentPage(1);

		self.searchFilterItems.removeAll();
		if (filterlist.length > 0 && filterlist[0].FieldName != null) {
			filterlist.forEach((items) => {
				self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						self.searchFilterItem.FieldName = items.FieldName;
				self.searchFilterItem.Operand = items.Operand;
				self.searchFilterItem.SearchText = items.SearchText;
				self.searchFilterItems.push(self.searchFilterItem);
			});
			self.ForeignBolCustomersContainer.reportColumnFilter.addFilter(self.searchFilterItems);
			if (self.searchFilterItems.length > 0) {
				self.isSearchFilterItemsData(true);
			} else {
				self.isSearchFilterItemsData(false);
			}
		}
		self.ForeignBolCustomersContainer.filterOptions.filterText('');
	}

	public activate() {
		return true;
	}

	public deactivate() {
		var self = this;
	}

    public cleanup() {
        var self = this;
        self.customerSearchList.cleanup();
        for (var property in self) {
            if (property != "cleanup")
                delete self[property];
        }
        delete self;
    }

	public attached() {
		_app.trigger('viewAttached');
	}
	setTrackChange(self) {
		//** To detect changes for bol Characters
		self.bolCharacters.extend({ trackChange: true });
	}
	//#endregion
}

//#region External Class  ForeignBolCustomerAddress
export class ForeignBolCustomerAddress {
	id: KnockoutObservable<number> = ko.observable(0);
	companyName: KnockoutObservable<string> = ko.observable('');
	address: KnockoutObservable<string> = ko.observable('');
	address_2: KnockoutObservable<string> = ko.observable('');
	city: KnockoutObservable<string> = ko.observable('');
	state: KnockoutObservable<string> = ko.observable('');
	zipCode: KnockoutObservable<string> = ko.observable('');
	selectedAddressType: KnockoutObservable<number> = ko.observable(0);
	typeLabel: KnockoutObservable<string> = ko.observable('');
	canEdit: KnockoutObservable<boolean> = ko.observable(true);
	isEditVisible: KnockoutObservable<boolean> = ko.observable(false);
	updatedDate: KnockoutObservable<number> = ko.observable(0);
	errorForeignBolAddress: KnockoutValidationGroup;

	//for tracking change
	getTrackChange: () => string[];
	isDirty: KnockoutComputed<boolean>;
	isNotAtLoadingTime: boolean = false;

	constructor(address: IForeignBolAddress) {
		var self = this;
		self.isNotAtLoadingTime = true;
		if (typeof (address) !== 'undefined') {
			self.id(address.ID);
			self.companyName(address.CompanyName);
			self.address(address.Address1);
			self.address_2(address.Address2);
			self.city(address.City);
			self.state(address.State);
			self.zipCode(address.ZipCode);
			self.canEdit(typeof (address.CanEdit) !== 'undefined' ? address.CanEdit : true);
			self.isEditVisible(typeof (address.IsEditVisible) !== 'undefined' ? address.IsEditVisible : false);
			self.selectedAddressType(address.AddressType);
			self.typeLabel(address.AddressTypeDisplay);
			self.updatedDate(address.UpdatedDate);
			self.setTrackChange(self);
		}
		self.isNotAtLoadingTime = false;

		//#region Change Detection
		//track changes
		self.setTrackChange(self);

		self.getTrackChange = () => Utils.getDirtyItems(this);
		self.isDirty = ko.computed(() => {
			var result = self.companyName();
			result = self.address();
			result = self.address_2();
			result = self.city();
			result = self.state();
			result = self.zipCode();

			var result1 = self.selectedAddressType();

			// If this from loading data side the return as false
			if (self.isNotAtLoadingTime)
				return false;

			var returnValue = self.getTrackChange().length > 0 ? true : false;
			_app.trigger("IsBIDirtyChange", returnValue);
			return returnValue;
		});
		//#endregion

		self.companyName.extend({
			required: {
				message: 'Company Name is required.',
				onlyIf: function () {
					return (true);
				}
			}
		});

		self.address.extend({
			required: {
				message: 'Address1 is required.',
				onlyIf: function () {
					return (true);
				}
			}
		});

		self.city.extend({
			required: {
				message: 'City is required.',
				onlyIf: function () {
					return (true);
				}
			}
		});

		self.zipCode.extend({
			required: {
				message: 'Zip is required.',
				onlyIf: function () {
					return (true);
				}
			}
		});

		self.errorForeignBolAddress = ko.validatedObservable({
			companyName: self.companyName,
			address: self.address,
			city: self.city,
			zipCode: self.zipCode
		});
	}

	setTrackChange(self) {
		//** To detect changes for Vendor Bill

		self.companyName.extend({ trackChange: true });
		self.address.extend({ trackChange: true });
		self.address_2.extend({ trackChange: true });
		self.city.extend({ trackChange: true });
		self.state.extend({ trackChange: true });
		self.zipCode.extend({ trackChange: true });
		self.selectedAddressType.extend({ trackChange: true });
	}
}
//#endregion