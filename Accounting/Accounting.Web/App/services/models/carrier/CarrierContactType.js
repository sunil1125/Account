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
        var CarrierContactDetails = (function () {
            function CarrierContactDetails(args) {
                this.Id = refSystem.isObject(args) ? args.Id : 0;
                this.DisplayName = refSystem.isObject(args) ? args.DisplayName : '';
                this.IsNotificationApplicable = refSystem.isObject(args) ? args.IsNotificationApplicable : 0;
            }
            return CarrierContactDetails;
        })();
        Models.CarrierContactDetails = CarrierContactDetails;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
