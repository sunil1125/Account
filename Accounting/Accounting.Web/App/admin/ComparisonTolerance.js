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
/// <reference path="../services/models/TypeDefs/Admin.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', '../templates/reportViewerControlV2', 'services/models/common/Enums', 'services/client/AdminClient', 'services/models/Admin/ComparisonToleranceContainer', 'services/models/Admin/ComparisonTolerance', 'services/models/Admin/ComparisonToleranceItems'], function(require, exports, ___router__, ___app__, __refSystem__, ___reportViewer__, __refEnums__, __refAdminClient__, __refComparisonContainer__, __refComparisonTolerance__, __refComparisonToleranceItems__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    var _reportViewer = ___reportViewer__;
    var refEnums = __refEnums__;
    var refAdminClient = __refAdminClient__;
    var refComparisonContainer = __refComparisonContainer__;
    var refComparisonTolerance = __refComparisonTolerance__;
    var refComparisonToleranceItems = __refComparisonToleranceItems__;

    //#endregion
    /*
    ** <summary>
    ** Sales Order Notes View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US8214</id> <by>Bhanu pratap</by> <date>10-Feb-2015</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id>US15152</id> <by>Satish</by><date>02-Feb-2015</date>
    ** <id>DE20932</id> <by>Chandan Singh</by> <date>03-12-2015</date> <description></description>
    ** </changeHistor>
    */
    var ComparisonToleranceViewModel = (function () {
        //#endregion
        //#region Constructor
        function ComparisonToleranceViewModel() {
            //#region Data Members
            this.comparisonTolerancereportContainer = null;
            this.headerOptions = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            this.customerSearchOptionList = ko.observableArray([]);
            // holds the selected Exception rule option.
            this.selectedCustomer = ko.observable();
            this.commonUtils = new Utils.Common();
            // holds item numbers.
            this.itemNumberList = ko.observableArray([]);
            this.selectedItemNumberList = ko.observableArray([]);
            this.adminClient = new refAdminClient.AdminClientCommands();
            this.selectedToleranceCustomer = ko.observable('');
            this.selectedToleranceAmount = ko.observable();
            this.toleranceGroupList = ko.observableArray([]);
            this.selectedToleranceGroup = ko.observable();
            this.selectedToleranceType = ko.observable();
            this.isGroupItemsVisible = ko.observable(true);
            this.listProgress = ko.observable(false);
            this.isSaveEnable = ko.observable(false);
            this.onSaveClick = ko.observable(false);
            this.comparisonTolerance = new refComparisonTolerance.Models.ComparisonTolerance();
            this.comparisonToleranceItem = new refComparisonToleranceItems.Models.ComparisonToleranceItems();
            this.comparisonToleranceContainer = new refComparisonContainer.Models.ComparisonToleranceContainer();
            this.feeFoundList = ko.observableArray([]);
            this.childFoundList = ko.observableArray([]);
            this.checkMsgDisplay = true;
            var self = this;

            //To check if Msg is clicked
            self.checkMsgClick = function () {
                self.checkMsgDisplay = true;
            };

            // to Check if Msg is hidden or closed
            self.checkMsgHide = function () {
                self.checkMsgDisplay = true;
            };

            // validation region
            self.selectedToleranceAmount.extend({
                required: {
                    message: ApplicationMessages.Messages.ValidToleranceAmountIsRequired,
                    onlyIf: function () {
                        return (self.onSaveClick());
                    }
                },
                number: true,
                min: {
                    params: 0,
                    message: ApplicationMessages.Messages.ValidToleranceAmountIsRequired,
                    onlyIf: function () {
                        return (self.onSaveClick());
                    }
                }
            });

            self.NumericInputWithDecimalPoint = { allowdecimal: ko.observable(true) };
            self.bindCustomerType();
            self.selectedCustomer(refEnums.Enums.CustomerType.Normal_Customer.ID);
            self.headerOptions = new _reportViewer.ReportHeaderOption();
            self.headerOptions.reportHeader = " ";
            self.headerOptions.reportName = "Comparison Tolerance";
            self.headerOptions.gridTitleHeader = " ";
            self.searchText = ko.observable("");
            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);

            self.setReportCriteria = function (reportActionObj) {
                self.gridOptions = reportActionObj.gridOptions;
                self.reportAction = reportActionObj;
            };
            self.getReportData = function (reportActionObj) {
            };

            self.comparisonTolerancereportContainer = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
            self.comparisonTolerancereportContainer.onFilterChange = self.setReportCriteria;
            self.comparisonTolerancereportContainer.ForceChange();

            self.loadComparisonToleranceDetails();

            self.selectedCustomer.subscribe(function (newValue) {
                window.kg.toggleSelection(false);
                self.clearFields();
                self.loadComparisonToleranceDetails();
            });

            self.comparisonTolerancereportContainer.afterSelectionChange = function (items) {
                self.selectedItem = items[0];
                if (typeof (self.selectedItem) != 'undefined' && items.length > 0) {
                    self.selectedItemNumberList.removeAll();
                    self.isSaveEnable(true);
                    self.selectedToleranceCustomer(self.commonUtils.getEnumValueById(refEnums.Enums.CustomerType, self.selectedCustomer().toString()));
                    self.selectedToleranceAmount($.number((self.selectedItem.ToleranceAmount), 2).replace(",", ""));
                    self.selectedToleranceGroup(self.selectedItem.ID);
                    self.showHideGroupItems(self.selectedItem.ToleranceType);
                    self.selectedToleranceType(self.selectedItem.ToleranceType);
                    var result = self.comparisonToleranceOriginalData.ComparisonToleranceItems;
                    var mappedLineItems = $.grep(self.comparisonToleranceOriginalData.ComparisonToleranceItems, function (e) {
                        return e.ToleranceID === self.selectedItem.ID;
                    });
                    self.selectedItemNumberList.push.apply(self.selectedItemNumberList, mappedLineItems);

                    // Remove already selected items from the available list
                    mappedLineItems.forEach(function (itemToBeRemove) {
                        var itemShouldBeRemove = $.grep(self.itemNumberList(), function (e) {
                            return e.ItemId === itemToBeRemove.ItemMasId;
                        });
                        if (itemShouldBeRemove.length > 0) {
                            self.itemNumberList.remove.apply(self.itemNumberList, itemShouldBeRemove);
                        }
                    });
                }
                //$('#multiSelectMainItems').multipleSelect();
                //$('#multiSelectedMappedItems').multipleSelect();
            };

            self.errorComparisonTolerance = ko.validatedObservable({
                selectedToleranceAmount: self.selectedToleranceAmount
            });

            return self;
        }
        //#endregion
        //#region Methods
        // Save Functionality
        ComparisonToleranceViewModel.prototype.onSave = function () {
            var self = this;
            self.listProgress(true);
            self.onSaveClick(true);
            if (self.errorComparisonTolerance.errors().length <= 0) {
                self.onSaveClick(false);
                if (self.selectedToleranceType() !== refEnums.Enums.ToleranceType.TLTolerance.ID && self.selectedToleranceType() !== refEnums.Enums.ToleranceType.RevenueAdjustmentTolerance.ID && self.selectedToleranceType() !== refEnums.Enums.ToleranceType.QuoteTolerance.ID && self.selectedToleranceType() !== refEnums.Enums.ToleranceType.PostAuditTotalBillTolerance.ID && self.selectedToleranceType() !== refEnums.Enums.ToleranceType.TotalBillTolerance.ID) {
                    if (self.selectedItemNumberList().length <= 0) {
                        var actionButtons = [];
                        actionButtons.push({
                            actionButtonName: "Yes",
                            actionClick: function () {
                                self.saveToleranceGroupChanges();
                            }
                        });

                        actionButtons.push({
                            actionButtonName: "No",
                            actionClick: function () {
                                self.listProgress(false);
                                self.isSaveEnable(true);
                                self.onSaveClick(false);
                            }
                        });

                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 0,
                            fadeOut: 0,
                            typeOfAlert: "",
                            title: "",
                            actionButtons: actionButtons
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, "No fee selected, Do you want to continue save?", "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                    } else {
                        self.saveToleranceGroupChanges();
                    }
                } else {
                    self.saveToleranceGroupChanges();
                }
            } else {
                self.listProgress(false);
                return false;
            }
        };

        // To save the tolerance group changes to Database
        ComparisonToleranceViewModel.prototype.saveToleranceGroupChanges = function () {
            var self = this;
            self.comparisonToleranceContainer.ComparisonTolerance = self.getComparisonToleranceDetailToSave();
            self.comparisonToleranceContainer.ComparisonToleranceItems = self.getComparisonToleranceItemDetail();

            self.adminClient.saveComparisonToleranceDetails(self.comparisonToleranceContainer, function (message) {
                self.isSaveEnable(true);
                self.onSaveClick(false);
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
                    self.clearFields();
                    self.loadComparisonToleranceDetails();
                    window.kg.toggleSelection(false);
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, "Changes to " + self.commonUtils.getEnumValueById(refEnums.Enums.ToleranceType, self.selectedToleranceType().toString()) + " have saved successfully.", "success", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
                }
            }, function (message) {
                self.isSaveEnable(true);
                self.listProgress(false);
                self.onSaveClick(false);
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 0,
                    fadeOut: 0,
                    typeOfAlert: "",
                    title: ""
                };
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
            });
        };

        // Get comparison tolerance Details to save
        ComparisonToleranceViewModel.prototype.getComparisonToleranceDetailToSave = function () {
            var self = this;
            var toleranceType = self.selectedToleranceType();
            var comparisonToleranceDetails;
            comparisonToleranceDetails = ko.observableArray([])();

            var comparisonToleranceDetail = new refComparisonTolerance.Models.ComparisonTolerance();

            comparisonToleranceDetail.Description = self.commonUtils.getEnumValueById(refEnums.Enums.ToleranceType, toleranceType.toString());
            comparisonToleranceDetail.ToleranceAmount = self.selectedToleranceAmount();
            comparisonToleranceDetail.CustomerType = self.selectedCustomer();
            comparisonToleranceDetail.ToleranceType = self.selectedToleranceType();
            comparisonToleranceDetail.ID = self.selectedToleranceGroup();
            comparisonToleranceDetails.push(comparisonToleranceDetail);
            return comparisonToleranceDetails;
        };

        // Get comparison tolerance item details to save
        ComparisonToleranceViewModel.prototype.getComparisonToleranceItemDetail = function () {
            var self = this;
            var comparisonToleranceItemDetails;
            comparisonToleranceItemDetails = ko.observableArray([])();
            if (self.selectedItemNumberList().length > 0) {
                self.selectedItemNumberList().forEach(function (getItem) {
                    var comparisonToleranceItemDetail = new refComparisonToleranceItems.Models.ComparisonToleranceItems();
                    comparisonToleranceItemDetail.ItemDescription = getItem.ItemDescription;
                    comparisonToleranceItemDetail.ItemMasId = getItem.ItemMasId;
                    comparisonToleranceItemDetail.ToleranceID = getItem.ToleranceID;
                    comparisonToleranceItemDetail.ID = getItem.ID;
                    comparisonToleranceItemDetails.push(comparisonToleranceItemDetail);
                });
            }

            return comparisonToleranceItemDetails;
        };

        // function which executes while trying to add items from parent to child.
        ComparisonToleranceViewModel.prototype.onAddButtonClick = function () {
            var self = this;
            var items = $('#multiSelectMainItems').val();

            if (items) {
                for (var i = 0; i < items.length; i++) {
                    var checkForChildItem = $.grep(self.selectedItemNumberList(), function (e) {
                        return e.ItemMasId === items[i];
                    });
                    if (checkForChildItem.length <= 0) {
                        self.addItemToRight(items[i]);
                    } else {
                        if (self.childFoundList().length > 0) {
                            var checkForItemId = $.grep(self.childFoundList(), function (e) {
                                return e.Id === items[i];
                            });
                            if (checkForItemId.length <= 0) {
                                // ###START: DE20932
                                self.childFoundList.push(new ChildFoundList(items[i], checkForChildItem[0].ItemDescription + " is already  selected as child.<br>"));
                                // ###END: DE20932
                            }
                        } else {
                            // ###START: DE20932
                            self.childFoundList.push(new ChildFoundList(items[i], checkForChildItem[0].ItemDescription + " is already  selected as child.<br>"));
                            // ###END: DE20932
                        }
                    }
                }

                if (self.feeFoundList().length > 0) {
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 5,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, self.ErrorMessage(), "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                        self.feeFoundList.removeAll();
                    }
                }

                if (self.childFoundList().length > 0) {
                    self.checkMsgDisplay = true;
                    if (self.checkMsgDisplay) {
                        self.checkMsgDisplay = false;
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 10,
                            fadeOut: 5,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, self.ChildExistErrorMessage(), "error", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                        self.childFoundList.removeAll();
                    }
                }
            }
            self.itemNumberList.refresh();
        };

        // function will generate an error message of existing group list
        ComparisonToleranceViewModel.prototype.ErrorMessage = function () {
            var self = this;

            // ###START: DE20932
            var errorMessage = '<html><body><div style="max-height: 230px; overflow-y: auto;">';
            for (var i = 0; i < self.feeFoundList().length; i++) {
                errorMessage += "The selected fee " + self.feeFoundList()[i].selectedItemName + " has been already assigned to " + self.feeFoundList()[i].existedToleranceGreoupName + ". Please remove from " + self.feeFoundList()[i].existedToleranceGreoupName + " to add into this group. <br><br>";
                // ###END: DE20932
            }

            errorMessage += '</div></body></html>';

            return errorMessage;
        };

        // function will generate an error message of child existing list
        ComparisonToleranceViewModel.prototype.ChildExistErrorMessage = function () {
            var self = this;

            // ###START: DE20932
            var msg = '<html><body><div style="max-height: 150px; overflow-y: auto;">';

            for (var i = 0; i < self.childFoundList().length; i++) {
                msg += "" + self.childFoundList()[i].Log;
                +"";
            }

            msg += '</div></body></html>';
            return msg;
        };

        // function which executes when user tries to remove items from child
        ComparisonToleranceViewModel.prototype.onRemoveButtonClick = function () {
            var self = this;
            self.removeItemFromRight();
        };

        // function will execute to clear the tolerance group details
        ComparisonToleranceViewModel.prototype.clearFields = function () {
            var self = this;
            self.selectedToleranceCustomer('');
            self.selectedToleranceAmount(0);
            self.itemNumberList.removeAll();
            self.selectedToleranceGroup(0);
            self.toleranceGroupList.removeAll();
            self.selectedItemNumberList.removeAll();
            self.isSaveEnable(false);
        };

        // function to add items from left to right
        ComparisonToleranceViewModel.prototype.addItemToRight = function (item) {
            var self = this;
            var existedItems, selectedItem;
            var isItemExisted = false;
            var otherToleranceGroupItems = $.grep(self.comparisonToleranceOriginalData.ComparisonTolerance, function (e) {
                return e.ToleranceType !== self.selectedToleranceType() && e.CustomerType === self.selectedCustomer();
            });
            otherToleranceGroupItems.forEach(function (getMapItem) {
                var mappedItemsOfOtherGroups = $.grep(self.comparisonToleranceOriginalData.ComparisonToleranceItems, function (e1) {
                    return e1.ToleranceID === getMapItem.ID;
                });

                existedItems = $.grep(mappedItemsOfOtherGroups, function (e2) {
                    return e2.ItemMasId === item;
                });

                selectedItem = $.grep(self.itemNumberList(), function (e3) {
                    return e3.ItemId === item;
                });

                if (existedItems.length > 0) {
                    isItemExisted = true;
                    self.feeFoundList.push(new ToleranceFoundedList(selectedItem[0].ShortDescription, getMapItem.Description));
                }
            });

            if (!isItemExisted) {
                var comparisonToleranceChildItem = new refComparisonToleranceItems.Models.ComparisonToleranceItems();
                comparisonToleranceChildItem.ToleranceID = self.selectedToleranceGroup();
                comparisonToleranceChildItem.ItemDescription = selectedItem[0].ShortDescription;
                comparisonToleranceChildItem.ItemMasId = item;
                self.selectedItemNumberList.push(comparisonToleranceChildItem);
            }
        };

        // function to remove items from right
        ComparisonToleranceViewModel.prototype.removeItemFromRight = function () {
            var self = this;
            var itemsChild = $('#multiSelectedChildItems').val();

            if (itemsChild) {
                for (var i = 0; i < itemsChild.length; i++) {
                    var itemTobeRemoveFromRight = $.grep(self.selectedItemNumberList(), function (removeFromRight) {
                        return removeFromRight.ItemMasId === itemsChild[i];
                    });

                    if (itemTobeRemoveFromRight.length > 0) {
                        self.selectedItemNumberList.remove.apply(self.selectedItemNumberList, itemTobeRemoveFromRight);
                    }
                }
                self.selectedItemNumberList.refresh();
            }
        };

        ComparisonToleranceViewModel.prototype.showHideGroupItems = function (toleranceId) {
            var self = this;
            if (toleranceId === refEnums.Enums.ToleranceType.TLTolerance.ID || toleranceId === refEnums.Enums.ToleranceType.RevenueAdjustmentTolerance.ID || toleranceId === refEnums.Enums.ToleranceType.QuoteTolerance.ID || toleranceId === refEnums.Enums.ToleranceType.PostAuditTotalBillTolerance.ID || toleranceId === refEnums.Enums.ToleranceType.TotalBillTolerance.ID) {
                self.isGroupItemsVisible(false);
            } else {
                self.bindItemsList();
                self.isGroupItemsVisible(true);
            }
        };

        // customer type dropdown binding
        ComparisonToleranceViewModel.prototype.bindCustomerType = function () {
            var self = this;
            if (refSystem.isObject(refEnums.Enums.CustomerType)) {
                self.customerSearchOptionList.removeAll();
                for (var item in refEnums.Enums.CustomerType) {
                    if (refEnums.Enums.CustomerType[item].ID !== 2 && refEnums.Enums.CustomerType[item].ID !== 4) {
                        self.customerSearchOptionList.push(refEnums.Enums.CustomerType[item]);
                    }
                }
            }
        };

        // customer type dropdown binding
        ComparisonToleranceViewModel.prototype.bindItemsList = function () {
            var self = this;

            // Load all shipment types if not loaded already
            _app.trigger("GetItemsTypes", function (items) {
                self.itemNumberList.removeAll();
                self.itemNumberList.push.apply(self.itemNumberList, items);
            });

            var insuranceItemsList = $.grep(self.itemNumberList(), function (insuranceItemToBeRemove) {
                return insuranceItemToBeRemove.ItemId === "44";
            });
            if (insuranceItemsList.length > 0) {
                for (var i = 0; i < insuranceItemsList.length; i++) {
                    self.itemNumberList.remove.apply(self.itemNumberList, insuranceItemsList[i]);
                }
            }
        };

        // function to load comparison tolerance details
        ComparisonToleranceViewModel.prototype.loadComparisonToleranceDetails = function () {
            var self = this;
            self.comparisonTolerancereportContainer.listProgress(true);
            var successCallBack = function (data) {
                self.comparisonTolerancereportContainer.listProgress(false);
                self.setPagingData(ko.observableArray(data.ComparisonTolerance), self.gridOptions, self.reportAction);
                self.comparisonToleranceOriginalData = data;
                self.toleranceGroupList.removeAll();
                self.toleranceGroupList.push.apply(self.toleranceGroupList, self.comparisonToleranceOriginalData.ComparisonTolerance);
            }, failureCallBack = function () {
                self.comparisonTolerancereportContainer.listProgress(false);
            };
            self.adminClient.getComparisonToleranceDetails(self.selectedCustomer(), -1, successCallBack, failureCallBack);
        };

        // function to set grid options
        ComparisonToleranceViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("ComparisonToleranceGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
                columnName: "ID",
                order: "ASC"
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
            grOption.enableSaveGridSettings = false;
            grOption.showColumnMenu = true;
            grOption.useClientSideFilterAndSort = true;
            return grOption;
        };

        // function to set page data
        ComparisonToleranceViewModel.prototype.setPagingData = function (data, grid, gridOption) {
            Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
        };

        // function to set grid column definitions.
        ComparisonToleranceViewModel.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;

            colDefinition = [
                { field: 'Description', displayName: 'Tolerances/Group Name', isRemovable: false, width: 400 },
                { field: 'ToleranceAmount', displayName: 'Tolerance Amount', isRemovable: false, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate }
            ];
            return colDefinition;
        };

        //#endregion
        //#region Life Cycle
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        ComparisonToleranceViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //The composition engine will execute it prior to calling the binder.
        ComparisonToleranceViewModel.prototype.activate = function () {
            return true;
        };

        // Event which executes when user try move to another view from this view.
        ComparisonToleranceViewModel.prototype.deactivate = function () {
            var self = this;
            self.cleanup();
        };

        //To load the registered data if any existed.
        ComparisonToleranceViewModel.prototype.beforeBind = function () {
        };

        ComparisonToleranceViewModel.prototype.cleanup = function () {
            var self = this;

            self.comparisonTolerancereportContainer.cleanup("ComparisonToleranceGrid");

            for (var prop in self) {
                if (prop !== "cleanup")
                    delete self[prop];
            }
            delete self;
        };
        return ComparisonToleranceViewModel;
    })();

    //#region Model Classes
    //class to hold parent items existing groups list.
    var ToleranceFoundedList = (function () {
        function ToleranceFoundedList(selectedItemName, existedToleranceGreoupName) {
            var self = this;
            self.selectedItemName = selectedItemName;
            self.existedToleranceGreoupName = existedToleranceGreoupName;

            return self;
        }
        return ToleranceFoundedList;
    })();

    // class to hold child existence error log.
    var ChildFoundList = (function () {
        function ChildFoundList(Id, Log) {
            var self = this;
            self.Id = Id;
            self.Log = Log;

            return self;
        }
        return ChildFoundList;
    })();

    //#endregion
    return ComparisonToleranceViewModel;
});
