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
import refSalesOrderitem = require('services/models/salesOrder/SalesOrderItemDetail');
import refSalesOrderReBillItemsModel = require('salesOrder/SalesOrderRebillItemsModel');
import refSalesOrderEditRebillContainer = require('services/models/salesOrder/SalesOrderREBillContainer');
import refSalesOrderShipmentRequoteReasonModel = require('services/models/salesOrder/SalesOrderShipmentRequoteReason');
import refSalesOrderShipmentRequoteReviewDetailsModel = require('services/models/salesOrder/SalesOrderRequoteReviewDetail');
import refSalesOrderReBillVendorItemViewModel = require('salesOrder/SalesOrderRebillVendorItemView');
//#endregion
/*
** <summary>
** Sales Order Rebill Edit View Model.
** </summary>
** <createDetails>
** <id>US13214</id> <by>Bhanu Pratap</by> <date>17th Nov, 2014</date>
** </createDetails>
** <changeHistory>
** <id></id> <by></by> <date></date>
** </changeHistory>
*/
class SalesOrderEditRebillViewModel {
	//#region Members
	salesOrderReBillOriginalItemViewModel: refSalesOrderReBillItemViewModel.SalesOrderReBillItemViewModel;
	salesOrderReBillAdjustItemViewModel: refSalesOrderReBillItemViewModel.SalesOrderReBillItemViewModel;
	salesOrderReBillVendorItemViewModel: refSalesOrderReBillVendorItemViewModel.SalesOrderRebillVendorBillItemViewModel;
	orginalItemList: Array<ISalesOrderItem>;
	adjustedOrderItemList: KnockoutObservableArray<ISalesOrderItem> = ko.observableArray([]);
	selectedorginalItemList: KnockoutObservableArray<refSalesOrderReBillItemsModel.Models.SalesOrderReBillItemsModel> = ko.observableArray([]);
	salesOrderClient: refSalesOrderClient.SalesOrderClient = new refSalesOrderClient.SalesOrderClient();
	name: KnockoutObservable<string> = ko.observable('Other');
	rebillRep: KnockoutObservable<string> = ko.observable('');
	oldOrgZip: KnockoutObservable<string> = ko.observable('');
	oldDestZip: KnockoutObservable<string> = ko.observable('');
	oldTotalWeigth: KnockoutObservable<number> = ko.observable(0);
	oldTotalAmount: KnockoutObservable<number> = ko.observable($.number(0, 2));
	oldTotalCost: KnockoutObservable<number> = ko.observable($.number(0, 2));
	oldClass: KnockoutObservable<string> = ko.observable('');
	newClass: KnockoutObservable<string> = ko.observable('');
	newOrgZip: KnockoutObservable<string> = ko.observable('');
	newDestZip: KnockoutObservable<string> = ko.observable('');
	isOtherReason: KnockoutObservable<boolean> = ko.observable(false);
	otherReason: KnockoutObservable<string> = ko.observable('');
	costDiff: KnockoutObservable<number> = ko.observable($.number(0, 2));
	newTotalWeight: KnockoutObservable<number> = ko.observable(0);
	newTotalCost: KnockoutObservable<number> = ko.observable($.number(0, 2));
	newTotalAmount: KnockoutObservable<number> = ko.observable($.number(0, 2));
	html: KnockoutObservable<string> = ko.observable('');
	crrReviewDate: KnockoutObservable<any> = ko.observable('');
	adjustmentDate: KnockoutObservable<any> = ko.observable('');
	datepickerOptions: DatepickerOptions;
	auditFeeItemsList: KnockoutObservableArray<refRequote.Model.RequoteBillModel> = ko.observableArray([]);
	requoteReasonsList: KnockoutObservableArray<refSalesOrderShipmentRequoteReasonModel.Model.SalesOrderShipmentRequoteReason> = ko.observableArray([]);
	salesOrderOptionListOptions: KnockoutObservableArray<IButtonControlOption> = ko.observableArray([]);
	salesOrderRequoteReviewDetail: refSalesOrderShipmentRequoteReviewDetailsModel.Model.SalesOrderRequoteReviewDetail;
	// common utils class object
	commonUtils: CommonStatic = new Utils.Common();
	obcSalesOrderOptionList: refSalesOrderOptionButtonControl.SalesOrderOptionButtonControl;
	shipmentItemTypes: KnockoutObservableArray<IShipmentItemType> = ko.observableArray([]);
	costDifference: number = 0;
	totalVBCost: number = 0;
	totalOriginalCost: number = 0;
	totalRevenue: number = 0;
	vendorItems: any;
	//selectedLineItem: (lineItem: ISalesOrderItem) => void;
	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	private checkMsgDisplay: boolean = true;

	// To fill cost and revenue from sales order details to review details
	cost: KnockoutObservable<number> = ko.observable(0);
	revenue: KnockoutObservable<number> = ko.observable(0);
	salesOrderId: KnockoutObservable<number> = ko.observable();
	// To disable save button
	isValidandSave: KnockoutObservable<boolean> = ko.observable(true);

	//#endregion

	//#region Constructor
	constructor() {
		var self = this;

		self.salesOrderReBillOriginalItemViewModel = new refSalesOrderReBillItemViewModel.SalesOrderReBillItemViewModel();
		self.salesOrderReBillAdjustItemViewModel = new refSalesOrderReBillItemViewModel.SalesOrderReBillItemViewModel();
		self.salesOrderReBillVendorItemViewModel = new refSalesOrderReBillVendorItemViewModel.SalesOrderRebillVendorBillItemViewModel();

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
	}

	//#endregion}

	//#region Internal public Methods

	public load(bindedData) {
		if (!bindedData)
			return;

		var self = this;
		var salesOrderId = bindedData;
		self.salesOrderId(salesOrderId);

		var successCallBack = function (data: ISalesOrderREBillContainer) {
			if (data != null)
				self.salesOrderReBillOriginalItemViewModel.initializeSalesOrderRebillItemDetails(data.OriginalItemDetail);
			self.totalOriginalCost = parseFloat(self.salesOrderReBillOriginalItemViewModel.salesOrderItemAmount());
			self.totalRevenue = parseFloat(self.salesOrderReBillOriginalItemViewModel.salesOrderRevenue());
			self.orginalItemList = data.OriginalItemDetail;
			self.adjustedOrderItemList(data.AdjustedItemDetail);
			self.salesOrderReBillOriginalItemViewModel.isSelect(false);
			self.salesOrderReBillOriginalItemViewModel.isBOLnumber(false);
			self.salesOrderReBillOriginalItemViewModel.gridHeader("Original Order");
			self.salesOrderReBillVendorItemViewModel.gridHeader("Vendor Bill Items");
			self.salesOrderReBillVendorItemViewModel.isSelect(false);
			self.salesOrderReBillAdjustItemViewModel.initializeSalesOrderRebillItemDetails(data.AdjustedItemDetail);
			self.salesOrderReBillAdjustItemViewModel.isSelect(false);
			self.salesOrderReBillAdjustItemViewModel.isBOLnumber(true);
			self.GetVendorBillItems();
			self.salesOrderReBillAdjustItemViewModel.gridHeader("Adjusted Order");
			self.oldClass(data.OldClass);
			self.newClass(data.NewClass);
			//	self.costDiff($.number(costDiffer, 2));
			if (data.SalesOrderDetails != null && data.SalesOrderDetails !== undefined) {
				self.oldOrgZip(data.SalesOrderDetails.OriginZip);
				self.oldDestZip(data.SalesOrderDetails.DestinationZip);
				self.oldTotalWeigth(data.SalesOrderDetails.TotalWeight);
				self.oldTotalAmount($.number(data.SalesOrderDetails.Revenue, 2));
				self.oldTotalCost($.number(data.SalesOrderDetails.Cost, 2));

				self.cost(data.SalesOrderDetails.Cost);
				self.revenue(data.SalesOrderDetails.Revenue);
			}
			if (data.SalesOrderRequoteReviewDetails != null) {
				self.salesOrderRequoteReviewDetail = data.SalesOrderRequoteReviewDetails;
				self.rebillRep(data.SalesOrderRequoteReviewDetails.ReviewedBy);
				self.adjustmentDate(data.SalesOrderRequoteReviewDetails.AdjustmentDate ? self.commonUtils.formatDate(data.SalesOrderRequoteReviewDetails.AdjustmentDate.toString(), 'mm/dd/yyyy') : '');
				self.crrReviewDate(data.SalesOrderRequoteReviewDetails.CRReviewDate ? self.commonUtils.formatDate(data.SalesOrderRequoteReviewDetails.CRReviewDate.toString(), 'mm/dd/yyyy') : '');
			}
			self.auditFeeItemsList.removeAll();
			data.SalesOrderRequoteReasonCodes.forEach(function (item) {
				self.auditFeeItemsList.push(new refRequote.Model.RequoteBillModel(item));
			});

			self.requoteReasonsList.removeAll();
			data.SalesOrderShipmentRequoteReasons.forEach(function (item) {
				self.requoteReasonsList.push(new refSalesOrderShipmentRequoteReasonModel.Model.SalesOrderShipmentRequoteReason(item));
			});

			if (self.requoteReasonsList().length > 0) {
				self.requoteReasonsList().forEach(function (reasonItem) {
					if (reasonItem.RequoteReasonID == 11) {
						self.isOtherReason(true);
						self.html('<i class="icon-ok icon-white active"></i>' + self.name());
						self.otherReason(reasonItem.Remarks);
					}
				});
			}
			self.salesOrderOptionListOptions.removeAll();
			if (self.auditFeeItemsList().length > 0 && self.requoteReasonsList().length > 0) {
				self.auditFeeItemsList().forEach(function (item) {
					if (item.id != 11) {
						var check = false;
						self.requoteReasonsList().forEach(function (reasonItem) {
							if (reasonItem.RequoteReasonID == item.id) {
								check = true;
							}
						});
						self.salesOrderOptionListOptions.push({ id: item.id, name: item.name, selected: check, enabled: item.IsEnable });
					}
				});
				var argssalesOrderOptionList: IOptionButtonControlArgs = {
					options: self.salesOrderOptionListOptions(),
					useHtmlBinding: true,
					isMultiCheck: true,
					isVerticalView: false
				}

				self.obcSalesOrderOptionList.initializeButton(argssalesOrderOptionList, refEnums.Enums.OptionButtonsView.Matrix);
			}
			// if there is no Shipment reasons
			else {
				self.auditFeeItemsList().forEach(function (item) {
					if (item.id != 11) {
						var check = false;
						self.salesOrderOptionListOptions.push({ id: item.id, name: item.name, selected: check, enabled: item.IsEnable });
					}
				});
				var argssalesOrderOptionList: IOptionButtonControlArgs = {
					options: self.salesOrderOptionListOptions(),
					useHtmlBinding: true,
					isMultiCheck: true,
					isVerticalView: false
				}

				self.obcSalesOrderOptionList.initializeButton(argssalesOrderOptionList, refEnums.Enums.OptionButtonsView.Matrix);
			}
		},
			faliureCallBack = function () {
			};
		self.salesOrderClient.GetSalesOrderRebill(salesOrderId, successCallBack, faliureCallBack);
	}

	public GetVendorBillItems() {
		var self = this;
		//self.listProgress(true);
		var successCallBack = function (data) {
			//self.listProgress(false);
			var commonUtils = new Utils.Common();
			var totalCost = 0.0;
			self.salesOrderReBillVendorItemViewModel.InitializeVendorBillItems(data);
			data.forEach(function (item) {
				if (item.Cost) {
					//var costWithoutComma = item.Cost.toString();
					//var check = costWithoutComma.indexOf(",");
					//if (check === -1) {
						totalCost += parseFloat(item.Cost);
					//} else {
						//For removing comma before addition because parseFloat is not taking digit after comma at adding time
						//totalCost += parseFloat(costWithoutComma.replace(/,/g, ""));
					//}
				}
			});
		self.totalVBCost = totalCost;
		},
			faliureCallBack = function () {
				//self.listProgress(false);
			};
		self.salesOrderClient.GetVendorBillItemsForInvoiceResolution(self.salesOrderId(), successCallBack, faliureCallBack);
		//self.listProgress(false);
	}

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

	//#region Save
	public onSave() {
		var self = this;
		if (self.ValidateCRRReviewDate()) {
			self.validAndSave();
		}
	}

	public validAndSave() {
		var self = this;
		var salesOrderRebillData = new refSalesOrderEditRebillContainer.Model.SalesOrderREBillContainer();
		salesOrderRebillData.SalesOrderRequoteReviewDetails = self.getRequoteReviewDetails();
		salesOrderRebillData.SalesOrderShipmentRequoteReasons = self.getShipmentRequoteReasons();
		self.isValidandSave(false);
		refSalesOrderClient.SalesOrderClient.prototype.SaveSalesOrderRebillDetail(salesOrderRebillData, (message) => {
			self.isValidandSave(true);
			if (self.checkMsgDisplay) {
				self.checkMsgDisplay = false;
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 15,
					fadeOut: 15,
					typeOfAlert: "",
					title: ""
				}
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.RebillSavedSuccessfully, "success", self.checkMsgClick, toastrOptions, self.checkMsgHide);
			}
		},
			(message) => {
				self.isValidandSave(true);
			});
	}

	public ValidateCRRReviewDate() {
		var self = this;
		if (self.crrReviewDate() === null || self.crrReviewDate() === "") {
			if (self.checkMsgDisplay) {
				self.checkMsgDisplay = false;
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 15,
					fadeOut: 15,
					typeOfAlert: "",
					title: ""
				}
          Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectCRRReviewDate, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
			}
			return false;
		}
		else {
			return true;
		}
	}

	public getRequoteReviewDetails(): ISalesOrderRequoteReviewDetail {
		var self = this;
		var salesOrderRequoteReviewDetail = new refSalesOrderShipmentRequoteReviewDetailsModel.Model.SalesOrderRequoteReviewDetail();
		if (self.salesOrderRequoteReviewDetail !== null && self.salesOrderRequoteReviewDetail !== undefined) {
			salesOrderRequoteReviewDetail.ID = self.salesOrderRequoteReviewDetail.ID;
			salesOrderRequoteReviewDetail.IsBillAudited = self.salesOrderRequoteReviewDetail.IsBillAudited;
		}
		salesOrderRequoteReviewDetail.AdjustmentDate = self.adjustmentDate();
		salesOrderRequoteReviewDetail.CRReviewDate = self.crrReviewDate();
		salesOrderRequoteReviewDetail.IsManualReviewed = true;
		salesOrderRequoteReviewDetail.Reviewed = 1;
		salesOrderRequoteReviewDetail.ReviewedBy = self.rebillRep();
		salesOrderRequoteReviewDetail.TotalCostAdjustment = (self.totalVBCost - self.totalOriginalCost);
		salesOrderRequoteReviewDetail.TotalRevenueAdjustment = self.totalRevenue;
		salesOrderRequoteReviewDetail.SalesOrderId = self.salesOrderId();
		return salesOrderRequoteReviewDetail;
	}

	public getShipmentRequoteReasons(): Array<ISalesOrderShipmentRequoteReason> {
		var self = this;
		var shipmentRequoteReasons: Array<refSalesOrderShipmentRequoteReasonModel.Model.SalesOrderShipmentRequoteReason>;
		shipmentRequoteReasons = ko.observableArray([])();

		var selectedList = self.obcSalesOrderOptionList.getSelectedOptions(true);

		selectedList.forEach((item) => {
			var shipmentRequoteReason = new refSalesOrderShipmentRequoteReasonModel.Model.SalesOrderShipmentRequoteReason();

			shipmentRequoteReason.ID = 0;
			shipmentRequoteReason.Remarks = item.name();
			shipmentRequoteReason.RequoteReasonID = item.id;

			shipmentRequoteReasons.push(shipmentRequoteReason);
		});

		if (self.isOtherReason()) {
			var shipmentRequoteReason = new refSalesOrderShipmentRequoteReasonModel.Model.SalesOrderShipmentRequoteReason();
			shipmentRequoteReason.ID = 0;
			shipmentRequoteReason.Remarks = self.otherReason();
			shipmentRequoteReason.RequoteReasonID = 11;
			shipmentRequoteReasons.push(shipmentRequoteReason);
		}

		return shipmentRequoteReasons;
	}

	//#endregion
	//#endregion

	//#region Internal private methods
	otherOption() {
		var self = this;

		if (!self.isOtherReason()) {
			self.isOtherReason(true);

			self.html('<i class="icon-ok icon-white active"></i>' + self.name());
		} else {
			self.isOtherReason(false);
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

	//#endregion

	//#region Life Cycle
	// Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
	public attached() {
		_app.trigger('viewAttached');
	}

	public activate() {
		return true;
	}

	public deactivate() {
	}

	public beforeBind() {
		var self = this;
		_app.trigger("loadMyData", data => {
			if (data) {
				self.load(data);
			}
		});
	}

	public compositionComplete(view, parent) {
	}

	//#endregion
}
return SalesOrderEditRebillViewModel;