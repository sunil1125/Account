/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="TypeDefs/utils.d.ts" />
/// <reference path="Utilities.ts" />

/*
* Model for password reset
*/
class PasswordReset {
	public Email: string;
	public Token: string;
	public Password: string;

	constructor(Email: string, Token: string, Password: string) {
		this.Email = Email;
		this.Token = Token;
		this.Password = Password;
	}
}

/*
** <summary>
** Scripts of Login Page
** </summary>
** <createDetails>
** </createDetails>
** <changeHistory>
** <id>DE23484</id> <by>Baldev Singh Thakur</by> <date>18-07-2016</date> <description>Added logic to diaply the current year in login page.</description>
** </changeHistory>
*/
class ResetPasswordViewModel {
	isValid: KnockoutComputed<any> = ko.computed(() => true);
	isValidating: KnockoutObservable<boolean> = ko.observable(false);
	rules: KnockoutObservableArray<any> = ko.observableArray();

	newPassword: KnockoutObservable<string> = ko.observable('').extend({
		trimmed: true,
		required: { message: "Password is required.", params: true }
	});
	confirmPassword: KnockoutObservable<string> = ko.observable('').extend({
		trimmed: true,
		required: { message: "Confirm Password is required.", params: true }
	});
	resetPassword: () => any;
	passmatchValidation: KnockoutComputed<boolean>;
	passwordHasValue: KnockoutComputed<boolean>;
	sendResetpassword: () => any;

	// ###START: DE23484
	currentYear: KnockoutObservable<string> = ko.observable('');

	// ###END: DE23484
	constructor() {
		var self = this;

		self.passwordHasValue = ko.computed(() => {
			if (self.confirmPassword() === '' || self.newPassword() === '')
				return false;

			return true;
		});

		self.passmatchValidation = ko.computed(() => {
			if (self.confirmPassword() === '' && self.newPassword() === '')
				return true;

			if (self.confirmPassword() === self.newPassword()) {
				return true;
			}
			else {
				return false;
			}
		});

		self.resetPassword = () => {
			self.confirmPassword.isModified(true);
			self.newPassword.isModified(true);

			if (self.isValid() && self.passmatchValidation()) {
				self.sendResetpassword();
			}
			else {
				return false;
			}
		};

		self.sendResetpassword = () => {
			var email = Utility.getQueryStringValue("emailId");
			var resetPasswordToken = Utility.getQueryStringValue("token");

			if (email == undefined || email.length <= 0 || resetPasswordToken == undefined || resetPasswordToken.length <= 0) {
				//self.isErrorVisible(true); // TODO: show invalid URL
			}
			else {
				var passwordReset = new PasswordReset(email, resetPasswordToken, this.newPassword());

				var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
				ajax.post("Accounting/SetForgotPassword", passwordReset)
					.done((data) => self.resetPasswordSuccessCallback(data))
					.fail((message) => self.resetPasswordFailCallback(message));
			}
		};

		// ###START: DE23484
		var currentDate = new Date();

		var year = currentDate.getFullYear();

		var footer = year.toString() + ' ' + 'Accounting Portal';

		self.currentYear(footer);

		// ###END: DE23484
		return self;
	}

	private resetPasswordSuccessCallback(data) {
		$("#successMessageDiv").show();
		$("#resetPasswordDiv").hide();
	}

	private resetPasswordFailCallback(message) {
		$("#expiryMessageDiv").show();
		$("#resetPasswordDiv").hide();
	}
}

$().ready(() => {
	var vm = new ResetPasswordViewModel();

	ko.applyBindings(ko.validatedObservable(vm));

	$("#password").focus();
});