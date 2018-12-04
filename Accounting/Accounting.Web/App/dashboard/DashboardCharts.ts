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

import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refCommonClient = require('services/client/CommonClient');
import refDateRangeClient = require('services/models/common/DateRange');

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
export class DashboardChartsViewModel {
	//#region Properties
	commonClientCommand: refCommonClient.Common = new refCommonClient.Common();

	numberOfPOsCreated = [];
	numberOfPOsAttachedToSO = [];

	//##START: US19763
	//array of data for 5 days
	dashboardSummaryReportOfPastDays = [];
	//array of data for worked
	numberofPOsWorkedColumnChartArray = [];
	dualChartDataSet = [];

	categories = []; //array of category for dua-y chart
	category = [];
	//##END: US19763

	uvbCreatedChart: any;
	uvbAttachedChart: any;
	isAcctCustomer: KnockoutObservable<boolean> = ko.observable(true);

	// ###START: US19762
	numberOfRequoteItermCount = [];
	numberOfRequoteTtermCount = [];

	//##START: US20853
	numberOfRequoteItermWorkedCount = [];
	numberOfRequoteTtermWorkedCount = [];
	//##END: US20853

	numberOfSuborderItermCount = [];
	numberOfSuborderTtermCount = [];
	//##START: US20853
	numberOfSuborderItermWorkedCount = [];
	numberOfSuborderTtermWorkedCount = [];
	//##END: US20853

	// ##START: US23631
	requoteWorkedChartForIRManagers: any;
	numberOfRequoteToClearedForIRManagers = [];
	numberOfRequoteToDisputeForIRManagers = [];
	requoteWorkedForIRManagersDataset = [];
	requoteWorkedForIRManagersCategories = [];
	hasPermissionToDisplayRequoteWorkedByTeam: KnockoutObservable<boolean> = ko.observable(false);
	// ##END: US23631

	dualChartForRequote = [];
	requoteChart: any;
	requoteCategories = [];
	requoteCategory = [];

	commonUtils: CommonStatic = new Utils.Common();

	dualChartForSuborder = [];
	suborderChart: any;
	suborderCategories = [];
	suborderCategory = [];

	// List progress bar for all Graph 
	listProgress: KnockoutObservable<boolean> = ko.observable(false);
	listProgressForRB: KnockoutObservable<boolean> = ko.observable(false);
	listProgressForSB: KnockoutObservable<boolean> = ko.observable(false);
	// ##START: US23631
	listProgressForRequoteWorkedForIRManagers: KnockoutObservable<boolean> = ko.observable(false);
	// ##START: US23631

	// saving current from date for calculating new date range
	currentFromDate: KnockoutObservable<any> = ko.observable();
	currentFromDateForR: KnockoutObservable<any> = ko.observable();
	currentFromDateForS: KnockoutObservable<any> = ko.observable();
	// ##START: US23631
	currentDateForRequoteWorkedIRManagersChart: KnockoutObservable<any> = ko.observable();
	// ##END: US23631

	// custom class to apply in icon 
	customClass: KnockoutComputed<string>;
	customClassForRB: KnockoutComputed<string>;
	customClassForSB: KnockoutComputed<string>;
	// ##START: US23631
	customClassForRequoteWorkedForManagers: KnockoutComputed<string>;
	// ##END: US23631

	// flag for using make disable arrow button if current date === todate
	isPreviousButtonEnableForUVBs: KnockoutObservable<boolean> = ko.observable(false);
	isPreviousButtonEnableForRB: KnockoutObservable<boolean> = ko.observable(false);
	isPreviousButtonEnableForSB: KnockoutObservable<boolean> = ko.observable(false);
	// ##START: US23631
	isPreviousButtonEnabledForRequoteWorkedForIRManagers: KnockoutObservable<boolean> = ko.observable(false);
	// ##END: US23631

	isRexnordCustomer: KnockoutObservable<boolean> = ko.observable(false);
	// ###END: US19762

	// ###START: US23604
	listDisputeDashboardDisputesCreatedDetails = [];
	listDisputeDashboardClearedDetails = [];
	listDisputeDashboardOvcCreatedDetails = [];
	listDisputeDashboardDisputesWonDetails = [];
	listDisputeDashboardDisputesLostDetails = [];
	listDisputeDashboardOvcWonDetails = [];
	listDisputeDashboardOvcLossDetails = [];
	disputeDashboardDataset = [];
	disputeDashboardCategories = [];
	disputeChartForDashboard: any;
	listProgressForDisputeDashboardGraph: KnockoutObservable<boolean> = ko.observable(false);
	isPreviousButtonEnabledForDisputeDashboardGraph: KnockoutObservable<boolean> = ko.observable(false);
	currentFromDateForDisputeDashboard: KnockoutObservable<any> = ko.observable();
	customClassForDisputeDashboardGraph: KnockoutComputed<string>;

	// ###END: US203604

	// ###START: US23630
	numberOfDisputeToDisputeShortPaidForIRManagers = [];
	numberOfDisputeWonForIRManagers = [];
	numberOfDisputeLossForIRManagers = [];
	numberOfDisputeClearedForIRManagers = [];
	numberOfOVCWonForIRManagers = [];
	numberOfOVCLossForIRManagers = [];
	disputeWorkedForIRManagersDataset = [];
	disputeWorkedForIRManagersCategories = [];
	disputeWorkedByTeamChartForDashboard: any;
	customClassForDisputeWorkedByTeamForManagers: KnockoutComputed<string>;
	currentDateForDisputeWorkedByTeamIRManagersChart: KnockoutObservable<any> = ko.observable();
	listProgressForDisputeWorkedByTeamForIRManagers: KnockoutObservable<boolean> = ko.observable(false);
	isHasPermissionToDisplayDisputeWorkedByTeam: KnockoutObservable<boolean> = ko.observable(false);
	isPreviousButtonEnabledForDisputeWorkedByTeamForIRManagers: KnockoutObservable<boolean> = ko.observable(false);
	// ###END: US23630

	// ##START: US23629
	numberOfDisputeToDisputeShortPaidForIndividualUser = [];
	numberOfDisputeWonForIndividualUser = [];
	numberOfDisputeLossForIndividualUser = [];
	numberOfDisputeClearedForIndividualUser = [];
	numberOfOVCWonForIndividualUser = [];
	numberOfOVCLossForIndividualUser = [];
	// ##START: US24329
	numberOfRequoteToClearedForIndividualUser = [];
	numberOfRequoteToDisputeForIndividualUser = [];
	// ##END: US24329

	disputeWorkedForIndividualUserDataset = [];
	disputeWorkedForIndividualUserCategories = [];
	disputeWorkedByIndividualUserChart: any;

	customClassForDisputeWorkedByIndividualUser: KnockoutComputed<string>;
	currentDateForDisputeWorkedByIndividualUserChart: KnockoutObservable<any> = ko.observable();
	listProgressForDisputeWorkedByIndividualUser: KnockoutObservable<boolean> = ko.observable(false);
	hasPermissionToDisplayDisputeWorkedByIndividualUserGraph: KnockoutObservable<boolean> = ko.observable(false);
	isPreviousButtonEnabledForDisputeWorkedByIndividualUser: KnockoutObservable<boolean> = ko.observable(false);
	// ##END: US23629

	// ##START: US25144
	isActiveTab: KnockoutObservable<boolean> = ko.observable(true);
	// ##END: US25144

	//#endregion Properties

	//#region Constructor
	constructor() {
		var self = this;

		// ###START: US20267
		self.customClass = ko.computed(() => {
			return self.isPreviousButtonEnableForUVBs() === true ? "enableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg" : "disableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg";
		});

		self.customClassForRB = ko.computed(() => {
			return self.isPreviousButtonEnableForRB() === true ? "enableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg" : "disableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg";
		});

		self.customClassForSB = ko.computed(() => {
			return self.isPreviousButtonEnableForSB() === true ? "enableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg" : "disableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg";
		});
		// ###END: US20267

		// ##START: US23631
		self.customClassForRequoteWorkedForManagers = ko.computed(() => {
			return self.isPreviousButtonEnabledForRequoteWorkedForIRManagers() === true ? "enableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg" : "disableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg";
		});
		// ##END: US23631

		// ###START: US23604
		self.customClassForDisputeDashboardGraph = ko.computed(() => {
			return self.isPreviousButtonEnabledForDisputeDashboardGraph() === true ? "enableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg" : "disableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg";
		});

		// ###END: US23604
		// ##START: US23630
		self.customClassForDisputeWorkedByTeamForManagers = ko.computed(() => {
			return self.isPreviousButtonEnabledForDisputeWorkedByTeamForIRManagers() === true ? "enableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg" : "disableAwsomFontLeftRightArrowIcon fa fa-chevron-left fa-lg";
		});
		// ##END: US23630

		// ##START: US23629
		self.customClassForDisputeWorkedByIndividualUser = ko.computed(() => {
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
	public load() {
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
	}

	public registerData(vendorBillId, isSubBill) {
		var self = this;
	}

	// <changeHistory>
	// <id>US20853</id> <by>Shreesha Adiga</by> <date>01-03-2016</date> <description>Check if chart has loaded before disposing</description>
	// </changeHistory>
	public deactivate() {
		var self = this;

		//##START: US20853
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
	}

	//**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
	public beforeBind() {
		var self = this;

		var returnUrl = self.readCookie("ReturnUrl")

		if (returnUrl && returnUrl != null) {
			var url = Utility.DecodeUri(returnUrl);
			self.eraseCookie("ReturnUrl");
			$.cookie("IsRedirectedFromCC", returnUrl.toLocaleLowerCase().indexOf("vendorbilldetails") > 0, { expires: 1, path: '/' });
			window.location.href = url;
		}

		//self.load();
	}

	//** Using for focus cursor on last cycle for focusing in vendor name
	public compositionComplete() {
		var self = this;

		if (self.isActiveTab()) {
			self.load();
		}
	}
	//#endregion

	// <createDetails>
	// <id>US19763</id> <by>Shreesha Adiga</by> <date>01-Dec-2015</date> <description>Implement new Fusion charts requirements</description>
	// </createDetails>
	// <changeHistory>
	// <id>US20267</id> <by>Chandan Singh Bajetha</by> <date>28-01-2016</date> <description>Acct: Allow users to Navigate to past date values on graphs</description>
	// </changeHistory>
	public GetNumberOfPOsCreatedPerDay(dateRange: refDateRangeClient.IdateRange) {
		var self = this;
		self.commonClientCommand.GetNumberOfPOsCreatedPerDay(dateRange, (data) => {
			if (data) {
				//##START: US19763
				self.dashboardSummaryReportOfPastDays = data.DashboardSummaryReport;

				self.numberOfPOsCreated.removeAll();
				self.numberofPOsWorkedColumnChartArray.removeAll();
				self.category.removeAll();
				self.categories.removeAll();
				self.dualChartDataSet.removeAll();

				data.DashboardSummaryReport.forEach((item) => {
					self.numberOfPOsCreated.push({ value: item.AmountOfUVBCreated.toString() });
					self.numberofPOsWorkedColumnChartArray.push({ value: item.AmountOfUVBWorked.toString() });

					self.category.push({ name: item.ChangeDateDisplayForCharts });
				});

				var attachedDataSet = { seriesname: "Worked", renderas: "Column", data: self.numberofPOsWorkedColumnChartArray };
				var createdDataSet = { seriesname: "Created", parentyaxis: "C", data: self.numberOfPOsCreated };

				//datasets for Dual-y column chart
				self.dualChartDataSet.push(createdDataSet, attachedDataSet);
				self.categories.push({ category: self.category });

				self.loadUVBCreatedWorkedCharts();//DE21150
				self.listProgress(false);
			}
			// ###START: US18717
			self.isAcctCustomer(data.IsAcctCustomer);
			// ###END: US18717

			// ###START: US19762
			self.isRexnordCustomer(!data.IsRexnord);
			// ###END: US19762
		}, () => {
				self.listProgress(false);
			});
	}

	// <createDetails>
	// <id>US20267</id> <by>Chandan Singh Bajetha</by> <date>28-01-2016</date> <description>Acct: Allow users to Navigate to past date values on graphs</description>
	// </createDetails>
	// <changeHistory>
	// <id>US20853</id> <by>Shreesha Adiga</by> <date>01-03-2016</date> <description>Add Worked counts and create stacked graphs; Hide zero values</description>
	// </changeHistory>
	public GetNumberOfRequoteCountPerDay(dateRange: refDateRangeClient.IdateRange) {
		var self = this;
		self.commonClientCommand.GetNumberOfRequoteCountPerDay(dateRange, (data) => {
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
				data.NumberOfRequote.forEach((item) => {
					self.numberOfRequoteItermCount.push({ value: item.NumberOfRequoteITerm, showValue: item.NumberOfRequoteITerm == 0 ? 0 : 1 });
					self.numberOfRequoteTtermCount.push({ value: item.NumberOfRequoteTTerm, showValue: item.NumberOfRequoteTTerm == 0 ? 0 : 1 });

					self.requoteCategory.push({ name: item.ChangeDateDisplay });
				});

				data.NumberOfRequoteWorked.forEach((item) => {
					self.numberOfRequoteItermWorkedCount.push({ value: item.NumberOfRequoteITermWorked, showValue: item.NumberOfRequoteITermWorked == 0 ? 0 : 1 });
					self.numberOfRequoteTtermWorkedCount.push({ value: item.NumberOfRequoteTTermWorked, showValue: item.NumberOfRequoteTTermWorked == 0 ? 0 : 1 });
				});

				var requotecreatedItermDataSet = { seriesname: "I-Term Created", data: self.numberOfRequoteItermCount };
				var requoteCreatedTTermDataSet = { seriesname: "T-Term Created", data: self.numberOfRequoteTtermCount };

				var requoteWorkedITermDataset = { seriesname: "I-Term Worked", data: self.numberOfRequoteItermWorkedCount };
				var requoteWorkedTTermDataset = { seriesname: "T-Term Worked", data: self.numberOfRequoteTtermWorkedCount };

				//creating the dataset in proper format for fusioncharts
				var createdDataset =
					{
						dataset:
						[
							requotecreatedItermDataSet,
							requoteCreatedTTermDataSet
						]
					};

				var workedDataset =
					{
						dataset:
						[
							requoteWorkedITermDataset,
							requoteWorkedTTermDataset
						]
					};
				//##END: US20853

				//datasets for Dual-y column chart
				self.dualChartForRequote.push(createdDataset, workedDataset);
				self.requoteCategories.push({ category: self.requoteCategory });

				self.loadManualAuditRequoteBoard();//DE21150
				self.listProgressForRB(false);
			}

		}, () => {
				self.listProgressForRB(false);
			});
		// ###END: US19762
	}

	// <createDetails>
	// <id>US20267</id> <by>Chandan Singh Bajetha</by> <date>28-01-2016</date> <description>Acct: Allow users to Navigate to past date values on graphs</description>
	// </createDetails>
	// <changeHistory>
	// <id>US20853</id> <by>Shreesha Adiga</by> <date>01-03-2016</date> <description>Add Worked counts and create stacked graphs; Hide zero values</description>
	// </changeHistory>
	public GetNumberOfSuborderCountPerDay(dateRange: refDateRangeClient.IdateRange) {
		var self = this;
		self.commonClientCommand.GetNumberOfSuborderCountPerDay(dateRange, (data) => {
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
				data.NumberOfSuborder.forEach((item) => {
					self.numberOfSuborderItermCount.push({ value: item.NumberOfSuborderITerm, showValue: item.NumberOfSuborderITerm == 0 ? 0 : 1 });
					self.numberOfSuborderTtermCount.push({ value: item.NumberOfSuborderTTerm, showValue: item.NumberOfSuborderTTerm == 0 ? 0 : 1 });
					self.suborderCategory.push({ name: item.ChangeDateDisplay });
				});

				data.NumberOfSuborderWorked.forEach((item) => {
					self.numberOfSuborderItermWorkedCount.push({ value: item.NumberOfSuborderITermWorked, showValue: item.NumberOfSuborderITermWorked == 0 ? 0 : 1 });
					self.numberOfSuborderTtermWorkedCount.push({ value: item.NumberOfSuborderTTermWorked, showValue: item.NumberOfSuborderTTermWorked == 0 ? 0 : 1 });
				});

				var suborderCreatedITermDataSet = { seriesname: "I-Term Created", data: self.numberOfSuborderItermCount };
				var suborderCreatedTTermDataSet = { seriesname: "T-Term Created", data: self.numberOfSuborderTtermCount };

				var suborderWorkedITermDataset = { seriesname: "I-Term Worked", data: self.numberOfSuborderItermWorkedCount };
				var suborderWorkedTTermDataset = { seriesname: "T-Term Worked", data: self.numberOfSuborderTtermWorkedCount };

				//creating the dataset in proper format for fusioncharts
				var createdDataset =
					{
						dataset:
						[
							suborderCreatedITermDataSet,
							suborderCreatedTTermDataSet
						]
					};

				var workedDataset =
					{
						dataset:
						[
							suborderWorkedITermDataset,
							suborderWorkedTTermDataset
						]
					};
				//##END: US20853

				self.dualChartForSuborder.push(createdDataset, workedDataset);
				self.suborderCategories.push({ category: self.suborderCategory });

				self.loadManualAuditsubOrder();//DE21150
				self.listProgressForSB(false);
			}

		}, () => {
				self.listProgressForSB(false);
			});
	}

	// <createDetails>
	// <id>US23631</id> <by>Shreesha Adiga</by> <date>27-07-2016</date> <description>Method to fetch the data for Requote Worked Graph For IRManagers</description>
	// </createDetails>
	public GetNumberOfRequoteWorkedForIRManagers(dateRange: refDateRangeClient.IdateRange) {
		var self = this;

		self.commonClientCommand.GetNumberOfRequoteWorkedForIRManagers(dateRange, (data) => {
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

				data.NumberOfRequoteWorkedPerUserForIRManagers.forEach((item) => {
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
		}, () => {
				self.listProgressForRequoteWorkedForIRManagers(false);
			});
	}

	/// <summary>
	/// Get Dispute Dashboard Details for the given date range
	/// </summary>
	/// <param name="dateRange">Date Range</param>
	/// <returns>Data for Dispute Dashboard Details</returns>
	/// <createDetails>
	/// <id>US23604</id> <by>Baldev Singh Thakur</by> <date>01-08-2016</date>
	/// </createDetails>
	public GetDisputeDashboardDetails(dateRange: refDateRangeClient.IdateRange) {
		var self = this;

		self.commonClientCommand.GetDisputeDashboardDetails(dateRange, (data) => {
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

				data.DisputeDashboardGraph.forEach((item) => {
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
				var createdDataset =
					{
						dataset:
						[
							disputesCreatedDataset, ovcCreatedDataset
						]
					};

				var workedDataset =
					{
						dataset:
						[
							disputeWonDataset, disputeLostDataset, clearedDataset
						]
					};

				var ovcWorkedDataset =
					{
						dataset:
						[
							ovcWonDataset, ovcLossDataset
						]
					};

				self.disputeDashboardDataset.push(createdDataset, workedDataset, ovcWorkedDataset);
				self.disputeDashboardCategories.push({ category: dateCategory });

				self.loadDisputeDashboardGraph();
			}
		}, () => {
				self.listProgressForDisputeDashboardGraph(false);
			})
	}

	// <createDetails>
	// <id>US23630</id> <by>Vasanthakumar</by> <date>01-08-2016</date> <description>Method to fetch Dispute Worked By Team for IRManagers</description>
	// </createDetails>
	// <changeHistory>
	// <id>US23630</id> <by>Vasanthakumar</by> <date>05-08-2016</date> <description>Custom tool tip show in graph</description>
	// </changeHistory>
	public GetNumberOfDisputeWorkedbyTeamForIRManagers(dateRange: refDateRangeClient.IdateRange) {
		var self = this;

		self.commonClientCommand.GetNumberOfDisputeWorkedbyTeamForIRManagers(dateRange, (data) => {
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

				data.NumberOfDisputeWorkedPerUserForIRManagers.forEach((item) => {
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

				var disputeShortPaid =
					{
						dataset:
						[
							disputeToDisputeShortPaidDataset
						]
					};

				var disputeWorkedDataset =
					{
						dataset:
						[
							disputeWonDataset, disputeLossDataset, disputeClearedDataset
						]
					};

				var ovcWorkedDataset =
					{
						dataset:
						[
							ovcWonDataset, ovcLossDataset
						]
					};

				self.disputeWorkedForIRManagersDataset.push(disputeShortPaid, disputeWorkedDataset, ovcWorkedDataset);
				self.disputeWorkedForIRManagersCategories.push({ category: usernameCategory });


				var today = self.commonUtils.formatDate(dateRange.ToDate, 'mm/dd/yyyy');
				self.loadDisputeWorkedByTeamGraphForIRManagers(today);
			}
		}, () => {
				self.listProgressForDisputeWorkedByTeamForIRManagers(false);
			});
	}

	/* <createDetails>
	// <id>US23629</id> <by>Shreesha Adiga</by> <date>03-08-2016</date> <description>Method to fetch Dispute and requote Worked By (Logged-in) Individual User</description>
	// </createDetails>
	// <changeHistory>
	// <id>US24329</id> <by>Shreesha Adiga</by> <date>25-08-2016</date> <description>Added Requote Worked counts to the chart</description>
	// </changeHistory>
	*/
	public GetNumberOfDisputeWorkedbyIndividualUser(dateRange: refDateRangeClient.IdateRange) {
		var self = this;

		self.listProgressForDisputeWorkedByIndividualUser(true);
		self.commonClientCommand.GetDisputeWorkedDashboardDataForIndividualUser(dateRange, (data) => {
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

				data.NumberOfDisputeWorkedPerUserForLoggedInUser.forEach((item) => {
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

				var disputeShortPaid =
					{
						dataset:
						[
							disputeToDisputeShortPaidDataset
						]
					};

				var disputeWorkedDataset =
					{
						dataset:
						[
							disputeWonDataset, disputeLossDataset, disputeClearedDataset
						]
					};

				var ovcWorkedDataset =
					{
						dataset:
						[
							ovcWonDataset, ovcLossDataset
						]
					};

				// ##START: US24329
				var requoteWorkedDataset =
					{
						dataset:
						[
							requoteToClearedDataset, requoteToDisputeDataset
						]
					};

				self.disputeWorkedForIndividualUserDataset.push(disputeShortPaid, disputeWorkedDataset, ovcWorkedDataset, requoteWorkedDataset);
				// ##END: US24329
				self.disputeWorkedForIndividualUserCategories.push({ category: dateCategory });

				self.loadDisputeWorkedByIndividualUserGraph();
			}
		}, () => {
				self.listProgressForDisputeWorkedByIndividualUser(false);
			});
	}

	/*
	<createDetails>
	<id>DE21150</id> <by>Shreesha Adiga</by> <date>31-12-2016</date> <description>Load charts after the data is retrieved and not in compositionComplete</description>
	</createDetails>
	*/
	private loadUVBCreatedWorkedCharts() {
		var self = this;
		// ###START: US20267
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
					"paletteColors": "#90CAF9,#1565C0",
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

		//display doughnut chart for today's data

		if (typeof self.dashboardSummaryReportOfPastDays !== "undefined" && self.dashboardSummaryReportOfPastDays !== null) {
			self.renderPieChart(self.dashboardSummaryReportOfPastDays[0], self.dashboardSummaryReportOfPastDays[0].ChangeDateDisplay);
		}
		//##END: US19763
	}

	// <createDetails>
	// <id>US20267</id> <by>Chandan Singh Bajetha</by> <date>28-01-2016</date> <description>Acct: Allow users to Navigate to past date values on graphs</description>
	// </createDetails>
	// <changeHistory>
	// <id>US20853</id> <by>Shreesha Adiga</by> <date>01-03-2016</date> <description>Changed type to multi-series stacked chart</description>
	// </changeHistory>
	private loadManualAuditRequoteBoard() {
		var self = this;
		if (typeof self.requoteChart !== "undefined") {
			self.requoteChart.dispose();
		}
		self.requoteChart = new FusionCharts({
			type: 'msstackedcolumn2d', //US20853
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
					"paletteColors": "#8E24AA,#CE93D8,#D81B60,#F48FB1" //US20853
				},
				"categories": self.requoteCategories,
				"dataset": self.dualChartForRequote
			}
		});

		self.requoteChart.render();
	}

	// <createDetails>
	// <id>US20267</id> <by>Chandan Singh Bajetha</by> <date>28-01-2016</date> <description>Acct: Allow users to Navigate to past date values on graphs</description>
	// </createDetails>
	// <changeHistory>
	// <id>US20853</id> <by>Shreesha Adiga</by> <date>01-03-2016</date> <description>Changed type to multi-series stacked chart</description>
	// </changeHistory>
	private loadManualAuditsubOrder() {
		var self = this;

		if (typeof self.suborderChart !== "undefined") {
			self.suborderChart.dispose();
		}

		self.suborderChart = new FusionCharts({
			type: 'msstackedcolumn2d', //US20853
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
					"paletteColors": "#009688,#80CBC4,#FFEB3B,#FFF59D" //US20853
				},
				"categories": self.suborderCategories,
				"dataset": self.dualChartForSuborder
			}
		});

		self.suborderChart.render();
	}

	// <createDetails>
	// <id>US23631</id> <by>Shreesha Adiga</by> <date>27-07-2016</date> <description>Function to render the Requote Worked Graph for IR Managers</description>
	// </createDetails>
	// <changeHistory>
	// <id>DE24099</id> <by>Dhaval Tamhane</by><date>24-08-2016 </date> <description>Fix the isssue related to dates in "Dispute: Worked by Team" and "Requote: Worked by Team" graphs</description>
	// <id>DE24023</id> <by>Shreesha Adiga</by><date>25-08-2016 </date> <description>Changed the name of the chart</description>
	// </changeHistory>
	private loadRequoteWorkedGraphForIRManagers() {
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
					// ##END: US24329
				},
				"categories": self.requoteWorkedForIRManagersCategories,
				"dataset": self.requoteWorkedForIRManagersDataset
			}
		});

		self.requoteWorkedChartForIRManagers.render(); //render the chart

		self.listProgressForRequoteWorkedForIRManagers(false); // remove the progress bar
	}

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
	private loadDisputeDashboardGraph() {
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
					// ##END: DE24023
				},
				"categories": self.disputeDashboardCategories,
				"dataset": self.disputeDashboardDataset
			}
		});

		self.disputeChartForDashboard.render();

		self.listProgressForDisputeDashboardGraph(false);
	}

	// <createDetails>
	// <id>US23630</id> <by>Vasanthakumar</by> <date>01-08-2016</date> <description>Method to fetch Dispute Worked By Team for IRManagers</description>
	// </createDetails>
	// <changeHistory>
	// <id>DE24023</id> <by>Shreesha Adiga</by><date>25-08-2016 </date> <description>Changed the name of the chart</description >
	// </changeHistory>
	private loadDisputeWorkedByTeamGraphForIRManagers(dateForDisplay) {
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

		self.disputeWorkedByTeamChartForDashboard.render(); //render the chart

		self.listProgressForDisputeWorkedByTeamForIRManagers(false); // remove the progress bar
	}


	// <createDetails>
	// <id>US23629</id> <by>Shreesha Adiga</by> <date>03-08-2016</date> <description>Method to render the Dispute Worked Graph for (Logged-in) Individual User</description>
	// </createDetails>
	// <changeHistory>
	// <id>US24329</id> <by>Shreesha Adiga</by> <date>25-08-2016</date> <description>Changed the caption of the chart to include requote; Added 2 extra colors</description>
	// </changeHistory>
	private loadDisputeWorkedByIndividualUserGraph() {
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
					// ##END: US24329
				},
				"categories": self.disputeWorkedForIndividualUserCategories,
				"dataset": self.disputeWorkedForIndividualUserDataset
			}
		});

		self.disputeWorkedByIndividualUserChart.render(); //render the chart

		self.listProgressForDisputeWorkedByIndividualUser(false); // remove the progress bar
	}

	//##START: US19763
	//On click on the first chart
	public onClickOnChart(dateDisplay) {
		var self = this;

		//Year is added because new Date("29 February") returns "March 1st 2001"
		//##START: US20853
		var selectedDate = new Date(dateDisplay + " " + new Date().getFullYear());
		//##END: US20853

		//get data for clicked date
		var summaryReportObject = $.grep(self.dashboardSummaryReportOfPastDays, (item) => {
			//##START: DE23196
			return moment(item.ChangeDateDisplay).date() == selectedDate.getDate();
			//##END: DE23196
		});

		if (typeof summaryReportObject !== "undefined" && summaryReportObject != null) {
			self.renderPieChart(summaryReportObject[0], summaryReportObject[0].ChangeDateDisplay);
		}
	}

	//method to display doughnut chart
	public renderPieChart(dataForChart, dateForDisplay) {
		var self = this;

		var chartReference = FusionCharts.items["piechart-1"];

		//dispose if chart exists already
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
					"centerLabel": "$label: $value",
				},
				"data": self.numberOfPOsAttachedToSO
			},
			id: 'piechart-1'
		});

		self.uvbAttachedChart.render();
	}

	//add the data for pie chart
	public getJsonForPieChart(dataForChart) {
		var self = this;

		self.numberOfPOsAttachedToSO = [];
		self.numberOfPOsAttachedToSO.push({ label: "Made Inactive", value: dataForChart.AmountOfUVBMadeInactive });
		self.numberOfPOsAttachedToSO.push({ label: "Attached By Automation", value: dataForChart.NumberOfUVBsAttachedByAutomation });
		self.numberOfPOsAttachedToSO.push({ label: "UVB To SO", value: dataForChart.AmountOfUVBToSO });
		self.numberOfPOsAttachedToSO.push({ label: "Force Attached", value: dataForChart.AmountOfUVBAttachedToExistingSO });
		self.numberOfPOsAttachedToSO.push({ label: "SO Matching Process", value: dataForChart.AmountOfUVBattachedThroSOMP });
		self.numberOfPOsAttachedToSO.push({ label: "VB Matching Process", value: dataForChart.AmountOfUVBattachedThroVBMP });//US20314

		//If the value is zero don't show labels and values on pie chart
		$.map(self.numberOfPOsAttachedToSO, function (item) {
			return item.showValue = item.showLabel = item.value == 0 ? 0 : 1;
		});
	}
	//##END: US19763

	public onClickDownloadFile() {
		var self = this;
		//Call the dialog Box functionality to open a Popup

		var optionControlArgs: IMessageBoxOption = {
			options: undefined,
			message: '',
			title: '',
			bindingObject: null
		}

		_app.showDialog('dashboardPopUp/DashBoardPopUp', optionControlArgs, 'slideDown').then((object) => {

		});
	}

	public onClickPreviousNumberofUVBsCreated() {
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
	}

	public onclickNextNumberofUVBsCreated() {
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
	}

	public onClickPreviousNumberofManualAuditBill_RequoteBoard() {
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
	}

	public OnClickNextNumberofManualAuditBill_RequoteBoard() {
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
	}

	public onClickPreviousNumberofManualAuditBill_SubourderBoard() {
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
			self.GetNumberOfSuborderCountPerDay(dateRange)

			var today = self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy');
			if (self.commonUtils.formatDate(toDateForSBPrv, 'mm/dd/yyyy') === today) {
				self.isPreviousButtonEnableForSB(false);
			}
		}
	}

	public onClickNextNumberofManualAuditBill_SubourderBoard() {
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
	}

	// <createDetails>
	// <id>US23631</id> <by>Shreesha Adiga</by> <date>27-07-2016</date> <description>On click of Previous button on Requote Worked Graph For Managers</description>
	// </createDetails>
	private onClickPreviousRequoteWorkedIRManagersChart() {
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
	}

	// <createDetails>
	// <id>US23631</id> <by>Shreesha Adiga</by> <date>27-07-2016</date> <description>On click of Next button on Requote Worked Graph For Managers</description>
	// </createDetails>
	private onClickNextRequoteWorkedIRManagersChart() {
		var self = this;

		self.listProgressForRequoteWorkedForIRManagers(true);

		var nextDate = self.currentDateForRequoteWorkedIRManagersChart();
		nextDate.setDate(nextDate.getDate() - 1);

		var dateRange = new refDateRangeClient.Models.dateRange();
		dateRange.ToDate = nextDate;

		self.isPreviousButtonEnabledForRequoteWorkedForIRManagers(true);

		self.GetNumberOfRequoteWorkedForIRManagers(dateRange);
	}

	/// <summary>
	/// Loads the Dispute Dashboard Graph on click of Previous Button
	/// </summary>
	/// <param name="dateRange">Date Range</param>
	/// <returns>Data for Dispute Dashboard Details</returns>
	/// <createDetails>
	/// <id>US23604</id> <by>Baldev Singh Thakur</by> <date>01-08-2016</date>
	/// </createDetails>
	private onClickPreviousDipsuteDashboardGraph() {
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
	}

	/// <summary>
	/// Loads the Dispute Dashboard Graph on click of Next Button
	/// </summary>
	/// <param name="dateRange">Date Range</param>
	/// <returns>Data for Dispute Dashboard Details</returns>
	/// <createDetails>
	/// <id>US23604</id> <by>Baldev Singh Thakur</by> <date>01-08-2016</date>
	/// </createDetails>
	private onClickNextDisputeDashboardGraph() {
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
	}

	// <createDetails>
	// <id>US23630</id> <by>Vasanthakumar</by> <date>01-08-2016</date> <description>On click of Previous button on Dispute Worked Graph For Managers</description>
	// </createDetails>
	private onClickPreviousDisputeWorkedByTeamIRManagersChart() {
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
	}

	// <createDetails>
	// <id>US23630</id> <by>Vasanthakumar</by> <date>01-08-2016</date> <description>On click of Next button on Dispute Worked Graph For Managers</description>
	// </createDetails>
	private onClickNextDisputeWorkedByTeamIRManagersChart() {
		var self = this;

		self.listProgressForDisputeWorkedByTeamForIRManagers(true);

		var nextDate = self.currentDateForDisputeWorkedByTeamIRManagersChart();
		nextDate.setDate(nextDate.getDate() - 1);

		var dateRange = new refDateRangeClient.Models.dateRange();
		dateRange.ToDate = nextDate;

		self.isPreviousButtonEnabledForDisputeWorkedByTeamForIRManagers(true);

		self.GetNumberOfDisputeWorkedbyTeamForIRManagers(dateRange);
	}

	// <createDetails>
	// <id>US23629</id> <by>Shreesha Adiga</by> <date>03-08-2016</date> <description>On click of Previous button on Dispute Worked Graph For (Logged-in) Individual User</description>
	// </createDetails>
	private onClickPreviousDisputeWorkedByIndividualUserChart() {
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
	}

	// <createDetails>
	// <id>US23629</id> <by>Shreesha Adiga</by> <date>03-08-2016</date> <description>On click of Next button on Dispute Worked Graph For (Logged-in) Individual User</description>
	// </createDetails>
	private onClickNextDisputeWorkedByIndividualUserChart() {
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
	}

	public readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}

	public createCookie(name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date;
		}
		else var expires = "";
		document.cookie = name + "=" + value + expires + "; path=/";
	}

	public eraseCookie(name) {
		var self = this;
		self.createCookie(name, "", -1);
	}
}
