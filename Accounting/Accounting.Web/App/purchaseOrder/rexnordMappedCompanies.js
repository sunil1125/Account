/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

define(["require", "exports", 'plugins/router', 'durandal/app', 'services/client/PurchaseOrderClient', 'services/models/purchaseOrder/VolumeCustomerBillsIdentificationMapping', 'services/models/purchaseOrder/VolumeCustomerMapping', '../templates/reportViewerControlV2', 'services/models/common/Enums'], function(require, exports, ___router__, ___app__, __refpurchaseOrderClient__, ___refBillsIdentificationMapping__, ___refVolumeCustomerMapping__, ___reportViewer__, __refEnums__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refpurchaseOrderClient = __refpurchaseOrderClient__;
    var _refBillsIdentificationMapping = ___refBillsIdentificationMapping__;
    var _refVolumeCustomerMapping = ___refVolumeCustomerMapping__;
    var _reportViewer = ___reportViewer__;
    var refEnums = __refEnums__;

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
    var RexnordCompany = (function () {
        // Get mapped Companies
        function RexnordCompany(id, customerId, companyToken) {
            this.id = ko.observable(0);
            this.customerId = ko.observable(0);
            this.companyToken = ko.observable('');
            var self = this;
            self.id(id);
            self.customerId(customerId);
            self.companyToken(companyToken);
        }
        return RexnordCompany;
    })();
    exports.RexnordCompany = RexnordCompany;

    var RexnordMappedCompaniesViewModel = (function () {
        //#endregion
        //#region Constructor
        function RexnordMappedCompaniesViewModel() {
            //#region Variable Declaration
            this.rexnordCompaniesList = ko.observableArray([]);
            this.purchaseOrderClient = new refpurchaseOrderClient.PurchaseOrderClient();
            this.companyName = ko.observable('');
            this.companyId = ko.observable(0);
            //#endregion Variable Declaration
            //#region public report viewer members
            this.reportContainer = null;
            this.header = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.app = _app;
            this.modeType = ko.observable();
            this.checkMsgDisplay = true;
            // flag for enable/disbale save button
            this.isSave = ko.observable(true);
            // Utility class object
            this.CommonUtils = new Utils.Common();
            var self = this;
            self.header = new _reportViewer.ReportHeaderOption();
            self.header.reportHeader = "";
            self.header.reportName = "";
            self.header.gridTitleHeader = " ";

            //initialize date filters
            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);
            self.searchText = ko.observable("");

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
                self.reportAction = reportActionObj;

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
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.DateTimeValidation, "info", null, toastrOptions);
                }
            };

            self.reportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);

            self.reportContainer.onFilterChange = self.setReportCriteria;
            self.reportContainer.ForceChange();

            //## to display the text of clicked link in a text box
            self.selectedRexnordCompany = function (selected) {
                if (selected != null) {
                    self.companyName(selected.companyToken());
                    self.companyId(selected.id());
                }
            };

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
            self.deleteitem = function () {
                var listOfDeletedCompanies = new _refVolumeCustomerMapping.Models.VolumeCustomerMapping();
                var company = new _refBillsIdentificationMapping.Models.VolumeCustomerBillsIdentificationMapping();
                company.Id = self.selecteditemtoremove.id();
                company.CustomerId = self.selecteditemtoremove.customerId();
                company.CompanyToken = self.selecteditemtoremove.companyToken();
                company.IsMarkedForDeletion = true;

                var companyList;
                companyList = ko.observableArray([])();
                companyList.push(company);

                listOfDeletedCompanies.DeletedItems = companyList;

                var successCallBack = function () {
                    self.getRexnordCompaniesList();
                };
                var faliureCallBack = function () {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, "Some Error Occured", "error", null, toastrOptions);
                };
                self.purchaseOrderClient.insertUpdateOrDeleteVolumeCustomerBillsIdentificationMapping(listOfDeletedCompanies, successCallBack, faliureCallBack);
            };

            //To assign text the selected company name
            self.reportContainer.onGridColumnClick2 = function (Obj) {
                if (Obj != null) {
                    self.companyName(Obj.CompanyToken);
                    self.companyId(Obj.Id);
                }
            };

            //To Delete selected company
            self.reportContainer.onGridColumnClick = function (Obj) {
                var del = new RexnordCompany(Obj.Id, Obj.CustomerId, Obj.CompanyToken);

                self.selecteditemtoremove = del;

                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;

                    var actionButtons = [];
                    actionButtons.push({
                        actionButtonName: "Yes",
                        actionClick: self.deleteitem
                    });

                    actionButtons.push({
                        actionButtonName: "No",
                        actionClick: self.checkMsgClick
                    });

                    var toastrOptions1 = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 30,
                        fadeOut: 30,
                        typeOfAlert: "",
                        title: "",
                        actionButtons: actionButtons
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.AreYouSureYouWantToDeleteThisRecord, "warning", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
                }
            };

            //To check if Msg is clicked
            self.checkMsgClick = function () {
                self.checkMsgDisplay = true;
            };

            // to Check if Msg is hidden or closed
            self.checkMsgHide = function () {
                self.checkMsgDisplay = true;
            };

            //for search filter
            self.reportContainer.onSearchTextChange = function (reportViewer, newSearchValue) {
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
        RexnordMappedCompaniesViewModel.prototype.setPagingData = function (data, grid, gridOption) {
            Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
        };

        RexnordMappedCompaniesViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = true;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("RexnordCompanyMappingGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
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
        };

        RexnordMappedCompaniesViewModel.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;
            var removeCellTemplate = '<div style="text-align:center; margin-top:7px;"><input type="image" data-bind="click: function() { $userViewModel.onGridColumnClick($parent.entity) }"  src="Content/images/Icon_Trash.png"; /></div>';
            var companyCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'CompanyToken\'], click: function() { $userViewModel.onGridColumnClick2($parent.entity)}" />';

            colDefinition = [
                { field: 'Id', displayName: 'Id', isRemovable: false, visible: false },
                { field: 'CustomerId', displayName: 'CustomerId', isRemovable: false, visible: false },
                { field: 'CompanyToken', displayName: 'Company Name', width: 1175, isRemovable: false, cellTemplate: companyCellTemplate },
                { field: 'Delete', displayName: 'Delete', isRemovable: false, width: 75, sortable: false, cellTemplate: removeCellTemplate }
            ];
            return colDefinition;
        };

        RexnordMappedCompaniesViewModel.prototype.load = function (dataToBind) {
            if (!dataToBind)
                return;

            var self = this;

            //self.gridOptions.data(dataToBind);
            self.setPagingData(ko.observableArray(dataToBind), self.gridOptions, self.reportAction);
        };

        //#endregion
        //close popup
        RexnordMappedCompaniesViewModel.prototype.closePopup = function (dialogResult) {
            dialogResult.__dialog__.close(this, dialogResult);
            return true;
        };

        // Shows the message box as pr the given title and message
        RexnordMappedCompaniesViewModel.prototype.showConfirmationMessage = function (message, title, fisrtButtoName, secondButtonName, yesCallBack, noCallBack) {
            var self = this;

            var varMsgBox = [
                {
                    id: 0,
                    name: fisrtButtoName,
                    callback: function () {
                        return yesCallBack();
                    }
                },
                {
                    id: 1,
                    name: secondButtonName,
                    callback: function () {
                        return noCallBack();
                    }
                }
            ];

            ////initialize message box control arguments
            var optionControlArgs = {
                options: varMsgBox,
                message: message,
                title: title
            };
            _app.showDialog('templates/messageBox', optionControlArgs, 'slideDown');
        };

        //#region Public Methods
        RexnordMappedCompaniesViewModel.prototype.initializeRexnordCompanies = function (companies) {
            var self = this;
            if (self.rexnordCompaniesList != null) {
                self.rexnordCompaniesList.removeAll();
            }
            if (companies != null) {
                for (var i = 0; i < companies.length; i++) {
                    self.rexnordCompaniesList.push(new RexnordCompany(companies[i].Id, companies[i].CustomerId, companies[i].CompanyToken));
                }
            }
        };

        //## to add/modify new company to the list
        RexnordMappedCompaniesViewModel.prototype.saveClick = function () {
            var self = this;
            self.isSave(false);

            if (!self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.companyName())) {
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;

                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        ddelayInseconds: 15,
                        fadeOut: 15,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.EnterCompanyName, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
                self.isSave(true);
                self.companyName('');
                self.companyId(0);
            } else {
                var listOfCompanies = new _refVolumeCustomerMapping.Models.VolumeCustomerMapping();
                var companyList;
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

                var successCallBack = function () {
                    if (self.companyId() > 0) {
                        if (self.checkMsgDisplay) {
                            self.checkMsgDisplay = false;

                            var toastrOptions = {
                                toastrPositionClass: "toast-top-middle",
                                delayInseconds: 15,
                                fadeOut: 15,
                                typeOfAlert: "",
                                title: ""
                            };
                            Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.RecordUpdatedSuccessfully, "success", self.checkMsgClick, toastrOptions, self.checkMsgHide);
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
                            };
                            Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.RecordSavedSuccessfully, "success", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                        }
                    }
                    self.getRexnordCompaniesList();
                }, faliureCallBack = function () {
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 15,
                            fadeOut: 15,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(false, ApplicationMessages.Messages.ErrorinAddModifyRexnordCompany, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                    }
                };

                self.purchaseOrderClient.insertUpdateOrDeleteVolumeCustomerBillsIdentificationMapping(listOfCompanies, successCallBack, faliureCallBack);
                self.isSave(true);
                self.companyName('');
                self.companyId(0);
            }
        };

        // To get the rexnord companies list
        RexnordMappedCompaniesViewModel.prototype.getRexnordCompaniesList = function () {
            var self = this;
            self.reportContainer.listProgress(true);
            var successCallBack = function (data) {
                self.load(data);
                self.reportContainer.listProgress(false);
            }, faliureCallBack = function () {
                self.reportContainer.listProgress(false);
            };

            self.purchaseOrderClient.getRexnordMappedCompanies(successCallBack, faliureCallBack);
        };

        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        RexnordMappedCompaniesViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        RexnordMappedCompaniesViewModel.prototype.compositionComplete = function (view, parent) {
            $("#txtCompanyName").focus();
        };

        RexnordMappedCompaniesViewModel.prototype.activate = function () {
            return true;
        };
        RexnordMappedCompaniesViewModel.prototype.beforeBind = function () {
            var self = this;
        };

        RexnordMappedCompaniesViewModel.prototype.cleanup = function () {
            var self = this;

            self.rexnordCompaniesList.removeAll();
            self.reportContainer.cleanup("RexnordCompanyMappingGrid");

            for (var prop in self) {
                if (prop !== "cleanup")
                    delete self[prop];
            }
            delete self;
        };
        return RexnordMappedCompaniesViewModel;
    })();
    exports.RexnordMappedCompaniesViewModel = RexnordMappedCompaniesViewModel;
});
