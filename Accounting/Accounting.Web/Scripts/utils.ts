/******************************************************************************
* Copyright (C) 2010-2016 GlobalTranz - All Rights Reserved. 
*
* Proprietary and confidential. Unauthorized copying of this file, via any
* medium is strictly prohibited without the explicit permission of GlobalTranz. 
******************************************************************************/

/* File Created: August 1, 2013 */
/// <reference path="TypeDefs/jquery.d.ts" />
/// <reference path="TypeDefs/Bootstrap.d.ts" />
/// <reference path="TypeDefs/knockout.d.ts" />
/// <reference path="TypeDefs/bootstrap.datepicker.d.ts" />
/// <reference path="TypeDefs/bootstrap.daterangepicker.d.ts" />
/// <reference path="TypeDefs/jquery.timepicker.d.ts" />
/// <reference path="TypeDefs/common.d.ts" />
/// <reference path="TypeDefs/utils.d.ts" />
/// <reference path="TypeDefs/fusioncharts.d.ts" />
/// <reference path="TypeDefs/ko-grid.d.ts" />
/// <reference path="TypeDefs/moment.d.ts" />

/* ====================================== */
/* Customized bootstrap type ahead control */
!function ($that: JQueryStatic) {
	"use strict";

	var btTypeAhead = $that.fn.typeahead;

	btTypeAhead.defaults.filterKey = null;

	btTypeAhead.defaults.dataKeys = null;

	btTypeAhead.Constructor.prototype.filterItemsByKey = function (filterKey, itemsObject) {
		var itemsArray = new Array();
		if (itemsObject) {
			// (!) Cache the array length in a variable
			for (var i = 0; i < itemsObject.length; i++) {
				if (typeof itemsObject[i][filterKey] === 'function') {
					itemsArray.push(itemsObject[i][filterKey]());
				}
				else {
					itemsArray.push(itemsObject[i][filterKey]);
				}
			}
		}

		return itemsArray;
	};

	btTypeAhead.Constructor.prototype.getDataItems = function (item) {
		var dataKeys = this.getDataKeys(),
			dItem = [];
		if (dataKeys && dataKeys.split(',').length) {
			var dKey = dataKeys.split(',');

			dKey.forEach(function (key) {
				if (item.hasOwnProperty(key)) {
					if (typeof item[key] === 'function') {
						if (item[key]()) {
							dItem.push(item[key]());
						}
					}
					else {
						if (item[key]) {
							dItem.push(item[key]);
						}
					}
				}
			});
			return dItem;
		}
	};

	btTypeAhead.Constructor.prototype.getFilterKey = function () {
		return btTypeAhead.defaults.filterKey || this.$element.data('filterkey');
	};

	btTypeAhead.Constructor.prototype.getDataKeys = function () {
		return btTypeAhead.defaults.dataKeys || this.$element.data('datakeys') || this.getFilterKey();
	};

	btTypeAhead.Constructor.prototype.select = function () {
		var val: any = {},
			text: string,
			datatext: string;

		if (this.focused || this.mousedover) {
			val = JSON.parse(this.$menu.find('.active').attr('data-value'));
		}
		else {
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
		}
		else {
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

	btTypeAhead.Constructor.prototype.lookup = function (event) {
		var items;
		this.query = this.$element.val();
		if (!this.query || this.query.length < this.options.minLength) {
			if (this.$element.hasClass('ui-autocomplete-loading')) {
				this.$element.removeClass("ui-autocomplete-loading");
			}
			return this.shown ? this.hide() : this;
		}
		this.$element.addClass("ui-autocomplete-loading");
		items = $that.isFunction(this.source) ? this.source(this.query, $that.proxy(this.process, this)) : this.source;
		/*if (this.getFilterKey()) {
			items = this.filterItemsByKey(this.getFilterKey(), items);
		}*/
		return items ? this.process(items) : this;
	};

	btTypeAhead.Constructor.prototype.process = function (results: Array<any>) {
		var that = this,
			items,
			q;
		if (that.results && $that.isFunction(that.source)) {
			that.results.removeAll();
		}
		that.results = results;
		if (results.length && typeof results[0] != "string")
			that.isResultItemIsString = false;

		that.query = that.$element.val();

		if (!that.query) {
			if (that.$element.hasClass('ui-autocomplete-loading')) {
				that.$element.removeClass("ui-autocomplete-loading");
			}
			return that.shown ? that.hide() : that;
		}
		items = $that.grep(results, function (item) {
			var dItem = [];
			if (!that.isResultItemIsString) {
				/*if (typeof item[that.getFilterKey()] === 'function') {
					item = item[that.getFilterKey()]();
				}
				else {
					item = item[that.getFilterKey()];
				}*/
				dItem = that.getDataItems(item);
			}
			if (!that.serverSideFilter) {
				if (that.matcher(JSON.stringify(dItem))) {
					return item;
				}
			}
			else {
				return item;
			}
		})

		if (that.allowSorter) {
			items = that.sorter(items);
		}

		if (!items.length) {
			if (that.showEmptyMessage === true) {
				var key = that.getFilterKey();
				if (key) {
					var obj = new Object;
					obj[key] = that.msgNoRecordFound;
					items.push(obj);
				}
				else
					items.push(that.msgNoRecordFound);
			}
			else {
				if (that.$element.hasClass('ui-autocomplete-loading')) {
					that.$element.removeClass("ui-autocomplete-loading");
				}
				return that.shown ? that.hide() : that;
			}
		}

		if (that.$element.hasClass('ui-autocomplete-loading')) {
			that.$element.removeClass("ui-autocomplete-loading");
		}

		if (that.focused) {
			that.render(items.slice(0, that.options.items));

			if (items && items.length === 1) {
				var firstItem = items[0],
					selectedText = '';
				if (!that.isResultItemIsString) {
					//selectedText = firstItem[that.getFilterKey()];
					selectedText = JSON.stringify(that.getDataItems(firstItem));
				}
				else {
					selectedText = firstItem;
				}

				// if query and current result are not same then don't show the dropdown list.
				// except for if the item is msgNoRecordFound
				if ((selectedText && selectedText.toLowerCase().indexOf(that.query.toLowerCase()) === -1)
					&& !(that.showEmptyMessage && selectedText.toLowerCase().indexOf(that.msgNoRecordFound.toLowerCase()))
					&& !that.serverSideFilter) {
					return;
				} else {
					return that.show();
				}
			} else {
				return that.show();
			}
		}
		else if (this.autoSelectFirstIem) {
			that.render(items.slice(0, that.options.items));
			return that.select();
		}
		else {
			return;
		}
	}

	btTypeAhead.Constructor.prototype.sorter = function (items) {
		var beginswith = []
			, caseSensitive = []
			, caseInsensitive = []
			, item
			, sortby

		while (item = items.shift()) {
			if (this.isResultItemIsString) sortby = item
			else
				if (typeof item[this.getFilterKey()] === 'function') {
					sortby = item[this.getFilterKey()]();
				}
				else {
					sortby = item[this.getFilterKey()];
				}

			if (!sortby.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
			else if (~sortby.indexOf(this.query)) caseSensitive.push(item)
			else caseInsensitive.push(item)
		}

		return beginswith.concat(caseSensitive, caseInsensitive)
	}

	btTypeAhead.Constructor.prototype.render = function (items) {
		var that = this

		items = $that(items).map(function (index, item) {
			var liItem = $that(that.options.item).attr('data-value', JSON.stringify(item)),
				dataItem = item,
				iconSettings = that.$element.data('iconsettings');
			eval('iconSettings=' + iconSettings);

			if (!that.isResultItemIsString) {
				if (typeof item[that.getFilterKey()] === 'function') {
					item = item[that.getFilterKey()]();
				}
				else {
					item = item[that.getFilterKey()];
				}
			}

			if (typeof iconSettings === 'object') {
				var spanText = $('<span></span>').html(that.highlighter(item)),
					iconClass = null;
				for (var key in iconSettings) {
					if (iconSettings.hasOwnProperty(key) && dataItem.hasOwnProperty(key)) {
						if (typeof dataItem[key] === 'function') {
							if (dataItem[key]()) {
								iconClass = iconSettings[key];
								break;
							}
						}
						else if (dataItem[key]) {
							iconClass = iconSettings[key];
							break;
						}
					}
					else if (key === 'defaulticon' && iconSettings.hasOwnProperty('defaulticon')) {
						iconClass = iconSettings[key];
						break;
					}
				}

				if (iconClass && iconClass.length) {
					liItem.find('a').append($('<span>&nbsp;</span>').addClass(iconClass));
				}

				liItem.find('a').append(spanText);
			}
			else {
				liItem.find('a').html(that.highlighter(item))
			}

			/// Adding CSS to ellipsis.
			if (item.toString() === '...') {
				liItem.find('a').attr('style', 'line-height: 7px;  border-top: 2px solid #233757;  text-align: center;');
			}

			return liItem[0]
		});

		items.first().addClass('active');
		this.$menu.html(items);
		return this;
	}

	btTypeAhead.Constructor.prototype.blur = function (e) {
		var that = this;
		that.focused = false;
		if (that.$element.hasClass('ui-autocomplete-loading')) {
			that.$element.removeClass("ui-autocomplete-loading");
		}
		if (!that.mousedover && that.shown) that.hide();
    }

    btTypeAhead.Constructor.prototype.dispose = function () {
        if (this.eventSupported('keydown')) {
            this.$element.off('keydown');
        }
        this.$element.off('focus').off('blur').off('keypress').off('keyup').off('select').off('lookup').off('sorter').off('render').off('blur');
        this.$element = null;

        this.$menu.off('click').off('mouseenter').off('mouseleave');
        this.$menu = null;
    }
} (jQuery);
/* Customized bootstrap type ahead control */
/* ====================================== */

/* ====================================== */
/* Added toggle for topHeaderBtn control */
!function ($that: JQueryStatic) {
	"use strict";

	$that(document).on('click.button.data-api', '[data-toggle^=button]', function (e) {
		var $btn = $that(e.target);
		if (!$btn.hasClass('topHeaderBtn')) {
			$btn = $btn.closest('.topHeaderBtn');
		}
		$btn.button('toggle');
	});
} (jQuery);
/* Added toggle for topHeaderBtn control */
/* ====================================== */

/* ====================================== */
/* Registers the knockout bindings functions in knockout object */
!function (knockout: KnockoutStatic) {
	"use strict";

	knockout.bindingHandlers.showModal = {
		init: function (element, valueAccessor) {
		},
		update: function (element, valueAccessor) {
			var value = valueAccessor();
			if (ko.utils.unwrapObservable(value)) {
				$(element).modal('show');

				// this is to focus input field inside dialog
				$("input", element).focus();

				if (ko.isObservable(value)) {
					if (value()) {
						value(false);
					}
				}
			}
			else {
				$(element).modal('hide');
			}
		}
	};

	knockout.bindingHandlers.showProgress = {
		init: function (element, valueAccessor) {
		},
		update: function (element, valueAccessor) {
			var value = valueAccessor();
			if (ko.utils.unwrapObservable(value)) {
				$(element).show();
			}
			else {
				$(element).fadeOut();
			}
		}
	};

	knockout.bindingHandlers.datepicker = {
		init: function (element, valueAccessor, allBindingsAccessor) {
			var options: DatepickerOptions = allBindingsAccessor().datepickerOptions || { format: 'dd/mm/yyyy', autoClose: true };

			/** To setting the start date **/
			var value = valueAccessor();
			if (ko.isObservable(value)) {
				if (value()) {
					options.startDate = value();
				}
			}
			/** To setting the start date **/

			$(element).datepicker(options);

			/* handle disposal (if KO removes by the template binding) */
			ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
				$(element).datepicker("destroy");
			});

			/* when a user changes the date, update the view model */
			ko.utils.registerEventHandler(element, "changeDate", function (event: JQueryDatePickerEventObject) {
				var value = valueAccessor();
				if (ko.isObservable(value)) {
					value(event.dateString);
				}
			});
		},
		update: function (element, valueAccessor, allBindingsAccessor) {
			var options: DatepickerOptions = allBindingsAccessor().datepickerOptions || { format: 'dd/mm/yyyy', autoClose: true };

			/** To setting the date **/
			var widget = $(element).data("datepicker");
			//when the view model is updated, update the widget
			if (widget) {
				var value = ko.utils.unwrapObservable(valueAccessor());
				if (value === widget.date) {
					return;
				}

				if (widget.date instanceof Date) {
					var CommonUtils: Utils.Common = new Utils.Common();
					var widgetDate: string = CommonUtils.formatDate(widget.date, widget.format);

					if (value === widgetDate) {
						return;
					}
				}

				if (!widget.date) {
					return;
				}

				if (widget.blockPreviousDays) {
					if (options.startDate instanceof Date) {
						if (widget.startDate instanceof Date) {
							if (options.startDate !== widget.startDate) {
								widget.startDate = options.startDate;
							}
						}
						else {
							var CommonUtils: Utils.Common = new Utils.Common();
							var widgetStartDate: Date = CommonUtils.parseDate(widget.startDate, widget.format);

							if (widgetStartDate !== options.startDate) {
								widget.startDate = options.startDate;
							}
						}
					}
				}

				widget.update(value);
			}
			/** To setting the date **/
		}
	};

	/**
	* Handlers to show, progress bar/block UI in the content of a particular element.
	*/
	knockout.bindingHandlers.showContentProgress_old = {
		update: function (element, valueAccessor, allBindingsAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor()),
				defaults: IContentProgressOption = {
					bgColor: 'rgba(234,234,234,0.8)',
					fadeInDuration: 300,
					/*opacity: 0.6,*/
					classOveride: false,
					zindex: 99,
					childId: '',
					showProgressBar: false,
					overlayClass: 'ajax_overlay',
					showTextInLoader: true,
					//loaderText: 'One Moment Please...'
					loaderText: ''
				},
				contentProgressOptions: IContentProgressOption = typeof allBindingsAccessor().contentProgressOptions === 'object' && allBindingsAccessor().contentProgressOptions,
				/* Merge the contents of two or more objects together into the first object. */
				options: IContentProgressOption = jQuery.extend({}, defaults, contentProgressOptions),
				hasChildId: boolean = (options.childId && options.childId.length) ? true : false,
				container = hasChildId ? $(element).children('#' + options.childId) : $(element);
			if (!container.length) {
				throw new Error('Invalid childId defined for showContentProgress binding!');
			}
			if (value) {
				var ajaxOverlay = container.children(".ajax_overlay");
				if (!ajaxOverlay.length) {
					var overlay = $('<div></div>').css({
						'background-color': options.bgColor,
						'opacity': options.opacity,
						'width': container.width() ? container.width().toString() : '100%',
						'height': container.height() ? container.height().toString() : '100%',
						'position': 'absolute',
						'bottom': '0px',
						'left': '0px',
						'right': '0px',
						'top': '0px',
						'z-index': options.zindex,
						'border-top-left-radius': container.css('border-top-left-radius'),
						'border-top-right-radius': container.css('border-top-right-radius'),
						'border-bottom-left-radius': container.css('border-bottom-left-radius'),
						'border-bottom-right-radius': container.css('border-bottom-right-radius'),
						'padding-left': container.css('padding-left'),
						'padding-right': container.css('padding-right'),
						'padding-top': container.css('padding-top'),
						'padding-bottom': container.css('padding-bottom')
					}).addClass('ajax_overlay').attr('id', hasChildId ? (options.childId + '-ajax_overlay') : '');
					if (options.showProgressBar) {
						if (options.showTextInLoader) {
							overlay.append($('<div></div>').html(options.loaderText).addClass('ajax_textloader'));
						}
						overlay.append($('<div></div>').addClass('ajax_loader')).fadeIn(options.fadeInDuration);
					}

					// this is to get the original value of CSS position property.
					if (!valueAccessor().containersOriginalPosition) {
						valueAccessor().containersOriginalPosition = container.css('position');
					}

					container.css("position", "relative");
					container.append(overlay);
				}
			}
			else {
				var ajaxOverlay = container.children(hasChildId ? '#' + (options.childId + '-ajax_overlay') : '.ajax_overlay');
				if (ajaxOverlay.length) {
					ajaxOverlay.remove();
					// this is to set the original value of CSS position property.
					if (valueAccessor().containersOriginalPosition) {
						container.css("position", valueAccessor().containersOriginalPosition === "static" ? "" : valueAccessor().containersOriginalPosition);
					}
				}
			}
		}
	};

	/**
	* Handlers to show, progress bar/block UI in the content of a particular element.
	*/
	knockout.bindingHandlers.showContentProgress = {
		update: function (element, valueAccessor, allBindingsAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor()),
				defaults: IContentProgressOption = {
					fadeInDuration: 300,
					classOveride: true,
					zindex: 99,
					childId: '',
					showProgressBar: false,
					bgColor: 'rgba(234,234,234,0.8)',
					showTextInLoader: false,
					loaderText: 'One Moment Please...',
					alternatespinClass: 'loaderErrorImage',
					showErrorImage: false,
					spinneroptions: {
						lines: 15, // The number of lines to draw
						length: 16, // The length of each line
						width: 6, // The line thickness
						radius: 15, // The radius of the inner circle
						corners: 1, // Corner roundness (0..1)
						rotate: 0, // The rotation offset
						direction: 1, // 1: clockwise, -1: counterclockwise
						color: '#000', // #rgb or #rrggbb or array of colors
						speed: 1, // Rounds per second
						trail: 60, // Afterglow percentage
						shadow: false, // Whether to render a shadow
						hwaccel: false, // Whether to use hardware acceleration
						className: 'spin', // The CSS class to assign to the spinner
						zIndex: 2e9, // The z-index (defaults to 2000000000)
						top: '50%', // Top position relative to parent
						left: '50%' // Left position relative to parent
					}
				},
				contentProgressOptions: IContentProgressOption = typeof allBindingsAccessor().contentProgressOptions === 'object' && allBindingsAccessor().contentProgressOptions,
				/* Merge the contents of two or more objects together into the first object. */
				options: IContentProgressOption = jQuery.extend({}, defaults, contentProgressOptions),
				hasChildId: boolean = (options.childId && options.childId.length) ? true : false,
				container = hasChildId ? $(element).children('#' + options.childId) : $(element);
			if (!container.length) {
				throw new Error('Invalid childId defined for showProgress binding!');
			}
			if (value) {
				var ajaxOverlay = container.children(".ajax_overlay");
				if (!ajaxOverlay.length) {
					var overlay = $('<div></div>').css({
						'background-color': options.bgColor,
						'opacity': options.opacity,
						'width': container.css('width').search("%") == -1 && container.width() ? container.width().toString() : '100%', // check if container dimension is specified in percentage,then width should be set as 100%
						'height': contentProgressOptions.height ? contentProgressOptions.height : (container.css('height').search("%") == -1 && container.height() ? container.height().toString() : '100%'),//or else dimension specified as percentage gets set as pixel.
						'position': 'absolute',
						'bottom': '0px',
						'left': '0px',
						'right': '0px',
						'top': '0px',
						'z-index': options.zindex,
						'border-top-left-radius': container.css('border-top-left-radius'),
						'border-top-right-radius': container.css('border-top-right-radius'),
						'border-bottom-left-radius': container.css('border-bottom-left-radius'),
						'border-bottom-right-radius': container.css('border-bottom-right-radius'),
						'padding-left': container.css('padding-left'),
						'padding-right': container.css('padding-right'),
						'padding-top': container.css('padding-top'),
						'padding-bottom': container.css('padding-bottom')
					}).addClass('ajax_overlay').attr('id', hasChildId ? (options.childId + '-ajax_overlay') : 'ajax_overlay');
					if (options.showProgressBar) {
						if (options.showTextInLoader) {
							overlay.append($('<div></div>').html(options.loaderText).addClass('ajax_textloader'));
						}
						//overlay.append($('<div></div>').addClass('ajax_loader')).fadeIn(options.fadeInDuration);
					}

					// this is to get the original value of CSS position property.
					if (ko.isObservable(valueAccessor())) {
						if (!valueAccessor().containersOriginalPosition) {
							valueAccessor().containersOriginalPosition = container.css('position');
						}
					}
					else {
						if (!valueAccessor['containersOriginalPosition']) {
							valueAccessor['containersOriginalPosition'] = container.css('position');
						}
					}

					container.css("position", "relative");
					container.append(overlay);
					overlay.find('#errorLoaderImage').remove();

					if (ko.isObservable(valueAccessor())) {
						if (valueAccessor().spinner) {
							valueAccessor().spinner.spin(overlay.get(0));
						}
						else {
							valueAccessor().spinner = new PageSpinner(options.spinneroptions).spin(overlay.get(0));
						}
					}
					else {
						if (valueAccessor['spinner']) {
							valueAccessor['spinner'].spin(overlay.get(0));
						}
						else {
							valueAccessor['spinner'] = new PageSpinner(options.spinneroptions).spin(overlay.get(0));
						}
					}
				}

				ajaxOverlay = container.children(".ajax_overlay");
				if (options.showErrorImage) {
					$(ajaxOverlay.get(0)).append($('<div id="errorLoaderImage"></div>').addClass(options.alternatespinClass)).fadeIn(options.fadeInDuration);
					if (ko.isObservable(valueAccessor())) {
						if (valueAccessor().spinner) {
							valueAccessor().spinner.stop();
						}
					}
					else {
						if (valueAccessor['spinner']) {
							valueAccessor['spinner'].stop();
						}
					}
				}
			}
			else {
				var ajaxOverlay = container.children(hasChildId ? '#' + (options.childId + '-ajax_overlay') : '.ajax_overlay');
				if (ajaxOverlay.length) {
					ajaxOverlay.remove();

					if (ko.isObservable(valueAccessor())) {
						if (valueAccessor().spinner) {
							valueAccessor().spinner.stop();
						}
						// this is to set the original value of CSS position property.
						if (valueAccessor().containersOriginalPosition) {
							container.css("position", valueAccessor().containersOriginalPosition === "static" ? "" : valueAccessor().containersOriginalPosition);
						}
					}
					else {
						if (valueAccessor['spinner']) {
							valueAccessor['spinner'].stop();
						}
						// this is to set the original value of CSS position property.
						if (valueAccessor['containersOriginalPosition']) {
							container.css("position", valueAccessor['containersOriginalPosition'] === "static" ? "" : valueAccessor['containersOriginalPosition']);
						}
					}
				}
			}
		}
	};

	/**
	* Handlers to set access rule visibility for a element.
	*/
	knockout.bindingHandlers.accessRule = {
		init: function (element, valueAccessor, allBindingsAccessor) {
			var value: Array<ILogicalResourceAccessRule> = ko.utils.unwrapObservable(valueAccessor());
			var accessRuleOptions: IAccessRuleOptions = (typeof allBindingsAccessor().accessRuleOption === 'object' && allBindingsAccessor().accessRuleOption);
			var options: IAccessRuleOptions = jQuery.extend({}, accessRuleOptions);
			if (!options) {
				throw new Error('accessRuleOptions is not defined for accessRule binding!');
			}
			if (!options.ResourceName) {
				throw new Error('ResourceName is not defined for accessRule binding!');
			}
			if (!options.RequiredPermission) {
				throw new Error('RequiredPermission is not defined for accessRule binding!');
			}
			/*if (!options.AccessType) {
				throw new Error('accessType is not defined for accessRule binding!');
			}*/
			var accessType: string = options.AccessType || 'disable';
			if (!(accessType === 'hide' || accessType === 'disable')) {
				throw new Error('Wrong AccessType is defined for accessRule binding!');
			}

			if (value instanceof Array && value && value.length) {
				var rule: ILogicalResourceAccessRule = ko.utils.arrayFirst(value, function (item: ILogicalResourceAccessRule) {
					return (item.ResourceName === options.ResourceName && item.RequiredPermission === options.RequiredPermission);
				});

				if (!rule) {
					/*
					-5	Delegate
					-4	Delete
					-3	Update
					*/
					/*switch (rule.RequiredPermission) {
						case (-1):// -1 Create
							// Utils.applyAccessType(element, accessType);
							break;
						case (-2):// -2 Read
							// Utils.applyAccessType(element, accessType);
							break;
						default:
							Utils.applyAccessType(element, accessType);
							break;
					}*/

					Utils.applyAccessType(element, accessType);
				}
			}
		}
	};

	knockout.bindingHandlers.daterangepicker = {
		init: function (element, valueAccessor, allBindingsAccessor) {
			var value: RangeStatic = ko.utils.unwrapObservable(valueAccessor());
			var options: DaterangepickerOptions = allBindingsAccessor().daterangepickerOptions || {
				separator: ' - ',
				showRangeInputsInCalendar: true,
				usRangeByEnum: true,
				format: 'MMM D, YYYY'
			};
			var calback = function (start, end) {
				$(element).find(".daterange").html(start.format(options.format || 'MMM D, YYYY') + options.separator + end.format(options.format || 'MMM D, YYYY'));
				if (options.calback && typeof options.calback === 'function') {
					options.calback(arguments[0], arguments[1], arguments[2], arguments[3]);
				}
			};
			$(element).daterangepicker(options, calback);

			/* handle disposal (if KO removes by the template binding) */
			ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
				$(element).daterangepicker("destroy");
			});

			/* when a user changes the date, update the view model */
			ko.utils.registerEventHandler(element, "changeDateRange", function (event: JQueryDateRangePickerEventObject) {
				var bindvalue = valueAccessor();
				if (ko.isObservable(bindvalue)) {
					var range: RangeStatic = {
						startDate: event.startDate,
						endDate: event.endDate,
						rangetypeId: event.rangetypeId,
						rangetypeName: event.rangetypeName
					}
					bindvalue(range);
				}
			});

			if (value && value.startDate && value.endDate) {
				$(element).find(".daterange").html(value.startDate.format(options.format || 'MMM D, YYYY') + options.separator + value.endDate.format(options.format || 'MMM D, YYYY'));
			}
			else
				if (options.startDate && options.endDate) {
					$(element).find(".daterange").html(options.startDate.format(options.format || 'MMM D, YYYY') + options.separator + options.endDate.format(options.format || 'MMM D, YYYY'));
				}
				else {
					$(element).find(".daterange").html((options.format || 'MMM D, YYYY') + options.separator + (options.format || 'MMM D, YYYY'));
				}
		},
		update: function (element, valueAccessor, allBindingsAccessor) {
			/** To setting the date **/
			var widget = $(element).data("daterangepicker");
			var value: RangeStatic = ko.utils.unwrapObservable(valueAccessor());
			//when the view model is updated, update the widget
			if (widget && value) {
				if (value.startDate === widget.startDate && value.endDate === widget.endDate) {
					return;
				}

				if (value.startDate.isSame(widget.startDate) && value.endDate.isSame(widget.endDate)) {
					return;
				}

				widget.startDate = value.startDate;
				widget.endDate = value.endDate;
				widget.updateCalendersAndView();
			}
			/** To setting the date **/
		}
	};

	knockout.bindingHandlers.disableAllElements = {
		update: function (element, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			if (value && element.disabled) {
				element.removeAttribute("disabled");
				$(element).each(function () {
					var currentElement = this;
					/* Setting applied to a particular element or control */
					$(currentElement).attr('disabled', false);
					/* Setting applied to inner controls of a particular element */
					$(currentElement).find('*').filter(function (i, el) {
						if ($(this).data('bind')) {
							if ((<string>$(this).data('bind')).indexOf('enable:') === -1) {
								$(this).attr('disabled', false);
							}
						}
						else {
							$(this).attr('disabled', false);
						}
					});

					//$(currentElement).find('*').attr('disabled', false);
				});
			}
			else if ((!value) && (!element.disabled)) {
				element.disabled = true;
				$(element).each(function () {
					var currentElement = this;
					/* Setting applied to a particular element or control */
					$(currentElement).attr('disabled', true);
					/* Setting applied to inner controls of a particular element */
					$(currentElement).find('*').filter(function (i, el) {
						if ($(this).data('bind')) {
							if ((<string>$(this).data('bind')).indexOf('enable:') === -1) {
								$(this).attr('disabled', true);
							}
						}
						else {
							$(this).attr('disabled', true);
						}
					});

					//$(currentElement).find('*').attr('disabled', true);
				});
			}
		}
	};

	//change the view address text field as read only

	knockout.bindingHandlers.readonlyAllElements = {
		update: function (element, valueAccessor) {
			var value = ko.utils.unwrapObservable(valueAccessor());
			if (value && element.readonly) {
				element.removeAttribute("readonly");
				$(element).each(function () {
					var currentElement = this;
					/* Setting applied to a particular element or control */
					$(currentElement).attr('readonly', false);
					/* Setting applied to inner controls of a particular element */
					$(currentElement).find('*').filter(function (i, el) {
						if ($(this).data('bind')) {
							if ((<string>$(this).data('bind')).indexOf('enable:') === -1) {
								$(this).attr('readonly', false);
							}
						}
						else {
							$(this).attr('readonly', false);
						}
					});

					//$(currentElement).find('*').attr('readonly', false);
				});
			}
			else if ((!value) && (!element.readonly)) {
				element.readonly = true;
				$(element).each(function () {
					var currentElement = this;
					/* Setting applied to a particular element or control */
					$(currentElement).attr('readonly', true);
					/* Setting applied to inner controls of a particular element */
					$(currentElement).find('*').filter(function (i, el) {
						if ($(this).data('bind')) {
							if ((<string>$(this).data('bind')).indexOf('enable:') === -1) {
								$(this).attr('readonly', true);
							}
						}
						else {
							$(this).attr('readonly', true);
						}
					});

					//$(currentElement).find('*').attr('readonly', true);
				});
			}
		}
	};

	// Handler for rendering the fusion charts dynamically
	ko.bindingHandlers.createFusionChart = {
		update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
			var value: IChartOptions = ko.utils.unwrapObservable(valueAccessor());
			var allbinds = allBindings();
			if (value) {
				var renderDiv = '';
				if ($(element).attr('ID') != undefined && $(element).attr('ID') != '') {
					renderDiv = $(element).attr('ID').toString(); //Assignment of Div ID where the chart shall be rendered.
				}
				else {
					var fusionChartDivs = $('[ID^=FusionChartsWidget]');
					var divId = fusionChartDivs.length + 1;
					if (fusionChartDivs.length) {
						var max = 0;
						$.each(fusionChartDivs, (index: number, element: HTMLElement) => {
							var id = parseInt(element.id.replace('FusionChartsWidget', ''));
							if (id > max) {
								max = id;
							}
						});
						divId = (max + 1);
					}
					$(element).attr('ID', 'FusionChartsWidget' + divId);
					renderDiv = $(element).attr('ID');
					value.chartName = 'chartsWidgetName' + value.chartName + divId;
				}
				var dynamicChart = new FusionCharts(value.chartType, value.chartName, value.chartWidth, value.chartHeight);

				if (value.setTransparency == undefined || value.setTransparency)
					dynamicChart.setTransparent(true);
				else
					dynamicChart.setTransparent(false);

				if (value.isXML) {  //Check to assign xml data for fusion chart or not.
					dynamicChart.setXMLData(value.chartData);
				}
				else {
					dynamicChart.setJSONData(value.chartData);
				}
				dynamicChart.render(renderDiv);
				// portion to hide the content progress indicator
				if (allbinds && allbinds.showContentProgress) {
					if (ko.unwrap(allbinds.showContentProgress)) {
						allbinds.showContentProgress(false);
					}
				}
			}
		}
	};

	/**
	* Extender method for tracking/detecting change to Knockout object.
	* @param {any} target as knockout object.
	* @param {boolean} track tracking values setup in ko object.
	*/
	knockout.extenders.trackChange = function (target, track) {
		if (track) {
			target.trackChange = true;
			if (target.isDirty) {
				target.isDirty(false);
			}
			else {
				target.isDirty = ko.observable(false);
			}

			if (target.hasValueChanged) {
				target.hasValueChanged(false);
			}
			else {
				target.hasValueChanged = ko.observable(false);
			}

			if (target() instanceof Array) {
				target.originalValue = Utils.Common.prototype.deepCopy(target());
			}
			else {
				target.originalValue = target();
			}

			target.subscribe(function (newValue) {
				target.isDirty(!(newValue >= target.originalValue && newValue <= target.originalValue));

				if (target.isDirty()) {
					//target.isDirty(!(newValue === "" && (target.originalValue === undefined || target.originalValue === null)));
					target.isDirty(!((newValue === undefined || newValue === null || newValue === "") && (newValue === target.originalValue)));
				}

				if (target() instanceof Array || newValue instanceof Array) {
					target.isDirty(!target.originalValue.equals(newValue));
					target.isDirty.valueHasMutated();
				}

				if (!target.hasValueChanged() && target.isDirty()) {
					target.hasValueChanged(true);
					target.hasValueChanged.valueHasMutated()
				}
			});
		}
		return target;
	};

	knockout.bindingHandlers.slideDialog = {
		init: function (element, valueAccessor) {
			var value = valueAccessor();
			if (ko.utils.unwrapObservable(value)) {
				//$(element).animate({ top: 100 }, "fast").css("display", "block");
				var body = $('body');
				var blockout = $('<div class="modalBlockout"></div>')
					.css({ 'z-index': '1051', 'opacity': '0.1', 'background': 'white', 'background-position': 'initial initial', 'background-repeat': 'initial initial' })
					.appendTo(body);
				var host = $('<div class="modalHost"></div>')
					.css({ 'z-index': '1052', 'opacity': '1.0' })
					.appendTo(body).appendTo(host);;

				$(element).css("display", "block").modal({ modal: true, escClose: false, overlayClose: true, backdrop: false, keyboard: false });
			}
			else {
				$(element).css("display", "none").modal({ modal: false, escClose: false, overlayClose: true, backdrop: false });
			}
		},
		update: function (element, valueAccessor) {
			var value = valueAccessor();
			if (ko.utils.unwrapObservable(value)) {
				//$(element).animate({ top: 100 }, 600).css("display", "block");
				var body = $('body');
				var blockout = $('<div class="modalBlockout"></div>')
					.css({ 'z-index': '1051', 'opacity': '0.1', 'background': 'white', 'background-position': 'initial initial', 'background-repeat': 'initial initial' })
					.appendTo(body);
				var host = $('<div class="modalHost"></div>')
					.css({ 'z-index': '1052', 'opacity': '1.0' })
					.appendTo(body).appendTo(host);;
				$(element).css("display", "block").modal({ modal: true, escClose: false, overlayClose: true, backdrop: false, keyboard: false });
			}
			else {
				//$(element).animate({ top: -185 }, 600).css("display", "none");
				$(".modalBlockout").remove();
				$('.modalHost').remove();
				$(element).css("display", "none").modal({ modal: false, escClose: false, overlayClose: true, backdrop: false });
			}
		}
	};

	knockout.bindingHandlers.drag = {
		init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
			var dragElement = $(element);
			var dragOptions = {
				helper: 'clone',
				revert: true,
				revertDuration: 0,
				start: function () {
					if (allBindingsAccessor().dragged) {
						if (ko.isObservable(allBindingsAccessor().dragged)) {
							allBindingsAccessor().dragged(ko.unwrap(valueAccessor()));
						}
						else {
							allBindingsAccessor().dragged = ko.unwrap(valueAccessor());
						}
					}
				},
				stop: function () {
					if (allBindingsAccessor().dragged) {
						if (ko.isObservable(allBindingsAccessor().dragged)) {
							allBindingsAccessor().dragged(undefined);
						}
						else {
							allBindingsAccessor().dragged = undefined;
						}
					}
				},
				cursor: 'default'
			};
			dragElement.draggable(dragOptions).disableSelection();
		}
	};

	knockout.bindingHandlers.drop = {
		init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
			var dropElement = $(element);
			var dropOptions = {
				drop: function (event, ui) {
					valueAccessor().value(ko.unwrap(viewModel.draggedValue));
				}
			};
			dropElement.droppable(dropOptions);
		}
	};

	knockout.bindingHandlers.radioCheck = {
		init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
			//initialize checked value of element
			element.checked = ko.unwrap(valueAccessor());
			var radioCheckOptions = allBindingsAccessor().radioCheckOptions,
				bindingcontext = radioCheckOptions.bindingcontext,
				valuekey = radioCheckOptions.valuekey;

			//attach event to handle changes
			$(element).change(function (e) {
				var item = ko.dataFor(element);
				var items = ko.unwrap(bindingcontext);
				if (items) {
					for (var i = 0; i < items.length; i++) {
						//set selected() for all items
						//true for the checked element, false for the rest
						if (valuekey) {
							if (typeof items[i][valuekey] === 'function') {
								items[i][valuekey](items[i] == item);
							} else if (items[i][valuekey]) {
								items[i][valuekey] = (items[i] == item);
							}
						}
					}
				}
			});
		}
	};

	/**
	* Handlers to set input box as numeric decimal input.
	*/
	knockout.bindingHandlers.numericDecimalInput = {
		init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var input = {
				allowdecimal: ko.observable(false),
				precision: 2,
				maxlength: 0,
				autodigit: ko.observable(false)
			}, numericInput = jQuery.extend(input, ko.unwrap(valueAccessor()));

			if (ko.unwrap(numericInput.allowdecimal) === false)
				return;

			var updateValue = function () {
				var val = '', value = element.value;

				if (val === (val = $(element).val()))
					return;

				var formattedValue = null;
				if (value === undefined || value === null || value === '' || isNaN(Number(value))) {
					return;
				}

				// if auto digit is required after some digits
				if (ko.unwrap(numericInput.autodigit) === true) {
					if (value.length === 11 && value.indexOf('.') === -1) {
						var split1 = value.substring(0, 8);
						var split2 = value.substring(8, 10);
						formattedValue = split1+'.'+ split2;
					}
					else {
						formattedValue = Number(value).toFixed(numericInput.precision);
					}
				}
				else {
					formattedValue = Number(value).toFixed(numericInput.precision);
				}

				if ($(element).is("input") === true) {
					$(element).val(formattedValue);
				} else {
					$(element).text(formattedValue);
				}
			};

			ko.utils.registerEventHandler(element, 'change', updateValue);
		},
		update: function (element, valueAccessor) {
			var nInput = {
				allowdecimal: ko.observable(false),
				precision: 2,
				maxlength: 0,
				autodigit: ko.observable(false)
			}, value = jQuery.extend(nInput, ko.unwrap(valueAccessor())), isNumeric = function (charCode, key, allowdecimal) {
					var searchSpecial = '$Backspace$Del$Home$Tab$Left$Right$Up$Down$End$';
					if ((searchSpecial.indexOf('$' + key + '$') < 0) || Utils.Common.prototype.isBrowserIsFirefox() === false) {
						if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
							if (allowdecimal === true) {
								if (charCode === 46 || charCode === 45) {
									return true;
								} else {
									return false;
								}
							} else {
								return false;
							}
						}
					}
					return true;
				};

			$(element).keypress(function (e) {
				var charCode = (e.which) ? e.which : e.keyCode, key = e.key;

				var searchSpecial = '$Del$';

				if (Utils.Common.prototype.isBrowserIsFirefox() === true && ((searchSpecial.indexOf('$' + key + '$') == 0))) {
					return true;
				}

                if (e.ctrlKey && (charCode == 67 || charCode == 99))
                {
                	return true;
                }

				if (!isNumeric(charCode, key, value.allowdecimal())) {
					return false;
				}

				//if delete and dot already exists
				if ((charCode === 46) && (element.value.indexOf('.') >= 0)) {
					return false;
				}

				// if 'MINUS' and not typing 'MINUS' at 0 index and already exists MINUS at 0 index.
				if ((charCode === 45) && (element.value.indexOf('-') >= -1) && element.value.length > 0) {
					return false;
				}

				return true;
			});

			$(element).keyup(function (e) {
				var charCode = (e.which) ? e.which : e.keyCode, key = e.key;
				if (value.allowdecimal()) {
					var text = element.value;
					if (text.indexOf('.') > -1) {
						var splittext = text.split('.');
						if (splittext[1].length > value.precision) {
							var end = (splittext[1].length > value.precision) ? value.precision : splittext[1].length;
							element.value = splittext[0] + '.' + (splittext[1].substring(0, end));
						}
					}

					// item cost fields
					if (value.autodigit() && value.maxlength === 11) {
						if (text.length === 8 && text.indexOf('.') === -1 && charCode !== 8)
							element.value = element.value + '.';
					}
				}
				return true;
			});

			// if user enters dot(.) at end of number then it adds .00
			$(element).blur(function (e) {
				var text = element.value;
				if (text.indexOf('.') > -1) {
					var splittext = text.split('.');
					if (splittext[1].length === 0) {
						element.value = splittext[0] + '0.00';
					}
				}
				else if (text === undefined || text === null || value === '' || isNaN(Number(value))) {
					element.value = element.value + '0.00';
				}
				else {
					element.value = element.value + '.00';
				}
			});
		}
	};

	/**
	* Handlers to set input box as percentage fields.
	*/
	knockout.bindingHandlers.percentageInput = {
		init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
			var input = {
				allowdecimal: ko.observable(false),
				precision: 2,
				maxlength: 0
			}, numericInput = jQuery.extend(input, ko.unwrap(valueAccessor()));

			if (ko.unwrap(numericInput.allowdecimal) === false)
				return;

			var updateValue = function () {
				var val = '', value = element.value;

				if (val === (val = $(element).val()))
					return;

				var formattedValue = null;
				if (value === undefined || value === null || value === '' || isNaN(Number(value))) {
					return;
				}

				formattedValue = Number(value);

				if ($(element).is("input") === true) {
					$(element).val(formattedValue);
				} else {
					$(element).text(formattedValue);
				}
			};

			ko.utils.registerEventHandler(element, 'change', updateValue);
		},
		update: function (element, valueAccessor) {
			var nInput = {
				allowdecimal: ko.observable(false),
				precision: 2,
				maxlength: 0,
				autodigit: ko.observable(false)
			}, value = jQuery.extend(nInput, ko.unwrap(valueAccessor())), isNumeric = function (charCode, key, allowdecimal) {
					var searchSpecial = '$Backspace$Del$Home$Tab$Left$Right$Up$Down$End$';
					if ((searchSpecial.indexOf('$' + key + '$') < 0) || Utils.Common.prototype.isBrowserIsFirefox() === false) {
						if ((charCode > 31 && (charCode < 48 || charCode > 57))) {
							if (allowdecimal === true) {
								if (charCode === 46) {
									return true;
								} else {
									return false;
								}
							} else {
								return false;
							}
						}
					}
					return true;
				};

			$(element).keypress(function (e) {
				var charCode = (e.which) ? e.which : e.keyCode, key = e.key;

				var searchSpecial = '$Del$';

				if (Utils.Common.prototype.isBrowserIsFirefox() === true && ((searchSpecial.indexOf('$' + key + '$') == 0))) {
					return true;
				}

				if (!isNumeric(charCode, key, value.allowdecimal())) {
					return false;
				}

				//if delete and dot already exists
				if ((charCode === 46) && (element.value.indexOf('.') >= 0)) {
					return false;
				}
				return true;
			});

			$(element).keyup(function (e) {
				var charCode = (e.which) ? e.which : e.keyCode, key = e.key;
				if (value.allowdecimal()) {
					var text = element.value;
					if (text.indexOf('.') > -1) {
						var splittext = text.split('.');
						if (splittext[0] === "100") {
							element.value = element.value.substring(0, element.value.length - 1);
						}
						if (splittext[1].length > value.precision) {
							var end = (splittext[1].length > value.precision) ? value.precision : splittext[1].length;
							element.value = splittext[0] + '.' + (splittext[1].substring(0, end));
						}
					}
					else {
						if (parseInt(element.value) > 100) {
							element.value = element.value.substring(0, element.value.length-1);
						}
					}
				}
				return true;
			});
		}
	};

	knockout.bindingHandlers.donotBindThis = {
		init: function () {
			return { controlsDescendantBindings: true };
		}
	};

	knockout.bindingHandlers.jQTimepicker = {
		init: function (element, valueAccessor, allBindingsAccessor) {
			var options: jQTimepickerOptions = allBindingsAccessor().jQTimepickerOptions || {};

			//initialize time picker with some optional options
			$(element).jQTimepicker(options);

			//when a user changes the time, update the same to view model object/valueAccessor
			ko.utils.registerEventHandler(element, "changeTime.jQTimepicker", function (event: jQTimepickerChangeTimeEvent) {
				var value = valueAccessor();
				if (ko.isObservable(value)) {
					value(event.time);
				}
			});

			//when a user changes the time with wrong format then this event will trigger
			ko.utils.registerEventHandler(element, "timeFormatError.jQTimepicker", function (event) {
				$(element).jQTimepicker('setTime', '');
			});

			//when a user changes the time with wrong/invalid time rage then this event will trigger
			ko.utils.registerEventHandler(element, "timeRangeError.jQTimepicker", function (event) {
				$(element).jQTimepicker('setTime', '');
			});

			//handle disposal (if KO removes by the template binding)
			ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
				$(element).jQTimepicker("remove");
			});

			// This attaches this binding to the knockout validation
			ko.bindingHandlers["validationCore"].init(element, valueAccessor, allBindingsAccessor, arguments[3], arguments[4]);
		},
		update: function (element, valueAccessor, allBindingsAccessor) {
			// Update the time picker with the new binding value
			var value: string = ko.utils.unwrapObservable(valueAccessor()),
				options: jQTimepickerOptions = allBindingsAccessor().jQTimepickerOptions || {},
				widgetData: jQTimepickerData = <jQTimepickerData>$(element).data(),
				isTimeUpdatedInUi = (<jQTimepickerData>$(element).val() && <jQTimepickerData>$(element).val().length) ? true : false;

			// if ui value in time picker is not same as selected/updated value then update the same to timepicker object
			if (<jQTimepickerData>$(element).val() !== value) {
				if (!value || value === '00:00:00') {
					$(element).jQTimepicker('setTime', '');
					return;
				}

				// if options are modified then initiate the time picker with the new options.
				if (!(<Object>options).equals(<Object>widgetData.timepickerOptions)) {
					$(element).jQTimepicker('option', options);
				}

				if (isTimeUpdatedInUi) {
					$(element).jQTimepicker("setTime", value);
				} else {
					$(element).jQTimepicker("formatAndSetTime", value);
				}
			}
		}
	};

	ko.bindingHandlers.numeric = {
		init: function (element, valueAccessor) {
			$(element).on('keydown', function (event) {
				// Allow: backspace, delete, tab, escape, and enter
				if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
					// Allow: Ctrl combinations
					(event.ctrlKey === true) ||
					//Allow decimal symbol (.)
					(event.keyCode === 190) ||
					// Allow: home, end, left, right
					(event.keyCode >= 35 && event.keyCode <= 39)) {
					// let it happen, don't do anything
					return;
				}
				else {
					// Ensure that it is a number and stop the keypress
					if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
						event.preventDefault();
					}
				}
			});
		},
		update: function (element, valueAccessor) {
		}
	};

	knockout.observableArray.fn.refresh = function () {
		var data = this();
		this([]);
		this(data);
	};
} (ko);
/* Registers the knockout bindings functions in knockout object */
/* ====================================== */

/* ====================================== */
/* Adding functions into ko grid sortService object */
!function (thatkg: any) {
	"use strict";
	if (thatkg) {
		var kgsortService = thatkg.sortService;

		/**
		* Constants to for KO Grid binding item.
		*/
		var ITEMTYPE = {
			NONE: undefined,
			NUMERIC: 'Numeric',
			BOOLEAN: 'Boolean',
			DATE: 'Date',
			OBJECT: 'Object',
			ALPHANUMERIC: 'AlphaNumeric'
		};

		/**
		* Constant for sort direction Ascending
		*/
		var ASC = "asc",
			/**
			* Constant for sort direction Descending
			*/
			DESC = "desc";

		kgsortService.guessSortFieldType = function (item) {
			var sortFieldType, // sort field type is guessed
				itemType; // the type of item

			if (item === undefined || item === null || item === '') {
				return null;
			}
			itemType = typeof (item);
			//check for numbers and Booleans
			switch (itemType) {
				case "number":
					sortFieldType = ITEMTYPE.NUMERIC;
					break;
				case "boolean":
					sortFieldType = ITEMTYPE.BOOLEAN;
					break;
				default:
					sortFieldType = ITEMTYPE.NONE;
					break;
			}
			//if we found one, return it
			if (sortFieldType) {
				return sortFieldType;
			}
			//check if the item is a valid Date
			if (Object.prototype.toString.call(item) === '[object Date]') {
				return ITEMTYPE.DATE;
			}
			// if we aren't left with a string, return a basic sorting function...
			if (itemType !== "string") {
				return ITEMTYPE.OBJECT;
			}
			// now lets string check..
			//check if the item data is a valid number
			if (item.match(/^-{0,1}\d*\.{0,1}\d+$/)) {
				return ITEMTYPE.NUMERIC;
			}
			// check for a date: dd/mm/yyyy or dd/mm/yy
			// can have / or . or - as separator
			// can be mm/dd as well
			if (item.match(window.kg.sortService.dateRE)) {
				return ITEMTYPE.DATE;
			}
			//finally just sort the normal string...
			return ITEMTYPE.ALPHANUMERIC;
		};

		kgsortService.getSortItemType = function (sortField, data) {
			var unwrappedData = ko.utils.unwrapObservable(data);
			// first make sure we are even supposed to do work
			if (!unwrappedData || !sortField) {
				return;
			}
			// grab the metadata for the rest of the logic
			var sortFieldType,
				item,
				sortDir = DESC;
			item = ko.utils.arrayFirst(unwrappedData, (i) => {
				return (i[sortField] && i[sortField].length > 0);
			});
			if (!item) {
				return;
			}
			sortFieldType = kgsortService.guessSortFieldType(item[sortField]);
			switch (sortFieldType) {
				case ITEMTYPE.ALPHANUMERIC:
				case ITEMTYPE.OBJECT:
					sortDir = ASC;
					break;
				case ITEMTYPE.BOOLEAN:
				case ITEMTYPE.DATE:
				case ITEMTYPE.NUMERIC:
					sortDir = DESC;
					break;
				default:
					sortDir = DESC;
					break;
			}
			return sortDir;
		};
	}
} (window.kg);
/* Adding functions into ko grid sortService object */
/* ====================================== */

/* ====================================== */
/* Added removeAll function in Array object */
!function (a) {
	"use strict";

	a.prototype.removeAll = function (items: Array<any>) {
		var self: Array = this;
		// If you passed zero arguments, we remove everything
		if (items === undefined) {
			while (self.length > 0) {
				self.pop();
			}
			return;
		}
		// If you passed an argument, we interpret it as an array of entries to remove
		if (!items) {
			return;
		}

		return self.remove((element): boolean => {
			var match: number = -1;
			while ((match = items.indexOf(element)) > -1) {
				return true;
			}
			return false;
		});
	};

	a.prototype.remove = function (item: any) {
		var self: Array = this;
		if (typeof item === "function") {
			for (var i = self.length - 1; i >= 0; i--) {
				if (item.apply(null, [self[i]])) {
					self.remove(self[i]);
				}
			}
		}
		else {
			var match = -1;

			while ((match = self.indexOf(item)) > -1) {
				self.splice(match, 1);
			}
		}
	};

	a.prototype.sum = function (arg: (item: any) => number): number {
		var self: Array = this;
		if (typeof arg === 'function') {
			return self.reduce(
				(a: number, b: any) => {
					var val = arg.apply(null, [b]);
					if (typeof val === 'number') {
						return (a + val);
					} else {
						throw new Error('Invalid return type of argument');
					}
				}, 0);
		} else {
			throw new Error('Invalid argument type');
		}
	};

	a.prototype.arrayIndexOf = function (predicate: (object: any) => boolean): number {
		var array: Array = this;
		if (!predicate || typeof (predicate) != 'function') {
			return -1;
		}

		if (!array || !array.length || array.length < 1) {
			return -1;
		}

		for (var i = 0; i < array.length; i++) {
			if (predicate(array[i])) return i;
		}

		return -1;
	};

	a.prototype.arrayIndexOfValue = function (searchForValue: any, predicate: (object: any, valueToCompare: any) => boolean): number {
		var array: Array = this;
		if (!predicate || typeof (predicate) != 'function') {
			return -1;
		}

		if (!array || !array.length || array.length < 1) {
			return -1;
		}

		for (var i = 0; i < array.length; i++) {
			if (predicate(array[i], searchForValue)) return i;
		}

		return -1;
	};
} (Array);
/* Added removeAll function in Array object */
/* ====================================== */

/* ====================================== */
/* Added capitalize function in String object */
!function (s) {
	/**
	* Adds a function to the String object to capitalize the string
	* @param {boolean} all: used to capitalize the first character of the string. If all is true it wil convert all the space seprated string to capitalize else it will do capitalize the first character of the string. Default {false}.
	* @return {string} capitalize value.
	*/
	s.prototype.capitalize = function (all?: boolean) {
		var self: string = this;
		if (all) {
			self = self.toLocaleLowerCase();
			return self.split(' ').map(function (e) {
				return e.capitalize();
			}).join(' ');
		} else {
			return self.charAt(0).toUpperCase() + self.slice(1);
		}
	}
} (String);
/* Added removeAll function in Array object */
/* ====================================== */

/* ====================================== */
/* Added equals function in Object.prototype*/
/**
* Adds a function to Object.prototype to compare the objects
* @param {Object} b: used to to compare the object with the current object
* @return {boolean} whether the object is same or not.
*/
if (!Object.prototype.hasOwnProperty('equals')) {
	Object.defineProperty(Object.prototype, "equals", {
		enumerable: false,
		value: function (b: Object): boolean {
			var a: Object = this;
			for (var p in a) {
				if (a.hasOwnProperty(p)) {
					if (typeof b[p] == 'undefined') {
						return false;
					}
					else if (typeof b[p] == 'object' && b[p]) {
						if (!b[p].equals(a[p])) {
							return false;
						}
					}
					else if (b[p] != a[p]) {
						return false;
					}
				}
			}
			for (var p in b) {
				if (b.hasOwnProperty(p)) {
					if (typeof a[p] == 'undefined') {
						return false;
					}
					else if (typeof a[p] == 'object' && a[p]) {
						if (!a[p].equals(b[p])) {
							return false;
						}
					}
					else if (a[p] != b[p]) {
						return false;
					}
				}
			}
			return true;
		}
	});
}
/* Added removeAll function in Array object */
/* ====================================== */

/* ====================================== */
/*     Common Utils Functions     */
module Utils {
	export class Common implements CommonStatic {
		/*     Common Date Functions     */
		parseDateFormat(format: string): any {
			if (!(format)) {
				format = 'mm/dd/yyyy';
			}
			var separator = format.match(/[.\/\-\s].*?/),
				parts = format.split(/\W+/);
			if (!separator || !parts || parts.length === 0) {
				throw new Error("Invalid date format.");
			}
			return { separator: separator, parts: parts };
		}

		parseDate(date: string, format?: any): Date {
			if (!(format) || !(format.separator)) {
				format = this.parseDateFormat(format);
			}
			var parts = date.split(format.separator),
				dateNew: Date = new Date(),
				val;
			dateNew.setHours(0);
			dateNew.setMinutes(0);
			dateNew.setSeconds(0);
			dateNew.setMilliseconds(0);
			if (parts.length === format.parts.length) {
				var year = dateNew.getFullYear(), day = dateNew.getDate(), month = dateNew.getMonth();
				for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
					val = parseInt(parts[i], 10) || 1;
					switch (format.parts[i]) {
						case 'dd':
						case 'd':
							day = val;
							dateNew.setDate(val);
							break;
						case 'mm':
						case 'm':
							month = val - 1;
							dateNew.setMonth(val - 1);
							break;
						case 'yy':
							year = 2000 + val;
							dateNew.setFullYear(2000 + val);
							break;
						case 'yyyy':
							year = val;
							dateNew.setFullYear(val);
							break;
					}
				}
				dateNew = new Date(year, month, day, 0, 0, 0);
			}
			return dateNew;
		}

		convertToDate(date: string): Date {
			var isoRegex = /^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/;
			var match = isoRegex.exec(date);
			if (match) {
				return moment(date).toDate();
			}

			var timestamp = Date.parse(date);

			if (isNaN(timestamp) == false) {
				return new Date(timestamp);
			}
			return null;
		}

		convertToDateString(date: string, format?: string): string {
			var newDate = this.convertToDate(date);

			if (newDate) {
				return this.formatDate(newDate, format);
			}
			return null;
		}
		/*     Common Date Functions     */

		/**
		* To get the value by id in a enum object(added for using in enums)
		* @param {any} obj enum object for referring.
		* @param {string} id to find in the enum object.
		* @returns {string} value of the given input from the enum object.
		*/
		getEnumValueById(obj: any, id: string): string {
			for (var i in obj) {
				if (typeof (obj[i].ID) === 'number') {
					if (obj[i].ID == id) {
						if (obj[i].Value) {
							return obj[i].Value;
						} else {
							return null;
						}
					}
				} else {
					return null;
				}
			}
			return null;
		}

		/**
		* To get the value by key in a enum object(added for using in enums)
		* @param {any} obj enum object for referring.
		* @param {string} key to find in the enum object.
		* @returns {string} value of the given input from the enum object.
		*/
		getEnumValueByKey(obj: any, key: string): string {
			for (var i in obj) {
				if (typeof (obj[i].Key) === 'string') {
					if (obj[i].Key == key) {
						if (obj[i].Value) {
							return obj[i].Value;
						} else {
							return null;
						}
					}
				} else {
					return null;
				}
			}
			return null;
		}

		/**
		* To get the value by key in a enum object(added for using in enums)
		* @param {any} obj enum object for referring.
		* @param {string} key to find in the enum object.
		* @returns {string} value of the given input from the enum object.
		*/
		getEnumIdByValue(obj: any, key: string): string {
			for (var i in obj) {
				if (typeof (obj[i].Value) === 'string') {
					if (obj[i].Value == key) {
						if (obj[i].Value) {
							return obj[i].ID;
						} else {
							return null;
						}
					}
				} else {
					return null;
				}
			}
			return null;
		}

		/**
		* To get the round off value of given value to a specifically decimal places.
		* @param {number} value to get the round off.
		* @param {number} decimals to set the roundoff.
		* @returns {number} round off value for the given input.
		*/
		roundOff(value: number, decimals?: number): number {
			var roundOffDecimals = 2;
			if (typeof (decimals) === 'number') {
				roundOffDecimals = decimals
			}
			return Number(value.toFixed(decimals));
		}

		ConvertTime12Hour(dateTime: string, separator?: string);
		ConvertTime12Hour(dateTime: Date, separator?: string);
		ConvertTime12Hour(dateTime: any, separator?: any): string {
			var dateObj, self = this;;
			if (typeof dateTime === 'string') {
				// checking whether dateformat is ISO or UTC.
				//if (dateTime.indexOf('T'))
				//	dateTime = dateTime.replace(/T/g, " "); // Converting date format from ISO to UTC.

				dateObj = self.convertToDate(dateTime);
			}
			else {
				dateObj = new Date(dateTime);
			}

			if (separator == null || separator == undefined || separator === '')
				separator = ':';

			var meridian = 'AM';

			var hh = dateObj.getHours();
			var mm = dateObj.getMinutes();
			//ss = dateObj.getSeconds();
			if (hh > 12) {
				meridian = 'PM';
				hh %= 12;
			}

			return (hh < 10 ? ('0' + hh.toString()) : hh.toString()) + separator + mm + " " + meridian;
		}

		formatDate(date: Date, format?: string): string;
		formatDate(date: string, format?: string): string;
		formatDate(date: any, format?: any): string {
			var self = this;
			if (typeof date === 'string') {
				date = self.convertToDate(date);
			}
			else {
				date = new Date(date);
			}

			if (!date) {
				return null;
			}

			if (!(format) || !(format.separator)) {
				format = self.parseDateFormat(format);
			}
			var val = {
				d: date.getDate(),
				m: date.getMonth() + 1,
				yy: date.getFullYear().toString().substring(2),
				yyyy: date.getFullYear(),
				dd: date.getDate(),
				mm: date.getMonth() + 1
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			var date = [];
			for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
				date.push(val[format.parts[i]]);
			}
			return date.join(format.separator);
		}

		/*     Deep copying of Objects and Arrays Function     */
		deepCopy<T>(source: T): T;
		deepCopy<any>(source: any): any {
			if (Object.prototype.toString.call(source) === '[object Array]') {
				var out = [], i = 0, len = source.length;
				for (; i < len; i++) {
					out[i] = arguments.callee(source[i]);
				}
				return out;
			}

			if (typeof source === 'object') {
				var newSource: Object = source;
				if (Object.prototype.toString.call(newSource) === '[object Null]') {
					return null;
				} else {
					var objOut = {}, key;
					for (key in newSource) {
						objOut[key] = arguments.callee(newSource[key]);
					}
					return objOut;
				}
			}
			return source;
		}
		/*     Deep copying of Objects and Arrays Function     */

		/**
		* Method to convert to lbs from kg
		* valuetype 0 = kg and 1 = lbs
		* @returns lbs value
		*/
		ConvertToLbs(value: number, valueType: number) {
			var lbsConverterValue = 2.204623;
			return valueType == 0 ? this.roundOff(value * lbsConverterValue) : value;
		}

		/**
		* Method to identify is browser is Microsoft Internet Explorer.
		* @returns {boolean} returns true when the user's browser is Microsoft Internet Explorer it return as false.
		*/
		isBrowserIsIE() {
			return navigator.userAgent.toLowerCase().indexOf('msie') >= 0;
		}

		/**
		* Method to identify is browser is Mozilla Firefox.
		* @returns {boolean} returns true when the user's browser is Mozilla Firefox else it return as false.
		*/
		isBrowserIsFirefox() {
			return navigator.userAgent.toLowerCase().indexOf('firefox') >= 0;
		}

		/**
		* Method to identify is browser is Chrome.
		* @returns {boolean} returns true when the user's browser is Chrome else it return as false.
		*/
		isBrowserIsChrome() {
			return navigator.userAgent.toLowerCase().indexOf('chrome') >= 0;
		}

		/**
		* Method to identify is browser is Apple Safari.
		* @returns {boolean} returns true when the user's browser is Apple Safari else it return as false.
		*/
		isBrowserIsSafari() {
			return (navigator.userAgent.toLowerCase().indexOf("safari") >= 0 && navigator.userAgent.toLowerCase().indexOf("chrome") < 0);
		}

		/**
		* Method to get the user agent.
		* @returns {string} returns agent/client of the user.
		*/
		UserAgent() {
			return navigator.userAgent;
		}

		/**
		* Method to check whether the given date is valid or not.
		* @param {string} value to check is valid date or not.
		* @param {string} userFormat date format string. Default value will be 'mm/dd/yyyy'
		* @return {boolean} true or false.
		*/
		isValidDate(value: string, userFormat?: string): boolean {
			var userFormat = userFormat || 'mm/dd/yyyy', // default format
				delimiter = /[^mdy]/.exec(userFormat)[0],
				theFormat = userFormat.split(delimiter),
				theDate = value.split(delimiter),
				isDate = function (date: string[], format: string[]) {
					var m, d, y;
					for (var i = 0, len = format.length; i < len; i++) {
						if (/m/.test(format[i]))
							m = date[i];
						if (/d/.test(format[i]))
							d = date[i];
						if (/y/.test(format[i]))
							y = date[i];
					}
					return (
						m > 0 && m < 13 &&
						y && y.length === 4 &&
						d > 0 && d <= (new Date(y, m, 0)).getDate()
						);
				};

			return isDate(theDate, theFormat);
		}

		/**
		* Method to check whether the given date is weekend or not.
		* @param {Date} date to check is weekend or not.
		* @return {boolean} true or false.
		*/
		isWeekend(date: Date): boolean;
		/**
		* Method to check whether the given date is weekend or not.
		* @param {string} date to check is weekend or not.
		* @return {boolean} true or false.
		*/
		isWeekend(date: string): boolean;
		isWeekend(date: any): boolean {
			var day: number;
			if (date instanceof Date) {
				day = date.getDay();
				return (day > 0 && day < 6);
			}
			else if (typeof date === 'string') {
				if (this.isValidDate(date)) {
					day = this.parseDate(date).getDay();
					return (day > 0 && day < 6);
				}
				else {
					throw new Error('given input is not a valid date');
				}
			}
		}

		/**
		* Method to check whether the given date is in holiday or not.
		* @param {Date} date to check is holiday or not.
		* @return {boolean} true or false.
		*/
		isHoliday(date: Date): boolean;
		/**
		* Method to check whether the given date is in holiday or not.
		* @param {string} date to check is holiday or not.
		* @return {boolean} true or false.
		*/
		isHoliday(date: string): boolean;
		isHoliday(date: any): boolean {
			if (date instanceof Date) {
				return ($.inArray(this.formatDate(date, 'mm/dd/yyyy'), (typeof Utils !== 'undefined' ? Utils.Constants.HolidayList : [])) == -1);
			}
			else if (typeof date === 'string') {
				if (this.isValidDate(date)) {
					return ($.inArray(this.formatDate(date, 'mm/dd/yyyy'), (typeof Utils !== 'undefined' ? Utils.Constants.HolidayList : [])) == -1);
				}
				else {
					throw new Error('given input is not a valid date');
				}
			}
		}

		/**
		* Method to get the next working date/day frome the current date.
		* It will skip the weekend and holiday and returns the next date.
		* Note: If the current date is already a working date/day then it will return back the same date.
		* @return {Date} the next working date.
		*/
		nextWorkingDay(): Date;
		/**
		* Method to get the next working date/day for the given date.
		* It will skip the weekend and holiday and returns the next date.
		* Note: If the given date is already a working date/day then it will return back the same date.
		* @param {Date} value to get the next working date/day. If value is not passed then it will consider the current date as input value.
		* @return {Date} the next working date.
		*/
		nextWorkingDay(value?: Date): Date;
		/**
		* Method to get the next working date/day for the given date.
		* It will skip the weekend and holiday and returns the next date.
		* Note: If the given date is already a working date/day then it will return back the same date.
		* @param {string} value to get the next working date/day. If value is not passed then it will consider the current date as input value.
		* @return {Date} the next working date.
		*/
		nextWorkingDay(value?: string): Date;
		nextWorkingDay(value?: any): Date {
			var date = new Date(),
				isValidDate = false;
			if (typeof value === 'string') {
				date = this.parseDate(value, 'mm/dd/yyyy');
			}
			else if (value instanceof Date) {
				date = new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0);
			}

			while (!isValidDate) {
				if (date.getDay() == 0) {
					date.setDate(date.getDate() + 1);
				}
				else if (date.getDay() == 6) {
					date.setDate(date.getDate() + 2);
				}
				else {
					isValidDate = this.isHoliday(date);
					if (!isValidDate) {
						date.setDate(date.getDate() + 1);
					}
				}
			}

			return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
		}

		/**
		* Method to sort alpha numeric values.
		* @param {any} a curent item
		* @param {any} b next item
		* @return {number} sorted index
		*/
		public static sortAlphaNumeric(a, b) {
			var alphaRE = /[^a-zA-Z0-9]/g, // nasty regex for alphabet parsing
				numberRE = /[^0-9]/g, // nasty regex for number parsing
				aA = a ? a.toLowerCase().replace(alphaRE, "") : a,
				bA = b ? b.toLowerCase().replace(alphaRE, "") : b;
			if (aA === bA) {
				var aN = parseInt(a.replace(numberRE, ""), 10);
				var bN = parseInt(b.replace(numberRE, ""), 10);
				return aN === bN ? 0 : aN > bN ? 1 : -1;
			} else {
				return aA > bA ? 1 : -1;
			}
		}

		/**
	   * Method to identify is string is null or empty or contains any white spaces
	   * @returns {boolean} returns true when the string is not null or empty or not contains any white spaces otherwise return as fasle.
	   */
		isNullOrEmptyOrWhiteSpaces(value: string) {
			if (value && value.trim()) {
				return true;
			}
			else {
				return false;
			}
		}

		/**
		* Method to reformat the phone Number.
		* e.g input = '999-999-9999' result is '(999)999-9999'
		* @param {string} input is the string with phone digits.
		* @returns {string} the input string by reformatting to US Phone Format.
		*/
		USAPhoneFormat(input: string) {
			if (input !== undefined && input !== null) {
				//normalize string and remove all unnecessary characters
				input = input.replace(/[^\d]/g, "");

				//check if number length equals to 10
				if (input.length == 10) {
					//reformat and return phone number
					return input.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
				}
				else if (input.length > 0 && input.length < 10) {
					return input;
				}

				return '';
			}
		}
	}

	/**
	* Method to apply the access type permission to the controls.
	* @param {any} element is the DOM object to set the access permission.
	* @param {string} accessType value of access type is hide/disable.
	*/
	export function applyAccessType(element: any, accessType: string) {
		if (element && $(element).length) {
			switch (accessType) {
				case ('hide'):
					var isCurrentlyVisible = !(element.style.display == "none");
					if (isCurrentlyVisible) {
						element.style.display = "none";
						ko.virtualElements.emptyNode(element);
					}
					break;
				case ('disable'):
					if (!(element.disabled)) {
						element.disabled = true;
						$(element).each(function () {
							var currentElement = this;
							/* Setting applied to a particular element or control */
							$(currentElement).prop('disabled', true);
							$(currentElement).css({ cursor: 'default', 'text-decoration': "none" }).unbind('click').removeAttr('href').addClass('disabled');

							/* Setting applied to inner controls of a particular element */
							$(currentElement).find('*').prop('disabled', true);
							$(currentElement).find('*').css({ cursor: 'default', 'text-decoration': "none" }).unbind('click').removeAttr('href').addClass('disabled');
						});
					}
					break;
			}
		}
	}

	/**
	* Method to get the dirty items of view model[knockout].
	* This method will gives the collection of knockout observable items which has been modified in a view model.
	* @param {Object} myModel is the view model to get the dirty items.
	* @returns {string[]} the dirty items of view model[knockout].
	*/
	export function getDirtyItems(myModel: Object) {
		var dirtyItems: string[] = [];
		if (myModel) {
			for (var key in myModel) {
				if (myModel.hasOwnProperty(key) && ko.isObservable(myModel[key]) && ko.unwrap(myModel[key].isDirty)) {
					dirtyItems.push(key);
				}
				else if (myModel.hasOwnProperty(key) && myModel[key] && typeof myModel[key].isDirty === 'function' && myModel[key].isDirty()) {
					dirtyItems.push(key);
				}
			}
		}
		return dirtyItems;
	}

	/**
	* Method to get the modified items of view model[knockout].
	* This method will gives the collection of knockout observable items which has been modified in a view model.
	* @param {Object} viewmodel is the view model to get the changed items.
	* @returns {string[]} the changed items of view model[knockout].
	*/
	export function getChangesFromModel(viewmodel: Object) {
		var changedItems: string[] = [];
		if (viewmodel) {
			for (var key in viewmodel) {
				if (viewmodel.hasOwnProperty(key) && ko.isObservable(viewmodel[key]) && ko.unwrap(viewmodel[key].hasValueChanged)) {
					changedItems.push(key);
				}
				else if (viewmodel.hasOwnProperty(key) && viewmodel[key] && typeof viewmodel[key].hasValueChanged === 'function' && viewmodel[key].hasValueChanged()) {
					changedItems.push(key);
				}
			}
		}
		return changedItems;
	}

	/**
	* Method to remove number with brackets.
	* e.g input = 'TEXT (0001)' result is 'TEXT'
	* @param {string} input is the string to remove the number with brackets.
	* @returns {string} the input string with removal of number with brackets.
	*/
	export function removeNumberWithbrackets(input: string) {
		if (input) {
			return input.replace(/ *\([\d^)]*\) */g, "");
		} else {
			return input;
		}
	}

	/**
	* Method to handle and set client pagination data for KO grid.
	* @param {KnockoutObservableArray<any>} data to bind in KO grid.
	* @param {any} gridOption [ReportAction] report action object.
	* @param {any} grid [ReportGridOption] report grid option.
	* @param {KnockoutObservableArray<any>} currentData grid data object in viewmodel.
	* @returns empty.
	*/
	export function kgSetClientsidePagination(data: KnockoutObservableArray<any>, gridOption: any, grid: any, currentData: KnockoutObservableArray<any>) {
		try {
			var pgngOption = gridOption.gridOptions.pagingOptions,
				pagedData = data.slice((pgngOption.currentPage() - 1) * pgngOption.pageSize(), pgngOption.currentPage() * pgngOption.pageSize()),
				fltrOptions = gridOption.gridOptions.filterOptions;

			if (gridOption.gridOptions.useClientSideFilterAndSort) {
				if (gridOption.gridOptions.fullDataObject) {
					gridOption.gridOptions.fullDataObject(ko.unwrap(data));
				} else {
					gridOption.gridOptions.fullDataObject = ko.observableArray(ko.unwrap(data));
				}
			}

			// to set the data in report viewer control
			gridOption.gridOptions.data(pagedData);
			if (currentData) {
				currentData(pagedData);
			}

			if ((gridOption.gridOptions.useClientSideFilterAndSort || (gridOption.useClientSideSorting && gridOption.useClientSideSorting == true)) && (!fltrOptions.filterText || !fltrOptions.filterText() || fltrOptions.filterText().length === 0)) {
				pgngOption.totalServerItems(ko.unwrap(data).length);
			}
		}
		finally {
			return;
		}
	}

	/**
	* Method to a object tag to the given target control.
	* @param {string} targetID to add a object tag.
	* @param {string} sourceURL url of the document has to show in the object tag.
	* @param {string} mimeType MIME type of the document
	* @param {string} alternativeURL url to download the document if it is not loaded
	*/
	export function addObjectTagToControl(targetID: string, sourceURL?: string, mimeType?: string, alternativeURL?: string) {
        var objectTag = $('<object></object>').attr({ data: sourceURL || '', type: mimeType || '' }).css({ width: '100%', height: '100%', zoom: '100%' });

		if (alternativeURL) {
			$('<p>Alternative text - include a link <a href="' + alternativeURL + '">to the PDF!</a></p>').appendTo(objectTag);
		}

		$('#' + targetID).append(objectTag);
	}

	/**
	* Object to hold the application constants.
	*/
	export var Constants: ConstantsStatic = {
		LowerAlphabet: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
		UpperAlphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
	};
}
/*     Common Utils Functions  */
/* ====================================== */