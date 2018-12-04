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
define(["require", "exports", 'plugins/router', 'durandal/app', '../services/models/vendorBill/ShipmentRelatedLinks', 'services/client/VendorBillClient'], function(require, exports, ___router__, ___app__, __refShipmentRelatedLinksModel__, __refVendorBillClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    var refShipmentRelatedLinksModel = __refShipmentRelatedLinksModel__;
    var refVendorBillClient = __refVendorBillClient__;

    //#endregion
    /*
    ** <summary>
    ** Vendor Bill Links  View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US8214</id> <by>Satish</by> <date>30th May, 2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>DE21808</id> <by>Shreesha Adiga</by> <date>12-02-2016</date> <description>Get the bol number from the displayed string</description>
    ** <id>DE23052</id> <by>Shreesha Adiga</by> <date>14-06-2016</date> <description>Get the bol number from server and pass it while opening the invoice</description>
    ** </changeHistory>
    */
    var VendorBillLinksViewModel = (function () {
        //#endregion
        //#region Constructor
        function VendorBillLinksViewModel() {
            //#region Members
            this.shipmentLinksList = ko.observableArray();
            this.listProgress = ko.observable(false);
            var self = this;

            return self;
        }
        //#endregion}
        //#region Internal public Methods
        VendorBillLinksViewModel.prototype.initializeLinksDetails = function (data, vendorBillId) {
            var self = this;

            if (data) {
                for (var count = 0; count < data.length; count++) {
                    if (data[count].ID === vendorBillId) {
                        data[count].IsSameProNumber = true;
                    }
                }

                if (self.shipmentLinksList)
                    self.shipmentLinksList.removeAll();

                data.forEach(function (item) {
                    var linkItem = new ShipmentRelatedLinkItemViewModel();
                    linkItem.initializeLinkDetails(item);
                    self.shipmentLinksList.push(linkItem);
                });
            }
        };

        //#endregion
        //#region Internal private methods
        //#endregion
        //#region Clean Up
        VendorBillLinksViewModel.prototype.cleanUp = function () {
            var self = this;

            self.shipmentLinksList().forEach(function (item) {
                item.cleanUp();
                delete item;
            });

            delete self.shipmentLinksList;
            delete self.listProgress;

            delete self;
        };
        return VendorBillLinksViewModel;
    })();
    exports.VendorBillLinksViewModel = VendorBillLinksViewModel;

    var ShipmentRelatedLinkItemViewModel = (function () {
        // ##END: DE23052
        function ShipmentRelatedLinkItemViewModel() {
            this.SOValue = ko.observable('');
            this.VBValue = ko.observable('');
            this.InvoiceValue = ko.observable('');
            this.IsSameProNumber = ko.observable(false);
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
                self.listProgress(true);
                if (data) {
                    self.vendorBillClient.getShipmentLinkDetails(data, function (message) {
                        self.linkSectionDetails(message);
                        self.isSelected(true);
                        self.listProgress(false);
                    }, function (message) {
                        self.listProgress(false);
                        self.isSelected(false);
                    });
                }
                return true;
            };
            return self;
        }
        // initialize the shipment link details
        ShipmentRelatedLinkItemViewModel.prototype.initializeLinkDetails = function (item) {
            var self = this;
            if (item != null) {
                self.ID = item.ID;
                self.SalesOrderID = item.SalesOrderID;
                self.Value = item.Value;
                self.Type = item.Type;
                self.SOValue(item.SOValue);
                self.VBValue(item.VBValue);
                self.InvoiceValue(item.InvoiceValue);
                self.IsSameProNumber(item.IsSameProNumber);
                self.carrierCode(item.CarrierCode);
                self.carrierCodeDsiplay(item.CarrierCodeDisplay);

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
            _app.trigger("openSalesOrder", self.SalesOrderID, bolNumber, function (callback) {
                if (!callback) {
                    return;
                }
            });
        };

        // click handler for vendor bill
        ShipmentRelatedLinkItemViewModel.prototype.onVendorBillClick = function () {
            var self = this, proNumber = self.VBValue().substring(0, self.VBValue().lastIndexOf("(") - 1);

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
                self.showDetailsCallBack(self.shipmentRelatedLinkModel);
            } else {
                self.expandSourceImage('Content/images/expand.png');
                self.isSelected(false);
            }
        };

        //#region Clean Up
        ShipmentRelatedLinkItemViewModel.prototype.cleanUp = function () {
            var self = this;

            try  {
                for (var prop in self) {
                    if (typeof self[prop].dispose === "function") {
                        self[prop].dispose();
                    }
                    delete self[prop];
                }

                delete self;
            } catch (exception) {
            }
        };
        return ShipmentRelatedLinkItemViewModel;
    })();
    exports.ShipmentRelatedLinkItemViewModel = ShipmentRelatedLinkItemViewModel;
});
