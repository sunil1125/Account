/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
//#endregion References
define(["require", "exports", 'plugins/router', 'durandal/app'], function(require, exports, ___router__, ___app__) {
    
    var _router = ___router__;
    var _app = ___app__;
    

    /*
    ** <summary>
    ** Vendor bill dispute container view model for all VB method fetch and save from DB
    ** </summary>
    ** <createDetails>
    ** <id></id> <by></by> <date></date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US20352</id> <by>Chandan Singh Bajetha</by> <date>14-01-2016</date> <description>Acct: Adjust UI for Dispute Notes Tab in Vendor Bill</description>
    ** <id>US21131</id> <by>Shreesha Adiga</by> <date>31-03-2016</date><description>Added DisputeStateNote, SalesRepId and CustomerId to Dispute Container</description>
    ** <id>US22053</id> <by>Shreesha Adiga</by> <date>10-05-2016</date><description>Added properties for changes related to sending carrier researching mail</description>
    ** </changeHistory>
    */
    (function (Models) {
        var VendorBillDisputeContainer = (function () {
            //##END: US22053
            /// <summary>
            /// Constructor Initializes the VendorBillContainer
            /// </summary>
            function VendorBillDisputeContainer(args) {
                if (args) {
                    // ###START: US20352
                    this.DisputeStatusId = args.DisputeStatusId;

                    // ###END: US20352
                    this.DisputeVendorBill = args.DisputeVendorBill;
                    this.VendorBillItemsDetail = args.VendorBillItemDetails;
                    this.VendorBillNotes = args.VendorBillNote;
                    this.ShipmentId = args.ShipmentId;
                    this.CanSaveReasonCodes = args.CanSaveReasonCodes;

                    // ##START: US21131
                    this.DisputeStateNote = args.DisputeStateNote;
                    this.SalesRepId = args.SalesRepId;
                    this.CustomerId = args.CustomerId;

                    // ##END: US21131
                    //##START: US22053
                    this.BOLNumber = args.BOLNumber;
                    this.CarrierName = args.CarrierName;
                    this.IsSavedFromVB = false;
                    //##END: US22053
                }
            }
            VendorBillDisputeContainer.prototype.activate = function () {
                return true;
            };
            return VendorBillDisputeContainer;
        })();
        Models.VendorBillDisputeContainer = VendorBillDisputeContainer;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
