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
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/client/VendorBillClient', '../templates/reportViewerControlV2', 'services/models/common/Enums'], function(require, exports, ___router__, ___app__, __refVendorBillClient__, ___reportViewer__, __refEnums__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refVendorBillClient = __refVendorBillClient__;
    var _reportViewer = ___reportViewer__;
    var refEnums = __refEnums__;

    //#endregion
    /*
    ** <summary>
    ** Vendor Bill History View Model
    ** </summary>
    ** <createDetails>
    ** <id>US8214</id> <by>Satish</by> <date>27th May, 2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US20855</id> <by>Chandan Singh Bajetha</by> <date>29-02-2016</date> <description>Acct: Add spinner in History window</description>
    ** <id>DE23006</id> <by>Shreesha Adiga</by> <date>31-05-2016</date> <description>Remove the spinner in the failure callback</description>
    ** <id>US23123</id> <by>Vasanthakumar</by> <date>07-07-2016</date> <description>Acct: VB History Tab Window Enhancement</description>
    ** </changeHistory>
    */
    var VendorBillHistory = (function () {
        // ###END: US20855
        //#endregion
        //#region Constructor
        function VendorBillHistory() {
            //#region Members
            this.historyDetailsDatesList = ko.observableArray([]);
            this.historyNewValueContainer = null;
            this.newHeader = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            this.commonUtils = new Utils.Common();
            //To enable/disable History Details Button
            this.isHistoryDetailEnable = ko.observable(false);
            this.reportItemHistoryDates = ko.observableArray();
            this.selectedHistoryDate = ko.observable('');
            this.isVisible = ko.observable(true);
            this.historyDate = ko.observable('display-none');
            this.gridCss = ko.observable('div-float-history');
            this.selectedVersionId = ko.observable();
            this.vendorBillId = ko.observable();
            this.vendorBillClient = new refVendorBillClient.VendorBillClient();
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
                                self.initializeHistoryDetails(dataResult, dataResult.VendorBillId, false);
                            } else {
                                self.applyFilter();
                            }
                        }, faliureCallBack = function () {
                            // ##START: DE23006
                            self.historyNewValueContainer.listProgress(false);
                            // ##END: DE23006
                        };
                        self.vendorBillClient.GetVendorBillHistoryDetailsByVersionId(self.VBId, self.selectedVersionId(), "header", successCallBack, faliureCallBack);
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
        VendorBillHistory.prototype.initializeHistoryDetails = function (data, vendorBillId, isVisible) {
            var self = this;
            self.historyNewValueContainer.listProgress(true);
            if (data) {
                self.originalData = data;
                self.VBId = vendorBillId;

                if (data.VendorBillHeaderHistory !== null && data.VendorBillHeaderHistory.length != 0) {
                    for (var count = 0; count < data.VendorBillHeaderHistory.length; count++) {
                        if (data.VendorBillHeaderHistory[count].ChangeAction === "Modified") {
                            data.VendorBillHeaderHistory[count].IsModified = true;
                        }
                    }
                    self.isHistoryDetailEnable(true);
                    self.historyNewValueContainer.OptionalHeaderRowLocation('TOP');
                    self.setPagingData(ko.observableArray(data.VendorBillHeaderHistory), self.gridOptions, self.reportAction);

                    if (data.HeaderHistoryDates !== null && data.HeaderHistoryDates.length > 0) {
                        self.isVisible(isVisible);
                        self.selectedHistoryDate(data.HeaderHistoryDates[0].CreatedDateDisplay);
                        if (data.HeaderHistoryDates[0].StringifiedVersionId) {
                            self.selectedVersionId(data.HeaderHistoryDates[0].StringifiedVersionId);
                        }
                    }

                    if (data.HeaderHistoryDates) {
                        // self.reportItemHistoryDates.removeAll();
                        self.historyDetailsDatesList.removeAll();
                        data.HeaderHistoryDates.forEach(function (item) {
                            // self.reportItemHistoryDates.push(item);
                            self.historyDetailsDatesList.push(new HistoryDeatilsDatesVodel(item, data.IsSourceIsElastic, self.selectedHistoryDate()));
                        });
                    } else {
                    }

                    if (!isVisible) {
                        self.historyDate('display-block');
                        self.gridCss('div-float-historyDetails');
                    } else {
                        $('.noLeftBorder').parent().css('border-left', '0px');
                        $('.noRightBorder').parent().css('border-right', '0px');
                    }
                    self.historyNewValueContainer.listProgress(false);
                    self.listProgress(false);
                } else {
                    self.historyNewValueContainer.listProgress(false);
                    self.listProgress(false);
                }
            }
        };

        /*
        // Apply the filter as per the selected history date
        */
        VendorBillHistory.prototype.applyFilter = function () {
            var self = this;

            if (self.originalData && self.selectedHistoryDate) {
                self.vendorBillHistory = ko.utils.arrayFilter(self.originalData.VendorBillHeaderHistory, function (item) {
                    return item.ChangeDateFulldate === self.selectedHistoryDate();
                });
            } else {
                self.vendorBillHistory = ko.observableArray()();
            }

            //if (self.originalData && self.selectedHistoryDate) {
            //    self.newHistoryValues = ko.utils.arrayFilter(self.originalData.NewHistoryItems, (item: IVendorBillHistoryItems) => item.ChangeDate === self.selectedHistoryDate());
            //} else {
            //    self.newHistoryValues = ko.observableArray()();
            //}
            //self.historyOldValueContainer.OptionalHeaderRowLocation('TOP');
            self.setPagingData(ko.observableArray(self.vendorBillHistory), self.gridOptions, self.reportAction);
            self.historyNewValueContainer.listProgress(false);
            //self.historyNewValueContainer.OptionalHeaderRowLocation('TOP');
            //self.setPagingData(ko.observableArray(self.newHistoryValues), self.newGridOptions, self.newReportAction);
            //self.historyNewValueContainer.listProgress(false);
        };

        // To open the history details poop up
        VendorBillHistory.prototype.showHistoryPopup = function () {
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
            _app.showDialog('vendorBill/VendorBillHistoryDetails', optionControlArgs);
        };

        //## function to open history details as a new tab.
        VendorBillHistory.prototype.openHistoryDetails = function () {
            var self = this;
            _app.trigger("openHistoryDetails", self.VBId, self.proNumber, function (callback) {
                if (!callback) {
                    return;
                }
            });
        };

        //#endregion
        //#region Private Methods
        VendorBillHistory.prototype.setPagingData = function (data, grid, gridOption) {
            Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
        };

        VendorBillHistory.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("VendorBillGridHistory");
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

        VendorBillHistory.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;

            // to change color of modified items
            var modifiedTemplate = '<div data-bind="style: { color: $parent.entity[\'IsModified\'] ? \'#e80c4d\' : \'black\' }, attr: { \'class\': \'kgCellText colt\' + $index(), title: $data.getProperty($parent)}, html: $data.getProperty($parent) "></div>';

            colDefinition = [
                { field: 'FieldName', displayName: 'Field Name', width: 180 },
                { field: 'OldValue', displayName: 'Old Value', width: 230 },
                { field: 'NewValue', displayName: 'New Value', cellTemplate: modifiedTemplate, width: 230 },
                { field: 'ChangeDateDisplay', displayName: 'Change Date', width: 140 },
                { field: 'ChangeBy', displayName: 'Changed By', width: 180 },
                { field: 'ChangeAction', displayName: 'Action', width: 105 }
            ];
            return colDefinition;
        };

        VendorBillHistory.prototype.cleanUp = function () {
            var self = this;
            try  {
                //delete self.historyNewValueContainer.afterSelectionChange;
                //delete self.historyNewValueContainer.onFilterChange;
                self.historyNewValueContainer.cleanup("VendorBillGridHistory");
                delete self.setGridColumnDefinitions;
                delete self.setPagingData;

                self.historyDetailsDatesList().forEach(function (items) {
                    items.cleanup();
                    delete items;
                });

                for (var prop in self) {
                    delete self[prop];
                }

                delete self;
            } catch (e) {
            }
        };
        return VendorBillHistory;
    })();
    exports.VendorBillHistory = VendorBillHistory;

    /*
    ** <summary>
    ** ForHistoryDetails
    ** </summary>
    ** <createDetails>}
    ** <id></id> <by>chandan Singh</by> <date>16june2015</date>
    ** </createDetails>}
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
                self.isSourceIdElastic(isSourceIsElastic);
            }

            if (self.historyDateSelected() == selectedHistoryDate) {
                self.isSelectedDate(true);
            } else {
                self.isSelectedDate(false);
            }
        }
        HistoryDeatilsDatesVodel.prototype.cleanup = function () {
            var self = this;
            try  {
                for (var prop in self) {
                    if (typeof self[prop].dispose === "function") {
                        self[prop].dispose();
                    }
                    delete self[prop];
                }

                delete self;
            } catch (e) {
            }
        };
        return HistoryDeatilsDatesVodel;
    })();
    exports.HistoryDeatilsDatesVodel = HistoryDeatilsDatesVodel;
});
