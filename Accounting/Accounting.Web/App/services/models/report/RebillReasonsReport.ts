/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/Report.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />

import refSystem = require('durandal/system');

/*
** <summary>
** Model for Rebill Reasons Report.
** </summary>
** <changeHistory>
** <id>US23608</id> <by>Dhaval Tamhane</by> <date>05-08-2016</date><description>Added new fields.</description>
** </changeHistory>
*/

export module Models {
	export class RebillReasonsReport {
		ShipmentId: number;
		VendorBillId: number;
		BOLNumber: string;
		ProNumber: string;
		PickupDate: Date;
		CompanyName: string;
		EstimatedCost: number;
		ActualCost: number;
		CostDifference: number;
		EstimatedRevenue: number;
		ActualRevenue: number;
		FinalRevenue: number;
		Carrier: string;
		ReasonForRebill: string;
		PickupDateDisplay: string;
		// ###START: US23608
		OriginZip: string;
		DestinationZip: string;
		OriginAddress: string;
		DestinationAddress: string;
		ShipperName: string;
		ConsigneeName: string;
		DeliveryDate: Date;
		DeliveryDateDisplay: string;
		// ###END: US23608

		constructor(args?: IRebillReasonsReport) {
			this.ShipmentId = refSystem.isObject(args) ? (args.ShipmentId) : 0;
			this.VendorBillId = refSystem.isObject(args) ? (args.VendorBillId) : 0;
			this.BOLNumber = refSystem.isObject(args) ? (args.BOLNumber) : '';
			this.ProNumber = refSystem.isObject(args) ? (args.ProNumber) : '';
			this.Carrier = refSystem.isObject(args) ? (args.Carrier) : '';
			this.PickupDate = refSystem.isObject(args) ? (args.PickupDate) : new Date();
			this.CompanyName = refSystem.isObject(args) ? (args.CompanyName) : '';
			this.EstimatedCost = refSystem.isObject(args) ? (args.EstimatedCost) : 0;
			this.ActualCost = refSystem.isObject(args) ? (args.ActualCost) : 0;
			this.CostDifference = refSystem.isObject(args) ? (args.CostDifference) : 0;
			this.EstimatedRevenue = refSystem.isObject(args) ? (args.EstimatedRevenue) : 0;
			this.ActualRevenue = refSystem.isObject(args) ? (args.ActualRevenue) : 0;
			this.FinalRevenue = refSystem.isObject(args) ? (args.FinalRevenue) : 0;
			this.Carrier = refSystem.isObject(args) ? (args.Carrier) : '';
			this.ReasonForRebill = refSystem.isObject(args) ? (args.ReasonForRebill) : '';
			this.PickupDateDisplay = refSystem.isObject(args) ? (args.PickupDateDisplay) : '';
			// ###START: US23608
			this.OriginZip = refSystem.isObject(args) ? (args.OriginZip) : '';
			this.DestinationZip = refSystem.isObject(args) ? (args.DestinationZip) : '';
			this.OriginAddress = refSystem.isObject(args) ? (args.OriginAddress) : '';
			this.DestinationAddress = refSystem.isObject(args) ? (args.DestinationAddress) : '';
			this.ShipperName = refSystem.isObject(args) ? (args.ShipperName) : '';
			this.ConsigneeName = refSystem.isObject(args) ? (args.ConsigneeName) : '';
			this.DeliveryDate = refSystem.isObject(args) ? (args.DeliveryDate) : new Date();
			this.DeliveryDateDisplay = refSystem.isObject(args) ? (args.DeliveryDateDisplay) : '';
			// ###END: US23608
		}
	}
}