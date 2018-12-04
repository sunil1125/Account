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
define(["require", "exports", 'plugins/router', 'durandal/app', 'purchaseOrder/rexnordMappedCompanies', 'purchaseOrder/ForeginBolCustomerSettings', 'services/client/PurchaseOrderClient', 'services/models/common/Enums'], function(require, exports, ___router__, ___app__, __refRexnordCompaniesViewModel__, __refForeignBolCustomersViewModel__, __refpurchaseOrderClient__, __refEnums__) {
    
    var _router = ___router__;
    var _app = ___app__;
    
    
    var refRexnordCompaniesViewModel = __refRexnordCompaniesViewModel__;
    var refForeignBolCustomersViewModel = __refForeignBolCustomersViewModel__;
    var refpurchaseOrderClient = __refpurchaseOrderClient__;
    var refEnums = __refEnums__;

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
    var CompanyMappingSettingsViewModel = (function () {
        //#endregion
        //#region Constructor
        function CompanyMappingSettingsViewModel() {
            this.purchaseOrderClient = new refpurchaseOrderClient.PurchaseOrderClient();
            var self = this;
            self.rexnordCompaniesViewModel = new refRexnordCompaniesViewModel.RexnordMappedCompaniesViewModel();
            self.foreginBolCustomerSettingsViewModel = new refForeignBolCustomersViewModel.ForeignBolCustomerSettingsViewModel();

            return self;
        }
        //#endregion
        //#region Public Methods
        CompanyMappingSettingsViewModel.prototype.onRexnordCompaniesClick = function () {
            var self = this;

            if (!$('#rexnordLink').hasClass('active in')) {
                self.collapseAllTab();
                $('#rexnord').addClass('active in');
                $('#rexnordLink').addClass('active in');
                self.rexnordCompaniesViewModel.getRexnordCompaniesList();
            }
        };

        CompanyMappingSettingsViewModel.prototype.onForeignBolClick = function () {
            var self = this;
            self.collapseAllTab();
            $('#foreignBol').addClass('active in');
            $('#foreignBolLink').addClass('active in');
            self.beforeBind();
        };

        CompanyMappingSettingsViewModel.prototype.collapseAllTab = function () {
            if ($('#foreignBol').hasClass('in')) {
                $('#foreignBol').removeClass('active in');
                $('#foreignBolLink').removeClass('active');
            }
            if ($('#rexnord').hasClass('in')) {
                $('#rexnord').removeClass('active in');
                $('#rexnordLink').removeClass('active');
            }
        };

        //#endregion
        //#region Life Cycle Events
        CompanyMappingSettingsViewModel.prototype.beforeBind = function () {
            var self = this;
            if (LocalStorageController.Get("foreignBol")) {
                var data = LocalStorageController.Get("foreignBol");
                if (data.isForeignBol) {
                    self.foreginBolCustomerSettingsViewModel.beforeBind();
                }
            }
        };

        CompanyMappingSettingsViewModel.prototype.compositionComplete = function () {
        };

        CompanyMappingSettingsViewModel.prototype.activate = function () {
            return true;
        };

        CompanyMappingSettingsViewModel.prototype.deactivate = function () {
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

            if (!LocalStorageController.Get(localStorageKey + "_foreignBol")) {
                LocalStorageController.Set(localStorageKey + "_foreignBol", data);
            } else {
                LocalStorageController.Set(localStorageKey + "_foreignBol", undefined);
                LocalStorageController.Set(localStorageKey + "_foreignBol", data);
            }

            if (!LocalStorageController.Get(localStorageKey + "CompanyMapping")) {
                LocalStorageController.Set(localStorageKey + "CompanyMapping", filterDataToSave_Customers);
            } else {
                LocalStorageController.Set(localStorageKey + "CompanyMapping", undefined);
                LocalStorageController.Set(localStorageKey + "CompanyMapping", filterDataToSave_Customers);
            }
        };

        CompanyMappingSettingsViewModel.prototype.cleanup = function () {
            var self = this;
            self.foreginBolCustomerSettingsViewModel.cleanup();
            for (var property in self) {
                if (property != "cleanup")
                    delete self[property];
            }
            delete self;
        };

        CompanyMappingSettingsViewModel.prototype.attached = function () {
            _app.trigger('viewAttached');
        };
        return CompanyMappingSettingsViewModel;
    })();
    return CompanyMappingSettingsViewModel;
});
