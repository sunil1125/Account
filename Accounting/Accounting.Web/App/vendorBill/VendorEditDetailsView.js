/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app', 'vendorBill/VendorAddressView', 'vendorBill/VendorBillItemView', 'vendorBill/VendorBillDetailsView', 'vendorBill/VendorBillNotesView', 'vendorBill/VendorBillPaymentDetails', 'vendorBill/VendorBillLinks', 'services/client/VendorBillClient', 'services/client/SalesOrderClient', 'services/models/vendorBill/VendorBill', 'services/models/vendorBill/VendorBillItemDetails', 'services/models/vendorBill/VendorBillContainer', 'services/models/vendorBill/VendorBillAddress', 'services/models/vendorBill/VendorBillNote', 'services/models/common/Enums', 'templates/saveStatusIndicatorControl', 'vendorBill/VendorBillHistory', 'vendorBill/VendorBillException', 'vendorBill/VendorBillDispute', 'vendorBill/VendorBillPODDocView', 'services/models/vendorBill/VendorBillUploadFileModel'], function(require, exports, ___router__, ___app__, ___refVendorAddress__, ___refVendorItem__, ___refVendorBill__, ___refVendorBillNotes__, ___refVendorBillPayments__, ___refVendorBillLinks__, __refVendorBillClient__, __refSalesOrderClient__, ___refVendorBillModel__, ___refVendorBillItemModel__, ___refVendorBillContainerModel__, ___refVendorBillAddressModel__, ___refVendorBillNotesModel__, __refEnums__, __refsaveStatusIndicatorControl__, ___refVendorHistory__, ___refVendorBillException__, ___refVendorBillDispute__, ___refVendorBillPODDocViewModel__, __refPodDocModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var _refVendorAddress = ___refVendorAddress__;
    var _refVendorItem = ___refVendorItem__;
    var _refVendorBill = ___refVendorBill__;
    var _refVendorBillNotes = ___refVendorBillNotes__;
    var _refVendorBillPayments = ___refVendorBillPayments__;
    var _refVendorBillLinks = ___refVendorBillLinks__;
    var refVendorBillClient = __refVendorBillClient__;
    var refSalesOrderClient = __refSalesOrderClient__;
    var _refVendorBillModel = ___refVendorBillModel__;
    var _refVendorBillItemModel = ___refVendorBillItemModel__;
    var _refVendorBillContainerModel = ___refVendorBillContainerModel__;
    var _refVendorBillAddressModel = ___refVendorBillAddressModel__;
    var _refVendorBillNotesModel = ___refVendorBillNotesModel__;
    
    var refEnums = __refEnums__;
    
    var refsaveStatusIndicatorControl = __refsaveStatusIndicatorControl__;
    var _refVendorHistory = ___refVendorHistory__;
    var _refVendorBillException = ___refVendorBillException__;
    
    var _refVendorBillDispute = ___refVendorBillDispute__;
    var _refVendorBillPODDocViewModel = ___refVendorBillPODDocViewModel__;
    var refPodDocModel = __refPodDocModel__;

    //#endregion
    /*
    ** <summary>
    ** Vendor Edit details View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US8214</id> <by>Satish</by> <date>27th May, 2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US9669</id> <by>Achal Rastogi</by> <date>6-3-2014</date>
    ** <id>DE20309</id> <by>Shreesha Adiga</by> <date>26-10-2015</date>
    ** <description>Set iscallforedit true, because validation for international shipment was failing</description>
    ** <id>DE21426</id> <by>Vasanthakumar</by> <date>19-01-2016</date> <description>Change detection toastr msg is not showing editing the notes in Invoiced SO/VB</description>
    ** <id>DE21533</id> <by>Chandan Singh Bajetha</by> <date>22-01-2016</date> <description>Refresh button does not work as expected on VB Dipsute Notes tab</description>
    ** <id>US20305</id> <by>Chandan Singh Bajetha</by> <date>07-01-2016</date> <description>Acct: Remove extra ADD button from SO & VB Notes Section</description>
    ** <id>DE21616</id> <by>Shreesha Adiga</by> <date>09-02-2016</date> <description>Removed the disabling of inputs using jquery</description>
    ** <id>US20585</id> <by>Chandan Singh Bajetha</by> <date>11-02-2016</date> <description>Acct: Capture history for Dispute Notes Status</description>
    ** <id>US21146</id> <by>Shreesha Adiga</by> <date>15-03-2016</date> <description>If bill status is overcharge claim, then enable bill status dropdown and save button, even if moved to mas</description>
    ** <id>US20884</id> <by>Baldev Singh Thakur</by> <date>18-03-2016</date> <description>Create Lost Bill Functionality</description>
    ** <id>DE22371</id> <by>Baldev Singh Thakur</by> <date>04-04-2016</date> <description>CC Vendor Bill Link creating sub bills</description>
    ** <id>DE22284</id> <by>Shreesha Adiga</by> <date>15-04-2016</date> <description>For new sub bills and lost bills close the tab and open again (this is done to update the tabs with proper VBId)</description>
    ** <id>US21132</id> <by>Shreesha Adiga</by> <date>26-04-2016</date><description>Changes related to showing the dispute lost popup from sales order; Showing "Create Lost Bill" toastr after save on popup</description>
    ** <id>US21597</id> <by>Baldev Singh Thakur</by> <date>28-04-2016</date> <description>Added LateDisputeAmount, for displaying Late Dispute Amount.</description >
    ** <id>DE22808</id> <by>Baldev Singh Thakur</by> <date>13-05-2016</date><description>Error message on saving Bill/UVB even if bill has saved successfully.</description>
    ** <id>US23124</id> <by>Janakiram</by> <date>04-07-2016</date><description>Implemented Memo text logic for notes while saving </description>
    ** <id>DE23449</id> <by>Janakiram</by> <date>04-07-2016</date><description>Checking Memo notes not entered</description>
    ** <id>DE23500</id> <by>Shreesha Adiga</by> <date>13-07-2016</date><description>Save Vendor bill for OVC to OVC won/loss</description>
    ** <id>DE23503</id> <by>Baldev Singh Thakur</by> <date>13-07-2016</date><description>Final Cost is getting updated on changing bill status from  OVC  to OVC won/lost.</description>
    ** <id>DE23601</id> <by>Baldev Singh Thakur</by> <date>25-07-2016</date><description>Cannot mark dispute short paid bill to dispute won for MAS moved bill.</description>
    ** <id>US23929</id> <by>Vasanthakumar</by> <date>22-08-2016</date> <description>VB Status availability in Dispute Short Paid Status</description>
    ** <id>DE24131</id> <by>Baldev Singh Thakur</by> <date>25-08-2016</date> <description>Hold Bill wasn't being uncheked.</description>
    ** <id>DE24166</id> <by>Janakiram</by> <date>31-08-2016</date> <description>Disabled internationalShipmentButton button if bill moved to MAS.</description>
    ** <id>DE24352</id> <by>Baldev Singh Thakur</by> <date>13-09-2016</date> <description>Fixed the issue of InternationalShipment Button enabling and disabling.</description>
    ** <id>US24647</id> <by>Janakiram</by> <date>14-09-2016</date> <description>Modified the logic to reload the Bill, if it has already been modified, and also updated the message Record Already Changed.</description>
    ** <id>US24631</id> <by>Baldev Singh Thakur</by> <date>15-09-2016</date><description>Modified the code for not to disable the Address fields whenever a new Sub-bill/Lost bill is created though the main bill's IDBFlag is true.</description>
    ** <id>DE24130</id> <by>Baldev Singh Thakur</by> <date>16-09-2016</date><description>Added a call back from VendorBillException for reloading the bill.</description>
    ** <id>DE24441</id> <by>Janakiram</by> <date>22-2016</date> <description>Modified the logic to reload the Bill, if it has already been modified, and also updated the message Record Already Changed. Set local storgae as original PRO NO.</description>
    ** <id>DE24440</id> <by>Janakiram</by> <date>22-2016</date> <description>Modified the logic to reload the Bill once PRO Changed.</description>
    ** <id>DE24596</id> <by>Baldev Singh Thakur</by> <date>29-09-2016</date><description>Assigning the Original BOL No to the existing property to check if the BOL No has been modified.</description>
    ** <id>DE23159</id> <by>Vasanthakumar</by> <date>03-10-2016</date><description>VB is opening as Editable mode for Account Receivable role.</description>
    ** <id>US25310</id> <by>Shreesha Adiga</by> <date>24-10-2016</date> <description>Changes realted to showing Credit Request Popup on Dispute Won</description>
    ** <id>US25679</id> <by>Baldev Singh Thakur</by><date>11-11-2016</date><description>Added new reason 'Split Absorb' in Credit Reason Enums</description>
    ** <id>US25681</id> <by>Janakiram</by><date>15-11-2016</date><description>Dispaly/Hide Vendor Bill Reassignment button Based on MAS and Sub Bill</description>
    ** <id>US25684</id> <by>Shreesha Adiga</by> <date>23-11-2016</date><description>Changes related to VB reassignment popup</description>
    ** <id>US26559</id> <by>Vasanthakumar</by> <date>02-02-2017</date> <description>Get Invoiced SO list and pass to credit memo popup</description>
    ** <id>US26575</id> <by>Baldev Singh Thakur</by> <date>03-02-2017</date> <description>Added condition to display BS Cost and appropriate fields if the order attached to the bill is Billing Station.</description>
    ** <id>US26955</id> <by>Baldev Singh Thakur</by> <date>16-02-2016</date><description>Passing actual cost to the vendor bill reassignment popup.</description>
    ** <id>US28121</id> <by>Baldev Singh Thakur</by> <date>13-04-2017</date> <description>Removed the logic of passing the cost of bill and sub-bill for vendor bill re-assignment.</description>
    ** </changeHistory>
    */
    var VendorBillEditDetailsViewModel = (function () {
        // ###END: US26955
        //#endregion
        //#region Constructor
        function VendorBillEditDetailsViewModel() {
            this.saveStatusIndicatorControl = new refsaveStatusIndicatorControl.SaveStatusIndicatorControl();
            this.vendorBillClient = new refVendorBillClient.VendorBillClient();
            // ##START: US25310
            this.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
            this.carrierId = ko.observable(0);
            this.canForceAttach = false;
            this.isSubBill = false;
            this.isUpdateProNo = false;
            this.isPoWithBol = false;
            this.rowaffected = 0;
            this.checkMsgDisplay = true;
            this.checkCompCalled = false;
            // to show the progress bar
            this.listProgress = ko.observable(false);
            this.listProgressAccordian = ko.observable(false);
            this.listProgressTabbed = ko.observable(false);
            this.listProgressPayment = ko.observable(false);
            this.listProgressLinks = ko.observable(false);
            this.listProgressLinksTabbed = ko.observable(false);
            this.listProgressHistory = ko.observable(false);
            this.listProgressException = ko.observable(false);
            this.listProgressDispute = ko.observable(false);
            this.listProgressDisputeTabbed = ko.observable(false);
            // Check vendor bill is in intermediate state
            this.isPresentInIntermediate = false;
            // Check vendor bill is in mas status permanent
            this.isPresentInMasPermanent = false;
            // To get the logged in user
            this.currentUser = ko.observable();
            // flag for navigation to show changes
            this.isChange = ko.observable(false);
            //src of expand
            this.expandSourceImage = ko.observable('Content/images/expand.png');
            //src of collapse
            this.collapseSourceImage = ko.observable('Content/images/collapse.png');
            this.isNotAtLoadingTime = false;
            this.isSearchByUrl = false;
            this.isAccordion = ko.observable(false);
            this.isExceptionTabAndAccordion = ko.observable(false);
            this.isExceptionShowPopup = ko.observable(false);
            this.vendorBillExceptionRule = ko.observable('');
            this.VendorBillExceptionResulation = ko.observable('');
            this.vendorBillId = ko.observable(0);
            this.OriginZip = ko.observable('');
            // ###START: US20884
            this.isLostBill = ko.observable(false);
            // ###END: US20884
            // ###START: US21597
            this.lateDisputeAmount = 0;
            // ###END: US21597
            // for validation
            this.isValidVendorBill = false;
            this.isValidAddress = false;
            this.isValidItems = false;
            // keep the suborder count
            this.subOrderCount = 0;
            // To disable Create SubBill Button
            this.isSubOrderBill = ko.observable(true);
            // keep the header of vendor bill whether it's I term or T term
            this.vendorBillHeader = ko.observable('Vendor Bill');
            // to keep the visibility of create lost bill button
            this.isCreateLostBillVisible = ko.observable(false);
            // keep the vendor bill container object
            this.originalVendorBillContainer = new _refVendorBillContainerModel.Models.VendorBillContainer();
            // to keep the visibility of dispute won/lost bill button
            this.isDisputeWonLostVisible = ko.observable(true);
            // to keep the clicked status of dispute won / lost button
            this.isDisputeWonLostButtonClicked = false;
            // to keep the bill status of dispute won/lost button
            this.billStatusOfDisputeWonLostButtonClicked = 0;
            //once call load from inside compositionComplete
            this.iscompositionCompleteCalled = ko.observable(true);
            // to keep the visibility of Revert bill button
            this.isRevertBillVisible = ko.observable(false);
            // ###START:US25681
            // To keep the visibility of  VB Reassignment Button
            this.isVBReassignmentVisible = ko.observable(false);
            // ###END:US25681
            this.billStatus = 0;
            this.commonUtils = new Utils.Common();
            this.currentDateTime = ko.observable('');
            this.msgAmountDiffrenceToShowOnValidationMessage = 0;
            // to keep force attach, make inactive, quick pay, hold vendor bill state
            this.isForceAttachOptionSelecteed = false;
            this.isMakeInactiveSelecteed = false;
            this.isQuickPaySelecteed = false;
            this.isHoldvendorBillSelecetedSelecteed = false;
            this.isSaveEnable = false;
            this.isViewOnly = false;
            // ##START: DE23601
            this.isDisputeWonClicked = false;
            //##END: DE23601
            this.IsClearedPermission = false;
            this.canForcePushToMasVisible = ko.observable(false);
            //##END: US21146
            // ##START: DE22284
            this.isNewSubBill = false;
            this.isNewLostBill = false;
            // ##END: DE22284
            // ##START: US21132
            this.hasLostBill = false;
            // ##END: US21132
            // ###START: DE23503
            this.disputeAmount = 0;
            // ###END: DE23503
            // ##START: US25310
            this.creditReasonOptions = [];
            this.totalDisputeAmountOnDisputeWon = $.number(0, 2);
            this.totalPendingCreditAmount = $.number(0, 2);
            this.showCreditRequestAfterSave = false;
            // ##END: US25310
            // ###START: US25679
            this.totalPendingVendorAmount = $.number(0, 2);
            // ###END: US25679
            // ##START: US25684
            this.vendorBillReassignmentReasons = [];
            this.suborderRevenueList = [];
            // ##END: US25684
            this.invoicedSOExceptCMSubSo = [];
            // ###START: US26955
            this.actualBillCost = ko.observable(0);
            var self = this;

            //Call to populate Shipper and consignee Address
            self.vendorBillDetailsViewModel = new _refVendorBill.VendorBillDetailsViewModel(function (shipperAddress) {
                self.vendorAddressViewModel.populateShipperAddress(shipperAddress);
            }, function (consigneeAddress) {
                self.vendorAddressViewModel.populateConsigneeAddress(consigneeAddress);
            }, //Call back to expand either items or Address when user press 'TAB' form reference number.
            function () {
                if (self.isAccordion()) {
                    //this.collapseView('collapseVendorBill');
                    //self.expandView('collapseAddress');
                    //$('#addressDiv').focus();
                    //$('#collapseAddress').css("overflow", "visible");
                    self.expandView('collapseItems');
                    $('#itemsDiv').focus();
                    $('#collapseItems').css("overflow", "visible");
                } else {
                    self.collapseAllTabs();

                    //$('#address').addClass('active in');
                    //$('#addressLink').addClass('active');
                    $('#item').addClass('active in');
                    $('#itemLink').addClass('active');
                }
            }, function (isDisputeStatus, isDisputeLostStatus) {
                if (isDisputeStatus) {
                    self.vendorBillItemViewModel.isDisputeAmountEditable(true);
                } else {
                    self.vendorBillItemViewModel.isDisputeAmountEditable(false);
                }

                if (isDisputeLostStatus) {
                    self.vendorBillItemViewModel.isDisputeLostAmountEditable(true);
                } else {
                    self.vendorBillItemViewModel.isDisputeLostAmountEditable(false);
                }
            });

            self.vendorBillItemViewModel = new _refVendorItem.VendorBillItemViewModel(function (totalCost, totalWeght, totalPices, totalDisputeAmount) {
                self.vendorBillDetailsViewModel.totalWeigth(totalWeght);

                //self.vendorBillDetailsViewModel.vendorAmount($.number(totalCost, 2));Commented as to be in format with dispute amount
                self.vendorBillDetailsViewModel.vendorAmount(totalCost.toFixed(2).toString());
                self.vendorBillDetailsViewModel.totalPieces(totalPices);

                if (self.lateDisputeAmount > 0) {
                    self.vendorBillDetailsViewModel.disputedAmount(self.lateDisputeAmount.toFixed(2).toString());
                } else {
                    self.vendorBillDetailsViewModel.disputedAmount(totalDisputeAmount.toFixed(2).toString());
                }
                // ###END: US21597
                //self.vendorBillDetailsViewModel.disputedAmount(totalDisputeAmount);//Commented as the validation was throwing error by including comma
            }, function () {
                var bolNumber = self.vendorBillDetailsViewModel.bolNumber();
                if (!self.isAccordion()) {
                    self.collapseAllTabs();
                    if (bolNumber.trim() !== "") {
                        self.collapseView('collapseItems');
                        $('#notes').addClass('active in');
                        $('#notesLink').addClass('active');
                        self.expandView('collapseNotes');
                        $("#notesDiv").focus();
                    } else {
                        self.collapseView('collapseItems');
                        self.expandView('collapseAddress');
                        $('#addressDiv').focus();
                    }
                } else {
                    if (bolNumber.trim() !== "") {
                        self.collapseView('collapseItems');
                        $('#collapseItems').css("overflow", "hidden");
                        self.expandView('collapseNotes');
                        $("#notesDiv").focus();
                    } else {
                        self.collapseView('collapseItems');
                        $('#collapseItems').css("overflow", "hidden");
                        self.expandView('collapseAddress');
                        $('#addressDiv').focus();
                    }
                }
            });

            self.vendorAddressViewModel = new _refVendorAddress.VendorAddressViewModel(function (originZip, destinationZip) {
                self.vendorBillDetailsViewModel.originZip(originZip);
                self.vendorBillDetailsViewModel.destinationZip(destinationZip);
            }, //Call back to expand either items or Address when user press 'TAB' form reference number.
            function () {
                if (self.isAccordion()) {
                    //if BOL number is exists then expand items;
                    self.collapseView('collapseAddress');
                    self.expandView('collapseNotes');
                    $('#notesDiv').focus();
                } else {
                    self.collapseAllTabs();
                    $('#notes').addClass('active in');
                    $('#notesLink').addClass('active');
                }
            });

            self.vendorBillPaymentDetailsViewModel = new _refVendorBillPayments.VendorBillPaymentDetailsViewModel();

            self.vendorBillNotesViewModel = new _refVendorBillNotes.vendorBillNotesViewModel();

            self.vendorBillLinksViewModel = new _refVendorBillLinks.VendorBillLinksViewModel();

            self.vendorBillHistoryViewModel = new _refVendorHistory.VendorBillHistory();

            // ###START: DE24130
            self.VendorBillException = new _refVendorBillException.VendorBillExceptionViewModel(function () {
                self.reloadPage();
            });

            // ###END: DE24130
            self.VendorBillDispute = new _refVendorBillDispute.VendorBillisputeViewModel();

            self.vendorBillPODDocViewModel = new _refVendorBillPODDocViewModel.VendorBillPODDocViewModel();

            // Enables or disables the save button and also makes the window as dirty flag
            self.changesDetected = function (dirty) {
                if (self.isNotAtLoadingTime === false) {
                    if (self.vendorBillDetailsViewModel.memo() != null && self.vendorBillDetailsViewModel.MemoexistingValue() != null && self.vendorBillDetailsViewModel.memo().trim() != self.vendorBillDetailsViewModel.MemoexistingValue().trim()) {
                        self.isChange(true);
                    } else if (dirty || (self.vendorBillNotesViewModel.ischange()) || (self.vendorBillNotesViewModel.returnValue()) || (self.vendorAddressViewModel.shipperLocation.returnValue) || (self.vendorAddressViewModel.consigneeLocation.returnValue) || (self.vendorAddressViewModel.returnValue) || (self.vendorBillDetailsViewModel.vendorNameSearchList.returnValue) || (self.vendorBillDetailsViewModel.returnValueFlag) || (self.vendorBillDetailsViewModel.ischange) || (self.vendorBillItemViewModel.returnValue()) || (self.vendorBillDetailsViewModel.obcvendorBillOptionList.ischange())) {
                        if (self.isSaveEnable) {
                            self.isChange(false);
                            //##START: DE21616
                            //self.DisableAlltheControls();
                            //##END: DE21616
                        } else {
                            self.isChange(true);
                        }

                        if (self.billStatusOnLoad == refEnums.Enums.VendorBillStatus.OverchargeClaim.ID && self.billStatusOnLoad != self.vendorBillDetailsViewModel.selectedbillStatus()) {
                            self.isChange(true);

                            //##START: DE23500
                            self.isSaveEnable = false;
                            //##END: DE23500
                        }
                        //##END: US21146
                        //window.ischange = true;
                    } else {
                        self.isChange(false);
                        //window.ischange = false;
                    }

                    _app.trigger("IsBIDirtyChange", self.isChange());

                    if (self.vendorBillNotesViewModel.returnValue() && self.isSaveEnable && self.isChange() === false) {
                        _app.trigger("IsBIDirtyChange", true);
                    }
                    // ###END: DE21426
                }
            };

            if (!self.currentUser()) {
                // Get the logged in user for name for new note}
                _app.trigger("GetCurrentUserDetails", function (currentUser) {
                    self.currentUser(currentUser);
                });
            }

            //## function to disable international shipment  checkbox of address view if bill status is cleared.
            self.vendorBillDetailsViewModel.selectedbillStatus.subscribe(function (newValue) {
                if (newValue === refEnums.Enums.VendorBillStatus.Cleared.ID) {
                    if (self.vendorAddressViewModel.shouldBeReadOnly()) {
                        self.vendorAddressViewModel.isBillStatusCleared(true);
                    } else
                        self.vendorAddressViewModel.isBillStatusCleared(false);
                } else {
                    if (self.vendorAddressViewModel.shouldBeReadOnly()) {
                        self.vendorAddressViewModel.isBillStatusCleared(true);
                    } else
                        self.vendorAddressViewModel.isBillStatusCleared(false);
                }

                if (self.vendorBillDetailsViewModel.isNotAtLoadingTime === false && newValue == refEnums.Enums.VendorBillStatus.DisputeLost.ID) {
                    self.onDisputeLost();
                }

                // ###END: US23929
                self.GetDisputeDetails(newValue);
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
                self.getHistorydetails();
                self.expandView('collapseHistory');
                self.GetDisputeDetails(undefined);
                self.expandView('collapseDispute');
            };

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
                self.collapseView('collapseException');
                self.collapseView('collapseDispute');
                self.collapseSourceImage('Content/images/collapse_hit.png');
                self.expandSourceImage('Content/images/expand.png');
            };

            // for calling CheckForceAttachOptions
            self.callvalidateVendorBill = function () {
                self.validateVendorBill();
            };

            // for calling ValidateVendorNotes
            self.callValidateVendorNotes = function () {
                self.ValidateVendorNotes();
            };

            //display msg to check  if suborder is create
            self.callCheckSubOrderCreate = function () {
                self.ShowProgressBar(true);

                // ###START: US20884
                var vendorBillId = self.vendorBillDetailsViewModel.vendorBillId();
                var proNumber = self.findProNumber();

                // ###START: DE24441
                self.clearLocalStorage(self.vendorBillDetailsViewModel.vendorBillId() + '_' + self.originalVendorBillContainer.VendorBill.ProNumber);

                // ###END: DE24441
                _app.trigger("openVendorBill", vendorBillId, proNumber, function (callback) {
                    if (!callback) {
                        return;
                    }
                }, false, false, true);
                // ###END: US20884
            };

            self.callisNegativeMarginYes = function () {
                self.checkMsgDisplay = true;
                var notesDescription = "The bill is cleared leading to $ " + self.msgAmountDiffrenceToShowOnValidationMessage.toFixed(2) + " reduction in margin, by " + self.currentUser().FullName + new Date().toString();
                self.vendorBillNotesViewModel.vendorBillNoteItems.push(new _refVendorBillNotes.vendorBillNoteItem(0, self.vendorBillDetailsViewModel.vendorBillId(), notesDescription, self.currentUser().FullName, Date.now(), "General"));
                self.setUpModelAndSave();
            };

            self.callisNegativeMarginNo = function () {
                self.checkMsgDisplay = true;
                if (self.vendorBillDetailsViewModel.selectedbillStatus() !== self.vendorBillDetailsViewModel.originalBillStatus) {
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.ChangePreviousStatusOnNegativeMargin, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                    }
                }

                self.vendorBillDetailsViewModel.selectedbillStatus(self.vendorBillDetailsViewModel.originalBillStatus);
            };

            self.callCheckBolValidationNo = function () {
                self.checkMsgDisplay = true;
                self.isPoWithBol = false;
                if (!$("#collapseVendorBill").hasClass("in")) {
                    $('#collapseVendorBill').collapse('toggle');
                }

                $("#bolNumberInput").focus();
                $("#bolNumberInput").select();
            };

            self.callCheckBolValidationYes = function () {
                self.checkMsgDisplay = true;
                self.isPoWithBol = true;

                // Call next validation
                self.ValidatePRONumber();
            };

            self.callForceAttchNo = function () {
                self.checkMsgDisplay = true;
                self.canForceAttach = false;
                self.isNegativeMargin();
            };

            self.callForceAttchYes = function () {
                self.checkMsgDisplay = true;
                self.canForceAttach = true;
                self.vendorBillDetailsViewModel.obcvendorBillOptionList.getOptionsById(1).selected(false);
                self.vendorBillDetailsViewModel.obcvendorBillOptionList.getOptionsById(2).selected(true);
                if (self.MsgexistingProNo.toString() != "" && !self.isSubBill) {
                    self.matchingSalesMsg(self.MsgexistingProNo);
                } else {
                    self.isNegativeMargin();
                }
            };

            self.callMatchingsalesYes = function () {
                self.checkMsgDisplay = true;
                self.canForceAttach = true;
                self.isUpdateProNo = true;
                self.isNegativeMargin();
            };

            self.callMatchingsalesNo = function () {
                self.checkMsgDisplay = true;
                self.canForceAttach = false;
                self.isNegativeMargin();
            };

            //To check if Msg is clicked
            self.checkMsgClick = function () {
                self.checkMsgDisplay = true;
            };

            // to Check if Msg is hidden or closed
            self.checkMsgHide = function () {
                self.checkMsgDisplay = true;
            };

            self.VendorBillDispute.callReloadVendorBill = function () {
                // ###START: DE24441
                self.clearLocalStorage(self.vendorBillDetailsViewModel.vendorBillId() + '_' + self.originalVendorBillContainer.VendorBill.ProNumber);

                // ###END: DE24441
                self.beforeBind();

                //self.loadViewAfterComposition();
                self.GetDisputeDetails(undefined);
            };

            self.resizeFunction = function () {
                if (self.vendorBillNotesViewModel) {
                    //on click we are calling this flag to show grid column resizebal as per browser window
                    self.vendorBillNotesViewModel.reportContainer.isAttachedToView(false);
                    self.vendorBillNotesViewModel.reportContainer.isAttachedToView(true);
                }

                if (self.vendorBillPODDocViewModel) {
                    //on click we are calling this flag to show grid column resizebal as per browser window
                    self.vendorBillPODDocViewModel.reportContainer.isAttachedToView(false);
                    self.vendorBillPODDocViewModel.reportContainer.isAttachedToView(true);
                }

                if (self.vendorBillPaymentDetailsViewModel) {
                    //on click we are calling this flag to show grid column resizebal as per browser window
                    self.vendorBillPaymentDetailsViewModel.reportContainer.isAttachedToView(false);
                    self.vendorBillPaymentDetailsViewModel.reportContainer.isAttachedToView(true);
                }
            };

            //TO set grid column after browser resizing
            window.addEventListener("resize", self.resizeFunction);

            self.CallChangeMadeFunctions();

            //#endregion
            return self;
        }
        //#endregion
        //#region Internal Methods
        //#region Save
        // For Validating
        VendorBillEditDetailsViewModel.prototype.onSave = function () {
            var self = this;

            if (!self.isViewOnly && !self.isSaveEnable) {
                // ###END: US23124
                // Show all the validation as once (All section validation)
                var isVendorBillValid = false, isVendorAddressesValid = false, isVendorItemValid = false;

                isVendorBillValid = self.vendorBillDetailsViewModel.validateBill();
                isVendorItemValid = self.vendorBillItemViewModel.validateItems();
                isVendorAddressesValid = self.vendorAddressViewModel.validateAddresses();

                if (self.isAccordion()) {
                    self.validateAccordionView(isVendorAddressesValid, isVendorItemValid);
                } else {
                    self.validateTabbedView(isVendorAddressesValid, isVendorItemValid);
                }

                if (self.isLostBill() && !self.validateLostBillCostWithRevenueOfOrder()) {
                    return;
                } else if (!(!isVendorBillValid && self.isValidAddress && self.isValidItems)) {
                    return;
                } else {
                    if (self.vendorBillDetailsViewModel.carrierId() != 0) {
                        self.saveVendorBill();
                        self.saveStatusIndicatorControl.applySettings(refEnums.Enums.SavingStatus.ChangesSaved.ID);
                        self.isChange(false);

                        //window.ischange = false;
                        _app.trigger("IsBIDirtyChange", self.isChange(false));
                    } else {
                        if (self.checkMsgDisplay) {
                            self.checkMsgDisplay = false;
                            var toastrOptions = {
                                toastrPositionClass: "toast-top-middle",
                                delayInseconds: 10,
                                fadeOut: 10,
                                typeOfAlert: "",
                                title: ""
                            };

                            Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.CarrierValidationMessage, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                        }
                    }
                }
                // ###START: US23124
            } else {
                self.setUpModelAndSave();
                return true;
            }
            // ###END: US23124
        };

        // function to validate tab view section
        VendorBillEditDetailsViewModel.prototype.validateTabbedView = function (isVendorAddressesValid, isVendorItemValid) {
            var self = this;
            self.collapseAllTabs();

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
        };

        // function to validate accordion view section
        VendorBillEditDetailsViewModel.prototype.validateAccordionView = function (isVendorAddressesValid, isVendorItemValid) {
            var self = this;

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
            if ($('#collapseDispute').hasClass('in')) {
                $('#collapseDispute').collapse('toggle');
                $('#AchorcollapseDispute').addClass('collapsed');
            }

            if (isVendorAddressesValid) {
                $('#collapseAddress').collapse('show');
                $('#AchorcollapseAddress').removeClass('collapsed');
                self.isValidAddress = false;
                setTimeout(function () {
                    $('#collapseAddress').css("overflow", "visible");
                }, 500);
            } else {
                self.isValidAddress = true;
                self.collapseAchorcAddress();
            }

            if (isVendorItemValid) {
                $('#collapseItems').collapse('show');
                $('#AchorcollapseItems').removeClass('collapsed');
                self.isValidItems = false;
            } else {
                self.isValidItems = true;
                self.colapseAchorItems();
            }
        };

        //to collapse all the tabs
        VendorBillEditDetailsViewModel.prototype.collapseAllTabs = function () {
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
            if ($('#payment').hasClass('in')) {
                $('#payment').removeClass('active in');
                $('#paymentLink').removeClass('active in');
            }
            if ($('#links').hasClass('in')) {
                $('#links').removeClass('active in');
                $('#linksLink').removeClass('active in');
            }
            if ($('#history').hasClass('in')) {
                $('#history').removeClass('active in');
                $('#historyLink').removeClass('active in');
            }
            if ($('#dispute').hasClass('in')) {
                $('#dispute').removeClass('active in');
                $('#disputeLink').removeClass('active in');
            }
            if ($('#exception').hasClass('in')) {
                $('#exception').removeClass('active in');
                $('#exceptionLink').removeClass('active in');
            }
            if ($('#tab_podDoc').hasClass('in')) {
                $('#tab_podDoc').removeClass('active in');
                $('#podDocLink').removeClass('active in');
            }
        };

        VendorBillEditDetailsViewModel.prototype.collapseAllTabAndOpenItem = function () {
            var self = this;
            self.collapseAllTabs();
            $('#item').addClass('active in');
            $('#itemLink').addClass('active in');
            self.ActiveDisputeTab(self.vendorBillDetailsViewModel.selectedbillStatus());
        };

        //To collapse one by one if we have no validation in VendorBill Address and Items
        VendorBillEditDetailsViewModel.prototype.collapseAchorVendorBill = function () {
            var self = this;
            if ($('#collapseVendorBill').hasClass('in') && self.isValidVendorBill) {
                $('#collapseVendorBill').collapse('toggle');
                $('#AchorcollapseVendorBill').addClass('collapsed');
            }
        };

        VendorBillEditDetailsViewModel.prototype.collapseAchorcAddress = function () {
            var self = this;
            if ($('#collapseAddress').hasClass('in') && self.isValidAddress) {
                $('#collapseAddress').collapse('toggle');
                $('#AchorcollapseAddress').addClass('collapsed');
            }

            $('#collapseAddress').css("overflow", "hidden");
        };

        VendorBillEditDetailsViewModel.prototype.colapseAchorItems = function () {
            var self = this;
            if ($('#collapseItems').hasClass('in') && self.isValidItems) {
                $('#collapseItems').collapse('toggle');
                $('#AchorcollapseItems').addClass('collapsed');
            }
        };

        // For Saving Vendor Bill Detail
        VendorBillEditDetailsViewModel.prototype.saveVendorBill = function () {
            var self = this;

            if (self.validateCostDisputeAmount() && self.vendorBillDetailsViewModel.validateDisputeData()) {
                if (self.checkStatusIsDisputeWonOrDisputeLost()) {
                    self.checkStatusIsPendingOrNot();
                }
            }
        };

        // Gets the data from all the different view model and sends those to service
        VendorBillEditDetailsViewModel.prototype.setUpModelAndSave = function () {
            var self = this, commonUtils = new Utils.Common();

            // ###END: DE23449
            var vendorBillData = new _refVendorBillContainerModel.Models.VendorBillContainer();
            self.ShowProgressBar(true);

            // ###START: US23124
            vendorBillData.IsReadOnly = self.isViewOnly;

            if (self.isDisputeWonClicked == true) {
                vendorBillData.IsSaveEnable = false;
            } else {
                vendorBillData.IsSaveEnable = self.isSaveEnable;
            }

            //##END: DE23601
            // ###END: US23124
            vendorBillData.VendorBill = self.getVendorBillDetails();
            vendorBillData.VendorBillAddress = self.getVendorBillAddress();
            vendorBillData.VendorBillItemsDetail = self.getVendorBillItemsDetails();
            vendorBillData.VendorBillNotes = self.getVendorBillNotes();

            if (self.originalVendorBillContainer.VendorBill.BillStatus === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID && vendorBillData.VendorBill.BillStatus === refEnums.Enums.VendorBillStatus.DisputeWon.ID) {
                self.preloadCreditRequestDetails();
            }

            // ##END: US25310
            // ###START: DE24441
            self.clearLocalStorage(self.vendorBillDetailsViewModel.vendorBillId() + '_' + self.originalVendorBillContainer.VendorBill.ProNumber);

            // ###END: DE24441
            refVendorBillClient.VendorBillClient.prototype.SaveVendorBillDetail(vendorBillData, function (message) {
                // Saving successful callback
                self.ShowProgressBar(false);

                if (self.commonUtils.isNullOrEmptyOrWhiteSpaces(vendorBillData.VendorBill.OriginalBOLNumber) && !self.commonUtils.isNullOrEmptyOrWhiteSpaces(vendorBillData.VendorBill.BolNumber)) {
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var toastrOptions1 = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.VendorBillIsNowPO, "info", self.checkMsgClick, toastrOptions1, self.checkMsgHide);

                        _app.trigger('closeActiveTab');
                        _app.trigger("openPurchaseOrder", self.vendorBillDetailsViewModel.vendorBillId(), self.vendorBillDetailsViewModel.proNumber().replace(/ PURGE/g, ""), function (callback) {
                            if (!callback) {
                                return;
                            }
                        });
                    }
                } else if (self.isNewSubBill || self.isNewLostBill) {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SavedSuccessfullyMessage, "success", null, toastrOptions);

                    _app.trigger('closeActiveTab');
                    _app.trigger("openVendorBill", message, vendorBillData.VendorBill.ProNumber, function (callback) {
                        if (!callback) {
                            return;
                        }
                    });
                } else {
                    var proNumber = self.vendorBillDetailsViewModel.proNumber().replace(" PURGE", "");
                    if (self.isMakeInactiveSelecteed) {
                        proNumber = proNumber + " PURGE";
                    }

                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SavedSuccessfullyMessage, "success", null, toastrOptions);
                    self.isSubBill = false;

                    // ##START: DE22284
                    self.isNewSubBill = false;
                    self.isNewLostBill = false;

                    if (self.originalVendorBillContainer.VendorBill.BillStatus === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID && vendorBillData.VendorBill.BillStatus === refEnums.Enums.VendorBillStatus.DisputeWon.ID) {
                        self.showCreditRequestAfterSave = true;
                    }

                    // ##END: US25310
                    self.registerData(message, false);
                    self.beforeBind();
                }
            }, function (message) {
                // Saving failed call back
                self.ShowProgressBar(false);
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    // ###START: US24647
                    delayInseconds: 5,
                    fadeOut: 5,
                    // ###END: US24647
                    typeOfAlert: "",
                    title: ""
                };

                if (typeof (message) === 'object') {
                    if (message.StatusModel.StatusCode === Constants.ApplicationConstants.MemoNotesUpdated) {
                        if (commonUtils.isNullOrEmptyOrWhiteSpaces(self.vendorBillDetailsViewModel.memo())) {
                            Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, message.StatusModel.Description, "success", null, toastrOptions);
                        }

                        // ###END: DE23449
                        self.beforeBind();
                    } else if (message.StatusModel.StatusCode == Constants.ApplicationConstants.RecordAlreadyChanged) {
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.RecordAlreadyChanged, "error", null, toastrOptions);
                        setTimeout(function () {
                            self.reloadPage();
                        }, 5000);
                    } else {
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message.StatusModel.Description, "error", null, toastrOptions);
                    }
                    // ###END: US23124
                } else {
                    if (typeof (message) === 'object') {
                        if (message.StatusModel.StatusCode == Constants.ApplicationConstants.RecordAlreadyChanged) {
                            Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.RecordAlreadyChanged, "error", null, toastrOptions);
                            setTimeout(function () {
                                self.reloadPage();
                            }, 5000);
                        }
                    } else {
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
                    }
                    // ###END: US24647
                }
                // ###END: DE22808
            });
        };

        VendorBillEditDetailsViewModel.prototype.reloadPage = function () {
            var self = this;
            self.ShowProgressBar(true);

            // ###START: DE24441
            self.clearLocalStorage(self.vendorBillId() + '_' + self.originalVendorBillContainer.VendorBill.ProNumber);

            // ###END: DE24441
            LocalStorageController.Set(self.vendorBillId() + '_' + self.vendorBillDetailsViewModel.proNumber() + 'lastReloadDateTime', undefined);
            self.beforeBind();

            if ($('#dispute').hasClass('in')) {
                self.getVendorBillDisputeItemDetails();
            }
            // ###END: DE21533
            //self.loadViewAfterComposition();
        };

        //set Date Time for record of last refreshed
        VendorBillEditDetailsViewModel.prototype.setDateTimeOfReload = function () {
            var self = this;
            if (LocalStorageController.Get(self.vendorBillDetailsViewModel.proNumber() + 'lastReloadDateTime')) {
                var localDateTimeOfReload = LocalStorageController.Get(self.vendorBillDetailsViewModel.vendorBillId() + 'lastReloadDateTime');
                self.currentDateTime(localDateTimeOfReload);
            } else {
                var onlyDate = self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy');
                var date = new Date();
                var str = 'Last Refreshed: ' + onlyDate + ' ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                LocalStorageController.Set(self.vendorBillDetailsViewModel.vendorBillId() + 'lastReloadDateTime', str);

                //var reloadDate = LocalStorageController.Get(self.vendorBillDetailsViewModel.proNumber() + 'lastReloadDateTime');
                self.currentDateTime(str);
            }
        };

        // ###START: US20884
        VendorBillEditDetailsViewModel.prototype.validateLostBillCostWithRevenueOfOrder = function () {
            var self = this;
            var sumOfLostBillCost = $.grep(self.vendorBillItemViewModel.vendorBillItemsList(), function (e) {
                return e.cost() && e.cost() !== null && e.cost() && e.cost() !== null;
            });

            if (sumOfLostBillCost && sumOfLostBillCost.length > 0) {
                var totalLostBillAmount = 0;

                // get total dispute amount
                sumOfLostBillCost.forEach(function (item) {
                    totalLostBillAmount = totalLostBillAmount + parseFloat(item.cost().toString());
                    return totalLostBillAmount;
                });
            }

            if ((totalLostBillAmount.toFixedDecimal(2) > self.vendorBillDetailsViewModel.totalRevenue())) {
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 15,
                        fadeOut: 15,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.LostBillCostValidation, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
                return false;
            }

            return true;
        };

        // ###END: US20884
        // Gets the vendor bill details
        VendorBillEditDetailsViewModel.prototype.getVendorBillDetails = function () {
            var self = this;

            var vendorBillDetails = new _refVendorBillModel.Models.VendorBill();

            // For new vendor bill id should be 0 and the bill status will be pending (0)
            vendorBillDetails.BillStatus = self.isDisputeWonLostButtonClicked ? self.billStatusOfDisputeWonLostButtonClicked : self.vendorBillDetailsViewModel.selectedbillStatus();
            vendorBillDetails.VendorBillId = self.vendorBillDetailsViewModel.vendorBillId();
            vendorBillDetails.CarrierId = self.vendorBillDetailsViewModel.carrierId();
            vendorBillDetails.Amount = parseFloat(self.vendorBillDetailsViewModel.vendorAmount());
            vendorBillDetails.BillDate = self.vendorBillDetailsViewModel.billDate();
            vendorBillDetails.BolNumber = self.vendorBillDetailsViewModel.bolNumber();
            vendorBillDetails.DeliveryDate = self.vendorBillDetailsViewModel.deliveryDate();
            vendorBillDetails.DestinationZip = self.vendorBillDetailsViewModel.destinationZip();
            vendorBillDetails.MainVendorBolNumber = self.vendorBillDetailsViewModel.mainBolNumber();
            vendorBillDetails.ProNumber = self.vendorBillDetailsViewModel.proNumber();
            vendorBillDetails.SalesOrderId = self.vendorBillDetailsViewModel.salesOrderId;
            vendorBillDetails.IsPurchaseOrder = self.isPoWithBol;
            vendorBillDetails.UpdatePRONumberInShipment = self.isUpdateProNo;
            vendorBillDetails.ProcessDetails = self.vendorAddressViewModel.processDetails();
            vendorBillDetails.OriginalBOLNumber = self.vendorBillDetailsViewModel.originalBolNumber;
            vendorBillDetails.Memo = self.vendorBillDetailsViewModel.memo();

            // ###START: US23124
            vendorBillDetails.MemoPreValue = self.vendorBillDetailsViewModel.MemoexistingValue();

            // ###END: US23124
            vendorBillDetails.MasClearanceStatus = self.vendorBillDetailsViewModel.selectedMasClearingStatus();

            //##START: US21146
            vendorBillDetails.MasTransferDate = self.vendorBillDetailsViewModel.moveToMasDate();

            //##END: US21146
            vendorBillDetails.PickupDate = self.vendorBillDetailsViewModel.pickupDate();
            vendorBillDetails.DueDate = self.vendorBillDetailsViewModel.dueDate();

            // ###START: US20884
            vendorBillDetails.IsLostBill = self.isLostBill();

            // ###END: US20884
            vendorBillDetails.ProcessFlow = self.vendorBillDetailsViewModel.processFlow;
            var selecetedList = self.vendorBillDetailsViewModel.obcvendorBillOptionList.getSelectedOptions(true);

            selecetedList.forEach(function (item) {
                if (item.id === refEnums.Enums.vendorBillOptionConstant.FroceAttach) {
                    self.isForceAttachOptionSelecteed = true;
                } else if (item.id === refEnums.Enums.vendorBillOptionConstant.HoldVendorBill) {
                    self.isHoldvendorBillSelecetedSelecteed = true;
                } else if (item.id === refEnums.Enums.vendorBillOptionConstant.Quickpay) {
                    self.isQuickPaySelecteed = true;
                } else if (item.id === refEnums.Enums.vendorBillOptionConstant.MakeInactive) {
                    self.isMakeInactiveSelecteed = true;
                }
            });

            if (self.vendorBillDetailsViewModel.obcvendorBillOptionList.getOptionsById(4).selected()) {
                self.isHoldvendorBillSelecetedSelecteed = true;
            } else {
                self.isHoldvendorBillSelecetedSelecteed = false;
            }

            // ###END: DE24131
            vendorBillDetails.ForceAttach = self.isForceAttachOptionSelecteed || self.canForceAttach;
            vendorBillDetails.HoldVendorBill = self.isHoldvendorBillSelecetedSelecteed;
            vendorBillDetails.QuickPay = self.isQuickPaySelecteed;
            vendorBillDetails.MakeInactive = self.isMakeInactiveSelecteed;
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

            // ###START: DE23503
            vendorBillDetails.DisputedAmount = (self.lateDisputeAmount > 0) ? self.disputeAmount : parseFloat(self.vendorBillDetailsViewModel.disputedAmount());

            // ###END: DE23503
            vendorBillDetails.DisputedDate = self.vendorBillDetailsViewModel.disputedDate();
            vendorBillDetails.CreatedDate = self.vendorBillDetailsViewModel.createdDate();

            // ###START: US20585
            vendorBillDetails.DisputeStatusId = self.vendorBillDetailsViewModel.disputeStatusId();

            // ###END: US20585
            // ###START: DE24596
            vendorBillDetails.OriginalBOLNumber = self.vendorBillDetailsViewModel.originalBolNumber;

            // ###END: DE24596
            return vendorBillDetails;
        };

        // Gets the vendor bill address details
        VendorBillEditDetailsViewModel.prototype.getVendorBillAddress = function () {
            var self = this;

            var addresses;
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
            vendorShipperAddress.State = self.vendorAddressViewModel.shipperLocation.location().StateCode;
            vendorShipperAddress.ZipCode = self.vendorAddressViewModel.shipperLocation.location().Zip;
            vendorShipperAddress.Phone = self.vendorAddressViewModel.shipperPhone();
            vendorShipperAddress.Fax = self.vendorAddressViewModel.shipperFax();
            vendorShipperAddress.Country = self.vendorAddressViewModel.isInternationalShipmentSelected() ? self.vendorAddressViewModel.selectedShipperCountryCode() : $.number(self.vendorAddressViewModel.shipperLocation.location().CountryCode);
            vendorShipperAddress.AddressType = 1;

            // Create consignee address model
            vendorConsigneeAddress.Id = self.vendorAddressViewModel.consigneeAddressId();
            vendorConsigneeAddress.VendorBillId = self.vendorBillDetailsViewModel.vendorBillId();
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
            vendorBillToAddress.Id = self.vendorAddressViewModel.billToAddressId();
            vendorBillToAddress.VendorBillId = self.vendorBillDetailsViewModel.vendorBillId();
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
        };

        // Gets the vendor bill Item details
        VendorBillEditDetailsViewModel.prototype.getVendorBillItemsDetails = function () {
            var self = this;

            var vendorBillItems;
            vendorBillItems = ko.observableArray([])();

            self.vendorBillItemViewModel.vendorBillItemsList().forEach(function (item, collection) {
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
                if (item.disputeLostAmount() !== null && item.disputeLostAmount() !== "") {
                    vendorBillItem.DisputeLostAmount = item.disputeLostAmount();
                } else {
                    vendorBillItem.DisputeLostAmount = 0;
                }

                vendorBillItems.push(vendorBillItem);
            });

            return vendorBillItems;
        };

        // Gets the vendor bill notes details
        VendorBillEditDetailsViewModel.prototype.getVendorBillNotes = function () {
            var self = this, commonUtils = new Utils.Common(), vendorBillNotes, notesDescription, itemNew;
            vendorBillNotes = ko.observableArray([])();

            if (self.vendorBillDetailsViewModel.orginalMasClearingStatus() != self.vendorBillDetailsViewModel.selectedMasClearingStatus()) {
                var note = "Mas move status is modified from " + commonUtils.getEnumValueById(refEnums.Enums.MasClearanceStatus, self.vendorBillDetailsViewModel.orginalMasClearingStatus().toString()) + " to " + commonUtils.getEnumValueById(refEnums.Enums.MasClearanceStatus, self.vendorBillDetailsViewModel.selectedMasClearingStatus().toString()) + " by " + self.currentUser().FullName;
                itemNew = new _refVendorBillNotes.vendorBillNoteItem(0, self.vendorBillDetailsViewModel.vendorBillId(), note, self.currentUser().FullName, Date.now(), "General", refEnums.Enums.Note.General.ID);
                vendorBillNotes.push(self.addNoteItem(itemNew));
            }
            self.vendorBillNotesViewModel.vendorBillNoteItems().forEach(function (item) {
                vendorBillNotes.push(self.addNoteItem(item));
            });

            if (commonUtils.isNullOrEmptyOrWhiteSpaces(self.vendorBillDetailsViewModel.disputeNotes())) {
                var disputeNotes = $.grep(self.originalVendorBillContainer.VendorBillNotes, function (e) {
                    return e.NotesType === 4;
                });

                if (disputeNotes && disputeNotes.length > 0) {
                    itemNew = new _refVendorBillNotes.vendorBillNoteItem(disputeNotes[0].Id, self.vendorBillDetailsViewModel.vendorBillId(), self.vendorBillDetailsViewModel.disputeNotes(), disputeNotes[0].NotesBy, disputeNotes[0].NotesDate, disputeNotes[0].NoteTypeName, disputeNotes[0].NotesType);
                } else {
                    itemNew = new _refVendorBillNotes.vendorBillNoteItem(0, self.vendorBillDetailsViewModel.vendorBillId(), self.vendorBillDetailsViewModel.disputeNotes(), self.currentUser().FullName, Date.now(), "Dispute", refEnums.Enums.Note.Dispute.ID);
                }

                vendorBillNotes.push(self.addNoteItem(itemNew));
            }

            if (self.vendorBillDetailsViewModel.originalBillStatus !== self.vendorBillDetailsViewModel.selectedbillStatus()) {
                notesDescription = "Vendor Bill Status Change: " + commonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, self.vendorBillDetailsViewModel.originalBillStatus.toString()) + " - " + commonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, self.vendorBillDetailsViewModel.selectedbillStatus().toString());
                itemNew = new _refVendorBillNotes.vendorBillNoteItem(0, self.vendorBillDetailsViewModel.vendorBillId(), notesDescription, self.currentUser().FullName, Date.now(), "System", refEnums.Enums.Note.System.ID);
                vendorBillNotes.push(self.addNoteItem(itemNew));
            }

            if (self.isDisputeWonLostButtonClicked) {
                notesDescription = "User " + self.currentUser().FullName + " Changed Bill from " + commonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, self.vendorBillDetailsViewModel.selectedbillStatus().toString()) + " to " + commonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, self.billStatusOfDisputeWonLostButtonClicked.toString());
                itemNew = new _refVendorBillNotes.vendorBillNoteItem(0, self.vendorBillDetailsViewModel.vendorBillId(), notesDescription, self.currentUser().FullName, Date.now(), "System", refEnums.Enums.Note.System.ID);
                vendorBillNotes.push(self.addNoteItem(itemNew));
            }

            if (self.vendorBillDetailsViewModel.memo() != null && self.vendorBillDetailsViewModel.MemoexistingValue() != null) {
                if (self.vendorBillDetailsViewModel.memo().trim() != self.vendorBillDetailsViewModel.MemoexistingValue().trim()) {
                    notesDescription = self.vendorBillDetailsViewModel.memo().trim();

                    if (commonUtils.isNullOrEmptyOrWhiteSpaces(notesDescription)) {
                        itemNew = new _refVendorBillNotes.vendorBillNoteItem(0, self.vendorBillDetailsViewModel.vendorBillId(), notesDescription, self.currentUser().FullName, Date.now(), "General", refEnums.Enums.Note.General.ID);
                        vendorBillNotes.push(self.addNoteItem(itemNew));
                    }
                    // ###END: DE23449
                }
            }

            // ###END: US23124
            return vendorBillNotes;
        };

        // function to use get item note model
        VendorBillEditDetailsViewModel.prototype.addNoteItem = function (item) {
            var itemNote = new _refVendorBillNotesModel.Models.VendorBillNote();

            // For the entity ID will be filled by server
            itemNote.Id = item.id();
            itemNote.EntityId = item.entityId();
            itemNote.NotesBy = item.noteBy();
            itemNote.NotesDate = new Date(item.noteDate());
            itemNote.NotesDescription = item.description();
            itemNote.NoteTypeName = item.noteType();
            itemNote.NotesType = item.noteTypeValue();

            return itemNote;
        };

        /*
        ** <createDetails>
        ** <id>US25310</id> <by>Shreesha Adiga</by> <date>24-10-2016</date> <description>Method to show the Credit Request popup</description>
        ** </createDetails>
        ** <changeHistory>
        ** <id>US26559</id> <by>Vasanthakumar</by> <date>02-02-2017</date> <description>Pass the invoiced SO list to credit memo popup</description>
        ** <id>US26575</id> <by>Baldev Singh Thakur</by> <date>03-02-2017</date> <description>Added condition to display BS Cost and appropriate fields if the order attached to the bill is Billing Station.</description>
        ** </changeHistory>
        */
        VendorBillEditDetailsViewModel.prototype.showRequestCreditPopup = function (data) {
            var self = this;

            var onSaveCallback = function () {
            };

            var creditmemoPopupData = {
                // ###START: US26575
                currentFinalRevenue: data.IsBsCustomer ? data.TotalPLCCost : data.TotalRevenue,
                // ###END: US26575
                currentFinalCost: data.ActualCost,
                creditReasons: self.creditReasonOptions,
                selectedCreditReason: refEnums.Enums.CreditReason.DisputeWon.ID,
                shipmentId: parseInt(self.bolNumberForCreditRequest),
                totalPendingCreditAmount: self.totalPendingCreditAmount,
                vendorCreditAmount: $.number(self.totalDisputeAmountOnDisputeWon, 2),
                salesOrderList: self.invoicedSOExceptCMSubSo,
                selectedBolNumber: self.bolNumberForCreditRequest,
                // ###START: US26575
                isBSCustomer: data.IsBsCustomer
            };

            // object to be passed to the popup
            var optionControlArgs = {
                options: undefined,
                message: '',
                title: 'Confirmation',
                bindingObject: {
                    creditmemoPopupData: creditmemoPopupData,
                    saveCallback: onSaveCallback
                }
            };

            _app.showDialog('salesOrder/SalesOrderRequestCreditPopup', optionControlArgs);
        };

        // ##START: US25310
        // load all the details needed to show credit request popup in separate properties
        VendorBillEditDetailsViewModel.prototype.preloadCreditRequestDetails = function () {
            var self = this;

            self.salesOrderClient.getCreditReasonCodes(function (data) {
                if (data) {
                    self.creditReasonOptions.removeAll();
                    self.creditReasonOptions = data;
                }
            });

            self.salesOrderClient.getTotalPendingCreditMemo(self.vendorBillDetailsViewModel.salesOrderId, function (data) {
                if (data) {
                    self.totalPendingCreditAmount = data.TotalPendingCreditAmount;

                    // ###START: US25679
                    self.totalPendingVendorAmount = data.TotalPendingVendorAmount;
                    // ###END: US25679
                }
            });

            self.totalDisputeAmountOnDisputeWon = self.vendorBillItemViewModel.vbTotalDisputeAmount();
            self.bolNumberForCreditRequest = self.vendorBillDetailsViewModel.bolNumber();
        };

        // ##END: US25310
        //#endregion Internal Methods
        //#region Validation
        //To Validated Vendor Bill
        VendorBillEditDetailsViewModel.prototype.validateVendorBill = function () {
            var self = this;
            var commonUtils = new Utils.Common();

            if (commonUtils.isNullOrEmptyOrWhiteSpaces(self.vendorBillDetailsViewModel.bolNumber())) {
                if (self.vendorBillDetailsViewModel.bolNumber().indexOf(' ') > 0) {
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.SubOrderBOL, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                    }
                    return false;
                }
            }

            if (parseFloat(self.vendorBillDetailsViewModel.vendorAmount()) < 0) {
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.BillAmountShouldNotbeNegative, "info", null, toastrOptions);

                return false;
            }

            if (self.vendorBillDetailsViewModel.listCheck != null && self.vendorBillDetailsViewModel.listCheck()[0] === true) {
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var toastrOptions1 = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PROAlreadyExists, "info", self.checkMsgClick, toastrOptions1, self.checkMsgHide);

                    return false;
                }
            }

            self.checkForceAttachOptions();

            return true;
        };

        // Shows the message box as pr the given title and message
        VendorBillEditDetailsViewModel.prototype.showConfirmationMessage = function (message, title, fisrtButtoName, secondButtonName, yesCallBack, noCallBack) {
            var self = this;

            var varMsgBox = [
                {
                    id: 0,
                    name: fisrtButtoName,
                    callback: function () {
                        return yesCallBack();
                    }
                },
                {
                    id: 1,
                    name: secondButtonName,
                    callback: function () {
                        return noCallBack();
                    }
                }
            ];

            ////initialize message box control arguments
            var optionControlArgs = {
                options: varMsgBox,
                message: message,
                title: title
            };

            //Call the dialog Box functionality to open a Popup
            _app.showDialog('templates/messageBox', optionControlArgs, 'slideDown');
        };

        // When we are making the bill cleared then we have to check the difference of SO cost and VB Cost
        // If VB Cost-SO Cost > 9 then we have to show an message that bill is clears with $(cost difference) Do you want to continue?
        // If yes then save as usual
        // If no then he can adjust cost before saving
        VendorBillEditDetailsViewModel.prototype.isNegativeMargin = function () {
            var self = this;

            if ((self.vendorBillDetailsViewModel.selectedbillStatus() === refEnums.Enums.VendorBillStatus.Cleared.ID || self.vendorBillDetailsViewModel.selectedbillStatus() === refEnums.Enums.VendorBillStatus.ShortPaid.ID) && !self.isPresentInMasPermanent) {
                var surPlusVendorBillAmount = 0, totalVendorBillCost = 0, costDifference = 0, actualProfit = 0, totalProfit = 0, grossProfit = 0, amountDiffrenceToShowOnValidationMessage = 0;

                surPlusVendorBillAmount = parseFloat(self.vendorBillDetailsViewModel.vendorAmount().replace(/,/g, "")) - parseFloat(self.vendorBillDetailsViewModel.originalVendorAmount.toString().replace(/,/g, ""));
                totalVendorBillCost = parseFloat(self.vendorBillDetailsViewModel.actualCost().toString().replace(/,/g, "")) + surPlusVendorBillAmount;
                var totalCalculatedRevenue = parseFloat(self.vendorBillDetailsViewModel.totalRevenue().toString().replace(/,/g, ""));
                var totalEstimateCost = parseFloat(self.vendorBillDetailsViewModel.totalCost().toString().replace(/,/g, ""));
                actualProfit = totalCalculatedRevenue - totalVendorBillCost;
                totalProfit = parseFloat(self.vendorBillDetailsViewModel.actualProfit().toString().replace(/,/g, "")) - surPlusVendorBillAmount;
                grossProfit = totalCalculatedRevenue - totalEstimateCost;
                costDifference = totalVendorBillCost - parseFloat(self.vendorBillDetailsViewModel.totalCost().toString().replace(/,/g, ""));
                amountDiffrenceToShowOnValidationMessage = grossProfit - actualProfit;
                self.msgAmountDiffrenceToShowOnValidationMessage = amountDiffrenceToShowOnValidationMessage;
                if (costDifference > 9) {
                    var message = ApplicationMessages.Messages.NegativeMarginValidation_1 + amountDiffrenceToShowOnValidationMessage.toFixed(2) + '. ' + ApplicationMessages.Messages.NegativeMarginValidation_2 + totalProfit.toFixed(2) + '. ' + ApplicationMessages.Messages.NegativeMarginValidation_3;
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var actionButtons = [];
                        actionButtons.push({
                            actionButtonName: "Yes",
                            actionClick: self.callisNegativeMarginYes
                        });

                        actionButtons.push({
                            actionButtonName: "No",
                            actionClick: self.callisNegativeMarginNo
                        });

                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 0,
                            fadeOut: 0,
                            typeOfAlert: "",
                            title: "",
                            actionButtons: actionButtons
                        };

                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, message, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                    }
                } else {
                    self.setUpModelAndSave();
                    return true;
                }
            } else {
                self.setUpModelAndSave();
                return true;
            }
        };

        // Check what is the original status and selected status is pending or not
        // if original status is other than pending and selected status is pending then order will convert into purchase order so show the validation message.
        VendorBillEditDetailsViewModel.prototype.checkStatusIsPendingOrNot = function () {
            var self = this, isBolNoEditable;
            if (self.vendorBillDetailsViewModel.bolNumber() !== self.vendorBillDetailsViewModel.originalBolNumber) {
                self.vendorBillDetailsViewModel.selectedbillStatus(refEnums.Enums.VendorBillStatus.Pending.ID);
                isBolNoEditable = true;
            } else {
                isBolNoEditable = false;
            }

            if (!isBolNoEditable && self.vendorBillDetailsViewModel.selectedbillStatus() === refEnums.Enums.VendorBillStatus.Pending.ID && self.vendorBillDetailsViewModel.originalBillStatus !== refEnums.Enums.VendorBillStatus.Pending.ID) {
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var actionButtons = [];
                    actionButtons.push({
                        actionButtonName: "Yes",
                        actionClick: self.callValidateVendorNotes
                    });

                    actionButtons.push({
                        actionButtonName: "No",
                        actionClick: self.checkMsgClick
                    });

                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 0,
                        fadeOut: 0,
                        typeOfAlert: "",
                        title: "",
                        actionButtons: actionButtons
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.VendorBillStatusChangedToPending, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
            } else {
                self.ValidateVendorNotes();
                return true;
            }
        };

        // Validates the PRO number
        VendorBillEditDetailsViewModel.prototype.ValidatePRONumber = function () {
            var self = this;
            var existingProNo;
            var commonUtils = new Utils.Common();

            if (commonUtils.isNullOrEmptyOrWhiteSpaces(self.vendorBillDetailsViewModel.bolNumber())) {
                if (self.vendorBillDetailsViewModel.bolNumber().trim() !== self.vendorBillDetailsViewModel.originalBolNumber) {
                    if (self.vendorBillDetailsViewModel.listCheck != null && self.vendorBillDetailsViewModel.listCheck()[1] === true && self.isPoWithBol != true && !self.vendorBillDetailsViewModel.obcvendorBillOptionList.getOptionsById(2).selected()) {
                        self.vendorBillClient.getExistingProNo(self.vendorBillDetailsViewModel.bolNumber(), function (data) {
                            existingProNo = data;
                            self.forceAttachMsg(existingProNo);
                        });
                    } else {
                        self.isNegativeMargin();
                    }
                } else {
                    self.isNegativeMargin();
                }
            } else {
                self.isNegativeMargin();
            }
        };

        // Validates the vendor notes, as if user has only written something not clicked on add
        VendorBillEditDetailsViewModel.prototype.ValidateVendorNotes = function () {
            var self = this;

            if (self.vendorBillNotesViewModel.canAdd()) {
                self.vendorBillNotesViewModel.onAdd();
                self.validateVendorBill();
            } else {
                self.validateVendorBill();
            }
        };

        // Checks the force attach options and gets the user input
        // And then calls the save service
        VendorBillEditDetailsViewModel.prototype.checkForceAttachOptions = function () {
            var self = this;
            var commonUtils = new Utils.Common();
            if (commonUtils.isNullOrEmptyOrWhiteSpaces(self.vendorBillDetailsViewModel.bolNumber())) {
                if (self.vendorBillDetailsViewModel.listCheck != null && self.vendorBillDetailsViewModel.listCheck()[1] === false) {
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var actionButtons = [];
                        actionButtons.push({
                            actionButtonName: "Yes",
                            actionClick: self.callCheckBolValidationYes
                        });
                        actionButtons.push({
                            actionButtonName: "No",
                            actionClick: self.callCheckBolValidationNo
                        });
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 0,
                            fadeOut: 0,
                            typeOfAlert: "",
                            title: "",
                            actionButtons: actionButtons
                        };

                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.BOLValidationMessage, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                    }
                } else {
                    self.ValidatePRONumber();
                }
            } else {
                self.isNegativeMargin();
            }
        };

        // If at least one item should contains the dispute lost amount.
        VendorBillEditDetailsViewModel.prototype.validateDisputeLost = function () {
            var self = this;
            var validateDispute = true;

            var disputeItems = $.grep(self.originalVendorBillContainer.VendorBillItemsDetail, function (e) {
                return e.DisputeLostAmount !== null && e.DisputeLostAmount > 0;
            });

            if (disputeItems && disputeItems.length === 0) {
                validateDispute = false;
            }

            return validateDispute;
        };

        // validate cost and dispute amount
        VendorBillEditDetailsViewModel.prototype.validateCostDisputeAmount = function () {
            var self = this, negativeCost = $.grep(self.vendorBillItemViewModel.vendorBillItemsList(), function (e) {
                return e.cost() && e.cost() < 0 && e.selectedItemTypes().ItemId !== "70";
            });

            if (negativeCost && negativeCost.length > 0) {
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 5,
                        fadeOut: 5,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.NegativeLineItemCostValidation, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
                return false;
            }

            var invalidCost = $.grep(self.vendorBillItemViewModel.vendorBillItemsList(), function (e) {
                return e.disputeAmount() && e.cost() && parseFloat(e.cost()) < parseFloat(e.disputeAmount()) && e.selectedItemTypes().ItemId !== "70" && e.selectedItemTypes().ItemId !== "10";
            }), invalidShippingServiceCost = $.grep(self.vendorBillItemViewModel.vendorBillItemsList(), function (e) {
                return e.disputeAmount() && e.cost() && e.selectedItemTypes().ItemId === "10";
            }), sumOfShippingServiceCost = $.grep(self.vendorBillItemViewModel.vendorBillItemsList(), function (e) {
                return e.disputeAmount() && e.cost() && (e.selectedItemTypes().ItemId === "10" || e.selectedItemTypes().ItemId === "70");
            });
            var totalDisputeAmount = 0, totalAmount = 0;
            if (invalidShippingServiceCost && invalidShippingServiceCost.length > 0) {
                // get total dispute amount
                invalidShippingServiceCost.forEach(function (item) {
                    totalDisputeAmount = totalDisputeAmount + parseFloat(item.disputeAmount().toString());
                    return totalDisputeAmount;
                });

                // get total actual amount
                invalidShippingServiceCost.forEach(function (item) {
                    totalAmount = totalAmount + parseFloat(item.cost().toString());
                    return totalAmount;
                });

                if (totalAmount.toFixedDecimal(2) < totalDisputeAmount.toFixedDecimal(2)) {
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var toastrOptions1 = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 5,
                            fadeOut: 5,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.InvalidCost, "info", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
                    }
                    return false;
                } else if (invalidCost && invalidCost.length > 0) {
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var toastrOptions2 = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 5,
                            fadeOut: 5,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.NegativeLineItemDisputeCostValidation, "info", self.checkMsgClick, toastrOptions2, self.checkMsgHide);
                    }
                    return false;
                }
            }

            if (sumOfShippingServiceCost && sumOfShippingServiceCost.length > 0) {
                totalAmount = 0, totalDisputeAmount = 0;

                // get total dispute amount
                sumOfShippingServiceCost.forEach(function (item) {
                    totalDisputeAmount = totalDisputeAmount + parseFloat(item.disputeAmount().toString().replace(/,/g, ""));
                    return totalDisputeAmount;
                });

                // get total actual amount
                sumOfShippingServiceCost.forEach(function (item) {
                    totalAmount = totalAmount + parseFloat(item.cost().toString().replace(/,/g, ""));
                    return totalAmount;
                });

                if (totalAmount.toFixedDecimal(2) < totalDisputeAmount.toFixedDecimal(2)) {
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var toastrOptionss = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 5,
                            fadeOut: 5,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.InvalidTotalCost, "info", self.checkMsgClick, toastrOptionss, self.checkMsgHide);
                    }
                    return false;
                }
            }

            return true;
        };

        // when status is dispute lost or dispute won validate amount
        VendorBillEditDetailsViewModel.prototype.checkStatusIsDisputeWonOrDisputeLost = function () {
            var self = this;
            if ((self.vendorBillDetailsViewModel.selectedbillStatus() === refEnums.Enums.VendorBillStatus.DisputeWon.ID || self.vendorBillDetailsViewModel.selectedbillStatus() === refEnums.Enums.VendorBillStatus.DisputeLost.ID) && !self.validateWonVsLost()) {
                return false;
            }

            if (self.vendorBillDetailsViewModel.selectedbillStatus() === refEnums.Enums.VendorBillStatus.DisputeWon.ID && self.vendorBillDetailsViewModel.originalBillStatus === refEnums.Enums.VendorBillStatus.DisputeLost.ID) {
                if (!self.originalVendorBillContainer.IsCreateLostBillVisible) {
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 5,
                            fadeOut: 5,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.CanNotChangeStatusToDisputeWonMessage, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);

                        self.vendorBillDetailsViewModel.selectedbillStatus(refEnums.Enums.VendorBillStatus.DisputeLost.ID);
                    }
                    return false;
                }
            }

            return true;
        };

        // validate dispute and lost dispute amount when status is dispute won or dispute lost
        VendorBillEditDetailsViewModel.prototype.validateWonVsLost = function () {
            var self = this, sumOfShippingServiceCost = $.grep(self.vendorBillItemViewModel.vendorBillItemsList(), function (e) {
                return e.disputeAmount() && e.disputeAmount() !== null && e.disputeLostAmount() && e.disputeLostAmount() !== null;
            });

            if (sumOfShippingServiceCost && sumOfShippingServiceCost.length > 0) {
                var totalDisputeLostAmount = 0, totalDisputeAmount = 0;

                // get total dispute amount
                sumOfShippingServiceCost.forEach(function (item) {
                    totalDisputeAmount = totalDisputeAmount + parseFloat(item.disputeAmount().toString());
                    return totalDisputeAmount;
                });

                // get total actual amount
                sumOfShippingServiceCost.forEach(function (item) {
                    totalDisputeLostAmount = totalDisputeLostAmount + parseFloat(item.disputeLostAmount().toString());
                    return totalDisputeLostAmount;
                });

                if (totalDisputeAmount.toFixedDecimal(2) < totalDisputeLostAmount.toFixedDecimal(2)) {
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 15,
                            fadeOut: 15,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.DisputeCostValidation, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                    }
                    return false;
                }

                if (totalDisputeLostAmount.toFixedDecimal(2) < 0) {
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 5,
                            fadeOut: 5,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.DisputeCostValidation, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                    }
                    return false;
                }
            }

            return true;
        };

        //#endregion
        //#region Message
        // If PRO does not matches in the order the ask for force attach,
        VendorBillEditDetailsViewModel.prototype.forceAttachMsg = function (existingProNo) {
            var self = this;
            self.MsgexistingProNo = existingProNo;
            if (self.checkMsgDisplay) {
                self.checkMsgDisplay = false;
                var actionButtons = [];
                actionButtons.push({
                    actionButtonName: "Yes",
                    actionClick: self.callForceAttchYes
                });
                actionButtons.push({
                    actionButtonName: "No",
                    actionClick: self.callForceAttchNo
                });
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 0,
                    fadeOut: 0,
                    typeOfAlert: "",
                    title: "",
                    actionButtons: actionButtons
                };

                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.PROValidationMessage, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
            }
        };

        // If PRO does not matches then ask to user weather he wants to update that PRO in order or not
        VendorBillEditDetailsViewModel.prototype.matchingSalesMsg = function (existingProNo) {
            var self = this;
            if (self.checkMsgDisplay) {
                self.checkMsgDisplay = false;
                var actionButtons = [];
                actionButtons.push({
                    actionButtonName: "Yes",
                    actionClick: self.callMatchingsalesYes
                });
                actionButtons.push({
                    actionButtonName: "No",
                    actionClick: self.callMatchingsalesNo
                });
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 0,
                    fadeOut: 0,
                    typeOfAlert: "",
                    title: "",
                    actionButtons: actionButtons
                };

                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.ForceAttachInputeMessage + existingProNo.toString() + "\n to match the Vendor Bills PRO# :" + self.vendorBillDetailsViewModel.proNumber(), "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
            }
        };

        //#endregion
        //#region Click Handler
        // Handles the click event of the Address accordion
        VendorBillEditDetailsViewModel.prototype.onAddressClick = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#address').addClass('active in');
            $('#addressLink').addClass('active');

            self.addressOverflowManage();

            $("#shipperCompanyName").focus();
        };

        // Sets the notes section focus
        VendorBillEditDetailsViewModel.prototype.onNotesClick = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#notes').addClass('active in');
            $('#notesLink').addClass('active in');

            $("#txtuserNote").focus();

            //on click we are calling this flag to show grid column resizebal as per browser window
            self.vendorBillNotesViewModel.reportContainer.isAttachedToView(false);
            self.vendorBillNotesViewModel.reportContainer.isAttachedToView(true);
        };

        // Handles the Item accordion click
        VendorBillEditDetailsViewModel.prototype.onItemClick = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#item').addClass('active in');
            $('#itemLink').addClass('active');

            $("#addItemButton").focus();
        };

        // Handles the VendorBill accordion click
        VendorBillEditDetailsViewModel.prototype.onVendorBillClick = function () {
            $("#shipperCityStateZip").focus();
        };

        //## function to expand the view by ID, if any case we required
        VendorBillEditDetailsViewModel.prototype.expandView = function (viewId) {
            if (!$('#' + viewId).hasClass('in')) {
                $('#' + viewId).addClass('in');
                $('#' + viewId).css("height", 'auto');
                $('#Achor' + viewId).removeClass('collapsed');
            }
        };

        //## function to collapse the items view by ID, if any case we required
        VendorBillEditDetailsViewModel.prototype.collapseView = function (viewId) {
            $('#' + viewId).removeClass('in');
            $('#' + viewId).css("height", '0');
            $('#Achor' + viewId).addClass('collapsed');
            $('#collapseAddress').css("overflow", "hidden");
        };

        // click handler on open create sub bill
        VendorBillEditDetailsViewModel.prototype.onCreateSubBill = function () {
            var self = this, vendorBillId = self.vendorBillDetailsViewModel.vendorBillId(), proNumber = self.findProNumber();
            self.clearLocalStorage(self.vendorBillDetailsViewModel.vendorBillId() + '_' + self.vendorBillDetailsViewModel.proNumber());
            _app.trigger("openVendorBill", vendorBillId, proNumber, function (callback) {
                if (!callback) {
                    return;
                }
            }, true);
        };

        // click handler on create lost bill
        VendorBillEditDetailsViewModel.prototype.onCreateLostBill = function () {
            var self = this;
            if (self.validateDisputeLost()) {
                var disputeItems = $.grep(self.originalVendorBillContainer.VendorBillItemsDetail, function (e) {
                    return e.DisputeLostAmount !== null && e.DisputeLostAmount > 0;
                });
                var vbTotalDisputeLostAmount = 0;
                disputeItems.forEach(function (item) {
                    vbTotalDisputeLostAmount = vbTotalDisputeLostAmount + parseFloat(item.DisputeLostAmount.toString());
                    return vbTotalDisputeLostAmount;
                });

                var message = ApplicationMessages.Messages.LostAmountValidation_1 + "$" + vbTotalDisputeLostAmount.toFixed(2).toString() + ApplicationMessages.Messages.LostAmountValidation_2;
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;

                    var actionButtons = [];
                    actionButtons.push({
                        actionButtonName: "Yes",
                        actionClick: self.callCheckSubOrderCreate
                    });
                    actionButtons.push({
                        actionButtonName: "No",
                        actionClick: self.checkMsgHide
                    });
                    var toastrOptions1 = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 0,
                        fadeOut: 0,
                        typeOfAlert: "",
                        title: "",
                        actionButtons: actionButtons
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, message, "warning", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
                }
            } else {
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 5,
                        fadeOut: 5,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.NoDisputeLostAmountValidation, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
                return;
            }
        };

        // click handler on dispute won bill
        VendorBillEditDetailsViewModel.prototype.onDisputeWon = function () {
            var self = this;
            self.isDisputeWonLostButtonClicked = true;
            self.billStatusOfDisputeWonLostButtonClicked = refEnums.Enums.VendorBillStatus.DisputeWon.ID;

            // ##START: DE23601
            self.isDisputeWonClicked = true;

            //##END: DE23601
            self.onSave();
            self.isDisputeWonLostButtonClicked = false;
        };

        // click handler on dispute lost bill
        VendorBillEditDetailsViewModel.prototype.onDisputeLost = function () {
            var self = this;

            // ##START: US21132
            // success callback
            var refresh = function (refreshThePage) {
                if (typeof refreshThePage === "undefined") { refreshThePage = false; }
                self.clearLocalStorage(self.vendorBillDetailsViewModel.vendorBillId() + '_' + self.vendorBillDetailsViewModel.proNumber());

                if (refreshThePage) {
                    self.beforeBind();
                }
            };

            var cancelCallBack = function () {
                // when close is clicked on the popup, it will call this method
            };

            // object to be passed to the popup
            var optionControlArgs = {
                options: undefined,
                message: '',
                title: '',
                bindingObject: {
                    vendorBillId: self.vendorBillId(),
                    proNumber: self.vendorBillDetailsViewModel.proNumber(),
                    proNumberOfMainBill: self.vendorBillDetailsViewModel.proNumber(),
                    subBillCount: self.subOrderCount,
                    hasLostBill: self.hasLostBill,
                    saveCallback: refresh,
                    cancelCallback: cancelCallBack
                }
            };

            _app.showDialog('vendorBill/VendorBillDisputeLost', optionControlArgs);
            // ##END: US21132
        };

        // login to find next pro number
        VendorBillEditDetailsViewModel.prototype.findProNumber = function () {
            var self = this, proNumber = self.vendorBillDetailsViewModel.proNumber(), count = self.subOrderCount + 65;

            // ##START: US21132
            // isSubOrderBill is true for main bill and false for subBills and lost bills.
            // if any lost bill is created for a subbill, then remove the alphabet at the end
            //if (!self.isSubOrderBill()) {
            //	var index = proNumber.lastIndexOf(" ");
            //	if (index !== -1) {
            //		proNumber = proNumber.slice(0, index);
            //	}
            //}
            // ##END: US21132
            proNumber = proNumber + " " + String.fromCharCode(count);

            return proNumber;
        };

        VendorBillEditDetailsViewModel.prototype.loadPodDocDetails = function () {
            $('#selectDocOwner').focus();
            var self = this;

            if (self.isAccordion()) {
                if (!$('#collapsePOD').hasClass('in')) {
                    //if (!self.isNewSubOrder()) {
                    self.callPodDocDetails();
                    //}
                }
            } else {
                if (!$('#podDocLink').hasClass('in') && !$('#tab_podDoc').hasClass('in')) {
                    //if (!self.isNewSubOrder()) {
                    self.callPodDocDetails();
                    //}
                }
            }

            self.collapseAllTabs();
            $('#tab_podDoc').addClass('active in');
            $('#podDocLink').addClass('active in');

            //on click we are calling this flag to show grid column resizebal as per browser window
            self.vendorBillPODDocViewModel.reportContainer.isAttachedToView(false);
            self.vendorBillPODDocViewModel.reportContainer.isAttachedToView(true);
        };

        VendorBillEditDetailsViewModel.prototype.callPodDocDetails = function () {
            var self = this;
            var data = new Array();
            var uploadFileDetails = new refPodDocModel.Models.VendorBillUploadFileModel();
            uploadFileDetails.CarrierId = self.vendorBillDetailsViewModel.vendorNameSearchList.ID();
            if (self.vendorBillDetailsViewModel.proNumber().indexOf(' ') >= 0) {
                var str = self.vendorBillDetailsViewModel.proNumber().split(' ');
                uploadFileDetails.ProNumber = str[0];
            } else {
                uploadFileDetails.ProNumber = self.vendorBillDetailsViewModel.proNumber();
            }

            if (self.vendorBillDetailsViewModel.bolNumber() != '') {
                uploadFileDetails.BolNumber = self.vendorBillDetailsViewModel.bolNumber();
            } else if (self.vendorBillDetailsViewModel.mainBolNumber() != '') {
                uploadFileDetails.BolNumber = self.vendorBillDetailsViewModel.mainBolNumber();
            }
            uploadFileDetails.VendorBillId = self.vendorBillDetailsViewModel.vendorBillId();
            uploadFileDetails.CarrierName = self.vendorBillDetailsViewModel.vendorName();
            uploadFileDetails.OriginZip = self.OriginZip();
            uploadFileDetails.ServiceType = self.vendorBillDetailsViewModel.vendorNameSearchList.carrierType();

            //** if there is no data is registered then make a server call. */
            var successCallBack = function (data) {
                self.vendorBillPODDocViewModel.vendorBillPodDocDetail.removeAll();
                self.vendorBillPODDocViewModel.reportContainer.listProgress(true);
                self.vendorBillPODDocViewModel.initializeVendorBillPodDocDetails(data, self.vendorBillDetailsViewModel.proNumber(), self.vendorBillDetailsViewModel.vendorNameSearchList.ID(), self.vendorBillDetailsViewModel.bolNumber(), self.vendorBillDetailsViewModel.vendorBillId(), !self.isViewOnly, self.vendorBillDetailsViewModel.vendorName(), self.OriginZip());
                self.vendorBillPODDocViewModel.reportContainer.listProgress(false);
            }, faliureCallBack = function (message) {
                console.log(message);
                self.vendorBillPODDocViewModel.reportContainer.listProgress(false);
            };
            self.vendorBillPODDocViewModel.reportContainer.listProgress(false);
            self.vendorBillClient.getVendorBillPodDocDetails(uploadFileDetails, successCallBack, faliureCallBack);
        };

        VendorBillEditDetailsViewModel.prototype.onForcePushBillToMas = function () {
            var self = this;
            self.ShowProgressBar(true);
            self.clearLocalStorage(self.vendorBillDetailsViewModel.vendorBillId() + '_' + self.vendorBillDetailsViewModel.proNumber());
            var successCallBack = function (data) {
                var toastrOptions1 = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 0,
                    fadeOut: 0,
                    typeOfAlert: "",
                    title: ""
                };

                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.UpdatedSuccessfullyMessage, "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
                self.beforeBind();
            }, failureCallBack = function (message) {
                var toastrOptions1 = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 0,
                    fadeOut: 0,
                    typeOfAlert: "",
                    title: ""
                };

                self.ShowProgressBar(false);
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
            };

            self.vendorBillClient.ForcePushBillToMas(self.vendorBillDetailsViewModel.vendorBillId(), self.vendorBillDetailsViewModel.updatedDate, successCallBack, failureCallBack);
        };

        // Click event for reverting the Vendor Bill From IDB
        VendorBillEditDetailsViewModel.prototype.onRevertBill = function () {
            var self = this;
            self.ShowProgressBar(true);
            self.clearLocalStorage(self.vendorBillDetailsViewModel.vendorBillId() + '_' + self.vendorBillDetailsViewModel.proNumber());
            var successCallBack = function (data) {
                var toastrOptions1 = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 0,
                    fadeOut: 0,
                    typeOfAlert: "",
                    title: ""
                };
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.UpdatedSuccessfullyMessage, "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
                self.beforeBind();
            }, failureCallBack = function (message) {
                var toastrOptions1 = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 0,
                    fadeOut: 0,
                    typeOfAlert: "",
                    title: ""
                };
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
                self.ShowProgressBar(false);
            };
            self.vendorBillClient.RevertBillFromIdb(self.vendorBillDetailsViewModel.vendorBillId(), self.vendorBillDetailsViewModel.updatedDate, successCallBack, failureCallBack);
        };

        //#endregion
        //#region Load Data
        VendorBillEditDetailsViewModel.prototype.load = function (bindedData) {
            if (!bindedData) {
                return;
            } else if (typeof (bindedData.vendorBillId) === 'undefined') {
                return;
            }

            var self = this;

            //** if there is no data is registered then make a server call. */
            self.ShowProgressBar(true);
            var vendorBillId = bindedData.vendorBillId, isSubOrderBill = bindedData.isSubBill, isException = bindedData.isException, vbStorageKey = bindedData.vendorBillId + '_' + bindedData.proNumber, isLostBill = (typeof (bindedData.isLostBill) === 'undefined' ? false : (typeof (bindedData.isLostBill) === 'boolean' ? bindedData.isLostBill ? true : false : bindedData.isLostBill === 'false' ? false : true)), successCallBack = function (data) {
                self.originalVendorBillContainer = data;
                if (data.VendorBill.ProcessFlow === 0) {
                    self.vendorBillHeader('Vendor Bill');
                } else {
                    self.vendorBillHeader('Vendor Bill ITerm');
                }

                //var reloadDateTime = LocalStorageController.Get('lastReloadDateTime');
                //self.currentDateTime(reloadDateTime);
                self.isSaveEnable = data.IsSaveEnable;
                self.isViewOnly = data.IsReadOnly;
                self.isNotAtLoadingTime = true;
                self.subOrderCount = data.SuborderCount;

                // ##START: DE22284
                self.isNewSubBill = data.IsNewSubBill;
                self.isNewLostBill = isLostBill;

                if (isLostBill) {
                    self.isSubOrderBill(false);
                } else {
                    self.isSubOrderBill(!data.IsSubBill);
                }

                if (isLostBill) {
                    self.isLostBill(isLostBill);
                } else {
                    self.isLostBill(data.VendorBill.IsLostBill);
                }

                if (data.IsReassignmentButtonVisible) {
                    self.getVBReassignmentPopupData(data.VendorBill.BolNumber);
                } else {
                    self.isVBReassignmentVisible(false);
                }

                if (data.VendorBill.BillStatus == refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID) {
                    self.getCreditMemoInvoicedSOList(data.VendorBill.SalesOrderId);
                }

                // ###END: US20884
                self.isExceptionShowPopup(isException === 'false' ? false : true);
                self.isCreateLostBillVisible(data.IsCreateLostBillVisible);
                self.isDisputeWonLostVisible(data.IsDisputeWonLostVisible);
                self.IsClearedPermission = data.IsClearedPermission;
                self.vendorBillId(vendorBillId);
                self.vendorAddressViewModel.isSubOrderBill(data.IsSubBill);
                self.canForcePushToMasVisible(data.CanForcePushBillToMAS);
                self.isRevertBillVisible(data.IsRevertBillVisible);

                if (!data.IsNewSubBill && !isLostBill) {
                    self.vendorAddressViewModel.shouldBeReadOnly(data.VendorBill.IDBFlag);
                }

                // ###END: US24631
                //##START: US21146
                self.billStatusOnLoad = data.VendorBill.BillStatus;

                //##END: US21146
                // ##START: US21132
                self.hasLostBill = data.HasLostBill;

                // ##END: US21132
                // ###START: US21597
                self.lateDisputeAmount = data.VendorBill.LateDisputeAmount;

                // ###END: US21597
                // ###START: DE23503
                self.disputeAmount = data.VendorBill.DisputedAmount;

                if (self.isSaveEnable) {
                    //self.DisableAlltheControls();
                    self.vendorAddressViewModel.shouldBeReadOnly(self.isSaveEnable);
                } else {
                    if (data.VendorBill.BillStatus == 2) {
                        self.billStatus = data.VendorBill.BillStatus;

                        if (!self.IsClearedPermission && !isLostBill) {
                            self.isSaveEnable = true;
                            self.vendorAddressViewModel.shouldBeReadOnly(self.isSaveEnable);
                            self.DisableAlltheControls();
                        }
                    }
                }

                // load vendor bill details
                self.vendorBillDetailsViewModel.initializeVendorBillDetails(data.VendorBill, data.IsNewSubBill, data.IsDisputeAmountEditable, data.IsDisputeLostAmountEditable, data.IsDisputeSectionEditable, self.isViewOnly, data.IsSubBill, self.isSaveEnable, self.isLostBill());

                if (data.IsReadOnly === true) {
                    self.vendorBillNotesViewModel.isReadViewOnly = true;
                } else {
                    self.vendorBillNotesViewModel.isReadViewOnly = false;
                }

                // ###END: DE23159
                self.vendorBillNotesViewModel.initializeVendorBillNotes(data.VendorBillNotes, data.VendorBill.MasTransferDate, data.VendorBill.VendorBillId, data.VendorBill.BillStatus);

                if (data.VendorBillItemsDetail.length > 0) {
                    if (self.lateDisputeAmount > 0) {
                        for (var i = 0; i < data.VendorBillItemsDetail.length; i++) {
                            data.VendorBillItemsDetail[i].DisputeAmount = 0;
                        }
                        self.vendorBillItemViewModel.initializeVendorBillItemDetails(data.VendorBillItemsDetail, data.IsDisputeAmountEditable, data.IsDisputeLostAmountEditable, self.isSaveEnable, self.isLostBill());
                        self.vendorBillItemViewModel.vbTotalDisputeAmount($.number(self.lateDisputeAmount, 2));
                    } else {
                        self.vendorBillItemViewModel.initializeVendorBillItemDetails(data.VendorBillItemsDetail, data.IsDisputeAmountEditable, data.IsDisputeLostAmountEditable, self.isSaveEnable, self.isLostBill());
                    }
                    // ###END: US21597
                } else {
                    self.vendorBillItemViewModel.addDefaultItems();
                }

                self.ShowProgressBar(false);
                if (data.VendorBillExceptionRulesAndResolutions.length > 0) {
                    self.isExceptionTabAndAccordion(true);
                    if (self.isExceptionShowPopup()) {
                        var vendorbillId = { vendorBillId: self.vendorBillId() };
                        var optionControlArgs = {
                            options: undefined,
                            message: '',
                            title: 'Revenue Adjustment',
                            bindingObject: vendorbillId
                        };
                        _app.showDialog('vendorBill/VendorBillExceptionPopup', optionControlArgs);
                    }
                } else {
                    self.isExceptionTabAndAccordion(false);
                    self.isExceptionShowPopup(false);
                }

                // load address details
                var shipperAddress = $.grep(data.VendorBillAddress, function (e) {
                    return e.AddressType === refEnums.Enums.AddressType.Origin.ID;
                })[0], consigneeAddress = $.grep(data.VendorBillAddress, function (e) {
                    return e.AddressType === refEnums.Enums.AddressType.Destination.ID;
                })[0], billToAddress = $.grep(data.VendorBillAddress, function (e) {
                    return e.AddressType === refEnums.Enums.AddressType.BillTo.ID;
                })[0];

                //** flag to specify whether address fields are read only or not.? */
                //##START: DE20309
                //self.vendorAddressViewModel.isCallForEdit(!data.CanEditBillToAddress);
                //self.vendorAddressViewModel.isCallForEdit(true);
                self.vendorAddressViewModel.canEdit(true);

                //##END: DE20309
                self.vendorAddressViewModel.populateAddressByUser = false;
                self.vendorAddressViewModel.populateShipperAddress(shipperAddress);
                self.vendorAddressViewModel.populateConsigneeAddress(consigneeAddress);
                self.vendorAddressViewModel.populateBillToAddress(billToAddress);
                self.vendorAddressViewModel.processDetails(data.VendorBill.ProcessDetails);
                self.vendorAddressViewModel.populateAddressByUser = true;
                if (shipperAddress !== undefined) {
                    self.OriginZip(shipperAddress.ZipCode);
                }

                //** set vendor bill id and pro number to purchase order */
                self.vendorBillHistoryViewModel.vendorBillId = vendorBillId;
                self.vendorBillHistoryViewModel.proNumber = data.VendorBill.ProNumber;

                self.isChange(false);

                if (self.checkCompCalled) {
                    self.isNotAtLoadingTime = false;
                }

                if (self.changeTermType) {
                    self.changeTermType(data.VendorBill.ProcessFlow);
                }

                //To save date time in local storage
                self.setDateTimeOfReload();

                // ###START: DE24440
                vbStorageKey = vendorBillId + '_' + data.VendorBill.ProNumber;

                if (typeof (bindedData.proNumber) === 'undefined') {
                    vbStorageKey = vendorBillId + '_' + data.VendorBill.ProNumber;
                    var dataToRegister = { vendorBillId: vendorBillId, proNumber: data.VendorBill.ProNumber, isSubBill: 'false', isException: 'false' };
                    _app.trigger("registerMyData", dataToRegister);
                }

                if (data.IsReadOnly === true) {
                    self.DisableAlltheControls();
                }

                // ###END: DE23159
                // ###START: US20305
                self.vendorBillNotesViewModel.vbStorageKey = vbStorageKey;

                // ###END: US20305
                // Store in the local variable to get the data again from that variable do not need to get the data from the database
                LocalStorageController.Set(vbStorageKey + 'VB', data);

                _app.trigger("IsBIDirtyChange", self.isChange(false));

                if (isLostBill) {
                    self.isChange(true);
                }

                if (self.vendorBillDetailsViewModel.moveToMasDate() != null && self.vendorBillDetailsViewModel.moveToMasDate() != "" && !data.IsSubBill) {
                    self.vendorAddressViewModel.isBillStatusCleared(false);
                } else if (!self.IsClearedPermission && data.VendorBill.BillStatus == 2) {
                    self.vendorAddressViewModel.isBillStatusCleared(false);
                } else {
                    self.vendorAddressViewModel.isBillStatusCleared(true);
                }

                // ###END: DE24352
                // ###END: DE24166
                self.ShowProgressBar(false);
            }, faliureCallBack = function (message) {
                console.log(message);
                self.ShowProgressBar(false);
                _app.trigger("IsBIDirtyChange", false);
            };

            if (!LocalStorageController.Get(vbStorageKey + 'VB')) {
                if (!isLostBill) {
                    self.vendorBillClient.getVendorBillDetailsByVendorBillId(vendorBillId, successCallBack, faliureCallBack, isSubOrderBill);
                } else {
                    self.vendorBillClient.getVendorBillDetailsForLostBill(vendorBillId, successCallBack, faliureCallBack);
                }
            } else {
                successCallBack(LocalStorageController.Get(vbStorageKey + 'VB'));
                self.ShowProgressBar(false);
            }

            self.getVendorBillFinancialDetails(vendorBillId, bindedData.proNumber, vbStorageKey);
        };

        // To load financial details
        VendorBillEditDetailsViewModel.prototype.getVendorBillFinancialDetails = function (vendorBillId, targetProNumber, storageKey) {
            var self = this;
            var successCallBack = function (data) {
                if (data) {
                    self.vendorBillDetailsViewModel.initializeVendorBillFinancialDetails(data);

                    // ###START: US26955
                    self.actualBillCost(data.ActualCost);

                    // ###END: US26955
                    LocalStorageController.Set(storageKey + 'VBFinancialDetails', data);

                    if (self.showCreditRequestAfterSave) {
                        self.showCreditRequestAfterSave = false;
                        self.showRequestCreditPopup(data);
                    }
                    // ##END: US25310
                }
            }, failureCallBack = function (message) {
            };
            if (!LocalStorageController.Get(storageKey + 'VBFinancialDetails')) {
                self.vendorBillClient.getVendorBillFinancialDetailsByVendorBillId(vendorBillId, successCallBack, failureCallBack);
            } else {
                successCallBack(LocalStorageController.Get(storageKey + 'VBFinancialDetails'));
            }
        };

        //To load Shipment Details
        VendorBillEditDetailsViewModel.prototype.getShipmentLinks = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#links').addClass('active in');
            $('#linksLink').addClass('active in');

            if (!$('#collapseLinks').hasClass('in')) {
                self.vendorBillLinksViewModel.listProgress(true);
                self.listProgressLinks(true);
                self.listProgressLinksTabbed(true);
                var successCallBack = function (data) {
                    var commonUtils = new Utils.Common();

                    // load Links details
                    self.vendorBillLinksViewModel.initializeLinksDetails(data, self.vendorBillDetailsViewModel.vendorBillId());
                    self.vendorBillLinksViewModel.listProgress(false);
                    self.listProgressLinks(false);
                    self.listProgressLinksTabbed(false);
                }, faliureCallBack = function () {
                    self.vendorBillLinksViewModel.listProgress(false);
                    self.listProgressLinks(false);
                    self.listProgressLinksTabbed(false);
                };
                self.vendorBillClient.getShipmentRelatedLinks(self.vendorBillDetailsViewModel.bolNumber(), self.vendorBillDetailsViewModel.vendorBillId(), successCallBack, faliureCallBack);
            }
        };

        //To load Payment Details
        VendorBillEditDetailsViewModel.prototype.getPaymentDetails = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#payment').addClass('active in');
            $('#paymentLink').addClass('active in');

            if (!$('#collapsePaymentDetails').hasClass('in')) {
                if (self.vendorBillDetailsViewModel.moveToMasDate()) {
                    self.listProgressPayment(true);
                    var successCallBack = function (data) {
                        var commonUtils = new Utils.Common();

                        // To load payment Details
                        self.vendorBillPaymentDetailsViewModel.initializePaymentDetails(data);
                        self.listProgressPayment(false);
                    }, faliureCallBack = function () {
                        self.listProgressPayment(false);
                    };
                    self.vendorBillClient.getShipmentPaymentDetails("vendorBill", self.vendorBillDetailsViewModel.vendorBillId(), successCallBack, faliureCallBack);
                }
            }

            //on click we are calling this flag to show grid column resizebal as per browser window
            self.vendorBillPaymentDetailsViewModel.reportContainer.isAttachedToView(false);
            self.vendorBillPaymentDetailsViewModel.reportContainer.isAttachedToView(true);
        };

        //To Load History details
        VendorBillEditDetailsViewModel.prototype.getHistorydetails = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#history').addClass('active in');
            $('#historyLink').addClass('active in');

            self.vendorBillHistoryViewModel.historyNewValueContainer.listProgress(true);
            if (!$('#collapseHistory').hasClass('in')) {
                var successCallBack = function (data) {
                    var commonUtils = new Utils.Common();

                    // To load History Details
                    self.vendorBillHistoryViewModel.initializeHistoryDetails(data, data.VendorBillId, true);

                    self.vendorBillHistoryViewModel.historyNewValueContainer.listProgress(false);
                }, faliureCallBack = function () {
                    self.vendorBillHistoryViewModel.historyNewValueContainer.listProgress(false);
                };
                self.vendorBillClient.GetVendorBillHistoryByVendorBillId(self.vendorBillDetailsViewModel.vendorBillId(), successCallBack, faliureCallBack);
            }
        };

        //To load Exception Rule and description
        VendorBillEditDetailsViewModel.prototype.getVendorBillExceptionRulesAndResolution = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#exception').addClass('active in');
            $('#exceptionLink').addClass('active in');

            if (!$('#collapseException').hasClass('in')) {
                self.listProgressException(true);
                var successCallBack = function (data) {
                    var commonUtils = new Utils.Common();
                    self.isExceptionTabAndAccordion(true);
                    self.isExceptionShowPopup(true);
                    self.VendorBillException.selectedBillStatus(self.vendorBillDetailsViewModel.selectedbillStatus());

                    // To load History Details
                    self.VendorBillException.initializeExeptionruleAndResolution(data);

                    self.listProgressException(false);
                }, faliureCallBack = function () {
                    self.listProgressException(false);
                };
                self.vendorBillClient.GetVendorBillExceptionRulesAndResolution(self.vendorBillDetailsViewModel.vendorBillId(), successCallBack, faliureCallBack);
            }
        };

        // To load Vendor bill dispute details
        VendorBillEditDetailsViewModel.prototype.getVendorBillDisputeItemDetails = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#dispute').addClass('active in');
            $('#disputeLink').addClass('active in');

            self.GetDisputeDetails(self.vendorBillDetailsViewModel.selectedbillStatus());
        };

        VendorBillEditDetailsViewModel.prototype.GetDisputeDetails = function (newSelectedbillStatus) {
            var self = this;
            if (self.vendorBillDetailsViewModel.vendorBillId() !== 0) {
                if (!$('#collapseDispute').hasClass('in')) {
                    self.listProgressDispute(true);
                    self.listProgressDisputeTabbed(true);
                    var successCallBack = function (data) {
                        self.VendorBillDispute.initializeDisputeItem(data, self.vendorBillDetailsViewModel.vendorBillId(), self.isViewOnly, self.isSaveEnable);
                        self.listProgressDispute(false);
                        self.listProgressDisputeTabbed(false);

                        if (newSelectedbillStatus) {
                            self.ActiveDisputeTab(newSelectedbillStatus);
                        }
                    }, failureCallBack = function (errorMessage) {
                        self.listProgressDispute(false);
                        self.listProgressDisputeTabbed(false);
                    };
                    self.vendorBillClient.getVendorBillDisputeDetails(self.vendorBillDetailsViewModel.vendorBillId(), self.vendorBillDetailsViewModel.bolNumber(), successCallBack, failureCallBack);
                } else {
                    if (newSelectedbillStatus) {
                        self.ActiveDisputeTab(newSelectedbillStatus);
                    }
                }
            }
        };

        // change dispute tab on changinf of bill status in header
        VendorBillEditDetailsViewModel.prototype.ActiveDisputeTab = function (newSelectedbillStatus) {
            var self = this;
            if (newSelectedbillStatus !== undefined && newSelectedbillStatus !== null) {
                self.VendorBillDispute.billstatuId(newSelectedbillStatus);
                if (newSelectedbillStatus === refEnums.Enums.VendorBillStatus.Dispute.ID) {
                    self.VendorBillDispute.isBillStatusDispute(true);
                } else {
                    self.VendorBillDispute.isBillStatusDispute(false);
                }
                if (!self.isViewOnly) {
                    if (newSelectedbillStatus === refEnums.Enums.VendorBillStatus.Dispute.ID) {
                        self.collapseAllTabs();
                        $('#disputeLink').addClass('active');
                        $('#dispute').addClass('active in');
                    }
                }
            }
        };

        // Open Popup
        VendorBillEditDetailsViewModel.prototype.onVBReassignmentClick = function () {
            var self = this;

            // ##START: US25684
            var saveCallback = function () {
                self.isVBReassignmentVisible(false);
            };

            var vbReassignmentPopupData = {
                reassignmentReasons: self.vendorBillReassignmentReasons,
                orderRevenuePairList: self.suborderRevenueList,
                bolNumber: self.vendorBillDetailsViewModel.bolNumber(),
                proNumber: self.vendorBillDetailsViewModel.proNumber(),
                vendorBillId: self.vendorBillId(),
                shipmentId: self.vendorBillDetailsViewModel.salesOrderId,
                vendorBillCost: parseFloat(self.vendorBillItemViewModel.vbTotalCost().toString().replace(/,/g, "")) - parseFloat(self.vendorBillItemViewModel.vbTotalDisputeAmount().toString().replace(/,/g, ""))
            };

            // object to be passed to the popup
            var optionControlArgs = {
                options: undefined,
                message: '',
                title: 'Confirmation',
                bindingObject: {
                    vbReassignmentPopupData: vbReassignmentPopupData,
                    saveCallback: saveCallback
                }
            };

            // ##END: US25684
            _app.showDialog('vendorBill/VendorBillReassignmentPopup', optionControlArgs);
        };

        // ##START: US25684
        // preload the data needed on the VB reasignment popup
        VendorBillEditDetailsViewModel.prototype.getVBReassignmentPopupData = function (bolNumber) {
            var self = this;

            if (!bolNumber)
                return;

            self.salesOrderClient.GetSubordersAndRevenuesByBOLNumber(bolNumber, function (data) {
                if (data) {
                    self.suborderRevenueList = data;
                    self.isVBReassignmentVisible(true);
                }
            }, function () {
                self.isVBReassignmentVisible(false);
                console.log('Error occurred while fetching suborders and revenues');
            });

            if (typeof self.vendorBillReassignmentReasons !== 'undefined' && self.vendorBillReassignmentReasons !== null && self.vendorBillReassignmentReasons.length === 0) {
                self.vendorBillClient.GetVendorBillReassignmentReasons(function (data) {
                    if (data) {
                        self.vendorBillReassignmentReasons = data;
                    }
                }, function () {
                    console.log('Error occurred  while fetching Vendor Bill Reassignment Reasons');
                });
            }
        };

        // ##END: US25684
        /*
        ** <summary>
        ** Get all invoiced SO list except credit memo suborder to show in credit memo popup window
        ** </summary>
        ** <createDetails>
        ** <id>US26559</id> <by>Vasanthakumar</by> <date>02-02-2017</date>
        ** </createDetails>
        */
        VendorBillEditDetailsViewModel.prototype.getCreditMemoInvoicedSOList = function (shipmentId) {
            var self = this;
            self.salesOrderClient.GetAllInvoicedSOExceptCreditMemoSubSO(shipmentId, function (data) {
                if (data) {
                    self.invoicedSOExceptCMSubSo.removeAll();
                    self.invoicedSOExceptCMSubSo = data;
                }
            }, function (message) {
            });
        };

        // To set address accordion to overflow
        VendorBillEditDetailsViewModel.prototype.addressOverflowManage = function () {
            if ($("#collapseAddress").css("overflow") === "hidden") {
                setTimeout(function () {
                    $('#collapseAddress').css("overflow", "visible");
                }, 500);
            } else {
                $('#collapseAddress').css("overflow", "hidden");
            }
        };

        //To show the progress bar.
        VendorBillEditDetailsViewModel.prototype.ShowProgressBar = function (progress) {
            var self = this;
            self.listProgressAccordian(progress);
            self.listProgressTabbed(progress);
        };

        //#endregion
        VendorBillEditDetailsViewModel.prototype.DisableAlltheControls = function () {
            var self = this;
            if (self.isViewOnly) {
                $('#mainDiv').find('span, textarea, button, select').attr('disabled', 'disabled');
                $('#mainDiv').find('span, textarea, button, select').attr('disabled', 'disabled');
                $('#topButtonsDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
                $('#notesDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
                $('#notes').find('input, textarea, button, select').attr('disabled', 'disabled');
            }
            $('#detailsDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
            $('#addressDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
            $('#itemsDiv').find('input, textarea, button, select').attr('disabled', 'disabled');

            $('#vendorDetails').find('input, textarea, button, select').attr('disabled', 'disabled');
            $('#item').find('input, textarea, button, select').attr('disabled', 'disabled');
            $('#address').find('input, textarea, button, select').attr('disabled', 'disabled');

            // ###START: US23124
            $('#txtMemo').removeAttr('disabled');
            // ###END: US23124
        };

        // To Clear the Local storage
        // Change 1: VendorBill Id: Changed to ProNumber. Because When creating sub bill we are replacing the suborder data as main order in local storage as we didn't clear the Vendor bill Id until saving the sub bill.
        // Change 2:ProNumber Reverted back to VendorBillId_PRO#, because incase of same pro# is making the problem. So problem is sorted out.
        VendorBillEditDetailsViewModel.prototype.clearLocalStorage = function (targetId) {
            if (LocalStorageController.Get(targetId + 'VB')) {
                LocalStorageController.Set(targetId + 'VB', undefined);
            }

            if (LocalStorageController.Get(targetId + 'VBFinancialDetails')) {
                LocalStorageController.Set(targetId + 'VBFinancialDetails', undefined);
            }
        };

        //#endregion
        //#region Life Cycle Event
        //** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
        VendorBillEditDetailsViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //** The composition engine will execute it prior to calling the binder. */
        VendorBillEditDetailsViewModel.prototype.activate = function () {
            var self = this;

            //self.ShowProgressBar(true);
            return true;
        };

        VendorBillEditDetailsViewModel.prototype.deactivate = function () {
            var self = this;

            self.cleanup();
        };

        VendorBillEditDetailsViewModel.prototype.registerData = function (vendorBillId, isSubBill) {
            var self = this;

            //data object will keep the viewModels.
            // ###START: DE24441
            var data = { vendorBillId: vendorBillId, isSubBill: 'false', isException: 'false', isLostBill: 'false', proNumber: self.vendorBillDetailsViewModel.proNumber() };

            // ###END: DE24441
            _app.trigger("registerMyData", data);
        };

        VendorBillEditDetailsViewModel.prototype.overFlowManage = function () {
            var self = this;
            if (self.isAccordion()) {
                if (!$('#collapseAddress').hasClass('in')) {
                    $('#collapseAddress').css("overflow", "hidden");
                } else {
                    $('#collapseAddress').css("overflow", "visible");
                }
            }
        };

        //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
        VendorBillEditDetailsViewModel.prototype.beforeBind = function (vendorBillId) {
            var self = this;

            //if (vendorBillId === undefined || vendorBillId === 0) {
            _app.trigger("loadMyData", function (data) {
                if (data) {
                    //if (!LocalStorageController.Get(data.vendorBillId + '_' + data.proNumber + 'VB')) {
                    self.load(data);
                    //}
                } else {
                    if (vendorBillId === undefined || vendorBillId === 0) {
                        self.isSearchByUrl = true;
                        _app.trigger("closeActiveTab");
                    }
                }
            });
            //} else {
            //	self.ShowProgressBar(false);
            //}
        };

        //** Using for focus cursor on last cycle for focusing in vendor name
        VendorBillEditDetailsViewModel.prototype.compositionComplete = function () {
            //setTimeout(function () {
            //	if (self.vendorBillId() == 0) {
            //		$('.txtVendorName').focus();
            //	} else {
            //		$('.btnCreateSubBill').focus();
            //	}
            //}, 500);
            _app.trigger("IsBIDirtyChange", false);
            var self = this;
            if (self.isSaveEnable) {
                //##START: DE21616
                //self.DisableAlltheControls();
                //##END: DE21616
            } else {
                if (self.billStatus == 2) {
                    if (!self.IsClearedPermission) {
                        self.DisableAlltheControls();
                    }
                }
            }
            if (self.isViewOnly) {
                self.DisableAlltheControls();
            }
            self.checkCompCalled = true;
            self.isNotAtLoadingTime = false;
            //self.getVendorBillExceptionRulesAndResolution();
            ////if data present in localStorage then bind data from local Storage
            //_app.trigger("loadMyData", data => {
            //	if (data) {
            //		if (LocalStorageController.Get(data.vendorBillId + '_' + data.proNumber + 'VB')) {
            //			if (self.iscompositionCompleteCalled()) {
            //				self.load(data);
            //				self.iscompositionCompleteCalled(false);
            //			}
            //		}
            //	} else {
            //		if (self.isSearchByUrl) {
            //			_app.trigger("closeActiveTab");
            //		}
            //	}
            //});
        };

        VendorBillEditDetailsViewModel.prototype.CallChangeMadeFunctions = function () {
            var self = this;

            // to detect changes for vendor Bill Items.
            self.vendorBillItemViewModel.onChangesMade = self.changesDetected;

            //#region Call change functions
            // for address
            self.vendorAddressViewModel.onChangesMade = self.changesDetected;

            // for shipper address
            self.vendorAddressViewModel.shipperLocation.onChangesMade = self.changesDetected;

            //for consignee address
            self.vendorAddressViewModel.consigneeLocation.onChangesMade = self.changesDetected;

            // For vendor Bill section
            self.vendorBillDetailsViewModel.onChangesMade = self.changesDetected;

            // for vendor name in vendor bill section
            self.vendorBillDetailsViewModel.vendorNameSearchList.onChangesMade = self.changesDetected;

            //for buttons in vendor bill section
            self.vendorBillDetailsViewModel.obcvendorBillOptionList.onChangesMade = self.changesDetected;

            // for Vendor bill Notes section
            self.vendorBillNotesViewModel.onChangesMade = self.changesDetected;
        };

        VendorBillEditDetailsViewModel.prototype.cleanup = function () {
            var self = this;

            try  {
                window.removeEventListener("resize", self.resizeFunction);

                delete self.vendorBillNotesViewModel.onChangesMade;

                delete self.vendorAddressViewModel.shipperLocation.onChangesMade;
                delete self.vendorAddressViewModel.consigneeLocation.onChangesMade;
                delete self.vendorAddressViewModel.billToLocation.onChangesMade;
                delete self.setDateTimeOfReload;

                self.vendorAddressViewModel.cleanUp();
                self.vendorBillItemViewModel.cleanUp();
                self.vendorBillNotesViewModel.cleanup();
                self.vendorBillHistoryViewModel.cleanUp();
                self.VendorBillDispute.cleanup();
                self.vendorBillPaymentDetailsViewModel.cleanUp();

                self.vendorBillLinksViewModel.cleanUp();
                delete self.vendorBillLinksViewModel;

                self.vendorBillPODDocViewModel.cleanUp();
                self.VendorBillException.cleanUp();

                self.vendorBillDetailsViewModel.cleanUp();

                delete self.vendorBillItemViewModel;
                delete self.vendorBillNotesViewModel;
                delete self.VendorBillDispute;
                delete self.vendorAddressViewModel;
                delete self.vendorBillPODDocViewModel;
                delete self.changesDetected;
                delete self.vendorBillHistoryViewModel;
                delete self.VendorBillException;

                for (var prop in self) {
                    if (typeof self[prop].dispose === "function") {
                        self[prop].dispose();
                    }
                    if (prop !== "cleanup")
                        delete self[prop];
                }

                delete self;
            } catch (exception) {
                delete self;
            }
        };
        return VendorBillEditDetailsViewModel;
    })();
    exports.VendorBillEditDetailsViewModel = VendorBillEditDetailsViewModel;
});
