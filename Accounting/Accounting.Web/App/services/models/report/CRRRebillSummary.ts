/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/Report.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
import refSystem = require('durandal/system');

export module Models {
    export class CRRRebillSummary {
        ShipmentId: number;
        BOLNo: string;
        PRONo: string;
        TotalCostAdjustment: number;
        TotalRevenueAdjustment: number;
        Name: string;
        CompanyName: string;
        FullName: string;
        ReviewDateDisplay: string;
        ReviewedBy: string;
        VendorBillId: number;
        constructor(args: IOrderRebillReport) {
            this.ShipmentId = refSystem.isObject(args) ? (args.ShipmentId) : 0;
            this.BOLNo = refSystem.isObject(args) ? (args.BOLNo) : '';
            this.PRONo = refSystem.isObject(args) ? (args.PRONo) : '';
            this.TotalCostAdjustment = refSystem.isObject(args) ? (args.TotalCostAdjustment) : 0;
            this.TotalRevenueAdjustment = refSystem.isObject(args) ? (args.TotalRevenueAdjustment) : 0;
            this.Name = refSystem.isObject(args) ? (args.Name) : '';
            this.CompanyName = refSystem.isObject(args) ? (args.CompanyName) : '';
            this.FullName = refSystem.isObject(args) ? (args.FullName) : '';
            this.ReviewDateDisplay = refSystem.isObject(args) ? (args.ReviewDateDisplay) : '';
            this.ReviewedBy = refSystem.isObject(args) ? (args.ReviewedBy) : '';
            this.VendorBillId = refSystem.isObject(args) ? (args.VendorBillId) : 0;
        }
    }
}