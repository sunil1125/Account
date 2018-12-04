/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/Boards.d.ts" />
/// <reference path="../TypeDefs/CommonModels.d.ts" />
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system'], function(require, exports, ___router__, ___app__, __refSystem__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;

    //#endregion Import
    (function (Models) {
        var DisputedBillParameter = (function () {
            function DisputedBillParameter(args) {
                this.FromDate = refSystem.isObject(args) ? args.FromDate : new Date();
                this.ToDate = refSystem.isObject(args) ? args.ToDate : new Date();
                this.PageNumber = refSystem.isObject(args) ? args.PageNumber : 0;
                this.PageSize = refSystem.isObject(args) ? args.PageSize : 0;
            }
            return DisputedBillParameter;
        })();
        Models.DisputedBillParameter = DisputedBillParameter;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
