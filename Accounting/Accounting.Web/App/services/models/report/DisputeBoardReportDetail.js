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
        var DisputeBoardDetailsReport = (function () {
            function DisputeBoardDetailsReport(args) {
                this.VendorBillId = refSystem.isObject(args) ? (args.VendorBillId) : 0;
                this.VendorName = refSystem.isObject(args) ? (args.VendorName) : '';
                this.CarrierID = refSystem.isObject(args) ? (args.CarrierID) : 0;
                this.BillDate = refSystem.isObject(args) ? (args.BillDate) : new Date();
                this.DueDate = refSystem.isObject(args) ? (args.DueDate) : new Date();
                this.PRONumber = refSystem.isObject(args) ? (args.PRONumber) : '';
                this.PONumber = refSystem.isObject(args) ? (args.PONumber) : '';
                this.BOLNumber = refSystem.isObject(args) ? (args.BOLNumber) : '';
                this.MainVendorBOLNumber = refSystem.isObject(args) ? (args.MainVendorBOLNumber) : '';
                this.Amount = refSystem.isObject(args) ? (args.Amount) : 0;
                this.DisputedAmount = refSystem.isObject(args) ? (args.DisputedAmount) : 0;
                this.OriginZip = refSystem.isObject(args) ? (args.OriginZip) : '';
                this.DestinationZip = refSystem.isObject(args) ? (args.DestinationZip) : '';
                this.CreatedDate = refSystem.isObject(args) ? (args.CreatedDate) : new Date();
                this.UpdatedBy = refSystem.isObject(args) ? (args.UpdatedBy) : 0;
                this.UpdatedDate = refSystem.isObject(args) ? (args.UpdatedDate) : 0;
                this.TotalPieces = refSystem.isObject(args) ? (args.TotalPieces) : 0;
                this.TotalWeight = refSystem.isObject(args) ? (args.TotalWeight) : 0;
                this.DeliveryDate = refSystem.isObject(args) ? (args.DeliveryDate) : new Date();
                this.DisputedDate = refSystem.isObject(args) ? (args.DisputedDate) : new Date();
                this.ProcessDetails = refSystem.isObject(args) ? (args.ProcessDetails) : '';
                this.ReferenceNo = refSystem.isObject(args) ? (args.ReferenceNo) : '';
                this.VendorBillStatus = refSystem.isObject(args) ? (args.VendorBillStatus) : '';
                this.DisputeNote = refSystem.isObject(args) ? (args.DisputeNote) : '';
                this.TotalEstimateCost = refSystem.isObject(args) ? (args.TotalEstimateCost) : 0;
                this.BillDateDisplay = refSystem.isObject(args) ? (args.BillDateDisplay) : '';
                this.DisputedDateDisplay = refSystem.isObject(args) ? (args.DisputedDateDisplay) : '';
            }
            return DisputeBoardDetailsReport;
        })();
        Models.DisputeBoardDetailsReport = DisputeBoardDetailsReport;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
