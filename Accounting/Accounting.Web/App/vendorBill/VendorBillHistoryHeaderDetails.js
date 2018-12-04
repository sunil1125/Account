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
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'vendorBill/VendorBillHistory', 'services/client/VendorBillClient', 'vendorBill/VendorBillHistoryDetails'], function(require, exports, ___router__, ___app__, __refVendorBillHistoryViewModel__, __refVendorBillClient__, __refVendorBillHistoryDetailsViewModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    var refVendorBillHistoryViewModel = __refVendorBillHistoryViewModel__;
    var refVendorBillClient = __refVendorBillClient__;
    var refVendorBillHistoryDetailsViewModel = __refVendorBillHistoryDetailsViewModel__;

    //#endregion
    /*
    ** <summary>
    ** Vendor Bill History Header ViewModel.
    ** </summary>
    ** <createDetails>
    ** <id>US8214</id> <by>Baldev Singh Thakur</by> <date>3rdd Mar, 2015</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US20855</id> <by>Chandan Singh Bajetha</by> <date>29-02-2016</date> <description>Acct: Add spinner in History window</description>
    ** </changeHistory>
    */
    var VendorBillHistoryHeaderDetailsViewModel = (function () {
        //#endregion
        //#region Constructor
        function VendorBillHistoryHeaderDetailsViewModel() {
            //Vendor Bill Client
            this.vendorBillClient = new refVendorBillClient.VendorBillClient();
            // keep the header of vendor bill whether it's I term or T term
            this.vendorBillHeader = ko.observable('Vendor Bill History Details');
            var self = this;

            self.vendorBillHistoryViewModel = new refVendorBillHistoryViewModel.VendorBillHistory();
            self.vendorBillHistoryDetailsViewModel = new refVendorBillHistoryDetailsViewModel.VendorBillHistoryDetails();

            return self;
        }
        //#endregion
        //#region Public Methods
        VendorBillHistoryHeaderDetailsViewModel.prototype.onItemsClick = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTab();
            $('#item').addClass('active in');
            $('#itemLink').addClass('active in');

            //$('#history').addClass('active in');
            //$('#historyLink').addClass('active in');
            // ###START: US20855
            self.vendorBillHistoryDetailsViewModel.historyNewValueContainer.listProgress(true);
            self.vendorBillHistoryDetailsViewModel.historyOldValueContainer.listProgress(true);

            if (!$('#collapseHistory').hasClass('in')) {
                var successCallBack = function (data) {
                    var commonUtils = new Utils.Common();

                    // To load History Details
                    self.vendorBillHistoryDetailsViewModel.initializeHistoryDetails(data);

                    // ###START: US20855
                    self.vendorBillHistoryDetailsViewModel.historyNewValueContainer.listProgress(false);
                    self.vendorBillHistoryDetailsViewModel.historyOldValueContainer.listProgress(false);
                    // ###END: US20855
                }, faliureCallBack = function () {
                    // ###START: US20855
                    self.vendorBillHistoryDetailsViewModel.historyNewValueContainer.listProgress(false);
                    self.vendorBillHistoryDetailsViewModel.historyOldValueContainer.listProgress(false);
                    // ###END: US20855
                };
                self.vendorBillClient.GetVendorBillHistoryDetailsByVendorBillId(self.vendorBillId, successCallBack, faliureCallBack);
            }
        };

        VendorBillHistoryHeaderDetailsViewModel.prototype.onDetailsClick = function () {
            var self = this;
            self.collapseAllTab();
            $('#details').addClass('active in');
            $('#detailsLink').addClass('active in');
            self.beforeBind();
        };

        VendorBillHistoryHeaderDetailsViewModel.prototype.collapseAllTab = function () {
            if ($('#details').hasClass('in')) {
                $('#details').removeClass('active in');
                $('#detailsLink').removeClass('active');
            }
            if ($('#item').hasClass('in')) {
                $('#item').removeClass('active in');
                $('#itemLink').removeClass('active');
            }
        };

        //#endregion
        //#region Load Data
        VendorBillHistoryHeaderDetailsViewModel.prototype.load = function (bindedData) {
            if (!bindedData)
                return;

            var self = this;

            //** if there is no data is registered then make a server call. */
            self.vendorBillId = bindedData.vendorBillId;

            //self.proNumber(bindedData.proNumber);
            // ###START: US20855
            self.vendorBillHistoryViewModel.listProgress(true);

            // ###END: US20855
            self.vendorBillHistoryViewModel.historyNewValueContainer.listProgress(true);
            var successCallBack = function (data) {
                // To load payment Details
                self.vendorBillHistoryViewModel.initializeHistoryDetails(data, data.VendorBillId, false);

                self.vendorBillHistoryViewModel.historyNewValueContainer.listProgress(false);
            }, faliureCallBack = function () {
                self.vendorBillHistoryViewModel.historyNewValueContainer.listProgress(false);
            };

            self.vendorBillClient.GetVendorBillHistoryHeaderDetailsByVendorBillId(self.vendorBillId, successCallBack, faliureCallBack);
        };

        //#endregion
        //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
        VendorBillHistoryHeaderDetailsViewModel.prototype.beforeBind = function () {
            var self = this;
            _app.trigger("loadMyData", function (data) {
                if (data) {
                    // ###START: US20855
                    self.vendorBillHistoryViewModel.listProgress(true);

                    // ###END: US20855
                    self.load(data);
                } else {
                    _app.trigger("closeActiveTab");
                    _app.trigger("NavigateTo", 'Home');
                }
            });
        };

        VendorBillHistoryHeaderDetailsViewModel.prototype.compositionComplete = function (view, parent) {
        };

        VendorBillHistoryHeaderDetailsViewModel.prototype.activate = function () {
            return true;
        };

        VendorBillHistoryHeaderDetailsViewModel.prototype.deactivate = function () {
            var self = this;

            self.cleanUp();
        };

        VendorBillHistoryHeaderDetailsViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        VendorBillHistoryHeaderDetailsViewModel.prototype.cleanUp = function () {
            var self = this;

            try  {
                self.vendorBillHistoryViewModel.cleanUp();
                self.vendorBillHistoryDetailsViewModel.cleanUp();

                delete self.vendorBillHistoryViewModel;
                delete self.vendorBillHistoryDetailsViewModel;

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
        return VendorBillHistoryHeaderDetailsViewModel;
    })();

    return VendorBillHistoryHeaderDetailsViewModel;
});
