/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

define(["require", "exports", 'plugins/router', 'durandal/app', 'board/BoardReQuote', 'board/RequoteProcessBoard'], function(require, exports, ___router__, ___app__, __refRequoteBoardViewModel__, __refRequoteProcessBoardViewModel__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    var refRequoteBoardViewModel = __refRequoteBoardViewModel__;
    var refRequoteProcessBoardViewModel = __refRequoteProcessBoardViewModel__;

    //#endregion
    var RequoteBoardContainerViewModel = (function () {
        function RequoteBoardContainerViewModel() {
            var self = this;
            self.requoteBoardViewModel = new refRequoteBoardViewModel.BoardReQuoteViewModel();
            self.requoteProcessViewModel = new refRequoteProcessBoardViewModel.RequoteProcessBoardViewModel();
            return self;
        }
        RequoteBoardContainerViewModel.prototype.onRequoteBoardClick = function () {
            var self = this;
            self.collapseAllTab();
            if (!$('#requoteBoardLink').hasClass('active in')) {
                $('#requoteBoard').addClass('active in');
                $('#requoteBoardLink').addClass('active in');
                self.requoteBoardViewModel.beforeBind();
            }
        };

        RequoteBoardContainerViewModel.prototype.onRequoteProcessClick = function () {
            var self = this;
            self.collapseAllTab();
            if (!$('#requoteProcessLink').hasClass('active in')) {
                $('#requoteProcess').addClass('active in');
                $('#requoteProcessLink').addClass('active in');
                self.requoteProcessViewModel.beforeBind();
            }
        };

        RequoteBoardContainerViewModel.prototype.collapseAllTab = function () {
            if ($('#requoteBoard').hasClass('in')) {
                $('#requoteBoard').removeClass('active in');
                $('#requoteBoardLink').removeClass('active');
            }
            if ($('#requoteProcess').hasClass('in')) {
                $('#requoteProcess').removeClass('active in');
                $('#requoteProcessLink').removeClass('active');
            }
        };

        //#region Life Cycle Events
        RequoteBoardContainerViewModel.prototype.beforeBind = function () {
            var self = this;
            self.requoteBoardViewModel.beforeBind();
        };

        RequoteBoardContainerViewModel.prototype.deactivate = function () {
            var self = this;

            self.cleanup();
        };

        RequoteBoardContainerViewModel.prototype.cleanup = function () {
            var self = this;

            this.requoteBoardViewModel.cleanup();
        };
        return RequoteBoardContainerViewModel;
    })();
    return RequoteBoardContainerViewModel;
});
