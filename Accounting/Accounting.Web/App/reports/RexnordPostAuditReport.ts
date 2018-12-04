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
** Rexnord Post Audit Reports View Model.
** </summary>
** <createDetails>
** <id>US13147</id><by>SANKESH</by><date>17-12-2014</date>
** </createDetails>
** <changeHistory>
** <id>DE20737</id> <by>Vasanthakumar</by> <date>26-11-2015</date><description>Enabled the grid setting saving option</description>
** </changeHistory>
*/

class RexnordPostAuditReportsViewModel {
    //#region MEMBERS

    //#region Report Container Members
    public postAuditReportContainer: _reportViewer.ReportViewerControlV2 = null;
    private boardReportRequest: refBoardReportRequestModel.Models.BoardReportRequest = null;
    listProgress: KnockoutObservable<boolean> = ko.observable(false);
    public header: _reportViewer.ReportHeaderOption = null;
    public grid: _reportViewer.ReportGridOption = null;
    public reportAction: _reportViewer.ReportAction = null;
    public reportData: KnockoutObservableArray<any> = null;
    public reportCriteria: (reportAction: _reportViewer.ReportAction) => any;
    public gridOptions: any;
    public getReportData: (reportAction: _reportViewer.ReportAction) => any;

    //#endregion

    // report client instance
    reportClient: refReportClient.ReportClient = null;

    datepickerOptions: DatepickerOptions;

    // From date filter
    fromDate: KnockoutObservable<any> = ko.observable('');

    // To Date Filter
    toDate: KnockoutObservable<any> = ko.observable('');

    // Common Utilities
    CommonUtils: CommonStatic = new Utils.Common();

    // Flag to check whether user clicked on button or not??
    isLoaded: KnockoutObservable<boolean> = ko.observable(false);

    //For Validation purpose
    errorReport: KnockoutValidationGroup;

    //#endregion

    //#region CONSTRUCTOR
    constructor() {
        var self = this;
        self.reportClient = new refReportClient.ReportClient();

        //** To set The date picker options. */
        self.datepickerOptions = {
            blockWeekend: true,
            blockPreviousDays: false,
            blockHolidaysDays: true,
            autoClose: true,
            placeBelowButton: false,
            endDate: new Date()
        };

        //#region Date Validation
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
                    //To Pickup date should not be grater then today date
                    if (new Date(self.toDate()) > (new Date(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy')))) {
                        return false;
                    } else if (self.toDate() !== undefined && self.fromDate() !== "") {
                        //To pickUp Date should be greater than from pick up date
                        if (new Date(self.fromDate()) > new Date(self.toDate()))
                            return false;
                        else
                            return true;
                        //To Pickup date should not be grater then today date
                    } else if (new Date(self.toDate()) > (new Date(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy')))) {
                        return false;
                    } else {
                        return true;
                    }
                },
                message: ApplicationMessages.Messages.ToValidToDateNotLessThenFromDate
            }
        });

        // to initialize dates
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

        //#region REPORT CONTAINER
		self.header = new _reportViewer.ReportHeaderOption();
		// ###START: DE20737
		self.header.reportHeader = " ";
		// ###END: DE20737
        self.header.reportName = "Rexnord Post Audit Report";
        self.header.preparedOn = " ";
        self.header.createdBy = " ";
        self.header.gridTitleHeader = " ";

        self.reportAction = new _reportViewer.ReportAction();
        self.grid = self.setGridOptions(self);

               //##region Export Options.
        var exportOpt = ko.observableArray([
            { exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) }]);

        self.header.reportExportOptions = new _reportViewer.ReportExportControl(exportOpt);
        self.header.reportExportOptions.getUrl = function (exp: _reportViewer.IExportOptions): string {
			return "Accounting/ExportRexnordPostAuditReport?fromDate=" + self.fromDate() + "&toDate=" + self.toDate();
        }

       	//##endregion Export Options End.
		self.reportCriteria = (reportActionObj: _reportViewer.ReportAction) => {
            self.gridOptions = reportActionObj.gridOptions;
            self.reportAction = reportActionObj;
           // if (self.isLoaded()) {
                self.getReportData(reportActionObj);
          //  }
        };

        self.getReportData = function (reportActionObj: _reportViewer.ReportAction) {
            var deferred = $.Deferred();
            var promise = deferred.promise();
            var pageNo = 0;
            pageNo = Number(self.gridOptions.pagingOptions.currentPage());
            if (pageNo > 0) {
                self.postAuditReportContainer.listProgress(true);
                self.boardReportRequest = new refBoardReportRequestModel.Models.BoardReportRequest();
                self.boardReportRequest.PageNumber = self.gridOptions.pagingOptions.currentPage();
                self.boardReportRequest.PageSize = self.gridOptions.pagingOptions.pageSize();
                self.boardReportRequest.FromDate = self.fromDate();
                self.boardReportRequest.ToDate = self.toDate();
                self.reportClient.getRexnordPostAuditReport(self.boardReportRequest, function (data) {
                    self.setPagingData(data.RexnordPostAuditReport, data.TotalRowCount, self.gridOptions.pagingOptions.pageSize());
                    self.postAuditReportContainer.listProgress(false);
                    deferred.resolve(data, reportActionObj.view);
                }, function () {
                    self.postAuditReportContainer.listProgress(false);
                        var toasterOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInSeconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        }
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ErrorOccurredWhileFetchingRexnordPostAuditReport, "error", null, toasterOptions);
                    });
            }
            return promise;
        };

        // Assign the  Post Audit Report Container grid settings
        self.postAuditReportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);
        self.postAuditReportContainer.onFilterChange = self.reportCriteria;
        self.postAuditReportContainer.ForceChange();

         //#endregion
    }

    //#endregion

    //#region INTERNAL METHODS

    //#region Report Click
    public generateReport() {
        var self = this;
        if (self.validateReport()) {
            self.isLoaded(true);
            self.gridOptions.pagingOptions.currentPage(1);
            self.getReportData(self.reportAction);
        }
        else {
            return false;
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
    //#endregion
    //#endregion

    //#region if user any numeric  date  without any format
    private convertToFromDate() {
        var self = this;
        if (self.fromDate() !== undefined) {
            if (!self.fromDate().match('/')) {
                self.fromDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.fromDate()));
            }
        }
    }

    private convertToDate() {
        var self = this;
        if (self.toDate() !== undefined) {
            if (!self.toDate().match('/') && self.toDate().length > 0) {
                self.toDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.toDate()));
            }
        }
    }
    //#endregion

    //#region Report Container Logic
    private setPagingData(data, page, pageSize) {
        var self = this;
        self.gridOptions.data(data);
        self.gridOptions.data.valueHasMutated()
		self.gridOptions.pagingOptions.totalServerItems(page);
    }

    private setGridOptions(self: RexnordPostAuditReportsViewModel): _reportViewer.ReportGridOption {
        var grOption = new _reportViewer.ReportGridOption();
        grOption.UIGridID = ko.observable("PostAuditGrid");
        grOption.data = <any> self.reportData;
        grOption.columnDefinition = self.setGridColumnDefinitions();
        grOption.enableSelectiveDisplay = true;
        grOption.useExternalSorting = false;
        grOption.showGridSearchFilter = true;
        grOption.sortedColumn = <_reportViewer.SortOrder> {
            columnName: "Debtor",
            order: "DESC"
        };
        grOption.pageSizes = [10, 25, 50, 100];
        grOption.pageSize = 10;
        grOption.totalServerItems = 0;
        grOption.currentPage = 1;
        grOption.jqueryUIDraggable = true;
        grOption.canSelectRows = true;
        grOption.selectWithCheckboxOnly = false;
        grOption.displaySelectionCheckbox = false;
        grOption.multiSelect = false;
        grOption.enablePaging = false;
		grOption.viewPortOptions = false;
		// ###START: DE20737
		grOption.enableSaveGridSettings = true;
		// ###END: DE20737
        grOption.useClientSideFilterAndSort = true;
        grOption.showColumnMenu = true;
        return grOption;
    }

     private setGridColumnDefinitions() {
        var colDefinition: Array = [];
        var self = this;

        // For BOLnumber

        colDefinition = [
            { field: 'Debtor', displayName: 'Debtor' },
            { field: 'AmountPaid', displayName: 'Amount Paid' },
            { field: 'Carrier', displayName: 'Carrier' },
            { field: 'CarrierPRO', displayName: 'Carrier PRO #' },
            { field: 'GlobalTranzBOL', displayName: 'GlobalTranz BOL #' },
            { field: 'ServiceType', displayName: 'Service Type' },
            { field: 'CheckNumber', displayName: 'Check Number' },
            { field: 'CheckDate', displayName: 'Check Date' },
            { field: 'RexnordBOL', displayName: 'Rexnord BOL #' },
            { field: 'Weight', displayName: 'Weight' },
            { field: 'OriginCompanyName', displayName: 'Origin Co. Name' },
            { field: 'OriginCity', displayName: 'Origin City' },
            { field: 'OriginState', displayName: 'Origin State' },
            { field: 'DestinationCompanyName', displayName: 'Destination Co. Name' },
            { field: 'DestinationCity', displayName: 'Destination City' },
            { field: 'DestinationState', displayName: 'Destination State' },
        ];
        return colDefinition;
    }

    //#endregion

    //#region LOAD
    private load(bindedData) {
        //** if bindedData is null then return false. */
        if (!bindedData)
            return;
    }

      //#endregion
    //#endregion

    //#region LIFE CYCLE EVENT
    // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
    public attached() {
        var self = this;
        _app.trigger('viewAttached');

        document.onkeypress = (event: KeyboardEvent) => {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode === 13) {
                //$('#btngenerateReport').focus();
                //self.generateReport();
                return false;
            }
        }
	}

    //The composition engine will execute it prior to calling the binder.
    public activate() {
        return true;
    }

    public deactivate() {
        var self = this;
        var data = {
            fromDate: self.fromDate(),
            toDate: self.toDate(),
            isLoaded: self.isLoaded(),
            pageSize: self.gridOptions.pagingOptions.pageSize(),
            currentPage: self.gridOptions.pagingOptions.currentPage()
        }
	  _app.trigger("registerMyData", data);

		self.cleanup();
    }

    //To load the registered data if any existed.
    public beforeBind() {
        var self = this

		_app.trigger("loadMyData", function (data) {
            if (data) {
                self.load(data);
            }
            else {
              }
        });
	}

	public cleanup() {
		var self = this;

		self.postAuditReportContainer.cleanup("PostAuditGrid");

		for (var prop in self) {
			if (prop !== "cleanup")
				delete self[prop];
		}
		delete self;
	}
    //#endregion
}

return RexnordPostAuditReportsViewModel;