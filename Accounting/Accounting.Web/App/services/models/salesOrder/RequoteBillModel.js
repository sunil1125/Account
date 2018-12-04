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
    

    /* File Created: Aug 9, 2014
    ** Created By: sankesh
    */
    (function (Model) {
        var RequoteBillModel = (function () {
            function RequoteBillModel(args) {
                if (args) {
                    this.id = args.ReQuoteReasonID;
                    this.name = args.ShortDescription;
                    this.IsEnable = args.IsEnable;
                }
            }
            return RequoteBillModel;
        })();
        Model.RequoteBillModel = RequoteBillModel;
    })(exports.Model || (exports.Model = {}));
    var Model = exports.Model;
});
