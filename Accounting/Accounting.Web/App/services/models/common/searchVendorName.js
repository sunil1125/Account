/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    var refSystem = __refSystem__;

    (function (Models) {
        var VendorNameSearch = (function () {
            function VendorNameSearch(args) {
                this.count = 0;
                this.ID = refSystem.isObject(args) ? (args.ID) : 0;
                this.CarrierName = refSystem.isObject(args) ? (args.CarrierName) : '';
                this.CarrierCode = refSystem.isObject(args) && args.CarrierCode ? (args.CarrierCode) : '';
                this.CarrierTypeName = refSystem.isObject(args) ? (args.CarrierTypeName) : '';
                this.CarrierType = refSystem.isObject(args) ? (args.CarrierType) : 0;
                this.MCNumber = refSystem.isObject(args) && args.MCNumber != null ? (args.MCNumber) : '';
                this.ContactName = refSystem.isObject(args) && args.ContactName != null ? (args.ContactName) : '';
                this.City = refSystem.isObject(args) && args.City != null ? (args.City) : '';
                this.State = refSystem.isObject(args) && args.State != null ? (args.State) : '';
                this.display = this.isEmpty() ? '' : this.CarrierName + '  ' + this.CarrierTypeName + '  ' + this.MCNumber + '  ' + this.ContactName + '  ' + this.City + '  ' + this.State;
                this.count = 2;
            }
            VendorNameSearch.prototype.isEmpty = function () {
                var commonUtils = new Utils.Common();
                return this.ID === 0 && commonUtils.isNullOrEmptyOrWhiteSpaces(this.CarrierName) && this.CarrierType === 0 && commonUtils.isNullOrEmptyOrWhiteSpaces(this.MCNumber) && commonUtils.isNullOrEmptyOrWhiteSpaces(this.ContactName) && commonUtils.isNullOrEmptyOrWhiteSpaces(this.City) && commonUtils.isNullOrEmptyOrWhiteSpaces(this.State);
            };
            return VendorNameSearch;
        })();
        Models.VendorNameSearch = VendorNameSearch;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
