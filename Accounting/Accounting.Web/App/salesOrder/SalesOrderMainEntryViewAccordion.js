/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/models/common/Enums', 'salesOrder/SalesOrderDetailsView', 'salesOrder/SalesOrderShippingView', 'salesOrder/SalesOrderAddressView', 'salesOrder/SalesOrderItemView', 'salesOrder/SalesOrderNotes', 'services/client/SalesOrderClient', 'services/models/salesOrder/SalesOrderAddress', 'salesOrder/SalesOrderHazmatView', 'services/models/common/searchAddressBook', 'salesOrder/SalesOrderMultileg', 'services/models/common/MapLocation', 'services/models/common/MapLocation', 'services/models/salesOrder/SalesOrderDetail', 'services/models/salesOrder/SalesOrderAddressDetail', 'services/models/salesOrder/SalesOrderItemDetail', 'services/models/salesOrder/SalesOrderTerminalAddress', 'services/models/salesOrder/SalesOrderMultilegCarrierDetail', 'services/models/salesOrder/SalesOrderNoteDetail', 'services/models/salesOrder/SalesOrderContainer'], function(require, exports, ___router__, ___app__, __refEnums__, __refSalesOrderDetailsViewModel__, __refSalesOrderShipping__, __refSalesOrderAddressViewModel__, __refSalesOrderItemViewModel__, __refSalesOrderNotesViewModel__, __refSalesOrderClient__, __refAddress__, __refSalesOrderHazmatViewModel__, __refAddressBookSearch__, __refSalesOrderMultilegViewModel__, __refShipperLocation__, __refconsigneeLocation__, __refSalesOrderDetailsModel__, __refSalesOrderAddressDetailModel__, __refSalesOrderItemDetailModel__, __refSalesOrderTerminalAddressModel__, __refSalesOrderMultilegCarrierDetailModel__, __refSalesOrderNotesModel__, __refSalesOrderContainerModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refEnums = __refEnums__;
    var refSalesOrderDetailsViewModel = __refSalesOrderDetailsViewModel__;
    var refSalesOrderShipping = __refSalesOrderShipping__;
    var refSalesOrderAddressViewModel = __refSalesOrderAddressViewModel__;
    var refSalesOrderItemViewModel = __refSalesOrderItemViewModel__;
    var refSalesOrderNotesViewModel = __refSalesOrderNotesViewModel__;
    var refSalesOrderClient = __refSalesOrderClient__;
    var refAddress = __refAddress__;
    
    
    var refSalesOrderHazmatViewModel = __refSalesOrderHazmatViewModel__;
    var refAddressBookSearch = __refAddressBookSearch__;
    var refSalesOrderMultilegViewModel = __refSalesOrderMultilegViewModel__;
    
    var refShipperLocation = __refShipperLocation__;
    var refconsigneeLocation = __refconsigneeLocation__;
    var refSalesOrderDetailsModel = __refSalesOrderDetailsModel__;
    var refSalesOrderAddressDetailModel = __refSalesOrderAddressDetailModel__;
    var refSalesOrderItemDetailModel = __refSalesOrderItemDetailModel__;
    var refSalesOrderTerminalAddressModel = __refSalesOrderTerminalAddressModel__;
    var refSalesOrderMultilegCarrierDetailModel = __refSalesOrderMultilegCarrierDetailModel__;
    var refSalesOrderNotesModel = __refSalesOrderNotesModel__;
    var refSalesOrderContainerModel = __refSalesOrderContainerModel__;

    //#endregion
    /*
    ** <summary>
    ** Sales Order Main Entry View Model Accordion.
    ** </summary>
    ** <createDetails>
    ** <id>US12130</id> <by>Chandan</by> <date>26-08-2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id>DE20559</id><by>SHREESHA ADIGA</by><date>24-11-2015</date><description>Calculate calendar days</description>
    ** <id>DE21792</id> <by>Vasanthakumar</by> <date>17-02-2016</date> <description>Loading service type based on carrier selected</description>
    ** <id>US22417</id> <by>Janakiram</by> <date>19-05-2016</date> <description>Chnaged model of CUstmerBol While saving</description>
    ** <id>DE23007</id> <by>Janakiram</by> <date>27-05-2016</date> <description>Added Total Pieces and weight values are populated in Shipping tab on entering details in the Items tab</description>
    ** <id>US22795</id> <by>Vasanthakumar</by> <date>22-06-2016</date> <description>Acct: Block Trucload Vendors for SO Entry Screen</description>
    ** <id>DE26476</id> <by>Baldev Singh Thakur</id> <date>18-04-2017</date> <description>Assigning the Estimated Due Date to model for saving it in database.</description>
    ** </changeHistory>
    */
    var SalesOrderMainEntryViewModelAccordion = (function () {
        //#endregion
        //#region Constructor
        function SalesOrderMainEntryViewModelAccordion() {
            //#region Members
            //public salesOrdertemViewModel: _refsalesOrderItem.
            // to show the progress bar
            this.listProgressAccordian = ko.observable(false);
            this.listProgressTabbed = ko.observable(false);
            this.multilegLinkVisiblity = ko.observable(false);
            //for validation
            this.isValidSalesOrder = false;
            this.isValidAddress = false;
            this.isValidItems = false;
            this.isValidHazmat = false;
            this.isValidShipping = false;
            this.isValidMultileg = false;
            this.isViewMessage = true;
            // To get the logged in user
            this.currentUser = ko.observable();
            this.isAccordion = ko.observable(false);
            // To enable save button
            this.isSetModelAndSave = ko.observable(true);
            this.ischange = ko.observable(false);
            this.isNotSaving = true;
            this.checkMsgDisplay = true;
            this.BOlNumber = '';
            // Utility class object
            this.CommonUtils = new Utils.Common();
            //Sales Order Client
            this.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
            var self = this;

            if (!self.currentUser()) {
                // Get the logged in user for name for new note}
                _app.trigger("GetCurrentUserDetails", function (currentUser) {
                    self.currentUser(currentUser);
                });
            }

            //self.salesOrderLinksViewModel = new refSalesOrderLinksViewModel.SalesOrderLinksViewModel();
            //self.salesOrderHistoryViewModel = new refSalesOrderHistoryViewModel.SalesOrderHistoryViewModel();
            self.salesOrderHazmatViewModel = new refSalesOrderHazmatViewModel.SalesOrderHazmatViewModel();
            self.salesOrderDetailsViewModel = new refSalesOrderDetailsViewModel.SalesOrderDetailsViewModel(function (customerId) {
                if (self.salesOrderAddressViewModel && self.salesOrderAddressViewModel.addressBookSerachViewModel)
                    //call service
                    var successCallBack = function (data) {
                        var BillToaddress = new refAddress.Models.SalesOrderAddress();
                        BillToaddress.CompanyName = data.CompanyName;
                        BillToaddress.Phone = data.Phone;
                        BillToaddress.Fax = data.Fax;
                        BillToaddress.Street = data.Street;
                        BillToaddress.Street2 = data.Street2;
                        BillToaddress.City = data.City;
                        BillToaddress.State = data.State;
                        BillToaddress.ZipCode = data.ZipCode;
                        BillToaddress.Country = data.CountryCode;
                        self.salesOrderAddressViewModel.populateBillToAddress(BillToaddress);
                        self.salesOrderAddressViewModel.addressBookSerachViewModel.name(new refAddressBookSearch.Models.AddressBookSearch());
                        self.salesOrderAddressViewModel.shipperCompanySearchList.customerId(self.salesOrderDetailsViewModel.customerSearchList.customerId());
                        self.salesOrderAddressViewModel.consigneeCompanySearchList.customerId(self.salesOrderDetailsViewModel.customerSearchList.customerId());
                    }, faliureCallBack = function () {
                    };

                self.salesOrderClient.getCustomerDefaultBillingAddress(customerId, successCallBack, faliureCallBack);
                self.salesOrderAddressViewModel.addressBookSerachViewModel.customerId(customerId);
            }, //Expand Address Accordion/Tab
            function () {
                if (self.isAccordion()) {
                    // TODO: add the code here for open the accordion after tab press or lost focus
                    self.expandView('collapseItems');
                    $('#itemsDiv').focus();
                } else {
                    self.collapseAllTabs();
                    $('#item').addClass('active in');
                    $('#itemLink').addClass('active');
                }
            }, function (shipBy) {
                if (self.salesOrderShippingViewModel) {
                    self.changeServiceType(shipBy);
                }
            }, self.currentUser(), true);

            // ###END: US22795
            self.salesOrderAddressViewModel = new refSalesOrderAddressViewModel.SalesOrderAddressViewModel(function (orignZip, destinationZip) {
                if (self.salesOrderDetailsViewModel) {
                    self.salesOrderDetailsViewModel.originZip(orignZip);
                    self.salesOrderDetailsViewModel.destinationZip(destinationZip);
                }
            }, function () {
                if (self.isAccordion()) {
                    // TODO: add the code here for open the accordion after tab press or lost focus
                    self.collapseView('collapseAddress');
                    self.expandView('collapseShipping');
                    $('#shippingDiv').focus();
                } else {
                    self.collapseAllTabs();
                    $('#shipping').addClass('active in');
                    $('#shippingLink').addClass('active');
                }
            });

            self.salesOrderShippingViewModel = new refSalesOrderShipping.salesOrderShippingViewModel(true, self.currentUser(), function () {
                if (self.isAccordion()) {
                    self.collapseView('collapseShipping');
                    self.expandView('collapseShipmentNotes');
                    $('#shippmentNotesDiv').focus();
                } else {
                    self.collapseAllTabs();
                    $('#shipmentNotes').addClass('active in');
                    $('#shipmentNotesLink').addClass('active');
                }
            }, function (carrierType) {
                if (carrierType === 3 || carrierType === 7) {
                    for (var i = 0; i < self.salesOrderItemViewModel.salesOrderItemsList().length; i++) {
                        if (self.salesOrderItemViewModel.salesOrderItemsList()[i].itemId() === 10) {
                            self.salesOrderItemViewModel.salesOrderItemsList()[i].isServiceTypeTruckload(false);
                        }
                        self.salesOrderItemViewModel.salesOrderItemsList()[i].carrierType(carrierType);
                        self.salesOrderItemViewModel.carrierType(carrierType);
                    }
                } else {
                    for (var i = 0; i < self.salesOrderItemViewModel.salesOrderItemsList().length; i++) {
                        if (self.salesOrderItemViewModel.salesOrderItemsList()[i].itemId() === 10) {
                            self.salesOrderItemViewModel.salesOrderItemsList()[i].isServiceTypeTruckload(true);
                        }
                        self.salesOrderItemViewModel.salesOrderItemsList()[i].carrierType(carrierType);
                        self.salesOrderItemViewModel.carrierType(carrierType);
                    }
                }
            });
            self.salesOrderNotesViewModel = new refSalesOrderNotesViewModel.SalesOrderNotesViewModel();
            self.salesOrderMultiLegViewModel = new refSalesOrderMultilegViewModel.SalesOrderMultiLegViewModel(false);
            self.salesOrderItemViewModel = new refSalesOrderItemViewModel.SalesOrderItemViewModel(function (totalCost, totalWeight, totalPices, totalRevenue) {
                //to update cost and revenue fields.
                self.salesOrderDetailsViewModel.salesOrderAmount(totalCost.toFixed(2));
                self.salesOrderDetailsViewModel.salesOrderRevenue(totalRevenue.toFixed(2));

                // ###START: DE23007
                self.salesOrderShippingViewModel.totalWeigth(totalWeight);
                self.salesOrderShippingViewModel.totalPieces(totalPices);
                // ###END: DE23007
            }, function () {
                if (self.isAccordion()) {
                    self.collapseView('collapseItems');
                    self.expandView('collapseAddress');
                    $('#addressDiv').focus();
                    $('#collapseAddress').css("overflow", "visible");
                } else {
                    self.collapseAllTabs();
                    $('#address').addClass('active in');
                    $('#addressLink').addClass('active');
                }
            }, //Hazmat item checked
            function (salesOrderItem) {
                self.salesOrderHazmatViewModel.initializeHazmatGrid(salesOrderItem, true);
            });

            //#region Subscribe functions
            self.salesOrderDetailsViewModel.proNumber.subscribe(function (newValue) {
                self.onMultilegClick();
            });

            self.salesOrderShippingViewModel.transitDays.subscribe(function (newValue) {
                self.onMultilegClick();
            });

            self.salesOrderDetailsViewModel.carrierSearchList.name.subscribe(function (newValue) {
                self.onMultilegClick();
            });

            ////##START: DE21792
            self.salesOrderDetailsViewModel.carrierSearchList.carrierType.subscribe(function (newvalue) {
                self.salesOrderShippingViewModel.selectedServiceType(newvalue);
            });

            ////##END: DE21792
            self.salesOrderDetailsViewModel.customerSearchList.name.subscribe(function (newValue) {
                self.onMultilegClick();
            });

            self.salesOrderAddressViewModel.shipperLocation.location.subscribe(function (newValue) {
                self.resetTerminalHubAddress();
                self.onMultilegClick();
            });

            self.salesOrderAddressViewModel.consigneeLocation.location.subscribe(function (newValue) {
                self.resetTerminalHubAddress();
                self.onMultilegClick();
            });

            //#endregion
            //#region change detection and enable save button based on changes
            // for Sales Order
            self.salesOrderDetailsViewModel.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            //For customer
            self.salesOrderDetailsViewModel.customerSearchList.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            //For carrier name
            self.salesOrderDetailsViewModel.carrierSearchList.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            // for address
            self.salesOrderAddressViewModel.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            // for shipper address
            self.salesOrderAddressViewModel.shipperLocation.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            //for consignee address
            self.salesOrderAddressViewModel.consigneeLocation.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            //for Item Details
            self.salesOrderItemViewModel.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            // for Sales Order Notes section
            self.salesOrderNotesViewModel.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            // for Sales Order Shipping
            self.salesOrderShippingViewModel.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            // for Sales Order Multileg
            self.salesOrderMultiLegViewModel.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            // for Sales Order Multileg
            self.salesOrderMultiLegViewModel.oceanCarrierSearchList.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            //Hazmat
            self.salesOrderHazmatViewModel.onChangesMade = function (dirty) {
                self.changesDetected(dirty);
            };

            //#endregion
            // To open Sales Order details
            self.viewDetail = function () {
                // opens the details tab or the current created bill
                _app.trigger("openSalesOrder", self.savedSalesOrderId, self.savedSalesOrderId.toString(), function (callback) {
                });
                return true;
            };

            //To check if Msg is clicked
            self.checkMsgClick = function () {
                self.checkMsgDisplay = true;
                self.isViewMessage = true;
            };

            // to Check if Msg is hidden or closed
            self.checkMsgHide = function () {
                self.checkMsgDisplay = true;
                self.isViewMessage = true;
            };

            //TO set grid column after browser resizing
            window.addEventListener("resize", resizeFunction);
            function resizeFunction() {
                if (self.salesOrderNotesViewModel.reportContainer != null) {
                    //on click we are calling this flag to show grid column resizebal as per browser window
                    self.salesOrderNotesViewModel.reportContainer.isAttachedToView(false);
                    self.salesOrderNotesViewModel.reportContainer.isAttachedToView(true);
                }
            }

            return self;
        }
        //#endregion
        //#region Public Methods
        //#region Save
        SalesOrderMainEntryViewModelAccordion.prototype.onSave = function () {
            var self = this;
            self.salesOrderDetailsViewModel.validateSalesOrder();
            self.salesOrderAddressViewModel.validateAddresses();
            self.salesOrderItemViewModel.validateItems();
            self.salesOrderShippingViewModel.validateShipping();
            self.salesOrderHazmatViewModel.validateHazmatItems();
            self.salesOrderHazmatViewModel.validateContact();
            if (self.isAccordion()) {
                self.validateAccordionView();
            } else {
                self.validateTabbedView(self.salesOrderDetailsViewModel.validateSalesOrder(), self.salesOrderAddressViewModel.validateAddresses(), self.salesOrderItemViewModel.validateItems(), self.salesOrderHazmatViewModel.validateHazmatItems(), self.salesOrderHazmatViewModel.validateContact(), self.salesOrderShippingViewModel.validateShipping(), self.salesOrderMultiLegViewModel.validateMultilegdetails());
            }

            if (self.salesOrderDetailsViewModel.selectedShipVia() === 5) {
                if (!(self.isValidSalesOrder && self.isValidAddress && self.isValidItems && self.isValidHazmat && self.isValidShipping && self.isValidMultileg)) {
                    return;
                } else {
                    if (self.isAccordion()) {
                        //self.collapseAchorVendorBill();
                        self.colapseAchorAddress();
                        self.colapseAchorItems();
                        self.colapseAchorShipping();
                        self.collapseView('collapseHazmat');
                    }
                    self.validateRevenue();
                }
            } else {
                if (!(self.isValidSalesOrder && self.isValidAddress && self.isValidItems && self.isValidHazmat && self.isValidShipping)) {
                    return;
                } else if (!self.validateForMauallyFinalizedStatus()) {
                    if (self.salesOrderShippingViewModel.pickupDate() === undefined || self.salesOrderShippingViewModel.pickupDate() === '') {
                        self.expandView('collapseShipping');
                    }
                    return;
                } else {
                    ;
                    if (self.isAccordion()) {
                        //self.collapseAchorVendorBill();
                        self.colapseAchorAddress();
                        self.colapseAchorItems();
                        self.colapseAchorShipping();
                        self.collapseView('collapseHazmat');
                    }
                    if (self.validateDeliverDate()) {
                        self.validateRevenue();
                    }
                }
            }
        };

        SalesOrderMainEntryViewModelAccordion.prototype.validateForMauallyFinalizedStatus = function () {
            var self = this;
            if (self.salesOrderDetailsViewModel.selectedOrderStatus() === refEnums.Enums.OrderStatus.ManuallyFinalized.ID) {
                if (self.salesOrderDetailsViewModel.proNumber() === '' || (self.salesOrderShippingViewModel.pickupDate() === undefined || self.salesOrderShippingViewModel.pickupDate() === '')) {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 30,
                        fadeOut: 30,
                        typeOfAlert: "",
                        title: ""
                    };
                    if (self.isViewMessage) {
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.ManuallyFinalizedValidation, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                        self.isViewMessage = false;
                    }

                    //to open shipping default view
                    $('#shipping').addClass('active in');
                    $('#shippingLink').addClass('active');
                    return false;
                }
                return true;
            } else {
                return true;
            }
        };

        // To validate Revenue and Cost
        SalesOrderMainEntryViewModelAccordion.prototype.validateRevenue = function () {
            var self = this;
            var totalRev = +self.salesOrderDetailsViewModel.salesOrderRevenue();
            var totalCost = +self.salesOrderDetailsViewModel.salesOrderAmount();
            if (totalCost > totalRev) {
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 30,
                    fadeOut: 30,
                    typeOfAlert: "",
                    title: ""
                };

                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.CostIsNotMoreThanRevenueMessage, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);

                //$('#collapseItems').collapse('toggle');
                $('#collapseItems').addClass('in');
                $('#collapseItems').css("height", 'auto');
                $('#collapseItems').removeClass('collapsed');

                self.collapseAllTabs();
                $('#item').addClass('active in');
                $('#itemLink').addClass('active');
                return false;
            }
            self.validateNotes();
        };

        // To validate Notes
        SalesOrderMainEntryViewModelAccordion.prototype.validateNotes = function () {
            var self = this;

            if (self.salesOrderNotesViewModel.canAdd()) {
                var self = this;
                self.salesOrderNotesViewModel.onAdd();
                self.setUpModelAndSave();
            } else {
                self.setUpModelAndSave();
            }
        };

        //To validate Delivery Date
        SalesOrderMainEntryViewModelAccordion.prototype.validateDeliverDate = function () {
            var self = this;
            var selectedOrderStatus = self.salesOrderDetailsViewModel.selectedOrderStatus();
            if (selectedOrderStatus === 0) {
                if ((self.salesOrderShippingViewModel.deliveryDate() !== null && self.salesOrderShippingViewModel.deliveryDate() !== "")) {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 30,
                        fadeOut: 30,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.EmptyDeliveryDate, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);

                    //$('#collapseItems').collapse('toggle');
                    $('#collapseShipping').addClass('in');
                    $('#collapseShipping').css("height", 'auto');
                    $('#collapseShipping').removeClass('collapsed');

                    self.collapseAllTabs();
                    $('#shipping').addClass('active in');
                    $('#shippingLink').addClass('active');
                    return false;
                } else {
                    return true;
                }
            } else {
                if (self.salesOrderShippingViewModel.deliveryDate() !== null && self.salesOrderShippingViewModel.deliveryDate() !== "") {
                    if (new Date(self.salesOrderShippingViewModel.deliveryDate()) < new Date(self.salesOrderShippingViewModel.pickupDate())) {
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 30,
                            fadeOut: 30,
                            typeOfAlert: "",
                            title: ""
                        };

                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.GreaterDeliveryDate, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                        self.isViewMessage = false;

                        //$('#collapseItems').collapse('toggle');
                        $('#collapseShipping').addClass('in');
                        $('#collapseShipping').css("height", 'auto');
                        $('#collapseShipping').removeClass('collapsed');

                        self.collapseAllTabs();
                        $('#shipping').addClass('active in');
                        $('#shippingLink').addClass('active');
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        };

        // Gets the data from all the different view model and sends those to service
        SalesOrderMainEntryViewModelAccordion.prototype.setUpModelAndSave = function () {
            var self = this;

            // to show item tab by default when click on save
            self.ShowDefaultItemTab();
            var salesOrderData = new refSalesOrderContainerModel.Model.SalesOrderContainer();

            salesOrderData.SalesOrderDetail = self.getSalesOrderDetails();
            salesOrderData.SalesOrderAddressDetails = self.getSalesOrderAddress();
            salesOrderData.SalesOrderItemDetails = self.getSalesOrderItemsDetails();
            salesOrderData.SalesOrderNoteDetails = self.getSalesOrderNotes();
            salesOrderData.MultilegCarrierHubAddress = self.getSalesOrderTerminalAddress();
            salesOrderData.MultilegCarrierDetails = self.getSalesOrderMultilegCarrierDetails();

            self.showListProgress(true);
            self.isSetModelAndSave(false);
            refSalesOrderClient.SalesOrderClient.prototype.SaveSalesOrderDetail(salesOrderData, function (message) {
                // Saving successful callback
                self.isSetModelAndSave(true);
                self.isNotSaving = false;
                self.ischange(false);

                //window.ischange = false;
                _app.trigger("IsBIDirtyChange", self.ischange());

                // Close the current Entry tab
                _app.trigger('closeActiveTab');
                self.showListProgress(false);

                // Show confirm message to take an action to the user so that, he can decide weather he wants to add another bill or just want to go to the
                // Details of current created bill
                self.BOlNumber = self.salesOrderDetailsViewModel.salesOrderNumber();

                //self.ProNumber = self.vendorBillViewModel.proNumber();
                self.savedSalesOrderId = message.Id;

                self.salesOrderDetailsViewModel = null;
                self.salesOrderAddressViewModel = null;
                self.salesOrderItemViewModel = null;
                self.salesOrderNotesViewModel = null;

                _app.trigger('openDuplicateTab', 'salesOrderEntry', 'parent');

                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var actionButtons = [];
                    actionButtons.push({
                        actionButtonName: self.savedSalesOrderId.toString(),
                        actionClick: self.viewDetail
                    });

                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 30,
                        fadeOut: 30,
                        typeOfAlert: "",
                        title: "",
                        actionButtons: actionButtons
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SalesOrderSavedSuccessfullyMessage, "success", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
            }, function (message) {
                _app.trigger("IsBIDirtyChange", self.ischange(false));

                // Saving failed call back
                self.showListProgress(false);
                self.isSetModelAndSave(true);
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
            });
        };

        // To get Sales Order Header Details
        // <changeHistory>
        // <id>DE26476</id> <by>Baldev Singh Thakur</id> <date>18-04-2017</date> <description>Assigning the Estimated Due Date to model for saving it in database.</description>
        // </changeHistory>
        SalesOrderMainEntryViewModelAccordion.prototype.getSalesOrderDetails = function () {
            var self = this;
            var salesOrderDetails = new refSalesOrderDetailsModel.Models.SalesOrderDetail();
            self.assignOrderStatus();
            salesOrderDetails.OrderStatusId = self.salesOrderDetailsViewModel.selectedOrderStatus();
            salesOrderDetails.SelectedShipVia = self.salesOrderShippingViewModel.selectedServiceType();
            salesOrderDetails.CustomerId = self.salesOrderDetailsViewModel.customerSearchList.customerId();
            salesOrderDetails.CustomerName = self.salesOrderDetailsViewModel.customerSearchList.customerName();
            salesOrderDetails.BookedDate = self.salesOrderDetailsViewModel.bookedDate();
            salesOrderDetails.BolNumber = self.salesOrderDetailsViewModel.salesOrderNumber();

            // ###START: US22417
            salesOrderDetails.CustomerBolNo = self.salesOrderShippingViewModel.customerBolNumber();

            // ###END: US22417
            salesOrderDetails.ProNo = self.salesOrderDetailsViewModel.proNumber();
            salesOrderDetails.PoNo = self.salesOrderDetailsViewModel.poNumber();
            salesOrderDetails.ReferenceNo = self.salesOrderDetailsViewModel.puNumber();
            salesOrderDetails.ProcessStatusId = self.salesOrderDetailsViewModel.selectedOrderStatus();
            salesOrderDetails.RequestedPickupDate = self.salesOrderShippingViewModel.requestedPickupDate();
            salesOrderDetails.PickupDate = self.salesOrderShippingViewModel.pickupDate();

            //##START: DE20559
            salesOrderDetails.TransitDays = self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.salesOrderShippingViewModel.transitDays()) ? self.salesOrderShippingViewModel.transitDays() : "0";

            var oneDay = 24 * 60 * 60 * 1000;
            var estimatedDueDate = new Date(self.salesOrderShippingViewModel.estimatedDueDate());
            var requestedPickUpDate = new Date(self.salesOrderShippingViewModel.requestedPickupDate());

            salesOrderDetails.CalendarDays = Math.round(Math.abs((estimatedDueDate.getTime() - requestedPickUpDate.getTime()) / (oneDay))).toString();

            //##END: DE20559
            salesOrderDetails.ReadyTimeString = self.salesOrderShippingViewModel.pickupReadyTime();
            salesOrderDetails.CloseTimeString = self.salesOrderShippingViewModel.pickupCloseTime();
            salesOrderDetails.OriginTerminalPhone = self.salesOrderShippingViewModel.originTerminalPhone();
            salesOrderDetails.DestinationTerminalPhone = self.salesOrderShippingViewModel.destinationTerminalPhone();
            salesOrderDetails.ServiceType = self.salesOrderShippingViewModel.selectedServiceType();
            salesOrderDetails.DeliveryDate = self.salesOrderShippingViewModel.deliveryDate();
            salesOrderDetails.PickupRemarks = self.salesOrderShippingViewModel.pickupRemarks();
            salesOrderDetails.DeliveryRemarks = self.salesOrderShippingViewModel.deliverRemarks();
            salesOrderDetails.DeliveryDate = self.salesOrderShippingViewModel.deliveryDate();
            salesOrderDetails.OriginZip = self.salesOrderAddressViewModel.shipperLocation.location().Zip;
            salesOrderDetails.DestinationZip = self.salesOrderAddressViewModel.consigneeLocation.location().Zip;
            salesOrderDetails.CarrierId = self.salesOrderDetailsViewModel.carrierSearchList.ID();

            //salesOrderDetails.EmergencyContactNo = self.salesOrderHazmatViewModel.emergencyPhone().toString();
            salesOrderDetails.EmergencyContactNo = self.salesOrderHazmatViewModel.emergencyPhone().toString().substring(0, 13);
            salesOrderDetails.EmergencyContactExtension = self.salesOrderHazmatViewModel.emergencyPhone().toString().substring(14);
            salesOrderDetails.CarrierPickupNumber = self.salesOrderShippingViewModel.carrierPickupNumber();
            salesOrderDetails.CarrierCode = self.salesOrderDetailsViewModel.carrierSearchList.carrierCode();
            salesOrderDetails.SalesRepId = self.salesOrderDetailsViewModel.salesRepId();

            // ###START: DE26476
            salesOrderDetails.EstimatedDueDate = self.salesOrderShippingViewModel.estimatedDueDate();

            // ###END: DE26476
            //salesOrderDetails.SalesRepName = self.salesOrderDetailsViewModel.salesRep();
            return salesOrderDetails;
        };

        // To get Sales Order Address Details
        SalesOrderMainEntryViewModelAccordion.prototype.getSalesOrderAddress = function () {
            var self = this;

            var addresses;
            addresses = ko.observableArray([])();

            var ShipperAddress = new refSalesOrderAddressDetailModel.Models.SalesOrderAddressDetail();
            var ConsigneeAddress = new refSalesOrderAddressDetailModel.Models.SalesOrderAddressDetail();
            var BillToAddress = new refSalesOrderAddressDetailModel.Models.SalesOrderAddressDetail();

            // Create Shipper Address Model
            ShipperAddress.Id = 0;
            ShipperAddress.Street = self.salesOrderAddressViewModel.shipperAddress1();
            ShipperAddress.Street2 = self.salesOrderAddressViewModel.shipperAddress2();
            ShipperAddress.CompanyName = self.salesOrderAddressViewModel.shipperCompanyName();
            ShipperAddress.ContactPerson = self.salesOrderAddressViewModel.shipperContactPerson();
            ShipperAddress.City = self.salesOrderAddressViewModel.shipperLocation.location().City;
            ShipperAddress.State = self.salesOrderAddressViewModel.shipperLocation.location().StateCode;
            ShipperAddress.ZipCode = self.salesOrderAddressViewModel.shipperLocation.location().Zip;
            ShipperAddress.Phone = self.salesOrderAddressViewModel.shipperPhone();
            ShipperAddress.Fax = self.salesOrderAddressViewModel.shipperFax();
            if (self.salesOrderAddressViewModel.shipperLocation.location().CountryCode !== null && self.salesOrderAddressViewModel.shipperLocation.location().CountryCode !== 0) {
                ShipperAddress.Country = self.salesOrderAddressViewModel.isInternationalShipmentSelected() ? self.salesOrderAddressViewModel.selectedShipperCountryCode() : $.number(self.salesOrderAddressViewModel.shipperLocation.location().CountryCode);
            } else {
                ShipperAddress.Country = self.salesOrderAddressViewModel.isInternationalShipmentSelected() ? self.salesOrderAddressViewModel.selectedShipperCountryCode() : 1;
            }
            ShipperAddress.AddressType = 1;

            // Create Consignee Address Model
            ConsigneeAddress.Id = 0;
            ConsigneeAddress.Street = self.salesOrderAddressViewModel.consigneeAddress1();
            ConsigneeAddress.Street2 = self.salesOrderAddressViewModel.consigneeAddress2();
            ConsigneeAddress.CompanyName = self.salesOrderAddressViewModel.consigneeCompanyName();
            ConsigneeAddress.ContactPerson = self.salesOrderAddressViewModel.consigneeContactPerson();
            ConsigneeAddress.City = self.salesOrderAddressViewModel.consigneeLocation.location().City;
            ConsigneeAddress.State = self.salesOrderAddressViewModel.consigneeLocation.location().StateCode;
            ConsigneeAddress.ZipCode = self.salesOrderAddressViewModel.consigneeLocation.location().Zip;
            ConsigneeAddress.Phone = self.salesOrderAddressViewModel.consigneePhone();
            ConsigneeAddress.Fax = self.salesOrderAddressViewModel.consigneeFax();
            if (self.salesOrderAddressViewModel.consigneeLocation.location().CountryCode !== null && self.salesOrderAddressViewModel.consigneeLocation.location().CountryCode !== 0) {
                ConsigneeAddress.Country = self.salesOrderAddressViewModel.isInternationalShipmentSelected() ? self.salesOrderAddressViewModel.selectedConsigneeCountryCode() : $.number(self.salesOrderAddressViewModel.consigneeLocation.location().CountryCode);
            } else {
                ConsigneeAddress.Country = self.salesOrderAddressViewModel.isInternationalShipmentSelected() ? self.salesOrderAddressViewModel.selectedConsigneeCountryCode() : 1;
            }
            ConsigneeAddress.AddressType = 2;

            // Create Bill To Address Model
            BillToAddress.Id = 0;
            BillToAddress.Street = self.salesOrderAddressViewModel.billToAddress1();
            BillToAddress.Street2 = self.salesOrderAddressViewModel.billToAddress2();
            BillToAddress.CompanyName = self.salesOrderAddressViewModel.billToCompanyName();
            BillToAddress.City = self.salesOrderAddressViewModel.billToLocation.location().City;
            BillToAddress.State = self.salesOrderAddressViewModel.billToLocation.location().State;
            BillToAddress.ZipCode = self.salesOrderAddressViewModel.billToLocation.location().Zip;
            BillToAddress.Phone = self.salesOrderAddressViewModel.billToPhone();
            BillToAddress.Fax = self.salesOrderAddressViewModel.billToFax();
            if (self.salesOrderAddressViewModel.billToLocation.location().CountryCode !== null && self.salesOrderAddressViewModel.billToLocation.location().CountryCode !== 0) {
                BillToAddress.Country = self.salesOrderAddressViewModel.isInternationalShipmentSelected() ? self.salesOrderAddressViewModel.selectedBillToCountryCode() : $.number(self.salesOrderAddressViewModel.billToLocation.location().CountryCode);
            } else {
                BillToAddress.Country = self.salesOrderAddressViewModel.isInternationalShipmentSelected() ? self.salesOrderAddressViewModel.selectedBillToCountryCode() : 1;
            }
            BillToAddress.AddressType = 3;

            addresses.push(ShipperAddress);
            addresses.push(ConsigneeAddress);
            addresses.push(BillToAddress);
            return addresses;
        };

        // To Get Sales Order Item Details
        SalesOrderMainEntryViewModelAccordion.prototype.getSalesOrderItemsDetails = function () {
            var self = this;

            var salesOrderItems;
            salesOrderItems = ko.observableArray([])();

            self.salesOrderItemViewModel.salesOrderItemsList().forEach(function (item) {
                var salesOrderItem = new refSalesOrderItemDetailModel.Models.SalesOrderItemDetail();
                salesOrderItem.Cost = item.cost();
                salesOrderItem.Height = item.dimensionHeight();
                salesOrderItem.Length = item.dimensionLength();
                salesOrderItem.Width = item.dimensionWidth();
                salesOrderItem.Id = item.id();
                salesOrderItem.PackageTypeId = item.selectedPackageType();
                salesOrderItem.PieceCount = item.pieceCount();
                salesOrderItem.SelectedClassType = item.selectedClassType();
                salesOrderItem.SelectedItemTypes = item.selectedItemTypes();
                salesOrderItem.UserDescription = item.userDescription();
                salesOrderItem.Weight = item.weight();
                salesOrderItem.Revenue = item.rev();
                salesOrderItem.Hazardous = item.isHazardous();
                salesOrderItem.Class = item.selectedClassType();
                salesOrderItem.IsShippingItem = item.isShippingItem();
                salesOrderItem.HazardousUNNo = item.hazmatUnNumber();
                salesOrderItem.PackingGroupNo = item.packingGroup();
                salesOrderItem.HazmatClass = item.hazardousClass();
                salesOrderItem.NMFC = item.nmfc();
                salesOrderItem.PalletCount = item.palletCount();
                salesOrderItem.BsCost = item.bSCost();

                salesOrderItems.push(salesOrderItem);
            });

            return salesOrderItems;
        };

        //To get Sales Order Note Details
        SalesOrderMainEntryViewModelAccordion.prototype.getSalesOrderNotes = function () {
            var self = this;
            var salesOrderNotes;
            salesOrderNotes = ko.observableArray([])();

            self.salesOrderNotesViewModel.salesOrderNoteItems().forEach(function (item, collection) {
                salesOrderNotes.push(self.AddNoteItem(item));
            });

            //## While creating sales order, from entry view we are adding a general notes.
            var notesDescription = "Sales Order has been created by: " + self.currentUser().FullName;
            var itemNew = new refSalesOrderNotesViewModel.salesOrderNoteItem(0, 0, notesDescription, self.currentUser().FullName, Date.now(), "System", refEnums.Enums.Note.System.ID);
            salesOrderNotes.push(self.AddNoteItem(itemNew));

            return salesOrderNotes;
        };

        // function to use get item note model
        SalesOrderMainEntryViewModelAccordion.prototype.AddNoteItem = function (item) {
            var itemNote = new refSalesOrderNotesModel.Models.SalesOrderNoteDetails();

            // For the entity ID will be filled by server
            itemNote.Id = 0;
            itemNote.EntityId = 0;
            itemNote.NotesBy = item.noteBy();
            itemNote.NotesDate = new Date(item.noteDate());
            itemNote.Description = item.description();
            itemNote.NoteTypeName = item.noteType();

            //assign system note
            itemNote.NotesType = item.noteTypeValue();

            return itemNote;
        };

        // To get Sales Order Terminal Address
        SalesOrderMainEntryViewModelAccordion.prototype.getSalesOrderTerminalAddress = function () {
            var self = this;
            var salesOrderTerminalAddress = new refSalesOrderTerminalAddressModel.Models.SalesOrderTerminalAddress();
            salesOrderTerminalAddress.CompanyName = self.salesOrderMultiLegViewModel.terminalHubCompanyName();
            salesOrderTerminalAddress.ContactName = self.salesOrderMultiLegViewModel.terminalHubContactPerson();
            salesOrderTerminalAddress.Phone = self.salesOrderMultiLegViewModel.terminalHubPhone();
            salesOrderTerminalAddress.Fax = self.salesOrderMultiLegViewModel.terminalHubFax();
            salesOrderTerminalAddress.Street1 = self.salesOrderMultiLegViewModel.terminalHubAddress1();
            salesOrderTerminalAddress.Street2 = self.salesOrderMultiLegViewModel.terminalHubAddress2();
            salesOrderTerminalAddress.City = self.salesOrderMultiLegViewModel.oceanCarrierSearchList.city();
            salesOrderTerminalAddress.State = self.salesOrderMultiLegViewModel.oceanCarrierSearchList.stateCode();
            salesOrderTerminalAddress.Zip = self.salesOrderMultiLegViewModel.oceanCarrierSearchList.zip();

            return salesOrderTerminalAddress;
        };

        // To Get Sales Order Multileg Carrier Details
        SalesOrderMainEntryViewModelAccordion.prototype.getSalesOrderMultilegCarrierDetails = function () {
            var self = this;
            var salesOrderMultilegCarrierDetails = new refSalesOrderMultilegCarrierDetailModel.Models.SalesOrderMultilegCarrierDetail();
            salesOrderMultilegCarrierDetails.CarrierId = self.salesOrderMultiLegViewModel.oceanCarrierId();
            salesOrderMultilegCarrierDetails.CarrierName = self.salesOrderMultiLegViewModel.oceanCarriername();
            salesOrderMultilegCarrierDetails.TransitDays = self.salesOrderMultiLegViewModel.oceanTransitDays();
            salesOrderMultilegCarrierDetails.PRONumber = self.salesOrderMultiLegViewModel.oceanProNumber();
            salesOrderMultilegCarrierDetails.ServiceType = self.salesOrderShippingViewModel.selectedServiceType();
            return salesOrderMultilegCarrierDetails;
        };

        // function to validate tab view section
        SalesOrderMainEntryViewModelAccordion.prototype.validateTabbedView = function (isSalesOrderValid, isSalesOrderAddressesValid, isSalesOrderItemValid, isHazmatValid, isHazmatValidContact, isShippingValid, isMultilegValid) {
            var self = this;
            var isMultilegIsEnable = false;
            self.collapseAllTabs();

            if (isSalesOrderValid) {
                self.isValidSalesOrder = false;
            } else {
                self.isValidSalesOrder = true;
            }

            if (isSalesOrderItemValid) {
                $('#item').addClass('active in');
                $('#itemLink').addClass('active');
                self.isValidItems = false;
            } else {
                self.isValidItems = true;
            }

            if (isSalesOrderAddressesValid && !isSalesOrderItemValid) {
                $('#address').addClass('active in');
                $('#addressLink').addClass('active');
                self.isValidAddress = false;
            } else {
                self.isValidAddress = true;
            }

            if (!isSalesOrderItemValid && !isSalesOrderAddressesValid && (isHazmatValid || isHazmatValidContact)) {
                $('#hazmat').addClass('active in');
                $('#hazmatLink').addClass('active');
                self.isValidHazmat = false;
            } else {
                self.isValidHazmat = true;
            }

            if (!isSalesOrderItemValid && !isSalesOrderAddressesValid && !(isHazmatValid || isHazmatValidContact) && isShippingValid) {
                $('#shipping').addClass('active in');
                $('#shippingLink').addClass('active');
                self.isValidShipping = false;
            } else {
                self.isValidShipping = true;
            }

            if (self.salesOrderDetailsViewModel.selectedShipVia() === 5) {
                isMultilegIsEnable = true;
                if (!isSalesOrderItemValid && !isSalesOrderAddressesValid && (!isHazmatValid && !isHazmatValidContact) && !isShippingValid && isMultilegValid) {
                    $('#multilegs').addClass('active in');
                    $('#multilegLink').addClass('active');
                    self.isValidMultileg = false;
                } else {
                    self.isValidMultileg = true;
                }
            }

            if (!isMultilegIsEnable) {
                if (self.isValidItems && self.isValidAddress && self.isValidHazmat && self.isValidShipping) {
                    self.collapseAllTabs();
                    $('#item').addClass('active in');
                    $('#itemLink').addClass('active');
                }
            }
        };

        // function to validate accordion view section
        SalesOrderMainEntryViewModelAccordion.prototype.validateAccordionView = function () {
            var self = this;

            if (self.salesOrderDetailsViewModel.validateSalesOrder()) {
                self.isValidSalesOrder = false;
            } else {
                self.isValidSalesOrder = true;
            }

            if ($('#collapseNotes').hasClass('in')) {
                $('#collapseNotes').collapse('toggle');
                $('#AchorcollapseNotes').addClass('collapsed');
            }

            if (self.salesOrderAddressViewModel.validateAddresses()) {
                //self.addressOverflowManage();
                $('#collapseAddress').collapse('show');
                $('#AchorcollapseAddress').removeClass('collapsed');
                self.isValidAddress = false;
                if (self.isAccordion()) {
                    setTimeout(function () {
                        $('#collapseAddress').css("overflow", "visible");
                    }, 500);
                }
            } else {
                self.isValidAddress = true;
                self.colapseAchorAddress();
            }
            if (self.salesOrderItemViewModel.validateItems()) {
                $('#collapseItems').collapse('show');
                $('#AchorcollapseItems').removeClass('collapsed');
                self.isValidItems = false;
            } else {
                self.isValidItems = true;
                self.colapseAchorItems();
            }

            if (self.salesOrderShippingViewModel.validateShipping()) {
                $('#collapseShipping').collapse('show');
                $('#AchorcollapseShipping').removeClass('collapsed');
                self.isValidShipping = false;
            } else {
                self.isValidShipping = true;
                self.colapseAchorShipping();
            }

            if (self.salesOrderHazmatViewModel.validateContact() || self.salesOrderHazmatViewModel.validateHazmatItems()) {
                self.expandView('collapseHazmat');
                self.isValidHazmat = false;
            } else {
                self.isValidHazmat = true;
                self.collapseView('collapseHazmat');
            }

            if (self.salesOrderMultiLegViewModel.validateMultilegdetails()) {
                self.expandView('collapseMultileg');
                self.isValidMultileg = false;
            } else {
                self.isValidMultileg = true;
                self.collapseView('collapseMultileg');
            }
        };

        //## function to expand the view by ID, if any case we required
        SalesOrderMainEntryViewModelAccordion.prototype.expandView = function (viewId) {
            if (!$('#' + viewId).hasClass('in')) {
                $('#' + viewId).addClass('in');
                $('#' + viewId).css("height", 'auto');
                $('#Achor' + viewId).removeClass('collapsed');
            }
        };

        //## function to collapse the items view by ID, if any case we required
        SalesOrderMainEntryViewModelAccordion.prototype.collapseView = function (viewId) {
            $('#' + viewId).removeClass('in');
            $('#' + viewId).css("height", '0');
            $('#Achor' + viewId).addClass('collapsed');
            $('#collapseAddress').css("overflow", "hidden");
        };

        //Function to collapse all the TAB Sections
        SalesOrderMainEntryViewModelAccordion.prototype.collapseAllTabs = function () {
            if ($('#address').hasClass('in')) {
                $('#address').removeClass('active in');
                $('#addressLink').removeClass('active');
            }
            if ($('#item').hasClass('in')) {
                $('#item').removeClass('active in');
                $('#itemLink').removeClass('active');
            }
            if ($('#shipping').hasClass('in')) {
                $('#shipping').removeClass('active in');
                $('#shippingLink').removeClass('active in');
            }

            if ($('#shipmentNotes').hasClass('in')) {
                $('#shipmentNotes').removeClass('active in');
                $('#shipmentNotesLink').removeClass('active in');
            }

            if ($('#hazmat').hasClass('in')) {
                $('#hazmat').removeClass('active in');
                $('#hazmatLink').removeClass('active in');
            }

            if ($('#multilegs').hasClass('in')) {
                $('#multilegs').removeClass('active in');
                $('#multilegLink').removeClass('active in');
            }
        };

        SalesOrderMainEntryViewModelAccordion.prototype.colapseAchorAddress = function () {
            var self = this;
            if ($('#collapseAddress').hasClass('in') && self.isValidAddress) {
                $('#collapseAddress').collapse('toggle');
                $('#AchorcollapseAddress').addClass('collapsed');
            }
            $('#collapseAddress').css("overflow", "hidden");
        };
        SalesOrderMainEntryViewModelAccordion.prototype.colapseAchorItems = function () {
            var self = this;
            if ($('#collapseItems').hasClass('in') && self.isValidItems) {
                $('#collapseItems').collapse('toggle');
                $('#AchorcollapseItems').addClass('collapsed');
            }
        };

        SalesOrderMainEntryViewModelAccordion.prototype.colapseAchorShipping = function () {
            var self = this;
            if ($('#collapseShipping').hasClass('in') && self.isValidShipping) {
                $('#collapseShipping').collapse('toggle');
                $('#AchorcollapseShipping').addClass('collapsed');
            }
        };

        //#endregion
        // Handles the click event of the Address accordion
        SalesOrderMainEntryViewModelAccordion.prototype.onAddressClick = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#address').addClass('active in');
            $('#addressLink').addClass('active');

            self.addressOverflowManage();

            $("#shipperCompanyName").focus();
        };

        SalesOrderMainEntryViewModelAccordion.prototype.onItemsClick = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#item').addClass('active in');
            $('#itemLink').addClass('active');

            $("#addItemButton").focus();
        };

        SalesOrderMainEntryViewModelAccordion.prototype.onShippingClick = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#shipping').addClass('active in');
            $('#shippingLink').addClass('active in');
            $("#txtRequestedPickupDate").focus();
        };

        SalesOrderMainEntryViewModelAccordion.prototype.onShipingNotesClick = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#shipmentNotes').addClass('active in');
            $('#shipmentNotesLink').addClass('active in');

            $("#txtuserSalesOrderNote").focus();

            //on click we are calling this flag to show grid column resizebal as per browser window
            self.salesOrderNotesViewModel.reportContainer.isAttachedToView(false);
            self.salesOrderNotesViewModel.reportContainer.isAttachedToView(true);
        };

        SalesOrderMainEntryViewModelAccordion.prototype.onHazmatClick = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTabs();
            $('#hazmat').addClass('active in');
            $('#hazmatLink').addClass('active in');
        };

        SalesOrderMainEntryViewModelAccordion.prototype.onMultilegClick = function () {
            var self = this;

            //// To avoid tabs goes blank on quick move between tabs
            //self.collapseAllTabs();
            //$('#multilegs').addClass('active in');
            //$('#multilegLink').addClass('active in');
            var shipperLocation = new refShipperLocation.Models.MapLocation();
            if (self.salesOrderAddressViewModel.shipperLocation.location() !== undefined && typeof (self.salesOrderAddressViewModel.shipperLocation.location()) === 'object' && self.salesOrderAddressViewModel.shipperLocation.location() !== null) {
                shipperLocation.CountryCode = self.salesOrderAddressViewModel.shipperLocation.location().CountryCode;
                shipperLocation.StateCode = self.salesOrderAddressViewModel.shipperLocation.location().StateCode;
                shipperLocation.City = self.salesOrderAddressViewModel.shipperLocation.location().City;
                shipperLocation.Zip = self.salesOrderAddressViewModel.shipperLocation.location().Zip;
            }
            var consigneeLocation = new refconsigneeLocation.Models.MapLocation();
            if (self.salesOrderAddressViewModel.consigneeLocation.location() !== undefined && typeof (self.salesOrderAddressViewModel.consigneeLocation.location()) === 'object' && self.salesOrderAddressViewModel.consigneeLocation.location() !== null) {
                consigneeLocation.CountryCode = self.salesOrderAddressViewModel.consigneeLocation.location().CountryCode;
                consigneeLocation.StateCode = self.salesOrderAddressViewModel.consigneeLocation.location().StateCode;
                consigneeLocation.City = self.salesOrderAddressViewModel.consigneeLocation.location().City;
                consigneeLocation.Zip = self.salesOrderAddressViewModel.consigneeLocation.location().Zip;
            }
            var customerID = self.salesOrderDetailsViewModel.customerId();
            var transitDays = self.salesOrderShippingViewModel.transitDays();
            var pro = self.salesOrderDetailsViewModel.proNumber();
            var carrierName;
            if (self.salesOrderDetailsViewModel.carrierSearchList.name() !== undefined && self.salesOrderDetailsViewModel.carrierSearchList.name() !== null) {
                carrierName = self.salesOrderDetailsViewModel.carrierSearchList.name().CarrierName;
            }
            var carrierID = self.salesOrderDetailsViewModel.carrierSearchList.ID();
            var selextedShipVia = self.salesOrderDetailsViewModel.selectedShipVia;
            self.salesOrderMultiLegViewModel.initializeMultilegDetails(customerID, carrierID, carrierName, selextedShipVia, shipperLocation, consigneeLocation, transitDays, pro);
        };

        SalesOrderMainEntryViewModelAccordion.prototype.load = function (bindedData) {
            if (!bindedData)
                return;

            var self = this;
        };

        //To hide Multileg Tab
        SalesOrderMainEntryViewModelAccordion.prototype.hideMultilegTab = function () {
            var self = this;
            self.multilegLinkVisiblity(false);
            if ($('#multilegs').hasClass('active in')) {
                $('#address').addClass('active in');
                $('#addressLink').addClass('active');
            }
        };

        // Reset Terminal Hub Address on consignee zip change
        SalesOrderMainEntryViewModelAccordion.prototype.resetTerminalHubAddress = function () {
            var self = this;
            self.salesOrderMultiLegViewModel.oceanCarrierSearchList.oceanCarrierName('');
            self.salesOrderMultiLegViewModel.terminalHubCompanyName('');
            self.salesOrderMultiLegViewModel.terminalHubContactPerson('');
            self.salesOrderMultiLegViewModel.terminalHubPhone('');
            self.salesOrderMultiLegViewModel.terminalHubFax('');
            self.salesOrderMultiLegViewModel.terminalHubAddress1('');
            self.salesOrderMultiLegViewModel.terminalHubAddress2('');
            self.salesOrderMultiLegViewModel.terminalHubCityStateZip('');
        };

        // Enables or disables the save button and also makes the window as dirty flag
        SalesOrderMainEntryViewModelAccordion.prototype.changesDetected = function (dirty) {
            var self = this;

            if ((dirty || self.salesOrderNotesViewModel.ischange() || self.salesOrderAddressViewModel.shipperLocation.returnValue || self.salesOrderAddressViewModel.consigneeLocation.returnValue || self.salesOrderAddressViewModel.returnValue || self.salesOrderAddressViewModel.returnValue || self.salesOrderMultiLegViewModel.oceanCarrierSearchList.returnValue) && self.isNotSaving) {
                self.ischange(true);
                //window.ischange = true;
            } else {
                self.ischange(false);
                //window.ischange = false;
            }
            _app.trigger("IsBIDirtyChange", self.ischange());
        };

        // Show the progress bar
        SalesOrderMainEntryViewModelAccordion.prototype.showListProgress = function (progress) {
            var self = this;
            self.listProgressTabbed(progress);
            self.listProgressAccordian(progress);
        };

        SalesOrderMainEntryViewModelAccordion.prototype.assignOrderStatus = function () {
            var self = this;
            var ord = self.salesOrderDetailsViewModel.selectedOrderStatus();
            if (self.salesOrderShippingViewModel.deliveryDate != null) {
                self.salesOrderDetailsViewModel.salesOrderId(refEnums.Enums.OrderStatus.Delivered.ID);
            } else if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.salesOrderDetailsViewModel.proNumber().trim()) && self.salesOrderShippingViewModel.pickupDate != null) {
                self.salesOrderDetailsViewModel.salesOrderId(refEnums.Enums.OrderStatus.Pickup.ID);
            } else if (ord == refEnums.Enums.OrderStatus.Pending.ID) {
                self.salesOrderDetailsViewModel.salesOrderId(ord);
            } else if (ord == refEnums.Enums.OrderStatus.ManualDispatch.ID || ord == refEnums.Enums.OrderStatus.AutoDispatch.ID) {
                self.salesOrderDetailsViewModel.salesOrderId(refEnums.Enums.OrderStatus.Dispatch.ID);
            }
        };

        // on save click by default Item tab should be active in Tabbed View
        SalesOrderMainEntryViewModelAccordion.prototype.ShowDefaultItemTab = function () {
            var self = this;

            if (self.salesOrderDetailsViewModel.selectedShipVia() === 5) {
                if (self.isValidSalesOrder && self.isValidAddress && self.isValidItems && self.isValidShipping && self.isValidHazmat && self.isValidMultileg) {
                    if (!$('#item').hasClass('in')) {
                        $('#item').addClass('active in');
                        $('#itemLink').addClass('active');
                    }
                } else {
                    if ($('#item').hasClass('in')) {
                        $('#item').removeClass('active in');
                        $('#itemLink').removeClass('active');
                    }
                }
            } else {
                if (self.isValidSalesOrder && self.isValidAddress && self.isValidItems && self.isValidShipping && self.isValidHazmat) {
                    if (!$('#item').hasClass('in')) {
                        $('#item').addClass('active in');
                        $('#itemLink').addClass('active');
                    }
                } else {
                    if ($('#item').hasClass('in')) {
                        $('#item').removeClass('active in');
                        $('#itemLink').removeClass('active');
                    }
                }
            }
        };

        //#endregion
        //#region Private Methods
        // To set address accordion to overflow
        SalesOrderMainEntryViewModelAccordion.prototype.addressOverflowManage = function () {
            if ($("#collapseAddress").css("overflow") === "hidden") {
                setTimeout(function () {
                    $('#collapseAddress').css("overflow", "visible");
                }, 500);
            } else {
                $('#collapseAddress').css("overflow", "hidden");
            }
        };

        // change service type on basis of ship by
        SalesOrderMainEntryViewModelAccordion.prototype.changeServiceType = function (shipBy) {
            var self = this;
            if (self.salesOrderShippingViewModel) {
                switch (shipBy) {
                    case refEnums.Enums.ShipVia.Ground.Value:
                        //For LTL Carrier Service
                        self.salesOrderShippingViewModel.selectedServiceType(refEnums.Enums.ServiceType.LTL.ID);
                        self.hideMultilegTab();
                        break;
                    case refEnums.Enums.ShipVia.Ocean.Value:
                        //For Ocean Carrier Service
                        self.salesOrderShippingViewModel.selectedServiceType(refEnums.Enums.ServiceType.Ocean.ID);
                        self.hideMultilegTab();
                        break;
                    case refEnums.Enums.ShipVia.Expedite_Air.Value:
                        //For Expedite_Ground Carrier Service
                        self.salesOrderShippingViewModel.selectedServiceType(refEnums.Enums.ServiceType.Expedite_Air.ID);
                        self.hideMultilegTab();
                        break;
                    case refEnums.Enums.ShipVia.Expedite_Ground.Value:
                        //For LTL Carrier Service
                        self.salesOrderShippingViewModel.selectedServiceType(refEnums.Enums.ServiceType.Expedite_Ground.ID);
                        self.hideMultilegTab();
                        break;
                    case refEnums.Enums.ShipVia.White_Glove.Value:
                        //For White_Glove Carrier Service
                        self.salesOrderShippingViewModel.selectedServiceType(refEnums.Enums.ServiceType.White_Glove.ID);
                        self.hideMultilegTab();
                        break;
                    case refEnums.Enums.ShipVia.Ground_Ocean.Value:
                        //For Ground and Ocean Carrier Service
                        self.salesOrderShippingViewModel.selectedServiceType(refEnums.Enums.ServiceType.Multileg.ID);
                        self.multilegLinkVisiblity(true);
                        $('#multilegs').removeClass('active in');
                        $('#multilegLink').removeClass('active');
                        break;
                }
            }
            //if (shipBy == 5) {
            //	self.multilegLinkVisiblity(true);
            //	$('#multilegs').removeClass('active in');
            //	$('#multilegLink').removeClass('active');
            //}
            //else {
            //	self.multilegLinkVisiblity(false);
            //	if ($('#multilegs').hasClass('active in'))
            //	{
            //		$('#address').addClass('active in');
            //		$('#addressLink').addClass('active');
            //	}
            //}
        };

        //#endregion
        //#region Validation
        //#endregion
        //#region Life Cycle Event
        SalesOrderMainEntryViewModelAccordion.prototype.compositionComplete = function () {
            var self = this;
            setTimeout(function () {
                $('.txtCustomerName').focus();
            }, 500);

            if (self.isAccordion()) {
                if (!$('#collapseAddress').hasClass('in')) {
                    $('#collapseAddress').css("overflow", "hidden");
                } else {
                    $('#collapseAddress').css("overflow", "visible");
                }
            }

            _app.trigger("IsBIDirtyChange", false);
        };

        //** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
        SalesOrderMainEntryViewModelAccordion.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //** The composition engine will execute it prior to calling the binder. */
        SalesOrderMainEntryViewModelAccordion.prototype.activate = function () {
            return true;
        };

        //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
        SalesOrderMainEntryViewModelAccordion.prototype.beforeBind = function () {
            var self = this;
        };

        SalesOrderMainEntryViewModelAccordion.prototype.deactivate = function () {
            var self = this;
            self.cleanup();
            return true;
        };

        SalesOrderMainEntryViewModelAccordion.prototype.cleanup = function () {
            var self = this;

            for (var property in self) {
                if (property !== "savedSalesOrderId")
                    delete self[property];
            }
            delete self;
        };
        return SalesOrderMainEntryViewModelAccordion;
    })();
    exports.SalesOrderMainEntryViewModelAccordion = SalesOrderMainEntryViewModelAccordion;
});
