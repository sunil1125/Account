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
	export class ComparisonToleranceItems {
		ID: number;
		ToleranceID: number;
		ItemMasId: number;
		ItemDescription: string;
		UpdatedBy: number;

		constructor(args?: IComparisonToleranceItems) {
			this.ID = refSystem.isObject(args) ? args.ID : 0;
			this.ToleranceID = refSystem.isObject(args) ? args.ToleranceID : 0;
			this.ItemDescription = refSystem.isObject(args) ? args.ItemDescription : '';
			this.ItemMasId = refSystem.isObject(args) ? args.ItemMasId : 0;
			this.UpdatedBy = refSystem.isObject(args) ? args.UpdatedBy : 0;
		}
	}
}