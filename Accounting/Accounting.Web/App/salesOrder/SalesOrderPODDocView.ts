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

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import _refAppShell = require('shell');
import refEnums = require('services/models/common/Enums');
import refSalesOrderColumn = require('services/client/SalesOrderClient');
import refUploadFileModel = require('services/models/salesOrder/SalesOrderUploadFileModel');
import _reportViewer = require('../templates/reportViewerControlV2');
//#endregion

/*
** <summary>
** Sales Order POD Doc View Model.
** </summary>
** <createDetails>
** <by>Bhanu Pratap</by> <date>09-08-2014</date>
** </createDetails>
** <changeHistory>
** <id>DE22053</id> <by>Shreesha Adiga</by> <date>09-03-2016</date><description>If the selected item from the grid is insurance certificate thn don't let the user update</description>
** <id>DE26026</id> <by>Vasanthakumar</by> <date>16-03-2017</date><description>Not able to see Pod documents</description>
** </changeHistory>
*/
export class SalesOrderPODDocViewModel {
	//#region Properties
	salesOrderPodDocDetail: KnockoutObservableArray<salesOrderPodDocDetails> = ko.observableArray([]);
	onAdd: () => void;
	onUpdate: () => void;
	currentUser: KnockoutObservable<IUser> = ko.observable();
	docOwner: KnockoutObservable<string> = ko.observable('');
	fileType: KnockoutObservable<string> = ko.observable('');
	//selecteedNotesType: KnockoutObservable<string> = ko.observable("Select");
	canAdd: KnockoutObservable<boolean> = ko.observable(false);
	salesOrderOwnerTypes: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	selectedOwnerType: KnockoutObservable<number> = ko.observable(0);
	salesOrderFileTypes: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	selectedFileType: KnockoutObservable<number> = ko.observable(0);
	
	// ##START: DE22053
	descriptionOfSelctedItem: KnockoutObservable<string> = ko.observable('');
	// ##END: DE22053

	//For removing item
	removeLineItem: (lineItem: salesOrderPodDocDetails) => void;
	public deleteSalesOrderPODDocList: () => any;
	private selectedlineitem: salesOrderPodDocDetails;
	//For Tracking Change
	getBITrackChange: () => string[];
	isBIDirty: KnockoutComputed<boolean>;
	onChangesMade: (dirty: boolean) => any;
	returnValue: KnockoutObservable<boolean> = ko.observable(false);

	ischange: KnockoutObservable<boolean> = ko.observable(false);
	//For Upload File
	uploadFileContent: string;
	UploadedFileName: KnockoutObservable<string> = ko.observable();
	FileName: KnockoutObservable<string> = ko.observable();
	uploadSalesOrderDocument: (obj, event: Event) => void;
	uploadedItem: any;
	uploadedItems: KnockoutObservableArray<any> = ko.observableArray();
	enableUploadButton: KnockoutComputed<boolean>;
	enableUpdateButton: KnockoutComputed<boolean>;
	shipmentId: KnockoutObservable<number> = ko.observable(0);
	carrierId: KnockoutObservable<number> = ko.observable(0);
	bolNumber: KnockoutObservable<string> = ko.observable();
	canDelete: KnockoutObservable<boolean> = ko.observable(true);

	//For upload button
	isEnableUpload: KnockoutObservable<boolean> = ko.observable(true);
	isEnableBrowse: KnockoutObservable<boolean> = ko.observable(false);
	//For filE extensions
	isPOD: KnockoutObservable<boolean> = ko.observable(true);
	isBolRc: KnockoutObservable<boolean> = ko.observable(false);
	isDocOther: KnockoutObservable<boolean> = ko.observable(false);
	isReadOnly: KnockoutObservable<boolean> = ko.observable(true);
	public reportContainer: _reportViewer.ReportViewerControlV2 = null;
	public header: _reportViewer.ReportHeaderOption = null;
	public grid: _reportViewer.ReportGridOption = null;
	public reportAction: _reportViewer.ReportAction = null;
	public reportData: KnockoutObservableArray<salesOrderPodDocDetails> = null;
	public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	public getReportData: () => void;
	public gridOptions: any;
	public reportType: number;
	public modeType = ko.observable();
	private checkMsgDisplay: boolean = true;
	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	commonUtils = new Utils.Common()
	selected: (data) => any;
	oldFileType: KnockoutObservable<string> = ko.observable('');
	salesorderClientCommand: refSalesOrderColumn.SalesOrderClient = new refSalesOrderColumn.SalesOrderClient();
	isEnable: KnockoutObservable<boolean> = ko.observable(true);

	disposables: Array<any> = [];
	//#endregion

	//#region Initializes the properties of this class
	constructor() {
		var self = this;
		self.getLoggedInUserDetails();
		if (refSystem.isObject(refEnums.Enums.DocumentType)) {
			self.salesOrderFileTypes.removeAll();
			for (var item in refEnums.Enums.DocumentType) {
				self.salesOrderFileTypes.push(refEnums.Enums.DocumentType[item]);
			}
		}
		if (refSystem.isObject(refEnums.Enums.DocumentOwner)) {
			self.salesOrderOwnerTypes.removeAll();
			for (var item in refEnums.Enums.DocumentOwner) {
				self.salesOrderOwnerTypes.push(refEnums.Enums.DocumentOwner[item]);
			}
		}

		// Handles the add command
		self.onAdd = () => {
			// Try to get the current user again if first time failed
			self.isEnableBrowse(false);
			if (!self.currentUser()) {
				self.getLoggedInUserDetails();
			}

			var uploadResquestModel = new refUploadFileModel.Models.SalesOrderUploadFileModel();

			uploadResquestModel.Description = self.FileName();
			uploadResquestModel.DocumentType = self.fileType();
			uploadResquestModel.OwnerType = self.docOwner();
			uploadResquestModel.ShipmentId = self.shipmentId();
			uploadResquestModel.CarrierId = self.carrierId();
			uploadResquestModel.BolNumber = self.bolNumber();
			uploadResquestModel.UploadedFileDetails = self.uploadedItem;

			var uploadLine = self.getSalesOrderPodDocDetails(self, '');
			//To disable the Upload button
			self.reportContainer.listProgress(true);
			//self.UploadedFileName('');
			self.salesorderClientCommand.uploadAndGetUploadedResponse(uploadResquestModel, (result) => {
				uploadLine.fileUrl = result.UploadedFilePath;
				uploadLine.Id = result.Id;
				uploadLine.canDelete = true;
				uploadLine.imagePath = result.ImagePath;
				self.salesOrderPodDocDetail.unshift(uploadLine);
				self.setPagingData(ko.observableArray(self.salesOrderPodDocDetail()), self.gridOptions, self.reportAction);
				self.reportContainer.listProgress(false);
				self.resetPODDOC();
				self.isEnableUpload(true);
				self.resetGridSelection(self);
			}, () => { });
			//self.ischange(true);
			//if (self.onChangesMade) {
			//	self.onChangesMade(self.ischange());
			//}
			self.canAdd(false);
		};

		// Handles the Update command
		self.onUpdate = () => {
			// Try to get the current user again if first time failed
			if (!self.currentUser()) {
				self.getLoggedInUserDetails();
			}
			var index = self.salesOrderPodDocDetail.indexOf(self.selectedlineitem);
			self.salesOrderPodDocDetail()[index].description(self.FileName());
			self.salesOrderPodDocDetail()[index].docOwner(self.commonUtils.getEnumValueById(refEnums.Enums.DocumentOwner, self.docOwner()));

			var uploadLine = self.getSalesOrderPodDocDetails(self, '');
			//self.salesOrderPodDocDetail.unshift(new salesOrderPodDocDetails(self.FileName(), self.commonUtils.getEnumValueById(refEnums.Enums.DocumentOwner, self.docOwner()), self.commonUtils.getEnumValueById(refEnums.Enums.DocumentType, self.fileType()), Date.now(), self.currentUser().FullName));
			var uploadFileDetails: ISalesOrderUploadFileModel = new refUploadFileModel.Models.SalesOrderUploadFileModel();
			uploadFileDetails.Id = self.selectedlineitem.Id;
			uploadFileDetails.Description = self.FileName();
			uploadFileDetails.OwnerType = self.docOwner();

			self.reportContainer.listProgress(true);
			self.UploadedFileName('');
			self.salesorderClientCommand.updatePodDoc(uploadFileDetails, (result) => {
				uploadLine.Id = result.Id;
				self.salesOrderPodDocDetail()[index].canDelete = true;
				//self.salesOrderPodDocDetail.unshift(uploadLine);
				self.setPagingData(ko.observableArray(self.salesOrderPodDocDetail()), self.gridOptions, self.reportAction);
				self.reportContainer.listProgress(false);
				self.resetPODDOC();
				self.isEnableUpload(true);
				//self.resetGridSelection(self);
			}, () => { });
			//self.ischange(true);
			//if (self.onChangesMade) {
			//	self.onChangesMade(self.ischange());
			//}
			self.canAdd(false);
		};

		self.header = new _reportViewer.ReportHeaderOption();
		self.header.reportHeader = "";
		self.header.reportName = "Sales POD Doc";
		self.header.gridTitleHeader = "";
		//initialize date filters
		self.reportAction = new _reportViewer.ReportAction();
		self.grid = self.setGridOptions(self);

		self.setReportCriteria = (reportActionObj: _reportViewer.ReportAction) => {
			this.gridOptions = reportActionObj.gridOptions;
			if (this.reportAction != null) {
				if ((this.modeType() != reportActionObj.filter1selectedItemId) || (this.reportAction.view != reportActionObj.view) ||
					(reportActionObj.dateFrom != this.reportAction.dateFrom) || (reportActionObj.dateTo != this.reportAction.dateTo)) {
					this.gridOptions.pagingOptions.currentPage(1);
				}
			}

			// Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
			// we don't want any data on page load so we commented getReportdata  function.
			// self.getReportData();
			this.reportAction = reportActionObj;

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

		self.reportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);
		self.reportContainer.showOptionalHeaderRow(false);
		self.reportContainer.OptionalHeaderRowLocation('TOP');
		self.reportContainer.onFilterChange = self.setReportCriteria;
		self.reportContainer.ForceChange();

		//if we click on grid ROW then notes will be appear in the text area field. (canSelectRows => true;)
		self.reportContainer.afterSelectionChange = function (items: KnockoutObservableArray<any>) {
			var selectedRowCount = items.length;
			var file;
			self.isEnableUpload(false);
			self.isEnableBrowse(false);
			if (selectedRowCount > 0) {
				self.selectedlineitem = items[0];
				self.FileName(items[0].description());
				self.docOwner(self.commonUtils.getEnumIdByValue(refEnums.Enums.DocumentOwner, items[0].docOwner()));
				file = self.commonUtils.getEnumIdByValue(refEnums.Enums.DocumentType, items[0].fileType());
				self.oldFileType(file);
				self.fileType(file);
				self.UploadedFileName(item[0].fileUrl);
				// ##START: DE22053
				self.descriptionOfSelctedItem(items[0].description());
				// ##END: DE22053
			}
		}

		//Enables Upload Button once all the mandatory fields are filled up.self.uploadedFileName.length > -1 &&
        self.disposables.push(self.enableUploadButton = ko.computed(() => {
			if (self.UploadedFileName() != undefined && self.fileType() != undefined && self.UploadedFileName() != "") {
				return true
			}

			return false;
		}));

		//Enable Update related to file type
		self.disposables.push(self.enableUpdateButton = ko.computed(() => {
			// ##START: DE22053
			if (self.descriptionOfSelctedItem() === "Insurance Certificate") {
				return false;
			}

			if (self.fileType() != undefined && self.FileName() != "") {
				if (self.isReadOnly()) {
					return true;
				}
			}
			// ##END: DE22053

			return false;
		}));

		//To check if MSG is clicked
		self.checkMsgClick = () => {
			self.checkMsgDisplay = true;
		}

		// to Check if MSG is hidden or closed
		self.checkMsgHide = () => {
			self.checkMsgDisplay = true;
		}

		/*	This is triggered when the user is uploading a document.
		It saves the document object to be saved in system */
		self.uploadSalesOrderDocument = (obj, event: Event) => {
			var reader = new FileReader(),
				fileUploadObj = (<HTMLInputElement>event.target).files[0];
			var ext = fileUploadObj.name.split(".")[fileUploadObj.name.split(".").length - 1];
			if (self.fileType().toString() === "1") {
				switch (ext.toLowerCase()) {
					case 'pdf':
					case 'jpeg':
					case 'jpg':
					case 'tiff':
					case 'tif':
					case 'gif':
					case 'png':
						break;
					default:
						var toastrOptionss = {
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 5,
							fadeOut: 5,
							typeOfAlert: "",
							title: ""
						};
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.MessageForOnlyImageAndPdfFile, "info", null, toastrOptionss);
						self.resetPODDOC();
						return;
				}
			}
			else if (self.fileType().toString() === "2" || self.fileType().toString() === "3") {
				switch (ext.toLowerCase()) {
					case 'jpeg':
					case 'jpg':
					case 'tiff':
					case 'tif':
					case 'gif':
					case 'png':
						break;
					default:
						var toastrOptions1 = {
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 5,
							fadeOut: 5,
							typeOfAlert: "",
							title: ""
						};
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.MessageForOnlyImagesFile, "info", null, toastrOptions1);
						self.resetPODDOC();
						return;
				}
			}
			else if (self.fileType().toString() === "4" || self.fileType().toString() === "5") {
				switch (ext.toLowerCase()) {
					case 'pdf':
					case 'doc':
					case 'docx':
					case 'rtf':
						break;
					default:
						var toastrOptions2 = {
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 5,
							fadeOut: 5,
							typeOfAlert: "",
							title: ""
						};
						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.MessageForOnlyPDFandWordDocument, "info", null, toastrOptions2);
						self.resetPODDOC();
						return;
				}
			}
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
				self.FileName(self.UploadedFileName().split(".")[self.UploadedFileName().split(".").length - 2]);
				self.uploadedItem = item;
			}
		}

		// redirects to Vendor bill order page
        self.reportContainer.onGridColumnClick = function (lineItem: salesOrderPodDocDetails) {
			if (self.isReadOnly()) {
				self.resetPODDOC();
				if (self.salesOrderPodDocDetail().length > 0) {
					self.selectedlineitem = lineItem;
					if (self.checkMsgDisplay) {
						self.checkMsgDisplay = false;
						var actionButtons: Array<IToastrActionButtonOptions> = [];
						actionButtons.push({
							actionButtonName: "Yes",
							actionClick: self.deleteSalesOrderPODDocList
						});

						actionButtons.push({
							actionButtonName: "No",
							actionClick: self.checkMsgClick
						});
						var toastrOptions1: IToastrOptions = {
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 0,
							fadeOut: 0,
							typeOfAlert: "",
							title: "",
							actionButtons: actionButtons
						};

						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.AreYouSureWantToRemoveThis, "warning", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
					}
				}
			}
		}

		// download the POD Documents
		self.reportContainer.onGridColumnClick2 = function (arObj) {
			if (arObj.imagePath) {
				window.open(Utils.Constants.ApplicationBaseURL + 'DocumentViewer/DownloadFileFromDocumentManagement?fileLocationURL=' + arObj.imagePath);
			}
			else {
				window.open(arObj.fileUrl, '_blank');
			}			
		}

		//Check File type is same as old file type or not
        self.disposables.push(self.fileType.subscribe((newValue) => {
			if (self.oldFileType() !== newValue && newValue !== undefined) {
				self.isEnableUpload(true);
				self.isEnableBrowse(true);
				self.UploadedFileName("");
			}
			else if (newValue === undefined) {
				self.isEnableBrowse(false);
				self.UploadedFileName("");
			}
			else {
				self.isEnableUpload(false);
				self.isEnableBrowse(false);
				self.UploadedFileName("");
			}
		}));

		self.deleteSalesOrderPODDocList = () => {
			self.salesorderClientCommand.deletePodDoc(self.selectedlineitem.Id, (result) => {
				self.salesOrderPodDocDetail.remove(self.selectedlineitem);
				self.setPagingData(ko.observableArray(self.salesOrderPodDocDetail()), self.gridOptions, self.reportAction);
				self.checkMsgDisplay = true;
				self.resetPODDOC();
			}, () => { });
		}

		// ##START: DE22053
		self.descriptionOfSelctedItem.subscribe((newValue) => {
			self.isEnable(newValue !== "Insurance Certificate");
		});
		// ##END: DE22053

		self.SetBITrackChange(self);

		self.getBITrackChange = () => {
			return Utils.getDirtyItems(self);
		};

		self.disposables.push(self.isBIDirty = ko.computed(() => {
			var result = (self.getBITrackChange().length ? true : false);
			//self.returnValue(result);
			if (self.onChangesMade) {
				self.onChangesMade(false);
			}

			return result;
		}));
	}

	//#endregion

	//#region Public Methods
	public resetPODDOC() {
		var self = this;
		self.docOwner("");
		self.FileName("");
		self.fileType("");
		self.UploadedFileName("");
		self.oldFileType("");
		self.isEnableUpload(true);
		self.isEnableBrowse(false);
	}

	public updateOrUpload() {
		var self = this;
		if (self.fileType() != undefined) {
			if (self.fileType().toString() === "1") {
				self.isPOD(true);
				self.isDocOther(false);
				self.isBolRc(false);
			}
			else if (self.fileType().toString() === '2' || self.fileType().toString() === '3') {
				self.isPOD(false);
				self.isDocOther(false);
				self.isBolRc(true);
			}
			else if (self.fileType().toString() === '4' || self.fileType().toString() === '5') {
				self.isDocOther(true);
				self.isPOD(false);
				self.isBolRc(false);
			}
		}
	}

	public onKeyUp() {
		var self = this;
	}

	public initializeSalesOrderPodDocDetails(items: Array<ISalesOrderDocuments>, shipmentId: number, carrierId: number, bolNumber: string, enable?: boolean) {
		var self = this;

		if (items != null) {
			for (var i = 0; i < items.length; i++) {
				var document = new salesOrderPodDocDetails(items[i].UploadedFilePath, items[i].Description, items[i].DocOwnerDisplay, items[i].FileTypeDisplay, items[i].CreatedDateDisplay, items[i].UploadedBy, items[i].DocOwner, items[i].FileType, items[i].Id, enable, items[i].CanDeleteDoc, items[i].ImagePath);
				self.salesOrderPodDocDetail.push(document);
			}
			self.shipmentId(shipmentId);
			self.carrierId(carrierId);
			self.bolNumber(bolNumber);
			self.setPagingData(ko.observableArray(self.salesOrderPodDocDetail()), self.gridOptions, self.reportAction);
			self.resetPODDOC();
			self.isEnableUpload(true);
			self.resetGridSelection(self);
			self.isReadOnly(enable);
		}
	}
	//#endregion

	//#region Internal private methods
	private resetGridSelection(self) {
		window.kg.toggleSelection(false);
	}

	private setPagingData(data, grid, gridOption) {
		Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
	}

	private setGridOptions(self: SalesOrderPODDocViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = false;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("SalesOrderPODDocGrid");
		grOption.data = <any> self.reportData;
		grOption.columnDefinition = self.setGridColumnDefinitions();
		grOption.useExternalSorting = false;
		grOption.sortedColumn = <_reportViewer.SortOrder> {
			columnName: "noteDate",
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

	private setGridColumnDefinitions() {
		var self = this;
		var viewCellTemplate = '<div style="margin:0px 3px 3px 0px;"><a data-bind="click: function() { $userViewModel.onGridColumnClick2($parent.entity) }" style="cursor: pointer">View</a></div>';
		var removeCellTemplate = '<div style="text-align:center; margin-top:7px;"><input type="image" data-bind="click: function() { $userViewModel.onGridColumnClick($parent.entity) }, visible: $parent.entity[\'canDelete\']"  src="Content/images/Icon_Trash.png"; /></div>';
		var colDefinition: Array;
		colDefinition = [
			{ field: 'description', displayName: 'Description', sortable: false },
			{ field: 'docOwner', displayName: 'Doc Owner', width: 110, sortable: false },
			{ field: 'fileType', displayName: 'File Type', width: 90, sortable: false },
			{ field: 'createdDate', displayName: 'Created Date', width: 146, sortable: false },
			{ field: 'uploadedBy', displayName: 'Uploaded By', width: 170, sortable: false },
			{ field: 'fileUrl', displayName: 'View', width: 70, sortable: false, cellTemplate: viewCellTemplate },
			{ field: 'remove', displayName: 'Remove', width: 90, sortable: false, cellTemplate: removeCellTemplate }

		];
		return colDefinition;
	}

	// Creates the Sales Order upload object for grid
	private getSalesOrderPodDocDetails(self, fileURL): salesOrderPodDocDetails {
		return new salesOrderPodDocDetails(fileURL, self.FileName(), self.commonUtils.getEnumValueById(refEnums.Enums.DocumentOwner, self.docOwner()), self.commonUtils.getEnumValueById(refEnums.Enums.DocumentType, self.fileType()), Date.now(), self.currentUser().FullName);
	}

	// Gets the logged in user details from shell.js
	getLoggedInUserDetails() { // Get the logged in user for name for new note}
		var self = this;
		_app.trigger("GetCurrentUserDetails", (currentUser: IUser) => {
			self.currentUser(currentUser);
		});
	}

	//#endregion

	// track change detection
	SetBITrackChange(self) {
		self.FileName.extend({ trackChange: true });
	}

	public cleanUp() {
		var self = this;

		//self.FileName.rules.removeAll();
		self.salesOrderPodDocDetail.removeAll();
		self.disposables.forEach(disposable => {
			if (disposable && typeof disposable.dispose === "function") {
				disposable.dispose();
			} else {
				delete disposable;
			}
		});

		self.FileName.extend({ validatable: false });

		self.reportContainer.cleanup("SalesOrderPODDocGrid");

		try {
			delete self.salesOrderPodDocDetail;
			for (var property in self) {
				if (property != "cleanup")
					delete self[property];
			}

			delete self;
		}
		catch (exception) {
			delete self;
		}
	}
}

// This a view model of the line notes items
export class salesOrderPodDocDetails {
	description: KnockoutObservable<string> = ko.observable();
	docOwner: KnockoutObservable<string> = ko.observable('');
	fileType: KnockoutObservable<string> = ko.observable('');
	createdDate: KnockoutObservable<string> = ko.observable();
	uploadedBy: KnockoutObservable<string> = ko.observable();
	fileUrl: string;
	Id: number;
	docOwnerId: KnockoutObservable<number> = ko.observable(0);
	fileTypeId: KnockoutObservable<number> = ko.observable(0);
	isReadOnly: boolean
    canDelete: boolean
	imagePath: string;

	// Get the entered notes and initialize the item
	constructor(fileURL: any, strDescription: string, strDocOwner: string, strFileType: string, strCreatedDate, strUploadedBy: string, docOwnerId?: number, fileTypeId?: number, id?: number, isReadOnly?: boolean, canDelete?: boolean, imagePath?: string) {
		var self = this;
		self.description(strDescription);
		self.docOwner(strDocOwner);
		self.fileType(strFileType);
		self.createdDate(moment(strCreatedDate).format("MM/DD/YYYY"));
		self.uploadedBy(strUploadedBy);
		self.docOwnerId(docOwnerId);
		self.fileTypeId(fileTypeId);
		self.fileUrl = fileURL;
		self.Id = id;
		self.isReadOnly = isReadOnly;
		self.canDelete = canDelete;
		self.imagePath = imagePath;
	}
}