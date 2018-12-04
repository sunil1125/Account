/******************************************************************************

* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 

******************************************************************************/

/*
** <summary>
** Sales Order Dispute Mail Model
** </summary>
** <createDetails>
** <id>US24871</id> <by>Janakiram</by> <date>27-09-2016</date><description> send dispute email popup</description>
** </createDetails>
** <changeHistory>
** <id>US24874</id> <by>Vasanthakumar</by> <date>29-09-2016</date><description>Added shipment id to add notes</description>
** </changeHistory>
*/

// Interface
/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />


import refSystem = require('durandal/system');

export module Model {
	export class SalesOrderDisputeMailDetail {
		Subject: string;
		Attachments: Array<IUploadedFileDetails>;
		MailBody: string;
		EmailIds: string;
		CCMailIds: string;
		MailText: string;
		// ###START: US24874
		ShipmentId: number;
		// ###END: US24874
		constructor(args?: ISalesOrderDisputeMailDetail) {
			this.Subject = refSystem.isObject(args) ? args.Subject : "";
			this.Attachments = refSystem.isObject(args) ? args.Attachments : [];
			this.MailBody = refSystem.isObject(args) ? args.MailBody : "";
			this.EmailIds = refSystem.isObject(args) ? args.EmailIds : "";
			this.CCMailIds = refSystem.isObject(args) ? args.CCMailIds : "";
			this.MailText = refSystem.isObject(args) ? args.MailText : "";
			// ###START: US24874
			this.ShipmentId = refSystem.isObject(args) ? args.ShipmentId : 0;
			// ###END: US24874
		}
	}
}