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

    /* File Created: Aug 9, 2014
    ** Created By: Bhanu
    */
    (function (Models) {
        var SalesOrderItemDetail = (function () {
            function SalesOrderItemDetail(args) {
                this.Id = refSystem.isObject(args) ? (args.Id) : 0;
                this.BOLNumber = refSystem.isObject(args) ? args.BOLNumber : '';
                this.SalesOrderId = refSystem.isObject(args) ? args.SalesOrderId : 0;
                this.SelectedClassType = refSystem.isObject(args) ? args.SelectedClassType : 0;
                this.OriginalWeight = refSystem.isObject(args) ? (args.OriginalWeight) : 0;
                this.Weight = refSystem.isObject(args) ? args.Weight : 0;
                this.EstimatedCost = refSystem.isObject(args) ? (args.EstimatedCost) : 0;
                this.Cost = refSystem.isObject(args) ? args.Cost : 0;
                this.BsCost = refSystem.isObject(args) ? args.BsCost : 0;
                this.Revenue = refSystem.isObject(args) ? (args.Revenue) : 0;
                this.Hazardous = refSystem.isObject(args) ? args.Hazardous : false;
                this.Length = refSystem.isObject(args) ? (args.Length) : 0;
                this.Width = refSystem.isObject(args) ? args.Width : 0;
                this.Height = refSystem.isObject(args) ? (args.Height) : 0;
                this.PieceCount = refSystem.isObject(args) ? args.PieceCount : 0;
                this.OriginalPalletCount = refSystem.isObject(args) ? (args.OriginalPalletCount) : 0;
                this.NewPalletCount = refSystem.isObject(args) ? args.NewPalletCount : 0;
                this.PackageTypeName = refSystem.isObject(args) ? args.PackageTypeName : '';
                this.NMFCNumber = refSystem.isObject(args) ? (args.NMFC) : '';
                this.UserDescription = refSystem.isObject(args) ? args.UserDescription : '';
                this.ItemId = refSystem.isObject(args) ? (args.ItemId) : 0;
                this.ItemName = refSystem.isObject(args) ? args.ItemName : '';
                this.AccessorialId = refSystem.isObject(args) ? (args.AccessorialId) : 0;
                this.Items = refSystem.isObject(args) ? (args.Items) : 0;
                this.Pieces = refSystem.isObject(args) ? (args.Pieces) : 0;
                this.DisputeAmount = refSystem.isObject(args) ? (args.DisputeAmount) : 0;
                this.Class = refSystem.isObject(args) ? (args.Class) : 0;
                this.PalletCount = refSystem.isObject(args) ? (args.PalletCount) : 0;
                this.HazardousUNNo = refSystem.isObject(args) ? (args.HazardousUNNo) : '';
                this.PackingGroupNo = refSystem.isObject(args) ? (args.PackingGroupNo) : '';
                this.PoNumber = refSystem.isObject(args) ? (args.PoNumber) : '';
                this.ProductCode = refSystem.isObject(args) ? (args.ProductCode) : '';
                this.PLCCost = refSystem.isObject(args) ? (args.PLCCost) : 0;
                this.PackageTypeId = refSystem.isObject(args) ? (args.PackageTypeId) : 0;
                this.HazmatClass = refSystem.isObject(args) ? (args.HazmatClass) : 0;
                this.SelectedItemTypes = refSystem.isObject(args) ? (args.SelectedItemTypes) : null;
                this.PackageTypes = refSystem.isObject(args) ? (args.PackageTypes) : null;
                this.ClassTypes = refSystem.isObject(args) ? (args.ClassTypes) : null;
                this.IsMarkForDeletion = refSystem.isObject(args) ? (args.IsMarkForDeletion) : false;
                this.IsShippingItem = refSystem.isObject(args) ? (args.IsShippingItem) : false;
                this.NMFC = refSystem.isObject(args) ? (args.NMFC) : '';
                this.isChecked = refSystem.isObject(args) ? (args.isChecked) : false;
                this.isUpdated = refSystem.isObject(args) ? (args.isUpdated) : false;
                this.OriginalRevenue = refSystem.isObject(args) ? (args.OriginalRevenue) : 0;
                this.OriginalLineItemRevenue = refSystem.isObject(args) ? (args.OriginalLineItemRevenue) : 0;
                this.OriginalLineItemPLCCost = refSystem.isObject(args) ? (args.OriginalLineItemPLCCost) : 0;
                this.IsCalculateRevenue = refSystem.isObject(args) ? args.IsCalculateRevenue : false;
            }
            return SalesOrderItemDetail;
        })();
        Models.SalesOrderItemDetail = SalesOrderItemDetail;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
