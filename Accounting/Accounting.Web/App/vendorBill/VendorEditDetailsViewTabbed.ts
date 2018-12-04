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
import _refVendorAddress = require('vendorBill/VendorAddressView');
import _refVendorItem = require('vendorBill/VendorBillItemView');
import _refVendorBill = require('vendorBill/VendorBillDetailsView');
import _refVendorBillNotes = require('vendorBill/VendorBillNotesView');
import _refVendorBillPayments = require('vendorBill/VendorBillPaymentDetails');
import _refVendorBillLinks = require('vendorBill/VendorBillLinks');
import _refVendorBillMASNotes= require('vendorBill/VendorBillMASNotes')
import refVendorBillClient = require('services/client/VendorBillClient');
import _refVendorBillModel = require('services/models/vendorBill/VendorBill');
import _refVendorBillItemModel = require('services/models/vendorBill/VendorBillItemDetails');
import _refVendorBillContainerModel = require('services/models/vendorBill/VendorBillContainer');
import _refVendorBillAddressModel = require('services/models/vendorBill/VendorBillAddress');
import _refVendorBillNotesModel = require('services/models/vendorBill/VendorBillNote');
import _reportViewer = require('../templates/reportViewerControlV2');
import refEnums = require('services/models/common/Enums');
import refVendorNameSearch = require('services/models/common/searchVendorName');
import refsaveStatusIndicatorControl = require('templates/saveStatusIndicatorControl');
import _refVendorHistory = require('vendorBill/VendorBillHistory');
//#endregion

/*
** <summary>
** Vendor Edit details View Model.
** </summary>
** <createDetails>
** <id>US8214</id> <by>Satish</by> <date>27th May, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id>US9669</id> <by>Achal Rastogi</by> <date>6-3-2014</date>
** </changeHistory>
*/

export class VendorBillEditDetailsViewModel {
	//#region Members
	public vendorBillDetailsViewModel: _refVendorBill.VendorBillDetailsViewModel;
	public vendorAddressViewModel: _refVendorAddress.VendorAddressViewModel;
	public vendorBillItemViewModel: _refVendorItem.VendorBillItemViewModel;
	public vendorBillNotesViewModel: _refVendorBillNotes.vendorBillNotesViewModel;
	public vendorBillPaymentDetailsViewModel: _refVendorBillPayments.VendorBillPaymentDetailsViewModel;

	public vendorBillLinksViewModel: _refVendorBillLinks.VendorBillLinksViewModel;
	public vendorBillMASNoteViewModel: _refVendorBillMASNotes.VendorBillMASNoteViewModel;
	public saveStatusIndicatorControl: refsaveStatusIndicatorControl.SaveStatusIndicatorControl = new refsaveStatusIndicatorControl.SaveStatusIndicatorControl();
	vendorBillClient: refVendorBillClient.VendorBillClient = new refVendorBillClient.VendorBillClient();
	public vendorBillItemModel: _refVendorItem.VendorBillItemViewModel;
	public vendorBillHistoryViewModel: _refVendorHistory.VendorBillHistory;

	carrierId: KnockoutObservable<number> = ko.observable(0);
	canForceAttach: boolean = false;
	isSubBill: boolean = false;
	isUpdateProNo: boolean = false;
	isPoWithBol: boolean = false;
	rowaffected: number = 0;
	// to show the progress bar
	listProgress: KnockoutObservable<boolean> = ko.observable(false);
	listProgressPayment: KnockoutObservable<boolean> = ko.observable(false);
	listProgressLinks: KnockoutObservable<boolean> = ko.observable(false);
	listProgressMas: KnockoutObservable<boolean> = ko.observable(false);
	listProgressHistory: KnockoutObservable<boolean> = ko.observable(false);
	// Check vendor bill is in intermediate state
	isPresentInIntermediate: boolean = false;
	// Check vendor bill is in mas status permanent
	isPresentInMasPermanent: boolean = false;
	// To get the logged in user
	currentUser: KnockoutObservable<IUser> = ko.observable();
	// flag for navigation to show changes
	isChange: KnockoutObservable<boolean> = ko.observable(false);
	//src of expand
	expandSourceImage: KnockoutObservable<string> = ko.observable('Content/images/expand.png');
	//src of collapse
	collapseSourceImage: KnockoutObservable<string> = ko.observable('Content/images/collapse.png');

	isNotAtLoadingTime: boolean = false;

	public onSwitch: Function;

	// for validation
	public isValidVendorBill: boolean = false;
	public isValidAddress: boolean = false;
	public isValidItems: boolean = false;

	//## to expand all accordions
	public expandAllAccordions: () => any;

	//## to collapse all accordions
	public collapseAllAccordions: () => any;

	// keep the suborder count
	subOrderCount: number = 0;
	// To disable Create SubBill Button
	isSubOrderBill: KnockoutObservable<boolean> = ko.observable(true);

	// keep the header of vendor bill whether it's I term or T term
	vendorBillHeader: KnockoutObservable<string> = ko.observable('Vendor Bill');

	// to keep the visibility of create lost bill button
	isCreateLostBillVisible: KnockoutObservable<boolean> = ko.observable(false);

	// keep the vendor bill container object
	originalVendorBillContainer: IVendorBillContainer = new _refVendorBillContainerModel.Models.VendorBillContainer();

	// to keep the visibility of dispute won/lost bill button
	isDisputeWonLostVisible: KnockoutObservable<boolean> = ko.observable(true);

	// to keep the clicked status of dispute won / lost button
	isDisputeWonLostButtonClicked: boolean = false;

	// to keep the bill status of dispute won/lost button
	billStatusOfDisputeWonLostButtonClicked: number = 0;
	//#endregion

	//#region Constructor
	constructor() {
		var self = this;

		self.onSwitch = () => {
			_router.navigate("#/VendorBillDetails");
		}

		//Call to populate Shipper and consignee Address
		self.vendorBillDetailsViewModel = new _refVendorBill.VendorBillDetailsViewModel((shipperAddress: IVendorBillAddress) => {
			self.vendorAddressViewModel.populateShipperAddress(shipperAddress);
		}, (consigneeAddress: IVendorBillAddress) => {
				self.vendorAddressViewModel.populateConsigneeAddress(consigneeAddress);
			},
			//Call back to expand either items or Address when user press 'TAB' form reference number.
			() => {
				//this.collapseView('collapseVendorBill');
				this.expandView('collapseAddress');
				self.onAddressClick();
			},
			(isDisputeStatus: boolean) => {
				if (isDisputeStatus) {
					self.vendorBillItemViewModel.isDisputeAmountEditable(true);
				}
			});

		self.vendorBillItemViewModel = new _refVendorItem.VendorBillItemViewModel((totalCost: number, totalWeght: number, totalPices: number, totalDisputeAmount: number) => {
			self.vendorBillDetailsViewModel.totalWeigth(totalWeght);
			self.vendorBillDetailsViewModel.vendorAmount(totalCost);
			self.vendorBillDetailsViewModel.totalPieces(totalPices);
			self.vendorBillDetailsViewModel.disputedAmount(totalDisputeAmount);
		});

		self.vendorAddressViewModel = new _refVendorAddress.VendorAddressViewModel((originZip: string, destinationZip: string) => {
			self.vendorBillDetailsViewModel.originZip(originZip);
			self.vendorBillDetailsViewModel.destinationZip(destinationZip);
		},
			//Call back to expand either items or Address when user press 'TAB' form reference number.
			() => {//collapseAddress
				self.collapseView('collapseAddress');
				//if BOL number is exists then expand items;
				self.expandView('collapseItems');
				$('#drpItems').focus();
			});

		self.vendorBillPaymentDetailsViewModel = new _refVendorBillPayments.VendorBillPaymentDetailsViewModel();

		self.vendorBillNotesViewModel = new _refVendorBillNotes.vendorBillNotesViewModel();

		self.vendorBillLinksViewModel = new _refVendorBillLinks.VendorBillLinksViewModel();

		self.vendorBillMASNoteViewModel = new _refVendorBillMASNotes.VendorBillMASNoteViewModel();

		self.vendorBillHistoryViewModel = new _refVendorHistory.VendorBillHistory();

		// to detect changes for vendor Bill Items.
		self.vendorBillItemViewModel.onChangesMade = (dirty) => {
			self.changesDetected(dirty);
		}

		if (!self.currentUser()) {
			// Get the logged in user for name for new note}
			_app.trigger("GetCurrentUserDetails", (currentUser: IUser) => {
				self.currentUser(currentUser);
			});
		}

		//#region Call change functions
		// for address
		self.vendorAddressViewModel.onChangesMade = function (dirty) {
			self.changesDetected(dirty);
		}

		// for shipper address
		self.vendorAddressViewModel.shipperLocation.onChangesMade = function (dirty: boolean) {
			self.changesDetected(dirty);
		}

		//for consignee address
		self.vendorAddressViewModel.consigneeLocation.onChangesMade = function (dirty: boolean) {
			self.changesDetected(dirty);
		}

		// For vendor Bill section
		self.vendorBillDetailsViewModel.onChangesMade = function (dirty) {
			self.changesDetected(dirty);
		}

		// for vendor name in vendor bill section
		self.vendorBillDetailsViewModel.vendorNameSearchList.onChangesMade = function (dirty: boolean) {
			self.changesDetected(dirty);
		}

		//for buttons in vendor bill section
		self.vendorBillDetailsViewModel.obcvendorBillOptionList.onChangesMade = function (dirty) {
			self.changesDetected(dirty);
		}

		// for Vendor bill Notes section

		self.vendorBillNotesViewModel.onChangesMade = function (dirty: boolean) {
			self.changesDetected(dirty);
		}

		//## function to disable international shipment  checkbox of address view if bill status is cleared.
		self.vendorBillDetailsViewModel.selectedbillStatus.subscribe((newValue) => {
			if (newValue === refEnums.Enums.VendorBillStatus.Cleared.ID) {
				if (self.vendorAddressViewModel.shouldBeReadOnly()) {
					self.vendorAddressViewModel.isBillStatusCleared(true);
				}
				else
					self.vendorAddressViewModel.isBillStatusCleared(false);
			}

			else {
				if (self.vendorAddressViewModel.shouldBeReadOnly()) {
					self.vendorAddressViewModel.isBillStatusCleared(true);
				}
				else
					self.vendorAddressViewModel.isBillStatusCleared(false);
			}
		});

		//## Expands all the accordions in one click
		self.expandAllAccordions = function () {
			var self = this;
			//self.expandView('collapseVendorBill');
			self.expandView('collapseAddress');
			self.expandView('collapseItems');
			self.expandView('collapseNotes');
			self.expandSourceImage('Content/images/expand_hit.png');
			self.collapseSourceImage('Content/images/collapse.png');
			// first load the data then expand for links, payments, mas notes and history
			self.getShipmentLinks();
			self.expandView('collapseLinks');
			self.getPaymentDetails();
			self.expandView('collapsePaymentDetails');
			self.getShipmentMasNotes();
			self.expandView('collapseMASNotes');
			self.getHistorydetails();
			self.expandView('collapseHistory');
		}

		//## Collapse all the accordions in one click
		self.collapseAllAccordions = function () {
			var self = this;
			//self.collapseView('collapseVendorBill');
			self.collapseView('collapseAddress');
			self.collapseView('collapseItems');
			self.collapseView('collapseNotes');
			self.collapseView('collapsePaymentDetails');
			self.collapseView('collapseLinks');
			self.collapseView('collapseHistory');
			self.collapseView('collapseMASNotes');
			self.collapseSourceImage('Content/images/collapse_hit.png');
			self.expandSourceImage('Content/images/expand.png');
		}

		//#endregion
		return self;
	}
	//#endregion

	//#region Internal Methods

	//#region Save

	// For Validating
	public onSave() {
		var self = this;
		// Show all the validation as once (All section validation)
		var isVendorBillValid = self.vendorBillDetailsViewModel.validateBill(),
			isVendorAddressesValid = self.vendorAddressViewModel.validateAddresses(),
			isVendorItemValid = self.vendorBillItemViewModel.validateItems();

		//close all tab where we are not using required field
		if ($('#collapseNotes').hasClass('in')) {
			$('#collapseNotes').collapse('toggle');
			$('#AchorcollapseNotes').addClass('collapsed');
		}
		if ($('#collapsePaymentDetails').hasClass('in')) {
			$('#collapsePaymentDetails').collapse('toggle');
			$('#AchorcollapsePaymentDetails').addClass('collapsed');
		}
		if ($('#collapseLinks').hasClass('in')) {
			$('#collapseLinks').collapse('toggle');
			$('#AchorcollapseLinks').addClass('collapsed');
		}
		if ($('#collapseHistory').hasClass('in')) {
			$('#collapseHistory').collapse('toggle');
			$('#AchorcollapseHistory').addClass('collapsed');
		}
		if ($('#collapseMASNotes').hasClass('in')) {
			$('#collapseMASNotes').collapse('toggle');
			$('#AchorcollapseMASNotes').addClass('collapsed');
		}
		// Tab will be open on validation
		if (isVendorAddressesValid) {
			$('#collapseAddress').collapse('show');
			$('#AchorcollapseAddress').removeClass('collapsed');
			self.isValidAddress = false;
		}
		else {
			self.isValidAddress = true;
			self.collapseAchorcAddress();
		}

		if (isVendorItemValid) {
			$('#collapseItems').collapse('show');
			$('#AchorcollapseItems').removeClass('collapsed');
			self.isValidItems = false;
		}
		else {
			self.isValidItems = true;
			self.colapseAchorItems();
		}
		// Validate each section data
		if (!(!isVendorBillValid && self.isValidAddress && self.isValidItems)) {
			return;
		}
		else {
			if (self.vendorBillDetailsViewModel.carrierId() != 0) {
				self.saveVendorBill();
				self.saveStatusIndicatorControl.applySettings(refEnums.Enums.SavingStatus.ChangesSaved.ID);
				self.isChange(false);
				//window.ischange = false;
				_app.trigger("IsBIDirtyChange", self.isChange());
			} else {
				_app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: ApplicationMessages.Messages.CarrierValidationMessage }, 'slideDown');
			}
		}
	}

	//To collapse one by one if we have no validation in VendorBill Address and Item
	public collapseAchorVendorBill() {
		var self = this;
		if ($('#collapseVendorBill').hasClass('in') && self.isValidVendorBill) {
			$('#collapseVendorBill').collapse('toggle');
			$('#AchorcollapseVendorBill').addClass('collapsed');
		}
	}
	public collapseAchorcAddress() {
		var self = this;
		if ($('#collapseAddress').hasClass('in') && self.isValidAddress) {
			$('#collapseAddress').collapse('toggle');
			$('#AchorcollapseAddress').addClass('collapsed');
		}
	}
	public colapseAchorItems() {
		var self = this;
		if ($('#collapseItems').hasClass('in') && self.isValidItems) {
			$('#collapseItems').collapse('toggle');
			$('#AchorcollapseItems').addClass('collapsed');
		}
	}

	// For Saving Vendor Bill Detail
	public saveVendorBill() {
		var self = this;

		// Validate the invalid amount and also validate the dispute data 
		if (self.validateCostDisputeAmount() && self.vendorBillDetailsViewModel.validateDisputeData()) {
			// Validate the data and then check the PRO numbers and then calls the save service
			if (self.checkStatusIsDisputeWonOrDisputeLost()) {
				self.checkStatusIsPendingOrNot();
			}
		}
	}

	// Gets the data from all the different view model and sends those to service
	public setUpModelAndSave() {
		var self = this;
		var vendorBillData = new _refVendorBillContainerModel.Models.VendorBillContainer();
		self.listProgress(true);
		vendorBillData.VendorBill = self.getVendorBillDetails();
		vendorBillData.VendorBillAddress = self.getVendorBillAddress();
		vendorBillData.VendorBillItemsDetail = self.getVendorBillItemsDetails();
		vendorBillData.VendorBillNotes = self.getVendorBillNotes();

		refVendorBillClient.VendorBillClient.prototype.SaveVendorBillDetail(vendorBillData, (message) => {
			// Saving successful callback
			self.listProgress(false);
			_app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: ApplicationMessages.Messages.SavedSuccessfullyMessage }, 'slideDown');
			_app.trigger('closeActiveTab');
			_app.trigger("openVendorBill", message, self.vendorBillDetailsViewModel.proNumber(), 'VendorBillEdit', (callback) => {
				if (!callback) {
					return;
				}
			});
		}, (message) => {
				// Saving failed call back
				self.listProgress(false);
				_app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: message }, 'slideDown');
			});
	}

	// Gets the vendor bill details
	private getVendorBillDetails(): IVendorBill {
		var self = this;

		var vendorBillDetails = new _refVendorBillModel.Models.VendorBill();

		// For new vendor bill id should be 0 and the bill status will be pending (0)
		vendorBillDetails.BillStatus = self.isDisputeWonLostButtonClicked ? self.billStatusOfDisputeWonLostButtonClicked : self.vendorBillDetailsViewModel.selectedbillStatus();
		vendorBillDetails.VendorBillId = self.vendorBillDetailsViewModel.vendorBillId();
		vendorBillDetails.CarrierId = self.vendorBillDetailsViewModel.carrierId();
		vendorBillDetails.Amount = self.vendorBillDetailsViewModel.vendorAmount();
		vendorBillDetails.BillDate = self.vendorBillDetailsViewModel.billDate();
		vendorBillDetails.BolNumber = self.vendorBillDetailsViewModel.bolNumber();
		vendorBillDetails.DeliveryDate = self.vendorBillDetailsViewModel.deliveryDate();
		vendorBillDetails.DestinationZip = self.vendorBillDetailsViewModel.destinationZip();
		vendorBillDetails.MainVendorBolNumber = self.vendorBillDetailsViewModel.bolNumber();
		vendorBillDetails.ProNumber = self.vendorBillDetailsViewModel.proNumber();
		vendorBillDetails.SalesOrderId = self.vendorBillDetailsViewModel.salesOrderId;
		vendorBillDetails.IsPurchaseOrder = self.isPoWithBol;
		vendorBillDetails.UpdatePRONumberInShipment = self.isUpdateProNo;
		vendorBillDetails.ProcessDetails = self.vendorAddressViewModel.processDetails();
		vendorBillDetails.OriginalBOLNumber = self.vendorBillDetailsViewModel.originalBolNumber;

		var selecetedList = self.vendorBillDetailsViewModel.obcvendorBillOptionList.getSelectedOptions(true);

		var isForceAttachOptionSelecteed = false;
		var isMakeInactiveSelecteed = false;
		var isQuickPaySelecteed = false;
		var isHoldvendorBillSelecetedSelecteed = false;

		selecetedList.forEach((item) => {
			if (item.id === refEnums.Enums.vendorBillOptionConstant.FroceAttach) {
				isForceAttachOptionSelecteed = true;
			} else if (item.id === refEnums.Enums.vendorBillOptionConstant.HoldVendorBill) {
				isHoldvendorBillSelecetedSelecteed = true;
			} else if (item.id === refEnums.Enums.vendorBillOptionConstant.Quickpay) {
				isQuickPaySelecteed = true;
			} else if (item.id === refEnums.Enums.vendorBillOptionConstant.MakeInactive) {
				isMakeInactiveSelecteed = true;
			}
		});

		vendorBillDetails.ForceAttach = isForceAttachOptionSelecteed || self.canForceAttach;
		vendorBillDetails.HoldVendorBill = isHoldvendorBillSelecetedSelecteed;
		vendorBillDetails.QuickPay = isQuickPaySelecteed;
		vendorBillDetails.MakeInactive = isMakeInactiveSelecteed;
		vendorBillDetails.Memo = self.vendorBillDetailsViewModel.memo();
		vendorBillDetails.OriginZip = self.vendorBillDetailsViewModel.originZip();
		vendorBillDetails.PoNumber = self.vendorBillDetailsViewModel.poNumber();
		vendorBillDetails.ReferenceNumber = self.vendorBillDetailsViewModel.refNumber();
		vendorBillDetails.TotalPieces = self.vendorBillDetailsViewModel.totalPieces();
		vendorBillDetails.TotalWeight = self.vendorBillDetailsViewModel.totalWeigth();
		vendorBillDetails.VendorName = self.vendorBillDetailsViewModel.vendorName();
		vendorBillDetails.UpdatedBy = self.currentUser().GlobalNetUserId;
		vendorBillDetails.UpdatedDate = self.vendorBillDetailsViewModel.updatedDate;
		vendorBillDetails.DisputeNotes = self.vendorBillDetailsViewModel.disputeNotes();
		vendorBillDetails.MainVendorBolNumber = self.vendorBillDetailsViewModel.mainBolNumber();
		vendorBillDetails.IDBFlag = self.originalVendorBillContainer.VendorBill.IDBFlag;
		vendorBillDetails.DisputedAmount = self.vendorBillDetailsViewModel.disputedAmount();
		vendorBillDetails.DisputedDate = self.vendorBillDetailsViewModel.disputedDate();


		return vendorBillDetails;
	}

	// Gets the vendor bill address details
	private getVendorBillAddress(): Array<IVendorBillAddress> {
		var self = this;

		var addresses: Array<_refVendorBillAddressModel.Models.VendorBillAddress>;
		addresses = ko.observableArray([])();

		var vendorShipperAddress = new _refVendorBillAddressModel.Models.VendorBillAddress();
		var vendorConsigneeAddress = new _refVendorBillAddressModel.Models.VendorBillAddress();
		var vendorBillToAddress = new _refVendorBillAddressModel.Models.VendorBillAddress();

		// Create shipper address model
		vendorShipperAddress.Id = self.vendorAddressViewModel.shipperAddressId();
		vendorShipperAddress.VendorBillId = self.vendorBillDetailsViewModel.vendorBillId();
		vendorShipperAddress.Street = self.vendorAddressViewModel.shipperAddress1();
		vendorShipperAddress.Street2 = self.vendorAddressViewModel.shipperAddress2();
		vendorShipperAddress.CompanyName = self.vendorAddressViewModel.shipperCompanyName();
		vendorShipperAddress.ContactPerson = self.vendorAddressViewModel.shipperContactPerson();
		vendorShipperAddress.City = self.vendorAddressViewModel.shipperLocation.location().City;
		vendorShipperAddress.State = self.vendorAddressViewModel.shipperLocation.location().State;
		vendorShipperAddress.ZipCode = self.vendorAddressViewModel.shipperLocation.location().Zip;
		vendorShipperAddress.Phone = self.vendorAddressViewModel.shipperPhone();
		vendorShipperAddress.Fax = self.vendorAddressViewModel.shipperFax();

		vendorShipperAddress.AddressType = 1;

		// Create consignee address model
		vendorConsigneeAddress.Id = self.vendorAddressViewModel.consigneeAddressId();
		vendorConsigneeAddress.VendorBillId = self.vendorBillDetailsViewModel.vendorBillId();
		vendorConsigneeAddress.Street = self.vendorAddressViewModel.consigneeAddress1();
		vendorConsigneeAddress.Street2 = self.vendorAddressViewModel.consigneeAddress2();
		vendorConsigneeAddress.CompanyName = self.vendorAddressViewModel.consigneeCompanyName();
		vendorConsigneeAddress.ContactPerson = self.vendorAddressViewModel.consigneeContactPerson();
		vendorConsigneeAddress.City = self.vendorAddressViewModel.consigneeLocation.location().City;
		vendorConsigneeAddress.State = self.vendorAddressViewModel.consigneeLocation.location().State;
		vendorConsigneeAddress.ZipCode = self.vendorAddressViewModel.consigneeLocation.location().Zip;
		vendorConsigneeAddress.Phone = self.vendorAddressViewModel.consigneePhone();
		vendorConsigneeAddress.Fax = self.vendorAddressViewModel.consigneeFax();
		vendorConsigneeAddress.AddressType = 2;

		// Create Bill To address model
		vendorBillToAddress.Id = self.vendorAddressViewModel.billToAddressId();
		vendorBillToAddress.VendorBillId = self.vendorBillDetailsViewModel.vendorBillId();
		vendorBillToAddress.Street = self.vendorAddressViewModel.billToAddress1();
		vendorBillToAddress.Street2 = self.vendorAddressViewModel.billToAddress2();
		vendorBillToAddress.CompanyName = self.vendorAddressViewModel.billToCompanyName();
		vendorBillToAddress.City = self.vendorAddressViewModel.billToLocation.location().City;
		vendorBillToAddress.State = self.vendorAddressViewModel.billToLocation.location().State;
		vendorBillToAddress.ZipCode = self.vendorAddressViewModel.billToLocation.location().Zip;
		vendorBillToAddress.Phone = self.vendorAddressViewModel.billToPhone();
		vendorBillToAddress.Fax = self.vendorAddressViewModel.billToFax();
		vendorBillToAddress.AddressType = 3;

		addresses.push(vendorShipperAddress);
		addresses.push(vendorConsigneeAddress);
		addresses.push(vendorBillToAddress);

		return addresses;
	}

	// Gets the vendor bill Item details
	private getVendorBillItemsDetails(): Array<IVendorBillItem> {
		var self = this;

		var vendorBillItems: Array<_refVendorBillItemModel.Models.VendorBillItemDetails>;
		vendorBillItems = ko.observableArray([])();

		self.vendorBillItemViewModel.vendorBillItemsList().forEach((item, collection) => {
			var vendorBillItem = new _refVendorBillItemModel.Models.VendorBillItemDetails();
			vendorBillItem.Cost = item.cost();
			vendorBillItem.DimensionHeight = item.dimensionHeight();
			vendorBillItem.DimensionLength = item.dimensionLength();
			vendorBillItem.DimensionWidth = item.dimensionWidth();
			vendorBillItem.Id = item.id();
			vendorBillItem.PackageTypeId = item.selectedPackageType();
			vendorBillItem.PieceCount = item.pieceCount();
			vendorBillItem.SelectedClassType = item.selectedClassType();
			vendorBillItem.SelectedItemTypes = item.selectedItemTypes();
			vendorBillItem.UserDescription = item.userDescription();
			vendorBillItem.Weight = item.weight();
			vendorBillItem.DisputeAmount = item.disputeAmount();
			vendorBillItem.DisputeLostAmount = item.disputeLostAmount();

			vendorBillItems.push(vendorBillItem);
		});

		return vendorBillItems;
	}

	// Gets the vendor bill notes details
	private getVendorBillNotes(): Array<IVendorBillNote> {
		var self = this,
			commonUtils = new Utils.Common(),
			vendorBillNotes: Array<_refVendorBillNotesModel.Models.VendorBillNote>,
			notesDescription: string,
			itemNew: _refVendorBillNotes.vendorBillNoteItem;
		vendorBillNotes = ko.observableArray([])();

		self.vendorBillNotesViewModel.vendorBillNoteItems().forEach((item) => {
			vendorBillNotes.push(self.addNoteItem(item));
		});

		// add dispute notes if it's there 
		if (commonUtils.isNullOrEmptyOrWhiteSpaces(self.vendorBillDetailsViewModel.disputeNotes())) {
			var disputeNotes = $.grep(self.originalVendorBillContainer.VendorBillNotes, (e) => { return e.NotesType === 4; });

			if (disputeNotes && disputeNotes.length > 0) {
				itemNew = new _refVendorBillNotes.vendorBillNoteItem(disputeNotes[0].Id, self.vendorBillDetailsViewModel.vendorBillId(), self.vendorBillDetailsViewModel.disputeNotes(), disputeNotes[0].NotesBy, disputeNotes[0].NotesDate, disputeNotes[0].NoteTypeName);
			} else {
				itemNew = new _refVendorBillNotes.vendorBillNoteItem(0, self.vendorBillDetailsViewModel.vendorBillId(), self.vendorBillDetailsViewModel.disputeNotes(), self.currentUser().FullName, Date.now(), "Dispute");
			}

			vendorBillNotes.push(self.addNoteItem(itemNew));
		}

		// if status is changed then add the notes

		if (self.vendorBillDetailsViewModel.originalBillStatus !== self.vendorBillDetailsViewModel.selectedbillStatus()) {
			notesDescription = "Vendor Bill Status Change: " + commonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, self.vendorBillDetailsViewModel.originalBillStatus.toString()) + " - " +
			commonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, self.vendorBillDetailsViewModel.selectedbillStatus().toString());
			itemNew = new _refVendorBillNotes.vendorBillNoteItem(0, self.vendorBillDetailsViewModel.vendorBillId(), notesDescription, self.currentUser().FullName, Date.now(), "System");
			vendorBillNotes.push(self.addNoteItem(itemNew));
		}

		// if dispute won then add the notes
		if (self.isDisputeWonLostButtonClicked) {
			notesDescription = "User " + self.currentUser().FullName + " Changed Bill from " + commonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, self.vendorBillDetailsViewModel.selectedbillStatus().toString()) + " to " +
			commonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, self.billStatusOfDisputeWonLostButtonClicked.toString());
			itemNew = new _refVendorBillNotes.vendorBillNoteItem(0, self.vendorBillDetailsViewModel.vendorBillId(), notesDescription, self.currentUser().FullName, Date.now(), "System");
			vendorBillNotes.push(self.addNoteItem(itemNew));
		}

		return vendorBillNotes;
	}

	// function to use get item note model
	private addNoteItem(item: _refVendorBillNotes.vendorBillNoteItem) {
		var itemNote = new _refVendorBillNotesModel.Models.VendorBillNote();

		// For the entity ID will be filled by server
		itemNote.Id = item.id();
		itemNote.EntityId = item.entityId();
		itemNote.NotesBy = item.noteBy();
		itemNote.NotesDate = new Date(item.noteDate());
		itemNote.NotesDescription = item.description();
		itemNote.NoteTypeName = item.noteType();

		return itemNote;
	}
	//#endregion Internal Methods

	//#region Validation

	//To Validated Vendor Bill
	public validateVendorBill() {
		var self = this;
		var commonUtils = new Utils.Common();

		// Check if BOL no. having spaces in between
		if (commonUtils.isNullOrEmptyOrWhiteSpaces(self.vendorBillDetailsViewModel.bolNumber())) {
			if (self.vendorBillDetailsViewModel.bolNumber().indexOf(' ') > 0) {
				_app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: ApplicationMessages.Messages.SubOrderBOL }, 'slideDown');
				return false;
			}
		}

		// Check for the negative vendor bill amount
		if (self.vendorBillDetailsViewModel.vendorAmount() < 0) {
			_app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: ApplicationMessages.Messages.BillAmountShouldNotbeNegative }, 'slideDown');
			return false;
		}

		//To Check Duplicate Pro no
		if (self.vendorBillDetailsViewModel.listCheck != null && self.vendorBillDetailsViewModel.listCheck()[0] === true) {
			_app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: ApplicationMessages.Messages.PROAlreadyExists }, 'slideDown');
			return false;
		}

		self.checkForceAttachOptions();

		return true;
	}

	// Shows the message box as pr the given title and message
	public showConfirmationMessage(message: string, title: string, fisrtButtoName: string, secondButtonName: string, yesCallBack: () => boolean, noCallBack: () => boolean) {
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

	// When we are making the bill cleared then we have to check the difference of SO cost and VB Cost
	// If VB Cost-SO Cost > 9 then we have to show an message that bill is clears with $(cost difference) Do you want to continue?
	// If yes then save as usual
	// If no then he can adjust cost before saving
	public isNegativeMargin() {
		var self = this;

		// if status is Cleared and Short paid
		if ((self.vendorBillDetailsViewModel.selectedbillStatus() === refEnums.Enums.VendorBillStatus.Cleared.ID ||
			self.vendorBillDetailsViewModel.selectedbillStatus() === refEnums.Enums.VendorBillStatus.ShortPaid.ID) && !self.isPresentInMasPermanent) {
			var surPlusVendorBillAmount = 0,
				totalVendorBillCost = 0,
				costDifference = 0,
				actualProfit = 0,
				totalProfit = 0,
				grossProfit = 0,
				amountDiffrenceToShowOnValidationMessage = 0;

			surPlusVendorBillAmount = self.vendorBillDetailsViewModel.vendorAmount() - self.vendorBillDetailsViewModel.originalVendorAmount;
			totalVendorBillCost = self.vendorBillDetailsViewModel.actualCost() + surPlusVendorBillAmount;
			var totalCalculatedRevenue = self.vendorBillDetailsViewModel.totalRevenue();
			var totalEstimateCost = self.vendorBillDetailsViewModel.totalCost();
			actualProfit = totalCalculatedRevenue - totalVendorBillCost;
			totalProfit = self.vendorBillDetailsViewModel.actualProfit() - surPlusVendorBillAmount;
			grossProfit = totalCalculatedRevenue - totalEstimateCost;
			costDifference = totalVendorBillCost - self.vendorBillDetailsViewModel.totalCost();
			amountDiffrenceToShowOnValidationMessage = grossProfit - actualProfit;
			if (costDifference > 9) {
				var message = ApplicationMessages.Messages.NegativeMarginValidation_1 + amountDiffrenceToShowOnValidationMessage.toFixed(2) + '.' + ApplicationMessages.Messages.NegativeMarginValidation_2 + totalProfit + '.' + ApplicationMessages.Messages.NegativeMarginValidation_3;
				self.showConfirmationMessage(message, ApplicationMessages.Messages.ApplicationMessageTitle, "Yes", "No",
					(): boolean => {
						//Add into the notes
						var notesDescription = "The bill is cleared leading to $ " + amountDiffrenceToShowOnValidationMessage.toFixed(2) + " reduction in margin, by " + self.currentUser().FullName + new Date().toString();
						self.vendorBillNotesViewModel.vendorBillNoteItems.push(new _refVendorBillNotes.vendorBillNoteItem(0, self.vendorBillDetailsViewModel.vendorBillId(), notesDescription, self.currentUser().FullName, Date.now(), "General"));
						self.setUpModelAndSave();
						return true;
					},
					(): boolean => {
						if (self.vendorBillDetailsViewModel.selectedbillStatus() !== self.vendorBillDetailsViewModel.originalBillStatus) {
							_app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: ApplicationMessages.Messages.ChangePreviousStatusOnNegativeMargin }, 'slideDown');
						}

						self.vendorBillDetailsViewModel.selectedbillStatus(self.vendorBillDetailsViewModel.originalBillStatus);
						return true;
					});
			}
			else {
				self.setUpModelAndSave();
				return true;
			}
		} else {
			self.setUpModelAndSave();
			return true;
		}
	}

	// Check what is the original status and selected status is pending or not
	// if original status is other than pending and selected status is pending then order will convert into purchase order so show the validation message.
	public checkStatusIsPendingOrNot() {
		var self = this, isBolNoEditable;
		if (self.vendorBillDetailsViewModel.bolNumber() !== self.vendorBillDetailsViewModel.originalBolNumber) {
			self.vendorBillDetailsViewModel.selectedbillStatus(refEnums.Enums.VendorBillStatus.Pending.ID);
			isBolNoEditable = true;
		} else {
			isBolNoEditable = false;
		}

		if (!isBolNoEditable && self.vendorBillDetailsViewModel.selectedbillStatus() === refEnums.Enums.VendorBillStatus.Pending.ID && self.vendorBillDetailsViewModel.originalBillStatus !== refEnums.Enums.VendorBillStatus.Pending.ID) {
			self.showConfirmationMessage(ApplicationMessages.Messages.VendorBillStatusChangedToPending, ApplicationMessages.Messages.ApplicationMessageTitle, "Yes", "No",
				(): boolean => {
					self.ValidateVendorNotes();
					return true;
				},
				(): boolean => {
					return true;
				});
		} else {
			self.ValidateVendorNotes();
			return true;
		}
	}

	// Validates the PRO number
	private ValidatePRONumber() {
		var self = this;
		var existingProNo;
		var commonUtils = new Utils.Common();
		//Check if  Vendor Bill with a Vendor that does not match with the PRO#
		if (commonUtils.isNullOrEmptyOrWhiteSpaces(self.vendorBillDetailsViewModel.bolNumber())) {
			// If BOL exists in the database and if it is not a PO, and also if user does not selected the force attach then need to get the existing PRO number and validate with given
			// If not same then ask to user if he wants to update the same in order as well.
			if (self.vendorBillDetailsViewModel.bolNumber().trim() !== self.vendorBillDetailsViewModel.originalBolNumber) {
				if (self.vendorBillDetailsViewModel.listCheck != null && self.vendorBillDetailsViewModel.listCheck()[1] === true && self.isPoWithBol != true && !self.vendorBillDetailsViewModel.obcvendorBillOptionList.getOptionsById(2).selected()) {
					self.vendorBillClient.getExistingProNo(self.vendorBillDetailsViewModel.bolNumber(), function (data: string) {
						existingProNo = data;
						self.forceAttachMsg(existingProNo);
					});
				} else {
					self.isNegativeMargin();
				}
			} else {
				self.isNegativeMargin();
			}
		}
		else {
			self.isNegativeMargin();
		}
	}

	// Validates the vendor notes, as if user has only written something not clicked on add
	private ValidateVendorNotes() {
		var self = this;

		// Check if notes data is entered but not added in the list
		if (self.vendorBillNotesViewModel.canAdd()) {
			self.showConfirmationMessage(ApplicationMessages.Messages.VendorBillNotesValidationMessage, ApplicationMessages.Messages.ApplicationMessageTitle, "Yes", "No",
				(): boolean => {
					self.validateVendorBill();
					return true;
				},
				(): boolean => {
					return true;
				});
		}
		else {
			self.validateVendorBill();
		}
	}

	// Checks the force attach options and gets the user input
	// And then calls the save service
	private checkForceAttachOptions() {
		var self = this;
		var commonUtils = new Utils.Common();
		if (commonUtils.isNullOrEmptyOrWhiteSpaces(self.vendorBillDetailsViewModel.bolNumber())) {
			if (self.vendorBillDetailsViewModel.listCheck != null && self.vendorBillDetailsViewModel.listCheck()[1] === false) {
				var varMsgBox: Array<IMessageBoxButtonOption> = [
					{
						id: 0,
						name: 'Yes',
						callback: (): boolean => {
							self.isPoWithBol = true;

							// Call next validation
							self.ValidatePRONumber();
							return true;
						},
					},
					{
						id: 1,
						name: 'No',
						callback: (): boolean => {
							self.isPoWithBol = false;
							return true;
						}
					}
				];

				////initialize message box control arguments
				var optionControlArgs: IMessageBoxOption = {
					options: varMsgBox,
					message: ApplicationMessages.Messages.BOLValidationMessage,
					title: ApplicationMessages.Messages.ApplicationMessageTitle
				}
				//Call the dialog Box functionality to open a Popup
				_app.showDialog('templates/messageBox', optionControlArgs, 'slideDown');
			}
			else {
				self.ValidatePRONumber();
			}
		} else {
			self.isNegativeMargin();
		}
	}

	// If at least one item should contains the dispute lost amount.
	private validateDisputeLost() {
		var self = this;
		var validateDispute = true;

		var disputeItems = $.grep(self.originalVendorBillContainer.VendorBillItemsDetail, (e) => { return e.DisputeLostAmount !== null && e.DisputeLostAmount > 0; });

		if (disputeItems && disputeItems.length === 0) {
			validateDispute = false;
		}

		return validateDispute;
	}

	// validate cost and dispute amount
	private validateCostDisputeAmount() {
		var self = this,
			negativeCost = $.grep(self.vendorBillItemViewModel.vendorBillItemsList(), (e) => { return e.disputeAmount() !== null && e.cost() !== null && e.cost() < 0 && e.selectedItemTypes().ItemId !== "70"; });

		if (negativeCost && negativeCost.length > 0) {
			_app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: ApplicationMessages.Messages.NegativeLineItemCostValidation }, 'slideDown');
			return false;
		}

		var invalidCost = $.grep(self.vendorBillItemViewModel.vendorBillItemsList(), (e) => { return e.disputeAmount() !== null && e.cost() !== null && e.cost() < e.disputeAmount() && e.selectedItemTypes().ItemId !== "70" && e.selectedItemTypes().ItemId !== "10"; }),
			invalidShippingServiceCost = $.grep(self.vendorBillItemViewModel.vendorBillItemsList(), (e) => { return e.disputeAmount() !== null && e.cost() !== null && e.selectedItemTypes().ItemId === "10"; }),
			sumOfShippingServiceCost = $.grep(self.vendorBillItemViewModel.vendorBillItemsList(), (e) => { return e.disputeAmount() !== null && e.cost() !== null && (e.selectedItemTypes().ItemId === "10" || e.selectedItemTypes().ItemId === "70"); });
		var totalDisputeAmount = 0, totalAmount = 0;
		if (invalidShippingServiceCost && invalidShippingServiceCost.length > 0) {

			// get total dispute amount
			invalidShippingServiceCost.forEach((item) => {
				totalDisputeAmount = totalDisputeAmount + parseFloat(item.disputeAmount().toString());
				return totalDisputeAmount;
			});

			// get total actual amount
			invalidShippingServiceCost.forEach((item) => {
				totalAmount = totalAmount + parseFloat(item.cost().toString());
				return totalAmount;
			});

			if (totalAmount.toFixedDecimal(2) < totalDisputeAmount.toFixedDecimal(2)) {
				_app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: ApplicationMessages.Messages.InvalidCost }, 'slideDown');
				return false;
			}
			else if (invalidCost && invalidCost.length > 0) {
				_app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: ApplicationMessages.Messages.NegativeLineItemDisputeCostValidation }, 'slideDown');
				return false;
			}
		}

		if (sumOfShippingServiceCost && sumOfShippingServiceCost.length > 0) {
			totalAmount = 0, totalDisputeAmount = 0;
			// get total dispute amount
			sumOfShippingServiceCost.forEach((item) => {
				totalDisputeAmount = totalDisputeAmount + parseFloat(item.disputeAmount().toString());
				return totalDisputeAmount;
			});

			// get total actual amount
			sumOfShippingServiceCost.forEach((item) => {
				totalAmount = totalAmount + parseFloat(item.cost().toString());
				return totalAmount;
			});

			if (totalAmount.toFixedDecimal(2) < totalDisputeAmount.toFixedDecimal(2)) {
				_app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: ApplicationMessages.Messages.InvalidTotalCost }, 'slideDown');
				return false;
			}
		}

		return true;
	}

	// when status is dispute lost or dispute won validate amount
	private checkStatusIsDisputeWonOrDisputeLost() {
		var self = this;
		if ((self.vendorBillDetailsViewModel.selectedbillStatus() === refEnums.Enums.VendorBillStatus.DisputeWon.ID ||
			self.vendorBillDetailsViewModel.selectedbillStatus() === refEnums.Enums.VendorBillStatus.DisputeLost.ID) && !self.validateWonVsLost()) {
			return false;
		}

		if (self.vendorBillDetailsViewModel.selectedbillStatus() === refEnums.Enums.VendorBillStatus.DisputeWon.ID && self.vendorBillDetailsViewModel.originalBillStatus === refEnums.Enums.VendorBillStatus.DisputeLost.ID) {
			if (!self.originalVendorBillContainer.IsCreateLostBillVisible) {
				_app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: ApplicationMessages.Messages.CanNotChangeStatusToDisputeWonMessage }, 'slideDown');
				self.vendorBillDetailsViewModel.selectedbillStatus(refEnums.Enums.VendorBillStatus.DisputeLost.ID);
				return false;
			}
		}

		return true;
	}

	// validate dispute and lost dispute amount when status is dispute won or dispute lost
	private validateWonVsLost() {
		var self = this,
			sumOfShippingServiceCost = $.grep(self.vendorBillItemViewModel.vendorBillItemsList(), (e) => { return e.disputeAmount() !== null && e.disputeLostAmount() !== null; });

		if (sumOfShippingServiceCost && sumOfShippingServiceCost.length > 0) {
			var totalDisputeLostAmount = 0, totalDisputeAmount = 0;
			// get total dispute amount
			sumOfShippingServiceCost.forEach((item) => {
				totalDisputeAmount = totalDisputeAmount + parseFloat(item.disputeAmount().toString());
				return totalDisputeAmount;
			});

			// get total actual amount
			sumOfShippingServiceCost.forEach((item) => {
				totalDisputeLostAmount = totalDisputeLostAmount + parseFloat(item.disputeLostAmount().toString());
				return totalDisputeLostAmount;
			});

			if (totalDisputeAmount.toFixedDecimal(2) < totalDisputeLostAmount.toFixedDecimal(2)) {
				_app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: ApplicationMessages.Messages.DisputeCostValidation }, 'slideDown');
				return false;
			}

			if (totalDisputeLostAmount.toFixedDecimal(2) < 0) {
				_app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: ApplicationMessages.Messages.DisputeCostValidation }, 'slideDown');
				return false;
			}
		}

		return true;
	}

	//#endregion

	//#region Message

	// If PRO does not matches in the order the ask for force attach,
	public forceAttachMsg(existingProNo: string) {
		var self = this;

		var varMsgBox: Array<IMessageBoxButtonOption> = [
			{
				id: 0, name: 'Yes', callback: (): boolean => {
					//Yes Logic
					self.canForceAttach = true;

					self.vendorBillDetailsViewModel.obcvendorBillOptionList.getOptionsById(2).selected(true);
					if (existingProNo.toString() != "" && !self.isSubBill) {
						self.matchingSalesMsg(existingProNo);
					} else {
						self.isNegativeMargin();
					}
					return true;
				},
			},
			{
				id: 1, name: 'No', callback: (): boolean => {
					self.canForceAttach = false;
					self.isNegativeMargin();
					return true;
				}
			}
		];

		////initialize message box control arguments
		var optionControlArgs: IMessageBoxOption = {
			options: varMsgBox,
			message: ApplicationMessages.Messages.PROValidationMessage,
			title: ApplicationMessages.Messages.ApplicationMessageTitle
		}
				//Call the dialog Box functionality to open a Popup
		_app.showDialog('templates/messageBox', optionControlArgs, 'slideDown');
	}

	// If PRO does not matches then ask to user weather he wants to update that PRO in order or not
	public matchingSalesMsg(existingProNo: string) {
		var self = this;
		var varMsgBox: Array<IMessageBoxButtonOption> = [
			{
				id: 0, name: 'Yes', callback: (): boolean => {
					//Yes Logic
					self.canForceAttach = true;
					self.isUpdateProNo = true;
					self.isNegativeMargin();
					return true;
				},
			},
			{
				id: 1, name: 'No', callback: (): boolean => {
					self.canForceAttach = false;
					self.isNegativeMargin();
					return true;
				}
			}
		];

		//initialize message box control arguments
		var optionControlArgs: IMessageBoxOption = {
			options: varMsgBox,
			message: ApplicationMessages.Messages.ForceAttachInputeMessage + existingProNo.toString() + "\n Vendor Bill PRO# :" + self.vendorBillDetailsViewModel.proNumber(),
			title: ApplicationMessages.Messages.ApplicationMessageTitle
		}
				//Call the dialog Box functionality to open a Popup
			   _app.showDialog('templates/messageBox', optionControlArgs, 'slideDown');
	}

	//#endregion

	//#region Click Handler

	// Handles the click event of the Address accordion
	public onAddressClick() {
		$("#internationalShipmentButton").focus();
	}

	// Sets the notes section focus
	public onNotesClick() {
		$("#txtuserNote").focus();
	}

	// Handles the Item accordion click
	public onItemClick() {
		$("#addItemButton").focus();
	}

	// Handles the VendorBill accordion click
	public onVendorBillClick() {
		$("#shipperCityStateZip").focus();
	}

	//## function to expand the view by ID, if any case we required
	public expandView(viewId: string) {
		if (!$('#' + viewId).hasClass('in')) {
			$('#' + viewId).addClass('in');
			$('#' + viewId).css("height", 'auto');
			$('#Achor' + viewId).removeClass('collapsed');
		}
	}

	//## function to collapse the items view by ID, if any case we required
	public collapseView(viewId: string) {
		$('#' + viewId).removeClass('in');
		$('#' + viewId).css("height", '0');
		$('#Achor' + viewId).addClass('collapsed');
	}

	// click handler on open create sub bill
	public onCreateSubBill() {
		var self = this,
			vendorBillId = self.vendorBillDetailsViewModel.vendorBillId(),
			proNumber = self.findProNumber();
		_app.trigger("openVendorBill", vendorBillId, proNumber, 'VendorBillEdit', (callback) => {
			if (!callback) {
				return;
			}
		}, true);
	}

	// click handler on create lost bill
	public onCreateLostBill() {
		var self = this;
		if (self.validateDisputeLost()) {
			var disputeItems = $.grep(self.originalVendorBillContainer.VendorBillItemsDetail, (e) => { return e.DisputeLostAmount !== null && e.DisputeLostAmount > 0; });
			var vbTotalDisputeLostAmount = 0;
			disputeItems.forEach((item) => {
				vbTotalDisputeLostAmount = vbTotalDisputeLostAmount + parseFloat(item.DisputeLostAmount.toString());
				return vbTotalDisputeLostAmount;
			});

			var message = ApplicationMessages.Messages.LostAmountValidation_1 + "$" + vbTotalDisputeLostAmount.toFixed(2).toString() + ApplicationMessages.Messages.LostAmountValidation_2;
			self.showConfirmationMessage(message, ApplicationMessages.Messages.ApplicationMessageTitle, "Yes", "No",
				(): boolean => {
					self.listProgress(true);
					self.vendorBillClient.CreateDisputeLostBill(self.originalVendorBillContainer, data => {
						// Saving successful callback
						self.listProgress(false);
						_app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: ApplicationMessages.Messages.CreateSubOrderAndSubBillSuccessFullMessage }, 'slideDown');
						_app.trigger('closeActiveTab');
						_app.trigger("openVendorBill", data.VendorBillId, data.PRONumber, 'VendorBillEdit', (callback) => {
							if (!callback) {
								return;
							}
						}, false);
					}, () => {
							self.listProgress(false);
						});

					return true;
				},
				(): boolean => {
					return true;
				});
		} else {
			_app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: ApplicationMessages.Messages.NoDisputeLostAmountValidation }, 'slideDown');
			return;
		}
	}

	// click handler on dispute won bill
	public onDisputeWon() {
		var self = this;
		self.isDisputeWonLostButtonClicked = true;
		self.billStatusOfDisputeWonLostButtonClicked = refEnums.Enums.VendorBillStatus.DisputeWon.ID;
		self.onSave();
		self.isDisputeWonLostButtonClicked = false;
	}

	// click handler on dispute lost bill
	public onDisputeLost() {
		var self = this;
		var refresh = () => {
			self.beforeBind();
		};

		_app.showDialog('vendorBill/VendorBillDisputeLost', refresh, 'slideDown');
	}

	// login to find next pro number
	public findProNumber() {
		var self = this,
			proNumber = self.vendorBillDetailsViewModel.proNumber(),
			count = self.subOrderCount + 65;

		proNumber = proNumber + " " + String.fromCharCode(count);

		return proNumber;
	}

	//#endregion

	//#region Load Data
	public load(bindedData) {
		//** if bindedData is null then return false. */
		if (!bindedData)
			return;

		var self = this;

		//** if there is no data is registered then make a server call. */
		self.listProgress(true);
		var vendorBillId = bindedData.vendorBillId,
			isSubOrderBill = bindedData.isSubBill,
			successCallBack = data => {
				self.originalVendorBillContainer = data;
				if (data.VendorBill.ProcessFlow === 0) {
					self.vendorBillHeader('Vendor Bill');
				} else {
					self.vendorBillHeader('Vendor Bill ITerm');
				}
				self.isNotAtLoadingTime = true;
				self.subOrderCount = data.SuborderCount;
				self.isSubOrderBill(!data.IsSubBill);
				self.isCreateLostBillVisible(data.IsCreateLostBillVisible);
				self.isDisputeWonLostVisible(data.IsDisputeWonLostVisible);

				// load notes details
				self.vendorBillNotesViewModel.initializeVendorBillNotes(data.VendorBillNotes);
				// load item details
				if (data.VendorBillItemsDetail.length > 0) {
					self.vendorBillItemViewModel.initializeVendorBillItemDetails(data.VendorBillItemsDetail, data.IsDisputeAmountEditable, data.IsDisputeLostAmountEditable);
				} else {
					self.vendorBillItemViewModel.addDefaultItems();
				}
				// load address details
				var shipperAddress = $.grep(data.VendorBillAddress, e => e.AddressType === refEnums.Enums.AddressType.Origin.ID)[0],
					consigneeAddress = $.grep(data.VendorBillAddress, e => e.AddressType === refEnums.Enums.AddressType.Destination.ID)[0],
					billToAddress = $.grep(data.VendorBillAddress, e => e.AddressType === refEnums.Enums.AddressType.BillTo.ID)[0];

				//** flag to specify whether address fields are read only or not.? */
				self.vendorAddressViewModel.shouldBeReadOnly(data.VendorBill.IDBFlag);
				self.vendorAddressViewModel.isCallForEdit(true);
				self.vendorAddressViewModel.populateShipperAddress(shipperAddress);
				self.vendorAddressViewModel.populateConsigneeAddress(consigneeAddress);
				self.vendorAddressViewModel.populateBillToAddress(billToAddress);
				self.vendorAddressViewModel.processDetails(data.VendorBill.ProcessDetails);

				// load vendor bill details
				self.vendorBillDetailsViewModel.initializeVendorBillDetails(data.VendorBill, data.IsNewSubBill);

				self.listProgress(false);
				self.isChange(false);
				_app.trigger("IsBIDirtyChange", self.isChange());
				self.isNotAtLoadingTime = false;
			},
			faliureCallBack = message => {
				console.log(message);
				self.listProgress(false);
			};

		self.vendorBillClient.getVendorBillDetailsByVendorBillId(vendorBillId, successCallBack, faliureCallBack, isSubOrderBill);
	}
	//To load Shipment Details
	public getShipmentLinks() {
		var self = this;
		if (!$('#collapseLinks').hasClass('in')) {
			self.listProgressLinks(true);
			var successCallBack = function (data) {
				var commonUtils = new Utils.Common();
				// load Links details
				self.vendorBillLinksViewModel.initializeLinksDetails(data, self.vendorBillDetailsViewModel.vendorBillId());
				self.listProgressLinks(false);
			},
				faliureCallBack = function () {
					self.listProgressLinks(false);
				};
			self.vendorBillClient.getShipmentRelatedLinks(self.vendorBillDetailsViewModel.bolNumber(), self.vendorBillDetailsViewModel.vendorBillId(), successCallBack, faliureCallBack);
		}
	}
	//To load Shipment MAS Notes
	public getShipmentMasNotes() {
		var self = this;
		if (!$('#collapseMASNotes').hasClass('in')) {
			self.listProgressMas(true);
			var successCallBack = function (data) {
				var commonUtils = new Utils.Common();
				// load MAS Notes details
				self.vendorBillMASNoteViewModel.initializeMasNotesDetails(data);
				self.listProgressMas(false);
			},
				faliureCallBack = function () {
					self.listProgressMas(false);
				};
			self.vendorBillClient.getVendorBillMasNoteDetails(self.vendorBillDetailsViewModel.vendorBillId(), successCallBack, faliureCallBack);
		}
	}
	//To load Payment Details
	public getPaymentDetails() {
		var self = this;
		// to check data is present or not
		// if (self.vendorBillPaymentDetailsViewModel.gridOptions.data._latestValue.length == 0) {
		if (!$('#collapsePaymentDetails').hasClass('in')) {
			self.listProgressPayment(true);
			var successCallBack = function (data) {
				var commonUtils = new Utils.Common();
				// To load payment Details
				self.vendorBillPaymentDetailsViewModel.initializePaymentDetails(data);
				self.listProgressPayment(false);
			},
				faliureCallBack = function () {
					self.listProgressPayment(false);
				};
			self.vendorBillClient.getShipmentPaymentDetails("vendorBill", self.vendorBillDetailsViewModel.vendorBillId(), successCallBack, faliureCallBack);
		}
	}

	//To Load History details
	public getHistorydetails() {
		var self = this;
		if (!$('#collapseHistory').hasClass('in')) {
			self.listProgressHistory(true);
			var successCallBack = function (data) {
				var commonUtils = new Utils.Common();
				// To load History Details
				self.vendorBillHistoryViewModel.initializeHistoryDetails(data.VendorBillHeaderHistory);

				self.listProgressHistory(false);
			},
				faliureCallBack = function () {
					self.listProgressHistory(false);
				};
			self.vendorBillClient.GetVendorBillHistoryDetailsByVendorBillId(self.vendorBillDetailsViewModel.vendorBillId(), successCallBack, faliureCallBack);
		}
	}

	//#endregion

	//#endregion

	//#region Life Cycle Event}

	//** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
	public attached() {
		_app.trigger('viewAttached');
	}

	//** The composition engine will execute it prior to calling the binder. */
	public activate() {
		return true;
	}

	//**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
	public beforeBind() {
		var self = this;
		_app.trigger("loadMyData", function (data) {
			if (data) {
				self.load(data);
			} else {
				_app.trigger("closeActiveTab");
				_app.trigger("NavigateTo", 'Home');
			}
		});
	}

	// Enables or disables the save button and also makes the window as dirty flag
	public changesDetected(dirty: boolean) {
		var self = this;

		if (self.isNotAtLoadingTime === false) {
			if (dirty || self.vendorBillNotesViewModel.ischange() || self.vendorBillNotesViewModel.returnValue()
				|| self.vendorAddressViewModel.shipperLocation.returnValue || self.vendorAddressViewModel.consigneeLocation.returnValue
				|| self.vendorAddressViewModel.returnValue
				|| self.vendorAddressViewModel.ischange()
				|| self.vendorBillDetailsViewModel.vendorNameSearchList.returnValue
				|| self.vendorBillDetailsViewModel.returnValueFlag
				|| self.vendorBillDetailsViewModel.ischange
				|| self.vendorBillItemViewModel.returnValue()
				|| self.vendorBillDetailsViewModel.obcvendorBillOptionList.ischange()

				) {
				self.isChange(true);
				//window.ischange = true;
			}
			else {
				self.isChange(false);
				//window.ischange = false;
			}
			_app.trigger("IsBIDirtyChange", self.isChange());
		}
	}

	//#endregion
}

return VendorBillEditDetailsViewModel;