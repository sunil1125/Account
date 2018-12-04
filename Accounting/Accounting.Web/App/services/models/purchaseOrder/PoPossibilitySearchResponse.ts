/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created: Sept 30, 2014
** Created By: Chandan Singh Bajetha
*/
/// <reference path="../TypeDefs/PurchaseOrderSearchModel.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
import refSystem = require('durandal/system');

export module Models {
	export class PoPossibilitySearchResponse {
		PoPossibilityResponse: Array<IPOPossibility>;
		NumberOfRows: number;

		constructor(args?: IPoPossibilitySearchResponse) {
			if (args) {
				this.PoPossibilityResponse = args.PoPossibilityResponse ? (args.PoPossibilityResponse) : null;
				this.NumberOfRows = args.NumberOfRows ? (args.NumberOfRows) : 0;
			}
		}
	}
}