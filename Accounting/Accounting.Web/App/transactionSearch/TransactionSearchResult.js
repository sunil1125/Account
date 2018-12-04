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
define(["require", "exports", 'plugins/router', 'durandal/app', '../templates/reportViewerControlV2', 'services/client/CommonClient'], function(require, exports, ___router__, ___app__, ___reportViewer__, __refCommonClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
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
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var TransactionSearchResult = (function () {
        //#endregion
        //#region Constructor
        function TransactionSearchResult() {
            var _this = this;
            //#region Members
            this.searchProValueContainer = null;
            this.searchBolValueContainer = null;
            this.proHeader = null;
            this.bolHeader = null;
            this.proGrid = null;
            this.bolGrid = null;
            this.proReportAction = null;
            this.bolReportAction = null;
            this.proData = null;
            this.bolData = null;
            this.modeType = ko.observable();
            this.commonUtils = new Utils.Common();
            this.vendorBillId = ko.observable();
            this.salesorderid = ko.observable('');
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

            //initialize date filters
            self.proReportAction = new _reportViewer.ReportAction();
            self.bolReportAction = new _reportViewer.ReportAction();
            self.proGrid = self.setProGridOptions(self);
            self.bolGrid = self.setBolGridOptions(self);

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
                _app.trigger("openVendorBill", vendorBillId, shipmentObj.PRONumber, function (callback) {
                    if (!callback) {
                        return;
                    }
                });
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

            return self;
        }
        //#endregion
        //#region Public Methods
        TransactionSearchResult.prototype.initializeHistoryDetails = function (data) {
            var self = this;
            if (data) {
                self.originalData = data;

                self.setPagingData(ko.observableArray(data.VendorBillSearchResults), self.proGridOptions, self.proReportAction);
                self.setPagingData(ko.observableArray(data.SalesOrderSearchResults), self.bolGridOptions, self.bolReportAction);
                self.searchBolValueContainer.listProgress(false);
                self.searchProValueContainer.listProgress(false);

                $('.noLeftBorder').parent().css('border-left', '0');
                $('.noRightBorder').parent().css('border-right', '0');
            } else {
                self.searchBolValueContainer.listProgress(false);
                self.searchProValueContainer.listProgress(false);
            }
        };

        //#endregion
        //#region Private Methods
        TransactionSearchResult.prototype.setPagingData = function (data, grid, gridOption) {
            Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
        };

        TransactionSearchResult.prototype.setProGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = false;
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

        TransactionSearchResult.prototype.setBolGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = false;
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
        TransactionSearchResult.prototype.setProGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;

            //## PRO Cell Template.
            var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'PRONumber\'], click: function() { $userViewModel.onGridColumnClick($parent.entity) }" />';

            colDefinition = [
                { field: 'PRONumber', displayName: 'PRONumber', cellTemplate: proCellTemplate },
                { field: 'BOLNumber', displayName: 'BOL Number' },
                { field: 'BillDateDisplay', displayName: 'BillDate' }
            ];
            return colDefinition;
        };

        TransactionSearchResult.prototype.setBolGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;

            //## PRO Cell Template.
            var bolCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'BOLNumber\'], click: function() { $userViewModel.onGridColumnClick($parent.entity) }" />';

            colDefinition = [
                { field: 'BOLNumber', displayName: 'BOL Number', cellTemplate: bolCellTemplate },
                { field: 'PRONumber', displayName: 'PRO Number' },
                { field: 'ShipmentType', displayName: 'Shipment Type' }
            ];
            return colDefinition;
        };

        //#region Load Data
        TransactionSearchResult.prototype.load = function (searchData) {
            var _this = this;
            var self = this;

            var successCallBack = function (data) {
                // To load payment Details
                _this.initializeHistoryDetails(data);
            }, faliureCallBack = function () {
            };

            self.searchBolValueContainer.listProgress(true);
            self.searchProValueContainer.listProgress(true);
            self.commonClient.searchTransaction(searchData, successCallBack, faliureCallBack);
        };

        //#endregion
        //#endregion
        //#region Life Cycle Event
        //## Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        TransactionSearchResult.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //## The composition engine will execute it prior to calling the binder.
        TransactionSearchResult.prototype.activate = function () {
            return true;
        };

        //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
        TransactionSearchResult.prototype.beforeBind = function () {
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
        return TransactionSearchResult;
    })();

    return TransactionSearchResult;
});
