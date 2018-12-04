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

/* File Created: Nov 30, 2014
** Created By: Satish
*/
export module Model {
	export class SalesOrderAuditSettingCarrierDetails {
		CarrierId: number;
		IsFAKMapping: boolean;
		constructor(args?: ISalesOrderAuditSettingCarrierDetails) {
			this.CarrierId = refSystem.isObject(args) ? args.CarrierId : 0;
			this.IsFAKMapping = refSystem.isObject(args) ? args.IsFAKMapping : false;
		}
	}
}