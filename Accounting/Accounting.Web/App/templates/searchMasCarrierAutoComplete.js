/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.datepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
//#endregion
define(["require", "exports", 'durandal/app', 'durandal/system', 'services/client/CommonClient'], function(require, exports, ___app__, __refSystem__, __refCommonClient__) {
    //#region Import
    var _app = ___app__;
    var refSystem = __refSystem__;
    
    
    var refCommonClient = __refCommonClient__;

    //#endregion
    /***********************************************
    SEARCH MAS CARRIER AUTOCOMPLETE VIEW MODEL
    ************************************************
    ** <summary>
    ** Search mas Carrier autocomplete view model.
    ** </summary>
    ** <createDetails>
    ** <id></id><by>Satish</by> <date>20th Aug, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by><date></date>
    ** </changeHistory>
    
    ***********************************************/
    var SearchMasCarrierAutoComplete = (function () {
        //#region Constructor
        function SearchMasCarrierAutoComplete(message) {
            //#region Members
            this.masCarrierName = null;
            this.id = ko.observable();
            this.name = ko.observable();
            this.isNotAtLoadingTime = false;
            this.returnValue = false;
            this.isCustomCss = ko.observable(false);
            this.errorWidth = ko.observable('92%');
            this.normalWidth = ko.observable('95%');
            this.isValidationRequired = ko.observable(true);
            //#endregion
            // client command
            this.commonClient = new refCommonClient.Common();
            var self = this;
            if (message == null || message.trim() == '') {
                self.masCarrierName = ko.observable('');
            } else {
                self.masCarrierName = ko.observable('').extend({
                    required: {
                        message: message,
                        onlyIf: function () {
                            return (self.isValidationRequired());
                        }
                    }
                });
            }

            //For searching Vendor Name
            self.searchMasCarrier = function (query, process) {
                self.name(null);
                return self.commonClient.searchMasCarriers(query, process);
            };

            //For Select vendor name for the dropdown
            self.onSelectMasCarrier = function (that, event) {
                that.id(event.obj.MassId);
                that.masCarrierName(event.obj.MassCarrierName);
                that.name(event.obj);
            };
        }
        //#endregion
        //#region Internal Methods
        //To validate the Mas Carrier
        SearchMasCarrierAutoComplete.prototype.vaildateSearchMasCarrierControl = function () {
            var self = this;
            if (!refSystem.isObject(self.name())) {
                self.masCarrierName('');
                self.id('');
            }
        };

        //#endregion
        SearchMasCarrierAutoComplete.prototype.cleanup = function () {
            var self = this;
            $('#txtmasCarrierName').typeahead('dispose');
            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }
        };
        return SearchMasCarrierAutoComplete;
    })();
    exports.SearchMasCarrierAutoComplete = SearchMasCarrierAutoComplete;
});
