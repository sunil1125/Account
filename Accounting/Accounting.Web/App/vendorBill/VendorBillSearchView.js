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
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'durandal/system', 'services/models/common/Enums', 'services/client/CommonClient', 'services/validations/Validations'], function(require, exports, ___router__, ___app__, __refSystem__, __refEnums__, __refCommon__, __refValidations__) {
    
    var _router = ___router__;
    var _app = ___app__;
    var refSystem = __refSystem__;
    var refEnums = __refEnums__;
    var refCommon = __refCommon__;
    var refValidations = __refValidations__;

    //#endregion
    /*
    ** <summary>
    ** Vendor Bill search View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US8435</id> <by>ACHAL RASTOGI</by> <date>04-24-2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <ID>US7651</ID> <BY>Satish</BY><DATE>19-Jun-2014</DATE><DESC>Implemented View Model to accept the search criteria.</DESC>
    ** </changeHistory>
    */
    var VendorBillSearchViewModel = (function () {
        //#endregion
        //#region Constructor
        function VendorBillSearchViewModel() {
            //#region Members
            //** holds the vendorName. */
            this.vendorName = ko.observable('');
            //** holds the shipperCompanyName
            this.shipperCompanyName = ko.observable('');
            //** holds the consigneeCompanyName
            this.consigneeCompanyName = ko.observable('');
            //** holds the pro number. */
            this.proNumber = ko.observable('');
            //** holds the bol Number. */
            this.bolNumber = ko.observable('');
            //** hold the customer bol number. */
            this.customerBOLNumber = ko.observable('');
            //** holds the po number. */
            this.poNumber = ko.observable('');
            //** holds the reference number. */
            this.refNumber = ko.observable('');
            //** holds the shipper zip. */
            this.shipperZip = ko.observable('');
            //** holds the consignee zip. */
            this.consigneeZip = ko.observable('');
            //** holds the total pieces. */
            this.totalPieces = ko.observable();
            //** holds total weight. */
            this.totalWeigth = ko.observable();
            //** holds vendor amount. */
            this.vendorAmount = ko.observable();
            //** holds bill status list. */
            this.billStatusList = ko.observableArray([]);
            //**holds the selected value of bill status. */
            this.selectedbillStatusList = ko.observable();
            //** holds shipper city. */
            this.shipperCity = ko.observable('');
            //** holds consignee city. */
            this.consigneeCity = ko.observable('');
            //** holds item numbers. */
            this.itemNumberList = ko.observableArray([]);
            //** holds the selected date range option. */
            this.itemNumberSelectedOption = ko.observable('');
            //** holds the date range options. */
            this.dateRangeOptionsList = ko.observableArray([]);
            //** holds the selected date range option. */
            this.dateRangeSelectedOption = ko.observable();
            //** isDate section disable or enable? */
            this.isDateSectionVisible = ko.observable(false);
            this.fromDate = ko.observable('');
            this.toDate = ko.observable('');
            this.CommonUtils = new Utils.Common();
            var self = this;

            //#region Date Validation
            self.fromDate = ko.observable().extend({
                required: {
                    message: ApplicationMessages.Messages.BillDateIsRequired
                },
                validation: {
                    validator: function () {
                        return refValidations.Validations.isValidDate(self.fromDate(), self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "FromDate");
                    },
                    message: ApplicationMessages.Messages.NotAValidDate
                }
            });
            self.toDate = ko.observable().extend({
                required: {
                    message: ApplicationMessages.Messages.DeliveryDateRequired
                },
                validation: {
                    validator: function () {
                        return refValidations.Validations.isValidDate(self.toDate(), self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'), "ToDate");
                    },
                    message: ApplicationMessages.Messages.NotAValidDate
                }
            });

            if (refSystem.isObject(refEnums.Enums.DateRange)) {
                self.dateRangeOptionsList.removeAll();
                for (var item in refEnums.Enums.DateRange) {
                    self.dateRangeOptionsList.push(refEnums.Enums.DateRange[item]);
                }
            }

            if (refSystem.isObject(refEnums.Enums.VendorBillStatus)) {
                for (var item in refEnums.Enums.VendorBillStatus) {
                    self.billStatusList.push(refEnums.Enums.VendorBillStatus[item]);
                }
            }

            // Load all shipment types if not loaded already
            var itemNumberList = self.itemNumberList().length;
            if (!(itemNumberList)) {
                refCommon.Common.prototype.GetListShipmentType(function (data) {
                    if (data) {
                        self.itemNumberList.removeAll();
                        self.itemNumberList.push.apply(self.itemNumberList, data);
                    }
                });
            }

            //#end region
            //To check if enter value is digit and decimal
            self.isNumber = function (data, event) {
                var charCode = (event.which) ? event.which : event.keyCode;

                if ((charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57))) {
                    return false;
                }
                return true;
            };

            //** To initialize the dates. */
            self.fromDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));
            self.toDate(self.CommonUtils.formatDate(new Date(), 'mm/dd/yyyy'));

            //** To set The date picker options. */
            self.datepickerOptions = {
                blockWeekend: true,
                blockPreviousDays: false,
                blockHolidaysDays: true,
                autoClose: true,
                placeBelowButton: false,
                endDate: new Date()
            };
            self.datepickerOptionsDelivery = {
                blockWeekend: true,
                blockPreviousDays: false,
                blockHolidaysDays: true,
                autoClose: true,
                placeBelowButton: false
            };

            //** Set the visibility of date section according to the current date range selection. */
            self.dateRangeSelectedOption.subscribe(function () {
                if (self.dateRangeSelectedOption() !== refEnums.Enums.DateRange.Custom.ID)
                    self.isDateSectionVisible(false);
else
                    self.isDateSectionVisible(true);
            });

            return self;
        }
        //#endregion
        //#region Internal Methods
        //#endregion
        //#region Life Cycle Event
        VendorBillSearchViewModel.prototype.activate = function () {
            return true;
        };

        // Gets the all needed values like ENUMs
        VendorBillSearchViewModel.prototype.beforeBind = function () {
            var self = this;
        };
        return VendorBillSearchViewModel;
    })();
    exports.VendorBillSearchViewModel = VendorBillSearchViewModel;
});
