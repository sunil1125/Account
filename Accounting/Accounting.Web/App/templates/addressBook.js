/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region Refrences
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../../Scripts/TypeDefs/common.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
//#endregion
define(["require", "exports", 'durandal/app'], function(require, exports, ___app__) {
    

    //import _router = require('plugins/router');
    var _app = ___app__;
    

    //import refCommonClient = require('services/client/CommonClient');
    //import refMapLocation = require('services/models/common/MapLocation');
    //#endregion
    var AddressBook = (function () {
        //#region Constructor
        function AddressBook() {
        }
        //#endregion
        AddressBook.prototype.closeAddressBook = function () {
            this.CloseModal('CloseAddressBook');
        };

        /// common method to close the modal taking modalid as parameter
        AddressBook.prototype.CloseModal = function (modalId) {
            $('#' + modalId).appendTo('body');
            $('.modalBlockout').remove();
            $('.modalHost').remove();
            $('#' + modalId).modal('hide');
        };
        return AddressBook;
    })();

    return AddressBook;
});
