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
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app'], function(require, exports, ___router__, ___app__) {
    
    var _router = ___router__;
    var _app = ___app__;
    

    //#endregion
    /*
    ** <summary>
    ** Sales Order Upload success popup model
    ** </summary>
    ** <createDetails>
    ** <id>US19882</id> <by>Shreesha Adiga</by> <date>11-01-2016</date>
    ** </createDetails>
    */
    var SalesOrderUploadSuccessPopupViewModel = (function () {
        function SalesOrderUploadSuccessPopupViewModel() {
            //#region Member
            this.successMessage = ko.observable("");
            this.isClosed = ko.observable(false);
        }
        //#endregion Member
        //close
        SalesOrderUploadSuccessPopupViewModel.prototype.closePopup = function (dialogResult) {
            var self = this;
            self.isClosed(true);
            dialogResult.__dialog__.close(this, dialogResult);
            return true;
        };

        //#region Life Cycle Event
        SalesOrderUploadSuccessPopupViewModel.prototype.load = function () {
        };

        SalesOrderUploadSuccessPopupViewModel.prototype.compositionComplete = function (view, parent) {
        };

        // Activate the view and bind the selected data from the main view
        SalesOrderUploadSuccessPopupViewModel.prototype.activate = function (data) {
            var self = this;

            self.successMessage(data.bindingObject);
        };
        return SalesOrderUploadSuccessPopupViewModel;
    })();

    return SalesOrderUploadSuccessPopupViewModel;
});
