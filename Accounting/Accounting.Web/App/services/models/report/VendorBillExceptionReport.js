/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    /* File Created: August 25,2014 */
    /// <reference path="../TypeDefs/Report.d.ts" />
    /// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
    var refSystem = __refSystem__;

    (function (Models) {
        var VendorBillExceptionReport = (function () {
            function VendorBillExceptionReport(args) {
                this.Exception = refSystem.isObject(args) ? (args.Exception) : '';
                this.VendorBillId = refSystem.isObject(args) ? (args.VendorBillId) : 0;
                this.ProNumber = refSystem.isObject(args) ? (args.ProNumber) : '';
                this.BolNumber = refSystem.isObject(args) ? (args.BolNumber) : '';
                this.Carrier = refSystem.isObject(args) ? (args.Carrier) : '';
                this.CarrierCode = refSystem.isObject(args) ? (args.CarrierCode) : '';
                this.MassId = refSystem.isObject(args) ? (args.MassId) : '';
                this.VBAmount = refSystem.isObject(args) ? (args.VBAmount) : 0;
                this.DisputedAmount = refSystem.isObject(args) ? (args.DisputedAmount) : 0;
                this.VBBillStatus = refSystem.isObject(args) ? (args.VBBillStatus) : '';
            }
            return VendorBillExceptionReport;
        })();
        Models.VendorBillExceptionReport = VendorBillExceptionReport;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
