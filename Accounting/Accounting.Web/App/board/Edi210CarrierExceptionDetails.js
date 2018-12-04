/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/models/common/Enums', 'services/validations/Validations', 'board/Edi210CarrierExceptionItemView', 'board/Edi210CarrierExceptionDuplicateBillItemView', 'board/Edi210CarrierExceptionOriginalBillItemView', 'services/client/BoardsClient', 'services/models/Board/UpdateDuplicatePRO', 'services/models/vendorBill/VendorBillContainer', 'services/models/Board/EDI210InputParameter', 'services/models/Board/Edi210ItemUnmappedCodeMapping', 'services/models/vendorBill/VendorBillItemDetails', 'board/Edi210CarrierExceptionSubBillItemView'], function(require, exports, ___router__, ___app__, __refEnums__, __refValidations__, __refEdi210CarrierExceptionItemView__, __refEdi210CarrierExceptionDuplicateBillItemView__, __refEdi210CarrierExceptionOriginalBillItemView__, __refBoardsClient__, __refUpdateDuplicatePRO__, __refVendorBillContainerModel__, __refEDI210InputParameterContainerModel__, ___refEDI210ItemUnmappedMpdel__, ___refVendorBillItemModel__, __refEdi210CarrierExceptionSubBillItemView__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    
    var refEnums = __refEnums__;
    var refValidations = __refValidations__;
    var refEdi210CarrierExceptionItemView = __refEdi210CarrierExceptionItemView__;
    var refEdi210CarrierExceptionDuplicateBillItemView = __refEdi210CarrierExceptionDuplicateBillItemView__;
    var refEdi210CarrierExceptionOriginalBillItemView = __refEdi210CarrierExceptionOriginalBillItemView__;
    var refBoardsClient = __refBoardsClient__;
    var refUpdateDuplicatePRO = __refUpdateDuplicatePRO__;
    var refVendorBillContainerModel = __refVendorBillContainerModel__;
    var refEDI210InputParameterContainerModel = __refEDI210InputParameterContainerModel__;
    var _refEDI210ItemUnmappedMpdel = ___refEDI210ItemUnmappedMpdel__;
    var _refVendorBillItemModel = ___refVendorBillItemModel__;
    var refEdi210CarrierExceptionSubBillItemView = __refEdi210CarrierExceptionSubBillItemView__;

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
    var Edi210CarrierExceptionReportsViewModel = (function () {
        //changeProp: () => any;
        //#endregion
        //#region CONSTRUCTOR
        function Edi210CarrierExceptionReportsViewModel(onButtonActionClick) {
            this.boardClient = new refBoardsClient.BoardsClientCommands();
            this.VendorBillOriginalData = refVendorBillContainerModel.Models.VendorBillContainer;
            this.proNumberOriginalVB = ko.observable('');
            this.mainBolNumberOriginalVB = ko.observable('');
            //Internal Dispute Date
            this.billDate = ko.observable('');
            this.vendorBillId = ko.observable(0);
            this.isCheckedInactive = ko.observable(false);
            //List progress for Details section only
            this.listProgressEDIDetials = ko.observable(false);
            this.isEnableAllButtonAfterSuccessCall = ko.observable(false);
            this.exceptionRuleID = ko.observable();
            this.selectedExceptionRule = ko.observable();
            this.exceptionRule = ko.observable();
            this.exceptionRuleLabel = ko.observable();
            //Flags for set UI as per requirement
            this.isSave = ko.observable(false);
            this.isSaveEnable = ko.observable(false);
            this.isSaveEnableUnmappedItem = ko.observable(false);
            this.isItem = ko.observable(false);
            this.isInactiveButton = ko.observable(false);
            this.isReprocess = ko.observable(false);
            this.isCreateSubBill = ko.observable(false);
            this.isCreateSubBillenable = ko.observable(false);
            this.isInactiveCheckBox = ko.observable(false);
            this.isOrginalBol = ko.observable(false);
            this.isDuplicateBillOrOriginalBillItems = ko.observable(false);
            this.isPurchaseOrder = ko.observable(false);
            this.isForceAttach = ko.observable(false);
            this.isCreateSubbillItemsEnable = ko.observable(true);
            this.showSubbillItemsView = ko.observable(false);
            this.bolNumber = ko.observable('');
            this.CarrierID = ko.observable(0);
            this.ediDetailsId = ko.observable(0);
            this.BatchId = ko.observable(0);
            this.proNumber = ko.observable('');
            this.shipmentID = ko.observable(0);
            this.po = ko.observable('');
            this.referenceNo = ko.observable('');
            this.ediBol = ko.observable('');
            this.carrierName = ko.observable('');
            this.ID = ko.observable(0);
            this.BillStatus = ko.observable('');
            this.ProcessStatus = ko.observable('');
            //This flag using for reprocess
            this.isCorrected = ko.observable(false);
            this.commonUtils = new Utils.Common();
            this.updateDuplicatePROModel = null;
            this.originalBol = ko.observable('');
            this.totalCostDifference = ko.observable(0);
            this.checkedLineItems = ko.observableArray([]);
            this.localStorageKey = ko.observable('');
            var self = this;
            self.onButtonActionClick = onButtonActionClick;
            self.edi210CarrierExceptionItemViewModel = new refEdi210CarrierExceptionItemView.Edi210CarrierExceptionItemViewModel(function (saveButtonFlag) {
                self.isSaveEnable(saveButtonFlag);
                self.isSaveEnableUnmappedItem(saveButtonFlag);
            });
            self.edi210CarrierExceptionDuplicateBillItemViewModel = new refEdi210CarrierExceptionDuplicateBillItemView.Edi210CarrierExceptionDuplicateBillItemViewModel(function (countedItems) {
                // We remove all the items selected for creating sub bill
                self.checkedLineItems.removeAll();

                // Add the selected items for which a sub bill has to be created
                self.checkedLineItems.push(countedItems);
            }, function () {
                self.onCreateSubbillItems();
            });
            self.edi210CarrierExceptionOriginalBillItemViewModel = new refEdi210CarrierExceptionOriginalBillItemView.Edi210CarrierExceptionOriginalBillItemViewModel();
            self.edi210CarrierExceptionSubBillItemView = new refEdi210CarrierExceptionSubBillItemView.Edi210CarrierExceptionSubBillItemView();

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
                placeBelowButton: false
            };

            self.isCheckedInactive.subscribe(function (newValue) {
                if (self.exceptionRule() === "Unmapped Code") {
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
        Edi210CarrierExceptionReportsViewModel.prototype.initilizeUnmappedCode = function (selectedExceptionRule, EDIDetailsId, selectedBatchId) {
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
            var successCallBack = function (data) {
                if (data != null) {
                    LocalStorageController.Set(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult', data);
                    if (data.EDI210ExceptionDetailsItems !== undefined) {
                        data.EDI210ExceptionDetailsItems.forEach(function (item, collection) {
                            //self.ID(data.EDI210ExceptionDetailsItems[0].ID);
                            self.ID(item.ID);
                        });
                    }
                    self.bindEdi210DuplicateExceptionCarrierDetails(data.Edi210DuplicateExceptionCarrierDetails);
                    self.edi210CarrierExceptionItemViewModel.GetCarrierCode(data.Edi210DuplicateExceptionCarrierDetails.CarrierID);
                    self.edi210CarrierExceptionItemViewModel.initilizeEDIItemDetails(data.EDI210ExceptionDetailsItems);
                }
            }, faliureCallBack = function (message) {
            };

            if (LocalStorageController.Get(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult')) {
                successCallBack(LocalStorageController.Get(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult'));
            } else {
                self.boardClient.GetEDI210ExceptionDetails(EDIDetailsId, successCallBack, faliureCallBack);
            }
        };

        //initilize Method to get edit details data on Duplicate PRO exception rule
        Edi210CarrierExceptionReportsViewModel.prototype.initilizeDuplicatePRO = function (selectedExceptionRule, EDIDetailsId, BOL, selectedBatchId) {
            var self = this;
            self.setFlagForUI(selectedExceptionRule);
            self.clearEditDetailsData();
            self.BatchId(selectedBatchId);
            self.edi210CarrierExceptionDuplicateBillItemViewModel.ediDuplicateItemsList.removeAll();
            self.edi210CarrierExceptionOriginalBillItemViewModel.ediOriginalItemsList.removeAll();
            self.listProgressEDIDetials(true);
            self.ediDetailsId(EDIDetailsId);
            self.GetExceptionDetails();
        };

        //initilize Method to get edit details data on Corrected exception rule
        Edi210CarrierExceptionReportsViewModel.prototype.initilizeCorrected = function (selectedExceptionRule, EDIDetailsId, selectedBatchId) {
            var self = this;
            self.setFlagForUI(selectedExceptionRule);

            self.clearEditDetailsData();
            self.BatchId(selectedBatchId);
            self.edi210CarrierExceptionDuplicateBillItemViewModel.ediDuplicateItemsList.removeAll();
            self.edi210CarrierExceptionOriginalBillItemViewModel.ediOriginalItemsList.removeAll();
            self.listProgressEDIDetials(true);
            self.ediDetailsId(EDIDetailsId);
            self.GetExceptionDetails();
        };

        //initilize Method to get edit details data on BOL Not Completed, BOL Cancled OR Carrier Not Mapped exception rule
        Edi210CarrierExceptionReportsViewModel.prototype.initilizeBOLNotCompletedBOLCancledOrCarrierNotMapped = function (selectedExceptionRule, EDIDetailsId, BOL, selectedBatchId) {
            var self = this;
            self.setFlagForUI(selectedExceptionRule);
            self.clearEditDetailsData();
            self.ediDetailsId(EDIDetailsId);
            self.BatchId(selectedBatchId);
            self.listProgressEDIDetials(true);
            self.GetExceptionDetails();
            self.setFlagForUI(selectedExceptionRule);
        };

        //For get exception details data for all exception rule id
        Edi210CarrierExceptionReportsViewModel.prototype.GetExceptionDetails = function () {
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
                var successCallBack = function (data) {
                    if (data != null) {
                        LocalStorageController.Set(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult', data);
                        self.bindEdi210DuplicateExceptionCarrierDetails(data.Edi210DuplicateExceptionCarrierDetails);
                    }
                }, failureCallBack = function (message) {
                };
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
                var SuccessCallBack = function (data) {
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

                    if (self.isPurchaseOrder()) {
                        self.isCreateSubBill(false);
                    }

                    if ((data.VenderBillOriginalContainer.VendorBillItemsDetail.length === 0) && (self.selectedExceptionRule() === 3)) {
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 5,
                            fadeOut: 5,
                            typeOfAlert: "",
                            title: ""
                        };

                        // ###START: DE20578
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.NoOriginalBillFound, "info", null, toastrOptions);
                        // ###END: DE20578
                    }
                }, FailureCallBack = function (message) {
                };
                if (LocalStorageController.Get(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult')) {
                    SuccessCallBack(LocalStorageController.Get(self.localStorageKey() + 'EDI210ExceptionBoardDetailsResult'));
                } else {
                    self.boardClient.GenerateVendorBill(self.ediDetailsId(), self.selectedExceptionRule(), SuccessCallBack, FailureCallBack);
                }
            }
        };

        //these Method will call for show UI
        Edi210CarrierExceptionReportsViewModel.prototype.setFlagForUI = function (selectedExceptionRule) {
            var self = this;
            self.showSubbillItemsView(false);
            self.selectedExceptionRule(selectedExceptionRule);
            self.exceptionRule(self.commonUtils.getEnumValueById(refEnums.Enums.ExceptionRuleId, selectedExceptionRule.toString()));
            self.exceptionRuleLabel("EDI " + self.commonUtils.getEnumValueById(refEnums.Enums.ExceptionRuleId, selectedExceptionRule.toString()) + " Exception");

            if (self.exceptionRule() === "Unmapped Code" || self.exceptionRule() === "Corrected" || self.exceptionRule() === "Duplicate PRO") {
                self.isSave(true);
            } else {
                self.isSave(false);
            }

            if (self.exceptionRule() === "Unmapped Code") {
                self.isItem(true);
            } else {
                self.isItem(false);
            }

            if (self.exceptionRule() === "BOL Cancelled") {
                self.isInactiveButton(true);
            } else {
                self.isInactiveButton(false);
            }

            if (self.exceptionRule() === "BOL Cancelled" || self.exceptionRule() === "BOL Not Completed" || self.exceptionRule() === "Carrier Not Mapped") {
                self.isReprocess(true);
            } else {
                self.isReprocess(false);
            }

            if (self.exceptionRule() === "Corrected" || self.exceptionRule() === "Duplicate PRO") {
                self.isCreateSubBill(true);
            } else {
                self.isCreateSubBill(false);
            }

            if (self.exceptionRule() === "Corrected" || self.exceptionRule() === "Duplicate PRO" || self.exceptionRule() === "Unmapped Code") {
                self.isInactiveCheckBox(true);
            } else {
                self.isInactiveCheckBox(false);
            }

            if (self.exceptionRule() === "Corrected") {
                self.isOrginalBol(true);
            } else {
                self.isOrginalBol(false);
            }

            if (self.exceptionRule() === "Corrected" || self.exceptionRule() === "Duplicate PRO") {
                self.isDuplicateBillOrOriginalBillItems(true);
            } else {
                self.isDuplicateBillOrOriginalBillItems(false);
            }
        };

        //Set mode for Exception rule id For last three it is
        Edi210CarrierExceptionReportsViewModel.prototype.setFormMode = function () {
            var self = this;
            if (self.selectedExceptionRule() === 7 || self.selectedExceptionRule() === 8 || self.selectedExceptionRule() === 9) {
                self.Mode = 2;
            } else {
                self.Mode = 1;
            }
        };

        //Binding datat on for UI
        Edi210CarrierExceptionReportsViewModel.prototype.bindEdi210DuplicateExceptionCarrierDetails = function (data) {
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
        };

        //for clear all fields of exception details
        Edi210CarrierExceptionReportsViewModel.prototype.clearEditDetailsData = function () {
            var self = this;
            self.bolNumber('');
            self.billDate('');

            //self.CarrierID('');
            self.carrierName('');
            self.ediBol('');
            self.po('');
            self.proNumber('');
            self.referenceNo('');
        };

        //Open SalesORder details on Click BOl
        Edi210CarrierExceptionReportsViewModel.prototype.onClickBOLNumber = function () {
            var self = this;
            if (self.shipmentID() !== 0) {
                _app.trigger("openSalesOrder", self.shipmentID(), self.bolNumber(), function (callback) {
                    if (!callback) {
                        return;
                    }
                });
            }
        };

        //For reprocess Status it will return bool value
        Edi210CarrierExceptionReportsViewModel.prototype.getReprocessStatus = function () {
            var self = this;

            // ###START: DE20711
            //disable all button after click
            self.isEnableAllButtonAfterSuccessCall(false);
            self.boardClient.GetReprocessStatus(self.ediDetailsId(), self.selectedExceptionRule(), self.bolNumber(), function (data) {
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 3,
                    fadeOut: 3,
                    typeOfAlert: "",
                    title: ""
                };

                if (data !== undefined || data !== null) {
                    if (data.StatusCode === 200) {
                        // ###START: DE20578
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.applicationResolved, "success", null, toastrOptions);

                        // ###END: DE20578
                        //back to main page
                        self.onButtonActionClick();
                    } else if (data.StatusCode == -1) {
                        // ###START: DE20578
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.CarrierNotMapped, "error", null, toastrOptions);
                        // ###END: DE20578
                    } else if (data.StatusCode == -2) {
                        // ###START: DE20578
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.applicationNoResolved, "error", null, toastrOptions);
                        // ###END: DE20578
                    }
                }

                //disable all button after click
                self.isEnableAllButtonAfterSuccessCall(true);
                //back to main page
                //self.onButtonActionClick();
            }, // ###START: DE25310
            function (message) {
                //disable all button after click
                self.isEnableAllButtonAfterSuccessCall(true);

                if (self.selectedExceptionRule() == 9) {
                    var toastrOptions2 = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 3,
                        fadeOut: 3,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions2);
                }
                // ###END: DE25310
            });
            // ###END: DE20711
        };

        //For Make EDI Inactive it will return boolean value
        Edi210CarrierExceptionReportsViewModel.prototype.getMakeOrderInactive = function () {
            var self = this;

            self.boardClient.GetMakeOrderInactive(self.ediDetailsId(), function (data) {
                if (data !== undefined || data !== null) {
                    if (data === true) {
                        var toasterOptions4 = {
                            toastrPositionClass: "toast-top-middle",
                            delayInSeconds: 5,
                            fadeOut: 5,
                            typeOfAlert: "",
                            title: ""
                        };

                        // ###START: DE20578
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.ChangeEDIToInactive, "success", null, toasterOptions4);
                        // ###END: DE20578
                    } else {
                        var toasterOptions5 = {
                            toastrPositionClass: "toast-top-middle",
                            delayInSeconds: 2,
                            fadeOut: 2,
                            typeOfAlert: "",
                            title: ""
                        };

                        // ###START: DE20578
                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ChangeEDIToInactiveErrorMessage, "error", null, toasterOptions5);
                        // ###END: DE20578
                    }
                } else {
                    var toasterOptions6 = {
                        toastrPositionClass: "toast-top-middle",
                        delayInSeconds: 2,
                        fadeOut: 2,
                        typeOfAlert: "",
                        title: ""
                    };

                    // ###START: DE20578
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ChangeEDIToInactiveErrorMessage, "error", null, toasterOptions6);
                    // ###END: DE20578
                }

                //disable all button after click
                self.isEnableAllButtonAfterSuccessCall(false);

                //Go back after click on Inactive
                self.onButtonActionClick();
            }, function () {
                //disable all button after click
                self.isEnableAllButtonAfterSuccessCall(false);

                //Go back after click on Inactive
                self.onButtonActionClick();
            });
        };

        Edi210CarrierExceptionReportsViewModel.prototype.onCreateSubBill = function () {
            var self = this;

            if (self.edi210CarrierExceptionSubBillItemView.validateItems())
                return false;

            if (self.edi210CarrierExceptionSubBillItemView.vendorBillItemsList().length > 0) {
                self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail.removeAll();
                var totalAmount = 0.0;
                self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail = self.getSubbillItemDetailsBeforeCreate();

                totalAmount = self.getTotalAmountForVBItems(self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail);
                self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBill.Amount = Math.round(totalAmount * 100);
            } else if ((self.checkedLineItems()[0] !== undefined) && (self.checkedLineItems()[0].length > 0)) {
                var totalAmount = 0.0;
                var selectedItems = self.getVendorBillItemsDetails();

                //self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail = self.getVendorBillItemsDetails();
                totalAmount = self.getTotalAmountForVBItems(selectedItems);
                if (totalAmount > 0) {
                    self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail.removeAll();
                    self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail = selectedItems;
                    self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBill.Amount = Math.round(totalAmount * 100);
                } else {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 5,
                        fadeOut: 5,
                        typeOfAlert: "",
                        title: ""
                    };

                    // ###START: DE20578
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, "Cannot create subbill with cost less than 0", "info", null, toastrOptions);

                    // ###END: DE20578
                    return false;
                }
                //for (var index = 0; index < self.checkedLineItems()[0].length; index++){
                //    self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail.push(self.checkedLineItems()[0][index]);
                //}
            } else {
                var totalAmount = 0.0;

                self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail.forEach(function (item) {
                    item.Cost = item.Difference * 100;
                });

                totalAmount = self.getTotalAmountForVBItems(self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail);
                self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBill.Amount = Math.round(totalAmount);

                if (totalAmount < 0) {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        //delayInseconds: 3,
                        fadeOut: 3,
                        typeOfAlert: "",
                        title: ""
                    };

                    // ###START: DE20578
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, "Cannot create subbill with cost less than 0", "info", null, toastrOptions);

                    // ###END: DE20578
                    return false;
                }
            }

            // Pass only selected items for creating sub bill - end
            self.boardClient.createEDIRecord(self.EDI210InputParameterContainer, function (data) {
                if (data) {
                    //SuccessFully send for process or created sub bill
                    var toasterOptions8 = {
                        toastrPositionClass: "toast-top-middle",
                        delayInSeconds: 5,
                        fadeOut: 5,
                        typeOfAlert: "",
                        title: ""
                    };

                    // ###START: DE20578
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.billhasSentForProcess, "success", null, toasterOptions8);

                    // ###END: DE20578
                    //disable all button after click
                    self.isEnableAllButtonAfterSuccessCall(false);

                    //Go back after click on save
                    self.onButtonActionClick();
                }
            }, function () {
                //disable all button after click
                self.isEnableAllButtonAfterSuccessCall(false);

                //Go back after click on save
                self.onButtonActionClick();
            });
        };

        Edi210CarrierExceptionReportsViewModel.prototype.onCreatePo = function () {
            var self = this;

            if (self.edi210CarrierExceptionSubBillItemView.validateItems())
                return false;

            if (self.edi210CarrierExceptionSubBillItemView.vendorBillItemsList().length > 0) {
                self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail.removeAll();
                var totalAmount = 0.0;
                self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail = self.getSubbillItemDetailsBeforeCreate();

                totalAmount = self.getTotalAmountForVBItems(self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail);
                self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBill.Amount = Math.round(totalAmount * 100);
            } else if ((self.checkedLineItems()[0] !== undefined) && (self.checkedLineItems()[0].length > 0)) {
                var totalAmount = 0.0;
                var selectedItems = self.getVendorBillItemsDetails();

                //self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail = self.getVendorBillItemsDetails();
                totalAmount = self.getTotalAmountForVBItems(selectedItems);
                if (totalAmount > 0) {
                    self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail.removeAll();
                    self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail = selectedItems;
                    self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBill.Amount = Math.round(totalAmount * 100);
                } else {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 5,
                        fadeOut: 5,
                        typeOfAlert: "",
                        title: ""
                    };

                    // ###START: DE20578
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, "Cannot create PO with cost less than 0", "info", null, toastrOptions);

                    // ###END: DE20578
                    return false;
                }
                //for (var index = 0; index < self.checkedLineItems()[0].length; index++){
                //    self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail.push(self.checkedLineItems()[0][index]);
                //}
            } else {
                var totalAmount = 0.0;

                self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail.forEach(function (item) {
                    item.Cost = item.Difference * 100;
                });

                totalAmount = self.getTotalAmountForVBItems(self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBillItemsDetail);
                self.EDI210InputParameterContainer.VendorBillDuplicateData.VendorBill.Amount = Math.round(totalAmount);

                if (totalAmount < 0) {
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 5,
                        fadeOut: 5,
                        typeOfAlert: "",
                        title: ""
                    };

                    // ###START: DE20578
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, "Cannot create PO with cost less than 0", "info", null, toastrOptions);

                    // ###END: DE20578
                    return false;
                }
            }

            self.boardClient.UpdateProcessAgeForPO(self.EDI210InputParameterContainer, function (data) {
                if (data) {
                    //SuccessFully send for process or created sub bill
                    var toasterOptions8 = {
                        toastrPositionClass: "toast-top-middle",
                        delayInSeconds: 5,
                        fadeOut: 5,
                        typeOfAlert: "",
                        title: ""
                    };

                    // ###START: DE20578
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.billhasSentForProcess, "success", null, toasterOptions8);

                    // ###END: DE20578
                    //disable all button after click
                    self.isEnableAllButtonAfterSuccessCall(false);

                    //Go back after click on save
                    self.onButtonActionClick();
                }
            }, function () {
                //disable all button after click
                self.isEnableAllButtonAfterSuccessCall(false);

                //Go back after click on save
                self.onButtonActionClick();
            });
        };

        //Updating EDI details on PRo
        Edi210CarrierExceptionReportsViewModel.prototype.onSave = function () {
            var self = this;
            self.updateDuplicatePROModel = new refUpdateDuplicatePRO.Models.UpdateDuplicatePRO();
            self.updateDuplicatePROModel.EDIDetailID = self.ediDetailsId();
            self.updateDuplicatePROModel.IsActive = self.isCheckedInactive();
            self.updateDuplicatePROModel.BatchId = self.BatchId();
            self.updateDuplicatePROModel.Edi210ItemUnmappedCodeMapping = self.getEdiItemDetails();
            self.boardClient.UpdateDuplicatePRODetails(self.updateDuplicatePROModel, function () {
                self.isCheckedInactive(false);

                //SuccessFully saved
                var toasterOptions7 = {
                    toastrPositionClass: "toast-top-middle",
                    delayInSeconds: 5,
                    fadeOut: 5,
                    typeOfAlert: "",
                    title: ""
                };

                // ###START: DE20578
                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.UpdatedEDIForPro + self.proNumber(), "success", null, toasterOptions7);

                // ###END: DE20578
                //disable all button after click
                self.isEnableAllButtonAfterSuccessCall(false);

                //Go back after click on save
                self.onButtonActionClick();
            }, function () {
                //disable all button after click
                self.isEnableAllButtonAfterSuccessCall(false);

                //Go back after click on save even in failure call back
                self.onButtonActionClick();
            });
        };

        //onPronumberclick
        Edi210CarrierExceptionReportsViewModel.prototype.onProNumberClick = function () {
            var self = this;
            if (self.vendorBillId() === 0)
                return false;

            _app.trigger("openVendorBill", self.vendorBillId(), self.proNumber(), function (callback) {
                if (!callback) {
                    return;
                }
            });
        };

        Edi210CarrierExceptionReportsViewModel.prototype.onCreateSubbillItems = function () {
            var self = this;
            var items = self.getVendorBillItemsDetails();
            self.showSubbillItemsView(true);
            self.isEnableAllButtonAfterSuccessCall(true);
            self.edi210CarrierExceptionSubBillItemView.beforeBind();
            self.edi210CarrierExceptionSubBillItemView.initializeVendorBillItemDetails(items, false, false);
        };

        // Gets the vendor bill Item details
        Edi210CarrierExceptionReportsViewModel.prototype.getEdiItemDetails = function () {
            var self = this;

            var EDI210UnmappedItemModel;
            EDI210UnmappedItemModel = ko.observableArray([])();

            // All the field values other than Description, Id and Mapped Code are hard coded as only these fields are update against the items
            self.edi210CarrierExceptionItemViewModel.ediItemsList().forEach(function (item, collection) {
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
        };

        //#endregion Public Method
        //#region Private Method
        // To Clear the Local storage
        Edi210CarrierExceptionReportsViewModel.prototype.clearLocalStorage = function (targetId) {
            if (LocalStorageController.Get(targetId + 'PO')) {
                LocalStorageController.Set(targetId + 'PO', undefined);
            }
        };

        // Converting if date is not valid
        Edi210CarrierExceptionReportsViewModel.prototype.convertToBookedDate = function () {
            var self = this;
            if (!self.billDate().match('/') && self.billDate().length > 0) {
                self.billDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.billDate()));
            }
        };

        Edi210CarrierExceptionReportsViewModel.prototype.checkCostDifference = function (items) {
            var self = this;
            var total = 0.0;
            items.forEach(function (item) {
                total += item.Difference;
            });
            self.totalCostDifference(total);
        };

        // Gets the vendor bill Item details
        Edi210CarrierExceptionReportsViewModel.prototype.getVendorBillItemsDetails = function () {
            var self = this;

            var vendorBillItems;
            vendorBillItems = ko.observableArray([])();

            if (self.checkedLineItems().length > 0) {
                self.checkedLineItems()[0].forEach(function (item, collection) {
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
        };

        // Gets the vendor bill Item details
        Edi210CarrierExceptionReportsViewModel.prototype.getSubbillItemDetailsBeforeCreate = function () {
            var self = this;

            var vendorBillItems;
            vendorBillItems = ko.observableArray([])();

            if (self.edi210CarrierExceptionSubBillItemView.vendorBillItemsList().length > 0) {
                self.edi210CarrierExceptionSubBillItemView.vendorBillItemsList().forEach(function (item, collection) {
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
        };

        Edi210CarrierExceptionReportsViewModel.prototype.getTotalAmountForVBItems = function (items) {
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
        };

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
        Edi210CarrierExceptionReportsViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //The composition engine will execute it prior to calling the binder.
        Edi210CarrierExceptionReportsViewModel.prototype.activate = function () {
            return true;
        };

        //To load the registered data if any existed.
        Edi210CarrierExceptionReportsViewModel.prototype.beforeBind = function () {
            var self = this;
            //_app.trigger("loadMyData", function (data) {
            //	if (data) {
            //		self.load(data);
            //	} else {
            //	}
            //});
        };
        return Edi210CarrierExceptionReportsViewModel;
    })();
    exports.Edi210CarrierExceptionReportsViewModel = Edi210CarrierExceptionReportsViewModel;
});
