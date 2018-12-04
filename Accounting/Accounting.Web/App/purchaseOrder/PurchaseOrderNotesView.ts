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
import _refVendorAddress = require('vendorBill/VendorAddressView');
import _refVendorItem = require('vendorBill/VendorBillItemView');
import _refVendorBill = require('vendorBill/VendorBillView');
import _refAppShell = require('shell');
import _reportViewer = require('../templates/reportViewerControlV2');
import refVendorBillNotesContainerModel = require('services/models/vendorBill/VendorBillNotesContainer');
import refVendorBillClient = require('services/client/VendorBillClient');
import _refVendorBillNotesModel = require('services/models/vendorBill/VendorBillNote');
import refEnums = require('services/models/common/Enums');
//#endregion

/*
** <summary>
** Purchase Order Note View Model.
** </summary>
** <createDetails>
** <by>Bhanu pratap</by> <date>07-22-2014</date>
** </createDetails>}
** <changeHistory>}
** <id>DE21426</id> <by>Vasanthakumar</by> <date>19-01-2016</date> <description>Notes textbox are persistent after clicking reload button</description>
** <id>DE21390</id> <by>Vasanthakumar</by> <date>22-01-2016</date> <description>System shows Change Detection message when user navigate to another tab</description>
** <id>DE22052</id> <by>Vasanthakumar</by> <date>04-03-2016</date> <description>Notes are not saved properly Entity id saves as 0 and note type </description>
** </changeHistory>
*/
export class PurchaseOrderNotesViewModel {
	purchaseOrderNoteItems: KnockoutObservableArray<PurchaseOrderNoteItem> = ko.observableArray([]);
    onAdd: () => void;
	canAdd: KnockoutObservable<boolean> = ko.observable(false);
	userNote: KnockoutObservable<string> = ko.observable('');
	currentUser: KnockoutObservable<IUser> = ko.observable();
	vendorBillNoteTypes: KnockoutObservableArray<string> = ko.observableArray([]);
	selectedNotesType: KnockoutObservable<string> = ko.observable("General");
	// vendor bill id
	vendorBillId: number;

	// Utility class object
	CommonUtils: CommonStatic = new Utils.Common();

	// for tracking changes
	getTrackChange: () => string[];
	isDirty: KnockoutComputed<boolean>;
	onChangesMade: (dirty: boolean) => any;
	//To check changes
	ischange: KnockoutObservable<boolean> = ko.observable(false);
	returnValue: KnockoutObservable<boolean> = ko.observable(false);
	public reportContainer: _reportViewer.ReportViewerControlV2 = null;
	public header: _reportViewer.ReportHeaderOption = null;
	public grid: _reportViewer.ReportGridOption = null;
	public reportAction: _reportViewer.ReportAction = null;
	public reportData: KnockoutObservableArray<PurchaseOrderNoteItem> = null;
	public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	public getReportData: () => void;
	public gridOptions: any;
	public reportType: number;
	public modeType = ko.observable();

	// ###START: US20305
	vendorBillSaveNotesData: refVendorBillNotesContainerModel.Model.VendorBillNotesContainer;

	//for toastr
	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	private checkMsgDisplay: boolean = true;

	public UVBStorageKey: any;
	// ###END: US20305

	// Initializes the properties of this class
	constructor() {
		var self = this;

		// Get the current user
		self.getLoggedInUserDetails();

		// Create the notes type
		self.vendorBillNoteTypes.push("General");
		self.vendorBillNoteTypes.push("Problem");
		self.vendorBillNoteTypes.push("Setup");

		//self.vendorBillNoteTypes.push("Memo");

		// Handles the add command
		self.onAdd = () => {
			// Try to get the current user again if first time failed
			if (!this.currentUser()) {
				this.getLoggedInUserDetails();
			}

			var noteTypeValue = 0;
			if (self.selectedNotesType() == "Setup") {
				noteTypeValue = refEnums.Enums.Note.Information.ID;
			} else if (self.selectedNotesType() == "Problem") {
				noteTypeValue = refEnums.Enums.Note.Problem.ID;
			} else {
				noteTypeValue = refEnums.Enums.Note.General.ID;
			}

			this.purchaseOrderNoteItems.unshift(new PurchaseOrderNoteItem(0, this.vendorBillId, this.userNote(), this.currentUser().FullName, Date.now(), this.selectedNotesType(), noteTypeValue));
			this.userNote("");
			$("#txtuserNote").focus();
			self.selectedNotesType("General");
			this.ischange(true);
			this.setPagingData(ko.observableArray(this.purchaseOrderNoteItems()), this.gridOptions, this.reportAction);
			self.canAdd(false);
			self.resetGridSelection(self);
		}

		// Allow add only when any this is in the text box
		//self.canAdd = ko.computed(() => {
		//	var alowAdd = false;

		//	if (this.userNote().length > 0 && $.trim(this.userNote()) !== "") {
		//		alowAdd = true;
		//	}

		//	return alowAdd;
		//});

		self.setTrackChange(self);

		self.getTrackChange = () => {
			return Utils.getDirtyItems(self);
		};

		self.isDirty = ko.computed(() => {
			var result = (self.getTrackChange().length ? true : false);
			self.returnValue(result);
			if (self.onChangesMade) {
				self.onChangesMade(result);
			}

			return result;
		});

		self.header = new _reportViewer.ReportHeaderOption();
		self.header.reportHeader = "";
		self.header.reportName = "Vendor Bill Notes";
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

			if (selectedRowCount > 0) {
				self.userNote(items[0].description());
			} else {
				self.userNote('');
			}
			self.canAdd(false);
		}
	}

	//#region Internal private methods
	private resetGridSelection(self) {
		window.kg.toggleSelection(false);
	}

	private setPagingData(data, grid, gridOption) {
		Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
	}

	private setGridOptions(self: PurchaseOrderNotesViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();
		grOption.enableSelectiveDisplay = false;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("PurchaseOrderNotesGrid");
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
		var colDefinition: Array;
		colDefinition = [
			{ field: 'description', displayName: 'Description', sortable: false },
			{ field: 'noteBy', displayName: 'Notes By', sortable: false },
			{ field: 'noteType', displayName: 'Notes Type',sortable: false },
			{ field: 'noteDate', displayName: 'Notes Date', sortable: false}

		];
		return colDefinition;
	}

	// Gets the logged in user details from shell.js
	getLoggedInUserDetails() {
		var self = this;

		// Get the logged in user for name for new note}
		_app.trigger("GetCurrentUserDetails", function (currentUser: IUser) {
			self.currentUser(currentUser);
		});
	}

	// function to use get item note model
	// ###START: US20305
	private AddNoteItem(item: PurchaseOrderNoteItem) {
		var itemNote = new _refVendorBillNotesModel.Models.VendorBillNote();

		// For the entity ID will be filled by server
		itemNote.Id = item.id();
		itemNote.EntityId = item.entityId();
		itemNote.NotesBy = item.noteBy();
		itemNote.NotesDate = new Date(item.noteDate());
		itemNote.NotesDescription = item.description();
		itemNote.NoteTypeName = item.noteType();
		itemNote.NotesType = item.noteTypeValue();

		return itemNote;
	}
	// ###END: US20305

	//#region Public Methods

	//// ###START: DE22052
	public initializePurchaseOrderNotes(notes: Array<IVendorBillNote>, vendorBillId: number) {
		var self = this;
		if (self.purchaseOrderNoteItems != null) {
			self.purchaseOrderNoteItems.removeAll();
		}
		self.vendorBillId = vendorBillId;
		if (notes != null) {
			for (var i = 0; i < notes.length; i++) {				
				if (notes[i].NotesType !== 4)
					self.purchaseOrderNoteItems.push(new PurchaseOrderNoteItem(notes[i].Id, notes[i].EntityId, notes[i].NotesDescription, notes[i].NotesBy, notes[i].NotesDate, notes[i].NoteTypeName, notes[i].NotesType));
			}

			self.setPagingData(ko.observableArray(self.purchaseOrderNoteItems()), self.gridOptions, self.reportAction);
		}
		// ###START: DE21426
		self.userNote("");
		self.canAdd(false);
		// ###END: DE21426
	}
	//// ###END: DE22052

	//to save notes in case of Main Save button is disable
	// ###START: US20305
	public onSave() {
		var self = this;
		self.vendorBillSaveNotesData = new refVendorBillNotesContainerModel.Model.VendorBillNotesContainer();
		self.vendorBillSaveNotesData.VendorBillNoteDetails = self.getVendorBillNotes();
		self.vendorBillSaveNotesData.Id = self.vendorBillId;
		// ###START: US20305
		// Using to update localstorage data
		// START
		var dataToUpdateNotes = LocalStorageController.Get(self.UVBStorageKey);
		if (dataToUpdateNotes !== null && dataToUpdateNotes !== undefined) {
			if (dataToUpdateNotes.VendorBillNotes !== null && dataToUpdateNotes.VendorBillNotes !== undefined) {
				dataToUpdateNotes.VendorBillNotes.removeAll;
			}
			dataToUpdateNotes.VendorBillNotes = self.vendorBillSaveNotesData.VendorBillNoteDetails;
			LocalStorageController.Set(self.UVBStorageKey, undefined);
			LocalStorageController.Set(self.UVBStorageKey, dataToUpdateNotes);
		}
		// END
		// ###END: US20305
		refVendorBillClient.VendorBillClient.prototype.SaveVendorBillNotesDetail(self.vendorBillSaveNotesData, (message) => {
			//to reload the grid
			self.purchaseOrderNoteItems.removeAll();
			//// ###START: DE22052
			self.initializePurchaseOrderNotes(message, self.vendorBillId);
			//// ###END: DE22052
			//, self.masTransferDate(), self.vendorBillId, self.billStatus()
			if (self.checkMsgDisplay) {
				self.checkMsgDisplay = false;
				var toastrOptions1 = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SaveVendorBillNotesSuccessfully, "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
			}
			self.userNote('');
			self.canAdd(false);
			// self.canSave(false);
			//to reset change detection after save
			self.ischange(false);
			self.returnValue(false);
			if (self.onChangesMade) {
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
	// ###END: US20305

	// Binding data in notes
	// ###START: US20305
	public getVendorBillNotes(): Array<IVendorBillNote> {
		var self = this;
		var newShipment = true;
		var vendorBillNotes: Array<_refVendorBillNotesModel.Models.VendorBillNote>;
		vendorBillNotes = ko.observableArray([])();
		vendorBillNotes.removeAll();
		self.purchaseOrderNoteItems().forEach(function (item, collection) {
			if (item.description() != "") {
				vendorBillNotes.push(self.AddNoteItem(item));
			}
		});

		// Check if notes data is entered but not added in the list
		if (self.canAdd()) {
			var noteTypeValue = 0;
			if (self.selectedNotesType() == "Setup") {
				noteTypeValue = refEnums.Enums.Note.Information.ID;
			} else if (self.selectedNotesType() == "Problem") {
				noteTypeValue = refEnums.Enums.Note.Problem.ID;
			} else {
				noteTypeValue = refEnums.Enums.Note.General.ID;
			}
			var notesDescription = self.userNote();
			//// ###START: DE22052
			var itemNew = new PurchaseOrderNoteItem(0, self.vendorBillId, notesDescription, self.currentUser().FullName, Date.now(), self.selectedNotesType(), noteTypeValue);
			//// ###END: DE22052
			vendorBillNotes.push(self.AddNoteItem(itemNew));
		}
		return vendorBillNotes;
	}
	// ###END: US20305

	setTrackChange(self) {
		self.userNote.extend({ trackChange: true });
	}

	// To open Notes Section after editing in items.
	public OpenNotes() {
		$("#collapseNotes").collapse('show');
		if ($("#collapseNotes").hasClass('in')) {
			$("#AchorcollapseNotes").removeClass('collapsed');
		}
		else {
			$("#AchorcollapseNotes").addClass('collapsed');
		}
	}

	//## to enable add button if any notes entered/copy pasted in text area
	public onKeyUp() {
		var self = this;
		var note = self.userNote();
		self.resetGridSelection(self);
		self.userNote(note);
		if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.userNote().trim())) {
			self.canAdd(true);
		}
		else {
			self.canAdd(false);
		}
	}

	public cleanup() {
		var self = this;

		self.reportContainer.cleanup("PurchaseOrderNotesGrid");
		self.userNote.extend({ validatable: false });

		for (var property in self) {
			if (property != "cleanup")
				delete self[property];
		}

		delete self;
	}

	//#endregion
}

// This a view model of the line notes items
export class PurchaseOrderNoteItem {
	id: KnockoutObservable<number> = ko.observable(0);
	entityId: KnockoutObservable<number> = ko.observable(0);
	description: KnockoutObservable<string> = ko.observable();
	noteBy: KnockoutObservable<string> = ko.observable();
	noteDate: KnockoutObservable<string> = ko.observable();
	noteByUserId: number;
	noteType: KnockoutObservable<string> = ko.observable('');
	noteTypeValue: KnockoutObservable<number> = ko.observable(0);

	// Get the entered notes and initialize the item
	constructor(id: number, entityId: number, strUserNote: string, strNoteBy: string, strNoteDate, noteType: string, noteTypeValue?: number) {
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