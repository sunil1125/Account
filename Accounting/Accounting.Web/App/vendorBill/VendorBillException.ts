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
/// <reference path="../services/models/TypeDefs/VendorBillModels.d.ts" />
//#endregion

//#region IMPORT
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import _reportViewer = require('../templates/reportViewerControlV2');
import refVendorBillClient = require('services/client/VendorBillClient');
import refEnums = require('services/models/common/Enums');
import refValidations = require('services/validations/Validations');
//#endregion

/*
** <summary>
** VendorBillExceptionViewModel
** </summary>
** <createDetails>
** <id>US13250</id> <by>Chandan</by> <date>12-4-2014</date>}
** </createDetails>}
** <changeHistory>}
** <id>DE24130</id> <by>Baldev Singh Thakur</by> <date>16-09-2016</date><description>Added a call back from VendorBillException for reloading the bill.</description>
** </changeHistory>
*/

export class VendorBillExceptionViewModel {
	//#region MEMBERS
	//#region public report viewer members
	vendorBillClient: refVendorBillClient.VendorBillClient = new refVendorBillClient.VendorBillClient();
	public reportContainer: _reportViewer.ReportViewerControlV2 = null;
	public headerOptions: _reportViewer.ReportHeaderOption = null;
	public grid: _reportViewer.ReportGridOption = null;
	public reportAction: _reportViewer.ReportAction = null;
	public reportData: KnockoutObservableArray<any> = null;
	public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	public getReportData: (reportAction: _reportViewer.ReportAction) => any;
	public gridOptions: any;
	public reportType: number;
	public modeType = ko.observable();
	public isAnyExceptionAvailable: KnockoutObservable<boolean> = ko.observable(false);
	public forcePush: () => any;
	public vendorBillId: number;
	public selectedBillStatus: KnockoutObservable<number> = ko.observable(0);
	// ###START: DE24130
	onForcePuchCallBack: () => any;

	// ###END: DE24130
	//vendorBillExceptionRule: KnockoutObservable<string>
	//#endregion

	//#region CONSTRUCTOR
	constructor(forcePushClickCallBack: () => any) {
		var self = this;
		self.headerOptions = new _reportViewer.ReportHeaderOption();
		self.headerOptions.reportHeader = "";
		self.headerOptions.reportName = "Vendor Bill Exception Rule And Resolution";

		// ###START: DE24130
		self.onForcePuchCallBack = forcePushClickCallBack;

		// ###END: DE24130
		self.reportAction = new _reportViewer.ReportAction();
		self.grid = self.setGridOptions(self);

		self.setReportCriteria = (reportActionObj: _reportViewer.ReportAction) => {
			self.gridOptions = reportActionObj.gridOptions;
			if (self.reportAction != null) {
				self.gridOptions.pagingOptions.currentPage(1);
			}

			// Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
			// we don't want any data on page load so we commented getReportdata  function.
			// self.getReportData();
			self.reportAction = reportActionObj;
		};

		self.reportContainer = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
		self.reportContainer.onFilterChange = self.setReportCriteria;
		self.reportContainer.showOptionalHeaderRow(false);
		self.reportContainer.OptionalHeaderRowLocation('TOP');
		self.reportContainer.ForceChange();

		self.forcePush = () => {
			self.reportContainer.listProgress(true);
			self.vendorBillClient.ForcePushToMAS(self.vendorBillId, (data) => {
				setTimeout(() => {
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 15,
						fadeOut: 15,
						typeOfAlert: "",
						title: ""
					}

					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, "This VendorBill has been scheduled for next push to MAS.", "success", null, toastrOptions);
				}, 500);

				self.isAnyExceptionAvailable(false);
				self.setPagingData(ko.observableArray(), self.gridOptions, self.reportAction);
				self.reportContainer.listProgress(false);
				// ###START: DE24130
				self.onForcePuchCallBack();

				// ###END: DE24130
			}, (message) => {
				self.reportContainer.listProgress(false);
				});
		}

		return self;

		//#endregion
	}

	//#endregion

	//#region Public Methods
	public initializeExeptionruleAndResolution(data: Array<IVendorBillExceptionRulesAndResolution>) {
		var self = this;
		if (data && data.length > 0) {
			if (self.selectedBillStatus() !== 1) {
				self.isAnyExceptionAvailable(true);
			}
			self.vendorBillId = data[0].VendorBillId;

			self.reportContainer.listProgress(true);
			self.reportContainer.OptionalHeaderRowLocation('TOP');
			self.setPagingData(ko.observableArray(data), self.gridOptions, self.reportAction);
			self.reportContainer.listProgress(false);
			$('.noLeftBorder').parent().css('border-left', '0px');
			$('.noRightBorder').parent().css('border-right', '0px');
		}
		else {
			self.isAnyExceptionAvailable(false);
			self.setPagingData(ko.observableArray(), self.gridOptions, self.reportAction);
			self.reportContainer.listProgress(false);
		}
	}

	//#endregion public Methods

	//#region INTERNAL METHODS
	private setPagingData(data, grid, gridOption) {
		Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
	}

	private setGridOptions(self: VendorBillExceptionViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("VendorBillExceptionGrid");
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
		//grOption.UIGridID = ko.observable("Shipment Board"); // TODO : Replace the value with GUID
		grOption.enableSaveGridSettings = false;
		grOption.useClientSideFilterAndSort = true;
		grOption.showColumnMenu = false;
		return grOption;
	}

	private setGridColumnDefinitions() {
		var colDefinition: Array = [];
		var self = this;

		colDefinition = [
			{ field: 'VendorBillExceptionRuleDescription', displayName: 'VendorBill Exception Rule', width: 605 },
			{ field: 'ExceptionResolution', displayName: 'Exception Resolution', width: 620 }
		];
		return colDefinition;
	}

	//#endregion

	//#region LIFE CYCLE EVENT
	// Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
	public attached() {
		_app.trigger('viewAttached');
	}

	//To load the registered data if any existed.
	//public beforeBind() {
	//	return true;
	//}

	public cleanUp()
	{
		var self = this;
		try {
			//delete self.reportContainer.afterSelectionChange;
			//delete self.reportContainer.onFilterChange;
			//delete self.reportContainer.showOptionalHeaderRow;
			//delete self.reportContainer.OptionalHeaderRowLocation;
			//delete self.reportContainer.ForceChange;

			self.reportContainer.cleanup("VendorBillExceptionGrid");

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
	//#endregion
}