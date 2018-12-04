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
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
/// <reference path="../services/validations/Validations.ts" />
/// <reference path="../../Scripts/Utility.ts" />
//#endregion

import refSalesOrderClient = require('services/client/SalesOrderClient');
import _app = require('durandal/app');
import refSendDisputeMailDetail = require('services/models/salesOrder/SalesOrderDisputeEmail');
import refEnums = require('services/models/common/Enums');

/*
** <summary>
** Popup to send the Dispute email using the selected template
** </summary>
** <createDetails>
** <id>US24862</id> <by>Shreesha Adiga</by> <date>20-09-2016</date>
** </createDetails>
** <changeHistory>
** <id>US24866</id> <by>Dhaval Tamhane</by> <date>21-09-2016</date><description>Email body related changes</description>
** <id>US24865</id> <by>Shreesha Adiga</by> <date>22-09-2016</date>	<description>Implement all the functionality of the popup: Populating values, Validations, Dropdown featuers, uploading files, html editor etc</description>
** <id>US24866</id> <by>Dhaval Tamhane</by> <date>27-09-2016</date><description>Populating values for OriginalCost, OriginalWeight, NMFC numbers and Classes</description>
** <id>US24871</id> <by>Janakiram</by> <date>27-09-2016</date>	<description>Implemented Mail Sendig Functionality</description>
** <id>DE24585</id> <by>Shreesha Adiga</by> <date>29-09-2016</date><description>Delete button for each file; Remove unused properties</description>
** <id>US24874</id> <by>Vasanthakumar</by> <date>29-09-2016</date> <description>Acct: Enter Notes on sending an Email to Carrier</description>
** <id>US24866</id> <by>Shreesha Adiga</by> <date>30-09-2016</date><description>Added 'fileTableHeaderText' to get the dynamic header of the table displaying list of files</description>
** <id>DE24822</id> <by>Vasanthakumar</by> <date>26-10-2016</date><description>Carrier Dispute Email: If NMFC # is blank on the order then showing NMFC value as Null in the Dispute template</description>
** </changeHistory>
*/
class SalesOrderDisputeEmailPopupViewModel {

	//#region Members

	// ###START: US24866
	emailBodyEditorId: KnockoutObservable<string> = ko.observable('emailBodyEditor' + Math.floor(Math.random() * 1000).toString());
	emailBody: KnockoutObservable<string> = ko.observable("");
	currentUser: KnockoutObservable<IUser> = ko.observable();
	// ###END: US24866

	carrierName: KnockoutObservable<string> = ko.observable('');
	proNumber: KnockoutObservable<string> = ko.observable('');
	bolNumber: KnockoutObservable<string> = ko.observable('');
	emailIds: KnockoutObservable<string> = ko.observable('');
	ccIds: KnockoutObservable<string> = ko.observable('');
	emailSubject: KnockoutComputed<string>;
	// ##START: US24865
	disputeAmount: KnockoutObservable<number> = ko.observable(0);

	carrierContactEmailAddresses: KnockoutObservableArray<IDisputeCarrierContactEmailAddress> = ko.observableArray([]);
	disputeTemplateList: KnockoutObservableArray<IDisputeEmailTemplate> = ko.observableArray([]);

	selectedCarrierContactAddress: KnockoutObservable<IDisputeCarrierContactEmailAddress> = ko.observable();
	selectedDisputeTemplate: KnockoutObservable<IDisputeEmailTemplate> = ko.observable();

	uploadedFilesList: KnockoutObservableArray<IUploadedFileDetails> = ko.observableArray([]);

	// ##START: DE24585
	isFileNamesTableVisible: KnockoutComputed<boolean>;
	// ##END: DE24585
	// ##START: US24866
	fileTableHeaderText: KnockoutComputed<string>;
	// ##END: US24866
	validationGroupEmailPopup: KnockoutValidationGroup;
	// ##END: US24865

	// ##START: US24866	
	originalCost: KnockoutObservable<string> = ko.observable('');
	originalWeight: KnockoutObservable<string> = ko.observable('');
	nmfcNumbers: KnockoutObservable<string> = ko.observable('');
	classes: KnockoutObservable<string> = ko.observable('');
	// ##END: US24866

	// ###START: US24874
	salesOrderId: KnockoutObservable<number> = ko.observable(0);
	// ###END: US24874

	// ###START: US24871
	listProgress: KnockoutObservable<boolean> = ko.observable(false);
	salesOrderClient: refSalesOrderClient.SalesOrderClient = new refSalesOrderClient.SalesOrderClient();

	// ###END: US24871
	saveCallback: () => any;
	cancelCallback: () => any;

	// ##START: DE24585
	deleteAttachments: (item: IUploadedFileDetails) => any;
	// ##ENd: DE24585
	//#endregion

	// Initializes the properties of this class
	constructor() {
		var self = this;

		// ###START: US24866
		if (!self.currentUser()) {
			self.getLoggedInUserDetails();
		}
		// ###END: US24866

		// ##START: US24865
		//#region Computed Fields
		self.emailSubject = ko.computed(() => {
			return ApplicationMessages.Messages.DisputeEmailSubject
				.replace('{proNumber}', self.proNumber())
				.replace('{bolNumber}', self.bolNumber())
				.replace('{carrierName}', self.carrierName());
		});

		// ##START: DE24585
		self.isFileNamesTableVisible = ko.computed(() => {
			return typeof self.uploadedFilesList() !== "undefined" && self.uploadedFilesList().length > 0;
		});
		// ##END: DE24585

		// ##START: US24866
		// dynamic header of the table displaying list of files
		self.fileTableHeaderText = ko.computed(() => {
			return 'File Name ({0} File(s) Attached)'.replace('{0}', typeof self.uploadedFilesList() !== "undefined" ? self.uploadedFilesList().length.toString() : '');
		});
		// ##END: US24866

		//#endregion

		//#region Subscribe methods
		self.selectedDisputeTemplate.subscribe((newValue) => {
			if (newValue) {
				// ###START: DE24822
				if (self.nmfcNumbers() === null) {
					newValue.EmailText = newValue.EmailText.replace('{NMFCNumbers}', '').replace('NMFC', '');					
				}

				if (self.classes() === null) {
					newValue.EmailText = newValue.EmailText.replace('{Classes}', '').replace('Class', '');
				}
				// ###END: DE24822

				var htmlEmailBody = newValue.EmailText
					.replace('{PRONumber}', self.proNumber())
					.replace('{BOLNumber}', self.bolNumber())
				// ###START: US24866
					.replace('{OriginalWeight}', self.originalWeight())
					.replace('{NMFCNumbers}', self.nmfcNumbers())
					.replace('{Classes}', self.classes())
					.replace('{OriginalCost}', self.originalCost()
					// ###END: US24866
					);

				self.populateEmailBody(htmlEmailBody);
				$('.email-body').removeClass('borderRedOnValidation');
			}
			else {
				self.populateEmailBody('');
			}
		});
		//#endregion

		//#region Validation Rules

		self.emailIds.extend({
			required: {
				message: 'Email ID is required'
			},
			multiemail: true
		});

		// cc ids are not required, but validate multi email
		self.ccIds.extend({
			multiemail: true
		});

		//dispute template is mandatory
		self.selectedDisputeTemplate.extend({
			required: {
				message: ApplicationMessages.Messages.PleaseChooseDisputeTemplate
			}
		});

		// validation group
		self.validationGroupEmailPopup = ko.validatedObservable({
			emailIds: self.emailIds,
			ccIds: self.ccIds,
			selectedDisputeTemplate: self.selectedDisputeTemplate
		});

		//#endregion

		// ##START: DE24585
		// on click of delete attachment
		self.deleteAttachments = function (item: IUploadedFileDetails) {
			self.uploadedFilesList.remove(item);
		}
		// ##END: DE24585
		// ##END: US24865
	}

	// ###START: US24866
	public createEmailEditor() {
		var self = this;

		tinymce.init({
			selector: "." + self.emailBodyEditorId(),
			auto_focus: true,
			menubar: false,
			statusbar: false,
			toolbar: "bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",
			// ##START: US24865
			setup: function (editor) {
				editor.on('keyup change', function (e) {
					$('.email-body').removeClass('borderRedOnValidation'); //on change of email body, remove the validation
				});
			}
			// ##END: US24865
		});
	}
	// ###END: US24866

	// ##START: US24865
	//#region Click Events 
	//on click of send email
	private onSendEmail(dialogResult) {
		var self = this;

		var isInvalid = false;

		// if the email body is null or white spaces, show border-red validation
		var emailBodyTextContent = tinymce.activeEditor.getContent({ format: 'text' }).trim();
		if (emailBodyTextContent === '' || emailBodyTextContent === null) {
			$('.email-body').addClass('borderRedOnValidation');
			isInvalid = true;
		}

		if (self.validationGroupEmailPopup.errors().length != 0) {
			self.validationGroupEmailPopup.errors.showAllMessages();
			isInvalid = true;
		}

		if (isInvalid)
			return;

		// ###START: US24871
		self.listProgress(true);

		self.emailBody("<html><body>" + tinymce.activeEditor.getContent() + "</body></html>");

		var mailDetail = new refSendDisputeMailDetail.Model.SalesOrderDisputeMailDetail();
		mailDetail.MailBody = self.emailBody().toString();
		mailDetail.EmailIds = self.emailIds();
		mailDetail.CCMailIds = self.ccIds();
		mailDetail.Subject = self.emailSubject();
		mailDetail.MailText = $(tinymce.activeEditor.getContent()).text();
		mailDetail.Attachments = self.uploadedFilesList();
		// ###START: US24874
		mailDetail.ShipmentId = self.salesOrderId();
		// ###END: US24874
		self.salesOrderClient.SendCarrierDisputeMail(mailDetail, message => {

			// Saving successful callback
			self.listProgress(false);
			var toastrOptions1 = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 10,
				fadeOut: 10,
				typeOfAlert: "",
				title: ""
			}

		self.closePopup(dialogResult);

			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.success.ID, ApplicationMessages.Messages.MailSentSuccessfullyDispute, "success", null, toastrOptions1, null);
		}, message => {

				// Saving failed call back
				self.listProgress(false);
				var toastrOptions = {
					toastrPositionClass: "toast-top-middle",
					delayInseconds: 10,
					fadeOut: 10,
					typeOfAlert: "",
					title: ""
				}

			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.error.ID, ApplicationMessages.Messages.MailFailureMessageDispute, "error", null, toastrOptions, null);
		}, message => {
			// Saving failed call back info message
			self.listProgress(false);
			var toastrOptions = {
				toastrPositionClass: "toast-top-middle",
				delayInseconds: 10,
				fadeOut: 10,
				typeOfAlert: "",
				title: ""
			}

			Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, message, "info", null, toastrOptions, null);
		});

		self.saveCallback();
		// ###END: US24871
	}
	// ##END: US24865

	//on click of close on the popup
	private onCancel(dialogResult) {
		var self = this;
		self.closePopup(dialogResult);
		self.cancelCallback();
	}

	// ##START: US24865
	//function to read the uploaded attachement files
	private uploadAttachments(obj, event: Event) {
		var self = this;

		var filesUploadedList = (<HTMLInputElement>event.target).files;

		if (filesUploadedList.length === 0)
			return;

		// loop through the files and read them using FileReader
		$.each(filesUploadedList, function (index, item) {

			var fileReader = new FileReader();
			// ##START: US24866
			var extension: string = item.name.split(".")[item.name.split(".").length - 1]

			// don't allow exe, dll and psd files to be uploaded
			if (extension &&
				(extension.toLowerCase() === 'exe'
				|| extension.toLowerCase() === 'dll'
				|| extension.toLowerCase() === 'psd')) {
				return;
			}
			// ##END: US24866

			fileReader.readAsDataURL(item);

			fileReader.onload = function (imgsrc) {
				var uploadFileDetails: IUploadedFileDetails = {
					FileContent: imgsrc.target.result,
					FileExtension: item.name.split(".")[item.name.split(".").length - 1],
					FileName: item.name,
				};

				self.uploadedFilesList.push(uploadFileDetails);
			};
		});
	}

	//#endregion
	// ##END: US24865

	//close popup
	public closePopup(dialogResult) {
		var self = this;
		dialogResult.__dialog__.close(this, dialogResult);
		return true;
	}

	// ##START: US24865
	// method to initialize the inputs on the popup
	private initializeDisputeEmailPopupDetails(emailPopupData) {
		var self = this;

		// ##START: US24866
		self.proNumber(emailPopupData.proNumber);
		self.bolNumber(emailPopupData.bolNumber);
		self.originalCost(emailPopupData.originalCost);
		self.originalWeight(emailPopupData.originalWeight);
		self.nmfcNumbers(emailPopupData.nmfcNumbers);
		self.classes(emailPopupData.classes);
		self.carrierName(emailPopupData.carrierName);
		self.disputeAmount($.number(emailPopupData.disputeAmount, 2));

		self.carrierContactEmailAddresses(emailPopupData.carrierContactAddressList);
		self.disputeTemplateList(emailPopupData.disputeTemplateList);
		// ###START: US24874
		self.salesOrderId(emailPopupData.shipmentId);
		// ###END: US24874
		// ##END: US24866
	}

	// populate the email body with selected template
	private populateEmailBody(htmlEmailBody: string) {
		var self = this;

		var signature = '<br /><br />Thank you for your assistance,<br />' + self.currentUser().FullName;
		tinymce.activeEditor.setContent($(htmlEmailBody).append(signature).outerHtml());
	}
	// ##END: US24865

	// ###START: US24866
	// Get the logged in user
	private getLoggedInUserDetails() {
		var self = this;
		_app.trigger("GetCurrentUserDetails", (currentUser: IUser) => {
			self.currentUser(currentUser);
		});
	}
	// ###END: US24866

	//#region Life Cycle Event
	//this method gets called first. optioncontrol is used to pass data to popup from where it's called
	public activate(optionControl: IMessageBoxOption) {
		var self = this;

		if (typeof optionControl !== "undefined" && typeof optionControl.bindingObject !== "undefined") {
			self.saveCallback = optionControl.bindingObject.saveCallback;
			self.cancelCallback = optionControl.bindingObject.cancelCallback;

			// ##START: US24866
			// ##START: US24865
			if (typeof optionControl.bindingObject.emailPopupData !== "undefined")
				self.initializeDisputeEmailPopupDetails(optionControl.bindingObject.emailPopupData);
			// ##END: US24865
			// ##END: US24866
		}

		return true;
	}

	public compositionComplete() {
		var self = this;

		// ###START: US24866
		self.createEmailEditor();
		// ###END: US24866

		// ##START: US24865
		$('#multiSelect').multipleSelect(); //initialize multi select

		// change event handler for jquery multiselect
		$('#multiSelect').on('change', function () {
			var selectedEmailAddresses = $(this).val();
			var commaSeparatedEmailAddresses = '';

			if (selectedEmailAddresses) {
				commaSeparatedEmailAddresses = selectedEmailAddresses.join(', ');
			}

			self.emailIds(commaSeparatedEmailAddresses);
			// ##END: US24865
		});
	}

	//#endregion
}

return SalesOrderDisputeEmailPopupViewModel;