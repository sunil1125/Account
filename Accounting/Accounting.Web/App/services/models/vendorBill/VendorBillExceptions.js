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
        var VendorBillExceptions = (function () {
            function VendorBillExceptions(args) {
                this.RowNumber = refSystem.isObject(args) ? args.RowNumber : 0;
                this.VendorBillId = refSystem.isObject(args) ? (args.VendorBillId) : 0;
                this.BOLNumber = refSystem.isObject(args) ? args.BOLNumber : '';
                this.PRONumber = refSystem.isObject(args) ? args.PRONumber : '';
                this.CarrierName = refSystem.isObject(args) ? args.CarrierName : '';
                this.CustomerName = refSystem.isObject(args) ? args.CustomerName : '';
                this.SalesAgent = refSystem.isObject(args) ? args.SalesAgent : '';
                this.DeliveryDate = refSystem.isObject(args) ? args.DeliveryDate : new Date();
                this.PickupDate = refSystem.isObject(args) ? args.PickupDate : new Date();
                this.ShipmentTypeId = refSystem.isObject(args) ? args.ShipmentTypeId : 0;
                this.VendorBillAmount = refSystem.isObject(args) ? args.VendorBillAmount : 0;
                this.Cost = refSystem.isObject(args) ? args.Cost : 0;
                this.Revenue = refSystem.isObject(args) ? args.Revenue : 0;
                this.ProcessStatusId = refSystem.isObject(args) ? args.ProcessStatusId : 0;
                this.InvoiceStatusId = refSystem.isObject(args) ? args.InvoiceStatusId : 0;
                this.IsPurchaseOrder = refSystem.isObject(args) ? args.IsPurchaseOrder : false;
                this.CarrierCode = refSystem.isObject(args) ? args.CarrierCode : '';
                this.CustomerTypeId = refSystem.isObject(args) ? args.CustomerTypeId : 0;
                this.MasTransferDate = refSystem.isObject(args) ? args.MasTransferDate : new Date();
                this.BillStatus = refSystem.isObject(args) ? args.BillStatus : 0;
                this.VBException = refSystem.isObject(args) ? args.VBException : '';
                this.InvoiceException = refSystem.isObject(args) ? args.InvoiceException : '';
                this.ScheduledAge = refSystem.isObject(args) ? args.ScheduledAge : 0;
                this.CreatedDate = refSystem.isObject(args) ? args.CreatedDate : new Date();
                this.BillDate = refSystem.isObject(args) ? args.BillDate : new Date();
                this.MasClearanceStatusId = refSystem.isObject(args) ? args.MasClearanceStatusId : 0;
                this.InvoiceDate = refSystem.isObject(args) ? args.InvoiceDate : new Date();
                this.ProcessFlowFlag = refSystem.isObject(args) ? args.ProcessFlowFlag : 0;
                this.OrderFlowFlag = refSystem.isObject(args) ? args.OrderFlowFlag : 0;
                this.MasClearanceStatusDate = refSystem.isObject(args) ? args.MasClearanceStatusDate : new Date();
                this.DisputedAmount = refSystem.isObject(args) ? args.DisputedAmount : 0;
                this.MasException = refSystem.isObject(args) ? (args.MasException) : '';
                this.MasStatus = refSystem.isObject(args) ? (args.MasStatus) : 0;
                this.IsProcessed = refSystem.isObject(args) ? args.IsProcessed : false;
                this.IDBFlag = refSystem.isObject(args) ? (args.IDBFlag) : false;
                this.BillCreatedDateDisplay = refSystem.isObject(args) ? args.BillCreatedDateDisplay : '';
                this.MasClearanceStatus = refSystem.isObject(args) ? args.MasClearanceStatus : '';
                this.CarrierType = refSystem.isObject(args) ? args.CarrierType : '';
                this.BillStatusDisplay = refSystem.isObject(args) ? args.BillStatusDisplay : '';
            }
            return VendorBillExceptions;
        })();
        Models.VendorBillExceptions = VendorBillExceptions;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
