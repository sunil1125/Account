/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../TypeDefs/PurchaseOrderModel.d.ts" />
//#endregion References

import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');

export module Models {
	export class ForeignBolSettings {
		CustomerId: number;
		CustomerName: string;
		EdiBolLength: number;
		IsEdiBolMapped: boolean;
		IsBillToAddressMapped: boolean;
		IsShipperAddressMapped: boolean;
        IsConsigneeMapped: boolean;
        IsBOLStartWithCharacter: boolean;
		ForeignBolAddressList: Array<IForeignBolAddress>
		IsShipperConsigneeAddressMapped:boolean;
		UpdatedDate: number;
		constructor(args?: IForeignBolSettings) {
			this.CustomerId = refSystem.isObject(args) ? args.CustomerId : 0;
			this.CustomerName = refSystem.isObject(args) ? args.CustomerName : '';
			this.EdiBolLength = refSystem.isObject(args) ? args.EdiBolLength : 0;
			this.IsEdiBolMapped = refSystem.isObject(args) ? args.IsEdiBolMapped : false;
			this.IsBillToAddressMapped = refSystem.isObject(args) ? args.IsBillToAddressMapped : false;
			this.IsShipperAddressMapped = refSystem.isObject(args) ? args.IsShipperAddressMapped : false;
            this.IsConsigneeMapped = refSystem.isObject(args) ? args.IsConsigneeMapped : false;
            this.IsBOLStartWithCharacter = refSystem.isObject(args) ? args.IsBOLStartWithCharacter : false;
			this.ForeignBolAddressList = refSystem.isObject(args) ? args.ForeignBolAddressList : null;
			this.UpdatedDate = refSystem.isObject(args) ? args.UpdatedDate : 0;
			this.IsShipperConsigneeAddressMapped = refSystem.isObject(args) ? args.IsShipperConsigneeAddressMapped : false;
		}
	}
}