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
/// <reference path="../services/models/TypeDefs/PurchaseOrderModel.d.ts" />
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'services/models/common/Enums', '../templates/reportViewerControlV2', 'services/validations/Validations', 'purchaseOrder/PurchaseOrderPOPpossibilityFindResult', 'services/client/PurchaseOrderClient', 'services/models/purchaseOrder/POPossibilitySaveParameter', 'services/models/transactionSearch/TransactionSearchRequest'], function(require, exports, ___router__, ___app__, __refSystem__, __refEnums__, ___reportViewer__, __refValidations__, __refPOPpssibilityFindResult__, __refpurchaseOrderClient__, __refPOPossibilitySaveModel__, __refSearchModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    var refEnums = __refEnums__;
    var _reportViewer = ___reportViewer__;
    
    var refValidations = __refValidations__;
    var refPOPpssibilityFindResult = __refPOPpssibilityFindResult__;
    var refpurchaseOrderClient = __refpurchaseOrderClient__;
    
    var refPOPossibilitySaveModel = __refPOPossibilitySaveModel__;
    
    
    var refSearchModel = __refSearchModel__;

    //import refVendorNameSearch = require('services/models/common/searchVendorName');
    //#endregion
    /**
    ** <summary>
    * * Purchase Order PO Possibility  View Model.
    * * < / summary >
    * * <createDetails>
    * * <by>Achal Rastogi</by > <date>17th July, 2014 </date >
    * * < / createDetails>
    **< Modify By>
    * * <by>Bhanu pratap</by > <date>4th Aug, 2014 </date >
    **< /Modify By>
    ** <changeHistory>}
    ** <id>DE20680</id> <by>Chandan Singh</by> <date>24/11/2015</date>
    ** </changeHistory>
    **/
    var PurchaseOrderPoPossibilityViewModel = (function () {
        //#endregion
        //#region Internal public Methods
        function PurchaseOrderPoPossibilityViewModel(forceAttachCallBack) {
            var _this = this;
            //#region Members
            //## Holds PRO #
            this.proNumber = ko.observable('').extend({ minLength: { message: "Minimum 3 characters required.", params: 3 } });
            //## Holds PRO #
            this.vendorName = ko.observable('').extend({ minLength: { message: "Minimum 3 characters required.", params: 3 } });
            //## Holds BOL #
            this.bolNumber = ko.observable('');
            ////## Holds Bill Date
            //billDate: KnockoutObservable<any> = ko.observable('').extend({ required: { message: " A valid Bill Date is required" } });
            //## Holds PO #
            this.poNumber = ko.observable('');
            ////## Holds EDI BOL #
            //mainBolNumber: KnockoutObservable<string> = ko.observable('');
            //Enable save button On ForceAttach
            this.isEnableOnForceAttach = ko.observable(false);
            //## Holds Reference #
            this.refNumber = ko.observable('');
            //## Holds Pickup Date or To Date
            this.fromPickupDate = ko.observable('');
            this.toPickupDate = ko.observable('');
            //## Holds Origin Zip
            this.originZip = ko.observable('');
            //## Holds Destination Zip
            this.destinationZip = ko.observable('');
            //For Grid
            this.isDefaultResult = ko.observable(true);
            this.VendorBilId = ko.observable(0);
            //vendorName: KnockoutComputed<string>;
            this.errorWidth = ko.observable('230px');
            this.normalWidth = ko.observable('250px');
            this.reportContainer = null;
            this.findMoreResultReportContainer = null;
            this.header = null;
            this.findMoreResultHeader = null;
            this.grid = null;
            this.findMoreResultGrid = null;
            this.reportAction = null;
            this.findMoreResultReportAction = null;
            this.reportData = null;
            this.findMoreResultReportData = null;
            this.modeType = ko.observable();
            this.purchaseOrderClient = new refpurchaseOrderClient.PurchaseOrderClient();
            this.commonUtils = new Utils.Common();
            //searchRequestParam: IPoPossibilityFindMoreRequest = new refPOPossibilityFindMoreRequest.Models.PoPossibilityFindMoreRequest();
            this.sortCol = ko.observable('ProNumber');
            this.sorttype = ko.observable('asc');
            //Search Filter
            this.poPossibilitySearchFilterItems = new Array();
            this.localStorageKey = ko.observable('');
            this.searchRequestParam = new refSearchModel.Model.TransactionSearchRequest();
            var self = this;
            self.forceAttachChanged = forceAttachCallBack;
            self.POPPossibilityFindResultViewModel = new refPOPpssibilityFindResult.PurchaseOrderPOPpossibilityFindResultViewModel();

            //#region Validations
            self.toPickupDate = ko.observable().extend({
                validation: {
                    validator: function () {
                        if (new Date(self.toPickupDate()) > (new Date(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy')))) {
                            return false;
                        } else if (self.toPickupDate() !== undefined && self.fromPickupDate() !== "") {
                            if (new Date(self.fromPickupDate()) > new Date(self.toPickupDate()))
                                return false;
else
                                return true;
                            //To Pickup date should not be grater then today date
                        } else if (new Date(self.toPickupDate()) > (new Date(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy')))) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                    message: ApplicationMessages.Messages.ToValidPickUpDateNotLessThenFromDate
                }
            });

            //From PickUp Date should not be greater then today date
            self.fromPickupDate = ko.observable().extend({
                validation: {
                    validator: function () {
                        if (self.fromPickupDate() !== "" || self.fromPickupDate() !== undefined) {
                            if ((new Date(self.fromPickupDate())) > new Date(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy')))
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

            //To check if enter value is digit and decimal
            self.isNumber = function (data, event) {
                var charCode = (event.which) ? event.which : event.keyCode;

                if (event.ctrlKey && (charCode == 99 || charCode == 67)) {
                    return true;
                }
                if ((charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57))) {
                    return false;
                }
                return true;
            };

            //To check if enter value is Alpha Numeric and Space
            self.isAlphaNumericSpace = function (data, event) {
                var charCode = (event.which) ? event.which : event.keyCode;

                if ((charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122))) {
                    return false;
                }
                return true;
            };

            //// to get the carrierId after selecting vendor/ Carrier
            //self.vendorId = ko.computed(() => {
            //	if (self.vendorNameSearchList.name() != null)
            //		return self.vendorNameSearchList.ID();
            //	return 0;
            //});
            //// to get the vendor Name after selecting vendor
            //self.vendorName = ko.computed(() => {
            //	if (self.vendorNameSearchList.name() != null)
            //		return self.vendorNameSearchList.vendorName();
            //	return null;
            //});
            //#endregion
            //#region Error Details Object
            self.errorPurchaseOrderDetail = ko.validatedObservable({
                proNumber: self.proNumber,
                vendorName: self.vendorName,
                toPickupDate: self.toPickupDate,
                fromPickupDate: self.fromPickupDate
            });

            //To set The date picker options
            self.datepickerOptions = {
                blockWeekend: true,
                blockPreviousDays: false,
                blockHolidaysDays: true,
                autoClose: true,
                placeBelowButton: false,
                endDate: new Date()
            };

            //#region Grid Settings
            self.header = new _reportViewer.ReportHeaderOption();
            self.header.reportHeader = "";
            self.header.reportName = "Vendor Bill PO Possibility Details";
            self.header.gridTitleHeader = "";

            self.findMoreResultHeader = new _reportViewer.ReportHeaderOption();
            self.findMoreResultHeader.reportHeader = "";
            self.findMoreResultHeader.reportName = "Vendor Bill PO Possibility Result";
            self.findMoreResultHeader.gridTitleHeader = "";

            //initialize date filters
            self.reportAction = new _reportViewer.ReportAction();
            self.findMoreResultReportAction = new _reportViewer.ReportAction();

            self.grid = self.setGridOptions(self);
            self.findMoreResultGrid = self.setFindMoreResultGridOptions(self);

            self.setReportCriteria = function (reportActionObj) {
                self.gridOptions = reportActionObj.gridOptions;
                if (self.reportAction != null) {
                    if ((self.modeType() != reportActionObj.filter1selectedItemId) || (self.reportAction.view != reportActionObj.view) || (reportActionObj.dateFrom != self.reportAction.dateFrom) || (reportActionObj.dateTo != self.reportAction.dateTo)) {
                        self.gridOptions.pagingOptions.currentPage(1);
                    }
                }
                _this.reportAction = reportActionObj;

                if (reportActionObj.dateFrom !== null && reportActionObj.dateTo !== null) {
                    // self.getReportData();
                } else {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 15,
                        fadeOut: 15,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectDateTimeFrame, "info", null, toastrOptions);
                }
            };

            self.findMoreResuleSetReportCriteria = function (ReportActionObj1) {
                if ((ReportActionObj1 != undefined || ReportActionObj1 != null) && (ReportActionObj1.gridOptions != undefined || ReportActionObj1.gridOptions != null) && (refSystem.isObject(ReportActionObj1.gridOptions.sortInfo())) && (ReportActionObj1.gridOptions.sortInfo().column != undefined || ReportActionObj1.gridOptions.sortInfo().column != null) && (ReportActionObj1.gridOptions.sortInfo().column.field != undefined || ReportActionObj1.gridOptions.sortInfo().column.field != null)) {
                    self.sortCol(ReportActionObj1.gridOptions.sortInfo().column.field);
                    if (self.sortCol() == 'PickupDateDisplay') {
                        self.sortCol('PickupDate');
                    } else if (self.sortCol() == 'CompanyNameDisplay') {
                        self.sortCol('AccountName');
                    } else if (self.sortCol() == 'ReferenceNo') {
                        self.sortCol('RefNumber');
                    } else if (self.sortCol() == 'CreatedBy') {
                        self.sortCol('BOLNumber');
                        self.sorttype("desc");
                    } else if (self.sortCol() == 'Action') {
                        self.sortCol('BOLNumber');
                        self.sorttype("desc");
                    } else if (self.sortCol() == 'Remarks') {
                        self.sortCol('BOLNumber');
                        self.sorttype("desc");
                    }

                    // ###END: DE20680
                    self.sorttype(ReportActionObj1.gridOptions.sortInfo().direction);
                } else {
                    self.sortCol("BOLNumber");
                    self.sorttype("desc");
                }
                if (ReportActionObj1.filter1selectedItemId == undefined || ReportActionObj1.filter1selectedItemId == 0) {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 15,
                        fadeOut: 15,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectModeFromTheList, "info", null, toastrOptions);
                    self.findMoreResultReportContainer.listProgress(false);
                    self.findMoreResultReportContainer.selectedFilter1Item(self.modeType());
                } else {
                    self.findMoreResultGridOptions = ReportActionObj1.gridOptions;

                    //if (self.modeType() != ReportActionObj1.filter1selectedItemId) {
                    //	self.findMoreResultReportContainer.columnDefinition(self.setFindMOreResultGridColumnDefinitions());
                    //}
                    self.findMoreResultReportAction = ReportActionObj1;
                    if (!self.isDefaultResult()) {
                        self.findMoreResultGetReportData(ReportActionObj1);
                    }
                }
            };

            self.findMoreResultGetReportData = function (reportActionObj1) {
                var deferred = $.Deferred();
                var promise = deferred.promise();
                var pageno = 0;
                pageno = Number(self.findMoreResultGridOptions.pagingOptions.currentPage());
                if (pageno > 0) {
                    // List View
                    self.findMoreResultReportContainer.listProgress(true);
                    self.getSearchCriteria();
                    self.findMoreResultReportContainer.reportColumnFilter.isFilterApply = false;
                    var saveData = { PageSize: self.findMoreResultGridOptions.pagingOptions.pageSize(), Filters: self.poPossibilitySearchFilterItems };
                    var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.FindMorePOPossibility, IsFilterApplied: self.findMoreResultReportContainer.reportColumnFilter.isFilterApply, GridSearchText: null, PageNo: self.findMoreResultGridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype() };

                    var searchParam = { SearchModel: self.searchRequestParam, SearchFilterModel: filterDataToSave };
                    self.purchaseOrderClient.getPoPossibilitySearchResponse(searchParam, function (data) {
                        self.setPagingData(data.SalesOrderResponse, data.NumberOfRows, self.findMoreResultGridOptions.pagingOptions.pageSize());
                        self.findMoreResultReportContainer.listProgress(false);

                        deferred.resolve(data, reportActionObj1.view);
                    }, function () {
                        self.findMoreResultReportContainer.listProgress(false);
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 15,
                            fadeOut: 15,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ErrorOccurredWhileFetchingPurchaseOrderList, "error", null, toastrOptions);
                    });
                }
                return promise;
            };

            self.reportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);
            self.reportContainer.onFilterChange = self.setReportCriteria;
            self.reportContainer.showOptionalHeaderRow(false);
            self.reportContainer.OptionalHeaderRowLocation('TOP');
            self.reportContainer.ForceChange();

            self.findMoreResultReportContainer = new _reportViewer.ReportViewerControlV2(self.findMoreResultHeader, self.findMoreResultGrid);
            self.findMoreResultReportContainer.onFilterChange = self.findMoreResuleSetReportCriteria;
            self.findMoreResultReportContainer.showOptionalHeaderRow(false);
            self.findMoreResultReportContainer.OptionalHeaderRowLocation('TOP');
            self.findMoreResultReportContainer.ForceChange();

            // For Force Attach Default Result
            self.reportContainer.onGridColumnClick = function (items) {
                var selectedlineitem;
                if (items != null) {
                    selectedlineitem = items.BOL;
                    self.forceAttachChanged(selectedlineitem);
                }
            };

            // For Force Attach Final Result
            self.findMoreResultReportContainer.onGridColumnClick = function (items) {
                var selectedlineitem;
                if (items != null) {
                    selectedlineitem = items.BOLNumber;
                    self.forceAttachChanged(selectedlineitem);
                }
            };

            //## After selection change re-assign the fields value
            self.findMoreResultReportContainer.afterSelectionChange = function (items) {
                self.selectedItem = items[0];
                var selectedRowCount = items.length;
                if (selectedRowCount > 0) {
                    self.isEnableOnForceAttach(true);
                } else {
                    self.isEnableOnForceAttach(false);
                }
            };

            // redirects to sales order details page
            self.reportContainer.onBolNumberClick = function (shipmentObj) {
                var salesOrderId = shipmentObj.ID;
                if (salesOrderId > 0 && shipmentObj.BOL) {
                    _app.trigger("openSalesOrder", salesOrderId, shipmentObj.BOL, function (callback) {
                        if (!callback) {
                            return;
                        }
                    });
                }
            };

            // redirects to Vendor bill order page
            self.reportContainer.onProNumberClick = function (shipmentObj) {
                var vendorBillId = shipmentObj.VendorBillId;
                if (vendorBillId > 0 && shipmentObj.PRONumber) {
                    _app.trigger("openVendorBill", vendorBillId, shipmentObj.PRO, function (callback) {
                        if (!callback) {
                            return;
                        }
                    });
                }
            };

            // redirects to sales order details page
            self.findMoreResultReportContainer.onBolNumberClick = function (shipmentObj) {
                var salesOrderId = shipmentObj.ShipmentId;
                if (salesOrderId > 0 && shipmentObj.BOLNumber) {
                    _app.trigger("openSalesOrder", salesOrderId, shipmentObj.BOLNumber, function (callback) {
                        if (!callback) {
                            return;
                        }
                    });
                }
            };

            // redirects to Vendor bill order page
            self.findMoreResultReportContainer.onProNumberClick = function (shipmentObj) {
                var vendorBillId = shipmentObj.VendorBillId;
                if (vendorBillId > 0 && shipmentObj.PRONumber) {
                    _app.trigger("openVendorBill", vendorBillId, shipmentObj.PRONumber, function (callback) {
                        if (!callback) {
                            return;
                        }
                    });
                }
            };

            return self;
        }
        //#endregion
        //#region Internal public Methods
        PurchaseOrderPoPossibilityViewModel.prototype.initializePOPDetails = function (data) {
            var self = this;
            if (data) {
                //self.setPagingData(data.PoPossibilityResponse, data.NumberOfRows, self.gridOptions.pagingOptions.pageSize());
                self.setClientSidePagingData(data.PoPossibilityResponse, self.gridOptions, self.reportAction);
            } else {
                self.reportContainer.listProgress(false);
            }
        };

        // To Rebind  the POP Grid
        PurchaseOrderPoPossibilityViewModel.prototype.rebindPOPGird = function () {
            var self = this;

            //  self.listProgressPOP(true);
            var successCallBack = function (data) {
                var commonUtils = new Utils.Common();

                // self.purchaseOrderPOPViewModel.isDefaultResult(true);
                // load Links details
                self.initializePOPDetails(data);
                // self.listProgressPOP(false);
            }, faliureCallBack = function () {
                //   self.listProgressPOP(false);
            };
            self.purchaseOrderClient.getPOPDetails(self.VendorBilId(), successCallBack, faliureCallBack);
        };
        PurchaseOrderPoPossibilityViewModel.prototype.getSearchCriteria = function () {
            var self = this;
            self.searchRequestParam.VendorName = self.vendorName();
            self.searchRequestParam.ProNumber = self.proNumber();
            self.searchRequestParam.BolNumber = self.bolNumber();
            self.searchRequestParam.PoNumber = self.poNumber();
            self.searchRequestParam.ReferenceNumber = self.refNumber();

            var fromPickupDate = self.fromPickupDate();
            if (fromPickupDate === undefined || fromPickupDate === null || fromPickupDate === "") {
                fromPickupDate = "01/01/0001";
            }
            self.searchRequestParam.FromDate = fromPickupDate;

            var toPickupDate = self.toPickupDate();
            if (toPickupDate === undefined || toPickupDate === null || toPickupDate === "") {
                toPickupDate = self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy');
            }

            self.searchRequestParam.ToDate = toPickupDate;
            self.searchRequestParam.ShipperZipCode = self.originZip();
            self.searchRequestParam.ConsigneeZipCode = self.destinationZip();
            self.searchRequestParam.PageNumber = self.findMoreResultReportContainer.pagingOptions.currentPage();
            self.searchRequestParam.PageSize = self.findMoreResultReportContainer.pagingOptions.pageSize();
            self.searchRequestParam.TransactionSearchType = refEnums.Enums.TransactionSearchType.SalesOrder.ID;
        };

        PurchaseOrderPoPossibilityViewModel.prototype.initializePOPFindMoreDetails = function (PurchaseOrder) {
            var self = this;
            if (PurchaseOrder != null) {
                var proNumberWithoutPURGE = PurchaseOrder.ProNumber.replace(/ PURGE/g, "");
                self.proNumber(proNumberWithoutPURGE);
                self.vendorName(PurchaseOrder.VendorName);
                self.bolNumber(PurchaseOrder.BolNumber);
                self.poNumber(PurchaseOrder.PoNumber);
                var fromdate = new Date();
                var x = 90;
                var newFromDate = fromdate.setDate(fromdate.getDate() - x);
                self.fromPickupDate(PurchaseOrder.fromPickupDate ? self.commonUtils.formatDate(PurchaseOrder.fromPickupDate.toString(), 'mm/dd/yyyy') : self.commonUtils.formatDate(newFromDate, 'mm/dd/yyyy'));
                self.toPickupDate(PurchaseOrder.toPickupDate ? self.commonUtils.formatDate(PurchaseOrder.toPickupDate.toString(), 'mm/dd/yyyy') : self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
                self.originZip(PurchaseOrder.OriginZip);
                self.destinationZip(PurchaseOrder.DestinationZip);
                self.refNumber(PurchaseOrder.ReferenceNumber);
                self.originZip();
            }
        };

        //To open Default Search View
        PurchaseOrderPoPossibilityViewModel.prototype.openSearchView = function () {
            var self = this;
            self.isDefaultResult(true);
            self.rebindPOPGird();
            $(".searchpop").slideDown("slow");
            $(".findmorepop").slideUp("slow");
            $(".resultpop").slideUp("slow");
        };

        //To open Find More  View
        PurchaseOrderPoPossibilityViewModel.prototype.openFindView = function () {
            var self = this;
            self.isDefaultResult(false);
            $(".searchpop").slideUp("slow");
            $(".findmorepop").slideDown("slow");
            $(".resultpop").slideUp("slow");
        };

        //To open Find Result View
        PurchaseOrderPoPossibilityViewModel.prototype.openFindResult = function () {
            var self = this;
            if (self.errorPurchaseOrderDetail.errors().length === 0) {
                self.isDefaultResult(false);
                self.findMoreResultGetReportData(self.findMoreResultReportAction);
                $(".findmorepop").slideUp("slow");
                $(".resultpop").slideDown("slow");
                $(".searchpop").slideUp("slow");
            }
        };

        // Save POPossibility
        PurchaseOrderPoPossibilityViewModel.prototype.onSaveResult = function () {
            var self = this;
            var selectOpt = self.findMoreResultGridOptions.selectedItems();
            var poPossibilitySaveParameter = new refPOPossibilitySaveModel.Models.POPossibilitySaveParameter();
            poPossibilitySaveParameter.VendorBillId = self.VendorBilId();
            poPossibilitySaveParameter.SalesOrderId = new Array();
            selectOpt.forEach(function (item) {
                poPossibilitySaveParameter.SalesOrderId.push(item.ShipmentId);
            });
            var successCallBack = function () {
                // To refresh the content after sending the mail
                var refresh = function () {
                    self.beforeBind();
                };
                var toastrOptions1 = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.POForceAttachedSavedSuccessfullyMessage, "success", "", toastrOptions1, null);
                self.resetGridSelection(self);
                self.findMoreResultGetReportData(self.findMoreResultReportAction);
            }, failureCallBack = function () {
            };
            self.purchaseOrderClient.SavePOPossibilityDetail(poPossibilitySaveParameter, successCallBack, failureCallBack);
        };

        // To clear fields
        PurchaseOrderPoPossibilityViewModel.prototype.onClear = function () {
            var self = this;
            self.vendorName('');
            self.proNumber('');
            self.bolNumber('');
            self.poNumber('');
            self.refNumber('');
            self.originZip('');
            self.destinationZip('');
            self.fromPickupDate('');
            self.toPickupDate('');
        };

        //#endregion
        //#region Internal private methods
        PurchaseOrderPoPossibilityViewModel.prototype.setPagingData = function (data, page, pageSize) {
            var self = this;
            if (self.isDefaultResult()) {
                self.gridOptions.data(data);
                self.gridOptions.data.valueHasMutated();
                self.gridOptions.pagingOptions.totalServerItems(page);
            } else {
                self.findMoreResultGridOptions.data(data);
                self.findMoreResultGridOptions.data.valueHasMutated();
                self.findMoreResultGridOptions.pagingOptions.totalServerItems(page);
            }
        };

        PurchaseOrderPoPossibilityViewModel.prototype.setClientSidePagingData = function (data, grid, gridOption) {
            Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
        };

        PurchaseOrderPoPossibilityViewModel.prototype.resetGridSelection = function (self) {
            window.kg.toggleSelection(false);
        };

        PurchaseOrderPoPossibilityViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = true;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("POPossibilityGrid");
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

        PurchaseOrderPoPossibilityViewModel.prototype.setFindMoreResultGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = true;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("POPossibilitySearchResultGrid");
            grOption.data = self.findMoreResultReportData;
            grOption.columnDefinition = self.setFindMOreResultGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
                columnName: "PickupDateDisplay",
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
            grOption.useClientSideFilterAndSort = false;
            grOption.showColumnMenu = false;
            return grOption;
        };

        ///<summary>
        ///Purchase Order UVB Possibility  Columns definition and values.
        ///<summary>
        /// <changeHistory>
        /// <id>US21158</id> <by>Janakiram</by> <date>11-03-2016</date>
        ///<description>Removed Created By column for hiding in UI and Column[Remark] position changed in order as follows Action, BOL#, PRO#, Remarks etc...</description >
        /// </changeHistory>
        PurchaseOrderPoPossibilityViewModel.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;
            var ForceAttachTemplate = '<button data-bind="click: function() { $userViewModel.onGridColumnClick($parent.entity) } , attr: { \'class\': \'btn btn-primary\'}">Force Attach</button>';
            var bolCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'BOL\'], click: function() { $userViewModel.onBolNumberClick($parent.entity) }" />';

            // Removed LINK For PRO AS Per DE17407
            //var proCellTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'PRO\'], visible: !($parent.entity[\'ProLinkVisible\'])"></div><a style="cursor: pointer" data-bind="text: $parent.entity[\'PRO\'], click: function() { $userViewModel.onProNumberClick($parent.entity) },  visible: ($parent.entity[\'ProLinkVisible\'])" /></div>';
            colDefinition = [
                { field: 'Action', displayName: 'Action', width: 105, cellTemplate: ForceAttachTemplate },
                { field: 'BOL', displayName: 'BOL#', width: 100, cellTemplate: bolCellTemplate },
                { field: 'PRO', displayName: 'PRO#', width: 100 },
                // ###START: US21158
                { field: 'Remarks', displayName: 'Remarks', width: 365 },
                // ###END: US21158
                { field: 'CarrierName', displayName: 'Carrier', width: 100 },
                { field: 'PickupDateDisplay', displayName: 'Pickup Date', width: 120 },
                { field: 'OriginZip', displayName: 'Origin Zip', width: 100 },
                { field: 'DestinationZip', displayName: 'Destination Zip', width: 140 },
                { field: 'PONumber', displayName: 'PO#', width: 80 },
                { field: 'ReferenceNo', displayName: 'REF#', width: 100 },
                { field: 'Shipper', displayName: 'Shipper', width: 120 },
                { field: 'Consignee', displayName: 'Consignee', width: 120 },
                { field: 'Customer', displayName: 'Customer', width: 265 }
            ];
            return colDefinition;
        };

        ///<summary>
        ///Purchase Order UVB Possibility  Columns definition and values for Find More.
        ///<summary>
        /// <changeHistory>
        /// <id>US21158</id> <by>Janakiram</by> <date>11-03-2016</date>
        ///<description>Removed Created By column for hiding in UI and Column[Remark] position changed in order as follows Action, BOL#, PRO#, Remarks etc...</description >
        /// </changeHistory>
        PurchaseOrderPoPossibilityViewModel.prototype.setFindMOreResultGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;
            var ForceAttachTemplate = '<button data-bind="click: function() { $userViewModel.onGridColumnClick($parent.entity) } , attr: { \'class\': \'btn btn-primary\'}" >Force Attach</button>';
            var bolCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'BOLNumber\'], click: function() { $userViewModel.onBolNumberClick($parent.entity) }" />';
            var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'PRONumber\'], click: function() { $userViewModel.onProNumberClick($parent.entity) }" />';
            colDefinition = [
                { field: 'Action', displayName: 'Action', width: 100, cellTemplate: ForceAttachTemplate },
                { field: 'BOLNumber', displayName: 'BOL#', width: 100, cellTemplate: bolCellTemplate },
                { field: 'PRONumber', displayName: 'PRO#', width: 100, cellTemplate: proCellTemplate },
                // ###START:US21158
                { field: 'Remarks', displayName: 'Remarks', width: 240 },
                // ###END:US21158
                { field: 'CarrierName', displayName: 'Carrier', width: 100 },
                { field: 'PickupDateDisplay', displayName: 'Pickup Date', width: 120 },
                { field: 'ShipperZipCode', displayName: 'Origin Zip', width: 100 },
                { field: 'ConsigneeZipCode', displayName: 'Destination Zip', width: 140 },
                { field: 'PONumber', displayName: 'PO#', width: 80 },
                { field: 'ReferenceNo', displayName: 'REF#', width: 100 },
                { field: 'ShipperName', displayName: 'Shipper', width: 120 },
                { field: 'ConsigneeName', displayName: 'Consignee', width: 120 },
                { field: 'CompanyNameDisplay', displayName: 'Customer', width: 120 }
            ];
            return colDefinition;
        };

        ////#region if user any numeric  date  without any format
        PurchaseOrderPoPossibilityViewModel.prototype.convertTofromPickupDate = function () {
            var self = this;
            if (!self.fromPickupDate().match('/') && self.fromPickupDate().length > 0) {
                self.fromPickupDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.fromPickupDate()));
            }
        };

        PurchaseOrderPoPossibilityViewModel.prototype.convertTotoPickupDate = function () {
            var self = this;
            if (!self.toPickupDate().match('/') && self.toPickupDate().length > 0) {
                self.toPickupDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.toPickupDate()));
            }
        };

        //#endregion
        //#endregion
        //#region Life Cycle
        PurchaseOrderPoPossibilityViewModel.prototype.deactivate = function () {
            var self = this;
            var currentPage = 1;

            if (self.findMoreResultGridOptions.pagingOptions.currentPage() !== undefined) {
                currentPage = self.findMoreResultGridOptions.pagingOptions.currentPage();
            }

            var saveData = { PageSize: self.findMoreResultGridOptions.pagingOptions.pageSize(), Filters: self.poPossibilitySearchFilterItems };

            var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.FindMorePOPossibility, IsFilterApplied: false, GridSearchText: null, PageNo: self.findMoreResultGridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype() };

            LocalStorageController.Set(self.localStorageKey(), filterDataToSave);

            // Remove the event registration from Document
            document.onkeypress = undefined;
        };

        PurchaseOrderPoPossibilityViewModel.prototype.beforeBind = function () {
            var self = this;

            _app.trigger("loadMyData", function (data) {
                if (data) {
                    self.initializePOPDetails(data);
                }
            });
        };

        PurchaseOrderPoPossibilityViewModel.prototype.cleanup = function () {
            var self = this;

            self.reportContainer.cleanup("POPossibilityGrid");
            self.POPPossibilityFindResultViewModel.cleanup();

            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }

            delete self;
        };
        return PurchaseOrderPoPossibilityViewModel;
    })();
    exports.PurchaseOrderPoPossibilityViewModel = PurchaseOrderPoPossibilityViewModel;
});
