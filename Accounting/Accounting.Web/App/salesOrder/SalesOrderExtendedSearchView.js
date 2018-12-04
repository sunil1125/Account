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
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app'], function(require, exports, ___router__, ___app__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    

    //#endregion
    /*
    ** <summary>
    ** Sales Order Extended Search View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US8967</id> <by>Bhanu pratap</by> <date>Aug-262014</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var SalesOrderExtendedSearchViewModel = (function () {
        //#region Members
        //#endregion
        //#region Constructor
        function SalesOrderExtendedSearchViewModel() {
            var self = this;
        }
        //#endregion
        //#endregion
        //#region Life Cycle Event
        SalesOrderExtendedSearchViewModel.prototype.activate = function () {
            return true;
        };
        return SalesOrderExtendedSearchViewModel;
    })();
    exports.SalesOrderExtendedSearchViewModel = SalesOrderExtendedSearchViewModel;
});
