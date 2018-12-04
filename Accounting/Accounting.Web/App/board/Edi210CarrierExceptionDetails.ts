/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region REFERENCES
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../services/models/TypeDefs/Report.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion

//#region IMPORT
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refReportClient = require('services/client/ReportClient');
import refBoardReportRequestModel = require('services/models/report/BoardReportRequest');
import refEnums = require('services/models/common/Enums');
import refValidations = require('services/validations/Validations');
import refEdi210CarrierExceptionItemView = require('board/Edi210CarrierExceptionItemView');
import refEdi210CarrierExceptionDuplicateBillItemView = require('board/Edi210CarrierExceptionDuplicateBillItemView');
import refEdi210CarrierExceptionOriginalBillItemView = require('board/Edi210CarrierExceptionOriginalBillItemView');
import refBoardsClient = require('services/client/BoardsClient');
import refUpdateDuplicatePRO = require('services/models/Board/UpdateDuplicatePRO');
import refVendorBillContainerModel = require('services/models/vendorBill/VendorBillContainer');
import refEDI210InputParameterContainerModel = require('services/models/Board/EDI210InputParameter');
import _refEDI210ItemUnmappedMpdel = require('services/models/Board/Edi210ItemUnmappedCodeMapping');
import _refVendorBillItemModel = require('services/models/vendorBill/VendorBillItemDetails');
import refEdi210CarrierExceptionSubBillItemView = require('board/Edi210CarrierExceptionSubBillItemView');
//#endregion

/*
** <summary>
** Report Finalized Order With No Vendor Bills View Model.
** </summary>
** <createDetails>
** <id>US13250</id> <by>Chandan</by> <date>11-27-2014</date>
** </createDetails>
** <changeHistory>
** <id>US19330</id> <by>Baldev Singh Thakur</by> <date>02-11-2015</date>
** <id>DE20711</id> <by>Baldev Singh Thakur</by> <date>19-11-2015</date>
** <id>DE20578</id> <by>Chandan Singh Bajetha</by> <date>23-11-2015</date>
** <id>DE25310</id> <by>Baldev Singh Thakur</by> <date>23-12-2016</date>
** <id>US31384</id> <by>Baldev Singh Thakur</by> <date>01-12-2017</date>
** </changeHistory>
*/
export class Edi210CarrierExceptionReportsViewModel {
	//#region MEMBERS
	public edi210CarrierExceptionItemViewModel: refEdi210CarrierExceptionItemView.Edi210CarrierExceptionItemViewModel;
	public edi210CarrierExceptionDuplicateBillItemViewModel: refEdi210CarrierExceptionDuplicateBillItemView.Edi210CarrierExceptionDuplicateBillItemViewModel;
	public edi210CarrierExceptionOriginalBillItemViewModel: refEdi210CarrierExceptionOriginalBillItemView.Edi210CarrierExceptionOriginalBillItemViewModel;
	public edi210CarrierExceptionSubBillItemView: refEdi210CarrierExceptionSubBillItemView.Edi210CarrierExceptionSubBillItemView;

	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	boardClient: refBoardsClient.BoardsClientCommands = new refBoardsClient.BoardsClientCommands();
	VendorBillOriginalData = refVendorBillContainerModel.Models.VendorBillContainer;
	////VendorBillDuplicateDataContainer: refVendorBillContainerModel.Models.VendorBillContainer;
	EDI210InputParameterContainer: refEDI210InputParameterContainerModel.Models.EDI210Inputparameter;
	proNumberOriginalVB: KnockoutObservable<string> = ko.observable('');
	mainBolNumberOriginalVB: KnockoutObservable<string> = ko.observable('');
	//Internal Dispute Date
	billDate: KnockoutObservable<any> = ko.observable('');
	//Date Picker
	datepickerOptions: DatepickerOptions;
	vendorBillId: KnockoutObservable<number> = ko.observable(0);
	isCheckedInactive: KnockoutObservable<boolean> = ko.observable(false);
	//List progress for Details section only
	listProgressEDIDetials: KnockoutObservable<boolean> = ko.observable(false);
	isEnableAllButtonAfterSuccessCall: KnockoutObservable<boolean> = ko.observable(false);
	exceptionRuleID: KnockoutObservable<number> = ko.observable();
	selectedExceptionRule: KnockoutObservable<number> = ko.observable();
	exceptionRule: KnockoutObservable<string> = ko.observable();
	exceptionRuleLabel: KnockoutObservable<string> = ko.observable();
	//Flags for set UI as per requirement
	isSave: KnockoutObservable<boolean> = ko.observable(false);
	isSaveEnable: KnockoutObservable<boolean> = ko.observable(false);
	isSaveEnableUnmappedItem: KnockoutObservable<boolean> = ko.observable(false);
	isItem: KnockoutObservable<boolean> = ko.observable(false);
	isInactiveButton: KnockoutObservable<boolean> = ko.observable(false);
	isReprocess: KnockoutObservable<boolean> = ko.observable(false);
	isCreateSubBill: KnockoutObservable<boolean> = ko.observable(false);
	isCreateSubBillenable: KnockoutObservable<boolean> = ko.observable(false);
	isInactiveCheckBox: KnockoutObservable<boolean> = ko.observable(false);
	isOrginalBol: KnockoutObservable<boolean> = ko.observable(false);
	isDuplicateBillOrOriginalBillItems: KnockoutObservable<boolean> = ko.observable(false);
	isPurchaseOrder: KnockoutObservable<boolean> = ko.observable(false);
	isForceAttach: KnockoutObservable<boolean> = ko.observable(false);
	isCreateSubbillItemsEnable: KnockoutObservable<boolean> = ko.observable(true);
	showSubbillItemsView: KnockoutObservable<boolean> = ko.observable(false);
	//set Mode for create comman method if exception rule ID is7,8,9 then mode 2
	Mode: number;
	bolNumber: KnockoutObservable<string> = ko.observable('');
	CarrierID: KnockoutObservable<number> = ko.observable(0);
	ediDetailsId: KnockoutObservable<number> = ko.observable(0);
	BatchId: KnockoutObservable<number> = ko.observable(0);
	proNumber: KnockoutObservable<any> = ko.observable('');
	shipmentID: KnockoutObservable<number> = ko.observable(0);
	po: KnockoutObservable<any> = ko.observable('');
	referenceNo: KnockoutObservable<any> = ko.observable('');
	ediBol: KnockoutObservable<any> = ko.observable('');
	carrierName: KnockoutObservable<string> = ko.observable('');
	ID: KnockoutObservable<number> = ko.observable(0);
	BillStatus: KnockoutObservable<string> = ko.observable('');
	ProcessStatus: KnockoutObservable<string> = ko.observable('');
	//This flag using for reprocess
	isCorrected: KnockoutObservable<boolean> = ko.observable(false);
	commonUtils = new Utils.Common();
	updateDuplicatePROModel: refUpdateDuplicatePRO.Models.UpdateDuplicatePRO = null;
	onButtonActionClick: () => any;
	originalBol: KnockoutObservable<any> = ko.observable('');
	totalCostDifference: KnockoutObservable<number> = ko.observable(0);
	checkedLineItems: KnockoutObservableArray<any> = ko.observableArray([]);
	localStorageKey: KnockoutObservable<string> = ko.observable('');
	//changeProp: () => any;
	//#endregion

	//#region CONSTRUCTOR
	constructor(onButtonActionClick: () => any) {
		var self = this;
		self.onButtonActionClick = onButtonActionClick;
		self.edi210CarrierExceptionItemViewModel = new refEdi210CarrierExceptionItemView.Edi210CarrierExceptionItemViewModel((saveButtonFlag: boolean) => {
			self.isSaveEnable(saveButtonFlag);
			self.isSaveEnableUnmappedItem(saveButtonFlag);
		});
		self.edi210CarrierExceptionDuplicateBillItemViewModel = new refEdi210CarrierExceptionDuplicateBillItemView.Edi210CarrierExceptionDuplicateBillItemViewModel((countedItems) => {
			// We remove all the items selected for creating sub bill
			self.checkedLineItems.removeAll();
			// Add the selected items for which a sub bill has to be created
			self.checkedLineItems.push(countedItems);
		}, () => {
				self.onCreateSubbillItems();
			});
		self.edi210CarrierExceptionOriginalBillItemViewModel = new refEdi210CarrierExceptionOriginalBillItemView.Edi210CarrierExceptionOriginalBillItemViewModel;
		self.edi210CarrierExceptionSubBillItemView = new refEdi210CarrierExceptionSubBillItemView.Edi210CarrierExceptionSubBillItemView;
		//set local storage key by url
		var url = $(location).attr('href');
		var urlArray = url.split('/');
		var localStorageId = urlArray.pop().toString().replace(/#/g, "");
		self.localStorageKey(localStorageId);
		if (localStorageId === "Edi210CarrierException") {
			self.localStorageKey(localStorageId + "37");
		} else {
			self.localStorageKey(localStorageId);
		}

		//To set The date picker options
		self.datepickerOptions = {
			blockWeekend: true,
			blockPreviousDays: false,
			blockHolidaysDays: true,
			autoClose: true,
			placeBelowButton: false,
		};

		self.isCheckedInactive.subscribe((newValue) => {
			if (self.exceptionRule() === "Unmapped Code") {
				//////if (self.isCheckedInactive() || self.edi210CarrierExceptionItemViewModel.selecteditemCodeANSICode() !== null || self.edi210CarrierExceptionItemViewModel.selecteditemCodesCarrierID() !== null) {
				//////	self.isSaveEnable(true);
				//////} else {
				//////	self.isSaveEnable(false);
				//////}
				if (self.isCheckedInactive()) {
					self.isSaveEnable(true);
				} else if (self.isSaveEnableUnmappedItem()) {
					self.isSaveEnable(true);
				} else {
					self.isSaveEnable(false);
				}
			} else {
				if (self.isCheckedInactive()) {
					self.isSaveEnable(true);
				} else {
					self.isSaveEnable(false);
				}
			}
		});

		return self;
		//#endregion
	}

	//#region Public Method

	//initilize Method to get edit details data on Unmapped Code exception rule
	public initilizeUnmappedCode(selectedExceptionRule: number, EDIDetailsId: number, selectedBatchId: number) {
		var self = this;
		self.setFlagForUI(selectedExceptionRule);
		self.clearEditDetailsData();
		self.ediDetailsId(EDIDetailsId);
		self.BatchId(selectedBatchId);
		self.edi210CarrierExceptionItemViewModel.ediItemsList.removeAll();
		self.listProgressEDIDetials(true);
		//self.boardClient.GetEDI210ExceptionDetails(EDIDetailsId, (data) => {
		//	if (data != null) {
		//		LocalStorageController.Set(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult',data);
		//		if (data.EDI210ExceptionDetailsItems !== undefined) {
		//			self.ID(data.EDI210ExceptionDetailsItems[0].ID);
		//		}
		//		self.bindEdi210DuplicateExceptionCarrierDetails(data.Edi210DuplicateExceptionCarrierDetails);
		//		self.edi210CarrierExceptionItemViewModel.GetCarrierCode(data.Edi210DuplicateExceptionCarrierDetails.CarrierID);
		//		self.edi210CarrierExceptionItemViewModel.initilizeEDIItemDetails(data.EDI210ExceptionDetailsItems);
		//	}
		//}, () => { });
		var successCallBack = data => {
			if (data != null) {
				LocalStorageController.Set(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult', data);
				if (data.EDI210ExceptionDetailsItems !== undefined) {
					data.EDI210ExceptionDetailsItems.forEach((item, collection) => {
						//self.ID(data.EDI210ExceptionDetailsItems[0].ID);
						self.ID(item.ID);
					});
				}
				self.bindEdi210DuplicateExceptionCarrierDetails(data.Edi210DuplicateExceptionCarrierDetails);
				self.edi210CarrierExceptionItemViewModel.GetCarrierCode(data.Edi210DuplicateExceptionCarrierDetails.CarrierID);
				self.edi210CarrierExceptionItemViewModel.initilizeEDIItemDetails(data.EDI210ExceptionDetailsItems);
			}
		},
			faliureCallBack = message => {
			};

		if (LocalStorageController.Get(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult')) {
			successCallBack(LocalStorageController.Get(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult'));
		} else {
			self.boardClient.GetEDI210ExceptionDetails(EDIDetailsId, successCallBack, faliureCallBack);
		}
	}

	//initilize Method to get edit details data on Duplicate PRO exception rule
	public initilizeDuplicatePRO(selectedExceptionRule: number, EDIDetailsId: number, BOL: string, selectedBatchId: number) {
		var self = this;
		self.setFlagForUI(selectedExceptionRule);
		self.clearEditDetailsData();
		self.BatchId(selectedBatchId);
		self.edi210CarrierExceptionDuplicateBillItemViewModel.ediDuplicateItemsList.removeAll();
		self.edi210CarrierExceptionOriginalBillItemViewModel.ediOriginalItemsList.removeAll();
		self.listProgressEDIDetials(true);
		self.ediDetailsId(EDIDetailsId);
		self.GetExceptionDetails();
	}

	//initilize Method to get edit details data on Corrected exception rule
	public initilizeCorrected(selectedExceptionRule: number, EDIDetailsId: number, selectedBatchId: number) {
		var self = this;
		self.setFlagForUI(selectedExceptionRule);

		self.clearEditDetailsData();
		self.BatchId(selectedBatchId);
		self.edi210CarrierExceptionDuplicateBillItemViewModel.ediDuplicateItemsList.removeAll();
		self.edi210CarrierExceptionOriginalBillItemViewModel.ediOriginalItemsList.removeAll();
		self.listProgressEDIDetials(true);
		self.ediDetailsId(EDIDetailsId);
		self.GetExceptionDetails();
	}

	//initilize Method to get edit details data on BOL Not Completed, BOL Cancled OR Carrier Not Mapped exception rule
	public initilizeBOLNotCompletedBOLCancledOrCarrierNotMapped(selectedExceptionRule: number, EDIDetailsId: number, BOL: string, selectedBatchId: number) {
		var self = this;
		self.setFlagForUI(selectedExceptionRule);
		self.clearEditDetailsData();
		self.ediDetailsId(EDIDetailsId);
		self.BatchId(selectedBatchId);
		self.listProgressEDIDetials(true);
		self.GetExceptionDetails();
		self.setFlagForUI(selectedExceptionRule);
	}

	//For get exception details data for all exception rule id
	public GetExceptionDetails() {
		var self = this;
		self.clearEditDetailsData();
		self.checkedLineItems.removeAll();
		self.setFormMode();
		if (self.Mode == 2) {
			self.listProgressEDIDetials(true);
			//self.boardClient.GetExceptionDetailsMetaSource(self.ediDetailsId(), (data: IEdi210DuplicateExceptionDetailsContainer) => {
			//	if (data != null) {
			//		self.bindEdi210DuplicateExceptionCarrierDetails(data.Edi210DuplicateExceptionCarrierDetails);
			//	}
			//},
			//	() => {
			//	});
			var successCallBack = data => {
				if (data != null) {
					LocalStorageController.Set(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult', data);
					self.bindEdi210DuplicateExceptionCarrierDetails(data.Edi210DuplicateExceptionCarrierDetails);
				}
			},
				failureCallBack = message => {
				}
			if (LocalStorageController.Get(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult')) {
				successCallBack(LocalStorageController.Get(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult'));
			} else {
				self.boardClient.GetExceptionDetailsMetaSource(self.ediDetailsId(), successCallBack, failureCallBack);
			}
		} else {
			self.listProgressEDIDetials(true);

			////Generate Vendor Bill for EdidetailsId (vendorBillDuplicate)
			//self.boardClient.GenerateVendorBill(self.ediDetailsId(), self.selectedExceptionRule(), (data) => {
			//	self.bindEdi210DuplicateExceptionCarrierDetails(data.ExceptionDetailsMetaSource);
			//	self.edi210CarrierExceptionOriginalBillItemViewModel.initilizeOriginalItems(data.VenderBillOriginalContainer.VendorBillItemsDetail);
			//	self.edi210CarrierExceptionDuplicateBillItemViewModel.initilizeDuplicateItems(data.VenderBillDuplicateContainer.VendorBillItemsDetail);

			//    self.EDI210InputParameterContainer = new refEDI210InputParameterContainerModel.Models.EDI210Inputparameter();

			//    self.checkCostDifference(data.VenderBillDuplicateContainer.VendorBillItemsDetail);

			//	self.EDI210InputParameterContainer.VendorBillDuplicateData = data.VenderBillDuplicateContainer;

			//    self.isPurchaseOrder(data.VenderBillOriginalContainer.IsPurchaseOrder);

			//    if (data.VenderBillOriginalContainer.VendorBill != null) {
			//        self.EDI210InputParameterContainer.OriginalVBProNumber = data.VenderBillOriginalContainer.VendorBill.ProNumber;
			//        self.EDI210InputParameterContainer.OriginalVBMainBolNumber = data.VenderBillOriginalContainer.VendorBill.MainVendorBolNumber;
			//    }
			//    self.EDI210InputParameterContainer.EdiDetailsId = self.ediDetailsId();
			//    if (data.VenderBillDuplicateContainer.VendorBill.BolNumber != null) {
			//        self.originalBol(data.VenderBillDuplicateContainer.VendorBill.BolNumber);
			//    }

			//    if ((self.totalCostDifference() > 0) && data.VenderBillOriginalContainer.VendorBillItemsDetail.length > 0) {
			//        self.isEnableAllButtonAfterSuccessCall(true);
			//    } else {
			//        self.isEnableAllButtonAfterSuccessCall(false);
			//    }

			//    if (self.isPurchaseOrder()) {
			//        self.isCreateSubBill(false);
			//    }

			//    // Condition to check if there are no items in Original bill and the selected exception rule is corrected
			//    if ((data.VenderBillOriginalContainer.VendorBillItemsDetail.length === 0) && (self.selectedExceptionRule() === 3)) {
			//        var toastrOptions = {
			//            toastrPositionClass: "toast-top-middle",
			//            delayInseconds: 10,
			//            fadeOut: 10,
			//            typeOfAlert: "",
			//            title: ""
			//        }
			//        Utility.ShowToastr(true, ApplicationMessages.Messages.NoOriginalBillFound , "Success", null, toastrOptions);
			//    }
			//}, () => {
			//});
			var SuccessCallBack = data => {
				LocalStorageController.Set(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult', data);
				self.edi210CarrierExceptionSubBillItemView.GetCarrierCode(data.ExceptionDetailsMetaSource.CarrierID);
				self.bindEdi210DuplicateExceptionCarrierDetails(data.ExceptionDetailsMetaSource);
				self.edi210CarrierExceptionOriginalBillItemViewModel.initilizeOriginalItems(data.VenderBillOriginalContainer.VendorBillItemsDetail);
				self.edi210CarrierExceptionDuplicateBillItemViewModel.initilizeDuplicateItems(data.VenderBillDuplicateContainer.VendorBillItemsDetail);

				self.EDI210InputParameterContainer = new refEDI210InputParameterContainerModel.Models.EDI210Inputparameter();

				self.checkCostDifference(data.VenderBillDuplicateContainer.VendorBillItemsDetail);

				self.EDI210InputParameterContainer.VendorBillDuplicateData = data.VenderBillDuplicateContainer;

				self.isPurchaseOrder(data.VenderBillOriginalContainer.IsPurchaseOrder);

				if (data.VenderBillOriginalContainer.VendorBill != null) {
					self.EDI210InputParameterContainer.OriginalVBProNumber = data.VenderBillOriginalContainer.VendorBill.ProNumber;
					self.EDI210InputParameterContainer.OriginalVBMainBolNumber = data.VenderBillOriginalContainer.VendorBill.MainVendorBolNumber;
				}
				self.EDI210InputParameterContainer.EdiDetailsId = self.ediDetailsId();
				if (data.VenderBillDuplicateContainer.VendorBill.BolNumber != null) {
					self.originalBol(data.VenderBillDuplicateContainer.VendorBill.BolNumber);
				}

				if ((self.totalCostDifference() > 0) && data.VenderBillOriginalContainer.VendorBillItemsDetail.length > 0) {
					//if (self.totalCostDifference() > 0) {
					self.isEnableAllButtonAfterSuccessCall(true);
				} else {
					self.isEnableAllButtonAfterSuccessCall(false);
				}

				//if (data.VenderBillOriginalContainer.VendorBillItemsDetail.length > 0) {
				//	self.isCreateSubbillItemsEnable(true);
				//}
				//else {
				//	self.isCreateSubbillItemsEnable(false);
				//}

				if (self.isPurchaseOrder()) {
					self.isCreateSubBill(false);
				}

				// Condition to check if there are no items in Original bill and the selected exception rule is corrected
				if ((data.VenderBillOriginalContainer.VendorBillItemsDetail.length === 0) && (self.selectedExceptionRule() === 3)) {
					var toastrOptions: IToastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 5,
						fadeOut: 5,
						typeOfAlert: "",
						title: ""
					}
					// ###START: DE20578
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.NoOriginalBillFound, "info", null, toastrOptions);
					// ###END: DE20578
				}
			},
				FailureCallBack = message => {
				}
			if (LocalStorageController.Get(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult')) {
				SuccessCallBack(LocalStorageController.Get(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult'));
			} else {
				self.boardClient.GenerateVendorBill(self.ediDetailsId(), self.selectedExceptionRule(), SuccessCallBack, FailureCallBack);
			}
		}
	}

	//these Method will call for show UI
	public setFlagForUI(selectedExceptionRule: number) {
		var self = this;
		self.showSubbillItemsView(false);
		self.selectedExceptionRule(selectedExceptionRule);
		self.exceptionRule(self.commonUtils.getEnumValueById(refEnums.Enums.ExceptionRuleId, selectedExceptionRule.toString()));
		self.exceptionRuleLabel("EDI " + self.commonUtils.getEnumValueById(refEnums.Enums.ExceptionRuleId, selectedExceptionRule.toString()) + " Exception");

		//For boolean value to show view as per exception rule Id
		if (self.exceptionRule() === "Unmapped Code" || self.exceptionRule() === "Corrected" || self.exceptionRule() === "Duplicate PRO") {
			self.isSave(true);
		} else {
			self.isSave(false);
		}

		//For boolean value to show view as per exception rule Id
		if (self.exceptionRule() === "Unmapped Code") {
			self.isItem(true);
		} else {
			self.isItem(false);
		}

		// ###START: US19330
		// For boolean value to show view as per exception rule Id
		if (self.exceptionRule() === "BOL Cancelled") {
			self.isInactiveButton(true);
		} else {
			self.isInactiveButton(false);
		}
		// ###END: US19330

		//For boolean value to show view as per exception rule Id
		if (self.exceptionRule() === "BOL Cancelled" || self.exceptionRule() === "BOL Not Completed" || self.exceptionRule() === "Carrier Not Mapped") {
			self.isReprocess(true);
		} else {
			self.isReprocess(false);
		}

		//For boolean value to show view as per exception rule Id
		if (self.exceptionRule() === "Corrected" || self.exceptionRule() === "Duplicate PRO") {
			self.isCreateSubBill(true);
		} else {
			self.isCreateSubBill(false);
		}

		//For boolean value to show view as per exception rule Id
		if (self.exceptionRule() === "Corrected" || self.exceptionRule() === "Duplicate PRO" || self.exceptionRule() === "Unmapped Code") {
			self.isInactiveCheckBox(true);
		} else {
			self.isInactiveCheckBox(false);
		}

		//For boolean value to show view as per exception rule Id
		if (self.exceptionRule() === "Corrected") {
			self.isOrginalBol(true);
		} else {
			self.isOrginalBol(false);
		}

		//For boolean value to show view as per exception rule Id
		if (self.exceptionRule() === "Corrected" || self.exceptionRule() === "Duplicate PRO") {
			self.isDuplicateBillOrOriginalBillItems(true);
		} else {
			self.isDuplicateBillOrOriginalBillItems(false);
		}
	}

	//Set mode for Exception rule id For last three it is
	public setFormMode() {
		var self = this;
		if (self.selectedExceptionRule() === 7 || self.selectedExceptionRule() === 8 || self.selectedExceptionRule() === 9) {
			self.Mode = 2;
		} else {
			self.Mode = 1;
		}
	}

	//Binding datat on for UI
	public bindEdi210DuplicateExceptionCarrierDetails(data: IEdi210DuplicateExceptionCarrierDetails) {
		var self = this;
		self.bolNumber(data.BOLNumber);
		self.billDate(self.commonUtils.formatDate(data.BillDate, 'mm/dd/yyyy'));
		self.CarrierID(data.CarrierID);
		self.carrierName(data.CarrierName);
		self.ediBol(data.EDIBol);
		self.po(data.PO);
		self.proNumber(data.ProNumber);
		self.referenceNo(data.ReferenceNo);
		self.listProgressEDIDetials(false);
		self.isEnableAllButtonAfterSuccessCall(true);
		self.shipmentID(data.ShipmentID);
		self.BillStatus(data.VBStatusDisplay);
		self.ProcessStatus(data.ProcessStatusDisplay);
		self.vendorBillId(data.VendorBillId);
	}

	//for clear all fields of exception details
	public clearEditDetailsData() {
		var self = this;
		self.bolNumber('');
		self.billDate('');
		//self.CarrierID('');
		self.carrierName('');
		self.ediBol('');
		self.po('');
		self.proNumber('');
		self.referenceNo('');
	}

	//Open SalesORder details on Click BOl
	public onClickBOLNumber() {
		var self = this;
		if (self.shipmentID() !== 0) {
			_app.trigger("openSalesOrder", self.shipmentID(), self.bolNumber(), (callback) => {
				if (!callback) {
					return;
				}
			});
		}
	}

	//For reprocess Status it will return bool value
	public getReprocessStatus() {
		var self = this;

		// ###START: DE20711
		//disable all button after click
		self.isEnableAllButtonAfterSuccessCall(false);
		self.boardClient.GetReprocessStatus(self.ediDetailsId(), self.selectedExceptionRule(), self.bolNumber(), (data) => {

			var toastrOptions: IToastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 3,
				fadeOut: 3,
				typeOfAlert: "",
				title: ""
			}

			if (data !== undefined || data !== null) {

				if (data.StatusCode === 200) {

					// ###START: DE20578
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.applicationResolved, "success", null, toastrOptions);
					// ###END: DE20578

					//back to main page
					self.onButtonActionClick();
				}
				else if (data.StatusCode == -1) {

					// ###START: DE20578
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.CarrierNotMapped, "error", null, toastrOptions);
					// ###END: DE20578
				}
				else if (data.StatusCode == -2){
					// ###START: DE20578
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.applicationNoResolved, "error", null, toastrOptions);
					// ###END: DE20578
				}
			}

			//disable all button after click
			self.isEnableAllButtonAfterSuccessCall(true);
			//back to main page
			//self.onButtonActionClick();
		},
			// ###START: DE25310
			(message) => {
				//disable all button after click
				self.isEnableAllButtonAfterSuccessCall(true);
				//back to main page
				//self.onButtonActionClick();

				if (self.selectedExceptionRule() == 9) {
					var toastrOptions2: IToastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 3,
						fadeOut: 3,
						typeOfAlert: "",
						title: ""
					}

					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions2);
				}

				// ###END: DE25310
			});

		// ###END: DE20711
	}

	//For Make EDI Inactive it will return boolean value
	public getMakeOrderInactive() {
		var self = this;

		self.boardClient.GetMakeOrderInactive(self.ediDetailsId(), (data) => {
			if (data !== undefined || data !== null) {
				if (data === true) {
					var toasterOptions4: IToastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInSeconds: 5,
						fadeOut: 5,
						typeOfAlert: "",
						title: ""
					}
						// ###START: DE20578
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.ChangeEDIToInactive, "success", null, toasterOptions4);
					// ###END: DE20578
				} else {
					var toasterOptions5: IToastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInSeconds: 2,
						fadeOut: 2,
						typeOfAlert: "",
						title: ""
					}
						// ###START: DE20578
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ChangeEDIToInactiveErrorMessage, "error", null, toasterOptions5);
					// ###END: DE20578
				}
			} else {
				var toasterOptions6: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInSeconds: 2,
					fadeOut: 2,
					typeOfAlert: "",
					title: ""
				}
						// ###START: DE20578
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ChangeEDIToInactiveErrorMessage, "error", null, toasterOptions6);
				// ###END: DE20578
			}
			//disable all button after click
			self.isEnableAllButtonAfterSuccessCall(false);
			//Go back after click on Inactive
			self.onButtonActionClick();
		}, () => {
				//disable all button after click
				self.isEnableAllButtonAfterSuccessCall(false);
				//Go back after click on Inactive
				self.onButtonActionClick();
			})
	}

	public onCreateSubBill() {
		var self = this;
		// Pass only selected items for creating sub bill - start

		////VALIDATE ITEM NUMBERS AND TOTALAMOUNT BEFORE SAVING

		if (self.edi210CarrierExceptionSubBillItemView.validateItems())
			return false;

		if (self.edi210CarrierExceptionSubBillItemView.vendorBillItemsList().length > 0) {
			self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail.removeAll();
			var totalAmount = 0.0;
			self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail = self.getSubbillItemDetailsBeforeCreate();

			totalAmount = self.getTotalAmountForVBItems(self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail);
			self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBill.Amount = Math.round(totalAmount * 100);
		}
		else if ((self.checkedLineItems()[0] !== undefined) && (self.checkedLineItems()[0].length > 0)) {
			var totalAmount = 0.0;
			var selectedItems = self.getVendorBillItemsDetails();
			//self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail = self.getVendorBillItemsDetails();

			totalAmount = self.getTotalAmountForVBItems(selectedItems);
			if (totalAmount > 0) {
				self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail.removeAll();
				self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail = selectedItems;
				self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBill.Amount = Math.round(totalAmount * 100);
			}
			else {
				var toastrOptions: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 5,
					fadeOut: 5,
					typeOfAlert: "",
					title: ""
				}
				// ###START: DE20578
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, "Cannot create subbill with cost less than 0", "info", null, toastrOptions);
				// ###END: DE20578
				return false;
			}

			//for (var index = 0; index < self.checkedLineItems()[0].length; index++){
			//    self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail.push(self.checkedLineItems()[0][index]);
			//}
		}
		else {
			var totalAmount = 0.0;

			self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail.forEach(function (item) {
				item.Cost = item.Difference * 100;
			})

            totalAmount = self.getTotalAmountForVBItems(self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail);
			self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBill.Amount = Math.round(totalAmount);

			if (totalAmount < 0) {
				var toastrOptions: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					//delayInseconds: 3,
					fadeOut: 3,
					typeOfAlert: "",
					title: ""
				}
				// ###START: DE20578
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, "Cannot create subbill with cost less than 0", "info", null, toastrOptions);
				// ###END: DE20578
				return false;
			}
		}

		// Pass only selected items for creating sub bill - end

		self.boardClient.createEDIRecord(self.EDI210InputParameterContainer, (data) => {
			if (data) {
				//SuccessFully send for process or created sub bill
				var toasterOptions8: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInSeconds: 5,
					fadeOut: 5,
					typeOfAlert: "",
					title: ""
				}
				// ###START: DE20578
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.billhasSentForProcess, "success", null, toasterOptions8);
				// ###END: DE20578

				//disable all button after click
				self.isEnableAllButtonAfterSuccessCall(false);
				//Go back after click on save
				self.onButtonActionClick();
			}
		}, () => {
				//disable all button after click
				self.isEnableAllButtonAfterSuccessCall(false);
				//Go back after click on save
				self.onButtonActionClick();
			});
	}

	public onCreatePo() {
		var self = this;
		//var totalAmount = 0.0;

		if (self.edi210CarrierExceptionSubBillItemView.validateItems())
			return false;

		//self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail.forEach(function (item) {
		//    item.Cost = item.Difference * 100;
		//})

		//    self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail.forEach(function (item) {
		//    var differenceCostWithoutComma = item.Cost.toString();
		//    var check = differenceCostWithoutComma.indexOf(",");
		//    if (check === -1) {
		//        totalAmount += parseFloat(item.Cost.toString());
		//    } else {
		//        totalAmount += parseFloat(differenceCostWithoutComma.replace(/,/g, ""));
		//    }
		//})

		//self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBill.Amount = totalAmount;

		if (self.edi210CarrierExceptionSubBillItemView.vendorBillItemsList().length > 0) {
			self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail.removeAll();
			var totalAmount = 0.0;
			self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail = self.getSubbillItemDetailsBeforeCreate();

			totalAmount = self.getTotalAmountForVBItems(self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail);
			self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBill.Amount = Math.round(totalAmount * 100);
		}
		else if ((self.checkedLineItems()[0] !== undefined) && (self.checkedLineItems()[0].length > 0)) {
			var totalAmount = 0.0;
			var selectedItems = self.getVendorBillItemsDetails();
			//self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail = self.getVendorBillItemsDetails();

			totalAmount = self.getTotalAmountForVBItems(selectedItems);
			if (totalAmount > 0) {
				self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail.removeAll();
				self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail = selectedItems;
				self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBill.Amount = Math.round(totalAmount * 100);
			}
			else {
				var toastrOptions: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 5,
					fadeOut: 5,
					typeOfAlert: "",
					title: ""
				}
				// ###START: DE20578
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, "Cannot create PO with cost less than 0", "info", null, toastrOptions);
				// ###END: DE20578
				return false;
			}

			//for (var index = 0; index < self.checkedLineItems()[0].length; index++){
			//    self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail.push(self.checkedLineItems()[0][index]);
			//}
		}
		else {
			var totalAmount = 0.0;

			self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail.forEach(function (item) {
				item.Cost = item.Difference * 100;
			})

            totalAmount = self.getTotalAmountForVBItems(self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail);
			self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBill.Amount = Math.round(totalAmount);

			if (totalAmount < 0) {
				var toastrOptions: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 5,
					fadeOut: 5,
					typeOfAlert: "",
					title: ""
				}
				// ###START: DE20578
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, "Cannot create PO with cost less than 0", "info", null, toastrOptions);
				// ###END: DE20578
				return false;
			}
		}

		self.boardClient.UpdateProcessAgeForPO(self.EDI210InputParameterContainer, (data) => {
			if (data) {
				//SuccessFully send for process or created sub bill
				var toasterOptions8: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInSeconds: 5,
					fadeOut: 5,
					typeOfAlert: "",
					title: ""
				}
				// ###START: DE20578
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.billhasSentForProcess, "success", null, toasterOptions8);
				// ###END: DE20578

				//disable all button after click
				self.isEnableAllButtonAfterSuccessCall(false);
				//Go back after click on save
				self.onButtonActionClick();
			}
		}, () => {
				//disable all button after click
				self.isEnableAllButtonAfterSuccessCall(false);
				//Go back after click on save
				self.onButtonActionClick();
			});
	}

	//Updating EDI details on PRo
	public onSave() {
		var self = this;
		self.updateDuplicatePROModel = new refUpdateDuplicatePRO.Models.UpdateDuplicatePRO();
		self.updateDuplicatePROModel.EDIDetailID = self.ediDetailsId();
		self.updateDuplicatePROModel.IsActive = self.isCheckedInactive();
		self.updateDuplicatePROModel.BatchId = self.BatchId();
		self.updateDuplicatePROModel.Edi210ItemUnmappedCodeMapping = self.getEdiItemDetails();
		self.boardClient.UpdateDuplicatePRODetails(self.updateDuplicatePROModel, () => {
			self.isCheckedInactive(false);
			//SuccessFully saved
			var toasterOptions7: IToastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInSeconds: 5,
				fadeOut: 5,
				typeOfAlert: "",
				title: ""
			}
			// ###START: DE20578
            Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.UpdatedEDIForPro + self.proNumber(), "success", null, toasterOptions7);
			// ###END: DE20578

			//disable all button after click
			self.isEnableAllButtonAfterSuccessCall(false);
			//Go back after click on save
			self.onButtonActionClick();
		}, () => {
				//disable all button after click
				self.isEnableAllButtonAfterSuccessCall(false);
				//Go back after click on save even in failure call back
				self.onButtonActionClick();
			});
	}

	//onPronumberclick
	public onProNumberClick() {
		var self = this;
		if (self.vendorBillId() === 0)
			return false;

		_app.trigger("openVendorBill", self.vendorBillId(), self.proNumber(), (callback) => {
			if (!callback) {
				return;
			}
		});
	}

	public onCreateSubbillItems() {
		var self = this;
		var items = self.getVendorBillItemsDetails();
		self.showSubbillItemsView(true);
		self.isEnableAllButtonAfterSuccessCall(true);
		self.edi210CarrierExceptionSubBillItemView.beforeBind();
		self.edi210CarrierExceptionSubBillItemView.initializeVendorBillItemDetails(items, false, false);
	}

	// Gets the vendor bill Item details
	private getEdiItemDetails(): Array<IEdi210ItemUnmappedCodeMapping> {
		var self = this;

		var EDI210UnmappedItemModel: Array<_refEDI210ItemUnmappedMpdel.Models.Edi210ItemUnmappedCodeMapping>;
		EDI210UnmappedItemModel = ko.observableArray([])();
		// All the field values other than Description, Id and Mapped Code are hard coded as only these fields are update against the items
		self.edi210CarrierExceptionItemViewModel.ediItemsList().forEach((item, collection) => {
			var EDI210UnmappedItem = new _refEDI210ItemUnmappedMpdel.Models.Edi210ItemUnmappedCodeMapping();
			EDI210UnmappedItem.Cost = item.cost();
			EDI210UnmappedItem.Class = item.selectedClass();
			EDI210UnmappedItem.Description = item.description();
			EDI210UnmappedItem.ID = item.id();
			EDI210UnmappedItem.Item = '';
			EDI210UnmappedItem.Weight = item.weight();
			EDI210UnmappedItem.Pieces = item.pcs();
			EDI210UnmappedItem.Height = item.dimensionHeight();
			EDI210UnmappedItem.Width = item.dimensionWidth();
			EDI210UnmappedItem.Length = item.dimensionLength();
			EDI210UnmappedItem.MappedCode = item.mappedCode();

			EDI210UnmappedItemModel.push(EDI210UnmappedItem);
		});

		return EDI210UnmappedItemModel;
	}

	//#endregion Public Method

	//#region Private Method
	// To Clear the Local storage
	private clearLocalStorage(targetId) {
		if (LocalStorageController.Get(targetId + 'PO')) {
			LocalStorageController.Set(targetId + 'PO', undefined);
		}
	}
	// Converting if date is not valid
	private convertToBookedDate() {
		var self = this;
		if (!self.billDate().match('/') && self.billDate().length > 0) {
			self.billDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.billDate()));
		}
	}

	private checkCostDifference(items: Array<IVendorBillItem>) {
		var self = this;
		var total = 0.0;
		items.forEach(function (item) {
			total += item.Difference;
		})
        self.totalCostDifference(total);
	}

	// Gets the vendor bill Item details
	private getVendorBillItemsDetails(): Array<IVendorBillItem> {
		var self = this;

		var vendorBillItems: Array<_refVendorBillItemModel.Models.VendorBillItemDetails>;
		vendorBillItems = ko.observableArray([])();

		if (self.checkedLineItems().length > 0) {
			self.checkedLineItems()[0].forEach((item, collection) => {
				var vendorBillItem = new _refVendorBillItemModel.Models.VendorBillItemDetails();
				vendorBillItem.Cost = item.differenceAmount();
				vendorBillItem.DimensionHeight = item.dimensionHeight();
				vendorBillItem.DimensionLength = item.dimensionLength();
				vendorBillItem.DimensionWidth = item.dimensionWidth();
				vendorBillItem.PieceCount = item.pcs();
				vendorBillItem.SelectedClassType = item.selectedClass();
				vendorBillItem.ItemName = item.items();
				vendorBillItem.ItemId = item.itemId();
				vendorBillItem.UserDescription = item.description();
				vendorBillItem.Weight = item.weight();
				vendorBillItem.SpecialChargeOrAllowanceCode = item.SpecialChargeOrAllowanceCode();
				vendorBillItems.push(vendorBillItem);
			});
		}
		return vendorBillItems;
	}

	// Gets the vendor bill Item details
	private getSubbillItemDetailsBeforeCreate(): Array<IVendorBillItem> {
		var self = this;

		var vendorBillItems: Array<_refVendorBillItemModel.Models.VendorBillItemDetails>;
		vendorBillItems = ko.observableArray([])();

		if (self.edi210CarrierExceptionSubBillItemView.vendorBillItemsList().length > 0) {
			self.edi210CarrierExceptionSubBillItemView.vendorBillItemsList().forEach((item, collection) => {
				var vendorBillItem = new _refVendorBillItemModel.Models.VendorBillItemDetails();
				vendorBillItem.Cost = item.cost();
				vendorBillItem.DimensionHeight = item.dimensionHeight();
				vendorBillItem.DimensionLength = item.dimensionLength();
				vendorBillItem.DimensionWidth = item.dimensionWidth();
				vendorBillItem.PieceCount = item.pieceCount();
				vendorBillItem.SelectedClassType = item.selectedClassType();
				vendorBillItem.ItemName = item.selectedItemTypes().ShortDescription;
				vendorBillItem.ItemId = parseInt(item.selectedItemTypes().ItemId);
				vendorBillItem.UserDescription = item.userDescription();
				vendorBillItem.Weight = item.weight();
				vendorBillItem.SpecialChargeOrAllowanceCode = item.mappedCode();

				vendorBillItems.push(vendorBillItem);
			});
		}

		return vendorBillItems;
	}

	private getTotalAmountForVBItems(items: Array<IVendorBillItem>) {
		var totalAmount = 0.0;
		items.forEach(function (item) {
			var differenceCostWithoutComma = item.Cost.toString();
			var check = differenceCostWithoutComma.indexOf(",");
			if (check === -1) {
				totalAmount += parseFloat(item.Cost.toString());
			} else {
				totalAmount += parseFloat(differenceCostWithoutComma.replace(/,/g, ""));
			}
		});
		return totalAmount;
	}

	//private getCheckedSubbillLineitems() {
	//    var self = this;
	//    var vendorBillItems: Array<IVendorBillItem>;
	//    vendorBillItems = ko.observableArray([])();
	//    self.checkedLineItems()[0].forEach((item, collection) => {
	//        //var vendorBillItem = new IVendorBillItem();
	//        var vendorBillItem = new Ivendorbillitem()
	//        vendorBillItem.ItemId = item.itemId();
	//        vendorBillItem.Cost = item.differenceAmount();
	//        vendorBillItem.DimensionHeight = item.dimensionHeight();
	//        vendorBillItem.DimensionLength = item.dimensionLength();
	//        vendorBillItem.DimensionWidth = item.dimensionWidth();
	//        vendorBillItem.PieceCount = item.pcs();
	//        vendorBillItem.SelectedClassType = item.selectedClass();
	//        vendorBillItem.ItemName = item.items();
	//        vendorBillItem.UserDescription = item.description();
	//        vendorBillItem.Weight = item.weight();

	//        vendorBillItems.push(vendorBillItem);
	//    });

	//}

	//#endregion Private Method

	//#region LIFE CYCLE EVENT
	// Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
	public attached() {
		_app.trigger('viewAttached');
	}

	//The composition engine will execute it prior to calling the binder.
	public activate() {
		return true;
	}

	//To load the registered data if any existed.
	public beforeBind() {
		var self = this

		//_app.trigger("loadMyData", function (data) {
		//	if (data) {
		//		self.load(data);

		//	} else {
		//	}
		//});
	}
	//#endregion
}
//return Edi210CarrierExceptionReportsViewModel;