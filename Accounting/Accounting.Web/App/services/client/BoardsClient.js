/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports", 'durandal/system', 'durandal/app'], function(require, exports, __refSystem__, ___app__) {
    //#region References
    /// <reference path="../../../Scripts/TypeDefs/Simplex.d.ts" />
    /// <reference path="../../../Scripts/TypeDefs/jquery.d.ts" />
    /// <reference path="../../../Scripts/TypeDefs/durandal.d.ts" />
    /// <reference path="../../../Scripts/TypeDefs/utils.d.ts" />
    /// <reference path="../../../Scripts/TypeDefs/toastr.d.ts" />
    /// <reference path="../models/TypeDefs/Boards.d.ts" />
    /// <reference path="../models/vendorBill/VendorBillId.ts" />
    //#endregion
    //#region Import
    var refSystem = __refSystem__;
    var _app = ___app__;

    //#endregion
    /*
    ** <summary>
    ** Boards client server calls.
    ** </summary>
    ** <changeHistory>
    ** <id>US22708</id> <by>Vasanthakumar</by> <date>13-06-2016</date> <description>Add Carrier response column in dispute board</description>
    ** <id>DE25310</id> <by>Janakiram</by> <date>27-12-2016</date> <description>Removed Grid progress failure call</description>
    ** </changeHistory>
    */
    // Boards menu client commands
    var BoardsClientCommands = (function () {
        function BoardsClientCommands() {
        }
        //#region Public Methods
        /// Loaded the all the dispute related bills
        /// parameter: success callback, and failed call back
        BoardsClientCommands.prototype.getAllDisputeBoardDetails = function (successCallBack, failureCallback, pagingData) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            if (pagingData != undefined) {
                var searchValue = new SearchModel('', pagingData.currentPage(), pagingData.pageSize());
                ajax.post('Accounting/GetAllDisputeBoardDetails', searchValue).done(function (data) {
                    successCallBack(data);
                }).fail(function (arg) {
                    failureCallback();
                    self.failureProxyCallback('GetVendorBillStatusList', arg);
                });
            }
        };

        //To get DisputeBill Board Details
        BoardsClientCommands.prototype.getDisputeBillBoardDetails = function (disputedBillParameter, successCallBack, failureCallback, pagingData) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            if (pagingData != undefined) {
                ajax.post('Accounting/GetDisputeBoardDetails', disputedBillParameter).done(function (data) {
                    successCallBack(data);
                }).fail(function (arg) {
                    failureCallback();
                    self.failureProxyCallback('GetDisputeBoardDetails', arg);
                });
            }
        };

        //To get DisputeBill Won\Loss Details
        BoardsClientCommands.prototype.getDisputeBillWonLossDetails = function (disputedBillParameter, successCallBack, failureCallback, pagingData) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            if (pagingData != undefined) {
                ajax.post('Accounting/GetDisputeBillWonLossDetails', disputedBillParameter).done(function (data) {
                    successCallBack(data);
                }).fail(function (arg) {
                    failureCallback();
                    self.failureProxyCallback('GetDisputeBillWonLossDetails', arg);
                });
            }
        };

        //To get DisputeBill Won\Loss Details
        BoardsClientCommands.prototype.getRequoteBoardDetails = function (requoteBoardParameter, successCallBack, failureCallback, pagingData) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            if (pagingData != undefined) {
                ajax.post('Accounting/GetRequoteBoardDetails', requoteBoardParameter).done(function (data) {
                    successCallBack(data);
                }).fail(function (arg) {
                    failureCallback();
                    self.failureProxyCallback('GetRequoteBoardDetails', arg);
                });
            }
        };

        //To get Invoice Exception Board Details
        BoardsClientCommands.prototype.getInvoiceExceptionBoardDetails = function (invoiceBoardParameter, successCallBack, failureCallback, pagingData) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            if (pagingData != undefined) {
                ajax.post('Accounting/GetInvoiceExceptionBoardDetails', invoiceBoardParameter).done(function (data) {
                    successCallBack(data);
                }).fail(function (arg) {
                    failureCallback();
                    self.failureProxyCallback('getInvoiceExceptionBoardDetails', arg);
                });
            }
        };

        //## Service to Force Push Invoice Exception. #/
        BoardsClientCommands.prototype.ForcePushInvoiceExceptionDetails = function (forceInvoiceShipment, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            ajax.post("Accounting/InsertForceInvoiceShipment", forceInvoiceShipment).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('InsertForceInvoiceShipment', message);
            });
        };

        //## Service to get the Exception Details of the sales order by exception rule Id#/
        BoardsClientCommands.prototype.GetExceptionDetailsMetaSource = function (ediDetailsId, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (ediDetailsId) {
                ajax.get("Accounting/GetExceptionDetailsMetaSource/?ediDetailsId=" + ediDetailsId).done(function (data) {
                    var result = data;
                    successCallBack(result);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetExceptionDetailsMetaSource', message);
                });
            }
        };

        //## Service to get the Exception Details of the sales order by exception rule Id#/
        BoardsClientCommands.prototype.GetEDI210ExceptionDetails = function (ediDetailsId, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (ediDetailsId) {
                ajax.get("Accounting/GetEDI210ExceptionDetails/?ediDetailsId=" + ediDetailsId).done(function (data) {
                    var result = data;
                    successCallBack(result);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetEDI210ExceptionDetails', message);
                });
            }
        };

        //## Service to get the Exception Details of the sales order by exception rule Id#/
        BoardsClientCommands.prototype.GetAllCodeDescriptionStandardMappings = function (successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            ajax.get("Accounting/GetAllCodeDescriptionStandardMappings").done(function (data) {
                var result = data;
                successCallBack(result);
            }).fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('GetAllCodeDescriptionStandardMappings', message);
            });
        };

        //## Service to get the Exception Details of the sales order by exception rule Id#/
        BoardsClientCommands.prototype.GetCarrierItemCodeMappingBasedonCarrierID = function (carrierId, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            ajax.get("Accounting/GetCarrierItemCodeMappingBasedonCarrierID/?carrierId=" + carrierId).done(function (data) {
                var result = data;
                successCallBack(result);
            }).fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('GetCarrierItemCodeMappingBasedonCarrierID', message);
            });
        };

        //Get exception is resolved or not
        BoardsClientCommands.prototype.GetReprocessStatus = function (ediDetailsId, selectedExceptionType, bolNumber, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (ediDetailsId) {
                ajax.get("Accounting/GetReprocessStatus/?ediDetailsId=" + ediDetailsId + "&selectedExceptionType=" + selectedExceptionType + "&bolNumber=" + bolNumber.toString()).done(function (data) {
                    successCallBack(data);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetReprocessStatus', message);
                });
            }
        };

        BoardsClientCommands.prototype.ForceAttachFromCanceledBolEdi210 = function (ediDetailsId, carrierId, bolNumber, proNumber, successCallBack, failureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (ediDetailsId) {
                ajax.get("Accounting/Edi210CanceledExceptionForceAttachBill/?edi210DetailsId=" + ediDetailsId + "&carrierId=" + carrierId + "&bolNumber=" + bolNumber.toString() + "&proNumber=" + proNumber.toString()).done(function (data) {
                    successCallBack(data);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('ForceAttachFromCanceledBolEdi210', message);
                });
            }
        };

        //Get result EDI Make Order Inactive
        BoardsClientCommands.prototype.GetMakeOrderInactive = function (ediDetailsId, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (ediDetailsId) {
                ajax.get("Accounting/GetMakeOrderInactive/?ediDetailsId=" + ediDetailsId).done(function (data) {
                    successCallBack(data);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetMakeOrderInactive', message);
                });
            }
        };

        //## Service to get the Exception Details of the sales order by exception rule Id#/
        BoardsClientCommands.prototype.GenerateVendorBill = function (ediFileIDorEDIDetailsId, selectedExceptionRuleId, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (ediFileIDorEDIDetailsId) {
                ajax.get("Accounting/GenerateVendorBill/?ediDetailsId=" + ediFileIDorEDIDetailsId + '&exceptionRuleId=' + selectedExceptionRuleId).done(function (data) {
                    var result = data;
                    successCallBack(result);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GenerateVendorBill', message);
                });
            }

            if (failureCallBack && typeof failureCallBack === 'function') {
                failureCallBack("EDI Details Id Or EDI File Id is zero.");
            }
        };

        //## Service to get the Exception Details of the sales order by exception rule Id#/
        BoardsClientCommands.prototype.UpdateDuplicatePRODetails = function (updateDuplicatePRO, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (updateDuplicatePRO) {
                ajax.post("Accounting/UpdateDuplicatePRODetails", updateDuplicatePRO).done(function (data) {
                    successCallBack(data);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('UpdateDuplicatePRODetails', message);
                });
            }
        };

        //## Service to Create SubBill in EDI210#/
        BoardsClientCommands.prototype.createEDIRecord = function (edi210Inputparameter, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (edi210Inputparameter) {
                ajax.post("Accounting/CreateEDIRecord", edi210Inputparameter).done(function (data) {
                    successCallBack(data);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('CreateEDIRecord', message);
                });
            }

            if (failureCallBack && typeof failureCallBack === 'function') {
                failureCallBack("EDI Details Id Or EDI File Id is zero.");
            }
        };

        //To get Invoice Exception Board Details
        BoardsClientCommands.prototype.getEdi210CarrierExceptionBoardDetails = function (searchFilter, successCallBack, failureCallback, pagingData) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            if (pagingData != undefined) {
                //var searchModel = new SearchModel('', pagingData.currentPage(), pagingData.pageSize());
                //searchModel.ExceptionRuleId = exceptionRuleId;
                //searchModel.PageNumber = searchModel.PageNumber;
                //searchModel.PageSize = searchModel.PageSize;
                //searchModel.SearchValue = searchFilter.GridSearchText;
                ajax.post('Accounting/GetEdi210ExceptionBoardDetails', searchFilter).done(function (data) {
                    successCallBack(data);
                }).fail(function (arg) {
                    failureCallback();
                    self.failureProxyCallback('getInvoiceExceptionBoardDetails', arg);
                });
            }
        };

        // To Update Process Age for PO from Duplicate mapped EDI
        BoardsClientCommands.prototype.UpdateProcessAgeForPO = function (edi210InputParameter, successCallBack, failureCallBack) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (edi210InputParameter) {
                ajax.post("Accounting/UpdateProcessAgeForPO", edi210InputParameter).done(function (data) {
                    successCallBack(data);
                }).fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('UpdateProcessAgeForPO', message);
                });
            }

            if (failureCallBack && typeof failureCallBack === 'function') {
                failureCallBack("EDI Details Id Or EDI File Id is zero.");
            }
        };

        //To get DisputeBill Won\Loss Details
        BoardsClientCommands.prototype.getRequoteProcessBoard = function (requoteBoardParameter, successCallBack, failureCallback, pagingData) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            if (pagingData != undefined) {
                ajax.post('Accounting/GetSuborderExecutionBoard', requoteBoardParameter).done(function (data) {
                    successCallBack(data);
                }).fail(function (arg) {
                    failureCallback();
                    self.failureProxyCallback('GetRequoteBoardDetails', arg);
                });
            }
        };

        //Tp save the requote suborder table details
        BoardsClientCommands.prototype.saveSubOrderExecution = function (requoteBoardParameter, successCallBack, failureCallback) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post('Accounting/SaveSubOrderExecution', requoteBoardParameter).done(function (data) {
                successCallBack(data);
            }).fail(function (arg) {
                failureCallback();
                self.failureProxyCallback('SaveSubOrderExecution', arg);
            });
        };

        // To SalesOrder Rebill
        BoardsClientCommands.prototype.GetSalesOrderRebill = function (salesOrderId, successCallBack, faliureCallBack) {
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

        /// Update Carrier response Status
        /// <createDetails>
        /// <id>US22708</id> <by>Vasanthakumar</by> <date>13-06-2016</date>
        /// </createDetails>
        BoardsClientCommands.prototype.UpdateCarrierNotesTypeStatus = function (VendorBill, successCallBack, failureCallBack) {
            var self = this;

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post("Accounting/UpdateCarrierNotesTypeStatus", VendorBill).done(function (message) {
                successCallBack(message);
            }).fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('UpdateCarrierNotesTypeStatus', message);
            });
        };

        //#endregion Public Methods
        //#region Private Methods
        // For Log the Error record
        BoardsClientCommands.prototype.failureProxyCallback = function (context, error) {
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
        return BoardsClientCommands;
    })();
    exports.BoardsClientCommands = BoardsClientCommands;

    var SearchModel = (function () {
        function SearchModel(searchValue, pageNumber, pageSize) {
            this.SearchValue = searchValue;
            this.PageNumber = pageNumber;
            this.PageSize = pageSize;
        }
        return SearchModel;
    })();
});
