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
	export class ForceInvoiceShipment {
		ForceInvoiceReason: string;
		BatchId: number;
		BOLNo: string;
		ShipmentId: number;
		IsBatch: boolean;
		BatchShipmentIds: string;
		UpdateDateTime: number;

		constructor(args?: IForceInvoiceShipment) {
			this.ForceInvoiceReason = refSystem.isObject(args) ? args.ForceInvoiceReason : '';
			this.BatchId = refSystem.isObject(args) ? args.BatchId : 0;
			this.BOLNo = refSystem.isObject(args) ? args.BOLNo : '';
			this.ShipmentId = refSystem.isObject(args) ? args.ShipmentId : 0;
			this.IsBatch = refSystem.isObject(args) ? args.IsBatch : false;
			this.BatchShipmentIds = refSystem.isObject(args) ? args.BatchShipmentIds : '';
			this.UpdateDateTime = refSystem.isObject(args) ? args.UpdateDateTime : 0;
		}
	}
}