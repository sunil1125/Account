/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region REFERENCES
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../services/models/TypeDefs/Report.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'services/models/common/Enums', 'services/validations/Validations'], function(require, exports, ___router__, ___app__, __refSystem__, __refEnums__, __refValidations__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    
    
    var refEnums = __refEnums__;
    var refValidations = __refValidations__;

    //#endregion
    /*
    ** <summary>
    ** Scheduled Reports View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US15361/US15362</id> <by>Chandan Singh Bajetha</by> <date>26th Feb 2015</date>}
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var ScheduledReportsViewModel = (function () {
        //#endregion Members
        //#region public report viewer members
        //#endregion
        //#region constructor
        function ScheduledReportsViewModel() {
            //#region Members
            this.reportsList = ko.observableArray([]);
            this.reportsNameList = ko.observableArray([]);
            this.selectedreportsName = ko.observable();
            //uploadedItems: KnockoutObservableArray<any> = ko.observableArray();
            this.isOnAddEnable = ko.observable(false);
            this.isFormDateToDate = ko.observable(false);
            this.isPROEnable = ko.observable(false);
            this.countRow = ko.observable(0);
            this.count = 1;
            // From date filter
            this.fromDate = ko.observable('');
            // To Date Filter
            this.toDate = ko.observable('');
            // Common Utilities
            this.CommonUtils = new Utils.Common();
            var self = this;

            //#endregion
            //Set Datepicker Options
            self.datepickerOptions = {
                blockWeekend: true,
                blockHolidaysDays: true,
                blockPreviousDays: false,
                autoClose: true,
                placeBelowButton: false,
                endDate: new Date()
            };

            if (refSystem.isObject(refEnums.Enums.ScheduledReports)) {
                self.reportsNameList.removeAll();
                for (var item in refEnums.Enums.ScheduledReports) {
                    self.reportsNameList.push(refEnums.Enums.ScheduledReports[item]);
                }
            }

            //From PickUp Date should not be grater then Today Date and required
            self.fromDate = ko.observable().extend({
                required: {
                    message: ApplicationMessages.Messages.ValidFromDateRequired
                },
                validation: {
                    validator: function () {
                        if (self.fromDate() !== "" || self.fromDate() !== undefined) {
                            if ((new Date(self.fromDate())) > new Date(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy')))
                                return false;
else
                                return true;
                        } else {
                            return true;
                        }
                    },
                    message: ApplicationMessages.Messages.NotAValidDate
                }
            });

            //To Date Should not be grater then today date and not be less then from date and required
            self.toDate = ko.observable().extend({
                required: {
                    message: ApplicationMessages.Messages.ValidToDateRequired
                },
                validation: {
                    validator: function () {
                        if (new Date(self.toDate()) > (new Date(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy')))) {
                            return false;
                        } else if (self.toDate() !== undefined && self.fromDate() !== "") {
                            if (new Date(self.fromDate()) > new Date(self.toDate()))
                                return false;
else
                                return true;
                        } else {
                            return true;
                        }
                    },
                    message: ApplicationMessages.Messages.ToValidToDateNotLessThenFromDate
                }
            });

            //To set the from date by default to previous 3 months from current date
            var fromdate = new Date();
            var x = 90;
            var newFromDate = fromdate.setDate(fromdate.getDate() - x);
            self.fromDate(self.CommonUtils.formatDate(newFromDate, 'mm/dd/yyyy'));
            self.toDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));

            //#region Error Details Object
            self.errorReport = ko.validatedObservable({
                fromDate: self.fromDate,
                toDate: self.toDate
            });

            self.selectedreportsName.subscribe(function () {
                if (self.selectedreportsName() !== undefined) {
                    if (parseInt(self.selectedreportsName().toString()) === 3) {
                        self.isPROEnable(true);
                    } else {
                        self.isPROEnable(false);
                    }
                    var mod = 0;
                    if (parseInt(self.selectedreportsName().toString()) === 5 || parseInt(self.selectedreportsName().toString()) === 7 || parseInt(self.selectedreportsName().toString()) === 8 || parseInt(self.selectedreportsName().toString()) === 9 || parseInt(self.selectedreportsName().toString()) === 10) {
                        self.isFormDateToDate(true);
                        self.isPROEnable(false);
                        mod = 1;
                    } else {
                        self.isFormDateToDate(false);
                        mod = 2;
                    }

                    //Check if it is allready in list then we will not bind
                    var result = $.grep(self.reportsList(), function (e) {
                        return e.selectedReportsID() === self.selectedreportsName();
                    })[0];
                    if (result !== undefined) {
                        if (result.selectedReportsID() !== undefined && result.selectedReportsID() !== null) {
                            self.isOnAddEnable(false);
                            if (result.selectedReportsID() === 3) {
                                self.isPROEnable(false);
                            } else if (mod == 1) {
                                self.isFormDateToDate(false);
                            }
                        } else {
                            self.isOnAddEnable(true);
                        }
                    } else {
                        self.isOnAddEnable(true);
                    }
                    //self.isOnAddEnable(true);
                } else if (self.selectedreportsName() === undefined) {
                    self.isOnAddEnable(false);
                    self.isPROEnable(false);
                }
            });

            //Removing line when click on delete image
            self.removeLineItem = function (lineItem) {
                // Delete from the collection
                self.selectLineItem = lineItem;
                self.deleteScheduleReportsItemsList();
                //self.onChangesMadeInItem(true);
            };

            // for calling vendor Bill Items List
            self.deleteScheduleReportsItemsList = function () {
                self.reportsList.remove(self.selectLineItem);
            };

            //#endregion
            return self;
        }
        //#endregion
        //#region Generate button event
        ScheduledReportsViewModel.prototype.onAdd = function () {
            var self = this;
            if (self.validateReport()) {
                self.isOnAddEnable(false);
                self.isFormDateToDate(false);
                self.isPROEnable(false);
                var result = $.grep(self.reportsNameList(), function (e) {
                    return e.ID === self.selectedreportsName();
                })[0];
                self.countRow(self.count++);
                self.reportsList.push(new reportslistViewModel(result, self.countRow()));
            } else {
                return false;
            }
        };

        //public onClickDownloadReports() {
        //	var self = this;
        //}
        //#endregion
        //#region Private methods
        ScheduledReportsViewModel.prototype.convertToFromDate = function () {
            var self = this;
            if (!self.fromDate().match('/')) {
                self.fromDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.fromDate()));
            }
        };

        ScheduledReportsViewModel.prototype.convertToDate = function () {
            var self = this;
            if (!self.toDate().match('/') && self.toDate().length > 0) {
                self.toDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.toDate()));
            }
        };

        ScheduledReportsViewModel.prototype.validateReport = function () {
            var self = this;
            if (self.errorReport.errors().length != 0) {
                self.errorReport.errors.showAllMessages();
                return false;
            } else {
                return true;
            }
        };

        //#region if user enters numeric  date  without any format
        //#endregion
        //#endregion Private methods
        //#region LIFE CYCLE EVENT
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        ScheduledReportsViewModel.prototype.attached = function () {
            var self = this;
            _app.trigger('viewAttached');
        };

        //The composition engine will execute it prior to calling the binder.
        ScheduledReportsViewModel.prototype.activate = function () {
            return true;
        };

        ScheduledReportsViewModel.prototype.deactivate = function () {
            var self = this;
            return true;
        };

        //Composition Complete Event
        ScheduledReportsViewModel.prototype.compositionComplete = function () {
            var self = this;
            return true;
        };

        //To load the registered data if any existed.
        ScheduledReportsViewModel.prototype.beforeBind = function () {
            var self = this;
            return true;
        };
        return ScheduledReportsViewModel;
    })();

    //return ScheduledReportsViewModel;
    var reportslistViewModel = (function () {
        //#endregion Members
        //#region public report viewer members
        //#endregion
        //#region constructor
        function reportslistViewModel(selectedValue, count) {
            //#region Members
            this.selectedReports = ko.observable('');
            this.selectedReportsID = ko.observable();
            this.commonUtils = new Utils.Common();
            this.countRow = ko.observable();
            this.bgColor = ko.observable();
            var self = this;

            if (selectedValue !== undefined) {
                self.selectedReports(selectedValue.Value);
                self.selectedReportsID(selectedValue.ID);
                self.countRow(count);
            }
            if ((count % 2) == 0) {
                self.bgColor(0);
            } else {
                self.bgColor(1);
            }

            //#endregion
            return self;
        }
        return reportslistViewModel;
    })();

    return ScheduledReportsViewModel;
});
