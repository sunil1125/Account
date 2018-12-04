/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../Scripts/TypeDefs/Simplex.d.ts" />
/// <reference path="../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../Scripts/TypeDefs/durandal.d.ts" />

//#endregion

//#region Import
import refMapLocation = require('services/models/common/MapLocation');
import refSystem = require('durandal/system');
import _app = require('durandal/app');
import refEnums = require('services/models/common/Enums');
import refCommon = require('services/client/CommonClient');
//#endregion

export class commonUtils {
	// Shows the message box as pr the given title and message
	public showConfirmationMessage(message: string, title: string, fisrtButtoName: string, secondButtonName: string, yesCallBack: () => boolean, noCallBack: () => boolean) {
		var self = this;

		var varMsgBox: Array<IMessageBoxButtonOption> = [
			{
				id: 0, name: fisrtButtoName, callback: (): boolean => {
					return yesCallBack();
				},
			},
			{
				id: 1, name: secondButtonName, callback: (): boolean => {
					return noCallBack();
				}
			}
		];

		////initialize message box control arguments
		var optionControlArgs: IMessageBoxOption = {
			options: varMsgBox,
			message: message,
			title: title
		}
				//Call the dialog Box functionality to open a Popup
		_app.showDialog('templates/messageBox', optionControlArgs, 'slideDown');
	}
}