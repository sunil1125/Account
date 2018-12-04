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
import refEnums = require('services/models/common/Enums');
import refVendorNameSearch = require('services/models/common/searchVendorName');
import refValidations = require('services/validations/Validations');
import refCommon = require('services/client/CommonClient');
import refVendorBillClient = require('services/client/VendorBillClient');
import refPurchaseOrderToSalesOrderView = require('purchaseOrder/PurchaseOrderToSalesOrderView');
import refPurchaseOrderClient = require('services/client/PurchaseOrderClient');
import refCustomerSearchModel = require('services/models/common/searchCustomerName');
import _refForeignBolEmailDataModel = require('services/models/purchaseOrder/ForeignBolEmailData');
//#endregion

/***********************************************
   PURCHASE ORDER DETAILS VIEW MODEL
************************************************
** <summary>
** Purchase Order details View Model.
** </summary>
** <createDetails>
** <id>US10859</id><by>Satish</by> <date>14th July, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id>US19707</id> <by>SHREESHA ADIGA</by><date>24-11-2015</date><description>Delivery date value to PO to SO container</description>
** <id>US22471</id> <by>Vasanthakumar</by> <date>03-06-2016</date> <description>Add Success Toastr message for Emails triggered by users</description>
** <id>DE23219</id> <by>Baldev Singh Thakur</by> <date>13-06-2016</date> <description>Quick Pay flag is not sent as True when user performs Force Attach on UVB.</description>
** <id>US22796</id> <by>Baldev Singh Thakur</by> <date>16-06-2016</date> <description>Added logic to check if TruckLoad is checked.</description>
** <id>US22956</id> <by>Shreesha Adiga</by> <date>23-06-2016</date> <description>Added UVBOwnership dropdown to the view</description>
** <id>DE23442</id> <by>Baldev Singh Thakur</by> <date>07-07-2016</date> <description>Error found in US22796: Acct: Rate it on Customer is disabled even if Carrier is LTL Carrier.</description>
** <id>US24389</id> <by>Shreesha Adiga</by> <date>02-09-2016</date> <description>Set truckload checkbox to false, if IsForeigBol is cliked</description>
** <id>US24616</id> <by>Janakiram</by> <date>10-09-2016</date><description> Shipper Company Name and the Consignee Company Name on the main screen for all UVB's.</description>
** <id>US37137</id> <by>Shreesha Adiga</by> <date>13-06-2018</date><description>Add validation to BOLNumber: Allow only main BOLNumber</description>
** </changeHistory>

***********************************************/
export class PurchaseOrderDetailsViewModel {
	//#region Observables Declaration Region
	//## Holds PRO #
	proNumber: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Pro Number is required." } });
	//## Holds BOL #
	bolNumber: KnockoutObservable<string> = ko.observable('');
	//## Holds Bill Date
	billDate: KnockoutObservable<any> = ko.observable('').extend({ required: { message: " A valid Bill Date is required" } });
	//## Holds PO #
	poNumber: KnockoutObservable<string> = ko.observable('');
	//## Holds EDI BOL #
	mainBolNumber: KnockoutObservable<string> = ko.observable('');
	//## Holds Reference #
	refNumber: KnockoutObservable<string> = ko.observable('');
	//## Holds Origin Zip
	originZip: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Original ZIP is required." } });
	//## Holds Destination Zip
	destinationZip: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Destination ZIP is required." } });
	//## Holds Total Pieces
	totalPieces: KnockoutObservable<number> = ko.observable();
	//## Holds Total Weight
	totalWeigth: KnockoutObservable<number> = ko.observable();
	//## Holds Amount
	purchaseOrderAmount: KnockoutObservable<number> = ko.observable();
	//## Holds Pickup Date
	pickupDate: KnockoutObservable<any> = ko.observable('');
	//## Holds Delivery Date
	deliveryDate: KnockoutObservable<any> = ko.observable('');

	// ###START: US24616
	// Holds Consignee Company Name
	consignee: KnockoutObservable<any> = ko.observable('');

	// Holds Shipper Company Name
	shipper: KnockoutObservable<any> = ko.observable('');

	// ###END: US24616

	createdDate: KnockoutObservable<any> = ko.observable('');
	//## Holds Memo
	dueDate: KnockoutObservable<any> = ko.observable('');
	memo: KnockoutObservable<string> = ko.observable('');
	carierType: KnockoutObservable<number> = ko.observable();
	vendorId: KnockoutComputed<number>;

	vendorName: KnockoutComputed<string>;

	vendorBillId: KnockoutObservable<number> = ko.observable(0);

	listCheck: KnockoutObservableArray<boolean>;
	//## Set visibility of ForcePushToMas Button
	isBillForcePushToMas: KnockoutObservable<boolean> = ko.observable(false);
	errorWidth: KnockoutObservable<string> = ko.observable('89%');
	normalWidth: KnockoutObservable<string> = ko.observable('87.5%');
	//##END Observables Declaration Region
	isForeignBolSelected: KnockoutObservable<boolean> = ko.observable(false);
	isForeignBolSelectedForView: KnockoutObservable<boolean> = ko.observable(true);
	foreignBolOldCustomerId: KnockoutObservable<number> = ko.observable(0);
	foreignBolOlderCustomerId: KnockoutObservable<number> = ko.observable(0);
	foreignBolOldCustomerName: KnockoutObservable<any> = ko.observable(0);
	datepickerOptions: DatepickerOptions;
	error: KnockoutValidationErrors;
	isValidationShown: boolean = false;
	isCustomerSelected: boolean = false;
	errorVendorDetail: KnockoutValidationGroup;
	isNotAtLoadingTime: boolean = false;
	isBolNo: boolean = false;
	isProNo: boolean = false;
	isVendor: boolean = false;
	count: number = 0;
	isFroceAttachChecked: boolean = false;

	// It is used for checking BOlNo is new or old
	originalBolNumber: string;
	// It is used for checking PRO is new or old
	originalProNumber: string;
	// It is used for checking that if bill status is changed short paid to re quote.
	originalBillStatus: number;
	// SalesOrderid (Order id which is attached to Vendor Bill)
	salesOrderId: number;

	// To check the negative margin
	originalVendorAmount: number;
	// Updated date
	updatedDate: number;

	//## Function Declaration Region
	isNumber: (that, event) => void;
	isAlphaNumericSpace: (that, event) => void;
	shipperAddressCallback: (shipperAddress: IVendorBillAddress) => any;
	consigneeAddressCallback: (consigneeAddress: IVendorBillAddress) => any;
	billToAddressCallback: (billToAddress: IVendorBillAddress) => any;
	isViewOnly: KnockoutObservable<boolean> = ko.observable(false);
	onCustomerChangeCallBack: (flag: boolean) => any;
	onCustomerIdCallBack: (customerId: number) => any;
	//#region Members
	//for tracking change
	getTrackChange: () => string[];
	isDirty: KnockoutComputed<boolean>;
	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	returnValueFlag: boolean = false;
	//## To trigger when when 'TAB' press from last field.
	keyListenerCallback: () => any;

	//## To trigger when when 'TAB' press from last field.
	isTabPress: (that, event) => void;

	onRateItonCustomerCallBack: () => any;
	onRateItOnCustomerManuallyCallBack: () => any;
	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	private checkMsgDisplay: boolean = true;
	//#endregion

	//# Initializations
	vendorNameSearchList: refVendorNameSearchControl.SearchVendorNameControl;
	obcvendorBillOptionList: refVendorBillOptionButtonControl.VendorBillOptionButtonControl;
	commonClient: refCommon.Common = new refCommon.Common();
	vendorBillClient: refVendorBillClient.VendorBillClient = new refVendorBillClient.VendorBillClient();
	commonUtils: CommonStatic = new Utils.Common();
	purchaseOrderToSalesOrederViewModel: refPurchaseOrderToSalesOrderView.PurchaseOrderToSalesOrderViewModel;
	purchaseOrderClient: refPurchaseOrderClient.PurchaseOrderClient = new refPurchaseOrderClient.PurchaseOrderClient();
	mainSalesOrderId: number;
	//timeRemaining: KnockoutObservable<any> = ko.observable();
	//showTimer: KnockoutObservable<boolean> = ko.observable(false);
	mailExpiryTime: KnockoutObservable<any> = ko.observable();
	//isTodayHoliday: KnockoutObservable<boolean> = ko.observable(false);
	//isStopTimerClicked: KnockoutObservable<boolean> = ko.observable(false);
	//StopTimer: KnockoutObservable<boolean> = ko.observable(false);
	//timerStoppedTimeRemaining: string;
	//myTimer: any;
	isUVBAssociatedToCustomer: KnockoutObservable<boolean> = ko.observable(false);
	// to check UVB toSO is clicked
	uvbToSoClick: boolean = false;

	isActiveOnLoad: boolean = true;
	// ###START: DE23219
	quickPay: KnockoutObservable<boolean> = ko.observable(false);
	// ###END: DE23219

	isTruckLoadVisible: boolean = false;

	// ##START: US22956
	uvbOwnershipList: KnockoutObservableArray<IUVBOwnership> = ko.observableArray([]);
	uvbOwnership: KnockoutObservable<number> = ko.observable(0);
	// ##END: US22956
	//#endregion

	//#region Constructor
	constructor(shipperAddressCallback: (shipperAddress: IVendorBillAddress) => any, consigneeAddressCallback: (consigneeAddress: IVendorBillAddress) => any,
		billToAddressCallback: (billToAddress: IVendorBillAddress) => any,
		keyListenerCallback: () => any, onRateItonCustomerCallBack: () => any, onRateItOnCustomerManuallyCallBack: () => any) {
		var self = this;
		self.shipperAddressCallback = shipperAddressCallback;
		self.consigneeAddressCallback = consigneeAddressCallback;
		self.billToAddressCallback = billToAddressCallback;

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

		//## when user pressed 'TAB' from last field then expand address view.
		self.keyListenerCallback = keyListenerCallback;
		self.onRateItonCustomerCallBack = onRateItonCustomerCallBack;
		self.onRateItOnCustomerManuallyCallBack = onRateItOnCustomerManuallyCallBack;
		self.vendorNameSearchList = new refVendorNameSearchControl.SearchVendorNameControl("A valid Vendor Name is required.", '82.5%', '90.5%');
		self.error = ko.validation.group(self, { deep: true });
		self.purchaseOrderToSalesOrederViewModel = new refPurchaseOrderToSalesOrderView.PurchaseOrderToSalesOrderViewModel(() => {
			self.onRateItonCustomerCallBack();
		}, () => {
				self.onRateItOnCustomerManuallyCallBack();
			}, (flag, customerId, agentAgencyDetails) => {
				//self.onCustomerIdCallBack(customerId);
				// If This new Association For The Bill || UVB to SO Creation.
				if (!self.isUVBAssociatedToCustomer() && self.obcvendorBillOptionList.getOptionsById(7).selected()) {
					self.onCustomerIdCallBack(customerId);
					self.purchaseOrderToSalesOrederViewModel.agentName(agentAgencyDetails.agentName);
					self.purchaseOrderToSalesOrederViewModel.agentId(agentAgencyDetails.agentId);
					self.purchaseOrderToSalesOrederViewModel.agencyName(agentAgencyDetails.agencyName);
					self.purchaseOrderToSalesOrederViewModel.agencyId(agentAgencyDetails.agencyId);
					self.foreignBolOlderCustomerId(self.foreignBolOldCustomerId());
					self.foreignBolOldCustomerId(customerId);
					self.foreignBolOldCustomerName(self.purchaseOrderToSalesOrederViewModel.customerSearchList.customerName());
				}
				else if (customerId !== self.foreignBolOldCustomerId() && self.obcvendorBillOptionList.getOptionsById(7).selected() && self.isUVBAssociatedToCustomer()) {
					self.onCustomerIdCallBack(customerId);
					self.processOfForeignBolCustomerChange(agentAgencyDetails, customerId);
				}
				else {
					self.onCustomerIdCallBack(customerId);
					self.purchaseOrderToSalesOrederViewModel.agentName(agentAgencyDetails.agentName);
					self.purchaseOrderToSalesOrederViewModel.agentId(agentAgencyDetails.agentId);
					self.purchaseOrderToSalesOrederViewModel.agencyName(agentAgencyDetails.agencyName);
					self.purchaseOrderToSalesOrederViewModel.agencyId(agentAgencyDetails.agencyId);
					self.foreignBolOlderCustomerId(self.foreignBolOldCustomerId());
					self.foreignBolOldCustomerId(customerId);
					self.foreignBolOldCustomerName(self.purchaseOrderToSalesOrederViewModel.customerSearchList.customerName());
				}

				self.isCustomerSelected = flag;
				if (self.onCustomerChangeCallBack && self.isForeignBolSelected()) {
					self.onCustomerChangeCallBack(flag);
				}
			}
			, (flag) => {
				self.isUVBAssociatedToCustomer(flag);
				if (flag) {
					self.obcvendorBillOptionList.getOptionsById(7).enabled(true);
				}
			}
			, (isMailSend) => {
				if (isMailSend) {
					self.obcvendorBillOptionList.getOptionsById(7).enabled(false);
				}
			});

		//#region Validations
		self.billDate = ko.observable().extend({
			required: {
				message: 'Bill date is required.'
			},

			validation: {
				validator: () => refValidations.Validations.isValidDate(self.billDate(), self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "BillDate"),
				message: 'Not a valid date'
			}
		});

		self.bolNumber.extend({
			number: {
				params: true,
				message: ApplicationMessages.Messages.SubOrderCantBeAttachedBill
			}
		});

		//#region Google Msg Handling
		//To check if Msg is clicked
		self.checkMsgClick = () => {
			self.checkMsgDisplay = true;
		}

	   // to Check if Msg is hidden or closed
		self.checkMsgHide = () => {
			self.checkMsgDisplay = true;
		}

		//To check if enter value is digit and decimal
		self.isNumber = (data, event) => {
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
		self.isAlphaNumericSpace = (data, event) => {
			var charCode = (event.which) ? event.which : event.keyCode;

			if ((charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122))) {
				return false;
			}
			return true;
		}

		// to get the carrierId after selecting vendor/ Carrier
		self.vendorId = ko.computed(() => {
			if (self.vendorNameSearchList.name() != null) {
				self.checkCarrierExistsInTL(self.vendorNameSearchList.ID());
				return self.vendorNameSearchList.ID();
			}

			return 0;
		});

		// to get the vendor Name after selecting vendor
		self.vendorName = ko.computed(() => {
			if (self.vendorNameSearchList.name() != null)
				return self.vendorNameSearchList.vendorName();

			return null;
		});

		//#endregion

		//To initialize the dates
		self.billDate(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
		self.pickupDate(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
		self.deliveryDate(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'));

		//track changes
		self.setTrackChange(self);

		self.getTrackChange = () => Utils.getDirtyItems(this);

		self.isDirty = ko.computed(() => {
			var result = self.proNumber();
			result = self.bolNumber();
			result = self.billDate();
			result = self.poNumber();
			result = self.mainBolNumber();
			result = self.refNumber();
			result = self.pickupDate();
			result = self.deliveryDate();
			result = self.vendorNameSearchList.vendorName();
			result = self.memo();
			// ##START: US22956
			var result2 = self.uvbOwnership();
			// ##END: US22956
			// If this from loading data side the return as false
			if (self.isNotAtLoadingTime)
				return false;

			var returnValue = self.getTrackChange().length > 0 ? true : false;
			self.returnValueFlag = returnValue;
			if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
				self.onChangesMade(returnValue);

			return returnValue;
		});

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
			destinationZip: self.destinationZip
		});

		//to check if BOL exists if yes then fetch the detail
		//to check if BOL exists if yes then fetch the detail
		self.bolNumber.subscribe(newValue => {
			if (!self.commonUtils.isNullOrEmptyOrWhiteSpaces(self.bolNumber())
				|| !self.commonUtils.isNullOrEmptyOrWhiteSpaces(self.proNumber())) {
				self.obcvendorBillOptionList.isForceAttachChecked = false;
				self.obcvendorBillOptionList.getOptionsById(2).selected(false);
			} else {
				self.obcvendorBillOptionList.isForceAttachChecked = true;
			}

			if (self.commonUtils.isNullOrEmptyOrWhiteSpaces(self.bolNumber())) {
				self.bolNumber(self.bolNumber().trim());

				// Gets the details to validate the PRO, PO and BOL
				self.vendorBillClient.searchSalesOrderByBOL(self.proNumber(), self.vendorId(), newValue, self.vendorBillId(), (data: ISalesOrderDetails) => {
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
							ko.utils.arrayForEach(data.Addresses, address => {
								if (address.AddressType === refEnums.Enums.AddressType.Origin.ID) {
									//this.shipperAddressCallback(address);
								} else if (address.AddressType === refEnums.Enums.AddressType.Destination.ID) {
									//this.consigneeAddressCallback(address);
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
		});

		//to check if BOL exists if yes then fetch the detail
		self.proNumber.subscribe(newValue => {
			if (!self.commonUtils.isNullOrEmptyOrWhiteSpaces(self.bolNumber())
				|| !self.commonUtils.isNullOrEmptyOrWhiteSpaces(self.proNumber())) {
				self.obcvendorBillOptionList.isForceAttachChecked = false;
				self.obcvendorBillOptionList.getOptionsById(2).selected(false);
			} else {
				self.obcvendorBillOptionList.isForceAttachChecked = true;
			}

			var bolNo = self.bolNumber();
			if (self.commonUtils.isNullOrEmptyOrWhiteSpaces(self.proNumber())) {
				if (self.proNumber().trim() !== self.originalProNumber) {
					if (self.commonUtils.isNullOrEmptyOrWhiteSpaces(self.bolNumber())) {
						if (self.bolNumber().trim() === self.originalBolNumber) {
							//checking only the PRO exists so we will not be passing the BOL#
							bolNo = "";
						}
					}
					self.vendorBillClient.searchSalesOrderByBOL(newValue, self.vendorId(), bolNo, self.vendorBillId(), (data: Array<IVendorBillAddress>) => {
						self.listCheck = ko.observableArray();
						self.listCheck.push(self.isProNo);
						self.listCheck.push(self.isBolNo);
						self.listCheck.push(self.isVendor);

						if (data != null && data.length > 0) {
							ko.utils.arrayForEach(data, address => {
								if (address.AddressType === refEnums.Enums.AddressType.Origin.ID) {
									//self.shipperAddressCallback(address);
								} else if (address.AddressType === 2) {
									//self.consigneeAddressCallback(address);
								} else {
								}
							});
						}
					});
				}
			}
		});

		//##START: US19707
		self.deliveryDate.subscribe(newValue => {
			self.purchaseOrderToSalesOrederViewModel.deliveryDate(self.commonUtils.isValidDate(newValue) ? newValue : "");
		});
		//##END: US19707

		//## when user pressed 'TAB' from MEMO expand address view.
		self.isTabPress = (data, event) => {
			var charCode = (event.which) ? event.which : event.keyCode;

			if ((charCode === 9)) { //if 'TAB' press.
				self.keyListenerCallback();
			}
			return true;
		}

		//#endregion

		//# Option Buttons region
		//To set the checkbox bill option values
        var vendorBillOptionListOptions: Array<IButtonControlOption> = [{ id: refEnums.Enums.vendorBillOptionConstant.MakeInactive, name: 'Make Inactive', selected: false }, { id: refEnums.Enums.vendorBillOptionConstant.FroceAttach, name: 'Force Attach', selected: false }, { id: refEnums.Enums.vendorBillOptionConstant.Reviewed, name: 'Reviewed', selected: false }, { id: refEnums.Enums.vendorBillOptionConstant.ForeignBolMapping, name: 'Is Foreign BOL', selected: false }];

		//set checkbox property
		var argsvendorBillOptionList: IOptionButtonControlArgs = {
			options: vendorBillOptionListOptions,
			useHtmlBinding: true,
			isMultiCheck: true,
			isVerticalView: false
		}

		self.obcvendorBillOptionList = new refVendorBillOptionButtonControl.VendorBillOptionButtonControl(argsvendorBillOptionList, refEnums.Enums.OptionButtonsView.Vertical, null, (flag) => {
			self.isForeignBolSelected(flag);
			self.purchaseOrderToSalesOrederViewModel.isForeignBolSelectedForView(flag);
			if (flag) {
				self.isForeignBolSelectedForView(false);
				// ##START: US24389
				self.purchaseOrderToSalesOrederViewModel.isTruckLoadChecked(false);
				// ##END: US24389
				self.purchaseOrderToSalesOrederViewModel.isForeignBolSelectedForView(true);
				self.openPOToSOCreation();
			} else if (self.isCustomerSelected) {
				$(".POToSO-div-none").hide('slide', { direction: 'right' }, 200);
				$(".POToSO").removeClass("POToSO-div-none");
				self.isForeignBolSelectedForView(false);
				self.obcvendorBillOptionList.getOptionsById(7).enabled(false);
				self.purchaseOrderToSalesOrederViewModel.isForeignBolSelectedForView(false);

				if (self.checkMsgDisplay) {
					self.checkMsgDisplay = false;
					var actionButtons: Array<IToastrActionButtonOptions> = [];
					actionButtons.push({
						actionButtonName: "Keep address",
						actionClick: () => {
							self.purchaseOrderClient.DeleteForeignCustomerDetails(self.vendorBillId(), false, () => {
								var toastrOptions = {
									toastrPositionClass: "toast-top-middle",
									delayInseconds: 5,
									fadeOut: 10,
									typeOfAlert: "",
									title: ""
								}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.sucessfullUnMapped, "success", null, toastrOptions);
								self.purchaseOrderToSalesOrederViewModel.showTimer(false);
								self.purchaseOrderToSalesOrederViewModel.isStopTimerClicked(false);
								self.purchaseOrderToSalesOrederViewModel.clearAllSelection();
								self.obcvendorBillOptionList.getOptionsById(7).enabled(true);
								self.isForeignBolSelectedForView(true);
								self.isCustomerSelected = false;
							}, () => { });
						}
					});

					actionButtons.push({
						actionButtonName: "Delete address",
						actionClick: () => {
							self.purchaseOrderClient.DeleteForeignCustomerDetails(self.vendorBillId(), true, () => {
								var toastrOptions = {
									toastrPositionClass: "toast-top-middle",
									delayInseconds: 5,
									fadeOut: 10,
									typeOfAlert: "",
									title: ""
								}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.sucessfullUnMappedAndDeletedCustomer, "success", null, toastrOptions);
							}, () => { });
							self.purchaseOrderToSalesOrederViewModel.showTimer(false);
							self.purchaseOrderToSalesOrederViewModel.isStopTimerClicked(false);
							self.purchaseOrderToSalesOrederViewModel.clearAllSelection();
							self.obcvendorBillOptionList.getOptionsById(7).enabled(true);
							self.isForeignBolSelectedForView(true);
							self.isCustomerSelected = false;
						}
					});

					actionButtons.push({
						actionButtonName: "Cancel",
						actionClick: () => {
							self.obcvendorBillOptionList.setSelectById(7);
							self.isForeignBolSelectedForView(false);
							self.obcvendorBillOptionList.getOptionsById(7).enabled(true);
							self.purchaseOrderToSalesOrederViewModel.isForeignBolSelectedForView(true);
							self.openPOToSOCreation();
						}
					});
					var toastrOptions1: IToastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 0,
						fadeOut: 0,
						typeOfAlert: "",
						title: "",
						actionButtons: actionButtons
					};

					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.AreYouSureWantToRemoveForeignBolCustomer, "warning", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
				}
			}
			else {
				$(".POToSO-div-none").hide('slide', { direction: 'right' }, 200);
				$(".POToSO").removeClass("POToSO-div-none");
				self.isForeignBolSelectedForView(false);
				self.obcvendorBillOptionList.getOptionsById(7).enabled(false);
				self.purchaseOrderToSalesOrederViewModel.isForeignBolSelectedForView(false);
				// ##START: US24389
				self.purchaseOrderToSalesOrederViewModel.isTruckLoadChecked(false);
				// ##END: US24389
				if (self.checkMsgDisplay) {
					self.checkMsgDisplay = false;
					var actionButtons: Array<IToastrActionButtonOptions> = [];
					actionButtons.push({
						actionButtonName: "Yes",
						actionClick: () => {
							self.purchaseOrderToSalesOrederViewModel.isForeignBolSelectedForView(true);
							self.isForeignBolSelectedForView(true);
							self.obcvendorBillOptionList.getOptionsById(7).enabled(true);
						}
					});

					actionButtons.push({
						actionButtonName: "No",
						actionClick: () => {
							self.obcvendorBillOptionList.setSelectById(7);
							self.obcvendorBillOptionList.getOptionsById(7).enabled(true);
							self.isForeignBolSelectedForView(false);
							self.openPOToSOCreation();
						}
					});
					var toastrOptions1: IToastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 0,
						fadeOut: 0,
						typeOfAlert: "",
						title: "",
						actionButtons: actionButtons
					};

					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.DissociatePoAsFBOL, "warning", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
				}
			}

			if (self.onCustomerChangeCallBack && self.isCustomerSelected) {
				self.onCustomerChangeCallBack(flag);
			}
		});
		self.memo.subscribe(newValue=> {
			if (self.memo() !== null && self.memo().length >= 100) {
				var memo = self.memo().substr(0, 98);
				self.memo(memo);
			}
		});
		return self;
	}

	//#endregion Constructor

	//#region Internal Methods
	//public startAndStopTimer(expiryTime?: string) {
	//	var self = this;
	//	self.showTimer(true);

	//	if (!self.isTodayHoliday()) {
	//		if (!self.StopTimer()) {
	//			if (expiryTime != '00:00:00') {
	//				self.isStopTimerClicked(true);
	//				var splitTime = expiryTime.split(':');

	//				var second = ((+splitTime[0] * 60 * 60) + (+splitTime[1] * 60) + (+splitTime[2])) * 1000;
	//				self.myTimer = setInterval(function () {
	//					var expiryDateTime = new Date();
	//					var currentDateTime = new Date();

	//					var miliSeconds = second - 1000;
	//					var seconds = (Math.floor(miliSeconds / 1000));
	//					var minutes = (Math.floor(miliSeconds / 1000 / 60));
	//					var hours = Math.floor(minutes / 60);
	//					minutes = minutes % 60;
	//					seconds = seconds % 60;
	//					var hoursToDisplay = hours < 10 ? "0" + hours.toString() : hours.toString();
	//					var minutesToDisplay = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
	//					var secondsToDisplay = seconds < 10 ? "0" + seconds.toString() : seconds.toString();
	//					self.timeRemaining(hoursToDisplay + ":" + minutesToDisplay); //+ ":" + secondsToDisplay
	//					self.timerStoppedTimeRemaining = hoursToDisplay + ":" + minutesToDisplay; // + ":" + secondsToDisplay
	//					second = miliSeconds;
	//				}, 1000);
	//			}
	//			else {
	//				self.timeRemaining(expiryTime);
	//				self.isStopTimerClicked(false);
	//			}
	//		}
	//		else {
	//			self.timeRemaining(expiryTime);
	//			self.StopTimer(false);
	//		}
	//	}
	//	else {
	//		self.timeRemaining(expiryTime);
	//		self.timerStoppedTimeRemaining = expiryTime;
	//	}
	//}

	// initialize vendor bill details
	public initializePurchaseOrderDetails(vendorBill: IVendorBill, ForeignBolCustomerDetails: IUser, isViewOnly?: boolean, foreignBolDetails?: any) {
		var self = this;

		// This will prevent to detect the changes at first time
		self.isNotAtLoadingTime = true;
		self.vendorNameSearchList.isNotAtLoadingTime = true;
		if (vendorBill != null) {
			self.vendorNameSearchList.name(new refVendorNameSearch.Models.VendorNameSearch());
			self.vendorNameSearchList.ID(vendorBill.CarrierId);
			self.vendorNameSearchList.vendorName(vendorBill.VendorName);
			self.vendorNameSearchList.carrierType(vendorBill.CarrierType);
			self.vendorBillId(vendorBill.VendorBillId);
			self.originalProNumber = vendorBill.ProNumber;
			self.originalBolNumber = vendorBill.BolNumber;
			self.originalBillStatus = vendorBill.BillStatus;
			self.originalVendorAmount = vendorBill.Amount;
			self.proNumber(vendorBill.ProNumber);
			self.bolNumber(vendorBill.BolNumber);
			self.billDate(vendorBill.BillDate ? self.commonUtils.formatDate(vendorBill.BillDate.toString(), 'mm/dd/yyyy') : self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
			self.pickupDate(vendorBill.PickupDate ? self.commonUtils.formatDate(vendorBill.PickupDate.toString(), 'mm/dd/yyyy') : '');
			self.deliveryDate(vendorBill.DeliveryDate ? self.commonUtils.formatDate(vendorBill.DeliveryDate.toString(), 'mm/dd/yyyy') : self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
			self.createdDate(vendorBill.CreatedDate ? self.commonUtils.formatDate(vendorBill.CreatedDate.toString(), 'mm/dd/yyyy') : '');
			self.poNumber(vendorBill.PoNumber);
			self.mainBolNumber(vendorBill.MainVendorBolNumber);
			self.refNumber(vendorBill.ReferenceNumber);
			self.totalPieces(vendorBill.TotalPieces);
			self.totalWeigth(vendorBill.TotalWeight);
			self.memo(vendorBill.Memo);
			self.salesOrderId = vendorBill.SalesOrderId;
			self.mainSalesOrderId = vendorBill.SalesOrderId;
			self.isBillForcePushToMas(vendorBill.IsBillForcePushToMas);
			self.updatedDate = vendorBill.UpdatedDate;
			self.purchaseOrderAmount($.number((vendorBill.Amount), 2));
			self.isViewOnly(isViewOnly);
			// ###START: DE23219
			self.quickPay(vendorBill.QuickPay);
			// ###END: DE23219

			// ##START: US22956
			self.uvbOwnership(vendorBill.UVBOwnership);
			// ##END: US22956

			if (foreignBolDetails != null && foreignBolDetails.IsForeignBol) {
				self.isForeignBolSelectedForView(false);
				self.purchaseOrderToSalesOrederViewModel.isForeignBolSelectedForView(true);
				self.obcvendorBillOptionList.getOptionsById(7).selected(true);
				self.purchaseOrderToSalesOrederViewModel.customerSearchList.name(new refCustomerSearchModel.Models.CustomerNameSearch());
				self.purchaseOrderToSalesOrederViewModel.customerSearchList.customerName(ForeignBolCustomerDetails[0].CompanyName);
				self.foreignBolOldCustomerName(ForeignBolCustomerDetails[0].CompanyName);
				self.purchaseOrderToSalesOrederViewModel.agentName(ForeignBolCustomerDetails[0].UserName);
				self.purchaseOrderToSalesOrederViewModel.agentId(ForeignBolCustomerDetails[0].UserID);
				self.purchaseOrderToSalesOrederViewModel.agencyName(ForeignBolCustomerDetails[0].AgencyName);
				self.purchaseOrderToSalesOrederViewModel.emailAddress(ForeignBolCustomerDetails[0].EmailId);
				self.purchaseOrderToSalesOrederViewModel.customerSearchList.id(foreignBolDetails.CustomerId);
				self.purchaseOrderToSalesOrederViewModel.customerSearchList.customerId(foreignBolDetails.CustomerId);
				self.purchaseOrderToSalesOrederViewModel.isAgentNotificationClicked(foreignBolDetails.IsForeignBol);
				self.purchaseOrderToSalesOrederViewModel.isForeignBolChecked(foreignBolDetails.IsForeignBol);
				if (foreignBolDetails.CustomerId > 0) {
					self.foreignBolOldCustomerId(foreignBolDetails.CustomerId);
					self.isCustomerSelected = true;
					self.isUVBAssociatedToCustomer(true);
				}
				//self.purchaseOrderToSalesOrederViewModel.uploadFileDetails = uploadFileDetails;
				if (foreignBolDetails.TimeRemaining !== null && foreignBolDetails.TimeRemaining !== undefined && foreignBolDetails.TimeRemaining !== "") {
					//self.isStopTimerClicked(true);
					self.purchaseOrderToSalesOrederViewModel.isStopTimerClicked(true);
					self.purchaseOrderToSalesOrederViewModel.customerSearchList.isEnable(false);
					self.obcvendorBillOptionList.getOptionsById(7).enabled(!foreignBolDetails.IsStopTimer);
					//self.startAndStopTimer(timeRemaining);

					self.purchaseOrderToSalesOrederViewModel.timerTitle(foreignBolDetails.TimerTitle);
					self.purchaseOrderToSalesOrederViewModel.initializePurchaseOrderTOSO(foreignBolDetails.TimeRemaining, foreignBolDetails.IsStopTimer);
				}
				else {
					//self.showTimer(false);
					self.purchaseOrderToSalesOrederViewModel.showTimer(false);
				}
				self.count = 0;
				self.openPOToSOCreation();
			}
			else {
				self.count = 1;
				self.isForeignBolSelected(false);
				self.isForeignBolSelectedForView(true);
				self.openPOToSOCreation();
				self.obcvendorBillOptionList.getOptionsById(7).enabled(true);
				self.obcvendorBillOptionList.getOptionsById(7).selected(false);
			}
			//self.purchaseOrderToSalesOrederViewModel.timeRemaining(timeRemaining);
			self.purchaseOrderToSalesOrederViewModel.uploadFileDetails.CarrierId = self.vendorNameSearchList.ID();
			self.purchaseOrderToSalesOrederViewModel.uploadFileDetails.ProNumber = self.proNumber();
			if (self.bolNumber()) {
				self.purchaseOrderToSalesOrederViewModel.uploadFileDetails.BolNumber = self.bolNumber();
			} else if (self.mainBolNumber()) {
				self.purchaseOrderToSalesOrederViewModel.uploadFileDetails.BolNumber = self.mainBolNumber();
			}
			self.purchaseOrderToSalesOrederViewModel.uploadFileDetails.VendorBillId = self.vendorBillId();
			self.purchaseOrderToSalesOrederViewModel.uploadFileDetails.CarrierName = self.vendorName();
			self.purchaseOrderToSalesOrederViewModel.uploadFileDetails.OriginZip = self.originZip();
			self.purchaseOrderToSalesOrederViewModel.uploadFileDetails.ServiceType = self.vendorNameSearchList.carrierType();
			self.dueDate(vendorBill.DueDate ? self.commonUtils.formatDate(vendorBill.DueDate.toString(), 'mm/dd/yyyy') : '');
			$('#txtVendorName').focus();
			self.setTrackChange(self);
		}

		// Check the status
		self.BindTheStatusValue(vendorBill);

		// This will start detecting the changes
		self.isNotAtLoadingTime = false;
		self.vendorNameSearchList.isNotAtLoadingTime = false;
	}

	public processOfForeignBolCustomerChange(AgentAndAgencyDetails: any, customerId: number) {
		var self = this;
		//self.checkMsgDisplay = true;
		//if (self.checkMsgDisplay) {
		self.checkMsgDisplay = false;
		var actionButtons: Array<IToastrActionButtonOptions> = [];
		actionButtons.push({
			actionButtonName: "Keep address",
			actionClick: () => {
				// ###START: US22471
				self.purchaseOrderClient.UpdateForeignBolCustomerOfUVB(self.vendorBillId(), self.purchaseOrderToSalesOrederViewModel.customerId(), self.foreignBolOldCustomerId(), false, (message) => {
					self.purchaseOrderToSalesOrederViewModel.agentName(AgentAndAgencyDetails.agentName);
					self.purchaseOrderToSalesOrederViewModel.agentId(AgentAndAgencyDetails.agentId);
					self.purchaseOrderToSalesOrederViewModel.agencyName(AgentAndAgencyDetails.agencyName);
					self.purchaseOrderToSalesOrederViewModel.agencyId(AgentAndAgencyDetails.agencyId);
					self.foreignBolOlderCustomerId(self.foreignBolOldCustomerId());
					self.foreignBolOldCustomerId(customerId);
					self.foreignBolOldCustomerName(self.purchaseOrderToSalesOrederViewModel.customerSearchList.customerName());

					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 5,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.sucessfullUnMapped, "success", null, toastrOptions);

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
					// ###END: US22471
				}, () => { });
			}
		});

		actionButtons.push({
			actionButtonName: "Delete address",
			actionClick: () => {
				// ###START: US22471
				self.purchaseOrderClient.UpdateForeignBolCustomerOfUVB(self.vendorBillId(), self.purchaseOrderToSalesOrederViewModel.customerId(), self.foreignBolOldCustomerId(), true, (message) => {
					self.purchaseOrderToSalesOrederViewModel.agentName(AgentAndAgencyDetails.agentName);
					self.purchaseOrderToSalesOrederViewModel.agentId(AgentAndAgencyDetails.agentId);
					self.purchaseOrderToSalesOrederViewModel.agencyName(AgentAndAgencyDetails.agencyName);
					self.purchaseOrderToSalesOrederViewModel.agencyId(AgentAndAgencyDetails.agencyId);
					self.foreignBolOlderCustomerId(self.foreignBolOldCustomerId());
					self.foreignBolOldCustomerId(customerId);
					self.foreignBolOldCustomerName(self.purchaseOrderToSalesOrederViewModel.customerSearchList.customerName());
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 5,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.sucessfullUnMappedAndDeletedCustomer, "success", null, toastrOptions);

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
					// ###END: US22471
				}, () => { });
			}
		});

		actionButtons.push({
			actionButtonName: "Cancel",
			actionClick: () => {
				self.onCustomerIdCallBack(self.foreignBolOldCustomerId());
				self.purchaseOrderToSalesOrederViewModel.customerSearchList.id(self.foreignBolOldCustomerId()),
				self.purchaseOrderToSalesOrederViewModel.customerSearchList.name(new refCustomerSearchModel.Models.CustomerNameSearch()),
				self.purchaseOrderToSalesOrederViewModel.customerSearchList.customerName(self.foreignBolOldCustomerName())
				}
		});
		var toastrOptions1: IToastrOptions = {
			toastrPositionClass: "toast-top-middle",
			delayInseconds: 0,
			fadeOut: 0,
			typeOfAlert: "",
			title: "",
			actionButtons: actionButtons
		};

		Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.DissociatedPOAsFBOLOnCustomerChanged, "warning", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
		//}
	}

	//sets the tracking extension for BI required fields
	setTrackChange(self) {
		//** To detect changes for Vendor Bill
		self.proNumber.extend({ trackChange: true });
		self.bolNumber.extend({ trackChange: true });
		self.billDate.extend({ trackChange: true });
		self.poNumber.extend({ trackChange: true });
		self.mainBolNumber.extend({ trackChange: true });
		self.refNumber.extend({ trackChange: true });
		self.pickupDate.extend({ trackChange: true });
		self.deliveryDate.extend({ trackChange: true });
		self.memo.extend({ trackChange: true });
		// ##START: US22956
		self.uvbOwnership.extend({ trackChange: true });
		// ##END: US22956
		self.vendorNameSearchList.vendorName.extend({ trackChange: true });
	}

	//#region Validation
	//Validating Vendor Bill property}
	public validatePurchaseOrderDetails() {
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

	//#endregion

	// This Function is used to check the status
	// MakeInactive: ID = 1, ForceAttach: ID = 2
	private BindTheStatusValue(vendorBill: IVendorBill) {
		var self = this;
		// check if MakeInactive is false
		if (!vendorBill.MakeInactive) {
			self.obcvendorBillOptionList.setSelectById(1);
			self.isActiveOnLoad = false;
		}
		else {
			self.isActiveOnLoad = true;
		}

		// check if ForceAttach is true
		if (vendorBill.ForceAttach) {
			self.obcvendorBillOptionList.setSelectById(2);
		}

		if (vendorBill.IsReviewed) {
			self.obcvendorBillOptionList.setSelectById(5);
		}
	}

	//#region if user any numeric  date  without any format
	private convertToBillDate() {
		var self = this;
		if (!self.billDate().match('/')) {
			self.billDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.billDate()));
		}
	}

	private convertToPickupDate() {
		var self = this;
		if (!self.pickupDate().match('/') && self.pickupDate().length > 0) {
			self.pickupDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.pickupDate()));
		}
	}

	private convertToDeliveryDate() {
		var self = this;
		if (!self.deliveryDate().match('/') && self.deliveryDate().length > 0) {
			self.deliveryDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.deliveryDate()));
		}
	}

	//#endregion
	public openPOToSOCreationClick() {
		var self = this;
		self.uvbToSoClick = true;
		self.obcvendorBillOptionList.getOptionsById(7).enabled(false);
		self.openPOToSOCreation();
	}
	//To Open PO To SO Div
	// <changeHistory>
	// <id>US22796</id> <by>Baldev Singh Thakur</by> <date>16-06-2016</date> <description>Added logic to check if TruckLoad is checked.</description>
	// </changeHistory>
	public openPOToSOCreation() {
		var self = this;

		self.purchaseOrderToSalesOrederViewModel.pickupDate('');
		self.purchaseOrderToSalesOrederViewModel.isForeignBolChecked(self.obcvendorBillOptionList.getOptionsById(7).selected());
		if (self.uvbToSoClick || self.purchaseOrderToSalesOrederViewModel.isForeignBolChecked()) {
			if ($(".POToSO").hasClass("POToSO-div-none") && self.count !== 0) {
				$(".POToSO-div-none").hide('slide', { direction: 'right' }, 200);
				$(".POToSO").removeClass("POToSO-div-none");
				self.obcvendorBillOptionList.getOptionsById(7).enabled(true);
			}
			else {
				$(".POToSO").addClass("POToSO-div-none");
				$(".POToSO-div-none").show('slide', { direction: 'right' }, 200);

				self.purchaseOrderToSalesOrederViewModel.pickupDate(self.pickupDate());
				self.purchaseOrderToSalesOrederViewModel.carrierName(self.vendorName());
				self.purchaseOrderToSalesOrederViewModel.carrierId(self.vendorId());
				self.purchaseOrderToSalesOrederViewModel.proNumber(self.proNumber());
				self.purchaseOrderToSalesOrederViewModel.vendorBillId(self.vendorBillId());
				// ###START: US22796
				if (self.purchaseOrderToSalesOrederViewModel.isForeignBolChecked()) {
					self.purchaseOrderToSalesOrederViewModel.isPoToSo(false);
				}
				else {
					self.purchaseOrderToSalesOrederViewModel.isPoToSo(self.isTruckLoadVisible);

					// ###START: DE23442
					if (self.purchaseOrderToSalesOrederViewModel.isTruckLoadChecked() && !self.isTruckLoadVisible) {
						self.purchaseOrderToSalesOrederViewModel.isTruckLoadChecked(self.isTruckLoadVisible)
                        }

					// ###END: DE23442
				}

				// ###END: US22796
			}
			self.uvbToSoClick = false;
		}
		else {
			//By this count we are holding this view on reload and save click
			if ($(".POToSO").hasClass("POToSO-div-none") && self.count !== 0) {
				if (!self.isForeignBolSelected()) {
					$(".POToSO-div-none").hide('slide', { direction: 'right' }, 200);
					$(".POToSO").removeClass("POToSO-div-none");
				}
			}
			//else if (!self.purchaseOrderToSalesOrederViewModel.isForeignBolChecked() && self.count !== 0) {
			//}
			//else if (self.purchaseOrderToSalesOrederViewModel.isForeignBolChecked() && self.count === 0 && self.isForeignBolSelected()) {
			//}
			//else {
			//    $(".POToSO").addClass("POToSO-div-none");
			//    $(".POToSO-div-none").show('slide', { direction: 'right' }, 200);

			//    self.purchaseOrderToSalesOrederViewModel.pickupDate(self.pickupDate());
			//    self.purchaseOrderToSalesOrederViewModel.carrierName(self.vendorName());
			//    self.purchaseOrderToSalesOrederViewModel.carrierId(self.vendorId());
			//    self.purchaseOrderToSalesOrederViewModel.proNumber(self.proNumber());
			//    self.purchaseOrderToSalesOrederViewModel.vendorBillId(self.vendorBillId());
			//}
		}
		//By this count we are holding this view on reload and save click
		self.count++;
	}
	//#endregion

	//Stop Timer Functionality
	//public onStopTimer() {
	//	var self = this;
	//	clearInterval(self.myTimer);
	//	var time = self.timerStoppedTimeRemaining;
	//	self.isStopTimerClicked(false);
	//	self.StopTimer(true);
	//	self.startAndStopTimer(time);

	//	self.purchaseOrderClient.DeactivateAgentNotificationForVendorBill(self.vendorBillId(), () => {
	//		self.purchaseOrderToSalesOrederViewModel.customerSearchList.isEnable(true);
	//		self.isUVBAssociatedToCustomer(true);
	//		self.sendNotificationOnStopTimer(self.purchaseOrderToSalesOrederViewModel.customerSearchList.id());
	//	}, () => { });
	//}

	//private sendNotificationOnStopTimer(customerId) {
	//	var self = this;
	//	self.purchaseOrderClient.SendAgentNotificationOnStopTimer(customerId, self.vendorBillId(), () => {
	//	}, () => { });
	//}
	//End Stop Timer Functionality

	//#region Life Cycle Event
	public activate() {
		return true;
	}

	//** Using for focus cursor on last cycle for focusing in vendor name
	public compositionComplete() {
	}

	// ###START: US22796
	// This method is used to check if the TruckLoad Checkbox is visible
	private checkCarrierExistsInTL(carrierId) {
		var self = this;

		if (carrierId <= 0)
			return;

		var successCallBack = function (data) {
			self.isTruckLoadVisible = data;
		},

			failureCallBack = function (data) {
				self.isTruckLoadVisible = false;
			}

			self.purchaseOrderClient.checkIfCarrierExistsInTL(carrierId, successCallBack, failureCallBack);
	}

	// ###END: US22796

	public cleanup() {
		var self = this;

		self.proNumber.extend({ validatable: false });
		self.destinationZip.extend({ validatable: false });
		self.originZip.extend({ validatable: false });
		self.billDate.extend({ validatable: false });
		self.vendorNameSearchList.cleanUp();
		self.purchaseOrderToSalesOrederViewModel.cleanup();
		for (var property in self) {
			if (property != "cleanup")
				delete self[property];
		}
		delete self;
	}
	//#endregion
}