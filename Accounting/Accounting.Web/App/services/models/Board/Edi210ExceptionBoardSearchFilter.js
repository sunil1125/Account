/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created: February 26, 2015
** Created By: Baldev Singh Thakur
*/
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    /// <reference path="../TypeDefs/PurchaseOrderSearchModel.d.ts" />
    /// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
    var refSystem = __refSystem__;

    (function (Models) {
        var Edi210ExceptionBoardSearchFilter = (function () {
            function Edi210ExceptionBoardSearchFilter(args) {
                this.SearchText = refSystem.isObject(args) ? (args.SearchText) : '';
                this.Operand = refSystem.isObject(args) ? (args.Operand) : 0;
                this.FieldName = refSystem.isObject(args) ? (args.FieldName) : '';
            }
            return Edi210ExceptionBoardSearchFilter;
        })();
        Models.Edi210ExceptionBoardSearchFilter = Edi210ExceptionBoardSearchFilter;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
