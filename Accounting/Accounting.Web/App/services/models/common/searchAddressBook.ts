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

export interface IShipmentAddressBook {
	Id: number;
	ShipmentId: number;
	CompanyName: string;
	Street: string;
	Street2: string;
	ThirdPartyAddressId: number;
	City: string;
	State: string;
	Country: string;
	CountryCode: number;
	ZipCode: string;
	Phone: string;
	Ext: string;
	Fax: string;
	Email: string;
	AddressType: IEnumValue;
	ContactPerson: string;
	AddressCode: string;
	Latitude: number;
	Longitude: number;
	DeliveryReadyTime: string;
	DeliveryCloseTime: string;
	DefaultTime: boolean;
	PickupRemarks: string;
	DeliveryRemarks: string;
	display: string;
	isEmpty?: () => boolean;
}
export module Models {
	export class AddressBookSearch {
		Id: number;
		ShipmentId: number;
		CompanyName: string;
		Street: string;
		Street2: string;
		ThirdPartyAddressId: number;
		City: string;
		State: string;
		Country: string;
		CountryCode: number;
		ZipCode: string;
		Phone: string;
		Ext: string;
		Fax: string;
		Email: string;
		AddressType: IEnumValue;
		ContactPerson: string;
		AddressCode: string;
		Latitude: number;
		Longitude: number;
		DeliveryReadyTime: string;
		DeliveryCloseTime: string;
		DefaultTime: boolean;
		PickupRemarks: string;
		DeliveryRemarks: string;
		display: string;
		count: number = 0;
		constructor(args?: IShipmentAddressBook) {
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

			this.display =  this.CompanyName + '  ' + this.ContactPerson ;

			this.count = 3;
		}

		isEmpty() {
			var commonUtils = new Utils.Common();
			return this.Id === 0 && commonUtils.isNullOrEmptyOrWhiteSpaces(this.CompanyName);
		}
	}
}