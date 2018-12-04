/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created : Nov 04, 2014
** Created By Satish
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
import _refActUserGridSetting = require('services/models/GridSettings/UserGridSetting');
//#endregion Import

export class UserClient{
	//#region Public Methods
	public GetThemeName(successCallBack: Function, failureCallBack?: Function) {
		var self = this;
		var url: string = 'Accounting/GetThemeName';
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.get(url)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				if (failureCallBack) {
					failureCallBack(arg);
				}
			});
	}

	public SaveThemeName(themeName: string, successCallBack: Function, failureCallBack?: Function) {
		var self = this;
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post('Accounting/SaveThemeName', themeName)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				if (failureCallBack) {
					failureCallBack(arg);
				}
			});
	}

	public GetKoGridSetting(koGridDispSetting: _refActUserGridSetting.Model.UserGridSetting, successCallBack: Function, failureCallBack: Function) {
		var self = this;
		var ajax: Simplex.AjaxConnection = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
		ajax.post('Accounting/GetAccountingUserGridSetting', koGridDispSetting)
			.done((data) => {
				successCallBack(data);
			})
			.fail((arg) => {
				if (failureCallBack) {
					failureCallBack(arg);
				}
				self.failureProxyCallback('GetKoGridSetting', arg);
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