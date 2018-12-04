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
define(["require", "exports", 'durandal/app', 'vendorBill/VendorEditDetailsView'], function(require, exports, ___app__, ___refvendorBillmainView__) {
    //#region Import
    var _app = ___app__;
    var _refvendorBillmainView = ___refvendorBillmainView__;

    //#endregion
    /*
    ** <summary>
    ** Vendor Bill Mail Edit details View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US8214</id> <by>Satish</by> <date>27th May, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id>US9669</id> <by>Achal Rastogi</by> <date>6-3-2014</date>
    ** <id>DE21389</id> <by>Chandan Singh</by> <date>20-01-2016</date> <description>Term Types are shown randomly on Vendor Bills</description>
    ** </changeHistory>
    */
    var VendorBillMainEditDetailsViewModel = (function () {
        //#region Constructor
        function VendorBillMainEditDetailsViewModel() {
            //#endregion
            this.vendorBillmainView = new _refvendorBillmainView.VendorBillEditDetailsViewModel();
            this.vendorBIllid = ko.observable(0);
            // To show T-term or I-term
            this.termType = ko.observable('');
            this.isLoaded = false;
            this.viewModeType = ko.observable(1).extend({ persist: 'viewModeType' });
            this.accordianClass = ko.observable('');
            this.tabbedClass = ko.observable('');
            this.vendorEditDetailsContainer = ko.observable({ view: 'vendorBill/VendorEditDetailsViewTabbed', model: this.vendorBillmainView });
            var self = this;

            // if user clicks on TABBED then we are setting viewMode type as 1.
            self.tabbed = function () {
                self.viewModeType(1);
                self.vendorBillmainView.overFlowManage();
                self.vendorBillmainView.collapseAllAccordions();
                self.vendorBillmainView.collapseAllTabAndOpenItem();
            };

            // if user clicks on ACCORDION then we are setting viewMode type as 0.
            self.accordian = function () {
                $('.carousel-inner').css("overflow", "hidden");
                self.viewModeType(0);
                self.vendorBillmainView.overFlowManage();

                //self.vendorBillmainView.compositionComplete();
                self.vendorBillmainView.collapseAllAccordions();
                self.vendorBillmainView.collapseAllTabAndOpenItem();
            };

            // Accordion view flag is computing.
            self.isAccordianAcitve = ko.computed(function () {
                if (self.viewModeType() === 0) {
                    self.vendorEditDetailsContainer({ view: 'vendorBill/VendorEditDetailsView', model: self.vendorBillmainView });
                    self.vendorBillmainView.isAccordion(true);
                    return true;
                } else
                    return false;
            });

            // tab view flag is computing.
            self.isTabAcitve = ko.computed(function () {
                if (self.viewModeType() === 1) {
                    // set overflow:visible after loading completion of tab view
                    setTimeout(function () {
                        $('.carousel-inner').css("overflow", "visible");
                    }, 700);
                    self.vendorEditDetailsContainer({ view: 'vendorBill/VendorEditDetailsViewTabbed', model: self.vendorBillmainView });
                    self.vendorBillmainView.isAccordion(false);
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
        VendorBillMainEditDetailsViewModel.prototype.setCursorFocus = function () {
            setTimeout(function () {
                $("input:text:visible:first").focus();
            }, 500);
        };

        //#endregion
        //#region Life Cycle Event}
        VendorBillMainEditDetailsViewModel.prototype.compositionComplete = function (view, parent) {
            var self = this;
            self.load();
            //Using this logic to navigate to the details page in case of opening from other application (CC)
            //Passing vendorBillId because of coming back in Home if vendorBillId is not available
            //self.vendorBillmainView.loadViewAfterComposition(self.vendorBIllid());
            //self.vendorBillmainView.beforeBind(self.vendorBIllid());
        };

        //** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
        VendorBillMainEditDetailsViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //** The composition engine will execute it prior to calling the binder. */
        VendorBillMainEditDetailsViewModel.prototype.activate = function (vendorBillId) {
            var self = this;
            if (vendorBillId !== undefined) {
                if (parseInt(vendorBillId)) {
                    self.vendorBIllid(vendorBillId);
                }
            }
            return true;
        };

        //#region Load Data
        VendorBillMainEditDetailsViewModel.prototype.load = function () {
            var self = this;

            self.vendorBillmainView.changeTermType = function (processFlow) {
                if (processFlow === 1) {
                    self.termType(" - I");
                } else {
                    self.termType(" - T");
                }
            };
        };

        //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
        VendorBillMainEditDetailsViewModel.prototype.beforeBind = function () {
            var self = this;

            // ###START: DE21389
            self.load();

            if (self.vendorBIllid()) {
                var binddata = {
                    // Flag to specify whether to go to DB or not?
                    isSubBill: false,
                    isException: false,
                    //vendorbill data.
                    vendorBillId: self.vendorBIllid()
                };
                _app.trigger("registerMyData", binddata);
                //self.vendorBillmainView.load(binddata);
            }

            if (!self.isLoaded)
                self.vendorBillmainView.beforeBind(self.vendorBIllid());
            self.isLoaded = true;
        };

        VendorBillMainEditDetailsViewModel.prototype.deactivate = function () {
            var self = this;

            //ko.cleanNode($("#mainDiv")[0]);
            self.cleanup();

            ko.removeNode($("#mainDiv")[0]);
        };

        VendorBillMainEditDetailsViewModel.prototype.cleanup = function () {
            var self = this;

            self.vendorBillmainView.cleanup();
            delete self.vendorBillmainView;

            try  {
                for (var prop in self) {
                    if (typeof self[prop].dispose === "function") {
                        self[prop].dispose();
                    }
                    delete self[prop];
                }

                delete self;
            } catch (exception) {
            }
        };
        return VendorBillMainEditDetailsViewModel;
    })();

    return VendorBillMainEditDetailsViewModel;
});
