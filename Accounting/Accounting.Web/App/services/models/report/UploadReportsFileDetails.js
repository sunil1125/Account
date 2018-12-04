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
define(["require", "exports", 'plugins/router', 'durandal/app'], function(require, exports, ___router__, ___app__) {
    
    var _router = ___router__;
    var _app = ___app__;
    

    //#endregion Import
    (function (Models) {
        var UploadReportsFileDetails = (function () {
            function UploadReportsFileDetails(args) {
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
            return UploadReportsFileDetails;
        })();
        Models.UploadReportsFileDetails = UploadReportsFileDetails;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
