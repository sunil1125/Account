/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created: JULY 11, 2014
** Created By: Achal Rastogi
*/
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    /// <reference path="../TypeDefs/PurchaseOrderSearchModel.d.ts" />
    /// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
    var refSystem = __refSystem__;

    (function (Models) {
        var PurchaseOrderSearchFilter = (function () {
            function PurchaseOrderSearchFilter(args) {
                this.SearchText = refSystem.isObject(args) ? (args.SearchText) : '';
                this.Operand = refSystem.isObject(args) ? (args.Operand) : 0;
                this.FieldName = refSystem.isObject(args) ? (args.FieldName) : '';
            }
            return PurchaseOrderSearchFilter;
        })();
        Models.PurchaseOrderSearchFilter = PurchaseOrderSearchFilter;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
