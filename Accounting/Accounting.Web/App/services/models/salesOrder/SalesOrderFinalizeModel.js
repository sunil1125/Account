/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />
define(["require", "exports"], function(require, exports) {
    

    /* File Created: Feb 7, 2015
    ** Created By: Bhanu
    */
    (function (Model) {
        var SalesOrderFinalizeModel = (function () {
            function SalesOrderFinalizeModel(args) {
                if (args) {
                    this.ShipmentId = args.ShipmentId;
                    this.ProcessStatusId = args.ProcessStatusId;
                    this.TimeSpan = args.TimeSpan;
                }
            }
            return SalesOrderFinalizeModel;
        })();
        Model.SalesOrderFinalizeModel = SalesOrderFinalizeModel;
    })(exports.Model || (exports.Model = {}));
    var Model = exports.Model;
});
