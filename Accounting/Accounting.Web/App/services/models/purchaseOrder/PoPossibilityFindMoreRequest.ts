/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created: Sept 30, 2014
** Created By: Chandan Singh Bajetha
*/
/// <reference path="../TypeDefs/PurchaseOrderSearchModel.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../TypeDefs/PurchaseOrderModel.d.ts" />
import refSystem = require('durandal/system');

export module Models {
	export class PoPossibilityFindMoreRequest {
		VendorName: string;
		ProNumber: string;
		BolNumber: string;
		PoNumber: string;
		ReferenceNumber: string;
		PickUpFromDate: Date;
		PickUpToDate: Date;
		ShipperZipCode: string;
		ConsigneeZipCode: string;
		PageNumber: number;
		PageSize: number;

		constructor(args?: IPoPossibilityFindMoreRequest) {
			this.VendorName = refSystem.isObject(args) ? (args.VendorName) : '';
			this.ProNumber = refSystem.isObject(args)? (args.ProNumber) : '';
			this.BolNumber = refSystem.isObject(args) ? (args.BolNumber) : '';
			this.PoNumber = refSystem.isObject(args) ? (args.PoNumber) : '';
			this.ReferenceNumber = refSystem.isObject(args) ? (args.ReferenceNumber) : '';
			this.PickUpFromDate = refSystem.isObject(args) ? args.PickUpFromDate : new Date();
			this.PickUpToDate = refSystem.isObject(args) ? args.PickUpToDate : new Date();
			this.ShipperZipCode = refSystem.isObject(args) ? args.ShipperZipCode : '';
			this.ConsigneeZipCode = refSystem.isObject(args) ? args.ConsigneeZipCode : '';
			this.PageNumber = refSystem.isObject(args) ? args.PageNumber : 0;
			this.PageSize = refSystem.isObject(args) ? args.PageSize : 0;
		}
	}
}