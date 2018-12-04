/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
//#endregion References
define(["require", "exports", 'plugins/router', 'durandal/app'], function(require, exports, ___router__, ___app__) {
    
    var _router = ___router__;
    var _app = ___app__;
    

    (function (Models) {
        var VendorBillContainer = (function () {
            // ###END: US23124
            /// <summary>
            /// Constructor Initializes the VendorBillContainer
            /// </summary>
            function VendorBillContainer(args) {
                if (args) {
                    this.VendorBill = args.VendorBill;
                    this.VendorBillAddress = args.VendorBillAddress;
                    this.VendorBillItemsDetail = args.VendorBillItemsDetail;
                    this.VendorBillNotes = args.VendorBillNotes;
                    this.VendorBillExceptions = args.VendorBillExceptions;
                    this.SuborderCount = args.SuborderCount;
                    this.IsNewSubBill = args.IsNewSubBill;
                    this.IsSubBill = args.IsSubBill;
                    this.IsCreateLostBillVisible = args.IsCreateLostBillVisible;
                    this.IsDisputeWonLostVisible = args.IsDisputeWonLostVisible;
                    this.IsDisputeAmountEditable = args.IsDisputeAmountEditable;
                    this.IsDisputeLostAmountEditable = args.IsDisputeLostAmountEditable;
                    this.IsSaveEnable = args.IsSaveEnable;
                    this.IsDisputeSectionEditable = args.IsDisputeSectionEditable;
                    this.CanForcePushBillToMAS = args.CanForcePushBillToMAS;
                }
            }
            VendorBillContainer.prototype.activate = function () {
                return true;
            };
            return VendorBillContainer;
        })();
        Models.VendorBillContainer = VendorBillContainer;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
