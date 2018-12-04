/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />

import refSystem = require('durandal/system');

export module Models {
	export class SearchOceanCarrier {
		CarrierId: number;
		CarrierName: string;
		CarrierCode: string;
		CarrierType: string;
		display: string;

		constructor(args?: ISearchOceanCarrier) {
			if (args) {
				this.CarrierId = refSystem.isObject(args) ? (args.CarrierId) : 0;
				this.CarrierName = refSystem.isObject(args) ? (args.CarrierName) : '';
				this.CarrierCode = refSystem.isObject(args) ? (args.CarrierCode) : '';
				this.CarrierType = refSystem.isObject(args) ? (args.CarrierType) : '';
				this.display = this.CarrierName;
			}
		}
	}
}