/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../TypeDefs/PurchaseOrderModel.d.ts" />
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system'], function(require, exports, ___router__, ___app__, __refSystem__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;

    //#endregion Import
    (function (Models) {
        var ForeignBolEmailData = (function () {
            function ForeignBolEmailData(args) {
                if (args) {
                    this.VendorBillId = refSystem.isObject(args) ? args.VendorBillId : 0;
                    this.BillDate = refSystem.isObject(args) ? args.BillDate : new Date();
                    this.CreatedDate = refSystem.isObject(args) ? args.CreatedDate : new Date();
                    this.PRONumber = refSystem.isObject(args) ? args.PRONumber : '';
                    this.MainBolNumber = refSystem.isObject(args) ? args.MainBolNumber : '';
                    this.VendorName = refSystem.isObject(args) ? args.VendorName : '';
                    this.Shipper = refSystem.isObject(args) ? args.Shipper : '';
                    this.Consignee = refSystem.isObject(args) ? args.Consignee : '';
                    this.Amount = refSystem.isObject(args) ? args.Amount : 0;
                    this.PONumber = refSystem.isObject(args) ? args.PONumber : '';
                    this.DeliveryDate = refSystem.isObject(args) ? args.DeliveryDate : new Date();
                }
            }
            return ForeignBolEmailData;
        })();
        Models.ForeignBolEmailData = ForeignBolEmailData;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
