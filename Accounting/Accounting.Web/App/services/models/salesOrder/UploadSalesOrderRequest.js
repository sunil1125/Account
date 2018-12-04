/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    /*
    ** <summary>
    ** Request model to submit from saleso order grid; containing invalid records and corrected records
    ** </summary>
    ** <createDetails>
    ** <id>US19882</id> <by>Shreesha Adiga</by> <date>23-12-2015</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US20264</id> <by>Shreesha Adiga</by> <date>11-01-2016</date> <description>Added BatchId and RunId</description>
    ** </changeHistory>
    */
    /// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
    /// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
    var refSystem = __refSystem__;

    (function (Models) {
        var UploadSalesOrderRequest = (function () {
            function UploadSalesOrderRequest(args) {
                //this.AllRecords = refSystem.isObject(args) ? args.AllRecords : null;
                this.CorrectedRecords = refSystem.isObject(args) ? args.CorrectedRecords : null;
                this.InvalidRecords = refSystem.isObject(args) ? args.InvalidRecords : null;
                this.BatchId = refSystem.isObject(args) ? args.BatchId : 0;
                this.RunId = refSystem.isObject(args) ? args.RunId : 0;
            }
            return UploadSalesOrderRequest;
        })();
        Models.UploadSalesOrderRequest = UploadSalesOrderRequest;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
