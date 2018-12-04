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
      Desc: To hold Vendor data.

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
    export class Vendor{
        ID: number;
        CarrierName: string;
        CarrierType: number;
        CarrierCode: string;
        MCNumber: string;
        ContactName: string;
        City: string;
		State: string;
		CarrierTypeName: string;
        constructor(args?: IVendor) {
            this.ID = refSystem.isObject(args) ? (args.ID) : 0;
            this.CarrierName = refSystem.isObject(args) ? (args.CarrierName) : '';
            this.CarrierType = refSystem.isObject(args) ? (args.CarrierType) : 0;
            this.CarrierCode = refSystem.isObject(args) ? (args.CarrierCode) : '';
            this.MCNumber = refSystem.isObject(args) ? (args.MCNumber) : '';
            this.ContactName = refSystem.isObject(args) ? (args.ContactName) : '';
            this.City = refSystem.isObject(args) ? (args.City) : '';
            this.State = refSystem.isObject(args) ? (args.State) : '';
			this.CarrierTypeName = refSystem.isObject(args) ? (args.CarrierTypeName) : '';
        }
    }
}