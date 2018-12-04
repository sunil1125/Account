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
/// <reference path="../services/models/TypeDefs/VendorBillModels.d.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', '../templates/reportViewerControlV2', 'services/client/VendorBillClient'], function(require, exports, ___router__, ___app__, ___reportViewer__, __refVendorBillClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    var _reportViewer = ___reportViewer__;
    
    
    var refVendorBillClient = __refVendorBillClient__;

    //#endregion
    /*
    ** <summary>
    ** VendorBillExceptionViewModel
    ** </summary>
    ** <createDetails>
    ** <id>US13250</id> <by>Chandan</by> <date>12-4-2014</date>}
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var VendorBillExceptionPopupViewModel = (function () {
        //#endregion
        //#region CONSTRUCTOR
        function VendorBillExceptionPopupViewModel() {
            //#region MEMBERS
            //#region public report viewer members
            this.reportContainer = null;
            this.headerOptions = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            this.vendorBillClient = new refVendorBillClient.VendorBillClient();
            //vendorBillExceptionRule: KnockoutObservable<string>
            this.vendorBillId = ko.observable(0);
            var self = this;
            self.headerOptions = new _reportViewer.ReportHeaderOption();
            self.headerOptions.reportHeader = "";
            self.headerOptions.reportName = "Vendor Bill Exception Rule And Resolution";

            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);

            self.setReportCriteria = function (reportActionObj) {
                self.gridOptions = reportActionObj.gridOptions;
                if (self.reportAction != null) {
                    self.gridOptions.pagingOptions.currentPage(1);
                }

                // Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
                // we don't want any data on page load so we commented getReportdata  function.
                // self.getReportData();
                self.reportAction = reportActionObj;
            };

            self.reportContainer = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
            self.reportContainer.onFilterChange = self.setReportCriteria;
            self.reportContainer.showOptionalHeaderRow(false);
            self.reportContainer.OptionalHeaderRowLocation('TOP');
            self.reportContainer.ForceChange();

            //	return promise;
            //};
            return self;
            //#endregion
        }
        //#endregion
        //#region Public Methods
        VendorBillExceptionPopupViewModel.prototype.initializeExeptionruleAndResolution = function (data) {
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

        //close popup
        VendorBillExceptionPopupViewModel.prototype.closePopup = function (dialogResult) {
            var self = this;
            dialogResult.__dialog__.close(this, dialogResult);
            this.cleanup();
            return true;
        };

        //#endregion public Methods
        //#region INTERNAL METHODS
        VendorBillExceptionPopupViewModel.prototype.setPagingData = function (data, grid, gridOption) {
            Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
        };

        VendorBillExceptionPopupViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("VendorBillExceptionPopuptGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
                columnName: "ProNumber",
                order: "DESC"
            };

            //grOption.enableSaveGridSettings = true;
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

            //grOption.UIGridID = ko.observable("Shipment Board"); // TODO : Replace the value with GUID
            grOption.enableSaveGridSettings = false;
            grOption.useClientSideFilterAndSort = true;
            grOption.showColumnMenu = false;
            return grOption;
        };

        VendorBillExceptionPopupViewModel.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;

            colDefinition = [
                { field: 'VendorBillExceptionRuleDescription', displayName: 'VendorBill Exception Rule', width: 400 },
                { field: 'ExceptionResolution', displayName: 'Exception Resolution', width: 450 }
            ];
            return colDefinition;
        };

        //#endregion
        //#region LIFE CYCLE EVENT
        //#endregion
        //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
        VendorBillExceptionPopupViewModel.prototype.beforeBind = function () {
        };

        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        VendorBillExceptionPopupViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        VendorBillExceptionPopupViewModel.prototype.activate = function (refresh) {
            var self = this;
            if (refresh.bindingObject) {
                self.vendorBillId(parseInt(refresh.bindingObject.vendorBillId));
                self.vendorBillClient.GetVendorBillExceptionRulesAndResolution(self.vendorBillId(), function (data) {
                    if (data) {
                        self.initializeExeptionruleAndResolution(data);
                    }
                }, function () {
                });
            }
        };

        VendorBillExceptionPopupViewModel.prototype.cleanup = function () {
            var self = this;
            try  {
                self.reportContainer.cleanup("VendorBillExceptionPopuptGrid");

                for (var prop in self) {
                    delete self[prop];
                }
            } catch (e) {
                console.log("error occurred during cleanup of exception popup");
            }
        };
        return VendorBillExceptionPopupViewModel;
    })();
    return VendorBillExceptionPopupViewModel;
});
