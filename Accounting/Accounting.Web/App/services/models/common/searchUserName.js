/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../../../Scripts/TypeDefs/utils.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
define(["require", "exports"], function(require, exports) {
    

    (function (Models) {
        var UserNameSearch = (function () {
            function UserNameSearch(args) {
                this.count = 0;
                if (args) {
                    this.Email = args.Email;
                    this.FirstName = args.FirstName;
                    this.FullName = args.FullName;
                    this.GlobalNetUserId = args.GlobalNetUserId;
                    this.display = this.FullName;
                    this.count = 2;
                }
            }
            return UserNameSearch;
        })();
        Models.UserNameSearch = UserNameSearch;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
