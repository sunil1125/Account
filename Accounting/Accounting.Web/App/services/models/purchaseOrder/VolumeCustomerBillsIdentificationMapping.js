/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    /// <reference path="../TypeDefs/VendorBillModels.d.ts" />
    /// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
    var refSystem = __refSystem__;

    /***********************************************
    REXNORD MAPPED COMPANIES CLIENT MODEL
    ************************************************
    ** <summary>
    ** Rexnord Mapped Companies Model.
    ** </summary>
    ** <createDetails>
    ** <id>US10953</id><by>Satish</by> <date>29th July, 2014</date>
    ** </createDetails>}
    ***********************************************/
    (function (Models) {
        var VolumeCustomerBillsIdentificationMapping = (function () {
            function VolumeCustomerBillsIdentificationMapping(args) {
                this.Id = refSystem.isObject(args) ? (args.Id) : 0;
                this.CustomerId = refSystem.isObject(args) ? (args.CustomerId) : 0;
                this.CompanyToken = refSystem.isObject(args) ? (args.CompanyToken) : '';
                this.IsMarkedForDeletion = refSystem.isObject(args) ? (args.IsMarkedForDeletion) : false;
            }
            return VolumeCustomerBillsIdentificationMapping;
        })();
        Models.VolumeCustomerBillsIdentificationMapping = VolumeCustomerBillsIdentificationMapping;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
