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

/* File Created: Nov 12, 2014
** Created By: Sankesh
*/
export module Model {
	export class SalesOrderRequoteReviewDetail {
		ID: number;
		CRReviewDate: Date;
		TotalCostAdjustment: number;
		TotalRevenueAdjustment: number;
		AdjustmentDate: Date;
		ReviewedBy: string;
		Reviewed: number;
		IsManualReviewed: boolean;
		IsBillAudited: boolean;
		AdjustmentDateDisplay: string;
		CRReviewDateDisplay: string;
		SalesOrderId: number;
		constructor(args?: ISalesOrderRequoteReviewDetail) {
			if (args) {
				this.ID = refSystem.isObject(args) ? args.ID : 0;
				this.CRReviewDate = args.CRReviewDate;
				this.TotalCostAdjustment = refSystem.isObject(args) ? args.TotalCostAdjustment : 0;
				this.TotalRevenueAdjustment = refSystem.isObject(args) ? args.TotalRevenueAdjustment : 0;
				this.AdjustmentDate = args.AdjustmentDate;
				this.ReviewedBy = refSystem.isObject(args) ? args.ReviewedBy : '';
				this.Reviewed = refSystem.isObject(args) ? args.Reviewed : 0;
				this.IsManualReviewed = refSystem.isObject(args) ? args.IsManualReviewed : false;
				this.IsBillAudited = refSystem.isObject(args) ? args.IsBillAudited : false;
				this.SalesOrderId = refSystem.isObject(args) ? args.SalesOrderId : 0;
			}
		}
	}
}