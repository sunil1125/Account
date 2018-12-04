/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created : Aug 21, 2014
** Created By Achal Rastogi
*/

//#region References
/// <reference path="../../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/Simplex.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/toastr.d.ts" />
/// <reference path="../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../models/TypeDefs/Report.d.ts" />
//#endregion

//#region Import
import refSystem = require('durandal/system');
import _app = require('durandal/app');
import _disputeBoardReport = require('services/models/report/DisputeBoardReportDetail');
import _vendorBillTrackingReport = require('services/models/report/VendorBillTrackingReport');
import _vendorBillExceptionReport = require('services/models/report/VendorBillExceptionReport');
import _finalizedOrderWithNoVendorBillsReport = require('services/models/report/FinalizedOrderWithNoVendorBills');
import _soFinalizedNotInvoicedReport = require('services/models/report/SalesOrderFinalizedNotInvoiced');
import _rexnordInvoicingReport = require('services/models/report/RexnordInvoicingReport');
import _rebillSummaryReport = require('services/models/report/RebillSummaryReport');
import _disputedVendorBillsReport = require('services/models/report/DisputedVendorBills');
import _rebillReasonsReport = require('services/models/report/RebillReasonsReport');
import _orderRebillReport = require('services/models/report/OrderRebillReport');

//#endregion

/*
** <summary>
** Report Client.
** </summary>
** <createDetails>
** ** </createDetails>
** <changeHistory>
** <id>US20913</id> <by>Baldev Singh Thakur</by> <date>25-02-2016</date> <description>Reading data for VB tracking report from .csv</description>
** </changeHistory>
*/

export class PaginationObject {
	public TotalCount: number;
	public range: Array
	constructor(totalcount: number, range: Array) {
		this.TotalCount = totalcount;
		this.range = range;
	}
}

export class ReportClient {
	//#region Public Methods

	//For Getting vendor bill tracking report
	public getVendorBillTrackingReport(boardReportRequest: IBoardReportRequest, successCallBack: Function, faliureCallBack: Function) {
		var self = this;
		if (boardReportRequest != undefined) {
			var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
			ajax.post('Accounting/GetVendorBillTrackingReport', boardReportRequest)
				.done((data) => {
					var newItems = ko.utils.arrayMap(data.VendorBillTrackingReports, function (item: IVendorBillTrackingReport) {
						return new _vendorBillTrackingReport.Models.VendorBillTrackingReport(item);
					});
					var newObj = new PaginationObject(data.TotalRowCount, newItems);
					successCallBack(newObj);
				})
				.fail((arg) => {
					self.failureProxyCallback('getVendorBillTrackingReport', arg);
				});
		}
	}

	//For Getting vendor bill Exception report
	public getVendorBillExceptionReport(boardReportRequest: IBoardReportRequest, successCallBack: Function, faliureCallBack: Function) {
		var self = this;
		if (boardReportRequest != undefined) {
			var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
			ajax.post('Accounting/GetVendorBillExceptionReport', boardReportRequest)
				.done((data) => {
					var newItems = ko.utils.arrayMap(data.VendorBillExceptionReports, function (item: IVendorBillExceptionReport) {
						return new _vendorBillExceptionReport.Models.VendorBillExceptionReport(item);
					});
					var newObj = new PaginationObject(data.TotalRowCount, newItems);
					successCallBack(newObj);
				})
				.fail((arg) => {
					self.failureProxyCallback('getVendorBillExceptionReport', arg);
				});
		}
	}

	//For Getting Dispute Board Details Report
	public getDisputeBoardDetaisReport(boardReportRequest: IBoardReportRequest, successCallBack: Function, failureCallBack: Function) {
		var self = this;
		if (boardReportRequest != undefined) {
			var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
			ajax.post('Accounting/GetDisputeBoardReportDetail', boardReportRequest)
				.done((data) => {
					var newItems = ko.utils.arrayMap(data.DisputeBoardReportDetails, function (item: IDisputeBoardDetailsReport) {
						return new _disputeBoardReport.Models.DisputeBoardDetailsReport(item);
					});
					var newObj = new PaginationObject(data.TotalRowCount, newItems);
					successCallBack(newObj);
				})
				.fail((arg) => {
					self.failureProxyCallback('getDisputeBoardDetaisReport', arg);
				});
		}
	}

	//For Getting Finalized Orders With No VendorBills
	public getFinalizedOrderWithNoVendorBills(boardReportRequest: IBoardReportRequest, successCallBack: Function, failureCallBack: Function) {
		var self = this;
		if (boardReportRequest != undefined) {
			var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
			ajax.post('Accounting/GetFinalizedOrderWithNoVendorBillsReport', boardReportRequest)
				.done((data) => {
					var newItems = ko.utils.arrayMap(data.FinalizedOrderWithNoVendorBillsReport, function (item: IFinalizedOrderWithNoVendorBills) {
						return new _finalizedOrderWithNoVendorBillsReport.Models.FinalizedOrderWithNoVendorBillsReport(item);
					});
					var newObj = new PaginationObject(data.TotalRowCount, newItems);
					successCallBack(newObj);
				})
				.fail((arg) => {
					self.failureProxyCallback('getFinalizedOrderWithNoVendorBills', arg);
					failureCallBack();
				});
		}
	}

	//For Getting Finalized Orders With No VendorBills
	public getSalesOrderFinalizedNotInvoiced(boardReportRequest: IBoardReportRequest, successCallBack: Function, failureCallBack: Function) {
		var self = this;
		if (boardReportRequest != undefined) {
			var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
			ajax.post('Accounting/GetSalesOrderFinalizedNotInvoicedReport', boardReportRequest)
				.done((data) => {
					var newItems = ko.utils.arrayMap(data.SalesOrderFinalizedNotInvoicedReport, function (item: ISalesOrderFinalizedNotInvoiced) {
						return new _soFinalizedNotInvoicedReport.Models.SalesOrderFinalizedNotInvoicedReport(item);
					});
					var newObj = new PaginationObject(data.TotalRowCount, newItems);
					successCallBack(newObj);
				})
				.fail((arg) => {
					self.failureProxyCallback('getSalesOrderFinalizedNotInvoiced', arg);
					failureCallBack();
				});
		}
	}

	//For Getting Finalized Orders With No VendorBills
	public GetRexnordInvoicingReport(boardReportRequest: IBoardReportRequest, successCallBack: Function, failureCallBack: Function) {
		var self = this;
		if (boardReportRequest != undefined) {
			var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
			ajax.post('Accounting/GetRexnordInvoicingReport', boardReportRequest)
				.done((data) => {
					var newItems = ko.utils.arrayMap(data.RexnordInvoicingReport, function (item: IRexnordInvoicingReport) {
						return new _rexnordInvoicingReport.Models.RexnordInvoicingReport(item);
					});
					var newObj = new PaginationObject(data.TotalRowCount, newItems);
					successCallBack(newObj);
				})
				.fail((arg) => {
					self.failureProxyCallback('GetRexnordInvoicingReport', arg);
					failureCallBack();
				});
		}
    }

    //For fetching Re Bill Summary Report
    public getRebillSummaryReport(boardReportRequest: IBoardReportRequest, successCallBack: Function, failureCallBack: Function) {
        var self = this;
        if (boardReportRequest != undefined) {
            var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post('Accounting/GetRebillSummaryReport', boardReportRequest)
                .done((data) => {
					var obj = new PaginationObject(data.TotalRowCount, data.RebillSummaryReport);
                    successCallBack(obj);
                })
                .fail((args) => {
                    self.failureProxyCallback('GetRebillSummaryReport', args);
                    failureCallBack();
                });
        }
    }

    //For fetching Order Rebill Report
    public getOrderRebillReport(boardReportRequest: IBoardReportRequest, successCallBack: Function, failureCallBack: Function) {
        var self = this;
        if (boardReportRequest != undefined) {
            var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post('Accounting/GetOrderRebillReport', boardReportRequest)
                .done((data) => {
                    var newItems = ko.utils.arrayMap(data.OrderRebillReport, function (item: IOrderRebillReport) {
                        return new _orderRebillReport.Models.OrderRebillReport(item);
                    });
                    var newObj = new PaginationObject(data.TotalRowCount, newItems);
                    successCallBack(newObj);
                })
                .fail((arg) => {
                    self.failureProxyCallback('getOrderRebillReport', arg);
                    failureCallBack();
                });
        }
    }

    public getCrrRebillRepList(boardReportRequest: IBoardReportRequest, successCallBack: Function, failureCallBack: Function) {
        var self = this;
        if (boardReportRequest != undefined) {
            var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post('Accounting/GetRebillRepList', boardReportRequest)
                .done((data) => {
                    successCallBack(data);
                })
                .fail((args) => {
                    failureCallBack(args);
                    self.failureProxyCallback('getCrrRebillRepList', args);
                });
        }
    }

    // To upload document of Matching report
    public UploadMatchingReportDetails(uploadReportsFileDetails: any, successCallback: Function, failureCallback: Function) {
        var self = this;
        var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
        return ajax.post('Accounting/UploadMatchingReportDetails', uploadReportsFileDetails)
            .done((data) => {
                successCallback(data);
            })
            .fail((arg) => {
                failureCallback(arg);
                self.failureProxyCallback('UploadMatchingReportDetails', arg);
            });
    }

    // get Disputed Vendor Bills Report Data Based on filter criteria.
    public getDisputedVendorBillsReport(boardReportRequest: IBoardReportRequest, successCallBack: Function, failureCallBack: Function) {
        var self = this;
        if (boardReportRequest != undefined) {
            var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post('Accounting/GetDisputedVendorBillsReport', boardReportRequest)
                .done((data) => {
                    var newItems = ko.utils.arrayMap(data.DisputedVendorBillsReport, function (item: IDisputedVendorBills) {
                        return new _disputedVendorBillsReport.Models.DisputedVendorBillsReport(item);
                    });
                    var newObj = new PaginationObject(data.TotalRowCount, newItems);
                    successCallBack(newObj);
                })
                .fail((arg) => {
                    self.failureProxyCallback('getDisputedVendorBillsReport', arg);
                    failureCallBack();
                });
        }
    }

    // get ReBill Reasons Report Data Based on filter criteria.
    public getRebillReasonsReport(boardReportRequest: IBoardReportRequest, successCallBack: Function, failureCallBack: Function) {
        var self = this;
        if (boardReportRequest != undefined) {
            var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post('Accounting/GetRebillReasonsReport', boardReportRequest)
                .done((data) => {
                    var newItems = ko.utils.arrayMap(data.RebillReasonsReport, function (item: IRebillReasonsReport) {
                        return new _rebillReasonsReport.Models.RebillReasonsReport(item);
                    });
                    var newObj = new PaginationObject(data.TotalRowCount, newItems);
                    successCallBack(newObj);
                })
                .fail((arg) => {
                    self.failureProxyCallback('getRebillReasonsReport', arg);
                    failureCallBack();
                });
        }
    }

    // get weekly dashboard rexnord Report Data Based on filter criteria.
    public getWeeklyDashboardRexnordReport(boardReportRequest: IBoardReportRequest, successCallBack: Function, failureCallBack: Function) {
        var self = this;
        if (boardReportRequest != undefined) {
            var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post('Accounting/GetWeeklyDashboardRexnordReport', boardReportRequest)
                .done((data) => {
                    successCallBack(data);
                })
                .fail((arg) => {
                    self.failureProxyCallback('getWeeklyDashboardRexnordReport', arg);
                    failureCallBack();
                });
        }
    }

    // get weekly dashboard rexnord Report Data Based on filter criteria.
    public getLostCostReport(boardReportRequest: IBoardReportRequest, successCallBack: Function, failureCallBack: Function) {
        var self = this;
        if (boardReportRequest != undefined) {
            var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post('Accounting/GetLostCostOpportunityForRexnordReport', boardReportRequest)
                .done((data) => {
                    successCallBack(data);
                })
                .fail((arg) => {
                    self.failureProxyCallback('getLostCostReport', arg);
                    failureCallBack();
                });
        }
    }

    //For fetching Re Bill Summary Report
    public getRexnordPostAuditReport(boardReportRequest: IBoardReportRequest, successCallBack: Function, failureCallBack: Function) {
        var self = this;
        if (boardReportRequest != undefined) {
            var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            ajax.post('Accounting/GetRexnordPostAuditReport', boardReportRequest)
                .done((data) => {
                    successCallBack(data);
                })
                .fail((args) => {
                    self.failureProxyCallback('GetRexnordPostAuditReport', args);
                    failureCallBack();
                });
        }
	}

	// ###START: US20913
	public getVendorBillTrackingReportFromCSV(uploadedItem: any, successCallBack: Function, faliureCallBack: Function) {
		var self = this;
		var url: string = 'Accounting/GetVendorBillTrackingReportFromCSV';

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

		if (uploadedItem) {
			ajax.post(url, uploadedItem)
				.done((message) => { successCallBack(message); })
				.fail((message) => {
					faliureCallBack(message);
					self.failureProxyCallback('getVendorBillTrackingReportFromCSV', message);
				});
		}
	}

	// ###END: US20913
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

	//#endregion
}