/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import _reportViewer = require('../templates/reportViewerControlV2');
import refRexnordCompaniesViewModel = require('purchaseOrder/rexnordMappedCompanies');
import refForeignBolCustomersViewModel = require('purchaseOrder/ForeginBolCustomerSettings');
import refpurchaseOrderClient = require('services/client/PurchaseOrderClient');
import refEnums = require('services/models/common/Enums');
//#endregion

/*
** <summary>
**Company Settings ViewModel.
** </summary>
** <createDetails>
** <id>US16253</id><by>Satish</by> <date>21st April, 2015</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by> <date></date>
** </changeHistory>
*/

class CompanyMappingSettingsViewModel{
	//#region Members
	rexnordCompaniesViewModel: refRexnordCompaniesViewModel.RexnordMappedCompaniesViewModel;
	foreginBolCustomerSettingsViewModel: refForeignBolCustomersViewModel.ForeignBolCustomerSettingsViewModel;
	purchaseOrderClient: refpurchaseOrderClient.PurchaseOrderClient = new refpurchaseOrderClient.PurchaseOrderClient();
    //#endregion

	//#region Constructor
	constructor() {
		var self = this;
		self.rexnordCompaniesViewModel = new refRexnordCompaniesViewModel.RexnordMappedCompaniesViewModel();
		self.foreginBolCustomerSettingsViewModel = new refForeignBolCustomersViewModel.ForeignBolCustomerSettingsViewModel();

		return self;
	}
	//#endregion

	//#region Public Methods
	public onRexnordCompaniesClick() {
		var self = this;
		// To avoid tabs goes blank on quick move between tabs
		if (!$('#rexnordLink').hasClass('active in')) {
			self.collapseAllTab();
			$('#rexnord').addClass('active in');
			$('#rexnordLink').addClass('active in');
			self.rexnordCompaniesViewModel.getRexnordCompaniesList();
		}
	}

	public onForeignBolClick() {
		var self = this;
		self.collapseAllTab();
		$('#foreignBol').addClass('active in');
		$('#foreignBolLink').addClass('active in');
		self.beforeBind();
	}

	public collapseAllTab() {
		if ($('#foreignBol').hasClass('in')) {
			$('#foreignBol').removeClass('active in');
			$('#foreignBolLink').removeClass('active');
		}
		if ($('#rexnord').hasClass('in')) {
			$('#rexnord').removeClass('active in');
			$('#rexnordLink').removeClass('active');
		}
	}
    //#endregion

	//#region Life Cycle Events
	public beforeBind() {
		var self = this;
		if (LocalStorageController.Get("foreignBol")) {
			var data = LocalStorageController.Get("foreignBol");
			if (data.isForeignBol) {
				self.foreginBolCustomerSettingsViewModel.beforeBind();
			}
		}
	}

	public compositionComplete() {
	}

	public activate() {
		return true;
	}

	public deactivate() {
		var self = this;
		var localStorageKey = self.foreginBolCustomerSettingsViewModel.localStorageKey();
		//Screen2 Filter Data
		var saveData = { PageSize: self.foreginBolCustomerSettingsViewModel.foreignBolCustomerSettingsGridOptions.pagingOptions.pageSize(), Filters: self.foreginBolCustomerSettingsViewModel.searchAddressFilterItems };
		var saveData_Customers = { PageSize: self.foreginBolCustomerSettingsViewModel.foreignBolGridOptions.pagingOptions.pageSize(), Filters: self.foreginBolCustomerSettingsViewModel.searchFilterItems };

		var filterDataToSaveForAddress = { UserGridSetting: saveData, UserGridSetting1: saveData_Customers, GridViewId: refEnums.Enums.FilterViewName.ForeignBolAddress, IsFilterApplied: self.foreginBolCustomerSettingsViewModel.ForeignBolCustomerSettingsContainer.reportColumnFilter.isFilterApply, GridSearchText: self.foreginBolCustomerSettingsViewModel.searchText(), PageNo: self.foreginBolCustomerSettingsViewModel.foreignBolCustomerSettingsGridOptions.pagingOptions.currentPage(), PageSize: self.foreginBolCustomerSettingsViewModel.foreignBolCustomerSettingsGridOptions.pagingOptions.pageSize(), SortCol: self.foreginBolCustomerSettingsViewModel.sortCol(), SortOrder: self.foreginBolCustomerSettingsViewModel.sorttype(), FromLocalStorage: self.foreginBolCustomerSettingsViewModel.fromLocalStorage() };

		var filterDataToSave_Customers = { UserGridSetting: saveData, UserGridSetting1: saveData_Customers, GridViewId: refEnums.Enums.FilterViewName.ForeignBolCustomer, IsFilterApplied: self.foreginBolCustomerSettingsViewModel.ForeignBolCustomersContainer.reportColumnFilter.isFilterApply, GridSearchText: self.foreginBolCustomerSettingsViewModel.searchText(), PageNo: self.foreginBolCustomerSettingsViewModel.foreignBolGridOptions.pagingOptions.currentPage(), PageSize: self.foreginBolCustomerSettingsViewModel.foreignBolGridOptions.pagingOptions.pageSize(), SortCol: self.foreginBolCustomerSettingsViewModel.sortCol(), SortOrder: self.foreginBolCustomerSettingsViewModel.sorttype(), FromLocalStorage: self.foreginBolCustomerSettingsViewModel.fromLocalStorage() };

		var data = {
			filterDataToSave: filterDataToSaveForAddress,
			isForeignBol: $('#foreignBol').hasClass('active in'),
			isScreen1: $('.grid-foreignbol-customers').is(':visible'),
			customerAddressData: self.foreginBolCustomerSettingsViewModel.foreignBolCustomerAddresses(),
			customerId: self.foreginBolCustomerSettingsViewModel.selectedCustomerId(),
			customer: self.foreginBolCustomerSettingsViewModel.customerDisplay(),
			customerSettings: {
				EdiBolLength: self.foreginBolCustomerSettingsViewModel.bolCharacters(),
				IsEdiBolMapped: self.foreginBolCustomerSettingsViewModel.isEdiBolLengthMapped(),
				IsShipperConsigneeAddressMapped: self.foreginBolCustomerSettingsViewModel.obcOptionButtonsList.getOptionsById(1).selected(),
                IsBillToAddressMapped: self.foreginBolCustomerSettingsViewModel.obcOptionButtonsList.getOptionsById(2).selected(),
                IsBOLStartWithCharacter: self.foreginBolCustomerSettingsViewModel.obcOptionButtonsList.getOptionsById(4).selected(),
				IsEdiBolMapped: self.foreginBolCustomerSettingsViewModel.obcOptionButtonsList.getOptionsById(3).selected(),
				updatedDate: self.foreginBolCustomerSettingsViewModel.updatedDate()
			}
		};

		//Screen1 filter data
		if (!LocalStorageController.Get(localStorageKey+"_foreignBol")) {
			LocalStorageController.Set(localStorageKey + "_foreignBol", data);
		}
		else {
			LocalStorageController.Set(localStorageKey + "_foreignBol", undefined);
			LocalStorageController.Set(localStorageKey + "_foreignBol", data);
		}

		if (!LocalStorageController.Get(localStorageKey + "CompanyMapping")) {
			LocalStorageController.Set(localStorageKey + "CompanyMapping", filterDataToSave_Customers);
		} else {
			LocalStorageController.Set(localStorageKey + "CompanyMapping", undefined);
			LocalStorageController.Set(localStorageKey + "CompanyMapping", filterDataToSave_Customers);
		}
	}

    public cleanup() {
        var self = this;
        self.foreginBolCustomerSettingsViewModel.cleanup();
        for (var property in self) {
            if (property != "cleanup")
                delete self[property];
        }
        delete self;
    }

	public attached() {
		_app.trigger('viewAttached');
	}
	//#endregion
}
return CompanyMappingSettingsViewModel;