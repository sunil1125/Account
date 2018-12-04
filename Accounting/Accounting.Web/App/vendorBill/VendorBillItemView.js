/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'services/client/CommonClient', 'services/models/common/Enums'], function(require, exports, ___router__, ___app__, __refSystem__, __refCommon__, __refEnums__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    var refCommon = __refCommon__;
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
    /*
    ** <summary>
    ** Vendor Bill Item View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US8221</id> <by>Avinash Dubey</by> <date>04-21-2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US21290</id> <by>Shreesha Adiga</by> <date>17-03-2016</date><description>Select item based on itemid and accessorial id</description>
    ** <id>US21290</id> <by>Shreesha Adiga</by> <date>23-03-2016</date><description>If item selected based on itemid and accessorialId is undefined, then select based only on itemId</description>
    ** <id>DE22381</id> <by>Baldev Singh Thakur</by> <date>04-04-2016</date><description>User not able to open  bills from Command Center sometimes.</description>
    ** <id>DE22616</id> <by>Vasanthakumar</by> <date>25-04-2016</date><description>Bills are not getting opened if Item ID is wrong</description>
    ** <id>DE22635</id> <by>Baldev Singh Thakur</by> <date>26-04-2016</date><description>Items are shown blank when a bill is opened  from Command Center.</description>
    ** <id>US25153</id> <by>Shreesha Adiga</by> <date>20-10-2016</date><description>Changes realted to Credit Adjustment (Items Not Integrated With Mas)</description>
    ** <id>DE25602</id> <by>Vasanthakumar</by> <date>18-01-2017</date><description>If item id and accessorial id is zero then Credit adjustment line item is inserted in the order</description>
    ** </changeHistory>
    */
    var VendorBillItemViewModel = (function () {
        // ##END: US25153
        //#endregion
        //#region Constructor
        // Initialize the VendorBillItemViewModel
        function VendorBillItemViewModel(costOrWeightChangedCallBack, keyListenerCallback) {
            //#region Members
            this.vendorBillItemsList = ko.observableArray([]);
            this.classTypes = ko.observableArray([]);
            this.packageTypes = ko.observableArray([]);
            this.shipmentItemTypes = ko.observableArray([]);
            this.isAllCheckedForDelete = ko.observable(false);
            this.IsValidationShown = false;
            this.checkMsgDisplay = true;
            this.isEnable = ko.observable(true);
            this.returnValue = ko.observable(false);
            this.isNotAtLoadingTime = false;
            // keep the value for enable and disable dispute amount and  dispute lost amount
            this.isDisputeAmountEditable = ko.observable(false);
            this.isDisputeLostAmountEditable = ko.observable(false);
            // keep the value for show/hide dispute amount section
            this.isDisputeAmountVisible = ko.observable(false);
            // Utility class object
            this.CommonUtils = new Utils.Common();
            //
            this.vbTotalCost = ko.observable(0);
            this.vbTotalDisputeAmount = ko.observable(0);
            this.vbTotalDisputeLostAmount = ko.observable(0);
            this.vbTotalWeight = ko.observable(0);
            this.shipperAndDiscountCost = ko.observable(0);
            this.disposables = [];
            this.isLostBill = ko.observable(false);
            // ##START: US25153
            this.itemsNotIntegratedWithMas = [];
            var self = this;

            self.costOrWeightChanged = costOrWeightChangedCallBack;
            self.keyListenerCallback = keyListenerCallback;

            //set the flag allowdecimal: true to accepts decimals
            self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(true) };

            // initialize the Add command
            self.onAdd = function () {
                var shipmentItemTypesLength = self.shipmentItemTypes().length;
                if ((shipmentItemTypesLength)) {
                    var result = $.grep(self.shipmentItemTypes(), function (e) {
                        return e.ItemId === "10";
                    })[0];
                    self.vendorBillItemsList.push(new VendorBillItemsModel(result, function () {
                        self.updateTotalCostAndWeight();
                    }, self.onChangesMadeInItem, self.isEnable()));
                }

                self.onChangesMadeInItem(true);

                if (self.isAllCheckedForDelete())
                    self.isAllCheckedForDelete(false);
            };
            self.disposables.push(self.canDelete = ko.computed(function () {
                var isAnySelected = false;

                // Check if any one item is selected for deletion
                self.vendorBillItemsList().forEach(function (item) {
                    if (item.isMarkForDeletion()) {
                        isAnySelected = true;
                    }
                });
                return isAnySelected;
            }));
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
            self.markAllForDelete = function () {
                var isAllChecked = self.isAllCheckedForDelete();

                self.vendorBillItemsList().forEach(function (item) {
                    item.isMarkForDeletion(isAllChecked);
                });
                return true;
            };
            self.itemCliked = function () {
                if (self.vendorBillItemsList().length === 0) {
                    self.isAllCheckedForDelete(false);
                    return true;
                }

                // Get an item which is not selected for deletion
                var isAnyitemNotMarkedForDeletion = $.grep(self.vendorBillItemsList(), function (e) {
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
                self.selectLineItem = lineItem;
                self.deleteVendorBillItemsList();
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
            self.beforeBind();

            //#region Computed css classes based on Dispute Amount
            self.disposables.push(self.descColCssClass = ko.computed(function () {
                if (self.isDisputeAmountVisible()) {
                    return 'width - percent - 16';
                } else {
                    return 'width - percent - 35';
                }
            }));

            self.disposables.push(self.descTextValidCssClass = ko.computed(function () {
                if (self.isDisputeAmountVisible()) {
                    return '91%';
                } else {
                    return '96%';
                }
            }));

            self.disposables.push(self.descTextNotValidCssClass = ko.computed(function () {
                if (self.isDisputeAmountVisible()) {
                    return '89.6%';
                } else {
                    return '85.5%';
                }
            }));

            self.isTabPress = function (data, event) {
                var charCode = (event.which) ? event.which : event.keyCode;
                if ((charCode === 9)) {
                    var rowCount = $('#tblVendorBillItems').find("tbody tr").length;
                    var index = event.target.id;
                    if (rowCount === +index) {
                        self.keyListenerCallback();
                    }
                    // self.keyListenerCallback();
                }
                return true;
            };

            // for calling vendor Bill Items List
            self.deleteVendorBillItemsList = function () {
                self.checkMsgDisplay = true;
                self.vendorBillItemsList.remove(self.selectLineItem);
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

            //#endregion
            return self;
        }
        //#endregion Constructor
        //#region Public Methods
        // Gets the all needed values like ENUMs
        VendorBillItemViewModel.prototype.beforeBind = function () {
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
                _app.trigger("GetItemsTypes", function (items) {
                    self.shipmentItemTypes.removeAll();
                    self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
                });
            }

            // ##START: US25153
            _app.trigger("GetItemsNotIntegratedWithMas", function (items) {
                if (items && typeof self.itemsNotIntegratedWithMas !== "undefined" && self.itemsNotIntegratedWithMas.length === 0) {
                    self.itemsNotIntegratedWithMas = self.itemsNotIntegratedWithMas.concat(items);
                }
            });

            // ##END: US25153
            self.addDefaultItems();
        };

        // Shows the message box as pr the given title and message
        VendorBillItemViewModel.prototype.showConfirmationMessage = function (message, title, fisrtButtoName, secondButtonName, yesCallBack, noCallBack) {
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
        VendorBillItemViewModel.prototype.validateItems = function () {
            var self = this;
            var isInvalid = false;

            if (self.vendorBillItemsList().length > 0) {
                self.vendorBillItemsList().forEach(function (item) {
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
            if (self.vbTotalDisputeLostAmount().toString() === "0.00" && self.isDisputeLostAmountEditable()) {
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
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.DisputLostItemShoudBeGreaterThenZero, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
            }
            return isInvalid;
        };

        // ###START: DE22381
        // to load the vendor bill item details
        VendorBillItemViewModel.prototype.initializeVendorBillItemDetails = function (items, isDisputeAmountEditable, isDisputeLostAmountEditable, enable, isLostBill) {
            var self = this;

            if (self.shipmentItemTypes().length === 0) {
                refCommon.Common.prototype.GetListShipmentType(function (data) {
                    if (data) {
                        if (typeof self.shipmentItemTypes !== "undefined") {
                            self.shipmentItemTypes.removeAll();
                            self.shipmentItemTypes.push.apply(self.shipmentItemTypes, data);
                        }

                        // ###END: DE22635
                        self.vendorBillItemInitialization(items, isDisputeAmountEditable, isDisputeLostAmountEditable, enable, isLostBill);
                    }
                });
            } else {
                self.vendorBillItemInitialization(items, isDisputeAmountEditable, isDisputeLostAmountEditable, enable, isLostBill);
            }
        };

        // ###END: DE22381
        //To Populate the vendor bill items.  items: VendorBillItemViewModel
        VendorBillItemViewModel.prototype.populateItemsDetails = function (items) {
            var self = this;
            self.addExistingItem(items.vendorBillItemsList);
        };

        VendorBillItemViewModel.prototype.cleanUp = function () {
            var self = this;
            try  {
                self.disposables.forEach(function (item) {
                    item.dispose();
                    delete item;
                });

                self.vendorBillItemsList().forEach(function (item) {
                    item.cleanUp();
                    delete item;
                });

                for (var prop in self) {
                    if (typeof self[prop].dispose === "function") {
                        self[prop].dispose();
                    }
                    delete self[prop];
                }

                delete self;
            } catch (exception) {
            }
        };

        //#endregion Public Methods
        //#region Private methods
        VendorBillItemViewModel.prototype.addExistingItem = function (items) {
            var self = this;

            self.vendorBillItemsList.removeAll();
            if (items && typeof items === 'function') {
                items().forEach(function (item) {
                    var result = item.selectedItemTypes();
                    var itemToAdd = new VendorBillItemsModel(result, function () {
                        self.updateTotalCostAndWeight();
                    }, self.onChangesMadeInItem);
                    itemToAdd.cost(item.cost());
                    itemToAdd.weight(item.weight());
                    itemToAdd.pieceCount(item.pieceCount());
                    itemToAdd.disputeAmount(item.disputeAmount());
                    itemToAdd.disputeLostAmount(item.disputeLostAmount());
                    itemToAdd.selectedClassType(item.selectedClassType());
                    itemToAdd.dimensionHeight(item.dimensionHeight());
                    itemToAdd.dimensionLength(item.dimensionLength());
                    itemToAdd.dimensionWidth(item.dimensionWidth());
                    itemToAdd.selectedPackageType(item.selectedPackageType());
                    itemToAdd.selectedItemTypes(item.selectedItemTypes());
                    itemToAdd.userDescription(item.userDescription());
                    itemToAdd.isLostBill(self.isLostBill());
                    self.vendorBillItemsList.push(itemToAdd);
                });
            }
            self.updateTotalCostAndWeight();
        };

        // Updates the main view as per the change in the items
        VendorBillItemViewModel.prototype.updateTotalCostAndWeight = function () {
            var self = this;

            var totalCost = 0.0, totalweight = 0.0, totalPices = 0.0, totalDisputeLostCost = 0.0, totalDisputeCost = 0.0, totalShippingAndDiscountCost = 0.0;

            self.vendorBillItemsList().forEach(function (item) {
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

                if ((typeof (item.selectedItemTypes()) !== 'undefined' && item.selectedItemTypes() !== null) && (item.selectedItemTypes().ItemId === "10" || item.selectedItemTypes().ItemId === "70")) {
                    if (item.cost()) {
                        var costWithoutComma = item.cost().toString();
                        var check = costWithoutComma.indexOf(",");
                        if (check === -1) {
                            totalShippingAndDiscountCost += parseFloat(item.cost().toString());
                        } else {
                            //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                            totalShippingAndDiscountCost += parseFloat(costWithoutComma.replace(/,/g, ""));
                        }
                    }
                }

                if (item.weight()) {
                    totalweight += parseInt(item.weight().toString());
                }

                if (item.pieceCount()) {
                    totalPices += parseInt(item.pieceCount().toString());
                }

                if (item.disputeAmount()) {
                    var disputeWithoutComma = item.disputeAmount().toString();
                    var check = disputeWithoutComma.indexOf(",");
                    if (check === -1) {
                        totalDisputeCost += parseFloat(item.disputeAmount().toString());
                    } else {
                        //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                        totalDisputeCost += parseFloat(disputeWithoutComma.replace(/,/g, ""));
                    }
                    //totalDisputeCost += parseFloat(item.disputeAmount().toString());
                }

                if (item.disputeLostAmount()) {
                    var disputeLostAmountWithoutComma = item.disputeLostAmount().toString();
                    var check = disputeLostAmountWithoutComma.indexOf(",");
                    if (check === -1) {
                        totalDisputeLostCost += parseFloat(item.disputeLostAmount().toString());
                    } else {
                        //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                        totalDisputeLostCost += parseFloat(disputeWithoutComma.replace(/,/g, ""));
                    }
                }
            });

            self.costOrWeightChanged(totalCost, totalweight, totalPices, totalDisputeCost);
            self.vbTotalCost($.number(totalCost, 2));
            self.vbTotalDisputeAmount($.number(totalDisputeCost, 2));
            self.vbTotalDisputeLostAmount($.number(totalDisputeLostCost, 2));
            self.vbTotalWeight(totalweight);
            self.shipperAndDiscountCost($.number(totalShippingAndDiscountCost, 2));
        };

        // Adds default line items first time
        VendorBillItemViewModel.prototype.addDefaultItems = function (carrierType) {
            var self = this;
            var itemToDelete = $.grep(self.vendorBillItemsList(), function (item) {
                return item.cost() === "0.00" || item.cost() === "" || item.cost() === undefined;
            });

            var itemToCheckCost = $.grep(self.vendorBillItemsList(), function (item) {
                return item.cost() !== "0.00" || item.cost() !== "" || item.cost() !== undefined;
            });

            if (typeof (carrierType) !== 'undefined' && carrierType === 3) {
                if (itemToDelete && itemToDelete.length > 0) {
                    itemToDelete.forEach(function (item) {
                        if ((item && item.selectedItemTypes().ItemId == '30') || (item && item.selectedItemTypes().ItemId == '70')) {
                            self.vendorBillItemsList.remove(item);
                        }
                    });
                }
            } else {
                if (itemToDelete && itemToDelete.length === 0 && itemToCheckCost && itemToCheckCost.length > 0) {
                } else {
                    if (self.vendorBillItemsList !== null) {
                        self.vendorBillItemsList.removeAll();
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

                    self.vendorBillItemsList.push(new VendorBillItemsModel(shipingItem, function () {
                        self.updateTotalCostAndWeight();
                    }, self.onChangesMadeInItem));
                    self.vendorBillItemsList.push(new VendorBillItemsModel(discountItem, function () {
                        self.updateTotalCostAndWeight();
                    }, self.onChangesMadeInItem));
                    self.vendorBillItemsList.push(new VendorBillItemsModel(fuelItem, function () {
                        self.updateTotalCostAndWeight();
                    }, self.onChangesMadeInItem));
                }
            }
        };

        // ###START: DE22381
        VendorBillItemViewModel.prototype.vendorBillItemInitialization = function (items, isDisputeAmountEditable, isDisputeLostAmountEditable, enable, isLostBill) {
            var self = this;
            self.isNotAtLoadingTime = true;
            self.isDisputeAmountVisible(true);
            self.isDisputeAmountEditable(isDisputeAmountEditable);
            self.isDisputeLostAmountEditable(isDisputeLostAmountEditable);
            self.isLostBill(isLostBill);
            self.isEnable(!enable);
            if (self.vendorBillItemsList != null)
                self.vendorBillItemsList.removeAll();

            var totalShippingAndDiscountCost = 0.0;

            if (items != null) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].ItemId === 10 || items[i].ItemId === 70) {
                        var costWithoutComma = items[i].Cost.toString();
                        var check = costWithoutComma.indexOf(",");
                        if (check === -1) {
                            totalShippingAndDiscountCost += parseFloat(items[i].Cost.toString());
                        } else {
                            //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                            totalShippingAndDiscountCost += parseFloat(costWithoutComma.replace(/,/g, ""));
                        }
                    }
                }
            }

            if (items != null) {
                for (var i = 0; i < items.length; i++) {
                    // ##START: US25153
                    var item;

                    if (items[i].ItemId === 0 && items[i].AccessorialId === 0 && self.itemsNotIntegratedWithMas) {
                        item = $.grep(self.itemsNotIntegratedWithMas, function (e) {
                            return e.ShortDescription === items[i].UserDescription;
                        })[0];

                        if (typeof item !== "undefined")
                            self.shipmentItemTypes.push.apply(self.shipmentItemTypes, self.itemsNotIntegratedWithMas);
                    }

                    if (typeof item === "undefined") {
                        item = $.grep(self.shipmentItemTypes(), function (e) {
                            return e.ItemId === items[i].ItemId.toString() && (e.AccessorialId == null || items[i].AccessorialId == 0 || e.AccessorialId == items[i].AccessorialId);
                        })[0];
                    }

                    if (typeof item === "undefined" || item == null) {
                        item = $.grep(self.shipmentItemTypes(), function (e) {
                            return e.ItemId === items[i].ItemId.toString();
                        })[0];
                    }

                    // ##END: US21290
                    var vendorItem = new VendorBillItemsModel(item, function () {
                        self.updateTotalCostAndWeight();
                    }, self.onChangesMadeInItem, isDisputeAmountEditable, isDisputeLostAmountEditable, self.isEnable(), self.isLostBill());
                    vendorItem.initializeVendorBillItem(items[i], self.isEnable(), totalShippingAndDiscountCost, self.isLostBill());
                    self.vendorBillItemsList.push(vendorItem);

                    // ##START: US25153
                    item = undefined;
                    // ##END: US25153
                }
            }
            self.updateTotalCostAndWeight();
            self.isNotAtLoadingTime = false;
        };
        return VendorBillItemViewModel;
    })();
    exports.VendorBillItemViewModel = VendorBillItemViewModel;

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
    ** </changeHistory>
    */
    var VendorBillItemsModel = (function () {
        //#region Constructor
        function VendorBillItemsModel(selectedType, costOrWeightChanged, changesMade, isDisputeAmountEditable, isDisputeLostAmountEditable, isEnable, isLostBill) {
            this.id = ko.observable();
            this.selectedItemTypes = ko.observable();
            this.cost = ko.observable();
            this.pieceCount = ko.observable();
            this.selectedClassType = ko.observable();
            this.weight = ko.observable();
            this.dimensionLength = ko.observable();
            this.dimensionWidth = ko.observable();
            this.dimensionHeight = ko.observable();
            this.userDescription = ko.observable('');
            this.allowvalidation = ko.observable(true);
            this.isMarkForDeletion = ko.observable(false);
            this.selectedPackageType = ko.observable();
            this.disputeAmount = ko.observable();
            this.disputeLostAmount = ko.observable();
            this.shippingAndDiscountCost = ko.observable();
            this.isNotAtLoadingTime = false;
            this.isEnable = ko.observable(true);
            // for dispute amount validation
            this.isDisputeAmountEditable = false;
            this.isDisputeLostAmountEditable = false;
            this.disposables = [];
            this.isLostBill = ko.observable(false);
            var self = this;
            self.isDisputeAmountEditable = isDisputeAmountEditable;
            self.isDisputeLostAmountEditable = isDisputeLostAmountEditable;
            self.isLostBill(isLostBill);

            // Notifies to parent view model about the changes
            self.onChangesMade = function (dirty) {
                changesMade(dirty);
            };
            self.selectedItemTypes(selectedType);

            self.id = ko.observable(0);

            if (refSystem.isObject(selectedType)) {
                if (selectedType.ItemId !== "10") {
                    self.userDescription(selectedType.AccessorialDescription);
                }
            }

            // Handles the visibility of some of the fields like class, weight
            self.disposables.push(self.isShippingItem = ko.computed(function () {
                return (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === "10");
            }));

            // Handles the visibility of some of the fields like class, weight
            self.disposables.push(self.isShippingItemMiscellaneous = ko.computed(function () {
                if (!self.isEnable()) {
                    return (false);
                } else {
                    return ((self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemId) || (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemIdMiscellaneousFee) || (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemIdCorrectedInvocingFee) || (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reclass) || (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reclassfee) || (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reweigh) || (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ReweighANDReclass) || (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reweighfee));
                }
            }));

            //#region Validation Rules
            self.cost.extend({
                required: {
                    message: 'Cost is required.',
                    onlyIf: function () {
                        return (self.ValidateVendorBillItem() || (self.id() === 1 && self.allowvalidation()) || self.selectedItemTypes() === undefined);
                    }
                },
                number: true
            });

            self.selectedItemTypes.extend({
                required: {
                    message: 'Please Choose Item Type.',
                    onlyIf: function () {
                        return (self.ValidateVendorBillItem() || (self.id() === 1 && self.allowvalidation()) || self.selectedItemTypes() === undefined);
                    }
                }
            });

            self.userDescription.extend({
                required: {
                    message: 'Description is required.',
                    onlyIf: function () {
                        return self.isShippingItemMiscellaneous();
                    }
                }
            });

            self.disputeAmount.extend({
                max: {
                    params: 1,
                    message: 'Amount should not be greater than cost.',
                    onlyIf: function () {
                        if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70") {
                            return (self.cost() != null && self.disputeAmount() != null && (Number(parseFloat(self.cost().toString().replace(/,/g, "")) * -1) < parseFloat(self.disputeAmount().toString().replace(/,/g, ""))));
                        } else if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === "10") {
                            return (self.shippingAndDiscountCost() != null && self.disputeAmount() != null && (parseFloat(self.shippingAndDiscountCost().toString().replace(/,/g, "")) < parseFloat(self.disputeAmount().toString().replace(/,/g, ""))));
                        } else {
                            return (self.cost() != null && self.disputeAmount() != null && (parseFloat(self.cost().toString().replace(/,/g, "")) < parseFloat(self.disputeAmount().toString().replace(/,/g, ""))));
                        }
                    }
                },
                number: true
            });

            //self.disputeLostAmount.extend({
            //	required: {
            //		message: 'Dispute lost amount is required.',
            //		onlyIf: () => {return self.isDisputeLostAmountEditable}
            //	},
            //	max: {
            //		params: 1,
            //		message: 'Amount should not be greater than dispute amount.',
            //		onlyIf: () => {
            //            return (self.disputeLostAmount() != null && self.disputeAmount() != null && (parseFloat(self.disputeAmount().toString().replace(/,/g, "")) < parseFloat(self.disputeLostAmount().toString().replace(/,/g, ""))));
            //		}
            //	},
            //	number: true
            //});
            self.disputeLostAmount.extend({
                //required: {
                //	message: 'Dispute lost amount is required.',
                //	onlyIf: () => {
                //		return (self.isDisputeLostAmountEditable)
                //	}
                //},
                max: {
                    params: 1,
                    message: 'Amount should not be greater than dispute amount.',
                    onlyIf: function () {
                        return (self.disputeLostAmount() != null && self.disputeAmount() != null && (parseFloat(self.disputeAmount().toString().replace(/,/g, "")) < parseFloat(self.disputeLostAmount().toString().replace(/,/g, ""))));
                    }
                }
            });

            //#endregion Validation Rules
            // The vendors item bill object
            self.errorVendorItemDetail = ko.validatedObservable({
                selectedItemTypes: self.selectedItemTypes,
                cost: self.cost,
                userDescription: self.userDescription,
                selectedItemTypes: self.selectedItemTypes,
                disputeAmount: self.disputeAmount,
                disputeLostAmount: self.disputeLostAmount
            });

            self.SetBITrackChange(self);

            self.getBITrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            self.disposables.push(self.isBIDirty = ko.computed(function () {
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
            }));

            // Subscribe to update the UI
            self.disposables.push(self.cost.subscribe(function () {
                if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70" && parseFloat(self.cost().toString()) > 0 && !self.isLostBill()) {
                    self.cost(Number(parseFloat(self.cost().toString()) * -1).toFixed(2));
                }

                costOrWeightChanged();
            }));

            // Subscribe to update the UI
            self.disposables.push(self.disputeAmount.subscribe(function () {
                if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70" && parseFloat(self.disputeAmount().toString()) > 0) {
                    self.disputeAmount(Number(parseFloat(self.disputeAmount().toString()) * 1).toFixed(2));
                }

                costOrWeightChanged();
            }));

            self.disposables.push(self.disputeLostAmount.subscribe(function () {
                if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70" && parseFloat(self.disputeLostAmount().toString()) > 0) {
                    self.disputeLostAmount(Number(self.disputeLostAmount().toString() * 1).toFixed(2));
                }

                costOrWeightChanged();
            }));

            // Subscribe to update the UI
            self.disposables.push(self.weight.subscribe(function () {
                costOrWeightChanged();
            }));

            // Subscribe to update the UI
            self.disposables.push(self.pieceCount.subscribe(function () {
                costOrWeightChanged();
            }));

            // Subscribe to change the cost as negative if that is discount
            self.disposables.push(self.selectedItemTypes.subscribe(function () {
                if (self.cost() && self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70" && parseFloat(self.cost().toString()) > 0) {
                    self.cost(Number(parseFloat(self.cost().toString()) * -1).toFixed(2));
                } else if (self.cost() && parseFloat(self.cost().toString()) < 0) {
                    self.cost(Number(parseFloat(self.cost().toString()) * -1).toFixed(2));
                }

                if (self.disputeAmount() && self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70" && parseFloat(self.disputeAmount().toString()) > 0) {
                    self.disputeAmount(Number(parseFloat(self.disputeAmount().toString()) * -1).toFixed(2));
                } else if (self.disputeAmount() && parseFloat(self.disputeAmount().toString()) < 0) {
                    self.disputeAmount(Number(parseFloat(self.disputeAmount().toString()) * -1).toFixed(2));
                }

                if (self.disputeLostAmount() && self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70" && parseFloat(self.disputeLostAmount().toString()) > 0) {
                    self.disputeLostAmount(Number(parseFloat(self.disputeLostAmount().toString()) * -1).toFixed(2));
                } else if (self.disputeLostAmount() && parseFloat(self.disputeLostAmount().toString()) < 0) {
                    self.disputeLostAmount(Number(parseFloat(self.disputeLostAmount().toString()) * -1).toFixed(2));
                }

                if (self.selectedItemTypes() && self.selectedItemTypes().ItemId !== "10") {
                    // ##START: US21290
                    self.userDescription(self.selectedItemTypes().AccessorialDescription);
                    // ##END: US21290
                } else {
                    //if(self.userDescription()!=="")
                    //	self.userDescription(self.userDescription());
                    //else
                    self.userDescription("");
                }

                costOrWeightChanged();
            }));

            // Subscribe to update the UI
            self.disposables.push(self.disputeAmount.subscribe(function () {
                costOrWeightChanged();
            }));

            return self;
        }
        //#endregion Constructor
        //#region Private Methods
        // Validates all the properties for an item
        VendorBillItemsModel.prototype.ValidateVendorBillItem = function () {
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
        VendorBillItemsModel.prototype.checkValidation = function () {
            var self = this;
            if (self.errorVendorItemDetail.errors().length != 0) {
                self.errorVendorItemDetail.errors.showAllMessages();
                return true;
            } else {
                return false;
            }
        };

        // get the item view model
        VendorBillItemsModel.prototype.initializeVendorBillItem = function (item, enable, shipperAndDiscountCost, isLostBill) {
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
                self.disputeAmount(($.number((item.DisputeAmount), 2)).replace(/,/g, ""));
                self.disputeLostAmount(($.number((item.DisputeLostAmount), 2)).replace(/,/g, ""));
                self.isLostBill(isLostBill);
                self.isEnable(enable);
                if (shipperAndDiscountCost !== 0) {
                    self.shippingAndDiscountCost(($.number((shipperAndDiscountCost), 2)).replace(/,/g, ""));
                }
                //self.SetBITrackChange(self);
            }
        };

        //To populate the Vendor Bill Items.
        VendorBillItemsModel.prototype.populateVendorBillItem = function (item) {
            var self = this;

            // This will prevent to detect the changes at first time
            self.isNotAtLoadingTime = true;
            if (item != null) {
                self.id(item.id());
                self.cost(item.cost().replace(/,/g, ""));
                self.pieceCount(item.pieceCount());
                self.selectedClassType(item.selectedClassType());
                self.weight(item.weight());
                self.dimensionLength(item.dimensionLength());
                self.dimensionWidth(item.dimensionWidth());
                self.dimensionHeight(item.dimensionHeight());
                self.userDescription(item.userDescription());
                self.selectedPackageType(item.selectedPackageType());
                self.disputeAmount(item.disputeAmount().replace(/,/g, ""));
                self.disputeLostAmount(item.disputeLostAmount().replace(/,/g, ""));
                self.SetBITrackChange(self);
            }

            // This will stop detecting the changes
            self.isNotAtLoadingTime = false;
        };

        // this function is used to convert formatted cost with decimal(Two Place).
        VendorBillItemsModel.prototype.formatDecimalNumber = function (field) {
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
        VendorBillItemsModel.prototype.SetBITrackChange = function (self) {
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

        //#endregion Public Methods
        //#region Clean Up
        VendorBillItemsModel.prototype.cleanUp = function () {
            var self = this;

            try  {
                self.disposables.forEach(function (item) {
                    item.dispose();
                    delete item;
                });

                self.cost.extend({ validatable: false });
                self.selectedItemTypes.extend({ validatable: false });
                self.userDescription.extend({ validatable: false });
                self.disputeAmount.extend({ validatable: false });
                self.disputeLostAmount.extend({ validatable: false });

                for (var prop in self) {
                    if (typeof self[prop].dispose === "function") {
                        self[prop].dispose();
                    }
                    delete self[prop];
                }

                delete self;
            } catch (exception) {
            }
        };
        return VendorBillItemsModel;
    })();
    exports.VendorBillItemsModel = VendorBillItemsModel;
});
