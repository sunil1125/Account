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
import _refVendorBill = require('vendorBill/VendorBillView');
import _refVendorBillNotes = require('vendorBill/VendorBillNotesEntryView');
import _refVendorBillContainer = require('services/models/vendorBill/VendorBillContainer');
import refVendorBillClient = require('services/client/VendorBillClient');
import _refVendorBillModel = require('services/models/vendorBill/VendorBill');
import _refVendorBillItemModel = require('services/models/vendorBill/VendorBillItemDetails');
import _refVendorBillContainerModel = require('services/models/vendorBill/VendorBillContainer');
import _refVendorBillAddressModel = require('services/models/vendorBill/VendorBillAddress');
import _refVendorBillNotesModel = require('services/models/vendorBill/VendorBillNote');
import refEnums = require('services/models/common/Enums');
import refVendorNameSearch = require('services/models/common/searchVendorName');

//#endregion

/*
** <summary>
** Vendor Main  View Model.
** </summary>
** <createDetails>
** <id>US8214</id> <by>ACHAL RASTOGI</by> <date>04-09-2014</date>
** </createDetails>}
** <changeHistory>}
** <id>DE22808</id> <by>Baldev Singh Thakur</by> <date>13-05-2016</date><description>Error message on saving Bill/UVB even if bill has saved successfully.</description>
** <id>DE22979</id> <by>Janakiram</by> <date>09-06-2016</date><description>System validates with No PRO# message even  though the SO has PRO# in it.</description>
** <id>DE23202</id> <by>Baldev Singh Thakur</by> <date>09-06-2016</date><description>VB Entry Save is throwing exception on Project Environment..</description>
** </changeHistory>
*/
export class VendorBillMainViewModel {
    //#region Members
    public vendorBillViewModel: _refVendorBill.VendorBillViewModel;
    public vendorAddressViewModel: _refVendorAddress.VendorAddressViewModel;
    public vendorBillItemViewModel: _refVendorItem.VendorBillItemViewModel;
    public vendorBillNotesEntryViewModel: _refVendorBillNotes.vendorBillNotesEntryViewModel = new _refVendorBillNotes.vendorBillNotesEntryViewModel();
    vendorBillClient: refVendorBillClient.VendorBillClient = new refVendorBillClient.VendorBillClient();
    carrierId: KnockoutObservable<number> = ko.observable(0);
    canForceAttach: boolean = false;
    isSubBill: boolean = false;
    isUpdateProNo: boolean = false;
    isPoWithBol: boolean = false;
    rowaffected: number = 0;
    BOlNumber: string = '';
    ProNumber: string = '';

    // for validation
    public isValidVendorBill: boolean = false;
    public isValidAddress: boolean = false;
    public isValidItems: boolean = false;
    // Utility class object
    CommonUtils: CommonStatic = new Utils.Common();
    // To enable save button
    isSetModelAndSave: KnockoutObservable<boolean> = ko.observable(true);
    ischange: KnockoutObservable<boolean> = ko.observable(false);
    isNotSaving: boolean = true;
    carrierType: KnockoutObservable<number> = ko.observable(0);
    // to show the progress bar
    listProgressAccordian: KnockoutObservable<boolean> = ko.observable(false);
    listProgressTabbed: KnockoutObservable<boolean> = ko.observable(false);
    // To get the logged in user
    currentUser: KnockoutObservable<IUser> = ko.observable();
    isAccordion: KnockoutObservable<boolean> = ko.observable(false);
    public viewDetail: (msg) => any;
    public checkMsgClick: () => any;
    public checkMsgHide: () => any;
    public callCheckForceAttachOptions: any;
    public callCheckBolValidationYes: any;
    public callCheckBolValidationNo: any;
    private savedVendorBillId: number;
    private checkMsgDisplay: boolean = true;
    private MsgexistingProNo: string;
    public callForceAttchYes: any;
    public callForceAttchNo: any;
    public callMatchingsalesYes: any;
    public callMatchingsalesNo: any;

    public saveVendorBill: (msg) => any;
    //Flag to restrict the server calls to 1 time even user double clicked.
    restrictDuplicateCall: boolean = true;
    //#endregion

    //#region Constructor
    constructor() {
        var self = this;

        //Call to populate Shipper and consignee Address
        self.vendorBillViewModel = new _refVendorBill.VendorBillViewModel(function (shipperAddress: IVendorBillAddress) {
            self.vendorAddressViewModel.populateShipperAddress(shipperAddress);
        }, function (consigneeAddress: IVendorBillAddress) {
                self.vendorAddressViewModel.populateConsigneeAddress(consigneeAddress);
            },
            //Call back to expand either items or Address when user press 'TAB' form reference number.
            function () {
                // ###START: DE22979
                var bolNumber = $.trim(self.vendorBillViewModel.bolNumber());
                // ###END: DE22979
                //$('#collapseVendorBill').removeClass('in');
                //$("#collapseVendorBill").css("height", '0');
                //$('#AchorcollapseVendorBill').addClass('collapsed');
                //if BOL number is exists then open Items DIV
                if (self.isAccordion()) {
                    self.vendorBillViewModel.obcvendorBillOptionList.isTabIndex(true);
                    //if (bolNumber.trim() !== "") {
                    //	self.expandItemsView();
                    //	$('#itemsDiv').focus();
                    //}
                    //else { //else open Address DIV
                    //	self.expandAddressView();
                    //	//self.onAddressClick();
                    //	$('#addressDiv').focus();
                    //	$('#collapseAddress').css("overflow", "visible");
                    //}
                    self.expandItemsView();
                    $('#itemsDiv').focus();
                }
                else {
                    self.vendorBillViewModel.obcvendorBillOptionList.isTabIndex(false);
                    self.collapseAllTabs();
                    $('#item').addClass('active in');
                    $('#itemLink').addClass('active');
                    //if (bolNumber.trim() !== "") {
                    //	$('#item').addClass('active in');
                    //	$('#itemLink').addClass('active');

                    //}
                    //else { //else open Address DIV
                    //	$('#address').addClass('active in');
                    //	$('#addressLink').addClass('active');

                    //}
                }
            }, (carrierType) => {
                if (!self.isSubBill) {
                    self.vendorBillItemViewModel.addDefaultItems(carrierType);
                }
            });

        self.vendorBillItemViewModel = new _refVendorItem.VendorBillItemViewModel(function (totalCost: number, totalWeght: number, totalPices: number) {
            self.vendorBillViewModel.totalWeigth(totalWeght);
            self.vendorBillViewModel.vendorAmount($.number(totalCost.toString(), 2));
            self.vendorBillViewModel.totalPieces(totalPices);
        },
            function () {

                // ###START: DE22979
                var bolNumber = $.trim(self.vendorBillViewModel.bolNumber());
                // ###END: DE22979
                if (!self.isAccordion()) {
                    self.collapseAllTabs();
                    if (bolNumber.trim() !== "") {
                        self.collapseView('collapseItems');
                        $('#notes').addClass('active in');
                        $('#notesLink').addClass('active');
                        self.expandNotesView();
                        $("#notesDiv").focus();
                    } else {
                        self.collapseView('collapseItems');
                        $('#address').addClass('active in');
                        $('#addressLink').addClass('active');
                        self.expandAddressView();
                        $('#addressDiv').focus();
                    }
                }
                else {
                    self.collapseView('collapseItems');
                    if (bolNumber.trim() !== "") {
                        self.expandNotesView();
                        $("#notesDiv").focus();
                    }
                    else {
                        //self.expandNotesView();
                        //$("#notesDIV").focus();
                        self.expandAddressView();
                        $('#addressDiv').focus();
                    }
                }
            });

        self.vendorAddressViewModel = new _refVendorAddress.VendorAddressViewModel(function (originZip: string, destinationZip: string) {
            if (originZip != undefined) {
                self.vendorBillViewModel.originZip(originZip.trim());
            }
            if (destinationZip != undefined) {
                self.vendorBillViewModel.destinationZip(destinationZip.trim());
            }
            else {
                self.vendorBillViewModel.destinationZip('');
            }
        },
            //Call back to expand either items or Address when user press 'TAB' form reference number.
            function () {
                //if BOL number is exists then open Items DIV
                if (self.isAccordion()) {
                    self.collapseView('collapseAddress');
                    self.expandNotesView();
                    $('#notesDiv').focus();
                }
                else {
                    self.collapseAllTabs();
                    $('#notes').addClass('active in');
                    $('#notesLink').addClass('active');
                }
            });

        //#region change detection and enable save button based on changes

        // for vendor Bill
        self.vendorBillViewModel.onChangesMade = function (dirty) {
            self.changesDetected(dirty);
        }

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

		//for Item Details
		self.vendorBillItemViewModel.onChangesMade = function (dirty) {
            self.changesDetected(dirty);
        }

		// for Vendor bill Notes section
		self.vendorBillNotesEntryViewModel.onChangesMade = function (dirty: boolean) {
            self.changesDetected(dirty);
        }

		// for Vendor bill Notes section
		self.viewDetail = () => {
            // opens the details tab or the current created bill
            if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.BOlNumber)) {
                if (!self.isPoWithBol) {
                    _app.trigger("openVendorBill", self.savedVendorBillId, self.ProNumber, (callback) => { });
                    return true;
                }
                else {
                    _app.trigger("openPurchaseOrder", self.savedVendorBillId, self.ProNumber, (callback) => { });
                    return true;
                }
            }
            else {
                _app.trigger("openPurchaseOrder", self.savedVendorBillId, self.ProNumber, (callback) => { });
                return true;
            }
        }
		// for calling CheckForceAttachOptions
		self.callCheckForceAttachOptions = () => {
            //self.checkMsgDisplay = true;
            self.CheckForceAttachOptions();
        }

		self.callCheckBolValidationNo = () => {
            self.isPoWithBol = false;
            //self.checkMsgDisplay = true;
        }

		self.callCheckBolValidationYes = () => {
            //self.checkMsgDisplay = true;
            self.isPoWithBol = true;
            // Call next validation
            self.ValidatePRONumber();
        }
		//#endregion

		if (!self.currentUser()) {
            // Get the logged in user for name for new note}
            _app.trigger("GetCurrentUserDetails", function (currentUser: IUser) {
                self.currentUser(currentUser);
            });
        }

        self.callForceAttchNo = () => {
            self.canForceAttach = false;
            $("#proNumberInput").focus();
            $("#proNumberInput").select();
        }

		self.callForceAttchYes = () => {
            //self.checkMsgDisplay = true;
            self.canForceAttach = true;
            self.vendorBillViewModel.obcvendorBillOptionList.getOptionsById(2).selected(true);
            if (self.MsgexistingProNo.toString() != "" && !self.isSubBill) {
                self.matchingSalesMsg(self.MsgexistingProNo);
            } else {
                self.setUpModelAndSave();
            }
        }

		self.callMatchingsalesYes = () => {
            //	self.checkMsgDisplay = true;
            self.canForceAttach = true;
            self.isUpdateProNo = true;
            self.setUpModelAndSave();
        }

		self.callMatchingsalesNo = () => {
            //	self.checkMsgDisplay = true;
            self.canForceAttach = false;
            self.setUpModelAndSave();
        }

		//To check if Msg is clicked
		self.checkMsgClick = () => {
            self.checkMsgDisplay = true;
        }

	// to Check if Msg is hidden or closed
		self.checkMsgHide = () => {
            self.checkMsgDisplay = true;
        }
			// For Saving Vendor Bill Detail
	 self.saveVendorBill = () => {
            // Validate the data and then check the PRO numbers and then calls the save service
            if (self.validateVendorBill()) {
                self.ValidateVendorNotes();
            }
        }

		//TO set grid column after browser resizing
		window.addEventListener("resize", resizeFunction);
        function resizeFunction() {
            //on click we are calling this flag to show grid column resizebal as per browser window
            self.vendorBillNotesEntryViewModel.reportContainer.isAttachedToView(false);
            self.vendorBillNotesEntryViewModel.reportContainer.isAttachedToView(true);
        }
        return self;
    }
    //#endregionfadeOut

    //#region Internal Methods

    //#region Save
    // For Validating
    public onSave() {
        var self = this;
        // Show all the validation as once (All section validation)

        self.vendorBillViewModel.validateBill();
        self.vendorAddressViewModel.validateAddresses();
        self.vendorBillItemViewModel.validateItems();

        if (self.isSubBill) {
            var toastrOptions: IToastrOptions = {
                toastrPositionClass: "toast-top-middle",
                delayInseconds: 20,
                fadeOut: 20,
                typeOfAlert: "",
                title: ""
            };
            //if (self.vendorBillViewModel.bolNumber().indexOf(' ') > 0) {
            //    Utility.ShowToastr(true, "Cannot create bill for Sub order", "Success", self.checkMsgClick, toastrOptions, self.checkMsgHide);
            //    return;
            //}
        }

        if (self.isAccordion()) {
            self.validateAccordionView();
        }
        else {
            self.validateTabbedView(self.vendorAddressViewModel.validateAddresses(), self.vendorBillItemViewModel.validateItems());
        }

        // Validate each section data
        if (!(self.isValidVendorBill && self.isValidAddress && self.isValidItems)) {
            return;
        }
        else {
            //if (self.checkMsgDisplay) {
            //	self.checkMsgDisplay = false;
            var actionButtons: Array<IToastrActionButtonOptions> = [];
            actionButtons.push({
                actionButtonName: "Yes",
                actionClick: self.saveVendorBill
            });
            actionButtons.push({
                actionButtonName: "No",
                actionClick: self.focuseVendorName
            });
            var toastrOptions: IToastrOptions = {
                toastrPositionClass: "toast-top-middle",
                delayInseconds: 0,
                fadeOut: 0,
                typeOfAlert: "",
                title: "",
                actionButtons: actionButtons
            };

            Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.confirmVendorName, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
            //}
        }
    }

    // function to validate tab view section
    public validateTabbedView(isVendorAddressesValid, isVendorItemValid) {
        var self = this;
        self.collapseAllTabs();

        if (self.vendorBillViewModel.validateBill()) {
            self.isValidVendorBill = false;
        }
        else {
            self.isValidVendorBill = true;
        }

        if (isVendorItemValid) {
            $('#item').addClass('active in');
            $('#itemLink').addClass('active');
            self.isValidItems = false;
        } else {
            self.isValidItems = true;
        }

        if (isVendorAddressesValid && !isVendorItemValid) {
            $('#address').addClass('active in');
            $('#addressLink').addClass('active');
            self.isValidAddress = false;
        } else {
            self.isValidAddress = true;
        }

        if (!isVendorItemValid && !isVendorAddressesValid) {
            $('#item').addClass('active in');
            $('#itemLink').addClass('active');
        }
    }

    // function to validate accordion view section
    public validateAccordionView() {
        var self = this;
        if ($('#collapseNotes').hasClass('in')) {
            $('#collapseNotes').collapse('toggle');
            $('#AchorcollapseNotes').addClass('collapsed');
        }
        if (self.vendorBillViewModel.validateBill()) {
            self.isValidVendorBill = false;
            //if (!$('#collapseVendorBill').hasClass('in')) {
            //	$('#collapseVendorBill').collapse('show');
            //	$('#AchorcollapseVendorBill').removeClass('collapsed');
            //}
            //else if ($('#collapseVendorBill').hasClass('in') && !self.isValidVendorBill) {
            //}
        }
        else {
            self.isValidVendorBill = true;
            //self.collapseAchorVendorBill();
        }

        if (self.vendorAddressViewModel.validateAddresses()) {
            $('#collapseAddress').collapse('show');
            $('#AchorcollapseAddress').removeClass('collapsed');
            self.isValidAddress = false;
            if (self.isAccordion()) {
                setTimeout(function () {
                    $('#collapseAddress').css("overflow", "visible");
                }, 500);
            }
        }
        else {
            self.isValidAddress = true;
            self.colapseAchorAddress();
        }
        if (self.vendorBillItemViewModel.validateItems()) {
            $('#collapseItems').collapse('show');
            $('#AchorcollapseItems').removeClass('collapsed');
            self.isValidItems = false;
        }
        else {
            self.isValidItems = true;
            self.colapseAchorItems();
        }
    }

    //function to collapse all tabs.
    public collapseAllTabs() {
        if ($('#address').hasClass('in')) {
            $('#address').removeClass('active in');
            $('#addressLink').removeClass('active');
        }
        if ($('#item').hasClass('in')) {
            $('#item').removeClass('active in');
            $('#itemLink').removeClass('active');
        }
        if ($('#notes').hasClass('in')) {
            $('#notes').removeClass('active in');
            $('#notesLink').removeClass('active in');
        }
    }

    //function to collapse vendor bill accordion.
    public collapseAchorVendorBill() {
        var self = this;
        if ($('#collapseVendorBill').hasClass('in') && self.isValidVendorBill) {
            $('#collapseVendorBill').collapse('toggle');
            $('#AchorcollapseVendorBill').addClass('collapsed');
        }
    }

    //function to collapse address accordion.
    public colapseAchorAddress() {
        var self = this;
        if ($('#collapseAddress').hasClass('in') && self.isValidAddress) {
            $('#collapseAddress').collapse('toggle');
            $('#AchorcollapseAddress').addClass('collapsed');
        }

        $('#collapseAddress').css("overflow", "hidden");
    }

    //function to collapse items accordion.
    public colapseAchorItems() {
        var self = this;
        if ($('#collapseItems').hasClass('in') && self.isValidItems) {
            $('#collapseItems').collapse('toggle');
            $('#AchorcollapseItems').addClass('collapsed');
        }
    }

    //// For Saving Vendor Bill Detail
    //public saveVendorBill() {
    //	var self = this;

    //	// Validate the data and then check the PRO numbers and then calls the save service
    //	if (self.validateVendorBill()) {
    //		self.ValidateVendorNotes();
    //	}
    //}

    public focuseVendorName() {
        $("#txtVendorName").focus();
    }

    //## function to expand the items view if any case we required
    public expandItemsView() {
        if (!$('#collapseItems').hasClass('in')) {
            $('#collapseItems').addClass('in');
            $("#collapseItems").css("height", 'auto');
            $('#AchorcollapseItems').removeClass('collapsed');
        }
    }

    //## function to expand the address view if any case we required
    public expandAddressView() {
        if (!$('#collapseAddress').hasClass('in')) {
            $('#collapseAddress').addClass('in');
            $("#collapseAddress").css("height", 'auto');
            $('#AchorcollapseAddress').removeClass('collapsed');
        }
    }
    //## function to expand the vendor bill view if any case we required
    public expandVendorBillView() {
        if (!$('#collapseVendorBill').hasClass('in')) {
            $('#collapseVendorBill').addClass('in');
            $("#collapseVendorBill").css("height", 'auto');
            $('#AchorcollapseVendorBill').removeClass('collapsed');
        }
    }

    //## function to expand the vendor bill view if any case we required
    public expandNotesView() {
        if (!$('#collapseNotes').hasClass('in')) {
            $('#collapseNotes').addClass('in');
            $("#collapseNotes").css("height", 'auto');
            $('#AchorcollapseNotes').removeClass('collapsed');
        }
    }

    //## function to collapse the items view by ID, if any case we required
    public collapseView(viewId: string) {
        $('#' + viewId).removeClass('in');
        $('#' + viewId).css("height", '0');
        $('#Achor' + viewId).addClass('collapsed');
        $('#collapseAddress').css("overflow", "hidden");
    }

    // Gets the data from all the different view model and sends those to service
    public setUpModelAndSave() {
        var self = this;
        var vendorBillData = new _refVendorBillContainerModel.Models.VendorBillContainer();

        vendorBillData.VendorBill = self.getVendorBillDetails();
        vendorBillData.VendorBillAddress = self.getVendorBillAddress();
        vendorBillData.VendorBillItemsDetail = self.getVendorBillItemsDetails();
        vendorBillData.VendorBillNotes = self.getVendorBillNotes();
        vendorBillData.IsSubBill = self.isSubBill;
        self.showListProgress(true);
        self.isSetModelAndSave(false);

        if (self.restrictDuplicateCall === false)
            return;

        self.restrictDuplicateCall = false;
        refVendorBillClient.VendorBillClient.prototype.SaveVendorBillDetail(vendorBillData, function (message) {
            self.restrictDuplicateCall = true;
            // Saving successful callback
            self.isSetModelAndSave(true);
            self.isNotSaving = false;
            self.ischange(false);
            //window.ischange = false;
            // Close the current Entry tab
            _app.trigger('closeActiveTab');
            self.showListProgress(false);
            // Show confirm message to take an action to the user so that, he can decide weather he wants to add another bill or just want to go to the
            // Details of current created bill

            // ###START: DE22979
            self.BOlNumber = $.trim(self.vendorBillViewModel.bolNumber());
            self.ProNumber = $.trim(self.vendorBillViewModel.proNumber());
            // ###END: DE22979
            self.savedVendorBillId = message;

            self.vendorBillViewModel = null;
            self.vendorAddressViewModel = null;
            self.vendorBillItemViewModel = null;
            self.vendorBillNotesEntryViewModel = null;
            _app.trigger('openDuplicateTab', 'Entry', 'parent');
            _app.trigger("IsBIDirtyChange", false);
            //if (self.checkMsgDisplay) {
            //	self.checkMsgDisplay = false;
            var actionButtons: Array<IToastrActionButtonOptions> = [];
            actionButtons.push({
                actionButtonName: "View Details",
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

            Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SavedSuccessfullyMessage, "Success", self.checkMsgClick, toastrOptions, self.checkMsgHide);
            //}
        }, (message) => {
                self.restrictDuplicateCall = true;
                _app.trigger("IsBIDirtyChange", self.ischange(false));

                // Saving failed call back
                self.showListProgress(false);
                self.isSetModelAndSave(true);
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                }
			// ###START: DE22808
			if (typeof (message) === 'object') {
                    if (message.StatusModel.StatusCode == Constants.ApplicationConstants.MatchingProcessErrorStatusCode) {

                        _app.trigger('closeActiveTab');
                        self.showListProgress(false);
                        // Show confirm message to take an action to the user so that, he can decide weather he wants to add another bill or just want to go to the
                        // Details of current created bill

                        // ###START: DE22979
                        self.BOlNumber = $.trim(self.vendorBillViewModel.bolNumber());
                        self.ProNumber = $.trim(self.vendorBillViewModel.proNumber());
                        // ###END: DE22979

                        self.savedVendorBillId = message.Response;

                        self.vendorBillViewModel = null;
                        self.vendorAddressViewModel = null;
                        self.vendorBillItemViewModel = null;
                        self.vendorBillNotesEntryViewModel = null;
                        _app.trigger('openDuplicateTab', 'Entry', 'parent');
                        _app.trigger("IsBIDirtyChange", false);
                        //if (self.checkMsgDisplay) {
                        //	self.checkMsgDisplay = false;
                        var actionButtons: Array<IToastrActionButtonOptions> = [];
                        actionButtons.push({
                            actionButtonName: "View Details",
                            actionClick: self.viewDetail
                        });

                        var toastrOptionsFail: IToastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 30,
                            fadeOut: 30,
                            typeOfAlert: "",
                            title: "",
                            actionButtons: actionButtons
                        };

                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SavedSuccessfullyMessage, "Success", self.checkMsgClick, toastrOptionsFail, self.checkMsgHide);

                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.SavedSuccessfullyMessageThoughMatchingProcessFailed, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                    }
                    else {
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                    }
                } else {
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
                // ###END: DE22808
            });
    }

    // Gets the vendor bill details
    private getVendorBillDetails(): IVendorBill {
        var self = this;

        var vendorBillDetails = new _refVendorBillModel.Models.VendorBill();

        // For new vendor bill bill id should be 0 and the bill status will be pending (0)
        vendorBillDetails.BillStatus = 1;
        vendorBillDetails.VendorBillId = 0;
        vendorBillDetails.CarrierId = self.vendorBillViewModel.vendorId();
        vendorBillDetails.Amount = self.vendorBillViewModel.vendorAmount();
        vendorBillDetails.BillDate = self.vendorBillViewModel.billDate();
        // ###START: DE22979
        vendorBillDetails.BolNumber = $.trim(self.vendorBillViewModel.bolNumber());
        // ###END: DE22979
        vendorBillDetails.DeliveryDate = self.vendorBillViewModel.deliveryDate();
        vendorBillDetails.DestinationZip = self.vendorBillViewModel.destinationZip();
        // ###START: DE22979
        vendorBillDetails.MainVendorBolNumber = $.trim(self.vendorBillViewModel.mainBolNumber());
		vendorBillDetails.ProNumber = $.trim(self.vendorBillViewModel.proNumber());
		// ###START: DE23202
        vendorBillDetails.SalesOrderId = self.vendorBillViewModel.salesOrderId;
		// ###END: DE23202
        // ###END: DE22979
        vendorBillDetails.IsPurchaseOrder = self.isPoWithBol;
        vendorBillDetails.UpdatePRONumberInShipment = self.isUpdateProNo;
        vendorBillDetails.ProcessDetails = self.vendorAddressViewModel.processDetails();
        vendorBillDetails.Memo = self.vendorBillViewModel.memo();
        var selecetedList = self.vendorBillViewModel.obcvendorBillOptionList.getSelectedOptions(true);

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
        vendorBillDetails.OriginZip = self.vendorBillViewModel.originZip();
        vendorBillDetails.PoNumber = self.vendorBillViewModel.poNumber();
        vendorBillDetails.ReferenceNumber = self.vendorBillViewModel.refNumber();
        vendorBillDetails.TotalPieces = self.vendorBillViewModel.totalPieces();
        vendorBillDetails.TotalWeight = self.vendorBillViewModel.totalWeigth();
        vendorBillDetails.VendorName = self.vendorBillViewModel.vendorName();

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
        vendorShipperAddress.Id = 0;
        vendorShipperAddress.Street = self.vendorAddressViewModel.shipperAddress1();
        vendorShipperAddress.Street2 = self.vendorAddressViewModel.shipperAddress2();
        vendorShipperAddress.CompanyName = self.vendorAddressViewModel.shipperCompanyName();
        vendorShipperAddress.ContactPerson = self.vendorAddressViewModel.shipperContactPerson();
        vendorShipperAddress.City = self.vendorAddressViewModel.shipperLocation.location().City;
        vendorShipperAddress.State = self.vendorAddressViewModel.shipperLocation.location().StateCode;
        vendorShipperAddress.ZipCode = self.vendorAddressViewModel.shipperLocation.location().Zip;
        vendorShipperAddress.Phone = self.vendorAddressViewModel.shipperPhone();
        vendorShipperAddress.Fax = self.vendorAddressViewModel.shipperFax();
        vendorShipperAddress.Country = self.vendorAddressViewModel.isInternationalShipmentSelected() ? self.vendorAddressViewModel.selectedShipperCountryCode() : $.number(self.vendorAddressViewModel.shipperLocation.location().CountryCode);
        vendorShipperAddress.AddressType = 1;

        // Create consignee address model
        vendorConsigneeAddress.Id = 0;
        vendorConsigneeAddress.Street = self.vendorAddressViewModel.consigneeAddress1();
        vendorConsigneeAddress.Street2 = self.vendorAddressViewModel.consigneeAddress2();
        vendorConsigneeAddress.CompanyName = self.vendorAddressViewModel.consigneeCompanyName();
        vendorConsigneeAddress.ContactPerson = self.vendorAddressViewModel.consigneeContactPerson();
        vendorConsigneeAddress.City = self.vendorAddressViewModel.consigneeLocation.location().City;
        vendorConsigneeAddress.State = self.vendorAddressViewModel.consigneeLocation.location().StateCode;
        vendorConsigneeAddress.ZipCode = self.vendorAddressViewModel.consigneeLocation.location().Zip;
        vendorConsigneeAddress.Phone = self.vendorAddressViewModel.consigneePhone();
        vendorConsigneeAddress.Fax = self.vendorAddressViewModel.consigneeFax();
        vendorConsigneeAddress.Country = self.vendorAddressViewModel.isInternationalShipmentSelected() ? self.vendorAddressViewModel.selectedConsigneeCountryCode() : $.number(self.vendorAddressViewModel.consigneeLocation.location().CountryCode);
        vendorConsigneeAddress.AddressType = 2;

        // Create Bill To address model
        vendorBillToAddress.Id = 0;
        vendorBillToAddress.Street = self.vendorAddressViewModel.billToAddress1();
        vendorBillToAddress.Street2 = self.vendorAddressViewModel.billToAddress2();
        vendorBillToAddress.CompanyName = self.vendorAddressViewModel.billToCompanyName();
        vendorBillToAddress.City = self.vendorAddressViewModel.billToLocation.location().City;
        vendorBillToAddress.State = self.vendorAddressViewModel.billToLocation.location().StateCode;
        vendorBillToAddress.ZipCode = self.vendorAddressViewModel.billToLocation.location().Zip;
        vendorBillToAddress.Phone = self.vendorAddressViewModel.billToPhone();
        vendorBillToAddress.Fax = self.vendorAddressViewModel.billToFax();
        vendorBillToAddress.Country = self.vendorAddressViewModel.isInternationalShipmentSelected() ? self.vendorAddressViewModel.selectedBillToCountryCode() : $.number(self.vendorAddressViewModel.billToLocation.location().CountryCode);
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

        self.vendorBillItemViewModel.vendorBillItemsList().forEach((item) => {
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

            vendorBillItems.push(vendorBillItem);
        });

        return vendorBillItems;
    }

    // Gets the vendor bill notes details
    private getVendorBillNotes(): Array<IVendorBillNote> {
        var self = this;
        var vendorBillNotes: Array<_refVendorBillNotesModel.Models.VendorBillNote>;
        vendorBillNotes = ko.observableArray([])();

        self.vendorBillNotesEntryViewModel.vendorBillNoteItems().forEach(function (item, collection) {
            vendorBillNotes.push(self.AddNoteItem(item));
        });

        //## While creating vendor bill from entry view we are adding a general notes.
        var notesDescription = "Vendor Bill with PRO: " + self.vendorBillViewModel.proNumber() + " has been created by: " + self.currentUser().FullName;
        var itemNew = new _refVendorBillNotes.vendorBillNoteItem(notesDescription, self.currentUser().FullName, Date.now(), "System", refEnums.Enums.Note.System.ID);
        vendorBillNotes.push(self.AddNoteItem(itemNew));

        return vendorBillNotes;
    }

    // Checks the force attach options and gets the user input
    // And then calls the save service
    private CheckForceAttachOptions() {
        var self = this;

        if (self.vendorBillViewModel.bolNumber().trim() != "") {
            if (self.vendorBillViewModel.listCheck != null && self.vendorBillViewModel.listCheck()[1] === false) {
                //Call the dialog Box functionality to open a Popup
                //if (self.checkMsgDisplay) {
                //	self.checkMsgDisplay = false;
                var actionButtons: Array<IToastrActionButtonOptions> = [];
                actionButtons.push({
                    actionButtonName: "Yes",
                    actionClick: self.callCheckBolValidationYes
                });
                actionButtons.push({
                    actionButtonName: "No",
                    actionClick: self.callCheckBolValidationNo
                });
                var toastrOptions: IToastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 0,
                    fadeOut: 0,
                    typeOfAlert: "",
                    title: "",
                    actionButtons: actionButtons
                };

                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.BOLValidationMessage, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);

                //}
            }
            else {
                self.ValidatePRONumber();
            }
        } else {
            self.setUpModelAndSave();
        }
    }

    // Validates the PRO number
    private ValidatePRONumber() {
        var self = this;
        var existingProNo;
        var commonUtils = new Utils.Common();
        //Check if  Vendor Bill with a Vendor that does not match with the PRO#
        // ###START: DE22979
        if (commonUtils.isNullOrEmptyOrWhiteSpaces($.trim(self.vendorBillViewModel.bolNumber()))) {
             // ###END: DE22979
            if (self.vendorBillViewModel.listCheck != null && self.vendorBillViewModel.listCheck()[2] === false && self.isPoWithBol != true && !self.vendorBillViewModel.obcvendorBillOptionList.getOptionsById(2).selected()) {
                // ###START: DE22979
                self.vendorBillClient.getExistingProNo($.trim(self.vendorBillViewModel.bolNumber()), function (data: string) {
                    // ###END: DE22979
                    existingProNo = data;

                    // ###START: DE22979
                    if (existingProNo !== $.trim(self.vendorBillViewModel.proNumber())) {
                        // ###END: DE22979
                        self.forceAttachMsg(existingProNo);
                    }
                    else {
                        self.setUpModelAndSave();
                    }
                });
            }
            else {
                self.setUpModelAndSave();
            }
        }
        else {
            self.setUpModelAndSave();
        }
    }

    // Validates the vendor notes, as if user has only written something not clicked on add
    private ValidateVendorNotes() {
        var self = this;

        // Check if notes data is entered but not added in the list
        if (self.vendorBillNotesEntryViewModel.canAdd()) {
            var self = this;
            self.vendorBillNotesEntryViewModel.onAdd();
            self.CheckForceAttachOptions();
        }
        else {
            self.CheckForceAttachOptions();
        }
    }

    // function to use get item note model
    private AddNoteItem(item: _refVendorBillNotes.vendorBillNoteItem) {
        var itemNote = new _refVendorBillNotesModel.Models.VendorBillNote();

        // For the entity ID will be filled by server
        itemNote.EntityId = 0;
        itemNote.NotesBy = item.noteBy();
        itemNote.NotesDate = new Date(item.noteDate());
        itemNote.NotesDescription = item.description();
        itemNote.NoteTypeName = item.noteType();
        itemNote.NotesType = item.noteTypeValue();

        return itemNote;
    }
    //#endregion Internal Methods

    //#region Validation

    //To Validated Vendor Bill
    public validateVendorBill() {
        var self = this;

        var ValidationMsgBox: Array<IMessageBoxButtonOption> = [
            {
                id: 0, name: 'Ok', callback: (): boolean => {
                    $("#proNumberInput").focus();
                    $("#proNumberInput").select();
                    return true;
                }
            }
        ];

        //To Check Duplicate Pro no
        if (self.vendorBillViewModel.listCheck != null && self.vendorBillViewModel.listCheck()[0] === true) {
            //if (self.checkMsgDisplay) {
            //	self.checkMsgDisplay = false;
            var toastrOptions = {
                toastrPositionClass: "toast-top-middle",
                delayInseconds: 10,
                fadeOut: 10,
                typeOfAlert: "",
                title: ""
            }
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PROAlreadyExists, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
            //}
            self.expandVendorBillView();

            return false;
        }

        // Check for the negative vendor bill amount
        if (self.vendorBillViewModel.vendorAmount() < 0) {
            //self.checkMsgDisplay = false;
            var toastrOptions = {
                toastrPositionClass: "toast-top-middle",
                delayInseconds: 10,
                fadeOut: 10,
                typeOfAlert: "",
                title: ""
            }
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.BillAmountShouldNotbeNegative, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);

            self.expandItemsView();
            return false;
        }

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

    //#endregion

    //#region Message

    // If PRO does not matches in the order the ask for force attach,
    public forceAttachMsg(existingProNo: string) {
        var self = this;
        self.MsgexistingProNo = existingProNo;
        //if (self.checkMsgDisplay) {
        //	self.checkMsgDisplay = false;
        var actionButtons: Array<IToastrActionButtonOptions> = [];
        actionButtons.push({
            actionButtonName: "Yes",
            actionClick: self.callForceAttchYes
        });
        actionButtons.push({
            actionButtonName: "No",
            actionClick: self.callForceAttchNo
        });
        var toastrOptions: IToastrOptions = {
            toastrPositionClass: "toast-top-middle",
            delayInseconds: 0,
            fadeOut: 0,
            typeOfAlert: "",
            title: "",
            actionButtons: actionButtons
        };

        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.PROValidationMessage, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
        //}
    }

    // If PRO does not matches then ask to user weather he wants to update that PRO in order or not
    public matchingSalesMsg(existingProNo: string) {
        var self = this;

        //Call the dialog Box functionality to open a Popup
        //if (self.checkMsgDisplay) {
        //	self.checkMsgDisplay = false;
        var actionButtons: Array<IToastrActionButtonOptions> = [];
        actionButtons.push({
            actionButtonName: "Yes",
            actionClick: self.callMatchingsalesYes
        });
        actionButtons.push({
            actionButtonName: "No",
            actionClick: self.callMatchingsalesNo
        });
        var toastrOptions: IToastrOptions = {
            toastrPositionClass: "toast-top-middle",
            delayInseconds: 0,
            fadeOut: 0,
            typeOfAlert: "",
            title: "",
            actionButtons: actionButtons
        };

        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.ForceAttachInputeMessage + existingProNo.toString() + "\n to match the Vendor Bills PRO# :" + self.vendorBillViewModel.proNumber(), "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
        //}
    }
    // Handles the click event of the Address accordion
    public onAddressClick() {
        var self = this;
        // To avoid tabs goes blank on quick move between tabs
        self.collapseAllTabs();
        $('#address').addClass('active in');
        $('#addressLink').addClass('active');
        if (self.isAccordion() == true) {
            self.addressOverflowManage();
        } else {
        }
        $("#shipperCompanyName").focus();
    }

    // Sets the notes section focus
    public onNotesClick() {
        var self = this;
        // To avoid tabs goes blank on quick move between tabs
        self.collapseAllTabs();
        $('#notes').addClass('active in');
        $('#notesLink').addClass('active in');

        $("#txtuserNote").focus();
        //on click we are calling this flag to show grid column resizebal as per browser window
        self.vendorBillNotesEntryViewModel.reportContainer.isAttachedToView(false);
        self.vendorBillNotesEntryViewModel.reportContainer.isAttachedToView(true);
    }

    // Handles the Item accordion click
    public onItemClick() {
        var self = this;
        // To avoid tabs goes blank on quick move between tabs
        self.collapseAllTabs();
        $('#item').addClass('active in');
        $('#itemLink').addClass('active');

        $("#addItemButton").focus();
    }

    // Handles the VendorBill accordion click
    public onVendorBillClick() {
        $("#txtVendorName").focus();
    }

    public assignVendorBillDetails(dataToBind) {
        var self = this;
        //To load Vendor bill Details
        if (dataToBind.VendorBill) {
            //** holds the vendor name. */
            self.vendorBillViewModel.vendorNameSearchList.name(new refVendorNameSearch.Models.VendorNameSearch());

            //** computes the vendor name. */
            self.vendorBillViewModel.vendorNameSearchList.vendorName(self.CommonUtils.isNullOrEmptyOrWhiteSpaces(dataToBind.VendorBill.vendorName()) ? dataToBind.VendorBill.vendorName() : '');

            //** computes the vendor. */
            self.vendorBillViewModel.vendorNameSearchList.ID(dataToBind.VendorBill.vendorId());

            //** holds the original  BOL number which is used to compare while calling BOL subscribe function. */
            self.vendorBillViewModel.originalBolNumber = dataToBind.VendorBill.bolNumber();

            //** holds the original PRO number which is used to compare while calling pro subscribe function. */
            self.vendorBillViewModel.originalProNumber = dataToBind.VendorBill.proNumber();

            //** holds the BOL number. */
            self.vendorBillViewModel.bolNumber(dataToBind.VendorBill.bolNumber());

            //** holds the PO number. */
            self.vendorBillViewModel.poNumber(dataToBind.VendorBill.poNumber());

            //** holds the PRO number. */
            self.vendorBillViewModel.proNumber(dataToBind.VendorBill.proNumber());

            //** holds the bill date. */
            self.vendorBillViewModel.billDate(dataToBind.VendorBill.billDate());

            //** holds the edit BOL number. */
            self.vendorBillViewModel.mainBolNumber(dataToBind.VendorBill.mainBolNumber());

            //** holds the reference number. */
            self.vendorBillViewModel.refNumber(dataToBind.VendorBill.refNumber());

            //** holds the origin zip. */
            self.vendorBillViewModel.originZip(dataToBind.VendorBill.originZip());

            //** holds the destination zip. */
            self.vendorBillViewModel.destinationZip(dataToBind.VendorBill.destinationZip());

            //** holds the total pieces. */
            self.vendorBillViewModel.totalPieces(dataToBind.VendorBill.totalPieces());

            //** holds the total weight. */
            self.vendorBillViewModel.totalWeigth(dataToBind.VendorBill.totalWeigth());

            //** holds the amount. */
            self.vendorBillViewModel.vendorAmount(dataToBind.VendorBill.vendorAmount());

            //** holds the delivery date. */
            self.vendorBillViewModel.deliveryDate(dataToBind.VendorBill.deliveryDate());

            //** holds the memo. */
            self.vendorBillViewModel.memo(dataToBind.VendorBill.memo());

            //** get the selected options list. */
            var selecetedList = dataToBind.VendorBill.obcvendorBillOptionList.getSelectedOptions(true);

            //** loop through all the selected options. */
            for (var i = 0; i < selecetedList.length; i++) {
                switch (selecetedList[i].id) {
                    case refEnums.Enums.vendorBillOptionConstant.MakeInactive: self.vendorBillViewModel.obcvendorBillOptionList.setSelectById(refEnums.Enums.vendorBillOptionConstant.MakeInactive); break;
                    case refEnums.Enums.vendorBillOptionConstant.FroceAttach: self.vendorBillViewModel.obcvendorBillOptionList.setSelectById(refEnums.Enums.vendorBillOptionConstant.FroceAttach); break;
                    case refEnums.Enums.vendorBillOptionConstant.Quickpay: self.vendorBillViewModel.obcvendorBillOptionList.setSelectById(refEnums.Enums.vendorBillOptionConstant.Quickpay); break;
                    case refEnums.Enums.vendorBillOptionConstant.HoldVendorBill: self.vendorBillViewModel.obcvendorBillOptionList.setSelectById(refEnums.Enums.vendorBillOptionConstant.HoldVendorBill); break;
                    default: break;
                }
            }
        }

        //** To load the VendorBill Address Details. */
        if (dataToBind.VendorBillAddress) {
            //** holds the shipper address object. */
            var ShipperAddress = new _refVendorBillAddressModel.Models.VendorBillAddress();

            //** holds the consignee address object. */
            var ConsigneeAddress = new _refVendorBillAddressModel.Models.VendorBillAddress();

            //** holds the bill to address object. */
            var BillToAddress = new _refVendorBillAddressModel.Models.VendorBillAddress();

            //** holds the international shipment details. */
            self.vendorAddressViewModel.isInternationalShipmentSelected(dataToBind.VendorBillAddress.isInternationalShipmentSelected());
            self.vendorAddressViewModel.selected(dataToBind.VendorBillAddress.selected());

            self.vendorAddressViewModel.selectedShipperCountryCode(dataToBind.VendorBillAddress.selectedShipperCountryCode());
            self.vendorAddressViewModel.selectedConsigneeCountryCode(dataToBind.VendorBillAddress.selectedConsigneeCountryCode());
            self.vendorAddressViewModel.selectedBillToCountryCode(dataToBind.VendorBillAddress.selectedBillToCountryCode());

            self.vendorAddressViewModel.html(dataToBind.VendorBillAddress.html());
            self.vendorAddressViewModel.name(dataToBind.VendorBillAddress.name());

            //** holds shipper address details. */
            ShipperAddress.Id = dataToBind.VendorBillAddress.shipperAddressId();
            ShipperAddress.Street = dataToBind.VendorBillAddress.shipperAddress1();
            ShipperAddress.Street2 = dataToBind.VendorBillAddress.shipperAddress2();
            ShipperAddress.CompanyName = dataToBind.VendorBillAddress.shipperCompanyName();
            ShipperAddress.ContactPerson = dataToBind.VendorBillAddress.shipperContactPerson();
            if (refSystem.isObject(dataToBind.VendorBillAddress.shipperLocation.location())) {
                ShipperAddress.City = dataToBind.VendorBillAddress.shipperLocation.location().City;
                ShipperAddress.State = dataToBind.VendorBillAddress.shipperLocation.location().State;
                ShipperAddress.ZipCode = dataToBind.VendorBillAddress.shipperLocation.location().Zip;
            }
            ShipperAddress.Phone = dataToBind.VendorBillAddress.shipperPhone();
            ShipperAddress.Fax = dataToBind.VendorBillAddress.shipperFax();
            ShipperAddress.AddressType = 1;
            self.vendorAddressViewModel.populateShipperAddress(ShipperAddress);

            //** holds consignee address details. */
            ConsigneeAddress.Id = dataToBind.VendorBillAddress.consigneeAddressId();
            ConsigneeAddress.Street = dataToBind.VendorBillAddress.consigneeAddress1();
            ConsigneeAddress.Street2 = dataToBind.VendorBillAddress.consigneeAddress2();
            ConsigneeAddress.CompanyName = dataToBind.VendorBillAddress.consigneeCompanyName();
            ConsigneeAddress.ContactPerson = dataToBind.VendorBillAddress.consigneeContactPerson();
            if (refSystem.isObject(dataToBind.VendorBillAddress.consigneeLocation.location())) {
                ConsigneeAddress.City = dataToBind.VendorBillAddress.consigneeLocation.location().City;
                ConsigneeAddress.State = dataToBind.VendorBillAddress.consigneeLocation.location().State;
                ConsigneeAddress.ZipCode = dataToBind.VendorBillAddress.consigneeLocation.location().Zip;
            }
            ConsigneeAddress.AddressType = 2;
            ConsigneeAddress.Phone = dataToBind.VendorBillAddress.consigneePhone();
            ConsigneeAddress.Fax = dataToBind.VendorBillAddress.consigneeFax();
            self.vendorAddressViewModel.populateConsigneeAddress(ConsigneeAddress);

            //** holds bill to address details. */
            BillToAddress.Id = dataToBind.VendorBillAddress.billToAddressId();
            BillToAddress.Street = dataToBind.VendorBillAddress.billToAddress1();
            BillToAddress.Street2 = dataToBind.VendorBillAddress.billToAddress2();
            BillToAddress.CompanyName = dataToBind.VendorBillAddress.billToCompanyName();
            if (refSystem.isObject(dataToBind.VendorBillAddress.billToLocation.location())) {
                BillToAddress.City = dataToBind.VendorBillAddress.billToLocation.location().City;
                BillToAddress.State = dataToBind.VendorBillAddress.billToLocation.location().State;
                BillToAddress.ZipCode = dataToBind.VendorBillAddress.billToLocation.location().Zip;
            }

            BillToAddress.Phone = dataToBind.VendorBillAddress.billToPhone();
            BillToAddress.Fax = dataToBind.VendorBillAddress.billToFax();
            BillToAddress.AddressType = 3;
            self.vendorAddressViewModel.processDetails(dataToBind.VendorBillAddress.processDetails());
            self.vendorAddressViewModel.populateBillToAddress(BillToAddress);
        }

        //** To load the Vendor Bill Notes Details. */
        if (dataToBind.VendorBillNotes) {
            self.vendorBillNotesEntryViewModel.userNote(dataToBind.VendorBillNotes.userNote());
            self.vendorBillNotesEntryViewModel.selecteedNotesType(dataToBind.VendorBillNotes.selecteedNotesType());
            self.vendorBillNotesEntryViewModel.vendorBillNoteItems(dataToBind.VendorBillNotes.vendorBillNoteItems());
        }

        //** To Load The Vendor Bill Items Details. */
        if (dataToBind.VendorBillItemsDetail) {
            if (dataToBind.VendorBillItemsDetail != null)
                self.vendorBillItemViewModel.populateItemsDetails(dataToBind.VendorBillItemsDetail);
        }
    }

    //When user create a VendorBill From Sales Order.
    public copySoDataToVb(data) {
        var self = this;
        if (data.VendorBill) {
            self.vendorBillViewModel.InitializeVendorBillFields(data.VendorBill);
        }

        if (data.VendorBillAddress) {
            var shipperAddress = $.grep(data.VendorBillAddress, function (e) { return e.AddressType === refEnums.Enums.AddressType.Origin.ID; })[0],
                consigneeAddress = $.grep(data.VendorBillAddress, function (e) { return e.AddressType === refEnums.Enums.AddressType.Destination.ID; })[0];
            self.vendorAddressViewModel.populateShipperAddress(shipperAddress);
            self.vendorAddressViewModel.populateConsigneeAddress(consigneeAddress);
            self.vendorAddressViewModel.populateDefaultBillToAddress();
        }

        if (data.VendorBillItemsDetail) {
            self.vendorBillItemViewModel.initializeVendorBillItemDetails(data.VendorBillItemsDetail, false, false);
            self.vendorBillItemViewModel.isDisputeAmountVisible(false);
        }
    }
    //#endregion

    //#region Load
    //function to load the data which we registered previously.
    public load(dataToBind) {
        if (!dataToBind)
            return;

        var self = this;
        if (dataToBind.isAlreadyOpened) {
            self.assignVendorBillDetails(dataToBind);
        }
        else {
            var salesOrderId = dataToBind.vendorBillId;
            var successCallBack = function (data) {
                self.isSubBill = true;
                self.copySoDataToVb(data);
                self.showListProgress(false);
            },
                faliureCallBack = function () {
                    self.showListProgress(false);
                };

            // Call will trigger when user tries to create Vendor Bill From Sales Order.
            self.vendorBillClient.CreateVendorBillFromSalesOrder(salesOrderId, successCallBack, faliureCallBack);
        }
    }
    //#endregion Load

    // Enables or disables the save button and also makes the window as dirty flag
    public changesDetected(dirty: boolean) {
        var self = this;

        if ((dirty || self.vendorBillNotesEntryViewModel.ischange()
            || self.vendorAddressViewModel.shipperLocation.returnValue || self.vendorAddressViewModel.consigneeLocation.returnValue
            || self.vendorAddressViewModel.returnValue
            || self.vendorAddressViewModel.returnValue
            ) && self.isNotSaving) {
            self.ischange(true);
            //window.ischange = true;
        }
        else {
            self.ischange(false);
            //window.ischange = false;
        }
        _app.trigger("IsBIDirtyChange", self.ischange());
    }

    // Show the progress bar
    public showListProgress(progress: boolean) {
        var self = this;
        self.listProgressAccordian(progress);
        self.listProgressTabbed(progress);
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

    //#endregion

    //#region Life Cycle Event
    // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
    public attached() {
        _app.trigger('viewAttached');
    }

    //The composition engine will execute it prior to calling the binder.
    public activate() {
        return true;
    }

    //When the value of the activator is switched to a new value, before the switch occurs, we register the view data.
    public deactivate() {
        var self = this;
        //data object will keep the viewModels.
        var data = {
            // Flag to specify whether to go to DB or not?
            isAlreadyOpened: true,

            //vendorbill data.
            VendorBill: self.vendorBillViewModel,

            //vendor bill addresses like shipper,consignee,billToaddress.
            VendorBillAddress: self.vendorAddressViewModel,

            //vendor bill notes.
            VendorBillNotes: self.vendorBillNotesEntryViewModel,

            //vendorbill items.
            VendorBillItemsDetail: self.vendorBillItemViewModel
        }
	  _app.trigger("registerMyData", data);

        self.cleanup();
    }

    public cleanup() {
        //var self = this;
        //for (var property in self) {
        //    if (property != "cleanup")
        //        delete self[property];
        //}
        //delete self;
    }

    //** Using for focus cursor on last cycle for focusing in vendor name
    public compositionComplete() {
        var self = this;
        setTimeout(function () {
            $('.txtVendorName').focus();
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
    }

    //To load the registered data if any existed.
    public beforeBind(): JQueryPromise<boolean> {
        var self = this,
            deferred = $.Deferred(),
            promise = deferred.promise();

        _app.trigger("loadMyData", function (data) {
            if (data) {
                self.load(data);
                deferred.resolve(true);
            } else {
                //_app.trigger("closeActiveTab");
                //_app.trigger("NavigateTo", 'Home');
                deferred.resolve(true);
            }
        });

        return promise;
    }
    //#endregion
}