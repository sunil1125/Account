/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../Scripts/TypeDefs/Simplex.d.ts" />
/// <reference path="../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../Scripts/TypeDefs/durandal.d.ts" />
define(["require", "exports", 'durandal/app'], function(require, exports, ___app__) {
    
    
    var _app = ___app__;
    
    

    //#endregion
    var commonUtils = (function () {
        function commonUtils() {
        }
        // Shows the message box as pr the given title and message
        commonUtils.prototype.showConfirmationMessage = function (message, title, fisrtButtoName, secondButtonName, yesCallBack, noCallBack) {
            var self = this;

            var varMsgBox = [
                {
                    id: 0,
                    name: fisrtButtoName,
                    callback: function () {
                        return yesCallBack();
                    }
                },
                {
                    id: 1,
                    name: secondButtonName,
                    callback: function () {
                        return noCallBack();
                    }
                }
            ];

            ////initialize message box control arguments
            var optionControlArgs = {
                options: varMsgBox,
                message: message,
                title: title
            };

            //Call the dialog Box functionality to open a Popup
            _app.showDialog('templates/messageBox', optionControlArgs, 'slideDown');
        };
        return commonUtils;
    })();
    exports.commonUtils = commonUtils;
});
