/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />

import refSystem = require('durandal/system');

/* File Created: Aug 9, 2014
** Created By: Bhanu
*/

export module Models {
	export class SalesOrderNoteDetails {
		Id: number;
		EntityId: number;
		Description: string;
		NotesBy: string;
		NotesDate: Date;
		EntityType: number;
		NotesType: number;
		NoteTypeName: string;
		NotesDateShort: string;

		constructor(args?: ISalesOrderNotes) {
			this.Id = refSystem.isObject(args) ? args.Id : 0;
			this.EntityId = refSystem.isObject(args) ? args.EntityId : 0;
			this.Description = refSystem.isObject(args) ? (args.Description) : '';
			this.NotesBy = refSystem.isObject(args) ? (args.NotesBy) : '';
			this.NotesDate = refSystem.isObject(args) ? (args.NotesDate) : new Date();
			this.EntityType = refSystem.isObject(args) ? (args.EntityType) : 0;
			this.NotesType = refSystem.isObject(args) ? (args.NotesType) : 0;
			this.NoteTypeName = refSystem.isObject(args) ? (args.NoteTypeName) : '';
			this.NotesDateShort = refSystem.isObject(args) ? (args.NotesDateShort) : '';
		}
	}
}