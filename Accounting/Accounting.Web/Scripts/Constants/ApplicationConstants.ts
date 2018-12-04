/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/*
** <summary>
** Module to hold all the constants used in the application.
** </summary>
** <createDetails>
** <id></id> <by>Achal Rastogi</by> <date>03-14-2014</date>
** </createDetails>
** <changeHistory>
** <id>DE22118</id> <by>Vasanthakumar</by> <date>04-04-2016</date> <description>Added Response model constant value</description>
** <id>DE22808</id> <by>Baldev Singh Thakur</by> <date>13-05-2016</date><description>Error message on saving Bill/UVB even if bill has saved successfully.</description>
** <id>US22471</id> <by>Vasanthakumar</by> <date>03-06-2016</date> <description>Add Success Toastr message for Emails triggered by users</description>
** <id>US23124</id> <by>Janakiram</by> <date>04-07-2016</date><description>Added success Messages memo notes added </description>
** <id>US24632</id> <by>Baldev Singh Thakur</by> <date>12-09-2016</date> <description>Added a new constant Error Code for Record Already Changed.</description>
** <id>DE25727</id> <by>Vasanthakumar</by> <date>27-01-2017</date> <description>Added Error Status info code</description>
** </changeHistory>
*/
module Constants {
	//#region UI Constants
	//Constants class to hold all the static constant values used in the UI.
	//All the Message box related constants will be present in this class.
	export class UIConstants {
		//#region Page Title display values

		//Application title name.
		public static ApplicationTitle: string = "Accounting";

		//Welcome page title display value.
		public static HomePageTitle: string = "Home";

		//Vendor Bill page title display value.
		public static VendorBillPageTitle: string = "Vendor Bill";

		//Entry page title display value.
		public static CreateVendorBillTitle: string = "Entry";

		//Entry page title Upload CSV File.
		public static VendorBillUpload: string = "Upload";

		//Edit Vendor Bill page title display value.
		public static EditVendorBillTitle: string = "Edit";

		//Exception page title display value
		public static ExceptionVenderBillTitle: string = "Exception";

		// Purchase Order page title display value.
		public static PurchaseOrderPageTitle: string = "Unmatched Vendor Bill";

		//Edit Purchase Order page title display value.
		public static EditPurchaseOrderTitle: string = "Edit";

		//Board Purchase Order page title display value.
		public static BoardPurchaseOrderTitle = "Board";

		//RexnordBoard page title display value.
		public static RexnordBoardTitle = "Rexnord Board";

		//Reports page title display value.
		public static SalesOrderTitle: string = "Sales Order";

		//Reports page title display value.
		public static SalesOrderEdit: string = "Edit";

		//Reports page title display value.
		public static SalesOrderEntry: string = "Entry";

		//Reports page title display value.
		public static CarrierPageTitle: string = "Carrier";

		//Reports page title display value.
		public static BoardPageTitle: string = "Board";

		//Reports page title display value.
		public static CarrierMapping: string = "Mapping";

		//Reports page title display value.
		public static ReQuoteBoard: string = "Re-Quote";

		//Edi210CarrierExceptiom page title display value.
		public static Edi210CarrierException: string = "EDI 210 Carrier Exception";

		//Reports page title display value.
		public static InvoiceExceptionBoard: string = "Invoice Exception";

		//Reports page title display value.
		public static DisputeBoard: string = "Dispute";

		//Reports page title display value.
		public static DisputeWonLoss: string = "Dispute Won/Loss";

		//Reports page title display value.
		public static ReportsPageTitle: string = "Reports";

		//Reports page/Dispute Board Details title display value.
		public static DisputeBoardDetails: string = "Dispute Board Details";

		//Reports page/Dispute Board Details title display value.
		public static ScheduledReportsDetails: string = "Scheduled Reports";

		//Reports page/Dispute Board Details title display value.
		public static VendorBillExceptionReport: string = "Vendor Bill Exception Report";

		//Reports page/Dispute Board Details title display value.
		public static VendorBillTrackingReport: string = "Vendor Bill Tracking Report";

		//Admin page title display value.
		public static TransactionSearchTitle: string = "Transaction Search";

		//My Setting display value.
		public static Admin: string = "Admin";

		//My Setting display value.
		public static MySettings: string = "Settings";

		//My Setting display value.
		public static OnlinePaymentConfiguration: string = "Online Payment Configuration";

		//ComparisonTolerance
		public static ComparisonTolerance: string = "Comparison Tolerance";

        //Invoice Exception page title display value
		public static InvoiceExceptionVenderBillTitle: string = "Invoice Exception";

		//Reports Finalized orders with no bills.
		public static FinalizedOrderWithNoVendorBillsReport: string = "Finalized Order With No Vendor Bills Report";

		//Sales Order Finalized Not Invoiced Report
		public static SalesOrderFinalizedNotInvoicedReport:string = "Sales Order Finalized Not Invoiced Report";

		//Sales Order Finalized Not Invoiced Report
        public static RexnordInvoicingReport: string = "Rexnord Invoicing Report";

        //AP Matching Report
        public static APMatchingreport: string = "AP Matching Report";

		//Sales Order Sales Order Audit Settings
        public static ITermAuditSettings: string = "I-Term Audit Setting";

        //Rebill summary report
        public static RebillSummaryReport: string = "Re Bill Summary";

        // Disputed Disputed Vendor Bills Report.
        public static DisputedVendorBillsReport: string = "Disputed Vendor Bills Report";

        // Rebill Reasons Report.
        public static RebillReasonsReport: string = "Rebill Reason Report";

        // Order Rebill Report.
        public static OrderRebillReport: string = "Order Rebill Report";

        //Crr Rebill Summary
        public static CrrRebillReport: string = "CRR Rebill Summary";

        //Rexnord Manager Weekly Dashboard Report.
        public static RexnordManagerWeeklyDashboardReport: string = "Rexnord Manager Weekly Dashboard Report";

        //Rexnord Manager Lost Cost Opportunity Report For Rexnord.
        public static LostCostOpportunityReportForRexnord: string = "Lost Cost Opportunity Report For Rexnord";

        //Rexnord Manager Rexnord Post Audit Report.
        public static RexnordPostAuditReport: string = "Rexnord Post Audit Report";

        //Rexnord Manager Zurn Consolidation Report.
		public static ZurnConsolidationReport: string = "Zurn Consolidation Report";

		//Company Mappings.
        public static CompanyMapping: string = "Company Mapping";

        //Company Mappings.
        public static PauseTimer: string = "Stop Timer";

        //Company Mappings.
        public static ResumeTimer: string = "Resume Timer";

		////Admin Account Management page title display value.
		//public static AccountManagAdminPageTitle: string = "Account Management";

		////Admin User Management page title display value.
		//public static UserManagAdminPageTitle: string = "User Management";

		////Admin Product Management page title display value.
		//public static ProductManagAdminPageTitle: string = "Product Management";

		////Admin Contact Management page title display value.
		//public static ContactManagAdminPageTitle: string = "Contact Management";

		//#endregion Page Title display values
	}
	//#endregion UI Constants

	//#region Application Constants
	//Constants class to hold all the static constant values used in the application.
	export class ApplicationConstants {
		//#region Application Constants
		//Mexico country code.
		public static Mexico: string = "MEX";
		//Mexico country code.
		public static USA: string = "USA";
		//Mexico country code.
		public static Canada: string = "CAN";
		//Date time format for displaying the date in the UI.
		public static DateTimeFormat: string = "mm/dd/yyyy";

		//Fuel Chart Template Name.
		public static FuelChartTemplateName: string = "Fuel Chart Template.xls";
		//Excel File Format Name.
		public static ExcelFileFormatName: string = "application/vnd.ms-excel";
		//Fuel Index fuel value status.
		public static FuelStatusInActive: string = "In-Active";
		//Fuel Index future fuel value status.
		public static NotPublished: string = "Not Published";
		//Browser App Name for Mozilla.
		public static Mozilla: string = "Mozilla";
		//File path for Default Carrier Logo.
		public static DefaultCarrierLogoFilePath: string = "content/images/defaulttruckload.jpg";

		//Minimum value for hazardous class.
		public static MinimumValueForHazardousClass: number = 0;

		//Maximum value for hazardous class.
		public static MaximumValueForHazardousClass: number = 9;

		//Shipping ItemId
		public static ShippingItemId: string = "10";

		//MiscellaneousFee ItemId
		public static ShippingItemIdMiscellaneousFee: string = "2";

		//MiscellaneousFeeRexnord ItemId
		public static ShippingItemIdMiscellaneousFeeRexnord: string = "9002";

		//CorrectedInvocingFee ItemId
		public static ShippingItemIdCorrectedInvocingFee: string = "88";

		//Reclass ItemId
		public static Reclass: string = "78";

		//Reclassfee ItemId
		public static Reclassfee: string = "77";

		//Reweigh ItemId
		public static Reweigh: string = "76";

		//Reweighfee ItemId Reweigh fee
		public static Reweighfee: string = "75";

		//ReweighANDReclass ItemId
		public static ReweighANDReclass: string = "74";

		//Discount ItemId
		public static DiscountItemId: string = "70";

		//Fuel ItemId
		public static FuelItemId: string = "30";

		//// ###START: DE22118
		//No Error Status Code
		public static NoErrorStatusCode: number = 200;
		//// ###END: DE22118

		// ###START: DE22808
		public static MatchingProcessErrorStatusCode: number = 1033;

		// ###END: DE22808

		// ###START: US22471
		//Mail sent failed response code
		public static MailSentFailedCode: number = 1034;

		//Mail setting not found response code
		public static MailSettingNotFoundCode: number = 1035;
		// ###END: US22471

         // ###START: US23124
         // Vendor Bill Memo added successfully
         public static MemoNotesUpdated: number = 1038;
		// ###END: US23124
		
		// ###START: US24632
		// Record Already Changed Error Code
		public static RecordAlreadyChanged: number = 1005;

		// ###END: US24632

		public static ErrorStatusInfoCode: number = -2;
		//#endregion Application Constants
	}
	//#endregion Application Constants
}