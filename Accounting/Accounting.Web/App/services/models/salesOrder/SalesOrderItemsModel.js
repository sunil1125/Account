/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/utils.ts" />
/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../../../../Scripts/Constants/ApplicationMessages.ts" />
/// <reference path="../../../../Scripts/Constants/ApplicationConstants.ts" />
/// <reference path="../../validations/Validations.ts" />
define(["require", "exports", 'durandal/system', 'services/validations/Validations'], function(require, exports, __refSystem__, __refValidations__) {
    var refSystem = __refSystem__;
    var refValidations = __refValidations__;

    (function (Models) {
        var SalesOrderItemsModel = (function () {
            //#endregion
            //#region Constructor
            function SalesOrderItemsModel(selectedType, costOrWeightChanged, changesMade, hazardousChanged) {
                //#region Members
                this.id = ko.observable(0);
                this.selectedItemTypes = ko.observable();
                this.cost = ko.observable();
                this.rev = ko.observable();
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
                this.isHazardous = ko.observable(false);
                this.hazmatUnNumber = ko.observable('');
                this.packingGroup = ko.observable('');
                this.hazardousClass = ko.observable();
                this.nmfc = ko.observable();
                this.itemsList = ko.observableArray([]);
                this.isNotAtLoadingTime = false;
                var self = this;

                // Notifies to parent view model about the changes
                self.onChangesMade = function (dirty) {
                    changesMade(dirty);
                };

                self.selectedItemTypes(selectedType);

                self.id = ko.observable(0);

                if (refSystem.isObject(selectedType)) {
                    if (selectedType.ItemId !== Constants.ApplicationConstants.ShippingItemId) {
                        self.userDescription(selectedType.ShortDescription);
                    }
                }

                // Handles the visibility of some of the fields like class, weight
                self.isShippingItem = ko.computed(function () {
                    return (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemId);
                });

                //#region Validation Rules
                self.cost.extend({
                    required: {
                        message: ApplicationMessages.Messages.CostRequired,
                        onlyIf: function () {
                            return ((self.SalesOrderItems() || (self.id() === 1 && self.allowvalidation())));
                        }
                    },
                    number: true
                });

                self.rev.extend({
                    required: {
                        message: ApplicationMessages.Messages.RevenueRequired,
                        onlyIf: function () {
                            return ((self.SalesOrderItems() || (self.id() === 1 && self.allowvalidation())));
                        }
                    },
                    number: true
                });

                self.selectedItemTypes.extend({
                    required: {
                        message: ApplicationMessages.Messages.ChooseItemType,
                        onlyIf: function () {
                            return (self.SalesOrderItems() || (self.id() === 1 && self.allowvalidation()));
                        }
                    }
                });

                self.userDescription.extend({
                    required: {
                        message: ApplicationMessages.Messages.DescriptionRequired,
                        onlyIf: function () {
                            return (self.SalesOrderItems() || (self.id() === 1 && self.allowvalidation()) || self.isHazardous());
                        }
                    }
                });

                self.packingGroup.extend({
                    required: {
                        message: ApplicationMessages.Messages.PackingGroupRequired
                    }
                });

                self.hazardousClass.extend({
                    required: {
                        message: ApplicationMessages.Messages.HazmatClassRequired
                    },
                    validation: {
                        validator: function () {
                            return refValidations.Validations.NumericValidation.prototype.ValidNumberMinMax(self.hazardousClass(), Constants.ApplicationConstants.MinimumValueForHazardousClass, Constants.ApplicationConstants.MaximumValueForHazardousClass);
                        },
                        message: ApplicationMessages.Messages.HazmatClassMinMax
                    }
                });

                self.hazmatUnNumber.extend({
                    required: {
                        message: ApplicationMessages.Messages.HazmatUnNumberRequired
                    }
                });

                //#endregion Validation Rules
                // The vendors item bill object
                self.errorSalesOrderItemDetail = ko.validatedObservable({
                    selectedItemTypes: self.selectedItemTypes,
                    cost: self.cost,
                    rev: self.rev,
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
                    result2 = self.rev();
                    result2 = self.selectedClassType();
                    result2 = self.weight();

                    if (self.isNotAtLoadingTime)
                        return false;

                    var returnValue = self.getBITrackChange().length > 0 ? true : false;
                    if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
                        self.onChangesMade(returnValue);

                    return returnValue;
                });

                // Subscribe to update the UI
                self.cost.subscribe(function () {
                    if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.DiscountItemId && parseFloat(self.cost().toString()) > 0) {
                        self.cost(parseFloat(self.cost().toString()) * -1);
                    }

                    costOrWeightChanged();
                });

                // Subscribe to update the UI
                self.rev.subscribe(function () {
                    if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.DiscountItemId && parseFloat(self.rev().toString()) > 0) {
                        self.rev(parseFloat(self.rev().toString()) * -1);
                    }

                    costOrWeightChanged();
                });

                // Subscribe to update the UI
                self.weight.subscribe(function () {
                    costOrWeightChanged();
                });

                // Subscribe to update the UI
                self.pieceCount.subscribe(function () {
                    costOrWeightChanged();
                });

                // Subscribe to change the cost as negative if that is discount
                self.selectedItemTypes.subscribe(function () {
                    if (self.cost() && self.selectedItemTypes() && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.DiscountItemId && parseFloat(self.cost().toString()) > 0) {
                        self.cost(parseFloat(self.cost().toString()) * -1);
                    } else if (self.cost() && parseFloat(self.cost().toString()) < 0) {
                        self.cost(parseFloat(self.cost().toString()) * -1);
                    }

                    if (self.rev() && self.selectedItemTypes() && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.DiscountItemId && parseFloat(self.rev().toString()) > 0) {
                        self.rev(parseFloat(self.rev().toString()) * -1);
                    } else if (self.rev() && parseFloat(self.rev().toString()) < 0) {
                        self.rev(parseFloat(self.rev().toString()) * -1);
                    }

                    if (self.selectedItemTypes() && self.selectedItemTypes().ItemId !== Constants.ApplicationConstants.ShippingItemId) {
                        self.userDescription(self.selectedItemTypes().ShortDescription);
                    } else {
                        self.userDescription("");
                    }
                    costOrWeightChanged();
                });

                // Subscribe when hazardous item checked.
                self.isHazardous.subscribe(function (newValue) {
                    self.itemsList.push(self);
                    hazardousChanged();
                });

                //To check if enter value is digit and decimal
                self.isNumber = function (data, event) {
                    var charCode = (event.which) ? event.which : event.keyCode;

                    if ((charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57))) {
                        return false;
                    }
                    return true;
                };

                return self;
            }
            //#endregion Constructor
            //#region Private Methods
            // Validates all the properties for an item
            SalesOrderItemsModel.prototype.SalesOrderItems = function () {
                if (!this.allowvalidation()) {
                    return false;
                }

                if (refSystem.isObject(this.selectedItemTypes()) || (this.cost.length > 0) || (this.rev.length > 0) || (this.pieceCount.length > 0) || (this.selectedClassType.length > 0) || (this.weight.length > 0) || (refSystem.isString(this.dimensionLength()) && this.dimensionLength()) || (refSystem.isString(this.dimensionWidth()) && this.dimensionWidth()) || (refSystem.isString(this.dimensionHeight()) && this.dimensionHeight()) || (refSystem.isString(this.userDescription()) && this.userDescription())) {
                    return true;
                }

                return false;
            };

            //#endregion Private Methods
            //#region Public Methods
            // Check validation for each line item
            SalesOrderItemsModel.prototype.checkValidation = function () {
                var self = this;
                if (self.errorSalesOrderItemDetail.errors().length != 0) {
                    self.errorSalesOrderItemDetail.errors.showAllMessages();
                    return true;
                } else {
                    return false;
                }
            };

            // get the item view model
            SalesOrderItemsModel.prototype.initializeVendorBillItem = function (item) {
                var self = this;
                if (item != null) {
                    self.id(item.Id);
                    self.cost($.number((item.Cost), 2));
                    self.rev($.number((item.Revenue), 2));
                    self.pieceCount(item.ItemId === 10 ? item.Pieces : 0);
                    self.selectedClassType(item.SelectedClassType);
                    self.weight(item.Weight);
                    self.dimensionLength(item.Length);
                    self.dimensionWidth(item.Width);
                    self.dimensionHeight(item.Height);
                    self.userDescription(item.UserDescription);
                    self.selectedPackageType(item.PackageTypeId);
                    self.nmfc(item.NMFC);
                    self.selectedClassType(item.Class);
                    //self.SetBITrackChange(self);
                }
            };

            //To populate the SalesOrder Items.
            SalesOrderItemsModel.prototype.populateVendorBillItem = function (item) {
                var self = this;

                // This will prevent to detect the changes at first time
                self.isNotAtLoadingTime = true;
                if (item != null) {
                    self.id(item.id());
                    self.cost(item.cost());
                    self.rev(item.rev());
                    self.pieceCount(item.pieceCount());
                    self.selectedClassType(item.selectedClassType());
                    self.weight(item.weight());
                    self.dimensionLength(item.dimensionLength());
                    self.dimensionWidth(item.dimensionWidth());
                    self.dimensionHeight(item.dimensionHeight());
                    self.userDescription(item.userDescription());
                    self.selectedPackageType(item.selectedPackageType());
                    self.nmfc(item.nmfc());
                    self.selectedClassType(item.selectedClassType());
                    self.SetBITrackChange(self);
                }

                // This will stop detecting the changes
                self.isNotAtLoadingTime = false;
            };

            // this function is used to convert formatted cost with decimal(Two Place).
            SalesOrderItemsModel.prototype.formatDecimalNumber = function (field) {
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
            SalesOrderItemsModel.prototype.SetBITrackChange = function (self) {
                self.selectedItemTypes.extend({ trackChange: true });
                self.userDescription.extend({ trackChange: true });
                self.cost.extend({ trackChange: true });
                self.rev.extend({ trackChange: true });
                self.selectedClassType.extend({ trackChange: true });
                self.weight.extend({ trackChange: true });
                self.dimensionLength.extend({ trackChange: true });
                self.dimensionWidth.extend({ trackChange: true });
                self.dimensionHeight.extend({ trackChange: true });
                self.pieceCount.extend({ trackChange: true });
                self.selectedPackageType.extend({ trackChange: true });
            };
            return SalesOrderItemsModel;
        })();
        Models.SalesOrderItemsModel = SalesOrderItemsModel;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
