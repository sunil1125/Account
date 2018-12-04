/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

import refSystem = require('durandal/system');
import refValidations = require('services/validations/Validations');
import refBoardsClient = require('services/client/BoardsClient');

export module Models {
	export class Edi210SubBillItemModel {
		id: KnockoutObservable<number> = ko.observable();
		selectedItemTypes: KnockoutObservable<IShipmentItemType> = ko.observable();
		cost: KnockoutObservable<any> = ko.observable();
		pieceCount: KnockoutObservable<number> = ko.observable();
		selectedClassType: KnockoutObservable<number> = ko.observable();
		weight: KnockoutObservable<number> = ko.observable();
		dimensionLength: KnockoutObservable<number> = ko.observable();
		dimensionWidth: KnockoutObservable<number> = ko.observable();
		dimensionHeight: KnockoutObservable<number> = ko.observable();
		userDescription: KnockoutObservable<string> = ko.observable('');
		packageTypes: KnockoutObservableArray<IEnumValue>;
		classTypes: KnockoutObservableArray<IEnumValue>;
		allowvalidation: KnockoutObservable<boolean> = ko.observable(true);
		isMarkForDeletion: KnockoutObservable<boolean> = ko.observable(false);
		isShippingItem: KnockoutComputed<boolean>;
		isShippingItemMiscellaneous: KnockoutComputed<boolean>;
		errorVendorItemDetail: KnockoutValidationGroup;
		selectedPackageType: KnockoutObservable<number> = ko.observable();

		selecteditemCodeANSICode: KnockoutObservable<IItemCodeDescriptionStandardMappings> = ko.observable();
		selecteditemCodesCarrierID: KnockoutObservable<IItemCodeDescriptionStandardMappings> = ko.observable();
		mappedCode: KnockoutObservable<string> = ko.observable('');
		shippingAndDiscountCost: KnockoutObservable<any> = ko.observable();

		// for tracking changes
		getBITrackChange: () => string[];
		isBIDirty: KnockoutComputed<boolean>;
		onChangesMade: (dirty: boolean) => any;
		isNotAtLoadingTime: boolean = false;
		isEnable: KnockoutObservable<boolean> = ko.observable(true);
		isDescriptionEditable: KnockoutObservable<boolean> = ko.observable(true);
		// for dispute amount validation
		isDisputeAmountEditable: boolean = false;
		isDisputeLostAmountEditable: boolean = false;

		//#region Constructor
		constructor(selectedType: IShipmentItemType, costOrWeightChanged: () => any, changesMade: (dirty: boolean) => any, isDisputeAmountEditable?: boolean, isDisputeLostAmountEditable?: boolean, isEnable?: boolean) {
			var self = this;
			self.isDisputeAmountEditable = isDisputeAmountEditable;
			self.isDisputeLostAmountEditable = isDisputeLostAmountEditable;

			// Notifies to parent view model about the changes
			self.onChangesMade = (dirty: boolean) => {
				changesMade(dirty);
			};
			self.selectedItemTypes(selectedType);

			self.id = ko.observable(0);

			// Set the description for all the other items rather than shipping
			//if (refSystem.isObject(selectedType)) {
			//    if (selectedType.ItemId !== "10") {
			//        self.userDescription(selectedType.AccessorialDescription);
			//    }
			//}

			// Handles the visibility of some of the fields like class, weight
			self.isShippingItem = ko.computed(() => {
				return (self.selectedItemTypes() !== undefined
					&& self.selectedItemTypes().ItemId === "10");
			});

			// Handles the visibility of some of the fields like class, weight
			self.isShippingItemMiscellaneous = ko.computed(() => {
				if (!self.isEnable()) {
					return (false);
				} else {
					return ((self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemId)
						|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemIdMiscellaneousFee)
						|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemIdCorrectedInvocingFee)
						|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reclass)
						|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reclassfee)
						|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reweigh)
						|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ReweighANDReclass)
						|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reweighfee));
				}
			});

			//Ansi Code subscribe will reset the Carrier Code Subscribe.
			self.selecteditemCodeANSICode.subscribe((newValue) => {
				if (typeof (newValue) != 'undefined' && newValue !== null && newValue.ItemId > 0) {
					self.mappedCode(newValue.Code);
					self.selecteditemCodesCarrierID(null);
				}
				//else {
				//	self.mappedCode('');
				//}
			});

			// Carrier Code Subscribe will reset the AnsiCode
			self.selecteditemCodesCarrierID.subscribe((newValue) => {
				if (typeof (newValue) != 'undefined' && newValue !== null && newValue.CarrierID > 0) {
					self.mappedCode(newValue.Code);
					self.selecteditemCodeANSICode(null);
				}
				//else {
				//	self.mappedCode('');
				//}
			});

			//#region Validation Rules

			self.cost.extend({
				required: {
					message: 'Cost is required.',
					//onlyIf: () => {
					//    return (self.selectedItemTypes() === undefined);
					//}
				},
				number: true
			});

			self.selectedItemTypes.extend({
				required: {
					message: 'Please Choose Item Type.',
					onlyIf: () => {
						return (self.ValidateVendorBillItem() || (self.id() === 1 && self.allowvalidation()) || self.selectedItemTypes() === undefined);
					}
				}
			});

			self.userDescription.extend({
				required: {
					message: 'Description is required.',
					onlyIf: () => { return self.isShippingItemMiscellaneous() }
				}
			});

			self.mappedCode.extend({
				required: {
					message: 'Code is required.'
				}
			});

			//#endregion Validation Rules

			// The vendors item bill object
			self.errorVendorItemDetail = ko.validatedObservable({
				selectedItemTypes: self.selectedItemTypes,
				cost: self.cost,
				userDescription: self.userDescription,
				selectedItemTypes: self.selectedItemTypes,
				mappedCode: self.mappedCode
			});

			self.SetBITrackChange(self);

			self.getBITrackChange = () => {
				return Utils.getDirtyItems(self);
			};

			self.isBIDirty = ko.computed(() => {
				var result = self.selectedItemTypes();
				var result1 = self.userDescription();
				var result2 = self.dimensionLength();
				result2 = self.dimensionWidth();
				result2 = self.dimensionHeight();
				result2 = self.pieceCount();
				result2 = self.selectedPackageType();
				result2 = self.cost();
				result2 = self.selectedClassType();
				result2 = self.weight();

				// If this from loading data side the return as false
				if (self.isNotAtLoadingTime)
					return false;

				var returnValue = self.getBITrackChange().length > 0 ? true : false;
				if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
					self.onChangesMade(returnValue);

				return returnValue;
			});

			// Subscribe to update the UI
			self.cost.subscribe(() => {
				// If the selected item is a discount then show the negative cost
				if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70" && parseFloat(self.cost().toString()) > 0) {
					self.cost(Number(parseFloat(self.cost().toString()) * -1).toFixed(2));
				}

				costOrWeightChanged();
			});

			// Subscribe to update the UI
			self.weight.subscribe(() => {
				costOrWeightChanged();
			});

			// Subscribe to update the UI
			self.pieceCount.subscribe(() => {
				costOrWeightChanged();
			});

			// Subscribe to change the cost as negative if that is discount
			self.selectedItemTypes.subscribe(() => {
				if (self.cost() && self.selectedItemTypes() && self.selectedItemTypes().ItemId === "70" && parseFloat(self.cost().toString()) > 0) {
					self.cost(Number(parseFloat(self.cost().toString()) * -1).toFixed(2));
				}
				else if (self.cost() && parseFloat(self.cost().toString()) < 0) {
					self.cost(Number(parseFloat(self.cost().toString()) * -1).toFixed(2));
				}

				// If not a shipping item then do not allow user to enter the description
				if (self.selectedItemTypes() && self.selectedItemTypes().ItemId !== "10") {
					self.userDescription(self.selectedItemTypes().ShortDescription);
				} else {
					//if(self.userDescription()!=="")
					//	self.userDescription(self.userDescription());
					//else
					self.userDescription("");
				}

				costOrWeightChanged();
			});

			//// Subscribe to update the UI
			//self.disputeAmount.subscribe(() => {
			//    costOrWeightChanged();
			//});

			return self;
		}
		//#endregion Constructor

		//#region Private Methods

		// Validates all the properties for an item
		ValidateVendorBillItem() {
			//if (!this.allowvalidation()) {
			//    return false;
			//}

			//if (refSystem.isObject(this.selectedItemTypes())
			//if ((this.cost.length > 0)
			//    || (this.pieceCount.length > 0)
			//    || (this.selectedClassType.length > 0)
			//    || (this.weight.length > 0)
			//    || (refSystem.isString(this.dimensionLength()) && this.dimensionLength())
			//    || (refSystem.isString(this.dimensionWidth()) && this.dimensionWidth())
			//    || (refSystem.isString(this.dimensionHeight()) && this.dimensionHeight())
			//    || (refSystem.isString(this.userDescription()) && this.userDescription())
			//    ) {
			//    return true;
			//}

			return false;
		}

		//#endregion Private Methods

		//#region Public Methods

		// Check validation for each line item
		public checkValidation() {
			var self = this;
			if (self.errorVendorItemDetail.errors().length != 0) {
				self.errorVendorItemDetail.errors.showAllMessages();
				return true;
			} else {
				return false;
			}
		}

		// get the item view model
		public initializeVendorBillItem(item: IVendorBillItem, enable?: boolean, shipperAndDiscountCost?: number) {
			var self = this;
			if (item != null) {
				self.id(item.Id);
				self.cost(($.number((item.Cost), 2)).replace(/,/g, ""));
				//self.pieceCount(item.ItemId === 10 ? item.PieceCount : 0);
				self.pieceCount(item.PieceCount ? item.PieceCount : 0);
				self.selectedClassType(item.SelectedClassType);
				self.weight(item.Weight);
				self.dimensionLength(item.DimensionLength);
				self.dimensionWidth(item.DimensionWidth);
				self.dimensionHeight(item.DimensionHeight);
				self.userDescription(item.UserDescription);
				self.selectedPackageType(item.PackageTypeId);
				self.isEnable(enable);
				self.isDescriptionEditable(false);
				self.mappedCode(item.SpecialChargeOrAllowanceCode);
				if (shipperAndDiscountCost !== 0) {
					self.shippingAndDiscountCost(($.number((shipperAndDiscountCost), 2)).replace(/,/g, ""));
				}
				//self.SetBITrackChange(self);
			}
		}

		//To populate the Vendor Bill Items.
		public populateVendorBillItem(item: Edi210SubBillItemModel) {
			var self = this;
			// This will prevent to detect the changes at first time
			self.isNotAtLoadingTime = true;
			if (item != null) {
				self.id(item.id());
				self.cost(item.cost().replace(/,/g, ""));
				self.pieceCount(item.pieceCount());
				self.selectedClassType(item.selectedClassType());
				self.weight(item.weight());
				self.dimensionLength(item.dimensionLength());
				self.dimensionWidth(item.dimensionWidth());
				self.dimensionHeight(item.dimensionHeight());
				self.userDescription(item.userDescription());
				self.selectedPackageType(item.selectedPackageType());
				self.SetBITrackChange(self);
			}
			// This will stop detecting the changes
			self.isNotAtLoadingTime = false;
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

		//sets the tracking extension for BI required fields
		SetBITrackChange(self) {
			self.selectedItemTypes.extend({ trackChange: true });
			self.userDescription.extend({ trackChange: true });
			self.cost.extend({ trackChange: true });
			self.selectedClassType.extend({ trackChange: true });
			self.weight.extend({ trackChange: true });
			self.dimensionLength.extend({ trackChange: true });
			self.dimensionWidth.extend({ trackChange: true });
			self.dimensionHeight.extend({ trackChange: true });
			self.pieceCount.extend({ trackChange: true });
			self.selectedPackageType.extend({ trackChange: true });
		}

		//#endregion Public Methods
	}
}