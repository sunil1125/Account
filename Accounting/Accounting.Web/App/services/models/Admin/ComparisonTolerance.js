/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/Admin.d.ts" />
/// <reference path="../TypeDefs/CommonModels.d.ts" />
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system'], function(require, exports, ___router__, ___app__, __refSystem__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;

    //#endregion Import
    (function (Models) {
        var ComparisonTolerance = (function () {
            function ComparisonTolerance(args) {
                this.ID = refSystem.isObject(args) ? args.ID : 0;
                this.ToleranceAmount = refSystem.isObject(args) ? args.ToleranceAmount : 0;
                this.Description = refSystem.isObject(args) ? args.Description : '';
                this.CustomerType = refSystem.isObject(args) ? args.CustomerType : 0;
                this.ToleranceType = refSystem.isObject(args) ? args.ToleranceType : null;
                this.UpdatedBy = refSystem.isObject(args) ? args.UpdatedBy : 0;
            }
            return ComparisonTolerance;
        })();
        Models.ComparisonTolerance = ComparisonTolerance;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
