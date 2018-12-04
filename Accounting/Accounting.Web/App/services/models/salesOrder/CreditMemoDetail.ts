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

/* File Created: Oct 21, 2016
** Created By: Baldev
** <changeHistory>
** <id>US25307</id> <by>Janakiram</by> <date>24-10-2016</date> <description>Added Description  for SO Credit Memo save</description>
** </changeHistory>
*/
export module Model {
	export class CreditMemoDetail {
		ShipmentId: number;
		CustomerCreditAmount: number;
		VendorCreditAmount: number;
		CreditReasonId: number;

		// ###START: US25307
		NotesDescription: string;
		// ###END: US25307
		constructor(args?: ICreditMemoRequestBoard) {
			if (args) {
				this.ShipmentId = refSystem.isObject(args) ? args.ShipmentId : 0;
				this.CreditReasonId = refSystem.isObject(args) ? args.CreditReasonId: 0;
				this.CustomerCreditAmount = refSystem.isObject(args) ? args.CustomerCreditAmount : 0;
				this.VendorCreditAmount = refSystem.isObject(args) ? args.VendorCreditAmount : 0;
				// ###START: US25307
				this.NotesDescription = refSystem.isObject(args) ? args.NotesDescription : '';
				// ###END: US25307
			}
		}
	}
}