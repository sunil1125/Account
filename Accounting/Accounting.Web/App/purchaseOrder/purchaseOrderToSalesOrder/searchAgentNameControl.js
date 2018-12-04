/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/bootstrap.datepicker.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../services/models/TypeDefs/CommonModels.d.ts" />
//#endregion
define(["require", "exports", 'durandal/app', 'durandal/system', 'services/client/PurchaseOrderClient', 'services/client/CommonClient'], function(require, exports, ___app__, __refSystem__, __refPurchaseOrderClient__, __refCommonClient__) {
    //#region Import
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    var refPurchaseOrderClient = __refPurchaseOrderClient__;
    var refCommonClient = __refCommonClient__;

    //#endregion
    /** <summary>
    * * ViewModel Class for search Agent Name
    * * < / summary >
    * * <createDetails>
    * * <id>US10941 < /id> <by>Bhanu pratap</by > <date> 09 - 29 - 2014 </date >
    * * < / createDetails >
    * * <changeHistory>
    * * < / changeHistory >
    */
    var SearchAgentNameControl = (function () {
        //#endregion
        //#region Constructor
        function SearchAgentNameControl(message, agentSearchCallBack) {
            //#region Members
            this.agentName = null;
            this.ID = ko.observable(0);
            this.AgencyId = ko.observable(0);
            this.name = ko.observable();
            this.isNotAtLoadingTime = false;
            this.returnValue = false;
            this.isCustomCss = ko.observable(true);
            this.isCustomCssSO = ko.observable(false);
            this.errorWidth = ko.observable('175px');
            this.normalWidth = ko.observable('170px');
            //To set Validation is required or not
            this.isValidationRequired = ko.observable(true);
            this.isEnable = ko.observable(true);
            // client commond
            this.commonClient = new refCommonClient.Common();
            this.purchaseOrderClient = new refPurchaseOrderClient.PurchaseOrderClient();
            var self = this;

            //callback for agent selection
            self.agentSearchCallBack = agentSearchCallBack;

            if (message == null || message.trim() == '') {
                self.agentName = ko.observable('');
            } else {
                self.agentName = ko.observable('').extend({
                    required: {
                        message: message,
                        onlyIf: function () {
                            return (self.isValidationRequired());
                        }
                    }
                });
            }

            //For searching Agent Name
            self.searchAgentName = function (query, process) {
                self.name(null);
                if (self.AgencyId() !== undefined && self.AgencyId() && self.AgencyId() > 0)
                    return self.purchaseOrderClient.searchAgentDetailsByAgencyId(query, self.AgencyId(), process);

                return null;
            };

            self.SetBITrackChange(self);

            self.getBITrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            self.isBIDirty = ko.computed(function () {
                var result = self.agentName();

                if (self.isNotAtLoadingTime)
                    return false;

                var returnValue = self.getBITrackChange().length > 0 ? true : false;
                self.returnValue = returnValue;
                if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
                    self.onChangesMade(returnValue);

                return returnValue;
            });

            //For Select Agent name for the dropdown
            self.onSelectAgentName = function (that, event) {
                that.ID(event.obj.GlobalNetUserId);
                that.agentName(event.obj.FullName);
                that.name(event.obj);
                self.agentSearchCallBack();
            };
        }
        //#endregion
        //#region Internal Methods
        //To validate the Agent Name
        SearchAgentNameControl.prototype.vaildateSearchAgentNameControl = function () {
            var self = this;
            if (!refSystem.isObject(self.name())) {
                self.agentName('');
                self.ID(0);
            }
        };

        SearchAgentNameControl.prototype.SetBITrackChange = function (self) {
            //** To detect changes for Agent Name
            self.agentName.extend({ trackChange: true });
        };

        //#endregion
        SearchAgentNameControl.prototype.cleanup = function () {
            var self = this;
            $('#txtAgentName').typeahead('dispose');
            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }

            delete self;
        };
        return SearchAgentNameControl;
    })();
    exports.SearchAgentNameControl = SearchAgentNameControl;
});
