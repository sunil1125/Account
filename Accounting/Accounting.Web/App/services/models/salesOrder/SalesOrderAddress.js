/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    var refSystem = __refSystem__;

    /* File Created: Sep 4, 2014
    ** Created By: Satish
    */
    (function (Models) {
        var SalesOrderAddress = (function () {
            function SalesOrderAddress(args) {
                this.Id = refSystem.isObject(args) ? args.Id : 0;
                this.CompanyName = refSystem.isObject(args) ? args.CompanyName : '';
                this.Street = refSystem.isObject(args) ? args.Street : '';
                this.Street2 = refSystem.isObject(args) ? args.Street2 : '';
                this.City = refSystem.isObject(args) ? args.City : '';
                this.State = refSystem.isObject(args) ? args.State : '';
                this.ZipCode = refSystem.isObject(args) ? args.ZipCode : '';
                this.CountryName = refSystem.isObject(args) ? args.CountryName : '';
                this.ContactPerson = refSystem.isObject(args) ? args.ContactPerson : '';
                this.Phone = refSystem.isObject(args) ? args.Phone : '';
                this.Ext = refSystem.isObject(args) ? args.Ext : '';
                this.Fax = refSystem.isObject(args) ? args.Fax : '';
                this.AddressType = refSystem.isObject(args) ? args.AddressType : 0;
                this.Country = refSystem.isObject(args) ? args.Country : 1;
                this.display = this.CompanyName;
            }
            return SalesOrderAddress;
        })();
        Models.SalesOrderAddress = SalesOrderAddress;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
