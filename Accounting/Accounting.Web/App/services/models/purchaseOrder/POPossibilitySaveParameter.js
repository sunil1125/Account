/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../TypeDefs/PurchaseOrderModel.d.ts" />
define(["require", "exports"], function(require, exports) {
    

    (function (Models) {
        var POPossibilitySaveParameter = (function () {
            function POPossibilitySaveParameter(args) {
                if (args) {
                    this.VendorBillId = args.VendorBillId;
                    this.SalesOrderId.push(args.SalesOrderId);
                }
            }
            return POPossibilitySaveParameter;
        })();
        Models.POPossibilitySaveParameter = POPossibilitySaveParameter;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
