/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/Admin.d.ts" />
/// <reference path="../TypeDefs/CommonModels.d.ts" />
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system'], function(require, exports, ___router__, ___app__, __refSystem__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;

    //#endregion Import
    (function (Models) {
        var CompanyOnlinePaymentDetails = (function () {
            function CompanyOnlinePaymentDetails(args) {
                this.CCProcessCharge = refSystem.isObject(args) ? args.CCProcessCharge : 0;
                this.ECheckProcessCharge = refSystem.isObject(args) ? args.ECheckProcessCharge : 0;
                this.CCVisibility = refSystem.isObject(args) ? args.CCVisibility : false;
                this.ECheckVisible = refSystem.isObject(args) ? args.ECheckVisible : false;
                this.CCMessage = refSystem.isObject(args) ? args.CCMessage : '';
                this.ECheckMessage = refSystem.isObject(args) ? args.ECheckMessage : '';
                this.DebitVisibility = refSystem.isObject(args) ? args.DebitVisibility : false;
                this.DebitMessage = refSystem.isObject(args) ? args.DebitMessage : '';
                this.CustomerId = refSystem.isObject(args) ? args.CustomerId : 0;
                this.DiscountDueDays = refSystem.isObject(args) ? args.DiscountDueDays : 0;
                this.EntityType = refSystem.isObject(args) ? args.EntityType : 0;
                this.EntityId = refSystem.isObject(args) ? args.EntityId : 0;
            }
            return CompanyOnlinePaymentDetails;
        })();
        Models.CompanyOnlinePaymentDetails = CompanyOnlinePaymentDetails;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
