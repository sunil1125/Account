/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    var refSystem = __refSystem__;

    /* File Created: July 11, 2014
    ** Created By: Bhanu pratap
    */
    (function (Models) {
        var VendorBillHistoryNewItems = (function () {
            function VendorBillHistoryNewItems(args) {
                this.ID = refSystem.isObject(args) ? args.ID : "";
                this.Description = refSystem.isObject(args) ? args.Description : "";
                this.Cost = refSystem.isObject(args) ? args.Cost : "";
                this.Dispute = refSystem.isObject(args) ? args.Dispute : 0;
                this.DisputeLost = refSystem.isObject(args) ? args.DisputeLost : 0;
                this.Class = refSystem.isObject(args) ? args.Class : "";
                this.Weight = refSystem.isObject(args) ? args.Weight : 0;
                this.Length = refSystem.isObject(args) ? args.Length : 0;
                this.Height = refSystem.isObject(args) ? args.Height : 0;
                this.Width = refSystem.isObject(args) ? args.Width : 0;
                this.Pieces = refSystem.isObject(args) ? args.Pieces : 0;
                this.Pallet = refSystem.isObject(args) ? args.Pallet : 0;
                this.NMFCNumber = refSystem.isObject(args) ? args.NMFCNumber : "";
                this.ChangedBy = refSystem.isObject(args) ? args.ChangedBy : "";
                this.ChangeDate = refSystem.isObject(args) ? args.ChangeDate : "";
                this.Application = refSystem.isObject(args) ? args.Application : "";
                this.ChangeAction = refSystem.isObject(args) ? args.ChangeAction : "";
                this.CostField = refSystem.isObject(args) ? args.CostField : 0;
            }
            return VendorBillHistoryNewItems;
        })();
        Models.VendorBillHistoryNewItems = VendorBillHistoryNewItems;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
