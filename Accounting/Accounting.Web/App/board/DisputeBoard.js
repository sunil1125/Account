/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', '../templates/reportViewerControlV2', 'services/models/common/Enums', 'services/client/BoardsClient', 'services/validations/Validations', 'services/models/purchaseOrder/PurchaseOrderSearchFilter', 'services/client/VendorBillClient', 'services/client/CommonClient', 'services/models/vendorBill/VendorBill'], function(require, exports, ___router__, ___app__, __refSystem__, ___reportViewer__, __refEnums__, __refBoardsClient__, __refValidations__, ___refPurchaseOrderSearchFilterModel__, __refVendorBillClient__, __refCommonClient__, ___refpurchaseOrderModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    var _reportViewer = ___reportViewer__;
    var refEnums = __refEnums__;
    var refBoardsClient = __refBoardsClient__;
    
    var refValidations = __refValidations__;
    var _refPurchaseOrderSearchFilterModel = ___refPurchaseOrderSearchFilterModel__;
    var refVendorBillClient = __refVendorBillClient__;
    var refCommonClient = __refCommonClient__;
    var _refpurchaseOrderModel = ___refpurchaseOrderModel__;

    /***********************************************
    BOARD DISPUTE VIEWMODEL
    ************************************************
    ** <summary>
    ** Dispute Board View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US12941</id><by>Chadnan</by> <date>OCT/2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>DE20289</id> <by>Shreesha Adiga</by> <date>09-10-2015</date><description>Added validations to Date fields</description>
    ** <id>US20247</id> <by>Chandan Singh Bajetha</by> <date>07-01-2015</date><description>Acct: Filter Records in Dispute Board on 'Dispute Date'</description>
    ** <id>US21146</id> <by>Vasanthakumar</by> <date>15-03-2016</date> <description>Added NewDisputedDate fetching date for LateDisputeDate OVC</description>
    ** <id>US21601</id> <by>Janakiram</by> <date>07-04-2016</date> <description>Added Dispute State Column in Dispute Board Grid</description>
    ** <id>US21749</id> <by>Janakiram</by> <date>03-05-2016</date> <description>Added RebillReasons Column in Dispute Board Grid</description>
    ** <id>US21791</id> <by>Shreesha Adiga</by> <date>28-04-2016</date> <description>Added Dispute Age to the Board</description>
    ** <id>US22708</id> <by>Baldev Singh Thakur</by> <date>10-06-2016</date> <description>Added this model to display the CarrierResponse on to the Dispute Board.</description>
    ** <id>US22708</id> <by>Vasanthakumar</by> <date>13-06-2016</date> <description>Add Carrier response column in dispute board</description>
    ** <id>US22470</id> <by>Dhaval Tamhane</by> <date>18-07-2016</date> <description>Tariff Start Date and Tariff Number related changes</description>
    ** <id>6392</id> <by>Shreesha Adiga</by> <date>19-11-2018</date> <description>Added DisputeDocuments column to the grid</description>
    ** </changeHistory >
    
    ***********************************************/
    var DisputeBoardViewModel = (function () {
        //#endregion Public report viewer members
        //#endregion Properties
        //#region Constructer
        function DisputeBoardViewModel() {
            //#region Properties
            this.startDateForDisputeIterm = ko.observable('');
            this.endDateForDisputeIterm = ko.observable('');
            this.commonUtils = new Utils.Common();
            this.boardClient = new refBoardsClient.BoardsClientCommands();
            this.reportClient = null;
            this.listProgress = ko.observable(false);
            this.currentDateTime = ko.observable('');
            //#region Public report viewer members
            this.disputeBoardReportContainer = null;
            this.headerOptions = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.FromDate = ko.observable(new Date());
            this.ToDate = ko.observable(new Date());
            this.modeType = ko.observable();
            this.boardReportRequest = null;
            this.sortCol = ko.observable('');
            this.sorttype = ko.observable('');
            this.searchFilterItems = new Array();
            this.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
            this.localStorageKey = ko.observable('');
            this.commonClientCommand = new refCommonClient.Common();
            this.isLoaded = ko.observable(false);
            this.fromLocalStorage = ko.observable(false);
            this.isSearchFilterItemsData = ko.observable(false);
            var self = this;

            //To initialize the dates and from date should be 90 days less than today date
            var fromdate = new Date();
            var x = 90;
            var newFromDate = fromdate.setDate(fromdate.getDate() - x);
            self.startDateForDisputeIterm(self.commonUtils.formatDate(newFromDate, 'mm/dd/yyyy'));
            self.endDateForDisputeIterm(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
            self.headerOptions = new _reportViewer.ReportHeaderOption();
            self.headerOptions.reportHeader = " ";
            self.headerOptions.reportName = "Dispute Board Details Report";
            self.headerOptions.gridTitleHeader = " ";
            self.searchText = ko.observable("");
            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);
            self.reportClient = new refBoardsClient.BoardsClientCommands();

            //##region Export Options.
            var exportOpt = ko.observableArray([
                { exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
                { exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) },
                { exportType: _reportViewer.ExportOptions.FILTER, name: ko.observable(""), enabled: ko.observable(true) }
            ]);

            self.headerOptions.reportExportOptions = new _reportViewer.ReportExportControl(exportOpt);
            self.headerOptions.reportExportOptions.getUrl = function (exp) {
                var searchClient = new refVendorBillClient.SearchModel();
                searchClient.SearchValue = self.searchText().trim();
                searchClient.SortOrder = self.sorttype();
                searchClient.SortCol = self.sortCol();
                searchClient.PageNumber = 1;
                searchClient.PageSize = exp.exportType === 1 ? 2000 : self.gridOptions.pagingOptions.totalServerItems();

                self.searchFilterItems.forEach(function (item) {
                    if (item.FieldName === 'PickupDateDisplay') {
                        item.FieldName = "PickupDate";
                    } else if (item.FieldName === 'BillDateDisplay') {
                        item.FieldName = 'BillDate';
                    } else if (item.FieldName === 'DisputeDateDisplay') {
                        item.FieldName = 'DisputedDate';
                    } else if (item.FieldName === 'NewDisputeDateDisplay') {
                        item.FieldName = 'NewDisputedDate';
                    } else if (item.FieldName === 'TariffStartDateDisplay') {
                        item.FieldName = 'TariffStartDate';
                    } else if (item.FieldName === 'DeliveryDateDisplay') {
                        item.FieldName = 'DeliveryDate';
                    } else if (item.FieldName === 'ShipmentDateDisplay') {
                        item.FieldName = 'ShipmentDate';
                    } else if (item.FieldName === 'BillStatusDisplay') {
                        item.FieldName = 'BillStatusDescription';
                    } else if (item.FieldName === 'CustomerTypeName') {
                        item.FieldName = 'CustomerTypeDisplay';
                    } else {
                    }
                });

                searchClient.SearchFilterItems = self.searchFilterItems;
                searchClient.GridViewId = 0;
                searchClient.VendorName = '';
                searchClient.ProNumber = '';
                searchClient.FromDate = self.FromDate();
                searchClient.ToDate = self.ToDate();
                searchClient.ExportType = exp.exportType;
                var filterModel = { ExportURL: "Accounting/ExportDisputeBoardDataInExcelWithFilter", FilterModel: searchClient };
                return filterModel;
            };

            //## Region Export Options End.
            //To set The date picker options
            self.datepickerOptions = {
                blockWeekend: true,
                blockPreviousDays: false,
                blockHolidaysDays: true,
                autoClose: true,
                placeBelowButton: false
            };

            //#endregion
            // ###START: DE20289
            //#region DATE VALIDATIONS
            self.startDateForDisputeIterm.extend({
                validation: {
                    validator: function () {
                        if (!refValidations.Validations.isValidDate(self.startDateForDisputeIterm(), self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "BillDate"))
                            return false;
                        if (self.startDateForDisputeIterm() !== "" || self.startDateForDisputeIterm() !== undefined) {
                            if ((new Date(self.startDateForDisputeIterm())) > new Date(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy')))
                                return false;
else
                                return true;
                        } else {
                            return true;
                        }
                    },
                    message: 'Not a valid date'
                }
            });

            self.endDateForDisputeIterm.extend({
                validation: {
                    validator: function () {
                        if (!refValidations.Validations.isValidDate(self.endDateForDisputeIterm(), self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "BillDate"))
                            return false;

                        if (new Date(self.endDateForDisputeIterm()) > (new Date(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy')))) {
                            return false;
                        } else if (self.endDateForDisputeIterm() !== undefined && self.startDateForDisputeIterm() !== "") {
                            if (new Date(self.startDateForDisputeIterm()) > new Date(self.endDateForDisputeIterm()))
                                return false;
else
                                return true;
                            //To Pickup date should not be grater then today date
                        } else if (new Date(self.endDateForDisputeIterm()) > (new Date(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy')))) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    message: 'Not a valid date'
                }
            });

            self.errorDates = ko.validatedObservable({
                fromDate: self.startDateForDisputeIterm,
                toDate: self.endDateForDisputeIterm
            });

            //#endregion
            // ###END: DE20289
            //set local storage key by url
            var url = $(location).attr('href');
            var urlArray = url.split('/');
            var localStorageId = urlArray.pop().toString().replace(/#/g, "");
            self.localStorageKey(localStorageId);
            if (localStorageId === "Dispute") {
                self.localStorageKey(localStorageId + "28");
            } else {
                self.localStorageKey(localStorageId);
            }

            self.setReportCriteria = function (reportActionObj) {
                if ((reportActionObj != undefined || reportActionObj != null) && (reportActionObj.gridOptions != undefined || reportActionObj.gridOptions != null) && (refSystem.isObject(reportActionObj.gridOptions.sortInfo())) && (reportActionObj.gridOptions.sortInfo().column != undefined || reportActionObj.gridOptions.sortInfo().column != null) && (reportActionObj.gridOptions.sortInfo().column.field != undefined || reportActionObj.gridOptions.sortInfo().column.field != null)) {
                    if (reportActionObj.gridOptions.sortInfo().column.field === 'BillDateDisplay') {
                        self.sortCol("BillDate");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'DeliveryDateDisplay') {
                        self.sortCol("DeliveryDate");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'CustomerTypeName') {
                        self.sortCol("CustomerTypeDisplay");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'PickupDateDisplay') {
                        self.sortCol("PickupDate");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'BillStatusDisplay') {
                        self.sortCol("BillStatusDescription");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'ShipmentDateDisplay') {
                        self.sortCol("ShipmentDate");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'DisputeDateDisplay') {
                        self.sortCol("DisputedDate");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'NewDisputeDateDisplay') {
                        self.sortCol("NewDisputedDate");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'TariffStartDateDisplay') {
                        self.sortCol("TariffStartDate");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'AgingDays') {
                        self.sortCol("NewDisputedDate");
                    } else if (reportActionObj.gridOptions.sortInfo().column.field === 'DisputeDocuments') {
                        self.sortCol("DisputedDate");
                    } else {
                        self.sortCol(reportActionObj.gridOptions.sortInfo().column.field);
                    }
                    self.sorttype(reportActionObj.gridOptions.sortInfo().direction);
                } else {
                    // ###START: US20247
                    //// ###START: US21146
                    self.sortCol("NewDisputedDate");

                    //// ###END: US21146
                    self.sorttype("asc");
                    // ###END: US20247
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

                    self.disputeBoardReportContainer.listProgress(false);
                    self.disputeBoardReportContainer.selectedFilter1Item(self.modeType());
                } else {
                    self.gridOptions = reportActionObj.gridOptions;

                    if (self.modeType() != reportActionObj.filter1selectedItemId) {
                        self.modeType(reportActionObj.filter1selectedItemId);
                        self.disputeBoardReportContainer.columnDefinition(self.setGridColumnDefinitions());
                    }

                    self.reportAction = reportActionObj;
                    if (self.disputeBoardReportContainer.reportColumnFilter.isFilterApply || self.disputeBoardReportContainer.isPaginationChanged || self.disputeBoardReportContainer.isSortingChanged) {
                        if (self.isLoaded()) {
                            self.getReportData(self.reportAction);
                            self.disputeBoardReportContainer.isPaginationChanged = false;
                            self.disputeBoardReportContainer.isSortingChanged = false;
                        }
                    }
                }
            };

            self.getReportData = function (reportActionObj) {
                if (self.validateDatePicker()) {
                    return false;
                }

                // ###END: DE20289
                var deferred = $.Deferred();
                var promise = deferred.promise();

                // ReSharper disable once AssignedValueIsNeverUsed
                var pageno = 0;
                pageno = Number(self.gridOptions.pagingOptions.currentPage());
                if (pageno > 0) {
                    // List View
                    self.disputeBoardReportContainer.listProgress(true);

                    if (self.startDateForDisputeIterm() !== null && self.startDateForDisputeIterm() !== "") {
                        self.FromDate(self.startDateForDisputeIterm());
                    } else {
                        self.FromDate(new Date());
                    }
                    if (self.endDateForDisputeIterm() !== null && self.endDateForDisputeIterm() !== "") {
                        self.ToDate(self.endDateForDisputeIterm());
                    } else {
                        self.ToDate(new Date());
                    }
                    if (self.disputeBoardReportContainer.reportColumnFilter.isFilterApply) {
                        self.searchText('');
                        self.gridOptions.filterOptions.filterText('');
                    }
                    var list = self.disputeBoardReportContainer.reportColumnFilter.reportColumnFilters();
                    self.searchFilterItems.removeAll();
                    if (list.length > 0) {
                        list.forEach(function (items) {
                            self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
                            if (items.selectedserviceType() != undefined && items.selectedOperatorType() != undefined) {
                                if (items.selectedserviceType().field === 'BillDateDisplay') {
                                    self.searchFilterItem.FieldName = "BillDate";
                                } else if (items.selectedserviceType().field === 'DeliveryDateDisplay') {
                                    self.searchFilterItem.FieldName = "DeliveryDate";
                                } else if (items.selectedserviceType().field === 'BillStatusDisplay') {
                                    self.searchFilterItem.FieldName = "BillStatusDescription";
                                } else if (items.selectedserviceType().field === 'PickupDateDisplay') {
                                    self.searchFilterItem.FieldName = "PickupDate";
                                } else if (items.selectedserviceType().field === 'ShipmentDateDisplay') {
                                    self.searchFilterItem.FieldName = "ShipmentDate";
                                } else if (items.selectedserviceType().field === 'DisputeDateDisplay') {
                                    self.searchFilterItem.FieldName = "DisputedDate";
                                } else if (items.selectedserviceType().field === 'NewDisputeDateDisplay') {
                                    self.searchFilterItem.FieldName = "NewDisputedDate";
                                } else if (items.selectedserviceType().field === 'TariffStartDateDisplay') {
                                    self.searchFilterItem.FieldName = "TariffStartDate";
                                } else if (items.selectedserviceType().field === 'CustomerTypeName') {
                                    self.searchFilterItem.FieldName = "CustomerTypeDisplay";
                                } else {
                                    self.searchFilterItem.FieldName = items.selectedserviceType().field;
                                }

                                self.searchFilterItem.Operand = +items.selectedOperatorType().opratorId;
                                self.searchFilterItem.SearchText = items.searchText();
                                self.searchFilterItems.push(self.searchFilterItem);
                            }
                            if (self.searchFilterItems.length > 0 || items.selectedserviceType() != undefined) {
                                self.isSearchFilterItemsData(true);
                            } else {
                                self.isSearchFilterItemsData(false);
                            }
                        });
                    }
                    self.disputeBoardReportContainer.listProgress(true);
                    var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems };
                    var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.DisputeBoard, IsFilterApplied: self.disputeBoardReportContainer.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), FromDate: self.FromDate(), ToDate: self.ToDate(), FromLocalStorage: self.fromLocalStorage() };
                    self.reportClient.getDisputeBillBoardDetails(filterDataToSave, function (data) {
                        self.disputeBoardReportContainer.listProgress(false);
                        self.setPagingData(data.VendorBillOrPurchaseOrderResponse, data.NumberOfRows, self.gridOptions.pagingOptions.pageSize());
                        deferred.resolve(data, reportActionObj.view);
                    }, function () {
                        self.disputeBoardReportContainer.listProgress(false);
                    }, self.gridOptions.pagingOptions);

                    //to block unwanted server calls
                    self.disputeBoardReportContainer.isPaginationChanged = false;
                    self.disputeBoardReportContainer.isSortingChanged = false;
                }

                return promise;
            };

            self.disputeBoardReportContainer = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
            self.disputeBoardReportContainer.onFilterChange = self.setReportCriteria;
            self.disputeBoardReportContainer.ForceChange();

            // To open vendor Bill
            self.disputeBoardReportContainer.onProNumberClick = function (shipmentObj) {
                var vendorBillId = shipmentObj.VendorBillId;

                if (shipmentObj.CarrierResponse == "Yes" && shipmentObj.IsCarrierResponseRead == false) {
                    self.updateSONotesStatus(shipmentObj.BOLNumber, shipmentObj.VendorBillId);
                }

                // ###END: US22708
                _app.trigger("openVendorBill", vendorBillId, shipmentObj.PRONo, function (callback) {
                    if (!callback) {
                        return;
                    }
                });
            };

            // TO open sales Order
            self.disputeBoardReportContainer.onBolNumberClick = function (shipmentObj) {
                var salesOrderId = shipmentObj.SalesOrderId;

                if (shipmentObj.CarrierResponse == "Yes" && shipmentObj.IsCarrierResponseRead == false) {
                    self.updateSONotesStatus(shipmentObj.BOLNumber, shipmentObj.VendorBillId);
                }

                // ###END: US22708
                _app.trigger("openSalesOrder", salesOrderId, shipmentObj.BOLNumber, function (callback) {
                    if (!callback) {
                        return;
                    }
                });
            };

            self.disputeBoardReportContainer.onGridColumnClick = function (doc) {
                if (doc.DocumentPath)
                    window.open(Utils.Constants.ApplicationBaseURL + 'DocumentViewer/DownloadFileFromDocumentManagement?fileLocationURL=' + doc.DocumentPath);
            };
        }
        //#region Private Methods
        DisputeBoardViewModel.prototype.reloadPage = function () {
            var self = this;
            self.listProgress(true);
            LocalStorageController.Set(self.localStorageKey(), undefined);
            LocalStorageController.Set(self.localStorageKey() + 'lastReloadDateTime', undefined);
            self.beforeBind();
        };

        /// Update the SO Carrier Response read flag
        /// <createDetails>
        /// <id>US22708</id> <by>Vasanthakumar</by> <date>13-06-2016</date>
        /// </createDetails>
        DisputeBoardViewModel.prototype.updateSONotesStatus = function (bolNumber, vendorBillId) {
            var self = this;
            var vendorbill = new _refpurchaseOrderModel.Models.VendorBill();
            vendorbill.VendorBillId = vendorBillId;
            vendorbill.BolNumber = bolNumber;
            self.reportClient.UpdateCarrierNotesTypeStatus(vendorbill, function (message) {
            }, function (message) {
            });
        };

        //clearing all filter data
        DisputeBoardViewModel.prototype.onClickClearAll = function () {
            var self = this;
            self.disputeBoardReportContainer.reportColumnFilter.clearAll();
            self.disputeBoardReportContainer.reportColumnFilter.applyFilter();
            self.isSearchFilterItemsData(false);
        };

        //set Date Time for record of last refreshed
        DisputeBoardViewModel.prototype.setDateTimeOfReload = function () {
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

        DisputeBoardViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("DisputeBoardDetailsGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;

            // ###START: US20247
            grOption.sortedColumn = {
                //// ###START: US21146
                columnName: "NewDisputedDate",
                //// ###END: US21146
                order: "asc"
            };

            // ###END: US20247
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
            grOption.enableSaveGridSettings = true;
            grOption.useClientSideFilterAndSort = false;
            grOption.showColumnMenu = true;
            return grOption;
        };

        DisputeBoardViewModel.prototype.setGridColumnDefinitions = function () {
            // ReSharper disable once AssignedValueIsNeverUsed
            var colDefinition = [];

            //## PRO Cell Template.
            var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'PRONo\'], click: function() { $userViewModel.onProNumberClick($parent.entity) }, attr:{ title: $data.getProperty($parent)}" />';

            //// ###START: US22708
            var bolCellTemplate = '<div><a style="cursor: pointer" data-bind="click: function() { $userViewModel.onBolNumberClick($parent.entity) }, attr:{ title: $data.getProperty($parent)}"><span data-bind="text: $parent.entity[\'BOLNumber\']"></span>&nbsp;<i class="fa fa-exclamation-circle" style="color:red" data-bind="visible:!$parent.entity[\'IsCarrierResponseRead\']"></i></a></div>';

            //// ###END: US22708
            var documentCellTemplate = '<div style="text-overflow: ellipsis;font-size:16px;white-space: nowrap;overflow: hidden;" data-bind="foreach: $parent.entity[\'DisputeDocuments\']"><a style="cursor: pointer; display: inline-block;" data-bind="text: Description, click: function() { $userViewModel.onGridColumnClick($data) }" /></div>';

            colDefinition = [
                { field: 'PRONo', displayName: 'PRO #', width: 105, cellTemplate: proCellTemplate, type: _reportViewer.DataTypes.String },
                { field: 'BOLNumber', displayName: 'BOL #', width: 85, cellTemplate: bolCellTemplate, type: _reportViewer.DataTypes.String },
                // ##START: US21791
                { field: 'AgingDays', displayName: 'Dispute Age In Days', width: 80, cellTemplate: refEnums.Enums.GridCellFormatTemplates.CenterAlignTemplate, type: _reportViewer.DataTypes.Numeric },
                // ##END: US21791
                { field: 'PickupDateDisplay', displayName: 'Pickup Date', width: 95, visible: false, type: _reportViewer.DataTypes.DateTime },
                // ###START: US20247
                // ###START: US21146
                { field: 'NewDisputeDateDisplay', displayName: 'Dispute Date', width: 80, type: _reportViewer.DataTypes.DateTime },
                // ###END: US21146
                // ###END: US20247
                //// ###START: US21749
                { field: 'RebillReasons', displayName: 'Rebill Reasons', width: 100, type: _reportViewer.DataTypes.String },
                //// ###START: US21749
                //// ###START: US22470
                { field: 'TariffStartDateDisplay', displayName: 'Tariff Start Date', width: 100, type: _reportViewer.DataTypes.DateTime },
                { field: 'TariffNumber', displayName: 'Tariff #', width: 150, type: _reportViewer.DataTypes.String },
                //// ###END: US22470
                { field: 'ReferenceNo', displayName: 'Reference', width: 95, type: _reportViewer.DataTypes.String },
                { field: 'CustomerName', displayName: 'Customer Name', width: 155, type: _reportViewer.DataTypes.String },
                { field: 'CarrierName', displayName: 'Carrier', width: 260, type: _reportViewer.DataTypes.String },
                { field: 'SalesRepName', displayName: 'Sales Agent', width: 210, type: _reportViewer.DataTypes.String },
                { field: 'DisputedAmount', displayName: 'Dispute Amount', width: 80, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate, type: _reportViewer.DataTypes.Numeric },
                { field: 'BillStatusDisplay', displayName: 'Bill Status', width: 75, type: _reportViewer.DataTypes.String },
                // ###START: US21601
                { field: 'DisputeState', displayName: 'Dispute State', width: 120, type: _reportViewer.DataTypes.String },
                // ###END: US21601
                { field: 'DisputeNote', displayName: 'Dispute Note', width: 100, type: _reportViewer.DataTypes.String },
                // ###START: US22708
                { field: 'CarrierResponse', displayName: 'Carrier Response', width: 100, type: _reportViewer.DataTypes.String },
                // ###END: US22708
                { field: 'ReviewedBy', displayName: 'Dispute Agent', width: 100, type: _reportViewer.DataTypes.String },
                { field: 'ShipmentMode', displayName: 'Mode', width: 85, type: _reportViewer.DataTypes.String },
                { field: 'BillDateDisplay', displayName: 'Bill Date', width: 60, visible: false, type: _reportViewer.DataTypes.DateTime },
                { field: 'ShipmentDateDisplay', displayName: 'Shipment Date', width: 90, visible: false, type: _reportViewer.DataTypes.DateTime },
                { field: 'Amount', displayName: 'Actual Cost', width: 70, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate, visible: false, type: _reportViewer.DataTypes.Numeric },
                { field: 'CustomerTypeName', displayName: 'Customer Type', width: 100, visible: false, type: _reportViewer.DataTypes.String },
                { field: 'DisputeDocuments', displayName: 'Dispute Documents', width: 240, cellTemplate: documentCellTemplate, type: _reportViewer.DataTypes.String, dntApplyFilter: true }
            ];

            return colDefinition;
        };

        DisputeBoardViewModel.prototype.setPagingData = function (data, page, pageSize) {
            var self = this;

            data.forEach(function (dispute) {
                if (dispute.DisputeDocuments) {
                    var packingSlip = dispute.DisputeDocuments.filter(function (doc) {
                        return doc.DocumentType == 6;
                    }).map(function (doc, index) {
                        doc.Description = "Packing Slip " + (index + 1);
                        return doc;
                    });
                    var specSheet = dispute.DisputeDocuments.filter(function (doc) {
                        return doc.DocumentType == 7;
                    }).map(function (doc, index) {
                        doc.Description = "Spec Sheet " + (index + 1);
                        return doc;
                    });

                    dispute.DisputeDocuments = packingSlip.concat(specSheet);
                }
            });

            self.gridOptions.data(data);
            self.gridOptions.data.valueHasMutated();
            self.gridOptions.pagingOptions.totalServerItems(page);
        };

        //#endregion
        //#region Internal Public methods
        DisputeBoardViewModel.prototype.onSubmit = function () {
            var self = this;

            // Call For Dispute Board
            self.getReportData(self.reportAction);
        };

        //#endregion Public Methods
        //#region Private Methods
        //#region if user any numeric  date  without any format
        DisputeBoardViewModel.prototype.convertToStartDate = function () {
            var self = this;
            if (!self.startDateForDisputeIterm().match('/') && self.startDateForDisputeIterm().length > 0) {
                self.startDateForDisputeIterm(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.startDateForDisputeIterm()));
            }
        };

        DisputeBoardViewModel.prototype.convertToEndDate = function () {
            var self = this;
            if (self.endDateForDisputeIterm() !== undefined) {
                if (!self.endDateForDisputeIterm().match('/') && self.endDateForDisputeIterm().length > 0) {
                    self.endDateForDisputeIterm(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.endDateForDisputeIterm()));
                }
            }
        };

        // ###START: DE20289
        //Validating Dates
        DisputeBoardViewModel.prototype.validateDatePicker = function () {
            var self = this;
            if (self.errorDates.errors().length != 0) {
                self.errorDates.errors.showAllMessages();
                return true;
            } else {
                return false;
            }
        };

        // ###END: DE20289
        //#endregion
        DisputeBoardViewModel.prototype.load = function () {
            var self = this;

            //server call on change page size and change page number
            var pageRecord = LocalStorageController.Get(self.localStorageKey());
            if (pageRecord != null) {
                self.gridOptions.pagingOptions.currentPage(pageRecord.PageNo);
                self.gridOptions.pagingOptions.pageSize(pageRecord.UserGridSetting.PageSize);
                self.sortCol(pageRecord.SortCol);
                self.sorttype(pageRecord.SortOrder);
                var list = pageRecord.UserGridSetting.Filters;
                self.searchFilterItems.removeAll();
                if (list.length > 0 && list[0].FieldName) {
                    list.forEach(function (items) {
                        self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
                        self.searchFilterItem.FieldName = items.FieldName;
                        self.searchFilterItem.Operand = items.Operand;
                        self.searchFilterItem.SearchText = items.SearchText;
                        self.searchFilterItems.push(self.searchFilterItem);
                    });
                    self.disputeBoardReportContainer.reportColumnFilter.addFilter(self.searchFilterItems);
                }

                if (typeof pageRecord.isLoaded !== "undefined") {
                    self.isLoaded(pageRecord.isLoaded);
                }
                self.gridOptions.filterOptions.filterText(pageRecord.GridSearchText);
                self.searchText(pageRecord.GridSearchText);
                self.startDateForDisputeIterm(pageRecord.startDate);
                self.endDateForDisputeIterm(pageRecord.endDate);
                self.fromLocalStorage(true);
            }
            self.getReportData(self.reportAction);

            //to block unwanted server calls
            self.disputeBoardReportContainer.isPaginationChanged = false;
            self.disputeBoardReportContainer.isSortingChanged = false;
        };

        //#endregion Private Methods
        //#region Life Cycle Event
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        DisputeBoardViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        DisputeBoardViewModel.prototype.activate = function () {
            return true;
        };

        DisputeBoardViewModel.prototype.deactivate = function () {
            var self = this;
            var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems };
            var filterDataToSave = {
                UserGridSetting: saveData,
                GridViewId: refEnums.Enums.FilterViewName.DisputeBoard,
                IsFilterApplied: self.disputeBoardReportContainer.reportColumnFilter.isFilterApply,
                GridSearchText: self.searchText(),
                PageNo: self.gridOptions.pagingOptions.currentPage(),
                SortCol: self.sortCol(),
                SortOrder: self.sorttype(),
                isLoaded: true,
                startDate: self.startDateForDisputeIterm(),
                endDate: self.endDateForDisputeIterm()
            };
            LocalStorageController.Set(self.localStorageKey(), filterDataToSave);

            self.cleanup();
        };

        DisputeBoardViewModel.prototype.beforeBind = function () {
            var self = this;
            self.load();
        };

        DisputeBoardViewModel.prototype.compositionComplete = function () {
            var self = this;
            var successCallBack = function (data) {
                self.searchText('');
                var filterlist = data.Filters;
                self.gridOptions.pagingOptions.pageSize(data.PageSize);
                self.gridOptions.pagingOptions.currentPage(1);
                self.searchFilterItems.removeAll();
                if (filterlist.length > 0 && filterlist[0].FieldName != null) {
                    filterlist.forEach(function (items) {
                        self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
                        self.searchFilterItem.FieldName = items.FieldName;
                        self.searchFilterItem.Operand = items.Operand;
                        self.searchFilterItem.SearchText = items.SearchText;
                        self.searchFilterItems.push(self.searchFilterItem);
                    });
                    self.disputeBoardReportContainer.reportColumnFilter.addFilter(self.searchFilterItems);
                    if (self.searchFilterItems.length > 0) {
                        self.isSearchFilterItemsData(true);
                    } else {
                        self.isSearchFilterItemsData(false);
                    }
                }
                self.gridOptions.filterOptions.filterText('');
                self.searchText('');
                self.isLoaded(true);
                self.fromLocalStorage(true);
            };

            if (!LocalStorageController.Get(self.localStorageKey())) {
                self.commonClientCommand.GetUserGridSettings(refEnums.Enums.FilterViewName.DisputeBoard, successCallBack);
            } else {
                //using to show clear filter button after saving filtered data in local storage and switching between tab
                var filteredData = LocalStorageController.Get(self.localStorageKey());
                if (filteredData.UserGridSetting.Filters.length > 0) {
                    self.isSearchFilterItemsData(true);
                } else {
                    self.isSearchFilterItemsData(false);
                }
            }

            //#endregion
            //to block unwanted server calls
            self.disputeBoardReportContainer.isPaginationChanged = false;
            self.disputeBoardReportContainer.isSortingChanged = false;
        };

        DisputeBoardViewModel.prototype.cleanup = function () {
            var self = this;

            self.disputeBoardReportContainer.cleanup("DisputeBoardDetailsGrid");

            for (var prop in self) {
                if (prop !== "cleanup")
                    delete self[prop];
            }
            delete self;
        };
        return DisputeBoardViewModel;
    })();

    // Model which is used to send the search values
    var SearchModel = (function () {
        function SearchModel(searchValue, pageNumber, pageSize) {
            this.SearchValue = searchValue;
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
        }
        return SearchModel;
    })();

    return DisputeBoardViewModel;
});
