/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

// Type definitions for bootstrap.datepicker
// Project: https://github.com/eternicode/bootstrap-datepicker
// Definitions by: Boris Yankov <https://github.com/borisyankov/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="jquery.d.ts"/>

interface DatepickerOptions {
	format?: string;
	minViewMode?: string;
	viewMode?: string;
	weekStart?: number;
	startDate?: Date;
	endDate?: Date;
	todayBtn?: boolean;
	todayHighlight?: boolean;
	keyboardNavigation?: boolean;
	language?: string;
	blockWeekend?: boolean;
	blockPreviousDays?: boolean;
	blockHolidaysDays?: boolean;
	autoClose?: boolean;
	placeBelowButton?: boolean;
	showNextWorkingDate?: boolean;
	onRender?: () => void;
}

interface JQuery {
	datepicker(): JQuery;
	datepicker(methodName: string): JQuery;
	datepicker(methodName: string, params: any): JQuery;
	datepicker(options: DatepickerOptions): JQuery;
}