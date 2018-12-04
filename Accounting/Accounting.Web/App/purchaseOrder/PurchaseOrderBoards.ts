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
/// <reference path="../localStorage/LocalStorage.ts" />
//#endregion

import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refCommonUtils = require('CommonUtils');
import _reportViewer = require('../templates/reportViewerControlV2');
import refVendorBillClient = require('services/client/VendorBillClient');
import refPurchaseOrderClient = require('services/client/PurchaseOrderClient');
import refCommonClient = require('services/client/CommonClient');
import refEmailParam = require('services/models/Email/EmailParam');
import refEnums = require('services/models/common/Enums');
import _refVendorBillModel = require('services/models/vendorBill/VendorBillId');
import _refPurchaseOrderEmailModel = require('services/models/purchaseOrder/PurchaseOrderEmail');
import _refPurchaseOrderBoardDataModel = require('services/models/purchaseOrder/PurchaseOrderBoard');
import _refPurchaseOrderSearchFilterModel = require('services/models/purchaseOrder/PurchaseOrderSearchFilter');

/***********************************************
   PURCHASE ORDER BOARDS VIEW MODEL
************************************************
** <summary>
** Purchase Order boards View Model.
** </summary>
** <createDetails>
** <id>US10859</id><by>Avinash</by> <date>23th July, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id>US10951</id><by>Satish</by> <date>24th July, 2014</date>
** <id>DE23332</id> <by>Dhaval Tamhane</by> <date>22-06-2016</date> <description>Removed code related to GetHeaderCountDataInPOBoard as it was not used</description>
** <id>US22964</id> <by>Baldev Singh Thakur</by> <date>13-07-2016</date> <description>Added new column to the grid for displaying UVB Owner details.</description>
** </changeHistory>

***********************************************/

class PurchaseOrderBoards {
	//#region Properties
	listProgress: KnockoutObservable<boolean> = ko.observable(false);
	public purchaseOrderBoardsGrid: _reportViewer.ReportViewerControlV2 = null;
	public headerOptions: _reportViewer.ReportHeaderOption = null;
	public grid: _reportViewer.ReportGridOption = null;
	public reportAction: _reportViewer.ReportAction = null;
	public reportData: KnockoutObservableArray<IPurchaseOrderBoard> = null;
	public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	public getReportData: (reportAction: _reportViewer.ReportAction) => any;
	public moveTorexnordBoard: () => any;
	public gridOptions: any;
	public reportType: number;

	public modeType = ko.observable();
	public gridData: KnockoutObservableArray<any> = ko.observableArray([]);
	localStorageKey: KnockoutObservable<string> = ko.observable('');
	//For show send agent mail and move to rexnord button
	isSendMailOrMoveTORexnord: KnockoutObservable<boolean> = ko.observable(false);
	// For search Filter
	private searchText: KnockoutObservable<string>;
	vendorBillClient: refVendorBillClient.VendorBillClient = new refVendorBillClient.VendorBillClient();
	purchaseOrderClient: refPurchaseOrderClient.PurchaseOrderClient = new refPurchaseOrderClient.PurchaseOrderClient();
	commonClientCommand: refCommonClient.Common = new refCommonClient.Common();
	emailParam: refEmailParam.Models.EmailParameters = new refEmailParam.Models.EmailParameters();
	sortCol: KnockoutObservable<string> = ko.observable('');
	sorttype: KnockoutObservable<string> = ko.observable('');
	isLoaded: KnockoutObservable<boolean> = ko.observable(false);
	isSearchFilterItemsData: KnockoutObservable<boolean> = ko.observable(false);
	searchFilter: KnockoutObservableArray<any> = ko.observableArray([]);
	searchFilterItems: Array<IPurchaseOrderSearchFilter> = new Array<_refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter>();
	searchFilterItemsForTotalCount: Array<IPurchaseOrderSearchFilter> = new Array<_refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter>();
	searchFilterItem: IPurchaseOrderSearchFilter = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
	commonUtils: CommonStatic = new Utils.Common();
	currentDateTime: KnockoutObservable<string> = ko.observable('');
	fromLocalStorage: KnockoutObservable<boolean> = ko.observable(false);

	totalUVBCount: KnockoutObservable<string> = ko.observable('');
	totalUVBCreatedToday: KnockoutObservable<string> = ko.observable('');
	totalUVBWorkedToday: KnockoutObservable<string> = ko.observable('');
	//#endregion Properties

	constructor() {
		var self = this;

		//#region Grid Settings

		self.headerOptions = new _reportViewer.ReportHeaderOption();
		self.headerOptions.reportName = "Purchase Orders";

		self.headerOptions.gridTitleHeader = " ";
		self.headerOptions.reportHeader = " ";
		self.searchText = ko.observable("");
		self.reportAction = new _reportViewer.ReportAction();
		self.grid = self.setGridOptions(self);

		//## Region Export Options.
		var exportOpt = ko.observableArray([
			{ exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
			{ exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) },
			{ exportType: _reportViewer.ExportOptions.FILTER, name: ko.observable(""), enabled: ko.observable(true) }]);

		self.headerOptions.reportExportOptions = new _reportViewer.ReportExportControl(exportOpt);
		self.headerOptions.reportExportOptions.getUrl = function (exp: _reportViewer.IExportOptions): any {
			var searchClient = new refVendorBillClient.SearchModel();
			searchClient.SearchValue = self.searchText().trim();
			searchClient.SortOrder = self.sorttype();
			searchClient.SortCol = self.sortCol();
			searchClient.PageNumber = 1;
			searchClient.PageSize = exp.exportType === 1 ? 2000 : self.gridOptions.pagingOptions.totalServerItems();

			self.searchFilterItems.forEach(item=> {
				if (item.FieldName === 'BillDateDisplay') {
					item.FieldName = "BillDate";
				}
				else if (item.FieldName === 'DeliveryDateDisplay') {
					item.FieldName = 'DeliveryDate'
				}
				else if (item.FieldName === 'AgeingDateDisplay' || item.FieldName === 'AgeingDisplay') {
					item.FieldName = 'AgeingDate'

						//
					if (item.FieldName === 'AgeingDateDisplay') {
						if (item.Operand === 4) {
							item.Operand = 3;
						}
						else if (item.Operand === 3) {
							item.Operand = 4;
						}

						var fromdate = new Date();
						var x = parseInt(item.SearchText);
						if (isNaN(x)) {
							item.SearchText = (self.commonUtils.formatDate(fromdate, 'mm/dd/yyyy')).toString();
						}
						else {
							var newFromDate = fromdate.setDate(fromdate.getDate() - x);
							item.SearchText = (self.commonUtils.formatDate(newFromDate, 'mm/dd/yyyy')).toString();
						}
					}
				}
			});

			searchClient.SearchFilterItems = self.searchFilterItems;
			searchClient.ExportType = exp.exportType;
			var filterModel = { ExportURL: "Accounting/ExportPurchaseOrderBoardDataWithFilterInExcel", FilterModel: searchClient };
			return filterModel;
		}
		//## Region Export Options End.

		self.setReportCriteria = (reportActionObj: _reportViewer.ReportAction) => {
			var reportActionObjtext = reportActionObj.gridOptions.sortInfo;
			if ((reportActionObj != undefined || reportActionObj != null) && (reportActionObj.gridOptions != undefined || reportActionObj.gridOptions != null) && (refSystem.isObject(reportActionObj.gridOptions.sortInfo())) && (reportActionObj.gridOptions.sortInfo().column != undefined || reportActionObj.gridOptions.sortInfo().column != null) && (reportActionObj.gridOptions.sortInfo().column.field != undefined || reportActionObj.gridOptions.sortInfo().column.field != null)) {
				self.sorttype(reportActionObj.gridOptions.sortInfo().direction);
				if (reportActionObj.gridOptions.sortInfo().column.field === 'BillDateDisplay') {
					self.sortCol("BillDate");
				}
				else if (reportActionObj.gridOptions.sortInfo().column.field === 'DeliveryDateDisplay') {
					self.sortCol("DeliveryDate");
				}
				else if (reportActionObj.gridOptions.sortInfo().column.field === 'AgeingDateDisplay') {
					self.sortCol("AgeingDate");
					var sortDirection = self.sorttype() === 'asc' ? 'desc' : 'asc';
					self.sorttype(sortDirection);
				} else if (reportActionObj.gridOptions.sortInfo().column.field === 'AgeingDisplay') {
					self.sortCol("AgeingDate");
				}
				else if (reportActionObj.gridOptions.sortInfo().column.field === 'TimeRemaining') {
					self.sortCol("MailExpiryDateTime");
				} else {
					self.sortCol(reportActionObj.gridOptions.sortInfo().column.field);
				}
			}
			else {
				self.sortCol("PRONo");
				self.sorttype("asc");
			}
			reportActionObjtext().column.field
			self.gridOptions = reportActionObj.gridOptions;
			if (self.reportAction != null) {
				if ((self.modeType() != reportActionObj.filter1selectedItemId) || (self.reportAction.view != reportActionObj.view) ||
					(reportActionObj.dateFrom != self.reportAction.dateFrom) || (reportActionObj.dateTo != self.reportAction.dateTo)) {
					//self.gridOptions.pagingOptions.currentPage(1);
				}
			}

			// Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
			// we don't want any data on page load so we commented getReportdata  function.
			// self.getReportData();
			self.reportAction = reportActionObj;

			// Flag is added to restrict multiple service calls.
			if (self.purchaseOrderBoardsGrid.reportColumnFilter.isFilterApply || self.purchaseOrderBoardsGrid.isPaginationChanged || self.purchaseOrderBoardsGrid.isSortingChanged) {
				if (self.isLoaded()) {
					self.getReportData(reportActionObj);
					self.purchaseOrderBoardsGrid.isPaginationChanged = false;
					self.purchaseOrderBoardsGrid.isSortingChanged = false;
				}
			}
		};

		//set local storage key by url
		var url = $(location).attr('href');
		var urlArray = url.split('/');
		var localStorageId = urlArray.pop().toString().replace(/#/g, "");
		self.localStorageKey(localStorageId);
		if (localStorageId === "PurchaseOrderBoard") {
			self.localStorageKey(localStorageId + "10");
		} else {
			self.localStorageKey(localStorageId);
		}

		self.getReportData = function (reportActionObj: _reportViewer.ReportAction) {
			var deferred = $.Deferred();
			var promise = deferred.promise();
			var pageno = 0;
			pageno = Number(self.gridOptions.pagingOptions.currentPage());
			if (pageno > 0) {
				self.purchaseOrderBoardsGrid.listProgress(true);
				if (self.purchaseOrderBoardsGrid.reportColumnFilter.isFilterApply) {
					var list = self.purchaseOrderBoardsGrid.reportColumnFilter.reportColumnFilters();
					self.searchFilterItems.removeAll();
					if (list.length > 0) {
						list.forEach((items) => {
							self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						if (items.selectedserviceType() != undefined && items.selectedOperatorType() != undefined) {
								self.searchFilterItem.Operand = +items.selectedOperatorType().opratorId;
								self.searchFilterItem.SearchText = items.searchText();

								if (items.selectedserviceType().field === 'BillDateDisplay') {
									self.searchFilterItem.FieldName = "BillDate";
								}
								else if (items.selectedserviceType().field === 'DeliveryDateDisplay') {
									self.searchFilterItem.FieldName = "DeliveryDate";
								}
								else if (items.selectedserviceType().field === 'AgeingDateDisplay' || items.selectedserviceType().field === 'AgeingDisplay') {
									self.searchFilterItem.FieldName = "AgeingDate";

									// to change the less than or greater than operands to vica versa
									// user search for > 3 then (today - 3) > 3 which will return the result of three days back from today, but user has requested for age is greater than 3 days.
									if (items.selectedserviceType().field === 'AgeingDateDisplay') {
										if (self.searchFilterItem.Operand === 4) {
											self.searchFilterItem.Operand = 3;
										}
										else if (self.searchFilterItem.Operand === 3) {
											self.searchFilterItem.Operand = 4;
										}

										var fromdate = new Date();
										var x = parseInt(items.searchText());
										if (isNaN(x)) {
											self.searchFilterItem.SearchText = (self.commonUtils.formatDate(fromdate, 'mm/dd/yyyy')).toString();
										}
										else {
											var newFromDate = fromdate.setDate(fromdate.getDate() - x);
											self.searchFilterItem.SearchText = (self.commonUtils.formatDate(newFromDate, 'mm/dd/yyyy')).toString();
										}
									}
								}
								else {
									self.searchFilterItem.FieldName = items.selectedserviceType().field;
								}

								self.searchFilterItems.push(self.searchFilterItem);
							}
							if (self.searchFilterItems.length > 0 || items.selectedserviceType() != undefined) {
								self.isSearchFilterItemsData(true);
							} else {
								self.isSearchFilterItemsData(false);
							}
						});
					}
					self.searchText('');
					self.gridOptions.filterOptions.filterText('');
				}
				else {
					var list = self.purchaseOrderBoardsGrid.reportColumnFilter.reportColumnFilters();
					self.searchFilterItems.removeAll();
					if (list.length > 0) {
						list.forEach((items) => {
							self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						if (items.selectedserviceType() != undefined && items.selectedOperatorType() != undefined) {
								if (items.selectedserviceType().field === 'BillDateDisplay') {
									self.searchFilterItem.FieldName = "BillDate";
								}
								else if (items.selectedserviceType().field === 'DeliveryDateDisplay') {
									self.searchFilterItem.FieldName = "DeliveryDate";
								}
								else if (items.selectedserviceType().field === 'AgeingDateDisplay' || items.selectedserviceType().field === 'AgeingDisplay') {
									self.searchFilterItem.FieldName = "AgeingDate";

									if (items.selectedserviceType().field === 'AgeingDateDisplay') {
										if (self.searchFilterItem.Operand === 4) {
											self.searchFilterItem.Operand = 3;
										}
										else if (self.searchFilterItem.Operand === 3) {
											self.searchFilterItem.Operand = 4;
										}
									}
								}
								else {
									self.searchFilterItem.FieldName = items.selectedserviceType().field;
								}

								self.searchFilterItem.Operand = +items.selectedOperatorType().opratorId;
								self.searchFilterItem.SearchText = items.searchText();
								self.searchFilterItems.push(self.searchFilterItem);
							}
							if (self.searchFilterItems.length > 0 || items.selectedserviceType() != undefined) {
								self.isSearchFilterItemsData(true);
							} else {
								self.isSearchFilterItemsData(false);
							}
						});
					}
				}
				var successCallBack = data => {
					self.totalUVBCount(data.TotalRows);
					self.gridData(data.PurchaseOrdersElastic);

					data.PurchaseOrdersElastic.forEach(function (item) {
						if (item.TimeRemaining) {
							if (item.TimeRemaining.toString() === '0') {
								item.TimeRemaining = "";
							} else {
								var timeWithoutSeconds = item.TimeRemaining.toString().split(':');
								item.TimeRemaining = timeWithoutSeconds[0] + ':' + timeWithoutSeconds[1];
							}
						}
					});
					self.setPagingData(data.PurchaseOrdersElastic, data.TotalRows, self.gridOptions.pagingOptions.pageSize());

					self.purchaseOrderBoardsGrid.listProgress(false);
					deferred.resolve(data, reportActionObj.view);
					self.purchaseOrderBoardsGrid.invokeHighlight(self.searchText());
				}
					var faliureCallBack = message => {
					self.purchaseOrderBoardsGrid.listProgress(false);
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}

						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ErrorOccurredWhileFetchingPOList, "error", null, toastrOptions);
				}
               var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems }
		       var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.PurchaseOrderBoard, IsFilterApplied: self.purchaseOrderBoardsGrid.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), FromLocalStorage: self.fromLocalStorage() };
				self.vendorBillClient.getPurchaseOrdersDetails(filterDataToSave, successCallBack, faliureCallBack, self.gridOptions.pagingOptions);
				//to block unwanted server calls
				self.purchaseOrderBoardsGrid.isPaginationChanged = false;
				self.purchaseOrderBoardsGrid.isSortingChanged = false;
			}

			return promise;
		};

		self.purchaseOrderBoardsGrid = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);

		self.purchaseOrderBoardsGrid.onFilterChange = self.setReportCriteria;
		self.purchaseOrderBoardsGrid.ForceChange();

		// redirects to purchase order edit details page
		self.purchaseOrderBoardsGrid.onGridColumnClick = obj => {
			var vendorBillId = obj.VendorBillId;
			_app.trigger("openPurchaseOrder", vendorBillId, obj.PRONo, (callback) => {
				if (!callback) {
					return;
				}
			});
		}

		//for search filter
		self.purchaseOrderBoardsGrid.onSearchTextChange = (reportViewer, newSearchValue) => {
			if (newSearchValue.length >= 3 || newSearchValue.length == 0) {
				var data: Array<IPurchaseOrderBoard> = new Array<_refPurchaseOrderBoardDataModel.Models.PurchaseOrderBoard>();
				var searchString = newSearchValue;
				//to blank the grid data
				self.setPagingData(data, 0, self.gridOptions.pagingOptions.pageSize());
				self.searchText(searchString.trim());
				if (!self.purchaseOrderBoardsGrid.reportColumnFilter.isFilterApply) {
					self.purchaseOrderBoardsGrid.reportColumnFilter.clearAll();
				}
				self.purchaseOrderBoardsGrid.reportColumnFilter.isFilterApply = false;

				self.getReportData(self.reportAction);
				self.gridOptions.pagingOptions.currentPage(1);
			}
		};

		//## After selection change re-assign the fields value
		self.purchaseOrderBoardsGrid.afterSelectionChange = function (items: KnockoutObservableArray<any>) {
			var selectedRowCount = items.length;
			if (selectedRowCount > 0) {
				self.isSendMailOrMoveTORexnord(true);
			}
			else {
				self.isSendMailOrMoveTORexnord(false);
			}
		}

		// for opening  rexnord Board
		self.moveTorexnordBoard = () => {
			// open rexnord board
			_app.trigger("openRexnordBoard");
		}

		return self;
	}

	//#region Public Methods
	public reloadPage() {
		var self = this;
		self.listProgress(true);
		LocalStorageController.Set(self.localStorageKey(), undefined);
		LocalStorageController.Set(self.localStorageKey() + 'lastReloadDateTime', undefined);
		self.compositionComplete();
	}

	//set Date Time for record of last refreshed
	public setDateTimeOfReload() {
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

	//clearing all filter data
	public onClickClearAll() {
		var self = this;
		self.purchaseOrderBoardsGrid.reportColumnFilter.clearAll();
		self.purchaseOrderBoardsGrid.reportColumnFilter.applyFilter();
		self.isSearchFilterItemsData(false);
		//$('.gridPOBord').removeClass('margin-top--26');
	}

	// To send the to Agent
	public onSendAgentMail(reportActionObj: _reportViewer.ReportAction) {
		var self = this;
		var selectOpt: Array<IPurchaseOrderBoard> = reportActionObj.gridOptions.selectedItems();
		var purchaseOrderEmail = new _refPurchaseOrderEmailModel.Models.PurchaseOrderEmail();
		purchaseOrderEmail.PurchaseOrderData = new Array<_refPurchaseOrderBoardDataModel.Models.PurchaseOrderBoard>();
		selectOpt.forEach((item) => {
			purchaseOrderEmail.PurchaseOrderData.push(item);
		});

		// To refresh the content after sending the mail
		var refresh = () => {
			self.compositionComplete();
			self.isSendMailOrMoveTORexnord(false);
			self.resetGridSelection(self);
		};
		//Call the dialog Box functionality to open a Popup
		_app.showDialog('purchaseOrder/PurchaseOrderAgentEmail', purchaseOrderEmail, 'slideDown').then(refresh);
	}

	// Move to Rexnord Board
	public onMoveToRexnordBoard(reportActionObj: _reportViewer.ReportAction) {
		var self = this;
		var selectOpt: Array = reportActionObj.gridOptions.selectedItems();

		//## Array to Hold Selected VendorBill Ids
		var purchaseOrderIds: _refVendorBillModel.Models.VendorBillId = new _refVendorBillModel.Models.VendorBillId(0);
		//## Success Function.
		var successCallBack = function () {
			toastr.clear();
			setTimeout(() => {
				var actionButtons: Array<IToastrActionButtonOptions> = [];
				actionButtons.push({
					actionButtonName: "Rexnord Board",
					actionClick: self.moveTorexnordBoard
				});

				var toastrOptions: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 30,
					fadeOut: 30,
					typeOfAlert: "",
					title: "",
					actionButtons: actionButtons
				}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, "Record(s) moved to the ", "success", null, toastrOptions);
			}, 500);

			//To Refresh the grid
			self.isSendMailOrMoveTORexnord(false);
			self.getReportData(self.reportAction);
		},
			//## Failure Function.
			failureCallBack = function () {
			};

		//## Send Selected VendorBill Id's to move to MAS.

		selectOpt.forEach(function (item) {
			purchaseOrderIds.BillIds.push(item["VendorBillId"]);
		});

		self.purchaseOrderClient.moveFromVolumeCustomerBills(purchaseOrderIds, successCallBack, failureCallBack);
	}

	//#endregion Public Methods

	//#region Life Cycle Event
	// Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
	public attached() {
		_app.trigger('viewAttached');
	}

	public activate() {
		return true;
	}

	public deactivate() {
		var self = this;
		var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems }
		       var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.PurchaseOrderBoard, IsFilterApplied: self.purchaseOrderBoardsGrid.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), isLoaded: true };
		LocalStorageController.Set(self.localStorageKey(), filterDataToSave);
		self.setDateTimeOfReload();

		self.cleanup();
	}

	public beforeBind() {
		var self = this
			self.load();
	}

	public compositionComplete() {
		var self = this;
		var successCallBack = data => {
			self.searchText('');
			var filterlist = data.Filters;
			self.gridOptions.pagingOptions.pageSize(data.PageSize);
			self.gridOptions.pagingOptions.currentPage(1);

			self.searchFilterItems.removeAll();
			if (filterlist.length > 0 && filterlist[0].FieldName != null) {
				filterlist.forEach((items) => {
					self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						self.searchFilterItem.FieldName = items.FieldName;
					self.searchFilterItem.Operand = items.Operand;
					self.searchFilterItem.SearchText = items.SearchText;
					self.searchFilterItems.push(self.searchFilterItem);
				});
				self.purchaseOrderBoardsGrid.reportColumnFilter.addFilter(self.searchFilterItems);
				if (self.searchFilterItems.length > 0) {
					self.isSearchFilterItemsData(true);
					//$('.gridPOBord').addClass('margin-top--26');
				} else {
					self.isSearchFilterItemsData(false);
					//$('.gridPOBord').removeClass('margin-top--26');
				}
			}
			self.gridOptions.filterOptions.filterText('');
			self.searchText('');
			if (self.isLoaded()) {
				self.getReportData(self.reportAction);
			}
			self.isLoaded(true);
			self.fromLocalStorage(true);
			//to block unwanted server calls
			self.purchaseOrderBoardsGrid.isPaginationChanged = false;
			self.purchaseOrderBoardsGrid.isSortingChanged = false;
		};

		if (!LocalStorageController.Get(self.localStorageKey())) {
			self.commonClientCommand.GetUserGridSettings(refEnums.Enums.FilterViewName.PurchaseOrderBoard, successCallBack);
		} else {
			//using to show clear filter button after saving filtered data in local storage and switching between tab
			var filteredData = LocalStorageController.Get(self.localStorageKey());
			if (filteredData.UserGridSetting.Filters.length > 0) {
				self.isSearchFilterItemsData(true);
				//$('.gridPOBord').addClass('margin-top--26');
			} else {
				self.isSearchFilterItemsData(false);
				//$('.gridPOBord').removeClass('margin-top--26');
			}
		}
	}
	//#endregion

	//#region Private Methods
	private setPagingData(data, page, pageSize) {
		var self = this;
		self.gridOptions.data(data);
		self.gridOptions.data.valueHasMutated()
		self.gridOptions.pagingOptions.totalServerItems(page);
	}

	// Sets the options required properties of the grid
	private setGridOptions(self: PurchaseOrderBoards): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = true;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("PurchaseOrderBoardGrid");
		grOption.data = <any> self.reportData;
		grOption.columnDefinition = self.setGridColumnDefinitions();
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
		grOption.selectWithCheckboxOnly = true;
		grOption.displaySelectionCheckbox = true;
		grOption.multiSelect = true;
		grOption.enablePaging = false;
		grOption.viewPortOptions = false;
		grOption.enableSaveGridSettings = true;
		grOption.useClientSideFilterAndSort = false;
		grOption.showColumnMenu = true;

		return grOption;
	}

	private resetGridSelection(self) {
		window.kg.toggleSelection(false);
	}

	// Sets the columns in the grid
	private setGridColumnDefinitions() {
		var self = this;
		//## PRO Cell Template.
		var proCellTemplate = '<div data-bind="style: {\'background-color\': $parent.entity[\'IsReviewed\']===true ? \'yellow\' : \'\' ,\'height\': \'29px\',\'width\': \'100%\', \'padding-right\': \'2px\'}, attr: { title: $data.getProperty($parent)}"><a style="cursor: pointer" data-bind="text: $parent.entity[\'PRONo\'], click: function() { $userViewModel.onGridColumnClick($parent.entity) }" /></div>';
		var RightAlignCurrencyTemplate = '<div data-bind="style: {\'background-color\': $parent.entity[\'IsReviewed\']===true ? \'yellow\' : \'\' ,\'height\': \'29px\',\'width\': \'100%\', \'padding-right\': \'2px\'} , attr: { \'class\': \'kgCellText colt\' + $index() + \' text-right \', title: $data.getProperty($parent)}, html: \'$ \' + $data.getProperty($parent).toFixed(2)"></div>';
		var proYellowBGTemplate = '<div type="text" data-bind="style: {\'background-color\': $parent.entity[\'IsReviewed\']===true ? \'yellow\' : \'\' ,\'height\': \'29px\',\'width\': \'100%\', \'padding-right\': \'2px\'} , attr: { \'class\': \'kgCellText colt\' + $index() + \'\', title: $data.getProperty($parent)}, html: \'\' + $data.getProperty($parent)"></div>';
		// ReSharper disable once AssignedValueIsNeverUsed , cellTemplate: proYellowBGTemplate
		var colDefinition: Array = [];

		colDefinition = [
			{ field: 'PRONo', displayName: 'PRO #', width: 100, cellTemplate: proCellTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'BillDateDisplay', displayName: 'Bill Date', width: 95, cellTemplate: proYellowBGTemplate, type: _reportViewer.DataTypes.DateTime },
			//{ field: 'AgeingDateDisplay', displayName: 'Ageing', width: 120, cellTemplate: proYellowBGTemplate, type: _reportViewer.DataTypes.Numeric },
			{ field: 'AgeingDisplay', displayName: 'Aging Date', width: 120, cellTemplate: proYellowBGTemplate, type: _reportViewer.DataTypes.DateTime },
			{ field: 'MainVendorBOLNo', displayName: 'EDI BOL', width: 80, cellTemplate: proYellowBGTemplate, type: _reportViewer.DataTypes.String },
			// ###START: US22964
			{ field: 'UVBOwner', displayName: 'UVB Ownership', width: 100, cellTemplate: proYellowBGTemplate, type: _reportViewer.DataTypes.String },
			// ###END: US22964
			{ field: 'CarrierName', displayName: 'Carrier Name', width: 130, cellTemplate: proYellowBGTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'ShipperName', displayName: 'Shipper Name', width: 150, cellTemplate: proYellowBGTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'Origin', displayName: 'Shipper Zip', width: 100, cellTemplate: proYellowBGTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'ConsigneeName', displayName: 'Consignee Name', width: 150, cellTemplate: proYellowBGTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'Destination', displayName: 'Consignee Zip', width: 100, cellTemplate: proYellowBGTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'Amount', displayName: 'Amount', cellTemplate: RightAlignCurrencyTemplate, width: 80, type: _reportViewer.DataTypes.Numeric },
			{ field: 'DeliveryDateDisplay', displayName: 'Delivery Date', width: 95, cellTemplate: proYellowBGTemplate, type: _reportViewer.DataTypes.DateTime },
			{ field: 'ProcessDetails', displayName: 'Process Details', width: 150, visible: false, cellTemplate: proYellowBGTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'ReviewRemark', displayName: 'Review Remark', width: 150, cellTemplate: proYellowBGTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'IsReviewed', displayName: 'Is Reviewed', width: 150, visible: false, isRemovable: false, cellTemplate: proYellowBGTemplate, type: _reportViewer.DataTypes.Boolean },
			{ field: 'ForeignCustomerName', displayName: 'Customer (FBOL)', width: 150, cellTemplate: proYellowBGTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'TimeRemaining', displayName: 'Time Remaining', width: 150, cellTemplate: proYellowBGTemplate, type: _reportViewer.DataTypes.DateTime, dntApplyFilter: true },
		];
		return colDefinition;
	}

	private load() {
		var self = this;
		//server call on change page size and change page number
		var pageRecord = LocalStorageController.Get(self.localStorageKey());
		if (pageRecord != null) {
			self.gridOptions.pagingOptions.currentPage(pageRecord.PageNo);
			self.gridOptions.pagingOptions.pageSize(pageRecord.UserGridSetting.PageSize);
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
				self.purchaseOrderBoardsGrid.reportColumnFilter.addFilter(self.searchFilterItems);
			};
			if (typeof pageRecord.isLoaded !== "undefined") {
				self.isLoaded(pageRecord.isLoaded);
			}
			self.gridOptions.filterOptions.filterText(pageRecord.GridSearchText);
			self.searchText(pageRecord.GridSearchText);
			self.fromLocalStorage(true);
		}
		self.getReportData(self.reportAction);
		//to block unwanted server calls
		self.purchaseOrderBoardsGrid.isPaginationChanged = false;
		self.purchaseOrderBoardsGrid.isSortingChanged = false;
	}

	public cleanup() {
		var self = this;
		self.purchaseOrderBoardsGrid.cleanup("PurchaseOrderBoardGrid");

		var grid = ko.dataFor($("#PurchaseOrderBoardGrid > div")[0]);

		//for (var prop in grid.eventProvider) {
		//	delete grid.eventProvider[prop];
		//}

		for (var prop in grid) {
			delete grid[prop];
		}
		delete grid;

		for (var property in self) {
			if (property != "cleanup")
				delete self[property];
		}

		delete self;
	}
	//#endregion Private Methods
}

return PurchaseOrderBoards;