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
var PasswordReset = (function () {
    function PasswordReset(Email, Token, Password) {
        this.Email = Email;
        this.Token = Token;
        this.Password = Password;
    }
    return PasswordReset;
})();

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
var ResetPasswordViewModel = (function () {
    // ###END: DE23484
    function ResetPasswordViewModel() {
        var _this = this;
        this.isValid = ko.computed(function () {
            return true;
        });
        this.isValidating = ko.observable(false);
        this.rules = ko.observableArray();
        this.newPassword = ko.observable('').extend({
            trimmed: true,
            required: { message: "Password is required.", params: true }
        });
        this.confirmPassword = ko.observable('').extend({
            trimmed: true,
            required: { message: "Confirm Password is required.", params: true }
        });
        // ###START: DE23484
        this.currentYear = ko.observable('');
        var self = this;

        self.passwordHasValue = ko.computed(function () {
            if (self.confirmPassword() === '' || self.newPassword() === '')
                return false;

            return true;
        });

        self.passmatchValidation = ko.computed(function () {
            if (self.confirmPassword() === '' && self.newPassword() === '')
                return true;

            if (self.confirmPassword() === self.newPassword()) {
                return true;
            } else {
                return false;
            }
        });

        self.resetPassword = function () {
            self.confirmPassword.isModified(true);
            self.newPassword.isModified(true);

            if (self.isValid() && self.passmatchValidation()) {
                self.sendResetpassword();
            } else {
                return false;
            }
        };

        self.sendResetpassword = function () {
            var email = Utility.getQueryStringValue("emailId");
            var resetPasswordToken = Utility.getQueryStringValue("token");

            if (email == undefined || email.length <= 0 || resetPasswordToken == undefined || resetPasswordToken.length <= 0) {
                //self.isErrorVisible(true); // TODO: show invalid URL
            } else {
                var passwordReset = new PasswordReset(email, resetPasswordToken, _this.newPassword());

                var ajax = new Simplex.AjaxConnection(Utils.Constants.AtlasBaseURL);
                ajax.post("Accounting/SetForgotPassword", passwordReset).done(function (data) {
                    return self.resetPasswordSuccessCallback(data);
                }).fail(function (message) {
                    return self.resetPasswordFailCallback(message);
                });
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
    ResetPasswordViewModel.prototype.resetPasswordSuccessCallback = function (data) {
        $("#successMessageDiv").show();
        $("#resetPasswordDiv").hide();
    };

    ResetPasswordViewModel.prototype.resetPasswordFailCallback = function (message) {
        $("#expiryMessageDiv").show();
        $("#resetPasswordDiv").hide();
    };
    return ResetPasswordViewModel;
})();

$().ready(function () {
    var vm = new ResetPasswordViewModel();

    ko.applyBindings(ko.validatedObservable(vm));

    $("#password").focus();
});
