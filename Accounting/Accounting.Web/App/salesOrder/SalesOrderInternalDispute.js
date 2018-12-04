/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../services/models/TypeDefs/VendorBillModels.d.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/models/common/Enums', 'services/validations/Validations', 'services/client/SalesOrderClient', 'services/models/salesOrder/AgentDispute'], function(require, exports, ___router__, ___app__, __refEnums__, __refValidations__, __refSalesOrderClient__, __refsalesOrderDisputeAgentDispute__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refEnums = __refEnums__;
    var refValidations = __refValidations__;
    var refSalesOrderClient = __refSalesOrderClient__;
    
    
    
    var refsalesOrderDisputeAgentDispute = __refsalesOrderDisputeAgentDispute__;

    //#endregion
    /*
    ** <summary>
    ** Purchase Order Agent Email View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US10948</id> <by>Chandan</by> <date>29th july, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var SalesOrderInternalDisputeViewModel = (function () {
        //#endregion
        //#region Constructor
        function SalesOrderInternalDisputeViewModel() {
            //#region Members
            // sales order client class reference
            this.salesOrderClient = null;
            //Logged in User Details For Disputed By
            this.currentUser = ko.observable();
            //Disputed By (Current User)
            this.disputedBy = ko.observable('');
            //Disputed Amount of Selected VB
            this.disputeAmount = ko.observable();
            //disputeAmount: number;
            //Selected Requote reason code
            this.selectedDisputeReason = ko.observable().extend({ required: { message: "A valid Dispute Reason is required." } });
            //For get selected dispute reason Id
            this.selectedDisputeReasonId = ko.observable();
            //Internal Dispute Notes
            this.internalDisputeNotes = ko.observable();
            //Internal Dispute Notes
            this.internalDisputeId = ko.observable();
            //Requote Reason code reference  IRequoteReasonCodes
            this.requoteReasonCode = ko.observableArray([]);
            //Internal Dispute date which binding through salesOrder selected dispute
            this.internalDisputeDatePopup = ko.observable('').extend({ required: { message: " A valid Dispute Date is required" } });
            this.checkMsgDisplay = true;
            this.commonUtils = new Utils.Common();
            this.onSaveClick = ko.observable(false);
            var self = this;

            if (!self.currentUser() && (self.disputedBy() === "" || self.disputedBy() === undefined || self.disputedBy() === null)) {
                self.getLoggedInUserDetails();
                self.disputedBy(self.currentUser().FullName);
            }

            //set the flag allow decimal: true to accepts decimals
            self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true), maxlength: 11, autodigit: ko.observable(true) };

            //To set The date picker options
            self.datepickerOptions = {
                blockWeekend: true,
                blockPreviousDays: false,
                blockHolidaysDays: true,
                autoClose: true,
                placeBelowButton: false
            };

            self.disputeAmount.extend({
                required: {
                    message: ApplicationMessages.Messages.ValidDisputeAmountRequired,
                    onlyIf: function () {
                        return (self.onSaveClick());
                    }
                },
                number: true,
                min: {
                    params: 1,
                    message: ApplicationMessages.Messages.ValidDisputeAmountRequired,
                    onlyIf: function () {
                        return (self.onSaveClick());
                    }
                }
            });

            self.salesOrderClient = new refSalesOrderClient.SalesOrderClient();

            // Load all Requote Reason Code via if not loaded already
            var requoteReasonCodeLength = self.requoteReasonCode().length;
            self.salesOrderClient.GetRequoteReasonCodes(function (data) {
                if (data) {
                    self.requoteReasonCode.removeAll();
                    self.requoteReasonCode.push.apply(self.requoteReasonCode, data);

                    self.bindSelectedDisputeReason();
                }
            }, function () {
            });

            //#region Error Details Object
            self.errorSalesOrderDetail = ko.validatedObservable({
                internalDisputeDatePopup: self.internalDisputeDatePopup,
                disputeAmount: self.disputeAmount,
                selectedDisputeReason: self.selectedDisputeReason
            });

            //To check if Msg is clicked
            self.checkMsgClick = function () {
                self.checkMsgDisplay = true;
            };

            // to Check if Msg is hidden or closed
            self.checkMsgHide = function () {
                self.checkMsgDisplay = true;
            };

            return self;
            //#region Error Details Object
        }
        //#endregion
        // Gets the logged in user details from shell.js
        SalesOrderInternalDisputeViewModel.prototype.getLoggedInUserDetails = function () {
            var self = this;
            _app.trigger("GetCurrentUserDetails", function (currentUser) {
                self.currentUser(currentUser);
            });
        };

        //#region Public Methods
        SalesOrderInternalDisputeViewModel.prototype.bindSelectedDisputeReason = function () {
            var self = this;
            var selectedItem = $.grep(self.requoteReasonCode(), function (e) {
                return e.ReQuoteReasonID === self.selectedDisputeReasonId();
            })[0];
            self.selectedDisputeReason(selectedItem);
        };

        // Check validation for each line item
        SalesOrderInternalDisputeViewModel.prototype.checkValidation = function () {
            var self = this;
            if (self.errorSalesOrderDetail.errors().length != 0) {
                self.errorSalesOrderDetail.errors.showAllMessages();
                return true;
            } else {
                return false;
            }
        };

        SalesOrderInternalDisputeViewModel.prototype.onSaveAgentDispute = function (dialogResult) {
            var _this = this;
            var self = this;
            self.onSaveClick(true);
            if (!self.checkValidation()) {
                self.onSaveClick(false);
                var salesOrderAgentDispute = new refsalesOrderDisputeAgentDispute.Models.AgentDispute();
                salesOrderAgentDispute.DisputedRepName = self.disputedBy();
                salesOrderAgentDispute.DisputeDate = self.internalDisputeDatePopup();
                salesOrderAgentDispute.DisputeReason = self.selectedDisputeReason().ReQuoteReasonID;
                salesOrderAgentDispute.DisputeNotes = self.internalDisputeNotes();
                salesOrderAgentDispute.ShipmentId = self.salesOrderId;
                salesOrderAgentDispute.VendorBillId = self.vendorBillId;
                salesOrderAgentDispute.DisputeAmount = self.disputeAmount();
                salesOrderAgentDispute.Id = self.internalDisputeId();
                refSalesOrderClient.SalesOrderClient.prototype.SaveAgentDispute(salesOrderAgentDispute, function (message) {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 15,
                        fadeOut: 15,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.AgentDisputeSavedSuccessfully, "success", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                    dialogResult.__dialog__.close(_this, dialogResult);
                    return true;
                }, function () {
                });
            }
        };

        //close popup
        SalesOrderInternalDisputeViewModel.prototype.closePopup = function (dialogResult) {
            dialogResult.__dialog__.close(this, dialogResult);
            return true;
        };

        //#endregion
        //#region Private Methods
        SalesOrderInternalDisputeViewModel.prototype.convertToBookedDate = function () {
            var self = this;
            if (!self.internalDisputeDatePopup().match('/') && self.internalDisputeDatePopup().length > 0) {
                self.internalDisputeDatePopup(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.internalDisputeDatePopup()));
            }
        };

        //#endregion
        //#region Life Cycle Event
        SalesOrderInternalDisputeViewModel.prototype.load = function () {
        };
        SalesOrderInternalDisputeViewModel.prototype.compositionComplete = function (view, parent) {
            //$('#txtuserName').focus();
        };

        // Activate the view and bind the selected data from the main view
        SalesOrderInternalDisputeViewModel.prototype.activate = function (refresh) {
            var self = this;

            if (refresh.bindingObject) {
                if (refresh.bindingObject.internalDiputeDate()) {
                    self.internalDisputeDatePopup(self.commonUtils.formatDate(refresh.bindingObject.internalDiputeDate().toString(), 'mm/dd/yyyy'));
                } else {
                    self.internalDisputeDatePopup(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
                }
                if (refresh.bindingObject.internalDisputedAmount()) {
                    self.disputeAmount($.number(refresh.bindingObject.internalDisputedAmount(), 2));
                } else {
                    self.disputeAmount($.number(0, 2));
                }
                self.vendorBillId = refresh.bindingObject.vendorBillId();
                self.salesOrderId = refresh.bindingObject.salesOrderId();
                self.internalDisputeNotes(refresh.bindingObject.internalDisputeNotes());
                self.internalDisputeId(refresh.bindingObject.internalDisputeId());
                self.selectedDisputeReasonId(refresh.bindingObject.disputedReason());
                if (refresh.bindingObject.internalDisputedBy()) {
                    self.disputedBy(refresh.bindingObject.internalDisputedBy());
                }
            }
        };
        return SalesOrderInternalDisputeViewModel;
    })();

    return SalesOrderInternalDisputeViewModel;
});
