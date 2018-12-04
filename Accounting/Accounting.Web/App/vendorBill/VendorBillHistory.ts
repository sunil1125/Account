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
import refVendorBillClient = require('services/client/VendorBillClient');
import _reportViewer = require('../templates/reportViewerControlV2');
import refEnums = require('services/models/common/Enums');
//#endregion

/*
** <summary>
** Vendor Bill History View Model
** </summary>
** <createDetails>
** <id>US8214</id> <by>Satish</by> <date>27th May, 2014</date>
** </createDetails>
** <changeHistory>
** <id>US20855</id> <by>Chandan Singh Bajetha</by> <date>29-02-2016</date> <description>Acct: Add spinner in History window</description>
** <id>DE23006</id> <by>Shreesha Adiga</by> <date>31-05-2016</date> <description>Remove the spinner in the failure callback</description>
** <id>US23123</id> <by>Vasanthakumar</by> <date>07-07-2016</date> <description>Acct: VB History Tab Window Enhancement</description>
** </changeHistory>
*/
export class VendorBillHistory {
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
	public proNumber: string;
	public VBId: number;
	//To enable/disable History Details Button
	isHistoryDetailEnable: KnockoutObservable<boolean> = ko.observable(false);

	public reportItemHistoryDates: KnockoutObservableArray<string> = ko.observableArray<string>();
	selectedHistoryDate: KnockoutObservable<string> = ko.observable('');
	isVisible: KnockoutObservable<boolean> = ko.observable(true);
	originalData: IVendorBillHistory;
	oldHistoryValues: Array<IChangeHistoryRecord>;
	changeRecord: (data) => any;
	historyDate: KnockoutObservable<string> = ko.observable('display-none');
	gridCss: KnockoutObservable<string> = ko.observable('div-float-history');
	vendorBillHistory: Array<IChangeHistoryRecord>;
	selectedVersionId: KnockoutObservable<string> = ko.observable();
	vendorBillId: KnockoutObservable<any> = ko.observable();
	vendorBillClient: refVendorBillClient.VendorBillClient = new refVendorBillClient.VendorBillClient();
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
				self.historyDetailsDatesList().forEach((item) => {
					item.isSelectedDate(false);
				});

				data.isSelectedDate(true);

				if (data.versionIdSelected()) {
					self.selectedVersionId(data.versionIdSelected());
				}

				self.historyNewValueContainer.listProgress(true);

				// calling server side call if data will come from elastic search or sql server
				if (data.versionIdSelected() && data.isSourceIdElastic()) {
					var successCallBack = dataResult => {
						// To load payment Details
						if (dataResult.IsSourceIsElastic) {
							self.initializeHistoryDetails(dataResult, dataResult.VendorBillId, false);
						} else {
							self.applyFilter();
						}
					},
						faliureCallBack = () => {
							// ##START: DE23006
							self.historyNewValueContainer.listProgress(false);
							// ##END: DE23006
						};
					self.vendorBillClient.GetVendorBillHistoryDetailsByVersionId(self.VBId, self.selectedVersionId(), "header", successCallBack, faliureCallBack)
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
	public initializeHistoryDetails(data: IVendorBillHistory, vendorBillId: number, isVisible?: boolean) {
		var self = this;
		self.historyNewValueContainer.listProgress(true);
		if (data) {
			self.originalData = data;
			self.VBId = vendorBillId;

			if (data.VendorBillHeaderHistory !== null && data.VendorBillHeaderHistory.length != 0) {
				for (var count = 0; count < data.VendorBillHeaderHistory.length; count++) {
					if (data.VendorBillHeaderHistory[count].ChangeAction === "Modified") {
						data.VendorBillHeaderHistory[count].IsModified = true;
					}
				}
				self.isHistoryDetailEnable(true);
				self.historyNewValueContainer.OptionalHeaderRowLocation('TOP');
				self.setPagingData(ko.observableArray(data.VendorBillHeaderHistory), self.gridOptions, self.reportAction);

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
					// self.reportItemHistoryDates.removeAll();
					self.historyDetailsDatesList.removeAll();
					data.HeaderHistoryDates.forEach(item => {
						// self.reportItemHistoryDates.push(item);
						self.historyDetailsDatesList.push(new HistoryDeatilsDatesVodel(item, data.IsSourceIsElastic, self.selectedHistoryDate()))
                    });
				}
				else {
				}

				// ###START: US23123
				//self.applyFilter();
				// ###END: US23123

				if (!isVisible) {
					self.historyDate('display-block');
					self.gridCss('div-float-historyDetails');
				}
				else {
					$('.noLeftBorder').parent().css('border-left', '0px');
					$('.noRightBorder').parent().css('border-right', '0px');
				}
				self.historyNewValueContainer.listProgress(false);
				self.listProgress(false);
			}
			else {
				self.historyNewValueContainer.listProgress(false);
				self.listProgress(false);
			}
		}
	}

	/*
	// Apply the filter as per the selected history date
	*/
	public applyFilter() {
		var self = this;

		if (self.originalData && self.selectedHistoryDate) {
			self.vendorBillHistory = ko.utils.arrayFilter(self.originalData.VendorBillHeaderHistory, (item: IChangeHistoryRecord) => item.ChangeDateFulldate === self.selectedHistoryDate());
		} else {
			self.vendorBillHistory = ko.observableArray()();
		}

		//if (self.originalData && self.selectedHistoryDate) {
		//    self.newHistoryValues = ko.utils.arrayFilter(self.originalData.NewHistoryItems, (item: IVendorBillHistoryItems) => item.ChangeDate === self.selectedHistoryDate());
		//} else {
		//    self.newHistoryValues = ko.observableArray()();
		//}

		//self.historyOldValueContainer.OptionalHeaderRowLocation('TOP');
		self.setPagingData(ko.observableArray(self.vendorBillHistory), self.gridOptions, self.reportAction);
		self.historyNewValueContainer.listProgress(false);

		//self.historyNewValueContainer.OptionalHeaderRowLocation('TOP');
		//self.setPagingData(ko.observableArray(self.newHistoryValues), self.newGridOptions, self.newReportAction);
		//self.historyNewValueContainer.listProgress(false);
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
		_app.showDialog('vendorBill/VendorBillHistoryDetails', optionControlArgs);
	}

	//## function to open history details as a new tab.
	public openHistoryDetails() {
		var self = this;
		_app.trigger("openHistoryDetails", self.VBId, self.proNumber, (callback) => {
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

	private setGridOptions(self: VendorBillHistory): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("VendorBillGridHistory");
		grOption.data = <any> self.reportData;
		grOption.columnDefinition = self.setGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "ID",
			order: "DESC"
		};
		//grOption.enableSaveGridSettings = true;
		grOption.pageSizes = [10, 25, 50, 100];
		grOption.pageSize = 10;
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
		// to change color of modified items
		var modifiedTemplate = '<div data-bind="style: { color: $parent.entity[\'IsModified\'] ? \'#e80c4d\' : \'black\' }, attr: { \'class\': \'kgCellText colt\' + $index(), title: $data.getProperty($parent)}, html: $data.getProperty($parent) "></div>';

		colDefinition = [
			{ field: 'FieldName', displayName: 'Field Name', width: 180 },
			{ field: 'OldValue', displayName: 'Old Value', width: 230 },
			{ field: 'NewValue', displayName: 'New Value', cellTemplate: modifiedTemplate, width: 230 },
			{ field: 'ChangeDateDisplay', displayName: 'Change Date', width: 140 },
			{ field: 'ChangeBy', displayName: 'Changed By', width: 180 },
			{ field: 'ChangeAction', displayName: 'Action', width: 105 }

		];
		return colDefinition;
	}

	public cleanUp() {
		var self = this;
		try {
			//delete self.historyNewValueContainer.afterSelectionChange;
			//delete self.historyNewValueContainer.onFilterChange;
			self.historyNewValueContainer.cleanup("VendorBillGridHistory");
			delete self.setGridColumnDefinitions;
			delete self.setPagingData;

			self.historyDetailsDatesList().forEach((items) => {
				items.cleanup();
				delete items;
			});

			for (var prop in self) {
				delete self[prop];
			}

			delete self;
		}
		catch (e) {
		}
	}

	//#endregion
}

/*
** <summary>
** ForHistoryDetails
** </summary>
** <createDetails>}
** <id></id> <by>chandan Singh</by> <date>16june2015</date>
** </createDetails>}
** <changeHistory>
** <id></id> <by></by> <date></date>
** </changeHistory>
*/
export class HistoryDeatilsDatesVodel {
	historyDateSelected: KnockoutObservable<string> = ko.observable('');
	versionIdSelected: KnockoutObservable<string> = ko.observable('');
	isSourceIdElastic: KnockoutObservable<boolean> = ko.observable(false);
	isSelectedDate: KnockoutObservable<boolean> = ko.observable(false);
	constructor(item: any, isSourceIsElastic: boolean, selectedHistoryDate) {
		var self = this;
		self.historyDateSelected(item.CreatedDateDisplay);
		self.isSourceIdElastic(isSourceIsElastic);
		if (isSourceIsElastic === true) {
			self.versionIdSelected(item.StringifiedVersionId);
			self.isSourceIdElastic(isSourceIsElastic);
		}

		if (self.historyDateSelected() == selectedHistoryDate) {
			self.isSelectedDate(true);
		} else {
			self.isSelectedDate(false);
		}
	}

	public cleanup() {
		var self = this;
		try {
			for (var prop in self) {
				if (typeof self[prop].dispose === "function") {
					self[prop].dispose();
				}
				delete self[prop];
			}

			delete self;
		}
		catch (e) {
		}
	}
}