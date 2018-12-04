/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created: JULY 11, 2014
** Created By: Achal Rastogi
*/
/// <reference path="../TypeDefs/PurchaseOrderSearchModel.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
import refSystem = require('durandal/system');

export module Models {
	export class PurchaseOrderQuickSearch {
		VendorName: string;
		ProNumber: string;
		BolNumber: string;
		PoNumber: string;
		FromDate: Date;
		ToDate: Date;
		RoleId: number;
		PageNumber: number;
		PageSize: number;
		PagesFound: number;
		SortField: string;
		SortOrder: string;
		IsPurchaseOrder: number;
		constructor(args?: IPurchaseOrderQuickSearch) {
			if (args) {
				this.VendorName = args.VendorName ? (args.VendorName) : '';
				this.ProNumber = args.ProNumber ? (args.ProNumber) : '';
				this.BolNumber = args.BolNumber ? (args.BolNumber) : '';
				this.PoNumber = args.PoNumber ? (args.PoNumber) : '';
				this.FromDate = args.FromDate ? args.FromDate : new Date();
				this.ToDate = args.ToDate ? args.ToDate : new Date();
				this.PageNumber = args.PageNumber ? args.PageNumber : 0;
				this.PageSize = args.PageSize ? args.PageSize : 0;
				this.PagesFound = args.PagesFound ? args.PagesFound : 0;
				this.SortField = args.SortField ? (args.SortField) : '';
				this.SortOrder = args.SortOrder ? (args.SortOrder) : '';
				this.IsPurchaseOrder = args.IsPurchaseOrder ? (args.IsPurchaseOrder) : 0;
			}
		}
	}
}