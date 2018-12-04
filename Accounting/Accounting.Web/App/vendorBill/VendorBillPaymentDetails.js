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
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', '../templates/reportViewerControlV2', 'services/models/common/Enums'], function(require, exports, ___router__, ___app__, ___reportViewer__, __refEnums__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var _reportViewer = ___reportViewer__;
    var refEnums = __refEnums__;

    //#endregion
    /*
    ** <summary>
    ** Vendor Bill Payment Details View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US8214</id> <by>Satish</by> <date>27th May, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var VendorBillPaymentDetailsViewModel = (function () {
        //Ko grid Code Today end
        function VendorBillPaymentDetailsViewModel() {
            //Ko grid Code Today Start
            this.reportContainer = null;
            this.header = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            var self = this;
            self.header = new _reportViewer.ReportHeaderOption();
            self.header.reportHeader = "";
            self.header.reportName = "Vendor Bill Payment Details";
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
                self.reportAction = reportActionObj;

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
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.DateTimeValidation, "info", null, toastrOptions);
                }
            };

            self.reportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);

            self.reportContainer.onFilterChange = self.setReportCriteria;
            self.reportContainer.showOptionalHeaderRow(false);
            self.reportContainer.OptionalHeaderRowLocation('TOP');
            self.reportContainer.ForceChange();
            return self;
        }
        //#region Public Methods
        VendorBillPaymentDetailsViewModel.prototype.initializePaymentDetails = function (data) {
            var self = this;
            if (data) {
                self.reportContainer.listProgress(true);
                self.reportContainer.OptionalHeaderRowLocation('TOP');
                self.setPagingData(ko.observableArray(data), self.gridOptions, self.reportAction);
                self.reportContainer.listProgress(false);
                $('.noLeftBorder').parent().css('border-left', '0px');
                $('.noRightBorder').parent().css('border-right', '0px');
            } else {
                self.reportContainer.listProgress(false);
            }
        };

        //#endregion
        //#region Private Methods
        VendorBillPaymentDetailsViewModel.prototype.setPagingData = function (data, grid, gridOption) {
            Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
        };

        VendorBillPaymentDetailsViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = false;
            grOption.showGridSearchFilter = true;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("VendorBillGridpaymentDetails");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
                columnName: "Id",
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

            //grOption.UIGridID = ko.observable("Shipment Board"); // TODO : Replace the value with GUID
            grOption.enableSaveGridSettings = false;
            grOption.useClientSideFilterAndSort = true;
            grOption.showColumnMenu = false;
            return grOption;
        };

        VendorBillPaymentDetailsViewModel.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;
            var detailsTemplate = '<div data-bind="attr: { \'class\': \'kgCell colt\' + $index()}"><a style="cursor: pointer" data-bind="text: \'Details\', click: function() { $userViewModel.onGridColumnClick($parent.entity) }" /></div>';
            var bolCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'Id\'], click: function() { $userViewModel.onGridColumnClick($parent.entity) }" />';
            var statusImageTemplate = '<div style="cursor: pointer;" data-bind="attr: { \'class\': \'kgCell colt\' + $parent.entity[\'Id\']}"><img style="margin-top: 4px;"  data-bind="attr: { src: $userViewModel.getImagefromId($parent.entity), id: \'img\' + $parent.entity[\'Id\'] } ,event: { mouseover: function () { $userViewModel.getImageOnMouseHover($parent.entity, $parent.entity[\'Id\']) }, mouseout: function () { $userViewModel.getImageOnMouseOut($parent.entity, $parent.entity[\'Id\']) }, click: function () { $userViewModel.getLargeImage($parent.entity, $parent.entity[\'Id\']); } }" /></div>';

            colDefinition = [
                { field: 'Id', displayName: 'Reference No', isRemovable: false },
                { field: 'CheckIssuedDateDisplay', displayName: 'Check Date', isRemovable: false, width: 200 },
                { field: 'CheckClearedDateDisplay', displayName: 'Cleared Date', isRemovable: false, width: 200 },
                { field: 'PaymentAmount', displayName: 'Payment Amount', cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
                { field: 'TransactionType', displayName: 'Transaction Type', isRemovable: false },
                //{ field: 'Status', displayName: 'Status', isRemovable: false },
                //{ field: 'Batch', displayName: 'Batch', isRemovable: false },
                //{ field: 'BatchComments', displayName: 'Batch Comments', isRemovable: false },
                { field: 'FactoringCompany', displayName: 'Remit To', isRemovable: false }
            ];
            return colDefinition;
        };

        //#endregion
        //#region Clean Up
        VendorBillPaymentDetailsViewModel.prototype.cleanUp = function () {
            var self = this;

            try  {
                self.reportContainer.cleanup("VendorBillGridpaymentDetails");

                for (var prop in self) {
                    if (prop !== "cleanup")
                        delete self[prop];
                }

                delete self;
            } catch (exception) {
            }
        };
        return VendorBillPaymentDetailsViewModel;
    })();
    exports.VendorBillPaymentDetailsViewModel = VendorBillPaymentDetailsViewModel;
});
