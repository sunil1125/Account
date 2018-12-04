/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
var ForgotPassword = (function () {
    function ForgotPassword() {
    }
    return ForgotPassword;
})();

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
var LoginViewModel = (function (_super) {
    __extends(LoginViewModel, _super);
    // ###END: DE23484
    //#region constructor
    function LoginViewModel() {
        _super.call(this);
        this.billBoardData = ko.observableArray([]);
        this.emailValidation = ko.observable(false);
        this.passwordValidation = ko.observable(false);
        this.addValidationCss = ko.observable('');
        this.userName = ko.observable('').extend({
            trimmed: true,
            required: { message: "Email is required.", params: true }
        });
        this.password = ko.observable('').extend({
            trimmed: true,
            required: { message: "Password is required." }
        });
        this.didLoginFail = ko.observable(false);
        this.showProgress = ko.observable(false);
        /* forgot password variables */
        this.forgotPasswordLabel = ko.observable("Password Help");
        this.forgotPassword = ko.observable('').extend({
            trimmed: true,
            required: { message: "Email is required.", params: true }
        });
        this.validationMessage = ko.observable('Please enter your username and check your email for further instructions.');
        this.validationErrorMessage = ko.observable('');
        this.hideEmailTextBox = ko.observable(true);
        this.didForgotFail = ko.observable(false);
        // ###START: DE23484
        this.currentYear = ko.observable('');
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
            } else {
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
    LoginViewModel.prototype.login = function () {
        var _this = this;
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
            ajax.post("Accounting/login", _login).done(function (data) {
                return _this.loginSuccessCallback(data);
            }).fail(function () {
                return _this.loginFailedCallback();
            });
            //}
        } else {
            this.loginError.errors.showAllMessages();
        }
    };

    /*** Callback when login was successful **/
    LoginViewModel.prototype.loginSuccessCallback = function (result) {
        if (result) {
            var returnUrl = Utility.getQueryStringValue("ReturnUrl");

            $.removeCookie("IsRedirectedFromCC", { path: '/' });

            if (returnUrl != null && returnUrl != "") {
                var url = Utility.DecodeUri(returnUrl);

                if (url[url.length - 1] !== '/') {
                    url = url + '/';
                }
                window.location.href = url.toLocaleLowerCase();
            } else {
                window.location.href = Utils.Constants.ApplicationBaseURL;
            }
        } else {
            this.showProgress(false);
            this.didLoginFail(true);
        }
        //##END: DE24135
    };

    /*** Callback when login failed **/
    LoginViewModel.prototype.loginFailedCallback = function () {
        ////window.ga('send', 'pageview', window.location.hostname + window.location.pathname + '/Failure');
        this.didLoginFail(true);
        this.showProgress(false);
        $(".login_form").show();
    };

    LoginViewModel.prototype.showForgotPassword = function () {
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
    };

    LoginViewModel.prototype.showLogin = function () {
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
    };

    //#endregion login
    //#region forgot password functions
    /*** Submits the user's email address for processing the secure token **/
    LoginViewModel.prototype.sendResetPasswordMail = function () {
        var _this = this;
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

            ajax.post("Accounting/SendForgotPassword", value).done(function () {
                _this.didForgotFail(false);
                _this.hideEmailTextBox(false);
                jQuery('#txtForgotPassword').val('');
                _this.forgotPasswordLabel('Check your mail');
                _this.validationMessage('An email with instructions on how to reset your password has been sent to your email address.');
            }).fail(function () {
                _this.didForgotFail(true);
            });
            //}
        } else {
            this.forgotPasswordError.errors.showAllMessages();
        }
    };

    LoginViewModel.prototype.nullifyError = function () {
        this.errorMessage("");
    };
    return LoginViewModel;
})(ValidatingViewModel);

var Login = (function () {
    function Login(username, password, rememberMe) {
        this.UserName = username;
        this.Password = password;
        this.RememberMe = rememberMe;
    }
    return Login;
})();

$().ready(function () {
    var vm = new LoginViewModel();

    ko.applyBindings(ko.validatedObservable(vm), document.getElementById('loginForm'));

    // set username input focus
    $("#txtUserName").focus();
});
