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

//#region Import
import _app = require('durandal/app');
import _refvendorBillmainView = require('vendorBill/VendorEditDetailsView');

//#endregion

/*
** <summary>
** Vendor Bill Mail Edit details View Model.
** </summary>
** <createDetails>
** <id>US8214</id> <by>Satish</by> <date>27th May, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id>US9669</id> <by>Achal Rastogi</by> <date>6-3-2014</date>
** <id>DE21389</id> <by>Chandan Singh</by> <date>20-01-2016</date> <description>Term Types are shown randomly on Vendor Bills</description>
** </changeHistory>
*/

class VendorBillMainEditDetailsViewModel {
	//#endregion
	vendorBillmainView: _refvendorBillmainView.VendorBillEditDetailsViewModel = new _refvendorBillmainView.VendorBillEditDetailsViewModel();
	accordian: Function;
	tabbed: Function;
	vendorBIllid: KnockoutObservable<number> = ko.observable(0);
	//flag to make ACCORDION view as active or not?
	isAccordianAcitve: KnockoutComputed<boolean>;
	//flag to make TABBED view as active or not?
	isTabAcitve: KnockoutComputed<boolean>;
	// To show T-term or I-term
	termType: KnockoutObservable<string> = ko.observable('');
	isLoaded: boolean = false;
	public viewModeType: KnockoutObservable<number> = ko.observable(1).extend({ persist: 'viewModeType' });
	accordianClass: KnockoutObservable<string> = ko.observable('');
	tabbedClass: KnockoutObservable<string> = ko.observable('');

	vendorEditDetailsContainer = ko.observable({ view: 'vendorBill/VendorEditDetailsViewTabbed', model: this.vendorBillmainView });
	//#region Constructor
	constructor() {
		var self = this;

		// if user clicks on TABBED then we are setting viewMode type as 1.
		self.tabbed = () => {
			self.viewModeType(1);
			self.vendorBillmainView.overFlowManage();
			self.vendorBillmainView.collapseAllAccordions();
			self.vendorBillmainView.collapseAllTabAndOpenItem();
		}

		// if user clicks on ACCORDION then we are setting viewMode type as 0.
		self.accordian = () => {
			$('.carousel-inner').css("overflow", "hidden");
			self.viewModeType(0);
			self.vendorBillmainView.overFlowManage();
			//self.vendorBillmainView.compositionComplete();
			self.vendorBillmainView.collapseAllAccordions();
			self.vendorBillmainView.collapseAllTabAndOpenItem();
		}

		// Accordion view flag is computing.
		self.isAccordianAcitve = ko.computed(function () {
			if (self.viewModeType() === 0) {
				self.vendorEditDetailsContainer({ view: 'vendorBill/VendorEditDetailsView', model: self.vendorBillmainView })
				self.vendorBillmainView.isAccordion(true);
				return true;
			}
			else
				return false;
		});

		// tab view flag is computing.
		self.isTabAcitve = ko.computed(function () {
			if (self.viewModeType() === 1) {
				// set overflow:visible after loading completion of tab view
				setTimeout(function () {
					$('.carousel-inner').css("overflow", "visible");
				}, 700);
				self.vendorEditDetailsContainer({ view: 'vendorBill/VendorEditDetailsViewTabbed', model: self.vendorBillmainView })
				self.vendorBillmainView.isAccordion(false);
				return true;
			}
			else
				return false;
		});

		//#endregion
		return self;
	}
	//#endregion

	//#region Internal Methods
	// function to keep cursor focus on DOM first control.
	public setCursorFocus() {
		setTimeout(function () {
			$("input:text:visible:first").focus();
		}, 500);
	}

	//#endregion

	//#region Life Cycle Event}

	public compositionComplete(view, parent) {
		var self = this;
		self.load();
		//Using this logic to navigate to the details page in case of opening from other application (CC)
		//Passing vendorBillId because of coming back in Home if vendorBillId is not available
		//self.vendorBillmainView.loadViewAfterComposition(self.vendorBIllid());
		//self.vendorBillmainView.beforeBind(self.vendorBIllid());
	}

	//** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
	public attached() {
		_app.trigger('viewAttached');
	}

	//** The composition engine will execute it prior to calling the binder. */
	public activate(vendorBillId) {
		var self = this;
		if (vendorBillId !== undefined) {
			if (parseInt(vendorBillId)) {
				self.vendorBIllid(vendorBillId);
			}
		}
		return true;
	}

	//#region Load Data
	public load() {
		var self = this;

		self.vendorBillmainView.changeTermType = (processFlow) => {
			if (processFlow === 1) {
				self.termType(" - I");
			}
			else {
				self.termType(" - T");
			}
		};
	}

	//**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
	public beforeBind() {
		var self = this;
		// ###START: DE21389
		self.load();
		// ###END: DE21389
		//apply active for the inner div based on view type.
		//if (self.viewModeType() === 0) {
		//	self.vendorEditDetailsContainer({ view: 'vendorBill/VendorEditDetailsView', model: self.vendorBillmainView })
		//	self.accordianClass('item active');
		//	self.tabbedClass('item');
		//} else {
		//	self.vendorEditDetailsContainer({ view: 'vendorBill/VendorEditDetailsViewTabbed', model: self.vendorBillmainView })
		//	self.accordianClass('item');
		//	self.tabbedClass('item active');
		//}
        //self.viewModeType(1)
        //self.accordianClass('item');
        //self.tabbedClass('item active');

		//Using this logic to navigate to the details page in case of opening from other application (CC)
		if (self.vendorBIllid()) {
			var binddata = {
				// Flag to specify whether to go to DB or not?
				isSubBill: false,

				isException: false,

				//vendorbill data.
				vendorBillId: self.vendorBIllid()
			}
			_app.trigger("registerMyData", binddata);
			//self.vendorBillmainView.load(binddata);
		}

		if (!self.isLoaded) self.vendorBillmainView.beforeBind(self.vendorBIllid());
		self.isLoaded = true;
    }

    public deactivate() {
        var self = this;
        //ko.cleanNode($("#mainDiv")[0]);

        self.cleanup();

        ko.removeNode($("#mainDiv")[0]);
    }

    public cleanup() {
        var self = this;

        self.vendorBillmainView.cleanup();
		delete self.vendorBillmainView;

		try {
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

	//#endregion
}

return VendorBillMainEditDetailsViewModel;