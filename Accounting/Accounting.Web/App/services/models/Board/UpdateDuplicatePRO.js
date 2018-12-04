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
        var UpdateDuplicatePRO = (function () {
            function UpdateDuplicatePRO(args) {
                if (args) {
                    this.BatchId = refSystem.isObject(args) ? args.BatchId : 0;
                    this.EDIDetailID = refSystem.isObject(args) ? args.EDIDetailID : 0;
                    this.IsActive = refSystem.isObject(args) ? args.IsActive : false;
                    this.Edi210ItemUnmappedCodeMapping = args.Edi210ItemUnmappedCodeMapping;
                }
            }
            return UpdateDuplicatePRO;
        })();
        Models.UpdateDuplicatePRO = UpdateDuplicatePRO;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
