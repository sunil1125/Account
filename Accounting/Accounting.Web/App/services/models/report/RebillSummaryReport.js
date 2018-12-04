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
        var RebillSummaryReport = (function () {
            function RebillSummaryReport(args) {
                this.VendorBillId = refSystem.isObject(args) ? (args.VendorBillId) : 0;
                this.VendorBillProNo = refSystem.isObject(args) ? (args.VendorBillProNo) : '';
                this.SalesOrder = refSystem.isObject(args) ? (args.SalesOrder) : '';
                this.VBCarrier = refSystem.isObject(args) ? (args.VBCarrier) : '';
                this.BillStatus = refSystem.isObject(args) ? (args.BillStatus) : '';
                this.BillStatusValue = refSystem.isObject(args) ? (args.BillStatusValue) : 0;
                this.PickupDate = refSystem.isObject(args) ? (args.PickupDate) : '';
                this.CustomerId = refSystem.isObject(args) ? (args.CustomerId) : 0;
                this.LoginName = refSystem.isObject(args) ? (args.LoginName) : '';
                this.CompanyName = refSystem.isObject(args) ? (args.CompanyName) : '';
                this.OldWeight = refSystem.isObject(args) ? (args.OldWeight) : 0;
                this.NewWeight = refSystem.isObject(args) ? (args.NewWeight) : 0;
                this.OldCost = refSystem.isObject(args) ? (args.OldCost) : 0;
                this.NewCost = refSystem.isObject(args) ? (args.NewCost) : 0;
                this.SalesRepId = refSystem.isObject(args) ? (args.SalesRepId) : 0;
                this.SalesRep = refSystem.isObject(args) ? (args.SalesRep) : '';
                this.RequoteDate = refSystem.isObject(args) ? (args.RequoteDate) : new Date();
                this.ShipmentNotes = refSystem.isObject(args) ? (args.ShipmentNotes) : '';
                this.DisputeNotes = refSystem.isObject(args) ? (args.DisputeNotes) : '';
                this.RequoteNotes = refSystem.isObject(args) ? (args.RequoteNotes) : '';
                this.Name = refSystem.isObject(args) ? (args.Name) : '';
                this.RequoteDateDisplay = refSystem.isObject(args) ? (args.RequoteDateDisplay) : '';
            }
            return RebillSummaryReport;
        })();
        Models.RebillSummaryReport = RebillSummaryReport;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
