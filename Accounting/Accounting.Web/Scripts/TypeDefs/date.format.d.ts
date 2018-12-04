// Type definitions for Date Format 1.2.3
// Project: http://blog.stevenlevithan.com/archives/date-time-format
// Definitions by: Rob Stutton <https://github.com/balrob>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/*****************************************************************************
 Portions Copyright (c) Microsoft Corporation. All rights reserved.
 Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 this file except in compliance with the License. You may obtain a copy of the
 License at http://www.apache.org/licenses/LICENSE-2.0

 THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
 WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
 MERCHANTABLITY OR NON-INFRINGEMENT.

 See the Apache Version 2.0 License for specific language governing permissions
 and limitations under the License.
 ***************************************************************************** */

/** Enables basic storage and retrieval of dates and times. */
interface Date {
	/**
	 * This is a convenience addition to the Date prototype
	 * @param {string} mask The mask defaults to dateFormat.masks.default.
	 * @param {boolean} utc
	 * @returns {string} returns a formatted version of the date.
	 */
	format(mask?: string, utc?: boolean): string;
	/**
	 * To round time to the next nearest {roundupminutes} minutes which is passed[using JavaScript Date Object]
	 * eg.: Time now 11:34 - clock is 12:00 Time now 11:16 - clock is 11:30
	 * @param {number} roundupminutes The round up minutes defaults to 30.
	 * @returns {Date} returns a date with nearest time for {roundupminutes}.
	 */
	roundupTime(roundupminutes?: number): Date;
}

declare var Date: {
	new (): Date;
	new (value: number): Date;
	new (value: string): Date;
	new (year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): Date;
	(): string;
	prototype: Date;
	/**
	 * Parses a string containing a date, and returns the number of milliseconds between that date and midnight, January 1, 1970.
	 * @param s A date string
	 */
	parse(s: string): number;
	/**
	 * Returns the number of milliseconds between midnight, January 1, 1970 Universal Coordinated Time (UTC) (or GMT) and the specified date.
	 * @param year The full year designation is required for cross-century date accuracy. If year is between 0 and 99 is used, then year is assumed to be 1900 + year.
	 * @param month The month as an number between 0 and 11 (January to December).
	 * @param date The date as an number between 1 and 31.
	 * @param hours Must be supplied if minutes is supplied. An number from 0 to 23 (midnight to 11pm) that specifies the hour.
	 * @param minutes Must be supplied if seconds is supplied. An number from 0 to 59 that specifies the minutes.
	 * @param seconds Must be supplied if milliseconds is supplied. An number from 0 to 59 that specifies the seconds.
	 * @param ms An number from 0 to 999 that specifies the milliseconds.
	 */
	UTC(year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number): number;
	now(): number;
};

// Some common format strings
interface DateFormatMasks {
	"default": string;
	shortDate: string;
	mediumDate: string;
	longDate: string;
	fullDate: string;
	shortTime: string;
	mediumTime: string;
	longTime: string;
	isoDate: string;
	isoTime: string;
	isoDateTime: string;
	isoUtcDateTime: string;
}

// Internationalization strings
interface DateFormatI18n {
	dayNames: string[];
	monthNames: string[];
}

/**
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 * @param {Date=} date
 * @param {string=} mask
 * @param {boolean=} utc
 */
declare var dateFormat: {
	(date?: any, mask?: string, utc?: boolean): string;
	masks: DateFormatMasks;
	i18n: DateFormatI18n;
};