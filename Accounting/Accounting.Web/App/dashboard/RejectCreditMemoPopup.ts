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
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../../Scripts/Utility.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion

import _app = require('durandal/app');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refValidations = require('services/validations/Validations');

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
class RejectCreditMemoPopupViewModel {

	//#region Members
	rejectionNote: KnockoutObservable<string> = ko.observable('');
	validationGroupNote: KnockoutValidationGroup;
	saveCallback: (rejectionNote: string) => any;
	cancelCallback: () => any;
	//#endregion

	// Initializes the properties of this class
	constructor() {
		var self = this;

		////#region Validation Rules
		self.rejectionNote.extend({
			required: {
				message: "Please enter minimum 6 characters",
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
	public onReject(dialogResult) {
		var self = this;

		if (self.validationGroupNote.errors().length !== 0) {
			self.validationGroupNote.errors.showAllMessages();
			return;
		}

		self.closePopup(dialogResult);
		self.saveCallback(self.rejectionNote());
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

return RejectCreditMemoPopupViewModel;