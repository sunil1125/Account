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
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/models/common/Enums', '../templates/reportViewerControlV2', 'services/client/CommonClient'], function(require, exports, ___router__, ___app__, __refEnums__, ___reportViewer__, __refCommonClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refEnums = __refEnums__;
    var _reportViewer = ___reportViewer__;
    var refCommonClient = __refCommonClient__;

    //#endregion
    /*
    ** <summary>
    ** Transaction Search Result View Model
    ** </summary>
    ** <createDetails>
    ** <id>US8214</id> <by>Avinash Dubey</by> <date>09th July, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id>US19556</id> <by>Baldev Singh Thakur</by> <date>19-11-2015</date>
    ** <id>DE23350</id> <by>Baldev Singh Thakur</by> <date>30-06-2016</date> <description>Hiding EDI Grid for Rexnord User</description>
    ** </changeHistory>
    */
    var SearchResult = (function () {
        //#endregion
        //#region Constructor
        function SearchResult() {
            var _this = this;
            //#region Members
            this.searchProValueContainer = null;
            this.searchBolValueContainer = null;
            this.searchEdiValueContainer = null;
            this.proHeader = null;
            this.bolHeader = null;
            this.edi210Header = null;
            this.proGrid = null;
            this.bolGrid = null;
            this.edi210Grid = null;
            this.proReportAction = null;
            this.bolReportAction = null;
            this.edi210ReportAction = null;
            this.proData = null;
            this.bolData = null;
            this.edi210Data = null;
            this.modeType = ko.observable();
            this.commonUtils = new Utils.Common();
            this.vendorBillId = ko.observable();
            this.salesorderid = ko.observable('');
            this.isVendorBillVisible = ko.observable(false);
            this.isSalesVisible = ko.observable(false);
            this.isEdi210Visible = ko.observable(false);
            this.commonClient = new refCommonClient.Common();
            var self = this;
            self.proHeader = new _reportViewer.ReportHeaderOption();
            self.proHeader.reportHeader = "";
            self.proHeader.reportName = "Vendor Bill Payment Details";
            self.proHeader.gridTitleHeader = "Vendor Bills";

            self.bolHeader = new _reportViewer.ReportHeaderOption();
            self.bolHeader.reportHeader = "";
            self.bolHeader.reportName = "Sales Bill Payment Details";
            self.bolHeader.gridTitleHeader = "Sales Orders";

            self.edi210Header = new _reportViewer.ReportHeaderOption();
            self.edi210Header.reportHeader = "";
            self.edi210Header.reportName = "Edi 210 Details";
            self.edi210Header.gridTitleHeader = "EDI";

            //initialize date filters
            self.proReportAction = new _reportViewer.ReportAction();
            self.bolReportAction = new _reportViewer.ReportAction();
            self.edi210ReportAction = new _reportViewer.ReportAction();
            self.proGrid = self.setProGridOptions(self);
            self.bolGrid = self.setBolGridOptions(self);
            self.edi210Grid = self.setedi210GridOptions(self);

            self.setProReportCriteria = function (reportActionObj) {
                _this.proGridOptions = reportActionObj.gridOptions;
                if (_this.proReportAction != null) {
                    if ((_this.modeType() != reportActionObj.filter1selectedItemId) || (_this.proReportAction.view != reportActionObj.view) || (reportActionObj.dateFrom != _this.proReportAction.dateFrom) || (reportActionObj.dateTo != _this.proReportAction.dateTo)) {
                        _this.proGridOptions.pagingOptions.currentPage(1);
                    }
                }

                // Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
                // we don't want any data on page load so we commented getReportdata  function.
                // self.getReportData();
                self.proReportAction = reportActionObj;
            };

            self.setBolReportCriteria = function (reportActionObj) {
                _this.bolGridOptions = reportActionObj.gridOptions;
                if (_this.bolReportAction != null) {
                    if ((_this.modeType() != reportActionObj.filter1selectedItemId) || (_this.bolReportAction.view != reportActionObj.view) || (reportActionObj.dateFrom != _this.bolReportAction.dateFrom) || (reportActionObj.dateTo != _this.bolReportAction.dateTo)) {
                        _this.bolGridOptions.pagingOptions.currentPage(1);
                    }
                }

                // Re-set the oldGrid Columns since the prev. selection of serviceType is diff. to the Current selection
                // we don't want any data on page load so we commented getReportdata  function.
                //self.getReportData();
                _this.bolReportAction = reportActionObj;
            };

            self.setEdi210ReportCriteria = function (reportActionObj) {
                _this.edi210GridOptions = reportActionObj.gridOptions;
                if (_this.edi210ReportAction != null) {
                    if ((_this.modeType() != reportActionObj.filter1selectedItemId) || (_this.bolReportAction.view != reportActionObj.view) || (reportActionObj.dateFrom != _this.bolReportAction.dateFrom) || (reportActionObj.dateTo != _this.bolReportAction.dateTo)) {
                        _this.bolGridOptions.pagingOptions.currentPage(1);
                    }
                }

                // Re-set the oldGrid Columns since the prev. selection of serviceType is diff. to the Current selection
                // we don't want any data on page load so we commented getReportdata  function.
                //self.getReportData();
                _this.edi210ReportAction = reportActionObj;
            };

            // Assign the Old value oldGrid settings
            self.searchBolValueContainer = new _reportViewer.ReportViewerControlV2(self.bolHeader, self.bolGrid);
            self.searchBolValueContainer.onFilterChange = self.setBolReportCriteria;
            self.searchBolValueContainer.ForceChange();

            // Assign the New value newGrid settings
            self.searchProValueContainer = new _reportViewer.ReportViewerControlV2(self.proHeader, self.proGrid);
            self.searchProValueContainer.onFilterChange = self.setProReportCriteria;
            self.searchProValueContainer.ForceChange();

            // Assign the New value newGrid settings
            self.searchEdiValueContainer = new _reportViewer.ReportViewerControlV2(self.edi210Header, self.edi210Grid);
            self.searchEdiValueContainer.onFilterChange = self.setEdi210ReportCriteria;
            self.searchEdiValueContainer.ForceChange();

            // redirects to Vendor bill order page
            self.searchProValueContainer.onGridColumnClick = function (shipmentObj) {
                var vendorBillId = shipmentObj.VendorBillId;
                var checkPo = shipmentObj.IsPurchaseOrder;
                if (checkPo) {
                    _app.trigger("openPurchaseOrder", vendorBillId, shipmentObj.PRONumber, function (callback) {
                        if (!callback) {
                            return;
                        }
                    });
                } else {
                    _app.trigger("openVendorBill", vendorBillId, shipmentObj.PRONumber, function (callback) {
                        if (!callback) {
                            return;
                        }
                    });
                }
            };

            // redirects to Vendor bill order page
            self.searchBolValueContainer.onGridColumnClick = function (shipmentObj) {
                var shipmentId = shipmentObj.ShipmentId;
                _app.trigger("openSalesOrder", shipmentId, shipmentObj.BOLNumber, function (callback) {
                    if (!callback) {
                        return;
                    }
                });
            };

            // redirects to Vendor bill order page
            self.searchEdiValueContainer.onGridColumnClick = function (shipmentObj) {
                if (shipmentObj.ExceptionRuleId != 0 && shipmentObj.ExceptionRuleId != null && shipmentObj.ExceptionRuleId != undefined) {
                    _app.trigger("openEdi210Board", shipmentObj.ExceptionRuleId, shipmentObj.EDIDetailID, shipmentObj.BatchId, shipmentObj.ProNumber);
                }
            };

            return self;
        }
        //#endregion
        //#region Public Methods
        SearchResult.prototype.initializeSearchDetails = function (data) {
            var self = this;
            if (data) {
                self.originalData = data;

                // ###START: DE23350
                self.isEdi210Visible(data.IsRexnord);

                // ###END: DE23350
                self.setPagingData(ko.observableArray(data.VendorBillSearchResults), self.proGridOptions, self.proReportAction);
                self.setPagingData(ko.observableArray(data.SalesOrderSearchResults), self.bolGridOptions, self.bolReportAction);
                self.setPagingData(ko.observableArray(data.Edi210SearchResults), self.edi210GridOptions, self.edi210ReportAction);

                self.searchBolValueContainer.listProgress(false);
                self.searchProValueContainer.listProgress(false);
                self.searchEdiValueContainer.listProgress(false);

                $('.noLeftBorder').parent().css('border-left', '0');
                $('.noRightBorder').parent().css('border-right', '0');
            } else {
                self.searchBolValueContainer.listProgress(false);
                self.searchProValueContainer.listProgress(false);
                self.searchEdiValueContainer.listProgress(false);
            }
        };

        //#endregion
        //#region Private Methods
        SearchResult.prototype.setPagingData = function (data, grid, gridOption) {
            Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
        };

        SearchResult.prototype.setProGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("TransactionSearchGridBol");
            grOption.columnDefinition = self.setProGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
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
        };

        SearchResult.prototype.setBolGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("TransactionSearchGridPro");
            grOption.columnDefinition = self.setBolGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
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
        };

        SearchResult.prototype.setedi210GridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("TransactionSearchGridEdi");
            grOption.columnDefinition = self.setEdi210GridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
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
        };

        SearchResult.prototype.setProGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;

            //## PRO Cell Template.
            var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'PRONumber\'], click: function() { $userViewModel.onGridColumnClick($parent.entity) }" />';
            colDefinition = [
                { field: 'PRONumber', displayName: 'PRONumber', cellTemplate: proCellTemplate, width: 350 },
                { field: 'BOLNumber', displayName: 'BOL Number', width: 300 },
                { field: 'BillDateDisplay', displayName: 'BillDate', width: 300 },
                { field: 'BillStatusDisplay', displayName: 'Bill Status', width: 305 },
                { field: 'Amount', displayName: 'Cost', width: 305, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric }
            ];
            return colDefinition;
        };

        SearchResult.prototype.setBolGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;

            //## PRO Cell Template.
            var bolCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'BOLNumber\'], click: function() { $userViewModel.onGridColumnClick($parent.entity) }" />';

            colDefinition = [
                { field: 'BOLNumber', displayName: 'BOL Number', cellTemplate: bolCellTemplate, width: 350 },
                { field: 'PRONumber', displayName: 'PRO Number', width: 300 },
                { field: 'ShipmentType', displayName: 'Shipment Type', width: 300 },
                { field: 'OrderStatusDisplay', displayName: 'Order Status', width: 305 }
            ];
            return colDefinition;
        };

        SearchResult.prototype.setEdi210GridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;

            //## PRO Cell Template.
            var proCellTemplate = '<a data-bind="attr:{ \'class\': $parent.entity[\'ExceptionDescription\'] ? \'cursor-pointer\' : \'non-clickable-anchor\'}, text: $parent.entity[\'ProNumber\'], click: function() { $userViewModel.onGridColumnClick($parent.entity) }" />';
            var statusDisplayTemplate = '<div data-bind="attr: { \'class\': \'kgCellText colt\' + $index(), title: $data.getProperty($parent)}, html: $data.getProperty($parent), text: $parent.entity[\'ExceptionDescription\'] ? $parent.entity[\'ExceptionDescription\'] : \'EDI Database\'" class="kgCellText colt1"></div>';

            colDefinition = [
                { field: 'ProNumber', displayName: 'PRO Number', cellTemplate: proCellTemplate, width: 350 },
                { field: 'ExceptionDescription', displayName: 'Exception Description', cellTemplate: statusDisplayTemplate, width: 300 },
                { field: 'ExceptionRuleId', displayName: 'Exception Description', width: 10, visible: false },
                { field: 'EDIDetailID', displayName: 'EDIDetailID', width: 10, visible: false },
                { field: 'BatchId', displayName: 'BatchId', width: 10, visible: false }
            ];
            return colDefinition;
        };

        //#region Load Data
        SearchResult.prototype.load = function (searchData) {
            var _this = this;
            var self = this;

            var successCallBack = function (data) {
                if (searchData.category == "Vendor Bill") {
                    self.isVendorBillVisible(true);
                    self.isSalesVisible(false);
                    self.isEdi210Visible(false);
                } else if (searchData.category == "Sales Order") {
                    self.isSalesVisible(true);
                    self.isVendorBillVisible(false);
                    self.isEdi210Visible(false);
                } else if (searchData.category == "EDI") {
                    // ###START: DE23350
                    self.isEdi210Visible(data.IsRexnord);

                    // ###END: DE23350
                    self.isSalesVisible(false);
                    self.isVendorBillVisible(false);
                } else if (searchData.category == "MoreResult") {
                    self.isVendorBillVisible(true);
                    self.isSalesVisible(true);
                    self.isEdi210Visible(true);
                }
                _this.initializeSearchDetails(data);
            }, faliureCallBack = function () {
            };

            self.searchBolValueContainer.listProgress(true);
            self.searchProValueContainer.listProgress(true);
            self.searchEdiValueContainer.listProgress(true);
            self.commonClient.searchHeaderTransaction(searchData.query, successCallBack, faliureCallBack);
        };

        //#endregion
        //#endregion
        //#region Life Cycle Event
        //## Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        SearchResult.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //## The composition engine will execute it prior to calling the binder.
        SearchResult.prototype.activate = function () {
            return true;
        };

        //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
        SearchResult.prototype.beforeBind = function () {
            var self = this;
            _app.trigger("loadMyData", function (data) {
                if (data) {
                    self.load(data);
                } else {
                    _app.trigger("closeActiveTab");
                    _app.trigger("NavigateTo", 'Home');
                }
            });
        };
        return SearchResult;
    })();

    return SearchResult;
});
