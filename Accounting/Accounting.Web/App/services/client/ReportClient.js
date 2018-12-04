/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created : Aug 21, 2014
** Created By Achal Rastogi
*/
define(["require", "exports", 'durandal/system', 'durandal/app', 'services/models/report/DisputeBoardReportDetail', 'services/models/report/VendorBillTrackingReport', 'services/models/report/VendorBillExceptionReport', 'services/models/report/FinalizedOrderWithNoVendorBills', 'services/models/report/SalesOrderFinalizedNotInvoiced', 'services/models/report/RexnordInvoicingReport', 'services/models/report/DisputedVendorBills', 'services/models/report/RebillReasonsReport', 'services/models/report/OrderRebillReport'], function(require, exports, __refSystem__, ___app__, ___disputeBoardReport__, ___vendorBillTrackingReport__, ___vendorBillExceptionReport__, ___finalizedOrderWithNoVendorBillsReport__, ___soFinalizedNotInvoicedReport__, ___rexnordInvoicingReport__, ___disputedVendorBillsReport__, ___rebillReasonsReport__, ___orderRebillReport__) {
    //#region References
    /// <reference path="../../../Scripts/TypeDefs/jquery.d.ts" />
    /// <reference path="../../../Scripts/TypeDefs/durandal.d.ts" />
    /// <reference path="../../../Scripts/TypeDefs/Simplex.d.ts" />
    /// <reference path="../../../Scripts/TypeDefs/toastr.d.ts" />
    /// <reference path="../../../Scripts/TypeDefs/utils.d.ts" />
    /// <reference path="../models/TypeDefs/Report.d.ts" />
    //#endregion
    //#region Import
    var refSystem = __refSystem__;
    var _app = ___app__;
    var _disputeBoardReport = ___disputeBoardReport__;
    var _vendorBillTrackingReport = ___vendorBillTrackingReport__;
    var _vendorBillExceptionReport = ___vendorBillExceptionReport__;
    var _finalizedOrderWithNoVendorBillsReport = ___finalizedOrderWithNoVendorBillsReport__;
    var _soFinalizedNotInvoicedReport = ___soFinalizedNotInvoicedReport__;
    var _rexnordInvoicingReport = ___rexnordInvoicingReport__;
    
    var _disputedVendorBillsReport = ___disputedVendorBillsReport__;
    var _rebillReasonsReport = ___rebillReasonsReport__;
    var _orderRebillReport = ___orderRebillReport__;

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
    var PaginationObject = (function () {
        function PaginationObject(totalcount, range) {
            this.TotalCount = totalcount;
            this.range = range;
        }
        return PaginationObject;
    })();
    exports.PaginationObject = PaginationObject;

    var ReportClient = (function () {
        function ReportClient() {
        }
        //#region Public Methods
        //For Getting vendor bill tracking report
        ReportClient.prototype.getVendorBillTrackingReport = function (boardReportRequest, successCallBack, faliureCallBack) {
            var self = this;
            if (boardReportRequest != undefined) {
                var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
                ajax.post('Accounting/GetVendorBillTrackingReport', boardReportRequest).done(function (data) {
                    var newItems = ko.utils.arrayMap(data.VendorBillTrackingReports, function (item) {
                        return new _vendorBillTrackingReport.Models.VendorBillTrackingReport(item);
                    });
                    var newObj = new PaginationObject(data.TotalRowCount, newItems);
                    successCallBack(newObj);
                }).fail(function (arg) {
                    self.failureProxyCallback('getVendorBillTrackingReport', arg);
                });
            }
        };

        //For Getting vendor bill Exception report
        ReportClient.prototype.getVendorBillExceptionReport = function (boardReportRequest, successCallBack, faliureCallBack) {
            var self = this;
            if (boardReportRequest != undefined) {
                var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
                ajax.post('Accounting/GetVendorBillExceptionReport', boardReportRequest).done(function (data) {
                    var newItems = ko.utils.arrayMap(data.VendorBillExceptionReports, function (item) {
                        return new _vendorBillExceptionReport.Models.VendorBillExceptionReport(item);
                    });
                    var newObj = new PaginationObject(data.TotalRowCount, newItems);
                    successCallBack(newObj);
                }).fail(function (arg) {
                    self.failureProxyCallback('getVendorBillExceptionReport', arg);
                });
            }
        };

        //For Getting Dispute Board Details Report
        ReportClient.prototype.getDisputeBoardDetaisReport = function (boardReportRequest, successCallBack, failureCallBack) {
            var self = this;
            if (boardReportRequest != undefined) {
                var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
                ajax.post('Accounting/GetDisputeBoardReportDetail', boardReportRequest).done(function (data) {
                    var newItems = ko.utils.arrayMap(data.DisputeBoardReportDetails, function (item) {
                        return new _disputeBoardReport.Models.DisputeBoardDetailsReport(item);
                    });
                    var newObj = new PaginationObject(data.TotalRowCount, newItems);
                    successCallBack(newObj);
                }).fail(function (arg) {
                    self.failureProxyCallback('getDisputeBoardDetaisReport', arg);
                });
            }
        };

        //For Getting Finalized Orders With No VendorBills
        ReportClient.prototype.getFinalizedOrderWithNoVendorBills = function (boardReportRequest, successCallBack, failureCallBack) {
            var self = this;
            if (boardReportRequest != undefined) {
                var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
                ajax.post('Accounting/GetFinalizedOrderWithNoVendorBillsReport', boardReportRequest).done(function (data) {
                    var newItems = ko.utils.arrayMap(data.FinalizedOrderWithNoVendorBillsReport, function (item) {
                        return new _finalizedOrderWithNoVendorBillsReport.Models.FinalizedOrderWithNoVendorBillsReport(item);
                    });
                    var newObj = new PaginationObject(data.TotalRowCount, newItems);
                    successCallBack(newObj);
                }).fail(function (arg) {
                    self.failureProxyCallback('getFinalizedOrderWithNoVendorBills', arg);
                    failureCallBack();
                });
            }
        };

        //For Getting Finalized Orders With No VendorBills
        ReportClient.prototype.getSalesOrderFinalizedNotInvoiced = function (boardReportRequest, successCallBack, failureCallBack) {
            var self = this;
            if (boardReportRequest != undefined) {
                var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
                ajax.post('Accounting/GetSalesOrderFinalizedNotInvoicedReport', boardReportRequest).done(function (data) {
                    var newItems = ko.utils.arrayMap(data.SalesOrderFinalizedNotInvoicedReport, function (item) {
                        return new _soFinalizedNotInvoicedReport.Models.SalesOrderFinalizedNotInvoicedReport(item);
                    });
                    var newObj = new PaginationObject(data.TotalRowCount, newItems);
                    successCallBack(newObj);
                }).fail(function (arg) {
                    self.failureProxyCallback('getSalesOrderFinalizedNotInvoiced', arg);
                    failureCallBack();
                });
            }
        };

        //For Getting Finalized Orders With No VendorBills
        ReportClient.prototype.GetRexnordInvoicingReport = function (boardReportRequest, successCallBack, failureCallBack) {
            var self = this;
            if (boardReportRequest != undefined) {
                var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
                ajax.post('Accounting/GetRexnordInvoicingReport', boardReportRequest).done(function (data) {
                    var newItems = ko.utils.arrayMap(data.RexnordInvoicingReport, function (item) {
                        return new _rexnordInvoicingReport.Models.RexnordInvoicingReport(item);
                    });
                    var newObj = new PaginationObject(data.TotalRowCount, newItems);
                    successCallBack(newObj);
                }).fail(function (arg) {
                    self.failureProxyCallback('GetRexnordInvoicingReport', arg);
                    failureCallBack();
                });
            }
        };

        //For fetching Re Bill Summary Report
        ReportClient.prototype.getRebillSummaryReport = function (boardReportRequest, successCallBack, failureCallBack) {
            var self = this;
            if (boardReportRequest != undefined) {
                var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
                ajax.post('Accounting/GetRebillSummaryReport', boardReportRequest).done(function (data) {
                    var obj = new PaginationObject(data.TotalRowCount, data.RebillSummaryReport);
                    successCallBack(obj);
                }).fail(function (args) {
                    self.failureProxyCallback('GetRebillSummaryReport', args);
                    failureCallBack();
                });
            }
        };

        //For fetching Order Rebill Report
        ReportClient.prototype.getOrderRebillReport = function (boardReportRequest, successCallBack, failureCallBack) {
            var self = this;
            if (boardReportRequest != undefined) {
                var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
                ajax.post('Accounting/GetOrderRebillReport', boardReportRequest).done(function (data) {
                    var newItems = ko.utils.arrayMap(data.OrderRebillReport, function (item) {
                        return new _orderRebillReport.Models.OrderRebillReport(item);
                    });
                    var newObj = new PaginationObject(data.TotalRowCount, newItems);
                    successCallBack(newObj);
                }).fail(function (arg) {
                    self.failureProxyCallback('getOrderRebillReport', arg);
                    failureCallBack();
                });
            }
        };

        ReportClient.prototype.getCrrRebillRepList = function (boardReportRequest, successCallBack, failureCallBack) {
            var self = this;
            if (boardReportRequest != undefined) {
                var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
                ajax.post('Accounting/GetRebillRepList', boardReportRequest).done(function (data) {
                    successCallBack(data);
                }).fail(function (args) {
                    failureCallBack(args);
                    self.failureProxyCallback('getCrrRebillRepList', args);
                });
            }
        };

        // To upload document of Matching report
        ReportClient.prototype.UploadMatchingReportDetails = function (uploadReportsFileDetails, successCallback, failureCallback) {
            var self = this;
            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
            return ajax.post('Accounting/UploadMatchingReportDetails', uploadReportsFileDetails).done(function (data) {
                successCallback(data);
            }).fail(function (arg) {
                failureCallback(arg);
                self.failureProxyCallback('UploadMatchingReportDetails', arg);
            });
        };

        // get Disputed Vendor Bills Report Data Based on filter criteria.
        ReportClient.prototype.getDisputedVendorBillsReport = function (boardReportRequest, successCallBack, failureCallBack) {
            var self = this;
            if (boardReportRequest != undefined) {
                var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
                ajax.post('Accounting/GetDisputedVendorBillsReport', boardReportRequest).done(function (data) {
                    var newItems = ko.utils.arrayMap(data.DisputedVendorBillsReport, function (item) {
                        return new _disputedVendorBillsReport.Models.DisputedVendorBillsReport(item);
                    });
                    var newObj = new PaginationObject(data.TotalRowCount, newItems);
                    successCallBack(newObj);
                }).fail(function (arg) {
                    self.failureProxyCallback('getDisputedVendorBillsReport', arg);
                    failureCallBack();
                });
            }
        };

        // get ReBill Reasons Report Data Based on filter criteria.
        ReportClient.prototype.getRebillReasonsReport = function (boardReportRequest, successCallBack, failureCallBack) {
            var self = this;
            if (boardReportRequest != undefined) {
                var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
                ajax.post('Accounting/GetRebillReasonsReport', boardReportRequest).done(function (data) {
                    var newItems = ko.utils.arrayMap(data.RebillReasonsReport, function (item) {
                        return new _rebillReasonsReport.Models.RebillReasonsReport(item);
                    });
                    var newObj = new PaginationObject(data.TotalRowCount, newItems);
                    successCallBack(newObj);
                }).fail(function (arg) {
                    self.failureProxyCallback('getRebillReasonsReport', arg);
                    failureCallBack();
                });
            }
        };

        // get weekly dashboard rexnord Report Data Based on filter criteria.
        ReportClient.prototype.getWeeklyDashboardRexnordReport = function (boardReportRequest, successCallBack, failureCallBack) {
            var self = this;
            if (boardReportRequest != undefined) {
                var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
                ajax.post('Accounting/GetWeeklyDashboardRexnordReport', boardReportRequest).done(function (data) {
                    successCallBack(data);
                }).fail(function (arg) {
                    self.failureProxyCallback('getWeeklyDashboardRexnordReport', arg);
                    failureCallBack();
                });
            }
        };

        // get weekly dashboard rexnord Report Data Based on filter criteria.
        ReportClient.prototype.getLostCostReport = function (boardReportRequest, successCallBack, failureCallBack) {
            var self = this;
            if (boardReportRequest != undefined) {
                var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
                ajax.post('Accounting/GetLostCostOpportunityForRexnordReport', boardReportRequest).done(function (data) {
                    successCallBack(data);
                }).fail(function (arg) {
                    self.failureProxyCallback('getLostCostReport', arg);
                    failureCallBack();
                });
            }
        };

        //For fetching Re Bill Summary Report
        ReportClient.prototype.getRexnordPostAuditReport = function (boardReportRequest, successCallBack, failureCallBack) {
            var self = this;
            if (boardReportRequest != undefined) {
                var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
                ajax.post('Accounting/GetRexnordPostAuditReport', boardReportRequest).done(function (data) {
                    successCallBack(data);
                }).fail(function (args) {
                    self.failureProxyCallback('GetRexnordPostAuditReport', args);
                    failureCallBack();
                });
            }
        };

        // ###START: US20913
        ReportClient.prototype.getVendorBillTrackingReportFromCSV = function (uploadedItem, successCallBack, faliureCallBack) {
            var self = this;
            var url = 'Accounting/GetVendorBillTrackingReportFromCSV';

            var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

            if (uploadedItem) {
                ajax.post(url, uploadedItem).done(function (message) {
                    successCallBack(message);
                }).fail(function (message) {
                    faliureCallBack(message);
                    self.failureProxyCallback('getVendorBillTrackingReportFromCSV', message);
                });
            }
        };

        // ###END: US20913
        //#endregion
        //#region Private Methods
        // For Log the Error record
        ReportClient.prototype.failureProxyCallback = function (context, error) {
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
        return ReportClient;
    })();
    exports.ReportClient = ReportClient;
});
