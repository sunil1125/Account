/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="jquery.d.ts"/>

/**
* Date range picker options
*/
interface DaterangepickerOptions {
	/**
	* The start of the initially selected date range
	*/
	startDate?: Moment;
	/**
	* The end of the initially selected date range
	*/
	endDate?: Moment;
	/**
	* The earliest date a user may select
	*/
	minDate?: Moment;
	/**
	* The latest date a user may select
	*/
	maxDate?: Moment;
	/**
	* The maximum span between the selected start and end dates. Can have any property you can add to a moment object (i.e. days, months)
	*/
	dateLimit?: MomentInput;
	/**
	* Show year and month select boxes above calendars to jump to a specific month and year
	*/
	showDropdowns?: boolean;
	/**
	* Show week numbers at the start of each week on the calendars
	*/
	showWeekNumbers?: boolean;
	/**
	* Allow selection of dates with times, not just dates
	*/
	timePicker?: boolean;
	/**
	* Increment of the minutes selection list for times (i.e. 30 to allow only selection of times ending in 0 or 30)
	*/
	timePickerIncrement?: number;
	/**
	* Set predefined date ranges the user can select from. Each key is the label for the range, and its value an array with two dates representing the bounds of the range
	*/
	timePicker12Hour?: boolean;
	/**
	* Allow selection of dates with times, not just dates
	*/
	ranges?: Array<RangeStatic>;
	/**
	* Whether the picker appears aligned to the left or to the right of the HTML element it's attached to
	*/
	opens?: string;
	/**
	* CSS class names that will be added to all buttons in the picker
	*/
	buttonClasses?: Array<string>;
	/**
	* CSS class string that will be added to the apply button
	*/
	applyClass?: string;
	/**
	* CSS class string that will be added to the cancel button
	*/
	cancelClass?: string;
	/**
	* Date/time format string used by moment when parsing or displaying the selected dates
	*/
	format?: string;
	/**
	* Separator string to display between the start and end date when populating a text input the picker is attached to
	*/
	separator?: string;
	/**
	* Allows you to provide localized strings for buttons and labels, and the first day of week for the calendars
	*/
	locale?: LocaleStatic;
	/**
	* Allows to show from and to range input highlighter below in the calendar section.
	*/
	showRangeInputsInCalendar?: boolean;
	/**
	* Allows to add cascade style sheet file name for date range picker control.
	*/
	stylesheetName?: string;
	/**
	* Allows to build the range by using enum or custom.
	* Set true when you are using enum for setting range.
	*/
	usRangeByEnum?: boolean;
	/**
	* The function will be called whenever the selected date range has been changed by the user, and is passed the start and end dates (moment date objects), range details (type and name) as parameters
	*/
	calback?: (startDate?: Moment, endDate?: Moment, typeId?: number, typeName?: string) => void;
}

/**
* Ranges for setting/getting the start, end date and type.
*/
interface RangeStatic {
	/**
	* The start date of the selected date range.
	*/
	startDate: Moment;
	/**
	* The end date of the selected date range.
	*/
	endDate: Moment;
	/**
	* The range type number of the selected date range.
	*/
	rangetypeId: number;
	/**
	* The range type name of the selected date range.
	*/
	rangetypeName: string;
}

/**
* Localized string definition for buttons, labels, labels in calendar.
*/
interface LocaleStatic {
	/**
	* Apply button label name.
	*/
	applyLabel?: string;
	/**
	* Cancel button label name.
	*/
	cancelLabel?: string;
	/**
	* Custom range label name.
	*/
	customRangeLabel?: string;
	/**
	* Week days label names. e.g. ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].
	*/
	daysOfWeek?: Array<string>;
	/**
	* Week day number. To show the first day in calendar. e.g. [Sunday = 0]
	*/
	firstDay?: number;
	/**
	* Range from label name.
	*/
	fromLabel?: string;
	/**
	* Month label names. e.g ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	*/
	monthNames?: Array<string>;
	/**
	* Range to label name..
	*/
	toLabel?: string;
	/**
	* Week label name.
	*/
	weekLabel?: string;
}

interface JQuery {
	daterangepicker(): JQuery;
	daterangepicker(methodName: string): JQuery;
	daterangepicker(methodName: string, params: any): JQuery;
	daterangepicker(options: DaterangepickerOptions): JQuery;
	daterangepicker(options: DaterangepickerOptions, calback: (startDate: Moment, endDate: Moment) => void): JQuery;
	daterangepicker(options: DaterangepickerOptions, calback: (startDate: Moment, endDate: Moment, typeId: number, typeName: string) => void): JQuery;
}