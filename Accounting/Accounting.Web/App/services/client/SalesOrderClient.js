/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'services/models/salesOrder/SalesOrderSearchResult', 'durandal/system', 'durandal/app', 'services/models/salesOrder/SearchOceanCarrierDetail', 'services/models/salesOrder/SearchCompanyName', 'services/models/salesOrder/SalesOrderAddress'], function(require, exports, __refSalesOrderSearchRes__, __refSystem__, ___app__, __refSearchOceanCarrier__, __refSearchCompanyName__, __refSearchSalesOrderAddress__) {
    /* File Created : August 26, 2014
    ** Created By Bhanu pratap
    */
    //#region References
    /// <reference path="../../../Scripts/TypeDefs/jquery.d.ts" />
    /// <reference path="../../../Scripts/TypeDefs/durandal.d.ts" />
    /// <reference path="../../../Scripts/TypeDefs/Simplex.d.ts" />
    /// <reference path="../../../Scripts/TypeDefs/toastr.d.ts" />
    /// <reference path="../../../Scripts/TypeDefs/utils.d.ts" />
    /// <reference path="../models/salesOrder/SearchTerminalCompany.ts" />
    /// <reference path="../models/TypeDefs/SalesOrderModels.d.ts" />
    /// <reference path="../../../Scripts/Constants/ApplicationConstants.ts" />
    //#endregion
    //#region Import
    var refSalesOrderSearchRes = __refSalesOrderSearchRes__;
    var refSystem = __refSystem__;
    var _app = ___app__;
    var refSearchOceanCarrier = __refSearchOceanCarrier__;
    var refSearchCompanyName = __refSearchCompanyName__;
    
    var refSearchSalesOrderAddress = __refSearchSalesOrderAddress__;

    //#endregion
    var PaginationObject = (function () {
        function PaginationObject(totalcount, range) {
            this.TotalCount = totalcount;
            this.range = range;
        }
        return PaginationObject;
    })();
    exports.PaginationObject = PaginationObject;

    /*
    ** <summary>
    ** All calls to Atlas from Sales Order Model.
    ** </summary>
    ** <createDetails>
    ** <id>USXXXX</id> <by>Bhanu Pratap</by> <date>26-08-2014</date>
    ** </createDetails>
    ** <changeHistory>
    ** <id>DE20779</id> <by>Baldev Singh Thakur</by> <date>20-11-2015</date>
    ** <id>US19882</id> <by>Shreesha Adiga</by> <date>23-12-2015</date> <description>Added methods to save the uploaded records</description>
    ** <id>US20288</id> <by>Shreesha Adiga</by> <date>14-01-2016</date> <description>Added GetCreditMemoDetails </description>
    ** <id>US20961</id> <by>Shreesha Adiga</by> <date>08-03-2016</date> <description>Added SaveDisputeStatusFromSalesOrder </description>
    ** <id>US21133</id> <by>Baldev Singh Thakur</by> <date>31-03-2016</date> <description>MAS Tab</description>
    ** <id>DE22412</id> <by>Shreesha Adiga</by> <date>13-04-2016</date> <description>Added GetSalesOrderNotes</description>
    ** <id>DE23006</id> <by>Shreesha Adiga</by> <date>31-05-2016</date><description>Changes related to spinner; Call the failure funcation in "else if"</description>
    ** <id>US22538</id> <by>Janakiram</by> <date>08-06-2016</date><description>Added Response model for Validate error Logs in Sales OrderDetail, Revenue Adjustment and SO Creation</description>
    ** <id>US22471</id> <by>Vasanthakumar</by> <date>03-06-2016</date> <description>Add Success Toastr message for Emails triggered by users</description>
    ** <id>US22955</id> <by>Shreesha Adiga</by> <date>30-06-2016</date> <description>Removed multiple parameters from cancelsalesorder and aded a model parameter</description>
    ** <id>US24389</id> <by>Shreesha Adiga</by> <date>31-08-2016</date><description>Added GetTruckloadAccessorials</description>
    ** <id>US24632</id> <by>Baldev Singh Thakur</by> <date>12-09-2016</date> <description>Modified the logic to reload the order, if it has already been modified.</description>
    ** <id>US24865</id> <by>Shreesha Adiga</by> <date>22-09-2016</date><description>Added GetAllDisputeEmailTemplates</description>
    ** <id>US24871</id> <by>Janakiram</by> <date>27-09-2016</date>	<description>Implement Mail Sendig Functionality</description>
    ** <id>US25277</id> <by>Baldev Singh Thakur</by> <date>19-10-2016</date> <description>Added a new server call for fetching Credit Reasons.</description>
    ** <id>US25315</id> <by>Janakiram</by> <date>26-10-2016</date> <description>Code Clean up.</description>
    ** <id>US25153</id> <by>Shreesha Adiga</by> <date>20-10-2016</date><description>Added GetItemsNotIntegratedWithMas</description>
    ** <id>US25684</id> <by>Shreesha Adiga</by> <date>23-11-2016</date><description>Added GetSubordersAndRevenuesByBOLNumber</description>
    ** <id>US26027</id> <by>Janakiram</by> <date>14-12-2016</date><description>Added Rejected Credit Memo Process</description>
    ** <id>US25942</id> <by>Janakiram</by> <date>21-12-2016</date><description>Added to fetch SO Revenue for Credit Memo Process</description>
    ** <id>US26365</id> <by>Vasanthakumar</by> <date>12-01-2017</date><description>Added else part for handling failure case</description>
    ** <id>US26559</id> <by>Vasanthakumar</by> <date>02-02-2017</date> <description>Added method to fetch invoiced SO except credit memo sub order for dispute won credit memo popup</description>
    ** <id>DE25727</id> <by>Vasanthakumar</by> <date>27-01-2017</date><description>If invoice key is not present, the toastr is shown in Red color</description>
    ** <id>US26695</id> <by>Vasanthakumar</by> <date>30-01-2017</date><description>Concurrent handling failure case for reject credit request.</description>
    ** <id>US27159</id> <by>Baldev Singh Thakur</by> <date>24-02-2017</date><description>Added a condition for information type.</description>
    ** <id>US26377</id> <by>Baldev Singh Thakur</by> <date>02-03-2017</date> <description>Added method for checking if Cancel So credit reason should be displayed while raising credit request.</description>
    ** <id>US26377</id> <by>Vasanthakumar</by> <date>03-03-2017</date> <description>Added else logic for RequestCreditMemo.</description>
    ** </changeHistory>
    */
    var SalesOrderClient = (function () {
        function SalesOrderClient() {
        }
        //#region Public Methods
        // Get the sales order list
        SalesOrderClient.prototype.quickSearchSalesOrder = function (salesOrderQuickSearchParameter, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetSalesOrderQuickSearchResult';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, salesOrderQuickSearchParameter).done(function (data) {
                var newItems = ko.utils.arrayMap(data.SalesOrderSearchResults, function (item) {
                    return new refSalesOrderSearchRes.Models.SalesOrderSearchResult(item);
                });

                var newObj = new PaginationObject(data.NumberOfRows, newItems);
                successCallBack(newObj);
            }).fail(function (arg) {
                self.failureProxyCallback('quickSearchSalesOreder', arg);
                faliureCallBack();
            });
        };

        //Gets the Address Book based on customer Id
        SalesOrderClient.prototype.getCustomerDefaultBillingAddress = function (customerId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetCustomerDefaultBillingAddress/?customerId=' + customerId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetCustomerDefaultBillingAddress', arg);
                faliureCallBack();
            });
        };

        // get the shiv via list
        SalesOrderClient.prototype.getSalesOrderShipViaList = function (successCallBack) {
            var self = this;
            var url = 'Accounting/GetSalesOrderShipViaList';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetSalesOrderShipViaList', arg);
            });
        };

        // get the order status list}
        SalesOrderClient.prototype.getSalesOrderStatusForEntry = function (successCallBack) {
            var self = this;
            var url = 'Accounting/GetSalesOrderStatusForEntry';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('getSalesOrderStatusForEntry', arg);
            });
        };

        // get the order status list
        SalesOrderClient.prototype.getSalesOrderInvoiceStatusList = function (successCallBack) {
            var self = this;
            var url = 'Accounting/GetSalesOrderInvoiceStatusList';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetSalesOrderInvoiceStatusList', arg);
            });
        };

        // Get Sales Order Details By SalesOrderId
        SalesOrderClient.prototype.getSalesOrderDetailsBySalesOrderId = function (salesOrderId, successCallBack, faliureCallBack, isSuborder) {
            if (typeof isSuborder === "undefined") { isSuborder = false; }
            var self = this;
            var url = 'Accounting/GetSalesOrderDetailsBySalesOrderId/?salesOrderId=' + salesOrderId + '&isSuborder=' + isSuborder;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetSalesOrderDetailsBySalesOrderId', arg);
                faliureCallBack();
            });
        };

        // Get Sales Order Details By SalesOrderId
        SalesOrderClient.prototype.getSalesOrderFinancialDetailsBySalesOrderId = function (salesOrderId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetSalesOrderFinancialDetailsBySalesOrderId/?salesOrderId=' + salesOrderId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('getSalesOrderFinancialDetailsBySalesOrderId', arg);
                faliureCallBack();
            });
        };

        // get the carrier service type list
        SalesOrderClient.prototype.getSalesOrderCarrierServiceTypeList = function (successCallBack) {
            var self = this;
            var url = 'Accounting/GetSalesOrderCarrierServiceTypeList';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetSalesOrderCarrierServiceTypeList', arg);
            });
        };

        // gets the model after uploading the file
        SalesOrderClient.prototype.uploadAndGetUploadedResponse = function (uploadModel, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/SaveSalesOrderUploadFileModel';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, uploadModel).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('quickSearchSalesOreder', arg);
                failCallBack();
            });
        };

        //Deletes the selected Sales Order POD Document
        SalesOrderClient.prototype.deletePodDoc = function (documentId, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/DeleteSalesOrderFile/?documentId=' + documentId;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, documentId).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('DeleteSalesOrderFile', arg);
                failCallBack();
            });
        };

        //Updates the selected Sales Order POD Document
        SalesOrderClient.prototype.updatePodDoc = function (uploadModel, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/UpdateSalesOrderFile';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, uploadModel).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('UpdateSalesOrderFile', arg);
                failCallBack();
            });
        };

        // gets the model after uploading the file
        SalesOrderClient.prototype.getSalesOrderPodDocDetails = function (salesOrderUploadFileModel, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/GetSalesOrderPodDocDetails';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, salesOrderUploadFileModel).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetSalesOrderPodDocDetails', arg);
                failCallBack();
            });
        };

        SalesOrderClient.prototype.SaveSystemHistory = function (salesOrderContainer, successCallBack, faliureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/SaveSystemHistory", salesOrderContainer).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                faliureCallBack(message);
                self.failureProxyCallback('SaveSystemHistory', message);
            });
        };

        // gets the Ocean Carrier Details
        SalesOrderClient.prototype.searchOceanCarrierDetails = function (startValue, successCallBack) {
            var self = this;
            var url = "Accounting/GetCarrierDetailsByCustomerId";

            var _searchValue = new SearchModel(startValue);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, _searchValue).done(function (data) {
                var result = data;
                var newItems = ko.utils.arrayMap(result, function (item) {
                    return new refSearchOceanCarrier.Models.SearchOceanCarrier(item);
                });
                successCallBack(newItems);
            }).fail(function (arg) {
                self.failureProxyCallback('searchOceanCarrierDetails', arg);
            });
        };

        // gets the Ocean Carrier Details
        SalesOrderClient.prototype.searchCompanyName = function (searchTerminalCompanyModel, successCallBack) {
            var self = this;
            var url = "Accounting/GetTerminalCompanyDetails";
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, searchTerminalCompanyModel).done(function (data) {
                var result = data;
                var newItems = ko.utils.arrayMap(result, function (item) {
                    return new refSearchCompanyName.Models.SearchCompanyName(item);
                });
                successCallBack(result);
            }).fail(function (arg) {
                self.failureProxyCallback('searchCompanyName', arg);
            });
        };

        //Gets the Sales Order Claim
        SalesOrderClient.prototype.getSalesOrderClaim = function (bolNo, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetSalesOrderClaim/?bolNo=' + bolNo;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetSalesOrderClaim', arg);
                faliureCallBack();
            });
        };

        // To get Multileg Details
        SalesOrderClient.prototype.getMultilegDetails = function (shipmentId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetMultilegDetailsBySalesOrderId/?shipmentId=' + shipmentId;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetMultilegDetails', arg);
                faliureCallBack();
            });
        };

        // To Save Sales Order Details
        SalesOrderClient.prototype.SaveSalesOrderDetail = function (salesOrderContainer, successCallBack, faliureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/SaveSalesOrderDetail", salesOrderContainer).done(function (message) {
                if (message.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successCallBack(message.Response);
                } else if (message.StatusModel.StatusCode == Constants.ApplicationConstants.RecordAlreadyChanged) {
                    faliureCallBack(message);
                } else {
                    faliureCallBack(message.StatusModel.Description);
                }
                // ###END: US22538
            }).fail(function (message) {
                faliureCallBack(message);
                self.failureProxyCallback('SaveSalesOrderDetail', message);
            });
        };

        // To Save Sales Order Notes Details
        SalesOrderClient.prototype.SaveSalesOrderNotesDetail = function (salesOrderNotesContainer, successCallBack, faliureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/SaveSalesOrderNotesDetail", salesOrderNotesContainer).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                faliureCallBack(message);
                self.failureProxyCallback('SaveSalesOrderNotesDetail', message);
            });
        };

        //## Service to get the history of the sales order#/
        SalesOrderClient.prototype.GetShipmentHistoryByShipmentId = function (salesOrderId, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (salesOrderId) {
                ajax.get("Accounting/GetShipmentHistoryByShipmentId/" + salesOrderId.toString()).done(function (message) {
                    successCallBack(message);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetShipmentHistoryByShipmentId', message);
                });
            }
            // Set grid progress false
            //if (failureCallBack && typeof failureCallBack === 'function') {
            //	failureCallBack("Sales order ID is zero.");
            //}
        };

        SalesOrderClient.prototype.GetShipmentHistoryHeaderDetailsByShipmentId = function (salesOrderId, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (salesOrderId) {
                ajax.get("Accounting/GetShipmentHistoryHeaderDetailsByShipmentId/" + salesOrderId.toString()).done(function (message) {
                    successCallBack(message);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetShipmentHistoryHeaderDetailsByShipmentId', message);
                });
            }

            if (failureCallBack && typeof failureCallBack === 'function') {
                failureCallBack("Sales order ID is zero.");
            }
        };

        //## Service to get the history details of the sales order#/
        SalesOrderClient.prototype.GetShipmentHistoryDetailsByShipmentId = function (salesOrderId, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (salesOrderId) {
                ajax.get("Accounting/GetShipmentHistoryDetailsByShipmentId/" + salesOrderId.toString()).done(function (message) {
                    successCallBack(message);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetShipmentHistoryDetailsByShipmentId', message);
                });
            } else if (failureCallBack && typeof failureCallBack === 'function') {
                failureCallBack("Sales order ID is zero.");
            }
            // ##END: DE23006
        };

        //## Service to get vendor bill item for invoice resolution#/
        SalesOrderClient.prototype.GetVendorBillItemsForInvoiceResolution = function (salesOrderId, successCallBack, failureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (salesOrderId) {
                ajax.get("Accounting/GetVendorBillItemsForInvoiceResolution/" + salesOrderId.toString()).done(function (message) {
                    successCallBack(message);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetVendorBillItemsForInvoiceResolution', message);
                });
            }

            if (failureCallBack && typeof failureCallBack === 'function') {
                failureCallBack("Vendor bill ID is zero.");
            }
        };

        //## Service to get vendor bill addresses for invoice resolution#/
        SalesOrderClient.prototype.GetVendorBillAddressForInvoiceResolution = function (vendorBillId, successCallBack, failureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (vendorBillId) {
                ajax.get("Accounting/GetVendorBillAddressForInvoiceResolution/" + vendorBillId.toString()).done(function (message) {
                    successCallBack(message);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetVendorBillAddressForInvoiceResolution', message);
                });
            }

            if (failureCallBack && typeof failureCallBack === 'function') {
                failureCallBack("Vendor bill ID is zero.");
            }
        };

        // gets the model after uploading the file
        SalesOrderClient.prototype.SendAgentNotificationMail = function (sendAgentNotificationMailDetail, successCallBack, failCallBack, failCallBackInfo) {
            var self = this;
            var url = 'Accounting/SendAgentNotificationMailDetail';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, sendAgentNotificationMailDetail).done(function (data) {
                if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successCallBack(data);
                } else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSentFailedCode) {
                    failCallBack(data.StatusModel.Description);
                } else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSettingNotFoundCode) {
                    failCallBackInfo(data.StatusModel.Description);
                }
                // ###END: US22471
            }).fail(function (arg) {
                self.failureProxyCallback('SendAgentNotificationMail', arg);
                failCallBack(arg);
            });
        };

        // ###START: US24871
        // gets the model after uploading the file
        SalesOrderClient.prototype.SendCarrierDisputeMail = function (SendCarrierDisputeMail, successCallBack, failCallBack, failCallBackInfo) {
            var self = this;
            var url = 'Accounting/SendCarrierDisputeMail';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, SendCarrierDisputeMail).done(function (data) {
                if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successCallBack(data);
                } else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSentFailedCode) {
                    failCallBack(data.StatusModel.Description);
                } else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSettingNotFoundCode) {
                    failCallBackInfo(data.StatusModel.Description);
                }
            }).fail(function (arg) {
                self.failureProxyCallback('SendCarrierDisputeMail', arg);
                failCallBack(arg);
            });
        };

        // ###END: US24871
        // To Cancel SalesOrder
        /* <changeHistory>
        ** <id>US22955</id> <by>Shreesha Adiga</by> <date>30-06-2016</date> <description>Removed multiple parameters and aded a model parameter</description>
        ** </changeHistory>
        */
        SalesOrderClient.prototype.cancelSalesOrder = function (salesOrderCancelData, successCallBack, faliureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post('Accounting/CancelSalesOrder', salesOrderCancelData).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('cancelSalesOrder', arg);

                // ###START: DE20779
                faliureCallBack(arg);
                // ###END: DE20779
            });
        };

        // To Un Cancel SalesOrder
        SalesOrderClient.prototype.UnCancelSalesOrder = function (shipmentId, updatedDateTime, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/UnCancelSalesOrder/?shipmentId=' + shipmentId + '&updatedDateTime=' + updatedDateTime;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('UnCancelSalesOrder', arg);

                // ###START: DE20779
                faliureCallBack(arg);
                // ###END: DE20779
            });
        };

        // To get Requote Reason codes
        SalesOrderClient.prototype.GetRequoteReasonCodes = function (successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetRequoteReasonCodes';
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetRequoteReasonCodes', arg);
                faliureCallBack();
            });
        };

        // To get Requote Reason codes
        SalesOrderClient.prototype.GetAgentDisputes = function (shipmentId, vendorBillId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetAgentDisputes/?shipmentId=' + shipmentId + '&vendorBillId=' + vendorBillId;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetAgentDisputes', arg);
                faliureCallBack();
            });
        };

        SalesOrderClient.prototype.getInvoiceExceptionDetails = function (shipmentId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetInvoiceExceptionDetailsBySalesOrderId/?shipmentId=' + shipmentId;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('getInvoiceExceptionDetails', arg);
                faliureCallBack();
            });
        };

        // Force Invoice Reason
        SalesOrderClient.prototype.forceInvoiceShipment = function (requestParameter, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/ForceInvoiceShipment';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, requestParameter).done(function (data) {
                successCallBack(data);
            }).fail(function (data) {
                self.failureProxyCallback('forceInvoiceShipment', data);
                failCallBack(data);
            });
        };

        // To SalesOrder Rebill
        SalesOrderClient.prototype.GetSalesOrderRebill = function (salesOrderId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetSalesOrderRebill/?salesOrderId=' + salesOrderId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetSalesOrderRebill', arg);
                faliureCallBack();
            });
        };

        // To save Rebill Details
        // To Save Sales Order Details
        SalesOrderClient.prototype.SaveSalesOrderRebillDetail = function (salesOrderRebillContainer, successCallBack, faliureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/SaveRebillDetail", salesOrderRebillContainer).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                faliureCallBack(message);
                self.failureProxyCallback('SaveSalesOrderRebillDetail', message);
            });
        };

        // To Save Sales Order Details
        SalesOrderClient.prototype.SaveAgentDispute = function (agentDisputeDetails, successCallBack, faliureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/SaveAgentDispute", agentDisputeDetails).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                faliureCallBack(message);
                self.failureProxyCallback('SaveAgentDispute', message);
            });
        };

        // To Save Sales Order Details
        SalesOrderClient.prototype.SaveSalesOrderDisputeVBDetails = function (salesOrderDisputeVendorBillContainer, successCallBack, faliureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/SaveSalesOrderDisputeVBDetails", salesOrderDisputeVendorBillContainer).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                faliureCallBack(message);
                self.failureProxyCallback('SaveSalesOrderDisputeVBDetails', message);
            });
        };

        //##START: US20961
        // To save dispute status for VBs that are already in mas
        SalesOrderClient.prototype.SaveDisputeStatusFromSalesOrder = function (salesOrderDisputeVendorBillContainer, successCallBack, faliureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/SaveDisputeStatusFromSalesOrder", salesOrderDisputeVendorBillContainer).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                faliureCallBack(message);
                self.failureProxyCallback('SaveDisputeStatusFromSalesOrder', message);
            });
        };

        //##END: US20961
        // To SalesOrder Dispute
        SalesOrderClient.prototype.GetMultipleVendorBillDetailsForIterm = function (salesOrderId, successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/GetMultipaleVendorBillDetailsForIterm/?shipmentId=' + salesOrderId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetMultipaleVendorBillDetailsForIterm', arg);
                failureCallBack();
            });
        };

        SalesOrderClient.prototype.searchAutoCompleteCompanyDetails = function (startValue, customerId, successCallBack) {
            var self = this;
            var url = "Accounting/GetCompanyAddressDetailsByCustomerId";

            var _searchValue = new SearchModel(startValue);
            _searchValue.CustomerId = customerId;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, _searchValue).done(function (data) {
                var result = data;
                var newItems = ko.utils.arrayMap(result, function (item) {
                    return new refSearchSalesOrderAddress.Models.SalesOrderAddress(item);
                });
                successCallBack(newItems);
            }).fail(function (arg) {
                self.failureProxyCallback('searchAutoCompleteCompanyDetails', arg);
            });
        };

        // To SalesOrder GetFAKDetails
        SalesOrderClient.prototype.GetFAKDetails = function (carrierId, successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/GetFAKDetailsByCarrierId/?carrierId=' + carrierId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetFAKDetails', arg);
                failureCallBack();
            });
        };

        // To Save FAK Details
        SalesOrderClient.prototype.SaveFAKSetup = function (auditSettingContainer, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/SaveFAKMappingSetup", auditSettingContainer).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                failureCallBack(message);
                self.failureProxyCallback('SaveFAKSetup', message);
            });
        };

        // To Get SalesOrder Audited bill detail
        SalesOrderClient.prototype.GetSalesOrderAuditedBillDetailByVendorBillId = function (vendorBillId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetSalesOrderAuditedBillDetailByVendorBillId/?vendorBillId=' + vendorBillId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetSalesOrderAuditedBillDetailByVendorBillId', arg);
                faliureCallBack();
            });
        };

        // To Revert Sales Order Scheduled To Pending
        SalesOrderClient.prototype.MakeSoScheduledToPending = function (shipmentId, successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/MakeSoScheduledToPending/?shipmentId=' + shipmentId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('MakeSoScheduledToPending', arg);
                failureCallBack();
            });
        };

        // To Send Invoice
        SalesOrderClient.prototype.ScheduleInvoice = function (salesOrderContainer, successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/SalesOrderScheduleInvoice';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, salesOrderContainer).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('ScheduleInvoice', arg);
                failureCallBack(arg);
            });
        };

        // To Save Schedule Invoice
        SalesOrderClient.prototype.SaveScheduleInvoiceZeroRevenue = function (scheduleInvoiceContainer, successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/SaveScheduleInvoiceZeroRevenue';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, scheduleInvoiceContainer).done(function (message) {
                if (message.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successCallBack(message.Response);
                } else if (message.StatusModel.StatusCode == Constants.ApplicationConstants.RecordAlreadyChanged) {
                    failureCallBack(message);
                } else {
                    failureCallBack(message.StatusModel.Description);
                }
                // ###END: US22538
            }).fail(function (arg) {
                self.failureProxyCallback('SaveScheduleInvoiceZeroRevenue', arg);
                failureCallBack(arg);
            });
        };

        // To Save Schedule Invoice SaveScheduleInvoiceWithRevenueAdjustment
        SalesOrderClient.prototype.SaveScheduleInvoiceWithRevenueAdjustment = function (scheduleInvoiceContainer, successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/SaveScheduleInvoiceWithRevenueAdjustment';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, scheduleInvoiceContainer).done(function (message) {
                if (message.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successCallBack(message.Response);
                } else if (message.StatusModel.StatusCode == Constants.ApplicationConstants.RecordAlreadyChanged) {
                    failureCallBack(message);
                } else if (message.StatusModel.StatusCode == Constants.ApplicationConstants.ErrorStatusInfoCode) {
                    failureCallBack(message);
                } else {
                    failureCallBack(message.StatusModel.Description);
                }
                // ###END: US22538
            }).fail(function (arg) {
                self.failureProxyCallback('SaveScheduleInvoiceZeroRevenue', arg);
                failureCallBack(arg);
            });
        };

        // Get MAS Customer Fields based on Customer Id
        SalesOrderClient.prototype.GetMasCustomerFields = function (CustomerId, successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/GetMASCustomerFields/?customerId=' + CustomerId;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetMasCustomerFields', arg);
                failureCallBack(arg);
            });
        };

        // To set order status as shipment finalized
        SalesOrderClient.prototype.SetFinalize = function (salesOrderFinalizeDetails, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/SetSalesOrderFinalized", salesOrderFinalizeDetails).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                failureCallBack(message);
                self.failureProxyCallback('SetFinalize', message);
            });
        };

        SalesOrderClient.prototype.GetSalesOrderFinancialDetailsOnSubscribe = function (salesOrderFinancialDetails, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/GetSalesOrderFinancialDetailsOnSubscribe", salesOrderFinancialDetails).done(function (data) {
                successCallBack(data);
            }).fail(function (message) {
                failureCallBack(message);
                self.failureProxyCallback('GetSalesOrderFinancialDetailsOnSubscribe', message);
            });
        };

        //## Service to get the history details of the sales order by Version Id#/
        SalesOrderClient.prototype.GetShipmentHistoryDetailsByVersionId = function (salesOrderId, VersionId, headerType, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var url = 'Accounting/GetShipmentHistoryDetailsByVersionId/?salesOrderId=' + salesOrderId + '&versionId=' + VersionId + '&tabType=' + headerType;
            if (VersionId) {
                ajax.get(url).done(function (message) {
                    successCallBack(message);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetShipmentHistoryDetailsByVersionId', message);
                });
            } else if (failureCallBack && typeof failureCallBack === 'function') {
                failureCallBack("VersionId is zero.");
            }
            // ##END: DE23006
        };

        /*
        ** Gets the response after uploading the CSV
        */
        ///	<createDetails>
        /// <id>US19882</id> <by>Shreesha Adiga</by> <date>23-12-2015</date>
        /// </createDetails>
        SalesOrderClient.prototype.GetSalesOrderUploadResponce = function (uploadedItem, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/SalesOrderCSVUpload';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (uploadedItem) {
                ajax.post(url, uploadedItem).done(function (message) {
                    successCallBack(message);
                }).fail(function (message) {
                    faliureCallBack(message);
                    self.failureProxyCallback('GetSalesOrderUploadResponce', message);
                });
            }
        };

        /// Submit grid rows and get back the invalid rows, and uploaded row count as response
        ///	<createDetails>
        /// <id>US19882</id> <by>Shreesha Adiga</by> <date>23-12-2015</date>
        /// </createDetails>
        SalesOrderClient.prototype.GetSalesOrderUploadResponseAfterSubmitFromGrid = function (uploadedFileDetails, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetSalesOrderUploadResponseAfterSubmitFromGrid';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (uploadedFileDetails) {
                ajax.post(url, uploadedFileDetails).done(function (response) {
                    successCallBack(response);
                }).fail(function (message) {
                    faliureCallBack(message);
                    self.failureProxyCallback('GetSalesOrderUploadResponseAfterSubmitFromGrid', message);
                });
            }
        };

        /// Get the credit memo details on click of the tab
        ///	<createDetails>
        /// <id>US20288</id> <by>Shreesha Adiga</by> <date>14-01-2016</date>
        /// </createDetails>
        SalesOrderClient.prototype.GetCreditMemoDetails = function (bolNumber, successCallBack, faliureCallBack) {
            var self = this;

            var url = 'Accounting/GetCreditMemoDetails/?bolNumber=' + bolNumber;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetCreditMemoDetails', arg);
                faliureCallBack();
            });
        };

        /// Get Sales order MAS details
        /// <createDetails>
        /// <id>US21133</id> <by>Baldev Singh Thakur</by> <date>31-03-2016</date>
        /// </createDetails>
        SalesOrderClient.prototype.GetShipmentMasDetails = function (bolNumber, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            var url = 'Accounting/GetShipmentMasDetails/?bolNumber=' + bolNumber;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetSalesOrderMasDetails', arg);
                failureCallBack();
            });
        };

        /// Get SalesOrder notes for a salesOrder
        /// <createDetails>
        /// <id>DE22412</id> <by>Shreesha Adiga</by> <date>13-04-2016</date>
        /// </createDetails>
        SalesOrderClient.prototype.GetSalesOrderNotes = function (shipmentId, successCallBack, failureCallBack) {
            var self = this;

            var url = 'Accounting/GetSalesOrderNotes/?shipmentId=' + shipmentId;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetSalesOrderNotes', arg);
                failureCallBack(arg);
            });
        };

        /// Get Truckload Accessorials
        /// <createDetails>
        /// <id>US24389</id> <by>Shreesha Adiga</by> <date>26-08-2016</date>
        /// </createDetails>
        SalesOrderClient.prototype.GetTruckloadAccessorials = function (successCallBack) {
            var self = this;

            var url = 'Accounting/GetTruckloadAccessorials/';
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetTruckloadAccessorials', arg);
            });
        };

        /// Get list of items which are not in Mas
        /// <createDetails>
        /// <id>US25153</id> <by>Shreesha Adiga</by> <date>20-10-2016</date>
        /// </createDetails>
        SalesOrderClient.prototype.GetItemsNotIntegratedWithMas = function (successCallBack) {
            var self = this;

            var url = 'Accounting/GetItemsNotIntegratedWithMas/';
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetItemsNotIntegratedWithMas', arg);
            });
        };

        /// Get all the Dispute Email Templates
        /// <createDetails>
        /// <id>US24865</id> <by>Shreesha Adiga</by> <date>22-09-2016</date>
        /// </createDetails>
        SalesOrderClient.prototype.GetAllDisputeEmailTemplates = function (successCallBack) {
            var self = this;

            var url = 'Accounting/GetAllDisputeEmailTemplates/';
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetAllDisputeEmailTemplates', arg);
            });
        };

        // ###START: US25154
        // ###START: US25315
        /// gets the model after uploading the file
        /// <changeHistory>
        /// <id>US26365</id> <by>Vasanthakumar</by> <date>12-01-2017</date>
        /// <id>US26695</id> <by>Vasanthakumar</by> <date>25-01-2017</date>
        /// <id>DE25727</id> <by>Vasanthakumar</by> <date>27-01-2017</date>
        /// </changeHistory>
        SalesOrderClient.prototype.ProcessCreditMemo = function (ProcessCreditMemo, successCallBack, failCallBack, failCallBackInfo) {
            var self = this;
            var url = 'Accounting/ProcessCreditMemo';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, ProcessCreditMemo).done(function (data) {
                if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successCallBack(data);
                } else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSentFailedCode) {
                    failCallBack(data.StatusModel.Description);
                } else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSettingNotFoundCode || data.StatusModel.StatusCode == Constants.ApplicationConstants.RecordAlreadyChanged || data.StatusModel.StatusCode == Constants.ApplicationConstants.ErrorStatusInfoCode) {
                    failCallBackInfo(data.StatusModel.Description);
                } else {
                    failCallBack(data.StatusModel.Description);
                }
            }).fail(function (arg) {
                self.failureProxyCallback('ProcessCreditMemo', arg);
                failCallBack(arg);
            });
        };

        // ###START: US25315
        // ###END: US25154
        // ###START:US25277
        SalesOrderClient.prototype.getCreditReasonCodes = function (successCallBack) {
            var self = this;
            var url = 'Accounting/GetCreditReasonCodes';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetCreditReasonCodes', arg);
            });
        };

        // To Save Credit Memo Details
        SalesOrderClient.prototype.RequestCreditMemo = function (creditMemoContainer, successCallBack, faliureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/SaveRequestCreditMemo", creditMemoContainer).done(function (message) {
                if (message.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successCallBack(message);
                } else {
                    faliureCallBack(message);
                }
            }).fail(function (message) {
                faliureCallBack(message);
                self.failureProxyCallback('RequestCreditMemo', message);
            });
        };

        SalesOrderClient.prototype.getTotalPendingCreditMemo = function (shipmentId, successCallBack) {
            var self = this;
            var url = 'Accounting/GetTotalPendingCreditMemo/?shipmentId=' + shipmentId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('getTotalPendingCreditMemo', arg);
            });
        };

        // ###END: US25277
        /// Get the revenue of an Order and Suborders attached to it
        /// <createDetails>
        /// <id>US25684</id> <by>Shreesha Adiga</by> <date>22-11-2016</date>
        /// </createDetails>
        SalesOrderClient.prototype.GetSubordersAndRevenuesByBOLNumber = function (bolNumber, successCallback, failureCallback) {
            var self = this;

            if (!bolNumber)
                failureCallback();

            var url = 'Accounting/GetSubordersAndRevenuesByBOLNumber/?bolNumber=' + bolNumber;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallback(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetSubordersAndRevenuesByBOLNumber', arg);
            });
        };

        /// Get the revenue of an Order and Suborders attached to it
        /// <createDetails>
        /// <id>US26559</id> <by>Vasanthakumar</by> <date>02-02-2017</date>
        /// </createDetails>
        SalesOrderClient.prototype.GetAllInvoicedSOExceptCreditMemoSubSO = function (shipmentId, successCallback, failureCallback) {
            var self = this;
            var url = 'Accounting/GetAllInvoicedSOExceptCreditMemoSubSO/?shipmentId=' + shipmentId;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallback(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetAllInvoicedSOExceptCreditMemoSubSO', arg);
                failureCallback(arg);
            });
        };

        // ###START: US26027
        /// Reject Credit Memo request and returning sucess/failure message
        /// <changeHistory>
        /// <id>US26695</id> <by>Vasanthakumar</by> <date>30-01-2017</date>
        /// </changeHistory>
        SalesOrderClient.prototype.RejectCreditMemo = function (ProcessCreditMemo, successCallBack, failCallBack, failCallBackInfo) {
            var self = this;
            var url = 'Accounting/RejectCreditMemo';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, ProcessCreditMemo).done(function (data) {
                if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successCallBack(data);
                } else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSentFailedCode) {
                    failCallBack(data.StatusModel.Description);
                } else if (data.StatusModel.StatusCode == Constants.ApplicationConstants.MailSettingNotFoundCode || data.StatusModel.StatusCode == Constants.ApplicationConstants.RecordAlreadyChanged) {
                    failCallBackInfo(data.StatusModel.Description);
                } else {
                    failCallBack(data.StatusModel.Description);
                }
            }).fail(function (arg) {
                self.failureProxyCallback('RejectCreditMemo', arg);
                failCallBack(arg);
            });
        };

        // ###END: US26027
        // ###END: US25942
        SalesOrderClient.prototype.getTotalSORevenueCreditMemo = function (shipmentId, successCallBack, failCallBackInfo) {
            var self = this;
            var url = 'Accounting/GetTotalSORevenueCreditMemo/?shipmentId=' + shipmentId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetTotalSORevenueCreditMemo', arg);
            });
        };

        // ###END: US25942
        // ###START: US26377
        /// Method to check if Cancel So credit reason should be displayed or no
        /// <createDetails>
        /// <id>US26377</id> <by>Baldev Singh Thakur</by> <date>02-03-2017</date>
        /// </createDetails>
        SalesOrderClient.prototype.validateShipmentForCreditReasonWithCancelSo = function (shipmentId, successCallBack) {
            var self = this;
            var url = 'Accounting/ValidateShipmentForCreditReasonWithCancelSo/?shipmentId=' + shipmentId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('validateShipmentForCreditReasonWithCancelSo', arg);
            });
        };

        // ###END: US26377
        // ###START: US29002
        // To Save Sales Order Details
        SalesOrderClient.prototype.CopySalesOrderDetail = function (salesOrderContainer, successCallBack, faliureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/CopySalesOrderDetail", salesOrderContainer).done(function (message) {
                if (message.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successCallBack(message.Response);
                } else {
                    faliureCallBack(message.StatusModel.Description);
                }
                // ###END: US22538
            }).fail(function (message) {
                faliureCallBack(message);
                self.failureProxyCallback('CopySalesOrderDetail', message);
            });
        };

        // ###END: US29002
        //#endregion
        //#region Private Methods
        // For Log the Error record
        SalesOrderClient.prototype.failureProxyCallback = function (context, error) {
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
        return SalesOrderClient;
    })();
    exports.SalesOrderClient = SalesOrderClient;

    var SearchModel = (function () {
        function SearchModel(searchValue, PageNumber, PageSize) {
            this.SearchValue = searchValue;
            this.PageNumber = PageNumber;
            this.PageSize = PageSize;
        }
        return SearchModel;
    })();
    exports.SearchModel = SearchModel;
});
