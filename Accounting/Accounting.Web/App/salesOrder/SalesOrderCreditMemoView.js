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
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/models/common/Enums', '../templates/reportViewerControlV2'], function(require, exports, ___router__, ___app__, __refEnums__, ___reportViewer__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refEnums = __refEnums__;
    
    var _reportViewer = ___reportViewer__;
    

    //#endregion
    /*
    ** <summary>
    ** Sales Order credit memo view model
    ** </summary>
    ** <createDetails>
    ** <id>US20288</id> <by>Shreesha Adiga</by> <date>12-01-2016</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US20287</id><by>SHREESHA ADIGA</by><date>13-01-2016</date><description>Added report container and its properties and functions</description>
    ** </changeHistory>
    */
    var SalesOrderCreditMemoViewModel = (function () {
        //#endregion
        //#region Constructor
        function SalesOrderCreditMemoViewModel() {
            var _this = this;
            //#region Memebers
            this.adjustmentTypesArray = ko.observableArray([]);
            this.selectedAdjustmentType = ko.observable("Select");
            this.reasonCodeArray = ko.observableArray([]);
            this.selectedReasonCode = ko.observable("Reason Code");
            this.inputCreditAmount = ko.observable($.number(0, 2));
            this.repAbsorbAmount = ko.observable($.number(0, 2));
            this.gtzAbsorbAmount = ko.observable($.number(0, 2));
            this.salesOrderRevenue = ko.observable($.number(0, 2));
            this.totalRevenue = ko.observable($.number(0, 2));
            this.totalCost = ko.observable($.number(0, 2));
            this.totalProfit = ko.observable($.number(0, 2));
            this.pendingCreditMemo = ko.observable($.number(0, 2));
            this.invoiceBalance = ko.observable($.number(0, 2));
            this.disputedDate = ko.observable('');
            this.adjustedDate = ko.observable('');
            this.agreeToTermsCondition = ko.observable(false);
            this.listProgress = ko.observable(false);
            //##START: US20287
            //grid properties
            this.reportContainer = null;
            this.header = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            var self = this;

            self.selectedAdjustmentType.subscribe(function (newValue) {
                if (newValue === "Vendor Credit(Debit Memo)") {
                }
            });

            self.inputCreditAmount.subscribe(function (newValue) {
            });

            //##START: US20287
            self.header = new _reportViewer.ReportHeaderOption();
            self.header.reportHeader = "";
            self.header.reportName = "Sales Order Notes";
            self.header.gridTitleHeader = "";

            //initialize date filters
            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);

            self.setReportCriteria = function (reportActionObj) {
                self.gridOptions = reportActionObj.gridOptions;

                //if (self.reportAction != null) {
                //	if ((self.modeType() != reportActionObj.filter1selectedItemId) || (self.reportAction.view != reportActionObj.view) ||
                //		(reportActionObj.dateFrom != self.reportAction.dateFrom) || (reportActionObj.dateTo != self.reportAction.dateTo)) {
                //		self.gridOptions.pagingOptions.currentPage(1);
                //	}
                //}
                // Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
                // we don't want any data on page load so we commented getReportdata  function.
                // self.getReportData();
                _this.reportAction = reportActionObj;

                if (reportActionObj.dateFrom !== null && reportActionObj.dateTo !== null) {
                    // self.getReportData();
                } else {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectDateTimeFrame, "info", null, toastrOptions);
                }
            };

            //Displays Date without Time Part
            self.reportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);
            self.reportContainer.showOptionalHeaderRow(false);
            self.reportContainer.OptionalHeaderRowLocation('TOP');
            self.reportContainer.onFilterChange = self.setReportCriteria;
            self.reportContainer.ForceChange();

            //##END: US20287
            return self;
        }
        //#region Internal public Methods
        SalesOrderCreditMemoViewModel.prototype.initializeCreditMemoDetails = function () {
            var self = this;
            self.listProgress(true);
            self.populateDropdowns();

            ////if (data) {
            ////	for (var count = 0; count < data.length; count++) {
            ////		if (data[count].ID === vendorBillId) {
            ////			data[count].IsSameProNumber = true;
            ////		}
            ////		if (data[count].SalesOrderID === vendorBillId) {
            ////			data[count].IsSameBolNumber = true;
            ////		}
            ////	}
            ////	if (self.shipmentLinksList)
            ////		self.shipmentLinksList.removeAll();
            ////	data.forEach((item) => {
            ////		var linkItem = new ShipmentRelatedLinkItemViewModel(self.showDetails);
            ////		linkItem.initializeLinkDetails(item, self.bolNumber());
            ////		self.shipmentLinksList.push(linkItem);
            ////	});
            ////}
            self.listProgress(false);
        };

        //#region private methods
        SalesOrderCreditMemoViewModel.prototype.populateDropdowns = function () {
            var self = this;

            self.adjustmentTypesArray.removeAll();
            self.reasonCodeArray.removeAll();

            self.adjustmentTypesArray.push.apply(self.adjustmentTypesArray, ["Select", "Rep Absorb", "GTZ Absorb", "Split Absorb", "Vendor Credit(Debit Memo)", "Margin Reduction"]);

            self.reasonCodeArray.push.apply(self.reasonCodeArray, [
                "Reason Code",
                "Tariff or rating error",
                "Software error",
                "Accounting error",
                "Sales rep error",
                "Customer satisfaction",
                "Other"
            ]);
        };

        //##START: US20287
        SalesOrderCreditMemoViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = false;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("salesOrderShipmentNotesGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
                columnName: "noteDate",
                order: "DESC"
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
            grOption.enableSaveGridSettings = false;
            grOption.useClientSideFilterAndSort = true;
            grOption.showColumnMenu = false;
            return grOption;
        };

        SalesOrderCreditMemoViewModel.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            colDefinition = [
                { field: 'description', displayName: 'Pro#', sortable: false },
                { field: 'noteBy', displayName: 'BOL Number', sortable: false },
                { field: 'noteType', displayName: 'Bill Amount', sortable: false },
                { field: 'noteDate', displayName: 'Total Pending Debit Memo', sortable: false },
                { field: 'noteDate', displayName: 'Amount', sortable: false }
            ];
            return colDefinition;
        };

        //##END: US20287
        //#endregion
        //#region Life Cycle Event
        SalesOrderCreditMemoViewModel.prototype.compositionComplete = function (view, parent) {
            var self = this;
        };

        SalesOrderCreditMemoViewModel.prototype.activate = function () {
            return true;
        };

        SalesOrderCreditMemoViewModel.prototype.deactivate = function () {
            var self = this;
            return true;
        };

        //** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
        SalesOrderCreditMemoViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };
        return SalesOrderCreditMemoViewModel;
    })();
    exports.SalesOrderCreditMemoViewModel = SalesOrderCreditMemoViewModel;
});
