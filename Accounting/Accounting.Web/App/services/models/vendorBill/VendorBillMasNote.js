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
        var VendorBillMasNote = (function () {
            function VendorBillMasNote(args) {
                this.VendorBillId = refSystem.isObject(args) ? (args.VendorBillId) : 0;
                this.EffectiveDate = refSystem.isObject(args) ? (args.EffectiveDate) : new Date();
                this.MemoText = refSystem.isObject(args) ? (args.MemoText) : '';
                this.Sender = refSystem.isObject(args) ? (args.Sender) : '';
                this.EffectiveDateDisplay = refSystem.isObject(args) ? (args.EffectiveDateDisplay) : '';
            }
            return VendorBillMasNote;
        })();
        Models.VendorBillMasNote = VendorBillMasNote;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
