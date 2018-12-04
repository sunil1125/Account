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
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app'], function(require, exports, ___router__, ___app__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    
    

    //#endregion
    /*
    ** <summary>
    ** Sales Order details View Model.
    ** </summary>
    ** <createDetails>
    ** <id>US12101</id> <by>Chandan</by> <date>27th Aug, 2014</date>
    ** </createDetails>}
    ** <changeHistory>}
    
    ** </changeHistory>
    */
    var SalesOrderViewModel = (function () {
        //#region Constructor
        function SalesOrderViewModel() {
        }
        //#endregion
        //#region Internal Methods
        //#endregion
        //#region Life Cycle Event
        SalesOrderViewModel.prototype.compositionComplete = function (view, parent) {
        };

        SalesOrderViewModel.prototype.activate = function () {
            return true;
        };

        //** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
        SalesOrderViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };
        return SalesOrderViewModel;
    })();
    return SalesOrderViewModel;
});
