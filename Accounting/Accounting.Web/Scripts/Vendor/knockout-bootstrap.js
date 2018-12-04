/*! knockout-bootstrap version: 0.2.1
*  2014-03-02
*  Author: Bill Pullen
*  Website: http://billpull.github.com/knockout-bootstrap
*  MIT License http://www.opensource.org/licenses/mit-license.php
*/

//UUID
function s4() {
    "use strict";
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}

function guid() {
    "use strict";
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

// Outer HTML
(function ($) {
    "use strict";
    $.fn.outerHtml = function () {
        if (this.length === 0) {
            return false;
        }
        var elem = this[0], name = elem.tagName.toLowerCase();
        if (elem.outerHTML) {
            return elem.outerHTML;
        }
        var attrs = $.map(elem.attributes, function (i) { return i.name + '="' + i.value + '"'; });
        return "<" + name + (attrs.length > 0 ? " " + attrs.join(" ") : "") + ">" + elem.innerHTML + "</" + name + ">";
    };
})(jQuery);

function setupKoBootstrap(koObject) {
    "use strict";
    // Bind twitter typeahead
    koObject.bindingHandlers.typeahead = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var $element = $(element);
            var allBindings = allBindingsAccessor();
            var typeaheadOpts = {
                source: koObject.utils.unwrapObservable(valueAccessor()),
                minLength: allBindings.minLength,
                items: allBindings.items,
                updater: allBindings.updater,
                serverSideFilter: allBindings.serverSideFilter,
                msgNoRecordFound: allBindings.msgNoRecordFound,
                showEmptyMessage: allBindings.showEmptyMessage,
                autoSelectFirstIem: allBindings.autoSelectFirstIem,
                throttle: allBindings.throttle || false,
                throttleTimeout: allBindings.throttleTimeout || 300
            };

            // Returns a function, that, as long as it continues to be invoked, will not
            // be triggered. The function will be called after it stops being called for
            // N milliseconds. If `immediate` is passed, trigger the function on the
            // leading edge, instead of the trailing.
            var debounce = function (func, wait, immediate) {
                var timeout;
                return function () {
                    var context = this, args = arguments;
                    var later = function () {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };
                    var callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) func.apply(context, args);
                };
            };

            if (typeaheadOpts.throttle) {
                // here we pass the query (search) and process callback arguments to the throttled function
                typeaheadOpts.source = debounce(koObject.utils.unwrapObservable(valueAccessor()), typeaheadOpts.throttleTimeout);
            }

            if (allBindings.typeaheadOptions) {
                $.each(allBindings.typeaheadOptions, function (optionName, optionValue) {
                    typeaheadOpts[optionName] = koObject.utils.unwrapObservable(optionValue);
                });
            }

            $element.attr("autocomplete", "off").typeahead(typeaheadOpts);
        }
    };

    // Bind Twitter Progress
    koObject.bindingHandlers.progress = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var $element = $(element);

            var bar = $('<div/>', {
                'class': 'bar',
                'data-bind': 'style: { width:' + valueAccessor() + ' }'
            });

            $element.attr('id', guid())
                .addClass('progress progress-info')
                .append(bar);

            koObject.applyBindingsToDescendants(viewModel, $element[0]);
        }
    };

    // Bind Twitter Alert
    koObject.bindingHandlers.alert = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var $element = $(element);
            var alertInfo = koObject.utils.unwrapObservable(valueAccessor());

            var dismissBtn = $('<button/>', {
                'type': 'button',
                'class': 'close',
                'data-dismiss': 'alert'
            }).html('&times;');

            var alertMessage = $('<p/>').html(alertInfo.message);

            $element.addClass('alert alert-' + alertInfo.priority)
                .append(dismissBtn)
                .append(alertMessage);
        }
    };

    // Bind Twitter Tooltip
    koObject.bindingHandlers.tooltip = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var $element, options, tooltip;
            options = koObject.utils.unwrapObservable(valueAccessor()) || {};
            $element = $(element);

            // If the title is an observable, make it auto-updating.
            if (koObject.isObservable(options.title)) {
                var isToolTipVisible = false;

                $element.on('show.tooltip', function () {
                    isToolTipVisible = true;
                });
                $element.on('hide.tooltip', function () {
                    isToolTipVisible = false;
                });

                // "true" is the bootstrap default.
                var origAnimation = options.animation || true;
                options.title.subscribe(function (newValue) {
                    if (isToolTipVisible) {
                        $element.data('tooltip').options.animation = false; // temporarily disable animation to avoid flickering of the tooltip
                        $element.tooltip('fixTitle') // call this method to update the title
                                .tooltip('hide')
                                .tooltip('show');
                        $element.data('tooltip').options.animation = origAnimation;
                    }
                });
            }

            tooltip = $element.data('tooltip');
            if (tooltip) {
                $.extend(tooltip.options, options);
            } else {
                $element.tooltip(options);
            }
        }
    };

    // Bind Twitter Popover
    koObject.bindingHandlers.popover = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            if (koObject.utils.unwrapObservable(valueAccessor()) != null) { //For scenario where we do not want to display the popover . US12050
                // read popover options
                var popoverBindingValues = koObject.utils.unwrapObservable(valueAccessor());

                // set popover title
                var popoverTitle = popoverBindingValues.title;

                // set popover template id
                var tmplId = popoverBindingValues.template;
                if (tmplId) {
                    // assign the template id to data for the element
                    $(element).data('tmplId', tmplId);
                }

                // set data for template
                var data = popoverBindingValues.data;

                // set data for allowToggle
                var allowToggle = popoverBindingValues.allowToggle || false;


                // set popover trigger
                var trigger = 'click';

                // set event type for binding bind
                var eventType = 'click';

                if (popoverBindingValues.trigger) {
                    trigger = popoverBindingValues.trigger;
                }

                // update triggers
                if (trigger === 'hover') {
                    eventType = 'mouseenter mouseleave';
                } else if (trigger === 'focus') {
                    eventType = 'focus blur';
                }

                // set popover placement
                var placement = popoverBindingValues.placement;
                var tmplHtml;

                // get template html
                if (!data) {
                    tmplHtml = $('#' + tmplId).html();
                } else {
                    tmplHtml = function () {
                        var container = $('<div data-bind="template: { name: template, if: data, data: data }"></div>');

                        koObject.applyBindings({
                            template: tmplId,
                            data: data
                        }, container[0]);
                        return container;
                    };
                }

                // create unique identifier to bind to
                var uuid = guid();
                var domId = "ko-bs-popover-" + uuid;

                // create correct binding context
                var childBindingContext = bindingContext.createChildContext(viewModel);

                // create DOM object to use for popover content
                var tmplDom = $('<div/>', {
                    "class": "ko-popover",
                    "id": domId
                }).html(tmplHtml);

                // set content options
                var options = {
                    content: $(tmplDom[0]).outerHtml(),
                    title: popoverTitle
                };

                if (placement) {
                    options.placement = placement;
                }

                if (popoverBindingValues.container) {
                    options.container = popoverBindingValues.container;
                }

                // Need to copy this, otherwise all the popups end up with the value of the last item
                var popoverOptions = $.extend({}, koObject.bindingHandlers.popover.options, options);

                // bind popover to element click
                $(element).bind(eventType, function (event) {
                    var popoverAction = 'show';
                    var popoverTriggerEl = $(this);
                    var isContentChanged = false;

                    // check if content is changed or not
                    if ($(element).data('tmplId') !== tmplId) {
                        tmplId = $(element).data('tmplId');
                        // reading the content from new template id
                        var tmpcontent = $(popoverOptions.content).empty().html($('#' + tmplId).html());
                        // assiging it to popover option content
                        popoverOptions.content = $(tmpcontent[0]).outerHtml();
                        isContentChanged = true;
                    }

                    /**
                    * Method to hide the carrier performance details modal pop-up.
                    * This is designed for hiding the carrier performance details pop-up only when click event happened on document,
                    * and when the user click on carrier performance details button we just have to make the event default, not required to call hide method.
                    * bootstrap popover itself having toggle functionality which handle for opening / closing the pop-up based on its current state.
                    * @param {MouseEvent} e
                    */
                    var hidePopup = function (e) {
                        if (e.target !== event.target) {
                            this.hide();
                        } else {
                            return e.preventDefault();
                        }
                    },
                    /**
                    * Method to set the binding for the opened pop-up.[It will triggered when the pop-up is showed in the UI]
                    * @param {jQuery.Event}    e is the jquery event object.
                    * @param {popover}    popover is the popover object of the element.
                    */
                    shown = function (e, popover) {
                        //triggers all the popovers to be closed if button is clicked on body
                        $(document).on('mousedown', $.proxy(hidePopup, popover.popover));
                        $(this).unbind('shown');
                    },
                    /**
                    * Method to un-bind the register event for the hide pop-up.[It will triggered when the pop-up is hide from the UI]
                    * @param {jQuery.Event}    e is the jquery event object.
                    * @param {popover}    popover is the popover object of the element.
                    */
                    hidden = function (e, popover) {
                        $(document).off('mousedown', hidePopup);
                        $(this).unbind('hidden');
                        return true;
                    };

                    // popovers that hover should be toggled on hover
                    // not stay there on mouseout
                    if (trigger !== 'click' || allowToggle) {
                        popoverAction = 'toggle';
                    }

                    // show/toggle popover
                    popoverTriggerEl.on('shown', shown).on('hidden', hidden).popover(popoverOptions).popover(popoverAction);

                    if (isContentChanged) {
                        popoverTriggerEl.popover('updateContent', popoverOptions.content);
                    }

                    // hide other popovers and bind knockout to the popover elements
                    var popoverInnerEl = $('#' + domId);
                    $('.ko-popover').not(popoverInnerEl).parents('.popover').remove();
                    var popoverParent = $(popoverInnerEl).parents().closest('.in');

                    // if popover element doesn't have the new template then assign it to popover element.
                    if (isContentChanged && popoverInnerEl && popoverInnerEl.outerHtml() !== $(popoverOptions.content).outerHtml()) {
                        $('#' + domId).html($(popoverOptions.content).children());
                        popoverInnerEl = $('#' + domId);
                        isContentChanged = false;
                    }

                    // if the popover is visible bind the view model to our dom ID
                    if (popoverInnerEl.is(':visible') && popoverParent.length && $(popoverParent).hasClass('popover')) {

                        koObject.applyBindingsToDescendants(childBindingContext, popoverInnerEl[0]);

                        /* Since bootstrap calculates popover position before template is filled,
                         * a smaller popover height is used and it appears moved down relative to the trigger element.
                         * So we have to fix the position after the bind
                        */

                        var triggerElementPosition = $(element).offset().top;
                        var triggerElementLeft = $(element).offset().left;
                        var triggerElementHeight = $(element).outerHeight();
                        var triggerElementWidth = $(element).outerWidth();

                        var popover = $(popoverInnerEl).parents('.popover');
                        var popoverHeight = popover.outerHeight();
                        var popoverWidth = popover.outerWidth();
                        var arrowSize = 10;

                        switch (popoverOptions.placement) {
                            case 'left':
                                popover.offset({ top: triggerElementPosition - popoverHeight / 2 + triggerElementHeight / 2, left: triggerElementLeft - arrowSize - popoverWidth });
                                break;
                            case 'right':
                                popover.offset({ top: triggerElementPosition - popoverHeight / 2 + triggerElementHeight / 2 });
                                break;
                            case 'top':
                                popover.offset({ top: triggerElementPosition - popoverHeight - arrowSize, left: triggerElementLeft - popoverWidth / 2 + triggerElementWidth / 2 });
                                break;
                            case 'bottom':
                                popover.offset({ top: triggerElementPosition + triggerElementHeight + arrowSize, left: triggerElementLeft - popoverWidth / 2 + triggerElementWidth / 2 });
                        }
                    }


                    // bind close button to remove popover
                    $(document).on('click', '[data-dismiss="popover"]', function (e) {
                        popoverTriggerEl.popover('hide');
                    });

                    // Also tell KO *not* to bind the descendants itself, otherwise they will be bound twice
                    return { controlsDescendantBindings: true };
                });
            }
        },
        update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            // read popover options
            var popoverBindingValues = koObject.utils.unwrapObservable(valueAccessor());

            if (popoverBindingValues) {
                // set popover template id
                var tmplId = popoverBindingValues.template;
            }
            if (tmplId && $(element).data('tmplId') !== tmplId) {
                $(element).data('tmplId', tmplId);
            }
        },
        options: {
            placement: "right",
            title: "",
            html: true,
            content: "",
            trigger: "manual"
        }
    };

    // binding handler for categorize typeahead
    koObject.bindingHandlers.categorizetypeahead = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var $element = $(element),
                allBindings = allBindingsAccessor(),
                categorizeTypeaheadOptions = allBindings.categorizeTypeaheadOptions || {},
                typeaheadOpts = {
                    source: koObject.utils.unwrapObservable(valueAccessor()),
                    minLength: allBindings.minLength || categorizeTypeaheadOptions.minLength,
                    items: allBindings.items || categorizeTypeaheadOptions.items,
                    updater: allBindings.updater || categorizeTypeaheadOptions.updater,
                    serverSideFilter: allBindings.serverSideFilter || categorizeTypeaheadOptions.serverSideFilter,
                    msgNoRecordFound: allBindings.msgNoRecordFound || categorizeTypeaheadOptions.msgNoRecordFound,
                    showEmptyMessage: allBindings.showEmptyMessage || categorizeTypeaheadOptions.showEmptyMessage,
                    autoSelectFirstIem: allBindings.autoSelectFirstIem || categorizeTypeaheadOptions.autoSelectFirstIem,
                    throttle: allBindings.throttle || categorizeTypeaheadOptions.throttle || false,
                    throttleTimeout: allBindings.throttleTimeout || categorizeTypeaheadOptions.throttleTimeout || 300,
                    groupbyKey: allBindings.groupbyKey || categorizeTypeaheadOptions.groupbyKey,
                    isCategorizedResult: allBindings.isCategorizedResult || categorizeTypeaheadOptions.isCategorizedResult,
                    filteredDisplayKey: allBindings.filteredDisplayKey || categorizeTypeaheadOptions.filteredDisplayKey,
                    templates: allBindings.templates || categorizeTypeaheadOptions.templates/*,
                    templates: [{
                        name: 'PRO#',
                        header: '<span>PRO</span>',
                        slicecount: 2,
                        moreresult: '<a href="#">All PRO# Results<span class="greatericon">&nbsp;&rsaquo;&rsaquo;</span></a>'
                    }, {
                        name: 'PO#',
                        header: '',
                        slicecount: 2,
                        moreresult: ''
                    }, {
                        name: 'REF#',
                        header: '',
                        slicecount: 2,
                        moreresult: ''
                    }, {
                        name: 'BOL#',
                        header: '',
                        slicecount: 2,
                        moreresult: ''
                    }]*/
                };

            // Need to copy this, otherwise all the popups end up with the value of the last item
            typeaheadOpts = $.extend({}, koObject.bindingHandlers.categorizetypeahead.options, typeaheadOpts);

            if (categorizeTypeaheadOptions.displaykey || allBindings.displaykey) {
                $element.data('filterkey', categorizeTypeaheadOptions.displaykey || allBindings.displaykey);
            }
            if (categorizeTypeaheadOptions.datakeys || allBindings.datakeys) {
                $element.data('datakeys', categorizeTypeaheadOptions.datakeys || allBindings.datakeys);
            }
            if (categorizeTypeaheadOptions.iconsettings || allBindings.iconsettings) {
                $element.data('iconsettings', categorizeTypeaheadOptions.iconsettings || allBindings.iconsettings);
            }

            // Returns a function, that, as long as it continues to be invoked, will not
            // be triggered. The function will be called after it stops being called for
            // N milliseconds. If `immediate` is passed, trigger the function on the
            // leading edge, instead of the trailing.
            var debounce = function (func, wait, immediate) {
                var timeout;
                return function () {
                    var context = this, args = arguments;
                    var later = function () {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };
                    var callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) func.apply(context, args);
                };
            };

            if (typeaheadOpts.throttle) {
                // here we pass the query (search) and process callback arguments to the throttled function
                typeaheadOpts.source = debounce(koObject.utils.unwrapObservable(valueAccessor()), typeaheadOpts.throttleTimeout);
            }

            if (allBindings.typeaheadOptions) {
                $.each(allBindings.typeaheadOptions, function (optionName, optionValue) {
                    typeaheadOpts[optionName] = koObject.utils.unwrapObservable(optionValue);
                });
            }

            $element.attr("autocomplete", "off").typeahead(typeaheadOpts);
        },
        options: {
            menu: '<ul class="categorizetypeahead dropdown-menu"></ul>',
            item: '<li class="categorizetypeaheadItems"><span></span></li>',
            headeritem: '<li class="categorizetypeaheadHeading" data-value="category"></li>',
            allowEnter: true,
            allowTab: false,
            allowSorter: false,
            allowMouseDown: true,
            isCategoryTypeahead: true,
            highlighter: function (item) {
                var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
                if (typeof (item) === 'string' && String.prototype.hasOwnProperty('capitalize')) {
                    item = item.capitalize(true);
                }
                return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                    return $('<span></span>').addClass('highlight').html(match).outerHtml();
                });
            },
            groupbyKey: 'category',
            render: function (items) {
                var that = this,
                catagerizedItems = that.isCategorizedResult ? items : groupBy(items, that.groupbyKey),
                hasmoreResult = false;
                that.$menu.html('');
                each(catagerizedItems, updateDataset);
                if (hasmoreResult) {
                    that.$menu.append('<li class="categorizetypeaheadMoreResult" data-value="MoreResult" data-category="MoreResult"><span><a href="#">More Results<span class="greatericon">&nbsp;&rsaquo;&rsaquo;</span></a></span></li>');
                }
                that.$menu.find('li:first').addClass('active');
                return that;

                function updateDataset(cItem) {
                    var template = getTemplate(that.templates, cItem[that.groupbyKey]);

                    if (template && cItem.items && cItem.items.length) {
                        var $header = $(that.headeritem).append(template.header).attr('data-category', template.name);
                        if (cItem.items.length > template.slicecount) {
                            hasmoreResult = true;
                            $header.append(template.moreresult);
                        }
                        that.$menu.append($header.outerHtml());
                    }

                    that.$menu.append(getSuggestionsHtml(cItem.items.slice(0, template ? template.slicecount : cItem.items.length), template ? template.name : undefined));
                }

                function getSuggestionsHtml(suggestions, category) {
                    return $(suggestions).map(function (index, item) {
                        if (!item[that.groupbyKey] && category) {
                            item[that.groupbyKey] = category;
                        }
                        var liItem = $(that.options.item).attr('data-value', JSON.stringify(item)),
                            dataItem = item,
                            iconSettings = that.$element.data('iconsettings'),
                            filteredItem;

                        if (!$.isPlainObject(iconSettings)) {
                            eval('iconSettings=' + iconSettings);
                        }

                        if (!that.isResultItemIsString) {
                            filteredItem = getFilteredDisplay(item);
                            item = getDisplay(item);
                        }

                        if (typeof iconSettings === 'object') {
                            var spanText = $('<span></span>').html(that.highlighter(filteredItem ? getDisplayEllipsis(item) : item)),
                                iconClass = null;

                            for (var key in iconSettings) {
                                iconClass = getIconClass(iconSettings, dataItem, key);
                                if (iconClass) break;
                            }

                            if (iconClass && iconClass.length) {
                                liItem.find('span').append($('<i>&nbsp;</i>').addClass(iconClass));
                            }

                            liItem.find('span').append(spanText);
                        }
                        else {
                            liItem.find('span').html(that.highlighter(filteredItem ? getDisplayEllipsis(item) : item))
                        }

                        if (filteredItem) {
                            liItem.find('span').addClass('alignleft').attr('title', getTitle(item, true));
                            liItem.append($('<span></span>').addClass('filteredDisplay').html(that.highlighter(getFilteredDisplayEllipsis(filteredItem))).attr('title', getTitle(filteredItem, false)));
                        }

                        /// Adding CSS to ellipsis.
                        if (item.toString() === '...') {
                            liItem.find('span').attr('style', 'line-height: 7px; text-align: center;');
                        }

                        return liItem[0];
                    });
                }

                function groupBy(items, propertyName) {
                    var distinctProperty = [],
                        result = [];
                    $.each(items, function (index, item) {
                        if ($.inArray(item[propertyName], distinctProperty) == -1) {
                            distinctProperty.push(item[propertyName]);
                        }
                    });

                    $.each(distinctProperty, function (index, item) {
                        var groupResult = {};
                        groupResult[propertyName] = item;
                        groupResult.items = [];
                        if ($.inArray(item, items) == -1) {
                            groupResult.items = $.map(items, function (elementOrValue, indexOrKey) {
                                if (elementOrValue.hasOwnProperty(propertyName)) {
                                    if (elementOrValue[propertyName] === item) {
                                        return elementOrValue;
                                    }
                                } else {
                                    return elementOrValue;
                                }
                            });
                        }
                        result.push(groupResult);
                    });
                    return result;
                }

                function each(collection, cb) {
                    // stupid argument order for jQuery.each
                    $.each(collection, reverseArgs);

                    function reverseArgs(index, value) { return cb(value, index); }
                }

                function getTemplate(templates, name) {
                    if (templates && templates.length) {
                        var template = $.map(templates, function (value, indexOrKey) {
                            if (value.name === name) {
                                return {
                                    name: value.name,
                                    header: value.header || '<span>' + value.name + '</span>',
                                    slicecount: value.slicecount || 2,
                                    moreresult: value.moreresult || '<a href="#">All ' + value.name + ' Results<span class="greatericon">&nbsp;&rsaquo;&rsaquo;</span></a>'
                                };
                            }
                        });
                        if (template && template.length) {
                            return template[0];
                        }
                    }
                    if (name) {
                        return {
                            name: name,
                            header: '<span>' + name + '</span>',
                            slicecount: 2,
                            moreresult: '<a href="#">All ' + name + ' Results<span class="greatericon">&nbsp;&rsaquo;&rsaquo;</span></a>'
                        };
                    }
                    return false;
                }

                function getDisplay(item) {
                    if (typeof item[that.getFilterKey()] === 'function') {
                        return item[that.getFilterKey()]();
                    }
                    else {
                        return item[that.getFilterKey()];
                    }
                }

                function getDisplayEllipsis(item) {
                    if (typeof item === 'string' && item && item.length) {
                        return item.length > 13 ? item.substring(0, 11) + '...' : item;
                    }
                    return item;
                }

                function getFilteredDisplay(item) {
                    if (that.filteredDisplayKey && item.hasOwnProperty(that.filteredDisplayKey)) {
                        if (typeof item[that.filteredDisplayKey] === 'function') {
                            return item[that.filteredDisplayKey]();
                        }
                        else {
                            return item[that.filteredDisplayKey];
                        }
                    }
                    return undefined;
                }

                function getFilteredDisplayEllipsis(item) {
                    if (typeof item === 'string' && item && item.length) {
                        return item.length > 32 ? item.substring(0, 30) + '...' : item;
                    }
                    return item;
                }

                function getTitle(item, isDisplay) {
                    if (isDisplay && item === getDisplayEllipsis(item)) {
                        return undefined;
                    }
                    else if (!isDisplay && item === getFilteredDisplayEllipsis(item)) {
                        return undefined;
                    }
                    return item;
                }

                function getIconClass(iconSettings, dataItem, key) {
                    if (iconSettings.hasOwnProperty(key) && dataItem.hasOwnProperty(key)) {
                        if (typeof dataItem[key] === 'function') {
                            if (dataItem[key]()) {
                                return iconSettings[key];
                            }
                        }
                        else if (dataItem[key]) {
                            return iconSettings[key];
                        }
                    }
                    else if (key === 'defaulticon' && iconSettings.hasOwnProperty('defaulticon')) {
                        return iconSettings[key];
                    }
                }
            },
            click: function (e) {
                e.stopPropagation()
                e.preventDefault()
                var activeMenu = this.$menu.find('.active')
                var currentItem = $(e.target)
                var filteredHitItem = activeMenu.find('span.filteredDisplay')
                if (activeMenu.data('value') === 'category' || activeMenu.data('value') === 'MoreResult') {
                    var activeMenuAnchor = activeMenu.find('a');
                    currentItem = activeMenuAnchor.is(currentItem) ? currentItem : currentItem.parent('a');
                    if (activeMenuAnchor.is(currentItem)) {
                        this.$element.trigger({ type: 'onClickMoreResult', resultData: { category: activeMenu.data('category'), query: this.query } }, [{ category: activeMenu.data('category'), query: this.query }]);
                        this.hide();
                        this.$element.focus();
                        return this;
                    }

                    return;
                }
                if (activeMenu.is(currentItem)) {
                    return;
                }
                if (filteredHitItem.is(currentItem)) {
                    return;
                }
                if (currentItem.hasClass('highlight') && filteredHitItem.is(currentItem.parent('span.filteredDisplay'))) {
                    return;
                }
                this.select()
                this.$element.focus()
            },
            blur: function (e) {
                var that = this;
                if (that.shown && that.$menu.find('.active').attr('data-value') === 'category' || this.$menu.find('.active').attr('data-value') === 'MoreResult') {
                    return;
                }
                if (that.shown && that.$menu.find('.categorizetypeaheadItems.active').outerHtml()) {
                    return;
                }
                that.focused = false;
                if (that.$element.hasClass('ui-autocomplete-loading')) {
                    that.$element.removeClass("ui-autocomplete-loading");
                }
                if (!that.mousedover && that.shown) {
                    if (that.autoSelectFirstIem) {
                        return that.select();
                    }
                    that.hide();
                }
            },
            keyup: function (e) {
                switch (e.keyCode) {
                    case 40: // down arrow
                    case 38: // up arrow
                    case 16: // shift
                    case 17: // ctrl
                    case 18: // alt
                        break

                    case 9: // tab
                        if (!this.shown) return
                        if (!this.allowTab) return
                        this.select()
                        break

                    case 13: // enter
                        if (!this.shown) return
                        if (!this.allowEnter) return
                        this.selectFirst()
                        break

                    case 27: // escape
                        if (!this.shown) return
                        this.hide()
                        break

                    default:
                        this.lookup()
                }
            },
            selectFirst: function () {
                var val = {}, text, datatext;

                if (this.focused || this.mousedover) {
                    if (this.isCategoryTypeahead) {
                        val = JSON.parse(this.$menu.find('.categorizetypeaheadItems:first').attr('data-value'));
                    } else {
                        val = JSON.parse(this.$menu.find('.active').attr('data-value'));
                    }
                } else {
                    if (this.results && this.results.length) {
                        val = this.results[0];
                    }
                }

                if (val[this.getFilterKey()] === this.msgNoRecordFound || val[this.getFilterKey()] === '...') {
                    if (this.$element.hasClass('ui-autocomplete-loading')) {
                        this.$element.removeClass("ui-autocomplete-loading");
                    }
                    return this.shown ? this.hide() : this;
                }

                if (!this.isResultItemIsString) {
                    text = val[this.getFilterKey()];
                    datatext = JSON.stringify(this.getDataItems(val));
                } else {
                    text = val;
                }

                if (!this.focused) {
                    if ((text && text.toLowerCase().indexOf(this.query.toLowerCase()) === -1) && (datatext && datatext.toLowerCase().indexOf(this.query.toLowerCase()) === -1)) {
                        if (!this.mousedover && this.shown) {
                            this.hide();
                        }
                        return;
                    }
                }

                this.$element.val(text).change();

                this.$element.trigger({ type: 'onSelect', obj: val }, [{ query: this.query, selectedItem: val }]);

                return this.hide();
            }
        }
    };
}

(function (factory) {
    "use strict";
    // Support multiple loading scenarios
    if (typeof define === 'function' && define.amd) {
        // AMD anonymous module

        define(["require", "exports", "knockout"], function (require, exports, knockout) {
            factory(knockout);
        });
    } else {
        // No module loader (plain <script> tag) - put directly in global namespace
        factory(window.ko);
    }
}(setupKoBootstrap));
