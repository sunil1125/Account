/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

define(["require", "exports"], function(require, exports) {
    

    (function (Models) {
        var VendorBillQuickSearch = (function () {
            function VendorBillQuickSearch(args) {
                if (args) {
                    this.VendorName = args.VendorName ? (args.VendorName) : '';
                    this.ProNumber = args.ProNumber ? (args.ProNumber) : '';
                    this.BolNumber = args.BolNumber ? (args.BolNumber) : '';
                    this.PoNumber = args.PoNumber ? (args.PoNumber) : '';
                    this.FromDate = args.FromDate ? args.FromDate : new Date();
                    this.ToDate = args.ToDate ? args.ToDate : new Date();
                    this.PageNumber = args.PageNumber ? args.PageNumber : 0;
                    this.PageSize = args.PageSize ? args.PageSize : 0;
                    this.PagesFound = args.PagesFound ? args.PagesFound : 0;
                    this.ProcessStatus = args.ProcessStatus ? args.ProcessStatus : -1;
                    this.SortField = args.SortField ? (args.SortField) : '';
                    this.SortOrder = args.SortOrder ? (args.SortOrder) : '';
                    this.IsPurchaseOrder = args.IsPurchaseOrder ? (args.IsPurchaseOrder) : 1;
                }
            }
            return VendorBillQuickSearch;
        })();
        Models.VendorBillQuickSearch = VendorBillQuickSearch;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
