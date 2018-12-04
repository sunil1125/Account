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
	export class Edi210DuplicateExceptionCarrierDetails {
		ID: number;
		CarrierName: string;
		CarrierID: number;
		BOLNumber: string;
		ProNumber: string;
		BillDate: string;
		PO: string;
		EDIBol: string;
		ReferenceNo: string;
		ShipmentID: number;
		constructor(args?: IEdi210DuplicateExceptionCarrierDetails) {
			this.ID = refSystem.isObject(args) ? args.ID : 0;
			this.CarrierName = refSystem.isObject(args) ? args.CarrierName : '';
			this.CarrierID = refSystem.isObject(args) ? args.CarrierID : 0;
			this.BOLNumber = refSystem.isObject(args) ? args.BOLNumber : '';
			this.ProNumber = refSystem.isObject(args) ? args.ProNumber : '';
			this.BillDate = refSystem.isObject(args) ? args.BillDate : '';
			this.PO = refSystem.isObject(args) ? args.PO : '';
			this.EDIBol = refSystem.isObject(args) ? args.EDIBol : '';
			this.ReferenceNo = refSystem.isObject(args) ? args.ReferenceNo : '';
			this.ShipmentID = refSystem.isObject(args) ? args.ShipmentID : 0;
		}
	}
}