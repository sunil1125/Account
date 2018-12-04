/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../common/Enums.ts" />
define(["require", "exports"], function(require, exports) {
    

    (function (Models) {
        var CustomerNameSearch = (function () {
            function CustomerNameSearch(args) {
                this.count = 0;
                if (args) {
                    this.ID = args.ID;
                    this.CompanyId = args.CompanyId;
                    this.CompanyName = args.CompanyName;
                    this.CustAddressID = args.CustAddressID;
                    this.CustomerId = args.CustomerId;
                    this.AddressType = args.AddressType;
                    this.ContactName = args.ContactName;
                    this.City = args.City;
                    this.Street = args.Street;
                    this.StateCode = args.StateCode;
                    this.ZipCode = args.ZipCode;
                    this.EmailId = args.EmailId;
                    this.PhoneNo = args.PhoneNo;
                    this.Fax = args.Fax;
                    this.Country = args.Country;
                    this.AddressNumber = args.AddressNumber;
                    this.UserID = args.UserID;
                    this.UserName = args.UserName;
                    this.IsNationalAccount = args.IsNationalAccount;
                    this.IsPROAllowed = args.IsPROAllowed;
                    this.IsVolumeCustomer = args.IsVolumeCustomer;
                    this.AgencyName = args.AgencyName;
                    this.display = args.CompanyName + " / " + args.ContactName;
                    this.count = 2;
                }
            }
            return CustomerNameSearch;
        })();
        Models.CustomerNameSearch = CustomerNameSearch;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
