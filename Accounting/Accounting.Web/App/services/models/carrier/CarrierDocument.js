/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/CarrierModel.d.ts" />
define(["require", "exports"], function(require, exports) {
    var CarrierDocument = (function () {
        function CarrierDocument(item) {
            var self = this;
            if (item) {
            }

            return self;
        }
        return CarrierDocument;
    })();
    exports.CarrierDocument = CarrierDocument;

    var CarrierPacketDocument = (function () {
        function CarrierPacketDocument(item) {
            var self = this;
            if (item) {
                self.DocumentPath = item.DocumentPath;
                self.CarrierId = item.CarrierId;
                self.PackageType = item.PackageType;
                self.InsuranceExpirationDate = item.InsuranceExpirationDate;
                self.IsInsuranceExpired = item.IsInsuranceExpired;
                self.DocumentPathToView = item.DocumentPathToView;
                self.IsDocumentsUploaded = item.IsDocumentsUploaded;
                self.DocumentName = item.DocumentName;
                CarrierCode:
                item.CarrierCode;
            }

            return self;
        }
        return CarrierPacketDocument;
    })();
    exports.CarrierPacketDocument = CarrierPacketDocument;
});
