/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

//#region References
define(["require", "exports", 'durandal/system', 'services/models/common/OptionButton', '../services/models/common/Enums', 'durandal/app'], function(require, exports, __refSystem__, __refOptionButton__, __refEnums__, ___app__) {
    /// <reference path="../../Scripts/TypeDefs/common.d.ts" />
    /// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
    /// <reference path="../../Scripts/Constants/ApplicationMessages.ts" />
    //#endregion
    var refSystem = __refSystem__;
    var refOptionButton = __refOptionButton__;
    var refEnums = __refEnums__;
    var _app = ___app__;

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
    var ForeignBolOptionalButtonsViewModel = (function () {
        function ForeignBolOptionalButtonsViewModel(args, viewType, ediBolMapChanged) {
            this.optionList = ko.observableArray([]);
            this.isHorizontalView = ko.observable(false);
            this.isMatrix = ko.observable(false);
            this.isVerticalView = ko.observable(false);
            this.useHtmlBinding = ko.observable();
            this.verticalControlSpace = ko.observable();
            this.defaultverticalControlSpace = '0px';
            this.checkMsgDisplay = true;
            this.isIconButton = ko.observable();
            this.ischange = ko.observable(false);
            this.dirtylength = 0;
            this.changedButtonList = ko.observableArray([]);
            this.isTabIndex = ko.observable(true);
            /**
            Event to trigger on selection changed of options.
            Assign a callback function, which requires to call on selection change of options.
            */
            this.onSelectionChanged = null;
            var self = this;

            if (refSystem.isObject(args)) {
                self.ediBolMapChanged = ediBolMapChanged;

                self.isMuiltiCheck = false;
                if (refSystem.isBoolean(args.isMultiCheck)) {
                    self.isMuiltiCheck = args.isMultiCheck;
                }

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
                        var option = args.options[i];
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

            self.getOptionsById = function (id) {
                return ko.utils.arrayFirst(self.optionList(), function (item) {
                    return item.id === id;
                });
            };

            self.selectOption = function (selectedObject) {
                if (self.isMuiltiCheck) {
                    var currentObject = ko.utils.arrayFirst(self.optionList(), function (item) {
                        return item === selectedObject;
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
                } else if (currentObject.id === 2) {
                    isSecond = true;
                } else if (currentObject.id === 3) {
                    isThird = true;
                } else if (currentObject.id === 4) {
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
                        } else if (+item === currentObject.id && isSecond) {
                            self.changedButtonList.remove(currentObject.id);
                            isSecond = false;
                        } else if (+item === currentObject.id && isThird) {
                            self.changedButtonList.remove(currentObject.id);
                            isThird = false;
                        } else if (+item === currentObject.id && isFour) {
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
                } else {
                    _app.trigger("IsBIDirtyChange", false);
                }

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
            self.setSelectOption = function (selectedObject) {
                self.selectOption(selectedObject);
            };

            self.setSelectById = function (id) {
                var self = this;
                if (!self.isMuiltiCheck) {
                    ko.utils.arrayForEach(self.optionList(), function (item) {
                        item.selected(false);
                    });
                }

                self.getOptionsById(id).selected(true);
            };

            self.setEnableById = function (id, enable) {
                var selectedOption = self.getOptionsById(id);
                selectedOption.enabled(enable);
                if (!selectedOption.enabled()) {
                    selectedOption.selected(false);
                }
            };

            self.hasSelectedOptions = function () {
                if (self.isMuiltiCheck) {
                    return self.getSelectedOptions() ? true : false;
                } else {
                    return self.getSelectedOptions(true) ? true : false;
                }
            };

            self.enableControl = function (enable) {
                ko.utils.arrayForEach(self.optionList(), function (item) {
                    item.enabled(enable);
                });
            };

            self.unSelectAll = function () {
                ko.utils.arrayForEach(self.optionList(), function (item) {
                    item.selected(false);
                });
            };

            //To check if Msg is clicked
            self.checkMsgClick = function () {
                self.checkMsgDisplay = true;
            };

            // to Check if Msg is hidden or closed
            self.checkMsgHide = function () {
                self.checkMsgDisplay = true;
            };
        }
        ForeignBolOptionalButtonsViewModel.prototype.getSelectedOptions = function (args) {
            var self = this;
            if (self.isMuiltiCheck) {
                return ko.utils.arrayFilter(self.optionList(), function (item) {
                    return item.selected();
                });
            } else {
                return ko.utils.arrayFirst(self.optionList(), function (item) {
                    return item.selected();
                });
            }
        };

        ForeignBolOptionalButtonsViewModel.prototype.getTrackChange = function () {
            var self = this, dirtyList = [];
            for (var key in self.optionList()) {
                if (self.optionList()[key].isDirty && self.optionList()[key].isDirty()) {
                    dirtyList.push(key);
                }
            }
            return dirtyList;
        };

        ForeignBolOptionalButtonsViewModel.prototype.isDirty = function () {
            return this.getTrackChange().length ? true : false;
        };
        return ForeignBolOptionalButtonsViewModel;
    })();
    exports.ForeignBolOptionalButtonsViewModel = ForeignBolOptionalButtonsViewModel;
});
