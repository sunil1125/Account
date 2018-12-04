/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../localStorage/LocalStorage.ts" />
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
define(["require", "exports", 'plugins/router', 'durandal/app', '../services/models/vendorBill/ShipmentRelatedLinks', 'services/client/VendorBillClient'], function(require, exports, ___router__, ___app__, __refShipmentRelatedLinksModel__, __refVendorBillClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    var refShipmentRelatedLinksModel = __refShipmentRelatedLinksModel__;
    var refVendorBillClient = __refVendorBillClient__;

    //#endregion
    /*
    ** <summary>
    ** Sales Order Links View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US8214</id> <by>bhanu</by> <date>8th Aug, 2014</date>
    ** <id>DE21808</id> <by>Shreesha Adiga</by> <date>12-02-2016</date> <description>Get the bol number from the displayed string</description>
    ** <id>DE23052</id> <by>Shreesha Adiga</by> <date>14-06-2016</date> <description>Get the bol number from server and pass it while opening the invoice</description>
    ** <id>US22997</id> <by>Janakiram</by> <date>07-07-2016</date> <description>Renamed Trigger name for Invoice View Pdf</description>
    ** </createDetails>
    */
    var SalesOrderLinksViewModel = (function () {
        //#endregion
        //#region Constructor
        function SalesOrderLinksViewModel() {
            //#region Members
            this.shipmentLinksList = ko.observableArray();
            this.linkSectionDetails = ko.observable();
            this.isSelected = ko.observable(false);
            this.bolNumber = ko.observable('');
            this.listProgress = ko.observable(false);
            var self = this;
            return self;
        }
        //#endregion}
        //#region Internal public Methods
        SalesOrderLinksViewModel.prototype.initializeLinksDetails = function (data, vendorBillId) {
            var self = this;
            self.listProgress(true);
            self.isSelected(false);
            if (data) {
                for (var count = 0; count < data.length; count++) {
                    if (data[count].ID === vendorBillId) {
                        data[count].IsSameProNumber = true;
                    }
                    if (data[count].SalesOrderID === vendorBillId) {
                        data[count].IsSameBolNumber = true;
                    }
                }

                if (self.shipmentLinksList)
                    self.shipmentLinksList.removeAll();

                data.forEach(function (item) {
                    var linkItem = new ShipmentRelatedLinkItemViewModel(self.showDetails);
                    linkItem.initializeLinkDetails(item, self.bolNumber());
                    self.shipmentLinksList.push(linkItem);
                });
            }
            self.listProgress(false);
        };

        //#endregion
        SalesOrderLinksViewModel.prototype.cleanup = function () {
            var self = this;
            self.shipmentLinksList.removeAll();
            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }

            delete self;
        };
        return SalesOrderLinksViewModel;
    })();
    exports.SalesOrderLinksViewModel = SalesOrderLinksViewModel;

    var ShipmentRelatedLinkItemViewModel = (function () {
        // ##END: DE23052
        function ShipmentRelatedLinkItemViewModel(showDetailsCallBack) {
            this.SOValue = ko.observable('');
            this.VBValue = ko.observable('');
            this.InvoiceValue = ko.observable('');
            this.IsSameProNumber = ko.observable(false);
            this.IsSameBolNumber = ko.observable(false);
            this.bolNumber = ko.observable('');
            this.isSelected = ko.observable(false);
            this.shipmentRelatedLinkModel = null;
            //src of expand
            this.expandSourceImage = ko.observable('Content/images/expand.png');
            this.vendorBillClient = new refVendorBillClient.VendorBillClient();
            this.linkSectionDetails = ko.observable();
            this.listProgress = ko.observable(false);
            this.carrierCode = ko.observable('');
            this.carrierCodeDsiplay = ko.observable('');
            var self = this;

            self.showDetailsCallBack = function (data) {
                if (data) {
                    self.vendorBillClient.getShipmentLinkDetails(data, function (message) {
                        self.linkSectionDetails(message);
                        self.isSelected(true);
                    }, function (message) {
                        self.isSelected(false);
                    });
                }
                return true;
            };

            return self;
        }
        // initialize the shipment link details
        ShipmentRelatedLinkItemViewModel.prototype.initializeLinkDetails = function (item, bolNumber) {
            var self = this;
            if (item != null) {
                self.ID = item.ID;
                self.Value = item.Value;
                self.Type = item.Type;
                self.SOValue(item.SOValue);
                self.VBValue(item.VBValue);
                self.InvoiceValue(item.InvoiceValue);
                self.IsSameProNumber(item.IsSameProNumber);
                self.IsSameBolNumber(item.IsSameBolNumber);
                self.SalesOrderId = item.SalesOrderID;
                self.carrierCode(item.CarrierCode);
                self.carrierCodeDsiplay(item.CarrierCodeDisplay);
                self.bolNumber(bolNumber);

                // ##START: DE23052
                self.bolNumberOfInvoice = item.BOLNumber;
                // ##END: DE23052
            }
        };

        // click handler for sales order
        ShipmentRelatedLinkItemViewModel.prototype.onSalesOrderClick = function () {
            var self = this;

            //##START: DE21808
            var bolNumber = self.SOValue().substring(0, self.SOValue().lastIndexOf("(") - 1);

            //##END: DE21808
            _app.trigger("openSalesOrder", self.SalesOrderId, bolNumber, function (callback) {
                if (!callback) {
                    return;
                }
            });
        };

        // click handler for vendor bill
        ShipmentRelatedLinkItemViewModel.prototype.onVendorBillClick = function () {
            var self = this;
            if (LocalStorageController.Get(self.bolNumber() + 'SO')) {
                LocalStorageController.Set(self.bolNumber() + 'SO', undefined);
            }
            var proNumber = self.VBValue().substring(0, self.VBValue().lastIndexOf("(") - 1);

            // ###START: US22997
            _app.trigger("openVendorBill", self.ID, proNumber, function (callback) {
                if (!callback) {
                    return;
                }
            });
        };

        // click handler for invoice HTML
        ShipmentRelatedLinkItemViewModel.prototype.onInvoiceNumberClick = function () {
            var self = this;

            //##START: DE23052
            var bolNumber = typeof self.bolNumberOfInvoice !== "undefined" && self.bolNumberOfInvoice !== null ? self.bolNumberOfInvoice : self.SOValue().substring(0, self.SOValue().lastIndexOf("(") - 1);

            //##END: DE23052
            _app.trigger("openInvoice", bolNumber, self.InvoiceValue(), function (callback) {
                if (!callback) {
                    return;
                }
            });
        };

        ShipmentRelatedLinkItemViewModel.prototype.showDetails = function () {
            var self = this;
            self.listProgress(true);
            if (!self.isSelected()) {
                self.expandSourceImage('Content/images/collapse_hit.png');
                self.isSelected(true);
                self.shipmentRelatedLinkModel = new refShipmentRelatedLinksModel.Models.ShipmentRelatedLinks();
                self.shipmentRelatedLinkModel.ID = self.ID;
                self.shipmentRelatedLinkModel.SOValue = self.SOValue();
                self.shipmentRelatedLinkModel.InvoiceValue = self.InvoiceValue();
                self.shipmentRelatedLinkModel.Type = self.Type;
                self.shipmentRelatedLinkModel.Value = self.Value;
                self.shipmentRelatedLinkModel.VBValue = self.VBValue();
                self.shipmentRelatedLinkModel.IsSameProNumber = self.IsSameProNumber();
                self.shipmentRelatedLinkModel.IsSameBolNumber = self.IsSameBolNumber();
                self.shipmentRelatedLinkModel.SalesOrderID = self.SalesOrderId;
                self.showDetailsCallBack(self.shipmentRelatedLinkModel);
            } else {
                self.expandSourceImage('Content/images/expand.png');
                self.isSelected(false);
            }
            self.listProgress(false);
        };
        return ShipmentRelatedLinkItemViewModel;
    })();
    exports.ShipmentRelatedLinkItemViewModel = ShipmentRelatedLinkItemViewModel;
});
