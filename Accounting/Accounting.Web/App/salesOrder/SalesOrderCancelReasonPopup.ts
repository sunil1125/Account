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

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refEnums = require('services/models/common/Enums');
import refValidations = require('services/validations/Validations');
//#endregion

/*
** <summary>
** Popup to select the reason for cancelling the Sales Order
** </summary>
** <createDetails>
** <id>US22955</id><by>Shreesha Adiga</by><date>30-06-2016</date>
** </createDetails>
*/
class SalesOrderCancelReasonPopupViewModel {

	//#region Properties

	bolNumber: KnockoutObservable<string> = ko.observable('');
	cancelReasonList: KnockoutObservableArray<any> = ko.observableArray([]);
	selectedReason: KnockoutObservable<number> = ko.observable();

	isBOLNumberVisible: KnockoutObservable<boolean> = ko.observable(false);
	isSubmitButtonEnabled: KnockoutObservable<boolean> = ko.observable(false);

	sumbitCallback: (note: string) => any;
	cancelCallback: () => any;

	validationGroupReason: KnockoutValidationGroup;	//To check changes
	isAlphaNumericSpace: (that, event) => void;

	bolNumberOfTheOrder: string = '';
	username: string = '';
	
	//#endregion

	// Initializes the properties of this class
	//#region Constructor
	constructor() {
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
				onlyIf: () => {
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
		}

		self.selectedReason.subscribe((selectedValue) => {
			self.isBOLNumberVisible(selectedValue === refEnums.Enums.SalesOrderCancelReason.NewSalesOrderCreated.ID.toString());
			self.isSubmitButtonEnabled(true);
		});

	}
	// #endregion

	//on click of submit button
	public onSubmit(dialogResult) {
		var self = this;

		// check if any errors
		if (self.validationGroupReason.errors().length != 0) {
			self.validationGroupReason.errors.showAllMessages();
			return false;
		}

		self.closePopup(dialogResult);

		// get the reason note to be saved
		var reasonNote = self.selectedReason() === refEnums.Enums.SalesOrderCancelReason.NewSalesOrderCreated.ID.toString()
			? ApplicationMessages.Messages.CancelReason_NewSalesOrderCreated
				.replace('{0}', self.bolNumberOfTheOrder)
				.replace('{1}', self.username)
				.replace('{2}', self.bolNumber())
			: ApplicationMessages.Messages.CancelReason_OrderCancelledByCustomer
				.replace('{0}', self.bolNumberOfTheOrder)
				.replace('{1}', self.username);

		self.sumbitCallback(reasonNote);
	}

	// on click of cancel
	public onCancel(dialogResult) {
		var self = this;
		self.closePopup(dialogResult);
		self.cancelCallback();
	}

	// method to close the popup
	public closePopup(dialogResult) {
		var self = this;
		dialogResult.__dialog__.close(this, dialogResult);
		return true;
	}

	//this method gets called first. optioncontrol is used to pass data to popup from where it's called
	public activate(optionControl: IMessageBoxOption) {
		var self = this;

		if (typeof optionControl === "undefined" || typeof optionControl.bindingObject === "undefined")
			return;

		self.sumbitCallback = optionControl.bindingObject.submitCallback;
		self.cancelCallback = optionControl.bindingObject.cancelCallback;
		self.bolNumberOfTheOrder = optionControl.bindingObject.bolNumber;
		self.username = optionControl.bindingObject.username;

		return true;
	}

	public attached() {
		_app.trigger('viewAttached');
	}

	public compositionComplete() {
		var self = this;
	}
}

return SalesOrderCancelReasonPopupViewModel;