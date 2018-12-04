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
define(["require", "exports", 'plugins/router', 'durandal/app'], function(require, exports, ___router__, ___app__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    
    
    

    //#endregion
    /*
    ** <summary>
    ** Report Finalized Order With No Vendor Bills View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US13250</id> <by>Chandan</by> <date>11-27-2014</date>}
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var Edi210CarrierExceptionOriginalBillItemViewModel = (function () {
        //#endregion
        //#region CONSTRUCTOR
        function Edi210CarrierExceptionOriginalBillItemViewModel() {
            //#region MEMBERS
            this.ediOriginalItemsList = ko.observableArray([]);
            this.totalCost = ko.observable(0);
            var self = this;

            return self;
            //#endregion
        }
        //#region Public Method
        Edi210CarrierExceptionOriginalBillItemViewModel.prototype.initilizeOriginalItems = function (items) {
            var self = this;
            self.ediOriginalItemsList.removeAll();
            items.forEach(function (item) {
                self.ediOriginalItemsList.push(new ediOriginalItemsModel(item));
            });
            self.updateTotalCostAndWeight();
        };

        //#endregion Public Method
        //#region Private Method
        Edi210CarrierExceptionOriginalBillItemViewModel.prototype.updateTotalCostAndWeight = function () {
            var self = this;

            var totalCost = 0.0;

            self.ediOriginalItemsList().forEach(function (item) {
                if (item.cost()) {
                    var costWithoutComma = item.cost().toString();
                    var check = costWithoutComma.indexOf(",");
                    if (check === -1) {
                        totalCost += parseFloat(item.cost().toString());
                    } else {
                        //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                        totalCost += parseFloat(costWithoutComma.replace(/,/g, ""));
                    }
                }
            });

            self.totalCost($.number(totalCost, 2));
        };

        //#region Private Method
        //#region LIFE CYCLE EVENT
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        Edi210CarrierExceptionOriginalBillItemViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //The composition engine will execute it prior to calling the binder.
        Edi210CarrierExceptionOriginalBillItemViewModel.prototype.activate = function () {
            return true;
        };

        //To load the registered data if any existed.
        Edi210CarrierExceptionOriginalBillItemViewModel.prototype.beforeBind = function () {
            var self = this;
            //_app.trigger("loadMyData", function (data) {
            //	if (data) {
            //		self.load(data);
            //	} else {
            //	}
            //});
        };
        return Edi210CarrierExceptionOriginalBillItemViewModel;
    })();
    exports.Edi210CarrierExceptionOriginalBillItemViewModel = Edi210CarrierExceptionOriginalBillItemViewModel;
    var ediOriginalItemsModel = (function () {
        //#region CONSTRUCTOR
        function ediOriginalItemsModel(item) {
            //#region MEMBERS
            this.items = ko.observable('');
            this.description = ko.observable('');
            this.cost = ko.observable(0);
            this.selectedClass = ko.observable(0);
            this.weight = ko.observable(0);
            this.pcs = ko.observable(0);
            this.dimensionLength = ko.observable(0);
            this.dimensionWidth = ko.observable(0);
            this.dimensionHeight = ko.observable(0);
            this.differenceAmount = ko.observable(0);
            var self = this;

            if (typeof (item) !== 'undefined') {
                self.items(item.ItemName);
                self.description(item.UserDescription);
                self.cost($.number((item.Cost), 2));
                self.selectedClass(item.SelectedClassType);
                self.weight(item.Weight);
                self.pcs(item.PieceCount);
                self.dimensionLength(item.DimensionLength);
                self.dimensionWidth(item.DimensionWidth);
                self.dimensionHeight(item.DimensionHeight);
            }

            return self;
            //#endregion
        }
        return ediOriginalItemsModel;
    })();
    exports.ediOriginalItemsModel = ediOriginalItemsModel;
});
