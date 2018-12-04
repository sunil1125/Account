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
/// <reference path="../../Scripts/Utility.ts" />

import refSystem = require('durandal/system');
import refValidations = require('services/validations/Validations');
import refEnums = require('services/models/common/Enums');

/*
** <summary>
** Sales Order items model.
** </summary >
** <changeHistory>
** <id>DE20259</id> <by>Baldev Singh Thakur</by> <date>07-10-2015</date> <description>Save button is not getting enable on updating some fields of sales order.</description>
** <id>DE20460</id> <by>Baldev Singh Thakur</by> <date>27-10-2015</date> <description>Save button i s not getting enable when updating class in sales order.</description>
** <id>DE21109</id> <by>Chandan Singh Bajetha</by> <date>25-01-2016</date> <description>Shipment Items charges not all showing in Accounting Portal Sales Order.</description>
** <id>US21290</id> <by>Shreesha Adiga</by> <date>17-03-2016</date><description>Show longdescription instead of short description in item dropdown and description input</description>
** <id>US21290</id> <by>Shreesha Adiga</by> <date>22-03-2016</date><description>Show AccessorialDescription instead of longdescription in description input</description>
** <id>US24671</id> <by>Shreesha Adiga</by> <date>12-09-2016</date> <description>Validate multiple Base Rate items for TL orders</description>
** <id>US24473</id> <by>Shreesha Adiga</by> <date>16-09-2016</date> <description>Insurance items should not be deleted for TL orders</description>
** <id>DE24438</id> <by>Shreesha Adiga</by> <date>20-09-2016</date> <description>Show toatr when the user selects insurance items</description>
** <id>US24975</id> <by>Shreesha Adiga</by> <date>28-09-2016</date> <description>Handling multiple Base Rate items for TL orders; Removed the old code for this scenario</description>
** <id>US25117</id> <by>Baldev Singh Thakur</by> <date>30-09-2016</date> <description>Added condition to check the roman number validation to select Packing Group</description>
** </changeHistory>
*/
export module Models {
	export class SalesOrderItemsModel {
		//#region Members
		id: KnockoutObservable<number> = ko.observable(0);
		itemId: KnockoutObservable<number> = ko.observable(0);
		itemName: KnockoutObservable<string> = ko.observable('');
		selectedItemTypes: KnockoutObservable<IShipmentItemType> = ko.observable();
		selectedShippmentItemTypes: KnockoutObservable<string> = ko.observable();
		cost: KnockoutObservable<any> = ko.observable();
		rev: KnockoutObservable<any> = ko.observable();
		originalRevenue: KnockoutObservable<any> = ko.observable();
		OriginalLineItemRevenue: KnockoutObservable<any> = ko.observable();
		OriginalLineItemPLCCost: KnockoutObservable<any> = ko.observable();
		pieceCount: KnockoutObservable<number> = ko.observable();
		palletCount: KnockoutObservable<number> = ko.observable();
		selectedClassType: KnockoutObservable<number> = ko.observable();
		weight: KnockoutObservable<number> = ko.observable();
		dimensionLength: KnockoutObservable<number> = ko.observable();
		dimensionWidth: KnockoutObservable<number> = ko.observable();
		dimensionHeight: KnockoutObservable<number> = ko.observable();
		userDescription: KnockoutObservable<string> = ko.observable();
		packageTypes: KnockoutObservableArray<IEnumValue>;
		classTypes: KnockoutObservableArray<IEnumValue>;
		allowvalidation: KnockoutObservable<boolean> = ko.observable(true);
		//Using for is service type truck load then validate
		isServiceTypeTruckload: KnockoutObservable<boolean> = ko.observable(true);
		isServiceTypeOcean: KnockoutObservable<boolean> = ko.observable(true);
		////if service type is not truckload then removing this class
		//requiredBgColorClass: KnockoutComputed<string>;
		isMarkForDeletion: KnockoutObservable<boolean> = ko.observable(false);
		selectedPackageType: KnockoutObservable<number> = ko.observable();
		isHazardous: KnockoutObservable<boolean> = ko.observable(false);
		hazmatUnNumber: KnockoutObservable<string> = ko.observable('');
		packingGroup: KnockoutObservable<string> = ko.observable('');
		hazardousClass: KnockoutObservable<number> = ko.observable();
		nmfc: KnockoutObservable<string> = ko.observable();
		bSCost: KnockoutObservable<number> = ko.observable();
		canEditItemDescription: KnockoutObservable<boolean> = ko.observable(false);
		itemsList: KnockoutObservableArray<SalesOrderItemsModel> = ko.observableArray([]);
		isSaveEnable: KnockoutObservable<boolean> = ko.observable(true);
		isCopyCostOnly: KnockoutObservable<boolean> = ko.observable(false);
		isUpdated: KnockoutObservable<boolean> = ko.observable(false);

		validationClass: KnockoutComputed<string>;
		isShippingItem: KnockoutComputed<boolean>;
		isShippingItemMiscellaneous: KnockoutComputed<boolean>;
		isBIDirty: KnockoutComputed<boolean>;

		errorSalesOrderItemDetail: KnockoutValidationGroup;
		errorHazmatItemDetail: KnockoutValidationGroup;
		salesOrderItem: ISalesOrderItem;


		// for tracking changes
		getBITrackChange: () => string[];
		isCallInitilizeTime: boolean = false;
		onChangesMade: (dirty: boolean) => any;
		isNumber: (that, event) => void;
		hazardousChanged: () => any;
		isNotAtLoadingTime: boolean = false;
		isPallet: boolean = false;
		isPiece: boolean = false;
		carrierType: KnockoutObservable<number> = ko.observable(0);

		disposables: Array<any> = [];

		// ##START: US24473
		isTLInsuranceItem: KnockoutComputed<boolean>;
		oldSelectedValue: IShipmentItemType;
		// ##END: US24473

		// ##START: US24975
		disableCostRevenue: KnockoutObservable<boolean> = ko.observable(false);
		// ##END: US24975
		//#endregion

		//#region Constructor
		constructor(selectedType: IShipmentItemType, costOrWeightChanged: () => any, changesMade: (dirty: boolean) => any, hazardousChanged: () => any, estimatedProfitPer?: any, gtMinMargin?: any, feeStructure?: any, gtzMargin?: any, isBillingStation?: boolean, isCallForEdit?: boolean, isSubOrder?: boolean, isSaveEnable?: boolean, isItemDescriprionEnable?: boolean, isAddingNewItem?: boolean, carrierTypeOnAdd?: number) {
			var self = this;
			self.hazardousChanged = hazardousChanged;
			// Notifies to parent view model about the changes

			self.onChangesMade = changesMade;

			self.id = ko.observable(0);

			// Set the description for all the other items rather than shipping
			if (refSystem.isObject(selectedType)) {
				self.selectedItemTypes(selectedType);
				self.itemId(parseFloat(selectedType.ItemId));
				self.selectedShippmentItemTypes(selectedType.ShortDescription);
				if (selectedType.ItemId !== Constants.ApplicationConstants.ShippingItemId) {
					self.userDescription(selectedType.ShortDescription);
				}
			}

			if ((isAddingNewItem === true) && (carrierTypeOnAdd === 3 || carrierTypeOnAdd === 7)) {
				self.isServiceTypeTruckload(false);
				isAddingNewItem = false;
				self.carrierType(carrierTypeOnAdd);
			} else {
				self.isServiceTypeTruckload(true);
			}

			// Handles the visibility of some of the fields like class, weight
			self.disposables.push(self.isShippingItem = ko.computed(() => {
				return (self.selectedItemTypes() !== undefined
					&& self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemId);
			}));

			// Handles the visibility of some of the fields like class, weight
			self.disposables.push(self.isShippingItemMiscellaneous = ko.computed(() => {
				if (self.isSaveEnable() && (self.canEditItemDescription() || isItemDescriprionEnable === true)) {
					return ((self.selectedItemTypes() !== undefined));
				}
				else if (self.isSaveEnable() && !self.canEditItemDescription()) {
					return ((self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemId)
						|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemIdMiscellaneousFee)
						|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemIdCorrectedInvocingFee)
						|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reclass)
						|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reclassfee)
						|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reweigh)
						|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ReweighANDReclass)
						|| (self.selectedItemTypes() !== undefined && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.Reweighfee));
				} else {
					return false;
				}
			}));

			self.disposables.push(self.validationClass = ko.computed(function () {
				return self.isServiceTypeTruckload() === true ? "input-validation-error" : "";
			}));

			//#region Validation Rules
			self.cost.extend({
				required: {
					message: ApplicationMessages.Messages.CostRequired,
					onlyIf: () => {
						return (self.SalesOrderItems() || (self.id() === 1 && self.allowvalidation()) || self.selectedItemTypes() === undefined);
					}
				},
				number: true
			});

			self.rev.extend({
				required: {
					message: ApplicationMessages.Messages.RevenueRequired,
					onlyIf: () => {
						return (self.SalesOrderItems() || (self.id() === 1 && self.allowvalidation()) || self.selectedItemTypes() === undefined);
					}
				},
				number: true
			});

			self.selectedItemTypes.extend({
				required: {
					message: ApplicationMessages.Messages.ChooseItemType,
					onlyIf: () => {
						return (self.SalesOrderItems() || (self.id() === 1 && self.allowvalidation()) || self.selectedItemTypes() === undefined);
					}
				}
			});

			self.userDescription.extend({
				required: {
					message: ApplicationMessages.Messages.DescriptionRequired,
					onlyIf: () => { return self.isShippingItemMiscellaneous() }
				}
			});

			self.packingGroup.extend({
				required: {
					message: ApplicationMessages.Messages.PackingGroupRequired,
				}
			});

			self.hazardousClass.extend({
				required: {
					message: ApplicationMessages.Messages.HazmatClassRequired,
				},
				validation: {
					validator: () => {
						return refValidations.Validations.NumericValidation.prototype.ValidNumberMinMax(self.hazardousClass(), Constants.ApplicationConstants.MinimumValueForHazardousClass, Constants.ApplicationConstants.MaximumValueForHazardousClass);
					},
					message: ApplicationMessages.Messages.HazmatClassMinMax
				}
			});

			self.hazmatUnNumber.extend({
				required: {
					message: ApplicationMessages.Messages.HazmatUnNumberRequired,
				}
			});

			self.selectedClassType.extend({
				required: {
					message: ApplicationMessages.Messages.ChooseClass,
					onlyIf: () => {
						return (self.isShippingItem() && self.isServiceTypeTruckload());
					}
				}
			});

			self.selectedPackageType.extend({
				required: {
					message: ApplicationMessages.Messages.ChoosePackageType,
					onlyIf: () => {
						return (self.isShippingItem() && self.isServiceTypeTruckload());
					}
				}
			});

			self.weight.extend({
				required: {
					message: ApplicationMessages.Messages.weight,
					onlyIf: () => {
						return (self.isShippingItem() && self.isServiceTypeOcean());
					}
				}
			});

			self.pieceCount.extend({
				required: {
					message: ApplicationMessages.Messages.pieceCount,
					onlyIf: () => {
						return (self.isShippingItem() && self.isPiece && self.isServiceTypeTruckload());
					}
				},
				number: true,
				// To show validation for min value
				min: {
					params: 1,
					message: ApplicationMessages.Messages.pieceCount,
					onlyIf: () => {
						return (self.isShippingItem() && self.isPiece && self.isServiceTypeTruckload());
					}
				}
			});

			self.palletCount.extend({
				required: {
					message: ApplicationMessages.Messages.palletCount,
					onlyIf: () => {
						return (self.isShippingItem() && self.isPallet && self.isServiceTypeTruckload());
					}
				},
				number: true,
				// To show validation for min value
				min: {
					params: 1,
					message: ApplicationMessages.Messages.palletCount,
					onlyIf: () => {
						return (self.isShippingItem() && self.isPallet && self.isServiceTypeTruckload());
					}
				}
			});

			//#endregion Validation Rules

			// The vendors item bill object
			self.errorSalesOrderItemDetail = ko.validatedObservable({
				selectedItemTypes: self.selectedItemTypes,
				cost: self.cost,
				rev: self.rev,
				userDescription: self.userDescription,
				selectedClassType: self.selectedClassType,
				selectedPackageType: self.selectedPackageType,
				weight: self.weight,
				pieceCount: self.pieceCount,
				palletCount: self.palletCount,
			});

			self.errorHazmatItemDetail = ko.validatedObservable({
				packingGroup: self.packingGroup,
				hazardousClass: self.hazardousClass,
				hazmatUnNumber: self.hazmatUnNumber
			});

			self.SetBITrackChange(self);

			var trackChanges = () => {
				return Utils.getDirtyItems(self);
			};

			self.getBITrackChange = trackChanges;

			delete trackChanges;

			self.disposables.push(self.isBIDirty = ko.computed(() => {
				var result = self.selectedItemTypes();
				var result1 = self.userDescription();
				result1 = self.nmfc();
				var result2 = self.dimensionLength();
				result2 = self.dimensionWidth();
				result2 = self.dimensionHeight();
				result2 = self.pieceCount();
				result2 = self.palletCount();
				//	result2 = self.selectedPackageType();
				result2 = self.cost();
				// ###START: DE20259
				result2 = self.rev();
				// ###END: DE20259

				// ###START: DE20460
				result2 = self.selectedClassType();
				// ###END: DE20460

				result2 = self.weight();

				// ###START: US25117
				self.packingGroup();

				// ###END: US25117
				var result3 = self.isHazardous();
				// If this from loading data side the return as false
				if (self.isNotAtLoadingTime)
					return false;

				var returnValue = self.getBITrackChange().length > 0;
				if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
					self.onChangesMade(returnValue);

				return returnValue;
			}));

			// Subscribe to update the UI
			self.disposables.push(self.cost.subscribe(() => {
				// If the selected item is a discount then show the negative cost
				if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.DiscountItemId && parseFloat(self.cost().toString()) > 0) {
					self.cost(Number(parseFloat(self.cost().toString()) * -1).toFixed(2));
				}

				if (self.isNotAtLoadingTime === false || self.isCopyCostOnly() === true) {
					var costWithoutComma = self.cost().toString().replace(/,/g, "");
					if (isCallForEdit || isSubOrder) {
						//When IsBillingStation is true showing BsCost and as per that changing BsCost and revenue
						if (estimatedProfitPer !== null && estimatedProfitPer !== undefined && !isBillingStation) {
							//var costWithoutComma = self.cost().toString().replace(/,/g, "");
							var newCost = parseFloat(costWithoutComma);
							var revenue = newCost / (1 - (parseFloat(estimatedProfitPer) / 100));
							self.rev($.number(revenue.toFixed(2), 2));
						} else if (feeStructure === 1) { //feeStructure =1(OverCost)
							//feeStructure =1(OverCost)
							if (isBillingStation) {
								//var costWithoutCommaForBillingStation = self.cost().toString().replace(/,/g, "");
								var bsCostOriginal = parseFloat(costWithoutComma) / (1 - (gtzMargin / 100));
								if (self.cost() != null)
									var bsCostFlat = (+costWithoutComma) + (+gtMinMargin);

								self.bSCost($.number((bsCostOriginal > bsCostFlat ? bsCostOriginal : bsCostFlat), 2));
								if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.DiscountItemId && parseFloat(self.bSCost().toString()) > 0) {
									self.bSCost($.number((parseFloat(self.bSCost().toString()) * -1), 2));
								}
								//For revenue
								self.rev($.number(((parseFloat(costWithoutComma) * 100) / (100 - parseFloat(estimatedProfitPer))), 2));
							}
						} else if (feeStructure === 2) {//feeStructure =2(OverRevenue)
							if (self.rev(0)) {
								if (isBillingStation) {
									var revenue = (parseFloat(costWithoutComma) * 100) / (100 - parseFloat(estimatedProfitPer));
									self.rev($.number(revenue.toFixed(2), 2));
								}
							}
							var bsCostOriginal2 = parseFloat(costWithoutComma) + ((parseFloat(self.rev().toString().replace(/,/g, "")) - parseFloat(self.cost())) * (gtzMargin / 100));
							if (self.cost() != null)
								var bsCostFlat2 = parseFloat(costWithoutComma) + gtMinMargin;

							self.bSCost(bsCostOriginal2 > bsCostFlat2 ? bsCostOriginal2 : bsCostFlat2);
							if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.DiscountItemId && parseFloat(self.bSCost().toString()) > 0) {
								self.bSCost($.number((parseFloat(self.bSCost().toString()) * -1), 2));
							}
						}
					}
				}

				costOrWeightChanged();
			}));

			// Subscribe to update the UI
			self.disposables.push(self.rev.subscribe((newValue) => {
				// If the selected item is a discount then show the negative cost
				if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.DiscountItemId && parseFloat(self.rev().toString()) > 0) {
					self.rev(Number(parseFloat(self.rev().toString()) * -1).toFixed(2));
				}
				if (self.isNotAtLoadingTime === false) {
					if ((self.rev() > self.OriginalLineItemRevenue()) && isBillingStation) {
						if (isCallForEdit || isSubOrder) {
							//When IsBillingStation is true showing BsCost and as per that changing BsCost and revenue
							if (estimatedProfitPer !== null && estimatedProfitPer !== undefined && !isBillingStation) {
								var costWithoutComma = self.cost().toString().replace(/,/g, "");
								var newCost = parseFloat(costWithoutComma);
								//var revenue = newCost / (1 - (parseFloat(estimatedProfitPer) / 100));
								//self.rev($.number(revenue.toFixed(2), 2));
							} else if (feeStructure === 1) { //feeStructure =1(OverCost)
								//feeStructure =1(OverCost)
								if (isBillingStation) {
									var costWithoutCommaForBillingStation = self.cost().toString().replace(/,/g, "");
									var bsCostOriginal = parseFloat(costWithoutCommaForBillingStation) / (1 - (gtzMargin / 100));
									if (self.cost() != null)
										var bsCostFlat = (+costWithoutCommaForBillingStation) + (+gtMinMargin);

									self.bSCost($.number((bsCostOriginal > bsCostFlat ? bsCostOriginal : bsCostFlat), 2));
									if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.DiscountItemId && parseFloat(self.bSCost().toString()) > 0) {
										self.bSCost($.number((parseFloat(self.bSCost().toString()) * -1), 2));
									}
									//For revenue
									//self.rev($.number(((parseFloat(costWithoutCommaForBillingStation) * 100) / (100 - parseFloat(estimatedProfitPer))), 2));
								}
							} else if (feeStructure === 2) {//feeStructure =2(OverRevenue)
								//if (self.rev(0)) {
								//	if (isBillingStation) {
								//		self.rev((parseFloat(costWithoutCommaForBillingStation) * 100) / (100 - parseFloat(estimatedProfitPer)));
								//	}
								//}
								var bsCostOriginal2 = parseFloat(costWithoutCommaForBillingStation) + ((parseFloat(self.rev().toString().replace(/,/g, "")) - parseFloat(self.bSCost().toString())) * (gtzMargin / 100));
								if (self.cost() != null)
									var bsCostFlat2 = parseFloat(costWithoutCommaForBillingStation) + gtMinMargin;

								self.bSCost(bsCostOriginal2 > bsCostFlat2 ? bsCostOriginal2 : bsCostFlat2);
								if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.DiscountItemId && parseFloat(self.bSCost().toString()) > 0) {
									self.bSCost($.number((parseFloat(self.bSCost().toString()) * -1), 2));
								}
							}
						}
					} else if ((self.rev() <= self.OriginalLineItemRevenue()) && isBillingStation) {
						self.bSCost($.number(self.OriginalLineItemPLCCost(), 2));
						if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.DiscountItemId && parseFloat(self.bSCost().toString()) > 0) {
							self.bSCost($.number((parseFloat(self.bSCost().toString()) * -1), 2));
						}
					}
				}

				costOrWeightChanged();
			}));

			// Subscribe to update the UI
			self.disposables.push(self.weight.subscribe(() => {
				costOrWeightChanged();
			}));

			// Subscribe to update the UI
			self.disposables.push(self.pieceCount.subscribe(() => {
				costOrWeightChanged();
			}));

			// Subscribe to update the UI
			self.disposables.push(self.bSCost.subscribe(() => {
				costOrWeightChanged();
				if (self.selectedItemTypes() && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.DiscountItemId && parseFloat(self.bSCost().toString()) > 0) {
					self.bSCost($.number((parseFloat(self.bSCost().toString()) * -1), 2));
				}
			}));

			// Subscribe to change the cost as negative if that is discount
			self.disposables.push(self.selectedItemTypes.subscribe(() => {

				// ##START: US24473
				// don't let the user to select falvey insurance
				if (self.carrierType() === 3 && typeof self.selectedItemTypes() !== "undefined" && self.selectedItemTypes().ItemId === "44") {
					self.selectedItemTypes(self.oldSelectedValue);

					// ##START: DE24438
					var toastrOptions = {
						toastrPositionClass: "toast-top-middle",
						delayInseconds: 5,
						fadeOut: 5,
						typeOfAlert: "",
						title: ""
					};

					Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.InsuranceItemsCantBeAddedToTLOrdersFromAccounting, "info", null, toastrOptions, null);
					// ##END: DE24438
					return false;
				}
				// ##END: US24473

				if (self.selectedItemTypes() !== undefined) {
					self.itemId(parseFloat(self.selectedItemTypes().ItemId));
				}

				if (self.cost() && self.selectedItemTypes() && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.DiscountItemId && parseFloat(self.cost().toString()) > 0) {
					self.cost(Number(parseFloat(self.cost().toString()) * -1).toFixed(2));
				}
				else if (self.cost() && parseFloat(self.cost().toString()) < 0) {
					self.cost(Number(parseFloat(self.cost().toString()) * -1).toFixed(2));
				}

				if (self.rev() && self.selectedItemTypes() && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.DiscountItemId && parseFloat(self.rev().toString()) > 0) {
					self.rev(Number(parseFloat(self.rev().toString()) * -1).toFixed(2));
				}
				else if (self.rev() && parseFloat(self.rev().toString()) < 0) {
					self.rev(Number(parseFloat(self.rev().toString()) * -1).toFixed(2));
				}

				// If not a shipping item then do not allow user to enter the description
				if (self.selectedItemTypes() && self.selectedItemTypes().ItemId !== Constants.ApplicationConstants.ShippingItemId) {
					// ##START: US21290
					self.userDescription(self.selectedItemTypes().AccessorialDescription);
					// ##END: US21290
				} else {
					self.userDescription("");
				}

				if ((self.selectedItemTypes() && self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemId) && (self.carrierType() === 3 || self.carrierType() === 7)) {
					self.isServiceTypeTruckload(false);
				} else {
					self.isServiceTypeTruckload(true);
				}

				if (self.selectedItemTypes() !== undefined) {
					//assigning defult value to cost or revenue if item is corrected invoicing Fee
					if (self.selectedItemTypes().ItemId === Constants.ApplicationConstants.ShippingItemIdCorrectedInvocingFee) {
						self.cost($.number(0, 2));
						self.rev($.number(10, 2));
					}
				}

				costOrWeightChanged();
			}));

			// ##START: US24473
			//before change in the dropdown value, save the previous value in a property. If the selected value is insurance, set the dropdown to this previous value
			self.selectedItemTypes.subscribe(function (previousValue) {
				self.oldSelectedValue = previousValue;
			}, this, "beforeChange");

			// ##END: US24473

			// Subscribe when hazardous item checked.
			self.disposables.push(self.isHazardous.subscribe((newValue) => {
				self.itemsList.push(self);
				self.hazardousChanged();
			}));

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

			//validation on basis of selected package type
			self.disposables.push(self.selectedPackageType.subscribe((newValue) => {
				if (self.selectedPackageType() === 0 || self.selectedPackageType() === 1) {
					self.isPallet = true;
					self.isPiece = false;
					self.palletCount(0);
					if (self.pieceCount() !== null && self.pieceCount() > 0) {
					}
					else {
						self.pieceCount(0);
					}
				}
				else {
					self.isPiece = true;
					self.isPallet = false;
					if (self.pieceCount() !== null && self.pieceCount() > 0) {
					}
					else {
						self.pieceCount(null);
					}

					self.palletCount(null);
				}
				if (!isSaveEnable) {
					self.isPallet = isSaveEnable;
				}
				self.checkValidation();
			}));

			// ##START: US24473
			self.isTLInsuranceItem = ko.computed(function () {
				return self.carrierType() === 3 && typeof self.selectedItemTypes() !== "undefined" && self.selectedItemTypes().ItemId === "44";
			});
			// ##END: US24473

			return self;
		}
		//#endregion Constructor

		//#region Private Methods

		// Validates all the properties for an item
		SalesOrderItems() {
			if (!this.allowvalidation()) {
				return false;
			}

			if (refSystem.isObject(this.selectedItemTypes())
				|| (this.cost.length > 0)
				|| (this.rev.length > 0)
				|| (this.pieceCount.length > 0)
				|| (this.palletCount.length > 0)
				|| (this.selectedPackageType.length > 0)
				|| (this.selectedClassType.length > 0)
				|| (this.weight.length > 0)
				|| (refSystem.isString(this.dimensionLength()) && this.dimensionLength())
				|| (refSystem.isString(this.dimensionWidth()) && this.dimensionWidth())
				|| (refSystem.isString(this.dimensionHeight()) && this.dimensionHeight())
				|| (refSystem.isString(this.userDescription()) && this.userDescription())
				) {
				return true;
			}

			return false;
		}

		//#endregion Private Methods

		//#region Public Methods

		// Check validation for each line item
		public checkValidation() {
			var self = this;

			if (self.errorSalesOrderItemDetail.errors().length != 0) {
				self.errorSalesOrderItemDetail.errors.showAllMessages();
				return true;
			} else {
				return false;
			}
		}

		public checkHazmatValidation() {
			var self = this;
			if (self.errorHazmatItemDetail.errors().length != 0) {
				self.errorHazmatItemDetail.errors.showAllMessages();
				return true;
			} else {
				return false;
			}
		}

		// get the item view model
		public initializeVendorBillItem(item: ISalesOrderItem, enable?: boolean, iscopyrevenue?: boolean, canEditDescritpion?: boolean, isCopyCostOnly?: boolean) {
			var self = this;
			if (typeof (isCopyCostOnly) !== 'undefined' && isCopyCostOnly === true && item.IsCalculateRevenue === true) {
				self.isCopyCostOnly(isCopyCostOnly);
			}
			self.isNotAtLoadingTime = true;
			self.canEditItemDescription(canEditDescritpion);
			if (item != null) {
				self.id(item.Id);
				self.cost(($.number((item.Cost), 2)).replace(/,/g, ""));

				if (iscopyrevenue == undefined || iscopyrevenue || (isCopyCostOnly === true && !item.IsCalculateRevenue)) {
					self.OriginalLineItemRevenue(item.OriginalLineItemRevenue);
					self.rev(($.number((item.Revenue), 2)).replace(/,/g, ""));
				}

				self.originalRevenue($.number((item.Revenue), 2));
				self.OriginalLineItemPLCCost(item.OriginalLineItemPLCCost);
				self.pieceCount(item.ItemId === 10 ? item.PieceCount : 0);
				self.weight(item.Weight);
				self.dimensionLength(item.Length);
				self.dimensionWidth(item.Width);
				self.dimensionHeight(item.Height);
				self.userDescription(item.UserDescription);
				self.selectedPackageType(item.PackageTypeId);
				self.nmfc(item.NMFC);
				self.selectedClassType(item.Class);
				self.palletCount(item.PalletCount);
				self.isHazardous(item.Hazardous);
				self.hazmatUnNumber(item.HazardousUNNo);
				self.hazardousClass(item.HazmatClass);
				// ###START: US25117
				if (item.PackingGroupNo !== null && typeof (item.PackingGroupNo) !== 'undefined') {
					if (item.PackingGroupNo === 'i' || item.PackingGroupNo === 'I' || item.PackingGroupNo === '1')
					{ self.packingGroup('1'); }
					else if (item.PackingGroupNo === 'ii' || item.PackingGroupNo === 'II' || item.PackingGroupNo === '2')
					{ self.packingGroup('2'); }
					else if (item.PackingGroupNo === 'iii' || item.PackingGroupNo === 'III' || item.PackingGroupNo === '3')
					{ self.packingGroup('3'); }
					else if (item.PackingGroupNo === '0') { self.packingGroup('0'); }
				}
				else {
					self.packingGroup(item.PackingGroupNo);
				}

				// ###END: US25117
				self.bSCost($.number(item.PLCCost, 2).replace(/,/g, ""));
				self.isSaveEnable(enable);
				self.SetBITrackChange(self);
				// ###START: DE21109
				if (self.selectedItemTypes() !== undefined)
					self.itemName(self.selectedItemTypes().ShortDescription);
				// ###END: DE21109
			}
			self.isNotAtLoadingTime = false;
		}

		//To populate the SalesOrder Items.
		public populateVendorBillItem(item: SalesOrderItemsModel) {
			var self = this;
			// This will prevent to detect the changes at first time
			//self.isNotAtLoadingTime = true;
			if (item != null) {
				self.id(item.id());
				self.cost(item.cost().replace(/,/g, ""));
				self.rev(item.rev().replace(/,/g, ""));
				self.pieceCount(item.pieceCount());
				self.selectedClassType(item.selectedClassType());
				self.weight(item.weight());
				self.dimensionLength(item.dimensionLength());
				self.dimensionWidth(item.dimensionWidth());
				self.dimensionHeight(item.dimensionHeight());
				self.userDescription(item.userDescription());
				self.selectedPackageType(item.selectedPackageType());
				self.nmfc(item.nmfc());
				self.selectedClassType(item.selectedClassType());
				//self.SetBITrackChange(self);
			}
			// This will stop detecting the changes
			//self.isNotAtLoadingTime = false;
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
			self.isHazardous.extend({ trackChange: true });
			self.palletCount.extend({ trackChange: true });
			self.weight.extend({ trackChange: true });
			self.dimensionLength.extend({ trackChange: true });
			self.dimensionWidth.extend({ trackChange: true });
			self.dimensionHeight.extend({ trackChange: true });
			self.pieceCount.extend({ trackChange: true });
			self.nmfc.extend({ trackChange: true });
			// ###START: DE20259
			self.rev.extend({ trackChange: true });
			// ###END: DE20259

			// ###START: DE20460
			self.selectedClassType.extend({ trackChange: true });
			// ###END: DE20460
		}

		public cleanUp() {
			var self = this;
			//try {
			//	var self = this;

			//	delete self.errorSalesOrderItemDetail;
			//	delete self.errorHazmatItemDetail;

			self.selectedItemTypes.rules.removeAll();
			self.userDescription.rules.removeAll();
			self.cost.rules.removeAll();
			self.palletCount.rules.removeAll();
			self.weight.rules.removeAll();
			self.pieceCount.rules.removeAll();

			//	self.disposables.forEach(item => {
			//		item.dispose();
			//		delete item;
			//	});

			self.cost.extend({ validatable: false });
			self.rev.extend({ validatable: false });
			self.selectedItemTypes.extend({ validatable: false });
			self.userDescription.extend({ validatable: false });
			self.packingGroup.extend({ validatable: false });
			self.hazardousClass.extend({ validatable: false });
			self.hazmatUnNumber.extend({ validatable: false });
			self.selectedClassType.extend({ validatable: false });
			self.selectedPackageType.extend({ validatable: false });
			self.weight.extend({ validatable: false });
			self.pieceCount.extend({ validatable: false });
			self.palletCount.extend({ validatable: false });

			//	//#region Validation Rules
			//	delete self.cost.extend;
			//	delete self.rev.extend;
			//	delete self.selectedItemTypes.extend;
			//	delete self.userDescription.extend;
			//	delete self.packingGroup.extend;
			//	delete self.hazardousClass.extend;
			//	delete self.hazmatUnNumber.extend;
			//	delete self.selectedClassType.extend;
			//	delete self.selectedPackageType.extend;
			//	delete self.weight.extend;
			//	delete self.pieceCount.extend;
			//	delete self.palletCount.extend;

			//	//#endregion Validation Rules

			//	delete self.hazardousClass;
			//	delete self.packingGroup;

			//	delete self.selectedItemTypes;
			//	delete self.userDescription;
			//	delete self.cost;
			//	delete self.palletCount;
			//	delete self.weight;
			//	delete self.pieceCount;

			//	delete self.getBITrackChange;
			//	delete self.isCallInitilizeTime;
			//	delete self.onChangesMade;
			//	delete self.isNumber;
			//	delete self.hazardousChanged;
			//	delete self.isNotAtLoadingTime;
			//	delete self.isPallet;
			//	delete self.isPiece;
			//	delete self.SetBITrackChange;
			//	self.disposables.removeAll();
			//	delete self.disposables;

			//	self.isShippingItemMiscellaneous.dispose();
			//	self.isBIDirty.dispose();
			//	delete self.isShippingItemMiscellaneous;
			//	delete self.isBIDirty;

			//	delete self.errorSalesOrderItemDetail;
			//	delete self.errorHazmatItemDetail;
			//	delete self.salesOrderItem;

			//	delete self;
			//}
			//catch (exception) {
			//}

			for (var property in self) {
				delete self[property];
			}
		}

		//#endregion Public Methods
	}
}