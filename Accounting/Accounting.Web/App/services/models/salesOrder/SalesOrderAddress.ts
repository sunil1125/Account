/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />

import refSystem = require('durandal/system');

/* File Created: Sep 4, 2014
** Created By: Satish
*/
export module Models {
	export class SalesOrderAddress {
		Id: number;
		VendorBillId: number;
		SalesOrderId: number;
		CompanyName: string;
		CompanyName1: string;
		Street: string;
		Street2: string;
		ThirdPartyAddressId: number;
		City: string;
		State: string;
		ZipCode: string;
		CountryName: string;
		Country: number;
		ContactPerson: string;
		Phone: string;
		Fax: string;
		Ext: string;
		AddressType: number;
		AddressCode: string;
		Latitude: number;
		Longitude: number;
		display: string;

		constructor(args?: ISalesOrderAddress) {
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
	}
}