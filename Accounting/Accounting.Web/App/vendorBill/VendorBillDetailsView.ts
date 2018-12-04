/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
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
import refVendorBillOptionButtonControl = require('vendorBill/VendorBillOptionButtonControl');
import refVendorNameSearchControl = require('templates/searchVendorNameControl');
import refVendorBillAddress = require('services/models/vendorBill/VendorBillAddress');
import refVendorBillClient = require('services/client/VendorBillClient');
import refMapLocation = require('services/models/common/MapLocation');
import refEnums = require('services/models/common/Enums');
import refVendorNameSearch = require('services/models/common/searchVendorName');
import refValidations = require('services/validations/Validations');
import refCommon = require('services/client/CommonClient');
//#endregion

/*
** <summary>
** VendorBill  details View Model.
** </summary>
** <createDetails>
** <id>US8214</id> <by>Satish</by> <date>27th May, 2014</date>
** </createDetails>
** <changeHistory>
** <id>US9669</id> <by>Achal Rastogi</by> <date>6-3-2014</date>
** <id>DE21749</id> <by>Chandan Singh Bajetha</by> <date>08-02-2016</date> <description>Disable the Status drop down when user directly updates the bill status to Dispute Short Paid from any status other than Dispute</description>
** <id>US20585</id> <by>Chandan Singh Bajetha</by> <date>11-02-2016</date> <description>Acct: Capture history for Dispute Notes Status</description>
** <id>US21146</id> <by>Shreesha Adiga</by> <date>15-03-2016</date> <description>If bill status is overcharge claim, then enable bill status dropdown</description>
** <id>US22419</id> <by>Shreesha Adiga</by> <date>30-05-2016</date> <description>Added Factor Company and MAS vendor ID to details view</description>
** <id>US22956</id> <by>Shreesha Adiga</by> <date>23-06-2016</date> <description>Added UVB Ownership to VendorBill Details View</description>
** <id>US23124</id> <by>Janakiram</by> <date>04-07-2016</date><description>Added variable to assign Vendor bill memo </description>
** <id>DE23466</id> <by>Baldev Singh Thakur</by> <date>12-07-2016</date><description>Added logic to disable the bill status drop down, whenever user saves the bill status to Overcharge Won/Overcharge Loss</description>
** <id>DE24130</id> <by>Baldev Singh Thakur</by> <date>16-09-2016</date><description>Added an else condition to unselect the Hold Vendor Bill When the Bill is in no more in hold state.</description>
** <id>US37137</id> <by>Shreesha Adiga</by> <date>13-06-2018</date><description>Add validation to BOLNumber: Allow only main BOLNumber</description>
** </changeHistory>
*/
export class VendorBillDetailsViewModel {
	//#region Members

	// client command
	vendorBillClient: refVendorBillClient.VendorBillClient = new refVendorBillClient.VendorBillClient();
	public listCheck: KnockoutObservableArray<boolean>
	vendorNameSearchList: refVendorNameSearchControl.SearchVendorNameControl;
	carrierId: KnockoutComputed<number>;
	vendorName: KnockoutComputed<string>;
	//##START: US22419
	factorCompany: KnockoutObservable<string> = ko.observable('');
	masVendorId: KnockoutObservable<string> = ko.observable('');
	//##END: US22419
	proNumber: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Pro Number is required." } });
	billDate: KnockoutObservable<any> = ko.observable('').extend({ required: { message: " A valid Bill Date is required" } });
	originZip: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Original ZIP is required." } });
	destinationZip: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Destination ZIP is required." } });
	bolNumber: KnockoutObservable<string> = ko.observable('');
	poNumber: KnockoutObservable<string> = ko.observable('');
	mainBolNumber: KnockoutObservable<string> = ko.observable('');
	refNumber: KnockoutObservable<string> = ko.observable('');
	totalPieces: KnockoutObservable<number> = ko.observable();
	totalWeigth: KnockoutObservable<number> = ko.observable();
	totalCost: KnockoutObservable<number> = ko.observable();
	vendorAmount: KnockoutObservable<string> = ko.observable('');
	deliveryDate: KnockoutObservable<any> = ko.observable('');
	memo: KnockoutObservable<string> = ko.observable('');
	// ###START: US23124
	MemoexistingValue: KnockoutObservable<string> = ko.observable('');
	// ###END: US23124
	billStatusList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	masClearingStatusList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	selectedbillStatus: KnockoutObservable<number> = ko.observable();
	selectedMasClearingStatus: KnockoutObservable<number> = ko.observable();
	orginalMasClearingStatus: KnockoutObservable<number> = ko.observable();
	obcvendorBillOptionList: refVendorBillOptionButtonControl.VendorBillOptionButtonControl;
	totalRevenue: KnockoutObservable<number> = ko.observable();
	actualCost: KnockoutObservable<number> = ko.observable();
	actualProfit: KnockoutObservable<number> = ko.observable();
	pickupDate: KnockoutObservable<any> = ko.observable('');
	dueDate: KnockoutObservable<any> = ko.observable('');
	moveToMasDate: KnockoutObservable<any> = ko.observable('');
	isMasClearingStatusVisible: KnockoutObservable<boolean> = ko.observable(false);
	isViewOnly: KnockoutObservable<boolean> = ko.observable(false);
	datepickerOptions: DatepickerOptions;
	CommonUtils: CommonStatic = new Utils.Common();
	error: KnockoutValidationErrors;
	isValidationShown: boolean = false;
	shipperAddressCallback: (shipperAddress: IVendorBillAddress) => any;
	consigneeAddressCallback: (consigneeAddress: IVendorBillAddress) => any;
	isBolNo: boolean = false;
	isProNo: boolean = false;
	isVendor: boolean = false;
	isFroceAttachChecked: boolean = false;
	//For Validation purpose
	errorVendorDetail: KnockoutValidationGroup;
	isNotAtLoadingTime: boolean = false;
	isBolEnable: KnockoutObservable<boolean> = ko.observable(false);
	//Function
	isNumber: (that, event) => void;
	isAlphaNumericSpace: (that, event) => void;

	// Vendor Bill id (primary key in db)
	vendorBillId: KnockoutObservable<number> = ko.observable(0);

	//for tracking change
	getBITrackChange: () => string[];
	isBIDirty: KnockoutComputed<boolean>;
	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	returnValueFlag: boolean = false;
	ischange: boolean = false;
	//isChange: KnockoutObservable<boolean> = ko.observable(false);
	// To identufy SubBill
	isNewSubBill: KnockoutObservable<boolean> = ko.observable(false);

	isBillStatusPendig: KnockoutObservable<boolean> = ko.observable(false);

	//#region Dispute Related Data
	// Disputed amount
	disputedAmount: KnockoutObservable<string> = ko.observable('');
	// Disputed date
	disputedDate: KnockoutObservable<any> = ko.observable(' ');
	// Dispute Notes
	disputeNotes: KnockoutObservable<string> = ko.observable('');

	// isDisputeSectionValidation
	isValidationApplicableOnDisputeItems: KnockoutObservable<boolean> = ko.observable(false);
	//#endregion Dispute Related Data

	// It is used for checking BOlNo is new or old
	originalBolNumber: string;
	// It is used for checking PRO is new or old
	originalProNumber: string;
	// It is used for checking that if bill status is changed short paid to re quote.
	originalBillStatus: number;
	// SalesOrderid (Order id which is attached to Vendor Bill)
	salesOrderId: number;
	// Set visibility of ForcePushToMas Button
	isBillForcePushToMas: KnockoutObservable<boolean> = ko.observable(false);
	// To check the negative margin
	originalVendorAmount: number;
	// Updated date
	updatedDate: number;
	// test box width with error and without error
	errorWidth: KnockoutObservable<string> = ko.observable('86.3%');//86-86.3
	normalWidth: KnockoutObservable<string> = ko.observable('72.6%');//89-72.6
	normalWidthForZip: KnockoutObservable<string> = ko.observable('93%');
	mainSalesOrderId: number;

	// to keep processFlow for getting customer is I term or T term
	processFlow: number;

	//## To trigger when when 'TAB' press from reference number.
	keyListenerCallback: () => any;

	//## To trigger when when 'TAB' press from reference number.
	isTabPress: (that, event) => void;

	// To trigger when bill status is dispute
	onChangeBillStatusCallBack: (isDisputeStatus: boolean, isDisputeLostStatus: boolean) => any;

	// To trigger when bill status is dispute

	// Flag to check whether items dispute amount is editable or not?
	isItemsDisputeAmountEditable: KnockoutObservable<boolean> = ko.observable(false);

	// Flag to check whether items dispute lost amount is editable or not?
	isItemsDisputeLostAmountEditable: KnockoutObservable<boolean> = ko.observable(false);

	// Flag to check whether items dispute note section is editable or not?
	isDisputeSectionEditable: KnockoutObservable<boolean> = ko.observable(false);

	// Flag to enable or disable the controls in Vendor Details Section
	isEnable: KnockoutObservable<boolean> = ko.observable(true);

	createdDate: KnockoutObservable<any> = ko.observable('');

	disposables: Array<any> = [];

	// ###START: US20585
	disputeStatusId: KnockoutObservable<number> = ko.observable(0);
	// ###END: US20585

	isLostBill: KnockoutObservable<boolean> = ko.observable(false);

	// ##START: US22956
	uvbOwnershipList: KnockoutObservableArray<IUVBOwnership> = ko.observableArray([]);
	uvbOwnership: KnockoutObservable<number> = ko.observable(0);
	// ##END: US22956
	//#endregion

	//#region Constructor
	constructor(shipperAddressCallback: (shipperAddress: IVendorBillAddress) => any, consigneeAddressCallback: (consigneeAddress: IVendorBillAddress) => any, keyListenerCallback: () => any, onChangeBillStatusCallBack?: (isDisputeStatus: boolean, isDisputeLostStatus: boolean) => any) {
		var self = this;
		var msg = null;
		self.shipperAddressCallback = shipperAddressCallback;
		self.consigneeAddressCallback = consigneeAddressCallback;
		//## when user pressed 'TAB' from MEMO then expand address view.
		self.keyListenerCallback = keyListenerCallback;
		self.vendorNameSearchList = new refVendorNameSearchControl.SearchVendorNameControl("A valid Vendor Name is required.", '93%', '90.5%', true);
		self.error = ko.validation.group(self, { deep: true });
		self.onChangeBillStatusCallBack = onChangeBillStatusCallBack;

		// ##START: US22956
		// Load all uvb ownership items
		if (typeof self.uvbOwnershipList() !== "undefined" && self.uvbOwnershipList() !== null && self.uvbOwnershipList().length === 0) {
			_app.trigger("GetUVBOwnershipList", function (data) {
				if (data) {
					self.uvbOwnershipList.removeAll();
					self.uvbOwnershipList.push.apply(self.uvbOwnershipList, data);
				}
			});
		}
		// ##END: US22956

		//#region Date Validation
		self.billDate = ko.observable().extend({
			required: {
				message: 'Bill date is required.'
			},

			validation: {
				validator: function () { return refValidations.Validations.isValidDate(self.billDate(), self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "BillDate"); },
				message: 'Not a valid date'
			}
		});
		//#endregion

		//#region Validation only if dispute is selected
		self.disputedAmount.extend({
			required: {
				message: ApplicationMessages.Messages.ValidDisputeAmountRequired,
				onlyIf: () => {
					return (self.isValidationApplicableOnDisputeItems());
				}
			},
			number: true,
			min: {
				params: 1,
				message: ApplicationMessages.Messages.ValidDisputeAmountRequired,
				onlyIf: () => {
					return (self.isValidationApplicableOnDisputeItems());
				}
			}
		});

		self.disputedDate.extend({
			required: {
				message: ApplicationMessages.Messages.ValidDisputeDateRequired,
				onlyIf: () => {
					return (self.isValidationApplicableOnDisputeItems());
				}
			},

			validation: {
				validator: () => {
					if (self.isValidationApplicableOnDisputeItems()) {
						return (refValidations.Validations.isValidDate(self.disputedDate(), self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "DisputeDate"));
					}
					else {
						return true;
					}
				},
				message: 'Not a valid date'
			}
		});

		self.disputeNotes.extend({
			required: {
				message: ApplicationMessages.Messages.ValidDisputeNotesRequired,
				onlyIf: () => {
					// ###START: DE21749
					return (self.isValidationApplicableOnDisputeItems() && self.selectedbillStatus() !== 7); // self.selectedbillStatus() !== 9 &&
					// ###END: DE21749
				}
			}
		});

		self.bolNumber.extend({
			number: {
				params: true,
				message: ApplicationMessages.Messages.SubOrderCantBeAttachedBill
			}
		});

		//#endregion

		//track changes
		self.SetBITrackChange(self);

		self.getBITrackChange = () => {
			return Utils.getDirtyItems(self);
		};

		self.disposables.push(self.isBIDirty = ko.computed(() => {
			var result = self.proNumber();
			result = self.bolNumber();
			result = self.billDate();
			result = self.poNumber();
			result = self.mainBolNumber();
			result = self.refNumber();
			result = self.pickupDate();
			result = self.deliveryDate();
			result = self.disputedDate();
			result = self.disputeNotes();
			result = self.vendorNameSearchList.vendorName();
			result = self.memo();
			result = self.originZip();
			result = self.destinationZip();
			var result1 = self.selectedbillStatus();
			var result2 = self.selectedMasClearingStatus();
			result1 = parseFloat(self.disputedAmount());

			// If this from loading data side the return as false
			if (self.isNotAtLoadingTime)
				return false;

			var returnValue = self.getBITrackChange().length > 0 ? true : false;
			self.returnValueFlag = returnValue;
			if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
				self.onChangesMade(returnValue);

			return returnValue;
		}));

		//to check if BOL exists if yes then fetch the detail
		self.disposables.push(self.bolNumber.subscribe((newValue) => {
			if (!self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.bolNumber())
				|| !self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.proNumber())) {
				self.obcvendorBillOptionList.isForceAttachChecked = false;
				self.obcvendorBillOptionList.getOptionsById(2).selected(false);
			} else {
				self.obcvendorBillOptionList.isForceAttachChecked = true;
			}

			if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.bolNumber())) {
				self.bolNumber(self.bolNumber().trim());

				// Gets the details to validate the PRO, PO and BOL
				self.vendorBillClient.searchSalesOrderByBOL(self.proNumber(), self.carrierId(), newValue, self.vendorBillId(), (data: ISalesOrderDetails) => {
					if (data != null && data.CheckList.length > 0) {
						self.listCheck = ko.observableArray();
						self.listCheck.push(data.CheckList[0]);
						self.listCheck.push(data.CheckList[1]);
						self.listCheck.push(data.CheckList[2]);

						self.isProNo = data.CheckList[0];
						self.isBolNo = data.CheckList[1];
						self.isVendor = data.CheckList[2];
					}

					// If not a new BOL number then only update the address other wise keep the same address as in the vendor bill.
					if (self.bolNumber().trim() !== self.originalBolNumber) {
						if (data != null && data.Addresses.length > 0) {
							ko.utils.arrayForEach(data.Addresses, (address) => {
								if (address.AddressType === refEnums.Enums.AddressType.Origin.ID) {
									self.shipperAddressCallback(address);
								} else if (address.AddressType === refEnums.Enums.AddressType.Destination.ID) {
									self.consigneeAddressCallback(address);
								} else {
								}
								self.salesOrderId = address.SalesOrderId;
							});

							self.mainSalesOrderId = self.salesOrderId;
						}
					}
					else {
						self.salesOrderId = self.mainSalesOrderId;
					}
				});
			}
			else { // If BOL is cleared
				self.salesOrderId = 0;
			}
		}));

		//to check if BOL exists if yes then fetch the detail
		self.disposables.push(self.proNumber.subscribe((newValue) => {
			if (!self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.bolNumber())
				|| !self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.proNumber())) {
				self.obcvendorBillOptionList.isForceAttachChecked = false;
				self.obcvendorBillOptionList.getOptionsById(2).selected(false);
			} else {
				self.obcvendorBillOptionList.isForceAttachChecked = true;
			}

			var bolNo = self.bolNumber();
			if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.proNumber())) {
				if (self.proNumber().trim() !== self.originalProNumber) {
					if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.bolNumber())) {
						if (self.bolNumber().trim() === self.originalBolNumber) {
							//checking only the PRO exists so we will not be passing the BOL#
							bolNo = "";
						}
					}
					self.vendorBillClient.searchSalesOrderByBOL(newValue, self.carrierId(), bolNo, self.vendorBillId(), (data: Array<IVendorBillAddress>) => {
						self.listCheck = ko.observableArray();
						self.listCheck.push(self.isProNo);
						self.listCheck.push(self.isBolNo);
						self.listCheck.push(self.isVendor);

						if (data != null && data.length > 0) {
							ko.utils.arrayForEach(data, (address) => {
								if (address.AddressType === refEnums.Enums.AddressType.Origin.ID) {
									self.shipperAddressCallback(address);
								} else if (address.AddressType === 2) {
									self.consigneeAddressCallback(address);
								} else {
								}
							});
						}
					});
				}
			}
		}));

		//To initialize the dates
		self.billDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
		self.deliveryDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
		self.pickupDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));

		//To set The date picker options
		self.datepickerOptions = {
			blockWeekend: true,
			blockPreviousDays: false,
			blockHolidaysDays: true,
			autoClose: true,
			placeBelowButton: false,
			endDate: new Date()
		};

		//#region Error Details Object
		self.errorVendorDetail = ko.validatedObservable({
			vendorNameSearchList: self.vendorNameSearchList,
			proNumber: self.proNumber,
			bolNumber: self.bolNumber,
			billDate: self.billDate,
			originZip: self.originZip,
			destinationZip: self.destinationZip,
			disputedAmount: self.disputedAmount,
			disputedDate: self.disputedDate,
			disputeNotes: self.disputeNotes
		});

		//#endregion

		//To set the checkbox bill option values
		var vendorBillOptionListOptions: Array<IButtonControlOption> = [{ id: refEnums.Enums.vendorBillOptionConstant.MakeInactive, name: 'Make Inactive', selected: false }, { id: refEnums.Enums.vendorBillOptionConstant.Quickpay, name: 'Quick Pay', selected: false }, { id: refEnums.Enums.vendorBillOptionConstant.FroceAttach, name: 'Force Attach', selected: false }, { id: refEnums.Enums.vendorBillOptionConstant.HoldVendorBill, name: 'Hold Vendor Bill', selected: false }];

		//set checkbox property
		var argsvendorBillOptionList: IOptionButtonControlArgs = {
			options: vendorBillOptionListOptions,
			useHtmlBinding: true,
			isMultiCheck: true,
			isVerticalView: false,
			enabled: self.isEnable()
		}

		self.obcvendorBillOptionList = new refVendorBillOptionButtonControl.VendorBillOptionButtonControl(argsvendorBillOptionList, refEnums.Enums.OptionButtonsView.Vertical);

		//To check if enter value is digit and decimal
		self.isNumber = function (data, event) {
			var charCode = (event.which) ? event.which : event.keyCode;

			//to allow copy in firefox
			if (event.ctrlKey && (charCode == 99 || charCode == 67)) {
				return true;
			}
			if ((charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57))) {
				return false;
			}
			return true;
		}

		//To check if enter value is Alpha Numeric and Space
		self.isAlphaNumericSpace = function (data, event) {
			var charCode = (event.which) ? event.which : event.keyCode;

			if ((charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122))) {
				return false;
			}
			return true;
		}

		// to get the carrierId after selecting vendor/ Carrier
		self.disposables.push(self.carrierId = ko.computed(function () {
			if (self.vendorNameSearchList.name() != null)
				return self.vendorNameSearchList.ID();

			return 0;
		}));

		// to get the vendor Name after selecting vendor
		self.disposables.push(self.vendorName = ko.computed(function () {
			if (self.vendorNameSearchList.name() != null)
				return self.vendorNameSearchList.vendorName();

			return null;
		}));

		self.disposables.push(self.selectedbillStatus.subscribe(() => {
			// Set the validation of dispute items true only if status is dispute whether it is I term customer or T term customer
			//if (self.selectedbillStatus() === refEnums.Enums.VendorBillStatus.Dispute.ID) {
			//	self.onChangeBillStatusCallBack(true);
			//	self.isValidationApplicableOnDisputeItems(true);
			//	self.isItemsDisputeAmountEditable(true);
			//} else {
			//	self.onChangeBillStatusCallBack(false);
			//	self.isValidationApplicableOnDisputeItems(false);
			//	self.isItemsDisputeAmountEditable(false);
			//}

			if (self.selectedbillStatus() === refEnums.Enums.VendorBillStatus.Dispute.ID || self.selectedbillStatus() === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID || self.selectedbillStatus() === refEnums.Enums.VendorBillStatus.DisputeWon.ID) {
				self.onChangeBillStatusCallBack(true, false);
				self.isValidationApplicableOnDisputeItems(true);
				self.isItemsDisputeAmountEditable(true);
				// self.isItemsDisputeLostAmountEditable(false);
			}
			else if (self.selectedbillStatus() === refEnums.Enums.VendorBillStatus.DisputeLost.ID) {
				self.onChangeBillStatusCallBack(false, true);
				self.isValidationApplicableOnDisputeItems(false);
				// self.isItemsDisputeAmountEditable(false);
				// self.isItemsDisputeLostAmountEditable(true);
			}
			else {
				self.onChangeBillStatusCallBack(false, false);
				self.isValidationApplicableOnDisputeItems(false);
				//  self.isItemsDisputeAmountEditable(false);
				// self.isItemsDisputeLostAmountEditable(false);
			}

			// ###START: DE21749
			if (self.selectedbillStatus() === refEnums.Enums.VendorBillStatus.Dispute.ID || self.selectedbillStatus() === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID) {
				// ###END: DE21749
				self.isDisputeSectionEditable(true);
				if (self.disputedDate() === undefined || self.disputedDate() === null || self.disputedDate() === "") {
					self.disputedDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
				}
			}
			else {
				self.isDisputeSectionEditable(false);
			}
		}));

		//## when user pressed 'TAB' from MEMO expand address view.
		self.isTabPress = (data, event) => {
			var charCode = (event.which) ? event.which : event.keyCode;

			if ((charCode === 9)) { //if 'TAB' press.
				self.keyListenerCallback();
			}
			return true;
		}
		self.disposables.push(self.memo.subscribe(newValue=> {
			if (self.memo() !== null && self.memo().length >= 100) {
				var memo = self.memo().substr(0, 98);
				self.memo(memo);
			}
			// ###START: US23124
			if (self.memo() !== null && self.memo().length >= 100) {
				self.ischange = true;
			}
			// ###END: US23124
		}));
	}
	//#endregion

	//#region Internal Methods
	// Action handler of ForcePushtoMas
	public onForcePushToMas() {
		var self = this;
		var selecetedList = self.obcvendorBillOptionList.getSelectedOptions(true);
		selecetedList.forEach((item) => {
			if (item.id === refEnums.Enums.vendorBillOptionConstant.HoldVendorBill) {
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 15,
					fadeOut: 15,
					typeOfAlert: "",
					title: ""
				}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.ForcePushToMasValidationMessage, "info", null, toastrOptions);
			}
		});

		// To enable save button.
		if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
			self.ischange = true;
		self.onChangesMade(true);
	}

	// initialize vendor bill details
	public initializeVendorBillDetails(vendorBill: IVendorBill, isNewSubBill: boolean, isDisputeAmountEditable?: boolean, isDisputeLostAmountEditable?: boolean, isDisputeSectionEditable?: boolean, isViewOnly?: boolean, isSubBill?: boolean, isEnable?: boolean, isLostBill?: boolean) {
		var self = this;
		// This will prevent to detect the changes at first time
		self.isNotAtLoadingTime = true;
		self.vendorNameSearchList.isNotAtLoadingTime = true;
		if (vendorBill != null) {
			self.BindMasClearanceStatuses(vendorBill);
			self.orginalMasClearingStatus(self.selectedMasClearingStatus());
			if (vendorBill.ProcessFlow == 1) {
				self.isMasClearingStatusVisible(true);
			}
			else {
				self.isMasClearingStatusVisible(false);
			}
			self.isEnable(!isEnable);
			self.vendorNameSearchList.name(new refVendorNameSearch.Models.VendorNameSearch());
			self.vendorNameSearchList.ID(vendorBill.CarrierId);
			self.vendorNameSearchList.carrierType(vendorBill.CarrierType);
			self.vendorNameSearchList.vendorName(vendorBill.VendorName);
			self.vendorNameSearchList.isSubBillOrder(!isSubBill);
			self.vendorBillId(vendorBill.VendorBillId);
			self.originalProNumber = vendorBill.ProNumber != 'null' ? vendorBill.ProNumber : '';
			self.originalBolNumber = vendorBill.BolNumber != 'null' ? vendorBill.BolNumber : '';
			self.originalBillStatus = vendorBill.BillStatus;
			self.originalVendorAmount = vendorBill.Amount;
			self.proNumber(vendorBill.ProNumber != 'null' ? vendorBill.ProNumber : '');
			self.bolNumber(vendorBill.BolNumber != 'null' ? vendorBill.BolNumber : '');
			if (vendorBill.BillStatus == refEnums.Enums.VendorBillStatus.Cleared.ID) {
				self.isBolEnable(false);
			}
			else if ((vendorBill.BillStatus == refEnums.Enums.VendorBillStatus.Pending.ID) || (vendorBill.BillStatus == refEnums.Enums.VendorBillStatus.Requote.ID) || (vendorBill.BillStatus == refEnums.Enums.VendorBillStatus.ManualAudit.ID)) {
				self.isBolEnable(true);
			}
			self.billDate(vendorBill.BillDate ? self.CommonUtils.formatDate(vendorBill.BillDate.toString(), 'mm/dd/yyyy') : self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
			self.deliveryDate(vendorBill.DeliveryDate ? self.CommonUtils.formatDate(vendorBill.DeliveryDate.toString(), 'mm/dd/yyyy') : '');
			self.pickupDate(vendorBill.PickupDate ? self.CommonUtils.formatDate(vendorBill.PickupDate.toString(), 'mm/dd/yyyy') : '');
			self.poNumber(vendorBill.PoNumber != 'null' ? vendorBill.PoNumber : '');
			self.mainBolNumber(vendorBill.MainVendorBolNumber != 'null' ? vendorBill.MainVendorBolNumber : '');
			self.refNumber(vendorBill.ReferenceNumber != 'null' ? vendorBill.ReferenceNumber : '');
			self.totalPieces(vendorBill.TotalPieces);
			self.totalWeigth(vendorBill.TotalWeight);
			self.memo(vendorBill.Memo != 'null' ? vendorBill.Memo : '');
			// ###START: US23124
			self.MemoexistingValue(vendorBill.Memo != null ? vendorBill.Memo : '');
			// ###END: US23124
			self.dueDate(vendorBill.DueDate ? self.CommonUtils.formatDate(vendorBill.DueDate.toString(), 'mm/dd/yyyy') : '');
			//self.totalCost($.number((vendorBill.TotalCost), 2));
			//self.totalRevenue($.number((vendorBill.TotalRevenue), 2));
			//actual cost should be subtraction of total cost and dispute DE13278(Apollo 10.13)
			//var newActualCost = vendorBill.ActualCost;
			//self.actualCost($.number((newActualCost), 2));
			//self.actualCost($.number((vendorBill.ActualCost), 2));
			//self.actualProfit($.number((vendorBill.ActualProfit), 2));
			self.vendorAmount($.number((vendorBill.Amount), 2));
			self.disputedAmount($.number((vendorBill.DisputedAmount), 2));
			self.disputedDate(vendorBill.DisputedDate ? self.CommonUtils.formatDate(vendorBill.DisputedDate.toString(), 'mm/dd/yyyy') : '');
			self.disputeNotes(vendorBill.DisputeNotes != 'null' ? vendorBill.DisputeNotes : '');
			self.salesOrderId = vendorBill.SalesOrderId;
			self.mainSalesOrderId = vendorBill.SalesOrderId;
			self.isBillForcePushToMas(vendorBill.IsBillForcePushToMas);
			self.updatedDate = vendorBill.UpdatedDate;

			// ##START: US22419
			self.factorCompany(vendorBill.FactorVendor);
			self.masVendorId(vendorBill.MASVendorId);

			// ##END: US22419

			// ##START: US22956
			// When a bill is opened from CC, the trigger to load uvbOwnershipList sometimes returns empty [Because the call from shell to fetch the list is still executing]
			// Hence, make another call to fetch the uvbOwnershipList and assign uvbOwnership in the success callback
			if (self.uvbOwnershipList().length === 0) {
				refCommon.Common.prototype.GetUVBOwnershipList((uvbOwnershipList) => {
					if (uvbOwnershipList) {
						self.uvbOwnershipList.removeAll();
						self.uvbOwnershipList.push.apply(self.uvbOwnershipList, uvbOwnershipList);
					}
					self.uvbOwnership(vendorBill.UVBOwnership);
				});
			}

			self.uvbOwnership(vendorBill.UVBOwnership);
			// ##END: US22956

			self.isValidationApplicableOnDisputeItems(vendorBill.IsValidationApplicableOnDisputeItems);
			self.processFlow = vendorBill.ProcessFlow;
			self.isLostBill(isLostBill);
			if (vendorBill.BillingStatuses != null) {
				self.billStatusList(vendorBill.BillingStatuses);
				self.selectedbillStatus(vendorBill.BillStatus);
			}
			if (isEnable) {
				self.isEnable(!isEnable);
				self.isViewOnly(false);
				self.isNewSubBill(true);
				self.vendorNameSearchList.isSubBillOrder(false);
				self.obcvendorBillOptionList.enableControl(false);
			} else {
				if (!isViewOnly) {
					self.isViewOnly(true);
				} else {
					self.isViewOnly(isViewOnly);
				}
				self.isNewSubBill(isNewSubBill);
				self.vendorNameSearchList.isSubBillOrder(true);
				self.obcvendorBillOptionList.enableControl(true);
			}

			// This condition will make Bill status disable while it's pending.
			if (isEnable || isNewSubBill) {
				if (vendorBill.BillingStatuses != null) {
					if (vendorBill.BillStatus === 1 || isEnable === true) {
						self.isBillStatusPendig(isEnable ? false : isNewSubBill ? false : true);
					} else {
						self.isBillStatusPendig(true);
					}
				}
			} else {
				if (vendorBill.BillingStatuses != null) {
					if (vendorBill.BillStatus === 1) {
						self.isBillStatusPendig(false);
					} else {
						self.isBillStatusPendig(true);
					}
				}
			}

			//##START: US21146
			//if billstatus is OVC then enable the billstatus dropdown
			if (vendorBill.BillStatus == 12) {
				self.isBillStatusPendig(true);
			}
			// ###START: DE23466
			else if (vendorBill.BillStatus == 13 || vendorBill.BillStatus == 14) {
				self.isBillStatusPendig(false);
			}
			// ###END: DE23466
			//##END: US21146

			// ###START: US20884
			if (self.isLostBill()) {
				self.isBillStatusPendig(true);
			}
			// ###END: US20884

			// ###START: US20585
			self.disputeStatusId(vendorBill.DisputeStatusId);
			// ###END: US20585
			// --------------END------------
			self.moveToMasDate(vendorBill.MasTransferDate ? self.CommonUtils.formatDate(vendorBill.MasTransferDate.toString(), 'mm/dd/yyyy') : '');
			self.createdDate(vendorBill.CreatedDate ? self.CommonUtils.formatDate(vendorBill.CreatedDate.toString(), 'mm/dd/yyyy') : '');
			// Check the status
			self.BindTheStatusValue(vendorBill);
			if (vendorBill.VendorBillId == 0) {
				$('#txtVendorName').focus();
			}
			self.SetBITrackChange(self);
		}

		// Identify subBill and blank the fields
		// to disable createSubBill Button

		// self.isItemsDisputeAmountEditable(isDisputeAmountEditable);
		//  self.isItemsDisputeLostAmountEditable(isDisputeLostAmountEditable);
		self.isDisputeSectionEditable(isDisputeSectionEditable);

		//US13688
		//Commented the below lines of code as per the requirement for displaying the Bill Date carried over from the parent to the child on creation of New Sub Bill.
		//if (self.isNewSubBill()) {
		//	self.billDate('');
		//}

		// This will start detecting the changes
		self.isNotAtLoadingTime = false;
		self.vendorNameSearchList.isNotAtLoadingTime = false;
	}

	// initialize vendor bill financial details
	public initializeVendorBillFinancialDetails(vendorBillFinancialDetail: IVendorBillFinancialDetails) {
		var self = this;
		self.totalCost($.number((vendorBillFinancialDetail.TotalCost), 2));
		self.totalRevenue($.number((vendorBillFinancialDetail.TotalRevenue), 2));
		self.actualProfit($.number((vendorBillFinancialDetail.ActualProfit), 2));
		self.actualCost($.number((vendorBillFinancialDetail.ActualCost), 2));
	}
	//#region Validation
	//Validating Vendor Bill property}
	public validateBill() {
		var self = this;

		self.vendorNameSearchList.vaildateSearchVendorNameControl();
		if (self.errorVendorDetail.errors().length != 0) {
			self.errorVendorDetail.errors.showAllMessages();
			return true;
		}
		else {
			return false;
		}
	}

	// Validate the dispute data
	public validateDisputeData() {
		var self = this;
		var isValid = true;
		if (self.selectedbillStatus() === refEnums.Enums.VendorBillStatus.Dispute.ID && self.isValidationApplicableOnDisputeItems()) {
			// Dispute Amount Validation
			if (!self.disputedAmount()) {
				self.expandVendorBillView();
				$('#txtDisputedAmount').focus();
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.EnterDisputeAmount, "info", null, toastrOptions);

				isValid = false;
				return false;
			}

			// Dispute Date validation
			if (!self.disputedDate()) {
				self.expandVendorBillView();
				var toastrOptions1 = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.EnterDisputeAmount, "info", null, toastrOptions1);

				isValid = false;
				return false;
			}

			// Dispute Notes Validation
			if (!self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.disputeNotes())) {
				self.expandVendorBillView();
				$('#txtDisputeNotes').focus();
				var toastrOptions2 = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.EnterDisputeAmount, "info", null, toastrOptions2);

				isValid = false;
				return false;
			}

			if (isValid) {
				return true;
			}
		} else {
			return true;
		}
	}
	//## function to expand the vendor bill view if any Dispute Amount, Date & Notes will be null
	public expandVendorBillView() {
		if (!$('#collapseVendorBill').hasClass('in')) {
			$('#collapseVendorBill').addClass('in');
			$("#collapseVendorBill").css("height", 'auto');
			$('#AchorcollapseVendorBill').removeClass('collapsed');
		}
	}
	//#endregion

	// This Function is used to check the status
	// MakeInactive: ID = 1, ForceAttach: ID = 2, QuickPay: ID = 3, HoldVendorBill: ID = 4
	private BindTheStatusValue(vendorBill: IVendorBill) {
		var self = this;
		// check if MakeInactive is false
		if (!vendorBill.MakeInactive) {
			self.obcvendorBillOptionList.setSelectById(1);
		}

		// check if ForceAttach is true
		if (vendorBill.ForceAttach) {
			self.obcvendorBillOptionList.setSelectById(2);
		}

		// check if QuickPay is true
		if (vendorBill.QuickPay) {
			self.obcvendorBillOptionList.setSelectById(3);
		}

		// check if hold vendor bill is true.
		if (vendorBill.HoldVendorBill) {
			self.obcvendorBillOptionList.setSelectById(4);
		}
		// ###START: DE24130
		else {
			self.obcvendorBillOptionList.getOptionsById(4).selected(vendorBill.HoldVendorBill);
		}

		// ###END: DE24130
	}

	private BindMasClearanceStatuses(vendorBill: IVendorBill) {
		var self = this;
		var masClearStatus = vendorBill.MasClearanceStatus;
		self.masClearingStatusList.removeAll();
		switch (masClearStatus) {
			case 0:
				//Approved_By_Process
				self.masClearingStatusList.push(refEnums.Enums.MasClearanceStatus.Approved_By_Process);
				self.masClearingStatusList.push(refEnums.Enums.MasClearanceStatus.Waiting_Rebill_Approval);
				self.masClearingStatusList.push(refEnums.Enums.MasClearanceStatus.Forced_Approved_By_User);
				break;
			case 1:
				//Waiting_Rebill_Approval
				self.masClearingStatusList.push(refEnums.Enums.MasClearanceStatus.Waiting_Rebill_Approval);
				self.masClearingStatusList.push(refEnums.Enums.MasClearanceStatus.Forced_Approved_By_User);
				break;
			case 2:
				//Forced_Approved_By_User
				self.masClearingStatusList.push(refEnums.Enums.MasClearanceStatus.Forced_Approved_By_User);
				self.masClearingStatusList.push(refEnums.Enums.MasClearanceStatus.Forced_Approved_By_Time);
				break;
			case 3:
				//Forced_Approved_By_Time
				self.masClearingStatusList.push(refEnums.Enums.MasClearanceStatus.Forced_Approved_By_Time);
				self.masClearingStatusList.push(refEnums.Enums.MasClearanceStatus.Forced_Approved_By_User);
				break;
		}
		if (self.masClearingStatusList().length > 0) {
			self.selectedMasClearingStatus(masClearStatus);;
		}
	}

	// Shows the message box as pr the given title and message
	private showConfirmationMessage(message: string, title: string, fisrtButtoName: string, secondButtonName: string, yesCallBack: () => boolean, noCallBack: () => boolean) {
		var self = this;

		var varMsgBox: Array<IMessageBoxButtonOption> = [
			{
				id: 0, name: fisrtButtoName, callback: (): boolean => {
					return yesCallBack();
				},
			},
			{
				id: 1, name: secondButtonName, callback: (): boolean => {
					return noCallBack();
				}
			}
		];

		////initialize message box control arguments
		var optionControlArgs: IMessageBoxOption = {
			options: varMsgBox,
			message: message,
			title: title
		}
				//Call the dialog Box functionality to open a Popup
		_app.showDialog('templates/messageBox', optionControlArgs, 'slideDown');
	}

	//sets the tracking extension for BI required fields
	SetBITrackChange(self) {
		//** To detect changes for Vendor Bill
		self.proNumber.extend({ trackChange: true });
		self.bolNumber.extend({ trackChange: true });
		self.billDate.extend({ trackChange: true });
		self.poNumber.extend({ trackChange: true });
		self.mainBolNumber.extend({ trackChange: true });
		self.refNumber.extend({ trackChange: true });
		self.pickupDate.extend({ trackChange: true });
		self.deliveryDate.extend({ trackChange: true });
		self.selectedbillStatus.extend({ trackChange: true });
		self.memo.extend({ trackChange: true });
		self.disputedAmount.extend({ trackChange: true });
		self.disputedDate.extend({ trackChange: true });
		self.disputeNotes.extend({ trackChange: true });
		self.vendorNameSearchList.vendorName.extend({ trackChange: true });
		self.originZip.extend({ trackChange: true });
		self.destinationZip.extend({ trackChange: true });
		self.selectedMasClearingStatus.extend({ trackChange: true });
	}

	//#region if user any numeric  date  without any format
	private convertToBillDate() {
		var self = this;
		if (!self.billDate().match('/')) {
			self.billDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.billDate()));
		}
	}

	private convertToDeliveryDate() {
		var self = this;
		if (!self.deliveryDate().match('/') && self.deliveryDate().length > 0) {
			self.deliveryDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.deliveryDate()));
		}
	}

	private convertToDisputeDate() {
		var self = this;
		if (!self.disputedDate().match('/')) {
			self.disputedDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.disputedDate()));
		}
	}
	//#endregion

	//#endregion

	//#region Life Cycle Event
	public activate() {
		return true;
	}

	public cleanUp() {
		var self = this;

		self.disposables.forEach(disposable => {
			if (disposable && typeof disposable.dispose === "function") {
				disposable.dispose();
			} else {
				delete disposable;
			}
		});

		self.disputeNotes.extend({ validatable: false });
		self.proNumber.extend({ validatable: false });
		self.billDate.extend({ validatable: false });
		self.originZip.extend({ validatable: false });
		self.destinationZip.extend({ validatable: false });
		self.billDate.extend({ validatable: false });
		self.disputedAmount.extend({ validatable: false });
		self.disputedDate.extend({ validatable: false });

		self.vendorNameSearchList.cleanUp();
		self.obcvendorBillOptionList.cleanUp();

		//self.billStatusList.removeAll();
		//self.masClearingStatusList.removeAll();
		//self.listCheck.removeAll();

		for (var property in this) {
			if (typeof self[property].dispose === "function") {
				self[property].dispose();
			}

			delete self[property];
		}

		delete self;
	}

	//#endregion
}