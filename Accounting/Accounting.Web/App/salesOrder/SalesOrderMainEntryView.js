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
define(["require", "exports", 'durandal/app', 'salesOrder/SalesOrderMainEntryViewAccordion'], function(require, exports, ___app__, ___refSalesOrdermainView__) {
    //#region Import
    var _app = ___app__;
    var _refSalesOrdermainView = ___refSalesOrdermainView__;

    //#endregion
    /*
    ** <summary>
    **  Sales Order Main Entry View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US12130</id> <by>Chandan</by> <date>26th Aug, 2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var SalesOrderMainEntryViewModel = (function () {
        //#region Constructor
        function SalesOrderMainEntryViewModel() {
            //#endregion
            this.salesOrderMainView = new _refSalesOrdermainView.SalesOrderMainEntryViewModelAccordion();
            this.viewModeType = ko.observable(1).extend({ persist: 'viewModeType' });
            this.accordianClass = ko.observable('');
            this.tabbedClass = ko.observable('');
            var self = this;

            // if user clicks on TABBED then we are setting viewMode type as 1.
            self.tabbed = function () {
                self.viewModeType(1);
                self.salesOrderMainView.compositionComplete();
            };

            // if user clicks on ACCORDION then we are setting viewMode type as 0.
            self.accordian = function () {
                self.viewModeType(0);
                $('.carousel-inner').css("overflow", "hidden");
                self.salesOrderMainView.compositionComplete();
            };

            // Accordion view flag is computing.
            self.isAccordianAcitve = ko.computed(function () {
                if (self.viewModeType() === 0) {
                    self.salesOrderMainView.isAccordion(true);
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
                    self.salesOrderMainView.isAccordion(false);
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
        SalesOrderMainEntryViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //** The composition engine will execute it prior to calling the binder. */
        SalesOrderMainEntryViewModel.prototype.activate = function () {
            return true;
        };

        SalesOrderMainEntryViewModel.prototype.deactivate = function () {
            var self = this;
            self.salesOrderMainView.deactivate();
        };

        //#region Load Data
        //public load(bindedData) {
        //	//** if bindedData is null then return false. */
        //	if (!bindedData)
        //		return;
        //	var self = this;
        //	self.salesOrderMainView.load(bindedData);
        //}
        // function to keep cursor focus on DOM first control.
        SalesOrderMainEntryViewModel.prototype.setCursorFocus = function () {
            setTimeout(function () {
                $("input:text:visible:first").focus();
            }, 500);
        };

        //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
        //To load the registered data if any existed.
        SalesOrderMainEntryViewModel.prototype.beforeBind = function () {
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
                    //self.load(data);
                    deferred.resolve(true);
                } else {
                    //_app.trigger("closeActiveTab");
                    //_app.trigger("NavigateTo", 'Home');
                    deferred.resolve(true);
                }
            });

            return promise;
        };
        return SalesOrderMainEntryViewModel;
    })();

    return SalesOrderMainEntryViewModel;
});
