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
    ** Purchase Order Reviewed Note View Model.
    ** </summary>
    ** <createDetails>
    ** <by>Chandan Singh</by> <date>21/jan/2015</date>
    ** </createDetails>}
    ** <changeHistory>}
    ** <id></id> <by></by> <date></date>
    ** </changeHistory>
    */
    var PurchaseOrderReviewedNotesViewModel = (function () {
        // Initializes the properties of this class
        function PurchaseOrderReviewedNotesViewModel() {
            this.reviewedRemark = ko.observable('');
            //To check changes
            this.ischange = ko.observable(false);
            this.isNotAtLoadingTime = false;
            this.returnValue = ko.observable(false);
            var self = this;

            self.setTrackChange(self);

            self.getTrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            //self.isDirty = ko.computed(() => {
            //	var result = self.reviewedRemark();
            //	var result = (self.getTrackChange().length ? true : false);
            //	self.returnValue(result);
            //	if (self.onChangesMade) {
            //		self.onChangesMade(result);
            //	}
            //	return result;
            //});
            self.isDirty = ko.computed(function () {
                var result = self.reviewedRemark();

                var returnValue = self.getTrackChange().length > 0 ? true : false;
                self.returnValue(returnValue);
                if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
                    self.onChangesMade(returnValue);

                return returnValue;
            });

            return self;
        }
        //#region Public Methods
        //sets the tracking extension for BI required fields
        PurchaseOrderReviewedNotesViewModel.prototype.setTrackChange = function (self) {
            self.reviewedRemark.extend({ trackChange: true });
        };

        //#endregion Public Methods
        //## to enable button if any notes entered/copy pasted in text area
        //// To open Notes Section after editing in items.
        //public OpenNotes() {
        //	$("#collapseNotes").collapse('show');
        //	if ($("#collapseNotes").hasClass('in')) {
        //		$("#AchorcollapseNotes").removeClass('collapsed');
        //	}
        //	else {
        //		$("#AchorcollapseNotes").addClass('collapsed');
        //	}
        //}
        //#endregion
        //#region Private Methods
        //#endregion
        //#region LifeCycle
        PurchaseOrderReviewedNotesViewModel.prototype.compositionComplete = function () {
            var self = this;

            //$('.txtuserReviewedNote').focus();
            $("#txtuserREviewedNote").focus();
        };
        return PurchaseOrderReviewedNotesViewModel;
    })();
    exports.PurchaseOrderReviewedNotesViewModel = PurchaseOrderReviewedNotesViewModel;
});
