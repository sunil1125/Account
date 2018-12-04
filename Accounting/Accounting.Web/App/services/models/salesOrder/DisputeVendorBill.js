/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system'], function(require, exports, ___router__, ___app__, __refSystem__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;

    (function (Models) {
        var DisputeVendorBill = (function () {
            // ###END:DE25119
            /// <summary>
            /// Constructor Initializes the DisputeVendorBill
            /// </summary>
            function DisputeVendorBill(args) {
                if (args) {
                    this.VendorBillId = refSystem.isObject(args) ? (args.VendorBillId) : 0;
                    this.ProNumber = refSystem.isObject(args) ? (args.ProNumber) : '';
                    this.DisputedDate = refSystem.isObject(args) ? (args.DisputedDate) : new Date();
                    this.DisputeNotes = refSystem.isObject(args) ? (args.DisputeNotes) : '';
                    this.UpdatedBy = refSystem.isObject(args) ? (args.UpdatedBy) : 0;
                    this.UpdatedDate = refSystem.isObject(args) ? (args.UpdatedDate) : 0;
                    this.DisputedAmount = refSystem.isObject(args) ? (args.DisputedAmount) : 0;

                    //##START: US21147
                    this.LateDisputedAmount = refSystem.isObject(args) ? (args.LateDisputedAmount) : 0;

                    //##END: US21147
                    this.BillStatus = refSystem.isObject(args) ? (args.BillStatus) : 0;
                    this.MasClearanceStatus = refSystem.isObject(args) ? (args.MasClearanceStatus) : 0;
                    this.HoldVendorBill = refSystem.isObject(args) ? (args.HoldVendorBill) : false;
                    this.QuickPay = refSystem.isObject(args) ? (args.QuickPay) : false;
                    this.MasTransferDate = refSystem.isObject(args) ? (args.MasTransferDate) : null;
                    this.ListOfBillStatuses = refSystem.isObject(args) ? (args.ListOfBillStatuses) : null;
                    this.ReasonCodes = refSystem.isObject(args) ? (args.ReasonCodes) : null;
                    this.OriginalBillStatus = refSystem.isObject(args) ? (args.OriginalBillStatus) : 0;
                    this.DisputeStatusId = refSystem.isObject(args) ? (args.DisputeStatusId) : 0;
                    this.CarrierCode = refSystem.isObject(args) ? (args.CarrierCode) : '';
                    this.CarrierName = refSystem.isObject(args) ? (args.CarrierName) : '';

                    // ##START: US21791
                    this.AgingDays = refSystem.isObject(args) ? (args.AgingDays) : 0;

                    // ##END: US21791
                    // ##START: US24865
                    this.DisputeCarrierEmailDetailsList = refSystem.isObject(args) ? args.DisputeCarrierEmailDetailsList : [];

                    // ##END: US24865
                    // ###START:DE25119
                    this.IsCreditProcessEnable = refSystem.isObject(args) ? (args.IsCreditProcessEnable) : false;
                    // ###END:DE25119
                }
            }
            DisputeVendorBill.prototype.activate = function () {
                return true;
            };
            return DisputeVendorBill;
        })();
        Models.DisputeVendorBill = DisputeVendorBill;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
