/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../TypeDefs/VendorBillModels.d.ts" />

//#endregion References

/**#Created:
		<By>Bhanu</By><On>July 31, 2014 </On><Desc>To hold VendorBill IDs.</Desc>
##Modified:
	<By></By><On></On><Desc></Desc>
*/

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
//#endregion Import

export module Models {
	export class PurchaseOrderEmail {
		EmailAddress: string;
		PurchaseOrderData: Array<IPurchaseOrderBoard>;
		VendorBillDocuments: Array<any>;
		AgentName: string;
		Comments: string;
		CustomerName: string;
		constructor(args?: IPurchaseOrderEmail) {
			if (args) {
				this.EmailAddress = args.EmailAddress;
				this.PurchaseOrderData = args.PurchaseOrderData;
				this.VendorBillDocuments = args.VendorBillDocuments;
				this.AgentName = args.AgentName;
				this.Comments = args.Comments;
				this.CustomerName = args.CustomerName;
			}
		}
	}
}