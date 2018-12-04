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

/*
** <summary>
** Vendor Bill Option Button View Model.
** </summary>
** <createDetails>
** <id></id> <by>Satish</by> <date>Apr 22, 2015</date>
** </createDetails>}
** <changeHistory>}
** <id></id> <by></by> <date></date>
** </changeHistory>
*/

export class ForeignBolOptionalButtonsViewModel {
	private optionList: KnockoutObservableArray<IOptionButtonModel> = ko.observableArray([]);
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
	// to detect change
	public onChangesMade: (dirty: boolean) => any;
	public ischange: KnockoutObservable<boolean> = ko.observable(false);
	public checkChange: () => boolean;
	public dirtylength: number = 0;
	public changedButtonList: KnockoutObservableArray<number> = ko.observableArray([]);
	isTabIndex: KnockoutObservable<boolean> = ko.observable(true);

	/**
   Event to trigger on selection changed of options.
   Assign a callback function, which requires to call on selection change of options.
   */
	public onSelectionChanged: { (thisArg: IOptionButtonModel): void; } = null;
	ediBolMapChanged: (flag: boolean) => any;

	constructor(args: IOptionButtonControlArgs, viewType: number, ediBolMapChanged: (flag: boolean) => any) {
		var self = this;

		if (refSystem.isObject(args)) {
			self.ediBolMapChanged = ediBolMapChanged;

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
			var isFirstTime = false;
			var isFirst = false;
			var isSecond = false;
			var isThird = false;
			var isFour = false;

			if (currentObject.id === 1) {
				isFirst = true;
			}
			else if (currentObject.id === 2) {
				isSecond = true;
			}
			else if (currentObject.id === 3) {
				isThird = true;
			}
			else if (currentObject.id === 4) {
				isFour = true;
			}

			if (self.changedButtonList().length === 0) {
				self.changedButtonList.push(currentObject.id);
				isFirstTime = true;
			}

			self.changedButtonList().forEach(function (item) {
				if (self.changedButtonList().length > 1) {
					if (+item === currentObject.id && isFirst) {
						self.changedButtonList.remove(currentObject.id);
						isFirst = false;
					}
					else if (+item === currentObject.id && isSecond) {
						self.changedButtonList.remove(currentObject.id);
						isSecond = false;
					}
					else if (+item === currentObject.id && isThird) {
						self.changedButtonList.remove(currentObject.id);
						isThird = false;
					}
					else if (+item === currentObject.id && isFour) {
						self.changedButtonList.remove(currentObject.id);
						isFour = false;
					}
				}
			});

			self.changedButtonList().forEach(function (item) {
				if (+item !== currentObject.id && (isFirst || isSecond || isThird || isFour)) {
					self.changedButtonList.push(currentObject.id);
					isFirst = false;
					isSecond = false;
					isThird = false;
					isFour = false;
				}
			});

			self.changedButtonList().forEach(function (item) {
				if (self.changedButtonList().length === 1 && !isFirstTime && (isFirst || isSecond || isThird || isFour) && (+item === currentObject.id)) {
					self.changedButtonList.remove(currentObject.id);
					isFirst = false;
					isSecond = false;
					isThird = false;
					isFour = false;
				}
			});

			if (self.changedButtonList().length > 0) {
				_app.trigger("IsBIDirtyChange", true);
			}
			else
			{
				_app.trigger("IsBIDirtyChange", false);
			}

			//if (self.changedButtonList().length === 0) {
			//	self.changedButtonList.push(currentObject.id);
			//}

			if (self.onChangesMade && typeof (self.onChangesMade) === 'function')
				self.onChangesMade(true);

			if (currentObject.id === 3) {
				self.ediBolMapChanged(currentObject.selected());
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
}