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
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/models/common/Enums', '../templates/reportViewerControlV2'], function(require, exports, ___router__, ___app__, __refEnums__, ___reportViewer__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refEnums = __refEnums__;
    var _reportViewer = ___reportViewer__;

    //#endregion
    /**
    ** <summary>
    * * Purchase Order PO Possibility Find Result View Model.
    * * < / summary >
    * * <createDetails>
    * * <by>Bhanu pratap</by > <date>5 Aug, 2014 </date >
    * * < / createDetails>
    **/
    var PurchaseOrderPOPpossibilityFindResultViewModel = (function () {
        //#endregion
        //#region Constructor
        function PurchaseOrderPOPpossibilityFindResultViewModel() {
            //#region Members
            this.reportContainer = null;
            this.header = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            var self = this;

            //#region Grid Settings
            self.header = new _reportViewer.ReportHeaderOption();
            self.header.reportHeader = "";
            self.header.reportName = "Vendor Bill PO Possibility Details";
            self.header.gridTitleHeader = "";

            //initialize date filters
            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);

            self.setReportCriteria = function (ReportActionObj) {
                if (ReportActionObj.filter1selectedItemId == undefined || ReportActionObj.filter1selectedItemId == 0) {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 15,
                        fadeOut: 15,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectModeFromTheList, "info", null, toastrOptions);
                    self.reportContainer.listProgress(false);
                    self.reportContainer.selectedFilter1Item(self.modeType());
                } else {
                    self.gridOptions = ReportActionObj.gridOptions;
                    if (self.modeType() != ReportActionObj.filter1selectedItemId) {
                        self.reportContainer.columnDefinition(self.setGridColumnDefinitions());
                    }
                    self.reportAction = ReportActionObj;
                }
            };

            self.reportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);

            self.reportContainer.onFilterChange = self.setReportCriteria;
            self.reportContainer.showOptionalHeaderRow(false);
            self.reportContainer.OptionalHeaderRowLocation('TOP');
            self.reportContainer.ForceChange();

            //#endregion
            return self;
        }
        //#endregion
        //#region Internal Public Methods
        //#endregion
        //#region Internal private methods
        PurchaseOrderPOPpossibilityFindResultViewModel.prototype.setPagingData = function (data, grid, gridOption) {
            Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
        };

        PurchaseOrderPOPpossibilityFindResultViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = true;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("PurchaseOrderPOPPossibilityGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
                columnName: "ID",
                order: "DESC"
            };

            //grOption.enableSaveGridSettings = true;
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

            //grOption.UIGridID = ko.observable("Shipment Board"); // TODO : Replace the value with GUID
            grOption.enableSaveGridSettings = false;
            grOption.useClientSideFilterAndSort = true;
            grOption.showColumnMenu = false;
            return grOption;
        };

        PurchaseOrderPOPpossibilityFindResultViewModel.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;

            var ForceAttachTemplate = '<button data-bind="attr: { \'class\': \'btn btn-primary\'}">Force Attach</button>';
            colDefinition = [
                { field: 'Action', displayName: 'Action', width: 100, cellTemplate: ForceAttachTemplate },
                { field: 'CreatedBy', displayName: 'Created By', width: 100 },
                { field: 'BOL', displayName: 'BOL#', width: 100 },
                { field: 'PRO', displayName: 'PRO#', width: 100 },
                { field: 'CarrierName', displayName: 'Carrier', width: 100 },
                { field: 'PickupDateDisplay', displayName: 'Pickup Date', width: 120 },
                { field: 'OriginZip', displayName: 'Origin Zip', width: 100 },
                { field: 'DestinationZip', displayName: 'Destination Zip', width: 140 },
                { field: 'PONumber', displayName: 'PO#', width: 80 },
                { field: 'ReferenceNo', displayName: 'REF#', width: 100 },
                { field: 'Shipper', displayName: 'Shipper', width: 120 },
                { field: 'Consignee', displayName: 'Consignee', width: 120 },
                { field: 'Customer', displayName: 'Customer', width: 120 },
                { field: 'Remarks', displayName: 'Remarks', width: 140 }
            ];
            return colDefinition;
        };

        PurchaseOrderPOPpossibilityFindResultViewModel.prototype.cleanup = function () {
            var self = this;

            self.reportContainer.cleanup("PurchaseOrderPOPPossibilityGrid");

            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }

            delete self;
        };
        return PurchaseOrderPOPpossibilityFindResultViewModel;
    })();
    exports.PurchaseOrderPOPpossibilityFindResultViewModel = PurchaseOrderPOPpossibilityFindResultViewModel;
});
