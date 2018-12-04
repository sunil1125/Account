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
export class VendorBillLinksViewModel {
	//#region Members
	shipmentLinksList: KnockoutObservableArray<ShipmentRelatedLinkItemViewModel> = ko.observableArray();

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
		//self.isSelected(false);
		if (data) {
			for (var count = 0; count < data.length; count++) {
				if (data[count].ID === vendorBillId) {
					data[count].IsSameProNumber = true;
				}
			}

			if (self.shipmentLinksList)
				self.shipmentLinksList.removeAll();

			data.forEach((item) => {
				var linkItem = new ShipmentRelatedLinkItemViewModel();
				linkItem.initializeLinkDetails(item);
				self.shipmentLinksList.push(linkItem);
			});
		}
	}

	//#endregion

	//#region Internal private methods

	//#endregion

	//#region Clean Up
	public cleanUp() {
		var self = this;

		self.shipmentLinksList().forEach((item) => {
			item.cleanUp();
			delete item;
		});

		delete self.shipmentLinksList;
		delete self.listProgress;

		delete self;
	}
	//#endregion
}

export class ShipmentRelatedLinkItemViewModel {
	ID: number;
	Value: string;
	Type: string;
	SalesOrderID: number;
	SOValue: KnockoutObservable<string> = ko.observable('');
	VBValue: KnockoutObservable<string> = ko.observable('');
	InvoiceValue: KnockoutObservable<string> = ko.observable('');
	IsSameProNumber: KnockoutObservable<boolean> = ko.observable(false);
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

	constructor() {
		var self = this;
		self.showDetailsCallBack = (data: IShipmentRelatedLinks) => {
			self.listProgress(true);
			if (data) {
				self.vendorBillClient.getShipmentLinkDetails(data, (message) => {
					self.linkSectionDetails(message);
					self.isSelected(true);
					self.listProgress(false);
				},
					(message) => {
						self.listProgress(false);
						self.isSelected(false);
					});
			}
			return true;
		}
		return self;
	}

	// initialize the shipment link details
	public initializeLinkDetails(item: IShipmentRelatedLinks) {
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
	}

	// click handler for sales order
	public onSalesOrderClick() {
		var self = this;

		//##START: DE21808
		var bolNumber = self.SOValue().substring(0, self.SOValue().lastIndexOf("(") - 1);
		//##END: DE21808

		_app.trigger("openSalesOrder", self.SalesOrderID, bolNumber, (callback) => {
			if (!callback) {
				return;
			}
		});
	}

	// click handler for vendor bill
	public onVendorBillClick() {
		var self = this,
			proNumber = self.VBValue().substring(0, self.VBValue().lastIndexOf("(") - 1);
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
		}
		else {
			self.expandSourceImage('Content/images/expand.png');
			self.isSelected(false);
		}
	}

	//#region Clean Up
	public cleanUp() {
		var self = this;

		try {
			for (var prop in self) {
				if (typeof self[prop].dispose === "function") {
					self[prop].dispose();
				}
				delete self[prop];
			}

			delete self;
		}
		catch (exception) {
		}
	}
	//#endregion
}