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
define(["require", "exports", 'plugins/router', 'durandal/app', '../templates/reportViewerControlV2', 'services/client/SalesOrderClient', 'services/models/common/Enums'], function(require, exports, ___router__, ___app__, ___reportViewer__, __refSalesOrderClient__, __refEnums__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var _reportViewer = ___reportViewer__;
    var refSalesOrderClient = __refSalesOrderClient__;
    var refEnums = __refEnums__;

    //#endregion
    /*
    ** <summary>
    ** Sales Order History ViewModel.
    ** </summary>
    ** <createDetails>
    ** <id>US8214</id> <by>Bhanu</by> <date>9th Aug, 2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US20855</id> <by>Chandan Singh Bajetha</by> <date>29-02-2016</date> <description>Acct: Add spinner in History window</description>
    ** <id>DE23006</id> <by>Shreesha Adiga</by> <date>31-05-2016</date> <description>Remove the spinner in the failure callback</description>
    ** <id>US23277</id> <by>Shreesha Adiga</by> <date>07-07-2016</date> <description>Removed the logic which filtered history for a specific date; Default to page size set to 100</description>
    ** </changeHistory>
    */
    var SalesOrderHistoryViewModel = (function () {
        // ###END: US20855
        //#endregion
        //#region Constructor
        function SalesOrderHistoryViewModel() {
            //#region Members
            this.historyDetailsDatesList = ko.observableArray([]);
            this.historyNewValueContainer = null;
            this.newHeader = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            this.commonUtils = new Utils.Common();
            //To enable/disable History Details button
            this.isHistoryDetailEnable = ko.observable(false);
            //public reportItemHistoryDates: KnockoutObservableArray<string> = ko.observableArray<string>();
            this.selectedHistoryDate = ko.observable('');
            this.selectedVersionId = ko.observable();
            this.salesOrderId = ko.observable(0);
            this.isVisible = ko.observable(true);
            this.historyDate = ko.observable('display-none');
            this.gridCss = ko.observable('div-float-history');
            //Sales Order Client
            this.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
            // ###START: US20855
            // Progress bar
            this.listProgress = ko.observable(false);
            var self = this;
            self.newHeader = new _reportViewer.ReportHeaderOption();
            self.newHeader.reportHeader = "";
            self.newHeader.reportName = "Vendor Bill Payment Details";

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

                self.changeRecord = function (data) {
                    self.selectedHistoryDate(data.historyDateSelected());

                    // set color to selected date
                    self.historyDetailsDatesList().forEach(function (item) {
                        item.isSelectedDate(false);
                    });
                    data.isSelectedDate(true);

                    if (data.versionIdSelected()) {
                        self.selectedVersionId(data.versionIdSelected());
                    }
                    self.historyNewValueContainer.listProgress(true);

                    if (data.versionIdSelected() && data.isSourceIdElastic()) {
                        var successCallBack = function (dataResult) {
                            if (dataResult.IsSourceIsElastic) {
                                self.initializeHistoryDetails(dataResult, dataResult.SalesOrderId, false);
                            } else {
                                self.applyFilter();
                            }
                        }, faliureCallBack = function () {
                            // ##START: DE23006
                            self.historyNewValueContainer.listProgress(false);
                            // ##END: DE23006
                        };
                        self.salesOrderClient.GetShipmentHistoryDetailsByVersionId(self.salesOrderId(), self.selectedVersionId(), "header", successCallBack, faliureCallBack);
                    } else {
                        self.applyFilter();
                    }
                };

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
            self.historyNewValueContainer = new _reportViewer.ReportViewerControlV2(self.newHeader, self.grid);
            self.historyNewValueContainer.onFilterChange = self.setReportCriteria;
            self.historyNewValueContainer.showOptionalHeaderRow(false);
            self.historyNewValueContainer.OptionalHeaderRowLocation('TOP');

            self.historyNewValueContainer.ForceChange();

            //Displays Date without Time Part
            self.historyNewValueContainer.getDateFormat = function (shipmentobj) {
                return self.commonUtils.formatDate(new Date(shipmentobj.ChangeDate), 'mm/dd/yyyy');
            };

            return self;
        }
        //#endregion
        //#region Public Methods
        SalesOrderHistoryViewModel.prototype.initializeHistoryDetails = function (data, salesOrderId, isVisible) {
            var self = this;
            self.historyNewValueContainer.listProgress(true);
            if (data) {
                self.originalData = data;
                if (data.SalesOrderHeaderHistory !== null && data.SalesOrderHeaderHistory.length != 0) {
                    for (var count = 0; count < data.SalesOrderHeaderHistory.length; count++) {
                        if (data.SalesOrderHeaderHistory[count].ChangeAction === "Modified") {
                            data.SalesOrderHeaderHistory[count].IsModified = true;
                        }
                    }
                    self.isHistoryDetailEnable(true);
                    self.salesOrderId(salesOrderId);
                    self.historyNewValueContainer.listProgress(true);
                    self.historyNewValueContainer.OptionalHeaderRowLocation('TOP');
                    self.setPagingData(data.SalesOrderHeaderHistory, self.gridOptions, self.reportAction);

                    if (data.HeaderHistoryDates !== null && data.HeaderHistoryDates.length > 0) {
                        self.isVisible(isVisible);
                        self.selectedHistoryDate(data.HeaderHistoryDates[0].CreatedDateDisplay);
                        if (data.HeaderHistoryDates[0].StringifiedVersionId) {
                            self.selectedVersionId(data.HeaderHistoryDates[0].StringifiedVersionId);
                        }
                    }

                    if (data.HeaderHistoryDates) {
                        self.historyDetailsDatesList.removeAll();

                        //self.reportItemHistoryDates.removeAll();
                        data.HeaderHistoryDates.forEach(function (item) {
                            //self.reportItemHistoryDates.push(item.CreatedDateDisplay);
                            self.historyDetailsDatesList.push(new HistoryDeatilsDatesVodel(item, data.IsSourceIsElastic, self.selectedHistoryDate()));
                        });
                    }

                    self.applyFilter();

                    if (!isVisible) {
                        self.historyDate('display-block');
                        self.gridCss('div-float-historyDetails');
                    } else {
                        $('.noLeftBorder').parent().css('border-left', '0px');
                        $('.noRightBorder').parent().css('border-right', '0px');
                    }
                    self.historyNewValueContainer.listProgress(false);

                    // ###START: US20855
                    self.listProgress(false);
                    // ###END: US20855
                } else {
                    self.historyNewValueContainer.listProgress(false);

                    // ###START: US20855
                    self.listProgress(false);
                    // ###END: US20855
                }
            } else {
                self.historyNewValueContainer.listProgress(false);

                // ###START: US20855
                self.listProgress(false);
                // ###END: US20855
            }
        };

        /*
        // Apply the filter as per the selected history date
        */
        SalesOrderHistoryViewModel.prototype.applyFilter = function () {
            var self = this;

            //if (self.originalData && self.selectedHistoryDate) {
            //	self.salesOrderHistory = ko.utils.arrayFilter(self.originalData.SalesOrderHeaderHistory, (item: IChangeHistoryRecord) => item.ChangeDateFulldate === self.selectedHistoryDate());
            //} else {
            //	self.salesOrderHistory = ko.observableArray()();
            //}
            //self.setPagingData(ko.observableArray(self.salesOrderHistory), self.gridOptions, self.reportAction);
            self.historyNewValueContainer.listProgress(false);
        };

        // To open the history details poop up
        SalesOrderHistoryViewModel.prototype.showHistoryPopup = function () {
            var self = this;

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
            //_app.showDialog('salesOrder/SalesOrderHistoryDetails', optionControlArgs);
            _app.showDialog('salesOrder/SalesOrderHistoryHeaderDetails', optionControlArgs);
        };

        //## function to open history details as a new tab.
        SalesOrderHistoryViewModel.prototype.openHistoryDetails = function () {
            var self = this;
            _app.trigger("openSalesOrderHistoryDetails", self.salesOrderId(), function (callback) {
                if (!callback) {
                    return;
                }
            });
        };

        //#endregion
        //#region Private Methods
        SalesOrderHistoryViewModel.prototype.setPagingData = function (data, grid, gridOption) {
            Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
        };

        SalesOrderHistoryViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("SalesOrderHistoryGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
                columnName: "ID",
                order: "DESC"
            };

            //grOption.enableSaveGridSettings = true;
            grOption.pageSizes = [10, 25, 50, 100];

            // ##START: US23277
            grOption.pageSize = 100;

            // ##END: US23277
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

        SalesOrderHistoryViewModel.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;

            // to change color of modified items 1st: #e80c4d, 2nd:
            var modifiedTemplate = '<div data-bind="style: { color: $parent.entity[\'IsModified\'] ? \'#e80c4d\' : \'black\' }, attr: { \'class\': \'kgCellText colt\' + $index(), title: $data.getProperty($parent)}, html: $data.getProperty($parent) "></div>';

            colDefinition = [
                { field: 'FieldName', displayName: 'Field Name', width: 180 },
                { field: 'OldValue', displayName: 'Old Value', width: 190 },
                { field: 'NewValue', displayName: 'New Value', cellTemplate: modifiedTemplate, width: 190 },
                { field: 'ChangeDateDisplay', displayName: 'Change Date', width: 180 },
                { field: 'ChangeBy', displayName: 'Changed By', width: 180 },
                { field: 'ChangeAction', displayName: 'Action', width: 180 }
            ];
            return colDefinition;
        };

        SalesOrderHistoryViewModel.prototype.cleanUp = function () {
            var self = this;

            self.historyDetailsDatesList.removeAll();
            self.historyNewValueContainer.cleanup("SalesOrderHistoryGrid");

            delete self.commonUtils;
            delete self.setGridColumnDefinitions;
            delete self.setGridOptions;
            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }

            delete self;
        };
        return SalesOrderHistoryViewModel;
    })();
    exports.SalesOrderHistoryViewModel = SalesOrderHistoryViewModel;

    /*
    ** <summary>
    ** ForHistoryDetails
    ** </summary>
    ** <createDetails>
    ** <id></id> <by>chandan Singh</by> <date>16june2015</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var HistoryDeatilsDatesVodel = (function () {
        function HistoryDeatilsDatesVodel(item, isSourceIsElastic, selectedHistoryDate) {
            this.historyDateSelected = ko.observable('');
            this.versionIdSelected = ko.observable('');
            this.isSourceIdElastic = ko.observable(false);
            this.isSelectedDate = ko.observable(false);
            var self = this;
            self.historyDateSelected(item.CreatedDateDisplay);
            self.isSourceIdElastic(isSourceIsElastic);
            if (isSourceIsElastic === true) {
                self.versionIdSelected(item.StringifiedVersionId);
            }
            if (self.historyDateSelected() == selectedHistoryDate) {
                self.isSelectedDate(true);
            } else {
                self.isSelectedDate(false);
            }
        }
        return HistoryDeatilsDatesVodel;
    })();
    exports.HistoryDeatilsDatesVodel = HistoryDeatilsDatesVodel;
});
