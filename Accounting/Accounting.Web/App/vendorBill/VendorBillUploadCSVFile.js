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
/// <reference path="../services/models/TypeDefs/VendorBillModels.d.ts" />
/// <reference path="VendorBillUploadItemViewModel.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/models/common/Enums', 'services/models/vendorBill/UploadVendorBillRequest', '../templates/reportViewerControlV2', 'vendorBill/VendorBillUploadItemViewModel', 'services/client/VendorBillClient'], function(require, exports, ___router__, ___app__, __refEnums__, ___refUploadVendorBillRequestModel__, ___reportViewer__, ___refVendorBillUploadItemViewModel__, ___refVendorBillClientClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refEnums = __refEnums__;
    
    var _refUploadVendorBillRequestModel = ___refUploadVendorBillRequestModel__;
    var _reportViewer = ___reportViewer__;
    var _refVendorBillUploadItemViewModel = ___refVendorBillUploadItemViewModel__;
    var _refVendorBillClientClient = ___refVendorBillClientClient__;

    //#endregion
    /*
    ** <summary>
    ** Vendor Bill Upload File View Model
    ** </summary>
    ** <createDetails>
    ** <id>US10948</id> <by>Chandan</by> <date>29th July, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by>Avinash Dubey</by> <date>08/27/2014</date>
    ** Added Grid for showing the data
    ** <id>DE23551</id> <by>Janakiram</by> <date>03-08-2016</date><description>Added logic to show toaster message for zero record success Messages.</description>
    ** </changeHistory>
    */
    var VendorBillUploadFile = (function () {
        //#endregion
        //#region Constructor
        function VendorBillUploadFile() {
            //#region Members
            this.vendorBillUploadCSVGrid = null;
            this.headerOptions = null;
            this.grid = null;
            this.reportAction = null;
            this.modeType = ko.observable();
            this.data = new _refVendorBillUploadItemViewModel.VendorBillUploadItem();
            this.vendorBillClient = new _refVendorBillClientClient.VendorBillClient();
            this.uploadedFileName = ko.observable();
            this.commonUtils = new Utils.Common();
            //To disable Upload Button after click once on Upload
            this.notDisableUploadButton = ko.observable(false);
            var self = this;

            self.uploadData = function () {
                self.vendorBillUploadCSVGrid.listProgress(true);
                self.notDisableUploadButton(false);
                var successCallBack = function (data) {
                    self.initializeGridData(data);
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 3,
                        fadeOut: 3,
                        typeOfAlert: "",
                        title: ""
                    };

                    if (data.SavedCount === 0) {
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, data.SavedCount + ApplicationMessages.Messages.ZeroRecordsUploadedMessage, "success", null, toastrOptions);
                    } else {
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, data.SavedCount + ApplicationMessages.Messages.RecordsUploadedMessage, "success", null, toastrOptions);
                    }
                    // ###END: DE23551
                }, faliureCallBack = function () {
                    //self.vendorBillUploadCSVGrid.listProgress(false);
                    return true;
                };

                self.vendorBillClient.GetUploadResponce(self.uploadedItem, successCallBack, faliureCallBack);
            };

            //Enables Upload Button once all the mandatory fields are filled up.self.uploadedFileName.length > -1 &&
            self.enableUploadButton = ko.computed(function () {
                if (self.uploadedFileName() != undefined) {
                    self.notDisableUploadButton(true);
                    return true;
                }
                self.notDisableUploadButton(false);
                return false;
            });

            /*	This is triggered when the user is uploading a document.
            It saves the document object to be saved in system */
            self.uploadDocument = function (obj, event) {
                var reader = new FileReader(), fileUploadObj = (event.target).files[0];

                reader.readAsDataURL(fileUploadObj);
                reader.onload = function (imgsrc) {
                    self.uploadFileContent = imgsrc.target.result;
                    self.uploadedFileName(fileUploadObj.name);
                    var item = {
                        FileContent: self.uploadFileContent,
                        FileExtension: self.uploadedFileName().split(".")[self.uploadedFileName().split(".").length - 1],
                        FileName: self.uploadedFileName()
                    };

                    self.uploadedItem = item;
                };
            };

            //#region GridOptions
            self.headerOptions = new _reportViewer.ReportHeaderOption();
            self.headerOptions.reportHeader = " ";
            self.headerOptions.reportName = "Vendor Bill Upload CSV File";
            self.headerOptions.gridTitleHeader = " ";
            self.searchText = ko.observable("");
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
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectDateTimeFrame, "info", null, toastrOptions);
                }
            };

            self.headerOptions.actionButtons1 = {
                buttonName: ko.observable("Upload Selected"),
                enableOnSingleSelection: true,
                enableOnMultiSelection: true,
                hideWhenUnselected: true,
                resetselectionOnAction: true,
                isslideButton: true
            };

            self.vendorBillUploadCSVGrid = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
            self.vendorBillUploadCSVGrid.onFilterChange = self.setReportCriteria;
            self.vendorBillUploadCSVGrid.showOptionalHeaderRow(true);
            self.vendorBillUploadCSVGrid.OptionalHeaderRowLocation('TOP');
            self.vendorBillUploadCSVGrid.ForceChange();

            // For search filter
            self.vendorBillUploadCSVGrid.onSearchTextChange = function (reportViewer, newSearchValue) {
                if (newSearchValue.length >= 3 || newSearchValue.length == 0) {
                    self.searchText(newSearchValue);

                    //self.getReportData(self.reportAction);
                    self.gridOptions.pagingOptions.currentPage(1);
                }
            };

            //## On Click of Action Button1 Perform your action....Here Force Push button
            self.vendorBillUploadCSVGrid.onActionButton1Clicked = function (reportActionObj) {
                var selectOpt = reportActionObj.gridOptions.selectedItems();
                self.vendorBillUploadCSVGrid.listProgress(true);
                var uploadVendorBillReequestModel = new _refUploadVendorBillRequestModel.Models.UploadVendorBillRequest();

                // Hold selected Record
                uploadVendorBillReequestModel.CorrectedRecords = selectOpt;

                //self.invalidList = reportActionObj.gridOptions.data();
                self.invalidList = reportActionObj.gridOptions.fullDataObject();

                if (reportActionObj.gridOptions.selectedItems() && reportActionObj.gridOptions.selectedItems().length > 0) {
                    reportActionObj.gridOptions.selectedItems().forEach(function (selectedItem) {
                        self.invalidList.remove(selectedItem);
                    });
                }

                uploadVendorBillReequestModel.InvalidRecords = self.invalidList;
                uploadVendorBillReequestModel.AllRecords = reportActionObj.gridOptions.fullDataObject();
                self.vendorBillClient.GetUploadResponceByList(uploadVendorBillReequestModel, function (data) {
                    // To show toastr message
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 3,
                        fadeOut: 3,
                        typeOfAlert: "",
                        title: ""
                    };

                    if (data.SavedCount === 0) {
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, data.SavedCount + ApplicationMessages.Messages.ZeroRecordsUploadedMessage, "success", null, toastrOptions);
                    } else {
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, data.SavedCount + ApplicationMessages.Messages.RecordsUploadedMessage, "success", null, toastrOptions);
                    }

                    // ###END: DE23551
                    self.initializeGridData(data);
                    self.resetGridSelection(self);
                }, function () {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 3,
                        fadeOut: 3,
                        typeOfAlert: "",
                        title: ""
                    };

                    // ###START: DE23551
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, "0" + ApplicationMessages.Messages.ZeroRecordsUploadedMessage, "success", null, toastrOptions);
                    // ###END: DE23551
                });
                self.vendorBillUploadCSVGrid.listProgress(false);
            };
            //#endregion GridOptions
        }
        //#endregion
        //#region Public Methods
        //** The composition engine will execute after complete the composition of view
        VendorBillUploadFile.prototype.compositionComplete = function (view, parent) {
            $('#btnUploadCSVFile').focus();
        };

        //#endregion
        //#region Life Cycle Event
        //** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
        VendorBillUploadFile.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //** The composition engine will execute it prior to calling the binder. */
        VendorBillUploadFile.prototype.activate = function () {
            return true;
        };

        //For data persistence
        VendorBillUploadFile.prototype.deactivate = function () {
            var self = this;
            var data = {
                InvalidData: self.gridOptions.fullDataObject(),
                uploadedFileName: self.uploadedFileName(),
                notDisableUploadButton: self.notDisableUploadButton()
            };
            _app.trigger("registerMyData", data);
        };

        //To capture the persist data
        VendorBillUploadFile.prototype.beforeBind = function () {
            var self = this;
            _app.trigger("loadMyData", function (data) {
                if (data) {
                    self.initializeGridData(data);
                    self.uploadedFileName(data.uploadedFileName);
                    self.notDisableUploadButton(data.notDisableUploadButton);
                } else {
                }
            });
        };

        //#endregion
        //#region Private Methods
        // Initializes the data and binds to the UI
        VendorBillUploadFile.prototype.resetGridSelection = function (self) {
            window.kg.toggleSelection(false);
        };

        VendorBillUploadFile.prototype.initializeGridData = function (data) {
            var self = this;
            if (data) {
                self.vendorBillUploadCSVGrid.listProgress(true);
                self.vendorBillUploadCSVGrid.OptionalHeaderRowLocation('TOP');
                $("#kgSpanFooterSelectedItems").text('0');
                self.setPagingData(ko.observableArray(data.InvalidData), self.gridOptions, self.reportAction);
                self.vendorBillUploadCSVGrid.listProgress(false);
                $('.noLeftBorder').parent().css('border-left', '0');
                $('.noRightBorder').parent().css('border-right', '0');
            } else {
                self.vendorBillUploadCSVGrid.listProgress(false);
            }
        };

        // Updates the data in the UI
        VendorBillUploadFile.prototype.setPagingData = function (data, grid, gridOption) {
            Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
        };

        // Sets the options required properties of the grid
        VendorBillUploadFile.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = true;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("VendorBillUploadCSVGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
                columnName: "ID",
                order: "DESC"
            };
            grOption.pageSizes = [10, 25, 50, 100];
            grOption.pageSize = 10;
            grOption.totalServerItems = 0;
            grOption.currentPage = 1;
            grOption.jqueryUIDraggable = true;
            grOption.canSelectRows = true;
            grOption.selectWithCheckboxOnly = true;
            grOption.displaySelectionCheckbox = true;
            grOption.multiSelect = true;
            grOption.enablePaging = false;
            grOption.viewPortOptions = false;
            grOption.enableSaveGridSettings = true;
            grOption.useClientSideFilterAndSort = true;
            grOption.showColumnMenu = true;

            return grOption;
        };

        // Sets the columns in the grid
        VendorBillUploadFile.prototype.setGridColumnDefinitions = function () {
            //#region Templates
            var CarrierTypeCelTemplate = '<div data-bind="css: $parent.entity[\'validationClass\']"> <div class="kgCellText" data-bind="text: $parent.entity[\'CarrierName\'], visible:  !$parent.entity[\'IsValidCarrierType\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'CarrierType\'], visible:  $parent.entity[\'IsValidCarrierType\'], attr: {maxlength: 10}" /></div>';
            var OriginZipCelTemplate = '<div data-bind="css: $parent.entity[\'validationClass\']"> <div class="kgCellText" data-bind="text: $parent.entity[\'OriginZip\'], visible:  !$parent.entity[\'IsValidOriginZip\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'OriginZip\'], visible:  $parent.entity[\'IsValidOriginZip\'], attr: {maxlength: 10}" /></div>';
            var OrderNumberCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'OrderNumber\'], visible:  !$parent.entity[\'IsValidOrderNumber\']"></div><input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'OrderNumber\'], visible:  $parent.entity[\'IsValidOrderNumber\']" /></div>';
            var ProNumberCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ProNumber\'], visible:  !$parent.entity[\'IsValidProNumber\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ProNumber\'], visible:  $parent.entity[\'IsValidProNumber\']" /></div>';
            var CustomerBOLNumberCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'CustomerBOLNumber\'], visible:  !$parent.entity[\'IsValidCustomerBOLNumber\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'CustomerBOLNumber\'], visible:  $parent.entity[\'IsValidCustomerBOLNumber\']" /></div>';
            var BOLNumberCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'BOLNumber\'], visible:  !$parent.entity[\'IsValidBOLNumber\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'BOLNumber\'], visible:  $parent.entity[\'IsValidBOLNumber\']" /></div>';
            var PoNumberCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'PoNumber\'], visible:  !$parent.entity[\'IsValidPoNumber\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'PoNumber\'], visible:  $parent.entity[\'IsValidPoNumber\']" /></div>';
            var RefPUNumberCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'RefPUNumber\'], visible:  !$parent.entity[\'IsValidRefPUNumber\']"></div> <input type="text" class="requiredFieldBgColor" data-bind="value: $parent.entity[\'RefPUNumber\'], visible:  $parent.entity[\'IsValidRefPUNumber\']" /></div>';

            var DeliveryDateCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'DeliveryDate\'], visible:  !$parent.entity[\'IsValidDeliveryDate\']"></div> <input type="date" class="requiredFieldBgColor width-percent-98" data-bind="value: $parent.entity[\'DeliveryDate\'], visible:  $parent.entity[\'IsValidDeliveryDate\']" /></div>';
            var BillDateCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'BillDate\'], visible:  !$parent.entity[\'IsValidBillDate\']"></div> <input type="date" class="requiredFieldBgColor width-percent-98" data-bind="value: $parent.entity[\'BillDate\'], visible:  $parent.entity[\'IsValidBillDate\']" /></div>';

            var CarrierCodeCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'CarrierCode\'], visible:  !$parent.entity[\'IsValidCarrierCode\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'CarrierCode\'], visible:  $parent.entity[\'IsValidCarrierCode\'], attr: {maxlength: 10}" /></div>';
            var DestinationZipCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'DestinationZip\'], visible:  !$parent.entity[\'IsValidDestinationZip\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'DestinationZip\'], visible:  $parent.entity[\'IsValidDestinationZip\'] , attr: {maxlength: 10}" /></div>';
            var MemoCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'Memo\'], visible:  !$parent.entity[\'IsValidMemo\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'Memo\'], visible:  $parent.entity[\'IsValidMemo\']" /></div>';
            var ItemIdCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ItemId\'], visible:  !$parent.entity[\'IsValidItemId\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ItemId\'], visible:  $parent.entity[\'IsValidItemId\']" /></div>';
            var PCSCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'PCS\'], visible:  !$parent.entity[\'IsValidPCS\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'PCS\'], visible:  $parent.entity[\'IsValidPCS\']" /></div>';
            var DescriptionCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'Description\'], visible:  !$parent.entity[\'IsValidDescription\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'Description\'], visible:  $parent.entity[\'IsValidDescription\']" /></div>';

            var CostFieldCelTemplate = '<div><div class="kgCellText text-right" data-bind="text:\'$ \' + $parent.entity[\'CostField\'].toFixed(2), visible:  !$parent.entity[\'IsValidCost\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'Cost\'], visible:  $parent.entity[\'IsValidCost\']" /></div>';
            var ClassCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'Class\'], visible:  !$parent.entity[\'IsValidClass\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'Class\'], visible:  $parent.entity[\'IsValidClass\']" /></div>';
            var LengthCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'Length\'], visible:  !$parent.entity[\'IsValidLength\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'Length\'], visible:  $parent.entity[\'IsValidLength\']" /></div>';
            var WidthCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'Width\'], visible:  !$parent.entity[\'IsValidWidth\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'Width\'], visible:  $parent.entity[\'IsValidWidth\']" /></div>';
            var HeightCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'Height\'], visible:  !$parent.entity[\'IsValidHeight\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'Height\'], visible:  $parent.entity[\'IsValidHeight\']" /></div>';
            var WgtCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'Wgt\'], visible:  !$parent.entity[\'IsValidWgt\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'Wgt\'], visible:  $parent.entity[\'IsValidWgt\']" /></div>';
            var PTCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'PT\'], visible:  !$parent.entity[\'IsValidPT\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'PT\'], visible:  $parent.entity[\'IsValidPT\']" /></div>';
            var ChargeCodeCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ChargeCode\'], visible:  !$parent.entity[\'IsValidChargeCode\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ChargeCode\'], visible:  $parent.entity[\'IsValidChargeCode\']" /></div>';

            var ShipperCompanyNameCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ShipperCompanyName\'], visible:  !$parent.entity[\'IsValidShipperCompanyName\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ShipperCompanyName\'], visible:  $parent.entity[\'IsValidShipperCompanyName\']" /></div>';
            var ShipperContactPersonCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ShipperContactPerson\'], visible:  !$parent.entity[\'IsValidShipperContactPerson\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ShipperContactPerson\'], visible:  $parent.entity[\'IsValidShipperContactPerson\']" /></div>';
            var ShipperPhoneCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ShipperPhone\'], visible:  !$parent.entity[\'IsValidShipperPhone\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ShipperPhone\'], visible:  $parent.entity[\'IsValidShipperPhone\']" /></div>';
            var ShipperFaxCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ShipperFax\'], visible:  !$parent.entity[\'IsValidShipperFax\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ShipperFax\'], visible:  $parent.entity[\'IsValidShipperFax\']" /></div>';
            var ShipperAddress1CelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ShipperAddress1\'], visible:  !$parent.entity[\'IsValidShipperAddress1\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ShipperAddress1\'], visible:  $parent.entity[\'IsValidShipperAddress1\']" /></div>';
            var ShipperAddress2CelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ShipperAddress2\'], visible:  !$parent.entity[\'IsValidShipperAddress2\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ShipperAddress2\'], visible:  $parent.entity[\'IsValidShipperAddress2\']" /></div>';
            var ShipperCityCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ShipperCity\'], visible:  !$parent.entity[\'IsValidShipperCity\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ShipperCity\'], visible:  $parent.entity[\'IsValidShipperCity\']" /></div>';
            var ShipperStateCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ShipperState\'], visible:  !$parent.entity[\'IsValidShipperState\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ShipperState\'], visible:  $parent.entity[\'IsValidShipperState\']" /></div>';
            var ShipperCountryCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ShipperCountry\'], visible:  !$parent.entity[\'IsValidShipperCountry\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ShipperCountry\'], visible:  $parent.entity[\'IsValidShipperCountry\']" /></div>';

            var ConsigneeCompanyNameCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ConsigneeCompanyName\'], visible:  !$parent.entity[\'IsValidConsigneeCompanyName\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ConsigneeCompanyName\'], visible:  $parent.entity[\'IsValidConsigneeCompanyName\']" /></div>';
            var ConsigneeContactPersonCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ConsigneeContactPerson\'], visible:  !$parent.entity[\'IsValidConsigneeContactPerson\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ConsigneeContactPerson\'], visible:  $parent.entity[\'IsValidConsigneeContactPerson\']" /></div>';
            var ConsigneePhoneCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ConsigneePhone\'], visible:  !$parent.entity[\'IsValidConsigneePhone\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ConsigneePhone\'], visible:  $parent.entity[\'IsValidConsigneePhone\']" /></div>';
            var ConsigneeFaxCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ConsigneeFax\'], visible:  !$parent.entity[\'IsValidConsigneeFax\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ConsigneeFax\'], visible:  $parent.entity[\'IsValidConsigneeFax\']" /></div>';
            var ConsigneeAddress1CelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ConsigneeAddress1\'], visible:  !$parent.entity[\'IsValidConsigneeAddress1\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ConsigneeAddress1\'], visible:  $parent.entity[\'IsValidConsigneeAddress1\']" /></div>';
            var ConsigneeAddress2CelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ConsigneeAddress2\'], visible:  !$parent.entity[\'IsValidConsigneeAddress2\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ConsigneeAddress2\'], visible:  $parent.entity[\'IsValidConsigneeAddress2\']" /></div>';
            var ConsigneeZipCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ConsigneeZip\'], visible:  !$parent.entity[\'IsValidConsigneeZip\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ConsigneeZip\'], visible:  $parent.entity[\'IsValidConsigneeZip\'], attr: {maxlength: 10}" /></div>';
            var ConsigneeCityCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ConsigneeCity\'], visible:  !$parent.entity[\'IsValidConsigneeCity\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ConsigneeCity\'], visible:  $parent.entity[\'IsValidConsigneeCity\']" /></div>';
            var ConsigneeStateCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ConsigneeState\'], visible:  !$parent.entity[\'IsValidConsigneeState\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ConsigneeState\'], visible:  $parent.entity[\'IsValidConsigneeState\']" /></div>';
            var ConsigneeCountryCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'ConsigneeCountry\'], visible:  !$parent.entity[\'IsValidConsigneeCountry\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'ConsigneeCountry\'], visible:  $parent.entity[\'IsValidConsigneeCountry\']" /></div>';

            var BillToCompanyNameCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'BillToCompanyName\'], visible:  !$parent.entity[\'IsValidBillToCompanyName\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'BillToCompanyName\'], visible:  $parent.entity[\'IsValidBillToCompanyName\']" /></div>';
            var BillToPhoneCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'BillToPhone\'], visible:  !$parent.entity[\'IsValidBillToPhone\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'BillToPhone\'], visible:  $parent.entity[\'IsValidBillToPhone\']" /></div>';
            var BillToFaxCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'BillToFax\'], visible:  !$parent.entity[\'IsValidBillToFax\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'BillToFax\'], visible:  $parent.entity[\'IsValidBillToFax\']" /></div>';
            var BillToAddress1CelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'BillToAddress1\'], visible:  !$parent.entity[\'IsValidBillToAddress1\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'BillToAddress1\'], visible:  $parent.entity[\'IsValidBillToAddress1\']" /></div>';
            var BillToAddress2CelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'BillToAddress2\'], visible:  !$parent.entity[\'IsValidBillToAddress2\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'BillToAddress2\'], visible:  $parent.entity[\'IsValidBillToAddress2\']" /></div>';
            var BillToZipCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'BillToZip\'], visible:  !$parent.entity[\'IsValidBillToZip\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'BillToZip\'], visible:  $parent.entity[\'IsValidBillToZip\'], attr: {maxlength: 10}" /></div>';
            var BillToCityCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'BillToCity\'], visible:  !$parent.entity[\'IsValidBillToCity\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'BillToCity\'], visible:  $parent.entity[\'IsValidBillToCity\']" /></div>';
            var BillToStateCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'BillToState\'], visible:  !$parent.entity[\'IsValidBillToState\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'BillToState\'], visible:  $parent.entity[\'IsValidBillToState\']" /></div>';
            var BillToCountryCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'BillToCountry\'], visible:  !$parent.entity[\'IsValidBillToCountry\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'BillToCountry\'], visible:  $parent.entity[\'IsValidBillToState\']" /></div>';
            var QuickPayFlagCelTemplate = '<div><div class="kgCellText" data-bind="text: $parent.entity[\'QuickPayFlag\'], visible:  !$parent.entity[\'IsValidQuickPayFlag\']"></div> <input type="text" class="requiredFieldBgColor width-percent-100" data-bind="value: $parent.entity[\'QuickPayFlag\'], visible:  $parent.entity[\'IsValidQuickPayFlag\']" /></div>';

            //#endregion Template
            // ReSharper disable once AssignedValueIsNeverUsed
            var colDefinition = [];

            colDefinition = [
                {
                    field: 'CarrierName',
                    displayName: 'Carrier Type',
                    width: 120,
                    cellTemplate: CarrierTypeCelTemplate
                },
                {
                    field: 'OrderNumber',
                    displayName: 'Order Number',
                    width: 150,
                    cellTemplate: OrderNumberCelTemplate
                },
                {
                    field: 'ProNumber',
                    displayName: 'ProNumber',
                    width: 120,
                    cellTemplate: ProNumberCelTemplate
                },
                {
                    field: 'CustomerBOLNumber',
                    displayName: 'CustomerBOLNumber',
                    width: 180,
                    cellTemplate: CustomerBOLNumberCelTemplate
                },
                {
                    field: 'BOLNumber',
                    displayName: 'BOLNumber',
                    width: 120,
                    cellTemplate: BOLNumberCelTemplate
                },
                {
                    field: 'PoNumber',
                    displayName: 'Po Number',
                    width: 118,
                    cellTemplate: PoNumberCelTemplate
                },
                {
                    field: 'RefPUNumber',
                    displayName: 'Ref/PU Number',
                    width: 149,
                    cellTemplate: RefPUNumberCelTemplate
                },
                {
                    field: 'DeliveryDate',
                    displayName: 'Delivery Date',
                    width: 130,
                    cellTemplate: DeliveryDateCelTemplate
                },
                {
                    field: 'BillDate',
                    displayName: 'Bill Date',
                    width: 115,
                    cellTemplate: BillDateCelTemplate
                },
                {
                    field: 'CarrierCode',
                    displayName: 'Carrier Code',
                    width: 120,
                    cellTemplate: CarrierCodeCelTemplate
                },
                {
                    field: 'OriginZip',
                    displayName: 'Origin Zip',
                    width: 108,
                    cellTemplate: OriginZipCelTemplate
                },
                {
                    field: 'DestinationZip',
                    displayName: 'Destination Zip',
                    width: 120,
                    cellTemplate: DestinationZipCelTemplate
                },
                {
                    field: 'Memo',
                    displayName: 'Memo',
                    width: 90,
                    cellTemplate: MemoCelTemplate
                },
                {
                    field: 'ItemId',
                    displayName: 'Item Id',
                    width: 90,
                    cellTemplate: ItemIdCelTemplate
                },
                {
                    field: 'PCS',
                    displayName: 'PCS',
                    width: 75,
                    cellTemplate: PCSCelTemplate
                },
                {
                    field: 'Description',
                    displayName: 'Description',
                    width: 175,
                    cellTemplate: DescriptionCelTemplate
                },
                {
                    field: 'CostField',
                    displayName: 'Cost',
                    width: 100,
                    cellTemplate: CostFieldCelTemplate
                },
                {
                    field: 'Class',
                    displayName: 'Class',
                    width: 95,
                    cellTemplate: ClassCelTemplate
                },
                {
                    field: 'Length',
                    displayName: 'Length',
                    width: 85,
                    cellTemplate: LengthCelTemplate
                },
                {
                    field: 'Width',
                    displayName: 'Width',
                    width: 85,
                    cellTemplate: WidthCelTemplate
                },
                {
                    field: 'Height',
                    displayName: 'Height',
                    width: 85,
                    cellTemplate: HeightCelTemplate
                },
                {
                    field: 'Wgt',
                    displayName: 'Wgt',
                    width: 75,
                    cellTemplate: WgtCelTemplate
                },
                {
                    field: 'PT',
                    displayName: 'PT',
                    width: 175,
                    cellTemplate: PTCelTemplate
                },
                {
                    field: 'ChargeCode',
                    displayName: 'Charge Code',
                    width: 140,
                    cellTemplate: ChargeCodeCelTemplate
                },
                {
                    field: 'ShipperCompanyName',
                    displayName: 'Shipper Company Name',
                    width: 175,
                    cellTemplate: ShipperCompanyNameCelTemplate
                },
                {
                    field: 'ShipperContactPerson',
                    displayName: 'Shipper Contact Person',
                    width: 175,
                    cellTemplate: ShipperContactPersonCelTemplate
                },
                {
                    field: 'ShipperPhone',
                    displayName: 'Shipper Phone',
                    width: 175,
                    cellTemplate: ShipperPhoneCelTemplate
                },
                {
                    field: 'ShipperFax',
                    displayName: 'Shipper Fax',
                    width: 175,
                    cellTemplate: ShipperFaxCelTemplate
                },
                {
                    field: 'ShipperAddress1',
                    displayName: 'Shipper Address1',
                    width: 175,
                    cellTemplate: ShipperAddress1CelTemplate
                },
                {
                    field: 'ShipperAddress2',
                    displayName: 'Shipper Address2',
                    width: 175,
                    cellTemplate: ShipperAddress2CelTemplate
                },
                {
                    field: 'ShipperCity',
                    displayName: 'Shipper City',
                    width: 102,
                    cellTemplate: ShipperCityCelTemplate
                },
                {
                    field: 'ShipperState',
                    displayName: 'Shipper State',
                    width: 110,
                    cellTemplate: ShipperStateCelTemplate
                },
                {
                    field: 'ShipperCountry',
                    displayName: 'Shipper Country',
                    width: 95,
                    cellTemplate: ShipperCountryCelTemplate
                },
                {
                    field: 'ConsigneeCompanyName',
                    displayName: 'Consignee Company Name',
                    width: 175,
                    cellTemplate: ConsigneeCompanyNameCelTemplate
                },
                {
                    field: 'ConsigneeContactPerson',
                    displayName: 'Consignee Contact Person',
                    width: 175,
                    cellTemplate: ConsigneeContactPersonCelTemplate
                },
                {
                    field: 'ConsigneePhone',
                    displayName: 'Consignee Phone',
                    width: 175,
                    cellTemplate: ConsigneePhoneCelTemplate
                },
                {
                    field: 'ConsigneeFax',
                    displayName: 'Consignee Fax',
                    width: 175,
                    cellTemplate: ConsigneeFaxCelTemplate
                },
                {
                    field: 'ConsigneeAddress1',
                    displayName: 'Consignee Address1',
                    width: 175,
                    cellTemplate: ConsigneeAddress1CelTemplate
                },
                {
                    field: 'ConsigneeAddress2',
                    displayName: 'Consignee Address2',
                    width: 175,
                    cellTemplate: ConsigneeAddress2CelTemplate
                },
                {
                    field: 'ConsigneeCity',
                    displayName: 'Consignee City',
                    width: 175,
                    cellTemplate: ConsigneeCityCelTemplate
                },
                {
                    field: 'ConsigneeState',
                    displayName: 'Consignee State',
                    width: 175,
                    cellTemplate: ConsigneeStateCelTemplate
                },
                {
                    field: 'ConsigneeCountry',
                    displayName: 'Consignee Country',
                    width: 175,
                    cellTemplate: ConsigneeCountryCelTemplate
                },
                {
                    field: 'BillToCompanyName',
                    displayName: 'BillTo Company Name',
                    width: 188,
                    cellTemplate: BillToCompanyNameCelTemplate
                },
                {
                    field: 'BillToPhone',
                    displayName: 'BillTo Phone',
                    width: 175,
                    cellTemplate: BillToPhoneCelTemplate
                },
                {
                    field: 'BillToFax',
                    displayName: 'BillTo Fax',
                    width: 175,
                    cellTemplate: BillToFaxCelTemplate
                },
                {
                    field: 'BillToAddress1',
                    displayName: 'BillTo Address1',
                    width: 175,
                    cellTemplate: BillToAddress1CelTemplate
                },
                {
                    field: 'BillToAddress2',
                    displayName: 'BillTo Address2',
                    width: 175,
                    cellTemplate: BillToAddress2CelTemplate
                },
                {
                    field: 'BillToZip',
                    displayName: 'BillTo Zip',
                    width: 100,
                    cellTemplate: BillToZipCelTemplate
                },
                {
                    field: 'BillToCity',
                    displayName: 'BillTo City',
                    width: 110,
                    cellTemplate: BillToCityCelTemplate
                },
                {
                    field: 'BillToState',
                    displayName: 'BillTo State',
                    width: 118,
                    cellTemplate: BillToStateCelTemplate
                },
                {
                    field: 'BillToCountry',
                    displayName: 'BillTo Country',
                    width: 135,
                    cellTemplate: BillToCountryCelTemplate
                },
                {
                    field: 'QuickPayFlag',
                    displayName: ' QuickPay Flag',
                    width: 148,
                    cellTemplate: QuickPayFlagCelTemplate
                }
            ];

            return colDefinition;
        };
        return VendorBillUploadFile;
    })();

    return VendorBillUploadFile;
});
