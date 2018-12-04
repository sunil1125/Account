/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../services/models/TypeDefs/Boards.d.ts" />
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
//#endregion

import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refCommonUtils = require('CommonUtils');
import _reportViewer = require('../templates/reportViewerControlV2');
import refEnums = require('services/models/common/Enums');
import refBoardsClient = require('services/client/BoardsClient');
import refDisputedBillParameter = require('services/models/Board/DisputedBillParameter');
import _refPurchaseOrderSearchFilterModel = require('services/models/purchaseOrder/PurchaseOrderSearchFilter');
import refCommonClient = require('services/client/CommonClient');
import refVendorBillClient = require('services/client/VendorBillClient');
/***********************************************
   BOARD RE-QUOTE VIEWMODEL
************************************************
** <summary>
** Board Re-Quote View Model.
** </summary>
** <createDetails>
** <id>US12941</id><by>Chadnan</by> <date>OCT/2014</date>
** </createDetails>
** <changeHistory>
** <id>US22470</id> <by>Dhaval Tamhane</by> <date>18-07-2016</date> <description>Tariff Start Date and Tariff Number related changes</description>
** </changeHistory >

***********************************************/

export class BoardReQuoteViewModel {
	reportClient: any = null;
	listProgress: KnockoutObservable<boolean> = ko.observable(false);
	disputedBillParameter: refDisputedBillParameter.Models.DisputedBillParameter

	//#region Public report viewer members
	public requoteBoardContainer: _reportViewer.ReportViewerControlV2 = null;
	public headerOptions: _reportViewer.ReportHeaderOption = null;
	public grid: _reportViewer.ReportGridOption = null;
	public reportAction: _reportViewer.ReportAction = null;
	public reportData: KnockoutObservableArray<IDisputeBoardDetails> = null;
	public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	public getReportData: (reportAction: _reportViewer.ReportAction) => any;
	public gridOptions: any;
	public reportType: number;
	public modeType = ko.observable();
	private searchText: KnockoutObservable<string>;
	private boardReportRequest: any = null;
	sortCol: KnockoutObservable<string> = ko.observable('');
	sorttype: KnockoutObservable<string> = ko.observable('');
	isLoaded: KnockoutObservable<boolean> = ko.observable(false);
	fromLocalStorage: KnockoutObservable<boolean> = ko.observable(false);
	searchFilterItems: Array<IPurchaseOrderSearchFilter> = new Array<_refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter>();
	searchFilterItem: IPurchaseOrderSearchFilter = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
	localStorageKey: KnockoutObservable<string> = ko.observable('');
	commonClientCommand: refCommonClient.Common = new refCommonClient.Common();
	currentDateTime: KnockoutObservable<string> = ko.observable('');
	isSearchFilterItemsData: KnockoutObservable<boolean> = ko.observable(false);
	commonUtils: CommonStatic = new Utils.Common();
	//#endregion Public report viewer members

	constructor() {
		var self = this;
		self.headerOptions = new _reportViewer.ReportHeaderOption();
		self.headerOptions.reportHeader = " ";
		self.headerOptions.reportName = "Dispute Board Details Report";
		self.headerOptions.gridTitleHeader = " ";
		self.searchText = ko.observable("");
		self.reportAction = new _reportViewer.ReportAction();
		self.grid = self.setGridOptions(self);
		self.reportClient = new refBoardsClient.BoardsClientCommands();

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
				if (item.FieldName === 'PickupDateDisplay') {
					item.FieldName = "PickupDate";
				}
				//// ###START: US22470
				else if (item.FieldName === 'TariffStartDateDisplay') {
					item.FieldName = 'TariffStartDate'
				}
				//// ###END: US22470
				else if (item.FieldName === 'ReviewedDateDisplay') {
					item.FieldName = 'ReviewedDate'
				}
				else if (item.FieldName === 'ShipmentTypeDisplay') {
					item.FieldName = 'ShipmentMode'
				}
				else if (item.FieldName === 'CostAdjustmentDisplay') {
					item.FieldName = 'CostAdjustment'
				}
				else if (item.FieldName === 'CustomerTypeName') {
					item.FieldName = 'CustomerTypeDisplay'
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
				else { }
			});

			searchClient.SearchFilterItems = self.searchFilterItems;
			searchClient.ExportType = exp.exportType;
			var filterModel = { ExportURL: "Accounting/ExportReqouteDataWithFilterInExcel", FilterModel: searchClient };
			return filterModel;
		}
		//## Region Export Options End.

		//set local storage key by url
		var url = $(location).attr('href');
		var urlArray = url.split('/');
		var localStorageId = urlArray.pop().toString().replace(/#/g, "");
		self.localStorageKey(localStorageId);
		if (localStorageId === "ReQuote") {
			self.localStorageKey(localStorageId + "27");
		} else {
			self.localStorageKey(localStorageId);
		}

		self.setReportCriteria = (reportActionObj: _reportViewer.ReportAction) => {
			if ((reportActionObj != undefined || reportActionObj != null) && (reportActionObj.gridOptions != undefined || reportActionObj.gridOptions != null) && (refSystem.isObject(reportActionObj.gridOptions.sortInfo())) && (reportActionObj.gridOptions.sortInfo().column != undefined || reportActionObj.gridOptions.sortInfo().column != null) && (reportActionObj.gridOptions.sortInfo().column.field != undefined || reportActionObj.gridOptions.sortInfo().column.field != null)) {
				self.sortCol(reportActionObj.gridOptions.sortInfo().column.field);
				self.sorttype(reportActionObj.gridOptions.sortInfo().direction);
				if (self.sortCol() == 'PickupDateDisplay') {
					self.sortCol('PickupDate');
				}
				//// ###START: US22470
				else if (self.sortCol() == 'TariffStartDateDisplay') {
					self.sortCol("TariffStartDate");
				}
				//// ###END: US22470
				else if (self.sortCol() == 'ReviewedDateDisplay') {
					self.sortCol('ReviewedDate');
				}
				else if (self.sortCol() == 'ShipmentTypeDisplay') {
					self.sortCol('ShipmentMode');
				}
				else if (self.sortCol() == 'CostAdjustmentDisplay') {
					self.sortCol('CostAdjustment');
				}
				else if (self.sortCol() == 'AgeingDateDisplay') {
					self.sortCol('AgeingDate');
					var sortDirection = self.sorttype() === 'asc' ? 'desc' : 'asc';
					self.sorttype(sortDirection);
				}
				else if (self.sortCol() == 'AgeingDisplay') {
					self.sortCol('AgeingDate');
				}
				else if (reportActionObj.gridOptions.sortInfo().column.field === 'CustomerTypeName') {
					self.sortCol("ProcessFlow");
				}
			}
			else {
				self.sortCol("PRONumber");
				self.sorttype("desc");
			}
			if (reportActionObj.filter1selectedItemId == undefined || reportActionObj.filter1selectedItemId == 0) {
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectModeFromTheList, "info", null, toastrOptions);

				self.requoteBoardContainer.listProgress(false);
				self.requoteBoardContainer.selectedFilter1Item(self.modeType());
			}
			else {
				self.gridOptions = reportActionObj.gridOptions;

				// Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
				// we don't want any data on page load so we commented getReportdata  function.
				// Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
				if (self.modeType() != reportActionObj.filter1selectedItemId) {
					self.modeType(reportActionObj.filter1selectedItemId);
					self.requoteBoardContainer.columnDefinition(self.setGridColumnDefinitions());
				}

				self.reportAction = reportActionObj;
				if (self.isLoaded()) {
					self.getReportData(self.reportAction);
				}
			}
		};

		self.getReportData = (reportActionObj: _reportViewer.ReportAction) => {
			var deferred = $.Deferred();
			var promise = deferred.promise();
			// ReSharper disable once AssignedValueIsNeverUsed
			var pageno = 0;
			pageno = Number(self.gridOptions.pagingOptions.currentPage());
			if (pageno > 0) {
				if (self.requoteBoardContainer.reportColumnFilter.isFilterApply) {
					self.searchText('');
					self.gridOptions.filterOptions.filterText('');
				}

				var list = self.requoteBoardContainer.reportColumnFilter.reportColumnFilters();
				self.searchFilterItems.removeAll();
				if (list.length > 0) {
					list.forEach((items) => {
						self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						if (items.selectedserviceType() != undefined && items.selectedOperatorType() != undefined) {
							self.searchFilterItem.Operand = +items.selectedOperatorType().opratorId;
							self.searchFilterItem.SearchText = items.searchText();

							if (items.selectedserviceType().field === 'PickupDateDisplay') {
								self.searchFilterItem.FieldName = "PickupDate";
							}
							//// ###START: US22470
							else if (items.selectedserviceType().field === 'TariffStartDateDisplay') {
								self.searchFilterItem.FieldName = "TariffStartDate";
							}
							//// ###END: US22470
							else if (items.selectedserviceType().field === 'ReviewedDateDisplay') {
								self.searchFilterItem.FieldName = "ReviewedDate";
							}
							else if (items.selectedserviceType().field === 'CostAdjustmentDisplay') {
								self.searchFilterItem.FieldName = "CostAdjustment";
							}
							else if (items.selectedserviceType().field === 'ShipmentTypeDisplay') {
								self.searchFilterItem.FieldName = "ShipmentMode";
							}
							else if (items.selectedserviceType().field === 'CustomerTypeName') {
								self.searchFilterItem.FieldName = "CustomerTypeDisplay";
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
							//$('#reQuote').addClass('margin-top--30');
						} else {
							self.isSearchFilterItemsData(false);
							//$('#reQuote').removeClass('margin-top--30');
						}
					});
				}

				self.requoteBoardContainer.listProgress(true);
				var deferred = $.Deferred();
				var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems }
		     var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.RequoteBoard, IsFilterApplied: self.requoteBoardContainer.reportColumnFilter.isFilterApply, GridSearchText: null, PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), FromLocalStorage: self.fromLocalStorage() };

				self.reportClient.getRequoteBoardDetails(filterDataToSave,
					(data) => {
						self.setPagingData(data.RequoteListResponse, data.NumberOfRows, self.gridOptions.pagingOptions.pageSize());
						self.requoteBoardContainer.listProgress(false);

						deferred.resolve(data, reportActionObj.view);
					},
					() => {
						self.requoteBoardContainer.listProgress(false);
					}, self.gridOptions.pagingOptions);
			}
			return promise;
		};

		self.requoteBoardContainer = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
		self.requoteBoardContainer.onFilterChange = self.setReportCriteria;
		self.requoteBoardContainer.ForceChange();

		// To open vendor Bill
		self.requoteBoardContainer.onProNumberClick = function (shipmentObj) {
			var vendorBillId = shipmentObj.VendorBillId;
			//Only for Unique identificaton or heighlight selected row
			LocalStorageController.Set('ReQuoteBoardBOLNumber', undefined);
			LocalStorageController.Set('ReQuoteBoardBOLNumber', vendorBillId);
			_app.trigger("openVendorBill", vendorBillId, shipmentObj.PRONumber, (callback) => {
				if (!callback) {
					return;
				}
			});
		}

		// TO open sales Order
		self.requoteBoardContainer.onBolNumberClick = function (shipmentObj) {
			var salesOrderId = shipmentObj.ShipmentId;
			//Only for Unique identificaton or heighlight selected row
			LocalStorageController.Set('ReQuoteBoardBOLNumber', undefined);
			var VendorBillId = shipmentObj.VendorBillId;
			LocalStorageController.Set('ReQuoteBoardBOLNumber', VendorBillId);
			_app.trigger("openSalesOrder", salesOrderId, shipmentObj.BOLNumber, (callback) => {
				if (!callback) {
					return;
				}
			});
		}
		return self;
	}

	//#region Private Methods
	private setGridOptions(self: BoardReQuoteViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("BoardReQuoteDetailsGrid");
		grOption.data = <any> self.reportData;
		grOption.columnDefinition = self.setGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "PRONumber",
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
		// ReSharper disable once AssignedValueIsNeverUsed
		var colDefinition: Array = [];

		//## PRO Cell Template.
		var RightAlignCurrencyTemplate = '<div data-bind=" attr: { \'class\': \'kgCellText colt\' + $index() + \' text-right \', title: \'$ \' +$data.getProperty($parent).toFixed(2)}, html: \'$ \' + $data.getProperty($parent).toFixed(2), style: {\'background-color\': $parent.entity[\'IsLastSeen\']===true ? \'#b6c1ff\' : \'\' ,\'height\': \'29px\',\'width\': \'100%\', \'padding-right\': \'2px\'}"></div>';
		var proLastSeenTemplate = '<div type="text" data-bind="style: {\'background-color\': $parent.entity[\'IsLastSeen\']===true ? \'#b6c1ff\' : \'\' ,\'height\': \'29px\',\'width\': \'100%\', \'padding-right\': \'2px\'} , attr: { \'class\': \'kgCellText colt\' + $index() + \'\', title: $data.getProperty($parent)}, html: $data.getProperty($parent)"></div>';
		var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'PRONumber\'], click: function() { $userViewModel.onProNumberClick($parent.entity) }, attr:{ title: $data.getProperty($parent)}, style: {\'background-color\': $parent.entity[\'IsLastSeen\']===true ? \'#b6c1ff\' : \'\' ,\'height\': \'29px\',\'width\': \'100%\', \'padding-right\': \'2px\'}" />';
		var bolCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'BOLNumber\'], click: function() { $userViewModel.onBolNumberClick($parent.entity) }, attr:{ title: $data.getProperty($parent)}, style: {\'background-color\': $parent.entity[\'IsLastSeen\']===true ? \'#b6c1ff\' : \'\' ,\'height\': \'29px\',\'width\': \'100%\', \'padding-right\': \'2px\'}" />';
		colDefinition = [
			{ field: 'BOLNumber', displayName: 'BOL #', width: 85, cellTemplate: bolCellTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'PRONumber', displayName: 'PRO #', width: 105, cellTemplate: proCellTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'CarrierName', displayName: 'Carrier', width: 260, cellTemplate: proLastSeenTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'CompanyName', displayName: 'Customer', width: 135, cellTemplate: proLastSeenTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'CarrierQuoteNumber', displayName: 'Carrier Quote #', width: 135, cellTemplate: proLastSeenTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'SalesRepName', displayName: 'Sales Agent', width: 210, cellTemplate: proLastSeenTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'PickupDateDisplay', displayName: 'Pickup Date', width: 90, cellTemplate: proLastSeenTemplate, type: _reportViewer.DataTypes.DateTime },
			//// ###START: US22470
			{ field: 'TariffStartDateDisplay', displayName: 'Tariff Start Date', width: 100, cellTemplate: proLastSeenTemplate, type: _reportViewer.DataTypes.DateTime },
			{ field: 'TariffNumber', displayName: 'Tariff #', width: 150, cellTemplate: proLastSeenTemplate, type: _reportViewer.DataTypes.String },
			//// ###END: US22470
			{ field: 'ReviewedDateDisplay', displayName: 'Reviewed Date', width: 90, cellTemplate: proLastSeenTemplate, type: _reportViewer.DataTypes.DateTime },
			{ field: 'ReviewedBy', displayName: 'Reviewed By', width: 110, cellTemplate: proLastSeenTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'CostAdjustmentDisplay', displayName: 'Cost Difference', width: 100, cellTemplate: RightAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric },
			{ field: 'ShipmentModeDescription', displayName: 'Mode', width: 60, cellTemplate: proLastSeenTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'CustomerTypeName', displayName: 'Customer Type', width: 90, cellTemplate: proLastSeenTemplate, type: _reportViewer.DataTypes.String },
			{ field: 'ProcessDetails', displayName: 'Process Log', width: 120, cellTemplate: proLastSeenTemplate, type: _reportViewer.DataTypes.String },
			//{ field: 'AgeingDateDisplay', displayName: 'Ageing', width: 120, type: _reportViewer.DataTypes.Numeric },
			{ field: 'AgeingDisplay', displayName: 'Aging Date', width: 120, cellTemplate: proLastSeenTemplate, type: _reportViewer.DataTypes.DateTime }
		];

		return colDefinition;
	}

	private setPagingData(data, page, pageSize) {
		var self = this;
		//var lastIndex = data.lastIndexOf();
		var VendorBillId = LocalStorageController.Get('ReQuoteBoardBOLNumber');
		var indexes = $.map(data, function (obj, index) {
			if (obj.VendorBillId == VendorBillId) {
				obj.IsLastSeen = true;
				return index;
			}
		});
		self.gridOptions.data(data);
		self.gridOptions.data.valueHasMutated();
		self.gridOptions.pagingOptions.totalServerItems(page);
	}

	//#region Private Methods
	public reloadPage() {
		var self = this;
		self.listProgress(true);
		LocalStorageController.Set(self.localStorageKey(), undefined);
		LocalStorageController.Set(self.localStorageKey() + 'lastReloadDateTime', undefined);
		self.beforeBind();
	}

	//clearing all filter data
	public onClickClearAll() {
		var self = this;
		self.requoteBoardContainer.reportColumnFilter.clearAll();
		self.requoteBoardContainer.reportColumnFilter.applyFilter();
		self.isSearchFilterItemsData(false);
		//$('#reQuote').removeClass('margin-top--30');
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

	//#endregion

	//#region Life Cycle Event
	// Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
	public attached() {
		_app.trigger('viewAttached');
	}

	public activate() {
		return true;
	}

	public deactivate() {
		window.kg.selectedCarrier = undefined;
		var self = this;
		var scroll = $(document).scrollTop();
		var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems }
		var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.RequoteBoard, IsFilterApplied: self.requoteBoardContainer.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), isLoaded: true, scrollPosition: scroll };
		LocalStorageController.Set(self.localStorageKey(), filterDataToSave);

		self.cleanup();
	}

	public beforeBind() {
		var self = this
			self.load();
	}

	private load() {
		var self = this;
		//server call on change page size and change page number
		var pageRecord = LocalStorageController.Get(self.localStorageKey());
		if (pageRecord != null) {
			$("html, body").animate({ scrollTop: pageRecord.scrollPosition }, "slow");
			//$("html").animate({ scrollTop: pageRecord.scrollPosition }, "slow");
			//$(window).scrollTop(pageRecord.scrollPosition);
			//$(document).scrollTop(pageRecord.scrollPosition);
			//window.scrollTo(0, pageRecord.scrollPosition);
			self.gridOptions.pagingOptions.currentPage(pageRecord.PageNo);
			self.gridOptions.pagingOptions.pageSize(pageRecord.UserGridSetting.PageSize);
			self.sortCol(pageRecord.SortCol);
			self.sorttype(pageRecord.SortOrder);
			var list = pageRecord.UserGridSetting.Filters;
			self.searchFilterItems.removeAll();
			if (list.length > 0 && list[0].FieldName) {
				list.forEach((items) => {
					self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
					if (items.FieldNamed === 'PickupDateDisplay') {
						self.searchFilterItem.FieldName = "PickupDate";
					}
					else if (items.FieldName === 'ReviewedDateDisplay') {
						self.searchFilterItem.FieldName = "ReviewedDate";
					}
					else if (items.FieldName === 'CostAdjustmentDisplay') {
						self.searchFilterItem.FieldName = "CostAdjustment";
					}
					else if (items.FieldName === 'ShipmentTypeDisplay') {
						self.searchFilterItem.FieldName = "ShipmentMode";
					}
					else if (items.FieldName === 'AgeingDateDisplay') {
						self.searchFilterItem.FieldName = "AgeingDate";
					}
					else if (items.FieldName === 'CustomerTypeName') {
						self.searchFilterItem.FieldName = "CustomerTypeDisplay";
					}
					self.searchFilterItem.FieldName = items.FieldName;
					self.searchFilterItem.Operand = items.Operand;
					self.searchFilterItem.SearchText = items.SearchText;
					self.searchFilterItems.push(self.searchFilterItem);
				});
				self.requoteBoardContainer.reportColumnFilter.addFilter(self.searchFilterItems);
			}

			if (typeof pageRecord.isLoaded !== "undefined") {
				self.isLoaded(pageRecord.isLoaded);
			}
			self.fromLocalStorage(true);
		}

		self.getReportData(self.reportAction);
	}

	public compositionComplete() {
		var self = this;
		self.isLoaded(true);
		var self = this;

		var successCallBack = data => {
			var filterlist = data.Filters;
			self.gridOptions.pagingOptions.pageSize(data.PageSize);
			self.gridOptions.pagingOptions.currentPage(1);
			self.searchFilterItems.removeAll();
			if (filterlist.length > 0 && filterlist[0].FieldName != null) {
				filterlist.forEach((items) => {
					self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						if (items.FieldNamed === 'PickupDateDisplay') {
						self.searchFilterItem.FieldName = "PickupDate";
					}
					else if (items.FieldName === 'ReviewedDateDisplay') {
						self.searchFilterItem.FieldName = "ReviewedDate";
					}
					else if (items.FieldName === 'CostAdjustmentDisplay') {
						self.searchFilterItem.FieldName = "CostAdjustment";
					}
					else if (items.FieldName === 'ShipmentTypeDisplay') {
						self.searchFilterItem.FieldName = "ShipmentMode";
					}
					else if (items.FieldName === 'CustomerTypeName') {
						self.searchFilterItem.FieldName = "CustomerTypeDisplay";
					}
					self.searchFilterItem.FieldName = items.FieldName;
					self.searchFilterItem.Operand = items.Operand;
					self.searchFilterItem.SearchText = items.SearchText;
					self.searchFilterItems.push(self.searchFilterItem);
				});
				self.requoteBoardContainer.reportColumnFilter.addFilter(self.searchFilterItems);
				if (self.searchFilterItems.length > 0) {
					self.isSearchFilterItemsData(true);
					//$('#reQuote').addClass('margin-top--30');
				} else {
					self.isSearchFilterItemsData(false);
					//$('#reQuote').removeClass('margin-top--30');
				}
			}
			self.gridOptions.filterOptions.filterText('');
			self.isLoaded(true);
			self.fromLocalStorage(true);
		};

		if (!LocalStorageController.Get(self.localStorageKey())) {
			self.commonClientCommand.GetUserGridSettings(refEnums.Enums.FilterViewName.RequoteBoard, successCallBack);
		} else {
			//using to show clear filter button after saving filtered data in local storage and switching between tab
			var filteredData = LocalStorageController.Get(self.localStorageKey());
			//window.scrollTo(0, filteredData.scrollPosition);
			//$(window).scrollTop(filteredData.scrollPosition);
			//$(document).scrollTop(filteredData.scrollPosition);
			$("html, body").animate({ scrollTop: filteredData.scrollPosition }, "slow");
			//$("html").animate({ scrollTop: filteredData.scrollPosition }, "slow");
			if (filteredData.UserGridSetting.Filters.length > 0) {
				self.isSearchFilterItemsData(true);
				//$('#reQuote').addClass('margin-top--30');
			} else {
				self.isSearchFilterItemsData(false);
				//$('#reQuote').removeClass('margin-top--30');
			}
		}
	}

	public cleanup() {
		var self = this;

		self.requoteBoardContainer.cleanup("BoardReQuoteDetailsGrid");

		for (var property in self) {
			if (property != "cleanup")
				delete self[property];
		}
	}

	//#endregion
}