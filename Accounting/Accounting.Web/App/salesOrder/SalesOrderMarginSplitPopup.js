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
define(["require", "exports", 'plugins/router', 'durandal/app'], function(require, exports, ___router__, ___app__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    

    //#endregion
    /*
    ** <summary>
    ** Vendor Bill Dispute Losts View Model.
    ** </summary>
    ** <createDetails>
    ** <id></id> <by>Chadnan</by> <date>06 Dec, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var SalesOrderMarginSplitPopupViewModel = (function () {
        //#endregion Member
        //#region Constructor
        function SalesOrderMarginSplitPopupViewModel() {
            this.repAbsorbingPerc = ko.observable('').extend({ required: { message: "A valid Shipper Rep Absorbing percentage is required." }, trackChange: true });
            this.gtAbsorbingPerc = ko.observable(0);
            this.negativeMargin = ko.observable('');
            this.updatedBy = ko.observable('');
            this.shipmentId = ko.observable('');
            this.grossProfit = ko.observable(0);
            this.finalProfit = ko.observable(0);
            this.doRequote = ko.observable(true);
            this.IsSplitMarginAccespted = ko.observable(true);
            this.isClosed = ko.observable(false);
            // Utility class object
            this.CommonUtils = new Utils.Common();
            var self = this;
            self.percentageValidation = { allowdecimal: ko.observable(true) };

            //validation
            self.errorvalidaionDetail = ko.validatedObservable({
                repAbsorbingPerc: this.repAbsorbingPerc
            });

            // subscribe to validate absorbing percentage
            self.repAbsorbingPerc.subscribe(function (newValue) {
                if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.repAbsorbingPerc())) {
                    var perc = 100;
                    if (!isNaN(parseFloat(self.repAbsorbingPerc()))) {
                        self.gtAbsorbingPerc(perc - parseFloat(self.repAbsorbingPerc()));
                    }
                }
            });

            return self;
        }
        //close popup
        SalesOrderMarginSplitPopupViewModel.prototype.clickOnOk = function (dialogResult) {
            var self = this;
            if (self.errorvalidaionDetail.errors().length != 0) {
                self.errorvalidaionDetail.errors.showAllMessages();
                return true;
            } else {
                //Save
                self.isClosed(false);
                return dialogResult.__dialog__.close(this, dialogResult);
            }
            return true;
        };

        SalesOrderMarginSplitPopupViewModel.prototype.closePopup = function (dialogResult) {
            var self = this;
            self.isClosed(true);
            dialogResult.__dialog__.close(this, dialogResult);
            return true;
        };

        //#region Life Cycle Event
        SalesOrderMarginSplitPopupViewModel.prototype.load = function () {
        };
        SalesOrderMarginSplitPopupViewModel.prototype.compositionComplete = function (view, parent) {
            //$('#txtuserName').focus();
        };

        // Activate the view and bind the selected data from the main view
        SalesOrderMarginSplitPopupViewModel.prototype.activate = function (refresh) {
            var self = this;

            if (refresh.bindingObject) {
                self.negativeMargin(refresh.bindingObject.costDifference.toString());
                self.updatedBy(refresh.bindingObject.CurrentUserId.toString());
                self.shipmentId(refresh.bindingObject.mainSalesOrderRowId.toString());
            }
        };
        return SalesOrderMarginSplitPopupViewModel;
    })();

    return SalesOrderMarginSplitPopupViewModel;
});
