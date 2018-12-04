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
	export class EDI210ExceptionDetailsItems {
		ID: number;
		Item: string;
		Description: string;
		Cost: string;
		Class: string;
		Weight: number;
		Pieces: number;
		Height: number;
		Width: number;
		constructor(args?: IEDI210ExceptionDetailsItems) {
			this.ID = refSystem.isObject(args) ? args.ID : 0;
			this.Item = refSystem.isObject(args) ? args.Item : '';
			this.Description = refSystem.isObject(args) ? args.Description : '';
			this.Cost = refSystem.isObject(args) ? args.Cost : '';
			this.Class = refSystem.isObject(args) ? args.Class : '';
			this.Weight = refSystem.isObject(args) ? args.Weight : 0;
			this.Pieces = refSystem.isObject(args) ? args.Pieces : 0;
			this.Height = refSystem.isObject(args) ? args.Height : 0;
			this.Width = refSystem.isObject(args) ? args.Width : 0;
		}
	}
}