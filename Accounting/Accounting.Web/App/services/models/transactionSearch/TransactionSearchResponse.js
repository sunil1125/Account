/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../TypeDefs/TransactionSearchModel.d.ts" />
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    var refSystem = __refSystem__;

    /* File Created: Sep 12, 2014
    ** Created By: Satish
    */
    (function (Model) {
        var TransactionSearchResponse = (function () {
            function TransactionSearchResponse(args) {
                this.SalesOrderResponse = refSystem.isObject(args) ? args.SalesOrderResponse : null;
                this.VendorBillOrPurchaseOrderResponse = refSystem.isObject(args) ? args.VendorBillOrPurchaseOrderResponse : null;
                this.InvoiceResponse = refSystem.isObject(args) ? args.InvoicesResponse : null;
                this.TruckloadQuoteResponse = refSystem.isObject(args) ? args.TruckloadQuoteResponse : null;
            }
            return TransactionSearchResponse;
        })();
        Model.TransactionSearchResponse = TransactionSearchResponse;
    })(exports.Model || (exports.Model = {}));
    var Model = exports.Model;
});
