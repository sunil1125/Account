/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
/// <reference path="../../Scripts/TypeDefs/Bootstrap.d.ts" />
/// <reference path="../../Scripts/TypeDefs/bootstrap.timepicker.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/jquery.d.ts" />
/// <reference path="../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.validation.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../services/models/TypeDefs/VendorBillModels.d.ts" />
//#endregion

//#region Import
import _config = require('config');
import _router = require('plugins/router');
import _app = require('durandal/app');
import refSystem = require('durandal/system');
import refEnums = require('services/models/common/Enums');
import _refPurchaseOrderEmailModel = require('services/models/purchaseOrder/PurchaseOrderEmail');
import refpurchaseOrderClient = require('services/client/PurchaseOrderClient');
import refUserSearchControl = require('templates/searchUserAutoComplete');

//#endregion
/*
** <summary>
** Purchase Order Agent Email View Model.
** </summary>
** <createDetails>
** <id>US10948</id> <by>Chandan</by> <date>29th july, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by> <date></date>
** </changeHistory>
*/

class PurchaseOrderAgentEmail {
	//#region Members
	//For removing Attached Item
	removeAttachedItem: (lineItem: PurchaseOrderAgentEmail) => void;
	uploadAgentMailDocument: (obj, event: Event) => void;
	uploadFileContent: string;
	UploadedFileName: KnockoutObservable<string> = ko.observable();
	commonUtils = new Utils.Common();
	onSave: Function;
	purchaseOrderClient: refpurchaseOrderClient.PurchaseOrderClient = new refpurchaseOrderClient.PurchaseOrderClient();
	uploadedItems: KnockoutObservableArray<any> = ko.observableArray();
	emailValidation: KnockoutObservable<string> = ko.observable('').extend({ multiemail: true });
	//For Validation purpose
	errorPurchaseOrderDetail: KnockoutValidationGroup;
	purchaseOrderEmail: IPurchaseOrderEmail = new _refPurchaseOrderEmailModel.Models.PurchaseOrderEmail();
	userSerachViewMdoel: refUserSearchControl.SearchUserAutoComplete;
	userId: KnockoutComputed<number>;
	userName: KnockoutComputed<string>;
	// To disable send Mail Button
	isMailNotSend: KnockoutObservable<boolean> = ko.observable(true);
	//errorEmailAddresses: KnockoutValidationGroup;
	//to hold comments in mail body
	Comments: KnockoutObservable<string> = ko.observable('');
	refresh: Function;
	public deleteAttachFile: () => any;
	private selectLineItem: PurchaseOrderAgentEmail;
	listProgress: KnockoutObservable<boolean> = ko.observable(false);
	//#endregion

	//#region Constructor
	constructor() {
		var self = this;
		var commonUtils = new Utils.Common();
		self.userSerachViewMdoel = new refUserSearchControl.SearchUserAutoComplete("Agent name is required.");

		// to get the vendorId after selecting vendor
		self.userId = ko.computed(function () {
			if (self.userSerachViewMdoel.name() != null)
				return self.userSerachViewMdoel.id();

			return 0;
		});

		// to get the vendor Name after selecting vendor
		self.userName = ko.computed(() => {
			if (self.userSerachViewMdoel.name() != null) {
				self.emailValidation(self.userSerachViewMdoel.emailId);
				return self.userSerachViewMdoel.userName();
			}
			return null;
		});

		self.onSave = (target) => {
			var self = this;
			if (!self.validateAgentEmail()) {
			self.purchaseOrderEmail.AgentName = self.userSerachViewMdoel.userName();
			if (self.emailValidation() == "" || self.emailValidation() === null || self.emailValidation() === 'undefined') {
				self.purchaseOrderEmail.EmailAddress = self.userSerachViewMdoel.emailId;
			}
			else {
				self.purchaseOrderEmail.EmailAddress = self.emailValidation();
			}
			self.purchaseOrderEmail.Comments = self.Comments();
			self.purchaseOrderEmail.VendorBillDocuments = self.uploadedItems();

				// to show progress Bar
				self.listProgress(true);
				var successCallBack = () => {
					self.isMailNotSend(true);
					if (self.refresh && typeof self.refresh === "function") {
						self.refresh();
					}
					self.closePopup(self);
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.SendSuccessfullyMail, "success", null, toastrOptions);

					//target.__dialog__.close();
					self.listProgress(false);
				},
					faliureCallBack = (message) => {
						self.listProgress(false);
						self.isMailNotSend(true);
						var toastrOptions = {
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 10,
							fadeOut: 10,
							typeOfAlert: "",
							title: ""
						}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, message, "error", null, toastrOptions);
					};
				self.isMailNotSend(false);
				//self.purchaseOrderEmail.VendorBillDocuments = self.uploadedItems();
				self.purchaseOrderClient.sendAgentEmail(self.purchaseOrderEmail, successCallBack, faliureCallBack);
			}
		}

		////This is triggered when the user is uploading a document.
		//////It saves the document object to be saved in system
		self.uploadAgentMailDocument = function (obj, event: Event) {
			if (self.uploadedItems().length < 10) {
				var reader = new FileReader();
				var FileUploadObj = (<HTMLInputElement>event.target).files[0];
				var ext = FileUploadObj.name.split(".")[FileUploadObj.name.split(".").length - 1];
				if (FileUploadObj.type.search("image") == -1 && FileUploadObj.type.search("pdf") == -1 && ext.search("doc") == -1) {
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 10,
						fadeOut: 10,
						typeOfAlert: "",
						title: ""
					}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.OnlyFilesWithTypeImagePdfAndWordDocumentAreAllowedToBeUploaded, "info", null, toastrOptions);

					return;
				}

				reader.readAsDataURL(FileUploadObj);
				reader.onload = function (imgsrc) {
					self.uploadFileContent = imgsrc.target.result;
					self.UploadedFileName(FileUploadObj.name);
					var VendorBillDocument = {
						FileContent: self.uploadFileContent,
						FileExtension: self.UploadedFileName().split(".")[self.UploadedFileName().split(".").length - 1],
						AgentName: self.userSerachViewMdoel.userName(),
						VendorBillId: 0,
						Description: self.UploadedFileName(),
						FileName: self.UploadedFileName(),
						EmailId: self.emailValidation()
					}

				self.uploadedItems.push(VendorBillDocument);
				}
		}
			else {
				var toastrOptions1 = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}
					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.MaximumLimit10UploadsReached, "warning", null, toastrOptions1);
			}
		}

		//#region Error Details Object
		self.errorPurchaseOrderDetail = ko.validatedObservable({
			emailValidation: self.emailValidation,
			userSerachViewMdoel: self.userSerachViewMdoel
		});

		//## to Removing the attached fille.
		self.removeAttachedItem = function (lineItem: PurchaseOrderAgentEmail) {
			// Delete from the collection
			self.selectLineItem = lineItem;
			var actionButtons: Array<IToastrActionButtonOptions> = [];
			actionButtons.push({
				actionButtonName: "Yes",
				actionClick: self.deleteAttachFile
			});
            actionButtons.push({
                actionButtonName: "No",
                actionClick: null
            });

			var toastrOptions: IToastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 0,
				fadeOut: 0,
				typeOfAlert: "",
				title: "",
				actionButtons: actionButtons
			};

			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.warning.ID, ApplicationMessages.Messages.DoYouReallyWantToDeleteThisAttachedFile, "warning", null, toastrOptions);
		};

		// for calling ValidateVendorNotes
		self.deleteAttachFile = () => {
			self.uploadedItems.remove(self.selectLineItem);
			self.UploadedFileName('');
		}
	}

	//#endregion

	//#region Public Methods

	//Validating Vendor Bill property
	public validateAgentEmail() {
		var self = this;

		self.userSerachViewMdoel.vaildateSearchVendorNameControl();
		if (self.errorPurchaseOrderDetail.errors().length != 0) {
			self.errorPurchaseOrderDetail.errors.showAllMessages();
			return true;
		} else {
			return false;
		}
	}

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
		}; //Call the dialog Box functionality to open a Popup
		_app.showDialog('templates/messageBox', optionControlArgs, 'slideDown');
	}

	//close popup
	public closePopup(dialogResult) {
		dialogResult.__dialog__.close(this, dialogResult);
		return true;
	}

	//#endregion

	//#region Private Methods

	//#endregion

	//#region Life Cycle Event
	public compositionComplete(view, parent) {
		$('#txtuserName').focus();
	}

	// Activate the view and bind the selected data from the main view
	public activate(data: IPurchaseOrderEmail) {
		var self = this;
		if (data != null) {
			self.purchaseOrderEmail = data;
		}
		else {
			refSystem.log('error in the calling method of agent mail');
		}
	}
	//#endregion
}

return PurchaseOrderAgentEmail;