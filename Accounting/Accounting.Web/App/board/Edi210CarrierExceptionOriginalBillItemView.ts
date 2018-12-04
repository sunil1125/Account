/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region REFERENCES
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../services/models/TypeDefs/Report.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion

//#region IMPORT
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refReportClient = require('services/client/ReportClient');
import refBoardReportRequestModel = require('services/models/report/BoardReportRequest');
import refEnums = require('services/models/common/Enums');
import refValidations = require('services/validations/Validations');
//#endregion

/*
** <summary>
** Report Finalized Order With No Vendor Bills View Model.
** </summary>
** <createDetails>
** <id>US13250</id> <by>Chandan</by> <date>11-27-2014</date>}
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by> <date></date>
** </changeHistory>
*/

export class Edi210CarrierExceptionOriginalBillItemViewModel {
	//#region MEMBERS
    ediOriginalItemsList: KnockoutObservableArray<ediOriginalItemsModel> = ko.observableArray([]);
    totalCost: KnockoutObservable<number> = ko.observable(0);
	//#endregion

	//#region CONSTRUCTOR
	constructor() {
		var self = this;

		return self;
		//#endregion
	}

	//#region Public Method
	public initilizeOriginalItems(items: Array<IVendorBillItem>) {
		var self = this;
		self.ediOriginalItemsList.removeAll();
		items.forEach(function (item) {
			self.ediOriginalItemsList.push(new ediOriginalItemsModel(item));
		});
        self.updateTotalCostAndWeight();
	}
	//#endregion Public Method

	//#region Private Method

    private updateTotalCostAndWeight() {
        var self = this;

        var totalCost: number = 0.0;

        self.ediOriginalItemsList().forEach(function (item) {
            if (item.cost()) {
                var costWithoutComma = item.cost().toString();
                var check = costWithoutComma.indexOf(",");
                if (check === -1) {
                    totalCost += parseFloat(item.cost().toString());
                } else {
                    //For removing comma before addition because parseFloat is not taking digit after comma at adding time
                    totalCost += parseFloat(costWithoutComma.replace(/,/g, ""));
                }
            }
        });

        self.totalCost($.number(totalCost, 2));
    }

	//#region Private Method

	//#region LIFE CYCLE EVENT
	// Indicate that view is attached and used whenever we are create tab interface for disable the processing and show close button
	public attached() {
		_app.trigger('viewAttached');
	}

	//The composition engine will execute it prior to calling the binder.
	public activate() {
		return true;
	}

	//To load the registered data if any existed.
	public beforeBind() {
		var self = this

		//_app.trigger("loadMyData", function (data) {
		//	if (data) {
		//		self.load(data);

		//	} else {
		//	}
		//});
	}
	//#endregion
}
export class ediOriginalItemsModel {
	//#region MEMBERS
	items: KnockoutObservable<string> = ko.observable('');
	description: KnockoutObservable<string> = ko.observable('');
	cost: KnockoutObservable<number> = ko.observable(0);
	selectedClass: KnockoutObservable<number> = ko.observable(0);
	weight: KnockoutObservable<number> = ko.observable(0);
	pcs: KnockoutObservable<number> = ko.observable(0);
	dimensionLength: KnockoutObservable<number> = ko.observable(0);
	dimensionWidth: KnockoutObservable<number> = ko.observable(0);
	dimensionHeight: KnockoutObservable<number> = ko.observable(0);
	differenceAmount: KnockoutObservable<number> = ko.observable(0);

	//#region CONSTRUCTOR
	constructor(item: IVendorBillItem) {
		var self = this;

		if (typeof (item) !== 'undefined') {
			self.items(item.ItemName);
			self.description(item.UserDescription);
			self.cost($.number((item.Cost), 2));
			self.selectedClass(item.SelectedClassType);
			self.weight(item.Weight);
			self.pcs(item.PieceCount);
			self.dimensionLength(item.DimensionLength);
			self.dimensionWidth(item.DimensionWidth);
			self.dimensionHeight(item.DimensionHeight);
		}

		return self;
		//#endregion
	}
	//#region Public Method

	//#endregion Public Method

	//#region Private Method

	//#endregion Private Method
}