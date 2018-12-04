/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />

import refSystem = require('durandal/system');

/* File Created: Nov 12, 2014
** Created By: Sankesh
*/
export module Model {
	export class SalesOrderShipmentRequoteReason {
		ID: number;
		Remarks: string;
		RequoteReasonID: number;

		constructor(args?: ISalesOrderShipmentRequoteReason) {
			if (args) {
				this.ID = refSystem.isObject(args) ? args.ID : 0;
				this.Remarks = refSystem.isObject(args) ? args.Remarks : '';
				this.RequoteReasonID = refSystem.isObject(args) ? args.RequoteReasonID : 0;
			}
		}
	}
}