/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="CommonModels.d.ts" />

/* File Created: May 05, 2014
** Created By: Sankesh Poojari
*/

interface IVendorBillSearchContainer {
	VendorBillQuickSearch: IVendorBillQuickSearch;
	VendorBillSearchResult: IVendorBillSearchResult;
}

interface IVendorBillQuickSearch {
	VendorName: string;
	ProNumber: string;
	BolNumber: string;
	PoNumber: string;
	FromDate: Date;
	ToDate: Date;
	RoleId: number;
	PageNumber: number;
	PageSize: number;
	PagesFound: number;
	ProcessStatus: number;
	SortField: string;
	SortOrder: string;
	IsPurchaseOrder: number;
}

interface IVendorBillSearchParameter {
	ItemID: string;
	VendorName: string;
	FromDate: Date;
	ToDate: Date;
	Amount: number;
	ProcessStatus: number;
	CustomerBol: string;
	ProNumber: string;
	BolNumber: string;
	ShipperComName: string;
	ConsigneeCompName: string;
	ShipperZipCode: string;
	ConsigneeZipcode: string;
	CustomerName: string;
	UserId: number;
	RoleId: number;
	PageNumber: number;
	PageSize: number;
	PagesFound: number;
	PoNumber: string;
	RefNumber: string;
	ShipperCity: string;
	ConsigneeCity: string;
	TotalWeight: number;
	TotalPieces: number;
	DateRange: number;
}

interface IVendorBillSearchResult {
    Id: number;
    ShipmentId: number;
	BolNumber: string;
	CustomerBolNumber: string;
	ProNumber: string;
	Vendor: string
	Revenue: number;
	ShipCompanyName: string;
	ConsigneeCompName: string;
	ShipperZipCode: string;
	ConsigneeZipCode: string;
	TransactionType: string;
	BillDate: Date;
	BillStatus: string;
	ProcessFlowFlag: number;
	ProcessFlow: boolean;
}

interface IVendorBillSearchFilter {
	SearchText: string;
	Operand: number;
	FieldName: string;
}