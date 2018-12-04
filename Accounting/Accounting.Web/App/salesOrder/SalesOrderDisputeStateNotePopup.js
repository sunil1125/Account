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
//#endregion
define(["require", "exports"], function(require, exports) {
    
    

    /*
    ** <summary>
    ** Popup to input the note, after changing the dispute state
    ** </summary>
    ** <createDetails>
    ** <id>US21131</id> <by>Shreesha Adiga</by> <date>29-03-2016</date>
    ** </createDetails>
    */
    var SalesOrderDisputeStateNotePopupViewModel = (function () {
        //#endregion
        // Initializes the properties of this class
        function SalesOrderDisputeStateNotePopupViewModel() {
            //#region Members
            this.disputeStateNote = ko.observable('');
            this.selectedDisputeState = ko.observable('');
            var self = this;

            ////#region Validation Rules
            self.disputeStateNote.extend({
                required: {
                    message: "Please enter minimum 10 characters"
                },
                minLength: {
                    message: "Please enter minimum 10 characters",
                    params: 10
                }
            });

            self.validationGroupNote = ko.validatedObservable({
                disputeStateNote: self.disputeStateNote
            });
            //#endregion
        }
        //#region Public Methods
        SalesOrderDisputeStateNotePopupViewModel.prototype.onSave = function (dialogResult) {
            var self = this;

            if (self.validationGroupNote.errors().length !== 0) {
                self.validationGroupNote.errors.showAllMessages();
                return;
            }

            self.closePopup(dialogResult);
            self.saveCallback(self.disputeStateNote());
        };

        SalesOrderDisputeStateNotePopupViewModel.prototype.onCancel = function (dialogResult) {
            var self = this;
            self.closePopup(dialogResult);
            self.cancelCallback();
        };

        //#endregion
        //#region Life Cycle Event
        //close popup
        SalesOrderDisputeStateNotePopupViewModel.prototype.closePopup = function (dialogResult) {
            var self = this;
            dialogResult.__dialog__.close(this, dialogResult);
            return true;
        };

        //this method gets called first. optioncontrol is used to pass data to popup from where it's called
        SalesOrderDisputeStateNotePopupViewModel.prototype.activate = function (optionControl) {
            var self = this;

            if (typeof optionControl !== "undefined" && typeof optionControl.bindingObject !== "undefined") {
                self.selectedDisputeState = optionControl.bindingObject.selectedDisputeState;
                self.saveCallback = optionControl.bindingObject.saveCallback;
                self.cancelCallback = optionControl.bindingObject.cancelCallback;
            }

            console.log(optionControl);
            return true;
        };

        SalesOrderDisputeStateNotePopupViewModel.prototype.compositionComplete = function () {
            var self = this;
        };
        return SalesOrderDisputeStateNotePopupViewModel;
    })();

    return SalesOrderDisputeStateNotePopupViewModel;
});
