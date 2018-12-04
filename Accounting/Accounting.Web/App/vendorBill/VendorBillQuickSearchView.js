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
define(["require", "exports", 'plugins/router', 'durandal/app', 'templates/searchVendorNameControl', 'services/client/CommonClient'], function(require, exports, ___router__, ___app__, __refVendorNameSearchControl__, __refCommon__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refVendorNameSearchControl = __refVendorNameSearchControl__;
    
    var refCommon = __refCommon__;

    //#endregion
    /*
    ** <summary>
    ** Vendor Bill Quick search View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US8967</id> <by>SANKESH POOJARI</by> <date>05-02-2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var VendorBillQuickSearchViewModel = (function () {
        //#endregion
        //#region Constructor
        function VendorBillQuickSearchViewModel() {
            //#region Members
            // client command
            this.commonClient = new refCommon.Common();
            this.proNumber = ko.observable('');
            this.bolNumber = ko.observable('');
            this.poNumber = ko.observable('');
            // list of all bill status
            this.billStatusList = ko.observableArray([]);
            // selected bill sattus
            this.selectedbillStatus = ko.observable();
            // width to apply when there is no validation.
            this.normalWidth = ko.observable('36.3%');
            // width to apply when there is validation.
            this.errorWidth = ko.observable('233px');
            var self = this;
            self.vendorNameSearchList = new refVendorNameSearchControl.SearchVendorNameControl('', '36.3%', '', false);

            // to get the vendorId after selecting vendor
            self.vendorId = ko.computed(function () {
                if (self.vendorNameSearchList.name() != null)
                    return self.vendorNameSearchList.ID();

                return 0;
            });

            // to get the vendor Name after selecting vendor
            self.vendorName = ko.computed(function () {
                if (self.vendorNameSearchList.name() != null)
                    return self.vendorNameSearchList.vendorName();

                return null;
            });

            // Load all classes if not loaded already
            var statusLength = self.billStatusList().length;
            if (!(statusLength)) {
                _app.trigger("GetStatusList", function (data) {
                    self.billStatusList.removeAll();
                    self.billStatusList.push.apply(self.billStatusList, data);
                });
            }

            // pro validation for minimum three characters
            self.proNumber.extend({
                minLength: {
                    message: ApplicationMessages.Messages.MinimumCharactersRequired,
                    params: 3
                }
            });

            // pro validation for minimum three characters
            self.bolNumber.extend({
                minLength: {
                    message: ApplicationMessages.Messages.MinimumCharactersRequired,
                    params: 3
                }
            });

            // po validation for minimum three characters
            self.poNumber.extend({
                minLength: {
                    message: ApplicationMessages.Messages.MinimumCharactersRequired,
                    params: 3
                }
            });

            self.errorVendorBillQuickSearch = ko.validatedObservable({
                proNumber: self.proNumber,
                bolNumber: self.bolNumber,
                poNumber: self.poNumber
            });
        }
        //#endregion
        //#region Internal Methods
        VendorBillQuickSearchViewModel.prototype.validateQuickSearch = function () {
            var self = this;
            var isInvalid = false;
            if (self.errorVendorBillQuickSearch.errors().length != 0) {
                self.errorVendorBillQuickSearch.errors.showAllMessages();
                return true;
            } else {
                return false;
            }
        };

        //#endregion
        //#region Life Cycle Event
        VendorBillQuickSearchViewModel.prototype.activate = function () {
            return true;
        };

        VendorBillQuickSearchViewModel.prototype.cleanup = function () {
            var self = this;
            self.vendorNameSearchList.cleanUp();
        };
        return VendorBillQuickSearchViewModel;
    })();
    exports.VendorBillQuickSearchViewModel = VendorBillQuickSearchViewModel;
});
