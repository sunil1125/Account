/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/Admin.d.ts" />
/// <reference path="../TypeDefs/CommonModels.d.ts" />

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
//#endregion Import

export module Models {
	export class CompanyOnlinePaymentDetails {
		CCProcessCharge: number;
		ECheckProcessCharge: number;
		CCVisibility: boolean;
		ECheckVisible: boolean;
		CCMessage: string;
		ECheckMessage: string;
		DebitVisibility: boolean;
		DebitMessage: string;
		CCChargeType: string;
		ECheckChargeType: string;
		CustomerId: number;
		DiscountDueDays:number;
		EntityType: number;
		EntityId: number;

		constructor(args?: ICompanyOnlinePaymentDetails) {
			this.CCProcessCharge = refSystem.isObject(args) ? args.CCProcessCharge : 0;
			this.ECheckProcessCharge = refSystem.isObject(args) ? args.ECheckProcessCharge : 0;
			this.CCVisibility = refSystem.isObject(args) ? args.CCVisibility : false;
			this.ECheckVisible = refSystem.isObject(args) ? args.ECheckVisible : false;
			this.CCMessage = refSystem.isObject(args) ? args.CCMessage : '';
			this.ECheckMessage = refSystem.isObject(args) ? args.ECheckMessage : '';
			this.DebitVisibility = refSystem.isObject(args) ? args.DebitVisibility : false;
			this.DebitMessage = refSystem.isObject(args) ? args.DebitMessage : '';
			this.CustomerId = refSystem.isObject(args) ? args.CustomerId : 0;
			this.DiscountDueDays = refSystem.isObject(args) ? args.DiscountDueDays : 0;
			this.EntityType = refSystem.isObject(args) ? args.EntityType : 0;
			this.EntityId = refSystem.isObject(args) ? args.EntityId : 0;
		}
	}
}