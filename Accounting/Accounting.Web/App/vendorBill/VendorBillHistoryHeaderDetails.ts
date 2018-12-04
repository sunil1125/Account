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
import _reportViewer = require('../templates/reportViewerControlV2');
import refVendorBillHistoryViewModel = require('vendorBill/VendorBillHistory');
import refVendorBillClient = require('services/client/VendorBillClient');
import refVendorBillHistoryDetailsViewModel = require('vendorBill/VendorBillHistoryDetails');
//#endregion
/*
** <summary>
** Vendor Bill History Header ViewModel.
** </summary>
** <createDetails>
** <id>US8214</id> <by>Baldev Singh Thakur</by> <date>3rdd Mar, 2015</date>
** </createDetails>
** <changeHistory>
** <id>US20855</id> <by>Chandan Singh Bajetha</by> <date>29-02-2016</date> <description>Acct: Add spinner in History window</description> 
** </changeHistory>
*/
class VendorBillHistoryHeaderDetailsViewModel {
    //#region Members
    vendorBillHistoryViewModel: refVendorBillHistoryViewModel.VendorBillHistory;

    //Vendor Bill Client
    vendorBillClient: refVendorBillClient.VendorBillClient = new refVendorBillClient.VendorBillClient();

    vendorBillHistoryDetailsViewModel: refVendorBillHistoryDetailsViewModel.VendorBillHistoryDetails;

    public vendorBillId: number;

    // keep the header of vendor bill whether it's I term or T term
    vendorBillHeader: KnockoutObservable<string> = ko.observable('Vendor Bill History Details');
    //#endregion

    //#region Constructor
    constructor() {
        var self = this;

        self.vendorBillHistoryViewModel = new refVendorBillHistoryViewModel.VendorBillHistory();
        self.vendorBillHistoryDetailsViewModel = new refVendorBillHistoryDetailsViewModel.VendorBillHistoryDetails();

        return self;
    }
    //#endregion

    //#region Public Methods
    public onItemsClick() {
        var self = this;
		// To avoid tabs goes blank on quick move between tabs
		self.collapseAllTab();
		$('#item').addClass('active in');
		$('#itemLink').addClass('active in');
        //$('#history').addClass('active in');
        //$('#historyLink').addClass('active in');
		// ###START: US20855
		self.vendorBillHistoryDetailsViewModel.historyNewValueContainer.listProgress(true);
		self.vendorBillHistoryDetailsViewModel.historyOldValueContainer.listProgress(true);
		// ###END: US20855

        if (!$('#collapseHistory').hasClass('in')) {
            var successCallBack = function (data) {
                var commonUtils = new Utils.Common();
                // To load History Details
				self.vendorBillHistoryDetailsViewModel.initializeHistoryDetails(data);
				
				// ###START: US20855
				self.vendorBillHistoryDetailsViewModel.historyNewValueContainer.listProgress(false);
				self.vendorBillHistoryDetailsViewModel.historyOldValueContainer.listProgress(false);
				// ###END: US20855
            },
				faliureCallBack = function () {
					// ###START: US20855
					self.vendorBillHistoryDetailsViewModel.historyNewValueContainer.listProgress(false);
					self.vendorBillHistoryDetailsViewModel.historyOldValueContainer.listProgress(false);
					// ###END: US20855
                };
            self.vendorBillClient.GetVendorBillHistoryDetailsByVendorBillId(self.vendorBillId, successCallBack, faliureCallBack);
        }
    }

    public onDetailsClick() {
		var self = this;
		self.collapseAllTab();
		$('#details').addClass('active in');
		$('#detailsLink').addClass('active in');
        self.beforeBind();
	}

	public collapseAllTab() {
		if ($('#details').hasClass('in')) {
			$('#details').removeClass('active in');
			$('#detailsLink').removeClass('active');
		}
		if ($('#item').hasClass('in')) {
			$('#item').removeClass('active in');
			$('#itemLink').removeClass('active');
		}
	}
    //#endregion

    //#region Load Data
    public load(bindedData) {
        //** if bindedData is null then return false. */
        if (!bindedData)
            return;

        var self = this;

        //** if there is no data is registered then make a server call. */
        self.vendorBillId = bindedData.vendorBillId;
		//self.proNumber(bindedData.proNumber);
		// ###START: US20855
		self.vendorBillHistoryViewModel.listProgress(true);
		// ###END: US20855
        self.vendorBillHistoryViewModel.historyNewValueContainer.listProgress(true);
        var successCallBack = data => {
            // To load payment Details
            self.vendorBillHistoryViewModel.initializeHistoryDetails(data, data.VendorBillId, false);

            self.vendorBillHistoryViewModel.historyNewValueContainer.listProgress(false);
        },
            faliureCallBack = () => {
                self.vendorBillHistoryViewModel.historyNewValueContainer.listProgress(false);
            };

        self.vendorBillClient.GetVendorBillHistoryHeaderDetailsByVendorBillId(self.vendorBillId, successCallBack, faliureCallBack);
    }
    //#endregion

    //**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
    public beforeBind() {
        var self = this;
        _app.trigger("loadMyData", data => {
			if (data) {
				// ###START: US20855
				self.vendorBillHistoryViewModel.listProgress(true);
				// ###END: US20855
                self.load(data);
            } else {
                _app.trigger("closeActiveTab");
                _app.trigger("NavigateTo", 'Home');
            }
        });
    }

    public compositionComplete(view, parent) {
    }

    public activate() {
        return true;
	}

	public deactivate() {
		var self = this;

		self.cleanUp();
	}

    public attached() {
        _app.trigger('viewAttached');
	}

	public cleanUp() {
		var self = this;

		try {
			self.vendorBillHistoryViewModel.cleanUp();
			self.vendorBillHistoryDetailsViewModel.cleanUp();

			delete self.vendorBillHistoryViewModel;
			delete self.vendorBillHistoryDetailsViewModel;

			for (var prop in self) {
				if (typeof self[prop].dispose === "function") {
					self[prop].dispose();
				}
				delete self[prop];
			}

			delete self;
		}
		catch (exception) {
		}
	}
}

return VendorBillHistoryHeaderDetailsViewModel