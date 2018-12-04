/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />

import refSystem = require('durandal/system');

/* File Created: Oct 24, 2014
** Created By: Bhanu
*/

export module Models {
	export class SalesOrderMultilegCarrierDetail {
		Id: number;
		CarrierId: number;
		ShipmentId: number;
		CarrierName: string;
		CarrierCode: string;
		CarrierType: string;
		CarrierTypeId: number;
		TransitDays: string;
		PRONumber: string;
		ServiceType: number;
		CalendarDays: string;
		constructor(args?: ISalesOrderMultilegCarrierDetail) {
			this.Id = refSystem.isObject(args) ? (args.Id) : 0
			this.CarrierId = refSystem.isObject(args) ? (args.CarrierId) : 0
			this.ShipmentId = refSystem.isObject(args) ? (args.ShipmentId) : 0;
			this.CarrierName = refSystem.isObject(args) ? (args.CarrierName) : '';
			this.CarrierCode = refSystem.isObject(args) ? (args.CarrierCode) : '';
			this.CarrierType = refSystem.isObject(args) ? (args.CarrierType) : '';
			this.CarrierTypeId = refSystem.isObject(args) ? (args.CarrierTypeId) : 0;
			this.TransitDays = refSystem.isObject(args) ? (args.TransitDays) : '';
			this.PRONumber = refSystem.isObject(args) ? (args.PRONumber) : '';
			this.ServiceType = refSystem.isObject(args) ? (args.ServiceType) : 0;
			this.CalendarDays = refSystem.isObject(args) ? (args.CalendarDays) : '';
		}
	}
}