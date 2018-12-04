/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    /* File Created: April 14,2014 */
    /// <reference path="../TypeDefs/SalesOrderSearchModel.d.ts" />
    /// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
    var refSystem = __refSystem__;

    (function (Models) {
        var SalesOrderSearchResult = (function () {
            function SalesOrderSearchResult(args) {
                this.Id = refSystem.isObject(args) ? (args.Id) : 0;
                this.BolNumber = refSystem.isObject(args) ? (args.BolNumber) : '';
                this.ProNumber = refSystem.isObject(args) ? (args.ProNumber) : '';
                this.CustomerBolNumber = refSystem.isObject(args) ? (args.CustomerBolNumber) : '';
                this.Vendor = refSystem.isObject(args) ? (args.Vendor) : '';
                this.Customer = refSystem.isObject(args) ? (args.Customer) : '';
                this.Revenue = refSystem.isObject(args) ? (args.Revenue) : 0;
                this.ShipperCompName = refSystem.isObject(args) ? (args.ShipperCompName) : '';
                this.ConsigneeCompName = refSystem.isObject(args) ? (args.ConsigneeCompName) : '';
                this.ShipperZipCode = refSystem.isObject(args) ? (args.ShipperZipCode) : '';
                this.ConsigneeZipCode = refSystem.isObject(args) ? (args.ConsigneeZipCode) : '';
                this.ServiceType = refSystem.isObject(args) ? (args.ServiceType) : '';
                this.TotalWeight = refSystem.isObject(args) ? (args.TotalWeight) : 0;
                this.TotalPieces = refSystem.isObject(args) ? (args.TotalPieces) : 0;
                this.PickupDate = refSystem.isObject(args) ? (args.PickupDate) : new Date();
                this.ProcessStatus = refSystem.isObject(args) ? (args.ProcessStatus) : '';
                this.InvoiceStatus = refSystem.isObject(args) ? (args.InvoiceStatus) : '';
                this.PickupDateDisplay = refSystem.isObject(args) ? (args.PickupDateDisplay) : '';
                this.ProcessStatusDisplay = refSystem.isObject(args) ? (args.ProcessStatusDisplay) : '';
                this.InvoiceStatusDisplay = refSystem.isObject(args) ? (args.InvoiceStatusDisplay) : '';
                this.ProcessFlowType = refSystem.isObject(args) ? (args.ProcessFlowType) : '';
            }
            return SalesOrderSearchResult;
        })();
        Models.SalesOrderSearchResult = SalesOrderSearchResult;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
