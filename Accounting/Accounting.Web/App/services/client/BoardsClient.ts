/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

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
import refSystem = require('durandal/system');
import _app = require('durandal/app');
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
export class BoardsClientCommands {
    //#region Public Methods
    /// Loaded the all the dispute related bills
    /// parameter: success callback, and failed call back
    public getAllDisputeBoardDetails(successCallBack: Function, failureCallback: Function, pagingData?) {
        var self = this;

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        if (pagingData != undefined) {
            var searchValue = new SearchModel('', pagingData.currentPage(), pagingData.pageSize());
            ajax.post('Accounting/GetAllDisputeBoardDetails', searchValue)
                .done((data) => {
                    successCallBack(data);
                })
                .fail((arg) => {
                    failureCallback();
                    self.failureProxyCallback('GetVendorBillStatusList', arg);
                });
        }
    }

    //To get DisputeBill Board Details
    public getDisputeBillBoardDetails(disputedBillParameter: any, successCallBack: Function, failureCallback: Function, pagingData?) {
        var self = this;

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        if (pagingData != undefined) {
            ajax.post('Accounting/GetDisputeBoardDetails', disputedBillParameter)
                .done((data) => {
                    successCallBack(data);
                })
                .fail((arg) => {
                    failureCallback();
                    self.failureProxyCallback('GetDisputeBoardDetails', arg);
                });
        }
    }

    //To get DisputeBill Won\Loss Details
    public getDisputeBillWonLossDetails(disputedBillParameter: any, successCallBack: Function, failureCallback: Function, pagingData?) {
        var self = this;

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        if (pagingData != undefined) {
            ajax.post('Accounting/GetDisputeBillWonLossDetails', disputedBillParameter)
                .done((data) => {
                    successCallBack(data);
                })
                .fail((arg) => {
                    failureCallback();
                    self.failureProxyCallback('GetDisputeBillWonLossDetails', arg);
                });
        }
    }

    //To get DisputeBill Won\Loss Details
    public getRequoteBoardDetails(requoteBoardParameter: any, successCallBack: Function, failureCallback: Function, pagingData?) {
        var self = this;

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        if (pagingData != undefined) {
            ajax.post('Accounting/GetRequoteBoardDetails', requoteBoardParameter)
                .done((data) => {
                    successCallBack(data);
                })
                .fail((arg) => {
                    failureCallback();
                    self.failureProxyCallback('GetRequoteBoardDetails', arg);
                });
        }
    }

    //To get Invoice Exception Board Details
    public getInvoiceExceptionBoardDetails(invoiceBoardParameter: any, successCallBack: Function, failureCallback: Function, pagingData?) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        if (pagingData != undefined) {
            ajax.post('Accounting/GetInvoiceExceptionBoardDetails', invoiceBoardParameter)
                .done((data) => {
                    successCallBack(data);
                })
                .fail((arg) => {
                    failureCallback();
                    self.failureProxyCallback('getInvoiceExceptionBoardDetails', arg);
                });
        }
    }

    //## Service to Force Push Invoice Exception. #/
    public ForcePushInvoiceExceptionDetails(forceInvoiceShipment: IForceInvoiceShipment, successCallBack, failureCallBack) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

        ajax.post("Accounting/InsertForceInvoiceShipment", forceInvoiceShipment)
            .done(function (message) { successCallBack(message); })
            .fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('InsertForceInvoiceShipment', message);
            });
    }

    //## Service to get the Exception Details of the sales order by exception rule Id#/
    public GetExceptionDetailsMetaSource(ediDetailsId: number, successCallBack, failureCallBack) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

        if (ediDetailsId) {
            ajax.get("Accounting/GetExceptionDetailsMetaSource/?ediDetailsId=" + ediDetailsId)
                .done((data) => {
                    var result: IEdi210DuplicateExceptionDetailsContainer = data;
                    successCallBack(result);
                })
                .fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetExceptionDetailsMetaSource', message);
                });
        }
    }

    //## Service to get the Exception Details of the sales order by exception rule Id#/
    public GetEDI210ExceptionDetails(ediDetailsId: number, successCallBack, failureCallBack) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

        if (ediDetailsId) {
            ajax.get("Accounting/GetEDI210ExceptionDetails/?ediDetailsId=" + ediDetailsId)
                .done((data) => {
                    var result: IEDI210ExceptionDetailsContainer = data;
                    successCallBack(result);
                })
                .fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetEDI210ExceptionDetails', message);
                });
        }
    }

    //## Service to get the Exception Details of the sales order by exception rule Id#/
    public GetAllCodeDescriptionStandardMappings(successCallBack, failureCallBack) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

        ajax.get("Accounting/GetAllCodeDescriptionStandardMappings")
            .done((data) => {
                var result: IItemCodeDescriptionStandardMappings = data;
                successCallBack(result);
            })
            .fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('GetAllCodeDescriptionStandardMappings', message);
            });
    }

    //## Service to get the Exception Details of the sales order by exception rule Id#/
    public GetCarrierItemCodeMappingBasedonCarrierID(carrierId: number, successCallBack, failureCallBack) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

        ajax.get("Accounting/GetCarrierItemCodeMappingBasedonCarrierID/?carrierId=" + carrierId)
            .done((data) => {
                var result: IItemCodeDescriptionStandardMappings = data;
                successCallBack(result);
            })
            .fail(function (message) {
                if (failureCallBack) {
                    failureCallBack(message);
                }
                self.failureProxyCallback('GetCarrierItemCodeMappingBasedonCarrierID', message);
            });
    }

    //Get exception is resolved or not
    public GetReprocessStatus(ediDetailsId: number, selectedExceptionType: number, bolNumber: string, successCallBack, failureCallBack) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

        if (ediDetailsId) {
            ajax.get("Accounting/GetReprocessStatus/?ediDetailsId=" + ediDetailsId + "&selectedExceptionType=" + selectedExceptionType + "&bolNumber=" + bolNumber.toString())
                .done((data) => {
                    successCallBack(data);
                })
                .fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetReprocessStatus', message);
                });
        }
    }

    public ForceAttachFromCanceledBolEdi210(ediDetailsId: number, carrierId: number, bolNumber: string, proNumber: string, successCallBack, failureCallBack) {
        var self = this;

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

        if (ediDetailsId) {
            ajax.get("Accounting/Edi210CanceledExceptionForceAttachBill/?edi210DetailsId=" + ediDetailsId + "&carrierId=" + carrierId + "&bolNumber=" + bolNumber.toString() + "&proNumber=" + proNumber.toString())
                .done((data) => {
                    successCallBack(data);
                })
                .fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('ForceAttachFromCanceledBolEdi210', message);
                });
        }
    }

    //Get result EDI Make Order Inactive
    public GetMakeOrderInactive(ediDetailsId: number, successCallBack, failureCallBack) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

        if (ediDetailsId) {
            ajax.get("Accounting/GetMakeOrderInactive/?ediDetailsId=" + ediDetailsId)
                .done((data) => {
                    successCallBack(data);
                })
                .fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GetMakeOrderInactive', message);
                });
        }
    }

    //## Service to get the Exception Details of the sales order by exception rule Id#/
    public GenerateVendorBill(ediFileIDorEDIDetailsId: number, selectedExceptionRuleId: number, successCallBack, failureCallBack) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

        if (ediFileIDorEDIDetailsId) {
            ajax.get("Accounting/GenerateVendorBill/?ediDetailsId=" + ediFileIDorEDIDetailsId + '&exceptionRuleId=' + selectedExceptionRuleId)
                .done((data) => {
                    var result: IGenerateVendorBillContainer = data;
                    successCallBack(result);
                })
                .fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('GenerateVendorBill', message);
                });
        }

        // Set grid progress false
        if (failureCallBack && typeof failureCallBack === 'function') {
            failureCallBack("EDI Details Id Or EDI File Id is zero.");
        }
    }

    //## Service to get the Exception Details of the sales order by exception rule Id#/
    public UpdateDuplicatePRODetails(updateDuplicatePRO: any, successCallBack, failureCallBack) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

        if (updateDuplicatePRO) {
            ajax.post("Accounting/UpdateDuplicatePRODetails", updateDuplicatePRO)
                .done((data) => {
                    successCallBack(data);
                })
                .fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('UpdateDuplicatePRODetails', message);
                });
        }
    }

    //## Service to Create SubBill in EDI210#/
    public createEDIRecord(edi210Inputparameter: any, successCallBack, failureCallBack) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

        if (edi210Inputparameter) {
            ajax.post("Accounting/CreateEDIRecord", edi210Inputparameter)
                .done((data) => {
                    successCallBack(data);
                })
                .fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('CreateEDIRecord', message);
                });
        }

        // Set grid progress false
        if (failureCallBack && typeof failureCallBack === 'function') {
            failureCallBack("EDI Details Id Or EDI File Id is zero.");
        }
    }

    //To get Invoice Exception Board Details
    public getEdi210CarrierExceptionBoardDetails(searchFilter: any, successCallBack: Function, failureCallback: Function, pagingData?) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        if (pagingData != undefined) {
            //var searchModel = new SearchModel('', pagingData.currentPage(), pagingData.pageSize());
            //searchModel.ExceptionRuleId = exceptionRuleId;
            //searchModel.PageNumber = searchModel.PageNumber;
            //searchModel.PageSize = searchModel.PageSize;
            //searchModel.SearchValue = searchFilter.GridSearchText;
            ajax.post('Accounting/GetEdi210ExceptionBoardDetails', searchFilter)
                .done((data) => {
                    successCallBack(data);
                })
                .fail((arg) => {
                    failureCallback();
                    self.failureProxyCallback('getInvoiceExceptionBoardDetails', arg);
                });
        }
    }

    // To Update Process Age for PO from Duplicate mapped EDI
    public UpdateProcessAgeForPO(edi210InputParameter: any, successCallBack, failureCallBack) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

        if (edi210InputParameter) {
            ajax.post("Accounting/UpdateProcessAgeForPO", edi210InputParameter)
                .done((data) => {
                    successCallBack(data);
                })
                .fail(function (message) {
                    if (failureCallBack) {
                        failureCallBack(message);
                    }
                    self.failureProxyCallback('UpdateProcessAgeForPO', message);
                });
        }

        // Set grid progress false
        if (failureCallBack && typeof failureCallBack === 'function') {
            failureCallBack("EDI Details Id Or EDI File Id is zero.");
        }
    }

    //To get DisputeBill Won\Loss Details
    public getRequoteProcessBoard(requoteBoardParameter: any, successCallBack: Function, failureCallback: Function, pagingData?) {
        var self = this;

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        if (pagingData != undefined) {
            ajax.post('Accounting/GetSuborderExecutionBoard', requoteBoardParameter)
                .done((data) => {
                    successCallBack(data);
                })
                .fail((arg) => {
                    failureCallback();
                    self.failureProxyCallback('GetRequoteBoardDetails', arg);
                });
        }
    }

    //Tp save the requote suborder table details
    public saveSubOrderExecution(requoteBoardParameter: any, successCallBack: Function, failureCallback: Function) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.post('Accounting/SaveSubOrderExecution', requoteBoardParameter)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                failureCallback();
                self.failureProxyCallback('SaveSubOrderExecution', arg);
            });
    }

    // To SalesOrder Rebill
    public GetSalesOrderRebill(salesOrderId: string, successCallBack: Function, faliureCallBack: Function) {
        var self = this;
        var url: string = 'Accounting/GetSalesOrderRebill/?salesOrderId=' + salesOrderId;

        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        ajax.get(url)
            .done((data) => {
                successCallBack(data);
            })
            .fail((arg) => {
                self.failureProxyCallback('GetSalesOrderRebill', arg);
                faliureCallBack();
            });
    }

	/// Update Carrier response Status
	/// <createDetails>
	/// <id>US22708</id> <by>Vasanthakumar</by> <date>13-06-2016</date>
	/// </createDetails>
	public UpdateCarrierNotesTypeStatus(VendorBill: any, successCallBack: Function, failureCallBack?: Function) {
		var self = this;

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post("Accounting/UpdateCarrierNotesTypeStatus", VendorBill)
			.done(function (message) {				
					successCallBack(message);
			})
			.fail(function (message) {
				if (failureCallBack) {
					failureCallBack(message);
				}
				self.failureProxyCallback('UpdateCarrierNotesTypeStatus', message);
			});
	}

    //#endregion Public Methods

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

    //#endregion
}

class SearchModel {
    // ReSharper disable once InconsistentNaming
    SearchValue: string;
    // ReSharper disable once InconsistentNaming
    PageSize: number;
    // ReSharper disable once InconsistentNaming
    PageNumber: number;
    //to hold Exception RuleId
    ExceptionRuleId: number
	constructor(searchValue: string, pageNumber: number, pageSize: number) {
        this.SearchValue = searchValue;
        this.PageNumber = pageNumber;
        this.PageSize = pageSize;
    }
}