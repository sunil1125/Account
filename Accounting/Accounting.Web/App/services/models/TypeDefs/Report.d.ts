/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="CommonModels.d.ts" />

/* File Created: July 11, 2014
** Created By: Achal Rastogi
*/

/*
** <changeHistory>
** <id>US19722</id> <by>Shreesha Adiga</by> <date>29-12-2015</date> <description>Added Edi210DetailId, ExceptionRuleId, BatchId for redirecting to EDI from tracking report</description>
** <id>US23608</id> <by>Dhaval Tamhane</by> <date>05-08-2016</date><description>Added new fields for rebill reasons report.</description>
** <id>US26560</id> <by>Baldev Singh Thakur</by> <date>20-02-2017</date> <description>Added SearchColumn property under IBoardReportRequest.</description>
** </changeHistory>
*/
interface IVendorBillTrackingReport {
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
	ConsigneeCompanyName: string;
	ShipperCompanyName: string;
	ReviewNotes: string;
	DisputeNote: string;
	EstimatedCost: number;
	EstimatedRevenue: number;

	DateVendorClosingBillPaid: string;
	DateVendorBillStatusChanged: string;

	Edi210DetailId: number;
	ExceptionRuleId: number;
	BatchId: number;
}

interface IVendorBillExceptionReport {
	Exception: string;
	VendorBillId: number;
	ProNumber: string;
	BolNumber: string;
	Carrier: string;
	CarrierCode: string;
	MassId: string;
	VBAmount: number;
	DisputedAmount: number
	VBBillStatus: string;
}
interface IDisputeBoardDetailsReport {
	VendorBillId: number;
	VendorName: string;
	CarrierID: number;
	BillDate: Date;
	DueDate: Date;
	PRONumber: string;
	PONumber: string;
	BOLNumber: string;
	MainVendorBOLNumber: string;
	Amount: number;
	DisputedAmount: number;
	OriginZip: string;
	DestinationZip: string;
	CreatedDate: Date;
	UpdatedBy: number;
	UpdatedDate: number;
	TotalPieces: number;
	TotalWeight: number;
	DeliveryDate: Date;
	DisputedDate: Date;
	ProcessDetails: string;
	ReferenceNo: string;
	VendorBillStatus: string;
	DisputeNote: string;
	TotalEstimateCost: number;
	BillDateDisplay: string;
	DisputedDateDisplay: string;
}


interface IBoardReportRequest {
	VendorName: string;
	ProNumber: string;
	PageNumber: number;
	PageSize: number;
	FromDate: Date;
	ToDate: Date;
	RebillRepName: string;
	GridSearchText: string;
	SearchColumn: string;
}

interface IFinalizedOrderWithNoVendorBills {
	Id: number;
	BOLNumber: string;
	ProNumber: string;
	ShipmentDate: Date;
	Cost: number;
	CustomerId: number;
	Customer: string;
	Shipper: string;
	TotalPieces: number;
	TotalWeight: number;
	Carrier: string;
	OriginZip: string;
	OriginCity: string;
	OriginState: string;
	DestinationZip: string;
	DestinationCity: string;
	DestinationState: string;
	SalesRepName: string;
	PartnerCompanyName: string;
	CustomerTermType: string;
	ShipmentDateDisplay: string;
	Mode: string;
}

interface ISalesOrderFinalizedNotInvoiced {
	Id: number;
	BOLNumber: string;
	ProNumber: string;
	FinalizedDate: Date;
	Revenue: number;
	Customer: string;
	RepName: string;
	CustomerID: number;
	SOCreatedDate: Date;
	PickupDate: Date;
	ProcessFlow: number;
	CustomerTermType: string;
	CarrierName: string;
	ProcessStatusDisplay: string;
	BillStatusDisplay: string;
	InvoiceStatusDisplay: string;
	FinalizedDateDisplay: string;
	PickupDateDisplay: string;
	SOCreatedDateDisplay: string;
	Mode: string;
}

interface IRexnordInvoicingReport {
	Id: number;
	BOLNumber: string;
	InvoiceDate: Date;
	BranchId: number;
	ShipmentType: number;
	Cost: number;
	Revenue: number;
	InvoiceDateDisplay: string;
	BranchName: string;
	ShipmentTypeDisplay: string;
}

interface IRebillSummaryReport {
	VendorBillId: number;
	VendorBillProNo: string;
	SalesOrder: string;
	VBCarrier: string;
	BillStatus: string;
	BillStatusValue: number;
	PickupDate: string;
	CustomerId: number;
	LoginName: string;
	CompanyName: string;
	OldWeight: number;
	NewWeight: number;
	OldCost: number;
	NewCost: number;
	SalesRepId: number;
	SalesRep: string;
	RequoteDate: Date;
	ShipmentNotes: string;
	DisputeNotes: string;
	RequoteNotes: string;
	Name: string;
	RequoteDateDisplay: string;
}

interface IDisputedVendorBills {
	ShipmentId: number;
	VendorBillId: number;
	BOLNumber: string;
	ProNumber: string;
	Carrier: string;
	Customer: string;
	SalesRepNumber: string;
	SalesRep: string;
	EstimatedCost: number;
	ActualCost: number;
	DisputedDate: Date;
	InternalDisputeDate: Date;
	DisputedAmount: number;
	VendorBillDate: Date;
	APDisputeNote: string;
	CRRDispNote: string;
	DisputedBy: string;
	DisputedDateDisplay: string;
	InternalDisputeDateDisplay: string;
	VendorBillDateDisplay: string;
}

interface IRebillReasonsReport {
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
}

interface IUploadReportsFileDetails {
	CarrierId: number;
	CarrierName: string;
	StatementFileDetails: any;
	DisputeReportFileDetails: any;
	MASReportFileDetails: any;
	ReConsolidatedFileDetails: any;
	ScheduleDate: Date;
}

interface IOrderRebillReport {
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
}

interface IWeeklyDashboardSummary {
	ShipmentType: string;
	LtlCount: number;
	TotalWeight: number;
	TotalCost: number;
	ChargePerWeight: number;
}