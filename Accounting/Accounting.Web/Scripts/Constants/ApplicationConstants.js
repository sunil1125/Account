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
var Constants;
(function (Constants) {
    //#region UI Constants
    //Constants class to hold all the static constant values used in the UI.
    //All the Message box related constants will be present in this class.
    var UIConstants = (function () {
        function UIConstants() {
        }
        UIConstants.ApplicationTitle = "Accounting";

        UIConstants.HomePageTitle = "Home";

        UIConstants.VendorBillPageTitle = "Vendor Bill";

        UIConstants.CreateVendorBillTitle = "Entry";

        UIConstants.VendorBillUpload = "Upload";

        UIConstants.EditVendorBillTitle = "Edit";

        UIConstants.ExceptionVenderBillTitle = "Exception";

        UIConstants.PurchaseOrderPageTitle = "Unmatched Vendor Bill";

        UIConstants.EditPurchaseOrderTitle = "Edit";

        UIConstants.BoardPurchaseOrderTitle = "Board";

        UIConstants.RexnordBoardTitle = "Rexnord Board";

        UIConstants.SalesOrderTitle = "Sales Order";

        UIConstants.SalesOrderEdit = "Edit";

        UIConstants.SalesOrderEntry = "Entry";

        UIConstants.CarrierPageTitle = "Carrier";

        UIConstants.BoardPageTitle = "Board";

        UIConstants.CarrierMapping = "Mapping";

        UIConstants.ReQuoteBoard = "Re-Quote";

        UIConstants.Edi210CarrierException = "EDI 210 Carrier Exception";

        UIConstants.InvoiceExceptionBoard = "Invoice Exception";

        UIConstants.DisputeBoard = "Dispute";

        UIConstants.DisputeWonLoss = "Dispute Won/Loss";

        UIConstants.ReportsPageTitle = "Reports";

        UIConstants.DisputeBoardDetails = "Dispute Board Details";

        UIConstants.ScheduledReportsDetails = "Scheduled Reports";

        UIConstants.VendorBillExceptionReport = "Vendor Bill Exception Report";

        UIConstants.VendorBillTrackingReport = "Vendor Bill Tracking Report";

        UIConstants.TransactionSearchTitle = "Transaction Search";

        UIConstants.Admin = "Admin";

        UIConstants.MySettings = "Settings";

        UIConstants.OnlinePaymentConfiguration = "Online Payment Configuration";

        UIConstants.ComparisonTolerance = "Comparison Tolerance";

        UIConstants.InvoiceExceptionVenderBillTitle = "Invoice Exception";

        UIConstants.FinalizedOrderWithNoVendorBillsReport = "Finalized Order With No Vendor Bills Report";

        UIConstants.SalesOrderFinalizedNotInvoicedReport = "Sales Order Finalized Not Invoiced Report";

        UIConstants.RexnordInvoicingReport = "Rexnord Invoicing Report";

        UIConstants.APMatchingreport = "AP Matching Report";

        UIConstants.ITermAuditSettings = "I-Term Audit Setting";

        UIConstants.RebillSummaryReport = "Re Bill Summary";

        UIConstants.DisputedVendorBillsReport = "Disputed Vendor Bills Report";

        UIConstants.RebillReasonsReport = "Rebill Reason Report";

        UIConstants.OrderRebillReport = "Order Rebill Report";

        UIConstants.CrrRebillReport = "CRR Rebill Summary";

        UIConstants.RexnordManagerWeeklyDashboardReport = "Rexnord Manager Weekly Dashboard Report";

        UIConstants.LostCostOpportunityReportForRexnord = "Lost Cost Opportunity Report For Rexnord";

        UIConstants.RexnordPostAuditReport = "Rexnord Post Audit Report";

        UIConstants.ZurnConsolidationReport = "Zurn Consolidation Report";

        UIConstants.CompanyMapping = "Company Mapping";

        UIConstants.PauseTimer = "Stop Timer";

        UIConstants.ResumeTimer = "Resume Timer";
        return UIConstants;
    })();
    Constants.UIConstants = UIConstants;

    //#endregion UI Constants
    //#region Application Constants
    //Constants class to hold all the static constant values used in the application.
    var ApplicationConstants = (function () {
        function ApplicationConstants() {
        }
        ApplicationConstants.Mexico = "MEX";

        ApplicationConstants.USA = "USA";

        ApplicationConstants.Canada = "CAN";

        ApplicationConstants.DateTimeFormat = "mm/dd/yyyy";

        ApplicationConstants.FuelChartTemplateName = "Fuel Chart Template.xls";

        ApplicationConstants.ExcelFileFormatName = "application/vnd.ms-excel";

        ApplicationConstants.FuelStatusInActive = "In-Active";

        ApplicationConstants.NotPublished = "Not Published";

        ApplicationConstants.Mozilla = "Mozilla";

        ApplicationConstants.DefaultCarrierLogoFilePath = "content/images/defaulttruckload.jpg";

        ApplicationConstants.MinimumValueForHazardousClass = 0;

        ApplicationConstants.MaximumValueForHazardousClass = 9;

        ApplicationConstants.ShippingItemId = "10";

        ApplicationConstants.ShippingItemIdMiscellaneousFee = "2";

        ApplicationConstants.ShippingItemIdMiscellaneousFeeRexnord = "9002";

        ApplicationConstants.ShippingItemIdCorrectedInvocingFee = "88";

        ApplicationConstants.Reclass = "78";

        ApplicationConstants.Reclassfee = "77";

        ApplicationConstants.Reweigh = "76";

        ApplicationConstants.Reweighfee = "75";

        ApplicationConstants.ReweighANDReclass = "74";

        ApplicationConstants.DiscountItemId = "70";

        ApplicationConstants.FuelItemId = "30";

        ApplicationConstants.NoErrorStatusCode = 200;

        ApplicationConstants.MatchingProcessErrorStatusCode = 1033;

        ApplicationConstants.MailSentFailedCode = 1034;

        ApplicationConstants.MailSettingNotFoundCode = 1035;

        ApplicationConstants.MemoNotesUpdated = 1038;

        ApplicationConstants.RecordAlreadyChanged = 1005;

        ApplicationConstants.ErrorStatusInfoCode = -2;
        return ApplicationConstants;
    })();
    Constants.ApplicationConstants = ApplicationConstants;
})(Constants || (Constants = {}));
