/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />

export interface IKoCoulmnDefinition {
	ColumnName: string;
	IsVisible: boolean;
	DisplayName: string;
	isRemovable: boolean;
	Width: string;
	SortOrder: number;
}

export module Model {
    export class KoCoulmnDefinition {
        public field: string;
        public displayName: string;
        public visible: boolean;
        public cellTemplate: string;
        public cellClass: string;
        public cellFilter: Function;
        public aggLabelFilter: Function;
        public headerClass: string;

        public headerCellTemplate: string;
        public sortable: boolean;
        public resizable: boolean;
        public sortFn: Function;
        public width: string;
        public minWidth: string = "50px";
        public maxWidth: string = "9000px";
        public isRemovable: boolean = true;
        public isListedForRemove: boolean = false;
        public isReorderable: boolean = true;
        public isCustomColumnHeader: boolean = false;
		public sortDirection: string = '';

        constructor(iKoCoulmnDefinition?: IKoCoulmnDefinition, defaultSetting?: any, specialGridSettings?: any) {
            var self = this;

            self.field = iKoCoulmnDefinition.ColumnName;
            self.visible = iKoCoulmnDefinition.IsVisible;
			self.width = iKoCoulmnDefinition.Width;
			self.sortable = iKoCoulmnDefinition.SortOrder !== undefined && iKoCoulmnDefinition.SortOrder !== null ? true : undefined;

			if (self.sortable) {
				self.sortDirection = iKoCoulmnDefinition.SortOrder == 0 ? 'asc' : 'desc';
			}

            var colSpecialSettings = ko.utils.arrayFirst(defaultSetting(), function (item) {
                return iKoCoulmnDefinition.ColumnName === item.field;
            });
            if (colSpecialSettings) {
                if (colSpecialSettings.displayName)
                    self.displayName = colSpecialSettings.displayName;

				if (colSpecialSettings.width)
					if (!self.width || self.width==='0') {
						self.width = colSpecialSettings.width;
					}

                if (colSpecialSettings.headerCellTemplate)
                    self.headerCellTemplate = colSpecialSettings.headerCellTemplate;

                if (colSpecialSettings.cellTemplate)
                    self.cellTemplate = colSpecialSettings.cellTemplate;

                if (colSpecialSettings.isRemovable == undefined || typeof colSpecialSettings.isRemovable == "object")
                    self.isRemovable = true;
                else
                    self.isRemovable = colSpecialSettings.isRemovable;

                if (colSpecialSettings.isListedForRemove == undefined || typeof colSpecialSettings.isListedForRemove == "object")
                    self.isListedForRemove = false;
                else
                    self.isListedForRemove = colSpecialSettings.isListedForRemove;

                if (colSpecialSettings.isReorderable == undefined || typeof colSpecialSettings.isReorderable == "object")
                    self.isReorderable = true;
                else
                    self.isReorderable = colSpecialSettings.isReorderable;

                if (colSpecialSettings.isCustomColumnHeader == undefined || typeof colSpecialSettings.isCustomColumnHeader == "object")
                    self.isCustomColumnHeader = false;
                else
                    self.isCustomColumnHeader = colSpecialSettings.isCustomColumnHeader;

                // Add more attributes if needed.
            }
        }

        public static GetSortinfo(iKoColumnDefinitionList?: any, defaultSortInfo?: any) {
            var sortColumn = ko.utils.arrayFirst(iKoColumnDefinitionList, function (column) {
                return column.SortOrder != null
            });
            return sortColumn ? {
                column: {
                    field: sortColumn.ColumnName
                },
                direction: sortColumn.SortOrder ? 'desc' : 'asc'
            } : defaultSortInfo();
        }
    }
}