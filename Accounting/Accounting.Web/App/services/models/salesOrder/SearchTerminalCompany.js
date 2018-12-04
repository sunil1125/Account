/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    /* File Created: Oct 20, 2014
    ** Created By: Bhanu pratap
    */
    /// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
    var refSystem = __refSystem__;

    (function (Models) {
        var SearchTerminalCompany = (function () {
            function SearchTerminalCompany(args) {
                this.ShipperCountryCode = refSystem.isObject(args) ? (args.ShipperCountryCode) : 0;
                this.ShipperStateCode = refSystem.isObject(args) ? (args.ShipperStateCode) : '';
                this.ShipperCity = refSystem.isObject(args) ? (args.ShipperCity) : '';
                this.ShipperZip = refSystem.isObject(args) ? (args.ShipperZip) : '';
                this.ConsigneeCountryCode = refSystem.isObject(args) ? (args.ConsigneeCountryCode) : 0;
                this.ConsigneeStateCode = refSystem.isObject(args) ? (args.ConsigneeStateCode) : '';
                this.ConsigneeCity = refSystem.isObject(args) ? (args.ConsigneeCity) : '';
                this.ConsigneeZip = refSystem.isObject(args) ? (args.ConsigneeZip) : '';
                this.CarrierId = refSystem.isObject(args) ? (args.CarrierId) : 0;
                this.SearchValue = refSystem.isObject(args) ? (args.SearchValue) : '';
            }
            return SearchTerminalCompany;
        })();
        Models.SearchTerminalCompany = SearchTerminalCompany;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
