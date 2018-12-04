/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
define(["require", "exports", 'plugins/router', 'durandal/app'], function(require, exports, ___router__, ___app__) {
    
    var _router = ___router__;
    var _app = ___app__;
    

    //#endregion Import
    (function (Models) {
        var PurchaseOrderEmail = (function () {
            function PurchaseOrderEmail(args) {
                if (args) {
                    this.EmailAddress = args.EmailAddress;
                    this.PurchaseOrderData = args.PurchaseOrderData;
                    this.VendorBillDocuments = args.VendorBillDocuments;
                    this.AgentName = args.AgentName;
                    this.Comments = args.Comments;
                    this.CustomerName = args.CustomerName;
                }
            }
            return PurchaseOrderEmail;
        })();
        Models.PurchaseOrderEmail = PurchaseOrderEmail;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
