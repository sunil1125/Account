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
import _refPurchaseOrdermainView = require('purchaseOrder/PurchaseOrderEditDetails');

//#endregion

/*
** <summary>
** Purchase Order Main Details View Model.
** </summary>
** <createDetails>
** <id>US11724</id> <by>Satish</by> <date>14th Aug, 2014</date>
** </createDetails>
** <changeHistory>
** <id></id> <by></by> <date></date>
** </changeHistory>
*/

class PurchaseOrderMainDetailsViewModel {
	//#endregion
	purchaseOrdermainView: _refPurchaseOrdermainView.PurchaseOrderEditDetails = new _refPurchaseOrdermainView.PurchaseOrderEditDetails();
	accordian: Function;
	tabbed: Function;
	accordianClass: KnockoutObservable<string> = ko.observable('');
	tabbedClass: KnockoutObservable<string> = ko.observable('');

	//flag to make ACCORDION view as active or not?
	isAccordianAcitve: KnockoutComputed<boolean>;
	isLoaded: boolean = false;
	//flag to make TABBED view as active or not?
	isTabAcitve: KnockoutComputed<boolean>;
	public viewModeType: KnockoutObservable<number> = ko.observable(1).extend({ persist: 'viewModeType' });

	purchaseOrderEditDetailsContainer = ko.observable({ view: 'purchaseOrder/PurchaseOrderEditDetailsTabbed', model: this.purchaseOrdermainView });

	//#region Constructor
	constructor() {
		var self = this;

		// if user clicks on TABBED then we are setting viewMode type as 1.
		self.tabbed = () => {
			self.viewModeType(1);
			self.purchaseOrdermainView.overFlowManage();
			//self.purchaseOrdermainView.compositionComplete();
			self.purchaseOrdermainView.collapseAllAccordions();
			self.purchaseOrdermainView.collapseAllTabsAndOpenItem();
		}

		// if user clicks on ACCORDION then we are setting viewMode type as 0.
		self.accordian = () => {
			self.viewModeType(0);
			$('.carousel-inner').css("overflow", "hidden");
			self.purchaseOrdermainView.overFlowManage();
			//self.purchaseOrdermainView.compositionComplete();
			self.purchaseOrdermainView.collapseAllAccordions();
			self.purchaseOrdermainView.collapseAllTabsAndOpenItem();
		}

		// Accordion view flag is computing.
		self.isAccordianAcitve = ko.computed(function () {
			if (self.viewModeType() === 0) {
				self.purchaseOrderEditDetailsContainer({ view: 'purchaseOrder/PurchaseOrderEditDetails', model: self.purchaseOrdermainView })
				self.purchaseOrdermainView.isAccordion(true);
				return true;
			}
			else
				return false;
		});

		// tab view flag is computing.
		self.isTabAcitve = ko.computed(function () {
			if (self.viewModeType() === 1) {
				self.purchaseOrderEditDetailsContainer({ view: 'purchaseOrder/PurchaseOrderEditDetailsTabbed', model: self.purchaseOrdermainView })
				// set overflow:visible after loading completion of tab view
				setTimeout(function (){
					$('.carousel-inner').css("overflow", "visible");
				}, 700);
				self.purchaseOrdermainView.isAccordion(false);
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
	//#endregion}

	//#region Life Cycle Event}
	public compositionComplete(view, parent) {
		var self = this;
	}

	//** Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button. */
	public attached() {
		_app.trigger('viewAttached');
	}

	//** The composition engine will execute it prior to calling the binder. */
	public activate() {
		return true;
	}

	public deactivate() {
		var self = this;

		self.cleanup();
	}

	//#region Load Data
	public load(bindedData) {
		//** if bindedData is null then return false. */
		if (!bindedData)
			return;

		var self = this;

		self.purchaseOrdermainView.load(bindedData);
	}

	//**When the value of the activator is switched to a new value, before the switch occurs, we register the view data. */
	public beforeBind() {
		var self = this;

		if (!self.isLoaded) self.purchaseOrdermainView.beforeBind();
		self.isLoaded = true;

		//apply active for the inner div based on view type.
		//if (self.viewModeType() === 0) {
		//	self.accordianClass('item active');
		//	self.tabbedClass('item');
		//} else {
		//	self.accordianClass('item');
		//	self.tabbedClass('item active');
		//}

        //self.viewModeType(1)
        //self.accordianClass('item');
        //self.tabbedClass('item active');
	}

	public cleanup() {
		var self = this;

		self.purchaseOrdermainView.cleanup();

		self.viewModeType.extend({ validatable: false });

		for (var property in self) {
			delete self[property];
		}
	}

	//#endregion
}

return PurchaseOrderMainDetailsViewModel;