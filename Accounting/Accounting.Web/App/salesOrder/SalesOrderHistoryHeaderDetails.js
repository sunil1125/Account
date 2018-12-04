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
define(["require", "exports", 'plugins/router', 'durandal/app', 'salesOrder/SalesOrderHistory', 'services/client/SalesOrderClient', 'salesOrder/SalesOrderHistoryDetails'], function(require, exports, ___router__, ___app__, __refSalesOrderHistoryViewModel__, __refSalesOrderClient__, __refSalesOrderHistoryDetailsViewModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    var refSalesOrderHistoryViewModel = __refSalesOrderHistoryViewModel__;
    var refSalesOrderClient = __refSalesOrderClient__;
    var refSalesOrderHistoryDetailsViewModel = __refSalesOrderHistoryDetailsViewModel__;

    //#endregion
    /*
    ** <summary>
    **Sales Order History Header ViewModel.
    ** </summary>
    ** <createDetails>
    ** <id>US8214</id> <by>Baldev Singh Thakur</by> <date>2nd Mar, 2015</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US20855</id> <by>Chandan Singh Bajetha</by> <date>29-02-2016</date> <description>Acct: Add spinner in History window</description>
    ** </changeHistory>
    */
    var SalesOrderHistoryHeaderDetailsViewModel = (function () {
        //#endregion
        //#region Constructor
        function SalesOrderHistoryHeaderDetailsViewModel() {
            //Sales Order Client
            this.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
            this.salesOrderHeader = ko.observable('Sales Order History Details');
            var self = this;
            self.salesOrderHistoryViewModel = new refSalesOrderHistoryViewModel.SalesOrderHistoryViewModel();
            self.salesOrderHistoryDetailsViewModel = new refSalesOrderHistoryDetailsViewModel.SalesOrderHistoryDetails();

            return self;
        }
        //#endregion
        //#region Public Methods
        SalesOrderHistoryHeaderDetailsViewModel.prototype.onItemsClick = function () {
            var self = this;

            // To avoid tabs goes blank on quick move between tabs
            self.collapseAllTab();
            $('#item').addClass('active in');
            $('#itemLink').addClass('active in');

            //$('#history').addClass('active in');
            //$('#historyLink').addClass('active in');
            // ###START: US20855
            self.salesOrderHistoryDetailsViewModel.historyNewValueContainer.listProgress(true);
            self.salesOrderHistoryDetailsViewModel.historyOldValueContainer.listProgress(true);

            if (!$('#collapseHistory').hasClass('in')) {
                var successCallBack = function (data) {
                    var commonUtils = new Utils.Common();

                    // To load History Details
                    self.salesOrderHistoryDetailsViewModel.initializeHistoryDetails(data);

                    // ###START: US20855
                    self.salesOrderHistoryDetailsViewModel.historyNewValueContainer.listProgress(false);
                    self.salesOrderHistoryDetailsViewModel.historyOldValueContainer.listProgress(false);
                    // ###END: US20855
                }, faliureCallBack = function () {
                    // ###START: US20855
                    self.salesOrderHistoryDetailsViewModel.historyNewValueContainer.listProgress(false);
                    self.salesOrderHistoryDetailsViewModel.historyOldValueContainer.listProgress(false);
                    // ###END: US20855
                };
                self.salesOrderClient.GetShipmentHistoryDetailsByShipmentId(self.salesOrderId, successCallBack, faliureCallBack);
            }
        };

        SalesOrderHistoryHeaderDetailsViewModel.prototype.onDetailsClick = function () {
            var self = this;
            self.collapseAllTab();
            $('#details').addClass('active in');
            $('#detailsLink').addClass('active in');
            self.beforeBind();
        };

        SalesOrderHistoryHeaderDetailsViewModel.prototype.collapseAllTab = function () {
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
        SalesOrderHistoryHeaderDetailsViewModel.prototype.load = function (bindedData) {
            if (!bindedData)
                return;

            var self = this;

            //** if there is no data is registered then make a server call. */
            self.salesOrderId = bindedData.salesOrderId;

            //self.proNumber(bindedData.proNumber);
            // ###START: US20855
            self.salesOrderHistoryViewModel.listProgress(true);

            // ###END: US20855
            self.salesOrderHistoryViewModel.historyNewValueContainer.listProgress(true);
            var successCallBack = function (data) {
                // To load payment Details
                self.salesOrderHistoryViewModel.initializeHistoryDetails(data, data.SalesOrderId, false);

                self.salesOrderHistoryViewModel.historyNewValueContainer.listProgress(false);
            }, faliureCallBack = function () {
                self.salesOrderHistoryViewModel.historyNewValueContainer.listProgress(false);
            };

            self.salesOrderClient.GetShipmentHistoryHeaderDetailsByShipmentId(self.salesOrderId, successCallBack, faliureCallBack);
        };

        //#endregion
        //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
        SalesOrderHistoryHeaderDetailsViewModel.prototype.beforeBind = function () {
            var self = this;
            _app.trigger("loadMyData", function (data) {
                if (data) {
                    // ###START: US20855
                    self.salesOrderHistoryViewModel.listProgress(true);

                    // ###END: US20855
                    self.load(data);
                } else {
                    _app.trigger("closeActiveTab");
                    _app.trigger("NavigateTo", 'Home');
                }
            });
        };

        SalesOrderHistoryHeaderDetailsViewModel.prototype.compositionComplete = function (view, parent) {
        };

        SalesOrderHistoryHeaderDetailsViewModel.prototype.activate = function () {
            return true;
        };

        SalesOrderHistoryHeaderDetailsViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };
        return SalesOrderHistoryHeaderDetailsViewModel;
    })();
    return SalesOrderHistoryHeaderDetailsViewModel;
});
