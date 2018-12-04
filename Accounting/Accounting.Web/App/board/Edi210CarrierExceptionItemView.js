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
/// <reference path="../services/models/TypeDefs/Boards.d.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/client/BoardsClient'], function(require, exports, ___router__, ___app__, __refBoardsClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    
    
    
    var refBoardsClient = __refBoardsClient__;

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
    var Edi210CarrierExceptionItemViewModel = (function () {
        //#endregion
        //#region CONSTRUCTOR
        function Edi210CarrierExceptionItemViewModel(enableSaveButtonOnUnmapped) {
            //#region MEMBERS
            this.boardClient = new refBoardsClient.BoardsClientCommands();
            this.ediItemsList = ko.observableArray([]);
            this.itemCodeANSICode = ko.observableArray([]);
            this.selecteditemCodeANSICode = ko.observable();
            this.itemCodeCarrierId = ko.observableArray([]);
            this.selecteditemCodesCarrierID = ko.observable();
            var self = this;
            self.enableSaveButtonOnUnmapped = enableSaveButtonOnUnmapped;
            self.GetANSICodeORCarrierCode();

            return self;
            //#endregion
        }
        //#region Public Method
        Edi210CarrierExceptionItemViewModel.prototype.initilizeEDIItemDetails = function (items) {
            var self = this;
            self.selecteditemCodesCarrierID(null);
            self.selecteditemCodeANSICode(null);
            self.ediItemsList.removeAll();
            self.GetANSICodeORCarrierCode();

            items.forEach(function (item) {
                var ediItemModel = new ediItemsModel(item, function (hasValue) {
                    self.enableSaveButtonOnUnmapped(hasValue);
                });
                ediItemModel.initializeEDIItem(item);
                self.ediItemsList.push(new ediItemsModel(item, function (hasValue) {
                    self.enableSaveButtonOnUnmapped(hasValue);
                }));
            });
        };

        //
        Edi210CarrierExceptionItemViewModel.prototype.GetANSICodeORCarrierCode = function () {
            var _this = this;
            var self = this;
            self.boardClient.GetAllCodeDescriptionStandardMappings(function (dataCode) {
                if (dataCode) {
                    var self = _this;
                    self.itemCodeANSICode.removeAll();
                    self.itemCodeANSICode.push.apply(self.itemCodeANSICode, dataCode);
                }
            }, function () {
            });
        };

        //
        Edi210CarrierExceptionItemViewModel.prototype.GetCarrierCode = function (carrierId) {
            var _this = this;
            var self = this;
            self.boardClient.GetCarrierItemCodeMappingBasedonCarrierID(carrierId, function (dataCode) {
                if (dataCode) {
                    var self = _this;
                    self.itemCodeCarrierId.removeAll();
                    self.itemCodeCarrierId.push.apply(self.itemCodeCarrierId, dataCode);
                }
            }, function () {
            });
        };

        //#endregion Public Method
        //#region Private Method
        //#region Private Method
        //#region LIFE CYCLE EVENT
        // Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
        Edi210CarrierExceptionItemViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        //The composition engine will execute it prior to calling the binder.
        Edi210CarrierExceptionItemViewModel.prototype.activate = function () {
            return true;
        };

        //To load the registered data if any existed.
        Edi210CarrierExceptionItemViewModel.prototype.beforeBind = function () {
            var self = this;
            //_app.trigger("loadMyData", function (data) {
            //	if (data) {
            //		self.load(data);
            //	} else {
            //	}
            //});
        };
        return Edi210CarrierExceptionItemViewModel;
    })();
    exports.Edi210CarrierExceptionItemViewModel = Edi210CarrierExceptionItemViewModel;

    var ediItemsModel = (function () {
        //#region CONSTRUCTOR
        function ediItemsModel(item, AnsiOrCarrierChangeCallBack) {
            //#region MEMBERS
            this.ediItemsListMainModel = ko.observableArray([]);
            this.items = ko.observable('');
            this.description = ko.observable('');
            this.cost = ko.observable(0);
            this.selectedClass = ko.observable('');
            this.weight = ko.observable(0);
            this.pcs = ko.observable('');
            this.dimensionLength = ko.observable('');
            this.dimensionWidth = ko.observable('');
            this.dimensionHeight = ko.observable('');
            this.differenceAmount = ko.observable(0);
            this.mappedCode = ko.observable('');
            this.selecteditemCodeANSICode = ko.observable();
            this.selecteditemCodesCarrierID = ko.observable();
            this.id = ko.observable(0);
            var self = this;

            if (typeof (item) !== 'undefined') {
                self.items(item.Item);
                self.description(item.Description);
                self.cost($.number((item.Cost), 2));
                self.selectedClass(item.Class);
                self.weight(item.Weight);
                self.pcs(item.Pieces);
                self.dimensionLength(item.Length);
                self.dimensionWidth(item.Width);
                self.dimensionHeight(item.Height);
                self.id(item.ID);
                if (self.selecteditemCodesCarrierID() !== undefined) {
                    if (self.selecteditemCodesCarrierID()) {
                        self.mappedCode(self.selecteditemCodesCarrierID().Code);
                    } else {
                        self.mappedCode(self.selecteditemCodeANSICode().Code);
                    }
                }
            }

            if (typeof (AnsiOrCarrierChangeCallBack) !== 'undefined') {
                self.AnsiOrCarrierChangeCallBack = AnsiOrCarrierChangeCallBack;
            }

            //Ansi Code subscribe will reset the Carrier Code Subscribe.
            self.selecteditemCodeANSICode.subscribe(function (newValue) {
                if (typeof (newValue) != 'undefined' && newValue !== null && newValue.ItemId > 0) {
                    self.mappedCode(newValue.Code);
                    self.selecteditemCodesCarrierID(null);
                    self.AnsiOrCarrierChangeCallBack(true);
                }
            });

            // Carrier Code Subscribe will reset the AnsiCode
            self.selecteditemCodesCarrierID.subscribe(function (newValue) {
                if (typeof (newValue) != 'undefined' && newValue !== null && newValue.CarrierID > 0) {
                    self.mappedCode(newValue.Code);
                    self.selecteditemCodeANSICode(null);
                    self.AnsiOrCarrierChangeCallBack(true);
                }
            });

            return self;
            //#endregion
        }
        //#region Public Method
        ediItemsModel.prototype.initializeEDIItem = function (item) {
            var self = this;
            if (item != null) {
                self.items(item.Item);
                self.description(item.Description);
                self.cost($.number((item.Cost), 2));
                self.selectedClass(item.Class);
                self.weight(item.Weight);
                self.pcs(item.Pieces);
                self.dimensionLength(item.Length);
                self.dimensionWidth(item.Width);
                self.dimensionHeight(item.Height);
                self.mappedCode(item.MappedCode);
                self.id(item.ID);
            }
        };
        return ediItemsModel;
    })();
    exports.ediItemsModel = ediItemsModel;
});
