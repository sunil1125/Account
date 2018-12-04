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

    /* File Created: Dec 12, 2014
    ** Created By: Chandan
    */
    (function (Model) {
        var CustomerTypeAndMasterCustomerId = (function () {
            function CustomerTypeAndMasterCustomerId(args) {
                this.TermType = refSystem.isObject(args) ? args.TermType : 0;
                this.TermDescription = refSystem.isObject(args) ? args.TermDescription : '';
                this.MasterCustomerId = refSystem.isObject(args) ? args.MasterCustomerId : 0;
            }
            return CustomerTypeAndMasterCustomerId;
        })();
        Model.CustomerTypeAndMasterCustomerId = CustomerTypeAndMasterCustomerId;
    })(exports.Model || (exports.Model = {}));
    var Model = exports.Model;
});
