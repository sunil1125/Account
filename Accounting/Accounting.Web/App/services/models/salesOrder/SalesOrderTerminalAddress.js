/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    var refSystem = __refSystem__;

    /* File Created: Oct 24, 2014
    ** Created By: Bhanu
    */
    (function (Models) {
        var SalesOrderTerminalAddress = (function () {
            function SalesOrderTerminalAddress(args) {
                this.Id = refSystem.isObject(args) ? (args.Id) : 0;
                this.CarrierId = refSystem.isObject(args) ? (args.CarrierId) : 0;
                this.CompanyName = refSystem.isObject(args) ? (args.CompanyName) : '';
                this.Street1 = refSystem.isObject(args) ? (args.Street1) : '';
                this.Street2 = refSystem.isObject(args) ? (args.Street2) : '';
                this.ContactName = refSystem.isObject(args) ? (args.ContactName) : '';
                this.Email = refSystem.isObject(args) ? (args.Email) : '';
                this.Phone = refSystem.isObject(args) ? (args.Phone) : '';
                this.FreePhone = refSystem.isObject(args) ? (args.FreePhone) : '';
                this.Fax = refSystem.isObject(args) ? (args.Fax) : '';
                this.City = refSystem.isObject(args) ? (args.City) : '';
                this.State = refSystem.isObject(args) ? (args.State) : '';
                this.Zip = refSystem.isObject(args) ? (args.Zip) : '';
                this.Country = refSystem.isObject(args) ? (args.Country) : 0;
                this.AddressType = refSystem.isObject(args) ? (args.AddressType) : '';
                this.QuoteType = refSystem.isObject(args) ? (args.QuoteType) : '';
                this.Term = refSystem.isObject(args) ? (args.Term) : '';
                this.OriginServiceType = refSystem.isObject(args) ? (args.OriginServiceType) : '';
                this.DestinationServiceType = refSystem.isObject(args) ? (args.DestinationServiceType) : '';
            }
            return SalesOrderTerminalAddress;
        })();
        Models.SalesOrderTerminalAddress = SalesOrderTerminalAddress;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
