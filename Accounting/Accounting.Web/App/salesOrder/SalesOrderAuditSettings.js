/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region REFERENCES
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'vendorBill/VendorBillOptionButtonControl', 'services/models/common/Enums', '../templates/reportViewerControlV2', 'templates/searchVendorNameControl', 'services/client/SalesOrderClient', 'services/models/salesOrder/SalesOrderAuditSettingCarrierDetails', 'services/models/salesOrder/SalesOrderAuditSettingItems', 'services/models/salesOrder/SalesOrderAuditSettingContainer'], function(require, exports, ___router__, ___app__, __refSystem__, __refVendorBillOptionButtonControl__, __refEnums__, ___reportViewer__, __refCarrierSearchControl__, __refSalesOrderClient__, __refCarrierDetails__, __refItemsDetails__, __refContainer__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    var refVendorBillOptionButtonControl = __refVendorBillOptionButtonControl__;
    var refEnums = __refEnums__;
    var _reportViewer = ___reportViewer__;
    
    var refCarrierSearchControl = __refCarrierSearchControl__;
    var refSalesOrderClient = __refSalesOrderClient__;
    var refCarrierDetails = __refCarrierDetails__;
    var refItemsDetails = __refItemsDetails__;
    var refContainer = __refContainer__;

    //#endregion
    /***********************************************
    SALES ORDER AUDIT SETTINGS VIEW MODEL
    ************************************************
    ** <summary>
    ** Purchase Order details View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US13213</id><by>Satish</by> <date>28th Nov, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by><date></date>
    ** </changeHistory>
    
    ***********************************************/
    var SalesOrderAuditSettingsViewModel = (function () {
        //#endregion
        //#endregion MEMBERS
        //#region CONSTRUCTOR
        function SalesOrderAuditSettingsViewModel() {
            //#region MEMBERS
            this.fakItemsList = ko.observableArray([]);
            this.shipmentItemTypes = ko.observableArray([]);
            this.selectedItemType = ko.observable();
            this.matchingToken = ko.observable();
            this.carrierId = ko.observable();
            this.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
            this.listProgress = ko.observable(false);
            // To get the logged in user
            this.currentUser = ko.observable();
            this.canShowValidation = ko.observable(false);
            this.checkMsgDisplay = true;
            //#region report Container Members
            this.reportContainer = null;
            this.header = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            var self = this;

            if (!self.currentUser()) {
                // Get the logged in user for name for new note}
                _app.trigger("GetCurrentUserDetails", function (currentUser) {
                    self.currentUser(currentUser);
                });
            }

            //Initialize Carrier instance
            self.carrierSearchList = new refCarrierSearchControl.SearchVendorNameControl("A valid Carrier is required.", '250px', '245px', true, // on change of carrier then hit the DB to fetch status and items of carrier
            function (carrierId) {
                self.carrierId(carrierId);
                self.fakItemsList.removeAll();
                self.canShowValidation(false);
                self.getFAKDetails();
            });

            //#region Option Buttons
            //To set the checkbox bill option values
            var checkBoxOptions = [{ id: refEnums.Enums.vendorBillOptionConstant.FAKMapping, name: 'FAK Mapping Applicable', selected: true }];

            //set checkbox property
            var argsvendorBillOptionList = {
                options: checkBoxOptions,
                useHtmlBinding: true,
                isMultiCheck: true,
                isVerticalView: false
            };

            self.obcCheckBox = new refVendorBillOptionButtonControl.VendorBillOptionButtonControl(argsvendorBillOptionList, refEnums.Enums.OptionButtonsView.Vertical, '175px');

            //#endregion
            //#region Add
            self.onAdd = function () {
                var self = this;
                self.canShowValidation(true);
                if (self.validation()) {
                    self.fakItemsList.unshift(new auditSettingItem(self.matchingToken(), self.selectedItemType(), 0, self.currentUser().UserName.toString()));
                    self.canShowValidation(false);
                    self.matchingToken("");
                    $("#txtDescription").focus();
                    self.selectedItemType(null);
                    self.setPagingData(ko.observableArray(self.fakItemsList()), self.gridOptions, self.reportAction);
                    self.resetGridSelection(self);
                } else {
                    return false;
                }
            };

            //#endregion
            //#region report container logic
            self.header = new _reportViewer.ReportHeaderOption();
            self.header.reportHeader = "";
            self.header.reportName = "Audit Settings Description";
            self.header.gridTitleHeader = "";
            self.header.showReportOptionalHeaderRow = false;

            //initialize date filters
            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);

            self.setReportCriteria = function (reportActionObj) {
                self.gridOptions = reportActionObj.gridOptions;
                self.reportAction = reportActionObj;
            };

            self.reportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);
            self.reportContainer.showOptionalHeaderRow(false);
            self.reportContainer.showDimension1Option(false);
            self.reportContainer.OptionalHeaderRowLocation('TOP');
            self.reportContainer.onFilterChange = self.setReportCriteria;
            self.reportContainer.ForceChange();

            //#endregion
            //#region validation Logic
            self.matchingToken.extend({
                required: {
                    message: ApplicationMessages.Messages.FAKDescriptionRequired,
                    onlyIf: function () {
                        return (self.canShowValidation());
                    }
                },
                minLength: {
                    message: ApplicationMessages.Messages.FAKCannotBeLessThanThreeCharacters,
                    params: 3,
                    onlyIf: function () {
                        return (self.canShowValidation());
                    }
                }
            });

            self.selectedItemType.extend({
                required: {
                    message: ApplicationMessages.Messages.FAKItemRequired,
                    onlyIf: function () {
                        return (self.canShowValidation());
                    }
                }
            });

            //#region Error Details Object
            self.errorFAKDetail = ko.validatedObservable({
                selectedItemType: self.selectedItemType,
                matchingToken: self.matchingToken,
                carrierSearchList: self.carrierSearchList
            });

            //#endregion
            return self;
        }
        //#endregion
        //#endregion
        //#region METHODS
        //#region Report Container
        // function to reset the grid selection.
        SalesOrderAuditSettingsViewModel.prototype.resetGridSelection = function (self) {
            window.kg.toggleSelection(false);
        };

        // function to set the paging data.
        SalesOrderAuditSettingsViewModel.prototype.setPagingData = function (data, grid, gridOption) {
            Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
        };

        // function to set the grid options.
        SalesOrderAuditSettingsViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();

            grOption.enableSelectiveDisplay = false;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("SalesOrderAuditSettingsGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
                columnName: "matchingToken",
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

        // function to set the column definitions
        SalesOrderAuditSettingsViewModel.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];

            colDefinition = [
                { field: 'matchingToken', displayName: 'Matching Token', width: 300, sortable: false },
                { field: 'descriptionDisplay', displayName: 'Display Description', sortable: false }
            ];
            return colDefinition;
        };

        //#endregion
        //#region Action Methods
        // function to fetch status and Item descriptions of Carrier
        SalesOrderAuditSettingsViewModel.prototype.getFAKDetails = function () {
            var self = this;
            var successCallBack = function (data) {
                if (data != null) {
                    self.initializeData(data);
                }
            }, faliureCallBack = function () {
            };
            self.salesOrderClient.GetFAKDetails(self.carrierId(), successCallBack, faliureCallBack);
        };

        // function which validates on ADD click to add matching token and item desc to the grid.
        SalesOrderAuditSettingsViewModel.prototype.validation = function () {
            var self = this;
            self.carrierSearchList.vaildateSearchVendorNameControl();
            if (self.errorFAKDetail.errors().length != 0) {
                self.errorFAKDetail.errors.showAllMessages();
                return false;
            } else {
                return true;
            }
        };

        // function to initialize the carrier details.
        SalesOrderAuditSettingsViewModel.prototype.initializeData = function (data) {
            var self = this;
            if (data.SalesOrderAuditSettingCarrierDetails != null) {
                self.carrierId(data.SalesOrderAuditSettingCarrierDetails.CarrierId);
                if (data.SalesOrderAuditSettingCarrierDetails.IsFAKMapping) {
                    self.obcCheckBox.getOptionsById(6).selected(true);
                } else {
                    self.obcCheckBox.getOptionsById(6).selected(false);
                }
            } else {
                self.obcCheckBox.getOptionsById(6).selected(false);
            }

            if (data.SalesOrderAuditSettingItems.length > 0) {
                self.fakItemsList.removeAll();
                self.initializeItems(data.SalesOrderAuditSettingItems);
            } else {
                self.fakItemsList.removeAll();
                self.setPagingData(ko.observableArray(self.fakItemsList()), self.gridOptions, self.reportAction);
            }
        };

        // function to initialize the item descriptions.
        SalesOrderAuditSettingsViewModel.prototype.initializeItems = function (items) {
            var self = this;
            if (items != null) {
                for (var i = 0; i < items.length; i++) {
                    var item = $.grep(self.shipmentItemTypes(), function (e) {
                        return e.ItemId === items[i].ItemId.toString();
                    })[0];
                    self.fakItemsList.push(new auditSettingItem(items[i].MatchingToken, item, items[i].Id, items[i].UserName));
                }
                self.setPagingData(ko.observableArray(self.fakItemsList()), self.gridOptions, self.reportAction);
            }
        };

        // function which executes on SAVE
        SalesOrderAuditSettingsViewModel.prototype.onSave = function () {
            var self = this;
            self.canShowValidation(false);
            if (self.validation()) {
                self.listProgress(true);
                var data = new refContainer.Model.SalesOrderAuditSettingContainer();
                data.SalesOrderAuditSettingCarrierDetails = self.getCarrierDetails();
                data.SalesOrderAuditSettingItems = self.getCarrierItems();
                self.salesOrderClient.SaveFAKSetup(data, function (message) {
                    self.listProgress(false);
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var toastrOptions1 = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 10,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.FAKSavedSuccessFully, "success", null, toastrOptions1, null);
                    }
                }, function (message) {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 10,
                        fadeOut: 10,
                        typeOfAlert: "",
                        title: ""
                    };
                    self.listProgress(false);
                    Utility.ShowToastr(false, message, "error", null, toastrOptions, null);
                });
            } else {
                return false;
            }
        };

        // function to collect the carrier information on SAVE Click.
        SalesOrderAuditSettingsViewModel.prototype.getCarrierDetails = function () {
            var self = this;
            var carrierDetails = new refCarrierDetails.Model.SalesOrderAuditSettingCarrierDetails();
            carrierDetails.CarrierId = self.carrierId();
            carrierDetails.IsFAKMapping = self.obcCheckBox.getOptionsById(6).selected();
            return carrierDetails;
        };

        // function to collect the item descriptions on SAVE Click.
        SalesOrderAuditSettingsViewModel.prototype.getCarrierItems = function () {
            var self = this;
            var items;
            items = ko.observableArray([])();
            self.fakItemsList().forEach(function (item) {
                var itemDetails = new refItemsDetails.Model.SalesOrderAuditSettingItems();
                itemDetails.Id = item.id();
                itemDetails.ItemId = item.itemId();
                itemDetails.MatchingToken = item.matchingToken();
                itemDetails.UserName = item.userName();
                items.push(itemDetails);
            });
            return items;
        };

        //#endregion
        //#endregion
        //#region LIFE CYCLE EVENT
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        SalesOrderAuditSettingsViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //The composition engine will execute it prior to calling the binder.
        SalesOrderAuditSettingsViewModel.prototype.activate = function () {
            return true;
        };

        SalesOrderAuditSettingsViewModel.prototype.deactivate = function () {
            var self = this;
            self.cleanup();
        };

        SalesOrderAuditSettingsViewModel.prototype.cleanup = function () {
            var self = this;
            self.carrierSearchList.cleanUp();

            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }
            delete self;
        };

        //To load the registered data if any existed.
        SalesOrderAuditSettingsViewModel.prototype.beforeBind = function () {
            var self = this;

            // Load all shipment types if not loaded already
            var shipmentItemTypesLength = self.shipmentItemTypes().length;
            if (!(shipmentItemTypesLength)) {
                _app.trigger("GetItemsTypes", function (items) {
                    self.shipmentItemTypes.removeAll();
                    self.shipmentItemTypes.push.apply(self.shipmentItemTypes, items);
                });
            }
        };
        return SalesOrderAuditSettingsViewModel;
    })();
    exports.SalesOrderAuditSettingsViewModel = SalesOrderAuditSettingsViewModel;

    // This a view model of the line items
    var auditSettingItem = (function () {
        // Get the entered notes and initialize the item
        function auditSettingItem(matchingToken, selectedType, id, userName) {
            this.matchingToken = ko.observable();
            this.descriptionDisplay = ko.observable();
            this.itemId = ko.observable();
            this.id = ko.observable();
            this.userName = ko.observable();
            this.createdDate = ko.observable();
            var self = this;
            self.matchingToken(matchingToken);
            self.id(id);
            self.userName(userName);

            if (refSystem.isObject(selectedType)) {
                self.itemId(+selectedType.ItemId);
                self.descriptionDisplay(selectedType.LongDescription);
            }
        }
        return auditSettingItem;
    })();
    exports.auditSettingItem = auditSettingItem;

    return SalesOrderAuditSettingsViewModel;
});
