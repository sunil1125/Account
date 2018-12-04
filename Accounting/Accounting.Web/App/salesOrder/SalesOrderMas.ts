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
import refSalesOrderClient = require('services/client/SalesOrderClient');
import refEnums = require('services/models/common/Enums');
import refSalesOrderMasDetailsViewModel = require('salesOrder/SalesOrderMasDetails');
import refSalesOrderMasArDetailsViewModel = require('salesOrder/SalesOrderMasArDetails');
//#endregion
/*
** <summary>
**Sales Order MAS ViewModel.
** </summary>
** <createDetails>
** <id>US21133</id> <by>Baldev Singh Thakur</by> <date>31-03-2016</date>
** </createDetails>}
** <changeHistory>
** </changeHistory>
*/
export class SalesOrderMasViewModel {
	
	salesOrderMasDetailsViewModel: refSalesOrderMasDetailsViewModel.SalesOrderMasDetailsViewModel;
	salesOrderMasArDetailsViewModel: refSalesOrderMasArDetailsViewModel.SalesOrderMasArDetailsViewModel;
	
	salesOrderClient: refSalesOrderClient.SalesOrderClient = new refSalesOrderClient.SalesOrderClient();

	// Progress bar
	listProgress: KnockoutObservable<boolean> = ko.observable(false);

	salesOrderId: KnockoutObservable<number> = ko.observable(0);

	constructor() {
		var self = this;

		self.salesOrderMasDetailsViewModel = new refSalesOrderMasDetailsViewModel.SalesOrderMasDetailsViewModel();
		self.salesOrderMasArDetailsViewModel = new refSalesOrderMasArDetailsViewModel.SalesOrderMasArDetailsViewModel();

		return self;
	}

	// #Region Private Methods

	// Initialization of the grid.
	public initializeMasDetails(data: any, salesOrderId: number) {
		var self = this;

		self.salesOrderId(salesOrderId);

		
		if (data) {

			self.salesOrderMasDetailsViewModel.gridHeader('Accounts Payable MAS Data/Remit To:');
			self.salesOrderMasArDetailsViewModel.gridHeader('Accounts Receivable MAS Data To:');

			self.salesOrderMasDetailsViewModel.initializeMasDetails(data, salesOrderId);
			self.salesOrderMasArDetailsViewModel.initializeMasDetails(data, salesOrderId);
		}
		else {
			
		}
	}

	// #EndRegion
}