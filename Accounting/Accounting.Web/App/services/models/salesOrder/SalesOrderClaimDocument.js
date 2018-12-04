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

    /* File Created: Oct 21, 2014
    ** Created By: sankesh
    */
    (function (Models) {
        var SalesOrderClaimDocument = (function () {
            function SalesOrderClaimDocument(args) {
                this.ID = refSystem.isObject(args) ? args.ID : 0;
                this.ClaimId = refSystem.isObject(args) ? args.ClaimId : 0;
                this.DocumentPath = refSystem.isObject(args) ? args.DocumentPath : '';
            }
            return SalesOrderClaimDocument;
        })();
        Models.SalesOrderClaimDocument = SalesOrderClaimDocument;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
