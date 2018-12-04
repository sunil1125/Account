/******************************************************************************

* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 

******************************************************************************/
/*
** <summary>
** Sales OrderCredit Notification Mail Model
** </summary>
** <createDetails>
** <id>US25154</id> <by>Janakiram</by> <date>13-10-2016</date><description> Sales Order Credit Notification Email</description>
** </createDetails>
** <changeHistory>
** <id>US25315</id> <by>Janakiram</by><date>26-10-2016</date><description>Passing data to Populate data on MAS Credit pop-up</description>
** <id>US25369</id> <by>Janakiram</by><date>26-10-2016</date><description>Added Notes on Processing Credit</description>
** <id>US25369</id> <by>Janakiram</by><date>02-11-2016</date><description>Added Notes on Processing Credit</description>
** <id>DE25976</id> <by>Baldev Singh Thakur</by> <date>23-02-2017</date><description>Added CreditRequestedBy for sending mail.</description>
** <id>US31415</id> <by>Vasanthakumar</by> <date>21-09-2017</date> <description>Accounting: AR dash board - Credit Memo Requests Rejection Note</description>
** </changeHistory>
*/

// Interface
/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />


import refSystem = require('durandal/system');

export module Model {
	export class SalesOrderCreditNotificationMail {
		BOLNumber: string;
		CreditAmount: number;
		// ###START: US25315
		CreditRequestId: number;
		// ###END: US25315

		// ###START: US25369
		ShipmentId: number;
		// ###END: US25369

		// ###START: US25369
		CreditReasonId: number;
		// ###END: US25369

		// ###START: DE25976
		CreditRequestedBy: number;

		// ###END: DE25976

		RejectionNote: string;

		constructor(args?: ISalesOrderCreditNotification) {
			var self = this

			if (args != null && refSystem.isObject(args)) {
				self.BOLNumber = args.BOLNumber;
				self.CreditAmount = args.CreditAmount;
				// ###START: US25315
				self.CreditRequestId = args.CreditRequestId;
				// ###END: US25315
				
				// ###START: US25369
				self.ShipmentId = args.ShipmentId;
				// ###END: US25369

				// ###START: US25369
				self.CreditReasonId = args.CreditReasonId;
				// ###END: US25369

				// ###START: DE25976
				self.CreditRequestedBy = args.CreditRequestedBy;
				// ###END: DE25976

				self.RejectionNote = args.RejectionNote;
			}
			else {
				self.BOLNumber = "";
				self.CreditAmount = 0;
				// ###START: US25315
				self.CreditRequestId = 0;
				// ###END: US25315

				// ###START: US25369
				self.ShipmentId =0;
				// ###END: US25369

				// ###START: US25369
				self.CreditReasonId = 0;
				// ###END: US25369

				// ###START: DE25976
				self.CreditRequestedBy = 0;
				// ###END: DE25976

				self.RejectionNote = "";
			}

			return self;
		}
	}
}