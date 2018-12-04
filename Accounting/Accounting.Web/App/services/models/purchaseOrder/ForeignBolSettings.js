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
        var ForeignBolSettings = (function () {
            function ForeignBolSettings(args) {
                this.CustomerId = refSystem.isObject(args) ? args.CustomerId : 0;
                this.CustomerName = refSystem.isObject(args) ? args.CustomerName : '';
                this.EdiBolLength = refSystem.isObject(args) ? args.EdiBolLength : 0;
                this.IsEdiBolMapped = refSystem.isObject(args) ? args.IsEdiBolMapped : false;
                this.IsBillToAddressMapped = refSystem.isObject(args) ? args.IsBillToAddressMapped : false;
                this.IsShipperAddressMapped = refSystem.isObject(args) ? args.IsShipperAddressMapped : false;
                this.IsConsigneeMapped = refSystem.isObject(args) ? args.IsConsigneeMapped : false;
                this.IsBOLStartWithCharacter = refSystem.isObject(args) ? args.IsBOLStartWithCharacter : false;
                this.ForeignBolAddressList = refSystem.isObject(args) ? args.ForeignBolAddressList : null;
                this.UpdatedDate = refSystem.isObject(args) ? args.UpdatedDate : 0;
                this.IsShipperConsigneeAddressMapped = refSystem.isObject(args) ? args.IsShipperConsigneeAddressMapped : false;
            }
            return ForeignBolSettings;
        })();
        Models.ForeignBolSettings = ForeignBolSettings;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
