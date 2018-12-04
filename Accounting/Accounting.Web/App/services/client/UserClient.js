/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created : Nov 04, 2014
** Created By Satish
*/
define(["require", "exports", 'durandal/system', 'durandal/app'], function(require, exports, __refSystem__, ___app__) {
    //#region References
    /// <reference path="../../../Scripts/TypeDefs/jquery.d.ts" />
    /// <reference path="../../../Scripts/TypeDefs/durandal.d.ts" />
    /// <reference path="../../../Scripts/TypeDefs/Simplex.d.ts" />
    /// <reference path="../../../Scripts/TypeDefs/toastr.d.ts" />
    /// <reference path="../../../Scripts/TypeDefs/utils.d.ts" />
    /// <reference path="../models/TypeDefs/Report.d.ts" />
    //#endregion
    //#region Import
    var refSystem = __refSystem__;
    var _app = ___app__;
    

    //#endregion Import
    var UserClient = (function () {
        function UserClient() {
        }
        //#region Public Methods
        UserClient.prototype.GetThemeName = function (successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/GetThemeName';
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                if (failureCallBack) {
                    failureCallBack(arg);
                }
            });
        };

        UserClient.prototype.SaveThemeName = function (themeName, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post('Accounting/SaveThemeName', themeName).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                if (failureCallBack) {
                    failureCallBack(arg);
                }
            });
        };

        UserClient.prototype.GetKoGridSetting = function (koGridDispSetting, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post('Accounting/GetAccountingUserGridSetting', koGridDispSetting).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                if (failureCallBack) {
                    failureCallBack(arg);
                }
                self.failureProxyCallback('GetKoGridSetting', arg);
            });
        };

        //#endregion Public Methods
        //#region Private Methods
        // For Log the Error record
        UserClient.prototype.failureProxyCallback = function (context, error) {
            if (error.responseText) {
                if (error.responseText.indexOf("HTTP_STATUS_CODE:401") != -1) {
                    refSystem.log(error.responseText, error, context + ' error callback');
                    return;
                }
            }

            try  {
                var errorDetails = JSON.parse(error.responseText);
                if (error) {
                    refSystem.log(errorDetails.Message, error, context + ' error callback');
                    return;
                } else {
                    refSystem.log(errorDetails.responseText, error, context + ' error callback');
                    return;
                }
            } catch (err) {
                var status = error.status;
                var statusText = error.statusText;
                refSystem.log((status ? error.status + ': ' : 'Error : ') + (statusText ? error.statusText : ''), error, context + ' failure/error callback');
                return;
            }
        };
        return UserClient;
    })();
    exports.UserClient = UserClient;
});
