/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'services/models/common/MapLocation', 'durandal/system', 'services/models/common/searchVendorName', 'services/models/common/searchUserName', 'services/models/common/searchMasCarrier', 'services/models/common/searchAddressBook', 'services/models/common/searchCustomerName'], function(require, exports, __refMapLocation__, __refSystem__, __refVendorNameSearch__, __refUserNameSearch__, __reMasCarrierSearch__, __refAddressBookSearch__, __refCustomerNameSearch__) {
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
    var refMapLocation = __refMapLocation__;
    var refSystem = __refSystem__;
    
    var refVendorNameSearch = __refVendorNameSearch__;
    var refUserNameSearch = __refUserNameSearch__;
    var reMasCarrierSearch = __reMasCarrierSearch__;
    var refAddressBookSearch = __refAddressBookSearch__;
    var refCustomerNameSearch = __refCustomerNameSearch__;
    
    

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
    var Common = (function () {
        function Common() {
        }
        //#region Public Methods
        // For Search location on the based of zip codes, state and city
        Common.prototype.SearchLocation = function (startValue, topCount, zipCodes, isMexico, successCallBack) {
            var self = this;
            var url = isMexico ? ('Accounting/common/SearchMexicoLocation/?startValue=' + startValue + '&topCount=' + topCount + '&zipCodes=' + zipCodes) : ('Accounting/common/SearchLocation/?startValue=' + startValue + '&topCount=' + topCount + '&zipCodes=' + zipCodes);

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                var result = data;
                var newItems = ko.utils.arrayMap(result, function (item) {
                    return new refMapLocation.Models.MapLocation(item);
                });
                successCallBack(newItems);
            }).fail(function (arg) {
                self.FailureProxyCallback('SearchLocation', arg);
            });
        };

        Common.prototype.searchVendorName = function (startValue, successCallBack) {
            var self = this;
            var url = "Accounting/GetVendors";

            var _searchValue = new SearchModel(startValue);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, _searchValue).done(function (data) {
                var result = data;
                var newItems = ko.utils.arrayMap(result, function (item) {
                    return new refVendorNameSearch.Models.VendorNameSearch(item);
                });
                successCallBack(newItems);
            }).fail(function (arg) {
                self.FailureProxyCallback('searchVendorName', arg);
            });
        };

        // <createdDetails>
        // <id>US22795</id> <by>Vasanthakumar</by> <date>22-06-2016</date> <description>Acct: Block Trucload Vendors for SO Entry Screen</description>
        // </createdDetails>
        Common.prototype.searchExceptTLVendorName = function (startValue, successCallBack) {
            var self = this;
            var url = "Accounting/GetVendorsExceptTL";

            var _searchValue = new SearchModel(startValue);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, _searchValue).done(function (data) {
                var result = data;
                var newItems = ko.utils.arrayMap(result, function (item) {
                    return new refVendorNameSearch.Models.VendorNameSearch(item);
                });
                successCallBack(newItems);
            }).fail(function (arg) {
                self.FailureProxyCallback('searchVendorName', arg);
            });
        };

        // For Search Transaction
        Common.prototype.searchHeaderTransaction = function (searchData, successCallBack, faliureCallBack) {
            var self = this;
            var url = "Accounting/GetHeaderTransactionResponse";

            var _searchValue = new SearchModel(searchData);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, _searchValue).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('GetHeaderTransactionResponse', arg);
            });
        };

        /*
        // Gets the users by the given keywords
        */
        Common.prototype.searchUsers = function (startValue, successCallBack) {
            var self = this;
            var url = "Accounting/GetUserDetailsByUserName";

            var searchValue = new SearchModel(startValue);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, searchValue).done(function (data) {
                var result = data;
                var newItems = ko.utils.arrayMap(result, function (item) {
                    return new refUserNameSearch.Models.UserNameSearch(item);
                });
                successCallBack(newItems);
            }).fail(function (arg) {
                self.FailureProxyCallback('searchUserName', arg);
            });
        };

        /*
        ** Gets the user detials by the dbo.User's userId
        ** <createDetails>
        ** <id>DE23560</id> <by>Shreesha Adiga</by> <date>01-08-2016</date>
        ** </createDetails>
        */
        Common.prototype.getUserDetailsByUserId = function (dboUserId, successCallBack) {
            var self = this;
            var url = "Accounting/GetUserDetailsByUserId/" + dboUserId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('searchUserName', arg);
            });
        };

        /*
        // Gets the MAS Carriers by the given keywords
        */
        Common.prototype.searchMasCarriers = function (startValue, successCallBack) {
            var self = this;
            var url = "Accounting/SearchMasCarriersByInitials";

            var searchValue = new SearchModel(startValue);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, searchValue).done(function (data) {
                var result = data;
                var newItems = ko.utils.arrayMap(result, function (item) {
                    return new reMasCarrierSearch.Models.MasCarrierSearch(item);
                });
                successCallBack(newItems);
            }).fail(function (arg) {
                self.FailureProxyCallback('searchUserName', arg);
            });
        };

        //Gets the Address Book based on customer Id
        Common.prototype.searchCustomerAddressBook = function (startValue, customerId, successCallBack) {
            var self = this;
            var url = "Accounting/GetCustomerBillToAddressByCustomerId";
            var searchValue = new SearchModel(startValue, customerId);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, searchValue).done(function (data) {
                var result = data;
                var newItems = ko.utils.arrayMap(result, function (item) {
                    return new refAddressBookSearch.Models.AddressBookSearch(item);
                });
                successCallBack(newItems);
            }).fail(function (arg) {
                self.FailureProxyCallback('searchCustomerAddressBook', arg);
            });
        };

        Common.prototype.GetCurrentUser = function (successCallBack, failureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            if (true) {
                ajax.get('Accounting/GetCurrentUser').done(function (data) {
                    successCallBack(data);
                }).fail(function (arg) {
                    failureCallBack();
                    self.FailureProxyCallback('GetCustomerDetails', arg);
                });
            }
        };

        Common.prototype.GetCurrentCustomerResourceSettings = function (successCallBack, failureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get('Accounting/GetCurrentCustomerLogicalResource').done(function (data) {
                successCallBack(Object.freeze(data));
            }).fail(function (arg) {
                if (failureCallBack) {
                    failureCallBack();
                }
                self.FailureProxyCallback('GetCurrentCustomerLogicalResource', arg);
            });
        };

        Common.prototype.SendEmail = function (EmailDetails, successCallBack, failureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/user/SendSalesOrderAgentEmail", EmailDetails).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                if (failureCallBack) {
                    failureCallBack();
                }
                self.FailureProxyCallback('SendSalesOrderAgentEmail', message);
            });
        };

        /// Loaded the ENUM values
        /// parameter: success callback, and failed call back
        Common.prototype.GetEnums = function (successCallBack) {
            var self = this;
            var url = 'Accounting/LoadEnums';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('GetEnums', arg);
            });
        };

        /// Loaded the all the types of shipment
        /// parameter: success callback, and failed call back
        Common.prototype.GetListShipmentType = function (successCallBack) {
            var self = this;
            var url = 'Accounting/ListShipmentType';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('GetEnums', arg);
            });
        };

        Common.prototype.GetOfficesForLoggedInUser = function (successCallback, failureCallback) {
            var self = this;
            var url = 'Accounting/Common/OfficesForLoggedInUser';
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallback(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('SearchLocation', arg);
                failureCallback();
            });
        };

        /// Loaded the all the types of bill status
        /// parameter: success callback, and failed call back
        Common.prototype.GetVendorBillStatusList = function (successCallBack) {
            var self = this;
            var url = 'Accounting/GetVendorBillStatusList';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('GetVendorBillStatusList', arg);
            });
        };

        /*
        *-- Executes any kind of URL and gives the result back
        */
        Common.prototype.ExecuteURL = function (url, successCallBack, failCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (errorMessage) {
                self.FailureProxyCallback('searchCustomers', errorMessage);
            });
        };

        /*
        // Gets the customers by the given keywords
        */
        Common.prototype.searchCustomers = function (startValue, successCallBack) {
            var self = this;
            var url = "Accounting/GetCustomerDetails";

            var searchValue = new SearchModel(startValue);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, searchValue).done(function (data) {
                var result = data;
                var newItems = ko.utils.arrayMap(result, function (item) {
                    return new refCustomerNameSearch.Models.CustomerNameSearch(item);
                });
                successCallBack(newItems);
            }).fail(function (arg) {
                self.FailureProxyCallback('searchCustomers', arg);
            });
        };

        Common.prototype.searchBolAndPro = function (startValue, successCallBack, failCallBack) {
            var self = this;
            var url = "Accounting/GetHeaderTransactionResponse";
            var searchValue = new SearchModel(startValue);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, searchValue).done(function (data) {
                var result = [];

                var vendorBillResult = $.map(data.VendorBillSearchResults, function (value, Key) {
                    var valueBolWithoutNull = value.BOLNumber ? (' - ' + value.BOLNumber) : '';
                    var valueCost = ' - ' + '$' + value.Amount;
                    return {
                        PRONumber: value.PRONumber,
                        VendorBillId: value.VendorBillId,
                        Display: '<span class=\'clickable-item\'>#' + value.PRONumber + ' (' + value.BillStatusDisplay + ')' + valueBolWithoutNull + valueCost + '</span>',
                        //Display: '#' + value.PRONumber + ' (' + value.BillStatusDisplay +')' + valueBolWithoutNull,
                        FilterDisplay: undefined,
                        IsPurchaseOrder: value.IsPurchaseOrder
                    };
                });

                var salesOrderResult = $.map(data.SalesOrderSearchResults, function (value, Key) {
                    var valuePROWithoutNull = value.PRONumber ? (' - ' + value.PRONumber) : '';
                    return {
                        BOLNumber: value.BOLNumber,
                        ShipmentId: value.ShipmentId,
                        Display: '<span class=\'clickable-item\'>#' + value.BOLNumber + ' (' + value.ProcessStatusDisplay + ')' + valuePROWithoutNull + '</span>',
                        //Display: '#' + value.BOLNumber + ' (' + value.ProcessStatusDisplay + ')' + valuePROWithoutNull,
                        FilterDisplay: undefined
                    };
                });

                var edi210Result = $.map(data.Edi210SearchResults, function (value, Key) {
                    if (value.ExceptionRuleId === 2)
                        value.ExceptionDescription = "Duplicate PRO";
else if (value.ExceptionRuleId === 3)
                        value.ExceptionDescription = "Corrected";

                    return {
                        PRONumber: value.ProNumber,
                        ExceptionRuleId: value.ExceptionRuleId,
                        BatchId: value.BatchId,
                        EDIDetailID: value.EDIDetailID,
                        Display: value.ExceptionDescription ? '<span class=\'clickable-item\'> #' + value.ProNumber + ' (' + value.ExceptionDescription + ') </span>' : '<span class=\'non-clickable-item\'> #' + value.ProNumber + ' (Database) </span>',
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
            }).fail(function (arg) {
                self.FailureProxyCallback('searchBolAndPro', arg);
            });
        };

        // get the status list for transaction search
        Common.prototype.getStatusListForTransactionSearch = function (successCallBack) {
            var self = this;
            var url = 'Accounting/GetStatusListForTransactionSearch';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('GetStatusListForTransactionSearch', arg);
            });
        };

        // For Transaction Search
        Common.prototype.getTransactionSearchResponse = function (searchRequest, successCallBack, faliureCallBack) {
            var self = this;
            var url = "Accounting/GetTransactionSearchResponse";

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, searchRequest).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.FailureProxyCallback('GetTransactionSearchResponse', arg);
            });
        };

        //#region Admin Menu calls
        // Getting the payment details from service
        Common.prototype.getOnlinePaymentDetail = function (successCallBack, faliureCallBack) {
            var self = this;
            var url = "Accounting/GetOnlinePaymentDetail";

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.FailureProxyCallback('GetOnlinePaymentDetail', arg);
            });
        };

        // Saves the the payment details to the database
        Common.prototype.updateCompanyPaymentConfigurations = function (model, successCallBack, faliureCallBack) {
            var self = this;
            var url = "Accounting/UpdateCompanyPaymentConfigurations";

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, model).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.FailureProxyCallback('updateCompanyPaymentConfigurations', arg);
            });
        };

        // Saves the the payment details to the database
        Common.prototype.updateCustomerPaymentConfigurations = function (model, successCallBack, faliureCallBack) {
            var self = this;
            var url = "Accounting/UpdateCustomerPaymentConfigurations";

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, model).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.FailureProxyCallback('updateCustomerPaymentConfigurations', arg);
            });
        };

        // This service call gets all the customers by Agency id
        Common.prototype.getCustomersByAgencyId = function (agencyId, successCallBack, faliureCallBack) {
            var self = this;
            var url = "Accounting/GetCustomersByAgencyId/" + agencyId.toString();

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.FailureProxyCallback('GetCustomersByAgencyId', arg);
            });
        };

        // This service call gets all the customers by Agency id
        Common.prototype.getAgencyOnlinePaymentSettings = function (agencyId, successCallBack, faliureCallBack) {
            var self = this;
            var url = "Accounting/GetAgencyOnlinePaymentSettings/" + agencyId.toString();

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.FailureProxyCallback('GetAgencyOnlinePaymentSettings', arg);
            });
        };

        // Saves the the payment details to the database
        Common.prototype.deleteCustomerPaymentConfigurations = function (model, successCallBack, faliureCallBack) {
            var self = this;
            var url = "Accounting/DeleteCustomerPaymentConfigurations";

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, model).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.FailureProxyCallback('deleteCustomerPaymentConfigurations', arg);
            });
        };

        /// Saves the grid setting foe the user and selected view
        Common.prototype.SaveUserGridSettings = function (data, successCallBack, faliureCallBack) {
            var self = this;
            var url = "Accounting/SaveUserGridSettings";

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, data).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('SaveUserGridSettings', arg);
            });
        };

        Common.prototype.GetUserGridSettings = function (viewId, successCallBack) {
            var self = this;
            var url = "Accounting/GetUserGridSettings/" + viewId.toString();

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('GetUserGridSettings', arg);
            });
        };

        /// parameter: success callback, and failed call back
        Common.prototype.IsHoliday = function (successCallBack) {
            var self = this;
            var url = 'Accounting/IsTodayHoliday';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('IsTodayHoliday', arg);
            });
        };

        //<changeHistory>
        // <id>US20267</id> <by>Chandan Singh Bajetha</by> <date>28-01-2016</date> <description>Acct: Allow users to Navigate to past date values on graphs</description>
        //</changeHistory>
        Common.prototype.GetNumberOfPOsCreatedPerDay = function (dateRange, successcallBack, failureBack) {
            var self = this;
            var url = 'Accounting/GetNumberOfPOsCreatedPerDay';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, dateRange).done(function (data) {
                successcallBack(data);
            }).fail(function (arg) {
                failureBack(arg);
                self.FailureProxyCallback('GetNumberOfPOsCreatedPerDay', arg);
            });
        };

        // <createDetails>
        // <id>US19762</id> <by>Baldev Singh Thakur</by> <date>07-12-2015</date> <description>Inserting data to track Re-quote/Suborder on dashboard.</description>
        // </createDetails>
        Common.prototype.GetNumberOfRequoteSuborderCountPerDay = function (successcallBack) {
            var self = this;
            var url = 'Accounting/GetNumberOfRequoteSuborderCountPerDay';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successcallBack(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('GetNumberOfRequoteSuborderCountPerDay', arg);
            });
        };

        // <createdDetails>
        // <id>US20267</id> <by>Chandan Singh Bajetha</by> <date>28-01-2016</date> <description>Acct: Allow users to Navigate to past date values on graphs</description>
        // </createdDetails>
        Common.prototype.GetNumberOfRequoteCountPerDay = function (dateRange, successcallBack, failureBack) {
            var self = this;
            var url = 'Accounting/GetNumberOfRequoteCountPerDay';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, dateRange).done(function (data) {
                successcallBack(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('GetNumberOfRequoteCountPerDay', arg);
            });
        };

        // <createdDetails>
        // <id>US20267</id> <by>Chandan Singh Bajetha</by> <date>28-01-2016</date> <description>Acct: Allow users to Navigate to past date values on graphs</description>
        // </createdDetails>
        Common.prototype.GetNumberOfSuborderCountPerDay = function (dateRange, successcallBack, failureBack) {
            var self = this;
            var url = 'Accounting/GetNumberOfSuborderCountPerDay';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, dateRange).done(function (data) {
                successcallBack(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('GetNumberOfSuborderCountPerDay', arg);
            });
        };

        // <createdDetails>
        // <id>US23631</id> <by>Shreesha Adiga</by> <date>27-07-2016</date> <description>Get the Total Counts of requote worked for all users (Shown only to IR managers)</description>
        // </createdDetails>
        Common.prototype.GetNumberOfRequoteWorkedForIRManagers = function (dateRange, successcallBack, failureBack) {
            var self = this;
            var url = 'Accounting/GetNumberOfRequoteWorkedForIRManagers';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, dateRange).done(function (data) {
                successcallBack(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('GetNumberOfRequoteWorkedForIRManagers', arg);
            });
        };

        // <createdDetails>
        // <id>US23630</id> <by>Vasanthakumar</by> <date>03-08-2016</date> <description>Get the Total Counts of dispute worked by team for all users (Shown only to IR managers)</description>
        // </createdDetails>
        Common.prototype.GetNumberOfDisputeWorkedbyTeamForIRManagers = function (dateRange, successcallBack, failureBack) {
            var self = this;
            var url = 'Accounting/GetNumberOfDisputeWorkedbyTeamForIRManagers';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, dateRange).done(function (data) {
                successcallBack(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('GetNumberOfDisputeWorkedbyTeamForIRManagers', arg);
            });
        };

        // <createdDetails>
        // <id>US23629</id> <by>Shreesha Adiga</by> <date>03-08-2016</date> <description>Get the Total Counts of dispute worked by individual user for a 5-day range</description>
        // </createdDetails>
        Common.prototype.GetDisputeWorkedDashboardDataForIndividualUser = function (dateRange, successcallBack, failureBack) {
            var self = this;
            var url = 'Accounting/GetDisputeWorkedDashboardDataForIndividualUser';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, dateRange).done(function (data) {
                successcallBack(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('GetDisputeWorkedDashboardDataForIndividualUser', arg);
            });
        };

        // ###START: US20352
        // Loaded the all the types of shipment
        // parameter: success callback, and failed call back
        Common.prototype.GetListDisputeStatus = function (successCallBack) {
            var self = this;
            var url = 'Accounting/GetListDisputeStatus';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('GetListDisputeStatus', arg);
            });
        };

        // ###END: US20352
        //#endregion Admin Menu calls
        // <createdDetails>
        // <id>US22956</id> <by>Shreesha Adiga</by> <date>17-06-2016</date> <description>Gets the list of UVB Ownerships</description>
        // </createdDetails>
        Common.prototype.GetUVBOwnershipList = function (successCallBack) {
            var self = this;
            var url = 'Accounting/GetUVBOwnershipList';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('GetUVBOwnershipList', arg);
            });
        };

        /// <summary>
        /// Get Dispute Dashboard Details for the given date range
        /// </summary>
        /// <param name="dateRange">Date Range</param>
        /// <returns>Data for Dispute Dashboard Details</returns>
        /// <createDetails>
        /// <id>US23604</id> <by>Baldev Singh Thakur</by> <date>01-08-2016</date>
        /// </createDetails>
        Common.prototype.GetDisputeDashboardDetails = function (dateRange, successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/GetDisputeDashboardDetails';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, dateRange).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.FailureProxyCallback('GetDisputeDashboardDetails', arg);
            });
        };

        /// <summary>
        /// Get Dispute Dashboard Details for the given date range
        /// </summary>
        /// <param name="dateRange">Date Range</param>
        /// <returns>Data for Dispute Dashboard Details</returns>
        /// <createDetails>
        /// <id>US25143</id> <by>Shreesha Adiga</by> <date>06-10-2016</date>
        /// </createDetails>
        Common.prototype.GetDashboardContainerDetails = function (successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/GetDashboardContainerDetails';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                failureCallBack();
                self.FailureProxyCallback('GetDashboardContainerDetails', arg);
            });
        };

        /// <summary>
        /// Get Credit Memo request details
        /// </summary>
        /// <param name="userGridSettingsRequest">User Grid Settings model</param>
        /// <returns>Data for AR Dashboard</returns>
        /// <createDetail>
        /// <id>US25164</id> <by>Vasanthakumar</by><date>21-10-2016</date>
        /// </createDetail>
        Common.prototype.GetCreditMemoRequestDetails = function (userGridSettingsRequest, successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/GetCreditMemoRequestDetails';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, userGridSettingsRequest).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                failureCallBack();
                self.FailureProxyCallback('GetCreditMemoRequestDetails', arg);
            });
        };

        /// <summary>
        /// Get Vendor bill reassignment details
        /// </summary>
        /// <param name="userGridSettingsRequest">User Grid Settings model</param>
        /// <returns>Data for AR Dashboard</returns>
        /// <createDetail>
        /// <id>US25686</id> <by>Vasanthakumar</by> <date>25-11-2016</date>
        /// </createDetail>
        Common.prototype.GetVendorBillReassignmentDetails = function (userGridSettingsRequest, successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/GetVendorBillReassignmentDetails';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, userGridSettingsRequest).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                failureCallBack();
                self.FailureProxyCallback('GetVendorBillReassignmentDetails', arg);
            });
        };

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
        Common.prototype.VendorBillReassignmentProcess = function (vendorBillReassignment, successCallBack, failureCallBack, failCallBackInfo) {
            var self = this;
            var url = 'Accounting/VendorBillReassignmentProcess';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, vendorBillReassignment).done(function (data) {
                if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successCallBack(data);
                } else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSentFailedCode) {
                    failureCallBack(data.StatusModel.Description);
                } else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.ErrorStatusInfoCode) {
                    failureCallBack(data);
                } else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSettingNotFoundCode || data.StatusModel.StatusCode == Constants.ApplicationConstants.RecordAlreadyChanged) {
                    failCallBackInfo(data.StatusModel.Description);
                }
            }).fail(function (arg) {
                failureCallBack();
                self.FailureProxyCallback('VendorBillReassignmentProcess', arg);
            });
        };

        //#region Private Methods
        // For Log the Error record
        Common.prototype.FailureProxyCallback = function (context, error) {
            if (error.responseText) {
                if (error.responseText.indexOf("HTTP_STATUS_CODE:401") != -1) {
                    refSystem.log(error.responseText, error, context + ' error callback');
                    return;
                }
            }

            try  {
                var errorDetails = JSON.parse(error.responseText);
                if (error) {
                    refSystem.log(errorDetails.Message, error, context + ' error callback');
                    return;
                } else {
                    refSystem.log(errorDetails.responseText, error, context + ' error callback');
                    return;
                }
            } catch (err) {
                var status = error.status;
                var statusText = error.statusText;
                refSystem.log((status ? error.status + ': ' : 'Error : ') + (statusText ? error.statusText : ''), error, context + ' failure/error callback');
                return;
            }
        };
        return Common;
    })();
    exports.Common = Common;

    var SearchModel = (function () {
        function SearchModel(searchValue, customerId) {
            this.SearchValue = searchValue;
            this.CustomerId = customerId;
        }
        return SearchModel;
    })();
});
