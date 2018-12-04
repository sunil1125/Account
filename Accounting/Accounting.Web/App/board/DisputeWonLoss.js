/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', '../templates/reportViewerControlV2', 'services/models/common/Enums', 'services/client/BoardsClient', 'services/validations/Validations', 'services/models/purchaseOrder/PurchaseOrderSearchFilter', 'services/client/VendorBillClient', 'services/client/CommonClient'], function(require, exports, ___router__, ___app__, __refSystem__, ___reportViewer__, __refEnums__, __refBoardsClient__, __refValidations__, ___refPurchaseOrderSearchFilterModel__, __refVendorBillClient__, __refCommonClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    var _reportViewer = ___reportViewer__;
    var refEnums = __refEnums__;
    var refBoardsClient = __refBoardsClient__;
    
    var refValidations = __refValidations__;
    var _refPurchaseOrderSearchFilterModel = ___refPurchaseOrderSearchFilterModel__;
    var refVendorBillClient = __refVendorBillClient__;
    var refCommonClient = __refCommonClient__;

    /***********************************************
    BOARD DISPUTE WON Loss VIEWMODEL
    ************************************************
    ** <summary>
    ** Dispute Board View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US12941</id><by>Bhanu</by> <date>6 feb 2015</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>DE20289</id> <by>Shreesha Adiga</by> <date>09-10-2015</date><description>Added validations to Date fields</description>
    ** <id>US23403</id> <by>Shreesha Adiga</by> <date>25-07-2016</date><description>Changes related to showing OVC won loss items on the board</description>
    ** <id>DE23921</id> <by>Dhaval Tamhane</by> <date>12-08-2016</date><description>Dispute won/lose board - Pickup date column value is null for the data fetched from ES and same is showing value from DB</description>
    ** <id>6400</id> <by>Shreesha Adiga</by> <date>15-11-2018</date> <description>Added DisputeNote, DisputeStatusUpdatedBy and DisputeStatusUpdatedDateDisplay</description>
    ** </changeHistory>
    ***********************************************/
    var DisputeWonLossViewModel = (function () {
        //#endregion Public report viewer members
        //#region Constructor
        function DisputeWonLossViewModel() {
            this.reportClient = null;
            this.listProgress = ko.observable(false);
            this.startDateForDisputeIterm = ko.observable('');
            this.endDateForDisputeIterm = ko.observable('');
            //#region Public report viewer members
            this.disputeWonLossReportContainer = null;
            this.headerOptions = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            this.boardReportRequest = null;
            this.loadDisputeWonLoss = ko.observable(false);
            this.sortCol = ko.observable('');
            this.sorttype = ko.observable('');
            this.searchFilterItems = new Array();
            this.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
            this.localStorageKey = ko.observable('');
            this.commonClientCommand = new refCommonClient.Common();
            this.isLoaded = ko.observable(false);
            this.fromLocalStorage = ko.observable(false);
            this.FromDate = ko.observable('');
            this.ToDate = ko.observable('');
            this.commonUtils = new Utils.Common();
            this.currentDateTime = ko.observable('');
            this.isSearchFilterItemsData = ko.observable(false);
            var self = this;

            var fromdate = new Date();
            var x = 90;
            var newFromDate = fromdate.setDate(fromdate.getDate() - x);
            self.startDateForDisputeIterm(self.commonUtils.formatDate(newFromDate, 'mm/dd/yyyy'));
            self.endDateForDisputeIterm(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'));

            //To set The date picker options
            self.datepickerOptions = {
                blockWeekend: true,
                blockPreviousDays: false,
                blockHolidaysDays: true,
                autoClose: true,
                placeBelowButton: false
            };

            // ###START: DE20289
            //#region DATE VALIDATIONS
            self.startDateForDisputeIterm.extend({
                validation: {
                    validator: function () {
                        if (!refValidations.Validations.isValidDate(self.startDateForDisputeIterm(), self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "BillDate"))
                            return false;
                        if (self.startDateForDisputeIterm() !== "" || self.startDateForDisputeIterm() !== undefined) {
                            if ((new Date(self.startDateForDisputeIterm())) > new Date(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy')))
                                return false;
else
                                return true;
                        } else {
                            return true;
                        }
                    },
                    message: 'Not a valid date'
                }
            });

            self.endDateForDisputeIterm.extend({
                validation: {
                    validator: function () {
                        if (!refValidations.Validations.isValidDate(self.endDateForDisputeIterm(), self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "BillDate"))
                            return false;

                        if (new Date(self.endDateForDisputeIterm()) > (new Date(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy')))) {
                            return false;
                        } else if (self.endDateForDisputeIterm() !== undefined && self.startDateForDisputeIterm() !== "") {
                            if (new Date(self.startDateForDisputeIterm()) > new Date(self.endDateForDisputeIterm()))
                                return false;
else
                                return true;
                            //To Pickup date should not be grater then today date
                        } else if (new Date(self.endDateForDisputeIterm()) > (new Date(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy')))) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    message: 'Not a valid date'
                }
            });

            self.errorDates = ko.validatedObservable({
                fromDate: self.startDateForDisputeIterm,
                toDate: self.endDateForDisputeIterm
            });

            //#endregion
            // ###END: DE20289
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
                    if (item.FieldName === 'SOPickupDateDisplay') {
                        item.FieldName = "SOPickupDate";
                    } else if (item.FieldName === 'BillDateDisplay') {
                        item.FieldName = 'BillDate';
                    } else if (item.FieldName === 'DisputeDateDisplay') {
                        item.FieldName = 'DisputedDate';
                    } else if (item.FieldName === 'NewDisputeDateDisplay') {
                        item.FieldName = 'NewDisputedDate';
                    } else if (item.FieldName === 'DeliveryDateDisplay') {
                        item.FieldName = 'DeliveryDate';
                    } else if (item.FieldName === 'BillStatusDisplay') {
                        item.FieldName = 'BillStatusDescription';
                    } else if (item.FieldName === 'CustomerTypeName') {
                        item.FieldName = 'CustomerTypeDisplay';
                    } else if (item.FieldName === 'DisputeStatusUpdatedDateDisplay') {
                        item.FieldName = 'DisputeStatusUpdatedDate';
                    } else {
                    }
                });

                searchClient.SearchFilterItems = self.searchFilterItems;
                searchClient.FromDate = self.FromDate();
                searchClient.ToDate = self.ToDate();
                searchClient.ExportType = exp.exportType;
                var filterModel = { ExportURL: "Accounting/ExportDisputeWonLostDataWithFilterInExcel", FilterModel: searchClient };
                return filterModel;
            };

            //## Region Export Options End.
            //set local storage key by url
            var url = $(location).attr('href');
            var urlArray = url.split('/');
            var localStorageId = urlArray.pop().toString().replace(/#/g, "");
            self.localStorageKey(localStorageId);
            if (localStorageId === "DisputeWon/Loss") {
                self.localStorageKey(localStorageId + "51");
            } else {
                self.localStorageKey(localStorageId);
            }
            self.setReportCriteria = function (reportActionObj) {
                if ((reportActionObj != undefined || reportActionObj != null) && (reportActionObj.gridOptions != undefined || reportActionObj.gridOptions != null) && (refSystem.isObject(reportActionObj.gridOptions.sortInfo())) && (reportActionObj.gridOptions.sortInfo().column != undefined || reportActionObj.gridOptions.sortInfo().column != null) && (reportActionObj.gridOptions.sortInfo().column.field != undefined || reportActionObj.gridOptions.sortInfo().column.field != null)) {
                    if (reportActionObj.gridOptions.sortInfo().column.field === 'BillDateDisplay') {
                        self.sortCol("BillDate");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'CustomerTypeName') {
                        self.sortCol("CustomerTypeDisplay");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'DeliveryDateDisplay') {
                        self.sortCol("DeliveryDate");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'DisputeDateDisplay') {
                        self.sortCol("DisputedDate");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'NewDisputeDateDisplay') {
                        self.sortCol("NewDisputedDate");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'BillStatusDisplay') {
                        self.sortCol("BillStatusDescription");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'SOPickupDateDisplay') {
                        self.sortCol("SOPickupDate");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'DisputeStatusUpdatedDateDisplay') {
                        self.sortCol("DisputeStatusUpdatedDate");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'DisputeWonAmount') {
                        self.sortCol("DisputedDate");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'DisputeLostAmount') {
                        self.sortCol("DisputedDate");
                    } else {
                        self.sortCol(reportActionObj.gridOptions.sortInfo().column.field);
                    }
                    self.sorttype(reportActionObj.gridOptions.sortInfo().direction);
                } else {
                    self.sortCol("DisputedDate");
                    self.sorttype("desc");
                }
                if (reportActionObj.filter1selectedItemId == undefined || reportActionObj.filter1selectedItemId == 0) {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectModeFromTheList, "info", null, toastrOptions);

                    self.disputeWonLossReportContainer.listProgress(false);
                    self.disputeWonLossReportContainer.selectedFilter1Item(self.modeType());
                } else {
                    self.gridOptions = reportActionObj.gridOptions;

                    if (self.modeType() != reportActionObj.filter1selectedItemId) {
                        self.modeType(reportActionObj.filter1selectedItemId);
                        self.disputeWonLossReportContainer.columnDefinition(self.setGridColumnDefinitions());
                    }

                    self.reportAction = reportActionObj;
                    if (self.disputeWonLossReportContainer.reportColumnFilter.isFilterApply || self.disputeWonLossReportContainer.isPaginationChanged || self.disputeWonLossReportContainer.isSortingChanged) {
                        if (self.isLoaded()) {
                            self.getReportData(self.reportAction);

                            //to block unwanted server calls
                            self.disputeWonLossReportContainer.isPaginationChanged = false;
                            self.disputeWonLossReportContainer.isSortingChanged = false;
                        }
                    }
                }
            };

            self.getReportData = function (reportActionObj) {
                if (self.validateDatePicker()) {
                    return false;
                }

                // ###END: DE20289
                var deferred = $.Deferred();
                var promise = deferred.promise();

                // ReSharper disable once AssignedValueIsNeverUsed
                var pageno = 0;
                pageno = Number(self.gridOptions.pagingOptions.currentPage());
                if (pageno > 0) {
                    // List View
                    self.disputeWonLossReportContainer.listProgress(true);

                    if (self.startDateForDisputeIterm() !== null && self.startDateForDisputeIterm() !== "") {
                        self.FromDate(self.startDateForDisputeIterm());
                    } else {
                        self.FromDate(new Date());
                    }
                    if (self.endDateForDisputeIterm() !== null && self.endDateForDisputeIterm() !== "") {
                        self.ToDate(self.endDateForDisputeIterm());
                    } else {
                        self.ToDate(new Date());
                    }

                    if (self.disputeWonLossReportContainer.reportColumnFilter.isFilterApply) {
                        self.searchText('');
                        self.gridOptions.filterOptions.filterText('');
                    }

                    var list = self.disputeWonLossReportContainer.reportColumnFilter.reportColumnFilters();
                    self.searchFilterItems.removeAll();
                    if (list.length > 0) {
                        list.forEach(function (items) {
                            self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
                            if (items.selectedserviceType() != undefined && items.selectedOperatorType() != undefined) {
                                if (items.selectedserviceType().field === 'BillDateDisplay') {
                                    self.searchFilterItem.FieldName = "BillDate";
                                } else if (items.selectedserviceType().field === 'DeliveryDateDisplay') {
                                    self.searchFilterItem.FieldName = "DeliveryDate";
                                } else if (items.selectedserviceType().field === 'BillStatusDisplay') {
                                    self.searchFilterItem.FieldName = "BillStatusDescription";
                                } else if (items.selectedserviceType().field === 'SOPickupDateDisplay') {
                                    self.searchFilterItem.FieldName = "SOPickupDate";
                                } else if (items.selectedserviceType().field === 'DisputeDateDisplay') {
                                    self.searchFilterItem.FieldName = "DisputedDate";
                                } else if (items.selectedserviceType().field === 'NewDisputeDateDisplay') {
                                    self.searchFilterItem.FieldName = "NewDisputedDate";
                                } else if (items.selectedserviceType().field === 'CustomerTypeName') {
                                    self.searchFilterItem.FieldName = "CustomerTypeDisplay";
                                } else if (items.selectedserviceType().field === 'DisputeStatusUpdatedDateDisplay') {
                                    self.searchFilterItem.FieldName = "DisputeStatusUpdatedDate";
                                } else {
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
                    self.disputeWonLossReportContainer.listProgress(true);
                    var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems };
                    var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.DisputeWonLossBoard, IsFilterApplied: self.disputeWonLossReportContainer.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), FromDate: self.FromDate(), ToDate: self.ToDate(), FromLocalStorage: self.fromLocalStorage() };

                    self.reportClient.getDisputeBillWonLossDetails(filterDataToSave, function (data) {
                        self.disputeWonLossReportContainer.listProgress(false);
                        self.setPagingData(data.VendorBillOrPurchaseOrderResponse, data.NumberOfRows, self.gridOptions.pagingOptions.pageSize());
                        deferred.resolve(data, reportActionObj.view);
                    }, function () {
                        self.disputeWonLossReportContainer.listProgress(false);
                        ////var toastrOptions = {
                        ////	toastrPositionClass: "toast-top-middle",
                        ////	delayInseconds: 10,
                        ////	fadeOut: 10,
                        ////	typeOfAlert: "",
                        ////	title: ""
                        ////}
                        ////Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ErrorOccurredWhileFetchingDisputeWonLossList, "error", null, toastrOptions);
                    }, self.gridOptions.pagingOptions);

                    //to block unwanted server calls
                    self.disputeWonLossReportContainer.isPaginationChanged = false;
                    self.disputeWonLossReportContainer.isSortingChanged = false;
                }
                return promise;
            };

            self.disputeWonLossReportContainer = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
            self.disputeWonLossReportContainer.onFilterChange = self.setReportCriteria;
            self.disputeWonLossReportContainer.ForceChange();

            // To open vendor Bill
            self.disputeWonLossReportContainer.onProNumberClick = function (shipmentObj) {
                var vendorBillId = shipmentObj.VendorBillId;
                _app.trigger("openVendorBill", vendorBillId, shipmentObj.PRONo, function (callback) {
                    if (!callback) {
                        return;
                    }
                });
            };

            // TO open sales Order
            self.disputeWonLossReportContainer.onBolNumberClick = function (shipmentObj) {
                var salesOrderId = shipmentObj.SalesOrderId;
                _app.trigger("openSalesOrder", salesOrderId, shipmentObj.BOLNumber, function (callback) {
                    if (!callback) {
                        return;
                    }
                });
            };
        }
        //#endregion
        //#region Internal Public methods
        //clearing all filter data
        DisputeWonLossViewModel.prototype.onClickClearAll = function () {
            var self = this;
            self.disputeWonLossReportContainer.reportColumnFilter.clearAll();
            self.disputeWonLossReportContainer.reportColumnFilter.applyFilter();
            self.isSearchFilterItemsData(false);
        };

        DisputeWonLossViewModel.prototype.onSubmit = function () {
            var self = this;
            self.getReportData(self.reportAction);
        };

        DisputeWonLossViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("DisputeBoardDetailsLostGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
                columnName: "DisputedDate",
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
            return grOption;
        };

        DisputeWonLossViewModel.prototype.setGridColumnDefinitions = function () {
            // ReSharper disable once AssignedValueIsNeverUsed
            var colDefinition = [];

            //## PRO Cell Template.
            var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'PRONo\'], click: function() { $userViewModel.onProNumberClick($parent.entity) }, attr:{ title: $data.getProperty($parent)}" />';
            var bolCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'BOLNumber\'], click: function() { $userViewModel.onBolNumberClick($parent.entity) }, attr:{ title: $data.getProperty($parent)}" />';
            colDefinition = [
                { field: 'PRONo', displayName: 'PRO #', width: 90, cellTemplate: proCellTemplate, type: _reportViewer.DataTypes.String },
                { field: 'BOLNumber', displayName: 'BOL #', width: 80, cellTemplate: bolCellTemplate, type: _reportViewer.DataTypes.String },
                { field: 'BillDateDisplay', displayName: 'Bill Date', width: 90, type: _reportViewer.DataTypes.DateTime },
                // ###START: DE23921
                { field: 'SOPickupDateDisplay', displayName: 'Pickup Date', width: 85, type: _reportViewer.DataTypes.DateTime },
                // ###START: DE23921
                { field: 'CustomerName', displayName: 'Customer Name', width: 100, type: _reportViewer.DataTypes.String },
                { field: 'CarrierName', displayName: 'Carrier', width: 325, type: _reportViewer.DataTypes.String },
                { field: 'SalesRepName', displayName: 'Sales Agent', width: 210, type: _reportViewer.DataTypes.String },
                { field: 'Amount', displayName: 'Actual Cost', width: 70, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric },
                { field: 'DisputedAmount', displayName: 'Dispute Amount', width: 80, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric },
                { field: 'DisputeWonAmount', displayName: 'Dispute Won', width: 80, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric, dntApplyFilter: true },
                { field: 'DisputeLostAmount', displayName: 'Dispute Lost', width: 80, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric, dntApplyFilter: true },
                // ##START: US23403
                { field: 'NewDisputeDateDisplay', displayName: 'Dispute Date', width: 80, type: _reportViewer.DataTypes.DateTime },
                // ##END: US23403
                { field: 'BillStatusDisplay', displayName: 'Bill Status', width: 100, type: _reportViewer.DataTypes.String },
                { field: 'WonOrLostRemark', displayName: 'Remarks', width: 80, type: _reportViewer.DataTypes.String },
                { field: 'ShipmentMode', displayName: 'Mode', width: 60, type: _reportViewer.DataTypes.String },
                { field: 'CustomerTypeName', displayName: 'Customer Type', width: 100, type: _reportViewer.DataTypes.String },
                { field: 'DisputeNote', displayName: 'Dispute Note', width: 100, type: _reportViewer.DataTypes.String },
                { field: 'DisputeStatusUpdatedBy', displayName: 'Updated By', width: 100, type: _reportViewer.DataTypes.String },
                { field: 'DisputeStatusUpdatedDateDisplay', displayName: 'Updated Date', width: 100, type: _reportViewer.DataTypes.DateTime }
            ];

            return colDefinition;
        };

        DisputeWonLossViewModel.prototype.setPagingData = function (data, page, pageSize) {
            var self = this;
            self.gridOptions.data(data);
            self.gridOptions.data.valueHasMutated();
            self.gridOptions.pagingOptions.totalServerItems(page);
        };

        DisputeWonLossViewModel.prototype.compositionComplete = function () {
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
                    self.disputeWonLossReportContainer.reportColumnFilter.addFilter(self.searchFilterItems);
                    if (self.searchFilterItems.length > 0) {
                        self.isSearchFilterItemsData(true);
                    } else {
                        self.isSearchFilterItemsData(false);
                    }
                }
                self.gridOptions.filterOptions.filterText('');
                self.searchText('');
                self.isLoaded(true);
                self.fromLocalStorage(true);
            };

            if (!LocalStorageController.Get(self.localStorageKey())) {
                self.commonClientCommand.GetUserGridSettings(refEnums.Enums.FilterViewName.DisputeWonLossBoard, successCallBack);
            } else {
                //using to show clear filter button after saving filtered data in local storage and switching between tab
                var filteredData = LocalStorageController.Get(self.localStorageKey());
                if (filteredData.UserGridSetting.Filters.length > 0) {
                    self.isSearchFilterItemsData(true);
                } else {
                    self.isSearchFilterItemsData(false);
                }
            }

            //to block unwanted server calls
            self.disputeWonLossReportContainer.isPaginationChanged = false;
            self.disputeWonLossReportContainer.isSortingChanged = false;
        };
        DisputeWonLossViewModel.prototype.load = function () {
            var self = this;
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
                    self.disputeWonLossReportContainer.reportColumnFilter.addFilter(self.searchFilterItems);
                }

                if (typeof pageRecord.isLoaded !== "undefined") {
                    self.isLoaded(pageRecord.isLoaded);
                }
                self.gridOptions.filterOptions.filterText(pageRecord.GridSearchText);
                self.searchText(pageRecord.GridSearchText);
                self.startDateForDisputeIterm(pageRecord.startDate);
                self.endDateForDisputeIterm(pageRecord.endDate);
                self.fromLocalStorage(true);
            }
            self.getReportData(self.reportAction);

            //to block unwanted server calls
            self.disputeWonLossReportContainer.isPaginationChanged = false;
            self.disputeWonLossReportContainer.isSortingChanged = false;
        };

        //#region Private Methods
        DisputeWonLossViewModel.prototype.reloadPage = function () {
            var self = this;
            self.listProgress(true);
            LocalStorageController.Set(self.localStorageKey(), undefined);
            LocalStorageController.Set(self.localStorageKey() + 'lastReloadDateTime', undefined);
            self.beforeBind();
        };

        //set Date Time for record of last refreshed
        DisputeWonLossViewModel.prototype.setDateTimeOfReload = function () {
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
        };

        //#region if user any numeric  date  without any format
        DisputeWonLossViewModel.prototype.convertToStartDate = function () {
            var self = this;
            if (!self.startDateForDisputeIterm().match('/') && self.startDateForDisputeIterm().length > 0) {
                self.startDateForDisputeIterm(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.startDateForDisputeIterm()));
            }
        };

        DisputeWonLossViewModel.prototype.convertToEndDate = function () {
            var self = this;
            if (self.endDateForDisputeIterm() !== undefined) {
                if (!self.endDateForDisputeIterm().match('/') && self.endDateForDisputeIterm().length > 0) {
                    self.endDateForDisputeIterm(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.endDateForDisputeIterm()));
                }
            }
        };

        // ###START: DE20289
        //Validating Dates
        DisputeWonLossViewModel.prototype.validateDatePicker = function () {
            var self = this;
            if (self.errorDates.errors().length != 0) {
                self.errorDates.errors.showAllMessages();
                return true;
            } else {
                return false;
            }
        };

        // ###END: DE20289
        //#endregion
        //#endregion
        //#region Life Cycle events
        DisputeWonLossViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        DisputeWonLossViewModel.prototype.activate = function () {
            return true;
        };

        DisputeWonLossViewModel.prototype.deactivate = function () {
            var self = this;
            var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems };
            var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.DisputeWonLossBoard, IsFilterApplied: self.disputeWonLossReportContainer.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), isLoaded: true, startDate: self.FromDate(), endDate: self.ToDate() };
            LocalStorageController.Set(self.localStorageKey(), filterDataToSave);

            self.cleanup();
        };

        DisputeWonLossViewModel.prototype.beforeBind = function () {
            var self = this;
            self.load();
        };

        DisputeWonLossViewModel.prototype.cleanup = function () {
            var self = this;

            self.disputeWonLossReportContainer.cleanup("DisputeBoardDetailsLostGrid");

            for (var prop in self) {
                if (prop !== "cleanup")
                    delete self[prop];
            }
            delete self;
        };
        return DisputeWonLossViewModel;
    })();

    return DisputeWonLossViewModel;
});
