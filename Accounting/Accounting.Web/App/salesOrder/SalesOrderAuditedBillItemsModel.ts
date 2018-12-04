/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/// <reference path="../../Scripts/utils.ts" />
/// <reference path="../services/models/TypeDefs/SalesOrderModels.d.ts" />
/// <reference path="../../Scripts/TypeDefs/durandal.d.ts" />
/// <reference path="../../Scripts/TypeDefs/knockout.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
/// <reference path="../../Scripts/Constants/ApplicationConstants.ts" />
/// <reference path="../services/validations/Validations.ts" />

import refSystem = require('durandal/system');
import refValidations = require('services/validations/Validations');
/*
** <changeHistory>
** <id>DE22259</id> <by>Shreesha Adiga</by> <date>22-03-2016</date><description>Show Long description instead of short description for item</description>
** </changeHistory>
*/
export module Models {
	export class SalesOrderAuditedBillItemsModel {
		//#region Members
		id: KnockoutObservable<number> = ko.observable(0);
		items: KnockoutObservable<number> = ko.observable(0);
		itemId: KnockoutObservable<number> = ko.observable(0);
		totalcheck: KnockoutObservable<number> = ko.observable(0);
		selectedItemTypes: KnockoutObservable<IShipmentItemType> = ko.observable();
		selectedShippmentItemTypes: KnockoutObservable<string> = ko.observable();
		cost: KnockoutObservable<any> = ko.observable();
        pieceCount: KnockoutObservable<number> = ko.observable();

		selectedClassType: KnockoutObservable<number> = ko.observable();
		weight: KnockoutObservable<number> = ko.observable();
		dimensionLength: KnockoutObservable<number> = ko.observable();
		dimensionWidth: KnockoutObservable<number> = ko.observable();
		dimensionHeight: KnockoutObservable<number> = ko.observable();
		userDescription: KnockoutObservable<string> = ko.observable();
		packageTypes: KnockoutObservableArray<IEnumValue>;
		classTypes: KnockoutObservableArray<IEnumValue>;

		isShippingItem: KnockoutComputed<boolean>;
		selectedPackageType: KnockoutObservable<number> = ko.observable();
		//Function
		isNumber: (that, event) => void;
		isCheck: KnockoutObservable<boolean> = ko.observable(false);
		//#endregion

		//#region Constructor
		constructor(selectedType: IShipmentItemType, selectChanged: () => any) {
			var self = this;

			if (refSystem.isObject(selectedType)) {
				self.selectedItemTypes(selectedType);
				//##START: DE22259
				self.selectedShippmentItemTypes(selectedType.LongDescription);
				//##END: DE22259
			}

			//self.items(selectedType.ItemClassId);
			self.id = ko.observable(0);

			// Set the description for all the other items rather than shipping
			if (refSystem.isObject(selectedType)) {
				if (selectedType.ItemId !== Constants.ApplicationConstants.ShippingItemId) {
					self.userDescription(selectedType.ShortDescription);
				}
			}

			//To check if enter value is digit and decimal
			self.isNumber = function (data, event) {
				var charCode = (event.which) ? event.which : event.keyCode;

                //to allow copy(ctrl + c) in firefox
                if (event.ctrlKey && (charCode == 99 || charCode == 67)) {
                    return true;
                }
				if ((charCode > 31 && charCode != 46 && (charCode < 48 || charCode > 57))) {
					return false;
				}
				return true;
			}

			// Subscribe to update the UI
			self.isCheck.subscribe((newvalue) => {
				selectChanged();
			});
			return self;
		}
		//#endregion Constructor

		//#region Private Methods

		// get the item view model
		public initializeSalesOrderAuditedBillItem(item: IVendorBillItem, totalcheck: number) {
			var self = this;
			self.totalcheck(totalcheck);
			if (item != null) {
				self.id(item.Id);
				self.itemId(item.ItemId);
				self.cost($.number((item.Cost), 2));
				self.pieceCount(item.ItemId === 10 ? item.PieceCount : 0);
				self.selectedClassType(item.SelectedClassType);
				self.weight(item.Weight);
				self.dimensionLength(item.DimensionLength);
				self.dimensionWidth(item.DimensionWidth);
				self.dimensionHeight(item.DimensionHeight);
				self.userDescription(item.UserDescription);
				self.selectedPackageType(item.PackageTypeId);
				self.isCheck(item.isChecked);
			}
		}

		// this function is used to convert formatted cost with decimal(Two Place).
		public formatDecimalNumber(field) {
			var self = this;
			var costValue = field();
			if (costValue) {
				var stringParts = costValue + '';

				var isNegative = stringParts.indexOf("-") !== -1;

				var parts = stringParts.split('.');

				// take only two decimal point
				if (parts && parts.length > 2) {
					costValue = parts[0] + '.' + parts[1];
				}

				///parts.length is length after split the cost value
				///costValue length total length of textbox value
				///with in this if condition we will check is it without decimal or not
				if (parts.length === 1 && costValue && costValue.length > 8) {
					costValue = costValue.replace(/[^0-9]/g, '');
					costValue = costValue.replace(/(\d{8})(\d{2})/, "$1.$2");
					field(costValue);
				}
				if (parts.length === 1 || (parts && (parts.length === 0 || parts[1] || parts[1] === ''))) {
					if (costValue && costValue.length >= 1 && costValue.length <= 8) {
						if (/\.\d$/.test(costValue)) {
							costValue += "0";
						}
						else if (/\.$/.test(costValue)) {
							costValue += "00";
						}
						else if (!/\.\d{2}$/.test(costValue)) {
							costValue += ".00";
						}
					}
				}

				if (isNegative === true) {
					costValue = '-' + (costValue + '').split("-")[1];
				}

				field(costValue);
			}
		}

		public cleanUp() {
			var self = this;

			//delete self.id;
			//delete self.items;
			//delete self.itemId;
			//delete self.totalcheck;
			//delete self.selectedItemTypes;
			//delete self.selectedShippmentItemTypes;
			//delete self.cost;
			//delete self.pieceCount;
			//delete self.selectedClassType;
			//delete self.weight;
			//delete self.dimensionLength;
			//delete self.dimensionWidth;
			//delete self.dimensionHeight;
			//delete self.userDescription;
			//delete self.packageTypes;
			//delete self.classTypes;
			//delete self.isShippingItem;
			//delete self.selectedPackageType;
			//delete self.isNumber;
			//delete self.isCheck;

			for (var property in self) {
				delete self[property];
			}

			delete self;
		}

		//#endregion Public Methods
	}
}