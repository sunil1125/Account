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
      Desc: To hold Vendorbill payment details data

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
    export class ShipmentPaymentDetails{
        Id: number;
        Amount: string;
        Balance: string;
        AmountPaid: string;
        PaymentAmount: string;
        TransactionType: string;
        CommissionType: string;
        RecordType: string;
        ApplyFromTranDate: string;
		PaymentTypeDescription: string;
		FactoringCompany: string;
		BatchComments: string;
		Batch: string;
		Status: string;
        constructor(args?: IShipmentPaymentDetails) {
            this.Id = refSystem.isObject(args) ? args.Id : 0;
            this.Amount = refSystem.isObject(args) ? (args.Amount) : '';
            this.Balance = refSystem.isObject(args) ? (args.Balance) : '';
            this.AmountPaid = refSystem.isObject(args) ? (args.AmountPaid) : '';
            this.PaymentAmount = refSystem.isObject(args) ? (args.PaymentAmount) : '';
            this.TransactionType = refSystem.isObject(args) ? (args.TransactionType) : '';
            this.CommissionType = refSystem.isObject(args) ? (args.CommissionType) : '';
            this.RecordType = refSystem.isObject(args) ? (args.RecordType) : '';
            this.ApplyFromTranDate = refSystem.isObject(args) ? (args.ApplyFromTranDate) : '';
			this.PaymentTypeDescription = refSystem.isObject(args) ? (args.PaymentTypeDescription) : '';
			this.FactoringCompany = refSystem.isObject(args) ? (args.FactoringCompany) : '';
			this.BatchComments = refSystem.isObject(args) ? (args.BatchComments) : '';
			this.Batch = refSystem.isObject(args) ? (args.Batch) : '';
			this.Status = refSystem.isObject(args) ? (args.Status) : '';
        }
    }
}