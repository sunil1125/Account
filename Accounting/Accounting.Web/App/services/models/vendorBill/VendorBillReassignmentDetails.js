/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    /// <reference path="../TypeDefs/VendorBillModels.d.ts" />
    /// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
    /// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />
    var refSystem = __refSystem__;

    /*
    ** Model for posting data from reassignment popup to save
    ** <createDetails>
    ** <id>US25684</id> <by>Shreesha Adiga</by> <date>23-11-2016</date>
    ** </createDetails>
    */
    (function (Model) {
        var VendorBillReassignmentDetails = (function () {
            // Constructor
            function VendorBillReassignmentDetails(args) {
                if (args) {
                    this.VendorBillId = refSystem.isObject(args) ? args.VendorBillId : 0;
                    this.CurrentShipmentId = refSystem.isObject(args) ? args.CurrentShipmentId : 0;
                    this.ReassignSO = refSystem.isObject(args) ? args.ReassignSO : '';
                    this.IsCreditToCurrentSO = refSystem.isObject(args) ? args.IsCreditToCurrentSO : false;
                    this.ShipmentToCredit = refSystem.isObject(args) ? args.ShipmentToCredit : 0;
                    this.AmountToCredit = refSystem.isObject(args) ? args.AmountToCredit : 0;
                    this.ReassignmentReasonId = refSystem.isObject(args) ? args.ReassignmentReasonId : 0;
                    this.Notes = refSystem.isObject(args) ? args.Notes : '';
                }
            }
            return VendorBillReassignmentDetails;
        })();
        Model.VendorBillReassignmentDetails = VendorBillReassignmentDetails;
    })(exports.Model || (exports.Model = {}));
    var Model = exports.Model;
});
