/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../vendorBill/VendorBillContainer.ts" />
interface IDisputeBoardWonLoss {
	VendorBillId: number;
	PRONumber: string;
	BOLNumber: string;
	BillDate: Date;
	PickUpDate: Date;
	CustomerName: string;
	CustomerId: number;
	VendorName: string;
	CarrierId: number;
	AgentName: string;
	ActualCost: number;
	DisputedAmount: number;
	DisputedWon: number;
	DisputedLost: number;
	DisputeDate: Date;
	BillStatusDisplay: string;
	Remarks: string;
	Mode: string;
}

interface IDisputeBoardDetails {
	VendorBillId: number;
	PRONumber: string;
	BOLNumber: string;
	BillDate: Date;
	PickUpDate: Date;
	CustomerName: string;
	CustomerId: number;
	VendorName: string;
	CarrierId: number;
	AgentName: string;
	ActualCost: number;
	DisputedAmount: number;
	DisputedWon: number;
	DisputedLost: number;
	DisputeDate: Date;
	DisputeNote: string;
	DisputeAgent: string;
	BillStatusDisplay: string;
	Remarks: string;
	Mode: string;
}
interface IDisputedBillLoadParameter {
	FromDate: Date;
	ToDate: Date;
	PageNumber: number;
	PageSize: number;
}

interface IForceInvoiceShipment {
	ForceInvoiceReason: string;
	BatchId: number;
	BOLNo: string;
	ShipmentId: number;
	IsBatch: boolean;
	BatchShipmentIds: string;
	UpdateDateTime: number;
}

interface IEdi210DuplicateExceptionDetailsContainer {
	Edi210DuplicateExceptionCarrierDetails: IEdi210DuplicateExceptionCarrierDetails;
	Edi210DuplicateExceptionDetails: Array<IEdi210DuplicateExceptionDetails>;
}

interface IEdi210DuplicateExceptionDetails {
	ID: number;
	ProNumber: string;
	CarrierId: number;
	NetAmountDue: string;
	BOLNo: string;
}

interface IEdi210DuplicateExceptionCarrierDetails {
	ID: number;
	CarrierName: string;
	CarrierID: number;
	BOLNumber: string;
	ProNumber: string;
	BillDate: string;
	PO: string;
	EDIBol: string;
	ReferenceNo: string;
	ShipmentID: number;
	ProcessStatusDisplay: string;
	VBStatusDisplay: string;
	VendorBillId: number;
}

interface IEDI210ExceptionDetailsItems {
	ID: number;
	Item: string;
	Description: string;
	Cost: string;
	Class: string;
	Weight: number;
	Length: number;
	Pieces: number;
	Height: number;
	Width: number;
}

interface IEDI210ExceptionDetailsContainer {
	Edi210DuplicateExceptionCarrierDetails: IEdi210DuplicateExceptionCarrierDetails;
	EDI210ExceptionDetailsItems: Array<IEDI210ExceptionDetailsItems>;
}

interface IGenerateVendorBillContainer {
	VenderBillDuplicateContainer: IVendorBillContainer;
	VenderBillOriginalContainer: IVendorBillContainer;
	ExceptionDetailsMetaSource: IEdi210DuplicateExceptionCarrierDetails;
}

interface IUpdateDuplicatePRO {
	BatchId: number;
	EDIDetailID: number;
	IsActive: boolean;
	Edi210ItemUnmappedCodeMapping: Array<IEdi210ItemUnmappedCodeMapping>;
}

interface IEDI210Inputparameter {
	VendorBillDuplicateData: IVendorBillContainer;
	OriginalVBProNumber: string;
	OriginalVBMainBolNumber: string;
	EdiDetailsId: number;
}

interface IItemCodeDescriptionStandardMappings {
	ID: number;
	ItemId: number;
	Description: string;
	AccessorialID: number;
	Code: string;
	IsNew: boolean;
	CarrierID: number;
}

interface IEdi210ItemUnmappedCodeMapping {
    ID: number;
    Item: string;
    Description: string;
    Cost: number;
    Class: string;
    Weight: number;
    Length: string;
    Pieces: string;
    Height: string;
    Width: string;
    MappedCode: string;
}

interface IRequoteProcessDetails {
    Id: number;
    ShipmentId: number;
    BolNumber: string;
    ProNo: string;
    ShipmentCost: number;
    VBCost: number;
    TotalVBCost: number;
    CostDifference: number;
    VBCarrierName: string;
    Revenue: number;
    ShipmentMode: number;
    AgeingDate: string;
    IsManualProcess: boolean;
    IsAutomateProcess: boolean;
    ShipmentModeDescription: string;
}