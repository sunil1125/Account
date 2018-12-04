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
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'salesOrder/SalesOrderItemsModel'], function(require, exports, ___router__, ___app__, __refSalesOrderItemsModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    

    
    var refSalesOrderItemsModel = __refSalesOrderItemsModel__;

    //#endregion
    /*
    ** <summary>
    ** Sales Order History Details .
    ** </summary>
    ** <createDetails>
    ** <id>US8214</id> <by>Satish</by> <date>27th May, 2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US24389</id> <by>Shreesha Adiga</by> <date>31-08-2016</date> <description>Changes related to fetching the truckload accessroials if the order is TL</description>
    ** </changeHistory>
    */
    var SalesOrderRevenueAdjustmentModel = (function () {
        // ##END: US24389
        //#endregion
        //#region Constructor
        function SalesOrderRevenueAdjustmentModel() {
            this.revenueAdjusted = ko.observableArray([]);
            this.shipmentItemTypes = ko.observableArray([]);
            this.updateditemList = ko.observableArray([]);
            this.selectedClassType = ko.observable();
            this.itemName = ko.observable();
            this.cost = ko.observable();
            this.totalRev = ko.observable(0);
            this.totalOrgRev = ko.observable(0);
            this.total = 0;
            this.totalCost = ko.observable(0);
            this.headerMessage = ko.observable('There is a change in the cost.Please edit changed revenue column to insert new revenue');
            this.footermessage = ko.observable('');
            this.revenue = ko.observable();
            this.originalRevenue = ko.observable();
            this.isSave = ko.observable(false);
            this.title = ko.observable('');
            this.originalRevenueModelList = ko.observableArray([]);
            // ##START: US24389
            this.isTruckloadOrder = false;
            var self = this;

            //set the flag allowdecimal: true to accepts decimals
            self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(false) };

            ////## redirects to Vendor bill order page
            self.isTabPress = function (data, event) {
                var charCode = (event.which) ? event.which : event.keyCode;

                if ((charCode === 9)) {
                    //if 'TAB' press.
                }

                return true;
            };
        }
        //#endregion
        //close popup
        SalesOrderRevenueAdjustmentModel.prototype.closePopup = function (dialogResult) {
            var self = this;
            self.isSave(false);
            dialogResult.__dialog__.close(this, dialogResult);
            return true;
        };

        //Continue  popup button
        SalesOrderRevenueAdjustmentModel.prototype.continuePopup = function (dialogResult) {
            var self = this;
            self.isSave(true);
            dialogResult.__dialog__.close(this, dialogResult);

            return true;
        };

        //#endregion
        //#region Private Methods
        //#region Load Data
        SalesOrderRevenueAdjustmentModel.prototype.load = function (bindedData) {
        };

        SalesOrderRevenueAdjustmentModel.prototype.compositionComplete = function (view, parent) {
        };

        SalesOrderRevenueAdjustmentModel.prototype.activate = function (refresh) {
            var self = this;

            // ##START: US24389
            self.isTruckloadOrder = typeof refresh.bindingObject.IsTruckloadOrder !== 'undefined' && refresh.bindingObject.IsTruckloadOrder;

            if (typeof self.shipmentItemTypes !== 'undefined') {
                _app.trigger(self.isTruckloadOrder ? "GetTruckloadAccessorials" : "GetItemsTypes", function (items) {
                    self.shipmentItemTypes.removeAll();
                    self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
                });
            }

            var salesOrderItems = refresh.bindingObject.SalesOrderItems;

            // ##END: US24389
            var totalRev = 0;
            var totalOrgRevenue = 0;
            var totalCost = 0;

            if (typeof salesOrderItems !== 'undefined' && salesOrderItems != null) {
                salesOrderItems.forEach(function (item) {
                    var shipmentitem = $.grep(self.shipmentItemTypes(), function (e) {
                        return +e.ItemId === +item.ItemId;
                    })[0];
                    var revenchangedItem = new refSalesOrderItemsModel.Models.SalesOrderItemsModel(shipmentitem, function () {
                        self.updateTotalCostAndWeight();
                    }, function () {
                    }, function () {
                    });

                    totalRev += parseFloat(item.Revenue.toString().replace(/,/g, ""));
                    totalCost += parseFloat(item.Cost.toString().replace(/,/g, ""));
                    totalOrgRevenue += parseFloat(item.Revenue.toString().replace(/,/g, ""));
                    revenchangedItem.initializeVendorBillItem(item);
                    self.originalRevenueModelList.push(revenchangedItem);
                });
            }

            self.totalRev($.number(totalRev, 2));
            self.totalOrgRev($.number(totalOrgRevenue, 2));
            self.totalCost($.number(totalCost, 2));
            self.footermessage(refresh.marginPrecentageMessage);

            if (refresh.headerMessage !== '' || refresh.headerMessage !== undefined || refresh.headerMessage !== null) {
                self.headerMessage(refresh.headerMessage);
            }

            if (refresh.title !== '' || refresh.title !== undefined || refresh.title !== null) {
                self.title(refresh.title);
            }

            return true;
        };

        SalesOrderRevenueAdjustmentModel.prototype.updateTotalCostAndWeight = function () {
            var self = this;
            self.total = 0;
            var totalCost = 0;
            self.originalRevenueModelList().forEach(function (item) {
                self.total = self.total + parseFloat(item.rev().toString().replace(/,/g, ""));
            });
            self.totalOrgRev($.number(self.total, 2));
        };

        //** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
        SalesOrderRevenueAdjustmentModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };
        return SalesOrderRevenueAdjustmentModel;
    })();
    return SalesOrderRevenueAdjustmentModel;
});
