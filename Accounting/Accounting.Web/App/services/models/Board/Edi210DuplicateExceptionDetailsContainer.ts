/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../TypeDefs/Boards.d.ts" />
//#endregion References

/* File Created: jan 5, 2015
** Created By: Chadnan Singh bajetha
*/
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');

export module Models {
	export class Edi210DuplicateExceptionDetailsContainer {
		Edi210DuplicateExceptionCarrierDetails: IEdi210DuplicateExceptionCarrierDetails;
		Edi210DuplicateExceptionDetails: Array<IEdi210DuplicateExceptionDetails>;

		constructor(args?: IEdi210DuplicateExceptionDetailsContainer) {
			this.Edi210DuplicateExceptionCarrierDetails = args.Edi210DuplicateExceptionCarrierDetails;
			this.Edi210DuplicateExceptionDetails = args.Edi210DuplicateExceptionDetails;
		}
	}
}