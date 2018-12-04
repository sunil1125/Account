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
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refEnums = require('services/models/common/Enums');
import _reportViewer = require('templates/reportViewerControlV2');
//#endregion

/**
** <summary>
** Purchase Order History View Model.
** < / summary >
** <createDetails>
** <by>Achal Rastogi</by > <date>17th July, 2014 </date >
** < / createDetails>
** <changeHistory>
** <id>DE23592</id> <by>Dhaval Tamhane</by> <date>22-07-2016</date> <description>Unmatched Vendor bill History - Value cannot be null error logged</description>
** </changeHistory>
**/
export class PurchaseOrderHistoryViewModel {
	//#region Members
	public historyPurchaseOrderContainer: _reportViewer.ReportViewerControlV2 = null;

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
	public vendorBillId: number;
	public proNumber: string;
	//To enable/disable History Details button
	isHistoryDetailEnable: KnockoutObservable<boolean> = ko.observable(false);
	//#endregion

	//#region Constructors
	constructor() {
		var self = this;
		var commonUtils = new Utils.Common();
		self.newHeader = new _reportViewer.ReportHeaderOption();
		self.newHeader.reportHeader = "";
		self.newHeader.reportName = "Purchase Order History Details";

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
		self.historyPurchaseOrderContainer = new _reportViewer.ReportViewerControlV2(self.newHeader, self.grid);
		self.historyPurchaseOrderContainer.onFilterChange = self.setReportCriteria;
		self.historyPurchaseOrderContainer.showOptionalHeaderRow(false);
		self.historyPurchaseOrderContainer.OptionalHeaderRowLocation('TOP');

		self.historyPurchaseOrderContainer.ForceChange();

		//Displays Date without Time Part
		self.historyPurchaseOrderContainer.getDateFormat = function (shipmentobj) {
			var self = this;
			return commonUtils.formatDate(new Date(shipmentobj.ChangeDate), 'mm/dd/yyyy');
		}

		//Displays Date without Time Part
		self.historyPurchaseOrderContainer.getDateFormat = shipmentobj => self.commonUtils.formatDate(new Date(shipmentobj.ChangeDate), 'mm/dd/yyyy');

		return self;
	}
	//#endregion

	//#region Internal Methods
	public initializeHistoryDetails(data: Array<IChangeHistoryRecord>) {
		var self = this;

		// ###START: DE23592
		if (data && data.length > 0) {
			// ###END: DE23592
			for (var count = 0; count < data.length; count++) {
				if (data[count].ChangeAction === "Modified") {
					data[count].IsModified = true;
				}
			}
			self.isHistoryDetailEnable(true);
			self.historyPurchaseOrderContainer.listProgress(true);
			self.historyPurchaseOrderContainer.OptionalHeaderRowLocation('TOP');
			self.setPagingData(ko.observableArray(data), self.gridOptions, self.reportAction);
			self.historyPurchaseOrderContainer.listProgress(false);

			$('.noLeftBorder').parent().css('border-left', '0');
			$('.noRightBorder').parent().css('border-right', '0');
		}
		else {
			self.historyPurchaseOrderContainer.listProgress(false);
		}
	}
	// To open the history details poop up
	public showHistoryPopup() {
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
		_app.trigger("openHistoryDetails", self.vendorBillId, self.proNumber, (callback) => {
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

	private setGridOptions(self: PurchaseOrderHistoryViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("PurchaseOrderHistoryGrid");
		grOption.data = <any> self.reportData;
		grOption.columnDefinition = self.setGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "ChangeDateDisplay",
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
			{ field: 'OldValue', displayName: 'Old Value', width: 180 },
			{ field: 'NewValue', displayName: 'New Value', cellTemplate: modifiedTemplate, width: 180 },
			{ field: 'ChangeDateDisplay', displayName: 'Change Date', width: 180 },
			{ field: 'ChangeBy', displayName: 'Changed By', width: 180 },
			{ field: 'ChangeAction', displayName: 'Action', width: 165 }

		];
		return colDefinition;
	}

	//#region Life Cycle Event
	public activate() {
		return true;
	}

	public cleanUp() {
		var self = this;

		self.historyPurchaseOrderContainer.cleanup("PurchaseOrderHistoryGrid");

		//delete self.commonUtils;
		//delete self.setGridColumnDefinitions;
		//delete self.setGridOptions;
		for (var property in self) {
			if (property != "cleanup")
				delete self[property];
		}

		delete self;
	}
	//#endregion
}