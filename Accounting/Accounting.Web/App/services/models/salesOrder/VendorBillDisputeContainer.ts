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

/* File Created: Nov 17, 2014
** Created By: Chandan Singh
*/

import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');

/*
** <summary>
** Vendor bill dispute container view model for all VB method fetch and save from DB
** </summary>
** <createDetails>
** <id></id> <by></by> <date></date>
** </createDetails>
** <changeHistory>
** <id>US20352</id> <by>Chandan Singh Bajetha</by> <date>14-01-2016</date> <description>Acct: Adjust UI for Dispute Notes Tab in Vendor Bill</description>
** <id>US21131</id> <by>Shreesha Adiga</by> <date>31-03-2016</date><description>Added DisputeStateNote, SalesRepId and CustomerId to Dispute Container</description>
** <id>US22053</id> <by>Shreesha Adiga</by> <date>10-05-2016</date><description>Added properties for changes related to sending carrier researching mail</description>
** </changeHistory>
*/
export module Models {
	export class VendorBillDisputeContainer {
		// ###START: US20352
		DisputeStatusId: IEnumValue; // Dispute Status ID
		// ###END: US20352
		ShipmentId: number;
		DisputeVendorBill: Array<IDisputeVendorBill>;
        VendorBillItemsDetail: Array<IVendorBillItem>;
		VendorBillNotes: Array<IVendorBillNote>;
		CanSaveReasonCodes: boolean;
		// ##START: US21131
		DisputeStateNote: ISalesOrderNotes;
		SalesRepId: number;
		CustomerId: number;
		// ##END: US21131
		
		//##START: US22053
		BOLNumber: string;
		CarrierName: string;
		IsSavedFromVB: boolean;
		//##END: US22053
        
		/// <summary>
        /// Constructor Initializes the VendorBillContainer
        /// </summary>
		constructor(args?: IVendorBillDisputeContainer) {
			if (args) {
				// ###START: US20352
				this.DisputeStatusId = args.DisputeStatusId;
				// ###END: US20352
				this.DisputeVendorBill = args.DisputeVendorBill;
                this.VendorBillItemsDetail = args.VendorBillItemDetails;
				this.VendorBillNotes = args.VendorBillNote;
				this.ShipmentId = args.ShipmentId;
				this.CanSaveReasonCodes = args.CanSaveReasonCodes;
				// ##START: US21131
				this.DisputeStateNote = args.DisputeStateNote;
				this.SalesRepId = args.SalesRepId;
				this.CustomerId = args.CustomerId;
				// ##END: US21131

				//##START: US22053
				this.BOLNumber = args.BOLNumber;
				this.CarrierName = args.CarrierName;
				this.IsSavedFromVB = false;
				//##END: US22053
			}
        }

        activate() {
            return true;
        }
    }
}