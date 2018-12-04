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
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/models/common/Enums', 'services/validations/Validations', 'services/client/SalesOrderClient', 'services/models/common/searchVendorName', 'templates/searchVendorNameControl', 'templates/searchCustomerAutoComplete', 'services/models/common/searchCustomerName'], function(require, exports, ___router__, ___app__, __refEnums__, __refValidations__, __refSalesOrderClient__, __refCarrierSearchModel__, __refCarrierSearchControl__, __refCustomerSearchControl__, __refCustomerSearchModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    var refEnums = __refEnums__;
    var refValidations = __refValidations__;
    var refSalesOrderClient = __refSalesOrderClient__;
    var refCarrierSearchModel = __refCarrierSearchModel__;
    var refCarrierSearchControl = __refCarrierSearchControl__;
    var refCustomerSearchControl = __refCustomerSearchControl__;
    var refCustomerSearchModel = __refCustomerSearchModel__;

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
    var SalesOrderDetailsViewModel = (function () {
        // ###END: DE23916
        //#endregion
        //#region Constructor
        function SalesOrderDetailsViewModel(chnageCustomerId, keyListenerCallBack, changeServiceType, currentUser, isSOEntry) {
            // sales order client class reference
            this.salesOrderClient = null;
            // ship via list array object and selected ship via object
            this.shipViaList = ko.observableArray([]);
            this.selectedShipVia = ko.observable();
            // order status list array object and selected order status object
            this.orderStatusList = ko.observableArray([]);
            this.selectedOrderStatus = ko.observable();
            //invoice status list array object and selected invoice status object
            this.invoiceStatusList = ko.observableArray([]);
            this.selectedInvoiceStatus = ko.observable();
            // To get the logged in user
            this._currentUser = ko.observable();
            // sales rep name
            this.salesRep = ko.observable('');
            this.salesRepId = ko.observable(0);
            this.agencyName = ko.observable('');
            this.tariffType = ko.observable('');
            this.shipmentCarrierType = ko.observable(0);
            // common utils class object
            this.commonUtils = new Utils.Common();
            // initialize observable for updating views
            this.salesOrderId = ko.observable(0);
            this.proNumber = ko.observable('');
            this.bookedDate = ko.observable('');
            this.originZip = ko.observable('').extend({ required: { message: "A valid origin is required." } });
            this.destinationZip = ko.observable('').extend({ required: { message: "A valid destination is required." } });
            this.customerBolNumber = ko.observable('');
            this.poNumber = ko.observable('');
            this.salesOrderNumber = ko.observable('');
            this.puNumber = ko.observable('');
            this.totalPieces = ko.observable();
            this.totalWeigth = ko.observable();
            this.totalRevenue = ko.observable();
            this.salesOrderAmount = ko.observable();
            this.salesOrderRevenue = ko.observable();
            this.dispute = ko.observable($.number(0, 2));
            this.actualProfitPer = ko.observable($.number(0, 2));
            this.actualProfit = ko.observable($.number(0, 2));
            this.actualCost = ko.observable($.number(0, 2));
            this.finalProfitPer = ko.observable($.number(0, 2));
            this.estimatedProfitPer = ko.observable($.number(0, 2));
            this.finalProfit = ko.observable($.number(0, 2));
            this.estimatedProfit = ko.observable($.number(0, 2));
            this.finalCost = ko.observable($.number(0, 2));
            this.estimatedCost = ko.observable($.number(0, 2));
            this.finalRevenue = ko.observable($.number(0, 2));
            this.originalFinalRevenue = ko.observable(0);
            this.estimatedRevenue = ko.observable($.number(0, 2));
            this.isPLCSalesorderRestrictionApplied = ko.observable(false);
            this.isSalesorderRequoteAllowed = ko.observable(false);
            this.isBillingStation = ko.observable(false);
            this.totalActualSummaryCost = ko.observable($.number(0, 2));
            this.totalActualProfit = ko.observable($.number(0, 2));
            this.totalPLCCost = ko.observable($.number(0, 2));
            this.estimateBSCost = ko.observable($.number(0, 2));
            this.finalBSCost = ko.observable($.number(0, 2));
            this.gtzMargin = ko.observable($.number(0, 2));
            this.isBscost = ko.observable(false);
            this.isProcessFlow = ko.observable(0);
            this.notIsBscost = ko.observable(false);
            this.UpdatedDateTime = ko.observable(0);
            this.grosscost = ko.observable(0);
            this.gcost = ko.observable(0);
            this.feeStructure = ko.observable(0);
            this.vendorbillid = ko.observable(0);
            this.plcMargin = ko.observable(0);
            this.gtMinMargin = ko.observable(0);
            this.customerTypeOf = ko.observable(0);
            this.isSaveEnable = ko.observable(true);
            //##START: DE21287
            this.isDisableBookedDateLink = ko.observable(false);
            //##END: DE21287
            //##START: DE22970
            this.isDisableBookedDate = ko.observable(false);
            //##END: DE22970
            this.grossProfit = ko.observable(0);
            // test box width with error and without error
            this.errorWidth = ko.observable('188px');
            this.normalWidth = ko.observable('206px');
            this.isInoviceDisabled = ko.observable(true);
            this.isCallForEdit = ko.observable(false);
            //Flag which specified whether status is Manually Finalized or Not??
            this.isManuallyFinalizedStatus = ko.observable(false);
            this.mainBolNo = ko.observable('');
            this.isCarrierEditable = ko.observable(true);
            this.isCustomerEditable = ko.observable(true);
            this.isNotAtLoadingTime = false;
            this.returnValueFlag = false;
            // Utility class object
            this.CommonUtils = new Utils.Common();
            //
            this.costDiff = ko.observable($.number(0, 2));
            //Using Only for calculation
            this.soFinalCost = ko.observable(0);
            //Using Only for calculation
            this.soOriginalFinalBSCost = ko.observable(0);
            this.MasCustomer = ko.observable(0);
            this.progressClass = ko.observable('');
            this.MasCustomerName = ko.observable('');
            //##START: US22419
            this.factorCompany = ko.observable('');
            this.masVendorId = ko.observable('');
            this.TariffStartDateDisplay = ko.observable('');
            this.TariffNumber = ko.observable('');
            var self = this;
            self.chnageCustomerId = chnageCustomerId;
            self.changeServiceType = changeServiceType;

            // get the object of sales order client
            self.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
            self.isBscost(false);
            self.notIsBscost(true);
            self.keyListenerCallBack = keyListenerCallBack;
            self.customerSearchList = new refCustomerSearchControl.SearchCustomerAutoComplete("A valid Customer Name is required.", function (salesRep, agencyName, agencyID, agentID) {
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
            var shipViaLength = self.shipViaList().length;
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
            var orderStatusLength = self.orderStatusList().length;
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
                        validator: function () {
                            return new Date(self.bookedDate()) >= (new Date(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy')));
                        },
                        message: 'Booked Date cannot be Past Date'
                    }
                ]
            });

            // initialize the booked date as today date
            self.bookedDate(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'));

            //track changes
            self.SetBITrackChange(self);

            self.getBITrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            self.isBIDirty = ko.computed(function () {
                var result = self.proNumber();
                result = self.customerSearchList.customerName();
                result = self.poNumber();
                result = self.puNumber();
                result = self.carrierSearchList.vendorName();
                result = self.bookedDate();
                var result1 = self.selectedShipVia();
                var result2 = self.selectedOrderStatus();

                if (self.isNotAtLoadingTime)
                    return false;

                var returnValue = self.getBITrackChange().length > 0 ? true : false;
                self.returnValueFlag = returnValue;
                if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
                    self.onChangesMade(returnValue);

                return returnValue;
            });

            // Load invoice status if not loaded already
            var invoiceStatusLength = self.invoiceStatusList().length;
            if (!(invoiceStatusLength)) {
                _app.trigger("GetInvoiceStatusListForSOEntry", function (data) {
                    if (data) {
                        self.invoiceStatusList.removeAll();
                        self.invoiceStatusList.push.apply(self.invoiceStatusList, data);
                    }
                });
            }

            if (currentUser) {
                self._currentUser(currentUser);
            }

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
                placeBelowButton: false
            };

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

            // get selected customer Name and customer id
            self.customerId = ko.computed(function () {
                if (self.customerSearchList.name() != null) {
                    self.chnageCustomerId(self.customerSearchList.id());
                    return self.customerSearchList.id();
                }

                return 0;
            });

            self.customerName = ko.computed(function () {
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
            self.isTabPress = function (data, event) {
                var charCode = (event.which) ? event.which : event.keyCode;

                if ((charCode === 9)) {
                    self.keyListenerCallBack();
                }
                return true;
            };

            self.selectedShipVia.subscribe(function (newValue) {
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
        SalesOrderDetailsViewModel.prototype.initializeSalesOrderFinancialDetails = function (data) {
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
        };

        // initialize sales order details
        SalesOrderDetailsViewModel.prototype.initializeSalesOrderDetails = function (salesOrderDetail, SalesOrderShipmentProfitDetail, SalesOrderOriginalSODetail, CustomerBSPlcMarginInfo) {
            var self = this;

            // This will prevent to detect the changes at first time
            self.isNotAtLoadingTime = true;
            self.carrierSearchList.isNotAtLoadingTime = true;
            if (salesOrderDetail != null) {
                self.progressClass('icon-spinner icon-spin active');
                self.customerTypeOf(CustomerBSPlcMarginInfo.GetCustomerType);
                self.isSaveEnable(salesOrderDetail.IsSaveEnable);

                if (CustomerBSPlcMarginInfo.GetCustomerType == refEnums.Enums.CustomerType.PLC_Customer.ID) {
                    self.isBillingStation(false);
                    self.gtzMargin($.number(CustomerBSPlcMarginInfo.GTMargin, 2));
                    self.plcMargin($.number(CustomerBSPlcMarginInfo.PlcMargin, 2));
                    self.feeStructure(CustomerBSPlcMarginInfo.FeeStructure);
                    self.gtMinMargin($.number(CustomerBSPlcMarginInfo.GTMarginMin, 2));
                } else if (CustomerBSPlcMarginInfo.GetCustomerType == refEnums.Enums.CustomerType.BillingStation_Customer.ID) {
                    self.isBillingStation(true);
                    self.gtzMargin($.number(CustomerBSPlcMarginInfo.GTMargin, 2));
                    self.plcMargin($.number(CustomerBSPlcMarginInfo.PlcMargin, 2));
                    self.feeStructure(CustomerBSPlcMarginInfo.FeeStructure);
                    self.gtMinMargin($.number(CustomerBSPlcMarginInfo.GTMarginMin, 2));
                } else {
                    self.isBillingStation(false);
                    self.gtzMargin(0);
                    self.gtMinMargin($.number(CustomerBSPlcMarginInfo.GTMarginMin, 2));
                }
                self.isProcessFlow(salesOrderDetail.ProcessFlow);
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

                if (salesOrderDetail.OrderStatusList) {
                    self.orderStatusList.removeAll();
                    self.orderStatusList.push.apply(self.orderStatusList, salesOrderDetail.OrderStatusList);
                    self.selectedOrderStatus(salesOrderDetail.ProcessStatusId);
                }
                self.selectedInvoiceStatus(salesOrderDetail.InvoiceStatus);

                var shipViaLength = self.shipViaList().length;
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

                if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(salesOrderDetail.ActualCost.toString()) && salesOrderDetail.ActualCost != 0) {
                    self.totalRevenue(self.CommonUtils.isNullOrEmptyOrWhiteSpaces(salesOrderDetail.TotalRevenue.toString()) ? parseFloat(salesOrderDetail.TotalRevenue.toString().replace(/,/g, "")) : 0.0);
                    if (self.vendorbillid() !== 0) {
                        self.totalPLCCost($.number(self.CommonUtils.isNullOrEmptyOrWhiteSpaces(salesOrderDetail.TotalPLCCost.toString()) ? parseFloat(salesOrderDetail.TotalPLCCost.toString().replace(/,/g, "")) : 0.0, 2));
                        //self.totalActualProfit($.number(salesOrderDetail.ActualProfit, 2));
                        //self.actualProfitPer(salesOrderDetail.ActualProfitPer);
                    } else {
                        self.totalActualProfit($.number((parseFloat(self.totalRevenue().toString().replace(/,/g, "")) - parseFloat(self.totalActualSummaryCost().toString().replace(/,/g, ""))), 2));
                        //self.actualProfitPer($.number(((parseFloat(self.totalRevenue().toString().replace(/,/g, "")) - parseFloat(self.totalActualSummaryCost().toString().replace(/,/g, ""))) / parseFloat(self.totalRevenue().toString().replace(/,/g, ""))) * 100, 2));
                    }
                    //self.actualProfit($.number(isNaN(parseFloat(self.totalActualProfit().toString().replace(/,/g, ""))) ? 0.0 : parseFloat(self.totalActualProfit().toString().replace(/,/g, "")), 2));
                    //self.actualProfitPer($.number(isNaN(parseFloat(self.actualProfitPer().toString().replace(/,/g, ""))) ? 0.0 : parseFloat(self.actualProfitPer().toString().replace(/,/g, "")), 2));
                }

                if (SalesOrderShipmentProfitDetail.GrossCost === null || SalesOrderShipmentProfitDetail.GrossCost === undefined) {
                    self.grosscost(0);
                } else {
                    if (salesOrderDetail.Cost == null || salesOrderDetail.Cost === undefined) {
                        self.grosscost(parseFloat(SalesOrderShipmentProfitDetail.GrossCost.toFixed(2).toString().replace(/,/g, "")) - 0);
                    } else {
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

                if (salesOrderDetail.ServiceType === refEnums.Enums.ServiceType.Truckload.ID) {
                    self.isDisableBookedDateLink(true);
                } else {
                    self.isDisableBookedDateLink(false);
                }

                if (salesOrderDetail.Id !== null && salesOrderDetail.Id !== 0) {
                    self.isDisableBookedDate(true);
                } else {
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
        };

        SalesOrderDetailsViewModel.prototype.initalizeMasCustomer = function (data) {
            var self = this;
            self.MasCustomer(data.CustomerId);
            self.MasCustomerName(data.CustomerName);
            self.progressClass('');
        };

        //#region if user any numeric  date  without any format
        SalesOrderDetailsViewModel.prototype.convertToBookedDate = function () {
            var self = this;
            if (!self.bookedDate().match('/') && self.bookedDate().length > 0) {
                self.bookedDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.bookedDate()));
                self.SetBITrackChange(self);
            }
        };

        //#endregion
        //Validating SalesOrder Details
        SalesOrderDetailsViewModel.prototype.validateSalesOrder = function () {
            var self = this;
            self.customerSearchList.vaildateSearchCustomerNameControl();
            self.carrierSearchList.vaildateSearchVendorNameControl();
            if (self.errorSalesOrderDetail.errors().length != 0) {
                self.errorSalesOrderDetail.errors.showAllMessages();
                return true;
            } else {
                return false;
            }
        };

        //sets the tracking extension for VB required fields
        SalesOrderDetailsViewModel.prototype.SetBITrackChange = function (self) {
            //** To detect changes for Vendor Bill
            self.selectedShipVia.extend({ trackChange: true });
            self.customerSearchList.customerName.extend({ trackChange: true });
            self.bookedDate.extend({ trackChange: true });
            self.proNumber.extend({ trackChange: true });
            self.poNumber.extend({ trackChange: true });
            self.puNumber.extend({ trackChange: true });
            self.carrierSearchList.vendorName.extend({ trackChange: true });
            self.selectedOrderStatus.extend({ trackChange: true });
        };

        SalesOrderDetailsViewModel.prototype.cleanUp = function () {
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
        };

        //#endregion
        //#region Life Cycle Event
        SalesOrderDetailsViewModel.prototype.compositionComplete = function (view, parent) {
            var self = this;
            if (!self.isCarrierEditable()) {
                self.carrierSearchList.isEnable(self.isCarrierEditable());
            }
            if (!self.isCustomerEditable()) {
                self.customerSearchList.isEnable(self.isCustomerEditable());
            }
        };

        SalesOrderDetailsViewModel.prototype.activate = function () {
            return true;
        };

        SalesOrderDetailsViewModel.prototype.deactivate = function () {
            var self = this;
            return true;
        };

        //** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
        SalesOrderDetailsViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };
        return SalesOrderDetailsViewModel;
    })();
    exports.SalesOrderDetailsViewModel = SalesOrderDetailsViewModel;
});
