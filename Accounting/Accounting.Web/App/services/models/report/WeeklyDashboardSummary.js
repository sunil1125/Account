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
        var WeeklyDashboardSummary = (function () {
            function WeeklyDashboardSummary(args) {
                this.ShipmentType = refSystem.isObject(args) ? (args.ShipmentType) : '';
                this.LtlCount = refSystem.isObject(args) ? (args.LtlCount) : 0;
                this.TotalWeight = refSystem.isObject(args) ? (args.TotalWeight) : 0;
                this.TotalCost = refSystem.isObject(args) ? (args.TotalCost) : 0;
                this.ChargePerWeight = refSystem.isObject(args) ? (args.ChargePerWeight) : 0;
            }
            return WeeklyDashboardSummary;
        })();
        Models.WeeklyDashboardSummary = WeeklyDashboardSummary;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
