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
/// <reference path="../services/models/TypeDefs/Boards.d.ts" />
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
import refBoardsClient = require('services/client/BoardsClient');
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

export class Edi210CarrierExceptionItemViewModel {
	//#region MEMBERS
	boardClient: refBoardsClient.BoardsClientCommands = new refBoardsClient.BoardsClientCommands();
	ediItemsList: KnockoutObservableArray<ediItemsModel> = ko.observableArray([]);
	itemCodeANSICode: KnockoutObservableArray<IItemCodeDescriptionStandardMappings> = ko.observableArray([]);
	selecteditemCodeANSICode: KnockoutObservable<IItemCodeDescriptionStandardMappings> = ko.observable();
	itemCodeCarrierId: KnockoutObservableArray<IItemCodeDescriptionStandardMappings> = ko.observableArray([]);
	selecteditemCodesCarrierID: KnockoutObservable<IItemCodeDescriptionStandardMappings> = ko.observable();
	selectionChangedANSICode: any
	selectionChangedCarrierCode: any
	enableSaveButtonOnUnmapped: (isEnableSaveButtonByUnmapped: boolean) => any;
    private selectLineItem: ediItemsModel;
    mapLineItem: (lineItem: ediItemsModel) => void;
	//#endregion

	//#region CONSTRUCTOR
	constructor(enableSaveButtonOnUnmapped: (isEnableSaveButtonByUnmapped: boolean) => any) {
		var self = this;
		self.enableSaveButtonOnUnmapped = enableSaveButtonOnUnmapped;
		self.GetANSICodeORCarrierCode();

		return self;
		//#endregion
    }

	//#region Public Method
	public initilizeEDIItemDetails(items: Array<IEdi210ItemUnmappedCodeMapping>) {
		var self = this;
		self.selecteditemCodesCarrierID(null);
		self.selecteditemCodeANSICode(null);
        self.ediItemsList.removeAll();
        self.GetANSICodeORCarrierCode();

        items.forEach(function (item) {
			var ediItemModel = new ediItemsModel(item, (hasValue) => { self.enableSaveButtonOnUnmapped(hasValue) });
            ediItemModel.initializeEDIItem(item);
			self.ediItemsList.push(new ediItemsModel(item, (hasValue) => { self.enableSaveButtonOnUnmapped(hasValue)}));
		});
	}

	//
	public GetANSICodeORCarrierCode() {
		var self = this;
		self.boardClient.GetAllCodeDescriptionStandardMappings((dataCode) => {
			if (dataCode) {
				var self = this;
				self.itemCodeANSICode.removeAll();
				self.itemCodeANSICode.push.apply(self.itemCodeANSICode, dataCode);
			}
		}, () => { });
	}

	//
	public GetCarrierCode(carrierId: number) {
		var self = this;
		self.boardClient.GetCarrierItemCodeMappingBasedonCarrierID(carrierId,(dataCode) => {
			if (dataCode) {
				var self = this;
				self.itemCodeCarrierId.removeAll();
				self.itemCodeCarrierId.push.apply(self.itemCodeCarrierId, dataCode);
			}
		}, () => { });
	}
	//#endregion Public Method

	//#region Private Method

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

export class ediItemsModel {
	//#region MEMBERS
	ediItemsListMainModel: KnockoutObservableArray<Edi210CarrierExceptionItemViewModel> = ko.observableArray([]);
	items: KnockoutObservable<string> = ko.observable('');
	description: KnockoutObservable<string> = ko.observable('');
	cost: KnockoutObservable<number> = ko.observable(0);
	selectedClass: KnockoutObservable<string> = ko.observable('');
	weight: KnockoutObservable<number> = ko.observable(0);
	pcs: KnockoutObservable<string> = ko.observable('');
	dimensionLength: KnockoutObservable<string> = ko.observable('');
	dimensionWidth: KnockoutObservable<string> = ko.observable('');
	dimensionHeight: KnockoutObservable<string> = ko.observable('');
	differenceAmount: KnockoutObservable<number> = ko.observable(0);
	mappedCode: KnockoutObservable<string> = ko.observable('');
	selecteditemCodeANSICode: KnockoutObservable<IItemCodeDescriptionStandardMappings> = ko.observable();
    selecteditemCodesCarrierID: KnockoutObservable<IItemCodeDescriptionStandardMappings> = ko.observable();
	id: KnockoutObservable<number> = ko.observable(0);
	AnsiOrCarrierChangeCallBack: (haValue: boolean) => any;
	//#region CONSTRUCTOR
	constructor(item: IEdi210ItemUnmappedCodeMapping, AnsiOrCarrierChangeCallBack:(haValue:boolean)=>any) {
		var self = this;

		if (typeof (item) !== 'undefined') {
			self.items(item.Item);
			self.description(item.Description);
			self.cost($.number((item.Cost), 2));
			self.selectedClass(item.Class);
			self.weight(item.Weight);
			self.pcs(item.Pieces);
			self.dimensionLength(item.Length);
			self.dimensionWidth(item.Width);
            self.dimensionHeight(item.Height);
            self.id(item.ID);
			if (self.selecteditemCodesCarrierID() !== undefined) {
				if (self.selecteditemCodesCarrierID()) {
					self.mappedCode(self.selecteditemCodesCarrierID().Code);
				} else {
					self.mappedCode(self.selecteditemCodeANSICode().Code);
				}
			}
		}

		if (typeof (AnsiOrCarrierChangeCallBack) !== 'undefined') {
			self.AnsiOrCarrierChangeCallBack = AnsiOrCarrierChangeCallBack;
		}

		//Ansi Code subscribe will reset the Carrier Code Subscribe.
		self.selecteditemCodeANSICode.subscribe((newValue) => {
			if (typeof (newValue) != 'undefined' && newValue !== null && newValue.ItemId > 0) {
				self.mappedCode(newValue.Code);
				self.selecteditemCodesCarrierID(null);
				self.AnsiOrCarrierChangeCallBack(true);
			}
		});

		// Carrier Code Subscribe will reset the AnsiCode
		self.selecteditemCodesCarrierID.subscribe((newValue) => {
			if (typeof (newValue) != 'undefined' && newValue !== null && newValue.CarrierID > 0) {
				self.mappedCode(newValue.Code);
				self.selecteditemCodeANSICode(null);
				self.AnsiOrCarrierChangeCallBack(true);
			}
		});

		return self;
		//#endregion
	}
	//#region Public Method

    public initializeEDIItem(item: IEdi210ItemUnmappedCodeMapping) {
        var self = this;
        if (item != null) {
            self.items(item.Item);
            self.description(item.Description);
            self.cost($.number((item.Cost),2));
            self.selectedClass(item.Class);
            self.weight(item.Weight);
            self.pcs(item.Pieces);
            self.dimensionLength(item.Length);
            self.dimensionWidth(item.Width);
            self.dimensionHeight(item.Height);
            self.mappedCode(item.MappedCode);
            self.id(item.ID);
        }
    }

	//#endregion Public Method

	//#region Private Method

	//#endregion Private Method
}