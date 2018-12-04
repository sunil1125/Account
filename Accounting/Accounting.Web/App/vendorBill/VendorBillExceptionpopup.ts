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
import refReportClient = require('services/client/ReportClient');
import _reportViewer = require('../templates/reportViewerControlV2');
import refEnums = require('services/models/common/Enums');
import refValidations = require('services/validations/Validations');
import refVendorBillClient = require('services/client/VendorBillClient');
//#endregion

/*
** <summary>
** VendorBillExceptionViewModel
** </summary>
** <createDetails>
** <id>US13250</id> <by>Chandan</by> <date>12-4-2014</date>}
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by> <date></date>
** </changeHistory>
*/

class VendorBillExceptionPopupViewModel {
	//#region MEMBERS
	//#region public report viewer members
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
	vendorBillClient: refVendorBillClient.VendorBillClient = new refVendorBillClient.VendorBillClient();
	//vendorBillExceptionRule: KnockoutObservable<string>
	vendorBillId: KnockoutObservable<number> = ko.observable(0);
	//#endregion

	//#region CONSTRUCTOR
	constructor() {
		var self = this;
		self.headerOptions = new _reportViewer.ReportHeaderOption();
		self.headerOptions.reportHeader = "";
		self.headerOptions.reportName = "Vendor Bill Exception Rule And Resolution";

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

		//	return promise;
		//};
		return self;

		//#endregion
	}

	//#endregion

	//#region Public Methods
	public initializeExeptionruleAndResolution(data: Array<IVendorBillExceptionRulesAndResolution>) {
		var self = this;
		if (data) {
			self.reportContainer.listProgress(true);
			self.reportContainer.OptionalHeaderRowLocation('TOP');
			self.setPagingData(ko.observableArray(data), self.gridOptions, self.reportAction);
			self.reportContainer.listProgress(false);
			$('.noLeftBorder').parent().css('border-left', '0px');
			$('.noRightBorder').parent().css('border-right', '0px');
		}
		else {
			self.reportContainer.listProgress(false);
		}
	}

	//close popup
	public closePopup(dialogResult) {
		var self = this;
		dialogResult.__dialog__.close(this, dialogResult);
		this.cleanup();
		return true;
	}

	//#endregion public Methods

	//#region INTERNAL METHODS
	private setPagingData(data, grid, gridOption) {
		Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
	}

	private setGridOptions(self: VendorBillExceptionPopupViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("VendorBillExceptionPopuptGrid");
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
			{ field: 'VendorBillExceptionRuleDescription', displayName: 'VendorBill Exception Rule', width: 400 },
			{ field: 'ExceptionResolution', displayName: 'Exception Resolution', width: 450 }
		];
		return colDefinition;
	}

	//#endregion

	//#region LIFE CYCLE EVENT

	//#endregion

	//**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
	public beforeBind() {
	}
	// Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
	public attached() {
		_app.trigger('viewAttached');
	}

	public activate(refresh: IMessageBoxOption) {
		var self = this;
		if (refresh.bindingObject) {
			self.vendorBillId(parseInt(refresh.bindingObject.vendorBillId));
			self.vendorBillClient.GetVendorBillExceptionRulesAndResolution(self.vendorBillId(), (data) => {
				if (data) {
					self.initializeExeptionruleAndResolution(data);
				}
			}, () => { });
		}
	}

	public cleanup() {
		var self = this;
		try {
			self.reportContainer.cleanup("VendorBillExceptionPopuptGrid");

			for (var prop in self) {
				delete self[prop];
			}
		} catch (e) {
			console.log("error occurred during cleanup of exception popup")
		}
	}

	//To load the registered data if any existed.
	//public beforeBind() {
	//	return true;
	//}
	//#endregion
}
return VendorBillExceptionPopupViewModel;