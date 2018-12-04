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
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../Scripts/Utility.ts" />
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', '../templates/reportViewerControlV2', 'services/models/common/Enums'], function(require, exports, ___router__, ___app__, __refSystem__, ___reportViewer__, __refEnums__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    var _reportViewer = ___reportViewer__;
    var refEnums = __refEnums__;

    //#endregion
    /*
    ** <summary>
    ** Sales Order Invoice Exception View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US13157</id> <by>Sankesh</by> <date>10 Oct, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var SalesOrderInvoiceException = (function () {
        //#endregion
        //#region Constructor
        function SalesOrderInvoiceException() {
            //#region Members
            this.reportContainer = null;
            this.header = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            var self = this;
            var CommonUtils = new Utils.Common();

            //## Header Section.
            self.header = new _reportViewer.ReportHeaderOption();
            self.header.reportHeader = "Invoice Exception Board";
            self.header.preparedOn = " ";
            self.header.createdBy = " ";
            self.header.reportName = "Sales Order Invoice Exception";
            self.header.gridTitleHeader = " ";
            self.searchText = ko.observable("");

            //## initialize date filters
            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);

            self.setReportCriteria = function (reportActionObj) {
                self.gridOptions = reportActionObj.gridOptions;
                if (self.reportAction != null) {
                    if ((self.modeType() != reportActionObj.filter1selectedItemId) || (self.reportAction.view != reportActionObj.view) || (reportActionObj.dateFrom != self.reportAction.dateFrom) || (reportActionObj.dateTo != self.reportAction.dateTo)) {
                    }
                }

                // Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
                // we don't want any data on page load so we commented getReportdata  function.
                // self.getReportData();
                self.reportAction = reportActionObj;
                self.getReportData(reportActionObj);
            };

            self.getReportData = function (reportActionObj) {
                var deferred = $.Deferred();
                var promise = deferred.promise();
                var pageno = 0;
                pageno = Number(self.gridOptions.pagingOptions.currentPage());
                if (pageno > 0) {
                    // List View
                    self.reportContainer.listProgress(true);
                    self.setPagingData(null, 5, self.gridOptions.pagingOptions.pageSize());
                    self.reportContainer.listProgress(false);
                }

                return promise;
            };

            //## Showing Force Push Button
            self.header.actionButtons1 = {
                buttonName: ko.observable("Force Invoice"),
                enableOnSingleSelection: true,
                enableOnMultiSelection: true,
                hideWhenUnselected: true,
                resetselectionOnAction: true,
                isslideButton: true
            };

            self.reportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);

            self.reportContainer.showOptionalHeaderRow(true);

            //  self.reportContainer.onFilterChange = self.setReportCriteria;
            self.reportContainer.ForceChange();

            //for search filter
            self.reportContainer.onSearchTextChange = function (reportViewer, newSearchValue) {
                if (newSearchValue.length >= 3 || newSearchValue.length == 0) {
                    self.searchText(newSearchValue);

                    //self.getReportData(self.reportAction);
                    self.gridOptions.pagingOptions.currentPage(1);
                }
            };

            //## Displays Date without Time Part
            self.reportContainer.getDateFormat = function (shipmentobj) {
                var self = this;
                return CommonUtils.formatDate(new Date(shipmentobj.BillDate), 'mm/dd/yyyy');
            };

            //## Display text based on Bill status in VB status column.
            self.reportContainer.getTextfromId = function (shipmentobj) {
                var self = this;
                var status = CommonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, shipmentobj.BillStatus.toString());
                return status;
            };

            //## Display text based on MasClearanceStatusID in MAS Clearance Status column.
            self.reportContainer.getMasClearanceStatus = function (obj) {
                var self = this;
                return CommonUtils.getEnumValueById(refEnums.Enums.MasClearanceStatus, obj.MasClearanceStatusId.toString());
            };

            //## Display text based on ShippmentId in Mode column.
            self.reportContainer.getModeType = function (obj) {
                var self = this;
                return CommonUtils.getEnumValueById(refEnums.Enums.CarrierType, obj.ShipmentTypeId.toString());
            };

            return self;
        }
        //#endregion
        //#region Internal Methods
        SalesOrderInvoiceException.prototype.load = function (bindedData) {
            if (!bindedData)
                return;

            var self = this;
            if (refSystem.isObject(self.gridOptions)) {
                self.gridOptions.pagingOptions.pageSize(bindedData.pageSize);
                self.gridOptions.pagingOptions.currentPage(bindedData.currentPage);
                self.getReportData(self.reportAction);
            }
        };
        SalesOrderInvoiceException.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.UIGridID = ko.observable("SalesOrderInvoiceExceptionGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.enableSelectiveDisplay = true;
            grOption.useExternalSorting = false;
            grOption.showGridSearchFilter = true;
            grOption.sortedColumn = {
                columnName: "CreatedDate",
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
            grOption.multiSelect = true;
            grOption.enablePaging = false;
            grOption.viewPortOptions = false;
            grOption.enableSaveGridSettings = false;
            grOption.useClientSideFilterAndSort = true;
            grOption.showColumnMenu = true;
            return grOption;
        };

        //## Set Grid Columns.
        SalesOrderInvoiceException.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;

            //## PRO Cell Template.
            //  var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'PRONumber\'], click: function() { $userViewModel.onGridColumnClick($parent.entity) }" />';
            colDefinition = [
                { field: 'BOLNumber', displayName: 'BOL#', width: 90 },
                { field: 'PRONumber', displayName: 'PRO#', width: 110 },
                { field: 'CarrierName', displayName: 'Carrier', width: 130 },
                { field: 'CustomerName', displayName: 'Customer', width: 150 },
                { field: 'SalesAgent', displayName: 'Sales Agent', width: 100 },
                { field: 'BookedDate', displayName: 'Booked Date', width: 150 },
                { field: 'PickupDate', displayName: 'Pickup Date', width: 150 },
                { field: 'FinalizeDate', displayName: 'Finalize Date', width: 150 },
                { field: 'AdjustmentDate', displayName: 'Adjustment Date', width: 150 },
                { field: 'CRRReviewDate', displayName: 'CRR Review Date', width: 150 },
                { field: 'CarrierType', displayName: 'Mode', width: 180 },
                { field: 'Cost', displayName: 'Cost', width: 180 },
                { field: 'Revenue', displayName: 'Revenue', width: 180 },
                { field: 'VBAmount', displayName: 'VB Amount', width: 180 },
                { field: 'SOStatus', displayName: 'SO Status', width: 180 },
                { field: 'InvoiceStatus', displayName: 'Invoice Status', width: 180 },
                { field: 'VBStatus', displayName: 'VB Status', width: 180 },
                { field: 'Exception Reason', displayName: 'Exception Reason', width: 180 },
                { field: 'ScheduledAge', displayName: 'Scheduled Age', width: 180 }
            ];
            return colDefinition;
        };

        //## Initialize VendorBill Exceptions Grid.
        SalesOrderInvoiceException.prototype.initializeVendorBillExceptions = function (data) {
            var self = this;
            if (data) {
                self.reportContainer.OptionalHeaderRowLocation('TOP');
                self.setPagingData(data, self.gridOptions, self.reportAction);
                $("#kgSpanFooterSelectedItems").text('0');
                self.reportContainer.listProgress(false);
                $('.noLeftBorder').parent().css('border-left', '0px');
                $('.noRightBorder').parent().css('border-right', '0px');
            } else {
                self.reportContainer.listProgress(false);
            }
        };

        //## Set Data into grid container.
        SalesOrderInvoiceException.prototype.setPagingData = function (data, page, pageSize) {
            var self = this;
            self.gridOptions.data(data);
            self.gridOptions.data.valueHasMutated();
            self.gridOptions.pagingOptions.totalServerItems(page);
        };

        //#endregion
        //#region Life Cycle Event
        //## Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        SalesOrderInvoiceException.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //## The composition engine will execute it prior to calling the binder.
        SalesOrderInvoiceException.prototype.activate = function () {
            return true;
        };

        SalesOrderInvoiceException.prototype.beforeBind = function () {
            var self = this;

            _app.trigger("loadMyData", function (data) {
                if (data) {
                    self.load(data);
                } else {
                    //_app.trigger("closeActiveTab");
                    //_app.trigger("NavigateTo", 'Home');
                }
            });
        };
        return SalesOrderInvoiceException;
    })();

    return SalesOrderInvoiceException;
});
