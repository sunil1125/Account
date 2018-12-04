/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    /* File Created: April 10, 2014
    ** Created By: Achal Rastogi
    */
    /// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
    var refSystem = __refSystem__;

    (function (Models) {
        var MapLocation = (function () {
            function MapLocation(args) {
                this.Street = refSystem.isObject(args) ? (args.Street) : '';
                this.City = refSystem.isObject(args) ? (args.City) : '';
                this.StateCode = refSystem.isObject(args) ? (args.StateCode) : '';
                this.State = refSystem.isObject(args) ? (args.State) : '';
                this.Zip = refSystem.isObject(args) ? (args.Zip) : '';
                this.CountryCode = refSystem.isObject(args) ? (args.CountryCode) : 0;
                this.Country = refSystem.isObject(args) ? (args.Country) : '';
                this.Zone = refSystem.isObject(args) ? (args.Zone) : '';
                this.CountyAbbreviation = refSystem.isObject(args) ? (args.CountyAbbreviation) : '';
                this.Latitude = refSystem.isObject(args) ? (args.Latitude) : 0;
                this.Longitude = refSystem.isObject(args) ? (args.Longitude) : 0;
                this.Display = this.IsEmpty() ? '' : this.City + ', ' + this.StateCode + ' ' + this.Zip;
            }
            MapLocation.prototype.IsEmpty = function () {
                return this.City.trim() === '' && this.State.trim() === '' && this.StateCode.trim() === '' && this.Zip.trim() === '' && this.Zone.trim() === '';
            };
            return MapLocation;
        })();
        Models.MapLocation = MapLocation;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
