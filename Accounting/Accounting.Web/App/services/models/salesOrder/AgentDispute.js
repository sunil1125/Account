/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
//#endregion References
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system'], function(require, exports, ___router__, ___app__, __refSystem__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;

    (function (Models) {
        var AgentDispute = (function () {
            /// <summary>
            /// Constructor Initializes the Agent Dispute
            /// </summary>
            function AgentDispute(args) {
                if (args) {
                    this.Id = refSystem.isObject(args) ? args.Id : 0;
                    this.ShipmentId = refSystem.isObject(args) ? args.ShipmentId : 0;
                    this.DisputeAmount = refSystem.isObject(args) ? args.DisputeAmount : 0;
                    this.DisputeDate = refSystem.isObject(args) ? args.DisputeDate : new Date();
                    this.DisputeNotes = refSystem.isObject(args) ? args.DisputeNotes : '';
                    this.DisputeReason = refSystem.isObject(args) ? args.DisputeReason : 0;
                    this.UpdatedBy = refSystem.isObject(args) ? args.UpdatedBy : 0;
                    this.CreatedDate = refSystem.isObject(args) ? args.CreatedDate : new Date();
                    this.UpdatedDate = refSystem.isObject(args) ? args.UpdatedDate : 0;
                    this.DisputedBy = refSystem.isObject(args) ? args.DisputedBy : 0;
                    this.BillStatus = refSystem.isObject(args) ? args.BillStatus : 0;
                    this.VendorBillId = refSystem.isObject(args) ? args.VendorBillId : 0;
                    this.DisputedRepName = refSystem.isObject(args) ? args.DisputedRepName : '';
                }
            }
            AgentDispute.prototype.activate = function () {
                return true;
            };
            return AgentDispute;
        })();
        Models.AgentDispute = AgentDispute;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
