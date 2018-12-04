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
//#endregion

/*
** <summary>
** Vendor Bill Dispute Losts View Model.
** </summary>
** <createDetails>
** <id></id> <by>Chadnan</by> <date>06 Dec, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by> <date></date>
** </changeHistory>
*/
class SalesOrderMarginSplitPopupViewModel {
	//#region Member
	// For Validation purpose
	errorvalidaionDetail: KnockoutValidationGroup;

	repAbsorbingPerc: KnockoutObservable<string> = ko.observable('').extend({required: { message: "A valid Shipper Rep Absorbing percentage is required." }, trackChange:true });
	gtAbsorbingPerc: KnockoutObservable<number> = ko.observable(0);
	negativeMargin: KnockoutObservable<string> = ko.observable('');
	updatedBy: KnockoutObservable<string> = ko.observable('');
	shipmentId: KnockoutObservable<string> = ko.observable('');
	grossProfit: KnockoutObservable<number> = ko.observable(0);
	finalProfit: KnockoutObservable<number> = ko.observable(0);
	doRequote: KnockoutObservable<boolean> = ko.observable(true);
	IsSplitMarginAccespted: KnockoutObservable<boolean> = ko.observable(true);
	isClosed: KnockoutObservable<boolean> = ko.observable(false);
	// Utility class object
	CommonUtils: CommonStatic = new Utils.Common();
	percentageValidation: INumericInput;
	//#endregion Member

	//#region Constructor
	constructor() {
		var self = this;
		self.percentageValidation = { allowdecimal: ko.observable(true) };

		//validation
		self.errorvalidaionDetail = ko.validatedObservable({
			repAbsorbingPerc: this.repAbsorbingPerc
		});

		// subscribe to validate absorbing percentage
		self.repAbsorbingPerc.subscribe((newValue) => {
		if (self.CommonUtils.isNullOrEmptyOrWhiteSpaces(self.repAbsorbingPerc())) {
			var perc = 100;
			if (!isNaN(parseFloat(self.repAbsorbingPerc()))) {
				self.gtAbsorbingPerc(perc - parseFloat(self.repAbsorbingPerc()));
			}
		  }
		});

		return self;
	}

	//close popup
	public clickOnOk(dialogResult) {
		var self = this;
		if (self.errorvalidaionDetail.errors().length != 0){
			self.errorvalidaionDetail.errors.showAllMessages();
			return true;
		} else {
			//Save
			self.isClosed(false);
			return dialogResult.__dialog__.close(this, dialogResult);
		}
		return true;
	}

	public closePopup(dialogResult) {
		var self = this;
		self.isClosed(true);
		dialogResult.__dialog__.close(this, dialogResult);
		return true;
	}

	//#region Life Cycle Event
	public load() {
	}
	public compositionComplete(view, parent) {
		//$('#txtuserName').focus();
	}

	// Activate the view and bind the selected data from the main view
	public activate(refresh: IMessageBoxOption) {
		var self = this;

		if (refresh.bindingObject) {
			self.negativeMargin(refresh.bindingObject.costDifference.toString());
			self.updatedBy(refresh.bindingObject.CurrentUserId.toString());
			self.shipmentId(refresh.bindingObject.mainSalesOrderRowId.toString());
		}
	}

	//#endregion Life Cycle Event
}

return SalesOrderMarginSplitPopupViewModel;