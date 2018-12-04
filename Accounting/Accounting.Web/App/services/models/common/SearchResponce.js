/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    var refSystem = __refSystem__;

    (function (Models) {
        var VendorBillSearchResult = (function () {
            function VendorBillSearchResult(args) {
                this.VendorBillId = refSystem.isObject(args) ? (args.VendorBillId) : 0;
                this.PRONumber = refSystem.isObject(args) ? (args.PRONumber) : '';
                this.BOLNumber = refSystem.isObject(args) ? (args.BOLNumber) : '';
                this.BillDateDisplay = refSystem.isObject(args) ? (args.BillDateDisplay) : '';
            }
            return VendorBillSearchResult;
        })();
        Models.VendorBillSearchResult = VendorBillSearchResult;

        var SalesOrderSearchResult = (function () {
            function SalesOrderSearchResult(args) {
                this.ShipmentId = refSystem.isObject(args) ? (args.ShipmentId) : 0;
                this.BOLNumber = refSystem.isObject(args) ? (args.BOLNumber) : '';
                this.PRONumber = refSystem.isObject(args) ? (args.PRONumber) : '';
                this.ShipmentType = refSystem.isObject(args) ? (args.ShipmentType) : '';
            }
            return SalesOrderSearchResult;
        })();
        Models.SalesOrderSearchResult = SalesOrderSearchResult;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
