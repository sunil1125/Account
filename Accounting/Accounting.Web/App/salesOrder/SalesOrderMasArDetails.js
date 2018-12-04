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
    var SalesOrderMasArDetailsViewModel = (function () {
        function SalesOrderMasArDetailsViewModel() {
            //#region Members
            this.salesOrderMasARList = ko.observableArray([]);
            this.totalInvoiceAmount = ko.observable();
            this.totalPaymentAmount = ko.observable();
            this.gridHeader = ko.observable('');
            this.totalRow = ko.observable('');
        }
        // Initialization of the grid.
        SalesOrderMasArDetailsViewModel.prototype.initializeMasDetails = function (data, salesOrderId) {
            var self = this;
            var totalInvoiceAmount = 0.0, totalAppliedAmount = 0.0;
            if (self.salesOrderMasARList != null)
                self.salesOrderMasARList.removeAll();

            if (data) {
                for (var i = 0; i < data.SalesOrderMasDetailsForAR.length; i++) {
                    var salesOrderMasAP = new SalesOrderMasARModel(function () {
                        self.updateTotalCostAndWeight();
                    });
                    var invAmountWithoutComma = data.SalesOrderMasDetailsForAR[i].InvoicedAmount.toString();
                    var check = invAmountWithoutComma.indexOf(",");
                    if (check === -1) {
                        totalInvoiceAmount += parseFloat(data.SalesOrderMasDetailsForAR[i].InvoicedAmount.toString());
                    } else {
                        //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                        totalInvoiceAmount += parseFloat(invAmountWithoutComma.replace(/,/g, ""));
                    }

                    var payAmountWithoutComma = data.SalesOrderMasDetailsForAR[i].AppliedAmount.toString();
                    var check = payAmountWithoutComma.indexOf(",");
                    if (check === -1) {
                        totalAppliedAmount += parseFloat(data.SalesOrderMasDetailsForAR[i].AppliedAmount.toString());
                    } else {
                        //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                        totalAppliedAmount += parseFloat(payAmountWithoutComma.replace(/,/g, ""));
                    }

                    salesOrderMasAP.initializeSalesOrderMasARModel(data.SalesOrderMasDetailsForAR[i]);

                    self.salesOrderMasARList.push(salesOrderMasAP);
                }

                var salesOrderMasApTotal = new SalesOrderMasARModel(function () {
                    self.updateTotalCostAndWeight();
                });

                salesOrderMasApTotal.initializeSalesOrderMasARTotal(totalInvoiceAmount, totalAppliedAmount);
                self.salesOrderMasARList.push(salesOrderMasApTotal);
            }
        };

        SalesOrderMasArDetailsViewModel.prototype.beforeBind = function () {
            var self = this;
        };

        SalesOrderMasArDetailsViewModel.prototype.compositionComplete = function () {
            var self = this;
        };

        SalesOrderMasArDetailsViewModel.prototype.updateTotalCostAndWeight = function () {
            var self = this;

            var totalInvoiceAmount = 0.0, totalPaymentAmount = 0.0;

            self.salesOrderMasARList().forEach(function (item) {
                if (item.InvoicedAmount()) {
                    var costWithoutComma = item.InvoicedAmount().toString();
                    var check = costWithoutComma.indexOf(",");
                    if (check === -1) {
                        totalInvoiceAmount += parseFloat(item.InvoicedAmount().toString());
                    } else {
                        //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                        totalInvoiceAmount += parseFloat(costWithoutComma.replace(/,/g, ""));
                    }
                }

                if (item.AppliedAmount()) {
                    var costWithoutComma = item.AppliedAmount().toString();
                    var check = costWithoutComma.indexOf(",");
                    if (check === -1) {
                        totalPaymentAmount += parseFloat(item.AppliedAmount().toString());
                    } else {
                        //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                        totalPaymentAmount += parseFloat(costWithoutComma.replace(/,/g, ""));
                    }
                }
            });

            self.totalPaymentAmount($.number(totalPaymentAmount.toString(), 2));
            self.totalInvoiceAmount($.number(totalInvoiceAmount.toString(), 2));
        };
        return SalesOrderMasArDetailsViewModel;
    })();
    exports.SalesOrderMasArDetailsViewModel = SalesOrderMasArDetailsViewModel;

    var SalesOrderMasARModel = (function () {
        function SalesOrderMasARModel(costOrWeightChanged) {
            this.BOLNumber = ko.observable();
            this.SalesOrderNumber = ko.observable();
            this.ApplyFrom = ko.observable();
            this.InvoicedDateDisplay = ko.observable();
            this.InvoicedAmount = ko.observable();
            this.PaymentMemoDateDisplay = ko.observable();
            this.AppliedToInvoice = ko.observable();
            this.AppliedAmount = ko.observable();
            this.PostedDisplay = ko.observable();
            this.totalRow = ko.observable('');
            var self = this;
            return self;
        }
        // get the item view model
        SalesOrderMasARModel.prototype.initializeSalesOrderMasARModel = function (item) {
            var self = this;
            if (item != null) {
                self.BOLNumber(item.BOLNumber);
                self.SalesOrderNumber(item.SalesOrderNumber);
                self.ApplyFrom(item.ApplyFrom);
                self.InvoicedDateDisplay(item.InvoicedDateDisplay);
                self.AppliedToInvoice(item.AppliedToInvoice);
                self.PostedDisplay(item.PostedDisplay);
                self.InvoicedAmount($.number((item.InvoicedAmount), 2));
                self.PaymentMemoDateDisplay(item.PaymentMemoDateDisplay);
                self.AppliedAmount($.number((item.AppliedAmount), 2));
                self.totalRow('');
            }
        };

        SalesOrderMasARModel.prototype.initializeSalesOrderMasARTotal = function (totalInvoiceAmount, totalPaymentAmount) {
            var self = this;

            self.SalesOrderNumber('');
            self.ApplyFrom('');
            self.InvoicedDateDisplay('');
            self.AppliedToInvoice('');
            self.PostedDisplay('');
            self.InvoicedAmount($.number((totalInvoiceAmount), 2));
            self.PaymentMemoDateDisplay('');
            self.AppliedAmount($.number((totalPaymentAmount), 2));
            self.BOLNumber('Total');
            self.totalRow('rebillTotal');
        };
        return SalesOrderMasARModel;
    })();
    exports.SalesOrderMasARModel = SalesOrderMasARModel;
});
