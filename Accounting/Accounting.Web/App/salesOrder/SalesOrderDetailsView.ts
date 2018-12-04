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
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refMapLocation = require('services/models/common/MapLocation');
import refEnums = require('services/models/common/Enums');
import refValidations = require('services/validations/Validations');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refCarrierSearchModel = require('services/models/common/searchVendorName');
import refCarrierSearchControl = require('templates/searchVendorNameControl');
import refCustomerSearchControl = require('templates/searchCustomerAutoComplete');
import refCustomerSearchModel = require('services/models/common/searchCustomerName');
//#endregion

/*
** <summary>
** Sales Order details View Model.
** </summary>
** <createDetails>
** <id>US12172</id> <by>Satish</by> <date>27th Aug, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id>DE20761</id> <by>Baldev Singh Thakur</by> <date>19-11-2015</date>
** <id>DE21287</id><by>Vasanthakumar</by><date>21-01-2016</date><description>Disable booked date textbox for TL</description>
** <id>DE21747</id> <by>Baldev Singh Thakur</by> <date>12-02-2016</date> <description>ariff Type shown as "Not Available" when user performs Make Copy action.</description>
** <id>US22417</id> <by>Janakiram</by> <date>19-05-2016</date> <description>Removed fields Customer BOL#, Total Pieces, Total Weight /description>
** <id>DE22970</id> <by>Janakiram</by> <date>26-05-2016</date> <description>Removed Previous dates logic  for Booked Date while Editing and disabled field /description>
** <id>US22419</id> <by>Shreesha Adiga</by> <date>30-05-2016</date> <description>Added Factor Company and MAS vendor ID to details view</description>
** <id>US22054</id><by>Shreesha Adiga</by><date>03-06-2016</date><description>Add TariffStartDate and TariffNumber</description>
** <id>US22795</id> <by>Vasanthakumar</by> <date>22-06-2016</date> <description>Acct: Block Trucload Vendors for SO Entry Screen</description>
** <id>DE23916</id> <by>Baldev Singh Thakur</by> <date>12-08-2016</date> <description>Passing BillToLocationType.</description>
** </changeHistory>
*/
export class SalesOrderDetailsViewModel {
    //#region Members
    isActualOrVendor: KnockoutComputed<boolean>;
    // sales order client class reference
    salesOrderClient: refSalesOrderClient.SalesOrderClient = null;
    // ship via list array object and selected ship via object
    shipViaList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
    selectedShipVia: KnockoutObservable<number> = ko.observable();
    ShipVia: number;

    // order status list array object and selected order status object
    orderStatusList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
    selectedOrderStatus: KnockoutObservable<number> = ko.observable();
    //invoice status list array object and selected invoice status object
    invoiceStatusList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
    selectedInvoiceStatus: KnockoutObservable<number> = ko.observable();
    // To get the logged in user
    _currentUser: KnockoutObservable<IUser> = ko.observable();
    // sales rep name
    salesRep: KnockoutObservable<string> = ko.observable('');
    salesRepId: KnockoutObservable<number> = ko.observable(0);
    agencyName: KnockoutObservable<string> = ko.observable('');
    tariffType: KnockoutObservable<string> = ko.observable('');
    shipmentCarrierType: KnockoutObservable<number> = ko.observable(0);
    customerName: KnockoutComputed<string>;
    customerId: KnockoutComputed<number>;
    // carrier search list
    carrierSearchList: refCarrierSearchControl.SearchVendorNameControl;
    // Customer search list
    customerSearchList: refCustomerSearchControl.SearchCustomerAutoComplete;
    // common utils class object
    commonUtils: CommonStatic = new Utils.Common();
    // date picker options
    datepickerOptions: DatepickerOptions;
    // initialize observable for updating views
    salesOrderId: KnockoutObservable<number> = ko.observable(0);
    proNumber: KnockoutObservable<string> = ko.observable('');
    bookedDate: KnockoutObservable<any> = ko.observable('');
    originZip: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid origin is required." } });
    destinationZip: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid destination is required." } });
    customerBolNumber: KnockoutObservable<string> = ko.observable('');
    poNumber: KnockoutObservable<string> = ko.observable('');
    salesOrderNumber: KnockoutObservable<string> = ko.observable('');
    puNumber: KnockoutObservable<string> = ko.observable('');
    totalPieces: KnockoutObservable<number> = ko.observable();
    totalWeigth: KnockoutObservable<number> = ko.observable();
    totalRevenue: KnockoutObservable<number> = ko.observable();
    salesOrderAmount: KnockoutObservable<string> = ko.observable();
    salesOrderRevenue: KnockoutObservable<string> = ko.observable();
    dispute: KnockoutObservable<number> = ko.observable($.number(0, 2));
    actualProfitPer: KnockoutObservable<number> = ko.observable($.number(0, 2));
    actualProfit: KnockoutObservable<number> = ko.observable($.number(0, 2));
    actualCost: KnockoutObservable<number> = ko.observable($.number(0, 2));
    finalProfitPer: KnockoutObservable<number> = ko.observable($.number(0, 2));
    estimatedProfitPer: KnockoutObservable<number> = ko.observable($.number(0, 2));
    finalProfit: KnockoutObservable<number> = ko.observable($.number(0, 2));
    estimatedProfit: KnockoutObservable<number> = ko.observable($.number(0, 2));
    finalCost: KnockoutObservable<number> = ko.observable($.number(0, 2));
    estimatedCost: KnockoutObservable<number> = ko.observable($.number(0, 2));
    finalRevenue: KnockoutObservable<number> = ko.observable($.number(0, 2));
    originalFinalRevenue: KnockoutObservable<number> = ko.observable(0);
    estimatedRevenue: KnockoutObservable<number> = ko.observable($.number(0, 2));
    isPLCSalesorderRestrictionApplied: KnockoutObservable<boolean> = ko.observable(false);
    isSalesorderRequoteAllowed: KnockoutObservable<boolean> = ko.observable(false);
    isBillingStation: KnockoutObservable<boolean> = ko.observable(false);
    totalActualSummaryCost: KnockoutObservable<number> = ko.observable($.number(0, 2));
    totalActualProfit: KnockoutObservable<number> = ko.observable($.number(0, 2));
    totalPLCCost: KnockoutObservable<number> = ko.observable($.number(0, 2));
    estimateBSCost: KnockoutObservable<number> = ko.observable($.number(0, 2));
    finalBSCost: KnockoutObservable<number> = ko.observable($.number(0, 2));
    gtzMargin: KnockoutObservable<number> = ko.observable($.number(0, 2));
    isBscost: KnockoutObservable<boolean> = ko.observable(false);
    isProcessFlow: KnockoutObservable<number> = ko.observable(0);
    notIsBscost: KnockoutObservable<boolean> = ko.observable(false);
    UpdatedDateTime: KnockoutObservable<number> = ko.observable(0);
    grosscost: KnockoutObservable<number> = ko.observable(0);
    gcost: KnockoutObservable<number> = ko.observable(0);
    feeStructure: KnockoutObservable<number> = ko.observable(0);
    vendorbillid: KnockoutObservable<number> = ko.observable(0);
    plcMargin: KnockoutObservable<number> = ko.observable(0);
    gtMinMargin: KnockoutObservable<number> = ko.observable(0);
    customerTypeOf: KnockoutObservable<number> = ko.observable(0);
    isSaveEnable: KnockoutObservable<boolean> = ko.observable(true);
    //##START: DE21287
    isDisableBookedDateLink: KnockoutObservable<boolean> = ko.observable(false);
    //##END: DE21287

    //##START: DE22970
    isDisableBookedDate: KnockoutObservable<boolean> = ko.observable(false);
    //##END: DE22970

    grossProfit: KnockoutObservable<number> = ko.observable(0);
    //For Validation purpose
    errorSalesOrderDetail: KnockoutValidationGroup;
    // validation Function for checking number and alphanumeric
    isNumber: (that, event) => void;
    isAlphaNumericSpace: (that, event) => void;
    // test box width with error and without error
    errorWidth: KnockoutObservable<string> = ko.observable('188px');
    normalWidth: KnockoutObservable<string> = ko.observable('206px');
    isInoviceDisabled: KnockoutObservable<boolean> = ko.observable(true);
    isTabPress: (taht, event) => void;
    keyListenerCallBack: () => any;
    isCallForEdit: KnockoutObservable<boolean> = ko.observable(false);
    //Flag which specified whether status is Manually Finalized or Not??
    isManuallyFinalizedStatus: KnockoutObservable<boolean> = ko.observable(false);
    mainBolNo: KnockoutObservable<string> = ko.observable('');
    isCarrierEditable: KnockoutObservable<boolean> = ko.observable(true);
    isCustomerEditable: KnockoutObservable<boolean> = ko.observable(true);
    //for tracking change
    getBITrackChange: () => string[];
    isBIDirty: KnockoutComputed<boolean>;
    isNotAtLoadingTime: boolean = false;
    // call while changes occurs
    public onChangesMade: (dirty: boolean) => any;
    returnValueFlag: boolean = false;
    // Utility class object
    CommonUtils: CommonStatic = new Utils.Common();
    //
    costDiff: KnockoutObservable<number> = ko.observable($.number(0, 2));
    //Using Only for calculation
    soFinalCost: KnockoutObservable<number> = ko.observable(0);
    //Using Only for calculation
    soOriginalFinalBSCost: KnockoutObservable<number> = ko.observable(0);
    MasCustomer: KnockoutObservable<number> = ko.observable(0);
    progressClass: KnockoutObservable<string> = ko.observable('');
    MasCustomerName: KnockoutObservable<string> = ko.observable('');
    changeServiceType: (shipBy: string) => any;
    chnageCustomerId: (customerId: number) => any;

    //##START: US22419
    factorCompany: KnockoutObservable<string> = ko.observable('');
    masVendorId: KnockoutObservable<string> = ko.observable('');
    //##END: US22419


	// ##START: US22054
	TariffStartDate: Date;
	TariffStartDateDisplay: KnockoutObservable<string> = ko.observable('');
	TariffNumber: KnockoutObservable<string> = ko.observable('');
	// ##END: US22054

	// ###START: DE23916
	billToLocationType: number;

	// ###END: DE23916
    //#endregion

    //#region Constructor
    constructor(chnageCustomerId: (customerId: number) => any, keyListenerCallBack: () => any, changeServiceType: (shipBy: string) => any, currentUser: IUser, isSOEntry: boolean) {
        var self = this;
        self.chnageCustomerId = chnageCustomerId;
        self.changeServiceType = changeServiceType;

        // get the object of sales order client
        self.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
        self.isBscost(false);
        self.notIsBscost(true);
        self.keyListenerCallBack = keyListenerCallBack;
        self.customerSearchList = new refCustomerSearchControl.SearchCustomerAutoComplete("A valid Customer Name is required.", (salesRep: string, agencyName: string, agencyID?: number, agentID?: number) => {
            self.salesRep(salesRep);
            self.agencyName(agencyName);
            self.salesRepId(agentID);
        }, '83%', '189px', true);
        self.customerSearchList.isCustomCssSO(true);
        self.carrierSearchList = new refCarrierSearchControl.SearchVendorNameControl("A valid Carrier is required.", '83%', '189px', true);
		self.carrierSearchList.isCustomCssSO(true);

		// ###START: US22795		
		self.carrierSearchList.isExceptTLVendorSearch(isSOEntry);
		// ###END: US22795

        // Load all ship via if not loaded already
        var shipViaLength: number = self.shipViaList().length;
        if (!(shipViaLength)) {
            _app.trigger("GetSalesOrderShipViaList", function (data) {
                if (data) {
                    self.shipViaList.removeAll();
                    self.shipViaList.push.apply(self.shipViaList, data);

                    if (self.ShipVia) {
                        self.selectedShipVia(self.ShipVia);
                    }
                }
            });
        }

        // Load order status if not loaded already
        var orderStatusLength: number = self.orderStatusList().length;
        if (!(orderStatusLength)) {
            _app.trigger("GetOrderStatusListForSOEntry", function (data) {
                if (data) {
                    self.orderStatusList.removeAll();
                    self.orderStatusList.push.apply(self.orderStatusList, data);
                }
            });
        }
        self.bookedDate = ko.observable().extend({
            validation: [

                {
                    validator: () => new Date(self.bookedDate()) >= (new Date(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'))),
                    message: 'Booked Date cannot be Past Date'
                },
            ]
        });
        // initialize the booked date as today date
        self.bookedDate(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'));

        //track changes
        self.SetBITrackChange(self);

        self.getBITrackChange = function () {
            return Utils.getDirtyItems(self);
        };

        self.isBIDirty = ko.computed(() => {
            var result = self.proNumber();
            result = self.customerSearchList.customerName();
            result = self.poNumber();
            result = self.puNumber();
            result = self.carrierSearchList.vendorName();
            result = self.bookedDate();
            var result1 = self.selectedShipVia();
            var result2 = self.selectedOrderStatus();

            // If this from loading data side the return as false
            if (self.isNotAtLoadingTime)
                return false;

            var returnValue = self.getBITrackChange().length > 0 ? true : false;
            self.returnValueFlag = returnValue;
            if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
                self.onChangesMade(returnValue);

            return returnValue;
        });

        // Load invoice status if not loaded already
        var invoiceStatusLength: number = self.invoiceStatusList().length;
        if (!(invoiceStatusLength)) {
            _app.trigger("GetInvoiceStatusListForSOEntry", function (data) {
                if (data) {
                    self.invoiceStatusList.removeAll();
                    self.invoiceStatusList.push.apply(self.invoiceStatusList, data);
                }
            });
        }

        // get the logged in user details object
        if (currentUser) {
            self._currentUser(currentUser);
        }

        // initialize the sales rep name as logged in user name
        if (self._currentUser()) {
            self.salesRep(self._currentUser().FullName);
            self.salesRepId(self._currentUser().UserId);
        }

        //To set The date picker options
        self.datepickerOptions = {
            blockWeekend: true,
            blockPreviousDays: true,
            blockHolidaysDays: true,
            autoClose: true,
            placeBelowButton: false,
        };

        //To check if enter value is digit and decimal
        self.isNumber = function (data, event) {
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
		self.isAlphaNumericSpace = function (data, event) {
            var charCode = (event.which) ? event.which : event.keyCode;

            if ((charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122))) {
                return false;
            }
            return true;
        }

		// get selected customer Name and customer id
		self.customerId = ko.computed(() => {
            if (self.customerSearchList.name() != null) {
                self.chnageCustomerId(self.customerSearchList.id());
                return self.customerSearchList.id();
            }

            return 0;
        });

        self.customerName = ko.computed(() => {
            if (self.customerSearchList.name() != null)
                return self.customerSearchList.customerName();

            return null;
        });

        //#region Error Details Object
        self.errorSalesOrderDetail = ko.validatedObservable({
            customerSearchList: self.customerSearchList,
            carrierSearchList: self.carrierSearchList,
            originZip: self.originZip,
            destinationZip: self.destinationZip
        });

        //## when user pressed 'TAB' from last field of address view.
        self.isTabPress = (data, event) => {
            var charCode = (event.which) ? event.which : event.keyCode;

            if ((charCode === 9)) { //if 'TAB' press.
                self.keyListenerCallBack();
            }
            return true;
        }

		self.selectedShipVia.subscribe((newValue) => {
            switch (newValue) {
                case 0:
                    //ForGround
                    self.changeServiceType(refEnums.Enums.ShipVia.Ground.Value);
                    break;
                case 1:
                    //For Ocean
                    self.changeServiceType(refEnums.Enums.ShipVia.Ocean.Value);
                    break;
                case 2:
                    //For Expedite_Air
                    self.changeServiceType(refEnums.Enums.ShipVia.Expedite_Air.Value);
                    break;
                case 3:
                    //For Expedite_Ground
                    self.changeServiceType(refEnums.Enums.ShipVia.Expedite_Ground.Value);
                    break;
                case 4:
                    //For White_Glove
                    self.changeServiceType(refEnums.Enums.ShipVia.White_Glove.Value);
                    break;
                case 5:
                    //For Ground_Ocean
                    self.changeServiceType(refEnums.Enums.ShipVia.Ground_Ocean.Value);
                    break;
            }
            self.SetBITrackChange(self);
        });

        //
        //self.isActualOrVendor = ko.computed(() => {
        //	if (self.isBillingStation() && self.vendorbillid() !== 0 && self.isProcessFlow() === 1) {
        //		return true
        //	}

        //	return false;
        //});

        //#endregion

        return self;
    }

    //#endregion

    //#region Internal Methods
    //public initialize financial details
    public initializeSalesOrderFinancialDetails(data: ISalesOrderFinancialDetails) {
        var self = this;
        self.actualCost($.number(data.ActualCost, 2));
        self.actualProfit($.number(data.ActualProfit, 2));
        self.actualProfitPer($.number(data.ActualProfitPercent, 2));
        self.totalActualProfit(data.ActualProfit);
        self.finalRevenue($.number(data.FinalRevenue, 2));
        self.originalFinalRevenue(data.OriginalFinalRevenue);
        self.finalCost($.number(data.VBFinalCost, 2));
        self.finalProfit($.number(data.FinalProfit, 2));
        self.finalProfitPer($.number(data.FinalProfitPercent, 2));
        self.finalBSCost($.number(data.FinalBSCost, 2));
        self.estimatedRevenue($.number(data.EstimatedRevenue, 2));
        self.estimatedCost($.number(data.EstimatedCost, 2));
        self.estimatedProfit($.number(data.EstimatedProfit, 2));
        self.estimatedProfitPer($.number(data.EstimatedProfitPercent, 2));
        self.estimateBSCost($.number(data.EstimatedBSCost, 2));
        self.dispute($.number(data.DisputedAmount, 2));
        self.costDiff($.number(data.CostDifference, 2));
        self.soFinalCost(data.SOFinalCost);
        self.soOriginalFinalBSCost(data.OriginalFinalBSCost);
        self.grossProfit($.number(data.GrossProfit, 2));
    }

    // initialize sales order details
    public initializeSalesOrderDetails(salesOrderDetail: ISalesOrderDetail, SalesOrderShipmentProfitDetail: ISalesOrderShipmentProfitSummary, SalesOrderOriginalSODetail: ISalesOrderOriginalSODetails, CustomerBSPlcMarginInfo: ICustomersBSPlcInfo) {
        var self = this;
        // This will prevent to detect the changes at first time
        self.isNotAtLoadingTime = true;
        self.carrierSearchList.isNotAtLoadingTime = true;
        if (salesOrderDetail != null) {
            self.progressClass('icon-spinner icon-spin active');
            self.customerTypeOf(CustomerBSPlcMarginInfo.GetCustomerType);
            self.isSaveEnable(salesOrderDetail.IsSaveEnable);
            // assign the customer auto complete view
            if (CustomerBSPlcMarginInfo.GetCustomerType == refEnums.Enums.CustomerType.PLC_Customer.ID) {
                self.isBillingStation(false);
                self.gtzMargin($.number(CustomerBSPlcMarginInfo.GTMargin, 2));
                self.plcMargin($.number(CustomerBSPlcMarginInfo.PlcMargin, 2));
                self.feeStructure(CustomerBSPlcMarginInfo.FeeStructure);
                self.gtMinMargin($.number(CustomerBSPlcMarginInfo.GTMarginMin, 2));
            }
            else if (CustomerBSPlcMarginInfo.GetCustomerType == refEnums.Enums.CustomerType.BillingStation_Customer.ID) {
                self.isBillingStation(true);
                self.gtzMargin($.number(CustomerBSPlcMarginInfo.GTMargin, 2));
                self.plcMargin($.number(CustomerBSPlcMarginInfo.PlcMargin, 2));
                self.feeStructure(CustomerBSPlcMarginInfo.FeeStructure);
                self.gtMinMargin($.number(CustomerBSPlcMarginInfo.GTMarginMin, 2));
            }
            else {
                self.isBillingStation(false);
                self.gtzMargin(0);
                self.gtMinMargin($.number(CustomerBSPlcMarginInfo.GTMarginMin, 2));
            }
            self.isProcessFlow(salesOrderDetail.ProcessFlow)
			self.isBscost(self.isBillingStation());
            self.notIsBscost(!self.isBillingStation());
            self.customerSearchList.name(new refCustomerSearchModel.Models.CustomerNameSearch());
            self.customerSearchList.id(salesOrderDetail.CustomerId);
            self.customerSearchList.customerName(salesOrderDetail.CustomerName);
            // assign the carrier auto complete view
            self.carrierSearchList.name(new refCarrierSearchModel.Models.VendorNameSearch());
            self.carrierSearchList.ID(salesOrderDetail.CarrierId);
            self.carrierSearchList.vendorName(salesOrderDetail.CarrierName);
            // ###START: DE20761
            self.carrierSearchList.carrierCode(salesOrderDetail.CarrierCode);

            // ###END: DE20761
            self.isCarrierEditable(salesOrderDetail.CanEditCarrier);
            self.isCustomerEditable(salesOrderDetail.CanEditCustomer);
            if (!self.isSaveEnable()) {
                self.customerSearchList.isEnable(self.isSaveEnable());
                self.carrierSearchList.isSubBillOrder(self.isSaveEnable());
            } else {
                self.customerSearchList.isEnable(self.isSaveEnable());
                self.carrierSearchList.isSubBillOrder(self.isSaveEnable());
            }
            if (!self.isCarrierEditable()) {
                self.carrierSearchList.isSubBillOrder(self.isCarrierEditable());
            }
            if (!self.isCustomerEditable()) {
                self.customerSearchList.isEnable(self.isCustomerEditable());
            }
            self.isCarrierEditable(salesOrderDetail.CanEditCarrier);
            self.isCustomerEditable(salesOrderDetail.CanEditCustomer);
            if (!self.isCarrierEditable()) {
                self.carrierSearchList.isEnable(self.isCarrierEditable());
            }
            if (!self.isCustomerEditable()) {
                self.customerSearchList.isEnable(self.isCustomerEditable());
            }
            self.salesOrderId(salesOrderDetail.Id);
            self.salesOrderNumber(salesOrderDetail.BolNumber != 'null' ? salesOrderDetail.BolNumber : '');
            self.bookedDate(salesOrderDetail.BookedDate ? self.commonUtils.formatDate(salesOrderDetail.BookedDate.toString(), 'mm/dd/yyyy') : self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
            self.proNumber(salesOrderDetail.ProNo != 'null' ? salesOrderDetail.ProNo : '');
            self.poNumber(salesOrderDetail.PoNo != 'null' ? salesOrderDetail.PoNo : '');
            self.puNumber(salesOrderDetail.ReferenceNo != 'null' ? salesOrderDetail.ReferenceNo : '');
            self.vendorbillid(salesOrderDetail.VendorBillId);
            self.tariffType(salesOrderDetail.TariffType);
            // ###START: DE21747
            self.shipmentCarrierType(salesOrderDetail.ShipmentCarrierType);

            // ###END: DE21747

            // ##START: US22419
            self.factorCompany(salesOrderDetail.FactorVendor);
            self.masVendorId(salesOrderDetail.MASVendorId);

            // ##END: US22419

            if (salesOrderDetail.OrderStatusList) {
                self.orderStatusList.removeAll();
                self.orderStatusList.push.apply(self.orderStatusList, salesOrderDetail.OrderStatusList);
                self.selectedOrderStatus(salesOrderDetail.ProcessStatusId);
            }
            self.selectedInvoiceStatus(salesOrderDetail.InvoiceStatus);

            var shipViaLength: number = self.shipViaList().length;
            if (shipViaLength && shipViaLength > 0) {
                self.selectedShipVia(salesOrderDetail.SelectedShipVia);
            }

            self.ShipVia = salesOrderDetail.SelectedShipVia;

            self.agencyName(salesOrderDetail.AgencyName);
            self.salesRep(salesOrderDetail.SalesRepName);

            if (self.isPLCSalesorderRestrictionApplied()) {
                if (salesOrderDetail.PLCVendorBillId != 0) {
                    //self.actualCost($.number(parseFloat(salesOrderDetail.TotalCost.toString().replace(/,/g, "")) , 2));
                    self.totalActualSummaryCost($.number(parseFloat(salesOrderDetail.TotalCost.toString().replace(/,/g, "")), 2));
                    //if (salesOrderDetail.ActualProfit.toString() != null) {
                    //	//self.actualProfit($.number(parseFloat(salesOrderDetail.ActualProfit.toString().replace(/,/g, "")), 2));
                    //	//self.totalActualProfit($.number(parseFloat(salesOrderDetail.ActualProfit.toString().replace(/,/g, "")),2));
                    //}
                }
            }
            //else
            //{
            //	if (salesOrderDetail.ActualCost.toString() != null)
            //	{
            //		//self.actualCost($.number(parseFloat(salesOrderDetail.ActualCost.toString().replace(/,/g, "")), 2));
            //		//self.totalActualSummaryCost($.number(parseFloat(salesOrderDetail.ActualCost.toString().replace(/,/g, "")), 2));

            //		if (salesOrderDetail.ActualProfit.toString() != null) {
            //			//if (self.isBillingStation() && self.vendorbillid() !== 0 && salesOrderDetail.ProcessFlow === 1) {
            //			//	self.actualProfit($.number(salesOrderDetail.ActualProfit.toString().replace(/,/g, ""),2));
            //			//	self.totalActualProfit($.number(parseFloat(salesOrderDetail.ActualProfit.toString().replace(/,/g, "")), 2));
            //			//} else {
            //			//	self.actualProfit($.number(parseFloat(salesOrderDetail.ActualProfit.toString().replace(/,/g, "")), 2));
            //			//	self.totalActualProfit($.number(parseFloat(salesOrderDetail.ActualProfit.toString().replace(/,/g, "")), 2));
            //			//}
            //		}
            //	}
            //}

            if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(salesOrderDetail.ActualCost.toString()) && salesOrderDetail.ActualCost != 0) {
                self.totalRevenue(self.CommonUtils.isNullOrEmptyOrWhiteSpaces(salesOrderDetail.TotalRevenue.toString()) ? parseFloat(salesOrderDetail.TotalRevenue.toString().replace(/,/g, "")) : 0.0);
                if (self.vendorbillid() !== 0) { // && salesOrderDetail.ProcessFlow === 1 && self.isBillingStation()
                    self.totalPLCCost($.number(self.CommonUtils.isNullOrEmptyOrWhiteSpaces(salesOrderDetail.TotalPLCCost.toString()) ? parseFloat(salesOrderDetail.TotalPLCCost.toString().replace(/,/g, "")) : 0.0, 2));
                    //self.totalActualProfit($.number(salesOrderDetail.ActualProfit, 2));
                    //self.actualProfitPer(salesOrderDetail.ActualProfitPer);
                }
                else {
                    self.totalActualProfit($.number((parseFloat(self.totalRevenue().toString().replace(/,/g, "")) - parseFloat(self.totalActualSummaryCost().toString().replace(/,/g, ""))), 2));
                    //self.actualProfitPer($.number(((parseFloat(self.totalRevenue().toString().replace(/,/g, "")) - parseFloat(self.totalActualSummaryCost().toString().replace(/,/g, ""))) / parseFloat(self.totalRevenue().toString().replace(/,/g, ""))) * 100, 2));
                }

                //self.actualProfit($.number(isNaN(parseFloat(self.totalActualProfit().toString().replace(/,/g, ""))) ? 0.0 : parseFloat(self.totalActualProfit().toString().replace(/,/g, "")), 2));
                //self.actualProfitPer($.number(isNaN(parseFloat(self.actualProfitPer().toString().replace(/,/g, ""))) ? 0.0 : parseFloat(self.actualProfitPer().toString().replace(/,/g, "")), 2));
            }

            //Calcalute Final Cost, profit
            //var finalCostVB = parseFloat(SalesOrderOriginalSODetail.MainBillCost.toString().replace(/,/g, "")) - parseFloat(SalesOrderOriginalSODetail.GrossDispute.toString().replace(/,/g, ""))
            //self.finalCost($.number(parseFloat(finalCostVB.toString().replace(/,/g, "")), 2));

            ////self.finalRevenue($.number(parseFloat(SalesOrderShipmentProfitDetail.GrossRevenue.toString().replace(/,/g, "")), 2));
            //if (self.isBillingStation() && self.vendorbillid() !== 0 && salesOrderDetail.ProcessFlow === 1)
            //{
            //	//AP,CRR
            //	if (self.isSalesorderRequoteAllowed())
            //	{
            //		self.calculateFinalProfitAndPerc(salesOrderDetail.TotalPLCCost, finalCostVB);
            //	}
            //	//PlcAdmin,PlcSalesAdmin
            //	else if (self.isPLCSalesorderRestrictionApplied()) {
            //		self.calculateFinalProfitAndPerc(salesOrderDetail.TotalRevenue, finalCostVB);
            //	}
            //	//BS User
            //	else {
            //		//self.finalProfit($.number(salesOrderDetail.ActualProfit, 2));
            //		//self.finalProfitPer($.number(salesOrderDetail.ActualProfitPer, 2));

            //		//self.calculateFinalProfitAndPerc(salesOrderDetail.TotalRevenue, finalCostVB);
            //		self.finalBSCost($.number(parseFloat(SalesOrderShipmentProfitDetail.GrossBSCost.toString().replace(/,/g, "")), 2));
            //		self.calculateFinalProfitAndPerc(self.finalBSCost(), self.finalCost());
            //	}
            //}
            //else {
            //	if (self.isBillingStation()) {
            //		self.finalBSCost($.number(parseFloat(SalesOrderShipmentProfitDetail.GrossBSCost.toString().replace(/,/g, "")), 2));
            //		self.calculateFinalProfitAndPerc(self.finalBSCost(), self.finalCost());
            //	} else {
            //		self.calculateFinalProfitAndPerc(salesOrderDetail.TotalRevenue, finalCostVB);
            //	}
            //}

            //if (SalesOrderOriginalSODetail.RowCount == 0) {
            //	self.populateOriginalSalesOrder(salesOrderDetail.Cost, salesOrderDetail.PlcCost, salesOrderDetail.Revenue, SalesOrderOriginalSODetail.GrossDispute);
            //} else {
            //	self.populateOriginalSalesOrder(SalesOrderOriginalSODetail.EstimatedCost, SalesOrderOriginalSODetail.EstimatedBSCost, SalesOrderOriginalSODetail.EstimatedRevenue, SalesOrderOriginalSODetail.GrossDispute);
            //}

            if (SalesOrderShipmentProfitDetail.GrossCost === null || SalesOrderShipmentProfitDetail.GrossCost === undefined) {
                self.grosscost(0);
            }
            else {
                if (salesOrderDetail.Cost == null || salesOrderDetail.Cost === undefined) {
                    self.grosscost(parseFloat(SalesOrderShipmentProfitDetail.GrossCost.toFixed(2).toString().replace(/,/g, "")) - 0);
                }
                else {
                    self.grosscost(parseFloat(SalesOrderShipmentProfitDetail.GrossCost.toFixed(2).toString().replace(/,/g, "")) - parseFloat(salesOrderDetail.Cost.toFixed(2).toString().replace(/,/g, "")));
                }
            }
            self.gcost(self.grosscost());
            //self.finalBSCost($.number(parseFloat(SalesOrderShipmentProfitDetail.GrossBSCost.toString().replace(/,/g, "")), 2));
            self.UpdatedDateTime(salesOrderDetail.UpdatedDateTime);
            self.mainBolNo(salesOrderDetail.MainBolNo);
            //self.salesOrderId(salesOrderDetail.VendorBillId);

			// ##START: US22054
			self.TariffStartDate = salesOrderDetail.TariffStartDate;
			self.TariffStartDateDisplay(salesOrderDetail.TariffStartDateDisplay);
			self.TariffNumber(salesOrderDetail.TariffNumber);
			// ##END: US22054

            //##START: DE21287
            if (salesOrderDetail.ServiceType === refEnums.Enums.ServiceType.Truckload.ID) {
                self.isDisableBookedDateLink(true);
            }
            else {
                self.isDisableBookedDateLink(false);
            }
            //##END: DE21287


            //##START: DE22970
            if (salesOrderDetail.Id !== null && salesOrderDetail.Id !==0) {
                self.isDisableBookedDate(true);
            }
            else {
                self.isDisableBookedDate(false);
            }
			//##END: DE22970

			// ###START: DE23916
			self.billToLocationType = salesOrderDetail.BillToLocationType;

			// ###END: DE23916
            self.SetBITrackChange(self);
        }

        self.isNotAtLoadingTime = false;
        self.carrierSearchList.isNotAtLoadingTime = false;
    }

    public initalizeMasCustomer(data: IMASCustomerFields) {
        var self = this;
        self.MasCustomer(data.CustomerId);
        self.MasCustomerName(data.CustomerName);
        self.progressClass('');
    }

    //#region if user any numeric  date  without any format
    private convertToBookedDate() {
        var self = this;
        if (!self.bookedDate().match('/') && self.bookedDate().length > 0) {
            self.bookedDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.bookedDate()));
            self.SetBITrackChange(self);
        }


    }
    //#endregion

    //Validating SalesOrder Details
    public validateSalesOrder() {
        var self = this;
        self.customerSearchList.vaildateSearchCustomerNameControl();
        self.carrierSearchList.vaildateSearchVendorNameControl();
        if (self.errorSalesOrderDetail.errors().length != 0) {
            self.errorSalesOrderDetail.errors.showAllMessages();
            return true;
        } else {
            return false;
        }
    }

    //sets the tracking extension for VB required fields
    SetBITrackChange(self) {
        //** To detect changes for Vendor Bill
        self.selectedShipVia.extend({ trackChange: true });
        self.customerSearchList.customerName.extend({ trackChange: true });
        self.bookedDate.extend({ trackChange: true });
        self.proNumber.extend({ trackChange: true });
        self.poNumber.extend({ trackChange: true });
        self.puNumber.extend({ trackChange: true });
        self.carrierSearchList.vendorName.extend({ trackChange: true });
        self.selectedOrderStatus.extend({ trackChange: true });
    }

    public cleanUp() {
        var self = this;

        self.customerSearchList.cleanup();
        self.carrierSearchList.cleanUp();

        self.customerName.dispose();
        self.customerId.dispose();
        self.isBIDirty.dispose();

        for (var property in self) {
            if (property != "cleanup")
                delete self[property];
        }

        delete self;
    }

    //#endregion

    //#region Life Cycle Event
    public compositionComplete(view, parent) {
        var self = this;
        if (!self.isCarrierEditable()) {
            self.carrierSearchList.isEnable(self.isCarrierEditable());
        }
        if (!self.isCustomerEditable()) {
            self.customerSearchList.isEnable(self.isCustomerEditable());
        }
    }

    public activate() {
        return true;
    }

    public deactivate() {
        var self = this;
        return true;
    }

    //** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
    public attached() {
        _app.trigger('viewAttached');
    }
    //#endregion
}