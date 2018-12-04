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
        var Edi210DuplicateExceptionCarrierDetails = (function () {
            function Edi210DuplicateExceptionCarrierDetails(args) {
                this.ID = refSystem.isObject(args) ? args.ID : 0;
                this.CarrierName = refSystem.isObject(args) ? args.CarrierName : '';
                this.CarrierID = refSystem.isObject(args) ? args.CarrierID : 0;
                this.BOLNumber = refSystem.isObject(args) ? args.BOLNumber : '';
                this.ProNumber = refSystem.isObject(args) ? args.ProNumber : '';
                this.BillDate = refSystem.isObject(args) ? args.BillDate : '';
                this.PO = refSystem.isObject(args) ? args.PO : '';
                this.EDIBol = refSystem.isObject(args) ? args.EDIBol : '';
                this.ReferenceNo = refSystem.isObject(args) ? args.ReferenceNo : '';
                this.ShipmentID = refSystem.isObject(args) ? args.ShipmentID : 0;
            }
            return Edi210DuplicateExceptionCarrierDetails;
        })();
        Models.Edi210DuplicateExceptionCarrierDetails = Edi210DuplicateExceptionCarrierDetails;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
