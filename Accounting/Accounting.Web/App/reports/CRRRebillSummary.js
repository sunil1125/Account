/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region REFERENCES
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../services/models/TypeDefs/Report.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'services/client/ReportClient', '../templates/reportViewerControlV2', 'services/models/report/BoardReportRequest', 'services/models/common/Enums', 'services/validations/Validations', 'services/client/VendorBillClient'], function(require, exports, ___router__, ___app__, __refSystem__, __refReportClient__, ___reportViewer__, __refBoardReportRequestModel__, __refEnums__, __refValidations__, __refVendorBillClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    var refReportClient = __refReportClient__;
    var _reportViewer = ___reportViewer__;
    var refBoardReportRequestModel = __refBoardReportRequestModel__;
    var refEnums = __refEnums__;
    var refValidations = __refValidations__;
    var refVendorBillClient = __refVendorBillClient__;

    //#endregion
    /*
    ** <summary>
    ** Report CRR Rebill Summary report View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US8214</id> <by>Baldev Singh Thakur</by> <date>12-17-2014</date>}
    ** </createDetails>}
    ** <changeHistory>}
    ** <id>DE20289</id> <by>Shreesha Adiga</by> <date>09-10-2015</date><description>Added validations to Date fields</description>
    ** <id>DE20737</id> <by>Vasanthakumar</by> <date>26-11-2015</date><description>Enabled the grid setting saving option</description>
    ** <id>US20647</id> <by>Chandan Singh Bajetha</by> <date>17-02-2016</date><description>Acct: Implement Search on all Reports</description>
    ** <id>DE22109</id> <by>Janakiram</by> <date>06-15-2016</date> <description>Added date range for CRR Re-Bill Report</description>
    ** <id>US23370</id> <by>Dhaval Tamhane</by> <date>28-07-2016</date><description>Updates related to elastic search.</description>
    ** </changeHistory>
    */
    var CRRRebillReportViewModel = (function () {
        // ###END: US23370
        //#endregion
        //#region constructor
        function CRRRebillReportViewModel() {
            //#region Members
            this.reportClient = null;
            this.listProgress = ko.observable(false);
            this.boardReportRequest = null;
            // From date filter
            this.fromDate = ko.observable('');
            // To Date Filter
            this.toDate = ko.observable('');
            // Common Utilities
            this.CommonUtils = new Utils.Common();
            // Flag to check whether user clicked on button or not??
            this.isLoaded = ko.observable(false);
            this.rebillRepList = ko.observableArray([]);
            this.selectedReviewedBy = ko.observable();
            this.rebillRepName = ko.observable('');
            //#endregion
            //#region public report viewer members
            this.reportContainer = null;
            this.headerOptions = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            // ###START: US23370
            this.sortCol = ko.observable('');
            this.sorttype = ko.observable('');
            var self = this;

            self.searchText = ko.observable("");

            //Set Datepicker Options
            self.datepickerOptions = {
                blockWeekend: true,
                blockHolidaysDays: true,
                blockPreviousDays: false,
                autoClose: true,
                placeBelowButton: false,
                endDate: new Date()
            };

            //#region Date validation
            //From PickUp Date should not be grater then Today Date and required
            self.fromDate = ko.observable().extend({
                required: {
                    message: ApplicationMessages.Messages.ValidFromDateRequired
                },
                validation: {
                    validator: function () {
                        if (!refValidations.Validations.isValidDate(self.fromDate(), self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "BillDate"))
                            return false;

                        if (self.fromDate() !== "" || self.fromDate() !== undefined) {
                            if ((new Date(self.fromDate())) > new Date(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy')))
                                return false;
else
                                return true;
                        } else {
                            return true;
                        }
                    },
                    message: ApplicationMessages.Messages.NotAValidDate
                }
            });

            //To Date Should not be grater then today date and not be less then from date and required
            self.toDate = ko.observable().extend({
                required: {
                    message: ApplicationMessages.Messages.ValidToDateRequired
                },
                validation: {
                    validator: function () {
                        if (!refValidations.Validations.isValidDate(self.toDate(), self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "BillDate"))
                            return false;

                        if (new Date(self.toDate()) > (new Date(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy')))) {
                            return false;
                        } else if (self.toDate() !== undefined && self.fromDate() !== "") {
                            if (new Date(self.fromDate()) > new Date(self.toDate()))
                                return false;
else
                                return true;
                        } else {
                            return true;
                        }
                    },
                    message: ApplicationMessages.Messages.NotAValidDate
                }
            });

            //To set the from date by default to previous 3 months from current date
            var fromdate = new Date();
            var x = 90;
            var newFromDate = fromdate.setDate(fromdate.getDate() - x);
            self.fromDate(self.CommonUtils.formatDate(newFromDate, 'mm/dd/yyyy'));
            self.toDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));

            //#region Error Details Object
            self.errorReport = ko.validatedObservable({
                fromDate: self.fromDate,
                toDate: self.toDate
            });

            //#endregion
            //#region Report Container
            self.headerOptions = new _reportViewer.ReportHeaderOption();
            self.headerOptions.gridTitleHeader = " ";

            // ###START: DE20737
            self.headerOptions.reportHeader = " ";

            // ###END: DE20737
            self.headerOptions.reportName = "CRR Rebill Summary Report";
            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);
            self.reportClient = new refReportClient.ReportClient();

            //#endregion
            //#region Export functionality
            var exportOptions = ko.observableArray([
                { exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
                { exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) }
            ]);

            self.headerOptions.reportExportOptions = new _reportViewer.ReportExportControl(exportOptions);
            self.headerOptions.reportExportOptions.getUrl = function (exp) {
                var searchClient = new refVendorBillClient.SearchModel();

                searchClient.FromDate = self.fromDate();
                searchClient.ToDate = self.toDate();

                // ###START: US23370
                searchClient.SearchValue = self.searchText().trim();
                searchClient.SortOrder = self.sorttype();
                searchClient.SortCol = self.sortCol();

                // ###END: US23370
                searchClient.PageNumber = 1;
                searchClient.PageSize = exp.exportType === 1 ? 2000 : self.gridOptions.pagingOptions.totalServerItems();
                searchClient.ExportType = exp.exportType;
                searchClient.RebillRepName = self.boardReportRequest.RebillRepName;

                var filterModel = { ExportURL: "Accounting/ExportCrrRebillReportInExcel", FilterModel: searchClient };
                return filterModel;
            };

            //#endregion
            self.setReportCriteria = function (reportActionObj) {
                if ((reportActionObj != undefined || reportActionObj != null) && (reportActionObj.gridOptions != undefined || reportActionObj.gridOptions != null) && (refSystem.isObject(reportActionObj.gridOptions.sortInfo())) && (reportActionObj.gridOptions.sortInfo().column != undefined || reportActionObj.gridOptions.sortInfo().column != null) && (reportActionObj.gridOptions.sortInfo().column.field != undefined || reportActionObj.gridOptions.sortInfo().column.field != null)) {
                    if (reportActionObj.gridOptions.sortInfo().column.field === 'ReviewDateDisplay') {
                        self.sortCol("ReviewDate");
                    }

                    self.sorttype(reportActionObj.gridOptions.sortInfo().direction);
                } else {
                    self.sortCol("PRONo");
                    self.sorttype("asc");
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

                    self.reportContainer.listProgress(false);
                    self.reportContainer.selectedFilter1Item(self.modeType());
                } else {
                    self.gridOptions = reportActionObj.gridOptions;

                    if (self.modeType() != reportActionObj.filter1selectedItemId) {
                        self.modeType(reportActionObj.filter1selectedItemId);
                        self.reportContainer.columnDefinition(self.setGridColumnDefinitions());
                    }

                    self.reportAction = reportActionObj;
                    if (self.reportContainer.reportColumnFilter.isFilterApply || self.reportContainer.isPaginationChanged || self.reportContainer.isSortingChanged) {
                        if (self.isLoaded()) {
                            self.getReportData(self.reportAction);
                            self.reportContainer.isPaginationChanged = false;
                            self.reportContainer.isSortingChanged = false;
                        }
                    }
                }
                // ###END: US23370
            };

            self.getReportData = function (reportActionObj) {
                var deferred = $.Deferred();
                var promise = deferred.promise();

                // ###START: DE22109
                var startDate = moment(self.fromDate(), 'M/D/YYYY');
                var endDate = moment(self.toDate(), 'M/D/YYYY');

                var daysCount = endDate.diff(startDate, 'days');

                if (daysCount <= 1095) {
                    var pageNo = 0;
                    pageNo = Number(self.gridOptions.pagingOptions.currentPage());
                    if (pageNo > 0) {
                        self.reportContainer.listProgress(true);
                        self.boardReportRequest = new refBoardReportRequestModel.Models.BoardReportRequest();
                        self.boardReportRequest.PageNumber = self.gridOptions.pagingOptions.currentPage();
                        self.boardReportRequest.PageSize = self.gridOptions.pagingOptions.pageSize();
                        self.boardReportRequest.FromDate = self.fromDate();
                        self.boardReportRequest.ToDate = self.toDate();

                        // ###START: US20647
                        self.boardReportRequest.GridSearchText = self.searchText().trim();

                        if (self.selectedReviewedBy() === undefined)
                            self.boardReportRequest.RebillRepName = "";
else {
                            self.boardReportRequest.RebillRepName = self.selectedReviewedBy().toString();
                            self.rebillRepName(self.selectedReviewedBy().toString());
                        }
                        self.reportClient.getCrrRebillRepList(self.boardReportRequest, function (data) {
                            if (self.selectedReviewedBy() === undefined) {
                                self.GetRebillRepList(data.RebillRep);
                            }
                            self.setPagingData(data.OrderRebillReport, data.TotalRowCount, self.gridOptions.pagingOptions.pageSize());
                            self.reportContainer.listProgress(false);
                            deferred.resolve(data, reportActionObj.view);
                            self.reportContainer.invokeHighlight(self.searchText());
                        }, function () {
                            self.reportContainer.listProgress(false);
                        });
                    }
                } else {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.FinalizedOrdersReportDateValidation, "error", null, toastrOptions);
                }

                // ###END: DE22109
                return promise;
            };

            //#region Assign grid settings
            self.reportContainer = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
            self.reportContainer.onFilterChange = self.setReportCriteria;
            self.reportContainer.ForceChange();

            //#endregion
            //#region Redirects to Vendor Bill Order Page
            self.reportContainer.onProNumberClick = function (obj) {
                var vendorBillId = obj.VendorBillId;
                _app.trigger("openVendorBill", vendorBillId, obj.PRONo, function (callback) {
                    if (!callback) {
                        return;
                    }
                });
            };

            //#endregion
            //#region Redirect to Sales Order Edit page
            self.reportContainer.onSalesOrderClick = function (obj) {
                var salesOrderId = obj.BOLNo;
                _app.trigger("openSalesOrder", salesOrderId, obj.BOLNo, function (callback) {
                    if (!callback) {
                        return;
                    }
                });
            };

            //#endregion
            //#region Search Fillter
            self.reportContainer.onSearchTextChange = function (reportViewer, newSearchValue) {
                if (newSearchValue.length >= 3 || newSearchValue.length == 0) {
                    // ###START: US20647
                    var data = new Array();
                    var searchString = newSearchValue;

                    //to blank the grid data
                    self.setPagingData(data, 0, self.gridOptions.pagingOptions.pageSize());
                    self.searchText(searchString.trim());

                    self.getReportData(self.reportAction);
                    self.gridOptions.pagingOptions.currentPage(1);
                    // ###END: US20647
                }
            };

            //#region Dropdown Selection Change event
            self.selectionChanged = function (event) {
                var self = this;
                if (self.validateReport()) {
                    self.isLoaded(true);
                    self.gridOptions.pagingOptions.currentPage(1);
                    self.getReportData(self.reportAction);
                } else {
                    return false;
                }
            };

            //#endregion
            //#endregion
            return self;
        }
        //#endregion
        //#region Generate button event
        CRRRebillReportViewModel.prototype.generateReport = function () {
            var self = this;
            if (self.validateReport()) {
                self.isLoaded(true);
                self.rebillRepList.removeAll();
                self.gridOptions.pagingOptions.currentPage(1);
                self.getReportData(self.reportAction);
            } else {
                return false;
            }
        };

        //#endregion
        //#region Private methods
        //#region if user enters numeric  date  without any format
        CRRRebillReportViewModel.prototype.convertToFromDate = function () {
            var self = this;
            if (!self.fromDate().match('/')) {
                self.fromDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.fromDate()));
            }
        };

        CRRRebillReportViewModel.prototype.convertToDate = function () {
            var self = this;
            if (!self.toDate().match('/') && self.toDate().length > 0) {
                self.toDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.toDate()));
            }
        };

        CRRRebillReportViewModel.prototype.GetRebillRepList = function (data) {
            var self = this;
            self.rebillRepList.removeAll();
            self.rebillRepList.push.apply(self.rebillRepList, data);
            self.bindSelectedRebillRep();
        };

        //#endregion
        CRRRebillReportViewModel.prototype.validateReport = function () {
            var self = this;
            if (self.errorReport.errors().length != 0) {
                self.errorReport.errors.showAllMessages();
                return false;
            } else {
                return true;
            }
        };

        CRRRebillReportViewModel.prototype.setPagingData = function (data, page, pageSize) {
            var self = this;
            self.gridOptions.data(data);
            self.gridOptions.data.valueHasMutated();
            self.gridOptions.pagingOptions.totalServerItems(page);
        };

        CRRRebillReportViewModel.prototype.setGridOptions = function (self) {
            var gridOption = new _reportViewer.ReportGridOption();
            gridOption.enableSelectiveDisplay = true;
            gridOption.showGridSearchFilter = true;
            gridOption.showPageSize = true;
            gridOption.UIGridID = ko.observable("CRRRebillSummaryReportGrid");
            gridOption.data = self.reportData;
            gridOption.columnDefinition = self.setGridColumnDefinitions();
            gridOption.useExternalSorting = false;
            gridOption.sortedColumn = { columnName: "ReviewDateDisplay", order: "DESC" };
            gridOption.pageSizes = [10, 25, 50, 100];
            gridOption.pageSize = 10;
            gridOption.totalServerItems = 0;
            gridOption.currentPage = 1;
            gridOption.jqueryUIDraggable = true;
            gridOption.canSelectRows = true;
            gridOption.selectWithCheckboxOnly = false;
            gridOption.displaySelectionCheckbox = false;
            gridOption.multiSelect = false;
            gridOption.enablePaging = false;
            gridOption.viewPortOptions = false;

            // ###START: DE20737
            gridOption.enableSaveGridSettings = true;

            // ###END: DE20737
            gridOption.useClientSideFilterAndSort = true;
            gridOption.showColumnMenu = true;
            return gridOption;
        };

        CRRRebillReportViewModel.prototype.setGridColumnDefinitions = function () {
            var columnDefintion = [];
            var self = this;

            var soCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'BOLNo\'], click: function() { $userViewModel.onSalesOrderClick($parent.entity)}" />';
            var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'PRONo\'], click: function() { $userViewModel.onProNumberClick($parent.entity) }" />';

            columnDefintion = [
                { field: 'PRONo', displayName: 'PRO #', width: 100, cellTemplate: proCellTemplate },
                { field: 'BOLNo', displayName: 'BOL #', width: 100, cellTemplate: soCellTemplate },
                { field: 'ReviewedBy', displayName: 'Rebill Rep', width: 160 },
                { field: 'FullName', displayName: 'Group of Sales Rep', width: 180 },
                { field: 'Name', displayName: 'Sales Rep Number', width: 200 },
                { field: 'CompanyName', displayName: 'Customer', width: 120 },
                { field: 'ReviewDateDisplay', displayName: 'Bill To Rep Date', width: 120 },
                { field: 'TotalCostAdjustment', displayName: 'Cost To Rep', width: 120, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
                { field: 'TotalRevenueAdjustment', displayName: 'Cost Difference', width: 140, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate }
            ];
            return columnDefintion;
        };

        CRRRebillReportViewModel.prototype.load = function (bindedData) {
            if (!bindedData)
                return;
            var self = this;
            self.fromDate(bindedData.fromDate);
            self.toDate(bindedData.toDate);
            self.isLoaded(bindedData.isLoaded);
            self.selectedReviewedBy(bindedData.selectedReviewedBy);

            if (refSystem.isObject(self.gridOptions)) {
                self.gridOptions.pagingOptions.pageSize(bindedData.pageSize);
                self.gridOptions.pagingOptions.currentPage(bindedData.currentPage);
                self.getReportData(self.reportAction);
            }
        };

        CRRRebillReportViewModel.prototype.getOrderRebill = function () {
            var self = this;
        };

        CRRRebillReportViewModel.prototype.bindSelectedRebillRep = function () {
            var self = this;
            var selectedItem = self.selectedReviewedBy();
            self.selectedReviewedBy(selectedItem);
        };

        //#endregion
        //#region LIFE CYCLE EVENT
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        CRRRebillReportViewModel.prototype.attached = function () {
            var self = this;
            _app.trigger('viewAttached');
            document.onkeypress = function (event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode === 13) {
                    $('#btngenerateReport').focus();
                    self.generateReport();
                    return false;
                }
            };
        };

        //The composition engine will execute it prior to calling the binder.
        CRRRebillReportViewModel.prototype.activate = function () {
            return true;
        };

        CRRRebillReportViewModel.prototype.deactivate = function () {
            var self = this;
            var data = {
                fromDate: self.fromDate(),
                toDate: self.toDate(),
                isLoaded: self.isLoaded(),
                pageSize: self.gridOptions.pagingOptions.pageSize(),
                currentPage: self.gridOptions.pagingOptions.currentPage(),
                selectedReviewedBy: self.selectedReviewedBy()
            };
            _app.trigger("registerMyData", data);

            self.cleanup();
        };

        //Composition Complete Event
        CRRRebillReportViewModel.prototype.compositionComplete = function () {
            var self = this;
            self.isLoaded(true);
            self.getReportData(self.reportAction);
        };

        //To load the registered data if any existed.
        CRRRebillReportViewModel.prototype.beforeBind = function () {
            var self = this;

            _app.trigger("loadMyData", function (data) {
                if (data) {
                    self.load(data);
                } else {
                    self.getOrderRebill();
                }
            });
        };

        CRRRebillReportViewModel.prototype.cleanup = function () {
            var self = this;

            self.reportContainer.cleanup("CRRRebillSummaryReportGrid");

            for (var prop in self) {
                if (prop !== "cleanup")
                    delete self[prop];
            }
            delete self;
        };
        return CRRRebillReportViewModel;
    })();

    return CRRRebillReportViewModel;
});
