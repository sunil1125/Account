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
	export class Edi210DuplicateExceptionDetails {
		ID: number;
		ProNumber: string;
		CarrierId: number;
		NetAmountDue: string;
		BOLNo: string;
		constructor(args?: IEdi210DuplicateExceptionDetails) {
			this.ID = refSystem.isObject(args) ? args.ID : 0;
			this.ProNumber = refSystem.isObject(args) ? args.ProNumber : '';
			this.CarrierId = refSystem.isObject(args) ? args.CarrierId : 0;
			this.NetAmountDue = refSystem.isObject(args) ? args.NetAmountDue : '';
			this.BOLNo = refSystem.isObject(args) ? args.BOLNo : '';
		}
	}
}