/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system'], function(require, exports, ___router__, ___app__, __refSystem__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;

    //#endregion Import
    (function (Models) {
        var VendorBillExceptionRulesAndResolution = (function () {
            function VendorBillExceptionRulesAndResolution(args) {
                this.VendorBillId = refSystem.isObject(args) ? args.VendorBillId : 0;
                this.VendorBillExceptionRuleDescription = refSystem.isObject(args) ? (args.VendorBillExceptionRuleDescription) : '';
                this.ExceptionResolution = refSystem.isObject(args) ? (args.ExceptionResolution) : '';
            }
            return VendorBillExceptionRulesAndResolution;
        })();
        Models.VendorBillExceptionRulesAndResolution = VendorBillExceptionRulesAndResolution;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
