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
	export class ComparisonTolerance {
		ID: number;
		Description: string;
		ToleranceAmount: number;
		CustomerType: number;
		ToleranceType: IEnumValue;
		UpdatedBy: number;

		constructor(args?: IComparisonTolerance) {
			this.ID = refSystem.isObject(args) ? args.ID : 0;
			this.ToleranceAmount = refSystem.isObject(args) ? args.ToleranceAmount : 0;
			this.Description = refSystem.isObject(args) ? args.Description : '';
			this.CustomerType = refSystem.isObject(args) ? args.CustomerType : 0;
			this.ToleranceType = refSystem.isObject(args) ? args.ToleranceType : null;
			this.UpdatedBy = refSystem.isObject(args) ? args.UpdatedBy : 0;
		}
	}
}