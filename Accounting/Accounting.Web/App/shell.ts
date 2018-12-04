/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="localStorage/LocalStorage.ts" />
/// <reference path="../Scripts/Utility.ts" />
/// <reference path="config.ts" />
/// <reference path="../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../Scripts/Constants/ApplicationMessages.ts" />
/// <reference path="services/models/TypeDefs/CommonModels.d.ts" />

import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refCommon = require('services/client/CommonClient');
import _refUserClient = require('services/client/UserClient');
import _refSalesOrderClient = require('services/client/SalesOrderClient');
import refEnums = require('services/models/common/Enums');

interface ITabContainer {
	tab: string;
	header: KnockoutObservable<string>;
	tabId: string;
	cssActive: KnockoutObservable<boolean>;
	moduleId: string;
	settings: DurandalRouteConfigurationSettings;
	showTabHeader: KnockoutObservable<boolean>;
	parent?: string;
	data?: any;
	pageLoader: KnockoutObservable<boolean>;
	headerDisplay: KnockoutComputed<string>;
	uniqueId?: KnockoutObservable<number>;
	uniqueKey?: KnockoutObservable<string>;
}

/*
** <summary>
** Shell class backbone of the Durandal routes for the application.
** </summary>
** <createDetails>
** <id></id> <by>ACHAL RASTOGI</by> <date>03-14-2014</date>
** </createDetails>
** <changeHistory>
** <id>US20352</id> <by>Chandan Singh Bajetha</by> <date>14-01-2016</date> <description>Acct: Adjust UI for Dispute Notes Tab in Vendor Bill</description>
** <id>DE23041</id> <by>Janakiram</by> <date>14-06-2016</date> <description>Removed CSS clase Multiple tabs hilighted</description>
** <id>US22956</id> <by>Shreesha Adiga</by> <date>23-06-2016</date> <description>Added subscription to fetch UVBOwnershipList</description>
** <id>US22997</id> <by>Janakiram</by> <date>07-07-2016</date> <description>Changed Configuration for Invoice View Pdf</description>
** <id>US24389</id> <by>Shreesha Adiga</by> <date>31-08-2016</date> <description>Added subscription for GetTruckloadAccessorials</description>
** <id>US25153</id> <by>Shreesha Adiga</by> <date>20-10-2016</date> <description>Added subscription for GetItemsNotIntegratedWithMas</description>
** <id>7266</id> <by>Shreesha Adiga</by><date>23-11-2018</date><description>Remove "IsRedirectedFromCC" cookie upon Logout</description>
** </changeHistory>
*/
class shell {
	//#region Members
	public router: DurandalRootRouter;
	app = _app;
	config = new _config.Config();
	userClient = new _refUserClient.UserClient();
	salesOrderClient = new _refSalesOrderClient.SalesOrderClient();
	public ChangeIconsBasedOnThemes: (string) => void;
	searchBtnClicked: KnockoutObservable<boolean> = ko.observable(false);
	beforeBind: () => void;
	setTabActive: (self: ITabContainer) => void;
	subscriptionOnShowOrHideProgressBar: DurandalEventSubscription;
	subscriptionOnShowOrHideAjaxLoader: DurandalEventSubscription;
	subscriptionToGetCurrentUserDetails: DurandalEventSubscription;
	subscriptionToOpenVendorBill: DurandalEventSubscription;
	subscriptionOnLoadMyData: DurandalEventSubscription;
	subscriptionOnRegisterMyData: DurandalEventSubscription;
	subscriptionOnIsBiDirtyChange: DurandalEventSubscription;
	/**
	* Event to indicate view attached{of durandal lifecycle event}.
	* Trigger this event in your view model inside {attached} method.
	*/
	subscriptionOnViewAttached: DurandalEventSubscription;
	subscriptionGetItemsTypes: DurandalEventSubscription;
	// ##START: US24389
	subscriptionGetTruckloadAccessorials: DurandalEventSubscription;
	// ##END: US24389
	subscriptionGetStatusList: DurandalEventSubscription;
	subscriptionOnCloseActiveTab: DurandalEventSubscription;
	subscriptionOnDuplicateTab: DurandalEventSubscription;
	subscriptionOpenEdi210Board: DurandalEventSubscription;
	subscriptionOpenPurchaseOrder: DurandalEventSubscription;
	subscriptionOpenHistoryDetails: DurandalEventSubscription;
	subscriptionOpenSalesOrder: DurandalEventSubscription;
	subscriptionOpenInvoice: DurandalEventSubscription;
	subscriptionOpenTransactionSearchResult: DurandalEventSubscription;
	subscriptionOpenRexnordBoard: DurandalEventSubscription;
	subscriptionOpenBoard: DurandalEventSubscription;
	subscriptionOpenRexnordBoardMapping: DurandalEventSubscription;
	subscriptionStatusListForTransactionSearch: DurandalEventSubscription;
	subscriptionGetClassTypesAndPackageTypes: DurandalEventSubscription;
	subscriptionOpenRebill: DurandalEventSubscription;
	subscriptionOpenSalesOrderHistoryDetails: DurandalEventSubscription;
	subscriptionOpenPrintBOL: DurandalEventSubscription;
	subscriptionOpenTransactionTab: DurandalEventSubscription;
	subscriptionOrderStatusListSOEntry: DurandalEventSubscription;
	subscriptionInvoiceStatusListSOEntry: DurandalEventSubscription;
	subscriptionShowGlobalSearch: DurandalEventSubscription;
	subscriptionSalesOrderServiceTypeList: DurandalEventSubscription;
	subscriptionShipViaList: DurandalEventSubscription;
	subscriptionStatusOfLoginDay: DurandalEventSubscription;
	// ###START: US20352
	subscriptionGetDisputeStatusList: DurandalEventSubscription;
	// ###END: US20352
	// ##START: US22956
	subscriptionGetUVBOwnershipList: DurandalEventSubscription;
	// ##END: US22956
	// ##START: US25153
	subscriptionGetItemsNotIntegratedWithMas: DurandalEventSubscription;
	// ##END: US25153

	/**
	* Event to navigation to new route by route/route name.
	* Trigger this event when you want to navigate to new route.
	*/
	subscriptionOnNavigation: DurandalEventSubscription;
	navigateOnMouseClick: (route: DurandalRouteConfiguration) => void;

	welcomeNote: KnockoutComputed<string>;
	MyAccountSubMenu: KnockoutObservableArray<any> = ko.observableArray([]);
	selectedMainMenu: KnockoutObservable<string> = ko.observable("Home");
	selectedSubMenuLink: KnockoutObservable<string> = ko.observable("");
	tabVisible: KnockoutObservable<boolean> = ko.observable(false);
	tabContainerList: KnockoutObservableArray<ITabContainer> = ko.observableArray([]);
	showProgress: KnockoutObservable<boolean> = ko.observable(false);
	blockFullUI: KnockoutObservable<boolean> = ko.observable(false);
	currentUser: KnockoutObservable<IUser> = ko.observable();
	getDefaultItemFromConfig: (itemId: number, title: string) => DurandalRouteConfiguration
	showContentProgress: KnockoutObservable<boolean> = ko.observable(false);
	logicalResources: Object = {};
	accountName: KnockoutComputed<string>;
	Logout: () => void;
	getSubMenuListByTitle: (title: string) => KnockoutObservableArray<DurandalRouteConfiguration>;
	shipmentItemTypes: KnockoutObservableArray<IShipmentItemType> = ko.observableArray([]);
	// ##START: US24389
	truckloadAccessorials: KnockoutObservableArray<IShipmentItemType> = ko.observableArray([]);
	// ##END: US24389
	billStatusList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	// ###START: US20352
	salesOrderStatusTypes: KnockoutObservableArray<IDisputeStatus> = ko.observableArray([]);
	// ###END: US20352

	// ##START: US22956
	uvbOwnershipList: KnockoutObservableArray<IUVBOwnership> = ko.observableArray([]);
	// ##END: US22956

	// ##START: US25153
	itemsNotIntegratedWithMas: KnockoutObservableArray<IShipmentItemType> = ko.observableArray([]);
	// ##END: US25153

	typeList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	invoiceStatusList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	modeList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	transactionSearchDropdownList: KnockoutObservableArray<ITransactionSearchStatusEnumHolder> = ko.observableArray([]);
	classTypesAndPackageTypes: KnockoutObservable<any> = ko.observable();
	OrderStatusListForSOEntry: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	InvoiceStatusListForSOEntry: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	SalesOrderServiceTypeList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	SalesOrderShipViaList: KnockoutObservableArray<IEnumValue> = ko.observableArray([]);
	isBIDirtyChanges: KnockoutObservable<boolean> = ko.observable(false);
	isWorkingDay: KnockoutObservable<boolean> = ko.observable(false);
	gettabListByName: (subMenuTitle: string, mainMenuTitle: string) => ITabContainer[] = null;
	changeTheme: (themeDetails: any) => void;
	getThemeName: () => string;
	selectedThemeName: KnockoutObservable<string>;
	isGlobalSearch: KnockoutObservable<boolean> = ko.observable(false);
	isDenimBackground: KnockoutObservable<boolean> = ko.observable(false);
	// Set the route of vendor bill details form
	ROUTE_VENDORBILL_DETAILS: string;

	// Common container to contains all data object with key value pair
	CommonContainer: IKeyValueContainer[];

	// Set the route of purchase order details form
	ROUTE_PURCHASEORDER_DETAILS: string;

	// Set the route of purchase order details form
	ROUTE_HISTORY_DETAILS: string;

	// Set the Route of Sales Order
	ROUTE_SALES_ORDER: string;

	// Set the Route of INVOICE
	ROUTE_INVOICE: string;

	// Set the Route of Rexnord Board
	ROUTE_REXNORD_BOARD: string;

	// Set the Route of Rexnord Board Mapping
	ROUTE_REXNORD_BOARD_MAPPING: string;

	// Set the Route of PO Board
	ROUTE_PURCHASE_ORDER_BOARD: string;

	//sales order Entry
	SALES_ORDER_ENTRY: string;

	//Rebill
	ROUTE_REBILL: string;

	//Print BOL
	ROUTE_PRINTBOL: string;

	// Set the route of Sales order history details form
	ROUTE_SALES_ORDER_HISTORY_DETAILS: string;

	// Set the route of  transaction search details form
	ROUTE_TRANSACTION_SEARCH: string;

	// Set the route of EDI 210 board
	ROUTE_EDI210_BOARD: string;

	// Global Transaction Search option
	globalSearchOptions: CategorizeTypeaheadOptions = {
		minLength: 3,
		displaykey: "Display",
		isCategorizedResult: true,
		items: 20,
		throttle: true,
		templates: [
			{ name: 'Vendor Bill', header: '<span class="padding-global-search-VB">Vendor Bill</span>', slicecount: 3, moreresult: '<a href="#">All Vendor Bill Results<span class="greatericon">&nbsp;&rsaquo;&rsaquo;</span></a>' },
			{ name: 'Sales Order', header: '<span class="padding-global-search-SO">Sales Order</span>', slicecount: 3, moreresult: '<a href="#">All Sales Order Results<span class="greatericon">&nbsp;&rsaquo;&rsaquo;</span></a>' },
			{ name: 'EDI', header: '<span class="padding-global-search-EDI">EDI</span>', slicecount: 3, moreresult: '<a href="#">All EDI Results<span class="greatericon">&nbsp;&rsaquo;&rsaquo;</span></a>' }],
		filteredDisplayKey: 'FilterDisplay'
	};

	// Set the route for search result
	ROUTE_SearchResult: string;

	public unSavedChanges: () => any;
	public unSavedChangesNewtab: () => any;
	public unSavedChangesClosetab: () => any;
	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	private Changestab: ITabContainer;
	private name: string;
	private caption: string;
	private moduleId: string;
	private settings: any;
	private hash: string;
	private checkMsgDisplay: boolean = true;
	public unSavedChangesNoClick: () => any;

	//#endregion

	constructor() {
		var self = this;
		self.router = _router;
		self.ROUTE_VENDORBILL_DETAILS = "VendorBillDetails";
		self.ROUTE_PURCHASEORDER_DETAILS = "PurchaseOrderDetails";
		self.ROUTE_HISTORY_DETAILS = "HistoryDetails";
		self.ROUTE_SALES_ORDER = "SalesOrderDetails";
		// ###START: US22997
		self.ROUTE_INVOICE = "PrintInvoice";
		// ###END: US22997
		self.ROUTE_SearchResult = "SearchResult";
		self.ROUTE_REXNORD_BOARD = "RexnordBoard";
		self.ROUTE_REXNORD_BOARD_MAPPING = "RexnordBoardMapping";
		self.ROUTE_PURCHASE_ORDER_BOARD = "PurchaseOrderBoard";
		self.SALES_ORDER_ENTRY = "salesOrderEntry";
		self.ROUTE_REBILL = "Rebill";
		self.ROUTE_SALES_ORDER_HISTORY_DETAILS = "SalesOrderHistoryHeaderDetails";
		self.ROUTE_PRINTBOL = 'PrintBol';
		self.ROUTE_TRANSACTION_SEARCH = "TransactionSearch";
		self.ROUTE_EDI210_BOARD = 'Edi210CarrierException';
		self.selectedThemeName = ko.observable('');
		self.beforeBind = () => {
			//added to prevent dropdown shadow when pages gets reloaded.
			/*jQuery('#Shipments').attr("data-toggle", "");*/
			jQuery('#Home').attr("data-toggle", "");
			jQuery('#Admin').attr("data-toggle", "");
			jQuery('#Reports').attr("data-toggle", "");

			if (self.router.activeRouteInstruction()) {
				var currentActiveRoute: DurandalRouteConfiguration = self.router.activeRouteInstruction().config;

				if (currentActiveRoute) {
					var isVendorBillMenu: boolean = currentActiveRoute.settings != null && (currentActiveRoute.settings.VendorBill || currentActiveRoute.title === self.ROUTE_VENDORBILL_DETAILS),
						isPurchaseOrderMenu: boolean = currentActiveRoute.settings != null && (currentActiveRoute.settings.PurchaseOrder || currentActiveRoute.title === self.ROUTE_PURCHASEORDER_DETAILS),
						isSalesOrderMenu: boolean = currentActiveRoute.settings != null && (currentActiveRoute.settings.SalesOrder || currentActiveRoute.title === self.ROUTE_SALES_ORDER),
						parentName: string = 'parent';

					ko.utils.arrayForEach(self.tabContainerList(), (tab: ITabContainer) => {
						tab.cssActive(false);
						if (tab.parent && parentName === tab.parent) {
							tab.showTabHeader(true);
						} else {
							tab.showTabHeader(false);
						}
					});

					var currentActiveItem: ITabContainer = self.activeItem();
					if (currentActiveItem) {
						currentActiveItem.cssActive(true);
						self.tabVisible(currentActiveItem.settings.allowTab);
					} else {
						var filterResult: DurandalRouteConfiguration = self.filterRoute(currentActiveRoute.route);
						if (filterResult) {
							var items: ITabContainer[] = self.getTabItems(currentActiveRoute.title);
							if (items.length === 0 || !isVendorBillMenu) {
								self.tabContainerList.removeAll();
								self.initialTab();
								self.tabContainerList.push({
									tab: filterResult.route,
									header: ko.observable(filterResult.title),
									tabId: filterResult.route + filterResult.settings.itemId,
									cssActive: ko.observable(true),
									moduleId: filterResult.moduleId,
									settings: filterResult.settings,
									showTabHeader: ko.observable(filterResult.settings.allowTab),
									parent: parentName,
									pageLoader: ko.observable(false),
									headerDisplay: ko.computed(() => {
										if (filterResult.title.length > 15) {
											return filterResult.title.substring(0, 13) + "..";
										}

										return filterResult.title;
									})
								});
								self.tabVisible(filterResult.settings.allowTab);
							}
						}
					}

					var activeRoute = self.router.activeItem();
					if (activeRoute) {
						if (activeRoute.beforeBind) {
							activeRoute.beforeBind(arguments[0], arguments[1], arguments[2]);
						}
					}
					var currentMainMenu: string = '';
					if (currentActiveRoute.settings.VendorBill || isVendorBillMenu) {
						currentMainMenu = 'Vendor Bill';
					} else if (currentActiveRoute.settings.PurchaseOrder || isPurchaseOrderMenu) {
						currentMainMenu = 'Unmatched Vendor Bill';
					} else if (currentActiveRoute.settings.Reports) {
						currentMainMenu = 'Reports';
					} else if (currentActiveRoute.settings.Carrier) {
						currentMainMenu = 'Carrier';
					} else if (currentActiveRoute.settings.Board) {
						currentMainMenu = 'Board';
					} else if (currentActiveRoute.settings.SalesOrder || isSalesOrderMenu) {
						currentMainMenu = 'Sales Order';
					}
					else if (currentActiveRoute.settings.Search) {
						currentMainMenu = 'Transaction Search';
					}
					else if (currentActiveRoute.settings.Admin) {
						currentMainMenu = 'Admin';
					}
					else {
						currentMainMenu = currentActiveRoute.route;
					}

					self.selectedMainMenu(currentMainMenu);

					if (currentActiveRoute.settings.isDenimBackground) {
						self.isDenimBackground(true);
					}
					else {
						self.isDenimBackground(false);
					}

					self.ChangeIconsBasedOnThemes(currentMainMenu);
				}
			}

			return true;
		};

		self.getThemeName = function () {
			var regex = /theme/;
			var themeFromLink = $("body> link").attr("href");
			var themeName = themeFromLink.substring(themeFromLink.lastIndexOf('/') + 1);
			return themeName;
		};

		//#region Subscribing to an app-wide message.
		self.subscriptionOnShowOrHideProgressBar = this.app.on('ShowOrHideProgressBar').then((showProgress: boolean, blockFullUI?: boolean) => {
			self.showProgress(showProgress);
			if (refSystem.isBoolean(blockFullUI)) {
				self.blockFullUI(blockFullUI);
			}
		});

		self.subscriptionOnShowOrHideAjaxLoader = this.app.on('ShowOrHideAjaxLoader').then((showProgress: boolean, blockFullUI?: boolean, ElementId?: string) => {
			//if (showProgress && refSystem.isBoolean(blockFullUI) && blockFullUI) {
			//	AjaxLoader.AjaxLoader.prototype.ajaxLoader(ElementId, blockFullUI);
			//	return
			//}
			//else if (showProgress) {
			//	AjaxLoader.AjaxLoader.prototype.ajaxLoader(ElementId);
			//}
			//else if (!showProgress) {
			//	AjaxLoader.AjaxLoader.prototype.remove(ElementId);
			//}
		});

		self.subscriptionToGetCurrentUserDetails = this.app.on('GetCurrentUserDetails').then((callback) => {
			callback(self.currentUser());
		});

		self.subscriptionGetItemsTypes = this.app.on('GetItemsTypes').then((callback) => {
			callback(self.shipmentItemTypes());
		});

		// ##START: US24389
		self.subscriptionGetTruckloadAccessorials = this.app.on('GetTruckloadAccessorials').then((callback) => {
			callback(self.truckloadAccessorials());
		});
		// ##END: US24389

		self.subscriptionGetStatusList = this.app.on('GetStatusList').then((callback) => {
			callback(self.billStatusList());
		});

		// ###START: US20352
		self.subscriptionGetDisputeStatusList = this.app.on('GetDisputeStatusList').then((callback) => {
			callback(self.salesOrderStatusTypes());
		});
		// ###END: US20352

		// ##START: US22956
		self.subscriptionGetUVBOwnershipList = this.app.on('GetUVBOwnershipList').then((callback) => {
			callback(self.uvbOwnershipList());
		});
		// ##END: US22956

		self.subscriptionStatusListForTransactionSearch = this.app.on('GetStatusListForTransactionSearch').then((callback) => {
			callback(self.transactionSearchDropdownList());
		});

		self.subscriptionGetClassTypesAndPackageTypes = this.app.on('GetClassTypesAndPackageTypes').then((callback) => {
			callback(self.classTypesAndPackageTypes());
		});

		self.subscriptionOrderStatusListSOEntry = this.app.on('GetOrderStatusListForSOEntry').then((callback) => {
			callback(self.OrderStatusListForSOEntry());
		});
		self.subscriptionInvoiceStatusListSOEntry = this.app.on('GetInvoiceStatusListForSOEntry').then((callback) => {
			callback(self.InvoiceStatusListForSOEntry());
		});

		self.subscriptionSalesOrderServiceTypeList = this.app.on('GetSalesOrderServiceTypeList').then((callback) => {
			callback(self.SalesOrderServiceTypeList());
		});

		self.subscriptionShipViaList = this.app.on('GetSalesOrderShipViaList').then((callback) => {
			callback(self.SalesOrderShipViaList());
		});

		// ##START: US25153
		self.subscriptionGetItemsNotIntegratedWithMas = this.app.on('GetItemsNotIntegratedWithMas').then((callback) => {
			callback(self.itemsNotIntegratedWithMas());
		});
		// ##END: US25153

		self.subscriptionOnCloseActiveTab = this.app.on('closeActiveTab').then(() => {
			var currentActiveItem: ITabContainer = self.activeItem();
			if (currentActiveItem) {
				var currentActiveTab: ITabContainer = self.getTabFirstItem(true, 'cssActive'),
					currentTab: ITabContainer = self.getTabFirstItem(currentActiveItem.tabId, 'tabId');

				self.tabContainerList.remove((tab: ITabContainer) => {
					return tab === currentTab && tab.tab !== "Home";
				});

				//#region Deleting the current/active route(s)
				/* Deleting the current/active tab route(s) which are created dynamically.*/
				var routesToBeRemoved: Array<DurandalRouteConfiguration> = new Array<DurandalRouteConfiguration>();
				if (currentTab.settings.VendorBill) {
					if (currentTab.tab === 'Entry') {
						//## if the tab id is '3' then entry tab should not be removed from the routes.
						if (currentTab.settings.itemId !== 3) {
							routesToBeRemoved = ko.utils.arrayFilter(self.router.routes, (item: DurandalRouteConfiguration) => {
								return item.settings === currentTab.settings;
							});
						}
					}
					else if (currentTab.tab === 'VendorBillEdit') {
						routesToBeRemoved = ko.utils.arrayFilter(self.router.routes, (item: DurandalRouteConfiguration) => {
							return (!currentTab.settings.defaultSettings) && item.settings.itemId === currentTab.settings.itemId;
						});
					}

					else if (currentTab.tab === 'Exception') {
						routesToBeRemoved = ko.utils.arrayFilter(self.router.routes, (item: DurandalRouteConfiguration) => {
							return (!currentTab.settings.defaultSettings) && item.settings.itemId === currentTab.settings.itemId;
						});
					}
				}
				else if (currentTab.tab === self.ROUTE_VENDORBILL_DETAILS) {
					routesToBeRemoved = ko.utils.arrayFilter(self.router.routes, (item: DurandalRouteConfiguration) => {
						return (!currentTab.settings.defaultSettings) && item.settings.itemId === currentTab.settings.itemId;
					});
				}
				else if (currentTab.settings.PurchaseOrder) {
					if (currentTab.tab === 'PurchaseOrderEdit') {
						routesToBeRemoved = ko.utils.arrayFilter(self.router.routes, (item: DurandalRouteConfiguration) => {
							return (!currentTab.settings.defaultSettings) && item.settings.itemId === currentTab.settings.itemId;
						});
					}
					else if (currentTab.tab === 'PurchaseOrderBoard') {
						routesToBeRemoved = ko.utils.arrayFilter(self.router.routes, (item: DurandalRouteConfiguration) => {
							return (!currentTab.settings.defaultSettings) && item.settings.itemId === currentTab.settings.itemId;
						});
					}
				}
				else if (currentTab.tab === self.ROUTE_PURCHASEORDER_DETAILS) {
					routesToBeRemoved = ko.utils.arrayFilter(self.router.routes, (item: DurandalRouteConfiguration) => {
						return (!currentTab.settings.defaultSettings) && item.settings.itemId === currentTab.settings.itemId;
					});
				}

				if (routesToBeRemoved.length) {
					self.router.routes.removeAll(routesToBeRemoved);
				}

				if (this.tabContainerList().length > 0) {
					var activeItems = $.grep(this.tabContainerList(), function (items) { return items.tab !== "Home" });

					if (activeItems.length === 0) {
						var tabNeedToBeActive: ITabContainer;
						var existingTabItems: ITabContainer[];
						existingTabItems = self.getTabItems('Home', 'tab');
						tabNeedToBeActive = existingTabItems[existingTabItems.length - 1];
						tabNeedToBeActive.cssActive(false);
						self.setTabActive(tabNeedToBeActive);
					}
				}
			}
		});

		self.subscriptionOnViewAttached = this.app.on('viewAttached').then(() => {
			/*Setting the page loader and blank UI to false*/
			var currentActiveItem: ITabContainer = self.activeItem();
			if (currentActiveItem) {
				currentActiveItem.pageLoader(false);
			}
			self.showContentProgress(false);
		});

		self.subscriptionToOpenVendorBill = this.app.on('openVendorBill').then((vendorBillId, proNumber, vendorBillOrderCallback: (isVendorBillOpened: boolean) => void, isSubBill: boolean = false, isException: boolean = false, isLostBill: boolean = false) => {
			var vendorBillAlreadyOpened: boolean = false;

			for (var i = 0; i < self.tabContainerList().length; i++) {
				if (self.tabContainerList()[i].header() === "VB #" + proNumber && (self.tabContainerList()[i].uniqueId() !== undefined && self.tabContainerList()[i].uniqueId() === vendorBillId)) {
					vendorBillAlreadyOpened = true;
					self.setTabActive(self.tabContainerList()[i]);
					break;
				}
			}

			self.tabContainerList().forEach(tabItem => {
				if (tabItem.header() === proNumber && (tabItem.uniqueId() !== undefined && tabItem.uniqueId() === vendorBillId)) {
					vendorBillAlreadyOpened = true;
				}
			});

			if (!vendorBillAlreadyOpened) {
				var currentActiveRoute: DurandalRouteConfiguration = self.router.activeRouteInstruction().config;
				if (currentActiveRoute) {
					var parentName: string = 'parent';
					if (self.getTabItems(parentName, 'parent').length < (Utils.Constants.DefaultTabCounts)) {
						self.showContentProgress(true);
						self.addDuplicateTab(self.ROUTE_VENDORBILL_DETAILS, parentName, vendorBillId, proNumber, isSubBill, isException, isLostBill);

						if (refSystem.isFunction(vendorBillOrderCallback)) {
							vendorBillOrderCallback(true);
						}
					}
					else {
						if (refSystem.isFunction(vendorBillOrderCallback)) {
							vendorBillOrderCallback(false);
						}

						if (self.checkMsgDisplay) {
							self.checkMsgDisplay = false;
							var toastrOptions = {
								toastrPositionClass: "toast-top-middle",
								delayInseconds: 15,
								fadeOut: 15,
								typeOfAlert: "",
								title: ""
							}

							Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.MaxTab, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
						}
					}
				}
			}
			else {
				return false;
			}

			return false;
		});

		self.subscriptionOnLoadMyData = this.app.on('loadMyData').then((callback, containerFlag, key) => {
			if (containerFlag) {
				var fetchedItem;
				var financialData: IKeyValueContainer = ko.utils.arrayFirst(self.CommonContainer, (item: IKeyValueContainer) => {
					fetchedItem = item;
					return item.key === key;
				});
				ko.utils.arrayRemoveItem(self.CommonContainer, fetchedItem);
				callback(financialData);
			}
			else {
				var currentActiveItem: ITabContainer = self.activeItem();
				if (currentActiveItem) {
					if (currentActiveItem.data) {
						callback(typeof currentActiveItem.data === 'function' ? currentActiveItem.data() : currentActiveItem.data);
					} else {
						callback(undefined);
					}
				}
			}
		});

		/**
		* Event to register the data of current active tab.
		* Trigger this event in your view model inside {deactivate} method / when and where you want to store the data to tab container.
		* registerMyData Call back function details
		* @param {any} data pass the data which you want to register.
		* @param {boolean} deleteAllAndAdd to decide to delete all existing item and add or add the data as new item for the current route. Default = false. pass true when you want to delete and add.
		* @param {boolean} containerFlag set true to update the existing data / add the new item in the container for a particular key. Default = false.
		* @param {string} containerKey key for the given data.
		*/
		self.subscriptionOnRegisterMyData = this.app.on('registerMyData').then((data, deleteAllAndAdd?: boolean, containerFlag?: boolean, containerKey?: string) => {
			if (containerFlag) {
				/// common container object which can hold any data along with key value. can be used wherever data transfer between pages is required
				var obj: IKeyValueContainer = { key: containerKey, value: data };

				var financialData: IKeyValueContainer = ko.utils.arrayFirst(self.CommonContainer, (item: IKeyValueContainer) => {
					return item.key === containerKey;
				});
				if (financialData) {
					financialData.value = data
				} else {
					self.CommonContainer.push(obj);
				}
			}
			else {
				var currentActiveItem: ITabContainer = self.activeItem();
				if (currentActiveItem) {
					if (currentActiveItem.data && !deleteAllAndAdd) {
						var dataKeys = null,
							myData = data;
						if (typeof currentActiveItem.data === 'function') {
							if (currentActiveItem.data()) {
								dataKeys = Object.keys(currentActiveItem.data());
							}
						}
						else if (typeof currentActiveItem.data === 'object') {
							dataKeys = Object.keys(currentActiveItem.data);
						}
						if (dataKeys) {
							for (var i = 0; i < dataKeys.length; i++) {
								var key = dataKeys[i];
								if (data[key]) {
									myData[key] = data[key];
								} else {
									var activeData = null;
									if (typeof currentActiveItem.data === 'function') {
										activeData = currentActiveItem.data();
									} else if (typeof currentActiveItem.data === 'object') {
										activeData = currentActiveItem.data;
									}
									myData[key] = activeData[key];
								}
							}
						}
						currentActiveItem.data = ko.observable(myData);
					} else {
						currentActiveItem.data = ko.observable(data);
					}
				}
			}
		});

		self.subscriptionOnIsBiDirtyChange = this.app.on('IsBIDirtyChange').then((data: boolean, deleteAllAndAdd?: boolean, containerFlag?: boolean, containerKey?: string) => {
			self.isBIDirtyChanges(data);
		});

		self.subscriptionStatusOfLoginDay = this.app.on('IsTodayHoliday').then((callback) => {
			callback(self.isWorkingDay());
		});

		/** Event to open duplicate tab
		*/
		self.subscriptionOnDuplicateTab = this.app.on('openDuplicateTab').then((name: string, parentName: string, vendorBillId?: number) => {
			self.addDuplicateTab(name, parentName, vendorBillId);
		});

		self.subscriptionOpenTransactionTab = this.app.on('openTransactionSearchTab').then(() => {
			var logicalResourcesArray: Array<ILogicalResourceAccessRule> = $.map(self.logicalResources, function (value, index) {
				return [value];
			});

			var isAR = $.grep(logicalResourcesArray, (item) => {
				return item.ResourceName === "Show Transaction Search As First Page";
			});
			if (isAR.length > 0) {
				var filterResult: DurandalRouteConfiguration = this.filterRoute(self.ROUTE_TRANSACTION_SEARCH);

				self.createNewTab(filterResult.route, filterResult.title, filterResult.moduleId, filterResult.settings, filterResult.hash);
			}
		});

		self.subscriptionShowGlobalSearch = this.app.on('showGlobalSearch').then(() => {
			var logicalResourcesArray: Array<ILogicalResourceAccessRule> = $.map(self.logicalResources, function (value, index) {
				return [value];
			});

			var isSearch = $.grep(logicalResourcesArray, (item) => {
				return item.ResourceName === "Access Global Search";
			});
			if (isSearch.length == 0) {
				self.isGlobalSearch(false);
			}
			else {
				self.isGlobalSearch(true);
			}
		});

		self.subscriptionOpenPurchaseOrder = this.app.on('openPurchaseOrder').then((vendorBillId, proNumber, purchaseOrderCallback: (isPurchaseOrderOpened: boolean) => void) => {
			var purchaseOrderAlreadyOpened: boolean = false;

			for (var i = 0; i < self.tabContainerList().length; i++) {
				//To remove PURGE From the header and Pro Number
				var header = self.tabContainerList()[i].header().replace(" PURGE", "");
				var prono = "UVB #" + proNumber;
				prono = prono.replace(" PURGE", "")

                if (header === prono && (self.tabContainerList()[i].uniqueId() !== undefined && self.tabContainerList()[i].uniqueId() === vendorBillId)) {
					purchaseOrderAlreadyOpened = true;
					self.setTabActive(self.tabContainerList()[i]);
					break;
				}
			}

			self.tabContainerList().forEach((tabItem) => {
				if (tabItem.header() === proNumber) {
					purchaseOrderAlreadyOpened = true;
				}
			});

			if (!purchaseOrderAlreadyOpened) {
				var currentActiveRoute: DurandalRouteConfiguration = self.router.activeRouteInstruction().config;
				if (currentActiveRoute) {
					var parentName: string = 'parent';
					if (self.getTabItems(parentName, 'parent').length < (Utils.Constants.DefaultTabCounts)) {
						self.showContentProgress(true);
						self.addDuplicateTab(self.ROUTE_PURCHASEORDER_DETAILS, parentName, vendorBillId, proNumber);

						if (refSystem.isFunction(purchaseOrderCallback)) {
							purchaseOrderCallback(true);
						}
					}
					else {
						if (refSystem.isFunction(purchaseOrderCallback)) {
							purchaseOrderCallback(false);
						}
						if (self.checkMsgDisplay) {
							self.checkMsgDisplay = false;
							var toastrOptions = {
								toastrPositionClass: "toast-top-middle",
								delayInseconds: 15,
								fadeOut: 15,
								typeOfAlert: "",
								title: ""
							}

							Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.MaxTab, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
						}
					}
				}
			}
			else {
				return false;
			}

			return false;
		});

		self.subscriptionOpenEdi210Board = this.app.on('openEdi210Board').then((exceptionType, ediDetailId, batchId, proNumber, edi210OrderCallback: (isEDI210Opend: boolean) => void) => {
			var edi210ItemAlreadyOpened: boolean = false;

			for (var i = 0; i < self.tabContainerList().length; i++) {
				//To remove PURGE From the header and Pro Number
				var header = self.tabContainerList()[i].header();
				var prono = "EDI210 #" + ediDetailId;
				//prono = prono.replace(" PURGE", "")

				if (header === prono) {
					edi210ItemAlreadyOpened = true;
					self.setTabActive(self.tabContainerList()[i]);
					break;
				}
			}

			self.tabContainerList().forEach((tabItem) => {
				if (tabItem.header() === ediDetailId) {
					edi210ItemAlreadyOpened = true;
				}
			});

			if (!edi210ItemAlreadyOpened) {
				var currentActiveRoute: DurandalRouteConfiguration = self.router.activeRouteInstruction().config;
				if (currentActiveRoute) {
					var parentName: string = 'parent';
					if (self.getTabItems(parentName, 'parent').length < (Utils.Constants.DefaultTabCounts)) {
						self.showContentProgress(true);
						self.addDuplicateTab(self.ROUTE_EDI210_BOARD, parentName, ediDetailId, proNumber);
						var filterResult: DurandalRouteConfiguration = this.filterRoute(self.ROUTE_EDI210_BOARD);
						var parentName: string = 'parent';

						var data = {
							//isLoaded: self.isLoaded(),
							ExceptionRuleId: exceptionType,
							EdiDetailId: ediDetailId,
							BatchId: batchId
						}

						LocalStorageController.Set('EDI210ExceptionDetailsFromSuperSearch', data);
						//self.createNewTab(filterResult.route, filterResult.title, filterResult.moduleId, filterResult.settings, filterResult.hash);
						//if (refSystem.isFunction(historyDetailsCallback)) {
						//	historyDetailsCallback(true);
						//}
						if (refSystem.isFunction(edi210OrderCallback)) {
							edi210OrderCallback(true);
						}
					}
					else {
						if (refSystem.isFunction(edi210OrderCallback)) {
							edi210OrderCallback(false);
						}
						if (self.checkMsgDisplay) {
							self.checkMsgDisplay = false;
							var toastrOptions = {
								toastrPositionClass: "toast-top-middle",
								delayInseconds: 15,
								fadeOut: 15,
								typeOfAlert: "",
								title: ""
							}

							Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.MaxTab, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
						}
					}
				}
			}
			else {
				return false;
			}

			return false;

			//var filterResult: DurandalRouteConfiguration = this.filterRoute(self.ROUTE_EDI210_BOARD);
			//var parentName: string = 'parent';

			//var data = {
			//	//isLoaded: self.isLoaded(),
			//	ExceptionRuleId: exceptionType,
			//	EdiDetailId: ediDetailId,
			//	BatchId: batchId
			//}

			//LocalStorageController.Set('EDI210ExceptionDetailsFromSuperSearch', data);

			////self.addDuplicateTab(self.ROUTE_EDI210_BOARD, parentName, exceptionType, ediDetailId);
			//self.createNewTab(filterResult.route, filterResult.title, filterResult.moduleId, filterResult.settings, filterResult.hash);
		});

		self.subscriptionOpenHistoryDetails = this.app.on('openHistoryDetails').then((vendorBillId, proNumber, historyDetailsCallback: (isHistoryDetailsOpened: boolean) => void) => {
			var isHistoryDetailsAlreadyOpened: boolean = false;

			for (var i = 0; i < self.tabContainerList().length; i++) {
				if (self.tabContainerList()[i].header() === "History #" + proNumber) {
					isHistoryDetailsAlreadyOpened = true;
					self.setTabActive(self.tabContainerList()[i]);
					break;
				}
			}

			self.tabContainerList().forEach((tabItem) => {
				if (tabItem.header() === proNumber) {
					isHistoryDetailsAlreadyOpened = true;
				}
			});

			if (!isHistoryDetailsAlreadyOpened) {
				var currentActiveRoute: DurandalRouteConfiguration = self.router.activeRouteInstruction().config;
				if (currentActiveRoute) {
					var parentName: string = 'parent';
					if (self.getTabItems(parentName, 'parent').length < (Utils.Constants.DefaultTabCounts)) {
						self.showContentProgress(true);
						self.addDuplicateTab(self.ROUTE_HISTORY_DETAILS, parentName, vendorBillId, proNumber);

						if (refSystem.isFunction(historyDetailsCallback)) {
							historyDetailsCallback(true);
						}
					}
					else {
						if (refSystem.isFunction(historyDetailsCallback)) {
							historyDetailsCallback(false);
						}
						if (self.checkMsgDisplay) {
							self.checkMsgDisplay = false;
							var toastrOptions = {
								toastrPositionClass: "toast-top-middle",
								delayInseconds: 15,
								fadeOut: 15,
								typeOfAlert: "",
								title: ""
							}

							Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.MaxTab, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
						}
					}
				}
			}
			else {
				return false;
			}

			return false;
		});

		// to open sales order
		self.subscriptionOpenSalesOrder = this.app.on('openSalesOrder').then((salesOrderId, bolNumber, salesOrderCallback: (isSalesOrderOpened: boolean) => void, isSubOrder: boolean = false) => {
			var isSalesOrderAlreadyOpened: boolean = false;

			for (var i = 0; i < self.tabContainerList().length; i++) {
				if (self.tabContainerList()[i].header() === "SO #" + bolNumber) {
					isSalesOrderAlreadyOpened = true;
					self.setTabActive(self.tabContainerList()[i]);
					break;
				}
			}

			self.tabContainerList().forEach((tabItem) => {
				if (tabItem.header() === bolNumber) {
					isSalesOrderAlreadyOpened = true;
				}
			});

			if (!isSalesOrderAlreadyOpened) {
				var currentActiveRoute: DurandalRouteConfiguration = self.router.activeRouteInstruction().config;
				if (currentActiveRoute) {
					var parentName: string = 'parent';
					if (self.getTabItems(parentName, 'parent').length < (Utils.Constants.DefaultTabCounts)) {
						self.showContentProgress(true);
						self.addDuplicateTab(self.ROUTE_SALES_ORDER, parentName, salesOrderId, bolNumber, isSubOrder);

						if (refSystem.isFunction(salesOrderCallback)) {
							salesOrderCallback(true);
						}
					}
					else {
						if (refSystem.isFunction(salesOrderCallback)) {
							salesOrderCallback(false);
						}
						if (self.checkMsgDisplay) {
							self.checkMsgDisplay = false;
							var toastrOptions: IToastrOptions = {
								toastrPositionClass: "toast-top-middle",
								delayInseconds: 15,
								fadeOut: 15,
								typeOfAlert: "",
								title: ""
							}

                            Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.MaxTab, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
						}
					}
				}
			}
			else {
				return false;
			}

			return false;
		});

		// to open Rebill Tab
		self.subscriptionOpenRebill = this.app.on('openRebill').then((salesOrderId, salesOrderCallback: (isRebillOpened: boolean) => void) => {
			var isRebillAlreadyOpened: boolean = false;

			for (var i = 0; i < self.tabContainerList().length; i++) {
				if (self.tabContainerList()[i].header() === "Rebill #" + salesOrderId) {
					isRebillAlreadyOpened = true;
					self.setTabActive(self.tabContainerList()[i]);
					break;
				}
			}

			self.tabContainerList().forEach((tabItem) => {
				if (tabItem.header() === salesOrderId) {
					isRebillAlreadyOpened = true;
				}
			});

			if (!isRebillAlreadyOpened) {
				var currentActiveRoute: DurandalRouteConfiguration = self.router.activeRouteInstruction().config;
				if (currentActiveRoute) {
					var parentName: string = 'parent';
					if (self.getTabItems(parentName, 'parent').length < (Utils.Constants.DefaultTabCounts)) {
						self.showContentProgress(true);
						self.addDuplicateTab(self.ROUTE_REBILL, parentName, salesOrderId);

						if (refSystem.isFunction(salesOrderCallback)) {
							salesOrderCallback(true);
						}
					}
					else {
						if (refSystem.isFunction(salesOrderCallback)) {
							salesOrderCallback(false);
						}
						if (self.checkMsgDisplay) {
							self.checkMsgDisplay = false;
							var toastrOptions: IToastrOptions = {
								toastrPositionClass: "toast-top-middle",
								delayInseconds: 15,
								fadeOut: 15,
								typeOfAlert: "",
								title: ""
							}

							Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.MaxTab, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
						}
					}
				}
			}
			else {
				return false;
			}

			return false;
		});

		// to open invoice
		self.subscriptionOpenInvoice = this.app.on('openInvoice').then((bolNumber, invoiceNumber, salesOrderCallback: (isInvoiceOpened: boolean) => void) => {
			var isInvoiceOpened: boolean = false;

			for (var i = 0; i < self.tabContainerList().length; i++) {
				if (self.tabContainerList()[i].header() === "IN #" + invoiceNumber) {
					isInvoiceOpened = true;
					self.setTabActive(self.tabContainerList()[i]);
					break;
				}
			}

			self.tabContainerList().forEach((tabItem) => {
				if (tabItem.header() === invoiceNumber) {
					isInvoiceOpened = true;
				}
			});

			if (!isInvoiceOpened) {
				var currentActiveRoute: DurandalRouteConfiguration = self.router.activeRouteInstruction().config;
				if (currentActiveRoute) {
					var parentName: string = 'parent';
					if (self.getTabItems(parentName, 'parent').length < (Utils.Constants.DefaultTabCounts)) {
						self.showContentProgress(true);
						self.addDuplicateTab(self.ROUTE_INVOICE, parentName, bolNumber, invoiceNumber);

						if (refSystem.isFunction(salesOrderCallback)) {
							salesOrderCallback(true);
						}
					}
					else {
						if (refSystem.isFunction(salesOrderCallback)) {
							salesOrderCallback(false);
						}
						if (self.checkMsgDisplay) {
							self.checkMsgDisplay = false;
							var toastrOptions = {
								toastrPositionClass: "toast-top-middle",
								delayInseconds: 15,
								fadeOut: 15,
								typeOfAlert: "",
								title: ""
							}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.MaxTab, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
						}
					}
				}
			}
			else {
				return false;
			}

			return false;
		});

		self.subscriptionOpenTransactionSearchResult = this.app.on('openTransactionSearchResult').then((searchValue, searchResultCallback: (isSearchResultOpened: boolean) => void) => {
			var isSearchResultOpened: boolean = false;

			if (searchValue.category == "MoreResult") {
				for (var i = 0; i < self.tabContainerList().length; i++) {
					if (self.tabContainerList()[i].header() === "Search Result") {
						isSearchResultOpened = true;
						//self.closeTab(self.tabContainerList()[i].tabId, "Search Result");
						self.tabContainerList()[i].data.query = searchValue.query;
						self.setTabActive(self.tabContainerList()[i]);
						break;
					}
				}

				self.tabContainerList().forEach((tabItem) => {
					if (tabItem.header() === "Search Result") {
						isSearchResultOpened = true;
						//self.closeTab(tabItem.tabId, "Search Result");
					}
				});
			}
			else {
				for (var i = 0; i < self.tabContainerList().length; i++) {
					if (self.tabContainerList()[i].header() === searchValue.category + " Result") {
						isSearchResultOpened = true;
						//self.closeTab(self.tabContainerList()[i].tabId, searchValue.category + " Result");
						self.tabContainerList()[i].data.query = searchValue.query;
						self.setTabActive(self.tabContainerList()[i]);
						break;
					}
				}

				self.tabContainerList().forEach((tabItem) => {
					if (tabItem.header() === searchValue.category + " Result") {
						isSearchResultOpened = true;
						//self.closeTab(tabItem.tabId, searchValue.category + " Result");
					}
				});
			}

			if (!isSearchResultOpened) {
				var currentActiveRoute: DurandalRouteConfiguration = self.router.activeRouteInstruction().config;
				if (currentActiveRoute) {
					var parentName: string = 'parent';
					if (self.getTabItems(parentName, 'parent').length < (Utils.Constants.DefaultTabCounts)) {
						self.showContentProgress(true);
						self.addDuplicateTab(self.ROUTE_SearchResult, parentName, searchValue);

						if (refSystem.isFunction(searchResultCallback)) {
							searchResultCallback(true);
						}
					}
					else {
						if (refSystem.isFunction(searchResultCallback)) {
							searchResultCallback(false);
						}
						if (self.checkMsgDisplay) {
							self.checkMsgDisplay = false;
							var toastrOptions = {
								toastrPositionClass: "toast-top-middle",
								delayInseconds: 15,
								fadeOut: 15,
								typeOfAlert: "",
								title: ""
							}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.MaxTab, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
						}
					}
				}
			}
			else {
				return false;
			}

			return false;
		});

		// to open Rexnord
		self.subscriptionOpenRexnordBoard = this.app.on('openRexnordBoard').then(() => {
			var filterResult: DurandalRouteConfiguration = this.filterRoute(self.ROUTE_REXNORD_BOARD);

			self.createNewTab(filterResult.route, filterResult.title, filterResult.moduleId, filterResult.settings, filterResult.hash);
		});

		// to open Rexnord Board Mapping
		self.subscriptionOpenRexnordBoard = this.app.on('openRexnordBoardMapping').then(() => {
			var filterResult: DurandalRouteConfiguration = this.filterRoute(self.ROUTE_REXNORD_BOARD_MAPPING);

			self.createNewTab(filterResult.route, "Mapped Companies", filterResult.moduleId, filterResult.settings, filterResult.hash);
		});

		// to open PO Board
		self.subscriptionOpenBoard = this.app.on('openPurchaseOrderBoard').then(() => {
			var filterResult: DurandalRouteConfiguration = this.filterRoute(self.ROUTE_PURCHASE_ORDER_BOARD);

			self.createNewTab(filterResult.route, filterResult.title, filterResult.moduleId, filterResult.settings, filterResult.hash);
		});

		self.subscriptionOnNavigation = this.app.on('NavigateTo').then((routeName: string) => {
			if (routeName) {
				var routeInConfig = self.filterRoute(routeName);
				if (routeInConfig) {
					self.createNewTab(routeInConfig.route, routeInConfig.title, routeInConfig.moduleId, routeInConfig.settings, routeInConfig.hash);
				}
				else {
					return false;
				}
			}
			else {
				return false;
			}
		});

		self.subscriptionOpenSalesOrderHistoryDetails = this.app.on('openSalesOrderHistoryDetails').then((salesOrderId, historyDetailsCallback: (isHistoryDetailsOpened: boolean) => void) => {
			var isHistoryDetailsAlreadyOpened: boolean = false;

			for (var i = 0; i < self.tabContainerList().length; i++) {
				if (self.tabContainerList()[i].header() === "History #" + salesOrderId) {
					isHistoryDetailsAlreadyOpened = true;
					self.setTabActive(self.tabContainerList()[i]);
					break;
				}
			}

			self.tabContainerList().forEach((tabItem) => {
				if (tabItem.header() === salesOrderId) {
					isHistoryDetailsAlreadyOpened = true;
				}
			});

			if (!isHistoryDetailsAlreadyOpened) {
				var currentActiveRoute: DurandalRouteConfiguration = self.router.activeRouteInstruction().config;
				if (currentActiveRoute) {
					var parentName: string = 'parent';
					if (self.getTabItems(parentName, 'parent').length < (Utils.Constants.DefaultTabCounts)) {
						self.showContentProgress(true);
						self.addDuplicateTab(self.ROUTE_SALES_ORDER_HISTORY_DETAILS, parentName, salesOrderId, salesOrderId.toString());

						if (refSystem.isFunction(historyDetailsCallback)) {
							historyDetailsCallback(true);
						}
					}
					else {
						if (refSystem.isFunction(historyDetailsCallback)) {
							historyDetailsCallback(false);
						}
						if (self.checkMsgDisplay) {
							self.checkMsgDisplay = false;
							var toastrOptions = {
								toastrPositionClass: "toast-top-middle",
								delayInseconds: 15,
								fadeOut: 15,
								typeOfAlert: "",
								title: ""
							}

							Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.MaxTab, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
						}
					}
				}
			}
			else {
				return false;
			}

			return false;
		});

		// to open invoice
		self.subscriptionOpenPrintBOL = this.app.on('openPrintBOL').then((bolNumber, customerBolNumber, salesOrderPrintBolCallback: (isPrintBolOpened: boolean) => void) => {
			var isPrintBolOpened: boolean = false;

			for (var i = 0; i < self.tabContainerList().length; i++) {
				if (self.tabContainerList()[i].header() === "BOL #" + bolNumber) {
					isPrintBolOpened = true;
					self.setTabActive(self.tabContainerList()[i]);
					break;
				}
			}

			self.tabContainerList().forEach((tabItem) => {
				if (tabItem.header() === bolNumber) {
					isPrintBolOpened = true;
				}
			});

			if (!isPrintBolOpened) {
				var currentActiveRoute: DurandalRouteConfiguration = self.router.activeRouteInstruction().config;
				if (currentActiveRoute) {
					var parentName: string = 'parent';
					if (self.getTabItems(parentName, 'parent').length < (Utils.Constants.DefaultTabCounts)) {
						self.showContentProgress(true);
						self.addDuplicateTab(self.ROUTE_PRINTBOL, parentName, bolNumber, customerBolNumber);

						if (refSystem.isFunction(salesOrderPrintBolCallback)) {
							salesOrderPrintBolCallback(true);
						}
					}
					else {
						if (refSystem.isFunction(salesOrderPrintBolCallback)) {
							salesOrderPrintBolCallback(false);
						}
						if (self.checkMsgDisplay) {
							self.checkMsgDisplay = false;
							var toastrOptions = {
								toastrPositionClass: "toast-top-middle",
								delayInseconds: 15,
								fadeOut: 15,
								typeOfAlert: "",
								title: ""
							}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.MaxTab, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
						}
					}
				}
			}
			else {
				return false;
			}

			return false;
		});

		//#endregion Subscribing to an app-wide message.
		self.getDefaultItemFromConfig = (itemId: number, title: string): DurandalRouteConfiguration  => {
			return ko.utils.arrayFirst(this.config.routes, (item: DurandalRouteConfiguration) => {
				return (item.settings.itemId === itemId && item.route === title);
			});
		};

		refCommon.Common.prototype.GetCurrentUser((data: IUser) => {
			self.currentUser(data);
		}, () => {
				console.log('Error in Ajax Call Method: GetCurrentUser()');
			});

		self.welcomeNote = ko.computed(() => {
			if (refSystem.isObject(self.currentUser())) {
				return self.currentUser().FullName;
			}
			return 'Welcome';
		});

		// Get all the item types
		refCommon.Common.prototype.GetListShipmentType((data) => {
			if (data) {
				self.shipmentItemTypes.removeAll();
				self.shipmentItemTypes.push.apply(self.shipmentItemTypes, data);
			}
		});

		// ##START: US24389
		// Get the truckload accessorials
		self.salesOrderClient.GetTruckloadAccessorials((data) => {
			if (data) {
				self.truckloadAccessorials.removeAll();
				self.truckloadAccessorials.push.apply(self.truckloadAccessorials, data);
			}
		});
		// ##END: US24389

		refCommon.Common.prototype.GetVendorBillStatusList((data) => {
			if (data) {
				self.billStatusList.removeAll();
				self.billStatusList.push.apply(self.billStatusList, data);
			}
		});

		// ###START: US20352
		refCommon.Common.prototype.GetListDisputeStatus((disputeData) => {
			if (disputeData) {
				self.salesOrderStatusTypes.removeAll();
				self.salesOrderStatusTypes.push.apply(self.salesOrderStatusTypes, disputeData);
			}
		});
		// ###END: US20352

		// ##START: US22956
		refCommon.Common.prototype.GetUVBOwnershipList((uvbOwnershipList) => {
			if (uvbOwnershipList) {
				self.uvbOwnershipList.removeAll();
				self.uvbOwnershipList.push.apply(self.uvbOwnershipList, uvbOwnershipList);
			}
		});
		// ##END: US22956

		refCommon.Common.prototype.GetEnums((data) => {
			if (data) {
				self.classTypesAndPackageTypes(data);
			}
		});

		refCommon.Common.prototype.IsHoliday((data) => {
			if (data) {
				self.isWorkingDay(data);
			}
		});

		refCommon.Common.prototype.getStatusListForTransactionSearch((data) => {
			if (data) {
				// bind transaction search type list
				self.transactionSearchDropdownList(data);
			}
		});

		self.salesOrderClient.getSalesOrderStatusForEntry((data) => {
			if (data) {
				self.OrderStatusListForSOEntry(data);
			}
		});

		self.salesOrderClient.getSalesOrderInvoiceStatusList((data) => {
			if (data) {
				self.InvoiceStatusListForSOEntry(data);
			}
		});

		self.salesOrderClient.getSalesOrderCarrierServiceTypeList((data) => {
			if (data) {
				self.SalesOrderServiceTypeList(data);
			}
		});

		self.salesOrderClient.getSalesOrderShipViaList((data) => {
			if (data) {
				self.SalesOrderShipViaList(data);
			}
		});

		// ##START: US25153
		self.salesOrderClient.GetItemsNotIntegratedWithMas((data) => {
			if (data) {
				self.itemsNotIntegratedWithMas(data);
			}
		});
		// ##END: US25153

		self.accountName = ko.computed(() => {
			return 'ACCOUNTING CENTER';
		});

		self.Logout = () => {
			self.deactivate();
			var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

			$.removeCookie("IsRedirectedFromCC", { path: '/' });
			ajax.get('logoff')
				.done((data: IUser) => {
					console.log(data);
					if (data) {
						var url = window.location.toString();
						if (url.indexOf('#') != -1) {
							url = url.substring(0, url.indexOf('#'));
						}
						window.location.replace(url);

						_app.trigger("ChatSignOut", () => {
							return true;
						}
							);
						return true;
					}
					return true;
				})
				.fail((arg) => {
					return false;
				});
		}

		self.getSubMenuListByTitle = (title: string) => {
			switch (title) {
				case 'Vendor Bill':
					return ko.observableArray(self.router.routes.filter((r: DurandalRouteConfiguration) => {
						return r.settings.VendorBill;
					}));
					break;
				case 'Unmatched Vendor Bill':
					return ko.observableArray(self.router.routes.filter((r: DurandalRouteConfiguration) => {
						return r.settings.PurchaseOrder;
					}));
					break;
				case 'Sales Order':
					return ko.observableArray(self.router.routes.filter((r: DurandalRouteConfiguration) => {
						return r.settings.SalesOrder;
					}));
					break;
				case 'Reports':
					return ko.observableArray(self.router.routes.filter((r: DurandalRouteConfiguration) => {
						return r.settings.Reports;
					}));
					break;
				case 'Carrier':
					return ko.observableArray(self.router.routes.filter((r: DurandalRouteConfiguration) => {
						return r.settings.Carrier;
					}));
					break;
				case 'Board':
					return ko.observableArray(self.router.routes.filter((r: DurandalRouteConfiguration) => {
						return r.settings.Board;
					}));
					break;
				case 'MyAccount':
					return ko.observableArray(self.router.routes.filter((r: DurandalRouteConfiguration) => {
						return r.settings.MyAccount;
					}));
					break;
				case 'Admin':
					return ko.observableArray(self.router.routes.filter((r: DurandalRouteConfiguration) => {
						return r.settings.Admin;
					}));
					break;
				default:
					return ko.observableArray(self.router.routes.filter((r: DurandalRouteConfiguration) => {
						return r.settings.dashboard;
					}));
					break;
			}
		}

		self.setTabActive = (newTab: ITabContainer) => {
			var url: string = null;
			self.Changestab = newTab;
			if (self.isBIDirtyChanges() === true && self.isBIDirtyChanges() !== undefined) {
				if (self.checkMsgDisplay) {
					self.checkMsgDisplay = false;
					var actionButtons: Array<IToastrActionButtonOptions> = [];
					actionButtons.push({
						actionButtonName: "Yes",
						actionClick: self.unSavedChanges
					});

					actionButtons.push({
						actionButtonName: "No",
						actionClick: self.unSavedChangesNoClick
					});

					var toastrOptions: IToastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 0,
						fadeOut: 0,
						typeOfAlert: "",
						title: "",
						actionButtons: actionButtons
					};

					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.ChangesMadeMessage, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				}
			}
			else {
				if (!newTab.cssActive()) {
					ko.utils.arrayForEach(self.tabContainerList(), (tab: ITabContainer) => {

						// ###START: DE23041
						tab.cssActive(true);
						// ###START: DE23041

						tab.cssActive(false);
					});
					newTab.cssActive(true);
					url = (newTab.settings.itemId === 3 || newTab.settings.itemId === 4 || newTab.settings.itemId === 5 || newTab.settings.itemId === 6
					|| newTab.settings.itemId === 8 || newTab.settings.itemId === 9 || newTab.settings.itemId === 10 || newTab.settings.itemId === 11 || newTab.settings.itemId === 12 || newTab.settings.itemId === 13
					|| newTab.settings.itemId === 14 || newTab.settings.itemId === 15 || newTab.settings.itemId === 16 || newTab.settings.itemId === 17
					|| newTab.settings.itemId === 18 || newTab.settings.itemId === 19 || newTab.settings.itemId === 20 || newTab.settings.itemId === 21 || newTab.settings.itemId === 23
					|| newTab.settings.itemId === 24 || newTab.settings.itemId === 26 || newTab.settings.itemId === 27 || newTab.settings.itemId === 28
					|| newTab.settings.itemId === 29 || newTab.settings.itemId === 30 || newTab.settings.itemId === 31 || newTab.settings.itemId === 32 || newTab.settings.itemId === 33
					|| newTab.settings.itemId === 34 || newTab.settings.itemId === 35 || newTab.settings.itemId === 36 || newTab.settings.itemId === 37 || newTab.settings.itemId === 38
					|| newTab.settings.itemId === 39 || newTab.settings.itemId === 40 || newTab.settings.itemId === 41 || newTab.settings.itemId === 42 || newTab.settings.itemId === 43 ||
					newTab.settings.itemId === 44 || newTab.settings.itemId === 45 || newTab.settings.itemId === 46 || newTab.settings.itemId === 47 || newTab.settings.itemId === 48 || newTab.settings.itemId === 49 ||
					newTab.settings.itemId === 50 || newTab.settings.itemId === 51 || newTab.settings.itemId === 52 || newTab.settings.itemId === 53 || newTab.settings.itemId === 25) ? newTab.tab : newTab.tabId;
					self.router.navigate('#/' + url);
				}
			}
		};

		self.gettabListByName = (subMenuTitle: string, mainMenuTitle: string) => {
			//if (mainMenuTitle === 'Vendor Bill' && subMenuTitle === 'Entry') {
			//	return self.getTabItems(subMenuTitle, 'tab');
			//}
			//else {
			return [];
			//}
		};

		self.navigateOnMouseClick = (routeConfig: DurandalRouteConfiguration) => {
			if (routeConfig.title === 'Home') {
				self.createNewTab(routeConfig.route, routeConfig.title, routeConfig.moduleId, routeConfig.settings, routeConfig.hash);
			}
		}

		// for Unsaved Changes
		self.unSavedChanges = () => {
			var url: string = null;
			self.checkMsgDisplay = true;
			if (!self.Changestab.cssActive()) {
				ko.utils.arrayForEach(self.tabContainerList(), (tab: ITabContainer) => {
					tab.cssActive(false);
				});
				self.Changestab.cssActive(true);
				url = (self.Changestab.settings.itemId === 3 || self.Changestab.settings.itemId === 4 || self.Changestab.settings.itemId === 5 || self.Changestab.settings.itemId === 6
				|| self.Changestab.settings.itemId === 8 || self.Changestab.settings.itemId === 9 || self.Changestab.settings.itemId === 10 || self.Changestab.settings.itemId === 11 || self.Changestab.settings.itemId === 12 || self.Changestab.settings.itemId === 13
				|| self.Changestab.settings.itemId === 14 || self.Changestab.settings.itemId === 15 || self.Changestab.settings.itemId === 16 || self.Changestab.settings.itemId === 17
				|| self.Changestab.settings.itemId === 18 || self.Changestab.settings.itemId === 19 || self.Changestab.settings.itemId === 20 || self.Changestab.settings.itemId === 21 || self.Changestab.settings.itemId === 23 || self.Changestab.settings.itemId === 24
				|| self.Changestab.settings.itemId === 26 || self.Changestab.settings.itemId === 27 || self.Changestab.settings.itemId === 28 || self.Changestab.settings.itemId === 29 || self.Changestab.settings.itemId === 30
				|| self.Changestab.settings.itemId === 31 || self.Changestab.settings.itemId === 32 || self.Changestab.settings.itemId === 33
				|| self.Changestab.settings.itemId === 34 || self.Changestab.settings.itemId === 35 || self.Changestab.settings.itemId === 36 || self.Changestab.settings.itemId === 37 || self.Changestab.settings.itemId === 38 || self.Changestab.settings.itemId === 39
				|| self.Changestab.settings.itemId === 40 || self.Changestab.settings.itemId === 41 || self.Changestab.settings.itemId === 42 || self.Changestab.settings.itemId === 43 || self.Changestab.settings.itemId === 44 || self.Changestab.settings.itemId === 45
				|| self.Changestab.settings.itemId === 45 || self.Changestab.settings.itemId === 46 || self.Changestab.settings.itemId === 47 || self.Changestab.settings.itemId === 48 || self.Changestab.settings.itemId === 49
				|| self.Changestab.settings.itemId === 50 || self.Changestab.settings.itemId === 51 || self.Changestab.settings.itemId === 52 || self.Changestab.settings.itemId === 53 || self.Changestab.settings.itemId === 25) ? self.Changestab.tab : self.Changestab.tabId;

				self.router.navigate('#/' + url);
			}
			self.isBIDirtyChanges(false);
			_app.trigger("IsBIDirtyChange", false);
		}

		// for click of NO while Navigation with Unsaved changes
		self.unSavedChangesNoClick = () => {
			var currentActiveTab: ITabContainer = self.getTabFirstItem(true, 'cssActive');
			ko.utils.arrayForEach(self.tabContainerList(), (tab: ITabContainer) => {
				if (tab.settings.itemId === self.Changestab.settings.itemId) {
					tab.cssActive(true);
					tab.cssActive(false);
				}
				if (tab.settings.itemId === currentActiveTab.settings.itemId) {
					tab.cssActive(false);
					tab.cssActive(true);
				}
			});
		}

		// for Unsaved Changes
		self.unSavedChangesNewtab = () => {
			self.checkMsgDisplay = true;
			if (self.getTabItems('parent', 'parent').length > (Utils.Constants.DefaultTabCounts - 1)) {
				if (self.checkMsgDisplay) {
					self.checkMsgDisplay = false;
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 15,
						fadeOut: 15,
						typeOfAlert: "",
						title: ""
					}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.MaxTab, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				}
				return;
			}

			self.showContentProgress(true);
			self.addTab(self.name, self.caption, self.moduleId, self.settings, self.hash);
			self.isBIDirtyChanges(false);
		}

		//To check if Msg is clicked
		self.checkMsgClick = () => {
			self.checkMsgDisplay = true;
		}

	// to Check if Msg is hidden or closed
		self.checkMsgHide = () => {
			self.checkMsgDisplay = true;
		}

		// for Unsaved Changes
		self.unSavedChangesClosetab = () => {
			var self = this,
				currentTab: ITabContainer,
				routesToBeRemoved: Array<DurandalRouteConfiguration> = new Array<DurandalRouteConfiguration>(),
				previousTab: ITabContainer,
				tabItem: ITabContainer[];
			self.checkMsgDisplay = true;

			if (self.tabContainerList().length > 1) {
				currentTab = self.getTabFirstItem(self.name, 'tabId');

				//#region Deleting the current/active route(s)
				/* Deleting the current/active tab route(s) which are created dynamically.*/

				if (typeof (currentTab.settings) !== 'undefined') {
					if (currentTab.settings.VendorBill) {
						if (currentTab.tab === 'Entry') {
							//## if the tab id is '3' then entry tab should not be removed from the routes.
							if (currentTab.settings.itemId !== 3) {
								routesToBeRemoved = ko.utils.arrayFilter(self.router.routes, (item: DurandalRouteConfiguration) => {
									return item.settings === currentTab.settings;
								});
							}
						}
						else {
							routesToBeRemoved = ko.utils.arrayFilter(self.router.routes, (item: DurandalRouteConfiguration) => {
								return (!currentTab.settings.defaultSettings) && item.settings.itemId === currentTab.settings.itemId;
							});
						}
					}
					else if (currentTab.settings.PurchaseOrder) {
						routesToBeRemoved = ko.utils.arrayFilter(self.router.routes, (item: DurandalRouteConfiguration) => {
							return (!currentTab.settings.defaultSettings) && item.settings.itemId === currentTab.settings.itemId;
						});
					}
					else {
						routesToBeRemoved = ko.utils.arrayFilter(self.router.routes, (item: DurandalRouteConfiguration) => {
							return (!currentTab.settings.defaultSettings) && item.settings.itemId === currentTab.settings.itemId;
						});
					}
				}

				if (routesToBeRemoved.length) {
					self.router.routes.removeAll(routesToBeRemoved);
				}
				//#endregion Deleting the current/active route(s)

				self.tabContainerList.remove((tab: ITabContainer) => {
					return tab === currentTab;
				});

				if (self.getTabItems('parent', 'parent').length === 0) {
					tabItem = self.getTabItems('Home', 'tab');
				}
				else {
					tabItem = self.getTabItems('parent', 'parent');
				}

				self.isBIDirtyChanges(false);

				if (tabItem && tabItem.length) {
					previousTab = tabItem[tabItem.length - 1];
					self.setTabActive(previousTab);

					// If we close the tab then we are clearing that particular key from Local Storage.
					if (typeof currentTab.uniqueId != 'undefined') {
						if (LocalStorageController.Get(currentTab.uniqueId() + 'PO')) {
							LocalStorageController.Set(currentTab.uniqueId() + 'PO', undefined);
						}

						if (LocalStorageController.Get(currentTab.uniqueKey() + 'SO')) {
							LocalStorageController.Set(currentTab.uniqueKey() + 'SO', undefined);
						}

						// Clear Financial Details
						if (LocalStorageController.Get(currentTab.uniqueKey() + 'SOFinancialDetails')) {
							LocalStorageController.Set(currentTab.uniqueKey() + 'SOFinancialDetails', undefined);
						}

						// Clear MAS Customer Details
						if (LocalStorageController.Get(currentTab.uniqueKey() + 'SOMASCustomerFields')) {
							LocalStorageController.Set(currentTab.uniqueKey() + 'SOMASCustomerFields', undefined);
						}

						if (LocalStorageController.Get(currentTab.uniqueId() + '_' + currentTab.uniqueKey() + 'VB')) {
							LocalStorageController.Set(currentTab.uniqueId() + '_' + currentTab.uniqueKey() + 'VB', undefined);
						}

						// To clear Vendor Bill Financial Details
						if (LocalStorageController.Get(currentTab.uniqueId() + '_' + currentTab.uniqueKey() + 'VBFinancialDetails')) {
							LocalStorageController.Set(currentTab.uniqueId() + '_' + currentTab.uniqueKey() + 'VBFinancialDetails', undefined);
						}

						////To Clear Edi Details
						//if (LocalStorageController.Get(currentTab.tabId + 'EDI210ExceptionDetails')) {
						//	LocalStorageController.Set(currentTab.tabId + 'EDI210ExceptionDetails', undefined);
						//}

						if (LocalStorageController.Get(currentTab.tabId)) {
							LocalStorageController.Set(currentTab.tabId, undefined);
						}
					}

					// If we close the tab then we are clearing that particular key from Local Storage.
					if (typeof currentTab.tabId != 'undefined') {
						if (LocalStorageController.Get(currentTab.tabId)) {
							LocalStorageController.Set(currentTab.tabId, undefined);
						}

						//To Clear Edi Details
						if (LocalStorageController.Get(currentTab.tabId + 'EDI210ExceptionDetails')) {
							LocalStorageController.Set(currentTab.tabId + 'EDI210ExceptionDetails', undefined);
						}

						//To Clear EDI 210 Details Result
						if (LocalStorageController.Get(currentTab.tabId + 'EDI210ExceptionBoardDetailsResult')) {
							LocalStorageController.Set(currentTab.tabId + 'EDI210ExceptionBoardDetailsResult', undefined);
						}

						//To Clear Foreign Bol
						if (LocalStorageController.Get(currentTab.tabId + '_foreignBol')) {
							LocalStorageController.Set(currentTab.tabId + '_foreignBol', undefined);
						}
					}
				}
			}
			return true;
		}

		self.changeTheme = function (themeDetails: any) {
			jQuery('#themeColorContainer > div').removeClass('selectedTheme');
			jQuery('#div' + themeDetails.themeName).addClass('selectedTheme');
			var regex = /theme/;
			var themeFromLink = $("body> link").attr("href");
			var themePath = themeFromLink.substring(0, themeFromLink.lastIndexOf('/') + 1);
			var newTheme = themePath + themeDetails.themeName + '.css';
			if (regex.test($("body> link").attr("href"))) {
				$("body> link").attr("href", newTheme);

				self.userClient.SaveThemeName(themeDetails.themeName, function (data: string) {
				},
					function () {
						//_app.showDialog('templates/messageBox', { title: "Alert", message: "Some error occurred while saving the theme. Please try again." }, 'slideDown');
					}
					);

				self.ChangeIconsBasedOnThemes(_router.activeRouteInstruction().config);
				if (_router.activeRouteInstruction().config.route !== "Home") {
					$('#homeImage').css('background-image', 'url(content/images/icons_home2.png)');
				}
			}
		}

		//#region Change Icons on themes
		//Changing the icons based on themes//
		self.ChangeIconsBasedOnThemes = function (currentMainMenu: string) {
			var regex = /theme/;
			var themeFromLink = $("body> link").attr("href");
			var themeName = themeFromLink.substring(themeFromLink.lastIndexOf('/') + 1);

			if (currentMainMenu === 'Search') {
				////self.cssSearch(false);
				self.searchBtnClicked(true);
			} else {
				////self.cssSearch(true);
				self.searchBtnClicked(false);
			}
		}
		//#endregion
	}

	//#region Internal Methods

	private getRandomItemId(): number {
		var itemId: number = Math.floor((Math.random() * 999) + 1);;
		var existsItem: DurandalRouteConfiguration[] = this.router.routes.filter((r: DurandalRouteConfiguration) => {
			return r.settings.itemId === itemId;
		});
		if (existsItem.length) {
			this.getRandomItemId();
		} else if (itemId === undefined) {
			this.getRandomItemId();
		} else {
			return itemId;
		}
	}

	//function to hide submenu after their click}
	hidesubmenu() {
		$('#mainMenu li div').removeClass('open');
	}

	onMyDashboardClick() {
		this.router.navigate("Expired", true);
	}

	onMyAccountClick() {
		this.router.navigate("MyAccount", true);
	}

	filterRoute(name: string): DurandalRouteConfiguration {
		return ko.utils.arrayFirst(this.router.routes, (item) => {
			return item.route === name;
		});
	}

	getTabItems(value: string, key?: string): ITabContainer[] {
		return ko.utils.arrayFilter(this.tabContainerList(), (item: ITabContainer) => {
			if (typeof item[key ? key : "header"] === 'function') {
				return Utils.removeNumberWithbrackets(item[key ? key : "header"]()) === Utils.removeNumberWithbrackets(value);
			}
			else {
				return Utils.removeNumberWithbrackets(item[key ? key : "header"]) === Utils.removeNumberWithbrackets(value);
			}
		});
	}

	// function of the get the first item in the array
	getTabFirstItem(value: any, key?: string): ITabContainer {
		return ko.utils.arrayFirst(this.tabContainerList(), (item: ITabContainer) => {
			if (typeof item[key ? key : "header"] === 'function') {
				return item[key ? key : "header"]() === value;
			}
			else {
				return item[key ? key : "header"] === value;
			}
		});
	}

	//function called on the click of the main-navigation
	showTabHeaderMain(route: string, title: string, moduleId: string, settings: any, hash: string) {
		var self = this;
		var currentActiveRoute: DurandalRouteConfiguration = self.router.activeRouteInstruction().config;
		if ((title == 'Vendor Bill' && currentActiveRoute.route != 'Vendor Bill') ? true
			: (title == 'Unmatched Vendor Bill' && currentActiveRoute.route != 'Unmatched Vendor Bill') ? true
			: (title == 'Admin' && currentActiveRoute.route != 'Admin') ? true
			: (title == 'Home' && currentActiveRoute.route != 'Home') ? true
			: (title == 'Reports' && currentActiveRoute.route != 'Reports') ? true : false) {
			this.selectedMainMenu(title);
			this.createNewTab(route, title, moduleId, settings, hash);
		}
		if (title === 'Vendor Bill') {
			var isVendorBillMenu: boolean = settings != null && (title === 'Vendor Bill');
			var parentName: string = (isVendorBillMenu ? 'VendorBill' : null);

			var prevtab = ko.utils.arrayFirst(this.tabContainerList(), (tab: ITabContainer) => {
				if (tab.parent === parentName && tab.showTabHeader()) {
					return true;
				}
			});
		}
	}

	// function is called for creation of new tab
	// name : route, caption: title, modeuleId: moduleId, settings: settings, hash: hash
	createNewTab(name: string, caption: string, moduleId: string, settings: any, hash: string) {
		var self = this;
		self.name = name;
		self.caption = caption;
		self.moduleId = moduleId;
		self.settings = settings;
		self.hash = hash;
		if (self.isBIDirtyChanges() === true && self.isBIDirtyChanges() !== undefined) {
			if (self.checkMsgDisplay) {
				self.checkMsgDisplay = false;
				var actionButtons: Array<IToastrActionButtonOptions> = [];
				actionButtons.push({
					actionButtonName: "Yes",
					actionClick: self.unSavedChangesNewtab
				});

				actionButtons.push({
					actionButtonName: "No",
					actionClick: self.checkMsgClick
				});

				var toastrOptions1: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 0,
					fadeOut: 0,
					typeOfAlert: "",
					title: "",
					actionButtons: actionButtons
				};
				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.ChangesMadeMessage, "warning", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
			}
		}
		else {
			if (self.getTabItems('parent', 'parent').length > (Utils.Constants.DefaultTabCounts - 1)) {
				if (self.checkMsgDisplay) {
					self.checkMsgDisplay = false;
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 15,
						fadeOut: 15,
						typeOfAlert: "",
						title: ""
					}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.MaxTab, "warning", self.checkMsgClick, toastrOptions, self.checkMsgHide);
				}

				return;
			}
			this.showContentProgress(true);
			this.addTab(name, caption, moduleId, settings, hash);
			return true;
		}
	}

	// function is adding new tabs or moving to previously opened tabs
	// name : route, caption: title, modeuleId: moduleId, settings: settings, hash: hash
	addTab(name: string, caption: string, moduleId: string, settings: any, hash: string) {
		var self = this,
			parentName: string = 'parent',
			str: ITabContainer = self.getTabFirstItem(name, 'tab');

		if (str == null) {
			var randomNo: number = self.getRandomItemId();
			while (randomNo === undefined) {
				randomNo = this.getRandomItemId();
			}

			ko.utils.arrayForEach(self.tabContainerList(), (tab: ITabContainer) => {
				tab.cssActive(false);
				if (tab.parent && parentName === tab.parent) {
					tab.showTabHeader(true);
				} else {
					tab.showTabHeader(false);
				}
			});

			self.tabContainerList.push({
				tab: name,
				header: ko.observable(caption),
				tabId: name + (settings.itemId || randomNo),
				cssActive: ko.observable(true),
				moduleId: moduleId,
				settings: settings,
				showTabHeader: ko.observable(settings.allowTab),
				parent: parentName,
				pageLoader: ko.observable(true),
				headerDisplay: ko.computed(() => {
					if (caption.length > 15) {
						return caption.substring(0, 13) + "..";
					}

					return caption;
				})
			});

			self.tabVisible(settings.allowTab);
			self.router.navigate(hash);
		}
		else if (name === 'Entry'
			|| name === self.ROUTE_PURCHASE_ORDER_BOARD
			|| name === self.ROUTE_TRANSACTION_SEARCH) {
			self.addDuplicateTab(name, parentName);
		}
		else {
			ko.utils.arrayForEach(this.tabContainerList(), (tab: ITabContainer) => {
				if (tab.tab != name) {
					tab.cssActive(false);
					//tab.showTabHeader(false);
				}
				else {
					tab.cssActive(true);
					tab.showTabHeader(true);
					if (str.tab !== (name || caption)) {
						tab.pageLoader(true);
					}
				}
			});
			var firstTabItem = self.getTabFirstItem(name, 'tab');
			firstTabItem.cssActive(true);
			self.tabVisible(firstTabItem.settings.allowTab);
			self.router.navigate(hash);
			self.showContentProgress(false);
		}
	}

	// function adding multiple tabs for Entry flow/ Vendor Bill Details
	addDuplicateTab(name: string, parentName: string, id?: any, proOrBolNumber?: any, isSubBill?: any, isException?: any, isLostBill?: any) {
		var self = this;
		var filterResult: DurandalRouteConfiguration = this.filterRoute(name);
		var randomNo: number = this.getRandomItemId();
		if (typeof randomNo === undefined) {
			randomNo = this.getRandomItemId();
		}
		while (randomNo === undefined) {
			randomNo = this.getRandomItemId();
		}
		if (filterResult) {
			ko.utils.arrayForEach(this.tabContainerList(), (tab: ITabContainer) => {
				tab.cssActive(false);
				tab.showTabHeader(tab.parent === parentName);
			});

			var tabItem: ITabContainer[] = this.getTabItems((filterResult.route + filterResult.settings.itemId), 'tabId');
			var itemId: number;
			itemId = (tabItem.length == 0 ? filterResult.settings.itemId : randomNo);

			var settings: DurandalRouteConfigurationSettings = {
				allowTab: (filterResult.settings.allowTab),
				itemId: itemId,
				tabType: (filterResult.settings.tabType)
			};
			if (filterResult.settings.VendorBill) {
				settings.VendorBill = filterResult.settings.VendorBill;
			}

			if (filterResult.settings.SalesOrder) {
				settings.SalesOrder = filterResult.settings.SalesOrder;
			}

			if (filterResult.title === self.ROUTE_VENDORBILL_DETAILS || filterResult.title === self.ROUTE_INVOICE) {
				settings.VendorBill = filterResult.settings.VendorBill;
				settings.defaultSettings = (tabItem.length == 0 ? filterResult.settings.defaultSettings : false);
			}

			if (filterResult.title === self.ROUTE_PURCHASEORDER_DETAILS) {
				settings.PurchaseOrder = filterResult.settings.PurchaseOrder;
				settings.defaultSettings = (tabItem.length == 0 ? filterResult.settings.defaultSettings : false);
			}

			if (filterResult.title === self.ROUTE_HISTORY_DETAILS) {
				settings.HistoryDetails = filterResult.settings.HistoryDetails;
				settings.defaultSettings = (tabItem.length == 0 ? filterResult.settings.defaultSettings : false);
			}

			if (filterResult.title === self.ROUTE_SALES_ORDER || filterResult.title === self.ROUTE_PRINTBOL) {
				settings.SalesOrder = filterResult.settings.SalesOrder;
				settings.defaultSettings = (tabItem.length == 0 ? filterResult.settings.defaultSettings : false);
			}

			if (filterResult.title === self.ROUTE_SearchResult) {
				settings.Search = filterResult.settings.Search;
				settings.defaultSettings = (tabItem.length == 0 ? filterResult.settings.defaultSettings : false);
			}

			if (filterResult.title === self.ROUTE_REBILL) {
				settings.Rebill = filterResult.settings.Rebill;
				settings.defaultSettings = (tabItem.length == 0 ? filterResult.settings.defaultSettings : false);
			}

			if (filterResult.title === self.ROUTE_SALES_ORDER_HISTORY_DETAILS) {
				settings.HistoryDetails = filterResult.settings.HistoryDetails;
				settings.defaultSettings = (tabItem.length == 0 ? filterResult.settings.defaultSettings : false);
			}

			// If purchase order board then get the settings of Purchase order board
			if (filterResult.route === self.ROUTE_PURCHASE_ORDER_BOARD) {
				settings.PurchaseOrder = filterResult.settings.PurchaseOrder;
				settings.defaultSettings = (tabItem.length == 0 ? filterResult.settings.defaultSettings : false);
			}

			// If Transaction Search then get the settings of Transaction Search
			if (filterResult.route === self.ROUTE_TRANSACTION_SEARCH) {
				settings.Search = filterResult.settings.Search;
				settings.defaultSettings = (tabItem.length == 0 ? filterResult.settings.defaultSettings : false);
			}

			// If EDI210 Search then get the settings of EDI210 Search
			if (filterResult.route === self.ROUTE_EDI210_BOARD) {
				settings.Search = filterResult.settings.Search;
				settings.defaultSettings = (tabItem.length == 0 ? filterResult.settings.defaultSettings : false);
			}

			var headerTitle: string = filterResult.route;
			var tabTitle: string = filterResult.title;
			if (filterResult.title === self.ROUTE_VENDORBILL_DETAILS && proOrBolNumber) {
				headerTitle = 'VB #' + proOrBolNumber;
			}
			else if (filterResult.title === self.ROUTE_PURCHASEORDER_DETAILS && proOrBolNumber) {
				headerTitle = 'UVB #' + proOrBolNumber;
			}
			else if (filterResult.title === self.ROUTE_HISTORY_DETAILS && proOrBolNumber) {
				headerTitle = 'History #' + proOrBolNumber;
			}
			else if (filterResult.title === self.ROUTE_SALES_ORDER && proOrBolNumber) {
				headerTitle = 'SO #' + proOrBolNumber;
			}
			else if (filterResult.title === self.ROUTE_INVOICE && proOrBolNumber) {
				headerTitle = 'IN #' + proOrBolNumber;
			}
			else if (filterResult.title === self.ROUTE_PRINTBOL && id) {
				headerTitle = 'BOL #' + id;
			}
			else if (filterResult.title === self.ROUTE_SearchResult) {
				if (id.category == "MoreResult") {
					headerTitle = "Search Result";
				}
				else {
					headerTitle = id.category + " Result";
				}
				;
			}
			else if (filterResult.route === self.SALES_ORDER_ENTRY) {
				headerTitle = 'Entry';
				tabTitle = filterResult.route;
			}
			else if (filterResult.route === self.ROUTE_REBILL) {
				headerTitle = 'Rebill #' + id;
			}
			else if (filterResult.route === self.ROUTE_SALES_ORDER_HISTORY_DETAILS && proOrBolNumber) {
				headerTitle = 'History #' + proOrBolNumber;
			}
			else if (filterResult.route === self.ROUTE_PURCHASE_ORDER_BOARD) {
				headerTitle = filterResult.title;
				tabTitle = filterResult.route;
			}
			else if (filterResult.route === self.ROUTE_TRANSACTION_SEARCH) {
				headerTitle = filterResult.title;
				tabTitle = filterResult.route;
			}
			else if (filterResult.route === self.ROUTE_EDI210_BOARD) {
				headerTitle = "EDI210 #" + proOrBolNumber;
			}

			var title: any = null;
			if (filterResult.title === 'Entry' && id) {
				title = { vendorBillId: id, isDuplicated: true };
			}
			else if (filterResult.title === self.ROUTE_VENDORBILL_DETAILS || filterResult.title === self.ROUTE_PURCHASEORDER_DETAILS || filterResult.title === self.ROUTE_HISTORY_DETAILS) {
				title = { vendorBillId: id, proNumber: proOrBolNumber, isSubBill: isSubBill, isException: isException, isLostBill: isLostBill };
			}
			else if (filterResult.title === self.ROUTE_SALES_ORDER || filterResult.title === self.ROUTE_SALES_ORDER_HISTORY_DETAILS) {
				title = { salesOrderId: id, bolNumber: proOrBolNumber, isSubOrder: isSubBill };
			}
			else if (filterResult.title === self.ROUTE_INVOICE) {
				title = { bolNumber: id, invoiceNumber: proOrBolNumber };
			}
			else if (filterResult.title === self.ROUTE_SearchResult) {
				title = id;
			}
			else if (filterResult.title === self.ROUTE_REBILL) {
				title = id;
			}
			else if (filterResult.title === self.ROUTE_PRINTBOL) {
				title = { bolNumber: id, customerBolNumber: proOrBolNumber };
			}
			else if (filterResult.route === self.ROUTE_EDI210_BOARD) {
				title = { exceptionType: id, proNumber: proOrBolNumber };
			}

			this.tabContainerList.push({
				tab: tabTitle,
				header: ko.observable(headerTitle),
				tabId: tabTitle + itemId,
				cssActive: ko.observable(true),
				moduleId: filterResult.moduleId,
				settings: settings,
				showTabHeader: ko.observable(filterResult.settings.allowTab),
				parent: parentName,
				data: title,
				pageLoader: ko.observable(true),
				headerDisplay: ko.computed(() => {
					if (headerTitle.length > 15) {
						return headerTitle.substring(0, 13) + "..";
					}

					return headerTitle;
				}),
				uniqueId: ko.observable(id),
				uniqueKey: ko.observable(proOrBolNumber)
			});

			var duplicateTabItems: ITabContainer[] = this.getTabItems(headerTitle);
			if (duplicateTabItems.length > 1) {
				var tabcount: number = 1;
				duplicateTabItems.forEach((i: ITabContainer) => {
					if (i.tab === filterResult.title) {
						if (Utils.removeNumberWithbrackets(i.header()) === filterResult.route) {
							i.header(Utils.removeNumberWithbrackets(i.header()) + ' (' + tabcount + ')');
							tabcount += 1;
						}
					}
				});
			}

			this.tabVisible(filterResult.settings.allowTab);

			if (tabItem.length) {
				this.router.map({
					moduleId: filterResult.moduleId,
					route: filterResult.route + randomNo,
					title: filterResult.title,
					nav: filterResult.nav,
					hash: filterResult.hash + randomNo,
					settings: settings
				});

				return this.router.navigate('#/' + filterResult.route + randomNo);
			}

			return this.router.navigate('#/' + filterResult.route, true);
		}
	}

	//Changes done in SignOut for removing the alert box.
	SignOut() {
		if (this.Logout()) {
			return true;
		}
		else {
			return false;
		}
	}

	// function to show mouse over sub menu
	showTabHeaderMainOnMouserHover(routeConfig: DurandalRouteConfiguration) {
		if (routeConfig.title === 'Transaction Search') { // || routeConfig.title === 'Settings'
			$('.mainMenuId').removeClass('open');
			$('.menuBtn').removeClass('hover');
			return;
		} else {
			jQuery('.mainMenuId').removeClass('open');
			jQuery('.mainMenuId > div').removeClass('hover');
			jQuery('#' + routeConfig.id).addClass('hover').parent().addClass('open');
			jQuery('#buttonContainerColumn > div').removeClass('open');
		}
	}

	//function to remove sub-menu
	mouseoutFromNav() {
		jQuery('.mainMenuId').removeClass('open');
		jQuery('.mainMenuId > div').removeClass('hover');
		if (jQuery('#buttonContainerColumn > div').hasClass('open'))
			jQuery('#buttonContainerColumn > div').removeClass('open');
	}

	showUserSettings() {
		this.mouseoutFromNav();
		jQuery('#buttonContainerColumn > div').addClass('open');
	}

	//function to close the respective tab.
	closeTab(name, title) {
		var self = this,
			currentTab: ITabContainer,
			routesToBeRemoved: Array<DurandalRouteConfiguration> = new Array<DurandalRouteConfiguration>(),
			previousTab: ITabContainer,
			tabItem: ITabContainer[];
		self.name = name;
		//currentActiveTab: ITabContainer = self.getTabFirstItem(true, 'cssActive');

		if (self.isBIDirtyChanges() === true && self.isBIDirtyChanges() !== undefined) {
			var actionButtons: Array<IToastrActionButtonOptions> = [];
			actionButtons.push({
				actionButtonName: "Yes",
				actionClick: self.unSavedChangesClosetab
			});

			actionButtons.push({
				actionButtonName: "No",
				actionClick: null
			});

			if (self.checkMsgDisplay) {
				self.checkMsgDisplay = false;
				var toastrOptions1: IToastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 0,
					fadeOut: 0,
					typeOfAlert: "",
					title: "",
					actionButtons: actionButtons
				};

				Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.ChangesMadeMessage, "warning", self.checkMsgClick, toastrOptions1, self.checkMsgHide);
			}
		}
		else {
			if (this.tabContainerList().length > 1) {
				currentTab = this.getTabFirstItem(name, 'tabId');

				//#region Deleting the current/active route(s)
				/* Deleting the current/active tab route(s) which are created dynamically.*/

				if (currentTab.settings.VendorBill) {
					if (currentTab.tab === 'Entry') {
						//## if the tab id is '3' then entry tab should not be removed from the routes.
						if (currentTab.settings.itemId !== 3) {
							routesToBeRemoved = ko.utils.arrayFilter(self.router.routes, (item: DurandalRouteConfiguration) => {
								return item.settings === currentTab.settings;
							});
						}
					}
					else {
						routesToBeRemoved = ko.utils.arrayFilter(self.router.routes, (item: DurandalRouteConfiguration) => {
							return (!currentTab.settings.defaultSettings) && item.settings.itemId === currentTab.settings.itemId;
						});
					}
				}
				else if (currentTab.settings.PurchaseOrder) {
					routesToBeRemoved = ko.utils.arrayFilter(self.router.routes, (item: DurandalRouteConfiguration) => {
						return (!currentTab.settings.defaultSettings) && item.settings.itemId === currentTab.settings.itemId;
					});
				}
				else {
					routesToBeRemoved = ko.utils.arrayFilter(self.router.routes, (item: DurandalRouteConfiguration) => {
						return (!currentTab.settings.defaultSettings) && item.settings.itemId === currentTab.settings.itemId;
					});
				}

				if (routesToBeRemoved.length) {
					self.router.routes.removeAll(routesToBeRemoved);
				}
				//#endregion Deleting the current/active route(s)

				self.tabContainerList.remove((tab: ITabContainer) => {
					return tab === currentTab;
				});

				if (self.getTabItems('parent', 'parent').length === 0) {
					tabItem = self.getTabItems('Home', 'tab');
				}
				else {
					tabItem = self.getTabItems('parent', 'parent');
				}

				self.isBIDirtyChanges(false);

				if (tabItem && tabItem.length) {
					this.tabContainerList().forEach((items) => {
						if (items.cssActive() && items.tab !== "Home") {
							previousTab = items;
						}
					});

					if (previousTab == null) {
						previousTab = tabItem[tabItem.length - 1];
						previousTab.cssActive(false);
						self.setTabActive(previousTab);
					}

					// If we close the tab then we are clearing that particular key from Local Storage.
					if (typeof currentTab.uniqueId != 'undefined') {
						if (LocalStorageController.Get(currentTab.uniqueId() + 'PO')) {
							LocalStorageController.Set(currentTab.uniqueId() + 'PO', undefined);
						}

						if (LocalStorageController.Get(currentTab.uniqueKey() + 'SO')) {
							LocalStorageController.Set(currentTab.uniqueKey() + 'SO', undefined);
						}

						if (LocalStorageController.Get(currentTab.uniqueId() + '_' + currentTab.uniqueKey() + 'VB')) {
							LocalStorageController.Set(currentTab.uniqueId() + '_' + currentTab.uniqueKey() + 'VB', undefined);
						}

						if (LocalStorageController.Get(currentTab.tabId)) {
							LocalStorageController.Set(currentTab.tabId, undefined);
						}

						// Clear Sales Order Financial Details
						if (LocalStorageController.Get(currentTab.uniqueKey() + 'SOFinancialDetails')) {
							LocalStorageController.Set(currentTab.uniqueKey() + 'SOFinancialDetails', undefined);
						}

						// Clear Sales Order MAS Customer Details
						if (LocalStorageController.Get(currentTab.uniqueKey() + 'SOMASCustomerFields')) {
							LocalStorageController.Set(currentTab.uniqueKey() + 'SOMASCustomerFields', undefined);
						}

						// To clear Vendor Bill Financial Details
						if (LocalStorageController.Get(currentTab.uniqueId() + '_' + currentTab.uniqueKey() + 'VBFinancialDetails')) {
							LocalStorageController.Set(currentTab.uniqueId() + '_' + currentTab.uniqueKey() + 'VBFinancialDetails', undefined);
						}

						////To Clear Edi Details
						//if (LocalStorageController.Get(currentTab.tabId + 'EDI210ExceptionDetails')) {
						//	LocalStorageController.Set(currentTab.tabId + 'EDI210ExceptionDetails', undefined);
						//}
					}
					// If we close the tab then we are clearing that particular key from Local Storage.
					if (typeof currentTab.tabId != 'undefined') {
						if (LocalStorageController.Get(currentTab.tabId)) {
							LocalStorageController.Set(currentTab.tabId, undefined);
						}

						//To Clear Edi
						if (LocalStorageController.Get(currentTab.tabId + 'EDI210ExceptionDetails')) {
							LocalStorageController.Set(currentTab.tabId + 'EDI210ExceptionDetails', undefined);
						}

						//To Clear EDI 210 Details Result
						if (LocalStorageController.Get(currentTab.tabId + 'EDI210ExceptionBoardDetailsResult')) {
							LocalStorageController.Set(currentTab.tabId + 'EDI210ExceptionBoardDetailsResult', undefined);
						}

						//To Clear Foreign Bol
						if (LocalStorageController.Get(currentTab.tabId + '_foreignBol')) {
							LocalStorageController.Set(currentTab.tabId + '_foreignBol', undefined);
						}
					}
				}
			}
			return true;
		}

		return true;
	}

	//creation of the initial tab
	initialTab() {
		var randomNo: number = this.getRandomItemId();
		var filterResult: DurandalRouteConfiguration = this.filterRoute(this.config.startModule);
		if (filterResult) {
			if (this.getTabItems(filterResult.title).length == 0) {
				this.tabContainerList.push({
					tab: filterResult.route,
					header: ko.observable(filterResult.title),
					tabId: filterResult.route + (filterResult.settings.itemId || randomNo),
					cssActive: ko.observable(true),
					moduleId: filterResult.moduleId,
					settings: filterResult.settings,
					showTabHeader: ko.observable(filterResult.settings.allowTab),
					parent: 'parent',
					pageLoader: ko.observable(false),
					headerDisplay: ko.computed(() => {
						if (filterResult.title.length > 15) {
							return filterResult.title.substring(0, 13) + "..";
						}

						return filterResult.title;
					})
				});
				this.tabVisible(filterResult.settings.allowTab);
				this.selectedMainMenu(filterResult.route);
			}
		}

		return true;
	}
	//#endregion Internal Methods

	//#region Methods for Header Transaction Search
	private SearchBOLAndPRO(query, process) {
		refCommon.Common.prototype.searchBolAndPro(query.trim(), process);
	}

	private onSelectSearchResult(sender, event, data) {
		switch (event.obj.category) {
			case 'Vendor Bill':
				if (event.obj.IsPurchaseOrder) {
					this.app.trigger("openPurchaseOrder", event.obj.VendorBillId, event.obj.PRONumber, (callback) => {
						if (!callback) {
							return;
						}
					});
				}
				else {
					this.app.trigger("openVendorBill", event.obj.VendorBillId, event.obj.PRONumber, (callback) => {
						if (!callback) {
							return;
						}
					});
				}

				break;
			case 'Sales Order':
				this.app.trigger("openSalesOrder", event.obj.ShipmentId, event.obj.BOLNumber, (callback) => {
					if (!callback) {
						return;
					}
				});
				break;
			case 'EDI':
				if (event.obj.ExceptionRuleId != null && event.obj.ExceptionRuleId != undefined && event.obj.ExceptionRuleId != 0) {
					this.app.trigger("openEdi210Board", event.obj.ExceptionRuleId, event.obj.EDIDetailID, event.obj.BatchId, event.obj.PRONumber, (callback) => {
						if (!callback) {
							return;
						}
					});
				}
				break;
		}

		$(event.target).val('');
	}

	private onClickMoreResult(sender: shell, event, data) {
		this.app.trigger("openTransactionSearchResult", event.resultData);
		$(event.target).val('');
	}
	//#endregion

	//#region Un-subscribing from an app-wide message.
	unSubscribtion() {
		this.subscriptionOnShowOrHideProgressBar.off();
		this.subscriptionOnShowOrHideAjaxLoader.off();
		this.subscriptionOnViewAttached.off();
		this.subscriptionToOpenVendorBill.off();
		this.subscriptionOnLoadMyData.off();
		this.subscriptionOnRegisterMyData.off();
		this.subscriptionOnCloseActiveTab.off();
		this.subscriptionOpenHistoryDetails.off();
		this.subscriptionOpenSalesOrder.off();
		this.subscriptionOpenInvoice.off();
		this.subscriptionOpenBoard.off();
		this.subscriptionOpenRexnordBoard.off();
		this.subscriptionOnNavigation.off();
		this.subscriptionOpenRebill.off();
		this.subscriptionOpenSalesOrderHistoryDetails.off();
		this.subscriptionOpenPrintBOL.off();
	}
	//#endregion Un-subscribing from an app-wide message

	activeItem(): ITabContainer {
		var self = this;
		if (self.router.activeRouteInstruction()) {
			var currentActiveRoute: DurandalRouteConfiguration = self.router.activeRouteInstruction().config;
			if (currentActiveRoute) {
				var activeItem: ITabContainer;
				var duplicateItems: ITabContainer[] = ko.utils.arrayFilter(self.tabContainerList(), (item: ITabContainer) => {
					return item.tabId === currentActiveRoute.route || item.tab === currentActiveRoute.route;
				});
				if (duplicateItems && duplicateItems.length === 1) {
					activeItem = duplicateItems[0];
				}
				else if (duplicateItems) {
					activeItem = ko.utils.arrayFirst(duplicateItems, (tabItem: ITabContainer) => {
						var defaultItem = self.getDefaultItemFromConfig(tabItem.settings.itemId, tabItem.tab);
						if (defaultItem) {
							return defaultItem.route === currentActiveRoute.route;
						}
					});
				}
				if (activeItem) {
					return activeItem;
				} else {
					return ko.utils.arrayFirst(self.tabContainerList(), (item: ITabContainer) => {
						return item.settings != null;
					});
				}
			}
		}
	}

	// Shows the message box as pr the given title and message
	public showConfirmationMessage(message: string, title: string, fisrtButtoName: string, secondButtonName: string, yesCallBack: () => boolean, noCallBack: () => boolean) {
		var varMsgBox: Array<IMessageBoxButtonOption> = [
			{
				id: 0, name: fisrtButtoName, callback: (): boolean => {
					return yesCallBack();
				},
			},
			{
				id: 1, name: secondButtonName, callback: (): boolean => {
					return noCallBack();
				}
			}
		];

		////initialize message box control arguments
		var optionControlArgs: IMessageBoxOption = {
			options: varMsgBox,
			message: message,
			title: title
		}
				//Call the dialog Box functionality to open a Pop up
		_app.showDialog('templates/messageBox', optionControlArgs, 'slideDown');
	}

	//#region Life Cycle Events of Durandal
	activate() {
		var self = this;

		refCommon.Common.prototype.GetCurrentCustomerResourceSettings(
			(result: Array<ILogicalResourceAccessRule>) => {
				self.logicalResources = Object.freeze(result);
				var routes: Array<DurandalRouteConfiguration> = self.getConfiguredRoutesByPermission();
				self.showProgress(true);

				self.router.map(routes).buildNavigationModel();
				var myAccountMenu = self.router.routes.filter(function (r: DurandalRouteConfiguration) {
					return r.settings.MyAccount;
				});
				self.MyAccountSubMenu(myAccountMenu);
				self.router.mapUnknownRoutes((instruction: DurandalRouteInstruction) => {
					var actualRoute: DurandalRouteConfiguration = ko.utils.arrayFirst(self.router.routes, (item: DurandalRouteConfiguration) => {
						return item.route === instruction.fragment;
					});
					if (actualRoute) {
						instruction.config = actualRoute;
						return instruction;
					} else {
						actualRoute = ko.utils.arrayFirst(self.router.routes, (item: DurandalRouteConfiguration) => {
							return item.route === self.config.startModule;
						});

						instruction.config = actualRoute;
						instruction.fragment = actualRoute.route;
						instruction.params = null;

						return instruction;
					}
				});

				self.router.navigate(self.config.startModule);
				//self.router.navigate("TransactionSearch")
				_app.trigger("showGlobalSearch");
				self.showProgress(false);

				return self.router.activate();
			});

		self.showProgress(false);
	}

	deactivate() {
		var self = this;
		var activeRoute = self.router.activeItem();
		if (activeRoute) {
			if (activeRoute.deactivate && refSystem.isFunction(activeRoute.deactivate)) {
				activeRoute.deactivate();
			}
		}
	}

	//#endregion Life Cycle Events of Durandal

	/**
		 * Method to get the configured routes by access role permission.
		 * @returns {Array<DurandalRouteConfiguration>} new configured routes.
		 */
	getConfiguredRoutesByPermission(): Array<DurandalRouteConfiguration> {
		var self = this;
		self.showProgress(true);

		/**
		* variable to hold the permission based routes.
		*/
		var newRoutesToConfigure: Array<DurandalRouteConfiguration> = new Array<DurandalRouteConfiguration>();

		/*
		* Looping through all the configured routes and adding those into {newRoutesToConfigure} variable.
		* Filtering logical resource for each routes and checking with user permission by using {resourceName}, {rqdPermission} variables.
		* If it has correct permission adding that into {newRoutesToConfigure} variable, else it won't.
		* Also, if route is not setup with any resource it will add into {newRoutesToConfigure} variable.
		*/
		self.config.routes.forEach((item: DurandalRouteConfiguration) => {
			if (item.settings.resourceName) {
				var logicalResourcesArray: Array<ILogicalResourceAccessRule> = $.map(self.logicalResources, function (value, index) {
					return [value];
				});

				var logicalResource: ILogicalResourceAccessRule = ko.utils.arrayFirst(logicalResourcesArray, function (lrItem: ILogicalResourceAccessRule) {
					return (item.settings.resourceName === lrItem.ResourceName) && (item.settings.rqdPermission === lrItem.RequiredPermission);
				});
				if (logicalResource) {
					newRoutesToConfigure.push(item);
				}
			}
			else {
				newRoutesToConfigure.push(item);
			}
		});
		/**
		* Variable to holding the main menu items from configured routes.
		*/
		var mainMenuList: Array<DurandalRouteConfiguration> = ko.utils.arrayFilter(newRoutesToConfigure, function (item: DurandalRouteConfiguration) {
			return (item.settings.isMainMenu);
		});

		if (mainMenuList) {
			/**
			* Looping through all the main menus from configured routes and removing those which are not having submenus in {newRoutesToConfigure} object.
			*/
			mainMenuList.forEach((mmItem: DurandalRouteConfiguration) => {
				switch (mmItem.title) {
					case Constants.UIConstants.VendorBillPageTitle:
						var VBSubMenu: DurandalRouteConfiguration = ko.utils.arrayFirst(newRoutesToConfigure, (accountingmenuItem: DurandalRouteConfiguration): boolean=> { return accountingmenuItem.settings.VendorBill; });
						if (!VBSubMenu) {
							newRoutesToConfigure.remove(mmItem);
						}
						break;
					case Constants.UIConstants.PurchaseOrderPageTitle:
						var purchaseOrderSubMenu: DurandalRouteConfiguration = ko.utils.arrayFirst(newRoutesToConfigure, (accountingmenuItem: DurandalRouteConfiguration): boolean=> { return accountingmenuItem.settings.PurchaseOrder; });
						if (!purchaseOrderSubMenu) {
							newRoutesToConfigure.remove(mmItem);
						}
						break;
					case Constants.UIConstants.SalesOrderTitle:
						var salesorderSubMenu: DurandalRouteConfiguration = ko.utils.arrayFirst(newRoutesToConfigure, (accountingmenuItem: DurandalRouteConfiguration): boolean=> { return accountingmenuItem.settings.SalesOrder; });
						if (!salesorderSubMenu) {
							newRoutesToConfigure.remove(mmItem);
						}
						break;
					case Constants.UIConstants.CarrierMapping:
						var carrierSubMenu: DurandalRouteConfiguration = ko.utils.arrayFirst(newRoutesToConfigure, (accountingmenuItem: DurandalRouteConfiguration): boolean=> { return accountingmenuItem.settings.Carrier; });
						if (!carrierSubMenu) {
							newRoutesToConfigure.remove(mmItem);
						}
						break;
					case Constants.UIConstants.BoardPageTitle:
						var boardSubMenu: DurandalRouteConfiguration = ko.utils.arrayFirst(newRoutesToConfigure, (accountingmenuItem: DurandalRouteConfiguration): boolean=> { return accountingmenuItem.settings.Board; });
						if (!boardSubMenu) {
							newRoutesToConfigure.remove(mmItem);
						}
						break;
					case Constants.UIConstants.ReportsPageTitle:
						var reportSubMenu: DurandalRouteConfiguration = ko.utils.arrayFirst(newRoutesToConfigure, (accountingmenuItem: DurandalRouteConfiguration): boolean=> { return accountingmenuItem.settings.Reports; });
						if (!reportSubMenu) {
							newRoutesToConfigure.remove(mmItem);
						}
						break;
				}
			});
		}
		self.showProgress(false);

		return newRoutesToConfigure;
	}
}

return new shell();