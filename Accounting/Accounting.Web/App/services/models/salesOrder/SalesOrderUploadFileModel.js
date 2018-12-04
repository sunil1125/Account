/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    var refSystem = __refSystem__;

    /* File Created: Sep 4, 2014
    ** Created By: Avinash Dubey, For uploading the documents for Sales Order
    */
    (function (Models) {
        var SalesOrderUploadFileModel = (function () {
            function SalesOrderUploadFileModel(args) {
                if (args) {
                    this.ShipmentId = refSystem.isObject(args) ? args.ShipmentId : 0;
                    this.Description = refSystem.isObject(args) ? args.Description : '';
                    this.DocumentType = args.DocumentType;
                    this.OwnerType = args.OwnerType;
                    this.UploadedFilePath = refSystem.isObject(args) ? args.UploadedFilePath : '';
                    this.UploadedFileDetails = refSystem.isObject(args) ? args.UploadedFileDetails : '';
                    this.CarrierId = refSystem.isObject(args) ? args.CarrierId : 0;
                    this.ProNumber = refSystem.isObject(args) ? args.ProNumber : '';
                    this.UpdatedBy = refSystem.isObject(args) ? args.UpdatedBy : 0;
                    this.BolNumber = refSystem.isObject(args) ? args.BolNumber : '';
                    this.Id = refSystem.isObject(args) ? args.Id : 0;
                    this.DocType = refSystem.isObject(args) ? args.DocType : 0;
                    this.OwnType = refSystem.isObject(args) ? args.OwnType : 0;
                    this.VendorBillId = refSystem.isObject(args) ? args.VendorBillId : 0;
                    this.CarrierName = refSystem.isObject(args) ? args.CarrierName : '';
                    this.OriginZip = refSystem.isObject(args) ? args.OriginZip : '';
                    this.ServiceType = refSystem.isObject(args) ? args.ServiceType : 0;
                }
            }
            return SalesOrderUploadFileModel;
        })();
        Models.SalesOrderUploadFileModel = SalesOrderUploadFileModel;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
