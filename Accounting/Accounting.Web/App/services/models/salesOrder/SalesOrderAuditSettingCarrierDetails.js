/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    var refSystem = __refSystem__;

    /* File Created: Nov 30, 2014
    ** Created By: Satish
    */
    (function (Model) {
        var SalesOrderAuditSettingCarrierDetails = (function () {
            function SalesOrderAuditSettingCarrierDetails(args) {
                this.CarrierId = refSystem.isObject(args) ? args.CarrierId : 0;
                this.IsFAKMapping = refSystem.isObject(args) ? args.IsFAKMapping : false;
            }
            return SalesOrderAuditSettingCarrierDetails;
        })();
        Model.SalesOrderAuditSettingCarrierDetails = SalesOrderAuditSettingCarrierDetails;
    })(exports.Model || (exports.Model = {}));
    var Model = exports.Model;
});
