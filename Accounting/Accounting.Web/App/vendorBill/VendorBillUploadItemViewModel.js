/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../services/models/TypeDefs/VendorBillModels.d.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app'], function(require, exports, ___router__, ___app__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    
    

    //#endregion
    /*
    ** <summary>
    ** Vendor Bill Upload Items View Model.
    ** </summary>
    ** <createDetails>
    ** id></id> <by>Avinash Dubey</by> <date>08/27/2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by>Avinash Dubey</by> <date>08/27/2014</date>
    ** Added Grid for showing the data
    ** </changeHistory>
    */
    var VendorBillUploadItem = (function () {
        function VendorBillUploadItem(vendorBillUploadItem) {
            this.CarrierType = ko.observable('');
            this.OrderNumber = ko.observable('');
            this.ProNumber = ko.observable('');
            this.CustomerBOLNumber = ko.observable('');
            this.BOLNumber = ko.observable('');
            this.PoNumber = ko.observable('');
            this.RefPUNumber = ko.observable('');
            this.DeliveryDate = ko.observable('');
            this.BillDate = ko.observable('');
            this.CarrierCode = ko.observable('');
            this.OriginZip = ko.observable('');
            this.DestinationZip = ko.observable('');
            this.Memo = ko.observable('');
            this.ItemId = ko.observable('');
            this.PCS = ko.observable('');
            this.Description = ko.observable('');
            this.Cost = ko.observable('');
            this.Class = ko.observable('');
            this.Length = ko.observable('');
            this.Width = ko.observable('');
            this.Height = ko.observable('');
            this.Wgt = ko.observable('');
            this.PT = ko.observable('');
            this.ChargeCode = ko.observable('');
            this.ShipperCompanyName = ko.observable('');
            this.ShipperContactPerson = ko.observable('');
            this.ShipperPhone = ko.observable('');
            this.ShipperFax = ko.observable('');
            this.ShipperAddress1 = ko.observable('');
            this.ShipperAddress2 = ko.observable('');
            this.ShipperCity = ko.observable('');
            this.ShipperState = ko.observable('');
            this.ShipperCountry = ko.observable('');
            this.ConsigneeCompanyName = ko.observable('');
            this.ConsigneeContactPerson = ko.observable('');
            this.ConsigneePhone = ko.observable('');
            this.ConsigneeFax = ko.observable('');
            this.ConsigneeAddress1 = ko.observable('');
            this.ConsigneeAddress2 = ko.observable('');
            this.ConsigneeZip = ko.observable('');
            this.ConsigneeCity = ko.observable('');
            this.ConsigneeState = ko.observable('');
            this.ConsigneeCountry = ko.observable('');
            this.BillToCompanyName = ko.observable('');
            this.BillToPhone = ko.observable('');
            this.BillToFax = ko.observable('');
            this.BillToAddress1 = ko.observable('');
            this.BillToAddress2 = ko.observable('');
            this.BillToZip = ko.observable('');
            this.BillToCity = ko.observable('');
            this.BillToState = ko.observable('');
            this.BillToCountry = ko.observable('');
            this.QuickPayFlag = ko.observable('');
            this.IsValidCarrierType = ko.observable(false);
            this.IsValidOrderNumber = ko.observable(false);
            this.IsValidProNumber = ko.observable(false);
            this.IsValidCustomerBOLNumber = ko.observable(false);
            this.IsValidBOLNumber = ko.observable(false);
            this.IsValidPoNumber = ko.observable(false);
            this.IsValidRefPUNumber = ko.observable(false);
            this.IsValidDeliveryDate = ko.observable(false);
            this.IsValidBillDate = ko.observable(false);
            this.IsValidCarrierCode = ko.observable(false);
            this.IsValidOriginZip = ko.observable(false);
            this.IsValidDestinationZip = ko.observable(false);
            this.IsValidMemo = ko.observable(false);
            this.IsValidItemId = ko.observable(false);
            this.IsValidPCS = ko.observable(false);
            this.IsValidDescription = ko.observable(false);
            this.IsValidCost = ko.observable(false);
            this.IsValidClass = ko.observable(false);
            this.IsValidLength = ko.observable(false);
            this.IsValidWidth = ko.observable(false);
            this.IsValidHeight = ko.observable(false);
            this.IsValidWgt = ko.observable(false);
            this.IsValidPT = ko.observable(false);
            this.IsValidChargeCode = ko.observable(false);
            this.IsValidShipperCompanyName = ko.observable(false);
            this.IsValidShipperContactPerson = ko.observable(false);
            this.IsValidShipperPhone = ko.observable(false);
            this.IsValidShipperFax = ko.observable(false);
            this.IsValidShipperAddress1 = ko.observable(false);
            this.IsValidShipperAddress2 = ko.observable(false);
            this.IsValidShipperCity = ko.observable(false);
            this.IsValidShipperState = ko.observable(false);
            this.IsValidShipperCountry = ko.observable(false);
            this.IsValidConsigneeCompanyName = ko.observable(false);
            this.IsValidConsigneeContactPerson = ko.observable(false);
            this.IsValidConsigneePhone = ko.observable(false);
            this.IsValidConsigneeFax = ko.observable(false);
            this.IsValidConsigneeAddress1 = ko.observable(false);
            this.IsValidConsigneeAddress2 = ko.observable(false);
            this.IsValidConsigneeZip = ko.observable(false);
            this.IsValidConsigneeCity = ko.observable(false);
            this.IsValidConsigneeState = ko.observable(false);
            this.IsValidConsigneeCountry = ko.observable(false);
            this.IsValidBillToCompanyName = ko.observable(false);
            this.IsValidBillToPhone = ko.observable(false);
            this.IsValidBillToFax = ko.observable(false);
            this.IsValidBillToAddress1 = ko.observable(false);
            this.IsValidBillToAddress2 = ko.observable(false);
            this.IsValidBillToZip = ko.observable(false);
            this.IsValidBillToCity = ko.observable(false);
            this.IsValidBillToState = ko.observable(false);
            this.IsValidBillToCountry = ko.observable(false);
            this.IsValidQuickPayFlag = ko.observable(false);
            this.IsValidShipperZip = ko.observable(false);
            this.IsThisClassValid = ko.observable(false);
            var self = this;

            if (vendorBillUploadItem) {
                self.CarrierType = ko.observable(vendorBillUploadItem.CarrierType);
                self.OrderNumber = ko.observable(vendorBillUploadItem.OrderNumber);
                self.ProNumber = ko.observable(vendorBillUploadItem.ProNumber);
                self.CustomerBOLNumber = ko.observable(vendorBillUploadItem.CustomerBOLNumber);
                self.BOLNumber = ko.observable(vendorBillUploadItem.BOLNumber);
                self.PoNumber = ko.observable(vendorBillUploadItem.PoNumber);
                self.RefPUNumber = ko.observable(vendorBillUploadItem.RefPUNumber);
                self.DeliveryDate = ko.observable(vendorBillUploadItem.DeliveryDate);
                self.BillDate = ko.observable(vendorBillUploadItem.BillDate);
                self.CarrierCode = ko.observable(vendorBillUploadItem.CarrierCode);
                self.OriginZip = ko.observable(vendorBillUploadItem.OriginZip);
                self.DestinationZip = ko.observable(vendorBillUploadItem.DestinationZip);
                self.Memo = ko.observable(vendorBillUploadItem.Memo);
                self.ItemId = ko.observable(vendorBillUploadItem.ItemId);
                self.PCS = ko.observable(vendorBillUploadItem.PCS);
                self.Description = ko.observable(vendorBillUploadItem.Description);
                self.Cost = ko.observable(vendorBillUploadItem.Cost);
                self.Class = ko.observable(vendorBillUploadItem.Class);
                self.Length = ko.observable(vendorBillUploadItem.Length);
                self.Width = ko.observable(vendorBillUploadItem.Width);
                self.Height = ko.observable(vendorBillUploadItem.Height);
                self.Wgt = ko.observable(vendorBillUploadItem.Wgt);
                self.PT = ko.observable(vendorBillUploadItem.PT);
                self.ChargeCode = ko.observable(vendorBillUploadItem.ChargeCode);
                self.ShipperCompanyName = ko.observable(vendorBillUploadItem.ShipperCompanyName);
                self.ShipperContactPerson = ko.observable(vendorBillUploadItem.ShipperContactPerson);
                self.ShipperPhone = ko.observable(vendorBillUploadItem.ShipperPhone);
                self.ShipperPhone = ko.observable(vendorBillUploadItem.ShipperPhone);
                self.ShipperAddress1 = ko.observable(vendorBillUploadItem.ShipperAddress1);
                self.ShipperAddress2 = ko.observable(vendorBillUploadItem.ShipperAddress2);
                self.ShipperCity = ko.observable(vendorBillUploadItem.ShipperCity);
                self.ShipperState = ko.observable(vendorBillUploadItem.ShipperState);
                self.ShipperCountry = ko.observable(vendorBillUploadItem.ShipperCountry);
                self.ConsigneeCompanyName = ko.observable(vendorBillUploadItem.ConsigneeCompanyName);
                self.ConsigneeContactPerson = ko.observable(vendorBillUploadItem.ConsigneeContactPerson);
                self.ConsigneePhone = ko.observable(vendorBillUploadItem.ConsigneePhone);
                self.ConsigneeFax = ko.observable(vendorBillUploadItem.ConsigneeFax);
                self.ConsigneeAddress1 = ko.observable(vendorBillUploadItem.ConsigneeAddress1);
                self.ConsigneeAddress2 = ko.observable(vendorBillUploadItem.ConsigneeAddress2);
                self.ConsigneeZip = ko.observable(vendorBillUploadItem.ConsigneeZip);
                self.ConsigneeCity = ko.observable(vendorBillUploadItem.ConsigneeCity);
                self.ConsigneeState = ko.observable(vendorBillUploadItem.ConsigneeState);
                self.ConsigneeCountry = ko.observable(vendorBillUploadItem.ConsigneeCountry);
                self.BillToCompanyName = ko.observable(vendorBillUploadItem.BillToCompanyName);
                self.BillToPhone = ko.observable(vendorBillUploadItem.BillToPhone);
                self.BillToFax = ko.observable(vendorBillUploadItem.BillToFax);
                self.BillToAddress1 = ko.observable(vendorBillUploadItem.BillToAddress1);
                self.BillToAddress2 = ko.observable(vendorBillUploadItem.BillToAddress2);
                self.BillToZip = ko.observable(vendorBillUploadItem.BillToZip);
                self.BillToCity = ko.observable(vendorBillUploadItem.BillToCity);
                self.BillToState = ko.observable(vendorBillUploadItem.BillToState);
                self.BillToCountry = ko.observable(vendorBillUploadItem.BillToCountry);
                self.QuickPayFlag = ko.observable(vendorBillUploadItem.QuickPayFlag);

                self.IsValidCarrierType = ko.observable(vendorBillUploadItem.IsValidCarrierType);
                self.IsValidOrderNumber = ko.observable(vendorBillUploadItem.IsValidOrderNumber);
                self.IsValidProNumber = ko.observable(vendorBillUploadItem.IsValidProNumber);
                self.IsValidCustomerBOLNumber = ko.observable(vendorBillUploadItem.IsValidCustomerBOLNumber);
                self.IsValidBOLNumber = ko.observable(vendorBillUploadItem.IsValidBOLNumber);
                self.IsValidPoNumber = ko.observable(vendorBillUploadItem.IsValidPoNumber);
                self.IsValidRefPUNumber = ko.observable(vendorBillUploadItem.IsValidRefPUNumber);
                self.IsValidDeliveryDate = ko.observable(vendorBillUploadItem.IsValidDeliveryDate);
                self.IsValidBillDate = ko.observable(vendorBillUploadItem.IsValidBillDate);
                self.IsValidCarrierCode = ko.observable(vendorBillUploadItem.IsValidCarrierCode);
                self.IsValidOriginZip = ko.observable(vendorBillUploadItem.IsValidOriginZip);
                self.IsValidDestinationZip = ko.observable(vendorBillUploadItem.IsValidDestinationZip);
                self.IsValidMemo = ko.observable(vendorBillUploadItem.IsValidMemo);
                self.IsValidItemId = ko.observable(vendorBillUploadItem.IsValidItemId);
                self.IsValidPCS = ko.observable(vendorBillUploadItem.IsValidPCS);
                self.IsValidDescription = ko.observable(vendorBillUploadItem.IsValidDescription);
                self.IsValidCost = ko.observable(vendorBillUploadItem.IsValidCost);
                self.IsValidClass = ko.observable(vendorBillUploadItem.IsValidClass);
                self.IsValidLength = ko.observable(vendorBillUploadItem.IsValidLength);
                self.IsValidWidth = ko.observable(vendorBillUploadItem.IsValidWidth);
                self.IsValidHeight = ko.observable(vendorBillUploadItem.IsValidHeight);
                self.IsValidWgt = ko.observable(vendorBillUploadItem.IsValidWgt);
                self.IsValidPT = ko.observable(vendorBillUploadItem.IsValidPT);
                self.IsValidChargeCode = ko.observable(vendorBillUploadItem.IsValidChargeCode);
                self.IsValidShipperCompanyName = ko.observable(vendorBillUploadItem.IsValidShipperCompanyName);
                self.IsValidShipperContactPerson = ko.observable(vendorBillUploadItem.IsValidShipperContactPerson);
                self.IsValidShipperPhone = ko.observable(vendorBillUploadItem.IsValidShipperPhone);
                self.IsValidShipperFax = ko.observable(vendorBillUploadItem.IsValidShipperFax);
                self.IsValidShipperAddress1 = ko.observable(vendorBillUploadItem.IsValidShipperAddress1);
                self.IsValidShipperAddress2 = ko.observable(vendorBillUploadItem.IsValidShipperAddress2);
                self.IsValidShipperCity = ko.observable(vendorBillUploadItem.IsValidShipperCity);
                self.IsValidShipperState = ko.observable(vendorBillUploadItem.IsValidShipperState);
                self.IsValidShipperCountry = ko.observable(vendorBillUploadItem.IsValidShipperCountry);
                self.IsValidConsigneeCompanyName = ko.observable(vendorBillUploadItem.IsValidConsigneeCompanyName);
                self.IsValidConsigneeContactPerson = ko.observable(vendorBillUploadItem.IsValidConsigneeContactPerson);
                self.IsValidConsigneePhone = ko.observable(vendorBillUploadItem.IsValidConsigneePhone);
                self.IsValidConsigneeFax = ko.observable(vendorBillUploadItem.IsValidConsigneeFax);
                self.IsValidConsigneeAddress1 = ko.observable(vendorBillUploadItem.IsValidConsigneeAddress1);
                self.IsValidConsigneeAddress2 = ko.observable(vendorBillUploadItem.IsValidConsigneeAddress2);
                self.IsValidConsigneeZip = ko.observable(vendorBillUploadItem.IsValidConsigneeZip);
                self.IsValidConsigneeCity = ko.observable(vendorBillUploadItem.IsValidConsigneeCity);
                self.IsValidConsigneeState = ko.observable(vendorBillUploadItem.IsValidConsigneeState);
                self.IsValidConsigneeCountry = ko.observable(vendorBillUploadItem.IsValidConsigneeCountry);
                self.IsValidBillToCompanyName = ko.observable(vendorBillUploadItem.IsValidBillToCompanyName);
                self.IsValidBillToPhone = ko.observable(vendorBillUploadItem.IsValidBillToPhone);
                self.IsValidBillToFax = ko.observable(vendorBillUploadItem.IsValidBillToFax);
                self.IsValidBillToAddress1 = ko.observable(vendorBillUploadItem.IsValidBillToAddress1);
                self.IsValidBillToAddress2 = ko.observable(vendorBillUploadItem.IsValidBillToAddress2);
                self.IsValidBillToZip = ko.observable(vendorBillUploadItem.IsValidBillToZip);
                self.IsValidBillToCity = ko.observable(vendorBillUploadItem.IsValidBillToCity);
                self.IsValidBillToState = ko.observable(vendorBillUploadItem.IsValidBillToState);
                self.IsValidBillToCountry = ko.observable(vendorBillUploadItem.IsValidBillToCountry);
                self.IsValidQuickPayFlag = ko.observable(vendorBillUploadItem.IsValidQuickPayFlag);
                self.IsValidShipperZip = ko.observable(vendorBillUploadItem.IsValidShipperZip);
                self.IsThisClassValid = ko.observable(vendorBillUploadItem.IsThisClassValid);

                self.validationClass = ko.computed(function () {
                    var className = self.IsThisClassValid() ? "redBorder" : "";
                    return className;
                });
            }

            return self;
        }
        return VendorBillUploadItem;
    })();
    exports.VendorBillUploadItem = VendorBillUploadItem;
});
