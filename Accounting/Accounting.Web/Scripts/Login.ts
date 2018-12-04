/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region Refrences
/// <reference path="TypeDefs/utils.d.ts" />
/// <reference path="TypeDefs/Simplex.d.ts" />
/// <reference path="TypeDefs/jquery.d.ts" />
/// <reference path="TypeDefs/common.d.ts" />
/// <reference path="Utilities.ts" />
//#endregion
/**
* View model for the login form
**/

class ForgotPassword {
	UserValue: string;
	EmailAddress: string;
	UserName: string;
}

/*
** <summary>
** Scripts of Login Page
** </summary>
** <createDetails>
** </createDetails>
** <changeHistory>
** <id>DE23484</id> <by>Baldev Singh Thakur</by> <date>18-07-2016</date> <description>Added logic to diaply the current year in login page.</description>
** <id>DE24135</id> <by>Dhaval Tamhane</by> <date>31-08-2016</date> <description>Fixed the issue related to application loading twice after login.</description>
** <id>7266</id> <by>Shreesha Adiga</by><date>23-11-2018</date><description>Remove "IsRedirectedFromCC" cookie if exists upon Login</description>
** </changeHistory>
*/
class LoginViewModel extends ValidatingViewModel {
	billBoardData: KnockoutObservableArray<any> = ko.observableArray([]);
	emailValidation: KnockoutObservable<boolean> = ko.observable(false);
	passwordValidation: KnockoutObservable<boolean> = ko.observable(false);
	addValidationCss: KnockoutObservable<string> = ko.observable('');
	userName: KnockoutObservable<string> = ko.observable('').extend({
		trimmed: true,
		required: { message: "Email is required.", params: true }
	});
	password: KnockoutObservable<string> = ko.observable('').extend({
		trimmed: true,
		required: { message: "Password is required." }
	});
	rememberMe: boolean;
	didLoginFail: KnockoutObservable<boolean> = ko.observable(false);
	loginError: KnockoutValidationGroup;
	showProgress: KnockoutObservable<boolean> = ko.observable(false);

	/* forgot password variables */
	forgotPasswordLabel: KnockoutObservable<string> = ko.observable("Password Help");
	isSuccess: KnockoutObservable<boolean>;
	errorMessage: KnockoutObservable<string>;
	forgotPasswordError: KnockoutValidationGroup;
	forgotPassword: KnockoutObservable<string> = ko.observable('').extend({
		trimmed: true,
		required: { message: "Email is required.", params: true }
	});

	validationMessage: KnockoutObservable<string> = ko.observable('Please enter your username and check your email for further instructions.');
	validationErrorMessage: KnockoutObservable<string> = ko.observable('');
	hideEmailTextBox: KnockoutObservable<boolean> = ko.observable(true);

	didForgotFail: KnockoutObservable<boolean> = ko.observable(false);

	// ###START: DE23484
	currentYear: KnockoutObservable<string> = ko.observable('');

	// ###END: DE23484
	//#region constructor
	constructor() {
		super();
		var self = this;
		//#region login
		self.userName.subscribe(function (newValue) {
			$('#loginDiv').find('input').change();
			self.emailValidation(false);
			self.addValidationCss('');
		});

		self.password.subscribe(function (newValue) {
			$('#loginDiv').find('input').change();
			self.passwordValidation(false);
		});

		self.rememberMe = false;
		self.loginError = ko.validatedObservable({
			userName: self.userName,
			password: self.password
		});

		//#endregion

		//#region forgot password
		self.forgotPassword.subscribe(function (newValue) {
			$('#forgetPasswordDiv').find('input').change();
			self.emailValidation(false);
			self.addValidationCss('');
		});

		self.isSuccess = ko.observable(false);
		self.errorMessage = ko.observable("");

		self.forgotPasswordError = ko.validatedObservable({
			forgotPassword: this.forgotPassword
		});

		$(document).ready(function () {
			if (Utility.getQueryStringValue("flag") === "FP") {
				$("#login_form").hide();
				$("#forgotPasswordDivConatiner").show();
			}
			else {
				$("#login_form").show();
				$("#forgotPasswordDivConatiner").hide();
			}
		});

		//#endregion

		// ###START: DE23484
		var currentDate = new Date();

		var year = currentDate.getFullYear();

		var footer = year.toString() + ' ' + 'Accounting Portal';

		self.currentYear(footer);

		// ###END: DE23484
	}
	//#endregion constructor

	//#region logion fucntions}

	/*** Tries to log the user in **/

	login() {
		$('.login_form').css('position', 'absolute');
		this.userName($("#txtUserName").val());
		this.password($("#txtPassword").val());
		if (this.loginError.isValid()) {
			var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
			var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			//if (!regex.test(this.userName())) {
			//	this.emailValidation(true);
			//	this.addValidationCss('input-validation-error');
			//}
			//else {
			this.emailValidation(false);
			this.addValidationCss('');
			this.showProgress(true);
			var _login = new Login(this.userName(), this.password(), this.rememberMe);
			ajax.post("Accounting/login", _login)
				.done((data) => this.loginSuccessCallback(data))
				.fail(() => this.loginFailedCallback());
			//}
		}
		else {
			this.loginError.errors.showAllMessages();
		}
	}

	/*** Callback when login was successful **/
	private loginSuccessCallback(result: any) {
		if (result) {
			var returnUrl = Utility.getQueryStringValue("ReturnUrl");

			$.removeCookie("IsRedirectedFromCC", { path: '/' });
			//##START: DE24135
			if (returnUrl != null && returnUrl != "") {
				var url = Utility.DecodeUri(returnUrl);
				//below condition is to prevent twice loading of the application.
				if (url[url.length - 1] !== '/') {
					url = url + '/';
				}
				window.location.href = url.toLocaleLowerCase();
			}
			else {
				window.location.href = Utils.Constants.ApplicationBaseURL;
			}
		}
		else {
			this.showProgress(false);
			this.didLoginFail(true);
		}
		//##END: DE24135
	}

	/*** Callback when login failed **/

	private loginFailedCallback() {
		////window.ga('send', 'pageview', window.location.hostname + window.location.pathname + '/Failure');
		this.didLoginFail(true);
		this.showProgress(false);
		$(".login_form").show();
	}

	private showForgotPassword() {
		window.ga('send', 'pageview', window.location.hostname + window.location.pathname + '/ForgotPassword');
		jQuery('#txtUserName').val('');
		jQuery('#txtPassword').val('');
		$("#login_form").hide();
		$("#forgotPasswordDivConatiner").show();
		$("#txtForgotPassword").focus();

		this.hideEmailTextBox(true);
		this.didLoginFail(false);
		this.didForgotFail(false);
		this.validationErrorMessage('');
		this.loginError.errors.showAllMessages(false);
		this.emailValidation(false);
		//this.validationMessage('Please enter the email address that is registered with CarrierRate.');
		this.validationMessage('Please enter your username and check your email for further instructions.');
	}

	private showLogin() {
		window.ga('send', 'pageview');
		this.validationErrorMessage('');
		jQuery('#txtForgotPassword').val('');
		this.forgotPasswordError.errors.showAllMessages(false);
		this.loginError.errors.showAllMessages(false);
		this.emailValidation(false);
		this.forgotPasswordLabel('Password Help');

		$("#login_form").show();
		$("#forgotPasswordDivConatiner").hide();
		$("#txtUserName").focus();
	}

	//#endregion login

	//#region forgot password functions

	/*** Submits the user's email address for processing the secure token **/
	sendResetPasswordMail() {
		this.forgotPassword($('#txtForgotPassword').val());
		if (this.forgotPasswordError.isValid()) {
			var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);

			//var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
			//if (!regex.test(this.forgotPassword())) {
			//	this.emailValidation(true);
			//	this.addValidationCss('input-validation-error');
			//}
			//else {
			var value = new ForgotPassword();
			value.UserValue = this.forgotPassword();

			ajax.post("Accounting/SendForgotPassword", value).done(() => {
				this.didForgotFail(false);
				this.hideEmailTextBox(false);
				jQuery('#txtForgotPassword').val('');
				this.forgotPasswordLabel('Check your mail');
				this.validationMessage('An email with instructions on how to reset your password has been sent to your email address.');
			}).fail(() => {
					this.didForgotFail(true);
				});

			//}
		}
		else {
			this.forgotPasswordError.errors.showAllMessages();
		}
	}

	public nullifyError() {
		this.errorMessage("");
	}

	//#endregion forgot password
}

class Login {
	UserName: string;
	Password: string;
	RememberMe: boolean;

	constructor(username: string, password: string, rememberMe: boolean) {
		this.UserName = username;
		this.Password = password;
		this.RememberMe = rememberMe;
	}
}

$().ready(() => {
	var vm = new LoginViewModel();

	ko.applyBindings(ko.validatedObservable(vm), document.getElementById('loginForm'));
	// set username input focus
	$("#txtUserName").focus();
});