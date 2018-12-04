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
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../services/models/salesOrder/RequoteBillModel.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refSalesOrderAuditedBillItemViewModel = require('salesOrder/SalesOrderAuditedBillItemsView');
import refEnums = require('services/models/common/Enums');
import refSalesorderItem = require('services/models/salesOrder/SalesOrderItemDetail');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refValidations = require('services/validations/Validations');
import refSalesOrderitem = require('services/models/salesOrder/SalesOrderItemDetail');
import refSalesOrderAuditedBillItemsModel = require('salesOrder/SalesOrderAuditedBillItemsModel');
import refSalesOrderItemDetail = require('services/models/salesOrder/SalesOrderItemDetail');
import refSalesOrderItemDetailModel = require('services/models/salesOrder/SalesOrderItemDetail');
//#endregion
/*
** <summary>
** Sales Order Audited Bill View Model.
** </summary>
** <createDetails>
** <id>US13235</id> <by>Sankesh</by> <date>26th Nov, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by> <date></date>
** </changeHistory>}
*/
export class SalesOrderAuditedBillViewModel {
	//#region Members
	salesOrderClient: refSalesOrderClient.SalesOrderClient = null;
	salesOrderOriginalBillItemViewModel: refSalesOrderAuditedBillItemViewModel.SalesOrderAuditedBillItemViewModel;
	salesOrderAuditedBillItemViewModel: refSalesOrderAuditedBillItemViewModel.SalesOrderAuditedBillItemViewModel;
	salesOrderOriginalBillItem: KnockoutObservableArray<IVendorBillItem> = ko.observableArray([]);
	salesOrderAuditedBillItem: KnockoutObservableArray<IVendorBillItem> = ko.observableArray([]);
	selectedItemsList: KnockoutObservableArray<ISalesOrderItem> = ko.observableArray([]);
	selectedItem: ISalesOrderItem = null;
	mainOrderItemList: KnockoutObservableArray<ISalesOrderItem> = ko.observableArray([]);
	convertItem: ISalesOrderItem ;
	vendorBillItem: KnockoutObservableArray<IVendorBillItem> = ko.observableArray([]);
	matchrowArray: KnockoutObservableArray<IVendorBillItem> = ko.observableArray([]);
	orgZip: KnockoutObservable<string> = ko.observable('');
	destZip: KnockoutObservable<string> = ko.observable('');
	pro: KnockoutObservable<string> = ko.observable('');
	po: KnockoutObservable<string> = ko.observable('');
	ref: KnockoutObservable<string> = ko.observable('');
	btnCopyEnable: KnockoutObservable<boolean> = ko.observable(false);
	datepickerOptions: DatepickerOptions;
	billDate: KnockoutObservable<any> = ko.observable('');
	// common utils class object
	commonUtils: CommonStatic = new Utils.Common();
	listProgress: KnockoutObservable<boolean> = ko.observable(false);
	shipmentItemTypes: KnockoutObservableArray<IShipmentItemType> = ko.observableArray([]);

	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	private checkMsgDisplay: boolean = true;
	copyCostCall: (items: Array<any>) => any;
	isCallAgain: boolean = true;
    //#endregion

	//#region Constructor
	constructor(copyCostCallBack: (items: Array<ISalesOrderItem>) => any) {
		var self = this;
		self.copyCostCall = copyCostCallBack;
		self.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
		self.salesOrderOriginalBillItemViewModel = new refSalesOrderAuditedBillItemViewModel.SalesOrderAuditedBillItemViewModel();
		self.salesOrderAuditedBillItemViewModel = new refSalesOrderAuditedBillItemViewModel.SalesOrderAuditedBillItemViewModel();

		//To set The date picker options
		self.datepickerOptions = {
			blockWeekend: true,
			blockPreviousDays: false,
			blockHolidaysDays: true,
			autoClose: true,
			placeBelowButton: false,
		};

		//To check if Msg is clicked
		self.checkMsgClick = () => {
			self.checkMsgDisplay = true;
		}

	// to Check if Msg is hidden or closed
		self.checkMsgHide = () => {
			self.checkMsgDisplay = true;
		}
	}
	//#endregion

	//#region Internal public Methods

	public initializeAuditedBillDetails(vendorbillid: number, enable: boolean) {
		var self = this;

		self.salesOrderOriginalBillItemViewModel.gridHeader("Original Bill");
		self.salesOrderOriginalBillItemViewModel.isSelect(true);
		self.salesOrderOriginalBillItemViewModel.selected(false);

		self.salesOrderAuditedBillItemViewModel.gridHeader("Audited Bill");
		self.salesOrderAuditedBillItemViewModel.isSelect(false);
		self.listProgress(true);
		var successCallBack = function (data: ISalesOrderAuditedBillContainer) {
					if (data != null)
			{
				self.billDate(data.VendorBill.BillDate ? self.commonUtils.formatDate(data.VendorBill.BillDate.toString(), 'mm/dd/yyyy') : '');
				self.destZip(data.VendorBill.DestinationZip);
				self.orgZip(data.VendorBill.OriginZip);
				self.pro(data.VendorBill.ProNumber);
				self.po(data.VendorBill.PoNumber);
				self.ref(data.VendorBill.ReferenceNumber);
				self.salesOrderOriginalBillItem().removeAll();
				self.salesOrderAuditedBillItem().removeAll();
				if (data.VendorBillItemsDetail.length > 0)
				{
					self.btnCopyEnable(enable);
					for (var i = 0; i < data.VendorBillItemsDetail.length; i++) {
						if (data.VendorBillItemsDetail[i].IsBackupCopy == 0) {
							self.salesOrderOriginalBillItem().push(data.VendorBillItemsDetail[i]);
						}
						else {
							self.salesOrderAuditedBillItem().push(data.VendorBillItemsDetail[i]);
						}
					}
					self.salesOrderOriginalBillItemViewModel.initializeSalesOrderAuditedBillItemDetails(self.salesOrderOriginalBillItem(), enable);
					self.salesOrderAuditedBillItemViewModel.initializeSalesOrderAuditedBillItemDetails(self.salesOrderAuditedBillItem(), enable);
				}
			}
			self.listProgress(false);
			self.isCallAgain = false;
		},
			faliureCallBack = function () {
				self.listProgress(false);
			};
		self.salesOrderClient.GetSalesOrderAuditedBillDetailByVendorBillId(vendorbillid, successCallBack, faliureCallBack);
	}

	public cleanUp() {
		var self = this;

		self.salesOrderOriginalBillItemViewModel.cleanup();
		self.salesOrderAuditedBillItemViewModel.cleanup();

		self.salesOrderOriginalBillItem.removeAll();
		self.salesOrderAuditedBillItem.removeAll();
		self.selectedItemsList.removeAll();
		self.shipmentItemTypes.removeAll();
		self.mainOrderItemList.removeAll();
		self.matchrowArray.removeAll();

		for (var property in self) {
			delete self[property];
		}

		delete self;
	}

	//#endregion

	//#region Internal private methods

	private convertTobillDateDate() {
		var self = this;
		if (self.billDate() !== undefined) {
			if (!self.billDate().match('/') && self.billDate().length > 0) {
				self.billDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.billDate()));
			}
		}
	}

	//For Copying Cost
	private copyCostOnly() {
		var self = this;

		self.btnCopyEnable(false);
		var items = $.grep(self.salesOrderOriginalBillItemViewModel.salesOrderOriginalItemsList(), function (e) { return e.isCheck(); });
		if (items.length > 0) {
			self.copyCostCall(items);
		}
		else {
			if (self.checkMsgDisplay) {
				self.checkMsgDisplay = false;
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 3,
					fadeOut: 3,
					typeOfAlert: "",
					title: ""
				}
          Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectanItem, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
			}
		}
		self.btnCopyEnable(true);
	}

	//#endregion
}