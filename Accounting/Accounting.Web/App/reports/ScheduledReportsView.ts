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

//#region IMPORT
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refReportClient = require('services/client/ReportClient');
import _reportViewer = require('../templates/reportViewerControlV2');
import refBoardReportRequestModel = require('services/models/report/BoardReportRequest');
import refEnums = require('services/models/common/Enums');
import refValidations = require('services/validations/Validations');
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

 class ScheduledReportsViewModel {
	//#region Members
	reportsList: KnockoutObservableArray<reportslistViewModel> = ko.observableArray([]);
	reportsNameList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	selectedreportsName: KnockoutObservable<IEnumValue> = ko.observable();
	//uploadedItems: KnockoutObservableArray<any> = ko.observableArray();
	 isOnAddEnable: KnockoutObservable<boolean> = ko.observable(false);
	 isFormDateToDate: KnockoutObservable<boolean> = ko.observable(false);
	 isPROEnable: KnockoutObservable<boolean> = ko.observable(false);
	 countRow: KnockoutObservable<number> = ko.observable(0);
	 count: number = 1;
	 // From date filter
	 fromDate: KnockoutObservable<any> = ko.observable('');
	 // To Date Filter
	 toDate: KnockoutObservable<any> = ko.observable('');
	 // Common Utilities
	 CommonUtils: CommonStatic = new Utils.Common();
	 datepickerOptions: DatepickerOptions;
	 //For Validation purpose
	 errorReport: KnockoutValidationGroup;
	 //For removing item
	 removeLineItem: (lineItem: reportslistViewModel) => void;
	 private selectLineItem: reportslistViewModel;
	 public deleteScheduleReportsItemsList: () => any;
	 //#endregion Members

	 //#region public report viewer members

	 //#endregion

	 //#region constructor
	 constructor() {
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
					 //To date shouldn't be greater than today date
					 if (new Date(self.toDate()) > (new Date(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy')))) {
						 return false;
					 } else if (self.toDate() !== undefined && self.fromDate() !== "") {
						 //To pickUp Date should be greater than from pick up date
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

		 self.selectedreportsName.subscribe(() => {
			 
			 if (self.selectedreportsName() !== undefined) {
				 //Show PRO Text box only if it is Vendor Bill Traking report and once ony
				 if (parseInt(self.selectedreportsName().toString()) === 3) {
					 self.isPROEnable(true);
				 } else {
					 self.isPROEnable(false);
				 }
				 var mod = 0;
				 if (parseInt(self.selectedreportsName().toString()) === 5
					 || parseInt(self.selectedreportsName().toString()) === 7
					 || parseInt(self.selectedreportsName().toString()) === 8
					 || parseInt(self.selectedreportsName().toString()) === 9
					 || parseInt(self.selectedreportsName().toString()) === 10) {
						 self.isFormDateToDate(true);
						 self.isPROEnable(false);
						 mod = 1;
				 } else {
					 self.isFormDateToDate(false);
					 mod = 2;
				 }

				 //Check if it is allready in list then we will not bind
				 var result = $.grep(self.reportsList(), function (e) { return e.selectedReportsID() === self.selectedreportsName(); })[0];
				 if (result !== undefined) {
					 if (result.selectedReportsID() !== undefined && result.selectedReportsID() !== null) {
						 self.isOnAddEnable(false);
						 if (result.selectedReportsID() === 3) {
							 self.isPROEnable(false);
						 } else if(mod==1){
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
		 self.removeLineItem = function (lineItem: reportslistViewModel) {

			 // Delete from the collection
			 self.selectLineItem = lineItem;
			 self.deleteScheduleReportsItemsList()
            //self.onChangesMadeInItem(true);
		 }; 

		 // for calling vendor Bill Items List
		 self.deleteScheduleReportsItemsList = () => {
			 self.reportsList.remove(self.selectLineItem);
		 }

        //#endregion
        return self;
	}

	//#endregion

	//#region Generate button event
	public onAdd() {
		var self = this;
		if (self.validateReport()) {
			self.isOnAddEnable(false);
			self.isFormDateToDate(false);
			self.isPROEnable(false);
			var result = $.grep(self.reportsNameList(), function (e) { return e.ID === self.selectedreportsName(); })[0];
			self.countRow(self.count++);
			self.reportsList.push(new reportslistViewModel(result, self.countRow()));
		}
		else {
			return false;
		}
	}

	//public onClickDownloadReports() {
	//	var self = this;
	//}

	//#endregion

	//#region Private methods
	 private convertToFromDate() {
		 var self = this;
		 if (!self.fromDate().match('/')) {
			 self.fromDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.fromDate()));
		 }
	 }

	 private convertToDate() {
		 var self = this;
		 if (!self.toDate().match('/') && self.toDate().length > 0) {
			 self.toDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.toDate()));
		 }
	 }

	 private validateReport() {
		 var self = this;
		 if (self.errorReport.errors().length != 0) {
			 self.errorReport.errors.showAllMessages();
			 return false;
		 } else {
			 return true;
		 }
	 }

	//#region if user enters numeric  date  without any format


	//#endregion

	//#endregion Private methods

	//#region LIFE CYCLE EVENT
	// Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
	public attached() {
		var self = this;
		_app.trigger('viewAttached');
	}

	//The composition engine will execute it prior to calling the binder.
	public activate() {
		return true;
	}

	public deactivate() {
		var self = this;
		return true;
	}

	//Composition Complete Event
	public compositionComplete() {
		var self = this;
		return true;
	}

	//To load the registered data if any existed.
	public beforeBind() {
		var self = this
		return true;
	}
	//#endregion
}

//return ScheduledReportsViewModel;

class reportslistViewModel {
	//#region Members
	selectedReports: KnockoutObservable<string> = ko.observable('');
	selectedReportsID: KnockoutObservable<number> = ko.observable();
	commonUtils = new Utils.Common()
	countRow: KnockoutObservable<number> = ko.observable();
	bgColor: KnockoutObservable<number> = ko.observable();
	//#endregion Members

	//#region public report viewer members

	//#endregion

	//#region constructor
	constructor(selectedValue: IEnumValue, count: number) {
		var self = this;
		//#endregion
		//self.selectedReports(self.commonUtils.getEnumValueById(refEnums.Enums.ScheduledReports, selectedValue.toString()));
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
}

return ScheduledReportsViewModel;