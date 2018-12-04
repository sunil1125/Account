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
define(["require", "exports", 'plugins/router', 'durandal/app', '../templates/reportViewerControlV2', 'services/models/vendorBill/VendorBillNotesContainer', 'services/client/VendorBillClient', 'services/models/vendorBill/VendorBillNote', 'services/models/common/Enums'], function(require, exports, ___router__, ___app__, ___reportViewer__, __refVendorBillNotesContainerModel__, __refVendorBillClient__, ___refVendorBillNotesModel__, __refEnums__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    
    
    
    var _reportViewer = ___reportViewer__;
    var refVendorBillNotesContainerModel = __refVendorBillNotesContainerModel__;
    var refVendorBillClient = __refVendorBillClient__;
    var _refVendorBillNotesModel = ___refVendorBillNotesModel__;
    var refEnums = __refEnums__;

    //#endregion
    /*
    ** <summary>
    ** Vendor Bill Notes View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US8214</id> <by>Avinash Dubey</by> <date>04-24-2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id>US20305</id> <by>Chandan Singh Bajetha</by> <date>07-01-2016</date> <description>Acct: Remove extra ADD button from SO & VB Notes Section</description>
    ** <id>DE21426</id> <by>Vasanthakumar</by> <date>19-01-2016</date> <description>Notes textbox are persistent after clicking reload button</description>
    ** <id>DE21390</id> <by>Vasanthakumar</by> <date>22-01-2016</date> <description>System shows Change Detection message when user navigate to another tab</description>
    ** <id>DE22052</id> <by>Vasanthakumar</by> <date>04-03-2016</date> <description>Notes are not saved properly Entity id saves as 0 and note type </description>
    ** <id>US23990</id> <by>Janakiram</by> <date>19-08-2016</date> <description> passing correct vendor bill id while adding notes </description>
    ** <id>DE23159</id> <by>Vasanthakumar</by> <date>03-10-2016</date><description>VB is opening as Editable mode for Account Receivable role.</description>
    ** </changeHistory>
    */
    var vendorBillNotesViewModel = (function () {
        // Initializes the properties of this class
        function vendorBillNotesViewModel() {
            var _this = this;
            this.vendorBillNoteItems = ko.observableArray([]);
            this.canAdd = ko.observable(false);
            this.userNote = ko.observable('');
            this.currentUser = ko.observable();
            this.vendorBillNoteTypes = ko.observableArray([]);
            this.selecteedNotesType = ko.observable("General");
            this.masTransferDate = ko.observable();
            this.billStatus = ko.observable();
            // Utility class object
            this.CommonUtils = new Utils.Common();
            //To check changes
            this.ischange = ko.observable(false);
            this.returnValue = ko.observable(false);
            this.reportContainer = null;
            this.header = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            // ###ENDEND: US20305
            //to enable save button
            this.canSave = ko.observable(false);
            this.checkMsgDisplay = true;
            this.disposables = [];
            var self = this;

            // Get the current user
            self.getLoggedInUserDetails();

            // Create the notes type
            self.vendorBillNoteTypes.push("General");
            self.vendorBillNoteTypes.push("Problem");
            self.vendorBillNoteTypes.push("Setup");

            //self.vendorBillNoteTypes.push("Memo");
            // Handles the add command
            self.onAdd = function () {
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

                self.vendorBillNoteItems.unshift(new vendorBillNoteItem(0, _this.vendorBillId, self.userNote(), self.currentUser().FullName, Date.now(), self.selecteedNotesType(), noteTypeValue));
                self.userNote("");
                $("#txtuserNote").focus();
                self.selecteedNotesType("General");
                self.ischange(true);
                self.setPagingData(ko.observableArray(self.vendorBillNoteItems()), self.gridOptions, self.reportAction);
                self.canAdd(false);
                self.resetGridSelection(self);
                if ((self.masTransferDate() !== undefined && self.masTransferDate() !== null) || (self.billStatus() === refEnums.Enums.VendorBillStatus.Cleared.ID)) {
                    self.canSave(true);
                }
            };

            //self.canAdd = ko.computed(() => {
            //	var alowAdd = false;
            //	if (self.userNote().length > 0 && $.trim(this.userNote()) !== "") {
            //		alowAdd = true;
            //	}
            //	return alowAdd;
            //});
            self.SetBITrackChange(self);

            self.getBITrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            self.disposables.push(self.isBIDirty = ko.computed(function () {
                var result = (self.getBITrackChange().length ? true : false);
                self.returnValue(result);
                if (self.onChangesMade) {
                    self.onChangesMade(result);
                }

                return result;
            }));

            self.header = new _reportViewer.ReportHeaderOption();
            self.header.reportHeader = "";
            self.header.reportName = "Vendor Bill Notes";
            self.header.gridTitleHeader = "";

            //initialize date filters
            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);

            self.setReportCriteria = function (reportActionObj) {
                self.gridOptions = reportActionObj.gridOptions;
                if (self.reportAction != null) {
                    if ((self.modeType() != reportActionObj.filter1selectedItemId) || (self.reportAction.view != reportActionObj.view) || (reportActionObj.dateFrom != self.reportAction.dateFrom) || (reportActionObj.dateTo != self.reportAction.dateTo)) {
                        self.gridOptions.pagingOptions.currentPage(1);
                    }
                }

                // Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
                // we don't want any data on page load so we commented getReportdata  function.
                // self.getReportData();
                _this.reportAction = reportActionObj;

                if (reportActionObj.dateFrom !== null && reportActionObj.dateTo !== null) {
                    // self.getReportData();
                } else {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };
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
            self.reportContainer.afterSelectionChange = function (items) {
                var selectedRowCount = items.length;

                if (self.isReadViewOnly === true) {
                    return;
                }

                if (selectedRowCount > 0) {
                    self.userNote(items[0].description());
                } else {
                    self.userNote('');
                }
                self.canAdd(false);
            };

            //To check if Msg is clicked
            self.checkMsgClick = function () {
                self.checkMsgDisplay = true;
            };

            // to Check if Msg is hidden or closed
            self.checkMsgHide = function () {
                self.checkMsgDisplay = true;
            };
        }
        //#region Internal private methods
        vendorBillNotesViewModel.prototype.resetGridSelection = function (self) {
            window.kg.toggleSelection(false);
        };

        vendorBillNotesViewModel.prototype.setPagingData = function (data, grid, gridOption) {
            Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
        };

        vendorBillNotesViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = false;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("VendorBillGridNotesView");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
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
        };

        vendorBillNotesViewModel.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            colDefinition = [
                { field: 'description', displayName: 'Description', sortable: false },
                { field: 'noteBy', displayName: 'Notes By', sortable: false },
                { field: 'noteType', displayName: 'Notes Type', sortable: false },
                { field: 'noteDate', displayName: 'Notes Date', sortable: false }
            ];
            return colDefinition;
        };

        // Gets the logged in user details from shell.js
        vendorBillNotesViewModel.prototype.getLoggedInUserDetails = function () {
            var self = this;
            _app.trigger("GetCurrentUserDetails", function (currentUser) {
                self.currentUser(currentUser);
            });
        };

        //#region Public Methods
        vendorBillNotesViewModel.prototype.initializeVendorBillNotes = function (notes, masTransferDate, vendorBillId, billStatus) {
            var self = this;
            self.vendorBillId = vendorBillId;
            self.masTransferDate(masTransferDate);
            self.billStatus(billStatus);
            if (self.vendorBillNoteItems != null) {
                self.vendorBillNoteItems.removeAll();
            }

            if (notes != null) {
                for (var i = 0; i < notes.length; i++) {
                    if (notes[i].NotesType !== 4) {
                        self.vendorBillNoteItems.push(new vendorBillNoteItem(notes[i].Id, notes[i].EntityId, notes[i].NotesDescription, notes[i].NotesBy, notes[i].NotesDate, notes[i].NoteTypeName, notes[i].NotesType));
                    }
                }

                self.setPagingData(ko.observableArray(self.vendorBillNoteItems()), self.gridOptions, self.reportAction);
            }

            // ###START: DE21426
            self.userNote("");
            self.canSave(false);
            self.canAdd(false);
            // ###END: DE21426
        };

        vendorBillNotesViewModel.prototype.SetBITrackChange = function (self) {
            self.userNote.extend({ trackChange: true });
        };

        // To open Notes Section after editing in items.
        vendorBillNotesViewModel.prototype.OpenNotes = function () {
            var self = this;
            self.expandNotesView();
        };

        //## function to expand the items view if any case we required
        vendorBillNotesViewModel.prototype.expandNotesView = function () {
            if (!$('#collapseNotes').hasClass('in')) {
                $('#collapseNotes').addClass('in');
                $("#collapseNotes").css("height", 'auto');
                $('#AchorcollapseNotes').removeClass('collapsed');
            }
        };

        //## to enable add button if any notes entered/copy pasted in text area
        vendorBillNotesViewModel.prototype.onKeyUp = function () {
            var self = this;
            var note = self.userNote();
            self.resetGridSelection(self);
            self.userNote(note);
            if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.userNote().trim())) {
                self.canAdd(true);
                if ((self.masTransferDate() !== undefined && self.masTransferDate() !== null) || (self.billStatus() === refEnums.Enums.VendorBillStatus.Cleared.ID)) {
                    self.canSave(true);
                } else {
                    self.canSave(false);
                }
            } else {
                self.canAdd(false);
                self.canSave(false);
            }
        };

        // copy main bill mas notes into sub bill notes
        vendorBillNotesViewModel.prototype.initializeMasNotesDetailsForSubBill = function (notes, proNumber) {
            var self = this;

            if (notes != null) {
                for (var i = 0; i < notes.length; i++) {
                    var description = "Copied from " + proNumber.substring(0, proNumber.lastIndexOf(" ")) + " : " + notes[i].MemoText;
                    self.vendorBillNoteItems.unshift(new vendorBillNoteItem(0, 0, description, self.currentUser().FullName, Date.now(), "Mas"));
                }

                self.setPagingData(ko.observableArray(self.vendorBillNoteItems()), self.gridOptions, self.reportAction);
            }
        };

        //to save notes in case of Main Save button is disable
        vendorBillNotesViewModel.prototype.onSave = function () {
            var self = this;
            self.vendorBillSaveNotesData = new refVendorBillNotesContainerModel.Model.VendorBillNotesContainer();
            self.vendorBillSaveNotesData.VendorBillNoteDetails = self.getVendorBillNotes();
            self.vendorBillSaveNotesData.Id = self.vendorBillId;

            // ###START: US20305
            // Using to update localstorage data
            // START
            var dataToUpdateNotes = LocalStorageController.Get(self.vbStorageKey + 'VB');
            if (dataToUpdateNotes !== null && dataToUpdateNotes !== undefined) {
                if (dataToUpdateNotes.VendorBillNotes !== null && dataToUpdateNotes.VendorBillNotes !== undefined) {
                    dataToUpdateNotes.VendorBillNotes.removeAll;
                }
                dataToUpdateNotes.VendorBillNotes = self.vendorBillSaveNotesData.VendorBillNoteDetails;
                LocalStorageController.Set(self.vbStorageKey + 'VB', undefined);
                LocalStorageController.Set(self.vbStorageKey + 'VB', dataToUpdateNotes);
            }

            // END
            // ###END: US20305
            refVendorBillClient.VendorBillClient.prototype.SaveVendorBillNotesDetail(self.vendorBillSaveNotesData, function (message) {
                //to reload the grid
                self.vendorBillNoteItems.removeAll();
                self.initializeVendorBillNotes(message, self.masTransferDate(), self.vendorBillId, self.billStatus());
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var toastrOptions1 = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SaveVendorBillNotesSuccessfully, "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
                }
                self.userNote('');
                self.canAdd(false);
                self.canSave(false);

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
            }, function (message) {
            });
        };

        vendorBillNotesViewModel.prototype.getVendorBillNotes = function () {
            var self = this;
            var newShipment = true;
            var vendorBillNotes;
            vendorBillNotes = ko.observableArray([])();
            vendorBillNotes.removeAll();
            self.vendorBillNoteItems().forEach(function (item, collection) {
                if (item.description() != "") {
                    vendorBillNotes.push(self.AddNoteItem(item));
                }
            });

            if (self.canAdd()) {
                //// ###START: DE22052
                var noteTypeValue = 0;
                if (self.selecteedNotesType() == "Setup") {
                    noteTypeValue = refEnums.Enums.Note.Information.ID;
                } else if (self.selecteedNotesType() == "Problem") {
                    noteTypeValue = refEnums.Enums.Note.Problem.ID;
                } else {
                    noteTypeValue = refEnums.Enums.Note.General.ID;
                }
                var notesDescription = self.userNote();
                var itemNew = new vendorBillNoteItem(0, self.vendorBillId, notesDescription, self.currentUser().FullName, Date.now(), self.selecteedNotesType(), noteTypeValue);

                //// ###END: DE22052
                vendorBillNotes.push(self.AddNoteItem(itemNew));
            }
            return vendorBillNotes;
        };

        // function to use get item note model
        vendorBillNotesViewModel.prototype.AddNoteItem = function (item) {
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
        };

        vendorBillNotesViewModel.prototype.cleanup = function () {
            var self = this;
            try  {
                if (typeof self.isBIDirty.dispose === "function")
                    self.isBIDirty.dispose();

                self.disposables.forEach(function (disposable) {
                    if (disposable && typeof disposable.dispose === "function") {
                        disposable.dispose();
                    } else {
                        delete disposable;
                    }
                });

                self.reportContainer.cleanup("VendorBillGridNotesView");

                for (var prop in self) {
                    if (typeof self[prop].dispose === "function") {
                        self[prop].dispose();
                    }
                    delete self[prop];
                }
            } catch (e) {
            }
        };
        return vendorBillNotesViewModel;
    })();
    exports.vendorBillNotesViewModel = vendorBillNotesViewModel;

    // This a view model of the line notes items
    var vendorBillNoteItem = (function () {
        // Get the entered notes and initialize the item
        function vendorBillNoteItem(id, entityId, strUserNote, strNoteBy, strNoteDate, noteType, noteTypeValue) {
            this.id = ko.observable(0);
            this.entityId = ko.observable(0);
            this.description = ko.observable();
            this.noteBy = ko.observable();
            this.noteDate = ko.observable();
            this.noteType = ko.observable('');
            this.noteTypeValue = ko.observable(0);
            var self = this;
            self.id(id);
            self.entityId(entityId);
            self.description(strUserNote);
            self.noteBy(strNoteBy);
            self.noteDate(moment(strNoteDate).format("MM/DD/YYYY"));
            self.noteType(noteType);
            self.noteTypeValue(noteTypeValue);
        }
        return vendorBillNoteItem;
    })();
    exports.vendorBillNoteItem = vendorBillNoteItem;
});
