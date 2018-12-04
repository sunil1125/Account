/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app'], function(require, exports, ___router__, ___app__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    

    //#endregion
    var PurchaseOrderReasonViewModel = (function () {
        // Initializes the properties of this class
        function PurchaseOrderReasonViewModel() {
            this.userNote = ko.observable('');
            this.reasonCodeList = ko.observableArray([]);
            this.selectedReason = ko.observable(1);
            this.isOtherChecked = ko.observable(true);
            var self = this;

            ////#region Validation Rules
            //self.userNote.extend({
            //	required: {
            //		message: ApplicationMessages.Messages.CostRequired,
            //		onlyIf: () => {
            //			return (self.selectedReason() == 8);
            //		}
            //	}
            //});
            //self.validationGroupReason = ko.validatedObservable({
            //	userNote: self.userNote
            //});
            self.selectedReason.subscribe(function (selectedValue) {
                if (self.selectedReason().toString() === "8" && self.userNote().trim().length === 0) {
                    self.isOtherChecked(false);
                } else {
                    self.isOtherChecked(true);
                }
            });

            self.userNote.subscribe(function (selectedValue) {
                var selectedValueAfterTream = selectedValue.trim();
                if (selectedValueAfterTream.length > 0 && self.selectedReason().toString() === "8") {
                    self.isOtherChecked(true);
                } else if (selectedValueAfterTream.length === 0 && self.selectedReason().toString() === "8") {
                    self.isOtherChecked(false);
                } else {
                    self.isOtherChecked(true);
                }
            });
            //#endregion
        }
        //on click of submit button
        PurchaseOrderReasonViewModel.prototype.submitReason = function (dialogResult) {
            var self = this;

            //if (self.validationGroupReason.errors().length != 0) {
            //	self.validationGroupReason.errors.showAllMessages();
            //	return false;
            //}
            self.closePopup(dialogResult);
            self.callback(self.selectedReason(), self.userNote());
        };

        //close popup
        PurchaseOrderReasonViewModel.prototype.closePopup = function (dialogResult) {
            var self = this;
            dialogResult.__dialog__.close(this, dialogResult);
            return true;
        };

        //this method gets called first. optioncontrol is used to pass data to popup from where it's called
        PurchaseOrderReasonViewModel.prototype.activate = function (optionControl) {
            var self = this;
            self.reasonCodeList.push.apply(self.reasonCodeList, optionControl.bindingObject.reasons);
            self.callback = optionControl.bindingObject.callback;
            console.log(optionControl);
            return true;
        };

        PurchaseOrderReasonViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        PurchaseOrderReasonViewModel.prototype.compositionComplete = function () {
            var self = this;
        };
        return PurchaseOrderReasonViewModel;
    })();

    return PurchaseOrderReasonViewModel;
});
