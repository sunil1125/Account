/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../../../Scripts/TypeDefs/Simplex.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/toastr.d.ts" />
/// <reference path="../models/TypeDefs/Boards.d.ts" />
/// <reference path="../models/vendorBill/VendorBillId.ts" />
//#endregion
define(["require", "exports", 'durandal/system', 'durandal/app'], function(require, exports, __refSystem__, ___app__) {
    //#region Import
    var refSystem = __refSystem__;
    var _app = ___app__;

    //#endregion
    // Boards menu client commands
    var AdminClientCommands = (function () {
        function AdminClientCommands() {
        }
        //#region Public methods
        AdminClientCommands.prototype.getComparisonToleranceDetails = function (customerType, customerId, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            ajax.get("Accounting/GetComparisonToleranceDetailsByCustomer/?customerType=" + customerType + "&customerId=" + customerId).done(function (data) {
                successCallBack(data);
            }).fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('GetExceptionDetailsMetaSource', message);
            });
        };

        AdminClientCommands.prototype.saveComparisonToleranceDetails = function (comparisonToleranceContainer, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            ajax.post("Accounting/SaveComparisonToleranceDetails", comparisonToleranceContainer).done(function (data) {
                successCallBack(data);
            }).fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('SaveComparisonToleranceDetails', message);
            });
        };

        //#endregion
        //#region Private Methods
        // For Log the Error record
        AdminClientCommands.prototype.failureProxyCallback = function (context, error) {
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
        return AdminClientCommands;
    })();
    exports.AdminClientCommands = AdminClientCommands;
});
