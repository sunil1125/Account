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
        var EDI210ExceptionDetailsItems = (function () {
            function EDI210ExceptionDetailsItems(args) {
                this.ID = refSystem.isObject(args) ? args.ID : 0;
                this.Item = refSystem.isObject(args) ? args.Item : '';
                this.Description = refSystem.isObject(args) ? args.Description : '';
                this.Cost = refSystem.isObject(args) ? args.Cost : '';
                this.Class = refSystem.isObject(args) ? args.Class : '';
                this.Weight = refSystem.isObject(args) ? args.Weight : 0;
                this.Pieces = refSystem.isObject(args) ? args.Pieces : 0;
                this.Height = refSystem.isObject(args) ? args.Height : 0;
                this.Width = refSystem.isObject(args) ? args.Width : 0;
            }
            return EDI210ExceptionDetailsItems;
        })();
        Models.EDI210ExceptionDetailsItems = EDI210ExceptionDetailsItems;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
