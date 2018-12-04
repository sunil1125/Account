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
import refSalesOrderReBillItemViewModel = require('salesOrder/SalesOrderReBillItemView');
import refSalesOrderOptionButtonControl = require('salesOrder/SalesOrderOptionButtonControl');
import refEnums = require('services/models/common/Enums');
import refRequote = require('services/models/salesOrder/RequoteBillModel');
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refValidations = require('services/validations/Validations');
import refSalesOrderRequoteReason = require('services/models/salesOrder/SalesOrderShipmentRequoteReason');
import refSalesOrderitem = require('services/models/salesOrder/SalesOrderItemDetail');
import refSalesOrderReBillItemsModel = require('salesOrder/SalesOrderRebillItemsModel');
import refSalesOrderItemDetail = require('services/models/salesOrder/SalesOrderItemDetail');
import refSalesOrderReBillVendorItemViewModel = require('salesOrder/SalesOrderRebillVendorItemView');
import refSalesOrderAuditViewModel = require('salesOrder/SalesOrderAuditView');
import refSalesOrderItemModel = require('salesOrder/SalesOrderItemsModel');
//#endregion
/*
** <summary>
** Sales Order Rebill View Model.
** </summary>
** <createDetails>
** <id>US13230</id> <by>Sankesh</by> <date>10th Nov, 2014</date>
** </createDetails>
** <changeHistory>
** <id>DE21390</id> <by>Vasanthakumar</by> <date>22-01-2016</date> <description>System shows Change Detection message when user navigate to ReBill tab & try to navigate to other page</description>
** <id>US23162</id> <by>Vasanthakumar</by> <date>05-07-2016</date> <description>Acct: Rebill rep Logic</description>
** <id>US24389</id> <by>Shreesha Adiga</by> <date>31-08-2016</date> <description>Fetch Truckload Acessorials if the order is TL</description>
** </changeHistory>
*/
export class SalesOrderReBillViewModel {
	//#region Members
	salesOrderReBillOriginalItemViewModel: refSalesOrderReBillItemViewModel.SalesOrderReBillItemViewModel;
	salesOrderReBillAdjustItemViewModel: refSalesOrderReBillItemViewModel.SalesOrderReBillItemViewModel;
	adjustedOrderItemList: KnockoutObservableArray<ISalesOrderItem> = ko.observableArray([]);
	adjustedOrderItem: refSalesOrderItemDetail.Models.SalesOrderItemDetail;
	copyAdjustedOrderItemList: KnockoutObservableArray<ISalesOrderItem> = ko.observableArray([]);
	salesOrderClient: refSalesOrderClient.SalesOrderClient = new refSalesOrderClient.SalesOrderClient();
	salesOrderReBillVendorItemViewModel: refSalesOrderReBillVendorItemViewModel.SalesOrderRebillVendorBillItemViewModel;
	salesOrderAuditViewModel: refSalesOrderAuditViewModel.SalesOrderAuditViewModel;
	name: KnockoutObservable<string> = ko.observable('Other');
	rebillRep: KnockoutObservable<string> = ko.observable('');
	requoteReasonid: KnockoutObservable<number> = ko.observable(0);
	isOtherReason: KnockoutObservable<boolean> = ko.observable(false);
	otherReason: KnockoutObservable<string> = ko.observable('');
	costDiff: KnockoutObservable<number> = ko.observable($.number(0, 2));

	estimatedProfitPerc: KnockoutObservable<number> = ko.observable($.number(0, 2));
	finalProfitPerc: KnockoutObservable<number> = ko.observable($.number(0, 2));
	html: KnockoutObservable<string> = ko.observable('');
	crrReviewDate: KnockoutObservable<any> = ko.observable('');
	adjustmentDate: KnockoutObservable<any> = ko.observable('');
	salesOrderId: KnockoutObservable<string> = ko.observable('');
	shipmentId: KnockoutObservable<number> = ko.observable(0);
	calculateRevenue: KnockoutObservable<boolean> = ko.observable(false);
	isBillingStation: KnockoutObservable<boolean> = ko.observable(false);
	gtzMargin: KnockoutObservable<number> = ko.observable($.number(0, 2));
	feeStructure: KnockoutObservable<number> = ko.observable(0);
	plcMargin: KnockoutObservable<number> = ko.observable(0);
	gtMinMargin: KnockoutObservable<number> = ko.observable(0);
	plcorBSCost: KnockoutObservable<number> = ko.observable(0);
	plcorBSRevenue: KnockoutObservable<number> = ko.observable(0);
	customerTypeOf: KnockoutObservable<number> = ko.observable(0);
	btnCopyEnable: KnockoutObservable<boolean> = ko.observable(false);
	datepickerOptions: DatepickerOptions;
	auditFeeItemsList: KnockoutObservableArray<refRequote.Model.RequoteBillModel> = ko.observableArray([]);
	requoteReasonsList: KnockoutObservableArray<refSalesOrderRequoteReason.Model.SalesOrderShipmentRequoteReason> = ko.observableArray([]);
	salesOrderOptionListOptions: KnockoutObservableArray<IButtonControlOption> = ko.observableArray([]);
	// common utils class object
	commonUtils: CommonStatic = new Utils.Common();
	obcSalesOrderOptionList: refSalesOrderOptionButtonControl.SalesOrderOptionButtonControl;
	shipmentItemTypes: KnockoutObservableArray<IShipmentItemType> = ko.observableArray([]);
	matchrowArray: KnockoutObservableArray<ISalesOrderItem> = ko.observableArray([]);
	processLog: KnockoutObservable<string> = ko.observable('');
	isSaveEnable: KnockoutObservable<boolean> = ko.observable(true);
	//selectedLineItem: (lineItem: ISalesOrderItem) => void;
	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	private checkMsgDisplay: boolean = true;
	// ###START: US22365
	revenueChanged: (items: Array<any>, type: number, selectedAllItems: boolean) => any;

	// ###END: US22365
	listProgress: KnockoutObservable<boolean> = ko.observable(false);
	isCallAgain: boolean = true;
	// To get the logged in user
	currentUser: KnockoutObservable<IUser> = ko.observable();

	//for tracking change
	getBITrackChange: () => string[];
	isBIDirty: KnockoutComputed<boolean>;
	// call while changes occurs
	public onChangesMade: (dirty: boolean) => any;
	returnValue: boolean = false;
	ischange: boolean = false;
	isNotAtLoadingTime: boolean = false;
	originZip: KnockoutObservable<string> = ko.observable('');
	destinationZip: KnockoutObservable<string> = ko.observable('');
	// to hold vendor bill id to fetch address
	vendorBillId: KnockoutObservable<number> = ko.observable(0);

	//##START: US24389
	isTruckloadOrder: boolean = false;
	//##END: US24389
	//#endregion

	//#region Constructor
	// ###START: US22365
	constructor(revenueCallBack: (items: Array<ISalesOrderItem>, type: number, selectedAllItems: boolean) => any) {
		// ###END: US22365
		var self = this;
		self.revenueChanged = revenueCallBack;
		self.salesOrderReBillOriginalItemViewModel = new refSalesOrderReBillItemViewModel.SalesOrderReBillItemViewModel();
		self.salesOrderReBillAdjustItemViewModel = new refSalesOrderReBillItemViewModel.SalesOrderReBillItemViewModel();
		self.salesOrderReBillVendorItemViewModel = new refSalesOrderReBillVendorItemViewModel.SalesOrderRebillVendorBillItemViewModel();
		self.salesOrderAuditViewModel = new refSalesOrderAuditViewModel.SalesOrderAuditViewModel();
		self.bindRequoteReasonCodes()
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

		if (!self.currentUser()) {
			// Get the logged in user for name for new note}
			_app.trigger("GetCurrentUserDetails", (currentUser: IUser) => {
				self.currentUser(currentUser);
			});
		}

		//track changes
		self.SetBITrackChange(self);

		self.getBITrackChange = () => {
			return Utils.getDirtyItems(self);
		};

		self.isBIDirty = ko.computed(() => {
			var result = self.crrReviewDate();
			result = self.otherReason();

			// If this from loading data side the return as false
			if (self.isNotAtLoadingTime)
				return false;

			var returnValue = self.getBITrackChange().length > 0 ? true : false;
			self.returnValue = returnValue;
			if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
				self.onChangesMade(returnValue);

			return returnValue;
		});
	}

	//#endregion}

	//#region Internal public Methods

	public initializeReBillDetails(salesOrderId: number, totalCost: number, estimatedProfitPerc: number, finalProfitPerc: number, isBillingStation: boolean, gtzMargin: number, plcMargin: number, feeStructure: number, gtMinMargin: number, customerTypeOf: number, finalcost: number, isSubOrder: boolean, vbCost: number, soCost: number, enable: boolean, itemlist: any) {
		var self = this;

		// ##START: US24389
		if (self.isTruckloadOrder) {
			self.salesOrderReBillOriginalItemViewModel.populateTruckloadAccessorials();
			self.salesOrderReBillAdjustItemViewModel.populateTruckloadAccessorials();
		}
		// ##END: US24389

		self.isNotAtLoadingTime = true;
		self.salesOrderId(salesOrderId.toString());
		self.shipmentId(salesOrderId);
		self.btnCopyEnable(enable);
		self.isSaveEnable(enable);
		self.estimatedProfitPerc(estimatedProfitPerc);
		self.finalProfitPerc(finalProfitPerc);
		self.gtzMargin(gtzMargin);
		self.feeStructure(feeStructure);
		self.plcMargin(plcMargin);
		self.gtMinMargin(gtMinMargin);
		self.isBillingStation(isBillingStation);
		self.customerTypeOf(customerTypeOf);
		self.salesOrderReBillOriginalItemViewModel.selected(false);
		self.listProgress(true);

		if (isSubOrder) {
			self.costDiff($.number(parseFloat(vbCost.toString().replace(/,/g, "")) - parseFloat(soCost.toString().replace(/,/g, "")), 2));
		}
		else {
			if (totalCost === undefined || totalCost === null) {
				self.costDiff($.number(parseFloat(finalcost.toString().replace(/,/g, "")) - 0, 2));
			}
			else {
				self.costDiff($.number(parseFloat(finalcost.toString().replace(/,/g, "")) - parseFloat(totalCost.toString().replace(/,/g, "")), 2));
			}
		}

		self.salesOrderReBillVendorItemViewModel.gridHeader("Vendor Bill Items");
		self.salesOrderReBillVendorItemViewModel.isSelect(false);
		self.GetVendorBillItems();

		var successCallBack = function (data: ISalesOrderREBillContainer) {
			//// ###START: DE21390
			self.isNotAtLoadingTime = true;
			//// ###END: DE21390
			if (data != null)
				self.salesOrderReBillOriginalItemViewModel.initializeSalesOrderRebillItemDetails(data.OriginalItemDetail, self.btnCopyEnable());
			//self.adjustedOrderItemList(data.AdjustedItemDetail);
			self.salesOrderReBillOriginalItemViewModel.isSelect(true);
			self.salesOrderReBillOriginalItemViewModel.isBOLnumber(false);
			self.salesOrderReBillOriginalItemViewModel.isRev(true);
			self.salesOrderReBillOriginalItemViewModel.isHaz(true);
			self.salesOrderReBillOriginalItemViewModel.gridHeader("Original Order");
			// if it is not a sub order

			if (!isSubOrder) {
				self.salesOrderReBillAdjustItemViewModel.initializeSalesOrderRebillItemDetails(data.AdjustedItemDetail, self.btnCopyEnable());
			}

			self.salesOrderReBillAdjustItemViewModel.isSelect(false);
			self.salesOrderReBillAdjustItemViewModel.isBOLnumber(true);
			self.salesOrderReBillAdjustItemViewModel.isRev(true);
			self.salesOrderReBillAdjustItemViewModel.isHaz(true);
			self.salesOrderReBillAdjustItemViewModel.gridHeader("Adjusted Order");

			if (self.isBillingStation()) {
				self.salesOrderReBillAdjustItemViewModel.isBSCost(true);
				self.salesOrderReBillOriginalItemViewModel.isBSCost(true);
			}
			else {
				self.salesOrderReBillAdjustItemViewModel.isBSCost(false);
				self.salesOrderReBillOriginalItemViewModel.isBSCost(false);
			}

			// ###START: US23162
			if (data.SalesOrderRequoteReviewDetails != null) {
				self.requoteReasonid(data.SalesOrderRequoteReviewDetails.ID);
				// if it is not a sub order
				if (!isSubOrder) {
					self.adjustmentDate(data.SalesOrderRequoteReviewDetails.AdjustmentDate ? self.commonUtils.formatDate(data.SalesOrderRequoteReviewDetails.AdjustmentDate.toString(), 'mm/dd/yyyy') : '');
					self.crrReviewDate(data.SalesOrderRequoteReviewDetails.CRReviewDate ? self.commonUtils.formatDate(data.SalesOrderRequoteReviewDetails.CRReviewDate.toString(), 'mm/dd/yyyy') : '');
				}
				else {
					self.adjustmentDate('');
					self.crrReviewDate('');
				}
			}

			if (data.RebillRep != null) {
				self.rebillRep(data.RebillRep);
			}
			else {
				self.rebillRep('');
			}
			// ###END: US23162

			self.auditFeeItemsList.removeAll();
			data.SalesOrderRequoteReasonCodes.forEach(function (item) {
				self.auditFeeItemsList.push(new refRequote.Model.RequoteBillModel(item));
			});

			self.requoteReasonsList.removeAll();
			data.SalesOrderShipmentRequoteReasons.forEach(function (item) {
				self.requoteReasonsList.push(new refSalesOrderRequoteReason.Model.SalesOrderShipmentRequoteReason(item));
			});

			self.requoteReasonsList().forEach(function (reasonItem) {
				if (reasonItem.RequoteReasonID == 11) {
					if (!isSubOrder) {
						self.isOtherReason(true);
						self.otherReason(reasonItem.Remarks);
					}
					else {
						self.isOtherReason(false);
						self.otherReason('');
					}
					self.html('<i class="icon-ok icon-white active"></i>' + self.name());
				}
			});
			self.salesOrderOptionListOptions.removeAll();
			if (self.auditFeeItemsList().length > 0) {
				self.auditFeeItemsList().forEach(function (item) {
					if (item.id != 11) {
						var check = false;

						// if it is not a sub order then show items with selection.
						if (!isSubOrder) {
							self.requoteReasonsList().forEach(function (reasonItem) {
								if (reasonItem.RequoteReasonID == item.id) {
									check = true;
								}
							});
						}
						self.salesOrderOptionListOptions.push({ id: item.id, name: item.name, selected: check, enabled: self.isSaveEnable() ? item.IsEnable : false });
					}
				});
				var argssalesOrderOptionList: IOptionButtonControlArgs = {
					options: self.salesOrderOptionListOptions(),
					useHtmlBinding: true,
					isMultiCheck: true,
					isVerticalView: false,
					enabled: self.isSaveEnable()
				}

				self.obcSalesOrderOptionList.initializeButton(argssalesOrderOptionList, refEnums.Enums.OptionButtonsView.Matrix) //= new refSalesOrderOptionButtonControl.SalesOrderOptionButtonControl(argssalesOrderOptionList, refEnums.Enums.OptionButtonsView.Matrix);
			}
			self.isCallAgain = false;
			self.listProgress(false);
			self.SetBITrackChange(self);
			//// ###START: DE21390		
			self.ischange = false;
			self.returnValue = false;
			self.isNotAtLoadingTime = false;
			//// ###END: DE21390

		},
			faliureCallBack = function () {
				self.listProgress(false);
			};

		self.salesOrderClient.GetSalesOrderRebill(salesOrderId.toString(), successCallBack, faliureCallBack);

		self.isNotAtLoadingTime = false;
	}

	//sets the tracking extension for BI required fields
	SetBITrackChange(self) {
		//** To detect changes for Vendor Bill
		self.crrReviewDate.extend({ trackChange: true });
		self.otherReason.extend({ trackChange: true });
	}
	//#endregion

	public bindRequoteReasonCodes() {
		var self = this;

		//To set the checkbox bill option values
		var SalesOrderOptionListOptions: Array<IButtonControlOption> = [{ id: refEnums.Enums.vendorBillOptionConstant.MakeInactive, name: 'Make Inactive', selected: false }];

		//set checkbox property
		var argsvendorBillOptionList: IOptionButtonControlArgs = {
			options: SalesOrderOptionListOptions,
			useHtmlBinding: true,
			isMultiCheck: true,
			isVerticalView: false
		}

		self.obcSalesOrderOptionList = new refSalesOrderOptionButtonControl.SalesOrderOptionButtonControl(argsvendorBillOptionList, refEnums.Enums.OptionButtonsView.Vertical);
	}
	//#region Internal private methods
	otherOption() {
		var self = this;

		if (!self.isOtherReason()) {
			self.isOtherReason(true);

			self.html('<i class="icon-ok icon-white active"></i>' + self.name());
		} else {
			self.isOtherReason(false);
			self.otherReason('');
		}
	}

	private convertToCrrReviewDate() {
		var self = this;
		if (self.crrReviewDate() !== undefined) {
			if (!self.crrReviewDate().match('/') && self.crrReviewDate().length > 0) {
				self.crrReviewDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.crrReviewDate()));
			}
		}
	}
	private convertToAdjustmentDate() {
		var self = this;
		if (self.adjustmentDate() !== undefined) {
			if (!self.adjustmentDate().match('/') && self.adjustmentDate().length > 0) {
				self.crrReviewDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.adjustmentDate()));
			}
		}
	}

	//For Copying Cost and Revenue
	public copyCostRevenue() {
		var self = this;
		self.btnCopyEnable(false);
		var items = $.grep(self.salesOrderReBillOriginalItemViewModel.salesOrderOriginalItemsList(), function (e) { return e.isCheck(); });

		// ###START: US22365
		var selectedAllItems = self.salesOrderReBillOriginalItemViewModel.selected();

		// ###END: US22365
		self.copyAdjustedOrderItemList(self.adjustedOrderItemList());
		if (items.length > 0) {
			self.revenueChanged(items, 2, selectedAllItems); // ###START: US22365
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
	//For Copying Cost
	public copyCostOnly() {
		var self = this;
		self.btnCopyEnable(false);
		var items = $.grep(self.salesOrderReBillOriginalItemViewModel.salesOrderOriginalItemsList(), function (e) { return e.isCheck(); });

		// ###START: US22365
		var selectedAllItems = self.salesOrderReBillOriginalItemViewModel.selected();

		// ###END: US22365
		self.copyAdjustedOrderItemList(self.adjustedOrderItemList());
		if (items.length > 0) {
			//After updating populate the items
			self.revenueChanged(items, 1, selectedAllItems); // ###START: US22365
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

	public GetVendorBillItems() {
		var self = this;
		//self.listProgress(true);
		var successCallBack = function (data) {
			//self.listProgress(false);
			var commonUtils = new Utils.Common();
			data.forEach(function (item) {
				if (item.IsMainVendorBill) {
					self.vendorBillId(item.VendorBillId)
				}
			})
			self.getVendorBillAddress();
			self.salesOrderReBillVendorItemViewModel.InitializeVendorBillItems(data);
		},
			faliureCallBack = function () {
				//self.listProgress(false);
			};
		self.salesOrderClient.GetVendorBillItemsForInvoiceResolution(self.shipmentId(), successCallBack, faliureCallBack);
		//self.listProgress(false);
	}

	// To get vendor bill Addresses for Rebill Section
	public getVendorBillAddress() {
		var self = this;
		var successCallBack = function (data) {
			self.originZip(data[0].ZipCode);
			self.destinationZip(data[1].ZipCode);
			self.salesOrderAuditViewModel.initializeAuditDetails(data[0].ProcessDetails);
		},
			faliureCallBack = function () {
			};
		self.salesOrderClient.GetVendorBillAddressForInvoiceResolution(self.vendorBillId(), successCallBack, faliureCallBack);
	}

	public cleanUp() {
		var self = this;

		self.salesOrderReBillOriginalItemViewModel.cleanup();
		self.salesOrderReBillAdjustItemViewModel.cleanup();
		self.salesOrderReBillVendorItemViewModel.cleanup();
		self.obcSalesOrderOptionList.cleanup();

		self.adjustedOrderItemList.removeAll();
		self.auditFeeItemsList.removeAll();
		self.requoteReasonsList.removeAll();
		//delete self.adjustedOrderItem;

		//delete self.obcSalesOrderOptionList;
		//delete self.revenueChanged;
		//delete self.checkMsgClick;
		//delete self.checkMsgHide;
		//delete self.getBITrackChange;

		for (var property in self) {
			if (property != "cleanup")
				delete self[property];
		}

		delete self;
	}
	//#endregion
}