/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../common/Enums.ts" />

import refSystem = require('durandal/system');

export interface ICustomerNameSearch {
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
	count: number;
}

export module Models {
	export class CustomerNameSearch {
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
		constructor(args?: ICustomerNameSearch) {
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
	}
}