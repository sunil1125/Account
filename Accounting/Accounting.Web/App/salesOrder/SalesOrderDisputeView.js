/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/models/common/Enums', 'services/validations/Validations', 'services/client/SalesOrderClient', 'services/client/VendorBillClient', 'services/models/salesOrder/DisputeVendorBill', 'services/models/salesOrder/VendorBillDisputeContainer', 'services/models/vendorBill/VendorBillItemDetails', 'services/models/salesOrder/SalesOrderShipmentRequoteReason', 'services/models/salesOrder/SalesOrderNoteDetail'], function(require, exports, ___router__, ___app__, __refEnums__, __refValidations__, __refSalesOrderClient__, __refVendorBillClient__, __refSalesOrderDisputeVendorBill__, __refSalesOrderVendorBillDisputeContainer__, __refSalesOrderItemModel__, __refSalesOrderShipmentRequoteReasonModel__, __refSalesOrderNotesModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    var refEnums = __refEnums__;
    var refValidations = __refValidations__;
    var refSalesOrderClient = __refSalesOrderClient__;
    var refVendorBillClient = __refVendorBillClient__;
    
    
    var refSalesOrderDisputeVendorBill = __refSalesOrderDisputeVendorBill__;
    var refSalesOrderVendorBillDisputeContainer = __refSalesOrderVendorBillDisputeContainer__;
    var refSalesOrderItemModel = __refSalesOrderItemModel__;
    var refSalesOrderShipmentRequoteReasonModel = __refSalesOrderShipmentRequoteReasonModel__;
    var refSalesOrderNotesModel = __refSalesOrderNotesModel__;

    //#endregion
    /***********************************************
    Sales Order Dispute ViewModel
    ************************************************
    ** <summary>
    ** Sales Order Dispute ViewModel
    ** </summary>
    ** <createDetails>
    ** <id>US13232</id><by>Chandan Singh Bajetha</by><date>31st Oct, 2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>DE20630</id><by>Chandan Singh Bajetha</by><date>04/11/2014</date> <description>Wrong Dispute Amount Calculation in Sales Order from Dispute Tab</description>
    ** <id>US20352</id><by>Chandan Singh Bajetha</by><date>20-01-2016</date> <description>Acct: Adjust UI for Dispute Notes Tab in Vendor Bill</description>
    ** <id>DE21416</id><by>Chandan Singh Bajetha</by><date>20-01-2016</date> <description>Dispute Date always shows the current date on Dispute Tab in Sales Order</description>
    ** <id>US20584</id><by>Chandan Singh Bajetha</by><date>03-02-2016</date> <description>Acct: Add Dispute Status Drop Down in SO Dispute Tab</description>
    ** <id>DE21749</id> <by>Chandan Singh Bajetha</by> <date>08-0202016</date>
    <description>Disable the Status drop down when user directly updates the bill status to Dispute Short Paid from any status other than Dispute</description>
    ** <id>US20647</id> <by>Chandan Singh Bajetha</by> <date>17-02-2016</date> <description>Acct: Implement Search on all Reports.</description>
    ** <id>US20687</id> <by>Chandan Singh Bajetha</by> <date>17-02-2016</date> <description>Acct: Add Dispute HTML Link in Dispute Tab</description>
    ** <id>US20961</id> <by>Shreesha Adiga</by> <date>08-03-2016</date> <description>Save only dispute status if bill moved to mas; changed to some validations</description>
    ** <id>US21147</id> <by>Shreesha Adiga</by> <date>15-03-2016</date> <description>If late dispute amount then show it in dispute amount's place</description>
    ** <id>DE22259</id> <by>Shreesha Adiga</by> <date>22-03-2016</date> <description>Select item based on ItemId and AccessorialId</description>
    ** <id>DE22259</id> <by>Shreesha Adiga</by> <date>22-03-2016</date><description>Updated accessorialId to VB item before saving dispute</description>
    ** <id>US21290</id> <by>Shreesha Adiga</by> <date>23-03-2016</date><description>If item selected based on itemid and accessorialId is undefined, then select based only on itemId</description>
    ** <id>US21131</id> <by>Shreesha Adiga</by> <date>31-03-2016</date><description>Show dispute state popup for some scenarios and add the note to disputeContainer</description>
    ** <id>US21132</id> <by>Shreesha Adiga</by> <date>26-04-2016</date><description>Changes related to showing the dispute lost popup from sales order; Showing "Create Lost Bill" toastr after save</description>
    ** <id>US21597</id> <by>Baldev Singh Thakur</by> <date>28-04-2016</date> <description>Added LateDisputeAmount, for displaying Late Dispute Amount.</description>
    ** <id>US21791</id> <by>Shreesha Adiga</by> <date>05-05-2016</date> <description>Diplay aging days</description>
    ** <id>US22053</id> <by>Shreesha Adiga</by> <date>10-05-2016</date><description>Changes related to sending mail when the dispute state is "Carrier Researching"</description>
    ** <id>DE23003</id> <by>Shreesha Adiga</by> <date>26-05-2016</date><description>Enable dispute status dropdown and dispute amount input for DisputeShortPaid, EVEN if it has been moved to MAS</description>
    ** <id>US22471</id> <by>Vasanthakumar</by> <date>03-06-2016</date> <description>Add Success Toastr message for Emails triggered by users</description>
    ** <id>DE23466</id> <by>Baldev Singh Thakur</by> <date>12-07-2016</date><description>Added logic to disable the bill status drop down, whenever user saves the bill status to Overcharge Won/Overcharge Loss</description>
    ** <id>DE23503</id> <by>Baldev Singh Thakur</by> <date>15-07-2016</date><description>Final Cost is getting updated on changing bill status from  OVC  to OVC won/lost.</description>
    ** <id>DE23995</id> <by>Shreesha Adiga</by> <date>17-08-2016</date><description>Bind dispute lost amount on click of save</description>
    ** <id>US24324</id> <by>Janakiram</by> <date>23-08-2016</date><description>Marking Overcharge Claim Dispute as won/loss from click of save</description>
    ** <id>US24862</id> <by>Shreesha Adiga</by> <date>20-09-2016</date><description>Show Dispute Emial popup on click of 'Dispute With Carrier' button</description>
    ** <id>US24865</id> <by>Shreesha Adiga</by> <date>23-09-2016</date><description>Send proper data to Dispute Email Popup</description>
    ** <id>US24866</id> <by>Dhaval Tamhane</by> <date>27-09-2016</date><description>Populating values for OriginalCost, OriginalWeight, NMFC numbers and Classes</description>
    ** <id>US24874</id> <by>Vasanthakumar</by> <date>29-09-2016</date> <description>Acct: Enter Notes on sending an Email to Carrier</description>
    ** <id>DE24638</id> <by>Janakiram</by> <date>03-10-2016</date> <description>Checking condition for sending mails based on "IsDisputeEmailPopupEnabled".</description>
    ** <id>DE24774</id> <by>Shreesha Adiga</by> <date>10-10-2016</date> <description>Populate some properties of VB items, which were previously not populated, while saving</description>
    ** <id>US25310</id> <by>Shreesha Adiga</by> <date>24-10-2016</date> <description>Show Credit Request Popup after bill status is changed to Dispute Won</description>
    ** <id>US25679</id> <by>Baldev Singh Thakur</by> <date>11-11-2016</date><description>Added totalPendingVendorAmount</description>
    ** <id>US25153</id> <by>Shreesha Adiga</by> <date>20-10-2016</date><description>Changes realted to Credit Adjustment (Items Not Integrated With Mas)</description>
    ** <id>DE25119</id> <by>Janakiram</by> <date>23-11-2016</date><description>Disbling dispute vb fields if line item having credit adjustment</description>
    ** <id>DE25602</id> <by>Vasanthakumar</by> <date>18-01-2017</date><description>If item id and accessorial id is zero then Credit adjustment line item is inserted in the order</description>
    ** <id>US26559</id> <by>Vasanthakumar</by> <date>02-02-2017</date> <description>Get Invoiced SO list and pass to credit memo popup</description>
    ** <id>US26575</id> <by>Baldev Singh Thakur</by> <date>03-02-2017</date> <description>Added condition to display BS Cost and appropriate fields if the order attached to the bill is Billing Station.</description>
    ** </changeHistory>
    
    ***********************************************/
    var SalesOrderDisputeViewModel = (function () {
        //#region Constructor
        // ##START: US25310
        function SalesOrderDisputeViewModel(disputeCallback, creditRequestCallback) {
            //#region Members
            //Creating Reference of Dispute Vendor bill details model
            this.disputeVendorBillDetailsModels = ko.observableArray([]);
            //Creating Reference of Dispute Vendor bill details Item model
            this.DisputeVendorBillItemsModel = ko.observableArray([]);
            //disputeVendorBillDetails: KnockoutObservableArray<VendorBillItemsModel> = ko.observableArray([]);
            this.shipmentItemTypes = ko.observableArray([]);
            //For Bill Status list
            this.billStatusList = ko.observableArray([]);
            //For Selected Bill Status
            this.selectedbillStatus = ko.observable();
            //For sales Order client for call save and get data
            this.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
            // ##START: US25310
            // Vendorbill client for all the service calls related to VB
            this.vendorBillClient = new refVendorBillClient.VendorBillClient();
            // ##END: US25310
            //For get Agent Dispute Reason
            this.agentDisputeDetails = ko.observableArray([]);
            //Hold Vendor Bill
            this.isHoldVB = ko.observable(false);
            //Quick pAy
            this.isQuickPay = ko.observable(false);
            //Internal Dispute Date
            this.internalDisputeDate = ko.observable('');
            //For Vendor BIll Dispute Date
            this.VBDisputeDate = ko.observable('');
            //For Header PRO Number
            this.proNumberHeader = ko.observable('');
            //Main Vendor BIll Id For Saving purpose
            this.mainVendorBillId = ko.observable(0);
            //Bill status id for bind selected bill
            this.billstatuId = ko.observable();
            //Updated Date
            this.updatedDate = ko.observable('');
            //Dispute Notes for Vendor BIll
            this.disputeNotes = ko.observable('');
            //Sales Order Total Cost of item for bind in right side Vendor BIll
            this.salesOrderTotalCost = ko.observable('0.00');
            //Sales Order Total Dispute of item for bind in right side Vendor BIll
            this.salesOrderTotalDisputeAmount = ko.observable('0.00');
            //Sales Order Total Pay of item for bind in right side Vendor BIll
            this.salesOrderTotalPayAmount = ko.observable('0.00');
            //Flag for Check is bill Status Is dispute or not
            this.isBillStatusDispute = ko.observable(false);
            // ###START: DE21749
            //Flag for Check is bill Status Is dispute or not
            this.isBillStatusDisputeOnly = ko.observable(false);
            // ###END: DE21
            //for enable or disable save button
            this.isSelected = ko.observable(false);
            //for enable or disable save button
            this.isVisibleDisputeDetails = ko.observable(false);
            //Sales Order Id for save and get purpose
            this.salesOrderIdMain = ko.observable(0);
            //All KO Internal Dispute
            this.internalDisputedId = ko.observable();
            this.internalDisputedBy = ko.observable('');
            this.internalDisputedAmount = ko.observable($.number(0, 2));
            this.internalDisputedDate = ko.observable('');
            this.internalDisputedReason = ko.observable('');
            this.internalDisputedNotes = ko.observable('');
            this.internalDisputedNotespopup = ko.observable('');
            // ###START: US20352
            this.internalDisputeStatusId = ko.observable();
            // ###START: US20687
            this.bolNumber = ko.observable('');
            this.commonUtils = new Utils.Common();
            this.disputeData = ko.observableArray([]);
            this.isViewOnly = ko.observable(true);
            this.disputeNoteString = ko.observable('');
            //Bill status id for bind selected bill
            this.originalBillStatusId = ko.observable();
            this.onSaveClick = ko.observable(false);
            this.CommonUtils = new Utils.Common();
            // ###START: US20584
            this.salesOrderStatusTypes = ko.observableArray([]);
            this.selectedStatusType = ko.observable();
            this.checkMsgDisplay = true;
            this.isViewMessage = true;
            // ##START: US20961
            this.isBillMovedToMas = ko.observable(false);
            this.currentUser = ko.observable();
            // ##END: US21132
            // ##START: US21791
            this.agingDays = ko.observable(0);
            // ##END: US22053
            //##START: DE23003
            this.isBillStatusDisputeShortPaid = ko.observable(false);
            //##END: DE23003
            // ###START: DE23503
            this.disputeAmount = 0;
            // ###END: DE23503
            // ##START: US24865
            this.disputeEmailTemplates = [];
            // ##END: US24865
            // ##START: US24866
            this.originalCost = '';
            this.originalWeight = '';
            this.nmfcNumbers = '';
            this.classes = '';
            // ##END: US24866
            // ##START: US25310
            this.creditReasonOptions = [];
            this.totalPendingCreditAmount = $.number(0, 2);
            // ##END: US25310
            // ###START: US25679
            this.totalPendingVendorAmount = $.number(0, 2);
            // ###END: US25679
            // ##START: US25153
            this.itemsNotIntegratedWithMas = [];
            // ##END: US25153
            //#endregion
            // ###START: DE25119
            this.disableDisputeView = ko.observable(false);
            // ###END: DE25119
            this.invoicedSOExceptCMSubSo = [];
            // ##END: US25310
            var self = this;
            self.disputeCallback = disputeCallback;

            // ##START: US25310
            self.creditRequestCallback = creditRequestCallback;

            // ##END: US25310
            // ##START: US21131
            self.getLoggedInUserDetails();

            // ##END: US21131
            //To set The date picker options
            self.datepickerOptions = {
                blockWeekend: true,
                blockPreviousDays: false,
                blockHolidaysDays: true,
                autoClose: true,
                placeBelowButton: false
            };

            //Validate total Dispute Amount
            self.salesOrderTotalDisputeAmount.extend({
                max: {
                    params: 1,
                    message: ApplicationMessages.Messages.InvalidTotalCost,
                    onlyIf: function () {
                        return ((parseFloat(self.salesOrderTotalCost().toString().replace(/,/g, "")) < parseFloat(self.salesOrderTotalDisputeAmount().toString())) && (self.billstatuId() === refEnums.Enums.VendorBillStatus.Dispute.ID || self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeWon.ID || self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID || self.billstatuId() === refEnums.Enums.VendorBillStatus.ShortPaid.ID));
                    }
                },
                number: true,
                min: {
                    params: 1,
                    message: ApplicationMessages.Messages.DisputeAmountShouldNotBeNegative,
                    onlyIf: function () {
                        return (self.onSaveClick() && (self.billstatuId() === refEnums.Enums.VendorBillStatus.Dispute.ID || self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeWon.ID || self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID || self.billstatuId() === refEnums.Enums.VendorBillStatus.ShortPaid.ID));
                    }
                }
            });

            ////Validate Dispute Date
            self.VBDisputeDate.extend({
                required: {
                    message: 'A valid Dispute Date is required.',
                    onlyIf: function () {
                        return (self.onSaveClick() && (self.billstatuId() === refEnums.Enums.VendorBillStatus.Dispute.ID || self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeWon.ID || self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID || self.billstatuId() === refEnums.Enums.VendorBillStatus.ShortPaid.ID));
                    }
                }
            });

            //Validating Dispute notes
            self.disputeNoteString.extend({
                required: {
                    message: 'A valid Dispute Notes is required',
                    onlyIf: function () {
                        return (self.isBillStatusDispute() && self.onSaveClick());
                    }
                }
            });

            //set the flag allow decimal: true to accepts decimals
            self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(true) };

            // ###START: US20687
            self.selectDisputeWithCarrierLink = function (lineItem) {
                if (typeof Utils.Constants.IsDisputeEmailPopupEnabled !== "undefined" && Utils.Constants.IsDisputeEmailPopupEnabled.toLowerCase() === 'false') {
                    var parameter = '';
                    if (lineItem.proNumber() === '' || lineItem.proNumber() === undefined) {
                        parameter = 'PRONumber';
                        self.disputeWithCarrierErrorMessage(parameter);
                    } else if (lineItem.salesOrderId() === null || lineItem.salesOrderId() === 0) {
                        parameter = 'Shipment ID';
                        self.disputeWithCarrierErrorMessage(parameter);
                    } else if (lineItem.carrierCode() === '' || lineItem.carrierCode() === undefined) {
                        parameter = 'SCAC';
                        self.disputeWithCarrierErrorMessage(parameter);
                    } else if (self.bolNumber() === '' || self.bolNumber() === undefined) {
                        parameter = 'BOL';
                        self.disputeWithCarrierErrorMessage(parameter);
                    } else if (lineItem.CarrierName() === '' || lineItem.CarrierName() === undefined) {
                        parameter = 'CarrierName';
                        self.disputeWithCarrierErrorMessage(parameter);
                    } else {
                        var left = screen.width / 2 - 700 / 2;
                        var top = screen.height / 2 - 450 / 2;
                        if (self.disputeVendorBillDetailsModels().length >= 1) {
                            window.open(lineItem.disputeWithCarrierUrl(), 'ctcCodes', 'height=450,width=700,scrollbars=0,resizable=0,menubar=0,status=0,toolbar=0,top=' + top + ',left=' + left + '');
                        }
                    }
                } else if (typeof Utils.Constants.IsDisputeEmailPopupEnabled !== "undefined" && Utils.Constants.IsDisputeEmailPopupEnabled.toLowerCase() === 'true') {
                    // ###END: DE24638
                    // ##START: US24862
                    // on click of send email in popup
                    var onSendEmailClickCallback = function (disputeStateNote) {
                    };

                    // on click of cancel in popup
                    var onCancelClickCallbakc = function () {
                    };

                    // ##START: US24866
                    // ##START: US24865
                    var emailPopupData = {
                        proNumber: lineItem.proNumber(),
                        bolNumber: self.bolNumber(),
                        // ##START: US24866
                        originalCost: self.originalCost,
                        originalWeight: self.originalWeight,
                        nmfcNumbers: self.nmfcNumbers,
                        classes: self.classes,
                        // ##END: US24866
                        carrierName: self.carrierName,
                        disputeAmount: lineItem.disputedAmount(),
                        carrierContactAddressList: lineItem.disputeCarrierEmailDetailsList,
                        disputeTemplateList: self.disputeEmailTemplates,
                        // ##START: US24874
                        shipmentId: self.salesOrderIdMain()
                    };

                    // ##END: US24865
                    // ##END: US24866
                    // object to be passed to the popup
                    var optionControlArgs = {
                        options: undefined,
                        message: '',
                        title: 'Confirmation',
                        bindingObject: {
                            // ##START: US24866
                            // ##START: US24865
                            emailPopupData: emailPopupData,
                            // ##END: US24865
                            // ##END: US24866
                            saveCallback: onSendEmailClickCallback,
                            cancelCallback: onCancelClickCallbakc
                        }
                    };

                    _app.showDialog('salesOrder/SalesOrderDisputeEmailPopup', optionControlArgs);
                    // ##END: US24862
                    // ###START: DE24638
                }
                // ###END: DE24638
                // ###END: US20687
            };

            //Click on select
            self.selectItem = function (lineItem) {
                // Delete from the collection
                self.isVisibleDisputeDetails(true);
                self.onSaveClick(false);
                if (self.disputeVendorBillDetailsModels().length >= 1) {
                    self.selecteLineItem = lineItem;
                    self.isSelected(true);

                    if (self.selecteLineItem.moveToMasDate() !== null) {
                        self.isBillMovedToMas(true);
                        self.isSelected(false);
                    } else {
                        self.isBillMovedToMas(false);
                    }

                    // ##END: US20961
                    // ###START: DE21749
                    self.internalDisputeStatusId(undefined);

                    // ###END: DE21749
                    // self.VBDisputeDate(self.selecteLineItem.disputedDate());
                    // ##START: US21132
                    self.billStatusOnLoad = undefined;
                    self.billStatusList(self.selecteLineItem.billStatusList());
                    self.billstatuId(self.selecteLineItem.billStatusId());
                    self.billStatusOnLoad = self.selecteLineItem.billStatusId();

                    if (self.billStatusOnLoad === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID) {
                        self.getCreditReasonOptions();
                        self.getCreditMemoInvoicedSOList();
                    }

                    // ##END: US25310
                    self.proNumberHeader(self.selecteLineItem.proNumber());
                    self.mainVendorBillId(self.selecteLineItem.vendorBillId());

                    //self.disputeNotes(self.selecteLineItem.disputeNotes());
                    self.disputeNoteString(self.selecteLineItem.disputeNotes());
                    self.updatedDate(self.selecteLineItem.updatedDate());
                    self.isHoldVB(self.selecteLineItem.isHoldVB());
                    self.isQuickPay(self.selecteLineItem.isQuickPay());

                    self.originalBillStatusId(self.selecteLineItem.originalBillingStatus());

                    // ###START: US20352
                    self.internalDisputeStatusId(self.selecteLineItem.internalSelectedDisputedStatusId());

                    // ###END: US20352
                    // ##START: US21131
                    self.disputeStateIdOnLoad = self.selecteLineItem.internalSelectedDisputedStatusId();

                    if (self.billstatuId() === refEnums.Enums.VendorBillStatus.Dispute.ID || self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeWon.ID || self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID || self.billstatuId() === refEnums.Enums.VendorBillStatus.ShortPaid.ID) {
                        self.isBillStatusDispute(true);
                        if (self.VBDisputeDate() === undefined || self.VBDisputeDate() === null || self.VBDisputeDate() === "") {
                            self.VBDisputeDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
                        }
                    } else {
                        self.isBillStatusDispute(false);
                        self.VBDisputeDate('');
                    }

                    if (lineItem.billStatusId() === refEnums.Enums.VendorBillStatus.Dispute.ID) {
                        self.isBillStatusDisputeOnly(true);
                    } else {
                        self.isBillStatusDisputeOnly(false);
                    }

                    if (lineItem.billStatusId() === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID || lineItem.billStatusId() === refEnums.Enums.VendorBillStatus.OverchargeClaim.ID) {
                        // ###END: US24324
                        self.isBillStatusDisputeShortPaid(true);
                    } else {
                        self.isBillStatusDisputeShortPaid(false);
                    }

                    if (lineItem.billStatusId() === refEnums.Enums.VendorBillStatus.OverchargeLose.ID || lineItem.billStatusId() === refEnums.Enums.VendorBillStatus.OverchargeWon.ID || !lineItem.isCreditProcessEnable()) {
                        self.isBillMovedToMas(true);
                    }

                    if (!self.isViewOnly()) {
                        self.isBillStatusDispute(false);
                        self.isSelected(false);
                    }
                    self.initializeDisputeItem(self.disputeData(), self.selecteLineItem.vendorBillId());

                    if (self.selecteLineItem.lateDisputedAmount() != 0) {
                        self.salesOrderTotalDisputeAmount(self.selecteLineItem.lateDisputedAmount().toString());
                    }

                    //##END: US21147
                    // ###START: DE21416
                    self.VBDisputeDate(self.CommonUtils.formatDate(self.selecteLineItem.disputedDate(), 'mm/dd/yyyy'));

                    // ###END: DE21416
                    // ##START: US21791
                    self.agingDays(self.selecteLineItem.agingDays);

                    // ##END: US21791
                    // ###START: DE25119
                    self.disableDisputeView(lineItem.isCreditProcessEnable());
                    // ###END: DE25119
                }

                var requoteReasonCodeLength = self.agentDisputeDetails().length;
                self.internalDisputedBy('');
                self.internalDisputedAmount(0.00);
                self.internalDisputeDate('');
                self.internalDisputedNotes('');
                self.salesOrderClient.GetAgentDisputes(self.salesOrderIdMain(), self.mainVendorBillId(), function (data) {
                    if (data) {
                        self.internalDisputedBy(data.DisputedRepName);
                        self.internalDisputedAmount($.number(data.DisputeAmount, 2));
                        self.internalDisputeDate(self.commonUtils.formatDate(data.DisputeDate, 'mm/dd/yyyy'));
                        self.internalDisputedReason(data.DisputeReason);
                        self.internalDisputedNotes(data.DisputeNotes);
                        self.internalDisputedNotespopup(data.DisputeNotes);
                        self.internalDisputedId(data.Id);
                    }
                }, function () {
                });

                //For highlight selected row
                var alltr = $('tr');
                $('td a').on('click', function () {
                    alltr.removeClass('selected');
                    $(this).closest('tr').addClass('selected');
                });
            };

            //For internal Dispute Popup
            self.internalDispute = function (lineItemVB) {
                self.salesOrderClient.GetAgentDisputes(self.salesOrderIdMain(), lineItemVB.vendorBillId(), function (data) {
                    //if (data) {
                    lineItemVB.internalDisputeNotes(data.DisputeNotes);
                    lineItemVB.internalDisputeId(data.Id);
                    lineItemVB.disputedReason(data.DisputeReason);
                    lineItemVB.internalDisputedAmount(data.DisputeAmount);
                    lineItemVB.internalDiputeDate(data.DisputeDate);
                    lineItemVB.internalDisputedBy(data.DisputedRepName);

                    ////initialize message box control arguments
                    var optionControlArgs = {
                        options: undefined,
                        message: '',
                        title: 'Revenue Adjustment',
                        bindingObject: lineItemVB
                    };

                    //Call the dialog Box functionality to open a Popup
                    _app.showDialog('salesOrder/SalesOrderInternalDispute', optionControlArgs).then(function (object) {
                        self.internalDisputedBy(object.disputedBy());
                        self.internalDisputedAmount($.number(object.disputeAmount(), 2));
                        self.internalDisputedNotes(object.internalDisputeNotes());
                        self.internalDisputeDate(self.commonUtils.formatDate(object.internalDisputeDatePopup(), 'mm/dd/yyyy'));
                    });
                    //}
                }, function () {
                });

                //for heighLight selected row
                var all_tr = $('tr');
                $('td a').on('click', function () {
                    all_tr.removeClass('selected');
                    $(this).closest('tr').addClass('selected');
                });
            };

            //#region Error Details Object
            self.errorSalesOrderDispute = ko.validatedObservable({
                internalDisputeDate: self.internalDisputeDate,
                VBDisputeDate: self.VBDisputeDate,
                disputeNoteString: self.disputeNoteString,
                salesOrderTotalDisputeAmount: self.salesOrderTotalDisputeAmount
            });

            // Subscribe to change the cost as negative if that is discount
            self.billstatuId.subscribe(function () {
                if (self.billstatuId() === refEnums.Enums.VendorBillStatus.Dispute.ID || self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeWon.ID || self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID || self.billstatuId() === refEnums.Enums.VendorBillStatus.ShortPaid.ID) {
                    self.isBillStatusDispute(true);
                    if (self.VBDisputeDate() === undefined || self.VBDisputeDate() === null || self.VBDisputeDate() === "") {
                        self.VBDisputeDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
                    }
                } else {
                    self.isBillStatusDispute(false);
                    self.VBDisputeDate('');
                }

                if (self.billstatuId() === refEnums.Enums.VendorBillStatus.Dispute.ID) {
                    self.isBillStatusDisputeOnly(true);
                } else {
                    self.isBillStatusDisputeOnly(false);
                }

                if (self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeLost.ID && typeof self.billStatusOnLoad !== "undefined" && self.billStatusOnLoad !== self.billstatuId()) {
                    self.showDisputeLostPopup();
                }
                // ##END: US21132
            });

            // ###START: US20584
            // Load all ship via if not loaded already
            var salesOrderStatusTypes = self.salesOrderStatusTypes().length;
            if (!(salesOrderStatusTypes)) {
                _app.trigger("GetDisputeStatusList", function (data) {
                    if (data) {
                        self.salesOrderStatusTypes.removeAll();
                        self.salesOrderStatusTypes.push.apply(self.salesOrderStatusTypes, data);
                    }
                });
            }

            // Calling subscribe call to save Dispute status
            self.internalDisputeStatusId.subscribe(function (selectedStatus) {
                // ##START: US20961
                self.isSelected(true);

                // ##END: US20961
                self.internalDisputeStatusId(selectedStatus);
            });

            if (typeof self.itemsNotIntegratedWithMas !== "undefined" && self.itemsNotIntegratedWithMas.length === 0) {
                _app.trigger("GetItemsNotIntegratedWithMas", function (items) {
                    if (items) {
                        self.itemsNotIntegratedWithMas = self.itemsNotIntegratedWithMas.concat(items);
                    }
                });
            }

            // ##END: US25153
            // ###START: US20687
            //To check if Msg is clicked
            self.checkMsgClick = function () {
                self.checkMsgDisplay = true;
                self.isViewMessage = true;
            };

            //to Check if Msg is hidden or closed
            self.checkMsgHide = function () {
                self.checkMsgDisplay = true;
                self.isViewMessage = true;
            };

            // ###END: US20687
            return self;
        }
        //#endregion
        //#region Public Methods
        // ###START: US20687
        SalesOrderDisputeViewModel.prototype.disputeWithCarrierErrorMessage = function (parameter) {
            var self = this;
            if (self.checkMsgDisplay) {
                self.checkMsgDisplay = false;
                var toastrOptions1 = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };
                if (self.isViewMessage) {
                    //changed in true as per requirement
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, parameter + ' ' + ApplicationMessages.Messages.ParameterNotFoundForDisputeWithCarrierLink, "error", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
                }
            }
        };

        // ###END: US20687
        //Click On Save For vendor Bill Dispute
        SalesOrderDisputeViewModel.prototype.onSave = function () {
            var self = this;

            self.onSaveClick(true);

            if (typeof self.selecteLineItem.moveToMasDate() !== "undefined" && self.selecteLineItem.moveToMasDate() !== null && !self.isBillStatusDisputeShortPaid()) {
                if ((self.internalDisputeStatusId() == refEnums.Enums.DisputeState.MoreDisputeInfoNeeded.ID || self.internalDisputeStatusId() == refEnums.Enums.DisputeState.GTZError.ID) && self.disputeStateIdOnLoad != self.internalDisputeStatusId())
                    self.showDisputeStateNotePopup();
else
                    self.saveOnlyDisputeStatusForVBsMovedToMas();

                // ##END: US21131
                return;
            }

            // ##END: US20961
            var errorDisputeResult = $.grep(self.DisputeVendorBillItemsModel(), function (e) {
                return (e.lineItemIsInvalid());
            });

            if (self.errorSalesOrderDispute.errors().length === 0 && errorDisputeResult.length === 0) {
                if ((self.internalDisputeStatusId() == refEnums.Enums.DisputeState.MoreDisputeInfoNeeded.ID || self.internalDisputeStatusId() == refEnums.Enums.DisputeState.GTZError.ID) && self.disputeStateIdOnLoad != self.internalDisputeStatusId())
                    self.showDisputeStateNotePopup();
else
                    self.saveDisputeDetails();
                // ##END: US21131
            } else {
                self.errorSalesOrderDispute.errors.showAllMessages();
                errorDisputeResult.forEach(function (item) {
                    item.errorDisputeVendorItemDetail.errors.showAllMessages();
                });
            }

            return false;
        };

        /*
        ** <summary>
        ** Final save method seperated from onSave() to reuse when save is clicked on Dispute State Note popup
        ** </summary>
        ** <createDetails>
        ** <id>US21131</id><by>Shreesha Adiga</by><date>31-03-2016</date>
        ** </createDetails>
        */
        SalesOrderDisputeViewModel.prototype.saveDisputeDetails = function () {
            var self = this;

            self.isVisibleDisputeDetails(false);

            // ###START: DE21749
            self.isBillStatusDisputeOnly(false);

            // ###END: DE21749
            self.isSelected(false);
            self.onSaveClick(false);
            var salesOrderDisputeVendorBillContainer = new refSalesOrderVendorBillDisputeContainer.Models.VendorBillDisputeContainer();
            salesOrderDisputeVendorBillContainer.ShipmentId = self.salesOrderIdMain();
            salesOrderDisputeVendorBillContainer.DisputeVendorBill = self.getSalesOrderDisputeVendorBillDetails();
            salesOrderDisputeVendorBillContainer.VendorBillItemsDetail = self.getDisputeSalesOrderItemDetails();
            salesOrderDisputeVendorBillContainer.CanSaveReasonCodes = self.isBillStatusDispute();
            salesOrderDisputeVendorBillContainer.SalesRepId = self.salesRepId;
            salesOrderDisputeVendorBillContainer.CustomerId = self.customerId;

            // ##START: US22053
            salesOrderDisputeVendorBillContainer.BOLNumber = self.bolNumber();
            salesOrderDisputeVendorBillContainer.CarrierName = self.carrierName;
            salesOrderDisputeVendorBillContainer.IsSavedFromVB = false;

            if ((self.internalDisputeStatusId() == refEnums.Enums.DisputeState.MoreDisputeInfoNeeded.ID || self.internalDisputeStatusId() == refEnums.Enums.DisputeState.GTZError.ID) && self.disputeStateIdOnLoad != self.internalDisputeStatusId()) {
                salesOrderDisputeVendorBillContainer.DisputeStateNote = self.getDisputeStateNote();
            }

            if (self.internalDisputeStatusId() > 0) {
                var disputeStatus = {
                    ID: self.internalDisputeStatusId(),
                    Value: ''
                };
            } else {
                var disputeStatus = {
                    ID: undefined,
                    Value: ''
                };
            }

            salesOrderDisputeVendorBillContainer.DisputeStatusId = disputeStatus;

            // ###END: US20352
            self.isBillStatusDispute(false);

            // ###START: US22471
            self.salesOrderClient.SaveSalesOrderDisputeVBDetails(salesOrderDisputeVendorBillContainer, function (data) {
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };

                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SavedSuccessfullyMessage, "success", null, toastrOptions);

                if (data.Response === true) {
                    if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSettingNotFoundCode) {
                        var toastrOptionsMailSent = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, data.StatusModel.Description, "info", null, toastrOptionsMailSent);
                    } else if (data.StatusModel.StatusCode === Constants.ApplicationConstants.NoErrorStatusCode) {
                        var toastrOptionsMailSent = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SendSuccessfullyMail, "success", null, toastrOptionsMailSent);
                    } else {
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.MailFailureMessage, "error", null, toastrOptions);
                    }
                }

                if (self.billStatusOnLoad === refEnums.Enums.VendorBillStatus.DisputeShortPaid.ID && self.billstatuId() === refEnums.Enums.VendorBillStatus.DisputeWon.ID) {
                    self.getDataAndShowCreditRequestPopup(self.mainVendorBillId(), self.salesOrderTotalDisputeAmount());
                }

                // ##END: US25310
                self.clearAllData();
                self.disputeCallback();
            }, function (message) {
                //self.isSelected(true);
                self.isVisibleDisputeDetails(true);
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
                // ###END: US22471
            });
        };

        // ##START: US21131
        // method to show the popup to enter dispute state note
        SalesOrderDisputeViewModel.prototype.showDisputeStateNotePopup = function () {
            var self = this;

            var disputeStateString = self.commonUtils.getEnumValueById(refEnums.Enums.DisputeState, self.internalDisputeStatusId().toString());

            // on click of save in popup
            var saveClickOnPopupCallback = function (disputeStateNote) {
                self.disputeStateNote = disputeStateNote;

                if (typeof self.selecteLineItem.moveToMasDate() !== "undefined" && self.selecteLineItem.moveToMasDate() !== null && !self.isBillStatusDisputeShortPaid())
                    self.saveOnlyDisputeStatusForVBsMovedToMas();
else
                    self.saveDisputeDetails();
            };

            // on click of cancel in popup
            var cancelClickOnPopupCallback = function () {
                self.internalDisputeStatusId(self.disputeStateIdOnLoad === 0 ? undefined : self.disputeStateIdOnLoad);
            };

            // object to be passed to the popup
            var optionControlArgs = {
                options: undefined,
                message: '',
                title: 'Confirmation',
                bindingObject: {
                    selectedDisputeState: disputeStateString,
                    saveCallback: saveClickOnPopupCallback,
                    cancelCallback: cancelClickOnPopupCallback
                }
            };

            _app.showDialog('salesOrder/SalesOrderDisputeStateNotePopup', optionControlArgs);
        };

        // ##END: US21131
        // ##START: US20961
        // To save dispute status for VBs that are already in mas
        SalesOrderDisputeViewModel.prototype.saveOnlyDisputeStatusForVBsMovedToMas = function () {
            var self = this;

            var salesOrderDisputeVendorBillContainer = new refSalesOrderVendorBillDisputeContainer.Models.VendorBillDisputeContainer();
            var disputeStatus = {
                ID: self.internalDisputeStatusId(),
                Value: ''
            };

            salesOrderDisputeVendorBillContainer.DisputeVendorBill = self.getSalesOrderDisputeVendorBillDetails();
            salesOrderDisputeVendorBillContainer.DisputeStatusId = disputeStatus;

            // ##START: US21131
            salesOrderDisputeVendorBillContainer.SalesRepId = self.salesRepId;
            salesOrderDisputeVendorBillContainer.CustomerId = self.customerId;

            if ((self.internalDisputeStatusId() == refEnums.Enums.DisputeState.MoreDisputeInfoNeeded.ID || self.internalDisputeStatusId() == refEnums.Enums.DisputeState.GTZError.ID) && self.disputeStateIdOnLoad != self.internalDisputeStatusId()) {
                salesOrderDisputeVendorBillContainer.DisputeStateNote = self.getDisputeStateNote();
            }

            // ##END: US21131
            //##START: US22053
            salesOrderDisputeVendorBillContainer.BOLNumber = self.bolNumber();
            salesOrderDisputeVendorBillContainer.CarrierName = self.carrierName;
            salesOrderDisputeVendorBillContainer.IsSavedFromVB = false;

            //##END: US22053
            self.isBillStatusDispute(false);
            self.salesOrderClient.SaveDisputeStatusFromSalesOrder(salesOrderDisputeVendorBillContainer, function (message) {
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.DisputeStatusSavedSuccessfully, "success", null, toastrOptions);

                if (message.Response === true) {
                    if (message.StatusModel.StatusCode == Constants.ApplicationConstants.MailSettingNotFoundCode) {
                        var toastrOptionsMailSent = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, message.StatusModel.Description, "info", null, toastrOptionsMailSent);
                    } else if (message.StatusModel.StatusCode === Constants.ApplicationConstants.NoErrorStatusCode) {
                        var toastrOptionsMailSent = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SendSuccessfullyMail, "success", null, toastrOptionsMailSent);
                    } else {
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.MailFailureMessage, "error", null, toastrOptions);
                    }
                }

                // ##END: US22053
                self.clearAllData();
                self.disputeCallback();
            }, function (message) {
                //self.isSelected(true);
                self.isVisibleDisputeDetails(true);
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
                // ###END: US22471
            });
        };

        // ##END: US20961
        // ##START: US21132
        // show dispute lost popup to edit lost amount for items
        SalesOrderDisputeViewModel.prototype.showDisputeLostPopup = function () {
            var self = this;

            var saveClickOnPopupCallback = function () {
                self.disputeCallback();
            };

            var cancelClickOnPopupCallback = function () {
                // set dispute status to previous value
                self.billstatuId(self.billStatusOnLoad);
            };

            // object to be passed to the popup
            var optionControlArgs = {
                options: undefined,
                message: '',
                title: '',
                bindingObject: {
                    vendorBillId: self.mainVendorBillId(),
                    proNumber: self.proNumberHeader(),
                    proNumberOfMainBill: self.proNumberOfMainBill,
                    subBillCount: self.subBillCount,
                    hasLostBill: self.hasLostBill,
                    saveCallback: saveClickOnPopupCallback,
                    cancelCallback: cancelClickOnPopupCallback
                }
            };

            _app.showDialog('vendorBill/VendorBillDisputeLost', optionControlArgs);
        };

        // ##END: US21132
        //Clear all Data from view self.DisputeVendorBillItemsModel.removeAll();
        SalesOrderDisputeViewModel.prototype.clearAllData = function () {
            var self = this;
            self.DisputeVendorBillItemsModel.removeAll();
            self.disputeVendorBillDetailsModels.removeAll();
            self.internalDisputedBy('');
            self.internalDisputedAmount($.number(0, 2));
            self.internalDisputeDate('');
            self.internalDisputedNotes('');
            self.billStatusList.removeAll();
            self.salesOrderTotalDisputeAmount($.number(0, 2));
            self.VBDisputeDate('');
            self.disputeNotes('');
            self.salesOrderTotalPayAmount($.number(0, 2));
            self.salesOrderTotalCost($.number(0, 2));
            self.isBillStatusDispute(false);
            self.disputeNoteString('');

            // ###START: US20584
            self.internalDisputeStatusId(undefined);

            // ###END: US20584
            // ##START: US21132
            self.billStatusOnLoad = undefined;
            // ##END: US21132
        };

        //Initialize Dispute from main sales order accordion or tabbed
        SalesOrderDisputeViewModel.prototype.initializeDispute = function (data, salesRepId, customerId, enable) {
            var self = this;

            // ##START: US21131
            self.salesRepId = salesRepId;
            self.customerId = customerId;

            if (data != null) {
                self.disputeVendorBillDetailsModels.removeAll();
                data.DisputeVendorBill.forEach(function (item) {
                    self.disputeVendorBillDetailsModels.push(new DisputeVendorBillDetailsModel(item, self.salesOrderIdMain(), self.internalDisputedNotespopup(), self.internalDisputedId(), self.bolNumber()));
                });

                // ##START: US21132
                // the following data are required for creating lost bill
                self.subBillCount = data.SubBillCount;
                self.hasLostBill = data.HasLostBill;
                self.proNumberOfMainBill = typeof data.DisputeVendorBill !== "undefined" && data.DisputeVendorBill.length > 0 ? data.DisputeVendorBill[0].ProNumber : "";

                // ##END: US21132
                self.isViewOnly(enable);

                if (data.SalesOrderOriginalDetails != null) {
                    self.originalCost = data.SalesOrderOriginalDetails.SOOriginalCost;
                    self.originalWeight = data.SalesOrderOriginalDetails.SOOriginalWeight;
                    self.nmfcNumbers = data.SalesOrderOriginalDetails.SONMFCNumbers;
                    self.classes = data.SalesOrderOriginalDetails.SOClasses;
                }
                // ##END: US24866
            }
        };

        //initialize Vendor Bill Item after select click
        SalesOrderDisputeViewModel.prototype.initializeDisputeItem = function (data, vendorBillId) {
            var self = this;
            if (data != null) {
                if (self.selecteLineItem.lateDisputedAmount() != 0) {
                    for (var i = 0; i < data.VendorBillItemsDetail.length; i++) {
                        // ###START: DE23503
                        self.disputeAmount += data.VendorBillItemsDetail[i].DisputeAmount;

                        // ###END: DE23503
                        data.VendorBillItemsDetail[i].DisputeAmount = 0;
                    }
                }

                // ###END: US21597
                var shipmentItemTypesLength = self.shipmentItemTypes().length;
                if (!(shipmentItemTypesLength)) {
                    _app.trigger("GetItemsTypes", function (items) {
                        self.shipmentItemTypes.removeAll();
                        self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
                    });
                }

                var totalShippingAndDiscountCost = 0.0;

                self.DisputeVendorBillItemsModel.removeAll();

                data.VendorBillItemsDetail.forEach(function (item) {
                    if (item.VendorBillId === vendorBillId) {
                        if (item.ItemId === 10 || item.ItemId === 70) {
                            var costWithoutComma = item.Cost.toString();
                            var check = costWithoutComma.indexOf(",");
                            if (check === -1) {
                                totalShippingAndDiscountCost += parseFloat(item.Cost.toString());
                            } else {
                                //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                                totalShippingAndDiscountCost += parseFloat(costWithoutComma.replace(/,/g, ""));
                            }
                        }
                    }
                });

                data.VendorBillItemsDetail.forEach(function (item) {
                    if (item.VendorBillId === vendorBillId) {
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
                            //##START: DE22259
                            selectedItem = $.grep(self.shipmentItemTypes(), function (e) {
                                return e.ItemId === item.ItemId.toString() && (e.AccessorialId == null || item.AccessorialId == 0 || e.AccessorialId == item.AccessorialId);
                            })[0];
                            //##END: DE22259
                        }

                        if (typeof selectedItem === "undefined" || selectedItem == null) {
                            selectedItem = $.grep(self.shipmentItemTypes(), function (e) {
                                return e.ItemId === item.ItemId.toString();
                            })[0];
                        }

                        // ##END: US21290
                        self.DisputeVendorBillItemsModel.push(new DisputeVendorBillItemsModel(selectedItem, item, function () {
                            self.updateTotalCostPayDisputeAmount();
                        }, data.ReasonCodes, function () {
                            self.UpdateDisputeLineItemsDescription();
                        }, totalShippingAndDiscountCost));

                        // ##START: US25153
                        selectedItem = undefined;
                        // ##END: US25153
                    }
                });

                // Update the totals in the totals section
                self.updateTotalCostPayDisputeAmount();
            }
        };

        // ##START: US24865
        // function to populate the dispute email templates
        SalesOrderDisputeViewModel.prototype.getAllDisputeEmailTemplates = function () {
            var self = this;

            self.salesOrderClient.GetAllDisputeEmailTemplates(function (data) {
                if (data) {
                    self.disputeEmailTemplates.removeAll();
                    self.disputeEmailTemplates = data;
                }
            });
        };

        // ##END: US24865
        SalesOrderDisputeViewModel.prototype.cleanup = function () {
            var self = this;

            if (self.selecteLineItem)
                self.selecteLineItem.cleanup();

            self.disputeVendorBillDetailsModels.removeAll();
            self.DisputeVendorBillItemsModel.removeAll();
            self.shipmentItemTypes.removeAll();
            self.billStatusList.removeAll();
            self.agentDisputeDetails.removeAll();

            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }

            delete self;
        };

        //#endregion
        //#region Private Methods
        // Gets the logged in user details from shell.js
        SalesOrderDisputeViewModel.prototype.getLoggedInUserDetails = function () {
            var self = this;
            _app.trigger("GetCurrentUserDetails", function (currentUser) {
                self.currentUser(currentUser);
            });
        };

        //Get Vendor bill details For
        SalesOrderDisputeViewModel.prototype.getSalesOrderDisputeVendorBillDetails = function () {
            var self = this;
            var salesOrderDisputeDetails;
            salesOrderDisputeDetails = ko.observableArray([])();
            var vendorBillDisputeData = new refSalesOrderDisputeVendorBill.Models.DisputeVendorBill();
            vendorBillDisputeData.DisputedDate = self.VBDisputeDate();

            // ###START: DE23503
            vendorBillDisputeData.DisputedAmount = (self.selecteLineItem.lateDisputedAmount() > 0) ? self.disputeAmount : parseFloat(self.salesOrderTotalDisputeAmount());

            // ###END: DE23503
            vendorBillDisputeData.DisputeNotes = self.disputeNotes();
            vendorBillDisputeData.BillStatus = self.billstatuId();
            vendorBillDisputeData.VendorBillId = self.mainVendorBillId();
            vendorBillDisputeData.UpdatedDate = self.updatedDate();
            vendorBillDisputeData.HoldVendorBill = self.isHoldVB();
            vendorBillDisputeData.QuickPay = self.isQuickPay();
            vendorBillDisputeData.OriginalBillStatus = self.originalBillStatusId();
            vendorBillDisputeData.DisputeNotes = self.disputeNoteString();

            // ###START: US20352
            vendorBillDisputeData.DisputeStatusId = self.internalDisputeStatusId();

            // ###END: US20352
            // ##START: US22053
            vendorBillDisputeData.ProNumber = self.proNumberHeader();

            // ##END: US22053
            salesOrderDisputeDetails.push(vendorBillDisputeData);
            return salesOrderDisputeDetails;
        };

        // Gets the vendor bill Item details for save
        SalesOrderDisputeViewModel.prototype.getDisputeSalesOrderItemDetails = function () {
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

                // ##START: DE23995
                salesOrderDisputreVBItem.DisputeLostAmount = item.disputeLostAmount();

                // ##END: DE23995
                salesOrderDisputreVBItem.VendorBillId = self.mainVendorBillId();
                salesOrderDisputreVBItem.ReasonNote = item.reasonNotes();
                salesOrderDisputreVBItem.SelectedReasonCodes = item.selectedReasonCode();

                //##START: DE22259
                salesOrderDisputreVBItem.AccessorialId = item.accessorialId() == null ? 0 : item.accessorialId();

                //##END: DE22259
                // ##START: DE24774
                salesOrderDisputreVBItem.SelectedClassType = item.selectedClassType();
                salesOrderDisputreVBItem.PieceCount = item.pieceCount();
                salesOrderDisputreVBItem.PackageTypeName = item.packageName();
                salesOrderDisputreVBItem.Weight = item.weight();

                salesOrderDisputreVBItem.DimensionHeight = item.dimensionHeight();
                salesOrderDisputreVBItem.DimensionLength = item.dimensionLength();
                salesOrderDisputreVBItem.DimensionWidth = item.dimensionWidth();

                // ##END: DE24774
                salesOrderDisputeItems.push(salesOrderDisputreVBItem);
            });
            return salesOrderDisputeItems;
        };

        //##START: US21131
        // get the dispute state note in Sales order note object
        SalesOrderDisputeViewModel.prototype.getDisputeStateNote = function () {
            var self = this;

            if (typeof self.currentUser() === "undefined" || self.currentUser() === null) {
                self.getLoggedInUserDetails();
            }

            var itemNote = new refSalesOrderNotesModel.Models.SalesOrderNoteDetails();

            // For the entity ID will be filled by server
            itemNote.Id = 0;
            itemNote.EntityId = self.salesOrderIdMain();
            itemNote.NotesBy = self.currentUser().FullName;
            itemNote.NotesDate = new Date();
            itemNote.Description = self.disputeStateNote;

            itemNote.NoteTypeName = self.internalDisputeStatusId() == refEnums.Enums.DisputeState.MoreDisputeInfoNeeded.ID ? refEnums.Enums.SalesOrderNotesType.General.Value : refEnums.Enums.SalesOrderNotesType.IR.Value;

            itemNote.NotesType = self.internalDisputeStatusId() == refEnums.Enums.DisputeState.MoreDisputeInfoNeeded.ID ? refEnums.Enums.SalesOrderNotesType.General.ID : refEnums.Enums.SalesOrderNotesType.IR.ID;

            return itemNote;
        };

        //##END: US21131
        // Converting if date is not valid
        SalesOrderDisputeViewModel.prototype.convertToBookedDate = function () {
            var self = this;
            if (!self.internalDisputeDate().match('/') && self.internalDisputeDate().length > 0) {
                self.internalDisputeDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.internalDisputeDate()));
            }
        };

        // Converting if date is not valid
        SalesOrderDisputeViewModel.prototype.convertToVBDisputeDate = function () {
            var self = this;
            if (!self.VBDisputeDate().match('/') && self.VBDisputeDate().length > 0) {
                self.VBDisputeDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.VBDisputeDate()));
            }
        };

        //For add total cost , dispute and pay
        SalesOrderDisputeViewModel.prototype.updateTotalCostPayDisputeAmount = function () {
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
                    var costWithoutComma = item.pay().toString();
                    var check = costWithoutComma.indexOf(",");
                    if (check === -1) {
                        totalPay += parseFloat(item.pay().toString());
                    } else {
                        //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                        totalPay += parseFloat(costWithoutComma.replace(/,/g, ""));
                    }
                }

                if (item.disputeAmount()) {
                    if (item.selectedItemTypeId() == 70 && item.disputeAmount().toString().indexOf('-') < 0) {
                        item.disputeAmount(item.disputeAmount());
                    }
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
            self.salesOrderTotalDisputeAmount(totalDisputeCost.toFixed(2));
        };

        // function to update line items reason note to dispute note.
        SalesOrderDisputeViewModel.prototype.UpdateDisputeLineItemsDescription = function () {
            var self = this;
            var updatereasonNotes = '';
            var disputeDescriptionString = '';
            var count = 0;
            self.DisputeVendorBillItemsModel().forEach(function (item) {
                if (typeof (item.reasonNotes()) !== 'undefined' && item.reasonNotes() !== null && item.reasonNotes() !== '') {
                    count++;
                    updatereasonNotes += item.reasonNotes() + ';';
                }
                self.disputeNoteString(updatereasonNotes);
            });

            for (var i = 0; i < count; i++) {
                var splittedString = self.disputeNoteString().split(';');
                if (splittedString[i] !== '') {
                    disputeDescriptionString += splittedString[i] + ';';
                }
            }

            self.disputeNoteString(disputeDescriptionString);
        };

        /*
        ** <createDetails>
        ** <id>US25310</id> <by>Shreesha Adiga</by> <date>24-10-2016</date> <description>Method to get the credit reason options for Credit Request popup</description>
        ** </createDetails>
        */
        SalesOrderDisputeViewModel.prototype.getCreditReasonOptions = function () {
            var self = this;

            self.salesOrderClient.getCreditReasonCodes(function (data) {
                if (data) {
                    self.creditReasonOptions.removeAll();
                    self.creditReasonOptions = data;
                }
            });

            var shipmentId = parseInt(self.mainBOLNumber);

            if (shipmentId) {
                self.salesOrderClient.getTotalPendingCreditMemo(shipmentId, function (data) {
                    if (data) {
                        self.totalPendingCreditAmount = data.TotalPendingCreditAmount;

                        // ###START: US25679
                        self.totalPendingVendorAmount = data.TotalPendingVendorAmount;
                        // ###END: US25679
                    }
                });
            }
        };

        /*
        ** <summary>
        ** Get all invoiced SO list except credit memo suborder to show in credit memo popup window
        ** </summary>
        ** <createDetails>
        ** <id>US26559</id> <by>Vasanthakumar</by> <date>02-02-2017</date>
        ** </createDetails>
        */
        SalesOrderDisputeViewModel.prototype.getCreditMemoInvoicedSOList = function () {
            var self = this;
            self.salesOrderClient.GetAllInvoicedSOExceptCreditMemoSubSO(parseInt(self.mainBOLNumber), function (data) {
                if (data) {
                    self.invoicedSOExceptCMSubSo.removeAll();
                    self.invoicedSOExceptCMSubSo = data;
                }
            }, function (message) {
            });
        };

        /*
        ** <createDetails>
        ** <id>US25310</id> <by>Shreesha Adiga</by> <date>24-10-2016</date> <description>Method to get financial details for Credit Request popup</description>
        ** </createDetails>
        */
        SalesOrderDisputeViewModel.prototype.getDataAndShowCreditRequestPopup = function (vendorBillId, disputeAmount) {
            var self = this;

            var successCallBack = function (data) {
                if (data) {
                    setTimeout(function () {
                        self.showRequestCreditPopup(data, disputeAmount);
                    }, 2000);
                }
            };

            var failureCallBack = function (message) {
            };

            self.vendorBillClient.getVendorBillFinancialDetailsByVendorBillId(vendorBillId, successCallBack, failureCallBack);
        };

        /*
        ** <createDetails>
        ** <id>US25310</id> <by>Shreesha Adiga</by> <date>24-10-2016</date> <description>Method to show the Credit Request popup</description>
        ** </createDetails>
        ** <changeHistory>
        ** <id>US26559</id> <by>Vasanthakumar</by> <date>02-02-2017</date> <description>Pass the invoiced SO list to credit memo popup</description>
        ** <id>US26575</id> <by>Baldev Singh Thakur</by> <date>03-02-2017</date> <description>Added condition to display BS Cost and appropriate fields if the order attached to the bill is Billing Station.</description>
        ** </changeHistory>
        */
        SalesOrderDisputeViewModel.prototype.showRequestCreditPopup = function (data, disputeAmount) {
            var self = this;

            var onSaveCallback = function () {
                self.creditRequestCallback();
            };

            // ###START: US25277
            var creditmemoPopupData = {
                // ###START: US26575
                currentFinalRevenue: data.IsBsCustomer ? data.TotalPLCCost : data.TotalRevenue,
                // ###END: US26575
                currentFinalCost: data.ActualCost,
                creditReasons: self.creditReasonOptions,
                selectedCreditReason: refEnums.Enums.CreditReason.DisputeWon.ID,
                shipmentId: parseInt(self.mainBOLNumber),
                totalPendingCreditAmount: self.totalPendingCreditAmount,
                vendorCreditAmount: disputeAmount,
                salesOrderList: self.invoicedSOExceptCMSubSo,
                selectedBolNumber: self.mainBOLNumber,
                // ###START: US26575
                isBSCustomer: data.IsBsCustomer
            };

            // object to be passed to the popup
            var optionControlArgs = {
                options: undefined,
                message: '',
                title: 'Confirmation',
                bindingObject: {
                    creditmemoPopupData: creditmemoPopupData,
                    saveCallback: onSaveCallback
                }
            };

            // ###END: US25277
            _app.showDialog('salesOrder/SalesOrderRequestCreditPopup', optionControlArgs);
        };
        return SalesOrderDisputeViewModel;
    })();
    exports.SalesOrderDisputeViewModel = SalesOrderDisputeViewModel;

    var DisputeVendorBillDetailsModel = (function () {
        // ###END: DE25119
        function DisputeVendorBillDetailsModel(item, salesOrderId, internalDisputeNotes, internalDisputeId, bolNumber) {
            this.salesOrderId = ko.observable(0);
            this.vendorBillId = ko.observable(0);
            this.itemId = ko.observable(0);
            this.proNumber = ko.observable('');
            this.updatedDate = ko.observable('');
            // Disputed date
            this.disputedDate = ko.observable('');
            // Disputed amount
            this.disputedAmount = ko.observable('');
            //##START: US21147
            this.lateDisputedAmount = ko.observable(0);
            //##END: US21147
            this.selectedbillStatus = ko.observable('');
            this.billStatusId = ko.observable(0);
            this.moveToMasDate = ko.observable('');
            // Dispute Notes
            this.disputeNotes = ko.observable('');
            this.internalDisputeNotes = ko.observable('');
            this.internalDisputeId = ko.observable();
            this.internalDisputedAmount = ko.observable();
            this.internalDiputeDate = ko.observable('');
            this.internalDisputedBy = ko.observable('');
            // ###START: US20352
            this.internalSelectedDisputedStatusId = ko.observable();
            // ###END: US20352
            this.carrierCode = ko.observable('');
            this.CarrierName = ko.observable('');
            this.disputeWithCarrierUrl = ko.observable('');
            this.selectedMasClearingStatus = ko.observable('');
            this.disputedReason = ko.observable();
            this.isHoldVB = ko.observable(false);
            this.isQuickPay = ko.observable(false);
            this.billStatusList = ko.observableArray([]);
            this.reasonCodesList = ko.observableArray([]);
            // to hold original Billing status of the bill
            this.originalBillingStatus = ko.observable(0);
            this.commonUtils = new Utils.Common();
            // ##END: US21791
            // ##START: US24865
            this.disputeCarrierEmailDetailsList = [];
            // ##END: US24865
            // ###START: DE25119
            this.isCreditProcessEnable = ko.observable(false);
            var self = this;

            //self. = item.BillStatus;
            self.billStatusId(item.BillStatus);
            self.selectedbillStatus(self.commonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, item.BillStatus.toString()));
            self.proNumber(item.ProNumber);
            self.disputedDate(item.DisputedDate ? self.commonUtils.formatDate(item.DisputedDate.toString(), 'mm/dd/yyyy') : '');
            self.disputedAmount('$' + $.number(item.DisputedAmount, 2));

            //##START: US21147
            self.lateDisputedAmount($.number(item.LateDisputedAmount, 2));

            //##END: US21147
            self.selectedMasClearingStatus(self.commonUtils.getEnumValueById(refEnums.Enums.MasClearanceStatus, item.MasClearanceStatus.toString()));
            self.disputeNotes(item.DisputeNotes);
            self.vendorBillId(item.VendorBillId);
            self.salesOrderId(salesOrderId);
            self.internalDisputeId(internalDisputeId);
            self.internalDisputeNotes(internalDisputeNotes);
            self.billStatusList(item.ListOfBillStatuses);
            self.moveToMasDate(item.MasTransferDate);

            // ###START: US20352
            self.internalSelectedDisputedStatusId(item.DisputeStatusId);

            // ###END: US20352
            // ###START: US20687
            self.carrierCode(item.CarrierCode);
            self.CarrierName(item.CarrierName);

            // ###END: US20687
            self.originalBillingStatus(item.OriginalBillStatus);
            if (item.QuickPay) {
                self.isQuickPay(true);
            }
            if (item.HoldVendorBill) {
                self.isHoldVB(true);
            }
            self.updatedDate(item.UpdatedDate);

            self.reasonCodesList.removeAll();
            item.ReasonCodes.forEach(function (reasonCodeItem) {
                self.reasonCodesList.push(new refSalesOrderShipmentRequoteReasonModel.Model.SalesOrderShipmentRequoteReason(reasonCodeItem));
            });

            // ###START: US20687
            var url = Utils.Constants.DisputeCarrierContactToolUrl + '?bol=' + bolNumber + '&SCAC=' + self.carrierCode() + '&ProNo=' + self.proNumber() + '&ShipmentId=' + self.salesOrderId() + '&CarrierName=' + self.CarrierName();
            self.disputeWithCarrierUrl(encodeURI(url));

            // ###END: US20687
            // ##START: US21791
            self.agingDays = item.AgingDays;

            // ##END: US21791
            // ##START: US24865
            self.disputeCarrierEmailDetailsList = item.DisputeCarrierEmailDetailsList;

            // ##END: US24865
            // ###START: DE25119
            self.isCreditProcessEnable(item.IsCreditProcessEnable);

            // ###END: DE25119
            return self;
        }
        // Cleans up the view model properties
        DisputeVendorBillDetailsModel.prototype.cleanup = function () {
            var self = this;

            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }

            delete self;
        };
        return DisputeVendorBillDetailsModel;
    })();
    exports.DisputeVendorBillDetailsModel = DisputeVendorBillDetailsModel;

    var DisputeVendorBillItemsModel = (function () {
        // ##END: DE24774
        function DisputeVendorBillItemsModel(selectedItem, item, lineDisputeValueChanged, reasonCodes, reasonNotesModifiedCallBack, totalShippingAndDiscountCost) {
            this.id = ko.observable();
            this.item = ko.observable('');
            this.selectedItemTypeId = ko.observable();
            this.description = ko.observable('');
            this.disputedDate = ko.observable('');
            this.cost = ko.observable(0);
            this.pay = ko.observable(0);
            this.disputeAmount = ko.observable(0);
            // ##START: DE23995
            this.disputeLostAmount = ko.observable(0);
            // ##END: DE23995
            this.reasonNotes = ko.observable('');
            this.reasonCodesListFoBinding = ko.observableArray([]);
            this.selectedReasonCode = ko.observable();
            this.commonUtils = new Utils.Common();
            this.lineItemIsInvalid = ko.observable(false);
            this.shippingAndDiscountCost = ko.observable();
            //##START: DE22259
            this.accessorialId = ko.observable();
            //##END: DE22259
            // ##START: DE24774
            this.selectedClassType = ko.observable();
            this.weight = ko.observable();
            this.packageName = ko.observable();
            this.pieceCount = ko.observable();
            this.dimensionLength = ko.observable();
            this.dimensionWidth = ko.observable();
            this.dimensionHeight = ko.observable();
            var self = this;
            self.id(item.Id);
            self.item(selectedItem ? selectedItem.LongDescription : '');
            self.selectedItemTypeId(item.ItemId);
            self.description(item.UserDescription);

            //##START: DE22259
            self.accessorialId(selectedItem ? selectedItem.AccessorialId : 0);

            //##END: DE22259
            self.cost($.number(item.Cost, 2));

            self.disputeAmount($.number(item.DisputeAmount, 2));

            // ##START: DE23995
            self.disputeLostAmount($.number(item.DisputeLostAmount, 2));

            // ##END: DE23995
            // ##START: DE24774
            self.selectedClassType(item.SelectedClassType);
            self.weight(item.Weight);
            self.packageName(item.PackageTypeName);
            self.pieceCount(item.PieceCount);
            self.dimensionHeight(item.DimensionHeight);
            self.dimensionLength(item.DimensionLength);
            self.dimensionWidth(item.DimensionWidth);

            if (totalShippingAndDiscountCost !== 0) {
                self.shippingAndDiscountCost(($.number((totalShippingAndDiscountCost), 2)).replace(/,/g, ""));
            }

            var DisputeAmountWithoutComma;

            if (item.DisputeAmount !== null && item.DisputeAmount !== undefined && item.DisputeAmount !== 0.00) {
                DisputeAmountWithoutComma = parseFloat(item.DisputeAmount.toString().replace(/,/g, ""));
                var payLoadingAmount = item.Cost - +DisputeAmountWithoutComma;
            } else {
                DisputeAmountWithoutComma = item.DisputeAmount;
            }

            if (item.ItemId === 70) {
                var payLoadingAmount = item.Cost - (-DisputeAmountWithoutComma);
                self.pay($.number(payLoadingAmount, 2));
            } else {
                var payLoadingAmount = item.Cost - DisputeAmountWithoutComma;
                self.pay($.number(payLoadingAmount, 2));
            }

            //self.reasonNotes(item.ReasonNote);
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

            self.disputeAmount.subscribe(function () {
                if (typeof (lineDisputeValueChanged) === 'function') {
                    var lineDisputeAmountWithOutComma;

                    if (self.disputeAmount() !== null && self.disputeAmount() !== undefined && self.disputeAmount() !== 0.00 && self.disputeAmount().toString() !== '') {
                        lineDisputeAmountWithOutComma = parseFloat(self.disputeAmount().toString().replace(/,/g, ""));
                    } else {
                        lineDisputeAmountWithOutComma = "0.00";
                    }

                    if (self.selectedItemTypeId() && self.selectedItemTypeId() === 70) {
                        var pay = (+item.Cost) - (+lineDisputeAmountWithOutComma * -1);
                        self.pay($.number(pay, 2));
                    } else {
                        var pay = (+item.Cost) - (+lineDisputeAmountWithOutComma);
                        self.pay($.number(pay, 2));
                    }

                    lineDisputeValueChanged();
                }
            });

            self.reasonNotes.subscribe(function () {
                if (typeof (reasonNotesModifiedCallBack) === 'function') {
                    reasonNotesModifiedCallBack();
                }
            });

            self.errorDisputeVendorItemDetail = ko.validatedObservable({
                disputeAmount: self.disputeAmount
            });

            self.disputeAmount.extend({
                max: {
                    params: 1,
                    message: 'Dispute amount should not be greater than cost.',
                    onlyIf: function () {
                        var result;
                        if (self.selectedItemTypeId() && self.selectedItemTypeId() === 70) {
                            result = (self.cost() != null && self.disputeAmount() != null && (Number(parseFloat(self.cost().toString().replace(/,/g, "")) * -1) < parseFloat(self.disputeAmount().toString().replace(/,/g, ""))));
                            self.lineItemIsInvalid(result);
                            return (result);
                        } else if (self.selectedItemTypeId() && self.selectedItemTypeId() === 10) {
                            result = (self.shippingAndDiscountCost() != null && self.disputeAmount() != null && (parseFloat(self.shippingAndDiscountCost().toString().replace(/,/g, "")) < parseFloat(self.disputeAmount().toString().replace(/,/g, ""))));
                            self.lineItemIsInvalid(result);
                            return (result);
                        } else {
                            result = (self.cost() != null && self.disputeAmount() != null && (parseFloat(self.cost().toString().replace(/,/g, "")) < parseFloat(self.disputeAmount().toString().replace(/,/g, ""))));
                            self.lineItemIsInvalid(result);
                            return (result);
                        }
                    }
                },
                number: true
            });

            return self;
        }
        // Cleans up the view model properties
        DisputeVendorBillItemsModel.prototype.cleanup = function () {
            var self = this;

            self.reasonCodesListFoBinding.removeAll();
            self.disputeAmount.extend({ validatable: false });

            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }

            delete self;
        };
        return DisputeVendorBillItemsModel;
    })();
    exports.DisputeVendorBillItemsModel = DisputeVendorBillItemsModel;
});
