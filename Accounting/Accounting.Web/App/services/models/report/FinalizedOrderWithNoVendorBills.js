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
        var FinalizedOrderWithNoVendorBillsReport = (function () {
            function FinalizedOrderWithNoVendorBillsReport(args) {
                this.Id = refSystem.isObject(args) ? (args.Id) : 0;
                this.BOLNumber = refSystem.isObject(args) ? (args.BOLNumber) : '';
                this.ProNumber = refSystem.isObject(args) ? (args.ProNumber) : '';
                this.ShipmentDate = refSystem.isObject(args) ? (args.ShipmentDate) : new Date();
                this.Cost = refSystem.isObject(args) ? (args.Cost) : 0;
                this.CustomerId = refSystem.isObject(args) ? (args.CustomerId) : 0;
                this.Customer = refSystem.isObject(args) ? (args.Customer) : '';
                this.Shipper = refSystem.isObject(args) ? (args.Shipper) : '';
                this.TotalPieces = refSystem.isObject(args) ? (args.TotalPieces) : 0;
                this.TotalWeight = refSystem.isObject(args) ? (args.TotalWeight) : 0;
                this.Carrier = refSystem.isObject(args) ? (args.Carrier) : '';
                this.OriginZip = refSystem.isObject(args) ? (args.OriginZip) : '';
                this.OriginCity = refSystem.isObject(args) ? (args.OriginCity) : '';
                this.OriginState = refSystem.isObject(args) ? (args.OriginState) : '';
                this.DestinationCity = refSystem.isObject(args) ? (args.DestinationCity) : '';
                this.DestinationState = refSystem.isObject(args) ? (args.DestinationState) : '';
                this.DestinationZip = refSystem.isObject(args) ? (args.DestinationZip) : '';
                this.SalesRepName = refSystem.isObject(args) ? (args.SalesRepName) : '';
                this.PartnerCompanyName = refSystem.isObject(args) ? (args.PartnerCompanyName) : '';
                this.CustomerTermType = refSystem.isObject(args) ? (args.CustomerTermType) : '';
                this.ShipmentDateDisplay = refSystem.isObject(args) ? (args.ShipmentDateDisplay) : '';
                this.Mode = refSystem.isObject(args) ? (args.Mode) : '';
            }
            return FinalizedOrderWithNoVendorBillsReport;
        })();
        Models.FinalizedOrderWithNoVendorBillsReport = FinalizedOrderWithNoVendorBillsReport;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
