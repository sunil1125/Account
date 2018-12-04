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
*/
export module Model {
	export class CreditMemoContainer {
		CreditMemoDetail: ICreditMemoRequestBoard;
		constructor(args?: ICreditMemoPopupDetails) {
			if (args) {
				this.CreditMemoDetail = args.CreditMemoDetail;
			}
		}
	}
}