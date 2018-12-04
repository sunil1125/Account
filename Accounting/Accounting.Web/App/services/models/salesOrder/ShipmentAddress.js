/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created: September 02,2014 */
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../common/Enums.ts" />
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    var refSystem = __refSystem__;

    (function (Models) {
        var ShipmentAddress = (function () {
            function ShipmentAddress(args) {
                this.Id = refSystem.isObject(args) ? (args.Id) : 0;
                this.ShipmentId = refSystem.isObject(args) ? (args.ShipmentId) : 0;
                this.CompanyName = refSystem.isObject(args) ? (args.CompanyName) : '';
                this.Street = refSystem.isObject(args) ? (args.Street) : '';
                this.Street2 = refSystem.isObject(args) ? (args.Street2) : '';
                this.ThirdPartyAddressId = refSystem.isObject(args) ? (args.ThirdPartyAddressId) : 0;
                this.City = refSystem.isObject(args) ? (args.City) : '';
                this.State = refSystem.isObject(args) ? (args.State) : '';
                this.Country = refSystem.isObject(args) ? (args.Country) : '';
                this.CountryCode = refSystem.isObject(args) ? (args.CountryCode) : 0;
                this.ZipCode = refSystem.isObject(args) ? (args.ZipCode) : '';
                this.Phone = refSystem.isObject(args) ? (args.Phone) : '';
                this.Ext = refSystem.isObject(args) ? (args.Ext) : '';
                this.Fax = refSystem.isObject(args) ? (args.Fax) : '';
                this.Email = refSystem.isObject(args) ? (args.Email) : '';
                this.AddressType = refSystem.isObject(args) ? (args.AddressType) : null;
                this.ContactPerson = refSystem.isObject(args) ? (args.ContactPerson) : '';
                this.AddressCode = refSystem.isObject(args) ? (args.AddressCode) : '';
                this.Latitude = refSystem.isObject(args) ? (args.Latitude) : 0;
                this.Longitude = refSystem.isObject(args) ? (args.Longitude) : 0;
                this.DeliveryReadyTime = refSystem.isObject(args) ? (args.DeliveryReadyTime) : '';
                this.DeliveryCloseTime = refSystem.isObject(args) ? (args.DeliveryCloseTime) : '';
                this.DefaultTime = refSystem.isObject(args) ? (args.DefaultTime) : false;
                this.DeliveryRemarks = refSystem.isObject(args) ? (args.DeliveryRemarks) : '';
            }
            return ShipmentAddress;
        })();
        Models.ShipmentAddress = ShipmentAddress;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
