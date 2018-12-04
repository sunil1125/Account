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
        var ForceInvoiceShipment = (function () {
            function ForceInvoiceShipment(args) {
                this.ForceInvoiceReason = refSystem.isObject(args) ? args.ForceInvoiceReason : '';
                this.BatchId = refSystem.isObject(args) ? args.BatchId : 0;
                this.BOLNo = refSystem.isObject(args) ? args.BOLNo : '';
                this.ShipmentId = refSystem.isObject(args) ? args.ShipmentId : 0;
                this.IsBatch = refSystem.isObject(args) ? args.IsBatch : false;
                this.BatchShipmentIds = refSystem.isObject(args) ? args.BatchShipmentIds : '';
                this.UpdateDateTime = refSystem.isObject(args) ? args.UpdateDateTime : 0;
            }
            return ForceInvoiceShipment;
        })();
        Models.ForceInvoiceShipment = ForceInvoiceShipment;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
