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
        var Vendor = (function () {
            function Vendor(args) {
                this.ID = refSystem.isObject(args) ? (args.ID) : 0;
                this.CarrierName = refSystem.isObject(args) ? (args.CarrierName) : '';
                this.CarrierType = refSystem.isObject(args) ? (args.CarrierType) : 0;
                this.CarrierCode = refSystem.isObject(args) ? (args.CarrierCode) : '';
                this.MCNumber = refSystem.isObject(args) ? (args.MCNumber) : '';
                this.ContactName = refSystem.isObject(args) ? (args.ContactName) : '';
                this.City = refSystem.isObject(args) ? (args.City) : '';
                this.State = refSystem.isObject(args) ? (args.State) : '';
                this.CarrierTypeName = refSystem.isObject(args) ? (args.CarrierTypeName) : '';
            }
            return Vendor;
        })();
        Models.Vendor = Vendor;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
