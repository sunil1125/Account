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
** <changeHistory>
** <id>US19722</id> <by>Shreesha Adiga</by> <date>29-12-2015</date> <description>Added Edi210DetailId, ExceptionRuleId, BatchId for redirecting to EDI from tracking report</description>
** </changeHistory>
*/
export module Models {
	export class VendorBillTrackingReport {
		VendorBillId: number;
		ProNumber: string;
		ProcessingDateDisplay: string;
		EdiStatus: string;
		GlobalNetStatus: string;
		VBStatus: string;
		VBBillStatus: string;
		ProcessWorkflow: string;
        VBAmount: string;
        PaidDateDisplay: string;
        Terms: string;
        DueDateDisplay: string;
        RemitAddress: string;
        IsPaid: boolean;
        PaidAmt: string;
        CheckNoOrTranId: string;
        Carrier: string;
        StuckInIDB: boolean;

        DateVendorClosingBillPaid: string;
        DateVendorBillStatusChanged: string;
        DisputeNote: string;
        ShipperCompanyName: string;
        ConsigneeCompanyName: string;
        EstimatedCost: number;
        EstimatedRevenue: number;
		ReviewNotes: string;

		Edi210DetailId: number;
		ExceptionRuleId: number;
		BatchId: number;

		constructor(args?: IVendorBillTrackingReport) {
			this.VendorBillId = refSystem.isObject(args) ? (args.VendorBillId) : 0,
			this.ProNumber = refSystem.isObject(args) ? (args.ProNumber) : '';
			this.ProcessingDateDisplay = refSystem.isObject(args) ? (args.ProcessingDateDisplay) : '';
			this.EdiStatus = refSystem.isObject(args) ? (args.EdiStatus) : '';
			this.GlobalNetStatus = refSystem.isObject(args) ? (args.GlobalNetStatus) : '';
			this.VBStatus = refSystem.isObject(args) ? (args.VBStatus) : '';
			this.VBBillStatus = refSystem.isObject(args) ? (args.VBBillStatus) : '';
			this.ProcessWorkflow = refSystem.isObject(args) ? (args.ProcessWorkflow) : '';
            this.VBAmount = refSystem.isObject(args) ? (args.VBAmount) : '';
            this.PaidDateDisplay = refSystem.isObject(args) ? (args.PaidDateDisplay) : '';
            this.Terms = refSystem.isObject(args) ? (args.Terms) : '';
            this.DueDateDisplay = refSystem.isObject(args) ? (args.DueDateDisplay) : '';
            this.RemitAddress = refSystem.isObject(args) ? (args.RemitAddress) : '';
            this.IsPaid = refSystem.isObject(args) ? (args.IsPaid) : false;
            this.PaidAmt = refSystem.isObject(args) ? (args.PaidAmt) : '';
            this.CheckNoOrTranId = refSystem.isObject(args) ? (args.CheckNoOrTranId) : '';
            this.Carrier = refSystem.isObject(args) ? (args.Carrier) : '';
            this.StuckInIDB = refSystem.isObject(args) ? (args.StuckInIDB) : false;
            this.DateVendorClosingBillPaid = refSystem.isObject(args) ? (args.DateVendorClosingBillPaid) : '';
            this.DateVendorBillStatusChanged = refSystem.isObject(args) ? (args.DateVendorBillStatusChanged) : '';
            this.DisputeNote = refSystem.isObject(args) ? (args.DisputeNote) : '';
            this.ShipperCompanyName = refSystem.isObject(args) ? (args.ShipperCompanyName) : '';
            this.ConsigneeCompanyName = refSystem.isObject(args) ? (args.ConsigneeCompanyName) : '';
            this.EstimatedCost = refSystem.isObject(args) ? (args.EstimatedCost) : 0;
            this.EstimatedRevenue = refSystem.isObject(args) ? (args.EstimatedRevenue) : 0;
			this.ReviewNotes = refSystem.isObject(args) ? (args.ReviewNotes) : '';

			this.Edi210DetailId = refSystem.isObject(args) ? (args.Edi210DetailId) : 0;
			this.ExceptionRuleId = refSystem.isObject(args) ? (args.ExceptionRuleId) : 0;
			this.BatchId = refSystem.isObject(args) ? (args.BatchId) : 0;
		}
	}
}