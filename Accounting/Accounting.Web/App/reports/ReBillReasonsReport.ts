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
import _reportViewer = require('../templates/reportViewerControlV3');
import refBoardReportRequestModel = require('services/models/report/BoardReportRequest');
import refEnums = require('services/models/common/Enums');
import refValidations = require('services/validations/Validations');
import refCarrierSearchModel = require('services/models/common/searchVendorName');
import refCarrierSearchControl = require('templates/searchVendorNameControl');
import refCustomerSearchControl = require('templates/searchCustomerAutoComplete');
import refCustomerSearchModel = require('services/models/common/searchCustomerName');
import refAgentNameSearchControl = require('purchaseOrder/purchaseOrderToSalesOrder/searchAgentNameControl');
import refUserSearchControl = require('templates/searchUserAutoComplete');
import refUserNameSearch = require('services/models/common/searchUserName');
import refVendorBillClient = require('services/client/VendorBillClient');
//#endregion

/*
** <summary>
** Report Re Bill Reasons View Model.
** </summary>
** <createDetails>
** <id>US12804</id><by>SATISH</by><date>12-11-2014</date>
** </createDetails>
** <changeHistory>
** <id>DE20289</id> <by>Shreesha Adiga</by> <date>09-10-2015</date><description>Added validations to Date fields</description>
** <id>DE20737</id> <by>Vasanthakumar</by> <date>26-11-2015</date><description>Enabled the grid setting saving option</description>
** <id>US20647</id> <by>Chandan Singh Bajetha</by> <date>17-02-2016</date><description>Acct: Implement Search on all Reports</description>
** <id>US23370</id> <by>Dhaval Tamhane</by> <date>28-07-2016</date><description>Updates related to elastic search.</description>
** <id>US23608</id> <by>Dhaval Tamhane</by> <date>05-08-2016</date><description>Added new fields.</description>
** <id>US26009</id> <by>Janakiram</by> <date>12-09-2016</date> <description>Change Data view and download feature for ReBill Reason Report</description>
** <id>US26560</id> <by>Baldev Singh Thakur</by> <date>15-02-2017</date> <description>Added logic for adding dropdown search filter.</description>
** </changeHistory>
*/

class ReportsRebillReasonsViewModel {
	//#region MEMBERS

	//#region Report Container Members
	// ###START: US26009
	public RebillReasonsReportContainer: _reportViewer.ReportViewerControlV3 = null;
	// ###END: US26009
	public header: _reportViewer.ReportHeaderOption = null;
	public grid: _reportViewer.ReportGridOption = null;
	public reportAction: _reportViewer.ReportAction = null;
	public reportData: KnockoutObservableArray<any> = null;
	public reportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	public gridOptions: any;
	public getReportData: (reportAction: _reportViewer.ReportAction) => any;
	// ###START: US23370
	public modeType = ko.observable();
	sortCol: KnockoutObservable<string> = ko.observable('');
	sorttype: KnockoutObservable<string> = ko.observable('');
	// ###END: US23370
	//#endregion

	// request parameter instance
	boardReportRequest: refBoardReportRequestModel.Models.BoardReportRequest = null;

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

	// search text through grid filter
	searchText: KnockoutObservable<string>;

	// ###START: US26560
	selectionChanged: any

	rebillReasonsSearchColumnsList: KnockoutObservableArray<IKeyValue> = ko.observableArray([]);
	selectedSearchColumn: KnockoutObservable<IKeyValue> = ko.observable();

	searchColumn: string;

	// ###END: US26560
	//#endregion

	//#region CONSTRUCTOR
	constructor() {
		var self = this;

		self.searchText = ko.observable("");

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
					// ###START: DE20289
					if (!refValidations.Validations.isValidDate(self.fromDate(), self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "BillDate"))
						return false;
					// ###END: DE20289
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
					// ###START: DE20289
					if (!refValidations.Validations.isValidDate(self.toDate(), self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "BillDate"))
						return false;
					// ###END: DE20289
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
				message: ApplicationMessages.Messages.NotAValidDate
			}
		});

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
		self.header.reportName = "Re Bill Reasons Report";
		self.header.preparedOn = " ";
		self.header.createdBy = " ";
		self.header.gridTitleHeader = " ";

		self.reportClient = new refReportClient.ReportClient();

		self.reportAction = new _reportViewer.ReportAction();
		self.grid = self.setGridOptions(self);

		//##region Export Options.
		var exportOpt = ko.observableArray([
			{ exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
			{ exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) }]);

		self.header.reportExportOptions = new _reportViewer.ReportExportControl(exportOpt);

		// ###START: US26009
		self.header.reportExportOptions.getUrl = function (exp: _reportViewer.IExportOptions, event?: Event): JQueryPromise<any> {
			var deferred = $.Deferred(),
				promise = deferred.promise();

			if (self.gridOptions.pagingOptions.totalServerItems() == 0) {
				deferred.resolve("No Data");
				return promise;
			}

			var today = new Date();
			var currentTimestamp = moment(today).format("MM-DD-YYYY, HH:mm").toString();
			var visibleColumnList = self.RebillReasonsReportContainer.getVisibleColumns('RebillReasonsGrid', event.currentTarget);
			var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: null };
			var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.TransactionSearchBill, IsFilterApplied: self.RebillReasonsReportContainer.reportColumnFilter.isFilterApply, GridSearchText: null, PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype() };
			var urlString = "Accounting/ExportReBillReasonsReportInExcel";
			var deferredData: IExportJQueryPromise = {
				searchModel: JSON.stringify({
					PageSize: exp.exportType === 1 ? 2000 : self.gridOptions.pagingOptions.totalServerItems(),
					PageNumber: 1,
					ExportTypeParam: _reportViewer.ExportOptions[exp.exportType],
					FromDate: self.fromDate(),
					ToDate: self.toDate(),
					SearchValue: self.searchText().trim(),
					SortOrder: self.sorttype(),
					SortCol: self.sortCol(),
					SearchFilterItems: null,
					SearchFilterModel: filterDataToSave,
					CurrentTimestamp: currentTimestamp,
					VisibleColList: visibleColumnList
				}),
				componentUrl: urlString,
				fileName: 'Rebill Reason Report'
			};

			deferred.resolve(deferredData);
			return promise;
		}
		// ###END: US26009

		//##endregion Export Options End.
		self.reportCriteria = (reportActionObj: _reportViewer.ReportAction) => {
			// ###START: US23370
			if ((reportActionObj != undefined || reportActionObj != null) && (reportActionObj.gridOptions != undefined || reportActionObj.gridOptions != null) && (refSystem.isObject(reportActionObj.gridOptions.sortInfo())) && (reportActionObj.gridOptions.sortInfo().column != undefined || reportActionObj.gridOptions.sortInfo().column != null) && (reportActionObj.gridOptions.sortInfo().column.field != undefined || reportActionObj.gridOptions.sortInfo().column.field != null)) {
				if (reportActionObj.gridOptions.sortInfo().column.field === 'PickupDateDisplay') {
					self.sortCol("PickupDate");
				}
				// ###START: US23608
				else if (reportActionObj.gridOptions.sortInfo().column.field === 'DeliveryDateDisplay') {
					self.sortCol("DeliveryDate");
				}
				// ###END: US23608

				self.sorttype(reportActionObj.gridOptions.sortInfo().direction);
			}
			else {
				self.sortCol("BOLNumber");
				self.sorttype("asc");
			}

			if (reportActionObj.filter1selectedItemId == undefined || reportActionObj.filter1selectedItemId == 0) {
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectModeFromTheList, "info", null, toastrOptions);

				self.RebillReasonsReportContainer.listProgress(false);
				self.RebillReasonsReportContainer.selectedFilter1Item(self.modeType());
			}
			else {
				self.gridOptions = reportActionObj.gridOptions;

				// Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
				// we don't want any data on page load so we commented getReportdata  function.
				// Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
				if (self.modeType() != reportActionObj.filter1selectedItemId) {
					self.modeType(reportActionObj.filter1selectedItemId);
					self.RebillReasonsReportContainer.columnDefinition(self.setGridColumnDefinitions());
					self.RebillReasonsReportContainer.columnDefinition
					self.rebillReasonsSearchColumnsList.removeAll();
					// ###START: US26560
					self.RebillReasonsReportContainer.columnDefinition().forEach((items) => {
						var item = {
							Key: items.field,
							Value: items.displayName
						};

						if (items != undefined && items.displayName != undefined && items.field != undefined) {
							if (items.field === 'PickupDateDisplay') {								
								item.Key = "PickupDate";
							}
							else if (items.field === 'DeliveryDateDisplay') {
								item.Key = "DeliveryDate";
							}
							else {
								item.Key = items.field;
							}
							//self.selectedSearchColumn(item);
							if (items.field !== 'ReasonForRebill') {
								self.rebillReasonsSearchColumnsList.push(item);
							}
						}					
					});
					// ###END: US26560
				}

				self.reportAction = reportActionObj;
				if (self.RebillReasonsReportContainer.reportColumnFilter.isFilterApply || self.RebillReasonsReportContainer.isPaginationChanged || self.RebillReasonsReportContainer.isSortingChanged) {
					if (self.isLoaded()) {
						self.getReportData(self.reportAction);
						self.RebillReasonsReportContainer.isPaginationChanged = false;
						self.RebillReasonsReportContainer.isSortingChanged = false;
					}
				}
			}
			// ###END: US23370
		};

		self.getReportData = function (reportActionObj: _reportViewer.ReportAction) {
			var deferred = $.Deferred();
			var promise = deferred.promise();
			var pageno = 0;
			// List View
			pageno = Number(self.gridOptions.pagingOptions.currentPage());
			if (pageno > 0) {
				self.RebillReasonsReportContainer.listProgress(true);

				self.boardReportRequest = new refBoardReportRequestModel.Models.BoardReportRequest();
				self.boardReportRequest.PageNumber = self.gridOptions.pagingOptions.currentPage();
				self.boardReportRequest.PageSize = self.gridOptions.pagingOptions.pageSize();
				self.boardReportRequest.FromDate = self.fromDate();
				self.boardReportRequest.ToDate = self.toDate();
				// ###START: US20647
				self.boardReportRequest.GridSearchText = self.searchText().trim();
				// ###END: US20647

				// ###START: US26560
				self.boardReportRequest.SearchColumn = self.selectedSearchColumn() ? self.selectedSearchColumn().Key : "";

				// ###END: US26560
				self.reportClient.getRebillReasonsReport(self.boardReportRequest,
					function (data) {
						self.setPagingData(data.range, data.TotalCount, self.gridOptions.pagingOptions.pageSize());
						self.RebillReasonsReportContainer.listProgress(false);

						deferred.resolve(data, reportActionObj.view);
						self.RebillReasonsReportContainer.invokeHighlight(self.searchText());
					},
					function () {
						self.RebillReasonsReportContainer.listProgress(false);
					});
			}

			return promise;
		};

		// Assign the Sales Order grid settings
		// ###START: US26009
		self.RebillReasonsReportContainer = new _reportViewer.ReportViewerControlV3(self.header, self.grid);

		// ###END: US26009
		self.RebillReasonsReportContainer.onFilterChange = self.reportCriteria;
		self.RebillReasonsReportContainer.ForceChange();
		//#endregion

		// redirects to sales order details page
		self.RebillReasonsReportContainer.onBolNumberClick = function (shipmentObj) {
			var salesOrderId = shipmentObj.ShipmentId;
			_app.trigger("openSalesOrder", salesOrderId, shipmentObj.BOLNumber, (callback) => {
				if (!callback) {
					return;
				}
			});
		}

        // redirects to Vendor Bill Details details page
        self.RebillReasonsReportContainer.onProNumberClick = function (shipmentObj) {
			var vendorBillId = shipmentObj.VendorBillId;
			_app.trigger("openVendorBill", vendorBillId, shipmentObj.ProNumber, (callback) => {
				if (!callback) {
					return;
				}
			});
		}

		//for search filter
        self.RebillReasonsReportContainer.onSearchTextChange = function (reportViewer, newSearchValue) {
			if (newSearchValue.length >= 3 || newSearchValue.length == 0) {
				// ###START: US20647
				var data: Array<IBoardReportRequest> = new Array<refBoardReportRequestModel.Models.BoardReportRequest>();
				// ###START: US26560
				var searchString = newSearchValue;

				if (newSearchValue.length == 0) {
					self.selectedSearchColumn(undefined);
				}

				// ###END: US26560
				//to blank the grid data
				self.setPagingData(data, 0, self.gridOptions.pagingOptions.pageSize());
				self.searchText(searchString.trim());

				self.getReportData(self.reportAction);
				self.gridOptions.pagingOptions.currentPage(1);
				// ###END: US20647
			}
		};

		// ###START: US26560
		self.RebillReasonsReportContainer.isEnable(false);

		self.selectedSearchColumn.subscribe((newValue) => {
			if (typeof newValue !== "undefined" && typeof newValue !== "") {
				self.RebillReasonsReportContainer.isEnable(true);
			} else {
				self.RebillReasonsReportContainer.filterOptions.filterText('');
				self.RebillReasonsReportContainer.isEnable(false);
			}
		});

		// ###END: US26560
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

	//#region if user any numeric  date  without any format
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
	//#endregion

	//#region Report Container Logic
	private setPagingData(data, page, pageSize) {
		var self = this;
		self.gridOptions.data(data);
		self.gridOptions.data.valueHasMutated()
		self.gridOptions.pagingOptions.totalServerItems(page);
	}

	private setGridOptions(self: ReportsRebillReasonsViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.UIGridID = ko.observable("RebillReasonsGrid");
		grOption.data = <any> self.reportData;
		grOption.columnDefinition = self.setGridColumnDefinitions();
		grOption.enableSelectiveDisplay = true;
		grOption.useExternalSorting = false;
		grOption.showGridSearchFilter = true;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "BOLNumber",
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
		var bolCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'BOLNumber\'], click: function() { $userViewModel.onBolNumberClick($parent.entity) }" />';
		var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'ProNumber\'], click: function() { $userViewModel.onProNumberClick($parent.entity) }" />';
		colDefinition = [
			{ field: 'BOLNumber', displayName: 'BOL#', width: 90, cellTemplate: bolCellTemplate, isRemovable: false },
			{ field: 'ProNumber', displayName: 'PRO#', width: 90, cellTemplate: proCellTemplate, isRemovable: false },
			{ field: 'PickupDateDisplay', displayName: 'Pickup Date', width: 110 },
			{ field: 'CompanyName', displayName: 'Company Name', width: 120 },
			{ field: 'EstimatedCost', displayName: 'Estimated Cost', width: 80, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
			{ field: 'ActualCost', displayName: 'Actual Cost', width: 80, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
			{ field: 'CostDifference', displayName: 'Cost Difference', width: 80, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
			{ field: 'EstimatedRevenue', displayName: 'Estimated Revenue', width: 80, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
			{ field: 'ActualRevenue', displayName: 'Actual Revenue', width: 80, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
			{ field: 'FinalRevenue', displayName: 'Revenue Difference', width: 80, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
			{ field: 'Carrier', displayName: 'Carrier', width: 180 },
			{ field: 'ReasonForRebill', displayName: 'Reason For Rebill', width: 185 },
			// ###START: US23608
			{ field: 'OriginZip', displayName: 'Origin Zip', width: 90 },
			{ field: 'DestinationZip', displayName: 'Destination Zip', width: 90 },
			{ field: 'OriginAddress', displayName: 'Origin Address', width: 150 },
			{ field: 'DestinationAddress', displayName: 'Destination Address', width: 150 },
			{ field: 'ShipperName', displayName: 'Shipper Name', width: 120 },
			{ field: 'ConsigneeName', displayName: 'Consignee Name', width: 120 },
			{ field: 'DeliveryDateDisplay', displayName: 'Delivery Date', width: 110 }
			// ###END: US23608
		];
		return colDefinition;
	}

	//#endregion

	//#region LOAD
	private load(bindedData) {
		//** if bindedData is null then return false. */
		if (!bindedData)
			return;

		var self = this;
		self.fromDate(bindedData.fromDate);
		self.toDate(bindedData.toDate);
		self.isLoaded(bindedData.isLoaded);

		if (refSystem.isObject(self.gridOptions)) {
			self.gridOptions.pagingOptions.pageSize(bindedData.pageSize);
			self.gridOptions.pagingOptions.currentPage(bindedData.currentPage);
			self.getReportData(self.reportAction);
		}
	}

	private getRebillReasonCodes() {
		var self = this;
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
				$('#btngenerateReport').focus();
				self.generateReport();
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
				self.getRebillReasonCodes();
			}
		});
	}

	public cleanup() {
		var self = this;

		self.RebillReasonsReportContainer.cleanup("RebillReasonsGrid");

		for (var prop in self) {
			if (prop !== "cleanup")
				delete self[prop];
		}
		delete self;
	}
	//#endregion
}

return ReportsRebillReasonsViewModel;