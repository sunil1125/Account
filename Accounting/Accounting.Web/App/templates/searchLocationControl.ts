/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/** File Created
	Created By  : Achal Rastogi
	Date        : 23 April, 2014
	Description : Auto complete view for search location on the basis of zip code, city and state.
*/

//#region Refrences
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../../Scripts/TypeDefs/common.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refCommonClient = require('services/client/CommonClient');
import refMapLocation = require('services/models/common/MapLocation');
//#endregion

export class SearchLocationControl {
	//#region Members

	// client commond
	commonClient: refCommonClient.Common = new refCommonClient.Common();

	public cityStateZip: KnockoutObservable<string> = null;
	public location: KnockoutObservable<refMapLocation.IMapLocation> = ko.observable();
	searchLocation: (query: string, process: Function) => any;
	onSelectLocation: (that: SearchLocationControl, event) => void;
	shouldBeReadOnly: KnockoutObservable<boolean> = ko.observable(false);
	//for tracking change
	getBITrackChange: () => string[];
	isBIDirty: KnockoutComputed<boolean>;
	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	isNotAtLoadingTime: boolean = false;
	returnValue: boolean = false;
	errorWidth: KnockoutObservable<string> = ko.observable('88.5%');
	normalWidth: KnockoutObservable<string> = ko.observable('93%');
	//To set Validation is required or not
	isValidationRequired: KnockoutObservable<boolean> = ko.observable(true);
	//## To trigger when when 'TAB' press from process details.
	isTabPress: (that, event) => void;
	isTabPressCallback: () => void;
	public country: KnockoutObservable<string> = ko.observable('');
	id: KnockoutObservable<string> = ko.observable('');
	idlabel: KnockoutComputed<string>;
	//#endregion

	//#region Constructor
	constructor(message: string, id: string, isTabPress?: () => void) {
		var self = this;
		self.isTabPressCallback = isTabPress;
		self.id(id);
		self.cityStateZip = ko.observable('').extend({
			required: {
				message: message,
				onlyIf: () => {
					return (self.isValidationRequired());
				}
			}
		});
		self.searchLocation = function (query, process) {
			//window.ga('send', 'event', 'button', 'click', 'searchLocationShipperCityStateZip');
			self.location(null);
			return self.commonClient.SearchLocation(query, 100, true, false, process);
		}
		self.onSelectLocation = function (that: SearchLocationControl, event) {
			that.country(event.obj.Country);
			that.location(event.obj);
		}

		// to track changes
		self.SetBITrackChange(self);
		self.getBITrackChange = function () {
			return Utils.getDirtyItems(self);
		};

		self.isBIDirty = ko.computed(() => {
			var result = self.cityStateZip();
			// If this from loading data side the return as false
			if (self.isNotAtLoadingTime)
				return false;

			var returnValue = self.getBITrackChange().length > 0 ? true : false;
			self.returnValue = returnValue;
			if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
				self.onChangesMade(returnValue);

			return returnValue;
		});

		//## when user pressed 'TAB' from reference number then BOL exist then expand items else expand address view.
		self.isTabPress = function (data, event) {
			var charCode = (event.which) ? event.which : event.keyCode;

			if ((charCode === 9)) { //if 'TAB' press.
				if (refSystem.isObject(self.isTabPressCallback))
					self.isTabPressCallback();
			}
			return true;
		}

		self.idlabel = ko.computed(function () {
			return 'class' + self.id();
		});

		self.cityStateZip.subscribe(() => {
			var cityStateZipCode = self.cityStateZip().length;
			var cityStateZipWithoutSpace = self.cityStateZip().trim();
			if (cityStateZipWithoutSpace === '' || cityStateZipCode <= 1) {
				$('.class' + self.id()).removeClass('validation-label2-for-CityStateZip');
				$('.class' + self.id()).addClass('validation-label2');
			} else {
				$('.class' + self.id()).removeClass('validation-label2');
				$('.class' + self.id()).addClass('validation-label2-for-CityStateZip');
			}
		});
	}
	//#endregion

	//#region Internal Methods

	// For validate that location is selected or not
	public validateAndDisplay() {
		var self = this;
		if (!refSystem.isObject(self.location())) {
			self.cityStateZip('');
			$('.class' + self.id()).removeClass('validation-label2-for-CityStateZip');
			$('.class' + self.id()).addClass('validation-label2');
		}
	}

	SetBITrackChange(self) {
		//** To detect changes for shipper address
		self.cityStateZip.extend({ trackChange: true });
	}

	public cleanup(selector) {
        var self = this;
        $(selector).typeahead('dispose');

        for (var property in self) {
            if (property !== "cleanup")
                delete self[property];
        }
        delete self;
	}

	//#endregion
}