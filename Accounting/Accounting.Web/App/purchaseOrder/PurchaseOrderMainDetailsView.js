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
define(["require", "exports", 'durandal/app', 'purchaseOrder/PurchaseOrderEditDetails'], function(require, exports, ___app__, ___refPurchaseOrdermainView__) {
    //#region Import
    var _app = ___app__;
    var _refPurchaseOrdermainView = ___refPurchaseOrdermainView__;

    //#endregion
    /*
    ** <summary>
    ** Purchase Order Main Details View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US11724</id> <by>Satish</by> <date>14th Aug, 2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var PurchaseOrderMainDetailsViewModel = (function () {
        //#region Constructor
        function PurchaseOrderMainDetailsViewModel() {
            //#endregion
            this.purchaseOrdermainView = new _refPurchaseOrdermainView.PurchaseOrderEditDetails();
            this.accordianClass = ko.observable('');
            this.tabbedClass = ko.observable('');
            this.isLoaded = false;
            this.viewModeType = ko.observable(1).extend({ persist: 'viewModeType' });
            this.purchaseOrderEditDetailsContainer = ko.observable({ view: 'purchaseOrder/PurchaseOrderEditDetailsTabbed', model: this.purchaseOrdermainView });
            var self = this;

            // if user clicks on TABBED then we are setting viewMode type as 1.
            self.tabbed = function () {
                self.viewModeType(1);
                self.purchaseOrdermainView.overFlowManage();

                //self.purchaseOrdermainView.compositionComplete();
                self.purchaseOrdermainView.collapseAllAccordions();
                self.purchaseOrdermainView.collapseAllTabsAndOpenItem();
            };

            // if user clicks on ACCORDION then we are setting viewMode type as 0.
            self.accordian = function () {
                self.viewModeType(0);
                $('.carousel-inner').css("overflow", "hidden");
                self.purchaseOrdermainView.overFlowManage();

                //self.purchaseOrdermainView.compositionComplete();
                self.purchaseOrdermainView.collapseAllAccordions();
                self.purchaseOrdermainView.collapseAllTabsAndOpenItem();
            };

            // Accordion view flag is computing.
            self.isAccordianAcitve = ko.computed(function () {
                if (self.viewModeType() === 0) {
                    self.purchaseOrderEditDetailsContainer({ view: 'purchaseOrder/PurchaseOrderEditDetails', model: self.purchaseOrdermainView });
                    self.purchaseOrdermainView.isAccordion(true);
                    return true;
                } else
                    return false;
            });

            // tab view flag is computing.
            self.isTabAcitve = ko.computed(function () {
                if (self.viewModeType() === 1) {
                    self.purchaseOrderEditDetailsContainer({ view: 'purchaseOrder/PurchaseOrderEditDetailsTabbed', model: self.purchaseOrdermainView });

                    // set overflow:visible after loading completion of tab view
                    setTimeout(function () {
                        $('.carousel-inner').css("overflow", "visible");
                    }, 700);
                    self.purchaseOrdermainView.isAccordion(false);
                    return true;
                } else
                    return false;
            });

            //#endregion
            return self;
        }
        //#endregion
        //#region Internal Methods
        // function to keep cursor focus on DOM first control.
        PurchaseOrderMainDetailsViewModel.prototype.setCursorFocus = function () {
            setTimeout(function () {
                $("input:text:visible:first").focus();
            }, 500);
        };

        //#endregion}
        //#region Life Cycle Event}
        PurchaseOrderMainDetailsViewModel.prototype.compositionComplete = function (view, parent) {
            var self = this;
        };

        //** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
        PurchaseOrderMainDetailsViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //** The composition engine will execute it prior to calling the binder. */
        PurchaseOrderMainDetailsViewModel.prototype.activate = function () {
            return true;
        };

        PurchaseOrderMainDetailsViewModel.prototype.deactivate = function () {
            var self = this;

            self.cleanup();
        };

        //#region Load Data
        PurchaseOrderMainDetailsViewModel.prototype.load = function (bindedData) {
            if (!bindedData)
                return;

            var self = this;

            self.purchaseOrdermainView.load(bindedData);
        };

        //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
        PurchaseOrderMainDetailsViewModel.prototype.beforeBind = function () {
            var self = this;

            if (!self.isLoaded)
                self.purchaseOrdermainView.beforeBind();
            self.isLoaded = true;
            //apply active for the inner div based on view type.
            //if (self.viewModeType() === 0) {
            //	self.accordianClass('item active');
            //	self.tabbedClass('item');
            //} else {
            //	self.accordianClass('item');
            //	self.tabbedClass('item active');
            //}
            //self.viewModeType(1)
            //self.accordianClass('item');
            //self.tabbedClass('item active');
        };

        PurchaseOrderMainDetailsViewModel.prototype.cleanup = function () {
            var self = this;

            self.purchaseOrdermainView.cleanup();

            self.viewModeType.extend({ validatable: false });

            for (var property in self) {
                delete self[property];
            }
        };
        return PurchaseOrderMainDetailsViewModel;
    })();

    return PurchaseOrderMainDetailsViewModel;
});
