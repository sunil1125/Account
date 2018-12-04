/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />

/* File Created: July 11, 2014
** Created By: Bhanu pratap
*/

export module Models {
	export class VendorBillHistoryOldItems {
		Description: string;
		Cost: string;
		Dispute: number;
		DisputeLost: number;
		Class: string;
		Weight: number;
		Length: number;
		Height: number;
		Width: number;
		Pieces: number;
		Pallet: number;
		NMFC: string;
		ChangedBy: string;

		constructor(args?: IVendorBillHistoryItems) {
			if (args) {
				this.Description = args.Description;
				this.Cost = args.Cost;
				this.Dispute = args.Dispute;
				this.DisputeLost = args.DisputeLost;
				this.Class = args.Class;
				this.Weight = args.Weight;
				this.Length = args.Length;
				this.Height = args.Height;
				this.Width = args.Width;
				this.Pieces = args.Pieces;
				this.Pallet = args.Pallet;
				this.NMFC = args.NMFCNumber;
				this.ChangedBy = args.ChangedBy;
			}
		}
	}
}