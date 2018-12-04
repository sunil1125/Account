/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'services/models/common/Enums', 'durandal/system', 'templates/optionButtonControl', 'templates/dateRangeFilter', 'services/models/GridSettings/UserGridSetting', 'services/models/GridSettings/ColumnDefinition', 'services/client/UserClient', 'durandal/app', 'templates/verticalGrid', 'services/client/CommonClient'], function(require, exports, __refEnums__, __refSystem__, __refOptionButtonControl__, __refdateFilterControl__, __refUserGridSetting__, __refKoColumnDefinition__, __refUserClient__, ___app__, __refVerticalGrid__, __refCommon__) {
    /** <summary>
    ** Export Control View Model
    ** </summary>
    ** <createDetails>proNumber
    ** <id> </id> <by>Sankesh Poojari</by> <date>April 4, 2013</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>DE22081</id> <by>Shreesha Adiga</by> <date>07-03-2016</date> <description>Delay time out for download.</description>
    ** <id>US25144</id> <by>Shreesha Adiga</by> <date>13-10-2016</date> <description>Added enableColumnResize to GridOptions</description>
    ** <id>US24968</id> <by>Janakiram</by> <date>21-10-2016</date> <description> Re- Assigning Grid Columns to get latest columns to show in filter</description>
    ** </changeHistory>
    */
    //#region references
    /// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
    /// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
    /// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
    /// <reference path="../../Scripts/TypeDefs/google.maps.d.ts" />
    /// <reference path="../../Scripts/TypeDefs/common.d.ts" />
    ///// <reference path="../services/models/TypeDefs/ReportModels.d.ts" />
    /// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
    /// <reference path="../../Scripts/TypeDefs/ko-grid.d.ts" />
    /// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
    /// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
    //#endregion
    //#region Import
    var refEnums = __refEnums__;
    var refSystem = __refSystem__;
    var refOptionButtonControl = __refOptionButtonControl__;
    var refdateFilterControl = __refdateFilterControl__;
    
    var refUserGridSetting = __refUserGridSetting__;
    var refKoColumnDefinition = __refKoColumnDefinition__;
    var refUserClient = __refUserClient__;

    //import refNokiaMapVM = require('templates/GeneralMapExtended');
    var _app = ___app__;
    var refVerticalGrid = __refVerticalGrid__;
    var refCommon = __refCommon__;

    //#endregion
    //#region enum
    /*
    Export options.
    */
    (function (ExportOptions) {
        ExportOptions[ExportOptions["CSV"] = 0] = "CSV";
        ExportOptions[ExportOptions["EXCEL"] = 1] = "EXCEL";
        ExportOptions[ExportOptions["PDF"] = 2] = "PDF";
        ExportOptions[ExportOptions["FILTER"] = 3] = "FILTER";
    })(exports.ExportOptions || (exports.ExportOptions = {}));
    var ExportOptions = exports.ExportOptions;

    (function (DataTypes) {
        DataTypes[DataTypes["String"] = 0] = "String";
        DataTypes[DataTypes["DateTime"] = 1] = "DateTime";
        DataTypes[DataTypes["Numeric"] = 2] = "Numeric";
        DataTypes[DataTypes["Boolean"] = 3] = "Boolean";
    })(exports.DataTypes || (exports.DataTypes = {}));
    var DataTypes = exports.DataTypes;

    //#endregion
    //#region Classes
    //Header options for report viewer control
    var ReportHeaderOption = (function () {
        function ReportHeaderOption() {
        }
        return ReportHeaderOption;
    })();
    exports.ReportHeaderOption = ReportHeaderOption;

    //grid configuration parameters
    var ReportGridOption = (function () {
        function ReportGridOption() {
            this.displaySelectionCheckbox = false;
            this.selectWithCheckboxOnly = true;
            this.multiSelect = true;
            this.selectedItems = ko.observableArray();
            this.useExternalFilter = true;
            this.useExternalSorting = true;
            this.resetGridSettingsVisibility = true;
            this.isColMenuDisabled = false;
            this.enableSaveGridSettings = true;
            this.enableSelectiveDisplay = true;
            this.showGridSearchFilter = true;
            this.showPageSize = true;
            // ##START: US25144
            this.enableColumnResize = true;
        }
        return ReportGridOption;
    })();
    exports.ReportGridOption = ReportGridOption;

    var ReportAction = (function () {
        function ReportAction() {
        }
        return ReportAction;
    })();
    exports.ReportAction = ReportAction;

    var ReportExportControl = (function () {
        //hidePopover: () => any;
        function ReportExportControl(exportOpt, exportGraphToPDFOption) {
            this.exportOptionList = ko.observableArray(null);
            this.exportGraphToPDF = ko.observable(false);
            var self = this;

            if (refSystem.isBoolean(exportGraphToPDFOption))
                self.exportGraphToPDF(exportGraphToPDFOption);

            self.exportOptionList(exportOpt());

            self.getImageUrl = function (exportOpt) {
                if (exportOpt.exportType == ExportOptions.CSV) {
                    if (exportOpt.enabled())
                        return "content/images/csv_enabled.png?";
else
                        return "content/images/csv_disabled.png?";
                }
                if (exportOpt.exportType == ExportOptions.EXCEL) {
                    if (exportOpt.enabled())
                        return "content/images/xls_enabled.png?";
else
                        return "content/images/xls_disabled.png?";
                }
                if (exportOpt.exportType == ExportOptions.PDF) {
                    if (exportOpt.enabled())
                        return "content/images/pdf_enabled.png?";
else
                        return "content/images/pdf_disabled.png?";
                }
                if (exportOpt.exportType == ExportOptions.FILTER) {
                    if (exportOpt.enabled())
                        return "content/images/filter_enabled.png?";
else
                        return "content/images/filter_disabled.png?";
                }
            };
            self.Onerrorfunc = function (exportOpt, event) {
                var errorEvent = event;

                //this is to add the alt instead of image path
                var target = errorEvent.target;
                var src = "";
                if (exportOpt.exportType == ExportOptions.CSV) {
                    if (exportOpt.enabled())
                        src = "content/images/csv_enabled.png?";
else
                        src = "content/images/csv_disabled.png?";
                }
                if (exportOpt.exportType == ExportOptions.EXCEL) {
                    if (exportOpt.enabled())
                        src = "content/images/xls_enabled.png?";
else
                        src = "content/images/xls_disabled.png?";
                }
                if (exportOpt.exportType == ExportOptions.PDF) {
                    if (exportOpt.enabled())
                        src = "content/images/pdf_enabled.png?";
else
                        src = "content/images/pdf_disabled.png?";
                }
                if (exportOpt.exportType == ExportOptions.FILTER) {
                    if (exportOpt.enabled())
                        src = "content/images/filter_enabled.png?";
else
                        src = "content/images/filter_disabled.png?";
                }
                jQuery(errorEvent.target).attr("src", src);
            };
            self.showSpinner = function () {
                //alert("here");
                var isShown = false;
                self.exportOptionList().forEach(function (item) {
                    if (item.enabled() == false)
                        isShown = true;
                });
                return isShown;
            };

            //self.hidePopover = function () {
            //	$('.filterenabled + .popover ').hide;
            //};
            function getApplicationURI() {
                var appURL = window.location.protocol + '//' + window.location.hostname;

                if (window.location.port != "")
                    appURL += ":" + window.location.port;

                appURL += window.location.pathname;

                return (appURL);
            }

            self.onClickGenerateReport = function (exportOpt) {
                exportOpt.enabled(false);

                ///###START: DE22081
                var timeOutDuration = 0;
                if (typeof Utils.Constants.DelayForFileDownload !== "undefined")
                    timeOutDuration = parseInt(Utils.Constants.DelayForFileDownload);

                if (exportOpt.exportType == 3) {
                    var leftMargin, topMargin;
                    var evt;

                    var index = 0;

                    if (exportOpt.index) {
                        index = +exportOpt.index;
                    }

                    if (typeof (event) === 'undefined') {
                        var id = document.getElementById("divExportControlFilter");
                        leftMargin = id.offsetLeft - $($('.filter')[index]).width() + 71;
                        topMargin = id.offsetTop + 30;
                    } else {
                        // 10 and 25 is the height and width of the filter icon
                        leftMargin = $(event.target)[0].offsetLeft - $($('.filter')[index]).width() + 25;
                        topMargin = $(event.target)[0].offsetTop + 30;
                    }

                    $($('.filter')[index]).css({ display: "block", top: topMargin + "px", left: leftMargin + "px" });
                    $($('.filter')[index]).show();
                    exportOpt.enabled(true);
                } else {
                    window.ga('send', 'event', 'button', 'click', window.location.hash + '/Download/' + exportOpt.name());
                    if (refSystem.isFunction(self.getUrl)) {
                        var resultCalback = self.getUrl(exportOpt);

                        if (resultCalback && resultCalback.done) {
                            resultCalback.done(function (url, result) {
                                if (url == "No Data") {
                                    var toastrOptions = {
                                        toastrPositionClass: "toast-top-middle",
                                        delayInseconds: 15,
                                        fadeOut: 15,
                                        typeOfAlert: "",
                                        title: ""
                                    };
                                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.ThereAreNoRecordsPresentToBeDownloaded, "success", null, toastrOptions);

                                    exportOpt.enabled(true);
                                } else {
                                    //var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
                                    exportOpt.enabled(false);
                                    var encodedUrl = encodeURI(url);

                                    ///###START: DE22081
                                    setTimeout(function () {
                                        window.location.href = getApplicationURI() + 'documentViewer/DownloadReport?FileLocationURL=' + encodedUrl;
                                    }, timeOutDuration);

                                    ///###END: DE22081
                                    window.setTimeout(function () {
                                        exportOpt.enabled(true);
                                    }, 2000);
                                    //ajax.get(url)
                                    //	.done((data) => {
                                    //		window.location.href = getApplicationURI() + 'documentViewer/DownloadReport?FileLocationURL=' + data;
                                    //		exportOpt.enabled(true);
                                    //	})
                                    //	.fail((arg) => {
                                    //		_app.showDialog('templates/messageBox', { title: "Alert", message: arg }, 'slideDown');
                                    //		exportOpt.enabled(true);
                                    //	});
                                }
                            });
                        } else if (resultCalback && refSystem.isObject(resultCalback)) {
                            if (resultCalback.FilterModel && resultCalback.ExportURL) {
                                //var urldocumentViewer = getApplicationURI() + "documentViewer/DownloadElasticReport";
                                var urldocumentViewer = "documentViewer/DownloadElasticReport";
                                var ajax = new Simplex.AjaxConnection(getApplicationURI());

                                if (resultCalback) {
                                    resultCalback.FilterModel.ExportURL = resultCalback.ExportURL;
                                    ajax.post(urldocumentViewer, resultCalback.FilterModel).done(function (message) {
                                        exportOpt.enabled(true);
                                        if (message && message !== '') {
                                            var downloadElasticSearchURL = getApplicationURI() + message;

                                            ///###START: DE22081
                                            setTimeout(function () {
                                                window.location.href = downloadElasticSearchURL;
                                            }, timeOutDuration);
                                            ///###END: DE22081
                                        }
                                    }).fail(function (message) {
                                        console.log(message);
                                        exportOpt.enabled(true);
                                    });
                                }
                            }
                        } else {
                            var Url = resultCalback;
                            if (Url == "No Data") {
                                var toastrOptions = {
                                    toastrPositionClass: "toast-top-middle",
                                    delayInseconds: 15,
                                    fadeOut: 15,
                                    typeOfAlert: "",
                                    title: ""
                                };

                                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.ThereAreNoRecordsPresentToBeDownloaded, "success", null, toastrOptions);

                                exportOpt.enabled(true);
                            } else {
                                refCommon.Common.prototype.ExecuteURL(Url, function (message) {
                                    if (message && message !== '') {
                                        var endURLToDownLoad = getApplicationURI() + 'DocumentViewer//DownloadReportFromDocumnetManagment//?fileRelativePath=' + encodeURI(message);

                                        ///###START: DE22081
                                        setTimeout(function () {
                                            window.location.href = endURLToDownLoad;
                                        }, timeOutDuration);
                                        ///###END: DE22081
                                    }
                                    window.setTimeout(function () {
                                        exportOpt.enabled(true);
                                    }, 2000);
                                }, function (errormessage) {
                                    var toastrOptions = {
                                        toastrPositionClass: "toast-top-middle",
                                        delayInseconds: 15,
                                        fadeOut: 15,
                                        typeOfAlert: "",
                                        title: ""
                                    };

                                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, errormessage, "error", null, toastrOptions);

                                    window.setTimeout(function () {
                                        exportOpt.enabled(true);
                                    }, 2000);
                                });
                            }
                        }
                    } else {
                        var toastrOptions1 = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 2,
                            typeOfAlert: "",
                            title: ""
                        };

                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.ReportGenerateUrlHasNotBeenSet, "info", null, toastrOptions1);
                        //_app.showDialog('templates/messageBox', { title: "Alert", message: "Report generate url has not been set." }, 'slideDown');
                    }
                }
            };
        }
        return ReportExportControl;
    })();
    exports.ReportExportControl = ReportExportControl;

    var ReportViewerControlV2 = (function () {
        //#endregion}
        //#region Constructor
        function ReportViewerControlV2(header, grid, orientation) {
            //#region Class Properties
            this.reportUIDBGridId = "";
            this.isLoadingFirstTime = true;
            this.reportControlId = ko.observable('');
            this.listProgress = ko.observable(false);
            this.reportHeader = ko.observable('');
            this.gridTitleHeader = ko.observable('');
            this.createdBy = ko.observable('');
            this.preparedOn = ko.observable('');
            this.viewSelector = null;
            this.dateFilter = null;
            this.context = null;
            this.enableDateSelection = ko.observable(true);
            this.reportExport = null;
            this.isSearchText = ko.observable(false);
            //#region Optional Filters on Optional Header Row
            //#region Dimension1
            this.showDimension1Option = ko.observable(false);
            this.showDimension1List = ko.observable(false);
            this.dimension1Option = ko.observable(null);
            this.selectedDimension1Item = ko.observable(-1);
            this.seletedDimension1ItemName = ko.observable('');
            //#endregion
            //#region Dimension2
            this.showDimension2Option = ko.observable(false);
            this.showDimension2List = ko.observable(false);
            this.dimension2Option = ko.observable(null);
            this.selectedDimension2Item = ko.observable(-1);
            this.seletedDimension2ItemName = ko.observable('');
            //#endregion
            //#endregion
            //#region Optional Filters on Optional Header Row
            //#region Filter1
            this.showFilter1Option = ko.observable(false);
            this.filter1Option = ko.observable(null);
            this.selectedFilter1Item = ko.observable(-1);
            //#endregion
            //#region Filter2
            this.showFilter2Option = ko.observable(false);
            this.filter2Option = ko.observable(null);
            this.selectedFilter2Item = ko.observable(-1);
            //#endregion
            //#region Filter3
            this.showFilter3Option = ko.observable(false);
            this.filter3Option = ko.observable(null);
            this.selectedFilter3Item = ko.observable(-1);
            //#endregion
            //#region Filter4
            this.showFilter4Option = ko.observable(false);
            this.filter4Option = ko.observable(null);
            this.selectedFilter4Item = ko.observable('');
            //#endregion
            //#endregion
            //#region ActionButton
            this.showActionButton1 = ko.observable(false);
            this.showActionButton2 = ko.observable(false);
            this.showActionButton3 = ko.observable(false);
            this.actionButton1 = ko.observable(null);
            this.actionButton2 = ko.observable(null);
            this.actionButton3 = ko.observable(null);
            //#endregion Action Button
            //#region Grid Variables
            this.showOptionalHeaderRow = ko.observable(false);
            this.OptionalHeaderRowLocation = ko.observable('');
            this.userClient = new refUserClient.UserClient();
            //#endregion
            //#region variables
            this.filterDateFrom = '';
            this.filterDateTo = '';
            this.pageIndex = ko.observable(1);
            this.sortedColumnIndex = 1;
            this.showGridSearchFilter = ko.observable(true);
            this.enableSelectiveDisplay = ko.observable(true);
            this.showMap = ko.observable(false);
            this.showGrid = ko.observable(true);
            this.showGraph = ko.observable(false);
            this.gridOrientation = ko.observable('Horizontal');
            this.verticalGridObject = null;
            this.setTheHeigthOfGrid = ko.observable();
            this.callForDataHasBeenMade = ko.observable(null);
            //GetOperatorTypes: (dataType: DataTypes) => Array<any>;
            //serviceTypes: KnockoutObservableArray<any> = ko.observableArray([]);
            //selectedserviceType: KnockoutObservable<any> = ko.observable();
            //operatorTypes: KnockoutObservableArray<any> = ko.observableArray([]);
            //selectedOperatorType: KnockoutObservable<any> = ko.observable();
            //#endregion
            //#region map variables
            this.myMap = ko.observable({
                lat: ko.observable(36.59501083000102),
                lng: ko.observable(-97.33158886957427)
            });
            //private mapVM: KnockoutObservable<refNokiaMapVM.GeneralMapExtended> = ko.observable();
            // ###START: US26560
            this.isEnable = ko.observable(true);
            // ###END: US26560
            //#endregion
            this.isAttachedToView = ko.observable(false);
            /**
            * Variable to decide the subscription events to fire.
            */
            this.allowsubscription = true;
            /**
            Event to trigger on selection changed of options.
            Assign a callback function, which requires to call on selection change of options.
            */
            this.onActionButton1Clicked = null;
            this.onActionButton2Clicked = null;
            this.onActionButton3Clicked = null;
            var CommonUtils = new Utils.Common();
            var self = this;
            self.reportColumnFilter = new ReportColumnFilter(grid.columnDefinition, function () {
                self.onFilterChange.apply(null, [self.getReportActions()]);
            });

            if (orientation) {
                self.gridOrientation(orientation);
                self.verticalGridObject = new refVerticalGrid.VerticalGrid();
                self.verticalGridObject.sortInfo.subscribe(function (newValue) {
                    if (self.pagingOptions.currentPage() !== 1) {
                        self.callForDataHasBeenMade(true);
                        self.pagingOptions.currentPage(1);
                    }
                    self.gridOptions.sortInfo(newValue);
                });

                self.verticalGridObject.paginationHappened.subscribe(function (newValue) {
                    if (newValue != 0) {
                        self.pagingOptions.currentPage(newValue);
                    }
                });
            }

            //#endregion
            //#region Generic Map assignment
            //var generalMap = new refNokiaMapVM.GeneralMapExtended(true);
            //generalMap.mapViewContext.onSelectionChanged = () => { self.onChange(self); };
            //this.mapVM(generalMap);
            self.placeHolderText = "Search this grid";

            //#endregion
            //#region Export control functionality
            self.onViewSelectorChanged = function (action) {
                if (action.id === 0) {
                    $(".exportControl").css("margin-right", "110px");
                    self.onChange(self);
                    self.showGrid(true);
                    self.showMap(false);
                    self.showGraph(false);
                } else if (action.id == 1) {
                    $(".exportControl").css("margin-right", "110px");
                    self.showMap(true);

                    //if (self.mapVM() && !self.mapVM().isLoaded) {
                    //    self.mapVM().initializeMap('nokia-map-canvas');
                    //}
                    self.showGrid(false);
                    self.showGraph(false);
                    self.onChange(self);
                } else {
                    $(".exportControl").css("margin-right", "7px");
                    self.onChange(self);
                    self.showGraph(true);
                    self.showGrid(false);
                    self.showMap(false);
                }
            };

            if (refSystem.isObject(header.reportExportOptions)) {
                self.reportExport = header.reportExportOptions;
            }

            //#endregion
            //#region sub-control events registration functionality
            self.onOptionSelectionChanged = function (action) {
                self.onChange(self);
            };

            self.defaultSortInfo = ko.observable({
                column: { field: grid.sortedColumn.columnName },
                direction: grid.sortedColumn.order
            });

            self.defaultColumnDefinition = ko.observableArray(grid.columnDefinition);

            self.onDateFilterClick = function (dateFilter) {
                if (refSystem.isObject(dateFilter)) {
                    self.filterDateFrom = dateFilter.fromDate;
                    self.filterDateTo = dateFilter.toDate;

                    self.onChange(self);
                }
            };

            self.onDateFilterChanged = function (dateFilter) {
                if (refSystem.isObject(dateFilter)) {
                    if (self.verticalGridObject) {
                        if (self.verticalGridObject.resetPaginationCount())
                            self.verticalGridObject.resetPaginationCount(false);
else
                            self.verticalGridObject.resetPaginationCount(true);
                    }
                    self.filterDateFrom = dateFilter.fromDate;
                    self.filterDateTo = dateFilter.toDate;

                    if (refSystem.isObject(self.pagingOptions) && refSystem.isObject(self.pagingOptions.currentPage))
                        self.pagingOptions.currentPage(1);
                    if (refSystem.isObject(self.pagingOptions) && refSystem.isObject(self.pagingOptions.pageSize))
                        self.pagingOptions.pageSize(self.pagingOptions.pageSize());
                    self.onChange(self);
                }
            };

            if (header != null) {
                self.reportControlId(header.controlId != '' && header.controlId != undefined ? header.controlId : 'ReportControlContainer');
            }

            if (header != null && header.reportHeader != '') {
                self.reportHeader(header.reportHeader);
            }

            if (header != null && header.gridTitleHeader != '') {
                self.gridTitleHeader(header.gridTitleHeader);
            }

            if (header != null && header.createdBy != '') {
                self.createdBy(header.createdBy);
            }

            if (header != null && header.preparedOn != '') {
                self.preparedOn(header.preparedOn);
            } else {
                var curDatetime = function () {
                    var today = new Date(new Date().getTime() + (-12.5) * 3600 * 1000);

                    var TimeAMorPM = today.toLocaleTimeString().slice(today.toLocaleTimeString().length - 2, today.toLocaleTimeString().length);
                    var monthFormat = (today.getMonth() + 1) > 9 ? (today.getMonth() + 1).toString() : '0' + (today.getMonth() + 1).toString();
                    var dateFormat = (today.getDate()) > 9 ? (today.getDate()).toString() : '0' + (today.getDate()).toString();
                    var hoursFormat = (today.getHours()) > 9 ? (today.getHours()).toString() : '0' + (today.getHours()).toString();
                    var minsFormat = (today.getMinutes()) > 9 ? (today.getMinutes()).toString() : '0' + (today.getMinutes()).toString();

                    var compdateformat = monthFormat + '/' + dateFormat + '/' + today.getFullYear();

                    var timeformat = hoursFormat + ":" + minsFormat + TimeAMorPM;
                    var todaysDay = today.toString().slice(0, 3);
                    var formattedDate = todaysDay + ".  " + compdateformat + "    " + timeformat + "  PST";

                    return formattedDate;
                    //return today.toGMTString();
                };

                self.preparedOn(curDatetime());
            }

            //#endregion Report Header
            //#region Various (List / Chart / Map) View modes assignment related functionality
            var viewOptions = new Array();
            if (header.viewSelectorGrid != null && header.viewSelectorGrid.visible) {
                viewOptions.push({ id: 0, name: header.viewSelectorGrid.title, selected: header.viewSelectorGrid.selected, isIconButton: true, iconClassName: 'icon-gridlist', showTooltip: true });
            }

            if (header.viewSelectorGraph != null && header.viewSelectorGraph.visible) {
                viewOptions.push({ id: 2, name: header.viewSelectorGraph.title, selected: header.viewSelectorGraph.selected, isIconButton: true, iconClassName: 'icon-gridcal', showTooltip: true });
            }

            if (header.viewSelectorMap != null && header.viewSelectorMap.visible) {
                viewOptions.push({ id: 1, name: header.viewSelectorMap.title, selected: header.viewSelectorMap.selected, isIconButton: true, iconClassName: 'icon-gridmap', showTooltip: true });
            }

            var argsViewOptions = {
                options: viewOptions,
                useHtmlBinding: false
            };

            if (viewOptions.length > 0) {
                self.viewSelector = new refOptionButtonControl.OptionButtonControl(argsViewOptions);
                self.viewSelector.onSelectionChanged = self.onViewSelectorChanged;
            } else
                self.viewSelector = null;

            if (refSystem.isObject(header.dateFilterOptions) && header.dateFilterOptions != undefined) {
                self.dateFilter = new refdateFilterControl.DateRangeFilter(header.dateFilterOptions, self.onDateFilterChanged, self.onDateFilterClick);

                if (refSystem.isBoolean(header.dateFilterOptions.enableDateSelection)) {
                    self.enableDateSelection(header.dateFilterOptions.enableDateSelection);
                }
            }

            //#endregion
            //#region methods to fill the data from implementing page
            self.setAgingTimeFrame = function (timeframeKey, allowsubscribe) {
                var subscribtion = self.allowsubscription;
                if (!refSystem.isString(timeframeKey) && !timeframeKey) {
                    throw new Error('Invalid aging time frame key!');
                }
                if (refSystem.isBoolean(allowsubscribe)) {
                    self.allowsubscription = allowsubscribe;
                } else {
                    throw new Error('Given aging time frame key is not exist in the time frame list!');
                }
                self.allowsubscription = subscribtion;
            };

            self.fillDateFilter = function (dateFilterOptions, allowsubscribe) {
                var subscribtion = self.allowsubscription;
                if (!refSystem.isObject(dateFilterOptions)) {
                    throw new Error('Invalid date filter options!');
                }
                if (refSystem.isBoolean(allowsubscribe)) {
                    self.allowsubscription = allowsubscribe;
                }
                switch (dateFilterOptions.selectedFilterType) {
                    case refEnums.Enums.DateFilterType.Timeframe:
                        self.dateFilter.setTimeFrame(dateFilterOptions.selectedValueId);
                        break;
                    case refEnums.Enums.DateFilterType.DateRangePicker:
                        self.filterDateFrom = dateFilterOptions.fromDate;
                        self.filterDateTo = dateFilterOptions.toDate;
                        self.dateFilter.fillDateFilter(dateFilterOptions, false);
                        break;
                }
                self.allowsubscription = subscribtion;
            };

            //#endregion
            //#region Dimension Options Assignment functionality
            self.toggleDimension1Option = function (context, jqueryEvents) {
                self.showDimension1List(!self.showDimension1List());

                if (self.showDimension1List()) {
                    $("#" + self.reportControlId()).find("#dimensionList1").css('left', (jqueryEvents.pageX - 30) + 'px').css('top', (jqueryEvents.pageY + 20) + 'px');
                }
                console.log(jqueryEvents);
            };

            self.toggleDimension2Option = function (context, jqueryEvents) {
                if (!self.showDimension2List() && self.selectedDimension1Item() <= 0) {
                    return;
                }
                self.showDimension2List(!self.showDimension2List());
                if (self.showDimension2List()) {
                    $("#" + self.reportControlId()).find("#dimensionList2").css('left', (jqueryEvents.pageX - 30) + 'px').css('top', (jqueryEvents.pageY + 20) + 'px');
                }
            };

            if (refSystem.isObject(header.dimension1Options)) {
                self.dimension1Option(header.dimension1Options);
                self.showDimension1Option((self.dimension1Option().dimensionItemList) ? true : false);
                self.showDimension1List(false);

                if (self.dimension1Option().dimensionItemList) {
                    if (refSystem.isBoolean(self.dimension1Option().isCustomColumnHeader) == false || self.dimension1Option().isCustomColumnHeader == false)
                        self.showOptionalHeaderRow(true);

                    if (self.dimension1Option().defaultDimensionSelected != undefined) {
                        self.selectedDimension1Item(self.dimension1Option().defaultDimensionSelected);
                    } else
                        self.selectedDimension1Item(-1);
                } else
                    self.showDimension1Option(false);
            }
            ;

            self.selectedDimension1Item.subscribe(function (newValue) {
                if (self.allowsubscription) {
                    if (self.dimension1Option().resetOtherDimensions != undefined && self.dimension1Option().resetOtherDimensions == true) {
                        self.selectedDimension2Item(-1);
                    }
                    if (refSystem.isFunction(self.onDimension1ItemSelectionChanged)) {
                        self.onFilterChange.apply(null, [self.getReportActions()]);
                    } else
                        self.onChange(self);
                }
                self.allowsubscription = true;
                //}
            });

            if (refSystem.isObject(header.dimension2Options)) {
                self.dimension2Option(header.dimension2Options);
                self.showDimension2Option((self.dimension2Option().dimensionItemList) ? true : false);
                self.showDimension2List(false);

                if (self.dimension2Option().dimensionItemList) {
                    if (refSystem.isBoolean(self.dimension2Option().isCustomColumnHeader) == false || self.dimension2Option().isCustomColumnHeader == false)
                        self.showOptionalHeaderRow(true);

                    if (self.dimension2Option().defaultDimensionSelected != undefined) {
                        self.selectedDimension2Item(self.dimension2Option().defaultDimensionSelected);
                    } else
                        self.selectedDimension2Item(-1);
                } else
                    self.showDimension2Option(false);
            }
            ;

            self.selectedDimension2Item.subscribe(function (newValue) {
                if (self.allowsubscription) {
                    if (self.dimension2Option().resetOtherDimensions != undefined && self.dimension2Option().resetOtherDimensions == true) {
                        self.selectedDimension2Item(-1);
                    }
                    if (refSystem.isFunction(self.onDimension2ItemSelectionChanged)) {
                        self.onFilterChange.apply(null, [self.getReportActions()]);
                    } else
                        self.onChange(self);
                }
                self.allowsubscription = true;
                //}
            });

            //#endregion
            //#endregion Dimension Options assignment
            //#region Filter Options
            //#region Filter1 options functionality
            self.configureActionButtons(self, header);

            if (refSystem.isObject(header.filter1Options)) {
                self.filter1Option(header.filter1Options);
                self.showFilter1Option((self.filter1Option().filterList) ? true : false);

                if (self.filter1Option().filterList) {
                    self.showFilter1Option(true);

                    if (refSystem.isBoolean(self.filter1Option().isCustomColumnHeader) == false || self.filter1Option().isCustomColumnHeader == false)
                        self.showOptionalHeaderRow(true);

                    if (self.filter1Option().defaultItemSelected != undefined) {
                        self.selectedFilter1Item(self.filter1Option().defaultItemSelected);
                    } else
                        self.selectedFilter1Item(-1);
                } else
                    self.showFilter1Option(false);
            }
            ;

            self.selectedFilter1Item.subscribe(function (newValue) {
                if (self.allowsubscription) {
                    if (self.filter1Option().resetOtherFilters != undefined && self.filter1Option().resetOtherFilters == true) {
                        self.selectedFilter2Item(-1);
                        self.selectedFilter3Item(-1);
                        self.selectedFilter4Item('');
                    }
                    if (refSystem.isFunction(self.onFilter1ItemSelectionChanged)) {
                        self.onFilterChange.apply(null, [self.getReportActions()]);
                    } else
                        self.onChange(self);
                }
                self.allowsubscription = true;
                //}
            });

            if (refSystem.isObject(header.filter2Options)) {
                self.filter2Option(header.filter2Options);
                self.showFilter2Option((self.filter2Option().filterList) ? true : false);

                if (self.filter2Option().filterList) {
                    self.showFilter2Option(true);

                    if (refSystem.isBoolean(self.filter2Option().isCustomColumnHeader) == false || self.filter2Option().isCustomColumnHeader == false)
                        self.showOptionalHeaderRow(true);

                    if (self.filter2Option().defaultItemSelected != undefined) {
                        self.selectedFilter2Item(self.filter2Option().defaultItemSelected);
                    } else
                        self.selectedFilter2Item(-1);
                } else
                    self.showFilter2Option(false);
            }
            ;

            self.selectedFilter2Item.subscribe(function (newValue) {
                if (self.allowsubscription) {
                    if (self.filter2Option().resetOtherFilters != undefined && self.filter2Option().resetOtherFilters == true) {
                        self.selectedFilter1Item(-1);
                        self.selectedFilter3Item(-1);
                        self.selectedFilter4Item('');
                    }
                    if (refSystem.isFunction(self.onFilter2ItemSelectionChanged)) {
                        self.onFilterChange.apply(null, [self.getReportActions()]);
                    } else
                        self.onChange(self);
                }
                self.allowsubscription = true;
                //}
            });

            if (refSystem.isObject(header.filter3Options)) {
                self.filter3Option(header.filter3Options);
                self.showFilter3Option((self.filter3Option().filterList) ? true : false);

                if (self.filter3Option().filterList) {
                    self.showFilter3Option(true);

                    if (refSystem.isBoolean(self.filter3Option().isCustomColumnHeader) == false || self.filter3Option().isCustomColumnHeader == false)
                        self.showOptionalHeaderRow(true);

                    if (self.filter3Option().defaultItemSelected != undefined) {
                        self.selectedFilter3Item(self.filter3Option().defaultItemSelected);
                    } else
                        self.selectedFilter3Item(-1);
                } else
                    self.showFilter3Option(false);
            }
            ;

            self.selectedFilter3Item.subscribe(function (newValue) {
                if (newValue) {
                    if (self.allowsubscription) {
                        if (self.filter3Option().resetOtherFilters != undefined && self.filter3Option().resetOtherFilters == true) {
                            self.selectedFilter1Item(-1);
                            self.selectedFilter2Item(-1);
                            self.selectedFilter4Item('');
                        }
                        if (refSystem.isFunction(self.onFilter3ItemSelectionChanged)) {
                            self.onFilterChange.apply(null, [self.getReportActions()]);
                        } else
                            self.onChange(self);
                    }
                    self.allowsubscription = true;
                }
            });

            if (refSystem.isObject(header.filter4Options)) {
                self.filter4Option(header.filter4Options);
                self.showFilter4Option((self.filter4Option().filterList) ? true : false);

                if (self.filter4Option().filterList) {
                    self.showFilter4Option(true);
                    self.showOptionalHeaderRow(true);

                    if (self.filter4Option().defaultItemSelected != undefined) {
                        self.selectedFilter4Item(self.filter4Option().defaultItemSelected);
                    } else
                        self.selectedFilter4Item(self.filter4Option().filterList[0].Key);
                } else
                    self.showFilter4Option(false);
            }
            ;

            self.selectedFilter4Item.subscribe(function (newValue) {
                if (newValue) {
                    if (self.allowsubscription) {
                        if (self.filter4Option().resetOtherFilters != undefined && self.filter4Option().resetOtherFilters == true) {
                            self.selectedFilter1Item(-1);
                            self.selectedFilter2Item(-1);
                            self.selectedFilter3Item(-1);
                        }
                        if (refSystem.isFunction(self.onFilter4ItemSelectionChanged)) {
                            self.onFilterChange.apply(null, [self.getReportActions()]);
                        } else
                            self.onChange(self);
                    }
                    self.allowsubscription = true;
                }
            });

            if (refSystem.isObject(header.context)) {
                self.context = new refOptionButtonControl.OptionButtonControl({
                    options: header.context,
                    useHtmlBinding: false
                });

                self.dateFilter.onClick = self.onDateFilterClick;
                self.dateFilter.onSelectionChanged = self.onDateFilterChanged;
                self.context.onSelectionChanged = self.onOptionSelectionChanged;
                self.showOptionalHeaderRow(true);
            }

            if (refSystem.isBoolean(header.showReportOptionalHeaderRow) && header.showReportOptionalHeaderRow === true) {
                self.showOptionalHeaderRow(true);
            }

            if (refSystem.isString(header.showReportOptionalHeaderRowLocation) && header.showReportOptionalHeaderRowLocation !== '') {
                self.OptionalHeaderRowLocation(header.showReportOptionalHeaderRowLocation.toUpperCase() === 'BOTTOM' ? 'BOTTOM' : 'TOP');
            }

            self.OptionalHeaderRowLocation.subscribe(function (newValue) {
                if (newValue) {
                    if (newValue === 'BOTTOM') {
                        var gHeader = $("#" + self.reportControlId()).find("#gridHeader");
                        gHeader.insertBefore($("#" + self.reportControlId()).find("#gridOptionalHeader").removeClass('margin-top-10').removeClass('gridCorners'));
                    }
                    if (newValue === 'TOP') {
                        var gridOptionalHeader = $("#" + self.reportControlId()).find("#gridOptionalHeader").addClass('gridCorners margin-top-10');
                        gridOptionalHeader.insertBefore($("#" + self.reportControlId()).find("#gridHeader").removeClass('margin-top-10').removeClass('gridCorners'));
                    }
                }
            });

            if (refSystem.isObject(grid)) {
                this.configureGrid(this, grid);
            }

            self.uiGridObject = ko.observable();

            self.uiDispSetting = ko.computed(function () {
                if (self.uiGridObject()) {
                    var sortInfo = self.uiGridObject().sortInfo() ? self.uiGridObject().sortInfo() : self._sortInfo() ? self._sortInfo() : null;
                    var newUserGridSetting = new refUserGridSetting.Model.UserGridSetting({
                        GridId: self.reportHeader(),
                        Columns: ko.utils.arrayMap(self.uiGridObject().columns(), function (column) {
                            var obj = {
                                ColumnName: column.field,
                                IsVisible: column.visible(),
                                SortOrder: (sortInfo && sortInfo.column.field == column.field) ? sortInfo.direction : null
                            };
                            return obj;
                        })
                    });
                    return newUserGridSetting;
                }
                return null;
            }, self);
            //#endregion
        }
        //#endregion
        //#region Private methods
        //#region Action Button on ClickEvents
        ReportViewerControlV2.prototype.onButton1Click = function () {
            var self = this;
            window.ga('send', 'event', 'button', 'click', window.location.hash + '/onActionButton1Click');
            if (self.actionButton1) {
                self.actionButton1().isButtonClicked = true;

                if (self.onActionButton1Clicked) {
                    if (refSystem.isFunction(self.onActionButton1Clicked)) {
                        self.onActionButton1Clicked.apply(null, [self.getReportActions()]);
                        if (self.actionButton1().resetselectionOnAction) {
                            self.resetGridSelection(self);
                            //self.gridOptions.selectedItems().removeAll();
                        }
                    }
                }

                self.actionButton1().isButtonClicked = false;
                self.showActionButton1(false);
                self.showActionButton2(false);
            }
        };

        ReportViewerControlV2.prototype.onButton2Click = function () {
            var self = this;

            window.ga('send', 'event', 'button', 'click', window.location.hash + '/onActionButton2Click');
            if (self.actionButton2) {
                self.actionButton2().isButtonClicked = true;
                if (self.onActionButton2Clicked) {
                    if (refSystem.isFunction(self.onActionButton2Clicked)) {
                        self.onActionButton2Clicked.apply(null, [self.getReportActions()]);
                        if (self.actionButton2().resetselectionOnAction) {
                            self.resetGridSelection(self);
                            //self.gridOptions.selectedItems().removeAll();
                        }
                    }
                }
                self.actionButton2().isButtonClicked = false;
                self.showActionButton2(false);
                self.showActionButton1(false);
            }
        };

        ReportViewerControlV2.prototype.onButton3Click = function () {
            var self = this;

            window.ga('send', 'event', 'button', 'click', window.location.hash + '/onActionButton3Click');
            if (self.actionButton3) {
                self.actionButton3().isButtonClicked = true;

                if (self.onActionButton3Clicked) {
                    if (refSystem.isFunction(self.onActionButton3Clicked)) {
                        self.onActionButton3Clicked.apply(null, [self.getReportActions()]);
                        if (self.actionButton3().resetselectionOnAction) {
                            self.resetGridSelection(self);
                        }
                        //self.gridOptions.selectedItems().removeAll();
                    }
                }
                self.actionButton3().isButtonClicked = false;
                self.showActionButton3(false);
            }
        };

        ReportViewerControlV2.prototype.configureActionButtons = function (self, header) {
            if (refSystem.isObject(header.actionButtons1)) {
                self.actionButton1(header.actionButtons1);

                self.showActionButton1(self.getShowOrHideActionButtonOnRowSelection(header.actionButtons1));
            }

            if (refSystem.isObject(header.actionButtons2)) {
                self.actionButton2(header.actionButtons2);

                self.showActionButton2(self.getShowOrHideActionButtonOnRowSelection(header.actionButtons2));
            }

            if (refSystem.isObject(header.actionButtons3)) {
                self.actionButton3(header.actionButtons3);

                self.showActionButton3(self.getShowOrHideActionButtonOnRowSelection(header.actionButtons3));
            }
        };

        //#endregion
        //#region Methods supporting to action button events on Grid
        ReportViewerControlV2.prototype.getSelectedRows = function () {
            var self = this;
            var selRows = [];

            if (self.gridOptions) {
                self.gridOptions.selectedItems().forEach(function (item) {
                    selRows.push(item);
                });
            }
            return selRows;
        };

        ReportViewerControlV2.prototype.getReportActions = function () {
            var self = this;

            var reportAction = new ReportAction();

            if (self.viewSelector != null) {
                reportAction.view = self.viewSelector.getSelectedOptions().id;
            }

            if (self.context != null) {
                reportAction.context = self.context.getSelectedOptions().id;
            }

            reportAction.dateFrom = self.filterDateFrom ? self.filterDateFrom : new Date().toString();
            reportAction.dateTo = self.filterDateTo ? self.filterDateTo : new Date().toString();
            reportAction.sortOrder = self.sortedColumnIndex;
            reportAction.gridOptions = self.gridOptions;
            reportAction.filter1selectedItemId = self.selectedFilter1Item();
            reportAction.filter2selectedItemId = self.selectedFilter2Item();
            reportAction.filter3selectedItemId = self.selectedFilter3Item();
            reportAction.filter4selectedItemKey = self.selectedFilter4Item();

            reportAction.dimension1selectedItemId = self.selectedDimension1Item();
            reportAction.dimension2selectedItemId = self.selectedDimension2Item();

            reportAction.selectedItems = self.getSelectedRows();

            if (self.actionButton1)
                reportAction.actionButton1 = ko.unwrap(self.actionButton1());

            if (self.actionButton2)
                reportAction.actionButton2 = ko.unwrap(self.actionButton2());

            if (self.actionButton3)
                reportAction.actionButton3 = ko.unwrap(self.actionButton3());

            //reportAction.pageIndex = self.gridOptions.pagingOptions.currentPage();
            return (reportAction);
        };

        ReportViewerControlV2.prototype.getShowOrHideActionButtonOnRowSelection = function (actionButton) {
            var self = this;
            var showButton = false;
            var selectedRowCount = (refSystem.isObject(self.gridOptions) ? self.gridOptions.selectedItems().length : 0);
            if (actionButton && actionButton.buttonName() !== "") {
                if (refSystem.isFunction(actionButton.enableDisableCallBack)) {
                    showButton = actionButton.enableDisableCallBack();
                } else {
                    if (selectedRowCount > 0) {
                        showButton = (refSystem.isBoolean(actionButton.enableOnSingleSelection) ? actionButton.enableOnSingleSelection : false);
                        if (selectedRowCount > 1) {
                            showButton = (refSystem.isBoolean(actionButton.enableOnMultiSelection) ? actionButton.enableOnMultiSelection : false);
                        }
                    } else {
                        var hideButton = (refSystem.isBoolean(actionButton.hideWhenUnselected) ? actionButton.hideWhenUnselected : false);
                        if (hideButton) {
                            showButton = false;
                        } else {
                            showButton = true;
                        }
                    }
                }
            } else
                showButton = false;

            return (showButton);
        };

        //#endregion
        // This method is called if any change occurs in grid setting.
        ReportViewerControlV2.prototype.onChange = function (self) {
            var reportAction = new ReportAction();

            reportAction = self.getReportActions();

            if (self.gridOptions)
                self.gridOptions.selectedItems.removeAll();

            if (refSystem.isFunction(self.onFilterChange)) {
                //var result = self.onFilterChange.apply(null, [reportAction]);
                var calback = self.onFilterChange(reportAction);
                if (calback && calback.done) {
                    calback.done(function (result, viewNumber, reportType) {
                        if (refSystem.isObject(result) && viewNumber && reportType) {
                            if (self.viewSelector.getSelectedOptions().id === viewNumber) {
                                if (self.showMap() && result) {
                                    var markerPath = Utils.Constants.ApplicationBaseURL + 'Content/images/track_icon.png';
                                    if ((self.context && self.context.getSelectedOptions().id === 1) || reportType === 1) {
                                        markerPath = Utils.Constants.ApplicationBaseURL + 'Content/images/flag-export.png';
                                    } else if ((self.context && self.context.getSelectedOptions().id === 2) || reportType === 2) {
                                        markerPath = Utils.Constants.ApplicationBaseURL + 'Content/images/home-2.png';
                                    }
                                    //self.mapVM().fillMarker(result, markerPath);
                                }
                            }
                        }
                    });
                }
            }
        };

        ReportViewerControlV2.prototype.getUIGridId = function (enableSaveGrid) {
            var self = this;
            var UIGridId = "";

            if (self.gridOptions) {
                if (refSystem.isString(self.gridOptions.UIGridID()) && self.gridOptions.UIGridID() !== "") {
                    UIGridId = self.gridOptions.UIGridID();
                } else {
                    if (enableSaveGrid)
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 15,
                            fadeOut: 15,
                            typeOfAlert: "",
                            title: ""
                        };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.ProvideUIGridIDItIsMissing, "info", null, toastrOptions);
                }
            }
            return (UIGridId);
        };

        // Retrieving Grid setting from Database and updating columnDefs and SortInfo accordingly.
        // If any error occur while fetching the data from the database it simply calls resetGirdSettings.
        ReportViewerControlV2.prototype.GetColumnSettingsFromDB = function () {
            var self = this;
            var defaultGridColumns = new refUserGridSetting.Model.UserGridSetting({
                UserId: '',
                GridId: self.gridOptions.UIGridID(),
                Columns: ko.utils.arrayMap(self.defaultColumnDefinition(), function (column) {
                    return {
                        ColumnName: column.field,
                        IsVisible: column.visible === undefined ? true : column.visible,
                        SortOrder: self._sortInfo().columnName == column.field ? self._sortInfo().order : null,
                        isRemovable: column.isRemovable
                    };
                })
            });

            self.userClient.GetKoGridSetting(defaultGridColumns, function (data) {
                // Updating ColumnDefinition using the Data coming form Database
                self.columnDefinition(ko.utils.arrayMap(data, function (column) {
                    return new refKoColumnDefinition.Model.KoCoulmnDefinition(column, self.defaultColumnDefinition);
                }));
                self._sortInfo(refKoColumnDefinition.Model.KoCoulmnDefinition.GetSortinfo(data, self.defaultSortInfo));
                return true;
            }, function () {
                self.resetGridSettings();
            });
        };

        ReportViewerControlV2.prototype.resetGridSelection = function (self) {
            window.kg.toggleSelection(false);
        };

        //#endregion
        //#region Lifecycle event Methods
        ReportViewerControlV2.prototype.activate = function () {
            var self = this;

            if (self.gridOptions.enableSaveGridSettings === true)
                self.GetColumnSettingsFromDB();
else
                self.columnDefinition(self.defaultColumnDefinition());

            self.loadinitmap();

            return true;
        };

        ReportViewerControlV2.prototype.compositionComplete = function () {
            var self = this;
            self.isAttachedToView(true);
            $(window).trigger('resize');
        };

        ReportViewerControlV2.prototype.deactivate = function () {
            this.isAttachedToView(false);
        };

        ReportViewerControlV2.prototype.loadinitmap = function () {
            (function ($) {
                ko.bindingHandlers['map'] = {
                    update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                        var mapObj = ko.utils.unwrapObservable(valueAccessor());
                        var mapOptions = {
                            center: new google.maps.LatLng(36.59501083000102, -97.33158886957427),
                            zoom: 3,
                            disableDefaultUI: true,
                            draggableCursor: 'auto',
                            panControl: false,
                            zoomControl: true,
                            minZoom: 3,
                            maxZoom: 21,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        };
                        mapObj = new google.maps.Map($('#map')[0], mapOptions);
                    }
                };
            })(jQuery);
        };

        //#endregion
        //#region Public Method
        // Resetting Grid settings to its default value.
        // This method is also called on onClick event of "Restore to Default" button
        ReportViewerControlV2.prototype.resetGridSettings = function () {
            var self = this;
            self.columnDefinition(self.defaultColumnDefinition());
            self._sortInfo(self.defaultSortInfo());
            if ($('div').hasClass('noLeftBorder') || $('div').hasClass('noRightBorder')) {
                $('.noLeftBorder').parent().css('border-left', '0px');
                $('.noRightBorder').parent().css('border-right', '0px');
            }
        };

        // Configuring Grid object with the value provided
        ReportViewerControlV2.prototype.configureGrid = function (self, options) {
            var setPagination = function () {
                if (!self.gridOptions.fullDataObject().length) {
                    return;
                }
                var pagedData = self.gridOptions.fullDataObject.slice((self.pagingOptions.currentPage() - 1) * self.pagingOptions.pageSize(), self.pagingOptions.currentPage() * self.pagingOptions.pageSize()), fltrOptions = self.gridOptions.filterOptions;

                ko.utils.arrayForEach(pagedData, function (item) {
                    if (item.DueDate) {
                        item.DueDate = item.DueDate.match('0001-01-01T00:00:00') ? '' : moment(item.DueDate).format('MM/DD/YYYY');
                    }
                    if (item.TranDate) {
                        item.TranDate = moment(item.TranDate).format('MM/DD/YYYY');
                    }
                });

                // to set the data in report viewer control
                self.gridOptions.data.removeAll();
                self.gridOptions.data(pagedData);

                if (self.gridOptions.useClientSideFilterAndSort && (!fltrOptions || !fltrOptions.filterText() || fltrOptions.filterText().length === 0)) {
                    self.pagingOptions.totalServerItems(self.gridOptions.fullDataObject().length);
                }
                return true;
            };

            self.showGridSearchFilter(options.showGridSearchFilter);
            self.enableSelectiveDisplay(options.enableSelectiveDisplay);
            self.pagingOptions = {
                pageSizes: ko.observableArray(options.pageSizes),
                pageSize: ko.observable(options.pageSize),
                totalServerItems: ko.observable(options.totalServerItems),
                currentPage: ko.observable(options.currentPage)
            };

            self.pagingOptions.pageSizes.subscribe(function (data) {
                if (!self.gridOptions.useClientSideFilterAndSort) {
                    self.onChange(self);
                    self.isPaginationChanged = true;
                } else {
                    if (!setPagination()) {
                        self.onChange(self);
                        self.isPaginationChanged = true;
                    }
                }
            });

            self.pagingOptions.pageSize.subscribe(function (data) {
                if (refSystem.isObject(self.pagingOptions) && refSystem.isObject(self.pagingOptions.currentPage))
                    if (!self.gridOptions.useClientSideFilterAndSort) {
                        self.isPaginationChanged = true;
                        self.onChange(self);
                    } else {
                        if (!setPagination()) {
                            self.isPaginationChanged = true;
                            self.onChange(self);
                        }
                    }
            });

            /*self.pagingOptions.totalServerItems.subscribe(function (data) {
            self.onChange(self);
            });*/
            self.pagingOptions.currentPage.subscribe(function (data) {
                if (!self.gridOptions.useClientSideFilterAndSort) {
                    self.isPaginationChanged = true;
                    self.onChange(self);
                } else {
                    if (!setPagination()) {
                        self.isPaginationChanged = true;
                        self.onChange(self);
                    }
                }
            });

            self.filterOptions = {
                filterText: ko.observable("").extend({ throttle: 1000 }),
                useExternalFilter: options.useExternalFilter
            };

            self._sortInfo = ko.observable({
                column: { field: options.sortedColumn.columnName },
                direction: options.sortedColumn.order
            });

            self._triggerRestore = ko.observable(false);
            self.columnDefinition = ko.observableArray();

            self.gridOptions = {
                data: ko.observableArray(options.data),
                showGroupPanel: false,
                enablePaging: ko.observable(true),
                pagingOptions: self.pagingOptions,
                columnDefs: self.columnDefinition,
                footerVisible: true,
                displayFooter: true,
                canSelectRows: options.canSelectRows,
                displaySelectionCheckbox: options.displaySelectionCheckbox,
                showFilter: false,
                useExternalSorting: options.useExternalSorting,
                sortInfo: self._sortInfo,
                filterOptions: self.filterOptions,
                jqueryUIDraggable: options.jqueryUIDraggable,
                rowHeight: options.rowHeight ? options.rowHeight : 30,
                triggerRestore: self._triggerRestore,
                showColumnMenu: options.showColumnMenu,
                resetGridSettingsVisibility: options.resetGridSettingsVisibility,
                multiSelect: options.multiSelect,
                selectWithCheckboxOnly: options.selectWithCheckboxOnly,
                selectedItems: options.selectedItems,
                afterSelectionChange: function () {
                    return true;
                },
                viewPortOptions: options.viewPortOptions ? options.viewPortOptions : ({ isfixed: ko.observable(false), minRows: ko.observable(5), maxRows: ko.observable(10) }),
                isColMenuDisabled: options.isColMenuDisabled ? options.isColMenuDisabled : false,
                viewPortOptions: options.viewPortOptions ? options.viewPortOptions : ({ isfixed: ko.observable(false), minRows: ko.observable(5), maxRows: ko.observable(10) }),
                enableSaveGridSettings: ((refSystem.isBoolean(options.enableSaveGridSettings) ? options.enableSaveGridSettings : true)),
                selectAllState: ko.observable(false),
                UIGridID: ko.observable(options.UIGridID()),
                enableSelectiveDisplay: options.enableSelectiveDisplay,
                showPageSize: options.showPageSize,
                fullDataObject: ko.observableArray([]),
                useClientSideFilterAndSort: (options.useClientSideFilterAndSort || false),
                // ##START: US25144
                enableColumnResize: options.enableColumnResize
            };

            if (self.gridOptions.useClientSideFilterAndSort) {
                self.gridOptions.useExternalSorting = false;
                self.filterOptions.useExternalFilter = false;
            }

            self.gridOptions.sortInfo.subscribe(function (data) {
                if (!self.callForDataHasBeenMade()) {
                    if (!self.gridOptions.useClientSideFilterAndSort) {
                        if (!self.isLoadingFirstTime) {
                            self.isSortingChanged = true;
                        }

                        self.onChange(self);
                        self.isLoadingFirstTime = false;
                    }
                    ////else {
                    ////	if (!setPagination()) {
                    ////		//self.onChange(self);
                    ////	}
                    ////}
                } else {
                    self.callForDataHasBeenMade(false);
                }
            });

            self.gridOptions.triggerRestore.subscribe(function () {
                self.resetGridSettings();
            });

            //On select of checkbox the action button
            self.gridOptions.selectedItems.subscribe(function () {
                var selectedRowCount = self.gridOptions.selectedItems().length;

                if (self.actionButton1()) {
                    if (selectedRowCount > 0) {
                        self.showActionButton1(self.actionButton1().enableOnSingleSelection);
                        if (selectedRowCount > 1) {
                            self.showActionButton1(self.actionButton1().enableOnMultiSelection);
                        }
                    } else {
                        if (self.actionButton1().hideWhenUnselected === true) {
                            self.showActionButton1(false);
                        } else {
                            self.showActionButton1(true);
                        }
                    }
                }
                if (self.actionButton2()) {
                    if (selectedRowCount > 0) {
                        self.showActionButton2(self.actionButton2().enableOnSingleSelection);
                        if (selectedRowCount > 1) {
                            self.showActionButton2(self.actionButton2().enableOnMultiSelection);
                        }
                    } else {
                        if (self.actionButton2().hideWhenUnselected === true) {
                            self.showActionButton2(false);
                        } else {
                            self.showActionButton2(true);
                        }
                    }
                }

                if (self.actionButton3()) {
                    if (selectedRowCount > 0) {
                        self.showActionButton3(self.actionButton3().enableOnSingleSelection);
                        if (selectedRowCount > 1) {
                            self.showActionButton3(self.actionButton3().enableOnMultiSelection);
                        }
                    } else {
                        if (self.actionButton3().hideWhenUnselected === true) {
                            self.showActionButton3(false);
                        } else {
                            self.showActionButton3(true);
                        }
                    }
                }

                if (self.afterSelectionChange && typeof self.afterSelectionChange === 'function') {
                    self.afterSelectionChange(self.gridOptions.selectedItems());
                }
            });

            self.gridOptions.filterOptions.filterText.subscribe(function (newValue) {
                if (newValue) {
                    self.isSearchText(true);
                } else {
                    self.isSearchText(false);
                }

                if (options.useExternalFilter) {
                    self.onSearchTextChange(self, newValue);
                }
            }, self);
        };

        ReportViewerControlV2.prototype.invokeHighlight = function (searchText) {
            var self = this;

            if (searchText.length == 0) {
                $("#" + self.reportControlId()).find(".kgViewport").removeHighlight();
            } else {
                $("#" + self.reportControlId()).find(".kgViewport").highlight(searchText);
            }
        };

        // Sets the name of the creator
        ReportViewerControlV2.prototype.setCreatedBy = function (personName) {
            var self = this;
            self.createdBy(personName);
        };

        ReportViewerControlV2.prototype.updateSelectedDimension1Option = function (id, itemValue) {
            var self = this;

            self.seletedDimension1ItemName(id === 0 ? '' : itemValue);
            self.selectedDimension1Item(id);
            if (id === 0) {
                self.selectedDimension2Item(id);
                self.seletedDimension2ItemName('');
            }
            self.showDimension1List(false);
            self.showDimension2List(false);
        };

        ReportViewerControlV2.prototype.updateSelectedDimension2Option = function (id, itemValue) {
            var self = this;

            self.seletedDimension2ItemName(id === 0 ? '' : itemValue);

            self.selectedDimension2Item(id);
            self.showDimension1List(false);
            self.showDimension2List(false);
        };

        ReportViewerControlV2.prototype.ForceChange = function () {
            var self = this;
            self.onChange(self);
        };

        ReportViewerControlV2.prototype.cleanup = function (gridId) {
            var self = this;

            //delete self.uiGridObject;
            //for (var prop in self.gridOptions) {
            //	//if (typeof self[prop].dispose === 'function') {
            //	//	self[prop].dispose();
            //	//}
            //	if (ko.isObservable(self[prop])) {
            //		delete self[prop]._subscriptions;
            //	}
            //	delete self[prop];
            //}
            //$(window).off("resize");
            //$(window).off("assignGridEventHandlers");
            //$(window).off("assignEvents");
            //$(window).off("onGroupMouseDown");
            //$(window).off("setDraggables");
            //$(window).off("onRowMouseDown");
            //$(window).off("onRowDrop");
            //$(window).off("onGroupDrop");
            //$(window).off("onHeaderDrop");
            //$(window).off("onHeaderMouseDown");
            //$(window).off("setSelection");
            //$(window).off("toggleSelectAll");
            //$(window).off("ChangeSelection");
            self.gridOptions.filterOptions.filterText.extend({ validatable: false });
            self.gridOptions.data.removeAll();
            self.columnDefinition.removeAll();

            for (var prop in self.gridOptions) {
                if (prop !== "data") {
                    delete self.gridOptions[prop];
                }
            }

            for (var prop in self.gridOptions.filterOptions) {
                delete self.gridOptions.filterOptions[prop];
            }

            self.gridOptions.data.valueHasMutated();

            var gridobject = "#" + gridId + " > div";

            if (typeof ($(gridobject)[0]) !== "undefined") {
                var grid = ko.dataFor($(gridobject)[0]);

                for (var prop in grid.eventProvider) {
                    delete grid.eventProvider[prop];
                }

                for (var prop in grid) {
                    delete grid[prop];
                }
                delete grid;
            }
            //for (var prop in self) {
            //	//if (typeof self[prop].dispose === 'function') {
            //	//	self[prop].dispose();
            //	//}
            //	if (prop !== "cleanup") {
            //		delete self[prop];
            //	}
            //}
            //delete self;
        };

        ReportViewerControlV2.prototype.emptyReportContainer = function () {
            var self = this;
            //var grOption = new _reportViewer.ReportGridOption();
            //grOption.data = [];
            //grOption.columnDefinition = [];
            //grOption.sortedColumn = <_reportViewer.SortOrder> {
            //	columnName: "noteDate",
            //	order: "DESC"
            //};
            //grOption.UIGridID = ko.observable("SalesOrderPODDocGrid");
            //self.grid = grOption;
            //self.gridOptions.data([]);
            //self.columnDefinition([]);
            //console.log(self.gridOptions);
            //delete self.gridOptions.UIGridID._subscriptions;
            //delete self.afterSelectionChange;
            //delete self.gridOptions.columnDefs._subscriptions;
            //delete self.gridOptions.data._subscriptions;
            //delete self.gridOptions.filterOptions.filterText;
            //delete self.gridOptions.fullDataObject._subscriptions;
            //delete self.gridOptions.gridDim.outerHeight._subscriptions;
            //delete self.gridOptions.gridDim.outerWidth._subscriptions;
            //delete self.gridOptions.pagingOptions.currentPage._subscriptions;
        };
        return ReportViewerControlV2;
    })();
    exports.ReportViewerControlV2 = ReportViewerControlV2;

    var ReportColumnFilter = (function () {
        function ReportColumnFilter(columns, searchFilterDataCallBack) {
            this.reportColumnFilters = ko.observableArray();
            var self = this;
            self.gridColumns = columns;
            self.searchFilterData = searchFilterDataCallBack;

            // ###START: US24968
            self.newgridColumns = $.grep(self.gridColumns, function (item) {
                // ###END: US24968
                return item.field != undefined;
            });

            // Add default three items
            // ###START: US24968
            self.reportColumnFilters.push(new ReportColumnFilters(self.newgridColumns, null));

            // ###END: US24968
            self.addNew = function () {
                // ###START: US24968
                self.reportColumnFilters.push(new ReportColumnFilters(self.newgridColumns, null));
                // ###END: US24968
            };

            self.clearAll = function () {
                self.reportColumnFilters.removeAll();

                // ###START: US24968
                self.reportColumnFilters.push(new ReportColumnFilters(self.newgridColumns, null));
                // ###END: US24968
            };
            self.deleterow = function (item) {
                if (self.reportColumnFilters().length > 1) {
                    self.reportColumnFilters.remove(item);
                }
            };

            self.addFilter = function (items) {
                self.reportColumnFilters.removeAll();
                items.forEach(function (item) {
                    // ###START: US24968
                    self.reportColumnFilters.push(new ReportColumnFilters(self.newgridColumns, item));
                    // ###END: US24968
                });
            };

            self.cancel = function () {
                self.closePopup();
            };

            self.applyFilter = function () {
                self.isFilterApply = true;
                if (self.reportColumnFilters()[0].selectedserviceType() != undefined && self.reportColumnFilters()[0].selectedOperatorType() != undefined) {
                    self.searchFilterData(self.reportColumnFilters());
                } else {
                    self.searchFilterData(null);
                }
                self.closePopup();
            };

            self.closePopup = function () {
                $(".filter").hide();
            };

            return self;
        }
        return ReportColumnFilter;
    })();
    exports.ReportColumnFilter = ReportColumnFilter;

    var ReportColumnFilters = (function () {
        function ReportColumnFilters(columns, FilterItem) {
            this.serviceTypes = ko.observableArray([]);
            this.selectedserviceType = ko.observable();
            this.operatorTypes = ko.observableArray([]);
            this.selectedOperatorType = ko.observable();
            this.searchText = ko.observable();
            var self = this;
            var newFilterColumn = $.grep(columns, function (item) {
                return !item.dntApplyFilter || item.dntApplyFilter == undefined;
            });

            self.serviceTypes(newFilterColumn);
            self.selectedserviceType.subscribe(function (newItem) {
                if (newItem) {
                    self.operatorTypes.removeAll();
                    self.GetOperatorTypes(newItem.type);

                    self.serviceTypes(newFilterColumn);
                }
            });

            self.GetOperatorTypes = function (dataType) {
                self.operatorTypes.removeAll();
                if (dataType == 0) {
                    self.operatorTypes.push({ opratorName: 'Equal To', opratorId: refEnums.Enums.SearchFilterOperand.Equals });
                    self.operatorTypes.push({ opratorName: 'Contains', opratorId: refEnums.Enums.SearchFilterOperand.Contains });
                    self.operatorTypes.push({ opratorName: 'Does not Contain', opratorId: refEnums.Enums.SearchFilterOperand.NotContains });
                    self.operatorTypes.push({ opratorName: 'Starts With', opratorId: refEnums.Enums.SearchFilterOperand.StartsWith });
                    self.operatorTypes.push({ opratorName: 'Ends With', opratorId: refEnums.Enums.SearchFilterOperand.EndsWith });
                    self.selectedOperatorType(self.operatorTypes()[0]);
                } else if (dataType == 1) {
                    //self.operatorTypes.push({ opratorName: '=', opratorId: refEnums.Enums.SearchFilterOperand.Equals });
                    //self.operatorTypes.push({ opratorName: '!=', opratorId: refEnums.Enums.SearchFilterOperand.NotEquals });
                    //self.operatorTypes.push({ opratorName: '>', opratorId: refEnums.Enums.SearchFilterOperand.GreaterThan });
                    //self.operatorTypes.push({ opratorName: '<', opratorId: refEnums.Enums.SearchFilterOperand.LessThan });
                    self.operatorTypes.push({ opratorName: '>=', opratorId: refEnums.Enums.SearchFilterOperand.GreaterThanEquals });
                    self.operatorTypes.push({ opratorName: '<=', opratorId: refEnums.Enums.SearchFilterOperand.LessThanEquals });
                    self.selectedOperatorType(self.operatorTypes()[0]);
                } else if (dataType == 3) {
                    self.operatorTypes.push({ opratorName: 'Equal To', opratorId: refEnums.Enums.SearchFilterOperand.Equals });
                    self.selectedOperatorType(self.operatorTypes()[0]);
                } else {
                    self.operatorTypes.push({ opratorName: '=', opratorId: refEnums.Enums.SearchFilterOperand.Equals });
                    self.operatorTypes.push({ opratorName: '!=', opratorId: refEnums.Enums.SearchFilterOperand.NotEquals });

                    //self.operatorTypes.push({ opratorName: '>', opratorId: refEnums.Enums.SearchFilterOperand.GreaterThan });
                    //self.operatorTypes.push({ opratorName: '<', opratorId: refEnums.Enums.SearchFilterOperand.LessThan });
                    self.operatorTypes.push({ opratorName: '>=', opratorId: refEnums.Enums.SearchFilterOperand.GreaterThanEquals });
                    self.operatorTypes.push({ opratorName: '<=', opratorId: refEnums.Enums.SearchFilterOperand.LessThanEquals });
                    self.selectedOperatorType(self.operatorTypes()[0]);
                }
            };

            if (FilterItem) {
                self.searchText(FilterItem.SearchText);
                if (FilterItem.FieldName == 'BillDate') {
                    FilterItem.FieldName = 'BillDateDisplay';
                } else if (FilterItem.FieldName == 'DeliveryDate') {
                    FilterItem.FieldName = 'DeliveryDateDisplay';
                } else if (FilterItem.FieldName == 'BookedDate') {
                    FilterItem.FieldName = 'BookedDateDisplay';
                } else if (FilterItem.FieldName == 'FinalizedDate') {
                    FilterItem.FieldName = 'FinalizedDateDisplay';
                } else if (FilterItem.FieldName == 'AdjustmentDate') {
                    FilterItem.FieldName = 'AdjustmentDateDisplay';
                } else if (FilterItem.FieldName == 'PickupDate') {
                    FilterItem.FieldName = 'PickupDateDisplay';
                } else if (FilterItem.FieldName == 'ReviewedDate') {
                    FilterItem.FieldName = 'ReviewedDateDisplay';
                } else if (FilterItem.FieldName == 'ShipmentType') {
                    FilterItem.FieldName = 'ShipmentTypeDisplay';
                } else if (FilterItem.FieldName == 'CostAdjustment') {
                    FilterItem.FieldName = 'CostAdjustmentDisplay';
                } else if (FilterItem.FieldName == 'CRRReviewDate') {
                    FilterItem.FieldName = 'CRRReviewDateDisplay';
                } else if (FilterItem.FieldName == 'ProcessStatusDescription') {
                    FilterItem.FieldName = 'ProcessStatusDisplay';
                } else if (FilterItem.FieldName == 'BillStatusDescription') {
                    FilterItem.FieldName = 'BillStatusDisplay';
                } else if (FilterItem.FieldName == 'InvoiceStatusDescription') {
                    FilterItem.FieldName = 'InvoiceStatusDisplay';
                } else if (FilterItem.FieldName == 'CustomerType') {
                    FilterItem.FieldName = 'CustomerTypeDisplay';
                } else if (FilterItem.FieldName == 'ShipmentDate') {
                    FilterItem.FieldName = 'ShipmentDateDisplay';
                } else if (FilterItem.FieldName == 'DisputedDate') {
                    FilterItem.FieldName = 'DisputeDateDisplay';
                } else if (FilterItem.FieldName == 'CreatedDate') {
                    FilterItem.FieldName = 'CreatedDateDisplay';
                } else if (FilterItem.FieldName == 'PickUpdate') {
                    FilterItem.FieldName = 'PickUpdateDisplay';
                } else if (FilterItem.FieldName == 'AgeingDate') {
                    FilterItem.FieldName = 'AgeingDisplay';
                } else if (FilterItem.FieldName == 'IsReviewed') {
                    FilterItem.FieldName = 'IsReviewed';
                } else if (FilterItem.FieldName == 'CustomerTypeDisplay') {
                    FilterItem.FieldName = 'CustomerTypeName';
                } else if (FilterItem.FieldName == 'Street') {
                    FilterItem.FieldName = 'address';
                } else if (FilterItem.FieldName == 'Street2') {
                    FilterItem.FieldName = 'address_2';
                } else if (FilterItem.FieldName == 'Street2') {
                    FilterItem.FieldName = 'address_2';
                } else if (FilterItem.FieldName == 'StateCode') {
                    FilterItem.FieldName = 'state';
                }

                self.selectedserviceType($.grep(self.serviceTypes(), function (item) {
                    return item.field == FilterItem.FieldName;
                })[0]);

                //self.selectedserviceType(selectedType);
                self.selectedOperatorType($.grep(self.operatorTypes(), function (item) {
                    return item.opratorId == FilterItem.Operand;
                })[0]);
                //self.selectedOperatorType(selectedOperand);
            }

            return self;
        }
        return ReportColumnFilters;
    })();
    exports.ReportColumnFilters = ReportColumnFilters;
});
