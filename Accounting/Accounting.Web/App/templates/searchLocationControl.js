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
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'services/client/CommonClient'], function(require, exports, ___router__, ___app__, __refSystem__, __refCommonClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    var refCommonClient = __refCommonClient__;
    

    //#endregion
    var SearchLocationControl = (function () {
        //#endregion
        //#region Constructor
        function SearchLocationControl(message, id, isTabPress) {
            //#region Members
            // client commond
            this.commonClient = new refCommonClient.Common();
            this.cityStateZip = null;
            this.location = ko.observable();
            this.shouldBeReadOnly = ko.observable(false);
            this.isNotAtLoadingTime = false;
            this.returnValue = false;
            this.errorWidth = ko.observable('88.5%');
            this.normalWidth = ko.observable('93%');
            //To set Validation is required or not
            this.isValidationRequired = ko.observable(true);
            this.country = ko.observable('');
            this.id = ko.observable('');
            var self = this;
            self.isTabPressCallback = isTabPress;
            self.id(id);
            self.cityStateZip = ko.observable('').extend({
                required: {
                    message: message,
                    onlyIf: function () {
                        return (self.isValidationRequired());
                    }
                }
            });
            self.searchLocation = function (query, process) {
                //window.ga('send', 'event', 'button', 'click', 'searchLocationShipperCityStateZip');
                self.location(null);
                return self.commonClient.SearchLocation(query, 100, true, false, process);
            };
            self.onSelectLocation = function (that, event) {
                that.country(event.obj.Country);
                that.location(event.obj);
            };

            // to track changes
            self.SetBITrackChange(self);
            self.getBITrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            self.isBIDirty = ko.computed(function () {
                var result = self.cityStateZip();

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

                if ((charCode === 9)) {
                    if (refSystem.isObject(self.isTabPressCallback))
                        self.isTabPressCallback();
                }
                return true;
            };

            self.idlabel = ko.computed(function () {
                return 'class' + self.id();
            });

            self.cityStateZip.subscribe(function () {
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
        SearchLocationControl.prototype.validateAndDisplay = function () {
            var self = this;
            if (!refSystem.isObject(self.location())) {
                self.cityStateZip('');
                $('.class' + self.id()).removeClass('validation-label2-for-CityStateZip');
                $('.class' + self.id()).addClass('validation-label2');
            }
        };

        SearchLocationControl.prototype.SetBITrackChange = function (self) {
            //** To detect changes for shipper address
            self.cityStateZip.extend({ trackChange: true });
        };

        SearchLocationControl.prototype.cleanup = function (selector) {
            var self = this;
            $(selector).typeahead('dispose');

            for (var property in self) {
                if (property !== "cleanup")
                    delete self[property];
            }
            delete self;
        };
        return SearchLocationControl;
    })();
    exports.SearchLocationControl = SearchLocationControl;
});
