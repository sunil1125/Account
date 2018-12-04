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
        var RexnordInvoicingReport = (function () {
            function RexnordInvoicingReport(args) {
                this.Id = refSystem.isObject(args) ? (args.Id) : 0;
                this.BOLNumber = refSystem.isObject(args) ? (args.BOLNumber) : '';
                this.InvoiceDate = refSystem.isObject(args) ? (args.InvoiceDate) : new Date();
                this.BranchId = refSystem.isObject(args) ? (args.BranchId) : 0;
                this.ShipmentType = refSystem.isObject(args) ? (args.Revenue) : 0;
                this.Cost = refSystem.isObject(args) ? (args.Cost) : 0;
                this.Revenue = refSystem.isObject(args) ? (args.Revenue) : 0;
                this.InvoiceDateDisplay = refSystem.isObject(args) ? (args.InvoiceDateDisplay) : '';
                this.BranchName = refSystem.isObject(args) ? (args.BranchName) : '';
                this.ShipmentTypeDisplay = refSystem.isObject(args) ? (args.ShipmentTypeDisplay) : '';
            }
            return RexnordInvoicingReport;
        })();
        Models.RexnordInvoicingReport = RexnordInvoicingReport;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
