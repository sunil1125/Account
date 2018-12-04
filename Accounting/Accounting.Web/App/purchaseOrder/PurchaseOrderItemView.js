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
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'services/models/common/Enums'], function(require, exports, ___router__, ___app__, __refSystem__, __refEnums__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    var refEnums = __refEnums__;
    
    
    

    //#endregion
    //#region KO Validation
    ko.validation.configure({
        decorateElement: true,
        registerExtenders: true,
        messagesOnModified: true,
        insertMessages: true,
        messageTemplate: null
    });

    //#endregion KO Validation
    /**
    ** <summary>
    ** Purchase Order Item View Model.
    ** </summary>
    ** <createDetails>
    ** <by>Achal Rastogi</by > <date>17th July, 2014 </date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US21290</id> <by>Shreesha Adiga</by> <date>17-03-2016</date><description>Select item based on itemid and accessorial id</description>
    ** <id>US21290</id> <by>Shreesha Adiga</by> <date>23-03-2016</date><description>If item selected based on itemid and accessorialId is undefined, then select based only on itemId</description>
    ** <id>US24389</id> <by>Shreesha Adiga</by> <date>31-08-2016</date><description>Populate TL accessorials if Truckload Bill checkbox is checked; Made the updateTotalCostAndWeight public</description>
    ** <id>US24671</id> <by>Shreesha Adiga</by> <date>12-09-2016</date><description>Validate multiple Base Rate items for Truckload PO to SO</description>
    ** </changeHistory>
    **/
    var PurchaseOrderItemViewModel = (function () {
        // ##END: US24671
        //#endregion
        //#region Constructors
        function PurchaseOrderItemViewModel(costOrWeightChangedCallBack, keyListenerCallback) {
            //#region Members
            this.purchaseOrderItemsList = ko.observableArray([]);
            this.classTypes = ko.observableArray([]);
            this.packageTypes = ko.observableArray([]);
            this.shipmentItemTypes = ko.observableArray([]);
            this.isAllCheckedForDelete = ko.observable(false);
            this.IsValidationShown = false;
            this.checkMsgDisplay = true;
            this.returnValue = ko.observable(false);
            this.isNotAtLoadingTime = false;
            var self = this;

            self.costOrWeightChanged = costOrWeightChangedCallBack;
            self.keyListenerCallback = keyListenerCallback;

            //set the flag allowdecimal: true to accepts decimals
            self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(true) };

            // initialize the Add command
            self.onAdd = function () {
                var shipmentItemTypesLength = self.shipmentItemTypes().length;
                if ((shipmentItemTypesLength)) {
                    // ##START: US24671
                    var result;

                    // ##END: US24671
                    self.purchaseOrderItemsList.push(new PurchaseOrderItemsModel(result, function () {
                        self.updateTotalCostAndWeight();
                    }, self.onChangesMadeInItem));
                }

                self.onChangesMadeInItem(true);

                if (self.isAllCheckedForDelete())
                    self.isAllCheckedForDelete(false);
            };

            // Making sure that user can delete any item or not, enable only if an item is sleeted
            self.canDelete = ko.computed(function () {
                var isAnySelected = false;

                // Check if any one item is selected for deletion
                self.purchaseOrderItemsList().forEach(function (item) {
                    if (item.isMarkForDeletion()) {
                        isAnySelected = true;
                    }
                });
                return isAnySelected;
            });

            // Making sure that input is number only
            self.IsNumber = function (data, event) {
                var charCode = (event.which) ? event.which : event.keyCode;

                if (event.ctrlKey && (charCode == 99 || charCode == 67)) {
                    return true;
                }

                if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
                    return false;
                }
                return true;
            };

            // Check uncheck all the items as per the user selection}
            self.markAllForDelete = function () {
                var isAllChecked = self.isAllCheckedForDelete();

                self.purchaseOrderItemsList().forEach(function (item) {
                    item.isMarkForDeletion(isAllChecked);
                });
                return true;
            };

            // Handles the checkbox click event for each item
            self.itemCliked = function () {
                if (self.purchaseOrderItemsList().length === 0) {
                    self.isAllCheckedForDelete(false);
                    return true;
                }

                // Get an item which is not selected for deletion
                var isAnyitemNotMarkedForDeletion = $.grep(self.purchaseOrderItemsList(), function (e) {
                    return e.isMarkForDeletion() == false;
                });

                if (isAnyitemNotMarkedForDeletion != undefined && isAnyitemNotMarkedForDeletion.length > 0) {
                    self.isAllCheckedForDelete(false);
                } else {
                    self.isAllCheckedForDelete(true);
                }

                return true;
            };

            //Removing line when click on delete image
            self.removeLineItem = function (lineItem) {
                // Delete from the collection
                self.selectedLineItem = lineItem;
                self.deletePurchaseOrderItemsList();
                self.onChangesMadeInItem(true);
            };

            // Getting called by each and every item in the list
            self.onChangesMadeInItem = function (dirty) {
                if (self.isNotAtLoadingTime)
                    return false;

                if (self.onChangesMade && typeof (self.onChangesMade) === 'function') {
                    self.onChangesMade(dirty);
                    self.returnValue(dirty);
                }
            };

            // Get all the details which is needed for this view
            self.beforeBind();

            self.isTabPress = function (data, event) {
                var charCode = (event.which) ? event.which : event.keyCode;
                if ((charCode === 9)) {
                    var rowCount = $('#tblPurchaseOrderItems').find("tbody tr").length;
                    var index = event.target.id;
                    if (rowCount === +index) {
                        self.keyListenerCallback();
                    }
                }
                return true;
            };

            // for calling purchase Order Items List remove
            self.deletePurchaseOrderItemsList = function () {
                self.checkMsgDisplay = true;
                self.purchaseOrderItemsList.remove(self.selectedLineItem);
                self.updateTotalCostAndWeight();
            };

            //To check if Msg is clicked
            self.checkMsgClick = function () {
                self.checkMsgDisplay = true;
            };

            // to Check if Msg is hidden or closed
            self.checkMsgHide = function () {
                self.checkMsgDisplay = true;
            };

            return self;
        }
        //#endregion
        //#region Internal Methods
        //#region Public Methods
        // Gets the all needed values like ENUMs
        PurchaseOrderItemViewModel.prototype.beforeBind = function () {
            var self = this;

            // Load all classes if not loaded already
            var classTypesLength = self.classTypes().length;
            if (!(classTypesLength)) {
                _app.trigger("GetClassTypesAndPackageTypes", function (data) {
                    if (data) {
                        self.classTypes.removeAll();
                        self.classTypes.push.apply(self.classTypes, data['FakTypeEnums']);

                        self.packageTypes.removeAll();
                        self.packageTypes.push.apply(self.packageTypes, data['PackageTypeEnums']);
                    }
                });
            }

            // Load all shipment types if not loaded already
            var shipmentItemTypesLength = self.shipmentItemTypes().length;
            if (!(shipmentItemTypesLength)) {
                // ##START: US24389
                self.populateShipmentItemsDropdown('LTL');
                // ##END: US24389
            }
            self.addDefaultItems();
        };

        /*
        ** <createDetails>
        ** <id>US24389</id> <by>Shreesha Adiga</by> <date>31-08-2016</date> <description>Populate Items dropdown based on the service type</description>
        ** </createDetails>
        */
        PurchaseOrderItemViewModel.prototype.populateShipmentItemsDropdown = function (type) {
            var self = this;

            _app.trigger(typeof type !== 'undefined' && type === 'Truckload' ? "GetTruckloadAccessorials" : "GetItemsTypes", function (items) {
                // ##START: US24671
                self.serviceType = type;

                // ##END: US24671
                self.shipmentItemTypes.removeAll();
                self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
            });
        };

        // Shows the message box as pr the given title and message
        PurchaseOrderItemViewModel.prototype.showConfirmationMessage = function (message, title, fisrtButtoName, secondButtonName, yesCallBack, noCallBack) {
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
            _app.showDialog('templates/messageBox', optionControlArgs, 'slideDown');
        };

        // Checks validation in all the items
        PurchaseOrderItemViewModel.prototype.validateItems = function () {
            var self = this;
            var isInvalid = false;

            if (self.purchaseOrderItemsList().length > 0) {
                self.purchaseOrderItemsList().forEach(function (item) {
                    if (item.checkValidation()) {
                        isInvalid = true;
                    }
                });
            } else {
                isInvalid = true;
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.ThereShouldBeAtLeastOneLineItem, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
            }
            return isInvalid;
        };

        // to load the vendor bill item details
        PurchaseOrderItemViewModel.prototype.initializePurchaseOrderItemDetails = function (items) {
            var self = this;
            self.isNotAtLoadingTime = true;

            if (self.purchaseOrderItemsList != null)
                self.purchaseOrderItemsList.removeAll();

            if (items != null) {
                for (var i = 0; i < items.length; i++) {
                    //##START: US21290
                    var item = $.grep(self.shipmentItemTypes(), function (e) {
                        return e.ItemId === items[i].ItemId.toString() && (e.AccessorialId == null || items[i].AccessorialId == 0 || e.AccessorialId == items[i].AccessorialId);
                    })[0];

                    if (typeof item === "undefined" || item == null) {
                        item = $.grep(self.shipmentItemTypes(), function (e) {
                            return e.ItemId === items[i].ItemId.toString();
                        })[0];
                    }

                    //##END: US21290
                    var vendorItem = new PurchaseOrderItemsModel(item, function () {
                        self.updateTotalCostAndWeight();
                    }, self.onChangesMadeInItem);
                    vendorItem.initializePurchaseOrderItem(items[i]);

                    // ##START: US24671
                    vendorItem.serviceType = self.serviceType;

                    // ##END: US24671
                    self.purchaseOrderItemsList.push(vendorItem);
                }
            }

            self.isNotAtLoadingTime = false;
        };

        //To Populate the vendor bill items.  items: VendorBillItemViewModel
        PurchaseOrderItemViewModel.prototype.populateItemsDetails = function (items) {
            var self = this;
            //self.addExistingItem(items.vendorBillItemsList);
        };

        //#endregion Public Methods
        //#region Private methods
        PurchaseOrderItemViewModel.prototype.addExistingItem = function (items) {
            var self = this;

            self.purchaseOrderItemsList.removeAll();
            if (items && typeof items === 'function') {
                items().forEach(function (item) {
                    self.purchaseOrderItemsList.push(item);
                });
            }
        };

        // Updates the main view as per the change in the items
        // ##START: US24389
        PurchaseOrderItemViewModel.prototype.updateTotalCostAndWeight = function () {
            // ##END: US24389
            var self = this;

            var totalCost = 0.0;
            var totalweight = 0.0;
            var totalPices = 0.0;

            // ##START: US24671
            var shippingServiceCount = 0;

            // ##END: US24671
            self.purchaseOrderItemsList().forEach(function (item) {
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

                if (item.weight()) {
                    totalweight += parseInt(item.weight().toString());
                }

                if (item.pieceCount()) {
                    totalPices += parseInt(item.pieceCount().toString());
                }

                if (self.serviceType === 'Truckload' && typeof item.selectedItemTypes() !== 'undefined' && item.selectedItemTypes().ItemId === '10') {
                    shippingServiceCount++;
                    item.isShippingServiceCountGreaterThanOne(shippingServiceCount > 1);
                } else {
                    item.isShippingServiceCountGreaterThanOne(false);
                }
                // ##END: US24671
            });

            self.costOrWeightChanged(totalCost, totalweight, totalPices);
        };

        // Adds default line items first time
        PurchaseOrderItemViewModel.prototype.addDefaultItems = function () {
            var self = this;

            if (self.purchaseOrderItemsList !== null) {
                self.purchaseOrderItemsList.removeAll();
            }

            var shipingItem = $.grep(self.shipmentItemTypes(), function (e) {
                return e.ItemId === "10";
            })[0];
            var discountItem = $.grep(self.shipmentItemTypes(), function (e) {
                return e.ItemId === "70";
            })[0];
            var fuelItem = $.grep(self.shipmentItemTypes(), function (e) {
                return e.ItemId === "30";
            })[0];

            self.purchaseOrderItemsList.push(new PurchaseOrderItemsModel(shipingItem, function () {
                self.updateTotalCostAndWeight();
            }, self.onChangesMadeInItem));
            self.purchaseOrderItemsList.push(new PurchaseOrderItemsModel(discountItem, function () {
                self.updateTotalCostAndWeight();
            }, self.onChangesMadeInItem));
            self.purchaseOrderItemsList.push(new PurchaseOrderItemsModel(fuelItem, function () {
                self.updateTotalCostAndWeight();
            }, self.onChangesMadeInItem));
        };

        //#endregion
        //#endregion
        //#region Life Cycle Event
        PurchaseOrderItemViewModel.prototype.activate = function () {
            return true;
        };

        //#endregion
        PurchaseOrderItemViewModel.prototype.cleanup = function () {
            var self = this;

            self.purchaseOrderItemsList().forEach(function (item) {
                item.cleanup();
                delete item;
            });

            self.purchaseOrderItemsList.removeAll();

            for (var property in self) {
                delete self[property];
            }
        };
        return PurchaseOrderItemViewModel;
    })();
    exports.PurchaseOrderItemViewModel = PurchaseOrderItemViewModel;

    /*
    ** <summary>
    ** Each line item view model
    ** </summary>
    ** <createDetails>
    ** <id>US8221</id> <by>Avinash Dubey</by> <date>04-21-2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US21290</id> <by>Shreesha Adiga</by> <date>17-03-2016</date><description>Show longdescription instead of short description in item dropdown and description input</description>
    ** <id>US21290</id> <by>Shreesha Adiga</by> <date>22-03-2016</date><description>Show AccessorialDescription instead of longdescription in description input</description>
    ** <id>US24671</id> <by>Shreesha Adiga</by> <date>12-09-2016</date><description>Validate multiple Base Rate items for Truckload PO to SO</description>
    ** </changeHistory>
    */
    var PurchaseOrderItemsModel = (function () {
        // ##END: US24671
        //#region Constructor
        function PurchaseOrderItemsModel(selectedType, costOrWeightChanged, changesMade) {
            this.id = ko.observable();
            this.selectedItemTypes = ko.observable();
            this.cost = ko.observable();
            this.pieceCount = ko.observable();
            this.selectedClassType = ko.observable();
            this.weight = ko.observable();
            this.dimensionLength = ko.observable();
            this.dimensionWidth = ko.observable();
            this.dimensionHeight = ko.observable();
            this.userDescription = ko.observable();
            this.allowvalidation = ko.observable(true);
            this.isMarkForDeletion = ko.observable(false);
            this.selectedPackageType = ko.observable();
            this.disputeAmount = ko.observable();
            this.disputeLostAmount = ko.observable();
            this.accessorialId = ko.observable();
            this.accessorialCode = ko.observable();
            this.isNotAtLoadingTime = false;
            // ##START: US24671
            this.isShippingServiceCountGreaterThanOne = ko.observable(false);
            var self = this;

            // Notifies to parent view model about the changes
            self.onChangesMade = function (dirty) {
                changesMade(dirty);
            };
            self.selectedItemTypes(selectedType);

            self.id = ko.observable(0);

            if (refSystem.isObject(selectedType)) {
                if (selectedType.ItemId !== "10") {
                    self.userDescription(selectedType.ShortDescription);
                }
            }

            // Handles the visibility of some of the fields like class, weight
            self.isShippingItem = ko.computed(function () {
                return (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === "10");
            });

            // Handles the visibility of some of the fields like class, weight
            self.isShippingItemMiscellaneous = ko.computed(function () {
                return ((self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemId) || (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemIdMiscellaneousFee) || (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemIdCorrectedInvocingFee) || (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reclass) || (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reclassfee) || (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reweigh) || (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ReweighANDReclass) || (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reweighfee));
            });

            //#region Validation Rules
            self.cost.extend({
                required: {
                    message: 'Cost is required.',
                    onlyIf: function () {
                        return (self.validatePurchaseOrderItem() || (self.id() === 1 && self.allowvalidation()) || self.selectedItemTypes() === undefined);
                    }
                },
                number: true
            });

            self.selectedItemTypes.extend({
                required: {
                    message: 'Please Choose Item Type.',
                    onlyIf: function () {
                        return (self.validatePurchaseOrderItem() || (self.id() === 1 && self.allowvalidation()) || self.selectedItemTypes() === undefined);
                    }
                },
                // ##START: US24671
                validation: {
                    validator: function () {
                        return !(self.isShippingServiceCountGreaterThanOne());
                    },
                    message: ApplicationMessages.Messages.BaseRateCantBeAddedMultipleTimes
                }
            });

            self.userDescription.extend({
                required: {
                    message: 'Description is required.',
                    onlyIf: function () {
                        return (self.validatePurchaseOrderItem() || (self.id() === 1 && self.allowvalidation()));
                    }
                }
            });

            //#endregion Validation Rules
            // The vendors item bill object
            self.errorPurchaseOrderItemDetail = ko.validatedObservable({
                selectedItemTypes: self.selectedItemTypes,
                cost: self.cost,
                pieceCount: self.pieceCount,
                selectedClassType: self.selectedClassType,
                weight: self.weight,
                userDescription: self.userDescription,
                selectedItemTypes: self.selectedItemTypes
            });

            self.SetBITrackChange(self);

            self.getBITrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            self.isBIDirty = ko.computed(function () {
                var result = self.selectedItemTypes();
                var result1 = self.userDescription();
                var result2 = self.dimensionLength();
                result2 = self.dimensionWidth();
                result2 = self.dimensionHeight();
                result2 = self.pieceCount();
                result2 = self.selectedPackageType();
                result2 = self.cost();
                result2 = self.selectedClassType();
                result2 = self.weight();
                result2 = self.disputeAmount();
                result2 = self.disputeLostAmount();

                if (self.isNotAtLoadingTime)
                    return false;

                var returnValue = self.getBITrackChange().length > 0 ? true : false;
                if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
                    self.onChangesMade(returnValue);

                return returnValue;
            });

            // Subscribe to update the UI
            self.cost.subscribe(function () {
                if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70" && parseFloat(self.cost().toString()) > 0) {
                    self.cost(Number(parseFloat(self.cost().toString()) * -1).toFixed(2));
                }

                costOrWeightChanged();
            });

            // Subscribe to update the UI
            self.weight.subscribe(function () {
                costOrWeightChanged();
            });
            self.pieceCount.subscribe(function () {
                costOrWeightChanged();
            });

            // Subscribe to change the cost as negative if that is discount
            self.selectedItemTypes.subscribe(function () {
                if (self.cost() && self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70" && parseFloat(self.cost().toString()) > 0) {
                    self.cost(Number(parseFloat(self.cost().toString()) * -1).toFixed(2));
                } else if (self.cost() && parseFloat(self.cost().toString()) < 0) {
                    self.cost(Number(parseFloat(self.cost().toString()) * -1).toFixed(2));
                }

                if (self.selectedItemTypes() && self.selectedItemTypes().ItemId !== "10") {
                    // ##START: US21290
                    self.userDescription(self.selectedItemTypes().AccessorialDescription);
                    // ##END: US21290
                } else {
                    self.userDescription("");
                }

                costOrWeightChanged();
            });

            return self;
        }
        //#endregion Constructor
        //#region Private Methods
        // Validates all the properties for an item
        PurchaseOrderItemsModel.prototype.validatePurchaseOrderItem = function () {
            if (!this.allowvalidation()) {
                return false;
            }

            if (refSystem.isObject(this.selectedItemTypes()) || (this.cost.length > 0) || (this.pieceCount.length > 0) || (this.selectedClassType.length > 0) || (this.weight.length > 0) || (refSystem.isString(this.dimensionLength()) && this.dimensionLength()) || (refSystem.isString(this.dimensionWidth()) && this.dimensionWidth()) || (refSystem.isString(this.dimensionHeight()) && this.dimensionHeight()) || (refSystem.isString(this.userDescription()) && this.userDescription())) {
                return true;
            }

            return false;
        };

        //#endregion Private Methods
        //#region Public Methods
        // Check validation for each line item
        PurchaseOrderItemsModel.prototype.checkValidation = function () {
            var self = this;
            if (self.errorPurchaseOrderItemDetail.errors().length != 0) {
                self.errorPurchaseOrderItemDetail.errors.showAllMessages();
                return true;
            } else {
                return false;
            }
        };

        // get the item view model
        PurchaseOrderItemsModel.prototype.initializePurchaseOrderItem = function (item) {
            var self = this;
            if (item != null) {
                self.id(item.Id);
                self.cost(($.number((item.Cost), 2)).replace(/,/g, ""));
                self.pieceCount(item.ItemId === 10 ? item.PieceCount : 0);
                self.selectedClassType(item.SelectedClassType);
                self.weight(item.Weight);
                self.dimensionLength(item.DimensionLength);
                self.dimensionWidth(item.DimensionWidth);
                self.dimensionHeight(item.DimensionHeight);
                self.userDescription(item.UserDescription);
                self.selectedPackageType(item.PackageTypeId);
                self.disputeAmount(parseFloat(item.DisputeAmount.toString().replace(/,/g, "")));
                self.disputeLostAmount(parseFloat(item.DisputeLostAmount.toString().replace(/,/g, "")));
                if (item.AccessorialId) {
                    self.accessorialId(item.AccessorialId);
                }
                if (item.AccessorialCode) {
                    self.accessorialCode(item.AccessorialCode);
                }
                //self.SetBITrackChange(self);
            }
        };

        //To populate the Vendor Bill Items.
        PurchaseOrderItemsModel.prototype.populateVendorBillItem = function (self, item) {
            var self = this;

            // This will prevent to detect the changes at first time
            self.isNotAtLoadingTime = true;
            if (item != null) {
                self.id(item.id());

                //var costWithoutComma = item.cost().toString();
                //self.cost(+costWithoutComma.replace(/,/g, ""));
                self.cost(item.cost().replace(/,/g, ""));
                self.pieceCount(item.pieceCount());
                self.selectedClassType(item.selectedClassType());
                self.weight(item.weight());
                self.dimensionLength(item.dimensionLength());
                self.dimensionWidth(item.dimensionWidth());
                self.dimensionHeight(item.dimensionHeight());
                self.userDescription(item.userDescription());
                self.selectedPackageType(item.selectedPackageType());
                self.disputeAmount(parseFloat(item.disputeAmount().toString().replace(/,/g, "")));
                self.disputeLostAmount(parseFloat(item.disputeLostAmount().toString().replace(/,/g, "")));
                if (item.accessorialId()) {
                    self.accessorialId(item.accessorialId());
                }
                if (item.accessorialCode() !== undefined) {
                    self.accessorialCode(item.accessorialCode());
                }
                self.SetBITrackChange(self);
            }

            // This will stop detecting the changes
            self.isNotAtLoadingTime = false;
        };

        // this function is used to convert formatted cost with decimal(Two Place).
        PurchaseOrderItemsModel.prototype.formatDecimalNumber = function (field) {
            var self = this;
            var costValue = field();
            if (costValue) {
                var stringParts = costValue + '';

                var isNegative = stringParts.indexOf("-") !== -1;

                var parts = stringParts.split('.');

                if (parts && parts.length > 2) {
                    costValue = parts[0] + '.' + parts[1];
                }

                if (parts.length === 1 && costValue && costValue.length > 8) {
                    costValue = costValue.replace(/[^0-9]/g, '');
                    costValue = costValue.replace(/(\d{8})(\d{2})/, "$1.$2");
                    field(costValue);
                }
                if (parts.length === 1 || (parts && (parts.length === 0 || parts[1] || parts[1] === ''))) {
                    if (costValue && costValue.length >= 1 && costValue.length <= 8) {
                        if (/\.\d$/.test(costValue)) {
                            costValue += "0";
                        } else if (/\.$/.test(costValue)) {
                            costValue += "00";
                        } else if (!/\.\d{2}$/.test(costValue)) {
                            costValue += ".00";
                        }
                    }
                }

                if (isNegative === true) {
                    costValue = '-' + (costValue + '').split("-")[1];
                }

                field(costValue);
            }
        };

        //sets the tracking extension for BI required fields
        PurchaseOrderItemsModel.prototype.SetBITrackChange = function (self) {
            self.selectedItemTypes.extend({ trackChange: true });
            self.userDescription.extend({ trackChange: true });
            self.cost.extend({ trackChange: true });
            self.selectedClassType.extend({ trackChange: true });
            self.weight.extend({ trackChange: true });
            self.dimensionLength.extend({ trackChange: true });
            self.dimensionWidth.extend({ trackChange: true });
            self.dimensionHeight.extend({ trackChange: true });
            self.pieceCount.extend({ trackChange: true });
            self.selectedPackageType.extend({ trackChange: true });
            self.disputeAmount.extend({ trackChange: true });
            self.disputeLostAmount.extend({ trackChange: true });
        };

        PurchaseOrderItemsModel.prototype.cleanup = function () {
            var self = this;

            self.cost.extend({ validatable: false });
            self.selectedItemTypes.extend({ validatable: false });
            self.userDescription.extend({ validatable: false });
            self.selectedClassType.extend({ validatable: false });
            self.selectedPackageType.extend({ validatable: false });
            self.weight.extend({ validatable: false });
            self.pieceCount.extend({ validatable: false });

            for (var property in self) {
                delete self[property];
            }
        };
        return PurchaseOrderItemsModel;
    })();
    exports.PurchaseOrderItemsModel = PurchaseOrderItemsModel;
});
