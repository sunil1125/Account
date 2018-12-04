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
/// <reference path="../services/models/TypeDefs/VendorBillModels.d.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import _reportViewer = require('../templates/reportViewerControlV2');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refEnums = require('services/models/common/Enums');
//#endregion

/*
** <summary>
** Sales Order History ViewModel.
** </summary>
** <createDetails>
** <id>US8214</id> <by>Bhanu</by> <date>9th Aug, 2014</date>
** </createDetails>
** <changeHistory>
** <id>US20855</id> <by>Chandan Singh Bajetha</by> <date>29-02-2016</date> <description>Acct: Add spinner in History window</description>
** <id>DE23006</id> <by>Shreesha Adiga</by> <date>31-05-2016</date> <description>Remove the spinner in the failure callback</description>
** <id>US23277</id> <by>Shreesha Adiga</by> <date>07-07-2016</date> <description>Removed the logic which filtered history for a specific date; Default to page size set to 100</description>
** </changeHistory>
*/
export class SalesOrderHistoryViewModel {
	//#region Members
	historyDetailsDatesList: KnockoutObservableArray<HistoryDeatilsDatesVodel> = ko.observableArray([]);
	public historyNewValueContainer: _reportViewer.ReportViewerControlV2 = null;

	public newHeader: _reportViewer.ReportHeaderOption = null;
	public grid: _reportViewer.ReportGridOption = null;
	public reportAction: _reportViewer.ReportAction = null;
	public reportData: KnockoutObservableArray<IVendorBillHistory> = null;

	public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	public getReportData: () => void;
	public gridOptions: any;
	public reportType: number;
	public modeType = ko.observable();
	commonUtils = new Utils.Common();
	// public salesOrderId: number;
	public proNumber: string;
	//To enable/disable History Details button
	isHistoryDetailEnable: KnockoutObservable<boolean> = ko.observable(false);
	//public reportItemHistoryDates: KnockoutObservableArray<string> = ko.observableArray<string>();
	selectedHistoryDate: KnockoutObservable<string> = ko.observable('');
	selectedVersionId: KnockoutObservable<string> = ko.observable();
	salesOrderId: KnockoutObservable<number> = ko.observable(0);
	isVisible: KnockoutObservable<boolean> = ko.observable(true);
	originalData: ISalesOrderHistory;
	oldHistoryValues: Array<IChangeHistoryRecord>;
	changeRecord: (data) => any;
	historyDate: KnockoutObservable<string> = ko.observable('display-none');
	gridCss: KnockoutObservable<string> = ko.observable('div-float-history');
	salesOrderHistory: Array<IChangeHistoryRecord>;
	//Sales Order Client
	salesOrderClient: refSalesOrderClient.SalesOrderClient = new refSalesOrderClient.SalesOrderClient();
	// ###START: US20855
	// Progress bar
	listProgress: KnockoutObservable<boolean> = ko.observable(false);
	// ###END: US20855
	//#endregion

	//#region Constructor
	constructor() {
		var self = this;
		self.newHeader = new _reportViewer.ReportHeaderOption();
		self.newHeader.reportHeader = "";
		self.newHeader.reportName = "Vendor Bill Payment Details";

		//initialize date filters
		self.reportAction = new _reportViewer.ReportAction();
		self.grid = self.setGridOptions(self);

		self.setReportCriteria = function (reportActionObj: _reportViewer.ReportAction) {
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

			self.changeRecord = (data) => {
				self.selectedHistoryDate(data.historyDateSelected());
				// set color to selected date
				self.historyDetailsDatesList().forEach((item) => {
					item.isSelectedDate(false);
				});
				data.isSelectedDate(true);

				if (data.versionIdSelected()) {
					self.selectedVersionId(data.versionIdSelected());
				}
				self.historyNewValueContainer.listProgress(true);
				//calling server side call if data will come from elastic search or sql server
				if (data.versionIdSelected() && data.isSourceIdElastic()) {
					var successCallBack = dataResult => {
						// To load payment Details
						if (dataResult.IsSourceIsElastic) {
							self.initializeHistoryDetails(dataResult, dataResult.SalesOrderId, false);
						} else {
							self.applyFilter();
						}
					},
						faliureCallBack = () => {
							// ##START: DE23006
							self.historyNewValueContainer.listProgress(false);
							// ##END: DE23006
						};
					self.salesOrderClient.GetShipmentHistoryDetailsByVersionId(self.salesOrderId(), self.selectedVersionId(), "header", successCallBack, faliureCallBack)
				} else {
					self.applyFilter();
				}
			};

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

		// Assign the New value grid settings
		self.historyNewValueContainer = new _reportViewer.ReportViewerControlV2(self.newHeader, self.grid);
		self.historyNewValueContainer.onFilterChange = self.setReportCriteria;
		self.historyNewValueContainer.showOptionalHeaderRow(false);
		self.historyNewValueContainer.OptionalHeaderRowLocation('TOP');

		self.historyNewValueContainer.ForceChange();

		//Displays Date without Time Part
		self.historyNewValueContainer.getDateFormat = shipmentobj => self.commonUtils.formatDate(new Date(shipmentobj.ChangeDate), 'mm/dd/yyyy');

		return self;
	}

	//#endregion

	//#region Public Methods
	public initializeHistoryDetails(data: ISalesOrderHistory, salesOrderId: number, isVisible?: boolean) {
		var self = this;
		self.historyNewValueContainer.listProgress(true);
		if (data) {
			self.originalData = data;
			if (data.SalesOrderHeaderHistory !== null && data.SalesOrderHeaderHistory.length != 0) {
				for (var count = 0; count < data.SalesOrderHeaderHistory.length; count++) {
					if (data.SalesOrderHeaderHistory[count].ChangeAction === "Modified") {
						data.SalesOrderHeaderHistory[count].IsModified = true;
					}
				}
				self.isHistoryDetailEnable(true);
				self.salesOrderId(salesOrderId);
				self.historyNewValueContainer.listProgress(true);
				self.historyNewValueContainer.OptionalHeaderRowLocation('TOP');
				self.setPagingData(data.SalesOrderHeaderHistory, self.gridOptions, self.reportAction);

				// Select the first item
				if (data.HeaderHistoryDates !== null && data.HeaderHistoryDates.length > 0) {
					self.isVisible(isVisible);
					self.selectedHistoryDate(data.HeaderHistoryDates[0].CreatedDateDisplay);
					if (data.HeaderHistoryDates[0].StringifiedVersionId) {
						self.selectedVersionId(data.HeaderHistoryDates[0].StringifiedVersionId);
					}
				}

				// Assign the date to the history date
				if (data.HeaderHistoryDates) {
					self.historyDetailsDatesList.removeAll();
					//self.reportItemHistoryDates.removeAll();
					data.HeaderHistoryDates.forEach(item => {
						//self.reportItemHistoryDates.push(item.CreatedDateDisplay);
						self.historyDetailsDatesList.push(new HistoryDeatilsDatesVodel(item, data.IsSourceIsElastic, self.selectedHistoryDate()))
                    });
				}

				self.applyFilter();

				if (!isVisible) {
					self.historyDate('display-block');
					self.gridCss('div-float-historyDetails');
				}
				else {
					$('.noLeftBorder').parent().css('border-left', '0px');
					$('.noRightBorder').parent().css('border-right', '0px');
				}
				self.historyNewValueContainer.listProgress(false);
				// ###START: US20855
				self.listProgress(false);
				// ###END: US20855
			}
			else {
				self.historyNewValueContainer.listProgress(false);
				// ###START: US20855
				self.listProgress(false);
				// ###END: US20855
			}
		}
		else {
			self.historyNewValueContainer.listProgress(false);
			// ###START: US20855
			self.listProgress(false);
			// ###END: US20855
		}
	}

	/*
	// Apply the filter as per the selected history date
	*/
	public applyFilter() {
		var self = this;

		//if (self.originalData && self.selectedHistoryDate) {
		//	self.salesOrderHistory = ko.utils.arrayFilter(self.originalData.SalesOrderHeaderHistory, (item: IChangeHistoryRecord) => item.ChangeDateFulldate === self.selectedHistoryDate());
		//} else {
		//	self.salesOrderHistory = ko.observableArray()();
		//}

		//self.setPagingData(ko.observableArray(self.salesOrderHistory), self.gridOptions, self.reportAction);
		self.historyNewValueContainer.listProgress(false);
	}

	// To open the history details poop up
	public showHistoryPopup() {
		var self = this;

		var varMsgBox: Array<IMessageBoxButtonOption> = [
			{
				id: 0, name: 'Close', callback: (): boolean => {
					return true;
				},
			}
		];

		////initialize message box control arguments
		var optionControlArgs: IMessageBoxOption = {
			options: varMsgBox,
			message: '',
			title: 'History Details'
		}
		//Call the dialog Box functionality to open a Popup
		//_app.showDialog('salesOrder/SalesOrderHistoryDetails', optionControlArgs);
        _app.showDialog('salesOrder/SalesOrderHistoryHeaderDetails', optionControlArgs);
	}

	//## function to open history details as a new tab.
	public openHistoryDetails() {
		var self = this;
		_app.trigger("openSalesOrderHistoryDetails", self.salesOrderId(), (callback) => {
			if (!callback) {
				return;
			}
		});
	}
	//#endregion

	//#region Private Methods
	private setPagingData(data, grid, gridOption) {
		Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
	}

	private setGridOptions(self: SalesOrderHistoryViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("SalesOrderHistoryGrid");
		grOption.data = <any> self.reportData;
		grOption.columnDefinition = self.setGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "ID",
			order: "DESC"
		};
		//grOption.enableSaveGridSettings = true;
		grOption.pageSizes = [10, 25, 50, 100];
		// ##START: US23277
		grOption.pageSize = 100;
		// ##END: US23277
		grOption.totalServerItems = 0;
		grOption.currentPage = 1;
		grOption.jqueryUIDraggable = true;
		grOption.canSelectRows = false;
		grOption.selectWithCheckboxOnly = false;
		grOption.displaySelectionCheckbox = false;
		grOption.multiSelect = false;
		grOption.enablePaging = false;
		grOption.viewPortOptions = false;
		//grOption.UIGridID = ko.observable("Shipment Board"); // TODO : Replace the value with GUID
		grOption.enableSaveGridSettings = false;
		grOption.useClientSideFilterAndSort = true;

		grOption.showColumnMenu = false;
		return grOption;
	}

	private setGridColumnDefinitions() {
		var colDefinition: Array = [];
		var self = this;
		// to change color of modified items 1st: #e80c4d, 2nd:
		var modifiedTemplate = '<div data-bind="style: { color: $parent.entity[\'IsModified\'] ? \'#e80c4d\' : \'black\' }, attr: { \'class\': \'kgCellText colt\' + $index(), title: $data.getProperty($parent)}, html: $data.getProperty($parent) "></div>';

		colDefinition = [
			{ field: 'FieldName', displayName: 'Field Name', width: 180 },
			{ field: 'OldValue', displayName: 'Old Value', width: 190 },
			{ field: 'NewValue', displayName: 'New Value', cellTemplate: modifiedTemplate, width: 190 },
			{ field: 'ChangeDateDisplay', displayName: 'Change Date', width: 180 },
			{ field: 'ChangeBy', displayName: 'Changed By', width: 180 },
			{ field: 'ChangeAction', displayName: 'Action', width: 180 }

		];
		return colDefinition;
	}

	public cleanUp() {
		var self = this;

		self.historyDetailsDatesList.removeAll();
		self.historyNewValueContainer.cleanup("SalesOrderHistoryGrid");

		delete self.commonUtils;
		delete self.setGridColumnDefinitions;
		delete self.setGridOptions;
		for (var property in self) {
			if (property != "cleanup")
				delete self[property];
		}

		delete self;
	}

	//#endregion
}
/*
** <summary>
** ForHistoryDetails
** </summary>
** <createDetails>
** <id></id> <by>chandan Singh</by> <date>16june2015</date>
** </createDetails>
** <changeHistory>
** <id></id> <by></by> <date></date>
** </changeHistory>
*/
export class HistoryDeatilsDatesVodel {
	historyDateSelected: KnockoutObservable<string> = ko.observable('');
	versionIdSelected: KnockoutObservable<string> = ko.observable('');
	isSourceIdElastic: KnockoutObservable<boolean> = ko.observable(false);
	isSelectedDate: KnockoutObservable<boolean> = ko.observable(false);
	constructor(item: any, isSourceIsElastic: boolean, selectedHistoryDate: string) {
		var self = this;
		self.historyDateSelected(item.CreatedDateDisplay);
		self.isSourceIdElastic(isSourceIsElastic);
		if (isSourceIsElastic === true) {
			self.versionIdSelected(item.StringifiedVersionId);
		}
		if (self.historyDateSelected() == selectedHistoryDate) {
			self.isSelectedDate(true);
		} else {
			self.isSelectedDate(false);
		}
	}
}