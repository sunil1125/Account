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
/// <reference path="../services/models/TypeDefs/Report.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refReportClient = require('services/client/ReportClient');
import _reportViewer = require('../templates/reportViewerControlV2');
import refBoardReportRequestModel = require('services/models/report/BoardReportRequest');
import refEnums = require('services/models/common/Enums');
import refVendorBillClient = require('services/client/VendorBillClient');
import _refPurchaseOrderSearchFilterModel = require('services/models/purchaseOrder/PurchaseOrderSearchFilter');

//#endregion

/*
** <summary>
** Report Vendor Bill tracking report View Model.
** </summary>
** <createDetails>
** <id>US8214</id> <by>ACHAL RASTOGI</by> <date>08-21-2014</date>
** </createDetails>
** <changeHistory>
** <id>DE20986</id> <by>Shreesha Adiga</by> <date>14-12-2015</date><description>Added validation to pronumber field</description>
** <id>US19722</id> <by>Shreesha Adiga</by> <date>29-12-2015</date> <description>If EDI Data redirect to EDI details page </description>
** <id>DE21709</id> <by>Shreesha Adiga</by> <date>11-02-2016</date> <description>Removed the 7999 character limit of input </description>
** <id>US20913</id> <by>Baldev Singh Thakur</by> <date>25-02-2016</date> <description>Reading data for VB tracking report from .csv</description>
** <id>US20913</id> <by>Shreesha Adiga</by> <date>03-03-2016</date> <description>Changes to upload functionality; Persistecy during tab switch</description>
** </changeHistory>
*/
class ReportsVendorBillTrackingReportViewModel {
	//#region Members
	reportClient: refReportClient.ReportClient = null;
	listProgress: KnockoutObservable<boolean> = ko.observable(false);
	vendorName: KnockoutObservable<string> = ko.observable('');
	proNumber: KnockoutObservable<string> = ko.observable('');
	reportClick: KnockoutObservable<boolean> = ko.observable(false);
	// Utility class object
	CommonUtils: CommonStatic = new Utils.Common();
	errorGroup: KnockoutValidationGroup; //DE20986

	//#region public report viewer members
	public reportContainer: _reportViewer.ReportViewerControlV2 = null;
	public headerOptions: _reportViewer.ReportHeaderOption = null;
	public grid: _reportViewer.ReportGridOption = null;
	public reportAction: _reportViewer.ReportAction = null;
	public reportData: KnockoutObservableArray<IVendorBillTrackingReport> = null;
	public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	public getReportData: (reportAction: _reportViewer.ReportAction) => any;
	public gridOptions: any;
	public reportType: number;
	public modeType = ko.observable();
	private boardReportRequest: refBoardReportRequestModel.Models.BoardReportRequest = null;
	searchFilterItems: Array<IPurchaseOrderSearchFilter> = new Array<_refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter>();
	//#endregion
	//#endregion

	// ###START: US20913
	//For removing Attached Item
	uploadDocument: (obj, event: Event) => void;
	uploadFileContent: string;
	uploadedFileName: KnockoutObservable<string> = ko.observable();
	uploadedItem: any;
	enableUploadButton: KnockoutComputed<boolean>;
	//To disable Upload Button after click once on Upload
	notDisableUploadButton: KnockoutObservable<boolean> = ko.observable(false);
	uploadData: Function;
	disableValidation: KnockoutObservable<boolean> = ko.observable(false);
	// ###END: US20913

	//#region Constructor
	constructor() {
		var self = this;
		self.headerOptions = new _reportViewer.ReportHeaderOption();
		self.headerOptions.reportHeader = " ";
		self.headerOptions.reportName = "Vendor Bill Tracking Report";
		self.headerOptions.gridTitleHeader = " ";
		self.reportAction = new _reportViewer.ReportAction();
		self.grid = self.setGridOptions(self);
		self.reportClient = new refReportClient.ReportClient();

		//## Region Export Options.
		var exportOpt = ko.observableArray([
			{ exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
			{ exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) }]);

		self.headerOptions.reportExportOptions = new _reportViewer.ReportExportControl(exportOpt);
		// To assign PRO number and vendor Name
		self.proNumber(self.proNumber() !== "" ? self.proNumber() : '');
		self.vendorName(self.vendorName() !== "" ? self.vendorName() : '');
		if (self.proNumber().toString().length > 0) {
			self.boardReportRequest.ProNumber = self.proNumber();
		}
		if (self.vendorName().toString().length > 0) {
			self.boardReportRequest.VendorName = self.vendorName();
		}

		self.headerOptions.reportExportOptions.getUrl = function (exp: _reportViewer.IExportOptions): any {
			var searchModel = new refVendorBillClient.SearchModel();

			if (self.uploadedItem != null && self.proNumber() != "") {
				//self.uploadedItem = null;
				self.uploadedFileName("");
				self.uploadFileContent = null;
				self.notDisableUploadButton(false);
			}

			searchModel.SearchValue = '';
			searchModel.SortOrder = '';
			searchModel.SortCol = '';
			searchModel.PageNumber = 1;
			searchModel.PageSize = exp.exportType === 1 ? 2000 : self.gridOptions.pagingOptions.totalServerItems();
			searchModel.SearchFilterItems = self.searchFilterItems;
			searchModel.GridViewId = 0;
			searchModel.VendorName = self.vendorName();
			searchModel.ProNumber = self.proNumber();
			searchModel.ExportType = exp.exportType;
			searchModel.UploadedItem = self.uploadedItem;

			var model = { ExportURL: "Accounting/ExportVendorBillTrackingReportInExcel", FilterModel: searchModel };
			return model;
		}
		//## Region Export Options End.

		//##START: DE20986
		self.proNumber.extend({
			required: {
				message: "Pro Number is required",
				onlyIf: () => {
					return (!self.disableValidation());
				}
			}
		});

		self.errorGroup = ko.validatedObservable({
			proNumber: self.proNumber
		});
		//##END: DE20986

		// ###START:US20913
		self.uploadData = function (reportActionObj: _reportViewer.ReportAction) {
			var deferred = $.Deferred();
			var promise = deferred.promise();
			self.reportContainer.listProgress(true);
			self.notDisableUploadButton(false);
			self.disableValidation(true);

			if (self.proNumber() != "") {
				self.proNumber("");
			}

			self.reportClick(true);
			var successCallBack = (data) => {

				if (typeof data.ErrorMessages !== "undefined" && data.ErrorMessages != null && data.ErrorMessages.length > 0) {
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}

					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, data.ErrorMessages[0], "error", null, toastrOptions);
					self.reportContainer.listProgress(false);
					return;
				}

				self.setPagingData(data.VendorBillTrackingReports, data.TotalRowCount, self.gridOptions.pagingOptions.pageSize());
				self.reportContainer.listProgress(false);
				self.notDisableUploadButton(true);
				deferred.resolve(data, reportActionObj.view);
			},
				faliureCallBack = (message) => {
					self.reportContainer.listProgress(false);

					return true;
				};

			self.reportClient.getVendorBillTrackingReportFromCSV(self.uploadedItem, successCallBack, faliureCallBack);
		};
		// ###END:US20913

		self.setReportCriteria = (reportActionObj: _reportViewer.ReportAction) => {
			if (reportActionObj.filter1selectedItemId == undefined || reportActionObj.filter1selectedItemId == 0) {
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.PleaseSelectModeFromTheList, "Success", null, toastrOptions);

				self.reportContainer.listProgress(false);
				self.reportContainer.selectedFilter1Item(self.modeType());
			}
			else {
				self.gridOptions = reportActionObj.gridOptions;

				// Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
				// we don't want any data on page load so we commented getReportdata  function.
				// Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
				if (self.modeType() != reportActionObj.filter1selectedItemId) {
					self.modeType(reportActionObj.filter1selectedItemId);
					self.reportContainer.columnDefinition(self.setGridColumnDefinitions());
				}
				self.reportAction = reportActionObj;

				if (self.reportClick()) {
					if (self.proNumber() != "") {
						self.getReportData(reportActionObj);
					}
					else {
						self.uploadedItem.PageNumber = Number(self.gridOptions.pagingOptions.currentPage());
						self.uploadedItem.PageSize = self.gridOptions.pagingOptions.pageSize();
						self.uploadData(reportActionObj);
					}

				}
			}
		};

		self.getReportData = function (reportActionObj: _reportViewer.ReportAction) {
			//##START: DE20986
			if (self.checkValidation())
				return false;
			//##END: DE20986

			var deferred = $.Deferred();
			var promise = deferred.promise();
			var pageno = 0;
			pageno = Number(self.gridOptions.pagingOptions.currentPage());
			if (pageno > 0) {
				// List View

				self.reportContainer.listProgress(true);
				self.boardReportRequest = new refBoardReportRequestModel.Models.BoardReportRequest();
				self.boardReportRequest.VendorName = self.vendorName();
				self.boardReportRequest.ProNumber = self.proNumber();
				self.boardReportRequest.PageNumber = self.gridOptions.pagingOptions.currentPage();
				self.boardReportRequest.PageSize = self.gridOptions.pagingOptions.pageSize();
				self.reportClient.getVendorBillTrackingReport(self.boardReportRequest,
					function (data) {
						self.setPagingData(data.range, data.TotalCount, self.gridOptions.pagingOptions.pageSize());
						self.reportContainer.listProgress(false);

						deferred.resolve(data, reportActionObj.view);
					},
					function () {
						self.reportContainer.listProgress(false);
					});
			}
			return promise;
		};

		self.reportContainer = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
		self.reportContainer.onFilterChange = self.setReportCriteria;
		//self.reportContainer.showOptionalHeaderRow(false);
		//self.reportContainer.OptionalHeaderRowLocation('TOP');
		self.reportContainer.ForceChange();

		//## redirects to Vendor bill order page
		self.reportContainer.onGridColumnClick = function (obj) {
			var vendorBillId = obj.VendorBillId;
			////##START: US19722
			if (obj.Edi210DetailId != 0 && obj.ExceptionRuleId != 0 && obj.BatchId != 0) {
				_app.trigger("openEdi210Board", obj.ExceptionRuleId, obj.Edi210DetailId, obj.BatchId, obj.ProNumber);
				////##END: US19722
			}
			else {
				_app.trigger("openVendorBill", vendorBillId, obj.ProNumber, (callback) => {
					if (!callback) {
						return;
					}
				});
			}
		}

		// ###START:US20913

		/*	This is triggered when the user is uploading a document.
			It saves the document object to be saved in system */
		self.uploadDocument = (obj, event: Event) => {
			var self = this;
			var reader = new FileReader(),
				fileUploadObj = (<HTMLInputElement>event.target).files[0];

			if (!self.notDisableUploadButton()) {
				self.notDisableUploadButton(true);
			}

			reader.readAsDataURL(fileUploadObj);
			reader.onload = (imgsrc) => {
				self.uploadFileContent = imgsrc.target.result;
				self.uploadedFileName(fileUploadObj.name);
				var item = {
					FileContent: self.uploadFileContent,
					FileExtension: self.uploadedFileName().split(".")[self.uploadedFileName().split(".").length - 1],
					FileName: self.uploadedFileName(),
					PageNumber: Number(self.gridOptions.pagingOptions.currentPage()),
					PageSize: Number(self.gridOptions.pagingOptions.pageSize())
				}

				self.uploadedItem = item;
			}
		}

		//Enables Upload Button once all the mandatory fields are filled up.self.uploadedFileName.length > -1 &&
		self.enableUploadButton = ko.computed(() => {
			if (self.uploadedFileName() != undefined) {
				self.notDisableUploadButton(true);
				return true;
			}
			self.notDisableUploadButton(false);
			return false;
		});

		// ###END: US20913

		return self;
	}
	//#endregion

	//#region Internal Methods
	//##START: DE20986
	// Check validation
	public checkValidation() {
		var self = this;

		if (self.errorGroup.errors().length != 0) {
			self.errorGroup.errors.showAllMessages();
			return true;
		} else {
			return false;
		}
	}
	//##END: DE20986

	public generateReport() {
		var self = this;

		// ###START:US20913
		if (self.disableValidation()) {
			self.disableValidation(false);
		}

		// ###END:US20913
		//##START: DE20986
		if (self.checkValidation())
			return false;
		//##END: DE20986

		self.reportClick(true);

		// ###START:US20913
		if (self.uploadedItem != null) {
			self.uploadedFileName("");
			self.uploadFileContent = null;
			self.notDisableUploadButton(false);
			self.uploadedItem = null;
		}

		// ###END:US20913
		self.gridOptions.pagingOptions.currentPage(1);
		self.getReportData(self.reportAction);
	}

	private setPagingData(data, page, pageSize) {
		var self = this;
		self.gridOptions.data(data);
		self.gridOptions.data.valueHasMutated()
		self.gridOptions.pagingOptions.totalServerItems(page);
	}

	private setGridOptions(self: ReportsVendorBillTrackingReportViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("VendorBillTrackingReportGrid");
		grOption.data = <any> self.reportData;
		grOption.columnDefinition = self.setGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "ProNumber",
			order: "DESC"
		};
		//grOption.enableSaveGridSettings = true;
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
		grOption.enableSaveGridSettings = true;
		grOption.useClientSideFilterAndSort = true;
		grOption.showColumnMenu = true;
		return grOption;
	}

	private setGridColumnDefinitions() {
		var colDefinition: Array = [];
		var self = this;

		//## PRO Cell Template.
		var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'ProNumber\'], click: function() { $userViewModel.onGridColumnClick($parent.entity) }" />';

		colDefinition = [
			{ field: 'ProNumber', displayName: 'PRO #', width: 150, cellTemplate: proCellTemplate },
			{ field: 'ProcessingDateDisplay', displayName: 'Processing Date', width: 200 },
			{ field: 'EdiStatus', displayName: 'EDI Status', isRemovable: false, width: 200 },
			{ field: 'GlobalNetStatus', displayName: 'GlobalNet Status', width: 150 },
			{ field: 'VBStatus', displayName: 'Vendor Bill Location', width: 150 },
			{ field: 'VBAmount', displayName: 'Vendor Bill Amount', width: 100, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
			{ field: 'VBBillStatus', displayName: 'Vendor Bill Status', width: 250 },
			{ field: 'ProcessWorkflow', displayName: 'Process WorkFlow', width: 150 },
			//{ field: 'DateVendorClosingBillPaid', displayName: 'Date Vendor bill paid', width: 150 },
			//{ field: 'DateVendorBillStatusChanged', displayName: 'Date Vendor bill Status Changed', width: 150 },
			//{ field: 'DisputeNote', displayName: 'Notes when Dispute/ShortPay', width: 250 },
			//{ field: 'Terms', displayName: 'Terms', width: 250 },
			//{ field: 'DueDateDisplay', displayName: 'Due Date', width: 150 },
			//{ field: 'RemitAddress', displayName: 'MAS Remit Address', width: 250 },
			//{ field: 'IsPaid', displayName: 'VB Cleared or Paid', width: 100 },
			//{ field: 'PaidAmt', displayName: 'Amount Paid', width: 200, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate  },
			//{ field: 'CheckNoOrTranId', displayName: 'Check Numbers', width: 150 },
			//{ field: 'Carrier', displayName: 'Carrier Name', width: 150 },
			//{ field: 'ShipperCompanyName', displayName: 'Shipper Name', width: 150 },
			//{ field: 'ConsigneeCompanyName', displayName: 'Consignee Name', width: 150 },
			//{ field: 'EstimatedCost', displayName: 'Estimated Cost', width: 150 },
			//{ field: 'EstimatedRevenue', displayName: 'Estimated Revenue', width: 150 },
			//{ field: 'ReviewNotes', displayName: 'Reviewed Notes', width: 150 },
		];
		return colDefinition;
	}

	private load(bindedData) {
		//** if bindedData is null then return false. */
		if (!bindedData)
			return;

		var self = this;
		self.proNumber(bindedData.proNumber);
		self.vendorName(bindedData.vendorName);
		self.reportClick(bindedData.reportClick);
		//##START: US20913
		self.uploadedItem = bindedData.uploadedItem;
		//##END: US20913

		if (refSystem.isObject(self.gridOptions)) {
			self.gridOptions.pagingOptions.pageSize(bindedData.pageSize);
			self.gridOptions.pagingOptions.currentPage(bindedData.currentPage);

			//##START: US20913
			//if upload content is not empty then get report using that, otherwise use the textbox data
			if (typeof self.uploadedItem !== "undefined" && self.uploadedItem !== null) {
				self.uploadFileContent = self.uploadedItem.FileContent;
				self.uploadedFileName(self.uploadedItem.FileName);
				self.uploadData(self.reportAction);
			}
			else
				self.getReportData(self.reportAction);
			//##END: US20913
		}
	}
	//#endregion

	//#region Life Cycle event
	// Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
	public attached() {
		var self = this;
		_app.trigger('viewAttached');
		//Using Document Key press for search result on enter key press
		document.onkeypress = (event: KeyboardEvent) => {
			var keycode = (event.keyCode ? event.keyCode : event.which);
			if (keycode === 13) {
				$('#btngenerateReport').focus();
				self.generateReport();
				$('.requiredFieldBgColor').focus();
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
			//vendorName
			vendorName: self.vendorName(),

			//proNumber.
			proNumber: self.proNumber(),

			pageSize: self.gridOptions.pagingOptions.pageSize(),
			currentPage: self.gridOptions.pagingOptions.currentPage(),
			reportClick: self.reportClick(),
			//##START: US20913
			uploadedItem: self.uploadedItem
			//##END: US20913
		}
	  _app.trigger("registerMyData", data);
		// Remove the event registration from Document
		document.onkeypress = undefined;
	}

	//** Using for focus cursor on last cycle for focusing in pro name
	public compositionComplete(view, parent) {
		$("input:text:visible:first").focus();
	}

	//To load the registered data if any existed.
	public beforeBind() {
		var self = this;

		_app.trigger("loadMyData", function (data) {
			if (data) {
				self.load(data);
			} else {
			}
		});
	}

	public cleanup() {
		var self = this;

		self.reportContainer.cleanup("VendorBillTrackingReportGrid");

		for (var prop in self) {
			if (prop !== "cleanup")
				delete self[prop];
		}
		delete self;
	}

	//#endregion
}

return ReportsVendorBillTrackingReportViewModel;