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
import refEnums = require('services/models/common/Enums');
//#endregion
/*
** <summary>
** Vendor Bill Notes Entry View Model.
** </summary>
** <createDetails>
** <id>US8214</id> <by>Bhanu pratap</by> <date>07-08-2014</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by> <date></date>
** </changeHistory>
*/

export class vendorBillNotesEntryViewModel {
	vendorBillNoteItems: KnockoutObservableArray<vendorBillNoteItem> = ko.observableArray([]);
	onAdd: () => void;
	canAdd: KnockoutObservable<boolean>=ko.observable(false);
	userNote: KnockoutObservable<string> = ko.observable('');
	currentUser: KnockoutObservable<IUser> = ko.observable();
	vendorBillNoteTypes: KnockoutObservableArray<string> = ko.observableArray([]);
	selecteedNotesType: KnockoutObservable<string> = ko.observable("General");

	// Utility class object
	CommonUtils: CommonStatic = new Utils.Common();

	// for tracking changes
	getBITrackChange: () => string[];
	isBIDirty: KnockoutComputed<boolean>;
	onChangesMade: (dirty: boolean) => any;
	ischange: KnockoutObservable<boolean> = ko.observable(false);

	public reportContainer: _reportViewer.ReportViewerControlV2 = null;
	public header: _reportViewer.ReportHeaderOption = null;
	public grid: _reportViewer.ReportGridOption = null;
	public reportAction: _reportViewer.ReportAction = null;
	public reportData: KnockoutObservableArray<vendorBillNoteItem> = null;
	public setReportCriteria: (reportAction: _reportViewer.ReportAction) => any;
	public getReportData: () => void;
	public gridOptions: any;
	public reportType: number;
	public modeType = ko.observable();

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
			if (!self.currentUser()) {
				self.getLoggedInUserDetails();
			}

			var noteTypeValue = 0;
			if (self.selecteedNotesType() == "Setup") {
				noteTypeValue = refEnums.Enums.Note.Information.ID;
			} else if (self.selecteedNotesType() == "Problem") {
				noteTypeValue = refEnums.Enums.Note.Problem.ID;
			} else {
				noteTypeValue = refEnums.Enums.Note.General.ID;
			}

			self.vendorBillNoteItems.unshift(new vendorBillNoteItem(self.userNote(), self.currentUser().FullName, Date.now(), self.selecteedNotesType(), noteTypeValue));
			self.userNote("");

			$("#txtuserNote").focus();
			self.ischange(true);
			self.setPagingData(ko.observableArray(self.vendorBillNoteItems()), self.gridOptions, self.reportAction);
			self.canAdd(false);
			self.resetGridSelection(self);
		}; // Allow add only when any this is in the text box
		//self.canAdd = ko.computed(() => {
		//	var alowAdd = false;

		//	if (self.userNote().length > 0 && $.trim(self.userNote()) !== "") {
		//		alowAdd = true;
		//	}

		//	return alowAdd;
		//});

		self.SetBITrackChange(self);

		self.getBITrackChange = () => {
			return Utils.getDirtyItems(self);
		};

		self.isBIDirty = ko.computed(() => {
			var result = (self.getBITrackChange().length ? true : false);
			if (self.onChangesMade) {
				self.onChangesMade(result);
			}

			return result;
		});

		self.header = new _reportViewer.ReportHeaderOption();
		self.header.reportHeader = "";
		self.header.reportName = "Vendor Bill Notes";
		self.header.gridTitleHeader = "";
		self.header.showReportOptionalHeaderRow = false;
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

		self.reportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);

		self.reportContainer.showOptionalHeaderRow(false);
		self.reportContainer.showDimension1Option(false);
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

	private setGridOptions(self: vendorBillNotesEntryViewModel): _reportViewer.ReportGridOption {
		var grOption = new _reportViewer.ReportGridOption();

		grOption.enableSelectiveDisplay = false;
		grOption.showGridSearchFilter = false;
		grOption.showPageSize = true;
		grOption.UIGridID = ko.observable("VendorBillGridNotesEntry");
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
		var textBox = '<div data-bind="attr: { \'class\': \'kgCell colt\' + $index()}"><input type="text" style="margin:0px 5px 0px 1px; box-shadow: inset 0 5px 5px rgba(0, 0, 0, 0.075); width:316px" data-bind="value: $parent.entity[\'description\']" /></div>';
		colDefinition = [
			{ field: 'description', displayName: 'Description', cellTemplate: textBox, sortable: false },
			{ field: 'noteBy', displayName: 'Notes By', sortable: false },
			{ field: 'noteType', displayName: 'Notes Type', sortable: false },
			{ field: 'noteDate', displayName: 'Notes Date', sortable: false }

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

	SetBITrackChange(self) {
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
		else
		{
			self.canAdd(false);
		}
	}

	public cleanup() {
		var self = this;
		try {
			if (typeof self.isBIDirty.dispose === "function") self.isBIDirty.dispose();

			self.reportContainer.cleanup("VendorBillGridNotesEntry");

			for (var prop in self) {
				delete self[prop];
			}
		}
		catch (e) {
		}
	}

	//#endregion
}
// This a view model of the line notes items
export class vendorBillNoteItem {
	description: KnockoutObservable<string> = ko.observable();
	noteBy: KnockoutObservable<string> = ko.observable();
	noteDate: KnockoutObservable<string> = ko.observable();
	noteByUserId: number;
	noteType: KnockoutObservable<string> = ko.observable('');
	noteTypeValue: KnockoutObservable<number> = ko.observable(0);

	// Get the entered notes and initialize the item
	constructor(strUserNote: string, strNoteBy: string, strNoteDate, noteType: string, noteTypeVale?:number) {
		var self = this;
		self.description(strUserNote);
		self.noteBy(strNoteBy);
		self.noteDate(moment(strNoteDate).format("MM/DD/YYYY"));
		self.noteType(noteType);
		self.noteTypeValue(noteTypeVale);
	}
}