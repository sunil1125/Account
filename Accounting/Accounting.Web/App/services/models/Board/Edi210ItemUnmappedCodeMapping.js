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
        var Edi210ItemUnmappedCodeMapping = (function () {
            function Edi210ItemUnmappedCodeMapping(args) {
                this.ID = refSystem.isObject(args) ? args.ID : 0;
                this.Item = refSystem.isObject(args) ? args.Item : '';
                this.Description = refSystem.isObject(args) ? args.Description : '';
                this.Cost = refSystem.isObject(args) ? args.Cost : 0;
                this.Class = refSystem.isObject(args) ? args.Class : '';
                this.Weight = refSystem.isObject(args) ? args.Weight : 0;
                this.Length = refSystem.isObject(args) ? args.Length : '';
                this.Pieces = refSystem.isObject(args) ? args.Pieces : '';
                this.Height = refSystem.isObject(args) ? args.Height : '';
                this.Width = refSystem.isObject(args) ? args.Width : '';
                this.MappedCode = refSystem.isObject(args) ? args.MappedCode : '';
            }
            return Edi210ItemUnmappedCodeMapping;
        })();
        Models.Edi210ItemUnmappedCodeMapping = Edi210ItemUnmappedCodeMapping;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
