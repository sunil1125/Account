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
/// <reference path="../services/models/TypeDefs/vendorBillModels.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'purchaseOrder/PurchaseOrderAddressView', 'purchaseOrder/PurchaseOrderItemView', 'purchaseOrder/PurchaseOrderReviewedNotes', 'purchaseOrder/PurchaseOrderDetailsView', 'purchaseOrder/PurchaseOrderNotesView', 'purchaseOrder/PurchaseOrderPOPpossibility', 'services/client/VendorBillClient', 'services/client/PurchaseOrderClient', 'services/models/vendorBill/VendorBill', 'services/models/vendorBill/VendorBillItemDetails', 'services/models/vendorBill/VendorBillContainer', 'services/models/vendorBill/VendorBillAddress', 'services/models/vendorBill/VendorBillNote', 'services/models/common/Enums', 'templates/saveStatusIndicatorControl', 'purchaseOrder/PurchaseOrderHistory', 'services/models/purchaseOrder/PoToSoContainer', 'services/models/purchaseOrder/POToSOParameters', 'purchaseOrder/PurchaseOrderPODDocView', 'services/models/purchaseOrder/PurchaseOrderUploadFileModel', 'services/models/salesOrder/SalesOrderItemDetail'], function(require, exports, ___router__, ___app__, ___refPurchaseOrderAddress__, ___refPurchaseOrderItem__, ___refPurchaseOrderReviewedNotes__, ___refPurchaseOrderDetails__, ___refPurchaseOrderNotes__, ___refPurchaseOrderPOP__, __refvendorBillClient__, __refpurchaseOrderClient__, ___refpurchaseOrderModel__, ___refpurchaseOrderItemModel__, ___refpurchaseOrderContainerModel__, ___refpurchaseOrderAddressModel__, ___refpurchaseOrderNotesModel__, __refEnums__, __refsaveStatusIndicatorControl__, ___refVendorPOHistory__, ___refPOToSoContainerModel__, ___refPoToSoDetails__, ___refPurchaseOrderPODDocViewModel__, __refPodDocModel__, __refSalesOrderItemDetailModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var _refPurchaseOrderAddress = ___refPurchaseOrderAddress__;
    var _refPurchaseOrderItem = ___refPurchaseOrderItem__;
    var _refPurchaseOrderReviewedNotes = ___refPurchaseOrderReviewedNotes__;
    var _refPurchaseOrderDetails = ___refPurchaseOrderDetails__;
    var _refPurchaseOrderNotes = ___refPurchaseOrderNotes__;
    var _refPurchaseOrderPOP = ___refPurchaseOrderPOP__;
    var refvendorBillClient = __refvendorBillClient__;
    var refpurchaseOrderClient = __refpurchaseOrderClient__;
    var _refpurchaseOrderModel = ___refpurchaseOrderModel__;
    var _refpurchaseOrderItemModel = ___refpurchaseOrderItemModel__;
    var _refpurchaseOrderContainerModel = ___refpurchaseOrderContainerModel__;
    var _refpurchaseOrderAddressModel = ___refpurchaseOrderAddressModel__;
    var _refpurchaseOrderNotesModel = ___refpurchaseOrderNotesModel__;

    //import _refPurchaseORderReasonView = require('purchaseOrder/PurchaseOrderReasonView');
    var refEnums = __refEnums__;
    
    var refsaveStatusIndicatorControl = __refsaveStatusIndicatorControl__;
    var _refVendorPOHistory = ___refVendorPOHistory__;
    var _refPOToSoContainerModel = ___refPOToSoContainerModel__;
    var _refPoToSoDetails = ___refPoToSoDetails__;
    var _refPurchaseOrderPODDocViewModel = ___refPurchaseOrderPODDocViewModel__;
    var refPodDocModel = __refPodDocModel__;
    var refSalesOrderItemDetailModel = __refSalesOrderItemDetailModel__;
    

    //#endregion
    /*
    ** <summary>
    ** Purchase Order Edit Details View Model.
    ** </summary>
    ** <createDetails>
    ** <by>Chandan</by> <date>07-14-2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>DE20533</id> <by>Baldev Singh Thakur</by> <date>12-11-2015</date>
    ** <id>DE20724</id> <by>Vasanthakumar</by> <date>24-11-2015</date><description>Changing Country is not getting saved in UVB in Bill To section</description>
    ** <id>DE20961</id> <by>ManoharBabu</by> <date>17-12-2015</date><description>Changes made to Redirect to Sales Order detail pagewhen a SO is created through UVB to SO</description>
    ** <id>DE21426</id> <by>Vasanthakumar</by> <date>19-01-2016</date> <description>Notes textbox are persistent after clicking reload button</description>
    ** <id>DE22052</id> <by>Vasanthakumar</by> <date>04-03-2016</date> <description>Passing param to save entityid in notes</description>
    ** <id>DE22114</id> <by>Janakiram</by> <date>16-03-2016</date> <description>Added method for validating purchase order item details UVB to So Calls</description>
    ** <id>DE22808</id> <by>Baldev Singh Thakur</by> <date>13-05-2016</date><description>Error message on saving Bill/UVB even if bill has saved successfully.</description>
    ** <id>DE23219</id> <by>Baldev Singh Thakur</by> <date>13-06-2016</date> <description>Quick Pay flag is not sent as True when user performs Force Attach on UVB.</description>
    ** <id>US22796</id> <by>Baldev Singh Thakur</by> <date>16-06-2016</date> <description>Added logic to check if TruckLoad is checked.</description>
    ** <id>US22956</id> <by>Shreesha Adigar</by> <date>23-06-2016</date> <description>Get UVBOwnership value while saving UVB</description>
    ** <id>DE23328</id> <by>Shreesha Adigar</by> <date>23-06-2016</date> <description>Fix the issue with reviewed button</description>
    ** <id>US24389</id> <by>Shreesha Adiga</by> <date>31-08-2016</date><description>Populate TL accessorials if Truckload Bill checkbox is checked</description>
    ** <id>US24616</id> <by>Janakiram</by> <date>10-09-2016</date><description> Shipper Company Name and the Consignee Company Name on the main screen for all UVB's.</description>
    ** <id>US24671</id> <by>Shreesha Adiga</by> <date>12-09-2016</date><description>Change the order of functions in TL PO to SO</description>
    ** </changeHistory>
    */
    var PurchaseOrderEditDetails = (function () {
        //#endregion
        //#region Constructor
        function PurchaseOrderEditDetails() {
            var _this = this;
            this.PurchaseOrderReviewedNotes = new _refPurchaseOrderReviewedNotes.PurchaseOrderReviewedNotesViewModel();
            this.saveStatusIndicatorControl = new refsaveStatusIndicatorControl.SaveStatusIndicatorControl();
            this.vendorBillClient = new refvendorBillClient.VendorBillClient();
            this.purchaseOrderClient = new refpurchaseOrderClient.PurchaseOrderClient();
            this.carrierId = ko.observable(0);
            this.canForceAttach = false;
            this.isSubBill = false;
            this.isUpdateProNo = false;
            this.isPoWithBol = false;
            this.rowaffected = 0;
            // to show the progress bar
            this.listProgress = ko.observable(false);
            this.listProgressHistory = ko.observable(false);
            this.forceAttactBOL = ko.observable(0);
            // to show progress bar for POP details section only
            this.listProgressPOP = ko.observable(false);
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
            // flag for disabling all the fields for the account receivable
            this.IsReadOnly = false;
            this.currentDateTime = ko.observable('');
            this.isNotAtLoadingTime = false;
            this.isAccordion = ko.observable(false);
            // for validation
            this.isValidPurchaseOrderDetails = false;
            this.isValidAddress = false;
            this.isValidItems = false;
            // ###START: DE22114
            this.isValidPOtoSO = true;
            //## Holds the source of ForceAttach
            this.forceAttachSource = ko.observable('');
            this.checkMsgDisplay = true;
            // get the Utils class object
            this.commonUtils = new Utils.Common();
            //Force attached BOL is Present or not
            this.isForceAttachedBOL = ko.observable(false);
            // keep force attach and make inactive state.
            this.isForceAttachOptionSelected = false;
            this.isMakeInactiveSelected = false;
            this.isReviewedSelected = false;
            this.isReviewed = ko.observable(false);
            this.listProgressAccordian = ko.observable(false);
            this.listProgressTabbed = ko.observable(false);
            //once call load from inside compositionComplete
            this.iscompositionCompleteCalled = ko.observable(true);
            this.OriginZip = ko.observable('');
            this.reasonCodeList = [];
            var self = this;

            //Call to populate Shipper and consignee Address
            self.purchaseOrderDetailsViewModel = new _refPurchaseOrderDetails.PurchaseOrderDetailsViewModel(function (shipperAddress) {
                self.purchaseOrderAddressViewModel.populateShipperAddress(shipperAddress);
            }, function (consigneeAddress) {
                self.purchaseOrderAddressViewModel.populateConsigneeAddress(consigneeAddress);
            }, function (billToAddress) {
                self.purchaseOrderAddressViewModel.populateDefaultBillToAddress(billToAddress);
            }, //Call back to expand either items or Address when user press 'TAB' form last field.
            function () {
                if (self.isAccordion()) {
                    self.expandView('collapseItems');
                    $('#itemsDiv').focus();
                    $('#collapseItems').css("overflow", "visible");
                } else {
                    //self.collapseAllTabs();
                    $('#items').addClass('active in');
                    $('#itemsLink').addClass('active');
                    self.expandView('collapseItems');
                    $('#itemsDiv').focus();
                }
            }, function () {
                self.poToSoCreation();
            }, function () {
                self.rateItManually();
            });

            self.purchaseOrderItemViewModel = new _refPurchaseOrderItem.PurchaseOrderItemViewModel(function (totalCost, totalWeght, totalPices) {
                self.purchaseOrderDetailsViewModel.totalWeigth(totalWeght);
                self.purchaseOrderDetailsViewModel.totalPieces(totalPices);
                self.purchaseOrderDetailsViewModel.purchaseOrderAmount($.number(totalCost, 2));
            }, function () {
                var bolNumber = self.purchaseOrderDetailsViewModel.bolNumber();
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
                        $('#address').addClass('active in');
                        $('#addressLink').addClass('active');
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

            // ###START: US24616
            self.purchaseOrderAddressViewModel = new _refPurchaseOrderAddress.PurchaseOrderAddressViewModel(function (originZip, destinationZip, shipper, consignee) {
                // ###END: US24616
                self.purchaseOrderDetailsViewModel.originZip(originZip);
                self.purchaseOrderDetailsViewModel.destinationZip(destinationZip);

                // ###START: US24616
                self.purchaseOrderDetailsViewModel.shipper(shipper);
                self.purchaseOrderDetailsViewModel.consignee(consignee);
                // ###END: US24616
            }, //Call back to expand either items or Address when user press 'TAB' form reference number.
            function () {
                if (self.isAccordion()) {
                    //if BOL number is exists then expand items;
                    self.collapseView('collapseAddress');
                    $('#collapseAddress').css("overflow", "hidden");
                    self.expandView('collapseNotes');
                    $('#notesDiv').focus();
                } else {
                    self.collapseAllTabs();
                    $('#notes').addClass('active in');
                    $('#notesLink').addClass('active');
                }
            });

            // Assigne the
            self.purchaseOrderDetailsViewModel.onCustomerChangeCallBack = self.purchaseOrderAddressViewModel.isForeignVisible;
            self.purchaseOrderDetailsViewModel.onCustomerIdCallBack = self.purchaseOrderAddressViewModel.customerId;
            self.purchaseOrderPODDocViewModel = new _refPurchaseOrderPODDocViewModel.PurchaseOrderPODDocViewModel();
            self.purchaseOrderNotesViewModel = new _refPurchaseOrderNotes.PurchaseOrderNotesViewModel();
            self.purchaseOrderPOPViewModel = new _refPurchaseOrderPOP.PurchaseOrderPoPossibilityViewModel(function (bolNumber) {
                if (bolNumber !== null) {
                    var self = _this;
                    self.isForceAttachedBOL(true);
                    self.purchaseOrderDetailsViewModel.bolNumber(bolNumber.toString());
                    self.forceAttachSource('UVB Possibility - Force Attach');
                    self.isForceAttachOptionSelected = true;
                    self.purchaseOrderDetailsViewModel.obcvendorBillOptionList.isForceAttachChecked = true;
                    self.purchaseOrderDetailsViewModel.obcvendorBillOptionList.getOptionsById(2).selected(true);
                    self.onSave();
                }
            });

            if (!self.currentUser()) {
                // Get the logged in user for name for new note}
                _app.trigger("GetCurrentUserDetails", function (currentUser) {
                    self.currentUser(currentUser);
                });
            }

            self.POHistoryViewModel = new _refVendorPOHistory.PurchaseOrderHistoryViewModel();

            //## Expands all the accordions in one click
            self.expandAllAccordions = function () {
                //self.expandView('collapsePurchaseOrder');
                self.expandView('collapseAddress');
                self.expandView('collapseItems');
                self.expandView('collapseNotes');
                self.expandView('collapseReviewedNotes');
                self.expandView('collapsePOPpossibility');
                self.expandView('collapseHistory');
                self.expandView('collapsePOD');
                self.expandSourceImage('Content/images/expand_hit.png');
                self.collapseSourceImage('Content/images/collapse.png');
                //self.ReviewedNotesOverflowManage();
            };

            //## Collapse all the accordions in one click
            self.collapseAllAccordions = function () {
                //self.collapseView('collapsePurchaseOrder');
                self.collapseView('collapseAddress');
                self.collapseView('collapseItems');
                self.collapseView('collapseNotes');
                self.collapseView('collapseReviewedNotes');
                self.collapseView('collapsePOPpossibility');
                self.collapseView('collapseHistory');
                self.collapseView('collapsePOD');
                self.collapseSourceImage('Content/images/collapse_hit.png');
                self.expandSourceImage('Content/images/expand.png');
                //self.ReviewedNotesOverflowManage();
            };

            self.callCheckForceAttachOptions = function () {
                self.checkMsgDisplay = true;
                self.callCheckForceAttachOptions();
            };

            self.callCheckBolValidationNo = function () {
                self.checkMsgDisplay = true;
                self.isPoWithBol = false;
            };

            self.callCheckBolValidationYes = function () {
                self.checkMsgDisplay = true;
                self.isPoWithBol = true;

                // Call next validation
                self.validateProNumber();
            };

            self.callForceAttchNo = function () {
                self.checkMsgDisplay = true;
                self.canForceAttach = false;
                //self.setUpModelAndSave();
            };

            self.callForceAttchYes = function () {
                self.checkMsgDisplay = true;
                self.isMakeInactiveSelected = false;
                self.canForceAttach = true;
                self.forceAttachSource('UVB Main View - Force Attach');
                self.purchaseOrderDetailsViewModel.obcvendorBillOptionList.getOptionsById(1).selected(false);
                self.purchaseOrderDetailsViewModel.obcvendorBillOptionList.getOptionsById(2).selected(true);
                if (self.parExistingProNo.toString() != "" && !self.isSubBill) {
                    self.matchingSalesMsg(self.parExistingProNo);
                } else {
                    self.setUpModelAndSave();
                }
            };

            self.callMatchingsalesYes = function () {
                self.checkMsgDisplay = true;
                self.canForceAttach = true;
                self.isUpdateProNo = true;
                self.setUpModelAndSave();
            };

            self.callMatchingsalesNo = function () {
                self.checkMsgDisplay = true;
                self.canForceAttach = false;
                self.setUpModelAndSave();
            };

            //To check if Msg is clicked
            self.checkMsgClick = function () {
                self.checkMsgDisplay = true;
                self.checkMsgDisplay = true;
            };

            // to Check if Msg is hidden or closed
            self.checkMsgHide = function () {
                self.checkMsgDisplay = true;
                self.checkMsgDisplay = true;
            };

            // To open Sales Order details
            // ###START: DE20961
            self.viewDetail = function (msg) {
                // opens the details tab or the current created bill
                _app.trigger("openSalesOrder", msg.actionButtonName, msg.actionButtonName, function (callback) {
                });
                return true;
            };

            // ###END: DE20961
            //TO set grid column after browser resizing
            window.addEventListener("resize", resizeFunction);
            function resizeFunction() {
                //on click we are calling this flag to show grid column resizebal as per browser window
                self.purchaseOrderNotesViewModel.reportContainer.isAttachedToView(false);
                self.purchaseOrderNotesViewModel.reportContainer.isAttachedToView(true);

                //on click we are calling this flag to show grid column resizebal as per browser window
                self.purchaseOrderPODDocViewModel.reportContainer.isAttachedToView(false);
                self.purchaseOrderPODDocViewModel.reportContainer.isAttachedToView(true);
            }

            // Enables or disables the save button and also makes the window as dirty flag
            self.changesDetected = function (dirty) {
                if (self.isNotAtLoadingTime === false) {
                    if (dirty || self.purchaseOrderNotesViewModel.ischange() || self.purchaseOrderNotesViewModel.returnValue() || self.purchaseOrderAddressViewModel.shipperLocation.returnValue || self.purchaseOrderAddressViewModel.consigneeLocation.returnValue || self.purchaseOrderAddressViewModel.billToLocation.returnValue || self.purchaseOrderAddressViewModel.returnValue || self.purchaseOrderDetailsViewModel.vendorNameSearchList.returnValue || self.purchaseOrderDetailsViewModel.returnValueFlag || self.purchaseOrderItemViewModel.returnValue() || self.PurchaseOrderReviewedNotes.returnValue()) {
                        self.isChange(true);
                        //window.ischange = true;
                    } else {
                        if (!self.isChange())
                            self.isChange(false);
                        //window.ischange = false;
                    }

                    _app.trigger("IsBIDirtyChange", self.isChange());
                }
                //#endregion
            };

            //#region Call change functions
            // for address
            self.CallChangeMadeFunctions();

            //#endregion
            // ##START: US24389
            self.purchaseOrderDetailsViewModel.purchaseOrderToSalesOrederViewModel.isTruckLoadChecked.subscribe(function (newValue) {
                if (typeof newValue !== "undefined" && newValue === true) {
                    self.reloadItemsOnTruckloadCheckboxChange('Truckload');
                } else {
                    self.reloadItemsOnTruckloadCheckboxChange('LTL');
                }
            });

            // ##END: US24389
            return self;
        }
        //#endregion
        //#region Internal Methods
        //#region Save
        //// For Validating
        PurchaseOrderEditDetails.prototype.onSave = function () {
            var self = this;

            // Show all the validation as once (All section validation)
            self.isMakeInactiveSelected = self.purchaseOrderDetailsViewModel.obcvendorBillOptionList.getOptionsById(1).selected();
            if (self.canForceAttach === true || self.purchaseOrderDetailsViewModel.obcvendorBillOptionList.getOptionsById(2).selected()) {
                self.purchaseOrderDetailsViewModel.obcvendorBillOptionList.getOptionsById(1).selected(false);
                self.isMakeInactiveSelected = false;

                if (self.forceAttachSource !== null && self.forceAttachSource() !== 'UVB Possibility - Force Attach')
                    self.forceAttachSource('UVB Main View - Force Attach');
                // ###END: US22323
            }
            var isPurchaseOrderDetailsInValid = self.purchaseOrderDetailsViewModel.validatePurchaseOrderDetails(), isPurchaseOrderAddressesInValid = self.purchaseOrderAddressViewModel.validateAddresses(), isVendorItemInValid = self.purchaseOrderItemViewModel.validateItems();

            if (self.isAccordion()) {
                self.validateAccordionView(isPurchaseOrderAddressesInValid, isVendorItemInValid);
            } else {
                self.validateTabbedView(isPurchaseOrderAddressesInValid, isVendorItemInValid);
            }

            if (!(!isPurchaseOrderDetailsInValid && self.isValidAddress && self.isValidItems)) {
                return;
            } else {
                //if (self.checkMsgDisplay) {
                //	self.checkMsgDisplay = false;
                self.savepurchaseOrder();
                self.saveStatusIndicatorControl.applySettings(refEnums.Enums.SavingStatus.ChangesSaved.ID);
                self.isChange(false);

                //window.ischange = false;
                _app.trigger("IsBIDirtyChange", self.isChange(false));
                //}
            }
        };

        //function which executes when user clicks on button named OnRateItCustomer through callback
        PurchaseOrderEditDetails.prototype.poToSoCreation = function () {
            var self = this;
            var isPurchaseOrderDetailsValid = self.purchaseOrderDetailsViewModel.validatePurchaseOrderDetails(), isPurchaseOrderAddressesValid = self.purchaseOrderAddressViewModel.validateAddresses(), isVendorItemValid = self.purchaseOrderItemViewModel.validateItems();

            if (self.isAccordion()) {
                self.validateAccordionView(isPurchaseOrderAddressesValid, isVendorItemValid);
            } else {
                self.validateTabbedView(isPurchaseOrderAddressesValid, isVendorItemValid);
            }

            // ###START: DE22114
            self.validateItemsPOtoSo();

            if (!(!isPurchaseOrderDetailsValid && self.isValidAddress && self.isValidItems && self.isValidPOtoSO)) {
                return;
            } else {
                // to save PO TO SO Creation through callback
                self.setUpPotoSoModalAndSave();
            }
        };

        /// <createDetails>
        /// <id>DE22114</id> <by>Janakiram</by> <date>15-03-2016</date><description> Validate Class, Weight, Pieces and Package Type</description>
        /// </createDetails>
        PurchaseOrderEditDetails.prototype.validateItemsPOtoSo = function () {
            var self = this;
            self.isValidPOtoSO = true;
            var purchaseOrderData = new _refpurchaseOrderContainerModel.Models.VendorBillContainer();
            purchaseOrderData.VendorBillItemsDetail = self.getPurchaseOrderItemsDetails();
            if (purchaseOrderData.VendorBillItemsDetail.length > 0) {
                purchaseOrderData.VendorBillItemsDetail.forEach(function (item) {
                    if (item.IsShippingItem) {
                        if (self.isEmpty(item.SelectedClassType) || (item.Weight == 0 || item.Weight == null || item.Weight === undefined) || (item.PieceCount == 0 || item.PieceCount == null || item.PieceCount === undefined) || (self.isEmpty(item.PackageTypeId)))
                            self.isValidPOtoSO = false;
                    }
                });
            }

            if (self.isValidPOtoSO == false) {
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, "Class, Weight, Pieces and Package Type are mandatory for Purchase Order to Sales Order creation", "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
            }
        };

        /// <createDetails>
        /// <id>DE22114</id> <by>Janakiram</by> <date>15-03-2016</date><description> Checking Class and Package Type</description>
        /// </createDetails>
        PurchaseOrderEditDetails.prototype.isEmpty = function (val) {
            return (val === undefined || val == null || val.length <= 0) ? true : false;
        };

        //function which executes when user clicks on button named OnRateItCustomer through callback
        PurchaseOrderEditDetails.prototype.rateItManually = function () {
            var self = this;
            var isPurchaseOrderDetailsValid = self.purchaseOrderDetailsViewModel.validatePurchaseOrderDetails(), isPurchaseOrderAddressesValid = self.purchaseOrderAddressViewModel.validateAddresses(), isVendorItemValid = self.purchaseOrderItemViewModel.validateItems();

            if (self.isAccordion()) {
                self.validateAccordionView(isPurchaseOrderAddressesValid, isVendorItemValid);
            } else {
                self.validateTabbedView(isPurchaseOrderAddressesValid, isVendorItemValid);
            }

            // ###START: DE22114
            self.validateItemsPOtoSo();

            if (!(!isPurchaseOrderDetailsValid && self.isValidAddress && self.isValidItems && self.isValidPOtoSO)) {
                return;
            } else {
                // to save PO TO SO Creation through callback
                self.setUpPotoSoModalAndSaveForManually();
            }
        };

        // function to validate tab view section
        PurchaseOrderEditDetails.prototype.validateTabbedView = function (isPurchaseOrderAddressesInValid, isVendorItemInValid) {
            var self = this;
            self.collapseAllTabs();

            if (isVendorItemInValid) {
                $('#item').addClass('active in');
                $('#itemLink').addClass('active');
                self.isValidItems = false;
            } else {
                self.isValidItems = true;
            }

            if (isPurchaseOrderAddressesInValid && !isVendorItemInValid) {
                $('#address').addClass('active in');
                $('#addressLink').addClass('active');
                self.isValidAddress = false;
            } else {
                self.isValidAddress = true;
            }

            if (isVendorItemInValid && !isPurchaseOrderAddressesInValid) {
                $('#item').addClass('active in');
                $('#itemLink').addClass('active');
            }
            if (!isVendorItemInValid && !isPurchaseOrderAddressesInValid) {
                $('#item').addClass('active in');
                $('#itemLink').addClass('active');
            }
        };

        // function to validate accordion view section
        PurchaseOrderEditDetails.prototype.validateAccordionView = function (isPurchaseOrderAddressesValid, isVendorItemValid) {
            var self = this;

            if ($('#collapseNotes').hasClass('in')) {
                $('#collapseNotes').collapse('toggle');
                $('#AchorcollapseNotes').addClass('collapsed');
            }

            if ($('#collapseReviewedNotes').hasClass('in')) {
                $('#collapseReviewedNotes').collapse('toggle');
                $('#AchorcollapseReviewedNotes').addClass('collapsed');
            }

            if (isPurchaseOrderAddressesValid) {
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
        PurchaseOrderEditDetails.prototype.collapseAllTabs = function () {
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
            if ($('#reviewedNotes').hasClass('in')) {
                $('#reviewedNotes').removeClass('active in');
                $('#reviewedNotesLink').removeClass('active in');
            }
            if ($('#popossibility').hasClass('in')) {
                $('#popossibility').removeClass('active in');
                $('#popossibilityLink').removeClass('active in');
            }
            if ($('#history').hasClass('in')) {
                $('#history').removeClass('active in');
                $('#historyLink').removeClass('active in');
            }
            if ($('#tab_podDoc').hasClass('in')) {
                $('#tab_podDoc').removeClass('active in');
                $('#podDocLink').removeClass('active in');
            }
        };

        //collapse All Tab and Open Items
        PurchaseOrderEditDetails.prototype.collapseAllTabsAndOpenItem = function () {
            var self = this;
            self.collapseAllTabs();
            $('#item').addClass('active in');
            $('#itemLink').addClass('active');
        };

        //To collapse one by one if we have no validation in purchaseOrder Address and Item
        PurchaseOrderEditDetails.prototype.collapseAchorpurchaseOrder = function () {
            var self = this;
            if ($('#collapsePurchaseOrder').hasClass('in') && self.isValidPurchaseOrderDetails) {
                $('#collapsePurchaseOrder').collapse('toggle');
                $('#AchorcollapsePurchaseOrder').addClass('collapsed');
            }
        };

        PurchaseOrderEditDetails.prototype.collapseAchorcAddress = function () {
            var self = this;
            if ($('#collapseAddress').hasClass('in') && self.isValidAddress) {
                $('#collapseAddress').collapse('toggle');
                $('#AchorcollapseAddress').addClass('collapsed');
            }
            $('#collapseAddress').css("overflow", "hidden");
        };

        PurchaseOrderEditDetails.prototype.colapseAchorItems = function () {
            var self = this;
            if ($('#collapseItems').hasClass('in') && self.isValidItems) {
                $('#collapseItems').collapse('toggle');
                $('#AchorcollapseItems').addClass('collapsed');
            }
        };

        // For Saving Vendor Bill Detail
        PurchaseOrderEditDetails.prototype.savepurchaseOrder = function () {
            var self = this;

            if (self.validatePurchaseOrder()) {
                self.validateVendorNotes();
            }
        };

        //// Gets the data from all the different view model and sends those to service
        PurchaseOrderEditDetails.prototype.setUpModelAndSave = function () {
            var self = this;

            if (((self.isMakeInactiveSelected && self.purchaseOrderDetailsViewModel.isActiveOnLoad) || self.isForceAttachOptionSelected || self.isForceAttachedBOL() || self.purchaseOrderDetailsViewModel.obcvendorBillOptionList.getOptionsById(2).selected()) && !self.currentUser().IsRexnordManager) {
                self.showReasonPopup();
            } else {
                self.finalSaveMethod();
            }
        };

        //save method
        PurchaseOrderEditDetails.prototype.finalSaveMethod = function () {
            var self = this;
            var purchaseOrderData = new _refpurchaseOrderContainerModel.Models.VendorBillContainer();
            self.ShowProgressBar(true);
            purchaseOrderData.VendorBill = self.getPurchaseOrderDetails();
            purchaseOrderData.VendorBillAddress = self.getPurchaseOrderAddress();
            purchaseOrderData.VendorBillItemsDetail = self.getPurchaseOrderItemsDetails();
            purchaseOrderData.VendorBillNotes = self.getpurchaseOrderNotes();
            self.savedVendorBillId = purchaseOrderData.VendorBill.VendorBillId;
            self.clearLocalStorage(self.savedVendorBillId);
            self.vendorBillClient.SaveVendorBillDetail(purchaseOrderData, function (message) {
                // Saving successful callback
                self.ShowProgressBar(false);
                if (self.isMakeInactiveSelected) {
                    var proNumber = self.purchaseOrderDetailsViewModel.proNumber().replace(/ PURGE/g, "");
                    proNumber = proNumber + " PURGE";
                }
                if (self.isForceAttachedBOL() || self.canForceAttach === true || self.isForceAttachOptionSelected === true) {
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var toastrOptions1 = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.POForceAttachedSuccessfullyMessage, "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);

                        self.isChange(false);
                        _app.trigger("IsBIDirtyChange", self.isChange(false));

                        _app.trigger('closeActiveTab');
                        _app.trigger("openVendorBill", self.savedVendorBillId, self.purchaseOrderDetailsViewModel.proNumber().replace(/ PURGE/g, ""), function (callback) {
                        });
                        self.isForceAttachedBOL(false);
                    }
                } else {
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var toastrOptions1 = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };

                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.POSavedSuccessfullyMessage, "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
                    }
                    self.isChange(false);
                    _app.trigger("IsBIDirtyChange", self.isChange(false));

                    if (self.purchaseOrderDetailsViewModel.obcvendorBillOptionList.getOptionsById(7).selected() && self.purchaseOrderDetailsViewModel.purchaseOrderToSalesOrederViewModel.customerId() > 0) {
                        self.AssociateForeignBolCustomerWithUVB(self.savedVendorBillId, self.purchaseOrderDetailsViewModel.purchaseOrderToSalesOrederViewModel.customerId());
                    }

                    //by this count we are holding POToSOCreation (isForeignBOL) view on save click
                    self.purchaseOrderDetailsViewModel.count = 0;

                    //_app.trigger('closeActiveTab');
                    self.beforeBind();
                    //self.loadViewAfterComposition();
                    //_app.trigger("openPurchaseOrder", message, proNumber, (callback) => {
                    //	if (!callback) {
                    //		return;
                    //	}
                    //});
                }
            }, function (message) {
                // Saving failed call back
                self.ShowProgressBar(false);
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };

                if (typeof (message) === 'object') {
                    //Changed in true as per requirement
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message.StatusModel.Description, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                    if (self.isForceAttachedBOL() || self.canForceAttach === true || self.isForceAttachOptionSelected === true) {
                        if (message.StatusModel.Description === ApplicationMessages.Messages.VendorBillSavedButMatchingProcessNotWorking) {
                            _app.trigger('closeActiveTab');
                            _app.trigger("openVendorBill", self.savedVendorBillId, self.purchaseOrderDetailsViewModel.proNumber().replace(/ PURGE/g, ""), function (callback) {
                            });
                            self.isForceAttachedBOL(false);
                        } else {
                            self.purchaseOrderDetailsViewModel.bolNumber("");
                            self.isForceAttachedBOL(false);
                        }
                    }
                } else {
                    //Changed in true as per requirement
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                    if (self.isForceAttachedBOL() || self.canForceAttach === true || self.isForceAttachOptionSelected === true) {
                        if (message === ApplicationMessages.Messages.VendorBillSavedButMatchingProcessNotWorking) {
                            _app.trigger('closeActiveTab');
                            _app.trigger("openVendorBill", self.savedVendorBillId, self.purchaseOrderDetailsViewModel.proNumber().replace(/ PURGE/g, ""), function (callback) {
                            });
                            self.isForceAttachedBOL(false);
                        } else {
                            self.purchaseOrderDetailsViewModel.bolNumber("");
                            self.isForceAttachedBOL(false);
                        }
                    }
                }
                // ###END: DE22808
            });
        };

        //function which executes when user clicks on button named OnRateItCustomer through callback
        PurchaseOrderEditDetails.prototype.setUpPotoSoModalAndSave = function () {
            var self = this;
            var poToSoData = new _refPOToSoContainerModel.Models.PoToSoContainer();
            var purchaseOrderData = new _refpurchaseOrderContainerModel.Models.VendorBillContainer();
            self.ShowProgressBar(true);

            purchaseOrderData.VendorBill = self.getPurchaseOrderDetails();
            purchaseOrderData.VendorBillAddress = self.getPurchaseOrderAddress();
            purchaseOrderData.VendorBillItemsDetail = self.getPurchaseOrderItemsDetails();
            purchaseOrderData.VendorBillNotes = self.getpurchaseOrderNotes();

            poToSoData.VendorBillContainer = purchaseOrderData;
            poToSoData.PoToSoDetails = self.getPoToSoDetails();
            self.clearLocalStorage(self.purchaseOrderDetailsViewModel.vendorBillId());

            self.purchaseOrderClient.createPurchaseOrderToSalesOrder(poToSoData, function (message) {
                var data = message;
                if (data.ErrorCode === -1) {
                    self.showRevenueAdjustmentPopup(data, false);
                } else {
                    self.actionAfterSOCreationSuccess(message);
                }
            }, function (message) {
                // Saving failed call back
                self.ShowProgressBar(false);
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
            });
        };

        //Calling on Manually time of rate it customer
        PurchaseOrderEditDetails.prototype.setUpPotoSoModalAndSaveForManually = function () {
            var self = this;
            var poToSoData = new _refPOToSoContainerModel.Models.PoToSoContainer();
            var purchaseOrderData = new _refpurchaseOrderContainerModel.Models.VendorBillContainer();
            self.ShowProgressBar(true);

            purchaseOrderData.VendorBill = self.getPurchaseOrderDetails();
            purchaseOrderData.VendorBillAddress = self.getPurchaseOrderAddress();
            purchaseOrderData.VendorBillItemsDetail = self.getPurchaseOrderItemsDetails();
            purchaseOrderData.VendorBillNotes = self.getpurchaseOrderNotes();

            poToSoData.VendorBillContainer = purchaseOrderData;
            poToSoData.PoToSoDetails = self.getPoToSoDetails();
            self.clearLocalStorage(self.purchaseOrderDetailsViewModel.vendorBillId());

            self.purchaseOrderClient.rateItManually(poToSoData, function (message) {
                var data = message;
                if (data.ErrorCode === -1) {
                    self.showRevenueAdjustmentPopup(data, true);
                } else {
                    self.actionAfterSOCreationSuccess(message);
                }
            }, function (message) {
                // Saving failed call back
                self.ShowProgressBar(false);
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
            });
        };

        PurchaseOrderEditDetails.prototype.actionAfterSOCreationSuccess = function (message) {
            var self = this;
            _app.trigger('closeActiveTab');

            // Saving successful callback
            self.ShowProgressBar(false);
            _app.trigger("openVendorBill", self.purchaseOrderDetailsViewModel.vendorBillId(), self.purchaseOrderDetailsViewModel.proNumber().replace(/ PURGE/g, ""), function (callback) {
            });
            if (self.checkMsgDisplay) {
                self.checkMsgDisplay = false;
                self.savedSalesOrderId = message.BolNumber.toString();
                var actionButtons = [];
                actionButtons.push({
                    actionButtonName: self.savedSalesOrderId.toString(),
                    actionClick: self.viewDetail
                });
                var toastrOptions1 = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: "",
                    actionButtons: actionButtons
                };

                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.CreatedSalesOrderSuccessfullyMessage, "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
            }
        };

        PurchaseOrderEditDetails.prototype.reloadPage = function () {
            var self = this;
            self.ShowProgressBar(true);
            self.collapseAllAccordions();
            self.collapseAllTabs();
            self.onItemClick();
            self.clearLocalStorage(self.purchaseOrderPOPViewModel.VendorBilId());
            LocalStorageController.Set(self.purchaseOrderPOPViewModel.VendorBilId() + 'lastReloadDateTime', undefined);

            //by this count we are holding POToSOCreation (isForeignBOL) view after reload click
            self.purchaseOrderDetailsViewModel.count = 0;

            // ##START: US24389
            self.purchaseOrderDetailsViewModel.purchaseOrderToSalesOrederViewModel.isTruckLoadChecked(false);

            // ##END: US24389
            self.beforeBind();
            //self.ShowProgressBar(false);
            //self.loadViewAfterComposition();
        };

        //set Date Time for record of last refreshed
        PurchaseOrderEditDetails.prototype.setDateTimeOfReload = function () {
            var self = this;
            if (LocalStorageController.Get(self.purchaseOrderPOPViewModel.VendorBilId() + 'lastReloadDateTime')) {
                var localDateTimeOfReload = LocalStorageController.Get(self.purchaseOrderPOPViewModel.VendorBilId() + 'lastReloadDateTime');
                self.currentDateTime(localDateTimeOfReload);
            } else {
                var onlyDate = self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy');
                var date = new Date();
                var str = 'Last Refreshed: ' + onlyDate + ' ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                LocalStorageController.Set(self.purchaseOrderPOPViewModel.VendorBilId() + 'lastReloadDateTime', str);

                //var reloadDate = LocalStorageController.Get(self.vendorBillDetailsViewModel.proNumber() + 'lastReloadDateTime');
                self.currentDateTime(str);
            }
        };

        // if IsForeignBol is Checked and Selected Customer
        PurchaseOrderEditDetails.prototype.AssociateForeignBolCustomerWithUVB = function (vendorBillId, customerId) {
            var self = this;
            self.purchaseOrderClient.AssociateForeignBolCustomerWithUVB(vendorBillId, customerId, function (data) {
            }, function (message) {
                var toasterOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInSeconds: 2,
                    fadeOut: 2,
                    typeOfAlert: "",
                    title: ""
                };
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, "Error While Associating a customer to the UVB", "error", null, toasterOptions);
            });
        };

        // To set address accordion to overflow
        PurchaseOrderEditDetails.prototype.addressOverflowManage = function () {
            if ($("#collapseAddress").css("overflow") === "hidden") {
                setTimeout(function () {
                    $('#collapseAddress').css("overflow", "visible");
                }, 500);
            } else {
                $('#collapseAddress').css("overflow", "hidden");
            }
        };

        // To set ReviewedNotes accordion to overflow
        ////private ReviewedNotesOverflowManage() {
        ////	// To set address accordion to overflow:hidden and vice versa overflow:visible
        ////	if ($("#collapseReviewedNotes").css("overflow") === "hidden") {
        ////		setTimeout(function () {
        ////			$('#collapseReviewedNotes').css("overflow", "visible");
        ////		}, 500);
        ////	}
        ////	else {
        ////		$('#collapseReviewedNotes').css("overflow", "hidden");
        ////	}
        ////}
        //// Gets the vendor bill details
        PurchaseOrderEditDetails.prototype.getPurchaseOrderDetails = function () {
            var self = this;

            var purchaseOrderDetails = new _refpurchaseOrderModel.Models.VendorBill();

            // For new vendor bill bill id should be 0 and the bill status will be pending (0)
            purchaseOrderDetails.VendorBillId = self.purchaseOrderDetailsViewModel.vendorBillId();
            purchaseOrderDetails.CarrierId = self.purchaseOrderDetailsViewModel.vendorId();
            purchaseOrderDetails.CarrierType = self.purchaseOrderDetailsViewModel.vendorNameSearchList.carrierType();
            purchaseOrderDetails.Amount = self.purchaseOrderDetailsViewModel.purchaseOrderAmount();
            purchaseOrderDetails.BillDate = self.purchaseOrderDetailsViewModel.billDate();
            purchaseOrderDetails.BolNumber = self.purchaseOrderDetailsViewModel.bolNumber();
            purchaseOrderDetails.DestinationZip = self.purchaseOrderDetailsViewModel.destinationZip();
            purchaseOrderDetails.MainVendorBolNumber = self.purchaseOrderDetailsViewModel.mainBolNumber();
            purchaseOrderDetails.ProNumber = self.purchaseOrderDetailsViewModel.proNumber();
            purchaseOrderDetails.SalesOrderId = self.purchaseOrderDetailsViewModel.salesOrderId;
            purchaseOrderDetails.IsPurchaseOrder = true;
            purchaseOrderDetails.UpdatePRONumberInShipment = self.isUpdateProNo;
            purchaseOrderDetails.ProcessDetails = self.purchaseOrderAddressViewModel.processDetails();
            purchaseOrderDetails.OriginalBOLNumber = self.purchaseOrderDetailsViewModel.originalBolNumber;
            purchaseOrderDetails.BillStatus = 1;
            purchaseOrderDetails.Memo = self.purchaseOrderDetailsViewModel.memo();

            // ###START: DE23219
            purchaseOrderDetails.QuickPay = self.purchaseOrderDetailsViewModel.quickPay();

            // ###END: DE23219
            // ##START: US22956
            purchaseOrderDetails.UVBOwnership = typeof self.purchaseOrderDetailsViewModel.uvbOwnership() === "undefined" ? 0 : self.purchaseOrderDetailsViewModel.uvbOwnership();

            // ##END: US22956
            // ##START: DE23328
            self.isReviewedSelected = false;

            // ##END: DE23328
            var selecetedList = self.purchaseOrderDetailsViewModel.obcvendorBillOptionList.getSelectedOptions(true);

            selecetedList.forEach(function (item) {
                if (item.id === refEnums.Enums.vendorBillOptionConstant.FroceAttach) {
                    self.isForceAttachOptionSelected = true;
                } else if (item.id === refEnums.Enums.vendorBillOptionConstant.MakeInactive) {
                    self.isMakeInactiveSelected = true;
                }
                if (item.id === refEnums.Enums.vendorBillOptionConstant.Reviewed) {
                    self.isReviewedSelected = true;
                }
            });

            purchaseOrderDetails.ForceAttach = self.isForceAttachOptionSelected || self.canForceAttach;
            if (self.isForceAttachedBOL()) {
                purchaseOrderDetails.MakeInactive = false;
            } else {
                purchaseOrderDetails.MakeInactive = self.isMakeInactiveSelected;
            }

            purchaseOrderDetails.IsReviewed = self.isReviewedSelected;
            purchaseOrderDetails.ReviewRemarks = self.PurchaseOrderReviewedNotes.reviewedRemark();
            purchaseOrderDetails.Memo = self.purchaseOrderDetailsViewModel.memo();
            purchaseOrderDetails.OriginZip = self.purchaseOrderDetailsViewModel.originZip();
            purchaseOrderDetails.PoNumber = self.purchaseOrderDetailsViewModel.poNumber();
            purchaseOrderDetails.ReferenceNumber = self.purchaseOrderDetailsViewModel.refNumber();
            purchaseOrderDetails.TotalPieces = self.purchaseOrderDetailsViewModel.totalPieces();
            purchaseOrderDetails.TotalWeight = self.purchaseOrderDetailsViewModel.totalWeigth();
            purchaseOrderDetails.VendorName = self.purchaseOrderDetailsViewModel.vendorName();
            purchaseOrderDetails.UpdatedBy = self.currentUser().GlobalNetUserId;
            purchaseOrderDetails.UpdatedDate = self.purchaseOrderDetailsViewModel.updatedDate;
            purchaseOrderDetails.MainVendorBolNumber = self.purchaseOrderDetailsViewModel.mainBolNumber();
            purchaseOrderDetails.DeliveryDate = self.purchaseOrderDetailsViewModel.deliveryDate();
            purchaseOrderDetails.PickupDate = self.purchaseOrderDetailsViewModel.pickupDate();
            purchaseOrderDetails.DueDate = self.purchaseOrderDetailsViewModel.dueDate();
            purchaseOrderDetails.CreatedDate = self.purchaseOrderDetailsViewModel.createdDate();
            purchaseOrderDetails.ForceAttachSource = self.forceAttachSource();

            if (self.purchaseOrderDetailsViewModel.obcvendorBillOptionList.getOptionsById(7).selected() && self.purchaseOrderDetailsViewModel.purchaseOrderToSalesOrederViewModel.customerId() > 0) {
                purchaseOrderDetails.IsForeignBolChecked = true;
            }

            // ###END: US22323
            return purchaseOrderDetails;
        };

        //// Gets the vendor bill address details
        PurchaseOrderEditDetails.prototype.getPurchaseOrderAddress = function () {
            var self = this;

            var addresses;
            addresses = ko.observableArray([])();

            var purchaseOrderShipperAddress = new _refpurchaseOrderAddressModel.Models.VendorBillAddress();
            var purchaseOrderConsigneeAddress = new _refpurchaseOrderAddressModel.Models.VendorBillAddress();
            var purchaseOrderBillToAddress = new _refpurchaseOrderAddressModel.Models.VendorBillAddress();

            // Create shipper address model
            purchaseOrderShipperAddress.Id = self.purchaseOrderAddressViewModel.shipperAddressId();
            purchaseOrderShipperAddress.VendorBillId = self.purchaseOrderDetailsViewModel.vendorBillId();
            purchaseOrderShipperAddress.Street = self.purchaseOrderAddressViewModel.shipperAddress1();
            purchaseOrderShipperAddress.Street2 = self.purchaseOrderAddressViewModel.shipperAddress2();
            purchaseOrderShipperAddress.CompanyName = self.purchaseOrderAddressViewModel.shipperCompanyName();
            purchaseOrderShipperAddress.ContactPerson = self.purchaseOrderAddressViewModel.shipperContactPerson();
            purchaseOrderShipperAddress.City = self.purchaseOrderAddressViewModel.shipperLocation.location().City;
            purchaseOrderShipperAddress.State = self.purchaseOrderAddressViewModel.shipperLocation.location().StateCode;
            purchaseOrderShipperAddress.ZipCode = self.purchaseOrderAddressViewModel.shipperLocation.location().Zip;
            purchaseOrderShipperAddress.Phone = self.purchaseOrderAddressViewModel.shipperPhone();
            purchaseOrderShipperAddress.Fax = self.purchaseOrderAddressViewModel.shipperFax();
            purchaseOrderShipperAddress.Country = self.purchaseOrderAddressViewModel.isInternationalShipmentSelected() ? self.purchaseOrderAddressViewModel.selectedShipperCountryCode() : self.purchaseOrderAddressViewModel.shipperLocation.location().CountryCode;
            purchaseOrderShipperAddress.AddressType = 1;

            // Create consignee address model
            purchaseOrderConsigneeAddress.Id = self.purchaseOrderAddressViewModel.consigneeAddressId();
            purchaseOrderConsigneeAddress.VendorBillId = self.purchaseOrderDetailsViewModel.vendorBillId();
            purchaseOrderConsigneeAddress.Street = self.purchaseOrderAddressViewModel.consigneeAddress1();
            purchaseOrderConsigneeAddress.Street2 = self.purchaseOrderAddressViewModel.consigneeAddress2();
            purchaseOrderConsigneeAddress.CompanyName = self.purchaseOrderAddressViewModel.consigneeCompanyName();
            purchaseOrderConsigneeAddress.ContactPerson = self.purchaseOrderAddressViewModel.consigneeContactPerson();
            purchaseOrderConsigneeAddress.City = self.purchaseOrderAddressViewModel.consigneeLocation.location().City;
            purchaseOrderConsigneeAddress.State = self.purchaseOrderAddressViewModel.consigneeLocation.location().StateCode;
            purchaseOrderConsigneeAddress.ZipCode = self.purchaseOrderAddressViewModel.consigneeLocation.location().Zip;
            purchaseOrderConsigneeAddress.Phone = self.purchaseOrderAddressViewModel.consigneePhone();
            purchaseOrderConsigneeAddress.Fax = self.purchaseOrderAddressViewModel.consigneeFax();
            purchaseOrderConsigneeAddress.Country = self.purchaseOrderAddressViewModel.isInternationalShipmentSelected() ? self.purchaseOrderAddressViewModel.selectedConsigneeCountryCode() : self.purchaseOrderAddressViewModel.consigneeLocation.location().CountryCode;
            purchaseOrderConsigneeAddress.AddressType = 2;

            // Create Bill To address model
            purchaseOrderBillToAddress.Id = self.purchaseOrderAddressViewModel.billToAddressId();
            purchaseOrderBillToAddress.VendorBillId = self.purchaseOrderDetailsViewModel.vendorBillId();
            purchaseOrderBillToAddress.Street = self.purchaseOrderAddressViewModel.billToAddress1();
            purchaseOrderBillToAddress.Street2 = self.purchaseOrderAddressViewModel.billToAddress2();
            purchaseOrderBillToAddress.CompanyName = self.purchaseOrderAddressViewModel.billToCompanyName();
            purchaseOrderBillToAddress.City = self.purchaseOrderAddressViewModel.billToLocation.location().City;
            purchaseOrderBillToAddress.State = self.purchaseOrderAddressViewModel.billToLocation.location().StateCode;
            purchaseOrderBillToAddress.ZipCode = self.purchaseOrderAddressViewModel.billToLocation.location().Zip;
            purchaseOrderBillToAddress.Phone = self.purchaseOrderAddressViewModel.billToPhone();
            purchaseOrderBillToAddress.Fax = self.purchaseOrderAddressViewModel.billToFax();

            // ###START: DE20724
            purchaseOrderBillToAddress.Country = self.purchaseOrderAddressViewModel.isInternationalShipmentSelected() ? self.purchaseOrderAddressViewModel.selectedBillToCountryCode() : self.purchaseOrderAddressViewModel.billToLocation.location().CountryCode;

            // ###END: DE20724
            purchaseOrderBillToAddress.AddressType = 3;

            addresses.push(purchaseOrderShipperAddress);
            addresses.push(purchaseOrderConsigneeAddress);
            addresses.push(purchaseOrderBillToAddress);

            return addresses;
        };

        //// Gets the vendor bill Item details
        PurchaseOrderEditDetails.prototype.getPurchaseOrderItemsDetails = function () {
            var self = this;
            var purchaseOrderItems;
            purchaseOrderItems = ko.observableArray([])();

            self.purchaseOrderItemViewModel.purchaseOrderItemsList().forEach(function (item, collection) {
                var purchaseOrderItem = new _refpurchaseOrderItemModel.Models.VendorBillItemDetails();
                purchaseOrderItem.Cost = item.cost();
                purchaseOrderItem.DimensionHeight = item.dimensionHeight();
                purchaseOrderItem.DimensionLength = item.dimensionLength();
                purchaseOrderItem.DimensionWidth = item.dimensionWidth();
                purchaseOrderItem.Id = item.id();
                purchaseOrderItem.PackageTypeId = item.selectedPackageType();
                purchaseOrderItem.PieceCount = item.pieceCount();
                purchaseOrderItem.SelectedClassType = item.selectedClassType();
                purchaseOrderItem.SelectedItemTypes = item.selectedItemTypes();
                purchaseOrderItem.UserDescription = item.userDescription();
                purchaseOrderItem.Weight = item.weight();
                purchaseOrderItem.IsShippingItem = item.isShippingItem();

                // ##START: US24389
                purchaseOrderItem.ItemId = typeof item.selectedItemTypes() !== 'undefined' ? parseInt(item.selectedItemTypes().ItemId) : 0;
                purchaseOrderItem.DisputeAmount = typeof item.disputeAmount() !== 'undefined' ? item.disputeAmount() : 0;
                purchaseOrderItem.DisputeLostAmount = typeof item.disputeLostAmount() !== 'undefined' ? item.disputeLostAmount() : 0;

                if (item.accessorialId() !== undefined) {
                    purchaseOrderItem.AccessorialId = item.accessorialId();
                }
                if (item.accessorialCode()) {
                    purchaseOrderItem.AccessorialCode = item.accessorialCode();
                }
                purchaseOrderItems.push(purchaseOrderItem);
            });
            return purchaseOrderItems;
        };

        //// Gets the vendor bill notes details
        PurchaseOrderEditDetails.prototype.getpurchaseOrderNotes = function () {
            var self = this;
            var purchaseOrderNotes;
            purchaseOrderNotes = ko.observableArray([])();

            if (self.purchaseOrderNotesViewModel && self.purchaseOrderNotesViewModel.purchaseOrderNoteItems()) {
                self.purchaseOrderNotesViewModel.purchaseOrderNoteItems().forEach(function (item) {
                    purchaseOrderNotes.push(self.addNoteItem(item));
                });
            }

            return purchaseOrderNotes;
        };

        // function to fetch the details from PO TO SO Creation view model.
        // <changeHistory>
        // <id>US22796</id> <by>Baldev Singh Thakur</by> <date>16-06-2016</date> <description>Added logic to check if TruckLoad is checked.</description>
        // </changeHistory>
        PurchaseOrderEditDetails.prototype.getPoToSoDetails = function () {
            var self = this;
            var poToSoDetails = new _refPoToSoDetails.Models.POToSOParameter();
            poToSoDetails.AgencyId = self.purchaseOrderDetailsViewModel.purchaseOrderToSalesOrederViewModel.agencyId();
            poToSoDetails.AgentId = self.purchaseOrderDetailsViewModel.purchaseOrderToSalesOrederViewModel.agentId();
            poToSoDetails.CustomerId = self.purchaseOrderDetailsViewModel.purchaseOrderToSalesOrederViewModel.customerSearchList.customerId();
            poToSoDetails.Term = self.purchaseOrderDetailsViewModel.purchaseOrderToSalesOrederViewModel.term();
            poToSoDetails.AvailableCredit = self.purchaseOrderDetailsViewModel.purchaseOrderToSalesOrederViewModel.availableCredit();
            poToSoDetails.PickupDate = self.purchaseOrderDetailsViewModel.purchaseOrderToSalesOrederViewModel.pickupDate();

            // ###START: US22796
            poToSoDetails.IsTruckLoadChecked = self.purchaseOrderDetailsViewModel.purchaseOrderToSalesOrederViewModel.isTruckLoadChecked();
            poToSoDetails.CustomerName = self.purchaseOrderDetailsViewModel.purchaseOrderToSalesOrederViewModel.customerNameForTlSo;

            // ###END: US22796
            return poToSoDetails;
        };

        //// Checks the force attach options and gets the user input
        //// And then calls the save service
        PurchaseOrderEditDetails.prototype.checkForceAttachOptions = function () {
            var self = this;
            if (self.commonUtils.isNullOrEmptyOrWhiteSpaces(self.purchaseOrderDetailsViewModel.bolNumber())) {
                if (self.purchaseOrderDetailsViewModel.listCheck != null && self.purchaseOrderDetailsViewModel.listCheck()[1] === false) {
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
                    self.validateProNumber();
                }
            } else {
                self.setUpModelAndSave();
            }
        };

        //// function to use get item note model
        PurchaseOrderEditDetails.prototype.addNoteItem = function (item) {
            var itemNote = new _refpurchaseOrderNotesModel.Models.VendorBillNote();

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

        PurchaseOrderEditDetails.prototype.showRevenueAdjustmentPopup = function (data, isRateItManually) {
            var self = this;

            // ##START: US24389
            var message = isRateItManually ? 'The vendor bill cost will not be audited' : 'No matching tariff was found. The vendor bill cost will not be audited';
            var revenueAdjustItems = self.getItemsDetailsByResponseItems(data.SalesOrderContainer.SalesOrderItemDetails);

            // ##END: US24389
            var varMsgBox = [
                {
                    id: 0,
                    name: 'Close',
                    callback: function () {
                        return true;
                    }
                }
            ];

            // ##START: US24389
            var bindingObject = {
                IsTruckloadOrder: self.purchaseOrderDetailsViewModel.purchaseOrderToSalesOrederViewModel.isTruckLoadChecked(),
                SalesOrderItems: revenueAdjustItems
            };

            // ##END: US24389
            ////initialize message box control arguments
            var optionControlArgs = {
                options: varMsgBox,
                message: '',
                title: "UVB TO SO",
                // ##START: US24389
                bindingObject: bindingObject,
                // ##END: US24389
                marginPrecentageMessage: data.MarginMessage,
                headerMessage: message
            };

            //Call the dialog Box functionality to open a Popup
            _app.showDialog('salesOrder/SalesOrderRevenueAdjustment', optionControlArgs).then(function (object) {
                data.SalesOrderContainer.SalesOrderItemDetails = self.getSalesOrderItemsDetails(object.originalRevenueModelList());

                if (object.isSave()) {
                    self.proceedToSoCreation(data);
                } else {
                    self.ShowProgressBar(false);
                    return false;
                }
            });
        };

        //#endregion Internal Methods
        //#region Validation
        PurchaseOrderEditDetails.prototype.proceedToSoCreation = function (data) {
            var self = this;

            self.purchaseOrderClient.proceedToSoCreation(data, function (message) {
                self.actionAfterSOCreationSuccess(message);
            }, function (message) {
                // Saving failed call back
                self.ShowProgressBar(false);
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
            });
        };

        //To Validated Vendor Bill
        PurchaseOrderEditDetails.prototype.validatePurchaseOrder = function () {
            var self = this;

            if (self.commonUtils.isNullOrEmptyOrWhiteSpaces(self.purchaseOrderDetailsViewModel.bolNumber())) {
                if (self.purchaseOrderDetailsViewModel.bolNumber().indexOf(' ') > 0) {
                    self.isSubBill = true;
                }
            }

            if (self.purchaseOrderDetailsViewModel.listCheck != null && self.purchaseOrderDetailsViewModel.listCheck()[0] === true) {
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var toastrOptions1 = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.PROAlreadyExists, "error", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
                }
                return false;
            }

            if (self.purchaseOrderDetailsViewModel.purchaseOrderAmount() < 0) {
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.BillAmountShouldNotbeNegative, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
                return false;
            }

            return true;
        };

        //// Validates the PRO number
        PurchaseOrderEditDetails.prototype.validateProNumber = function () {
            var self = this;
            var existingProNo;

            if (self.commonUtils.isNullOrEmptyOrWhiteSpaces(self.purchaseOrderDetailsViewModel.bolNumber())) {
                if (self.purchaseOrderDetailsViewModel.bolNumber().trim() !== self.purchaseOrderDetailsViewModel.originalBolNumber) {
                    if (self.purchaseOrderDetailsViewModel.listCheck != null && self.purchaseOrderDetailsViewModel.listCheck()[1] === true && self.isPoWithBol != true && !self.purchaseOrderDetailsViewModel.obcvendorBillOptionList.getOptionsById(2).selected()) {
                        self.vendorBillClient.getExistingProNo(self.purchaseOrderDetailsViewModel.bolNumber(), function (data) {
                            existingProNo = data;
                            self.forceAttachMsg(existingProNo);
                        });
                    } else {
                        self.setUpModelAndSave();
                    }
                } else {
                    self.setUpModelAndSave();
                }
            } else {
                self.setUpModelAndSave();
            }
        };

        //// Validates the vendor notes, as if user has only written something not clicked on add
        PurchaseOrderEditDetails.prototype.validateVendorNotes = function () {
            var self = this;

            if (self.purchaseOrderNotesViewModel.canAdd()) {
                //If Notes is not added on save time then adding notes
                self.purchaseOrderNotesViewModel.onAdd();
                self.checkForceAttachOptions();
            } else {
                self.checkForceAttachOptions();
            }
        };

        //to show the progress bar
        PurchaseOrderEditDetails.prototype.ShowProgressBar = function (progress) {
            var self = this;
            self.listProgressAccordian(progress);
            self.listProgressTabbed(progress);
        };

        PurchaseOrderEditDetails.prototype.DisableAlltheControls = function () {
            var self = this;
            $('#mainDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
            $('#detailsDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
            $('#addressDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
            $('#itemsDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
            $('#notesDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
            $('#poPossibility').find('input, textarea, button, select').attr('disabled', 'disabled');
            $('#poDetails').find('input, textarea, button, select').attr('disabled', 'disabled');
            $('#item').find('input, textarea, button, select').attr('disabled', 'disabled');
            $('#address').find('input, textarea, button, select').attr('disabled', 'disabled');
            $('#notes').find('input, textarea, button, select').attr('disabled', 'disabled');
            $('#popossibility').find('input, textarea, button, select').attr('disabled', 'disabled');
            $('#topButtonDiv').find('input, textarea, button, select').attr('disabled', 'disabled');
        };

        //// Shows the message box as pr the given title and message
        PurchaseOrderEditDetails.prototype.showConfirmationMessage = function (message, title, fisrtButtoName, secondButtonName, yesCallBack, noCallBack) {
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

        //#endregion
        //#region Message
        //// If PRO does not matches in the order the ask for force attach,
        PurchaseOrderEditDetails.prototype.forceAttachMsg = function (existingProNo) {
            var self = this;
            self.parExistingProNo = existingProNo;
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

        //// If PRO does not matches then ask to user weather he wants to update that PRO in order or not
        PurchaseOrderEditDetails.prototype.matchingSalesMsg = function (existingProNo) {
            var self = this;
            self.parExistingProNo = existingProNo;
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

                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.ForceAttachInputeMessage + existingProNo.toString() + "\n to match the Vendor Bills PRO# :" + self.purchaseOrderDetailsViewModel.proNumber(), "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
            }
        };

        // To Get Sales Order Item Details
        PurchaseOrderEditDetails.prototype.getItemsDetailsByResponseItems = function (itemsList) {
            var self = this;

            var salesOrderItems;
            salesOrderItems = ko.observableArray([])();

            itemsList.forEach(function (item) {
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
                } else {
                    salesOrderItem.PLCCost = item.PLCCost;
                }

                salesOrderItems.push(salesOrderItem);
            });

            return salesOrderItems;
        };

        // To Get Sales Order Item Details
        PurchaseOrderEditDetails.prototype.getSalesOrderItemsDetails = function (itemsList) {
            var self = this;

            var salesOrderItems;
            salesOrderItems = ko.observableArray([])();

            itemsList.forEach(function (item) {
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
                if (item.bSCost() === null || item.bSCost() === undefined || item.bSCost().toString() === "") {
                    salesOrderItem.PLCCost = 0.00;
                } else {
                    salesOrderItem.PLCCost = item.bSCost();
                }
                salesOrderItems.push(salesOrderItem);
            });

            return salesOrderItems;
        };

        //#endregion
        //#region Handles the click event of the Address accordion
        PurchaseOrderEditDetails.prototype.onAddressClick = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#address').addClass('active in');
            $('#addressLink').addClass('active');

            self.addressOverflowManage();

            $("#shipperCompanyName").focus();
        };

        //#region Handles the click event of the Address accordion
        PurchaseOrderEditDetails.prototype.onReviewedNotesClick = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#reviewedNotes').addClass('active in');
            $('#reviewedNotesLink').addClass('active in');
            //$("#txtuserREviewedNote").focus();
            //self.ReviewedNotesOverflowManage();
        };

        // Sets the notes section focus
        PurchaseOrderEditDetails.prototype.onNotesClick = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#notes').addClass('active in');
            $('#notesLink').addClass('active in');

            $("#txtuserNote").focus();

            //on click we are calling this flag to show grid column resizebal as per browser window
            self.purchaseOrderNotesViewModel.reportContainer.isAttachedToView(false);
            self.purchaseOrderNotesViewModel.reportContainer.isAttachedToView(true);
        };

        // Handles the Item accordion click
        PurchaseOrderEditDetails.prototype.onItemClick = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#item').addClass('active in');
            $('#itemLink').addClass('active');

            $("#addItemButton").focus();
        };

        // Handles the purchaseOrder accordion click
        PurchaseOrderEditDetails.prototype.onpurchaseOrderClick = function () {
            $("#shipperCityStateZip").focus();
        };

        ////## function to expand the view by ID, if any case we required
        PurchaseOrderEditDetails.prototype.expandView = function (viewId) {
            if (!$('#' + viewId).hasClass('in')) {
                $('#' + viewId).addClass('in');
                $('#' + viewId).css("height", 'auto');
                $('#Achor' + viewId).removeClass('collapsed');
            }
        };

        ////## function to collapse the items view by ID, if any case we required
        PurchaseOrderEditDetails.prototype.collapseView = function (viewId) {
            $('#' + viewId).removeClass('in');
            $('#' + viewId).css("height", '0');
            $('#Achor' + viewId).addClass('collapsed');
            $('#collapseAddress').css("overflow", "hidden");
        };

        //#endregion
        //#region Load Data
        PurchaseOrderEditDetails.prototype.load = function (bindedData) {
            if (!bindedData) {
                self.ShowProgressBar(false);
                return;
            } else if (typeof (bindedData.vendorBillId) === 'undefined') {
                self.ShowProgressBar(false);
                return;
            }

            var self = this;
            self.ShowProgressBar(true);
            var vendorBillId = bindedData.vendorBillId, successCallBack = function (data) {
                self.isNotAtLoadingTime = true;
                self.purchaseOrderPOPViewModel.VendorBilId(vendorBillId);
                self.IsReadOnly = data.IsReadOnly;

                if (data.VendorBill.ReviewRemarks) {
                    self.PurchaseOrderReviewedNotes.reviewedRemark(data.VendorBill.ReviewRemarks);
                } else {
                    self.PurchaseOrderReviewedNotes.reviewedRemark("");
                }

                // ###END: DE21426
                //// ###START: DE22052
                self.purchaseOrderNotesViewModel.initializePurchaseOrderNotes(data.VendorBillNotes, vendorBillId);

                //// ###END: DE22052
                // ###START: US20305
                self.purchaseOrderNotesViewModel.UVBStorageKey = vendorBillId + 'PO';

                // ###END: US20305
                ////self.purchaseOrderItemViewModel.purchaseOrderItemsListOnLoad.removeAll();
                ////self.purchaseOrderItemViewModel.purchaseOrderItemsListOnLoad.push.apply(self.purchaseOrderItemViewModel.purchaseOrderItemsListOnLoad, data.VendorBillItemsDetail);
                // load item details
                self.purchaseOrderItemViewModel.initializePurchaseOrderItemDetails(data.VendorBillItemsDetail);
                self.ShowProgressBar(false);

                // load address details
                var shipperAddress = $.grep(data.VendorBillAddress, function (e) {
                    return e.AddressType === refEnums.Enums.AddressType.Origin.ID;
                })[0], consigneeAddress = $.grep(data.VendorBillAddress, function (e) {
                    return e.AddressType === refEnums.Enums.AddressType.Destination.ID;
                })[0], billToAddress = $.grep(data.VendorBillAddress, function (e) {
                    return e.AddressType === refEnums.Enums.AddressType.BillTo.ID;
                })[0];

                //** flag to specify whether address fields are read only or not.? */
                //self.purchaseOrderAddressViewModel.isCallForEdit(true);
                // ###START: DE20724
                self.purchaseOrderAddressViewModel.canEdit(true);

                // ###END: DE20724
                self.purchaseOrderAddressViewModel.populateAddressByUser = false;
                if (data.ForeignBolCustomer != null) {
                    self.purchaseOrderAddressViewModel.populateShipperAddress(shipperAddress, data.ForeignBolCustomer.IsShipperMapped, data.ForeignBolCustomer.ShipperId, data.ForeignBolDetails.IsForeignBol, data.ForeignBolCustomer.CustomerId, data.VendorBill.VendorBillId);
                    self.purchaseOrderAddressViewModel.populateConsigneeAddress(consigneeAddress, data.ForeignBolCustomer.IsConsigneeMapped, data.ForeignBolCustomer.ConsigneeId, data.ForeignBolDetails.IsForeignBol, data.ForeignBolCustomer.CustomerId, data.VendorBill.VendorBillId);
                    self.purchaseOrderAddressViewModel.populateDefaultBillToAddress(billToAddress, data.ForeignBolCustomer.IsBillToMapped, data.ForeignBolCustomer.BillToAddress, data.ForeignBolDetails.IsForeignBol, data.ForeignBolCustomer.CustomerId, data.VendorBill.VendorBillId);
                } else if (data.ForeignBolDetails.IsForeignBol) {
                    self.purchaseOrderAddressViewModel.populateShipperAddress(shipperAddress, data.ForeignBolDetails.IsShipperAddressMapped, 0, data.ForeignBolDetails.IsForeignBol, data.ForeignBolDetails.CustomerId, data.VendorBill.VendorBillId);
                    self.purchaseOrderAddressViewModel.populateConsigneeAddress(consigneeAddress, data.ForeignBolDetails.IsConsigneeAddressMapped, 0, data.ForeignBolDetails.IsForeignBol, data.ForeignBolDetails.CustomerId, data.VendorBill.VendorBillId);
                    self.purchaseOrderAddressViewModel.populateDefaultBillToAddress(billToAddress, data.ForeignBolDetails.IsBillToAddressMapped, 0, data.ForeignBolDetails.IsForeignBol, data.ForeignBolDetails.CustomerId, data.VendorBill.VendorBillId);
                } else {
                    self.purchaseOrderAddressViewModel.populateShipperAddress(shipperAddress, false, 0, false, 0, data.VendorBill.VendorBillId);
                    self.purchaseOrderAddressViewModel.populateConsigneeAddress(consigneeAddress, false, 0, false, 0, data.VendorBill.VendorBillId);
                    self.purchaseOrderAddressViewModel.populateDefaultBillToAddress(billToAddress, false, 0, false, 0, data.VendorBill.VendorBillId);
                }
                self.purchaseOrderAddressViewModel.populateAddressByUser = true;

                if (shipperAddress !== undefined) {
                    self.OriginZip(shipperAddress.ZipCode);
                }

                //** set vendor bill id and pro number to purchase order */
                self.POHistoryViewModel.vendorBillId = vendorBillId;
                self.POHistoryViewModel.proNumber = bindedData.proNumber;

                if (data.VendorBill != null) {
                    self.purchaseOrderAddressViewModel.shouldBeReadOnly(data.VendorBill.IDBFlag);

                    //// using this for call PODDOC in popup of Agent Notefication
                    //var uploadFileDetails: ISalesOrderUploadFileModel = new refPodDocModel.Models.PurchaseOrderUploadFileModel();
                    //uploadFileDetails.CarrierId = self.purchaseOrderDetailsViewModel.vendorNameSearchList.ID();
                    //uploadFileDetails.ProNumber = self.purchaseOrderDetailsViewModel.proNumber();
                    //if (self.purchaseOrderDetailsViewModel.bolNumber() != '') {
                    //	uploadFileDetails.BolNumber = self.purchaseOrderDetailsViewModel.bolNumber();
                    //} else if (self.purchaseOrderDetailsViewModel.mainBolNumber() != '') {
                    //	uploadFileDetails.BolNumber = self.purchaseOrderDetailsViewModel.mainBolNumber();
                    //}
                    //uploadFileDetails.VendorBillId = self.purchaseOrderDetailsViewModel.vendorBillId();
                    //uploadFileDetails.CarrierName = self.purchaseOrderDetailsViewModel.vendorName();
                    //uploadFileDetails.OriginZip = self.OriginZip();
                    //uploadFileDetails.ServiceType = self.purchaseOrderDetailsViewModel.vendorNameSearchList.carrierType();
                    ////End
                    self.purchaseOrderDetailsViewModel.initializePurchaseOrderDetails(data.VendorBill, data.ForeignBolCustomerDetails, self.IsReadOnly, data.ForeignBolDetails);
                    self.purchaseOrderPOPViewModel.initializePOPFindMoreDetails(data.VendorBill);
                    self.purchaseOrderAddressViewModel.processDetails(data.VendorBill.ProcessDetails);
                }

                if (self.IsReadOnly) {
                    self.DisableAlltheControls();
                }

                self.ShowProgressBar(false);
                self.isChange(false);
                _app.trigger("IsBIDirtyChange", self.isChange(false));
                self.isNotAtLoadingTime = false;

                //To save date time in local storage
                self.setDateTimeOfReload();

                // Store in the local storage
                LocalStorageController.Set(vendorBillId + 'PO', data);
            }, faliureCallBack = function (message) {
                console.log(message);
                self.ShowProgressBar(false);
            };

            if (!LocalStorageController.Get(vendorBillId + 'PO')) {
                self.purchaseOrderClient.getPurchaseOrderDetailsByVendorBillId(vendorBillId, successCallBack, faliureCallBack);
            } else {
                successCallBack(LocalStorageController.Get(vendorBillId + 'PO'));
            }
            self.getReasonCodeList();
        };

        //	//self.getListOfUVBReasonCodes();
        //
        //}
        //To load POP Details
        PurchaseOrderEditDetails.prototype.getPOPData = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#popossibility').addClass('active in');
            $('#popossibilityLink').addClass('active in');

            self.purchaseOrderPOPViewModel.VendorBilId(self.purchaseOrderDetailsViewModel.vendorBillId());
            if (!$('#collapsePOPpossibility').hasClass('in')) {
                self.listProgressPOP(true);
                var successCallBack = function (data) {
                    var commonUtils = new Utils.Common();
                    self.purchaseOrderPOPViewModel.isDefaultResult(true);

                    // load Links details
                    self.purchaseOrderPOPViewModel.initializePOPDetails(data);

                    self.listProgressPOP(false);
                }, faliureCallBack = function () {
                    self.listProgressPOP(false);
                };
                self.purchaseOrderClient.getPOPDetails(self.purchaseOrderDetailsViewModel.vendorBillId(), successCallBack, faliureCallBack);
            }
        };

        //#endregion
        // To Clear the Local storage
        PurchaseOrderEditDetails.prototype.clearLocalStorage = function (targetId) {
            if (LocalStorageController.Get(targetId + 'PO')) {
                LocalStorageController.Set(targetId + 'PO', undefined);
            }
        };

        PurchaseOrderEditDetails.prototype.overFlowManage = function () {
            var self = this;
            if (self.isAccordion()) {
                if (!$('#collapseAddress').hasClass('in')) {
                    $('#collapseAddress').css("overflow", "hidden");
                } else {
                    $('#collapseAddress').css("overflow", "visible");
                }
            }
        };

        //#endregion
        //#region Life Cycle Event}
        //** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
        PurchaseOrderEditDetails.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //** The composition engine will execute it prior to calling the binder. */
        PurchaseOrderEditDetails.prototype.activate = function () {
            var self = this;

            //self.ShowProgressBar(true);
            return true;
        };

        //** Using for focus cursor on last cycle for focusing in vendor name
        PurchaseOrderEditDetails.prototype.compositionComplete = function () {
            var self = this;

            setTimeout(function () {
                $('.txtVendorName').focus();
            }, 500);

            _app.trigger("IsBIDirtyChange", false);

            if (self.IsReadOnly) {
                self.DisableAlltheControls();
            }

            //if data available in localStorage the we will bind that
            _app.trigger("loadMyData", function (data) {
                if (data) {
                    if (LocalStorageController.Get(data.vendorBillId + 'PO')) {
                        if (self.iscompositionCompleteCalled()) {
                            self.load(data);
                            self.iscompositionCompleteCalled(false);
                        } else {
                            self.purchaseOrderDetailsViewModel.count = 0;
                            self.purchaseOrderDetailsViewModel.openPOToSOCreation();
                        }
                    }
                } else {
                    _app.trigger("closeActiveTab");
                }
            });
        };

        //public loadViewAfterComposition() {
        //	var self = this;
        //	_app.trigger("loadMyData", data => {
        //		if (data) {
        //			self.load(data);
        //		} else {
        //			_app.trigger("closeActiveTab");
        //		}
        //	});
        //}
        //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
        PurchaseOrderEditDetails.prototype.beforeBind = function () {
            var self = this;
            self.ShowProgressBar(true);
            _app.trigger("loadMyData", function (data) {
                if (data) {
                    self.load(data);
                    //self.ShowProgressBar(false);
                } else {
                    _app.trigger("closeActiveTab");
                }
            });
        };

        //To Load History details
        PurchaseOrderEditDetails.prototype.getPurchaseOrderHistorydetails = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#history').addClass('active in');
            $('#historyLink').addClass('active in');

            if (!$('#collapseHistory').hasClass('in')) {
                self.POHistoryViewModel.historyPurchaseOrderContainer.listProgress(true);

                var successCallBack = function (data) {
                    var commonUtils = new Utils.Common();

                    // To load History Details
                    self.POHistoryViewModel.initializeHistoryDetails(data.VendorBillHeaderHistory);

                    self.POHistoryViewModel.historyPurchaseOrderContainer.listProgress(false);
                }, faliureCallBack = function () {
                    self.POHistoryViewModel.historyPurchaseOrderContainer.listProgress(false);
                };
                self.vendorBillClient.GetVendorBillHistoryByVendorBillId(self.purchaseOrderDetailsViewModel.vendorBillId(), successCallBack, faliureCallBack);
            }
        };

        PurchaseOrderEditDetails.prototype.loadPodDocDetails = function () {
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
            self.purchaseOrderPODDocViewModel.reportContainer.isAttachedToView(false);
            self.purchaseOrderPODDocViewModel.reportContainer.isAttachedToView(true);
        };

        PurchaseOrderEditDetails.prototype.callPodDocDetails = function () {
            var self = this;
            var data = new Array();
            var uploadFileDetails = new refPodDocModel.Models.PurchaseOrderUploadFileModel();
            uploadFileDetails.CarrierId = self.purchaseOrderDetailsViewModel.vendorNameSearchList.ID();
            uploadFileDetails.ProNumber = self.purchaseOrderDetailsViewModel.proNumber();
            if (self.purchaseOrderDetailsViewModel.bolNumber() != '') {
                uploadFileDetails.BolNumber = self.purchaseOrderDetailsViewModel.bolNumber();
            } else if (self.purchaseOrderDetailsViewModel.mainBolNumber() != '') {
                uploadFileDetails.BolNumber = self.purchaseOrderDetailsViewModel.mainBolNumber();
            }
            uploadFileDetails.VendorBillId = self.purchaseOrderDetailsViewModel.vendorBillId();
            uploadFileDetails.CarrierName = self.purchaseOrderDetailsViewModel.vendorName();
            uploadFileDetails.OriginZip = self.OriginZip();
            uploadFileDetails.ServiceType = self.purchaseOrderDetailsViewModel.vendorNameSearchList.carrierType();

            //** if there is no data is registered then make a server call. */
            var successCallBack = function (data) {
                self.purchaseOrderPODDocViewModel.purchaseOrderPodDocDetail.removeAll();
                self.purchaseOrderPODDocViewModel.reportContainer.listProgress(true);
                self.purchaseOrderPODDocViewModel.initializeSalesOrderPodDocDetails(data, self.purchaseOrderDetailsViewModel.proNumber(), self.purchaseOrderDetailsViewModel.vendorNameSearchList.ID(), self.purchaseOrderDetailsViewModel.bolNumber(), self.purchaseOrderDetailsViewModel.vendorBillId(), !self.IsReadOnly, self.purchaseOrderDetailsViewModel.vendorName(), self.OriginZip());
                self.purchaseOrderPODDocViewModel.reportContainer.listProgress(false);
            }, faliureCallBack = function (message) {
                console.log(message);
                self.purchaseOrderPODDocViewModel.reportContainer.listProgress(false);
            };
            self.purchaseOrderPODDocViewModel.reportContainer.listProgress(false);
            self.purchaseOrderClient.getPurchaseOrderPodDocDetails(uploadFileDetails, successCallBack, faliureCallBack);
        };

        PurchaseOrderEditDetails.prototype.CallChangeMadeFunctions = function () {
            var self = this;

            // for shipper address
            self.purchaseOrderAddressViewModel.onChangesMade = self.changesDetected;

            self.purchaseOrderAddressViewModel.shipperLocation.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
                self.purchaseOrderAddressViewModel.UnmapShipperAddressOnChangeDetect(dirty);
            };

            //for consignee address
            self.purchaseOrderAddressViewModel.consigneeLocation.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
                self.purchaseOrderAddressViewModel.UnmapConsigneeAddressOnChangeDetect(dirty);
            };

            // ###START: DE20533
            //for bill to address
            self.purchaseOrderAddressViewModel.billToLocation.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            // ###END: DE20533
            // For purchase order section
            self.purchaseOrderDetailsViewModel.onChangesMade = self.changesDetected;

            // for vendor name in purchase order section
            self.purchaseOrderDetailsViewModel.vendorNameSearchList.onChangesMade = self.changesDetected;

            //for buttons in vendor bill section
            self.purchaseOrderDetailsViewModel.obcvendorBillOptionList.onChangesMade = self.changesDetected;

            // for Vendor bill Notes section
            self.purchaseOrderNotesViewModel.onChangesMade = self.changesDetected;

            //for PO Reviewed Notes section
            self.PurchaseOrderReviewedNotes.onChangesMade = self.changesDetected;

            //for Items
            self.purchaseOrderItemViewModel.onChangesMade = self.changesDetected;
        };

        //Method to get the reason code list
        PurchaseOrderEditDetails.prototype.getReasonCodeList = function () {
            var self = this;
            var successCallBack = function (data) {
                if (data) {
                    self.reasonCodeList.removeAll();
                    self.reasonCodeList.push.apply(self.reasonCodeList, data);
                }
            }, failureCallBack = function () {
                console.log("Error while fetching the List of reason codes");
            };
            self.purchaseOrderClient.getReasonCodeList(successCallBack, failureCallBack);
        };

        //function to show popup
        PurchaseOrderEditDetails.prototype.showReasonPopup = function () {
            var self = this;

            //callback for on click of submit button on the popup
            var submitCallback = function (selectedReason, note) {
                var successCallBack = function (data) {
                    console.log("reason saved successfully");
                }, failurecallback = function () {
                };

                self.purchaseOrderClient.saveUVBReasonCodeForUVB(self.purchaseOrderDetailsViewModel.vendorBillId(), selectedReason, self.currentUser().GlobalOSUserId, note, successCallBack, failurecallback);
                self.finalSaveMethod();
            };

            //object to be passed to the popup
            var optionControlArgs = {
                options: undefined,
                message: '',
                title: 'Confirmation',
                bindingObject: { reasons: self.reasonCodeList, callback: submitCallback }
            };
            _app.showDialog('purchaseOrder/PurchaseOrderReasonView', optionControlArgs);
        };

        /*
        ** <createDetails>
        ** <id>US24389</id> <by>Shreesha Adiga</by> <date>31-08-2016</date> <description>Populate Items dropdown and reload the items tab</description>
        ** </createDetails>
        */
        PurchaseOrderEditDetails.prototype.reloadItemsOnTruckloadCheckboxChange = function (type) {
            var self = this;

            var purchaseOrderItems = self.getPurchaseOrderItemsDetails();
            self.purchaseOrderItemViewModel.populateShipmentItemsDropdown(typeof type !== 'undefined' ? type : '');
            self.purchaseOrderItemViewModel.initializePurchaseOrderItemDetails(purchaseOrderItems);

            // ##START: US24671
            self.purchaseOrderItemViewModel.updateTotalCostAndWeight();
            self.purchaseOrderItemViewModel.validateItems();
            // ##END: US24671
        };

        PurchaseOrderEditDetails.prototype.cleanup = function () {
            var self = this;

            self.purchaseOrderDetailsViewModel.cleanup();
            self.purchaseOrderAddressViewModel.cleanup();
            self.purchaseOrderItemViewModel.cleanup();
            self.purchaseOrderNotesViewModel.cleanup();
            self.POHistoryViewModel.cleanUp();
            self.purchaseOrderPOPViewModel.cleanup();
            self.purchaseOrderPODDocViewModel.cleanup();

            for (var prop in self) {
                delete self[prop];
            }
        };
        return PurchaseOrderEditDetails;
    })();
    exports.PurchaseOrderEditDetails = PurchaseOrderEditDetails;
});
