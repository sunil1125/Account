/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/Report.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    var refSystem = __refSystem__;

    (function (Models) {
        var DisputedVendorBillsReport = (function () {
            function DisputedVendorBillsReport(args) {
                this.ShipmentId = refSystem.isObject(args) ? (args.ShipmentId) : 0;
                this.VendorBillId = refSystem.isObject(args) ? (args.VendorBillId) : 0;
                this.BOLNumber = refSystem.isObject(args) ? (args.BOLNumber) : '';
                this.ProNumber = refSystem.isObject(args) ? (args.ProNumber) : '';
                this.Carrier = refSystem.isObject(args) ? (args.Carrier) : '';
                this.Customer = refSystem.isObject(args) ? (args.Customer) : '';
                this.SalesRepNumber = refSystem.isObject(args) ? (args.SalesRepNumber) : '';
                this.SalesRep = refSystem.isObject(args) ? (args.SalesRep) : '';
                this.EstimatedCost = refSystem.isObject(args) ? (args.EstimatedCost) : 0;
                this.ActualCost = refSystem.isObject(args) ? (args.ActualCost) : 0;
                this.DisputedDate = refSystem.isObject(args) ? (args.DisputedDate) : new Date();
                this.InternalDisputeDate = refSystem.isObject(args) ? (args.InternalDisputeDate) : new Date();
                this.DisputedAmount = refSystem.isObject(args) ? (args.DisputedAmount) : 0;
                this.VendorBillDate = refSystem.isObject(args) ? (args.VendorBillDate) : new Date();
                this.APDisputeNote = refSystem.isObject(args) ? (args.APDisputeNote) : '';
                this.CRRDispNote = refSystem.isObject(args) ? (args.CRRDispNote) : '';
                this.DisputedBy = refSystem.isObject(args) ? (args.DisputedBy) : '';
                this.DisputedDateDisplay = refSystem.isObject(args) ? (args.DisputedDateDisplay) : '';
                this.InternalDisputeDateDisplay = refSystem.isObject(args) ? (args.InternalDisputeDateDisplay) : '';
                this.VendorBillDateDisplay = refSystem.isObject(args) ? (args.VendorBillDateDisplay) : '';
            }
            return DisputedVendorBillsReport;
        })();
        Models.DisputedVendorBillsReport = DisputedVendorBillsReport;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
