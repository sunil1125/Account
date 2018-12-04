/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../TypeDefs/TransactionSearchModel.d.ts" />
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    var refSystem = __refSystem__;

    /* File Created: Sep 12, 2014
    ** Created By: Satish
    */
    (function (Model) {
        var TransactionSearchRequest = (function () {
            function TransactionSearchRequest(args) {
                this.TransactionSearchType = refSystem.isObject(args) ? args.TransactionSearchType : -1;
                this.Amount = refSystem.isObject(args) ? args.Amount : -1;
                this.OrderStatus = refSystem.isObject(args) ? args.OrderStatus : -1;
                this.BolNumber = refSystem.isObject(args) ? args.BolNumber : "";
                this.ShipperCompanyName = refSystem.isObject(args) ? args.ShipperCompanyName : "";
                this.ConsigneeCompanyName = refSystem.isObject(args) ? args.ConsigneeCompanyName : "";
                this.VendorName = refSystem.isObject(args) ? args.VendorName : "";
                this.CarrierServiceMode = refSystem.isObject(args) ? args.CarrierServiceMode : -1;
                this.NewShipmentType = refSystem.isObject(args) ? args.NewShipmentType : -1;
                this.PoNumber = refSystem.isObject(args) ? args.PoNumber : "";
                this.ShipperCity = refSystem.isObject(args) ? args.ShipperCity : "";
                this.ConsigneeCity = refSystem.isObject(args) ? args.ConsigneeCity : "";
                this.SalesRepName = refSystem.isObject(args) ? args.SalesRepName : "";
                this.SalesRepId = refSystem.isObject(args) ? args.SalesRepId : -1;
                this.ShipperZipCode = refSystem.isObject(args) ? args.ShipperZipCode : "";
                this.ConsigneeZipCode = refSystem.isObject(args) ? args.ConsigneeZipCode : "";
                this.CustomerBolNumber = refSystem.isObject(args) ? args.CustomerBolNumber : "";
                this.ProNumber = refSystem.isObject(args) ? args.ProNumber : "";
                this.ItemNumbers = refSystem.isObject(args) ? args.ItemNumbers : "";
                this.CustomerName = refSystem.isObject(args) ? args.CustomerName : "";
                this.TruckloadQuoteNumber = refSystem.isObject(args) ? args.TruckloadQuoteNumber : '';
                this.InvoiceStatus = refSystem.isObject(args) ? args.InvoiceStatus : -1;
                this.ReferenceNumber = refSystem.isObject(args) ? args.ReferenceNumber : "";
                this.TotalWeight = refSystem.isObject(args) ? args.TotalWeight : -1;
                this.TotalPiece = refSystem.isObject(args) ? args.TotalPiece : -1;
                this.DateType = refSystem.isObject(args) ? args.DateType : -1;
                this.FromDate = refSystem.isObject(args) ? args.FromDate : new Date();
                this.ToDate = refSystem.isObject(args) ? args.ToDate : new Date();
                this.PageSize = refSystem.isObject(args) ? args.PageSize : 10;
                this.PageNumber = refSystem.isObject(args) ? args.PageNumber : 1;
                this.SortCol = refSystem.isObject(args) ? args.SortCol : "";
                this.SortOrder = refSystem.isObject(args) ? args.SortOrder : "ASC";
                this.IsPurchaseOrder = refSystem.isObject(args) ? args.IsPurchaseOrder : 2;
                this.CompanyName = refSystem.isObject(args) ? args.CompanyName : "";
            }
            return TransactionSearchRequest;
        })();
        Model.TransactionSearchRequest = TransactionSearchRequest;
    })(exports.Model || (exports.Model = {}));
    var Model = exports.Model;
});
