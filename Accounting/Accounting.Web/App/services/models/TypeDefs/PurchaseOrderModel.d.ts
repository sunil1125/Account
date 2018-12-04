/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="CommonModels.d.ts" />

interface IPoPossibilitySearchResponse {
	PoPossibilityResponse: Array<IPOPossibility>;
	NumberOfRows: number;
}

interface IPOPossibility {
	ID: number;
	BOL: string;
	PRO: string;
	PickUpDate: Date;
	CarrierName: string;
	OriginZip: string;
	DestinationZip: string;
	PONumber: string;
	ReferenceNo: string;
	Shipper: string;
	Consignee: string;
	Customer: string;
	Remarks: string;
	PickupDateDisplay: string;
	ShipmentId: number;
}

interface IPoPossibilityFindMoreRequest {
	VendorName: string;
	ProNumber: string;
	BolNumber: string;
	PoNumber: string;
	ReferenceNumber: string;
	PickUpFromDate: Date;
	PickUpToDate: Date;
	ShipperZipCode: string;
	ConsigneeZipCode: string;
	PageNumber: number;
	PageSize: number;
}

interface IPurchaseOrder {
	VendorBillId: number;
	VendorName: string;
	CarrierId: number;
	BillDate: Date;
	DueDate: Date;
	ProNumber: string;
	PoNumber: string;
	BolNumber: string;
	MainVendorBolNumber: string;
	Terms: string;
	Memo: string;
	Amount: number;
	TotalCost: number;
	TotalRevenue: number;
	DisputedAmount: number;
	OriginZip: string;
	DestinationZip: string;
	BillStatus: number;
	ActualCost: number;
	ActualProfit: number;
	IsPurchaseOrder: boolean;
	CreatedDate: Date;
	UpdatedBy: number;
	UpdatedDate: number;
	TotalPieces: number;
	TotalWeight: number;
	DeliveryDate: Date;
	DisputedDate: Date;
	ProcessDetails: string;
	ReferenceNumber: string;
	IDBFlag: boolean;
	ProcessFlow: number;
	PickupDate: Date;
	fromPickupDate: Date;
	toPickupDate: Date;
	SalesOrderId: number;
	MakeInactive: boolean;
	ForceAttach: boolean;
	QuickPay: boolean;
	HoldVendorBill: boolean;
	MasTransferDate: Date;
	DisputeNotes: string;
	IsPurchaseOrderWithBOL: boolean;
	UpdatePRONumberInShipment: boolean;
	IsVendorBillChanged: boolean;
	IsUserWantToShortPay: boolean
	OriginalCost: number;
	BillingStatuses: Array<IEnumValue>;
	MasClearingStatusList: Array<IEnumValue>;
	IsMasStatusVisible: boolean;
	IsBillForcePushToMas: boolean;
	IsPresentInIntermediate: boolean;
	IsPresentInMasPermanent: boolean;
	OriginalBOLNumber: string;
	IsValidationApplicableOnDisputeItems: boolean;
}

interface IPOPossibilitySaveParameter {
	VendorBillId: number;
	SalesOrderId: Array<any>;
}

// <changeHistory>
// <id>US22796</id> <by>Baldev Singh Thakur</by> <date>16-06-2016</date> <description>Added a new bool Property IsTruckLoadChecked</description>
// </changeHistory>
interface IPOToSOParameter {
	VendorBillId: number;
	CurrentUser: string;
	CarrierId: number;
	ProNumber: string;
	AgencyId: number;
	AgentId: number;
	CustomerId: number;
	Term: string;
	AvailableCredit: string;
	PickupDate: Date;
	// ###START: US22796
	IsTruckLoadChecked: boolean;
	CustomerName: string;
	// ###END: US22796
}

interface IPOtoSoContainer {
	VendorBillContainer: IVendorBillContainer;
	PoToSoDetails: IPOToSOParameter
}

interface IForeignBolAddress{
    ID: number;
    CustomerId: number;
    CompanyName: string;
    Address1: string;
    Address2: string;
    City: string;
    State: string;
    ZipCode: string;
    AddressType: number;
    CountryCode: number;
    CanEdit: boolean;
    IsEditVisible: boolean;
    AddressTypeDisplay: string;
    UpdatedDate: number;
    VendorBillId: number;
}

interface IForeignBolSettings{
	CustomerId: number;
	CustomerName: string;
	EdiBolLength: number;
	IsEdiBolMapped: boolean;
	IsBillToAddressMapped: boolean;
	IsShipperAddressMapped: boolean;
    IsConsigneeMapped: boolean;
    IsBOLStartWithCharacter: boolean;
	ForeignBolAddressList: Array<IForeignBolAddress>
	UpdatedDate: number;
	IsShipperConsigneeAddressMapped: boolean;
}

interface IForeignBolCustomer{
	CustomerId: number;
	CustomerName: string;
	AgencyName: string;
	Criteria: string;
}

interface IForeignBolContainer{
	TotalRowCount: number;
	CustomerList: Array<IForeignBolCustomer>;
}

interface IForeignBolAddressesContainer{
	ForeignBolAddressesList: Array<IForeignBolAddress>;
}

interface IPurchaseOrderReasonCode {
	Id: number;
	Description: string;
	DeletedBy: number;
	AddedBy: number;
}