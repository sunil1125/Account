/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References

/// <reference path="../../Scripts/TypeDefs/common.d.ts" />
/// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
/// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
//#endregion

import refSystem = require('durandal/system');
import refOptionButton = require('services/models/common/OptionButton');
import refEnums = require('../services/models/common/Enums');
import _app = require('durandal/app');
import refVendorBillView = require('vendorBill/VendorBillView');

/*
** <summary>
** Vendor Bill Option Button View Model.
** </summary>
** <createDetails>
** <id></id> <by>Sankesh Poojari</by> <date>April 29, 2014</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by> <date></date>
** </changeHistory>
*/

export class VendorBillOptionButtonControl {
	private optionList: KnockoutObservableArray<IOptionButtonModel> = ko.observableArray([]);

	private optionListHV: KnockoutObservableArray<IOptionButtonModel> = ko.observableArray([]);
	private optionListHV2: KnockoutObservableArray<IOptionButtonModel> = ko.observableArray([]);
	private isMuiltiCheck: boolean;
	private isOnOffRadioButton: boolean;
	private isHorizontalView: KnockoutObservable<boolean> = ko.observable(false);
	private isMatrix: KnockoutObservable<boolean> = ko.observable(false);
	private isVerticalView: KnockoutObservable<boolean> = ko.observable(false);

	private useHtmlBinding: KnockoutObservable<boolean> = ko.observable();
	private verticalControlSpace: KnockoutObservable<string> = ko.observable();
	private defaultverticalControlSpace: string = '0px';
	private checkMsgDisplay: boolean = true;
	private isIconButton: KnockoutObservable<boolean> = ko.observable();
	private selectOption: (selectedObject: IOptionButtonModel) => void;
	public getOptionsById: (id: number) => IOptionButtonModel;
	public setSelectOption: (selectedObject: IOptionButtonModel) => void;
	public setSelectById: (id: number) => void;
	public setEnableById: (id: number, enable: boolean) => void;
	public hasSelectedOptions: () => boolean;
	public enableControl: (enable: boolean) => void;
	public unSelectAll: () => void;
	public checkMsgClick: () => any;
	public checkMsgHide: () => any;
	public isForceAttachChecked: boolean = false;
	// to detect change
	public onChangesMade: (dirty: boolean) => any;
	public ischange: KnockoutObservable<boolean> = ko.observable(false);
	public checkChange: () => boolean;
	public dirtylength: number = 0;

	isTabIndex: KnockoutObservable<boolean> = ko.observable(true);
	public defaultWidth: KnockoutObservable<string> = ko.observable("135px");
	/**
   Event to trigger on selection changed of options.
   Assign a callback function, which requires to call on selection change of options.
   */
	public onSelectionChanged: { (thisArg: IOptionButtonModel): void; } = null;
	foreignBolMapChanged: (flag: boolean) => any;

	constructor(args: IOptionButtonControlArgs, viewType: number, defaultWidth?: string, foreignBolMapChanged?: (flag: boolean) => any) {
		var self = this;

		if (defaultWidth !== null && defaultWidth !== undefined) {
			self.defaultWidth(defaultWidth);
		}

		if (refSystem.isObject(args)) {
			self.foreignBolMapChanged = foreignBolMapChanged;
			self.isMuiltiCheck = false;
			if (refSystem.isBoolean(args.isMultiCheck)) {
				self.isMuiltiCheck = args.isMultiCheck;
			}
			//self.isHorizontalView(!self.isVerticalView());

			if (viewType === refEnums.Enums.OptionButtonsView.Horizontal)
				self.isHorizontalView(true);
			else if (viewType === refEnums.Enums.OptionButtonsView.Vertical)
				self.isVerticalView(true);
			else if (viewType === refEnums.Enums.OptionButtonsView.Matrix)
				self.isMatrix(true);

			self.useHtmlBinding(false);
			if (refSystem.isBoolean(args.useHtmlBinding)) {
				self.useHtmlBinding(args.useHtmlBinding);
			}

			self.isOnOffRadioButton = false;
			if (refSystem.isBoolean(args.isOnOffRadioButton)) {
				self.isOnOffRadioButton = args.isOnOffRadioButton;
			}

			self.verticalControlSpace(args.verticalControlSpace || self.defaultverticalControlSpace);

			self.isIconButton(false);
			if (refSystem.isBoolean(args.isIconButton)) {
				self.isIconButton(args.isIconButton);
			}
			if (self.isIconButton()) {
				self.useHtmlBinding(true);
			}

			if (!refSystem.isBoolean(args.allowTrackChange)) {
				args.allowTrackChange = false;
			}

			if (refSystem.isObject(args.options)) {
				for (var i = 0; i < args.options.length; i++) {
					var option: IButtonControlOption = args.options[i];
					self.optionList.push(new refOptionButton.OptionButtonModel(option.name, option.id, option.selected, option.enabled, option.iconClassName, option.isIconButton, args.allowTrackChange));

					if (option.isIconButton && !self.useHtmlBinding()) {
						self.useHtmlBinding(true);
					}
				}
			} else {
				throw 'options is undefined [Option button control].';
			}
		} else {
			throw 'undefined arguments passed to Option button control.';
		}

		self.getOptionsById = function (id: number): IOptionButtonModel {
			return ko.utils.arrayFirst(self.optionList(), function (item: IOptionButtonModel) {
				return item.id === id;
			});
		}

		self.selectOption = function (selectedObject: IOptionButtonModel) {
			//window.ga('send', 'page view', window.location.hostname + window.location.pathname + '/' + selectedObject.name());
			if (self.isMuiltiCheck) {
				var currentObject = ko.utils.arrayFirst(self.optionList(), function (item) {
					return item === selectedObject
				});
				currentObject.selected(currentObject.selected() ? false : true);
				if (currentObject.id === 2 && currentObject.selected() && !self.isForceAttachChecked) {
					currentObject.selected(false);
					if (self.checkMsgDisplay) {
						self.checkMsgDisplay = false;
						var toastrOptions = {
							toastrPositionClass: "toast-top-middle",
							delayInseconds: 10,
							fadeOut: 10,
							typeOfAlert: "",
							title: ""
						}

						Utility.ShowToastr(refEnums.Enums.ToastrMessageType.info.ID, ApplicationMessages.Messages.ForceAttachRequired, "info", self.checkMsgClick, toastrOptions, self.checkMsgHide);
					}
				}
			} else if (self.isOnOffRadioButton) {
				if (self.getSelectedOptions()) {
					if (self.getSelectedOptions() === selectedObject) {
						selectedObject.selected(selectedObject.selected() ? false : true);
					}
				} else {
					selectedObject.selected(true);
				}
			} else {
				if (self.getSelectedOptions()) {
					self.getSelectedOptions().selected(false);
				}

				selectedObject.selected(true);
			}
			if (self.onSelectionChanged) {
				if (refSystem.isFunction(self.onSelectionChanged)) {
					self.onSelectionChanged.apply(null, [this]);
				}
			}

			//self.checkChange();
			// To track change
			self.ischange(true);
			if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
				self.onChangesMade(true);

			if (currentObject.id === 7) {
				self.foreignBolMapChanged(currentObject.selected());
			}
		};

		//self.checkChange = (): boolean => {
		//	ko.utils.arrayForEach(self.optionList(), function (item) {
		//		if (item.selected()) {
		//			self.dirtylength = self.dirtylength + 1;
		//		}
		//		else {
		//			if (self.dirtylength > 0) {
		//				self.dirtylength = self.dirtylength - 1;
		//			}
		//		}
		//	});
		//		return true
		//	};

		self.setSelectOption = function (selectedObject: IOptionButtonModel) {
			self.selectOption(selectedObject);
		}

		self.setSelectById = function (id: number): void {
			var self = this;
			if (!self.isMuiltiCheck) {
				ko.utils.arrayForEach(self.optionList(), function (item: IOptionButtonModel) {
					item.selected(false);
				});
			}

			self.getOptionsById(id).selected(true);
		}

		self.setEnableById = function (id: number, enable: boolean): void {
			var selectedOption = self.getOptionsById(id);
			selectedOption.enabled(enable);
			if (!selectedOption.enabled()) {
				selectedOption.selected(false);
			}
		}

		self.hasSelectedOptions = function (): boolean {
			if (self.isMuiltiCheck) {
				return self.getSelectedOptions() ? true : false;
			} else {
				return self.getSelectedOptions(true) ? true : false;
			}
		}

		self.enableControl = function (enable: boolean): void {
			ko.utils.arrayForEach(self.optionList(), function (item: IOptionButtonModel) {
				item.enabled(enable);
			});
		}

		self.unSelectAll = function (): void {
			ko.utils.arrayForEach(self.optionList(), function (item: IOptionButtonModel) {
				item.selected(false);
			});
		}

		//To check if Msg is clicked
		self.checkMsgClick = () => {
			self.checkMsgDisplay = true;
		}

	// to Check if Msg is hidden or closed
		self.checkMsgHide = () => {
			self.checkMsgDisplay = true;
		}
	}

	/**
		* Call this method for radio button control or when is multi-check is false.
		* @returns {IOptionButtonModel}
		*/
	getSelectedOptions(): IOptionButtonModel;
	/**
	* Call this method for check button control or when is multi-check is true.
	* @param {forMultiCheck} forMultiCheck Pass true or false for multi check.
	* @returns {Array<IOptionButtonModel>}
	*/
	getSelectedOptions(forMultiCheck?: boolean): Array<IOptionButtonModel>;
	getSelectedOptions(args?: any): any {
		var self = this;
		if (self.isMuiltiCheck) {
			return ko.utils.arrayFilter(self.optionList(), function (item: IOptionButtonModel) {
				return item.selected();
			});
		} else {
			return ko.utils.arrayFirst(self.optionList(), function (item: IOptionButtonModel) {
				return item.selected();
			});
		}
	}

	getTrackChange() {
		var self = this, dirtyList = [];
		for (var key in self.optionList()) {
			if (self.optionList()[key].isDirty && self.optionList()[key].isDirty()) {
				dirtyList.push(key);
			}
		}
		return dirtyList;
	}

	isDirty() {
		return this.getTrackChange().length ? true : false;
    }

    public cleanUp() {
        var self = this;

        delete self.checkChange;
        delete self.checkMsgClick;
        delete self.checkMsgHide;
        delete self.onChangesMade;
        delete self.unSelectAll;
    }
}