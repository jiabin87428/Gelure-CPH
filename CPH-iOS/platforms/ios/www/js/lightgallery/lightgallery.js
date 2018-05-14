/*! lightgallery - v1.2.0 - 2015-08-26
 * http://sachinchoolur.github.io/lightGallery/
 * Copyright (c) 2015 Sachin N; Licensed Apache 2.0 */
!
function(a, b, c, d) {
	"use strict";

	function e(b, d) {
		return this.el = b, this.$el = a(b), this.s = a.extend({}, f, d), this.modules = {}, this.lGalleryOn = !1, this.lgBusy = !1, this.hideBartimeout = !1, this.isTouch = "ontouchstart" in c.documentElement, this.s.slideEndAnimatoin && (this.s.hideControlOnEnd = !1), this.s.dynamic ? this.$items = this.s.dynamicEl : "this" === this.s.selector ? this.$items = this.$el : "" !== this.s.selector ? this.$items = this.$el.find(a(this.s.selector)) : this.$items = this.$el.children(), this.$slide = "", this.$outer = "", this.init(), this
	}
	var f = {
		mode: "lg-slide",
		cssEasing: "cubic-bezier(0.25, 0, 0.25, 1)",
		easing: "linear",
		speed: 600,
		height: "100%",
		width: "100%",
		addClass: "",
		startClass: "lg-start-zoom",
		backdropDuration: 150,
		hideBarsDelay: 6e3,
		useLeft: !1,
		closable: !0,
		loop: !0,
		escKey: !0,
		keyPress: !0,
		controls: !0,
		slideEndAnimatoin: !0,
		hideControlOnEnd: !1,
		mousewheel: !0,
		appendSubHtmlTo: ".lg-sub-html",
		preload: 1,
		showAfterLoad: !0,
		selector: "",
		nextHtml: "",
		prevHtml: "",
		index: !1,
		iframeMaxWidth: "100%",
		download: !0,
		counter: !0,
		appendCounterTo: ".lg-toolbar",
		swipeThreshold: 50,
		enableSwipe: !0,
		enableDrag: !0,
		dynamic: !1,
		dynamicEl: [],
		galleryId: 1
	};
	e.prototype.init = function() {
		var c = this;
		c.s.preload > c.$items.length && (c.s.preload = c.$items.length);
		var d = b.location.hash;
		d.indexOf("lg=" + this.s.galleryId) > 0 && (c.index = parseInt(d.split("&slide=")[1], 10), a("body").addClass("lg-from-hash"), a("body").hasClass("lg-on") || setTimeout(function() {
			c.build(c.index), a("body").addClass("lg-on")
		})), c.s.dynamic ? (c.$el.trigger("onBeforeOpen.lg"), c.index = c.s.index || 0, a("body").hasClass("lg-on") || setTimeout(function() {
			c.build(c.index), a("body").addClass("lg-on")
		})) : c.$items.on("click.lgcustom", function(b) {
			try {
				b.preventDefault(), b.preventDefault()
			} catch (d) {
				b.returnValue = !1
			}
			c.$el.trigger("onBeforeOpen.lg"), c.index = c.s.index || c.$items.index(this), a("body").hasClass("lg-on") || (c.build(c.index), a("body").addClass("lg-on"))
		})
	}, e.prototype.build = function(b) {
		var c = this;
		c.structure(), a.each(a.fn.lightGallery.modules, function(b) {
			c.modules[b] = new a.fn.lightGallery.modules[b](c.el)
		}), c.slide(b, !1, !1), c.s.keyPress && c.keyPress(), c.$items.length > 1 && (c.arrow(), setTimeout(function() {
			c.enableDrag(), c.enableSwipe()
		}, 50), c.s.mousewheel && c.mousewheel()), c.counter(), c.closeGallery(), c.$outer.on("mousemove.lg click.lg touchstart.lg", function() {
			c.$outer.removeClass("lg-hide-items"), clearTimeout(c.hideBartimeout), c.hideBartimeout = setTimeout(function() {
				c.$outer.addClass("lg-hide-items")
			}, c.s.hideBarsDelay)
		})
	}, e.prototype.structure = function() {
		var c, d = "",
			e = "",
			f = 0,
			g = "",
			h = this;
		for (a("body").append('<div class="lg-backdrop"></div>'), a(".lg-backdrop").css("transition-duration", this.s.backdropDuration + "ms"), f = 0; f < this.$items.length; f++) d += '<div class="lg-item"></div>';
		if (this.s.controls && this.$items.length > 1 && (e = '<div class="lg-actions"><div class="lg-prev lg-icon">' + this.s.prevHtml + '</div><div class="lg-next lg-icon">' + this.s.nextHtml + "</div></div>"), ".lg-sub-html" === this.s.appendSubHtmlTo && (g = '<div class="lg-sub-html"></div>'), c = '<div class="lg-outer ' + this.s.addClass + " " + this.s.startClass + '"><div class="lg" style="width:' + this.s.width + "; height:" + this.s.height + '"><div class="lg-inner">' + d + '</div><div class="lg-toolbar group"><span id="lg-close" class="lg-close lg-icon"></span></div>' + e + g + "</div></div>", a("body").append(c), this.$outer = a(".lg-outer"), this.$slide = this.$outer.find(".lg-item"), this.s.useLeft ? this.$outer.addClass("lg-use-left") : this.$outer.addClass("lg-use-css3"), h.setTop(), a(b).on("resize.lg orientationchange.lg", function() {
			setTimeout(function() {
				h.setTop()
			}, 100)
		}), this.$slide.eq(this.index).addClass("lg-current"), this.doCss() ? this.$outer.addClass("lg-css3") : this.$outer.addClass("lg-css"), this.$outer.addClass(this.s.mode), this.s.enableDrag && this.$items.length > 1 && this.$outer.addClass("lg-grab"), this.s.showAfterLoad && this.$outer.addClass("lg-show-after-load"), this.doCss()) {
			var i = this.$outer.find(".lg-inner");
			i.css("transition-timing-function", this.s.cssEasing), i.css("transition-duration", this.s.speed + "ms")
		}
		a(".lg-backdrop").addClass("in"), setTimeout(function() {
			h.$outer.addClass("lg-visible")
		}, this.s.backdropDuration), this.s.download && this.$outer.find(".lg-toolbar").append('<a id="lg-download" target="_blank" download class="lg-download lg-icon"></a>')
	}, e.prototype.setTop = function() {
		if ("100%" !== this.s.height) {
			var c = a(b).height(),
				d = (c - parseInt(this.s.height, 10)) / 2,
				e = this.$outer.find(".lg");
			c >= parseInt(this.s.height, 10) ? e.css("top", d + "px") : e.css("top", "0px")
		}
	}, e.prototype.doCss = function() {
		var a = function() {
				var a = ["transition", "MozTransition", "WebkitTransition", "OTransition", "msTransition", "KhtmlTransition"],
					b = c.documentElement,
					d = 0;
				for (d = 0; d < a.length; d++) if (a[d] in b.style) return !0
			};
		return a() ? !0 : !1
	}, e.prototype.isVideo = function(a, b) {
		var c;
		if (c = this.s.dynamic ? this.s.dynamicEl[b].html : this.$items.eq(b).attr("data-html"), !a && c) return {
			html5: !0
		};
		var d = a.match(/\/\/(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/)?([a-z0-9self\-]+)/i),
			e = a.match(/\/\/(?:www\.)?vimeo.com\/([0-9a-z\-_this]+)/i);
		return d ? {
			youtube: d
		} : e ? {
			vimeo: e
		} : void 0
	}, e.prototype.counter = function() {
		this.s.counter && a(this.s.appendCounterTo).append('<div id="lg-counter"><span id="lg-counter-current">' + (parseInt(this.index, 10) + 1) + '</span> / <span id="lg-counter-all">' + this.$items.length + "</span></div>")
	}, e.prototype.addHtml = function(b) {
		var c = null;
		if (c = this.s.dynamic ? this.s.dynamicEl[b].subHtml : this.$items.eq(b).attr("data-sub-html"), "undefined" != typeof c && null !== c) {
			var d = c.substring(0, 1);
			c = "." === d || "#" === d ? a(c).html() : c
		} else c = "";
		".lg-sub-html" === this.s.appendSubHtmlTo ? (this.$outer.find(this.s.appendSubHtmlTo).html(c), "" === c ? this.$outer.find(this.s.appendSubHtmlTo).addClass("lg-empty-html") : this.$outer.find(this.s.appendSubHtmlTo).removeClass("lg-empty-html")) : this.$slide.eq(b).append(c), this.$el.trigger("onAfterAppendSubHtml.lg", [b])
	}, e.prototype.preload = function(a) {
		var b = 1,
			c = 1;
		for (b = 1; b <= this.s.preload && !(b >= this.$items.length - a); b++) this.loadContent(a + b, !1, 0);
		for (c = 1; c <= this.s.preload && !(0 > a - c); c++) this.loadContent(a - c, !1, 0)
	}, e.prototype.loadContent = function(c, d, e) {
		var f, g, h, i, j, k, l = this,
			m = !1,
			n = function(c) {
				for (var d = [], e = [], f = 0; f < c.length; f++) {
					var h = c[f].split(" ");
					"" === h[0] && h.splice(0, 1), e.push(h[0]), d.push(h[1])
				}
				for (var i = a(b).width(), j = 0; j < d.length; j++) if (parseInt(d[j], 10) > i) {
					g = e[j];
					break
				}
			};
		if (l.s.dynamic) {
			if (l.s.dynamicEl[c].poster && (m = !0, h = l.s.dynamicEl[c].poster), k = l.s.dynamicEl[c].html, g = l.s.dynamicEl[c].src, l.s.dynamicEl[c].responsive) {
				var o = l.s.dynamicEl[c].responsive.split(",");
				n(o)
			}
			i = l.s.dynamicEl[c].srcset, j = l.s.dynamicEl[c].sizes
		} else {
			if (l.$items.eq(c).attr("data-poster") && (m = !0, h = l.$items.eq(c).attr("data-poster")), k = l.$items.eq(c).attr("data-html"), g = l.$items.eq(c).attr("href") || l.$items.eq(c).attr("data-src"), l.$items.eq(c).attr("data-responsive")) {
				var p = l.$items.eq(c).attr("data-responsive").split(",");
				n(p)
			}
			i = l.$items.eq(c).attr("data-srcset"), j = l.$items.eq(c).attr("data-sizes")
		}
		var q = !1;
		l.s.dynamic ? l.s.dynamicEl[c].iframe && (q = !0) : "true" === l.$items.eq(c).attr("data-iframe") && (q = !0);
		var r = l.isVideo(g, c);
		if (!l.$slide.eq(c).hasClass("lg-loaded")) {
			if (q) l.$slide.eq(c).prepend('<div class="lg-video-cont" style="max-width:' + l.s.iframeMaxWidth + '"><div class="lg-video"><iframe class="lg-object" frameborder="0" src="' + g + '"  allowfullscreen="true"></iframe></div></div>');
			else if (m) {
				var s = "";
				s = r && r.youtube ? "lg-has-youtube" : r && r.vimeo ? "lg-has-vimeo" : "lg-has-html5", l.$slide.eq(c).prepend('<div class="lg-video-cont ' + s + ' "><div class="lg-video"><span class="lg-video-play"></span><img class="lg-object lg-has-poster" src="' + h + '" /></div></div>')
			} else r ? (l.$slide.eq(c).prepend('<div class="lg-video-cont "><div class="lg-video"></div></div>'), l.$el.trigger("hasVideo.lg", [c, g, k])) : l.$slide.eq(c).prepend('<div class="lg-img-wrap"> <img class="lg-object lg-image" src="' + g + '" /> </div>');
			if (l.$el.trigger("onAferAppendSlide.lg", [c]), f = l.$slide.eq(c).find(".lg-object"), j && f.attr("sizes", j), i) {
				f.attr("srcset", i);
				try {
					picturefill({
						elements: [f[0]]
					})
				} catch (t) {
					console.error("Make sure you have included Picturefill version 2")
				}
			}
			".lg-sub-html" !== this.s.appendSubHtmlTo && l.addHtml(c), l.$slide.eq(c).addClass("lg-loaded")
		}
		l.$slide.eq(c).find(".lg-object").on("load.lg error.lg", function() {
			var b = 0;
			e && !a("body").hasClass("lg-from-hash") && (b = e), setTimeout(function() {
				l.$slide.eq(c).addClass("lg-complete"), l.$el.trigger("onSlideItemLoad.lg", [c, e || 0])
			}, b)
		}), r && r.html5 && !m && l.$slide.eq(c).addClass("lg-complete"), d === !0 && (l.$slide.eq(c).hasClass("lg-complete") ? l.preload(c) : l.$slide.eq(c).find(".lg-object").on("load.lg error.lg", function() {
			l.preload(c)
		}))
	}, e.prototype.slide = function(b, c, d) {
		var e = this.$outer.find(".lg-current").index(),
			f = this;
		if (!f.lGalleryOn || e !== b) {
			var g = this.$slide.length,
				h = f.lGalleryOn ? this.s.speed : 0,
				i = !1,
				j = !1;
			if (!f.lgBusy) {
				if (this.$el.trigger("onBeforeSlide.lg", [e, b, c, d]), f.lgBusy = !0, clearTimeout(f.hideBartimeout), ".lg-sub-html" === this.s.appendSubHtmlTo && setTimeout(function() {
					f.addHtml(b)
				}, h), this.arrowDisable(b), c) {
					var k = b - 1,
						l = b + 1;
					0 === b && e === g - 1 ? (l = 0, k = g - 1) : b === g - 1 && 0 === e && (l = 0, k = g - 1), this.$slide.removeClass("lg-prev-slide lg-current lg-next-slide"), f.$slide.eq(k).addClass("lg-prev-slide"), f.$slide.eq(l).addClass("lg-next-slide"), f.$slide.eq(b).addClass("lg-current")
				} else f.$outer.addClass("lg-no-trans"), this.$slide.removeClass("lg-prev-slide lg-next-slide"), e > b ? (j = !0, 0 !== b || e !== g - 1 || d || (j = !1, i = !0)) : b > e && (i = !0, b !== g - 1 || 0 !== e || d || (j = !0, i = !1)), j ? (this.$slide.eq(b).addClass("lg-prev-slide"), this.$slide.eq(e).addClass("lg-next-slide")) : i && (this.$slide.eq(b).addClass("lg-next-slide"), this.$slide.eq(e).addClass("lg-prev-slide")), setTimeout(function() {
					f.$slide.removeClass("lg-current"), f.$slide.eq(b).addClass("lg-current"), f.$outer.removeClass("lg-no-trans")
				}, 50);
				if (f.lGalleryOn ? (setTimeout(function() {
					f.loadContent(b, !0, 0)
				}, this.s.speed + 50), setTimeout(function() {
					f.lgBusy = !1, f.$el.trigger("onAfterSlide.lg", [e, b, c, d])
				}, this.s.speed), f.doCss() || (f.$slide.fadeOut(f.s.speed), f.$slide.eq(b).fadeIn(f.s.speed))) : (f.loadContent(b, !0, f.s.backdropDuration), f.lgBusy = !1, f.$el.trigger("onAfterSlide.lg", [e, b, c, d]), f.doCss() || (f.$slide.fadeOut(50), f.$slide.eq(b).fadeIn(50))), this.s.download) {
					var m;
					m = f.s.dynamic ? f.s.dynamicEl[b].downloadUrl || f.s.dynamicEl[b].src : f.$items.eq(b).attr("data-download-url") || f.$items.eq(b).attr("href") || f.$items.eq(b).attr("data-src"), a("#lg-download").attr("href", m)
				}
				f.lGalleryOn = !0, this.s.counter && a("#lg-counter-current").text(b + 1)
			}
		}
	}, e.prototype.goToNextSlide = function(a) {
		var b = this;
		b.lgBusy || (b.index + 1 < b.$slide.length ? (b.index++, b.$el.trigger("onBeforeNextSlide.lg", [b.index]), b.slide(b.index, a, !1)) : b.s.loop ? (b.index = 0, b.$el.trigger("onBeforeNextSlide.lg", [b.index]), b.slide(b.index, a, !1)) : b.s.slideEndAnimatoin && (b.$outer.addClass("lg-right-end"), setTimeout(function() {
			b.$outer.removeClass("lg-right-end")
		}, 400)))
	}, e.prototype.goToPrevSlide = function(a) {
		var b = this;
		b.lgBusy || (b.index > 0 ? (b.index--, b.$el.trigger("onBeforePrevSlide.lg", [b.index, a]), b.slide(b.index, a, !1)) : b.s.loop ? (b.index = b.$items.length - 1, b.$el.trigger("onBeforePrevSlide.lg", [b.index, a]), b.slide(b.index, a, !1)) : b.s.slideEndAnimatoin && (b.$outer.addClass("lg-left-end"), setTimeout(function() {
			b.$outer.removeClass("lg-left-end")
		}, 400)))
	}, e.prototype.keyPress = function() {
		var c = this;
		this.$items.length > 1 && a(b).on("keyup.lg", function(a) {
			c.$items.length > 1 && (37 === a.keyCode && (a.preventDefault(), c.goToPrevSlide()), 39 === a.keyCode && (a.preventDefault(), c.goToNextSlide()))
		}), a(b).on("keydown.lg", function(a) {
			c.s.escKey !== !0 || 27 !== a.keyCode || c.$outer.hasClass("lg-thumb-open") || (a.preventDefault(), c.destroy())
		})
	}, e.prototype.arrow = function() {
		var a = this;
		this.$outer.find(".lg-prev").on("click.lg", function() {
			a.goToPrevSlide()
		}), this.$outer.find(".lg-next").on("click.lg", function() {
			a.goToNextSlide()
		})
	}, e.prototype.arrowDisable = function(a) {
		!this.s.loop && this.s.hideControlOnEnd && (a + 1 < this.$slide.length ? this.$outer.find(".lg-next").removeAttr("disabled").removeClass("disabled") : this.$outer.find(".lg-next").attr("disabled", "disabled").addClass("disabled"), a > 0 ? this.$outer.find(".lg-prev").removeAttr("disabled").removeClass("disabled") : this.$outer.find(".lg-prev").attr("disabled", "disabled").addClass("disabled"))
	}, e.prototype.setTranslate = function(a, b, c) {
		this.s.useLeft ? a.css("left", b) : a.css({
			transform: "translate3d(" + b + "px, " + c + "px, 0px)"
		})
	}, e.prototype.touchMove = function(b, c) {
		var d = c - b;
		this.$outer.addClass("lg-dragging"), this.setTranslate(this.$slide.eq(this.index), d, 0), this.setTranslate(a(".lg-prev-slide"), -this.$slide.eq(this.index).width() + d, 0), this.setTranslate(a(".lg-next-slide"), this.$slide.eq(this.index).width() + d, 0)
	}, e.prototype.touchEnd = function(a) {
		var b = this;
		"lg-slide" !== b.s.mode && b.$outer.addClass("lg-slide"), this.$slide.not(".lg-current, .lg-prev-slide, .lg-next-slide").css("opacity", "0"), setTimeout(function() {
			b.$outer.removeClass("lg-dragging"), 0 > a && Math.abs(a) > b.s.swipeThreshold ? b.goToNextSlide(!0) : a > 0 && Math.abs(a) > b.s.swipeThreshold ? b.goToPrevSlide(!0) : Math.abs(a) < 5 && b.$el.trigger("onSlideClick.lg"), b.$slide.removeAttr("style")
		}), setTimeout(function() {
			b.$outer.hasClass("lg-dragging") || "lg-slide" === b.s.mode || b.$outer.removeClass("lg-slide")
		}, b.s.speed + 100)
	}, e.prototype.enableSwipe = function() {
		var a = this,
			b = 0,
			c = 0,
			d = !1;
		a.s.enableSwipe && a.isTouch && a.doCss() && (a.$slide.on("touchstart.lg", function(c) {
			a.$outer.hasClass("lg-zoomed") || a.lgBusy || (c.preventDefault(), a.manageSwipeClass(), b = c.originalEvent.targetTouches[0].pageX)
		}), a.$slide.on("touchmove.lg", function(e) {
			a.$outer.hasClass("lg-zoomed") || (e.preventDefault(), c = e.originalEvent.targetTouches[0].pageX, a.touchMove(b, c), d = !0)
		}), a.$slide.on("touchend.lg", function() {
			a.$outer.hasClass("lg-zoomed") || (d ? (d = !1, a.touchEnd(c - b)) : a.$el.trigger("onSlideClick.lg"))
		}))
	}, e.prototype.enableDrag = function() {
		var c = this,
			d = 0,
			e = 0,
			f = !1,
			g = !1;
		c.s.enableDrag && !c.isTouch && c.doCss() && (c.$slide.on("mousedown.lg", function(b) {
			c.$outer.hasClass("lg-zoomed") || (a(b.target).hasClass("lg-object") || a(b.target).hasClass("lg-video-play")) && (b.preventDefault(), c.lgBusy || (c.manageSwipeClass(), d = b.pageX, f = !0, c.$outer.scrollLeft += 1, c.$outer.scrollLeft -= 1, c.$outer.removeClass("lg-grab").addClass("lg-grabbing"), c.$el.trigger("onDragstart.lg")))
		}), a(b).on("mousemove.lg", function(a) {
			f && (g = !0, e = a.pageX, c.touchMove(d, e), c.$el.trigger("onDragmove.lg"))
		}), a(b).on("mouseup.lg", function(b) {
			g ? (g = !1, c.touchEnd(e - d), c.$el.trigger("onDragend.lg")) : (a(b.target).hasClass("lg-object") || a(b.target).hasClass("lg-video-play")) && c.$el.trigger("onSlideClick.lg"), f && (f = !1, c.$outer.removeClass("lg-grabbing").addClass("lg-grab"))
		}))
	}, e.prototype.manageSwipeClass = function() {
		var a = this.index + 1,
			b = this.index - 1,
			c = this.$slide.length;
		this.s.loop && (0 === this.index ? b = c - 1 : this.index === c - 1 && (a = 0)), this.$slide.removeClass("lg-next-slide lg-prev-slide"), b > -1 && this.$slide.eq(b).addClass("lg-prev-slide"), this.$slide.eq(a).addClass("lg-next-slide")
	}, e.prototype.mousewheel = function() {
		var a = this;
		a.$outer.on("mousewheel.lg", function(b) {
			b.deltaY > 0 ? a.goToPrevSlide() : a.goToNextSlide(), b.preventDefault()
		})
	}, e.prototype.closeGallery = function() {
		var b = this,
			c = !1;
		this.$outer.find(".lg-close").on("click.lg", function() {
			setShowPic(false);
			b.destroy()
		}), b.s.closable && (b.$outer.on("mousedown.lg", function(b) {
			c = a(b.target).is(".lg-outer") || a(b.target).is(".lg-item ") || a(b.target).is(".lg-img-wrap") ? !0 : !1
		}), b.$outer.on("mouseup.lg", function(d) {
			(a(d.target).is(".lg-outer") || a(d.target).is(".lg-item ") || a(d.target).is(".lg-img-wrap") && c) && (b.$outer.hasClass("lg-dragging") || b.destroy())
		}))
	}, e.prototype.destroy = function(c) {
		var d = this;
		d.$el.trigger("onBeforeClose.lg"), c && (this.$items.off("click.lg click.lgcustom"), a.removeData(d.el, "lightGallery")), this.$el.off(".lg.tm"), a.each(a.fn.lightGallery.modules, function(a) {
			d.modules[a] && d.modules[a].destroy()
		}), this.lGalleryOn = !1, clearTimeout(d.hideBartimeout), this.hideBartimeout = !1, a(b).off(".lg"), a("body").removeClass("lg-on lg-from-hash"), d.$outer && d.$outer.removeClass("lg-visible"), a(".lg-backdrop").removeClass("in"), setTimeout(function() {
			d.$outer && d.$outer.remove(), a(".lg-backdrop").remove(), d.$el.trigger("onCloseAfter.lg")
		}, d.s.backdropDuration + 50)
	}, a.fn.lightGallery = function(b) {
		return this.each(function() {
			if (a.data(this, "lightGallery")) try {
				a(this).data("lightGallery").init()
			} catch (c) {
				console.error("lightGallery has not initiated properly")
			} else a.data(this, "lightGallery", new e(this, b))
		})
	}, a.fn.lightGallery.modules = {}
}(jQuery, window, document);