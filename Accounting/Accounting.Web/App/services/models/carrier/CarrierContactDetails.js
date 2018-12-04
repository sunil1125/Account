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
        var CarrierContactDetail = (function () {
            function CarrierContactDetail(args) {
                this.Id = refSystem.isObject(args) ? args.CarrierId : 0;
                this.MassCarrierID = refSystem.isObject(args) ? args.MassCarrierID : 0;
                this.ContactType = refSystem.isObject(args) ? args.ContactType : 0;
                this.CarrierName = refSystem.isObject(args) ? args.CarrierName : '';
                this.ContactName = refSystem.isObject(args) ? args.ContactName : '';
                this.ContactEmail = refSystem.isObject(args) ? args.ContactEmail : '';
                this.ContactPhone = refSystem.isObject(args) ? args.ContactPhone : '';
                this.ContactFax = refSystem.isObject(args) ? args.ContactFax : '';
                this.FirstMailPeriod = refSystem.isObject(args) ? args.FirstMailPeriod : 0;
                this.SecondMailPeriod = refSystem.isObject(args) ? args.SecondMailPeriod : 0;
                this.UpdatedBy = refSystem.isObject(args) ? args.UpdatedBy : 0;
                this.CarrierId = refSystem.isObject(args) ? args.CarrierId : 0;
                this.DisplayName = refSystem.isObject(args) ? args.DisplayName : '';
                this.CarrierTypes = refSystem.isObject(args) ? args.CarrierTypes : null;
            }
            return CarrierContactDetail;
        })();
        Models.CarrierContactDetail = CarrierContactDetail;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
