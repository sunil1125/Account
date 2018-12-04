/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="CommonModels.d.ts" />

/* File Created: Sep 12, 2014
** Created By: Satish
*/

interface ITransactionSearchResponse {
	SalesOrderResponse: Array<ITransactionSearchSalesOrderResponse>;
	VendorBillOrPurchaseOrderResponse: Array<ITransactionSearchVendorBillOrPurchaseOrderResponse>;
	InvoicesResponse: Array<ITransactionSearchInvoicesResponse>;
	TruckloadQuoteResponse: Array<ITransactionSearchTruckloadQuoteResponse>;
	NumberOfRows: number;
}

interface ITransactionSearchRequest{
	TransactionSearchType: number;
	Amount: number;
	OrderStatus: number;
	BolNumber: string;
	ShipperCompanyName: string;
	ConsigneeCompanyName: string;
	VendorName: string;
	CarrierServiceMode: number;
	NewShipmentType: number;
	PoNumber: string;
	ShipperCity: string;
	ConsigneeCity: string;
	SalesRepName: string;
	SalesRepId: number;
	ShipperZipCode: string;
	ConsigneeZipCode: string;
	CustomerBolNumber: string;
	ProNumber: string;
	ItemNumbers: string;
	CustomerName: string;
	TruckloadQuoteNumber: string;
	InvoiceStatus: number;
	ReferenceNumber: string;
	TotalWeight: number;
	TotalPiece: number;
	DateType: number;
	FromDate: Date;
	ToDate: Date;
	PageSize: number;
	PageNumber: number;
	SortCol: string;
	SortOrder: string;
	IsPurchaseOrder: number;
	CompanyName: string;
}

interface ITransactionSearchSalesOrderResponse{
	Id: number;
	BolNumber: string;
	CustomerBolNumber: string;
	ProNumber: string;
	Vendor: string;
	Revenue: number;
	ShipperCompName: string;
	ConsigneeCompName: string;
	ShipperZipCode: string;
	ConsigneeZipCode: string;
	ServiceType: string;
	TotalWeight: number;
	TotalPieces: number;
	ProcessStatus: number;
	InvoiceStatus: number;
	PickupDate: string;
	Customer: string;
	RequoteStatus: number;
	ProcessFlow: number;
	PickupDateDisplay: string;
	ProcessStatusDisplay: string;
	InvoiceStatusDisplay: string;
}

interface ITransactionSearchVendorBillOrPurchaseOrderResponse{
    Id: number;
    SalesOrderId: number;
    BolNumber: string;
    CustomerBolNumber: string;
    ProNumber: string;
    Vendor: string;
    Revenue: number;
    ShipperCompanyName: string;
    ConsigneeCompanyName: string;
    ShipperZipCode: string;
    ConsigneeZipCode: string;
    BillDate: Date;
    BillStatusDisplay: string;
    ProcessFlow: boolean;
    BillDateDisplay: string
    IsPurchaseOrder: boolean;
}

interface ITransactionSearchStatusEnumHolder{
	TransactionSearchType: IEnumValue;
	OrderStatus: IEnumValue;
	CarrierServiceType: IEnumValue;
	InvoiceStatus: IEnumValue;
	VendorBillStatus: IEnumValue;
}

interface ITransactionSearchInvoicesResponse{
	Id: number;
	BolNumber: string;
	CustomerBolNumber: string;
	ProNumber: string;
	Vendor: string;
	Revenue: number;
	ShipperCompName: string;
	ConsigneeCompName: string;
	ShipperZipCode: string;
	ConsigneeZipCode: string;
	ServiceType: string;
	TotalWeight: number;
	TotalPieces: number;
	PickupDate: Date;
	Customer: string;
	PickupDateDisplay: string;
}

interface ITransactionSearchTruckloadQuoteResponse{
	Id: number;
	QuoteNumber: number;
	BolNumber: string;
	Customer: string;
	Agent: string;
	Carrier: string;
	TruckType: string;
	TruckLength: number;
	LinearFeet: string;
	ServiceType: string;
	Tarps: boolean;
	OriginZipCode: string;
	OriginCity: string;
	OriginState: string;
	DestinationZipCode: string;
	DestinationCity: string;
	DestinationState: string;
	Status: string;
	Distance: number;
	Comments: string;
	Revenue: number;
	TotalCost: number;
	LoadBookedId: number;
	LoadRequestID: number;
}