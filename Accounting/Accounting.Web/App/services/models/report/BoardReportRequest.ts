/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created: April 14,2014 */
/// <reference path="../TypeDefs/Report.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
import refSystem = require('durandal/system');


/*
** <summary>
** Model for BoardReportRequest.
** </summary>
** <createDetails>
** <id></id><by></by><date></date>
** </createDetails>
** <changeHistory>
** <id>US26560</id> <by>Baldev Singh Thakur</by> <date>20-02-2017</date> <description>Added SearchColumn property.</description>
** </changeHistory>
*/

export module Models {
	export class BoardReportRequest {
		VendorName: string;
		ProNumber: string;
		PageNumber: number;
		PageSize: number;
		FromDate: Date;
        ToDate: Date;
		RebillRepName: string;
		GridSearchText: string;
		SearchColumn: string;
		constructor(args?: IBoardReportRequest) {
			this.ProNumber = refSystem.isObject(args) ? (args.ProNumber) : '';
			this.VendorName = refSystem.isObject(args) ? (args.VendorName) : '';
			this.PageNumber = refSystem.isObject(args) ? (args.PageNumber) : 0;
			this.PageSize = refSystem.isObject(args) ? (args.PageSize) : 0;
			this.FromDate = refSystem.isObject(args) ? (args.FromDate) : new Date();
            this.ToDate = refSystem.isObject(args) ? (args.ToDate) : new Date();
			this.RebillRepName = refSystem.isObject(args) ? (args.RebillRepName) : '';
			this.GridSearchText = refSystem.isObject(args) ? (args.GridSearchText) : '';
			this.SearchColumn = refSystem.isObject(args) ? (args.SearchColumn) : '';
		}
	}
}