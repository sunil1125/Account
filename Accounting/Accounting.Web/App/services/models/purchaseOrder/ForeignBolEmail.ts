/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../TypeDefs/PurchaseOrderModel.d.ts" />

//#endregion References
//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
//#endregion Import

export module Models {
	export class ForeignBolEmail {
		EmailAddress: string;
		Attachments: Array<any>;
		AgentName: string;
		Comments: string;
		CustomerName: string;
		ForeignBolEmailData: IForeignBolEmailData;
		IsForeignBol: boolean;
		VendorBillId: number;
		CustomerId: number;
		SalesRepId: number;
		constructor(args?: IForeignBolEmail) {
			if (args) {
				this.EmailAddress = args.EmailAddress;
				this.Attachments = args.Attachments;
				this.AgentName = args.AgentName;
				this.Comments = args.Comments;
				this.CustomerName = args.CustomerName;
				this.ForeignBolEmailData = args.ForeignBolEmailData;
				this.IsForeignBol = args.IsForeignBol;
				this.VendorBillId = args.VendorBillId;
				this.CustomerId = args.CustomerId;
				this.SalesRepId = args.SalesRepId;
			}
		}
	}
}