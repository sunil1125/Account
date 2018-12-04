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

// Boards menu client commands
export class AdminClientCommands {
	//#region Public methods

	public getComparisonToleranceDetails(customerType: number, customerId: number, successCallBack, failureCallBack) {
		var self = this;
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

		ajax.get("Accounting/GetComparisonToleranceDetailsByCustomer/?customerType=" + customerType + "&customerId=" + customerId)
			.done((data) => {
				successCallBack(data);
			})
			.fail((message) => {
				if (failureCallBack) {
					failureCallBack(message);
				}
				self.failureProxyCallback('GetExceptionDetailsMetaSource', message);
			});
	}

	public saveComparisonToleranceDetails(comparisonToleranceContainer:IComparisonToleranceContainer, successCallBack, failureCallBack) {
		var self = this;
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

		ajax.post("Accounting/SaveComparisonToleranceDetails", comparisonToleranceContainer)
			.done((data) => {
				successCallBack(data);
			})
			.fail((message) => {
				if (failureCallBack) {
					failureCallBack(message);
				}
				self.failureProxyCallback('SaveComparisonToleranceDetails', message);
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

	//#endregion
}