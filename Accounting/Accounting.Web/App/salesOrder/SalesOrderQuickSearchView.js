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
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/client/CommonClient'], function(require, exports, ___router__, ___app__, __refCommon__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refCommon = __refCommon__;

    //#endregion
    /*
    ** <summary>
    ** Sales Order Quick search View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US8967</id> <by>Bhanu pratap</by> <date>Aug-262014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var SalesOrderQuickSearchViewModel = (function () {
        //#endregion
        //#region Constructor
        function SalesOrderQuickSearchViewModel() {
            //#region Members
            // client command
            this.commonClient = new refCommon.Common();
            this.proNumber = ko.observable('');
            this.bolNumber = ko.observable('');
            this.poNumber = ko.observable('');
            this.shipperZip = ko.observable('');
            this.consigneeZip = ko.observable('');
            this.normalWidth = ko.observable('250px');
            this.errorWidth = ko.observable('233px');
            var self = this;

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

            // shipperZip validation for minimum three characters
            self.shipperZip.extend({
                minLength: {
                    message: ApplicationMessages.Messages.MinimumCharactersRequired,
                    params: 3
                }
            });

            // consigneeZip validation for minimum three characters
            self.consigneeZip.extend({
                minLength: {
                    message: ApplicationMessages.Messages.MinimumCharactersRequired,
                    params: 3
                }
            });

            self.errorSalesOrderQuickSearch = ko.validatedObservable({
                proNumber: self.proNumber,
                bolNumber: self.bolNumber,
                poNumber: self.poNumber,
                shipperZip: self.shipperZip,
                consigneeZip: self.consigneeZip
            });
        }
        //#endregion
        //#region Internal Methods
        SalesOrderQuickSearchViewModel.prototype.validateQuickSearch = function () {
            var self = this;
            var isInvalid = false;
            if (self.errorSalesOrderQuickSearch.errors().length != 0) {
                self.errorSalesOrderQuickSearch.errors.showAllMessages();
                return true;
            } else {
                return false;
            }
        };

        //#endregion
        //#region Life Cycle Event
        SalesOrderQuickSearchViewModel.prototype.activate = function () {
            return true;
        };
        return SalesOrderQuickSearchViewModel;
    })();
    exports.SalesOrderQuickSearchViewModel = SalesOrderQuickSearchViewModel;
});
