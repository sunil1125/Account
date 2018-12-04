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
/// <reference path="../services/models/TypeDefs/VendorBillSearchModel.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/models/common/Enums', 'services/models/Admin/CompanyOnlinePaymentDetails', 'purchaseOrder/purchaseOrderToSalesOrder/searchAgencyNameControl', '../templates/reportViewerControlV2', 'services/client/CommonClient'], function(require, exports, ___router__, ___app__, __refEnums__, __refAdminModelOnlinePaymentDetails__, __refAgencyNameSearchControl__, ___reportViewer__, __refCommonClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refEnums = __refEnums__;
    var refAdminModelOnlinePaymentDetails = __refAdminModelOnlinePaymentDetails__;
    
    var refAgencyNameSearchControl = __refAgencyNameSearchControl__;
    var _reportViewer = ___reportViewer__;
    
    var refCommonClient = __refCommonClient__;

    //#endregion
    /***********************************************
    MY SETTING VIEW VIEW MODEL
    ************************************************
    ** <createDetails>
    ** <id>US12574</id><by>Chandan</by> <date>3rd OCT, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id><by></by> <date></date>
    ** </changeHistory>
    
    ***********************************************/
    var OnlinePaymentConfigurationViewModel = (function () {
        //#endregion
        //#region Constructor
        function OnlinePaymentConfigurationViewModel() {
            //#region members
            this.reportContainer = null;
            this.newHeader = null;
            this.grid = null;
            this.reportAction = null;
            this.reportData = null;
            this.modeType = ko.observable();
            this.listProgress = ko.observable(false);
            this.companyCCCharge = ko.observable(0);
            this.companyCECharge = ko.observable(0);
            this.companyCCchargeTypes = ko.observableArray([]);
            this.selecteedcompanyCCchargeTypes = ko.observable('');
            this.companyECchargeTypes = ko.observableArray([]);
            this.selecteedcompanyECchargeTypes = ko.observable('');
            this.companyCCNote = ko.observable('');
            this.companyECNote = ko.observable('');
            this.companyDCNote = ko.observable('');
            this.enableCompanySave = ko.observable(true);
            this.commonUtils = new Utils.Common();
            //Common Client
            this.commonClient = new refCommonClient.Common();
            //#region Agency check box bindings
            this.agencyCCCharge = ko.observable(0);
            this.agencyCECharge = ko.observable(0);
            this.agencyCCchargeTypes = ko.observableArray([]);
            this.selecteedAgencyCCchargeTypes = ko.observable('');
            this.agencyECchargeTypes = ko.observableArray([]);
            this.selecteedAgencyECchargeTypes = ko.observable('');
            this.agencyCCNote = ko.observable('');
            this.agencyECNote = ko.observable('');
            this.agencyDCNote = ko.observable('');
            this.enableAgencySave = ko.observable(false);
            this.enableAgencyDelete = ko.observable(false);
            this.isAgencyCreditCaredSelected = ko.observable(false);
            this.agencyCreditCardhtml = ko.observable('');
            this.agencyCreditCardName = ko.observable('Allow CC');
            this.isAgencyECheckSelected = ko.observable(false);
            this.agencyECheckhtml = ko.observable('');
            this.agencyECheckName = ko.observable('Allow E-Check');
            this.isAgencyDebitCardSelected = ko.observable(false);
            this.agencyDebitCardHtml = ko.observable('');
            this.agencyDebitCardName = ko.observable('Allow Debit Card');
            //#endregion Agency check box bindings
            //#region Company check box bindings
            this.isCompnayCreditCaredSelected = ko.observable(false);
            this.companyCreditCardhtml = ko.observable('');
            this.companyCreditCardName = ko.observable('Allow CC');
            this.isCompnayECheckSelected = ko.observable(false);
            this.companyECheckhtml = ko.observable('');
            this.companyECheckName = ko.observable('Allow E-Check');
            this.isCompnayDebitCardSelected = ko.observable(false);
            this.companyDebitCardHtml = ko.observable('');
            this.companyDebitCardName = ko.observable('Allow Debit Card');
            //#endregion Agency check box bindings
            // Properties for selected customers in grid
            this.customerName = ko.observable('');
            this.customerCCCharge = ko.observable(0);
            this.customerECharge = ko.observable(0);
            this.customerCCchargeTypes = ko.observableArray([]);
            this.selecteedcustomerCCchargeTypes = ko.observable('');
            this.customerECchargeTypes = ko.observableArray([]);
            this.selecteedcustomerECchargeTypes = ko.observable('');
            this.customerCCNote = ko.observable('');
            this.customerECNote = ko.observable('');
            this.customerDCNote = ko.observable('');
            this.enableCustomerSave = ko.observable(false);
            this.enableCustomerDelete = ko.observable(false);
            // Check box binding for selected Customer
            this.isCustomerCreditCaredSelected = ko.observable(false);
            this.customerCreditCardhtml = ko.observable('');
            this.customerCreditCardName = ko.observable('Allow CC');
            this.isCustomerECheckSelected = ko.observable(false);
            this.customerECheckhtml = ko.observable('');
            this.customerECheckName = ko.observable('Allow E-Check');
            this.isCustomerDebitCardSelected = ko.observable(false);
            this.customerDebitCardHtml = ko.observable('');
            this.customerDebitCardName = ko.observable('Allow Debit Card');
            this.checkMsgDisplay = true;
            this.customerId = ko.observable(0);
            this.discountDueDays = ko.observable(0);
            this.agencyId = ko.observable(0);
            this.isAgencyCCValidationShown = false;
            this.isAgencyECValidationShown = false;
            this.isCustomerCCValidationShown = false;
            this.isCustomerECValidationShown = false;
            this.isCompanyCCValidationShown = false;
            this.isCompanyECValidationShown = false;
            var self = this;

            self.newHeader = new _reportViewer.ReportHeaderOption();
            self.newHeader.reportHeader = " ";
            self.newHeader.reportName = "";
            self.newHeader.gridTitleHeader = " ";
            self.newHeader.preparedOn = " ";
            self.newHeader.createdBy = " ";
            var CommonUtils = new Utils.Common();

            //initialize date filters
            self.reportAction = new _reportViewer.ReportAction();
            self.grid = self.setGridOptions(self);
            self.searchText = ko.observable("");

            //##region Export Options.
            var exportOpt = ko.observableArray([
                { exportType: _reportViewer.ExportOptions.EXCEL, name: ko.observable("Excel"), enabled: ko.observable(true) }
            ]);

            self.newHeader.reportExportOptions = new _reportViewer.ReportExportControl(exportOpt);
            self.newHeader.reportExportOptions.getUrl = function (exp) {
                var stringUrl;
                stringUrl = "Accounting/ExportOnlinePaymentConfigurationsInExcel?agencyId=" + self.agencyId();
                return stringUrl;
            };

            //##endregion Export Options End.
            self.setReportCriteria = function (reportActionObj) {
                self.gridOptions = reportActionObj.gridOptions;
                if (self.reportAction != null) {
                    if ((self.modeType() != reportActionObj.filter1selectedItemId) || (self.reportAction.view != reportActionObj.view) || (reportActionObj.dateFrom != self.reportAction.dateFrom) || (reportActionObj.dateTo != self.reportAction.dateTo)) {
                        self.gridOptions.pagingOptions.currentPage(1);
                    }
                }
                self.reportAction = reportActionObj;
            };

            self.reportContainer = new _reportViewer.ReportViewerControlV2(self.newHeader, self.grid);

            self.reportContainer.onFilterChange = self.setReportCriteria;
            self.reportContainer.ForceChange();

            //To check if Msg is clicked
            self.checkMsgClick = function () {
                self.checkMsgDisplay = true;
            };

            // to Check if Msg is hidden or closed
            self.checkMsgHide = function () {
                self.checkMsgDisplay = true;
            };

            self.companyCCchargeTypes.push('Discount');
            self.companyCCchargeTypes.push('Fee');
            self.companyECchargeTypes.push('Discount');
            self.companyECchargeTypes.push('Fee');

            self.agencyCCchargeTypes.push('Discount');
            self.agencyCCchargeTypes.push('Fee');
            self.agencyECchargeTypes.push('Discount');
            self.agencyECchargeTypes.push('Fee');

            self.agencyNameSearchList = new refAgencyNameSearchControl.SearchAgencyNameControl("A valid Agency Name is required.", function (agencyId) {
                if (agencyId) {
                    self.enableAgencyDelete(true);
                    self.enableAgencySave(true);
                    self.agencyId(agencyId);
                    self.reportContainer.listProgress(true);
                    var failCallback = function (errorMessage) {
                        self.reportContainer.listProgress(false);
                        var toastrOptions = {
                            toastrPositionClass: "toast-top-middle",
                            delayInseconds: 2,
                            fadeOut: 2,
                            typeOfAlert: "",
                            title: ""
                        };

                        Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, errorMessage, "error", null, toastrOptions);
                    };

                    // gets all the customers and update the grid
                    self.commonClient.getCustomersByAgencyId(agencyId, function (data) {
                        self.reportContainer.listProgress(false);
                        self.setPagingData(ko.observableArray(data), self.gridOptions, self.reportAction);
                    }, failCallback);

                    // Gets the agency online payment data and update the UI
                    self.commonClient.getAgencyOnlinePaymentSettings(agencyId, function (data) {
                        self.populateAgencyDetails(data);
                    }, failCallback);
                } else {
                    self.enableAgencyDelete(false);
                    self.enableAgencySave(false);
                }
            });

            self.populateAgencyDetails = function (agencyOnlinePaymentSettings) {
                if (agencyOnlinePaymentSettings) {
                    self.agencyCCCharge($.number(Math.abs(agencyOnlinePaymentSettings.CCProcessCharge), 2));
                    self.agencyCECharge($.number(Math.abs(agencyOnlinePaymentSettings.ECheckProcessCharge), 2));
                    self.agencyCCNote(agencyOnlinePaymentSettings.CCMessage);
                    self.agencyECNote(agencyOnlinePaymentSettings.ECheckMessage);
                    self.agencyDCNote(agencyOnlinePaymentSettings.DebitMessage);

                    // Assign the reverse order of the current selection,
                    // These values will be changed by the click event which is called below
                    self.isAgencyCreditCaredSelected(!agencyOnlinePaymentSettings.CCVisibility);
                    self.isAgencyECheckSelected(!agencyOnlinePaymentSettings.ECheckVisible);
                    self.isAgencyDebitCardSelected(!agencyOnlinePaymentSettings.DebitVisibility);

                    // Update the UI, this will update the UI
                    self.agencyCreditCardClick();
                    self.agencyECheckClick();
                    self.agencyDebitCardClick();

                    var creditCardType = $.grep(self.agencyCCchargeTypes(), function (item) {
                        return item === agencyOnlinePaymentSettings.CreditCardType;
                    });
                    var eCardType = $.grep(self.companyECchargeTypes(), function (item) {
                        return item === agencyOnlinePaymentSettings.ECheckCardType;
                    });

                    self.selecteedAgencyCCchargeTypes(creditCardType[0]);
                    self.selecteedAgencyECchargeTypes(eCardType[0]);
                }
            };

            //#region Validations
            //Agency
            self.agencyCCCharge.extend({
                required: {
                    message: ApplicationMessages.Messages.ValidCCharge,
                    onlyIf: function () {
                        return (self.isAgencyCreditCaredSelected());
                    }
                },
                validation: {
                    validator: function () {
                        if (self.isAgencyCreditCaredSelected()) {
                            return (self.agencyCCCharge());
                        } else {
                            return true;
                        }
                    },
                    message: 'Invalid credit card charge. Please enter a valid credit card charge.'
                }
            });

            self.agencyCECharge.extend({
                required: {
                    message: ApplicationMessages.Messages.ValidECharge,
                    onlyIf: function () {
                        return (self.isAgencyECheckSelected());
                    }
                },
                validation: {
                    validator: function () {
                        if (self.isAgencyECheckSelected()) {
                            return (self.agencyCECharge());
                        } else {
                            return true;
                        }
                    },
                    message: 'Invalid E-Check charge. Please enter a valid E-Check charge.'
                }
            });

            //Customers
            self.customerCCCharge.extend({
                required: {
                    message: ApplicationMessages.Messages.ValidCCharge,
                    onlyIf: function () {
                        return (self.isCustomerCreditCaredSelected());
                    }
                },
                validation: {
                    validator: function () {
                        if (self.isCustomerCreditCaredSelected()) {
                            return (self.customerCCCharge());
                        } else {
                            return true;
                        }
                    },
                    message: 'Invalid credit card charge. Please enter a valid credit card charge.'
                }
            });

            self.customerECharge.extend({
                required: {
                    message: ApplicationMessages.Messages.ValidECharge,
                    onlyIf: function () {
                        return (self.isCustomerECheckSelected());
                    }
                },
                validation: {
                    validator: function () {
                        if (self.isCustomerECheckSelected()) {
                            return (self.customerECharge());
                        } else {
                            return true;
                        }
                    },
                    message: 'Invalid E-Check charge. Please enter a valid E-Check charge.'
                }
            });

            // Company
            self.companyCCCharge.extend({
                required: {
                    message: ApplicationMessages.Messages.ValidCCharge,
                    onlyIf: function () {
                        return (self.isCompnayCreditCaredSelected());
                    }
                },
                validation: {
                    validator: function () {
                        if (self.isCompnayCreditCaredSelected()) {
                            return (self.companyCCCharge());
                        } else {
                            return true;
                        }
                    },
                    message: 'Invalid credit card charge. Please enter a valid credit card charge.'
                }
            });

            self.companyCECharge.extend({
                required: {
                    message: ApplicationMessages.Messages.ValidECharge,
                    onlyIf: function () {
                        return (self.isCompnayECheckSelected());
                    }
                },
                validation: {
                    validator: function () {
                        if (self.isCompnayECheckSelected()) {
                            return (self.companyCECharge());
                        } else {
                            return true;
                        }
                    },
                    message: 'Invalid E-Check charge. Please enter a valid E-Check charge.'
                }
            });

            self.errorAgencyDetail = ko.validatedObservable({
                agencyCCCharge: self.agencyCCCharge,
                agencyCECharge: self.agencyCECharge
            });

            self.errorCustomerDetail = ko.validatedObservable({
                customerCCCharge: self.customerCCCharge,
                customerECharge: self.customerECharge
            });

            self.errorCompanyDetail = ko.validatedObservable({
                companyCCCharge: self.companyCCCharge,
                companyCECharge: self.companyCECharge
            });

            //#endregion
            //#region customer Check Box Click
            self.customerSave = function () {
                self.validateCustomer();
                if (!(self.isCustomerCCValidationShown || self.isCustomerECValidationShown)) {
                    var model = new refAdminModelOnlinePaymentDetails.Models.CompanyOnlinePaymentDetails();
                    model.CCMessage = self.customerCCNote();
                    model.CCProcessCharge = self.customerCCCharge();
                    model.CCVisibility = self.isCustomerCreditCaredSelected();
                    model.DebitMessage = self.customerDCNote();
                    model.DebitVisibility = self.isCustomerDebitCardSelected();
                    model.ECheckMessage = self.customerECNote();
                    model.ECheckProcessCharge = self.customerECharge();
                    model.ECheckVisible = self.isCustomerECheckSelected();
                    model.CCChargeType = self.selecteedcustomerCCchargeTypes();
                    model.ECheckChargeType = self.selecteedcustomerECchargeTypes();
                    model.EntityId = self.customerId();
                    model.DiscountDueDays = self.discountDueDays();
                    model.EntityType = 3;

                    self.enableCustomerSave(false);
                    self.enableCustomerDelete(false);
                    self.commonClient.updateCustomerPaymentConfigurations(model, function () {
                        if (self.checkMsgDisplay) {
                            self.checkMsgDisplay = false;
                            var toastrOptions = {
                                toastrPositionClass: "toast-top-middle",
                                delayInseconds: 5,
                                fadeOut: 3,
                                typeOfAlert: "",
                                title: ""
                            };

                            //	self.enableCustomerSave(true);
                            Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.RecordInsertedSuccessfully, "success", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                        }
                        self.resetCustomerDetails();
                        self.reloadCustomerDetails();
                    }, function () {
                        self.enableCustomerSave(true);
                        self.enableCustomerDelete(true);
                    });
                }
            };

            self.customerCreditCardClick = function () {
                if (!self.isCustomerCreditCaredSelected()) {
                    self.isCustomerCreditCaredSelected(true);

                    self.customerCreditCardhtml('<i class="icon-ok icon-white active"></i>' + self.customerCreditCardName());
                } else {
                    self.isCustomerCreditCaredSelected(false);
                }
            };

            self.customerECheckClick = function () {
                if (!self.isCustomerECheckSelected()) {
                    self.isCustomerECheckSelected(true);

                    self.customerECheckhtml('<i class="icon-ok icon-white active"></i>' + self.customerECheckName());
                } else {
                    self.isCustomerECheckSelected(false);
                }
            };

            self.customerDebitCardClick = function () {
                if (!self.isCustomerDebitCardSelected()) {
                    self.isCustomerDebitCardSelected(true);

                    self.customerDebitCardHtml('<i class="icon-ok icon-white active"></i>' + self.customerDebitCardName());
                } else {
                    self.isCustomerDebitCardSelected(false);
                }
            };

            ///#endregion
            //#region Agency Check Box Click
            self.agencyCreditCardClick = function () {
                if (!self.isAgencyCreditCaredSelected()) {
                    self.isAgencyCreditCaredSelected(true);

                    self.agencyCreditCardhtml('<i class="icon-ok icon-white active"></i>' + self.agencyCreditCardName());
                } else {
                    self.isAgencyCreditCaredSelected(false);
                }
            };

            self.agencyECheckClick = function () {
                if (!self.isAgencyECheckSelected()) {
                    self.isAgencyECheckSelected(true);

                    self.agencyECheckhtml('<i class="icon-ok icon-white active"></i>' + self.agencyECheckName());
                } else {
                    self.isAgencyECheckSelected(false);
                }
            };

            self.agencyDebitCardClick = function () {
                if (!self.isAgencyDebitCardSelected()) {
                    self.isAgencyDebitCardSelected(true);

                    self.agencyDebitCardHtml('<i class="icon-ok icon-white active"></i>' + self.agencyDebitCardName());
                } else {
                    self.isAgencyDebitCardSelected(false);
                }
            };

            self.agencySave = function () {
                self.validateAgency();
                if (!(self.isAgencyCCValidationShown || self.isAgencyECValidationShown)) {
                    var model = new refAdminModelOnlinePaymentDetails.Models.CompanyOnlinePaymentDetails();
                    model.CCMessage = self.agencyCCNote();
                    model.CCProcessCharge = self.agencyCCCharge();
                    model.CCVisibility = self.isAgencyCreditCaredSelected();
                    model.DebitMessage = self.agencyDCNote();
                    model.DebitVisibility = self.isAgencyDebitCardSelected();
                    model.ECheckMessage = self.agencyECNote();
                    model.ECheckProcessCharge = self.agencyCECharge();
                    model.ECheckVisible = self.isAgencyECheckSelected();
                    model.CCChargeType = self.selecteedAgencyCCchargeTypes();
                    model.ECheckChargeType = self.selecteedAgencyECchargeTypes();
                    model.EntityType = 2;
                    model.EntityId = self.agencyId();
                    model.DiscountDueDays = 0;

                    self.enableAgencySave(false);
                    self.enableAgencyDelete(false);
                    self.commonClient.updateCustomerPaymentConfigurations(model, function () {
                        if (self.checkMsgDisplay) {
                            self.checkMsgDisplay = false;
                            var toastrOptions = {
                                toastrPositionClass: "toast-top-middle",
                                delayInseconds: 5,
                                fadeOut: 3,
                                typeOfAlert: "",
                                title: ""
                            };

                            //self.enableCompanySave(true);
                            Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.RecordInsertedSuccessfully, "success", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                        }
                        self.resetAgencyDetails();
                        self.setPagingData(ko.observableArray(), self.gridOptions, self.reportAction);
                        self.enableCustomerSave(false);
                        self.enableCustomerDelete(false);
                    }, function () {
                        self.enableAgencySave(true);
                        self.enableAgencyDelete(true);
                    });
                }
            };

            //#endregion
            //#region Company Check Box Click
            self.companyCreditCardClick = function () {
                if (!self.isCompnayCreditCaredSelected()) {
                    self.isCompnayCreditCaredSelected(true);

                    self.companyCreditCardhtml('<i class="icon-ok icon-white active"></i>' + self.companyCreditCardName());
                } else {
                    self.isCompnayCreditCaredSelected(false);
                }
            };

            self.companyECheckClick = function () {
                if (!self.isCompnayECheckSelected()) {
                    self.isCompnayECheckSelected(true);

                    self.companyECheckhtml('<i class="icon-ok icon-white active"></i>' + self.companyECheckName());
                } else {
                    self.isCompnayECheckSelected(false);
                }
            };

            self.companyDebitCardClick = function () {
                if (!self.isCompnayDebitCardSelected()) {
                    self.isCompnayDebitCardSelected(true);

                    self.companyDebitCardHtml('<i class="icon-ok icon-white active"></i>' + self.companyDebitCardName());
                } else {
                    self.isCompnayDebitCardSelected(false);
                }
            };

            self.companySave = function () {
                self.validateCompany();
                if (!(self.isCompanyCCValidationShown || self.isCompanyECValidationShown)) {
                    var model = new refAdminModelOnlinePaymentDetails.Models.CompanyOnlinePaymentDetails();
                    model.CCMessage = self.companyCCNote();
                    model.CCProcessCharge = self.companyCCCharge();
                    model.CCProcessCharge = self.companyCCCharge();
                    model.CCVisibility = self.isCompnayCreditCaredSelected();
                    model.DebitMessage = self.companyDCNote();
                    model.DebitVisibility = self.isCompnayDebitCardSelected();
                    model.ECheckMessage = self.companyECNote();
                    model.ECheckProcessCharge = self.companyCECharge();
                    model.ECheckVisible = self.isCompnayECheckSelected();
                    model.CCChargeType = self.selecteedcompanyCCchargeTypes();
                    model.ECheckChargeType = self.selecteedcompanyECchargeTypes();

                    self.enableCompanySave(false);
                    self.commonClient.updateCompanyPaymentConfigurations(model, function () {
                        if (self.checkMsgDisplay) {
                            self.checkMsgDisplay = false;
                            var toastrOptions = {
                                toastrPositionClass: "toast-top-middle",
                                delayInseconds: 5,
                                fadeOut: 3,
                                typeOfAlert: "",
                                title: ""
                            };
                            self.enableCompanySave(true);
                            Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.RecordInsertedSuccessfully, "success", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                        }
                        self.beforeBind();
                    }, function () {
                        self.enableCompanySave(true);
                    });
                }
            };

            //#endregion
            self.reportContainer.afterSelectionChange = function (items) {
                var selectedRowCount = items.length;
                if (selectedRowCount > 0) {
                    self.enableCustomerSave(true);
                    self.enableCustomerDelete(true);
                    self.customerName(items[0].CustomerName);

                    self.customerCCCharge($.number(Math.abs(items[0].CreditCardProcessCharge), 2));
                    self.customerCCNote(items[0].CreditCardMessage);
                    self.selecteedcustomerCCchargeTypes(items[0].CreditCardType);

                    self.customerECharge($.number(Math.abs(items[0].ECheckProcessCharge), 2));
                    self.customerECNote(items[0].ECheckMessage);
                    self.selecteedcustomerECchargeTypes(items[0].ECheckCardType);

                    self.customerDCNote(items[0].DebitMessage);
                    self.customerId(items[0].CustomerId);
                    self.discountDueDays(items[0].DiscountDueDays);

                    self.isCustomerCreditCaredSelected(!items[0].CreditCardVisibility);
                    self.isCustomerECheckSelected(!items[0].ECheckVisibility);
                    self.isCustomerDebitCardSelected(!items[0].DebitVisibility);

                    // Update the UI, this will update the UI
                    self.customerCreditCardClick();
                    self.customerECheckClick();
                    self.customerDebitCardClick();
                } else {
                    self.enableCustomerSave(false);
                    self.enableCustomerDelete(false);
                }
            };

            //#region Subscribe Function
            self.reportContainer.pagingOptions.currentPage.subscribe(function (newValue) {
                self.resetGridSelection(self);
            });

            self.reportContainer.pagingOptions.pageSize.subscribe(function (newValue) {
                self.resetGridSelection(self);
            });

            self.agencyCCCharge.subscribe(function (newValue) {
                if (newValue > 99.99) {
                    self.agencyCCCharge(99.99);
                }
            });
            self.agencyCECharge.subscribe(function (newValue) {
                if (newValue > 99.99) {
                    self.agencyCECharge(99.99);
                }
            });

            self.customerCCCharge.subscribe(function (newValue) {
                if (newValue > 99.99) {
                    self.customerCCCharge(99.99);
                }
            });

            self.customerECharge.subscribe(function (newValue) {
                if (newValue > 99.99) {
                    self.customerECharge(99.99);
                }
            });

            self.companyCCCharge.subscribe(function (newValue) {
                if (newValue > 99.99) {
                    self.companyCCCharge(99.99);
                }
            });

            self.companyCECharge.subscribe(function (newValue) {
                if (newValue > 99.99) {
                    self.companyCECharge(99.99);
                }
            });

            //#endregion
            //#region Delete function
            self.onAgencyDelete = function () {
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var actionButtons = [];
                    actionButtons.push({
                        actionButtonName: "Yes",
                        actionClick: self.agencyDelete
                    });

                    actionButtons.push({
                        actionButtonName: "No",
                        actionClick: self.checkMsgClick
                    });

                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 0,
                        fadeOut: 0,
                        typeOfAlert: "",
                        title: "",
                        actionButtons: actionButtons
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.DeletePaymentDetailsMessage, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
            };
            self.agencyDelete = function () {
                var model = new refAdminModelOnlinePaymentDetails.Models.CompanyOnlinePaymentDetails();
                model.EntityId = self.agencyId();
                model.EntityType = 2;
                self.enableAgencySave(false);
                self.enableAgencyDelete(false);
                self.commonClient.deleteCustomerPaymentConfigurations(model, function (message) {
                    self.resetAgencyDetails();
                    self.setPagingData(ko.observableArray(), self.gridOptions, self.reportAction);
                    self.enableCustomerSave(false);
                    self.enableCustomerDelete(false);
                }, function (message) {
                    self.enableAgencySave(true);
                    self.enableAgencyDelete(true);
                });
            };

            self.onCustomerDelete = function () {
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var actionButtons = [];
                    actionButtons.push({
                        actionButtonName: "Yes",
                        actionClick: self.customerDelete
                    });

                    actionButtons.push({
                        actionButtonName: "No",
                        actionClick: self.checkMsgClick
                    });

                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 0,
                        fadeOut: 0,
                        typeOfAlert: "",
                        title: "",
                        actionButtons: actionButtons
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.DeletePaymentDetailsMessage, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
            };

            self.customerDelete = function () {
                var model = new refAdminModelOnlinePaymentDetails.Models.CompanyOnlinePaymentDetails();
                model.EntityId = self.customerId();
                model.EntityType = 3;
                self.enableCustomerDelete(false);
                self.enableCustomerSave(false);
                self.commonClient.deleteCustomerPaymentConfigurations(model, function (message) {
                    self.resetCustomerDetails();
                    self.reloadCustomerDetails();
                }, function (message) {
                    self.enableCustomerDelete(true);
                    self.enableCustomerSave(true);
                });
            };

            //for search filter
            self.reportContainer.onSearchTextChange = function (reportViewer, newSearchValue) {
                if (newSearchValue.length >= 3 || newSearchValue.length == 0) {
                    self.searchText(newSearchValue);
                    self.gridOptions.pagingOptions.currentPage(1);
                }
            };

            //TO set grid column after browser resizing
            window.addEventListener("resize", resizeFunction);
            function resizeFunction() {
                self.reportContainer.isAttachedToView(false);
                self.reportContainer.isAttachedToView(true);
            }

            return self;
        }
        //#endregion
        //#region Public method
        OnlinePaymentConfigurationViewModel.prototype.onAgencyClick = function () {
            var self = this;
            setTimeout(function () {
                self.defaultGridColumn();
            }, 400);
        };

        OnlinePaymentConfigurationViewModel.prototype.defaultGridColumn = function () {
            var self = this;
            if (self.reportContainer !== undefined) {
                //on click we are calling this flag to show grid column resizebal as per browser window
                self.reportContainer.isAttachedToView(false);
                self.reportContainer.isAttachedToView(true);
            }
        };

        //#endregion
        //#region Internal Methods
        OnlinePaymentConfigurationViewModel.prototype.resetGridSelection = function (self) {
            window.kg.toggleSelection(false);
        };

        OnlinePaymentConfigurationViewModel.prototype.setPagingData = function (data, grid, gridOption) {
            Utils.kgSetClientsidePagination(data, gridOption, grid, undefined);
        };

        OnlinePaymentConfigurationViewModel.prototype.setGridOptions = function (self) {
            var grOption = new _reportViewer.ReportGridOption();
            grOption.UIGridID = ko.observable("OnlinePaymentCustomerGrid");
            grOption.data = self.reportData;
            grOption.columnDefinition = self.setGridColumnDefinitions();
            grOption.useExternalSorting = false;
            grOption.enableSelectiveDisplay = true;
            grOption.showGridSearchFilter = true;
            grOption.showPageSize = true;
            grOption.sortedColumn = {
                columnName: "ID",
                order: "DESC"
            };

            //grOption.enableSaveGridSettings = true;
            grOption.pageSizes = [5, 10, 25, 50, 100];
            grOption.pageSize = 5;
            grOption.totalServerItems = 0;
            grOption.currentPage = 1;
            grOption.jqueryUIDraggable = true;
            grOption.canSelectRows = true;
            grOption.selectWithCheckboxOnly = false;
            grOption.displaySelectionCheckbox = false;
            grOption.multiSelect = false;
            grOption.enablePaging = false;
            grOption.viewPortOptions = false;
            grOption.enableSaveGridSettings = true;
            grOption.useClientSideFilterAndSort = true;
            grOption.showColumnMenu = true;
            return grOption;
        };

        OnlinePaymentConfigurationViewModel.prototype.setGridColumnDefinitions = function () {
            var colDefinition = [];
            var self = this;
            colDefinition = [
                { field: 'CustomerName', displayName: 'Customer Name' },
                { field: 'CustomerId', displayName: 'Customer Id' },
                { field: 'CreditCardProcessCharge', displayName: 'CC Processing Charge', cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
                { field: 'ECheckProcessCharge', displayName: 'E-Check Charge', cellTemplate: refEnums.Enums.GridCellFormatTemplates.RightAlignCurrencyTemplate },
                { field: 'CCVisibleDisplay', displayName: 'CC Visible' },
                { field: 'CreditCardMessage', displayName: 'CC Note' },
                { field: 'ECheckVisibleDisplay', displayName: 'E-Check Visible' },
                { field: 'ECheckMessage', displayName: 'E-Check Note' },
                { field: 'DebitVisibleDisplay', displayName: 'Debit Card Visible' },
                { field: 'DebitMessage', displayName: 'DebitMessage' }
            ];
            return colDefinition;
        };

        //#endregion
        //#region Public method
        OnlinePaymentConfigurationViewModel.prototype.validateAgency = function () {
            var self = this;
            if (self.isAgencyCreditCaredSelected()) {
                if (self.errorAgencyDetail.errors().length !== 0) {
                    self.errorAgencyDetail.errors.showAllMessages();
                    self.isAgencyCCValidationShown = true;
                } else {
                    self.isAgencyCCValidationShown = false;
                }
            } else {
                self.isAgencyCCValidationShown = false;
            }

            if (self.isAgencyECheckSelected()) {
                if (self.errorAgencyDetail.errors().length !== 0) {
                    self.errorAgencyDetail.errors.showAllMessages();
                    self.isAgencyECValidationShown = true;
                } else {
                    self.isAgencyECValidationShown = false;
                }
            } else {
                self.isAgencyECValidationShown = false;
            }
        };

        OnlinePaymentConfigurationViewModel.prototype.validateCustomer = function () {
            var self = this;
            if (self.isCustomerCreditCaredSelected()) {
                if (self.errorCustomerDetail.errors().length !== 0) {
                    self.errorCustomerDetail.errors.showAllMessages();
                    self.isCustomerCCValidationShown = true;
                } else {
                    self.isCustomerCCValidationShown = false;
                }
            } else {
                self.isCustomerCCValidationShown = false;
            }

            if (self.isCustomerECheckSelected()) {
                if (self.errorCustomerDetail.errors().length !== 0) {
                    self.errorCustomerDetail.errors.showAllMessages();
                    self.isCustomerECValidationShown = true;
                } else {
                    self.isCustomerECValidationShown = false;
                }
            } else {
                self.isCustomerECValidationShown = false;
            }
        };

        OnlinePaymentConfigurationViewModel.prototype.validateCompany = function () {
            var self = this;
            if (self.isCompnayCreditCaredSelected()) {
                if (self.errorCompanyDetail.errors().length !== 0) {
                    self.errorCompanyDetail.errors.showAllMessages();
                    self.isCompanyCCValidationShown = true;
                } else {
                    self.isCompanyCCValidationShown = false;
                }
            } else {
                self.isCompanyCCValidationShown = false;
            }

            if (self.isCompnayECheckSelected()) {
                if (self.errorCompanyDetail.errors().length !== 0) {
                    self.errorCompanyDetail.errors.showAllMessages();
                    self.isCompanyECValidationShown = true;
                } else {
                    self.isCompanyECValidationShown = false;
                }
            } else {
                self.isCompanyECValidationShown = false;
            }
        };

        OnlinePaymentConfigurationViewModel.prototype.resetAgencyDetails = function () {
            var self = this;
            self.agencyNameSearchList.agencyName('');
            self.agencyCCCharge($.number(Math.abs(0), 2));
            self.agencyCECharge($.number(Math.abs(0), 2));
            self.agencyCCNote('');
            self.agencyECNote('');
            self.agencyDCNote('');

            // Assign the reverse order of the current selection,
            // These values will be changed by the click event which is called below
            self.isAgencyCreditCaredSelected(false);
            self.isAgencyECheckSelected(false);
            self.isAgencyDebitCardSelected(false);

            self.selecteedAgencyCCchargeTypes('Fee');
            self.selecteedAgencyECchargeTypes('Discount');
        };

        OnlinePaymentConfigurationViewModel.prototype.resetCustomerDetails = function () {
            var self = this;
            self.customerName('');
            self.customerCCCharge($.number(Math.abs(0), 2));
            self.customerECharge($.number(Math.abs(0), 2));
            self.customerCCNote('');
            self.customerECNote('');
            self.customerDCNote('');

            // Assign the reverse order of the current selection,
            // These values will be changed by the click event which is called below
            self.isCustomerCreditCaredSelected(false);
            self.isCustomerECheckSelected(false);
            self.isCustomerDebitCardSelected(false);

            self.selecteedcustomerCCchargeTypes('Fee');
            self.selecteedcustomerECchargeTypes('Discount');
        };

        OnlinePaymentConfigurationViewModel.prototype.reloadCustomerDetails = function () {
            var self = this;
            if (self.agencyId()) {
                self.reportContainer.listProgress(true);
                var failCallback = function (errorMessage) {
                    self.reportContainer.listProgress(false);
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 2,
                        fadeOut: 2,
                        typeOfAlert: "",
                        title: ""
                    };

                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, errorMessage, "error", null, toastrOptions);
                };

                // gets all the customers and update the grid
                self.commonClient.getCustomersByAgencyId(self.agencyId(), function (data) {
                    self.reportContainer.listProgress(false);
                    self.setPagingData(ko.observableArray(data), self.gridOptions, self.reportAction);
                }, failCallback);
            }
        };

        //#endregion
        //#region Life Cycle Event
        OnlinePaymentConfigurationViewModel.prototype.beforeBind = function () {
            var self = this;
            self.load();
        };

        OnlinePaymentConfigurationViewModel.prototype.load = function () {
            var self = this;
            var successCallBack = function (data) {
                if (data != null) {
                    self.companyCCCharge($.number(Math.abs(data.CompanyOnlinePaymentDetail.CCProcessCharge), 2));
                    self.companyCECharge($.number(Math.abs(data.CompanyOnlinePaymentDetail.ECheckProcessCharge), 2));
                    self.companyCCNote(data.CompanyOnlinePaymentDetail.CCMessage);
                    self.companyECNote(data.CompanyOnlinePaymentDetail.ECheckMessage);
                    self.companyDCNote(data.CompanyOnlinePaymentDetail.DebitMessage);

                    // Assign the reverse order of the current selection,
                    // These values will be changed by the click event which is called below
                    self.isCompnayCreditCaredSelected(!data.CompanyOnlinePaymentDetail.CCVisibility);
                    self.isCompnayECheckSelected(!data.CompanyOnlinePaymentDetail.ECheckVisible);
                    self.isCompnayDebitCardSelected(!data.CompanyOnlinePaymentDetail.DebitVisibility);

                    // Update the UI, this will update the UI
                    self.companyCreditCardClick();
                    self.companyECheckClick();
                    self.companyDebitCardClick();

                    var creditCardType = $.grep(self.companyCCchargeTypes(), function (item) {
                        return item === data.CompanyOnlinePaymentDetail.CreditCardType;
                    });
                    var eCardType = $.grep(self.companyECchargeTypes(), function (item) {
                        return item === data.CompanyOnlinePaymentDetail.ECheckCardType;
                    });

                    self.selecteedcompanyCCchargeTypes(creditCardType[0]);
                    self.selecteedcompanyECchargeTypes(eCardType[0]);
                }
            }, faliureCallBack = function () {
            };

            self.commonClient.getOnlinePaymentDetail(successCallBack, faliureCallBack);
        };

        OnlinePaymentConfigurationViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        OnlinePaymentConfigurationViewModel.prototype.activate = function () {
            var self = this;
            return true;
        };

        OnlinePaymentConfigurationViewModel.prototype.deactivate = function () {
            var self = this;
            self.cleanup();
        };

        OnlinePaymentConfigurationViewModel.prototype.compositionComplete = function () {
        };

        OnlinePaymentConfigurationViewModel.prototype.cleanup = function () {
            var self = this;

            self.reportContainer.cleanup("OnlinePaymentCustomerGrid");
            self.agencyNameSearchList.cleanup();
            for (var prop in self) {
                if (prop !== "cleanup")
                    delete self[prop];
            }
            delete self;
        };
        return OnlinePaymentConfigurationViewModel;
    })();

    return OnlinePaymentConfigurationViewModel;
});
