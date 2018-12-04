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
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refEnums = require('services/models/common/Enums');
import refCommon = require('services/client/CommonClient');
import refValidations = require('services/validations/Validations');
//#endregion

/*
** <summary>
** Vendor Bill search View Model.
** </summary>
** <createDetails>
** <id>US8435</id> <by>ACHAL RASTOGI</by> <date>04-24-2014</date>
** </createDetails>}
** <changeHistory>}
** <ID>US7651</ID> <BY>Satish</BY><DATE>19-Jun-2014</DATE><DESC>Implemented View Model to accept the search criteria.</DESC>
** </changeHistory>
*/
export class VendorBillSearchViewModel {
	//#region Members

	//** holds the vendorName. */
	vendorName: KnockoutObservable<string> = ko.observable('');

	//** holds the shipperCompanyName
	shipperCompanyName: KnockoutObservable<string> = ko.observable('');

	//** holds the consigneeCompanyName
	consigneeCompanyName: KnockoutObservable<string> = ko.observable('');

	//** holds the pro number. */
	proNumber: KnockoutObservable<string> = ko.observable('');

	 //** holds the bol Number. */
	bolNumber: KnockoutObservable<string> = ko.observable('');

	//** hold the customer bol number. */
	customerBOLNumber: KnockoutObservable<string> = ko.observable('');

	//** holds the po number. */
	poNumber: KnockoutObservable<string> = ko.observable('');

	//** holds the reference number. */
	refNumber: KnockoutObservable<string> = ko.observable('');

	//** holds the shipper zip. */
	shipperZip: KnockoutObservable<string> = ko.observable('');

	//** holds the consignee zip. */
	consigneeZip: KnockoutObservable<string> = ko.observable('');

	//** holds the total pieces. */
	totalPieces: KnockoutObservable<number> = ko.observable();

	//** holds total weight. */
	totalWeigth: KnockoutObservable<number> = ko.observable();

	//** holds vendor amount. */
	vendorAmount: KnockoutObservable<number> = ko.observable();

	//** holds bill status list. */
	billStatusList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);

	//**holds the selected value of bill status. */
	selectedbillStatusList: KnockoutObservable<number> = ko.observable();

	//** holds shipper city. */
	shipperCity: KnockoutObservable<string> = ko.observable('');

	//** holds consignee city. */
	consigneeCity: KnockoutObservable<string> = ko.observable('');

	//** holds item numbers. */
	itemNumberList: KnockoutObservableArray<IShipmentItemType> = ko.observableArray([]);

	//** holds the selected date range option. */
	itemNumberSelectedOption: KnockoutObservable<string> = ko.observable('');

	//** holds the date range options. */
	dateRangeOptionsList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);

	//** holds the selected date range option. */
	dateRangeSelectedOption: KnockoutObservable<number> = ko.observable();

	//** Function. */
	isNumber: (that, event) => void;

	//** isDate section disable or enable? */
	isDateSectionVisible: KnockoutObservable<boolean> = ko.observable(false);

	datepickerOptions: DatepickerOptions;
	datepickerOptionsDelivery: DatepickerOptions;

	fromDate: KnockoutObservable<any> = ko.observable('');
	toDate: KnockoutObservable<any> = ko.observable('');

	CommonUtils: CommonStatic = new Utils.Common();
	//#endregion

	//#region Constructor
	constructor() {
		var self = this;

		//#region Date Validation
		self.fromDate = ko.observable().extend({
			required: {
				message: ApplicationMessages.Messages.BillDateIsRequired
			},

			validation: {
				validator: function () { return refValidations.Validations.isValidDate(self.fromDate(), self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "FromDate"); },
				message: ApplicationMessages.Messages.NotAValidDate
			}
		});
		self.toDate = ko.observable().extend({
			required: {
				message: ApplicationMessages.Messages.DeliveryDateRequired
			},

			validation: {
				validator: function () { return refValidations.Validations.isValidDate(self.toDate(), self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "ToDate"); },
				message: ApplicationMessages.Messages.NotAValidDate
			}
		});

		//#endregion

		//# region to fill dropdowns

		//Fill the selected date range options
		if (refSystem.isObject(refEnums.Enums.DateRange)) {
			self.dateRangeOptionsList.removeAll();
			for (var item in refEnums.Enums.DateRange) {
				self.dateRangeOptionsList.push(refEnums.Enums.DateRange[item]);
			}
		}

		//** fill vendor bill status options list. */
		if (refSystem.isObject(refEnums.Enums.VendorBillStatus)) {
			for (var item in refEnums.Enums.VendorBillStatus) {
				self.billStatusList.push(refEnums.Enums.VendorBillStatus[item]);
			}
		}

		// Load all shipment types if not loaded already
		var itemNumberList: number = self.itemNumberList().length;
		if (!(itemNumberList)) {
			refCommon.Common.prototype.GetListShipmentType(function (data) {
				if (data) {
					self.itemNumberList.removeAll();
					self.itemNumberList.push.apply(self.itemNumberList, data);
				}
			});
		}

		//#end region

		//To check if enter value is digit and decimal
		self.isNumber = function (data, event) {
			var charCode = (event.which) ? event.which : event.keyCode;

			if ((charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57))) {
				return false;
			}
			return true;
		}

		//** To initialize the dates. */
		self.fromDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
		self.toDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));

		//** To set The date picker options. */
		self.datepickerOptions = {
			blockWeekend: true,
			blockPreviousDays: false,
			blockHolidaysDays: true,
			autoClose: true,
			placeBelowButton: false,
			endDate: new Date()
		};
		self.datepickerOptionsDelivery = {
			blockWeekend: true,
			blockPreviousDays: false,
			blockHolidaysDays: true,
			autoClose: true,
			placeBelowButton: false
		};

		//** Set the visibility of date section according to the current date range selection. */
		self.dateRangeSelectedOption.subscribe(function () {
			//alert('hi' + self.dateRangeSelectedOption());
			if (self.dateRangeSelectedOption() !== refEnums.Enums.DateRange.Custom.ID)
				self.isDateSectionVisible(false);
			else
				self.isDateSectionVisible(true);
		});

		return self;
	}
	//#endregion

	//#region Internal Methods

	//#endregion

	//#region Life Cycle Event
	public activate() {
		return true;
	}
	// Gets the all needed values like ENUMs
	public beforeBind() {
		var self = this;
	}

	//#endregion
}