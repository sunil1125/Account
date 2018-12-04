/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created: August 28, 2013 */
/// <reference path="../utils.ts" />
/// <reference path="../Utilities.ts" />
/// <reference path="common.d.ts" />

interface CommonStatic {
	parseDateFormat(format: string): any;
	parseDate(date: string, format?: string): Date;
	formatDate(date: Date, format?: string): string;
	formatDate(date: string, format?: string): string;
	formatDate(date: any, format?: string): string;
	convertToDate(date: string): Date;
	convertToDateString(dateTime: string, format?: string): string;
	deepCopy<T>(source: T): T;

	/**
	* To get the value by id in a enum object(added for using in enums)
	* @param {any} obj enum object for referring.
	* @param {string} id to find in the enum object.
	* @returns {string} value of the given input from the enum object.
	*/
	getEnumValueById(obj: any, value: string): string;
	/**
	* To get the value by key in a enum object(added for using in enums)
	* @param {any} obj enum object for referring.
	* @param {string} key to find in the enum object.
	* @returns {string} value of the given input from the enum object.
	*/
	getEnumValueByKey: (obj: any, value: string) => string;
	/**
	* To get the round off value of given value to a specifically decimal places.
	* @param {number} value to get the round off.
	* @param {number} decimals to set the roundoff.
	* @returns {number} round off value for the given input.
	*/
	roundOff(value: number, decimals?: number): number;

	/**
	* Method to identify is browser is Microsoft Internet Explorer.
	* @returns {boolean} returns true when the user's browser is Microsoft Internet Explorer it return as fasle.
	*/
	isBrowserIsIE(): boolean;

	/**
	* Method to identify is browser is Mozilla Firefox.
	* @returns {boolean} returns true when the user's browser is Mozilla Firefox else it return as fasle.
	*/
	isBrowserIsFirefox(): boolean;

	/**
	* Method to identify is browser is Chrome.
	* @returns {boolean} returns true when the user's browser is Chrome else it return as fasle.
	*/
	isBrowserIsChrome(): boolean;

	/**
	* Method to identify is browser is Apple Safari.
	* @returns {boolean} returns true when the user's browser is Apple Safari else it return as fasle.
	*/
	isBrowserIsSafari(): boolean;

	/**
	* Method to identify is string is null or empty or contains any white spaces
	* @returns {boolean} returns true when the string is not null or empty or not contains any white spaces otherwise return as fasle.
	*/
	isNullOrEmptyOrWhiteSpaces(string): boolean;

	/**
	* Method to get the user agent.
	* @returns {string} returns agent/client of the user.
	*/
	UserAgent(): string;

	/**
	* Method to check whether the given date is valid or not.
	* @param {string} value to check is valid date or not.
	* @param {string} userFormat date format string. Default value will be 'mm/dd/yyyy'
	* @return {boolean} true or false.
	*/
	isValidDate(value: string, userFormat?: string): boolean;
	/**
	* Method to check whether the given date is weekend or not.
	* @param {Date} date to check is weekend or not.
	* @return {boolean} true or false.
	*/
	isWeekend(date: Date): boolean;
	/**
	* Method to check whether the given date is weekend or not.
	* @param {string} date to check is weekend or not.
	* @return {boolean} true or false.
	*/
	isWeekend(date: string): boolean;
	/**
	* Method to check whether the given date is in holiday or not.
	* @param {Date} date to check is holiday or not.
	* @return {boolean} true or false.
	*/
	isHoliday(date: Date): boolean;
	/**
	* Method to check whether the given date is in holiday or not.
	* @param {string} date to check is holiday or not.
	* @return {boolean} true or false.
	*/
	isHoliday(date: string): boolean;
	/**
	* Method to get the next working date/day frome the current date.
	* It will skip the weekend and holiday and returns the next date.
	* Note: If the current date is already a working date/day then it will return back the same date.
	* @return {Date} the next working date.
	*/
	nextWorkingDay(): Date;
	/**
	* Method to get the next working date/day for the given date.
	* It will skip the weekend and holiday and returns the next date.
	* Note: If the given date is already a working date/day then it will return back the same date.
	* @param {Date} value to get the next working date/day. If value is not passed then it will consider the current date as input value.
	* @return {Date} the next working date.
	*/
	nextWorkingDay(value?: Date): Date;
	/**
	* Method to get the next working date/day for the given date.
	* It will skip the weekend and holiday and returns the next date.
	* Note: If the given date is already a working date/day then it will return back the same date.
	* @param {string} value to get the next working date/day. If value is not passed then it will consider the current date as input value.
	* @return {Date} the next working date.
	*/
	nextWorkingDay(value?: string): Date;

	/**
	* Method to reformat the phone Number.
	* e.g input = '999-999-9999' result is '(999)999-9999'
	* @param {string} input is the string with phone digits.
	* @returns {string} the input string by reformatting to US Phone Format.
	*/
	USAPhoneFormat(input: string): string;
}

interface UtilsStatic {
	Common: new () => CommonStatic;
	/**
	* Method to apply the access type permission to the controls.
	* @param {any} element is the DOM object to set the access permission.
	* @param {string} accessType value of access type is hide/disable.
	*/
	applyAccessType? (element: any, accessType: any);
	/**
	*Method to get the dirty items of view model[knockout].
	* This method will gives the collection of knockout observable items which has been modified in a view model.
	* @param {string[]} myModel is the view model to get the dirty items.
	*/
	getDirtyItems? (myModel: Object): string[];
	/**
	* Method to get the modified items of view model[knockout].
	* This method will gives the collection of knockout observable items which has been modified in a view model.
	* @param {Object} viewmodel is the view model to get the changed items.
	* @returns {string[]} the changed items of view model[knockout].
	*/
	getChangesFromModel(viewmodel: Object): string[];
	/**
	* Object to hold the application constants.
	*/
	Constants: ConstantsStatic;
	/**
	* Method to remove number with brackets.
	* e.g input = 'TEXT (0001)' result is 'TEXT'
	* @param {string} input is the string to remove the number with brackets.
	* @returns {string} the input string with removal of number with brackets.
	*/
	removeNumberWithbrackets(input: string): string;
	/**
	* Method to handle and set client pagination data for KO grid.
	* @param {KnockoutObservableArray<any>} data to bind in KO grid.
	* @param {any} gridOption [ReportAction] report action object.
	* @param {any} grid [ReportGridOption] report grid option.
	* @param {KnockoutObservableArray<any>} currentData griddata object in viewmodel.
	* @returns empty.
	*/
	kgSetClientsidePagination(data: KnockoutObservableArray<any>, gridOption: any, grid: any, currentData: KnockoutObservableArray<any>);
	/**
	* Method to a object tag to the given target control.
	* @param {string} targetID to add a object tag.
	* @param {string} sourceURL url of the document has to show in the object tag.
	* @param {string} mimeType MIME type of the document
	* @param {string} alternativeURL url to download the document if it is not loaded.
	* @returns empty.
	*/
	addObjectTagToControl(targetID: string, sourceURL?: string, mimeType?: string, alternativeURL?: string);
}

/**
* Object to hold the application constants.
*/
interface ConstantsStatic {
	/**
	* Variable to get the xmpp domain name.
	*/
	XMPPDomain?: string;

	/**
	* Variable to get the xmpp server name.
	*/
	XMPPServerName?: string;
	/**
	* Variable to get the atlas base URL.
	*/
	AtlasBaseURL?: string;
	/**
	* Variable to get the holiday list.
	*/
	HolidayList?: Array<string>;
	/**
	* Variable to get the application base URL.
	*/
	ApplicationBaseURL?: string;
	/**
	* Variable to get the default company logo file name.
	*/
	DefaultCompanyLogoName?: string;
	/**
	* Variable to get the Carrier Logo Path.
	*/
	CarrierLogoBaseURL?: string;
	/**
	* Variable to get the nokia app id.
	*/
	NokiaAppID?: string;
	/**
	* Variable to get the nokia app code.
	*/
	NokiaAppCode?: string;
	/**
	* Variable to get number count of the Tabs to show.
	*/
	DefaultTabCounts?: number;
	/**
	* Variable to get latest uploaded image icon.
	*/
	LatestImageIcon?: string;
	/**
	* Variable to get the application Help URL.
	*/
	ApplicationHelpURL?: string;
	/**
	* Variable to get the all alphabet in lower case.
	*/
	LowerAlphabet: string[];
	/**
	* Variable to get the all alphabet in upper case.
	*/
	UpperAlphabet: string[];
	/**
	* Variable to get the CompanyLogoBasePath.
	*/
	CompanyLogoBasePath?: string;
	/**
	* Variable to check if financial status check is required.
	*/
	IsFinancialStatusCheckRequired?: string;
	/**
	* Variable to get the GUID for chat.
	*/
	GUID?: string;
	/**
	* Show server callback errors in toastr.
	*/
	ShowErrorsInToastr?: string;

	/**
	* It is used to toggle the visibility of global search box.
	*/
	IsGlobalSearchRequired?: string;

	/**
	* Dispute with carrier url
	*/
	DisputeCarrierContactToolUrl?: string;

	///###START: DE22081
	/**
	* Delay time for downlaod
	*/
	DelayForFileDownload?: string;
	///###END: DE22081

	// ###START: US23314
	/**
	* It is used to Allow/Not to allow Intra Canada Shipment Booking
	*/
	IsCanadaToCanadaShipEnabled?: string;

	// ###END: US23314

	// ###START: DE24638
	/**
	* It is used to Allow/Not to allow send Email Dispute Popup
	*/
	IsDisputeEmailPopupEnabled?: string;
	// ###END: DE24638

	// ###START: US26886
	/**
	* It is used to get Shiping Service ANSI Code
	*/
	ShipingServiceANSICode?: string;
	// ###END: US26886

	IsMakeCopyVisible?: string;
}