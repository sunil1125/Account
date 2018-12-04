/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

define(["require", "exports"], function(require, exports) {
    /* File Created: April 4, 2013 */
    /* Created By Sankesh Poojari*/
    /// <reference path="../../../../Scripts/TypeDefs/jquery.d.ts" />
    /// <reference path="../../../../Scripts/TypeDefs/knockout.d.ts" />
    /// <reference path="../../../../Scripts/TypeDefs/durandal.d.ts" />
    /// <reference path="../TypeDefs/CommonModels.d.ts" />
    /// <reference path="../../../../Scripts/TypeDefs/utils.d.ts" />
    var OptionButtonModel = (function () {
        function OptionButtonModel(name, id, selected, enabled, iconClassName, isIconButton, showTooltip, tooltip, allowTrackChange) {
            var self = this;
            self.name = ko.observable(name);
            self.id = id;
            if (!allowTrackChange) {
                allowTrackChange = false;
            }
            self.selected = ko.observable(selected).extend({ trackChange: allowTrackChange });

            if (typeof enabled === 'undefined' || enabled === null) {
                self.enabled = ko.observable(true);
            } else {
                self.enabled = ko.observable(enabled);
            }

            if (typeof isIconButton === 'undefined' || isIconButton === null) {
                self.isIconButton = ko.observable(false);
            } else {
                self.isIconButton = ko.observable(isIconButton);
            }

            if (self.isIconButton()) {
                if (typeof iconClassName === 'undefined' || iconClassName === null || iconClassName === '') {
                    throw new Error('Icon class for ' + self.name() + ' is undefined');
                }
            }

            self.iconClassName = ko.observable(iconClassName ? iconClassName : "icon-ok icon-white");

            self.html = ko.computed(function () {
                if (self.isIconButton()) {
                    return '<i class="' + self.iconClassName() + (self.selected() ? ' active' : '') + '"></i>';
                } else {
                    return '<i class="' + (self.selected() ? self.iconClassName() : "") + '"></i>' + self.name();
                }
            });

            if (typeof showTooltip === 'undefined' || showTooltip === null) {
                self.showTooltip = ko.observable(false);
            } else {
                self.showTooltip = ko.observable(showTooltip);
            }

            if (self.showTooltip()) {
                if (tooltip && typeof tooltip === 'object') {
                    self.tooltip = ko.observable(tooltip);
                } else {
                    var mytooltip = { title: self.name(), placement: 'bottom', trigger: 'hover' };
                    self.tooltip = ko.observable(mytooltip);
                }
            } else {
                self.tooltip = ko.observable();
            }

            self.getTrackChange = function () {
                return Utils.getDirtyItems(self);
            };

            self.isDirty = function () {
                return self.getTrackChange().length ? true : false;
            };
            return self;
        }
        return OptionButtonModel;
    })();
    exports.OptionButtonModel = OptionButtonModel;
});
