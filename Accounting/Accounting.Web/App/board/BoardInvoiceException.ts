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
import _refVendorBillModel = require('services/models/vendorBill/VendorBillId');
import refForceInvoiceShipment = require('services/models/Board/ForceInvoiceShipment');
import refVendorBillClient = require('services/client/VendorBillClient');
import _refPurchaseOrderSearchFilterModel = require('services/models/purchaseOrder/PurchaseOrderSearchFilter');
import refCommonClient = require('services/client/CommonClient');
/***********************************************
   BOARD INVOICE EXCEPTION VIEWMODEL
************************************************
** <summary>
** Board Invoice Exception View Model.
** </summary>
** <createDetails>
** <id>US12941</id><by>Chadnan</by> <date>oct/2014</date>
** <id>US21809</id> <by>Janakiram</by> <date>07-06-2016</date> <description>Enable/Disable the ForceInvoice if the user is not authorized to Edit the bill</description>
** <id>DE23312</id> <by>Janakiram</by> <date>07-07-2016</date> <description>Changed Header name SO Cost as Cost</description>
** <id>DE23954</id> <by>Vasanthakumar</by> <date>28-09-2016</date> <description>Invoice Exception Board -  Force invoice button is enabled for already force invoiced record</description>
** </createDetails>}

***********************************************/

class BoardInvoiceExceptionViewModel {
    //#region Properties
    reportClient: any = null;
    listProgress: KnockoutObservable<boolean> = ko.observable(false);
    //#region Public report viewer members
    public reportContainer: _reportViewer.ReportViewerControlV2 = null;
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
    sortCol: KnockoutObservable<string> = ko.observable('');
    sorttype: KnockoutObservable<string> = ko.observable('');
    public loadGridData: (reportActionObj) => any;
    //#endregion Public report viewer members
    // To hold Reasons for Invoice Exception
    forcePushReason: KnockoutObservable<string> = ko.observable('');
    // To hold Selected Invoice Shipment
    forceInvoiceShipment: refForceInvoiceShipment.Models.ForceInvoiceShipment;
    // For Toastr
    public viewDetail: (msg) => any;
    public checkMsgClick: () => any;
    public checkMsgHide: () => any;
    private checkMsgDisplay: boolean = true;
    public isViewMessage: boolean = true;
    //To disable save button
    isSaveEnable: KnockoutObservable<boolean> = ko.observable(false);
    isSaveVisible: KnockoutObservable<boolean> = ko.observable(false);
    localStorageKey: KnockoutObservable<string> = ko.observable('');
    currentDateTime: KnockoutObservable<string> = ko.observable('');
    commonUtils: CommonStatic = new Utils.Common();
    isSearchFilterItemsData: KnockoutObservable<boolean> = ko.observable(false);
    fromLocalStorage: KnockoutObservable<boolean> = ko.observable(false);
    isLoaded: KnockoutObservable<boolean> = ko.observable(false);
    searchFilterItems: Array<IPurchaseOrderSearchFilter> = new Array<_refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter>();
    searchFilterItem: IPurchaseOrderSearchFilter = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
    commonClientCommand: refCommonClient.Common = new refCommonClient.Common();
    //#endregion Properties

    //#region Constructer
    constructor() {
        var self = this;
        self.headerOptions = new _reportViewer.ReportHeaderOption();
        self.headerOptions.reportHeader = " ";
        self.headerOptions.reportName = "Invoice Exception Board Details";
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
                else if (item.FieldName === 'BookedDateDisplay') {
                    item.FieldName = 'BookedDate'
				}
                else if (item.FieldName === 'ShipmentTypeDisplay') {
                    item.FieldName = 'ShipmentType'
				}
                else if (item.FieldName === 'AdjustmentDateDisplay') {
                    item.FieldName = 'AdjustmentDate'
				}
                else if (item.FieldName === 'FinalizedDateDisplay') {
                    item.FieldName = 'FinalizedDate'
				}
                else if (item.FieldName === 'CustomerTypeDisplay') {
                    item.FieldName = 'CustomerType'
				}
                else if (item.FieldName === 'CRRReviewDateDisplay') {
                    item.FieldName = 'CRRReviewDate'
				}
                else if (item.FieldName === 'ProcessStatusDisplay') {
                    item.FieldName = 'ProcessStatusDescription'
				}
                else if (item.FieldName === 'BillStatusDisplay') {
                    item.FieldName = 'BillStatusDescription'
				}
                else if (item.FieldName === 'InvoiceStatusDisplay') {
                    item.FieldName = 'InvoiceStatusDescription'
				}
                else { }
            });

            searchClient.SearchFilterItems = self.searchFilterItems;
            searchClient.ExportType = exp.exportType;
            var filterModel = { ExportURL: "Accounting/ExportInvoiceExceptionBoardDataWithFilterInExcel", FilterModel: searchClient };
            return filterModel;
        }
		//## Region Export Options End.

		//set local storage key by url
		var url = $(location).attr('href');
        var urlArray = url.split('/');
        var localStorageId = urlArray.pop().toString().replace(/#/g, "");
        self.localStorageKey(localStorageId);
        if (localStorageId === "InvoiceException") {
            self.localStorageKey(localStorageId + "29");
        } else {
            self.localStorageKey(localStorageId);
        }

        self.setReportCriteria = (reportActionObj: _reportViewer.ReportAction) => {
            if ((reportActionObj != undefined || reportActionObj != null) && (reportActionObj.gridOptions != undefined || reportActionObj.gridOptions != null) && (refSystem.isObject(reportActionObj.gridOptions.sortInfo())) && (reportActionObj.gridOptions.sortInfo().column != undefined || reportActionObj.gridOptions.sortInfo().column != null) && (reportActionObj.gridOptions.sortInfo().column.field != undefined || reportActionObj.gridOptions.sortInfo().column.field != null)) {
                if (reportActionObj.gridOptions.sortInfo().column.field == 'PickupDateDisplay') {
                    self.sortCol('PickupDate');
                }
                else if (reportActionObj.gridOptions.sortInfo().column.field == 'BookedDateDisplay') {
                    self.sortCol('BookedDate');
                }
                else if (reportActionObj.gridOptions.sortInfo().column.field == 'ShipmentTypeDisplay') {
                    self.sortCol('ShipmentType');
                }
                else if (reportActionObj.gridOptions.sortInfo().column.field == 'AdjustmentDateDisplay') {
                    self.sortCol('AdjustmentDate');
                }
                else if (reportActionObj.gridOptions.sortInfo().column.field == 'FinalizedDateDisplay') {
                    self.sortCol('FinalizedDate');
                }
                else if (reportActionObj.gridOptions.sortInfo().column.field === 'CustomerTypeDisplay') {
                    self.sortCol("CustomerType");
                }
                else if (reportActionObj.gridOptions.sortInfo().column.field === 'CRRReviewDateDisplay') {
                    self.sortCol("CRRReviewDate");
                }
                else if (reportActionObj.gridOptions.sortInfo().column.field === 'ProcessStatusDisplay') {
                    self.sortCol("ProcessStatusDescription");
                }
                else if (reportActionObj.gridOptions.sortInfo().column.field === 'BillStatusDisplay') {
                    self.sortCol("BillStatusDescription");
                }
                else if (reportActionObj.gridOptions.sortInfo().column.field === 'InvoiceStatusDisplay') {
                    self.sortCol("InvoiceStatusDescription");
                }
                else {
                    self.sortCol(reportActionObj.gridOptions.sortInfo().column.field);
                }
                self.sorttype(reportActionObj.gridOptions.sortInfo().direction);
            }
            else {
                self.sortCol("ProNo");
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

                self.reportContainer.listProgress(false);
                self.reportContainer.selectedFilter1Item(self.modeType());
            }
            else {
                self.gridOptions = reportActionObj.gridOptions;

                // Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
                // we don't want any data on page load so we commented getReportdata  function.
                // Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
                if (self.modeType() != reportActionObj.filter1selectedItemId) {
                    self.modeType(reportActionObj.filter1selectedItemId);
                    self.reportContainer.columnDefinition(self.setGridColumnDefinitions());
                }

                self.reportAction = reportActionObj;
                if (self.reportContainer.reportColumnFilter.isFilterApply || self.reportContainer.isPaginationChanged || self.reportContainer.isSortingChanged) {
                    if (self.isLoaded()) {
                        self.getReportData(self.reportAction);
                        //to block unwanted server calls
                        self.reportContainer.isPaginationChanged = false;
                        self.reportContainer.isSortingChanged = false;
                    }
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
                if (self.reportContainer.reportColumnFilter.isFilterApply) {
                    self.searchText('');
                    self.gridOptions.filterOptions.filterText('');
                }
                var list = self.reportContainer.reportColumnFilter.reportColumnFilters();
                self.searchFilterItems.removeAll();
                if (list.length > 0) {
                    list.forEach((items) => {
                        self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						if (items.selectedserviceType() != undefined && items.selectedOperatorType() != undefined) {
                            if (items.selectedserviceType().field === 'CustomerTypeDisplay') {
                                self.searchFilterItem.FieldName = "CustomerType";
                            }
                            else if (items.selectedserviceType().field === 'PickupDateDisplay') {
                                self.searchFilterItem.FieldName = "PickupDate";
                            }
                            else if (items.selectedserviceType().field === 'BookedDateDisplay') {
                                self.searchFilterItem.FieldName = "BookedDate";
                            }
                            else if (items.selectedserviceType().field === 'ShipmentTypeDisplay') {
                                self.searchFilterItem.FieldName = "ShipmentType";
                            }
                            else if (items.selectedserviceType().field === 'FinalizedDateDisplay') {
                                self.searchFilterItem.FieldName = "FinalizedDate";
                            }
                            else if (items.selectedserviceType().field === 'AdjustmentDateDisplay') {
                                self.searchFilterItem.FieldName = "AdjustmentDate";
                            }
                            else if (items.selectedserviceType().field === 'CRRReviewDateDisplay') {
                                self.searchFilterItem.FieldName = "CRRReviewDate";
                            }
                            else if (items.selectedserviceType().field === 'ProcessStatusDisplay') {
                                self.searchFilterItem.FieldName = "ProcessStatusDescription";
                            }
                            else if (items.selectedserviceType().field === 'BillStatusDisplay') {
                                self.searchFilterItem.FieldName = "BillStatusDescription";
                            }
                            else if (items.selectedserviceType().field === 'InvoiceStatusDisplay') {
                                self.searchFilterItem.FieldName = "InvoiceStatusDescription";
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
                            //$('#gridPORexnordBoard').addClass('margin-top--36');
                        } else {
                            self.isSearchFilterItemsData(false);
                            //$('#gridPORexnordBoard').removeClass('margin-top--36');
                        }
                    });
                }
                self.reportContainer.listProgress(true);
                var deferred = $.Deferred();
                var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems }
		     var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.InvoiceExceptionBoard, IsFilterApplied: self.reportContainer.reportColumnFilter.isFilterApply, GridSearchText: null, PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), FromLocalStorage: self.fromLocalStorage() };

                self.reportClient.getInvoiceExceptionBoardDetails(filterDataToSave,
                    (data) => {
                        self.setPagingData(data.InvoiceExceptionList, data.NumberOfRows, self.gridOptions.pagingOptions.pageSize());
                        self.reportContainer.listProgress(false);
                        self.listProgress(false);
                        deferred.resolve(data, reportActionObj.view);
                    },
                    () => {
                        self.reportContainer.listProgress(false);
                    }, self.gridOptions.pagingOptions);
                //to block unwanted server calls
                self.reportContainer.isPaginationChanged = false;
                self.reportContainer.isSortingChanged = false;
            }
            return promise;
        };

        self.reportContainer = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
        self.reportContainer.onFilterChange = self.setReportCriteria;
        self.reportContainer.ForceChange();

        //for search filter
        self.reportContainer.onSearchTextChange = function (reportViewer, newSearchValue) {
            if (newSearchValue.length >= 3 || newSearchValue.length == 0) {
                self.searchText(newSearchValue);
                self.getReportData(self.reportAction);
                self.gridOptions.pagingOptions.currentPage(1);
            }
        };

        //## After selection change re-assign the fields value
        self.reportContainer.afterSelectionChange = function (items: KnockoutObservableArray<any>) {
            var selectedRowCount = items.length;
            if (selectedRowCount > 0) {
                var selectOpt: Array<any> = self.gridOptions.selectedItems();
                self.forceInvoiceShipment = new refForceInvoiceShipment.Models.ForceInvoiceShipment();
                self.forceInvoiceShipment.BatchId = selectOpt[0].BatchId;
                self.forceInvoiceShipment.ShipmentId = selectOpt[0].ShipmentId;
                self.forceInvoiceShipment.BOLNo = selectOpt[0].BolNumber;
                self.forceInvoiceShipment.UpdateDateTime = selectOpt[0].UpdatedDateTime;
                self.isSaveVisible(true);

				// ###START: US21809
				// ###START: DE23954
				if (selectOpt[0].AllowForceInvoice == true && selectOpt[0].EnableForceInvoice == true) {
					self.isSaveEnable(true);
				}
				else {
					self.isSaveEnable(false);
				}
				// ###END: DE23954
                // ###END: US21809
            }
            else {
                self.isSaveEnable(false);
                self.isSaveVisible(false);
            }
        }

		// TO open sales Order
		self.reportContainer.onBolNumberClick = function (shipmentObj) {
            var salesOrderId = shipmentObj.ShipmentId;
            _app.trigger("openSalesOrder", salesOrderId, shipmentObj.BolNumber, (callback) => {
                if (!callback) {
                    return;
                }
            });
        }

		//To check if Msg is clicked
		self.checkMsgClick = () => {
            self.checkMsgDisplay = true;
            self.isViewMessage = true;
        }

	// to Check if Msg is hidden or closed
		self.checkMsgHide = () => {
            self.checkMsgDisplay = true;
            self.isViewMessage = true;
        }
		return self;
    }
    //#endregion

    //#region Internal Public methods
    //clearing all filter data
    public onClickClearAll() {
        var self = this;
        self.reportContainer.reportColumnFilter.clearAll();
        self.reportContainer.reportColumnFilter.applyFilter();
        self.isSearchFilterItemsData(false);
        self.listProgress(false);
        self.isSaveVisible(false);
        //$('#gridPORexnordBoard').removeClass('margin-top--36');
    }

    public onSave() {
        var self = this;
        if (self.validateReasons()) {
            self.listProgress(true);
            self.forceInvoiceShipment.ForceInvoiceReason = self.forcePushReason();
            var successCallBack = (data) => {
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var toastrOptions: IToastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 30,
                        fadeOut: 30,
                        typeOfAlert: "",
                        title: ""
					};
					// ###START: DE23954
					if (data === true) {
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.ShipmentForceInvoiced, "success", self.checkMsgClick, toastrOptions, self.checkMsgHide);
					}
					else {
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ShipmentForceInvoiceFailed, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
					}
					// ###END: DE23954
                }
                self.reportContainer.listProgress(true);
                self.forcePushReason('');
                self.reloadPage();
                // To disable and set no visible for save button
                self.isSaveEnable(false);
                self.isSaveVisible(false);
            },
                failureCallBack = (message) => {
                    self.listProgress(false);
                    self.isSaveEnable(true);
                    self.isSaveVisible(true);
                }
			self.reportClient.ForcePushInvoiceExceptionDetails(self.forceInvoiceShipment, successCallBack, failureCallBack);
        }
    }
    // To check force Invoice Reasons is not null
    public validateReasons() {
        var self = this;
        if (self.forcePushReason() !== null && self.forcePushReason() !== undefined && self.forcePushReason() !== "") {
            return true;
        }
        else {
            if (self.checkMsgDisplay) {
                self.checkMsgDisplay = false;
                var toastrOptions: IToastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 30,
                    fadeOut: 30,
                    typeOfAlert: "",
                    title: ""
                };

                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.selectForceInvoiceReason, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
            }
            return false;
        }
    }

    //#region Private Methods
    public reloadPage() {
        var self = this;
        self.listProgress(false);
        self.isSaveVisible(false);
        LocalStorageController.Set(self.localStorageKey(), undefined);
        LocalStorageController.Set(self.localStorageKey() + 'lastReloadDateTime', undefined);
        self.getReportData(self.reportAction);
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
            self.currentDateTime(str);
        }
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
                self.reportContainer.reportColumnFilter.addFilter(self.searchFilterItems);
            }

            if (typeof pageRecord.isLoaded !== "undefined") {
                self.isLoaded(pageRecord.isLoaded);
            }
            self.fromLocalStorage(true);
        }

        self.getReportData(self.reportAction);
        //to block unwanted server calls
        self.reportContainer.isPaginationChanged = false;
        self.reportContainer.isSortingChanged = false;
    }
    //#endregion Public Methods

    //#region Private Methods
    private setGridOptions(self: BoardInvoiceExceptionViewModel): _reportViewer.ReportGridOption {
        var grOption = new _reportViewer.ReportGridOption();
        grOption.UIGridID = ko.observable("BoardInvoiceExceptionGrid");
        grOption.data = <any> self.reportData;
        grOption.columnDefinition = self.setGridColumnDefinitions();
        grOption.enableSelectiveDisplay = true;
        grOption.useExternalSorting = false;
        grOption.showGridSearchFilter = false;
        grOption.sortedColumn = <_reportViewer.SortOrder> {
            columnName: "ProNo",
            order: "DESC"
        };
        grOption.pageSizes = [10, 25, 50, 100];
        grOption.pageSize = 10;
        grOption.totalServerItems = 0;
        grOption.currentPage = 1;
        grOption.jqueryUIDraggable = true;
        grOption.canSelectRows = true;
        grOption.selectWithCheckboxOnly = true;
        grOption.displaySelectionCheckbox = true;
        grOption.multiSelect = false;
        grOption.enablePaging = false;
        grOption.viewPortOptions = false;
        grOption.enableSaveGridSettings = true;
        grOption.useClientSideFilterAndSort = false;
        grOption.showColumnMenu = true;
        return grOption;
    }

    private setPagingData(data, page, pageSize) {
        var self = this;
        self.gridOptions.data(data);
        self.gridOptions.data.valueHasMutated();
        self.gridOptions.pagingOptions.totalServerItems(page);
    }

    //## Set Grid Columns.
    private setGridColumnDefinitions() {
        var colDefinition: Array = [];
        var self = this;
        var bolCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'BolNumber\'], click: function() { $userViewModel.onBolNumberClick($parent.entity) }, attr:{ title: $data.getProperty($parent)}" />';

        colDefinition = [
            { field: 'BolNumber', displayName: 'BOL#', width: 85, cellTemplate: bolCellTemplate, type: _reportViewer.DataTypes.String },
            { field: 'ProNo', displayName: 'PRO#', width: 105, type: _reportViewer.DataTypes.String },
            { field: 'CarrierName', displayName: 'Carrier', width: 300, type: _reportViewer.DataTypes.String },
            { field: 'SalesAgent', displayName: 'Sales Agent', width: 200, type: _reportViewer.DataTypes.String },
            { field: 'PickupDateDisplay', displayName: 'Pickup Date', width: 95, type: _reportViewer.DataTypes.DateTime },
            { field: 'FinalizedDateDisplay', displayName: 'Finalize Date', width: 95, type: _reportViewer.DataTypes.DateTime },
            { field: 'ShipmentTypeDisplay', displayName: 'Mode', width: 85, type: _reportViewer.DataTypes.String },
            { field: 'VBAmount', displayName: 'VB Amount', width: 80, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric },
            { field: 'Exceptions', displayName: 'Exception Reason', width: 250, type: _reportViewer.DataTypes.String },
            { field: 'ScheduledAge', displayName: 'Scheduled Age', width: 100, type: _reportViewer.DataTypes.Numeric },
            { field: 'CustomerName', displayName: 'Customer', width: 150, visible: false, type: _reportViewer.DataTypes.String },
            { field: 'BookedDateDisplay', displayName: 'Booked Date', width: 150, visible: false, type: _reportViewer.DataTypes.DateTime },
            { field: 'AdjustmentDateDisplay', displayName: 'Adjustment Date', width: 150, visible: false, type: _reportViewer.DataTypes.DateTime },
            { field: 'CRRReviewDateDisplay', displayName: 'CRR Review Date', width: 150, visible: false, type: _reportViewer.DataTypes.DateTime },
            // ###START:DE23312
            { field: 'Cost', displayName: 'SO Cost', width: 180, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate, visible: false, type: _reportViewer.DataTypes.Numeric },
            // ###END:DE23312
            { field: 'Revenue', displayName: 'Revenue', width: 180, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate, visible: false, type: _reportViewer.DataTypes.Numeric },
            { field: 'ProcessStatusDisplay', displayName: 'SO Status', width: 180, visible: false, type: _reportViewer.DataTypes.String },
            { field: 'InvoiceStatusDisplay', displayName: 'Invoice Status', width: 180, visible: false, type: _reportViewer.DataTypes.String },
            { field: 'BillStatusDisplay', displayName: 'VB Status', width: 180, visible: false, type: _reportViewer.DataTypes.String },
            { field: 'CustomerTypeDisplay', displayName: 'Customer Type', width: 100, visible: false, type: _reportViewer.DataTypes.String }
        ];
        return colDefinition;
    }

    //#endregion Private Methods

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
        var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems }
		       var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.InvoiceExceptionBoard, IsFilterApplied: self.reportContainer.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), isLoaded: true };
        LocalStorageController.Set(self.localStorageKey(), filterDataToSave);

        self.cleanup();
    }

    public beforeBind() {
        var self = this
			self.load();
    }

    public compositionComplete(view, parent) {
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
                    self.searchFilterItem.FieldName = items.FieldName;
                    self.searchFilterItem.Operand = items.Operand;
                    self.searchFilterItem.SearchText = items.SearchText;
                    self.searchFilterItems.push(self.searchFilterItem);
                });
                self.reportContainer.reportColumnFilter.addFilter(self.searchFilterItems);
                if (self.searchFilterItems.length > 0) {
                    self.isSearchFilterItemsData(true);
                    //$('#gridPORexnordBoard').addClass('margin-top--36');
                } else {
                    self.isSearchFilterItemsData(false);
                    //$('#gridPORexnordBoard').removeClass('margin-top--36');
                }
            }
            self.gridOptions.filterOptions.filterText('');
            self.isLoaded(true);
            self.fromLocalStorage(true);
        };

        if (!LocalStorageController.Get(self.localStorageKey())) {
            self.commonClientCommand.GetUserGridSettings(refEnums.Enums.FilterViewName.InvoiceExceptionBoard, successCallBack);
        } else {
            //using to show clear filter button after saving filtered data in local storage and switching between tab
            var filteredData = LocalStorageController.Get(self.localStorageKey());
            if (filteredData.UserGridSetting.Filters.length > 0) {
                self.isSearchFilterItemsData(true);
                //$('#gridPORexnordBoard').addClass('margin-top--36');
            } else {
                self.isSearchFilterItemsData(false);
                //$('#gridPORexnordBoard').removeClass('margin-top--36');
            }
        }
        //to block unwanted server calls
        self.reportContainer.isPaginationChanged = false;
        self.reportContainer.isSortingChanged = false;
    }

    //#endregion

    public cleanup() {
        var self = this;

        self.reportContainer.cleanup("BoardInvoiceExceptionGrid");

        for (var prop in self) {
            if (prop !== "cleanup")
                delete self[prop];
        }
        delete self;
    }
}
return BoardInvoiceExceptionViewModel;