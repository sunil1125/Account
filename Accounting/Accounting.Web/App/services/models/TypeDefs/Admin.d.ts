/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="CommonModels.d.ts" />

interface ICompanyOnlinePaymentDetails {
	CCProcessCharge: number;
	ECheckProcessCharge: number;
	CCVisibility: boolean;
	ECheckVisible: boolean;
	CCMessage: string;
	ECheckMessage: string;
	DebitVisibility: boolean;
	DebitMessage: string;
	CustomerId: number;
	DiscountDueDays: number;
	EntityType: number;
	EntityId:number;
}

interface ICustomerTariff {
	CustomerId: number;
	LiftGateFee: number;
	ResidentialFee: number;
}

interface IComparisonTolerance {
	ID: number;
	Description: string;
	ToleranceAmount: number;
	CustomerType: number;
	ToleranceType: IEnumValue;
	UpdatedBy: number;
}

interface IComparisonToleranceItems {
	ID: number;
	ToleranceID: number;
	ItemMasId: number;
	ItemDescription: string;
	UpdatedBy: number;
}

interface IComparisonToleranceContainer{
	ComparisonTolerance: Array<IComparisonTolerance>;
	ComparisonToleranceItems: Array<IComparisonToleranceItems>;
	CustomerTariff: ICustomerTariff;
}