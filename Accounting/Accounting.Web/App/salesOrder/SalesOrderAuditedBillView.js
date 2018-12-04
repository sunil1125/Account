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
define(["require", "exports", 'plugins/router', 'durandal/app', 'salesOrder/SalesOrderAuditedBillItemsView', 'services/models/common/Enums', 'services/client/SalesOrderClient', 'services/validations/Validations'], function(require, exports, ___router__, ___app__, __refSalesOrderAuditedBillItemViewModel__, __refEnums__, __refSalesOrderClient__, __refValidations__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refSalesOrderAuditedBillItemViewModel = __refSalesOrderAuditedBillItemViewModel__;
    var refEnums = __refEnums__;
    
    var refSalesOrderClient = __refSalesOrderClient__;
    var refValidations = __refValidations__;
    
    
    
    

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
    var SalesOrderAuditedBillViewModel = (function () {
        //#endregion
        //#region Constructor
        function SalesOrderAuditedBillViewModel(copyCostCallBack) {
            //#region Members
            this.salesOrderClient = null;
            this.salesOrderOriginalBillItem = ko.observableArray([]);
            this.salesOrderAuditedBillItem = ko.observableArray([]);
            this.selectedItemsList = ko.observableArray([]);
            this.selectedItem = null;
            this.mainOrderItemList = ko.observableArray([]);
            this.vendorBillItem = ko.observableArray([]);
            this.matchrowArray = ko.observableArray([]);
            this.orgZip = ko.observable('');
            this.destZip = ko.observable('');
            this.pro = ko.observable('');
            this.po = ko.observable('');
            this.ref = ko.observable('');
            this.btnCopyEnable = ko.observable(false);
            this.billDate = ko.observable('');
            // common utils class object
            this.commonUtils = new Utils.Common();
            this.listProgress = ko.observable(false);
            this.shipmentItemTypes = ko.observableArray([]);
            this.checkMsgDisplay = true;
            this.isCallAgain = true;
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
                placeBelowButton: false
            };

            //To check if Msg is clicked
            self.checkMsgClick = function () {
                self.checkMsgDisplay = true;
            };

            // to Check if Msg is hidden or closed
            self.checkMsgHide = function () {
                self.checkMsgDisplay = true;
            };
        }
        //#endregion
        //#region Internal public Methods
        SalesOrderAuditedBillViewModel.prototype.initializeAuditedBillDetails = function (vendorbillid, enable) {
            var self = this;

            self.salesOrderOriginalBillItemViewModel.gridHeader("Original Bill");
            self.salesOrderOriginalBillItemViewModel.isSelect(true);
            self.salesOrderOriginalBillItemViewModel.selected(false);

            self.salesOrderAuditedBillItemViewModel.gridHeader("Audited Bill");
            self.salesOrderAuditedBillItemViewModel.isSelect(false);
            self.listProgress(true);
            var successCallBack = function (data) {
                if (data != null) {
                    self.billDate(data.VendorBill.BillDate ? self.commonUtils.formatDate(data.VendorBill.BillDate.toString(), 'mm/dd/yyyy') : '');
                    self.destZip(data.VendorBill.DestinationZip);
                    self.orgZip(data.VendorBill.OriginZip);
                    self.pro(data.VendorBill.ProNumber);
                    self.po(data.VendorBill.PoNumber);
                    self.ref(data.VendorBill.ReferenceNumber);
                    self.salesOrderOriginalBillItem().removeAll();
                    self.salesOrderAuditedBillItem().removeAll();
                    if (data.VendorBillItemsDetail.length > 0) {
                        self.btnCopyEnable(enable);
                        for (var i = 0; i < data.VendorBillItemsDetail.length; i++) {
                            if (data.VendorBillItemsDetail[i].IsBackupCopy == 0) {
                                self.salesOrderOriginalBillItem().push(data.VendorBillItemsDetail[i]);
                            } else {
                                self.salesOrderAuditedBillItem().push(data.VendorBillItemsDetail[i]);
                            }
                        }
                        self.salesOrderOriginalBillItemViewModel.initializeSalesOrderAuditedBillItemDetails(self.salesOrderOriginalBillItem(), enable);
                        self.salesOrderAuditedBillItemViewModel.initializeSalesOrderAuditedBillItemDetails(self.salesOrderAuditedBillItem(), enable);
                    }
                }
                self.listProgress(false);
                self.isCallAgain = false;
            }, faliureCallBack = function () {
                self.listProgress(false);
            };
            self.salesOrderClient.GetSalesOrderAuditedBillDetailByVendorBillId(vendorbillid, successCallBack, faliureCallBack);
        };

        SalesOrderAuditedBillViewModel.prototype.cleanUp = function () {
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
        };

        //#endregion
        //#region Internal private methods
        SalesOrderAuditedBillViewModel.prototype.convertTobillDateDate = function () {
            var self = this;
            if (self.billDate() !== undefined) {
                if (!self.billDate().match('/') && self.billDate().length > 0) {
                    self.billDate(refValidations.Validations.CommonDate.prototype.ConvertToDate(self.billDate()));
                }
            }
        };

        //For Copying Cost
        SalesOrderAuditedBillViewModel.prototype.copyCostOnly = function () {
            var self = this;

            self.btnCopyEnable(false);
            var items = $.grep(self.salesOrderOriginalBillItemViewModel.salesOrderOriginalItemsList(), function (e) {
                return e.isCheck();
            });
            if (items.length > 0) {
                self.copyCostCall(items);
            } else {
                if (self.checkMsgDisplay) {
                    self.checkMsgDisplay = false;
                    var toastrOptions = {
                        toastrPositionClass: "toast-top-middle",
                        delayInseconds: 3,
                        fadeOut: 3,
                        typeOfAlert: "",
                        title: ""
                    };
                    Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.PleaseSelectanItem, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
                }
            }
            self.btnCopyEnable(true);
        };
        return SalesOrderAuditedBillViewModel;
    })();
    exports.SalesOrderAuditedBillViewModel = SalesOrderAuditedBillViewModel;
});
