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
define(["require", "exports", 'plugins/router', 'durandal/app', 'salesOrder/SalesOrderReBillItemView', 'salesOrder/SalesOrderOptionButtonControl', 'services/models/common/Enums', 'services/models/salesOrder/RequoteBillModel', 'services/client/SalesOrderClient', 'services/validations/Validations', 'services/models/salesOrder/SalesOrderREBillContainer', 'services/models/salesOrder/SalesOrderShipmentRequoteReason', 'services/models/salesOrder/SalesOrderRequoteReviewDetail', 'salesOrder/SalesOrderRebillVendorItemView'], function(require, exports, ___router__, ___app__, __refSalesOrderReBillItemViewModel__, __refSalesOrderOptionButtonControl__, __refEnums__, __refRequote__, __refSalesOrderClient__, __refValidations__, __refSalesOrderEditRebillContainer__, __refSalesOrderShipmentRequoteReasonModel__, __refSalesOrderShipmentRequoteReviewDetailsModel__, __refSalesOrderReBillVendorItemViewModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refSalesOrderReBillItemViewModel = __refSalesOrderReBillItemViewModel__;
    var refSalesOrderOptionButtonControl = __refSalesOrderOptionButtonControl__;
    var refEnums = __refEnums__;
    var refRequote = __refRequote__;
    var refSalesOrderClient = __refSalesOrderClient__;
    var refValidations = __refValidations__;
    
    
    var refSalesOrderEditRebillContainer = __refSalesOrderEditRebillContainer__;
    var refSalesOrderShipmentRequoteReasonModel = __refSalesOrderShipmentRequoteReasonModel__;
    var refSalesOrderShipmentRequoteReviewDetailsModel = __refSalesOrderShipmentRequoteReviewDetailsModel__;
    var refSalesOrderReBillVendorItemViewModel = __refSalesOrderReBillVendorItemViewModel__;

    //#endregion
    /*
    ** <summary>
    ** Sales Order Rebill Edit View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US13214</id> <by>Bhanu Pratap</by> <date>17th Nov, 2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var SalesOrderEditRebillViewModel = (function () {
        //#endregion
        //#region Constructor
        function SalesOrderEditRebillViewModel() {
            this.adjustedOrderItemList = ko.observableArray([]);
            this.selectedorginalItemList = ko.observableArray([]);
            this.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
            this.name = ko.observable('Other');
            this.rebillRep = ko.observable('');
            this.oldOrgZip = ko.observable('');
            this.oldDestZip = ko.observable('');
            this.oldTotalWeigth = ko.observable(0);
            this.oldTotalAmount = ko.observable($.number(0, 2));
            this.oldTotalCost = ko.observable($.number(0, 2));
            this.oldClass = ko.observable('');
            this.newClass = ko.observable('');
            this.newOrgZip = ko.observable('');
            this.newDestZip = ko.observable('');
            this.isOtherReason = ko.observable(false);
            this.otherReason = ko.observable('');
            this.costDiff = ko.observable($.number(0, 2));
            this.newTotalWeight = ko.observable(0);
            this.newTotalCost = ko.observable($.number(0, 2));
            this.newTotalAmount = ko.observable($.number(0, 2));
            this.html = ko.observable('');
            this.crrReviewDate = ko.observable('');
            this.adjustmentDate = ko.observable('');
            this.auditFeeItemsList = ko.observableArray([]);
            this.requoteReasonsList = ko.observableArray([]);
            this.salesOrderOptionListOptions = ko.observableArray([]);
            // common utils class object
            this.commonUtils = new Utils.Common();
            this.shipmentItemTypes = ko.observableArray([]);
            this.costDifference = 0;
            this.totalVBCost = 0;
            this.totalOriginalCost = 0;
            this.totalRevenue = 0;
            this.checkMsgDisplay = true;
            // To fill cost and revenue from sales order details to review details
            this.cost = ko.observable(0);
            this.revenue = ko.observable(0);
            this.salesOrderId = ko.observable();
            // To disable save button
            this.isValidandSave = ko.observable(true);
            var self = this;

            self.salesOrderReBillOriginalItemViewModel = new refSalesOrderReBillItemViewModel.SalesOrderReBillItemViewModel();
            self.salesOrderReBillAdjustItemViewModel = new refSalesOrderReBillItemViewModel.SalesOrderReBillItemViewModel();
            self.salesOrderReBillVendorItemViewModel = new refSalesOrderReBillVendorItemViewModel.SalesOrderRebillVendorBillItemViewModel();

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
        }
        //#endregion}
        //#region Internal public Methods
        SalesOrderEditRebillViewModel.prototype.load = function (bindedData) {
            if (!bindedData)
                return;

            var self = this;
            var salesOrderId = bindedData;
            self.salesOrderId(salesOrderId);

            var successCallBack = function (data) {
                if (data != null)
                    self.salesOrderReBillOriginalItemViewModel.initializeSalesOrderRebillItemDetails(data.OriginalItemDetail);
                self.totalOriginalCost = parseFloat(self.salesOrderReBillOriginalItemViewModel.salesOrderItemAmount());
                self.totalRevenue = parseFloat(self.salesOrderReBillOriginalItemViewModel.salesOrderRevenue());
                self.orginalItemList = data.OriginalItemDetail;
                self.adjustedOrderItemList(data.AdjustedItemDetail);
                self.salesOrderReBillOriginalItemViewModel.isSelect(false);
                self.salesOrderReBillOriginalItemViewModel.isBOLnumber(false);
                self.salesOrderReBillOriginalItemViewModel.gridHeader("Original Order");
                self.salesOrderReBillVendorItemViewModel.gridHeader("Vendor Bill Items");
                self.salesOrderReBillVendorItemViewModel.isSelect(false);
                self.salesOrderReBillAdjustItemViewModel.initializeSalesOrderRebillItemDetails(data.AdjustedItemDetail);
                self.salesOrderReBillAdjustItemViewModel.isSelect(false);
                self.salesOrderReBillAdjustItemViewModel.isBOLnumber(true);
                self.GetVendorBillItems();
                self.salesOrderReBillAdjustItemViewModel.gridHeader("Adjusted Order");
                self.oldClass(data.OldClass);
                self.newClass(data.NewClass);

                if (data.SalesOrderDetails != null && data.SalesOrderDetails !== undefined) {
                    self.oldOrgZip(data.SalesOrderDetails.OriginZip);
                    self.oldDestZip(data.SalesOrderDetails.DestinationZip);
                    self.oldTotalWeigth(data.SalesOrderDetails.TotalWeight);
                    self.oldTotalAmount($.number(data.SalesOrderDetails.Revenue, 2));
                    self.oldTotalCost($.number(data.SalesOrderDetails.Cost, 2));

                    self.cost(data.SalesOrderDetails.Cost);
                    self.revenue(data.SalesOrderDetails.Revenue);
                }
                if (data.SalesOrderRequoteReviewDetails != null) {
                    self.salesOrderRequoteReviewDetail = data.SalesOrderRequoteReviewDetails;
                    self.rebillRep(data.SalesOrderRequoteReviewDetails.ReviewedBy);
                    self.adjustmentDate(data.SalesOrderRequoteReviewDetails.AdjustmentDate ? self.commonUtils.formatDate(data.SalesOrderRequoteReviewDetails.AdjustmentDate.toString(), 'mm/dd/yyyy') : '');
                    self.crrReviewDate(data.SalesOrderRequoteReviewDetails.CRReviewDate ? self.commonUtils.formatDate(data.SalesOrderRequoteReviewDetails.CRReviewDate.toString(), 'mm/dd/yyyy') : '');
                }
                self.auditFeeItemsList.removeAll();
                data.SalesOrderRequoteReasonCodes.forEach(function (item) {
                    self.auditFeeItemsList.push(new refRequote.Model.RequoteBillModel(item));
                });

                self.requoteReasonsList.removeAll();
                data.SalesOrderShipmentRequoteReasons.forEach(function (item) {
                    self.requoteReasonsList.push(new refSalesOrderShipmentRequoteReasonModel.Model.SalesOrderShipmentRequoteReason(item));
                });

                if (self.requoteReasonsList().length > 0) {
                    self.requoteReasonsList().forEach(function (reasonItem) {
                        if (reasonItem.RequoteReasonID == 11) {
                            self.isOtherReason(true);
                            self.html('<i class="icon-ok icon-white active"></i>' + self.name());
                            self.otherReason(reasonItem.Remarks);
                        }
                    });
                }
                self.salesOrderOptionListOptions.removeAll();
                if (self.auditFeeItemsList().length > 0 && self.requoteReasonsList().length > 0) {
                    self.auditFeeItemsList().forEach(function (item) {
                        if (item.id != 11) {
                            var check = false;
                            self.requoteReasonsList().forEach(function (reasonItem) {
                                if (reasonItem.RequoteReasonID == item.id) {
                                    check = true;
                                }
                            });
                            self.salesOrderOptionListOptions.push({ id: item.id, name: item.name, selected: check, enabled: item.IsEnable });
                        }
                    });
                    var argssalesOrderOptionList = {
                        options: self.salesOrderOptionListOptions(),
                        useHtmlBinding: true,
                        isMultiCheck: true,
                        isVerticalView: false
                    };

                    self.obcSalesOrderOptionList.initializeButton(argssalesOrderOptionList, refEnums.Enums.OptionButtonsView.Matrix);
                } else {
                    self.auditFeeItemsList().forEach(function (item) {
                        if (item.id != 11) {
                            var check = false;
                            self.salesOrderOptionListOptions.push({ id: item.id, name: item.name, selected: check, enabled: item.IsEnable });
                        }
                    });
                    var argssalesOrderOptionList = {
                        options: self.salesOrderOptionListOptions(),
                        useHtmlBinding: true,
                        isMultiCheck: true,
                        isVerticalView: false
                    };

                    self.obcSalesOrderOptionList.initializeButton(argssalesOrderOptionList, refEnums.Enums.OptionButtonsView.Matrix);
                }
            }, faliureCallBack = function () {
            };
            self.salesOrderClient.GetSalesOrderRebill(salesOrderId, successCallBack, faliureCallBack);
        };

        SalesOrderEditRebillViewModel.prototype.GetVendorBillItems = function () {
            var self = this;

            //self.listProgress(true);
            var successCallBack = function (data) {
                //self.listProgress(false);
                var commonUtils = new Utils.Common();
                var totalCost = 0.0;
                self.salesOrderReBillVendorItemViewModel.InitializeVendorBillItems(data);
                data.forEach(function (item) {
                    if (item.Cost) {
                        //var costWithoutComma = item.Cost.toString();
                        //var check = costWithoutComma.indexOf(",");
                        //if (check === -1) {
                        totalCost += parseFloat(item.Cost);
                        //} else {
                        //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                        //totalCost += parseFloat(costWithoutComma.replace(/,/g, ""));
                        //}
                    }
                });
                self.totalVBCost = totalCost;
            }, faliureCallBack = function () {
                //self.listProgress(false);
            };
            self.salesOrderClient.GetVendorBillItemsForInvoiceResolution(self.salesOrderId(), successCallBack, faliureCallBack);
            //self.listProgress(false);
        };

        SalesOrderEditRebillViewModel.prototype.bindRequoteReasonCodes = function () {
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

        //#region Save
        SalesOrderEditRebillViewModel.prototype.onSave = function () {
            var self = this;
            if (self.ValidateCRRReviewDate()) {
                self.validAndSave();
            }
        };

        SalesOrderEditRebillViewModel.prototype.validAndSave = function () {
            var self = this;
            var salesOrderRebillData = new refSalesOrderEditRebillContainer.Model.SalesOrderREBillContainer();
            salesOrderRebillData.SalesOrderRequoteReviewDetails = self.getRequoteReviewDetails();
            salesOrderRebillData.SalesOrderShipmentRequoteReasons = self.getShipmentRequoteReasons();
            self.isValidandSave(false);
            refSalesOrderClient.SalesOrderClient.prototype.SaveSalesOrderRebillDetail(salesOrderRebillData, function (message) {
                self.isValidandSave(true);
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 15,
                        fadeOut: 15,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.RebillSavedSuccessfully, "success", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
            }, function (message) {
                self.isValidandSave(true);
            });
        };

        SalesOrderEditRebillViewModel.prototype.ValidateCRRReviewDate = function () {
            var self = this;
            if (self.crrReviewDate() === null || self.crrReviewDate() === "") {
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 15,
                        fadeOut: 15,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectCRRReviewDate, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
                return false;
            } else {
                return true;
            }
        };

        SalesOrderEditRebillViewModel.prototype.getRequoteReviewDetails = function () {
            var self = this;
            var salesOrderRequoteReviewDetail = new refSalesOrderShipmentRequoteReviewDetailsModel.Model.SalesOrderRequoteReviewDetail();
            if (self.salesOrderRequoteReviewDetail !== null && self.salesOrderRequoteReviewDetail !== undefined) {
                salesOrderRequoteReviewDetail.ID = self.salesOrderRequoteReviewDetail.ID;
                salesOrderRequoteReviewDetail.IsBillAudited = self.salesOrderRequoteReviewDetail.IsBillAudited;
            }
            salesOrderRequoteReviewDetail.AdjustmentDate = self.adjustmentDate();
            salesOrderRequoteReviewDetail.CRReviewDate = self.crrReviewDate();
            salesOrderRequoteReviewDetail.IsManualReviewed = true;
            salesOrderRequoteReviewDetail.Reviewed = 1;
            salesOrderRequoteReviewDetail.ReviewedBy = self.rebillRep();
            salesOrderRequoteReviewDetail.TotalCostAdjustment = (self.totalVBCost - self.totalOriginalCost);
            salesOrderRequoteReviewDetail.TotalRevenueAdjustment = self.totalRevenue;
            salesOrderRequoteReviewDetail.SalesOrderId = self.salesOrderId();
            return salesOrderRequoteReviewDetail;
        };

        SalesOrderEditRebillViewModel.prototype.getShipmentRequoteReasons = function () {
            var self = this;
            var shipmentRequoteReasons;
            shipmentRequoteReasons = ko.observableArray([])();

            var selectedList = self.obcSalesOrderOptionList.getSelectedOptions(true);

            selectedList.forEach(function (item) {
                var shipmentRequoteReason = new refSalesOrderShipmentRequoteReasonModel.Model.SalesOrderShipmentRequoteReason();

                shipmentRequoteReason.ID = 0;
                shipmentRequoteReason.Remarks = item.name();
                shipmentRequoteReason.RequoteReasonID = item.id;

                shipmentRequoteReasons.push(shipmentRequoteReason);
            });

            if (self.isOtherReason()) {
                var shipmentRequoteReason = new refSalesOrderShipmentRequoteReasonModel.Model.SalesOrderShipmentRequoteReason();
                shipmentRequoteReason.ID = 0;
                shipmentRequoteReason.Remarks = self.otherReason();
                shipmentRequoteReason.RequoteReasonID = 11;
                shipmentRequoteReasons.push(shipmentRequoteReason);
            }

            return shipmentRequoteReasons;
        };

        //#endregion
        //#endregion
        //#region Internal private methods
        SalesOrderEditRebillViewModel.prototype.otherOption = function () {
            var self = this;

            if (!self.isOtherReason()) {
                self.isOtherReason(true);

                self.html('<i class="icon-ok icon-white active"></i>' + self.name());
            } else {
                self.isOtherReason(false);
            }
        };

        SalesOrderEditRebillViewModel.prototype.convertToCrrReviewDate = function () {
            var self = this;
            if (self.crrReviewDate() !== undefined) {
                if (!self.crrReviewDate().match('/') && self.crrReviewDate().length > 0) {
                    self.crrReviewDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.crrReviewDate()));
                }
            }
        };

        SalesOrderEditRebillViewModel.prototype.convertToAdjustmentDate = function () {
            var self = this;
            if (self.adjustmentDate() !== undefined) {
                if (!self.adjustmentDate().match('/') && self.adjustmentDate().length > 0) {
                    self.crrReviewDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.adjustmentDate()));
                }
            }
        };

        //#endregion
        //#region Life Cycle
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        SalesOrderEditRebillViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        SalesOrderEditRebillViewModel.prototype.activate = function () {
            return true;
        };

        SalesOrderEditRebillViewModel.prototype.deactivate = function () {
        };

        SalesOrderEditRebillViewModel.prototype.beforeBind = function () {
            var self = this;
            _app.trigger("loadMyData", function (data) {
                if (data) {
                    self.load(data);
                }
            });
        };

        SalesOrderEditRebillViewModel.prototype.compositionComplete = function (view, parent) {
        };
        return SalesOrderEditRebillViewModel;
    })();
    return SalesOrderEditRebillViewModel;
});
