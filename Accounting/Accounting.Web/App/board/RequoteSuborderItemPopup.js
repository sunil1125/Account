/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

define(["require", "exports", 'plugins/router', 'durandal/app', 'services/client/SalesOrderClient', 'salesOrder/SalesOrderRebillItemsModel', 'salesOrder/SalesOrderRebillVendorItemView'], function(require, exports, ___router__, ___app__, __refSalesOrderClient__, __refSalesOrderReBillItemsModel__, __refSalesOrderReBillVendorItemViewModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    

    
    
    
    
    var refSalesOrderClient = __refSalesOrderClient__;
    
    
    
    var refSalesOrderReBillItemsModel = __refSalesOrderReBillItemsModel__;
    
    var refSalesOrderReBillVendorItemViewModel = __refSalesOrderReBillVendorItemViewModel__;
    
    

    var RequoteSuborderItemPopupModel = (function () {
        //#endregion
        //#region Constructor
        function RequoteSuborderItemPopupModel() {
            this.listProgress = ko.observable(false);
            this.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
            this.salesOrderOriginalItemsList = ko.observableArray([]);
            this.salesOrderAdjustedItemsList = ko.observableArray([]);
            this.shipmentItemTypes = ko.observableArray([]);
            this.totalRev = ko.observable(0);
            this.totalOrgRev = ko.observable(0);
            this.total = 0;
            this.revenue = ko.observable();
            this.originalRevenue = ko.observable();
            this.isSave = ko.observable(false);
            this.salesOrderItemAmount = ko.observable();
            this.salesOrderRevenue = ko.observable();
            this.salesOrderItemWeight = ko.observable();
            this.salesOrderItemPieces = ko.observable();
            var self = this;

            self.salesOrderReBillVendorItemViewModel = new refSalesOrderReBillVendorItemViewModel.SalesOrderRebillVendorBillItemViewModel();

            //set the flag allowdecimal: true to accepts decimals
            self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(false) };

            ////## redirects to Vendor bill order page
            self.isTabPress = function (data, event) {
                var charCode = (event.which) ? event.which : event.keyCode;
                if ((charCode === 9)) {
                }
                return true;
            };
        }
        //#endregion
        //close popup
        RequoteSuborderItemPopupModel.prototype.closePopup = function (dialogResult) {
            var self = this;
            dialogResult.__dialog__.close(this, dialogResult);
            return true;
        };

        //#endregion
        //#region Private Methods
        //#region Load Data
        RequoteSuborderItemPopupModel.prototype.load = function (bindedData) {
        };

        //public compositionComplete(view, parent) {
        //}
        RequoteSuborderItemPopupModel.prototype.activate = function (refresh) {
            var self = this;

            // Load all shipment types if not loaded already
            var shipmentItemTypesLength = self.shipmentItemTypes().length;
            if (!(shipmentItemTypesLength)) {
                _app.trigger("GetItemsTypes", function (items) {
                    self.shipmentItemTypes.removeAll();
                    self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
                });
            }
            self.listProgress(true);

            //self.revenueAdjusted(refresh.bindingObject);
            var data = refresh.bindingObject;
            var totalRev = 0;
            var totalOrgRevenue = 0;

            //self.initializeSalesOrderRebillItemDetails(data.RebillData.AdjustedItemDetail);
            self.GetSalesOrderRebill(data.ShipmentId);
            self.GetVendorBillItems(data.ShipmentId);

            return true;
        };

        // to load the sales order item details
        RequoteSuborderItemPopupModel.prototype.initializeSalesOrderRebillItemDetails = function (items) {
            var self = this;
            var totalCost = 0.0, totalweight = 0.0, totalPices = 0.0, totalRevenue = 0.0, totalPlcCost = 0.00;

            if (self.salesOrderOriginalItemsList != null)
                self.salesOrderOriginalItemsList.removeAll();

            if (items != null) {
                var BOLNo = '';
                for (var i = 0; i < items.length; i++) {
                    if (BOLNo != items[i].BOLNumber) {
                        BOLNo = items[i].BOLNumber;
                        if (i !== 0) {
                            var item = $.grep(self.shipmentItemTypes(), function (e) {
                                return e.ItemId === items[i].ItemId.toString();
                            })[0];
                            var salesOrderItem = new refSalesOrderReBillItemsModel.Models.SalesOrderReBillItemsModel(item, function () {
                            });

                            salesOrderItem.initializeTotal(totalRevenue, totalCost, totalPices, totalweight, totalPlcCost, false);
                            self.salesOrderOriginalItemsList.push(salesOrderItem);

                            self.salesOrderRevenue($.number(totalRevenue.toString(), 2));
                            self.salesOrderItemAmount($.number(totalCost.toString(), 2));
                            self.salesOrderItemPieces(totalPices);
                            self.salesOrderItemWeight(totalweight);

                            totalCost = 0.0;
                            totalweight = 0.0;
                            totalPices = 0.0;
                            totalRevenue = 0.0;
                            totalPlcCost = 0.00;
                        }
                    } else {
                        items[i].BOLNumber = '';
                    }
                    var item = $.grep(self.shipmentItemTypes(), function (e) {
                        return e.ItemId === items[i].ItemId.toString();
                    })[0];
                    var salesOrderItem = new refSalesOrderReBillItemsModel.Models.SalesOrderReBillItemsModel(item, function () {
                    });

                    salesOrderItem.initializeSalesOrderItem(items[i], items.length, true);
                    totalCost += items[i].Cost;
                    totalweight += items[i].Weight;
                    totalPices += items[i].PieceCount;
                    totalRevenue += items[i].Revenue;
                    totalPlcCost += items[i].PLCCost;
                    self.salesOrderOriginalItemsList.push(salesOrderItem);

                    self.salesOrderRevenue($.number(totalRevenue.toString(), 2));
                    self.salesOrderItemAmount($.number(totalCost.toString(), 2));
                    self.salesOrderItemPieces(totalPices);
                    self.salesOrderItemWeight(totalweight);
                }
            }
        };

        RequoteSuborderItemPopupModel.prototype.GetVendorBillItems = function (shipmentId) {
            var self = this;

            //self.listProgress(true);
            var successCallBack = function (data) {
                //self.listProgress(false);
                var commonUtils = new Utils.Common();

                //data.forEach(function (item) {
                //    if (item.IsMainVendorBill) {
                //        self.vendorBillId(item.VendorBillId)
                //	}
                //})
                //self.getVendorBillAddress();
                self.salesOrderReBillVendorItemViewModel.InitializeVendorBillItems(data);
                self.listProgress(false);
            }, faliureCallBack = function () {
                self.listProgress(false);
            };
            self.salesOrderClient.GetVendorBillItemsForInvoiceResolution(shipmentId, successCallBack, faliureCallBack);
            //self.listProgress(false);
        };

        RequoteSuborderItemPopupModel.prototype.GetSalesOrderRebill = function (shipmentId) {
            var self = this;
            var successCallBack = function (data) {
                self.initializeSalesOrderRebillItemDetails(data.AdjustedItemDetail);
            }, faliureCallBack = function (error) {
                self.listProgress(false);
            };

            self.salesOrderClient.GetSalesOrderRebill(shipmentId.toString(), successCallBack, faliureCallBack);
        };

        //** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
        RequoteSuborderItemPopupModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        RequoteSuborderItemPopupModel.prototype.compositionComplete = function () {
            var self = this;
            self.listProgress(true);
        };
        return RequoteSuborderItemPopupModel;
    })();
    return RequoteSuborderItemPopupModel;
});
