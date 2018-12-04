/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
define(["require", "exports", 'plugins/router', 'durandal/app'], function(require, exports, ___router__, ___app__) {
    
    var _router = ___router__;
    var _app = ___app__;
    

    //#endregion Import
    (function (Models) {
        var ShipmentRelatedLinks = (function () {
            // ##END: DE23052
            function ShipmentRelatedLinks(args) {
                if (args) {
                    this.ID = args.ID ? args.ID : 0;
                    this.SalesOrderID = args.SalesOrderID ? args.SalesOrderID : 0;
                    this.Value = args.Value ? (args.Value) : '';
                    this.Type = args.Type ? (args.Type) : '';
                    this.SOValue = args.SOValue ? (args.SOValue) : '';
                    this.VBValue = args.VBValue ? (args.VBValue) : '';
                    this.InvoiceValue = args.InvoiceValue ? (args.InvoiceValue) : '';
                    this.IsSameProNumber = args.IsSameProNumber ? (args.IsSameProNumber) : false;
                    this.IsSameBolNumber = args.IsSameBolNumber ? (args.IsSameBolNumber) : false;
                    this.CarrierCode = args.CarrierCode ? (args.CarrierCode) : '';
                    this.CarrierCodeDisplay = args.CarrierCodeDisplay ? (args.CarrierCodeDisplay) : '';

                    // ##START: DE23052
                    this.BOLNumber = args.BOLNumber ? (args.BOLNumber) : '';
                    // ##END: DE23052
                }
            }
            return ShipmentRelatedLinks;
        })();
        Models.ShipmentRelatedLinks = ShipmentRelatedLinks;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
