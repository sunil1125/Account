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
//#endregion

import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refCommonUtils = require('CommonUtils');
import _reportViewer = require('../templates/reportViewerControlV2');
import refVendorBillClient = require('services/client/VendorBillClient');
import refCarriersClient = require('services/client/CarriersClient');
import refEmailParam = require('services/models/Email/EmailParam');
import refEnums = require('services/models/common/Enums');
import _refVendorBillModel = require('services/models/vendorBill/VendorBillId');
import _refCarrierMappingDetailsModel = require('services/models/carrier/CarrierMappingDetails');
import _refCarrierContactDetailsModel = require('services/models/carrier/CarrierContactDetails');
import refMasCarrierControl = require('templates/searchMasCarrierAutoComplete');
import refMasCarrierSearch = require('services/models/common/searchMasCarrier');
import refCarrierDocument = require('services/models/carrier/CarrierDocument');
import _refPurchaseOrderSearchFilterModel = require('services/models/purchaseOrder/PurchaseOrderSearchFilter');
import refCommonClient = require('services/client/CommonClient');
/***********************************************
   CARRIER MAPPING VIEWMODEL
************************************************
** <summary>
** Carrier Mapping View Model.
** </summary>
** <createDetails>
** <id>US11279/80/81/82</id><by>Chadnan</by> <date>Aug/2014</date>
** </createDetails>}

***********************************************/

class CarrierMappingViewModel {
	//#region Properties
	errorCarrierMapping: KnockoutValidationGroup;
	public carrierMappingGrid: _reportViewer.ReportViewerControlV2 = null;
	public CarrierContactDetailsBoardsGrid: _reportViewer.ReportViewerControlV2 = null;
	public headerOptions: _reportViewer.ReportHeaderOption = null;
	public grid: _reportViewer.ReportGridOption = null;
	public reportAction: _reportViewer.ReportAction = null;
	public reportData: KnockoutObservableArray<ICarrierDetails> = null;
	public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	public getReportData: (reportAction: _reportViewer.ReportAction) => any;
	public gridOptions: any;
	public reportType: number;
	public modeType = ko.observable();
	private checkMsgDisplay: boolean = true;
	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	localStorageKey: KnockoutObservable<string> = ko.observable('');
	truckLoadDocumentTypeItemsList: KnockoutObservableArray<CarrierMappingTruckLoadDocumentView> = ko.observableArray([]);
	//For Visibility of Map/Unmap and Contact
	isMapContactEnable: KnockoutObservable<boolean> = ko.observable(false);
	isMapContactAndSaveEnable: KnockoutComputed<boolean>;
	commonClientCommand: refCommonClient.Common = new refCommonClient.Common();
	//For change legend name in view side
	isMap: KnockoutObservable<boolean> = ko.observable(false);
	isUnmap: KnockoutObservable<boolean> = ko.observable(false);
	isMapOrUnmap: KnockoutObservable<boolean> = ko.observable(false);
	isTruckLoadSelected: KnockoutObservable<boolean> = ko.observable(false);
	isSaveEnable: KnockoutObservable<boolean> = ko.observable(false);
	isSearchFilterItemsData: KnockoutObservable<boolean> = ko.observable(false);
	loadDocumnetDetails: () => any;

	//For TruckLoad Document
	onAttach: () => void;
	selectedDisabledDocument: KnockoutObservableArray<string> = ko.observableArray([]);
	UploadedFileName: KnockoutObservable<string> = ko.observable();
	uploadFileContent: string;
	enableAttachedButton: KnockoutComputed<boolean>;
	uploadedItem: any;
	deleteCarrierDocumnet: (item: CarrierMappingTruckLoadDocumentView) => any;

	uploadCarrierMappingrDocument: (obj, event: Event) => void;
	// For search Filter
	private searchText: KnockoutObservable<string>;
	vendorBillClient: refVendorBillClient.VendorBillClient = new refVendorBillClient.VendorBillClient();
	carriersClientCommands: refCarriersClient.CarriersClientCommands = new refCarriersClient.CarriersClientCommands();
	emailParam: refEmailParam.Models.EmailParameters = new refEmailParam.Models.EmailParameters();
	//properties for Map Fields
	carrierName: KnockoutObservable<string> = ko.observable('');
	carrierCode: KnockoutObservable<string> = ko.observable('');
	masCarrier: KnockoutObservable<string> = ko.observable('');
	legalName: KnockoutObservable<string> = ko.observable('');
	isBlock: KnockoutObservable<boolean> = ko.observable(false);
	// to show the progress bar
	listProgress: KnockoutObservable<boolean> = ko.observable(false);
	listProgressDetails: KnockoutObservable<boolean> = ko.observable(false);
	// To hold selected Record
	selectedItem: ICarrierDetails;
	carrierContactDetailViewModel: KnockoutObservable<CarrierContactDetailViewModel> = ko.observable(new CarrierContactDetailViewModel());
	masCarrierSerachViewModel: refMasCarrierControl.SearchMasCarrierAutoComplete;
	//CarrierContacts: KnockoutObservable<CarrierContacts> = ko.observable(new CarrierContacts());
	masCarrierId: KnockoutComputed<string>;
	masCarrierName: KnockoutComputed<string>;
	closeContact: () => any;
	saveContactDetails: () => any;
	sortCol: KnockoutObservable<string> = ko.observable('');
	sorttype: KnockoutObservable<string> = ko.observable('');
	searchFilter: KnockoutObservableArray<any> = ko.observableArray([]);
	searchFilterItems: Array<IPurchaseOrderSearchFilter> = new Array<_refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter>();
	searchFilterItem: IPurchaseOrderSearchFilter = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
	isLoaded: KnockoutObservable<boolean> = ko.observable(false);
	fromLocalStorage: KnockoutObservable<boolean> = ko.observable(false);
	currentDateTime: KnockoutObservable<string> = ko.observable('');
	commonUtils: CommonStatic = new Utils.Common();
	//#endregion Properties

	constructor() {
		var self = this;

		self.masCarrierSerachViewModel = new refMasCarrierControl.SearchMasCarrierAutoComplete("A valid MAS Carrier is required.");

		// to get the vendorId after selecting vendor
		self.masCarrierId = ko.computed(function () {
			if (self.masCarrierSerachViewModel.name() != null)
				return self.masCarrierSerachViewModel.id();

			return '';
		});

		// to get the vendor Name after selecting vendor
		self.masCarrierName = ko.computed(() => {
			if (self.masCarrierSerachViewModel.name() != null) {
				return self.masCarrierSerachViewModel.masCarrierName();
			}
			return null;
		});

		//#region Grid Settings
		self.headerOptions = new _reportViewer.ReportHeaderOption();
		//self.headerOptions.reportHeader = "Carrier Mapping";

		self.headerOptions.reportName = "Carrier Mapping";
		self.headerOptions.gridTitleHeader = " ";
		self.headerOptions.reportHeader = " ";

		self.searchText = ko.observable("");
		self.reportAction = new _reportViewer.ReportAction();
		self.grid = self.setGridOptions(self);

		//##region Export Options.
		var exportOpt = ko.observableArray([
			{ exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
			{ exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) },
			{ exportType: _reportViewer.ExportOptions.FILTER, name: ko.observable(""), enabled: ko.observable(true) }]);

		self.headerOptions.reportExportOptions = new _reportViewer.ReportExportControl(exportOpt);
		self.headerOptions.reportExportOptions.getUrl = function (exp: _reportViewer.IExportOptions): any {
			var searchClient = new refVendorBillClient.SearchModel();
			searchClient.SearchValue = self.searchText().trim();
			searchClient.SortOrder = self.sorttype();
			searchClient.SortCol = self.sortCol();
			searchClient.PageNumber = 1;
			searchClient.PageSize = exp.exportType === 1 ? 2000 : self.gridOptions.pagingOptions.totalServerItems();
			searchClient.SearchFilterItems = self.searchFilterItems;
			searchClient.ExportType = exp.exportType;

			var filterModel = { ExportURL: "Accounting/ExportCarrierMappingDetailsInExcel", FilterModel: searchClient };
			return filterModel;
			//return "Accounting/ExportCarrierMappingDetailsInExcel?searchText=" + self.searchText() + "&sortCol=" + self.sortCol() + "&sortOrder=" + self.sorttype();
		}
		//##endregion Export Options End.

		self.setReportCriteria = (reportActionObj: _reportViewer.ReportAction) => {
			if ((reportActionObj != undefined || reportActionObj != null) && (reportActionObj.gridOptions != undefined || reportActionObj.gridOptions != null) && (refSystem.isObject(reportActionObj.gridOptions.sortInfo())) && (reportActionObj.gridOptions.sortInfo().column != undefined || reportActionObj.gridOptions.sortInfo().column != null) && (reportActionObj.gridOptions.sortInfo().column.field != undefined || reportActionObj.gridOptions.sortInfo().column.field != null)) {
				self.sortCol(reportActionObj.gridOptions.sortInfo().column.field);
				self.sorttype(reportActionObj.gridOptions.sortInfo().direction);
			}
			else {
				self.sortCol("CarrierID");
				self.sorttype("asc");
			}
			if (reportActionObj.filter1selectedItemId == undefined || reportActionObj.filter1selectedItemId == 0) {
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 15,
					fadeOut: 15,
					typeOfAlert: "",
					title: ""
				}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectModeFromTheList, "info", null, toastrOptions);
				self.carrierMappingGrid.listProgress(false);
				self.carrierMappingGrid.selectedFilter1Item(self.modeType());
			}
			else {
				self.gridOptions = reportActionObj.gridOptions;

				// Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
				// we don't want any data on page load so we commented getReportdata  function.
				// Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
				if (self.modeType() != reportActionObj.filter1selectedItemId) {
					self.modeType(reportActionObj.filter1selectedItemId);
					self.carrierMappingGrid.columnDefinition(self.setGridColumnDefinitions());
				}

				self.reportAction = reportActionObj;
				if (self.isLoaded()) {
					self.getReportData(reportActionObj);
				}
			}
		};

		self.errorCarrierMapping = ko.validatedObservable({
			legalName: this.legalName,
			masCarrierSerachViewModel: self.masCarrierSerachViewModel
		});

		//set local storage key by url
		var url = $(location).attr('href');
		var urlArray = url.split('/');
		var localStorageId = urlArray.pop().toString().replace(/#/g, "");
		self.localStorageKey(localStorageId);
		if (localStorageId === "Mapping") {
			self.localStorageKey(localStorageId + "11");
		} else {
			self.localStorageKey(localStorageId);
		}

		self.getReportData = function (reportActionObj: _reportViewer.ReportAction) {
			var deferred = $.Deferred();
			var promise = deferred.promise();
			var pageno = 0;
			pageno = Number(self.gridOptions.pagingOptions.currentPage());
			if (pageno > 0) {
				// List View

				self.carrierMappingGrid.listProgress(true);
				if (self.carrierMappingGrid.reportColumnFilter.isFilterApply) {
				var list = self.carrierMappingGrid.reportColumnFilter.reportColumnFilters();
				self.searchFilterItems.removeAll();
				if (list.length > 0) {
					list.forEach((items) => {
						self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						if (items.selectedserviceType() != undefined && items.selectedOperatorType() != undefined) {
							self.searchFilterItem.FieldName = items.selectedserviceType().field;
							self.searchFilterItem.Operand = +items.selectedOperatorType().opratorId;
							self.searchFilterItem.SearchText = items.searchText();
							self.searchFilterItems.push(self.searchFilterItem);
						}
						if (self.searchFilterItems.length > 0 || items.selectedserviceType() != undefined) {
							self.isSearchFilterItemsData(true);
							//$('#gridPORexnordBoard').addClass('margin-top--36');
						} else {
							self.isSearchFilterItemsData(false);
							//$('#gridPORexnordBoard').removeClass('margin-top--36');
						}
					});
				}
					self.searchText('');
					self.gridOptions.filterOptions.filterText('');
				}
				var successCallBack = data => {
					self.setPagingData(data.CarrierDetails, data.TotalCount, self.gridOptions.pagingOptions.pageSize());
					self.carrierMappingGrid.listProgress(false);
					deferred.resolve(data, reportActionObj.view);
					self.carrierMappingGrid.invokeHighlight(self.searchText());
				}
					var faliureCallBack = message => {
						self.carrierMappingGrid.listProgress(false);

					////	var toastrOptions = {
					////		toastrPositionClass: "toast-top-middle",
					////		delayInseconds: 15,
					////		fadeOut: 15,
					////		typeOfAlert: "",
					////		title: ""
					////	}
					////Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ErrorOccurredWhileFetchingCarrierDetails, "error", null, toastrOptions);
				}
				var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems }
		    var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.CarrierMappingBoard, IsFilterApplied: self.carrierMappingGrid.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), FromLocalStorage: self.fromLocalStorage() };

				self.carriersClientCommands.getAllMappedCarrierDetails(filterDataToSave, successCallBack, faliureCallBack, self.gridOptions.pagingOptions);
			}
			return promise;
		};

		self.carrierMappingGrid = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
		self.carrierMappingGrid.onFilterChange = self.setReportCriteria;
		//self.carrierMappingGrid.showOptionalHeaderRow(true);

		//self.carrierMappingGrid.OptionalHeaderRowLocation('TOP');
		self.carrierMappingGrid.ForceChange();

		//for search filter
		self.carrierMappingGrid.onSearchTextChange = (reportViewer, newSearchValue) => {
			self.resetGridSelection(self);
			if (newSearchValue.length >= 3 || newSearchValue.length == 0) {
				var searchString = newSearchValue;
				self.searchText(searchString.trim());
				if (!self.carrierMappingGrid.reportColumnFilter.isFilterApply) {
					self.carrierMappingGrid.reportColumnFilter.clearAll();
				}
				self.carrierMappingGrid.reportColumnFilter.isFilterApply = false;
				self.getReportData(self.reportAction);
				self.gridOptions.pagingOptions.currentPage(1);
			}
		};

		//## After selection change re-assign the fields value
		self.carrierMappingGrid.afterSelectionChange = function (items: KnockoutObservableArray<any>) {
			window.kg.selectedCarrier = items[0];
			self.selectedItem = items[0];

			self.isMapContactEnable(true);
			var selectedRowCount = items.length;
			if (selectedRowCount > 0) {
				self.bindMapFields(self.selectedItem);
				self.getCarrierConatctDetails(self.selectedItem);
				self.isSaveEnable(true);
				if (items[0].MASCarrier === null || items[0].MASCarrier === 'undefined' || items[0].MASCarrier === "") {
					self.isMap(true);
					self.isMapOrUnmap(false);
					self.isUnmap(false);
				}
				else {
					self.isMap(false);
					self.isMapOrUnmap(false);
					self.isUnmap(true);
				}

				if (items[0].CarrierType === 'Truckload') {
					self.isTruckLoadSelected(true);

					// If truckload document and Document section is active the get the documents
					if ($("#document").hasClass("in")) {
						self.loadDocumnetDetails();
					}
				} else if (items[0].CarrierType !== 'Truckload' && self.isTruckLoadSelected()) {
					$("#documentLink").removeClass("active");
					$("#document").removeClass("active");
					$("#document").removeClass("in");

					//Removing CSSClass from CarrierContact if it is focused on truckload Carrier type
					$("#carrierContactLink").removeClass("active");
					$("#carrierContact").removeClass("active");
					$("#carrierContact").removeClass("in");

					//Activate CSSClass from CarrierContact if it is focused or not on truckload Carrier type
					$("#mapUnmapLink").addClass("active");
					$("#mapUnmap").addClass("active");
					$("#mapUnmap").addClass("in");
					self.isTruckLoadSelected(false);
				}
			} else {
				self.isSaveEnable(false);
			}

			if (self.isUnmap())
				self.masCarrierSerachViewModel.isValidationRequired(false);
			else if (self.isMap())
				self.masCarrierSerachViewModel.isValidationRequired(true);
		}

		self.legalName.extend({
			required: {
				message: 'A valid Legal Name is required.',
				onlyIf: () => {
					return (self.isMap());
				}
			}
		});

		self.closeContact = () => {
			self.carrierContactDetailViewModel(new CarrierContactDetailViewModel());
			self.carrierName('');
			self.carrierCode('');
			self.masCarrierSerachViewModel.masCarrierName('');
			self.masCarrierSerachViewModel.isValidationRequired(false);
			self.legalName('');
			self.resetGridSelection(self);
			self.isMap(false);
			self.isMapOrUnmap(true);
			self.isUnmap(false);
			return self.isMapContactEnable(false);
		}

		self.saveContactDetails = () => {
			self.carrierContactDetailViewModel().selectedCarrierContacts().errorCarrierContact.errors.showAllMessages();

			if (self.carrierContactDetailViewModel().selectedCarrierContacts().errorCarrierContact.errors().length === 0) {
				var details = self.carrierContactDetailViewModel().selectedCarrierContacts();

				var carrierContactDetails = new _refCarrierContactDetailsModel.Models.CarrierContactDetail();
				carrierContactDetails.CarrierId = self.selectedItem.CarrierId;
				carrierContactDetails.CarrierName = self.selectedItem.CarrierName;
				carrierContactDetails.ContactEmail = details.contactEmail();
				carrierContactDetails.Id = details.Id;
				carrierContactDetails.ContactFax = details.contactFax();
				carrierContactDetails.ContactName = details.contactName();
				carrierContactDetails.ContactPhone = details.contactphone();
				carrierContactDetails.ContactType = self.carrierContactDetailViewModel().contactType().Id;
				carrierContactDetails.DisplayName = self.carrierContactDetailViewModel().contactType().DisplayName;
				carrierContactDetails.MassCarrierID = details.MassCarrierID;

				//self.listProgress(true);
				self.listProgressDetails(true);
				refCarriersClient.CarriersClientCommands.prototype.SaveCarrierContactDetails(carrierContactDetails, (message) => {
					//Saving Successful Callback
					//self.listProgress(false);
					self.listProgressDetails(false);
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 15,
						fadeOut: 15,
						typeOfAlert: "",
						title: ""
					}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.ContactSavedSuccessfullyMessage, "success", null, toastrOptions);
					self.isMapContactEnable(false);
					self.closeContact();
					self.getReportData(self.reportAction);
				},
					(message) => {
						// Saving failed call back
						//self.listProgress(false);
						self.listProgressDetails(false);
						var toastrOptions = {
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 2,
							typeOfAlert: "",
							title: ""
						}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
					});
			}
		}

		//To check if Message is clicked
		self.checkMsgClick = () => {
			self.checkMsgDisplay = true;
		}

		// to Check if Message is hidden or closed
		self.checkMsgHide = () => {
			self.checkMsgDisplay = true;
		}

		//#region Truckload Document Event And Properties

		/*	This is triggered when the user is uploading a document.
		It saves the document object to be saved in system */
		self.uploadCarrierMappingrDocument = (obj, event: Event) => {
			var reader = new FileReader(),
				fileUploadObj = (<HTMLInputElement>event.target).files[0];
			var ext = fileUploadObj.name.split(".")[fileUploadObj.name.split(".").length - 1];

			reader.readAsDataURL(fileUploadObj);
			reader.onload = (imgsrc) => {
				self.uploadFileContent = imgsrc.target.result;
				self.UploadedFileName(fileUploadObj.name);
				var item = {
					FileContent: self.uploadFileContent,
					FileExtension: self.UploadedFileName().split(".")[self.UploadedFileName().split(".").length - 1],
					Description: self.UploadedFileName(),
					FileName: self.UploadedFileName(),
				}

				self.uploadedItem = item;
			}
		}

		self.deleteCarrierDocumnet = (item: CarrierMappingTruckLoadDocumentView) => {
			var documnetItem = new refCarrierDocument.CarrierPacketDocument();
			documnetItem.CarrierId = self.selectedItem.CarrierId;
			documnetItem.PackageType = item.documentType;
			documnetItem.CarrierCode = self.selectedItem.CarrierCode;
			documnetItem.DocumentPath = item.UploadedFileName();

			self.carriersClientCommands.deleteCarrierDocuments(documnetItem, () => {
				self.loadDocumnetDetails();
			}, () => {
					self.loadDocumnetDetails();
				});
		};

		// Call Server to get the data
		self.loadDocumnetDetails = () => {
			self.carriersClientCommands.getCarrierDocumentDetails(self.selectedItem.CarrierId, (data: Array<ICarrierPacketDocument>) => {
				if (refSystem.isArray(data)) {
					self.truckLoadDocumentTypeItemsList.removeAll();

					data.forEach((item) => {
						self.truckLoadDocumentTypeItemsList.push(new CarrierMappingTruckLoadDocumentView(item, self.deleteCarrierDocumnet));
					});
				}

				self.UploadedFileName('');
			}, (errorMessage) => {
					self.UploadedFileName('');
				});
		};

		//Enables Upload Button once all the mandatory fields are filled up.self.uploadedFileName.length > -1 &&
		self.enableAttachedButton = ko.computed(() => {
			var isAnySelected = $.grep(self.truckLoadDocumentTypeItemsList(), (item) => {
				return item.isChecked() && item.isEnable();
			});

			if (self.UploadedFileName() != undefined && self.UploadedFileName() != "" && isAnySelected.length > 0) {
				return true;
			}

			return false;
		});

		self.isMapContactAndSaveEnable = ko.computed(() => {
			if (self.isMapContactEnable()) {
				if (self.isSaveEnable()) {
					return true;
				}
				else
				{
					return false;
				}
			}
		});

		// Handles the attach command
		self.onAttach = () => {
			//self.listProgress(true);
			self.listProgressDetails(true);
			var modelToSave = new refCarrierDocument.CarrierDocument();
			modelToSave.CarrierPacketDocument = ko.observableArray()();
			modelToSave.CarrierId = self.selectedItem.CarrierId;
			modelToSave.UploadedFileDetails = self.uploadedItem;

			self.truckLoadDocumentTypeItemsList().forEach((item) => {
				if (item.isChecked() && !item.isFileUploaded()) {
					var documnetItem = new refCarrierDocument.CarrierPacketDocument();
					documnetItem.CarrierId = self.selectedItem.CarrierId;
					documnetItem.PackageType = item.documentType;
					documnetItem.CarrierCode = self.selectedItem.CarrierCode;
					modelToSave.CarrierPacketDocument.push(documnetItem);

					// Disable the attach button once clicked
					item.isEnable(false);
				}
			});

			self.carriersClientCommands.saveCarrierDocuments(modelToSave, () => {
				self.loadDocumnetDetails();
				//self.listProgress(false);
				self.listProgressDetails(false);
			}, () => {
				self.loadDocumnetDetails();
				//self.listProgress(false);
				self.listProgressDetails(false);
				});
		};

		//#endregion Truckload Document

		return self;
	}

	//#region Internal Public methods

	//clearing all filter data
	public onClickClearAll() {
		var self = this;
		self.carrierMappingGrid.reportColumnFilter.clearAll();
		self.carrierMappingGrid.reportColumnFilter.applyFilter();
		self.isSearchFilterItemsData(false);
		self.isMapContactEnable(false);
		self.closeContact();
		//$('#gridPORexnordBoard').removeClass('margin-top--36');
	}

	//For Save Map Details
	public saveMapDetails() {
		var self = this;
		if (self.validateMap())
			return false;

		//self.listProgress(true);
		self.listProgressDetails(true);
		self.selectedItem.LegalName = self.legalName();
		self.selectedItem.IsBlockedFromSystem = self.isBlock();
		self.selectedItem.MASCarrier = self.masCarrier();
		self.selectedItem.MassId = self.masCarrierId();
		refCarriersClient.CarriersClientCommands.prototype.SaveCarrierMappingDetail(self.selectedItem, (message) => {
			//Saving Successful Callback
			//self.listProgress(false);
			self.listProgressDetails(false);
			if (self.checkMsgDisplay) {
				self.checkMsgDisplay = false;
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 15,
					fadeOut: 15,
					typeOfAlert: "",
					title: ""
				}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.MappingsSavedSuccessfullyMessage, "success", self.checkMsgClick, toastrOptions, self.checkMsgHide);
			}
			self.isMapContactEnable(false);
            self.closeMap();
            //setTimeout(self.getReportData(self.reportAction), 3000)

            setTimeout(function ()
            { self.getReportData(self.reportAction); },
                1500);

			//self.getReportData(self.reportAction);
		},
			(message) => {
				// Saving failed call back
				//self.listProgress(false);
				self.listProgressDetails(false);
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 15,
					fadeOut: 15,
					typeOfAlert: "",
					title: ""
				}
					Utility.ShowToastr(false, message, "error", null, toastrOptions);
			});
	}

	//Validating Vendor Bill property
	public validateMap() {
		var self = this;

		self.masCarrierSerachViewModel.vaildateSearchMasCarrierControl();
		if (self.errorCarrierMapping.errors().length != 0) {
			self.errorCarrierMapping.errors.showAllMessages();
			return true;
		} else {
			return false;
		}
	}

	// Binding Mapping Fields
	public bindMapFields(selectedItem) {
		var self = this;
		self.carrierName(selectedItem.CarrierName);
		self.carrierCode(selectedItem.CarrierCode);
		self.masCarrierSerachViewModel.masCarrierName('');
		self.masCarrierSerachViewModel.id('');
		self.masCarrierSerachViewModel.name(new refMasCarrierSearch.Models.MasCarrierSearch());
		self.legalName('');
		self.isBlock(selectedItem.IsBlockedFromSystem);
	}
	// Initializes the data and binds to the UI
	public initializeGridData(data: Array<any>) {
		var self = this;
		if (data) {
			self.carrierMappingGrid.OptionalHeaderRowLocation('TOP');
			$("#kgSpanFooterSelectedItems").text('0');
			self.setPagingData(ko.observableArray(data), self.gridOptions, self.reportAction);
			self.carrierMappingGrid.listProgress(false);
			$('.noLeftBorder').parent().css('border-left', '0');
			$('.noRightBorder').parent().css('border-right', '0');
		}
		else {
			self.carrierMappingGrid.listProgress(false);
		}
	}

	public closeMap() {
		var self = this;
		self.resetGridSelection(self);
		self.carrierContactDetailViewModel(new CarrierContactDetailViewModel());
		self.carrierName('');
		self.carrierCode('');
		self.masCarrierSerachViewModel.masCarrierName('');
		self.masCarrierSerachViewModel.isValidationRequired(false);
		self.legalName('');
		self.isMap(false);
		self.isMapOrUnmap(true);
		self.isUnmap(false);
		return self.isMapContactEnable(false);
	}

	//#endregion Public Methods

	//#region Life Cycle Event
	// Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
	public attached() {
		_app.trigger('viewAttached');
	}

	public activate() {
		return true;
	}

	public deactivate() {
		window.kg.selectedCarrier = undefined;
		var self = this;
		var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems }
		 var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.CarrierMappingBoard, IsFilterApplied: self.carrierMappingGrid.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), isLoaded: true };
		LocalStorageController.Set(self.localStorageKey(), filterDataToSave);

        self.cleanup()
	}

    public cleanup() {
        var self = this;
        self.masCarrierSerachViewModel.cleanup();
        for (var property in self) {
            if (property != "cleanup")
                delete self[property];
        }
        delete self;
    }

	public beforeBind() {
		var self = this;
		if (!self.isMap() && !self.isUnmap()) {
			self.isMapOrUnmap(true);
		}
		self.load();
	}

	private load() {
		var self = this;
		var pageRecord = LocalStorageController.Get(self.localStorageKey());
		if (pageRecord != null) {
			self.gridOptions.pagingOptions.currentPage(pageRecord.PageNo);
			self.gridOptions.pagingOptions.pageSize(pageRecord.UserGridSetting.PageSize);

			var list = pageRecord.UserGridSetting.Filters;
			self.searchFilterItems.removeAll();
			if (list.length > 0 && list[0].FieldName) {
				list.forEach((items) => {
					self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						self.searchFilterItem.FieldName = items.FieldName;
					self.searchFilterItem.Operand = items.Operand;
					self.searchFilterItem.SearchText = items.SearchText;
					self.searchFilterItems.push(self.searchFilterItem);
				});
				self.carrierMappingGrid.reportColumnFilter.addFilter(self.searchFilterItems);
			}
			if (typeof pageRecord.isLoaded !== "undefined") {
				self.isLoaded(pageRecord.isLoaded);
			}
			self.gridOptions.filterOptions.filterText(pageRecord.GridSearchText);
			self.searchText(pageRecord.GridSearchText);
			self.fromLocalStorage(true);
		}
		self.getReportData(self.reportAction);
	}

	public compositionComplete() {
		var self = this;
		var successCallBack = data => {
			self.searchText('');
			var filterlist = data.Filters;
			self.gridOptions.pagingOptions.pageSize(data.PageSize);
			self.gridOptions.pagingOptions.currentPage(1);
			self.searchFilterItems.removeAll();
			if (filterlist.length > 0 && filterlist[0].FieldName) {
				filterlist.forEach((items) => {
					self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter()
						self.searchFilterItem.FieldName = items.FieldName;
					self.searchFilterItem.Operand = items.Operand;
					self.searchFilterItem.SearchText = items.SearchText;
					self.searchFilterItems.push(self.searchFilterItem);
				});
				self.carrierMappingGrid.reportColumnFilter.addFilter(self.searchFilterItems);
				if (self.searchFilterItems.length > 0) {
					self.isSearchFilterItemsData(true);
					//$('#gridPORexnordBoard').addClass('margin-top--36');
				} else {
					self.isSearchFilterItemsData(false);
					//$('#gridPORexnordBoard').removeClass('margin-top--36');
				}
			}
			self.gridOptions.filterOptions.filterText('');
			self.searchText('');
			self.isLoaded(true);
			self.fromLocalStorage(true);
		};
		if (!LocalStorageController.Get(self.localStorageKey())) {
			self.commonClientCommand.GetUserGridSettings(refEnums.Enums.FilterViewName.CarrierMappingBoard, successCallBack);
		} else {
			//using to show clear filter button after saving filtered data in local storage and switching between tab
			var filteredData = LocalStorageController.Get(self.localStorageKey());
			if (filteredData.UserGridSetting.Filters.length > 0) {
				self.isSearchFilterItemsData(true);
				//$('#gridPORexnordBoard').addClass('margin-top--36');
			} else {
				self.isSearchFilterItemsData(false);
				//$('#gridPORexnordBoard').removeClass('margin-top--36');
			}
		}
	}

	//#endregion}

	//#region Private Methods

	public reloadPage() {
		var self = this;
		LocalStorageController.Set(self.localStorageKey(), undefined);
		LocalStorageController.Set(self.localStorageKey() + 'lastReloadDateTime', undefined);
		self.isMapContactEnable(false);
		self.closeContact();
		self.beforeBind();
	}

	//set Date Time for record of last refreshed
	public setDateTimeOfReload() {
		var self = this;
		if (LocalStorageController.Get(self.localStorageKey() + 'lastReloadDateTime')) {
			var localDateTimeOfReload = LocalStorageController.Get(self.localStorageKey() + 'lastReloadDateTime');
			self.currentDateTime(localDateTimeOfReload);
		} else {
			var onlyDate = self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy');
			var date = new Date();
			var str = 'Last Refreshed: ' + onlyDate + ' ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
			LocalStorageController.Set(self.localStorageKey() + 'lastReloadDateTime', str);
			//var reloadDate = LocalStorageController.Get(self.vendorBillDetailsViewModel.proNumber() + 'lastReloadDateTime');
			self.currentDateTime(str);
		}
	}

	private setPagingData(data, page, pageSize) {
		var self = this;
		self.gridOptions.data(data);
		self.gridOptions.data.valueHasMutated()
		self.gridOptions.pagingOptions.totalServerItems(page);
	}

	// Sets the options required properties of the grid
	private setGridOptions(self: CarrierMappingViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = true;
		grOption.showGridSearchFilter = true;
		grOption.showPageSize = true;

		grOption.UIGridID = ko.observable("CarrierMappingGrid");
		grOption.data = <any> self.reportData;
		grOption.columnDefinition = self.setGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "CarrierID",
			order: "desc"
		};
		grOption.pageSizes = [10, 25, 50, 100];
		grOption.pageSize = 10;
		grOption.totalServerItems = 0;
		grOption.currentPage = 1;
		grOption.jqueryUIDraggable = true;
		grOption.canSelectRows = true;
		grOption.selectWithCheckboxOnly = true;
		grOption.displaySelectionCheckbox = true;
		grOption.multiSelect = false;
		grOption.enablePaging = false;
		grOption.viewPortOptions = false;
		grOption.enableSaveGridSettings = true;
		grOption.useClientSideFilterAndSort = false;
		grOption.showColumnMenu = true;

		return grOption;
	}

	private resetGridSelection(self) {
		window.kg.toggleSelection(false);
	}
	// Sets the columns in the grid
	private setGridColumnDefinitions() {
		// ReSharper disable once AssignedValueIsNeverUsed
		var colDefinition: Array = [];

		colDefinition = [
			{ field: 'CarrierName', displayName: 'Carrier Name', type: _reportViewer.DataTypes.String },
			{ field: 'CarrierCode', displayName: 'Code', width: 90, type: _reportViewer.DataTypes.String },
			{ field: 'CarrierType', displayName: 'Carrier Type', width: 123, type: _reportViewer.DataTypes.String },
			{ field: 'MASCarrier', displayName: 'MAS Carrier', width: 190, type: _reportViewer.DataTypes.String },
			{ field: 'MASCode', displayName: 'MAS Code', width: 114, type: _reportViewer.DataTypes.String }
		];

		return colDefinition;
	}

	private getCarrierConatctDetails(selectedItem: ICarrierDetails) {
		var self = this;
		//self.carrierContactDetailViewModel().contactCarrierName(self.selectedItem.CarrierName);
		var successCallBack = (data: ICarrierContacts) => {
			if (data) {
				self.carrierContactDetailViewModel(new CarrierContactDetailViewModel());
				self.carrierContactDetailViewModel().addConatctList(data.CarrierContactDetails, data.CarrierTypes);
				self.carrierContactDetailViewModel().contactCarrierName(selectedItem.CarrierName);
			}
		},
			faliureCallBack = () => {
			};

		self.carriersClientCommands.getCarrierTypesDetails(self.selectedItem.CarrierId, successCallBack, faliureCallBack);
	}

	//#endregion Private Methods
}

export class CarrierContactDetailViewModel {
	conatctLists: KnockoutObservableArray<CarrierContacts> = ko.observableArray();
	selectedCarrierContacts: KnockoutObservable<CarrierContacts> = ko.observable(new CarrierContacts());
	contactTypeList: KnockoutObservableArray<ICarrierContactType> = ko.observableArray();
	contactCarrierName: KnockoutObservable<string> = ko.observable('');
	contactType: KnockoutObservable<any> = ko.observable();

	selected: (data) => any;
	addConatctList: (conatctList: Array<ICarrierContactDetails>, contactTypeList: Array<ICarrierContactType>) => any;

	constructor(carrierContactDetails?: ICarrierContactDetails) {
		var self = this;

		self.addConatctList = (conatctList: Array<ICarrierContactDetails>, contactTypeList: Array<ICarrierContactType>) => {
			self.contactTypeList(contactTypeList);

			conatctList.forEach((item) => {
				self.conatctLists.push(new CarrierContacts(item, self.selected, contactTypeList));
				self.contactCarrierName(item.CarrierName);
			});
		}

		self.selected = (data: any) => {
			if (data) {
				var contactType = data.contactType();

				if (self.contactTypeList()) {
					var selectedContactType = $.grep(self.contactTypeList(), (item: ICarrierContactType) => {
						return item.Id === contactType;
					});

					if (selectedContactType && selectedContactType.length > 0) {
						self.contactType(selectedContactType[0]);
					}
				}

				self.selectedCarrierContacts(data);
			}
		}
	}
}

export class CarrierContacts {
	//#region Properties
	errorCarrierContact: KnockoutValidationGroup;
	//#endregion Properties
	//properties for Contact Field
	Id: number;
	MassCarrierID: number;
	FirstMailPeriod: number;
	SecondMailPeriod: number;
	UpdatedBy: number;
	CarrierId: number;
	contactTypes: KnockoutObservableArray<ICarrierContactType> = ko.observableArray();
	contactCarrierName: KnockoutObservable<string> = ko.observable('');
	contactType: KnockoutObservable<any> = ko.observable();
	contactName: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "A valid Contact Name is required." } });
	contactEmail: KnockoutObservable<string> = ko.observable('').extend({ required: { message: "Please Enter  Email" }, email: true });
	contactphone: KnockoutObservable<string> = ko.observable('');
	contactFax: KnockoutObservable<string> = ko.observable('').extend({
		required: {
			message: 'Please Enter Fax Number.',
		},
		minLength: { message: "Please Enter 10 digit Fax Number", params: 13 }
	});

	displayName: KnockoutObservable<string> = ko.observable();

	selected: (data) => any;
	completeData: any;

	constructor(carrierContactDetails?: ICarrierContactDetails, selected?: Function, contactTypes?: Array<ICarrierContactType>) {
		var self = this;

		self.errorCarrierContact = ko.validatedObservable({
			contactphone: self.contactphone,
			contactFax: self.contactFax,
			contactName: self.contactName,
			contactEmail: self.contactEmail
		});

		self.contactTypes(contactTypes);

		self.selected = (data) => {
			self.completeData = data;
			if (selected && typeof selected === 'function') {
				selected(data);
			}

			return true;
		}

		self.contactType.subscribe((item) => {
			var list = 0;
		});

		self.contactphone.extend({
			required: {
				message: 'Please Enter Phone Number.',
			},
			minLength: {
				message: "Please Enter 10 digit Phone Number",
				params: 13,
			}
		});

		if (carrierContactDetails) {
			self.contactName(carrierContactDetails.ContactName);
			self.contactEmail(carrierContactDetails.ContactEmail);
			self.contactphone(carrierContactDetails.ContactPhone);
			self.contactFax(carrierContactDetails.ContactFax);
			self.displayName(carrierContactDetails.DisplayName);
			self.contactCarrierName(carrierContactDetails.CarrierName);
			self.contactType(carrierContactDetails.ContactType);

			self.Id = carrierContactDetails.Id;
			self.MassCarrierID = carrierContactDetails.MassCarrierID;
			self.FirstMailPeriod = carrierContactDetails.FirstMailPeriod;
			self.SecondMailPeriod = carrierContactDetails.SecondMailPeriod;
			self.UpdatedBy = carrierContactDetails.UpdatedBy;
			self.CarrierId = carrierContactDetails.CarrierId;
		}
	}

	// this function is used to convert formatted phone number.
	public formatPhoneNumber(field) {
		var phone = field();
		var self = this;
		if (phone && phone.length > 10 && phone.length <= 15) {
			phone = phone.replace(/[^0-9]/g, '');
			phone = phone.replace(/(\d{3})(\d{3})(\d{4})(\d{1})/, "($1)$2-$3x$4");
			field(phone);
		}
		if (phone && phone.length >= 1 && phone.length <= 10) {
			phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
			field(phone);
		}
		if (phone.length > 15) {
			phone = phone.replace(/[^0-9]/g, '');
			if (phone.length > 10) {
				phone = phone.substring(0, 15);
			}
			phone = phone.replace(/(\d{3})(\d{3})(\d{4})(\d{1})/, "($1)$2-$3x$4");
			field(phone);
		}
	}
	// this function is used to convert formatted Fax number.
	public formatFaxNumber(field) {
		var phone = field();
		if (phone && phone.length >= 1) {
			phone = phone.replace(/[^0-9]/g, '');
			if (phone.length > 10) {
				phone = phone.substring(0, 10);
			}
			phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
			field(phone);
		}
	}
}

/*
** <summary>
** TruckLoad Document model
** </summary>
** <createDetails>
** <id>US12731</id> <by>Chandan</by> <date>17-10-2014</date>
** </createDetails>
** <changeHistory>
** <id></id> <by></by> <date></date>
** </changeHistory>
*/
class CarrierMappingTruckLoadDocumentView {
	//For TruckLoad Document
	carriersClientCommands: refCarriersClient.CarriersClientCommands = new refCarriersClient.CarriersClientCommands();
	documentTypeName: KnockoutObservable<string> = ko.observable();
	isChecked: KnockoutObservable<boolean> = ko.observable(false);
	selectedDisabledDocument: KnockoutObservableArray<string> = ko.observableArray([]);
	UploadedFileName: KnockoutObservable<string> = ko.observable();
	uploadFileContent: string;
	isEnable: KnockoutObservable<boolean> = ko.observable(true);
	deleteAction: (item: CarrierMappingTruckLoadDocumentView) => any;
	isFileUploaded: KnockoutObservable<boolean> = ko.observable(true);
	documentType: number;
	carrierId: number;
	isInsuranceExpired: KnockoutObservable<boolean> = ko.observable(false);
	documentPathToView: KnockoutObservable<string> = ko.observable();

	// constructor which takes two argument one is for data and second is the delete call back
	constructor(documentItem: ICarrierPacketDocument, deleteAction: (item: CarrierMappingTruckLoadDocumentView) => any) {
		var self = this;

		self.documentTypeName(documentItem.DocumentName);
		self.isFileUploaded(documentItem.IsDocumentsUploaded);
		self.isChecked(documentItem.IsDocumentsUploaded);
		self.isEnable(!documentItem.IsDocumentsUploaded);
		self.documentType = documentItem.PackageType;
		self.carrierId = documentItem.CarrierId;
		self.UploadedFileName(documentItem.DocumentPath);
		self.isInsuranceExpired(documentItem.IsInsuranceExpired);
		self.documentPathToView(documentItem.DocumentPathToView);
		// Handles the delete action and calls the main view delete callback
		self.deleteAction = (item: CarrierMappingTruckLoadDocumentView) => {
			deleteAction(item);
		};

		return self;
	}
}

return CarrierMappingViewModel;