/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app'], function(require, exports, ___router__, ___app__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    
    
    

    //#endregion
    /*
    ** <summary>
    ** Display of Duplicate Bill Items.
    ** </summary>
    ** <createDetails>
    ** <id>US13250</id> <by>Chandan</by> <date>11-27-2014</date>}
    ** </createDetails>}
    ** <changeHistory>}
    ** <id>US26632</id> <by>Vasanthakumar</by> <date>31-01-2017</date><description>Acct: Implement Select All check box</description>
    ** <id>DE25900</id> <by>Vasanthakumar</by> <date>20-02-2017</date><description>EDI Corrected or Duplicate PRO: Unable to unselect all the items with Select all check box</description>
    ** <id>US34697</id> <by>Vasanthakumar</by> <date>16-07-2018</date><description>EDI Corrected or Duplicate PRO: Allow to select Zero cost items</description>
    ** </changeHistory>
    */
    var Edi210CarrierExceptionDuplicateBillItemViewModel = (function () {
        // ##END: US26632
        //#endregion
        //#region CONSTRUCTOR
        function Edi210CarrierExceptionDuplicateBillItemViewModel(itemSelectionCallBack, checkBoxSelectionCallBack) {
            //#region MEMBERS
            this.ediDuplicateItemsList = ko.observableArray([]);
            this.totalCost = ko.observable(0);
            this.totalDifferenceCost = ko.observable(0);
            this.selected = ko.observable(false);
            this.html = ko.observable('');
            this.name = ko.observable('Select All');
            this.selectedLineItems = ko.observableArray([]);
            this.isDifferenceAmountAvailable = false;
            this.isDiscountSelected = false;
            this.isShippingServiceSelected = false;
            this.isCount = false;
            // ##START: US26632
            this.isSelectAll = ko.observable(false);
            this.isCallingFromSelectAll = ko.observable(false);
            this.isCallingFromGrid = ko.observable(false);
            var self = this;

            if (typeof (itemSelectionCallBack) !== 'undefined') {
                self.itemSelectionCallBack = itemSelectionCallBack;
            }

            if (typeof (checkBoxSelectionCallBack) !== 'undefined') {
                self.checkBoxSelectionCallBack = checkBoxSelectionCallBack;
            }

            // ##START: US26632
            self.isSelectAll.subscribe(function (newvalue) {
                if (self.isCallingFromGrid()) {
                    return;
                }
                self.isCallingFromSelectAll(true);
                self.ediDuplicateItemsList().forEach(function (item) {
                    if ($.number(item.differenceAmount(), 2) !== "0.00" || $.number(item.cost(), 2) == "0.00") {
                        item.isCheck(newvalue);
                    }
                });
                self.isCallingFromSelectAll(false);
            });

            // ##END: US26632
            return self;
            //#endregion
        }
        //#region Public Method
        Edi210CarrierExceptionDuplicateBillItemViewModel.prototype.initilizeDuplicateItems = function (items) {
            var self = this;
            self.ediDuplicateItemsList.removeAll();
            items.forEach(function (item) {
                if (item.Difference !== 0 || (item.Cost == 0 && item.Difference == 0)) {
                    self.isDifferenceAmountAvailable = true;
                } else {
                    self.isDifferenceAmountAvailable = false;
                }
                self.ediDuplicateItemsList.push(new ediDuplicateItemsModel(item, function () {
                    self.itemCheck();
                }, function () {
                    self.checkBoxSelectionCallBack();
                }));
            });

            // ##START: US26632
            self.isSelectAll(false);

            // ##END: US26632
            self.updateTotalCostAndWeight();
        };

        //#endregion Public Method
        //#region Private Method
        Edi210CarrierExceptionDuplicateBillItemViewModel.prototype.updateTotalCostAndWeight = function () {
            var self = this;

            var totalCost = 0.0, totalDifferenceCost = 0.0;

            self.ediDuplicateItemsList().forEach(function (item) {
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

                if (item.differenceAmount()) {
                    var differenceCostWithoutComma = item.differenceAmount().toString();
                    var check = differenceCostWithoutComma.indexOf(",");
                    if (check === -1) {
                        totalDifferenceCost += parseFloat(item.differenceAmount().toString());
                    } else {
                        totalDifferenceCost += parseFloat(differenceCostWithoutComma.replace(/,/g, ""));
                    }
                }
            });

            self.totalCost($.number(totalCost, 2));
            self.totalDifferenceCost($.number(totalDifferenceCost, 2));
        };

        Edi210CarrierExceptionDuplicateBillItemViewModel.prototype.itemCheck = function () {
            var self = this;
            var item = 0;
            var count = $.grep(self.ediDuplicateItemsList(), function (e) {
                return e.isCheck();
            });

            // ##START: US26632
            var countAllAvailable = $.grep(self.ediDuplicateItemsList(), function (e) {
                return e.differenceAmount() !== "0.00" || e.cost() == "0.00";
            });

            if (!self.isCallingFromSelectAll()) {
                self.isCallingFromGrid(true);
                if (count.length == countAllAvailable.length) {
                    self.isSelectAll(true);
                } else {
                    self.isSelectAll(false);
                }
                self.isCallingFromGrid(false);
            }

            if (count.length == self.ediDuplicateItemsList().length) {
                self.selected(true);
                self.html('<i class="icon-ok icon-white active"></i>' + self.name());
            } else {
                self.selected(false);
            }

            count.forEach(function (selectedItem) {
                selectedItem.isSelectedItem(true);
                if (selectedItem.itemId() === 10) {
                    if (!self.isDiscountSelected) {
                        self.isShippingServiceSelected = true;
                        self.ediDuplicateItemsList().forEach(function (item) {
                            if (item.itemId() === 70 && !item.isCheck() && item.differenceAmount().toString() !== "0.00" || item.cost().toString() == "0.00") {
                                item.isCheck(true);
                                self.isDiscountSelected = true;
                            }
                        });
                    }
                } else if (selectedItem.itemId() === 70) {
                    if (!self.isShippingServiceSelected) {
                        self.isDiscountSelected = true;
                        self.ediDuplicateItemsList().forEach(function (item) {
                            if (item.itemId() === 10 && !item.isCheck() && item.differenceAmount().toString() !== "0.00" || item.cost().toString() == "0.00") {
                                item.isCheck(true);
                                self.isShippingServiceSelected = true;
                            }
                        });
                    }
                }
            });

            self.ediDuplicateItemsList().forEach(function (item) {
                if (item.itemId() === 10 && !item.isCheck() && item.differenceAmount().toString() !== "0.00" || item.cost().toString() == "0.00") {
                    self.ediDuplicateItemsList().forEach(function (item) {
                        if (item.itemId() === 70) {
                            self.isShippingServiceSelected = false;
                            item.isCheck(false);
                        }
                    });
                } else if (item.itemId() === 70 && !item.isCheck() && item.differenceAmount().toString() !== "0.00" || item.cost().toString() == "0.00") {
                    self.ediDuplicateItemsList().forEach(function (item) {
                        if (item.itemId() === 10) {
                            self.isDiscountSelected = false;
                            item.isCheck(false);
                        }
                    });
                }

                if (item.itemId() === 10 && item.isCheck() === true && item.differenceAmount().toString() === "0.00") {
                    item.isCheck(true);
                }
            });

            count = $.grep(self.ediDuplicateItemsList(), function (e) {
                return e.isCheck();
            });

            self.itemSelectionCallBack(count);
            self.isDifferenceAmountAvailable = true;
        };

        //#region Private Method
        //#region LIFE CYCLE EVENT
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        Edi210CarrierExceptionDuplicateBillItemViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //The composition engine will execute it prior to calling the binder.
        Edi210CarrierExceptionDuplicateBillItemViewModel.prototype.activate = function () {
            return true;
        };

        //To load the registered data if any existed.
        Edi210CarrierExceptionDuplicateBillItemViewModel.prototype.beforeBind = function () {
            var self = this;
            //_app.trigger("loadMyData", function (data) {
            //	if (data) {
            //		self.load(data);
            //	} else {
            //	}
            //});
        };
        return Edi210CarrierExceptionDuplicateBillItemViewModel;
    })();
    exports.Edi210CarrierExceptionDuplicateBillItemViewModel = Edi210CarrierExceptionDuplicateBillItemViewModel;

    var ediDuplicateItemsModel = (function () {
        //#region CONSTRUCTOR
        function ediDuplicateItemsModel(item, selectChanged, onClickCheckBoxCallBack) {
            //#region MEMBERS
            this.items = ko.observable('');
            this.description = ko.observable('');
            this.cost = ko.observable(0);
            this.selectedClass = ko.observable(0);
            this.weight = ko.observable(0);
            this.pcs = ko.observable(0);
            this.dimensionLength = ko.observable(0);
            this.dimensionWidth = ko.observable(0);
            this.dimensionHeight = ko.observable(0);
            this.differenceAmount = ko.observable(0);
            this.isCheck = ko.observable(false);
            this.isSelectedItem = ko.observable(false);
            this.itemId = ko.observable(0);
            this.SpecialChargeOrAllowanceCode = ko.observable('');
            var self = this;
            self.onClickCheckBoxCallBack = onClickCheckBoxCallBack;
            if (typeof (item) !== 'undefined') {
                self.items(item.ItemName);
                self.description(item.UserDescription);
                self.cost($.number((item.Cost), 2));
                self.selectedClass(item.SelectedClassType);
                self.weight(item.Weight);
                self.pcs(item.PieceCount);
                self.dimensionLength(item.DimensionLength);
                self.dimensionWidth(item.DimensionWidth);
                self.dimensionHeight(item.DimensionHeight);
                self.differenceAmount($.number(item.Difference, 2));
                self.itemId(item.ItemId);
                self.SpecialChargeOrAllowanceCode(item.SpecialChargeOrAllowanceCode);
            }

            self.isCheck.subscribe(function (newvalue) {
                selectChanged();
                self.onClickCheckBoxCallBack();
            });

            return self;
            //#endregion
        }
        return ediDuplicateItemsModel;
    })();
    exports.ediDuplicateItemsModel = ediDuplicateItemsModel;
});
