/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', '../templates/reportViewerControlV2', 'services/models/common/Enums', 'services/models/salesOrder/SalesOrderNoteDetail', 'services/models/salesOrder/SalesOrderNotesContainer', 'services/client/SalesOrderClient'], function(require, exports, ___router__, ___app__, __refSystem__, ___reportViewer__, __refEnums__, __refSalesOrderNotesModel__, __refSalesOrderNotesContainerModel__, __refSalesOrderClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    var _reportViewer = ___reportViewer__;
    var refEnums = __refEnums__;
    var refSalesOrderNotesModel = __refSalesOrderNotesModel__;
    var refSalesOrderNotesContainerModel = __refSalesOrderNotesContainerModel__;
    
    var refSalesOrderClient = __refSalesOrderClient__;

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
    var SalesOrderNotesViewModel = (function () {
        // Initializes the properties of this class
        function SalesOrderNotesViewModel() {
            var _this = this;
            this.salesOrderNoteItems = ko.observableArray([]);
            this.canAdd = ko.observable(false);
            this.userNote = ko.observable('');
            this.currentUser = ko.observable();
            //salesOrderNoteTypes: KnockoutObservableArray<string> = ko.observableArray([]);
            // ###START: US20728
            this.salesOrderNoteTypes = ko.observableArray([]);
            // ###END: US20728
            this.selecteedNotesType = ko.observable("General");
            this.ischange = ko.observable(false);
            this.returnValue = ko.observable(false);
            this.modeType = ko.observable();
            // ###START: US20305
            //identify call from Edit
            this.isCallFromEdit = ko.observable(false);
            // Utility class object
            this.CommonUtils = new Utils.Common();
            //To check changes
            this.reportContainer = null;
            this.header = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.checkMsgDisplay = true;
            //to hold sales order no
            this.salesOrderNumber = ko.observable('');
            // ###START: US20728
            this.selectedsalesOrderNoteTypes = ko.observable(0);
            // ###END: US20728
            //to enable save button
            this.canSave = ko.observable(false);
            this.CanCreateNotes = false;
            var self = this;

            // Get the current user
            self.getLoggedInUserDetails();

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
            self.onAdd = function () {
                if (!self.currentUser()) {
                    self.getLoggedInUserDetails();
                }

                // ###START: US20728
                var notes = self.CommonUtils.getEnumValueById(refEnums.Enums.SalesOrderNotesType, self.selectedsalesOrderNoteTypes().toString());

                self.salesOrderNoteItems.unshift(new salesOrderNoteItem(0, _this.salesOrderId, self.userNote(), self.currentUser().FullName, Date.now(), notes, self.selectedsalesOrderNoteTypes()));

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
            };

            self.SetBITrackChange(self);

            self.getBITrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            self.isBIDirty = ko.computed(function () {
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
                // ##START: DE22477
                var selectedRowCount = items.length;

                if (selectedRowCount > 0) {
                    if ((items[selectedRowCount - 1].description().includes("Credit Requested for")) || (items[selectedRowCount - 1].description().includes("CM request raised"))) {
                        if (items[selectedRowCount - 1].description().length > 0 && items[selectedRowCount - 1].description().length > 1000) {
                            // ##START: US33122
                            self.userNote((items[selectedRowCount - 1].description() + "  Credit Requester Name: " + items[selectedRowCount - 1].noteBy()).substr(0, 999));
                        } else {
                            self.userNote(items[selectedRowCount - 1].description() + "  Credit Requester Name: " + items[selectedRowCount - 1].noteBy());
                        }
                        // ##END: US33122
                    } else {
                        if (items[selectedRowCount - 1].description().length > 0 && items[selectedRowCount - 1].description().length > 1000) {
                            self.userNote(items[selectedRowCount - 1].description().substr(0, 999));
                        } else {
                            self.userNote(items[selectedRowCount - 1].description());
                        }
                    }

                    // ##END: US24874
                    // ##END: DE22477
                    //self.userNote(items[0].description());
                    // ###START: US20728
                    self.selectedsalesOrderNoteTypes(items[0].noteTypeValue());
                    // ###END: US20728
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

            // ###START: US20728
            self.selectedsalesOrderNoteTypes.subscribe(function (selectedStatus) {
                self.selectedsalesOrderNoteTypes(selectedStatus);
            });
            // ###END: US20728
        }
        //START US18837
        // Adding notes for change in class or weight
        SalesOrderNotesViewModel.prototype.addNoteForReclass = function (description) {
            var self = this;

            self.salesOrderNoteItems.unshift(new salesOrderNoteItem(0, this.salesOrderId, description, self.currentUser().FullName, Date.now(), refEnums.Enums.Note.Communication.Value, refEnums.Enums.Note.Communication.ID));
        };

        //END US18837
        //###START: DE25233
        // Adding notes for  Canceled Insurance SO
        SalesOrderNotesViewModel.prototype.addNoteForCanceledInsurance = function (description) {
            var self = this;

            self.salesOrderNoteItems.unshift(new salesOrderNoteItem(0, this.salesOrderId, description, self.currentUser().FullName, Date.now(), refEnums.Enums.Note.General.Value, refEnums.Enums.Note.General.ID));
        };

        //###END: DE25233
        //#region Internal private methods
        SalesOrderNotesViewModel.prototype.resetGridSelection = function (self) {
            window.kg.toggleSelection(false);
        };

        SalesOrderNotesViewModel.prototype.setPagingData = function (data, grid, gridOption) {
            Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
        };

        SalesOrderNotesViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = false;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("salesOrderShipmentNotesGrid");
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

        SalesOrderNotesViewModel.prototype.setGridColumnDefinitions = function () {
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
        SalesOrderNotesViewModel.prototype.getLoggedInUserDetails = function () {
            var self = this;
            _app.trigger("GetCurrentUserDetails", function (currentUser) {
                self.currentUser(currentUser);
            });
        };

        //#region Public Methods
        SalesOrderNotesViewModel.prototype.initializesalesOrderNotes = function (notes, salesOrderId, invoiceStatus, isCallForEdit) {
            var self = this;
            self.salesOrderId = salesOrderId;
            self.invoiceStatus = invoiceStatus;

            // ###STRAT: US20305
            self.isCallFromEdit(isCallForEdit);

            if (self.salesOrderNoteItems != null) {
                self.salesOrderNoteItems().forEach(function (item) {
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
        };

        SalesOrderNotesViewModel.prototype.SetBITrackChange = function (self) {
            // ###START: DE21426
            self.userNote.extend({ trackChange: true });
            // ###END: DE21426
        };

        // To open Notes Section after editing in items.
        SalesOrderNotesViewModel.prototype.OpenNotes = function () {
            var self = this;
            self.expandNotesView();
        };

        //## function to expand the items view if any case we required
        SalesOrderNotesViewModel.prototype.expandNotesView = function () {
        };

        //## to enable add button if any notes entered/copy pasted in text area
        SalesOrderNotesViewModel.prototype.onKeyUp = function () {
            var self = this;
            var note = self.userNote();
            self.resetGridSelection(self);
            self.userNote(note);
            if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.userNote().trim())) {
                self.canAdd(true);
                if (self.invoiceStatus === 2 || self.invoiceStatus === 3 || self.CanCreateNotes === true) {
                    self.canSave(true);
                } else {
                    self.canSave(false);
                }
            } else {
                self.canAdd(false);
                self.canSave(false);
            }
        };

        //to save notes in case of Main Save button is disable
        SalesOrderNotesViewModel.prototype.onSave = function () {
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
            refSalesOrderClient.SalesOrderClient.prototype.SaveSalesOrderNotesDetail(self.salesOrderSaveNotesData, function (message) {
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
                    };
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
            }, function (message) {
            });
        };

        SalesOrderNotesViewModel.prototype.getSalesOrderNotes = function () {
            var self = this;
            var newShipment = true;
            var salesOrderNotes;

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

            if (self.canAdd()) {
                var notesDescription = self.userNote();

                //// ###START: DE22052
                var itemNew = new salesOrderNoteItem(0, self.salesOrderId, notesDescription, self.currentUser().FullName, Date.now(), notes, self.selectedsalesOrderNoteTypes());

                //// ###END: DE22052
                // ###END: US20728
                salesOrderNotes.push(self.AddNoteItem(itemNew));
            }
            return salesOrderNotes;
        };

        // function to use get item note model
        SalesOrderNotesViewModel.prototype.AddNoteItem = function (item) {
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
        };

        SalesOrderNotesViewModel.prototype.cleanup = function () {
            var self = this;

            if (typeof self.isBIDirty.dispose === "function")
                self.isBIDirty.dispose();

            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }

            delete self;
        };
        return SalesOrderNotesViewModel;
    })();
    exports.SalesOrderNotesViewModel = SalesOrderNotesViewModel;

    // This a view model of the line notes items
    var salesOrderNoteItem = (function () {
        // Get the entered notes and initialize the item
        function salesOrderNoteItem(id, entityId, strUserNote, strNoteBy, strNoteDate, noteType, noteTypeValue) {
            this.id = ko.observable(0);
            this.entityId = ko.observable(0);
            this.description = ko.observable();
            this.noteBy = ko.observable();
            this.noteDate = ko.observable();
            this.noteType = ko.observable('');
            //to hold value as numeric
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
        return salesOrderNoteItem;
    })();
    exports.salesOrderNoteItem = salesOrderNoteItem;
});
