/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="jquery.d.ts"/>

/**
* Time picker options
*/
interface jQTimepickerOptions {
	/**
	* Override where the dropdown is appended.
	* Takes either a string to use as a selector, a function that gets passed the clicked input element as argument or a jquery object to use directly.
	* default: "body"
	*/
	appendTo?: string;
	/**
	* A class name to apply to the HTML element that contains the timepicker dropdown.
	* default: null
	*/
	className?: string;
	/**
	* Close the timepicker when the window is scrolled. (Replicates <select> behavior.)
	* default: false
	*/
	closeOnWindowScroll?: boolean;
	/**
	* Disable selection of certain time ranges. Input is an array of time pairs, like `[['3:00am', '4:30am'], ['5:00pm', '8:00pm']]
	* default: []
	*/
	disableTimeRanges?: Array<jQTimeRange[]>;
	/**
	* Disable the onscreen keyboard for touch devices.
	* default: false
	*/
	disableTouchKeyboard?: boolean;
	/**
	* The time against which showDuration will compute relative times. If this is a function, its result will be used.
	* default: minTime
	*/
	durationTime?: () => string;
	/**
	* Force update the time to step settings as soon as it loses focus.
	* default: false
	*/
	forceRoundTime?: boolean;
	/**
	* Language constants used in the timepicker. Can override the defaults by passing an object with one or more of the following properties: decimal, mins, hr, hrs.
	* default: { decimal: '.', mins: 'mins', hr: 'hr', hrs: 'hrs' }
	*/
	lang?: jQTimeLanguage;
	/**
	* The time that should appear last in the dropdown list. Can be used to limit the range of time options.
	* default: 24 hours after minTime
	*/
	maxTime?: string;
	/**
	* The time that should appear first in the dropdown list.
	* default: 12:00am
	*/
	minTime?: string;
	/**
	* Adds one or more custom options to the top of the dropdown. Can accept several different value types:
	* Boolean (true): Adds a "None" option that results in an empty input value
	* String: Adds an option with a custom label that results in an empty input value
	* Object[jQTimeNoneOption]: Similar to string, but allows customizing the element's class name and the resulting input value. Can contain label, value, and className properties. value must be a string type.
	* Array: An array of strings or objects to add multiple non-time options
	* default: false
	*/
	noneOption?: any;
	/**
	* If no time value is selected, set the dropdown scroll position to show the current time.
	* default: false
	*/
	scrollDefaultNow?: boolean;
	/**
	* If no time value is selected, set the dropdown scroll position to show the time provided, e.g. "09:00". A string, Date object, or integer (seconds past midnight) is acceptible.
	* default: null
	*/
	scrollDefaultTime?: any;
	/**
	* Update the input with the currently highlighted time value when the timepicker loses focus.
	* default: false
	*/
	selectOnBlur?: string;
	/**
	* Shows the relative time for each item in the dropdown. minTime or durationTime must be set.
	* default: false
	*/
	showDuration?: boolean;
	/**
	* The amount of time, in minutes, between each item in the dropdown.
	* default: 30
	*/
	step?: number;
	/**
	* How times should be displayed in the list and input element. Uses PHP's date() formatting syntax[http://php.net/manual/en/function.date.php].
	* default: 'g:ia'
	*/
	timeFormat?: string;
	/**
	* Highlight the nearest corresponding time option as a value is typed into the form input.
	* default: true
	*/
	typeaheadHighlight?: boolean;
	/**
	* Convert the input to an HTML <SELECT> control. This is ideal for small screen devices, or if you want to prevent the user from entering arbitrary values.
	* This option is not compatible with the following options: appendTo, closeOnWindowScroll, disableTouchKeyboard, forceRoundTime, scrollDefaultNow, selectOnBlur, typeAheadHighlight.
	* default: true
	*/
	useSelect?: boolean;
}

/**
* Range for setting/getting the start, end time.
*/
interface jQTimeRange {
	/**
	* The start time of the time range.
	*/
	startTime?: string;
	/**
	* The end time of the time range.
	*/
	endTime?: string;
}

/**
* Adds one or more custom options to the top of the dropdown.
*/
interface jQTimeNoneOption {
	/**
	* allows customizing the element's label name
	*/
	label?: string;
	/**
	* allows customizing the element's class name
	*/
	className?: string;
	/**
	* allows customizing the resulting input value
	*/
	value?: string;
}

/**
* Language constants used in the timepicker
*/
interface jQTimeLanguage {
	/**
	* String for am.
	*/
	am?: string;
	/**
	* String for am.
	*/
	pm?: string;
	/**
	* String for AM.
	*/
	AM?: string;
	/**
	* String for PM.
	*/
	PM?: string;
	/**
	* String for decimal.
	*/
	decimal?: string;
	/**
	* String for mins.
	*/
	mins?: string;
	/**
	* String for hr.
	*/
	hr?: string;
	/**
	* String for hrs.
	*/
	hrs?: string;
}

/**
* jQ time picker methods
*/
interface jQTimepicker extends JQuery {
	/**
	* Get the time as an integer, expressed as seconds from 12am.
	* eg.: $('#getTimeExample').timepicker('getSecondsFromMidnight');
	* @returns {number}
	*/
	getSecondsFromMidnight(): number;
	/**
	* Get the time using a Javascript Date object, relative to a Date object (default: today).
	* eg.: $('#getTimeExample').timepicker('getTime'[, new Date()]);
	* You can get the time as a string using jQuery's built-in val() function: $('#getTimeExample').val();
	* @param {Date} relative_date
	* @returns {number}
	*/
	getTime(relative_date?: Date): number;
	/**
	* Close the timepicker dropdown.
	* eg.: $('#hideExample').timepicker('hide');
	* @returns {jQTimepicker}
	*/
	hide(): jQTimepicker;
	/**
	* Change the settings of an existing timepicker. Calling option on a visible timepicker will cause the picker to be hidden.
	* eg.:	$('#optionExample').timepicker({ 'timeFormat': 'g:ia' });
	*		$('#optionExample').timepicker('option', 'minTime', '2:00am');
	*		$('#optionExample').timepicker('option', { 'minTime': '4:00am', 'timeFormat': 'H:i' });
	* @param {string} key
	* @param {string} value
	* @returns {jQTimepicker}
	*/
	option(key: string, value: string): jQTimepicker;
	/**
	* Unbind an existing timepicker element.
	* eg.: $('#removeExample').timepicker('remove');
	* @returns {jQTimepicker}
	*/
	remove(): jQTimepicker;
	/**
	* Set the time using a Javascript Date object.
	* eg.: $('#setTimeExample').timepicker('setTime', new Date());
	* @returns {jQTimepicker}
	*/
	setTime(value: Date): jQTimepicker;
	/**
	* Display the timepicker dropdown.
	* eg.: $('#showExample').timepicker('show');
	* @returns {jQTimepicker}
	*/
	show(): jQTimepicker;
}

interface JQuery {
	jQTimepicker(): jQTimepicker;
	jQTimepicker(options?: jQTimepickerOptions): jQTimepicker;
	jQTimepicker(methodName?: string, options?: jQTimepickerOptions): jQTimepicker;
	jQTimepicker(methodName: string): any;
	/**
	* Get the time as an integer, expressed as seconds from 12am.
	* eg.: $('#getTimeExample').timepicker('getSecondsFromMidnight');
	* @returns {number}
	*/
	jQTimepicker(methodName: 'getSecondsFromMidnight'): number;
	/**
	* Get the time using a Javascript Date object, relative to a Date object (default: today).
	* eg.: $('#getTimeExample').timepicker('getTime'[, new Date()]);
	* You can get the time as a string using jQuery's built-in val() function: $('#getTimeExample').val();
	* @param {Date} relative_date
	* @returns {number}
	*/
	jQTimepicker(methodName: 'getTime', relative_date?: Date): number;
	/**
	* Get the time using a Javascript Date object, relative to a Date object (default: today).
	* eg.: $('#getTimeExample').timepicker('getTime'[, new Date()]);
	* You can get the time as a string using jQuery's built-in val() function: $('#getTimeExample').val();
	* @param {string} relative_date
	* @returns {number}
	*/
	jQTimepicker(methodName: 'getTime', relative_date?: string): number;
	/**
	* Close the timepicker dropdown.
	* eg.: $('#hideExample').timepicker('hide');
	* @returns {jQTimepicker}
	*/
	jQTimepicker(methodName: 'hide'): jQTimepicker;
	/**
	* Unbind an existing timepicker element.
	* eg.: $('#removeExample').timepicker('remove');
	* @returns {jQTimepicker}
	*/
	jQTimepicker(methodName: 'remove'): jQTimepicker;
	/**
	* Change the settings of an existing timepicker. Calling option on a visible timepicker will cause the picker to be hidden.
	* eg.:	$('#optionExample').timepicker({ 'timeFormat': 'g:ia' });
	*		$('#optionExample').timepicker('option', 'minTime', '2:00am');
	*		$('#optionExample').timepicker('option', { 'minTime': '4:00am', 'timeFormat': 'H:i' });
	* @param {string} key
	* @param {string} value
	* @returns {jQTimepicker}
	*/
	jQTimepicker(methodName: 'option', key?: string, value?: string): jQTimepicker;
	/**
	* Change the settings of an existing timepicker. Calling option on a visible timepicker will cause the picker to be hidden.
	* eg.:	$('#optionExample').timepicker({ 'timeFormat': 'g:ia' });
	*		$('#optionExample').timepicker('option', 'minTime', '2:00am');
	*		$('#optionExample').timepicker('option', { 'minTime': '4:00am', 'timeFormat': 'H:i' });
	* @param {jQTimepickerOptions} key
	* @returns {jQTimepicker}
	*/
	jQTimepicker(methodName: 'option', key?: jQTimepickerOptions): jQTimepicker;
	/**
	* Set the time using a Javascript Date object.
	* eg.: $('#setTimeExample').timepicker('setTime', new Date());
	* @returns {jQTimepicker}
	*/
	jQTimepicker(methodName: 'setTime', value?: Date): jQTimepicker;
	/**
	* Set the time using a passed time object.
	* eg.: $('#setTimeExample').timepicker('setTime', '07:30pm');
	* @param {string} value
	* @returns {jQTimepicker}
	*/
	jQTimepicker(methodName: 'setTime', value?: string): jQTimepicker;
	/**
	* Format and set the time using a passed time object.
	* eg.: $('#setTimeExample').timepicker('setTime', new Date());
	* @param {Date} value
	* @returns {jQTimepicker}
	*/
	jQTimepicker(methodName: 'formatAndSetTime', value?: Date): jQTimepicker;
	/**
	* Format and set the time using a passed time object.
	* eg.: $('#setTimeExample').timepicker('setTime', '07:30pm');
	* @param {string} value
	* @returns {jQTimepicker}
	*/
	jQTimepicker(methodName: 'formatAndSetTime', value?: string): jQTimepicker;
	/**
	* Display the timepicker dropdown.
	* eg.: $('#showExample').timepicker('show');
	* @returns {jQTimepicker}
	*/
	jQTimepicker(methodName: 'show'): jQTimepicker;
}

/**
* Called after a valid time value is entered or selected. See timeFormatError and timeRangeError for error events. Fires before change event.
*/
interface jQTimepickerChangeTimeEvent extends JQueryEventObject {
	/**
	* Selected time.
	*/
	time: string;
}

interface jQTimepickerData {
	bind?: string;
	timepickerList?: JQuery;
	timepickerSettings?: jQTimepickerOptions;
	uiTimepickerValue?: string;
	timepickerOptions?: jQTimepickerOptions;
}