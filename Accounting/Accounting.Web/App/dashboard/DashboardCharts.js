/******************************************************************************

* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.

******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/client/CommonClient', 'services/models/common/DateRange'], function(require, exports, ___router__, ___app__, __refCommonClient__, __refDateRangeClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refCommonClient = __refCommonClient__;
    var refDateRangeClient = __refDateRangeClient__;

    /*
    ** <summary>
    ** Scripts of Welcome page and Dashboard Charts
    ** </summary>
    ** <createDetails>
    ** <id>US25143</id> <by>Shreesha Adiga</by><date>05-10-2016</date> <description>Moved all the code from Welcome.ts to DashboardCharts.ts [Change History is retained]</description>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US19763</id> <by>Shreesha Adiga</by> <date>01-Dec-2015</date> <description>Implement new Fusion charts requirements</description>
    ** <id>US19762</id> <by>Baldev Singh Thakur</by> <date>07-12-2015</date> <description>Inserting data to track Re-quote/Suborder on dashboard.</description>
    ** <id>US19763</id> <by>Shreesha Adiga</by> <date>11-12-2015</date> <description>Changed Color Palettes and some chart configs</description>
    ** <id>DE21150</id> <by>Shreesha Adiga</by> <date>31-12-2015</date> <description>Load charts after the data is retrieved and not in compositionComplete</description>
    ** <id>US20314</id> <by>Shreesha Adiga</by> <date>19-01-2016</date> <description>Added VB matching process; changed color pallettes</description>
    ** <id>US20267</id> <by>Chandan Singh Bajetha</by> <date>28-01-2016</date> <description>Acct: Allow users to Navigate to past date values on graphs</description>
    ** <id>US20853</id> <by>Shreesha Adiga</by> <date>01-03-2016</date> <description>Add Audit Worked counts and create stacked graphs</description>
    ** <id>DE23196</id> <by>Dhaval Tamhane</by> <date>08-06-2016</date> <description>Fixed issue related to pie chart showing wrong date on click of bar chart on left</description>
    ** <id>US23631</id> <by>Shreesha Adiga</by> <date>27-07-2016</date> <description>Implemented Requote Worked Graph For IRManagers</description>
    ** <id>US23604</id> <by>Baldev Singh Thakur</by> <date>01-08-2016</date> <description>Implemented Dispute Dashboard Graph</description>
    ** <id>US23630</id> <by>Vasanthakumar</by> <date>01-08-2016</date> <description>Get the Total Counts of dispute worked by team for all users (Shown only to IR managers)</description>
    ** <id>US23629</id> <by>Shreesha Adiga</by> <date>03-08-2016</date> <description>Get the Total Counts of dispute worked by logged-in user for 5 days</description>
    ** <id>DE23828</id> <by>Baldev Singh Thakur</by> <date>08-08-2016</date> <description>Error found in US23604: Acct: Dispute Dashboard Public Graph - OVC loss count is showing 1 on dashboard on marking OVC to OVC won Status</description>
    ** <id>DE24099</id> <by>Dhaval Tamhane</by> <date>22-08-2016</date> <description>Fix the isssue related to dates in "Dispute: Worked by Team" graph</description>
    ** <id>US24329</id> <by>Shreesha Adiga</by> <date>24-08-2016</date> <description>Add requote worked counts to the "Dispute worked by you" chart</description>
    ** <id>DE24023</id> <by>Shreesha Adiga</by><date>25-08-2016</date> <description>Changed the name of some charts</description>
    ** <id>DE24023</id> <by>Shreesha Adiga</by><date>01-09-2016</date> <description>Changed the color palette of the dispute chart</description>
    ** <id>US25144</id> <by>Shreesha Adiga</by><date>13-10-2016</date><description>Load charts inside composition complete to ensure the html is downloaded before binding the chart data</description>
    ** <id>7266</id> <by>Shreesha Adiga</by><date>23-11-2018</date><description>Set "IsRedirectedFromCC" cookie, if redirect from CC</description>
    ** </changeHistory>
    */
    var DashboardChartsViewModel = (function () {
        // ##END: US25144
        //#endregion Properties
        //#region Constructor
        function DashboardChartsViewModel() {
            //#region Properties
            this.commonClientCommand = new refCommonClient.Common();
            this.numberOfPOsCreated = [];
            this.numberOfPOsAttachedToSO = [];
            //##START: US19763
            //array of data for 5 days
            this.dashboardSummaryReportOfPastDays = [];
            //array of data for worked
            this.numberofPOsWorkedColumnChartArray = [];
            this.dualChartDataSet = [];
            this.categories = [];
            this.category = [];
            this.isAcctCustomer = ko.observable(true);
            // ###START: US19762
            this.numberOfRequoteItermCount = [];
            this.numberOfRequoteTtermCount = [];
            //##START: US20853
            this.numberOfRequoteItermWorkedCount = [];
            this.numberOfRequoteTtermWorkedCount = [];
            //##END: US20853
            this.numberOfSuborderItermCount = [];
            this.numberOfSuborderTtermCount = [];
            //##START: US20853
            this.numberOfSuborderItermWorkedCount = [];
            this.numberOfSuborderTtermWorkedCount = [];
            this.numberOfRequoteToClearedForIRManagers = [];
            this.numberOfRequoteToDisputeForIRManagers = [];
            this.requoteWorkedForIRManagersDataset = [];
            this.requoteWorkedForIRManagersCategories = [];
            this.hasPermissionToDisplayRequoteWorkedByTeam = ko.observable(false);
            // ##END: US23631
            this.dualChartForRequote = [];
            this.requoteCategories = [];
            this.requoteCategory = [];
            this.commonUtils = new Utils.Common();
            this.dualChartForSuborder = [];
            this.suborderCategories = [];
            this.suborderCategory = [];
            // List progress bar for all Graph
            this.listProgress = ko.observable(false);
            this.listProgressForRB = ko.observable(false);
            this.listProgressForSB = ko.observable(false);
            // ##START: US23631
            this.listProgressForRequoteWorkedForIRManagers = ko.observable(false);
            // ##START: US23631
            // saving current from date for calculating new date range
            this.currentFromDate = ko.observable();
            this.currentFromDateForR = ko.observable();
            this.currentFromDateForS = ko.observable();
            // ##START: US23631
            this.currentDateForRequoteWorkedIRManagersChart = ko.observable();
            // ##END: US23631
            // flag for using make disable arrow button if current date === todate
            this.isPreviousButtonEnableForUVBs = ko.observable(false);
            this.isPreviousButtonEnableForRB = ko.observable(false);
            this.isPreviousButtonEnableForSB = ko.observable(false);
            // ##START: US23631
            this.isPreviousButtonEnabledForRequoteWorkedForIRManagers = ko.observable(false);
            // ##END: US23631
            this.isRexnordCustomer = ko.observable(false);
            // ###END: US19762
            // ###START: US23604
            this.listDisputeDashboardDisputesCreatedDetails = [];
            this.listDisputeDashboardClearedDetails = [];
            this.listDisputeDashboardOvcCreatedDetails = [];
            this.listDisputeDashboardDisputesWonDetails = [];
            this.listDisputeDashboardDisputesLostDetails = [];
            this.listDisputeDashboardOvcWonDetails = [];
            this.listDisputeDashboardOvcLossDetails = [];
            this.disputeDashboardDataset = [];
            this.disputeDashboardCategories = [];
            this.listProgressForDisputeDashboardGraph = ko.observable(false);
            this.isPreviousButtonEnabledForDisputeDashboardGraph = ko.observable(false);
            this.currentFromDateForDisputeDashboard = ko.observable();
            // ###END: US203604
            // ###START: US23630
            this.numberOfDisputeToDisputeShortPaidForIRManagers = [];
            this.numberOfDisputeWonForIRManagers = [];
            this.numberOfDisputeLossForIRManagers = [];
            this.numberOfDisputeClearedForIRManagers = [];
            this.numberOfOVCWonForIRManagers = [];
            this.numberOfOVCLossForIRManagers = [];
            this.disputeWorkedForIRManagersDataset = [];
            this.disputeWorkedForIRManagersCategories = [];
            this.currentDateForDisputeWorkedByTeamIRManagersChart = ko.observable();
            this.listProgressForDisputeWorkedByTeamForIRManagers = ko.observable(false);
            this.isHasPermissionToDisplayDisputeWorkedByTeam = ko.observable(false);
            this.isPreviousButtonEnabledForDisputeWorkedByTeamForIRManagers = ko.observable(false);
            // ###END: US23630
            // ##START: US23629
            this.numberOfDisputeToDisputeShortPaidForIndividualUser = [];
            this.numberOfDisputeWonForIndividualUser = [];
            this.numberOfDisputeLossForIndividualUser = [];
            this.numberOfDisputeClearedForIndividualUser = [];
            this.numberOfOVCWonForIndividualUser = [];
            this.numberOfOVCLossForIndividualUser = [];
            // ##START: US24329
            this.numberOfRequoteToClearedForIndividualUser = [];
            this.numberOfRequoteToDisputeForIndividualUser = [];
            // ##END: US24329
            this.disputeWorkedForIndividualUserDataset = [];
            this.disputeWorkedForIndividualUserCategories = [];
            this.currentDateForDisputeWorkedByIndividualUserChart = ko.observable();
            this.listProgressForDisputeWorkedByIndividualUser = ko.observable(false);
            this.hasPermissionToDisplayDisputeWorkedByIndividualUserGraph = ko.observable(false);
            this.isPreviousButtonEnabledForDisputeWorkedByIndividualUser = ko.observable(false);
            // ##END: US23629
            // ##START: US25144
            this.isActiveTab = ko.observable(true);
            var self = this;

            // ###START: US20267
            self.customClass = ko.computed(function () {
                return self.isPreviousButtonEnableForUVBs() === true ? "enableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg" : "disableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg";
            });

            self.customClassForRB = ko.computed(function () {
                return self.isPreviousButtonEnableForRB() === true ? "enableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg" : "disableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg";
            });

            self.customClassForSB = ko.computed(function () {
                return self.isPreviousButtonEnableForSB() === true ? "enableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg" : "disableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg";
            });

            // ###END: US20267
            // ##START: US23631
            self.customClassForRequoteWorkedForManagers = ko.computed(function () {
                return self.isPreviousButtonEnabledForRequoteWorkedForIRManagers() === true ? "enableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg" : "disableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg";
            });

            // ##END: US23631
            // ###START: US23604
            self.customClassForDisputeDashboardGraph = ko.computed(function () {
                return self.isPreviousButtonEnabledForDisputeDashboardGraph() === true ? "enableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg" : "disableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg";
            });

            // ###END: US23604
            // ##START: US23630
            self.customClassForDisputeWorkedByTeamForManagers = ko.computed(function () {
                return self.isPreviousButtonEnabledForDisputeWorkedByTeamForIRManagers() === true ? "enableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg" : "disableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg";
            });

            // ##END: US23630
            // ##START: US23629
            self.customClassForDisputeWorkedByIndividualUser = ko.computed(function () {
                return self.isPreviousButtonEnabledForDisputeWorkedByIndividualUser() === true ? "enableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg" : "disableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg";
            });

            // ##END: US23629
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
        // </changeHistory>
        DashboardChartsViewModel.prototype.load = function () {
            var self = this;

            // ###START: US20267
            var toDate = new Date();

            // From date is different because if source is same it will reflect all from date
            var fromDate = new Date();
            var fromDateForR = new Date();
            var fromDateForS = new Date();

            fromDate.setDate(fromDate.getDate() - 4);
            fromDateForR.setDate(fromDateForR.getDate() - 4);
            fromDateForS.setDate(fromDateForS.getDate() - 4);

            // Set next from date
            // Start
            self.currentFromDate(fromDate);
            self.currentFromDateForR(fromDateForR);
            self.currentFromDateForS(fromDateForS);

            // ##START: US23631
            self.currentDateForRequoteWorkedIRManagersChart(new Date());

            // ##END: US23631
            // ###START: US23604
            var fromDateForDisputeGraph = new Date();
            fromDateForDisputeGraph.setDate(fromDateForDisputeGraph.getDate() - 4);
            self.currentFromDateForDisputeDashboard(fromDateForDisputeGraph);

            // ###END: US23604
            // ###START: US23629
            var currentFromDateForDisputeWorkedForIndividualUser = new Date();
            currentFromDateForDisputeWorkedForIndividualUser.setDate(currentFromDateForDisputeWorkedForIndividualUser.getDate() - 4);
            self.currentDateForDisputeWorkedByIndividualUserChart(currentFromDateForDisputeWorkedForIndividualUser);

            // ###END: US23629
            var dateRange = new refDateRangeClient.Models.dateRange();
            dateRange.FromDate = fromDate;
            dateRange.ToDate = toDate;

            // To fetch data for created UVBs
            self.GetNumberOfPOsCreatedPerDay(dateRange);

            // To fetch data for Manual Audit bill(Requote Board)
            self.GetNumberOfRequoteCountPerDay(dateRange);

            // To fetch data for Manual audit bill (Sub Order)
            self.GetNumberOfSuborderCountPerDay(dateRange);

            // ###END: US20267
            // ##START: US23631
            self.GetNumberOfRequoteWorkedForIRManagers(dateRange);

            // ##END: US23631
            // ###START: US23604
            self.GetDisputeDashboardDetails(dateRange);

            // ###END: US23604
            // ###START: US23630
            self.currentDateForDisputeWorkedByTeamIRManagersChart(new Date());
            self.GetNumberOfDisputeWorkedbyTeamForIRManagers(dateRange);

            // ###END: US23630
            // ##START: US23629
            self.GetNumberOfDisputeWorkedbyIndividualUser(dateRange);
            // ##END: US23629
        };

        DashboardChartsViewModel.prototype.registerData = function (vendorBillId, isSubBill) {
            var self = this;
        };

        // <changeHistory>
        // <id>US20853</id> <by>Shreesha Adiga</by> <date>01-03-2016</date> <description>Check if chart has loaded before disposing</description>
        // </changeHistory>
        DashboardChartsViewModel.prototype.deactivate = function () {
            var self = this;

            if (typeof self.uvbCreatedChart !== "undefined")
                self.uvbCreatedChart.dispose();

            if (typeof self.uvbAttachedChart !== "undefined")
                self.uvbAttachedChart.dispose();

            if (typeof self.requoteChart !== "undefined")
                self.requoteChart.dispose();

            if (typeof self.suborderChart !== "undefined")
                self.suborderChart.dispose();
            //##END: US20853
            //for (var prop in self) {
            //	delete self[prop];
            //}
        };

        //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
        DashboardChartsViewModel.prototype.beforeBind = function () {
            var self = this;

            var returnUrl = self.readCookie("ReturnUrl");

            if (returnUrl && returnUrl != null) {
                var url = Utility.DecodeUri(returnUrl);
                self.eraseCookie("ReturnUrl");
                $.cookie("IsRedirectedFromCC", returnUrl.toLocaleLowerCase().indexOf("vendorbilldetails") > 0, { expires: 1, path: '/' });
                window.location.href = url;
            }
            //self.load();
        };

        //** Using for focus cursor on last cycle for focusing in vendor name
        DashboardChartsViewModel.prototype.compositionComplete = function () {
            var self = this;

            if (self.isActiveTab()) {
                self.load();
            }
        };

        //#endregion
        // <createDetails>
        // <id>US19763</id> <by>Shreesha Adiga</by> <date>01-Dec-2015</date> <description>Implement new Fusion charts requirements</description>
        // </createDetails>
        // <changeHistory>
        // <id>US20267</id> <by>Chandan Singh Bajetha</by> <date>28-01-2016</date> <description>Acct: Allow users to Navigate to past date values on graphs</description>
        // </changeHistory>
        DashboardChartsViewModel.prototype.GetNumberOfPOsCreatedPerDay = function (dateRange) {
            var self = this;
            self.commonClientCommand.GetNumberOfPOsCreatedPerDay(dateRange, function (data) {
                if (data) {
                    //##START: US19763
                    self.dashboardSummaryReportOfPastDays = data.DashboardSummaryReport;

                    self.numberOfPOsCreated.removeAll();
                    self.numberofPOsWorkedColumnChartArray.removeAll();
                    self.category.removeAll();
                    self.categories.removeAll();
                    self.dualChartDataSet.removeAll();

                    data.DashboardSummaryReport.forEach(function (item) {
                        self.numberOfPOsCreated.push({ value: item.AmountOfUVBCreated.toString() });
                        self.numberofPOsWorkedColumnChartArray.push({ value: item.AmountOfUVBWorked.toString() });

                        self.category.push({ name: item.ChangeDateDisplayForCharts });
                    });

                    var attachedDataSet = { seriesname: "Worked", renderas: "Column", data: self.numberofPOsWorkedColumnChartArray };
                    var createdDataSet = { seriesname: "Created", parentyaxis: "C", data: self.numberOfPOsCreated };

                    //datasets for Dual-y column chart
                    self.dualChartDataSet.push(createdDataSet, attachedDataSet);
                    self.categories.push({ category: self.category });

                    self.loadUVBCreatedWorkedCharts();
                    self.listProgress(false);
                }

                // ###START: US18717
                self.isAcctCustomer(data.IsAcctCustomer);

                // ###END: US18717
                // ###START: US19762
                self.isRexnordCustomer(!data.IsRexnord);
                // ###END: US19762
            }, function () {
                self.listProgress(false);
            });
        };

        // <createDetails>
        // <id>US20267</id> <by>Chandan Singh Bajetha</by> <date>28-01-2016</date> <description>Acct: Allow users to Navigate to past date values on graphs</description>
        // </createDetails>
        // <changeHistory>
        // <id>US20853</id> <by>Shreesha Adiga</by> <date>01-03-2016</date> <description>Add Worked counts and create stacked graphs; Hide zero values</description>
        // </changeHistory>
        DashboardChartsViewModel.prototype.GetNumberOfRequoteCountPerDay = function (dateRange) {
            var self = this;
            self.commonClientCommand.GetNumberOfRequoteCountPerDay(dateRange, function (data) {
                if (data) {
                    //##START: US20853
                    self.numberOfRequoteItermCount.removeAll();
                    self.numberOfRequoteTtermCount.removeAll();
                    self.numberOfRequoteItermWorkedCount.removeAll();
                    self.numberOfRequoteTtermWorkedCount.removeAll();

                    self.requoteCategory.removeAll();
                    self.dualChartForRequote.removeAll();
                    self.requoteCategories.removeAll();

                    //if values is zero don't show it since it looks bad in stacked graphs
                    data.NumberOfRequote.forEach(function (item) {
                        self.numberOfRequoteItermCount.push({ value: item.NumberOfRequoteITerm, showValue: item.NumberOfRequoteITerm == 0 ? 0 : 1 });
                        self.numberOfRequoteTtermCount.push({ value: item.NumberOfRequoteTTerm, showValue: item.NumberOfRequoteTTerm == 0 ? 0 : 1 });

                        self.requoteCategory.push({ name: item.ChangeDateDisplay });
                    });

                    data.NumberOfRequoteWorked.forEach(function (item) {
                        self.numberOfRequoteItermWorkedCount.push({ value: item.NumberOfRequoteITermWorked, showValue: item.NumberOfRequoteITermWorked == 0 ? 0 : 1 });
                        self.numberOfRequoteTtermWorkedCount.push({ value: item.NumberOfRequoteTTermWorked, showValue: item.NumberOfRequoteTTermWorked == 0 ? 0 : 1 });
                    });

                    var requotecreatedItermDataSet = { seriesname: "I-Term Created", data: self.numberOfRequoteItermCount };
                    var requoteCreatedTTermDataSet = { seriesname: "T-Term Created", data: self.numberOfRequoteTtermCount };

                    var requoteWorkedITermDataset = { seriesname: "I-Term Worked", data: self.numberOfRequoteItermWorkedCount };
                    var requoteWorkedTTermDataset = { seriesname: "T-Term Worked", data: self.numberOfRequoteTtermWorkedCount };

                    //creating the dataset in proper format for fusioncharts
                    var createdDataset = {
                        dataset: [
                            requotecreatedItermDataSet,
                            requoteCreatedTTermDataSet
                        ]
                    };

                    var workedDataset = {
                        dataset: [
                            requoteWorkedITermDataset,
                            requoteWorkedTTermDataset
                        ]
                    };

                    //##END: US20853
                    //datasets for Dual-y column chart
                    self.dualChartForRequote.push(createdDataset, workedDataset);
                    self.requoteCategories.push({ category: self.requoteCategory });

                    self.loadManualAuditRequoteBoard();
                    self.listProgressForRB(false);
                }
            }, function () {
                self.listProgressForRB(false);
            });
            // ###END: US19762
        };

        // <createDetails>
        // <id>US20267</id> <by>Chandan Singh Bajetha</by> <date>28-01-2016</date> <description>Acct: Allow users to Navigate to past date values on graphs</description>
        // </createDetails>
        // <changeHistory>
        // <id>US20853</id> <by>Shreesha Adiga</by> <date>01-03-2016</date> <description>Add Worked counts and create stacked graphs; Hide zero values</description>
        // </changeHistory>
        DashboardChartsViewModel.prototype.GetNumberOfSuborderCountPerDay = function (dateRange) {
            var self = this;
            self.commonClientCommand.GetNumberOfSuborderCountPerDay(dateRange, function (data) {
                if (data) {
                    //##START: US20853
                    self.numberOfSuborderItermCount.removeAll();
                    self.numberOfSuborderTtermCount.removeAll();
                    self.numberOfSuborderItermWorkedCount.removeAll();
                    self.numberOfSuborderTtermWorkedCount.removeAll();

                    self.suborderCategory.removeAll();
                    self.dualChartForSuborder.removeAll();
                    self.suborderCategories.removeAll();

                    //if values is zero don't show it since it looks bad in stacked graphs
                    data.NumberOfSuborder.forEach(function (item) {
                        self.numberOfSuborderItermCount.push({ value: item.NumberOfSuborderITerm, showValue: item.NumberOfSuborderITerm == 0 ? 0 : 1 });
                        self.numberOfSuborderTtermCount.push({ value: item.NumberOfSuborderTTerm, showValue: item.NumberOfSuborderTTerm == 0 ? 0 : 1 });
                        self.suborderCategory.push({ name: item.ChangeDateDisplay });
                    });

                    data.NumberOfSuborderWorked.forEach(function (item) {
                        self.numberOfSuborderItermWorkedCount.push({ value: item.NumberOfSuborderITermWorked, showValue: item.NumberOfSuborderITermWorked == 0 ? 0 : 1 });
                        self.numberOfSuborderTtermWorkedCount.push({ value: item.NumberOfSuborderTTermWorked, showValue: item.NumberOfSuborderTTermWorked == 0 ? 0 : 1 });
                    });

                    var suborderCreatedITermDataSet = { seriesname: "I-Term Created", data: self.numberOfSuborderItermCount };
                    var suborderCreatedTTermDataSet = { seriesname: "T-Term Created", data: self.numberOfSuborderTtermCount };

                    var suborderWorkedITermDataset = { seriesname: "I-Term Worked", data: self.numberOfSuborderItermWorkedCount };
                    var suborderWorkedTTermDataset = { seriesname: "T-Term Worked", data: self.numberOfSuborderTtermWorkedCount };

                    //creating the dataset in proper format for fusioncharts
                    var createdDataset = {
                        dataset: [
                            suborderCreatedITermDataSet,
                            suborderCreatedTTermDataSet
                        ]
                    };

                    var workedDataset = {
                        dataset: [
                            suborderWorkedITermDataset,
                            suborderWorkedTTermDataset
                        ]
                    };

                    //##END: US20853
                    self.dualChartForSuborder.push(createdDataset, workedDataset);
                    self.suborderCategories.push({ category: self.suborderCategory });

                    self.loadManualAuditsubOrder();
                    self.listProgressForSB(false);
                }
            }, function () {
                self.listProgressForSB(false);
            });
        };

        // <createDetails>
        // <id>US23631</id> <by>Shreesha Adiga</by> <date>27-07-2016</date> <description>Method to fetch the data for Requote Worked Graph For IRManagers</description>
        // </createDetails>
        DashboardChartsViewModel.prototype.GetNumberOfRequoteWorkedForIRManagers = function (dateRange) {
            var self = this;

            self.commonClientCommand.GetNumberOfRequoteWorkedForIRManagers(dateRange, function (data) {
                if (data) {
                    self.hasPermissionToDisplayRequoteWorkedByTeam(data.HasPermissionToDisplayRequoteWorkedByTeam);

                    if (!data.HasPermissionToDisplayRequoteWorkedByTeam) {
                        self.listProgressForRequoteWorkedForIRManagers(false);
                        return;
                    }

                    self.numberOfRequoteToDisputeForIRManagers.removeAll();
                    self.numberOfRequoteToClearedForIRManagers.removeAll();

                    self.requoteWorkedForIRManagersDataset.removeAll();
                    self.requoteWorkedForIRManagersCategories.removeAll();

                    var usernameCategory = [];

                    data.NumberOfRequoteWorkedPerUserForIRManagers.forEach(function (item) {
                        self.numberOfRequoteToClearedForIRManagers.push({ value: item.RequoteToClearedCount, showValue: item.RequoteToClearedCount == 0 ? 0 : 1, toolText: "Requote/Manual Audit to Cleared, " + item.RequoteToClearedCount });
                        self.numberOfRequoteToDisputeForIRManagers.push({ value: item.RequoteToDisputeCount, showValue: item.RequoteToDisputeCount == 0 ? 0 : 1, toolText: "Requote/Manual Audit to Dispute/Dispute Short Paid, " + item.RequoteToDisputeCount });

                        usernameCategory.push({ name: item.UserName });
                    });

                    var requoteToClearedDataset = { seriesname: "Requote/Manual Audit to Cleared", data: self.numberOfRequoteToClearedForIRManagers };
                    var requoteToDisputeDataset = { seriesname: "Requote/Manual Audit to Dispute/Dispute Short Paid", data: self.numberOfRequoteToDisputeForIRManagers };

                    self.requoteWorkedForIRManagersDataset.push(requoteToClearedDataset, requoteToDisputeDataset);
                    self.requoteWorkedForIRManagersCategories.push({ category: usernameCategory });

                    self.loadRequoteWorkedGraphForIRManagers();
                }
            }, function () {
                self.listProgressForRequoteWorkedForIRManagers(false);
            });
        };

        /// <summary>
        /// Get Dispute Dashboard Details for the given date range
        /// </summary>
        /// <param name="dateRange">Date Range</param>
        /// <returns>Data for Dispute Dashboard Details</returns>
        /// <createDetails>
        /// <id>US23604</id> <by>Baldev Singh Thakur</by> <date>01-08-2016</date>
        /// </createDetails>
        DashboardChartsViewModel.prototype.GetDisputeDashboardDetails = function (dateRange) {
            var self = this;

            self.commonClientCommand.GetDisputeDashboardDetails(dateRange, function (data) {
                if (data) {
                    self.listDisputeDashboardDisputesCreatedDetails.removeAll();
                    self.listDisputeDashboardClearedDetails.removeAll();
                    self.listDisputeDashboardOvcCreatedDetails.removeAll();
                    self.listDisputeDashboardDisputesWonDetails.removeAll();
                    self.listDisputeDashboardDisputesLostDetails.removeAll();
                    self.listDisputeDashboardOvcWonDetails.removeAll();
                    self.listDisputeDashboardOvcLossDetails.removeAll();
                    self.disputeDashboardCategories.removeAll();
                    self.disputeDashboardDataset.removeAll();

                    var dateCategory = [];

                    data.DisputeDashboardGraph.forEach(function (item) {
                        self.listDisputeDashboardDisputesCreatedDetails.push({ value: item.DisputesCreated, showValue: item.DisputesCreated == 0 ? 0 : 1 });
                        self.listDisputeDashboardOvcCreatedDetails.push({ value: item.OvcCreated, showValue: item.OvcCreated == 0 ? 0 : 1 });
                        self.listDisputeDashboardClearedDetails.push({ value: item.Cleared, showValue: item.Cleared == 0 ? 0 : 1 });
                        self.listDisputeDashboardDisputesWonDetails.push({ value: item.DisputesWon, showValue: item.DisputesWon == 0 ? 0 : 1 });
                        self.listDisputeDashboardDisputesLostDetails.push({ value: item.DisputesLost, showValue: item.DisputesLost == 0 ? 0 : 1 });
                        self.listDisputeDashboardOvcWonDetails.push({ value: item.OvcWon, showValue: item.OvcWon == 0 ? 0 : 1 });
                        self.listDisputeDashboardOvcLossDetails.push({ value: item.OvcLoss, showValue: item.OvcLoss == 0 ? 0 : 1 });

                        dateCategory.push({ name: item.ChangeDateDisplay });
                    });

                    var disputesCreatedDataset = { seriesname: "Disputes Submitted", data: self.listDisputeDashboardDisputesCreatedDetails };
                    var ovcCreatedDataset = { seriesname: "OVC(s) Submitted", data: self.listDisputeDashboardOvcCreatedDetails };
                    var clearedDataset = { seriesname: "Cleared", data: self.listDisputeDashboardClearedDetails };
                    var disputeWonDataset = { seriesname: "Dispute Won", data: self.listDisputeDashboardDisputesWonDetails };
                    var disputeLostDataset = { seriesname: "Dispute Lost", data: self.listDisputeDashboardDisputesLostDetails };
                    var ovcWonDataset = { seriesname: "Overcharge Won", data: self.listDisputeDashboardOvcWonDetails };

                    // ###START: DE23828
                    var ovcLossDataset = { seriesname: "Overcharge Loss", data: self.listDisputeDashboardOvcLossDetails };

                    // ###END: DE23828
                    var createdDataset = {
                        dataset: [
                            disputesCreatedDataset,
                            ovcCreatedDataset
                        ]
                    };

                    var workedDataset = {
                        dataset: [
                            disputeWonDataset,
                            disputeLostDataset,
                            clearedDataset
                        ]
                    };

                    var ovcWorkedDataset = {
                        dataset: [
                            ovcWonDataset,
                            ovcLossDataset
                        ]
                    };

                    self.disputeDashboardDataset.push(createdDataset, workedDataset, ovcWorkedDataset);
                    self.disputeDashboardCategories.push({ category: dateCategory });

                    self.loadDisputeDashboardGraph();
                }
            }, function () {
                self.listProgressForDisputeDashboardGraph(false);
            });
        };

        // <createDetails>
        // <id>US23630</id> <by>Vasanthakumar</by> <date>01-08-2016</date> <description>Method to fetch Dispute Worked By Team for IRManagers</description>
        // </createDetails>
        // <changeHistory>
        // <id>US23630</id> <by>Vasanthakumar</by> <date>05-08-2016</date> <description>Custom tool tip show in graph</description>
        // </changeHistory>
        DashboardChartsViewModel.prototype.GetNumberOfDisputeWorkedbyTeamForIRManagers = function (dateRange) {
            var self = this;

            self.commonClientCommand.GetNumberOfDisputeWorkedbyTeamForIRManagers(dateRange, function (data) {
                if (data) {
                    self.isHasPermissionToDisplayDisputeWorkedByTeam(data.HasPermissionToDisplayDisputeWorkedByTeam);

                    if (!data.HasPermissionToDisplayDisputeWorkedByTeam) {
                        self.listProgressForDisputeWorkedByTeamForIRManagers(false);
                        return;
                    }

                    self.numberOfDisputeToDisputeShortPaidForIRManagers.removeAll();
                    self.numberOfDisputeWonForIRManagers.removeAll();
                    self.numberOfDisputeLossForIRManagers.removeAll();
                    self.numberOfDisputeClearedForIRManagers.removeAll();
                    self.numberOfOVCWonForIRManagers.removeAll();
                    self.numberOfOVCLossForIRManagers.removeAll();

                    self.disputeWorkedForIRManagersDataset.removeAll();
                    self.disputeWorkedForIRManagersCategories.removeAll();

                    var usernameCategory = [];

                    data.NumberOfDisputeWorkedPerUserForIRManagers.forEach(function (item) {
                        //##START: US23630
                        self.numberOfDisputeToDisputeShortPaidForIRManagers.push({ value: item.DisputeToShortPaidCount, showValue: item.DisputeToShortPaidCount == 0 ? 0 : 1, toolText: "Dispute to Dispute Short Pay, " + item.DisputeToShortPaidCount });
                        self.numberOfDisputeWonForIRManagers.push({ value: item.DisputeWonCount, showValue: item.DisputeWonCount == 0 ? 0 : 1, toolText: "Dispute Won, " + item.DisputeWonCount });
                        self.numberOfDisputeLossForIRManagers.push({ value: item.DisputeLossCount, showValue: item.DisputeLossCount == 0 ? 0 : 1, toolText: "Dispute Loss, " + item.DisputeLossCount });
                        self.numberOfDisputeClearedForIRManagers.push({ value: item.DisputeClearedCount, showValue: item.DisputeClearedCount == 0 ? 0 : 1, toolText: "Dispute Cleared, " + item.DisputeClearedCount });
                        self.numberOfOVCWonForIRManagers.push({ value: item.OVCWonCount, showValue: item.OVCWonCount == 0 ? 0 : 1, toolText: "OVC Won, " + item.OVCWonCount });
                        self.numberOfOVCLossForIRManagers.push({ value: item.OVCLossCount, showValue: item.OVCLossCount == 0 ? 0 : 1, toolText: "OVC Loss, " + item.OVCLossCount });

                        //##END: US23630
                        usernameCategory.push({ name: item.UserName });
                    });

                    var disputeToDisputeShortPaidDataset = { seriesname: "Dispute to Dispute Short Pay", data: self.numberOfDisputeToDisputeShortPaidForIRManagers };
                    var disputeWonDataset = { seriesname: "Dispute Won", data: self.numberOfDisputeWonForIRManagers };
                    var disputeLossDataset = { seriesname: "Dispute Lost", data: self.numberOfDisputeLossForIRManagers };
                    var disputeClearedDataset = { seriesname: "Dispute Cleared", data: self.numberOfDisputeClearedForIRManagers };
                    var ovcWonDataset = { seriesname: "OVC Won", data: self.numberOfOVCWonForIRManagers };
                    var ovcLossDataset = { seriesname: "OVC Loss", data: self.numberOfOVCLossForIRManagers };

                    var disputeShortPaid = {
                        dataset: [
                            disputeToDisputeShortPaidDataset
                        ]
                    };

                    var disputeWorkedDataset = {
                        dataset: [
                            disputeWonDataset,
                            disputeLossDataset,
                            disputeClearedDataset
                        ]
                    };

                    var ovcWorkedDataset = {
                        dataset: [
                            ovcWonDataset,
                            ovcLossDataset
                        ]
                    };

                    self.disputeWorkedForIRManagersDataset.push(disputeShortPaid, disputeWorkedDataset, ovcWorkedDataset);
                    self.disputeWorkedForIRManagersCategories.push({ category: usernameCategory });

                    var today = self.commonUtils.formatDate(dateRange.ToDate, 'mm/dd/yyyy');
                    self.loadDisputeWorkedByTeamGraphForIRManagers(today);
                }
            }, function () {
                self.listProgressForDisputeWorkedByTeamForIRManagers(false);
            });
        };

        /* <createDetails>
        // <id>US23629</id> <by>Shreesha Adiga</by> <date>03-08-2016</date> <description>Method to fetch Dispute and requote Worked By (Logged-in) Individual User</description>
        // </createDetails>
        // <changeHistory>
        // <id>US24329</id> <by>Shreesha Adiga</by> <date>25-08-2016</date> <description>Added Requote Worked counts to the chart</description>
        // </changeHistory>
        */
        DashboardChartsViewModel.prototype.GetNumberOfDisputeWorkedbyIndividualUser = function (dateRange) {
            var self = this;

            self.listProgressForDisputeWorkedByIndividualUser(true);
            self.commonClientCommand.GetDisputeWorkedDashboardDataForIndividualUser(dateRange, function (data) {
                if (data) {
                    self.hasPermissionToDisplayDisputeWorkedByIndividualUserGraph(data.HasPermissionToDisplayDisputeWorkedByIndividualUser);

                    if (!data.HasPermissionToDisplayDisputeWorkedByIndividualUser) {
                        self.listProgressForDisputeWorkedByIndividualUser(false);
                        return;
                    }

                    self.numberOfDisputeToDisputeShortPaidForIndividualUser.removeAll();
                    self.numberOfDisputeWonForIndividualUser.removeAll();
                    self.numberOfDisputeLossForIndividualUser.removeAll();
                    self.numberOfDisputeClearedForIndividualUser.removeAll();
                    self.numberOfOVCWonForIndividualUser.removeAll();
                    self.numberOfOVCLossForIndividualUser.removeAll();

                    // ##START: US24329
                    self.numberOfRequoteToClearedForIndividualUser.removeAll();
                    self.numberOfRequoteToDisputeForIndividualUser.removeAll();

                    // ##END: US24329
                    self.disputeWorkedForIndividualUserDataset.removeAll();
                    self.disputeWorkedForIndividualUserCategories.removeAll();

                    var dateCategory = [];

                    data.NumberOfDisputeWorkedPerUserForLoggedInUser.forEach(function (item) {
                        self.numberOfDisputeToDisputeShortPaidForIndividualUser.push({ value: item.DisputeToShortPaidCount, showValue: item.DisputeToShortPaidCount == 0 ? 0 : 1 });
                        self.numberOfDisputeWonForIndividualUser.push({ value: item.DisputeWonCount, showValue: item.DisputeWonCount == 0 ? 0 : 1 });
                        self.numberOfDisputeLossForIndividualUser.push({ value: item.DisputeLossCount, showValue: item.DisputeLossCount == 0 ? 0 : 1 });
                        self.numberOfDisputeClearedForIndividualUser.push({ value: item.DisputeClearedCount, showValue: item.DisputeClearedCount == 0 ? 0 : 1 });
                        self.numberOfOVCWonForIndividualUser.push({ value: item.OVCWonCount, showValue: item.OVCWonCount == 0 ? 0 : 1 });
                        self.numberOfOVCLossForIndividualUser.push({ value: item.OVCLossCount, showValue: item.OVCLossCount == 0 ? 0 : 1 });

                        // ##START: US24329
                        self.numberOfRequoteToClearedForIndividualUser.push({ value: item.RequoteToClearedCount, showValue: item.RequoteToClearedCount == 0 ? 0 : 1 });
                        self.numberOfRequoteToDisputeForIndividualUser.push({ value: item.RequoteToDisputeCount, showValue: item.RequoteToDisputeCount == 0 ? 0 : 1 });

                        // ##END: US24329
                        dateCategory.push({ name: item.WorkedDateDisplay });
                    });

                    var disputeToDisputeShortPaidDataset = { seriesname: "Dispute to Dispute Short Pay", data: self.numberOfDisputeToDisputeShortPaidForIndividualUser };
                    var disputeWonDataset = { seriesname: "Dispute Won", data: self.numberOfDisputeWonForIndividualUser };
                    var disputeLossDataset = { seriesname: "Dispute Lost", data: self.numberOfDisputeLossForIndividualUser };
                    var disputeClearedDataset = { seriesname: "Dispute Cleared", data: self.numberOfDisputeClearedForIndividualUser };
                    var ovcWonDataset = { seriesname: "OVC Won", data: self.numberOfOVCWonForIndividualUser };
                    var ovcLossDataset = { seriesname: "OVC Loss", data: self.numberOfOVCLossForIndividualUser };

                    // ##START: US24329
                    var requoteToClearedDataset = { seriesname: "Requote/Manual Audit to Cleared", data: self.numberOfRequoteToClearedForIndividualUser };
                    var requoteToDisputeDataset = { seriesname: "Requote/Manual Audit to Dispute/Dispute Short Paid", data: self.numberOfRequoteToDisputeForIndividualUser };

                    // ##END: US24329
                    var disputeShortPaid = {
                        dataset: [
                            disputeToDisputeShortPaidDataset
                        ]
                    };

                    var disputeWorkedDataset = {
                        dataset: [
                            disputeWonDataset,
                            disputeLossDataset,
                            disputeClearedDataset
                        ]
                    };

                    var ovcWorkedDataset = {
                        dataset: [
                            ovcWonDataset,
                            ovcLossDataset
                        ]
                    };

                    // ##START: US24329
                    var requoteWorkedDataset = {
                        dataset: [
                            requoteToClearedDataset,
                            requoteToDisputeDataset
                        ]
                    };

                    self.disputeWorkedForIndividualUserDataset.push(disputeShortPaid, disputeWorkedDataset, ovcWorkedDataset, requoteWorkedDataset);

                    // ##END: US24329
                    self.disputeWorkedForIndividualUserCategories.push({ category: dateCategory });

                    self.loadDisputeWorkedByIndividualUserGraph();
                }
            }, function () {
                self.listProgressForDisputeWorkedByIndividualUser(false);
            });
        };

        /*
        <createDetails>
        <id>DE21150</id> <by>Shreesha Adiga</by> <date>31-12-2016</date> <description>Load charts after the data is retrieved and not in compositionComplete</description>
        </createDetails>
        */
        DashboardChartsViewModel.prototype.loadUVBCreatedWorkedCharts = function () {
            var self = this;

            if (typeof self.uvbCreatedChart !== "undefined") {
                self.uvbCreatedChart.dispose();
            }

            // ###END: US20267
            //##START: US19763
            self.uvbCreatedChart = new FusionCharts({
                type: 'mscolumn2d',
                renderAt: 'chart-container',
                width: "550",
                height: "350",
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "Number of UVBs Created vs Worked",
                        "subCaption": "(Click on worked column to view details)",
                        "xAxisName": "Date",
                        "yAxisName": "UVBs",
                        "rotateValues": "0",
                        "numberPrefix": "",
                        "exportEnabled": "1",
                        "exportShowMenuItem": "0",
                        "theme": "fint",
                        "placeValuesInside": "0",
                        "showvalues": "1",
                        "valueFontColor": "#000000",
                        "paletteColors": "#90CAF9,#1565C0"
                    },
                    "categories": self.categories,
                    "dataset": self.dualChartDataSet
                },
                events: {
                    dataPlotClick: function (eventObj, argsObj) {
                        if (typeof argsObj.categoryLabel != "undefined" && argsObj.datasetName !== "Created") {
                            self.onClickOnChart(argsObj.categoryLabel);
                        }
                    }
                }
            });

            self.uvbCreatedChart.render();

            if (typeof self.dashboardSummaryReportOfPastDays !== "undefined" && self.dashboardSummaryReportOfPastDays !== null) {
                self.renderPieChart(self.dashboardSummaryReportOfPastDays[0], self.dashboardSummaryReportOfPastDays[0].ChangeDateDisplay);
            }
            //##END: US19763
        };

        // <createDetails>
        // <id>US20267</id> <by>Chandan Singh Bajetha</by> <date>28-01-2016</date> <description>Acct: Allow users to Navigate to past date values on graphs</description>
        // </createDetails>
        // <changeHistory>
        // <id>US20853</id> <by>Shreesha Adiga</by> <date>01-03-2016</date> <description>Changed type to multi-series stacked chart</description>
        // </changeHistory>
        DashboardChartsViewModel.prototype.loadManualAuditRequoteBoard = function () {
            var self = this;
            if (typeof self.requoteChart !== "undefined") {
                self.requoteChart.dispose();
            }
            self.requoteChart = new FusionCharts({
                type: 'msstackedcolumn2d',
                renderAt: 'chart-Container-Requote',
                width: "550",
                height: "350",
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "Number of Manual Audit Bills (Requote Board)",
                        "xAxisName": "Date",
                        "yAxisName": "Vendor Bills",
                        "rotateValues": "0",
                        "numberPrefix": "",
                        "exportEnabled": "1",
                        "exportShowMenuItem": "0",
                        "theme": "fint",
                        "placeValuesInside": "0",
                        "showvalues": "1",
                        "valueFontColor": "#000000",
                        "paletteColors": "#8E24AA,#CE93D8,#D81B60,#F48FB1"
                    },
                    "categories": self.requoteCategories,
                    "dataset": self.dualChartForRequote
                }
            });

            self.requoteChart.render();
        };

        // <createDetails>
        // <id>US20267</id> <by>Chandan Singh Bajetha</by> <date>28-01-2016</date> <description>Acct: Allow users to Navigate to past date values on graphs</description>
        // </createDetails>
        // <changeHistory>
        // <id>US20853</id> <by>Shreesha Adiga</by> <date>01-03-2016</date> <description>Changed type to multi-series stacked chart</description>
        // </changeHistory>
        DashboardChartsViewModel.prototype.loadManualAuditsubOrder = function () {
            var self = this;

            if (typeof self.suborderChart !== "undefined") {
                self.suborderChart.dispose();
            }

            self.suborderChart = new FusionCharts({
                type: 'msstackedcolumn2d',
                renderAt: 'chart-Container-Suborder',
                width: "550",
                height: "350",
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "Number of Manual Audit Bills (Suborder Board)",
                        "xAxisName": "Date",
                        "yAxisName": "Vendor Bills",
                        "rotateValues": "0",
                        "numberPrefix": "",
                        "exportEnabled": "1",
                        "exportShowMenuItem": "0",
                        "theme": "fint",
                        "placeValuesInside": "0",
                        "showvalues": "1",
                        "valueFontColor": "#000000",
                        "paletteColors": "#009688,#80CBC4,#FFEB3B,#FFF59D"
                    },
                    "categories": self.suborderCategories,
                    "dataset": self.dualChartForSuborder
                }
            });

            self.suborderChart.render();
        };

        // <createDetails>
        // <id>US23631</id> <by>Shreesha Adiga</by> <date>27-07-2016</date> <description>Function to render the Requote Worked Graph for IR Managers</description>
        // </createDetails>
        // <changeHistory>
        // <id>DE24099</id> <by>Dhaval Tamhane</by><date>24-08-2016 </date> <description>Fix the isssue related to dates in "Dispute: Worked by Team" and "Requote: Worked by Team" graphs</description>
        // <id>DE24023</id> <by>Shreesha Adiga</by><date>25-08-2016 </date> <description>Changed the name of the chart</description>
        // </changeHistory>
        DashboardChartsViewModel.prototype.loadRequoteWorkedGraphForIRManagers = function () {
            var self = this;

            if (typeof self.requoteWorkedChartForIRManagers !== "undefined") {
                self.requoteWorkedChartForIRManagers.dispose();
            }

            var dateForDisplay = self.commonUtils.formatDate(self.currentDateForRequoteWorkedIRManagersChart(), 'mm/dd/yyyy');

            self.requoteWorkedChartForIRManagers = new FusionCharts({
                type: 'stackedcolumn2d',
                renderAt: 'chart-container-requote-worked-managers',
                width: "1120",
                height: "350",
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        // ##START: DE24023
                        "caption": "Requotes: Worked by Team (" + dateForDisplay + ")",
                        // ##END: DE24023
                        "xAxisName": "User's Name",
                        "yAxisName": "Count",
                        "rotateValues": "0",
                        "numberPrefix": "",
                        "exportEnabled": "1",
                        "exportShowMenuItem": "0",
                        "theme": "fint",
                        "placeValuesInside": "0",
                        "showvalues": "1",
                        "valueFontColor": "#000000",
                        // ##START: US24329
                        "paletteColors": "#DDB05B,#FF787F"
                    },
                    "categories": self.requoteWorkedForIRManagersCategories,
                    "dataset": self.requoteWorkedForIRManagersDataset
                }
            });

            self.requoteWorkedChartForIRManagers.render();

            self.listProgressForRequoteWorkedForIRManagers(false);
        };

        /// <summary>
        /// Loads the Dispute Dashboard Graph
        /// </summary>
        /// <param name="dateRange">Date Range</param>
        /// <returns>Data for Dispute Dashboard Details</returns>
        /// <createDetails>
        /// <id>US23604</id> <by>Baldev Singh Thakur</by> <date>01-08-2016</date>
        /// </createDetails>
        /// <changeHistory>
        /// <id>DE24023</id> <by>Shreesha Adiga</by><date>25-08-2016 </date> <description>Changed the caption of the chart</description>
        /// <id>DE24023</id> <by>Shreesha Adiga</by><date>01-09-2016</date> <description>Changed the color palette of the chart</description>
        /// </changeHistory>
        DashboardChartsViewModel.prototype.loadDisputeDashboardGraph = function () {
            var self = this;

            if (typeof self.disputeChartForDashboard !== "undefined") {
                self.disputeChartForDashboard.dispose();
            }

            self.disputeChartForDashboard = new FusionCharts({
                type: 'msstackedcolumn2d',
                renderAt: 'chart-container-dispute-dashboard-graph',
                width: "550",
                height: "350",
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        // ##START: DE24023
                        "caption": "Disputes: Created & Worked",
                        // ##END: DE24023
                        "xAxisName": "Date",
                        "yAxisName": "Vendor Bills",
                        "rotateValues": "0",
                        "numberPrefix": "",
                        "exportEnabled": "1",
                        "exportShowMenuItem": "0",
                        "theme": "fint",
                        "placeValuesInside": "0",
                        "showvalues": "1",
                        "valueFontColor": "#02E0FF",
                        // ##START: DE24023
                        "paletteColors": "#333333,#6B6B6B,#CB2C19,#E5604E,#F2887A,#A0AB00,#C5D200"
                    },
                    "categories": self.disputeDashboardCategories,
                    "dataset": self.disputeDashboardDataset
                }
            });

            self.disputeChartForDashboard.render();

            self.listProgressForDisputeDashboardGraph(false);
        };

        // <createDetails>
        // <id>US23630</id> <by>Vasanthakumar</by> <date>01-08-2016</date> <description>Method to fetch Dispute Worked By Team for IRManagers</description>
        // </createDetails>
        // <changeHistory>
        // <id>DE24023</id> <by>Shreesha Adiga</by><date>25-08-2016 </date> <description>Changed the name of the chart</description >
        // </changeHistory>
        DashboardChartsViewModel.prototype.loadDisputeWorkedByTeamGraphForIRManagers = function (dateForDisplay) {
            var self = this;

            if (typeof self.disputeWorkedByTeamChartForDashboard !== "undefined") {
                self.disputeWorkedByTeamChartForDashboard.dispose();
            }

            self.disputeWorkedByTeamChartForDashboard = new FusionCharts({
                type: 'msstackedcolumn2d',
                renderAt: 'chart-container-dispute-workedbyteam-for-managers',
                width: "1120",
                height: "350",
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        // ##START: DE24023
                        "caption": "Disputes: Worked by Team (" + dateForDisplay + ")",
                        // ##END: DE24023
                        "xAxisName": "User's Name",
                        "yAxisName": "Count",
                        "rotateValues": "0",
                        "numberPrefix": "",
                        "exportEnabled": "1",
                        "exportShowMenuItem": "0",
                        "theme": "fint",
                        "placeValuesInside": "0",
                        "showvalues": "1",
                        "valueFontColor": "#000000",
                        "paletteColors": "#FF6400,#1144AA,#4575D4,#6B8FD4,#00C618,#66E275"
                    },
                    "categories": self.disputeWorkedForIRManagersCategories,
                    "dataset": self.disputeWorkedForIRManagersDataset
                }
            });

            self.disputeWorkedByTeamChartForDashboard.render();

            self.listProgressForDisputeWorkedByTeamForIRManagers(false);
        };

        // <createDetails>
        // <id>US23629</id> <by>Shreesha Adiga</by> <date>03-08-2016</date> <description>Method to render the Dispute Worked Graph for (Logged-in) Individual User</description>
        // </createDetails>
        // <changeHistory>
        // <id>US24329</id> <by>Shreesha Adiga</by> <date>25-08-2016</date> <description>Changed the caption of the chart to include requote; Added 2 extra colors</description>
        // </changeHistory>
        DashboardChartsViewModel.prototype.loadDisputeWorkedByIndividualUserGraph = function () {
            var self = this;

            if (typeof self.disputeWorkedByIndividualUserChart !== "undefined") {
                self.disputeWorkedByIndividualUserChart.dispose();
            }

            self.disputeWorkedByIndividualUserChart = new FusionCharts({
                type: 'msstackedcolumn2d',
                renderAt: 'chart-container-dispute-worked-individual-user',
                width: "550",
                height: "350",
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        // ##START: US24329
                        "caption": "Disputes/ReQuotes: Worked By You",
                        // ##END: US24329
                        "xAxisName": "Date",
                        "yAxisName": "Count",
                        "rotateValues": "0",
                        "numberPrefix": "",
                        "exportEnabled": "1",
                        "exportShowMenuItem": "0",
                        "theme": "fint",
                        "placeValuesInside": "0",
                        "showvalues": "1",
                        "valueFontColor": "#000000",
                        // ##START: US24329
                        "paletteColors": "#FF6400,#1144AA,#4575D4,#6B8FD4,#00C618,#66E275,#DDB05B,#FF787F"
                    },
                    "categories": self.disputeWorkedForIndividualUserCategories,
                    "dataset": self.disputeWorkedForIndividualUserDataset
                }
            });

            self.disputeWorkedByIndividualUserChart.render();

            self.listProgressForDisputeWorkedByIndividualUser(false);
        };

        //##START: US19763
        //On click on the first chart
        DashboardChartsViewModel.prototype.onClickOnChart = function (dateDisplay) {
            var self = this;

            //Year is added because new Date("29 February") returns "March 1st 2001"
            //##START: US20853
            var selectedDate = new Date(dateDisplay + " " + new Date().getFullYear());

            //##END: US20853
            //get data for clicked date
            var summaryReportObject = $.grep(self.dashboardSummaryReportOfPastDays, function (item) {
                //##START: DE23196
                return moment(item.ChangeDateDisplay).date() == selectedDate.getDate();
                //##END: DE23196
            });

            if (typeof summaryReportObject !== "undefined" && summaryReportObject != null) {
                self.renderPieChart(summaryReportObject[0], summaryReportObject[0].ChangeDateDisplay);
            }
        };

        //method to display doughnut chart
        DashboardChartsViewModel.prototype.renderPieChart = function (dataForChart, dateForDisplay) {
            var self = this;

            var chartReference = FusionCharts.items["piechart-1"];

            if (typeof chartReference !== "undefined") {
                chartReference.dispose();
            }
            self.getJsonForPieChart(dataForChart);

            self.uvbAttachedChart = new FusionCharts({
                type: 'doughnut2d',
                renderAt: 'chart-container2',
                width: "550",
                height: "350",
                dataFormat: 'json',
                dataSource: {
                    "chart": {
                        "caption": "UVB Worked    (" + dateForDisplay + ")",
                        "placeValuesInside": "1",
                        "paletteColors": "186dee,#db4733,#00BCD4,#FF6D00,#009955,#ffba03",
                        "useDataPlotColorForLabels": "1",
                        "bgColor": "#ffffff",
                        "showBorder": "0",
                        "use3DLighting": "0",
                        "showShadow": "0",
                        "enableSmartLabels": "1",
                        "startingAngle": "310",
                        //##START: US20314
                        "enableSlicing": "0",
                        "enableRotation": "0",
                        //##END: US20314
                        "labelFontBold": 1,
                        "legendShadow": "0",
                        "legendBorderAlpha": "0",
                        "centerLabelBold": "1",
                        "showTooltip": "0",
                        "decimals": "0",
                        "captionFontSize": "14",
                        "subcaptionFontSize": "14",
                        "subcaptionFontBold": "0",
                        "centerLabel": "$label: $value"
                    },
                    "data": self.numberOfPOsAttachedToSO
                },
                id: 'piechart-1'
            });

            self.uvbAttachedChart.render();
        };

        //add the data for pie chart
        DashboardChartsViewModel.prototype.getJsonForPieChart = function (dataForChart) {
            var self = this;

            self.numberOfPOsAttachedToSO = [];
            self.numberOfPOsAttachedToSO.push({ label: "Made Inactive", value: dataForChart.AmountOfUVBMadeInactive });
            self.numberOfPOsAttachedToSO.push({ label: "Attached By Automation", value: dataForChart.NumberOfUVBsAttachedByAutomation });
            self.numberOfPOsAttachedToSO.push({ label: "UVB To SO", value: dataForChart.AmountOfUVBToSO });
            self.numberOfPOsAttachedToSO.push({ label: "Force Attached", value: dataForChart.AmountOfUVBAttachedToExistingSO });
            self.numberOfPOsAttachedToSO.push({ label: "SO Matching Process", value: dataForChart.AmountOfUVBattachedThroSOMP });
            self.numberOfPOsAttachedToSO.push({ label: "VB Matching Process", value: dataForChart.AmountOfUVBattachedThroVBMP });

            //If the value is zero don't show labels and values on pie chart
            $.map(self.numberOfPOsAttachedToSO, function (item) {
                return item.showValue = item.showLabel = item.value == 0 ? 0 : 1;
            });
        };

        //##END: US19763
        DashboardChartsViewModel.prototype.onClickDownloadFile = function () {
            var self = this;

            //Call the dialog Box functionality to open a Popup
            var optionControlArgs = {
                options: undefined,
                message: '',
                title: '',
                bindingObject: null
            };

            _app.showDialog('dashboardPopUp/DashBoardPopUp', optionControlArgs, 'slideDown').then(function (object) {
            });
        };

        DashboardChartsViewModel.prototype.onClickPreviousNumberofUVBsCreated = function () {
            var self = this;
            if (self.isPreviousButtonEnableForUVBs()) {
                self.listProgress(true);
                var toDateForUVB = self.currentFromDate();
                toDateForUVB.setDate(toDateForUVB.getDate() + 9);
                var fromDate = new Date(toDateForUVB);
                fromDate.setDate(fromDate.getDate() - 4);
                self.currentFromDate(fromDate);
                var dateRange = new refDateRangeClient.Models.dateRange();
                dateRange.FromDate = fromDate;
                dateRange.ToDate = toDateForUVB;
                self.GetNumberOfPOsCreatedPerDay(dateRange);

                var today = self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy');
                if (self.commonUtils.formatDate(toDateForUVB, 'mm/dd/yyyy') === today) {
                    self.isPreviousButtonEnableForUVBs(false);
                }
            }
        };

        DashboardChartsViewModel.prototype.onclickNextNumberofUVBsCreated = function () {
            var self = this;
            self.listProgress(true);
            var toDateForUVBNx = self.currentFromDate();
            toDateForUVBNx.setDate(toDateForUVBNx.getDate() - 1);
            var fromDate = new Date(toDateForUVBNx);
            fromDate.setDate(fromDate.getDate() - 4);
            self.currentFromDate(fromDate);
            var dateRange = new refDateRangeClient.Models.dateRange();
            dateRange.FromDate = fromDate;
            dateRange.ToDate = toDateForUVBNx;
            self.GetNumberOfPOsCreatedPerDay(dateRange);
            self.isPreviousButtonEnableForUVBs(true);
        };

        DashboardChartsViewModel.prototype.onClickPreviousNumberofManualAuditBill_RequoteBoard = function () {
            var self = this;
            if (self.isPreviousButtonEnableForRB()) {
                self.listProgressForRB(true);
                var toDateForRBPrv = self.currentFromDateForR();
                toDateForRBPrv.setDate(toDateForRBPrv.getDate() + 9);
                var fromDate = new Date(toDateForRBPrv);
                fromDate.setDate(fromDate.getDate() - 4);
                self.currentFromDateForR(fromDate);
                var dateRange = new refDateRangeClient.Models.dateRange();
                dateRange.FromDate = fromDate;
                dateRange.ToDate = toDateForRBPrv;
                self.GetNumberOfRequoteCountPerDay(dateRange);

                var today = self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy');
                if (self.commonUtils.formatDate(toDateForRBPrv, 'mm/dd/yyyy') === today) {
                    self.isPreviousButtonEnableForRB(false);
                }
            }
        };

        DashboardChartsViewModel.prototype.OnClickNextNumberofManualAuditBill_RequoteBoard = function () {
            var self = this;
            self.listProgressForRB(true);
            var toDateForRBnxt = self.currentFromDateForR();
            toDateForRBnxt.setDate(toDateForRBnxt.getDate() - 1);
            var fromDate = new Date(toDateForRBnxt);
            fromDate.setDate(fromDate.getDate() - 4);
            self.currentFromDateForR(fromDate);
            var dateRange = new refDateRangeClient.Models.dateRange();
            dateRange.FromDate = fromDate;
            dateRange.ToDate = toDateForRBnxt;
            self.GetNumberOfRequoteCountPerDay(dateRange);
            self.isPreviousButtonEnableForRB(true);
        };

        DashboardChartsViewModel.prototype.onClickPreviousNumberofManualAuditBill_SubourderBoard = function () {
            var self = this;
            if (self.isPreviousButtonEnableForSB()) {
                self.listProgressForSB(true);
                var toDateForSBPrv = self.currentFromDateForS();
                toDateForSBPrv.setDate(toDateForSBPrv.getDate() + 9);
                var fromDate = new Date(toDateForSBPrv);
                fromDate.setDate(fromDate.getDate() - 4);
                self.currentFromDateForS(fromDate);
                var dateRange = new refDateRangeClient.Models.dateRange();
                dateRange.FromDate = fromDate;
                dateRange.ToDate = toDateForSBPrv;
                self.GetNumberOfSuborderCountPerDay(dateRange);

                var today = self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy');
                if (self.commonUtils.formatDate(toDateForSBPrv, 'mm/dd/yyyy') === today) {
                    self.isPreviousButtonEnableForSB(false);
                }
            }
        };

        DashboardChartsViewModel.prototype.onClickNextNumberofManualAuditBill_SubourderBoard = function () {
            var self = this;
            self.listProgressForSB(true);
            var toDateForSBNxt = self.currentFromDateForS();
            toDateForSBNxt.setDate(toDateForSBNxt.getDate() - 1);
            var fromDate = new Date(toDateForSBNxt);
            fromDate.setDate(fromDate.getDate() - 4);
            self.currentFromDateForS(fromDate);
            var dateRange = new refDateRangeClient.Models.dateRange();
            dateRange.FromDate = fromDate;
            dateRange.ToDate = toDateForSBNxt;
            self.GetNumberOfSuborderCountPerDay(dateRange);
            self.isPreviousButtonEnableForSB(true);
        };

        // <createDetails>
        // <id>US23631</id> <by>Shreesha Adiga</by> <date>27-07-2016</date> <description>On click of Previous button on Requote Worked Graph For Managers</description>
        // </createDetails>
        DashboardChartsViewModel.prototype.onClickPreviousRequoteWorkedIRManagersChart = function () {
            var self = this;

            if (self.isPreviousButtonEnabledForRequoteWorkedForIRManagers()) {
                self.listProgressForRequoteWorkedForIRManagers(true);

                var previousDate = self.currentDateForRequoteWorkedIRManagersChart();
                previousDate.setDate(previousDate.getDate() + 1);

                var dateRange = new refDateRangeClient.Models.dateRange();
                dateRange.ToDate = previousDate;

                self.GetNumberOfRequoteWorkedForIRManagers(dateRange);

                // if the chart loaded is for today, then disbale the previous button
                var today = self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy');
                if (self.commonUtils.formatDate(previousDate, 'mm/dd/yyyy') === today) {
                    self.isPreviousButtonEnabledForRequoteWorkedForIRManagers(false);
                }
            }
        };

        // <createDetails>
        // <id>US23631</id> <by>Shreesha Adiga</by> <date>27-07-2016</date> <description>On click of Next button on Requote Worked Graph For Managers</description>
        // </createDetails>
        DashboardChartsViewModel.prototype.onClickNextRequoteWorkedIRManagersChart = function () {
            var self = this;

            self.listProgressForRequoteWorkedForIRManagers(true);

            var nextDate = self.currentDateForRequoteWorkedIRManagersChart();
            nextDate.setDate(nextDate.getDate() - 1);

            var dateRange = new refDateRangeClient.Models.dateRange();
            dateRange.ToDate = nextDate;

            self.isPreviousButtonEnabledForRequoteWorkedForIRManagers(true);

            self.GetNumberOfRequoteWorkedForIRManagers(dateRange);
        };

        /// <summary>
        /// Loads the Dispute Dashboard Graph on click of Previous Button
        /// </summary>
        /// <param name="dateRange">Date Range</param>
        /// <returns>Data for Dispute Dashboard Details</returns>
        /// <createDetails>
        /// <id>US23604</id> <by>Baldev Singh Thakur</by> <date>01-08-2016</date>
        /// </createDetails>
        DashboardChartsViewModel.prototype.onClickPreviousDipsuteDashboardGraph = function () {
            var self = this;

            if (self.isPreviousButtonEnabledForDisputeDashboardGraph()) {
                self.listProgressForDisputeDashboardGraph(true);

                var toDateForDisputeDashboard = self.currentFromDateForDisputeDashboard();
                toDateForDisputeDashboard.setDate(toDateForDisputeDashboard.getDate() + 9);

                var fromDate = new Date(toDateForDisputeDashboard);
                fromDate.setDate(fromDate.getDate() - 4);

                self.currentFromDateForDisputeDashboard(fromDate);

                var dateRange = new refDateRangeClient.Models.dateRange();
                dateRange.FromDate = fromDate;
                dateRange.ToDate = toDateForDisputeDashboard;

                self.GetDisputeDashboardDetails(dateRange);

                var today = self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy');
                if (self.commonUtils.formatDate(toDateForDisputeDashboard, 'mm/dd/yyyy') === today) {
                    self.isPreviousButtonEnabledForDisputeDashboardGraph(false);
                }
            }
        };

        /// <summary>
        /// Loads the Dispute Dashboard Graph on click of Next Button
        /// </summary>
        /// <param name="dateRange">Date Range</param>
        /// <returns>Data for Dispute Dashboard Details</returns>
        /// <createDetails>
        /// <id>US23604</id> <by>Baldev Singh Thakur</by> <date>01-08-2016</date>
        /// </createDetails>
        DashboardChartsViewModel.prototype.onClickNextDisputeDashboardGraph = function () {
            var self = this;

            self.listProgressForDisputeDashboardGraph(true);

            var toDateForDisputeDashboard = self.currentFromDateForDisputeDashboard();
            toDateForDisputeDashboard.setDate(toDateForDisputeDashboard.getDate() - 1);

            var fromDate = new Date(toDateForDisputeDashboard);
            fromDate.setDate(fromDate.getDate() - 4);

            self.currentFromDateForDisputeDashboard(fromDate);

            var dateRange = new refDateRangeClient.Models.dateRange();
            dateRange.FromDate = fromDate;
            dateRange.ToDate = toDateForDisputeDashboard;

            self.GetDisputeDashboardDetails(dateRange);

            self.isPreviousButtonEnabledForDisputeDashboardGraph(true);
        };

        // <createDetails>
        // <id>US23630</id> <by>Vasanthakumar</by> <date>01-08-2016</date> <description>On click of Previous button on Dispute Worked Graph For Managers</description>
        // </createDetails>
        DashboardChartsViewModel.prototype.onClickPreviousDisputeWorkedByTeamIRManagersChart = function () {
            var self = this;

            if (self.isPreviousButtonEnabledForDisputeWorkedByTeamForIRManagers()) {
                self.listProgressForDisputeWorkedByTeamForIRManagers(true);

                var previousDate = self.currentDateForDisputeWorkedByTeamIRManagersChart();
                previousDate.setDate(previousDate.getDate() + 1);

                var dateRange = new refDateRangeClient.Models.dateRange();
                dateRange.ToDate = previousDate;

                self.GetNumberOfDisputeWorkedbyTeamForIRManagers(dateRange);

                // if the chart loaded is for today, then disbale the previous button
                var today = self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy');
                if (self.commonUtils.formatDate(previousDate, 'mm/dd/yyyy') === today) {
                    self.isPreviousButtonEnabledForDisputeWorkedByTeamForIRManagers(false);
                }
            }
        };

        // <createDetails>
        // <id>US23630</id> <by>Vasanthakumar</by> <date>01-08-2016</date> <description>On click of Next button on Dispute Worked Graph For Managers</description>
        // </createDetails>
        DashboardChartsViewModel.prototype.onClickNextDisputeWorkedByTeamIRManagersChart = function () {
            var self = this;

            self.listProgressForDisputeWorkedByTeamForIRManagers(true);

            var nextDate = self.currentDateForDisputeWorkedByTeamIRManagersChart();
            nextDate.setDate(nextDate.getDate() - 1);

            var dateRange = new refDateRangeClient.Models.dateRange();
            dateRange.ToDate = nextDate;

            self.isPreviousButtonEnabledForDisputeWorkedByTeamForIRManagers(true);

            self.GetNumberOfDisputeWorkedbyTeamForIRManagers(dateRange);
        };

        // <createDetails>
        // <id>US23629</id> <by>Shreesha Adiga</by> <date>03-08-2016</date> <description>On click of Previous button on Dispute Worked Graph For (Logged-in) Individual User</description>
        // </createDetails>
        DashboardChartsViewModel.prototype.onClickPreviousDisputeWorkedByIndividualUserChart = function () {
            var self = this;

            if (self.isPreviousButtonEnabledForDisputeWorkedByIndividualUser()) {
                self.listProgressForDisputeWorkedByIndividualUser(true);

                var toDateForDisputeDashboard = self.currentDateForDisputeWorkedByIndividualUserChart();
                toDateForDisputeDashboard.setDate(toDateForDisputeDashboard.getDate() + 9);

                var fromDate = new Date(toDateForDisputeDashboard);
                fromDate.setDate(fromDate.getDate() - 4);

                self.currentDateForDisputeWorkedByIndividualUserChart(fromDate);

                var dateRange = new refDateRangeClient.Models.dateRange();
                dateRange.FromDate = fromDate;
                dateRange.ToDate = toDateForDisputeDashboard;

                self.GetNumberOfDisputeWorkedbyIndividualUser(dateRange);

                // if the chart loaded is for today, then disbale the previous button
                var today = self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy');
                if (self.commonUtils.formatDate(toDateForDisputeDashboard, 'mm/dd/yyyy') === today) {
                    self.isPreviousButtonEnabledForDisputeWorkedByIndividualUser(false);
                }
            }
        };

        // <createDetails>
        // <id>US23629</id> <by>Shreesha Adiga</by> <date>03-08-2016</date> <description>On click of Next button on Dispute Worked Graph For (Logged-in) Individual User</description>
        // </createDetails>
        DashboardChartsViewModel.prototype.onClickNextDisputeWorkedByIndividualUserChart = function () {
            var self = this;

            self.listProgressForDisputeWorkedByIndividualUser(true);

            var toDateForDisputeDashboard = self.currentDateForDisputeWorkedByIndividualUserChart();
            toDateForDisputeDashboard.setDate(toDateForDisputeDashboard.getDate() - 1);

            var fromDate = new Date(toDateForDisputeDashboard);
            fromDate.setDate(fromDate.getDate() - 4);

            self.currentDateForDisputeWorkedByIndividualUserChart(fromDate);

            var dateRange = new refDateRangeClient.Models.dateRange();
            dateRange.FromDate = fromDate;
            dateRange.ToDate = toDateForDisputeDashboard;

            self.isPreviousButtonEnabledForDisputeWorkedByIndividualUser(true);

            self.GetNumberOfDisputeWorkedbyIndividualUser(dateRange);
        };

        DashboardChartsViewModel.prototype.readCookie = function (name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ')
                    c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0)
                    return c.substring(nameEQ.length, c.length);
            }
            return null;
        };

        DashboardChartsViewModel.prototype.createCookie = function (name, value, days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date;
            } else
                var expires = "";
            document.cookie = name + "=" + value + expires + "; path=/";
        };

        DashboardChartsViewModel.prototype.eraseCookie = function (name) {
            var self = this;
            self.createCookie(name, "", -1);
        };
        return DashboardChartsViewModel;
    })();
    exports.DashboardChartsViewModel = DashboardChartsViewModel;
});
