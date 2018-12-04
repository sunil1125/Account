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
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/models/vendorBill/VendorBillItemDetails', 'services/models/vendorBill/VendorBillContainer', 'services/client/VendorBillClient', 'services/models/common/Enums'], function(require, exports, ___router__, ___app__, ___refVendorBillItemModel__, ___refVendorBillContainerModel__, __refVendorBillClient__, __refEnums__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    var _refVendorBillItemModel = ___refVendorBillItemModel__;
    var _refVendorBillContainerModel = ___refVendorBillContainerModel__;
    var refVendorBillClient = __refVendorBillClient__;
    var refEnums = __refEnums__;

    //#endregion
    /*
    ** <summary>
    ** Vendor Bill Dispute Losts View Model.
    ** </summary>
    ** <createDetails>
    ** <id></id> <by>Satish</by> <date>27th May, 2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US9669</id> <by>Achal Rastogi</by> <date>6-3-2014</date>
    ** <id>US21132</id> <by>Shreesha Adiga</by> <date>26-04-2016</date><description>Changes related to showing the dispute lost popup from sales order; Showing "Create Lost Bill" toastr after save</description>
    ** <id>US21132</id> <by>Shreesha Adiga</by> <date>12-05-2016</date><description>Changed the message shown on toastr</description>
    ** <id>DE22980</id> <by>Janakiram</by> <date>24-06-2016</date><description>Validating Dispute lost amount if entered other than nuumerics</description>
    ** </changeHistory>
    */
    var VendorBillDisputeLost = (function () {
        // #END: US21132
        //#region Constructor
        function VendorBillDisputeLost() {
            var _this = this;
            this.vendorBillClient = new refVendorBillClient.VendorBillClient();
            this.vendorBillItemsList = ko.observableArray([]);
            this.proNumber = ko.observable('');
            this.totalDisputeLostShouldNotBeZero = ko.observable('');
            this.isSaveEnable = ko.observable(true);
            this.listProgress = ko.observable(false);
            this.isYesClickedOnToastr = false;
            var self = this;

            // ##START: US21132
            // this will be called when the user clicks ON the toastr. (Including the action buttons)
            self.onClickToastr = function () {
                var self = _this;

                // if yes is clicked then only clear the local storage and don't call before bind.
                self.saveCallback(!self.isYesClickedOnToastr);
                self.closePopup(self);
            };

            // (US21132) On click of yes on the toastr
            self.onClickYesToastr = function () {
                var self = _this;

                self.isYesClickedOnToastr = true;

                var vendorBillId = self.vendorBillId;
                var proNumber = self.getTheNexProNumberForLostBill();

                _app.trigger("openVendorBill", vendorBillId, proNumber, function (callback) {
                    if (!callback) {
                        return;
                    }
                }, false, false, true);

                self.saveCallback();
            };

            // (US21132) on click of no on toastr
            self.onClickNoToastr = function () {
                var self = _this;

                self.isYesClickedOnToastr = false;
                self.saveCallback();
                self.showSavedSuccesfullyToastr();
            };

            // ##END: US21132
            //set the flag allow decimal: true to accepts decimals
            self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(true) };

            self.totalCost = ko.computed(function () {
                var totalCost = 0;

                if (self.vendorBillItemsList()) {
                    self.vendorBillItemsList().forEach(function (item) {
                        totalCost += parseFloat(item.cost());
                    });
                }

                return totalCost.toFixed(2);
            });

            self.totalDispute = ko.computed(function () {
                var totalCost = 0;

                if (self.vendorBillItemsList()) {
                    self.vendorBillItemsList().forEach(function (item) {
                        totalCost += parseFloat(item.disputeAmount());
                    });
                }

                return totalCost.toFixed(2);
            });

            self.totalDisputeLost = ko.computed(function () {
                var totalCost = 0;

                if (self.vendorBillItemsList()) {
                    self.vendorBillItemsList().forEach(function (item) {
                        // ##START: US21132
                        totalCost += item.disputeLostAmount().toString() == "" ? 0 : parseFloat(item.disputeLostAmount().toString());
                        // ##END: US21132
                    });
                }

                return totalCost.toFixed(2);
            });

            self.isValidateAllDisputZero = ko.computed(function () {
                if (self.totalDisputeLost() === '0.00') {
                    self.totalDisputeLostShouldNotBeZero('Total Dispute Lost Amount should be greater then Zero.');
                    return true;
                } else {
                    return false;
                }
            });
        }
        //#endregion
        //#region Public Methods
        // ##START: US21132
        // on click of the save on the popup
        VendorBillDisputeLost.prototype.onSave = function () {
            var self = this;

            if (!self.validateItems()) {
                self.listProgress(true);
                var vendorBillData = new _refVendorBillContainerModel.Models.VendorBillContainer();

                vendorBillData.VendorBillItemsDetail = self.getVendorBillItemsDetails();

                var successCallBack = function () {
                    self.isSaveEnable(true);

                    if (!self.hasLostBill) {
                        self.showLostBillCreationToastr();
                    } else {
                        if (self.saveCallback && typeof self.saveCallback === "function") {
                            self.saveCallback();
                        }

                        self.closePopup(self);
                        self.showSavedSuccesfullyToastr();
                    }
                }, faliureCallBack = function (message) {
                    self.isSaveEnable(false);
                    self.listProgress(false);
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
                };

                self.isSaveEnable(false);

                //successCallBack(); //REMOVE THIS AFTERWARDS
                self.vendorBillClient.saveVendorBillDisputeLostItems(vendorBillData, successCallBack, faliureCallBack);
                //self.listProgress(false);
            }
        };

        // on click of close on the popup
        VendorBillDisputeLost.prototype.onClose = function (dialogResult) {
            var self = this;

            self.closePopup(dialogResult);
            self.cancelCallback();
        };

        // ##END: US21132
        // Checks validation in all the items
        VendorBillDisputeLost.prototype.validateItems = function () {
            var self = this;
            var isInvalid = false;
            self.vendorBillItemsList().forEach(function (item) {
                if (self.isValidateAllDisputZero()) {
                    isInvalid = true;
                } else {
                    if (item.checkValidation()) {
                        isInvalid = true;
                    }
                }
            });

            return isInvalid;
        };

        VendorBillDisputeLost.prototype.initializeItemsDetails = function (data) {
            var self = this;

            if (data) {
                data.forEach(function (item) {
                    self.vendorBillItemsList.push(new VendorBillItemsModel(item.ItemName, item.Cost, item.UserDescription, item.DisputeAmount, item.DisputeLostAmount, item.Id));
                });
            }
        };

        VendorBillDisputeLost.prototype.load = function () {
            var _this = this;
            var self = this;

            // ##START: US21132
            self.listProgress(true);

            var successCallBack = function (data) {
                // To load items in UI Details
                _this.initializeItemsDetails(data);
                self.listProgress(false);
            }, faliureCallBack = function () {
                self.listProgress(false);
            };

            // ##END: US21132
            self.vendorBillClient.getvendorBillItems(self.vendorBillId, successCallBack, faliureCallBack);
        };

        // ##START: US21132
        // (US21132) method to show the toastr whether lost bill should be created
        VendorBillDisputeLost.prototype.showLostBillCreationToastr = function () {
            var self = this;

            var disputeLostAmount = self.getTotalDisputeLostAmount();

            if (typeof disputeLostAmount !== "undefined" && !isNaN(disputeLostAmount) && disputeLostAmount !== 0) {
                var actionButtons = [];
                actionButtons.push({
                    actionButtonName: "Yes",
                    actionClick: self.onClickYesToastr
                });

                actionButtons.push({
                    actionButtonName: "No",
                    actionClick: self.onClickNoToastr
                });

                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 0,
                    fadeOut: 0,
                    typeOfAlert: "",
                    title: "",
                    actionButtons: actionButtons
                };

                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.DoYouWantToCreateLostBill, "warning", self.onClickToastr, toastrOptions);
            }
        };

        // (US21132) method to show the vendor bill saved successfully toastr
        VendorBillDisputeLost.prototype.showSavedSuccesfullyToastr = function () {
            var toastrOptions = {
                toastrPositionClass: "toast-top-middle",
                delayInseconds: 10,
                fadeOut: 10,
                typeOfAlert: "",
                title: ""
            };

            Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SavedSuccessfullyMessage, "success", null, toastrOptions);
        };

        // ##END: US21132
        //#endregion
        //#region Private Methods
        // Gets the vendor bill Item details
        VendorBillDisputeLost.prototype.getVendorBillItemsDetails = function () {
            var self = this;

            var vendorBillItems;
            vendorBillItems = ko.observableArray([])();

            self.vendorBillItemsList().forEach(function (item) {
                var vendorBillItem = new _refVendorBillItemModel.Models.VendorBillItemDetails();
                vendorBillItem.Id = item.id();
                vendorBillItem.VendorBillId = self.vendorBillId;
                vendorBillItem.DisputeLostAmount = item.disputeLostAmount();

                vendorBillItems.push(vendorBillItem);
            });

            return vendorBillItems;
        };

        // get the total lost amount to show on the toastr
        VendorBillDisputeLost.prototype.getTotalDisputeLostAmount = function () {
            var self = this;
            var vbTotalDisputeLostAmount = 0;
            self.vendorBillItemsList().forEach(function (item) {
                vbTotalDisputeLostAmount += parseFloat(item.disputeLostAmount().toString());
            });

            return vbTotalDisputeLostAmount;
        };

        // to get the next pro number for lost bill
        VendorBillDisputeLost.prototype.getTheNexProNumberForLostBill = function () {
            var self = this, proNumber = self.proNumberOfMainBill, count = self.subBillCount + 65;

            proNumber += " " + String.fromCharCode(count);

            return proNumber;
        };

        //#endregion
        //#region Life Cycle Events
        //close popup
        VendorBillDisputeLost.prototype.closePopup = function (dialogResult) {
            dialogResult.__dialog__.close(this, dialogResult);
            return true;
        };

        VendorBillDisputeLost.prototype.compositionComplete = function (view, parent) {
            var self = this;
        };

        // first method which will be called when popup is initialized
        VendorBillDisputeLost.prototype.activate = function (optionControl) {
            var self = this;

            // ##START: US21132
            self.isYesClickedOnToastr = false;

            if (typeof optionControl !== "undefined" && typeof optionControl.bindingObject !== "undefined") {
                self.vendorBillId = optionControl.bindingObject.vendorBillId;
                self.proNumber(optionControl.bindingObject.proNumber);
                self.hasLostBill = optionControl.bindingObject.hasLostBill;
                self.subBillCount = optionControl.bindingObject.subBillCount;
                self.proNumberOfMainBill = optionControl.bindingObject.proNumberOfMainBill;
                self.saveCallback = optionControl.bindingObject.saveCallback;
                self.cancelCallback = optionControl.bindingObject.cancelCallback;
            }

            self.load();

            // ##END: US21132
            return true;
        };
        return VendorBillDisputeLost;
    })();

    // Item which will show in the grid
    var VendorBillItemsModel = (function () {
        //
        function VendorBillItemsModel(selectedItemType, cost, userDescription, disputeAmount, disputeLostAmount, id) {
            this.id = ko.observable();
            this.selectedItemTypes = ko.observable();
            this.cost = ko.observable();
            this.userDescription = ko.observable();
            this.disputeAmount = ko.observable();
            this.disputeLostAmount = ko.observable();
            var self = this;

            self.requiredColor = ko.computed(function () {
                if (self.disputeAmount() || self.disputeAmount() === "0.0") {
                    return '';
                }

                return "requiredFieldBgColor";
            });

            self.id(id);
            self.selectedItemTypes(selectedItemType);
            self.cost(cost.toFixed(2));
            self.userDescription(userDescription);
            self.disputeAmount(disputeAmount.toFixed(2));
            self.disputeLostAmount($.number(disputeLostAmount, 2));

            self.enableDisputeLostAmount = ko.computed(function () {
                if (parseFloat(self.disputeAmount()) === 0) {
                    return true;
                }
            });

            self.disputeLostAmount.extend({
                required: {
                    message: 'Dispute lost amount is required.',
                    onlyIf: function () {
                        return ((parseFloat(self.disputeAmount()) !== parseFloat("0.00")));
                    }
                },
                //number: true, //Comented this because of it was throwing erroe if we put number with dot like "12."
                //min: {
                //	params: 1,
                //	message: 'Amount should be greater than zero.',
                //	onlyIf: () => {
                //		return ((parseFloat(self.disputeAmount()) !== parseFloat("0.00")));
                //	}
                //},
                max: {
                    params: 1,
                    message: 'Amount should not be greater than dispute amount.',
                    onlyIf: function () {
                        return ((parseFloat(self.disputeAmount()) < parseFloat(self.disputeLostAmount().toString())) && parseFloat(self.disputeAmount()) !== 0);
                    }
                },
                // ###START: DE22980
                number: true
            });

            // The vendors item bill object
            self.errorVendorItemDetail = ko.validatedObservable({
                disputeLostAmount: self.disputeLostAmount
            });
        }
        // Check validation for each line item}
        VendorBillItemsModel.prototype.checkValidation = function () {
            var self = this;
            if (self.errorVendorItemDetail.errors().length != 0) {
                self.errorVendorItemDetail.errors.showAllMessages();
                return true;
            } else {
                return false;
            }
        };
        return VendorBillItemsModel;
    })();

    return VendorBillDisputeLost;
});
