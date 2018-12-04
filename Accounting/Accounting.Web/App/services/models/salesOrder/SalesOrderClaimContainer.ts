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

/* File Created: Oct 21, 2014
** Created By: Sankesh
*/
export module Model {
	export class SalesOrderClaimContainer {
		SalesOrderClaimDetail: ISalesOrderClaimDetail;
		SalesOrderClaimDocument: Array<ISalesOderClaimDocument>;
		SalesOrderClaimNotes: Array<ISalesOrderNotes>;
		SalesOrderClaimNoteDetails: Array<ISalesOrderNotes>;
        constructor(args?: ISaleOrderClaimContainer) {
            this.SalesOrderClaimDetail = args.SalesOrderClaimDetail;
            this.SalesOrderClaimDocument = args.SalesOrderClaimDocument;
			this.SalesOrderClaimNotes = args.SalesOrderClaimNotes;
			this.SalesOrderClaimNoteDetails = args.SalesOrderClaimNoteDetails;
	   }
	}
}