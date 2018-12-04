/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'services/models/common/Enums'], function(require, exports, ___router__, ___app__, __refSystem__, __refEnums__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    var refEnums = __refEnums__;
    

    //#endregion
    /*
    ** <summary>
    ** Popup to select the reason for cancelling the Sales Order
    ** </summary>
    ** <createDetails>
    ** <id>US22955</id><by>Shreesha Adiga</by><date>30-06-2016</date>
    ** </createDetails>
    */
    var SalesOrderCancelReasonPopupViewModel = (function () {
        //#endregion
        // Initializes the properties of this class
        //#region Constructor
        function SalesOrderCancelReasonPopupViewModel() {
            //#region Properties
            this.bolNumber = ko.observable('');
            this.cancelReasonList = ko.observableArray([]);
            this.selectedReason = ko.observable();
            this.isBOLNumberVisible = ko.observable(false);
            this.isSubmitButtonEnabled = ko.observable(false);
            this.bolNumberOfTheOrder = '';
            this.username = '';
            var self = this;

            if (refSystem.isObject(refEnums.Enums.SalesOrderCancelReason)) {
                self.cancelReasonList.removeAll();
                for (var item in refEnums.Enums.SalesOrderCancelReason) {
                    self.cancelReasonList.push(refEnums.Enums.SalesOrderCancelReason[item]);
                }
            }

            // bolNumber Validation
            self.bolNumber.extend({
                required: {
                    message: ApplicationMessages.Messages.BOLNumberIsRequired,
                    onlyIf: function () {
                        return self.selectedReason() === refEnums.Enums.SalesOrderCancelReason.NewSalesOrderCreated.ID.toString();
                    }
                }
            });

            self.validationGroupReason = ko.validatedObservable({
                bolNumber: self.bolNumber
            });

            //To check if entered value is Alpha Numeric and Space
            self.isAlphaNumericSpace = function (data, event) {
                var charCode = (event.which) ? event.which : event.keyCode;

                if ((charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 32 && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122))) {
                    return false;
                }

                return true;
            };

            self.selectedReason.subscribe(function (selectedValue) {
                self.isBOLNumberVisible(selectedValue === refEnums.Enums.SalesOrderCancelReason.NewSalesOrderCreated.ID.toString());
                self.isSubmitButtonEnabled(true);
            });
        }
        // #endregion
        //on click of submit button
        SalesOrderCancelReasonPopupViewModel.prototype.onSubmit = function (dialogResult) {
            var self = this;

            if (self.validationGroupReason.errors().length != 0) {
                self.validationGroupReason.errors.showAllMessages();
                return false;
            }

            self.closePopup(dialogResult);

            // get the reason note to be saved
            var reasonNote = self.selectedReason() === refEnums.Enums.SalesOrderCancelReason.NewSalesOrderCreated.ID.toString() ? ApplicationMessages.Messages.CancelReason_NewSalesOrderCreated.replace('{0}', self.bolNumberOfTheOrder).replace('{1}', self.username).replace('{2}', self.bolNumber()) : ApplicationMessages.Messages.CancelReason_OrderCancelledByCustomer.replace('{0}', self.bolNumberOfTheOrder).replace('{1}', self.username);

            self.sumbitCallback(reasonNote);
        };

        // on click of cancel
        SalesOrderCancelReasonPopupViewModel.prototype.onCancel = function (dialogResult) {
            var self = this;
            self.closePopup(dialogResult);
            self.cancelCallback();
        };

        // method to close the popup
        SalesOrderCancelReasonPopupViewModel.prototype.closePopup = function (dialogResult) {
            var self = this;
            dialogResult.__dialog__.close(this, dialogResult);
            return true;
        };

        //this method gets called first. optioncontrol is used to pass data to popup from where it's called
        SalesOrderCancelReasonPopupViewModel.prototype.activate = function (optionControl) {
            var self = this;

            if (typeof optionControl === "undefined" || typeof optionControl.bindingObject === "undefined")
                return;

            self.sumbitCallback = optionControl.bindingObject.submitCallback;
            self.cancelCallback = optionControl.bindingObject.cancelCallback;
            self.bolNumberOfTheOrder = optionControl.bindingObject.bolNumber;
            self.username = optionControl.bindingObject.username;

            return true;
        };

        SalesOrderCancelReasonPopupViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        SalesOrderCancelReasonPopupViewModel.prototype.compositionComplete = function () {
            var self = this;
        };
        return SalesOrderCancelReasonPopupViewModel;
    })();

    return SalesOrderCancelReasonPopupViewModel;
});
