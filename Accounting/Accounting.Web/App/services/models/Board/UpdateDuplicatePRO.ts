/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/Boards.d.ts" />
/// <reference path="../TypeDefs/CommonModels.d.ts" />

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
//#endregion Import

export module Models {
	export class UpdateDuplicatePRO {
		BatchId: number;
		EDIDetailID: number;
		IsActive: boolean;
		Edi210ItemUnmappedCodeMapping: Array<IEdi210ItemUnmappedCodeMapping>;
		constructor(args?: IUpdateDuplicatePRO) {
			if (args) {
				this.BatchId = refSystem.isObject(args) ? args.BatchId : 0;
				this.EDIDetailID = refSystem.isObject(args) ? args.EDIDetailID : 0;
				this.IsActive = refSystem.isObject(args) ? args.IsActive : false;
				this.Edi210ItemUnmappedCodeMapping = args.Edi210ItemUnmappedCodeMapping;
			}
		}
	}
}