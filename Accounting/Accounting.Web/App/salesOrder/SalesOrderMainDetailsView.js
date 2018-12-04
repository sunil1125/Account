/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'durandal/app', 'salesOrder/SalesOrderEditDetailsAccordionView', 'services/models/common/Enums'], function(require, exports, ___app__, ___refSalesOrderMainView__, __refEnums__) {
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
    //#region Import
    var _app = ___app__;
    var _refSalesOrderMainView = ___refSalesOrderMainView__;
    var refEnums = __refEnums__;

    //#endregion
    /*
    ** <summary>
    **Sales Order Main Edit Details View Model
    ** </summary>
    ** <createDetails>
    ** <id>US8214</id> <by>Satish</by> <date>27th May, 2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US9669</id> <by>Achal Rastogi</by> <date>6-3-2014</date>
    ** <id>US27900</id> <by>Shreesha Adiga</by> <date>03-05-2017</date><description>Allow opening a sales order with URL</description>
    ** </changeHistory>
    */
    var SalesOrderMainEditDetailsViewModel = (function () {
        //#region Constructor
        function SalesOrderMainEditDetailsViewModel() {
            //#endregion
            this.salesOrderMainView = new _refSalesOrderMainView.SalesOrderEditDetailsViewModel();
            this.viewModeType = ko.observable(1).extend({ persist: 'viewModeType' });
            this.accordianClass = ko.observable('');
            this.tabbedClass = ko.observable('');
            this.isLoaded = false;
            // ##END: US27900
            this.workspaceContainer = ko.observable({ view: 'salesOrder/SalesOrderEditDetailsTabbedView', model: this.salesOrderMainView });
            //To Show sales order page title Combination of Sales Order - <Service Type> - <Term Type>  (<Creation Type>)
            this.salesOrderAppPageTitle = ko.observable('');
            var self = this;

            // if user clicks on TABBED then we are setting viewMode type as 1.
            self.tabbed = function () {
                self.viewModeType(1);
                self.salesOrderMainView.collaspeAllAccordion();
                self.salesOrderMainView.overFlowManage();

                self.salesOrderMainView.collapseAllTabsAndOpenItem();
            };

            // if user clicks on ACCORDION then we are setting viewMode type as 0.
            self.accordian = function () {
                self.viewModeType(0);

                ////##START: DE20306
                //$('.carousel-inner').css("overflow", "hidden");
                ////##END: DE20306
                self.salesOrderMainView.overFlowManage();

                self.salesOrderMainView.collapseAllTabsAndOpenItem();
                self.salesOrderMainView.collaspeAllAccordion();
            };

            // Accordion view flag is computing.
            self.isAccordianAcitve = ko.computed(function () {
                if (self.viewModeType() === 0) {
                    self.salesOrderMainView.isAccordion(true);

                    self.workspaceContainer({ view: 'salesOrder/SalesOrderEditDetailsAccordionView', model: self.salesOrderMainView });

                    return true;
                } else
                    return false;
            });

            // tab view flag is computing.
            self.isTabAcitve = ko.computed(function () {
                if (self.viewModeType() === 1) {
                    // set overflow:visible after loading completion of tab view
                    ////##START: DE20306
                    //setTimeout(function () {
                    //	$('.carousel-inner').css("overflow", "visible");
                    //}, 700);
                    ////##END: DE20306
                    self.salesOrderMainView.isAccordion(false);
                    self.workspaceContainer({ view: 'salesOrder/SalesOrderEditDetailsTabbedView', model: self.salesOrderMainView });
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
        SalesOrderMainEditDetailsViewModel.prototype.setCursorFocus = function () {
            setTimeout(function () {
                $("input:text:visible:first").focus();
            }, 500);
        };

        //#endregion
        //#region Life Cycle Event}
        SalesOrderMainEditDetailsViewModel.prototype.compositionComplete = function (view, parent) {
            var self = this;
            self.load();
        };

        //** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
        SalesOrderMainEditDetailsViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //** The composition engine will execute it prior to calling the binder. */
        // ##START: US27900
        SalesOrderMainEditDetailsViewModel.prototype.activate = function (shipmentId, bolNumber) {
            var self = this;

            if (parseInt(shipmentId)) {
                this.shipmentId = parseInt(shipmentId);
                this.bolNumber = bolNumber;
            }

            return true;
        };

        // ##END: US27900
        //#region Load Data
        SalesOrderMainEditDetailsViewModel.prototype.load = function () {
            //** if bindedData is null then return false. */
            var self = this;

            self.salesOrderMainView.salesOrderPageTitle = function (QuoteId, ServiceType, processFlow) {
                self.salesOrderAppPageTitle(self.getServiceType(ServiceType) + self.getTermType(processFlow) + self.getOrderType(QuoteId, ServiceType));
            };
        };

        //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
        SalesOrderMainEditDetailsViewModel.prototype.beforeBind = function () {
            var self = this;
            self.load();

            if (self.shipmentId && self.bolNumber) {
                var binddata = {
                    // Flag to specify whether to go to DB or not?
                    isSubOrder: false,
                    bolNumber: self.bolNumber,
                    //vendorbill data.
                    salesOrderId: self.shipmentId
                };
                _app.trigger("registerMyData", binddata);
                //self.vendorBillmainView.load(binddata);
            }

            if (!self.isLoaded)
                self.salesOrderMainView.beforeBind();
            self.isLoaded = true;
            //self.viewModeType(1);
            //self.accordianClass('item');
            //self.tabbedClass('item active');
        };
        SalesOrderMainEditDetailsViewModel.prototype.getTermType = function (processFlow) {
            if (processFlow === 1)
                return "- I";
else
                return "- T";
        };

        SalesOrderMainEditDetailsViewModel.prototype.getOrderType = function (QuoteId, ServiceType) {
            if (QuoteId === 0 || ServiceType === refEnums.Enums.ServiceType.Truckload.ID) {
                return " (Manual Order)";
            } else {
                return " (Rated Order)";
            }
        };

        SalesOrderMainEditDetailsViewModel.prototype.getServiceType = function (ServiceType) {
            if (ServiceType === 0)
                return "- LTL ";
else if (ServiceType === 1)
                return "- Guaranteed LTL ";
else if (ServiceType === 2)
                return "- Pallet ";
else if (ServiceType === 3)
                return "- TL ";
else if (ServiceType === 4)
                return "- INT WH ";
else if (ServiceType === 5)
                return "- Ocean ";
else if (ServiceType === 6)
                return "- Expedited ";
else if (ServiceType === 7)
                return "- Expedited ";
else if (ServiceType === 8)
                return "- Expedited ";
else if (ServiceType === 9)
                return "- White Glove ";
else if (ServiceType === 10)
                return "- Multi-Leg ";
else if (ServiceType === 11)
                return "- VPTL ";
else
                return "";
        };

        SalesOrderMainEditDetailsViewModel.prototype.deactivate = function () {
            var self = this;

            //ko.cleanNode($("#mainDiv")[0]);
            self.cleanup();
            //ko.removeNode($("#mainDiv")[0]);
            //setTimeout(() => { self.cleanup(); }, 10);
            //clearTimeout(10);
        };

        SalesOrderMainEditDetailsViewModel.prototype.cleanup = function () {
            var self = this;

            self.salesOrderMainView.cleanup();
            self.isAccordianAcitve.dispose();
            self.viewModeType.extend({ validatable: false });

            for (var property in self) {
                delete self[property];
            }
        };
        return SalesOrderMainEditDetailsViewModel;
    })();

    return SalesOrderMainEditDetailsViewModel;
});
