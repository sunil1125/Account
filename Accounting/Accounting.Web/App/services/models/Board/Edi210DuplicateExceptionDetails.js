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
        var Edi210DuplicateExceptionDetails = (function () {
            function Edi210DuplicateExceptionDetails(args) {
                this.ID = refSystem.isObject(args) ? args.ID : 0;
                this.ProNumber = refSystem.isObject(args) ? args.ProNumber : '';
                this.CarrierId = refSystem.isObject(args) ? args.CarrierId : 0;
                this.NetAmountDue = refSystem.isObject(args) ? args.NetAmountDue : '';
                this.BOLNo = refSystem.isObject(args) ? args.BOLNo : '';
            }
            return Edi210DuplicateExceptionDetails;
        })();
        Models.Edi210DuplicateExceptionDetails = Edi210DuplicateExceptionDetails;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
