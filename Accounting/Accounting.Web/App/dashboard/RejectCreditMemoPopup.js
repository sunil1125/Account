/******************************************************************************

* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.

******************************************************************************/
define(["require", "exports", 'durandal/app'], function(require, exports, ___app__) {
    //#region References
    /// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
    /// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
    /// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
    /// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
    /// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
    /// <reference path="../../Scripts/Utility.ts" />
    /// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
    //#endregion
    var _app = ___app__;
    
    

    /*
    ** <summary>
    ** Popup to do Reject Credit Memo Note
    ** </summary>
    ** <createDetails>
    ** <id>US31415</id> <by>Vasanthakumar</by> <date>21-09-2017</date> <description>Accounting: AR dash board - Credit Memo Requests Rejection Note</description>
    ** </createDetails>
    ** <changeHistory>
    ** </changeHistory>
    */
    var RejectCreditMemoPopupViewModel = (function () {
        //#endregion
        // Initializes the properties of this class
        function RejectCreditMemoPopupViewModel() {
            //#region Members
            this.rejectionNote = ko.observable('');
            var self = this;

            ////#region Validation Rules
            self.rejectionNote.extend({
                required: {
                    message: "Please enter minimum 6 characters"
                },
                minLength: {
                    message: "Please enter minimum 6 characters",
                    params: 6
                }
            });

            self.validationGroupNote = ko.validatedObservable({
                rejectionNote: self.rejectionNote
            });
            //#endregion
        }
        //#region Public Methods
        RejectCreditMemoPopupViewModel.prototype.onReject = function (dialogResult) {
            var self = this;

            if (self.validationGroupNote.errors().length !== 0) {
                self.validationGroupNote.errors.showAllMessages();
                return;
            }

            self.closePopup(dialogResult);
            self.saveCallback(self.rejectionNote());
        };

        RejectCreditMemoPopupViewModel.prototype.onCancel = function (dialogResult) {
            var self = this;
            self.closePopup(dialogResult);
            self.cancelCallback();
        };

        //#endregion
        //#region Life Cycle Event
        //close popup
        RejectCreditMemoPopupViewModel.prototype.closePopup = function (dialogResult) {
            var self = this;
            dialogResult.__dialog__.close(this, dialogResult);
            return true;
        };

        //this method gets called first. optioncontrol is used to pass data to popup from where it's called
        RejectCreditMemoPopupViewModel.prototype.activate = function (optionControl) {
            var self = this;

            if (typeof optionControl !== "undefined" && typeof optionControl.bindingObject !== "undefined") {
                self.saveCallback = optionControl.bindingObject.saveCallback;
                self.cancelCallback = optionControl.bindingObject.cancelCallback;
            }

            console.log(optionControl);
            return true;
        };

        RejectCreditMemoPopupViewModel.prototype.compositionComplete = function () {
            var self = this;
        };
        return RejectCreditMemoPopupViewModel;
    })();

    return RejectCreditMemoPopupViewModel;
});
