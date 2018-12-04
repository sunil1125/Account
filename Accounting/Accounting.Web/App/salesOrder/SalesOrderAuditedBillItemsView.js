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
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'salesOrder/SalesOrderAuditedBillItemsModel'], function(require, exports, ___router__, ___app__, __refSalesOrderAuditedBillItemsModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    var refSalesOrderAuditedBillItemsModel = __refSalesOrderAuditedBillItemsModel__;

    //#endregion
    /*
    ** <summary>
    ** Sales Order Audited Bill Items View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US13235</id> <by>Sankesh</by> <date>27th Nov, 2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>DE22259</id> <by>Shreesha Adiga</by> <date>22-03-2016</date><description>Select item based on itemid and accessorial id</description>
    ** <id>US21290</id> <by>Shreesha Adiga</by> <date>23-03-2016</date><description>If item selected based on itemid and accessorialId is undefined, then select based only on itemId</description>
    ** </changeHistory>
    */
    var SalesOrderAuditedBillItemViewModel = (function () {
        //#endregion
        //#region Constructor
        function SalesOrderAuditedBillItemViewModel() {
            //#region Members
            this.salesOrderOriginalItemsList = ko.observableArray([]);
            this.salesOrderAdjustedItemsList = ko.observableArray([]);
            this.classTypes = ko.observableArray([]);
            this.packageTypes = ko.observableArray([]);
            this.shipmentItemTypes = ko.observableArray([]);
            this.orginalItemList = ko.observableArray([]);
            this.isSelect = ko.observable(false);
            this.selectedorginalItemList = ko.observableArray([]);
            this.gridHeader = ko.observable('');
            this.name = ko.observable('Select All');
            this.selected = ko.observable(false);
            this.html = ko.observable('');
            this.salesOrderItemAmount = ko.observable();
            this.salesOrderRevenue = ko.observable();
            this.salesOrderItemWeight = ko.observable();
            this.salesOrderItemPieces = ko.observable();
            this.salesOrderBsCost = ko.observable();
            this.isBSCost = ko.observable(false);
            this.isSaveEnable = ko.observable(true);
            var self = this;

            self.beforeBind();
        }
        //#endregion}
        //#region Internal public Methods
        // Gets the all needed values like ENUMs
        SalesOrderAuditedBillItemViewModel.prototype.beforeBind = function () {
            var self = this;

            // Load all classes if not loaded already
            var classTypesLength = self.classTypes().length;
            if (!(classTypesLength)) {
                _app.trigger("GetClassTypesAndPackageTypes", function (data) {
                    if (data) {
                        self.classTypes.removeAll();
                        self.classTypes.push.apply(self.classTypes, data['FakTypeEnums']);

                        self.packageTypes.removeAll();
                        self.packageTypes.push.apply(self.packageTypes, data['PackageTypeEnums']);
                    }
                });
            }

            // Load all shipment types if not loaded already
            var shipmentItemTypesLength = self.shipmentItemTypes().length;
            if (!(shipmentItemTypesLength)) {
                _app.trigger("GetItemsTypes", function (items) {
                    self.shipmentItemTypes.removeAll();
                    self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
                });
            }
        };

        // to load the sales order item details
        SalesOrderAuditedBillItemViewModel.prototype.initializeSalesOrderAuditedBillItemDetails = function (items, enable) {
            var self = this;
            var totalCost = 0.0, totalweight = 0.0, totalPices = 0.0, totalRevenue = 0.0, totalPlcCost = 0.00;

            self.orginalItemList(items);
            if (self.salesOrderOriginalItemsList != null)
                self.salesOrderOriginalItemsList.removeAll();
            self.isSaveEnable(enable);
            if (items != null) {
                for (var i = 0; i < items.length; i++) {
                    //##START: DE22259
                    var item = $.grep(self.shipmentItemTypes(), function (e) {
                        return e.ItemId === items[i].ItemId.toString() && (e.AccessorialId == null || items[i].AccessorialId == 0 || e.AccessorialId == items[i].AccessorialId);
                    })[0];

                    if (typeof item === "undefined" || item == null) {
                        item = $.grep(self.shipmentItemTypes(), function (e) {
                            return e.ItemId === items[i].ItemId.toString();
                        })[0];
                    }

                    // ##END: US21290
                    var salesOrderItem = new refSalesOrderAuditedBillItemsModel.Models.SalesOrderAuditedBillItemsModel(item, function () {
                        self.updateCheck();
                    });
                    if (self.selected()) {
                        items[i].isChecked = true;
                    } else {
                        items[i].isChecked = false;
                    }
                    salesOrderItem.initializeSalesOrderAuditedBillItem(items[i], items.length);
                    totalCost += items[i].Cost;
                    totalweight += items[i].Weight;
                    totalPices += items[i].PieceCount;
                    self.salesOrderOriginalItemsList.push(salesOrderItem);
                }
            }

            self.salesOrderRevenue($.number(totalRevenue.toString(), 2));
            self.salesOrderItemAmount($.number(totalCost.toString(), 2));
            self.salesOrderItemPieces(totalPices);
            self.salesOrderItemWeight(totalweight);
            self.salesOrderBsCost(totalPlcCost);
        };

        //#endregion
        //#region Internal private methods
        SalesOrderAuditedBillItemViewModel.prototype.selectOption = function () {
            var self = this;
            if (!self.selected()) {
                self.selected(true);
                self.html('<i class="icon-ok icon-white active"></i>' + self.name());
                self.salesOrderOriginalItemsList().forEach(function (item) {
                    item.isCheck(true);
                });
            } else {
                self.selected(false);
                self.salesOrderOriginalItemsList().forEach(function (item) {
                    item.isCheck(false);
                });
            }
        };

        SalesOrderAuditedBillItemViewModel.prototype.updateCheck = function () {
            var self = this;
            var count = $.grep(self.salesOrderOriginalItemsList(), function (e) {
                return e.isCheck();
            });
            if (count.length == self.salesOrderOriginalItemsList().length) {
                self.selected(true);
                self.html('<i class="icon-ok icon-white active"></i>' + self.name());
            } else {
                self.selected(false);
            }
        };

        SalesOrderAuditedBillItemViewModel.prototype.cleanup = function () {
            var self = this;

            self.salesOrderOriginalItemsList().forEach(function (item) {
                item.cleanUp();
            });

            self.salesOrderAdjustedItemsList().forEach(function (item) {
                item.cleanUp();
            });

            self.salesOrderOriginalItemsList.removeAll();
            self.salesOrderAdjustedItemsList.removeAll();
            self.classTypes.removeAll();
            self.packageTypes.removeAll();
            self.shipmentItemTypes.removeAll();
            self.orginalItemList.removeAll();
            self.selectedorginalItemList.removeAll();

            for (var property in self) {
                delete self[property];
            }

            delete self;
            //self.isSelect.dispose();
            //self.gridHeader.dispose();
            //self.name.dispose();
            //self.selected.dispose();
            //self.html.dispose();
            //self.salesOrderItemAmount.dispose();
            //self.salesOrderRevenue.dispose();
            //self.salesOrderItemWeight.dispose();
            //self.salesOrderItemPieces.dispose();
            //self.salesOrderBsCost.dispose();
            //self.isBSCost.dispose();
            //self.isSaveEnable.dispose();
            //self.isSelect = null;
            //self.gridHeader = null;
            //self.name = null;
            //self.selected = null;
            //self.html = null;
            //self.salesOrderItemAmount = null;
            //self.salesOrderRevenue = null;
            //self.salesOrderItemWeight = null;
            //self.salesOrderItemPieces = null;
            //self.salesOrderBsCost = null;
            //self.isBSCost = null;
            //self.isSaveEnable = null;
            //self.itemCliked = null;
            //self = null;
        };
        return SalesOrderAuditedBillItemViewModel;
    })();
    exports.SalesOrderAuditedBillItemViewModel = SalesOrderAuditedBillItemViewModel;
});
