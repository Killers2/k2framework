/*!
 * PLUGIN inQuiry ContextMenu V1.2
 * @laguage: Javascript ES6
 * @author: Tony N. Hyde (Date: 23 January 2022)
 * @Dependencies: jQuery, inQuiry.Extentions.js
 */
(function ($) {
	"use strict";

	class contextMenu{
		
		constructor(options) {

			this.uiMenu = null;

			var defaults = {
				identity: "",
				element: null,
				name: "",
                parent: null,
                bindings: []
			}

			options = $.extend({}, defaults, options);

			options.identity = options.name.replace(' ', '_').toLowerCase();
        
			if ($(options.element).attr("data-jsonid")) { 		
				options.identity += "_" + $(options.element).attr("data-jsonid"); 	
			}
			
			this.uiMenu = $('<div id="ctxmenu_' + options.identity + '" data-ctxmenu="' + $(options.element).prop("tagName") + '" class="dropdown-menu" style=\"z-index:2147483600;\"></div>');

			this.uiMenu.on('contextmenu', (e) => { 

				e.preventDefault();

				return false; 

			});

			var buildLoop = (menu, item) => {

				var subMenu = null;

				if(item.bindings) {

					subMenu = $('<div id="ctxmenusub_' + options.identity + '_' + item.command.replace(/ /g, "").toLowerCase() + '" data-ctxmenu-sub class="dropdown-menu" style=\"z-index:2147483600;\"></div>');
					
					menu.append(subMenu);
					
					$.each(item.bindings, function (idx, binding) {
					
						buildLoop(subMenu, binding);
					
					});

				}

				if(item.command)
				{	
					if (item.command.startsWith("-br")) 
					{

						menu.append($('<div class="dropdown-divider"></div>'));

					} 
					else 
					{
			
						var icon = "";

						if (item.iconClass) { 

							icon = '<i class="' + item.iconClass + '"></i>'; 

						}

						var subIcon = "";

						if (item.subIconClass) { 

							subIcon = '<i class="' + item.subIconClass + ' dropdown-item-sub"></i>'; 

						}

						var buttonId = "btn_" + options.identity + "_" + item.command.replace(/ /g, "").toLowerCase();
						
						var button = $('<a id="' + buttonId + '" class="dropdown-item" href="javascript:void(0);">' + icon + item.command + subIcon + '</a>');

						if(subMenu)
						{

							button.on("mouseenter", (evt) => { 

								menu.find('[data-ctxmenu-sub]').filter((i, o) => o != subMenu[0]).fadeOut(50);

								var paddingY = parseInt(button.css("padding-top").replace("px", "")) + parseInt(button.css("padding-bottom").replace("px", ""));

								var newX = menu[0].offsetWidth - 4; // Overlap the menu a little for effects.

								var newY = button[0].offsetTop - (paddingY + 2); // Liftup the menu a little for effects.

								subMenu.css("top", newY + "px").css("left", newX + "px");
							
								if(subMenu.css("display") == "none")
								{
									subMenu.fadeIn(100);
								}

							});	

							button.on("mouseleave", (evt) => { 

								if(!$.inQuiry.mouseIntersects(subMenu, evt))
								{

									subMenu.fadeOut(10);

								}

							});	

						}
						else
						{

							button.on("mouseenter", (evt) => { 

								if(menu.attr("data-ctxmenu-sub") != '' || menu.attr("data-ctxmenu-sub") == undefined) {
								
									this.uiMenu.find('[data-ctxmenu-sub]').fadeOut(50);
							
								}

							});	

							button.on("click", function (evt) { 

								if (item.callback) { 

									$.ContextMenuHideAll();

									item.callback($(evt.currentTarget), menu); 

								} 

							});

						}

						button.on('contextmenu', function (e) { 

							e.preventDefault();

							return false; 
						
						});

						menu.append(button);
				
					}
				}
				
			};
			
			$.each(options.bindings, (idx, binding) => {

				buildLoop(this.uiMenu, binding);

			});

			$(options.element).on('contextmenu', (e) => {
				
				var _preventDefault = false;
				
				if (options.onOpening) { 

					_preventDefault = options.onOpening(_preventDefault, e); 

				}
				
				if (!_preventDefault) { 

					e.preventDefault();

					var menuHeight = this.uiMenu.css('left', e.pageX).css('top', e.pageY).css('display', "block").css('visibility', "hidden").height();

					this.uiMenu.css('visibility', "").css('display', "none");

					if((e.pageY + menuHeight) > $.inQuiry.screen.dimentions().height)
					{

						this.uiMenu.css('top', e.pageY - menuHeight);

					}

					this.uiMenu.fadeIn(50);

					if(!this.uiMenu.hasClass("dropdown-menu-visable")) {

						this.uiMenu.addClass("dropdown-menu-visable").onClickOut(() => {

							this.uiMenu.removeClass("dropdown-menu-visable");
							
							$.ContextMenuHideAll();

						});

					}

				}
				
				return false;

			});

			$(options.parent).append(this.uiMenu);

			this.destroy = () => {

				this.uiMenu.find("[data-ctxmenu-sub]").remove();
				
				this.uiMenu.remove();

			}

		}

	}

	$.fn.ContextMenu = function (options) {
        
		var defaults = {
			name: "",
			parent: null,
			bindings: []
		}
		
		$.each(this, (idx, ele) => {

			options = $.extend({}, defaults, options);

			if(!options.parent || options.parent == null)
			{
				options.parent = $("body")[0];
			}

			options.element = ele;

			options.element.contextMenu = new contextMenu(options);

		});

    };

	$.ContextMenuHideAll = function (body) {

        if (body) {

			$(body).find('[data-ctxmenu-sub]').fadeOut(50);
			$(body).find('[data-ctxmenu]').fadeOut(50);

        } else {

			$('[data-ctxmenu-sub]').fadeOut(50);
			$('[data-ctxmenu]').fadeOut(50);

        }

    };

    $.fn.ContextMenuDestroy = function () {

		$.each.each(this, (idx, item) => {

			if(item[0].contextMenu)
			{
				item[0].contextMenu.destroy();
			}

		});

    }

})(jQuery);

