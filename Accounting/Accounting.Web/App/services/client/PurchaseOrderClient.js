/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created : July 11, 2014
** Created By Achal Rastogi
*/
define(["require", "exports", 'services/models/purchaseOrder/SearchAgencyName', 'services/models/common/searchUserName', 'services/models/common/searchCustomerName', 'durandal/system', 'durandal/app'], function(require, exports, __refAgencyNameSearch__, __refAgentNameSearch__, __refCustomerNameSearch__, __refSystem__, ___app__) {
    
    
    var refAgencyNameSearch = __refAgencyNameSearch__;
    var refAgentNameSearch = __refAgentNameSearch__;
    var refCustomerNameSearch = __refCustomerNameSearch__;
    var refSystem = __refSystem__;
    var _app = ___app__;

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
    var PurchaseOrderClient = (function () {
        function PurchaseOrderClient() {
        }
        //#region Public Methods
        //for quick search
        PurchaseOrderClient.prototype.quickSearchPurchaseOrder = function (purchaseOrderSearch, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetPurchaseOrderQuickSearchResult';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, purchaseOrderSearch).done(function (data) {
                //var result: any = data;
                //var newItems = ko.utils.arrayMap(result, function (item) {
                //	return new refPurchaseOrderSearchResult.Models.PurchaseOrderSearchResult(item);
                //});
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('quickSearchPurchaseOrder', arg);
                faliureCallBack();
            });
        };

        //#region Load Purchase order details
        // get POP Details
        PurchaseOrderClient.prototype.getPOPDetails = function (vendorBillId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetPurchaseOrderPossibilityDetails/?vendorBillId=' + vendorBillId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('getShipmentRelatedLinks', arg);
            });
        };

        //## Service to Move the purchase order to rexnord board. #/
        PurchaseOrderClient.prototype.moveFromVolumeCustomerBills = function (vendorBillIds, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/MoveToRexnodCustormerBills", vendorBillIds).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('MoveFromVolumeCustomerBills', message);
            });
        };

        //## get Rexnord Mapped Companies List
        PurchaseOrderClient.prototype.getRexnordMappedCompanies = function (successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetVolumeCustomerBillsIdentificationMapping';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('GetVolumeCustomerBillsIdentificationMapping', arg);
            });
        };

        //## Service to add/modify/delete rexnord mapped companies. #/
        PurchaseOrderClient.prototype.insertUpdateOrDeleteVolumeCustomerBillsIdentificationMapping = function (companyList, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/InsertUpdateOrDeleteVolumeCustomerBillsIdentificationMapping", companyList).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('InsertUpdateOrDeleteVolumeCustomerBillsIdentificationMapping', message);
            });
        };

        //#endregion
        // To send Email
        PurchaseOrderClient.prototype.sendAgentEmail = function (purchaseOrderEmailData, successCallback, failureCallback) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            return ajax.post('Accounting/SendAgentMail', purchaseOrderEmailData).done(function (data) {
                if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successCallback(data.Respone);
                } else {
                    failureCallback(data.StatusModel.Description);
                }
                // ###END: US22471
            }).fail(function (arg) {
                failureCallback(arg);
                self.failureProxyCallback('sendEmail', arg);
            });
        };

        //## Service to get all purchase orders list. #/
        PurchaseOrderClient.prototype.getPurchaseOrdersRexnordDetails = function (searchFilter, successCallBack, faliureCallBack, PagingData) {
            var self = this;
            var url = 'Accounting/GetPurchaseOrdersRexnordBoardDetails';
            var _searchValue = new SearchModel('', '', '', PagingData.currentPage(), PagingData.pageSize());
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, searchFilter).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('GetPurchaseOrdersRexnordBoardDetails', arg);
            });
        };

        //## Service to Move the  rexnord board to purchase order#/
        PurchaseOrderClient.prototype.moveFromRexnordVolumeCustomerBills = function (vendorBillIds, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/MoveToGlobalTranzCustormerBills", vendorBillIds).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('moveFromRexnordVolumeCustomerBills', message);
            });
        };

        // Service to get Agency Names
        PurchaseOrderClient.prototype.searchAgencyDetails = function (startValue, successCallBack) {
            var self = this;
            var url = "Accounting/GetAgencyDetails";

            var _searchValue = new SearchModel(startValue, '', '');
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, _searchValue).done(function (data) {
                var result = data;
                var newItems = ko.utils.arrayMap(result, function (item) {
                    return new refAgencyNameSearch.Models.AgencyNameSearch(item);
                });
                successCallBack(newItems);
            }).fail(function (arg) {
                self.failureProxyCallback('searchAgencyName', arg);
            });
        };

        // Service to get Agency Names
        PurchaseOrderClient.prototype.searchAgentDetailsByAgencyId = function (startValue, agencyId, successCallBack) {
            var self = this;
            var url = "Accounting/GetAgentDetailsByAgencyId";

            var _searchValue = new SearchModel(startValue, '', '');
            _searchValue.AgencyId = agencyId;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, _searchValue).done(function (data) {
                var result = data;
                var newItems = ko.utils.arrayMap(result, function (item) {
                    return new refAgentNameSearch.Models.UserNameSearch(item);
                });
                successCallBack(newItems);
            }).fail(function (arg) {
                self.failureProxyCallback('searchAgentDetailsByAgencyId', arg);
            });
        };

        // Service to get Customers Names
        PurchaseOrderClient.prototype.searchCustomerDetailsByUserId = function (startValue, userId, successCallBack) {
            var self = this;
            var url = "Accounting/GetCustomerDetailsByUserId";

            var _searchValue = new SearchModel(startValue, '', '');
            _searchValue.UserId = userId;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, _searchValue).done(function (data) {
                var result = data;
                var newItems = ko.utils.arrayMap(result, function (item) {
                    return new refCustomerNameSearch.Models.CustomerNameSearch(item);
                });
                successCallBack(newItems);
            }).fail(function (arg) {
                self.failureProxyCallback('searchCustomerDetailsByUserId', arg);
            });
        };

        // To Get customer Financial Details
        PurchaseOrderClient.prototype.getCustomerFinancialDetailsByCustomerId = function (customerId, successCallBack, faliureCallBack) {
            var self = this;
            var url = "Accounting/GetCustomerFinancialDetails/?customerId=" + customerId;
            if (customerId > 0) {
                var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
                ajax.get(url).done(function (data) {
                    successCallBack(data);
                }).fail(function (arg) {
                    self.failureProxyCallback('getCustomerFinancialDetailsByCustomerId', arg);
                });
            }
        };

        // Call for PO To SO creation
        PurchaseOrderClient.prototype.createPurchaseOrderToSalesOrder = function (poToSoContainer, successCallBack, faliureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            return ajax.post('Accounting/CreatePurchaseOrderToSalesOrder', poToSoContainer).done(function (data) {
                if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successCallBack(data.Response);
                } else {
                    faliureCallBack(data.StatusModel.Description);
                }
                //// ###END: US21619
            }).fail(function (arg) {
                faliureCallBack(arg);
                self.failureProxyCallback('createPurchaseOrderToSalesOrder', arg);
            });
        };

        // Call for PO To SO creation
        PurchaseOrderClient.prototype.rateItManually = function (poToSoContainer, successCallBack, faliureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            return ajax.post('Accounting/RateItManually', poToSoContainer).done(function (data) {
                if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successCallBack(data.Response);
                } else {
                    faliureCallBack(data.StatusModel.Description);
                }
                //// ###END: US21619
            }).fail(function (arg) {
                faliureCallBack(arg);
                self.failureProxyCallback('RateItManually', arg);
            });
        };

        PurchaseOrderClient.prototype.DeleteForeignCustomerDetails = function (vendorBillId, isDeleteAddress, successcallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            return ajax.get('Accounting/DeleteForeignCustomerDetails/?vendorBillId=' + vendorBillId + '&isDeleteAddress=' + isDeleteAddress).done(function (data) {
                successcallBack(data);
            }).fail(function (arg) {
                failureCallBack(arg);
                self.failureProxyCallback('DeleteForeignCustomerDetails', arg);
            });
        };

        PurchaseOrderClient.prototype.DeactivateAgentNotificationForVendorBill = function (vendorBillId, resumeTime, successcallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            return ajax.get('Accounting/DeactivateAgentNotificationForVendorBill/?vendorBillId=' + vendorBillId + '&resumeTime=' + resumeTime).done(function (data) {
                successcallBack(data);
            }).fail(function (arg) {
                failureCallBack(arg);
                self.failureProxyCallback('DeactivateAgentNotificationForVendorBill', arg);
            });
        };

        PurchaseOrderClient.prototype.SendAgentNotificationOnStopTimer = function (customerId, vendorBillId, successcallBack, failureCallBack, failCallBackInfo) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            return ajax.get('Accounting/SendRevertNotificationForAgentOnStopTimer/?customerId=' + customerId + '&vendorBillId=' + vendorBillId).done(function (data) {
                if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successcallBack(data.Response);
                } else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSentFailedCode) {
                    failureCallBack(data.StatusModel.Description);
                } else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSettingNotFoundCode) {
                    failCallBackInfo(data.StatusModel.Description);
                }
                // ###END: US22471
            }).fail(function (arg) {
                failureCallBack(arg);
                self.failureProxyCallback('SendAgentNotificationOnStopTimer', arg);
            });
        };

        PurchaseOrderClient.prototype.UpdateForeignBolCustomerOfUVB = function (vendorBillId, newCustomerId, oldCustomerId, isDeleteAddress, successcallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            return ajax.get('Accounting/UpdateForeignBolCustomerOfUVB/?vendorBillId=' + vendorBillId + '&newCustomerId=' + newCustomerId + '&oldCustomerId=' + oldCustomerId + '&isDeleteAddress=' + isDeleteAddress).done(function (data) {
                successcallBack(data);
            }).fail(function (arg) {
                failureCallBack(arg);
                self.failureProxyCallback('UpdateForeignBolCustomerOfUVB', arg);
            });
        };

        PurchaseOrderClient.prototype.SendRevertNotificationForAgentOnCustomerChange = function (vendorBillId, customerId, successcallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            return ajax.get('Accounting/SendRevertNotificationForAgentOnCustomerChange/?customerId=' + customerId + '&vendorBillId=' + vendorBillId).done(function (data) {
                successcallBack(data);
            }).fail(function (arg) {
                failureCallBack(arg);
                self.failureProxyCallback('SendRevertNotificationForAgentOnCustomerChange', arg);
            });
        };

        PurchaseOrderClient.prototype.ResumeForeignBolTimer = function (vendorBillId, customerId, successcallBack, failureCallBack, failCallBackInfo) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            return ajax.get('Accounting/ResumeForeignBolTimer/?customerId=' + customerId + '&vendorBillId=' + vendorBillId).done(function (data) {
                if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successcallBack(data.Response);
                } else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSentFailedCode) {
                    failureCallBack(data.StatusModel.Description);
                } else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSettingNotFoundCode) {
                    failCallBackInfo(data.StatusModel.Description);
                }
                // ###END: US22471
            }).fail(function (arg) {
                failureCallBack(arg);
                self.failureProxyCallback('ResumeForeignBolTimer', arg);
            });
        };

        //#endregion
        //#region Private Methods
        // For Log the Error record
        PurchaseOrderClient.prototype.failureProxyCallback = function (context, error) {
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

        // For PoPossiblity Search
        PurchaseOrderClient.prototype.getPoPossibilitySearchResponse = function (searchRequest, successCallBack, faliureCallBack) {
            var self = this;
            var url = "Accounting/GetPoPossibilitySearchResponse";

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, searchRequest).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('GetPoPossibilitySearchResponse', arg);
            });
        };

        //#region Save vendor Bill
        PurchaseOrderClient.prototype.SavePOPossibilityDetail = function (poPossibilitySaveDetails, successCallBack, failureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/SavePOPossibilityDetail", poPossibilitySaveDetails).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('SavePOPossibilityDetail', message);
            });
        };

        //#endregion
        // Get the purchase Order details by vendor bill id
        PurchaseOrderClient.prototype.getPurchaseOrderDetailsByVendorBillId = function (vendorBillId, successCallBack, faliureCallBack, isSubBill) {
            if (typeof isSubBill === "undefined") { isSubBill = false; }
            var self = this;
            var url = 'Accounting/GetPurchaseOrderDetailsByVendorBillId/?vendorBillId=' + vendorBillId + '&isSubBill=' + isSubBill;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('GetPurchaseOrderDetailsByVendorBillId', arg);
            });
        };

        // gets the model after uploading the file
        PurchaseOrderClient.prototype.uploadAndGetUploadedResponse = function (uploadModel, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/SavePurchaseOrderUploadFileModel';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, uploadModel).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('SavePurchaseOrderUploadFileModel', arg);
                failCallBack();
            });
        };

        //Deletes the selected Sales Order POD Document
        PurchaseOrderClient.prototype.deletePodDoc = function (documentId, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/DeletePurchaseOrderFile/?documentId=' + documentId;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, documentId).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('DeletePurchaseOrderFile', arg);
                failCallBack();
            });
        };

        //Updates the selected Sales Order POD Document
        PurchaseOrderClient.prototype.updatePodDoc = function (uploadModel, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/UpdatePurchaseOrderFile';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, uploadModel).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('UpdatePurchaseOrderFile', arg);
                failCallBack();
            });
        };

        // gets the model after uploading the file
        PurchaseOrderClient.prototype.getPurchaseOrderPodDocDetails = function (salesOrderUploadFileModel, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/GetPurchaseOrderPodDocDetails';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, salesOrderUploadFileModel).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetPurchaseOrderPodDocDetails', arg);
                failCallBack();
            });
        };

        // gets the Foreign Bol Customers
        PurchaseOrderClient.prototype.getForeignBolCustomers = function (searchModel, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/GetForeignBolCustomerList';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, searchModel).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('getForeignBolCustomers', arg);
                failCallBack();
            });
        };

        PurchaseOrderClient.prototype.getForeignBolCustomerSettings = function (searchModel, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/GetForeignBolCustomerDetails';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, searchModel).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('getForeignBolCustomerSettings', arg);
                failCallBack();
            });
        };

        PurchaseOrderClient.prototype.addForeignBolCustomer = function (customerId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/AddForeignBolCustomer/?customerId=' + customerId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('addForeignBolCustomer', arg);
            });
        };

        PurchaseOrderClient.prototype.deleteforeignBolAddress = function (id, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/DeleteForeignBolCustomerAddress/?id=' + id;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('deleteforeignBolAddress', arg);
            });
        };

        PurchaseOrderClient.prototype.saveForeignBolCustomerAddress = function (foreignBolCustomerAddress, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/SaveForeignBolCustomerAddress';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, foreignBolCustomerAddress).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('saveForeignBolCustomerAddress', arg);
                failCallBack(arg);
            });
        };

        PurchaseOrderClient.prototype.saveForeignBolCustomerSettings = function (foreignBolCustomerSettings, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/SaveForeignBolCustomerSettings';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, foreignBolCustomerSettings).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('saveForeignBolCustomerSettings', arg);
                failCallBack(arg);
            });
        };

        PurchaseOrderClient.prototype.deleteForeignBolCustomer = function (customerId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/DeleteForeignBolCustomer/?customerId=' + customerId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('deleteforeignBolAddress', arg);
            });
        };

        //Unmaps the address
        PurchaseOrderClient.prototype.unmapShipperAddress = function (addressId, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/UnmapPurchaseOrderAddress/?addressId=' + addressId;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, addressId).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('unmapShipperAddress', arg);
                failCallBack();
            });
        };

        //Unmaps the address
        PurchaseOrderClient.prototype.unmapConsigneeAddress = function (addressId, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/UnmapPurchaseOrderAddress/?addressId=' + addressId;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, addressId).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('unmapConsigneeAddress', arg);
                failCallBack();
            });
        };

        //Unmaps the address
        PurchaseOrderClient.prototype.unmapBillToAddress = function (addressId, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/UnmapPurchaseOrderAddress/?addressId=' + addressId;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, addressId).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('unmapBillToAddress', arg);
                failCallBack();
            });
        };

        PurchaseOrderClient.prototype.SaveForeignBolCustomerAddressFromPurchaseOrder = function (foreignBolCustomerAddress, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/SaveForeignBolCustomerAddressFromPurchaseOrder';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, foreignBolCustomerAddress).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('SaveForeignBolCustomerAddressFromPurchaseOrder', arg);
                failCallBack(arg);
            });
        };

        PurchaseOrderClient.prototype.sendForeignBolAgentMail = function (foreignBolAgentEmailData, successCallback, failureCallback, failCallBackInfo) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            return ajax.post('Accounting/SendForeignBolAgentMail', foreignBolAgentEmailData).done(function (data) {
                if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successCallback(data.Response);
                } else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSentFailedCode) {
                    failureCallback(data.StatusModel.Description);
                } else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSettingNotFoundCode) {
                    failCallBackInfo(data.StatusModel.Description);
                } else {
                    failureCallback(data.StatusModel.Description);
                }
                //// ###END: US21619
            }).fail(function (arg) {
                failureCallback(arg);
                self.failureProxyCallback('sendEmail', arg);
            });
        };

        PurchaseOrderClient.prototype.proceedToSoCreation = function (poToSoResults, successCallBack, failCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            return ajax.post('Accounting/ProceedToSoCreation', poToSoResults).done(function (data) {
                if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successCallBack(data.Response);
                } else {
                    failCallBack(data.StatusModel.Description);
                }
                //// ###END: US21619
            }).fail(function (arg) {
                failCallBack(arg);
                self.failureProxyCallback('proceedToSoCreation', arg);
            });
        };

        PurchaseOrderClient.prototype.AssociateForeignBolCustomerWithUVB = function (vendorBillId, customerId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/AssociateForeignBolCustomerWithUVB/?vendorBillId=' + vendorBillId + '&customerId=' + customerId;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('AssociateForeignBolCustomerWithUVB', arg);
            });
        };

        //// to get the count of worked today, created today and total number in Rexnord Board
        PurchaseOrderClient.prototype.getHeaderCountDataInRexnordBoard = function (successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/GetHeaderCountDataInRexnordBoard';
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                failureCallBack();
                self.failureProxyCallback('getHeaderCountDataInRexnordBoard', arg);
            });
        };

        //to get the total list of reason codes
        PurchaseOrderClient.prototype.getReasonCodeList = function (successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/GetAllUVBReasonCodes';
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                failureCallBack();
            });
        };

        PurchaseOrderClient.prototype.saveUVBReasonCodeForUVB = function (vendorBillId, reasonCodeId, userId, notes, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/SaveReasonCodeForUVB/?vendorBillId=' + vendorBillId + '&reasonCodeId=' + reasonCodeId + '&userId=' + userId + '&notes=' + notes;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
            });
        };

        /// <summary>
        /// Checks if the Carrier is present in TruckLoad.Carriers table.
        /// </summary>
        /// <param name="carrierId">carrierId</param>
        /// <returns>boolean</returns>
        /// <createDetails>
        /// <id>US22796</id> <by>Baldev Singh Thakur</by> <date>23-06-2016</date> <description>This method is used to check if the carrier exists in TruckLoad.Carriers</description>
        /// </createDetails>
        PurchaseOrderClient.prototype.checkIfCarrierExistsInTL = function (carrierId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/CheckIfCarrierExistsInTL/?carrierId=' + carrierId;

            if (carrierId <= 0)
                return;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('checkIfCarrierExistsInTL', arg);
            });
        };
        return PurchaseOrderClient;
    })();
    exports.PurchaseOrderClient = PurchaseOrderClient;

    var SearchModel = (function () {
        function SearchModel(searchValue, sortOrder, sortCol, PageNumber, PageSize) {
            this.SearchValue = searchValue;
            this.PageNumber = PageNumber;
            this.PageSize = PageSize;
            this.SortCol = sortCol;
            this.SortOrder = sortOrder;
        }
        return SearchModel;
    })();
    exports.SearchModel = SearchModel;
});
