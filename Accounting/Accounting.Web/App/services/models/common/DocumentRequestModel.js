/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created: JAN 16, 2015
** Created By: Satish
*/
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    /// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
    /// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />
    /// <reference path="../TypeDefs/CommonModels.d.ts" />
    var refSystem = __refSystem__;

    (function (Models) {
        var DocumentRequestModel = (function () {
            /// <summary>
            /// Constructor Initializes the DocumentRequestModel
            /// </summary>
            function DocumentRequestModel(args) {
                if (args) {
                    this.BolNumber = refSystem.isObject(args) ? (args.BolNumber) : '';
                    this.InvoiceNumber = refSystem.isObject(args) ? (args.InvoiceNumber) : '';
                    this.CustomerBolNumber = refSystem.isObject(args) ? (args.CustomerBolNumber) : '';
                    this.PdfHeight = refSystem.isObject(args) ? (args.PdfHeight) : 0;
                    this.PdfWidth = refSystem.isObject(args) ? (args.PdfWidth) : 0;
                }
            }
            return DocumentRequestModel;
        })();
        Models.DocumentRequestModel = DocumentRequestModel;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
