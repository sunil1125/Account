/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References

/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
//#endregion

//#region Import

import refApp = require('durandal/app');
import refSystem = require('durandal/system');

//#endregion

//#region Interfaces

export interface ISortInfo {
    column: { field: string };
    direction: string;
}

export interface IgridSortControlColDef {
    displayName: string;
    field: string;
    direction: string;
}

export interface IVerticalGridColumnsDefs {
    field: string
	displayName: string
	sorting: boolean
	direction: string
	IsLogo?: boolean
	SpecialSybmol?: string
	NumberType?: string
}

//#endregion

var sortAppliedOn: string;
var resetPagination: boolean = null;

/** <summary>
* * Sort Control View Model
* * < / summary >
* * <createDetails>proNumber
* * <id> < /id> <by>Achal</by > <date></date >
* * < / createDetails >
* * <changeHistory>
* * < / changeHistory >
*/
export class SortControl {
    //#region Public Variables}

    public selectedSortOption: KnockoutObservable<IgridSortControlColDef>;
    public sortControlColDef: KnockoutObservableArray<IgridSortControlColDef>;
    //#endregion

    //#region Private  Members

    private selectedSortOptionBackUp: IgridSortControlColDef;

    //#endregion

    //#region Constructor

    constructor(sortControlColDef: KnockoutObservableArray<IgridSortControlColDef>, gridOptions: any) {
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

    //#endregion
}

export class VerticalGrid {
    //#region Variables

    public _data: KnockoutObservableArray<any> = ko.observableArray([]);
    public colDefs: KnockoutObservableArray<IVerticalGridColumnsDefs> = ko.observableArray([]);
    public emptyVerticalObject = {};
    public getKeyColumnsName: KnockoutObservableArray<any> = ko.observableArray([]);
    public columnNames: KnockoutObservableArray<any> = ko.observableArray([]);
    public jSonDataValue: KnockoutObservableArray<any> = ko.observableArray([]); //jSonDataValue
    public ifRowsAreLessThenTen = ko.computed(function () {
			return this.jSonDataValue().length < 8 ? 8 - this.jSonDataValue().length : 0
		}, this);
    public sortControlColDef = ko.observableArray([]);
    gridSortControl: SortControl;
    sortInfo: KnockoutObservable<ISortInfo>;
    paginationNumber: KnockoutObservable<number> = ko.observable(1);
    paginationHappened: KnockoutObservable<number> = ko.observable(null);
    getSortingVariables: KnockoutComputed<any>;
    storeColumns: KnockoutObservableArray<any> = ko.observableArray([]);
    maximumNumberOfPaginationAvailable: KnockoutObservable<number> = ko.observable();
    copyOfData: KnockoutObservableArray<any> = ko.observableArray();
    CommonUtils: CommonStatic = new Utils.Common();
    resetPaginationCount: KnockoutObservable<boolean> = ko.observable(null);
    //temp
    flag: KnockoutObservable<number> = ko.observable(0);
    getdata: (dataForGrid?: any, columnDefinition?: Array<IVerticalGridColumnsDefs>, totalRecords?: number) => any;
    createEmptyVerticalObject: () => any;
    createEmptyVerticalRows: () => any;
    sortByClick: (data: any, events: any) => any;
    //#region Constructor
    constructor() {
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

        self.getdata = function (dataForGrid?: any, columnDefinition?: Array<IVerticalGridColumnsDefs>, totalRecords?: number) {
            self.copyOfData(self.CommonUtils.deepCopy<any>(dataForGrid));
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
                columnDefinition.forEach(function (item: any) {
                    if (item.sorting === true) {
                        _getSortingVariables.push(item);
                    }
                });
                self.sortControlColDef(_getSortingVariables);
            }

            var obj = columnDefinition.reduce(function (total: any, current: any) {
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
            }
            else if (self.copyOfData().length === 0) {
                jQuery(".activeForSorting").each(function () {
                    jQuery(this).removeClass('activeForSorting').removeClass('activeForSortingExtraParameter');
                });
            }
        }

	//function to create empty object for empty vertical rows
		self.createEmptyVerticalObject = function () {
            self.storeColumns().forEach(function (column) {
                var columnName = column.field;
                self.emptyVerticalObject[columnName] = "-";
            });
        }

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
        }

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
        }
	}
    //#endregion Constructor

    //#region Public Methods

    //#endregion Public Methods

    //#region Private Methods

    //function to fetch next available records
    private fetchNextTenRecords() {
        var _self = this;
        _self.paginationNumber(_self.paginationNumber() + 1);
        _self.paginationHappened(_self.paginationNumber());
        resetPagination = null;
    }

    //function to fetch previous records
    private fetchPreviousTenRecords() {
        var _self = this;
        _self.paginationNumber(_self.paginationNumber() - 1);
        _self.paginationHappened(_self.paginationNumber());
    }

    //function to remove an image tag and replace with some white background if some error occurs.
    private noImage(name, event) {
        var errorEvent = event;

        //this is to add the alt instead of image path
        var imageAlt = errorEvent.target.alt;
        if (imageAlt === '-') {
            imageAlt = '&nbsp';
            jQuery(errorEvent.target).replaceWith("<div style='height: 67px; display:table-cell'></div>");
        }
        else {
            jQuery(errorEvent.target).replaceWith("<div class='missingImage'>" + imageAlt + "</div>");
        }
    }

    //#endregion Private Methods
}
//return new VerticalGrid;