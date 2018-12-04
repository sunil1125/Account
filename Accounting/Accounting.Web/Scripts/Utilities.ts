/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="TypeDefs/bootstrap.datepicker.d.ts" />
/// <reference path="TypeDefs/common.d.ts" />
/// <reference path="TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="TypeDefs/Simplex.d.ts" />
/// <reference path="TypeDefs/Bootstrap.d.ts" />
/// <reference path="TypeDefs/knockout.validation.d.ts" />
/// <reference path="TypeDefs/knockout.d.ts" />
/// <reference path="TypeDefs/jqueryui.d.ts" />
/// <reference path="TypeDefs/jquery.d.ts" />

/**
* Document Ready for entire site
*/
$().ready(() => {
	// Initialize validation
	ko.validation.init({
		insertMessages: false,
		decorateElement: true,
		errorElementClass: "error",
		messagesOnModified: true,
		grouping: { deep: true }
	});

	var customKnockoutBindingManager = new CustomKnockoutBindingHandlerManager();
	customKnockoutBindingManager.initialize();
});

/**
* Utility functions
*/
module Utility {
	/**
	* Creates the ajax connection for calling the web service
	* @return {Simplex.AjaxConnection} New ajax connection
	*/
	export function getAjaxConnection(): Simplex.AjaxConnection {
		return new Simplex.AjaxConnection("/atlas/");
	}

	/**
	* Tries to get the query string value from the parameter name
	* @param Query String key name (case doesn't matter)
	* @return {string} Query string value
	*/
	export function getQueryStringValue(sParam: string): string {
		var pageURL = window.location.search.substring(1);
		var urlVariables = pageURL.split('&');

		for (var i = 0; i < urlVariables.length; i++) {
			var parameterName = urlVariables[i].split('=');
			if (parameterName[0].toLowerCase() == sParam.toLowerCase()) {
				return parameterName[1];
			}
		}
	}

	/**
	* Decodes a url string
	*/
	export function DecodeUri(url: string): string {
		if (url == null) {
			return "";
		}

		// correctly decodes the url
		return decodeURIComponent((url + '').replace(/\+/g, '%20'));
	}

	/**
	* Interface for a message subscription signature
	*/
	export interface MessageSubscription {
		(sender: any, args: any);
	}

	/**
	* Class that holds callbacks and executes them
	*/
	export class Message {
		private subscriptions: Array<MessageSubscription>;

		constructor() {
			this.subscriptions = new Array<MessageSubscription>();
		}

		/**
		* Adds a callback to the subscription list
		* @param callback function
		*/
		public add(callback: MessageSubscription) {
			this.subscriptions.push(callback);
		}

		/**
		* Invokes all the callbacks that are registered
		* @param The invoker
		* @param Arguments
		*/
		public invoke(sender: any, args: any) {
			for (var i = 0; i < this.subscriptions.length; i++) {
				//var callback = <MessageSubscription>this.subscriptions[i];
				//callback(sender, args);

				(<MessageSubscription>this.subscriptions[i])(sender, args);
			};
		}
	}
}

/**
* Utility classes for an array
Need to extend properly  with prototype methods
*/
module Utility.ArrayUtil {
	/**
	* Finds the index of an object in the passed in array using the function to compare
	*
	* @param array: Array to search
	* @param searchFunction: Function to use to compare the object to another value to find the index if it exists
	* @returns Index of the item if exists, otherwise -1
	*/
	export function arrayIndexOf(array: any[], searchFunction: (object: any) => boolean): number {
		if (!searchFunction || typeof (searchFunction) != 'function') return -1;

		if (!array || !array.length || array.length < 1) return -1;

		for (var i = 0; i < array.length; i++) {
			if (searchFunction(array[i])) return i;
		}

		return -1;
	};

	/**
	* Finds the index of an object in the passed in array using the function to compare
	*
	* @param array: Array to search
	* @param searchForValue: Value used to search for in the array
	* @param searchFunction: Function to use to compare the object to the search for value to find the index if it exists
	* @returns Index of the item if exists, otherwise -1
	*/
	export function arrayIndexOfValue(array: any[], searchForValue: any, searchFunction: (object: any, valueToCompare: any) => boolean): number {
		if (!searchFunction || typeof (searchFunction) != 'function') return -1;

		if (!array || !array.length || array.length < 1) return -1;

		for (var i = 0; i < array.length; i++) {
			if (searchFunction(array[i], searchForValue)) return i;
		}

		return -1;
	};
}

/**
* Utility functions for static data
*/
module Utility.Static {
	var unitedStates: Utility.Classes.StateItem[] = null;
	var canadianProvinces: Utility.Classes.StateItem[] = null;

	/**
	* Gets the list of the united states
	*/
	export function getUnitedStates(): Utility.Classes.StateItem[] {
		if (unitedStates == null) {
			buildUnitedStatesList();
		}

		// Return a new array of the US states (.slice(0) returns a duplicate array)
		return unitedStates.slice(0);
	}

	/**
	* Gets a list of the Canadian provinces
	*/
	export function getCanadianProvinces(): Utility.Classes.StateItem[] {
		if (canadianProvinces == null) {
			buildCanadianProvienceList();
		}

		// Return a new array of the Canadian provinces (.slice(0) returns a duplicate array)
		return canadianProvinces.slice(0);
	}

	/**
	* Gets a list of supported countries
	* @return {Utility.Classes.CountryItem[]} Countries
	*/
	export function getCountries(): Utility.Classes.CountryItem[] {
		var countries: Utility.Classes.CountryItem[] = new Array<Utility.Classes.CountryItem>();
		countries.push(new Utility.Classes.CountryItem("United States", "US"));
		countries.push(new Utility.Classes.CountryItem("Canada", "CA"));

		return countries;
	}

	/**
	* Builds the united states object array
	*/
	function buildUnitedStatesList() {
		unitedStates = new Array<Utility.Classes.StateItem>();
		unitedStates.push(new Utility.Classes.StateItem("Alabama", "AL"));
		unitedStates.push(new Utility.Classes.StateItem("Alaska", "AK"));
		unitedStates.push(new Utility.Classes.StateItem("Arizona", "AZ"));
		unitedStates.push(new Utility.Classes.StateItem("Arkansas", "AR"));
		unitedStates.push(new Utility.Classes.StateItem("California", "CA"));
		unitedStates.push(new Utility.Classes.StateItem("Colorado", "CO"));
		unitedStates.push(new Utility.Classes.StateItem("Connecticut", "CT"));
		unitedStates.push(new Utility.Classes.StateItem("Delaware", "DE"));
		unitedStates.push(new Utility.Classes.StateItem("Florida", "FL"));
		unitedStates.push(new Utility.Classes.StateItem("Georgia", "GA"));

		unitedStates.push(new Utility.Classes.StateItem("Hawaii", "HI"));
		unitedStates.push(new Utility.Classes.StateItem("Idaho", "ID"));
		unitedStates.push(new Utility.Classes.StateItem("Illinois", "IL"));
		unitedStates.push(new Utility.Classes.StateItem("Indiana", "IN"));
		unitedStates.push(new Utility.Classes.StateItem("Iowa", "IA"));
		unitedStates.push(new Utility.Classes.StateItem("Kansas", "KS"));
		unitedStates.push(new Utility.Classes.StateItem("Kentucky", "KY"));
		unitedStates.push(new Utility.Classes.StateItem("Louisiana", "LA"));
		unitedStates.push(new Utility.Classes.StateItem("Maine", "ME"));
		unitedStates.push(new Utility.Classes.StateItem("Maryland", "MD"));

		unitedStates.push(new Utility.Classes.StateItem("Massachusetts", "MA"));
		unitedStates.push(new Utility.Classes.StateItem("Michigan", "MI"));
		unitedStates.push(new Utility.Classes.StateItem("Minnesota", "MN"));
		unitedStates.push(new Utility.Classes.StateItem("Mississippi", "MS"));
		unitedStates.push(new Utility.Classes.StateItem("Missouri", "MO"));
		unitedStates.push(new Utility.Classes.StateItem("Montana", "MT"));
		unitedStates.push(new Utility.Classes.StateItem("Nebraska", "NE"));
		unitedStates.push(new Utility.Classes.StateItem("Nevada", "NV"));
		unitedStates.push(new Utility.Classes.StateItem("New Hampshire", "NH"));
		unitedStates.push(new Utility.Classes.StateItem("New Jersey", "NJ"));

		unitedStates.push(new Utility.Classes.StateItem("New Mexico", "NM"));
		unitedStates.push(new Utility.Classes.StateItem("New York", "NY"));
		unitedStates.push(new Utility.Classes.StateItem("North Carolina", "NC"));
		unitedStates.push(new Utility.Classes.StateItem("North Dakota", "ND"));
		unitedStates.push(new Utility.Classes.StateItem("Ohio", "OH"));
		unitedStates.push(new Utility.Classes.StateItem("Oklahoma", "OK"));
		unitedStates.push(new Utility.Classes.StateItem("Oregon", "OR"));
		unitedStates.push(new Utility.Classes.StateItem("Pennsylvania", "PA"));
		unitedStates.push(new Utility.Classes.StateItem("Rhode Island", "RI"));
		unitedStates.push(new Utility.Classes.StateItem("South Carolina", "SC"));

		unitedStates.push(new Utility.Classes.StateItem("South Dakota", "SD"));
		unitedStates.push(new Utility.Classes.StateItem("Tennessee", "TN"));
		unitedStates.push(new Utility.Classes.StateItem("Texas", "TX"));
		unitedStates.push(new Utility.Classes.StateItem("Utah", "UT"));
		unitedStates.push(new Utility.Classes.StateItem("Vermont", "VT"));
		unitedStates.push(new Utility.Classes.StateItem("Virginia", "VA"));
		unitedStates.push(new Utility.Classes.StateItem("Washington", "WA"));
		unitedStates.push(new Utility.Classes.StateItem("West Virginia", "WV"));
		unitedStates.push(new Utility.Classes.StateItem("Wisconsin", "WI"));
		unitedStates.push(new Utility.Classes.StateItem("Wyoming", "WY"));
	}

	/**
	* Builds the Canadian provience object array
	*/
	function buildCanadianProvienceList() {
		canadianProvinces = new Array<Utility.Classes.StateItem>();

		canadianProvinces.push(new Utility.Classes.StateItem("Alberta", "AB", "CA"));
		canadianProvinces.push(new Utility.Classes.StateItem("British Columbia", "BC", "CA"));
		canadianProvinces.push(new Utility.Classes.StateItem("Monitoba", "MB", "CA"));
		canadianProvinces.push(new Utility.Classes.StateItem("New Brunswick", "NB", "CA"));
		canadianProvinces.push(new Utility.Classes.StateItem("Newfoundland and Labrador", "NL", "CA"));
		canadianProvinces.push(new Utility.Classes.StateItem("Nova Scotia", "NS", "CA"));
		canadianProvinces.push(new Utility.Classes.StateItem("Northwest Territories", "NT", "CA"));
		canadianProvinces.push(new Utility.Classes.StateItem("Nunavut", "NU", "CA"));
		canadianProvinces.push(new Utility.Classes.StateItem("Ontario", "ON", "CA"));
		canadianProvinces.push(new Utility.Classes.StateItem("Prince Edward Island", "PE", "CA"));
		canadianProvinces.push(new Utility.Classes.StateItem("Quebec", "QC", "CA"));
		canadianProvinces.push(new Utility.Classes.StateItem("Saskatchewan", "SK", "CA"));
		canadianProvinces.push(new Utility.Classes.StateItem("Yukon", "YT", "CA"));
	}
}

/**
* Utility functions for common classes
*/
module Utility.Classes {
	/**
	* Class that represents a container type
	*/
	export class ContainerType {
		Id: number;
		ContainerTypeName: string;
	}

	/**
	* Class that represents a measurement unit type
	*/
	export class MeasurementUnit {
		Id: number;
		UnitName: string;
	}

	/**
	* Class that represents a country
	*/
	export class CountryItem {
		CountryName: string;
		CountryCode: string;

		constructor(countryName: string, countryCode: string) {
			this.CountryName = countryName;
			this.CountryCode = countryCode;
		}
	}

	/**
	* Class that represents a state
	*/
	export class StateItem {
		stateName: string;
		stateAbbreviation: string;
		countryAbbreviation: string;

		stateCountryName: string;
		countryStateName: string;

		usFirstSortOrder: string;

		constructor(stateName: string, stateAbbr: string, countryAbbreviation?: string) {
			this.stateName = stateName;
			this.stateAbbreviation = stateAbbr;
			this.countryAbbreviation = countryAbbreviation != null ? countryAbbreviation : "US";

			// Calculated fields
			this.stateCountryName = this.stateName + ' (' + this.countryAbbreviation + ')';
			this.countryStateName = '(' + this.countryAbbreviation + ') ' + this.stateName;

			// Custom ordering to make US show first, everything else later
			var orderIndex = this.countryAbbreviation == "US" ? 0 : 1;
			this.usFirstSortOrder = orderIndex + stateName;
		}
	}

	/*
	* Model that represents a dispatch tms system
	*/
	export class DispatchSystemType {
		DisplayName: string;
		IsOther: boolean;

		constructor(displayName: string, isOther: boolean) {
			this.DisplayName = displayName;
			this.IsOther = isOther;
		}
	}
}

/**
* Module that holds the pagination logic
*/
module PaginationUtility {
	/**
	* View model for pagination.
	* This will calculate the needed pagination items given the page size, max page render items, and total data items
	*/
	export class PaginationViewModel {
		pageSize: number;

		currentPageIndex: KnockoutObservable<number>;
		totalItemCount: KnockoutObservable<number>;
		totalPages: KnockoutObservable<number>;
		pageRenderItems: KnockoutObservableArray<any>;

		isNextEnabled: KnockoutComputed<any>;
		isPreviousEnabled: KnockoutComputed<any>;
		pageIndexChangedMessage: Utility.Message;

		private maxPaginationRenderItems: number;
		private newPageIndex: number;

		/*
		* Constructor for the view model
		* @param pageSize: The page size of data to be shown
		* @param maxPaginationRenderItems: The number of page items to render (must be odd)
		*/
		constructor(pageSize: number, maxPaginationRenderItems: number) {
			if (pageSize < 1) throw new Error("pageSize must be positive");
			if ((maxPaginationRenderItems % 2) != 1) throw new Error("maxPageRenderItems must be odd");

			this.pageSize = pageSize;
			this.maxPaginationRenderItems = maxPaginationRenderItems;

			// setup the messager
			this.pageIndexChangedMessage = new Utility.Message();

			this.newPageIndex = 1;

			this.currentPageIndex = ko.observable(1);
			this.pageRenderItems = ko.observableArray([]);
			this.totalItemCount = ko.observable(0);
			this.totalPages = ko.observable(0);

			this.isPreviousEnabled = ko.computed(() => { return this.currentPageIndex() != 1 });
			this.isNextEnabled = ko.computed(() => { return this.currentPageIndex() != this.totalPages() });
		}

		/*
		* Command to select a new page
		* @param Pagination item that was clicked
		*/
		selectPageCommand(pagerItem: PaginationRenderItem) {
			this.newPageIndex = pagerItem.pageDisplayIndex();

			var paginationChange = new PaginationChangeArgs(this.pageSize, this.newPageIndex);
			this.pageIndexChangedMessage.invoke(this, paginationChange);
		}

		/*
		* Command for going to the next page
		*/
		nextPageCommand() {
			if (this.isNextEnabled()) {
				this.newPageIndex = this.currentPageIndex() + 1;

				var paginationChange = new PaginationChangeArgs(this.pageSize, this.newPageIndex);
				this.pageIndexChangedMessage.invoke(this, paginationChange);
			}
		}

		/*
		* Command for going to the previous page
		*/
		previousPageCommand() {
			if (this.isPreviousEnabled()) {
				this.newPageIndex = this.currentPageIndex() - 1;

				var paginationChange = new PaginationChangeArgs(this.pageSize, this.newPageIndex);
				this.pageIndexChangedMessage.invoke(this, paginationChange);
			}
		}

		/*
		* Updates the pagination with new data
		* @param totalItems: Total data items without pagination
		*/
		updatePagination(totalItems: number) {
			this.totalItemCount(totalItems);

			// Calculate the total pages
			var pages = this.calculateTotalPages(this.totalItemCount(), this.pageSize);
			this.totalPages(pages);

			if (this.totalPages() <= this.maxPaginationRenderItems) {
				// The total pages is less then or equal ot the max page render items, create 1 to the total pages
				this.createPagerItems(1, this.totalPages());
			}
			else {
				// Otherwise we need to calculate the offset of each side of the max page render items to see if there
				// is enough room for the new page index to be placed in the middle of the page items
				var pageOffset = Math.floor(this.maxPaginationRenderItems / 2);

				if ((this.newPageIndex - pageOffset) >= 1 && (this.newPageIndex + pageOffset) <= this.totalPages()) {
					// There is enough room on both side of the new page index
					this.createPagerItems((this.newPageIndex - pageOffset), (this.newPageIndex + pageOffset));
				}
				else if ((this.newPageIndex - pageOffset) < 1) {
					// There is not enough room on the left side of the new page index, find the next valid page middle index
					var temp = (pageOffset - this.newPageIndex) + 1;
					var validPageMiddleIndex = this.newPageIndex + temp;
					this.createPagerItems(validPageMiddleIndex - pageOffset, validPageMiddleIndex + pageOffset);
				}
				else if ((this.newPageIndex + pageOffset) > this.totalPages()) {
					// There is not enough room on the right side of the new page index, find the next valid page middle index
					var temp = (this.newPageIndex + pageOffset) - this.totalPages();

					var validPageMiddleIndex = this.newPageIndex - temp;
					this.createPagerItems(validPageMiddleIndex - pageOffset, validPageMiddleIndex + pageOffset);
				}
			}

			this.currentPageIndex(this.newPageIndex);
		}

		/*
		* Creates the pages items to display from the start page index to the stop page index
		* @param startPageIndex: Initial page display index
		* @param stopPageIndex: Last page display index
		*/
		private createPagerItems(startPageIndex: number, stopPageIndex: number) {
			// Get the total items we need in the array
			var totalItemsNeededToCreate = (stopPageIndex - startPageIndex) + 1;

			// Check to make sure the array has the correct number of items
			while (this.pageRenderItems().length != totalItemsNeededToCreate) {
				if (this.pageRenderItems().length < totalItemsNeededToCreate) {
					this.pageRenderItems.push(new PaginationRenderItem());
				}
				else if (this.pageRenderItems().length > totalItemsNeededToCreate) {
					this.pageRenderItems.pop();
				}
			}

			// Update the display index of the pager items
			for (var index = 0; index < this.pageRenderItems().length; index++) {
				if (startPageIndex > stopPageIndex) {
					break;
				}

				var pageRenderItem = <PaginationRenderItem>this.pageRenderItems()[index];
				pageRenderItem.updatePageIndex(startPageIndex);

				// Increase the start page index by one
				startPageIndex++;
			}
		}

		/*
		* Calculates the total pages
		* @param totalItems: Total number of data items from all pages
		*/
		private calculateTotalPages(totalItems: number, pageSize: number): number {
			var totalItems = Math.ceil(totalItems / pageSize);
			return totalItems;
		}
	}

	/*
	* Represents a single pagination item (clicking on a specific page)
	*/
	export class PaginationRenderItem {
		pageDisplayIndex: KnockoutObservable<number>;

		constructor() {
			this.pageDisplayIndex = ko.observable();
		}

		/*
		* Updates the display index shown
		*/
		updatePageIndex(pageIndex: number) {
			if (pageIndex < 1) {
				throw new Error("The updated pageIndex must be positive");
			}

			this.pageDisplayIndex(pageIndex);
		}
	}

	/*
	* Class that holds the new page size and index that was selected
	*/
	export class PaginationChangeArgs {
		pageSize: number;
		pageIndex: number;

		constructor(newPageSize: number, newPageIndex: number) {
			this.pageSize = newPageSize;
			this.pageIndex = newPageIndex;
		}
	}
}

/*
* This is the base class for a view model that needs to validate
*/
class ValidatingViewModel {
	isValid: KnockoutComputed<any> = ko.computed(() => true);
	isValidating: KnockoutObservable<boolean> = ko.observable(false);
	rules: KnockoutObservableArray<any> = ko.observableArray();
}

/*
* Class to register our customer knockout bindings handlers
*/
class CustomKnockoutBindingHandlerManager {
	/*
	* Initializes the custom knockout bindings
	*/
	initialize() {
		this.createFadeVisibleBinding();
		this.createFadeInVisibleBinding();
		this.createSlideVisibleBinding();
		this.createRightLeftSlideVisibleBinding();
		//this.createBootstrapShowModalBinding();
		//this.createDatePickerBindings();
		this.createTimePickerBindings();
		this.createTooltipValidationBinding();
	}

	/*
	* Sets up a binding to fade in/fade out
	*/
	private createFadeVisibleBinding() {
		ko.bindingHandlers.fadeVisible = {
			init: function (element, valueAccessor) {
				// Initially set the element to be instantly visible/hidden depending on the value
				var value = valueAccessor();
				$(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
			},
			update: function (element, valueAccessor) {
				// Whenever the value subsequently changes, slowly fade the element in or out
				var value = valueAccessor();
				ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).fadeOut();
			}
		};
	}

	/*
	* Sets up a binding to fade in when turning visible or hide when not visible
	*/
	private createFadeInVisibleBinding() {
		ko.bindingHandlers.fadeInVisible = {
			init: function (element, valueAccessor) {
				// Initially set the element to be instantly visible/hidden depending on the value
				var value = valueAccessor();
				$(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
			},
			update: function (element, valueAccessor) {
				// Whenever the value subsequently changes, slowly fade the element in or out
				var value = valueAccessor();
				ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).hide();
			}
		};
	}

	/*
	* Sets up a binding to slide down when visible, or slide up when hidden
	*/
	private createSlideVisibleBinding() {
		ko.bindingHandlers.slideVisible = {
			init: function (element, valueAccessor) {
				// Initially set the element to be instantly visible/hidden depending on the value
				var value = valueAccessor();
				$(element).toggle(ko.utils.unwrapObservable(value));
			},

			update: function (element, valueAccessor, allBindingsAccessor) {
				// Whenever the value subsequently changes, slowly slide the element
				var value = valueAccessor();
				var bindingAccessor = allBindingsAccessor();
				ko.utils.unwrapObservable(value) ? $(element).slideDown() : $(element).slideUp();
			}
		}
	}

	/*
	*
	*/

	private createRightLeftSlideVisibleBinding() {
		ko.bindingHandlers.slideRightLeftVisible = {
			init: function (element, valueAccessor) {
				// Initially set the element to be instantly visible/hidden depending on the value
				var value = valueAccessor();
			},

			update: function (element, valueAccessor, allBindingsAccessor) {
				// Whenever the value subsequently changes, slowly slide the element
				var value = valueAccessor();
				var defaults = {
					showSlide: false
				};
				var bindingAccessor = allBindingsAccessor();
				var contentVisibilityOptions: IButtonSlidingOption = typeof allBindingsAccessor().contentVisibilityOptions === 'object' && allBindingsAccessor().contentVisibilityOptions;
				/* Merge the contents of two or more objects together into the first object. */
				var options: IButtonSlidingOption = jQuery.extend({}, defaults, contentVisibilityOptions);
				if (options.showSlide)
				{
					ko.utils.unwrapObservable(value) ? $(element).animate({ width: 'show' }, options.slideInDuration) : $(element).animate({ width: 'hide' }, options.slideInDuration);
				}
			}
		}
	}

	/*
	* Registers the knockout bindings for show/hide a modal dialog
	*/
	private createBootstrapShowModalBinding() {
		ko.bindingHandlers.showModal = {
			init: function (element, valueAccessor) {
			},

			update: function (element, valueAccessor) {
				var value = valueAccessor();

				if (ko.utils.unwrapObservable(value)) {
					$(element).modal('show');

					// this is to focus input field inside dialog
					$("input", element).focus();
				}
				else {
					$(element).modal('hide');
				}
			}
		};
	}

	/*
	* Registers the knockout bindings for the bootstrap date picker
	*/
	private createDatePickerBindings() {
		ko.bindingHandlers.datepicker = {
			init: function (element, valueAccessor, allBindingsAccessor) {
				//initialize datepicker with some optional options
				var options = allBindingsAccessor().datepickerOptions || { format: 'dd/mm/yyyy', autoclose: true };
				$(element).datepicker(options);

				//when a user changes the date, update the view model
				ko.utils.registerEventHandler(element, "changeDate", function (event) {
					var value = valueAccessor();
					if (ko.isObservable(value)) {
						value(event.date);
					}
				});

				//handle disposal (if KO removes by the template binding)
				ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
					$(element).datepicker("remove");
				});

				// This attaches this binding to the knockout validation
				ko.bindingHandlers["validationCore"].init(element, valueAccessor, allBindingsAccessor, arguments[3], arguments[4]);

				// or you can use this to attach datepicker to the ko validation (left for an example)
				//(function () {
				//	var init = ko.bindingHandlers['datepicker'].init;

				//	ko.bindingHandlers['datepicker'].init = function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
				//		init(element, valueAccessor, allBindingsAccessor);

				//		return ko.bindingHandlers['validationCore'].init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
				//	};
				//}());

				// This doesn't work, changeDate causes input to change, which sets it to null, todo: look into
				//ko.utils.registerEventHandler(element, "change", function () {
				//	var widget = $(element).data("datepicker");

				//	var value = valueAccessor();
				//	if (ko.isObservable(value)) {
				//		if (element.value) {
				//			var date = widget.getUTCDate();
				//			value(date);
				//		} else {
				//			value(null);
				//		}

				//	}
				//});
			},
			update: function (element, valueAccessor) {
				var widget = $(element).data("datepicker");

				//when the view model is updated, update the widget
				if (widget) {
					widget.date = ko.utils.unwrapObservable(valueAccessor());

					if (!widget.date) {
						return;
					}

					//if (_.isString(widget.date)) {
					//	widget.setDate(moment(widget.date).toDate());
					//	return;
					//}

					widget.setValue();
					widget.update();
				}
			}
		};
	}

	/**
	* Registers the knockout bindings for the bootstrap time picker
	*/
	private createTimePickerBindings() {
		ko.bindingHandlers.timepicker = {
			init: function (element, valueAccessor, allBindingsAccessor) {
				//initialize time picker with some optional options
				var options = allBindingsAccessor().timepickerOptions || {};
				$(element).timepicker(options);

				//when a user changes the date, update the view model
				ko.utils.registerEventHandler(element, "changeTime.timepicker", function (event) {
					var value = valueAccessor();
					if (ko.isObservable(value)) {
						value(event.time);
					}
				});

				// This attaches this binding to the knockout validation
				ko.bindingHandlers["validationCore"].init(element, valueAccessor, allBindingsAccessor, arguments[3], arguments[4]);
			},
			update: function (element, valueAccessor) {
				// Update the time picker with the new binding value
				var value = ko.utils.unwrapObservable(valueAccessor());

				$(element).timepicker("setTime", value);
			}
		};
	}

	/**
	* Registers the knockout bindings for the tooltip Validation
	*/
	private createTooltipValidationBinding() {
		ko.bindingHandlers.invalidTooltip = {
			init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
				var observable = valueAccessor(), $element = $(element);

				//if (observable.isValid) {
				var updateTooltip = function (valid?: boolean) {
					if (!valid) {
						$(element).attr("data-original-title", observable.error);
						$(element).tooltip();
					} else {
						$(element).tooltip("destroy");
					}
				}

					updateTooltip(true);
				observable.isValid.subscribe(updateTooltip);
				//}
			},
			update: function (element, valueAccessor) {
				ko.utils.unwrapObservable(valueAccessor());
				var observable = valueAccessor();

				if (observable.isValid) {
				}
			}
		};
	}
}

/******************************************************************
* Custom Prototypes
******************************************************************/

/**
* Adds a function to the Number object to format numbers as money
* @param {number} decimals: number of decimals to use, defaults to 2 decimals when omitted
* @param {string} decimalCharacter: character used as decimal separator, it defaults to '.' when omitted
* @param {string} thousandsCharacter: char used as thousands separator, it defaults to ',' when omitted
* @param {boolean} usenegativeSign: set true to show [-] sign before the number, it defaults to '()' when omitted / set as false
* @return {string} Formatted value as currency
*/
Number.prototype.toMoney = function (decimals?: number, decimalCharacter?: string, thousandsCharacter?: string, usenegativeSign?: boolean): string {
	var self: number = this,
		selfString: string = this,

		c = isNaN(decimals) ? 2 : Math.abs(decimals), //if decimal is zero we must take it, it means user does not want to show any decimal
		d = decimalCharacter || '.', //if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)

		/*
		according to [http://stackoverflow.com/questions/411352/how-best-to-determine-if-an-argument-is-not-sent-to-the-javascript-function]
		the fastest way to check for not defined parameter is to use typeof value === 'undefined'
		rather than doing value === undefined.
		*/
		t = (typeof thousandsCharacter === 'undefined') ? ',' : thousandsCharacter, //if you don't want to use a thousands separator you can pass empty string as thousands_sep value

		sign = (self < 0) ? '-' : '',

		//extracting the absolute value of the integer part of the number and converting to string
		i = parseInt(selfString = Math.abs(self).toFixed(c)) + '',

		j = ((j = i.length) > 3) ? j % 3 : 0;
	self = parseFloat(selfString) - parseFloat(i);

	var prefix = (j ? i.substr(0, j) + t : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t),
		suffix = (c ? d + Math.abs(self).toFixed(c).slice(2) : '');

	prefix = (prefix && prefix !== "0") ? prefix : "";
	suffix = (suffix) ? suffix : "00";

	if (usenegativeSign) {
		return '$' + sign + prefix + suffix;
	}
	else if (sign) {
		return '($' + prefix + suffix + ')';
	}
	return '$' + prefix + suffix;
}

/**
* Function to format numbers as fixed decimals
* @param {number} decimals of decimals to use, defaults to 2 decimals when omitted
* @return {number} Formatted value as number
*/
Number.prototype.toFixedDecimal = function (decimals?: number): number {
	var self: number = this,
		selfString: string = this,

		c = isNaN(decimals) ? 2 : Math.abs(decimals), //if decimal is zero we must take it, it means user does not want to show any decimal
		d = '.', //if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)
		sign = (self < 0) ? -1 : 1,

		//extracting the absolute value of the integer part of the number and converting to string
		i = parseInt(selfString = Math.abs(self).toFixed(c));
	self = parseFloat(selfString) - (i);
	return sign * (i + (c ? parseFloat(d + Math.abs(self).toFixed(c).slice(2)) : 0));
}

/**
* Function to format numbers as fixed decimals with separator
* @param {number} decimals of decimals to use, defaults to 2 decimals when omitted
* @param {number} thousandsCharacter char used as thousands separator, it defaults to ',' when omitted [if you don't want to use a thousands separator you can pass empty string as thousandsCharacter value]
* @return {string} Formatted value as string
*/
Number.prototype.toFixedDecimalWithSeparator = function (decimals?: number, thousandsCharacter?: string): string {
	var self: number = this,
		selfString: string = this,

		c = isNaN(decimals) ? 2 : Math.abs(decimals), //if decimal is zero we must take it, it means user does not want to show any decimal
		// if no decimal separator is passed we use the dot as default decimal separator (we MUST use a decimal separator)
		d = '.',
		// to indicating the negative sign
		s = (self < 0) ? -1 : 1,
		// extracting the absolute value of the integer part of the number and converting to string
		i = parseInt(selfString = Math.abs(self).toFixed(c)),
		// prefix value
		prefix = i + '',
		// used for splitter
		j = ((j = prefix.length) > 3) ? j % 3 : 0,
		//if you don't want to use a thousands separator you can pass empty string as thousands_sep value,
		t = (typeof thousandsCharacter === 'undefined') ? ',' : thousandsCharacter,
		// suffix value
		suffix: string,
		// to indicating the negative sign
		sign: string;

	self = parseFloat(selfString) - (i);

	sign = (s === 1 ? "" : "-")
	prefix = (j ? (prefix.substr(0, j) + t) : '') + prefix.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t);
	suffix = (c ? parseFloat(d + Math.abs(self).toFixed(c).slice(2)) : 0).toString().slice(1);
	if (!suffix) {
		for (var count = 0; count < c; count++) {
			suffix += "0";
		}
		suffix = suffix ? "." + suffix : suffix;
	}
	return sign + prefix + suffix;
}

/**
* Function to format numbers as decimals
* @param {number} decimals of decimals to use, defaults to 1 decimals when omitted
* @param {number} thousandsCharacter char used as thousands separator, it defaults to ',' when omitted [if you don't want to use a thousands separator you can pass empty string as thousandsCharacter value]
* @return {string} Formatted value as number
*/
Number.prototype.toAverage = function (decimals?: number, thousandsCharacter?: string): string {
	var self: number = this;
	return self.toFixedDecimalWithSeparator((decimals || decimals === 0) ? decimals : 1, thousandsCharacter);
};
/**
* Function to format numbers as percentage
* @param {number} decimals of decimals to use, defaults to no decimals when omitted
* @param {number} thousandsCharacter char used as thousands separator, it defaults to ',' when omitted [if you don't want to use a thousands separator you can pass empty string as thousandsCharacter value]
* @return {string} Formatted value as number
*/
Number.prototype.toPercentage = function (decimals?: number, thousandsCharacter?: string): string {
	var self: number = this;
	return self.toFixedDecimalWithSeparator(decimals ? decimals : 0, thousandsCharacter) + '%';
};

/*
* Add function to an observable that will get the value if exists or return null.  This
* helps get null instead of an empty string
*/
ko.observable.fn.getValueOrNull = function () {
	var underlyingValue = this();
	if (underlyingValue == "" || underlyingValue == undefined) {
		underlyingValue = null;
	}

	return underlyingValue;
}

/*
* Interface to define custom prototypes for the Number object
*/
interface Number {
	/**
	* Adds a function to the Number object to format numbers as money
	* @param {number} decimals: number of decimals to use, defaults to 2 decimals when omitted
	* @param {string} decimalCharacter: character used as decimal separator, it defaults to '.' when omitted
	* @param {string} thousandsCharacter: char used as thousands separator, it defaults to ',' when omitted
	* @param {boolean} usenegativeSign: set true to show [-] sign before the number, it defaults to '()' when omitted / set as false
	* @return {string} Formatted value as currency
	*/
	toMoney(decimals?: number, decimalCharacter?: string, thousandsCharacter?: string, usenegativeSign?: boolean): string;
	/**
	* Function to format numbers as fixed decimals
	* @param {number} decimals of decimals to use, defaults to 2 decimals when omitted
	* @return {number} Formatted value as number
	*/
	toFixedDecimal(decimals?: number): number;
	/**
	* Function to format numbers as fixed decimals with separator
	* @param {number} decimals of decimals to use, defaults to 2 decimals when omitted
	* @param {number} thousandsCharacter char used as thousands separator, it defaults to ',' when omitted [if you don't want to use a thousands separator you can pass empty string as thousandsCharacter value]
	* @return {string} Formatted value as number
	*/
	toFixedDecimalWithSeparator(decimals?: number, thousandsCharacter?: string): string;
	/**
	* Function to format numbers as decimals
	* @param {number} decimals of decimals to use, defaults to 1 decimals when omitted
	* @param {number} thousandsCharacter char used as thousands separator, it defaults to ',' when omitted [if you don't want to use a thousands separator you can pass empty string as thousandsCharacter value]
	* @return {string} Formatted value as number
	*/
	toAverage(decimals?: number, thousandsCharacter?: string): string;
	/**
	* Function to format numbers as percentage
	* @param {number} decimals of decimals to use, defaults to no decimals when omitted
	* @param {number} thousandsCharacter char used as thousands separator, it defaults to ',' when omitted [if you don't want to use a thousands separator you can pass empty string as thousandsCharacter value]
	* @return {string} Formatted value as number
	*/
	toPercentage(decimals?: number, thousandsCharacter?: string): string;
}

/*
* Added custom items to the KnockoutBindingHandlers interface
*/
interface KnockoutBindingHandlers {
	//datepicker: KnockoutBindingHandler;
	timepicker: KnockoutBindingHandler;
	invalidTooltip: KnockoutBindingHandler;
	//validationTooltip: KnockoutBindingHandler;
	fadeVisible: KnockoutBindingHandler;
	fadeInVisible: KnockoutBindingHandler;
	slideVisible: KnockoutBindingHandler;
	slideRightLeftVisible: KnockoutBindingHandler;
	//showModal: KnockoutBindingHandler;
}

/*
* Added functions to the knockout interface
*/
interface KnockoutObservableFunctions<T> extends KnockoutSubscribableFunctions {
	/*
	* Get the value of the observable if one exists, otherwise return null if value is an empty string, undefined, ect
	*/
	getValueOrNull(): any;
	/**
	* Used in track change extension.
	* Note: when trackChange is extended, then only this property is available.
	*/
	isDirty: KnockoutObservable<boolean>;
	/**
	* Used in track change extension.
	* Note: when trackChange is extended, then only this property is available.
	*/
	hasValueChanged: KnockoutObservable<boolean>;
}

/*
* Added functions to the knockout interface
*/
interface KnockoutObservableFunction extends KnockoutSubscribableFunctions {
	/*
	* Get the value of the observable if one exists, otherwise return null if value is an empty string, undefined, ect
	*/
	getValueOrNull(): any;
	/**
	* Used in track change extension.
	* Note: when trackChange is extended, then only this property is available.
	*/
	isDirty: KnockoutObservable<boolean>;
	/**
	* Used in track change extension.
	* Note: when trackChange is extended, then only this property is available.
	*/
	hasValueChanged: KnockoutObservable<boolean>;
}

/*
* Added to the KnockoutObservableBase interface
*/
interface KnockoutObservableBase<T> extends KnockoutObservableFunctions<T> {
	/*
	* Used in Knockout validation to reset the validation
	*/
	isModified(value: boolean);
	/**
	* Variable to hold the knockout validation errors.
	*/
	errors: KnockoutValidationErrors;
}

function resizefooter() {
	if ($(window).height() <= 770) {
		$("#footer").css("height", "30px")
                            $("#footer").css("top", "")
                        }
	else if ($(window).height() > 770 && $(window).height() < 800) {
		$("#footer").css("min-height", "30px")
                        	$("#footer").css("height", "auto")
                        	$("#footer").css("top", $(window).height() - 30)
                        }
	else {
		$("#footer").css("min-height", "30px")
                            $("#footer").css("height", "auto")
                            $("#footer").css("top", "770px")
                        }
}

function backgroundimage() {
	var images = ['login_background1.png', 'login_background2.png'];
	$("#BckImg").attr("src", '../Content/images/' + images[Math.floor(Math.random() * images.length)]);
}