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
/// <reference path="../services/models/TypeDefs/VendorBillSearchModel.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/models/common/Enums', 'services/client/UserClient'], function(require, exports, ___router__, ___app__, __refEnums__, ___refUserClient__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refEnums = __refEnums__;
    var _refUserClient = ___refUserClient__;

    //#endregion
    /***********************************************
    MY SETTING VIEW VIEW MODEL
    ************************************************
    ** <createDetails>
    ** <id>US12574</id><by>Chandan</by> <date>3rd oct, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id><by></by> <date></date>
    ** </changeHistory>
    
    ***********************************************/
    var MySettingViewModel = (function () {
        //#endregion
        //#region Constructor
        function MySettingViewModel() {
            //#region members
            this.Theme = ko.observable('');
            this.selectedTheme = ko.observable('');
            this.enbaleThemeSaveButton = ko.observable(false);
            this.userClient = new _refUserClient.UserClient();
            var self = this;

            self.selectedTheme.subscribe(function (themeName) {
                var regex = /theme/;
                var themeFromLink = $("body> link").attr("href");
                var selectedThemeName = themeFromLink.substring(themeFromLink.lastIndexOf('/') + 1);
                if (themeName + '.css' !== selectedThemeName) {
                    self.enbaleThemeSaveButton(true);
                } else {
                    self.enbaleThemeSaveButton(false);
                }
            });

            return self;
        }
        //#endregion
        //#region Internal Methods
        MySettingViewModel.prototype.saveTheme = function () {
            var self = this;

            var regex = /theme/;
            var themeFromLink = $("body> link").attr("href");
            var themePath = themeFromLink.substring(0, themeFromLink.lastIndexOf('/') + 1);
            var newTheme = themePath + self.selectedTheme() + '.css';
            if (regex.test($("body> link").attr("href"))) {
                $("body> link").attr("href", newTheme);
            }
            $('#themeColorContainer').find('div').removeClass('selectedTheme');
            $('#div' + self.selectedTheme()).addClass('selectedTheme');

            self.userClient.SaveThemeName(self.selectedTheme(), function (data) {
                self.enbaleThemeSaveButton(false);

                //self.customerSettings().UserSettings.TemplateName = self.selectedTheme();
                var toastrOptions1 = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };

                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SavingUserThemeSuccessfully, "success", null, toastrOptions1, null);
            }, function () {
                var toastrOptions = {
                    toastrPositionClass: "toast-top-middle",
                    delayInseconds: 10,
                    fadeOut: 10,
                    typeOfAlert: "",
                    title: ""
                };

                Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.ErrorWhileSavingUserTheme, "error", null, toastrOptions, null);
            });
        };

        MySettingViewModel.prototype.setSelectedTheme = function () {
            var self = this;
            var regex = /theme/;
            var themeFromLink = $("body> link").attr("href");
            var themeName = themeFromLink.substring(themeFromLink.lastIndexOf('/') + 1);
            if (themeName != null || themeName !== undefined) {
                themeName = themeName.replace('.css', '');
                var themeSplit = themeName.split('?');
                themeName = themeSplit[0];
            } else {
                themeName = 'theme1';
            }
            self.selectedTheme(themeName);
        };

        //#endregion
        //#region Life Cycle Event
        MySettingViewModel.prototype.beforeBind = function () {
            var self = this;
            self.setSelectedTheme();
        };

        MySettingViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };

        MySettingViewModel.prototype.activate = function () {
            return true;
        };

        MySettingViewModel.prototype.compositionComplete = function () {
        };
        return MySettingViewModel;
    })();

    return MySettingViewModel;
});
