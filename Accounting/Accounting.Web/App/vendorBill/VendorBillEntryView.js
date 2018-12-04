/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../services/models/TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion
define(["require", "exports", 'durandal/app', 'vendorBill/VendorMainEntryView'], function(require, exports, ___app__, ___refVendorBillmainView__) {
    //#region Import
    var _app = ___app__;
    var _refVendorBillmainView = ___refVendorBillmainView__;

    //#endregion
    /*
    ** <summary>
    ** Vendor Bill Entry View Model
    ** </summary>
    ** <createDetails>
    ** <id>US11724</id> <by>Satish</by> <date>14th Aug, 2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var VendorBillEntryViewModel = (function () {
        //#region Constructor
        function VendorBillEntryViewModel() {
            //#endregion
            this.vendorBillMainView = new _refVendorBillmainView.VendorBillMainViewModel();
            this.viewModeType = ko.observable(1).extend({ persist: 'viewModeType' });
            this.accordianClass = ko.observable('');
            this.tabbedClass = ko.observable('');
            var self = this;

            // if user clicks on TABBED then we are setting viewMode type as 1.
            self.tabbed = function () {
                self.viewModeType(1);
                self.vendorBillMainView.compositionComplete();
            };

            // if user clicks on ACCORDION then we are setting viewMode type as 0.
            self.accordian = function () {
                self.viewModeType(0);
                $('.carousel-inner').css("overflow", "hidden");
                self.vendorBillMainView.compositionComplete();
            };

            // Accordion view flag is computing.
            self.isAccordianAcitve = ko.computed(function () {
                if (self.viewModeType() === 0) {
                    self.vendorBillMainView.isAccordion(true);
                    return true;
                } else {
                    return false;
                }
            });

            // tab view flag is computing.
            self.isTabAcitve = ko.computed(function () {
                if (self.viewModeType() === 1) {
                    // set overflow:visible after loading completion of tab view
                    setTimeout(function () {
                        $('.carousel-inner').css("overflow", "visible");
                    }, 700);
                    self.vendorBillMainView.isAccordion(false);
                    return true;
                } else {
                    return false;
                }
            });

            //#endregion
            return self;
        }
        //#endregion
        //#region Internal Methods
        //#endregion}
        //#region Life Cycle Event}
        //** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
        VendorBillEntryViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //** The composition engine will execute it prior to calling the binder. */
        VendorBillEntryViewModel.prototype.activate = function () {
            return true;
        };

        //#region Load Data
        VendorBillEntryViewModel.prototype.load = function (bindedData) {
            if (!bindedData)
                return;

            var self = this;

            self.vendorBillMainView.load(bindedData);
        };

        // function to keep cursor focus on DOM first control.
        VendorBillEntryViewModel.prototype.setCursorFocus = function () {
            setTimeout(function () {
                //$("input:text:visible:second").focus();
                //$("#txtVendorName").focus();
            }, 600);
        };

        //When the value of the activator is switched to a new value, before the switch occurs, we register the view data.
        VendorBillEntryViewModel.prototype.deactivate = function () {
            var self = this;

            //data object will keep the viewModels.
            self.vendorBillMainView.deactivate();
        };

        //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
        //To load the registered data if any existed.
        VendorBillEntryViewModel.prototype.beforeBind = function () {
            var self = this, deferred = $.Deferred(), promise = deferred.promise();

            if (self.viewModeType() === 0) {
                self.accordianClass('item active');
                self.tabbedClass('item');
            } else {
                self.accordianClass('item');
                self.tabbedClass('item active');
            }

            _app.trigger("loadMyData", function (data) {
                if (data) {
                    self.load(data);
                    deferred.resolve(true);
                } else {
                    //_app.trigger("closeActiveTab");
                    //_app.trigger("NavigateTo", 'Home');
                    deferred.resolve(true);
                }
            });

            return promise;
        };
        return VendorBillEntryViewModel;
    })();

    return VendorBillEntryViewModel;
});
