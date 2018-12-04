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
import refEnums = require('services/models/common/Enums');
import _refPurchaseOrderEmailModel = require('services/models/purchaseOrder/PurchaseOrderEmail');
import _reportViewer = require('../templates/reportViewerControlV2');

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
export class VendorBillUploadItem {
	CarrierType = ko.observable('');
	OrderNumber = ko.observable('');
	ProNumber = ko.observable('');
	CustomerBOLNumber = ko.observable('');
	BOLNumber = ko.observable('');
	PoNumber = ko.observable('');
	RefPUNumber = ko.observable('');
	DeliveryDate = ko.observable('');
	BillDate = ko.observable('');
	CarrierCode = ko.observable('');
	OriginZip = ko.observable('');
	DestinationZip = ko.observable('');
	Memo = ko.observable('');
	ItemId = ko.observable('');
	PCS = ko.observable('');
	Description = ko.observable('');
	Cost = ko.observable('');
	Class = ko.observable('');
	Length = ko.observable('');
	Width = ko.observable('');
	Height = ko.observable('');
	Wgt = ko.observable('');
	PT = ko.observable('');
	ChargeCode = ko.observable('');
	ShipperCompanyName = ko.observable('');
	ShipperContactPerson = ko.observable('');
	ShipperPhone = ko.observable('');
	ShipperFax = ko.observable('');
	ShipperAddress1 = ko.observable('');
	ShipperAddress2 = ko.observable('');
	ShipperCity = ko.observable('');
	ShipperState = ko.observable('');
	ShipperCountry = ko.observable('');
	ConsigneeCompanyName = ko.observable('');
	ConsigneeContactPerson = ko.observable('');
	ConsigneePhone = ko.observable('');
	ConsigneeFax = ko.observable('');
	ConsigneeAddress1 = ko.observable('');
	ConsigneeAddress2 = ko.observable('');
	ConsigneeZip = ko.observable('');
	ConsigneeCity = ko.observable('');
	ConsigneeState = ko.observable('');
	ConsigneeCountry = ko.observable('');
	BillToCompanyName = ko.observable('');
	BillToPhone = ko.observable('');
	BillToFax = ko.observable('');
	BillToAddress1 = ko.observable('');
	BillToAddress2 = ko.observable('');
	BillToZip = ko.observable('');
	BillToCity = ko.observable('');
	BillToState = ko.observable('');
	BillToCountry = ko.observable('');
	QuickPayFlag = ko.observable('');

	IsValidCarrierType: KnockoutObservable<boolean> = ko.observable(false);
	IsValidOrderNumber: KnockoutObservable<boolean> = ko.observable(false);
	IsValidProNumber: KnockoutObservable<boolean> = ko.observable(false);
	IsValidCustomerBOLNumber: KnockoutObservable<boolean> = ko.observable(false);
	IsValidBOLNumber: KnockoutObservable<boolean> = ko.observable(false);
	IsValidPoNumber: KnockoutObservable<boolean> = ko.observable(false);
	IsValidRefPUNumber: KnockoutObservable<boolean> = ko.observable(false);
	IsValidDeliveryDate: KnockoutObservable<boolean> = ko.observable(false);
	IsValidBillDate: KnockoutObservable<boolean> = ko.observable(false);
	IsValidCarrierCode: KnockoutObservable<boolean> = ko.observable(false);
	IsValidOriginZip: KnockoutObservable<boolean> = ko.observable(false);
	IsValidDestinationZip: KnockoutObservable<boolean> = ko.observable(false);
	IsValidMemo: KnockoutObservable<boolean> = ko.observable(false);
	IsValidItemId: KnockoutObservable<boolean> = ko.observable(false);
	IsValidPCS: KnockoutObservable<boolean> = ko.observable(false);
	IsValidDescription: KnockoutObservable<boolean> = ko.observable(false);
	IsValidCost: KnockoutObservable<boolean> = ko.observable(false);
	IsValidClass: KnockoutObservable<boolean> = ko.observable(false);
	IsValidLength: KnockoutObservable<boolean> = ko.observable(false);
	IsValidWidth: KnockoutObservable<boolean> = ko.observable(false);
	IsValidHeight: KnockoutObservable<boolean> = ko.observable(false);
	IsValidWgt: KnockoutObservable<boolean> = ko.observable(false);
	IsValidPT: KnockoutObservable<boolean> = ko.observable(false);
	IsValidChargeCode: KnockoutObservable<boolean> = ko.observable(false);
	IsValidShipperCompanyName: KnockoutObservable<boolean> = ko.observable(false);
	IsValidShipperContactPerson: KnockoutObservable<boolean> = ko.observable(false);
	IsValidShipperPhone: KnockoutObservable<boolean> = ko.observable(false);
	IsValidShipperFax: KnockoutObservable<boolean> = ko.observable(false);
	IsValidShipperAddress1: KnockoutObservable<boolean> = ko.observable(false);
	IsValidShipperAddress2: KnockoutObservable<boolean> = ko.observable(false);
	IsValidShipperCity: KnockoutObservable<boolean> = ko.observable(false);
	IsValidShipperState: KnockoutObservable<boolean> = ko.observable(false);
	IsValidShipperCountry: KnockoutObservable<boolean> = ko.observable(false);
	IsValidConsigneeCompanyName: KnockoutObservable<boolean> = ko.observable(false);
	IsValidConsigneeContactPerson: KnockoutObservable<boolean> = ko.observable(false);
	IsValidConsigneePhone: KnockoutObservable<boolean> = ko.observable(false);
	IsValidConsigneeFax: KnockoutObservable<boolean> = ko.observable(false);
	IsValidConsigneeAddress1: KnockoutObservable<boolean> = ko.observable(false);
	IsValidConsigneeAddress2: KnockoutObservable<boolean> = ko.observable(false);
	IsValidConsigneeZip: KnockoutObservable<boolean> = ko.observable(false);
	IsValidConsigneeCity: KnockoutObservable<boolean> = ko.observable(false);
	IsValidConsigneeState: KnockoutObservable<boolean> = ko.observable(false);
	IsValidConsigneeCountry: KnockoutObservable<boolean> = ko.observable(false);
	IsValidBillToCompanyName: KnockoutObservable<boolean> = ko.observable(false);
	IsValidBillToPhone: KnockoutObservable<boolean> = ko.observable(false);
	IsValidBillToFax: KnockoutObservable<boolean> = ko.observable(false);
	IsValidBillToAddress1: KnockoutObservable<boolean> = ko.observable(false);
	IsValidBillToAddress2: KnockoutObservable<boolean> = ko.observable(false);
	IsValidBillToZip: KnockoutObservable<boolean> = ko.observable(false);
	IsValidBillToCity: KnockoutObservable<boolean> = ko.observable(false);
	IsValidBillToState: KnockoutObservable<boolean> = ko.observable(false);
	IsValidBillToCountry: KnockoutObservable<boolean> = ko.observable(false);
	IsValidQuickPayFlag: KnockoutObservable<boolean> = ko.observable(false);
	IsValidShipperZip: KnockoutObservable<boolean> = ko.observable(false);
	IsThisClassValid: KnockoutObservable<boolean> = ko.observable(false);

	validationClass: KnockoutComputed<string>;

	constructor(vendorBillUploadItem?: IVendorBillUploadItem) {
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

			self.validationClass = ko.computed(() => {
				var className = self.IsThisClassValid() ? "redBorder" : "";
				return className;
			});
		}

		return self;
	}
}