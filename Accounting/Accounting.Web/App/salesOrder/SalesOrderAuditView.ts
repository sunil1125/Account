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
/// <reference path="../services/models/TypeDefs/VendorBillModels.d.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');

//#endregion
/*
** <summary>
** Sales Order Audit View Model.
** </summary>
** <createDetails>
** <id>US12721</id> <by>Sankesh</by> <date>16th Oct, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by> <date></date>
** </changeHistory>}
*/
export class SalesOrderAuditViewModel {
    //#region Members
    processLog: KnockoutObservable<string> = ko.observable('');

    //#endregion

    //#region Constructor
    constructor() {
        var self = this;
        // Handles the add command

        return self;
    }

    //#endregion

    //#region Internal public Methods

    //#region Internal public Methods
    public initializeAuditDetails(data:string) {
        var self = this;
        //self.isSelected(false);
        if (data) {
            self.processLog(data);
        }
    }

    //#endregion

    //#region Internal private methods

    //#endregion
}