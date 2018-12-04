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
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', '../templates/reportViewerControlV2', 'services/client/VendorBillClient', 'services/client/CarriersClient', 'services/models/Email/EmailParam', 'services/models/common/Enums', 'services/models/carrier/CarrierContactDetails', 'templates/searchMasCarrierAutoComplete', 'services/models/common/searchMasCarrier', 'services/models/carrier/CarrierDocument', 'services/models/purchaseOrder/PurchaseOrderSearchFilter', 'services/client/CommonClient'], function(require, exports, ___router__, ___app__, __refSystem__, ___reportViewer__, __refVendorBillClient__, __refCarriersClient__, __refEmailParam__, __refEnums__, ___refCarrierContactDetailsModel__, __refMasCarrierControl__, __refMasCarrierSearch__, __refCarrierDocument__, ___refPurchaseOrderSearchFilterModel__, __refCommonClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    var _reportViewer = ___reportViewer__;
    var refVendorBillClient = __refVendorBillClient__;
    var refCarriersClient = __refCarriersClient__;
    var refEmailParam = __refEmailParam__;
    var refEnums = __refEnums__;
    
    
    var _refCarrierContactDetailsModel = ___refCarrierContactDetailsModel__;
    var refMasCarrierControl = __refMasCarrierControl__;
    var refMasCarrierSearch = __refMasCarrierSearch__;
    var refCarrierDocument = __refCarrierDocument__;
    var _refPurchaseOrderSearchFilterModel = ___refPurchaseOrderSearchFilterModel__;
    var refCommonClient = __refCommonClient__;

    /***********************************************
    CARRIER MAPPING VIEWMODEL
    ************************************************
    ** <summary>
    ** Carrier Mapping View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US11279/80/81/82</id><by>Chadnan</by> <date>Aug/2014</date>
    ** </createDetails>}
    
    ***********************************************/
    var CarrierMappingViewModel = (function () {
        //#endregion Properties
        function CarrierMappingViewModel() {
            this.carrierMappingGrid = null;
            this.CarrierContactDetailsBoardsGrid = null;
            this.headerOptions = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            this.checkMsgDisplay = true;
            this.localStorageKey = ko.observable('');
            this.truckLoadDocumentTypeItemsList = ko.observableArray([]);
            //For Visibility of Map/Unmap and Contact
            this.isMapContactEnable = ko.observable(false);
            this.commonClientCommand = new refCommonClient.Common();
            //For change legend name in view side
            this.isMap = ko.observable(false);
            this.isUnmap = ko.observable(false);
            this.isMapOrUnmap = ko.observable(false);
            this.isTruckLoadSelected = ko.observable(false);
            this.isSaveEnable = ko.observable(false);
            this.isSearchFilterItemsData = ko.observable(false);
            this.selectedDisabledDocument = ko.observableArray([]);
            this.UploadedFileName = ko.observable();
            this.vendorBillClient = new refVendorBillClient.VendorBillClient();
            this.carriersClientCommands = new refCarriersClient.CarriersClientCommands();
            this.emailParam = new refEmailParam.Models.EmailParameters();
            //properties for Map Fields
            this.carrierName = ko.observable('');
            this.carrierCode = ko.observable('');
            this.masCarrier = ko.observable('');
            this.legalName = ko.observable('');
            this.isBlock = ko.observable(false);
            // to show the progress bar
            this.listProgress = ko.observable(false);
            this.listProgressDetails = ko.observable(false);
            this.carrierContactDetailViewModel = ko.observable(new CarrierContactDetailViewModel());
            this.sortCol = ko.observable('');
            this.sorttype = ko.observable('');
            this.searchFilter = ko.observableArray([]);
            this.searchFilterItems = new Array();
            this.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
            this.isLoaded = ko.observable(false);
            this.fromLocalStorage = ko.observable(false);
            this.currentDateTime = ko.observable('');
            this.commonUtils = new Utils.Common();
            var self = this;

            self.masCarrierSerachViewModel = new refMasCarrierControl.SearchMasCarrierAutoComplete("A valid MAS Carrier is required.");

            // to get the vendorId after selecting vendor
            self.masCarrierId = ko.computed(function () {
                if (self.masCarrierSerachViewModel.name() != null)
                    return self.masCarrierSerachViewModel.id();

                return '';
            });

            // to get the vendor Name after selecting vendor
            self.masCarrierName = ko.computed(function () {
                if (self.masCarrierSerachViewModel.name() != null) {
                    return self.masCarrierSerachViewModel.masCarrierName();
                }
                return null;
            });

            //#region Grid Settings
            self.headerOptions = new _reportViewer.ReportHeaderOption();

            //self.headerOptions.reportHeader = "Carrier Mapping";
            self.headerOptions.reportName = "Carrier Mapping";
            self.headerOptions.gridTitleHeader = " ";
            self.headerOptions.reportHeader = " ";

            self.searchText = ko.observable("");
            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);

            //##region Export Options.
            var exportOpt = ko.observableArray([
                { exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
                { exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) },
                { exportType: _reportViewer.ExportOptions.FILTER, name: ko.observable(""), enabled: ko.observable(true) }
            ]);

            self.headerOptions.reportExportOptions = new _reportViewer.ReportExportControl(exportOpt);
            self.headerOptions.reportExportOptions.getUrl = function (exp) {
                var searchClient = new refVendorBillClient.SearchModel();
                searchClient.SearchValue = self.searchText().trim();
                searchClient.SortOrder = self.sorttype();
                searchClient.SortCol = self.sortCol();
                searchClient.PageNumber = 1;
                searchClient.PageSize = exp.exportType === 1 ? 2000 : self.gridOptions.pagingOptions.totalServerItems();
                searchClient.SearchFilterItems = self.searchFilterItems;
                searchClient.ExportType = exp.exportType;

                var filterModel = { ExportURL: "Accounting/ExportCarrierMappingDetailsInExcel", FilterModel: searchClient };
                return filterModel;
                //return "Accounting/ExportCarrierMappingDetailsInExcel?searchText=" + self.searchText() + "&sortCol=" + self.sortCol() + "&sortOrder=" + self.sorttype();
            };

            //##endregion Export Options End.
            self.setReportCriteria = function (reportActionObj) {
                if ((reportActionObj != undefined || reportActionObj != null) && (reportActionObj.gridOptions != undefined || reportActionObj.gridOptions != null) && (refSystem.isObject(reportActionObj.gridOptions.sortInfo())) && (reportActionObj.gridOptions.sortInfo().column != undefined || reportActionObj.gridOptions.sortInfo().column != null) && (reportActionObj.gridOptions.sortInfo().column.field != undefined || reportActionObj.gridOptions.sortInfo().column.field != null)) {
                    self.sortCol(reportActionObj.gridOptions.sortInfo().column.field);
                    self.sorttype(reportActionObj.gridOptions.sortInfo().direction);
                } else {
                    self.sortCol("CarrierID");
                    self.sorttype("asc");
                }
                if (reportActionObj.filter1selectedItemId == undefined || reportActionObj.filter1selectedItemId == 0) {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 15,
                        fadeOut: 15,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectModeFromTheList, "info", null, toastrOptions);
                    self.carrierMappingGrid.listProgress(false);
                    self.carrierMappingGrid.selectedFilter1Item(self.modeType());
                } else {
                    self.gridOptions = reportActionObj.gridOptions;

                    if (self.modeType() != reportActionObj.filter1selectedItemId) {
                        self.modeType(reportActionObj.filter1selectedItemId);
                        self.carrierMappingGrid.columnDefinition(self.setGridColumnDefinitions());
                    }

                    self.reportAction = reportActionObj;
                    if (self.isLoaded()) {
                        self.getReportData(reportActionObj);
                    }
                }
            };

            self.errorCarrierMapping = ko.validatedObservable({
                legalName: this.legalName,
                masCarrierSerachViewModel: self.masCarrierSerachViewModel
            });

            //set local storage key by url
            var url = $(location).attr('href');
            var urlArray = url.split('/');
            var localStorageId = urlArray.pop().toString().replace(/#/g, "");
            self.localStorageKey(localStorageId);
            if (localStorageId === "Mapping") {
                self.localStorageKey(localStorageId + "11");
            } else {
                self.localStorageKey(localStorageId);
            }

            self.getReportData = function (reportActionObj) {
                var deferred = $.Deferred();
                var promise = deferred.promise();
                var pageno = 0;
                pageno = Number(self.gridOptions.pagingOptions.currentPage());
                if (pageno > 0) {
                    // List View
                    self.carrierMappingGrid.listProgress(true);
                    if (self.carrierMappingGrid.reportColumnFilter.isFilterApply) {
                        var list = self.carrierMappingGrid.reportColumnFilter.reportColumnFilters();
                        self.searchFilterItems.removeAll();
                        if (list.length > 0) {
                            list.forEach(function (items) {
                                self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
                                if (items.selectedserviceType() != undefined && items.selectedOperatorType() != undefined) {
                                    self.searchFilterItem.FieldName = items.selectedserviceType().field;
                                    self.searchFilterItem.Operand = +items.selectedOperatorType().opratorId;
                                    self.searchFilterItem.SearchText = items.searchText();
                                    self.searchFilterItems.push(self.searchFilterItem);
                                }
                                if (self.searchFilterItems.length > 0 || items.selectedserviceType() != undefined) {
                                    self.isSearchFilterItemsData(true);
                                    //$('#gridPORexnordBoard').addClass('margin-top--36');
                                } else {
                                    self.isSearchFilterItemsData(false);
                                    //$('#gridPORexnordBoard').removeClass('margin-top--36');
                                }
                            });
                        }
                        self.searchText('');
                        self.gridOptions.filterOptions.filterText('');
                    }
                    var successCallBack = function (data) {
                        self.setPagingData(data.CarrierDetails, data.TotalCount, self.gridOptions.pagingOptions.pageSize());
                        self.carrierMappingGrid.listProgress(false);
                        deferred.resolve(data, reportActionObj.view);
                        self.carrierMappingGrid.invokeHighlight(self.searchText());
                    };
                    var faliureCallBack = function (message) {
                        self.carrierMappingGrid.listProgress(false);
                        ////	var toastrOptions = {
                        ////		toastrPositionClass: "toast-top-middle",
                        ////		delayInseconds: 15,
                        ////		fadeOut: 15,
                        ////		typeOfAlert: "",
                        ////		title: ""
                        ////	}
                        ////Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ErrorOccurredWhileFetchingCarrierDetails, "error", null, toastrOptions);
                    };
                    var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems };
                    var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.CarrierMappingBoard, IsFilterApplied: self.carrierMappingGrid.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), FromLocalStorage: self.fromLocalStorage() };

                    self.carriersClientCommands.getAllMappedCarrierDetails(filterDataToSave, successCallBack, faliureCallBack, self.gridOptions.pagingOptions);
                }
                return promise;
            };

            self.carrierMappingGrid = new _reportViewer.ReportViewerControlV2(self.headerOptions, self.grid);
            self.carrierMappingGrid.onFilterChange = self.setReportCriteria;

            //self.carrierMappingGrid.showOptionalHeaderRow(true);
            //self.carrierMappingGrid.OptionalHeaderRowLocation('TOP');
            self.carrierMappingGrid.ForceChange();

            //for search filter
            self.carrierMappingGrid.onSearchTextChange = function (reportViewer, newSearchValue) {
                self.resetGridSelection(self);
                if (newSearchValue.length >= 3 || newSearchValue.length == 0) {
                    var searchString = newSearchValue;
                    self.searchText(searchString.trim());
                    if (!self.carrierMappingGrid.reportColumnFilter.isFilterApply) {
                        self.carrierMappingGrid.reportColumnFilter.clearAll();
                    }
                    self.carrierMappingGrid.reportColumnFilter.isFilterApply = false;
                    self.getReportData(self.reportAction);
                    self.gridOptions.pagingOptions.currentPage(1);
                }
            };

            //## After selection change re-assign the fields value
            self.carrierMappingGrid.afterSelectionChange = function (items) {
                window.kg.selectedCarrier = items[0];
                self.selectedItem = items[0];

                self.isMapContactEnable(true);
                var selectedRowCount = items.length;
                if (selectedRowCount > 0) {
                    self.bindMapFields(self.selectedItem);
                    self.getCarrierConatctDetails(self.selectedItem);
                    self.isSaveEnable(true);
                    if (items[0].MASCarrier === null || items[0].MASCarrier === 'undefined' || items[0].MASCarrier === "") {
                        self.isMap(true);
                        self.isMapOrUnmap(false);
                        self.isUnmap(false);
                    } else {
                        self.isMap(false);
                        self.isMapOrUnmap(false);
                        self.isUnmap(true);
                    }

                    if (items[0].CarrierType === 'Truckload') {
                        self.isTruckLoadSelected(true);

                        if ($("#document").hasClass("in")) {
                            self.loadDocumnetDetails();
                        }
                    } else if (items[0].CarrierType !== 'Truckload' && self.isTruckLoadSelected()) {
                        $("#documentLink").removeClass("active");
                        $("#document").removeClass("active");
                        $("#document").removeClass("in");

                        //Removing CSSClass from CarrierContact if it is focused on truckload Carrier type
                        $("#carrierContactLink").removeClass("active");
                        $("#carrierContact").removeClass("active");
                        $("#carrierContact").removeClass("in");

                        //Activate CSSClass from CarrierContact if it is focused or not on truckload Carrier type
                        $("#mapUnmapLink").addClass("active");
                        $("#mapUnmap").addClass("active");
                        $("#mapUnmap").addClass("in");
                        self.isTruckLoadSelected(false);
                    }
                } else {
                    self.isSaveEnable(false);
                }

                if (self.isUnmap())
                    self.masCarrierSerachViewModel.isValidationRequired(false);
else if (self.isMap())
                    self.masCarrierSerachViewModel.isValidationRequired(true);
            };

            self.legalName.extend({
                required: {
                    message: 'A valid Legal Name is required.',
                    onlyIf: function () {
                        return (self.isMap());
                    }
                }
            });

            self.closeContact = function () {
                self.carrierContactDetailViewModel(new CarrierContactDetailViewModel());
                self.carrierName('');
                self.carrierCode('');
                self.masCarrierSerachViewModel.masCarrierName('');
                self.masCarrierSerachViewModel.isValidationRequired(false);
                self.legalName('');
                self.resetGridSelection(self);
                self.isMap(false);
                self.isMapOrUnmap(true);
                self.isUnmap(false);
                return self.isMapContactEnable(false);
            };

            self.saveContactDetails = function () {
                self.carrierContactDetailViewModel().selectedCarrierContacts().errorCarrierContact.errors.showAllMessages();

                if (self.carrierContactDetailViewModel().selectedCarrierContacts().errorCarrierContact.errors().length === 0) {
                    var details = self.carrierContactDetailViewModel().selectedCarrierContacts();

                    var carrierContactDetails = new _refCarrierContactDetailsModel.Models.CarrierContactDetail();
                    carrierContactDetails.CarrierId = self.selectedItem.CarrierId;
                    carrierContactDetails.CarrierName = self.selectedItem.CarrierName;
                    carrierContactDetails.ContactEmail = details.contactEmail();
                    carrierContactDetails.Id = details.Id;
                    carrierContactDetails.ContactFax = details.contactFax();
                    carrierContactDetails.ContactName = details.contactName();
                    carrierContactDetails.ContactPhone = details.contactphone();
                    carrierContactDetails.ContactType = self.carrierContactDetailViewModel().contactType().Id;
                    carrierContactDetails.DisplayName = self.carrierContactDetailViewModel().contactType().DisplayName;
                    carrierContactDetails.MassCarrierID = details.MassCarrierID;

                    //self.listProgress(true);
                    self.listProgressDetails(true);
                    refCarriersClient.CarriersClientCommands.prototype.SaveCarrierContactDetails(carrierContactDetails, function (message) {
                        //Saving Successful Callback
                        //self.listProgress(false);
                        self.listProgressDetails(false);
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 15,
                            fadeOut: 15,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.ContactSavedSuccessfullyMessage, "success", null, toastrOptions);
                        self.isMapContactEnable(false);
                        self.closeContact();
                        self.getReportData(self.reportAction);
                    }, function (message) {
                        // Saving failed call back
                        //self.listProgress(false);
                        self.listProgressDetails(false);
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 2,
                            typeOfAlert: "",
                            title: ""
                        };
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
                    });
                }
            };

            //To check if Message is clicked
            self.checkMsgClick = function () {
                self.checkMsgDisplay = true;
            };

            // to Check if Message is hidden or closed
            self.checkMsgHide = function () {
                self.checkMsgDisplay = true;
            };

            //#region Truckload Document Event And Properties
            /*	This is triggered when the user is uploading a document.
            It saves the document object to be saved in system */
            self.uploadCarrierMappingrDocument = function (obj, event) {
                var reader = new FileReader(), fileUploadObj = (event.target).files[0];
                var ext = fileUploadObj.name.split(".")[fileUploadObj.name.split(".").length - 1];

                reader.readAsDataURL(fileUploadObj);
                reader.onload = function (imgsrc) {
                    self.uploadFileContent = imgsrc.target.result;
                    self.UploadedFileName(fileUploadObj.name);
                    var item = {
                        FileContent: self.uploadFileContent,
                        FileExtension: self.UploadedFileName().split(".")[self.UploadedFileName().split(".").length - 1],
                        Description: self.UploadedFileName(),
                        FileName: self.UploadedFileName()
                    };

                    self.uploadedItem = item;
                };
            };

            self.deleteCarrierDocumnet = function (item) {
                var documnetItem = new refCarrierDocument.CarrierPacketDocument();
                documnetItem.CarrierId = self.selectedItem.CarrierId;
                documnetItem.PackageType = item.documentType;
                documnetItem.CarrierCode = self.selectedItem.CarrierCode;
                documnetItem.DocumentPath = item.UploadedFileName();

                self.carriersClientCommands.deleteCarrierDocuments(documnetItem, function () {
                    self.loadDocumnetDetails();
                }, function () {
                    self.loadDocumnetDetails();
                });
            };

            // Call Server to get the data
            self.loadDocumnetDetails = function () {
                self.carriersClientCommands.getCarrierDocumentDetails(self.selectedItem.CarrierId, function (data) {
                    if (refSystem.isArray(data)) {
                        self.truckLoadDocumentTypeItemsList.removeAll();

                        data.forEach(function (item) {
                            self.truckLoadDocumentTypeItemsList.push(new CarrierMappingTruckLoadDocumentView(item, self.deleteCarrierDocumnet));
                        });
                    }

                    self.UploadedFileName('');
                }, function (errorMessage) {
                    self.UploadedFileName('');
                });
            };

            //Enables Upload Button once all the mandatory fields are filled up.self.uploadedFileName.length > -1 &&
            self.enableAttachedButton = ko.computed(function () {
                var isAnySelected = $.grep(self.truckLoadDocumentTypeItemsList(), function (item) {
                    return item.isChecked() && item.isEnable();
                });

                if (self.UploadedFileName() != undefined && self.UploadedFileName() != "" && isAnySelected.length > 0) {
                    return true;
                }

                return false;
            });

            self.isMapContactAndSaveEnable = ko.computed(function () {
                if (self.isMapContactEnable()) {
                    if (self.isSaveEnable()) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });

            // Handles the attach command
            self.onAttach = function () {
                //self.listProgress(true);
                self.listProgressDetails(true);
                var modelToSave = new refCarrierDocument.CarrierDocument();
                modelToSave.CarrierPacketDocument = ko.observableArray()();
                modelToSave.CarrierId = self.selectedItem.CarrierId;
                modelToSave.UploadedFileDetails = self.uploadedItem;

                self.truckLoadDocumentTypeItemsList().forEach(function (item) {
                    if (item.isChecked() && !item.isFileUploaded()) {
                        var documnetItem = new refCarrierDocument.CarrierPacketDocument();
                        documnetItem.CarrierId = self.selectedItem.CarrierId;
                        documnetItem.PackageType = item.documentType;
                        documnetItem.CarrierCode = self.selectedItem.CarrierCode;
                        modelToSave.CarrierPacketDocument.push(documnetItem);

                        // Disable the attach button once clicked
                        item.isEnable(false);
                    }
                });

                self.carriersClientCommands.saveCarrierDocuments(modelToSave, function () {
                    self.loadDocumnetDetails();

                    //self.listProgress(false);
                    self.listProgressDetails(false);
                }, function () {
                    self.loadDocumnetDetails();

                    //self.listProgress(false);
                    self.listProgressDetails(false);
                });
            };

            //#endregion Truckload Document
            return self;
        }
        //#region Internal Public methods
        //clearing all filter data
        CarrierMappingViewModel.prototype.onClickClearAll = function () {
            var self = this;
            self.carrierMappingGrid.reportColumnFilter.clearAll();
            self.carrierMappingGrid.reportColumnFilter.applyFilter();
            self.isSearchFilterItemsData(false);
            self.isMapContactEnable(false);
            self.closeContact();
            //$('#gridPORexnordBoard').removeClass('margin-top--36');
        };

        //For Save Map Details
        CarrierMappingViewModel.prototype.saveMapDetails = function () {
            var self = this;
            if (self.validateMap())
                return false;

            //self.listProgress(true);
            self.listProgressDetails(true);
            self.selectedItem.LegalName = self.legalName();
            self.selectedItem.IsBlockedFromSystem = self.isBlock();
            self.selectedItem.MASCarrier = self.masCarrier();
            self.selectedItem.MassId = self.masCarrierId();
            refCarriersClient.CarriersClientCommands.prototype.SaveCarrierMappingDetail(self.selectedItem, function (message) {
                //Saving Successful Callback
                //self.listProgress(false);
                self.listProgressDetails(false);
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 15,
                        fadeOut: 15,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.MappingsSavedSuccessfullyMessage, "success", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
                self.isMapContactEnable(false);
                self.closeMap();

                //setTimeout(self.getReportData(self.reportAction), 3000)
                setTimeout(function () {
                    self.getReportData(self.reportAction);
                }, 1500);
                //self.getReportData(self.reportAction);
            }, function (message) {
                // Saving failed call back
                //self.listProgress(false);
                self.listProgressDetails(false);
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 15,
                    fadeOut: 15,
                    typeOfAlert: "",
                    title: ""
                };
                Utility.ShowToastr(false, message, "error", null, toastrOptions);
            });
        };

        //Validating Vendor Bill property
        CarrierMappingViewModel.prototype.validateMap = function () {
            var self = this;

            self.masCarrierSerachViewModel.vaildateSearchMasCarrierControl();
            if (self.errorCarrierMapping.errors().length != 0) {
                self.errorCarrierMapping.errors.showAllMessages();
                return true;
            } else {
                return false;
            }
        };

        // Binding Mapping Fields
        CarrierMappingViewModel.prototype.bindMapFields = function (selectedItem) {
            var self = this;
            self.carrierName(selectedItem.CarrierName);
            self.carrierCode(selectedItem.CarrierCode);
            self.masCarrierSerachViewModel.masCarrierName('');
            self.masCarrierSerachViewModel.id('');
            self.masCarrierSerachViewModel.name(new refMasCarrierSearch.Models.MasCarrierSearch());
            self.legalName('');
            self.isBlock(selectedItem.IsBlockedFromSystem);
        };

        // Initializes the data and binds to the UI
        CarrierMappingViewModel.prototype.initializeGridData = function (data) {
            var self = this;
            if (data) {
                self.carrierMappingGrid.OptionalHeaderRowLocation('TOP');
                $("#kgSpanFooterSelectedItems").text('0');
                self.setPagingData(ko.observableArray(data), self.gridOptions, self.reportAction);
                self.carrierMappingGrid.listProgress(false);
                $('.noLeftBorder').parent().css('border-left', '0');
                $('.noRightBorder').parent().css('border-right', '0');
            } else {
                self.carrierMappingGrid.listProgress(false);
            }
        };

        CarrierMappingViewModel.prototype.closeMap = function () {
            var self = this;
            self.resetGridSelection(self);
            self.carrierContactDetailViewModel(new CarrierContactDetailViewModel());
            self.carrierName('');
            self.carrierCode('');
            self.masCarrierSerachViewModel.masCarrierName('');
            self.masCarrierSerachViewModel.isValidationRequired(false);
            self.legalName('');
            self.isMap(false);
            self.isMapOrUnmap(true);
            self.isUnmap(false);
            return self.isMapContactEnable(false);
        };

        //#endregion Public Methods
        //#region Life Cycle Event
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        CarrierMappingViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        CarrierMappingViewModel.prototype.activate = function () {
            return true;
        };

        CarrierMappingViewModel.prototype.deactivate = function () {
            window.kg.selectedCarrier = undefined;
            var self = this;
            var saveData = { PageSize: self.gridOptions.pagingOptions.pageSize(), Filters: self.searchFilterItems };
            var filterDataToSave = { UserGridSetting: saveData, GridViewId: refEnums.Enums.FilterViewName.CarrierMappingBoard, IsFilterApplied: self.carrierMappingGrid.reportColumnFilter.isFilterApply, GridSearchText: self.searchText(), PageNo: self.gridOptions.pagingOptions.currentPage(), SortCol: self.sortCol(), SortOrder: self.sorttype(), isLoaded: true };
            LocalStorageController.Set(self.localStorageKey(), filterDataToSave);

            self.cleanup();
        };

        CarrierMappingViewModel.prototype.cleanup = function () {
            var self = this;
            self.masCarrierSerachViewModel.cleanup();
            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }
            delete self;
        };

        CarrierMappingViewModel.prototype.beforeBind = function () {
            var self = this;
            if (!self.isMap() && !self.isUnmap()) {
                self.isMapOrUnmap(true);
            }
            self.load();
        };

        CarrierMappingViewModel.prototype.load = function () {
            var self = this;
            var pageRecord = LocalStorageController.Get(self.localStorageKey());
            if (pageRecord != null) {
                self.gridOptions.pagingOptions.currentPage(pageRecord.PageNo);
                self.gridOptions.pagingOptions.pageSize(pageRecord.UserGridSetting.PageSize);

                var list = pageRecord.UserGridSetting.Filters;
                self.searchFilterItems.removeAll();
                if (list.length > 0 && list[0].FieldName) {
                    list.forEach(function (items) {
                        self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
                        self.searchFilterItem.FieldName = items.FieldName;
                        self.searchFilterItem.Operand = items.Operand;
                        self.searchFilterItem.SearchText = items.SearchText;
                        self.searchFilterItems.push(self.searchFilterItem);
                    });
                    self.carrierMappingGrid.reportColumnFilter.addFilter(self.searchFilterItems);
                }
                if (typeof pageRecord.isLoaded !== "undefined") {
                    self.isLoaded(pageRecord.isLoaded);
                }
                self.gridOptions.filterOptions.filterText(pageRecord.GridSearchText);
                self.searchText(pageRecord.GridSearchText);
                self.fromLocalStorage(true);
            }
            self.getReportData(self.reportAction);
        };

        CarrierMappingViewModel.prototype.compositionComplete = function () {
            var self = this;
            var successCallBack = function (data) {
                self.searchText('');
                var filterlist = data.Filters;
                self.gridOptions.pagingOptions.pageSize(data.PageSize);
                self.gridOptions.pagingOptions.currentPage(1);
                self.searchFilterItems.removeAll();
                if (filterlist.length > 0 && filterlist[0].FieldName) {
                    filterlist.forEach(function (items) {
                        self.searchFilterItem = new _refPurchaseOrderSearchFilterModel.Models.PurchaseOrderSearchFilter();
                        self.searchFilterItem.FieldName = items.FieldName;
                        self.searchFilterItem.Operand = items.Operand;
                        self.searchFilterItem.SearchText = items.SearchText;
                        self.searchFilterItems.push(self.searchFilterItem);
                    });
                    self.carrierMappingGrid.reportColumnFilter.addFilter(self.searchFilterItems);
                    if (self.searchFilterItems.length > 0) {
                        self.isSearchFilterItemsData(true);
                        //$('#gridPORexnordBoard').addClass('margin-top--36');
                    } else {
                        self.isSearchFilterItemsData(false);
                        //$('#gridPORexnordBoard').removeClass('margin-top--36');
                    }
                }
                self.gridOptions.filterOptions.filterText('');
                self.searchText('');
                self.isLoaded(true);
                self.fromLocalStorage(true);
            };
            if (!LocalStorageController.Get(self.localStorageKey())) {
                self.commonClientCommand.GetUserGridSettings(refEnums.Enums.FilterViewName.CarrierMappingBoard, successCallBack);
            } else {
                //using to show clear filter button after saving filtered data in local storage and switching between tab
                var filteredData = LocalStorageController.Get(self.localStorageKey());
                if (filteredData.UserGridSetting.Filters.length > 0) {
                    self.isSearchFilterItemsData(true);
                    //$('#gridPORexnordBoard').addClass('margin-top--36');
                } else {
                    self.isSearchFilterItemsData(false);
                    //$('#gridPORexnordBoard').removeClass('margin-top--36');
                }
            }
        };

        //#endregion}
        //#region Private Methods
        CarrierMappingViewModel.prototype.reloadPage = function () {
            var self = this;
            LocalStorageController.Set(self.localStorageKey(), undefined);
            LocalStorageController.Set(self.localStorageKey() + 'lastReloadDateTime', undefined);
            self.isMapContactEnable(false);
            self.closeContact();
            self.beforeBind();
        };

        //set Date Time for record of last refreshed
        CarrierMappingViewModel.prototype.setDateTimeOfReload = function () {
            var self = this;
            if (LocalStorageController.Get(self.localStorageKey() + 'lastReloadDateTime')) {
                var localDateTimeOfReload = LocalStorageController.Get(self.localStorageKey() + 'lastReloadDateTime');
                self.currentDateTime(localDateTimeOfReload);
            } else {
                var onlyDate = self.commonUtils.formatDate(new Date(), 'mm/dd/yyyy');
                var date = new Date();
                var str = 'Last Refreshed: ' + onlyDate + ' ' + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
                LocalStorageController.Set(self.localStorageKey() + 'lastReloadDateTime', str);

                //var reloadDate = LocalStorageController.Get(self.vendorBillDetailsViewModel.proNumber() + 'lastReloadDateTime');
                self.currentDateTime(str);
            }
        };

        CarrierMappingViewModel.prototype.setPagingData = function (data, page, pageSize) {
            var self = this;
            self.gridOptions.data(data);
            self.gridOptions.data.valueHasMutated();
            self.gridOptions.pagingOptions.totalServerItems(page);
        };

        // Sets the options required properties of the grid
        CarrierMappingViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = true;
            grOption.showPageSize = true;

            grOption.UIGridID = ko.observable("CarrierMappingGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
                columnName: "CarrierID",
                order: "desc"
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
            grOption.enableSaveGridSettings = true;
            grOption.useClientSideFilterAndSort = false;
            grOption.showColumnMenu = true;

            return grOption;
        };

        CarrierMappingViewModel.prototype.resetGridSelection = function (self) {
            window.kg.toggleSelection(false);
        };

        // Sets the columns in the grid
        CarrierMappingViewModel.prototype.setGridColumnDefinitions = function () {
            // ReSharper disable once AssignedValueIsNeverUsed
            var colDefinition = [];

            colDefinition = [
                { field: 'CarrierName', displayName: 'Carrier Name', type: _reportViewer.DataTypes.String },
                { field: 'CarrierCode', displayName: 'Code', width: 90, type: _reportViewer.DataTypes.String },
                { field: 'CarrierType', displayName: 'Carrier Type', width: 123, type: _reportViewer.DataTypes.String },
                { field: 'MASCarrier', displayName: 'MAS Carrier', width: 190, type: _reportViewer.DataTypes.String },
                { field: 'MASCode', displayName: 'MAS Code', width: 114, type: _reportViewer.DataTypes.String }
            ];

            return colDefinition;
        };

        CarrierMappingViewModel.prototype.getCarrierConatctDetails = function (selectedItem) {
            var self = this;

            //self.carrierContactDetailViewModel().contactCarrierName(self.selectedItem.CarrierName);
            var successCallBack = function (data) {
                if (data) {
                    self.carrierContactDetailViewModel(new CarrierContactDetailViewModel());
                    self.carrierContactDetailViewModel().addConatctList(data.CarrierContactDetails, data.CarrierTypes);
                    self.carrierContactDetailViewModel().contactCarrierName(selectedItem.CarrierName);
                }
            }, faliureCallBack = function () {
            };

            self.carriersClientCommands.getCarrierTypesDetails(self.selectedItem.CarrierId, successCallBack, faliureCallBack);
        };
        return CarrierMappingViewModel;
    })();

    var CarrierContactDetailViewModel = (function () {
        function CarrierContactDetailViewModel(carrierContactDetails) {
            this.conatctLists = ko.observableArray();
            this.selectedCarrierContacts = ko.observable(new CarrierContacts());
            this.contactTypeList = ko.observableArray();
            this.contactCarrierName = ko.observable('');
            this.contactType = ko.observable();
            var self = this;

            self.addConatctList = function (conatctList, contactTypeList) {
                self.contactTypeList(contactTypeList);

                conatctList.forEach(function (item) {
                    self.conatctLists.push(new CarrierContacts(item, self.selected, contactTypeList));
                    self.contactCarrierName(item.CarrierName);
                });
            };

            self.selected = function (data) {
                if (data) {
                    var contactType = data.contactType();

                    if (self.contactTypeList()) {
                        var selectedContactType = $.grep(self.contactTypeList(), function (item) {
                            return item.Id === contactType;
                        });

                        if (selectedContactType && selectedContactType.length > 0) {
                            self.contactType(selectedContactType[0]);
                        }
                    }

                    self.selectedCarrierContacts(data);
                }
            };
        }
        return CarrierContactDetailViewModel;
    })();
    exports.CarrierContactDetailViewModel = CarrierContactDetailViewModel;

    var CarrierContacts = (function () {
        function CarrierContacts(carrierContactDetails, selected, contactTypes) {
            this.contactTypes = ko.observableArray();
            this.contactCarrierName = ko.observable('');
            this.contactType = ko.observable();
            this.contactName = ko.observable('').extend({ required: { message: "A valid Contact Name is required." } });
            this.contactEmail = ko.observable('').extend({ required: { message: "Please Enter  Email" }, email: true });
            this.contactphone = ko.observable('');
            this.contactFax = ko.observable('').extend({
                required: {
                    message: 'Please Enter Fax Number.'
                },
                minLength: { message: "Please Enter 10 digit Fax Number", params: 13 }
            });
            this.displayName = ko.observable();
            var self = this;

            self.errorCarrierContact = ko.validatedObservable({
                contactphone: self.contactphone,
                contactFax: self.contactFax,
                contactName: self.contactName,
                contactEmail: self.contactEmail
            });

            self.contactTypes(contactTypes);

            self.selected = function (data) {
                self.completeData = data;
                if (selected && typeof selected === 'function') {
                    selected(data);
                }

                return true;
            };

            self.contactType.subscribe(function (item) {
                var list = 0;
            });

            self.contactphone.extend({
                required: {
                    message: 'Please Enter Phone Number.'
                },
                minLength: {
                    message: "Please Enter 10 digit Phone Number",
                    params: 13
                }
            });

            if (carrierContactDetails) {
                self.contactName(carrierContactDetails.ContactName);
                self.contactEmail(carrierContactDetails.ContactEmail);
                self.contactphone(carrierContactDetails.ContactPhone);
                self.contactFax(carrierContactDetails.ContactFax);
                self.displayName(carrierContactDetails.DisplayName);
                self.contactCarrierName(carrierContactDetails.CarrierName);
                self.contactType(carrierContactDetails.ContactType);

                self.Id = carrierContactDetails.Id;
                self.MassCarrierID = carrierContactDetails.MassCarrierID;
                self.FirstMailPeriod = carrierContactDetails.FirstMailPeriod;
                self.SecondMailPeriod = carrierContactDetails.SecondMailPeriod;
                self.UpdatedBy = carrierContactDetails.UpdatedBy;
                self.CarrierId = carrierContactDetails.CarrierId;
            }
        }
        // this function is used to convert formatted phone number.
        CarrierContacts.prototype.formatPhoneNumber = function (field) {
            var phone = field();
            var self = this;
            if (phone && phone.length > 10 && phone.length <= 15) {
                phone = phone.replace(/[^0-9]/g, '');
                phone = phone.replace(/(\d{3})(\d{3})(\d{4})(\d{1})/, "($1)$2-$3x$4");
                field(phone);
            }
            if (phone && phone.length >= 1 && phone.length <= 10) {
                phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
                field(phone);
            }
            if (phone.length > 15) {
                phone = phone.replace(/[^0-9]/g, '');
                if (phone.length > 10) {
                    phone = phone.substring(0, 15);
                }
                phone = phone.replace(/(\d{3})(\d{3})(\d{4})(\d{1})/, "($1)$2-$3x$4");
                field(phone);
            }
        };

        // this function is used to convert formatted Fax number.
        CarrierContacts.prototype.formatFaxNumber = function (field) {
            var phone = field();
            if (phone && phone.length >= 1) {
                phone = phone.replace(/[^0-9]/g, '');
                if (phone.length > 10) {
                    phone = phone.substring(0, 10);
                }
                phone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1)$2-$3");
                field(phone);
            }
        };
        return CarrierContacts;
    })();
    exports.CarrierContacts = CarrierContacts;

    /*
    ** <summary>
    ** TruckLoad Document model
    ** </summary>
    ** <createDetails>
    ** <id>US12731</id> <by>Chandan</by> <date>17-10-2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var CarrierMappingTruckLoadDocumentView = (function () {
        // constructor which takes two argument one is for data and second is the delete call back
        function CarrierMappingTruckLoadDocumentView(documentItem, deleteAction) {
            //For TruckLoad Document
            this.carriersClientCommands = new refCarriersClient.CarriersClientCommands();
            this.documentTypeName = ko.observable();
            this.isChecked = ko.observable(false);
            this.selectedDisabledDocument = ko.observableArray([]);
            this.UploadedFileName = ko.observable();
            this.isEnable = ko.observable(true);
            this.isFileUploaded = ko.observable(true);
            this.isInsuranceExpired = ko.observable(false);
            this.documentPathToView = ko.observable();
            var self = this;

            self.documentTypeName(documentItem.DocumentName);
            self.isFileUploaded(documentItem.IsDocumentsUploaded);
            self.isChecked(documentItem.IsDocumentsUploaded);
            self.isEnable(!documentItem.IsDocumentsUploaded);
            self.documentType = documentItem.PackageType;
            self.carrierId = documentItem.CarrierId;
            self.UploadedFileName(documentItem.DocumentPath);
            self.isInsuranceExpired(documentItem.IsInsuranceExpired);
            self.documentPathToView(documentItem.DocumentPathToView);

            // Handles the delete action and calls the main view delete callback
            self.deleteAction = function (item) {
                deleteAction(item);
            };

            return self;
        }
        return CarrierMappingTruckLoadDocumentView;
    })();

    return CarrierMappingViewModel;
});
