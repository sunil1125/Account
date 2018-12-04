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

/* File Created: Feb 7, 2015
** Created By: Bhanu
*/
export module Model{
	export class SalesOrderFinalizeModel {
		ProcessStatusId: number;
		ShipmentId: number;
		TimeSpan: number;

		constructor(args?: ISalesOrderFinalizeDetails) {
			if (args) {
				this.ShipmentId = args.ShipmentId;
				this.ProcessStatusId = args.ProcessStatusId;
				this.TimeSpan = args.TimeSpan;
			}
		}
	}
}