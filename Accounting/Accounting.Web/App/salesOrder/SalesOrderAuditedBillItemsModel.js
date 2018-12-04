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
    ** <changeHistory>
    ** <id>DE22259</id> <by>Shreesha Adiga</by> <date>22-03-2016</date><description>Show Long description instead of short description for item</description>
    ** </changeHistory>
    */
    (function (Models) {
        var SalesOrderAuditedBillItemsModel = (function () {
            //#endregion
            //#region Constructor
            function SalesOrderAuditedBillItemsModel(selectedType, selectChanged) {
                //#region Members
                this.id = ko.observable(0);
                this.items = ko.observable(0);
                this.itemId = ko.observable(0);
                this.totalcheck = ko.observable(0);
                this.selectedItemTypes = ko.observable();
                this.selectedShippmentItemTypes = ko.observable();
                this.cost = ko.observable();
                this.pieceCount = ko.observable();
                this.selectedClassType = ko.observable();
                this.weight = ko.observable();
                this.dimensionLength = ko.observable();
                this.dimensionWidth = ko.observable();
                this.dimensionHeight = ko.observable();
                this.userDescription = ko.observable();
                this.selectedPackageType = ko.observable();
                this.isCheck = ko.observable(false);
                var self = this;

                if (refSystem.isObject(selectedType)) {
                    self.selectedItemTypes(selectedType);

                    //##START: DE22259
                    self.selectedShippmentItemTypes(selectedType.LongDescription);
                    //##END: DE22259
                }

                //self.items(selectedType.ItemClassId);
                self.id = ko.observable(0);

                if (refSystem.isObject(selectedType)) {
                    if (selectedType.ItemId !== Constants.ApplicationConstants.ShippingItemId) {
                        self.userDescription(selectedType.ShortDescription);
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

                // Subscribe to update the UI
                self.isCheck.subscribe(function (newvalue) {
                    selectChanged();
                });
                return self;
            }
            //#endregion Constructor
            //#region Private Methods
            // get the item view model
            SalesOrderAuditedBillItemsModel.prototype.initializeSalesOrderAuditedBillItem = function (item, totalcheck) {
                var self = this;
                self.totalcheck(totalcheck);
                if (item != null) {
                    self.id(item.Id);
                    self.itemId(item.ItemId);
                    self.cost($.number((item.Cost), 2));
                    self.pieceCount(item.ItemId === 10 ? item.PieceCount : 0);
                    self.selectedClassType(item.SelectedClassType);
                    self.weight(item.Weight);
                    self.dimensionLength(item.DimensionLength);
                    self.dimensionWidth(item.DimensionWidth);
                    self.dimensionHeight(item.DimensionHeight);
                    self.userDescription(item.UserDescription);
                    self.selectedPackageType(item.PackageTypeId);
                    self.isCheck(item.isChecked);
                }
            };

            // this function is used to convert formatted cost with decimal(Two Place).
            SalesOrderAuditedBillItemsModel.prototype.formatDecimalNumber = function (field) {
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

            SalesOrderAuditedBillItemsModel.prototype.cleanUp = function () {
                var self = this;

                for (var property in self) {
                    delete self[property];
                }

                delete self;
            };
            return SalesOrderAuditedBillItemsModel;
        })();
        Models.SalesOrderAuditedBillItemsModel = SalesOrderAuditedBillItemsModel;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
