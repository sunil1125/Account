/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system'], function(require, exports, ___router__, ___app__, __refSystem__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;

    //#endregion Import
    (function (Models) {
        var ShipmentPaymentDetails = (function () {
            function ShipmentPaymentDetails(args) {
                this.Id = refSystem.isObject(args) ? args.Id : 0;
                this.Amount = refSystem.isObject(args) ? (args.Amount) : '';
                this.Balance = refSystem.isObject(args) ? (args.Balance) : '';
                this.AmountPaid = refSystem.isObject(args) ? (args.AmountPaid) : '';
                this.PaymentAmount = refSystem.isObject(args) ? (args.PaymentAmount) : '';
                this.TransactionType = refSystem.isObject(args) ? (args.TransactionType) : '';
                this.CommissionType = refSystem.isObject(args) ? (args.CommissionType) : '';
                this.RecordType = refSystem.isObject(args) ? (args.RecordType) : '';
                this.ApplyFromTranDate = refSystem.isObject(args) ? (args.ApplyFromTranDate) : '';
                this.PaymentTypeDescription = refSystem.isObject(args) ? (args.PaymentTypeDescription) : '';
                this.FactoringCompany = refSystem.isObject(args) ? (args.FactoringCompany) : '';
                this.BatchComments = refSystem.isObject(args) ? (args.BatchComments) : '';
                this.Batch = refSystem.isObject(args) ? (args.Batch) : '';
                this.Status = refSystem.isObject(args) ? (args.Status) : '';
            }
            return ShipmentPaymentDetails;
        })();
        Models.ShipmentPaymentDetails = ShipmentPaymentDetails;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
