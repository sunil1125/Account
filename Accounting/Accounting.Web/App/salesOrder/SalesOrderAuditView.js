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
    ** Sales Order Audit View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US12721</id> <by>Sankesh</by> <date>16th Oct, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>}
    */
    var SalesOrderAuditViewModel = (function () {
        //#endregion
        //#region Constructor
        function SalesOrderAuditViewModel() {
            //#region Members
            this.processLog = ko.observable('');
            var self = this;

            // Handles the add command
            return self;
        }
        //#endregion
        //#region Internal public Methods
        //#region Internal public Methods
        SalesOrderAuditViewModel.prototype.initializeAuditDetails = function (data) {
            var self = this;

            if (data) {
                self.processLog(data);
            }
        };
        return SalesOrderAuditViewModel;
    })();
    exports.SalesOrderAuditViewModel = SalesOrderAuditViewModel;
});
