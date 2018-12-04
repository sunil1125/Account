/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />

import refSystem = require('durandal/system');

export module Models {
	export class SearchCompanyName {
		ID: number;
		CompanyId: number;
		CompanyName: string;
		CustAddressID: number;
		CustomerId: number;
		AddressType: number;
		ContactName: string;
		City: string;
		Street: string;
		StateCode: string;
		ZipCode: string;
		EmailId: string;
		PhoneNo: string;
		Fax: string;
		Country: number;
		AddressNumber: string;
		UserID: number;
		UserName: string;
		IsNationalAccount: number;
		IsPROAllowed: number;
		IsVolumeCustomer: number;
		AgencyName: string;
		display: string;
		count: number = 0;

		constructor(args?: ISearchCompanyName) {
			this.ID = args.ID;
			this.CompanyId = args.CompanyId;
			this.CompanyName = args.CompanyName;
			this.CustAddressID = args.CustAddressID;
			this.CustomerId = this.CustomerId;
			this.AddressType = args.AddressType;
			this.ContactName = args.ContactName;
			this.City = args.City;
			this.Street = refSystem.isObject(args) ? (args.Street) : '';
			this.StateCode = args.StateCode;
			this.ZipCode = args.ZipCode;
			this.EmailId = args.EmailId;
			this.PhoneNo = refSystem.isObject(args) ? (args.PhoneNo) : '';
			this.Fax = args.Fax;
			this.Country = refSystem.isObject(args) ? (args.Country) : 0;
			this.AddressNumber = args.AddressNumber;
			this.UserID = this.UserID;
			this.UserName = args.UserName;
			this.IsNationalAccount = args.IsNationalAccount;
			this.IsPROAllowed = this.IsPROAllowed;
			this.IsVolumeCustomer = args.IsVolumeCustomer;
			this.AgencyName = args.AgencyName;
			this.display = this.CompanyName + " / " + this.ContactName;
			this.count = 2;
		}
	}
}