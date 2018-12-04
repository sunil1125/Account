/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region REFERENCES
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion

//#region IMPORT
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refVendorBillOptionButtonControl = require('vendorBill/VendorBillOptionButtonControl');
import refEnums = require('services/models/common/Enums');
import _reportViewer = require('../templates/reportViewerControlV2');
import refCarrierSearchModel = require('services/models/common/searchVendorName');
import refCarrierSearchControl = require('templates/searchVendorNameControl');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refCarrierDetails = require('services/models/salesOrder/SalesOrderAuditSettingCarrierDetails');
import refItemsDetails = require('services/models/salesOrder/SalesOrderAuditSettingItems');
import refContainer = require('services/models/salesOrder/SalesOrderAuditSettingContainer');
//#endregion
/***********************************************
   SALES ORDER AUDIT SETTINGS VIEW MODEL
************************************************
** <summary>
** Purchase Order details View Model.
** </summary>
** <createDetails>
** <id>US13213</id><by>Satish</by> <date>28th Nov, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by><date></date>
** </changeHistory>

***********************************************/

export class SalesOrderAuditSettingsViewModel {
	//#region MEMBERS
	fakItemsList: KnockoutObservableArray<auditSettingItem> = ko.observableArray([]);
	obcCheckBox: refVendorBillOptionButtonControl.VendorBillOptionButtonControl;
	shipmentItemTypes: KnockoutObservableArray<IShipmentItemType> = ko.observableArray([]);
	selectedItemType: KnockoutObservable<IShipmentItemType> = ko.observable();
	matchingToken: KnockoutObservable<string> = ko.observable();
	// carrier search list
	carrierSearchList: refCarrierSearchControl.SearchVendorNameControl;
	carrierId: KnockoutObservable<number> = ko.observable();
	salesOrderClient: refSalesOrderClient.SalesOrderClient = new refSalesOrderClient.SalesOrderClient();
	onAdd: () => void;
	listProgress: KnockoutObservable<boolean> = ko.observable(false);
	// To get the logged in user
	currentUser: KnockoutObservable<IUser> = ko.observable();
	//For Validation purpose
	errorFAKDetail: KnockoutValidationGroup;
	canShowValidation: KnockoutObservable<boolean> = ko.observable(false);
	private checkMsgDisplay: boolean = true;
	//#region report Container Members
	public reportContainer: _reportViewer.ReportViewerControlV2 = null;
	public header: _reportViewer.ReportHeaderOption = null;
	public grid: _reportViewer.ReportGridOption = null;
	public reportAction: _reportViewer.ReportAction = null;
	public reportData: KnockoutObservableArray<auditSettingItem> = null;
	public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	public getReportData: () => void;
	public gridOptions: any;
	public reportType: number;
	public modeType = ko.observable();
	//#endregion

	//#endregion MEMBERS

	//#region CONSTRUCTOR
	constructor() {
		var self = this;

		// get the logged in user details object
		if (!self.currentUser()) {
			// Get the logged in user for name for new note}
			_app.trigger("GetCurrentUserDetails", function (currentUser: IUser) {
				self.currentUser(currentUser);
			});
		}

		//Initialize Carrier instance
		self.carrierSearchList = new refCarrierSearchControl.SearchVendorNameControl("A valid Carrier is required.", '250px', '245px', true,
			// on change of carrier then hit the DB to fetch status and items of carrier
			(carrierId) => {
			self.carrierId(carrierId);
			self.fakItemsList.removeAll();
			self.canShowValidation(false);
			self.getFAKDetails();
		});

		//#region Option Buttons
		//To set the checkbox bill option values
		var checkBoxOptions: Array<IButtonControlOption> = [{ id: refEnums.Enums.vendorBillOptionConstant.FAKMapping, name: 'FAK Mapping Applicable', selected: true }];

		//set checkbox property
		var argsvendorBillOptionList: IOptionButtonControlArgs = {
			options: checkBoxOptions,
			useHtmlBinding: true,
			isMultiCheck: true,
			isVerticalView: false
		}

		self.obcCheckBox = new refVendorBillOptionButtonControl.VendorBillOptionButtonControl(argsvendorBillOptionList, refEnums.Enums.OptionButtonsView.Vertical, '175px');
		//#endregion

		//#region Add
		self.onAdd = function () {
			var self = this;
			self.canShowValidation(true);
			if (self.validation()) {
				self.fakItemsList.unshift(new auditSettingItem(self.matchingToken(), self.selectedItemType(), 0, self.currentUser().UserName.toString()));
				self.canShowValidation(false);
				self.matchingToken("");
				$("#txtDescription").focus();
				self.selectedItemType(null);
				self.setPagingData(ko.observableArray(self.fakItemsList()), self.gridOptions, self.reportAction);
				self.resetGridSelection(self);
			}
			else {
				return false;
			}
		}
		//#endregion

		//#region report container logic
		self.header = new _reportViewer.ReportHeaderOption();
		self.header.reportHeader = "";
		self.header.reportName = "Audit Settings Description";
		self.header.gridTitleHeader = "";
		self.header.showReportOptionalHeaderRow = false;
		//initialize date filters
		self.reportAction = new _reportViewer.ReportAction();
		self.grid = self.setGridOptions(self);

		self.setReportCriteria = (reportActionObj: _reportViewer.ReportAction) => {
			self.gridOptions = reportActionObj.gridOptions;
			self.reportAction = reportActionObj;
		};

		self.reportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);
		self.reportContainer.showOptionalHeaderRow(false);
		self.reportContainer.showDimension1Option(false);
		self.reportContainer.OptionalHeaderRowLocation('TOP');
		self.reportContainer.onFilterChange = self.setReportCriteria;
		self.reportContainer.ForceChange();
		//#endregion

		//#region validation Logic
		self.matchingToken.extend({
			required:
			{
				message: ApplicationMessages.Messages.FAKDescriptionRequired,
				onlyIf: () => {
					return (self.canShowValidation());
				}
			},
			minLength:
			{
				message: ApplicationMessages.Messages.FAKCannotBeLessThanThreeCharacters, params: 3,
				onlyIf: () => {
					return (self.canShowValidation());
				}
			}
		});

		self.selectedItemType.extend({
			required:
			{
				message: ApplicationMessages.Messages.FAKItemRequired,
				onlyIf: () => {
					return (self.canShowValidation());
				}
			},
		});

		//#region Error Details Object
		self.errorFAKDetail = ko.validatedObservable({
			selectedItemType: self.selectedItemType,
			matchingToken: self.matchingToken,
			carrierSearchList: self.carrierSearchList
		});

		//#endregion
		return self;
	}
	//#endregion
	//#endregion

	//#region METHODS

	//#region Report Container
	// function to reset the grid selection.
	private resetGridSelection(self) {
		window.kg.toggleSelection(false);
	}

	// function to set the paging data.
	private setPagingData(data, grid, gridOption) {
		Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
	}

	// function to set the grid options.
	private setGridOptions(self: SalesOrderAuditSettingsViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();

		grOption.enableSelectiveDisplay = false;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("SalesOrderAuditSettingsGrid");
		grOption.data = <any> self.reportData;
		grOption.columnDefinition = self.setGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "matchingToken",
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

	// function to set the column definitions
	private setGridColumnDefinitions() {
		var colDefinition: Array = [];

		colDefinition = [
			{ field: 'matchingToken', displayName: 'Matching Token', width: 300, sortable: false },
			{ field: 'descriptionDisplay', displayName: 'Display Description', sortable: false }
		];
		return colDefinition;
	}
	//#endregion

	//#region Action Methods
	// function to fetch status and Item descriptions of Carrier
	private getFAKDetails() {
		var self = this;
		var successCallBack = function (data: any) {
			if (data != null) {
				self.initializeData(data);
			}
		},
			faliureCallBack = function () {
			};
		self.salesOrderClient.GetFAKDetails(self.carrierId(), successCallBack, faliureCallBack);
	}

	// function which validates on ADD click to add matching token and item desc to the grid.
	private validation() {
		var self = this;
		self.carrierSearchList.vaildateSearchVendorNameControl();
		if (self.errorFAKDetail.errors().length != 0) {
			self.errorFAKDetail.errors.showAllMessages();
			return false;
		} else {
			return true;
		}
	}

	// function to initialize the carrier details.
	private initializeData(data) {
		var self = this;
		if (data.SalesOrderAuditSettingCarrierDetails != null) {
			self.carrierId(data.SalesOrderAuditSettingCarrierDetails.CarrierId);
			if (data.SalesOrderAuditSettingCarrierDetails.IsFAKMapping) {
				self.obcCheckBox.getOptionsById(6).selected(true)
			}
			else {
				self.obcCheckBox.getOptionsById(6).selected(false)
			}
		}
		else {
			self.obcCheckBox.getOptionsById(6).selected(false)
		}

		if (data.SalesOrderAuditSettingItems.length > 0) {
			self.fakItemsList.removeAll();
			self.initializeItems(data.SalesOrderAuditSettingItems);
		}
		else {
			self.fakItemsList.removeAll();
			self.setPagingData(ko.observableArray(self.fakItemsList()), self.gridOptions, self.reportAction);
		}
	}

	// function to initialize the item descriptions.
	private initializeItems(items) {
		var self = this;
		if (items != null) {
			for (var i = 0; i < items.length; i++) {
				var item = $.grep(self.shipmentItemTypes(), function (e) { return e.ItemId === items[i].ItemId.toString(); })[0];
				self.fakItemsList.push(new auditSettingItem(items[i].MatchingToken, item, items[i].Id, items[i].UserName));
			}
			self.setPagingData(ko.observableArray(self.fakItemsList()), self.gridOptions, self.reportAction);
		}
	}

	// function which executes on SAVE
	private onSave() {
		var self = this;
		self.canShowValidation(false);
		if (self.validation()) {
			self.listProgress(true);
			var data = new refContainer.Model.SalesOrderAuditSettingContainer();
			data.SalesOrderAuditSettingCarrierDetails = self.getCarrierDetails();
			data.SalesOrderAuditSettingItems = self.getCarrierItems();
			self.salesOrderClient.SaveFAKSetup(data, function (message) {
				self.listProgress(false);
				if (self.checkMsgDisplay) {
					self.checkMsgDisplay = false;
					var toastrOptions1 = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.FAKSavedSuccessFully, "success", null, toastrOptions1, null);
				}
			}, (message) => {
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
			self.listProgress(false);
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions, null);
				});
		}
		else {
			return false;
		}
	}

	// function to collect the carrier information on SAVE Click.
	private getCarrierDetails() {
		var self = this;
		var carrierDetails = new refCarrierDetails.Model.SalesOrderAuditSettingCarrierDetails();
		carrierDetails.CarrierId = self.carrierId();
		carrierDetails.IsFAKMapping = self.obcCheckBox.getOptionsById(6).selected();
		return carrierDetails;
	}

	// function to collect the item descriptions on SAVE Click.
	private getCarrierItems(): Array<ISalesOrderAuditSettingItems> {
		var self = this;
		var items: Array<refItemsDetails.Model.SalesOrderAuditSettingItems>;
		items = ko.observableArray([])();
		self.fakItemsList().forEach((item) => {
			var itemDetails = new refItemsDetails.Model.SalesOrderAuditSettingItems();
			itemDetails.Id = item.id();
			itemDetails.ItemId = item.itemId();
			itemDetails.MatchingToken = item.matchingToken();
			itemDetails.UserName = item.userName();
			items.push(itemDetails);
		});
		return items;
	}

	//#endregion

	//#endregion

	//#region LIFE CYCLE EVENT
	// Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
	public attached() {
		_app.trigger('viewAttached');
	}

	//The composition engine will execute it prior to calling the binder.
	public activate() {
		return true;
	}

	public deactivate() {
        var self = this;
        self.cleanup();
	}

    public cleanup() {
        var self = this;
        self.carrierSearchList.cleanUp();

        for (var property in self) {
            if (property != "cleanup")
                delete self[property];
        }
        delete self;
    }

	//To load the registered data if any existed.
	public beforeBind() {
		var self = this

		// Load all shipment types if not loaded already
		var shipmentItemTypesLength: number = self.shipmentItemTypes().length;
		if (!(shipmentItemTypesLength)) {
			_app.trigger("GetItemsTypes", function (items:IShipmentItemType) {
				self.shipmentItemTypes.removeAll();
				self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
			});
		}
	}
	//#endregion
}

// This a view model of the line items
export class auditSettingItem {
	matchingToken: KnockoutObservable<string> = ko.observable();
	descriptionDisplay: KnockoutObservable<string> = ko.observable();
	itemId: KnockoutObservable<number> = ko.observable();
	id: KnockoutObservable<number> = ko.observable();
	userName: KnockoutObservable<string> = ko.observable();
	createdDate: KnockoutObservable<string> = ko.observable();
	// Get the entered notes and initialize the item
	constructor(matchingToken: string, selectedType: IShipmentItemType, id:number, userName:string) {
		var self = this;
		self.matchingToken(matchingToken);
		self.id(id);
		self.userName(userName);
		// Set the description for all the other items rather than shipping
		if (refSystem.isObject(selectedType)) {
			self.itemId(+selectedType.ItemId);
			self.descriptionDisplay(selectedType.LongDescription);
		}
	}
}

return SalesOrderAuditSettingsViewModel;