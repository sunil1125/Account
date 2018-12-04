/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

define(["require", "exports", 'durandal/system', 'services/models/common/OptionButton'], function(require, exports, __refSystem__, __refOptionButton__) {
    /// <reference path="../../Scripts/TypeDefs/common.d.ts" />
    /// <reference path="../services/models/TypeDefs/CommonModels.d.ts" />
    var refSystem = __refSystem__;
    var refOptionButton = __refOptionButton__;

    /** <summary>
    * * Export Control View Model
    * * < / summary >
    * * <createDetails>proNumber
    * * <id> < /id> <by>Sankesh Poojari</by > <date>April 4, 2013</date >
    * * < / createDetails >
    * * <changeHistory>
    * * < / changeHistory >
    */
    var OptionButtonControl = (function () {
        function OptionButtonControl(args) {
            this.optionList = ko.observableArray([]);
            this.isHorizontalView = ko.observable();
            this.isVerticalView = ko.observable();
            this.useHtmlBinding = ko.observable();
            this.verticalControlSpace = ko.observable();
            this.defaultverticalControlSpace = '0px';
            this.isIconButton = ko.observable();
            /**
            Event to trigger on selection changed of options.
            Assign a callback function, which requires to call on selection change of options.
            */
            this.onSelectionChanged = null;
            var self = this;
            if (refSystem.isObject(args)) {
                self.isMuiltiCheck = false;
                if (refSystem.isBoolean(args.isMultiCheck)) {
                    self.isMuiltiCheck = args.isMultiCheck;
                }

                self.isVerticalView(false);
                if (refSystem.isBoolean(args.isVerticalView)) {
                    self.isVerticalView(args.isVerticalView);
                }

                self.isHorizontalView(!self.isVerticalView());

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
            };

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
        }
        OptionButtonControl.prototype.getSelectedOptions = function (args) {
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

        OptionButtonControl.prototype.getTrackChange = function () {
            var self = this, dirtyList = [];
            for (var key in self.optionList()) {
                if (self.optionList()[key].isDirty && self.optionList()[key].isDirty()) {
                    dirtyList.push(key);
                }
            }
            return dirtyList;
        };

        OptionButtonControl.prototype.isDirty = function () {
            return this.getTrackChange().length ? true : false;
        };
        return OptionButtonControl;
    })();
    exports.OptionButtonControl = OptionButtonControl;
});
