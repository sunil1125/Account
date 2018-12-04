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
	export class Edi210ItemUnmappedCodeMapping {
		ID: number;
		Item: string;
		Description: string;
		Cost: number;
		Class: string;
		Weight: number;
		Pieces: string;
		Height: string;
		Width:	string;
		Length: string;
		MappedCode: string;
		constructor(args?: IEdi210ItemUnmappedCodeMapping) {
			this.ID = refSystem.isObject(args) ? args.ID : 0;
			this.Item = refSystem.isObject(args) ? args.Item : '';
			this.Description = refSystem.isObject(args) ? args.Description : '';
			this.Cost = refSystem.isObject(args) ? args.Cost : 0;
			this.Class = refSystem.isObject(args) ? args.Class : '';
			this.Weight = refSystem.isObject(args) ? args.Weight : 0;
			this.Length = refSystem.isObject(args) ? args.Length : '';
			this.Pieces = refSystem.isObject(args) ? args.Pieces : '';
			this.Height = refSystem.isObject(args) ? args.Height : '';
			this.Width = refSystem.isObject(args) ? args.Width : '';
			this.MappedCode = refSystem.isObject(args) ? args.MappedCode : '';
		}
	}
}