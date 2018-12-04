/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />

import refSystem = require('durandal/system');

export interface ICustomerFinancialDetails {
	CustomerId: number;
	Terms: string;
	CreditLimit: number;
}

export module Models {
	export class CustomerFinancialDetails {
		CustomerId: number;
		Terms: string;
		CreditLimit: number;
		constructor(args?: ICustomerFinancialDetails) {
			this.CustomerId = refSystem.isObject(args) ? (args.CustomerId) : 0;
			this.Terms = refSystem.isObject(args) ? (args.Terms) : '';
			this.CreditLimit = refSystem.isObject(args) ? (args.CreditLimit) : 0;
		}
	}
}