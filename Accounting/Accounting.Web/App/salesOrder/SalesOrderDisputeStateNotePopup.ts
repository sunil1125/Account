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

import refValidations = require('services/validations/Validations');
import refSalesOrderClient = require('services/client/SalesOrderClient');

/*
** <summary>
** Popup to input the note, after changing the dispute state
** </summary>
** <createDetails>
** <id>US21131</id> <by>Shreesha Adiga</by> <date>29-03-2016</date>
** </createDetails>
*/
class SalesOrderDisputeStateNotePopupViewModel {

	//#region Members
	disputeStateNote: KnockoutObservable<string> = ko.observable('');
	selectedDisputeState: KnockoutObservable<string> = ko.observable('');

	validationGroupNote: KnockoutValidationGroup;

	saveCallback: (disputeStateNote: string) => any;
	cancelCallback: () => any;
	//#endregion

	// Initializes the properties of this class
	constructor() {
		var self = this;

		////#region Validation Rules
		self.disputeStateNote.extend({
			required: {
				message: "Please enter minimum 10 characters",
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
	public onSave(dialogResult) {
		var self = this;

		if (self.validationGroupNote.errors().length !== 0) {
			self.validationGroupNote.errors.showAllMessages();
			return;
		}

		self.closePopup(dialogResult);
		self.saveCallback(self.disputeStateNote());
	}

	public onCancel(dialogResult) {
		var self = this;
		self.closePopup(dialogResult);
		self.cancelCallback();
	}

	//#endregion

	//#region Life Cycle Event
	//close popup
	public closePopup(dialogResult) {
		var self = this;
		dialogResult.__dialog__.close(this, dialogResult);
		return true;
	}

	//this method gets called first. optioncontrol is used to pass data to popup from where it's called
	public activate(optionControl: IMessageBoxOption) {
		var self = this;

		if (typeof optionControl !== "undefined" && typeof optionControl.bindingObject !== "undefined") {
			self.selectedDisputeState = optionControl.bindingObject.selectedDisputeState;
			self.saveCallback = optionControl.bindingObject.saveCallback;
			self.cancelCallback = optionControl.bindingObject.cancelCallback;
		}

		console.log(optionControl);
		return true;
	}

	public compositionComplete() {
		var self = this;
	}
	//#endregion
}

return SalesOrderDisputeStateNotePopupViewModel;