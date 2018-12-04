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

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refValidations = require('services/validations/Validations');
import refpurchaseOrderClient = require('services/client/PurchaseOrderClient');
//#endregion

class PurchaseOrderReasonViewModel {
	userNote: KnockoutObservable<string> = ko.observable('');
	reasonCodeList: KnockoutObservableArray<IPurchaseOrderReasonCode> = ko.observableArray([]);
	selectedReason: KnockoutObservable<number> = ko.observable(1);
	isOtherChecked: KnockoutObservable<boolean> = ko.observable(true);
	//validationGroupReason: KnockoutValidationGroup;	//To check changes
	callback: (selectedReason: number, note: string) => any;

	// Initializes the properties of this class
	constructor() {
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

		self.selectedReason.subscribe((selectedValue) => {
			if (self.selectedReason().toString() === "8" && self.userNote().trim().length === 0) {
				self.isOtherChecked(false);
			} else {
				self.isOtherChecked(true);
			}
		});

		self.userNote.subscribe((selectedValue) => {
			var selectedValueAfterTream = selectedValue.trim();
			if (selectedValueAfterTream.length > 0 && self.selectedReason().toString() === "8") {
				self.isOtherChecked(true);
			} else if (selectedValueAfterTream.length === 0 && self.selectedReason().toString() === "8") {
				self.isOtherChecked(false)
			} else {
				self.isOtherChecked(true);
			}
		});
		//#endregion
	}

	//on click of submit button
	public submitReason(dialogResult) {
		var self = this;

		//if (self.validationGroupReason.errors().length != 0) {
		//	self.validationGroupReason.errors.showAllMessages();
		//	return false;
		//}

		self.closePopup(dialogResult);
		self.callback(self.selectedReason(), self.userNote());
	}

	//close popup
	public closePopup(dialogResult) {
		var self = this;
		dialogResult.__dialog__.close(this, dialogResult);
		return true;
	}

	//this method gets called first. optioncontrol is used to pass data to popup from where it's called
	public activate(optionControl: IMessageBoxOption) {
		var self = this;
		self.reasonCodeList.push.apply(self.reasonCodeList, optionControl.bindingObject.reasons);
		self.callback = optionControl.bindingObject.callback;
		console.log(optionControl);
		return true;
	}

	public attached() {
		_app.trigger('viewAttached');
	}

	public compositionComplete() {
		var self = this;
	}

	//#endregion
}

return PurchaseOrderReasonViewModel;