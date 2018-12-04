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
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import _refAppShell = require('shell');
import _reportViewer = require('../templates/reportViewerControlV2');
import refEnums = require('services/models/common/Enums');

//#endregion

/*
** <summary>
** Sales Order Claim View Model.
** </summary>
** <createDetails>
** <id>US12644</id> <by>Sankesh Poojari</by> <date>09-24-2014</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by> <date></date>
** </changeHistory>
*/

export class SalesOrderClaimViewModel {
	salesOrderNoteItems: KnockoutObservableArray<ISalesOrderNotes> = ko.observableArray([]);
	claimstatus: KnockoutObservableArray<string> = ko.observableArray([]);
	selectedclaimstatus: KnockoutObservable<string> = ko.observable("");
	claimdocument: KnockoutObservableArray<ISalesOderClaimDocument> = ko.observableArray([]);
	receivedDate: KnockoutObservable<any> = ko.observable('');
	filedDate: KnockoutObservable<any> = ko.observable('');
	billofLading: KnockoutObservable<string> = ko.observable();
	carrierClaim: KnockoutObservable<string> = ko.observable();
	serviceTypeList: KnockoutObservableArray<IVendorBillStatus> = ko.observableArray([]);
	proNumber: KnockoutObservable<string> = ko.observable();
	carrier: KnockoutObservable<string> = ko.observable();
	shipper: KnockoutObservable<string> = ko.observable();
	consignee: KnockoutObservable<string> = ko.observable();
	customer: KnockoutObservable<string> = ko.observable();
	amountFiled: KnockoutObservable<number> = ko.observable();
	settledAmount: KnockoutObservable<number> = ko.observable();
	datepickerOptions: DatepickerOptions;
	CommonUtils: CommonStatic = new Utils.Common();

	//Grid Propties
	public reportContainer: _reportViewer.ReportViewerControlV2 = null;
	public header: _reportViewer.ReportHeaderOption = null;
	public grid: _reportViewer.ReportGridOption = null;
	public reportAction: _reportViewer.ReportAction = null;
	public reportData: KnockoutObservableArray<ISalesOrderNotes> = null;
	public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	public getReportData: () => void;
	public gridOptions: any;
	public reportType: number;
	salesOrderId: number;
	public modeType = ko.observable();
	// Initializes the properties of this class
	constructor() {
		var self = this;
		self.header = new _reportViewer.ReportHeaderOption();
		self.header.reportHeader = "";
		self.header.reportName = "Sales Order Claim Notes";
		self.header.gridTitleHeader = "";
		//initialize date filters
		self.reportAction = new _reportViewer.ReportAction();
		self.grid = self.setGridOptions(self);

		self.setReportCriteria = (reportActionObj: _reportViewer.ReportAction) => {
			self.gridOptions = reportActionObj.gridOptions;
			if (self.reportAction != null) {
				if ((self.modeType() != reportActionObj.filter1selectedItemId) || (self.reportAction.view != reportActionObj.view) ||
					(reportActionObj.dateFrom != self.reportAction.dateFrom) || (reportActionObj.dateTo != self.reportAction.dateTo)) {
					self.gridOptions.pagingOptions.currentPage(1);
				}
			}

			// Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
			// we don't want any data on page load so we commented getReportdata  function.
			// self.getReportData();
			this.reportAction = reportActionObj;

			if (reportActionObj.dateFrom !== null && reportActionObj.dateTo !== null) {
				// self.getReportData();
			}

			else {
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectDateTimeFrame, "info", null, toastrOptions);
			}
		};

		//Displays Date without Time Part

		self.reportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);
		self.reportContainer.showOptionalHeaderRow(false);
		self.reportContainer.OptionalHeaderRowLocation('TOP');
		self.reportContainer.onFilterChange = self.setReportCriteria;
		self.reportContainer.ForceChange();
		self.filedDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
		self.receivedDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
		//To set The date picker options
		self.datepickerOptions = {
			blockWeekend: true,
			blockPreviousDays: false,
			blockHolidaysDays: true,
			autoClose: true,
			placeBelowButton: false,
		};
	}

	//#region Internal private methods
	private setPagingData(data, grid, gridOption) {
		Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
	}

	private setGridOptions(self: SalesOrderClaimViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = false;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("salesOrderClaimGrid");
		grOption.data = <any> self.reportData;
		grOption.columnDefinition = self.setGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "noteDate",
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
		grOption.enableSaveGridSettings = false;
		grOption.useClientSideFilterAndSort = true;
		grOption.showColumnMenu = false;
		return grOption;
	}

	private setGridColumnDefinitions() {
		var colDefinition: Array = [];
		colDefinition = [
			{ field: 'EntityId', displayName: 'EntityId', sortable: false, visible: false },
			{ field: 'Id', displayName: 'Id', sortable: false, visible: false },
			{ field: 'Description', displayName: 'Description', sortable: false },
			{ field: 'NotesBy', displayName: 'Notes By', sortable: false },
			{ field: 'NotesDateShort', displayName: 'Notes Date', sortable: false }

		];
		return colDefinition;
	}
	//#endregion

	//#region Internal public Methods
	public initializeClaimDetails(data: ISaleOrderClaimContainer) {
		var self = this;
		if (data && data.SalesOrderClaimDetail !== null) {
			self.billofLading(data.SalesOrderClaimDetail.BOLNumber);
			self.carrierClaim(data.SalesOrderClaimDetail.ClaimNumber);
			self.proNumber(data.SalesOrderClaimDetail.PRONumber);
			self.carrier(data.SalesOrderClaimDetail.CarrierName);
			self.customer(data.SalesOrderClaimDetail.CompanyName);
			self.shipper(data.SalesOrderClaimDetail.ShipperName);
			self.consignee(data.SalesOrderClaimDetail.ConsigneeName);
			self.receivedDate(data.SalesOrderClaimDetail.ClaimDate);
			self.receivedDate(data.SalesOrderClaimDetail.ClaimDate ? self.CommonUtils.formatDate(data.SalesOrderClaimDetail.ClaimDate.toString(), 'mm/dd/yyyy') : '');
			self.filedDate(data.SalesOrderClaimDetail.DateFiled ? self.CommonUtils.formatDate(data.SalesOrderClaimDetail.DateFiled.toString(), 'mm/dd/yyyy') : '');
			self.amountFiled($.number((data.SalesOrderClaimDetail.AmountFiled), 2));
			self.settledAmount($.number((data.SalesOrderClaimDetail.SettledAmount), 2));
			self.claimstatus.push(data.SalesOrderClaimDetail.Status);
		}
		if (data) {
			self.setPagingData(ko.observableArray(data.SalesOrderClaimNoteDetails), self.gridOptions, self.reportAction);
		}
	}

	// this function is used to convert formatted cost with decimal(Two Place).
	public formatDecimalNumber(field) {
		var self = this;
		var costValue = field();
		if (costValue) {
			var stringParts = costValue + '';

			var isNegative = stringParts.indexOf("-") !== -1;

			var parts = stringParts.split('.');

			// take only two decimal point
			if (parts && parts.length > 2) {
				costValue = parts[0] + '.' + parts[1];
			}

			///parts.length is length after split the cost value
			///costValue length total length of textbox value
			///with in this if condition we will check is it without decimal or not
			if (parts.length === 1 && costValue && costValue.length > 8) {
				costValue = costValue.replace(/[^0-9]/g, '');
				costValue = costValue.replace(/(\d{9})(\d{2})/, "$1.$2");
				field(costValue);
			}
			if (parts.length === 1 || (parts && (parts.length === 0 || parts[1] || parts[1] === ''))) {
				if (costValue && costValue.length >= 1 && costValue.length <= 8) {
					if (/\.\d$/.test(costValue)) {
						costValue += "0";
					}
					else if (/\.$/.test(costValue)) {
						costValue += "00";
					}
					else if (!/\.\d{2}$/.test(costValue)) {
						costValue += ".00";
					}
				}
			}

			if (isNegative === true) {
				costValue = '-' + (costValue + '').split("-")[1];
			}

			field(costValue);
		}
	}

	public cleanup() {
		var self = this;

		self.reportContainer.cleanup("salesOrderClaimGrid");

		//delete self.reportContainer.onFilterChange;
		for (var property in self) {
			if (property != "cleanup")
				delete self[property];
		}
		delete self;
	}

	//#endregion
}