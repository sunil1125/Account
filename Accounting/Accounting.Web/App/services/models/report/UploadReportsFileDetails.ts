/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created: Dec 11, 2014
** Created By: Chandan Singh
*/
/// <reference path="../TypeDefs/CommonModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
//#endregion Import

export module Models {
    export class UploadReportsFileDetails {
        CarrierId: number;
        CarrierName: string;
        StatementFileDetails: any;
        DisputeReportFileDetails: any;
        MASReportFileDetails: any;
        ReConsolidatedFileDetails: any;
        ScheduleDate: Date;

        constructor(args?: IUploadReportsFileDetails) {
            if (args) {
                this.CarrierId = args.CarrierId ? args.CarrierId : 0;
                this.CarrierName = args.CarrierName ? (args.CarrierName) : '';
                this.StatementFileDetails = args.StatementFileDetails;
                this.DisputeReportFileDetails = args.DisputeReportFileDetails;
                this.MASReportFileDetails = args.MASReportFileDetails;
                this.ReConsolidatedFileDetails = args.ReConsolidatedFileDetails;
                this.ScheduleDate = args.ScheduleDate ? args.ScheduleDate : new Date();
            }
        }
    }
}