/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

// Interface
export interface IUserGridColumnSetting {
    ColumnName: string;
    ColumnOrder: number;
    IsVisible: boolean;
    SortOrder: number;
}

// Module
export module Model {
    export class UserGridColumnSetting{
        public ColumnName: string;
        public ColumnOrder: number;
        public IsVisible: boolean;
        public SortOrder: number;

        constructor(iUserGridColumnSetting?: IUserGridColumnSetting) {
            var self = this;
            self.ColumnOrder = iUserGridColumnSetting.ColumnOrder ? iUserGridColumnSetting.ColumnOrder : null;
            self.ColumnName = iUserGridColumnSetting.ColumnName ? iUserGridColumnSetting.ColumnName : null;
            self.IsVisible = iUserGridColumnSetting.IsVisible != null ? iUserGridColumnSetting.IsVisible : true;
            self.SortOrder = iUserGridColumnSetting.SortOrder != null ? iUserGridColumnSetting.SortOrder : null;
        }
    }
}