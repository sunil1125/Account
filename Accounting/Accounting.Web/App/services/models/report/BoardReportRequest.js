/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    /* File Created: April 14,2014 */
    /// <reference path="../TypeDefs/Report.d.ts" />
    /// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
    var refSystem = __refSystem__;

    /*
    ** <summary>
    ** Model for BoardReportRequest.
    ** </summary>
    ** <createDetails>
    ** <id></id><by></by><date></date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US26560</id> <by>Baldev Singh Thakur</by> <date>20-02-2017</date> <description>Added SearchColumn property.</description>
    ** </changeHistory>
    */
    (function (Models) {
        var BoardReportRequest = (function () {
            function BoardReportRequest(args) {
                this.ProNumber = refSystem.isObject(args) ? (args.ProNumber) : '';
                this.VendorName = refSystem.isObject(args) ? (args.VendorName) : '';
                this.PageNumber = refSystem.isObject(args) ? (args.PageNumber) : 0;
                this.PageSize = refSystem.isObject(args) ? (args.PageSize) : 0;
                this.FromDate = refSystem.isObject(args) ? (args.FromDate) : new Date();
                this.ToDate = refSystem.isObject(args) ? (args.ToDate) : new Date();
                this.RebillRepName = refSystem.isObject(args) ? (args.RebillRepName) : '';
                this.GridSearchText = refSystem.isObject(args) ? (args.GridSearchText) : '';
                this.SearchColumn = refSystem.isObject(args) ? (args.SearchColumn) : '';
            }
            return BoardReportRequest;
        })();
        Models.BoardReportRequest = BoardReportRequest;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
