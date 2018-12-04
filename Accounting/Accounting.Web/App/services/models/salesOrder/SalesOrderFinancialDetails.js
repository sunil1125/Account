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

    /* File Created: Feb 16, 2015
    ** Created By: Chadnan
    */
    (function (Models) {
        var SalesOrderFinancialDetails = (function () {
            function SalesOrderFinancialDetails(args) {
                this.SalesOrderId = refSystem.isObject(args) ? (args.SalesOrderId) : 0;
                this.CostDifference = refSystem.isObject(args) ? (args.CostDifference) : 0;
                this.EstimatedRevenue = refSystem.isObject(args) ? args.EstimatedRevenue : 0;
                this.EstimatedCost = refSystem.isObject(args) ? args.EstimatedCost : 0;
                this.FinalRevenue = refSystem.isObject(args) ? (args.FinalRevenue) : 0;
                this.OriginalFinalRevenue = refSystem.isObject(args) ? (args.OriginalFinalRevenue) : 0;
                this.OriginalFinalBSCost = refSystem.isObject(args) ? (args.OriginalFinalBSCost) : 0;
                this.VBFinalCost = refSystem.isObject(args) ? args.VBFinalCost : 0;
                this.SOFinalCost = refSystem.isObject(args) ? args.SOFinalCost : 0;
                this.FinalBSCost = refSystem.isObject(args) ? args.FinalBSCost : 0;
                this.VendorBillCost = refSystem.isObject(args) ? (args.VendorBillCost) : 0;
                this.DisputedAmount = refSystem.isObject(args) ? args.DisputedAmount : 0;
                this.EstimatedProfit = refSystem.isObject(args) ? args.EstimatedProfit : 0;
                this.EstimatedProfitPercent = refSystem.isObject(args) ? (args.EstimatedProfitPercent) : 0;
                this.FinalProfit = refSystem.isObject(args) ? (args.FinalProfit) : 0;
                this.FinalProfitPercent = refSystem.isObject(args) ? args.FinalProfitPercent : 0;
                this.ActualCost = refSystem.isObject(args) ? (args.ActualCost) : 0;
                this.ActualProfit = refSystem.isObject(args) ? args.ActualProfit : 0;
                this.ActualProfitPercent = refSystem.isObject(args) ? (args.ActualProfitPercent) : 0;
                this.Revenue = refSystem.isObject(args) ? args.Revenue : 0;
                this.TotalCost = refSystem.isObject(args) ? args.TotalCost : 0;
                this.OriginalPLCCost = refSystem.isObject(args) ? (args.OriginalPLCCost) : 0;
                this.TotalPLCCost = refSystem.isObject(args) ? args.TotalPLCCost : 0;
                this.EstimatedBSCost = refSystem.isObject(args) ? args.EstimatedBSCost : 0;
                this.GrossProfit = refSystem.isObject(args) ? args.GrossProfit : 0;
            }
            return SalesOrderFinancialDetails;
        })();
        Models.SalesOrderFinancialDetails = SalesOrderFinancialDetails;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
