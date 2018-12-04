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
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../services/models/salesOrder/RequoteBillModel.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'salesOrder/SalesOrderReBillItemView', 'salesOrder/SalesOrderOptionButtonControl', 'services/models/common/Enums', 'services/models/salesOrder/RequoteBillModel', 'services/client/SalesOrderClient', 'services/validations/Validations', 'services/models/salesOrder/SalesOrderShipmentRequoteReason', 'salesOrder/SalesOrderRebillVendorItemView', 'salesOrder/SalesOrderAuditView'], function(require, exports, ___router__, ___app__, __refSalesOrderReBillItemViewModel__, __refSalesOrderOptionButtonControl__, __refEnums__, __refRequote__, __refSalesOrderClient__, __refValidations__, __refSalesOrderRequoteReason__, __refSalesOrderReBillVendorItemViewModel__, __refSalesOrderAuditViewModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refSalesOrderReBillItemViewModel = __refSalesOrderReBillItemViewModel__;
    var refSalesOrderOptionButtonControl = __refSalesOrderOptionButtonControl__;
    var refEnums = __refEnums__;
    var refRequote = __refRequote__;
    var refSalesOrderClient = __refSalesOrderClient__;
    var refValidations = __refValidations__;
    var refSalesOrderRequoteReason = __refSalesOrderRequoteReason__;
    
    
    
    var refSalesOrderReBillVendorItemViewModel = __refSalesOrderReBillVendorItemViewModel__;
    var refSalesOrderAuditViewModel = __refSalesOrderAuditViewModel__;
    

    //#endregion
    /*
    ** <summary>
    ** Sales Order Rebill View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US13230</id> <by>Sankesh</by> <date>10th Nov, 2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>DE21390</id> <by>Vasanthakumar</by> <date>22-01-2016</date> <description>System shows Change Detection message when user navigate to ReBill tab & try to navigate to other page</description>
    ** <id>US23162</id> <by>Vasanthakumar</by> <date>05-07-2016</date> <description>Acct: Rebill rep Logic</description>
    ** <id>US24389</id> <by>Shreesha Adiga</by> <date>31-08-2016</date> <description>Fetch Truckload Acessorials if the order is TL</description>
    ** </changeHistory>
    */
    var SalesOrderReBillViewModel = (function () {
        //##END: US24389
        //#endregion
        //#region Constructor
        // ###START: US22365
        function SalesOrderReBillViewModel(revenueCallBack) {
            this.adjustedOrderItemList = ko.observableArray([]);
            this.copyAdjustedOrderItemList = ko.observableArray([]);
            this.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
            this.name = ko.observable('Other');
            this.rebillRep = ko.observable('');
            this.requoteReasonid = ko.observable(0);
            this.isOtherReason = ko.observable(false);
            this.otherReason = ko.observable('');
            this.costDiff = ko.observable($.number(0, 2));
            this.estimatedProfitPerc = ko.observable($.number(0, 2));
            this.finalProfitPerc = ko.observable($.number(0, 2));
            this.html = ko.observable('');
            this.crrReviewDate = ko.observable('');
            this.adjustmentDate = ko.observable('');
            this.salesOrderId = ko.observable('');
            this.shipmentId = ko.observable(0);
            this.calculateRevenue = ko.observable(false);
            this.isBillingStation = ko.observable(false);
            this.gtzMargin = ko.observable($.number(0, 2));
            this.feeStructure = ko.observable(0);
            this.plcMargin = ko.observable(0);
            this.gtMinMargin = ko.observable(0);
            this.plcorBSCost = ko.observable(0);
            this.plcorBSRevenue = ko.observable(0);
            this.customerTypeOf = ko.observable(0);
            this.btnCopyEnable = ko.observable(false);
            this.auditFeeItemsList = ko.observableArray([]);
            this.requoteReasonsList = ko.observableArray([]);
            this.salesOrderOptionListOptions = ko.observableArray([]);
            // common utils class object
            this.commonUtils = new Utils.Common();
            this.shipmentItemTypes = ko.observableArray([]);
            this.matchrowArray = ko.observableArray([]);
            this.processLog = ko.observable('');
            this.isSaveEnable = ko.observable(true);
            this.checkMsgDisplay = true;
            // ###END: US22365
            this.listProgress = ko.observable(false);
            this.isCallAgain = true;
            // To get the logged in user
            this.currentUser = ko.observable();
            this.returnValue = false;
            this.ischange = false;
            this.isNotAtLoadingTime = false;
            this.originZip = ko.observable('');
            this.destinationZip = ko.observable('');
            // to hold vendor bill id to fetch address
            this.vendorBillId = ko.observable(0);
            //##START: US24389
            this.isTruckloadOrder = false;
            // ###END: US22365
            var self = this;
            self.revenueChanged = revenueCallBack;
            self.salesOrderReBillOriginalItemViewModel = new refSalesOrderReBillItemViewModel.SalesOrderReBillItemViewModel();
            self.salesOrderReBillAdjustItemViewModel = new refSalesOrderReBillItemViewModel.SalesOrderReBillItemViewModel();
            self.salesOrderReBillVendorItemViewModel = new refSalesOrderReBillVendorItemViewModel.SalesOrderRebillVendorBillItemViewModel();
            self.salesOrderAuditViewModel = new refSalesOrderAuditViewModel.SalesOrderAuditViewModel();
            self.bindRequoteReasonCodes();

            //To set The date picker options
            self.datepickerOptions = {
                blockWeekend: true,
                blockPreviousDays: false,
                blockHolidaysDays: true,
                autoClose: true,
                placeBelowButton: false
            };

            //To check if Msg is clicked
            self.checkMsgClick = function () {
                self.checkMsgDisplay = true;
            };

            // to Check if Msg is hidden or closed
            self.checkMsgHide = function () {
                self.checkMsgDisplay = true;
            };

            if (!self.currentUser()) {
                // Get the logged in user for name for new note}
                _app.trigger("GetCurrentUserDetails", function (currentUser) {
                    self.currentUser(currentUser);
                });
            }

            //track changes
            self.SetBITrackChange(self);

            self.getBITrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            self.isBIDirty = ko.computed(function () {
                var result = self.crrReviewDate();
                result = self.otherReason();

                if (self.isNotAtLoadingTime)
                    return false;

                var returnValue = self.getBITrackChange().length > 0 ? true : false;
                self.returnValue = returnValue;
                if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
                    self.onChangesMade(returnValue);

                return returnValue;
            });
        }
        //#endregion}
        //#region Internal public Methods
        SalesOrderReBillViewModel.prototype.initializeReBillDetails = function (salesOrderId, totalCost, estimatedProfitPerc, finalProfitPerc, isBillingStation, gtzMargin, plcMargin, feeStructure, gtMinMargin, customerTypeOf, finalcost, isSubOrder, vbCost, soCost, enable, itemlist) {
            var self = this;

            if (self.isTruckloadOrder) {
                self.salesOrderReBillOriginalItemViewModel.populateTruckloadAccessorials();
                self.salesOrderReBillAdjustItemViewModel.populateTruckloadAccessorials();
            }

            // ##END: US24389
            self.isNotAtLoadingTime = true;
            self.salesOrderId(salesOrderId.toString());
            self.shipmentId(salesOrderId);
            self.btnCopyEnable(enable);
            self.isSaveEnable(enable);
            self.estimatedProfitPerc(estimatedProfitPerc);
            self.finalProfitPerc(finalProfitPerc);
            self.gtzMargin(gtzMargin);
            self.feeStructure(feeStructure);
            self.plcMargin(plcMargin);
            self.gtMinMargin(gtMinMargin);
            self.isBillingStation(isBillingStation);
            self.customerTypeOf(customerTypeOf);
            self.salesOrderReBillOriginalItemViewModel.selected(false);
            self.listProgress(true);

            if (isSubOrder) {
                self.costDiff($.number(parseFloat(vbCost.toString().replace(/,/g, "")) - parseFloat(soCost.toString().replace(/,/g, "")), 2));
            } else {
                if (totalCost === undefined || totalCost === null) {
                    self.costDiff($.number(parseFloat(finalcost.toString().replace(/,/g, "")) - 0, 2));
                } else {
                    self.costDiff($.number(parseFloat(finalcost.toString().replace(/,/g, "")) - parseFloat(totalCost.toString().replace(/,/g, "")), 2));
                }
            }

            self.salesOrderReBillVendorItemViewModel.gridHeader("Vendor Bill Items");
            self.salesOrderReBillVendorItemViewModel.isSelect(false);
            self.GetVendorBillItems();

            var successCallBack = function (data) {
                //// ###START: DE21390
                self.isNotAtLoadingTime = true;

                if (data != null)
                    self.salesOrderReBillOriginalItemViewModel.initializeSalesOrderRebillItemDetails(data.OriginalItemDetail, self.btnCopyEnable());

                //self.adjustedOrderItemList(data.AdjustedItemDetail);
                self.salesOrderReBillOriginalItemViewModel.isSelect(true);
                self.salesOrderReBillOriginalItemViewModel.isBOLnumber(false);
                self.salesOrderReBillOriginalItemViewModel.isRev(true);
                self.salesOrderReBillOriginalItemViewModel.isHaz(true);
                self.salesOrderReBillOriginalItemViewModel.gridHeader("Original Order");

                if (!isSubOrder) {
                    self.salesOrderReBillAdjustItemViewModel.initializeSalesOrderRebillItemDetails(data.AdjustedItemDetail, self.btnCopyEnable());
                }

                self.salesOrderReBillAdjustItemViewModel.isSelect(false);
                self.salesOrderReBillAdjustItemViewModel.isBOLnumber(true);
                self.salesOrderReBillAdjustItemViewModel.isRev(true);
                self.salesOrderReBillAdjustItemViewModel.isHaz(true);
                self.salesOrderReBillAdjustItemViewModel.gridHeader("Adjusted Order");

                if (self.isBillingStation()) {
                    self.salesOrderReBillAdjustItemViewModel.isBSCost(true);
                    self.salesOrderReBillOriginalItemViewModel.isBSCost(true);
                } else {
                    self.salesOrderReBillAdjustItemViewModel.isBSCost(false);
                    self.salesOrderReBillOriginalItemViewModel.isBSCost(false);
                }

                if (data.SalesOrderRequoteReviewDetails != null) {
                    self.requoteReasonid(data.SalesOrderRequoteReviewDetails.ID);

                    if (!isSubOrder) {
                        self.adjustmentDate(data.SalesOrderRequoteReviewDetails.AdjustmentDate ? self.commonUtils.formatDate(data.SalesOrderRequoteReviewDetails.AdjustmentDate.toString(), 'mm/dd/yyyy') : '');
                        self.crrReviewDate(data.SalesOrderRequoteReviewDetails.CRReviewDate ? self.commonUtils.formatDate(data.SalesOrderRequoteReviewDetails.CRReviewDate.toString(), 'mm/dd/yyyy') : '');
                    } else {
                        self.adjustmentDate('');
                        self.crrReviewDate('');
                    }
                }

                if (data.RebillRep != null) {
                    self.rebillRep(data.RebillRep);
                } else {
                    self.rebillRep('');
                }

                // ###END: US23162
                self.auditFeeItemsList.removeAll();
                data.SalesOrderRequoteReasonCodes.forEach(function (item) {
                    self.auditFeeItemsList.push(new refRequote.Model.RequoteBillModel(item));
                });

                self.requoteReasonsList.removeAll();
                data.SalesOrderShipmentRequoteReasons.forEach(function (item) {
                    self.requoteReasonsList.push(new refSalesOrderRequoteReason.Model.SalesOrderShipmentRequoteReason(item));
                });

                self.requoteReasonsList().forEach(function (reasonItem) {
                    if (reasonItem.RequoteReasonID == 11) {
                        if (!isSubOrder) {
                            self.isOtherReason(true);
                            self.otherReason(reasonItem.Remarks);
                        } else {
                            self.isOtherReason(false);
                            self.otherReason('');
                        }
                        self.html('<i class="icon-ok icon-white active"></i>' + self.name());
                    }
                });
                self.salesOrderOptionListOptions.removeAll();
                if (self.auditFeeItemsList().length > 0) {
                    self.auditFeeItemsList().forEach(function (item) {
                        if (item.id != 11) {
                            var check = false;

                            if (!isSubOrder) {
                                self.requoteReasonsList().forEach(function (reasonItem) {
                                    if (reasonItem.RequoteReasonID == item.id) {
                                        check = true;
                                    }
                                });
                            }
                            self.salesOrderOptionListOptions.push({ id: item.id, name: item.name, selected: check, enabled: self.isSaveEnable() ? item.IsEnable : false });
                        }
                    });
                    var argssalesOrderOptionList = {
                        options: self.salesOrderOptionListOptions(),
                        useHtmlBinding: true,
                        isMultiCheck: true,
                        isVerticalView: false,
                        enabled: self.isSaveEnable()
                    };

                    self.obcSalesOrderOptionList.initializeButton(argssalesOrderOptionList, refEnums.Enums.OptionButtonsView.Matrix);
                }
                self.isCallAgain = false;
                self.listProgress(false);
                self.SetBITrackChange(self);

                //// ###START: DE21390
                self.ischange = false;
                self.returnValue = false;
                self.isNotAtLoadingTime = false;
                //// ###END: DE21390
            }, faliureCallBack = function () {
                self.listProgress(false);
            };

            self.salesOrderClient.GetSalesOrderRebill(salesOrderId.toString(), successCallBack, faliureCallBack);

            self.isNotAtLoadingTime = false;
        };

        //sets the tracking extension for BI required fields
        SalesOrderReBillViewModel.prototype.SetBITrackChange = function (self) {
            //** To detect changes for Vendor Bill
            self.crrReviewDate.extend({ trackChange: true });
            self.otherReason.extend({ trackChange: true });
        };

        //#endregion
        SalesOrderReBillViewModel.prototype.bindRequoteReasonCodes = function () {
            var self = this;

            //To set the checkbox bill option values
            var SalesOrderOptionListOptions = [{ id: refEnums.Enums.vendorBillOptionConstant.MakeInactive, name: 'Make Inactive', selected: false }];

            //set checkbox property
            var argsvendorBillOptionList = {
                options: SalesOrderOptionListOptions,
                useHtmlBinding: true,
                isMultiCheck: true,
                isVerticalView: false
            };

            self.obcSalesOrderOptionList = new refSalesOrderOptionButtonControl.SalesOrderOptionButtonControl(argsvendorBillOptionList, refEnums.Enums.OptionButtonsView.Vertical);
        };

        //#region Internal private methods
        SalesOrderReBillViewModel.prototype.otherOption = function () {
            var self = this;

            if (!self.isOtherReason()) {
                self.isOtherReason(true);

                self.html('<i class="icon-ok icon-white active"></i>' + self.name());
            } else {
                self.isOtherReason(false);
                self.otherReason('');
            }
        };

        SalesOrderReBillViewModel.prototype.convertToCrrReviewDate = function () {
            var self = this;
            if (self.crrReviewDate() !== undefined) {
                if (!self.crrReviewDate().match('/') && self.crrReviewDate().length > 0) {
                    self.crrReviewDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.crrReviewDate()));
                }
            }
        };
        SalesOrderReBillViewModel.prototype.convertToAdjustmentDate = function () {
            var self = this;
            if (self.adjustmentDate() !== undefined) {
                if (!self.adjustmentDate().match('/') && self.adjustmentDate().length > 0) {
                    self.crrReviewDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.adjustmentDate()));
                }
            }
        };

        //For Copying Cost and Revenue
        SalesOrderReBillViewModel.prototype.copyCostRevenue = function () {
            var self = this;
            self.btnCopyEnable(false);
            var items = $.grep(self.salesOrderReBillOriginalItemViewModel.salesOrderOriginalItemsList(), function (e) {
                return e.isCheck();
            });

            // ###START: US22365
            var selectedAllItems = self.salesOrderReBillOriginalItemViewModel.selected();

            // ###END: US22365
            self.copyAdjustedOrderItemList(self.adjustedOrderItemList());
            if (items.length > 0) {
                self.revenueChanged(items, 2, selectedAllItems);
            } else {
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 3,
                        fadeOut: 3,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectanItem, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
            }
            self.btnCopyEnable(true);
        };

        //For Copying Cost
        SalesOrderReBillViewModel.prototype.copyCostOnly = function () {
            var self = this;
            self.btnCopyEnable(false);
            var items = $.grep(self.salesOrderReBillOriginalItemViewModel.salesOrderOriginalItemsList(), function (e) {
                return e.isCheck();
            });

            // ###START: US22365
            var selectedAllItems = self.salesOrderReBillOriginalItemViewModel.selected();

            // ###END: US22365
            self.copyAdjustedOrderItemList(self.adjustedOrderItemList());
            if (items.length > 0) {
                //After updating populate the items
                self.revenueChanged(items, 1, selectedAllItems);
            } else {
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 3,
                        fadeOut: 3,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectanItem, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
            }
            self.btnCopyEnable(true);
        };

        SalesOrderReBillViewModel.prototype.GetVendorBillItems = function () {
            var self = this;

            //self.listProgress(true);
            var successCallBack = function (data) {
                //self.listProgress(false);
                var commonUtils = new Utils.Common();
                data.forEach(function (item) {
                    if (item.IsMainVendorBill) {
                        self.vendorBillId(item.VendorBillId);
                    }
                });
                self.getVendorBillAddress();
                self.salesOrderReBillVendorItemViewModel.InitializeVendorBillItems(data);
            }, faliureCallBack = function () {
                //self.listProgress(false);
            };
            self.salesOrderClient.GetVendorBillItemsForInvoiceResolution(self.shipmentId(), successCallBack, faliureCallBack);
            //self.listProgress(false);
        };

        // To get vendor bill Addresses for Rebill Section
        SalesOrderReBillViewModel.prototype.getVendorBillAddress = function () {
            var self = this;
            var successCallBack = function (data) {
                self.originZip(data[0].ZipCode);
                self.destinationZip(data[1].ZipCode);
                self.salesOrderAuditViewModel.initializeAuditDetails(data[0].ProcessDetails);
            }, faliureCallBack = function () {
            };
            self.salesOrderClient.GetVendorBillAddressForInvoiceResolution(self.vendorBillId(), successCallBack, faliureCallBack);
        };

        SalesOrderReBillViewModel.prototype.cleanUp = function () {
            var self = this;

            self.salesOrderReBillOriginalItemViewModel.cleanup();
            self.salesOrderReBillAdjustItemViewModel.cleanup();
            self.salesOrderReBillVendorItemViewModel.cleanup();
            self.obcSalesOrderOptionList.cleanup();

            self.adjustedOrderItemList.removeAll();
            self.auditFeeItemsList.removeAll();
            self.requoteReasonsList.removeAll();

            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }

            delete self;
        };
        return SalesOrderReBillViewModel;
    })();
    exports.SalesOrderReBillViewModel = SalesOrderReBillViewModel;
});
