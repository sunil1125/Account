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
var Utility;
(function (Utility) {
    function ShowToastr(toastrType, message, context, click_Function, options, fadeout_Function) {
        var actionButtons = [];
        actionButtons.push({
            actionButtonName: 'click one',
            actionClick: function (item) {
                var one = item;
            }
        });

        actionButtons.push({
            actionButtonName: 'click two',
            actionClick: function (item) {
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
        };

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
    Utility.ShowToastr = ShowToastr;

    (function (PaginationUtil) {
        var Pagination = (function () {
            //#endregion
            //#region Constructor
            function Pagination(pageSize, url) {
                //#region Constants
                this.Next = ">";
                this.Prev = "<";
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
                    if (this.TotalItems()[this.CurrentPageIndex()] == null || this.TotalItems()[this.CurrentPageIndex()] == 'undefined') {
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
                    var noOfItem = ((this.CurrentPageIndex() + 1) * this.PageSize() < this.TotalItemCount()) ? (this.CurrentPageIndex() + 1) * this.PageSize() : this.TotalItemCount();

                    if (noOfItem > 0)
                        return noOfItem.toString() + " of " + this.TotalItemCount().toString();
else
                        return '';
                }, this);
            }
            //#endregion
            //#region Public Methods
            Pagination.prototype.SelectNext = function () {
                this.CurrentPageIndex(this.CurrentPageIndex() + 1);
            };

            Pagination.prototype.SelectPrevious = function () {
                this.CurrentPageIndex(this.CurrentPageIndex() - 1);
            };

            Pagination.prototype.SelectPage = function (pageIndex) {
                this.CurrentPageIndex(pageIndex);
            };

            //#endregion
            //#region Private Methods
            Pagination.prototype.successCallBack = function (self, ItemList) {
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
            };

            Pagination.prototype.AjaxCall = function () {
                var self = this;

                var obj = self.AjaxCallFunc(this.successCallBack, '', self.CurrentPageIndex(), self.PageSize());

                return true;
            };
            return Pagination;
        })();
        PaginationUtil.Pagination = Pagination;
    })(Utility.PaginationUtil || (Utility.PaginationUtil = {}));
    var PaginationUtil = Utility.PaginationUtil;
    (function (PasswordStrengthUtil) {
        var PasswordStrengthCalculator = (function () {
            //#endregion
            //#region constructor
            function PasswordStrengthCalculator(maxLen, minLen) {
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
            PasswordStrengthCalculator.prototype.CalculateStrength = function (text) {
                var self = this;

                self.PasswordText(text);
            };

            //#endregion
            //#region Private Methods
            PasswordStrengthCalculator.prototype.GetStrengthLevel = function () {
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
            };

            PasswordStrengthCalculator.prototype.GetStrength = function () {
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
                if (nums) {
                    strength += 2;
                }
                if (lowers) {
                    strength += uppers ? 4 : 3;
                }
                if (uppers) {
                    strength += lowers ? 4 : 3;
                }
                if (specials) {
                    strength += 5;
                }
                if (length > 10) {
                    strength += 1;
                }

                return strength;
            };

            PasswordStrengthCalculator.prototype.countRegexp = function (regx) {
                var self = this;
                var match = self.PasswordText().match(regx);
                return match ? match.length : 0;
            };
            return PasswordStrengthCalculator;
        })();
        PasswordStrengthUtil.PasswordStrengthCalculator = PasswordStrengthCalculator;
    })(Utility.PasswordStrengthUtil || (Utility.PasswordStrengthUtil = {}));
    var PasswordStrengthUtil = Utility.PasswordStrengthUtil;

    // Checks validity of the date format
    function isValidDate(dateToValidate, allowWeekendHoliday) {
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
                var leapYear = (yearNumber % 4 == 0 && (yearNumber % 100 != 0 || yearNumber % 400 == 0));

                if (leapYear) {
                    if (dayNumber > 29) {
                        // Invalid day in Feb
                        return false;
                    }
                } else {
                    if (dayNumber > 28) {
                        // It's not a leap year
                        return false;
                    }
                }
            } else {
                if (dayNumber == 31) {
                    if (monthNumber == 4 || monthNumber == 6 || monthNumber == 9 || monthNumber == 11) {
                        // The 31st is invalid
                        return false;
                    }
                }
            }

            // Try to create a new date object
            var parsedDate = new Date(yearNumber, monthNumber - 1, dayNumber);

            if (parsedDate.toDateString() == "Invalid Date") {
                // The date is invalid
                return parsedDate;
            } else {
                // The date is valid
                return parsedDate;
            }
        }
        return false;
    }
    Utility.isValidDate = isValidDate;
    ;
})(Utility || (Utility = {}));
