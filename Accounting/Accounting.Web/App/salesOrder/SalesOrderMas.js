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
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/client/SalesOrderClient', 'salesOrder/SalesOrderMasDetails', 'salesOrder/SalesOrderMasArDetails'], function(require, exports, ___router__, ___app__, __refSalesOrderClient__, __refSalesOrderMasDetailsViewModel__, __refSalesOrderMasArDetailsViewModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refSalesOrderClient = __refSalesOrderClient__;
    
    var refSalesOrderMasDetailsViewModel = __refSalesOrderMasDetailsViewModel__;
    var refSalesOrderMasArDetailsViewModel = __refSalesOrderMasArDetailsViewModel__;

    //#endregion
    /*
    ** <summary>
    **Sales Order MAS ViewModel.
    ** </summary>
    ** <createDetails>
    ** <id>US21133</id> <by>Baldev Singh Thakur</by> <date>31-03-2016</date>
    ** </createDetails>}
    ** <changeHistory>
    ** </changeHistory>
    */
    var SalesOrderMasViewModel = (function () {
        function SalesOrderMasViewModel() {
            this.salesOrderClient = new refSalesOrderClient.SalesOrderClient();
            // Progress bar
            this.listProgress = ko.observable(false);
            this.salesOrderId = ko.observable(0);
            var self = this;

            self.salesOrderMasDetailsViewModel = new refSalesOrderMasDetailsViewModel.SalesOrderMasDetailsViewModel();
            self.salesOrderMasArDetailsViewModel = new refSalesOrderMasArDetailsViewModel.SalesOrderMasArDetailsViewModel();

            return self;
        }
        // #Region Private Methods
        // Initialization of the grid.
        SalesOrderMasViewModel.prototype.initializeMasDetails = function (data, salesOrderId) {
            var self = this;

            self.salesOrderId(salesOrderId);

            if (data) {
                self.salesOrderMasDetailsViewModel.gridHeader('Accounts Payable MAS Data/Remit To:');
                self.salesOrderMasArDetailsViewModel.gridHeader('Accounts Receivable MAS Data To:');

                self.salesOrderMasDetailsViewModel.initializeMasDetails(data, salesOrderId);
                self.salesOrderMasArDetailsViewModel.initializeMasDetails(data, salesOrderId);
            } else {
            }
        };
        return SalesOrderMasViewModel;
    })();
    exports.SalesOrderMasViewModel = SalesOrderMasViewModel;
});
