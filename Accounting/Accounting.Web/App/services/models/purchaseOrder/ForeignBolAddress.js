/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../TypeDefs/PurchaseOrderModel.d.ts" />
//#endregion References
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system'], function(require, exports, ___router__, ___app__, __refSystem__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;

    (function (Models) {
        var ForeignBolAddress = (function () {
            function ForeignBolAddress(args) {
                this.ID = refSystem.isObject(args) ? args.ID : 0;
                this.CustomerId = refSystem.isObject(args) ? args.CustomerId : 0;
                this.CompanyName = refSystem.isObject(args) ? args.CompanyName : '';
                this.Address1 = refSystem.isObject(args) ? args.Address1 : '';
                this.Address2 = refSystem.isObject(args) ? args.Address2 : '';
                this.City = refSystem.isObject(args) ? args.City : '';
                this.State = refSystem.isObject(args) ? args.State : '';
                this.ZipCode = refSystem.isObject(args) ? args.ZipCode : '';
                this.AddressType = refSystem.isObject(args) ? args.AddressType : 0;
                this.CountryCode = refSystem.isObject(args) ? args.CountryCode : 0;
                this.CanEdit = refSystem.isObject(args) ? args.CanEdit : false;
                this.IsEditVisible = refSystem.isObject(args) ? args.IsEditVisible : false;
                this.AddressTypeDisplay = refSystem.isObject(args) ? args.AddressTypeDisplay : '';
                this.UpdatedDate = refSystem.isObject(args) ? args.UpdatedDate : 0;
                this.VendorBillId = refSystem.isObject(args) ? args.VendorBillId : 0;
            }
            return ForeignBolAddress;
        })();
        Models.ForeignBolAddress = ForeignBolAddress;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
