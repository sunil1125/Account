/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    /// <reference path="../TypeDefs/Report.d.ts" />
    /// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
    var refSystem = __refSystem__;

    (function (Models) {
        var OrderRebillReport = (function () {
            function OrderRebillReport(args) {
                this.ShipmentId = refSystem.isObject(args) ? (args.ShipmentId) : 0;
                this.BOLNo = refSystem.isObject(args) ? (args.BOLNo) : '';
                this.PRONo = refSystem.isObject(args) ? (args.PRONo) : '';
                this.TotalCostAdjustment = refSystem.isObject(args) ? (args.TotalCostAdjustment) : 0;
                this.TotalRevenueAdjustment = refSystem.isObject(args) ? (args.TotalRevenueAdjustment) : 0;
                this.Name = refSystem.isObject(args) ? (args.Name) : '';
                this.CompanyName = refSystem.isObject(args) ? (args.CompanyName) : '';
                this.FullName = refSystem.isObject(args) ? (args.FullName) : '';
                this.ReviewDateDisplay = refSystem.isObject(args) ? (args.ReviewDateDisplay) : '';
                this.ReviewedBy = refSystem.isObject(args) ? (args.ReviewedBy) : '';
                this.VendorBillId = refSystem.isObject(args) ? (args.VendorBillId) : 0;
            }
            return OrderRebillReport;
        })();
        Models.OrderRebillReport = OrderRebillReport;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
