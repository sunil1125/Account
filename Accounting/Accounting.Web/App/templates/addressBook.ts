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

/** File Created

*/

/** <summary>
* *Address Book View Model
* * < / summary >
* * <createDetails>proNumber
* * <ID>US8357</ID><BY>Chandan Singh Bajetha</BY><ON>19-Jun-2014</ON><DESC></DESC>
* * < / createDetails >
* * <changeHistory>
* * < / changeHistory >
*/
//#region Import
import _config = require('config');
//import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
//import refCommonClient = require('services/client/CommonClient');
//import refMapLocation = require('services/models/common/MapLocation');
//#endregion

class AddressBook {
    //#region Constructor
    constructor() {
    }
    //#endregion

    public closeAddressBook() {
        this.CloseModal('CloseAddressBook');
    }
    /// common method to close the modal taking modalid as parameter
    CloseModal(modalId) {
        $('#' + modalId).appendTo('body');
        $('.modalBlockout').remove();
        $('.modalHost').remove();
        $('#' + modalId).modal('hide');
    }
}

return AddressBook;