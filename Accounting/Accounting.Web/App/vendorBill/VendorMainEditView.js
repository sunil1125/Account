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
/// <reference path="../services/models/TypeDefs/VendorBillSearchModel.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'services/models/common/Enums', 'vendorBill/VendorBillQuickSearchView', 'vendorBill/VendorBillSearchView', 'services/client/VendorBillClient', 'services/models/vendorBill/VendorBillSearchResult', 'services/models/vendorBill/VendorBillSearchParam', 'services/models/vendorBill/VendorBillQuickSearch', '../templates/reportViewerControlV2', 'services/models/common/searchVendorName', 'services/client/CommonClient', 'services/models/transactionSearch/TransactionSearchRequest'], function(require, exports, ___router__, ___app__, __refSystem__, __refEnums__, ___refVendorBillQuickSearch__, ___refVendorBillExtendedSearch__, __refVendorBillClient__, __refVendorBillSearchRes__, __refVendorBillSearchParam__, __refVednorBillQuickSearchParam__, ___reportViewer__, __refVendorNameSearch__, __refCommonClient__, __refSearchModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    var refEnums = __refEnums__;
    var _refVendorBillQuickSearch = ___refVendorBillQuickSearch__;
    var _refVendorBillExtendedSearch = ___refVendorBillExtendedSearch__;
    var refVendorBillClient = __refVendorBillClient__;
    var refVendorBillSearchRes = __refVendorBillSearchRes__;
    var refVendorBillSearchParam = __refVendorBillSearchParam__;
    var refVednorBillQuickSearchParam = __refVednorBillQuickSearchParam__;
    var _reportViewer = ___reportViewer__;
    var refVendorNameSearch = __refVendorNameSearch__;
    var refCommonClient = __refCommonClient__;
    var refSearchModel = __refSearchModel__;

    //#endregion
    /*
    ** <summary>
    ** Vendor Main Edit View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US8435</id> <by>ACHAL RASTOGI</by> <date>04-16-2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var VendorBillMainEditViewModel = (function () {
        //#endregion
        //#region Constructor
        function VendorBillMainEditViewModel() {
            //** hold quick search view model data. */
            this.vendorBillQuickSearchViewModel = new _refVendorBillQuickSearch.VendorBillQuickSearchViewModel();
            //** hold extended search view model data. */
            this.vendorBillExtSearchViewModel = new _refVendorBillExtendedSearch.VendorBillSearchViewModel();
            this.vendorBillClient = new refVendorBillClient.VendorBillClient();
            this.vendorBillSearchRes = new refVendorBillSearchRes.Models.VendorBillSearchResult();
            this.vendorBillSearchParam = new refVendorBillSearchParam.Models.VendorBillSearchParam();
            this.vendorBillQuickSearchParam = new refVednorBillQuickSearchParam.Models.VendorBillQuickSearch();
            //#region public report viewer members
            this.reportContainer = null;
            this.header = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.app = _app;
            this.modeType = ko.observable();
            this.isQuickSearch = true;
            // client commond
            this.commonClient = new refCommonClient.Common();
            this.searchRequestParam = new refSearchModel.Model.TransactionSearchRequest();
            this.sortCol = ko.observable('');
            this.sorttype = ko.observable('');
            // to disable automatic loading of data
            this.isLoaded = false;
            var self = this;
            self.header = new _reportViewer.ReportHeaderOption();
            self.header.reportHeader = " ";
            self.header.reportName = "Vendor Bill Search Result";
            self.header.gridTitleHeader = "";
            self.imagePathForModalPopup = ko.observable('');
            var CommonUtils = new Utils.Common();
            self.sortCol('BolNumber');
            self.sorttype('desc');

            //initialize date filters
            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);

            //Adding the export functionality
            var exportOpt = ko.observableArray([
                { exportType: _reportViewer.ExportOptions.CSV, name: ko.observable("Csv"), enabled: ko.observable(true) },
                { exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) },
                { exportType: _reportViewer.ExportOptions.PDF, name: ko.observable("Pdf "), enabled: ko.observable(true) }
            ]);

            self.header.reportExportOptions = new _reportViewer.ReportExportControl(exportOpt);
            self.header.reportExportOptions.getUrl = function (exp) {
                //if (self.gridOptions.pagingOptions.totalServerItems() == 0)
                //	return "No Data";
                var CommonUtils = new Utils.Common();
                var today = new Date();
                var currentTimestamp = moment(today).format("MM-DD-YYYY, HH:mm").toString();
                currentTimestamp = currentTimestamp.replace(':', '!');
                return "CarrierRate/reports/ExportDashboardShipmentSummary/" + _reportViewer.ExportOptions[exp.exportType] + "/" + self.gridOptions.sortInfo().column.field + '/' + self.gridOptions.sortInfo().direction + "/" + "?currentTimestamp=" + currentTimestamp;
            };

            self.setReportCriteria = function (reportActionObj) {
                self.gridOptions = reportActionObj.gridOptions;
                if ((reportActionObj != undefined || reportActionObj != null) && (reportActionObj.gridOptions != undefined || reportActionObj.gridOptions != null) && (refSystem.isObject(reportActionObj.gridOptions.sortInfo())) && (reportActionObj.gridOptions.sortInfo().column != undefined || reportActionObj.gridOptions.sortInfo().column != null) && (reportActionObj.gridOptions.sortInfo().column.field != undefined || reportActionObj.gridOptions.sortInfo().column.field != null)) {
                    self.sortCol(reportActionObj.gridOptions.sortInfo().column.field);

                    if (self.sortCol() == 'BillDateDisplay') {
                        self.sortCol('BillDate');
                    } else if (self.sortCol() === 'BillStatusDisplay') {
                        self.sortCol("BillStatus");
                    }

                    self.sorttype(reportActionObj.gridOptions.sortInfo().direction);
                } else {
                    self.sortCol("BolNumber");
                    self.sorttype("asc");
                }
                if (self.reportAction != null) {
                    if ((self.modeType() != reportActionObj.filter1selectedItemId) || (self.reportAction.view != reportActionObj.view) || (reportActionObj.dateFrom != self.reportAction.dateFrom) || (reportActionObj.dateTo != self.reportAction.dateTo)) {
                        // self.gridOptions.pagingOptions.currentPage(1);
                    }
                }

                // Re-set the Grid Columns since the prev. selection of serviceType is diff. to the Current selection
                // we don't want any data on page load so we commented getReportdata  function.
                //self.getReportData();
                self.reportAction = reportActionObj;

                if (self.isLoaded) {
                    self.callGetSearchData();
                }

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

            // self.getReportData = self.getSearchData;
            self.reportContainer = new _reportViewer.ReportViewerControlV2(self.header, self.grid);

            self.reportContainer.onFilterChange = self.setReportCriteria;
            self.reportContainer.ForceChange();

            // redirects to Vendor bill order page
            self.reportContainer.onProNumberClick = function (shipmentObj) {
                var vendorBillId = shipmentObj.VendorBillId;
                if (vendorBillId > 0) {
                    if (shipmentObj.IsPurchaseOrder) {
                        _app.trigger("openPurchaseOrder", vendorBillId, shipmentObj.PRONo, function (callback) {
                            if (!callback) {
                                return;
                            }
                        });
                    } else {
                        _app.trigger("openVendorBill", vendorBillId, shipmentObj.PRONo, function (callback) {
                            if (!callback) {
                                return;
                            }
                        });
                    }
                }
            };

            //Display text based on status in status column.
            self.reportContainer.getTextfromId = function (shipmentobj) {
                var self = this;
                var status = CommonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, shipmentobj.BillStatus.toString());
                return status;
            };

            //Displays image based on the status in the status column
            self.reportContainer.getImagefromId = function (shipmentobj) {
                var imgPath;
                var self = this;
                var status = CommonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, shipmentobj.BillStatus.toString());
                if (status === null || status === '') {
                    imgPath = 'Content/images/pendingA.png';
                } else {
                    imgPath = 'Content/images/' + status + 'A.png';
                }
                return imgPath;
            };

            //Displays image based on tracking status
            self.reportContainer.IsTracking = function (shipmentobj) {
                var status = shipmentobj.Tracking;
                var imgPath = (status) ? 'Content/images/map-marker.png' : 'Content/images/map-marker-blur.png';

                //var imgPath = (status) ? 'fa fa-map-marker fa-1.8x changeColorTrack' : 'fa fa-map-marker fa-1.8x changeColorTrackInActive';
                return imgPath;
            };

            //Shows second image when user hovers in the images of status column.
            self.reportContainer.getImageOnMouseHover = function (shipmentObj, index) {
                var imgPath;
                var self = this;

                var statusId = shipmentObj.BillStatus;

                var status = CommonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, statusId.toString()).trim();

                if (status === null || status === '') {
                    imgPath = 'Content/images/pendingB.png';
                } else {
                    imgPath = 'Content/images/' + status + 'B.png';
                }

                var _index = '#img' + index;
                $(_index).attr("src", imgPath);
            };

            //Show first image when user hovers out from the images of status column
            self.reportContainer.getImageOnMouseOut = function (shipmentObj, index) {
                var imgPath;

                var self = this;

                var statusId = shipmentObj.BillStatus;
                var status = CommonUtils.getEnumValueById(refEnums.Enums.VendorBillStatus, statusId.toString()).trim();

                if (status === null || status === '') {
                    imgPath = 'Content/images/pendingA.png';
                } else {
                    imgPath = 'Content/images/' + status + 'A.png';
                }

                var _index = '#img' + index;
                $(_index).attr("src", imgPath);
            };

            //Change image path for the bigger image based on status
            self.reportContainer.getLargeImage = function (shipmentObj, index) {
                var statusId = shipmentObj.BillStatus;
                self.calculateImagePosition(statusId, index);
                jQuery(window).on('resize', function () {
                    if (statusId != undefined && statusId != null && statusId >= 0)
                        self.calculateImagePosition(statusId, index);
                });
                jQuery(window).scroll(function () {
                    if (statusId != undefined && statusId != null && statusId >= 0)
                        self.calculateImagePosition(statusId, index);
                });
                jQuery('.modal-backdrop').on('click', function () {
                    statusId = undefined;
                    jQuery(window).off('resize', function () {
                        if (statusId != undefined && statusId != null && statusId >= 0)
                            self.calculateImagePosition(statusId, index);
                    });
                });
            };

            self.calculateImagePosition = function (statusId, index) {
                var imgPath;
                var status = CommonUtils.getEnumValueById(refEnums.Enums.OrderStatus, statusId.toString()).trim();

                if (status === null || status === '') {
                    self.imagePathForModalPopup('Content/images/pending.png');
                } else {
                    self.imagePathForModalPopup('Content/images/' + status + '.png');
                }

                //Calculation of top and left for the popup image
                var _index = '#img' + index;
                var imagePosition = $(_index).offset();

                var left = imagePosition.left - $("#divdialog-modal").width() - $(document).scrollLeft();
                var top = imagePosition.top - $("#divdialog-modal").height() - $(document).scrollTop() + 46;

                $("#divdialog-modal").css({ "top": top, "left": left });
                $('#divdialog-modal').modal({ modal: true, keyboard: true, overlayClose: false, backdrop: true });
                ///jQuery('#divdialog-modal').css('position', 'absolute');
            };

            // redirects to sales order details page
            self.reportContainer.onBolNumberClick = function (shipmentObj) {
                var salesOrderId = shipmentObj.SalesOrderId;
                if (salesOrderId > 0) {
                    _app.trigger("openSalesOrder", salesOrderId, shipmentObj.BolNumber, function (callback) {
                        if (!callback) {
                            return;
                        }
                    });
                }
            };

            //Displays Date without Time Part
            self.reportContainer.getDateFormat = function (shipmentobj) {
                var self = this;
                return CommonUtils.formatDate(new Date(shipmentobj.BillDate), 'mm/dd/yyyy');
            };
        }
        //#endregion
        //#region Internal Methods
        VendorBillMainEditViewModel.prototype.setPagingData = function (data, page, pageSize) {
            //Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
            var self = this;
            self.gridOptions.data(data);
            self.gridOptions.data.valueHasMutated();
            self.gridOptions.pagingOptions.totalServerItems(page);
        };

        VendorBillMainEditViewModel.prototype.getSearchData = function () {
            var self = this;

            if (!self.vendorBillQuickSearchViewModel.validateQuickSearch()) {
                self.clickOnSearchResult();
                self.expandView('collapseSearchResults');
                self.callGetSearchDataOnClick();
            } else {
                self.collapseView('collapseSearchResults');
                self.collapseView('collapseExtendedSearch');
                self.expandView('collapseQuickSearch');
                setTimeout(function () {
                    $('#collapseQuickSearch').css("overflow", "visible");
                }, 500);

                return false;
            }
        };

        VendorBillMainEditViewModel.prototype.callGetSearchDataOnClick = function () {
            var self = this;

            self.reportContainer.listProgress(true);
            var successCallBack = function (data) {
                //self.setPagingData(data.VendorBillList, self.gridOptions, self.reportAction);
                self.setPagingData(data.VendorBillList, data.TotalCountVendorBill, self.gridOptions.pagingOptions.pageSize());
                self.reportContainer.listProgress(false);
                self.isLoaded = true;
                $('.noLeftBorder').parent().css('border-left', '0px');
                $('.noRightBorder').parent().css('border-right', '0px');
                //self.reportContainer.invokeHighlight(self.searchText());
            }, faliureCallBack = function () {
                self.reportContainer.listProgress(false);
            };

            if (self.isQuickSearch) {
                self.fillSearchDetail();
                self.vendorBillClient.quickSearchVendorBill(self.vendorBillQuickSearchParam, successCallBack, faliureCallBack);
            }
        };

        VendorBillMainEditViewModel.prototype.callGetSearchData = function () {
            var self = this;

            if (!self.vendorBillQuickSearchViewModel.validateQuickSearch()) {
                self.callGetSearchDataOnClick();
            } else {
                self.collapseView('collapseSearchResults');
                self.collapseView('collapseExtendedSearch');
                self.expandView('collapseQuickSearch');
                setTimeout(function () {
                    $('#collapseQuickSearch').css("overflow", "visible");
                }, 500);

                return false;
            }
        };

        VendorBillMainEditViewModel.prototype.clickOnQuickSearch = function () {
            var self = this;

            if ($("#collapseQuickSearch").css("overflow") === "hidden") {
                setTimeout(function () {
                    $('#collapseQuickSearch').css("overflow", "visible");
                }, 500);
            } else {
                $('#collapseQuickSearch').css("overflow", "hidden");
            }

            // To check other accordion are not open if yes then close.
            self.collapseView('collapseSearchResults');
            self.collapseView('collapseExtendedSearch');

            //$("#txtVendorName").focus();
            self.isQuickSearch = true;
        };
        VendorBillMainEditViewModel.prototype.clickOnExtendSearch = function () {
            var self = this;

            // To check other accordion are not open if yes then close.
            self.collapseView('collapseSearchResults');
            self.collapseView('collapseQuickSearch');
            self.isQuickSearch = false;

            //to set individual div overflow: hidden
            $('#collapseQuickSearch').css("overflow", "hidden");
        };

        VendorBillMainEditViewModel.prototype.clickOnSearchResult = function () {
            var self = this;

            //To change style of arrow after collapse
            self.collapseView('collapseExtendedSearch');
            self.collapseView('collapseQuickSearch');

            //to set individual div overflow: hidden
            $('#collapseQuickSearch').css("overflow", "hidden");
        };

        //To open accordion on click of Search
        VendorBillMainEditViewModel.prototype.openaccordion = function () {
            if ($('#collapseQuickSearch').hasClass('in')) {
                $('#collapseQuickSearch').collapse('toggle');
                $('#AchorcollapseQuickSearch').addClass('collapsed');
            }
            if ($('#collapseExtendedSearch').hasClass('in')) {
                $('#collapseExtendedSearch').collapse('toggle');
                $('#AchorcollapseExtendedSearch').addClass('collapsed');
            }

            // To check other accordion are not open
            $('#accordion2').on('show.bs.collapse', function () {
                $('#accordion2 .in').collapse('hide');
            });

            if (!$('#collapseSearchResults').hasClass('in')) {
                $('#collapseSearchResults').collapse('toggle');
                $('#AchorcollapseSearchResults').removeClass('collapsed');
            }

            //to set individual div overflow: hidden
            $('#collapseQuickSearch').css("overflow", "hidden");
        };

        VendorBillMainEditViewModel.prototype.fillSearchDetail = function () {
            var self = this;
            self.vendorBillQuickSearchParam.BolNumber = self.vendorBillQuickSearchViewModel.bolNumber() ? self.vendorBillQuickSearchViewModel.bolNumber().trim() : "";
            self.vendorBillQuickSearchParam.PoNumber = self.vendorBillQuickSearchViewModel.poNumber() ? self.vendorBillQuickSearchViewModel.poNumber().trim() : "";
            self.vendorBillQuickSearchParam.ProNumber = self.vendorBillQuickSearchViewModel.proNumber() ? self.vendorBillQuickSearchViewModel.proNumber().trim() : "";
            self.vendorBillQuickSearchParam.VendorName = self.vendorBillQuickSearchViewModel.vendorName();
            self.vendorBillQuickSearchParam.FromDate = new Date('1/1/1790 12:00:00 AM');
            self.vendorBillQuickSearchParam.ToDate = new Date('12/31/9995 11:59:59 PM');
            self.vendorBillQuickSearchParam.PageNumber = self.gridOptions.pagingOptions.currentPage();
            self.vendorBillQuickSearchParam.PageSize = self.gridOptions.pagingOptions.pageSize();
            self.vendorBillQuickSearchParam.PagesFound = 0;
            self.vendorBillQuickSearchParam.ProcessStatus = self.vendorBillQuickSearchViewModel.selectedbillStatus() ? self.vendorBillQuickSearchViewModel.selectedbillStatus() : -1;
            self.vendorBillQuickSearchParam.SortField = self.sortCol();
            self.vendorBillQuickSearchParam.SortOrder = self.sorttype();
            self.vendorBillQuickSearchParam.IsPurchaseOrder = refEnums.Enums.SearchTransactionType.VendorBills;
        };
        VendorBillMainEditViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = false;
            grOption.showPageSize = true;
            grOption.UIGridID = ko.observable("VendorBillGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.sortedColumn = {
                columnName: "BOLNumber",
                order: "desc"
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
            grOption.enableSaveGridSettings = true;
            grOption.useClientSideFilterAndSort = false;
            grOption.showColumnMenu = true;

            return grOption;
        };

        VendorBillMainEditViewModel.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;

            // For ProNumber
            var proCellTemplate = '<a style="cursor: pointer" data-bind="text: $parent.entity[\'PRONo\'], click: function() { $userViewModel.onProNumberClick($parent.entity) }" />';

            colDefinition = [
                { field: 'PRONo', displayName: 'PRO#', cellTemplate: proCellTemplate, width: 100 },
                { field: 'BillDateDisplay', displayName: 'Date', width: 100, isRemovable: false },
                { field: 'BOLNumber', displayName: 'BOL#', isRemovable: false, width: 95 },
                { field: 'VendorBillId', displayName: 'Id', isRemovable: false, visible: false, width: 95 },
                { field: 'SalesOrderId', displayName: 'Shipment Id', isRemovable: false, visible: false, width: 120 },
                { field: 'CustomerBOLNumber', displayName: 'Customer BOL', visible: false, isRemovable: true, width: 125 },
                { field: 'CarrierName', displayName: 'Carrier', isRemovable: false, width: 190 },
                { field: 'ShipperName', displayName: 'Shipper', width: 185 },
                { field: 'ConsigneeName', displayName: 'Consignee', width: 185 },
                { field: 'Origin', displayName: 'Origin', width: 85 },
                { field: 'Destination', displayName: 'Destination', width: 85 },
                { field: 'Amount', displayName: 'Amount', width: 80, cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
                { field: 'BillStatusDisplay', displayName: 'Bill Status', cellTemplate: refEnums.Enums.GridCellFormatTemplates.BillStatusTextTemplate, width: 116, isRemovable: false }
            ];

            return colDefinition;
        };

        VendorBillMainEditViewModel.prototype.load = function (dataToBind) {
            if (!dataToBind)
                return;

            var self = this;
            if (dataToBind.isQuickSearch) {
                self.vendorBillQuickSearchViewModel.bolNumber(dataToBind.quickSearch.BolNumber);
                self.vendorBillQuickSearchViewModel.poNumber(dataToBind.quickSearch.PoNumber);
                self.vendorBillQuickSearchViewModel.proNumber(dataToBind.quickSearch.ProNumber);
                self.vendorBillQuickSearchViewModel.vendorNameSearchList.name(new refVendorNameSearch.Models.VendorNameSearch());
                self.vendorBillQuickSearchViewModel.vendorNameSearchList.vendorName(dataToBind.quickSearch.VendorName);
                self.vendorBillQuickSearchViewModel.selectedbillStatus(dataToBind.quickSearch.ProcessStatus === -1 ? 0 : dataToBind.quickSearch.ProcessStatus);
            }
            self.callGetSearchData();
        };

        //## function to expand the view by ID, if any case we required
        VendorBillMainEditViewModel.prototype.expandView = function (viewId) {
            if (!$('#' + viewId).hasClass('in')) {
                $('#' + viewId).addClass('in');
                $('#' + viewId).css("height", 'auto');
                $('#Achor' + viewId).removeClass('collapsed');
            }
        };

        //## function to collapse the items view by ID, if any case we required
        VendorBillMainEditViewModel.prototype.collapseView = function (viewId) {
            $('#' + viewId).removeClass('in');
            $('#' + viewId).css("height", '0');
            $('#Achor' + viewId).addClass('collapsed');
            $('#collapseAddress').css("overflow", "hidden");
        };

        //#endregion
        //#region Life Cycle Event
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        VendorBillMainEditViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
            var self = this;

            //Using Document Key press for search result on enter key press
            document.onkeypress = function (event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode === 13) {
                    $('#btnSearch').focus();
                    self.getSearchData();
                    return false;
                }
            };
        };

        VendorBillMainEditViewModel.prototype.activate = function () {
            return true;
        };

        VendorBillMainEditViewModel.prototype.deactivate = function () {
            var self = this;
            self.fillSearchDetail();
            var data = {
                isQuickSearch: self.isQuickSearch,
                quickSearch: self.vendorBillQuickSearchParam,
                extendedSearch: self.vendorBillSearchParam
            };
            _app.trigger("registerMyData", data);

            // Remove the event registration from Document
            document.onkeypress = undefined;

            self.cleanup();
        };

        VendorBillMainEditViewModel.prototype.beforeBind = function () {
            var self = this;
            _app.trigger("loadMyData", function (data) {
                if (data) {
                    self.load(data);
                } else {
                    //_app.trigger("closeActiveTab");
                    //_app.trigger("NavigateTo", 'Home');
                }
            });
        };
        VendorBillMainEditViewModel.prototype.compositionComplete = function (view, parent) {
            $("#txtproNumber").focus();
        };

        VendorBillMainEditViewModel.prototype.cleanup = function () {
            var self = this;

            self.reportContainer.cleanup("VendorBillGrid");
            self.vendorBillQuickSearchViewModel.cleanup();
            for (var prop in self) {
                if (prop != "cleanup")
                    delete self[prop];
            }
            delete self;
        };
        return VendorBillMainEditViewModel;
    })();

    return VendorBillMainEditViewModel;
});
