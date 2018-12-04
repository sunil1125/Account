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

/* File Created: Aug 9, 2014
** Created By: Bhanu
*/
export module Model {
	export class SalesOrderNotesContainer {
		SalesOrderNoteDetails: Array<ISalesOrderNotes>;
		Id: number;
		constructor(args?: ISalesOrderNotesContainer) {
			if (args) {
				this.SalesOrderNoteDetails = args.SalesOrderNoteDetails;
				this.Id = args.Id;
			}
		}
	}
}