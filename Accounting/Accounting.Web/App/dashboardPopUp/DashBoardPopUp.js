/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/validations/Validations', 'services/client/CommonClient', 'services/client/VendorBillClient'], function(require, exports, ___router__, ___app__, __refValidations__, __refCommonClient__, __refVendorBillClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    var refValidations = __refValidations__;
    var refCommonClient = __refCommonClient__;
    var refVendorBillClient = __refVendorBillClient__;

    //#endregion
    /*
    ** <summary>
    ** </summary>
    ** <createDetails>
    ** <id></id> <by></by> <date></date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US19762</id> <by>Chandan Singh</by> <date>11/12/2015</date> <description>Create Bar Chart for Requote Board</description>
    ** <id>DE22081</id> <by>Shreesha Adiga</by> <date>07-03-2016</date> <description>Delay time out for download.</description>
    ** <id>US23631</id> <by>Shreesha Adiga</by> <date>03-08-2016</date> <description>Make the dropdown and radio buttons dynamic; Add requote worked for IR managers option</description>
    ** <id>US23604</id> <by>Baldev Singh Thakur</by> <date>03-08-2016</date> <description>Added Dispute Download Report Functionality.</description>
    ** <id>US23631</id> <by>Shreesha Adiga</by> <date>03-08-2016</date> <description>Restrict manager's report to specific users based on permission</description>
    ** <id>US25380</id> <by>Janakiram</by> <date>02-11-2016</date> <description>Limited download range to 3 months for Details Report and Allowing week ends to select</description>
    ** </changeHistory>
    */
    var DashBoardPopup = (function () {
        // ##END: US23631
        //#endregion
        //#region Constructor
        function DashBoardPopup() {
            //#region Members
            //## Holds Bill Date
            this.fromDate = ko.observable('');
            this.toDate = ko.observable('');
            this.isDownloaded = ko.observable(true);
            this.commonUtils = new Utils.Common();
            // ###START: US19762
            this.currentUser = ko.observable();
            this.isRexnord = ko.observable(false);
            // ###END: US19762
            //Common Client
            this.commonClient = new refCommonClient.Common();
            this.listProgress = ko.observable(false);
            // ##START: US23631
            this.reportTypesList = ko.observableArray([]);
            this.reportCategoryRadioList = ko.observableArray([]);
            this.selectedCategory = ko.observable('SummaryReport');
            // ###START: US23604
            this.selectedReportType = ko.observable('AuditReport');
            var self = this;

            //#region Validations
            self.fromDate = ko.observable().extend({
                required: {
                    message: 'From date is required.'
                },
                validation: {
                    validator: function () {
                        return refValidations.Validations.isValidDate(self.fromDate(), self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "BillDate");
                    },
                    message: 'Not a valid date'
                }
            });

            //#region Validations
            self.toDate = ko.observable().extend({
                required: {
                    message: 'To date is required.'
                },
                validation: [
                    {
                        validator: function () {
                            return refValidations.Validations.isValidDate(self.toDate(), self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "BillDate");
                        },
                        message: 'Not a valid date'
                    },
                    // ####START: US25380
                    {
                        validator: function () {
                            var startDate = moment(self.fromDate(), 'M/D/YYYY');
                            var endDate = moment(self.toDate(), 'M/D/YYYY');

                            var daysCount = endDate.diff(startDate, 'days');
                            if (self.selectedCategory() === 'DetailedReport' && daysCount > 90) {
                                return false;
                            } else {
                                return true;
                            }
                        },
                        message: 'Maximum Date Range allowed for Details Report is 3 months'
                    }
                ]
            });

            // ##START: US23631
            self.selectedCategory.subscribe(function (newValue) {
                if (newValue === 'ManagersReport') {
                    self.reportTypesList.removeAll();
                    self.reportTypesList.push.apply(self.reportTypesList, [
                        { Text: "Audit Report", Value: "AuditReport" }
                    ]);
                    self.selectedReportType('AuditReport');
                } else {
                    self.reportTypesList.removeAll();

                    // ###START: US23604
                    self.reportTypesList.push.apply(self.reportTypesList, [
                        { Text: "Audit Report", Value: "AuditReport" },
                        { Text: "Dispute Report", Value: "DisputeReport" },
                        { Text: "UVB Report", Value: "UVBReport" }
                    ]);
                    // ###END: US23604
                }
            });

            // ##END: US23631
            //To set The date picker options
            self.datepickerOptions = {
                // ####START: US25380
                blockWeekend: false,
                // ####END: US25380
                blockPreviousDays: false,
                blockHolidaysDays: true,
                autoClose: true,
                placeBelowButton: false,
                endDate: new Date()
            };

            //#region Error Details Object
            self.errorVendorDetail = ko.validatedObservable({
                fromDate: self.fromDate,
                toDate: self.toDate
            });

            var fromdate = new Date();
            var x = 7;
            var newFromDate = fromdate.setDate(fromdate.getDate() - x);
            self.fromDate(self.commonUtils.formatDate(newFromDate, 'mm/dd/yyyy'));
            self.toDate(self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy'));

            // ###START: US19762
            // For rexnord user we are not showing dropdown
            self.load();
            // ###END: US19762
        }
        //#endregion
        //#region Public Methods
        // ###START: US19762
        DashBoardPopup.prototype.load = function () {
            var self = this;
            if (!self.currentUser()) {
                // Get the logged in user for name for new note}
                _app.trigger("GetCurrentUserDetails", function (currentUser) {
                    self.currentUser(currentUser);
                });
            }
            if (self.currentUser().IsRexnordManager) {
                self.isRexnord(false);
            } else {
                self.isRexnord(true);
            }

            // ##START: US23631
            self.reportTypesList.removeAll();
            self.reportCategoryRadioList.removeAll();

            // ###START: US23604
            self.reportTypesList.push.apply(self.reportTypesList, [
                { Text: "Audit Report", Value: "AuditReport" },
                { Text: "Dispute Report", Value: "DisputeReport" },
                { Text: "UVB Report", Value: "UVBReport" }
            ]);

            // ###END: US23604
            self.reportCategoryRadioList.push.apply(self.reportCategoryRadioList, [
                { Text: "Summary Report", Value: "SummaryReport" },
                { Text: "Detailed Report", Value: "DetailedReport" }
            ]);

            if (self.currentUser().HasAccessToManagersReportInDashboard) {
                self.reportCategoryRadioList.push({ Text: "Manager's Report", Value: "ManagersReport" });
            }
            // ##END: US23631
        };

        // ###END: US19762
        DashBoardPopup.prototype.onDownloadClick = function () {
            var self = this;
            if (!self.validateDatePicker()) {
                self.isDownloaded(false);
                self.listProgress(true);

                var SearchModel = new refVendorBillClient.SearchModel();
                SearchModel.FromDate = self.fromDate();
                SearchModel.ToDate = self.toDate();

                // ##START: US23631
                var exportUrl = '';

                if (self.selectedReportType() === 'UVBReport') {
                    exportUrl = 'Accounting/ExportDashBoardDataInCSV/';
                } else if (self.selectedReportType() === 'AuditReport' && self.selectedCategory() === 'ManagersReport') {
                    exportUrl = 'Accounting/ExportRequoteWorkedDataForIRManagersGraph/';
                } else if (self.selectedReportType() === 'DisputeReport') {
                    exportUrl = 'Accounting/ExportDisputeDashBoardDetailsInCSV/';
                } else {
                    exportUrl = 'Accounting/ExportDashboardDataForManualAudit/';
                }

                // ###START: US23604
                var filterModel = { ExportURL: exportUrl + self.selectedCategory(), searchModel: SearchModel };

                // ###END: US23604
                // ##END: US23631
                var urldocumentViewer = "documentViewer/DownloadElasticReport";
                var ajax = new Simplex.AjaxConnection(self.getApplicationURI());

                if (filterModel) {
                    filterModel.searchModel.ExportURL = filterModel.ExportURL;
                    ajax.post(urldocumentViewer, filterModel.searchModel).done(function (message) {
                        if (message && message !== '') {
                            var downloadElasticSearchURL = self.getApplicationURI() + message;

                            ///###START: DE22081
                            var timeOutDuration = 0;
                            if (typeof Utils.Constants.DelayForFileDownload !== "undefined")
                                timeOutDuration = parseInt(Utils.Constants.DelayForFileDownload);

                            setTimeout(function () {
                                window.location.href = downloadElasticSearchURL;
                            }, timeOutDuration);
                            /// ###END: DE22081
                        }
                        self.isDownloaded(true);
                        self.listProgress(false);
                        self.closePopup(self);
                    }).fail(function (message) {
                        console.log(message);
                        self.isDownloaded(true);
                        self.listProgress(false);
                    });
                }
            }
        };

        //Validating PO To SO property}
        DashBoardPopup.prototype.validateDatePicker = function () {
            var self = this;
            if (self.errorVendorDetail.errors().length != 0) {
                self.errorVendorDetail.errors.showAllMessages();
                return true;
            } else {
                return false;
            }
        };

        DashBoardPopup.prototype.getApplicationURI = function () {
            var appURL = window.location.protocol + '//' + window.location.hostname;

            if (window.location.port != "")
                appURL += ":" + window.location.port;

            appURL += window.location.pathname;

            return (appURL);
        };

        //close popup
        DashBoardPopup.prototype.closePopup = function (dialogResult) {
            dialogResult.__dialog__.close(this, dialogResult);
            return true;
        };

        //#endregion Public Methods
        //#region Private Methods
        //#region if user any numeric  date  without any format
        DashBoardPopup.prototype.convertTofromDate = function () {
            var self = this;
            if (!self.fromDate().match('/')) {
                //self.fromDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.fromDate()));
            }
        };

        //#region if user any numeric  date  without any format
        DashBoardPopup.prototype.convertToToDate = function () {
            var self = this;
            if (!self.toDate().match('/')) {
                //self.toDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.toDate()));
            }
        };

        //#endregion
        //#region Life Cycle Event
        //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
        DashBoardPopup.prototype.beforeBind = function () {
            var self = this;
            // self.load();
        };

        DashBoardPopup.prototype.compositionComplete = function (view, parent) {
        };

        // Activate the view and bind the selected data from the main view
        DashBoardPopup.prototype.activate = function () {
        };
        return DashBoardPopup;
    })();

    return DashBoardPopup;
});
