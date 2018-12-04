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
/// <reference path="../services/models/TypeDefs/vendorBillModels.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'purchaseOrder/PurchaseOrderAddressView', 'purchaseOrder/PurchaseOrderItemView', 'purchaseOrder/PurchaseOrderDetailsView', 'purchaseOrder/PurchaseOrderNotesView', 'purchaseOrder/PurchaseOrderPOPpossibility', 'services/client/VendorBillClient', 'services/client/PurchaseOrderClient', 'services/models/vendorBill/VendorBill', 'services/models/vendorBill/VendorBillItemDetails', 'services/models/vendorBill/VendorBillContainer', 'services/models/vendorBill/VendorBillAddress', 'services/models/vendorBill/VendorBillNote', 'services/models/common/Enums', 'templates/saveStatusIndicatorControl', 'purchaseOrder/PurchaseOrderHistory'], function(require, exports, ___router__, ___app__, ___refPurchaseOrderAddress__, ___refPurchaseOrderItem__, ___refPurchaseOrderDetails__, ___refPurchaseOrderNotes__, ___refPurchaseOrderPOP__, __refvendorBillClient__, __refpurchaseOrderClient__, ___refpurchaseOrderModel__, ___refpurchaseOrderItemModel__, ___refpurchaseOrderContainerModel__, ___refpurchaseOrderAddressModel__, ___refpurchaseOrderNotesModel__, __refEnums__, __refsaveStatusIndicatorControl__, ___refVendorPOHistory__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var _refPurchaseOrderAddress = ___refPurchaseOrderAddress__;
    var _refPurchaseOrderItem = ___refPurchaseOrderItem__;
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
    
    var refEnums = __refEnums__;
    
    var refsaveStatusIndicatorControl = __refsaveStatusIndicatorControl__;
    var _refVendorPOHistory = ___refVendorPOHistory__;

    //#endregion
    /*
    ** <summary>
    ** Purchase Order Edit Details View Model.
    ** </summary>
    ** <createDetails>
    ** <by>Chandan</by> <date>07-14-2014</date>
    ** </createDetails>}
    */
    var PurchaseOrderEditDetails = (function () {
        //#endregion
        //#region Constructor
        function PurchaseOrderEditDetails() {
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
            this.isNotAtLoadingTime = false;
            // for validation
            this.isValidPurchaseOrderDetails = false;
            this.isValidAddress = false;
            this.isValidItems = false;
            // get the Utils class object
            this.commonUtils = new Utils.Common();
            var self = this;

            self.onSwitch = function () {
                _router.navigate("#/PurchaseOrderDetails");
            };

            //Call to populate Shipper and consignee Address
            self.purchaseOrderDetailsViewModel = new _refPurchaseOrderDetails.PurchaseOrderDetailsViewModel(function (shipperAddress) {
                self.purchaseOrderAddressViewModel.populateShipperAddress(shipperAddress);
            }, function (consigneeAddress) {
                self.purchaseOrderAddressViewModel.populateConsigneeAddress(consigneeAddress);
            }, //Call back to expand either items or Address when user press 'TAB' form last field.
            function () {
                self.expandView('collapseAddress');
                $('#internationalShipmentButton').focus();
            });

            self.purchaseOrderItemViewModel = new _refPurchaseOrderItem.PurchaseOrderItemViewModel(function (totalCost, totalWeght, totalPices) {
                self.purchaseOrderDetailsViewModel.totalWeigth(totalWeght);
                self.purchaseOrderDetailsViewModel.totalPieces(totalPices);
                self.purchaseOrderDetailsViewModel.purchaseOrderAmount(totalCost);
            }, function () {
            });

            self.purchaseOrderAddressViewModel = new _refPurchaseOrderAddress.PurchaseOrderAddressViewModel(function (originZip, destinationZip) {
                self.purchaseOrderDetailsViewModel.originZip(originZip);
                self.purchaseOrderDetailsViewModel.destinationZip(destinationZip);
            }, //Call back to expand either items or Address when user press 'TAB' form reference number.
            function () {
                //if BOL number is exists then expand items;
                self.expandView('collapseItems');
                $('#drpItems').focus();
            });
            self.purchaseOrderNotesViewModel = new _refPurchaseOrderNotes.PurchaseOrderNotesViewModel();
            self.purchaseOrderItemViewModel.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            self.purchaseOrderPOPViewModel = new _refPurchaseOrderPOP.PurchaseOrderPoPossibilityViewModel(function (bolNumber) {
            });

            if (!self.currentUser()) {
                // Get the logged in user for name for new note}
                _app.trigger("GetCurrentUserDetails", function (currentUser) {
                    self.currentUser(currentUser);
                });
            }

            self.POHistoryViewModel = new _refVendorPOHistory.PurchaseOrderHistoryViewModel();

            //#region Call change functions
            // for address
            self.purchaseOrderAddressViewModel.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            // for shipper address
            self.purchaseOrderAddressViewModel.shipperLocation.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            //for consignee address
            self.purchaseOrderAddressViewModel.consigneeLocation.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            // For purchase order section
            self.purchaseOrderDetailsViewModel.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            // for vendor name in purchase order section
            self.purchaseOrderDetailsViewModel.vendorNameSearchList.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            //for buttons in vendor bill section
            self.purchaseOrderDetailsViewModel.obcvendorBillOptionList.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            // for Vendor bill Notes section
            self.purchaseOrderNotesViewModel.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            //## Expands all the accordions in one click
            self.expandAllAccordions = function () {
                //self.expandView('collapsePurchaseOrder');
                self.expandView('collapseAddress');
                self.expandView('collapseItems');
                self.expandView('collapseNotes');
                self.expandView('collapsePOPpossibility');
                self.expandView('collapseHistory');
                self.expandSourceImage('Content/images/expand_hit.png');
                self.collapseSourceImage('Content/images/collapse.png');
            };

            //## Collapse all the accordions in one click
            self.collapseAllAccordions = function () {
                //self.collapseView('collapsePurchaseOrder');
                self.collapseView('collapseAddress');
                self.collapseView('collapseItems');
                self.collapseView('collapseNotes');
                self.collapseView('collapsePOPpossibility');
                self.collapseView('collapseHistory');
                self.collapseSourceImage('Content/images/collapse_hit.png');
                self.expandSourceImage('Content/images/expand.png');
            };

            //#endregion
            return self;
        }
        //#endregion
        //#region Internal Methods
        //#region Save
        //// For Validating
        PurchaseOrderEditDetails.prototype.onSave = function () {
            var self = this;

            // Show all the validation as once (All section validation)
            var isPurchaseOrderDetailsValid = self.purchaseOrderDetailsViewModel.validatePurchaseOrderDetails(), isPurchaseOrderAddressesValid = self.purchaseOrderAddressViewModel.validateAddresses(), isVendorItemValid = self.purchaseOrderItemViewModel.validateItems();

            if ($('#collapseNotes').hasClass('in')) {
                $('#collapseNotes').collapse('toggle');
                $('#AchorcollapseNotes').addClass('collapsed');
            }

            if (isPurchaseOrderAddressesValid) {
                $('#collapseAddress').collapse('show');
                $('#AchorcollapseAddress').removeClass('collapsed');
                self.isValidAddress = false;
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

            if (!(!isPurchaseOrderDetailsValid && self.isValidAddress && self.isValidItems)) {
                return;
            } else {
                self.savepurchaseOrder();
                self.saveStatusIndicatorControl.applySettings(refEnums.Enums.SavingStatus.ChangesSaved.ID);
                self.isChange(false);

                //window.ischange = false;
                _app.trigger("IsBIDirtyChange", self.isChange());
            }
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
            var purchaseOrderData = new _refpurchaseOrderContainerModel.Models.VendorBillContainer();
            self.listProgress(true);
            purchaseOrderData.VendorBill = self.getPurchaseOrderDetails();
            purchaseOrderData.VendorBillAddress = self.getPurchaseOrderAddress();
            purchaseOrderData.VendorBillItemsDetail = self.getPurchaseOrderItemsDetails();
            purchaseOrderData.VendorBillNotes = self.getpurchaseOrderNotes();

            self.vendorBillClient.SaveVendorBillDetail(purchaseOrderData, function (message) {
                // Saving successful callback
                self.listProgress(false);
                _app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: ApplicationMessages.Messages.POSavedSuccessfullyMessage }, 'slideDown');
                _app.trigger('closeActiveTab');
                _app.trigger("openPurchaseOrder", message, self.purchaseOrderDetailsViewModel.proNumber(), function (callback) {
                    if (!callback) {
                        return;
                    }
                });
            }, function (message) {
                // Saving failed call back
                self.listProgress(false);
                _app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: message }, 'slideDown');
            });
        };

        //// Gets the vendor bill details
        PurchaseOrderEditDetails.prototype.getPurchaseOrderDetails = function () {
            var self = this;

            var purchaseOrderDetails = new _refpurchaseOrderModel.Models.VendorBill();

            // For new vendor bill bill id should be 0 and the bill status will be pending (0)
            purchaseOrderDetails.VendorBillId = self.purchaseOrderDetailsViewModel.vendorBillId();
            purchaseOrderDetails.CarrierId = self.purchaseOrderDetailsViewModel.vendorId();
            purchaseOrderDetails.Amount = self.purchaseOrderDetailsViewModel.purchaseOrderAmount();
            purchaseOrderDetails.BillDate = self.purchaseOrderDetailsViewModel.billDate();
            purchaseOrderDetails.BolNumber = self.purchaseOrderDetailsViewModel.bolNumber();
            purchaseOrderDetails.DestinationZip = self.purchaseOrderDetailsViewModel.destinationZip();
            purchaseOrderDetails.MainVendorBolNumber = self.purchaseOrderDetailsViewModel.bolNumber();
            purchaseOrderDetails.ProNumber = self.purchaseOrderDetailsViewModel.proNumber();
            purchaseOrderDetails.SalesOrderId = self.purchaseOrderDetailsViewModel.salesOrderId;
            purchaseOrderDetails.IsPurchaseOrder = self.isPoWithBol;
            purchaseOrderDetails.UpdatePRONumberInShipment = self.isUpdateProNo;
            purchaseOrderDetails.ProcessDetails = self.purchaseOrderAddressViewModel.processDetails();
            purchaseOrderDetails.OriginalBOLNumber = self.purchaseOrderDetailsViewModel.originalBolNumber;

            var selecetedList = self.purchaseOrderDetailsViewModel.obcvendorBillOptionList.getSelectedOptions(true);

            var isForceAttachOptionSelecteed = false;
            var isMakeInactiveSelecteed = false;

            selecetedList.forEach(function (item) {
                if (item.id === refEnums.Enums.vendorBillOptionConstant.FroceAttach) {
                    isForceAttachOptionSelecteed = true;
                } else if (item.id === refEnums.Enums.vendorBillOptionConstant.MakeInactive) {
                    isMakeInactiveSelecteed = true;
                }
            });

            purchaseOrderDetails.ForceAttach = isForceAttachOptionSelecteed || self.canForceAttach;
            purchaseOrderDetails.MakeInactive = isMakeInactiveSelecteed;
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
            purchaseOrderShipperAddress.State = self.purchaseOrderAddressViewModel.shipperLocation.location().State;
            purchaseOrderShipperAddress.ZipCode = self.purchaseOrderAddressViewModel.shipperLocation.location().Zip;
            purchaseOrderShipperAddress.Phone = self.purchaseOrderAddressViewModel.shipperPhone();
            purchaseOrderShipperAddress.Fax = self.purchaseOrderAddressViewModel.shipperFax();
            purchaseOrderShipperAddress.Country = self.purchaseOrderAddressViewModel.isInternationalShipmentSelected() ? self.purchaseOrderAddressViewModel.selectedShipperCountryCode() : 1;
            purchaseOrderShipperAddress.AddressType = 1;

            // Create consignee address model
            purchaseOrderConsigneeAddress.Id = self.purchaseOrderAddressViewModel.consigneeAddressId();
            purchaseOrderConsigneeAddress.VendorBillId = self.purchaseOrderDetailsViewModel.vendorBillId();
            purchaseOrderConsigneeAddress.Street = self.purchaseOrderAddressViewModel.consigneeAddress1();
            purchaseOrderConsigneeAddress.Street2 = self.purchaseOrderAddressViewModel.consigneeAddress2();
            purchaseOrderConsigneeAddress.CompanyName = self.purchaseOrderAddressViewModel.consigneeCompanyName();
            purchaseOrderConsigneeAddress.ContactPerson = self.purchaseOrderAddressViewModel.consigneeContactPerson();
            purchaseOrderConsigneeAddress.City = self.purchaseOrderAddressViewModel.consigneeLocation.location().City;
            purchaseOrderConsigneeAddress.State = self.purchaseOrderAddressViewModel.consigneeLocation.location().State;
            purchaseOrderConsigneeAddress.ZipCode = self.purchaseOrderAddressViewModel.consigneeLocation.location().Zip;
            purchaseOrderConsigneeAddress.Phone = self.purchaseOrderAddressViewModel.consigneePhone();
            purchaseOrderConsigneeAddress.Fax = self.purchaseOrderAddressViewModel.consigneeFax();
            purchaseOrderConsigneeAddress.Country = self.purchaseOrderAddressViewModel.isInternationalShipmentSelected() ? self.purchaseOrderAddressViewModel.selectedConsigneeCountryCode() : 1;
            purchaseOrderConsigneeAddress.AddressType = 2;

            // Create Bill To address model
            purchaseOrderBillToAddress.Id = self.purchaseOrderAddressViewModel.billToAddressId();
            purchaseOrderBillToAddress.VendorBillId = self.purchaseOrderDetailsViewModel.vendorBillId();
            purchaseOrderBillToAddress.Street = self.purchaseOrderAddressViewModel.billToAddress1();
            purchaseOrderBillToAddress.Street2 = self.purchaseOrderAddressViewModel.billToAddress2();
            purchaseOrderBillToAddress.CompanyName = self.purchaseOrderAddressViewModel.billToCompanyName();
            purchaseOrderBillToAddress.City = self.purchaseOrderAddressViewModel.billToLocation.location().City;
            purchaseOrderBillToAddress.State = self.purchaseOrderAddressViewModel.billToLocation.location().State;
            purchaseOrderBillToAddress.ZipCode = self.purchaseOrderAddressViewModel.billToLocation.location().Zip;
            purchaseOrderBillToAddress.Phone = self.purchaseOrderAddressViewModel.billToPhone();
            purchaseOrderBillToAddress.Fax = self.purchaseOrderAddressViewModel.billToFax();
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

        //// Checks the force attach options and gets the user input
        //// And then calls the save service
        PurchaseOrderEditDetails.prototype.checkForceAttachOptions = function () {
            var self = this;
            if (self.commonUtils.isNullOrEmptyOrWhiteSpaces(self.purchaseOrderDetailsViewModel.bolNumber())) {
                if (self.purchaseOrderDetailsViewModel.listCheck != null && self.purchaseOrderDetailsViewModel.listCheck()[1] === false) {
                    var varMsgBox = [
                        {
                            id: 0,
                            name: 'Yes',
                            callback: function () {
                                self.isPoWithBol = true;

                                // Call next validation
                                self.validateProNumber();
                                return true;
                            }
                        },
                        {
                            id: 1,
                            name: 'No',
                            callback: function () {
                                self.isPoWithBol = false;
                                return true;
                            }
                        }
                    ];

                    ////initialize message box control arguments
                    var optionControlArgs = {
                        options: varMsgBox,
                        message: ApplicationMessages.Messages.BOLValidationMessage,
                        title: ApplicationMessages.Messages.ApplicationMessageTitle
                    };

                    //Call the dialog Box functionality to open a Popup
                    _app.showDialog('templates/messageBox', optionControlArgs, 'slideDown');
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

            return itemNote;
        };

        //#endregion Internal Methods
        //#region Validation
        //To Validated Vendor Bill
        PurchaseOrderEditDetails.prototype.validatePurchaseOrder = function () {
            var self = this;

            if (self.commonUtils.isNullOrEmptyOrWhiteSpaces(self.purchaseOrderDetailsViewModel.bolNumber())) {
                if (self.purchaseOrderDetailsViewModel.bolNumber().indexOf(' ') > 0) {
                    self.isSubBill = true;
                }
            }

            if (self.purchaseOrderDetailsViewModel.listCheck != null && self.purchaseOrderDetailsViewModel.listCheck()[0] === true) {
                _app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: ApplicationMessages.Messages.PROAlreadyExists }, 'slideDown');
                return false;
            }

            if (self.purchaseOrderDetailsViewModel.purchaseOrderAmount() < 0) {
                _app.showDialog('templates/messageBox', { title: ApplicationMessages.Messages.ApplicationMessageTitle, message: ApplicationMessages.Messages.BillAmountShouldNotbeNegative }, 'slideDown');
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
                self.showConfirmationMessage(ApplicationMessages.Messages.VendorBillNotesValidationMessage, ApplicationMessages.Messages.ApplicationMessageTitle, "Yes", "No", function () {
                    self.checkForceAttachOptions();
                    return true;
                }, function () {
                    return true;
                });
            } else {
                self.checkForceAttachOptions();
            }
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

            var varMsgBox = [
                {
                    id: 0,
                    name: 'Yes',
                    callback: function () {
                        //Yes Logic
                        self.canForceAttach = true;

                        self.purchaseOrderDetailsViewModel.obcvendorBillOptionList.getOptionsById(2).selected(true);
                        if (existingProNo.toString() != "" && !self.isSubBill) {
                            self.matchingSalesMsg(existingProNo);
                        } else {
                            self.setUpModelAndSave();
                        }
                        return true;
                    }
                },
                {
                    id: 1,
                    name: 'No',
                    callback: function () {
                        self.canForceAttach = false;
                        self.setUpModelAndSave();
                        return true;
                    }
                }
            ];

            ////initialize message box control arguments
            var optionControlArgs = {
                options: varMsgBox,
                message: ApplicationMessages.Messages.PROValidationMessage,
                title: ApplicationMessages.Messages.ApplicationMessageTitle
            };

            //Call the dialog Box functionality to open a Popup
            _app.showDialog('templates/messageBox', optionControlArgs, 'slideDown');
        };

        //// If PRO does not matches then ask to user weather he wants to update that PRO in order or not
        PurchaseOrderEditDetails.prototype.matchingSalesMsg = function (existingProNo) {
            var self = this;
            var varMsgBox = [
                {
                    id: 0,
                    name: 'Yes',
                    callback: function () {
                        //Yes Logic
                        self.canForceAttach = true;
                        self.isUpdateProNo = true;
                        self.setUpModelAndSave();
                        return true;
                    }
                },
                {
                    id: 1,
                    name: 'No',
                    callback: function () {
                        self.canForceAttach = false;
                        self.setUpModelAndSave();
                        return true;
                    }
                }
            ];

            //initialize message box control arguments
            var optionControlArgs = {
                options: varMsgBox,
                message: ApplicationMessages.Messages.ForceAttachInputeMessage + existingProNo.toString() + "\n Vendor Bill PRO# :" + self.purchaseOrderDetailsViewModel.proNumber(),
                title: ApplicationMessages.Messages.ApplicationMessageTitle
            };

            //Call the dialog Box functionality to open a Popup
            _app.showDialog('templates/messageBox', optionControlArgs, 'slideDown');
        };

        //#endregion
        //#region Handles the click event of the Address accordion
        PurchaseOrderEditDetails.prototype.onAddressClick = function () {
            $("#shipperCompanyName").focus();
        };

        // Sets the notes section focus
        PurchaseOrderEditDetails.prototype.onNotesClick = function () {
            $("#txtuserNote").focus();
        };

        // Handles the Item accordion click
        PurchaseOrderEditDetails.prototype.onItemClick = function () {
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
        };

        //#endregion
        //#region Load Data
        PurchaseOrderEditDetails.prototype.load = function (bindedData) {
            if (!bindedData)
                return;
            var self = this;
            self.listProgress(true);
            var vendorBillId = bindedData.vendorBillId, successCallBack = function (data) {
                self.isNotAtLoadingTime = true;

                // load notes details
                self.purchaseOrderNotesViewModel.initializePurchaseOrderNotes(data.VendorBillNotes);

                // load item details
                self.purchaseOrderItemViewModel.initializePurchaseOrderItemDetails(data.VendorBillItemsDetail);

                // load address details
                var shipperAddress = $.grep(data.VendorBillAddress, function (e) {
                    return e.AddressType === refEnums.Enums.AddressType.Origin.ID;
                })[0], consigneeAddress = $.grep(data.VendorBillAddress, function (e) {
                    return e.AddressType === refEnums.Enums.AddressType.Destination.ID;
                })[0];

                //** flag to specify whether address fields are read only or not.? */
                self.purchaseOrderAddressViewModel.shouldBeReadOnly(data.VendorBill.IDBFlag);
                self.purchaseOrderAddressViewModel.isCallForEdit(true);
                self.purchaseOrderAddressViewModel.populateAddressByUser = false;
                self.purchaseOrderAddressViewModel.populateShipperAddress(shipperAddress);
                self.purchaseOrderAddressViewModel.populateConsigneeAddress(consigneeAddress);
                self.purchaseOrderAddressViewModel.processDetails(data.VendorBill.ProcessDetails);
                self.purchaseOrderAddressViewModel.populateAddressByUser = true;

                //** set vendor bill id and pro number to purchase order */
                self.POHistoryViewModel.vendorBillId = vendorBillId;
                self.POHistoryViewModel.proNumber = bindedData.proNumber;

                // load vendor bill details
                self.purchaseOrderDetailsViewModel.initializePurchaseOrderDetails(data.VendorBill);

                self.listProgress(false);
                self.isChange(false);
                _app.trigger("IsBIDirtyChange", self.isChange());
                self.isNotAtLoadingTime = false;
            }, faliureCallBack = function (message) {
                console.log(message);
                self.listProgress(false);
            };

            self.purchaseOrderClient.getPurchaseOrderDetailsByVendorBillId(vendorBillId, successCallBack, faliureCallBack);
        };

        //To load POP Details
        PurchaseOrderEditDetails.prototype.getPOPData = function () {
            var self = this;
            if (!$('#collapseLinks').hasClass('in')) {
                self.listProgressPOP(true);
                var successCallBack = function (data) {
                    var commonUtils = new Utils.Common();

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
        //#endregion
        //#region Life Cycle Event}
        //** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
        PurchaseOrderEditDetails.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //** The composition engine will execute it prior to calling the binder. */
        PurchaseOrderEditDetails.prototype.activate = function () {
            return true;
        };

        //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
        PurchaseOrderEditDetails.prototype.beforeBind = function () {
            var self = this;
            _app.trigger("loadMyData", function (data) {
                if (data) {
                    self.load(data);
                } else {
                    _app.trigger("closeActiveTab");
                    _app.trigger("NavigateTo", 'Home');
                }
            });
        };

        //To Load History details
        PurchaseOrderEditDetails.prototype.getPurchaseOrderHistorydetails = function () {
            var self = this;
            if (!$('#collapseHistory').hasClass('in')) {
                self.listProgressHistory(true);
                var successCallBack = function (data) {
                    var commonUtils = new Utils.Common();

                    // To load History Details
                    self.POHistoryViewModel.initializeHistoryDetails(data.VendorBillHeaderHistory);

                    self.listProgressHistory(false);
                }, faliureCallBack = function () {
                    self.listProgressHistory(false);
                };
                self.vendorBillClient.GetVendorBillHistoryDetailsByVendorBillId(self.purchaseOrderDetailsViewModel.vendorBillId(), successCallBack, faliureCallBack);
            }
        };

        // Enables or disables the save button and also makes the window as dirty flag
        PurchaseOrderEditDetails.prototype.changesDetected = function (dirty) {
            var self = this;

            if (self.isNotAtLoadingTime === false) {
                if (dirty || self.purchaseOrderNotesViewModel.ischange() || self.purchaseOrderNotesViewModel.returnValue() || self.purchaseOrderAddressViewModel.shipperLocation.returnValue || self.purchaseOrderAddressViewModel.consigneeLocation.returnValue || self.purchaseOrderAddressViewModel.returnValue || self.purchaseOrderDetailsViewModel.vendorNameSearchList.returnValue || self.purchaseOrderDetailsViewModel.returnValueFlag || self.purchaseOrderDetailsViewModel.obcvendorBillOptionList.ischange() || self.purchaseOrderItemViewModel.returnValue()) {
                    self.isChange(true);
                    //window.ischange = true;
                } else {
                    self.isChange(false);
                    //window.ischange = false;
                }
                _app.trigger("IsBIDirtyChange", self.isChange());
            }
            //#endregion
        };
        return PurchaseOrderEditDetails;
    })();
    exports.PurchaseOrderEditDetails = PurchaseOrderEditDetails;

    return PurchaseOrderEditDetails;
});
