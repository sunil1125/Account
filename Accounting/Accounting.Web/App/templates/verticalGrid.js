/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
define(["require", "exports", 'durandal/app'], function(require, exports, __refApp__) {
    /// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
    /// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
    /// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
    /// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
    //#endregion
    //#region Import
    var refApp = __refApp__;
    

    //#endregion
    var sortAppliedOn;
    var resetPagination = null;

    /** <summary>
    * * Sort Control View Model
    * * < / summary >
    * * <createDetails>proNumber
    * * <id> < /id> <by>Achal</by > <date></date >
    * * < / createDetails >
    * * <changeHistory>
    * * < / changeHistory >
    */
    var SortControl = (function () {
        //#endregion
        //#region Constructor
        function SortControl(sortControlColDef, gridOptions) {
            var self = this;

            self.sortControlColDef = sortControlColDef;
            self.selectedSortOption = ko.observable(null);
            self.selectedSortOption.subscribe(function (newValue) {
                if (newValue) {
                    sortAppliedOn = newValue.field;
                    resetPagination = true;
                    if (self.selectedSortOptionBackUp && newValue.displayName == self.selectedSortOptionBackUp.displayName)
                        return;

                    gridOptions.sortInfo({
                        column: {
                            field: newValue.field
                        },
                        direction: newValue.direction
                    });
                    self.selectedSortOptionBackUp = newValue;
                }
            }, self);
        }
        return SortControl;
    })();
    exports.SortControl = SortControl;

    var VerticalGrid = (function () {
        //#region Constructor
        function VerticalGrid() {
            //#region Variables
            this._data = ko.observableArray([]);
            this.colDefs = ko.observableArray([]);
            this.emptyVerticalObject = {};
            this.getKeyColumnsName = ko.observableArray([]);
            this.columnNames = ko.observableArray([]);
            this.jSonDataValue = ko.observableArray([]);
            this.ifRowsAreLessThenTen = ko.computed(function () {
                return this.jSonDataValue().length < 8 ? 8 - this.jSonDataValue().length : 0;
            }, this);
            this.sortControlColDef = ko.observableArray([]);
            this.paginationNumber = ko.observable(1);
            this.paginationHappened = ko.observable(null);
            this.storeColumns = ko.observableArray([]);
            this.maximumNumberOfPaginationAvailable = ko.observable();
            this.copyOfData = ko.observableArray();
            this.CommonUtils = new Utils.Common();
            this.resetPaginationCount = ko.observable(null);
            //temp
            this.flag = ko.observable(0);
            var self = this;

            self.sortInfo = ko.observable({
                column: {
                    field: 'TotalShipments'
                },
                direction: 'desc'
            });

            self.gridSortControl = new SortControl(this.sortControlColDef, this);
            self.resetPaginationCount.subscribe(function () {
                self.paginationNumber(1);
                self.paginationHappened(0);
            });

            self.getdata = function (dataForGrid, columnDefinition, totalRecords) {
                self.copyOfData(self.CommonUtils.deepCopy(dataForGrid));
                if (totalRecords) {
                    this.maximumNumberOfPaginationAvailable(totalRecords / 8);
                }
                if (resetPagination || self.copyOfData().length === 0) {
                    self.paginationNumber(1);
                    self.paginationHappened(0);
                    resetPagination = null;
                }
                if (dataForGrid) {
                    self._data(dataForGrid);
                }
                if (columnDefinition) {
                    var _getSortingVariables = new Array();
                    columnDefinition.forEach(function (item) {
                        if (item.sorting === true) {
                            _getSortingVariables.push(item);
                        }
                    });
                    self.sortControlColDef(_getSortingVariables);
                }

                var obj = columnDefinition.reduce(function (total, current) {
                    total[current.field] = current.displayName;
                    return total;
                }, {});

                self.storeColumns(columnDefinition);
                self.jSonDataValue(dataForGrid);
                self.createEmptyVerticalObject();
                self.createEmptyVerticalRows();
                if (self.copyOfData().length > 0) {
                    jQuery(".activeForSorting").each(function () {
                        jQuery(this).removeClass('activeForSorting').removeClass('activeForSortingExtraParameter');
                    });
                    jQuery("." + sortAppliedOn).addClass('activeForSorting');
                    jQuery("." + sortAppliedOn + 'Cols').addClass('activeForSorting activeForSortingExtraParameter');
                } else if (self.copyOfData().length === 0) {
                    jQuery(".activeForSorting").each(function () {
                        jQuery(this).removeClass('activeForSorting').removeClass('activeForSortingExtraParameter');
                    });
                }
            };

            //function to create empty object for empty vertical rows
            self.createEmptyVerticalObject = function () {
                self.storeColumns().forEach(function (column) {
                    var columnName = column.field;
                    self.emptyVerticalObject[columnName] = "-";
                });
            };

            //function to create empty rows for the grid
            self.createEmptyVerticalRows = function () {
                if (self.jSonDataValue().length < 8) {
                    var tempObj = new Array();
                    var getTheDifference = 8 - self.jSonDataValue().length;
                    while (getTheDifference) {
                         {
                            self.jSonDataValue.push(self.emptyVerticalObject);
                        }
                        getTheDifference -= 1;
                    }
                }
            };

            self.sortByClick = function (data, events) {
                if (sortAppliedOn === data.field) {
                    return false;
                }
                self.sortInfo({
                    column: {
                        field: data.field
                    },
                    direction: 'desc'
                });
                sortAppliedOn = data.field;
                resetPagination = true;
                self.gridSortControl.selectedSortOption(data);
            };
        }
        //#endregion Constructor
        //#region Public Methods
        //#endregion Public Methods
        //#region Private Methods
        //function to fetch next available records
        VerticalGrid.prototype.fetchNextTenRecords = function () {
            var _self = this;
            _self.paginationNumber(_self.paginationNumber() + 1);
            _self.paginationHappened(_self.paginationNumber());
            resetPagination = null;
        };

        //function to fetch previous records
        VerticalGrid.prototype.fetchPreviousTenRecords = function () {
            var _self = this;
            _self.paginationNumber(_self.paginationNumber() - 1);
            _self.paginationHappened(_self.paginationNumber());
        };

        //function to remove an image tag and replace with some white background if some error occurs.
        VerticalGrid.prototype.noImage = function (name, event) {
            var errorEvent = event;

            //this is to add the alt instead of image path
            var imageAlt = errorEvent.target.alt;
            if (imageAlt === '-') {
                imageAlt = '&nbsp';
                jQuery(errorEvent.target).replaceWith("<div style='height: 67px; display:table-cell'></div>");
            } else {
                jQuery(errorEvent.target).replaceWith("<div class='missingImage'>" + imageAlt + "</div>");
            }
        };
        return VerticalGrid;
    })();
    exports.VerticalGrid = VerticalGrid;
});
