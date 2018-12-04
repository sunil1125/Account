/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
//import refSalesOrderReBillViewModel = require('salesOrder/SalesOrderReBillViewModel');

import refSalesOrderReBillItemViewModel = require('salesOrder/SalesOrderReBillItemView');
import refSalesOrderOptionButtonControl = require('salesOrder/SalesOrderOptionButtonControl');
import refEnums = require('services/models/common/Enums');
import refRequote = require('services/models/salesOrder/RequoteBillModel');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refValidations = require('services/validations/Validations');
import refSalesOrderRequoteReason = require('services/models/salesOrder/SalesOrderShipmentRequoteReason');
import refSalesOrderitem = require('services/models/salesOrder/SalesOrderItemDetail');
import refSalesOrderReBillItemsModel = require('salesOrder/SalesOrderRebillItemsModel');
import refSalesOrderItemDetail = require('services/models/salesOrder/SalesOrderItemDetail');
import refSalesOrderReBillVendorItemViewModel = require('salesOrder/SalesOrderRebillVendorItemView');
import refSalesOrderAuditViewModel = require('salesOrder/SalesOrderAuditView');
import refSalesOrderItemModel = require('salesOrder/SalesOrderItemsModel');

class RequoteSuborderItemPopupModel {
    listProgress: KnockoutObservable<boolean> = ko.observable(false);
    salesOrderClient: refSalesOrderClient.SalesOrderClient = new refSalesOrderClient.SalesOrderClient();
    salesOrderReBillVendorItemViewModel: refSalesOrderReBillVendorItemViewModel.SalesOrderRebillVendorBillItemViewModel;

    salesOrderOriginalItemsList: KnockoutObservableArray<refSalesOrderReBillItemsModel.Models.SalesOrderReBillItemsModel> = ko.observableArray([]);
    salesOrderAdjustedItemsList: KnockoutObservableArray<refSalesOrderReBillItemsModel.Models.SalesOrderReBillItemsModel> = ko.observableArray([]);

    shipmentItemTypes: KnockoutObservableArray<IShipmentItemType> = ko.observableArray([]);
    totalRev: KnockoutObservable<number> = ko.observable(0);
    totalOrgRev: KnockoutObservable<number> = ko.observable(0);
    total: number = 0;
    revenue: KnockoutObservable<number> = ko.observable();
    originalRevenue: KnockoutObservable<number> = ko.observable();
    isSave: KnockoutObservable<boolean> = ko.observable(false);

    salesOrderItemAmount: KnockoutObservable<string> = ko.observable();
    salesOrderRevenue: KnockoutObservable<string> = ko.observable();
    salesOrderItemWeight: KnockoutObservable<number> = ko.observable();
    salesOrderItemPieces: KnockoutObservable<number> = ko.observable();
    //originalRevenueModelList: KnockoutObservableArray<refSalesOrderItemsModel.Models.SalesOrderItemsModel> = ko.observableArray([]);
    // Accepts only numeric with decimal input
    NumericInputWithDecimalPoint: INumericInput;

    //## To trigger when when 'TAB' press from reference number.
    isTabPress: (that, event) => void;
    //#endregion

    //#region Constructor
    constructor() {
        var self = this;

        self.salesOrderReBillVendorItemViewModel = new refSalesOrderReBillVendorItemViewModel.SalesOrderRebillVendorBillItemViewModel();
        //set the flag allowdecimal: true to accepts decimals
        self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(false) };

        ////## redirects to Vendor bill order page
        self.isTabPress = (data, event) => {
            var charCode = (event.which) ? event.which : event.keyCode;
            if ((charCode === 9)) { //if 'TAB' press.
            }
            return true;
        }
	}

    //#endregion

    //close popup
    public closePopup(dialogResult) {
        var self = this;
        dialogResult.__dialog__.close(this, dialogResult);
        return true;
    }

    //#endregion

    //#region Private Methods

    //#region Load Data
    public load(bindedData: Array<ISalesOrderItem>) {
    }

    //public compositionComplete(view, parent) {
    //}

    public activate(refresh: IMessageBoxOption) {
        var self = this;

        // Load all shipment types if not loaded already
        var shipmentItemTypesLength: number = self.shipmentItemTypes().length;
        if (!(shipmentItemTypesLength)) {
            _app.trigger("GetItemsTypes", function (items: IShipmentItemType) {
                self.shipmentItemTypes.removeAll();
                self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
            });
        }
        self.listProgress(true);
        //self.revenueAdjusted(refresh.bindingObject);
        var data = refresh.bindingObject;
        var totalRev: number = 0;
        var totalOrgRevenue: number = 0;

        //self.initializeSalesOrderRebillItemDetails(data.RebillData.AdjustedItemDetail);
        self.GetSalesOrderRebill(data.ShipmentId);
        self.GetVendorBillItems(data.ShipmentId);

        return true;
    }

    // to load the sales order item details
    public initializeSalesOrderRebillItemDetails(items: Array<ISalesOrderItem>) {
        var self = this;
        var totalCost: number = 0.0,
            totalweight: number = 0.0,
            totalPices: number = 0.0,
            totalRevenue: number = 0.0,
            totalPlcCost = 0.00;

        if (self.salesOrderOriginalItemsList != null)
            self.salesOrderOriginalItemsList.removeAll();

        if (items != null) {
            var BOLNo = '';
            for (var i = 0; i < items.length; i++) {
                if (BOLNo != items[i].BOLNumber) {
                    BOLNo = items[i].BOLNumber;
                    if (i !== 0) {
                        var item = $.grep(self.shipmentItemTypes(), function (e) { return e.ItemId === items[i].ItemId.toString(); })[0];
                        var salesOrderItem = new refSalesOrderReBillItemsModel.Models.SalesOrderReBillItemsModel(item, function () { });

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
                }
                else {
                    items[i].BOLNumber = '';
                }
                var item = $.grep(self.shipmentItemTypes(), function (e) { return e.ItemId === items[i].ItemId.toString(); })[0];
                var salesOrderItem = new refSalesOrderReBillItemsModel.Models.SalesOrderReBillItemsModel(item, function () { });

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
    }

    public GetVendorBillItems(shipmentId: number) {
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
        },
            faliureCallBack = function () {
                self.listProgress(false);
            };
        self.salesOrderClient.GetVendorBillItemsForInvoiceResolution(shipmentId, successCallBack, faliureCallBack);
        //self.listProgress(false);
    }

    public GetSalesOrderRebill(shipmentId: number) {
        var self = this;
        var successCallBack = function (data) {
            self.initializeSalesOrderRebillItemDetails(data.AdjustedItemDetail);
        },
            faliureCallBack = function (error) {
                self.listProgress(false);
            };

        self.salesOrderClient.GetSalesOrderRebill(shipmentId.toString(), successCallBack, faliureCallBack);
    }

    //** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
    public attached() {
        _app.trigger('viewAttached');
    }

    public compositionComplete() {
        var self = this;
        self.listProgress(true);
    }
}
return RequoteSuborderItemPopupModel;