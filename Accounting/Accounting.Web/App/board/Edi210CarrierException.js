/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', '../templates/reportViewerControlV2', 'services/models/common/Enums', 'services/client/BoardsClient', 'board/Edi210CarrierExceptionDetails', 'services/models/purchaseOrder/PurchaseOrderSearchFilter', 'services/client/VendorBillClient', 'services/client/CommonClient'], function(require, exports, ___router__, ___app__, __refSystem__, ___reportViewer__, __refEnums__, __refBoardsClient__, __refedi210CarrierExceptionDetailsViewModel__, ___refEDI210SearchFilterModel__, __refVendorBillClient__, __refCommonClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    var _reportViewer = ___reportViewer__;
    var refEnums = __refEnums__;
    var refBoardsClient = __refBoardsClient__;
    
    var refedi210CarrierExceptionDetailsViewModel = __refedi210CarrierExceptionDetailsViewModel__;
    
    var _refEDI210SearchFilterModel = ___refEDI210SearchFilterModel__;
    var refVendorBillClient = __refVendorBillClient__;
    var refCommonClient = __refCommonClient__;

    /***********************************************
    Edi210 Carrier Exception VIEWMODEL
    ************************************************
    ** <summary>
    ** Edi210 Carrier Exception Board View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US12941</id><by>Chadnan</by> <date>OCT/26/2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US24968</id> <by>Janakiram</by> <date>21-10-2016</date> <description>Added Additional Columns on the EDI Duplicate board like "Original VB Cost", "Duplicate VB Cost"</description>
    ** <id>US27900</id> <by>Shreesha Adiga</by> <date>03-05-2017</date><description>Allow opening edi record using URL params</description>
    ** </changeHistory>
    ***********************************************/
    var Edi210CarrierExceptionViewModel = (function () {
        //#region Constructer
        function Edi210CarrierExceptionViewModel() {
            //#region Properties
            this.ediCarrierExceptionReportContainer = null;
            this.headerOptions = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.boardClient = null;
            this.modeType = ko.observable();
            this.isLoaded = ko.observable(false);
            this.edi210SearchOption = ko.observableArray([]);
            // holds the selected Exception rule option.
            this.selectedExceptionRule = ko.observable();
            this.searchFilter = ko.observableArray([]);
            this.searchFilterItems = new Array();
            this.searchFilterItem = new _refEDI210SearchFilterModel.Models.PurchaseOrderSearchFilter();
            this.commonUtils = new Utils.Common();
            this.sortCol = ko.observable('');
            this.sorttype = ko.observable('');
            this.currentDateTime = ko.observable('');
            this.fromLocalStorage = ko.observable(false);
            this.localStorageKey = ko.observable('');
            this.isComingFromGridPROClick = ko.observable(false);
            this.isSearchFilterItemsData = ko.observable(false);
            this.commonClientCommand = new refCommonClient.Common();
            this.isFromSuperSearch = ko.observable(false);
            var self = this;

            if (refSystem.isObject(refEnums.Enums.ExceptionRuleId)) {
                self.edi210SearchOption.removeAll();
                for (var item in refEnums.Enums.ExceptionRuleId) {
                    self.edi210SearchOption.push(refEnums.Enums.ExceptionRuleId[item]);
                }
            }

            self.edi210CarrierExceptionDetailsViewModel = new refedi210CarrierExceptionDetailsViewModel.Edi210CarrierExceptionReportsViewModel(function () {
                self.onBackClick();
            });

            self.headerOptions = new _reportViewer.ReportHeaderOption();
            self.headerOptions.reportHeader = " ";
            self.headerOptions.reportName = "EDI210 Carrier Exception";
            self.headerOptions.gridTitleHeader = " ";
            self.searchText = ko.observable("");
            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);
            self.boardClient = new refBoardsClient.BoardsClientCommands();

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
                    if (item.FieldName === 'PickUpdateDisplay') {
                        item.FieldName = "PickUpdate";
                    } else if (item.FieldName === 'CreatedDateDisplay') {
                        item.FieldName = 'CreatedDate';
                    } else {
                    }
                });

                searchClient.SearchFilterItems = self.searchFilterItems;
                searchClient.GridViewId = 0;
                searchClient.VendorName = '';
                searchClient.ProNumber = '';
                searchClient.FromDate = new Date();
                searchClient.ToDate = new Date();
                searchClient.SelectedExceptionRule = self.selectedExceptionRule();
                searchClient.ExportType = exp.exportType;
                var filterModel = { ExportURL: "Accounting/ExportEDI210CarrierExceptionInExcel?exceptionRuleId=", FilterModel: searchClient };
                return filterModel;
            };

            //## Region Export Options End.
            //set local storage key by url
            var url = $(location).attr('href');
            var urlArray = url.split('/');
            var localStorageId = urlArray.pop().toString().replace(/#/g, "");
            self.localStorageKey(localStorageId);
            if (localStorageId === "Edi210CarrierException") {
                self.localStorageKey(localStorageId + "37");
            } else {
                self.localStorageKey(localStorageId);
            }

            self.setReportCriteria = function (reportActionObj) {
                var reportActionObjtext = reportActionObj.gridOptions.sortInfo;

                if ((reportActionObj != undefined || reportActionObj != null) && (reportActionObj.gridOptions != undefined || reportActionObj.gridOptions != null) && (refSystem.isObject(reportActionObj.gridOptions.sortInfo())) && (reportActionObj.gridOptions.sortInfo().column != undefined || reportActionObj.gridOptions.sortInfo().column != null) && (reportActionObj.gridOptions.sortInfo().column.field != undefined || reportActionObj.gridOptions.sortInfo().column.field != null)) {
                    if (reportActionObj.gridOptions.sortInfo().column.field === 'PickUpdateDisplay') {
                        self.sortCol("PickUpdate");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'CreatedDateDisplay') {
                        self.sortCol("CreatedDate");
                    } else {
                        self.sortCol(reportActionObj.gridOptions.sortInfo().column.field);
                    }
                    self.sorttype(reportActionObj.gridOptions.sortInfo().direction);
                } else {
                    self.sortCol("CreatedDate");
                    self.sorttype("asc");
                }
                reportActionObjtext().column.field;
                self.gridOptions = reportActionObj.gridOptions;

                if (self.ediCarrierExceptionReportContainer.reportColumnFilter.isFilterApply || self.ediCarrierExceptionReportContainer.isPaginationChanged || self.ediCarrierExceptionReportContainer.isSortingChanged) {
                    if (self.isLoaded()) {
                        self.getReportData(reportActionObj);

                        //to block unwanted server calls
                        self.ediCarrierExceptionReportContainer.isPaginationChanged = false;
                        self.ediCarrierExceptionReportContainer.isSortingChanged = false;
                    }
                }
            };

            self.getReportData = function (reportActionObj) {
                var deferred = $.Deferred();
                var promise = deferred.promise();

                // ReSharper disable once AssignedValueIsNeverUsed
                var pageno = 0;
                pageno = Number(self.gridOptions.pagingOptions.currentPage());
                if (pageno > 0) {
                    // List View
                    self.ediCarrierExceptionReportContainer.listProgress(true);
                    if (self.ediCarrierExceptionReportContainer.reportColumnFilter.isFilterApply) {
                        self.searchText('');
                        self.gridOptions.filterOptions.filterText('');
                    }

                    var list = self.ediCarrierExceptionReportContainer.reportColumnFilter.reportColumnFilters();
                    self.searchFilterItems.removeAll();
                    if (list.length > 0) {
                        list.forEach(function (items) {
                            self.searchFilterItem = new _refEDI210SearchFilterModel.Models.PurchaseOrderSearchFilter();
                            if (items.selectedserviceType() != undefined && items.selectedOperatorType() != undefined) {
                                if (items.selectedserviceType().field === 'PickUpdateDisplay') {
                                    self.searchFilterItem.FieldName = "PickUpdate";
                                } else if (items.selectedserviceType().field === 'CreatedDateDisplay') {
                                    self.searchFilterItem.FieldName = "CreatedDate";
                                } else if (items.selectedserviceType().field === 'PickUpdateDisplay') {
                                    self.searchFilterItem.FieldName = "PickUpdate";
                                } else if (items.selectedserviceType().field === 'CreatedDateDisplay') {
                                    self.searchFilterItem.FieldName = "CreatedDate";
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

                    //}
                    self.ediCarrierExceptionReportContainer.listProgress(true);
                    var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems };
                    var filterDataToSave = { ExceptionRuleId: self.selectedExceptionRule(), UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.EDIBoard, IsFilterApplied: self.ediCarrierExceptionReportContainer.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.gridOptions.pagingOptions.currentPage(), PageSize: self.gridOptions.pagingOptions.pageSize(), SortCol: self.sortCol(), SortOrder: self.sorttype(), FromLocalStorage: self.fromLocalStorage() };
                    self.boardClient.getEdi210CarrierExceptionBoardDetails(filterDataToSave, function (data) {
                        self.isLoaded(true);
                        self.ediCarrierExceptionReportContainer.listProgress(false);
                        self.setPagingData(data.Edi210CarrierExceptionBoard, data.TotalRows, self.gridOptions.pagingOptions.pageSize());
                        deferred.resolve(data, reportActionObj.view);
                        self.ediCarrierExceptionReportContainer.invokeHighlight(self.searchText());
                    }, function () {
                        self.ediCarrierExceptionReportContainer.listProgress(false);
                    }, self.gridOptions.pagingOptions);
                }

                // redirects to sales order details page
                self.ediCarrierExceptionReportContainer.onProNumberClick = function (items) {
                    self.isComingFromGridPROClick(true);
                    LocalStorageController.Set(self.localStorageKey() + 'EDI210ExceptionDetails', undefined);
                    var selectedBOL, selectedEDItDetailId, selectedBatchId;
                    if (items != null) {
                        selectedBOL = items.BOL;
                        selectedEDItDetailId = items.EDIDetailID;
                        selectedBatchId = items.BatchID;
                    }
                    self.edi210CarrierExceptionDetailsViewModel.exceptionRuleID(self.selectedExceptionRule());

                    // Store in the local storage
                    var data = { selectedExceptionRule: self.selectedExceptionRule(), selectedBOL: selectedBOL, selectedEDItDetailId: selectedEDItDetailId, selectedBatchId: selectedBatchId };
                    LocalStorageController.Set(self.localStorageKey() + 'EDI210ExceptionDetails', data);
                    self.onProClick(self.selectedExceptionRule(), selectedBOL, selectedEDItDetailId, selectedBatchId);
                    $('.searchpop').hide();
                    $('.resultpop').show('slide', { direction: 'right' }, 200);
                };

                //to block unwanted server calls
                self.ediCarrierExceptionReportContainer.isPaginationChanged = false;
                self.ediCarrierExceptionReportContainer.isSortingChanged = false;
                return promise;
            };

            self.ediCarrierExceptionReportContainer = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
            self.ediCarrierExceptionReportContainer.onFilterChange = self.setReportCriteria;
            self.ediCarrierExceptionReportContainer.ForceChange();

            self.ediCarrierExceptionReportContainer.onSearchTextChange = function (reportViewer, newSearchValue) {
                if (newSearchValue.length >= 3 || newSearchValue.length == 0) {
                    if (self.selectedExceptionRule() === 1) {
                        var data = new Array();
                        self.setPagingData(data, 0, self.gridOptions.pagingOptions.pageSize());
                    }
                    if (self.selectedExceptionRule() === 2) {
                    }
                    if (self.selectedExceptionRule() === 3) {
                    }
                    if (self.selectedExceptionRule() === 7 || self.selectedExceptionRule() === 8 || self.selectedExceptionRule() === 9) {
                    }
                    self.searchText(newSearchValue.trim());
                    if (!self.ediCarrierExceptionReportContainer.reportColumnFilter.isFilterApply) {
                        self.ediCarrierExceptionReportContainer.reportColumnFilter.clearAll();
                    }

                    //self.ediCarrierExceptionReportContainer.reportColumnFilter.isFilterApply = false;
                    self.getReportData(self.reportAction);
                    self.gridOptions.pagingOptions.currentPage(1);
                }
            };

            self.selectedExceptionRule.subscribe(function () {
                // ###START: US24968
                self.modeType(self.selectedExceptionRule());
                self.ediCarrierExceptionReportContainer.columnDefinition(self.setGridColumnDefinitions());

                self.ediCarrierExceptionReportContainer.reportColumnFilter.newgridColumns = $.grep(self.ediCarrierExceptionReportContainer.columnDefinition(), function (item) {
                    return item.field != undefined;
                });

                self.ediCarrierExceptionReportContainer.reportColumnFilter.reportColumnFilters.removeAll();
                self.ediCarrierExceptionReportContainer.reportColumnFilter.reportColumnFilters.push(new _reportViewer.ReportColumnFilters(self.ediCarrierExceptionReportContainer.columnDefinition(), null));

                // ###END: US24968
                self.generateReport();
            });

            return self;
        }
        //#endregion
        //#region Internal Public methods
        //clearing all filter data
        Edi210CarrierExceptionViewModel.prototype.onClickClearAll = function () {
            var self = this;
            self.ediCarrierExceptionReportContainer.reportColumnFilter.clearAll();
            self.ediCarrierExceptionReportContainer.reportColumnFilter.applyFilter();
            self.isSearchFilterItemsData(false);
            //$('#gridPORexnordBoard').removeClass('margin-top--36');
        };

        //onPro Click methods for open new view with data which is depand on Exception rule. "self.selectedExceptionRule()"
        Edi210CarrierExceptionViewModel.prototype.onProClick = function (selectedExceptionRileId, BOL, EDIDetailId, selectedBatchId) {
            var self = this;
            if (self.isComingFromGridPROClick()) {
                LocalStorageController.Set(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult', undefined);
                self.isComingFromGridPROClick(false);
            }
            self.edi210CarrierExceptionDetailsViewModel.isSaveEnable(false);
            if (selectedExceptionRileId === 1) {
                self.edi210CarrierExceptionDetailsViewModel.initilizeUnmappedCode(selectedExceptionRileId, EDIDetailId, selectedBatchId);
            }
            if (selectedExceptionRileId === 2) {
                self.edi210CarrierExceptionDetailsViewModel.initilizeDuplicatePRO(selectedExceptionRileId, EDIDetailId, BOL, selectedBatchId);
            }
            if (selectedExceptionRileId === 3) {
                self.edi210CarrierExceptionDetailsViewModel.initilizeCorrected(selectedExceptionRileId, EDIDetailId, selectedBatchId);
            }
            if (selectedExceptionRileId === 7 || selectedExceptionRileId === 8 || selectedExceptionRileId === 9) {
                //self.edi210CarrierExceptionDetailsViewModel.initilizeCarrierExceptionDetails(self.selectedExceptionRule());
                self.edi210CarrierExceptionDetailsViewModel.initilizeBOLNotCompletedBOLCancledOrCarrierNotMapped(selectedExceptionRileId, EDIDetailId, BOL, selectedBatchId);
            }
        };

        Edi210CarrierExceptionViewModel.prototype.generateReport = function () {
            var self = this;
            self.gridOptions.pagingOptions.currentPage(1);
            self.getReportData(self.reportAction);
        };

        Edi210CarrierExceptionViewModel.prototype.onBackClick = function () {
            var self = this;
            var localData = LocalStorageController.Get(self.localStorageKey() + 'EDI210ExceptionDetails');
            if (localData) {
                self.selectedExceptionRule(localData.selectedExceptionRule);
            }

            LocalStorageController.Set(self.localStorageKey() + 'EDI210ExceptionDetails', undefined);
            LocalStorageController.Set(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult', undefined);
            $('.searchpop').show('slide', { direction: 'left' }, 200);
            $('.resultpop').hide();

            //self.gridOptions.pagingOptions.currentPage(1);
            self.getReportData(self.reportAction);

            //If toastr message from subbill exists, then remove after 5 seconds
            setTimeout(function () {
                if ($('.toast-top-middle').length != 0) {
                    $('.toast-top-middle').remove();
                }
            }, 5000);

            // DE192255 (Issue on Sub Bill Creation_EDI210) while click on check box
            self.edi210CarrierExceptionDetailsViewModel.edi210CarrierExceptionDuplicateBillItemViewModel.isDiscountSelected = false;
            self.edi210CarrierExceptionDetailsViewModel.edi210CarrierExceptionDuplicateBillItemViewModel.isShippingServiceSelected = false;
        };

        //#region Private Methods
        Edi210CarrierExceptionViewModel.prototype.reloadPage = function () {
            var self = this;

            //self.ediCarrierExceptionReportContainer.listProgress(true);
            LocalStorageController.Set(self.localStorageKey(), undefined);
            LocalStorageController.Set(self.localStorageKey() + 'lastReloadDateTime', undefined);
            LocalStorageController.Set(self.localStorageKey() + 'EDI210ExceptionDetails', undefined);
            self.load();
        };

        //set Date Time for record of last refreshed
        Edi210CarrierExceptionViewModel.prototype.setDateTimeOfReload = function () {
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

        //#endregion Public Methods
        //#region Private Methods
        Edi210CarrierExceptionViewModel.prototype.setPagingData = function (data, page, pageSize) {
            var self = this;
            self.gridOptions.data(data);
            self.gridOptions.data.valueHasMutated();
            self.gridOptions.pagingOptions.totalServerItems(page);
        };

        Edi210CarrierExceptionViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("EDI210ExceptionBoardDetailsGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
                columnName: "CreatedDateDisplay",
                order: "ASC"
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
            grOption.showColumnMenu = true;
            grOption.useClientSideFilterAndSort = false;
            grOption.useExternalFilter = true;
            return grOption;
        };

        Edi210CarrierExceptionViewModel.prototype.setGridColumnDefinitions = function () {
            var self = this;
            var colDefinition = [];
            var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'Pro\'], click: function() { $userViewModel.onProNumberClick($parent.entity) }, attr:{ title: $data.getProperty($parent)}" />';

            if (self.selectedExceptionRule() === 2) {
                colDefinition = [
                    { field: 'Pro', displayName: 'PRO#', cellTemplate: proCellTemplate, isRemovable: false, width: 110, type: _reportViewer.DataTypes.String },
                    { field: 'BOL', displayName: 'BOL#', width: 90, type: _reportViewer.DataTypes.String },
                    { field: 'CarrierName', displayName: 'Carrier Name', width: 120, type: _reportViewer.DataTypes.String },
                    { field: 'CarrierCode', displayName: 'Carrier Code', width: 90, type: _reportViewer.DataTypes.String },
                    { field: 'VendorBillType', displayName: 'Vendor Bill Type', width: 90, type: _reportViewer.DataTypes.String },
                    { field: 'EDICode', displayName: 'EDI Code', width: 90, type: _reportViewer.DataTypes.String },
                    { field: 'EDIDescription', displayName: 'EDI Description', width: 120, type: _reportViewer.DataTypes.String },
                    { field: 'Shipper', displayName: 'Shipper', width: 90, type: _reportViewer.DataTypes.String },
                    { field: 'Consignee', displayName: 'Consignee', width: 110, type: _reportViewer.DataTypes.String },
                    { field: 'PickUpdateDisplay', displayName: 'Pick Up Date', width: 90, type: _reportViewer.DataTypes.DateTime },
                    { field: 'CreatedDateDisplay', displayName: 'Created Date', width: 110, type: _reportViewer.DataTypes.DateTime, isRemovable: false },
                    { field: 'ExceptionDetails', displayName: 'Exception Details', width: 145, type: _reportViewer.DataTypes.String },
                    { field: 'OriginalVBCost', displayName: 'Original VB Cost', width: 110, type: _reportViewer.DataTypes.String },
                    { field: 'DuplicateVBCost', displayName: 'Duplicate VB Cost', width: 110, type: _reportViewer.DataTypes.String }
                ];
            } else {
                colDefinition = [
                    { field: 'Pro', displayName: 'PRO#', cellTemplate: proCellTemplate, isRemovable: false, width: 110, type: _reportViewer.DataTypes.String },
                    { field: 'BOL', displayName: 'BOL#', width: 90, type: _reportViewer.DataTypes.String },
                    { field: 'CarrierName', displayName: 'Carrier Name', width: 120, type: _reportViewer.DataTypes.String },
                    { field: 'CarrierCode', displayName: 'Carrier Code', width: 90, type: _reportViewer.DataTypes.String },
                    { field: 'VendorBillType', displayName: 'Vendor Bill Type', width: 90, type: _reportViewer.DataTypes.String },
                    { field: 'EDICode', displayName: 'EDI Code', width: 90, type: _reportViewer.DataTypes.String },
                    { field: 'EDIDescription', displayName: 'EDI Description', width: 120, type: _reportViewer.DataTypes.String },
                    { field: 'Shipper', displayName: 'Shipper', width: 90, type: _reportViewer.DataTypes.String },
                    { field: 'Consignee', displayName: 'Consignee', width: 110, type: _reportViewer.DataTypes.String },
                    { field: 'PickUpdateDisplay', displayName: 'Pick Up Date', width: 90, type: _reportViewer.DataTypes.DateTime },
                    { field: 'CreatedDateDisplay', displayName: 'Created Date', width: 110, type: _reportViewer.DataTypes.DateTime, isRemovable: false },
                    { field: 'ExceptionDetails', displayName: 'Exception Details', width: 145, type: _reportViewer.DataTypes.String }
                ];
            }

            // ###END: US24968
            return colDefinition;
        };

        //#endregion Private Methods
        //#region Life Cycle Event
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        Edi210CarrierExceptionViewModel.prototype.load = function () {
            //** if bindedData is null then return false. */
            //if (!bindedData)
            //	return;
            var self = this;

            var pageRecord = LocalStorageController.Get(self.localStorageKey());
            if (pageRecord != null) {
                self.gridOptions.pagingOptions.currentPage(pageRecord.PageNo);
                self.gridOptions.pagingOptions.pageSize(pageRecord.UserGridSetting.PageSize);
                self.sortCol(pageRecord.SortCol);
                self.sorttype(pageRecord.SortOrder);
                self.selectedExceptionRule(pageRecord.edi210SearchOption);
                var list = pageRecord.UserGridSetting.Filters;
                self.searchFilterItems.removeAll();
                if (list.length > 0 && list[0].FieldName) {
                    list.forEach(function (items) {
                        self.searchFilterItem = new _refEDI210SearchFilterModel.Models.PurchaseOrderSearchFilter();

                        self.searchFilterItem.FieldName = items.FieldName;
                        self.searchFilterItem.Operand = items.Operand;
                        self.searchFilterItem.SearchText = items.SearchText;
                        self.searchFilterItems.push(self.searchFilterItem);
                    });
                    self.ediCarrierExceptionReportContainer.reportColumnFilter.addFilter(self.searchFilterItems);
                }

                if (typeof pageRecord.isLoaded !== "undefined") {
                    self.isLoaded(pageRecord.isLoaded);
                }
                self.fromLocalStorage(true);
            }
            self.getReportData(self.reportAction);

            //to block unwanted server calls
            self.ediCarrierExceptionReportContainer.isPaginationChanged = false;
            self.ediCarrierExceptionReportContainer.isSortingChanged = false;
        };

        Edi210CarrierExceptionViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //The composition engine will execute it prior to calling the binder.
        // ##START: US27900
        Edi210CarrierExceptionViewModel.prototype.activate = function (ediDetailId, batchId, exceptionRuleId) {
            if (parseInt(ediDetailId) && parseInt(batchId) && parseInt(exceptionRuleId)) {
                var data = {
                    ExceptionRuleId: parseInt(exceptionRuleId),
                    EdiDetailId: parseInt(ediDetailId),
                    BatchId: parseInt(batchId)
                };

                LocalStorageController.Set('EDI210ExceptionDetailsFromSuperSearch', data);
            }

            return true;
        };

        // ##END: US27900
        Edi210CarrierExceptionViewModel.prototype.deactivate = function () {
            var self = this;
            var data = {
                //isLoaded: self.isLoaded(),
                pageSize: self.gridOptions.pagingOptions.pageSize(),
                currentPage: self.gridOptions.pagingOptions.currentPage()
            };
            _app.trigger("registerMyData", data);

            var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems };
            var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.InvoiceExceptionBoard, IsFilterApplied: self.ediCarrierExceptionReportContainer.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), isLoaded: true, edi210SearchOption: self.selectedExceptionRule() };
            LocalStorageController.Set(self.localStorageKey(), filterDataToSave);
        };

        //To load the registered data if any existed.
        Edi210CarrierExceptionViewModel.prototype.beforeBind = function () {
            var self = this;
            if (LocalStorageController.Get('EDI210ExceptionDetailsFromSuperSearch')) {
                self.isFromSuperSearch(true);
                LocalStorageController.Set(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult', undefined);
            }
        };

        Edi210CarrierExceptionViewModel.prototype.compositionComplete = function () {
            var self = this;

            if (self.isFromSuperSearch() && LocalStorageController.Get('EDI210ExceptionDetailsFromSuperSearch')) {
                var data = LocalStorageController.Get('EDI210ExceptionDetailsFromSuperSearch');
                self.selectedExceptionRule(data.ExceptionRuleId);

                // Store in the local storage
                var localdata = { selectedExceptionRule: data.ExceptionRuleId, selectedBOL: "", selectedEDItDetailId: data.EdiDetailId, selectedBatchId: data.BatchId };
                LocalStorageController.Set(self.localStorageKey() + 'EDI210ExceptionDetails', localdata);
                self.onProClick(data.ExceptionRuleId, "", data.EdiDetailId, data.BatchId);

                LocalStorageController.Set('EDI210ExceptionDetailsFromSuperSearch', undefined);
                self.isFromSuperSearch(false);
                $('.searchpop').hide();
                $('.resultpop').show('slide', { direction: 'right' }, 200);
            } else if (!LocalStorageController.Get(self.localStorageKey() + 'EDI210ExceptionDetails') && !LocalStorageController.Get(self.localStorageKey())) {
                var successCallBack = function (data) {
                    self.searchText('');
                    var filterlist = data.Filters;
                    self.gridOptions.pagingOptions.pageSize(data.PageSize);
                    self.gridOptions.pagingOptions.currentPage(1);

                    self.searchFilterItems.removeAll();
                    if (filterlist.length > 0 && filterlist[0].FieldName != null) {
                        filterlist.forEach(function (items) {
                            self.searchFilterItem = new _refEDI210SearchFilterModel.Models.PurchaseOrderSearchFilter();
                            self.searchFilterItem.FieldName = items.FieldName;
                            self.searchFilterItem.Operand = items.Operand;
                            self.searchFilterItem.SearchText = items.SearchText;
                            self.searchFilterItems.push(self.searchFilterItem);
                        });
                        self.ediCarrierExceptionReportContainer.reportColumnFilter.addFilter(self.searchFilterItems);
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
                    self.commonClientCommand.GetUserGridSettings(refEnums.Enums.FilterViewName.EDIBoard, successCallBack);
                }
            } else {
                var localData = LocalStorageController.Get(self.localStorageKey() + 'EDI210ExceptionDetails');
                if (localData) {
                    self.edi210CarrierExceptionDetailsViewModel.exceptionRuleID(localData.selectedExceptionRule);
                    self.onProClick(localData.selectedExceptionRule, localData.selectedBOL, localData.selectedEDItDetailId, localData.selectedBatchId);

                    //$('.searchpop').show('slide', { direction: 'left' }, 200);
                    //$('.resultpop').hide();
                    $('.searchpop').hide();
                    $('.resultpop').show('slide', { direction: 'right' }, 200);
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
            }

            //to block unwanted server calls
            self.ediCarrierExceptionReportContainer.isPaginationChanged = false;
            self.ediCarrierExceptionReportContainer.isSortingChanged = false;
        };
        return Edi210CarrierExceptionViewModel;
    })();
    return Edi210CarrierExceptionViewModel;
});
