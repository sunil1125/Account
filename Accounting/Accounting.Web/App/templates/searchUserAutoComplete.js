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
    /** <summary>
    * *		Search User Auto Complete View Model
    * * < / summary >
    * * <createDetails>proNumber
    * *		<by>Avinash Dubey</by >
    * *		<date>04 - 21 - 2014 </date >
    * * < / createDetails >
    */
    var SearchUserAutoComplete = (function () {
        //#region Constructor
        function SearchUserAutoComplete(message, normalWidth, errorWidth, isRequiredField) {
            //#region Members
            this.userName = null;
            this.id = ko.observable(0);
            this.isEnable = ko.observable(true);
            this.name = ko.observable();
            this.isNotAtLoadingTime = false;
            this.returnValue = false;
            this.isCustomCss = ko.observable(true);
            this.errorWidth = ko.observable('188px');
            this.normalWidth = ko.observable('212px');
            //#endregion
            // client command
            this.commonClient = new refCommonClient.Common();
            var self = this;

            if (typeof normalWidth !== 'undefined')
                self.normalWidth(normalWidth);

            if (typeof errorWidth !== 'undefined')
                self.errorWidth(errorWidth);

            if (typeof isRequiredField !== 'undefined')
                self.isCustomCss(isRequiredField);

            if (message == null || message.trim() == '') {
                self.userName = ko.observable('');
            } else {
                self.userName = ko.observable('').extend({ required: { message: message } });
            }

            //For searching Vendor Name
            self.searchUserName = function (query, process) {
                self.name(null);
                return self.commonClient.searchUsers(query, process);
            };

            //For Select vendor name for the dropdown
            self.onSelectUserName = function (that, event) {
                that.id(event.obj.Id);
                that.userName(event.obj.FirstName);
                that.emailId = event.obj.Email;
                that.name(event.obj);
            };

            self.customClass = ko.computed(function () {
                return self.isCustomCss() === true ? "vendorbilltextbox requiredFieldBgColor" : "";
            });
        }
        //#endregion
        //#region Internal Methods
        //To validate the Vendor Name
        SearchUserAutoComplete.prototype.vaildateSearchVendorNameControl = function () {
            var self = this;
            if (!refSystem.isObject(self.name())) {
                self.userName('');
                self.id(0);
            }
        };

        //#endregion
        SearchUserAutoComplete.prototype.cleanup = function () {
            var self = this;
            $('#txtuserName').typeahead('dispose');
        };
        return SearchUserAutoComplete;
    })();
    exports.SearchUserAutoComplete = SearchUserAutoComplete;
});
