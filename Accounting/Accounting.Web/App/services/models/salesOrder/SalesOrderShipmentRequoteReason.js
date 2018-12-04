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

    /* File Created: Nov 12, 2014
    ** Created By: Sankesh
    */
    (function (Model) {
        var SalesOrderShipmentRequoteReason = (function () {
            function SalesOrderShipmentRequoteReason(args) {
                if (args) {
                    this.ID = refSystem.isObject(args) ? args.ID : 0;
                    this.Remarks = refSystem.isObject(args) ? args.Remarks : '';
                    this.RequoteReasonID = refSystem.isObject(args) ? args.RequoteReasonID : 0;
                }
            }
            return SalesOrderShipmentRequoteReason;
        })();
        Model.SalesOrderShipmentRequoteReason = SalesOrderShipmentRequoteReason;
    })(exports.Model || (exports.Model = {}));
    var Model = exports.Model;
});
