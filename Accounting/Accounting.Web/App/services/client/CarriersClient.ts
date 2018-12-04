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
//#endregion

//#region Import
import refSystem = require('durandal/system');
import _app = require('durandal/app');
//#endregion

// carrier menu client command
export class CarriersClientCommands {
	//#region Public Methods
	/// Loaded the all the types of carrier mapped
	/// parameter: success callback, and failed call back
	public getAllMappedCarrierDetails(searchFilter :any,successCallBack: Function, failureCallback: Function, PagingData?) {
		var self = this;

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		if (PagingData != undefined) {
			ajax.post('Accounting/GetAllMappedCarrierDetails', searchFilter)
				.done((data) => {
					successCallBack(data);
				})
				.fail((arg) => {
					self.failureProxyCallback('GetVendorBillStatusList', arg);
				});
		}
	}

	/// Loaded the CarrierTypes of carrier contact
	/// parameter: success callback, and failed call back
	public getCarrierTypesDetails(ID: number, successCallBack: Function, failureCallback: Function) {
		var self = this;
		var url: string = 'Accounting/GetCarrierContactDetail/?carrierId=' + ID;

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				self.failureProxyCallback('GetCarrierContactDetailList', arg);
			});
	}
	//To save Carrier Mapping Details
	public SaveCarrierMappingDetail(CarrierMappingDetails: any, successCallBack: Function, failureCallBack?: Function) {
		var self = this;

		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post("Accounting/SaveUpdateMasCarriers", CarrierMappingDetails)
			.done(function (message) { successCallBack(message); })
			.fail(function (message) {
				if (failureCallBack) {
					failureCallBack(message);
				}
				self.failureProxyCallback('SaveCarrierMappingDetail', message);
			});
	}
	//To save Contact Details Accounting/SaveCarrierContactDetails
	public SaveCarrierContactDetails(carrierContactDetail: any, successCallBack: Function, failureCallBack?: Function) {
		var self = this;
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post("Accounting/SaveCarrierContactDetails", carrierContactDetail)
			.done(function (message) { successCallBack(message); })
			.fail(function (message) {
				if (failureCallBack) {
					failureCallBack(message);
				}
				self.failureProxyCallback('SaveCarrierContactDetail', message);
			});
	}

	// Gets the document details from the service
	public getCarrierDocumentDetails(carrierId: number, successCallback: (data) => any, failedCallback: (errormessage) => any) {
		var self = this;
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		var stringUrl = "Accounting/GetCarrierDocuments?carrierId=" + carrierId;

		ajax.get(stringUrl)
			.done(function (message) { successCallback(message); })
			.fail(function (message) {
				if (failedCallback) {
					failedCallback(message);
				}
				self.failureProxyCallback('getCarrierDocumentDetails', message);
			});
	}

	//To save carrier documents
	public saveCarrierDocuments(carrierDocumentDetail: any, successCallBack: Function, failureCallBack?: Function) {
		var self = this;
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post("Accounting/SaveCarrierDocument", carrierDocumentDetail)
			.done(function (message) { successCallBack(message); })
			.fail(function (message) {
				if (failureCallBack) {
					failureCallBack(message);
				}
				self.failureProxyCallback('saveCarrierDocuments', message);
			});
	}

	//To delete carrier document Details
	public deleteCarrierDocuments(carrierDocumentDetail: any, successCallBack: Function, failureCallBack?: Function) {
		var self = this;
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post("Accounting/RemoveCarrierPackets", carrierDocumentDetail)
			.done(function (message) { successCallBack(message); })
			.fail(function (message) {
				if (failureCallBack) {
					failureCallBack(message);
				}
				self.failureProxyCallback('saveCarrierDocuments', message);
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

class SearchModel {
	SearchValue: string;
	PageSize: number;
	PageNumber: number;
	SortOrder: string;
	SortCol: string;
	SearchFilterItems: Array<any>;
	constructor(searchValue: string, sortOrder: string, sortCol: string, PageNumber: number, PageSize: number, filterItems: Array<any>) {
		this.SearchValue = searchValue;
		this.PageNumber = PageNumber;
		this.PageSize = PageSize;
		this.SortCol = sortCol;
		this.SortOrder = sortOrder;
		this.SearchFilterItems = filterItems;
	}
}