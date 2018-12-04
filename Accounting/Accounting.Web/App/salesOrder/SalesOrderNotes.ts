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
import _reportViewer = require('../templates/reportViewerControlV2');
import refEnums = require('services/models/common/Enums');
import refSalesOrderNotesModel = require('services/models/salesOrder/SalesOrderNoteDetail');
import refSalesOrderNotesContainerModel = require('services/models/salesOrder/SalesOrderNotesContainer');
import refSalesOrderDetailsModel = require('services/models/salesOrder/SalesOrderDetail');
import refSalesOrderClient = require('services/client/SalesOrderClient');
//#endregion

/*
** <summary>
** Sales Order Notes View Model.
** </summary>
** <createDetails>
** <id>US8214</id> <by>Avinash Dubey</by> <date>04-24-2014</date>
** </createDetails>
** <changeHistory>
** <id>US20305</id> <by>Chandan Singh Bajetha</by> <date>07-01-2016</date> <description>Acct: Remove extra ADD button from SO & VB Notes Section</description>
** <id>DE21426</id> <by>Vasanthakumar</by> <date>19-01-2016</date> <description>Notes textbox are persistent after clicking reload button</description>
** <id>DE21390</id> <by>Vasanthakumar</by> <date>22-01-2016</date> <description>System shows Change Detection message when user navigate to another tab</description>
** <id>US20728</id> <by>Baldev Singh Thakur</by> <date>15-02-2016</date> <description>Acct: Add a new Notes Type option in SO Notes.</description>
** <id>DE22052</id> <by>Vasanthakumar</by> <date>04-03-2016</date> <description>Notes are not saved properly Entity id saves as 0</description>
** <id>DE22477</id> <by>Shreesha Adiga</by> <date>16-05-2016</date> <description>Select the last item from selectedItems instead of the first</description>
** <id>US24874</id> <by>Vasanthakumar</by> <date>29-09-2016</date> <description>Client side Add Notes box character limit to be made as 1000</description>
** <id>DE25233</id> <by>Janakiram</by> <date>05-12-2016</date> <description>Adding Notes for Canceeld SO</description>
** <id>US33122</id> <by>Sandeep Pandey</by> <date>07-05-2018</date> <description>Credit requester name to be included in Notes</description>
** </changeHistory>
*/
export class SalesOrderNotesViewModel {
	salesOrderNoteItems: KnockoutObservableArray<salesOrderNoteItem> = ko.observableArray([]);
	canAdd: KnockoutObservable<boolean> = ko.observable(false);
	userNote: KnockoutObservable<string> = ko.observable('');
	currentUser: KnockoutObservable<IUser> = ko.observable();
	//salesOrderNoteTypes: KnockoutObservableArray<string> = ko.observableArray([]);

	// ###START: US20728
	salesOrderNoteTypes: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);

	// ###END: US20728
	selecteedNotesType: KnockoutObservable<string> = ko.observable("General");
	ischange: KnockoutObservable<boolean> = ko.observable(false);
	returnValue: KnockoutObservable<boolean> = ko.observable(false);
	modeType = ko.observable();
	// ###START: US20305
	//identify call from Edit
	isCallFromEdit: KnockoutObservable<boolean> = ko.observable(false);
	public SOStorageKey: any;
	// ###ENDEND: US20305
	isBIDirty: KnockoutComputed<boolean>;

	// vendor bill id
	salesOrderId: number;
	invoiceStatus: number;
	// Utility class object
	CommonUtils: CommonStatic = new Utils.Common();

	//To check changes
	reportContainer: _reportViewer.ReportViewerControlV2 = null;
	header: _reportViewer.ReportHeaderOption = null;
	grid: _reportViewer.ReportGridOption = null;
	reportAction: _reportViewer.ReportAction = null;
	reportData: KnockoutObservableArray<salesOrderNoteItem> = null;
	setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	gridOptions: any;
	reportType: number;
	private checkMsgDisplay: boolean = true;
	//to hold sales order no
	salesOrderNumber: KnockoutObservable<string> = ko.observable('');
	salesOrderSaveNotesData: refSalesOrderNotesContainerModel.Model.SalesOrderNotesContainer;

	// ###START: US20728
	selectedsalesOrderNoteTypes: KnockoutObservable<number> = ko.observable(0);

	// ###END: US20728
	//to enable save button
	canSave: KnockoutObservable<boolean> = ko.observable(false);

	getReportData: () => void;
	checkMsgClick: () => any;
	checkMsgHide: () => any;
	getBITrackChange: () => string[];
	onAdd: () => void;
	onChangesMade: (dirty: boolean) => any;
	CanCreateNotes = false;
	// Initializes the properties of this class
	constructor() {
		var self = this;
		// Get the current user
		self.getLoggedInUserDetails();

		// ###START: US20728
		if (refSystem.isObject(refEnums.Enums.SalesOrderNotesType)) {
			self.salesOrderNoteTypes.removeAll();
			for (var item in refEnums.Enums.SalesOrderNotesType) {
				self.salesOrderNoteTypes.push(refEnums.Enums.SalesOrderNotesType[item]);
			}
		}
		// Create the notes type
		//self.salesOrderNoteTypes.push("General");

		// ###END: US20728
		// Handles the add command
		self.onAdd = () => {
			// Try to get the current user again if first time failed
			if (!self.currentUser()) {
				self.getLoggedInUserDetails();
			}
			// ###START: US20728

			var notes = self.CommonUtils.getEnumValueById(refEnums.Enums.SalesOrderNotesType, self.selectedsalesOrderNoteTypes().toString());

			self.salesOrderNoteItems.unshift(new salesOrderNoteItem(0, this.salesOrderId, self.userNote(), self.currentUser().FullName, Date.now(), notes, self.selectedsalesOrderNoteTypes()));

			// ###END: US20728
			self.userNote("");
			$("#txtuserSalesOrderNote").focus();
			if (!self.CanCreateNotes)
				self.ischange(true);
			if (self.onChangesMade) {
				if (!self.CanCreateNotes)
					self.onChangesMade(self.ischange());
			}
			self.setPagingData(ko.observableArray(self.salesOrderNoteItems()), self.gridOptions, self.reportAction);
			self.canAdd(false);
			self.resetGridSelection(self);
		}; // Allow add only when any this is in the text box

		self.SetBITrackChange(self);

		self.getBITrackChange = () => {
			return Utils.getDirtyItems(self);
		};

		self.isBIDirty = ko.computed(() => {
			var result = (self.getBITrackChange().length ? true : false);
			self.returnValue(result);
			if (self.onChangesMade) {
				if (!self.CanCreateNotes)
					self.onChangesMade(result);
			}

			return result;
		});

		self.header = new _reportViewer.ReportHeaderOption();
		self.header.reportHeader = "";
		self.header.reportName = "Sales Order Notes";
		self.header.gridTitleHeader = "";
		//initialize date filters
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

		//Displays Date without Time Part

		self.reportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);
		self.reportContainer.showOptionalHeaderRow(false);
		self.reportContainer.OptionalHeaderRowLocation('TOP');
		self.reportContainer.onFilterChange = self.setReportCriteria;
		self.reportContainer.ForceChange();

		//if we click on grid ROW then notes will be appear in the text area field. (canSelectRows => true;)
		self.reportContainer.afterSelectionChange = function (items: KnockoutObservableArray<any>) {
			// ##START: DE22477
			var selectedRowCount = items.length;
			// ##START: US24874
			if (selectedRowCount > 0) {
				if ((items[selectedRowCount - 1].description().includes("Credit Requested for"))|| (items[selectedRowCount - 1].description().includes("CM request raised"))) {
					if (items[selectedRowCount - 1].description().length > 0 && items[selectedRowCount - 1].description().length > 1000) {
						// ##START: US33122
						self.userNote((items[selectedRowCount - 1].description() + "  Credit Requester Name: " + items[selectedRowCount - 1].noteBy()).substr(0, 999));
					}
					else {
						self.userNote(items[selectedRowCount - 1].description() + "  Credit Requester Name: " + items[selectedRowCount - 1].noteBy());
					}
					// ##END: US33122
				}
				else {
					if (items[selectedRowCount - 1].description().length > 0 && items[selectedRowCount - 1].description().length > 1000) {
						self.userNote(items[selectedRowCount - 1].description().substr(0, 999));
					}
					else {
						self.userNote(items[selectedRowCount - 1].description());
					}
				}
				// ##END: US24874
				// ##END: DE22477
				//self.userNote(items[0].description());
				// ###START: US20728
				self.selectedsalesOrderNoteTypes(items[0].noteTypeValue());
				// ###END: US20728
			}
			else {
				self.userNote('');
			}
			self.canAdd(false);
		}

		//To check if Msg is clicked
		self.checkMsgClick = () => {
			self.checkMsgDisplay = true;
		}

	// to Check if Msg is hidden or closed
		self.checkMsgHide = () => {
			self.checkMsgDisplay = true;
		}

		// ###START: US20728
		self.selectedsalesOrderNoteTypes.subscribe((selectedStatus) => {
			self.selectedsalesOrderNoteTypes(selectedStatus);
		});

		// ###END: US20728
	}

	//START US18837
	// Adding notes for change in class or weight
	public addNoteForReclass(description) {
		var self = this;

		self.salesOrderNoteItems.unshift(new salesOrderNoteItem(0, this.salesOrderId, description, self.currentUser().FullName, Date.now(), refEnums.Enums.Note.Communication.Value, refEnums.Enums.Note.Communication.ID)); //DE20107
	}
	//END US18837

	//###START: DE25233
	// Adding notes for  Canceled Insurance SO
	public addNoteForCanceledInsurance(description) {
		var self = this;

		self.salesOrderNoteItems.unshift(new salesOrderNoteItem(0, this.salesOrderId, description, self.currentUser().FullName, Date.now(), refEnums.Enums.Note.General.Value, refEnums.Enums.Note.General.ID)); //DE20107
	}
	//###END: DE25233

	//#region Internal private methods
	private resetGridSelection(self) {
		window.kg.toggleSelection(false);
	}

	private setPagingData(data, grid, gridOption) {
		Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
	}

	private setGridOptions(self: SalesOrderNotesViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = false;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("salesOrderShipmentNotesGrid");
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
		var colDefinition: Array = [];
		colDefinition = [
			{ field: 'description', displayName: 'Description', sortable: false },
			{ field: 'noteBy', displayName: 'Notes By', sortable: false },
			{ field: 'noteType', displayName: 'Notes Type', sortable: false },
			{ field: 'noteDate', displayName: 'Notes Date', sortable: false, }

		];
		return colDefinition;
	}

	// Gets the logged in user details from shell.js
	getLoggedInUserDetails() { // Get the logged in user for name for new note}
		var self = this;
		_app.trigger("GetCurrentUserDetails", (currentUser: IUser) => {
			self.currentUser(currentUser);
		});
	}

	//#region Public Methods
	public initializesalesOrderNotes(notes: Array<any>, salesOrderId: number, invoiceStatus: number, isCallForEdit: boolean) {
		var self = this;
		self.salesOrderId = salesOrderId;
		self.invoiceStatus = invoiceStatus;
		// ###STRAT: US20305
		self.isCallFromEdit(isCallForEdit);
		// ###END: 20305
		if (self.salesOrderNoteItems != null) {
			self.salesOrderNoteItems().forEach((item) => {
				delete item;
			});

			self.salesOrderNoteItems.removeAll();
		}

		if (notes != null) {
			for (var i = 0; i < notes.length; i++) {
				self.salesOrderId = notes[0].EntityId;
				if (notes[i].NotesType !== 4)
					self.salesOrderNoteItems.push(new salesOrderNoteItem(notes[i].Id, notes[i].EntityId, notes[i].Description, notes[i].NotesBy, notes[i].NotesDate, notes[i].NoteTypeName, notes[i].NotesType));
			}

			self.setPagingData(ko.observableArray(self.salesOrderNoteItems()), self.gridOptions, self.reportAction);
		}
		self.reportContainer.listProgress(false);
		// ###START: DE21426
		self.userNote('');
		// ###END: DE21426
	}

	SetBITrackChange(self) {
		// ###START: DE21426
		self.userNote.extend({ trackChange: true });
		// ###END: DE21426
	}

	// To open Notes Section after editing in items.
	public OpenNotes() {
		var self = this;
		self.expandNotesView();
	}

	//## function to expand the items view if any case we required
	public expandNotesView() {
	}

	//## to enable add button if any notes entered/copy pasted in text area
	public onKeyUp() {
		var self = this;
		var note = self.userNote();
		self.resetGridSelection(self);
		self.userNote(note);
		if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.userNote().trim())) {
			self.canAdd(true);
			if (self.invoiceStatus === 2 || self.invoiceStatus === 3 || self.CanCreateNotes === true) {
				self.canSave(true);
			}
			else {
				self.canSave(false);
			}
		}
		else {
			self.canAdd(false);
			self.canSave(false);
		}
	}

	//to save notes in case of Main Save button is disable
	public onSave() {
		var self = this;
		self.salesOrderSaveNotesData = new refSalesOrderNotesContainerModel.Model.SalesOrderNotesContainer();
		self.salesOrderSaveNotesData.SalesOrderNoteDetails = self.getSalesOrderNotes();
		self.salesOrderSaveNotesData.Id = self.salesOrderId;
		// ###START: US20305
		// Using to update localstorage data
		// START
		var dataToUpdateNotes = LocalStorageController.Get(self.SOStorageKey);
		if (dataToUpdateNotes !== null && dataToUpdateNotes !== undefined) {
			if (dataToUpdateNotes.SalesOrderNoteDetails !== null && dataToUpdateNotes.SalesOrderNoteDetails !== undefined) {
				dataToUpdateNotes.SalesOrderNoteDetails.removeAll;
			}
			dataToUpdateNotes.SalesOrderNoteDetails = self.salesOrderSaveNotesData.SalesOrderNoteDetails;
			LocalStorageController.Set(self.SOStorageKey, undefined);
			LocalStorageController.Set(self.SOStorageKey, dataToUpdateNotes);
		}
		// END
		// ###END: US20305
		refSalesOrderClient.SalesOrderClient.prototype.SaveSalesOrderNotesDetail(self.salesOrderSaveNotesData, (message) => {
			//to reload the grid
			self.salesOrderNoteItems.removeAll();
			self.initializesalesOrderNotes(message, self.salesOrderId, self.invoiceStatus, self.isCallFromEdit());
			if (self.checkMsgDisplay) {
				self.checkMsgDisplay = false;
				var toastrOptions1 = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SaveSalesOrderNotesSuccessfully, "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
			}
			self.userNote('');
			self.canSave(false);
			self.canAdd(false);
			//to reset change detection after save
			self.ischange(false);
			self.returnValue(false);
			if (self.onChangesMade) {
				if (!self.CanCreateNotes)
					self.onChangesMade(false);
			}
			//// ###START: DE21390
			//Disable toastr msg while moving to another tab after saving notes
			_app.trigger("IsBIDirtyChange", false);
			//// ###END: DE21390
		},
			(message) => {
			});
	}

	public getSalesOrderNotes(): Array<ISalesOrderNotes> {
		var self = this;
		var newShipment = true;
		var salesOrderNotes: Array<refSalesOrderNotesModel.Models.SalesOrderNoteDetails>;
		//self.selectedsalesOrderNoteTypes(self.salesOrderNoteTypes);
		salesOrderNotes = ko.observableArray([])();
		salesOrderNotes.removeAll();
		self.salesOrderNoteItems().forEach(function (item, collection) {
			if (item.description() != "") {
				salesOrderNotes.push(self.AddNoteItem(item));
			}
		});

		// ###START: US20728
		var notes = self.CommonUtils.getEnumValueById(refEnums.Enums.SalesOrderNotesType, self.selectedsalesOrderNoteTypes().toString());
		// Check if notes data is entered but not added in the list
		if (self.canAdd()) {
			var notesDescription = self.userNote();
			//// ###START: DE22052
			var itemNew = new salesOrderNoteItem(0, self.salesOrderId, notesDescription, self.currentUser().FullName, Date.now(), notes, self.selectedsalesOrderNoteTypes());
			//// ###END: DE22052

			// ###END: US20728
			salesOrderNotes.push(self.AddNoteItem(itemNew));
		}
		return salesOrderNotes;
	}

	// function to use get item note model
	private AddNoteItem(item: salesOrderNoteItem) {
		var itemNote = new refSalesOrderNotesModel.Models.SalesOrderNoteDetails();

		// For the entity ID will be filled by server
		itemNote.Id = item.id();
		itemNote.EntityId = item.entityId();
		itemNote.NotesBy = item.noteBy();
		itemNote.NotesDate = new Date(item.noteDate());
		itemNote.Description = item.description();
		itemNote.NoteTypeName = item.noteType();
		itemNote.NotesType = item.noteTypeValue();
		return itemNote;
	}

	public cleanup() {
		var self = this;

		if (typeof self.isBIDirty.dispose === "function") self.isBIDirty.dispose();

		//self.reportContainer.cleanup("salesOrderShipmentNotesGrid");

		for (var property in self) {
			if (property != "cleanup")
				delete self[property];
		}

		delete self;
	}

	//#endregion
}

// This a view model of the line notes items
export class salesOrderNoteItem {
	id: KnockoutObservable<number> = ko.observable(0);
	entityId: KnockoutObservable<number> = ko.observable(0);
	description: KnockoutObservable<string> = ko.observable();
	noteBy: KnockoutObservable<string> = ko.observable();
	noteDate: KnockoutObservable<string> = ko.observable();
	noteByUserId: number;
	noteType: KnockoutObservable<string> = ko.observable('');
	//to hold value as numeric
	noteTypeValue: KnockoutObservable<number> = ko.observable(0);
	// Get the entered notes and initialize the item
	constructor(id: number, entityId: number, strUserNote: string, strNoteBy: string, strNoteDate, noteType: string, noteTypeValue: number) {
		var self = this;
		self.id(id);
		self.entityId(entityId);
		self.description(strUserNote);
		self.noteBy(strNoteBy);
		self.noteDate(moment(strNoteDate).format("MM/DD/YYYY"));
		self.noteType(noteType);
		self.noteTypeValue(noteTypeValue);
	}
}