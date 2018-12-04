/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created: April 4, 2013 */
/* Created By Sankesh Poojari*/
/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../../../../Scripts/utils.ts" />

/*
** <summary>
** Common enums for all common method
** </summary>
** <createDetails>
** <id></id> <by></by> <date></date>
** </createDetails>
** <changeHistory>
** <id>US25277</id> <by>Baldev Singh Thakur</by><date>19-10-2016</date><description>Added Credit Reason Enums</description>
** <id>US25679</id> <by>Baldev Singh Thakur</by><date>11-11-2016</date><description>Added new reason 'Split Absorb' in Credit Reason Enums</description>
** <id>US25685</id> <by>Shreesha Adiga</by><date>18-11-2016</date><description>Added enum for Vendor Bill Reassignment</description>
** <id>US29069</id> <by>Baldev Singh Thakur</by> <date>05-06-2017</date> <description>Added new Dispute Status Pending OVC Check</description>
** </changeHistory>
*/
export module Enums {
	export var vendorBillOptionConstant: IVendorBillOptionConstant = Object.freeze({
		MakeInactive: 1,
		FroceAttach: 2,
		Quickpay: 3,
		HoldVendorBill: 4,
		Reviewed: 5,
		FAKMapping: 6,
		ForeignBolMapping: 7
	});

	export var onlinePaymentOptionConstant: IOnlinePaymentOptionConstant = Object.freeze({
		AllowCC: 1,
		AllowECheck: 2,
		AllowDebitCard: 3
	});

	export var TabType: ITabType = Object.freeze({
		RateTab: { Id: 0, imageUrl: 'Content/images/tabicon_rate.png' },
		GridTab: { Id: 1, imageUrl: 'Content/images/tabicon_grid.png' },
		DocumentTab: { Id: 2, imageUrl: 'Content/images/tabicon_doc.png' },
		NormalTab: { Id: 3 }
	});

	export var CountryCode: ICountryCode = Object.freeze({
		USA: { ID: 1, value: 'USA' },
		Canada: {},
		China: {},
		Mexico: {}
	});

	export var AddressType: IAddressTypeOption = Object.freeze({
		Origin: { ID: 1, value: 'Origin' },
		Destination: { ID: 2, value: 'Destination' },
		BillTo: { ID: 3, value: 'BillTo' },
		ThirdPartyBillTo: { ID: 4, value: 'ThirdPartyBillTo' },
		TerminalOrigin: { ID: 5, value: 'TerminalOrigin' },
		TerminalDestination: { ID: 6, value: 'TerminalDestination' },
		ExelFreightForwarder: { ID: 7, value: 'ExelFreightForwarder' },
		OceanFreightForwarder: { ID: 8, value: 'OceanFreightForwarder' },
		LTLFreightForwarder: { ID: 9, value: 'LTLFreightForwarder' },
	});

	export var OrderStatus: IOrderStatus = Object.freeze({
		Pending: { ID: 0, Value: "Pending" },
		AutoDispatch: { ID: 1, Value: "Auto Dispatch" },
		ManualDispatch: { ID: 2, Value: "Manual Dispatch" },
		ManuallyFinalized: { ID: 3, Value: "Manual Finalized" },
		AutoFinalized: { ID: 4, Value: "Auto Finalized" },
		WaitingForVB: { ID: 5, Value: "Waiting for VB" },
		ReQuote: { ID: 6, Value: "Requote" },
		Canceled: { ID: 7, Value: "Canceled" },
		Dispute: { ID: 8, Value: "Dispute" },
		Manager_Approval_Needed: { ID: 9, Value: "Manager Approval Needed" },
		Rep_Approval_Needed: { ID: 10, Value: "Rep Approval Needed" },
		Delivered: { ID: 11, Value: "Delivered" },
		Delayed: { ID: 12, Value: "Delayed" },
		Pickup: { ID: 13, Value: "Pickup" },
		Accept: { ID: 14, Value: "Accept" },
		Deny_1: { ID: 15, Value: "Deny 1" },
		Deny_2: { ID: 16, Value: "Deny 2" },
		Force_Deny: { ID: 17, Value: "Force Deny" },
		Shipment_Finalized: { ID: 18, Value: "Shipment Finalized" },
		InTransit: { ID: 19, Value: "In Transit" },
		Dispatch: { ID: 20, Value: "Dispatch" },
		Booked: { ID: 21, Value: "Booked" },
		Dispatched: { ID: 22, Value: "Dispatched" },
		OnHandDestination: { ID: 23, Value: "On Hand Destination" },
		OutForDelivery: { ID: 24, Value: "Out For Delivery" },
		PickupConfirmed: { ID: 25, Value: "Pickup Confirmed" },
		RecoveredfromCarrier: { ID: 26, Value: "Recovered From Carrier" },
		ShipmentCancelled: { ID: 27, Value: "Shipment Canceled" },
		TenderedtoCarrier: { ID: 28, Value: "Tendered To Carrier" },
		WebEntered: { ID: 29, Value: "Web Entered" },
	});

	enum eDateFilterType {
		None= 0,
		Timeframe= 1,
		SingleDate= 2,
		DateRange= 3,
		AgingTimeframe= 4,
		DateRangePicker= 5
	}
	export var DateFilterType: IDateFilterType = Object.freeze(eDateFilterType);

	export var DateFilterTimeFrame: IDateFilterTimeFrame = Object.freeze({
		Today: { ID: 0, Value: 'Today' },
		WTD: { ID: 1, Value: 'WTD' },
		LastWeek: { ID: 2, Value: 'Last Week' },
		MTD: { ID: 3, Value: 'MTD' },
		Last4Weeks: { ID: 4, Value: 'Last 4 weeks' },
		Last30Days: { ID: 5, Value: 'Last 30 days' },
		LastMonth: { ID: 6, Value: 'Last Month' },
		Quarter4: { ID: 7, Value: 'Q4' },
		Quarter3: { ID: 8, Value: 'Q3' },
		Quarter2: { ID: 9, Value: 'Q2' },
		Quarter1: { ID: 10, Value: 'Q1' },
		LastQuarter4: { ID: 11, Value: 'Last Year Q4' },
		LastQuarter3: { ID: 12, Value: 'Last Year Q3' },
		LastQuarter2: { ID: 13, Value: 'Last Year Q2' },
		LastQuarter1: { ID: 14, Value: 'Last Year Q1' },
		YTD: { ID: 15, Value: 'YTD' },
		Last12Months: { ID: 16, Value: 'Last 12 Months' },
		LastYear: { ID: 17, Value: 'Last Year' },
	});
	export var VendorBillStatus: IVendorBillStatus = Object.freeze({
		Pending: { ID: 1, Value: 'Pending' },
		Cleared: { ID: 2, Value: 'Cleared' },
		Dispute: { ID: 3, Value: 'Dispute' },
		Requote: { ID: 4, Value: 'Requote' },
		LostDispute: { ID: 5, Value: 'Lost Dispute' },
		ShortPaid: { ID: 6, Value: 'Short Paid' },
		DisputeWon: { ID: 7, Value: 'Dispute Won' },
		DisputeLost: { ID: 8, Value: 'Dispute Lost' },
		DisputeShortPaid: { ID: 9, Value: 'Dispute ShortPaid' },
		ManualAudit: { ID: 10, Value: 'Manual Audit' },
		WaitingForFinalization: { ID: 11, Value: 'Waiting For Finalization' },
		OverchargeClaim: { ID: 12, Value: 'Overcharge Claim' },
		OverchargeWon: { ID: 13, Value: 'Overcharge Won' },
		OverchargeLose: { ID: 14, Value: 'Overcharge Loss' }
	});

	// Saving statuses detects the changes
	export var SavingStatus: ISaveStatus = Object.freeze({
		NoChangesDetected: { ID: 1, Value: 'No Changes Detected' },
		ChangesDetected: { ID: 2, Value: 'Unsaved Changes Detected' },
		SavingChanges: { ID: 3, Value: 'Saving Changes...' },
		ChangesSaved: { ID: 4, Value: 'Changes Saved' }
	});

	export var DateRange: IDateRange = Object.freeze({
		All: { ID: 0, Value: 'All' },
		//## Date range for to day. #/
		Today: { ID: 1, Value: 'Today' },

		//## Date range for lastweek. #/
		Last_Week: { ID: 2, Value: 'Last Week' },

		//## Date range for last month. #/
		Last_Month: { ID: 3, Value: 'Last Month' },

		//## Date range for three months. #/
		Last_Three_Months: { ID: 4, Value: 'Last Three Months' },

		//## Date range for last year. #/
		Last_Year: { ID: 5, Value: 'Last Year' },

		//## Date range for custom. #/
		Custom: { ID: 6, Value: 'Custom' }
	});

	//## MAS Clearance Status.
	export var MasClearanceStatus = Object.freeze({
		ApprovedByProcess: { ID: 0, Value: 'Approved By Process' },
		WaitingReBillApproval: { ID: 1, Value: 'Waiting Rebill Approval' },
		ForcedApprovedByUser: { ID: 2, Value: 'Forced Approved By User' },
		ForcedApprovedByTime: { ID: 3, Value: 'Forced Approved By Time' }
	});

	//## Option Buttons.
	export var OptionButtonsView = Object.freeze({
		Horizontal: 1,
		Vertical: 2,
		Matrix: 3
	});

	//## Transport Mode.
	export var CarrierType = Object.freeze({
		LTL: { ID: 0, Value: 'LTL' },
		GuaranteedLTL: { ID: 1, Value: 'Guaranteed LTL' },
		Pallet: { ID: 2, Value: 'Pallet' },
		Truckload: { ID: 3, Value: 'TruckLoad' },
		INTWH: { ID: 4, Value: 'INTWH' },
		Ocean: { ID: 5, Value: 'Ocean' },
		Airfreight: { ID: 6, Value: 'Air Freight' },
		ExpediteAir: { ID: 7, Value: 'Expedite Air' },
		ExpediteGround: { ID: 8, Value: 'Expedite Ground' },
		WhiteGlove: { ID: 9, Value: 'White Glove' },
		Multileg: { ID: 10, Value: 'Multi Leg' },
		VPTL: { ID: 11, Value: 'VPTL' }
	});

	/*
	<changeHistory>
	<id>US25144</id> <by>Shreesha Adiga</by><date>13-10-2016</date><description>Added CenterAlignCurrencyTemplate</description>
	<id>DE25209</id> <by>Vasanthakumar</by> <date>30-11-2016</date> <description>Mouse over title show for extra text</description>
	</changeHistory>
	*/
	export var GridCellFormatTemplates: IGridCellFormatType = Object.freeze({
		BillStatusTextTemplate: '<div data-bind="attr: { \'class\': \'kgCellText colt\' + $index(), title: $data.getProperty($parent)},text: $userViewModel.getTextfromId($parent.entity)"></div>',
		DateFormatTemplate: '<div data-bind="attr: { \'class\': \'kgCellText colt\' + $index(), title: $data.getProperty($parent)},text: $userViewModel.getDateFormat($parent.entity)"></div>',
		DefaultTemplate: '<div data-bind=" attr: { \'class\': \'kgCellText colt\' + $index(), title: $data.getProperty($parent)}, html: $data.getProperty($parent) "></div>',
		LeftAlignPercentTemplate: '<div data-bind=" attr: { \'class\': \'kgCellText colt\' + $index() + \' text-left \', title: $data.getProperty($parent)}, html: $data.getProperty($parent) + \' %\' "></div>',
		LeftAlignTemplate: '<div data-bind=" attr: { \'class\': \'kgCellText colt\' + $index() + \' text-left \', title: $data.getProperty($parent)}, html: $data.getProperty($parent)"></div>',
		LeftAlignCurrencyTemplate: '<div data-bind=" attr: { \'class\': \'kgCellText colt\' + $index() + \' text-left \', title: \'$ \' +$data.getProperty($parent).toFixed(2)}, html: \'$ \' + $data.getProperty($parent).toFixed(2)"></div>',
		RightAlignPercentTemplate: '<div data-bind=" attr: { \'class\': \'kgCellText colt\' + $index() + \' text-right \', title: $data.getProperty($parent)}, html: $data.getProperty($parent) + \' %\' "></div>',
		RightAlignTemplate: '<div data-bind=" attr: { \'class\': \'kgCellText colt\' + $index() + \' text-right \', title: $data.getProperty($parent)}, html: $data.getProperty($parent)"></div>',
		RightAlignCurrencyTemplate: '<div data-bind=" attr: { \'class\': \'kgCellText colt\' + $index() + \' text-right \', title: \'$ \' +$data.getProperty($parent).toFixed(2)}, html: \'$ \' + $data.getProperty($parent).toFixed(2)"></div>',
		RightAlignAndNegativeCurrencyTemplate: '<div data-bind=" attr: { \'class\': \'kgCellText colt\' + $index() + \' text-right \',  title: $data.getProperty($parent)}, html: $data.getProperty($parent) < 0 ? \'$ (\' + $data.getProperty($parent) * -1 + \')\' : \'$ \' + $data.getProperty($parent).toFixed(2)"></div>',
		// ###START: DE25209
		CenterAlignTemplate: '<div data-bind=" attr: { \'class\': \'kgCellText colt\' + $index() + \' text-center \', title: $data.getProperty($parent)}, html: $data.getProperty($parent)"></div>',
		// ###END: DE25209
		// ##START: US25144
		CenterAlignCurrencyTemplate: '<div data-bind=" attr: { \'class\': \'kgCellText colt\' + $index() + \' text-center \', title: \'$ \' +$data.getProperty($parent).toFixed(2)}, html: \'$ \' + $data.getProperty($parent).toFixed(2)"></div>',
		// ##END: US25144
		RightAlignPoundTemplate: '<div data-bind=" attr: { \'class\': \'kgCellText colt\' + $index() + \' text-right \'}, html: $data.getProperty($parent).toFixed(0)"></div>',
		CenterAlignBooleanTemplate: '<div data-bind=" attr: { \'class\': \'kgCellText colt\' + $index() + \' text-center \'}, html: $data.getProperty($parent) == true ? \'Yes\' : \'No\' "></div>'
	});

	// Enums for Carrier Service Types
	export var ServiceType = Object.freeze({
		LTL: { ID: 0, Value: "LTL" },
		GuaranteedLTL: { ID: 1, Value: "GuaranteedLTL" },
		Pallet: { ID: 2, Value: "Pallet" },
		Truckload: { ID: 3, Value: "Truckload" },
		INT_WH: { ID: 4, Value: "INT-WH" },
		Ocean: { ID: 5, Value: "Ocean" },
		AirFrieght: { ID: 6, Value: "AirFrieght" },
		Expedite_Air: { ID: 7, Value: "Expedite-Air" },
		Expedite_Ground: { ID: 8, Value: "Expedite-Ground" },
		White_Glove: { ID: 9, Value: "White-Glove" },
		Multileg: { ID: 10, Value: "Multileg" },
		VPTL: { ID: 11, Value: "VPTL" },
	});
	/// <summary>
	/// Enum types for upload POD/Doc
	/// </summary>
	export var DocumentType: any = Object.freeze(
		{
			POD: { ID: 1, Value: "POD" },
			BOL: { ID: 2, Value: "BOL" },
			ReweighCertificate: { ID: 3, Value: "ReweighCertificate" },
			Doc: { ID: 4, Value: "Doc" },
			Other: { ID: 5, Value: "Other" }
		});

	export var DocumentOwner: any = Object.freeze(
		{
			Vendor: { ID: 1, Value: "Vendor" },
			Customer: { ID: 2, Value: "Customer" },
		});

	// Enums for Ship Via
	export var ShipVia = Object.freeze({
		Ground: { ID: 0, Value: 'Ground' },
		Ocean: { ID: 1, Value: 'Ocean' },
		Expedite_Air: { ID: 2, Value: 'Expedite - Air' },
		Expedite_Ground: { ID: 3, Value: 'Expedite - Ground' },
		White_Glove: { ID: 4, Value: 'White - Glove' },
		Ground_Ocean: { ID: 5, Value: 'Ground + Ocean' },
	});

	// Transaction search type
	export var TransactionSearchType = Object.freeze({
		SalesOrder: { ID: 0, Value: 'Sales Order' },
		Bills: { ID: 1, Value: 'Bills' },
		TruckloadQuote: { ID: 2, Value: 'TruckloadQuote' }
	});

	//## Agent NotifictionType Mode.
	export var AgentNotifictionType = Object.freeze({
		SelectAgentNotification: { ID: 0, Value: 'Select Agent Notification' },
		Reweigh: { ID: 1, Value: 'Reweigh' },
		Reclass: { ID: 2, Value: 'Reclass' },
		Truckload: { ID: 3, Value: 'Reconsigned' },
		LimitedAccess: { ID: 4, Value: 'Limited Access' },
		Other: { ID: 5, Value: 'Other' },
	});

	//## Agent Notifiction Alert Message Type Mode.
	export var AgentNotifictionAlertMessageType = Object.freeze({
		SelectAgentNotification: { ID: 0, Value: '' },
		Reweigh: { ID: 1, Value: 'reweighed' },
		Reclass: { ID: 2, Value: 'reclassed' },
		Truckload: { ID: 3, Value: 'reconsigned' },
		LimitedAccess: { ID: 4, Value: 'charged a limited access fee' },
		Other: { ID: 5, Value: 'assessed additional charges' },
	});

	//## For Shipment Type For Billing Station
	export var ShipmentType = Object.freeze({
		General: { ID: 1, Value: 'General' },
		SCM: { ID: 2, Value: 'SCM' }
	});

	//## For CustomerType
	export var CustomerType = Object.freeze({
		Normal_Customer: { ID: 1, Value: 'Normal Customer' },
		Rexnord_Customer: { ID: 2, Value: 'Rexnord Customer' },
		Volume_Customer: { ID: 3, Value: 'Volume Customer' },
		PLC_Customer: { ID: 4, Value: 'PLC Customer' },
		BillingStation_Customer: { ID: 5, Value: 'BillingStation Customer' }
	});

	//## For MasClearanceStatus
	export var MasClearanceStatus = Object.freeze({
		Approved_By_Process: { ID: 0, Value: 'Approved By Process' },
		Waiting_Rebill_Approval: { ID: 1, Value: 'Waiting Rebill Approval' },
		Forced_Approved_By_User: { ID: 2, Value: 'Forced Approved By User' },
		Forced_Approved_By_Time: { ID: 3, Value: 'Forced Approved By Time' },
	});

	//## Invoice Status
	export var InvoiceStatus = Object.freeze({
		Pending: { ID: 0, Value: 'Pending' },
		Dispute: { ID: 1, Value: 'Dispute' },
		Invoiced: { ID: 2, Value: 'Invoiced' },
		Scheduled: { ID: 3, Value: 'Scheduled' }
	});

	//## FeeStructure
	export var FeeStructure = Object.freeze({
		None: { ID: 0, Value: 'Invalid Value' },
		OverCost: { ID: 1, Value: 'Over Cost' },
		OverRevenue: { ID: 2, Value: 'Over Revenue' },
	});

	//## EDI210Structure
	export var ExceptionRuleId = Object.freeze({
		UnmappedCode: { ID: 1, Value: 'Unmapped Code' },
		DuplicatePro: { ID: 2, Value: 'Duplicate PRO' },
		Corrected: { ID: 3, Value: 'Corrected' },
		BOLNotCompleted: { ID: 7, Value: 'BOL Not Completed' },
		BOLCancelled: { ID: 8, Value: 'BOL Cancelled' },
		CarrierNotMapped: { ID: 9, Value: 'Carrier Not Mapped' },
	});

	//## Reports
	export var ScheduledReports = Object.freeze({
		DisputeBoardDetails: { ID: 1, Value: 'Dispute Board Details' },
		VendorBillExceptionReport: { ID: 2, Value: 'VendorBill Exception Report' },
		VendorBillTrackingReport: { ID: 3, Value: 'VendorBill Tracking Report' },
		FinalizedOrdersWithNoVendorBills: { ID: 4, Value: 'Finalized Orders With No Vendor Bills' },
		SalesOrdersFinalizedNotInvoiced: { ID: 5, Value: 'Sales Orders Finalized Not Invoiced' },
		RebillSummaryReport: { ID: 6, Value: 'Rebill Summary Report' },
		OrderRebillReport: { ID: 7, Value: 'Order Rebill Report' },
		CRRRebillSummaryReport: { ID: 8, Value: 'CRR Rebill Summary Report' },
		DisputedVendorBills: { ID: 9, Value: 'Disputed VendorBills Report' },
		RebillReasonsReport: { ID: 10, Value: 'Rebill Reasons Report' },
		CarrierMapping: { ID: 11, Value: 'Carrier Mapping' },
	});

	export enum SearchFilterOperand {
		Equals = 0,
		NotEquals = 1,
		GreaterThan = 2,
		LessThan = 3,
		GreaterThanEquals = 4,
		LessThanEquals = 5,
		Contains = 6,
		NotContains = 7,
		StartsWith = 8,
		EndsWith = 9
	};

	export enum SearchTransactionType {
		PurchaseOrders = 0,
		VendorBills = 1,
		Both = 2
	};

	export enum PDFViewerDimensions {
		/**
		* EXPPDFHeight
		**/
		EXPPDFHeight = Utils.Common.prototype.isBrowserIsChrome() ? 420 : 400,

		/**
		* EXPPDFWidth
		**/
		EXPPDFWidth = Utils.Common.prototype.isBrowserIsChrome() ? 435 : 345,

		/**
		* ViewBOLPDFHeight
		**/
		ViewBOLPDFHeight = Utils.Common.prototype.isBrowserIsChrome() ? 500 : 450,

		/**
		* ViewBOLPDFWidth
		**/
		ViewBOLPDFWidth = Utils.Common.prototype.isBrowserIsChrome() ? 460 : 370,

		/**
		* DefaultPDFHeight
		**/
		DefaultPDFHeight = 550,

		/**
		* DefaultPDFWidth
		**/
		DefaultPDFWidth = 440,

		/**
	   * ViewINVPDFHeight
	   **/
		ViewINVPDFHeight = Utils.Common.prototype.isBrowserIsChrome() ? 500 : 450,

		/**
		* ViewINVPDFWidth
		**/
		ViewINVPDFWidth = Utils.Common.prototype.isBrowserIsChrome() ? 460 : 370,
	}

	export enum FilterViewName {
		PurchaseOrderBoard = 1,
		CarrierMappingBoard = 2,
		VendorBillExceptionBoard = 3,
		InvoiceExceptionBoard = 4,
		RequoteBoard = 5,
		DisputeBoard = 6,
		DisputeWonLossBoard = 7,
		TransactionSearchSalesOrder = 8,
		TransactionSearchBill = 9,
		PORexnordBoard = 10,
		EDIBoard= 11,
		FindMorePOPossibility = 12,
		ForeignBolAddress = 13,
		ForeignBolCustomer = 14,
		// ###START: US20103
		SubOrderProcessingBoard = 15,
		// ###END: US20103
		// ###START: US25164
		CreditMemoRequest = 16,
		// ###START: US25164
		// ###START: US25685
		VendorBillReassignment = 17
		// ###START: US25685
	};

	//## EDI210Structure
	export var Note = Object.freeze({
		General: { ID: 0, Value: 'General' },
		System: { ID: 30, Value: 'System' },
		Information: { ID: 5, Value: 'Information' },
		Dispute: { ID: 4, Value: 'Dispute' },
		Problem: { ID: 17, Value: 'Problem' },
		// ###START: DE20107
		Communication: { ID: 3, Value: 'Communication' },
		// ###END: DE20107
		// ##START: US22955
		Cancel: { ID: 2, Value: 'Cancel' }
		// ##END: US22955
	});

	// Defining the Tolerance Name/Group.

	export var ToleranceType = Object.freeze({
		ShippingServiceGroupDispute: { ID: 1, Value: 'Shipping Service Group Dispute' },
		FuelSurchargeGroupDispute: { ID: 2, Value: 'Fuel Surcharge Group Dispute' },
		AccessorialServiceGroupDispute: { ID: 3, Value: 'Accessorial Service Group Dispute' },
		GuaranteedChargeGroupDispute: { ID: 4, Value: 'Guaranteed Charge Group Dispute' },
		TotalBillTolerance: { ID: 5, Value: 'Total Bill Tolerance' },
		PostAuditTotalBillTolerance: { ID: 6, Value: 'Post Audit Total Bill Tolerance' },

		QuoteTolerance: { ID: 7, Value: 'Quote Tolerance' },
		ShippingServiceGroupRevenueAdjustment: { ID: 8, Value: 'Shipping Service Group Revenue Adjustment' },
		FuelSurchargeGroupRevenueAdjustment: { ID: 9, Value: 'Fuel Surcharge Group Revenue Adjustment' },
		AccessorialServiceGroupRevenueAdjustment: { ID: 10, Value: 'Accessorial Service Group Revenue Adjustment' },
		GuaranteedChargeGroupRevenueAdjustment: { ID: 11, Value: 'Guaranteed Charge Group Revenue Adjustment' },
		RevenueAdjustmentTolerance: { ID: 12, Value: 'Revenue Adjustment Tolerance' },
		TLTolerance: { ID: 13, Value: 'TL Tolerance' },
	});

	export var ForeignBolOptionConstant: IForeignBolOptionConstant = Object.freeze({
		ShipperConsigneeAddress: 1,
		BillToAddress: 2,
		EDIBOLLength: 3,
		BOLStartsWithCharacter: 4
	});

	//## Toastr message
	export var ToastrMessageType = Object.freeze({
		success: { ID: 1, Value: 'success' },
		error: { ID: 2, Value: 'error' },
		info: { ID: 3, Value: 'info' },
		warning: { ID: 4, Value: 'warning' }
	});

	//##START: US20288
	//Sales Order - Credit Memo adjustment type dropdwon items
	export var CreditMemoAdjustmentType = Object.freeze({
		RepAbsorb: { Id: 1, Value: 'Rep Absorb' },
		GTZAbsorb: { Id: 2, Value: 'GTZ Absorb' },
		SplitAbsorb: { Id: 3, Value: 'Split Absorb' },
		DebitMemo: { Id: 4, Value: 'Vendor Credit(Debit Demo)' },
		MarginReduction: { Id: 5, Value: 'Margin Reduction' },
	});

	//Sales Order - Credit Memo Reason Code dropdown
	export var CreditMemoReasonCode = Object.freeze({
		TariffRatingError: { Id: 1, Value: 'Tariff or rating error' },
		SoftwareError: { Id: 2, Value: 'Software error' },
		AccountingError: { Id: 3, Value: 'Accounting error' },
		SalesRepError: { Id: 4, Value: 'Sales rep error' },
		CustomerSatisfaction: { Id: 5, Value: 'Customer Satisfaction' },
		Other: { Id: 6, Value: 'Other' },
	});
	//##END: US20288

	// ###START: US20728
	export var SalesOrderNotesType = Object.freeze({
		General: { ID: 0, Value: 'General' },
		IR: { ID: 101, Value: 'IR' },
		// ###START: US22613
		Carrier: { ID: 103, Value: 'Carrier' },
		// ###END: US22613
		PODSignedBy: { ID: 104, Value: 'POD Signed By' }

	});

	// ###END: US20728

	// ##START: US21131
	// ## START: DE22584
	// enum for dispute state dropdown in SO and VB dispute tab
	export var DisputeState = Object.freeze({
		MoreDisputeInfoNeeded: { ID: 8, Value: 'More Dispute Information Needed' },
		CarrierResearching: { ID: 9, Value: 'Carrier Researching' },
		GTZError: { ID: 14, Value: 'GTZ Error' },
		AgentDisputing: { ID: 15, Value: 'Agent Disputing' },
		Closed: { ID: 16, Value: 'Closed' },
		// ###START: US29069
		PendingOVCCheck: { ID: 17, value: 'Pending OVC Check' },
		// ###END: US29069
	});
	// ##END: DE22584
	// ##END: US21131

	// ##START: US22955
	export var SalesOrderCancelReason = Object.freeze({
		OrderCancelledByCustomer: { ID: 1, Value: 'Order canceled by the Customer' },
		NewSalesOrderCreated: { ID: 2, Value: 'New Sales Order (BOL) created' },
	});
	// ##END: US22955

	// ###START: US25117
	export var SalesOrderHazmatPackingGroup = Object.freeze({
		None: { ID: '0', Value: 'None' },
		High: { ID: '1', Value: 'I (High Danger)' },
		Medium: { ID: '2', Value: 'II (Medium Danger)' },
		Low: { ID: '3', Value: 'III (Low Danger)' }
	});

	// ###END: US25117

	// ###START: US25277
	export var CreditReason = Object.freeze({
		ClaimGtzPay: { ID: 1, Value: 'Claim GTZ Pay' },
		ClaimVendorPay: { ID: 2, Value: 'Claim Vendor Pay' },
		Correction: { ID: 3, Value: 'Correction' },
		GtzSatisfaction: { ID: 4, Value: 'GTZ Satisfaction' },
		OvcClaim: { ID: 5, Value: 'OVC Claim' },
		RepAbsorb: { ID: 6, Value: 'Rep Absorb' },
		VbMove: { ID: 7, Value: 'VB Move' },
		MarginReduction: { ID: 8, Value: 'Margin Reduction' },
		VendorCredit: { ID: 9, Value: 'Vendor Credit' },
		DisputeWon: { ID: 10, Value: 'Dispute Won' },
		SplitAbsorb: { ID: 11, Value: 'Split Absorb' },
		CancelSO: { ID: 12, Value: 'Cancel SO' },
	});

	// ###END: US25277

	// ##START: US25685
	// Types of grids to be shown in droddown in AR Dashboard
	export var ARDashboardGridTypes = Object.freeze({
		CreditMemoRequest: { ID: 1, Value: 'Credit Memo Requests' },
		VendorBillReassignment: { ID: 2, Value: 'Vendor Bill Reassignment' }
	});
	// ##END: US25685
}
