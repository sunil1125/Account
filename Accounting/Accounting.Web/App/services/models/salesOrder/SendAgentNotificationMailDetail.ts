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

/* File Created: Oct 30, 2014
** Created By: Satish
*/
export module Model {
	export class SendAgentNotificationMailDetail {
		ScenarioId: number;
		SalesRepId: number;
		Subject: string;
		DetailsToBeMailed: string;
		PartnerCompanyId: number;
		IsTQLCustomer: boolean;
		CustomerId: number;
		constructor(args?: ISendAgentNotificationMailDetail) {
			this.ScenarioId = refSystem.isObject(args) ? args.ScenarioId : 0;
			this.SalesRepId = refSystem.isObject(args) ? args.SalesRepId : 0;
			this.Subject = refSystem.isObject(args) ? args.Subject : "";
			this.DetailsToBeMailed = refSystem.isObject(args) ? args.DetailsToBeMailed : "";
			this.PartnerCompanyId = refSystem.isObject(args) ? args.PartnerCompanyId : 0;
			this.IsTQLCustomer = refSystem.isObject(args) ? args.IsTQLCustomer : false;
			this.CustomerId = refSystem.isObject(args) ? args.CustomerId : 0;
		}
	}
}