/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'services/models/vendorBill/VendorBillSearchResult', 'durandal/system', 'durandal/app'], function(require, exports, __refVendorBillSearchRes__, __refSystem__, ___app__) {
    
    
    var refVendorBillSearchRes = __refVendorBillSearchRes__;
    var refSystem = __refSystem__;
    var _app = ___app__;

    //#endregion
    /*
    ** <summary>
    ** Vendor bill client server calls.
    ** </summary>
    ** <changeHistory>
    ** <id>US21085</id> <by>Janakiram</by> <date>31-03-2016</date> <description>Added csv, Excel Download for sales order, Invoices, Bills, Truck Load Quote</description>
    ** <id>DE22118</id> <by>Vasanthakumar</by> <date>04-04-2016</date> <description>Added Response model for savevendorbill method</description>
    ** <id>US21619</id> <by>Vasanthakumar</by> <date>27-04-2016</date> <description>Handling Response model for Validate error Logs in Accounting</description>
    ** <id>DE22808</id> <by>Baldev Singh Thakur</by> <date>13-05-2016</date><description>Error message on saving Bill/UVB even if bill has saved successfully.</description>
    ** <id>DE23006</id> <by>Shreesha Adiga</by> <date>31-05-2016</date><description>Changes related to spinner; Call the failure funcation in "else if"</description>
    ** <id>US23124</id> <by>Janakiram</by> <date>04-07-2016</date><description>Changed Vendor bill logic while saving </description>
    ** <id>US24647</id> <by>Janakiram</by> <date>14-09-2016</date> <description>Modified the logic to reload the Bill, if it has already been modified, and also updated the message Record Already Changed.</description>
    ** <id>US25684</id> <by>Shreesha Adiga</by> <date>23-11-2016</date><description>Added ajax calls for VB reassignment popup</description>
    ** <id>US26955</id> <by>Baldev Singh Thakur</by> <date>16-02-2017</date><description>Added ajax calls for validating the Reassigned Order.</description>
    ** </changeHistory>
    */
    var VendorBillClient = (function () {
        function VendorBillClient() {
        }
        //#region Public Methods
        //For Search Vendor Detail on the based od Vendor Name
        VendorBillClient.prototype.searchSalesOrderByBOL = function (proNo, carrierId, bolNo, vendorBillId, successCallBack) {
            var self = this;
            var url = 'Accounting/GetSalesOrderDetailByBOL/?proNo=' + proNo + '&carrierId=' + carrierId + '&bolNo=' + bolNo + '&vendorBillId=' + vendorBillId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                var result = data;

                //var newItems = ko.utils.arrayMap(result, function (item) {
                //    return new refVendorBillAddress.Models.VendorBillAddress(item);
                //});
                successCallBack(result);
            }).fail(function (arg) {
                self.failureProxyCallback('searchSalesOrderByBOL', arg);
            });
        };

        //To Check if Pro no Exists
        VendorBillClient.prototype.getExistingProNo = function (bolNo, successCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get("Accounting/GetExistingProNo/?bolNo=" + bolNo).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('getExistingProNo', arg);
            });
        };

        VendorBillClient.prototype.searchVendorBill = function (vendorBillSearch, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetVendorBillSearchResults';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, vendorBillSearch).done(function (data) {
                var result = data;
                var newItems = ko.utils.arrayMap(result, function (item) {
                    return new refVendorBillSearchRes.Models.VendorBillSearchResult(item);
                });
                successCallBack(newItems);
            }).fail(function (arg) {
                self.failureProxyCallback('searchVendorBill', arg);
                faliureCallBack();
            });
        };

        //for quick search
        VendorBillClient.prototype.quickSearchVendorBill = function (vendorBillSearch, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetVendorBillQuickSearchResult';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, vendorBillSearch).done(function (data) {
                //var result: any = data;
                //var newItems = ko.utils.arrayMap(result, function (item) {
                //	return new refVendorBillSearchRes.Models.VendorBillSearchResult(item);
                //});
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('quickSearchVendorBill', arg);
                faliureCallBack();
            });
        };

        //#region Save vendor Bill
        VendorBillClient.prototype.SaveVendorBillDetail = function (VendorBillContainer, successCallBack, failureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/SaveVendorBillDetail", VendorBillContainer).done(function (message) {
                if (message.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successCallBack(message.Response);
                } else if (message.StatusModel.StatusCode == Constants.ApplicationConstants.MemoNotesUpdated) {
                    failureCallBack(message);
                } else if (message.StatusModel.StatusCode == Constants.ApplicationConstants.MatchingProcessErrorStatusCode) {
                    failureCallBack(message);
                } else if (message.StatusModel.StatusCode == Constants.ApplicationConstants.RecordAlreadyChanged) {
                    failureCallBack(message);
                } else {
                    failureCallBack(message.StatusModel.Description);
                }
                //// ###END: DE22118
            }).fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('SaveVendorBillDetail', message);
            });
        };

        // call servise to create dispute lost bill
        VendorBillClient.prototype.CreateDisputeLostBill = function (VendorBillContainer, successCallBack, failureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/CreateDisputeLostBill", VendorBillContainer).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                if (failureCallBack) {
                    failureCallBack();
                }
                self.failureProxyCallback('CreateDisputeLostBill', arg);
            });
        };

        //#endregion Save Vendor Bill
        //#region Load Vendor Bill Details
        // Get the vendor bill details by vendor bill id
        VendorBillClient.prototype.getVendorBillDetailsByVendorBillId = function (vendorBillId, successCallBack, faliureCallBack, isSubBill) {
            if (typeof isSubBill === "undefined") { isSubBill = false; }
            var self = this;
            var url = 'Accounting/GetVendorBillDetailsByVendorBillId/?vendorBillId=' + vendorBillId + '&isSubBill=' + isSubBill;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('getVendorBillDetailsByVendorBillId', arg);
            });
        };

        // Get the vendor bill Financial details by vendor bill id
        VendorBillClient.prototype.getVendorBillFinancialDetailsByVendorBillId = function (vendorBillId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetVendorBillFinancialDetailsByVendorBillId/?vendorBillId=' + vendorBillId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('getVendorBillFinancialDetailsByVendorBillId', arg);
            });
        };

        VendorBillClient.prototype.getShipmentRelatedLinks = function (bolNumber, vendorBillId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetShipmentRelatedLinks/?bolNumber=' + bolNumber + '&vendorBillId=' + vendorBillId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('getShipmentRelatedLinks', arg);
            });
        };

        //Get CustomerMain Id and Term Type
        VendorBillClient.prototype.getCustomerTypeAndMasterCustomerId = function (customerId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetCustomerTypeAndMasterCustomerId/?customerId=' + customerId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('getCustomerTypeAndMasterCustomerId', arg);
            });
        };

        VendorBillClient.prototype.getVendorBillMasNoteDetails = function (vendorBillId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetMasNotes/?vendorBillId=' + vendorBillId;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('GetMasNotes', arg);
            });
        };

        VendorBillClient.prototype.getShipmentPaymentDetails = function (type, vendorBillId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetCreditDebits/?type=' + type + '&vendorBillId=' + vendorBillId;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('GetMasNotes', arg);
            });
        };

        //## Service to get all Vendor bill Exceptions. #/
        /// parameter: success callback, and failed call back
        VendorBillClient.prototype.getVendorBillExceptions = function (searchFilter, successCallBack, faliureCallBack, PagingData) {
            var self = this;
            var url = 'Accounting/GetVendorBillExceptions';
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, searchFilter).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('GetVendorBillExceptions', arg);
            });
        };

        //## Service to get all purchase orders list. #/
        VendorBillClient.prototype.getPurchaseOrdersDetails = function (searchFilter, successCallBack, faliureCallBack, PagingData) {
            var self = this;
            var url = 'Accounting/GetPurchaseOrdersBoardDetails';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            ajax.post(url, searchFilter).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('GetPurchaseOrdersBoardDetails', arg);
            });
        };

        //## Service to Move the VendorBills into MAS. #/
        VendorBillClient.prototype.ForcePushToMAS = function (vendorBillIds, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            ajax.get("Accounting/ForcePushToMAS?vendorBillId=" + vendorBillIds).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('ForcePushToMAS', message);
            });
        };

        //## Service to get the history of the vendor bill#/
        VendorBillClient.prototype.GetVendorBillHistoryDetailsByVendorBillId = function (vendorBillId, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (vendorBillId) {
                ajax.get("Accounting/GetVendorBillHistoryDetailsByVendorBillId/" + vendorBillId.toString()).done(function (message) {
                    successCallBack(message);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetVendorBillHistoryDetailsByVendorBillId', message);
                });
            } else if (failureCallBack && typeof failureCallBack === 'function') {
                failureCallBack("Vendor bill ID is zero.");
            }
            // ##END: DE23006
        };

        //## Service to get the Exception Rule And Resolution of the vendor bill#/
        VendorBillClient.prototype.GetVendorBillExceptionRulesAndResolution = function (vendorBillId, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (vendorBillId) {
                ajax.get("Accounting/GetVendorBillExceptionRulesAndResolution/" + vendorBillId).done(function (message) {
                    successCallBack(message);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetVendorBillExceptionRulesAndResolution', message);
                });
            }

            if (failureCallBack && typeof failureCallBack === 'function') {
                failureCallBack("Vendor bill ID is zero.");
            }
        };

        //## Service to get the history of the vendor bill#/
        VendorBillClient.prototype.GetVendorBillHistoryByVendorBillId = function (vendorBillId, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (vendorBillId) {
                ajax.get("Accounting/GetVendorBillHistoryByVendorBillId/" + vendorBillId.toString()).done(function (message) {
                    successCallBack(message);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetVendorBillHistoryByVendorBillId', message);
                });
            }
            // Set grid progress false
            //if (failureCallBack && typeof failureCallBack === 'function') {
            //	failureCallBack("Vendor bill ID is zero.");
            //}
        };

        //## Service to get the history of the vendor bill#/
        VendorBillClient.prototype.GetVendorBillHistoryHeaderDetailsByVendorBillId = function (vendorBillId, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (vendorBillId) {
                ajax.get("Accounting/GetVendorBillHistoryHeaderDetailsByVendorBillId/" + vendorBillId.toString()).done(function (message) {
                    successCallBack(message);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetVendorBillHistoryHeaderDetailsByVendorBillId', message);
                });
            }

            if (failureCallBack && typeof failureCallBack === 'function') {
                failureCallBack("Vendor bill ID is zero.");
            }
        };

        // Gets the vendor bill items for dispute lost
        VendorBillClient.prototype.getvendorBillItems = function (vendorBillId, successCallBack, faliureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (vendorBillId) {
                ajax.get("Accounting/GetVendorBillItemsForDisputeLost/" + vendorBillId.toString()).done(function (message) {
                    successCallBack(message);
                }).fail(function (message) {
                    if (successCallBack) {
                        faliureCallBack(message);
                    }
                    self.failureProxyCallback('ForcePushToMAS', message);
                });
            }

            if (faliureCallBack && typeof faliureCallBack === 'function') {
                faliureCallBack("Vendor bill ID is zero.");
            }
        };

        // Gets the vendor bill items for dispute lost
        VendorBillClient.prototype.saveVendorBillDisputeLostItems = function (vendorBillDisputeLostItem, successCallBack, faliureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (vendorBillDisputeLostItem) {
                ajax.post("Accounting/SaveVendorBillDisputeLostItems/", vendorBillDisputeLostItem).done(function (message) {
                    successCallBack(message);
                }).fail(function (message) {
                    if (successCallBack) {
                        faliureCallBack(message);
                    }
                    self.failureProxyCallback('ForcePushToMAS', message);
                });
            }
        };

        // Gets the shipment link details
        VendorBillClient.prototype.getShipmentLinkDetails = function (shipmentLink, successCallBack, faliureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (shipmentLink) {
                ajax.post("Accounting/GetShipmentLinkDetails/", shipmentLink).done(function (message) {
                    successCallBack(message);
                }).fail(function (message) {
                    faliureCallBack(message);
                    self.failureProxyCallback('GetShipmentLinkDetails', message);
                });
            }
        };

        //#endregion
        //
        VendorBillClient.prototype.getInvoiceHtmlBody = function (documentRequestModel, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetInvoiceAsHtmlBody';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, documentRequestModel).done(function (data) {
                if (data.StatusModel.StatusCode == Constants.ApplicationConstants.NoErrorStatusCode) {
                    successCallBack(data.Response);
                } else {
                    faliureCallBack(data.StatusModel.Description);
                }
                //// ###END: US21619
            }).fail(function (arg) {
                self.failureProxyCallback('getInvoiceHtmlBody', arg);
                faliureCallBack(arg);
            });
        };

        /*
        ** Gets the updated data
        */
        VendorBillClient.prototype.GetUploadResponce = function (uploadedItem, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetUploadResponce';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (uploadedItem) {
                ajax.post(url, uploadedItem).done(function (message) {
                    successCallBack(message);
                }).fail(function (message) {
                    faliureCallBack(message);
                    self.failureProxyCallback('GetShipmentLinkDetails', message);
                });
            }
        };

        VendorBillClient.prototype.GetUploadResponceByList = function (uploadedFileDetails, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetUploadResponseByList';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (uploadedFileDetails) {
                ajax.post(url, uploadedFileDetails).done(function (message) {
                    successCallBack(message);
                }).fail(function (message) {
                    faliureCallBack(message);
                    self.failureProxyCallback('GetUploadResponseByList', message);
                });
            }
        };

        VendorBillClient.prototype.CreateVendorBillFromSalesOrder = function (salesOrderId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/CreateVendorBillFromSalesOrder/?salesOrderId=' + salesOrderId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('CreateVendorBillFromSalesOrder', arg);
            });
        };

        // Service to get the vendor bill dispute details
        VendorBillClient.prototype.getVendorBillDisputeDetails = function (vendorBillId, bolNumber, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetVendorBillDisputeItemDetailsByVendorBillId/?vendorBillId=' + vendorBillId + '&bolNumber=' + bolNumber;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack(arg);
                self.failureProxyCallback('getVendorBillDisputeDetails', arg);
            });
        };

        // To Save Vendor Bill Notes Details
        VendorBillClient.prototype.SaveVendorBillNotesDetail = function (vendorBillNotesContainer, successCallBack, faliureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/SaveVendorBillNotesDetail", vendorBillNotesContainer).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                faliureCallBack(message);
                self.failureProxyCallback('SaveVendorBillNotesDetail', message);
            });
        };

        //#endregion
        // gets the model after uploading the file
        VendorBillClient.prototype.uploadAndGetUploadedResponse = function (uploadModel, successCallBack, failCallBack) {
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
        VendorBillClient.prototype.deletePodDoc = function (documentId, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/DeleteVendorBillFile/?documentId=' + documentId;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, documentId).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('DeleteVendorBillFile', arg);
                failCallBack();
            });
        };

        //Updates the selected Sales Order POD Document
        VendorBillClient.prototype.updatePodDoc = function (uploadModel, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/UpdateVendorBillFile';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, uploadModel).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('UpdateVendorBillFile', arg);
                failCallBack();
            });
        };

        // gets the model after uploading the file
        VendorBillClient.prototype.getVendorBillPodDocDetails = function (salesOrderUploadFileModel, successCallBack, failCallBack) {
            var self = this;
            var url = 'Accounting/GetVendorBillPodDocDetails';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, salesOrderUploadFileModel).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('GetVendorBillPodDocDetails', arg);
                failCallBack();
            });
        };

        VendorBillClient.prototype.ForcePushBillToMas = function (vendorBillId, updatedDate, successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/ForcePushBillToMas/?vendorBillId=' + vendorBillId + '&updatedDate=' + updatedDate;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                failureCallBack(arg);
                self.failureProxyCallback('ForcePushBillToMas', arg);
            });
        };

        VendorBillClient.prototype.RevertBillFromIdb = function (vendorBillId, updatedDate, successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/RevertBillFromIdb/?vendorBillId=' + vendorBillId + '&updatedDate=' + updatedDate;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                failureCallBack(arg);
                self.failureProxyCallback('RevertBillFromIdb', arg);
            });
        };

        VendorBillClient.prototype.IsForceAttachingWithRexnorBol = function (bolNumber, successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/IsBolRelatedToLogOnUserRole/?bolNumber=' + bolNumber;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                failureCallBack(arg);
                self.failureProxyCallback('IsBolRelatedToLogOnUserRole', arg);
            });
        };

        //## Service to get the history details of the sales order by Version Id#/
        VendorBillClient.prototype.GetVendorBillHistoryDetailsByVersionId = function (vendorBillId, VersionId, headerType, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var url = 'Accounting/GetVendorBillHistoryDetailsByVersionId/?vendorBillId=' + vendorBillId + '&versionId=' + VersionId + '&tabType=' + headerType;
            if (VersionId) {
                ajax.get(url).done(function (message) {
                    successCallBack(message);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetVendorBillHistoryDetailsByVersionId', message);
                });
            } else if (failureCallBack && typeof failureCallBack === 'function') {
                failureCallBack("VersionId ID is zero.");
            }
            // ##END: DE23006
        };

        // Get the vendor bill details by vendor bill id
        VendorBillClient.prototype.getVendorBillDetailsForLostBill = function (vendorBillId, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetVendorBillDetailsForLostBill/?vendorBillId=' + vendorBillId;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                faliureCallBack();
                self.failureProxyCallback('getVendorBillDetailsForLostBill', arg);
            });
        };

        // ##START: US25684
        // get the list of reassignment reasons
        VendorBillClient.prototype.GetVendorBillReassignmentReasons = function (successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/GetVendorBillReassignmentReasons';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                failureCallBack(arg);
                self.failureProxyCallback('GetVendorBillReassignmentReasons', arg);
            });
        };

        // save the data from vb reassignment popup
        VendorBillClient.prototype.SaveVendorBillReassignment = function (vendorBillReassignmentDetails, successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/SaveVendorBillReassignment';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post(url, vendorBillReassignmentDetails).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('SaveVendorBillReassignment', arg);
                failureCallBack();
            });
        };

        // ##END: US25684
        // ###START: US26955
        // Validates the reassigned order
        VendorBillClient.prototype.validateReassignedOrder = function (bolNumber, successCallBack, failureCallBack) {
            var self = this;
            var url = 'Accounting/ValidateReassignOrder/?bolNumber=' + bolNumber;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.get(url, bolNumber).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                self.failureProxyCallback('validateReassignedOrder', arg);
                failureCallBack();
            });
        };

        // ###END: US26955
        //#endregion
        //#region Private Methods
        // For Log the Error record
        VendorBillClient.prototype.failureProxyCallback = function (context, error) {
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
        return VendorBillClient;
    })();
    exports.VendorBillClient = VendorBillClient;

    var SearchModel = (function () {
        // ###END: US21085
        //constructor(searchValue: string, sortOrder: string, sortCol: string, pageNumber: number, pageSize: number, filterItems: Array<any>, gridViewId?: number, vendorName?: string, proNumber?: string, fromDate?: Date, toDate?: Date, selectedExceptionRule?: number, exportType?:number ) {
        //	this.SearchValue = searchValue;
        //	this.PageNumber = pageNumber;
        //	this.PageSize = pageSize;
        //    this.SortCol = sortCol;
        //	this.SortOrder = sortOrder;
        //    this.SearchFilterItems = filterItems;
        //    this.VendorName = vendorName;
        //	this.ProNumber = proNumber;
        //	this.GridViewId = gridViewId;
        //	this.FromDate = fromDate;
        //	this.ToDate = toDate;
        //	this.SelectedExceptionRule = selectedExceptionRule;
        //	this.ExportType = exportType;
        //}
        function SearchModel(args) {
            if (args) {
                this.SearchValue = args.SearchValue;
                this.PageNumber = args.PageNumber;
                this.PageSize = args.PageSize;
                this.SortCol = args.SortCol;
                this.SortOrder = args.SortOrder;
                this.SearchFilterItems = args.SearchFilterItems;
                this.VendorName = args.VendorName;
                this.ProNumber = args.ProNumber;
                this.GridViewId = args.GridViewId;
                this.FromDate = args.FromDate;
                this.ToDate = args.ToDate;
                this.SelectedExceptionRule = args.SelectedExceptionRule;
                this.ExportType = args.ExportType;
                this.CustomerId = args.CustomerId;
                this.RebillRepName = args.RebillRepName;
                this.ExportURL = refSystem.isObject(args) ? args.ExportURL : '';
                this.UploadedItem = args.UploadedItem;

                // ###START: US21085
                this.TransactionSearchRequest = args.TransactionSearchRequest;
                this.SearchFilterModel = args.SearchFilterModel;
                // ###END: US21085
            }
        }
        return SearchModel;
    })();
    exports.SearchModel = SearchModel;
});
