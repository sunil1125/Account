/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../Scripts/utils.ts" />
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
/// <reference path="../../Scripts/Constants/ApplicationConstants.ts" />
/// <reference path="../services/validations/Validations.ts" />
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    var refSystem = __refSystem__;
    

    /*
    ** <summary>
    ** </summary>
    ** <createDetails>
    ** <id></id> <by></by> <date></date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>DE21018</id> <by>Chandan Singh</by> <date>16/12/2015</date>
    ** <id>US22366</id> <by>Baldev Singh Thakur</by> <date>24-05-2016</date>
    ** </changeHistory>
    */
    (function (Models) {
        var SalesOrderReBillItemsModel = (function () {
            // ###END: US22366
            //#endregion
            //#region Constructor
            function SalesOrderReBillItemsModel(selectedType, selectChanged) {
                //#region Members
                this.id = ko.observable(0);
                this.items = ko.observable(0);
                this.itemId = ko.observable(0);
                this.totalcheck = ko.observable(0);
                this.selectedItemTypes = ko.observable();
                this.selectedShippmentItemTypes = ko.observable();
                this.cost = ko.observable();
                this.rev = ko.observable();
                this.originalRevenue = ko.observable();
                this.pieceCount = ko.observable();
                this.palletCount = ko.observable();
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
                this.bSCost = ko.observable();
                this.salesOrderId = ko.observable(0);
                this.accessorialId = ko.observable(0);
                this.productCode = ko.observable();
                this.BOLNumber = ko.observable('');
                this.itemsList = ko.observableArray([]);
                this.isNotAtLoadingTime = false;
                this.isPallet = false;
                this.isPiece = false;
                this.isCheck = ko.observable(false);
                this.totalRow = ko.observable('');
                this.isHazTotal = ko.observable(true);
                // ###START: US22366
                this.PackageTypeId = ko.observable(0);
                var self = this;

                if (refSystem.isObject(selectedType)) {
                    self.selectedItemTypes(selectedType);
                    self.selectedShippmentItemTypes(selectedType.LongDescription);
                }

                //self.items(selectedType.ItemClassId);
                self.id = ko.observable(0);

                if (refSystem.isObject(selectedType)) {
                    if (selectedType.ItemId !== Constants.ApplicationConstants.ShippingItemId) {
                        self.userDescription(selectedType.LongDescription);
                    }
                }

                //To check if enter value is digit and decimal
                self.isNumber = function (data, event) {
                    var charCode = (event.which) ? event.which : event.keyCode;

                    if (event.ctrlKey && (charCode == 99 || charCode == 67)) {
                        return true;
                    }
                    if ((charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57))) {
                        return false;
                    }
                    return true;
                };

                // ###START: DE21018
                //// Subscribe to update the UI
                //self.rev.subscribe(() => {
                //	if (self.BOLNumber() !== "Total") {
                //		// If the selected item is a discount then show the negative cost
                //		if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.DiscountItemId && parseFloat(self.rev().toString()) > 0) {
                //			self.rev(Number(parseFloat(self.rev().toString()) * -1).toFixed(2));
                //		}
                //	}
                //});
                // ###START: DE21018
                self.isCheck.subscribe(function (newvalue) {
                    selectChanged();
                });
                return self;
            }
            //#endregion Constructor
            //#region Private Methods
            // get the item view model
            SalesOrderReBillItemsModel.prototype.initializeSalesOrderItem = function (item, totalcheck, isHaz) {
                var self = this;
                self.totalcheck(totalcheck);
                if (item != null) {
                    self.id(item.Id);
                    self.itemId(item.ItemId);
                    self.cost($.number((item.Cost), 2));
                    self.rev($.number((item.Revenue), 2));
                    self.originalRevenue($.number((item.Revenue), 2));
                    self.pieceCount(item.ItemId === 10 ? item.PieceCount : 0);
                    self.weight(item.Weight);
                    self.dimensionLength(item.Length);
                    self.dimensionWidth(item.Width);
                    self.dimensionHeight(item.Height);
                    self.userDescription(item.UserDescription);
                    self.selectedPackageType(item.PackageTypeId);
                    self.nmfc(item.NMFC);
                    self.selectedClassType(item.Class);
                    self.palletCount(item.PalletCount);
                    self.isHazardous(item.Hazardous);
                    self.hazmatUnNumber(item.HazardousUNNo);
                    self.hazardousClass(item.HazmatClass);
                    self.packingGroup(item.PackingGroupNo);
                    self.bSCost(item.PLCCost);
                    self.isCheck(item.isChecked);
                    self.items(item.Items);
                    self.salesOrderId(item.SalesOrderId);
                    self.accessorialId(item.AccessorialId);
                    self.productCode(item.ProductCode);
                    self.BOLNumber(item.BOLNumber);
                    self.isHazTotal(isHaz);

                    // ###START: US22366
                    self.PackageTypeId(item.PackageTypeId);
                    // ###END: US22366
                    //self.SetBITrackChange(self);
                }
            };

            SalesOrderReBillItemsModel.prototype.initializeTotal = function (totalRevenue, totalCost, totalPices, totalweight, totalPlcCost, isHaz, itemId) {
                var self = this;
                self.id(0);
                self.itemId(null);
                self.BOLNumber('Total');
                self.rev($.number(totalRevenue, 2));
                self.cost($.number(totalCost, 2));
                self.originalRevenue(null);
                self.pieceCount(totalPices);
                self.weight(totalweight);
                self.dimensionLength(null);
                self.dimensionWidth(null);
                self.dimensionHeight(null);
                self.userDescription('');
                self.selectedPackageType(null);
                self.nmfc('');
                self.selectedClassType(null);
                self.palletCount(null);
                self.isHazardous(null);
                self.hazmatUnNumber('');
                self.hazardousClass(null);
                self.packingGroup('');
                self.bSCost($.number(totalPlcCost, 2));
                self.isCheck(null);
                self.items(null);
                self.salesOrderId(null);
                self.accessorialId(null);
                self.productCode(null);
                self.selectedShippmentItemTypes('');
                self.totalRow('rebillTotal');
                self.isHazTotal(isHaz);
                //self.SetBITrackChange(self);
            };

            // this function is used to convert formatted cost with decimal(Two Place).
            SalesOrderReBillItemsModel.prototype.formatDecimalNumber = function (field) {
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

            SalesOrderReBillItemsModel.prototype.cleanup = function () {
                var self = this;
                self.itemsList.removeAll();
                self.rev.rules.removeAll();
                self.isCheck.rules.removeAll();
            };
            return SalesOrderReBillItemsModel;
        })();
        Models.SalesOrderReBillItemsModel = SalesOrderReBillItemsModel;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
