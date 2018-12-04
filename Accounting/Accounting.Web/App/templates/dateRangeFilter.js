/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created: May 06 2014 */
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.datepicker.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/moment.d.ts" />
define(["require", "exports", 'durandal/system', 'services/models/common/Enums'], function(require, exports, __refSystem__, __refEnums__) {
    var refSystem = __refSystem__;
    var refEnums = __refEnums__;

    /** <summary>
    * * Date Range Filter View Model
    * * < / summary >
    * * <createDetails>proNumber
    * * <id>US8213 < /id> <by>Achal</by > <date></date >
    * * < / createDetails >
    * * <changeHistory>
    * * < / changeHistory >
    */
    var DateRangeFilter = (function () {
        /**
        * {dateFilteroption} Object to create date filter control.
        * if {dateFilteroption} passed as empty or null control will be created with default values.
        * @param {function} onSelectionChanged Event to notify when a control value got changed.
        * @param {function} onClick Event to notify when go/submit button clicked.
        */
        function DateRangeFilter(dateFilteroption, onSelectionChanged, onClick) {
            this.timeframeList = ko.observableArray();
            this.selectedTimeframe = ko.observable();
            this.showTimeframeOption = ko.observable(true);
            this.dateRangePickerValue = ko.observable(null);
            this.enableDateSelection = ko.observable(true);
            /**
            * Variable to decide the subscription events to fire.
            */
            this.allowsubscription = true;
            var CommonUtils = new Utils.Common();
            var self = this, timeframeList, newtimeframeList;
            if (refSystem.isBoolean(dateFilteroption.enableDateSelection)) {
                self.enableDateSelection(dateFilteroption.enableDateSelection);
            }

            if (refSystem.isObject(dateFilteroption)) {
                timeframeList = refSystem.isArray(dateFilteroption.timeframeList) ? (dateFilteroption.timeframeList) : null;

                if (refSystem.isBoolean(dateFilteroption.showTimeframeOption)) {
                    self.showTimeframeOption(dateFilteroption.showTimeframeOption);
                }
            }

            if (refSystem.isFunction(onSelectionChanged)) {
                self.onSelectionChanged = onSelectionChanged;
            }

            if (refSystem.isFunction(onClick)) {
                self.onClick = onClick;
            }

            if ((timeframeList)) {
                if (refSystem.isBoolean(dateFilteroption.enableSmartTimeFrames)) {
                    if ((dateFilteroption.enableSmartTimeFrames == true)) {
                        // To get the alternate time frame list after applying the thresholds based on the Current System Date
                        var timeFrameUtility = new TimeFrameFilterUtility();
                        timeframeList = timeFrameUtility.getSmartTimeFrameList(timeframeList);
                        delete timeFrameUtility;
                    }
                }
                timeframeList.sort(function (a, b) {
                    return a.ID - b.ID;
                });

                timeframeList.forEach(function (item) {
                    self.timeframeList.push(item);
                });
            } else {
                for (var item in refEnums.Enums.DateFilterTimeFrame) {
                    self.timeframeList.push(refEnums.Enums.DateFilterTimeFrame[item]);
                }
            }

            /*
            * preparing the time frame options block
            */
            self.dateRangePickerOptions = {
                ranges: self.buildDateRanges(),
                separator: ' - ',
                showRangeInputsInCalendar: true,
                usRangeByEnum: true,
                applyClass: 'custom-modal-btn-primary'
            };

            //self.datepickerOptions = {
            //	blockWeekend: false,
            //	blockPreviousDays: false,
            //	blockHolidaysDays: false,
            //	autoClose: true,
            //	placeBelowButton: false
            //};
            //self.selectedDatetype(0);
            self.selectedTimeframe.subscribe(function (newValue) {
                if (refSystem.isNumber(newValue)) {
                    var range = self.getDateRangeByTimeframeId(newValue);
                    self.fromDateString = CommonUtils.formatDate(range.fromDate);
                    self.toDateString = CommonUtils.formatDate(range.toDate);
                    self.selectedFilterType = refEnums.Enums.DateFilterType.Timeframe;

                    if (self.allowsubscription) {
                        if (refSystem.isFunction(self.onSelectionChanged)) {
                            var dateFilterArgs = {
                                fromDate: self.fromDateString,
                                toDate: self.toDateString,
                                selectedFilterType: self.selectedFilterType,
                                selectedValueId: newValue
                            };

                            //selectedAging: self.selectedAgingTimeframe(),
                            //selectedDateType: self.selectedDatetype(),
                            self.onSelectionChanged.apply(null, [dateFilterArgs]);
                        }
                    }
                }
            });

            self.dateRangePickerValue.subscribe(function (newValue) {
                if (refSystem.isObject(newValue)) {
                    self.fromDateString = CommonUtils.formatDate(newValue.startDate.toDate());
                    self.toDateString = CommonUtils.formatDate(newValue.endDate.toDate());
                    self.selectedFilterType = refEnums.Enums.DateFilterType.DateRangePicker;

                    self.selectedTimeframe(null);

                    if (self.allowsubscription) {
                        if (refSystem.isFunction(self.onSelectionChanged)) {
                            var dateFilterArgs = {
                                fromDate: self.fromDateString,
                                toDate: self.toDateString,
                                selectedFilterType: self.selectedFilterType,
                                selectedValueId: newValue.rangetypeId
                            };
                            self.onSelectionChanged.apply(null, [dateFilterArgs]);
                        }
                    }
                }
            });

            self.onClickGo = function () {
                if (refSystem.isFunction(self.onClick)) {
                    var selectedId, selectedKey;
                    if (self.selectedFilterType === refEnums.Enums.DateFilterType.Timeframe) {
                        selectedId = self.selectedTimeframe();
                    } else if (self.selectedFilterType === refEnums.Enums.DateFilterType.None) {
                        selectedId = null;
                        selectedKey = null;
                    }

                    var dateFilterArgs = {
                        fromDate: self.fromDateString,
                        toDate: self.toDateString,
                        //selectedAging: self.selectedAgingTimeframe(),
                        //selectedDateType: self.selectedDatetype(),
                        selectedFilterType: self.selectedFilterType,
                        selectedValueId: selectedId,
                        selectedValueKey: selectedKey
                    };
                    self.onClick.apply(null, [dateFilterArgs]);
                }
            };

            if (refSystem.isObject(dateFilteroption.defaultTimeFrameSelected)) {
                if (refSystem.isBoolean(dateFilteroption.enableSmartTimeFrames)) {
                    if ((dateFilteroption.enableSmartTimeFrames == true)) {
                        // To get the alternate default time frame selected value after validating the thresholds.
                        var timeFrameUtility = new TimeFrameFilterUtility();
                        dateFilteroption.defaultTimeFrameSelected = timeFrameUtility.getAlternateTimeFrameDefault(dateFilteroption.defaultTimeFrameSelected);
                        delete timeFrameUtility;
                    }
                }
                self.selectedTimeframe(dateFilteroption.defaultTimeFrameSelected.ID);

                var defaultRange = self.getDateRangeByTimeframeId(dateFilteroption.defaultTimeFrameSelected.ID);
                self.dateRangePickerOptions.startDate = moment(defaultRange.fromDate);
                self.dateRangePickerOptions.endDate = moment(defaultRange.toDate);
            }

            self.setTimeFrame = function (timeframeId, allowsubscribe) {
                var subscribtion = self.allowsubscription;
                if (!refSystem.isNumber(timeframeId)) {
                    throw new Error('Invalid time frame id!');
                }
                if (refSystem.isBoolean(allowsubscribe)) {
                    self.allowsubscription = allowsubscribe;
                }
                var isTimeframeExist = ko.utils.arrayFirst(self.timeframeList(), function (tf) {
                    return tf.ID === timeframeId;
                });
                if (isTimeframeExist) {
                    self.selectedTimeframe(timeframeId);
                } else {
                    throw new Error('Given time frame id is not exist in the time frame list!');
                }
                self.allowsubscription = subscribtion;
            };

            self.fillDateFilter = function (dateFilterOptions, allowsubscribe) {
                var subscribtion = self.allowsubscription;
                if (!refSystem.isObject(dateFilterOptions)) {
                    throw new Error('Invalid date filter options!');
                }
                if (refSystem.isBoolean(allowsubscribe)) {
                    self.allowsubscription = allowsubscribe;
                }
                var dates;
                switch (dateFilterOptions.selectedFilterType) {
                    case refEnums.Enums.DateFilterType.Timeframe:
                        self.setTimeFrame(dateFilterOptions.selectedValueId);
                        break;
                    case refEnums.Enums.DateFilterType.DateRangePicker:
                        dates = {
                            startDate: moment(dateFilterOptions.fromDate),
                            endDate: moment(dateFilterOptions.toDate),
                            rangetypeId: 0,
                            rangetypeName: ''
                        };
                        break;
                }
                if (dates) {
                    self.dateRangePickerValue(null);
                    self.dateRangePickerValue(dates);
                }

                self.allowsubscription = subscribtion;
            };
        }
        DateRangeFilter.prototype.buildDateRanges = function () {
            var self = this;
            var ranges = [];
            if (self.timeframeList && self.timeframeList()) {
                self.timeframeList().forEach(function (item) {
                    var range = self.getDateRangeByTimeframeId(item.ID);
                    ranges.push({ startDate: moment(range.fromDate), endDate: moment(range.toDate), rangetypeId: item.ID, rangetypeName: item.Value });
                });
            }
            return ranges;
        };

        DateRangeFilter.prototype.getDateRangeByTimeframeId = function (timeframeId) {
            var today = new Date(), fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()), toDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

            switch (timeframeId) {
                case refEnums.Enums.DateFilterTimeFrame.Today.ID:
                    break;
                case refEnums.Enums.DateFilterTimeFrame.WTD.ID:
                    fromDate.setDate(today.getDate() - today.getDay());
                    break;
                case refEnums.Enums.DateFilterTimeFrame.MTD.ID:
                    fromDate.setDate(1);
                    break;
                case refEnums.Enums.DateFilterTimeFrame.Last30Days.ID:
                    fromDate.setDate(today.getDate() - 30);
                    break;
                case refEnums.Enums.DateFilterTimeFrame.Last4Weeks.ID:
                    fromDate.setDate(today.getDate() - 28);
                    break;
                case refEnums.Enums.DateFilterTimeFrame.YTD.ID:
                    fromDate.setMonth(0, 1);
                    break;
                case refEnums.Enums.DateFilterTimeFrame.LastYear.ID:
                    fromDate.setFullYear(today.getFullYear() - 1, 0, 1);
                    toDate.setFullYear(today.getFullYear() - 1, 11, 31);
                    break;
                case refEnums.Enums.DateFilterTimeFrame.Last12Months.ID:
                    fromDate.setFullYear(today.getFullYear() - 1);
                    break;
                case refEnums.Enums.DateFilterTimeFrame.Quarter1.ID:
                    fromDate.setMonth(0, 1);
                    toDate.setMonth(2, 31);
                    break;
                case refEnums.Enums.DateFilterTimeFrame.Quarter2.ID:
                    fromDate.setMonth(3, 1);
                    toDate.setMonth(5, 30);
                    break;
                case refEnums.Enums.DateFilterTimeFrame.Quarter3.ID:
                    fromDate.setMonth(6, 1);
                    toDate.setMonth(8, 30);
                    break;
                case refEnums.Enums.DateFilterTimeFrame.Quarter4.ID:
                    fromDate.setMonth(9, 1);
                    toDate.setMonth(11, 31);
                    break;
                case refEnums.Enums.DateFilterTimeFrame.LastWeek.ID:
                    fromDate.setDate(today.getDate() - (today.getDay() + 7));
                    toDate.setDate(fromDate.getDate() + 6);
                    break;
                case refEnums.Enums.DateFilterTimeFrame.LastMonth.ID:
                    fromDate.setMonth(today.getMonth() - 1, 1);
                    toDate.setMonth(today.getMonth(), 0);
                    break;
                case refEnums.Enums.DateFilterTimeFrame.LastQuarter1.ID:
                    fromDate.setFullYear(today.getFullYear() - 1, 0, 1);
                    toDate.setFullYear(today.getFullYear() - 1, 2, 31);
                    break;
                case refEnums.Enums.DateFilterTimeFrame.LastQuarter2.ID:
                    fromDate.setFullYear(today.getFullYear() - 1, 3, 1);
                    toDate.setFullYear(today.getFullYear() - 1, 5, 30);
                    break;
                case refEnums.Enums.DateFilterTimeFrame.LastQuarter3.ID:
                    fromDate.setFullYear(today.getFullYear() - 1, 6, 1);
                    toDate.setFullYear(today.getFullYear() - 1, 8, 30);
                    break;
                case refEnums.Enums.DateFilterTimeFrame.LastQuarter4.ID:
                    fromDate.setFullYear(today.getFullYear() - 1, 9, 1);
                    toDate.setFullYear(today.getFullYear() - 1, 11, 31);
                    break;
            }

            return { fromDate: fromDate, toDate: toDate };
        };
        return DateRangeFilter;
    })();
    exports.DateRangeFilter = DateRangeFilter;

    var TimeFrameFilterUtility = (function () {
        function TimeFrameFilterUtility() {
            this.newTimeFrameList = ([]);
            var self = this;

            self.getDaysDifferenceForTimeFrame = function (timeFrameID) {
                if (refSystem.isNumber(timeFrameID)) {
                    var today = new Date();
                    var fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()), toDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

                    switch (timeFrameID) {
                        case refEnums.Enums.DateFilterTimeFrame.Today.ID:
                            toDate.setDate(today.getDate() + 1);
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.WTD.ID:
                            fromDate.setDate(today.getDate() - today.getDay());
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.MTD.ID:
                            fromDate.setDate(1);
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.Last30Days.ID:
                            fromDate.setDate(today.getDate() - 30);
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.Last4Weeks.ID:
                            fromDate.setDate(today.getDate() - 28);
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.YTD.ID:
                            fromDate.setMonth(0, 1);
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.LastYear.ID:
                            fromDate.setFullYear(today.getFullYear() - 1, 0, 1);
                            toDate.setFullYear(today.getFullYear() - 1, 11, 31);
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.Last12Months.ID:
                            fromDate.setFullYear(today.getFullYear() - 1);
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.Quarter1.ID:
                            fromDate.setMonth(0, 1);
                            toDate.setMonth(2, 31);
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.Quarter2.ID:
                            fromDate.setMonth(3, 1);
                            toDate.setMonth(5, 30);
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.Quarter3.ID:
                            fromDate.setMonth(6, 1);
                            toDate.setMonth(8, 30);
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.Quarter4.ID:
                            fromDate.setMonth(9, 1);
                            toDate.setMonth(11, 31);
                            break;
                    }

                    var diffDaysForToday = moment(today).startOf('day').diff(moment(fromDate), "days", true);
                    var diffDaysBetweenSelectedDates = moment(toDate).startOf('day').diff(moment(fromDate), "days", true);

                    return {
                        fromDate: fromDate,
                        toDate: toDate,
                        daysBetweenTodayAndFromDate: diffDaysForToday,
                        daysBetweenFromAndToDates: diffDaysBetweenSelectedDates
                    };
                }
            };

            self.getAlternateTimeFrame = function (item, tfObject) {
                var newItem = null;

                if (refSystem.isObject(tfObject)) {
                    switch (item.ID) {
                        case refEnums.Enums.DateFilterTimeFrame.Today.ID:
                             {
                                newItem = { ID: item.ID, Value: item.Value };
                            }
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.WTD.ID:
                            if (tfObject.daysBetweenTodayAndFromDate <= 1 && tfObject.daysBetweenFromAndToDates <= 1) {
                                newItem = refEnums.Enums.DateFilterTimeFrame.LastWeek;
                            } else {
                                newItem = { ID: item.ID, Value: item.Value };
                            }
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.MTD.ID:
                            if (tfObject.daysBetweenTodayAndFromDate < 7 && tfObject.daysBetweenFromAndToDates < 7) {
                                newItem = refEnums.Enums.DateFilterTimeFrame.LastMonth;
                            } else {
                                newItem = { ID: item.ID, Value: item.Value };
                            }
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.Last30Days.ID:
                             {
                                newItem = { ID: item.ID, Value: item.Value };
                            }
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.Last4Weeks.ID:
                             {
                                newItem = { ID: item.ID, Value: item.Value };
                            }
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.YTD.ID:
                             {
                                newItem = { ID: item.ID, Value: item.Value };
                            }
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.LastYear.ID:
                             {
                                newItem = { ID: item.ID, Value: item.Value };
                            }
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.Last12Months.ID:
                             {
                                newItem = { ID: item.ID, Value: item.Value };
                            }
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.Quarter1.ID:
                            if (tfObject.daysBetweenTodayAndFromDate < 45) {
                                newItem = refEnums.Enums.DateFilterTimeFrame.LastQuarter1;
                            } else {
                                newItem = { ID: item.ID, Value: item.Value };
                            }
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.Quarter2.ID:
                            if (tfObject.daysBetweenTodayAndFromDate < 45) {
                                newItem = refEnums.Enums.DateFilterTimeFrame.LastQuarter2;
                            } else {
                                newItem = { ID: item.ID, Value: item.Value };
                            }
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.Quarter3.ID:
                            if (tfObject.daysBetweenTodayAndFromDate < 45) {
                                newItem = refEnums.Enums.DateFilterTimeFrame.LastQuarter3;
                            } else {
                                newItem = { ID: item.ID, Value: item.Value };
                            }
                            break;
                        case refEnums.Enums.DateFilterTimeFrame.Quarter4.ID:
                            if (tfObject.daysBetweenTodayAndFromDate < 45) {
                                newItem = refEnums.Enums.DateFilterTimeFrame.LastQuarter4;
                            } else {
                                newItem = { ID: item.ID, Value: item.Value };
                            }
                            break;
                    }

                    return (newItem);
                }
            };
        }
        TimeFrameFilterUtility.prototype.getAlternateTimeFrameDefault = function (srcDefaultItem) {
            var self = this;
            var daysDiff = null;
            var alternateTimeFrameItem = null;

            if ((srcDefaultItem != null)) {
                daysDiff = self.getDaysDifferenceForTimeFrame(srcDefaultItem.ID);
                alternateTimeFrameItem = self.getAlternateTimeFrame(srcDefaultItem, daysDiff);
                if (alternateTimeFrameItem == null) {
                    alternateTimeFrameItem = srcDefaultItem;
                }
            }
            return (alternateTimeFrameItem);
        };

        TimeFrameFilterUtility.prototype.getSmartTimeFrameList = function (srcTimeFrameList) {
            var self = this;
            var daysDiff = null;
            var alternateTimeFrameItem = null;

            if ((srcTimeFrameList)) {
                srcTimeFrameList.forEach(function (item) {
                    daysDiff = self.getDaysDifferenceForTimeFrame(item.ID);

                    alternateTimeFrameItem = self.getAlternateTimeFrame(item, daysDiff);

                    if (alternateTimeFrameItem != null) {
                        self.newTimeFrameList.push(alternateTimeFrameItem);
                    }
                });
            }
            return (self.newTimeFrameList);
        };
        return TimeFrameFilterUtility;
    })();
});
