/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import _reportViewer = require('../templates/reportViewerControlV2');
import refRequoteBoardViewModel = require('board/BoardReQuote');
import refRequoteProcessBoardViewModel = require('board/RequoteProcessBoard');
//#endregion

class RequoteBoardContainerViewModel {
    requoteBoardViewModel: refRequoteBoardViewModel.BoardReQuoteViewModel;
    requoteProcessViewModel: refRequoteProcessBoardViewModel.RequoteProcessBoardViewModel;

    constructor() {
        var self = this;
        self.requoteBoardViewModel = new refRequoteBoardViewModel.BoardReQuoteViewModel();
        self.requoteProcessViewModel = new refRequoteProcessBoardViewModel.RequoteProcessBoardViewModel();
        return self;
    }

    public onRequoteBoardClick() {
        var self = this;
        self.collapseAllTab();
        if (!$('#requoteBoardLink').hasClass('active in')) {
            $('#requoteBoard').addClass('active in');
            $('#requoteBoardLink').addClass('active in');
            self.requoteBoardViewModel.beforeBind();
        }
    }

    public onRequoteProcessClick() {
        var self = this;
        self.collapseAllTab();
        if (!$('#requoteProcessLink').hasClass('active in')) {
            $('#requoteProcess').addClass('active in');
            $('#requoteProcessLink').addClass('active in');
            self.requoteProcessViewModel.beforeBind();
        }
    }

    public collapseAllTab() {
        if ($('#requoteBoard').hasClass('in')) {
            $('#requoteBoard').removeClass('active in');
            $('#requoteBoardLink').removeClass('active');
        }
        if ($('#requoteProcess').hasClass('in')) {
            $('#requoteProcess').removeClass('active in');
            $('#requoteProcessLink').removeClass('active');
        }
    }

    //#region Life Cycle Events
    public beforeBind() {
        var self = this;
        self.requoteBoardViewModel.beforeBind();
	}

	public deactivate() {
		var self = this;

		self.cleanup();
	}

	public cleanup() {
		var self = this;

		this.requoteBoardViewModel.cleanup();
	}
}
return RequoteBoardContainerViewModel;