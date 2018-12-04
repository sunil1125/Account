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
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion
define(["require", "exports", 'plugins/router', 'durandal/app', 'services/models/common/Enums'], function(require, exports, ___router__, ___app__, __refEnums__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    var refEnums = __refEnums__;

    /** <summary>
    * * Export Control View Model
    * * < / summary >
    * * <createDetails>proNumber
    * * <id> < /id> <by>Achal</by > <date></date >
    * * < / createDetails >
    * * <changeHistory>
    * * < / changeHistory >
    */
    var SaveStatusIndicatorControl = (function () {
        //#region constructor
        function SaveStatusIndicatorControl() {
            this.saveStatus = ko.observable(1);
            this.statusText = ko.observable(refEnums.Enums.SavingStatus.NoChangesDetected.Value);
            var self = this;

            self.applySettings = function (args) {
                if (args)
                    switch (args) {
                        case refEnums.Enums.SavingStatus.ChangesDetected.ID:
                            self.statusText(refEnums.Enums.SavingStatus.ChangesDetected.Value);
                            self.saveStatus(refEnums.Enums.SavingStatus.ChangesDetected.ID);
                            break;
                        case refEnums.Enums.SavingStatus.ChangesSaved.ID:
                            self.statusText(refEnums.Enums.SavingStatus.ChangesSaved.Value);
                            self.saveStatus(refEnums.Enums.SavingStatus.ChangesSaved.ID);
                            break;
                        case refEnums.Enums.SavingStatus.NoChangesDetected.ID:
                            self.saveStatus(refEnums.Enums.SavingStatus.NoChangesDetected.ID);
                            self.statusText(refEnums.Enums.SavingStatus.NoChangesDetected.Value);
                            break;
                        case refEnums.Enums.SavingStatus.SavingChanges.ID:
                            self.saveStatus(refEnums.Enums.SavingStatus.SavingChanges.ID);
                            self.statusText(refEnums.Enums.SavingStatus.SavingChanges.Value);
                            break;
                        default:
                            self.statusText(refEnums.Enums.SavingStatus.NoChangesDetected.Value);
                            self.saveStatus(refEnums.Enums.SavingStatus.NoChangesDetected.ID);
                            break;
                    }
            };

            self.circleCSSClass = ko.computed(function () {
                switch (self.saveStatus()) {
                    case refEnums.Enums.SavingStatus.ChangesDetected.ID:
                        return "circleChangesDetected";
                    case refEnums.Enums.SavingStatus.ChangesSaved.ID:
                        return "circleChangesSaved";
                    case refEnums.Enums.SavingStatus.NoChangesDetected.ID:
                        return "circleNoChangesDetected";
                    case refEnums.Enums.SavingStatus.SavingChanges.ID:
                        return "circleSavingChanges";
                    default:
                        return "circleNoChangesDetected";
                }
            });

            self.textCSSClass = ko.computed(function () {
                switch (self.saveStatus()) {
                    case refEnums.Enums.SavingStatus.ChangesDetected.ID:
                        return "textChangesDetected";
                    case refEnums.Enums.SavingStatus.ChangesSaved.ID:
                        return "textChangesSaved";
                    case refEnums.Enums.SavingStatus.NoChangesDetected.ID:
                        return "textNoChangesDetected";
                    case refEnums.Enums.SavingStatus.SavingChanges.ID:
                        return "textSavingChanges";
                    default:
                        return "textNoChangesDetected";
                }
            });

            return self;
        }
        return SaveStatusIndicatorControl;
    })();
    exports.SaveStatusIndicatorControl = SaveStatusIndicatorControl;
});
