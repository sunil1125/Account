/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../TypeDefs/Boards.d.ts" />
//#endregion References
define(["require", "exports", 'plugins/router', 'durandal/app'], function(require, exports, ___router__, ___app__) {
    
    var _router = ___router__;
    var _app = ___app__;
    

    (function (Models) {
        var ItemCodeDescriptionStandardMappings = (function () {
            function ItemCodeDescriptionStandardMappings(args) {
                if (args) {
                    this.ID = args.ID;
                    this.ItemId = args.ItemId;
                    this.Description = args.Description;
                    this.AccessorialID = args.AccessorialID;
                    this.Code = args.Code;
                    this.IsNew = args.IsNew;
                }
            }
            return ItemCodeDescriptionStandardMappings;
        })();
        Models.ItemCodeDescriptionStandardMappings = ItemCodeDescriptionStandardMappings;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
