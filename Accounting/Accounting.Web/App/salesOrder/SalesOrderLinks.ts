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

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import _reportViewer = require('../templates/reportViewerControlV2');
import refShipmentRelatedLinksModel = require('../services/models/vendorBill/ShipmentRelatedLinks');
import refVendorBillClient = require('services/client/VendorBillClient');
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
export class SalesOrderLinksViewModel {
    //#region Members

    shipmentLinksList: KnockoutObservableArray<ShipmentRelatedLinkItemViewModel> = ko.observableArray();
    linkSectionDetails: KnockoutObservable<ILinkSectionDetails> = ko.observable();
    showDetails: (data: IShipmentRelatedLinks) => any;
    isSelected: KnockoutObservable<boolean> = ko.observable(false);
    bolNumber: KnockoutObservable<string> = ko.observable('');
    listProgress: KnockoutObservable<boolean> = ko.observable(false);

    //#endregion

    //#region Constructor
    constructor() {
        var self = this;
        return self;
    }

    //#endregion}

    //#region Internal public Methods
    public initializeLinksDetails(data: Array<IShipmentRelatedLinks>, vendorBillId: number) {
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

            data.forEach((item) => {
                var linkItem = new ShipmentRelatedLinkItemViewModel(self.showDetails);
                linkItem.initializeLinkDetails(item, self.bolNumber());
                self.shipmentLinksList.push(linkItem);
            });
        }
        self.listProgress(false);
    }

    //#endregion

    public cleanup() {
        var self = this;
        self.shipmentLinksList.removeAll();
        for (var property in self) {
            if (property != "cleanup")
                delete self[property];
        }

        delete self;
    }
    //#region Internal private methods

    //#endregion
}

export class ShipmentRelatedLinkItemViewModel {
    ID: number;
    Value: string;
    Type: string;
    SalesOrderId: number;
    SOValue: KnockoutObservable<string> = ko.observable('');
    VBValue: KnockoutObservable<string> = ko.observable('');
    InvoiceValue: KnockoutObservable<string> = ko.observable('');
    IsSameProNumber: KnockoutObservable<boolean> = ko.observable(false);
    IsSameBolNumber: KnockoutObservable<boolean> = ko.observable(false);
    bolNumber: KnockoutObservable<string> = ko.observable('');
    isSelected: KnockoutObservable<boolean> = ko.observable(false);
    showDetailsCallBack: (data: IShipmentRelatedLinks) => any;
    shipmentRelatedLinkModel: refShipmentRelatedLinksModel.Models.ShipmentRelatedLinks = null;
    //src of expand
    expandSourceImage: KnockoutObservable<string> = ko.observable('Content/images/expand.png');
    vendorBillClient: refVendorBillClient.VendorBillClient = new refVendorBillClient.VendorBillClient();
    linkSectionDetails: KnockoutObservable<ILinkSectionDetails> = ko.observable();
    listProgress: KnockoutObservable<boolean> = ko.observable(false);
    carrierCode: KnockoutObservable<string> = ko.observable('');
    carrierCodeDsiplay: KnockoutObservable<string> = ko.observable('');
    // ##START: DE23052
    bolNumberOfInvoice: string;
    // ##END: DE23052

    constructor(showDetailsCallBack: (data: IShipmentRelatedLinks) => any) {
        var self = this;

        self.showDetailsCallBack = (data: IShipmentRelatedLinks) => {
            if (data) {
                self.vendorBillClient.getShipmentLinkDetails(data, (message) => {
                    self.linkSectionDetails(message);
                    self.isSelected(true);
                },
                    (message) => {
                        self.isSelected(false);
                    });
            }
            return true;
        }

		return self;
    }

    // initialize the shipment link details
    public initializeLinkDetails(item: IShipmentRelatedLinks, bolNumber: string) {
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
    }

    // click handler for sales order
    public onSalesOrderClick() {
        var self = this

		//##START: DE21808
		var bolNumber = self.SOValue().substring(0, self.SOValue().lastIndexOf("(") - 1);
        //##END: DE21808

        _app.trigger("openSalesOrder", self.SalesOrderId, bolNumber, (callback) => {
            if (!callback) {
                return;
            }
        });
    }

    // click handler for vendor bill
    public onVendorBillClick() {
        var self = this;
        if (LocalStorageController.Get(self.bolNumber() + 'SO')) {
            LocalStorageController.Set(self.bolNumber() + 'SO', undefined)
		}
        var proNumber = self.VBValue().substring(0, self.VBValue().lastIndexOf("(") - 1);
        // ###START: US22997
        _app.trigger("openVendorBill", self.ID, proNumber, (callback) => {
            // ###END: US22997
            if (!callback) {
                return;
            }
        });
    }

    // click handler for invoice HTML
    public onInvoiceNumberClick() {
        var self = this;

        //##START: DE23052
        var bolNumber = typeof self.bolNumberOfInvoice !== "undefined" && self.bolNumberOfInvoice !== null
            ? self.bolNumberOfInvoice
            : self.SOValue().substring(0, self.SOValue().lastIndexOf("(") - 1);
        //##END: DE23052

        _app.trigger("openInvoice", bolNumber, self.InvoiceValue(), (callback) => {
            if (!callback) {
                return;
            }
        });
    }

    public showDetails() {
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
        }
        else {
            self.expandSourceImage('Content/images/expand.png');
            self.isSelected(false);
        }
        self.listProgress(false);
    }
}