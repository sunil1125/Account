/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="jquery.d.ts"/>

interface TimeickerOptions {
	defaultTime?: string;
	disableFocus?: boolean;
	isOpen?: boolean;
	minuteStep?: number;
	modalBackdrop?: boolean;
	secondStep?: number;
	showSeconds?: boolean;
	showInputs?: boolean;
	showMeridian?: boolean;
	template?: string;
	appendWidgetTo?: string;
	startHour?: number;
	endHour?: number;
	convertTo12: boolean;
	startHourMinute?: number;
	endHourMinute?: number;
}

interface JQuery {
    timepicker(): JQuery;
    timepicker(methodName: string): JQuery;
    timepicker(methodName: string, params: any): JQuery;
    timepicker(options: TimeickerOptions): JQuery;
}