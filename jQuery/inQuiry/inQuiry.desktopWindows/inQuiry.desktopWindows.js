/*!
 * PLUGIN inQuiry DesktopWindows V1.2 (Based on KioskOs)
 * @laguage: Javascript ES6
 * @author: Tony N. Hyde (Date: 23 January 2022)
 * @Dependencies: jQuery, inQuiry.Extentions.js, inQuiry.objectCookie.js, inQuiry.toolTip.js, inQuiry.contextMenu.js
 * @Optional Dependencies: GSAP (https://greensock.com/gsap/) (https://cdnjs.cloudflare.com/ajax/libs/gsap/3.9.1/gsap.min.js)
 */
(function ($) {
	"use strict";

	$.desktopWindows = {
        TOPLEFT: 1, 
		TOPRIGHT: 2, 
		BOTTOMLEFT: 3, 
		BOTTOMRIGHT: 8, 
		CENTER: 16, 
		STATIC: 32, 
		NORESIZE: 64,
		APPNORMAL: 128,
		APPSERVICE: 256,
		APPSETTING: 512,
        shield: null, 
		desktop: null, 
		appsbar: null, 
		taskbar: null, 
		serviceappsbox: null,
		settingsappsbox : null,
		selectedwindowid: '', 
		maxzindex: 2147480000, 
		openwindows: [],
		setUpDesktop: function (selector) {

            this.element = $(selector)[0];
			this.shortcuts = [];

			this.width = function () {

                return parseInt($(this.element).css("width").replace("px", ""));

            };
           
			this.height = function () {

                return parseInt($(this.element).css("height").replace("px", ""));

            };

			this.add = function(options) {
            
				var defaults = { 
					id: "", 
					img: "",
					applicationname: "",
					tooltipContent: "",
					onDblclick: () => {},
					onOpen: () => {},
					onOpenToDesktop: () => {},
					onCopy: () => {},
					onPaste: () => {},
					onDelete: () => {},
					onProperties: () => {}
				};

				options = $.extend({}, defaults, options);

				var abs = $("<a />", { 
					id: options.id,
					class: "desktop-shortcut-icon",
					href: "javascript:void(0);",
					applicationname: options.applicationname,
					"ui-tooltip-point": "FREETOPRIGHT",
					"ui-tooltip": options.tooltipContent
				});	

				abs.append($("<img />", { alt: "", src: options.img }));
				abs.append($("<label>" + options.applicationname + "</label>"));

				$(this.element).prepend(abs);	

				abs.uiToolTip(); 

				abs.on("dblclick", options.onDblclick);

				var subMenuBuild = [];

				$(".desktop-desktop").each((i, desktop) => {

					subMenuBuild.push({
						command: "Open on desktop " + (parseInt(desktop.id.replace("desktop", "")) + 1), 
						iconClass: "fa fa-folder-open",
						callback: (buttonItem, menuItem) => {
							options.onOpenToDesktop(buttonItem, menuItem, abs, desktop);
							return;
						}
					});

				});

				abs.ContextMenu({
					name: "ctx_" + options.id,
					bindings: [
						{
							command: "Open", 
							iconClass: "fa-solid fa-square-arrow-up-right",
							callback: (buttonItem, menuItem) => {
								options.onOpen(buttonItem, menuItem, abs);
								return;
							}
						},
						{
							command: "Open to desktop", 
							iconClass: "fa-solid fa-arrow-up-right-from-square",
							subIconClass: "fa-solid fa-arrow-right",
							bindings: subMenuBuild
						},
						{ command: "-br" },
						{
							command: "Copy", 
							iconClass: "fa-solid fa-copy",
							callback: (buttonItem, menuItem) => {
								options.onCopy(buttonItem, menuItem, abs);
								return;
							}
						},
						{
							command: "Paste", 
							iconClass: "fa-solid fa-paste",
							callback: (buttonItem, menuItem) => {
								options.onPaste(buttonItem, menuItem, abs);
								return;
							}
						},
						{
							command: "Delete", 
							iconClass: "fa-solid fa-trash-can",
							callback: (buttonItem, menuItem) => {
								options.onDelete(buttonItem, menuItem, abs);
								return;
							}
						},
						{ command: "-br" },
						{
							command: "Properties", 
							iconClass: "fa-solid fa-clipboard-check",
							callback: (buttonItem, menuItem) => {
								options.onProperties(buttonItem, menuItem, abs);
								return;
							}
						}

					]
				});

				this.shortcuts.push(abs[0]);

			};

        },	
        setUpAppsBar: function (environment) {
            
			var ab = $("<div />", { id: "desktop-appsbar", class: "desktop-appsbar" });    	
			
			environment.append(ab);

			this.element = ab[0];

			this.appLinks = [];

			this.refresh = function () {

                if ($(".desktop-desktop").css("left") == "0px") {

                    $(".desktop-appsbar-icon").each((idx, item) => { 
						
						$(item).uiToolTip({
							position: $.uiToolTipPos.TOP
						}); 

					});

                } else {

                    $(".desktop-appsbar-icon").each((idx, item) => { 

						$(item).uiToolTip({
							position: $.uiToolTipPos.RIGHT
						}); 

					});

                }
            };

			this.add = function(options) {

				var defaults = { 
					id: "", 
					img: "",
					contextmenu: false,
					applicationname: "",
					tooltipDirection: "RIGHT",
					tooltipContent: "",
					action: () => {}
				};

				options = $.extend({}, defaults, options);

				var abs = $("<a />", { 
					id: options.id,
					class: "desktop-appsbar-icon", 
					href: "javascript:void(0);",
					"contextmenu": options.contextmenu,
					"applicationname": options.applicationname,
					"ui-tooltip-point": options.tooltipDirection,
					"ui-tooltip": options.tooltipContent
				});	

				if(options.img != "" && options.img != null)
				{
					abs.append($("<img />", { alt: "", src: options.img }));
				}

				$(this.element).append(abs);	

				abs.uiToolTip(); 

				abs.on("click", options.action);

				this.appLinks.push(abs[0]);

			};

        },
        setUpTaskBar: function (selector) {
            
			this.element = $(selector)[0];
            
        },
        setUpServiceAppsBox: function (environment) {
            
			this.element = $("<div />", { id: "desktop-services-apps", class: "desktop-services-apps"  });

			$(environment).append(this.element);

			$("#btn_taskbar_services").on("click", () => { 	

				if(!$(this.element).hasClass("desktop-services-apps-show")) {
					if($(this.element).children().length > 0) {
						$(this.element).addClass("desktop-services-apps-show").onClickOut(() => {
							$(this.element).removeClass("desktop-services-apps-show");
						});
					}
				}

			});
			
			this.appLinks = [];

			this.add = function(options) {

				var defaults = { 
					id: "", 
					img: "", 
					action: () => {}
				};

				options = $.extend({}, defaults, options);

				var temp = $("<a />", { 
					id: options.id, 
					class: "desktop-taskbar-icon", 
					href: "javascript:void(0);" 
				});	

				temp.append($("<img />", { alt: "", src: options.img }));		

				this.element.append(temp);

				temp.on("click", options.action);

				this.appLinks.push(temp[0]);

			};

			this.hide = () => {

				this.element.removeClass("desktop-services-apps-show");

			}

			this.show = () => {

				this.element.addClass("desktop-services-apps-show");

			}

        },
        setUpSettingsAppsBox: function (environment) {
            
			this.element = $("<div />", { id: "desktop-settingsbar", class: "desktop-settingsbar" });
		
			$(environment).append(this.element);

			$("#btn_taskbar_settings").on("click", () => { 
				if(!$(this.element).hasClass("desktop-settingsbar-show")) {
					$(this.element).addClass("desktop-settingsbar-show").onClickOut(() => {
						$(this.element).removeClass("desktop-settingsbar-show");
					});
				}
			});
	
			this.settingLinks = [];

			this.add = (options) => {

				var defaults = { 
					id: "", 
					img: "", 
					tooltipContent: "", 
					action: () => {}
				};

				options = $.extend({}, defaults, options);

				var temp = $("<a />", { 
					id: options.id, 
					class: "desktop-appsbar-icon", 
					href: "javascript:void(0);", 
					"ui-tooltip-point": "LEFT", 
					"ui-tooltip": options.tooltipContent
				});	
				
				temp.append($("<img />", { alt: "", src: options.img }));		
				
				this.element.append(temp);

				temp.on("click", options.action);

				temp.uiToolTip(); 

				this.settingLinks.push(temp[0]);

			};

			this.hide = () => {

				this.element.removeClass("desktop-settingsbar-show");

			}

			this.show = () => {

				this.element.addClass("desktop-settingsbar-show");

			}

        },
        setUpShield: function (selector, backcolor, transparency) {
            this.element = $(selector)[0];
            this.element.style.visibility = 'hidden';
            this.element.style.position = 'absolute';
            this.element.style.left = '0px';
            this.element.style.top = '0px';
            this.element.style.backgroundColor = backcolor;
            this.element.style.opacity = transparency * .01;
            this.element.style.filter = 'alpha(opacity=' + transparency + ')';
            this.element.style.zIndex = 2147479999;
            
			this.hide = function () {

                $('#' + $.desktopWindows.shield.element.id).off('contextmenu');

                this.element.style.visibility = 'hidden';

                this.element.style.width = '0px';

                this.element.style.height = '0px';

                this.element.style.zIndex = 2147479999;

            };

            this.show = function () {

                $('#' + $.desktopWindows.shield.element.id).on('contextmenu', function (e) { 

					e.preventDefault(); 

					return false; 

				});

                this.element.style.zIndex = ($.desktopWindows.maxzindex + 1);

                this.element.style.visibility = '';

            };

            this.resize = function () {

                if (this.element.style.visibility == '') {

                    
					var s = document.documentElement.scrollHeight;
                    
					var r = $.inQuiry.screen.dimentions();

					this.element.style.width = r.width + 'px';
                    
					if (($.inQuiry.browser.firefox) || ($.inQuiry.browser.msie) || ($.inQuiry.browser.mozilla)) { 

						this.element.style.height = (r.height + (s - r.height)) + 'px'; 

					}
                   
					if (($.inQuiry.browser.chrome) || ($.inQuiry.browser.safari) || ($.inQuiry.browser.opera)) { 
						
						if (s < r.height) { 
							
							this.element.style.height = r.height + 'px'; 
						
						} else { 

							this.element.style.width = r.width - 17 + 'px'; this.element.style.height = (r.height + (s - r.height)) + 'px'; 
						
						} 

					}
                    
					if (($.inQuiry.browser.msie) && (s != null || s > 0)) { 
						
						this.element.style.width = r.width - 17 + 'px'; 

					}
                    
					if (($('html').css('overflow') == 'hidden') || ($('body').css('overflow') == 'hidden')) { 

						this.element.style.width = r.width + 'px';

				 	}
                
				}

            };

        },
        window: function (options) {

			this.defaults = {
				windowId: "WindowX",
				width: 500,
				height: 365,
				position: $.desktopWindows.TOPLEFT,
				margin: 100,
				shield: false,
				statusBar: false,
				onload: null,
				onclose: null,
				onresize: null,
				ondoubleclick: null,
				onfocus: null,
				onmaximize: null,
				onminimize: null,
				onrestore: null,
				windowicon: "",
				appType: $.desktopWindows.APPNORMAL,
			};

			this.defaults = $.extend({}, this.defaults, options);

			this.windowframe = null;
			this.windowheader = null;
			this.windowcontent = null;
			this.windowstatusbar = null;
			this.windowtitle = null;
			this.btnClose = null;
			this.btnMaximize = null;
			this.btnMinimize = null;
			this.isMaximized = null;
			this.isMinimized = null;
			this.appsbarbutton = null;
			this.zIndex = 2147480000;
						
			this.load = function () {
                
				var exsits = $.desktopWindows._getparms(this.defaults.windowId);
                
				if (exsits != null) {
                    
					if (exsits.onminimize != null && exsits.windowicon != null) {

                        $('#btn_appsbar_' + this.defaults.windowId).click();

                        $('#btn_appsbar_' + this.defaults.windowId).show();

                        $("#btn_taskbar_" + this.defaults.windowId).remove();

                    } 

					return;

                }

                $.desktopWindows.openwindows.push(this);

                var a, b, c, d, e, f, g, h, k, l;
                a = document.createElement('div');
                a.setAttribute('id', 'window_' + this.defaults.windowId);
                a.setAttribute('class', 'window-frame');
                a.className = 'window-frame';
                a.setAttribute('style', 'visibility:hidden;position:absolute;min-width:' + this.defaults.width + 'px;min-height:' + this.defaults.height + 'px;width:' + this.defaults.width + 'px;height:' + this.defaults.height + 'px;');
                a.style.visibility = 'hidden';
                a.style.position = 'absolute';
                a.style.width = this.defaults.width + 'px';
                a.style.height = this.defaults.height + 'px';
                a.style.left = '0px';
                a.style.top = '0px';
                b = document.createElement('div');
                b.setAttribute('id', 'window_' + this.defaults.windowId + '_header');
                b.setAttribute('class', 'window-header');
                b.className = 'window-header';
				if(this.defaults.windowicon != "") {
					l = document.createElement('img');
					l.setAttribute('id', 'window_' + this.defaults.windowId + '_icon');
					l.setAttribute('src', this.defaults.windowicon);
				}	
                c = document.createElement('span');
                c.setAttribute('id', 'window_' + this.defaults.windowId + '_title');
				c.innerHTML = 'Loading...';
                d = document.createElement('div');
                d.setAttribute('class', 'window-buttons');
                d.className = 'window-buttons';
                e = document.createElement('div');
                e.setAttribute('id', 'window_' + this.defaults.windowId + '_btn_close');
                e.setAttribute('class', 'window-button window-button-close');
                e.className = 'window-button window-button-close';
                f = document.createElement('div');
                f.setAttribute('id', 'window_' + this.defaults.windowId + '_btn_maximize');
                f.setAttribute('class', 'window-button window-button-maximize');
                f.className = 'window-button window-button-maximize';
                g = document.createElement('div');
                g.setAttribute('id', 'window_' + this.defaults.windowId + '_btn_minimize');
                g.setAttribute('class', 'window-button window-button-minimize');
                g.className = 'window-button window-button-minimize';
                d.appendChild(e);
                d.appendChild(f);
                d.appendChild(g);
				if(this.defaults.windowicon != "") {
                	b.appendChild(l);
				}
                b.appendChild(c);
                b.appendChild(d);
				h = document.createElement('div');
                h.setAttribute('id', 'window_' + this.defaults.windowId + '_content');
                h.setAttribute('class', 'window-content');
                h.className = 'window-content';
				h.innerHTML = '<div class="window-content-loading">' + $.desktopWindows.getCssAjaxLoader() + '</div>';
                a.appendChild(b);
                a.appendChild(h);
				var hiddenCss = '';
				if(!this.defaults.statusBar) { hiddenCss = ' window-statusbar-none'; }
				k = document.createElement('div');
                k.setAttribute('id', 'window_' + this.defaults.windowId + '_statusbar');
                k.setAttribute('class', 'window-statusbar' + hiddenCss);
                k.className = 'window-statusbar' + hiddenCss;
                a.appendChild(k);

                $.desktopWindows.desktop.element.appendChild(a);

                this.windowframe = document.getElementById('window_' + this.defaults.windowId);
                this.windowheader = document.getElementById('window_' + this.defaults.windowId + '_header');
                this.windowcontent = document.getElementById('window_' + this.defaults.windowId + '_content');
				this.windowstatusbar = document.getElementById('window_' + this.defaults.windowId + '_statusbar');
                this.windowtitle = document.getElementById('window_' + this.defaults.windowId + '_title');
                this.btnClose = document.getElementById('window_' + this.defaults.windowId + '_btn_close');
                this.btnMaximize = document.getElementById('window_' + this.defaults.windowId + '_btn_maximize');
                this.btnMinimize = document.getElementById('window_' + this.defaults.windowId + '_btn_minimize');
               
				$(this.windowframe).css('z-index', $.desktopWindows.maxzindex);
                
				$.desktopWindows.maxzindex = parseInt($.desktopWindows.maxzindex) + 1;
                
				if (this.defaults.shield === true) {
                  
					$.desktopWindows.shield.show();
                  
					$.desktopWindows.shield.resize();
                  
					this.windowframe.style.zIndex = (this.windowframe.style.zIndex + 1);

				}

                if (this.defaults.position != null) {
                   
					var m = (this.defaults.margin == null ? 25 : this.defaults.margin);
                   
					var r = $.inQuiry.screen.dimentions();
                   
					if ((this.defaults.position & $.desktopWindows.TOPLEFT) == $.desktopWindows.TOPLEFT) { 

						$(this.windowframe).css({ transform: "translate(" + m + "px," + m + "px)", transition: "0s" });

					}
                   
					if ((this.defaults.position & $.desktopWindows.TOPRIGHT) == $.desktopWindows.TOPRIGHT) { 
											
						$(this.windowframe).css({ transform: "translate(" + r.width - (parseInt(this.windowframe.style.width.replace('px', '')) + (m + 38)) + "px," + m + "px)", transition: "0s" });

					}
                   
					if ((this.defaults.position & $.desktopWindows.BOTTOMLEFT) == $.desktopWindows.BOTTOMLEFT) { 
												
						$(this.windowframe).css({ transform: "translate(" + m + "px," + r.height - (parseInt(this.windowframe.style.height.replace('px', '')) + (m + 20)) + "px)", transition: "0s" });

					}
                   
					if ((this.defaults.position & $.desktopWindows.BOTTOMRIGHT) == $.desktopWindows.BOTTOMRIGHT) { 
												
						$(this.windowframe).css({ transform: "translate(" + r.width - (parseInt(this.windowframe.style.width.replace('px', '')) + (m + 38)) + "px," + r.height - (parseInt(this.windowframe.style.height.replace('px', '')) + (m + 20)) + "px)", transition: "0s" });

					}
                    
					if ((this.defaults.position & $.desktopWindows.CENTER) == $.desktopWindows.CENTER) { 
												
						$(this.windowframe).css({ transform: "translate(" + ((r.width / 2) - (parseInt(this.windowframe.style.width.replace('px', '')) / 2)) + "px," + ((r.height / 2) - (parseInt(this.windowframe.style.height.replace('px', '')) / 2)) + "px)", transition: "0s" });

					}
                
				}

                if ((this.defaults.position & $.desktopWindows.STATIC) != $.desktopWindows.STATIC) {
                    
					var ca = new $.inQuiry.cookie.create('desktopWindows_' + this.windowframe.id, null);
                   
					if (ca.read() == null) {
                        
						ca = new $.inQuiry.cookie.create('desktopWindows_' + this.windowframe.id, 365);

						var pos = $(this.windowframe).cssTranslateValues();

                        ca.keys.add(new $.inQuiry.cookie.item('x', pos.x + "px"));

                        ca.keys.add(new $.inQuiry.cookie.item('y', pos.y + "px"));

                        ca.keys.add(new $.inQuiry.cookie.item('w', this.windowframe.style.width));

                        ca.keys.add(new $.inQuiry.cookie.item('h', this.windowframe.style.height));

                        ca.save();

                    } else {
                       
						var deskW = $.desktopWindows.desktop.width();

                        var deskH = $.desktopWindows.desktop.height();

                        var winX = parseInt(ca.key('x').replace("px", ""));

                        var winY = parseInt(ca.key('y').replace("px", ""));
                        
						if (winX < 0) { 

							winX = 0;

						 }

                        if (winY < 0) { 

							winY = 0; 

						}

                        if (winX > deskW) { 

							winX = 0; 

						}

                        if (winY > deskH) { 

							winY = 0;

						}
						
						$(this.windowframe).css({ transform: "translate(" + winX + "px," + winY + "px)", transition: "0s" });

                        this.windowframe.style.width = ca.key('w');

                        this.windowframe.style.height = ca.key('h');

                    }
                }

				$(this.btnClose).on("click", function (evt) { 
					
					var id = this.id.substring(this.id.indexOf('_') + 1); 

					id = id.substring(0, id.indexOf('_')); 

					$.desktopWindows.close(id); 

				});

				if (this.defaults.onmaximize != null) { 
					
					$(this.btnMaximize).on("click", function (evt) { 
						
						var id = this.id.substring(this.id.indexOf('_') + 1); 
						
						var p = $.desktopWindows._getparms(id.substring(0, id.indexOf('_'))); 
						
						$.desktopWindows.maximize_restore(p); 

						if (p.onmaximize != null) { 

							p.onmaximize(p); 

						} 

					}); 

				} 
				else 
				{ 

					this.btnMaximize.style.display = 'none'; 

				}

				if (this.defaults.onminimize != null) {

					$(this.btnMinimize).on("click", function (evt) { 
						
						var id = this.id.substring(this.id.indexOf('_') + 1); 
						
						var p = $.desktopWindows._getparms(id.substring(0, id.indexOf('_'))); 
							
						if(p.defaults.appType == $.desktopWindows.APPNORMAL) {

							if (p.defaults.windowicon != "") { 
									
								$(p.appsbarbutton).stop().css("background-color", $('.theme-base-colors').css("color"))
								.animate({ backgroundColor: $('.theme-base-colors').css("background-color") }, 400, () => {
									$(p.appsbarbutton).animate({ backgroundColor: $('.theme-base-colors').css("color") }, 400, () => {
										$(p.appsbarbutton).animate({ backgroundColor: $('.theme-base-colors').css("background-color") }, 300, () => { 
											$(p.appsbarbutton).removeAttr("style"); 
										}); 
									});
								});

								p.isMinimized = true; 

								$(p.windowframe).fadeOut(200); 

							} 

						}

						if(p.defaults.appType == $.desktopWindows.APPSERVICE) {
							
							$(p.windowframe).fadeOut(200); 

						}

						if(p.defaults.appType == $.desktopWindows.APPSETTING) {
							
							$(p.windowframe).fadeOut(200); 

						}

						if (p.defaults.onminimize != null) { 

							p.defaults.onminimize(p); 

						} 

					}); 

				} 
				else 
				{

					this.btnMinimize.style.display = 'none'; 

				}

				$(this.windowheader).on('contextmenu', function (evt) { 

					evt.preventDefault(); 

					return false; 

				});

				$(this.windowheader).on("mousedown", function (evt) { 
					
					try { 
						
						var id = this.id.substring(this.id.indexOf('_') + 1); 
						
						var p = $.desktopWindows._getparms(id.substring(0, id.indexOf('_'))); 
						
						$.desktopWindows.maxzindex = parseInt($.desktopWindows.maxzindex) + 1; 
						
						$(p.windowframe).css('z-index', $.desktopWindows.maxzindex); 
						
						if (p.defaults.onfocus != null) {

							p.defaults.onfocus(p); 

						} 

					} catch { } 

				});
                    
				$(this.windowcontent).on("mousedown", function (evt) { 
					
					try { 
						
						var id = this.id.substring(this.id.indexOf('_') + 1); 
						
						var p = $.desktopWindows._getparms(id.substring(0, id.indexOf('_'))); 
						
						$.desktopWindows.maxzindex = parseInt($.desktopWindows.maxzindex) + 1; 
						
						$(p.windowframe).css('z-index', $.desktopWindows.maxzindex); 
						
						if (p.defaults.onfocus != null) { 

							p.defaults.onfocus(p);

						} 

					} catch { } 

				});

				if (this.defaults.ondoubleclick != null) { 
					
					$(this.windowheader).on("dblclick", function (evt) { 
						
						var id = this.id.substring(this.id.indexOf('_') + 1); 
						
						var p = $.desktopWindows._getparms(id.substring(0, id.indexOf('_'))); 
						
						$.desktopWindows.maximize_restore(p); 
						
						if (p.defaults.ondoubleclick != null) { 

							p.defaults.ondoubleclick(p); 

						}

					}); 

				}          

				if ((this.defaults.position & $.desktopWindows.NORESIZE) != $.desktopWindows.NORESIZE) { 
					
					$(this.windowframe).resizable("destroy").resizable({ 
						winFormMinHeight: null, 
						winForm: null, 
						start: function (event, ui) { 

							this.winForm = $.desktopWindows._getparms(ui.id.substring(ui.id.indexOf('_') + 1)); 
							
							this.winFormMinHeight = parseInt($(this.winForm.windowframe).css("min-height").replace('px', '')); 
						
						}, 
						resize: function (event, ui) { 
							
							if (ui.clientHeight < this.winFormMinHeight) { 

								return; 

							} 

							var initHeaderHeight = parseInt($(this.winForm.windowheader).css("height").replace('px', ''));
							var initBodyHeight = parseInt($(this.winForm.windowframe).css("height").replace('px', ''));
							var initStatusBarHeight = parseInt($(this.winForm.windowstatusbar).css("height").replace('px', ''));
							
							$(this.winForm.windowcontent).css('height', (initBodyHeight - (initHeaderHeight + initStatusBarHeight)) + 'px');
								
							if (this.winForm.onresize != null) { 

								this.winForm.onresize(this, (initBodyHeight - (initHeaderHeight + initStatusBarHeight))); 

							} 

						}, 
						stop: function (event, ui) { 

							this.winForm = null; 

							this.winFormMinHeight = null; 
						} 
					});

				}
                   
				if ((this.defaults.position & $.desktopWindows.STATIC) != $.desktopWindows.STATIC) { 
				
					$(this.windowframe).draggable("destroy").draggable({ 
						handle: $(this.windowheader), 
						containment: $($.desktopWindows.desktop.element), 
						scroll: false, 
						drag: function (event, ui) { 
							
							var p = $.desktopWindows._getparms(ui.id.substring(ui.id.indexOf('_') + 1)); 
							
							if (p && p.isMaximized) { 
								
								return false; 

							} 

						} 
					});

					this.windowheader.style.cursor = 'default'; 

				}

                if (this.defaults.onminimize != null && this.defaults.windowicon != "") {

					if(this.defaults.appType == $.desktopWindows.APPNORMAL) {

						$($.desktopWindows.appsbar.element).append('<a id="btn_appsbar_' + this.defaults.windowId + '" contextmenu="true" applicationname="' + this.defaults.windowId + '" ui-tooltip="' + this.defaults.windowId + '" class="desktop-appsbar-icon" href="javascript:void(0);"><img alt="" src="' + this.defaults.windowicon + '" /></a>');

						$("#btn_appsbar_" + this.defaults.windowId).ContextMenu({
							name: "app_" + this.defaults.windowId,
							bindings: [
								{
									command: "Open", 
									iconClass: "fa-solid fa-arrow-up-right-from-square",
									callback: (buttonItem, menuItem) => {

										var windowId = $(menuItem).attr("id").replace('ctxmenu_app_', ''); 
											
										var p = $.desktopWindows._getparms(windowId); 
										
										p.isMinimized = false; 
										
										$.desktopWindows.desktop.element.appendChild(p.windowframe); 
										
										if ((p.position & $.desktopWindows.STATIC) != $.desktopWindows.STATIC) { 
											
											$(p.windowframe).draggable({ 
												containment: $($.desktopWindows.desktop.element) 
											}); 
										
										} 
											
										$(p.windowframe).fadeIn(200); 
										
										$.desktopWindows.maxzindex = parseInt($.desktopWindows.maxzindex) + 1; 
										
										$(p.windowframe).css('z-index', $.desktopWindows.maxzindex); 
																				
										if (p.onrestore != null) { 
		
											p.onrestore(p); 
		
										}

										return;
									}
								},
								{ command: "-br" },
								{
									command: "Minimize", 
									iconClass: "fa-solid fa-minimize",
									callback: (buttonItem, menuItem) => {
										
										var windowId = $(menuItem).attr("id").replace('ctxmenu_app_', ''); 
											
										$("#btn_appsbar_" + windowId).stop().css("background-color", $('.theme-base-colors').css("color"))
										.animate({ backgroundColor: $('.theme-base-colors').css("background-color") }, 400, () => {
											$("#btn_appsbar_" + windowId).animate({ backgroundColor: $('.theme-base-colors').css("color") }, 400, () => {
												$("#btn_appsbar_" + windowId).animate({ backgroundColor: $('.theme-base-colors').css("background-color") }, 300, () => { 
													$("#btn_appsbar_" + windowId).removeAttr("style"); 
												}); 
											});
										});

										var p = $.desktopWindows._getparms(windowId); 

										p.isMinimized = true; 

										$(p.windowframe).fadeOut(200); 

										if (p.onminimize != null) { 

											p.onminimize(p.windowId); 

										} 
									}
					
								},
								{
									command: "Close", 
									iconClass: "fa-solid fa-rectangle-xmark",
									callback: (buttonItem, menuItem) => {
										
										var windowId = $(menuItem).attr("id").replace('ctxmenu_app_', ''); 
										
										$.desktopWindows.close(windowId); 
																			
									}
								},
								{
									command: "Hide", 
									iconClass: "fa-solid fa-compress",
									callback: (buttonItem, menuItem) => {

										if(!$.desktopWindows.taskbar)
										{

											return;

										}

										var windowId = $(menuItem).attr("id").replace('ctxmenu_app_', ''); 
			
										var p = $.desktopWindows._getparms(windowId); 
										
										p.isMinimized = true; 
										
										$(p.windowframe).fadeOut(200); 
										
										$('#btn_appsbar_' + windowId).hide();
										
										$.desktopWindows.serviceappsbox.add({
											id: "btn_taskbar_" + windowId,
											img: p.defaults.windowicon,
											action: () => {
												$.desktopWindows.serviceappsbox.hide();
												$('#btn_appsbar_' + windowId).show();
												$(p.windowframe).fadeIn(200); 
												var button = $("#btn_taskbar_" + windowId);
												$.desktopWindows.serviceappsbox.appLinks = $.grep($.desktopWindows.serviceappsbox.appLinks, h => h != button[0]);
												button.remove(); 
											}
										});

										if (p.defaults.onminimize != null) 
										{ 

											p.defaults.onminimize(p.windowId);

										} 

									}
								}
							]
						});

						$('#btn_appsbar_' + this.defaults.windowId).on("click", function (e) {
						
							var windowId = this.id.replace('btn_appsbar_', '');
							
							var p = $.desktopWindows._getparms(windowId);
							
							if ((p.isMinimized) || ((!p.isMinimized) && ($($.desktopWindows.desktop.element) != $(p.windowframe).parent()))) {
								
								p.isMinimized = false;

								$.desktopWindows.desktop.element.appendChild(p.windowframe);

								if ((p.defaults.position & $.desktopWindows.STATIC) != $.desktopWindows.STATIC) { 
									
									$(p.windowframe).draggable({ 
										containment: $($.desktopWindows.desktop.element) 
									}); 
								
								}
								
								$(p.windowframe).fadeIn(200);

								$.desktopWindows.maxzindex = parseInt($.desktopWindows.maxzindex) + 1;

								$(p.windowframe).css('z-index', $.desktopWindows.maxzindex);

								if (p.defaults.onrestore != null) {

									p.defaults.onrestore(p);

								}


							} else {

								p.isMinimized = true;

								$(p.windowframe).fadeOut(200);

							}

						});
                  
						this.appsbarbutton = $('#btn_appsbar_' + this.defaults.windowId);

						if ($(".desktop-desktop-container").css("left") == "0px") { 

							$('#btn_appsbar_' + this.defaults.windowId).uiToolTip({
								position: $.uiToolTipPos.TOP
							}); 

						} 
						else 
						{ 

							$('#btn_appsbar_' + this.defaults.windowId).uiToolTip({
								position: $.uiToolTipPos.RIGHT
							}); 

						}

					}

					if(this.defaults.appType == $.desktopWindows.APPSERVICE) {

						$.desktopWindows.serviceappsbox.add({
							id: "btn_taskbar_" + this.defaults.windowId,
							img: this.defaults.windowicon,
							action: () => {
								$.desktopWindows.serviceappsbox.hide();
								$(this.windowframe).fadeIn(200); 
							}
						});

					}

					if(this.defaults.appType == $.desktopWindows.APPSETTING) {

						$.desktopWindows.settingsappsbox.add({
							id: "btn_taskbar_" + this.defaults.windowId,
							img: this.defaults.windowicon,
							tooltipContent: this.defaults.applicationName,
							action: () => {
								$.desktopWindows.serviceappsbox.hide();
								$(this.windowframe).fadeIn(200);
							}
						});

					}

				}

				var initHeaderHeight = parseInt($(this.windowheader).css("height").replace('px', ''));
				var initBodyHeight = parseInt($(this.windowframe).css("height").replace('px', ''));
				var initStatusBarHeight = parseInt($(this.windowstatusbar).css("height").replace('px', ''));
                
				$(this.windowcontent).css('height', (initBodyHeight - (initHeaderHeight + initStatusBarHeight)) + 'px');
                
				if (this.defaults.onresize != null) { 

					try { 

						this.defaults.onresize(this, (initBodyHeight - (initHeaderHeight + initStatusBarHeight))); 

					} catch (ex) { } 

				}

                this.windowframe.style.visibility = '';
                
				if (this.defaults.onload != null) { 
					
					try { 

						this.defaults.onload(this); 

					} catch (ex) { } 

				}

            };
			
        },
		getCssAjaxLoader: function() {
			return '<div class="cssload-loader"><div class="cssload-inner cssload-one"></div><div class="cssload-inner cssload-two"></div><div class="cssload-inner cssload-three"></div></div>';
		},		
        maximize_restore: function (p) {
            if (!p.isMaximized) {

				var winform = $(p.windowframe);
				var winformpos = winform.cssTranslateValues();

                p.isMaximized = { 
					X: parseInt(winformpos.x), 
					Y: parseInt(winformpos.y), 
					Width: parseInt(winform.css("width").replace('px', '')), 
					Height: parseInt(winform.css("height").replace('px', '')) 
				};

                var offset = $($.desktopWindows.desktop.element).offset();
				offset.width =  parseInt(window.getComputedStyle($.desktopWindows.desktop.element, null).getPropertyValue("width").replace('px', ''));
				offset.height = parseInt(window.getComputedStyle($.desktopWindows.desktop.element, null).getPropertyValue("height").replace('px', ''));

                winform.css("position", 'fixed');

				winform.css({ transform: "translate(" + offset.left + "px," + offset.top + "px)", transition: "0s" });

                winform.css("width", (offset.width - offset.left - (parseInt(winform.css("padding-left").replace('px', '')) * 2)) + 'px');
                winform.css("height", (offset.height - offset.top - (parseInt(winform.css("padding-left").replace('px', '')) * 2)) + 'px');
				
				var initHeaderHeight = parseInt($(p.windowheader).css("height").replace('px', ''));
				var initBodyHeight = parseInt(winform.css("height").replace('px', ''));
				var initStatusBarHeight = parseInt($(p.windowstatusbar).css("height").replace('px', ''));
                
				$(p.windowcontent).css('height', (initBodyHeight - (initHeaderHeight + initStatusBarHeight)) + 'px');

                winform.resizable('disable');

                winform.draggable('disable');

            } else {

                $(p.windowframe).css("position", 'absolute');

				$(p.windowframe).css({ transform: "translate(" + p.isMaximized.X + "px," + p.isMaximized.Y + "px)", transition: "0s" });

                $(p.windowframe).css("width", p.isMaximized.Width + 'px');

                $(p.windowframe).css("height", p.isMaximized.Height + 'px');

				var initHeaderHeight = parseInt($(p.windowheader).css("height").replace('px', ''));
				var initBodyHeight = parseInt($(p.windowframe).css("height").replace('px', ''));
				var initStatusBarHeight = parseInt($(p.windowstatusbar).css("height").replace('px', ''));
                
				$(p.windowcontent).css('height', (initBodyHeight - (initHeaderHeight + initStatusBarHeight)) + 'px');

                $(p.windowframe).resizable('enable');

                $(p.windowframe).draggable('enable');

                p.isMaximized = null;

            }
        },
        closeAll: function () {

            for (var i = 0; i < $.desktopWindows.openwindows.length; i++) {
                
				try {

					var winForm = $.desktopWindows.openwindows[i];

                    winForm.defaults.onload = null;

                    winForm.defaults.onclose = null;

                    winForm.defaults.onresize = null;

                    winForm.defaults.ondoubleclick = null;

                    winForm.defaults.onfocus = null;

                    winForm.defaults.onmaximize = null;

                    if (winForm.defaults.onminimize != null && winForm.defaults.windowicon != null) {

                        $(winForm.defaults.windowId).ContextMenuDestroy();

						if(winForm.defaults.appType == $.desktopWindows.APPNORMAL) {
							
							if($('#btn_appsbar_' + winForm.defaults.windowId)[0].uiToolTip)
							{

								delete ( $('#btn_appsbar_' + winForm.defaults.windowId)[0].uiToolTip );
							
							}

							$(winForm.appsbarbutton).remove();

						}

						if(winForm.defaults.appType == $.desktopWindows.APPSERVICE) {
							
							var serviceButton = $.desktopWindows.serviceappsbox.element.find("#btn_taskbar_" + winForm.defaults.windowId);

							$.desktopWindows.serviceappsbox.appLinks = $.grep($.desktopWindows.serviceappsbox.appLinks, h => h != serviceButton[0])

							serviceButton.remove();

						}

						if(winForm.defaults.appType == $.desktopWindows.APPSETTING) {

							var settingButton = $.desktopWindows.settingsappsbox.element.find("#btn_taskbar_" + winForm.defaults.windowId);

							$.desktopWindows.settingsappsbox.appLinks = $.grep($.desktopWindows.settingsappsbox.appLinks, h => h != settingButton[0])

							settingButton.remove();

						}

                    }

                    winForm.defaults.onminimize = null;

					$("#" + winForm.defaults.windowId).remove();

                    delete ( $.desktopWindows.openwindows[i] );

                    $.desktopWindows.openwindows.splice(i, 1);

                } catch (sd) { }
            }

            if ($.desktopWindows.openwindows.length <= 0) { 

				$.desktopWindows.maxzindex = 2147480000;

			}

        },
        close: function (windowId) {
           
			var p = $.desktopWindows._getparms(windowId);
          
			if (p == null) { 
				
				return; 
			
			}
           
			var binds = $.desktopWindows._getshieldbound();
           
			if (binds <= 1) { 
				
				$.desktopWindows.shield.hide(); 
			
			} else { 
				
				$.desktopWindows.shield.element.style.zIndex = $.desktopWindows.shield.element.style.zIndex - 1; 
			
			}
           
			var ca = new $.inQuiry.cookie.create('desktopWindows_' + p.windowframe.id, null);
          
			if (ca.read() != null) {

                ca.remove();

            }

            ca = new $.inQuiry.cookie.create('desktopWindows_' + p.windowframe.id, 365);
						
			var pos = $(p.windowframe).cssTranslateValues();

			ca.keys.add(new $.inQuiry.cookie.item('x', pos.x + "px"));

			ca.keys.add(new $.inQuiry.cookie.item('y', pos.y + "px"));

            ca.keys.add(new $.inQuiry.cookie.item('w', document.getElementById(p.windowframe.id).style.width));

            ca.keys.add(new $.inQuiry.cookie.item('h', document.getElementById(p.windowframe.id).style.height));

            ca.save();
			
			if (p.defaults.onclose != null) { 
				
				try { 
					
					p.defaults.onclose(p); 
				
				} catch (ex) { } 
			
			}

            $.desktopWindows._remove(windowId);

        },
        setcontent: function (content) {
            
			var $inquiry = $(content);

			var windowTitle = $inquiry.attr('window-title');
            var windowId = $inquiry.attr('window-id');
            var isScroll = $inquiry.attr('window-scroll');
            
			if ((windowId == null) || (windowId == '')) {
                
				alert('System Exception: Could not find the window for this content. \r\nPlease make sure the first element has the correct windowTitle and windowId attributes.');
                
				return null;

            }
            
			if (windowTitle == null || windowTitle == '') { 

				windowTitle = 'Unknown'; 

			}
            
			var p = $.desktopWindows._getparms(windowId);
            
			p.windowcontent.innerHTML = content;
            
			p.windowtitle.innerHTML = windowTitle;
            
			p.windowcontent.firstChild.className = "window-content-position " + p.windowcontent.firstChild.className;
            
			if (isScroll == "true") {

				$(p.windowcontent).css("overflow-y", "scroll");

				$(p.windowcontent.firstChild).css("width", "auto"); 

				$(p.windowcontent.firstChild).css("width", "");
            
			}
            
			if (p.defaults.onminimize != null && p.icon != null) {
                
				$('#btn_appsbar_' + p.defaults.windowId).attr("ui-tooltip", windowTitle);
              
				$('#btn_appsbar_' + p.defaults.windowId)[0].uiToolTip.content = windowTitle;
            
			}

            return p;

        },
        _getshieldbound: function () {
            var count = 0;

            for (var i = 0; i < $.desktopWindows.openwindows.length; i++) {
                
				if ($.desktopWindows.openwindows[i].defaults.shield === true) {

                    count++;

                }

            }

            return count;

        },
        _getparms: function (windowId) {


			var selected = $.desktopWindows.openwindows.filter(e => e.defaults.windowId == windowId)[0];

			if( selected != null )
			{

				return selected;

			}

            return null;

        },
        _remove: function (windowId) {
            

			var selected = $.desktopWindows.openwindows.filter(e => e.defaults.windowId == windowId)[0];

			if(!selected || selected == null)
			{

				return false;

			}

			$("#window_" + windowId).fadeOut(200, (evt) => {

				try {
					
					selected.defaults.onload = null;
					
					selected.defaults.onclose = null;
					
					selected.defaults.onresize = null;
					
					selected.defaults.ondoubleclick = null;
					
					selected.defaults.onfocus = null;
					
					selected.defaults.onmaximize = null;
					
					if (selected.defaults.onminimize != null && selected.defaults.windowicon != null) {
						
						$("#window_" + windowId).ContextMenuDestroy(); 
						
						if(selected.defaults.appType == $.desktopWindows.APPNORMAL) {

							$(selected.appsbarbutton).remove();

						}

						if(selected.defaults.appType == $.desktopWindows.APPSERVICE) {
							
							var serviceButton = $.desktopWindows.serviceappsbox.element.find("#btn_taskbar_" + selected.defaults.windowId);

							$.desktopWindows.serviceappsbox.appLinks = $.grep($.desktopWindows.serviceappsbox.appLinks, h => h != serviceButton[0])

							serviceButton.remove();

						}

						if(selected.defaults.appType == $.desktopWindows.APPSETTING) {

							var settingButton = $.desktopWindows.settingsappsbox.element.find("#btn_taskbar_" + selected.defaults.windowId);

							$.desktopWindows.settingsappsbox.settingLinks = $.grep($.desktopWindows.settingsappsbox.settingLinks, h => h != settingButton[0])

							settingButton.remove();

						}

					}

					selected.onminimize = null;

					$("#window_" + windowId).remove();

					$.desktopWindows.openwindows = $.grep($.desktopWindows.openwindows, (item, idx) => {
						return item.defaults.windowId != windowId;
					});

					if ($.desktopWindows.openwindows.length <= 0) 
					{ 
				
						$.desktopWindows.maxzindex = 2147480000; 

					}


				} catch (sd) { }

			});

			return true;

        },
		dialogBox: function(options) {

			var defaults = {
				title: "",
				width: 500,
				height: 375,
				shield: true,
				onload: (parms) => {},
				onclose: (parms) => {}
			};
	
			options = $.extend({}, defaults, options);

			return new $.desktopWindows.window({
                windowId: 'dialog' + options.title.replaceAll(" ", "").toLowerCase(),
                applicationName: options.title,
                width: options.width,
                height: options.height,
                position: $.desktopWindows.CENTER | $.desktopWindows.NORESIZE | $.desktopWindows.STATIC,
                margin: 100,
                shield: options.shield,
                onload: parms => { 
					$(parms.windowtitle).text(parms.defaults.applicationName);
					$($(parms.windowcontent)[0].firstChild).remove();
					options.onload(parms);
				},
                onclose: parms => { 
					options.onclose(parms);
				 },
            }).load();

		},
		messageBox: function(options) {

			var defaults = {
				title: "",
				message: "",
				width: 500,
				height: 375,
				shield: true,
				onOk: () => {},
				onCancel: () => {}
			};
	
			options = $.extend({}, defaults, options);

			return new $.desktopWindows.window({
                windowId: 'dialog' + options.title.replaceAll(" ", "").toLowerCase(),
                applicationName: options.title,
                width: options.width,
                height: options.height,
                position: $.desktopWindows.CENTER | $.desktopWindows.NORESIZE | $.desktopWindows.STATIC,
                margin: 100,
                shield: options.shield,
                onload: parms => { 

					$(parms.windowtitle).text(options.title);

					$($(parms.windowcontent)[0].firstChild).remove();

					var a = $("<div />", {
						id: "dialog-messagebox-container",
						class: "dialog-messagebox-container"
					});

					var b = $("<div />", {
						id: "dialog-messagebox-content",
						class: "dialog-messagebox-content",
						html: options.message
					});

					a.append(b); 

					$(parms.windowcontent).append(a);
					
					if (options.onOk != null) 
					{

						var c = $("<a />", {
							id: "dialog-messagebox-btncallok",
							class: "dialog-messagebox-btncallok",
							href: "javascript:void(0);",
							html: "Ok"
						});

						c.on("click", (evt) => {

							options.onOk(evt);

						});

						a.append(c);

						c[0].focus();

					}

					if (options.onCancel != null) 
					{

						var d = $("<a />", {
							id: "dialog-messagebox-callcancel",
							class: "dialog-messagebox-callcancel",
							href: "javascript:void(0);",
							html: "Cancel"
						});

						d.on("click", (evt) => {

							options.onCancel(evt);

							$.desktopWindows.close(parms.defaults.windowId);

						});

						a.append(d);

					}

					$(parms.windowcontent).on('contextmenu', (e) => {

						e.preventDefault(); 

						return false; 

					});

				},
                onclose: parms => { 
					options.onCancel();
				},
            }).load();

		},
	}

	$.fn.clock = function (options) { 
        
		var defaults = { 
			type: '24hour' 
		}; 

        options = $.extend({}, defaults, options);

		clocktick(this, options); 
		
		setInterval(() => { 

			clocktick(this, options); 

		}, 1000);

    };

    $.fn.clockdate = function () { 
        		
		clockdatetick(this); 

        setInterval(() => { 

			clockdatetick(this); 

		}, 1000);
    };

    var clocktick = function (iqu, options) {
        
		var defaults = { 
			type: '24hour' 
		}; 

        options = $.extend({}, defaults, options);

		var now = new Date(); 

		var hours = now.getHours(); 

		var minutes = now.getMinutes();

		var timeOfDay = "PM";
        
		if (hours < 12) { 

			timeOfDay = "AM"; 
	
		} 
		
		if (hours < 10) { 
			
			hours = "0" + hours; 
		
		} 
		
		if (minutes < 10) { 
			
			minutes = "0" + minutes; 
		
		}
        
		if (options.type == '24hour') { 
			
			iqu.html(hours + ":" + minutes); 
		
		} else { 

			hours = ( hours > 12 ) ? hours - 12 : hours; 

			iqu.html(hours + ":" + minutes + " " + timeOfDay);
		
		}
    
	};

    var clockdatetick = function (iqu) {
       		
		var now = new Date(); 

		var nowdate = now.toDateString();
       		
		iqu.html(nowdate.replace(now.getFullYear(), ''));
    };

    $.fn.desktopWindow = function(options)
	{

		var defaults = {
			desktopTitle: "Windows Desktop",
			desktopSwtichAnimation: false,
			desktopBootLoaderShow: false,
			deskTopClock: false,
			deskTopClock24Hour: false,
			deskTopDate: false,
			deskTopCount: 1,
			onDesktopSelected: () => {},
			desktopOnClick: () => {},
			appsBarOnClick: () => {},
			taskBarOnClick: () => {},
			calendarOnClick: (evt) => { },
			onRenderd: () => {}
		};

        options = $.extend({}, defaults, options);
		
		$("html").css("overflow", "hidden");
		$("body").css("overflow", "hidden");

		//Set the environment element.
		var environment = $(this[0]);

		//Lets add the basics for the desktop
		environment.append($("<div />", { id: "desktop-wallpaper", class: "desktop-wallpaper" }));
		environment.append($("<div />", { id: "desktop-shield", class: "desktop-shield" }));
		environment.append($("<div />", { id: "desktop-container", class: "desktop-container" }));
		environment.append($("<div />", { id: "desktop-bootbox", class: "desktop-bootbox", style: "display:none;" }));

		//if loader then show it.
		if(options.desktopBootLoaderShow) { 

			$("#desktop-bootbox").show(); 

		}

		//Lets add the loader css content to the bootbox
		$("#desktop-bootbox").html('<div class="window-content-loading">' + $.desktopWindows.getCssAjaxLoader() + '</div>');

		//Lets add the taskbar and default interactive elements.
		var tb = $("<div />", { id: "desktop-taskbar", class: "desktop-taskbar" });      
		tb.append($("<a class=\"desktop-taskbar-title\">" + options.desktopTitle  + "</a>"));
		tb.append($("<a />", { id: "btn_taskbar_settings",class: "desktop-taskbar-icon desktop-taskbar-icon-settings", href: "javascript:void(0);" }));
		tb.append($("<a />", { id: "btn_taskbar_services",class: "desktop-taskbar-icon desktop-taskbar-icon-services", href: "javascript:void(0);" }));
		if(options.deskTopClock) {
			tb.append($("<a />", { id: "btn_taskbar_clock",class: "desktop-taskbar-text", href: "javascript:void(0);" }));
		}
		if(options.deskTopDate) {
			tb.append($("<a />", { id: "btn_taskbar_calendar",class: "desktop-taskbar-text", href: "javascript:void(0);" }));
		}
		tb.append($("<span class=\"desktop-taskbar-break\">|</span>"));

		if(options.deskTopCount > 1) {

			for(var i = options.deskTopCount; i > 0; i--)
			{
				tb.append($("<a />", { id: "btn_taskbar_desktopswtich" + i, class: "desktop-taskbar-icon desktop-taskbar-icon-number", "data-index": i, href: "javascript:void(0);" }));
			}

			tb.append($("<span class=\"desktop-taskbar-break\">|</span>"));
		
		}

		environment.append(tb);

		//Start the taskbar clock and date
		if(options.deskTopClock) {
			$('#btn_taskbar_clock').clock({ 
				type: (options.deskTopClock24Hour == true ? '24hour' : '12hour')
			});
		}
		if(options.deskTopDate) {
			$('#btn_taskbar_calendar').clockdate();
		}

		//Lets setup the apps bar and create the default start button.
		$.desktopWindows.appsbar = new $.desktopWindows.setUpAppsBar(environment);

		//Lets add the desktops in the container and show the default 0.
		var dts = $("<div />", { id: "desktop-desktops", class: "desktop-desktop-container" });
		
		for(var i = options.deskTopCount; i > 0; i--)
		{
			var defaultCss = "display:none;";
			if(i == 1) { defaultCss = "display:block;"; }
			dts.append($("<div />", { id: "desktop" + (i - 1), class: "desktop-desktop", style: defaultCss }));	
		}

		environment.append(dts);

		//Setup the the service apps hidden icons box for apps that can not close.
		$.desktopWindows.serviceappsbox = new $.desktopWindows.setUpServiceAppsBox(environment);
		
		//Setup the settings apps box for apps that are part of the system.
		$.desktopWindows.settingsappsbox = new $.desktopWindows.setUpSettingsAppsBox(environment);

		//Setup the elements for the current desktop, shield and taskbar.
		$.desktopWindows.shield = new $.desktopWindows.setUpShield('#desktop-shield', '#202020', 50);
		$.desktopWindows.taskbar = new $.desktopWindows.setUpTaskBar('#desktop-taskbar');
		$.desktopWindows.desktop = new $.desktopWindows.setUpDesktop('#desktop0');
		
		//Allow the clock / calendar to be clickable
		$('#btn_taskbar_clock').on("click", (evt) => { options.calendarOnClick(evt) });
		$('#btn_taskbar_calendar').on("click", (evt) => { options.calendarOnClick(evt) });

		//Add the hidden element holding the theme base from css for js to access.
		$("body").prepend($("<div />", { class: "theme-base-colors" }));

		//Lets make the desktop interactive
		$('.desktop-desktop').on("click", (e) => {
			if(e.currentTarget != e.target) { return; }
			$.desktopWindows.desktop.appsbarSelectedApp = '';
			options.desktopOnClick(e);
		});

		$('#desktop-appsbar').on("click", (e) => {
			if(e.currentTarget != e.target) { return; }
			$.desktopWindows.desktop.appsbarSelectedApp = '';
			options.appsBarOnClick(e);
		});

		$('#desktop-taskbar').on("click", (e) => {
			if(e.currentTarget != e.target) { return; }
			$.desktopWindows.desktop.appsbarSelectedApp = '';
			options.taskBarOnClick(e);
		});
		
		$('#desktop-taskbar').on('contextmenu', function (e) {
			e.preventDefault();
			$.desktopWindows.desktop.appsbarSelectedApp = '';
			return false;
		});

		$('#desktop-appsbar').on('contextmenu', function (e) {
			e.preventDefault(); 

			var isValid = (e.target.offsetParent.id ? true : false);
			
			if (!isValid) { 

				return false; 

			}

			isValid = $('#' + e.target.offsetParent.id).attr("contextmenu"); 
			
			if (isValid == "false") { 

				return false; 

			}
			
			$.desktopWindows.desktop.appsbarSelectedApp = $('#' + e.target.offsetParent.id).attr("applicationname");

			return false;

		});

		//Preset the current selected desktop
		$('#btn_taskbar_desktopswtich1').addClass("desktop-taskbar-icon-selected");
		
		//Setup the animation if enabled for the desktop switching.
		if(options.desktopSwtichAnimation && options.deskTopCount > 1)
		{					
			if(window.gsap) 
			{
				for(var i = options.deskTopCount; i > 0; i--)
				{
					$('#btn_taskbar_desktopswtich' + i).hover(function (evt) {
						var selectedDesktopId = parseInt(evt.target.id.replace("btn_taskbar_desktopswtich", ""));
						for(var b = options.deskTopCount; b > 0; b--) {
							if(b != selectedDesktopId) { $("#desktop" + (b - 1)).stop().css("opacity", "").hide(); }
						}
						gsap.timeline().to($('#desktop' + (selectedDesktopId - 1)), .3, { scaleX: .5, scaleY: .5, rotation: 15, 
							onStart: function () { 
								$('#desktop'+ (selectedDesktopId - 1)).css("border", "2px solid " + $('.theme-base-colors').css("color")); 
								if ($.desktopWindows.desktop.element != $('#desktop'+ (selectedDesktopId - 1))[0]) { $('#desktop'+ (selectedDesktopId - 1)).show(); }
							} 
						});

					}, function (evt) {
						var selectedDesktopId = parseInt(evt.target.id.replace("btn_taskbar_desktopswtich", ""));
						$($.desktopWindows.desktop.element).fadeIn(10);
						gsap.timeline().to($('#desktop' + (selectedDesktopId - 1)), .3, { scaleX: 1, scaleY: 1, rotation: 0, 
							onStart: function () { 
								if ($.desktopWindows.desktop.element != $('#desktop' + (selectedDesktopId - 1))[0]) { $('#desktop' + (selectedDesktopId - 1)).hide(); }
							},
							onComplete: function () { 
								$('#desktop' + (selectedDesktopId - 1)).css("border", ""); $('#desktop' + (selectedDesktopId - 1)).css("transform", ""); 
							} 
						});
					});
				}
			}
		}
		//Lets make the desktop switching work based on the selected one.
		var desktopSwitch = (idx) => {

			for(var i = options.deskTopCount; i > 0; i--) {
				if(idx != (i - 1)) {
					$("#desktop" + (i - 1)).stop().css("opacity", "").hide();
				}
			}

			$.desktopWindows.desktop.element = $("#desktop" + idx)[0];

			for(var i = options.deskTopCount; i > 0; i--) {
				$('#btn_taskbar_desktopswtich' + i).removeClass("desktop-taskbar-icon-selected");		
			}

			$('#btn_taskbar_desktopswtich' + (idx == "0" ? "1" : (parseInt(idx) + 1))).addClass("desktop-taskbar-icon-selected");

			$("#desktop" + idx).fadeIn(100); 

		};

		for(var i = options.deskTopCount; i > 0; i--) {

			$('#btn_taskbar_desktopswtich' + i).on("click", (evt) => { 
				var selectedDesktopId = parseInt(evt.target.id.replace("btn_taskbar_desktopswtich", ""));
				desktopSwitch((selectedDesktopId - 1))
				options.onDesktopSelected($("#desktop" + (selectedDesktopId - 1))); 
			});

		}

		//Setup the desktop resizing event when the browser is resized
		$(window).on("resize", (e) => { 
			if ((e.target.id == 'undefined') || (e.target.id == null)) { 
				$.desktopWindows.shield.resize(); 
			} 
		});	

		//Finally if the boot box is enabled, we will hide it.
		if(options.desktopBootLoaderShow) { 
			setTimeout(() => { 
				$("#desktop-bootbox").fadeOut(500, () => {
					 $("#desktop-bootbox").hide(); 
				}); 
			}, 1000);	
		}

		options.onRenderd($.desktopWindows);

	};

})(jQuery);