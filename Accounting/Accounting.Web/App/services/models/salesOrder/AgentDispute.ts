/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
//#endregion References

/* File Created: Nov 20, 2014
** Created By: Chandan Singh
*/

import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');

export module Models {
	export class AgentDispute {
		Id: number;
		ShipmentId: number;
		DisputeAmount: number;
		DisputeDate: Date;
		DisputeNotes: string;
		DisputeReason: number;
		UpdatedBy: number;
		CreatedDate: Date;
		UpdatedDate: number;
		DisputedBy: number;
		BillStatus: number;
		VendorBillId: number;
		DisputedRepName: string;

		/// <summary>
		/// Constructor Initializes the Agent Dispute
		/// </summary>
		constructor(args?: IAgentDispute) {
			if (args) {
				this.Id = refSystem.isObject(args) ? args.Id : 0;
				this.ShipmentId = refSystem.isObject(args) ? args.ShipmentId : 0;
				this.DisputeAmount = refSystem.isObject(args) ? args.DisputeAmount : 0;
				this.DisputeDate = refSystem.isObject(args) ? args.DisputeDate : new Date();
				this.DisputeNotes = refSystem.isObject(args) ? args.DisputeNotes : '';
				this.DisputeReason = refSystem.isObject(args) ? args.DisputeReason : 0;
				this.UpdatedBy = refSystem.isObject(args) ? args.UpdatedBy : 0;
				this.CreatedDate = refSystem.isObject(args) ? args.CreatedDate : new Date();
				this.UpdatedDate = refSystem.isObject(args) ? args.UpdatedDate : 0;
				this.DisputedBy = refSystem.isObject(args) ? args.DisputedBy : 0;
				this.BillStatus = refSystem.isObject(args) ? args.BillStatus : 0;
				this.VendorBillId = refSystem.isObject(args) ? args.VendorBillId : 0;
				this.DisputedRepName = refSystem.isObject(args) ? args.DisputedRepName : '';
			}
		}

		activate() {
			return true;
		}
	}
}