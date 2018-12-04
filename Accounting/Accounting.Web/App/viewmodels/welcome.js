/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
//#region References
/// <reference path="../localStorage/LocalStorage.ts" />
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion
define(["require", "exports", 'durandal/app', 'services/client/CommonClient', 'dashboard/DashboardCharts', 'dashboard/ARDashboard'], function(require, exports, ___app__, __refCommonClient__, __refDashboardChart__, __refARDashboard__) {
    var _app = ___app__;
    var refCommonClient = __refCommonClient__;
    var refDashboardChart = __refDashboardChart__;
    var refARDashboard = __refARDashboard__;
    

    /*
    ** <summary>
    ** Container view for the dashboard tabs; Moved all the existing code from Welcome.ts to DashboardCharts.ts
    ** </summary>
    ** <createDetails>
    ** <id>US25143</id> <by>Shreesha Adiga</by> <date>05-10-2016</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>DE25209</id> <by>Vasanthakumar</by> <date>30-11-2016</date> <description>Credit and vendor calls are called when clicked on Dashboard</description>
    ** </changeHistory>
    */
    var WelcomeViewModel = (function () {
        //#endregion Properties
        //#region Constructor
        function WelcomeViewModel() {
            //#region Properties
            this.commonClient = new refCommonClient.Common();
            this.dashboardCharts = new refDashboardChart.DashboardChartsViewModel();
            this.arDashboard = new refARDashboard.ARDashboardViewModel();
            this.activeDashboardView = ko.observable('dashboard-charts');
            this.isARDashboardTabVisible = ko.observable(false);
            var self = this;

            self.activeDashboardView.subscribe(function (newValue) {
                self.dashboardCharts.isActiveTab(newValue === 'dashboard-charts');

                // ###START: DE25209
                self.arDashboard.isActiveTab(newValue === 'ar-dashboard');
                // ###END: DE25209
            });

            return self;
        }
        //#endregion Constructor
        //#region Life Cycle Event
        // <changeHistory>
        // <id>US18717</id> <by>Chandan Singh</by> <date>21-Sep-2015</date> <description>Sales Reps Can Access the Download Data File Button.</description>
        // <id>US19763</id> <by>Shreesha Adiga</by> <date>01-Dec-2015</date> <description>Implement new Fusion charts requirements</description>
        // <id>US19762</id> <by>Baldev Singh Thakur</by> <date>07-12-2015</date> <description>Inserting data to track Re-quote/Suborder on dashboard.</description>
        // <id>DE21150</id> <by>Shreesha Adiga</by> <date>31-12-2016</date> <description>Load charts after the data is retrieved and not in compositionComplete</description>
        // <id>US20267</id> <by>Chandan Singh Bajetha</by> <date>28-01-2016</date> <description>Acct: Allow users to Navigate to past date values on graphs</description>
        // <id>US23631</id> <by>Shreesha Adiga</by> <date>28-07-2016</date> <description>Changes related to showing Requote Worked Graph For IRManagers</description>
        // <id>US23604</id> <by>Baldev Singh Thakur</by> <date>01-08-2016</date> <description>Added GetDisputeDashboardDetails for displaying the Dispute Dashboard Graph.</description >
        // <id>US23629</id> <by>Shreesha Adiga</by> <date>03-08-2016</date> <description>Load the Dispute Worked for Individual Users graph</description >
        // <id>DE24099 </id> <by>Dhaval Tamhane</by> <date>24-08-2016 </date> <description>Fix the isssue related to dates in "Dispute: Worked by Team" and "Requote: Worked by Team" graphs</description >
        // </changeHistory>
        WelcomeViewModel.prototype.load = function () {
            var self = this;

            var successCallback = function (data) {
                self.isARDashboardTabVisible(data.HasAccessToARDashboard);
            }, failureCallback = function () {
                console.log("Error while fetching dashbaord container details");
            };

            self.commonClient.GetDashboardContainerDetails(successCallback, failureCallback);

            self.dashboardCharts.beforeBind();
        };

        //** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
        WelcomeViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //** The composition engine will execute it prior to calling the binder. */
        WelcomeViewModel.prototype.activate = function () {
            return true;
        };

        WelcomeViewModel.prototype.deactivate = function () {
            var self = this;

            for (var prop in self) {
                delete self[prop];
            }
        };

        //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
        WelcomeViewModel.prototype.beforeBind = function () {
            var self = this;

            //var returnUrl = self.readCookie("ReturnUrl")
            //if (returnUrl && returnUrl != null) {
            //	var url = Utility.DecodeUri(returnUrl);
            //	self.eraseCookie("ReturnUrl");
            //	window.location.href = url;
            //}
            self.load();
        };

        WelcomeViewModel.prototype.compositionComplete = function () {
            var self = this;
        };

        //#endregion
        //#region Private Methods
        WelcomeViewModel.prototype.onDashboardChartsClick = function () {
            var self = this;

            if (self.activeDashboardView() !== 'dashboard-charts') {
                // hide the dashboard charts before they are loaded
                self.dashboardCharts.hasPermissionToDisplayRequoteWorkedByTeam(false);
                self.dashboardCharts.isHasPermissionToDisplayDisputeWorkedByTeam(false);

                self.activeDashboardView('dashboard-charts');
            }
        };

        WelcomeViewModel.prototype.onARDashboardClick = function () {
            var self = this;

            if (self.activeDashboardView() !== 'ar-dashboard') {
                self.activeDashboardView('ar-dashboard');
                self.arDashboard.beforeBind();
            }
        };
        return WelcomeViewModel;
    })();

    return WelcomeViewModel;
});
