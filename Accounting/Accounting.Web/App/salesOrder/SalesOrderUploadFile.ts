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
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refEnums = require('services/models/common/Enums');
import _refPurchaseOrderEmailModel = require('services/models/purchaseOrder/PurchaseOrderEmail');
import _refUploadSalesOrderRequestModel = require('services/models/salesOrder/UploadSalesOrderRequest');
import _reportViewer = require('../templates/reportViewerControlV2');
import _refSalesOrderClient = require('services/client/SalesOrderClient');

//#endregion
/*
** <summary>
** Sales Order Upload File View Model
** </summary>
** <createDetails>
** <id>US19882</id> <by>Shreesha Adiga</by> <date>23-12-2015</date>
** </createDetails>
** <changeHistory>
** <id>US20264</id> <by>Shreesha Adiga</by> <date>11-01-2016</date> <description>Added batchid and runid; Show popup or erro message placeholder</description>
** <id>US20264</id> <by>Shreesha Adiga</by> <date>21-01-2016</date> <description>Some changes to reprocess button; </description>
** <id>DE21593</id> <by>Shreesha Adiga</by> <date>28-01-2016</date> <description>Changes to button and displaying values</description>
** <id>DE21739</id> <by>Shreesha Adiga</by> <date>16-02-2016</date> <description>Removed checkbox; changes to reprocess logic</description>
** <id>DE22074</id> <by>Janakiram</by> <date>22-03-2016</date> <description>While switching tabs it was redircting to home page after fixing in config here hadndled data null exception. Fixed this and added persistence.</description>
** </changeHistory>
*/
class SalesOrderUploadFile {
	//#region Members

	public salesOrderUploadCSVGrid: _reportViewer.ReportViewerControlV2 = null;
	public headerOptions: _reportViewer.ReportHeaderOption = null;
	public grid: _reportViewer.ReportGridOption = null;
	public reportAction: _reportViewer.ReportAction = null;
	public reportData: KnockoutObservableArray<ISalesOrderUploadItem>;
	public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	public getReportData: () => void;
	public gridOptions: any;
	public reportType: number;
	public modeType = ko.observable();
	private searchText: KnockoutObservable<string>;

	salesOrderClient: _refSalesOrderClient.SalesOrderClient = new _refSalesOrderClient.SalesOrderClient();

	//For removing Attached Item
	uploadDocument: (obj, event: Event) => void;
	uploadFileContent: string;
	uploadedFileName: KnockoutObservable<string> = ko.observable();
	commonUtils = new Utils.Common();
	uploadedItem: any;
	enableUploadButton: KnockoutComputed<boolean>;
	//To disable Upload Button after click once on Upload
	notDisableUploadButton: KnockoutObservable<boolean> = ko.observable(false);
	uploadData: Function;
	//To capture Invalid data
	public invalidList: Array<ISalesOrderUploadItem>;

	//##START: US20264
	isErrorMessageVisible: KnockoutObservable<boolean> = ko.observable(false);
	errorMessages: KnockoutObservable<string> = ko.observable("");

	isReprocessButtonEnabled: KnockoutObservable<boolean> = ko.observable(false);
	batchId: number;
	runId: number;
	//##END: US20264
	//#endregion

	//#region Constructor
	constructor() {
		var self = this;

		self.uploadData = () => {
			self.salesOrderUploadCSVGrid.listProgress(true);
			self.notDisableUploadButton(false);
			self.isErrorMessageVisible(false);
			var successCallBack = (data) => {
				self.initializeGridData(data);
			},
				faliureCallBack = (message) => {
					self.salesOrderUploadCSVGrid.listProgress(false);

					var toastrOptions =
						{
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 10,
							fadeOut: 10,
							typeOfAlert: "",
							title: ""
						}

					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);

					return true;
				};

			self.salesOrderClient.GetSalesOrderUploadResponce(self.uploadedItem, successCallBack, faliureCallBack);
		};

		//Enables Upload Button once all the mandatory fields are filled up.self.uploadedFileName.length > -1 &&
		self.enableUploadButton = ko.computed(() => {
			if (self.uploadedFileName() != undefined) {
				self.notDisableUploadButton(true);
				return true;
			}
			self.notDisableUploadButton(false);
			return false;
		});

		/*	This is triggered when the user is uploading a document.
			It saves the document object to be saved in system */
		self.uploadDocument = (obj, event: Event) => {
			var reader = new FileReader(),
				fileUploadObj = (<HTMLInputElement>event.target).files[0];

			reader.readAsDataURL(fileUploadObj);
			reader.onload = (imgsrc) => {
				self.uploadFileContent = imgsrc.target.result;
				self.uploadedFileName(fileUploadObj.name);
				var item = {
					FileContent: self.uploadFileContent,
					FileExtension: self.uploadedFileName().split(".")[self.uploadedFileName().split(".").length - 1],
					FileName: self.uploadedFileName(),
				}

				self.uploadedItem = item;
			}
		}

		//#region GridOptions
		self.headerOptions = new _reportViewer.ReportHeaderOption();
		self.headerOptions.reportHeader = "";
		self.headerOptions.reportName = "Sales ORder Upload CSV File";
		self.headerOptions.gridTitleHeader = " ";
		self.searchText = ko.observable("");
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
			self.reportAction = reportActionObj;

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

		//self.headerOptions.actionButtons1 = {
		//	buttonName: ko.observable("Reprocess"),
		//	enableOnSingleSelection: true,
		//	enableOnMultiSelection: true,
		//	hideWhenUnselected: false,
		//	resetselectionOnAction: false,
		//	isslideButton: false
		//}

		self.salesOrderUploadCSVGrid = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
		self.salesOrderUploadCSVGrid.onFilterChange = self.setReportCriteria;
		self.salesOrderUploadCSVGrid.showOptionalHeaderRow(false);
		//self.salesOrderUploadCSVGrid.OptionalHeaderRowLocation('TOP');
		self.salesOrderUploadCSVGrid.ForceChange();

		// For search filter
		self.salesOrderUploadCSVGrid.onSearchTextChange = (reportViewer, newSearchValue) => {
			if (newSearchValue.length >= 3 || newSearchValue.length == 0) {
				self.searchText(newSearchValue);
				//self.getReportData(self.reportAction);
				self.gridOptions.pagingOptions.currentPage(1);
			}
		};

		//## After selection change re-assign the fields value
		//self.salesOrderUploadCSVGrid.afterSelectionChange = function (items: KnockoutObservableArray<any>) {
		//	var selectedRowCount = items.length;
		//	if (selectedRowCount > 0) {
		//		self.isReprocessButtonEnabled(true);
		//	}
		//	else {
		//		self.isReprocessButtonEnabled(false);
		//	}
		//}

		//#endregion GridOptions
	}

	//#endregion

	//#region Public Methods

	//** The composition engine will execute after complete the composition of view
	public compositionComplete(view, parent) {
		$('#btnUploadCSVFile').focus();
		$('.kgFooterSelectedItems').hide();//DE21647
	}

	//#endregion

	//#region Life Cycle Event

	//** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
	public attached() {
		_app.trigger('viewAttached');
	}

	//** The composition engine will execute it prior to calling the binder. */
	public activate() {
		return true;
	}

	//For data persistence
	public deactivate() {
		var self = this;
		var data = {
			InvalidData: self.gridOptions.fullDataObject(),
			uploadedFileName: self.uploadedFileName(),
			notDisableUploadButton: self.notDisableUploadButton(),
		}
		_app.trigger("registerMyData", data);
	}

	//To capture the persist data
	public beforeBind() {
		var self = this;
		_app.trigger("loadMyData", function (data) {
			if (data) {
				self.initializeGridData(data);
				self.uploadedFileName(data.uploadedFileName);
				self.notDisableUploadButton(data.notDisableUploadButton);
			} else {
			}
		});
	}

	//#endregion

	//#region Private Methods

	// Initializes the data and binds to the UI

	private resetGridSelection(self) {
		window.kg.toggleSelection(false);
	}

	private initializeGridData(data: ISalesOrderUploadResponse) {
		var self = this;
		$('.kgFooterSelectedItems').hide();

		if (data) {
			self.salesOrderUploadCSVGrid.listProgress(true);
			$("#kgSpanFooterSelectedItems").text('0');

			self.batchId = data.BatchId;
			self.runId = data.RunId;

			//##START: US20264
            ////##START: DE22074 
            if (data.SavedCount != null && data.SavedCount != 0) {
				if (typeof data.InvalidData.length !== "undefined" && data.InvalidData.length !== 0) {
					self.showUploadSuccessPopup(ApplicationMessages.Messages.SuccessMessageForSalesOrderUploadPopup.replace("{0}", data.SavedCount.toString()).replace("{1}", data.InvalidData.length.toString()));
				}
                else if (typeof data.InvalidData.length !== "undefined" && data.InvalidData.length == 0 && data.ErrorMessages != null && data.ErrorMessages.length == 0) {
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 3,
						fadeOut: 3,
						typeOfAlert: "",
						title: ""
					}
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, data.SavedCount + ApplicationMessages.Messages.SuccessMessageForSOUploadToastr, "success", null, toastrOptions);
				}
			}

			if (data.ErrorMessages != null && data.ErrorMessages.length != 0) {
				self.errorMessages(data.ErrorMessages.join("<br>"));
				self.isErrorMessageVisible(true);
            }
            ////##END: DE22074
			//##END: US20264

			ko.utils.arrayForEach(data.InvalidData, function (item) {
				if (item.InvalidColumnNames.length != 0)
					ko.utils.arrayForEach(item.InvalidColumnNames, function (invalidItem) {
						self.populateInvalidBolleans(invalidItem, item);
					});
			});

			//##START: DE21739
			if (typeof data.InvalidData.length !== "undefined" && data.InvalidData.length != 0)
				self.isReprocessButtonEnabled(true);
			else
				self.isReprocessButtonEnabled(false);
			//##END: DE21739

			self.setPagingData(ko.observableArray(data.InvalidData), self.gridOptions, self.reportAction);
			self.salesOrderUploadCSVGrid.listProgress(false);
		}
		else {
			self.salesOrderUploadCSVGrid.listProgress(false);
		}
	}

	private populateInvalidBolleans(propertyName: string, item: ISalesOrderUploadItem) {
		switch (propertyName.toLowerCase()) {
			case "status": item.IsStatusInvalid = true;
				break;
			case "notes": item.IsNotesInvalid = true;
				break;
			case "direction": item.IsDirectionInvalid = true;
				break;
			case "company": item.IsCompanyNameInvalid = true;
				break;
			case "createddate": item.IsCreatedDateInvalid = true;
				break;
			case "created": item.IsCreatedInvalid = true;
				break;
			case "client": item.IsClientInvalid = true;
				break;
			case "gl check": item.IsGLCheckInvalid = true;
				break;
			case "code match": item.IsCodeMatchInvalid = true;
				break;
			case "mo#": item.IsMONumberInvalid = true;
				break;
			case "type": item.IsCarrierTypeInvalid = true;
				break;
			case "gl code": item.IsGLCodeInvalid = true;
				break;
			case "suggested prod code": item.IsSuggestedProdCodeInvalid = true;
				break;
			case "po#": item.IsPONumberInvalid = true;
				break;
			case "pro#": item.IsPRONumberInvalid = true;
				break;
			case "ref#": item.IsRefNumberInvalid = true;
				break;
			case "billto city": item.IsBillToCityInvalid = true;
				break;
			case "shipr city": item.IsShipperCityInvalid = true;
				break;
			case "consg city": item.IsConsigneeCityInvalid = true;
				break;
			case "bol": item.IsBOLInvalid = true;
				break;
			case "reference": item.IsReferenceInvalid = true;
				break;
			case "carrier": item.IsCarrierInvalid = true;
				break;
			case "billto comp": item.IsBillToCompInvalid = true;
				break;
			case "item code": item.IsItemCodeInvalid = true;
				break;
			case "shipr zip": item.IsShipperZipInvalid = true;
				break;
			case "consg code": item.IsConsigneeCodeInvalid = true;
				break;
			case "consg zip": item.IsConsigneeZipInvalid = true;
				break;
			case "billto zip": item.IsBillToZipInvalid = true;
				break;
			case "shipr code": item.IsShipperCodeInvalid = true;
				break;
			case "crinvadd.billtid": item.IsCRInventoryAddBillItemIdInvalid = true;
				break;
			case "shipr id": item.IsShipperIdInvalid = true;
				break;
			case "crinvadd.consgid": item.IsCRAddConsigneeIdInvalid = true;
				break;
			case "item": item.IsItemInvalid = true;
				break;
			case "rex bol": item.IsRexBOLInvalid = true;
				break;
			case "billto code": item.IsBillToCodeInvalid = true;
				break;
			case "billto add1": item.IsBillToAddressInvalid = true;
				break;
			case "billto state": item.IsBillToStateInvalid = true;
				break;
			case "shipr stat": item.IsShipperStateInvalid = true;
				break;
			case "consg stat": item.IsConsigneeStateInvalid = true;
				break;
			case "shipr name": item.IsShipperNameInvalid = true;
				break;
			case "shipr add1": item.IsShipperAddressInvalid = true;
				break;
			case "consg name": item.IsConsigneeNameInvalid = true;
				break;
			case "consg add1": item.IsConsigneeAddressInvalid = true;
				break;
			case "invoice id": item.IsInvoiceIdInvalid = true;
				break;
			case "invoice": item.IsInvoiceInvalid = true;
				break;
			case "uniqueid": {
				item.IsUniqueIdInvalid = true;
				item.UniqueId = item.UniqueId == null ? "" : item.UniqueId;
			}
				break;
			case "invitem.id": item.IsInvItemIDInvalid = true;
				break;
		}
	}

	// Updates the data in the UI
	private setPagingData(data, grid, gridOption) {
		Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
	}

	// Sets the options required properties of the grid
	private setGridOptions(self: any): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = true;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("SalesOrderUploadCSVGrid");
		grOption.data = <any> self.reportData;
		grOption.columnDefinition = self.setGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "ID",
			order: "DESC"
		};
		grOption.pageSizes = [10, 25, 50, 100];
		grOption.pageSize = 25;
		grOption.totalServerItems = 0;
		grOption.currentPage = 1;
		grOption.jqueryUIDraggable = true;
		grOption.canSelectRows = true;
		//grOption.selectWithCheckboxOnly = true;
		//grOption.displaySelectionCheckbox = true;
		//grOption.multiSelect = true;
		grOption.enablePaging = false;
		grOption.viewPortOptions = false;
		grOption.enableSaveGridSettings = true;
		grOption.useClientSideFilterAndSort = false;
		grOption.showColumnMenu = true;

		return grOption;
	}

	// Sets the columns in the grid
	private setGridColumnDefinitions() {
		//#region Templates

		//##START: 
		var columnTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'{0}\'], visible:  !$parent.entity[\'{1}\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'{0}\'] == null ? \'\' : $parent.entity[\'{0}\'], visible:  $parent.entity[\'{1}\']" /></div>';

		//#endregion Template

		// ReSharper disable once AssignedValueIsNeverUsed
		var colDefinition: Array = [];

		colDefinition = [
			{
				field: 'Status', displayName: 'Status', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'Status').replace(/\{1}/g, 'IsStatusInvalid')
			},
			{
				field: 'CompanyName', displayName: 'Company', width: 150, cellTemplate: columnTemplate.replace(/\{0}/g, 'CompanyName').replace(/\{1}/g, 'IsCompanyNameInvalid')
			},
			{
				field: 'Notes', displayName: 'Notes', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'Notes').replace(/\{1}/g, 'IsNotesInvalid')
			},
			{
				field: 'Created', displayName: 'Created', width: 180, cellTemplate: columnTemplate.replace(/\{0}/g, 'Created').replace(/\{1}/g, 'IsCreatedInvalid')
			},
			{
				field: 'Client', displayName: 'Client', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'Client').replace(/\{1}/g, 'IsClientInvalid')
			},
			{
				field: 'GLCheck', displayName: 'GL Check', width: 118, cellTemplate: columnTemplate.replace(/\{0}/g, 'GLCheck').replace(/\{1}/g, 'IsGLCheckInvalid')
			},
			{
				field: 'CodeMatch', displayName: 'Code Match', width: 149, cellTemplate: columnTemplate.replace(/\{0}/g, 'CodeMatch').replace(/\{1}/g, 'IsCodeMatchInvalid')
			},
			{
				field: 'CarrierType', displayName: 'Type', width: 130, cellTemplate: columnTemplate.replace(/\{0}/g, 'CarrierType').replace(/\{1}/g, 'IsCarrierTypeInvalid')
			},
			{
				field: 'GLCode', displayName: 'GL Code', width: 115, cellTemplate: columnTemplate.replace(/\{0}/g, 'GLCode').replace(/\{1}/g, 'IsGLCodeInvalid')
			},
			{
				field: 'BOL', displayName: 'BOL', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'BOL').replace(/\{1}/g, 'IsBOLInvalid')
			},
			{
				field: 'Reference', displayName: 'Reference', width: 108, cellTemplate: columnTemplate.replace(/\{0}/g, 'BOL').replace(/\{1}/g, 'IsReferenceInvalid')
			},
			{
				field: 'Direction', displayName: 'Direction', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'Direction').replace(/\{1}/g, 'IsDirectionInvalid')
			},
			{
				field: 'ItemCode', displayName: 'Item Code', width: 90, cellTemplate: columnTemplate.replace(/\{0}/g, 'ItemCode').replace(/\{1}/g, 'IsItemCodeInvalid')
			},
			{
				field: 'SuggestedProdCode', displayName: 'Suggested Prod Code', width: 90, cellTemplate: columnTemplate.replace(/\{0}/g, 'SuggestedProdCode').replace(/\{1}/g, 'IsSuggestedProdCodeInvalid')
			},
			{
				field: 'InvItemID', displayName: 'InvItem.ID', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'InvItemID').replace(/\{1}/g, 'IsInvItemIDInvalid')
			},
			{
				field: 'Item', displayName: 'Item', width: 175, cellTemplate: columnTemplate.replace(/\{0}/g, 'Item').replace(/\{1}/g, 'IsItemInvalid')
			},
			{
				field: 'PONumber', displayName: 'PO#', width: 100, cellTemplate: columnTemplate.replace(/\{0}/g, 'PONumber').replace(/\{1}/g, 'IsPONumberInvalid')
			},
			{
				field: 'MONumber', displayName: 'MO#', width: 100, cellTemplate: columnTemplate.replace(/\{0}/g, 'MONumber').replace(/\{1}/g, 'IsMONumberInvalid')
			},
			{
				field: 'InvoiceId', displayName: 'Invoice ID', width: 100, cellTemplate: columnTemplate.replace(/\{0}/g, 'InvoiceId').replace(/\{1}/g, 'IsInvoiceIdInvalid')
			},
			{
				field: 'RexBOL', displayName: 'Rex BOL', width: 100, cellTemplate: columnTemplate.replace(/\{0}/g, 'RexBOL').replace(/\{1}/g, 'IsRexBOLInvalid')
			},
			{
				field: 'PRONumber', displayName: 'PRO#', width: 85, cellTemplate: columnTemplate.replace(/\{0}/g, 'PRONumber').replace(/\{1}/g, 'IsPRONumberInvalid')
			},
			{
				field: 'Carrier', displayName: 'Carrier', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'Carrier').replace(/\{1}/g, 'IsCarrierInvalid')
			},
			{
				field: 'RefNumber', displayName: 'Ref#', width: 175, cellTemplate: columnTemplate.replace(/\{0}/g, 'RefNumber').replace(/\{1}/g, 'IsRefNumberInvalid')
			},
			{
				field: 'BillToCode', displayName: 'BillTo Code', width: 140, cellTemplate: columnTemplate.replace(/\{0}/g, 'BillToCode').replace(/\{1}/g, 'IsBillToCodeInvalid')
			},
			{
				field: 'CRInventoryAddBillItemId', displayName: 'CRInvAdd.BilltID', width: 175, cellTemplate: columnTemplate.replace(/\{0}/g, 'CRInventoryAddBillItemId').replace(/\{1}/g, 'IsCRInventoryAddBillItemIdInvalid')
			},
			{
				field: 'BillToComp', displayName: 'BillTo Comp', width: 175, cellTemplate: columnTemplate.replace(/\{0}/g, 'BillToComp').replace(/\{1}/g, 'IsBillToCompInvalid')
			},
			{
				field: 'BillToAddress', displayName: 'BillTo Add1', width: 175, cellTemplate: columnTemplate.replace(/\{0}/g, 'BillToAddress').replace(/\{1}/g, 'IsBillToAddressInvalid')
			},
			{
				field: 'BillToCity', displayName: 'BillTo City', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'BillToCity').replace(/\{1}/g, 'IsBillToCityInvalid')
			},
			{
				field: 'BillToState', displayName: 'BillTo State', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'BillToState').replace(/\{1}/g, 'IsBillToStateInvalid')
			},
			{
				field: 'BillToZip', displayName: 'BillTo Zip', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'BillToZip').replace(/\{1}/g, 'IsBillToZipInvalid')
			},
			{
				field: 'ShipperCode', displayName: 'Shipr Code', width: 102, cellTemplate: columnTemplate.replace(/\{0}/g, 'ShipperCode').replace(/\{1}/g, 'IsShipperCodeInvalid')
			},
			{
				field: 'ShipperId', displayName: 'Shipr ID', width: 110, cellTemplate: columnTemplate.replace(/\{0}/g, 'ShipperId').replace(/\{1}/g, 'IsShipperIdInvalid')
			},
			{
				field: 'ShipperName', displayName: 'Shipr Name', width: 175, cellTemplate: columnTemplate.replace(/\{0}/g, 'ShipperName').replace(/\{1}/g, 'IsShipperNameInvalid')
			},
			{
				field: 'ShipperAddress', displayName: 'Shipr Add1', width: 175, cellTemplate: columnTemplate.replace(/\{0}/g, 'ShipperAddress').replace(/\{1}/g, 'IsShipperAddressInvalid')
			},
			{
				field: 'ShipperCity', displayName: 'Shipr City', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'ShipperCity').replace(/\{1}/g, 'IsShipperCityInvalid')
			},
			{
				field: 'ShipperState', displayName: 'Shipr Stat', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'ShipperState').replace(/\{1}/g, 'IsShipperStateInvalid')
			},
			{
				field: 'ShipperZip', displayName: 'Shipr Zip', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'ShipperZip').replace(/\{1}/g, 'IsShipperZipInvalid')
			},
			{
				field: 'ConsigneeCode', displayName: 'Consg Code', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'ConsigneeCode').replace(/\{1}/g, 'IsConsigneeCodeInvalid')
			},
			{
				field: 'CRAddConsigneeId', displayName: 'CRInvAdd.ConsgID', width: 175, cellTemplate: columnTemplate.replace(/\{0}/g, 'CRAddConsigneeId').replace(/\{1}/g, 'IsCRAddConsigneeIdInvalid')
			},
			{
				field: 'ConsigneeName', displayName: 'Consg Name', width: 175, cellTemplate: columnTemplate.replace(/\{0}/g, 'ConsigneeName').replace(/\{1}/g, 'IsConsigneeNameInvalid')
			},
			{
				field: 'ConsigneeAddress', displayName: 'Consg Add1', width: 175, cellTemplate: columnTemplate.replace(/\{0}/g, 'ConsigneeAddress').replace(/\{1}/g, 'IsConsigneeAddressInvalid')
			},
			{
				field: 'ConsigneeCity', displayName: 'Consg City', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'ConsigneeCity').replace(/\{1}/g, 'IsConsigneeCityInvalid')
			},
			{
				field: 'ConsigneeState', displayName: 'Consg Stat', width: 75, cellTemplate: columnTemplate.replace(/\{0}/g, 'ConsigneeState').replace(/\{1}/g, 'IsConsigneeStateInvalid')
			},
			{
				field: 'ConsigneeZip', displayName: 'Consg Zip', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'ConsigneeZip').replace(/\{1}/g, 'IsConsigneeZipInvalid')
			},
			{
				field: 'Invoice', displayName: 'Invoice', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'Invoice').replace(/\{1}/g, 'IsInvoiceInvalid')
			},
			{
				field: 'CreatedDate', displayName: 'Created date', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'CreatedDate').replace(/\{1}/g, 'IsCreatedDateInvalid')
			},
			{
				field: 'UniqueId', displayName: 'Uniqueid', width: 120, cellTemplate: columnTemplate.replace(/\{0}/g, 'UniqueId').replace(/\{1}/g, 'IsUniqueIdInvalid')
			}
		];

		return colDefinition;
	}

	private showUploadSuccessPopup(data) {
		var self = this;

		var varMsgBox: Array<IMessageBoxButtonOption> = [

		];
		////initialize message box control arguments
		var optionControlArgs: IMessageBoxOption = {
			options: varMsgBox,
			message: '',
			title: '',
			bindingObject: data
		}

			//Call the dialog Box functionality to open a Popup
		_app.showDialog('salesOrder/SalesOrderUploadSuccessPopup', optionControlArgs).then((object) => {

		});
	}

	//click event of reporcess button
	private onReprocessClick(reportActionObj: _reportViewer.ReportAction) {
		var self = this;

		var uploadSalesOrderRequestModel = new _refUploadSalesOrderRequestModel.Models.UploadSalesOrderRequest();

		//##START: DE21739
		//get all the records in the grid
		uploadSalesOrderRequestModel.CorrectedRecords = reportActionObj.gridOptions.data()

		//if selected total selected item is zero then don't reprocess
		if (typeof uploadSalesOrderRequestModel.CorrectedRecords.length === "undefined" || uploadSalesOrderRequestModel.CorrectedRecords.length === 0)
			return false;
		//##END: DE21739

		self.salesOrderUploadCSVGrid.listProgress(true);
		self.isErrorMessageVisible(false);
		self.isReprocessButtonEnabled(false); //DE21647

		//##START: US20264
		uploadSalesOrderRequestModel.BatchId = self.batchId;
		uploadSalesOrderRequestModel.RunId = self.runId;
		//##END: US20264

		self.salesOrderClient.GetSalesOrderUploadResponseAfterSubmitFromGrid(uploadSalesOrderRequestModel, (data) => {
			self.initializeGridData(data);
			self.resetGridSelection(self);
		},
			() => {
				//##START: DE21739
				if (typeof self.gridOptions.data !== "undefined" && self.gridOptions.data().length > 0)
					self.isReprocessButtonEnabled(true);
				//##END: DE21739
				self.salesOrderUploadCSVGrid.listProgress(false);
			});
	}

	//#endregion
}

return SalesOrderUploadFile;