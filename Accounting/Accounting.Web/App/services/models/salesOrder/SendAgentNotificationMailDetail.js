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

    /* File Created: Oct 30, 2014
    ** Created By: Satish
    */
    (function (Model) {
        var SendAgentNotificationMailDetail = (function () {
            function SendAgentNotificationMailDetail(args) {
                this.ScenarioId = refSystem.isObject(args) ? args.ScenarioId : 0;
                this.SalesRepId = refSystem.isObject(args) ? args.SalesRepId : 0;
                this.Subject = refSystem.isObject(args) ? args.Subject : "";
                this.DetailsToBeMailed = refSystem.isObject(args) ? args.DetailsToBeMailed : "";
                this.PartnerCompanyId = refSystem.isObject(args) ? args.PartnerCompanyId : 0;
                this.IsTQLCustomer = refSystem.isObject(args) ? args.IsTQLCustomer : false;
                this.CustomerId = refSystem.isObject(args) ? args.CustomerId : 0;
            }
            return SendAgentNotificationMailDetail;
        })();
        Model.SendAgentNotificationMailDetail = SendAgentNotificationMailDetail;
    })(exports.Model || (exports.Model = {}));
    var Model = exports.Model;
});
