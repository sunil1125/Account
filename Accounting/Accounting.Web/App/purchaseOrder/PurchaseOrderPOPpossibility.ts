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

//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refEnums = require('services/models/common/Enums');
import _reportViewer = require('../templates/reportViewerControlV2');
import refMapLocation = require('services/models/common/MapLocation');
import refValidations = require('services/validations/Validations');
import refPOPpssibilityFindResult = require('purchaseOrder/PurchaseOrderPOPpossibilityFindResult');
import refpurchaseOrderClient = require('services/client/PurchaseOrderClient');
import refPOPossibilityFindMoreRequest = require('services/models/purchaseOrder/PoPossibilityFindMoreRequest');
import refPOPossibilitySaveModel = require('services/models/purchaseOrder/POPossibilitySaveParameter');
import refSalesOrderIdModel = require('services/models/purchaseOrder/SalesOrderId');
import _refPurchaseOrderSearchFilterModel = require('services/models/purchaseOrder/PurchaseOrderSearchFilter');
import refSearchModel = require('services/models/transactionSearch/TransactionSearchRequest');

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
export class PurchaseOrderPoPossibilityViewModel {
    //#region Members
    //## Holds PRO #
    proNumber: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Minimum 3 characters required.", params: 3 } });
    //## Holds PRO #
    vendorName: KnockoutObservable<string> = ko.observable('').extend({ minLength: { message: "Minimum 3 characters required.", params: 3 } });
    //## Holds BOL #
    bolNumber: KnockoutObservable<string> = ko.observable('');
    ////## Holds Bill Date
    //billDate: KnockoutObservable<any> = ko.observable('').extend({ required: { message: " A valid Bill Date is required" } });
    //## Holds PO #
    poNumber: KnockoutObservable<string> = ko.observable('');
    ////## Holds EDI BOL #
    //mainBolNumber: KnockoutObservable<string> = ko.observable('');
    //Enable save button On ForceAttach
    isEnableOnForceAttach: KnockoutObservable<boolean> = ko.observable(false);
    // To hold selected Record
    selectedItem: IShipmentRelatedLinks;
    //## Holds Reference #
    refNumber: KnockoutObservable<string> = ko.observable('');
    //## Holds Pickup Date or To Date
    fromPickupDate: KnockoutObservable<any> = ko.observable('');
    toPickupDate: KnockoutObservable<any> = ko.observable('');
    //## Holds Origin Zip
    originZip: KnockoutObservable<string> = ko.observable('');
    //## Holds Destination Zip
    destinationZip: KnockoutObservable<string> = ko.observable('');
    // data picker Options
    datepickerOptions: DatepickerOptions;
    //For Grid
    isDefaultResult: KnockoutObservable<boolean> = ko.observable(true);
    // To show errors errorVendorDetail: KnockoutValidationGroup;
    error: KnockoutValidationErrors;
    errorPurchaseOrderDetail: KnockoutValidationGroup;
    vendorId: KnockoutComputed<number>;
    VendorBilId: KnockoutObservable<number> = ko.observable(0);
    //vendorName: KnockoutComputed<string>;
    errorWidth: KnockoutObservable<string> = ko.observable('230px');
    normalWidth: KnockoutObservable<string> = ko.observable('250px');

    //## Function Declaration Region
    isNumber: (that, event) => void;
    isAlphaNumericSpace: (that, event) => void;

    public reportContainer: _reportViewer.ReportViewerControlV2 = null;
    public findMoreResultReportContainer: _reportViewer.ReportViewerControlV2 = null;

    public header: _reportViewer.ReportHeaderOption = null;
    public findMoreResultHeader: _reportViewer.ReportHeaderOption = null;

    public grid: _reportViewer.ReportGridOption = null;
    public findMoreResultGrid: _reportViewer.ReportGridOption = null;

    public reportAction: _reportViewer.ReportAction = null;
    public findMoreResultReportAction: _reportViewer.ReportAction = null;

    public reportData: KnockoutObservableArray<IShipmentRelatedLinks> = null;
    public findMoreResultReportData: KnockoutObservableArray<IShipmentRelatedLinks> = null;

    public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
    public findMoreResuleSetReportCriteria: (reportAction: _reportViewer.ReportAction) => any;

    public getReportData: (reportAction: _reportViewer.ReportAction) => any;
    public findMoreResultGetReportData: (reportAction: _reportViewer.ReportAction) => any;

    public gridOptions: any;
    public findMoreResultGridOptions: any;

    public reportType: number;
    public findMoreResultReportType: number;

    public modeType = ko.observable();

    forceAttachChanged: (bolNumber: number) => any;
    //# Initializations

    POPPossibilityFindResultViewModel: refPOPpssibilityFindResult.PurchaseOrderPOPpossibilityFindResultViewModel;

    purchaseOrderClient: refpurchaseOrderClient.PurchaseOrderClient = new refpurchaseOrderClient.PurchaseOrderClient();

    commonUtils: CommonStatic = new Utils.Common();
    //searchRequestParam: IPoPossibilityFindMoreRequest = new refPOPossibilityFindMoreRequest.Models.PoPossibilityFindMoreRequest();

    sortCol: KnockoutObservable<string> = ko.observable('ProNumber');
    sorttype: KnockoutObservable<string> = ko.observable('asc');
    //Search Filter
    poPossibilitySearchFilterItems: Array<IPurchaseOrderSearchFilter> = new Array<_refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter>();
    localStorageKey: KnockoutObservable<string> = ko.observable('');
    searchRequestParam: refSearchModel.Model.TransactionSearchRequest = new refSearchModel.Model.TransactionSearchRequest();
    //#endregion

    //#region Internal public Methods
    constructor(forceAttachCallBack: (bolNumber: number) => any) {
        var self = this;
        self.forceAttachChanged = forceAttachCallBack;
        self.POPPossibilityFindResultViewModel = new refPOPpssibilityFindResult.PurchaseOrderPOPpossibilityFindResultViewModel();

        //#region Validations
        self.toPickupDate = ko.observable().extend({
            validation: {
                validator: function () {
                    //To Pickup date should not be grater then today date
                    if (new Date(self.toPickupDate()) > (new Date(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy')))) {
                        return false;
                    } else if (self.toPickupDate() !== undefined && self.fromPickupDate() !== "") {
                        //To pickUp Date should be greater than from pick up date
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
        self.isNumber = (data, event) => {
            var charCode = (event.which) ? event.which : event.keyCode;

            //to allow copy(ctrl + c) in firefox
            if (event.ctrlKey && (charCode == 99 || charCode == 67)) {
                return true;
            }
            if ((charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57))) {
                return false;
            }
            return true;
        }

		//To check if enter value is Alpha Numeric and Space
		self.isAlphaNumericSpace = (data, event) => {
            var charCode = (event.which) ? event.which : event.keyCode;

            if ((charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122))) {
                return false;
            }
            return true;
        }
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

        self.setReportCriteria = (reportActionObj: _reportViewer.ReportAction) => {
            self.gridOptions = reportActionObj.gridOptions;
            if (self.reportAction != null) {
                if ((self.modeType() != reportActionObj.filter1selectedItemId) || (self.reportAction.view != reportActionObj.view) ||
                    (reportActionObj.dateFrom != self.reportAction.dateFrom) || (reportActionObj.dateTo != self.reportAction.dateTo)) {
                    self.gridOptions.pagingOptions.currentPage(1);
                }
            }
            this.reportAction = reportActionObj;

            if (reportActionObj.dateFrom !== null && reportActionObj.dateTo !== null) {
                // self.getReportData();
            }
            else {
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 15,
                    fadeOut: 15,
                    typeOfAlert: "",
                    title: ""
                }
			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectDateTimeFrame, "info", null, toastrOptions);
            }
        };

        self.findMoreResuleSetReportCriteria = (ReportActionObj1: _reportViewer.ReportAction) => {
            if ((ReportActionObj1 != undefined || ReportActionObj1 != null) && (ReportActionObj1.gridOptions != undefined || ReportActionObj1.gridOptions != null) && (refSystem.isObject(ReportActionObj1.gridOptions.sortInfo())) && (ReportActionObj1.gridOptions.sortInfo().column != undefined || ReportActionObj1.gridOptions.sortInfo().column != null) && (ReportActionObj1.gridOptions.sortInfo().column.field != undefined || ReportActionObj1.gridOptions.sortInfo().column.field != null)) {
                self.sortCol(ReportActionObj1.gridOptions.sortInfo().column.field);
                if (self.sortCol() == 'PickupDateDisplay') {
                    self.sortCol('PickupDate');
                }
                else if (self.sortCol() == 'CompanyNameDisplay') {
                    self.sortCol('AccountName')
				}
                // ###START: DE20680
                else if (self.sortCol() == 'ReferenceNo') {
                    self.sortCol('RefNumber')
				}
                else if (self.sortCol() == 'CreatedBy') {
                    self.sortCol('BOLNumber')
					self.sorttype("desc");
                }
                else if (self.sortCol() == 'Action') {
                    self.sortCol('BOLNumber')
					self.sorttype("desc");
                }
                else if (self.sortCol() == 'Remarks') {
                    self.sortCol('BOLNumber')
					self.sorttype("desc");
                }
                // ###END: DE20680

                self.sorttype(ReportActionObj1.gridOptions.sortInfo().direction);
            }
            else {
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
                }

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectModeFromTheList, "info", null, toastrOptions);
                self.findMoreResultReportContainer.listProgress(false);
                self.findMoreResultReportContainer.selectedFilter1Item(self.modeType());
            }
            else {
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

        self.findMoreResultGetReportData = function (reportActionObj1: _reportViewer.ReportAction) {
            var deferred = $.Deferred();
            var promise = deferred.promise();
            var pageno = 0;
            pageno = Number(self.findMoreResultGridOptions.pagingOptions.currentPage());
            if (pageno > 0) {
                // List View

                self.findMoreResultReportContainer.listProgress(true);
                self.getSearchCriteria();
                self.findMoreResultReportContainer.reportColumnFilter.isFilterApply = false;
                var saveData = { PageSize: self.findMoreResultGridOptions.pagingOptions.pageSize(), Filters: self.poPossibilitySearchFilterItems }
				var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.FindMorePOPossibility, IsFilterApplied: self.findMoreResultReportContainer.reportColumnFilter.isFilterApply, GridSearchText: null, PageNo: self.findMoreResultGridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype() };

                var searchParam = { SearchModel: self.searchRequestParam, SearchFilterModel: filterDataToSave }
				self.purchaseOrderClient.getPoPossibilitySearchResponse(searchParam,
                    function (data) {
                        self.setPagingData(data.SalesOrderResponse, data.NumberOfRows, self.findMoreResultGridOptions.pagingOptions.pageSize());
                        self.findMoreResultReportContainer.listProgress(false);

                        deferred.resolve(data, reportActionObj1.view);
                    },

                    function () {
                        self.findMoreResultReportContainer.listProgress(false);
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 15,
                            fadeOut: 15,
                            typeOfAlert: "",
                            title: ""
                        }
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
        }

		// For Force Attach Final Result
		self.findMoreResultReportContainer.onGridColumnClick = function (items) {
            var selectedlineitem;
            if (items != null) {
                selectedlineitem = items.BOLNumber;
                self.forceAttachChanged(selectedlineitem);
            }
        }

		//## After selection change re-assign the fields value
		self.findMoreResultReportContainer.afterSelectionChange = function (items: KnockoutObservableArray<any>) {
            self.selectedItem = items[0];
            var selectedRowCount = items.length;
            if (selectedRowCount > 0) {
                self.isEnableOnForceAttach(true);
            } else {
                self.isEnableOnForceAttach(false);
            }
        }

		// redirects to sales order details page
		self.reportContainer.onBolNumberClick = function (shipmentObj) {
            var salesOrderId = shipmentObj.ID;
            if (salesOrderId > 0 && shipmentObj.BOL) {
                _app.trigger("openSalesOrder", salesOrderId, shipmentObj.BOL, (callback) => {
                    if (!callback) {
                        return;
                    }
                });
            }
        }

		// redirects to Vendor bill order page
        self.reportContainer.onProNumberClick = function (shipmentObj) {
            var vendorBillId = shipmentObj.VendorBillId;
            if (vendorBillId > 0 && shipmentObj.PRONumber) {
                _app.trigger("openVendorBill", vendorBillId, shipmentObj.PRO, (callback) => {
                    if (!callback) {
                        return;
                    }
                });
            }
        }

		// redirects to sales order details page
		self.findMoreResultReportContainer.onBolNumberClick = function (shipmentObj) {
            var salesOrderId = shipmentObj.ShipmentId;
            if (salesOrderId > 0 && shipmentObj.BOLNumber) {
                _app.trigger("openSalesOrder", salesOrderId, shipmentObj.BOLNumber, (callback) => {
                    if (!callback) {
                        return;
                    }
                });
            }
        }

		// redirects to Vendor bill order page
		self.findMoreResultReportContainer.onProNumberClick = function (shipmentObj) {
            var vendorBillId = shipmentObj.VendorBillId;
            if (vendorBillId > 0 && shipmentObj.PRONumber) {
                _app.trigger("openVendorBill", vendorBillId, shipmentObj.PRONumber, (callback) => {
                    if (!callback) {
                        return;
                    }
                });
            }
        }

		return self;
    }
    //#endregion

    //#region Internal public Methods

    public initializePOPDetails(data: IPoPossibilitySearchResponse) {
        var self = this;
        if (data) {
            //self.setPagingData(data.PoPossibilityResponse, data.NumberOfRows, self.gridOptions.pagingOptions.pageSize());
            self.setClientSidePagingData(data.PoPossibilityResponse, self.gridOptions, self.reportAction);
        }
        else {
            self.reportContainer.listProgress(false);
        }
    }

    // To Rebind  the POP Grid
    public rebindPOPGird() {
        var self = this;
        //  self.listProgressPOP(true);
        var successCallBack = function (data) {
            var commonUtils = new Utils.Common();
            // self.purchaseOrderPOPViewModel.isDefaultResult(true);
            // load Links details
            self.initializePOPDetails(data);

            // self.listProgressPOP(false);
        },
            faliureCallBack = function () {
                //   self.listProgressPOP(false);
            };
        self.purchaseOrderClient.getPOPDetails(self.VendorBilId(), successCallBack, faliureCallBack);
    }
    public getSearchCriteria() {
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
        self.searchRequestParam.PageNumber = self.findMoreResultReportContainer.pagingOptions.currentPage()
		self.searchRequestParam.PageSize = self.findMoreResultReportContainer.pagingOptions.pageSize();
        self.searchRequestParam.TransactionSearchType = refEnums.Enums.TransactionSearchType.SalesOrder.ID;
    }

    public initializePOPFindMoreDetails(PurchaseOrder: IPurchaseOrder) {
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
            self.originZip()
		}
    }

    //To open Default Search View
    public openSearchView() {
        var self = this;
        self.isDefaultResult(true);
        self.rebindPOPGird();
        $(".searchpop").slideDown("slow");
        $(".findmorepop").slideUp("slow");
        $(".resultpop").slideUp("slow");
    }
    //To open Find More  View
    public openFindView() {
        var self = this;
        self.isDefaultResult(false);
        $(".searchpop").slideUp("slow");
        $(".findmorepop").slideDown("slow");
        $(".resultpop").slideUp("slow");
    }
    //To open Find Result View
    public openFindResult() {
        var self = this;
        if (self.errorPurchaseOrderDetail.errors().length === 0) {
            self.isDefaultResult(false);
            self.findMoreResultGetReportData(self.findMoreResultReportAction);
            $(".findmorepop").slideUp("slow");
            $(".resultpop").slideDown("slow");
            $(".searchpop").slideUp("slow");
        }
    }

    // Save POPossibility

    public onSaveResult() {
        var self = this;
        var selectOpt: Array<IPOPossibility> = self.findMoreResultGridOptions.selectedItems();
        var poPossibilitySaveParameter = new refPOPossibilitySaveModel.Models.POPossibilitySaveParameter();
        poPossibilitySaveParameter.VendorBillId = self.VendorBilId();
        poPossibilitySaveParameter.SalesOrderId = new Array<refSalesOrderIdModel.Models.SalesOrderId>();
        selectOpt.forEach((item) => {
            poPossibilitySaveParameter.SalesOrderId.push(item.ShipmentId);
        });
        var successCallBack = function () {
            // To refresh the content after sending the mail
            var refresh = () => {
                self.beforeBind();
            };
            var toastrOptions1 = {
                toastrPositionClass: "toast-top-middle",
                delayInseconds: 10,
                fadeOut: 10,
                typeOfAlert: "",
                title: ""
            }
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.POForceAttachedSavedSuccessfullyMessage, "success", "", toastrOptions1, null);
            self.resetGridSelection(self);
            self.findMoreResultGetReportData(self.findMoreResultReportAction);
        },
            failureCallBack = function () {
            }
		self.purchaseOrderClient.SavePOPossibilityDetail(poPossibilitySaveParameter, successCallBack, failureCallBack);
    }

    // To clear fields
    public onClear() {
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
    }

    //#endregion

    //#region Internal private methods
    public setPagingData(data, page, pageSize) {
        var self = this;
        if (self.isDefaultResult()) {
            self.gridOptions.data(data);
            self.gridOptions.data.valueHasMutated()
			self.gridOptions.pagingOptions.totalServerItems(page);
        }
        else {
            self.findMoreResultGridOptions.data(data);
            self.findMoreResultGridOptions.data.valueHasMutated()
		    self.findMoreResultGridOptions.pagingOptions.totalServerItems(page);
        }
    }

    private setClientSidePagingData(data, grid, gridOption) {
        Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
    }

    private resetGridSelection(self) {
        window.kg.toggleSelection(false);
    }

    private setGridOptions(self: PurchaseOrderPoPossibilityViewModel): _reportViewer.ReportGridOption {
        var grOption = new _reportViewer.ReportGridOption();
        grOption.enableSelectiveDisplay = true;
        grOption.showGridSearchFilter = true;
        grOption.showPageSize = true;
        grOption.UIGridID = ko.observable("POPossibilityGrid");
        grOption.data = <any> self.reportData;
        grOption.columnDefinition = self.setGridColumnDefinitions();
        grOption.useExternalSorting = false;
        grOption.sortedColumn = <_reportViewer.SortOrder> {
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
    }

    private setFindMoreResultGridOptions(self: PurchaseOrderPoPossibilityViewModel): _reportViewer.ReportGridOption {
        var grOption = new _reportViewer.ReportGridOption();
        grOption.enableSelectiveDisplay = true;
        grOption.showGridSearchFilter = true;
        grOption.showPageSize = true;
        grOption.UIGridID = ko.observable("POPossibilitySearchResultGrid");
        grOption.data = <any> self.findMoreResultReportData;
        grOption.columnDefinition = self.setFindMOreResultGridColumnDefinitions();
        grOption.useExternalSorting = false;
        grOption.sortedColumn = <_reportViewer.SortOrder> {
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
    }
    
    ///<summary>
    ///Purchase Order UVB Possibility  Columns definition and values.
    ///<summary>
    /// <changeHistory>
    /// <id>US21158</id> <by>Janakiram</by> <date>11-03-2016</date>
    ///<description>Removed Created By column for hiding in UI and Column[Remark] position changed in order as follows Action, BOL#, PRO#, Remarks etc...</description >
    /// </changeHistory>
    private setGridColumnDefinitions() {
        var colDefinition: Array = [];
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
    }
    ///<summary>
    ///Purchase Order UVB Possibility  Columns definition and values for Find More.
    ///<summary>
    /// <changeHistory>
    /// <id>US21158</id> <by>Janakiram</by> <date>11-03-2016</date>
    ///<description>Removed Created By column for hiding in UI and Column[Remark] position changed in order as follows Action, BOL#, PRO#, Remarks etc...</description >
    /// </changeHistory>
    private setFindMOreResultGridColumnDefinitions() {
        var colDefinition: Array = [];
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
    }

    ////#region if user any numeric  date  without any format
    private convertTofromPickupDate() {
        var self = this;
        if (!self.fromPickupDate().match('/') && self.fromPickupDate().length > 0) {
            self.fromPickupDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.fromPickupDate()));
        }
    }

    private convertTotoPickupDate() {
        var self = this;
        if (!self.toPickupDate().match('/') && self.toPickupDate().length > 0) {
            self.toPickupDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.toPickupDate()));
        }
    }

    //#endregion

    //#endregion

    //#region Life Cycle
    public deactivate() {
        var self = this;
        var currentPage = 1;

        if (self.findMoreResultGridOptions.pagingOptions.currentPage() !== undefined) {
            currentPage = self.findMoreResultGridOptions.pagingOptions.currentPage()
		}

        var saveData = { PageSize: self.findMoreResultGridOptions.pagingOptions.pageSize(), Filters: self.poPossibilitySearchFilterItems }

		var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.FindMorePOPossibility, IsFilterApplied: false, GridSearchText: null, PageNo: self.findMoreResultGridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype() };

        LocalStorageController.Set(self.localStorageKey(), filterDataToSave);

        // Remove the event registration from Document
        document.onkeypress = undefined;
    }

    public beforeBind() {
        var self = this

		_app.trigger("loadMyData", function (data) {
            if (data) {
                self.initializePOPDetails(data);
            }
        });
    }

    public cleanup() {
        var self = this;

        self.reportContainer.cleanup("POPossibilityGrid");
        self.POPPossibilityFindResultViewModel.cleanup();

        for (var property in self) {
            if (property != "cleanup")
                delete self[property];
        }

        delete self;
    }

    //#endregion
}