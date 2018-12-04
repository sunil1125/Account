/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created : July 11, 2014
** Created By Achal Rastogi
*/

//#region References
/// <reference path="../../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/Simplex.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/toastr.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../models/TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../models/TypeDefs/PurchaseOrderSearchModel.d.ts" />
/// <reference path="../models/TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../models/TypeDefs/PurchaseOrderModel.d.ts" />
/// <reference path="../../../Scripts/Constants/ApplicationConstants.ts" />
//#endregion

//#region Import
import refVendorNameSearch = require('services/models/common/searchVendorName');
import refPurchaseOrderSearchResult = require('services/models/purchaseOrder/PurchaseOrderSearchResult');
import refAgencyNameSearch = require('services/models/purchaseOrder/SearchAgencyName');
import refAgentNameSearch = require('services/models/common/searchUserName');
import refCustomerNameSearch = require('services/models/common/searchCustomerName');
import refSystem = require('durandal/system');
import _app = require('durandal/app');
//#endregion

/*
** <summary>
** Purchase order client server calls.
** </summary>
** <changeHistory>
** <id>US21619</id> <by>Vasanthakumar</by> <date>27-04-2016</date> <description>Handling Response model for Validate error Logs in Accounting</description>
** <id>US22471</id> <by>Vasanthakumar</by> <date>03-06-2016</date> <description>Add Success Toastr message for Emails triggered by users</description>
** <id>DE23332</id> <by>Dhaval Tamhane</by> <date>22-06-2016</date> <description>Removed code related to GetHeaderCountDataInPOBoard as it was not used</description>
** <id>US22796</id> <by>Baldev Singh Thakur</by> <date>23-06-2016</date> <description>This method is used to check if the carrier exists in TruckLoad.Carriers</description>
** </changeHistory>
*/

export class PurchaseOrderClient {
    //#region Public Methods

    //for quick search
    public quickSearchPurchaseOrder(purchaseOrderSearch: IPurchaseOrderQuickSearch, successCallBack: Function, faliureCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/GetPurchaseOrderQuickSearchResult';

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post(url, purchaseOrderSearch)
            .done((data) => {
                //var result: any = data;
                //var newItems = ko.utils.arrayMap(result, function (item) {
                //	return new refPurchaseOrderSearchResult.Models.PurchaseOrderSearchResult(item);
                //});
                successCallBack(data);
            })
            .fail((arg) => {
                self.failureProxyCallback('quickSearchPurchaseOrder', arg);
                faliureCallBack();
            });
    }

    //#region Load Purchase order details
    // get POP Details
    public getPOPDetails(vendorBillId: number, successCallBack: Function, faliureCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/GetPurchaseOrderPossibilityDetails/?vendorBillId=' + vendorBillId;

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.get(url)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                faliureCallBack();
                self.failureProxyCallback('getShipmentRelatedLinks', arg);
            });
    }

    //## Service to Move the purchase order to rexnord board. #/
    public moveFromVolumeCustomerBills(vendorBillIds: IVendorBillId, successCallBack, failureCallBack) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post("Accounting/MoveToRexnodCustormerBills", vendorBillIds)
            .done(function (message) { successCallBack(message); })
            .fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('MoveFromVolumeCustomerBills', message);
            });
    }

    //## get Rexnord Mapped Companies List
    public getRexnordMappedCompanies(successCallBack: Function, faliureCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/GetVolumeCustomerBillsIdentificationMapping';

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.get(url)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                faliureCallBack();
                self.failureProxyCallback('GetVolumeCustomerBillsIdentificationMapping', arg);
            });
    }

    //## Service to add/modify/delete rexnord mapped companies. #/
    public insertUpdateOrDeleteVolumeCustomerBillsIdentificationMapping(companyList: any, successCallBack, failureCallBack) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post("Accounting/InsertUpdateOrDeleteVolumeCustomerBillsIdentificationMapping", companyList)
            .done(function (message) { successCallBack(message); })
            .fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('InsertUpdateOrDeleteVolumeCustomerBillsIdentificationMapping', message);
            });
    }

    //#endregion

    // To send Email
    public sendAgentEmail(purchaseOrderEmailData: IPurchaseOrderEmail, successCallback: Function, failureCallback: Function) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        return ajax.post('Accounting/SendAgentMail', purchaseOrderEmailData)
			.done((data) => {
				// ###START: US22471
				if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
					successCallback(data.Respone);
				}
				else {
					failureCallback(data.StatusModel.Description);
				}
				// ###END: US22471
            })
            .fail((arg) => {
                failureCallback(arg);
                self.failureProxyCallback('sendEmail', arg);
            });
    }

    //## Service to get all purchase orders list. #/
    public getPurchaseOrdersRexnordDetails(searchFilter: any, successCallBack: Function, faliureCallBack: Function, PagingData?) {
        var self = this;
        var url: string = 'Accounting/GetPurchaseOrdersRexnordBoardDetails';
        var _searchValue = new SearchModel('', '', '', PagingData.currentPage(), PagingData.pageSize());
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post(url, searchFilter)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                faliureCallBack();
                self.failureProxyCallback('GetPurchaseOrdersRexnordBoardDetails', arg);
            });
    }

    //## Service to Move the  rexnord board to purchase order#/
    public moveFromRexnordVolumeCustomerBills(vendorBillIds: IVendorBillId, successCallBack, failureCallBack) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post("Accounting/MoveToGlobalTranzCustormerBills", vendorBillIds)
            .done(function (message) { successCallBack(message); })
            .fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('moveFromRexnordVolumeCustomerBills', message);
            });
    }

    // Service to get Agency Names
    public searchAgencyDetails(startValue: string, successCallBack: Function) {
        var self = this;
        var url: string = "Accounting/GetAgencyDetails";

        var _searchValue = new SearchModel(startValue, '', '');
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post(url, _searchValue)
            .done((data) => {
                var result: any = data;
                var newItems = ko.utils.arrayMap(result, function (item: refAgencyNameSearch.IAgencyNameSearch) {
                    return new refAgencyNameSearch.Models.AgencyNameSearch(item);
                });
                successCallBack(newItems);
            })
            .fail((arg) => {
                self.failureProxyCallback('searchAgencyName', arg);
            });
    }

    // Service to get Agency Names
    public searchAgentDetailsByAgencyId(startValue: string, agencyId: number, successCallBack: Function) {
        var self = this;
        var url: string = "Accounting/GetAgentDetailsByAgencyId";

        var _searchValue = new SearchModel(startValue, '', '');
        _searchValue.AgencyId = agencyId;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post(url, _searchValue)
            .done((data) => {
                var result: any = data;
                var newItems = ko.utils.arrayMap(result, function (item: refAgentNameSearch.IUserNameSearch) {
                    return new refAgentNameSearch.Models.UserNameSearch(item);
                });
                successCallBack(newItems);
            })
            .fail((arg) => {
                self.failureProxyCallback('searchAgentDetailsByAgencyId', arg);
            });
    }

    // Service to get Customers Names
    public searchCustomerDetailsByUserId(startValue: string, userId: number, successCallBack: Function) {
        var self = this;
        var url: string = "Accounting/GetCustomerDetailsByUserId";

        var _searchValue = new SearchModel(startValue, '', '');
        _searchValue.UserId = userId;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post(url, _searchValue)
            .done((data) => {
                var result: any = data;
                var newItems = ko.utils.arrayMap(result, function (item: refCustomerNameSearch.ICustomerNameSearch) {
                    return new refCustomerNameSearch.Models.CustomerNameSearch(item);
                });
                successCallBack(newItems);
            })
            .fail((arg) => {
                self.failureProxyCallback('searchCustomerDetailsByUserId', arg);
            });
    }

    // To Get customer Financial Details
    public getCustomerFinancialDetailsByCustomerId(customerId: number, successCallBack: Function, faliureCallBack: Function) {
        var self = this;
        var url: string = "Accounting/GetCustomerFinancialDetails/?customerId=" + customerId;
        if (customerId > 0) {
            var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url)
                .done((data) => {
                    successCallBack(data);
                })
                .fail((arg) => {
                    self.failureProxyCallback('getCustomerFinancialDetailsByCustomerId', arg);
                });
        }
    }

    // Call for PO To SO creation
    public createPurchaseOrderToSalesOrder(poToSoContainer: any, successCallBack: Function, faliureCallBack: Function) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        return ajax.post('Accounting/CreatePurchaseOrderToSalesOrder', poToSoContainer)
            .done((data) => {
				//// ###START: US21619
				if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
					successCallBack(data.Response);
				}
				else {
					faliureCallBack(data.StatusModel.Description);
				}
				//// ###END: US21619
            })
            .fail((arg) => {
                faliureCallBack(arg);
                self.failureProxyCallback('createPurchaseOrderToSalesOrder', arg);
            });
    }

    // Call for PO To SO creation
    public rateItManually(poToSoContainer: any, successCallBack: Function, faliureCallBack: Function) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        return ajax.post('Accounting/RateItManually', poToSoContainer)
			.done((data) => {
				//// ###START: US21619
				if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
					successCallBack(data.Response);
				}
				else {
					faliureCallBack(data.StatusModel.Description);
				}
				//// ###END: US21619
            })
            .fail((arg) => {
                faliureCallBack(arg);
                self.failureProxyCallback('RateItManually', arg);
            });
    }

    public DeleteForeignCustomerDetails(vendorBillId: number, isDeleteAddress: boolean, successcallBack: Function, failureCallBack: Function) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        return ajax.get('Accounting/DeleteForeignCustomerDetails/?vendorBillId=' + vendorBillId + '&isDeleteAddress=' + isDeleteAddress)
            .done((data) => {
                successcallBack(data);
            })
            .fail((arg) => {
                failureCallBack(arg);
                self.failureProxyCallback('DeleteForeignCustomerDetails', arg);
            });
    }

    public DeactivateAgentNotificationForVendorBill(vendorBillId: number, resumeTime: string, successcallBack: Function, failureCallBack: Function) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        return ajax.get('Accounting/DeactivateAgentNotificationForVendorBill/?vendorBillId=' + vendorBillId + '&resumeTime=' + resumeTime)
            .done((data) => {
                successcallBack(data);
            })
            .fail((arg) => {
                failureCallBack(arg);
                self.failureProxyCallback('DeactivateAgentNotificationForVendorBill', arg);
            });
    }

	public SendAgentNotificationOnStopTimer(customerId: number, vendorBillId: number, successcallBack: Function, failureCallBack: Function, failCallBackInfo: Function) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        return ajax.get('Accounting/SendRevertNotificationForAgentOnStopTimer/?customerId=' + customerId + '&vendorBillId=' + vendorBillId)
			.done((data) => {
				// ###START: US22471
				if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
					successcallBack(data.Response);
				}
				else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSentFailedCode) {
					failureCallBack(data.StatusModel.Description);
				}
				else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSettingNotFoundCode) {
					failCallBackInfo(data.StatusModel.Description);
				}
				// ###END: US22471
            })
            .fail((arg) => {
                failureCallBack(arg);
                self.failureProxyCallback('SendAgentNotificationOnStopTimer', arg);
            });
    }

    public UpdateForeignBolCustomerOfUVB(vendorBillId: number, newCustomerId: number, oldCustomerId: number, isDeleteAddress: boolean, successcallBack: Function, failureCallBack: Function) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        return ajax.get('Accounting/UpdateForeignBolCustomerOfUVB/?vendorBillId=' + vendorBillId + '&newCustomerId=' + newCustomerId + '&oldCustomerId=' + oldCustomerId + '&isDeleteAddress=' + isDeleteAddress)
            .done((data) => {
                successcallBack(data);
            })
            .fail((arg) => {
                failureCallBack(arg);
                self.failureProxyCallback('UpdateForeignBolCustomerOfUVB', arg);
            });
    }

    public SendRevertNotificationForAgentOnCustomerChange(vendorBillId: number, customerId: number, successcallBack: Function, failureCallBack: Function) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        return ajax.get('Accounting/SendRevertNotificationForAgentOnCustomerChange/?customerId=' + customerId + '&vendorBillId=' + vendorBillId)
            .done((data) => {
                successcallBack(data);
            })
            .fail((arg) => {
                failureCallBack(arg);
                self.failureProxyCallback('SendRevertNotificationForAgentOnCustomerChange', arg);
            });
    }

	public ResumeForeignBolTimer(vendorBillId: number, customerId: number, successcallBack: Function, failureCallBack: Function, failCallBackInfo: Function) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        return ajax.get('Accounting/ResumeForeignBolTimer/?customerId=' + customerId + '&vendorBillId=' + vendorBillId)
			.done((data) => {
				// ###START: US22471
				if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
					successcallBack(data.Response);
				}
				else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSentFailedCode) {
					failureCallBack(data.StatusModel.Description);
				}
				else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSettingNotFoundCode) {
					failCallBackInfo(data.StatusModel.Description);
				}
				// ###END: US22471
            })
            .fail((arg) => {
                failureCallBack(arg);
                self.failureProxyCallback('ResumeForeignBolTimer', arg);
            });
    }

    //#endregion

    //#region Private Methods

    // For Log the Error record
    private failureProxyCallback(context, error) {
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

    // For PoPossiblity Search
    public getPoPossibilitySearchResponse(searchRequest: any, successCallBack: Function, faliureCallBack: Function) {
        var self = this;
        var url: string = "Accounting/GetPoPossibilitySearchResponse";

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post(url, searchRequest)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                faliureCallBack();
                self.failureProxyCallback('GetPoPossibilitySearchResponse', arg);
            });
    }

    //#region Save vendor Bill

    public SavePOPossibilityDetail(poPossibilitySaveDetails: IPOPossibilitySaveParameter, successCallBack: Function, failureCallBack?: Function) {
        var self = this;

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post("Accounting/SavePOPossibilityDetail", poPossibilitySaveDetails)
            .done(function (message) { successCallBack(message); })
            .fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('SavePOPossibilityDetail', message);
            });
    }

    //#endregion

    // Get the purchase Order details by vendor bill id
    public getPurchaseOrderDetailsByVendorBillId(vendorBillId: number, successCallBack: Function, faliureCallBack: Function, isSubBill: boolean = false) {
        var self = this;
        var url: string = 'Accounting/GetPurchaseOrderDetailsByVendorBillId/?vendorBillId=' + vendorBillId + '&isSubBill=' + isSubBill;

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.get(url)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                faliureCallBack();
                self.failureProxyCallback('GetPurchaseOrderDetailsByVendorBillId', arg);
            });
    }

    // gets the model after uploading the file
    public uploadAndGetUploadedResponse(uploadModel: any, successCallBack: Function, failCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/SavePurchaseOrderUploadFileModel';

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post(url, uploadModel)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                self.failureProxyCallback('SavePurchaseOrderUploadFileModel', arg);
                failCallBack();
            });
    }

    //Deletes the selected Sales Order POD Document
    public deletePodDoc(documentId: number, successCallBack: Function, failCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/DeletePurchaseOrderFile/?documentId=' + documentId;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post(url, documentId)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                self.failureProxyCallback('DeletePurchaseOrderFile', arg);
                failCallBack();
            });
    }

    //Updates the selected Sales Order POD Document
    public updatePodDoc(uploadModel: any, successCallBack: Function, failCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/UpdatePurchaseOrderFile';

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post(url, uploadModel)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                self.failureProxyCallback('UpdatePurchaseOrderFile', arg);
                failCallBack();
            });
    }

    // gets the model after uploading the file
    public getPurchaseOrderPodDocDetails(salesOrderUploadFileModel: any, successCallBack: Function, failCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/GetPurchaseOrderPodDocDetails';

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post(url, salesOrderUploadFileModel)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                self.failureProxyCallback('GetPurchaseOrderPodDocDetails', arg);
                failCallBack();
            });
    }

    // gets the Foreign Bol Customers
    public getForeignBolCustomers(searchModel: any, successCallBack: Function, failCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/GetForeignBolCustomerList';

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post(url, searchModel)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                self.failureProxyCallback('getForeignBolCustomers', arg);
                failCallBack();
            });
    }

    public getForeignBolCustomerSettings(searchModel: any, successCallBack: Function, failCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/GetForeignBolCustomerDetails';

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post(url, searchModel)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                self.failureProxyCallback('getForeignBolCustomerSettings', arg);
                failCallBack();
            });
    }

    public addForeignBolCustomer(customerId: number, successCallBack: Function, faliureCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/AddForeignBolCustomer/?customerId=' + customerId;

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.get(url)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                faliureCallBack();
                self.failureProxyCallback('addForeignBolCustomer', arg);
            });
    }

    public deleteforeignBolAddress(id: number, successCallBack: Function, faliureCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/DeleteForeignBolCustomerAddress/?id=' + id;

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.get(url)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                faliureCallBack();
                self.failureProxyCallback('deleteforeignBolAddress', arg);
            });
    }

    public saveForeignBolCustomerAddress(foreignBolCustomerAddress: any, successCallBack: Function, failCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/SaveForeignBolCustomerAddress';

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post(url, foreignBolCustomerAddress)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                self.failureProxyCallback('saveForeignBolCustomerAddress', arg);
                failCallBack(arg);
            });
    }

    public saveForeignBolCustomerSettings(foreignBolCustomerSettings: any, successCallBack: Function, failCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/SaveForeignBolCustomerSettings';

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post(url, foreignBolCustomerSettings)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                self.failureProxyCallback('saveForeignBolCustomerSettings', arg);
                failCallBack(arg);
            });
    }

    public deleteForeignBolCustomer(customerId: number, successCallBack: Function, faliureCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/DeleteForeignBolCustomer/?customerId=' + customerId;

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.get(url)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                faliureCallBack();
                self.failureProxyCallback('deleteforeignBolAddress', arg);
            });
    }

    //Unmaps the address
    public unmapShipperAddress(addressId: number, successCallBack: Function, failCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/UnmapPurchaseOrderAddress/?addressId=' + addressId;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post(url, addressId)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                self.failureProxyCallback('unmapShipperAddress', arg);
                failCallBack();
            });
    }

    //Unmaps the address
    public unmapConsigneeAddress(addressId: number, successCallBack: Function, failCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/UnmapPurchaseOrderAddress/?addressId=' + addressId;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post(url, addressId)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                self.failureProxyCallback('unmapConsigneeAddress', arg);
                failCallBack();
            });
    }

    //Unmaps the address
    public unmapBillToAddress(addressId: number, successCallBack: Function, failCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/UnmapPurchaseOrderAddress/?addressId=' + addressId;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post(url, addressId)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                self.failureProxyCallback('unmapBillToAddress', arg);
                failCallBack();
            });
    }

    public SaveForeignBolCustomerAddressFromPurchaseOrder(foreignBolCustomerAddress: any, successCallBack: Function, failCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/SaveForeignBolCustomerAddressFromPurchaseOrder';

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post(url, foreignBolCustomerAddress)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                self.failureProxyCallback('SaveForeignBolCustomerAddressFromPurchaseOrder', arg);
                failCallBack(arg);
            });
    }

	public sendForeignBolAgentMail(foreignBolAgentEmailData: IForeignBolEmail, successCallback: Function, failureCallback: Function, failCallBackInfo: Function) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        return ajax.post('Accounting/SendForeignBolAgentMail', foreignBolAgentEmailData)
            .done((data) => {
				//// ###START: US21619
				if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
					successCallback(data.Response);
				}
				// ###START: US22471
				else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSentFailedCode) {
					failureCallback(data.StatusModel.Description);
				}
				else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSettingNotFoundCode) {
					failCallBackInfo(data.StatusModel.Description);
				}
				// ###END: US22471
				else {
					failureCallback(data.StatusModel.Description);
				}
				//// ###END: US21619
            })
            .fail((arg) => {
                failureCallback(arg);
                self.failureProxyCallback('sendEmail', arg);
            });
    }

    public proceedToSoCreation(poToSoResults: any, successCallBack: Function, failCallBack: Function) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        return ajax.post('Accounting/ProceedToSoCreation', poToSoResults)
            .done((data) => {
				//// ###START: US21619
				if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
					successCallBack(data.Response);
				}
				else {
					failCallBack(data.StatusModel.Description);
				}
				//// ###END: US21619
            })
            .fail((arg) => {
                failCallBack(arg);
                self.failureProxyCallback('proceedToSoCreation', arg);
            });
    }

    public AssociateForeignBolCustomerWithUVB(vendorBillId: number, customerId: number, successCallBack: Function, faliureCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/AssociateForeignBolCustomerWithUVB/?vendorBillId=' + vendorBillId + '&customerId=' + customerId;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.get(url)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                faliureCallBack();
                self.failureProxyCallback('AssociateForeignBolCustomerWithUVB', arg);
            });
    }

    //// to get the count of worked today, created today and total number in Rexnord Board
    public getHeaderCountDataInRexnordBoard(successCallBack: Function, failureCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/GetHeaderCountDataInRexnordBoard';
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.get(url)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                failureCallBack();
                self.failureProxyCallback('getHeaderCountDataInRexnordBoard', arg);
            });
    }

	//to get the total list of reason codes
	public getReasonCodeList(successCallBack: Function, failureCallBack: Function) {
		var self = this;
		var url: string = 'Accounting/GetAllUVBReasonCodes';
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				failureCallBack();
			});
	}

	public saveUVBReasonCodeForUVB(vendorBillId, reasonCodeId, userId, notes, successCallBack, faliureCallBack) {
		var self = this;
		var url: string = 'Accounting/SaveReasonCodeForUVB/?vendorBillId=' + vendorBillId + '&reasonCodeId=' + reasonCodeId + '&userId=' + userId + '&notes=' + notes;
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				faliureCallBack();
			});
	}

	/// <summary>
	/// Checks if the Carrier is present in TruckLoad.Carriers table.
	/// </summary>
	/// <param name="carrierId">carrierId</param>
	/// <returns>boolean</returns>
	/// <createDetails>
	/// <id>US22796</id> <by>Baldev Singh Thakur</by> <date>23-06-2016</date> <description>This method is used to check if the carrier exists in TruckLoad.Carriers</description>
	/// </createDetails>
	public checkIfCarrierExistsInTL(carrierId: number, successCallBack: Function, faliureCallBack: Function) {
		var self = this;
		var url: string = 'Accounting/CheckIfCarrierExistsInTL/?carrierId=' + carrierId;

		if (carrierId <= 0)
			return;

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				faliureCallBack();
				self.failureProxyCallback('checkIfCarrierExistsInTL', arg);
			});
	}
}

export class SearchModel {
    SearchValue: string;
    PageSize: number;
    PageNumber: number;
    CustomerId: number;
    AgencyId: number;
    UserId: number;
    SortOrder: string;
    SortCol: string;
    constructor(searchValue: string, sortOrder: string, sortCol: string, PageNumber?: number, PageSize?: number) {
        this.SearchValue = searchValue;
        this.PageNumber = PageNumber;
        this.PageSize = PageSize;
        this.SortCol = sortCol;
        this.SortOrder = sortOrder;
    }
}