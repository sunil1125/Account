/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    var refSystem = __refSystem__;

    (function (Models) {
        var CustomerFinancialDetails = (function () {
            function CustomerFinancialDetails(args) {
                this.CustomerId = refSystem.isObject(args) ? (args.CustomerId) : 0;
                this.Terms = refSystem.isObject(args) ? (args.Terms) : '';
                this.CreditLimit = refSystem.isObject(args) ? (args.CreditLimit) : 0;
            }
            return CustomerFinancialDetails;
        })();
        Models.CustomerFinancialDetails = CustomerFinancialDetails;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
