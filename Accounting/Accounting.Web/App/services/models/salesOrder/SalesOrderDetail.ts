/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />

import refSystem = require('durandal/system');

/* File Created: Sep 9, 2014
** Created By: Satish
** <changeHistory>
** <id>US22419</id> <by>Shreesha Adiga</by> <date>30-05-2016</date> <description>Added FactorVendor and MASVendorId to display in details view</description>
** <id>US22054</id><by>Shreesha Adiga</by><date>03-06-2016</date><description>Add TariffStartDate, TariffStartDateDisplay, and TariffNumber</description>
** </changeHistory>
*/

export module Models {
	export class SalesOrderDetail {
		Id: number;
		CustomerId: number;
		BookedDate: Date;
		SalesOrderNo: number;
		PoNo: string;
		BolNumber: string;
		MainBolNo: string;
		ProNo: string;
		CustomerBolNo: string;
		BolID: number;
		SalesRepId: number;
		ReferenceNo: string;
		OriginZip: string;
		DestinationZip: string;
		TotalPieces: number;
		TotalWeight: number;
		Url: string;
		CarrierId: number;
		OrderStatusId: number;
		RequestedPickupDate: Date;
		PickupDate: Date;
		InvoiceDate: Date;
		ReadyTimeString: string;
		CloseTimeString: string;
		TransitDays: string;
		ShipmentBy: string;
		OriginTerminalPhone: string;
		DestinationTerminalPhone: string;
		ServiceType: number;
		EmergencyContactNo: string;
		EmergencyContactExtension: string;
		PickupRemarks: string;
		DeliveryRemarks: string;
		Cost: number;
		Revenue: number;
		CustomerName: string;
		SalesRepName: string;
		CarrierName: string;
		InvoiceStatus: number;
		UpdatedDateTime: number
		EstimatedDueDate: Date;
		VendorBillId: number;
		ActualCost: number;
		ActualProfit: number;
		ActualProfitPer: number;
		TotalCost: number;
		TotalRevenue: number;
		TotalPLCCost: number;
		ProcessStatusId: number;
		DeliveryDate: Date;
		InsuredAmount: number;
		AllowEDI204Dispatch: boolean;
		InsuranceNumber: number;
		IsEDISupport: boolean;
		GTMargin: number;
		PLCMargin: number;
		PLCVendorBillId: number;
		PlcCost: number;
		IsPROAllowed: boolean;
		CarrierPickupNumber: string;
		BillToLocationType: number;
		InternalBOL: string;
		NewShipmentType: number;
		ProcessFlowFlag: number;
		TariffType: string;
		OrderStatusList: Array<IEnumValue>;
		SelectedShipVia: number;
		ReadyTime: string;
		CloseTime: string;
		AgencyName: string;
		PartnerCompanyId: number;
		IsBillingStation: boolean;
		ProcessFlow: number;
		Distance: number;
		CarrierType: number;
		IsSaveEnable: boolean;
		OriginalRevenue: number;
		CanEditCarrier: boolean;
		CanEditCustomer: boolean;
		CanEditBSCOST: boolean;
		CanEditItemsDescription: boolean;
		CarrierCode: string;
		OriginalPLCCost: number;
		ContactName: string;
		CalendarDays: string;
		LTLCalendarDays: string;
		OceanCalendarDays: string;
		IsCalendarDaysNull: boolean;

		// ###START: DE21747
		ShipmentCarrierType: number;

		TariffStartDate: Date;
		TariffStartDateDisplay: string;
		TariffNumber: string;

		// ###END: DE21747

		// ##START: US22419
		FactorVendor: string;
		MASVendorId: string;
		// ##END: US22419

		constructor(args?: ISalesOrderDetail) {
			this.Id = refSystem.isObject(args) ? args.Id : 0;
			this.CustomerId = refSystem.isObject(args) ? args.CustomerId : 0;
			this.BookedDate = refSystem.isObject(args) ? args.BookedDate : new Date();
			this.SalesOrderNo = refSystem.isObject(args) ? args.SalesOrderNo : 0;
			this.PoNo = refSystem.isObject(args) ? args.PoNo : '';
			this.BolNumber = refSystem.isObject(args) ? args.BolNumber : '';
			this.MainBolNo = refSystem.isObject(args) ? args.MainBolNo : '';
			this.ProNo = refSystem.isObject(args) ? args.ProNo : '';
			this.CustomerBolNo = refSystem.isObject(args) ? args.CustomerBolNo : '';
			this.BolID = refSystem.isObject(args) ? args.BolID : 0;
			this.SalesRepId = refSystem.isObject(args) ? args.SalesRepId : 0;
			this.ReferenceNo = refSystem.isObject(args) ? args.ReferenceNo : '';
			this.OriginZip = refSystem.isObject(args) ? args.OriginZip : '';
			this.DestinationZip = refSystem.isObject(args) ? args.DestinationZip : '';
			this.TotalPieces = refSystem.isObject(args) ? args.TotalPieces : 0;
			this.TotalWeight = refSystem.isObject(args) ? args.TotalWeight : 0;
			this.Url = refSystem.isObject(args) ? args.Url : '';
			this.CarrierId = refSystem.isObject(args) ? args.CarrierId : 0;
			this.OrderStatusId = refSystem.isObject(args) ? args.OrderStatusId : 0;
			this.RequestedPickupDate = refSystem.isObject(args) ? args.RequestedPickupDate : new Date();
			this.PickupDate = refSystem.isObject(args) ? args.PickupDate : new Date();
			this.InvoiceDate = refSystem.isObject(args) ? args.InvoiceDate : new Date();
			this.CloseTimeString = refSystem.isObject(args) ? args.CloseTimeString : '';
			this.ReadyTimeString = refSystem.isObject(args) ? args.ReadyTimeString : '';
			this.TransitDays = refSystem.isObject(args) ? args.TransitDays : '';
			this.ShipmentBy = refSystem.isObject(args) ? args.ShipmentBy : '';
			this.OriginTerminalPhone = refSystem.isObject(args) ? args.OriginTerminalPhone : '';
			this.DestinationTerminalPhone = refSystem.isObject(args) ? args.DestinationTerminalPhone : '';
			this.ServiceType = refSystem.isObject(args) ? args.ServiceType : 0;
			this.EmergencyContactNo = refSystem.isObject(args) ? args.EmergencyContactNo : '';
			this.EmergencyContactExtension = refSystem.isObject(args) ? args.EmergencyContactExtension : '';
			this.PickupRemarks = refSystem.isObject(args) ? args.PickupRemarks : '';
			this.DeliveryRemarks = refSystem.isObject(args) ? args.DeliveryRemarks : '';
			this.Cost = refSystem.isObject(args) ? args.Cost : 0;
			this.Revenue = refSystem.isObject(args) ? args.Revenue : 0;
			this.CustomerName = refSystem.isObject(args) ? args.CustomerName : '';
			this.SalesRepName = refSystem.isObject(args) ? args.SalesRepName : '';
			this.CarrierName = refSystem.isObject(args) ? args.CarrierName : '';
			this.InvoiceStatus = refSystem.isObject(args) ? args.InvoiceStatus : 0;
			this.UpdatedDateTime = refSystem.isObject(args) ? args.UpdatedDateTime : 0;
			this.EstimatedDueDate = refSystem.isObject(args) ? args.EstimatedDueDate : new Date();
			this.VendorBillId = refSystem.isObject(args) ? args.VendorBillId : 0;
			this.ActualCost = refSystem.isObject(args) ? args.ActualCost : 0;
			this.ActualProfit = refSystem.isObject(args) ? args.ActualProfit : 0;
			this.ActualProfitPer = refSystem.isObject(args) ? args.ActualProfit : 0;
			this.TotalCost = refSystem.isObject(args) ? args.TotalCost : 0;
			this.TotalRevenue = refSystem.isObject(args) ? args.TotalRevenue : 0;
			this.TotalPLCCost = refSystem.isObject(args) ? args.TotalPLCCost : 0;
			this.ProcessStatusId = refSystem.isObject(args) ? args.ProcessStatusId : 0;
			this.DeliveryDate = refSystem.isObject(args) ? args.DeliveryDate : new Date();
			this.InsuredAmount = refSystem.isObject(args) ? args.InsuredAmount : 0;
			this.AllowEDI204Dispatch = refSystem.isObject(args) ? args.AllowEDI204Dispatch : false;
			this.InsuranceNumber = refSystem.isObject(args) ? args.InsuranceNumber : 0;
			this.IsEDISupport = refSystem.isObject(args) ? args.IsEDISupport : false;
			this.GTMargin = refSystem.isObject(args) ? args.GTMargin : 0;
			this.PLCMargin = refSystem.isObject(args) ? args.PLCMargin : 0;
			this.PLCVendorBillId = refSystem.isObject(args) ? args.PLCVendorBillId : 0;
			this.PlcCost = refSystem.isObject(args) ? args.PlcCost : 0;
			this.IsPROAllowed = refSystem.isObject(args) ? args.IsPROAllowed : false;
			this.CarrierPickupNumber = refSystem.isObject(args) ? args.CarrierPickupNumber : '';
			this.BillToLocationType = refSystem.isObject(args) ? args.BillToLocationType : 0;
			this.InternalBOL = refSystem.isObject(args) ? args.InternalBOL : '';
			this.NewShipmentType = refSystem.isObject(args) ? args.NewShipmentType : 0;
			this.ProcessFlowFlag = refSystem.isObject(args) ? args.ProcessFlowFlag : 0;
			this.TariffType = refSystem.isObject(args) ? args.TariffType : '';
			this.OrderStatusList = refSystem.isObject(args) ? args.OrderStatusList : null;
			this.SelectedShipVia = refSystem.isObject(args) ? args.SelectedShipVia : 0;
			this.AgencyName = refSystem.isObject(args) ? args.AgencyName : '';
			this.PartnerCompanyId = refSystem.isObject(args) ? args.PartnerCompanyId : 0;
			this.IsBillingStation = refSystem.isObject(args) ? args.IsBillingStation : false;
			this.Distance = refSystem.isObject(args) ? args.Distance : 0;
			this.CarrierType = refSystem.isObject(args) ? args.CarrierType : 0;
			this.IsSaveEnable = refSystem.isObject(args) ? args.IsSaveEnable : true;
			this.OriginalRevenue = refSystem.isObject(args) ? args.OriginalRevenue : 0;
			this.IsSaveEnable = refSystem.isObject(args) ? args.IsSaveEnable : true;
			this.CanEditCarrier = refSystem.isObject(args) ? args.CanEditCarrier : true;
			this.CanEditCustomer = refSystem.isObject(args) ? args.CanEditCustomer : true;
			this.CanEditBSCOST = refSystem.isObject(args) ? args.CanEditBSCOST : true;
			this.CanEditItemsDescription = refSystem.isObject(args) ? args.CanEditItemsDescription : true;
			this.CarrierCode = refSystem.isObject(args) ? args.CarrierCode : '';
			this.OriginalPLCCost = refSystem.isObject(args) ? args.OriginalPLCCost : 0;
			this.ContactName = refSystem.isObject(args) ? args.ContactName : '';
			this.CalendarDays = refSystem.isObject(args) ? args.CalendarDays : '';
			this.LTLCalendarDays = refSystem.isObject(args) ? args.LTLCalendarDays : '';
			this.OceanCalendarDays = refSystem.isObject(args) ? args.OceanCalendarDays : '';
			this.IsCalendarDaysNull = refSystem.isObject(args) ? args.IsCalendarDaysNull : false;
			// ###START: DE21747
			this.ShipmentCarrierType = refSystem.isObject(args) ? args.ShipmentCarrierType : 0;
			// ###END: DE21747

			// ##START: US22419
			this.FactorVendor = refSystem.isObject(args) ? args.FactorVendor : '';
			this.MASVendorId = refSystem.isObject(args) ? args.MASVendorId : '';
			// ##END: US22419
		
			// ##START: US22054
			this.TariffStartDate = refSystem.isObject(args) ? args.TariffStartDate : null;
			this.TariffStartDateDisplay = refSystem.isObject(args) ? args.TariffStartDateDisplay : '';
			this.TariffNumber = refSystem.isObject(args) ? args.TariffNumber : '';
			// ##START: US22054
		}
	}
}