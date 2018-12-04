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
define(["require", "exports", 'plugins/router', 'durandal/app'], function(require, exports, ___router__, ___app__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    
    

    //#endregion
    /*
    ** <summary>
    **Sales Order MAS ViewModel.
    ** </summary>
    ** <createDetails>
    ** <id>US21133</id> <by>Baldev Singh Thakur</by> <date>18-04-2016</date>
    ** </createDetails>}
    ** <changeHistory>
    ** </changeHistory>
    */
    var SalesOrderMasDetailsViewModel = (function () {
        function SalesOrderMasDetailsViewModel() {
            //#region Members
            this.salesOrderMasAPList = ko.observableArray([]);
            this.totalInvoiceAmount = ko.observable();
            this.totalPaymentAmount = ko.observable();
            this.gridHeader = ko.observable('');
            this.totalRow = ko.observable('');
        }
        // Initialization of the grid.
        SalesOrderMasDetailsViewModel.prototype.initializeMasDetails = function (data, salesOrderId) {
            var self = this;
            var totalInvoiceAmount = 0.0, totalPaymentAmount = 0.0;
            if (self.salesOrderMasAPList != null)
                self.salesOrderMasAPList.removeAll();

            if (data) {
                for (var i = 0; i < data.SalesOrderMasDetailsForAP.length; i++) {
                    var salesOrderMasAP = new SalesOrderMasAPModel(function () {
                        self.updateTotalCostAndWeight();
                    });
                    var invAmountWithoutComma = data.SalesOrderMasDetailsForAP[i].InvoiceAmount.toString();
                    var check = invAmountWithoutComma.indexOf(",");
                    if (check === -1) {
                        totalInvoiceAmount += parseFloat(data.SalesOrderMasDetailsForAP[i].InvoiceAmount.toString());
                    } else {
                        //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                        totalInvoiceAmount += parseFloat(invAmountWithoutComma.replace(/,/g, ""));
                    }

                    var payAmountWithoutComma = data.SalesOrderMasDetailsForAP[i].PaymentAmount.toString();
                    var check = payAmountWithoutComma.indexOf(",");
                    if (check === -1) {
                        totalPaymentAmount += parseFloat(data.SalesOrderMasDetailsForAP[i].PaymentAmount.toString());
                    } else {
                        //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                        totalPaymentAmount += parseFloat(payAmountWithoutComma.replace(/,/g, ""));
                    }

                    salesOrderMasAP.initializeSalesOrderMasAPModel(data.SalesOrderMasDetailsForAP[i]);

                    self.salesOrderMasAPList.push(salesOrderMasAP);
                }

                var salesOrderMasApTotal = new SalesOrderMasAPModel(function () {
                    self.updateTotalCostAndWeight();
                });

                salesOrderMasApTotal.initializeSalesOrderMasAPTotal(totalInvoiceAmount, totalPaymentAmount);
                self.salesOrderMasAPList.push(salesOrderMasApTotal);
            }
        };

        SalesOrderMasDetailsViewModel.prototype.beforeBind = function () {
            var self = this;
        };

        SalesOrderMasDetailsViewModel.prototype.compositionComplete = function () {
            var self = this;
        };

        SalesOrderMasDetailsViewModel.prototype.updateTotalCostAndWeight = function () {
            var self = this;

            var totalInvoiceAmount = 0.0, totalPaymentAmount = 0.0;

            self.salesOrderMasAPList().forEach(function (item) {
                if (item.InvoiceAmount()) {
                    var costWithoutComma = item.InvoiceAmount().toString();
                    var check = costWithoutComma.indexOf(",");
                    if (check === -1) {
                        totalInvoiceAmount += parseFloat(item.InvoiceAmount().toString());
                    } else {
                        //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                        totalInvoiceAmount += parseFloat(costWithoutComma.replace(/,/g, ""));
                    }
                }

                if (item.PaymentAmount()) {
                    var costWithoutComma = item.PaymentAmount().toString();
                    var check = costWithoutComma.indexOf(",");
                    if (check === -1) {
                        totalPaymentAmount += parseFloat(item.PaymentAmount().toString());
                    } else {
                        //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                        totalPaymentAmount += parseFloat(costWithoutComma.replace(/,/g, ""));
                    }
                }
            });

            self.totalPaymentAmount($.number(totalPaymentAmount.toString(), 2));
            self.totalInvoiceAmount($.number(totalInvoiceAmount.toString(), 2));
        };
        return SalesOrderMasDetailsViewModel;
    })();
    exports.SalesOrderMasDetailsViewModel = SalesOrderMasDetailsViewModel;

    var SalesOrderMasAPModel = (function () {
        function SalesOrderMasAPModel(costOrWeightChanged) {
            this.BOLNumber = ko.observable();
            this.VendorInvoiceNumber = ko.observable();
            this.Vendor = ko.observable();
            this.FactorVendor = ko.observable();
            this.InvoiceDateDisplay = ko.observable();
            this.Status = ko.observable();
            this.InvoiceAmount = ko.observable();
            this.PaymentNumber = ko.observable();
            this.PaymentDateDisplay = ko.observable();
            this.PaymentAmount = ko.observable();
            this.totalRow = ko.observable('');
            var self = this;
            return self;
        }
        // get the item view model
        SalesOrderMasAPModel.prototype.initializeSalesOrderMasAPModel = function (item) {
            var self = this;
            if (item != null) {
                self.BOLNumber(item.BOLNumber);
                self.VendorInvoiceNumber(item.VendorInvoiceNumber);
                self.Vendor(item.Vendor);
                self.FactorVendor(item.FactorVendor);
                self.InvoiceDateDisplay(item.InvoiceDateDisplay);
                self.Status(item.Status);
                self.InvoiceAmount($.number((item.InvoiceAmount), 2));
                self.PaymentNumber(item.PaymentNumber);
                self.PaymentDateDisplay(item.PaymentDateDisplay);
                self.PaymentAmount($.number((item.PaymentAmount), 2));
                self.totalRow('');
            }
        };

        SalesOrderMasAPModel.prototype.initializeSalesOrderMasAPTotal = function (totalInvoiceAmount, totalPaymentAmount) {
            var self = this;

            self.VendorInvoiceNumber('');
            self.Vendor('');
            self.FactorVendor('');
            self.InvoiceDateDisplay('');
            self.Status('');
            self.InvoiceAmount($.number((totalInvoiceAmount), 2));
            self.PaymentNumber('');
            self.PaymentDateDisplay('');
            self.PaymentAmount($.number((totalPaymentAmount), 2));
            self.BOLNumber('Total');
            self.totalRow('rebillTotal');
        };
        return SalesOrderMasAPModel;
    })();
    exports.SalesOrderMasAPModel = SalesOrderMasAPModel;
});
