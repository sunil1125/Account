/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
define(["require", "exports"], function(require, exports) {
    

    (function (Models) {
        var MasCarrierSearch = (function () {
            function MasCarrierSearch(args) {
                this.count = 0;
                if (args) {
                    this.MassId = args.MassId;
                    this.MassCarrierName = args.MassCarrierName;
                    this.count = 2;
                    this.display = args.MassCarrierName + ", " + args.MassId;
                }
            }
            return MasCarrierSearch;
        })();
        Models.MasCarrierSearch = MasCarrierSearch;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
