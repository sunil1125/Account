/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../TypeDefs/Boards.d.ts" />
//#endregion References

/* File Created: feb 6, 2015
** Created By: Chadnan Singh bajetha
*/
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');

export module Models {
	export class EDI210Inputparameter {
		VendorBillDuplicateData: IVendorBillContainer;
		OriginalVBProNumber: string;
		OriginalVBMainBolNumber: string;
		EdiDetailsId: number;

		constructor(args?: IEDI210Inputparameter) {
			if (args) {
				this.VendorBillDuplicateData = args.VendorBillDuplicateData;
				this.OriginalVBProNumber = args.OriginalVBProNumber;
				this.OriginalVBMainBolNumber = args.OriginalVBMainBolNumber;
				this.EdiDetailsId = args.EdiDetailsId;
			}
		}
	}
}