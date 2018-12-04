/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    var refSystem = __refSystem__;

    /* File Created: Oct 21, 2014
    ** Created By: sankesh
    */
    (function (Models) {
        var SalesOrderClaimDetail = (function () {
            function SalesOrderClaimDetail(args) {
                this.Id = refSystem.isObject(args) ? args.Id : 0;
                this.CustomerId = refSystem.isObject(args) ? args.CustomerId : 0;
                this.CustomerName = refSystem.isObject(args) ? args.CustomerName : '';
                this.BOLNumber = refSystem.isObject(args) ? args.BOLNumber : '';
                this.PRONumber = refSystem.isObject(args) ? args.PRONumber : '';
                this.CarrierName = refSystem.isObject(args) ? args.CarrierName : '';
                this.ConsigneeName = refSystem.isObject(args) ? args.ConsigneeName : '';
                this.ClaimNumber = refSystem.isObject(args) ? args.ClaimNumber : '';
                this.AmountFiled = refSystem.isObject(args) ? args.AmountFiled : 0;
                this.DateFiled = refSystem.isObject(args) ? args.DateFiled : new Date();
                this.ClaimDate = refSystem.isObject(args) ? args.ClaimDate : new Date();
                this.Status = refSystem.isObject(args) ? args.Status : '';
                this.UpdatedDate = refSystem.isObject(args) ? args.UpdatedDate : 0;
                this.SettledAmount = refSystem.isObject(args) ? args.SettledAmount : 0;
                this.UpdatedBy = refSystem.isObject(args) ? args.UpdatedBy : 0;
                this.ShipperName = refSystem.isObject(args) ? args.ShipperName : '';
                this.CompanyName = refSystem.isObject(args) ? args.CompanyName : '';
            }
            return SalesOrderClaimDetail;
        })();
        Models.SalesOrderClaimDetail = SalesOrderClaimDetail;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
