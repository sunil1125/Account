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
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'services/client/ReportClient', '../templates/reportViewerControlV2', 'services/models/report/BoardReportRequest', 'services/models/common/Enums', 'services/validations/Validations'], function(require, exports, ___router__, ___app__, __refSystem__, __refReportClient__, ___reportViewer__, __refBoardReportRequestModel__, __refEnums__, __refValidations__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    var refReportClient = __refReportClient__;
    var _reportViewer = ___reportViewer__;
    var refBoardReportRequestModel = __refBoardReportRequestModel__;
    var refEnums = __refEnums__;
    var refValidations = __refValidations__;

    //#endregion
    /*
    ** <summary>
    ** Report Finalized Order With No Vendor Bills View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US13250</id> <by>Chandan</by> <date>11-27-2014</date>}
    ** </createDetails>}
    ** <changeHistory>}
    ** <id>DE20737</id> <by>Vasanthakumar</by> <date>26-11-2015</date><description>Enabled the grid setting saving option</description>
    ** </changeHistory>
    */
    var RexnordInvoicingReportViewModel = (function () {
        //#endregion
        //#region CONSTRUCTOR
        function RexnordInvoicingReportViewModel() {
            //#region MEMBERS
            this.RexnordInvoicedReportContainer = null;
            this.header = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            this.commonUtils = new Utils.Common();
            this.boardReportRequest = null;
            this.reportClient = null;
            // holds item numbers.
            this.itemNumberList = ko.observableArray([]);
            this.fromDate = ko.observable('');
            this.toDate = ko.observable('');
            this.invoiceDate = ko.observable('');
            this.CommonUtils = new Utils.Common();
            this.isLoaded = ko.observable(false);
            var self = this;

            //** To set The date picker options. */
            self.datepickerOptions = {
                blockWeekend: true,
                blockPreviousDays: false,
                blockHolidaysDays: true,
                autoClose: true,
                placeBelowButton: false,
                endDate: new Date()
            };

            //#region Date Validation
            //From PickUp Date should not be grater then Today Date and required
            self.fromDate = ko.observable().extend({
                //required: {
                //	message: ApplicationMessages.Messages.ValidFromDateRequired
                //},
                validation: {
                    validator: function () {
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
                //required: {
                //	message: ApplicationMessages.Messages.ValidToDateRequired
                //},
                validation: {
                    validator: function () {
                        if (new Date(self.toDate()) > (new Date(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy')))) {
                            return false;
                        } else if (self.toDate() !== undefined && self.fromDate() !== "") {
                            if (new Date(self.fromDate()) > new Date(self.toDate()))
                                return false;
else
                                return true;
                            //To Pickup date should not be grater then today date
                        } else if (new Date(self.toDate()) > (new Date(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy')))) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    message: ApplicationMessages.Messages.ToValidToDateNotLessThenFromDate
                }
            });

            //#region REPORT CONTAINER
            self.header = new _reportViewer.ReportHeaderOption();

            // ###START: DE20737
            self.header.reportHeader = " ";

            // ###END: DE20737
            self.header.reportName = "Rexnord Invoiced Report";
            self.header.preparedOn = " ";
            self.header.createdBy = " ";
            self.header.gridTitleHeader = " ";

            self.reportClient = new refReportClient.ReportClient();

            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);

            //##region Export Options.
            var exportOpt = ko.observableArray([
                { exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) }
            ]);

            self.header.reportExportOptions = new _reportViewer.ReportExportControl(exportOpt);
            self.header.reportExportOptions.getUrl = function (exp) {
                return "Accounting/ExportRexnordInvoicingReport?fromDate=" + self.fromDate() + "&toDate=" + self.toDate() + "&invoiceDate=" + self.invoiceDate();
            };

            //##endregion Export Options End.
            self.reportCriteria = function (reportActionObj) {
                self.gridOptions = reportActionObj.gridOptions;
                self.reportAction = reportActionObj;
                if (self.isLoaded()) {
                    self.getReportData(reportActionObj);
                }
            };

            self.getReportData = function (reportActionObj) {
                var deferred = $.Deferred();
                var promise = deferred.promise();
                var pageno = 0;

                // List View
                pageno = Number(self.gridOptions.pagingOptions.currentPage());
                if (pageno > 0) {
                    self.RexnordInvoicedReportContainer.listProgress(true);
                    self.boardReportRequest = new refBoardReportRequestModel.Models.BoardReportRequest();
                    self.boardReportRequest.PageNumber = self.gridOptions.pagingOptions.currentPage();
                    self.boardReportRequest.PageSize = self.gridOptions.pagingOptions.pageSize();
                    self.boardReportRequest.FromDate = self.fromDate();
                    self.boardReportRequest.ToDate = self.toDate();
                    self.reportClient.GetRexnordInvoicingReport(self.boardReportRequest, function (data) {
                        self.setPagingData(data.range, data.TotalCount, self.gridOptions.pagingOptions.pageSize());
                        self.RexnordInvoicedReportContainer.listProgress(false);

                        deferred.resolve(data, reportActionObj.view);
                    }, function () {
                        self.RexnordInvoicedReportContainer.listProgress(false);
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };

                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ErrorOccurredWhileFetchingRexnordInvoicingReport, "error", null, toastrOptions);
                    });
                }

                // Load all shipment types if not loaded already
                var itemNumberList = self.itemNumberList().length;
                if (!(itemNumberList)) {
                    _app.trigger("GetItemsTypes", function (items) {
                        self.itemNumberList.removeAll();
                        self.itemNumberList.push.apply(self.itemNumberList, items);
                    });
                }

                // redirects to sales order details page
                self.RexnordInvoicedReportContainer.onBolNumberClick = function (shipmentObj) {
                    var salesOrderId = shipmentObj.Id;
                    _app.trigger("openSalesOrder", salesOrderId, shipmentObj.BOLNumber, function (callback) {
                        if (!callback) {
                            return;
                        }
                    });
                };

                return promise;
            };

            // Assign the Sales Order grid settings
            self.RexnordInvoicedReportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);
            self.RexnordInvoicedReportContainer.onFilterChange = self.reportCriteria;
            self.RexnordInvoicedReportContainer.ForceChange();

            //** To initialize the dates. */
            var fromdate = new Date();
            var x = 90;
            var newFromDate = fromdate.setDate(fromdate.getDate() - x);
            self.fromDate(self.CommonUtils.formatDate(newFromDate, 'mm/dd/yyyy'));
            self.toDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
            //#endregion
        }
        //#endregion
        //#region INTERNAL METHODS
        RexnordInvoicingReportViewModel.prototype.generateReport = function () {
            var self = this;
            self.isLoaded(true);
            self.gridOptions.pagingOptions.currentPage(1);
            self.getReportData(self.reportAction);
        };

        //#region if user any numeric  date  without any format
        RexnordInvoicingReportViewModel.prototype.convertToFromDate = function () {
            var self = this;
            if (!self.fromDate().match('/')) {
                self.fromDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.fromDate()));
            }
        };

        RexnordInvoicingReportViewModel.prototype.convertToDate = function () {
            var self = this;
            if (!self.toDate().match('/') && self.toDate().length > 0) {
                self.toDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.toDate()));
            }
        };

        RexnordInvoicingReportViewModel.prototype.setPagingData = function (data, page, pageSize) {
            var self = this;
            self.gridOptions.data(data);
            self.gridOptions.data.valueHasMutated();
            self.gridOptions.pagingOptions.totalServerItems(page);
        };

        RexnordInvoicingReportViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.UIGridID = ko.observable("RexnordInvoicingReportViewModelGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.enableSelectiveDisplay = true;
            grOption.useExternalSorting = false;
            grOption.showGridSearchFilter = true;
            grOption.sortedColumn = {
                columnName: "InoviceDate",
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

            // ###START: DE20737
            grOption.enableSaveGridSettings = true;

            // ###END: DE20737
            grOption.useClientSideFilterAndSort = true;
            grOption.showColumnMenu = true;
            return grOption;
        };

        RexnordInvoicingReportViewModel.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;

            // For BOLnumber
            var bolCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'BOLNumber\'], click: function() { $userViewModel.onBolNumberClick($parent.entity) }" />';
            colDefinition = [
                { field: 'BOLNumber', displayName: 'BOL#', width: 200, cellTemplate: bolCellTemplate, isRemovable: false },
                { field: 'InvoiceDateDisplay', displayName: 'Invoice Date', width: 200 },
                { field: 'BranchName', displayName: 'Branch', width: 200 },
                { field: 'ShipmentTypeDisplay', displayName: 'ShipmentType', width: 250 },
                { field: 'Cost', displayName: 'Cost', width: 200, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
                { field: 'Revenue', displayName: 'Revenue', width: 200, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate }
            ];
            return colDefinition;
        };

        RexnordInvoicingReportViewModel.prototype.load = function (bindedData) {
            if (!bindedData)
                return;

            var self = this;
            self.fromDate(bindedData.fromDate);
            self.toDate(bindedData.toDate);
            self.isLoaded(bindedData.isLoaded);
            if (refSystem.isObject(self.gridOptions)) {
                self.gridOptions.pagingOptions.pageSize(bindedData.pageSize);
                self.gridOptions.pagingOptions.currentPage(bindedData.currentPage);
                self.getReportData(self.reportAction);
            }
        };

        //#endregion
        //#region LIFE CYCLE EVENT
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        RexnordInvoicingReportViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //The composition engine will execute it prior to calling the binder.
        RexnordInvoicingReportViewModel.prototype.activate = function () {
            return true;
        };

        RexnordInvoicingReportViewModel.prototype.deactivate = function () {
            var self = this;
            var data = {
                //carrierName
                fromDate: self.fromDate(),
                toDate: self.toDate(),
                isLoaded: self.isLoaded(),
                pageSize: self.gridOptions.pagingOptions.pageSize(),
                currentPage: self.gridOptions.pagingOptions.currentPage()
            };
            _app.trigger("registerMyData", data);

            self.cleanup();
        };

        //To load the registered data if any existed.
        RexnordInvoicingReportViewModel.prototype.beforeBind = function () {
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

        RexnordInvoicingReportViewModel.prototype.cleanup = function () {
            var self = this;

            self.RexnordInvoicedReportContainer.cleanup("RexnordInvoicingReportViewModelGrid");

            for (var prop in self) {
                if (prop !== "cleanup")
                    delete self[prop];
            }
            delete self;
        };
        return RexnordInvoicingReportViewModel;
    })();

    return RexnordInvoicingReportViewModel;
});
