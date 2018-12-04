/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

define(["require", "exports", 'plugins/router', 'durandal/app', '../templates/reportViewerControlV2', 'services/models/common/Enums'], function(require, exports, ___router__, ___app__, ___reportViewer__, __refEnums__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    
    
    
    var _reportViewer = ___reportViewer__;
    var refEnums = __refEnums__;

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
    var vendorBillNotesEntryViewModel = (function () {
        // Initializes the properties of this class
        function vendorBillNotesEntryViewModel() {
            var _this = this;
            this.vendorBillNoteItems = ko.observableArray([]);
            this.canAdd = ko.observable(false);
            this.userNote = ko.observable('');
            this.currentUser = ko.observable();
            this.vendorBillNoteTypes = ko.observableArray([]);
            this.selecteedNotesType = ko.observable("General");
            // Utility class object
            this.CommonUtils = new Utils.Common();
            this.ischange = ko.observable(false);
            this.reportContainer = null;
            this.header = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
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

                self.vendorBillNoteItems.unshift(new vendorBillNoteItem(self.userNote(), self.currentUser().FullName, Date.now(), self.selecteedNotesType(), noteTypeValue));
                self.userNote("");

                $("#txtuserNote").focus();
                self.ischange(true);
                self.setPagingData(ko.observableArray(self.vendorBillNoteItems()), self.gridOptions, self.reportAction);
                self.canAdd(false);
                self.resetGridSelection(self);
            };

            //self.canAdd = ko.computed(() => {
            //	var alowAdd = false;
            //	if (self.userNote().length > 0 && $.trim(self.userNote()) !== "") {
            //		alowAdd = true;
            //	}
            //	return alowAdd;
            //});
            self.SetBITrackChange(self);

            self.getBITrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            self.isBIDirty = ko.computed(function () {
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

            self.reportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);

            self.reportContainer.showOptionalHeaderRow(false);
            self.reportContainer.showDimension1Option(false);
            self.reportContainer.OptionalHeaderRowLocation('TOP');
            self.reportContainer.onFilterChange = self.setReportCriteria;
            self.reportContainer.ForceChange();

            //if we click on grid ROW then notes will be appear in the text area field. (canSelectRows => true;)
            self.reportContainer.afterSelectionChange = function (items) {
                var selectedRowCount = items.length;

                if (selectedRowCount > 0) {
                    self.userNote(items[0].description());
                } else {
                    self.userNote('');
                }
                self.canAdd(false);
            };
        }
        //#region Internal private methods
        vendorBillNotesEntryViewModel.prototype.resetGridSelection = function (self) {
            window.kg.toggleSelection(false);
        };

        vendorBillNotesEntryViewModel.prototype.setPagingData = function (data, grid, gridOption) {
            Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
        };

        vendorBillNotesEntryViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();

            grOption.enableSelectiveDisplay = false;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("VendorBillGridNotesEntry");
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

        vendorBillNotesEntryViewModel.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            var textBox = '<div data-bind="attr: { \'class\': \'kgCell colt\' + $index()}"><input type="text" style="margin:0px 5px 0px 1px; box-shadow: inset 0 5px 5px rgba(0, 0, 0, 0.075); width:316px" data-bind="value: $parent.entity[\'description\']" /></div>';
            colDefinition = [
                { field: 'description', displayName: 'Description', cellTemplate: textBox, sortable: false },
                { field: 'noteBy', displayName: 'Notes By', sortable: false },
                { field: 'noteType', displayName: 'Notes Type', sortable: false },
                { field: 'noteDate', displayName: 'Notes Date', sortable: false }
            ];
            return colDefinition;
        };

        // Gets the logged in user details from shell.js
        vendorBillNotesEntryViewModel.prototype.getLoggedInUserDetails = function () {
            var self = this;
            _app.trigger("GetCurrentUserDetails", function (currentUser) {
                self.currentUser(currentUser);
            });
        };

        //#region Public Methods
        vendorBillNotesEntryViewModel.prototype.SetBITrackChange = function (self) {
            self.userNote.extend({ trackChange: true });
        };

        // To open Notes Section after editing in items.
        vendorBillNotesEntryViewModel.prototype.OpenNotes = function () {
            $("#collapseNotes").collapse('show');
            if ($("#collapseNotes").hasClass('in')) {
                $("#AchorcollapseNotes").removeClass('collapsed');
            } else {
                $("#AchorcollapseNotes").addClass('collapsed');
            }
        };

        //## to enable add button if any notes entered/copy pasted in text area
        vendorBillNotesEntryViewModel.prototype.onKeyUp = function () {
            var self = this;
            var note = self.userNote();
            self.resetGridSelection(self);
            self.userNote(note);
            if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.userNote().trim())) {
                self.canAdd(true);
            } else {
                self.canAdd(false);
            }
        };

        vendorBillNotesEntryViewModel.prototype.cleanup = function () {
            var self = this;
            try  {
                if (typeof self.isBIDirty.dispose === "function")
                    self.isBIDirty.dispose();

                self.reportContainer.cleanup("VendorBillGridNotesEntry");

                for (var prop in self) {
                    delete self[prop];
                }
            } catch (e) {
            }
        };
        return vendorBillNotesEntryViewModel;
    })();
    exports.vendorBillNotesEntryViewModel = vendorBillNotesEntryViewModel;

    // This a view model of the line notes items
    var vendorBillNoteItem = (function () {
        // Get the entered notes and initialize the item
        function vendorBillNoteItem(strUserNote, strNoteBy, strNoteDate, noteType, noteTypeVale) {
            this.description = ko.observable();
            this.noteBy = ko.observable();
            this.noteDate = ko.observable();
            this.noteType = ko.observable('');
            this.noteTypeValue = ko.observable(0);
            var self = this;
            self.description(strUserNote);
            self.noteBy(strNoteBy);
            self.noteDate(moment(strNoteDate).format("MM/DD/YYYY"));
            self.noteType(noteType);
            self.noteTypeValue(noteTypeVale);
        }
        return vendorBillNoteItem;
    })();
    exports.vendorBillNoteItem = vendorBillNoteItem;
});
