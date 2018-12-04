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
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'services/models/common/Enums', '../templates/reportViewerControlV2', 'services/client/VendorBillClient', 'services/client/PurchaseOrderClient', 'services/models/vendorBill/VendorBillId', 'services/models/purchaseOrder/PurchaseOrderSearchFilter', 'services/client/CommonClient'], function(require, exports, ___router__, ___app__, __refSystem__, __refEnums__, ___reportViewer__, __refVendorBillClient__, __refPurchaseOrderClient__, ___refVendorBillModel__, ___refPurchaseOrderSearchFilterModel__, __refCommonClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    var refEnums = __refEnums__;
    
    var _reportViewer = ___reportViewer__;
    var refVendorBillClient = __refVendorBillClient__;
    var refPurchaseOrderClient = __refPurchaseOrderClient__;
    var _refVendorBillModel = ___refVendorBillModel__;
    
    
    var _refPurchaseOrderSearchFilterModel = ___refPurchaseOrderSearchFilterModel__;
    var refCommonClient = __refCommonClient__;

    //#endregion
    /*
    ** <summary>
    ** Rexnord Board ViewModel
    ** </summary>
    ** <createDetails>
    ** <id>US8214</id> <by>Bhanu</by> <date>19th Aug, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** </changeHistory>
    */
    var RexnordBoardViewModel = (function () {
        //#endregion Properties
        //#region Constructor
        function RexnordBoardViewModel() {
            //#region Properties
            this.purchaseOrderBoardsGrid = null;
            this.headerOptions = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            this.sortCol = ko.observable('');
            this.sorttype = ko.observable('');
            this.vendorBillClient = new refVendorBillClient.VendorBillClient();
            this.purchaseOrderClient = new refPurchaseOrderClient.PurchaseOrderClient();
            this.searchFilterItems = new Array();
            this.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
            this.commonClientCommand = new refCommonClient.Common();
            this.fromLocalStorage = ko.observable(false);
            this.localStorageKey = ko.observable('');
            this.isLoaded = ko.observable(false);
            this.isSearchFilterItemsData = ko.observable(false);
            this.currentDateTime = ko.observable('');
            this.commonUtils = new Utils.Common();
            this.totalUVBCount = ko.observable('');
            this.totalUVBCreatedToday = ko.observable('');
            this.totalUVBWorkedToday = ko.observable('');
            this.isMoveGTBoard = ko.observable(false);
            var self = this;

            //#region Grid Settings
            self.headerOptions = new _reportViewer.ReportHeaderOption();

            //self.headerOptions.reportHeader = "Unmatched Vendor Bill Rexnord Board";
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
                { exportType: _reportViewer.ExportOptions.FILTER, name: ko.observable(""), enabled: ko.observable(true) }
            ]);

            self.headerOptions.reportExportOptions = new _reportViewer.ReportExportControl(exportOpt);
            self.headerOptions.reportExportOptions.getUrl = function (exp) {
                var searchClient = new refVendorBillClient.SearchModel();
                searchClient.SearchValue = self.searchText().trim();
                searchClient.SortOrder = self.sorttype();
                searchClient.SortCol = self.sortCol();
                searchClient.PageNumber = 1;
                searchClient.PageSize = exp.exportType === 1 ? 2000 : self.gridOptions.pagingOptions.totalServerItems();

                self.searchFilterItems.forEach(function (item) {
                    if (item.FieldName === 'BillDateDisplay') {
                        item.FieldName = 'BillDate';
                    } else if (item.FieldName === 'DeliveryDateDisplay') {
                        item.FieldName = 'DeliveryDate';
                    } else {
                    }
                });

                searchClient.SearchFilterItems = self.searchFilterItems;
                searchClient.ExportType = exp.exportType;

                var filterModel = { ExportURL: "Accounting/ExportPurchaseOrderRexnordBoardDataWithFilterInExcel", FilterModel: searchClient };
                return filterModel;
            };

            //## Region Export Options End.
            self.setReportCriteria = function (reportActionObj) {
                self.gridOptions = reportActionObj.gridOptions;
                var reportActionObjtext = reportActionObj.gridOptions.sortInfo;
                if ((reportActionObj != undefined || reportActionObj != null) && (reportActionObj.gridOptions != undefined || reportActionObj.gridOptions != null) && (refSystem.isObject(reportActionObj.gridOptions.sortInfo())) && (reportActionObj.gridOptions.sortInfo().column != undefined || reportActionObj.gridOptions.sortInfo().column != null) && (reportActionObj.gridOptions.sortInfo().column.field != undefined || reportActionObj.gridOptions.sortInfo().column.field != null)) {
                    if (reportActionObj.gridOptions.sortInfo().column.field === 'BillDateDisplay') {
                        self.sortCol("BillDate");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'DeliveryDateDisplay') {
                        self.sortCol("DeliveryDate");
                    } else {
                        self.sortCol(reportActionObj.gridOptions.sortInfo().column.field);
                    }
                    self.sorttype(reportActionObj.gridOptions.sortInfo().direction);
                } else {
                    self.sortCol("PRONo");
                    self.sorttype("desc");
                }
                reportActionObjtext().column.field;
                if (self.reportAction != null) {
                    if ((self.modeType() != reportActionObj.filter1selectedItemId) || (self.reportAction.view != reportActionObj.view) || (reportActionObj.dateFrom != self.reportAction.dateFrom) || (reportActionObj.dateTo != self.reportAction.dateTo)) {
                        //self.gridOptions.pagingOptions.currentPage(1);
                    }
                }

                // Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
                // we don't want any data on page load so we commented getReportdata  function.
                // self.getReportData();
                self.reportAction = reportActionObj;
                if (self.purchaseOrderBoardsGrid.reportColumnFilter.isFilterApply || self.purchaseOrderBoardsGrid.isPaginationChanged || self.purchaseOrderBoardsGrid.isSortingChanged) {
                    if (self.isLoaded()) {
                        self.getReportData(reportActionObj);

                        //to block unwanted server calls
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
            if (localStorageId === "RexnordBoard") {
                self.localStorageKey(localStorageId + "18");
            } else {
                self.localStorageKey(localStorageId);
            }

            //For server side paging
            self.getReportData = function (reportActionObj) {
                var deferred = $.Deferred();
                var promise = deferred.promise();
                var pageno = 0;
                pageno = Number(self.gridOptions.pagingOptions.currentPage());
                if (pageno > 0) {
                    // List View
                    self.purchaseOrderBoardsGrid.listProgress(true);
                    if (self.purchaseOrderBoardsGrid.reportColumnFilter.isFilterApply) {
                        var list = self.purchaseOrderBoardsGrid.reportColumnFilter.reportColumnFilters();
                        self.searchFilterItems.removeAll();
                        if (list.length > 0) {
                            list.forEach(function (items) {
                                self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
                                if (items.selectedserviceType() != undefined && items.selectedOperatorType() != undefined) {
                                    if (items.selectedserviceType().field === 'BillDateDisplay') {
                                        self.searchFilterItem.FieldName = "BillDate";
                                    } else if (items.selectedserviceType().field === 'DeliveryDateDisplay') {
                                        self.searchFilterItem.FieldName = "DeliveryDate";
                                    } else {
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
                        self.searchText('');
                        self.gridOptions.filterOptions.filterText('');
                    } else {
                        var list = self.purchaseOrderBoardsGrid.reportColumnFilter.reportColumnFilters();
                        self.searchFilterItems.removeAll();
                        if (list.length > 0) {
                            list.forEach(function (items) {
                                self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
                                if (items.selectedserviceType() != undefined && items.selectedOperatorType() != undefined) {
                                    if (items.selectedserviceType().field === 'BillDateDisplay') {
                                        self.searchFilterItem.FieldName = "BillDate";
                                    } else if (items.selectedserviceType().field === 'DeliveryDateDisplay') {
                                        self.searchFilterItem.FieldName = "DeliveryDate";
                                    } else {
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
                    }
                    var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems };
                    var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.PORexnordBoard, IsFilterApplied: self.purchaseOrderBoardsGrid.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), FromLocalStorage: self.fromLocalStorage() };
                    self.purchaseOrderClient.getPurchaseOrdersRexnordDetails(filterDataToSave, function (data) {
                        self.getHeaderCountData();

                        //self.totalUVBCount(data.TotalRows);
                        self.setPagingData(data.PurchaseOrdersElastic, data.TotalRows, self.gridOptions.pagingOptions.pageSize());
                        self.purchaseOrderBoardsGrid.listProgress(false);
                        deferred.resolve(data, reportActionObj.view);
                        self.purchaseOrderBoardsGrid.invokeHighlight(self.searchText());
                    }, function () {
                        self.purchaseOrderBoardsGrid.listProgress(false);
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };

                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ErrorOccurredWhileFetchingRexnordList, "error", null, toastrOptions);
                    }, self.gridOptions.pagingOptions);
                }

                //to block unwanted server calls
                self.purchaseOrderBoardsGrid.isPaginationChanged = false;
                self.purchaseOrderBoardsGrid.isSortingChanged = false;
                return promise;
            };

            //// to get the count of worked today, created today and total number
            self.getHeaderCountData = function () {
                var successCallBack = function (data) {
                    self.totalUVBCount(data.TotalUVBCount);
                    self.totalUVBCreatedToday(data.TotalUVBCreatedToday);
                    self.totalUVBWorkedToday(data.TotalUVBWorkedToday);
                };

                var failureCallBack = function (message) {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ErrorOccurredWhileFetchingPOList, "error", null, toastrOptions);
                };

                self.purchaseOrderClient.getHeaderCountDataInRexnordBoard(successCallBack, failureCallBack);
            };

            self.headerOptions.actionButtons1 = {
                buttonName: ko.observable("Move To GlobalTranz Board"),
                enableOnSingleSelection: true,
                enableOnMultiSelection: true,
                hideWhenUnselected: true,
                resetselectionOnAction: true,
                isslideButton: true
            };

            self.purchaseOrderBoardsGrid = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
            self.purchaseOrderBoardsGrid.onFilterChange = self.setReportCriteria;

            //self.purchaseOrderBoardsGrid.showOptionalHeaderRow(true);
            //self.purchaseOrderBoardsGrid.OptionalHeaderRowLocation('TOP');
            self.purchaseOrderBoardsGrid.ForceChange();

            // redirects to purchase order edit details page
            self.purchaseOrderBoardsGrid.onGridColumnClick = function (obj) {
                var vendorBillId = obj.VendorBillId;
                _app.trigger("openPurchaseOrder", vendorBillId, obj.PRONo, function (callback) {
                    if (!callback) {
                        return;
                    }
                });
            };

            //for search filter
            self.purchaseOrderBoardsGrid.onSearchTextChange = function (reportViewer, newSearchValue) {
                if (newSearchValue.length >= 3 || newSearchValue.length == 0) {
                    self.searchText(newSearchValue);
                    self.getReportData(self.reportAction);
                    self.gridOptions.pagingOptions.currentPage(1);
                }
            };

            //## On Click of Action Button1 Perform your action....Here Force Push button
            self.purchaseOrderBoardsGrid.onActionButton1Clicked = function (reportActionObj) {
                var selectOpt = reportActionObj.gridOptions.selectedItems();

                //## Array to Hold Selected VendorBill Ids
                var purchaseOrderIds = new _refVendorBillModel.Models.VendorBillId(0);

                //## Success Function.
                var successCallBack = function () {
                    toastr.clear();
                    setTimeout(function () {
                        var actionButtons = [];
                        actionButtons.push({
                            actionButtonName: "GlobalTranz Board",
                            actionClick: self.moveToGTBoard
                        });

                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 30,
                            fadeOut: 30,
                            typeOfAlert: "",
                            title: "",
                            actionButtons: actionButtons
                        };

                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, "Record(s) moved to the  ", "success", null, toastrOptions);
                    }, 500);

                    //To Refresh the grid
                    self.getReportData(self.reportAction);
                }, failureCallBack = function () {
                    toastr.clear();
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 15,
                        fadeOut: 15,
                        title: ""
                    };
                    setTimeout(function () {
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, 'Some error occurred', "error", null, toastrOptions);
                    }, 500);
                };

                //## Send Selected VendorBill Id's to move to MAS.
                selectOpt.forEach(function (item) {
                    purchaseOrderIds.BillIds.push(item["VendorBillId"]);
                });

                self.purchaseOrderClient.moveFromRexnordVolumeCustomerBills(purchaseOrderIds, successCallBack, failureCallBack);
            };

            //## After selection change re-assign the fields value
            self.purchaseOrderBoardsGrid.afterSelectionChange = function (items) {
                var selectedRowCount = items.length;
                if (selectedRowCount > 0) {
                    self.isMoveGTBoard(true);
                } else {
                    self.isMoveGTBoard(false);
                }
            };

            // for Purchase Order Board
            self.moveToGTBoard = function () {
                // open PO board
                _app.trigger('openPurchaseOrderBoard');
            };
            return self;
        }
        //#endregion Constructor
        //#region Internal Methods
        //#region Public Methods
        RexnordBoardViewModel.prototype.reloadPage = function () {
            var self = this;
            self.purchaseOrderBoardsGrid.listProgress(true);
            LocalStorageController.Set(self.localStorageKey(), undefined);
            LocalStorageController.Set(self.localStorageKey() + 'lastReloadDateTime', undefined);
            self.compositionComplete();
        };

        //set Date Time for record of last refreshed
        RexnordBoardViewModel.prototype.setDateTimeOfReload = function () {
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
        };

        //clearing all filter data
        RexnordBoardViewModel.prototype.onClickClearAll = function () {
            var self = this;
            self.purchaseOrderBoardsGrid.reportColumnFilter.clearAll();
            self.purchaseOrderBoardsGrid.reportColumnFilter.applyFilter();
            self.isSearchFilterItemsData(false);
            //$('#gridPORexnordBoard').removeClass('margin-top--36');
        };

        RexnordBoardViewModel.prototype.setPagingData = function (data, page, pageSize) {
            var self = this;
            self.gridOptions.data(data);
            self.gridOptions.data.valueHasMutated();
            self.gridOptions.pagingOptions.totalServerItems(page);
        };

        // Sets the options required properties of the grid
        RexnordBoardViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = true;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("PurchaseOrderBoardRexnordGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
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
        };

        // Sets the columns in the grid
        RexnordBoardViewModel.prototype.setGridColumnDefinitions = function () {
            //## PRO Cell Template.
            //## PRO Cell Template.
            var proCellTemplate = '<div data-bind="style: {\'background-color\': $parent.entity[\'IsReviewed\']===true ? \'yellow\' : \'\'  ,\'height\': \'29px\',\'width\': \'100%\', \'padding-right\': \'2px\'}"><a style="cursor: pointer" data-bind="text: $parent.entity[\'PRONo\'], click: function() { $userViewModel.onGridColumnClick($parent.entity) }, attr:{title: $data.getProperty($parent)}" /></div>';
            var rightAlignCurrencyTemplate = '<div data-bind="style: {\'background-color\': $parent.entity[\'IsReviewed\']===true ? \'yellow\' : \'\'  ,\'height\': \'29px\',\'width\': \'100%\', \'padding-right\': \'2px\'} , attr: { \'class\': \'kgCellText colt\' + $index() + \' text-right \', title: $data.getProperty($parent)}, html: \'$ \' + $data.getProperty($parent).toFixed(2)"></div>';
            var proYellowBgTemplate = '<div type="text" data-bind="style: {\'background-color\': $parent.entity[\'IsReviewed\']===true ? \'yellow\' : \'\'  ,\'height\': \'29px\',\'width\': \'100%\', \'padding-right\': \'2px\'} , attr: { \'class\': \'kgCellText colt\' + $index() + \'\', title: $data.getProperty($parent)}, html: $data.getProperty($parent)"></div>';

            // ReSharper disable once AssignedValueIsNeverUsed , cellTemplate: proYellowBGTemplate
            var colDefinition = [];

            colDefinition = [
                { field: 'PRONo', displayName: 'PRO #', width: 90, cellTemplate: proCellTemplate, type: _reportViewer.DataTypes.String },
                { field: 'BillDateDisplay', displayName: 'Bill Date', width: 90, cellTemplate: proYellowBgTemplate, type: _reportViewer.DataTypes.DateTime },
                { field: 'MainVendorBOLNo', displayName: 'EDI BOL', width: 80, cellTemplate: proYellowBgTemplate, type: _reportViewer.DataTypes.String },
                { field: 'CarrierName', displayName: 'Carrier Name', width: 130, cellTemplate: proYellowBgTemplate, type: _reportViewer.DataTypes.String },
                { field: 'ShipperName', displayName: 'Shipper Name', width: 130, cellTemplate: proYellowBgTemplate, type: _reportViewer.DataTypes.String },
                { field: 'Origin', displayName: 'Shipper Zip', width: 100, cellTemplate: proYellowBgTemplate, type: _reportViewer.DataTypes.String },
                { field: 'ConsigneeName', displayName: 'Consignee Name', width: 130, cellTemplate: proYellowBgTemplate, type: _reportViewer.DataTypes.String },
                { field: 'Destination', displayName: 'Consignee Zip', width: 120, cellTemplate: proYellowBgTemplate, type: _reportViewer.DataTypes.String },
                { field: 'Amount', displayName: 'Amount', cellTemplate: rightAlignCurrencyTemplate, width: 90, type: _reportViewer.DataTypes.Numeric },
                { field: 'DeliveryDateDisplay', displayName: 'Delivery Date', width: 115, cellTemplate: proYellowBgTemplate, type: _reportViewer.DataTypes.DateTime },
                { field: 'ProcessDetails', displayName: 'Process Details', width: 150, cellTemplate: proYellowBgTemplate, type: _reportViewer.DataTypes.String }
            ];
            return colDefinition;
        };

        // Move to GT Board
        RexnordBoardViewModel.prototype.onMoveToGTBoard = function (reportActionObj) {
            var self = this;
            var selectOpt = reportActionObj.gridOptions.selectedItems();

            //## Array to Hold Selected VendorBill Ids
            var purchaseOrderIds = new _refVendorBillModel.Models.VendorBillId(0);

            //## Success Function.
            var successCallBack = function () {
                toastr.clear();
                setTimeout(function () {
                    var actionButtons = [];
                    actionButtons.push({
                        actionButtonName: "GlobalTranz Board",
                        actionClick: self.moveToGTBoard
                    });

                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 30,
                        fadeOut: 30,
                        typeOfAlert: "",
                        title: "",
                        actionButtons: actionButtons
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, "Record(s) moved to the  ", "success", null, toastrOptions);
                }, 500);

                //To Refresh the grid
                self.getReportData(self.reportAction);
            }, failureCallBack = function () {
                toastr.clear();
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 15,
                    fadeOut: 15,
                    title: ""
                };
                setTimeout(function () {
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, 'Some error occurred', "error", null, toastrOptions);
                }, 500);
            };

            //## Send Selected VendorBill Id's to move to MAS.
            selectOpt.forEach(function (item) {
                purchaseOrderIds.BillIds.push(item["VendorBillId"]);
            });

            self.purchaseOrderClient.moveFromRexnordVolumeCustomerBills(purchaseOrderIds, successCallBack, failureCallBack);
        };

        //#endregion
        //#endregion
        //#region Life Cycle Event
        RexnordBoardViewModel.prototype.compositionComplete = function () {
            var self = this;
            var successCallBack = function (data) {
                self.searchText('');
                var filterlist = data.Filters;
                self.gridOptions.pagingOptions.pageSize(data.PageSize);
                self.gridOptions.pagingOptions.currentPage(1);

                self.searchFilterItems.removeAll();
                if (filterlist.length > 0 && filterlist[0].FieldName != null) {
                    filterlist.forEach(function (items) {
                        self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
                        self.searchFilterItem.FieldName = items.FieldName;
                        self.searchFilterItem.Operand = items.Operand;
                        self.searchFilterItem.SearchText = items.SearchText;
                        self.searchFilterItems.push(self.searchFilterItem);
                    });
                    self.purchaseOrderBoardsGrid.reportColumnFilter.addFilter(self.searchFilterItems);
                    if (self.searchFilterItems.length > 0) {
                        self.isSearchFilterItemsData(true);
                        //$('#gridPORexnordBoard').addClass('margin-top--36');
                    } else {
                        self.isSearchFilterItemsData(false);
                        //$('#gridPORexnordBoard').removeClass('margin-top--36');
                    }
                }
                self.gridOptions.filterOptions.filterText('');
                self.searchText('');
                if (self.isLoaded()) {
                    self.getReportData(self.reportAction);
                }
                self.isLoaded(true);
                self.fromLocalStorage(true);
            };

            if (!LocalStorageController.Get(self.localStorageKey())) {
                self.commonClientCommand.GetUserGridSettings(refEnums.Enums.FilterViewName.PORexnordBoard, successCallBack);
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
            self.purchaseOrderBoardsGrid.isPaginationChanged = false;
            self.purchaseOrderBoardsGrid.isSortingChanged = false;
        };

        RexnordBoardViewModel.prototype.activate = function () {
            return true;
        };

        //** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
        RexnordBoardViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        RexnordBoardViewModel.prototype.deactivate = function () {
            var self = this;

            //  var data = {
            //  	//carrierName
            //  	pageSize: self.gridOptions.pagingOptions.pageSize(),
            //  	currentPage: self.gridOptions.pagingOptions.currentPage()
            //  }
            //_app.trigger("registerMyData", data);
            var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems };
            var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.PORexnordBoard, IsFilterApplied: self.purchaseOrderBoardsGrid.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), isLoaded: true };
            LocalStorageController.Set(self.localStorageKey(), filterDataToSave);

            self.cleanup();
        };

        RexnordBoardViewModel.prototype.beforeBind = function () {
            var self = this;
            self.load();
            //_app.trigger("loadMyData", function (data) {
            //	if (data) {
            //		self.load(data);
            //	}
            //});
        };

        //private load(bindedData) {
        //	//** if bindedData is null then return false. */
        //	if (!bindedData)
        //		return;
        //	var self = this;
        //	if (refSystem.isObject(self.gridOptions)) {
        //		self.gridOptions.pagingOptions.pageSize(bindedData.pageSize);
        //		self.gridOptions.pagingOptions.currentPage(bindedData.currentPage);
        //		self.getReportData(self.reportAction);
        //	}
        //}
        RexnordBoardViewModel.prototype.load = function () {
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
                    list.forEach(function (items) {
                        self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
                        self.searchFilterItem.FieldName = items.FieldName;
                        self.searchFilterItem.Operand = items.Operand;
                        self.searchFilterItem.SearchText = items.SearchText;
                        self.searchFilterItems.push(self.searchFilterItem);
                    });
                    self.purchaseOrderBoardsGrid.reportColumnFilter.addFilter(self.searchFilterItems);
                }
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
        };

        RexnordBoardViewModel.prototype.cleanup = function () {
            var self = this;
            self.purchaseOrderBoardsGrid.cleanup("PurchaseOrderBoardRexnordGrid");

            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }

            delete self;
        };
        return RexnordBoardViewModel;
    })();

    return RexnordBoardViewModel;
});
