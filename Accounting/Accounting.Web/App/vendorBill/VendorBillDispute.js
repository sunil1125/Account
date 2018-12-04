/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/models/common/Enums', 'services/validations/Validations', 'services/client/SalesOrderClient', 'services/models/salesOrder/DisputeVendorBill', 'services/models/salesOrder/VendorBillDisputeContainer', 'services/models/vendorBill/VendorBillItemDetails', 'services/models/salesOrder/SalesOrderShipmentRequoteReason'], function(require, exports, ___router__, ___app__, __refEnums__, __refValidations__, __refSalesOrderClient__, __refSalesOrderDisputeVendorBill__, __refSalesOrderVendorBillDisputeContainer__, __refSalesOrderItemModel__, __refSalesOrderShipmentRequoteReasonModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refEnums = __refEnums__;
    var refValidations = __refValidations__;
    var refSalesOrderClient = __refSalesOrderClient__;
    var refSalesOrderDisputeVendorBill = __refSalesOrderDisputeVendorBill__;
    var refSalesOrderVendorBillDisputeContainer = __refSalesOrderVendorBillDisputeContainer__;
    var refSalesOrderItemModel = __refSalesOrderItemModel__;
    var refSalesOrderShipmentRequoteReasonModel = __refSalesOrderShipmentRequoteReasonModel__;
    

    //#endregion
    /***********************************************
    Vendor Bill Dispute ViewModel
    ************************************************
    ** <summary>
    ** Vendor Bill Dispute ViewModel
    ** </summary>
    ** <createDetails>
    ** <id></id><by>Satish</by><date>21st Jan, 2015</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US20352</id> <by>Chandan Singh Bajetha</by> <date>14-01-2016</date> <description>Acct: Adjust UI for Dispute Notes Tab in Vendor Bill</description>
    ** <id>DE22259</id> <by>Shreesha Adiga</by> <date>22-03-2016</date><description>Select item based on itemid and accessorial id</description>
    ** <id>DE22259</id> <by>Shreesha Adiga</by> <date>22-03-2016</date><description>Updated accessorialId to VB item before saving dispute</description>
    ** <id>US22053</id> <by>Shreesha Adiga</by> <date>10-05-2016</date><description>To track whether dispute was saved from VB dispute tab</description>
    ** <id>US25153</id> <by>Shreesha Adiga</by> <date>20-10-2016</date><description>Changes realted to Credit Adjustment (Items Not Integrated With Mas)</description>
    ** <id>DE25602</id> <by>Vasanthakumar</by> <date>18-01-2017</date><description>If item id and accessorial id is zero then Credit adjustment line item is inserted in the order</description>
    ** </changeHistory>
    
    ***********************************************/
    var VendorBillisputeViewModel = (function () {
        // ##END: US25153
        //#endregion
        //#regionCONSTRUCTOR
        function VendorBillisputeViewModel() {
            //#region MEMBERS
            //For Bill Status list
            this.billStatusList = ko.observableArray([]);
            //Bill status id for bind selected bill
            this.billstatuId = ko.observable();
            //Total Dispute amount
            this.totalDisputeAmount = ko.observable('0.00');
            //For Vendor BIll Dispute Date
            this.VBDisputeDate = ko.observable('');
            //Dispute Notes for Vendor BIll
            this.disputeNotes = ko.observable('');
            //For Header PRO Number
            this.proNumberHeader = ko.observable('');
            //Flag for Check is bill Status Is dispute or not
            this.isBillStatusDispute = ko.observable(false);
            //Sales Order Total Cost of item for bind in right side Vendor BIll
            this.salesOrderTotalCost = ko.observable('0.00');
            //Sales Order Total Pay of item for bind in right side Vendor BIll
            this.salesOrderTotalPayAmount = ko.observable('0.00');
            //for enable or disable save button
            this.isSelected = ko.observable(false);
            //Creating Reference of Dispute Vendor bill details Item model
            this.DisputeVendorBillItemsModel = ko.observableArray([]);
            // shipment item types
            this.shipmentItemTypes = ko.observableArray([]);
            this.vendorBillId = ko.observable(0);
            this.updatedDate = ko.observable('');
            // ###START: US20352
            this.salesOrderStatusTypes = ko.observableArray([]);
            this.selectedStatusType = ko.observable();
            //selectedStatusType: KnockoutObservable<IDisputeStatus> = ko.observable();
            this.disputeStatusID = ko.observable(0);
            this.commonUtils = new Utils.Common();
            //For sales Order client for call save and get data
            this.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
            this.listProgress = ko.observable(false);
            this.disposables = [];
            // ##START: US25153
            this.itemsNotIntegratedWithMas = [];
            var self = this;

            //set the flag allow decimal: true to accepts decimals
            self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(false) };

            //To set The date picker options
            self.datepickerOptions = {
                blockWeekend: true,
                blockPreviousDays: false,
                blockHolidaysDays: true,
                autoClose: true,
                placeBelowButton: false
            };

            // ###START: US20352
            // Load all ship via if not loaded already
            var salesOrderStatusTypes = self.salesOrderStatusTypes().length;
            if (!(salesOrderStatusTypes)) {
                _app.trigger("GetDisputeStatusList", function (data) {
                    if (data) {
                        self.salesOrderStatusTypes.removeAll();
                        self.salesOrderStatusTypes.push.apply(self.salesOrderStatusTypes, data);
                        //if (data.DisputeStatusId.ID) {
                        //	self.selectedStatusType(data.DisputeStatusId.ID);
                        //}
                    }
                });
            }

            if (typeof self.itemsNotIntegratedWithMas !== "undefined" && self.itemsNotIntegratedWithMas.length === 0) {
                _app.trigger("GetItemsNotIntegratedWithMas", function (items) {
                    if (items) {
                        self.itemsNotIntegratedWithMas = self.itemsNotIntegratedWithMas.concat(items);
                    }
                });
            }

            // ##END: US25153
            //Validate total Dispute Amount
            self.totalDisputeAmount.extend({
                max: {
                    params: 1,
                    message: ApplicationMessages.Messages.InvalidTotalCost,
                    onlyIf: function () {
                        return (parseFloat(self.salesOrderTotalCost().toString().replace(",", "")) < parseFloat(self.totalDisputeAmount().toString()));
                    }
                },
                number: true
            });

            ////Validate Dispute Date
            self.VBDisputeDate.extend({
                required: {
                    message: 'A valid Dispute Date is required.',
                    onlyIf: function () {
                        return (self.isBillStatusDispute());
                    }
                }
            });

            //Validating Dispute notes
            self.disputeNotes.extend({
                required: {
                    message: 'A valid Dispute Notes is required',
                    onlyIf: function () {
                        return (self.isBillStatusDispute());
                    }
                }
            });

            //#region Error Details Object
            self.errorVendorBillDispute = ko.validatedObservable({
                VBDisputeDate: self.VBDisputeDate,
                disputeNotes: self.disputeNotes
            });

            //#endregion
            //// Subscribe to change the cost as negative if that is discount
            //self.billstatuId.subscribe(() => {
            //	if (self.billstatuId() === 3) {
            //		self.isBillStatusDispute(true);
            //	} else {
            //		self.isBillStatusDispute(false);
            //	}
            //});
            // ###START: US230352
            // selected Dispute Status
            self.selectedStatusType.subscribe(function (selectedStatus) {
                self.disputeStatusID(selectedStatus);
            });

            // ###END: US20352
            return self;
        }
        //#endregion
        //#region METHODS
        //Click On Save For vendor Bill Dispute
        VendorBillisputeViewModel.prototype.onSave = function () {
            var self = this;
            if (self.errorVendorBillDispute.errors().length === 0) {
                self.isSelected(false);
                self.listProgress(true);

                var salesOrderDisputeVendorBillContainer = new refSalesOrderVendorBillDisputeContainer.Models.VendorBillDisputeContainer();

                // ###START: US20352
                var disputeStatus = {
                    ID: self.disputeStatusID(),
                    Value: 'test'
                };
                salesOrderDisputeVendorBillContainer.DisputeStatusId = disputeStatus;

                // ###END: US20352
                salesOrderDisputeVendorBillContainer.DisputeVendorBill = self.getSalesOrderDisputeVendorBillDetails();
                salesOrderDisputeVendorBillContainer.VendorBillItemsDetail = self.getDisputeSalesOrderItemDetails();
                salesOrderDisputeVendorBillContainer.CanSaveReasonCodes = self.isBillStatusDispute();

                //##START: US22053
                salesOrderDisputeVendorBillContainer.IsSavedFromVB = true;

                //##END: US22053
                self.salesOrderClient.SaveSalesOrderDisputeVBDetails(salesOrderDisputeVendorBillContainer, function () {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };
                    self.listProgress(false);
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SavedSuccessfullyMessage, "success", null, toastrOptions);
                    self.callReloadVendorBill();
                }, function (message) {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };
                    self.listProgress(false);
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
                });
            } else {
                self.errorVendorBillDispute.errors.showAllMessages();
                self.listProgress(false);
            }

            return false;
        };

        //initialize Vendor Bill Item after select click
        VendorBillisputeViewModel.prototype.initializeDisputeItem = function (data, vendorBillId, isEnable, enable) {
            var self = this;

            if (data.DisputeStatusId) {
                self.selectedStatusType(data.DisputeStatusId.ID);
            }

            // ###END: US20352
            self.vendorBillId(vendorBillId);
            if (data != null) {
                self.billStatusList(data.DisputeVendorBill[0].ListOfBillStatuses);
                self.billstatuId(data.DisputeVendorBill[0].BillStatus);
                self.disputeNotes(data.DisputeVendorBill[0].DisputeNotes);
                self.totalDisputeAmount(data.DisputeVendorBill[0].DisputedAmount);
                self.VBDisputeDate(data.DisputeVendorBill[0].DisputedDate ? self.commonUtils.formatDate(data.DisputeVendorBill[0].DisputedDate.toString(), 'mm/dd/yyyy') : '');
                self.proNumberHeader(data.DisputeVendorBill[0].ProNumber);
                self.updatedDate(data.DisputeVendorBill[0].UpdatedDate);
                if (data.DisputeVendorBill[0].MasTransferDate !== null) {
                    self.isSelected(false);
                }

                var shipmentItemTypesLength = self.shipmentItemTypes().length;
                if (!(shipmentItemTypesLength)) {
                    _app.trigger("GetItemsTypes", function (items) {
                        self.shipmentItemTypes.removeAll();
                        self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
                    });
                }
                self.DisputeVendorBillItemsModel.removeAll();
                data.VendorBillItemsDetail.forEach(function (item) {
                    if (item.VendorBillId === self.vendorBillId()) {
                        // ##START: US25153
                        var selectedItem;

                        if (item.ItemId === 0 && item.AccessorialId === 0 && self.itemsNotIntegratedWithMas) {
                            selectedItem = $.grep(self.itemsNotIntegratedWithMas, function (e) {
                                return e.ShortDescription === item.UserDescription;
                            })[0];

                            if (typeof selectedItem !== "undefined")
                                self.shipmentItemTypes.push.apply(self.shipmentItemTypes, self.itemsNotIntegratedWithMas);
                        }

                        if (typeof selectedItem === "undefined") {
                            selectedItem = $.grep(self.shipmentItemTypes(), function (e) {
                                return e.ItemId === item.ItemId.toString() && (e.AccessorialId == null || item.AccessorialId == 0 || e.AccessorialId == item.AccessorialId);
                            })[0];
                        }

                        if (typeof selectedItem === "undefined" || selectedItem == null) {
                            selectedItem = $.grep(self.shipmentItemTypes(), function (e) {
                                return e.ItemId === item.ItemId.toString();
                            })[0];
                        }

                        //##END: DE22259
                        self.DisputeVendorBillItemsModel.push(new DisputeVendorBillItemsModel(selectedItem, item, function () {
                            self.updateTotalCostPayDisputeAmount();
                        }, data.ReasonCodes));

                        // ##START: US25153
                        selectedItem = undefined;
                        // ##END: US25153
                    }
                });

                if (enable) {
                    self.isBillStatusDispute(!enable);
                } else {
                    self.isBillStatusDispute(!isEnable);
                }

                // Update the totals in the totals section
                self.updateTotalCostPayDisputeAmount();
            }
        };

        //Get Vendor bill details For
        VendorBillisputeViewModel.prototype.getSalesOrderDisputeVendorBillDetails = function () {
            var self = this;
            var salesOrderDisputeDetails;
            salesOrderDisputeDetails = ko.observableArray([])();
            var vendorBillDisputeData = new refSalesOrderDisputeVendorBill.Models.DisputeVendorBill();
            vendorBillDisputeData.DisputedDate = self.VBDisputeDate();
            vendorBillDisputeData.DisputedAmount = parseFloat(self.totalDisputeAmount());
            vendorBillDisputeData.DisputeNotes = self.disputeNotes();
            vendorBillDisputeData.BillStatus = self.billstatuId();
            vendorBillDisputeData.VendorBillId = self.vendorBillId();
            vendorBillDisputeData.UpdatedDate = self.updatedDate();
            salesOrderDisputeDetails.push(vendorBillDisputeData);
            return salesOrderDisputeDetails;
        };

        // Gets the vendor bill Item details for save
        VendorBillisputeViewModel.prototype.getDisputeSalesOrderItemDetails = function () {
            var self = this;
            var salesOrderDisputeItems;
            salesOrderDisputeItems = ko.observableArray([])();

            self.DisputeVendorBillItemsModel().forEach(function (item) {
                var salesOrderDisputreVBItem = new refSalesOrderItemModel.Models.VendorBillItemDetails();
                salesOrderDisputreVBItem.Id = item.id();
                salesOrderDisputreVBItem.Cost = item.cost();
                salesOrderDisputreVBItem.ItemId = item.selectedItemTypeId();
                salesOrderDisputreVBItem.UserDescription = item.description();
                salesOrderDisputreVBItem.DisputeAmount = item.disputeAmount();
                salesOrderDisputreVBItem.VendorBillId = self.vendorBillId();
                salesOrderDisputreVBItem.ReasonNote = item.reasonNotes();
                salesOrderDisputreVBItem.SelectedReasonCodes = item.selectedReasonCode();

                //##START: DE22259
                salesOrderDisputreVBItem.AccessorialId = item.accessorialId() == null ? 0 : item.accessorialId();

                //##END: DE22259
                salesOrderDisputeItems.push(salesOrderDisputreVBItem);
            });
            return salesOrderDisputeItems;
        };

        //For add total cost , dispute and pay
        VendorBillisputeViewModel.prototype.updateTotalCostPayDisputeAmount = function () {
            var self = this;

            var totalCost = 0.0, totalDisputeCost = 0.0, totalPay = 0.0;

            self.DisputeVendorBillItemsModel().forEach(function (item) {
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
                if (item.pay()) {
                    if (item.selectedItemTypeId() === 70) {
                        var costWithoutComma = item.pay().toString();
                        var check = costWithoutComma.indexOf(",");
                        if (check === -1) {
                            totalPay += parseFloat(item.pay().toString()) * (-1);
                        } else {
                            //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                            totalPay += parseFloat(costWithoutComma.replace(/,/g, "")) * (-1);
                        }
                    } else {
                        var costWithoutComma = item.pay().toString();
                        var check = costWithoutComma.indexOf(",");
                        if (check === -1) {
                            totalPay += parseFloat(item.pay().toString());
                        } else {
                            //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                            totalPay += parseFloat(costWithoutComma.replace(/,/g, ""));
                        }
                    }
                }
                if (item.disputeAmount()) {
                    var costWithoutComma = item.disputeAmount().toString();
                    var check = costWithoutComma.indexOf(",");
                    if (check === -1) {
                        totalDisputeCost += parseFloat(item.disputeAmount().toString());
                    } else {
                        //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                        totalDisputeCost += parseFloat(costWithoutComma.replace(/,/g, ""));
                    }
                }
            });

            //bind all total Cost, pay and dispute
            self.salesOrderTotalCost(totalCost.toFixed(2));
            self.salesOrderTotalPayAmount(totalPay.toFixed(2));
            self.totalDisputeAmount(totalDisputeCost.toFixed(2));
        };

        // Converting if date is not valid
        VendorBillisputeViewModel.prototype.convertToVBDisputeDate = function () {
            var self = this;
            if (!self.VBDisputeDate().match('/') && self.VBDisputeDate().length > 0) {
                self.VBDisputeDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.VBDisputeDate()));
            }
        };

        VendorBillisputeViewModel.prototype.cleanup = function () {
            var self = this;
            try  {
                self.disposables.forEach(function (disposable) {
                    if (disposable && typeof disposable.dispose === "function") {
                        disposable.dispose();
                    } else {
                        delete disposable;
                    }
                });

                self.DisputeVendorBillItemsModel().forEach(function (items) {
                    items.cleanup();
                    delete items;
                });

                for (var prop in self) {
                    delete self[prop];
                }
                //delete self;
            } catch (e) {
            }
        };
        return VendorBillisputeViewModel;
    })();
    exports.VendorBillisputeViewModel = VendorBillisputeViewModel;

    var DisputeVendorBillItemsModel = (function () {
        function DisputeVendorBillItemsModel(selectedItem, item, payvalueChanged, reasonCodes) {
            this.id = ko.observable();
            this.item = ko.observable('');
            this.selectedItemTypeId = ko.observable();
            //##START: DE22259
            this.accessorialId = ko.observable();
            //##END: DE22259
            this.description = ko.observable('');
            this.disputedDate = ko.observable('');
            this.cost = ko.observable(0);
            this.pay = ko.observable(0);
            this.disputeAmount = ko.observable(0);
            this.reasonNotes = ko.observable('');
            this.reasonCodesListFoBinding = ko.observableArray([]);
            this.selectedReasonCode = ko.observable();
            this.commonUtils = new Utils.Common();
            this.disposables = [];
            var self = this;
            self.id(item.Id);
            self.item(selectedItem ? selectedItem.LongDescription : '');
            self.selectedItemTypeId(item.ItemId);
            self.description(item.UserDescription);

            //##START: DE22259
            self.accessorialId(selectedItem ? selectedItem.AccessorialId : 0);

            //##END: DE22259
            self.cost($.number(item.Cost, 2));
            self.pay($.number((item.Cost - item.DisputeAmount), 2));
            self.reasonNotes(item.ReasonNote);

            self.reasonCodesListFoBinding.removeAll();

            reasonCodes.forEach(function (reasonCodeItem) {
                self.reasonCodesListFoBinding.push(new refSalesOrderShipmentRequoteReasonModel.Model.SalesOrderShipmentRequoteReason(reasonCodeItem));
            });

            if (item.SelectedReasonCodes !== null && item.SelectedReasonCodes !== undefined) {
                var selectedReasonCodeItem = $.grep(self.reasonCodesListFoBinding(), function (e) {
                    return e.Remarks === item.SelectedReasonCodes.Remarks;
                })[0];
                self.selectedReasonCode(selectedReasonCodeItem);
            }

            self.reasonNotes(item.ReasonNote);
            self.disposables.push(self.pay.subscribe(function () {
                if (typeof (payvalueChanged) === 'function') {
                    if (self.selectedItemTypeId() === 70) {
                        self.disputeAmount($.number(((+item.Cost) + (+self.pay())), 2));
                    } else {
                        self.disputeAmount($.number((item.Cost - self.pay()), 2));
                    }
                    payvalueChanged();
                }
            }));
            self.disputeAmount($.number(item.DisputeAmount, 2));
            return self;
        }
        DisputeVendorBillItemsModel.prototype.cleanup = function () {
            var self = this;
            try  {
                self.disposables.forEach(function (disposable) {
                    if (disposable && typeof disposable.dispose === "function") {
                        disposable.dispose();
                    } else {
                        delete disposable;
                    }
                });

                for (var prop in self) {
                    if (typeof self[prop].dispose === "function") {
                        self[prop].dispose();
                    }

                    delete self[prop];
                }
                //delete self;
            } catch (e) {
            }
        };
        return DisputeVendorBillItemsModel;
    })();
    exports.DisputeVendorBillItemsModel = DisputeVendorBillItemsModel;
});
