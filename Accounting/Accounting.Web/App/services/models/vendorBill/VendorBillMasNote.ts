/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References

/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../TypeDefs/VendorBillModels.d.ts" />

//#endregion References

/**#Created:
        By: Satish
        On: May 29, 2014
      Desc: To hold Vendorbill MAS Notes

**#Modified:
        By:
        On:
      Desc:
*/

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
//#endregion Import

export module Models {
    export class VendorBillMasNote{
        VendorBillId: number;
        EffectiveDate: Date;
        MemoText: string;
		Sender: string;
		EffectiveDateDisplay:string;
        constructor(args?: IVendorBillMasNote) {
            this.VendorBillId = refSystem.isObject(args) ? (args.VendorBillId) : 0;
            this.EffectiveDate = refSystem.isObject(args) ? (args.EffectiveDate) : new Date();
            this.MemoText = refSystem.isObject(args) ? (args.MemoText) : '';
			this.Sender = refSystem.isObject(args) ? (args.Sender) : '';
			this.EffectiveDateDisplay = refSystem.isObject(args) ? (args.EffectiveDateDisplay) : '';
        }
    }
}