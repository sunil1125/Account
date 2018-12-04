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
        var CarrierMappingDetails = (function () {
            function CarrierMappingDetails(args) {
                this.CarrierId = refSystem.isObject(args) ? args.CarrierId : 0;
                this.CarrierName = refSystem.isObject(args) ? args.CarrierName : '';
                this.CarrierCode = refSystem.isObject(args) ? args.CarrierCode : '';
                this.MinimumWeight = refSystem.isObject(args) ? args.MinimumWeight : 0;
                this.IsVPTLCarrier = refSystem.isObject(args) ? args.IsVPTLCarrier : false;
                this.CarrierType = refSystem.isObject(args) ? args.CarrierType : '';
                this.CarrierTypeId = refSystem.isObject(args) ? args.CarrierTypeId : 0;
                this.MASCarrier = refSystem.isObject(args) ? args.MASCarrier : '';
                this.MASCode = refSystem.isObject(args) ? args.MASCode : '';
                this.Mapped = refSystem.isObject(args) ? args.Mapped : '';
                this.LegalName = refSystem.isObject(args) ? args.LegalName : '';
                this.Contacts = refSystem.isObject(args) ? args.Contacts : '';
                this.IsBlockedFromSystem = refSystem.isObject(args) ? args.IsBlockedFromSystem : false;
                this.MassId = refSystem.isObject(args) ? args.MassId : '';
            }
            return CarrierMappingDetails;
        })();
        Models.CarrierMappingDetails = CarrierMappingDetails;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
