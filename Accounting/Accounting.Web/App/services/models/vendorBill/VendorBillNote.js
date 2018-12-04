/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />
define(["require", "exports"], function(require, exports) {
    /* File Created: April 14, 2014
    ** Created By: Avinash Dubey
    */
    (function (Models) {
        var VendorBillNote = (function () {
            function VendorBillNote(args) {
                if (args) {
                    this.Id = args.Id;
                    this.EntityId = args.EntityId;
                    this.NotesBy = args.NotesBy;
                    this.EntityType = args.EntityType;
                    this.NotesDate = args.NotesDate;
                    this.NotesDescription = args.NotesDescription;
                    this.NotesType = args.NotesType;
                    this.NoteTypeName = args.NoteTypeName;
                }
            }
            return VendorBillNote;
        })();
        Models.VendorBillNote = VendorBillNote;
    })(exports.Models || (exports.Models = {}));
    var Models = exports.Models;
});
