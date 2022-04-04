/*!
 * PLUGIN inQuiry InfiniteScroller V1.2
 * @laguage: Javascript ES6
 * @author: Tony N. Hyde (Date: 23 January 2022)
 * @Dependencies: jQuery, inQuiry.Extentions.js
 */
(function ($) {
	"use strict";

	class infiniteScroll {
		constructor(options) {

			this.defaults = {
				element: document.getElementsByTagName("BODY"),
				searchBox: null,
				onPull: null,
				pageNo: 0,
				perPage: 0,
				columns: [],
				order: [{ column: 0, dir: "asc" }],
				search: { value: "", regex: false }
			};

			this.defaults = $.extend({}, this.defaults, options);

			this.scroller = function (evt) {

				var instance = evt.target.infiniteScroll;

				var sTop = instance.defaults.element == document ? window.scrollY : instance.defaults.element.scrollTop;

				var cHeight = instance.defaults.element == document ? window.innerHeight : instance.defaults.element.clientHeight;

				var sHeight = instance.defaults.element == document ? document.body.offsetHeight : instance.defaults.element.scrollHeight;

				if (instance.defaults.onPull && (sTop + cHeight) >= sHeight) {

					if (instance.defaults.order.length <= 0) {

						instance.defaults.order = [{ column: 0, dir: "asc" }];

					}

					instance.defaults.pageNo++;

					instance.defaults.onPull(instance.defaults);

				}

			};

			this.destory = function () {

				if (this.defaults.element.removeEventListener) {

					this.defaults.element.removeEventListener("scroll", this.scroller, false);

				} else if (this.defaults.element.removeEvent) {

					this.defaults.element.removeEvent("onscroll", this.scroller);

				}

				if (this.defaults.searchBox) {

					if (this.defaults.searchBox.removeEventListener) {

						this.defaults.searchBox.removeEventListener("keypress", this.searchPress, false);

					} else if (this.defaults.searchBox.removeEvent) {

						this.defaults.searchBox.removeEvent("onkeypress", this.searchPress);

					}

				}

				this.defaults.onPull = null;

				this.defaults.element = null;

				this.defaults = null;

			};

			this.searchPress = function (evt) {

				if (evt.which == 13) {

					var instance = evt.target.infiniteScroll;

					instance.defaults.pageNo = 0;

					instance.defaults.element.innerHTML = "";

					instance.defaults.search.value = evt.target.value;

					instance.scroller({
						target: {
							infiniteScroll: instance
						}
					});

				}

			};

			this.trigger = function () {

				var instance = this;

				instance.defaults.pageNo = 0;

				instance.defaults.element.innerHTML = "";

				this.scroller({
					target: {
						infiniteScroll: this
					}
				});

			};

			if (this.defaults.element.addEventListener) {

				this.defaults.element.addEventListener("scroll", this.scroller, false);

			} else if (this.defaults.element.attachEvent) {

				this.defaults.element.attachEvent("onscroll", this.scroller);

			}

			if (this.defaults.searchBox) {

				if (this.defaults.searchBox.addEventListener) {

					this.defaults.searchBox.addEventListener("keypress", this.searchPress, false);

				} else if (this.defaults.searchBox.attachEvent) {

					this.defaults.searchBox.attachEvent("onkeypress", this.searchPress);

				}

				this.defaults.searchBox.infiniteScroll = this;

			}

			this.defaults.element.infiniteScroll = this;

			this.scroller({
				target: {
					infiniteScroll: this.defaults.element.infiniteScroll
				}
			});

		}
	}

    $.fn.infiniteScroll = function(options)
    {

		options.element = this[0];

		this[0].infiniteScroll = new infiniteScroll(options);

		return this;

    };

})(jQuery);