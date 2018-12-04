/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../TypeDefs/PurchaseOrderModel.d.ts" />
define(["require", "exports", 'plugins/router', 'durandal/app'], function(require, exports, ___router__, ___app__) {
    
    var _router = ___router__;
    var _app = ___app__;
    

    //#endregion Import
    (function (Models) {
        var ForeignBolEmail = (function () {
            function ForeignBolEmail(args) {
                if (args) {
                    this.EmailAddress = args.EmailAddress;
                    this.Attachments = args.Attachments;
                    this.AgentName = args.AgentName;
                    this.Comments = args.Comments;
                    this.CustomerName = args.CustomerName;
                    this.ForeignBolEmailData = args.ForeignBolEmailData;
                    this.IsForeignBol = args.IsForeignBol;
                    this.VendorBillId = args.VendorBillId;
                    this.CustomerId = args.CustomerId;
                    this.SalesRepId = args.SalesRepId;
                }
            }
            return ForeignBolEmail;
        })();
        Models.ForeignBolEmail = ForeignBolEmail;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
