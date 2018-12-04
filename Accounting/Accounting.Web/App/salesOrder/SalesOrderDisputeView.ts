/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../services/models/TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import _reportViewer = require('../templates/reportViewerControlV2');
import refEnums = require('services/models/common/Enums');
import refValidations = require('services/validations/Validations');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refVendorBillClient = require('services/client/VendorBillClient');
import refsalesOrderDisputeDetails = require('services/models/salesOrder/VendorBillDisputeContainer');
import refSalesOrderInternalDispute = require('salesOrder/SalesOrderInternalDispute');
import refSalesOrderDisputeVendorBill = require('services/models/salesOrder/DisputeVendorBill');
import refSalesOrderVendorBillDisputeContainer = require('services/models/salesOrder/VendorBillDisputeContainer');
import refSalesOrderItemModel = require('services/models/vendorBill/VendorBillItemDetails');
import refSalesOrderShipmentRequoteReasonModel = require('services/models/salesOrder/SalesOrderShipmentRequoteReason');
import refSalesOrderNotesModel = require('services/models/salesOrder/SalesOrderNoteDetail');
//#endregion

/***********************************************
  Sales Order Dispute ViewModel
************************************************
** <summary>
** Sales Order Dispute ViewModel
** </summary>
** <createDetails>
** <id>US13232</id><by>Chandan Singh Bajetha</by><date>31st Oct, 2014</date>
** </createDetails>
** <changeHistory>
** <id>DE20630</id><by>Chandan Singh Bajetha</by><date>04/11/2014</date> <description>Wrong Dispute Amount Calculation in Sales Order from Dispute Tab</description>
** <id>US20352</id><by>Chandan Singh Bajetha</by><date>20-01-2016</date> <description>Acct: Adjust UI for Dispute Notes Tab in Vendor Bill</description>
** <id>DE21416</id><by>Chandan Singh Bajetha</by><date>20-01-2016</date> <description>Dispute Date always shows the current date on Dispute Tab in Sales Order</description>
** <id>US20584</id><by>Chandan Singh Bajetha</by><date>03-02-2016</date> <description>Acct: Add Dispute Status Drop Down in SO Dispute Tab</description>
** <id>DE21749</id> <by>Chandan Singh Bajetha</by> <date>08-0202016</date> 
	<description>Disable the Status drop down when user directly updates the bill status to Dispute Short Paid from any status other than Dispute</description>
** <id>US20647</id> <by>Chandan Singh Bajetha</by> <date>17-02-2016</date> <description>Acct: Implement Search on all Reports.</description>
** <id>US20687</id> <by>Chandan Singh Bajetha</by> <date>17-02-2016</date> <description>Acct: Add Dispute HTML Link in Dispute Tab</description>
** <id>US20961</id> <by>Shreesha Adiga</by> <date>08-03-2016</date> <description>Save only dispute status if bill moved to mas; changed to some validations</description>
** <id>US21147</id> <by>Shreesha Adiga</by> <date>15-03-2016</date> <description>If late dispute amount then show it in dispute amount's place</description>
** <id>DE22259</id> <by>Shreesha Adiga</by> <date>22-03-2016</date> <description>Select item based on ItemId and AccessorialId</description>
** <id>DE22259</id> <by>Shreesha Adiga</by> <date>22-03-2016</date><description>Updated accessorialId to VB item before saving dispute</description>
** <id>US21290</id> <by>Shreesha Adiga</by> <date>23-03-2016</date><description>If item selected based on itemid and accessorialId is undefined, then select based only on itemId</description>
** <id>US21131</id> <by>Shreesha Adiga</by> <date>31-03-2016</date><description>Show dispute state popup for some scenarios and add the note to disputeContainer</description>
** <id>US21132</id> <by>Shreesha Adiga</by> <date>26-04-2016</date><description>Changes related to showing the dispute lost popup from sales order; Showing "Create Lost Bill" toastr after save</description>
** <id>US21597</id> <by>Baldev Singh Thakur</by> <date>28-04-2016</date> <description>Added LateDisputeAmount, for displaying Late Dispute Amount.</description>
** <id>US21791</id> <by>Shreesha Adiga</by> <date>05-05-2016</date> <description>Diplay aging days</description>
** <id>US22053</id> <by>Shreesha Adiga</by> <date>10-05-2016</date><description>Changes related to sending mail when the dispute state is "Carrier Researching"</description>
** <id>DE23003</id> <by>Shreesha Adiga</by> <date>26-05-2016</date><description>Enable dispute status dropdown and dispute amount input for DisputeShortPaid, EVEN if it has been moved to MAS</description>
** <id>US22471</id> <by>Vasanthakumar</by> <date>03-06-2016</date> <description>Add Success Toastr message for Emails triggered by users</description>
** <id>DE23466</id> <by>Baldev Singh Thakur</by> <date>12-07-2016</date><description>Added logic to disable the bill status drop down, whenever user saves the bill status to Overcharge Won/Overcharge Loss</description>
** <id>DE23503</id> <by>Baldev Singh Thakur</by> <date>15-07-2016</date><description>Final Cost is getting updated on changing bill status from  OVC  to OVC won/lost.</description>
** <id>DE23995</id> <by>Shreesha Adiga</by> <date>17-08-2016</date><description>Bind dispute lost amount on click of save</description>
** <id>US24324</id> <by>Janakiram</by> <date>23-08-2016</date><description>Marking Overcharge Claim Dispute as won/loss from click of save</description>
** <id>US24862</id> <by>Shreesha Adiga</by> <date>20-09-2016</date><description>Show Dispute Emial popup on click of 'Dispute With Carrier' button</description>
** <id>US24865</id> <by>Shreesha Adiga</by> <date>23-09-2016</date><description>Send proper data to Dispute Email Popup</description>
** <id>US24866</id> <by>Dhaval Tamhane</by> <date>27-09-2016</date><description>Populating values for OriginalCost, OriginalWeight, NMFC numbers and Classes</description>
** <id>US24874</id> <by>Vasanthakumar</by> <date>29-09-2016</date> <description>Acct: Enter Notes on sending an Email to Carrier</description>
** <id>DE24638</id> <by>Janakiram</by> <date>03-10-2016</date> <description>Checking condition for sending mails based on "IsDisputeEmailPopupEnabled".</description>
** <id>DE24774</id> <by>Shreesha Adiga</by> <date>10-10-2016</date> <description>Populate some properties of VB items, which were previously not populated, while saving</description>
** <id>US25310</id> <by>Shreesha Adiga</by> <date>24-10-2016</date> <description>Show Credit Request Popup after bill status is changed to Dispute Won</description>
** <id>US25679</id> <by>Baldev Singh Thakur</by> <date>11-11-2016</date><description>Added totalPendingVendorAmount</description>
** <id>US25153</id> <by>Shreesha Adiga</by> <date>20-10-2016</date><description>Changes realted to Credit Adjustment (Items Not Integrated With Mas)</description>
** <id>DE25119</id> <by>Janakiram</by> <date>23-11-2016</date><description>Disbling dispute vb fields if line item having credit adjustment</description>
** <id>DE25602</id> <by>Vasanthakumar</by> <date>18-01-2017</date><description>If item id and accessorial id is zero then Credit adjustment line item is inserted in the order</description>
** <id>US26559</id> <by>Vasanthakumar</by> <date>02-02-2017</date> <description>Get Invoiced SO list and pass to credit memo popup</description>
** <id>US26575</id> <by>Baldev Singh Thakur</by> <date>03-02-2017</date> <description>Added condition to display BS Cost and appropriate fields if the order attached to the bill is Billing Station.</description>
** </changeHistory>

***********************************************/

export class SalesOrderDisputeViewModel {
	//#region Members
	//Creating Reference of Dispute Vendor bill details model
	disputeVendorBillDetailsModels: KnockoutObservableArray<DisputeVendorBillDetailsModel> = ko.observableArray([]);
	private selecteLineItem: DisputeVendorBillDetailsModel;
	//Creating Reference of Dispute Vendor bill details Item model
	DisputeVendorBillItemsModel: KnockoutObservableArray<DisputeVendorBillItemsModel> = ko.observableArray([]);
	//disputeVendorBillDetails: KnockoutObservableArray<VendorBillItemsModel> = ko.observableArray([]);
	shipmentItemTypes: KnockoutObservableArray<IShipmentItemType> = ko.observableArray([]);
	//For Bill Status list
	billStatusList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	//For Selected Bill Status
	selectedbillStatus: KnockoutObservable<number> = ko.observable();
	//For sales Order client for call save and get data
	salesOrderClient: refSalesOrderClient.SalesOrderClient = new refSalesOrderClient.SalesOrderClient();
	// ##START: US25310
	// Vendorbill client for all the service calls related to VB
	vendorBillClient: refVendorBillClient.VendorBillClient = new refVendorBillClient.VendorBillClient();
	// ##END: US25310
	//For get Agent Dispute Reason
	agentDisputeDetails: KnockoutObservableArray<IAgentDispute> = ko.observableArray([]);
	//Date Picker
	datepickerOptions: DatepickerOptions;
	//Hold Vendor Bill
	isHoldVB: KnockoutObservable<boolean> = ko.observable(false);
	//Quick pAy
	isQuickPay: KnockoutObservable<boolean> = ko.observable(false);
	//Internal Dispute Date
	internalDisputeDate: KnockoutObservable<any> = ko.observable('');
	//For Vendor BIll Dispute Date
	VBDisputeDate: KnockoutObservable<any> = ko.observable('');
	//For Header PRO Number
	proNumberHeader: KnockoutObservable<string> = ko.observable('');
	//Main Vendor BIll Id For Saving purpose
	mainVendorBillId: KnockoutObservable<number> = ko.observable(0);
	//Bill status id for bind selected bill
	billstatuId: KnockoutObservable<number> = ko.observable();
	//Updated Date
	updatedDate: KnockoutObservable<any> = ko.observable('');
	//Dispute Notes for Vendor BIll
	disputeNotes: KnockoutObservable<string> = ko.observable('');
	//Sales Order Total Cost of item for bind in right side Vendor BIll
	salesOrderTotalCost: KnockoutObservable<string> = ko.observable('0.00');
	//Sales Order Total Dispute of item for bind in right side Vendor BIll
	salesOrderTotalDisputeAmount: KnockoutObservable<string> = ko.observable('0.00');
	//Sales Order Total Pay of item for bind in right side Vendor BIll
	salesOrderTotalPayAmount: KnockoutObservable<string> = ko.observable('0.00');
	//Flag for Check is bill Status Is dispute or not
	isBillStatusDispute: KnockoutObservable<boolean> = ko.observable(false);
	// ###START: DE21749
	//Flag for Check is bill Status Is dispute or not
	isBillStatusDisputeOnly: KnockoutObservable<boolean> = ko.observable(false);
	// ###END: DE21
	//for enable or disable save button
	isSelected: KnockoutObservable<boolean> = ko.observable(false);
	//for enable or disable save button
	isVisibleDisputeDetails: KnockoutObservable<boolean> = ko.observable(false);
	//Sales Order Id for save and get purpose
	salesOrderIdMain: KnockoutObservable<number> = ko.observable(0);
	//All KO Internal Dispute
	internalDisputedId: KnockoutObservable<number> = ko.observable();
	internalDisputedBy: KnockoutObservable<string> = ko.observable('');
	internalDisputedAmount: KnockoutObservable<number> = ko.observable($.number(0, 2));
	internalDisputedDate: KnockoutObservable<any> = ko.observable('');
	internalDisputedReason: KnockoutObservable<string> = ko.observable('');
	internalDisputedNotes: KnockoutObservable<string> = ko.observable('');
	internalDisputedNotespopup: KnockoutObservable<string> = ko.observable('');
	// ###START: US20352
	internalDisputeStatusId: KnockoutObservable<number> = ko.observable();
	// ###END: US20352
	// Accepts only numeric with decimal input
	NumericInputWithDecimalPoint: INumericInput;
	//For Validation purpose
	errorSalesOrderDispute: KnockoutValidationGroup;
	//after click on select on grid to get selected data
	selectItem: (lineItem: DisputeVendorBillDetailsModel) => void;
	//after click on select on grid to get selected data
	selectDisputeWithCarrierLink: (lineItem: DisputeVendorBillDetailsModel) => void;
	// ###START: US20687
	bolNumber: KnockoutObservable<string> = ko.observable('');
	// ###END: US20687
	//For Internal Dispute Popup
	internalDispute: (lineItemVB: DisputeVendorBillDetailsModel) => void;
	commonUtils = new Utils.Common();
	disputeData: KnockoutObservableArray<refsalesOrderDisputeDetails.Models.VendorBillDisputeContainer> = ko.observableArray([]);
	disputeCallback: () => any
    isViewOnly: KnockoutObservable<boolean> = ko.observable(true);
	disputeNoteString: KnockoutObservable<string> = ko.observable('');
	//Bill status id for bind selected bill
	originalBillStatusId: KnockoutObservable<number> = ko.observable();
	onSaveClick: KnockoutObservable<boolean> = ko.observable(false);
	CommonUtils: CommonStatic = new Utils.Common();
	// ###START: US20584
	salesOrderStatusTypes: KnockoutObservableArray<IDisputeStatus> = ko.observableArray([]);
	selectedStatusType: KnockoutObservable<number> = ko.observable();
	// ###END: US20584
	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	private checkMsgDisplay: boolean = true;
	public isViewMessage: boolean = true;

	// ##START: US20961
	isBillMovedToMas: KnockoutObservable<boolean> = ko.observable(false);
	// ##END: US20961

	// ##START: US21131
	disputeStateIdOnLoad: number;
	disputeStateNote: string;
	currentUser: KnockoutObservable<IUser> = ko.observable();
	salesRepId: number;
	customerId: number;
	// ##END: US21131

	// ##START: US21132
	billStatusOnLoad: number;
	subBillCount: number;
	hasLostBill: boolean;
	proNumberOfMainBill: string;
	// ##END: US21132

	// ##START: US21791
	agingDays: KnockoutObservable<number> = ko.observable(0);
	// ##END: US21791

	// ##START: US22053
	carrierName: string;
	// ##END: US22053

	//##START: DE23003
	isBillStatusDisputeShortPaid: KnockoutObservable<boolean> = ko.observable(false);
	//##END: DE23003

	// ###START: DE23503
	disputeAmount: number = 0;

	// ###END: DE23503

	// ##START: US24865
	disputeEmailTemplates: Array<IDisputeEmailTemplate> = [];
	// ##END: US24865

	// ##START: US24866
	originalCost: string = '';
	originalWeight: string = '';
	nmfcNumbers: string = '';
	classes: string = '';
	// ##END: US24866

	// ##START: US25310
	creditReasonOptions: Array<ICreditReason> = [];
	mainBOLNumber: string;
	totalPendingCreditAmount: number = $.number(0, 2);
	creditRequestCallback: () => any;
	// ##END: US25310

	// ###START: US25679
	totalPendingVendorAmount: number = $.number(0, 2);
	// ###END: US25679

	// ##START: US25153
	itemsNotIntegratedWithMas: IShipmentItemType[] = [];
	// ##END: US25153
	//#endregion

	// ###START: DE25119
	disableDisputeView: KnockoutObservable<boolean> = ko.observable(false);

	// ###END: DE25119
	invoicedSOExceptCMSubSo: IOrderRevenuePair[] = [];

	//#region Constructor
	// ##START: US25310
	constructor(disputeCallback: () => any, creditRequestCallback: () => any) {
		// ##END: US25310
		var self = this;
		self.disputeCallback = disputeCallback;
		// ##START: US25310
		self.creditRequestCallback = creditRequestCallback;
		// ##END: US25310

		// ##START: US21131
		self.getLoggedInUserDetails();

		// ##END: US21131

		//To set The date picker options
		self.datepickerOptions = {
			blockWeekend: true,
			blockPreviousDays: false,
			blockHolidaysDays: true,
			autoClose: true,
			placeBelowButton: false,
		};

		//Validate total Dispute Amount
		self.salesOrderTotalDisputeAmount.extend({
			max: {
				params: 1,
				message: ApplicationMessages.Messages.InvalidTotalCost,
				onlyIf: () => {
					return ((parseFloat(self.salesOrderTotalCost().toString().replace(/,/g, "")) < parseFloat(self.salesOrderTotalDisputeAmount().toString())) &&
						(self.billstatuId() === refEnums.Enums.VendorBillStatus.Dispute.ID
						|| self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeWon.ID
						|| self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID
						|| self.billstatuId() === refEnums.Enums.VendorBillStatus.ShortPaid.ID));
				}
			},
			number: true,
			min: {
				params: 1,
				message: ApplicationMessages.Messages.DisputeAmountShouldNotBeNegative,
				onlyIf: () => {
					return (self.onSaveClick() &&
						(self.billstatuId() === refEnums.Enums.VendorBillStatus.Dispute.ID
						|| self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeWon.ID
						|| self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID
						|| self.billstatuId() === refEnums.Enums.VendorBillStatus.ShortPaid.ID));
				}
			}
		});

		////Validate Dispute Date
		self.VBDisputeDate.extend({
			required: {
				message: 'A valid Dispute Date is required.',
				onlyIf: () => {
					return (self.onSaveClick() &&
						(self.billstatuId() === refEnums.Enums.VendorBillStatus.Dispute.ID
						|| self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeWon.ID
						|| self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID
						|| self.billstatuId() === refEnums.Enums.VendorBillStatus.ShortPaid.ID));
				}
			}
		});

		//Validating Dispute notes
		self.disputeNoteString.extend({
			required: {
				message: 'A valid Dispute Notes is required',
				onlyIf: () => {
					return (self.isBillStatusDispute() && self.onSaveClick());
				}
			}
		});

		//set the flag allow decimal: true to accepts decimals
		self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(true) };


		// ###START: US20687
		self.selectDisputeWithCarrierLink = function (lineItem: DisputeVendorBillDetailsModel) {
			// ###START: DE24638
			if (typeof Utils.Constants.IsDisputeEmailPopupEnabled !== "undefined" && Utils.Constants.IsDisputeEmailPopupEnabled.toLowerCase() === 'false') {
				var parameter = '';
				if (lineItem.proNumber() === '' || lineItem.proNumber() === undefined) {
					parameter = 'PRONumber';
					self.disputeWithCarrierErrorMessage(parameter);
				} else if (lineItem.salesOrderId() === null || lineItem.salesOrderId() === 0) {
					parameter = 'Shipment ID';
					self.disputeWithCarrierErrorMessage(parameter);
				} else if (lineItem.carrierCode() === '' || lineItem.carrierCode() === undefined) {
					parameter = 'SCAC';
					self.disputeWithCarrierErrorMessage(parameter);
				} else if (self.bolNumber() === '' || self.bolNumber() === undefined) {
					parameter = 'BOL';
					self.disputeWithCarrierErrorMessage(parameter);
				} else if (lineItem.CarrierName() === '' || lineItem.CarrierName() === undefined) {
					parameter = 'CarrierName';
					self.disputeWithCarrierErrorMessage(parameter);
				}
				else {
					var left = screen.width / 2 - 700 / 2;
					var top = screen.height / 2 - 450 / 2;
					if (self.disputeVendorBillDetailsModels().length >= 1) {
						window.open(lineItem.disputeWithCarrierUrl(), 'ctcCodes', 'height=450,width=700,scrollbars=0,resizable=0,menubar=0,status=0,toolbar=0,top=' + top + ',left=' + left + '');
					}
				}
			}
			else if (typeof Utils.Constants.IsDisputeEmailPopupEnabled !== "undefined" && Utils.Constants.IsDisputeEmailPopupEnabled.toLowerCase() === 'true') {
				// ###END: DE24638
				// ##START: US24862
				// on click of send email in popup
				var onSendEmailClickCallback = function (disputeStateNote: string) {

				};

				// on click of cancel in popup
				var onCancelClickCallbakc = function () {

				};

				// ##START: US24866
				// ##START: US24865
				var emailPopupData = {
					proNumber: lineItem.proNumber(),
					bolNumber: self.bolNumber(),
					// ##START: US24866
					originalCost: self.originalCost,
					originalWeight: self.originalWeight,
					nmfcNumbers: self.nmfcNumbers,
					classes: self.classes,
					// ##END: US24866
					carrierName: self.carrierName,
					disputeAmount: lineItem.disputedAmount(),
					carrierContactAddressList: lineItem.disputeCarrierEmailDetailsList,
					disputeTemplateList: self.disputeEmailTemplates,
					// ##START: US24874
					shipmentId: self.salesOrderIdMain()
					// ##END: US24874
				};

				// ##END: US24865
				// ##END: US24866

				// object to be passed to the popup
				var optionControlArgs: IMessageBoxOption = {
					options: undefined,
					message: '',
					title: 'Confirmation',
					bindingObject: {
						// ##START: US24866
						// ##START: US24865
						emailPopupData: emailPopupData,
						// ##END: US24865
						// ##END: US24866
						saveCallback: onSendEmailClickCallback,
						cancelCallback: onCancelClickCallbakc
					}
				};

				_app.showDialog('salesOrder/SalesOrderDisputeEmailPopup', optionControlArgs); //show popup
				// ##END: US24862
				// ###START: DE24638
			}
			// ###END: DE24638
			// ###END: US20687
		}
		//Click on select
		self.selectItem = function (lineItem: DisputeVendorBillDetailsModel) {
			// Delete from the collection
			self.isVisibleDisputeDetails(true);
			self.onSaveClick(false);
			if (self.disputeVendorBillDetailsModels().length >= 1) {
				self.selecteLineItem = lineItem;
					self.isSelected(true);
				// ##START: US20961
				if (self.selecteLineItem.moveToMasDate() !== null) {
					self.isBillMovedToMas(true);
					self.isSelected(false);
				}
				else {
					self.isBillMovedToMas(false);
				}
				// ##END: US20961

				// ###START: DE21749
				self.internalDisputeStatusId(undefined);
				// ###END: DE21749
				// self.VBDisputeDate(self.selecteLineItem.disputedDate());

				// ##START: US21132
				self.billStatusOnLoad = undefined;
				self.billStatusList(self.selecteLineItem.billStatusList());
				self.billstatuId(self.selecteLineItem.billStatusId());
				self.billStatusOnLoad = self.selecteLineItem.billStatusId();
				// ##END: US21132

				// ##START: US25310
				if (self.billStatusOnLoad === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID) {
					self.getCreditReasonOptions();
					self.getCreditMemoInvoicedSOList();
				}
				// ##END: US25310

				self.proNumberHeader(self.selecteLineItem.proNumber());
				self.mainVendorBillId(self.selecteLineItem.vendorBillId());
				//self.disputeNotes(self.selecteLineItem.disputeNotes());
				self.disputeNoteString(self.selecteLineItem.disputeNotes());
				self.updatedDate(self.selecteLineItem.updatedDate());
				self.isHoldVB(self.selecteLineItem.isHoldVB());
				self.isQuickPay(self.selecteLineItem.isQuickPay());

				self.originalBillStatusId(self.selecteLineItem.originalBillingStatus());
					// ###START: US20352
					self.internalDisputeStatusId(self.selecteLineItem.internalSelectedDisputedStatusId());
					// ###END: US20352

				// ##START: US21131
				self.disputeStateIdOnLoad = self.selecteLineItem.internalSelectedDisputedStatusId();
				// ##END: US21131

				if (self.billstatuId() === refEnums.Enums.VendorBillStatus.Dispute.ID
					|| self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeWon.ID
					|| self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID
					|| self.billstatuId() === refEnums.Enums.VendorBillStatus.ShortPaid.ID) {
					self.isBillStatusDispute(true);
					if (self.VBDisputeDate() === undefined || self.VBDisputeDate() === null || self.VBDisputeDate() === "") {
						self.VBDisputeDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
					}
				} else {
					self.isBillStatusDispute(false);
					self.VBDisputeDate('');
				}

				// ###START: DE21749
				if (lineItem.billStatusId() === refEnums.Enums.VendorBillStatus.Dispute.ID) {
					self.isBillStatusDisputeOnly(true);
				} else {
					self.isBillStatusDisputeOnly(false);
				}
				// ###END: DE21749

				//##START: DE23003

				// ###START: US24324
				if (lineItem.billStatusId() === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID || lineItem.billStatusId() === refEnums.Enums.VendorBillStatus.OverchargeClaim.ID ) {
					// ###END: US24324
					self.isBillStatusDisputeShortPaid(true);
				}
				else {
					self.isBillStatusDisputeShortPaid(false);
				}
				//##END: DE23003

				// ###START: DE23466
				if (lineItem.billStatusId() === refEnums.Enums.VendorBillStatus.OverchargeLose.ID || lineItem.billStatusId() === refEnums.Enums.VendorBillStatus.OverchargeWon.ID || !lineItem.isCreditProcessEnable()) {
					self.isBillMovedToMas(true);
				}
				// ###END: DE23466 

				if (!self.isViewOnly()) {
					self.isBillStatusDispute(false);
					self.isSelected(false);
				}
				self.initializeDisputeItem(self.disputeData(), self.selecteLineItem.vendorBillId());

				//##START: US21147
				//if late dispute amount is not zero show that amount
				if (self.selecteLineItem.lateDisputedAmount() != 0) {
					self.salesOrderTotalDisputeAmount(self.selecteLineItem.lateDisputedAmount().toString());
				}
				//##END: US21147

				// ###START: DE21416
				self.VBDisputeDate(self.CommonUtils.formatDate(self.selecteLineItem.disputedDate(), 'mm/dd/yyyy'));
				// ###END: DE21416

				// ##START: US21791
				self.agingDays(self.selecteLineItem.agingDays);
				// ##END: US21791

				// ###START: DE25119
				self.disableDisputeView(lineItem.isCreditProcessEnable());
				// ###END: DE25119
			}

			var requoteReasonCodeLength: number = self.agentDisputeDetails().length;
			self.internalDisputedBy('');
			self.internalDisputedAmount(0.00);
			self.internalDisputeDate('');
			self.internalDisputedNotes('');
			self.salesOrderClient.GetAgentDisputes(self.salesOrderIdMain(), self.mainVendorBillId(), (data) => {
				if (data) {
					self.internalDisputedBy(data.DisputedRepName);
					self.internalDisputedAmount($.number(data.DisputeAmount, 2));
					self.internalDisputeDate(self.commonUtils.formatDate(data.DisputeDate, 'mm/dd/yyyy'));
					self.internalDisputedReason(data.DisputeReason);
					self.internalDisputedNotes(data.DisputeNotes);
					self.internalDisputedNotespopup(data.DisputeNotes);
					self.internalDisputedId(data.Id);
				}
			}, () => {
				});

			//For highlight selected row
			var alltr = $('tr');
			$('td a').on('click', function () {
				alltr.removeClass('selected');
				$(this).closest('tr').addClass('selected');
			});
		};

		//For internal Dispute Popup
		self.internalDispute = function (lineItemVB: DisputeVendorBillDetailsModel) {
			self.salesOrderClient.GetAgentDisputes(self.salesOrderIdMain(), lineItemVB.vendorBillId(), (data) => {
				//if (data) {
				lineItemVB.internalDisputeNotes(data.DisputeNotes);
				lineItemVB.internalDisputeId(data.Id);
				lineItemVB.disputedReason(data.DisputeReason);
				lineItemVB.internalDisputedAmount(data.DisputeAmount);
				lineItemVB.internalDiputeDate(data.DisputeDate);
				lineItemVB.internalDisputedBy(data.DisputedRepName);
				////initialize message box control arguments
				var optionControlArgs: IMessageBoxOption = {
					options: undefined,
					message: '',
					title: 'Revenue Adjustment',
					bindingObject: lineItemVB
				}

				//Call the dialog Box functionality to open a Popup
                _app.showDialog('salesOrder/SalesOrderInternalDispute', optionControlArgs).then((object) => {
					self.internalDisputedBy(object.disputedBy());
					self.internalDisputedAmount($.number(object.disputeAmount(), 2));
					self.internalDisputedNotes(object.internalDisputeNotes());
					self.internalDisputeDate(self.commonUtils.formatDate(object.internalDisputeDatePopup(), 'mm/dd/yyyy'));
				});
				//}
			}, () => {
				});

			//for heighLight selected row
			var all_tr = $('tr');
			$('td a').on('click', function () {
				all_tr.removeClass('selected');
				$(this).closest('tr').addClass('selected');
			});
		};

		//#region Error Details Object
		self.errorSalesOrderDispute = ko.validatedObservable({
			internalDisputeDate: self.internalDisputeDate,
			VBDisputeDate: self.VBDisputeDate,
			disputeNoteString: self.disputeNoteString,
			salesOrderTotalDisputeAmount: self.salesOrderTotalDisputeAmount
		});

		// Subscribe to change the cost as negative if that is discount
		self.billstatuId.subscribe(() => {
			if (self.billstatuId() === refEnums.Enums.VendorBillStatus.Dispute.ID
				|| self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeWon.ID
				|| self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID
				|| self.billstatuId() === refEnums.Enums.VendorBillStatus.ShortPaid.ID) {
				self.isBillStatusDispute(true);
				if (self.VBDisputeDate() === undefined || self.VBDisputeDate() === null || self.VBDisputeDate() === "") {
					self.VBDisputeDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
				}
			} else {
				self.isBillStatusDispute(false);
				self.VBDisputeDate('');
			}

			// ###START: DE21749
			// For dispute status only
			if (self.billstatuId() === refEnums.Enums.VendorBillStatus.Dispute.ID) {
				self.isBillStatusDisputeOnly(true);
			} else {
				self.isBillStatusDisputeOnly(false);
			}
			// ###END: DE21749

			// ##START: US21132
			// if billstatus is changed to dispute lost show popup
			if (self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeLost.ID && typeof self.billStatusOnLoad !== "undefined" && self.billStatusOnLoad !== self.billstatuId()) {
				self.showDisputeLostPopup();
			}
			// ##END: US21132

		});

		// ###START: US20584
		// Load all ship via if not loaded already
		var salesOrderStatusTypes: number = self.salesOrderStatusTypes().length;
		if (!(salesOrderStatusTypes)) {
			_app.trigger("GetDisputeStatusList", function (data) {
				if (data) {
					self.salesOrderStatusTypes.removeAll();
					self.salesOrderStatusTypes.push.apply(self.salesOrderStatusTypes, data);
				}
			});
		}

		// Calling subscribe call to save Dispute status
		self.internalDisputeStatusId.subscribe((selectedStatus) => {
			// ##START: US20961
			self.isSelected(true);
			// ##END: US20961
			self.internalDisputeStatusId(selectedStatus);
		});
		// ###END: US20584

		// ##START: US25153
		if (typeof self.itemsNotIntegratedWithMas !== "undefined" && self.itemsNotIntegratedWithMas.length === 0) {
			_app.trigger("GetItemsNotIntegratedWithMas", function (items: Array<IShipmentItemType>) {
				if (items) {
					self.itemsNotIntegratedWithMas = self.itemsNotIntegratedWithMas.concat(items); // 'removeAll' and 'push' will remove the items from shell too, hence concat is used
				}
			});
		}
		// ##END: US25153

		// ###START: US20687
		//To check if Msg is clicked
		self.checkMsgClick = () => {
			self.checkMsgDisplay = true;
			self.isViewMessage = true;
		}

		//to Check if Msg is hidden or closed
		self.checkMsgHide = () => {
			self.checkMsgDisplay = true;
			self.isViewMessage = true;
		}
		// ###END: US20687

		return self;
	}

	//#endregion

	//#region Public Methods
	// ###START: US20687
	public disputeWithCarrierErrorMessage(parameter: string) {
		var self = this;
		if (self.checkMsgDisplay) {
			self.checkMsgDisplay = false;
			var toastrOptions1 = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 10,
				fadeOut: 10,
				typeOfAlert: "",
				title: ""
			}
			if (self.isViewMessage) {
				//changed in true as per requirement
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, parameter + ' ' + ApplicationMessages.Messages.ParameterNotFoundForDisputeWithCarrierLink, "error", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
			}
		}
	}
	// ###END: US20687

	//Click On Save For vendor Bill Dispute
	public onSave() {
		var self = this;

		self.onSaveClick(true);

		// ##START: US20961
		// ##START: DE23003
		if (typeof self.selecteLineItem.moveToMasDate() !== "undefined" && self.selecteLineItem.moveToMasDate() !== null && !self.isBillStatusDisputeShortPaid()) {
			// ##END: DE23003
			// ##START: US21131
			if ((self.internalDisputeStatusId() == refEnums.Enums.DisputeState.MoreDisputeInfoNeeded.ID
				|| self.internalDisputeStatusId() == refEnums.Enums.DisputeState.GTZError.ID) && self.disputeStateIdOnLoad != self.internalDisputeStatusId())
				self.showDisputeStateNotePopup();
			else
				self.saveOnlyDisputeStatusForVBsMovedToMas();

			// ##END: US21131

			return;
		}

		// ##END: US20961

		var errorDisputeResult = $.grep(self.DisputeVendorBillItemsModel(), function (e) { return (e.lineItemIsInvalid()) });

		if (self.errorSalesOrderDispute.errors().length === 0 && errorDisputeResult.length === 0) {

			// ##START: US21131
			if ((self.internalDisputeStatusId() == refEnums.Enums.DisputeState.MoreDisputeInfoNeeded.ID || self.internalDisputeStatusId() == refEnums.Enums.DisputeState.GTZError.ID)
				&& self.disputeStateIdOnLoad != self.internalDisputeStatusId())
				self.showDisputeStateNotePopup();
			else
				self.saveDisputeDetails();

			// ##END: US21131
		}
		else {
			self.errorSalesOrderDispute.errors.showAllMessages();
			errorDisputeResult.forEach(function (item) {
				item.errorDisputeVendorItemDetail.errors.showAllMessages();
			});
		}

		return false;
	}

	/*
	** <summary>
	** Final save method seperated from onSave() to reuse when save is clicked on Dispute State Note popup
	** </summary>
	** <createDetails>
	** <id>US21131</id><by>Shreesha Adiga</by><date>31-03-2016</date>
	** </createDetails>
	*/
	public saveDisputeDetails() {
		var self = this;

		self.isVisibleDisputeDetails(false);
		// ###START: DE21749
		self.isBillStatusDisputeOnly(false);
		// ###END: DE21749
		self.isSelected(false);
		self.onSaveClick(false);
		var salesOrderDisputeVendorBillContainer = new refSalesOrderVendorBillDisputeContainer.Models.VendorBillDisputeContainer();
		salesOrderDisputeVendorBillContainer.ShipmentId = self.salesOrderIdMain();
		salesOrderDisputeVendorBillContainer.DisputeVendorBill = self.getSalesOrderDisputeVendorBillDetails();
		salesOrderDisputeVendorBillContainer.VendorBillItemsDetail = self.getDisputeSalesOrderItemDetails();
		salesOrderDisputeVendorBillContainer.CanSaveReasonCodes = self.isBillStatusDispute();
		salesOrderDisputeVendorBillContainer.SalesRepId = self.salesRepId;
		salesOrderDisputeVendorBillContainer.CustomerId = self.customerId;

		// ##START: US22053
		salesOrderDisputeVendorBillContainer.BOLNumber = self.bolNumber();
		salesOrderDisputeVendorBillContainer.CarrierName = self.carrierName;
		salesOrderDisputeVendorBillContainer.IsSavedFromVB = false;
		// ##END: US22053

		if ((self.internalDisputeStatusId() == refEnums.Enums.DisputeState.MoreDisputeInfoNeeded.ID || self.internalDisputeStatusId() == refEnums.Enums.DisputeState.GTZError.ID)
			&& self.disputeStateIdOnLoad != self.internalDisputeStatusId()) {
			salesOrderDisputeVendorBillContainer.DisputeStateNote = self.getDisputeStateNote();
		}

		// ###START: US20352
		if (self.internalDisputeStatusId() > 0) {
			var disputeStatus: IEnumValue = {
				ID: self.internalDisputeStatusId(),
				Value: ''
			}
			}
		else {
			var disputeStatus: IEnumValue = {
				ID: undefined,
				Value: ''
			}
			}

		salesOrderDisputeVendorBillContainer.DisputeStatusId = disputeStatus;
		// ###END: US20352
		self.isBillStatusDispute(false);
		// ###START: US22471
		self.salesOrderClient.SaveSalesOrderDisputeVBDetails(salesOrderDisputeVendorBillContainer, (data) => {
			var toastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 10,
				fadeOut: 10,
				typeOfAlert: "",
				title: ""
			}

			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SavedSuccessfullyMessage, "success", null, toastrOptions);

			// ##START: US22053
			if (data.Response === true) {
				if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSettingNotFoundCode) {
					var toastrOptionsMailSent = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, data.StatusModel.Description, "info", null, toastrOptionsMailSent);
				}
				else if (data.StatusModel.StatusCode === Constants.ApplicationConstants.NoErrorStatusCode) {
					var toastrOptionsMailSent = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SendSuccessfullyMail, "success", null, toastrOptionsMailSent);
				}
				else {
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.MailFailureMessage, "error", null, toastrOptions);
				}
			}
			// ##END: US22053

			// ##START: US25310
			if (self.billStatusOnLoad === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID && self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeWon.ID) {
				self.getDataAndShowCreditRequestPopup(self.mainVendorBillId(), self.salesOrderTotalDisputeAmount());
			}
			// ##END: US25310

			self.clearAllData();
			self.disputeCallback();
		}, (message) => {
				//self.isSelected(true);
				self.isVisibleDisputeDetails(true);
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}
			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
				// ###END: US22471
			});
	}

	// ##START: US21131
	// method to show the popup to enter dispute state note
	public showDisputeStateNotePopup() {
		var self = this;

		var disputeStateString = self.commonUtils.getEnumValueById(refEnums.Enums.DisputeState, self.internalDisputeStatusId().toString());

		// on click of save in popup
		var saveClickOnPopupCallback = function (disputeStateNote: string) {

			self.disputeStateNote = disputeStateNote;

			if (typeof self.selecteLineItem.moveToMasDate() !== "undefined" && self.selecteLineItem.moveToMasDate() !== null && !self.isBillStatusDisputeShortPaid())
				self.saveOnlyDisputeStatusForVBsMovedToMas();
			else
				self.saveDisputeDetails();
		}

		// on click of cancel in popup
		var cancelClickOnPopupCallback = function () {
			self.internalDisputeStatusId(self.disputeStateIdOnLoad === 0 ? undefined : self.disputeStateIdOnLoad); // set the dispute state to what it was before on click of cancel
		}

		// object to be passed to the popup
		var optionControlArgs: IMessageBoxOption = {
			options: undefined,
			message: '',
			title: 'Confirmation',
			bindingObject: {
				selectedDisputeState: disputeStateString,
				saveCallback: saveClickOnPopupCallback,
				cancelCallback: cancelClickOnPopupCallback
			}
		}

		_app.showDialog('salesOrder/SalesOrderDisputeStateNotePopup', optionControlArgs); //show popup
	}

	// ##END: US21131

	// ##START: US20961
	// To save dispute status for VBs that are already in mas
	public saveOnlyDisputeStatusForVBsMovedToMas() {
		var self = this;

		var salesOrderDisputeVendorBillContainer = new refSalesOrderVendorBillDisputeContainer.Models.VendorBillDisputeContainer();
		var disputeStatus: IEnumValue = {
			ID: self.internalDisputeStatusId(),
			Value: ''
		}

		salesOrderDisputeVendorBillContainer.DisputeVendorBill = self.getSalesOrderDisputeVendorBillDetails();
		salesOrderDisputeVendorBillContainer.DisputeStatusId = disputeStatus;

		// ##START: US21131
		salesOrderDisputeVendorBillContainer.SalesRepId = self.salesRepId;
		salesOrderDisputeVendorBillContainer.CustomerId = self.customerId;

		if ((self.internalDisputeStatusId() == refEnums.Enums.DisputeState.MoreDisputeInfoNeeded.ID || self.internalDisputeStatusId() == refEnums.Enums.DisputeState.GTZError.ID)
			&& self.disputeStateIdOnLoad != self.internalDisputeStatusId()) {
			salesOrderDisputeVendorBillContainer.DisputeStateNote = self.getDisputeStateNote();
		}

		// ##END: US21131

		//##START: US22053
		salesOrderDisputeVendorBillContainer.BOLNumber = self.bolNumber();
		salesOrderDisputeVendorBillContainer.CarrierName = self.carrierName;
		salesOrderDisputeVendorBillContainer.IsSavedFromVB = false;
		//##END: US22053

		self.isBillStatusDispute(false);
		self.salesOrderClient.SaveDisputeStatusFromSalesOrder(salesOrderDisputeVendorBillContainer, (message) => {
			var toastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 10,
				fadeOut: 10,
				typeOfAlert: "",
				title: ""
			}
			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.DisputeStatusSavedSuccessfully, "success", null, toastrOptions);

			// ##START: US22053
			// ###START: US22471
			if (message.Response === true) {
				if (message.StatusModel.StatusCode == Constants.ApplicationConstants.MailSettingNotFoundCode) {
					var toastrOptionsMailSent = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, message.StatusModel.Description, "info", null, toastrOptionsMailSent);
				}
				else if (message.StatusModel.StatusCode === Constants.ApplicationConstants.NoErrorStatusCode) {
					var toastrOptionsMailSent = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SendSuccessfullyMail, "success", null, toastrOptionsMailSent);
				}
				else {
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.MailFailureMessage, "error", null, toastrOptions);
				}
			}

			// ##END: US22053

			self.clearAllData();
			self.disputeCallback();
		}, (message) => {
				//self.isSelected(true);
				self.isVisibleDisputeDetails(true);
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}
			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
				// ###END: US22471
			});
	}
	// ##END: US20961

	// ##START: US21132
	// show dispute lost popup to edit lost amount for items
	public showDisputeLostPopup() {
		var self = this;

		var saveClickOnPopupCallback = function () {
			self.disputeCallback();
		}

		var cancelClickOnPopupCallback = function () {
			// set dispute status to previous value
			self.billstatuId(self.billStatusOnLoad);
		}

		// object to be passed to the popup
		var optionControlArgs: IMessageBoxOption = {
			options: undefined,
			message: '',
			title: '',
			bindingObject: {
				vendorBillId: self.mainVendorBillId(),
				proNumber: self.proNumberHeader(),
				proNumberOfMainBill: self.proNumberOfMainBill,
				subBillCount: self.subBillCount,
				hasLostBill: self.hasLostBill,
				saveCallback: saveClickOnPopupCallback,
				cancelCallback: cancelClickOnPopupCallback
			}
		}

		_app.showDialog('vendorBill/VendorBillDisputeLost', optionControlArgs);
	}

	// ##END: US21132

	//Clear all Data from view self.DisputeVendorBillItemsModel.removeAll();
	public clearAllData() {
		var self = this;
		self.DisputeVendorBillItemsModel.removeAll();
		self.disputeVendorBillDetailsModels.removeAll();
		self.internalDisputedBy('');
		self.internalDisputedAmount($.number(0, 2));
		self.internalDisputeDate('');
		self.internalDisputedNotes('');
		self.billStatusList.removeAll();
		self.salesOrderTotalDisputeAmount($.number(0, 2));
		self.VBDisputeDate('');
		self.disputeNotes('');
		self.salesOrderTotalPayAmount($.number(0, 2));
		self.salesOrderTotalCost($.number(0, 2));
		self.isBillStatusDispute(false);
		self.disputeNoteString('');
		// ###START: US20584
		self.internalDisputeStatusId(undefined);
		// ###END: US20584

		// ##START: US21132
		self.billStatusOnLoad = undefined;
		// ##END: US21132
	}

	//Initialize Dispute from main sales order accordion or tabbed
	public initializeDispute(data: IVendorBillDisputeContainer, salesRepId, customerId, enable?: boolean) {
		var self = this;

		// ##START: US21131
		self.salesRepId = salesRepId;
		self.customerId = customerId;
		// ##END: US21131

		if (data != null) {
			self.disputeVendorBillDetailsModels.removeAll();
			data.DisputeVendorBill.forEach(function (item) {
				self.disputeVendorBillDetailsModels.push(new DisputeVendorBillDetailsModel(item, self.salesOrderIdMain(), self.internalDisputedNotespopup(), self.internalDisputedId(), self.bolNumber()));
			});

			// ##START: US21132
			// the following data are required for creating lost bill
			self.subBillCount = data.SubBillCount;
			self.hasLostBill = data.HasLostBill;
			self.proNumberOfMainBill = typeof data.DisputeVendorBill !== "undefined" && data.DisputeVendorBill.length > 0 ? data.DisputeVendorBill[0].ProNumber : "";
			// ##END: US21132

			self.isViewOnly(enable);

			// ##START: US24866
			if (data.SalesOrderOriginalDetails != null) {
				self.originalCost = data.SalesOrderOriginalDetails.SOOriginalCost;
				self.originalWeight = data.SalesOrderOriginalDetails.SOOriginalWeight;
				self.nmfcNumbers = data.SalesOrderOriginalDetails.SONMFCNumbers;
				self.classes = data.SalesOrderOriginalDetails.SOClasses;
			}
			// ##END: US24866
		}
	}

	//initialize Vendor Bill Item after select click
	public initializeDisputeItem(data: any, vendorBillId: number) {
		var self = this;
		if (data != null) {
			// ###START: US21597
			if (self.selecteLineItem.lateDisputedAmount() != 0) {
				for (var i = 0; i < data.VendorBillItemsDetail.length; i++) {
					// ###START: DE23503
					self.disputeAmount += data.VendorBillItemsDetail[i].DisputeAmount;

					// ###END: DE23503
					data.VendorBillItemsDetail[i].DisputeAmount = 0;
				}
			}

			// ###END: US21597
			var shipmentItemTypesLength: number = self.shipmentItemTypes().length;
			if (!(shipmentItemTypesLength)) {
				_app.trigger("GetItemsTypes", function (items: IShipmentItemType) {
					self.shipmentItemTypes.removeAll();
					self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
				});
			}

			var totalShippingAndDiscountCost = 0.0;

			self.DisputeVendorBillItemsModel.removeAll();

			data.VendorBillItemsDetail.forEach(function (item) {
				if (item.VendorBillId === vendorBillId) {
					if (item.ItemId === 10 || item.ItemId === 70) {
						var costWithoutComma = item.Cost.toString();
						var check = costWithoutComma.indexOf(",");
						if (check === -1) {
							totalShippingAndDiscountCost += parseFloat(item.Cost.toString());
						} else {
							//For removing comma before addition because parseFloat is not taking digit after comma at adding time
							totalShippingAndDiscountCost += parseFloat(costWithoutComma.replace(/,/g, ""));
						}
					}
				}
			});

			data.VendorBillItemsDetail.forEach(function (item) {
				if (item.VendorBillId === vendorBillId) {

					// ##START: US25153
					var selectedItem;

					if (item.ItemId === 0 
						&& item.AccessorialId === 0
						&& self.itemsNotIntegratedWithMas) {
						selectedItem = $.grep(self.itemsNotIntegratedWithMas, function (e) {
							return e.ShortDescription === item.UserDescription;
						})[0];

						if (typeof selectedItem !== "undefined")
							self.shipmentItemTypes.push.apply(self.shipmentItemTypes, self.itemsNotIntegratedWithMas);
					}

					if (typeof selectedItem === "undefined") {
						//##START: DE22259
						selectedItem = $.grep(self.shipmentItemTypes(), function (e) {
							return e.ItemId === item.ItemId.toString() && (e.AccessorialId == null || item.AccessorialId == 0 || e.AccessorialId == item.AccessorialId);
						})[0];
						//##END: DE22259
					}
					// ##END: US25153

					// ##START: US21290
					if (typeof selectedItem === "undefined" || selectedItem == null) {
						selectedItem = $.grep(self.shipmentItemTypes(), function (e) {
							return e.ItemId === item.ItemId.toString();
						})[0];
					}
					// ##END: US21290

					self.DisputeVendorBillItemsModel.push(new DisputeVendorBillItemsModel(selectedItem, item, () => {
						self.updateTotalCostPayDisputeAmount();
					}, data.ReasonCodes, () => {
							self.UpdateDisputeLineItemsDescription();
						}, totalShippingAndDiscountCost));

					// ##START: US25153
					selectedItem = undefined; // otherwise in next iteration in loop, 'item' will still have the previous value
					// ##END: US25153
				}
			});
			// Update the totals in the totals section
			self.updateTotalCostPayDisputeAmount();
		}
	}

	// ##START: US24865
	// function to populate the dispute email templates
	public getAllDisputeEmailTemplates() {
		var self = this;

		self.salesOrderClient.GetAllDisputeEmailTemplates((data: Array<IDisputeEmailTemplate>) => {
			if (data) {
				self.disputeEmailTemplates.removeAll();
				self.disputeEmailTemplates = data;
			}
		});
	}
	// ##END: US24865

	public cleanup() {
		var self = this;

		//self.disputeVendorBillDetailsModels().forEach(function (item) {
		//	item.cleanup();
		//});

		//self.DisputeVendorBillItemsModel().forEach(function (item) {
		//	item.cleanup();
		//});

		if (self.selecteLineItem)
			self.selecteLineItem.cleanup()

		self.disputeVendorBillDetailsModels.removeAll();
		self.DisputeVendorBillItemsModel.removeAll();
		self.shipmentItemTypes.removeAll();
		self.billStatusList.removeAll();
		self.agentDisputeDetails.removeAll();

		for (var property in self) {
			if (property != "cleanup")
				delete self[property];
		}

		delete self;
	}

	//#endregion

	//#region Private Methods
	// Gets the logged in user details from shell.js
	private getLoggedInUserDetails() { // Get the logged in user for name for new note}
		var self = this;
		_app.trigger("GetCurrentUserDetails", (currentUser: IUser) => {
			self.currentUser(currentUser);
		});
	}

	//Get Vendor bill details For
	private getSalesOrderDisputeVendorBillDetails(): Array<IDisputeVendorBill> {
		var self = this;
		var salesOrderDisputeDetails: Array<refSalesOrderDisputeVendorBill.Models.DisputeVendorBill>;
		salesOrderDisputeDetails = ko.observableArray([])();
		var vendorBillDisputeData = new refSalesOrderDisputeVendorBill.Models.DisputeVendorBill();
		vendorBillDisputeData.DisputedDate = self.VBDisputeDate();

		// ###START: DE23503
		vendorBillDisputeData.DisputedAmount = (self.selecteLineItem.lateDisputedAmount() > 0) ? self.disputeAmount : parseFloat(self.salesOrderTotalDisputeAmount());

		// ###END: DE23503
		vendorBillDisputeData.DisputeNotes = self.disputeNotes();
		vendorBillDisputeData.BillStatus = self.billstatuId();
		vendorBillDisputeData.VendorBillId = self.mainVendorBillId();
		vendorBillDisputeData.UpdatedDate = self.updatedDate();
		vendorBillDisputeData.HoldVendorBill = self.isHoldVB();
		vendorBillDisputeData.QuickPay = self.isQuickPay();
		vendorBillDisputeData.OriginalBillStatus = self.originalBillStatusId();
		vendorBillDisputeData.DisputeNotes = self.disputeNoteString();
		// ###START: US20352
		vendorBillDisputeData.DisputeStatusId = self.internalDisputeStatusId();
		// ###END: US20352

		// ##START: US22053
		vendorBillDisputeData.ProNumber = self.proNumberHeader();
		// ##END: US22053

		salesOrderDisputeDetails.push(vendorBillDisputeData);
		return salesOrderDisputeDetails;
	}

	// Gets the vendor bill Item details for save
	private getDisputeSalesOrderItemDetails(): Array<IVendorBillItem> {
		var self = this;
		var salesOrderDisputeItems: Array<refSalesOrderItemModel.Models.VendorBillItemDetails>;
		salesOrderDisputeItems = ko.observableArray([])();

		self.DisputeVendorBillItemsModel().forEach((item) => {
			var salesOrderDisputreVBItem = new refSalesOrderItemModel.Models.VendorBillItemDetails();
			salesOrderDisputreVBItem.Id = item.id();
			salesOrderDisputreVBItem.Cost = item.cost();
			salesOrderDisputreVBItem.ItemId = item.selectedItemTypeId();
			salesOrderDisputreVBItem.UserDescription = item.description();
			salesOrderDisputreVBItem.DisputeAmount = item.disputeAmount();
			// ##START: DE23995
			salesOrderDisputreVBItem.DisputeLostAmount = item.disputeLostAmount();
			// ##END: DE23995
			salesOrderDisputreVBItem.VendorBillId = self.mainVendorBillId();
			salesOrderDisputreVBItem.ReasonNote = item.reasonNotes();
			salesOrderDisputreVBItem.SelectedReasonCodes = item.selectedReasonCode();
			//##START: DE22259
			salesOrderDisputreVBItem.AccessorialId = item.accessorialId() == null ? 0 : item.accessorialId();
			//##END: DE22259

			// ##START: DE24774
			salesOrderDisputreVBItem.SelectedClassType = item.selectedClassType();
			salesOrderDisputreVBItem.PieceCount = item.pieceCount();
			salesOrderDisputreVBItem.PackageTypeName = item.packageName();
			salesOrderDisputreVBItem.Weight = item.weight();

			salesOrderDisputreVBItem.DimensionHeight = item.dimensionHeight();
			salesOrderDisputreVBItem.DimensionLength = item.dimensionLength();
			salesOrderDisputreVBItem.DimensionWidth = item.dimensionWidth();
			// ##END: DE24774

			salesOrderDisputeItems.push(salesOrderDisputreVBItem);
		});
		return salesOrderDisputeItems;
	}

	//##START: US21131
	// get the dispute state note in Sales order note object
	private getDisputeStateNote(): ISalesOrderNotes {
		var self = this;

		// Try to get the current user again if first time failed
		if (typeof self.currentUser() === "undefined" || self.currentUser() === null) {
			self.getLoggedInUserDetails();
		}

		var itemNote = new refSalesOrderNotesModel.Models.SalesOrderNoteDetails();

		// For the entity ID will be filled by server
		itemNote.Id = 0;
		itemNote.EntityId = self.salesOrderIdMain();
		itemNote.NotesBy = self.currentUser().FullName;
		itemNote.NotesDate = new Date();
		itemNote.Description = self.disputeStateNote;

		itemNote.NoteTypeName =
		self.internalDisputeStatusId() == refEnums.Enums.DisputeState.MoreDisputeInfoNeeded.ID
		? refEnums.Enums.SalesOrderNotesType.General.Value
		: refEnums.Enums.SalesOrderNotesType.IR.Value;

		itemNote.NotesType =
		self.internalDisputeStatusId() == refEnums.Enums.DisputeState.MoreDisputeInfoNeeded.ID
		? refEnums.Enums.SalesOrderNotesType.General.ID
		: refEnums.Enums.SalesOrderNotesType.IR.ID;

		return itemNote;
	}

	//##END: US21131

	// Converting if date is not valid
	private convertToBookedDate() {
		var self = this;
		if (!self.internalDisputeDate().match('/') && self.internalDisputeDate().length > 0) {
			self.internalDisputeDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.internalDisputeDate()));
		}
	}

	// Converting if date is not valid
	private convertToVBDisputeDate() {
		var self = this;
		if (!self.VBDisputeDate().match('/') && self.VBDisputeDate().length > 0) {
			self.VBDisputeDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.VBDisputeDate()));
		}
	}

	//For add total cost , dispute and pay
	private updateTotalCostPayDisputeAmount() {
		var self = this;

		var totalCost: number = 0.0,
			totalDisputeCost: number = 0.0,
			totalPay: number = 0.0;

		self.DisputeVendorBillItemsModel().forEach(function (item) {
			if (item.cost()) {
				var costWithoutComma = item.cost().toString();
				var check = costWithoutComma.indexOf(",");
				if (check === -1) {
					totalCost += parseFloat(item.cost().toString());
				} else {
					//For removing comma before addition because parseFloat is not taking digit after comma at adding time
					totalCost += parseFloat(costWithoutComma.replace(/,/g, ""));
				}
			}

			if (item.pay()) {
				var costWithoutComma = item.pay().toString();
				var check = costWithoutComma.indexOf(",");
				if (check === -1) {
					totalPay += parseFloat(item.pay().toString());
				} else {
					//For removing comma before addition because parseFloat is not taking digit after comma at adding time
					totalPay += parseFloat(costWithoutComma.replace(/,/g, ""));
				}
			}

			if (item.disputeAmount()) {
				if (item.selectedItemTypeId() == 70 && item.disputeAmount().toString().indexOf('-') < 0) {
					item.disputeAmount(item.disputeAmount());
				}
				var costWithoutComma = item.disputeAmount().toString();
				var check = costWithoutComma.indexOf(",");
				if (check === -1) {
					totalDisputeCost += parseFloat(item.disputeAmount().toString());
				} else {
					//For removing comma before addition because parseFloat is not taking digit after comma at adding time
					totalDisputeCost += parseFloat(costWithoutComma.replace(/,/g, ""));
				}
			}
		});
		//bind all total Cost, pay and dispute
		self.salesOrderTotalCost(totalCost.toFixed(2));
		self.salesOrderTotalPayAmount(totalPay.toFixed(2));
		self.salesOrderTotalDisputeAmount(totalDisputeCost.toFixed(2));
	}

	// function to update line items reason note to dispute note.
	private UpdateDisputeLineItemsDescription() {
		var self = this;
		var updatereasonNotes = '';
		var disputeDescriptionString = '';
		var count = 0;
		self.DisputeVendorBillItemsModel().forEach(function (item) {
			if (typeof (item.reasonNotes()) !== 'undefined' && item.reasonNotes() !== null && item.reasonNotes() !== '') {
				count++;
				updatereasonNotes += item.reasonNotes() + ';'
			 }
			self.disputeNoteString(updatereasonNotes);
		});

		for (var i = 0; i < count; i++) {
			var splittedString = self.disputeNoteString().split(';');
			if (splittedString[i] !== '') {
				disputeDescriptionString += splittedString[i] + ';';
			}
		}

		self.disputeNoteString(disputeDescriptionString);
	}

	/*
	** <createDetails>
	** <id>US25310</id> <by>Shreesha Adiga</by> <date>24-10-2016</date> <description>Method to get the credit reason options for Credit Request popup</description>
	** </createDetails>
	*/
	private getCreditReasonOptions() {
		var self = this;

		self.salesOrderClient.getCreditReasonCodes((data: Array<ICreditReason>) => {
			if (data) {
				self.creditReasonOptions.removeAll();
				self.creditReasonOptions = data;
			}
		});

		var shipmentId = parseInt(self.mainBOLNumber);

		if (shipmentId) {
			self.salesOrderClient.getTotalPendingCreditMemo(shipmentId, (data: any) => {
				if (data) {
					self.totalPendingCreditAmount = data.TotalPendingCreditAmount;
					// ###START: US25679
					self.totalPendingVendorAmount = data.TotalPendingVendorAmount;
					// ###END: US25679
				}
			});
		}
	}

	/*
	** <summary>
	** Get all invoiced SO list except credit memo suborder to show in credit memo popup window
	** </summary>
	** <createDetails>
	** <id>US26559</id> <by>Vasanthakumar</by> <date>02-02-2017</date>
	** </createDetails>
	*/
	private getCreditMemoInvoicedSOList() {
		var self = this;
		self.salesOrderClient.GetAllInvoicedSOExceptCreditMemoSubSO(parseInt(self.mainBOLNumber), (data: Array<IOrderRevenuePair>) => {
			if (data) {
				self.invoicedSOExceptCMSubSo.removeAll();
				self.invoicedSOExceptCMSubSo = data;
			}
		}, (message) => { });
	}

	/*
	** <createDetails>
	** <id>US25310</id> <by>Shreesha Adiga</by> <date>24-10-2016</date> <description>Method to get financial details for Credit Request popup</description>
	** </createDetails>
	*/
	private getDataAndShowCreditRequestPopup(vendorBillId, disputeAmount) {
		var self = this;

		var successCallBack = (data) => {
			if (data) {
				setTimeout(function () {
					self.showRequestCreditPopup(data, disputeAmount)
				}, 2000);
			}
		};

		var failureCallBack = (message) => {

		};

		self.vendorBillClient.getVendorBillFinancialDetailsByVendorBillId(vendorBillId, successCallBack, failureCallBack);
	}

	/*
	** <createDetails>
	** <id>US25310</id> <by>Shreesha Adiga</by> <date>24-10-2016</date> <description>Method to show the Credit Request popup</description>
	** </createDetails>
	** <changeHistory>
	** <id>US26559</id> <by>Vasanthakumar</by> <date>02-02-2017</date> <description>Pass the invoiced SO list to credit memo popup</description>
	** <id>US26575</id> <by>Baldev Singh Thakur</by> <date>03-02-2017</date> <description>Added condition to display BS Cost and appropriate fields if the order attached to the bill is Billing Station.</description>
	** </changeHistory>
	*/
	private showRequestCreditPopup(data: IVendorBillFinancialDetails, disputeAmount) {
		var self = this;

		var onSaveCallback = function () {
			self.creditRequestCallback();
		};
	
		// ###START: US25277
		var creditmemoPopupData = {
			// ###START: US26575
			currentFinalRevenue: data.IsBsCustomer ? data.TotalPLCCost : data.TotalRevenue,
			
			// ###END: US26575
			currentFinalCost: data.ActualCost,
			creditReasons: self.creditReasonOptions,
			selectedCreditReason: refEnums.Enums.CreditReason.DisputeWon.ID,
			shipmentId: parseInt(self.mainBOLNumber),
			totalPendingCreditAmount: self.totalPendingCreditAmount,
			vendorCreditAmount: disputeAmount,
			salesOrderList: self.invoicedSOExceptCMSubSo,
			selectedBolNumber: self.mainBOLNumber,
			// ###START: US26575
			isBSCustomer: data.IsBsCustomer

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
	//#endregion
}

export class DisputeVendorBillDetailsModel {
	salesOrderId: KnockoutObservable<number> = ko.observable(0);
	vendorBillId: KnockoutObservable<number> = ko.observable(0);
	itemId: KnockoutObservable<number> = ko.observable(0);
	proNumber: KnockoutObservable<string> = ko.observable('');
	updatedDate: KnockoutObservable<any> = ko.observable('');
	// Disputed date
	disputedDate: KnockoutObservable<any> = ko.observable('');
	// Disputed amount
	disputedAmount: KnockoutObservable<string> = ko.observable('');
	//##START: US21147
	lateDisputedAmount: KnockoutObservable<number> = ko.observable(0);
	//##END: US21147
	selectedbillStatus: KnockoutObservable<string> = ko.observable('');
	billStatusId: KnockoutObservable<number> = ko.observable(0);
	moveToMasDate: KnockoutObservable<any> = ko.observable('');
	// Dispute Notes
	disputeNotes: KnockoutObservable<string> = ko.observable('');
	internalDisputeNotes: KnockoutObservable<string> = ko.observable('');
	internalDisputeId: KnockoutObservable<number> = ko.observable();
	internalDisputedAmount: KnockoutObservable<number> = ko.observable();
	internalDiputeDate: KnockoutObservable<any> = ko.observable('');
	internalDisputedBy: KnockoutObservable<any> = ko.observable('');
	// ###START: US20352
	internalSelectedDisputedStatusId: KnockoutObservable<number> = ko.observable();
	// ###END: US20352
	carrierCode: KnockoutObservable<string> = ko.observable('');
	CarrierName: KnockoutObservable<string> = ko.observable('');
	disputeWithCarrierUrl: KnockoutObservable<string> = ko.observable('');

	selectedMasClearingStatus: KnockoutObservable<string> = ko.observable('');
	disputedReason: KnockoutObservable<number> = ko.observable();
	isHoldVB: KnockoutObservable<boolean> = ko.observable(false);
	isQuickPay: KnockoutObservable<boolean> = ko.observable(false);
	billStatusList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	reasonCodesList: KnockoutObservableArray<refSalesOrderShipmentRequoteReasonModel.Model.SalesOrderShipmentRequoteReason> = ko.observableArray([]);
	// to hold original Billing status of the bill
	originalBillingStatus: KnockoutObservable<number> = ko.observable(0);
	commonUtils = new Utils.Common()

	// ##START: US21791
	agingDays: number;
	// ##END: US21791

	// ##START: US24865
	disputeCarrierEmailDetailsList: Array<IDisputeCarrierContactEmailAddress> = [];
	// ##END: US24865

	// ###START: DE25119
	isCreditProcessEnable: KnockoutObservable<boolean> = ko.observable(false);
	// ###END: DE25119

	constructor(item: IDisputeVendorBill, salesOrderId: number, internalDisputeNotes: string, internalDisputeId: number, bolNumber: string) {
		var self = this;
		//self. = item.BillStatus;
		self.billStatusId(item.BillStatus);
		self.selectedbillStatus(self.commonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, item.BillStatus.toString()));
		self.proNumber(item.ProNumber);
		self.disputedDate(item.DisputedDate ? self.commonUtils.formatDate(item.DisputedDate.toString(), 'mm/dd/yyyy') : '');
		self.disputedAmount('$' + $.number(item.DisputedAmount, 2));
		//##START: US21147
		self.lateDisputedAmount($.number(item.LateDisputedAmount, 2));
		//##END: US21147
		self.selectedMasClearingStatus(self.commonUtils.getEnumValueById(refEnums.Enums.MasClearanceStatus, item.MasClearanceStatus.toString()));
		self.disputeNotes(item.DisputeNotes);
		self.vendorBillId(item.VendorBillId);
		self.salesOrderId(salesOrderId);
		self.internalDisputeId(internalDisputeId);
		self.internalDisputeNotes(internalDisputeNotes);
		self.billStatusList(item.ListOfBillStatuses);
		self.moveToMasDate(item.MasTransferDate);
		// ###START: US20352
		self.internalSelectedDisputedStatusId(item.DisputeStatusId);
		// ###END: US20352
		// ###START: US20687
		self.carrierCode(item.CarrierCode);
		self.CarrierName(item.CarrierName);
		// ###END: US20687
		self.originalBillingStatus(item.OriginalBillStatus);
		if (item.QuickPay) {
			self.isQuickPay(true);
		}
		if (item.HoldVendorBill) {
			self.isHoldVB(true);
		}
		self.updatedDate(item.UpdatedDate);

		self.reasonCodesList.removeAll();
		item.ReasonCodes.forEach(function (reasonCodeItem) {
			self.reasonCodesList.push(new refSalesOrderShipmentRequoteReasonModel.Model.SalesOrderShipmentRequoteReason(reasonCodeItem));
		});
		// ###START: US20687
		var url = Utils.Constants.DisputeCarrierContactToolUrl + '?bol=' + bolNumber + '&SCAC=' + self.carrierCode() + '&ProNo=' + self.proNumber() + '&ShipmentId=' + self.salesOrderId() + '&CarrierName=' + self.CarrierName();
		self.disputeWithCarrierUrl(encodeURI(url));
		// ###END: US20687

		// ##START: US21791
		self.agingDays = item.AgingDays;
		// ##END: US21791

		// ##START: US24865
		self.disputeCarrierEmailDetailsList = item.DisputeCarrierEmailDetailsList;
		// ##END: US24865
		// ###START: DE25119
		self.isCreditProcessEnable(item.IsCreditProcessEnable);
		// ###END: DE25119

		return self;
	}

	// Cleans up the view model properties
	public cleanup() {
		var self = this;

		for (var property in self) {
			if (property != "cleanup")
				delete self[property];
		}

		delete self;
	}
}

export class DisputeVendorBillItemsModel {
	id: KnockoutObservable<number> = ko.observable();
	item: KnockoutObservable<string> = ko.observable('');
	selectedItemTypeId: KnockoutObservable<number> = ko.observable();
	description: KnockoutObservable<string> = ko.observable('');
	disputedDate: KnockoutObservable<any> = ko.observable('');
	cost: KnockoutObservable<number> = ko.observable(0);
	pay: KnockoutObservable<number> = ko.observable(0);
	disputeAmount: KnockoutObservable<number> = ko.observable(0);
	// ##START: DE23995
	disputeLostAmount: KnockoutObservable<number> = ko.observable(0);
	// ##END: DE23995
	reasonNotes: KnockoutObservable<any> = ko.observable('');
	reasonCodesListFoBinding: KnockoutObservableArray<refSalesOrderShipmentRequoteReasonModel.Model.SalesOrderShipmentRequoteReason> = ko.observableArray([]);
	selectedReasonCode: KnockoutObservable<ISalesOrderShipmentRequoteReason> = ko.observable();
	commonUtils = new Utils.Common()
	errorDisputeVendorItemDetail: KnockoutValidationGroup;
	lineItemIsInvalid: KnockoutObservable<boolean> = ko.observable(false);
	shippingAndDiscountCost: KnockoutObservable<any> = ko.observable();
	//##START: DE22259
	accessorialId: KnockoutObservable<number> = ko.observable();
	//##END: DE22259

	// ##START: DE24774
	selectedClassType: KnockoutObservable<number> = ko.observable();
	weight: KnockoutObservable<number> = ko.observable();
	packageName: KnockoutObservable<string> = ko.observable();
	pieceCount: KnockoutObservable<number> = ko.observable();

	dimensionLength: KnockoutObservable<number> = ko.observable();
	dimensionWidth: KnockoutObservable<number> = ko.observable();
	dimensionHeight: KnockoutObservable<number> = ko.observable();
	// ##END: DE24774

	constructor(selectedItem: IShipmentItemType, item: IVendorBillItem, lineDisputeValueChanged: () => any, reasonCodes: any, reasonNotesModifiedCallBack: () => any, totalShippingAndDiscountCost?: number) {
		var self = this;
		self.id(item.Id);
		self.item(selectedItem ? selectedItem.LongDescription : '');
		self.selectedItemTypeId(item.ItemId);
		self.description(item.UserDescription);
		//##START: DE22259
		self.accessorialId(selectedItem ? selectedItem.AccessorialId : 0);
		//##END: DE22259
		self.cost($.number(item.Cost, 2));

		self.disputeAmount($.number(item.DisputeAmount, 2));
		// ##START: DE23995
		self.disputeLostAmount($.number(item.DisputeLostAmount, 2));
		// ##END: DE23995

		// ##START: DE24774
		self.selectedClassType(item.SelectedClassType);
		self.weight(item.Weight);
		self.packageName(item.PackageTypeName);
		self.pieceCount(item.PieceCount);
		self.dimensionHeight(item.DimensionHeight);
		self.dimensionLength(item.DimensionLength);
		self.dimensionWidth(item.DimensionWidth);
		// ##END: DE24774

		if (totalShippingAndDiscountCost !== 0) {
			self.shippingAndDiscountCost(($.number((totalShippingAndDiscountCost), 2)).replace(/,/g, ""));
		}

		var DisputeAmountWithoutComma;

		if (item.DisputeAmount !== null && item.DisputeAmount !== undefined && item.DisputeAmount !== 0.00) {
			DisputeAmountWithoutComma = parseFloat(item.DisputeAmount.toString().replace(/,/g, ""));
			var payLoadingAmount = item.Cost - +DisputeAmountWithoutComma;
		} else {
			DisputeAmountWithoutComma = item.DisputeAmount;
		}

		if (item.ItemId === 70) {
			var payLoadingAmount = item.Cost - (-DisputeAmountWithoutComma);
			self.pay($.number(payLoadingAmount, 2));
		} else {
			var payLoadingAmount = item.Cost - DisputeAmountWithoutComma;
			self.pay($.number(payLoadingAmount, 2));
		}

		//self.reasonNotes(item.ReasonNote);

		self.reasonCodesListFoBinding.removeAll();

		reasonCodes.forEach(function (reasonCodeItem) {
			self.reasonCodesListFoBinding.push(new refSalesOrderShipmentRequoteReasonModel.Model.SalesOrderShipmentRequoteReason(reasonCodeItem));
		});

		if (item.SelectedReasonCodes !== null && item.SelectedReasonCodes !== undefined) {
			var selectedReasonCodeItem = $.grep(self.reasonCodesListFoBinding(), function (e) { return e.Remarks === item.SelectedReasonCodes.Remarks; })[0];
			self.selectedReasonCode(selectedReasonCodeItem);
		}

		self.reasonNotes(item.ReasonNote);

		self.disputeAmount.subscribe(() => {
			if (typeof (lineDisputeValueChanged) === 'function') {
				var lineDisputeAmountWithOutComma;
				// ###START: DE20630
				// remove comma from the entered amount if there is any.
				if (self.disputeAmount() !== null && self.disputeAmount() !== undefined && self.disputeAmount() !== 0.00 && self.disputeAmount().toString() !== '') {
					lineDisputeAmountWithOutComma = parseFloat(self.disputeAmount().toString().replace(/,/g, ""));
				} else {
					lineDisputeAmountWithOutComma = "0.00";
				}
				// ###END: DE20630

				if (self.selectedItemTypeId() && self.selectedItemTypeId() === 70) {
					var pay = (+item.Cost) - (+lineDisputeAmountWithOutComma * -1);
					self.pay($.number(pay, 2));
				} else {
					var pay = (+item.Cost) - (+lineDisputeAmountWithOutComma);
					self.pay($.number(pay, 2));
				}

				lineDisputeValueChanged();
			}
		});

		self.reasonNotes.subscribe(() => {
			if (typeof (reasonNotesModifiedCallBack) === 'function') {
				reasonNotesModifiedCallBack();
			}
		});

		self.errorDisputeVendorItemDetail = ko.validatedObservable({
			disputeAmount: self.disputeAmount
		});

		self.disputeAmount.extend({
			max: {
				params: 1,
				message: 'Dispute amount should not be greater than cost.',
				onlyIf: () => {
					var result;
					if (self.selectedItemTypeId() && self.selectedItemTypeId() === 70) {
						result = (self.cost() != null && self.disputeAmount() != null && (Number(parseFloat(self.cost().toString().replace(/,/g, "")) * -1) < parseFloat(self.disputeAmount().toString().replace(/,/g, ""))));
						self.lineItemIsInvalid(result);
						return (result);
					} else if (self.selectedItemTypeId() && self.selectedItemTypeId() === 10) {
						result = (self.shippingAndDiscountCost() != null && self.disputeAmount() != null && (parseFloat(self.shippingAndDiscountCost().toString().replace(/,/g, "")) < parseFloat(self.disputeAmount().toString().replace(/,/g, ""))));
						self.lineItemIsInvalid(result);
						return (result);
					}
					else {
						result = (self.cost() != null && self.disputeAmount() != null && (parseFloat(self.cost().toString().replace(/,/g, "")) < parseFloat(self.disputeAmount().toString().replace(/,/g, ""))));
						self.lineItemIsInvalid(result);
						return (result);
					}
				}
			},
			number: true
		});

		return self;
	}

	// Cleans up the view model properties
	public cleanup() {
		var self = this;

		self.reasonCodesListFoBinding.removeAll();
		self.disputeAmount.extend({ validatable: false });

		for (var property in self) {
			if (property != "cleanup")
				delete self[property];
		}

		delete self;
	}
}