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
import refpurchaseOrderClient = require('services/client/PurchaseOrderClient');
import _refBillsIdentificationMapping = require('services/models/purchaseOrder/VolumeCustomerBillsIdentificationMapping');
import _refVolumeCustomerMapping = require('services/models/purchaseOrder/VolumeCustomerMapping');
import _reportViewer = require('../templates/reportViewerControlV2');
import refEnums = require('services/models/common/Enums');

//#endregion

/***********************************************
   REXNORD MAPPED COMPANIES VIEW MODEL
************************************************
** <summary>
** Rexnord Mapped Companies View Model.
** </summary>
** <createDetails>
** <id>US10953</id><by>Satish</by> <date>29th July, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by><date></date>
** </changeHistory>

***********************************************/

//## This a view model of the line company.
export class RexnordCompany {
	id: KnockoutObservable<number> = ko.observable(0);
	customerId: KnockoutObservable<number> = ko.observable(0);
	companyToken: KnockoutObservable<string> = ko.observable('');

	// Get mapped Companies
	constructor(id: number, customerId: number, companyToken: string) {
		var self = this;
		self.id(id);
		self.customerId(customerId);
		self.companyToken(companyToken);
	}
}

export class RexnordMappedCompaniesViewModel {
	//#region Variable Declaration
	rexnordCompaniesList: KnockoutObservableArray<RexnordCompany> = ko.observableArray([]);
	purchaseOrderClient: refpurchaseOrderClient.PurchaseOrderClient = new refpurchaseOrderClient.PurchaseOrderClient();
	companyName: KnockoutObservable<string> = ko.observable('');
	companyId: KnockoutObservable<number>=ko.observable(0);
	selectedRexnordCompany: (selected: RexnordCompany) => void;

	removeCompany: (selectedToBeRemove: RexnordCompany) => void;
	private selecteditemtoremove: RexnordCompany;
	private searchText: KnockoutObservable<string>;
	public deleteitem: () => any;
	//#endregion Variable Declaration

	//#region public report viewer members
	public reportContainer: _reportViewer.ReportViewerControlV2 = null;
	public header: _reportViewer.ReportHeaderOption = null;
	public grid: _reportViewer.ReportGridOption = null;
	public reportAction: _reportViewer.ReportAction = null;
	public reportData: KnockoutObservableArray<IVolumeCustomerBillsIdentificationMapping> = null;
	public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	public getReportData: () => void;
	public gridOptions: any;
	public reportType: number;
	public selected: RexnordCompany;
	app = _app;
    public modeType = ko.observable();
    private checkMsgDisplay: boolean = true;
    public checkMsgClick: () => any;
    public checkMsgHide: () => any;
    // flag for enable/disbale save button
    isSave: KnockoutObservable<boolean> = ko.observable(true);
    // Utility class object
    CommonUtils: CommonStatic = new Utils.Common();
	//#endregion

	//#region Constructor
	constructor() {
		var self = this;
		self.header = new _reportViewer.ReportHeaderOption();
		self.header.reportHeader = "";
		self.header.reportName = "";
		self.header.gridTitleHeader = " ";

		//initialize date filters
		self.reportAction = new _reportViewer.ReportAction();
		self.grid = self.setGridOptions(self);
		self.searchText = ko.observable("");

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
			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.DateTimeValidation, "info", null, toastrOptions);
			}
		};

		self.reportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);

		self.reportContainer.onFilterChange = self.setReportCriteria;
		self.reportContainer.ForceChange();

		//## to display the text of clicked link in a text box
		self.selectedRexnordCompany= (selected: RexnordCompany) => {
			if (selected != null) {
				self.companyName(selected.companyToken());
				self.companyId(selected.id());
			}
		}

		////## to delete the company by confirming with user.
		//self.removeCompany = (selectedToBeRemoved: RexnordCompany) => {
		//	self.selecteditemtoremove = selectedToBeRemoved;

		//	var actionButtons: Array<IToastrActionButtonOptions> = [];
		//	actionButtons.push({
		//		actionButtonName: "Yes",
		//		actionClick: self.deleteitem
		//	});

		//	var toastrOptions1: IToastrOptions = {
		//		toastrPositionClass: "toast-top-middle",
		//		delayInseconds: 30,
		//		fadeOut: 30,
		//		typeOfAlert: "",
		//		title: "",
		//		actionButtons: actionButtons
		//	};

		//	Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.AreYouSureYouWantToDeleteThisRecord, "warning", null, toastrOptions1);
		//}

		self.deleteitem = () => {
			var listOfDeletedCompanies: _refVolumeCustomerMapping.Models.VolumeCustomerMapping = new _refVolumeCustomerMapping.Models.VolumeCustomerMapping();
			var company = new _refBillsIdentificationMapping.Models.VolumeCustomerBillsIdentificationMapping();
			company.Id = self.selecteditemtoremove.id();
			company.CustomerId = self.selecteditemtoremove.customerId();
			company.CompanyToken = self.selecteditemtoremove.companyToken();
			company.IsMarkedForDeletion = true;

			var companyList: Array<_refBillsIdentificationMapping.Models.VolumeCustomerBillsIdentificationMapping>;
			companyList = ko.observableArray([])();
			companyList.push(company);

			listOfDeletedCompanies.DeletedItems = companyList;

			var successCallBack = () => { self.getRexnordCompaniesList(); }
					var faliureCallBack = () => {
						var toastrOptions = {
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 10,
							fadeOut: 10,
							typeOfAlert: "",
							title: "",
						};

						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, "Some Error Occured", "error", null, toastrOptions);
					}
					self.purchaseOrderClient.insertUpdateOrDeleteVolumeCustomerBillsIdentificationMapping(listOfDeletedCompanies, successCallBack, faliureCallBack);
		}

		//To assign text the selected company name
		self.reportContainer.onGridColumnClick2 = function (Obj) {
			if (Obj != null) {
				self.companyName(Obj.CompanyToken);
				self.companyId(Obj.Id);
			}
		}

		//To Delete selected company
		self.reportContainer.onGridColumnClick = function (Obj) {
			var del = new RexnordCompany(Obj.Id, Obj.CustomerId, Obj.CompanyToken);

			self.selecteditemtoremove = del;

            if (self.checkMsgDisplay) {
                self.checkMsgDisplay = false;

                var actionButtons: Array<IToastrActionButtonOptions> = [];
                actionButtons.push({
                    actionButtonName: "Yes",
                    actionClick: self.deleteitem
                });

                actionButtons.push({
                    actionButtonName: "No",
                    actionClick: self.checkMsgClick
                });

                var toastrOptions1: IToastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 30,
                    fadeOut: 30,
                    typeOfAlert: "",
                    title: "",
                    actionButtons: actionButtons
                };

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.AreYouSureYouWantToDeleteThisRecord, "warning", self.checkMsgClick, toastrOptions1,self.checkMsgHide);
            }
		}

		//To check if Msg is clicked
		self.checkMsgClick = () => {
            self.checkMsgDisplay = true;
        }

	// to Check if Msg is hidden or closed
		self.checkMsgHide = () => {
            self.checkMsgDisplay = true;
        }
		//for search filter
		self.reportContainer.onSearchTextChange = (reportViewer, newSearchValue) => {
			if (newSearchValue.length >= 3 || newSearchValue.length == 0) {
				self.searchText(newSearchValue);
				//self.getReportData(self.reportAction);
				self.gridOptions.pagingOptions.currentPage(1);
			}
		};

		//## to load companies initially
		self.getRexnordCompaniesList();
	}
	//#endregion Constructor

	//#region Internal Methods
	private setPagingData(data, grid, gridOption) {
		Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
	}

	private setGridOptions(self: RexnordMappedCompaniesViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = true;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("RexnordCompanyMappingGrid");
		grOption.data = <any> self.reportData;
		grOption.columnDefinition = self.setGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "Id",
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
		grOption.showColumnMenu = true;
		return grOption;
	}

	private setGridColumnDefinitions() {
		var colDefinition: Array = [];
		var self = this;
		var removeCellTemplate = '<div style="text-align:center; margin-top:7px;"><input type="image" data-bind="click: function() { $userViewModel.onGridColumnClick($parent.entity) }"  src="Content/images/Icon_Trash.png"; /></div>';
		var companyCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'CompanyToken\'], click: function() { $userViewModel.onGridColumnClick2($parent.entity)}" />';

		colDefinition = [
			{ field: 'Id', displayName: 'Id', isRemovable: false, visible: false },
			{ field: 'CustomerId', displayName: 'CustomerId', isRemovable: false, visible: false },
			{ field: 'CompanyToken', displayName: 'Company Name', width: 1175, isRemovable: false, cellTemplate: companyCellTemplate},
			{ field: 'Delete', displayName: 'Delete', isRemovable: false, width: 75, sortable: false, cellTemplate: removeCellTemplate},

		];
		return colDefinition;
	}

	public load(dataToBind) {
		if (!dataToBind)
			return;

		var self = this;
		//self.gridOptions.data(dataToBind);
		self.setPagingData(ko.observableArray(dataToBind), self.gridOptions, self.reportAction);
	}

	//#endregion
	//close popup
	public closePopup(dialogResult) {
		dialogResult.__dialog__.close(this, dialogResult);
		return true;
	}

	// Shows the message box as pr the given title and message
	public showConfirmationMessage(message: string, title: string, fisrtButtoName: string, secondButtonName: string, yesCallBack: () => boolean, noCallBack: () => boolean) {
		var self = this;

		var varMsgBox: Array<IMessageBoxButtonOption> = [
			{
				id: 0, name: fisrtButtoName, callback: (): boolean => {
					return yesCallBack();
				},
			},
			{
				id: 1, name: secondButtonName, callback: (): boolean => {
					return noCallBack();
				}
			}
		];

		////initialize message box control arguments
		var optionControlArgs: IMessageBoxOption = {
			options: varMsgBox,
			message: message,
			title: title
		}; //Call the dialog Box functionality to open a Popup
		_app.showDialog('templates/messageBox', optionControlArgs, 'slideDown');
	}

	//#region Public Methods
	public initializeRexnordCompanies(companies: Array<IVolumeCustomerBillsIdentificationMapping>) {
		var self = this;
		if (self.rexnordCompaniesList != null) {
			self.rexnordCompaniesList.removeAll();
		}
		if (companies != null) {
			for (var i = 0; i < companies.length; i++) {
				self.rexnordCompaniesList.push(new RexnordCompany(companies[i].Id, companies[i].CustomerId, companies[i].CompanyToken));
			}
		}
	}

	//## to add/modify new company to the list
	public saveClick() {
        var self = this;
        self.isSave(false);
		//## if textbox is empty then show alert

        if (!self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.companyName()) ) {
            if (self.checkMsgDisplay) {
                self.checkMsgDisplay = false;

			var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        ddelayInseconds: 15,
                        fadeOut: 15,
                        typeOfAlert: "",
                        title: ""
                    }

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.EnterCompanyName, "info", self.checkMsgClick, toastrOptions,self.checkMsgHide);
            }
            self.isSave(true);
            self.companyName('');
            self.companyId(0);
		} else { //## else do either add/modify
			var listOfCompanies: _refVolumeCustomerMapping.Models.VolumeCustomerMapping = new _refVolumeCustomerMapping.Models.VolumeCustomerMapping();
			var companyList: Array<_refBillsIdentificationMapping.Models.VolumeCustomerBillsIdentificationMapping>;
			companyList = ko.observableArray([])();
			var company = new _refBillsIdentificationMapping.Models.VolumeCustomerBillsIdentificationMapping();
			company.Id = self.companyId();
			company.CustomerId = 23980;
			company.CompanyToken = self.companyName();
			company.IsMarkedForDeletion = false;
			companyList.push(company);
			if (self.companyId() > 0) {
				listOfCompanies.UpdatesItems = companyList;
			} else {
				listOfCompanies.AddedItems = companyList;
			}

			var successCallBack = () => {
				if (self.companyId() > 0) {
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;

					var toastrOptions = {
                                toastrPositionClass: "toast-top-middle",
                                delayInseconds: 15,
                                fadeOut: 15,
                                typeOfAlert: "",
                                title: ""
                            }
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.RecordUpdatedSuccessfully, "success", self.checkMsgClick, toastrOptions,self.checkMsgHide);
                    }
				} else {
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 15,
                            fadeOut: 15,
                            typeOfAlert: "",
                            title: ""
                        }
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.RecordSavedSuccessfully, "success", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                    }
				}
				self.getRexnordCompaniesList();
			},
                faliureCallBack = () => {
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 15,
                            fadeOut: 15,
                            typeOfAlert: "",
                            title: ""
                        }
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ErrorinAddModifyRexnordCompany, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                    }
				};

            self.purchaseOrderClient.insertUpdateOrDeleteVolumeCustomerBillsIdentificationMapping(listOfCompanies, successCallBack, faliureCallBack);
            self.isSave(true);
            self.companyName('');
            self.companyId(0);
		}
	}

	// To get the rexnord companies list
	public getRexnordCompaniesList() {
		var self = this;
		self.reportContainer.listProgress(true);
		var successCallBack = (data) => {
			self.load(data);
			self.reportContainer.listProgress(false);
		},
			faliureCallBack = () => {
				self.reportContainer.listProgress(false);
			};

		self.purchaseOrderClient.getRexnordMappedCompanies(successCallBack, faliureCallBack);
	}

    // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
    public attached() {
        _app.trigger('viewAttached');
    }

	public compositionComplete(view, parent) {
		$("#txtCompanyName").focus();
	}

	public activate() {
		return true;
	}
	public beforeBind() {
		var self = this;
	}

	public cleanup() {
		var self = this;

		self.rexnordCompaniesList.removeAll();
		self.reportContainer.cleanup("RexnordCompanyMappingGrid");

		for (var prop in self) {
			if (prop !== "cleanup")
				delete self[prop];
		}
		delete self;
	}
}