/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="utils.ts" />
/// <reference path="TypeDefs/toastr.d.ts" />
/// <reference path="TypeDefs/jquery.d.ts" />
/// <reference path="TypeDefs/knockout.d.ts" />
/// <reference path="../App/services/models/common/Enums.ts" />

module Utility {
	export function ShowToastr(toastrType: any, message: any, context: any, click_Function, options?: IToastrOptions, fadeout_Function?): void {
		var actionButtons: Array<IToastrActionButtonOptions> = [];
		actionButtons.push({
			actionButtonName: 'click one',
			actionClick: (item) => {
				var one = item;
			}
		});

		actionButtons.push({
			actionButtonName: 'click two',
			actionClick: (item) => {
				var two = item;
			}
		});

		toastr.options = {
			closeButton: false,
			debug: true,
			positionClass: options.toastrPositionClass ? options.toastrPositionClass : "toast-bottom-full-width",
			onclick: click_Function,
			onHidden: fadeout_Function,
			showDuration: "300",
			hideDuration: "100",
			timeOut: options.delayInseconds ? (options.delayInseconds * 1000).toString() : "0",
			extendedTimeOut: "0",
			showEasing: "swing",
			hideEasing: "linear",
			showMethod: "fadeIn",
			hideMethod: "fadeOut",
			actionButtons: options.actionButtons
		}
		//if (isSuccessful) {
		//	toastr[options.typeOfAlert ? options.typeOfAlert : 'success'](message, options.title ? options.title : "");
		//}
		//else {
		//	toastr['error'](message, options.title ? options.title : "");
		//}

		if (toastrType === 1 || toastrType === true) {
			toastr[options.typeOfAlert ? options.typeOfAlert : 'success'](message, options.title ? options.title : "");
		} else if (toastrType === 2 || toastrType === false) {
			toastr['error'](message, options.title ? options.title : "");
		} else if (toastrType === 3) {
			toastr[options.typeOfAlert ? options.typeOfAlert : 'info'](message, options.title ? options.title : "");
		} else if (toastrType === 4) {
			toastr[options.typeOfAlert ? options.typeOfAlert : 'warning'](message, options.title ? options.title : "");
		} else {
			toastr[options.typeOfAlert ? options.typeOfAlert : 'warning'](message, options.title ? options.title : "");
		}
	}

	export module PaginationUtil {
		export class Pagination {
			//#region Constants

			public Next: string = ">";
			public Prev: string = "<";

			//#endregion

			//#region Public Members

			public TotalPageCount: KnockoutComputed<number>;
			public isNextEnable: KnockoutComputed<boolean>;
			public isPreviousEnable: KnockoutComputed<boolean>;
			public StatusMessage: KnockoutComputed<string>;
			public TotalItems: KnockoutObservableArray<any>;
			public CurrentGridContent: KnockoutComputed<any>;

			//#endregion

			//#region Private Members

			private AjaxCallFunc: Function;
			private PageSize: KnockoutObservable<number>;
			private TotalItemCount: KnockoutObservable<number>;
			private CurrentPageIndex: KnockoutObservable<number>;

			//#endregion

			//#region Constructor

			constructor(pageSize: number, url: Function) {
				if (pageSize == null || pageSize < 1)
					return Error("PageSize Cannot be null or less than 1.");
				//if (url == null || url == "")
				//	return Error("Url cannot be null or empty string.");

				this.AjaxCallFunc = url;
				this.PageSize = ko.observable(pageSize);
				this.CurrentPageIndex = ko.observable(0);
				this.TotalItemCount = ko.observable(0);
				this.TotalItems = ko.observableArray([]);

				this.CurrentGridContent = ko.computed(function () {
					if (this.TotalItems()[this.CurrentPageIndex()] == null ||
						this.TotalItems()[this.CurrentPageIndex()] == 'undefined') {
						this.AjaxCall();
					}
					return this.TotalItems()[this.CurrentPageIndex()];
				}, this);

				this.TotalPageCount = ko.computed(function () {
					var pageCount = Math.floor(this.TotalItemCount() / this.PageSize());
					return (this.TotalItemCount() % this.PageSize() == 0) ? pageCount : (pageCount + 1);
				}, this);

				this.isNextEnable = ko.computed(function () {
					return (this.CurrentPageIndex() < (this.TotalPageCount() - 1)) ? true : false;
				}, this);

				this.isPreviousEnable = ko.computed(function () {
					return (this.CurrentPageIndex() > 0) ? true : false;
				}, this);

				this.StatusMessage = ko.computed(function () {
					var noOfItem = ((this.CurrentPageIndex() + 1) * this.PageSize() < this.TotalItemCount()) ?
						(this.CurrentPageIndex() + 1) * this.PageSize() : this.TotalItemCount();

					if (noOfItem > 0)
						return noOfItem.toString() + " of " + this.TotalItemCount().toString();
					else
						return '';
				}, this);
			}

			//#endregion

			//#region Public Methods

			public SelectNext() {
				this.CurrentPageIndex(this.CurrentPageIndex() + 1);
			}

			public SelectPrevious() {
				this.CurrentPageIndex(this.CurrentPageIndex() - 1);
			}

			public SelectPage(pageIndex) {
				this.CurrentPageIndex(pageIndex);
			}

			//#endregion

			//#region Private Methods
			public successCallBack(self, ItemList) {
				self.TotalItemCount(ItemList.TotalCount);

				self.TotalItems.push(ItemList.range);
				//	var resultArray = new Array();
				//for (var index = 0; index < ItemList.range.length; index++) {
				//	self.TotalItems.push(ItemList.range[index]);

				////	resultArray.push(resultArray);
				//}

				//	self.CarrierListViewModel(resultArray);
				self.TotalItems.valueHasMutated();
				return true;
			}

			private AjaxCall() {
				var self = this;

				var obj = self.AjaxCallFunc(this.successCallBack, '', self.CurrentPageIndex(), self.PageSize());

				return true;
			}

			//#endregion
		}
	}
	export module PasswordStrengthUtil {
		export class PasswordStrengthCalculator {
			//#region Member Variables
			private StrengthText: any;
			private MinLength: KnockoutObservable<number>;
			private MaxLength: KnockoutObservable<number>;

			public PasswordText: KnockoutObservable<string>;
			public ClassName: KnockoutComputed<string>;
			public PasswordStrength: KnockoutComputed<number>;
			public StrengthDispText: KnockoutComputed<string>;
			//#endregion

			//#region constructor
			constructor(maxLen: number, minLen: number) {
				var self = this;

				self.StrengthText = {
					1: 'Too short',
					2: 'Weak',
					3: 'Fair',
					4: 'Good',
					5: 'Strong'
				};

				self.MaxLength = ko.observable(maxLen);
				self.MinLength = ko.observable(minLen);
				self.PasswordText = ko.observable();

				self.PasswordStrength = ko.computed(function () {
					if (self.PasswordText() != null || self.PasswordText() != undefined)
						return self.GetStrengthLevel();
					return null;
				}, self);

				self.ClassName = ko.computed(function () {
					//return 'password_strength_' + self.PasswordStrength();
					switch (self.PasswordStrength()) {
						case 1:
							return 'short';
							break;
						case 2:
							return 'weak';
							break;
						case 3:
							return 'fair';
							break;
						case 4:
							return 'good';
							break;
						case 5:
							return 'strong';
							break;
						default:
							return 'notRated';
							break;
					}
				}, self);

				self.StrengthDispText = ko.computed(function () {
					return self.StrengthText[self.PasswordStrength()];
				}, self);
			}
			//#endregion

			//#region public method

			public CalculateStrength(text: string) {
				var self = this;

				self.PasswordText(text);
			}

			//#endregion

			//#region Private Methods
			private GetStrengthLevel() {
				var strength = this.GetStrength();

				var val = 1;
				if (strength <= 0) {
					val = 1;
				} else if (strength > 0 && strength <= 4) {
					val = 2;
				} else if (strength > 4 && strength <= 8) {
					val = 3;
				} else if (strength > 8 && strength <= 12) {
					val = 4;
				} else if (strength > 12) {
					val = 5;
				}

				return val;
			}

			private GetStrength() {
				var self = this;

				var length = self.PasswordText().length;
				if (length < self.MinLength())
					return 0;

				var nums = self.countRegexp(/\d/g);
				var lowers = self.countRegexp(/[a-z]/g);
				var uppers = self.countRegexp(/[A-Z]/g);
				var specials = length - nums - lowers - uppers;

				if (nums == length || lowers == length || uppers == length || specials == length) {
					return 1;
				}

				var strength = 0;
				if (nums) { strength += 2; }
				if (lowers) { strength += uppers ? 4 : 3; }
				if (uppers) { strength += lowers ? 4 : 3; }
				if (specials) { strength += 5; }
				if (length > 10) { strength += 1; }

				return strength;
			}

			private countRegexp(regx) {
				var self = this;
				var match = self.PasswordText().match(regx);
				return match ? match.length : 0;
			}
			//#endregion
		}
	}

	// Checks validity of the date format
	export function isValidDate(dateToValidate: string, allowWeekendHoliday?: boolean) {
		// Parses a date string in a given format and returns
		// a true3 if the parsing was successful, or false
		// if parsing failed
		if (dateToValidate) {
			// Usage: parseDate("14/08/12", "dmy", "/")
			// The example above passes a date in day, month, year format
			// delimited by a forward slash
			var format = 'mm/dd/yyyy', delimiter = '/';

			var invalidCharsRegEx = new RegExp("[^0-9" + delimiter + "]");

			if (invalidCharsRegEx.test(dateToValidate)) {
				// The given date contains invalid characters
				return false;
			}

			var refDate = Utils.Common.prototype.nextWorkingDay(new Date(dateToValidate));

			if (refDate.toString() == "Invalid Date") {
				return false;
			}

			if (!allowWeekendHoliday) {
				if (Date.parse(new Date(dateToValidate).format("m/d/yy")) != Date.parse(refDate.format("m/d/yy"))) {
					return false;
				}
			}

			if (Date.parse(new Date(dateToValidate).format("m/d/yy")) < Date.parse(new Date().format("m/d/yy"))) {
				return false;
			}

			var dayIndex = format.indexOf("d");
			var monthIndex = format.indexOf("m");
			var yearIndex = format.indexOf("y");
			var dateParts = dateToValidate.split(delimiter);

			if (dayIndex < 0 || monthIndex < 0 || yearIndex < 0 || dateParts.length < 3) {
				// The supplied date format is incorrect
				return false;
			}
			// Convert the date component parts to numbers
			//var monthNumber = parseInt(dateParts[monthIndex], 10);
			//var dayNumber = parseInt(dateParts[dayIndex], 10);
			//var yearNumber = parseInt(dateParts[yearIndex], 10);

			var monthNumber = parseInt(dateParts[0], 10);
			var dayNumber = parseInt(dateParts[1], 10);
			var yearNumber = parseInt(dateParts[2], 10);

			if (isNaN(dayNumber) || isNaN(monthNumber) || isNaN(yearNumber)) {
				// The day, month or year cannot be determined
				return false;
			}

			if (dayNumber < 1 || dayNumber > 31) {
				// Invalid day
				return false;
			}

			if (monthNumber < 1 || monthNumber > 12) {
				// Invalid month
				return false;
			}

			if (monthNumber == 2) {
				// The month is Feb; see if it's a leap year
				var leapYear = (yearNumber % 4 == 0 &&
					(yearNumber % 100 != 0 ||
					yearNumber % 400 == 0));

				if (leapYear) {
					// It is a leap year, so there's 29 days
					if (dayNumber > 29) {
						// Invalid day in Feb
						return false;
					}
				}
				else {
					// Not a leap year
					if (dayNumber > 28) {
						// It's not a leap year
						return false;
					}
				}
			}
			else {
				// Not February
				if (dayNumber == 31) {
					// It's the 31st day
					if (monthNumber == 4 ||
						monthNumber == 6 ||
						monthNumber == 9 ||
						monthNumber == 11) {
						// The 31st is invalid
						return false;
					}
				}
			}

			// Try to create a new date object
			var parsedDate = new Date(
				yearNumber,
				monthNumber - 1,
				dayNumber);

			if (parsedDate.toDateString() == "Invalid Date") {
				// The date is invalid
				return parsedDate;
			}
			else {
				// The date is valid
				return parsedDate;
			}
		}
		return false;
	};
}