/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region Refrences
/// <reference path="../../../Scripts/TypeDefs/Simplex.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../models/TypeDefs/TransactionSearchModel.d.ts" />
/// <reference path="../../../Scripts/Constants/ApplicationConstants.ts" />
//#endregion

//#region Import
import refMapLocation = require('services/models/common/MapLocation');
import refSystem = require('durandal/system');
import refEnums = require('services/models/common/Enums');
import refVendorNameSearch = require('services/models/common/searchVendorName');
import refUserNameSearch = require('services/models/common/searchUserName');
import reMasCarrierSearch = require('services/models/common/searchMasCarrier');
import refAddressBookSearch = require('services/models/common/searchAddressBook');
import refCustomerNameSearch = require('services/models/common/searchCustomerName');
import refSearch = require('services/models/common/SearchResponce');
import refDateRangeClient = require('services/models/common/DateRange');
//#endregion

/*
** <summary>
** Common client View Model to call common method.
** </summary>
** <createDetails>
** <id></id> <by></by> <date></date>
** </createDetails>
** <changeHistory>
** <id>US20352</id> <by>Chandan Singh Bajetha</by> <date>14-01-2016</date> <description>Acct: Adjust UI for Dispute Notes Tab in Vendor Bill</description>
** <id>US22795</id> <by>Vasanthakumar</by> <date>22-06-2016</date> <description>Acct: Block Trucload Vendors for SO Entry Screen</description>
** <id>US22956</id> <by>Shreesha Adiga</by> <date>17-06-2016</date> <description>Added GetUVBOwnershipList method</description>
** <id>US23631</id> <by>Shreesha Adiga</by> <date>27-07-2016</date> <description>Added GetNumberOfRequoteWorkedForIRManagers</description>
** <id>DE23560</id> <by>Shreesha Adiga</by> <date>01-08-2016</date> <description>Added getUserDetailsByUserId</description>
** <id>US23604</id> <by>Baldev Singh Thakur</by> <date>01-08-2016</date> <description>Added GetDisputeDashboardDetails for displaying the Dispute Dashboard Graph.</description>
** <id>US23630</id> <by>Vasanthakumar</by> <date>03-08-2016</date> <description>Implemented Dispute Worked Graph For IRManagers</description>
** <id>US23629</id> <by>Shreesha Adiga</by> <date>03-08-2016</date> <description>Added GetDisputeWorkedDashboardDataForIndividualUser</description>
** <id>US25143</id> <by>Shreesha Adiga</by> <date>06-10-2016</date><description>Added GetDashboardContainerDetails to fetch details related to dashboard tabs</description>
** <id>US25164</id> <by>Vasanthakumar</by><date>21-10-2016</date><description>Populate AR Dashboard grid</description>
** <id>US25686</id> <by>Vasanthakumar</by> <date>25-11-2016</date> <description>Added strored procedure related to VB reassignment boards.</description>
** <id>US27148</id> <by>Vasanthakumar</by> <date>23-02-2017</date> <description>Added Handle concurrent Processing on VB Reassignment Dashboard</description>
** <id>US27352</id> <by>Baldev Singh Thakur</by> <date>07-03-2017</date> <description>Added validation to check if re-assigned vendor bill can be processed.</description>
** </changeHistory>
*/
export class Common {
	//#region Public Methods

	// For Search location on the based of zip codes, state and city
	public SearchLocation(startValue: string, topCount: number, zipCodes: boolean, isMexico: boolean, successCallBack: Function): any {
		var self = this;
		var url: string =
			isMexico ? ('Accounting/common/SearchMexicoLocation/?startValue=' + startValue + '&topCount=' + topCount + '&zipCodes=' + zipCodes)
			: ('Accounting/common/SearchLocation/?startValue=' + startValue + '&topCount=' + topCount + '&zipCodes=' + zipCodes);

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				var result: any = data;
				var newItems = ko.utils.arrayMap(result, function (item: refMapLocation.IMapLocation) {
					return new refMapLocation.Models.MapLocation(item);
				});
				successCallBack(newItems);
			})
			.fail((arg) => {
				self.FailureProxyCallback('SearchLocation', arg);
			});
	}

	public searchVendorName(startValue: string, successCallBack: Function) {
		var self = this;
		var url: string = "Accounting/GetVendors";

		var _searchValue = new SearchModel(startValue);
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, _searchValue)
			.done((data) => {
				var result: any = data;
				var newItems = ko.utils.arrayMap(result, function (item: refVendorNameSearch.IVendorNameSearch) {
					return new refVendorNameSearch.Models.VendorNameSearch(item);
				});
				successCallBack(newItems);
			})
			.fail((arg) => {
				self.FailureProxyCallback('searchVendorName', arg);
			});
	}

	// <createdDetails>
	// <id>US22795</id> <by>Vasanthakumar</by> <date>22-06-2016</date> <description>Acct: Block Trucload Vendors for SO Entry Screen</description>
	// </createdDetails>
	public searchExceptTLVendorName(startValue: string, successCallBack: Function) {
		var self = this;
		var url: string = "Accounting/GetVendorsExceptTL";

		var _searchValue = new SearchModel(startValue);
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, _searchValue)
			.done((data) => {
				var result: any = data;
				var newItems = ko.utils.arrayMap(result, function (item: refVendorNameSearch.IVendorNameSearch) {
					return new refVendorNameSearch.Models.VendorNameSearch(item);
				});
				successCallBack(newItems);
			})
			.fail((arg) => {
				self.FailureProxyCallback('searchVendorName', arg);
			});
	}

	// For Search Transaction
	public searchHeaderTransaction(searchData: string, successCallBack: Function, faliureCallBack: Function) {
		var self = this;
		var url: string = "Accounting/GetHeaderTransactionResponse";

		var _searchValue = new SearchModel(searchData);
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, _searchValue)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('GetHeaderTransactionResponse', arg);
			});
	}

	/*
	// Gets the users by the given keywords
	*/
	public searchUsers(startValue: any, successCallBack: Function) {
		var self = this;
		var url: string = "Accounting/GetUserDetailsByUserName";

		var searchValue = new SearchModel(startValue);
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, searchValue)
			.done((data) => {
				var result: any = data;
				var newItems = ko.utils.arrayMap(result, (item: refUserNameSearch.IUserNameSearch) => {
					return new refUserNameSearch.Models.UserNameSearch(item);
				});
				successCallBack(newItems);
			})
			.fail((arg) => {
				self.FailureProxyCallback('searchUserName', arg);
			});
	}

	/*
	** Gets the user detials by the dbo.User's userId
	** <createDetails>
	** <id>DE23560</id> <by>Shreesha Adiga</by> <date>01-08-2016</date>
	** </createDetails>
	*/
	public getUserDetailsByUserId(dboUserId: number, successCallBack: Function) {
		var self = this;
		var url: string = "Accounting/GetUserDetailsByUserId/" + dboUserId;

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('searchUserName', arg);
			});
	}

	/*
	  // Gets the MAS Carriers by the given keywords
	*/
	public searchMasCarriers(startValue: any, successCallBack: Function) {
		var self = this;
		var url: string = "Accounting/SearchMasCarriersByInitials";

		var searchValue = new SearchModel(startValue);
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, searchValue)
			.done((data) => {
				var result: any = data;
				var newItems = ko.utils.arrayMap(result, (item: reMasCarrierSearch.IMasCarrierSearch) => {
					return new reMasCarrierSearch.Models.MasCarrierSearch(item);
				});
				successCallBack(newItems);
			})
			.fail((arg) => {
				self.FailureProxyCallback('searchUserName', arg);
			});
	}

	//Gets the Address Book based on customer Id

	public searchCustomerAddressBook(startValue: any, customerId: number, successCallBack: Function) {
		var self = this;
		var url: string = "Accounting/GetCustomerBillToAddressByCustomerId";
		var searchValue = new SearchModel(startValue, customerId);
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, searchValue)
			.done((data) => {
				var result: any = data;
				var newItems = ko.utils.arrayMap(result, (item: refAddressBookSearch.IShipmentAddressBook) => {
					return new refAddressBookSearch.Models.AddressBookSearch(item);
				});
				successCallBack(newItems);
			})
			.fail((arg) => {
				self.FailureProxyCallback('searchCustomerAddressBook', arg);
			});
	}

	public GetCurrentUser(successCallBack?: (result: IUser) => void, failureCallBack?: Function) {
		var self = this;

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		if (true) {
			ajax.get('Accounting/GetCurrentUser')
				.done((data: IUser) => {
					successCallBack(data);
				})
				.fail((arg) => {
					failureCallBack();
					self.FailureProxyCallback('GetCustomerDetails', arg);
				});
		}
	}

	public GetCurrentCustomerResourceSettings(successCallBack: (result: Array<ILogicalResourceAccessRule>) => void, failureCallBack?: () => void) {
		var self = this;

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get('Accounting/GetCurrentCustomerLogicalResource')
			.done((data: Array<ILogicalResourceAccessRule>) => {
				successCallBack(Object.freeze(data));
			})
			.fail((arg) => {
				if (failureCallBack) {
					failureCallBack();
				}
				self.FailureProxyCallback('GetCurrentCustomerLogicalResource', arg);
			});
	}

	public SendEmail(EmailDetails: any, successCallBack: Function, failureCallBack?: Function) {
		var self = this;

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post("Accounting/user/SendSalesOrderAgentEmail", EmailDetails)
			.done(function (message) { successCallBack(message); })
			.fail(function (message) {
				if (failureCallBack) {
					failureCallBack();
				}
				self.FailureProxyCallback('SendSalesOrderAgentEmail', message);
			});
	}

	/// Loaded the ENUM values
	/// parameter: success callback, and failed call back
	public GetEnums(successCallBack: Function) {
		var self = this;
		var url: string = 'Accounting/LoadEnums';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('GetEnums', arg);
			});
	}

	/// Loaded the all the types of shipment
	/// parameter: success callback, and failed call back
	public GetListShipmentType(successCallBack: Function) {
		var self = this;
		var url: string = 'Accounting/ListShipmentType';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('GetEnums', arg);
			});
	}

	public GetOfficesForLoggedInUser(successCallback: Function, failureCallback: Function) {
		var self = this;
		var url: string = 'Accounting/Common/OfficesForLoggedInUser';
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallback(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('SearchLocation', arg);
				failureCallback();
			});
	}

	/// Loaded the all the types of bill status
	/// parameter: success callback, and failed call back
	public GetVendorBillStatusList(successCallBack: Function) {
		var self = this;
		var url: string = 'Accounting/GetVendorBillStatusList';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('GetVendorBillStatusList', arg);
			});
	}

	/*
	*-- Executes any kind of URL and gives the result back
	*/
	public ExecuteURL(url: string, successCallBack: (string) => any, failCallBack: (string) => any) {
		var self = this;
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

		ajax.get(url).done((data) => {
			successCallBack(data);
		}).fail((errorMessage) => {
				self.FailureProxyCallback('searchCustomers', errorMessage);
			});
	}

	/*
	// Gets the customers by the given keywords
	*/
	public searchCustomers(startValue: any, successCallBack: Function) {
		var self = this;
		var url: string = "Accounting/GetCustomerDetails";

		var searchValue = new SearchModel(startValue);
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, searchValue)
			.done((data) => {
				var result: any = data;
				var newItems = ko.utils.arrayMap(result, (item: refCustomerNameSearch.ICustomerNameSearch) => {
					return new refCustomerNameSearch.Models.CustomerNameSearch(item);
				});
				successCallBack(newItems);
			})
			.fail((arg) => {
				self.FailureProxyCallback('searchCustomers', arg);
			});
	}

	public searchBolAndPro(startValue: any, successCallBack: Function, failCallBack?: Function) {
		var self = this;
		var url: string = "Accounting/GetHeaderTransactionResponse";
		var searchValue = new SearchModel(startValue);
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, searchValue)
			.done((data) => {
				var result = [];

				var vendorBillResult = $.map<IVendorBillSearchResult, any>(data.VendorBillSearchResults, function (value, Key) {
					var valueBolWithoutNull = value.BOLNumber ? (' - ' + value.BOLNumber) : '';
					var valueCost = ' - ' + '$' + value.Amount;
					return {
						PRONumber: value.PRONumber,
						VendorBillId: value.VendorBillId,
						Display: '<span class=\'clickable-item\'>#' + value.PRONumber + ' (' + value.BillStatusDisplay + ')' + valueBolWithoutNull + valueCost + '</span>', //##DE19887
						//Display: '#' + value.PRONumber + ' (' + value.BillStatusDisplay +')' + valueBolWithoutNull,
						FilterDisplay: undefined,
						IsPurchaseOrder: value.IsPurchaseOrder
					};
				});

				var salesOrderResult = $.map<ISalesOrderSearchResult, any>(data.SalesOrderSearchResults, function (value, Key) {
					var valuePROWithoutNull = value.PRONumber ? (' - ' + value.PRONumber) : '';
					return {
						BOLNumber: value.BOLNumber,
						ShipmentId: value.ShipmentId,
						Display: '<span class=\'clickable-item\'>#' + value.BOLNumber + ' (' + value.ProcessStatusDisplay + ')' + valuePROWithoutNull + '</span>', //##DE19887
						//Display: '#' + value.BOLNumber + ' (' + value.ProcessStatusDisplay + ')' + valuePROWithoutNull,
						FilterDisplay: undefined
					};
				});

				var edi210Result = $.map<IEdi210SearchResult, any>(data.Edi210SearchResults, function (value, Key) {
					if (value.ExceptionRuleId === 2)
						value.ExceptionDescription = "Duplicate PRO";
					else if (value.ExceptionRuleId === 3)
						value.ExceptionDescription = "Corrected";

					return {
						PRONumber: value.ProNumber,
						ExceptionRuleId: value.ExceptionRuleId,
						BatchId: value.BatchId,
						EDIDetailID: value.EDIDetailID,
						Display: value.ExceptionDescription
						? '<span class=\'clickable-item\'> #' + value.ProNumber + ' (' + value.ExceptionDescription + ') </span>'
						: '<span class=\'non-clickable-item\'> #' + value.ProNumber + ' (Database) </span>', //##DE19887
						//Display: '#' + value.ProNumber + ' (' + (value.ExceptionDescription ? value.ExceptionDescription : 'Database') + ')',
						FilterDisplay: undefined
					};
				});

				if (vendorBillResult && vendorBillResult.length) {
					result.push({ category: 'Vendor Bill', items: vendorBillResult });
				}

				if (salesOrderResult && salesOrderResult.length) {
					result.push({ category: 'Sales Order', items: salesOrderResult });
				}

				if (edi210Result && edi210Result.length) {
					result.push({ category: 'EDI', items: edi210Result });
				}

				successCallBack(result);
			})
			.fail((arg) => {
				self.FailureProxyCallback('searchBolAndPro', arg);
			});
	}

	// get the status list for transaction search
	public getStatusListForTransactionSearch(successCallBack: Function) {
		var self = this;
		var url: string = 'Accounting/GetStatusListForTransactionSearch';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('GetStatusListForTransactionSearch', arg);
			});
	}

	// For Transaction Search
	public getTransactionSearchResponse(searchRequest: any, successCallBack: Function, faliureCallBack: Function) {
		var self = this;
		var url: string = "Accounting/GetTransactionSearchResponse";

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, searchRequest)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				faliureCallBack();
				self.FailureProxyCallback('GetTransactionSearchResponse', arg);
			});
	}

	//#region Admin Menu calls

	// Getting the payment details from service
	public getOnlinePaymentDetail(successCallBack: Function, faliureCallBack: Function) {
		var self = this;
		var url: string = "Accounting/GetOnlinePaymentDetail";

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				faliureCallBack();
				self.FailureProxyCallback('GetOnlinePaymentDetail', arg);
			});
	}

	// Saves the the payment details to the database
	public updateCompanyPaymentConfigurations(model, successCallBack: Function, faliureCallBack: Function) {
		var self = this;
		var url: string = "Accounting/UpdateCompanyPaymentConfigurations";

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, model)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				faliureCallBack();
				self.FailureProxyCallback('updateCompanyPaymentConfigurations', arg);
			});
	}

	// Saves the the payment details to the database
	public updateCustomerPaymentConfigurations(model, successCallBack: Function, faliureCallBack: Function) {
		var self = this;
		var url: string = "Accounting/UpdateCustomerPaymentConfigurations";

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, model)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				faliureCallBack();
				self.FailureProxyCallback('updateCustomerPaymentConfigurations', arg);
			});
	}

	// This service call gets all the customers by Agency id
	public getCustomersByAgencyId(agencyId: number, successCallBack: Function, faliureCallBack: Function) {
		var self = this;
		var url: string = "Accounting/GetCustomersByAgencyId/" + agencyId.toString();

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				faliureCallBack();
				self.FailureProxyCallback('GetCustomersByAgencyId', arg);
			});
	}

	// This service call gets all the customers by Agency id
	public getAgencyOnlinePaymentSettings(agencyId: number, successCallBack: Function, faliureCallBack: Function) {
		var self = this;
		var url: string = "Accounting/GetAgencyOnlinePaymentSettings/" + agencyId.toString();

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				faliureCallBack();
				self.FailureProxyCallback('GetAgencyOnlinePaymentSettings', arg);
			});
	}

	// Saves the the payment details to the database
	public deleteCustomerPaymentConfigurations(model, successCallBack: Function, faliureCallBack: Function) {
		var self = this;
		var url: string = "Accounting/DeleteCustomerPaymentConfigurations";

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, model)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				faliureCallBack();
				self.FailureProxyCallback('deleteCustomerPaymentConfigurations', arg);
			});
	}

	/// Saves the grid setting foe the user and selected view
	public SaveUserGridSettings(data: any, successCallBack: Function, faliureCallBack: Function) {
		var self = this;
		var url: string = "Accounting/SaveUserGridSettings";

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, data)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('SaveUserGridSettings', arg);
			});
	}

	public GetUserGridSettings(viewId: any, successCallBack: Function) {
		var self = this;
		var url: string = "Accounting/GetUserGridSettings/" + viewId.toString();

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('GetUserGridSettings', arg);
			});
	}

	/// parameter: success callback, and failed call back
	public IsHoliday(successCallBack: Function) {
		var self = this;
		var url: string = 'Accounting/IsTodayHoliday';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('IsTodayHoliday', arg);
			});
	}

	//<changeHistory>
	// <id>US20267</id> <by>Chandan Singh Bajetha</by> <date>28-01-2016</date> <description>Acct: Allow users to Navigate to past date values on graphs</description>
	//</changeHistory>
	public GetNumberOfPOsCreatedPerDay(dateRange: refDateRangeClient.IdateRange, successcallBack: Function, failureBack: Function) {
		var self = this;
		var url: string = 'Accounting/GetNumberOfPOsCreatedPerDay';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, dateRange)
			.done((data) => {
				successcallBack(data);
			})
			.fail((arg) => {
				failureBack(arg);
				self.FailureProxyCallback('GetNumberOfPOsCreatedPerDay', arg);
			});
	}

	// <createDetails>
	// <id>US19762</id> <by>Baldev Singh Thakur</by> <date>07-12-2015</date> <description>Inserting data to track Re-quote/Suborder on dashboard.</description>
	// </createDetails>
	public GetNumberOfRequoteSuborderCountPerDay(successcallBack: Function) {
		var self = this;
		var url: string = 'Accounting/GetNumberOfRequoteSuborderCountPerDay';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successcallBack(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('GetNumberOfRequoteSuborderCountPerDay', arg);
			});
	}

	// <createdDetails>
	// <id>US20267</id> <by>Chandan Singh Bajetha</by> <date>28-01-2016</date> <description>Acct: Allow users to Navigate to past date values on graphs</description>
	// </createdDetails>
	public GetNumberOfRequoteCountPerDay(dateRange: refDateRangeClient.IdateRange, successcallBack: Function, failureBack: Function) {
		var self = this;
		var url: string = 'Accounting/GetNumberOfRequoteCountPerDay';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, dateRange)
			.done((data) => {
				successcallBack(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('GetNumberOfRequoteCountPerDay', arg);
			});
	}

	// <createdDetails>
	// <id>US20267</id> <by>Chandan Singh Bajetha</by> <date>28-01-2016</date> <description>Acct: Allow users to Navigate to past date values on graphs</description>
	// </createdDetails>
	public GetNumberOfSuborderCountPerDay(dateRange: refDateRangeClient.IdateRange, successcallBack: Function, failureBack: Function) {
		var self = this;
		var url: string = 'Accounting/GetNumberOfSuborderCountPerDay';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, dateRange)
			.done((data) => {
				successcallBack(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('GetNumberOfSuborderCountPerDay', arg);
			});
	}

	// <createdDetails>
	// <id>US23631</id> <by>Shreesha Adiga</by> <date>27-07-2016</date> <description>Get the Total Counts of requote worked for all users (Shown only to IR managers)</description>
	// </createdDetails>
	public GetNumberOfRequoteWorkedForIRManagers(dateRange: refDateRangeClient.IdateRange, successcallBack: Function, failureBack: Function) {
		var self = this;
		var url: string = 'Accounting/GetNumberOfRequoteWorkedForIRManagers';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, dateRange)
			.done((data) => {
				successcallBack(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('GetNumberOfRequoteWorkedForIRManagers', arg);
			});
	}

	// <createdDetails>
	// <id>US23630</id> <by>Vasanthakumar</by> <date>03-08-2016</date> <description>Get the Total Counts of dispute worked by team for all users (Shown only to IR managers)</description>
	// </createdDetails>
	public GetNumberOfDisputeWorkedbyTeamForIRManagers(dateRange: refDateRangeClient.IdateRange, successcallBack: Function, failureBack: Function) {
		var self = this;
		var url: string = 'Accounting/GetNumberOfDisputeWorkedbyTeamForIRManagers';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, dateRange)
			.done((data) => {
				successcallBack(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('GetNumberOfDisputeWorkedbyTeamForIRManagers', arg);
			});
	}

	// <createdDetails>
	// <id>US23629</id> <by>Shreesha Adiga</by> <date>03-08-2016</date> <description>Get the Total Counts of dispute worked by individual user for a 5-day range</description>
	// </createdDetails>
	public GetDisputeWorkedDashboardDataForIndividualUser(dateRange: refDateRangeClient.IdateRange, successcallBack: Function, failureBack: Function) {
		var self = this;
		var url: string = 'Accounting/GetDisputeWorkedDashboardDataForIndividualUser';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, dateRange)
			.done((data) => {
				successcallBack(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('GetDisputeWorkedDashboardDataForIndividualUser', arg);
			});
	}

	// ###START: US20352
	// Loaded the all the types of shipment
	// parameter: success callback, and failed call back
	public GetListDisputeStatus(successCallBack: Function) {
		var self = this;
		var url: string = 'Accounting/GetListDisputeStatus';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('GetListDisputeStatus', arg);
			});
	}
	// ###END: US20352
	//#endregion Admin Menu calls

	// <createdDetails>
	// <id>US22956</id> <by>Shreesha Adiga</by> <date>17-06-2016</date> <description>Gets the list of UVB Ownerships</description>
	// </createdDetails>
	public GetUVBOwnershipList(successCallBack: Function) {
		var self = this;
		var url: string = 'Accounting/GetUVBOwnershipList';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('GetUVBOwnershipList', arg);
			});
	}

	/// <summary>
	/// Get Dispute Dashboard Details for the given date range
	/// </summary>
	/// <param name="dateRange">Date Range</param>
	/// <returns>Data for Dispute Dashboard Details</returns>
	/// <createDetails>
	/// <id>US23604</id> <by>Baldev Singh Thakur</by> <date>01-08-2016</date>
	/// </createDetails>
	public GetDisputeDashboardDetails(dateRange: refDateRangeClient.IdateRange, successCallBack: Function, failureCallBack: Function) {
		var self = this;
		var url: string = 'Accounting/GetDisputeDashboardDetails';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, dateRange)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				self.FailureProxyCallback('GetDisputeDashboardDetails', arg);
			});
	}

	/// <summary>
	/// Get Dispute Dashboard Details for the given date range
	/// </summary>
	/// <param name="dateRange">Date Range</param>
	/// <returns>Data for Dispute Dashboard Details</returns>
	/// <createDetails>
	/// <id>US25143</id> <by>Shreesha Adiga</by> <date>06-10-2016</date>
	/// </createDetails>
	public GetDashboardContainerDetails(successCallBack: Function, failureCallBack: Function) {
		var self = this;
		var url: string = 'Accounting/GetDashboardContainerDetails';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				failureCallBack();
				self.FailureProxyCallback('GetDashboardContainerDetails', arg);
			});
	}

	/// <summary>
	/// Get Credit Memo request details
	/// </summary>
	/// <param name="userGridSettingsRequest">User Grid Settings model</param>
	/// <returns>Data for AR Dashboard</returns>
	/// <createDetail>
	/// <id>US25164</id> <by>Vasanthakumar</by><date>21-10-2016</date>
	/// </createDetail>
	public GetCreditMemoRequestDetails(userGridSettingsRequest, successCallBack: Function, failureCallBack: Function) {
		var self = this;
		var url: string = 'Accounting/GetCreditMemoRequestDetails';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, userGridSettingsRequest)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				failureCallBack();
				self.FailureProxyCallback('GetCreditMemoRequestDetails', arg);
			});
	}

	/// <summary>
	/// Get Vendor bill reassignment details
	/// </summary>
	/// <param name="userGridSettingsRequest">User Grid Settings model</param>
	/// <returns>Data for AR Dashboard</returns>
	/// <createDetail>
	/// <id>US25686</id> <by>Vasanthakumar</by> <date>25-11-2016</date>
	/// </createDetail>
	public GetVendorBillReassignmentDetails(userGridSettingsRequest, successCallBack: Function, failureCallBack: Function) {
		var self = this;
		var url: string = 'Accounting/GetVendorBillReassignmentDetails';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, userGridSettingsRequest)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				failureCallBack();
				self.FailureProxyCallback('GetVendorBillReassignmentDetails', arg);
			});
	}

	/// <summary>
	/// Vendor bill reassignment process
	/// </summary>
	/// <param name="userGridSettingsRequest">User Grid Settings model</param>
	/// <returns>Data for AR Dashboard</returns>
	/// <createDetail>
	/// <id>US25686</id> <by>Vasanthakumar</by> <date>25-11-2016</date>
	/// </createDetail>
	/// <changeHistory>
	/// <id>US27148</id> <by>Vasanthakumar</by> <date>23-02-2017</date> <description>Added Handle concurrent Processing on VB Reassignment Dashboard</description>
	/// <id>US27352</id> <by>Baldev Singh Thakur</by> <date>07-03-2017</date> <description>Added validation to check if re-assigned vendor bill can be processed.</description>
	/// </changeHistory>
	public VendorBillReassignmentProcess(vendorBillReassignment, successCallBack: Function, failureCallBack: Function, failCallBackInfo: Function) {
		var self = this;
		var url: string = 'Accounting/VendorBillReassignmentProcess';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post(url, vendorBillReassignment)
			.done((data) => {
				if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
					successCallBack(data);
				}
				else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSentFailedCode) {
					failureCallBack(data.StatusModel.Description);
				}
				// ###START: US27352
				else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.ErrorStatusInfoCode) {
					failureCallBack(data);
				} // ###END: US27352
				else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSettingNotFoundCode
					|| data.StatusModel.StatusCode == Constants.ApplicationConstants.RecordAlreadyChanged) {
					failCallBackInfo(data.StatusModel.Description);
				}
			})
			.fail((arg) => {
				failureCallBack();
				self.FailureProxyCallback('VendorBillReassignmentProcess', arg);
			});
	}

	//#region Private Methods

	// For Log the Error record
	private FailureProxyCallback(context, error) {
		if (error.responseText) {
			if (error.responseText.indexOf("HTTP_STATUS_CODE:401") != -1) {
				refSystem.log(error.responseText, error, context + ' error callback');
				return;
			}
		}

		try {
			var errorDetails = JSON.parse(error.responseText);
			if (error) {
				refSystem.log(errorDetails.Message, error, context + ' error callback');
				return;
			}
			else {
				refSystem.log(errorDetails.responseText, error, context + ' error callback');
				return;
			}
		}
		catch (err) {
			var status = error.status;
			var statusText = error.statusText;
			refSystem.log((status ? error.status + ': ' : 'Error : ') + (statusText ? error.statusText : ''), error, context + ' failure/error callback');
			return;
		}
	}

	//#endregion
}

class SearchModel {
	SearchValue: string;
	CustomerId: number;
	constructor(searchValue: string, customerId?: number) {
		this.SearchValue = searchValue;
		this.CustomerId = customerId;
	}
}