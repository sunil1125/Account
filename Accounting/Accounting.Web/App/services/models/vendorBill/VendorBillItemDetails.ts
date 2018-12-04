/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../TypeDefs/VendorBillModels.d.ts" />

/* File Created: April 14, 2014
** Created By: Avinash Dubey
*/

export module Models {
	export class VendorBillItemDetails {
		Id: number;
		VendorBillId: number;
		SelectedClassType: number;
		OriginalWeight: number;
		Weight: number;
		EstimatedCost: number;
		Cost: number;
		Hazardous: number;
		DimensionLength: number;
		DimensionWidth: number;
		DimensionHeight: number;
		PieceCount: number;
		OriginalPalletCount: number;
		NewPalletCount: number;
		PackageTypeName: string;
		NMFCNumber: string;
		UserDescription: string;
		ItemId: number;
		ItemName: string;
		AccessorialId: number;
		AccessorialCode: string;
		SelectedItemTypes: IShipmentItemType;
		PackageTypes: IEnumValue;
		ClassTypes: IEnumValue;
		IsMarkForDeletion: boolean;
		IsShippingItem: boolean;
		SelectedPackageType: IEnumValue;
		PackageTypeId: number;
		DisputeAmount: number;
		DisputeLostAmount: number;
		isChecked: boolean;
		isUpdated: boolean;
		IsBackupCopy: number;
		ReasonNote: string;
		SelectedReasonCodes: ISalesOrderShipmentRequoteReason;
		Difference: number;
		SpecialChargeOrAllowanceCode: string;
		constructor(args?: IVendorBillItem) {
			if (args) {
				this.Id = args.Id;
				this.VendorBillId = args.VendorBillId;
				this.SelectedClassType = args.SelectedClassType;
				this.OriginalWeight = args.Weight;
				this.Weight = args.Weight;
				this.EstimatedCost = args.EstimatedCost;
				this.Cost = args.Cost;
				this.Hazardous = args.Hazardous;
				this.DimensionLength = args.DimensionLength;
				this.DimensionWidth = args.DimensionWidth;
				this.DimensionHeight = args.DimensionHeight;
				this.PieceCount = args.PieceCount;
				this.OriginalPalletCount = args.OriginalPalletCount;
				this.NewPalletCount = args.NewPalletCount;
				this.PackageTypeName = args.PackageTypeName;
				this.NMFCNumber = args.NMFCNumber;
				this.UserDescription = args.UserDescription;
				this.ItemId = args.ItemId;
				this.ItemName = args.ItemName;
				this.AccessorialId = args.AccessorialId;
				this.AccessorialCode = args.AccessorialCode;
				this.SelectedItemTypes = args.SelectedItemTypes;
				this.PackageTypes = args.PackageTypes;
				this.ClassTypes = args.ClassTypes;
				this.IsMarkForDeletion = args.IsMarkForDeletion;
				this.IsShippingItem = args.IsShippingItem;
				this.SelectedPackageType = args.SelectedPackageType;
				this.PackageTypeId = args.PackageTypeId;
				this.DisputeAmount = args.DisputeAmount;
				this.DisputeLostAmount = args.DisputeLostAmount;
				this.isChecked = args.isChecked
				this.isUpdated = args.isUpdated;
				this.IsBackupCopy = args.IsBackupCopy;
				this.ReasonNote = args.ReasonNote;
				this.SelectedReasonCodes = args.SelectedReasonCodes;
				this.Difference = args.Difference;
				this.SpecialChargeOrAllowanceCode = args.SpecialChargeOrAllowanceCode;
			}
		}
	}
}