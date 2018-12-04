/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    var refSystem = __refSystem__;

    /* File Created: Nov 10, 2014
    ** Created By: Satish
    */
    (function (Model) {
        var SalesOrderInvoiceExceptionParameter = (function () {
            function SalesOrderInvoiceExceptionParameter(args) {
                this.BatchId = refSystem.isObject(args) ? args.BatchId : 0;
                this.ShipmentId = refSystem.isObject(args) ? args.ShipmentId : 0;
                this.BolNumber = refSystem.isObject(args) ? args.BolNumber : '';
                this.UpdateDateTime = refSystem.isObject(args) ? args.UpdateDateTime : 0;
                this.InvoicedReason = refSystem.isObject(args) ? args.InvoicedReason : '';
                this.UserId = refSystem.isObject(args) ? args.UserId : 0;
                this.UserName = refSystem.isObject(args) ? args.UserName : '';
            }
            return SalesOrderInvoiceExceptionParameter;
        })();
        Model.SalesOrderInvoiceExceptionParameter = SalesOrderInvoiceExceptionParameter;
    })(exports.Model || (exports.Model = {}));
    var Model = exports.Model;
});
