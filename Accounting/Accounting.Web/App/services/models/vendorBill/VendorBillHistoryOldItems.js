/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />
define(["require", "exports"], function(require, exports) {
    /* File Created: July 11, 2014
    ** Created By: Bhanu pratap
    */
    (function (Models) {
        var VendorBillHistoryOldItems = (function () {
            function VendorBillHistoryOldItems(args) {
                if (args) {
                    this.Description = args.Description;
                    this.Cost = args.Cost;
                    this.Dispute = args.Dispute;
                    this.DisputeLost = args.DisputeLost;
                    this.Class = args.Class;
                    this.Weight = args.Weight;
                    this.Length = args.Length;
                    this.Height = args.Height;
                    this.Width = args.Width;
                    this.Pieces = args.Pieces;
                    this.Pallet = args.Pallet;
                    this.NMFC = args.NMFCNumber;
                    this.ChangedBy = args.ChangedBy;
                }
            }
            return VendorBillHistoryOldItems;
        })();
        Models.VendorBillHistoryOldItems = VendorBillHistoryOldItems;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
