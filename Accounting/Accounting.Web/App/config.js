/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'services/models/common/Enums'], function(require, exports, __router__, ___enums__) {
    /// <reference path="shell.ts" />
    /// <reference path="../Scripts/TypeDefs/durandal.d.ts" />
    /// <reference path="../Scripts/Constants/ApplicationConstants.ts" />
    var router = __router__;
    var _enums = ___enums__;

    /*
    ** <summary>
    ** Config class for configuring the Durandal routes for the application.
    ** </summary>
    ** <createDetails>
    ** <id></id> <by>ACHAL RASTOGI</by> <date>03-14-2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US19882</id> <by>Shreesha Adiga</by> <date>23-12-2015</date> <description>Added route for CSV upload for Sales Order</description>
    ** <id>DE22074</id> <by>Janakiram</by> <date>22-03-2016</date> <description>While switching tabs it was redircting to home page. Fixed this and added persistence(added Itemid, and allowTab made ture).</description>
    ** <id>US22997</id> <by>Janakiram</by> <date>07-07-2016</date> <description>Added Configuration for Invoice View Pdf</description>
    ** <id>US27900</id> <by>Shreesha Adiga</by> <date>03-05-2017</date><description>Create routes for opening EDI and Sales order details from other applications</description>
    ** </changeHistory>
    */
    var Config = (function () {
        function Config() {
            this.router = router;
            this.routes = ([
                {
                    route: 'Home',
                    moduleId: 'viewmodels/welcome',
                    title: Constants.UIConstants.HomePageTitle,
                    id: 'Home',
                    nav: true,
                    settings: { landingPage: false, activate: false, itemId: 1, isDenimBackground: true, allowTab: false }
                },
                {
                    route: '#',
                    moduleId: '',
                    title: Constants.UIConstants.VendorBillPageTitle,
                    id: 'VendorBill',
                    nav: true,
                    settings: { VendorBill: false, activate: false, itemId: 2, resourceName: 'Access VendorBill', rqdPermission: -2, isMainMenu: true }
                },
                {
                    route: 'Entry',
                    moduleId: 'vendorBill/VendorBillEntryView',
                    title: Constants.UIConstants.CreateVendorBillTitle,
                    id: 'Entry',
                    nav: false,
                    settings: { VendorBill: true, activate: false, itemId: 3, resourceName: 'Access VendorBill Entry', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.RateTab, cssClass: 'ShipmentBoardImage' }
                },
                {
                    route: 'VendorBillEdit',
                    moduleId: 'vendorBill/VendorMainEditView',
                    title: Constants.UIConstants.EditVendorBillTitle,
                    id: 'VendorBillEdit',
                    nav: false,
                    settings: { VendorBill: true, activate: false, itemId: 4, resourceName: 'Access VendorBill Edit', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.RateTab, cssClass: 'FreightSummaryImage' }
                },
                {
                    route: 'Exception',
                    moduleId: 'vendorBillException/VendorBillException',
                    title: Constants.UIConstants.ExceptionVenderBillTitle,
                    id: 'Exception',
                    nav: false,
                    settings: { VendorBill: true, activate: false, itemId: 6, resourceName: 'Access VendorBill Execpition', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.GridTab, cssClass: 'OutboundSummaryImage' }
                },
                {
                    route: 'Upload',
                    moduleId: 'vendorBill/VendorBillUploadCSVFile',
                    title: Constants.UIConstants.VendorBillUpload,
                    id: 'Upload',
                    nav: false,
                    settings: { VendorBill: true, activate: false, itemId: 15, resourceName: 'Access VendorBill Upload', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.RateTab, cssClass: 'ShipmentmanifestImage' }
                },
                {
                    route: "VendorBillDetails",
                    moduleId: 'vendorBill/VendorBillmainDetailView',
                    title: 'VendorBillDetails',
                    nav: false,
                    settings: { VendorBill: false, activate: false, itemId: 5, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab }
                },
                {
                    route: 'Invoice',
                    moduleId: 'vendorBill/VendorBillInvoiceView',
                    title: 'Invoice',
                    nav: false,
                    settings: { VendorBill: false, activate: false, itemId: 19, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab }
                },
                {
                    route: '#',
                    moduleId: '',
                    title: Constants.UIConstants.PurchaseOrderPageTitle,
                    id: 'UnmatchedVendorBill',
                    nav: true,
                    settings: { PurchaseOrder: false, activate: false, itemId: 7, resourceName: 'Access PurchaseOrder', rqdPermission: -2, isMainMenu: true }
                },
                {
                    route: 'PurchaseOrderEdit',
                    moduleId: 'purchaseOrder/PurchaseOrderEditView',
                    title: Constants.UIConstants.EditPurchaseOrderTitle,
                    id: 'PurchaseOrderEdit',
                    nav: false,
                    settings: { PurchaseOrder: true, activate: false, itemId: 8, allowTab: true, resourceName: 'Access PurchaseOrder Edit', rqdPermission: -2, tabType: _enums.Enums.TabType.RateTab, cssClass: 'InvoiceManagementImage' }
                },
                {
                    route: 'PurchaseOrderBoard',
                    moduleId: 'purchaseOrder/PurchaseOrderBoards',
                    title: Constants.UIConstants.BoardPurchaseOrderTitle,
                    id: 'PurchaseOrderBoard',
                    nav: false,
                    settings: { PurchaseOrder: true, activate: false, itemId: 10, allowTab: true, resourceName: 'Access PurchaseOrder Board', rqdPermission: -2, defaultSettings: true, tabType: _enums.Enums.TabType.GridTab, cssClass: 'ShipmentBoardImage' }
                },
                {
                    route: 'RexnordBoard',
                    moduleId: 'purchaseOrder/RexnordBoardView',
                    title: Constants.UIConstants.RexnordBoardTitle,
                    id: 'RexnordBoard',
                    nav: false,
                    settings: { PurchaseOrder: true, activate: false, itemId: 18, defaultSettings: true, allowTab: true, resourceName: 'Access PurchaseOrder Rexnord Board', rqdPermission: -2, tabType: _enums.Enums.TabType.GridTab, cssClass: 'FinancialDashboardImage' }
                },
                {
                    route: "PurchaseOrderDetails",
                    moduleId: 'purchaseOrder/PurchaseOrderMainDetailsView',
                    title: 'PurchaseOrderDetails',
                    nav: false,
                    settings: { PurchaseOrder: false, activate: false, itemId: 9, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab }
                },
                {
                    route: '#',
                    moduleId: '',
                    title: Constants.UIConstants.SalesOrderTitle,
                    id: 'SalesOrder',
                    nav: true,
                    settings: { SalesOrder: false, activate: false, isMainMenu: true, resourceName: 'Access SalesOrder', rqdPermission: -2 }
                },
                {
                    route: "salesOrderEntry",
                    moduleId: 'salesOrder/SalesOrderMainEntryView',
                    title: Constants.UIConstants.SalesOrderEntry,
                    id: "salesOrderEntry",
                    nav: false,
                    settings: { SalesOrder: true, activate: false, itemId: 21, defaultSettings: true, resourceName: 'Access SalesOrder Entry', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'ShipmentBoardImage' }
                },
                {
                    route: "salesOrderEdit",
                    moduleId: 'salesOrder/SalesOrderMainEditView',
                    title: Constants.UIConstants.SalesOrderEdit,
                    id: "salesOrderEdit",
                    nav: false,
                    settings: { SalesOrder: true, activate: false, itemId: 20, defaultSettings: true, resourceName: 'Access SalesOrder Edit', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'FreightSummaryImage' }
                },
                {
                    route: "SalesOrderDetails",
                    moduleId: 'salesOrder/SalesOrderMainDetailsView',
                    title: 'SalesOrderDetails',
                    nav: false,
                    settings: { SalesOrder: false, activate: false, itemId: 23, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab }
                },
                // ##START: US27900
                {
                    route: "SalesOrderDetails/:shipmentId/:bolNumber",
                    moduleId: 'salesOrder/SalesOrderMainDetailsView',
                    title: 'SalesOrderDetails',
                    nav: false,
                    settings: { SalesOrder: false, activate: false, itemId: 91, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab }
                },
                // ##END: US27900
                {
                    route: 'PrintBol',
                    moduleId: 'salesOrder/SalesOrderPrintBOL',
                    title: 'PrintBol',
                    nav: false,
                    settings: { SalesOrder: false, activate: false, itemId: 45, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab }
                },
                {
                    route: '#',
                    moduleId: '',
                    title: Constants.UIConstants.CarrierPageTitle,
                    id: 'Carrier',
                    nav: true,
                    settings: { Carrier: false, activate: false, isMainMenu: true, resourceName: 'Access Carrier', rqdPermission: -2 }
                },
                {
                    route: "Mapping",
                    moduleId: 'carrier/CarrierMapping',
                    title: Constants.UIConstants.CarrierMapping,
                    id: "Mapping",
                    nav: false,
                    settings: { Carrier: true, activate: false, itemId: 11, resourceName: 'Access Carrier Mapping', rqdPermission: -2, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'CarrierscoreCardImage' }
                },
                {
                    route: '#',
                    moduleId: '',
                    title: Constants.UIConstants.BoardPageTitle,
                    id: 'Board',
                    nav: true,
                    settings: { Board: false, activate: false, isMainMenu: true, resourceName: 'Access Board', rqdPermission: -2 }
                },
                {
                    route: "Dispute",
                    moduleId: 'board/DisputeBoard',
                    title: Constants.UIConstants.DisputeBoard,
                    id: "Dispute",
                    nav: false,
                    settings: { Board: true, activate: false, itemId: 28, defaultSettings: true, resourceName: 'Access Dispute Board', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'ReportDashboardImage' }
                },
                {
                    route: "DisputeWon/Loss",
                    moduleId: 'board/DisputeWonLoss',
                    title: Constants.UIConstants.DisputeWonLoss,
                    id: "Dispute",
                    nav: false,
                    settings: { Board: true, activate: false, itemId: 51, defaultSettings: true, resourceName: 'Access Dispute Board', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'ReportDashboardImage' }
                },
                {
                    route: "InvoiceException",
                    moduleId: 'board/BoardInvoiceException',
                    title: Constants.UIConstants.InvoiceExceptionVenderBillTitle,
                    id: 'Invoice Exception',
                    nav: false,
                    settings: { Board: true, activate: false, itemId: 29, defaultSettings: true, resourceName: 'Access InvoiceException Board', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'StatementsImage' }
                },
                {
                    route: "RequoteBoardContainer",
                    moduleId: 'board/RequoteBoardContainer',
                    title: Constants.UIConstants.ReQuoteBoard,
                    id: "RequoteBoardContainer",
                    nav: false,
                    settings: { Board: true, activate: false, itemId: 27, defaultSettings: true, resourceName: 'Access ReQuote Board', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'ShipmentBoardImage' }
                },
                {
                    route: "Edi210CarrierException",
                    moduleId: 'board/Edi210CarrierException',
                    title: "Edi210CarrierException",
                    id: "Edi210CarrierException",
                    nav: false,
                    settings: { Board: true, activate: false, itemId: 37, defaultSettings: true, resourceName: 'Access Edi210CarrierException Board', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'StatementsImage' }
                },
                // ##START: US27900
                {
                    route: "Edi210CarrierException/:ediDetailId/:batchId/:exceptionRuleId",
                    moduleId: 'board/Edi210CarrierException',
                    title: "Edi210CarrierException",
                    id: "Edi210CarrierException",
                    nav: false,
                    settings: { Board: false, activate: false, itemId: 92, defaultSettings: true, resourceName: 'Access Edi210CarrierException Board', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab }
                },
                // ##END: US27900
                {
                    route: '#',
                    moduleId: '',
                    title: Constants.UIConstants.ReportsPageTitle,
                    id: 'Reports',
                    nav: true,
                    settings: { Reports: false, activate: false, resourceName: 'Access Report', rqdPermission: -2, isMainMenu: true }
                },
                //{
                //	route: "ScheduledReportsDetails",
                //	moduleId: 'reports/ScheduledReportsView',
                //	title: Constants.UIConstants.ScheduledReportsDetails,
                //	id: "ScheduledReports",
                //	nav: false,
                //	settings: { Reports: true, activate: false, itemId: 53, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'ShipmentBoardImage' }
                //},
                //{
                //	route: "ScheduledReportsDetails",
                //	moduleId: 'reports/ScheduledReportsView',
                //	title: Constants.UIConstants.ScheduledReportsDetails,
                //	id: "ScheduledReports",
                //	nav: false,
                //	settings: { Reports: true, activate: false, itemId: 53, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'ShipmentBoardImage' }
                //},
                //{
                //	route: "DisputeBoardDetails",
                //	moduleId: 'reports/ReportsDisputeBoardDetails',
                //	title: Constants.UIConstants.DisputeBoardDetails,
                //	id: "DisputeBoardDetails",
                //	nav: false,
                //	settings: { Reports: true, activate: false, itemId: 12, resourceName: 'Access Dispute Board Report', rqdPermission: -2, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'ReportDashboardImage' }
                //},
                //{
                //	route: "VendorBillExceptionReport",
                //	moduleId: 'reports/ReportsVendorBillExceptionReport',
                //	title: Constants.UIConstants.VendorBillExceptionReport,
                //	id: "VendorBillExceptionReport",
                //	nav: false,
                //	settings: { Reports: true, activate: false, itemId: 13, resourceName: 'Access VendorBill Exception Report', rqdPermission: -2, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'StatementsImage' }
                //},
                {
                    route: "DisputeBoardDetails",
                    moduleId: 'reports/ReportsDisputeBoardDetails',
                    title: Constants.UIConstants.DisputeBoardDetails,
                    id: "DisputeBoardDetails",
                    nav: false,
                    settings: { Reports: true, activate: false, itemId: 12, resourceName: 'Access Dispute Board Report', rqdPermission: -2, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'ReportDashboardImage' }
                },
                {
                    route: "VendorBillExceptionReport",
                    moduleId: 'reports/ReportsVendorBillExceptionReport',
                    title: Constants.UIConstants.VendorBillExceptionReport,
                    id: "VendorBillExceptionReport",
                    nav: false,
                    settings: { Reports: true, activate: false, itemId: 13, resourceName: 'Access VendorBill Exception Report', rqdPermission: -2, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'StatementsImage' }
                },
                {
                    route: "VendorBillTrackingReport",
                    moduleId: 'reports/ReportsVendorBillTrackingReport',
                    title: Constants.UIConstants.VendorBillTrackingReport,
                    id: "VendorBillTrackingReport",
                    nav: false,
                    settings: { Reports: true, activate: false, itemId: 14, resourceName: 'Access VendorBill Tracking Report', rqdPermission: -2, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'OnlinePaymentImage' }
                },
                {
                    route: "FinalizedOrderWithNoVendorBillsReport",
                    moduleId: 'reports/FinalizedOrderWithNoVendorBillsReport',
                    title: Constants.UIConstants.FinalizedOrderWithNoVendorBillsReport,
                    id: "FinalizedOrderWithNoVendorBillsReport",
                    nav: false,
                    settings: { Reports: true, activate: false, itemId: 34, defaultSettings: true, resourceName: 'Access Finalized Order With No Vendor Bills Report', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'StatementsImage' }
                },
                {
                    route: "SalesOrderFinalizedNotInvoicedReport",
                    moduleId: 'reports/SalesOrderFinalizedNotInvoicedReport',
                    title: Constants.UIConstants.SalesOrderFinalizedNotInvoicedReport,
                    id: "FinalizedOrderWithNoVendorBillsReport",
                    nav: false,
                    settings: { Reports: true, activate: false, itemId: 35, defaultSettings: true, resourceName: 'Access SalesOrder Finalized Not Invoiced Report', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'StatementsImage' }
                },
                ////{
                ////	route: "RexnordInvoicingReport",
                ////	moduleId: 'reports/RexnordInvoicingReport',
                ////	title: Constants.UIConstants.RexnordInvoicingReport,
                ////	id: "RexnordInvoicingReport",
                ////	nav: false,
                ////	settings: { Reports: true, activate: false, itemId: 36, defaultSettings: true, resourceName: 'Access Rexnord Invoicing Report', rqdPermission: -2,allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'StatementsImage' }
                ////},
                {
                    route: "RebillSummaryReport",
                    moduleId: 'reports/RebillSummaryReport',
                    title: Constants.UIConstants.RebillSummaryReport,
                    id: "RebillSummaryReport",
                    nav: false,
                    settings: { Reports: true, activate: false, itemId: 41, defaultSettings: true, resourceName: 'Access Re Bill Summary Report', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'StatementsImage' }
                },
                {
                    route: "OrderRebillReport",
                    moduleId: 'reports/OrderRebillReport',
                    title: Constants.UIConstants.OrderRebillReport,
                    id: "OrderRebillReport",
                    nav: false,
                    settings: { Reports: true, activate: false, itemId: 44, defaultSettings: true, resourceName: 'Access Order Re Bill Report', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'StatementsImage' }
                },
                {
                    route: "CRRRebillSummary",
                    moduleId: 'reports/CRRRebillSummary',
                    title: Constants.UIConstants.CrrRebillReport,
                    id: "CRRRebillSummary",
                    nav: false,
                    settings: { Reports: true, activate: false, itemId: 50, defaultSettings: true, resourceName: 'Access CRR Re Bill Summary Report', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'StatementsImage' }
                },
                ////{
                ////    route: "APMatchingReport",
                ////    moduleId: 'reports/APMatchingReportView',
                ////    title: Constants.UIConstants.APMatchingreport,
                ////    id: "APMatchingReport",
                ////    nav: false,
                ////    settings: { Reports: true, activate: false, itemId: 40, defaultSettings: true, resourceName: 'Access AP Matching Report', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'StatementsImage' }
                ////},
                {
                    route: "DisputedVendorBillsReport",
                    moduleId: 'reports/DisputedVendorBills',
                    title: Constants.UIConstants.DisputedVendorBillsReport,
                    id: "DisputedVendorBillsReport",
                    nav: false,
                    settings: { Reports: true, activate: false, itemId: 42, defaultSettings: true, resourceName: 'Access Disputed VendorBill Report', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'StatementsImage' }
                },
                {
                    route: "ReBillReasonsReport",
                    moduleId: 'reports/ReBillReasonsReport',
                    title: Constants.UIConstants.RebillReasonsReport,
                    id: "ReBillReasonsReport",
                    nav: false,
                    settings: { Reports: true, activate: false, itemId: 43, defaultSettings: true, resourceName: 'Access Re Bill Reason Report', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'StatementsImage' }
                },
                ////{
                ////    route: "RexnordManagerWeeklyDashboardReport",
                ////    moduleId: 'reports/RexnordManagerWeeklyDashboardReport',
                ////    title: Constants.UIConstants.RexnordManagerWeeklyDashboardReport,
                ////    id: "RexnordManagerWeeklyDashboardReport",
                ////    nav: false,
                ////    settings: { Reports: true, activate: false, itemId: 46, defaultSettings: true, resourceName: 'Access Weekly Dashboard Report', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'StatementsImage' }
                ////},
                ////{
                ////    route: "LostCostOpportunityReportForRexnord",
                ////    moduleId: 'reports/LostCostOpportunityReportForRexnord',
                ////    title: Constants.UIConstants.LostCostOpportunityReportForRexnord,
                ////    id: "LostCostOpportunityReportForRexnord",
                ////    nav: false,
                ////    settings: { Reports: true, activate: false, itemId: 47, defaultSettings: true, resourceName: 'Access Lost Cost Opportunity Report', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'StatementsImage' }
                ////},
                ////{
                ////    route: "RexnordPostAuditReport",
                ////    moduleId: 'reports/RexnordPostAuditReport',
                ////    title: Constants.UIConstants.RexnordPostAuditReport,
                ////    id: "RexnordPostAuditReport",
                ////    nav: false,
                ////    settings: { Reports: true, activate: false, itemId: 48, defaultSettings: true, resourceName: 'Access Rexnord Post Audit Report', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'StatementsImage' }
                ////},
                ////{
                ////    route: "ZurnConsolidationReport",
                ////    moduleId: 'reports/ZurnConsolidationReport',
                ////    title: Constants.UIConstants.ZurnConsolidationReport,
                ////    id: "ZurnConsolidationReport",
                ////    nav: false,
                ////    settings: { Reports: true, activate: false, itemId: 49, defaultSettings: true, resourceName: 'Access Zurn Consolidation Report', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'StatementsImage' }
                ////},
                {
                    route: 'TransactionSearch',
                    moduleId: 'transactionSearch/TransactionSearchView',
                    title: Constants.UIConstants.TransactionSearchTitle,
                    id: 'TransactionSearch',
                    nav: true,
                    settings: { Search: true, activate: false, isMainMenu: true, itemId: 26, resourceName: 'Access Transaction Search', rqdPermission: -2, allowTab: true, defaultSettings: true, tabType: _enums.Enums.TabType.GridTab }
                },
                {
                    route: '#',
                    moduleId: '',
                    title: Constants.UIConstants.Admin,
                    id: 'MyAdmin',
                    nav: true,
                    settings: { Admin: false, activate: false, resourceName: 'Access Admin', rqdPermission: -2, isMainMenu: true }
                },
                {
                    route: "OnlinePaymentConfiguration",
                    moduleId: 'Admin/OnlinePaymentConfiguration',
                    title: Constants.UIConstants.OnlinePaymentConfiguration,
                    id: "OnlinePaymentConfiguration",
                    nav: false,
                    settings: { Admin: true, activate: false, itemId: 33, defaultSettings: true, resourceName: 'Access online Payment Configuration', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'OnlinePaymentImage' }
                },
                {
                    route: "ComparisonTolerance",
                    moduleId: 'Admin/ComparisonTolerance',
                    title: Constants.UIConstants.ComparisonTolerance,
                    id: "ComparisonTolerance",
                    nav: false,
                    settings: { Admin: true, activate: false, itemId: 52, defaultSettings: true, resourceName: 'Access Comparison Tolerance', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'ShipmentBoardImage' }
                },
                {
                    route: '#',
                    moduleId: '',
                    title: 'myAccount',
                    nav: false,
                    settings: { MyAccount: false, activate: false, allowTab: false }
                },
                {
                    route: 'MySettings',
                    moduleId: 'myAccount/MySetting',
                    title: Constants.UIConstants.MySettings,
                    nav: false,
                    settings: { MyAccount: true, activate: false, itemId: 31, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab }
                },
                {
                    route: "HistoryDetails",
                    moduleId: 'vendorBill/VendorBillHistoryHeaderDetails',
                    title: 'HistoryDetails',
                    nav: false,
                    settings: { HistoryDetails: false, activate: false, itemId: 16, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.GridTab }
                },
                {
                    route: "SalesOrder",
                    moduleId: 'salesOrder/SalesOrderDetailsView',
                    title: 'SalesOrder',
                    nav: false,
                    settings: { SalesOrder: false, activate: false, itemId: 17, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.GridTab }
                },
                {
                    route: 'SearchResult',
                    moduleId: 'transactionSearch/SearchResult',
                    title: "SearchResult",
                    id: 'SearchResult',
                    nav: false,
                    settings: { Search: false, activate: false, itemId: 24, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.RateTab, cssClass: 'ShipmentmanifestImage' }
                },
                {
                    route: 'CompanyMappingSettings',
                    moduleId: 'purchaseOrder/CompanyMappingSettings',
                    title: Constants.UIConstants.CompanyMapping,
                    id: 'CompanyMappingSettings',
                    nav: false,
                    settings: { PurchaseOrder: true, activate: false, itemId: 25, resourceName: 'Access Company Mapping', rqdPermission: -2, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.GridTab, cssClass: 'OnlinePaymentImage' }
                },
                {
                    route: "Rebill",
                    moduleId: 'salesOrder/SalesOrderEditRebillView',
                    title: 'Rebill',
                    nav: false,
                    settings: { SalesOrder: false, activate: false, itemId: 32, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.GridTab }
                },
                {
                    route: "SalesOrderHistoryHeaderDetails",
                    moduleId: 'salesOrder/SalesOrderHistoryHeaderDetails',
                    title: 'SalesOrderHistoryHeaderDetails',
                    nav: false,
                    settings: { HistoryDetails: false, activate: false, itemId: 40, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.GridTab }
                },
                {
                    route: "salesOrderAuditSettings",
                    moduleId: 'salesOrder/SalesOrderAuditSettings',
                    title: Constants.UIConstants.ITermAuditSettings,
                    id: "salesOrderAuditSettings",
                    nav: false,
                    settings: { SalesOrder: true, activate: false, itemId: 38, defaultSettings: true, resourceName: 'Access ITerm Audit Setting', rqdPermission: -2, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab, cssClass: 'FreightSummaryImage' }
                },
                {
                    route: "VendorBillDetails/:VendorBillId",
                    moduleId: 'vendorBill/VendorBillmainDetailView',
                    title: 'VendorBillDetailsWithId',
                    nav: false,
                    settings: { VendorBill: false, activate: true, itemId: 89, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab }
                },
                ////##START: US19882
                ////##START: DE22074
                {
                    route: 'SalesOrderUploadFile',
                    moduleId: 'salesOrder/SalesOrderUploadFile',
                    title: 'Upload',
                    id: 'SalesOrderUpload',
                    nav: false,
                    settings: { SalesOrder: true, activate: false, allowTab: true, itemId: 39, tabType: _enums.Enums.TabType.RateTab, cssClass: 'ShipmentmanifestImage' }
                },
                ////##END: DE22074
                ////##END: US19882
                // ###START: US22997
                {
                    route: 'PrintInvoice',
                    moduleId: 'salesOrder/InvoiceViewPdf',
                    title: 'PrintInvoice',
                    nav: false,
                    settings: { SalesOrder: false, activate: false, itemId: 45, defaultSettings: true, allowTab: true, tabType: _enums.Enums.TabType.DocumentTab }
                }
            ]);

            this.startModule = Constants.UIConstants.HomePageTitle;
        }
        return Config;
    })();
    exports.Config = Config;
});
