/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/VendorBillModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />

/* File Created: April 14, 2014
** Created By: Avinash Dubey
*/

export module Models {
	export class VendorBillNote {
		Id: number;
		EntityId: number;
		NotesDescription: string;
		NotesBy: string;
		EntityType: number;
		NotesType: number;
		NoteTypeName: string
		NotesDate: Date;

		constructor(args?: IVendorBillNote) {
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
	}
}