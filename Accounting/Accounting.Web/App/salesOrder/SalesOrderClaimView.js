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
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', '../templates/reportViewerControlV2', 'services/models/common/Enums'], function(require, exports, ___router__, ___app__, ___reportViewer__, __refEnums__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    var _reportViewer = ___reportViewer__;
    var refEnums = __refEnums__;

    //#endregion
    /*
    ** <summary>
    ** Sales Order Claim View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US12644</id> <by>Sankesh Poojari</by> <date>09-24-2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var SalesOrderClaimViewModel = (function () {
        // Initializes the properties of this class
        function SalesOrderClaimViewModel() {
            var _this = this;
            this.salesOrderNoteItems = ko.observableArray([]);
            this.claimstatus = ko.observableArray([]);
            this.selectedclaimstatus = ko.observable("");
            this.claimdocument = ko.observableArray([]);
            this.receivedDate = ko.observable('');
            this.filedDate = ko.observable('');
            this.billofLading = ko.observable();
            this.carrierClaim = ko.observable();
            this.serviceTypeList = ko.observableArray([]);
            this.proNumber = ko.observable();
            this.carrier = ko.observable();
            this.shipper = ko.observable();
            this.consignee = ko.observable();
            this.customer = ko.observable();
            this.amountFiled = ko.observable();
            this.settledAmount = ko.observable();
            this.CommonUtils = new Utils.Common();
            //Grid Propties
            this.reportContainer = null;
            this.header = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            var self = this;
            self.header = new _reportViewer.ReportHeaderOption();
            self.header.reportHeader = "";
            self.header.reportName = "Sales Order Claim Notes";
            self.header.gridTitleHeader = "";

            //initialize date filters
            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);

            self.setReportCriteria = function (reportActionObj) {
                self.gridOptions = reportActionObj.gridOptions;
                if (self.reportAction != null) {
                    if ((self.modeType() != reportActionObj.filter1selectedItemId) || (self.reportAction.view != reportActionObj.view) || (reportActionObj.dateFrom != self.reportAction.dateFrom) || (reportActionObj.dateTo != self.reportAction.dateTo)) {
                        self.gridOptions.pagingOptions.currentPage(1);
                    }
                }

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
            self.filedDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
            self.receivedDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));

            //To set The date picker options
            self.datepickerOptions = {
                blockWeekend: true,
                blockPreviousDays: false,
                blockHolidaysDays: true,
                autoClose: true,
                placeBelowButton: false
            };
        }
        //#region Internal private methods
        SalesOrderClaimViewModel.prototype.setPagingData = function (data, grid, gridOption) {
            Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
        };

        SalesOrderClaimViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = false;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("salesOrderClaimGrid");
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

        SalesOrderClaimViewModel.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            colDefinition = [
                { field: 'EntityId', displayName: 'EntityId', sortable: false, visible: false },
                { field: 'Id', displayName: 'Id', sortable: false, visible: false },
                { field: 'Description', displayName: 'Description', sortable: false },
                { field: 'NotesBy', displayName: 'Notes By', sortable: false },
                { field: 'NotesDateShort', displayName: 'Notes Date', sortable: false }
            ];
            return colDefinition;
        };

        //#endregion
        //#region Internal public Methods
        SalesOrderClaimViewModel.prototype.initializeClaimDetails = function (data) {
            var self = this;
            if (data && data.SalesOrderClaimDetail !== null) {
                self.billofLading(data.SalesOrderClaimDetail.BOLNumber);
                self.carrierClaim(data.SalesOrderClaimDetail.ClaimNumber);
                self.proNumber(data.SalesOrderClaimDetail.PRONumber);
                self.carrier(data.SalesOrderClaimDetail.CarrierName);
                self.customer(data.SalesOrderClaimDetail.CompanyName);
                self.shipper(data.SalesOrderClaimDetail.ShipperName);
                self.consignee(data.SalesOrderClaimDetail.ConsigneeName);
                self.receivedDate(data.SalesOrderClaimDetail.ClaimDate);
                self.receivedDate(data.SalesOrderClaimDetail.ClaimDate ? self.CommonUtils.formatDate(data.SalesOrderClaimDetail.ClaimDate.toString(), 'mm/dd/yyyy') : '');
                self.filedDate(data.SalesOrderClaimDetail.DateFiled ? self.CommonUtils.formatDate(data.SalesOrderClaimDetail.DateFiled.toString(), 'mm/dd/yyyy') : '');
                self.amountFiled($.number((data.SalesOrderClaimDetail.AmountFiled), 2));
                self.settledAmount($.number((data.SalesOrderClaimDetail.SettledAmount), 2));
                self.claimstatus.push(data.SalesOrderClaimDetail.Status);
            }
            if (data) {
                self.setPagingData(ko.observableArray(data.SalesOrderClaimNoteDetails), self.gridOptions, self.reportAction);
            }
        };

        // this function is used to convert formatted cost with decimal(Two Place).
        SalesOrderClaimViewModel.prototype.formatDecimalNumber = function (field) {
            var self = this;
            var costValue = field();
            if (costValue) {
                var stringParts = costValue + '';

                var isNegative = stringParts.indexOf("-") !== -1;

                var parts = stringParts.split('.');

                if (parts && parts.length > 2) {
                    costValue = parts[0] + '.' + parts[1];
                }

                if (parts.length === 1 && costValue && costValue.length > 8) {
                    costValue = costValue.replace(/[^0-9]/g, '');
                    costValue = costValue.replace(/(\d{9})(\d{2})/, "$1.$2");
                    field(costValue);
                }
                if (parts.length === 1 || (parts && (parts.length === 0 || parts[1] || parts[1] === ''))) {
                    if (costValue && costValue.length >= 1 && costValue.length <= 8) {
                        if (/\.\d$/.test(costValue)) {
                            costValue += "0";
                        } else if (/\.$/.test(costValue)) {
                            costValue += "00";
                        } else if (!/\.\d{2}$/.test(costValue)) {
                            costValue += ".00";
                        }
                    }
                }

                if (isNegative === true) {
                    costValue = '-' + (costValue + '').split("-")[1];
                }

                field(costValue);
            }
        };

        SalesOrderClaimViewModel.prototype.cleanup = function () {
            var self = this;

            self.reportContainer.cleanup("salesOrderClaimGrid");

            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }
            delete self;
        };
        return SalesOrderClaimViewModel;
    })();
    exports.SalesOrderClaimViewModel = SalesOrderClaimViewModel;
});
