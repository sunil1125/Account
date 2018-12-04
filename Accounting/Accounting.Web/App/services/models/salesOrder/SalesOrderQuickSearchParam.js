/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created: April 14,2014 */
/// <reference path="../TypeDefs/SalesOrderSearchModel.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
define(["require", "exports"], function(require, exports) {
    

    (function (Models) {
        var SalesOrderQuickSearch = (function () {
            function SalesOrderQuickSearch(args) {
                if (args) {
                    this.ProNumber = args.ProNumber ? (args.ProNumber) : '';
                    this.BolNumber = args.BolNumber ? (args.BolNumber) : '';
                    this.PoNumber = args.PoNumber ? (args.PoNumber) : '';
                    this.ShipperZipCode = args.ShipperZipCode ? (args.ShipperZipCode) : '';
                    this.ConsigneeZipCode = args.ConsigneeZipCode ? (args.ConsigneeZipCode) : '';
                    this.PageNumber = args.PageNumber ? args.PageNumber : 0;
                    this.PageSize = args.PageSize ? args.PageSize : 0;
                    this.PagesFound = args.PagesFound ? args.PagesFound : 0;
                }
            }
            return SalesOrderQuickSearch;
        })();
        Models.SalesOrderQuickSearch = SalesOrderQuickSearch;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
