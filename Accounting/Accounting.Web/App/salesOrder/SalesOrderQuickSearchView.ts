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
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refCommon = require('services/client/CommonClient');
//#endregion

/*
** <summary>
** Sales Order Quick search View Model.
** </summary>
** <createDetails>
** <id>US8967</id> <by>Bhanu pratap</by> <date>Aug-262014</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by> <date></date>
** </changeHistory>
*/
export class SalesOrderQuickSearchViewModel {
	//#region Members

	// client command
	commonClient: refCommon.Common = new refCommon.Common();
	proNumber: KnockoutObservable<string> = ko.observable('');
	bolNumber: KnockoutObservable<string> = ko.observable('');
	poNumber: KnockoutObservable<string> = ko.observable('');
	shipperZip: KnockoutObservable<string> = ko.observable('');
	consigneeZip: KnockoutObservable<string> = ko.observable('');
	normalWidth: KnockoutObservable<string> = ko.observable('250px');
	errorWidth: KnockoutObservable<string> = ko.observable('233px');
	errorSalesOrderQuickSearch: KnockoutValidationGroup;
	//#endregion

	//#region Constructor
	constructor() {
		var self = this;

		// pro validation for minimum three characters
		self.proNumber.extend({
			minLength:
			{
				message: ApplicationMessages.Messages.MinimumCharactersRequired, params: 3
			}
		});

		// pro validation for minimum three characters
		self.bolNumber.extend({
			minLength:
			{
				message: ApplicationMessages.Messages.MinimumCharactersRequired, params: 3
			}
		});

		// po validation for minimum three characters
		self.poNumber.extend({
			minLength:
			{
				message: ApplicationMessages.Messages.MinimumCharactersRequired, params: 3
			}
		});

		// shipperZip validation for minimum three characters
		self.shipperZip.extend({
			minLength:
			{
				message: ApplicationMessages.Messages.MinimumCharactersRequired, params: 3
			}
		});

		// consigneeZip validation for minimum three characters
		self.consigneeZip.extend({
			minLength:
			{
				message: ApplicationMessages.Messages.MinimumCharactersRequired, params: 3
			}
		});

		self.errorSalesOrderQuickSearch = ko.validatedObservable({
			proNumber: self.proNumber,
			bolNumber: self.bolNumber,
			poNumber: self.poNumber,
			shipperZip: self.shipperZip,
			consigneeZip: self.consigneeZip
		});
	}
	//#endregion

	//#region Internal Methods
	public validateQuickSearch() {
		var self = this;
		var isInvalid = false;
		if (self.errorSalesOrderQuickSearch.errors().length != 0) {
			self.errorSalesOrderQuickSearch.errors.showAllMessages();
			return true;
		} else {
			return false;
		}
	}
	//#endregion

	//#region Life Cycle Event
	public activate() {
		return true;
	}
	//#endregion
}