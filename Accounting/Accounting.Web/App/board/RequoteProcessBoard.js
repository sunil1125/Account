/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../services/models/TypeDefs/Boards.d.ts" />
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', '../templates/reportViewerControlV2', 'services/models/common/Enums', 'services/client/BoardsClient', 'services/models/purchaseOrder/PurchaseOrderSearchFilter', 'services/client/CommonClient'], function(require, exports, ___router__, ___app__, __refSystem__, ___reportViewer__, __refEnums__, __refBoardsClient__, ___refPurchaseOrderSearchFilterModel__, __refCommonClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    var _reportViewer = ___reportViewer__;
    var refEnums = __refEnums__;
    var refBoardsClient = __refBoardsClient__;
    
    var _refPurchaseOrderSearchFilterModel = ___refPurchaseOrderSearchFilterModel__;
    var refCommonClient = __refCommonClient__;
    

    /***********************************************
    BOARD RE-QUOTE VIEWMODEL
    ************************************************
    ** <summary>
    ** Board Re-Quote View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US12941</id><by>Chadnan</by> <date>OCT/2014</date>
    ** </createDetails>}
    ** <changeHistory>
    ** <id>DE20737</id> <by>Vasanthakumar</by> <date>26-11-2015</date><description>Enabled the grid setting saving option</description>
    ** <id>US20103</id> <by>Baldev Singh Thakur</by> <date>11-01-2016</date><description>Added Sales Agent Column to the grid columns.</description>
    ** </changeHistory>
    ***********************************************/
    var RequoteProcessBoardViewModel = (function () {
        //#endregion Public report viewer members
        function RequoteProcessBoardViewModel() {
            this.reportClient = null;
            this.listProgress = ko.observable(false);
            //#region Public report viewer members
            this.requoteBoardContainer = null;
            this.headerOptions = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            this.boardReportRequest = null;
            this.sortCol = ko.observable('');
            this.sorttype = ko.observable('');
            this.isLoaded = ko.observable(false);
            this.fromLocalStorage = ko.observable(false);
            this.searchFilterItems = new Array();
            this.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
            this.localStorageKey = ko.observable('');
            this.commonClientCommand = new refCommonClient.Common();
            this.currentDateTime = ko.observable('');
            this.isSearchFilterItemsData = ko.observable(false);
            this.commonUtils = new Utils.Common();
            var self = this;
            self.headerOptions = new _reportViewer.ReportHeaderOption();
            self.headerOptions.reportHeader = " ";
            self.headerOptions.reportName = "Dispute Board Details Report";
            self.headerOptions.gridTitleHeader = " ";
            self.searchText = ko.observable("");
            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);
            self.reportClient = new refBoardsClient.BoardsClientCommands();

            //set local storage key by url
            var url = $(location).attr('href');
            var urlArray = url.split('/');
            var localStorageId = urlArray.pop().toString().replace(/#/g, "");
            self.localStorageKey(localStorageId);
            if (localStorageId === "ReQuote") {
                self.localStorageKey(localStorageId + "27");
            } else {
                self.localStorageKey(localStorageId);
            }

            self.setReportCriteria = function (reportActionObj) {
                if ((reportActionObj != undefined || reportActionObj != null) && (reportActionObj.gridOptions != undefined || reportActionObj.gridOptions != null) && (refSystem.isObject(reportActionObj.gridOptions.sortInfo())) && (reportActionObj.gridOptions.sortInfo().column != undefined || reportActionObj.gridOptions.sortInfo().column != null) && (reportActionObj.gridOptions.sortInfo().column.field != undefined || reportActionObj.gridOptions.sortInfo().column.field != null)) {
                    self.sortCol(reportActionObj.gridOptions.sortInfo().column.field);
                    self.sorttype(reportActionObj.gridOptions.sortInfo().direction);
                    if (self.sortCol() == 'PickupDateDisplay') {
                        self.sortCol('PickupDate');
                    } else if (self.sortCol() == 'ReviewedDateDisplay') {
                        self.sortCol('ReviewedDate');
                    } else if (self.sortCol() == 'ShipmentTypeDisplay') {
                        self.sortCol('ShipmentMode');
                    } else if (self.sortCol() == 'CostAdjustmentDisplay') {
                        self.sortCol('CostAdjustment');
                    } else if (self.sortCol() == 'AgeingDateDisplay') {
                        self.sortCol('AgeingDate');
                        var sortDirection = self.sorttype() === 'asc' ? 'desc' : 'asc';
                        self.sorttype(sortDirection);
                    } else if (self.sortCol() == 'AgeingDisplay') {
                        self.sortCol('AgeingDate');
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'CustomerTypeName') {
                        self.sortCol("ProcessFlow");
                    }
                } else {
                    self.sortCol("PRONumber");
                    self.sorttype("desc");
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

                    self.requoteBoardContainer.listProgress(false);
                    self.requoteBoardContainer.selectedFilter1Item(self.modeType());
                } else {
                    self.gridOptions = reportActionObj.gridOptions;

                    if (self.modeType() != reportActionObj.filter1selectedItemId) {
                        self.modeType(reportActionObj.filter1selectedItemId);
                        self.requoteBoardContainer.columnDefinition(self.setGridColumnDefinitions());
                    }

                    self.reportAction = reportActionObj;
                    if (self.isLoaded()) {
                        self.getReportData(self.reportAction);
                    }
                }
            };

            self.getReportData = function (reportActionObj) {
                var deferred = $.Deferred();
                var promise = deferred.promise();

                // ReSharper disable once AssignedValueIsNeverUsed
                var pageno = 0;
                pageno = Number(self.gridOptions.pagingOptions.currentPage());
                if (pageno > 0) {
                    if (self.requoteBoardContainer.reportColumnFilter.isFilterApply) {
                        self.searchText('');
                        self.gridOptions.filterOptions.filterText('');
                    }

                    var list = self.requoteBoardContainer.reportColumnFilter.reportColumnFilters();
                    self.searchFilterItems.removeAll();
                    if (list.length > 0) {
                        list.forEach(function (items) {
                            self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
                            if (items.selectedserviceType() != undefined && items.selectedOperatorType() != undefined) {
                                self.searchFilterItem.Operand = +items.selectedOperatorType().opratorId;
                                self.searchFilterItem.SearchText = items.searchText();

                                if (items.selectedserviceType().field === 'PickupDateDisplay') {
                                    self.searchFilterItem.FieldName = "PickupDate";
                                } else if (items.selectedserviceType().field === 'ReviewedDateDisplay') {
                                    self.searchFilterItem.FieldName = "ReviewedDate";
                                } else if (items.selectedserviceType().field === 'CostAdjustmentDisplay') {
                                    self.searchFilterItem.FieldName = "CostAdjustment";
                                } else if (items.selectedserviceType().field === 'ShipmentTypeDisplay') {
                                    self.searchFilterItem.FieldName = "ShipmentMode";
                                } else if (items.selectedserviceType().field === 'CustomerTypeName') {
                                    self.searchFilterItem.FieldName = "CustomerTypeDisplay";
                                } else if (items.selectedserviceType().field === 'AgeingDateDisplay' || items.selectedserviceType().field === 'AgeingDisplay') {
                                    self.searchFilterItem.FieldName = "AgeingDate";

                                    if (items.selectedserviceType().field === 'AgeingDateDisplay') {
                                        if (self.searchFilterItem.Operand === 4) {
                                            self.searchFilterItem.Operand = 3;
                                        } else if (self.searchFilterItem.Operand === 3) {
                                            self.searchFilterItem.Operand = 4;
                                        }

                                        var fromdate = new Date();
                                        var x = parseInt(items.searchText());
                                        if (isNaN(x)) {
                                            self.searchFilterItem.SearchText = (self.commonUtils.formatDate(fromdate, 'mm/dd/yyyy')).toString();
                                        } else {
                                            var newFromDate = fromdate.setDate(fromdate.getDate() - x);
                                            self.searchFilterItem.SearchText = (self.commonUtils.formatDate(newFromDate, 'mm/dd/yyyy')).toString();
                                        }
                                    }
                                } else {
                                    self.searchFilterItem.FieldName = items.selectedserviceType().field;
                                }

                                self.searchFilterItems.push(self.searchFilterItem);
                            }
                            if (self.searchFilterItems.length > 0 || items.selectedserviceType() != undefined) {
                                self.isSearchFilterItemsData(true);
                                //$('#reQuote').addClass('margin-top--30');
                            } else {
                                self.isSearchFilterItemsData(false);
                                //$('#reQuote').removeClass('margin-top--30');
                            }
                        });
                    }

                    self.requoteBoardContainer.listProgress(true);
                    var deferred = $.Deferred();
                    var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems };
                    var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.SubOrderProcessingBoard, IsFilterApplied: self.requoteBoardContainer.reportColumnFilter.isFilterApply, GridSearchText: null, PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), FromLocalStorage: self.fromLocalStorage() };

                    self.reportClient.getRequoteProcessBoard(filterDataToSave, function (data) {
                        self.setPagingData(data.RequoteProcessBoardList, data.NumberOfRows, self.gridOptions.pagingOptions.pageSize());
                        self.requoteBoardContainer.listProgress(false);

                        deferred.resolve(data, reportActionObj.view);
                    }, function () {
                        self.requoteBoardContainer.listProgress(false);
                    }, self.gridOptions.pagingOptions);
                }
                return promise;
            };

            self.requoteBoardContainer = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
            self.requoteBoardContainer.onFilterChange = self.setReportCriteria;
            self.requoteBoardContainer.ForceChange();

            // To open vendor Bill
            self.requoteBoardContainer.onProNumberClick = function (shipmentObj) {
                var vendorBillId = shipmentObj.VendorBillId;

                //Only for Unique identificaton or heighlight selected row
                LocalStorageController.Set('ReQuoteBoardBOLNumber', undefined);
                LocalStorageController.Set('ReQuoteBoardBOLNumber', vendorBillId);
                _app.trigger("openVendorBill", vendorBillId, shipmentObj.PRONumber, function (callback) {
                    if (!callback) {
                        return;
                    }
                });
            };

            // TO open sales Order
            self.requoteBoardContainer.onBolNumberClick = function (shipmentObj) {
                var salesOrderId = shipmentObj.ShipmentId;

                //Only for Unique identificaton or heighlight selected row
                LocalStorageController.Set('ReQuoteBoardBOLNumber', undefined);
                var VendorBillId = shipmentObj.VendorBillId;
                LocalStorageController.Set('ReQuoteBoardBOLNumber', VendorBillId);
                _app.trigger("openSalesOrder", salesOrderId, shipmentObj.BOLNumber, function (callback) {
                    if (!callback) {
                        return;
                    }
                });
            };

            self.requoteBoardContainer.onGridColumnClick2 = function (obj) {
                if (obj.IsManualProcess) {
                    obj.IsManualProcess = false;
                } else {
                    obj.IsManualProcess = true;
                    obj.IsAutomateProcess = false;
                }

                self.gridOptions.data.valueHasMutated();
            };

            self.requoteBoardContainer.onGridColumnClick = function (obj) {
                if (obj.IsAutomateProcess) {
                    obj.IsAutomateProcess = false;
                } else {
                    obj.IsAutomateProcess = true;
                    obj.IsManualProcess = false;
                }

                self.gridOptions.data.valueHasMutated();
            };

            self.requoteBoardContainer.onSalesOrderClick = function (obj) {
                //self.shipmentId = obj.ShipmentId;
                //var successCallBack = function (data) {
                //var newData = { ShipmentId: self.shipmentId, RebillData: data }
                var newData = { ShipmentId: obj.ShipmentId };
                self.showRevenueAdjustmentPopup(newData);
                //},
                //    faliureCallBack = function (error) {
                //    };
                //self.reportClient.GetSalesOrderRebill(obj.ShipmentId.toString(), successCallBack, faliureCallBack);
            };

            return self;
        }
        //#region Private Methods
        RequoteProcessBoardViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;

            // ###START: US20103
            grOption.UIGridID = ko.observable("BoardSubOrderProcessingGrid");

            // ###END: US20103
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
                columnName: "PRONumber",
                order: "desc"
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

            // ###START: DE20737
            grOption.enableSaveGridSettings = true;

            // ###END: DE20737
            grOption.useClientSideFilterAndSort = false;
            grOption.showColumnMenu = true;
            return grOption;
        };

        RequoteProcessBoardViewModel.prototype.setGridColumnDefinitions = function () {
            // ReSharper disable once AssignedValueIsNeverUsed
            var colDefinition = [];

            //## PRO Cell Template.
            var RightAlignCurrencyTemplate = '<div data-bind=" attr: { \'class\': \'kgCellText colt\' + $index() + \' text-right \', title: \'$ \' +$data.getProperty($parent).toFixed(2)}, html: \'$ \' + $data.getProperty($parent).toFixed(2), style: {\'background-color\': $parent.entity[\'IsManualProcess\'] ? \'yellow\' : $parent.entity[\'IsAutomateProcess\'] ? \'#a0ddf2 \': \'\' , \'height\': \'29px\',\'width\': \'100%\', \'padding-right\': \'2px\'}"></div>';

            var descriptionCellTemplate = '<a style="cursor: pointer" data-bind="text: \'Item Details\', click: function() { $userViewModel.onSalesOrderClick($parent.entity) }, style: {\'background-color\': $parent.entity[\'IsManualProcess\'] ? \'yellow\' : $parent.entity[\'IsAutomateProcess\'] ? \'#a0ddf2 \': \'\', \'height\': \'29px\',\'width\': \'100%\', \'padding-right\': \'2px\'}" />';
            var automateCheckboxTemplate = '<div class="kgCellText" data-bind="style: {\'background-color\': $parent.entity[\'IsManualProcess\'] ? \'yellow\' : $parent.entity[\'IsAutomateProcess\'] ? \'#a0ddf2 \': \'\', \'height\': \'29px\',\'width\': \'100%\', \'padding-right\': \'2px\'}"><input class="kgSelectionCheckbox" type="checkbox" data-bind="click: function() { $userViewModel.onGridColumnClick($parent.entity) }, checked: $parent.entity[\'IsAutomateProcess\']" ></div>';
            var manualcheckboxTemplate = '<div class="kgCellText" data-bind="style: {\'background-color\': $parent.entity[\'IsManualProcess\'] ? \'yellow\' : $parent.entity[\'IsAutomateProcess\'] ? \'#a0ddf2 \': \'\', \'height\': \'29px\',\'width\': \'100%\', \'padding-right\': \'2px\'}"><input class="kgSelectionCheckbox" type="checkbox" data-bind="click: function() { $userViewModel.onGridColumnClick2($parent.entity) }, checked: $parent.entity[\'IsManualProcess\']" ></div>';
            var generalTemplate = '<div type="text" data-bind="style: {\'background-color\': $parent.entity[\'IsManualProcess\'] ? \'yellow\' : $parent.entity[\'IsAutomateProcess\'] ? \'#a0ddf2 \': \'\' ,\'height\': \'29px\',\'width\': \'100%\', \'padding-right\': \'2px\'} , attr: { \'class\': \'kgCellText colt\' , title: $data.getProperty($parent)}, html: \'\' + $data.getProperty($parent)"></div>';

            colDefinition = [
                { field: 'BolNumber', displayName: 'BOL #', width: 120, cellTemplate: generalTemplate, type: _reportViewer.DataTypes.Numeric, sortable: false },
                { field: 'ProNo', displayName: 'PRO #', width: 120, cellTemplate: generalTemplate, type: _reportViewer.DataTypes.String, sortable: false },
                { field: 'ShipmentCost', displayName: 'SO Cost', width: 100, cellTemplate: RightAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric, sortable: false },
                { field: 'Revenue', displayName: 'SO Revenue', width: 125, cellTemplate: RightAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric, sortable: false },
                { field: 'VBCost', displayName: 'A bill cost', width: 125, cellTemplate: RightAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric, sortable: false },
                { field: 'TotalVBCost', displayName: 'Total VB Cost', width: 100, cellTemplate: RightAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric, sortable: false },
                { field: 'CostDifference', displayName: 'Cost Difference', width: 100, cellTemplate: RightAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric, sortable: false },
                { field: 'ShipmentModeDescription', displayName: 'Mode', width: 100, cellTemplate: generalTemplate, type: _reportViewer.DataTypes.String, sortable: false },
                { field: 'VBCarrierName', displayName: 'VB Carrier Name', width: 250, cellTemplate: generalTemplate, type: _reportViewer.DataTypes.String, sortable: false },
                // ###START: US20103
                { field: 'SalesRepName', displayName: 'Sales Agent', width: 150, cellTemplate: generalTemplate, type: _reportViewer.DataTypes.String, sortable: false },
                // ###END: US20103
                { field: 'Description', displayName: 'Description', width: 450, cellTemplate: generalTemplate, type: _reportViewer.DataTypes.String, sortable: false },
                { field: 'IsAutomateProcess', displayName: 'Automate Process', width: 90, isRemovable: false, cellTemplate: automateCheckboxTemplate, type: _reportViewer.DataTypes.Boolean, sortable: false },
                { field: 'IsManualProcess', displayName: 'Manual Process', width: 90, isRemovable: false, cellTemplate: manualcheckboxTemplate, type: _reportViewer.DataTypes.Boolean, sortable: false }
            ];

            return colDefinition;
        };

        RequoteProcessBoardViewModel.prototype.saveGridData = function () {
            var self = this;
            var filteredRows = $.grep(self.gridOptions.data(), function (item, i) {
                return (item.IsManualProcess || item.IsAutomateProcess || item.Id > 0);
            });

            if (filteredRows.length > 0) {
                var object = { RequoteProcessBoardList: filteredRows };
                self.listProgress(true);
                self.reportClient.saveSubOrderExecution(object, function (result) {
                    self.listProgress(false);
                    self.load();
                    //if (result > 0) {
                    //    //if (self.checkMsgDisplay) {
                    //    //    self.checkMsgDisplay = false;
                    //    //    var toastrOptions1 = {
                    //    //        toastrPositionClass: "toast-top-middle",
                    //    //        delayInseconds: 10,
                    //    //        fadeOut: 10,
                    //    //        typeOfAlert: "",
                    //    //        title: ""
                    //    //    }
                    //	//	//var customer = self.customerName() + ' - ID ' + self.customerId();
                    //    //    //Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.ForeignBolAddressSuccess, "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
                    //    //}
                    //}
                }, function (errorMessage) {
                    //if (self.checkMsgDisplay) {
                    //    self.checkMsgDisplay = false;
                    //    var toastrOptions1 = {
                    //        toastrPositionClass: "toast-top-middle",
                    //        delayInseconds: 10,
                    //        fadeOut: 10,
                    //        typeOfAlert: "",
                    //        title: ""
                    //    }
                    //		Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, errorMessage, "error", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
                    //}
                    //obj.canEdit(false);
                    //obj.isEditVisible(true);
                    //self.ForeignBolCustomerSettingsContainer.listProgress(false);
                    self.listProgress(false);
                });
            }
        };

        RequoteProcessBoardViewModel.prototype.showRevenueAdjustmentPopup = function (data) {
            var self = this;

            //var revenueAdjustitems = self.getItemsDetailsByResponseItems(data.SalesOrderContainer.SalesOrderItemDetails);
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
                title: 'Revenue Adjustment',
                bindingObject: data
            };

            //Call the dialog Box functionality to open a Popup
            _app.showDialog('board/RequoteSuborderItemPopup', optionControlArgs).then(function (object) {
                //data.SalesOrderContainer.SalesOrderItemDetails = self.getSalesOrderItemsDetails(object.originalRevenueModelList());
                //if (object.isSave()) {
                //    self.proceedToSoCreation(data);
                //}
                //else {
                //    self.ShowProgressBar(false);
                //    return false;
                //}
            });
        };

        RequoteProcessBoardViewModel.prototype.onClickAutomateSelectAll = function () {
            var self = this;
            ko.utils.arrayForEach(self.gridOptions.data(), function (item) {
                item.IsAutomateProcess = true;
                item.IsManualProcess = false;
            });
            self.gridOptions.data.valueHasMutated();
        };

        RequoteProcessBoardViewModel.prototype.onClickManualSelectAll = function () {
            var self = this;
            ko.utils.arrayForEach(self.gridOptions.data(), function (item) {
                item.IsManualProcess = true;
                item.IsAutomateProcess = false;
            });
            self.gridOptions.data.valueHasMutated();
        };

        RequoteProcessBoardViewModel.prototype.onClickUnSelectAll = function () {
            var self = this;
            ko.utils.arrayForEach(self.gridOptions.data(), function (item) {
                item.IsManualProcess = false;
                item.IsAutomateProcess = false;
            });
            self.gridOptions.data.valueHasMutated();
        };

        RequoteProcessBoardViewModel.prototype.onClickAutomateRow = function () {
            console.log("clicked");
        };

        RequoteProcessBoardViewModel.prototype.setPagingData = function (data, page, pageSize) {
            var self = this;

            //var lastIndex = data.lastIndexOf();
            var VendorBillId = LocalStorageController.Get('ReQuoteBoardBOLNumber');
            var indexes = $.map(data, function (obj, index) {
                if (obj.VendorBillId == VendorBillId) {
                    obj.IsLastSeen = true;
                    return index;
                }
            });
            self.gridOptions.data(data);
            self.gridOptions.data.valueHasMutated();
            self.gridOptions.pagingOptions.totalServerItems(page);
        };

        //#region Private Methods
        RequoteProcessBoardViewModel.prototype.reloadPage = function () {
            var self = this;
            self.listProgress(true);
            LocalStorageController.Set(self.localStorageKey(), undefined);
            LocalStorageController.Set(self.localStorageKey() + 'lastReloadDateTime', undefined);
            self.beforeBind();
        };

        //clearing all filter data
        RequoteProcessBoardViewModel.prototype.onClickClearAll = function () {
            var self = this;
            self.requoteBoardContainer.reportColumnFilter.clearAll();
            self.requoteBoardContainer.reportColumnFilter.applyFilter();
            self.isSearchFilterItemsData(false);
            //$('#reQuote').removeClass('margin-top--30');
        };

        //set Date Time for record of last refreshed
        RequoteProcessBoardViewModel.prototype.setDateTimeOfReload = function () {
            var self = this;
            if (LocalStorageController.Get(self.localStorageKey() + 'lastReloadDateTime')) {
                var localDateTimeOfReload = LocalStorageController.Get(self.localStorageKey() + 'lastReloadDateTime');
                self.currentDateTime(localDateTimeOfReload);
            } else {
                var onlyDate = self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy');
                var date = new Date();
                var str = 'Last Refreshed: ' + onlyDate + ' ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                LocalStorageController.Set(self.localStorageKey() + 'lastReloadDateTime', str);

                //var reloadDate = LocalStorageController.Get(self.vendorBillDetailsViewModel.proNumber() + 'lastReloadDateTime');
                self.currentDateTime(str);
            }
        };

        //#endregion
        //#region Life Cycle Event
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        RequoteProcessBoardViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        RequoteProcessBoardViewModel.prototype.activate = function () {
            return true;
        };

        RequoteProcessBoardViewModel.prototype.deactivate = function () {
            window.kg.selectedCarrier = undefined;
            var self = this;
            var scroll = $(document).scrollTop();
            var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems };

            // ###START: US20103
            var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.SubOrderProcessingBoard, IsFilterApplied: self.requoteBoardContainer.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), isLoaded: true, scrollPosition: scroll };

            // ###END: US20103
            LocalStorageController.Set(self.localStorageKey(), filterDataToSave);
        };

        RequoteProcessBoardViewModel.prototype.beforeBind = function () {
            var self = this;
            self.load();
        };

        RequoteProcessBoardViewModel.prototype.load = function () {
            var self = this;

            //server call on change page size and change page number
            var pageRecord = LocalStorageController.Get(self.localStorageKey());
            if (pageRecord != null) {
                $("html, body").animate({ scrollTop: pageRecord.scrollPosition }, "slow");

                //$("html").animate({ scrollTop: pageRecord.scrollPosition }, "slow");
                //$(window).scrollTop(pageRecord.scrollPosition);
                //$(document).scrollTop(pageRecord.scrollPosition);
                //window.scrollTo(0, pageRecord.scrollPosition);
                self.gridOptions.pagingOptions.currentPage(pageRecord.PageNo);
                self.gridOptions.pagingOptions.pageSize(pageRecord.UserGridSetting.PageSize);
                self.sortCol(pageRecord.SortCol);
                self.sorttype(pageRecord.SortOrder);
                var list = pageRecord.UserGridSetting.Filters;
                self.searchFilterItems.removeAll();
                if (list.length > 0 && list[0].FieldName) {
                    list.forEach(function (items) {
                        self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
                        if (items.FieldNamed === 'PickupDateDisplay') {
                            self.searchFilterItem.FieldName = "PickupDate";
                        } else if (items.FieldName === 'ReviewedDateDisplay') {
                            self.searchFilterItem.FieldName = "ReviewedDate";
                        } else if (items.FieldName === 'CostAdjustmentDisplay') {
                            self.searchFilterItem.FieldName = "CostAdjustment";
                        } else if (items.FieldName === 'ShipmentTypeDisplay') {
                            self.searchFilterItem.FieldName = "ShipmentMode";
                        } else if (items.FieldName === 'AgeingDateDisplay') {
                            self.searchFilterItem.FieldName = "AgeingDate";
                        } else if (items.FieldName === 'CustomerTypeName') {
                            self.searchFilterItem.FieldName = "CustomerTypeDisplay";
                        }
                        self.searchFilterItem.FieldName = items.FieldName;
                        self.searchFilterItem.Operand = items.Operand;
                        self.searchFilterItem.SearchText = items.SearchText;
                        self.searchFilterItems.push(self.searchFilterItem);
                    });
                    self.requoteBoardContainer.reportColumnFilter.addFilter(self.searchFilterItems);
                }

                if (typeof pageRecord.isLoaded !== "undefined") {
                    self.isLoaded(pageRecord.isLoaded);
                }
                self.fromLocalStorage(true);
            }

            self.getReportData(self.reportAction);
        };

        RequoteProcessBoardViewModel.prototype.compositionComplete = function () {
            var self = this;
            self.isLoaded(true);
            var self = this;

            var successCallBack = function (data) {
                var filterlist = data.Filters;
                self.gridOptions.pagingOptions.pageSize(data.PageSize);
                self.gridOptions.pagingOptions.currentPage(1);
                self.searchFilterItems.removeAll();
                if (filterlist.length > 0 && filterlist[0].FieldName != null) {
                    filterlist.forEach(function (items) {
                        self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
                        if (items.FieldNamed === 'PickupDateDisplay') {
                            self.searchFilterItem.FieldName = "PickupDate";
                        } else if (items.FieldName === 'ReviewedDateDisplay') {
                            self.searchFilterItem.FieldName = "ReviewedDate";
                        } else if (items.FieldName === 'CostAdjustmentDisplay') {
                            self.searchFilterItem.FieldName = "CostAdjustment";
                        } else if (items.FieldName === 'ShipmentTypeDisplay') {
                            self.searchFilterItem.FieldName = "ShipmentMode";
                        } else if (items.FieldName === 'CustomerTypeName') {
                            self.searchFilterItem.FieldName = "CustomerTypeDisplay";
                        }
                        self.searchFilterItem.FieldName = items.FieldName;
                        self.searchFilterItem.Operand = items.Operand;
                        self.searchFilterItem.SearchText = items.SearchText;
                        self.searchFilterItems.push(self.searchFilterItem);
                    });
                    self.requoteBoardContainer.reportColumnFilter.addFilter(self.searchFilterItems);
                    if (self.searchFilterItems.length > 0) {
                        self.isSearchFilterItemsData(true);
                        //$('#reQuote').addClass('margin-top--30');
                    } else {
                        self.isSearchFilterItemsData(false);
                        //$('#reQuote').removeClass('margin-top--30');
                    }
                }
                self.gridOptions.filterOptions.filterText('');
                self.isLoaded(true);
                self.fromLocalStorage(true);
            };

            if (!LocalStorageController.Get(self.localStorageKey())) {
                // ###START: US20103
                self.commonClientCommand.GetUserGridSettings(refEnums.Enums.FilterViewName.SubOrderProcessingBoard, successCallBack);
                // ###END: US20103
            } else {
                //using to show clear filter button after saving filtered data in local storage and switching between tab
                var filteredData = LocalStorageController.Get(self.localStorageKey());

                //window.scrollTo(0, filteredData.scrollPosition);
                //$(window).scrollTop(filteredData.scrollPosition);
                //$(document).scrollTop(filteredData.scrollPosition);
                $("html, body").animate({ scrollTop: filteredData.scrollPosition }, "slow");

                if (filteredData.UserGridSetting.Filters.length > 0) {
                    self.isSearchFilterItemsData(true);
                    //$('#reQuote').addClass('margin-top--30');
                } else {
                    self.isSearchFilterItemsData(false);
                    //$('#reQuote').removeClass('margin-top--30');
                }
            }
        };
        return RequoteProcessBoardViewModel;
    })();
    exports.RequoteProcessBoardViewModel = RequoteProcessBoardViewModel;
});
