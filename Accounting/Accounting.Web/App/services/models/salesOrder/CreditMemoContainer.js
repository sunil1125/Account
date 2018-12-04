/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.
******************************************************************************/
define(["require", "exports"], function(require, exports) {
    

    /* File Created: Oct 21, 2016
    ** Created By: Baldev
    */
    (function (Model) {
        var CreditMemoContainer = (function () {
            function CreditMemoContainer(args) {
                if (args) {
                    this.CreditMemoDetail = args.CreditMemoDetail;
                }
            }
            return CreditMemoContainer;
        })();
        Model.CreditMemoContainer = CreditMemoContainer;
    })(exports.Model || (exports.Model = {}));
    var Model = exports.Model;
});
