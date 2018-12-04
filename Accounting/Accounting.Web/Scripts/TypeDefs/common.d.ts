/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created: October 28, 2013 */
/// <reference path="jquery.d.ts" />
/// <reference path="durandal.d.ts" />
/// <reference path="knockout.d.ts" />
/// <reference path="moment.d.ts" />
/// <reference path="spin.d.ts" />
/// <reference path="date.format.d.ts" />

interface Array<T> {
	/**
	* Method to remove a specific element from an array.
	* @param {T} item The item to be remove.
	*/
	remove(item: T): void;
	remove(predicate: (item: T) => boolean): void;
	/**
	* Method to remove a specific elements from an array.
	* @param {T[]} items The items to be remove.
	*/
	removeAll(items: T[]): void;
	/**
	* Method to remove all elements from an array.
	*/
	removeAll(): void;
	/**
	* Method to sum a particular element in array.
	* @param {(item: T)} predicate a callback function which needs to return the column/value to be calculated.
	* @returns {number} The calculated sum value.
	*/
	sum(predicate: (item: T) => number): number;
	/**
	* Finds the index of an object in the passed in array using the function to compare
	* @param {(item: T)} predicate a callback function to use to compare the object to another value to find the index if it exists
	* @returns Index of the item if exists, otherwise -1
	*/
	arrayIndexOf(predicate: (item: T) => boolean): number;
	/**
	* Finds the index of an object in the passed in array using the function to compare
	* @param searchForValue: Value used to search for in the array
	* @param {(item: T, valueToCompare: any)} predicate a callback function to use to compare the object to the search for value to find the index if it exists
	* @returns Index of the item if exists, otherwise -1
	*/
	arrayIndexOfValue(searchForValue: any, predicate: (item: T, valueToCompare: any) => boolean): number;
}

interface KnockoutBindingHandlers {
	showModal: KnockoutBindingHandler;
	showProgress: KnockoutBindingHandler;
	datepicker: KnockoutBindingHandler;
	showContentProgress: KnockoutBindingHandler;
	accessRule: KnockoutBindingHandler;
	dataTable: KnockoutBindingHandler;
	map: KnockoutBindingHandler;
	daterangepicker: KnockoutBindingHandler;
	disableAllElements: KnockoutBindingHandler;
	slideDialog: KnockoutBindingHandler;
	createFusionChart: KnockoutBindingHandler;
	drag: KnockoutBindingHandler;
	drop: KnockoutBindingHandler;
	radioCheck: KnockoutBindingHandler;
	numericDecimalInput: KnockoutBindingHandler;
	donotBindThis: KnockoutBindingHandler;
	showContentProgress_old: KnockoutBindingHandler;
	jQTimepicker: KnockoutBindingHandler;
	readonlyAllElements: KnockoutBindingHandler;
	numeric: KnockoutBindingHandler;
	percentageInput: KnockoutBindingHandler;
	timer: KnockoutBindingHandler;
}

interface KnockoutObservableArrayFunctions<T> {
	refresh(): void;
}

interface JQueryDatePickerEventObject extends BaseJQueryEventObject {
	date: Date;
	dateString: string;
	viewMode: string;
}

interface IContentProgressOption {
	bgColor?: string;
	fadeInDuration?: number;
	opacity?: number;
	classOveride?: boolean;
	zindex?: number;
	childId?: string;
	showProgressBar?: boolean;
	overlayClass?: string;
	showTextInLoader?: boolean;
	loaderText?: string;
	spinneroptions?: SpinnerOptions;
	alternatespinClass?: string;
	showErrorImage?: boolean;
	height?: string;
}

interface IButtonSlidingOption {
	showSlide?: boolean;
	slideInDuration?: number;
}

interface IAccessRuleOptions {
	ResourceName: string;
	RequiredPermission: number;
	AccessType: string;
}

interface ILogicalResourceAccessRule {
	ResourceName: string;
	RequiredPermission: number;
}

interface Window {
	ga(send: string, event: string): any;
	ga(send: string, event: string, pageName: string): any;
	ga(send: string, event: string, category: string, action: string, label: string): any;

	kg: any;
}

interface KnockoutExtenders {
	/**
	* Method for tracking/detecting change to Knockout object.
	* @param {any} target as knockout object.
	* @param {boolean} track tracking values setup in ko object.
	*/
	trackChange(target: any, track: boolean): any;
}

interface Node {
	scrollIntoViewIfNeeded: (centerIfNeeded?: boolean) => void;
}

interface JQueryDateRangePickerEventObject extends BaseJQueryEventObject {
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

interface IChartOptions {
	/**
	 * Chart Type
	 */
	chartType: string;
	/**
	* Chart Name or Chart Id
	*/
	chartName: string;
	/**
	* Chart height
	*/
	chartHeight: string;
	/**
	* Chart Width
	*/
	chartWidth: string;
	/**
	* Whether we are passing the xml data or not
	*/
	isXML: boolean;
	/**
	* Chart XML
	*/
	chartData: string;

	/*
	* background transperency
	*/
	setTransparency?: boolean;
}

/**
* Interface for Numeric input field.
*/
interface INumericInput {
	/**
	* Defines the maximum length of the input control.
	*/
	maxlength?: number;
	/**
	* Defines the decimal point of the input control.
	* default will be 2 decimal pointss.
	*/
	decimalpoint?: number;
	/**
	* Defines that the input control has permission for showing decimal point.
	* default will be false.
	*/
	allowdecimal?: KnockoutObservable<boolean>;

	/**
	* Defines that the input control has permission for adding decimal point automatically after No.Of places.
	* default will be 0.
	*/
	autodigit?: KnockoutObservable<boolean>;
}

/*
* Interface to define custom prototypes for the String object
*/
interface String {
	/**
	* Adds a function to the String object to capitalize the string
	* @param {boolean} all: used to capitalize the first character of the string. If all is true it wil convert all the space seprated string to capitalize else it will do capitalize the first character of the string. Default {false}.
	* @return {string} capitalize value.
	*/
	capitalize(all?: boolean): string;
}

/*
* Interface to define custom prototype method for the Object
*/
interface Object {
	/**
	* Adds a function to Object.prototype to compare the objects
	* @param {Object} b: used to to compare the object with the current object
	* @return {boolean} whether the object is same or not.
	*/
	equals(b: Object): boolean;
}

/*
	The jQuery instance members
*/
interface JQuery {
	/**
	* Gets the serialized HTML fragment/content describing the element including its descendants.
	* @returns content contains the serialized HTML fragment describing the element and its descendants.
	*/
	outerHtml(): string;
}

/** The template settings for category typeahead */
interface TemplateCategorizeTypeahead {
	/** Name of the category/group */
	name: string;
	/** Template for category header in control. e.g: <span>Header</span> */
	header?: string;
	/** Category count to display. Default is 2 */
	slicecount: number;
	/** Template for category more result section. e.g: <a href="#">All Header Results<span class="greatericon">&nbsp;>></span></a> */
	moreresult?: string;
}

/** The options for categorize typeahead */
interface CategorizeTypeaheadOptions extends TypeaheadOptions {
	/** Name of the property/key in source object to display */
	displaykey?: string;
	/** Flag to tell the binding result is categorized or not */
	isCategorizedResult?: boolean;
	/** Name of the property/key in source object to group the category */
	groupbyKey?: string;
	/** Name of the property/key(s) in typeahead source object which are use for data filters */
	datakeys?: string;
	/**
	* To set the icon name for the group of items in the typeahead drop down.
	* syntax: {
	* Field1: 'CSS Icon name',    -- Field1 --> boolean variable of type ahead source object
	* Field2: 'CSS Icon name',    -- Field2 --> boolean variable of type ahead source object
	* FieldN: 'CSS Icon name',    -- FieldN --> boolean variable of type ahead source object
	* defaulticon: 'CSS Icon name'    -- Default Icon will shown other than FIeld1, Field2 and FieldN. Optional, if you not setup this then it will not have any icon for that row in the dropdown.
	* }
	* e.g: { IsCompanyLocation: 'icon-user', defaulticon: 'icon-map-marker' }
	*/
	iconsettings?: Object;
	/**
	* Template settings for each category
	* e.g:  [{name: 'Header1', header: '<span>Header 1</span>', slicecount: 2, moreresult: '<a href="#">All Header 1 Results<span class="greatericon">&nbsp;>></span></a>'},
			 {name: 'Header2', header: '', slicecount: 3, moreresult: '' },
			 {name: 'Header3', header: '', slicecount: 2, moreresult: '' },
			 {name: 'Header4', header: '<span>Header 4</span>', slicecount: 3, moreresult: '<a href="#">All Header 4 Results<span class="greatericon">&nbsp;>></span></a>' }]
	*/
	templates?: TemplateCategorizeTypeahead[];
	/** Name of the property/key in source object to display the secondary search column */
	filteredDisplayKey?: string;
}

interface JSON {
	/**
	* Adds a function to the JSON object to try Parse JSON string
	* @param {string} jsonString: json string to parse.
	* @return either JSON object or false.
	*/
	tryParse(jsonString: string): any;
}

interface DurandalEventSupport<T> {
	/**
	* Triggers the specified events.
	* @param {string} NavigateTo event name to trigger for navigation.
	* @param {string} routeName new route/route name to navigate.
	*/
	trigger(events: 'NavigateTo', routeName: string): T;

	/**
	* Triggers the specified events.
	* @param {string} NavigateByRouteConfig event name to trigger for navigation.
	* @param {DurandalRouteConfiguration} routeInConfig new route config to navigate.
	* @param {string} navigateToRoute route name to navigate with/out query value.
	*/
	trigger(events: 'NavigateByRouteConfig', routeInConfig: DurandalRouteConfiguration, navigateToRoute?: string): T;
}


//// ###START: US24866

interface TinyMceObservable {
	off: (name?: string, callback?: Function) => Object
   on: (name: string, callback: Function) => Object
   fire: (name: string, args?: Object, bubble?: Boolean) => Event
}

interface TinyMceEditor extends TinyMceObservable {
	destroy: (automatic: boolean) => void
   remove: () => void
   hide: () => void
   show: () => void
   getContent: (args?: Object) => string
   setContent: (content: string, args?: Object) => string
   focus: (skip_focus?: Boolean) => void
   undoManager: TinyMceUndoManager
   settings: Object
   execCommand: (a: any, b: any, c: any) => boolean;
	editors?: any;
	setProgressState: (a: any) => boolean;
}

interface TinyMceUndoManager {
	undo: () => Object
   clear: () => void
   hasUndo: () => Boolean
}

interface TinyMceEvent {

}

interface TinyMceStatic extends TinyMceObservable {
	init: (settings: Object) => void;
	execCommand: (c: string, u: Boolean, v: string) => Boolean;
	activeEditor: TinyMceEditor;
	get: (id: String) => TinyMceEditor;
	editors?: any;
}
declare var tinymce: TinyMceStatic;

//// ###END: US24866