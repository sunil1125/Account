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
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/models/common/Enums', 'templates/reportViewerControlV2'], function(require, exports, ___router__, ___app__, __refEnums__, ___reportViewer__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refEnums = __refEnums__;
    var _reportViewer = ___reportViewer__;

    //#endregion
    /**
    ** <summary>
    ** Purchase Order History View Model.
    ** < / summary >
    ** <createDetails>
    ** <by>Achal Rastogi</by > <date>17th July, 2014 </date >
    ** < / createDetails>
    ** <changeHistory>
    ** <id>DE23592</id> <by>Dhaval Tamhane</by> <date>22-07-2016</date> <description>Unmatched Vendor bill History - Value cannot be null error logged</description>
    ** </changeHistory>
    **/
    var PurchaseOrderHistoryViewModel = (function () {
        //#endregion
        //#region Constructors
        function PurchaseOrderHistoryViewModel() {
            //#region Members
            this.historyPurchaseOrderContainer = null;
            this.newHeader = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            this.commonUtils = new Utils.Common();
            //To enable/disable History Details button
            this.isHistoryDetailEnable = ko.observable(false);
            var self = this;
            var commonUtils = new Utils.Common();
            self.newHeader = new _reportViewer.ReportHeaderOption();
            self.newHeader.reportHeader = "";
            self.newHeader.reportName = "Purchase Order History Details";

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

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectDateTimeFrame, "info", null, toastrOptions);
                }
            };

            // Assign the New value grid settings
            self.historyPurchaseOrderContainer = new _reportViewer.ReportViewerControlV2(self.newHeader, self.grid);
            self.historyPurchaseOrderContainer.onFilterChange = self.setReportCriteria;
            self.historyPurchaseOrderContainer.showOptionalHeaderRow(false);
            self.historyPurchaseOrderContainer.OptionalHeaderRowLocation('TOP');

            self.historyPurchaseOrderContainer.ForceChange();

            //Displays Date without Time Part
            self.historyPurchaseOrderContainer.getDateFormat = function (shipmentobj) {
                var self = this;
                return commonUtils.formatDate(new Date(shipmentobj.ChangeDate), 'mm/dd/yyyy');
            };

            //Displays Date without Time Part
            self.historyPurchaseOrderContainer.getDateFormat = function (shipmentobj) {
                return self.commonUtils.formatDate(new Date(shipmentobj.ChangeDate), 'mm/dd/yyyy');
            };

            return self;
        }
        //#endregion
        //#region Internal Methods
        PurchaseOrderHistoryViewModel.prototype.initializeHistoryDetails = function (data) {
            var self = this;

            if (data && data.length > 0) {
                for (var count = 0; count < data.length; count++) {
                    if (data[count].ChangeAction === "Modified") {
                        data[count].IsModified = true;
                    }
                }
                self.isHistoryDetailEnable(true);
                self.historyPurchaseOrderContainer.listProgress(true);
                self.historyPurchaseOrderContainer.OptionalHeaderRowLocation('TOP');
                self.setPagingData(ko.observableArray(data), self.gridOptions, self.reportAction);
                self.historyPurchaseOrderContainer.listProgress(false);

                $('.noLeftBorder').parent().css('border-left', '0');
                $('.noRightBorder').parent().css('border-right', '0');
            } else {
                self.historyPurchaseOrderContainer.listProgress(false);
            }
        };

        // To open the history details poop up
        PurchaseOrderHistoryViewModel.prototype.showHistoryPopup = function () {
            var varMsgBox = [
                {
                    id: 0,
                    name: 'Close',
                    callback: function () {
                        return true;
                    }
                }
            ];

            ////initialize message box control arguments
            var optionControlArgs = {
                options: varMsgBox,
                message: '',
                title: 'History Details'
            };

            //Call the dialog Box functionality to open a Popup
            _app.showDialog('vendorBill/VendorBillHistoryDetails', optionControlArgs);
        };

        //## function to open history details as a new tab.
        PurchaseOrderHistoryViewModel.prototype.openHistoryDetails = function () {
            var self = this;
            _app.trigger("openHistoryDetails", self.vendorBillId, self.proNumber, function (callback) {
                if (!callback) {
                    return;
                }
            });
        };

        //#endregion
        //#region Private Methods
        PurchaseOrderHistoryViewModel.prototype.setPagingData = function (data, grid, gridOption) {
            Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
        };

        PurchaseOrderHistoryViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("PurchaseOrderHistoryGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
                columnName: "ChangeDateDisplay",
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

            grOption.showColumnMenu = false;
            return grOption;
        };

        PurchaseOrderHistoryViewModel.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;

            // to change color of modified items
            var modifiedTemplate = '<div data-bind="style: { color: $parent.entity[\'IsModified\'] ? \'#e80c4d\' : \'black\' }, attr: { \'class\': \'kgCellText colt\' + $index(), title: $data.getProperty($parent)}, html: $data.getProperty($parent) "></div>';

            colDefinition = [
                { field: 'FieldName', displayName: 'Field Name', width: 180 },
                { field: 'OldValue', displayName: 'Old Value', width: 180 },
                { field: 'NewValue', displayName: 'New Value', cellTemplate: modifiedTemplate, width: 180 },
                { field: 'ChangeDateDisplay', displayName: 'Change Date', width: 180 },
                { field: 'ChangeBy', displayName: 'Changed By', width: 180 },
                { field: 'ChangeAction', displayName: 'Action', width: 165 }
            ];
            return colDefinition;
        };

        //#region Life Cycle Event
        PurchaseOrderHistoryViewModel.prototype.activate = function () {
            return true;
        };

        PurchaseOrderHistoryViewModel.prototype.cleanUp = function () {
            var self = this;

            self.historyPurchaseOrderContainer.cleanup("PurchaseOrderHistoryGrid");

            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }

            delete self;
        };
        return PurchaseOrderHistoryViewModel;
    })();
    exports.PurchaseOrderHistoryViewModel = PurchaseOrderHistoryViewModel;
});
