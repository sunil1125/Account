/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../localStorage/LocalStorage.ts" />
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../services/models/TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import _reportViewer = require('../templates/reportViewerControlV2');
import refEnums = require('services/models/common/Enums');
import refSalesOrderDetailsViewModel = require('salesOrder/SalesOrderDetailsView');
import refSalesOrderShipping = require('salesOrder/SalesOrderShippingView');
import refSalesOrderItemViewModel = require('salesOrder/SalesOrderItemView');
import refSalesOrderAddressViewModel = require('salesOrder/SalesOrderAddressView');
import refSalesOrderNotesViewModel = require('salesOrder/SalesOrderNotes');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refAddress = require('services/models/salesOrder/SalesOrderAddress');
import refSalesOrderLinksViewModel = require('salesOrder/SalesOrderLinks');
import refSalesOrderHistoryViewModel = require('salesOrder/SalesOrderHistory');
import refSalesOrderHazmatViewModel = require('salesOrder/SalesOrderHazmatView');
import refSalesOrderDisputeViewModel = require('salesOrder/SalesOrderDisputeView');
import refSalesOrderPODDocViewModel = require('salesOrder/SalesOrderPODDocView');
import refAddressBookSearch = require('services/models/common/searchAddressBook');
import refSalesOrderMultilegViewModel = require('salesOrder/SalesOrderMultileg');
import refSalesOrderClaimViewModel = require('salesOrder/SalesOrderClaimView');
import refSalesOrderCreditMemoViewModel = require('salesOrder/SalesOrderCreditMemoView');
import refSalesOrderItemModel = require('salesOrder/SalesOrderItemsModel');
import refSalesOrderAgentNotificationViewModel = require('salesOrder/SalesOrderAgentNotificationView');
import refPodDocModel = require('services/models/salesOrder/SalesOrderUploadFileModel');
import refSalesOrderInvoiceExceptionViewModel = require('salesOrder/SalesOrderInvoiceException');
import refVendorBillClient = require('services/client/VendorBillClient');
import refSalesOrderAuditViewModel = require('salesOrder/SalesOrderAuditView');
import refSalesOrderDetailsModel = require('services/models/salesOrder/SalesOrderDetail');
import refSalesOrderAddressDetailModel = require('services/models/salesOrder/SalesOrderAddressDetail');
import refSalesOrderItemDetailModel = require('services/models/salesOrder/SalesOrderItemDetail');
import refSalesOrderTerminalAddressModel = require('services/models/salesOrder/SalesOrderTerminalAddress');
import refSalesOrderMultilegCarrierDetailModel = require('services/models/salesOrder/SalesOrderMultilegCarrierDetail');
import refSalesOrderNotesModel = require('services/models/salesOrder/SalesOrderNoteDetail');
import refSalesOrderContainerModel = require('services/models/salesOrder/SalesOrderContainer');
import refSalesOrderReBillViewModel = require('salesOrder/SalesOrderReBillView');
import refSalesOrderAuditedBillViewModel = require('salesOrder/SalesOrderAuditedBillView');
import refSalesOrderReBillItemsModel = require('salesOrder/SalesOrderRebillItemsModel');
import refSalesOrderReqouteReviewDetailModel = require('services/models/salesOrder/SalesOrderRequoteReviewDetail');
import refSalesOrderReQuoteReasonsModel = require('services/models/salesOrder/SalesOrderShipmentRequoteReason');
import refSalesOrderFinalizeDetailModel = require('services/models/salesOrder/SalesOrderFinalizeModel');
import refSalesOrderFinancialDetailsModel = require('services/models/salesOrder/SalesOrderFinancialDetails');
import refSalesOrderMasViewModel = require('salesOrder/SalesOrderMas');
//#endregion

/***********************************************
  Sales Order Edit Details ViewModel
************************************************
** <summary>
** Sales Order Edit Details ViewModel
** </summary>
** <createDetails>
** <id>US12172</id><by>Satish</by><date>27th Aug, 2014</date>
** </createDetails>
** <changeHistory>
** <id>DE20307</id><by>SHREESHA ADIGA</by><date>15-10-2015</date><description>Add expand all accordions function to SO details</description>
** <id>US19354</id><by>SHREESHA ADIGA</by><date>03-11-2015</date><description>Add notes while saving, if there is a change in carrier, zipcodes, item cost and revenue</description>
** <id>US19648</id> <by>Baldev Singh Thakur</by> <date>17-11-2015</date> <description>Acct: Display Transit Days value in Accounting Center</description>
** <id>DE20749</id><by>SHREESHA ADIGA</by><date>18-11-2015</date><description>For BS customers, check if BS cost < 0 instead of revenue</description>
** <id>US19354</id><by>SHREESHA ADIGA</by><date>23-11-2015</date><description>Add notes when a lineitem is added</description>
** <id>DE20717</id><by>SHREESHA ADIGA</by><date>08-12-2015</date><description>Send "BookedBy" (ShipmentBy) field while saving</description>
** <id>US20208</id> <by>Vasanthakumar</by> <date>01-01-2016</date> <description>Modification of SO Cancellation Process for the Insurance on BOLs in Accounting</description>
** <id>US20089</id><by>SHREESHA ADIGA</by><date>11-06-2016</date><description>Added credit memo menu</description>
** <id>US20305</id> <by>Chandan Singh Bajetha</by> <date>07-01-2016</date> <description>Acct: Remove extra ADD button from SO & VB Notes Section</description>
** <id>DE21392</id> <by>Vasanthakumar</by> <date>12-01-2016</date> <description>Toastr message shown in wrong background shade for Information</description>
** <id>US20089</id><by>SHREESHA ADIGA</by><date>11-06-2016</date><description>Added resize for credit memo grid</description>
** <id>DE21426</id> <by>Vasanthakumar</by> <date>19-01-2016</date> <description>Change detection toastr msg is not showing editing the notes in Invoiced SO/VB</description>
** <id>US20288</id><by>SHREESHA ADIGA</by><date>19-06-2016</date><description>Added credit memo visibility boolean</description>
** <id>DE21287</id><by>Vasanthakumar</by><date>21-01-2016</date><description>Disable booked date textbox for TL</description>
** <id>DE21390</id> <by>Vasanthakumar</by> <date>22-01-2016</date> <description>System shows Change Detection message when user navigate to ReBill tab & try to navigate to other page</description>
** <id>DE21749</id> <by>Chandan Singh Bajetha</by> <date>08-02-2016</date> <description>Disable the Status drop down when user directly updates the bill status to Dispute Short Paid from any status other than Dispute</description>
** <id>DE21740</id> <by>Chandan Singh Bajetha</by> <date>11-02-2016</date> <description>Information toastr messages are shown in green back ground</description>
** <id>DE21747</id> <by>Baldev Singh Thakur</by> <date>12-02-2016</date> <description>ariff Type shown as "Not Available" when user performs Make Copy action.</description>
** <id>US20647</id> <by>Chandan Singh BAjetha</by> <date>17-02-2016</date> <description>Acct: Implement Search on all Reports.</description>
** <id>US21131</id> <by>Shreesha Adiga</by> <date>01-04-2016</date> <description>Pass salesRepId and customerId to dispute tab (used for sending disputeStateNote)</description>
** <id>US21133</id> <by>Baldev Singh Thakur</by> <date>31-03-2016</date> <description>MAS Tab</description>
** <id>DE22412</id> <by>Shreesha Adiga</by> <date>13-04-2016</date> <description>Fetch shipment notes everytime you click on notes tab</description>
** <id>US22053</id> <by>Shreesha Adiga</by> <date>10-05-2016</date> <description>Populate the carrier name of dispute model from the carrier name of the SO details</description>
** <id>DE21308</id> <by>Shreesha Adiga</by> <date>16-05-2016</date> <description>Changes related to hiding the progress bar when clicked on Schedule invoice toastr</description>
** <id>DE22450</id> <by>Shreesha Adiga</by> <date>17-05-2016</date> <description>Keep the spinner on, till composition complete is called</description>
** <id>US22417</id> <by>Janakiram</by> <date>19-05-2016</date> <description>Chnaged model of CUstmerBol While saving</description>
** <id>DE22879</id> <by>Janakiram</by> <date>24-05-2016</date> <description>if SOFinalCost  value is null then assigned "0" to it.</description>
** <id>US22365</id> <by>Baldev Singh Thakur</by> <date>25-05-2016</date> <description>Acct: Update Copy Cost Revenue Button Functionality.</description>
** <id>DE23007</id> <by>Janakiram</by> <date>27-05-2016</date> <description>Added Total Pieces and weight values are populated in Shipping tab on entering details in the Items tab</description>
** <id>DE23038</id> <by>Baldev Singh Thakur</by> <date>02-06-2016</date> <description>Change Detection message shown even after the page is  refreshed.</description>
** <id>US22471</id> <by>Vasanthakumar</by> <date>03-06-2016</date> <description>Add Success Toastr message for Emails triggered by users</description>
** <id>DE23203</id> <by>Shreesha Adiga</by> <date>10-06-2016</date> <description>Get the tariff start date and tariff number while creating a suborder</description>
** <id>US22797</id> <by>Shreesha Adiga</by> <date>15-06-2016</date> <description>Disable make copy for non-ground orders</description>
** <id>US22798</id> <by>Vasanthakumar</by> <date>20-06-2016</date> <description>Acct: Disable the ability to edit Multileg and Expedite shipments</description>
** <id>US22795</id> <by>Vasanthakumar</by> <date>22-06-2016</date> <description>Acct: Block Trucload Vendors for SO Entry Screen</description>
** <id>DE23005</id> <by>Shreesha Adiga</by> <date>17-05-2016</date> <description>Remove the spinner at the end of load method. Remove the changes made as part of the defect DE22450</description>
** <id>DE23042</id> <by>Baldev Singh Thakur</by> <date>27-06-2016</date> <description>Save button gets enabled after navigating back from other tab.</description>
** <id>US22955</id><by>Shreesha Adiga</by><date>30-06-2016</date><description>Show cancel reason popup; Pass model instead of multiple parameters</description>
** <id>DE23427</id><by>Dhaval Tamhane</by><date>04-07-2016</date><description>Fixed the issue where atlas call was done for total cost as NaN (Not a number)</description>
** <id>US23162</id><by>Vasanthakumar</by><date>12-07-2016</date><description>Enable reload rebill page if refresh button clicked</description>
** <id>DE23903</id> <by>Janakiram</by> <date>11-08-2016</date> <description>Agent Notification Tab in not displayed in sales order for the requote status bill</description>
** <id>DE23916</id> <by>Baldev Singh Thakur</by> <date>12-08-2016</date> <description>Passing BillToLocationType.</description>
** <id>US24389</id> <by>Shreesha Adiga</by> <date>31-08-2016</date> <description>Changes related to populating TL accessorials for TL orders</description>
** <id>US24323</id> <by>Baldev Singh Thakur</by> <date>02-09-2016</date> <description>Setting the invoice status to scheduled when the revenue is zero.</description>
** <id>DE24336</id> <by>Dhaval Tamhane</by> <date>10-09-2016</date> <description>Handled orders with no address.</description>
** <id>US24632</id> <by>Baldev Singh Thakur</by> <date>12-09-2016</date> <description>Modified the logic to reload the order, if it has already been modified, and also updated the message Record Already Changed.</description>
** <id>US24671</id> <by>Shreesha Adiga</by> <date>12-09-2016</date> <description>Populate invoice status to SO items tab</description>
** <id>DE23850</id> <by>Shreesha Adiga</by> <date>15-09-2016</date> <description>Changes to calculating estimated due date</description>
** <id>US24865</id> <by>Shreesha Adiga</by> <date>23-09-2016</date><description>Fetch Dispute Templates on click of dispute tab</description>
** <id>US25171</id> <by>Janakiram</by> <date>04-10-2016</date> <description>Added new button like "Request Credit" and to open pop-up on click.</description>
** <id>DE24777</id> <by>Shresha Adiga</by> <date>10-10-2016</date> <description>Don't call the GetSalesOrderFinancialDetailsOnSubscribe method if Total revenue is NaN</description>
** <id>US25277</id> <by>Baldev Singh Thakur</by> <date>19-10-2016</date> <description>Added a new server call for fetching Credit Reasons and also passing the credit reasons to the popup.</description>
** <id>US25310</id> <by>Shreesha Adiga</by> <date>24-10-2016</date> <description>Show Credit Request Popup after bill status is changed to Dispute Won; Add a new callback to Dispute tab</description>
** <id>US25679</id> <by>Baldev Singh Thakur</by> <date>11-11-2016</date><description>Added totalPendingVendorAmount</description>
** <id>DE25101</id> <by>Vasanthakumar</by> <date>21-11-2016</date> <description>Create a sub-SO on processing Credit Request- Issues on Created sub order for the Processed Credit amount</description>
** <id>DE25123</id> <by>Vasanthakumar</by> <date>23-11-2016</date> <description>Sub order and sub bill not creating for Tl orders after creating credit memo.</description>
** <id>DE25233</id> <by>Shreesha Adiga</by> <date>02-12-2016</date> <description>Show toastr when uncancelling is done via order status</description>
** <id>US26037</id> <by>Baldev Singh Thakur</by> <date>19-12-2016</date><description>Added logic for enabling the Request Credit Memo for TL Suborder</description>
** <id>US26126</id> <by>Vasanthakumar</by> <date>20-12-2016</date> <description>Acct: Do not display Request Credit Memo button if vendorbill not attached to the SO</description>
** <id>DE25525</id> <by>Baldev Singh Thakur</by> <date>09-01-2017</date> <description>Acct: Removed the logic to restrict "Request Credit Memo" button if no bills are attached.</description>
** <id>US22966</id> <by>Baldev Singh Thakur</by> <date>09-01-2017</date> <description>Acct: Remove "OVC Claim" and "Vendor Credit" from Credit Reason, if no bill is attached.</description>
** <id>US26575</id> <by>Baldev Singh Thakur</by> <date>07-02-2017</date> <description>Acct: Remove the call to fetch total pending amount and credit reason while loading the order.</description>
** <id>DE25806</id> <by>Baldev Singh Thakur</by> <date>14-02-2017</date> <description>Sales Order- On refreshing Sales order, Changed billing address (zip code)  is not reflecting on the sales order.</description>
** <id>US27159</id> <by>Baldev Singh Thakur</by> <date>24-02-2017</date> <description>Acct: Update TL Schedule Functionality: Added condition to display the appropriate messages while scheduling TL orders</description>
** <id>US26377</id> <by>Baldev Singh Thakur</by> <date>02-03-2017</date> <description>Added logic for hiding all the buttons except Print BOL if order is invoiced, cancelled and no bill is attached.</description>
** <id>US26377</id> <by>Vasanthakumar</by> <date>03-03-2017</date> <description>Added CancelSO credit request reason logic.</description>
** <id>US29002</id> <by>Baldev Singh Thakur</by> <date>05-06-2017</date> <description>Removed logic for Make Copy Button.</description>
** <id>US29002</id> <by>Baldev Singh Thakur</by> <date>05-06-2017</date> <description>Added logic for hiding Make Copy Button based on the config value.</description>
** <id>7266</id> <by>Shreesha Adiga</by><date>23-11-2018</date><description>Hide/Show Mas tab based on IsRedirectedFromCC cookie</description>
** </changeHistory>
***********************************************/

export class SalesOrderEditDetailsViewModel {
	//#region Members
	public salesOrderDetailsViewModel: refSalesOrderDetailsViewModel.SalesOrderDetailsViewModel;
	isAccordion: KnockoutObservable<boolean> = ko.observable(false);
	listProgressAccordian: KnockoutObservable<boolean> = ko.observable(false);
	listProgressTabbed: KnockoutObservable<boolean> = ko.observable(false);
	multilegLinkVisiblity: KnockoutObservable<boolean> = ko.observable(false);
	agentNotifcationLinkVisiblity: KnockoutObservable<boolean> = ko.observable(false);
	vendorBillId: KnockoutObservable<number> = ko.observable(0);
	rebillitems: Array<ISalesOrderItem>;
	invoiceExceptionVisibility: KnockoutObservable<boolean> = ko.observable(false);
	creditMemoVisiblity: KnockoutObservable<boolean> = ko.observable(false); //US20288
	// To get the logged in user
	currentUser: KnockoutObservable<IUser> = ko.observable();
	//for validation
	public isValidSalesOrder: boolean = false;
	public isValidAddress: boolean = false;
	public isValidItems: boolean = false;
	public isValidHazmat: boolean = false;
	public isValidShipping: boolean = false;
	public isValidMultileg: boolean = false;
	public isViewMessage: boolean = true;
	finalRevenue: number;
	actualCost: number;
	finalBSCost: number;

	//public salesorderid: number = 0;
	salesOrderAddressViewModel: refSalesOrderAddressViewModel.SalesOrderAddressViewModel;
	salesOrderNotesViewModel: refSalesOrderNotesViewModel.SalesOrderNotesViewModel;
	salesOrderLinksViewModel: refSalesOrderLinksViewModel.SalesOrderLinksViewModel;
	salesOrderHistoryViewModel: refSalesOrderHistoryViewModel.SalesOrderHistoryViewModel;
	salesOrderHazmatViewModel: refSalesOrderHazmatViewModel.SalesOrderHazmatViewModel;
	salesOrderDisputeViewModel: refSalesOrderDisputeViewModel.SalesOrderDisputeViewModel;
	salesOrderPODDocViewModel: refSalesOrderPODDocViewModel.SalesOrderPODDocViewModel;
	salesOrderMultiLegViewModel: refSalesOrderMultilegViewModel.SalesOrderMultiLegViewModel;
	salesOrderClaimViewModel: refSalesOrderClaimViewModel.SalesOrderClaimViewModel;
	salesOrderCreditMemoViewModel: refSalesOrderCreditMemoViewModel.SalesOrderCreditMemoViewModel; //US20089
	salesOrderAgentNotificationViewModel: refSalesOrderAgentNotificationViewModel.SalesOrderAgentNotificationViewModel;
	salesorderInvoiceExceptionViewModel: refSalesOrderInvoiceExceptionViewModel.SalesOrderInvoiceExceptionViewModel;
	salesOrderAuditViewModel: refSalesOrderAuditViewModel.SalesOrderAuditViewModel;
	salesorderReBillViewModel: refSalesOrderReBillViewModel.SalesOrderReBillViewModel;
	salesorderAuditedBillViewModel: refSalesOrderAuditedBillViewModel.SalesOrderAuditedBillViewModel;
	salesOrderSaveData: refSalesOrderContainerModel.Model.SalesOrderContainer;
	salesOrderMasViewModel: refSalesOrderMasViewModel.SalesOrderMasViewModel; //US21133
	salesOrderOriginalData = refSalesOrderContainerModel.Model.SalesOrderContainer;

	//for set as Finalize
	salesOrderFinalizeDetailModel: refSalesOrderFinalizeDetailModel.Model.SalesOrderFinalizeModel;

	// for SalesOrder financial details
	SalesOrderFinancialDetailsModel: refSalesOrderFinancialDetailsModel.Models.SalesOrderFinancialDetails;

	salesorderAdjustmentitems: KnockoutObservableArray<refSalesOrderReBillItemsModel.Models.SalesOrderReBillItemsModel> = ko.observableArray([]);
	//Sales Order Client
	salesOrderClient: refSalesOrderClient.SalesOrderClient = new refSalesOrderClient.SalesOrderClient();

	//vendor bill client
	vendorBillClient: refVendorBillClient.VendorBillClient = new refVendorBillClient.VendorBillClient();

	salesOrderShippingViewModel: refSalesOrderShipping.salesOrderShippingViewModel;
	salesOrderItemViewModel: refSalesOrderItemViewModel.SalesOrderItemViewModel;

	// flag for navigation to show changes
	//To enable/disable save button on based of invoiced status
	isSaveEnable: KnockoutObservable<boolean> = ko.observable(false);
	listProgressLinks: KnockoutObservable<boolean> = ko.observable(false);
	listProgressLinksAccordian: KnockoutObservable<boolean> = ko.observable(false);
	//for Multileg
	listProgressMultileg: KnockoutObservable<boolean> = ko.observable(false);
	listProgressMultilegAccordian: KnockoutObservable<boolean> = ko.observable(false);
	//for Claim
	listProgressClaim: KnockoutObservable<boolean> = ko.observable(false);
	listProgressClaimAccordian: KnockoutObservable<boolean> = ko.observable(false);
	//for Invoice Exception
	listProgressInvoiceException: KnockoutObservable<boolean> = ko.observable(false);
	listProgressInvoiceExceptionAccordian: KnockoutObservable<boolean> = ko.observable(false);
	//for Dispute
	listProgressDispute: KnockoutObservable<boolean> = ko.observable(false);
	listProgressDisputeAccordian: KnockoutObservable<boolean> = ko.observable(false);

	// To enable save button
	isSetModelAndSave: KnockoutObservable<boolean> = ko.observable(true);
	isChange: KnockoutObservable<boolean> = ko.observable(false);
	processStatusId: KnockoutObservable<number> = ko.observable(-1);
	isNotSaving: boolean = true;

	//identify call from Edit
	isCallFromEdit: KnockoutObservable<boolean> = ko.observable(true);

	// To check whether user has permission to create VB from SO
	havePermissionToCreateVBFromSO: KnockoutObservable<boolean> = ko.observable(true);

	// flag to set whether we have to show/hide create bill
	isCreateBillVisible: KnockoutObservable<boolean> = ko.observable(true);
	// To enable save button
	isSetModelAndCopy: KnockoutObservable<boolean> = ko.observable(true);
	// true on click of onCopy button
	isCopy: KnockoutObservable<boolean> = ko.observable(false);
	// flag to set whether we have to show/hide Cancel Sales Order
	isCancelSalesOrder: KnockoutObservable<boolean> = ko.observable(false);

	// flag to set whether we have to show/hide Un - Cancel Sales Order
	isUnCancelSalesOrder: KnockoutObservable<boolean> = ko.observable(false);

	//##START: US22798
	//flag to set whether we have to enable/disable Cancel/Uncancel sales order
	isEnableCancelUnCancelSalesOrder: KnockoutObservable<boolean> = ko.observable(true);
	isEnablePrintBOL: KnockoutObservable<boolean> = ko.observable(true);
	//##END: US22798

	// ###START: US25171
	isRequestCredit: KnockoutObservable<boolean> = ko.observable(false);

	// ###END: US25171

	// Utility class object
	CommonUtils: CommonStatic = new Utils.Common();

	//CostDifference For RebillTab
	costDiff: KnockoutObservable<number> = ko.observable(0);
	// flag to set whether we have to show/hide Create Sub Order button.
	isCreateSubOrder: KnockoutObservable<boolean> = ko.observable(false);

	mainVBCost: KnockoutObservable<number> = ko.observable(0);

	mainSOCost: KnockoutObservable<number> = ko.observable(0);

	mainFinalCost: KnockoutObservable<number> = ko.observable(0);
	statusChangedByCRR: KnockoutObservable<boolean> = ko.observable(false);
	noteDescription: KnockoutObservable<string> = ko.observable('');
	canEnterZeroRevenue: KnockoutObservable<boolean> = ko.observable(false)
	isPermissonToNegativemargin: KnockoutObservable<boolean> = ko.observable(false)
    canSeeCustomerTermType: KnockoutObservable<boolean> = ko.observable(false)
	// Text to show on ScheduleInvoice.
	scheduleInvoiceText: KnockoutObservable<string> = ko.observable('');
	//isNewOrder
	isNewSubOrder: KnockoutObservable<boolean> = ko.observable(false);
	errorCode: KnockoutObservable<number> = ko.observable(0);
	isBSCOSTEditable: KnockoutObservable<boolean> = ko.observable(false);
	// flag for disabling all the fields for the account receivable
	IsReadOnly = false;
	//##START: DE21287
	IsTruckLoadOrder = false;
	//##END: DE21287

	//// ###START: US25349
	IsTruckLoadSubOrder = false;
	InvoiceStatus: number;
	//// ###END: US25349

	CanCreateNotes = false;
	IsMultileg: boolean = false;
	// For Toastr
	public viewDetail: (msg) => any;
	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	private checkMsgDisplay: boolean = true;
	//when click on make copy if user choose no then it will call and default item section will show
	public checkMsgOnMakeCopyClick: () => any;
	// ##START: DE21308
	public checkMsgOnScheduleInvoiceClick: () => any;
	// ##END: DE21308
	private setUpModelAndCopy: () => any;
	public cancelSalesOrder: (msg) => any;
	public unCancelSalesOrder: (msg) => any;
	private savedSalesOrderId: number;
	public isCustomerBillTo: boolean = true;
	public revenueIsZeroAndCostIsGreaterThenZero: () => any;
	public revenueIsZeroAndCostIsZero: () => any;
	public splitMarginAccepted: () => any;
	public saveScheduleInvoice: () => any;
	BOlNumber: string = '';
	salesOrderDetailsObject: ISalesOrderDetail;
	estimateDueDate: KnockoutObservable<any> = ko.observable('');
	//To visible for ReBill button
	isEditRebill: KnockoutObservable<boolean> = ko.observable(false);
	isReload: KnockoutObservable<boolean> = ko.observable(false);
	updateFlag: KnockoutObservable<boolean> = ko.observable(false);
	oldTotalCost: KnockoutObservable<number> = ko.observable(0);
	newtotalCost: KnockoutObservable<number> = ko.observable(0);
	updatedCostTotalCost: KnockoutObservable<number> = ko.observable(0);
	isDisputeSectionVisible: KnockoutObservable<boolean> = ko.observable(false);

	// keep the suborder count
	subOrderCount: number = 0;
	isGetSalesOrderDispute: KnockoutObservable<boolean> = ko.observable(false);
	// Click event for the tab/ accordion
	getSalesOrderDispute: () => any;

	// flag to set whether we have to show/hide Schedule Invoice.
	isScheduleInvoiceVisible: KnockoutObservable<boolean> = ko.observable(false);
	// if schedule invoice is clicked
	isScheduleInvoice: boolean = false;
	// to enable make copy buttom
	canMakeCopy: KnockoutObservable<boolean> = ko.observable(false);
	// to enable create bill button
	canCreateBill: KnockoutObservable<boolean> = ko.observable(false);

	//store sales order id to fetch financial details
	salesOrderId: number;

	//salesOrderOriginalRevenue: any;
	salesOrderOriginalRevenue: number;
	salesOrderOriginalPlcCost: number;
	commonUtils: CommonStatic = new Utils.Common();
	currentDateTime: KnockoutObservable<string> = ko.observable('');

	resizeFunction: () => any;

	// for detecting changes
	isNotAtLoadingTime: boolean = false;

	isSetToFinalize: KnockoutObservable<boolean> = ko.observable(false);
	isSetToFinalizeEnable: KnockoutObservable<boolean> = ko.observable(true);
	isScheduleInvoiceEnable: KnockoutObservable<boolean> = ko.observable(true);

	salesOrderPageTitle: (QuoteId, ServiceType, processFlowFlag) => any;
	changesDetected: (dirty: boolean) => any;
	modelSaveEnable: boolean = false;

	//##START DE20307
	expandSourceImage: KnockoutObservable<string> = ko.observable('Content/images/expand.png');//src of expand
	collapseSourceImage: KnockoutObservable<string> = ko.observable('Content/images/collapse.png');//src of collapse
	//##END DE20307

	//START US18837
	salesOrderItemsOnLoad: any;
	isFromDatabase: boolean = false;
	//END US18837

	//##START: US19354
	salesorderCarrierIdOnLoad: any;
	salesOrderAddressOnLoad: any;
	//##END: US19354

	// ##START: DE21308
	isYesClickedOnScheduleInvoiceToastr: boolean = false;
	// ##END: DE21308

	// ###START: US25277
	creditReasonOptions: Array<ICreditReason> = [];
	totalPendingCreditAmount: KnockoutObservable<number> = ko.observable();
	// ###END: US25277

	// ##START: US25310
	isSubOrder: KnockoutObservable<boolean> = ko.observable(false); // check if the order is a suborder (true for new/existing)
	// ##END: US25310

	// ###START: US25679
	totalPendingVendorAmount: KnockoutObservable<number> = ko.observable();
	// ###END: US25679

	// ##START: DE25233
	orderStatusOnLoad: number;
	isUnCancelToastrShown: boolean = false;
	checkMsgClickOnUncancelToastr: () => any;
	// ##END: DE25233

	// ###START: US26377
	isMakeCopyVisible: KnockoutObservable<boolean> = ko.observable(false);
	// ###END: US26377

	isRedirectedFromCC: boolean = $.cookie("IsRedirectedFromCC") && $.cookie("IsRedirectedFromCC") == "true" ? true : false;
	//#endregion

	//#region Constructor
	constructor() {
		var self = this;

		// get the logged in user details object
		if (!self.currentUser()) {
			// Get the logged in user for name for new note}
			_app.trigger("GetCurrentUserDetails", function (currentUser: IUser) {
				self.currentUser(currentUser);
			});
		}

		self.salesOrderLinksViewModel = new refSalesOrderLinksViewModel.SalesOrderLinksViewModel();
		self.salesOrderHistoryViewModel = new refSalesOrderHistoryViewModel.SalesOrderHistoryViewModel();
		self.salesOrderHazmatViewModel = new refSalesOrderHazmatViewModel.SalesOrderHazmatViewModel();
		self.salesOrderDisputeViewModel = new refSalesOrderDisputeViewModel.SalesOrderDisputeViewModel(
			() => {
				self.isGetSalesOrderDispute(true);
				self.getSalesOrderDispute();
			},
			// ##START: US25310
			() => {
				self.showHideRequestCreditSalesOrder(self.salesOrderDetailsViewModel.selectedInvoiceStatus(), self.salesOrderDetailsViewModel.vendorbillid());
			});
		// ##END: US25310
		self.salesOrderPODDocViewModel = new refSalesOrderPODDocViewModel.SalesOrderPODDocViewModel();
		self.salesOrderNotesViewModel = new refSalesOrderNotesViewModel.SalesOrderNotesViewModel();
		self.salesOrderClaimViewModel = new refSalesOrderClaimViewModel.SalesOrderClaimViewModel;
		self.salesOrderCreditMemoViewModel = new refSalesOrderCreditMemoViewModel.SalesOrderCreditMemoViewModel(); //US20089
		self.salesOrderAgentNotificationViewModel = new refSalesOrderAgentNotificationViewModel.SalesOrderAgentNotificationViewModel();
		self.salesorderInvoiceExceptionViewModel = new refSalesOrderInvoiceExceptionViewModel.SalesOrderInvoiceExceptionViewModel();
		self.salesOrderAuditViewModel = new refSalesOrderAuditViewModel.SalesOrderAuditViewModel();
		self.salesOrderMasViewModel = new refSalesOrderMasViewModel.SalesOrderMasViewModel(); // US21133
		self.salesorderReBillViewModel = new refSalesOrderReBillViewModel.SalesOrderReBillViewModel((items: Array<any>, type: number, selectedAllItems: boolean) => {
			if (items.length > 0) {
				self.salesOrderItemViewModel.copyRevenueAndCost(items, type, selectedAllItems); // ###START: US22365
				if (self.isAccordion()) {
					self.expandView("collapseItems");
				} else {
					self.onItemsClick();
				}
				// ###END: US22365
			}
		});

		self.salesOrderDetailsViewModel = new refSalesOrderDetailsViewModel.SalesOrderDetailsViewModel((customerId: number) => {
			if (self.salesOrderAddressViewModel && self.salesOrderAddressViewModel.addressBookSerachViewModel)
				//call service
				var successCallBack = function (data) {
					var BillToaddress = new refAddress.Models.SalesOrderAddress();
					BillToaddress.CompanyName = data.CompanyName;
					BillToaddress.Phone = data.Phone;
					BillToaddress.Fax = data.Fax;
					BillToaddress.Street = data.Street;
					BillToaddress.Street2 = data.Street2;
					BillToaddress.City = data.City;
					BillToaddress.State = data.State;
					BillToaddress.ZipCode = data.ZipCode;
					BillToaddress.Country = data.CountryCode;
					self.salesOrderAddressViewModel.populateBillToAddress(BillToaddress);
					self.salesOrderAddressViewModel.addressBookSerachViewModel.name(new refAddressBookSearch.Models.AddressBookSearch());
					self.salesOrderAddressViewModel.shipperCompanySearchList.customerId(self.salesOrderDetailsViewModel.customerSearchList.customerId());
					self.salesOrderAddressViewModel.consigneeCompanySearchList.customerId(self.salesOrderDetailsViewModel.customerSearchList.customerId());
				},
					faliureCallBack = function () {
					};
			if (self.isCustomerBillTo) {
				self.salesOrderClient.getCustomerDefaultBillingAddress(customerId, successCallBack, faliureCallBack);
				self.salesOrderAddressViewModel.addressBookSerachViewModel.customerId(customerId);
			}
		}, () => {
				if (self.isAccordion()) {
					// TODO: add the code here for open the accordion after tab press or lost focus
					self.expandView('collapseItems');
					$('#itemsDiv').focus();
				}
				else {
					self.collapseAllTabs();
					$('#item').addClass('active in');
					$('#itemLink').addClass('active');
				}
			},
			(shipBy: string) => {
				if (self.salesOrderShippingViewModel) {
					self.changeServiceType(shipBy);
				}
			},
			// ###START: US22795
			self.currentUser(), false);
		// ###END: US22795
		self.salesOrderAddressViewModel = new refSalesOrderAddressViewModel.SalesOrderAddressViewModel((orignZip: string, destinationZip: string, orignZipCode?: string, destinationZipCode?: string) => {
			if (self.salesOrderDetailsViewModel) {
				self.salesOrderDetailsViewModel.originZip(orignZip);
				self.salesOrderDetailsViewModel.destinationZip(destinationZip);
			}
		},
			() => {
				if (self.isAccordion()) {
					// TODO: add the code here for open the accordion after tab press or lost focus
					self.collapseView('collapseAddress');
					self.expandView('collapseShipping');
					$('#shippingDiv').focus();
				}
				else {
					self.collapseAllTabs();
					$('#shipping').addClass('active in');
					$('#shippingLink').addClass('active');
				}
			});

		//shipping View Model reference.
		self.salesOrderShippingViewModel = new refSalesOrderShipping.salesOrderShippingViewModel(false, self.currentUser(),
			() => {
				if (self.isAccordion()) {
					self.collapseView('collapseShipping');
					self.expandView('collapseShipmentNotes');
					$('#shippmentNotesDiv').focus();
				}
				else {
					self.collapseAllTabs();
					$('#shipmentNotes').addClass('active in');
					$('#shipmentNotesLink').addClass('active');
				}
			}, (carrierType) => {
				if (carrierType === 3 || carrierType === 7) {
					if (self.salesOrderItemViewModel.salesOrderItemsList().length > 0 && self.salesOrderItemViewModel.salesOrderItemsList().length !== undefined) {
						self.salesOrderItemViewModel.salesOrderItemsList().forEach((items) => {
							if (items.itemId() === 10) {
								items.isServiceTypeTruckload(false);
							}
							items.carrierType(carrierType);
							self.salesOrderItemViewModel.carrierType(carrierType);
						});
					}
					//for (var i = 0; i < self.salesOrderItemViewModel.salesOrderItemsList().length; i++) {
					//	if (self.salesOrderItemViewModel.salesOrderItemsList()[i].itemId() === 10) {
					//		self.salesOrderItemViewModel.salesOrderItemsList()[i].isServiceTypeTruckload(false);
					//	}
					//}
				}
				else {
					if (self.salesOrderItemViewModel.salesOrderItemsList().length > 0 && self.salesOrderItemViewModel.salesOrderItemsList().length !== undefined) {
						self.salesOrderItemViewModel.salesOrderItemsList().forEach((items) => {
							if (items.itemId() === 10 && items.userDescription() !== 'Ocean Initial Cost') {
								items.isServiceTypeTruckload(true);
								items.isServiceTypeOcean(true);
							} else if (items.itemId() === 10 && items.userDescription() === 'Ocean Initial Cost') {
								items.isServiceTypeTruckload(false);
								items.isServiceTypeOcean(false);
							}

							////self.salesOrderItemViewModel.salesOrderItemsList()[i].carrierType(carrierType);
							self.salesOrderItemViewModel.carrierType(carrierType);
						});
					}
					//for (var i = 0; i < self.salesOrderItemViewModel.salesOrderItemsList().length; i++) {
					//	if (self.salesOrderItemViewModel.salesOrderItemsList()[i].itemId() === 10) {
					//		self.salesOrderItemViewModel.salesOrderItemsList()[i].isServiceTypeTruckload(true);
					//	}
					//}
				}
			});
		self.salesOrderMultiLegViewModel = new refSalesOrderMultilegViewModel.SalesOrderMultiLegViewModel(self.isCallFromEdit());
		self.salesOrderItemViewModel = new refSalesOrderItemViewModel.SalesOrderItemViewModel((totalCost: number, totalWeight: number, totalPices: number, totalRevenue: number, totalBSCost?: number) => {
			//to update cost and revenue fields.
			if (self.salesOrderDetailsViewModel.salesOrderRevenue() && self.isCallFromEdit() && self.isNotAtLoadingTime === false) {
				var finalRevenueDiff = totalRevenue - self.salesOrderItemViewModel.originalTotalRevenue();
				var originalFinalBSCostDiff = totalBSCost - self.salesOrderItemViewModel.originalTotalBSCost();

				if (self.SalesOrderFinancialDetailsModel !== undefined) {
					var originalTotalRevinue = self.salesOrderDetailsViewModel.originalFinalRevenue() + (finalRevenueDiff);
					var soFinalCost = (self.salesOrderDetailsViewModel.soFinalCost() - self.salesOrderItemViewModel.originalTotalCost()) + totalCost;
					//var soFinalCost = self.salesOrderDetailsViewModel.soFinalCost() + soFinalCostDiff;
					var originalFinalBSCost = self.salesOrderDetailsViewModel.soOriginalFinalBSCost() + originalFinalBSCostDiff;
					self.GetSalesOrderFinancialDetailsOnSubscribe(originalTotalRevinue, soFinalCost, originalFinalBSCost);
				}
			}
			self.salesOrderDetailsViewModel.salesOrderAmount(totalCost.toFixed(2));
			self.newtotalCost(parseFloat(totalCost.toFixed(2).toString().replace(/,/g, "")));
			self.salesOrderDetailsViewModel.salesOrderRevenue(totalRevenue.toFixed(2));

			// ###START: DE23007
			self.salesOrderShippingViewModel.totalWeigth(totalWeight);
			self.salesOrderShippingViewModel.totalPieces(totalPices);
			// ###END: DE23007

			if (self.salesOrderDetailsViewModel.grosscost() === null || self.salesOrderDetailsViewModel.grosscost() === undefined) {
				self.salesOrderDetailsViewModel.grosscost(0);
			}

			self.salesOrderDetailsViewModel.grosscost(parseFloat(self.salesOrderDetailsViewModel.gcost().toFixed(2).toString().replace(/,/g, "")) + parseFloat(totalCost.toFixed(2).toString().replace(/,/g, "")));

			if (self.isNewSubOrder()) {
				self.mainSOCost(parseFloat(self.mainFinalCost().toFixed(2).toString().replace(/,/g, "")) + parseFloat(totalCost.toFixed(2).toString().replace(/,/g, "")));
			}
		},
			() => {
				//to close items accordion and to  open Shipping Accordion
				if (self.isAccordion()) {
					self.collapseView('collapseItems');
					self.expandView('collapseAddress');
					$('#addressDiv').focus();
					$('#collapseAddress').css("overflow", "visible");
				}
				else {
					self.collapseAllTabs();
					$('#address').addClass('active in');
					$('#addressLink').addClass('active');
				}
			},

			//Hazmat item checked
			(salesOrderItem: Array<refSalesOrderItemModel.Models.SalesOrderItemsModel>) => {
				self.salesOrderHazmatViewModel.initializeHazmatGrid(salesOrderItem, self.modelSaveEnable);
			});

		//#region Subscribe functions
		self.salesOrderDetailsViewModel.proNumber.subscribe((newValue) => {
			self.salesOrderMultiLegViewModel.groundProNumber(self.salesOrderDetailsViewModel.proNumber());
		});

		self.salesOrderShippingViewModel.transitDays.subscribe((newValue) => {
			self.salesOrderMultiLegViewModel.groundTransitDays(self.salesOrderShippingViewModel.transitDays());
		});

		self.salesorderAuditedBillViewModel = new refSalesOrderAuditedBillViewModel.SalesOrderAuditedBillViewModel((items: Array<ISalesOrderItem>) => {
			if (items.length > 0) {
				self.salesOrderItemViewModel.updateAuditedBill(items, self.salesOrderDetailsViewModel.salesOrderId(), self.salesOrderDetailsViewModel.estimatedProfitPer(), self.salesOrderDetailsViewModel.finalProfitPer(), self.salesOrderDetailsViewModel.customerTypeOf(), self.salesOrderDetailsViewModel.feeStructure(), self.salesOrderDetailsViewModel.gtMinMargin(), self.salesOrderDetailsViewModel.isBillingStation(), self.salesOrderDetailsViewModel.gtzMargin(), self.salesOrderDetailsViewModel.plcMargin());
			}
		});

		// To open Sales Order details
		self.viewDetail = () => {
			// opens the details tab or the current created bill
			_app.trigger("openSalesOrder", self.savedSalesOrderId, self.savedSalesOrderId.toString(), (callback) => { });
			return true;
		}

		//##START: US20208
		//##START: US22955
		self.cancelSalesOrder = (note: string) => {
			self.ShowProgressBar(true);
			self.clearLocalStorage(self.salesOrderDetailsViewModel.salesOrderNumber());

			var cancelData: ISalesOrderCancelData = {
				ReasonNote: note,
				ShipmentId: self.salesOrderDetailsViewModel.salesOrderId(),
				UpdatedDateTime: self.salesOrderDetailsViewModel.UpdatedDateTime()
			};

			self.salesOrderClient.cancelSalesOrder(cancelData, message => {
				//##END: US22955
				var messagetype;
				var displayMessage;
				if (message === 1) {
					displayMessage = ApplicationMessages.Messages.CancelSalesOrderSuccessfully;
					messagetype = refEnums.Enums.ToastrMessageType.success.ID
				}
				else if (message === 2) {
					displayMessage = ApplicationMessages.Messages.CancelSalesOrderSuccessfullyInsuranceCancelFailed;
					//##START: DE21392
					messagetype = refEnums.Enums.ToastrMessageType.info.ID
					//##END: DE21392
				}
				else if (message === 3) {
					displayMessage = ApplicationMessages.Messages.CancelSalesOrderFailed;
					messagetype = refEnums.Enums.ToastrMessageType.error.ID
				}
				if (self.checkMsgDisplay) {
					self.checkMsgDisplay = false;
					self.isCancelSalesOrder(false);
					self.isUnCancelSalesOrder(true);
					var toastrOptions1 = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
					//changed in true as per requirement
					Utility.ShowToastr(messagetype, displayMessage, "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
				}
				self.beforeBind();
				//self.loadViewAfterComposition();
			}, message => {
					// Saving failed call back
					self.ShowProgressBar(false);
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				});
		}
		//##END: US20208

		self.unCancelSalesOrder = () => {
			// ###START: US25587
			self.showListProgress(true);
			// ###END: US25587
			self.clearLocalStorage(self.salesOrderDetailsViewModel.salesOrderNumber());
			self.salesOrderClient.UnCancelSalesOrder(self.salesOrderDetailsViewModel.salesOrderId(), self.salesOrderDetailsViewModel.UpdatedDateTime(), message => {
				if (self.checkMsgDisplay) {
					self.checkMsgDisplay = false;
					self.isCancelSalesOrder(true);
					self.isUnCancelSalesOrder(false);
					var toastrOptions1 = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.UnCancelSalesOrderSuccessfully, "Success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
				}
				self.beforeBind();
				//self.loadViewAfterComposition();
			}, message => {
					// Saving failed call back
					self.ShowProgressBar(false);
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
				//changed in true as per requirement
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				});
		}

		//To check if Msg is clicked
		self.checkMsgClick = () => {
			self.checkMsgDisplay = true;
			self.isViewMessage = true;
		}

	// to Check if Msg is hidden or closed
		self.checkMsgHide = () => {
			self.checkMsgDisplay = true;
			self.isViewMessage = true;
		}

		//To check if Msg is clicked
		self.checkMsgOnMakeCopyClick = () => {
			self.ShowDefaultItemTab();
			self.checkMsgDisplay = true;
			self.isViewMessage = true;
		}

		//To check if Msg is clicked on schedule invoice toastr
		// ##START: DE21308
		self.checkMsgOnScheduleInvoiceClick = () => {
			if (!self.isYesClickedOnScheduleInvoiceToastr) {
				self.ShowProgressBar(false);
			}
			self.checkMsgDisplay = true;
			self.isViewMessage = true;
		}

		// ##END: DE21308

		// ##START: DE25233
		//To check if Msg is clicked
		self.checkMsgClickOnUncancelToastr = () => {
			self.checkMsgDisplay = true;
			self.isViewMessage = true;

			if (!self.isUnCancelToastrShown) {
				self.ShowProgressBar(false);
			}
		}
		// ##END: DE25233

		self.revenueIsZeroAndCostIsGreaterThenZero = () => {
			// ###START: US24323
			self.salesOrderSaveData.SalesOrderDetail.InvoiceStatus = refEnums.Enums.InvoiceStatus.Scheduled.ID;

			// ###END: US24323
			self.salesOrderSaveData.SalesOrderDetail.ProcessStatusId = refEnums.Enums.OrderStatus.Shipment_Finalized.ID;
			self.statusChangedByCRR(true);
			self.noteDescription('BOL ' + self.salesOrderSaveData.SalesOrderDetail.BolNumber + ' Invoice Status Change confirmed by ' + self.currentUser().FullName + ' on ' + self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
			self.checkMsgDisplay = true;
			self.isViewMessage = true;
			self.saveData();
		}

		//#region setUpModelAndCopy
		// Gets the data from all the different view model and sends those to service
		self.setUpModelAndCopy = () => {
			// to show item tab by default when click on save
			self.isCopy(true);
			var salesOrderData = new refSalesOrderContainerModel.Model.SalesOrderContainer();

			salesOrderData.SalesOrderDetail = self.getSalesOrderDetails();
			salesOrderData.SalesOrderAddressDetails = self.getSalesOrderAddress();
			salesOrderData.SalesOrderItemDetails = self.getSalesOrderItemsDetails();
			salesOrderData.MultilegCarrierHubAddress = self.getSalesOrderTerminalAddress();
			salesOrderData.MultilegCarrierDetails = self.getSalesOrderMultilegCarrierDetails();

			self.showListProgress(true);
			self.isSetModelAndCopy(false);
			self.isCopy(false);

			refSalesOrderClient.SalesOrderClient.prototype.CopySalesOrderDetail(salesOrderData, function (message) {
				// Saving successful callback
				self.isNotSaving = false;

				self.showListProgress(false);
				// Show confirm message to take an action to the user so that, he can decide weather he wants to add another bill or just want to go to the
				// Details of current created bill

				self.BOlNumber = self.salesOrderDetailsViewModel.salesOrderNumber();
				//self.ProNumber = self.vendorBillViewModel.proNumber();
				self.savedSalesOrderId = message;

				if (self.checkMsgDisplay) {
					self.checkMsgDisplay = false;
					var actionButtons: Array<IToastrActionButtonOptions> = [];
					actionButtons.push({
						actionButtonName: self.savedSalesOrderId.toString(),
						actionClick: self.viewDetail
					});

					var toastrOptions: IToastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 30,
						fadeOut: 30,
						typeOfAlert: "",
						title: "",
						actionButtons: actionButtons
					};

					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SalesOrderCopiedSuccessfullyMessage, "success", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				}
			}, (message) => {
					_app.trigger("IsBIDirtyChange", self.isChange(false));

					// Saving failed call back
					self.showListProgress(false);
					self.isSetModelAndCopy(true);
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				});
		}
		//#endregion
        self.isCustomerBillTo = false;

		//To load Dispute Details
		self.getSalesOrderDispute = () => {
			//checkiing view is Accordion or tabbed as per that calling service once
			if (self.isAccordion()) {
				if (!$('#collapseDispute').hasClass('in') || self.isGetSalesOrderDispute()) {
					self.callgetSalesOrderDispute();
				}
			} else {
				if ((!$('#dispute').hasClass('in') || self.isGetSalesOrderDispute()) && (!$('#DisputeLink').hasClass('in') || self.isGetSalesOrderDispute())) {
					self.callgetSalesOrderDispute();
				}
			}

			// To avoid tabs goes blank on quick move between tabs
			self.collapseAllTabs();
			$('#dispute').addClass('active in');
			$('#DisputeLink').addClass('active in');
		}

		self.resizeFunction = () => {
			//on click we are calling this flag to show grid column resizebal as per browser window
			self.salesOrderNotesViewModel.reportContainer.isAttachedToView(false);
			self.salesOrderNotesViewModel.reportContainer.isAttachedToView(true);
			//on click we are calling this flag to show grid column resizebal as per browser window
			self.salesOrderPODDocViewModel.reportContainer.isAttachedToView(false);
			self.salesOrderPODDocViewModel.reportContainer.isAttachedToView(true);

			//##START: US20089
			//on click we are calling this flag to show grid column resizebal as per browser window
			self.salesOrderCreditMemoViewModel.reportContainer.isAttachedToView(false);
			self.salesOrderCreditMemoViewModel.reportContainer.isAttachedToView(true);
			//##END: US20089
		}

		//TO set grid column after browser resizing
		window.addEventListener("resize", self.resizeFunction);

		// Enables or disables the save button and also makes the window as dirty flag
		self.changesDetected = (dirty: boolean) => {
			if (self.isNotAtLoadingTime === false) {
				if (dirty || (self.salesOrderDetailsViewModel && self.salesOrderDetailsViewModel.carrierSearchList.returnValue)
					|| (self.salesOrderDetailsViewModel && self.salesOrderDetailsViewModel.customerSearchList.returnValue)
					|| (self.salesOrderDetailsViewModel && self.salesOrderDetailsViewModel.returnValueFlag)
					|| (self.salesOrderAddressViewModel && self.salesOrderAddressViewModel.returnValue)
					|| (self.salesOrderAddressViewModel && self.salesOrderAddressViewModel.shipperCompanySearchList.returnValue)
					|| (self.salesOrderAddressViewModel && self.salesOrderAddressViewModel.consigneeCompanySearchList.returnValue)
					|| (self.salesOrderAddressViewModel && self.salesOrderAddressViewModel.shipperLocation.returnValue)
					|| (self.salesOrderAddressViewModel && self.salesOrderAddressViewModel.consigneeLocation.returnValue)
					|| (self.salesOrderAddressViewModel && self.salesOrderAddressViewModel.billToLocation.returnValue)
					|| (self.salesOrderShippingViewModel && self.salesOrderShippingViewModel.returnValue)
					|| (self.salesOrderNotesViewModel && self.salesOrderNotesViewModel.returnValue())
					|| (self.salesOrderNotesViewModel && self.salesOrderNotesViewModel.ischange())
					|| (self.salesOrderItemViewModel && self.salesOrderItemViewModel.returnValue())
					|| (self.salesorderReBillViewModel && self.salesorderReBillViewModel.returnValue)
					|| (self.salesOrderHazmatViewModel && self.salesOrderHazmatViewModel.returnValue)
					) {
					if (self.isChange) {
						self.isChange(true);
						if (self.modelSaveEnable) {
							self.isSaveEnable(true);
						} else {
							self.isSaveEnable(false);
						}
					};
				}
				else {
					if (self.isChange) self.isChange(false);
				}

				if (self.isSaveEnable && self.isSaveEnable()) {
					if (self.isChange) _app.trigger("IsBIDirtyChange", self.isChange());
				}

				// ###START: DE21426
				if ((self.isSaveEnable && self.isSaveEnable()) && (self.salesOrderNotesViewModel && self.salesOrderNotesViewModel.returnValue())) {
					if (self.isChange) _app.trigger("IsBIDirtyChange", self.isChange());
				}
				// ###END: DE21426
			}
		}

		//#region Change detection functions
		self.CallChangeMadeFunctions();

		//#endregion
	}

	//#endregion
	//#endregion

	//#region Internal Methods
	public callgetSalesOrderDispute() {
		var self = this;
		self.showlistProgressForDispute(true);

		// ##START: US24865
		if (typeof self.salesOrderDisputeViewModel.disputeEmailTemplates === 'undefined' || self.salesOrderDisputeViewModel.disputeEmailTemplates.length === 0) {
			self.salesOrderDisputeViewModel.getAllDisputeEmailTemplates();
		}
		// ##END: US24865

		var successCallBack = function (data) {
			var commonUtils = new Utils.Common();
			self.showlistProgressForDispute(false);
			self.salesOrderDisputeViewModel.salesOrderIdMain(self.salesOrderDetailsViewModel.salesOrderId());
			self.salesOrderDisputeViewModel.disputeData(data);
			// ###START: DE21749
			self.salesOrderDisputeViewModel.isVisibleDisputeDetails(false);
			self.salesOrderDisputeViewModel.internalDisputeStatusId(undefined);
			self.salesOrderDisputeViewModel.isBillStatusDisputeOnly(false);
			self.salesOrderDisputeViewModel.isSelected(false);
			// ###END: DE21749
			// ###START: US20687
			self.salesOrderDisputeViewModel.bolNumber(self.salesOrderDetailsViewModel.salesOrderNumber());
			// ###END: US20687

			// ##START: US25310
			self.salesOrderDisputeViewModel.mainBOLNumber = self.salesOrderDetailsViewModel.mainBolNo();
			// ##END: US25310

			// ##START: US22053
			self.salesOrderDisputeViewModel.carrierName = self.salesOrderDetailsViewModel.carrierSearchList.vendorName();
			// ##END: US22053

			// ##START: US21131
			self.salesOrderDisputeViewModel.initializeDispute(data, self.salesOrderAgentNotificationViewModel.salesRepId(), self.salesOrderDetailsViewModel.customerId(), !self.IsReadOnly);
			// ##END: US21131
			self.isGetSalesOrderDispute(false);
		},
			faliureCallBack = function () {
				self.showlistProgressForDispute(false);
			};
		self.salesOrderClient.GetMultipleVendorBillDetailsForIterm(self.salesOrderDetailsViewModel.salesOrderId(), successCallBack, faliureCallBack);
	}

	public GetSalesOrderFinancialDetailsOnSubscribe(totalRevenue: number, soFinalCost: number, totalBSCost?: number) {
		var self = this;

		// ###START: DE22879
		if (soFinalCost == null) {
			soFinalCost = 0.0;
		}

		// ###END: DE22879

		// ###START: DE23427
		// ##START: DE24777
		if ($.isNumeric(soFinalCost) && $.isNumeric(totalRevenue)) {

			self.SalesOrderFinancialDetailsModel.SOFinalCost = soFinalCost;
			self.SalesOrderFinancialDetailsModel.FinalRevenue = totalRevenue;
			self.SalesOrderFinancialDetailsModel.FinalBSCost = totalBSCost;

			self.salesOrderClient.GetSalesOrderFinancialDetailsOnSubscribe(self.SalesOrderFinancialDetailsModel, (data) => {
				if (data) {
					self.salesOrderDetailsViewModel.finalRevenue($.number(data.FinalRevenue, 2));
					self.salesOrderDetailsViewModel.finalCost($.number(data.VBFinalCost, 2));
					self.salesOrderDetailsViewModel.finalBSCost($.number(data.FinalBSCost, 2));
					self.salesOrderDetailsViewModel.finalProfit($.number(data.FinalProfit, 2));
					self.salesOrderDetailsViewModel.finalProfitPer($.number(data.FinalProfitPercent, 2));
					self.salesOrderDetailsViewModel.costDiff($.number(data.CostDifference, 2));
					self.salesOrderDetailsViewModel.actualProfit($.number(data.ActualProfit, 2));
					self.salesOrderDetailsViewModel.actualProfitPer($.number(data.ActualProfitPercent, 2));
					self.salesOrderDetailsViewModel.grossProfit($.number(data.GrossProfit, 2));
				}
			}, () => { });
		}
		// ##END: DE24777
		// ###END: DE23427
	}

	//#region Save
	private onSave() {
		var self = this;
		self.isScheduleInvoice = false;
		self.validationBeforeSave();
	}

	// check all validation before save
	private validationBeforeSave() {
		var self = this;
		self.salesOrderDetailsViewModel.validateSalesOrder();
		self.salesOrderAddressViewModel.validateAddresses();
		self.salesOrderShippingViewModel.validateShipping();
		self.salesOrderHazmatViewModel.validateHazmatItems();
		self.salesOrderHazmatViewModel.validateContact();
		self.salesOrderItemViewModel.validateItems();
		if (self.isAccordion()) {
			self.validateAccordionView();
		}
		else {
			self.validateTabbedView(self.salesOrderDetailsViewModel.validateSalesOrder(), self.salesOrderAddressViewModel.validateAddresses(), self.salesOrderItemViewModel.validateItems(), self.salesOrderHazmatViewModel.validateHazmatItems(), self.salesOrderHazmatViewModel.validateContact(), self.salesOrderShippingViewModel.validateShipping(), self.salesOrderMultiLegViewModel.validateMultilegdetails(self.IsMultileg));
		}

		// Validate each section data
		if (self.salesOrderDetailsViewModel.selectedShipVia() === 5) {
			if (!(self.isValidSalesOrder && self.isValidAddress && self.isValidItems && self.isValidHazmat && self.isValidShipping && self.isValidMultileg)) {
				self.ShowProgressBar(false);
				return;
			}
			else {
				if (self.isAccordion()) {
					//self.collapseAchorVendorBill();
					self.colapseAchorAddress();
					self.colapseAchorItems();
					self.colapseAchorShipping();
					self.collapseAnchorNotes();
					self.collapseAnchorPodDoc();
					self.collapseAnchorLinks();
					self.collapseAnchorHistory();
					self.collapseAnchorClaim();
					self.collapseAnchorCreditMemo();//US20089
					self.collapseAnchorAudit();
					self.collapseView('collapseHazmat');
					self.collapseView('collapseReBill');
				}
				if (self.validateRevenue()) {
					self.validateNotes();
				}
			}
		}
		else {
			if (!(self.isValidSalesOrder && self.isValidAddress && self.isValidItems && (self.isValidHazmat) && self.isValidShipping)) {
				self.ShowProgressBar(false);
				return;
			}
			else if (!self.validateForMauallyFinalizedStatus()) {
				if (self.salesOrderShippingViewModel.pickupDate() === undefined || self.salesOrderShippingViewModel.pickupDate() === '') {
					self.expandView('collapseShipping');
				}
				self.ShowProgressBar(false);
				return;
			}
			else if (!self.ValidateForAutoDispatchStatus()) {
				self.ShowProgressBar(false);
				return;
			}
			else {
				if (self.isAccordion()) {
					//self.collapseAchorVendorBill();
					self.colapseAchorAddress();
					self.colapseAchorItems();
					self.colapseAchorShipping();
					self.collapseAnchorNotes();
					self.collapseAnchorPodDoc();
					self.collapseAnchorLinks();
					self.collapseAnchorHistory();
					self.collapseAnchorClaim();
					self.collapseAnchorCreditMemo();//US20089
					self.collapseAnchorAudit();
					self.collapseView('collapseHazmat');
					self.collapseView('collapseReBill');
				}
				if (self.validateDeliverDate()) {
					self.validateEstimateDueDate();
					if (self.validateRevenue()) {
						self.validateNotes();
					}
				}
			}
		}
	}

	// function to validate tab view section
	private validateTabbedView(isSalesOrderValid, isSalesOrderAddressesValid, isSalesOrderItemValid, isHazmatValid, isHazmatValidContact, isShippingValid, isMultilegValid?) {
		var self = this;
		self.collapseAllTabs();

		if (isSalesOrderValid) {
			self.isValidSalesOrder = false;
		}
		else {
			self.isValidSalesOrder = true;
		}

		if (!isSalesOrderValid && isSalesOrderItemValid) {
			$('#item').addClass('active in');
			$('#itemLink').addClass('active');
			self.isValidItems = false;
		} else {
			self.isValidItems = true;
		}
		if (!isSalesOrderValid && !isSalesOrderItemValid && isSalesOrderAddressesValid) {
			$('#address').addClass('active in');
			$('#addressLink').addClass('active');
			self.isValidAddress = false;
		} else {
			self.isValidAddress = true;
		}

		if (!isSalesOrderValid && !isSalesOrderItemValid && !isSalesOrderAddressesValid && (isHazmatValid || isHazmatValidContact)) {
			$('#hazmat').addClass('active in');
			$('#hazmatLink').addClass('active');
			self.isValidHazmat = false;
		}
		else {
			self.isValidHazmat = true;
		}

		if (!isSalesOrderValid && !isSalesOrderItemValid && !isSalesOrderAddressesValid && !(isHazmatValid || isHazmatValidContact) && isShippingValid) {
			$('#shipping').addClass('active in');
			$('#shippingLink').addClass('active');
			self.isValidShipping = false;
		}
		else {
			self.isValidShipping = true;
		}

		//if (!isSalesOrderItemValid && !isSalesOrderAddressesValid && (!isHazmatValid && !isHazmatValidContact) && !isShippingValid) {
		//    $('#address').addClass('active in');
		//    $('#addressLink').addClass('active');
		//}
		//if (self.salesOrderDetailsObject.Id == 0) {
		if (!isSalesOrderValid && !isSalesOrderItemValid && !isSalesOrderAddressesValid && (!isHazmatValid && !isHazmatValidContact) && !isShippingValid && isMultilegValid) {
			$('#multileg').addClass('active in');
			$('#multilegLink').addClass('active');
			self.isValidMultileg = false;
		}
		else {
			self.isValidMultileg = true;
		}
		//}
		//else {
		//    self.isValidMultileg = true;
		//}

		if (self.isValidAddress && self.isValidItems && self.isValidHazmat && self.isValidShipping) {
			self.collapseAllTabs();

			$('#item').addClass('active in');
			$('#itemLink').addClass('active');
		}
	}

	// function to validate accordion view section
	private validateAccordionView() {
		var self = this;

		if (self.salesOrderDetailsViewModel.validateSalesOrder()) {
			self.isValidSalesOrder = false;
		}
		else {
			self.isValidSalesOrder = true;
		}

		self.collapseAllAccordion();

		if (self.salesOrderAddressViewModel.validateAddresses()) {
			$('#collapseAddress').collapse('show');
			$('#AchorcollapseAddress').removeClass('collapsed');
			self.isValidAddress = false;
			setTimeout(function () {
				$('#collapseAddress').css("overflow", "visible");
			}, 500);
		}
		else {
			self.isValidAddress = true;
			self.colapseAchorAddress();
		}
		if (self.salesOrderItemViewModel.validateItems()) {
			$('#collapseItems').collapse('show');
			$('#AchorcollapseItems').removeClass('collapsed');
			self.isValidItems = false;
		}
		else {
			self.isValidItems = true;
			self.colapseAchorItems();
		}

		if (self.salesOrderHazmatViewModel.validateContact() || self.salesOrderHazmatViewModel.validateHazmatItems()) {
			self.expandView('collapseHazmat');
			self.isValidHazmat = false;
		}
		else {
			self.isValidHazmat = true;
			self.collapseView('collapseHazmat');
		}

		// To open Shipping View if error comes
		if (self.salesOrderShippingViewModel.validateShipping()) {
			$('#collapseShipping').collapse('show');
			$('#AchorcollapseShipping').removeClass('collapsed');
			self.isValidShipping = false;
		}
		else {
			self.isValidShipping = true;
			self.colapseAchorShipping();
		}

		// To open Multileg View if error comes
		if (self.salesOrderMultiLegViewModel.validateMultilegdetails(self.IsMultileg)) {
			if (!self.IsMultileg) {
				self.expandView('collapseMultileg');
				$('#AchorcollapseItemsMultiLeg').removeClass('collapsed');
				self.isValidMultileg = false;
			}
			else {
				self.isValidMultileg = true;
			}
		}
		else {
			self.isValidMultileg = true;
			self.colapseAchorMultileg();
		}
	}

	private collapseAllAccordion() {
		if ($('#collapseNotes').hasClass('in')) {
			$('#collapseNotes').collapse('toggle');
			$('#AchorcollapseNotes').addClass('collapsed');
		}
		if ($('#collapseReBill').hasClass('in')) {
			$('#collapseReBill').collapse('toggle');
			$('#AchorcollapseRebill').addClass('collapsed');
		}

		if ($('#collapsePOD').hasClass('in')) {
			$('#collapsePOD').collapse('toggle');
			$('#AchorcollapsePOD').addClass('collapsed');
		}
		if ($('#collapseLinks').hasClass('in')) {
			$('#collapseLinks').collapse('toggle');
			$('#AchorcollapseLinks').addClass('collapsed');
		}

		if ($('#collapseHistory').hasClass('in')) {
			$('#collapseHistory').collapse('toggle');
			$('#AchorcollapseHistory').addClass('collapsed');
		}

		if ($('#collapseClaim').hasClass('in')) {
			$('#collapseClaim').collapse('toggle');
			$('#AchorcollapseClaim').addClass('collapsed');
		}
		//##START: US20089
		if ($('#collapseCreditMemo').hasClass('in')) {
			$('#collapseCreditMemo').collapse('toggle');
			$('#AchorcollapseCreditMemo').addClass('collapsed');
		}
		//##END: US20089
		if ($('#collapseAudit').hasClass('in')) {
			$('#collapseAudit').collapse('toggle');
			$('#AchorcollapseAudit').addClass('collapsed');
		}
		if ($('#collapseAuditedBill').hasClass('in')) {
			$('#collapseAuditedBill').collapse('toggle');
			$('#AchorcollapseAuditedBill').addClass('collapsed');
		}
		if ($('#collapseReBill').hasClass('in')) {
			$('#collapseReBill').collapse('toggle');
			$('#AchorcollapseRebill').addClass('collapsed');
		}
		if ($('#collapseDispute').hasClass('in')) {
			$('#collapseDispute').collapse('toggle');
			$('#AchorcollapseDispute').addClass('collapsed');
		}
		if ($('#collapseNotification').hasClass('in')) {
			$('#collapseNotification').collapse('toggle');
			$('#AchorcollapseNotification').addClass('collapsed');
		}
		if ($('#collapseMultileg').hasClass('in')) {
			$('#collapseMultileg').collapse('toggle');
			$('#AchorcollapseItemsMultiLeg').addClass('collapsed');
		}
		if ($('#collapseShipmentNotes').hasClass('in')) {
			$('#collapseShipmentNotes').collapse('toggle');
			$('#AchorcollapseShipmentNotes').addClass('collapsed');
		}
		// ###START: US21133
		if ($('#collapseMas').hasClass('in')) {
			$('#collapseMas').collapse('toggle');
			$('#AchorcollapseMas').addClass('collapsed');
		}
		// ###END: US21133
	}

	//## function to expand the view by ID, if any case we required
	private expandView(viewId: string) {
		if (!$('#' + viewId).hasClass('in')) {
			$('#' + viewId).addClass('in');
			$('#' + viewId).css("height", 'auto');
			$('#Achor' + viewId).removeClass('collapsed');
		}
	}

	//## function to collapse the items view by ID, if any case we required
	private collapseView(viewId: string) {
		$('#' + viewId).removeClass('in');
		$('#' + viewId).css("height", '0');
		$('#Achor' + viewId).addClass('collapsed');
		$('#collapseAddress').css("overflow", "hidden");
	}

	//Function to collapse all the TAB Sections
	private collapseAllTabs() {
		if ($('#address').hasClass('in')) {
			$('#address').removeClass('active in');
			$('#addressLink').removeClass('active');
		}
		if ($('#item').hasClass('in')) {
			$('#item').removeClass('active in');
			$('#itemLink').removeClass('active');
		}
		if ($('#shipping').hasClass('in')) {
			$('#shipping').removeClass('active in');
			$('#shippingLink').removeClass('active in');
		}

		if ($('#shipmentNotes').hasClass('in')) {
			$('#shipmentNotes').removeClass('active in');
			$('#shipmentNotesLink').removeClass('active in');
		}

		if ($('#tab_podDoc').hasClass('in')) {
			$('#tab_podDoc').removeClass('active in');
			$('#podDocLink').removeClass('active in');
		}

		if ($('#hazmat').hasClass('in')) {
			$('#hazmat').removeClass('active in');
			$('#hazmatLink').removeClass('active in');
		}

		if ($('#links').hasClass('in')) {
			$('#links').removeClass('active in');
			$('#linksLink').removeClass('active in');
		}

		if ($('#history').hasClass('in')) {
			$('#history').removeClass('active in');
			$('#historyLink').removeClass('active in');
		}

		if ($('#auditedBill').hasClass('in')) {
			$('#auditedBill').removeClass('active in');
			$('#AuditedBillLink').removeClass('active in');
		}
		if ($('#rebill').hasClass('in')) {
			$('#rebill').removeClass('active in');
			$('#rebillLink').removeClass('active in');
		}
		if ($('#audit').hasClass('in')) {
			$('#audit').removeClass('active in');
			$('#auditLink').removeClass('active in');
		}
		if ($('#multileg').hasClass('in')) {
			$('#multileg').removeClass('active in');
			$('#multilegLink').removeClass('active in');
		}
		if ($('#dispute').hasClass('in')) {
			$('#dispute').removeClass('active in');
			$('#DisputeLink').removeClass('active in');
		}
		if ($('#invoiceException').hasClass('in')) {
			$('#invoiceException').removeClass('active in');
			$('#invoiceExceptionLink').removeClass('active in');
		}
		if ($('#claim').hasClass('in')) {
			$('#claim').removeClass('active in');
			$('#claimLink').removeClass('active in');
		}
		if ($('#notification').hasClass('in')) {
			$('#notification').removeClass('active in');
			$('#NotificationLink').removeClass('active in');
		}
		//##START: US20089
		if ($('#creditMemo').hasClass('in')) {
			$('#creditMemo').removeClass('active in');
			$('#creditMemoLink').removeClass('active in');
		}
		//##END: US20089

		// ###START: US21133
		if ($('#mas').hasClass('in')) {
			$('#mas').removeClass('active in');
			$('#masLink').removeClass('active in');
		}
		// ###END: US21133
	}

	//here using to collapse all tab and open item and click of notes we will call a flag for resize column of grid
	public collapseAllTabsAndOpenItem() {
		var self = this;
		self.collapseAllTabs();
		$('#item').addClass('active in');
		$('#itemLink').addClass('active');
	}

	private colapseAchorAddress() {
		var self = this;
		if ($('#collapseAddress').hasClass('in') && self.isValidAddress) {
			$('#collapseAddress').collapse('toggle');
			$('#AchorcollapseAddress').addClass('collapsed');
		}

		$('#collapseAddress').css("overflow", "hidden");
	}
	private colapseAchorItems() {
		var self = this;
		if ($('#collapseItems').hasClass('in') && self.isValidItems) {
			$('#collapseItems').collapse('toggle');
			$('#AchorcollapseItems').addClass('collapsed');
		}
	}
	public colapseAchorShipping() {
		var self = this;
		if ($('#collapseShipping').hasClass('in') && self.isValidShipping) {
			$('#collapseShipping').collapse('toggle');
			$('#AchorcollapseShipping').addClass('collapsed');
		}
	}
	public collapseAnchorNotes() {
		var self = this;
		if ($('#collapseShipmentNotes').hasClass('in')) {
			$('#collapseShipmentNotes').collapse('toggle');
			$('#AchorcollapseShipmentNotes').addClass('collapsed');
		}
	}
	public collapseAnchorPodDoc() {
		var self = this;
		if ($('#collapsePOD').hasClass('in')) {
			$('#collapsePOD').collapse('toggle');
			$('#collapsePOD').addClass('collapsed');
		}
	}
	public collapseAnchorLinks() {
		var self = this;
		if ($('#collapseLinks').hasClass('in')) {
			$('#collapseLinks').collapse('toggle');
			$('#collapseLinks').addClass('collapsed');
		}
	}
	public collapseAnchorHistory() {
		var self = this;
		if ($('#collapseHistory').hasClass('in')) {
			$('#collapseHistory').collapse('toggle');
			$('#collapseHistory').addClass('collapsed');
		}
	}
	public collapseAnchorClaim() {
		var self = this;
		if ($('#collapseClaim').hasClass('in')) {
			$('#collapseClaim').collapse('toggle');
			$('#collapseClaim').addClass('collapsed');
		}
	}
	//##START: US20089
	public collapseAnchorCreditMemo() {
		var self = this;
		if ($('#collapseCreditMemo').hasClass('in')) {
			$('#collapseCreditMemo').collapse('toggle');
			$('#collapseCreditMemo').addClass('collapsed');
		}
	}
	//##END: US20089
	public collapseAnchorAudit() {
		var self = this;
		if ($('#collapseAudit').hasClass('in')) {
			$('#collapseAudit').collapse('toggle');
			$('#collapseAudit').addClass('collapsed');
		}
	}
	public collapseAnchorDispute() {
		var self = this;
		if ($('#collapseDispute').hasClass('in')) {
			$('#collapseDispute').collapse('toggle');
			$('#collapseDispute').addClass('collapsed');
		}
	}
	public colapseAchorMultileg() {
		var self = this;
		if ($('#collapseMultileg').hasClass('in') && self.isValidMultileg) {
			$('#collapseMultileg').collapse('toggle');
			$('#AchorcollapseItemsMultiLeg').addClass('collapsed');
		}
	}
	// ###START: US21133
	public collapseAnchorMas() {
		var self = this;
		if ($('#collapseMas').hasClass('in')) {
			$('#collapseMas').collapse('toggle');
			$('#collapseMas').addClass('collapsed');
		}
	}
	// ###END: US21133
	// Handles the click event of the Address accordion
	private onAddressClick() {
		var self = this;
		// To avoid tabs goes blank on quick move between tabs
		self.collapseAllTabs();
		$('#address').addClass('active in');
		$('#addressLink').addClass('active');

		self.addressOverflowManage();

		$("#shipperCompanyName").focus();
	}

	private onItemsClick() {
		var self = this;
		// To avoid tabs goes blank on quick move between tabs
		self.collapseAllTabs();
		$('#item').addClass('active in');
		$('#itemLink').addClass('active');
		//

		$("#addItemButton").focus();
	}

	private onShippingClick() {
		var self = this;

		//check if it is Accordion then check class for Accordion if tabbed then tabbed
		if (self.isAccordion()) {
			if (!$('#collapseShipping').hasClass('in')) {
				self.callShippingMethod();
			}
		} else {
			if (!$('#shipping').hasClass('in') && !$('#shippingLink').hasClass('in')) {
				self.callShippingMethod();
			}
		}

		// To avoid tabs goes blank on quick move between tabs
		self.collapseAllTabs();
		$('#shipping').addClass('active in');
		$('#shippingLink').addClass('active in');
	}

	public callShippingMethod() {
		var self = this;
		$("#txtRequestedPickupDate").focus();
		if (self.salesOrderDetailsViewModel.salesOrderId() > 0 && !self.isNewSubOrder()) {
			self.salesOrderShippingViewModel.isServiceTypeEnable(false);
		}
		if (self.canSeeCustomerTermType()) {
			var successCallBack = function (data) {
				var commonUtils = new Utils.Common();
				self.salesOrderShippingViewModel.initializeShippingViewModel(data);
			},
				faliureCallBack = function () {
				};
			self.vendorBillClient.getCustomerTypeAndMasterCustomerId(self.salesOrderDetailsViewModel.customerId(), successCallBack, faliureCallBack);
		}
	}

	private onShipingNotesClick() {
		var self = this;
		// To avoid tabs goes blank on quick move between tabs
		self.collapseAllTabs();
		$('#shipmentNotes').addClass('active in');
		$('#shipmentNotesLink').addClass('active in');
		//
		$("#txtuserSalesOrderNote").focus();

		// ##START: DE22412
		self.salesOrderNotesViewModel.reportContainer.listProgress(true);
		var successCallBack = function (data) {
			var commonUtils = new Utils.Common();
			self.salesOrderNotesViewModel.initializesalesOrderNotes(data, self.salesOrderDetailsViewModel.salesOrderId(), self.salesOrderDetailsViewModel.selectedInvoiceStatus(), self.isCallFromEdit());
		},
			failureCallBack = function (message) {
				self.salesOrderNotesViewModel.reportContainer.listProgress(false);
			};
		self.salesOrderClient.GetSalesOrderNotes(self.salesOrderDetailsViewModel.salesOrderId(), successCallBack, failureCallBack);
		// ##END: DE22412

		//on click we are calling this flag to show grid column resizebal as per browser window
		self.salesOrderNotesViewModel.reportContainer.isAttachedToView(false);
		self.salesOrderNotesViewModel.reportContainer.isAttachedToView(true);
	}

	private onHazmatClick() {
		var self = this;
		// To avoid tabs goes blank on quick move between tabs
		self.collapseAllTabs();
		$('#hazmat').addClass('active in');
		$('#hazmatLink').addClass('active in');
	}

	// To set address accordion to overflow
	private addressOverflowManage() {
		// To set address accordion to overflow:hidden and vice versa overflow:visible
		if ($("#collapseAddress").css("overflow") === "hidden") {
			setTimeout(function () {
				$('#collapseAddress').css("overflow", "visible");
			}, 500);
		}
		else {
			$('#collapseAddress').css("overflow", "hidden");
		}
	}

	// on save click by default Item tab should be active in Tabbed View
	private ShowDefaultItemTab() {
		var self = this;
		// to check selected ship via is Multileg
		if (self.salesOrderDetailsViewModel.selectedShipVia() === 5) {
			if (self.isValidSalesOrder && self.isValidAddress && self.isValidItems && self.isValidShipping && self.isValidHazmat && self.isValidMultileg) {
				if (!$('#item').hasClass('in')) {
					$('#item').addClass('active in');
					$('#itemLink').addClass('active');
				}
			}
			else {
				if ($('#item').hasClass('in')) {
					$('#item').removeClass('active in');
					$('#itemLink').removeClass('active');
				}
			}
		}
		else {
			if (self.isValidSalesOrder && self.isValidAddress && self.isValidItems && self.isValidShipping && self.isValidHazmat) {
				if (!$('#item').hasClass('in')) {
					$('#item').addClass('active in');
					$('#itemLink').addClass('active');
				}
			}
			else {
				if ($('#item').hasClass('in')) {
					$('#item').removeClass('active in');
					$('#itemLink').removeClass('active');
				}
			}
		}

		if (self.isReload()) {
			if (!$('#item').hasClass('in')) {
				$('#item').addClass('active in');
				$('#itemLink').addClass('active');
			}
			self.isReload(false);
		}
	}
	//#endregion

	//#region Create Bill
	private onCreateBill() {
		var self = this;
		self.salesorderReBillViewModel.isCallAgain = true;
		self.salesorderAuditedBillViewModel.isCallAgain = true;
		var salesOrderId = self.salesOrderDetailsViewModel.salesOrderId();
		var toastrOptions: IToastrOptions = {
			toastrPositionClass: "toast-top-middle",
			delayInseconds: 30,
			fadeOut: 30,
			typeOfAlert: "",
			title: ""
		};

		if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.salesOrderDetailsViewModel.proNumber()) && self.salesOrderDetailsViewModel.proNumber() !== undefined) {
			self.clearLocalStorage(self.salesOrderDetailsViewModel.salesOrderNumber());
			_app.trigger('openDuplicateTab', 'Entry', 'parent', salesOrderId);
		}
		else {
			self.clearLocalStorage(self.salesOrderDetailsViewModel.salesOrderNumber());
			_app.trigger('openDuplicateTab', 'Entry', 'parent', salesOrderId);
		}
	}
	//#endregion

	//#region Load Data
	public load(bindedData) {
		//** if bindedData is null then return false. */
		if (!bindedData) {
			return;
		}
		else if (typeof (bindedData.salesOrderId) === 'undefined') {
			return;
		}

		var self = this;
		self.ShowProgressBar(true);

		self.salesOrderId = bindedData.salesOrderId;

		if (self.salesOrderId !== undefined && self.salesOrderId !== 0) {
			// initially isschedule invoice should be false
			self.isScheduleInvoice = false;
			//** if there is no data is registered then make a server call. */
			//self.ShowProgressBar(true);
			var salesOrderId = bindedData.salesOrderId,
				isSubOrder = bindedData.isSubOrder,
				successCallBack = data => {
					if (isSubOrder === 'false') {
						isSubOrder = false;
					}
					self.isNotAtLoadingTime = true;
					// ###START: DE25806
					self.isCustomerBillTo = false;

					// ###END: DE25806
					self.salesOrderLinksViewModel.bolNumber(bindedData.bolNumber);
					self.canEnterZeroRevenue(data.CanEnterZeroRevenue);
					self.isPermissonToNegativemargin(data.AllowNegativeMargin);
					self.canSeeCustomerTermType(data.CanSeeCustomerTermType);
					self.subOrderCount = data.SuborderCount;
					// to enable make copy button
					// ##START: US22797
					self.canMakeCopy(data.CanMakeCopy && data.SalesOrderDetail.SelectedShipVia === refEnums.Enums.ShipVia.Ground.ID);
					// ##END: US22797
					// ###START: US29002
					if (typeof Utils.Constants.IsMakeCopyVisible !== "undefined" && Utils.Constants.IsMakeCopyVisible.toLowerCase() === 'false') {
						self.isMakeCopyVisible(false);
					}
					else {
						self.isMakeCopyVisible(true);
					}
					
					// ###END: US29002
					// to enable create Bill button
					self.canCreateBill(data.CanCreateBill);
					self.isNewSubOrder(data.IsSuborder);
					// ##START: US25310
					self.isSubOrder(data.IsAOrder);
					// ##END: US25310
					//Note:  If any body change this field then schedule invoice will get impact.
					self.finalRevenue = data.SalesOrderFinancialDetailsBySalesOrderId.FinalRevenue;
					self.finalBSCost = data.SalesOrderFinancialDetailsBySalesOrderId.FinalBSCost;

					self.actualCost = data.SalesOrderDetail.ActualCost;
					//to enable/disbale agent notification tab .6 for requote

					// ###START: DE23903
					self.agentNotifcationLinkVisiblity(data.SalesOrderDetail.IsAgentNotificationTabVisible);

					// ###END: DE23903
					self.modelSaveEnable = data.SalesOrderDetail.IsSaveEnable;

					//Sets the Save button to enable/disable
					if (self.modelSaveEnable && self.isNotAtLoadingTime) {
						self.isSaveEnable(false);
					}
					else if (!self.modelSaveEnable && self.isNotAtLoadingTime) {
						self.isSaveEnable(self.modelSaveEnable);
					}

					//flag to show or Hide Invoice Exception Accordion
					if (data.SalesOrderInvoiceExceptionDetails != null) {
						self.invoiceExceptionVisibility(true);
					}
					else {
						self.invoiceExceptionVisibility(false);
					}

					// load notes details
					// ###START: US20305
					if (data.SalesOrderNoteDetails != null)
						self.salesOrderNotesViewModel.initializesalesOrderNotes(data.SalesOrderNoteDetails, data.SalesOrderDetail.Id, data.SalesOrderDetail.InvoiceStatus, self.isCallFromEdit());
					// ###END: US20305
					self.salesOrderClaimViewModel.initializeClaimDetails(null);
					if (data.SalesOrderDetail.IsBillingStation) {
						self.salesOrderItemViewModel.isBSCost(true);
						self.salesOrderItemViewModel.isBSCostEditable(data.SalesOrderDetail.CanEditBSCost);
						self.salesOrderItemViewModel.costHeader("GTZ Cost");
					}
					else {
						self.salesOrderItemViewModel.isBSCost(false);
						self.salesOrderItemViewModel.isBSCostEditable(false);
						self.salesOrderItemViewModel.costHeader("Cost");
					}

					if (!self.modelSaveEnable) {
						self.salesOrderItemViewModel.isBSCostEditable(self.modelSaveEnable);
					}

					self.scheduleInvoiceText(data.ScheduleInvoiceText);
					self.isScheduleInvoiceVisible(data.IsScheduleInvoiceVisible);

					// Enable or Disable Schedule Invoice Button
					if (data.ScheduleInvoiceText !== "Set Pending" && data.SalesOrderDetail.ProcessStatusId === refEnums.Enums.OrderStatus.Canceled.ID) {
						self.isScheduleInvoiceEnable(false);
					}
					else {
						self.isScheduleInvoiceEnable(true);
					}

					//self.salesOrderOriginalData = data.PreviousValues;
					self.IsReadOnly = data.IsReadOnly;

					self.rebillitems = data.SalesOrderItemDetails;

					self.CanCreateNotes = data.CanCreateNotes;

					if (data.SalesOrderDetail) {
						// load sales order details

						self.salesOrderDetailsObject = data.SalesOrderDetail;
						self.salesOrderOriginalRevenue = data.SalesOrderDetail.OriginalRevenue;
						self.salesOrderOriginalPlcCost = data.SalesOrderDetail.OriginalPLCCost;
						if (data.SalesOrderDetail.EmergencyContactNo !== null && data.SalesOrderDetail.EmergencyContactNo !== undefined) {
							self.salesOrderHazmatViewModel.emergencyPhone(data.SalesOrderDetail.EmergencyContactNo);
						}

						if (data.SalesOrderDetail.BolNumber.indexOf(' ') >= 0) {
							self.salesOrderAddressViewModel.isSubOrderBill(true);
						}
						else {
							self.salesOrderAddressViewModel.isSubOrderBill(false);
						}

						// ###START: DE24990
						if (data.IsTruckLoadSuborder) {
							data.SalesOrderDetail.CanEditCarrier = false;
							data.SalesOrderDetail.CanEditCustomer = false;
						}
						// ###END: DE24990

						self.salesOrderDetailsViewModel.isCallForEdit(true);
						self.salesOrderDetailsViewModel.initializeSalesOrderDetails(data.SalesOrderDetail, data.SalesOrderShipmentProfitDetail, data.SalesOrderOriginalSODetail, data.CustomerBSPlcMarginInfo);
						self.salesOrderDetailsViewModel.initializeSalesOrderFinancialDetails(data.SalesOrderFinancialDetailsBySalesOrderId);
						self.SalesOrderFinancialDetailsModel = data.SalesOrderFinancialDetailsBySalesOrderId;
						self.getMasCustomerDetails(data.SalesOrderDetail.CustomerId, data.SalesOrderDetail.BolNumber);

						self.IsMultileg = data.IsMultileg;

						self.salesOrderAgentNotificationViewModel.salesRepId(data.SalesOrderDetail.SalesRepId);
						self.salesOrderAgentNotificationViewModel.salesOrderNumber(data.SalesOrderDetail.BolNumber);
						self.salesOrderAgentNotificationViewModel.customerBolNumber(data.SalesOrderDetail.CustomerBolNo);
						self.salesOrderAgentNotificationViewModel.customerId(data.SalesOrderDetail.CustomerId);

						//show or hide Create Bill Button
						self.showHideCreateBill(data.SalesOrderDetail.ProcessStatusId, data.IsAOrder);

						// if it is already saved sub order then we can create bill.
						// if user is going to create sub order then can't create sub bill
						if (data.IsAOrder && !isSubOrder) {
							self.canCreateBill(true);
						}

						// ###START: DE25101
						if (data.IsAOrder && data.IsCreditMemoSuborder) {
							self.canCreateBill(false);
							// ###START: DE25123
							self.isCreateBillVisible(false);
							// ###END: DE25123
						}
						// ###END: DE25101

						//show or hide Cancel/UnCancel SalesOrder
						self.showHideCancelSalesOrder(data.SalesOrderDetail.ProcessStatusId, data.SalesOrderDetail.InvoiceStatus);

						// ##START: DE25233
						self.orderStatusOnLoad = data.SalesOrderDetail.ProcessStatusId;
						// ##END: DE25233

						// ###START: US26037
						// ###START: US25171
						if (data.IsAOrder && data.SalesOrderDetail.Revenue > 0) {
							self.showHideRequestCreditSalesOrder(data.SalesOrderDetail.InvoiceStatus, data.SalesOrderDetail.VendorBillId);
						}
						else if (!data.IsAOrder) {
							self.showHideRequestCreditSalesOrder(data.SalesOrderDetail.InvoiceStatus, data.SalesOrderDetail.VendorBillId);
						}
						
						// ###END: US25171
						// ###END: US26037

						//////show or hide Create Sub Order button.
						////self.showHideCreateSubOrder(data.SalesOrderDetail.InvoiceStatus, data.SalesOrderDetail.CarrierType, data.IsAOrder);
						self.isCreateSubOrder(data.MakeSubOrder);
						self.salesorderInvoiceExceptionViewModel.invoiceStatus(data.SalesOrderDetail.InvoiceStatus);
						self.salesorderInvoiceExceptionViewModel.UpdateDateTime(data.SalesOrderDetail.UpdatedDateTime);

						// For Rebill button
						if (self.salesOrderDetailsObject.VendorBillId > 0) {
							self.isEditRebill(true);
							self.isDisputeSectionVisible(true);
						}
						else {
							self.isEditRebill(false);
							self.isDisputeSectionVisible(false);
						}

						// For Set Finalized Button
						if (data.CanSetFinalize) {
							self.isSetToFinalize(true);
						}
						else {
							self.isSetToFinalize(false);
						}
					}

					// load address details
					var shipperAddress = $.grep(data.SalesOrderAddressDetails, e => e.AddressType === refEnums.Enums.AddressType.Origin.ID)[0],
						consigneeAddress = $.grep(data.SalesOrderAddressDetails, e => e.AddressType === refEnums.Enums.AddressType.Destination.ID)[0],
						billToAddress = $.grep(data.SalesOrderAddressDetails, e => e.AddressType === refEnums.Enums.AddressType.BillTo.ID)[0];

					//##START: US22798
					if (data.SalesOrderDetail.ServiceType === refEnums.Enums.ServiceType.Expedite_Air.ID
						|| data.SalesOrderDetail.ServiceType === refEnums.Enums.ServiceType.Expedite_Ground.ID
						|| data.SalesOrderDetail.ServiceType === refEnums.Enums.ServiceType.Multileg.ID) {
						self.salesOrderAddressViewModel.isBillToReadOnly(true);
					}
					//##END: US22798

					self.salesOrderAddressViewModel.populateAddressByUser = false;
					self.salesOrderAddressViewModel.populateShipperAddress(shipperAddress, data.SalesOrderDetail.IsSaveEnable);
					self.salesOrderAddressViewModel.populateConsigneeAddress(consigneeAddress, data.SalesOrderDetail.IsSaveEnable);
					self.salesOrderAddressViewModel.populateBillToAddress(billToAddress);
					self.salesOrderAddressViewModel.addressBookSerachViewModel.name(new refAddressBookSearch.Models.AddressBookSearch());
					self.salesOrderAddressViewModel.populateAddressByUser = true;
					self.salesOrderAddressViewModel.isCallForEdit(true);

					// fill customer id for company search
					self.salesOrderAddressViewModel.shipperCompanySearchList.customerId(self.salesOrderDetailsObject.CustomerId);
					self.salesOrderAddressViewModel.consigneeCompanySearchList.customerId(self.salesOrderDetailsObject.CustomerId);

					//##START: US18837
					self.isFromDatabase = false;
					self.salesOrderItemsOnLoad = data.SalesOrderItemDetails;
					//##END: US18837

					//##START: US19354

					//##START: DE24336	
					self.salesOrderAddressOnLoad = [];

					if (shipperAddress != null) {
						self.salesOrderAddressOnLoad.push(shipperAddress.ZipCode);
					}

					if (consigneeAddress != null) {
						self.salesOrderAddressOnLoad.push(consigneeAddress.ZipCode);
					}

					if (billToAddress != null) {
						self.salesOrderAddressOnLoad.push(billToAddress.ZipCode);
					}
					//##END: DE24336

					self.salesorderCarrierIdOnLoad = { Id: data.SalesOrderDetail.CarrierId, Name: data.SalesOrderDetail.CarrierName };
					//END: US19354

					// ##START: US24389
					self.salesOrderItemViewModel.carrierType(data.SalesOrderDetail.ServiceType);
					self.salesOrderItemViewModel.populateItemDropdown();
					// ##END: US24389

					// load item details
					if (data.SalesOrderItemDetails.length > 0) {
						var total = 0;
						self.salesOrderItemViewModel.isSubOrder(data.IsSuborder);
						// ##START: US24671
						self.salesOrderItemViewModel.invoiceStatus = typeof data.SalesOrderDetail !== 'undefined' ? data.SalesOrderDetail.InvoiceStatus : 0;
						// ##END: US24671
						self.salesOrderItemViewModel.initializeSalesOrderItemDetails(data.SalesOrderDetail.CanEditItemsDescription, data.SalesOrderItemDetails, self.salesOrderDetailsViewModel.estimatedProfitPer(), self.salesOrderDetailsViewModel.gtMinMargin(), self.salesOrderDetailsViewModel.feeStructure(), self.salesOrderDetailsViewModel.gtzMargin(), self.salesOrderDetailsViewModel.isBillingStation(), data.SalesOrderDetail.IsSaveEnable, self.salesOrderDetailsViewModel.salesOrderId(), self.isCallFromEdit());
						self.oldTotalCost(parseFloat(self.salesOrderDetailsViewModel.salesOrderAmount().replace(/,/g, "")));
					} else if (data.IsSuborder) {
						self.salesOrderItemViewModel.isSubOrder(data.IsSuborder);
						self.salesOrderItemViewModel.estimatedProfitPerc(self.salesOrderDetailsViewModel.estimatedProfitPer());
						self.salesOrderItemViewModel.initializeSalesOrderItemDetails(data.SalesOrderDetail.CanEditItemsDescription, data.SalesOrderItemDetails, self.salesOrderDetailsViewModel.estimatedProfitPer(), self.salesOrderDetailsViewModel.gtMinMargin(), self.salesOrderDetailsViewModel.feeStructure(), self.salesOrderDetailsViewModel.gtzMargin(), self.salesOrderDetailsViewModel.isBillingStation(), data.SalesOrderDetail.IsSaveEnable, self.salesOrderDetailsViewModel.salesOrderId(), self.isCallFromEdit());
						self.salesOrderItemViewModel.addDefaultItems();
					}
					else {
						self.salesOrderItemViewModel.addDefaultItems();
					}

					// load address details
					if (data.IsMultileg) {
						var transitDays = self.salesOrderShippingViewModel.transitDays();
						var groundCarrierName;
						if (self.salesOrderDetailsViewModel.carrierSearchList !== undefined && self.salesOrderDetailsViewModel.carrierSearchList !== null) {
							groundCarrierName = self.salesOrderDetailsViewModel.carrierSearchList.vendorName();
						}
						self.salesOrderMultiLegViewModel.fillMultilegDetails(data.SalesOrderMultilegDetails, transitDays, groundCarrierName);
					}

					self.processStatusId(data.SalesOrderDetail.ProcessStatusId);

					if (self.IsReadOnly) {
						self.DisableAlltheControls();
						// load sales order shipping details
						self.salesOrderShippingViewModel.populateShippingDetails(data.SalesOrderDetail, data.MakeSubOrder, self.canSeeCustomerTermType(), !self.IsReadOnly);
					}
					else {
						// load sales order shipping details
						self.salesOrderShippingViewModel.populateShippingDetails(data.SalesOrderDetail, data.MakeSubOrder, self.canSeeCustomerTermType(), self.modelSaveEnable);
					}

					//// ###START: US25349
					// IsTruckLoadSubOrder used for updating TL suborder using CC api
					self.IsTruckLoadSubOrder = data.IsTruckLoadSuborder;
					self.InvoiceStatus = data.SalesOrderDetail.InvoiceStatus;
					if (self.IsTruckLoadSubOrder) {
						self.DisableAlltheControls();
					}
					//// ###END: US25349				

					//##START: US22798
					if (data.SalesOrderDetail.ServiceType === refEnums.Enums.ServiceType.Expedite_Air.ID
						|| data.SalesOrderDetail.ServiceType === refEnums.Enums.ServiceType.Expedite_Ground.ID
						|| data.SalesOrderDetail.ServiceType === refEnums.Enums.ServiceType.Multileg.ID) {
						self.isEnableCancelUnCancelSalesOrder(false);
						self.isEnablePrintBOL(true);
					}
					else {
						if (self.IsReadOnly) {
							self.isEnablePrintBOL(false);
						}
						else {
							self.isEnablePrintBOL(true);
						}
					}
					//##END: US22798

					//##START: DE21287
					if (data.SalesOrderDetail.ServiceType === refEnums.Enums.ServiceType.Truckload.ID) {
						self.IsTruckLoadOrder = true;
						self.DisableBookedDate();
					} else {
						self.IsTruckLoadOrder = false;
					}
					//##START: DE21287				

					if (data.SalesOrderShipmentProfitDetail != null) {
						var mainBillCost = data.SalesOrderShipmentProfitDetail.MainBillCost;
						var grossCost = data.SalesOrderShipmentProfitDetail.GrossCost;
						self.mainVBCost(mainBillCost);
						self.mainFinalCost(grossCost);
						self.mainSOCost(grossCost);
					}

					self.salesOrderOriginalData = data.PreviousValues;

					// ###START: US26377
					if (data.SalesOrderDetail.InvoiceStatus === refEnums.Enums.InvoiceStatus.Invoiced.ID && data.SalesOrderDetail.ProcessStatusId === refEnums.Enums.OrderStatus.Canceled.ID && data.SalesOrderDetail.VendorBillId === 0) {
						self.isSetToFinalize(false);
						self.isEditRebill(false);
						self.isDisputeSectionVisible(false);
						self.isCreateSubOrder(false);
						self.isRequestCredit(false);
						self.isEnableCancelUnCancelSalesOrder(false);
						// ###START: US29002
						if (typeof Utils.Constants.IsMakeCopyVisible !== "undefined" && Utils.Constants.IsMakeCopyVisible.toLowerCase() === 'false') {
							self.isMakeCopyVisible(false);
						}
						else {
							self.isMakeCopyVisible(true);
						}

						// ###START: US29002
					}
					else {
						// ###START: US29002
						if (typeof Utils.Constants.IsMakeCopyVisible !== "undefined" && Utils.Constants.IsMakeCopyVisible.toLowerCase() === 'false') {
							self.isMakeCopyVisible(false);
						}
						else {
							self.isMakeCopyVisible(true);
						}

						// ###START: US29002
					}

					// ###START: US26377
					// ###START: US26377
					self.isCustomerBillTo = true;

					self.isNotAtLoadingTime = false;
					//To save date time in local storage
					self.setDateTimeOfReload();
					self.salesOrderNotesViewModel.SOStorageKey = bindedData.bolNumber + 'SO';
					// Store in the local storage
					LocalStorageController.Set(bindedData.bolNumber + 'SO', data);

					// ###START: DE23038
					_app.trigger("IsBIDirtyChange", false);

					// ###END: DE23038
					if (self.salesOrderPageTitle) {
						self.salesOrderPageTitle(data.SalesOrderDetail.QuoteId, data.SalesOrderDetail.ServiceType, data.SalesOrderDetail.ProcessFlow);
					}

					// ##START: DE23005
					self.ShowProgressBar(false);
					// ##END: DE23005
				},
				faliureCallBack = message => {
					console.log(message);
					self.ShowProgressBar(false);
				};

			// Try to get the data from local storage if not available then get the data from the database
			if (!LocalStorageController.Get(bindedData.bolNumber + 'SO')) {
				self.isFromDatabase = true;
				self.salesOrderClient.getSalesOrderDetailsBySalesOrderId(salesOrderId, successCallBack, faliureCallBack, isSubOrder);
			} else {
				successCallBack(LocalStorageController.Get(bindedData.bolNumber + 'SO'));
			}

		} else {
			self.ShowProgressBar(false);
		}
	}

	private loadPodDocDetails() {
		$('#selectDocOwner').focus();
		var self = this;

		if (self.isAccordion()) {
			if (!$('#collapsePOD').hasClass('in')) {
				if (!self.isNewSubOrder()) {
					self.callPodDocDetails();
				}
				else {
					self.salesOrderPODDocViewModel.isEnable(false);
					self.salesOrderPODDocViewModel.isEnableBrowse(false);
				}
			}
		} else {
			if (!$('#podDocLink').hasClass('in') && !$('#tab_podDoc').hasClass('in')) {
				if (!self.isNewSubOrder()) {
					self.callPodDocDetails();
				}
				else {
					self.salesOrderPODDocViewModel.isEnableBrowse(false);
					self.salesOrderPODDocViewModel.isEnable(false);
				}
			}
		}
		self.collapseAllTabs();
		$('#tab_podDoc').addClass('active in');
		$('#podDocLink').addClass('active in');
		//on click we are calling this flag to show grid column resizebal as per browser window
		self.salesOrderPODDocViewModel.reportContainer.isAttachedToView(false);
		self.salesOrderPODDocViewModel.reportContainer.isAttachedToView(true);
	}

	public callPodDocDetails() {
		var self = this;
		if (!self.isNewSubOrder()) {
			self.salesOrderPODDocViewModel.isEnable(true);
			var uploadFileDetails: ISalesOrderUploadFileModel = new refPodDocModel.Models.SalesOrderUploadFileModel();
			uploadFileDetails.ShipmentId = self.salesOrderDetailsViewModel.salesOrderId();
			uploadFileDetails.CarrierId = self.salesOrderDetailsViewModel.carrierSearchList.ID();
			uploadFileDetails.ProNumber = self.salesOrderDetailsViewModel.proNumber();
			uploadFileDetails.BolNumber = self.salesOrderDetailsViewModel.salesOrderNumber();
			uploadFileDetails.VendorBillId = self.salesOrderDetailsViewModel.vendorbillid();
			uploadFileDetails.ServiceType = self.salesOrderShippingViewModel.selectedServiceType();

			//** if there is no data is registered then make a server call. */
			var successCallBack = data=> {
				self.salesOrderPODDocViewModel.salesOrderPodDocDetail.removeAll();
				self.salesOrderPODDocViewModel.reportContainer.listProgress(true);
				self.salesOrderPODDocViewModel.initializeSalesOrderPodDocDetails(data, self.salesOrderDetailsViewModel.salesOrderId(), self.salesOrderDetailsViewModel.carrierSearchList.ID(), self.salesOrderDetailsViewModel.salesOrderNumber(), !self.IsReadOnly);
				self.salesOrderPODDocViewModel.reportContainer.listProgress(false);
			},

				faliureCallBack = message => {
					console.log(message);
					self.salesOrderPODDocViewModel.reportContainer.listProgress(false);
				};
			self.salesOrderPODDocViewModel.reportContainer.listProgress(false);
			self.salesOrderClient.getSalesOrderPodDocDetails(uploadFileDetails, successCallBack, faliureCallBack);
		}
	}

	public reloadPage() {
		var self = this;
		self.ShowProgressBar(true);
		self.isReload(true);
		self.salesOrderDisputeViewModel.isVisibleDisputeDetails(false);
		self.collapseAllAccordion();
		self.collapseAllTabs();
		self.ShowDefaultItemTab();
		self.clearLocalStorage(self.salesOrderDetailsViewModel.salesOrderNumber());
		LocalStorageController.Set(self.salesOrderDetailsViewModel.salesOrderNumber() + 'lastReloadDateTime', undefined);
		//self.loadViewAfterComposition();
		// ###START: DE23042
		self.salesOrderItemViewModel.isLoaded = true;

		// ###START: DE23042
		// ###START:US23162
		self.salesorderReBillViewModel.isCallAgain = true;
		// ###END:US23162
		self.beforeBind();
	}

	//set Date Time for record of last refreshed
	public setDateTimeOfReload() {
		var self = this;
		if (LocalStorageController.Get(self.salesOrderDetailsViewModel.salesOrderNumber() + 'lastReloadDateTime')) {
			var localDateTimeOfReload = LocalStorageController.Get(self.salesOrderDetailsViewModel.salesOrderNumber() + 'lastReloadDateTime');
			self.currentDateTime(localDateTimeOfReload);
		} else {
			var onlyDate = self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy');
			var date = new Date();
			var str = 'Last Refreshed: ' + onlyDate + ' ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
			LocalStorageController.Set(self.salesOrderDetailsViewModel.salesOrderNumber() + 'lastReloadDateTime', str);
			//var reloadDate = LocalStorageController.Get(self.vendorBillDetailsViewModel.proNumber() + 'lastReloadDateTime');
			self.currentDateTime(str);
		}
	}

	//To load Shipment Details
	public getShipmentLinks() {
		var self = this;

		//checking view is Accordion or tabbed as per that giving condition to call service only once
		if (self.isAccordion()) {
			//check if Accordion is not allready open then call service
			if (!$('#collapseLinks').hasClass('in')) {
				self.callGetshipmentLink();
			}
		} else {
			//else check in tabbed same thing
			if (!$('#links').hasClass('in') && !$('#linksLink').hasClass('in')) {
				self.callGetshipmentLink();
			}
		}

		// To avoid tabs goes blank on quick move between tabs
		self.collapseAllTabs();
		$('#links').addClass('active in');
		$('#linksLink').addClass('active in');
	}

	public callGetshipmentLink() {
		var self = this;
		self.showlistProgressForLinks(true);

		var successCallBack = function (data) {
			var commonUtils = new Utils.Common();
			// load Links details
			self.salesOrderLinksViewModel.initializeLinksDetails(data, self.salesOrderDetailsViewModel.salesOrderId());
			self.showlistProgressForLinks(false);
		},
			faliureCallBack = function () {
				self.showlistProgressForLinks(false);
			};
		self.vendorBillClient.getShipmentRelatedLinks(self.salesOrderDetailsViewModel.mainBolNo(), 0, successCallBack, faliureCallBack);
	}

	//To load Agent Notification Details
	public getAgentNotification() {
		var self = this;
		// To avoid tabs goes blank on quick move between tabs
		self.collapseAllTabs();
		$('#notification').addClass('active in');
		$('#NotificationLink').addClass('active in');

		if (!$('#collapseNotification').hasClass('in')) {
			self.salesOrderAgentNotificationViewModel.initializeAgentNotificationsDetails(self.salesOrderDetailsViewModel.salesRep(), self.salesOrderDetailsViewModel.salesOrderId(), self.salesOrderDetailsViewModel.customerName(), self.salesOrderDetailsViewModel.salesOrderRevenue(), self.salesOrderDetailsViewModel.salesOrderAmount(), self.salesOrderDetailsViewModel._currentUser().UserName.toString())
		}
	}

	// To load Multileg Details
	public getMultilegDetails() {
		var self = this;
		// To avoid tabs goes blank on quick move between tabs
		self.collapseAllTabs();
		$('#multileg').addClass('active in');
		$('#multilegLink').addClass('active in');
		//
		var transitDays = self.salesOrderShippingViewModel.transitDays();
		var groundCarrierName;
		if (self.salesOrderDetailsViewModel.carrierSearchList !== undefined && self.salesOrderDetailsViewModel.carrierSearchList !== null) {
			groundCarrierName = self.salesOrderDetailsViewModel.carrierSearchList.vendorName();
		}
		if (!$('#collapseMultileg').hasClass('in')) {
			self.showlistProgressForMultiLeg(true);
			var successCallBack = function (data) {
				var commonUtils = new Utils.Common();
				self.salesOrderMultiLegViewModel.fillMultilegDetails(data, transitDays, groundCarrierName);
				self.showlistProgressForMultiLeg(false);
			},
				faliureCallBack = function () {
					self.showlistProgressForMultiLeg(false);
				};
			self.salesOrderClient.getMultilegDetails(self.salesOrderDetailsViewModel.salesOrderId(), successCallBack, faliureCallBack);
		}
	}

	//To load Claim
	public getClaim() {
		var self = this;
		// To avoid tabs goes blank on quick move between tabs
		self.collapseAllTabs();
		$('#claim').addClass('active in');
		$('#claimLink').addClass('active in');

		//on click we are calling this flag to show grid column resizebal as per browser window
		self.salesOrderClaimViewModel.reportContainer.isAttachedToView(false);
		self.salesOrderClaimViewModel.reportContainer.isAttachedToView(true);

		//checking view is tabbed or accordion as per that calling service only once
		if (self.isAccordion()) {
			if (!$('#collapseClaim').hasClass('in')) {
				self.callGetClaim();
			}
		} else {
			if (!$('#claim').hasClass('in') && !$('#claimLink').hasClass('in')) {
				self.callGetClaim();
			}
		}
	}

	public callGetClaim() {
		var self = this;
		self.showlistProgressForClaim(true);
		var successCallBack = function (data) {
			var commonUtils = new Utils.Common();
			// load Claim details
			self.salesOrderClaimViewModel.initializeClaimDetails(data);
			self.showlistProgressForClaim(false);
		},
			faliureCallBack = function () {
				self.showlistProgressForClaim(false);
			};
		self.salesOrderClient.getSalesOrderClaim(self.salesOrderDetailsViewModel.salesOrderNumber(), successCallBack, faliureCallBack);
	}

	// To Load Sales Order Credit memo
	public getInvoiceExceptionDetails() {
		var self = this;
		//Checking view is Accordion or tabbe as per calling service only once
		self.salesorderInvoiceExceptionViewModel.isEnableInvoiceReason(false);
		if (self.isAccordion()) {
			if (!$('#collapseInvoiceException').hasClass('in')) {
				self.callGetInvoiceExceptionDetails();
			}
		} else {
			if (!$('#invoiceException').hasClass('in') && !$('#invoiceExceptionLink').hasClass('in')) {
				self.callGetInvoiceExceptionDetails();
			}
		}

		// To avoid tabs goes blank on quick move between tabs
		self.collapseAllTabs();
		$('#invoiceException').addClass('active in');
		$('#invoiceExceptionLink').addClass('active in');
	}

	//To load Sales Order Rebill
	public getSalesOrderRebill() {
		var self = this;
		// To avoid tabs goes blank on quick move between tabs
		self.collapseAllTabs();
		$('#rebill').addClass('active in');
		$('#rebillLink').addClass('active in');

		if (!$('#collapseReBill').hasClass('in') && self.salesorderReBillViewModel.isCallAgain) {
			//// ###START: DE21390
			// ##START: US24389
			self.salesorderReBillViewModel.isTruckloadOrder = self.IsTruckLoadOrder;
			// ##END: US24389
			self.isNotAtLoadingTime = true;
			self.salesorderReBillViewModel.initializeReBillDetails(self.salesOrderDetailsViewModel.salesOrderId(), self.salesOrderDetailsViewModel.grosscost(), self.salesOrderDetailsViewModel.estimatedProfitPer(), self.salesOrderDetailsViewModel.finalProfitPer(), self.salesOrderDetailsViewModel.isBillingStation(), self.salesOrderDetailsViewModel.gtzMargin(), self.salesOrderDetailsViewModel.plcMargin(), self.salesOrderDetailsViewModel.feeStructure(), self.salesOrderDetailsViewModel.gtMinMargin(), self.salesOrderDetailsViewModel.customerTypeOf(), self.salesOrderDetailsViewModel.finalCost(), self.isNewSubOrder(), self.mainVBCost(), self.mainSOCost(), self.modelSaveEnable, self.salesOrderItemViewModel.salesOrderItemsList());
			self.isNotAtLoadingTime = false;
			//// ###END: DE21390			
		}
	}

	//To load Sales Order Audited Bill
	public getSalesOrderAuditedBill() {
		var self = this;
		// To avoid tabs goes blank on quick move between tabs
		self.collapseAllTabs();
		$('#auditedBill').addClass('active in');
		$('#AuditedBillLink').addClass('active in');

		if (!$('#collapseAuditedBill').hasClass('in') && self.salesorderAuditedBillViewModel.isCallAgain) {
			self.salesorderAuditedBillViewModel.initializeAuditedBillDetails(self.salesOrderDetailsViewModel.vendorbillid(), self.modelSaveEnable);
		}
	}

	// To Load Sales Order Invoice Exception Details
	//##START: US20089
	public onCreditMemoClick() {
		var self = this;

		// To avoid tabs goes blank on quick move between tabs
		self.collapseAllTabs();
		$('#creditMemo').addClass('active in');
		$('#creditMemoLink').addClass('active in');

		//self.salesOrderCreditMemoViewModel.initializeCreditMemoDetails(self.salesOrderDetailsViewModel.salesOrderNumber());

		//on click we are calling this flag to show grid column resizebal as per browser window
		self.salesOrderCreditMemoViewModel.reportContainer.isAttachedToView(false);
		self.salesOrderCreditMemoViewModel.reportContainer.isAttachedToView(true);
	}
	//##END: US20089

	public callGetInvoiceExceptionDetails() {
		var self = this;
		self.showlistProgressForInvoiceException(true);
		var successCallBack = function (data) {
			self.salesorderInvoiceExceptionViewModel.initializeInvoiceExceptionDetails(data, !self.IsReadOnly);
			self.showlistProgressForInvoiceException(false);
		},
			failureCallBack = function () {
				self.showlistProgressForInvoiceException(false);
			}
			self.salesOrderClient.getInvoiceExceptionDetails(self.salesOrderDetailsViewModel.salesOrderId(), successCallBack, failureCallBack);
	}

	//list progress for links
	public showlistProgressForLinks(value: boolean) {
		var self = this;
		self.listProgressLinks(value);
		self.listProgressLinksAccordian(value);
	}

	//list progress for Multileg
	public showlistProgressForMultiLeg(value: boolean) {
		var self = this;
		self.listProgressMultileg(value);
		self.listProgressMultilegAccordian(value);
	}
	//list progress fo rDispute
	public showlistProgressForDispute(value: boolean) {
		var self = this;
		self.listProgressDispute(value);
		self.listProgressDisputeAccordian(value);
	}
	//list progress for Invoice Exception
	public showlistProgressForInvoiceException(value: boolean) {
		var self = this;
		self.listProgressInvoiceException(value);
		self.listProgressInvoiceExceptionAccordian(value);
	}
	//list progress for Claim
	public showlistProgressForClaim(value: boolean) {
		var self = this;
		self.listProgressClaim(value);
		self.listProgressClaimAccordian(value);
	}

	//##START DE20307
	//## Expands all the accordions in one click
	public expandAllAccordions() {
		var self = this;

		self.expandView("collapseItems");
		self.expandView("collapseAddress");
		self.expandView("collapseMultileg");
		self.expandView("collapseShipping");
		self.expandView("collapseShipmentNotes");
		self.expandView("collapsePOD");
		self.expandView("collapseReBill");
		self.expandView("collapseDispute");
		self.expandView("collapseAuditedBill");
		self.expandView("collapseNotification");
		self.expandView("collapseLinks");
		self.expandView("collapseHistory");
		self.expandView("collapseInvoiceException");
		self.expandView("collapseClaim");
		self.expandView("collapseHazmat");
		self.expandView("collapseMas"); // US21133
	}
	//##END DE20307

	//## Collapses all the accordions in one click
	public collaspeAllAccordion() {
		var self = this;
		self.collapseView("collapseItems");
		self.collapseView("collapseAddress");
		self.collapseView("collapseMultileg");
		self.collapseView("collapseShipping");
		self.collapseView("collapseShipmentNotes");
		self.collapseView("collapsePOD");
		self.collapseView("collapseReBill");
		self.collapseView("collapseDispute");
		self.collapseView("collapseAuditedBill");
		self.collapseView("collapseNotification");
		self.collapseView("collapseLinks");
		self.collapseView("collapseHistory");
		self.collapseView("collapseInvoiceException");
		self.collapseView("collapseClaim");
		self.collapseView("collapseHazmat");
		self.collapseView("collapseMas"); // US21133
	}

	public overFlowManage() {
		var self = this;
		if (self.isAccordion()) {
			if (!$('#collapseAddress').hasClass('in')) {
				$('#collapseAddress').css("overflow", "hidden");
			}
			else {
				$('#collapseAddress').css("overflow", "visible");
			}
		}
	}

	//#endregion

	//#region Make Copy

	public onCopy() {
		var self = this;
		self.salesorderReBillViewModel.isCallAgain = true;
		self.salesorderAuditedBillViewModel.isCallAgain = true;
		self.salesOrderDetailsViewModel.validateSalesOrder();
		self.salesOrderAddressViewModel.validateAddresses();
		self.salesOrderItemViewModel.validateItems();
		self.salesOrderShippingViewModel.validateShipping();
		self.salesOrderHazmatViewModel.validateHazmatItems();
		self.salesOrderHazmatViewModel.validateContact();

		if (self.isAccordion()) {
			self.validateAccordionView();
		}
		else {
			self.validateTabbedView(self.salesOrderDetailsViewModel.validateSalesOrder(), self.salesOrderAddressViewModel.validateAddresses(), self.salesOrderItemViewModel.validateItems(), self.salesOrderHazmatViewModel.validateHazmatItems(), self.salesOrderHazmatViewModel.validateContact(), self.salesOrderShippingViewModel.validateShipping(), self.salesOrderMultiLegViewModel.validateMultilegdetails(self.IsMultileg));
		}

		// Validate each section data
		if (self.salesOrderDetailsViewModel.selectedShipVia() === 5) {
			if (!(self.isValidAddress && self.isValidItems && self.isValidHazmat && self.isValidShipping && self.isValidMultileg)) {
				return;
			}
			else {
				if (self.isAccordion()) {
					//self.collapseAchorVendorBill();
					self.colapseAchorAddress();
					self.colapseAchorItems();
					self.colapseAchorShipping();
					self.collapseAnchorNotes();
					self.collapseAnchorPodDoc();
					self.collapseAnchorLinks();
					self.collapseAnchorHistory();
					self.collapseAnchorClaim();
					self.collapseAnchorCreditMemo();//US20089
					self.collapseAnchorAudit();
					self.collapseView('collapseHazmat');
				}

				if (self.validateRevenue()) {
					self.validateNotesForCopy();
				}
			}
		}
		else {
			if (!(self.isValidAddress && self.isValidItems && self.isValidHazmat && self.isValidShipping)) {
				return;
			}
			else {
				if (self.isAccordion()) {
					//self.collapseAchorVendorBill();
					self.colapseAchorAddress();
					self.colapseAchorItems();
					self.colapseAchorShipping();
					self.collapseAnchorNotes();
					self.collapseAnchorPodDoc();
					self.collapseAnchorLinks();
					self.collapseAnchorHistory();
					self.collapseAnchorClaim();
					self.collapseAnchorCreditMemo();
					self.collapseAnchorAudit();
					self.collapseView('collapseHazmat');
				}
				if (self.validateDeliverDate()) {
					self.validateEstimateDueDate();
					if (self.validateRevenue()) {
						self.validateNotesForCopy();
					}
				}
			}
		}
	}

	public validateForMauallyFinalizedStatus() {
		var self = this;

		if ((self.salesOrderDetailsViewModel.selectedOrderStatus() === refEnums.Enums.OrderStatus.ManuallyFinalized.ID) || (self.salesOrderDetailsViewModel.selectedOrderStatus() === refEnums.Enums.OrderStatus.Shipment_Finalized.ID)) {
			if ((!self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.salesOrderDetailsViewModel.proNumber()) || self.salesOrderDetailsViewModel.proNumber() === undefined || self.salesOrderDetailsViewModel.proNumber() === '') || (!self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.salesOrderShippingViewModel.pickupDate()) || self.salesOrderShippingViewModel.pickupDate() === undefined || self.salesOrderShippingViewModel.pickupDate() === '')) {
				var toastrOptions: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 30,
					fadeOut: 30,
					typeOfAlert: "",
					title: ""
				};
				if (self.isViewMessage) {
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.ManuallyFinalizedValidation, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
					self.isViewMessage = false;
				}
				//to open shipping default view
				self.collapseAllTabs();
				$('#shipping').addClass('active in');
				$('#shippingLink').addClass('active');
				self.ShowProgressBar(false);
				return false;
			}
			return true;
		}
		else {
			return true;
		}
	}

	public ValidateForAutoDispatchStatus() {
		var self = this;
		if (self.salesOrderDetailsViewModel.selectedOrderStatus() === refEnums.Enums.OrderStatus.AutoDispatch.ID) {
			var toastrOptions: IToastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 30,
				fadeOut: 30,
				typeOfAlert: "",
				title: ""
			};
			if (self.isViewMessage) {
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.AutoDispatchMessage, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				self.isViewMessage = false;
			}
			return false;
		}
		else {
			return true;
		}
	}

	// To validate Revenue and Cost
	public validateRevenue() {
		var self = this;
		var totalRev = +self.salesOrderDetailsViewModel.salesOrderRevenue();
		var totalCost = +self.salesOrderDetailsViewModel.salesOrderAmount();
		if (!self.isPermissonToNegativemargin()) {
			return self.validateCostAndRevenue();
		}
		else {
			return true;
		}
	}

	// To validate Notes
	public validateNotesForCopy() {
		var self = this;

		// Check if notes data is entered but not added in the list
		if (self.salesOrderNotesViewModel.canAdd()) {
			var self = this;
			self.salesOrderNotesViewModel.onAdd();
			self.validatePickupDate();
		}
		else {
			self.validatePickupDate();
		}
	}

	// To validate Notes
	public validateNotes() {
		var self = this;
		// If schedule invoice click then no need to validate notes and all.
		if (self.isScheduleInvoice) {
			self.isScheduleInvoice = false;
			self.scheduleInvoice();
		}
		else {
			self.salesOrderNotesViewModel.onAdd();
			self.setUpModelAndSave();
		}
	}

	public validatePickupDate() {
		var self = this;
		self.ShowDefaultItemTab();

		var actionButtons: Array<IToastrActionButtonOptions> = [];
		actionButtons.push({
			actionButtonName: "Yes",
			actionClick: self.setUpModelAndCopy
		});

		actionButtons.push({
			actionButtonName: "No",
			actionClick: self.checkMsgOnMakeCopyClick
		});

		var toastrOptions: IToastrOptions = {
			toastrPositionClass: "toast-top-middle",
			delayInseconds: 0,
			fadeOut: 0,
			typeOfAlert: "",
			title: "",
			actionButtons: actionButtons
		};

		if (self.isViewMessage) {
			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.ShowRequestedPickupDateMessage, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
			self.isViewMessage = false;
		}
	}
	//To validate Delivery Date
	public validateDeliverDate() {
		var self = this;
		var selectedOrderStatus = self.salesOrderDetailsViewModel.selectedOrderStatus();
		if (selectedOrderStatus === 0 && (self.salesOrderShippingViewModel.deliveryDate() !== null && self.salesOrderShippingViewModel.deliveryDate() !== "")) {
			var toastrOptions: IToastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 30,
				fadeOut: 30,
				typeOfAlert: "",
				title: ""
			};

			if (self.isViewMessage) {
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.EmptyDeliveryDate, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				self.isViewMessage = false;
			}
			//$('#collapseItems').collapse('toggle');
			$('#collapseShipping').addClass('in');
			$('#collapseShipping').css("height", 'auto');
			$('#collapseShipping').removeClass('collapsed');
			self.collapseAllTabs();
			$('#shipping').addClass('active in');
			$('#shippingLink').addClass('active');
			return false;
		}
		else {
			if (self.salesOrderShippingViewModel.deliveryDate() !== null && self.salesOrderShippingViewModel.deliveryDate() !== "") {
				if (new Date(self.salesOrderShippingViewModel.deliveryDate()) < new Date(self.salesOrderShippingViewModel.pickupDate())) {
					var toastrOptions: IToastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 30,
						fadeOut: 30,
						typeOfAlert: "",
						title: ""
					};

					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.GreaterDeliveryDate, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
					self.ShowProgressBar(false);
					self.isViewMessage = false;

					//$('#collapseItems').collapse('toggle');
					$('#collapseShipping').addClass('in');
					$('#collapseShipping').css("height", 'auto');
					$('#collapseShipping').removeClass('collapsed');

					self.collapseAllTabs();
					$('#shipping').addClass('active in');
					$('#shippingLink').addClass('active');
					return false;
				}
				else {
					return true;
				}
			}
			else {
				return true;
			}
		}
	}

	// To get Sales Order Header Details
	public getSalesOrderDetails(): ISalesOrderDetail {
		var self = this;
		var salesOrderDetails = new refSalesOrderDetailsModel.Models.SalesOrderDetail();
		salesOrderDetails.SelectedShipVia = self.salesOrderShippingViewModel.selectedServiceType();
		salesOrderDetails.CustomerId = self.salesOrderDetailsViewModel.customerSearchList.customerId() !== 0 ? self.salesOrderDetailsViewModel.customerSearchList.customerId() : self.salesOrderDetailsObject.CustomerId;
		salesOrderDetails.CustomerName = self.salesOrderDetailsViewModel.customerSearchList.customerName();
		salesOrderDetails.ContactName = self.salesOrderDetailsViewModel.customerSearchList.contactName;
		salesOrderDetails.BookedDate = self.salesOrderDetailsViewModel.bookedDate();
		salesOrderDetails.BolNumber = self.salesOrderDetailsViewModel.salesOrderNumber();

		// ###START: US22417
		salesOrderDetails.CustomerBolNo = self.salesOrderShippingViewModel.customerBolNumber();
		// ###END: US22417

		salesOrderDetails.ProNo = self.salesOrderDetailsViewModel.proNumber();
		salesOrderDetails.PoNo = self.salesOrderDetailsViewModel.poNumber();
		salesOrderDetails.ReferenceNo = self.salesOrderDetailsViewModel.puNumber();
		salesOrderDetails.ProcessStatusId = self.salesOrderDetailsViewModel.selectedOrderStatus();

		if (self.salesOrderShippingViewModel.deliveryDate() !== '') {
			salesOrderDetails.OrderStatusId = refEnums.Enums.OrderStatus.Delivered.ID;
		}
		else if (self.salesOrderDetailsViewModel.proNumber() !== '' && self.salesOrderShippingViewModel.pickupDate() !== '') {
			salesOrderDetails.OrderStatusId = refEnums.Enums.OrderStatus.Pickup.ID;
		}
		else if (self.salesOrderDetailsViewModel.selectedOrderStatus() === refEnums.Enums.OrderStatus.Pending.ID) {
			salesOrderDetails.OrderStatusId = refEnums.Enums.OrderStatus.Pending.ID;
		}
		else if ((self.salesOrderDetailsViewModel.selectedOrderStatus() === refEnums.Enums.OrderStatus.ManualDispatch.ID) || (self.salesOrderDetailsViewModel.selectedOrderStatus() === refEnums.Enums.OrderStatus.AutoDispatch.ID)) {
			salesOrderDetails.OrderStatusId = refEnums.Enums.OrderStatus.Dispatch.ID;
		}

		salesOrderDetails.RequestedPickupDate = self.salesOrderShippingViewModel.requestedPickupDate();
		salesOrderDetails.PickupDate = self.salesOrderShippingViewModel.pickupDate();
		// ###START: US19648
		//if (!self.salesOrderShippingViewModel.isCalendarDaysNull()) {
		//	salesOrderDetails.TransitDays = self.salesOrderShippingViewModel.transitDays();
		//	salesOrderDetails.CalendarDays = self.salesOrderShippingViewModel.oldCalendarDays();
		//}
		//else
		//{
		//	salesOrderDetails.CalendarDays = self.salesOrderShippingViewModel.transitDays();
		//	salesOrderDetails.TransitDays = self.salesOrderShippingViewModel.oldTransitDays();
		//}
		var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
		salesOrderDetails.TransitDays = self.salesOrderShippingViewModel.transitDays();
		var estimatedDueDate = new Date(self.salesOrderShippingViewModel.estimatedDueDate());
		var requestedPickUpDate = new Date(self.salesOrderShippingViewModel.requestedPickupDate());
		salesOrderDetails.CalendarDays = Math.round(Math.abs((estimatedDueDate.getTime() - requestedPickUpDate.getTime()) / (oneDay))).toString();
		// ###END: US19648
		salesOrderDetails.ReadyTimeString = self.salesOrderShippingViewModel.pickupReadyTime();
		salesOrderDetails.CloseTimeString = self.salesOrderShippingViewModel.pickupCloseTime();
		salesOrderDetails.OriginTerminalPhone = self.salesOrderShippingViewModel.originTerminalPhone();
		salesOrderDetails.DestinationTerminalPhone = self.salesOrderShippingViewModel.destinationTerminalPhone();
		salesOrderDetails.ServiceType = self.salesOrderShippingViewModel.selectedServiceType();
		salesOrderDetails.DeliveryDate = self.salesOrderShippingViewModel.deliveryDate();
		salesOrderDetails.PickupRemarks = self.salesOrderShippingViewModel.pickupRemarks();
		salesOrderDetails.DeliveryRemarks = self.salesOrderShippingViewModel.deliverRemarks();
		salesOrderDetails.OriginZip = self.salesOrderAddressViewModel.shipperLocation.location().Zip;
		salesOrderDetails.DestinationZip = self.salesOrderAddressViewModel.consigneeLocation.location().Zip;
		salesOrderDetails.CarrierId = self.salesOrderDetailsViewModel.carrierSearchList.ID();
		salesOrderDetails.CarrierName = self.salesOrderDetailsViewModel.carrierSearchList.vendorName();
		salesOrderDetails.EmergencyContactNo = self.salesOrderHazmatViewModel.emergencyPhone().toString();
		//salesOrderDetails.EmergencyContactNo = self.salesOrderHazmatViewModel.emergencyPhone().toString().substring(0, 13);
		salesOrderDetails.EmergencyContactExtension = self.salesOrderHazmatViewModel.emergencyPhone().toString().substring(14);
		salesOrderDetails.ProcessFlow = self.salesOrderDetailsObject.ProcessFlow;
		salesOrderDetails.EstimatedDueDate = self.estimateDueDate();
		salesOrderDetails.CarrierPickupNumber = self.salesOrderShippingViewModel.carrierPickupNumber();
		salesOrderDetails.UpdatedDateTime = self.salesOrderDetailsViewModel.UpdatedDateTime();
		salesOrderDetails.Id = self.salesOrderDetailsViewModel.salesOrderId();
		salesOrderDetails.VendorBillId = self.salesOrderDetailsViewModel.vendorbillid();
		salesOrderDetails.SalesRepName = self.salesOrderDetailsViewModel.salesRep();
		salesOrderDetails.SalesRepId = self.salesOrderDetailsViewModel.salesOrderId();
		if (self.salesOrderShippingViewModel.newShipmentType() === refEnums.Enums.ShipmentType.General.Value) {
			salesOrderDetails.NewShipmentType = refEnums.Enums.ShipmentType.General.ID;
		}
		if (self.salesOrderShippingViewModel.newShipmentType() === refEnums.Enums.ShipmentType.SCM.Value) {
			salesOrderDetails.NewShipmentType = refEnums.Enums.ShipmentType.SCM.ID;
		}
		salesOrderDetails.MainBolNo = self.salesOrderDetailsViewModel.mainBolNo();
		salesOrderDetails.SalesRepId = self.salesOrderDetailsObject.SalesRepId;
		salesOrderDetails.IsSaveEnable = self.salesOrderDetailsObject.IsSaveEnable;
		salesOrderDetails.OriginalRevenue = self.salesOrderOriginalRevenue;
		salesOrderDetails.OriginalPLCCost = self.salesOrderOriginalPlcCost;
		salesOrderDetails.CarrierCode = self.salesOrderDetailsViewModel.carrierSearchList.carrierCode();
		salesOrderDetails.IsBillingStation = self.salesOrderDetailsViewModel.isBillingStation();
		salesOrderDetails.IsCalendarDaysNull = self.salesOrderShippingViewModel.isCalendarDaysNull();

		// ###START: DE23007
		salesOrderDetails.TotalWeight = self.salesOrderShippingViewModel.totalWeigth();
		salesOrderDetails.TotalPieces = self.salesOrderShippingViewModel.totalPieces();
		// ###END: DE23007

		salesOrderDetails.ShipmentBy = self.salesOrderShippingViewModel.shipBy(); //DE20717

		// ###START: DE21747
		salesOrderDetails.TariffType = self.salesOrderDetailsViewModel.tariffType();
		salesOrderDetails.ShipmentCarrierType = self.salesOrderDetailsViewModel.shipmentCarrierType();

		// ###END: DE21747

		// ##START: DE23203
		if (self.isNewSubOrder()) {
			salesOrderDetails.TariffStartDate = self.salesOrderDetailsViewModel.TariffStartDate;
			salesOrderDetails.TariffNumber = self.salesOrderDetailsViewModel.TariffNumber();
		}
		// ##END: DE23203

		// ###START: DE23916
		salesOrderDetails.BillToLocationType = self.salesOrderDetailsViewModel.billToLocationType;

		// ###END: DE23916
		return salesOrderDetails;
	}

	// To get Sales Order Address Details
	public getSalesOrderAddress(): Array<ISalesOrderAddress> {
		var self = this;

		var addresses: Array<refSalesOrderAddressDetailModel.Models.SalesOrderAddressDetail>;
		addresses = ko.observableArray([])();

		var ShipperAddress = new refSalesOrderAddressDetailModel.Models.SalesOrderAddressDetail();
		var ConsigneeAddress = new refSalesOrderAddressDetailModel.Models.SalesOrderAddressDetail();
		var BillToAddress = new refSalesOrderAddressDetailModel.Models.SalesOrderAddressDetail();

		// Create Shipper Address Model
		ShipperAddress.Id = 0;
		ShipperAddress.Street = self.salesOrderAddressViewModel.shipperAddress1();
		ShipperAddress.Street2 = self.salesOrderAddressViewModel.shipperAddress2();
		ShipperAddress.CompanyName = self.salesOrderAddressViewModel.shipperCompanyName();
		ShipperAddress.ContactPerson = self.salesOrderAddressViewModel.shipperContactPerson();
		ShipperAddress.City = self.salesOrderAddressViewModel.shipperLocation.location().City;
		ShipperAddress.State = self.salesOrderAddressViewModel.shipperLocation.location().StateCode;

		ShipperAddress.ZipCode = self.salesOrderAddressViewModel.shipperLocation.location().Zip;
		ShipperAddress.Phone = self.salesOrderAddressViewModel.shipperPhone();
		ShipperAddress.Fax = self.salesOrderAddressViewModel.shipperFax();
		if (self.salesOrderAddressViewModel.shipperLocation.location().CountryCode !== null && self.salesOrderAddressViewModel.shipperLocation.location().CountryCode !== 0) {
			ShipperAddress.Country = self.salesOrderAddressViewModel.isInternationalShipmentSelected() ? self.salesOrderAddressViewModel.selectedShipperCountryCode() : $.number(self.salesOrderAddressViewModel.shipperLocation.location().CountryCode);
		}
		else {
			ShipperAddress.Country = self.salesOrderAddressViewModel.isInternationalShipmentSelected() ? self.salesOrderAddressViewModel.selectedShipperCountryCode() : 1;
		}
		ShipperAddress.AddressType = 1;

		// Create Consignee Address Model
		ConsigneeAddress.Id = 0;
		ConsigneeAddress.Street = self.salesOrderAddressViewModel.consigneeAddress1();
		ConsigneeAddress.Street2 = self.salesOrderAddressViewModel.consigneeAddress2();
		ConsigneeAddress.CompanyName = self.salesOrderAddressViewModel.consigneeCompanyName();
		ConsigneeAddress.ContactPerson = self.salesOrderAddressViewModel.consigneeContactPerson();
		ConsigneeAddress.City = self.salesOrderAddressViewModel.consigneeLocation.location().City;
		ConsigneeAddress.State = self.salesOrderAddressViewModel.consigneeLocation.location().StateCode;

		ConsigneeAddress.ZipCode = self.salesOrderAddressViewModel.consigneeLocation.location().Zip;
		ConsigneeAddress.Phone = self.salesOrderAddressViewModel.consigneePhone();
		ConsigneeAddress.Fax = self.salesOrderAddressViewModel.consigneeFax();
		if (self.salesOrderAddressViewModel.consigneeLocation.location().CountryCode !== null && self.salesOrderAddressViewModel.consigneeLocation.location().CountryCode !== 0) {
			ConsigneeAddress.Country = self.salesOrderAddressViewModel.isInternationalShipmentSelected() ? self.salesOrderAddressViewModel.selectedConsigneeCountryCode() : $.number(self.salesOrderAddressViewModel.consigneeLocation.location().CountryCode);
		}
		else {
			ConsigneeAddress.Country = self.salesOrderAddressViewModel.isInternationalShipmentSelected() ? self.salesOrderAddressViewModel.selectedConsigneeCountryCode() : 1;
		}
		ConsigneeAddress.AddressType = 2;

		// Create Bill To Address Model
		BillToAddress.Id = 0;
		BillToAddress.Street = self.salesOrderAddressViewModel.billToAddress1();
		BillToAddress.Street2 = self.salesOrderAddressViewModel.billToAddress2();
		BillToAddress.CompanyName = self.salesOrderAddressViewModel.billToCompanyName();
		BillToAddress.City = self.salesOrderAddressViewModel.billToLocation.location().City;
		BillToAddress.State = self.salesOrderAddressViewModel.billToLocation.location().State;
		BillToAddress.ZipCode = self.salesOrderAddressViewModel.billToLocation.location().Zip;
		BillToAddress.Phone = self.salesOrderAddressViewModel.billToPhone();
		BillToAddress.Fax = self.salesOrderAddressViewModel.billToFax();
		if (self.salesOrderAddressViewModel.billToLocation.location().CountryCode !== null && self.salesOrderAddressViewModel.billToLocation.location().CountryCode !== 0) {
			BillToAddress.Country = self.salesOrderAddressViewModel.isInternationalShipmentSelected() ? self.salesOrderAddressViewModel.selectedBillToCountryCode() : $.number(self.salesOrderAddressViewModel.billToLocation.location().CountryCode);
		}
		else {
			BillToAddress.Country = self.salesOrderAddressViewModel.isInternationalShipmentSelected() ? self.salesOrderAddressViewModel.selectedBillToCountryCode() : 1;
		}
		BillToAddress.AddressType = 3;

		addresses.push(ShipperAddress);
		addresses.push(ConsigneeAddress);
		addresses.push(BillToAddress);
		return addresses;
	}

	// To Get Sales Order Item Details
	public getSalesOrderItemsDetails(): Array<ISalesOrderItem> {
		var self = this;

		var salesOrderItems: Array<refSalesOrderItemDetailModel.Models.SalesOrderItemDetail>;
		salesOrderItems = ko.observableArray([])();

		self.salesOrderItemViewModel.salesOrderItemsList().forEach((item) => {
			var salesOrderItem = new refSalesOrderItemDetailModel.Models.SalesOrderItemDetail();
			salesOrderItem.Cost = item.cost();
			salesOrderItem.Height = item.dimensionHeight();
			salesOrderItem.Length = item.dimensionLength();
			salesOrderItem.Width = item.dimensionWidth();
			salesOrderItem.Id = item.id();
			salesOrderItem.PackageTypeId = item.selectedPackageType();
			salesOrderItem.PieceCount = item.pieceCount();
			salesOrderItem.SelectedClassType = item.selectedClassType();
			salesOrderItem.SelectedItemTypes = item.selectedItemTypes();
			salesOrderItem.UserDescription = item.userDescription();
			salesOrderItem.Weight = item.weight();
			salesOrderItem.Revenue = item.rev();
			salesOrderItem.Hazardous = item.isHazardous();
			salesOrderItem.Class = item.selectedClassType();
			salesOrderItem.IsShippingItem = item.isShippingItem();
			salesOrderItem.HazardousUNNo = item.hazmatUnNumber();
			salesOrderItem.PackingGroupNo = item.packingGroup();
			salesOrderItem.HazmatClass = item.hazardousClass();
			salesOrderItem.NMFC = item.nmfc();
			salesOrderItem.PalletCount = item.palletCount();
			salesOrderItem.BsCost = item.bSCost();
			salesOrderItem.ItemId = item.itemId();
			salesOrderItem.ItemName = item.itemName();
			if (item.bSCost() === null || item.bSCost() === undefined || item.bSCost().toString() === "") {
				salesOrderItem.PLCCost = 0.00;
			}
			else {
				salesOrderItem.PLCCost = item.bSCost();
			}
			salesOrderItems.push(salesOrderItem);
		});

		return salesOrderItems;
	}

	// To Get Sales Order Item Details
	public getSalesOrderRebillItemsDetails(itemsList: Array<refSalesOrderItemModel.Models.SalesOrderItemsModel>): Array<ISalesOrderItem> {
		var self = this;

		var salesOrderItems: Array<refSalesOrderItemDetailModel.Models.SalesOrderItemDetail>;
		salesOrderItems = ko.observableArray([])();

		itemsList.forEach((item) => {
			var salesOrderItem = new refSalesOrderItemDetailModel.Models.SalesOrderItemDetail();
			salesOrderItem.Cost = item.cost();
			salesOrderItem.Height = item.dimensionHeight();
			salesOrderItem.Length = item.dimensionLength();
			salesOrderItem.Width = item.dimensionWidth();
			salesOrderItem.Id = item.id();
			salesOrderItem.PackageTypeId = item.selectedPackageType();
			salesOrderItem.PieceCount = item.pieceCount();
			salesOrderItem.SelectedClassType = item.selectedClassType();
			salesOrderItem.SelectedItemTypes = item.selectedItemTypes();
			salesOrderItem.UserDescription = item.userDescription();
			salesOrderItem.Weight = item.weight();
			salesOrderItem.Revenue = item.rev();
			salesOrderItem.Hazardous = item.isHazardous();
			salesOrderItem.Class = item.selectedClassType();
			salesOrderItem.IsShippingItem = item.isShippingItem();
			salesOrderItem.HazardousUNNo = item.hazmatUnNumber();
			salesOrderItem.PackingGroupNo = item.packingGroup();
			salesOrderItem.HazmatClass = item.hazardousClass();
			salesOrderItem.NMFC = item.nmfc();
			salesOrderItem.PalletCount = item.palletCount();
			salesOrderItem.BsCost = item.bSCost();
			salesOrderItem.ItemId = item.itemId();
			salesOrderItem.ItemName = item.itemName();
			if (item.bSCost() === null || item.bSCost() === undefined || item.bSCost().toString() === "") {
				salesOrderItem.PLCCost = 0.00;
			}
			else {
				salesOrderItem.PLCCost = item.bSCost();
			}
			salesOrderItems.push(salesOrderItem);
		});

		return salesOrderItems;
	}

	// To Get Sales Order Item Details
	public getItemsDetailsByResponseItems(itemsList: Array<ISalesOrderItem>): Array<ISalesOrderItem> {
		var self = this;

		var salesOrderItems: Array<refSalesOrderItemDetailModel.Models.SalesOrderItemDetail>;
		salesOrderItems = ko.observableArray([])();

		itemsList.forEach((item) => {
			var salesOrderItem = new refSalesOrderItemDetailModel.Models.SalesOrderItemDetail();
			salesOrderItem.Cost = item.Cost;
			salesOrderItem.Height = item.Height;
			salesOrderItem.Length = item.Length;
			salesOrderItem.Width = item.Width;
			salesOrderItem.Id = item.Id;
			salesOrderItem.PackageTypeId = item.PackageTypeId;
			salesOrderItem.PieceCount = item.PieceCount;
			salesOrderItem.SelectedClassType = item.SelectedClassType;
			salesOrderItem.SelectedItemTypes = item.SelectedItemTypes;
			salesOrderItem.UserDescription = item.UserDescription;
			salesOrderItem.Weight = item.Weight;
			salesOrderItem.Revenue = item.Revenue;
			salesOrderItem.Hazardous = item.Hazardous;
			salesOrderItem.Class = item.Class;
			salesOrderItem.IsShippingItem = item.IsShippingItem;
			salesOrderItem.HazardousUNNo = item.HazardousUNNo;
			salesOrderItem.PackingGroupNo = item.PackingGroupNo;
			salesOrderItem.HazmatClass = item.HazmatClass;
			salesOrderItem.NMFC = item.NMFC;
			salesOrderItem.PalletCount = item.PalletCount;
			salesOrderItem.BsCost = item.BsCost;
			salesOrderItem.ItemId = item.ItemId;

			if (item.PLCCost === null || item.PLCCost === undefined || item.PLCCost.toString() === "") {
				salesOrderItem.PLCCost = 0.00;
			}
			else {
				salesOrderItem.PLCCost = item.PLCCost;
			}

			salesOrderItems.push(salesOrderItem);
		});

		return salesOrderItems;
	}


	// To get Sales Order RequoteReview Detail
	public getSalesOrderRequoteReasonDetails(): ISalesOrderRequoteReviewDetail {
		var self = this;
		var salesOrderReqouteReviewDetails = new refSalesOrderReqouteReviewDetailModel.Model.SalesOrderRequoteReviewDetail();

		salesOrderReqouteReviewDetails.AdjustmentDate = self.salesorderReBillViewModel.adjustmentDate();
		salesOrderReqouteReviewDetails.CRReviewDate = self.salesorderReBillViewModel.crrReviewDate();
		salesOrderReqouteReviewDetails.ID = self.salesorderReBillViewModel.requoteReasonid();
		salesOrderReqouteReviewDetails.ReviewedBy = self.salesorderReBillViewModel.rebillRep();
		salesOrderReqouteReviewDetails.SalesOrderId = self.salesOrderDetailsViewModel.salesOrderId();

		return salesOrderReqouteReviewDetails;
	}

	// To get Sales Order RequoteReview Detail
	public getSalesOrderShipmentRequoteReasonDetails(): Array<ISalesOrderShipmentRequoteReason> {
		var self = this;
		var salesOrderShipmentRequoteReasonDetail: Array<ISalesOrderShipmentRequoteReason>;
		salesOrderShipmentRequoteReasonDetail = ko.observableArray([])();
		salesOrderShipmentRequoteReasonDetail.removeAll();
		//self.salesorderReBillViewModel.obcSalesOrderOptionList().foreach((row) {
		//});
		var selecetedList = self.salesorderReBillViewModel.obcSalesOrderOptionList.getSelectedOptions(true);
		if (selecetedList != null) {
			selecetedList.forEach((item) => {
				var salesOrderShipmentRequoteReasonDetailitem = new refSalesOrderReQuoteReasonsModel.Model.SalesOrderShipmentRequoteReason();
				if (item.selected) {
					salesOrderShipmentRequoteReasonDetailitem.ID = 0;
					salesOrderShipmentRequoteReasonDetailitem.Remarks = item.name();
					salesOrderShipmentRequoteReasonDetailitem.RequoteReasonID = item.id;
					salesOrderShipmentRequoteReasonDetail.push(salesOrderShipmentRequoteReasonDetailitem);
				}
			});
		}
		if (self.salesorderReBillViewModel.isOtherReason()) {
			var salesOrderShipmentRequoteReasonDetailitem = new refSalesOrderReQuoteReasonsModel.Model.SalesOrderShipmentRequoteReason();
			salesOrderShipmentRequoteReasonDetailitem.ID = 0;
			salesOrderShipmentRequoteReasonDetailitem.Remarks = self.salesorderReBillViewModel.otherReason();
			salesOrderShipmentRequoteReasonDetailitem.RequoteReasonID = 11;
			salesOrderShipmentRequoteReasonDetail.push(salesOrderShipmentRequoteReasonDetailitem);
		}

		return salesOrderShipmentRequoteReasonDetail;
	}

	//To get Sales Order Note Details
	public getSalesOrderNotes(): Array<ISalesOrderNotes> {
		var self = this;
		var newShipment = false;
		var salesOrderNotes: Array<refSalesOrderNotesModel.Models.SalesOrderNoteDetails>;
		salesOrderNotes = ko.observableArray([])();
		salesOrderNotes.removeAll();
		self.salesOrderNotesViewModel.salesOrderNoteItems().forEach(function (item, collection) {
			if (item.description() != "") {
				salesOrderNotes.push(self.AddNoteItem(item));
			}
		});

		//self.salesOrderNotesViewModel.salesOrderNoteItems().every(function (item) {
		//	if (item.id() != 0) {
		//		newShipment = false;
		//	}
		//	return newShipment;
		//});

		if (self.salesOrderDetailsObject.Id === 0) {
			newShipment = true;
		}

		if (newShipment || self.isNewSubOrder()) {
			//## While creating vendor bill from entry view we are adding a general notes.
			var notesDescription = "Sales Order with BOL: " + self.salesOrderDetailsViewModel.salesOrderNumber() + " has been created by: " + self.currentUser().FullName;
			var itemNew = new refSalesOrderNotesViewModel.salesOrderNoteItem(0, 0, notesDescription, self.currentUser().FullName, Date.now(), "System", refEnums.Enums.Note.System.ID);
			salesOrderNotes.push(self.AddNoteItem(itemNew));
		}

		// Check if notes data is entered but not added in the list
		if (self.salesOrderNotesViewModel.canAdd()) {
			notesDescription = self.salesOrderNotesViewModel.userNote();
			itemNew = new refSalesOrderNotesViewModel.salesOrderNoteItem(0, 0, notesDescription, self.currentUser().FullName, Date.now(), "General", refEnums.Enums.Note.General.ID);
			salesOrderNotes.push(self.AddNoteItem(itemNew));
		}

		//Check if statusChangedByCRR is true then enter note
		if (self.statusChangedByCRR()) {
			var notesDescription = self.noteDescription();
			var itemNew = new refSalesOrderNotesViewModel.salesOrderNoteItem(0, 0, notesDescription, self.currentUser().FullName, Date.now(), "System", refEnums.Enums.Note.System.ID);
			salesOrderNotes.push(self.AddNoteItem(itemNew));
		}

		if (self.salesOrderDetailsViewModel.selectedOrderStatus() !== self.salesOrderDetailsObject.ProcessStatusId) {
			var noteDescription = "Sales Order Status Change: " + self.CommonUtils.getEnumValueById(refEnums.Enums.OrderStatus, self.salesOrderDetailsObject.OrderStatusId.toString()) + " - " +
				self.CommonUtils.getEnumValueById(refEnums.Enums.OrderStatus, self.salesOrderDetailsViewModel.selectedOrderStatus().toString());
			var itemNew = new refSalesOrderNotesViewModel.salesOrderNoteItem(0, 0, noteDescription, self.currentUser().FullName, Date.now(), "System", refEnums.Enums.Note.System.ID);
			salesOrderNotes.push(self.AddNoteItem(itemNew));
		}

		return salesOrderNotes;
	}

	//START US18837
	private checkForReclassOrReweigh() {
		var self = this;

		if (typeof self.salesOrderItemsOnLoad === "undefined")
			return true;

		for (var i = 0; i < self.salesOrderItemsOnLoad.length; i++) {
			var item = self.salesOrderItemsOnLoad[i];
			var newItem = $.grep(self.salesOrderItemViewModel.salesOrderItemsList(), function (e) { return e.id() === item.Id; })[0]

			if (typeof newItem === "undefined") {
				////##START: US19354
				self.salesOrderNotesViewModel.addNoteForReclass("Billing \"" + item.UserDescription + "\" removed from SO");
				////##END: US19354
				continue;
			}

			if (typeof (newItem.selectedClassType()) !== "undefined" && item.Class == 0) {
				self.salesOrderNotesViewModel.addNoteForReclass("Class changed from " + item.Class + " to " + newItem.selectedClassType());
			}
			else if (typeof (newItem.selectedClassType()) === "undefined" && item.Class !== 0) {
				self.salesOrderNotesViewModel.addNoteForReclass("Class changed from " + item.Class + " to 0");
			}
			else if ((typeof (newItem.selectedClassType()) !== "undefined" && item.Class !== 0) && item.Class !== newItem.selectedClassType()) {
				self.salesOrderNotesViewModel.addNoteForReclass("Class changed from " + item.Class + " to " + newItem.selectedClassType());
			}

			if (newItem.weight() != item.Weight) {
				self.salesOrderNotesViewModel.addNoteForReclass("Weight changed from " + item.Weight + " to " + newItem.weight());
			}

			////##START: US19354
			if (newItem.cost() != item.Cost.toFixed(2)) {
				self.salesOrderNotesViewModel.addNoteForReclass("Cost changed from $" + item.Cost.toFixed(2) + " to $" + newItem.cost() + " for \"" + newItem.userDescription() + "\"");
			}

			if (newItem.rev() != item.Revenue.toFixed(2)) {
				self.salesOrderNotesViewModel.addNoteForReclass("Revenue changed from $" + item.Revenue.toFixed(2) + " to $" + newItem.rev() + " for \"" + newItem.userDescription() + "\"");
			}
			////##END: US19354
		}

		//##START: US19354
		var newlyAddedItems = self.salesOrderItemViewModel.salesOrderItemsList().filter(function (obj) {
			return obj.id() == 0;
		});


		if (newlyAddedItems.length !== 0) {
			for (var i = 0; i < newlyAddedItems.length; i++) {
				self.salesOrderNotesViewModel.addNoteForReclass("Billing \"" + newlyAddedItems[i].userDescription() + "\" added in SO");
			}
		}
		//##END: US19354
	}

	//END US18837

	////##START: US19354
	private addNotesForInputChanges() {
		var self = this;

		// Check for Zipocde changes
		if (self.salesOrderAddressOnLoad[0] != self.salesOrderAddressViewModel.shipperLocation.location().Zip) {
			self.salesOrderNotesViewModel.addNoteForReclass("Shipper Zipcode changed from " + self.salesOrderAddressOnLoad[0] + " to " + self.salesOrderAddressViewModel.shipperLocation.location().Zip);
		}
		if (self.salesOrderAddressOnLoad[1] != self.salesOrderAddressViewModel.consigneeLocation.location().Zip) {
			self.salesOrderNotesViewModel.addNoteForReclass("Consignee Zipcode changed from " + self.salesOrderAddressOnLoad[1] + " to " + self.salesOrderAddressViewModel.consigneeLocation.location().Zip);
		}

		// check for carrier change
		if (self.salesorderCarrierIdOnLoad.Id != self.salesOrderDetailsViewModel.carrierSearchList.ID()) {
			self.salesOrderNotesViewModel.addNoteForReclass("Carrier changed from \"" + self.salesorderCarrierIdOnLoad.Name + "\" to \"" + self.salesOrderDetailsViewModel.carrierSearchList.name().CarrierName + "\"");
		}

		self.checkForReclassOrReweigh();
	}
	////##END: US19354

	////##START: DE25233
	private addNotesForInsuranceCancel() {
		var self = this;
		var insuranceItemPresent = false;
		if (self.orderStatusOnLoad === refEnums.Enums.OrderStatus.Canceled.ID
			&& self.salesOrderSaveData.SalesOrderDetail.OrderStatusId !== refEnums.Enums.OrderStatus.Canceled.ID
			&& (self.salesOrderShippingViewModel.serviceType == 0 || self.salesOrderShippingViewModel.serviceType == 1 || self.salesOrderShippingViewModel.serviceType == 2)
			&& parseFloat(self.salesOrderShippingViewModel.insuredAmount().toString().replace(/,/g, "")) > 0) {
			self.salesOrderSaveData.SalesOrderItemDetails.forEach((item) => {

				if (item.ItemId === 44) {
					insuranceItemPresent = true;
				}
			});

			if (insuranceItemPresent === true) {
				self.salesOrderNotesViewModel.addNoteForCanceledInsurance("Billing \"Insurance\" and \"Insured load value\" against BOL# " + self.salesOrderDetailsViewModel.salesOrderNumber() + " are successfully removed via Accounting Center.");
			}
			else {
				self.salesOrderNotesViewModel.addNoteForCanceledInsurance("\"Insured load value\" against BOL# " + self.salesOrderDetailsViewModel.salesOrderNumber() + " is successfully removed via Accounting Center.");
			}
		}
	}
	////##END: DE25233

	// function to use get item note model
	private AddNoteItem(item: refSalesOrderNotesViewModel.salesOrderNoteItem) {
		var itemNote = new refSalesOrderNotesModel.Models.SalesOrderNoteDetails();

		// For the entity ID will be filled by server
		itemNote.Id = item.id();
		itemNote.EntityId = item.entityId();
		itemNote.NotesBy = item.noteBy();
		itemNote.NotesDate = new Date(item.noteDate());
		itemNote.Description = item.description();
		itemNote.NoteTypeName = item.noteType();
		itemNote.NotesType = item.noteTypeValue();
		return itemNote;
	}

	// function to use get item note model
	private AddScheduleInvoiceNoteItem(item: ISalesOrderNotes) {
		var itemNote = new refSalesOrderNotesModel.Models.SalesOrderNoteDetails();

		// For the entity ID will be filled by server
		itemNote.Id = item.Id;
		itemNote.EntityId = item.EntityId;
		itemNote.NotesBy = item.NotesBy;
		itemNote.NotesDate = item.NotesDate;
		itemNote.Description = item.Description;
		itemNote.NoteTypeName = item.NoteTypeName;

		return itemNote;
	}

	private DisableAlltheControls() {
		var self = this;
		$('#mainDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#detailsDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#itemsDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#addressDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#multilegDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#shippingDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#shippmentNotesDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#podDoc').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#hazmatDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#mainDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#topButtonsDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#detailsView').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#address').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#item').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#shipping').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#dispute').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#hazmat').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#notification').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#multileg').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#claim').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#invoiceException').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#audit').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#rebill').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#auditedBill').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#shipmentNotes').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#tab_podDoc').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#invExceptionDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
		$('#invoiceException').find('input, textarea, button, select').attr('disabled', 'disabled');

		if (self.IsReadOnly) {
			if (self.CanCreateNotes) {
				self.salesOrderNotesViewModel.CanCreateNotes = self.CanCreateNotes;
				$('#notesDIV').find('input, textarea, button, select').removeAttr('disabled');
				self.salesOrderNotesViewModel.canAdd(true);
				self.salesOrderNotesViewModel.canSave(true);

				self.salesOrderNotesViewModel.canAdd(false);
				self.salesOrderNotesViewModel.canSave(false);
			}
		}

		//// ###START: US25349
		// disabling all the values except items section and notes and top button section
		if (self.IsTruckLoadSubOrder) {
			$('#btnPrintBOL').removeAttr('disabled');
			$('#btnCreateBill').removeAttr('disabled');
			// ###START: DE24990
			$('#btnScheduleInvoice').removeAttr('disabled');

			// ###START: US26037
			$('#btnRequestCredit').removeAttr('disabled');

			// ###END: US26037
			self.salesOrderAddressViewModel.shipperLocation.shouldBeReadOnly(true);
			// ###END: DE24990
		}
		if (self.IsTruckLoadSubOrder && !self.IsReadOnly && self.InvoiceStatus === refEnums.Enums.InvoiceStatus.Pending.ID) {
			$('#item').find('input, textarea, button, select').removeAttr('disabled');
			$('#itemsDiv').find('input, textarea, button, select').removeAttr('disabled');
			self.salesOrderNotesViewModel.CanCreateNotes = self.CanCreateNotes;
			$('#notesDIV').find('input, textarea, button, select').removeAttr('disabled');
			self.salesOrderNotesViewModel.canAdd(true);
			self.salesOrderNotesViewModel.canSave(true);

			self.salesOrderNotesViewModel.canAdd(false);
			self.salesOrderNotesViewModel.canSave(false);
			self.salesorderAuditedBillViewModel.btnCopyEnable(false);
			self.canMakeCopy(false);
			self.isSaveEnable(false);
		}
		//// ###END: US25349
	}

	////##START: DE21287
	private DisableBookedDate() {
		$('#bookeddate').attr('disabled', 'disabled');
	}
	////##END: DE21287

	// To get Sales Order Terminal Address
	public getSalesOrderTerminalAddress(): ISalesOrderTerminalAddress {
		var self = this;
		var salesOrderTerminalAddress = new refSalesOrderTerminalAddressModel.Models.SalesOrderTerminalAddress();
		salesOrderTerminalAddress.CompanyName = self.salesOrderMultiLegViewModel.terminalHubCompanyName();
		salesOrderTerminalAddress.ContactName = self.salesOrderMultiLegViewModel.terminalHubContactPerson();
		salesOrderTerminalAddress.Phone = self.salesOrderMultiLegViewModel.terminalHubPhone();
		salesOrderTerminalAddress.Fax = self.salesOrderMultiLegViewModel.terminalHubFax();
		salesOrderTerminalAddress.Street1 = self.salesOrderMultiLegViewModel.terminalHubAddress1();
		salesOrderTerminalAddress.Street2 = self.salesOrderMultiLegViewModel.terminalHubAddress2();
		salesOrderTerminalAddress.City = self.salesOrderMultiLegViewModel.oceanCarrierSearchList.city();
		salesOrderTerminalAddress.State = self.salesOrderMultiLegViewModel.oceanCarrierSearchList.stateCode();
		salesOrderTerminalAddress.Zip = self.salesOrderMultiLegViewModel.oceanCarrierSearchList.zip();

		return salesOrderTerminalAddress;
	}

	// To Get Sales Order Multileg Carrier Details
	public getSalesOrderMultilegCarrierDetails(): ISalesOrderMultilegCarrierDetail {
		var self = this;
		var salesOrderMultilegCarrierDetails = new refSalesOrderMultilegCarrierDetailModel.Models.SalesOrderMultilegCarrierDetail();
		//salesOrderMultilegCarrierDetails.CarrierId = self.salesOrderMultiLegViewModel.oceanCarrierId();
		//salesOrderMultilegCarrierDetails.CarrierName = self.salesOrderMultiLegViewModel.oceanCarriername();
		//salesOrderMultilegCarrierDetails.TransitDays = self.salesOrderMultiLegViewModel.oceanTransitDays();
		//salesOrderMultilegCarrierDetails.PRONumber = self.salesOrderMultiLegViewModel.oceanProNumber();

		salesOrderMultilegCarrierDetails.CarrierId = self.salesOrderMultiLegViewModel.oceanCarrierSearchList.ID();
		salesOrderMultilegCarrierDetails.CarrierName = self.salesOrderMultiLegViewModel.oceanCarrierSearchList.oceanCarrierName();
		if (!self.salesOrderShippingViewModel.isCalendarDaysNull()) {
			salesOrderMultilegCarrierDetails.TransitDays = self.salesOrderMultiLegViewModel.oceanTransitDays();
		}
		else {
			salesOrderMultilegCarrierDetails.CalendarDays = self.salesOrderMultiLegViewModel.oceanTransitDays();
		}
		salesOrderMultilegCarrierDetails.PRONumber = self.salesOrderMultiLegViewModel.oceanProNumber();
		salesOrderMultilegCarrierDetails.ServiceType = self.salesOrderShippingViewModel.selectedServiceType();

		return salesOrderMultilegCarrierDetails;
	}

	//To validate Estimated date
	public validateEstimateDueDate() {
		//To calculate estimated due date based on requested pickup date
		var self = this;
		var transitDays = self.salesOrderShippingViewModel.transitDays();
		var requestedPickDate = new Date(Date.parse(self.salesOrderShippingViewModel.requestedPickupDate()));

		// ##START: DE23850
		// if the transit days field is empty, consider it as 0
		transitDays = transitDays !== "" ? transitDays : "0";

		// if the transit days has a range eg. 1-6 days, then take '6' for calulating the estimated due date and not '1'
		transitDays = transitDays.indexOf('-') === -1 ? transitDays : transitDays.split('-').pop();
		// ##END: DE23850

		if (parseInt(transitDays) > 0) {
			for (var day = 1; day <= parseInt(transitDays); day++) {
				//// Adding transit Days
				requestedPickDate.setDate(requestedPickDate.getDate() + 1);
				var estimatedDueDate = new Date(requestedPickDate.toString());
				//To check Weekends or Holidays
				if (requestedPickDate !== null && requestedPickDate !== undefined) {
					while (!Utils.Common.prototype.isHoliday(requestedPickDate) || !Utils.Common.prototype.isWeekend(requestedPickDate)) {
						requestedPickDate.setDate(requestedPickDate.getDate() + 1);
						estimatedDueDate = new Date(requestedPickDate.toString());
					}
					// self.CommonUtils.formatDate(estimatedDueDate.toString(), 'mm/dd/yyyy')
					self.estimateDueDate(self.CommonUtils.formatDate(estimatedDueDate.toString(), 'mm/dd/yyyy'));
				}
			}
		}
		else {
			var estimatedDueDate = new Date(requestedPickDate.toString());
			//To check Weekends or Holidays
			if (requestedPickDate !== null && requestedPickDate !== undefined) {
				while (!Utils.Common.prototype.isHoliday(requestedPickDate) || !Utils.Common.prototype.isWeekend(requestedPickDate)) {
					requestedPickDate.setDate(requestedPickDate.getDate() + 1);
					estimatedDueDate = new Date(requestedPickDate.toString());
				}
				self.estimateDueDate(self.CommonUtils.formatDate(estimatedDueDate.toString(), 'mm/dd/yyyy'));
			}
		}
	}

	// Show the progress bar
	public showListProgress(progress: boolean) {
		var self = this;
		self.listProgressAccordian(progress);
		self.listProgressTabbed(progress);
	}
	//#endregion

	//#region Cancel Order
	public onCancelOrder() {
		var self = this;
		self.salesorderReBillViewModel.isCallAgain = true;
		self.salesorderAuditedBillViewModel.isCallAgain = true;

		// ##START: US22955
		self.showSalesOrderCancelReasonPopup();
		// ##END: US22955
	}

	// to show the SO cancel reason popup
	// ##START: US22955
	public showSalesOrderCancelReasonPopup() {
		var self = this;

		//callback for on click of submit button on the popup
		var submitCallback = function (note: string) {
			self.cancelSalesOrder(note);
		}

		// on click of cancel button on the popup
		var cancelCallback = function () {
			console.log("Cancelling order cancelled");
		};

		//object to be passed to the popup
		var optionControlArgs: IMessageBoxOption = {
			options: undefined,
			message: '',
			title: 'Confirmation',
			bindingObject: {
				submitCallback: submitCallback,
				cancelCallback: cancelCallback,
				bolNumber: self.salesOrderDetailsViewModel.salesOrderNumber(),
				username: typeof self.currentUser() !== "undefined" ? self.currentUser().FullName : ''
			}
		}

		_app.showDialog('salesOrder/SalesOrderCancelReasonPopup', optionControlArgs); //show popup
	}
	// ##END: US22955

	public onUnCancelOrder() {
		var self = this;
		self.salesorderReBillViewModel.isCallAgain = true;
		self.salesorderAuditedBillViewModel.isCallAgain = true;


		if (self.checkMsgDisplay) {
			self.checkMsgDisplay = false;
			var actionButtons: Array<IToastrActionButtonOptions> = [];
			actionButtons.push({
				actionButtonName: "Yes",
				actionClick: self.unCancelSalesOrder
			});

			actionButtons.push({
				actionButtonName: "No",
				actionClick: self.checkMsgClick
			});

			var toastrOptions: IToastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 0,
				fadeOut: 0,
				typeOfAlert: "",
				title: "",
				actionButtons: actionButtons
			};

			// ###START: US25587 
			if ((self.salesOrderShippingViewModel.serviceType == 0 || self.salesOrderShippingViewModel.serviceType == 1 || self.salesOrderShippingViewModel.serviceType == 2) && parseFloat(self.salesOrderShippingViewModel.insuredAmount().toString().replace(/,/g, "")) > 0) {
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.UnCancelInsuredAmount, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
			}
			else {
				// ###END: US25587

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.ConfirmUnCancelSalesOrder, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				// ###START: US25587
			}
			// ###END: US25587
		}
	}

	// Gets the data from all the different view model and sends those to service
	public setUpModelAndSave() {
		var self = this;
		// to show item tab by default when click on save
		self.ShowDefaultItemTab();
		self.salesOrderSaveData = new refSalesOrderContainerModel.Model.SalesOrderContainer();

		self.salesOrderSaveData.SalesOrderDetail = self.getSalesOrderDetails();
		self.salesOrderSaveData.SalesOrderAddressDetails = self.getSalesOrderAddress();
		//self.salesOrderSaveData.SalesOrderNoteDetails = self.getSalesOrderNotes();
		self.salesOrderSaveData.MultilegCarrierHubAddress = self.getSalesOrderTerminalAddress();
		self.salesOrderSaveData.MultilegCarrierDetails = self.getSalesOrderMultilegCarrierDetails();
		self.salesOrderSaveData.IsSuborder = self.isNewSubOrder();
		self.salesOrderSaveData.PreviousValues = self.salesOrderOriginalData;
		self.salesorderReBillViewModel.isCallAgain = true;
		self.salesorderAuditedBillViewModel.isCallAgain = true;

		self.isSetModelAndSave(false);

		self.showAdjustRevenuePopup();
	}

	public saveData() {
		var self = this;

		//##START: DE25233
		if (self.orderStatusOnLoad === refEnums.Enums.OrderStatus.Canceled.ID
			&& self.salesOrderSaveData.SalesOrderDetail.OrderStatusId !== refEnums.Enums.OrderStatus.Canceled.ID
			&& (self.salesOrderShippingViewModel.serviceType == 0 || self.salesOrderShippingViewModel.serviceType == 1 || self.salesOrderShippingViewModel.serviceType == 2)
			&& parseFloat(self.salesOrderShippingViewModel.insuredAmount().toString().replace(/,/g, "")) > 0) {

			if (!self.isUnCancelToastrShown) {
				self.showUnCancelConfirmationToastr();
				return;
			}
			else {
				self.addNotesForInsuranceCancel();
				self.salesOrderSaveData.SalesOrderItemDetails = $.grep(self.salesOrderSaveData.SalesOrderItemDetails, function (item) {
					return item.ItemId !== 44
				});
			}
		}
		//##END: DE25233

		self.showListProgress(true);
		self.ShowProgressBar(true);
		self.isSetModelAndSave(false);

		self.addNotesForInputChanges(); //US19354
		self.salesOrderSaveData.SalesOrderNoteDetails = self.getSalesOrderNotes();
		//// ###START: US25349
		self.salesOrderSaveData.IsTruckLoadSuborder = self.IsTruckLoadSubOrder;
		//// ###END: US25349
		self.clearLocalStorage(self.salesOrderDetailsViewModel.salesOrderNumber());
		refSalesOrderClient.SalesOrderClient.prototype.SaveSalesOrderDetail(self.salesOrderSaveData, function (message) {
			// Saving successful callback
			self.showListProgress(false);
			self.ShowProgressBar(false);
			self.isSetModelAndSave(true);
			// ##START: DE25233
			self.isUnCancelToastrShown = false;
			// ##END: DE25233
			self.savedSalesOrderId = message.Id;

			var successMessage = '';
			if (self.isNewSubOrder()) {
				successMessage = ApplicationMessages.Messages.SalesOrderSavedSuccessful + ' with BOL# ' + message.BolNumber;
			}
			else {
				successMessage = ApplicationMessages.Messages.SalesOrderUpdateSuccessful;
			}

			var toastrOptions: IToastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 10,
				fadeOut: 10,
				typeOfAlert: "",
				title: ""
			};

			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, successMessage, "success", null, toastrOptions);

			self.isCustomerBillTo = false;

			// If latest bolNumber is not matching to existing bolNumber
			// Then close active tab and open new tab with latest bol Number
			if (message.BolNumber !== self.salesOrderDetailsViewModel.salesOrderNumber()) {
				_app.trigger("closeActiveTab");
				_app.trigger("openSalesOrder", self.savedSalesOrderId, message.BolNumber, (callback) => {
					if (!callback) {
						return;
					}
				}, false);
			}
			else {
				self.registerData(self.savedSalesOrderId);
				self.beforeBind();
				//self.loadViewAfterComposition();
			}
			_app.trigger("IsBIDirtyChange", self.isChange(false));
		}, (message) => {
				_app.trigger("IsBIDirtyChange", self.isChange(false));

				// Saving failed call back
				self.showListProgress(false);
				self.ShowProgressBar(false);
				self.isSetModelAndSave(true);
				// ##START: DE25233
				self.isUnCancelToastrShown = false;
				// ##END: DE25233
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					// ###START: US24632
					delayInseconds: 5,
					fadeOut: 5,

					// ###END: US24632
					typeOfAlert: "",
					title: ""
				}

			// ###START: US24632
			if (typeof (message) === 'object') {
					if (message.StatusModel.StatusCode == Constants.ApplicationConstants.RecordAlreadyChanged) {
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.RecordAlreadyChanged, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
						setTimeout(() => { self.reloadPage() }, 5000);
					}
				} else {
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				}

				// ###END: US24632
			});


	}

	//To Load History details
	public getSalesOrderHistorydetails() {
		var self = this;

		self.salesOrderHistoryViewModel.historyNewValueContainer.listProgress(true);
		//Checking view is tabbed or Accordion then as per view calling service
		if (self.isAccordion()) {
			if (!$('#collapseHistory').hasClass('in')) {
				self.callGetSalesOrderhistoryDetails();
			}
		}
		else {
			if (!$('#history').hasClass('in') && !$('#historyLink').hasClass('in')) {
				self.callGetSalesOrderhistoryDetails();
			}
		}

		// To avoid tabs goes blank on quick move between tabs
		self.collapseAllTabs();
		$('#history').addClass('active in');
		$('#historyLink').addClass('active in');
	}

	public callGetSalesOrderhistoryDetails() {
		var self = this;
		var successCallBack = function (data) {
			var commonUtils = new Utils.Common();
			// To load History Details
			self.salesOrderHistoryViewModel.initializeHistoryDetails(data, data.SalesOrderId, true);

			self.salesOrderHistoryViewModel.historyNewValueContainer.listProgress(false);
		},
			faliureCallBack = function () {
				self.salesOrderHistoryViewModel.historyNewValueContainer.listProgress(false);
			};
		self.salesOrderClient.GetShipmentHistoryByShipmentId(self.salesOrderDetailsViewModel.salesOrderId(), successCallBack, faliureCallBack);
	}

	// To Validate Cost And Revenue Negative Margin
	public validateCostAndRevenue() {
		var self = this;
		var validRevenue = true;
		var totalItemCost = 0.0;
		var totalItemRevenue = 0.0;
		if (self.salesOrderDetailsViewModel.customerTypeOf() == refEnums.Enums.CustomerType.BillingStation_Customer.ID || self.salesOrderDetailsViewModel.customerTypeOf() == refEnums.Enums.CustomerType.PLC_Customer.ID) {
			var items = self.getSalesOrderItemsDetails();
			items.forEach((item) => {
				totalItemCost += parseFloat(item.Cost.toString().replace(/,/g, ""));
				totalItemRevenue += parseFloat(item.PLCCost.toString().replace(/,/g, ""));
			});

			if (items.length > 0) {
				if (totalItemCost > totalItemRevenue) {
					validRevenue = false;
					if (self.salesOrderDetailsViewModel.customerTypeOf() == refEnums.Enums.CustomerType.BillingStation_Customer.ID) {
						if (self.checkMsgDisplay) {
							self.checkMsgDisplay = false;
							var toastrOptions = {
								toastrPositionClass: "toast-top-middle",
								delayInseconds: 10,
								fadeOut: 10,
								typeOfAlert: "",
								title: ""
							}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.TotalBScostcannotbelessthantotalcost, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
						}
					}
					else if (self.salesOrderDetailsViewModel.customerTypeOf() == refEnums.Enums.CustomerType.PLC_Customer.ID) {
						if (self.checkMsgDisplay) {
							self.checkMsgDisplay = false;
							var toastrOptions = {
								toastrPositionClass: "toast-top-middle",
								delayInseconds: 10,
								fadeOut: 10,
								typeOfAlert: "",
								title: ""
							}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.TotalPLCcostcannotbelessthantotalcost, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
						}
					}
				}
			}
		}
		else {
			var items = self.getSalesOrderItemsDetails();
			items.forEach((item) => {
				totalItemCost += parseFloat(item.Cost.toString().replace(/,/g, ""));
				totalItemRevenue += parseFloat(item.Revenue.toString().replace(/,/g, ""));
			});

			if (items.length > 0) {
				if (totalItemCost > totalItemRevenue) {
					validRevenue = false;
					if (self.checkMsgDisplay) {
						self.checkMsgDisplay = false;
						var toastrOptions = {
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 10,
							fadeOut: 10,
							typeOfAlert: "",
							title: ""
						}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.TotalRevenueCannotbelessthantotalcost, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
					}
				}
			}
		}

		// revenue is not valid then set the progress bar to false
		if (!validRevenue) {
			self.ShowProgressBar(false);
		}

		return validRevenue;
	}

	// ###START: US21133
	//To Load MAS details
	/// <summary>
	/// Fetches the MAS Details 
	/// </summary>
	/// <createDetails>
	/// <id>US21133</id> <by>Baldev Singh Thakur</by> <date>07-04-2016</date>
	/// </createDetails>
	public onGetSalesOrderMasDetailsClick() {
		var self = this;

		//Checking view is tabbed or Accordion then as per view calling service
		if (self.isAccordion()) {
			if (!$('#collapseMas').hasClass('in')) {
				self.getSalesOrderMasDetails();
			}
		}
		else {
			if (!$('#mas').hasClass('in') && !$('#masLink').hasClass('in')) {
				self.getSalesOrderMasDetails();
			}
		}

		// To avoid tabs goes blank on quick move between tabs
		self.collapseAllTabs();
		$('#mas').addClass('active in');
		$('#masLink').addClass('active in');
	}

	/// <summary>
	/// Fetches the MAS Details 
	/// </summary>
	/// <createDetails>
	/// <id>US21133</id> <by>Baldev Singh Thakur</by> <date>07-04-2016</date>
	/// </createDetails>
	public getSalesOrderMasDetails() {
		var self = this;

		self.salesOrderMasViewModel.listProgress(true);

		var successCallBack = function (data) {
			var commonUtils = new Utils.Common();
			// To load History Details
			self.salesOrderMasViewModel.initializeMasDetails(data, self.salesOrderDetailsViewModel.salesOrderId());
			self.salesOrderMasViewModel.listProgress(false);
		},
			faliureCallBack = function () {
				self.salesOrderMasViewModel.listProgress(false);
			};
		self.salesOrderClient.GetShipmentMasDetails(self.salesOrderDetailsViewModel.salesOrderNumber(), successCallBack, faliureCallBack);
	}
	// ###END: US21133
	// show progress bar
	private ShowProgressBar(progress: boolean) {
		var self = this;
		self.listProgressAccordian(progress);
		self.listProgressTabbed(progress);
	}

	// change service type on basis of ship by
	private changeServiceType(shipBy: string) {
		var self = this;

		if (self.salesOrderShippingViewModel) {
			switch (shipBy) {
				case refEnums.Enums.ShipVia.Ground.Value:
					//For LTL Carrier Service
					self.salesOrderShippingViewModel.selectedServiceType(refEnums.Enums.ServiceType.LTL.ID);
					self.hideMultilegTab();
					break;
				case refEnums.Enums.ShipVia.Ocean.Value:
					//For Ocean Carrier Service
					self.salesOrderShippingViewModel.selectedServiceType(refEnums.Enums.ServiceType.Ocean.ID);
					self.hideMultilegTab();
					break;
				case refEnums.Enums.ShipVia.Expedite_Air.Value:
					//For Expedite_Ground Carrier Service
					self.salesOrderShippingViewModel.selectedServiceType(refEnums.Enums.ServiceType.Expedite_Air.ID);
					self.hideMultilegTab();
					break;
				case refEnums.Enums.ShipVia.Expedite_Ground.Value:
					//For LTL Carrier Service
					self.salesOrderShippingViewModel.selectedServiceType(refEnums.Enums.ServiceType.Expedite_Ground.ID);
					self.hideMultilegTab();
					break;
				case refEnums.Enums.ShipVia.White_Glove.Value:
					//For White_Glove Carrier Service
					self.salesOrderShippingViewModel.selectedServiceType(refEnums.Enums.ServiceType.White_Glove.ID);
					self.hideMultilegTab();
					break;
				case refEnums.Enums.ShipVia.Ground_Ocean.Value:
					//For Ground and Ocean Carrier Service
					self.salesOrderShippingViewModel.selectedServiceType(refEnums.Enums.ServiceType.Multileg.ID);
					self.multilegLinkVisiblity(true);
					$('#multilegs').removeClass('active in');
					$('#multilegLink').removeClass('active');
					break;
			}
		}
	}

	//Function to Identify whether we need to show/HIde Create Bill Option
	private showHideCreateBill(orderStatus, isSubOrder) {
		var self = this;

		//if sales order is sub order then hide create bill button
		if (isSubOrder) {
			self.isCreateBillVisible(true);//Changed the visibility to true as in GlobalNet we can create bill from sub order as well
			self.canCreateBill(false);
		}
		else {
			//if order status is Requote, ShippmentFinialized or MaualFinialized then show the create bill button.
			switch (orderStatus) {
				case refEnums.Enums.OrderStatus.ReQuote.ID:
				case refEnums.Enums.OrderStatus.Shipment_Finalized.ID:
				case refEnums.Enums.OrderStatus.ManuallyFinalized.ID:
					{
						if (self.havePermissionToCreateVBFromSO()) {
							self.isCreateBillVisible(true);
						}
						else {
							self.isCreateBillVisible(false);
						}
					}
					break;
				default:
					self.isCreateBillVisible(false);
					break;
			}
		}
	}

	// Function to Identify whether we need to show/HIde Cancel/UnCancel order button on UI.
	private showHideCancelSalesOrder(orderStatus, invoiceStatus) {
		var self = this;
		if (orderStatus === refEnums.Enums.OrderStatus.Canceled.ID) {
			self.isUnCancelSalesOrder(true);
			// ##START: DE24899
			self.isCancelSalesOrder(false);
			// ##END: DE24899
		}
		else {
			self.isUnCancelSalesOrder(false);
			// if Invoice is (Invoiced || Scheduled) AND Bill Is Attached Then Don't Show Cancel Option.
			if (invoiceStatus === refEnums.Enums.InvoiceStatus.Invoiced.ID
				|| invoiceStatus === refEnums.Enums.InvoiceStatus.Scheduled.ID) {
				self.isCancelSalesOrder(false);
			}
			else {
				if (self.salesOrderDetailsObject.VendorBillId > 0) {
					self.isCancelSalesOrder(false);
				}
				else {
					self.isCancelSalesOrder(true);
				}
			}
		}
	}

	// ###START: US25171
	// Function to Identify whether we need to show/HIde Request Credit order button on UI.
	private showHideRequestCreditSalesOrder(invoiceStatus, vendorBillId) {
		var self = this;

		// if Invoice is (Invoiced || Scheduled) AND Bill Is Attached Then Don't Show Cancel Option.  && isSuborder === false
		if (invoiceStatus === refEnums.Enums.InvoiceStatus.Invoiced.ID) {
			self.isRequestCredit(true);
		}
		else {
			self.isRequestCredit(false);
		}
	}
	// ###END: US25171

	// Function to Identify whether we need to show/HIde Create Sub order button on UI.
	private showHideCreateSubOrder(invoiceStatus, carrierType, isSubOrder) {
		var self = this;

		// If service type is TruckLoad|Expedite_Air|MultiLeg then visible:falseonEditReBill
		switch (carrierType) {
			case refEnums.Enums.CarrierType.Truckload.ID:
			case refEnums.Enums.CarrierType.ExpediteAir.ID:
			//##START: US22798
			case refEnums.Enums.CarrierType.ExpediteGround.ID:
			//##END: US22798
			case refEnums.Enums.CarrierType.Multileg.ID: {
				self.isCreateSubOrder(false);
			}
				break;
		}

		// If invoice status is invoiced then visible: true
		if (invoiceStatus === refEnums.Enums.InvoiceStatus.Invoiced.ID) {
			self.isCreateSubOrder(true);
		}

		// If the order is Sub Order then set visible:false
		if (isSubOrder) {
			self.isCreateSubOrder(false);
		}
	}
	//#endregion

	//#region Edit Re-Bill Information
	public onEditReBill() {
		var self = this;

		self.clearLocalStorage(self.salesOrderDetailsObject.BolNumber);
		self.salesorderReBillViewModel.isCallAgain = true;
		self.salesorderAuditedBillViewModel.isCallAgain = true;
		// opens the details tab or the current created bill
		_app.trigger("openRebill", self.salesOrderDetailsObject.Id, (callback) => { });
		return true;
	}

	// To open the history details poop up
	public showAdjustRevenuePopup() {
		var self = this;
		var total = 0;
		// ##START: US24389
		var revenueAdjustItems = self.getSalesOrderItemsDetails();
		// ##END: US24389
		var varMsgBox: Array<IMessageBoxButtonOption> = [
			{
				id: 0, name: 'Close', callback: (): boolean => {
					return true;
				},
			}
		];

		// ##START: US24389
		var bindingObject = {
			IsTruckloadOrder: self.IsTruckLoadOrder,
			SalesOrderItems: revenueAdjustItems
		};
		// ##END: US24389

		////initialize message box control arguments
		var optionControlArgs: IMessageBoxOption = {
			options: varMsgBox,
			message: '',
			title: 'Revenue Adjustment',
			// ##START: US24389
			bindingObject: bindingObject
			// ##END: US24389
		};

		self.updateFlag(false);

		if (self.isEditRebill()) {
			if ((self.oldTotalCost() != self.newtotalCost()) && (self.oldTotalCost() > 0)) {
				//Call the dialog Box functionality to open a Popup
				_app.showDialog('salesOrder/SalesOrderRevenueAdjustment', optionControlArgs).then((object) => {
					self.salesOrderSaveData.SalesOrderItemDetails = self.getSalesOrderRebillItemsDetails(object.originalRevenueModelList());
					self.salesOrderSaveData.SalesOrderReQuoteReviewDetails = self.getSalesOrderRequoteReasonDetails();
					self.salesOrderSaveData.SalesOrderReQuoteReasons = self.getSalesOrderShipmentRequoteReasonDetails();
					self.updateFlag(true);

					if (!object.isSave()) {
						self.updateFlag(false);
						self.showListProgress(false);
						self.ShowProgressBar(false);
					}
					else {
						self.updateFlag(true);
						self.CallSaveData();
					}
				});
			}
			else {
				self.salesOrderSaveData.SalesOrderItemDetails = self.getSalesOrderItemsDetails();
				self.salesOrderSaveData.SalesOrderReQuoteReviewDetails = self.getSalesOrderRequoteReasonDetails();
				self.salesOrderSaveData.SalesOrderReQuoteReasons = self.getSalesOrderShipmentRequoteReasonDetails();
				self.updateFlag(true);
				self.CallSaveData();
			}
		}
		else {
			self.salesOrderSaveData.SalesOrderItemDetails = self.getSalesOrderItemsDetails();
			self.updateFlag(true);
			self.CallSaveData();
		}
	}
	//#endregion

	//#region Create Sub Order
	// Function which handles the create sub order functionality.
	public onCreateSubOrder() {
		var self = this,
			salesOrderId = self.salesOrderDetailsViewModel.salesOrderId(),
			bolNumber = self.findBolNumber();
		self.salesorderReBillViewModel.isCallAgain = true;
		self.salesorderAuditedBillViewModel.isCallAgain = true;
		self.clearLocalStorage(self.salesOrderDetailsViewModel.salesOrderNumber());
		_app.trigger("openSalesOrder", salesOrderId, bolNumber, (callback) => {
			if (!callback) {
				return;
			}
		}, true);
	}
	//#endregion

	//#region Print BOL
	private onPrintBOLClick() {
		var self = this;
		self.salesorderReBillViewModel.isCallAgain = true;
		self.salesorderAuditedBillViewModel.isCallAgain = true;
		_app.trigger("openPrintBOL", self.salesOrderDetailsViewModel.salesOrderNumber(), self.salesOrderDetailsViewModel.customerBolNumber(), (callback) => { });
		return true;
	}
	//#endregion

	// #region Schedule Invoice
	private onScheduleInvoiceClick() {
		var self = this;
		self.isScheduleInvoice = true;
		self.ShowProgressBar(true);
		self.salesorderReBillViewModel.isCallAgain = true;
		self.salesorderAuditedBillViewModel.isCallAgain = true;
		self.salesOrderDisputeViewModel.isVisibleDisputeDetails(false);
		//set pending functionality here.
		if (self.scheduleInvoiceText() === "Set Pending") {
			if (self.isAccordion()) {
				self.validateAccordionView();
			}
			else {
				self.validateTabbedView(self.salesOrderDetailsViewModel.validateSalesOrder(), self.salesOrderAddressViewModel.validateAddresses(), self.salesOrderItemViewModel.validateItems(), self.salesOrderHazmatViewModel.validateHazmatItems(), self.salesOrderHazmatViewModel.validateContact(), self.salesOrderShippingViewModel.validateShipping(), self.salesOrderMultiLegViewModel.validateMultilegdetails());
			}
			self.setPending();
		}
		//schedule invoice functionality here.
		else {
			if (self.isAccordion()) {
				self.validateAccordionView();
			}
			else {
				self.validateTabbedView(self.salesOrderDetailsViewModel.validateSalesOrder(), self.salesOrderAddressViewModel.validateAddresses(), self.salesOrderItemViewModel.validateItems(), self.salesOrderHazmatViewModel.validateHazmatItems(), self.salesOrderHazmatViewModel.validateContact(), self.salesOrderShippingViewModel.validateShipping(), self.salesOrderMultiLegViewModel.validateMultilegdetails());
			}
			self.validateScheduleInvoice();
		}
	}

	// validation on schedule invoice click
	public validateScheduleInvoice() {
		var self = this;
		self.validationBeforeSave();
	}

	// Function which executes on Set Pending Click
	private setPending() {
		var self = this;
		self.clearLocalStorage(self.salesOrderDetailsViewModel.salesOrderNumber());
		var successCallBack = function (data) {
			//	self.ShowProgressBar(false);
			if (self.checkMsgDisplay) {
				self.checkMsgDisplay = false;
				var toastrOptions1 = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.InvoiceStatusRevertBackToPending, "info", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
			}
			self.beforeBind();
			//self.loadViewAfterComposition();
		},
			faliureCallBack = function (message) {
				// Saving failed call back
				self.ShowProgressBar(false);
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}
				//Changed in true as per requirement
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
			};
		self.salesOrderClient.MakeSoScheduledToPending(self.salesOrderDetailsViewModel.salesOrderId(), successCallBack, faliureCallBack);
	}

	/*
	 -1 = Successfully saved
	  0 = Show only message
	  1 = Show message and user input is required
	  2 = Cost > 0 and Revenue is 0, User input required
	  3 = Cost = 0 and Revenue = 0, no user input required, just show the message
	*/
	private scheduleInvoice() {
		var self = this;
		// to show item tab by default when click on save
		self.ShowDefaultItemTab();
		self.salesOrderSaveData = new refSalesOrderContainerModel.Model.SalesOrderContainer();

		self.salesOrderSaveData.SalesOrderDetail = self.getSalesOrderDetails();
		self.salesOrderSaveData.SalesOrderAddressDetails = self.getSalesOrderAddress();
		self.salesOrderSaveData.SalesOrderItemDetails = self.getSalesOrderItemsDetails();
		self.salesOrderSaveData.SalesOrderNoteDetails = self.getSalesOrderNotes();

		if (self.isEditRebill()) {
			self.salesOrderSaveData.SalesOrderReQuoteReviewDetails = self.getSalesOrderRequoteReasonDetails();
			self.salesOrderSaveData.SalesOrderReQuoteReasons = self.getSalesOrderShipmentRequoteReasonDetails();
		}

		self.salesOrderSaveData.MultilegCarrierHubAddress = self.getSalesOrderTerminalAddress();
		self.salesOrderSaveData.MultilegCarrierDetails = self.getSalesOrderMultilegCarrierDetails();
		self.salesOrderSaveData.IsSuborder = self.isNewSubOrder();
		self.salesOrderSaveData.PreviousValues = self.salesOrderOriginalData;
		self.salesOrderSaveData.FinalProfitForScheduleInvoice = self.salesOrderDetailsViewModel.finalProfit();
		self.salesOrderSaveData.GrossProfitForScheduleInvoice = self.salesOrderDetailsViewModel.grossProfit();
		self.salesOrderSaveData.CostDifferenceForScheduleInvoice = self.salesOrderDetailsViewModel.costDiff();
		self.salesOrderSaveData.EstimatedRevenue = self.salesOrderDetailsViewModel.estimatedRevenue();

		//Clear Local Storage.
		self.clearLocalStorage(self.salesOrderDetailsViewModel.salesOrderNumber());

		self.salesOrderClient.ScheduleInvoice(self.salesOrderSaveData, message => {
			self.errorCode(message.ErrorCode);
			_app.trigger("IsBIDirtyChange", self.isChange(false));
			if (!message)
				return;

			if (message.ErrorCode === -1) {
				self.ShowProgressBar(true);
				self.showScheduleInvoiceRevenueAdjustmentPopup(message);
			}
			else if (message.ErrorCode === 0) {
				if (self.checkMsgDisplay) {
					self.checkMsgDisplay = false;
					var toastrOptions1 = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
                     self.ShowProgressBar(false);
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message.ErrorMessage, "error", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
				}
			}
			else if (message.ErrorCode === 2 || message.ErrorCode === 3) {
				var actionButtons: Array<IToastrActionButtonOptions> = [];
				actionButtons.push({
					actionButtonName: "Yes",
					actionClick: () => {
						self.salesOrderClient.SaveScheduleInvoiceZeroRevenue(message, (response) => {
							if (self.checkMsgDisplay) {
								self.checkMsgDisplay = false;
								var toastrOptions1 = {
									toastrPositionClass: "toast-top-middle",
									delayInseconds: 10,
									fadeOut: 10,
									typeOfAlert: "",
									title: ""
								}

								self.ShowProgressBar(false);
								_app.trigger("IsBIDirtyChange", self.isChange(false));
								Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SalesOrderUpdateSuccessful, "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);

								// ###START: US22471
								if (response.IsEmailProcessExecuted == true) {
									if (response.MailStatusModel != null && response.MailStatusModel.StatusCode != null && response.MailStatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
										Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SendSuccessfullyMail, "success", null, toastrOptions1);
									}
								}
								// ###END: US22471
							}

							self.registerData(response.ShipmentId);
							//self.loadViewAfterComposition();
							self.beforeBind();
						}, (errorMessage) => {
								var toastrOptions: IToastrOptions = {
									toastrPositionClass: "toast-top-middle",
									// ###START: US24632
									delayInseconds: 5,
									fadeOut: 5,

									// ###END: US24632
									typeOfAlert: "",
									title: "",
									actionButtons: actionButtons
								};
								self.ShowProgressBar(false);
								_app.trigger("IsBIDirtyChange", self.isChange(false));

								// ###START: US24632
								if (typeof (errorMessage) === 'object') {
									if (errorMessage.StatusModel.StatusCode == Constants.ApplicationConstants.RecordAlreadyChanged) {
										Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.RecordAlreadyChanged, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
										setTimeout(() => { self.reloadPage() }, 5000);
									}
								}
								else {
									Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, errorMessage, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
								}

								// ###END: US24632
							})
					}
				});

				actionButtons.push({
					actionButtonName: "No",
					actionClick: () => {
						_app.trigger("IsBIDirtyChange", false);
					}
				});

				var toastrOptions: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 0,
					fadeOut: 0,
					typeOfAlert: "",
					title: "",
					actionButtons: actionButtons
				};
				self.ShowProgressBar(false);
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message.ErrorMessage, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
			}
			else if (message.ErrorCode == 1) {
				var actionButtons: Array<IToastrActionButtonOptions> = [];
				actionButtons.push({
					actionButtonName: "Yes",
					actionClick: () => {
						message.ErrorMessage = "";
						self.scheduleInvoicePopup(message);
					}
				});

				actionButtons.push({
					actionButtonName: "No",
					actionClick: () => {
						self.ShowProgressBar(false);
						_app.trigger("IsBIDirtyChange", false);
						var toastrOptions: IToastrOptions = {
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 0,
							fadeOut: 0,
							typeOfAlert: "",
							title: ""
						};

						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.OrderWillNotBeFinalized, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
					}
				});

				var toastrOptions: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 0,
					fadeOut: 0,
					typeOfAlert: "",
					title: "",
					actionButtons: actionButtons
				};

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, message.ErrorMessage, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
			}
		}, message => {
				//Schedule Invoice failed call back
				self.ShowProgressBar(false);
				_app.trigger("IsBIDirtyChange", self.isChange(false));
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}

			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
			});
	}

	private scheduleInvoicePopup(data: any) {
		var self = this;

		var costDifference: number = 0.0,
			grossProfit: number = 0.0,
			finalProfit: number = 0.0;
		var obj = { costDifference: data.CostDifference, CurrentUserId: self.currentUser().GlobalNetUserId, mainSalesOrderRowId: self.salesOrderDetailsViewModel.salesOrderId() };

		var optionControlArgs: IMessageBoxOption = {
			options: undefined,
			message: '',
			title: 'Margin Split',
			bindingObject: obj
		}

		_app.showDialog('salesOrder/SalesOrderMarginSplitPopup', optionControlArgs).then((object) => {
			if (!object.isClosed()) {
				var repAbsorbingPerc = object.repAbsorbingPerc();
				var gtAbsorbingPerc = object.gtAbsorbingPerc();
				var negativeMargin = object.negativeMargin();
				var costToRaise = (gtAbsorbingPerc / 100) * data.CostDifference;
				var result = $.grep(data.SalesOrderContainer.SalesOrderItemDetails, function (e) { return e.ItemId === "10"; });
				var firstShippingItem;
				if (result != null && result.length > 0) {
					firstShippingItem = result[0];
				}
				else {
					firstShippingItem = data.SalesOrderContainer.SalesOrderItemDetails[0];
				}

				if (firstShippingItem != null) {
					firstShippingItem.Cost = firstShippingItem.Cost + costToRaise;
					var SoCost = data.SalesOrderContainer.SalesOrderDetail.Cost;
					data.SalesOrderContainer.SalesOrderDetail.Cost = SoCost + costToRaise;
					self.newtotalCost(data.SalesOrderContainer.SalesOrderDetail.Cost);
					if (data.SalesOrderContainer.SalesOrderDetail.IsBillingStation) {
						var bsCost = typeof (data.SalesOrderContainer.FinalBSCostForScheduleInvoice) !== 'undefined' ? data.SalesOrderContainer.FinalBSCostForScheduleInvoice : 0;
						firstShippingItem.PLCCost = firstShippingItem.PLCCost + costToRaise;
						data.SalesOrderContainer.SalesOrderDetail.PlcCost = Math.round(bsCost + costToRaise);
					}
				}

				//notes for Absorbing GT percentage and Salesrep
				var absorptionNotes = "Negative profit " + $.number((data.GrossProfit - data.FinalProfit), 2) + " split GT " + $.number(gtAbsorbingPerc, 2)
					+ "% (" + $.number(costToRaise, 2) + ") Salesrep" + $.number((100 - gtAbsorbingPerc), 2) + "% ("
					+ $.number((data.CostDifference - costToRaise), 2) + ").";

				// data.SalesOrderNoteDetails
				var salesOrderNotes: Array<refSalesOrderNotesModel.Models.SalesOrderNoteDetails>;
				salesOrderNotes = ko.observableArray([])();
				salesOrderNotes.removeAll();
				data.SalesOrderContainer.SalesOrderNoteDetails.forEach(function (item, collection) {
					if (item.Description != "") {
						salesOrderNotes.push(self.AddScheduleInvoiceNoteItem(item));
					}
				});

				var itemNew = new refSalesOrderNotesViewModel.salesOrderNoteItem(0, self.salesOrderDetailsViewModel.salesOrderId(), absorptionNotes, self.currentUser().FullName, Date.now(), "Information", refEnums.Enums.Note.Information.ID);
				salesOrderNotes.push(self.AddNoteItem(itemNew));

				var shipmentNote = "The order is finalized with $ " + (data.GrossProfit - data.FinalProfit) + "  reduction in profit by " +
					self.currentUser().UserName + ".";

				var itemNew = new refSalesOrderNotesViewModel.salesOrderNoteItem(0, self.salesOrderDetailsViewModel.salesOrderId(), shipmentNote, self.currentUser().FullName, Date.now(), "Information", refEnums.Enums.Note.Information.ID);
				salesOrderNotes.push(self.AddNoteItem(itemNew));

				self.showScheduleInvoiceRevenueAdjustmentPopup(data);
			}
			else {
				self.ShowProgressBar(false);
				return false;
			}
		});
	}

	private showScheduleInvoiceRevenueAdjustmentPopup(data) {
		var self = this;
		// ##START: US24389
		var revenueAdjustItems = self.getItemsDetailsByResponseItems(data.SalesOrderContainer.SalesOrderItemDetails);
		// ##END: US24389

		var varMsgBox: Array<IMessageBoxButtonOption> = [
			{
				id: 0, name: 'Close', callback: (): boolean => {
					return true;
				},
			}
		];

		// ##START: US24389
		var bindingObject = {
			IsTruckloadOrder: self.IsTruckLoadOrder,
			SalesOrderItems: revenueAdjustItems
		};
		// ##END: US24389

		////initialize message box control arguments
		var optionControlArgs: IMessageBoxOption = {
			options: varMsgBox,
			message: '',
			title: 'Revenue Adjustment',
			// ##START: US24389
			bindingObject: bindingObject
			// ##END: US24389
		};

		if ((self.oldTotalCost() != self.newtotalCost()) && (self.newtotalCost() > 0)) {
			//Call the dialog Box functionality to open a Popup
			_app.showDialog('salesOrder/SalesOrderRevenueAdjustment', optionControlArgs).then((object) => {
				self.ShowProgressBar(true);
				data.SalesOrderContainer.SalesOrderItemDetails = self.getSalesOrderRebillItemsDetails(object.originalRevenueModelList());
				data.SalesOrderContainer.SalesOrderReQuoteReviewDetails = self.getSalesOrderRequoteReasonDetails();
				data.SalesOrderContainer.SalesOrderReQuoteReasons = self.getSalesOrderShipmentRequoteReasonDetails();
				self.updateFlag(true);

				if (!object.isSave()) {
					self.updateFlag(false);
					self.ShowProgressBar(false);
					return false;
				}
				else {
					self.updateFlag(true);
					self.saveSalesOrderOnScheduleInvoice(data);
				}
			});
		}
		else {
			self.saveSalesOrderOnScheduleInvoice(data);
		}
	}

	//#endregion

	// login to find next pro number
	private saveSalesOrderOnScheduleInvoice(data) {
		var self = this;
		self.salesOrderClient.SaveScheduleInvoiceWithRevenueAdjustment(data, (result) => {
			if (result.ErrorCode == -1 || result.ErrorCode == 1) {
				self.ShowProgressBar(false);
				if (self.checkMsgDisplay) {
					self.checkMsgDisplay = false;
					var toastrOptions1 = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}

					var messageToShow = '';
					var toastrType = 1;
					if (result.ErrorMessage && result.ErrorMessage !== null && result.ErrorMessage !== '') {
						messageToShow = result.ErrorMessage;
						toastrType = refEnums.Enums.ToastrMessageType.info.ID;
					} else {
						messageToShow = ApplicationMessages.Messages.SalesOrderUpdateSuccessful;
						toastrType = refEnums.Enums.ToastrMessageType.success.ID;
					}

					Utility.ShowToastr(toastrType, messageToShow, "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);

					// ###START: US22471
					if (result.IsEmailProcessExecuted == true) {
						if (result.MailStatusModel != null && result.MailStatusModel.StatusCode != null && result.MailStatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
							Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SendSuccessfullyMail, "success", null, toastrOptions1);
						}
					}
					// ###END: US22471
				}
				self.registerData(result.ShipmentId);
				//self.loadViewAfterComposition();
				self.beforeBind();
			}
			else if (result.ErrorCode === 2 || result.ErrorCode === 3) {
				var actionButtons: Array<IToastrActionButtonOptions> = [];
				actionButtons.push({
					actionButtonName: "Yes",
					actionClick: () => {
						// ##START: DE21308
						self.isYesClickedOnScheduleInvoiceToastr = true;
						self.ShowProgressBar(true);
						// ##END: DE21308
						self.salesOrderClient.SaveScheduleInvoiceZeroRevenue(result, (response) => {
							// ##START: DE21308
							self.isYesClickedOnScheduleInvoiceToastr = false;
							// ##END: DE21308
							self.ShowProgressBar(false);
							if (self.checkMsgDisplay) {
								self.checkMsgDisplay = false;
								var toastrOptions1 = {
									toastrPositionClass: "toast-top-middle",
									delayInseconds: 10,
									fadeOut: 10,
									typeOfAlert: "",
									title: ""
								}

								Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SalesOrderUpdateSuccessful, "Success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
								// ###START: US22471
								if (response.IsEmailProcessExecuted == true) {
									if (response.MailStatusModel != null && response.MailStatusModel.StatusCode != null && response.MailStatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
										Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SendSuccessfullyMail, "success", null, toastrOptions1);
									}
								}
								// ###END: US22471
							}
							self.registerData(response.ShipmentId);
							//self.loadViewAfterComposition();
							self.beforeBind();
						}, (errorMessage) => {
								// ##START: DE21308
								self.isYesClickedOnScheduleInvoiceToastr = false;
								// ##END: DE21308
								self.ShowProgressBar(false);
								//self.loadViewAfterComposition();

								var toastrOptions: IToastrOptions = {
									toastrPositionClass: "toast-top-middle",
									// ###START: US24632
									delayInseconds: 5,
									fadeOut: 5,

									// ###END: US24632
									typeOfAlert: "",
									title: ""
								};

								// ###START: US24632
								if (typeof (errorMessage) === 'object') {
									if (errorMessage.StatusModel.StatusCode == Constants.ApplicationConstants.RecordAlreadyChanged) {
										Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.RecordAlreadyChanged, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
										setTimeout(() => { self.reloadPage() }, 5000);
									}
								}
								else {
									self.beforeBind();
									Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, errorMessage, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
								}

								// ###END: US24632
							})
					  }
				});

				actionButtons.push({
					actionButtonName: "No",
					actionClick: () => {
						// ##START: DE21308
						self.isYesClickedOnScheduleInvoiceToastr = false;
						// ##END: DE21308
						self.ShowProgressBar(false);
						_app.trigger("IsBIDirtyChange", false);
					}
				});

				var toastrOptions: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 0,
					fadeOut: 0,
					typeOfAlert: "",
					title: "",
					actionButtons: actionButtons
				};

				// ###START: DE21740
				// ##START: DE21308
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, result.ErrorMessage, "success", self.checkMsgOnScheduleInvoiceClick, toastrOptions, self.checkMsgHide);

				// ##END: DE21308
				// ###END: DE21740
			}
		}, (errorMessage) => {
				self.ShowProgressBar(false);
				//self.loadViewAfterComposition();
				//self.beforeBind();
				var toastrOptions: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					// ###START: US24632
					delayInseconds: 5,
					fadeOut: 5,

					// ###END: US24632
					typeOfAlert: "",
					title: ""
				};

				// ###START: US24632
				if (typeof (errorMessage) === 'object') {
					if (errorMessage.StatusModel.StatusCode == Constants.ApplicationConstants.RecordAlreadyChanged) {
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.RecordAlreadyChanged, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
						setTimeout(() => { self.reloadPage() }, 5000);
					} // ###START: US27159
					else if (errorMessage.StatusModel.StatusCode == Constants.ApplicationConstants.ErrorStatusInfoCode) {
						var toastrOption: IToastrOptions = {
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 10,
							fadeOut: 10,
							typeOfAlert: "",
							title: ""
						};
						if (self.isSaveEnable()) {
							Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, errorMessage.StatusModel.Description, "error", self.checkMsgClick, toastrOption, self.checkMsgHide);
						} else {
							Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.TLOrderCannotBeScheduledAsOrderNotComplete, "error", self.checkMsgClick, toastrOption, self.checkMsgHide);
						}
						self.reloadPage()
					}
					// ###END: US27159
				}
				else {
					self.beforeBind();
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, errorMessage, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				}

				// ###END: US24632
			})
    }

	private findBolNumber() {
		var self = this,
			bolNumber = self.salesOrderDetailsViewModel.salesOrderNumber(),
			count = self.subOrderCount + 65;

		var splittedBol = self.salesOrderDetailsViewModel.salesOrderNumber().split(' ');

		if (typeof (splittedBol[0]) !== 'undefined') {
			bolNumber = splittedBol[0];
		}

		bolNumber = bolNumber + " " + String.fromCharCode(count);

		return bolNumber;
	}

	private showSuccessfullMessage() {
		var self = this;
		if (self.checkMsgDisplay) {
			self.checkMsgDisplay = false;
			self.ShowProgressBar(false);
			var toastrOptions1 = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 10,
				fadeOut: 10,
				typeOfAlert: "",
				title: ""
			}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SalesOrderUpdateSuccessful, "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
		}
	}

	private showFailMessage() {
	}

	// Get MAS Customer Fields.
	private getMasCustomerDetails(CustomerId, targetBolNumber) {
		var self = this;
		var successCallBack = function (data) {
			self.salesOrderDetailsViewModel.initalizeMasCustomer(data);
			LocalStorageController.Set(targetBolNumber + 'SOMASCustomerFields', data);
		},

			failureCallBack = function (data) {
				self.salesOrderDetailsViewModel.progressClass('');
			}

		// Try to get the data from local storage if not available then get the data from the database
		if (!LocalStorageController.Get(targetBolNumber + 'SOMASCustomerFields')) {
			self.salesOrderClient.GetMasCustomerFields(CustomerId, successCallBack, failureCallBack);
		}
		else {
			successCallBack(LocalStorageController.Get(targetBolNumber + 'SOMASCustomerFields'));
		}
	}

	// To Clear the Local storage
	private clearLocalStorage(targetId) {
		// Clear Sales Order Details
		if (LocalStorageController.Get(targetId + 'SO')) {
			LocalStorageController.Set(targetId + 'SO', undefined);
		}

		// Clear Financial Details
		if (LocalStorageController.Get(targetId + 'SOFinancialDetails')) {
			LocalStorageController.Set(targetId + 'SOFinancialDetails', undefined);
		}

		// Clear MAS Customer Details
		if (LocalStorageController.Get(targetId + 'SOMASCustomerFields')) {
			LocalStorageController.Set(targetId + 'SOMASCustomerFields', undefined);
		}
	}

	private onSetFinalized() {
		var self = this;
		self.salesOrderFinalizeDetailModel = new refSalesOrderFinalizeDetailModel.Model.SalesOrderFinalizeModel();

		self.salesOrderFinalizeDetailModel.ProcessStatusId = self.salesOrderDetailsObject.ProcessStatusId;
		self.salesOrderFinalizeDetailModel.ShipmentId = self.salesOrderId;
		self.salesOrderFinalizeDetailModel.TimeSpan = self.salesOrderDetailsObject.UpdatedDateTime;

		self.clearLocalStorage(self.salesOrderDetailsViewModel.salesOrderNumber());

		var successCallBack = (data) => {
			self.isSetToFinalizeEnable(true);
			var toastrOptions1 = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 10,
				fadeOut: 10,
				typeOfAlert: "",
				title: ""
			}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SalesOrderFinalizedSuccessful, "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
			self.ShowProgressBar(true);
			//self.loadViewAfterComposition();
			self.beforeBind();
		},
			failureCallBack = (message) => {
				self.isSetToFinalizeEnable(true);
				var toastrOptions1 = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", self.checkMsgClick, toastrOptions1, self.checkMsgHide);

				self.ShowProgressBar(true);
				//self.loadViewAfterComposition();
				self.beforeBind();
			}

		self.isSetToFinalizeEnable(false);
		self.salesOrderClient.SetFinalize(self.salesOrderFinalizeDetailModel, successCallBack, failureCallBack);
	}

	/*
	** <createDetails>
	** <id>US25171</id> <by>Janakiram</by> <date>04-10-2016</date> <description>Added new button like "Request Credit" and to open pop-up on click.</description>
	** </createDetails>
	** <changeHistory>
	** <id>US26575</id> <by>Baldev Singh Thakur</by> <date>03-02-2017</date> <description>Added condition to display BS Cost and appropriate fields if the order attached to the bill is Billing Station also fetching the total pending amount and credit reason while loading the order.</description>
	** </changeHistory>
	*/
	private onRequestCreditClick() {
		var self = this;

		// ###START: US25277
		var onSaveCallback = function (data, creditReasonId: number) {
			self.totalPendingCreditAmount(data.TotalPendingCreditAmount);
			// ###START: US25679
			self.totalPendingVendorAmount(data.TotalPendingVendorAmount);
			// ###END: US25679

			if (creditReasonId === refEnums.Enums.CreditReason.CancelSO.ID) {
				self.reloadPage();
			}
		};

		// ###START: US26575

		self.salesOrderClient.validateShipmentForCreditReasonWithCancelSo(self.salesOrderId, (data: any) => {

			var showCancelSOReason = data;

			self.salesOrderClient.getCreditReasonCodes((data: Array<ICreditReason>) => {
				if (data) {

					var creditReasons = $.grep(data, function (value, i) {
						return value.Id !== refEnums.Enums.CreditReason.DisputeWon.ID;
					});

					self.creditReasonOptions.removeAll();

					// ###START: US22966
					if (self.salesOrderDetailsViewModel.vendorbillid() > 0) {

						var creditReasonsList = $.grep(creditReasons, function (value, i) {
							return value.Id !== refEnums.Enums.CreditReason.CancelSO.ID;
						});

						self.creditReasonOptions = creditReasonsList;
					} else {
						var creditReasons = $.grep(data, function (value, i) {
							return ((value.Id !== refEnums.Enums.CreditReason.DisputeWon.ID) && (value.Id !== refEnums.Enums.CreditReason.OvcClaim.ID) && (value.Id !== refEnums.Enums.CreditReason.VendorCredit.ID));
						});

						if (showCancelSOReason != undefined && showCancelSOReason != null && showCancelSOReason === false) {
							creditReasons = $.grep(creditReasons, function (value, i) {
								return value.Id !== refEnums.Enums.CreditReason.CancelSO.ID;
							});
						}

						self.creditReasonOptions = creditReasons;
					}

					// ###END: US22966

					self.salesOrderClient.getTotalPendingCreditMemo(self.salesOrderId, (data: any) => {
						if (data) {
							self.totalPendingCreditAmount(data.TotalPendingCreditAmount);
							// ###START: US25679
							self.totalPendingVendorAmount(data.TotalPendingVendorAmount);
							// ###END: US25679

							var creditmemoPopupData = {
								// ###START: US26575
								currentFinalRevenue: self.salesOrderDetailsViewModel.isBillingStation() ? self.finalBSCost : self.SalesOrderFinancialDetailsModel.FinalRevenue,

								// ###END: US26575
								currentFinalCost: self.SalesOrderFinancialDetailsModel.VBFinalCost,
								creditReasons: self.creditReasonOptions,
								shipmentId: self.salesOrderId,
								totalPendingCreditAmount: self.totalPendingCreditAmount(),
								// ###START: US25679
								totalPendingVendorAmount: self.totalPendingVendorAmount(),
								// ###END: US25679
								// ###START: US26575
								isBSCustomer: self.salesOrderDetailsViewModel.isBillingStation()
								// ###END: US26575
							};

							// object to be passed to the popup
							var optionControlArgs: IMessageBoxOption = {
								options: undefined,
								message: '',
								title: 'Confirmation',
								bindingObject: {
									creditmemoPopupData: creditmemoPopupData,
									saveCallback: onSaveCallback
								}
							};

							// ###END: US25277
							_app.showDialog('salesOrder/SalesOrderRequestCreditPopup', optionControlArgs); //show popup
						}
					});
				}
			});
		});
		// ###END: US26575
	}
	// ###END: US25171

	//##START: DE25233
	// method to show uncancel confirmation toastr
	private showUnCancelConfirmationToastr() {
		var self = this;
		if (self.orderStatusOnLoad === refEnums.Enums.OrderStatus.Canceled.ID && self.salesOrderSaveData.SalesOrderDetail.OrderStatusId !== refEnums.Enums.OrderStatus.Canceled.ID) {
			if (self.checkMsgDisplay) {
				self.checkMsgDisplay = false;
				var actionButtons: Array<IToastrActionButtonOptions> = [];
				actionButtons.push({
					actionButtonName: "Yes",
					actionClick: () => {
						self.isUnCancelToastrShown = true;
						setTimeout(self.onSave(), 300);
					}
				});

				actionButtons.push({
					actionButtonName: "No",
					actionClick: self.checkMsgClickOnUncancelToastr()
				});

				var toastrOptions: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 0,
					fadeOut: 0,
					typeOfAlert: "",
					title: "",
					actionButtons: actionButtons
				};

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.UnCancelInsuredAmount, "warning", self.checkMsgClickOnUncancelToastr, toastrOptions, self.checkMsgHide);
			}
		}
	}
	//##END: DE25233

	//#endregion

	//#region Life Cycle Event
	public compositionComplete() {
		var self = this;

		setTimeout(function () {
			$('.txtCustomerName').focus();
		}, 500);

		if (self.isAccordion()) {
			if (!$('#collapseAddress').hasClass('in')) {
				$('#collapseAddress').css("overflow", "hidden");
			}
			else {
				$('#collapseAddress').css("overflow", "visible");
			}
		}
		_app.trigger("IsBIDirtyChange", false);

		//// ###START: US25349
		if (self.IsReadOnly || self.IsTruckLoadSubOrder) {
			self.DisableAlltheControls();
		}
		//// ###END: US25349

		self.isNotAtLoadingTime = false;

		//##START: DE21287
		if (self.IsTruckLoadOrder) {
			self.DisableBookedDate();
		}
		//##END: DE21287
	}

	//To hide Multileg Tab
	public hideMultilegTab() {
		var self = this;
		self.multilegLinkVisiblity(false);
		if ($('#multileg').hasClass('active in')) {
			$('#item').addClass('active in');
			$('#itemLink').addClass('active');
		}
	}

	//** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
	public attached() {
		_app.trigger('viewAttached');
	}

	//** The composition engine will execute it prior to calling the binder. */
	public activate() {
		var self = this;
		return true;
	}

	//**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
	public beforeBind() {
		var self = this;
		_app.trigger("loadMyData", function (data) {
			if (data) {
				//if (!LocalStorageController.Get(data.bolNumber + 'SO')) {
				self.load(data);
				//}
			} else {
				_app.trigger("closeActiveTab");
			}
		});
	}

	public deactivate() {
		var self = this;

		self.cleanup();
	}

	public registerData(salesOrderId) {
		var self = this;
		//data object will keep the viewModels.
		var data = { salesOrderId: salesOrderId, isSubOrder: 'false' };
		_app.trigger("registerMyData", data);
	}

	public CallSaveData() {
		var self = this;
		if (self.updateFlag()) {
			if (self.canEnterZeroRevenue()) {
				var totalCost = parseFloat(self.salesOrderDetailsViewModel.salesOrderAmount());
				var totalRevenue = parseFloat(self.salesOrderDetailsViewModel.salesOrderRevenue());
				self.changeOrderStatusForCRR(totalCost, totalRevenue);
			}
			else {
				self.saveData();
			}
		}
	}

	//Check the revenue n cost if it is 0 then display msg and make entry in note
	public changeOrderStatusForCRR(cost: number, revenue: number) {
		var self = this;
		self.statusChangedByCRR(false);
		self.noteDescription('');

		////##START: DE20749
		//IF BS customer then check for BS cost otherwise cost and revenue
		if (self.salesOrderItemViewModel.isBSCost() && self.salesOrderItemViewModel.isBSCostEditable()) {

			if (cost > 0 && self.salesOrderItemViewModel.salesOrderBsCost() <= 1) {
				self.checkMsgDisplay = false;
				var actionButtons: Array<IToastrActionButtonOptions> = [];
				actionButtons.push({
					actionButtonName: "Yes",
					actionClick: self.revenueIsZeroAndCostIsGreaterThenZero
				});

				actionButtons.push({
					actionButtonName: "No",
					actionClick: self.checkMsgClick
				});

				var toastrOptions: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 0,
					fadeOut: 0,
					typeOfAlert: "",
					title: "",
					actionButtons: actionButtons
				};

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.RevenueIsZeroAndCostIsGreaterThenZero, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				self.showListProgress(false);
				self.ShowProgressBar(false);
			}
			else {
				self.saveData();
			}
			////##END: DE20749
		}
		else {

			//Check if revenue is less then 1 then display msg
			if ((cost > 0) && (revenue <= 1)) {
				if (self.checkMsgDisplay) {
					self.checkMsgDisplay = false;
					var actionButtons: Array<IToastrActionButtonOptions> = [];
					actionButtons.push({
						actionButtonName: "Yes",
						actionClick: self.revenueIsZeroAndCostIsGreaterThenZero
					});

					actionButtons.push({
						actionButtonName: "No",
						actionClick: self.checkMsgClick
					});

					var toastrOptions: IToastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 0,
						fadeOut: 0,
						typeOfAlert: "",
						title: "",
						actionButtons: actionButtons
					};

					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.RevenueIsZeroAndCostIsGreaterThenZero, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
					self.showListProgress(false);
					self.ShowProgressBar(false);
				}
			}
			else if ((cost == 0) && (revenue <= 1)) {
				var toastrOptions: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 15,
					fadeOut: 15,
					typeOfAlert: "",
					title: ""
				};

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.RevenueIsZeroAndCostIsZero, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				self.salesOrderSaveData.SalesOrderDetail.OrderStatusId = refEnums.Enums.OrderStatus.Canceled.ID;
				self.salesOrderSaveData.SalesOrderDetail.ProcessStatusId = refEnums.Enums.OrderStatus.Canceled.ID;
				self.salesOrderSaveData.SalesOrderDetail.InvoiceStatus = refEnums.Enums.InvoiceStatus.Pending.ID;
				self.statusChangedByCRR(true);
				self.noteDescription('BOL ' + self.salesOrderSaveData.SalesOrderDetail.BolNumber + ' Order Status Change confirmed by ' + self.currentUser().FullName + ' on ' + self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
				self.saveData();
			}
			else {
				self.saveData();
			}
		}
	}
	//#endregion

	public CallChangeMadeFunctions() {
		var self = this;

		// For sales Order Details  section
		self.salesOrderDetailsViewModel.onChangesMade = self.changesDetected;
		self.salesOrderDetailsViewModel.carrierSearchList.onChangesMade = self.changesDetected;
		self.salesOrderDetailsViewModel.customerSearchList.onChangesMade = self.changesDetected;
		self.salesOrderAddressViewModel.onChangesMade = self.changesDetected;
		self.salesOrderAddressViewModel.shipperLocation.onChangesMade = self.changesDetected;
		self.salesOrderAddressViewModel.consigneeLocation.onChangesMade = self.changesDetected;
		self.salesOrderAddressViewModel.billToLocation.onChangesMade = self.changesDetected;
		self.salesOrderAddressViewModel.shipperCompanySearchList.onChangesMade = self.changesDetected;
		self.salesOrderAddressViewModel.consigneeCompanySearchList.onChangesMade = self.changesDetected;
		self.salesOrderShippingViewModel.onChangesMade = self.changesDetected;
		self.salesOrderNotesViewModel.onChangesMade = self.changesDetected;
		self.salesOrderItemViewModel.onChangesMade = self.changesDetected;
		self.salesorderReBillViewModel.onChangesMade = self.changesDetected;
		self.salesOrderHazmatViewModel.onChangesMade = self.changesDetected;
	}

	public cleanup() {
		var self = this;

		window.removeEventListener("resize", self.resizeFunction);

		delete self.changesDetected;
		delete self.resizeFunction;
		delete self.salesOrderAddressViewModel.shipperLocation.onChangesMade;
		delete self.salesOrderAddressViewModel.consigneeLocation.onChangesMade;
		delete self.salesOrderAddressViewModel.billToLocation.onChangesMade;
		delete self.salesOrderAddressViewModel.shipperCompanySearchList.onChangesMade;
		delete self.salesOrderAddressViewModel.consigneeCompanySearchList.onChangesMade;

		self.salesOrderHistoryViewModel.cleanUp();
		self.salesOrderHazmatViewModel.cleanUp();
		self.salesOrderPODDocViewModel.cleanUp();
		self.salesOrderAddressViewModel.cleanUp();
		self.salesOrderItemViewModel.cleanUp();
		self.salesOrderDetailsViewModel.cleanUp();
		self.salesOrderShippingViewModel.cleanUp();
		self.salesorderAuditedBillViewModel.cleanUp();
		self.salesOrderDisputeViewModel.cleanup();
		self.salesorderReBillViewModel.cleanUp();
		self.salesOrderMultiLegViewModel.cleanup();
		self.salesOrderLinksViewModel.cleanup();
		self.salesOrderNotesViewModel.cleanup();

		self.salesOrderClaimViewModel.cleanup();
		self.salesOrderAgentNotificationViewModel.cleanup();
		self.salesorderInvoiceExceptionViewModel.cleanup();

		//for (var property in self) {
		//	delete self[property];
		//}

		//delete self.salesOrderShippingViewModel.onChangesMade;
		//delete self.checkMsgClick;
		//delete self.checkMsgHide;
		delete self.salesOrderPODDocViewModel;
		delete self.salesOrderLinksViewModel;
		delete self.salesOrderAddressViewModel;
		delete self.salesOrderShippingViewModel;
		delete self.salesOrderNotesViewModel;
		delete self.salesOrderItemViewModel;
		delete self.salesorderReBillViewModel;
		delete self.salesOrderHazmatViewModel;
		delete self.salesOrderDetailsViewModel;
		delete self.salesOrderMultiLegViewModel;
		delete self.salesorderAuditedBillViewModel;
		delete self.salesOrderClaimViewModel;
		delete self.salesOrderDisputeViewModel;
		delete self.salesOrderHistoryViewModel;
		delete self.salesOrderAgentNotificationViewModel;
		delete self.salesorderInvoiceExceptionViewModel;

		for (var property in self) {
			delete self[property];
		}
		delete self;
	}
}