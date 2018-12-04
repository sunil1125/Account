/******************************************************************************

* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved.
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz.

******************************************************************************/
define(["require", "exports", 'durandal/system'], function(require, exports, __refSystem__) {
    /*
    ** <summary>
    ** Sales Order Dispute Mail Model
    ** </summary>
    ** <createDetails>
    ** <id>US24871</id> <by>Janakiram</by> <date>27-09-2016</date><description> send dispute email popup</description>
    ** </createDetails>
    ** <changeHistory>
    ** <id>US24874</id> <by>Vasanthakumar</by> <date>29-09-2016</date><description>Added shipment id to add notes</description>
    ** </changeHistory>
    */
    // Interface
    /// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
    /// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
    /// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />
    var refSystem = __refSystem__;

    (function (Model) {
        var SalesOrderDisputeMailDetail = (function () {
            // ###END: US24874
            function SalesOrderDisputeMailDetail(args) {
                this.Subject = refSystem.isObject(args) ? args.Subject : "";
                this.Attachments = refSystem.isObject(args) ? args.Attachments : [];
                this.MailBody = refSystem.isObject(args) ? args.MailBody : "";
                this.EmailIds = refSystem.isObject(args) ? args.EmailIds : "";
                this.CCMailIds = refSystem.isObject(args) ? args.CCMailIds : "";
                this.MailText = refSystem.isObject(args) ? args.MailText : "";

                // ###START: US24874
                this.ShipmentId = refSystem.isObject(args) ? args.ShipmentId : 0;
                // ###END: US24874
            }
            return SalesOrderDisputeMailDetail;
        })();
        Model.SalesOrderDisputeMailDetail = SalesOrderDisputeMailDetail;
    })(exports.Model || (exports.Model = {}));
    var Model = exports.Model;
});
