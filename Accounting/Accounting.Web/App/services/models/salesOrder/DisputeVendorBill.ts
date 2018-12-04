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

/*
** <createDetails>
** <id></id> <by>Chandan</by> <date>17-11-2014</date>
** </createDetails>
** <changeHistory>
** <id>US21147</id> <by>Shreesha Adiga</by> <date>15-03-2016</date> <description>Added LateDisputedAmount</description>
** <id>US21791</id> <by>Shreesha Adiga</by> <date>05-05-2016</date> <description>Added AgingDays</description>
** <id>US24865</id> <by>Shreesha Adiga</by> <date>23-09-2016</date> <description>Added DisputeCarrierEmailDetailsList</description>
** <id>DE25119</id> <by>Janakiram</by> <date>23-11-2016</date><description>Adding IsCreditProcessEnable to disable dispute fields of credit line items having VB</description>
** </changeHistory>
*/

import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');

export module Models {
	export class DisputeVendorBill {
		VendorBillId: number;
		ProNumber: string;
		DisputedDate: Date;
		DisputeNotes: string;
		UpdatedBy: number;
		UpdatedDate: number;
		DisputedAmount: number;
		//##START: US21147
		LateDisputedAmount: number;
		//##END: US21147
		BillStatus: number;
		MasClearanceStatus: number;
		HoldVendorBill: boolean;
		QuickPay: boolean;
		MasTransferDate: Date;
		ListOfBillStatuses: Array<IEnumValue>;
		ReasonCodes: Array<ISalesOrderShipmentRequoteReason>;
		OriginalBillStatus: number;
		DisputeStatusId: number;
		CarrierCode: string;
		CarrierName: string;

		// ##START: US21791
		AgingDays: number;
		// ##END: US21791
		// ##START: US24865
		DisputeCarrierEmailDetailsList: Array<IDisputeCarrierContactEmailAddress>;
		// ##END: US24865

		// ###START:DE25119
		IsCreditProcessEnable: boolean;
		// ###END:DE25119

		/// <summary>
		/// Constructor Initializes the DisputeVendorBill
		/// </summary>
		constructor(args?: IDisputeVendorBill) {
			if (args) {
				this.VendorBillId = refSystem.isObject(args) ? (args.VendorBillId) : 0;
				this.ProNumber = refSystem.isObject(args) ? (args.ProNumber) : '';
				this.DisputedDate = refSystem.isObject(args) ? (args.DisputedDate) : new Date();
				this.DisputeNotes = refSystem.isObject(args) ? (args.DisputeNotes) : '';
				this.UpdatedBy = refSystem.isObject(args) ? (args.UpdatedBy) : 0;
				this.UpdatedDate = refSystem.isObject(args) ? (args.UpdatedDate) : 0;
				this.DisputedAmount = refSystem.isObject(args) ? (args.DisputedAmount) : 0;
				//##START: US21147
				this.LateDisputedAmount = refSystem.isObject(args) ? (args.LateDisputedAmount) : 0;
				//##END: US21147
				this.BillStatus = refSystem.isObject(args) ? (args.BillStatus) : 0;
				this.MasClearanceStatus = refSystem.isObject(args) ? (args.MasClearanceStatus) : 0;
				this.HoldVendorBill = refSystem.isObject(args) ? (args.HoldVendorBill) : false;
				this.QuickPay = refSystem.isObject(args) ? (args.QuickPay) : false;
				this.MasTransferDate = refSystem.isObject(args) ? (args.MasTransferDate) : null;
				this.ListOfBillStatuses = refSystem.isObject(args) ? (args.ListOfBillStatuses) : null;
				this.ReasonCodes = refSystem.isObject(args) ? (args.ReasonCodes) : null;
				this.OriginalBillStatus = refSystem.isObject(args) ? (args.OriginalBillStatus) : 0;
				this.DisputeStatusId = refSystem.isObject(args) ? (args.DisputeStatusId) : 0;
				this.CarrierCode = refSystem.isObject(args) ? (args.CarrierCode) : '';
				this.CarrierName = refSystem.isObject(args) ? (args.CarrierName) : '';

				// ##START: US21791
				this.AgingDays = refSystem.isObject(args) ? (args.AgingDays) : 0;
				// ##END: US21791

				// ##START: US24865
				this.DisputeCarrierEmailDetailsList = refSystem.isObject(args) ? args.DisputeCarrierEmailDetailsList : [];
				// ##END: US24865

				// ###START:DE25119
				this.IsCreditProcessEnable = refSystem.isObject(args) ? (args.IsCreditProcessEnable) : false;
				// ###END:DE25119
			}
		}

		activate() {
			return true;
		}
	}
}