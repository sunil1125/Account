﻿tinymce.PluginManager.add("link", function (t) {
	function e(e) {
		return function () {
			var n = t.settings.link_list;
			"string" == typeof n ? tinymce.util.XHR.send({
				url: n,
				success: function (t) {
					e(tinymce.util.JSON.parse(t))
				}
			}) : "function" == typeof n ? n(e) : e(n)
		}
	}

	function n(e) {
		function n(t) {
			var e = d.find("#text");
			(!e.value() || t.lastControl && e.value() == t.lastControl.text()) && e.value(t.control.text()), d.find("#href").value(t.control.value())
		}

		function l() {
			var n = [{
				text: "None",
				value: ""
			}];
			return tinymce.each(e, function (e) {
				n.push({
					text: e.text || e.title,
					value: t.convertURL(e.value || e.url, "href"),
					menu: e.menu
				})
			}), n
		}

		function i(e) {
			return tinymce.each(e, function (e) {
				e.textStyle = function () {
					return t.formatter.getCssText({
						inline: "a",
						classes: [e.value]
					})
				}
			}), e
		}

		function a(e, n, l) {
			var i, a = [];
			return tinymce.each(t.settings[e] || l, function (t) {
				var e = {
					text: t.text || t.title,
					value: t.value
				};
				a.push(e), (b[n] === t.value || !i && t.selected) && (i = e)
			}), i && !b[n] && (b[n] = i.value, i.selected = !0), a
		}

		function r(e) {
			var l = [];
			return tinymce.each(t.dom.select("a:not([href])"), function (t) {
				var n = t.name || t.id;
				n && l.push({
					text: n,
					value: "#" + n,
					selected: -1 != e.indexOf("#" + n)
				})
			}), l.length ? (l.unshift({
				text: "None",
				value: ""
			}), {
				name: "anchor",
				type: "listbox",
				label: "Anchors",
				values: l,
				onselect: n
			}) : void 0
		}

		function o() {
			h && h.value(t.convertURL(this.value(), "href")), !f && 0 === b.text.length && x && this.parent().parent().find("#text")[0].value(this.value())
		}

		function s(t) {
			var e = k.getContent();
			if (/</.test(e) && (!/^<a [^>]+>[^<]+<\/a>$/.test(e) || -1 == e.indexOf("href="))) return !1;
			if (t) {
				var n, l = t.childNodes;
				if (0 === l.length) return !1;
				for (n = l.length - 1; n >= 0; n--)
					if (3 != l[n].nodeType) return !1
			}
			return !0
		}
		var u, c, f, d, x, v, h, g, m, p, y, b = {},
            k = t.selection,
            w = t.dom;
		u = k.getNode(), c = w.getParent(u, "a[href]"), x = s(), b.text = f = c ? c.innerText || c.textContent : k.getContent({
			format: "text"
		}), b.href = c ? w.getAttrib(c, "href") : "", b.target = c ? w.getAttrib(c, "target") : t.settings.default_link_target || null, b.rel = c ? w.getAttrib(c, "rel") : null, b["class"] = c ? w.getAttrib(c, "class") : null, b.title = c ? w.getAttrib(c, "title") : "", x && (v = {
			name: "text",
			type: "textbox",
			size: 40,
			label: "Text to display",
			onchange: function () {
				b.text = this.value()
			}
		}), e && (h = {
			type: "listbox",
			label: "Link list",
			values: l(),
			onselect: n,
			value: t.convertURL(b.href, "href"),
			onPostRender: function () {
				h = this
			}
		}),
		//t.settings.target_list !== !1 && (m = {
		//	name: "target",
		//	type: "listbox",
		//	label: "Target",
		//	values: a("target_list", "target", [{
		//		text: "None",
		//		value: ""
		//	}, {
		//		text: "New window",
		//		value: "_blank"
		//	}])
		//}),
		t.settings.rel_list && (g = {
			name: "rel",
			type: "listbox",
			label: "Rel",
			values: a("rel_list", "rel", [{
				text: "None",
				value: ""
			}])
		}), t.settings.link_class_list && (p = {
			name: "class",
			type: "listbox",
			label: "Class",
			values: i(a("link_class_list", "class"))
		}), t.settings.link_title !== !1 && (y = {
			name: "title",
			type: "textbox",
			label: "Title",
			value: b.title
		}), d = t.windowManager.open({
			title: "Insert link",
			data: b,
			body: [{
				name: "href",
				type: "filepicker",
				filetype: "file",
				size: 40,
				autofocus: !0,
				label: "Url",
				onchange: o,
				onkeyup: o
			}, v, y, r(b.href), h, g, m, p],
			onSubmit: function (e) {
				function n(e, n) {
					var l = t.selection.getRng();
					window.setTimeout(function () {
						t.windowManager.confirm(e, function (e) {
							t.selection.setRng(l), n(e)
						})
					}, 0)
				}

				function l() {
					var e = {
						href: i,
						target: b.target ? b.target : null,
						rel: b.rel ? b.rel : null,
						"class": b["class"] ? b["class"] : null,
						title: b.title ? b.title : null
					};
					c ? (t.focus(), x && b.text != f && ("innerText" in c ? c.innerText = b.text : c.textContent = b.text), w.setAttribs(c, e), k.select(c), t.undoManager.add()) : x ? t.insertContent(w.createHTML("a", e, w.encode(b.text))) : t.execCommand("mceInsertLink", !1, e)
				}
				var i;
				return b = tinymce.extend(b, e.data), (i = b.href) ? i.indexOf("@") > 0 && -1 == i.indexOf("//") && -1 == i.indexOf("mailto:") ? void n("The URL you entered seems to be an email address. Do you want to add the required mailto: prefix?", function (t) {
					t && (i = "mailto:" + i), l()
				}) : /^\s*www\./i.test(i) ? void n("The URL you entered seems to be an external link. Do you want to add the required http:// prefix?", function (t) {
					t && (i = "http://" + i), l()
				}) : void l() : void t.execCommand("unlink")
			}
		})
	}
	t.addButton("link", {
		icon: "link",
		tooltip: "Insert/edit link",
		shortcut: "Ctrl+K",
		onclick: e(n),
		stateSelector: "a[href]"
	}), t.addButton("unlink", {
		icon: "unlink",
		tooltip: "Remove link",
		cmd: "unlink",
		stateSelector: "a[href]"
	}), t.addShortcut("Ctrl+K", "", e(n)), this.showDialog = n, t.addMenuItem("link", {
		icon: "link",
		text: "Insert link",
		shortcut: "Ctrl+K",
		onclick: e(n),
		stateSelector: "a[href]",
		context: "insert",
		prependToContext: !0
	})
});