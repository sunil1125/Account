/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/models/common/Enums', 'board/Edi210SubBillItemModel', 'services/client/BoardsClient'], function(require, exports, ___router__, ___app__, __refEnums__, __refEdi210SubBillItemModel__, __refBoardsClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    var refEnums = __refEnums__;
    
    
    
    
    
    
    
    var refEdi210SubBillItemModel = __refEdi210SubBillItemModel__;
    var refBoardsClient = __refBoardsClient__;

    /*
    ** <summary>
    ** Holds the model for Edi210 corrected and duplicate.
    ** </summary>
    ** <createDetails>
    ** <id></id> <by></by> <date></date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US26886</id> <by>Vasanthakumar</by> <date>14-02-2017</date> <description>Acct: SS Item Selection form Corrected & Duplicate Exception Board</description>
    ** </changeHistory>
    */
    var Edi210CarrierExceptionSubBillItemView = (function () {
        //#endregion
        //#region Constructor
        // Initialize the VendorBillItemViewModel
        function Edi210CarrierExceptionSubBillItemView() {
            //#region Members
            this.boardClient = new refBoardsClient.BoardsClientCommands();
            this.vendorBillItemsList = ko.observableArray([]);
            this.classTypes = ko.observableArray([]);
            this.packageTypes = ko.observableArray([]);
            this.shipmentItemTypes = ko.observableArray([]);
            this.itemCodeANSICodeList = ko.observableArray([]);
            this.itemCodeCarrierCodeList = ko.observableArray([]);
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
            var self = this;

            //self.costOrWeightChanged = costOrWeightChangedCallBack;
            //self.keyListenerCallback = keyListenerCallback;
            //set the flag allowdecimal: true to accepts decimals
            self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(true) };

            self.GetANSICodeORCarrierCode();

            // initialize the Add command
            self.onAdd = function () {
                var shipmentItemTypesLength = self.shipmentItemTypes().length;
                if ((shipmentItemTypesLength)) {
                    var result = $.grep(self.shipmentItemTypes(), function (e) {
                        return e.ItemId === "10";
                    })[0];
                    self.vendorBillItemsList.push(new refEdi210SubBillItemModel.Models.Edi210SubBillItemModel(result, function () {
                        self.updateTotalCostAndWeight();
                    }, self.onChangesMadeInItem, self.isEnable()));
                }

                self.onChangesMadeInItem(true);

                if (self.isAllCheckedForDelete())
                    self.isAllCheckedForDelete(false);
            };
            self.canDelete = ko.computed(function () {
                var isAnySelected = false;

                // Check if any one item is selected for deletion
                self.vendorBillItemsList().forEach(function (item) {
                    if (item.isMarkForDeletion()) {
                        isAnySelected = true;
                    }
                });
                return isAnySelected;
            });
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

            //self.beforeBind();
            //#region Computed css classes based on Dispute Amount
            self.descColCssClass = ko.computed(function () {
                if (self.isDisputeAmountVisible()) {
                    return 'width - percent - 16';
                } else {
                    return 'width - percent - 35';
                }
            });

            self.descTextValidCssClass = ko.computed(function () {
                if (self.isDisputeAmountVisible()) {
                    return '91%';
                } else {
                    return '96%';
                }
            });

            self.descTextNotValidCssClass = ko.computed(function () {
                if (self.isDisputeAmountVisible()) {
                    return '89.6%';
                } else {
                    return '85.5%';
                }
            });

            self.isTabPress = function (data, event) {
                var charCode = (event.which) ? event.which : event.keyCode;
                if ((charCode === 9)) {
                    var rowCount = $('#tblVendorBillItems').find("tbody tr").length;
                    var index = event.target.id;
                    if (rowCount === +index) {
                        //self.keyListenerCallback();
                    }
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
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        Edi210CarrierExceptionSubBillItemView.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //The composition engine will execute it prior to calling the binder.
        Edi210CarrierExceptionSubBillItemView.prototype.activate = function () {
            return true;
        };

        // Gets the all needed values like ENUMs
        Edi210CarrierExceptionSubBillItemView.prototype.beforeBind = function () {
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
            //self.addDefaultItems();
        };

        // Shows the message box as pr the given title and message
        Edi210CarrierExceptionSubBillItemView.prototype.showConfirmationMessage = function (message, title, fisrtButtoName, secondButtonName, yesCallBack, noCallBack) {
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
        Edi210CarrierExceptionSubBillItemView.prototype.validateItems = function () {
            var self = this;
            var isInvalid = false;

            if (self.vendorBillItemsList().length > 0) {
                self.vendorBillItemsList().forEach(function (item) {
                    if (!item.selecteditemCodeANSICode() && !item.selecteditemCodesCarrierID()) {
                        item.mappedCode("");
                    }

                    if (item.checkValidation()) {
                        isInvalid = true;
                    }
                });

                if (self.vbTotalCost() <= 0) {
                    isInvalid = true;

                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 5,
                        fadeOut: 5,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, "Total cost should be greater than 0", "info", null, toastrOptions);
                }
            }

            return isInvalid;
        };

        // to load the vendor bill item details
        Edi210CarrierExceptionSubBillItemView.prototype.initializeVendorBillItemDetails = function (items, isDisputeAmountEditable, isDisputeLostAmountEditable, enable) {
            var self = this;
            self.isNotAtLoadingTime = true;

            //self.isDisputeAmountVisible(true);
            //self.isDisputeAmountEditable(isDisputeAmountEditable);
            //self.isDisputeLostAmountEditable(isDisputeLostAmountEditable);
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

            if (items != null && items.length != 0) {
                for (var i = 0; i < items.length; i++) {
                    var item = $.grep(self.shipmentItemTypes(), function (e) {
                        return e.ItemId === items[i].ItemId.toString();
                    })[0];
                    var vendorItem = new refEdi210SubBillItemModel.Models.Edi210SubBillItemModel(item, function () {
                        self.updateTotalCostAndWeight();
                    }, self.onChangesMadeInItem, isDisputeAmountEditable, isDisputeLostAmountEditable, self.isEnable());

                    if (items[i].ItemId === 10 && typeof Utils.Constants.ShipingServiceANSICode !== "undefined") {
                        items[i].SpecialChargeOrAllowanceCode = Utils.Constants.ShipingServiceANSICode;
                    }

                    if (items[i].SpecialChargeOrAllowanceCode != "" && items[i].SpecialChargeOrAllowanceCode != null) {
                        var code = $.grep(self.itemCodeANSICodeList(), function (e) {
                            return e.Code === items[i].SpecialChargeOrAllowanceCode;
                        })[0];

                        if (code === undefined || code === null) {
                            code = $.grep(self.itemCodeCarrierCodeList(), function (e) {
                                return e.Code === items[i].SpecialChargeOrAllowanceCode;
                            })[0];
                        }

                        if (typeof (code) !== "undefined" && code !== null)
                            vendorItem.selecteditemCodeANSICode(code);
                    }
                    vendorItem.initializeVendorBillItem(items[i], self.isEnable(), totalShippingAndDiscountCost);
                    self.vendorBillItemsList.push(vendorItem);
                }
            } else {
                self.addDefaultItems();
            }

            self.updateTotalCostAndWeight();
            self.isNotAtLoadingTime = false;
        };

        Edi210CarrierExceptionSubBillItemView.prototype.GetANSICodeORCarrierCode = function () {
            var _this = this;
            var self = this;
            self.boardClient.GetAllCodeDescriptionStandardMappings(function (dataCode) {
                if (dataCode) {
                    var self = _this;
                    self.itemCodeANSICodeList.removeAll();
                    self.itemCodeANSICodeList.push.apply(self.itemCodeANSICodeList, dataCode);
                }
            }, function () {
            });
        };

        //
        Edi210CarrierExceptionSubBillItemView.prototype.GetCarrierCode = function (carrierId) {
            var _this = this;
            var self = this;
            self.boardClient.GetCarrierItemCodeMappingBasedonCarrierID(carrierId, function (dataCode) {
                if (dataCode) {
                    var self = _this;
                    self.itemCodeCarrierCodeList.removeAll();
                    self.itemCodeCarrierCodeList.push.apply(self.itemCodeCarrierCodeList, dataCode);
                }
            }, function () {
            });
        };

        ////To Populate the vendor bill items.  items: VendorBillItemViewModel
        //public populateItemsDetails(items: VendorBillItemViewModel) {
        //    var self = this;
        //    self.addExistingItem(items.vendorBillItemsList);
        //}
        //#endregion Public Methods
        //#region Private methods
        Edi210CarrierExceptionSubBillItemView.prototype.addExistingItem = function (items) {
            var self = this;

            self.vendorBillItemsList.removeAll();
            if (items && typeof items === 'function') {
                items().forEach(function (item) {
                    var result = item.selectedItemTypes();
                    var itemToAdd = new refEdi210SubBillItemModel.Models.Edi210SubBillItemModel(result, function () {
                        self.updateTotalCostAndWeight();
                    }, self.onChangesMadeInItem);
                    itemToAdd.cost(item.cost());
                    itemToAdd.weight(item.weight());
                    itemToAdd.pieceCount(item.pieceCount());
                    itemToAdd.selectedClassType(item.selectedClassType());
                    itemToAdd.dimensionHeight(item.dimensionHeight());
                    itemToAdd.dimensionLength(item.dimensionLength());
                    itemToAdd.dimensionWidth(item.dimensionWidth());
                    itemToAdd.selectedPackageType(item.selectedPackageType());
                    itemToAdd.selectedItemTypes(item.selectedItemTypes());
                    itemToAdd.userDescription(item.userDescription());
                    self.vendorBillItemsList.push(itemToAdd);
                });
            }
            self.updateTotalCostAndWeight();
        };

        // Updates the main view as per the change in the items
        Edi210CarrierExceptionSubBillItemView.prototype.updateTotalCostAndWeight = function () {
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

                if (item.selectedItemTypes().ItemId === "10" || item.selectedItemTypes().ItemId === "70") {
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
            });

            //self.costOrWeightChanged(totalCost, totalweight, totalPices, totalDisputeCost);
            self.vbTotalCost($.number(totalCost, 2));
            self.vbTotalWeight(totalweight);
            self.shipperAndDiscountCost($.number(totalShippingAndDiscountCost, 2));
        };

        // Adds default line items first time
        Edi210CarrierExceptionSubBillItemView.prototype.addDefaultItems = function (carrierType) {
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

                    //var discountItem = $.grep(self.shipmentItemTypes(), function (e) { return e.ItemId === "70"; })[0];
                    //var fuelItem = $.grep(self.shipmentItemTypes(), function (e) { return e.ItemId === "30"; })[0];
                    self.vendorBillItemsList.push(new refEdi210SubBillItemModel.Models.Edi210SubBillItemModel(shipingItem, function () {
                        self.updateTotalCostAndWeight();
                    }, self.onChangesMadeInItem));
                    //self.vendorBillItemsList.push(new refEdi210SubBillItemModel.Models.Edi210SubBillItemModel(discountItem, function () { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem)); // Discount
                    //self.vendorBillItemsList.push(new refEdi210SubBillItemModel.Models.Edi210SubBillItemModel(fuelItem, function () { self.updateTotalCostAndWeight(); }, self.onChangesMadeInItem)); // Fuel charge
                }
            }
        };
        return Edi210CarrierExceptionSubBillItemView;
    })();
    exports.Edi210CarrierExceptionSubBillItemView = Edi210CarrierExceptionSubBillItemView;
});
