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

/* File Created: April 14, 2014
** Created By: Achal Rastogi
** Modified By: Avinash Dubey Added all the properties and constructor
** Modified By: Satish Added all the properties and constructor
** <changeHistory>
** <id>US23124</id> <by>Janakiram</by> <date>04-07-2016</date><description>Added variable to assign permission and saving Memo text based on permissions </description>
** </changeHistory>
*/
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');

export module Models {
    export class VendorBillContainer {
        VendorBill: IVendorBill;
        VendorBillAddress: Array<IVendorBillAddress>;
        VendorBillItemsDetail: Array<IVendorBillItem>;
        VendorBillNotes: Array<IVendorBillNote>;
        VendorBillExceptions: IVendorBillExceptions;
        SuborderCount: number;
        IsNewSubBill: boolean;
        IsSubBill: boolean;
        IsCreateLostBillVisible: boolean;
        IsDisputeWonLostVisible: boolean;
        IsDisputeAmountEditable: boolean;
        IsDisputeLostAmountEditable: boolean;
        IsSaveEnable: boolean;
        IsDisputeSectionEditable: boolean;
        CanForcePushBillToMAS: boolean;

        // ###START: US23124
        IsReadOnly: boolean;
        // ###END: US23124

        /// <summary>
        /// Constructor Initializes the VendorBillContainer
        /// </summary>
        constructor(args?: IVendorBillContainer) {
            if (args) {
                this.VendorBill = args.VendorBill;
                this.VendorBillAddress = args.VendorBillAddress;
                this.VendorBillItemsDetail = args.VendorBillItemsDetail;
                this.VendorBillNotes = args.VendorBillNotes;
                this.VendorBillExceptions = args.VendorBillExceptions;
                this.SuborderCount = args.SuborderCount;
                this.IsNewSubBill = args.IsNewSubBill;
                this.IsSubBill = args.IsSubBill;
                this.IsCreateLostBillVisible = args.IsCreateLostBillVisible;
                this.IsDisputeWonLostVisible = args.IsDisputeWonLostVisible;
                this.IsDisputeAmountEditable = args.IsDisputeAmountEditable;
                this.IsDisputeLostAmountEditable = args.IsDisputeLostAmountEditable;
                this.IsSaveEnable = args.IsSaveEnable;
                this.IsDisputeSectionEditable = args.IsDisputeSectionEditable;
                this.CanForcePushBillToMAS = args.CanForcePushBillToMAS;
            }
        }

        activate() {
            return true;
        }
    }
}