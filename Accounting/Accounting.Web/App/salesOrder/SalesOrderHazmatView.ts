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
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import _refAppShell = require('shell');
import refSalesOrderItemModel = require('salesOrder/SalesOrderItemsModel');
import refEnums = require('services/models/common/Enums');
//#endregion

/*
** <summary>
**Sales Order Hazmat ViewModel .
** </summary>
** <createDetails>
** <by>Bhanu Pratap</by> <date>09-08-2014</date>
** </createDetails>}
** <changeHistory>}
** <id>US25117</id> <by>Baldev Singh Thakur</by> <date>30-09-2016</date> <description>Added logic for providing the packing group to selectable list.</description>
** </changeHistory>
*/
export class SalesOrderHazmatViewModel {
	//#region Members
	emergencyPhone: KnockoutObservable<string> = ko.observable('');
	salesOrderItemsList: KnockoutObservableArray<refSalesOrderItemModel.Models.SalesOrderItemsModel> = ko.observableArray([]);
	errorHazmatEmergencyContact: KnockoutValidationGroup;

	//for tracking change
	getBITrackChange: () => string[];
	isBIDirty: KnockoutComputed<boolean>;
	isNotAtLoadingTime: boolean = false;
	isSaveEnable: KnockoutObservable<boolean> = ko.observable(true);
	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	returnValue: boolean = false;
	//#endregion

	// ###START: US25117
	salesOrderHazmatPackingGroup: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);

	// ###END: US25117
	//#region Constructor
	constructor() {
		var self = this;

		//track changes
		self.SetBITrackChange(self);

		self.getBITrackChange = function () {
			return Utils.getDirtyItems(self);
		};

		self.isBIDirty = ko.computed(() => {
			var result = self.emergencyPhone();

			var returnValue = self.getBITrackChange().length > 0 ? true : false;
			self.returnValue = returnValue;
			if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
				self.onChangesMade(returnValue);

			return returnValue;
		});

		self.emergencyPhone.extend({
			trackChange: true,
			required: {
				message: "Emergency contact is required.",
				onlyIf: () => {
					return (self.salesOrderItemsList().length > 0);
				}
			},
			minLength:
			{
				message: "Please Enter 15 digit Phone Number", params: 13,
				onlyIf: function () {
					return (self.salesOrderItemsList().length > 0);
				}
			}
		});

		self.errorHazmatEmergencyContact = ko.validatedObservable({
			emergencyPhone: self.emergencyPhone
		});

		// ###START: US25117
		if (refSystem.isObject(refEnums.Enums.SalesOrderHazmatPackingGroup)) {
			self.salesOrderHazmatPackingGroup.removeAll();
			for (var item in refEnums.Enums.SalesOrderHazmatPackingGroup) {
				self.salesOrderHazmatPackingGroup.push(refEnums.Enums.SalesOrderHazmatPackingGroup[item]);
			}
		}

		// ###END: US25117
	}
	//#endregion

	//#region Internal methods
	// Checks validation in all the items
	public validateHazmatItems() {
		var self = this;
		var isInvalid = false;
		self.salesOrderItemsList().forEach(function (item) {
			if (item.checkHazmatValidation()) {
				isInvalid = true;
			}
		});

		return isInvalid;
	}

	public validateContact() {
		var self = this;
		var isInvalid = false;
		if (self.errorHazmatEmergencyContact.errors().length != 0) {
			self.errorHazmatEmergencyContact.errors.showAllMessages();
			return true;
		} else {
			return false;
		}
	}

	// this function is used to convert formatted phone number.
	public formatToExtensionPhoneNumber(field) {
		var phone = field();
		if (phone && phone.length >= 10 && phone.length <= 15) {
			phone = phone.replace(/[^0-9]/g, '');
			phone = phone.replace(/(\d{3})(\d{3})(\d{4})(\d{1})/, "($1)$2-$3x$4");
			field(phone);
		}
		if (phone && phone.length >= 1 && phone.length <= 10) {
			phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
			field(phone);
		}
	}

	public initializeHazmatGrid(items: Array<refSalesOrderItemModel.Models.SalesOrderItemsModel>, enable?: boolean) {
		var self = this;

		// ###START: US25117
		self.salesOrderItemsList.removeAll();

		items.forEach(function (item, i) {
			var packingGroup = $.grep(self.salesOrderHazmatPackingGroup(), function (value, i) {
				return value.ID == item.packingGroup();
			})[0];

			if (typeof packingGroup === "undefined") {
				item.packingGroup(undefined);
			}

			self.salesOrderItemsList.push(item);
		});

		// ###END: US25117
		self.isSaveEnable(enable);
	}

	//sets the tracking extension for VB required fields
	SetBITrackChange(self) {
		//** To detect changes for Vendor Bill
		self.emergencyPhone.extend({ trackChange: true });
	}
	//#endregion

	//#region Life Cycle Event
	// Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
	public attached() {
		_app.trigger('viewAttached');
	}

	public activate() {
		return true;
	}

	public deactivate() {
	}

	public beforeBind() {
	}

	public compositionComplete() {
	}

	public cleanUp() {
		var self = this;
		for (var salesOrderItem in self.salesOrderItemsList) {
			salesOrderItem = null;
		}
		self.salesOrderItemsList.removeAll();
		delete self.salesOrderItemsList;
		delete self.errorHazmatEmergencyContact;
		self.isBIDirty.dispose();

		for (var property in self) {
			if (property != "cleanup")
				delete self[property];
		}

		delete self;
	}
	//#endregion
}